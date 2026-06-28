#!/usr/bin/env node
/**
 * Seed course content from /source-content markdown files.
 * Safe to re-run: clears each module's data before re-inserting.
 *
 * Usage: npm run seed-content
 */

import { readdir, readFile } from "fs/promises";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";

// ─── Config ──────────────────────────────────────────────────────────────────

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SOURCE_DIR = join(ROOT, "source-content");
const sql = neon(process.env.DATABASE_URL);

// ─── Filename helpers ─────────────────────────────────────────────────────────

function parseFilename(filename) {
  // module-03.5-claude-system-prompt-setup.md → { number: 3.5, slug: "module-03.5-claude-system-prompt-setup" }
  // operator-module-staff-only.md → { number: null, slug: "operator-module-staff-only" }
  const slug = basename(filename, ".md");
  const m = slug.match(/^module-([\d.]+)-/);
  return { slug, number: m ? parseFloat(m[1]) : null };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Markdown parsing ─────────────────────────────────────────────────────────

function splitSections(lines) {
  // Split on "## " headings. Returns array of { title, lines }.
  const sections = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.slice(3).trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function extractQuizBlock(lines) {
  // If there's a "### Quiz" subsection, return only those lines.
  // Otherwise return all lines.
  const h3Indices = lines
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => l.startsWith("### "));

  if (h3Indices.length === 0) return lines;

  const quizH3 = h3Indices.find(({ l }) => /quiz/i.test(l));
  if (!quizH3) return lines; // no ### Quiz, use whole section

  const start = quizH3.i + 1;
  const nextH3 = h3Indices.find(({ i }) => i > quizH3.i);
  const end = nextH3 ? nextH3.i : lines.length;
  return lines.slice(start, end);
}

function parseQuizQuestions(lines, filename) {
  const questions = [];
  const warnings = [];
  let current = null;

  const flush = () => {
    if (!current) return;
    if (current.options.length === 0) {
      warnings.push(`  ⚠ Q${current.order}: no options found — "${current.text.slice(0, 60)}"`);
      current = null;
      return;
    }

    if (current.correctIndex === -1) {
      // No ✅ found — classify as reflection if it looks like ordering or sample-answer
      const orderingOpt = current.options.find((o) => o.raw.startsWith("Correct:"));
      const sampleOpt = current.options.find((o) => /^Sample answer/i.test(o.raw));

      if (orderingOpt) {
        // Ordering question: strip "Correct:" prefix, store model answer, mark reflection
        orderingOpt.text = orderingOpt.raw.replace(/^Correct:\s*/, "").trim();
        current.type = "reflection";
        current.correctIndex = null;
      } else if (sampleOpt) {
        // Open-ended reflection: strip "Sample answers?:" prefix
        sampleOpt.text = sampleOpt.raw.replace(/^Sample answers?:\s*/i, "").trim();
        current.type = "reflection";
        current.correctIndex = null;
      } else {
        warnings.push(
          `  ⚠ Q${current.order}: no ✅ found and not clearly reflection — stored as open-ended: "${current.text.slice(0, 60)}"`
        );
        current.correctIndex = 0;
      }
    }

    questions.push({
      order: current.order,
      text: current.text,
      type: current.type ?? "multiple_choice",
      options: current.options.map((o) => o.text),
      correctIndex: current.correctIndex ?? null,
    });
    current = null;
  };

  for (const line of lines) {
    // New question: line starts with "N. " or "N. " at column 0
    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (qMatch) {
      flush();
      current = {
        order: parseInt(qMatch[1], 10),
        text: qMatch[2].trim(),
        options: [],
        correctIndex: -1,
        type: "multiple_choice",
      };
      continue;
    }

    // Option line: "   - ..." (indented dash)
    const optMatch = line.match(/^\s{2,}- (.+)/);
    if (optMatch && current) {
      const raw = optMatch[1].trim();
      const isCorrect = raw.includes("✅");
      // Clean text: strip ✅, strip trailing parenthetical like "*(use the course's...)*"
      let text = raw
        .replace(/✅/g, "")
        .replace(/\s*\*\([^)]+\)\*\s*$/, "")
        .trim();
      // Strip leading letter prefix like "a) " or "b) "
      text = text.replace(/^[a-z]\)\s+/, "");
      if (isCorrect) current.correctIndex = current.options.length;
      current.options.push({ raw, text });
      continue;
    }

    // "- True" or "- False" at minimal indent (some files use "- True ✅")
    const tfMatch = line.match(/^- (True|False)(.*)/);
    if (tfMatch && current) {
      const raw = tfMatch[1] + tfMatch[2];
      const isCorrect = raw.includes("✅");
      const text = tfMatch[1];
      if (isCorrect) current.correctIndex = current.options.length;
      current.options.push({ raw, text });
    }
  }
  flush();

  if (warnings.length > 0) {
    console.log(`  Warnings in ${basename(filename)}:`);
    warnings.forEach((w) => console.log(w));
  }

  return questions;
}

function parseModule(content, filename) {
  const lines = content.split("\n");
  const { slug, number } = parseFilename(filename);

  // First # heading is the module title
  const titleLine = lines.find((l) => l.startsWith("# "));
  const title = titleLine ? titleLine.slice(2).trim() : slug;

  // Detect staff-only from filename or title
  const isStaffOnly =
    /staff-only|operator/i.test(slug) ||
    /staff\s+only/i.test(title);

  // order_index: multiply module number by 10 to preserve .5 spacing as integers
  const orderIndex = number !== null ? Math.round(number * 10) : 9990;

  // Skip the # heading line and find ## sections
  const afterH1 = lines.findIndex((l) => l.startsWith("## "));
  const sectionLines = afterH1 >= 0 ? lines.slice(afterH1) : [];
  const sections = splitSections(sectionLines);

  const lessons = [];
  const quizQuestions = [];

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const content = sec.lines.join("\n").trim();
    const lessonSlug = `${slug}--${slugify(sec.title)}`;

    lessons.push({
      title: sec.title,
      slug: lessonSlug,
      content,
      orderIndex: i,
    });

    if (/PROVE IT/i.test(sec.title)) {
      const quizLines = extractQuizBlock(sec.lines);
      const qs = parseQuizQuestions(quizLines, filename);
      quizQuestions.push(...qs);
    }
  }

  return { slug, title, orderIndex, isStaffOnly, lessons, quizQuestions };
}

// ─── Database helpers ─────────────────────────────────────────────────────────

async function upsertModule(mod) {
  // Delete existing module (cascades to lessons, quiz_questions, quiz_attempts, progress)
  await sql`DELETE FROM modules WHERE slug = ${mod.slug}`;

  const rows = await sql`
    INSERT INTO modules (slug, title, order_index, is_staff_only)
    VALUES (${mod.slug}, ${mod.title}, ${mod.orderIndex}, ${mod.isStaffOnly})
    RETURNING id
  `;
  return rows[0].id;
}

async function insertLessons(moduleId, lessons) {
  for (const l of lessons) {
    await sql`
      INSERT INTO lessons (module_id, slug, title, content_mdx, order_index)
      VALUES (${moduleId}, ${l.slug}, ${l.title}, ${l.content}, ${l.orderIndex})
    `;
  }
}

async function insertQuizQuestions(moduleId, questions) {
  for (const q of questions) {
    await sql`
      INSERT INTO quiz_questions (module_id, question_text, options, question_type, correct_answer_index, order_index)
      VALUES (
        ${moduleId},
        ${q.text},
        ${JSON.stringify(q.options)},
        ${q.type},
        ${q.correctIndex},
        ${q.order}
      )
    `;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL not set. Run with --env-file=.env.local");
    process.exit(1);
  }

  const files = (await readdir(SOURCE_DIR))
    .filter((f) => f.endsWith(".md") && !f.startsWith("._"))
    .sort();

  console.log(`\nSeeding ${files.length} files from ${SOURCE_DIR}\n`);

  let totalModules = 0;
  let totalLessons = 0;
  let totalQuestions = 0;
  const parseErrors = [];

  for (const file of files) {
    const filepath = join(SOURCE_DIR, file);
    const content = await readFile(filepath, "utf8");

    let mod;
    try {
      mod = parseModule(content, file);
    } catch (err) {
      parseErrors.push(`${file}: ${err.message}`);
      console.log(`  ✗ SKIP ${file} — parse error: ${err.message}`);
      continue;
    }

    process.stdout.write(`  ${file} … `);

    try {
      const moduleId = await upsertModule(mod);
      await insertLessons(moduleId, mod.lessons);
      await insertQuizQuestions(moduleId, mod.quizQuestions);

      console.log(
        `${mod.lessons.length} lessons, ${mod.quizQuestions.length} quiz Qs` +
          (mod.isStaffOnly ? " [staff-only]" : "")
      );

      totalModules++;
      totalLessons += mod.lessons.length;
      totalQuestions += mod.quizQuestions.length;
    } catch (err) {
      parseErrors.push(`${file}: DB error — ${err.message}`);
      console.log(`DB ERROR: ${err.message}`);
    }
  }

  console.log(`
─────────────────────────────────
  Modules  : ${totalModules}
  Lessons  : ${totalLessons}
  Quiz Qs  : ${totalQuestions}
─────────────────────────────────`);

  if (parseErrors.length > 0) {
    console.log(`\n⚠ ${parseErrors.length} file(s) had problems:`);
    parseErrors.forEach((e) => console.log(`  • ${e}`));
  } else {
    console.log("\n✓ All files seeded cleanly.");
  }
}

main().catch((err) => {
  console.error("\nFatal:", err.message);
  process.exit(1);
});
