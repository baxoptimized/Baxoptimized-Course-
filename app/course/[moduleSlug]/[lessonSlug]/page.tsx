import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { preprocessMdx } from "@/lib/preprocessMdx";
import { mdxComponents } from "@/components/mdx";
import { LessonLayout } from "@/components/lesson/LessonLayout";
import { MarkCompleteButton } from "@/components/lesson/MarkCompleteButton";
import LogoutButton from "@/components/LogoutButton";
import { markLessonComplete } from "./actions";

// ── Types ─────────────────────────────────────────────────────────────────────

type LessonRow = {
  id: string;
  title: string;
  content_mdx: string;
  order_index: number;
  slug: string;
  module_id: string;
  module_title: string;
  module_slug: string;
  is_staff_only: boolean;
  hard_gate: boolean;
};

type SiblingLesson = {
  id: string;
  title: string;
  slug: string;
  order_index: number;
  is_complete: boolean;
};

// ── URL helpers ───────────────────────────────────────────────────────────────

/**
 * DB lesson slugs are  "moduleSlug--lessonPart".
 * URL [lessonSlug] param carries only  "lessonPart".
 */
function lessonUrlPart(dbSlug: string, moduleSlug: string): string {
  const prefix = moduleSlug + "--";
  return dbSlug.startsWith(prefix) ? dbSlug.slice(prefix.length) : dbSlug;
}

function lessonPath(moduleSlug: string, dbSlug: string): string {
  return `/course/${moduleSlug}/${lessonUrlPart(dbSlug, moduleSlug)}`;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({
  moduleTitle,
  currentId,
  lessons,
  moduleSlug,
}: {
  moduleTitle: string;
  currentId: string;
  lessons: SiblingLesson[];
  moduleSlug: string;
}) {
  const doneCount = lessons.filter((l) => l.is_complete).length;
  const currentIdx = lessons.findIndex((l) => l.id === currentId);
  const lessonNum = currentIdx + 1;

  return (
    <div className="flex flex-col h-full">
      {/* Module header */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid var(--color-navy-700)" }}>
        <p
          className="mb-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--color-gold)" }}
        >
          {moduleTitle}
        </p>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Lesson{" "}
          <span style={{ color: "var(--color-text-secondary)" }}>
            {lessonNum} of {lessons.length}
          </span>
          {doneCount > 0 && (
            <> · <span style={{ color: "var(--color-success)" }}>{doneCount} done</span></>
          )}
        </p>
      </div>

      {/* Lesson list */}
      <nav className="flex-1 overflow-y-auto py-3" aria-label="Lessons in this module">
        {lessons.map((l, i) => {
          const isCurrent = l.id === currentId;
          const href = lessonPath(moduleSlug, l.slug);

          return (
            <a
              key={l.id}
              href={href}
              aria-current={isCurrent ? "page" : undefined}
              className={`lesson-sidebar-link flex items-start gap-3 px-4 py-2.5 text-xs leading-snug${isCurrent ? " lesson-sidebar-link--active" : ""}`}
              style={{
                textDecoration: "none",
                background: isCurrent ? "rgba(79,124,247,0.10)" : undefined,
                borderLeft: isCurrent
                  ? "2px solid var(--color-accent)"
                  : "2px solid transparent",
                color: isCurrent
                  ? "var(--color-text-primary)"
                  : l.is_complete
                  ? "var(--color-text-secondary)"
                  : "var(--color-text-muted)",
              }}
            >
              {/* Status icon */}
              <span className="mt-0.5 shrink-0 w-4 flex justify-center">
                {l.is_complete ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="6" fill="var(--color-success)" fillOpacity="0.2" stroke="var(--color-success)" strokeWidth="1" />
                    <path d="M3.5 6.5l2 2 4-4" stroke="var(--color-success)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : isCurrent ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="6" fill="var(--color-accent)" fillOpacity="0.2" stroke="var(--color-accent)" strokeWidth="1" />
                    <circle cx="6.5" cy="6.5" r="2.5" fill="var(--color-accent)" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="6" stroke="var(--color-navy-600)" strokeWidth="1" />
                  </svg>
                )}
              </span>

              {/* Lesson number + title */}
              <span className="flex-1">
                <span
                  className="mr-1.5 tabular-nums"
                  style={{ color: "var(--color-text-muted)", fontSize: "10px" }}
                >
                  {i + 1}.
                </span>
                {l.title}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Back link */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid var(--color-navy-700)" }}>
        <a
          href="/course"
          className="text-xs transition-colors"
          style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
        >
          ← All modules
        </a>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { moduleSlug, lessonSlug } = await params;
  const fullLessonSlug = `${moduleSlug}--${lessonSlug}`;

  // ── 1. Fetch the current lesson ─────────────────────────────────────────
  const [lessonRaw, lockRaw] = await Promise.all([
    sql`
      SELECT
        l.id, l.title, l.content_mdx, l.order_index, l.slug,
        m.id           AS module_id,
        m.title        AS module_title,
        m.slug         AS module_slug,
        m.is_staff_only,
        m.hard_gate
      FROM lessons l
      JOIN modules m ON m.id = l.module_id
      WHERE m.slug = ${moduleSlug}
        AND (l.slug = ${fullLessonSlug} OR l.slug = ${lessonSlug})
      LIMIT 1
    `,
    // Check if the previous module (by order_index) has a quiz the user hasn't passed
    sql`
      WITH prev AS (
        SELECT id FROM modules
        WHERE order_index < (SELECT order_index FROM modules WHERE slug = ${moduleSlug})
        ORDER BY order_index DESC
        LIMIT 1
      )
      SELECT
        (COUNT(qq.id) > 0)::bool  AS prev_has_quiz,
        (COUNT(qa.id) > 0)::bool  AS prev_quiz_passed
      FROM prev
      LEFT JOIN quiz_questions qq ON qq.module_id = prev.id
      LEFT JOIN quiz_attempts  qa ON qa.module_id = prev.id
                                  AND qa.user_id  = ${user.userId}
                                  AND qa.passed   = true
    `,
  ]);
  const lessonRows = lessonRaw  as unknown as LessonRow[];
  const lockRows   = lockRaw    as unknown as { prev_has_quiz: boolean; prev_quiz_passed: boolean }[];

  if (!lessonRows.length) notFound();
  const lesson = lessonRows[0];

  // Guard: staff-only module requires staff/admin role
  if (lesson.is_staff_only && user.role === "student") redirect("/course");

  // Guard: module lock (previous module's quiz not passed)
  const lock = lockRows[0];
  if (lock?.prev_has_quiz && !lock?.prev_quiz_passed && user.role !== "admin") {
    redirect("/course");
  }

  // ── 2. Fetch siblings + completion + quiz presence ───────────────────────
  const [siblingsRaw, quizRaw] = await Promise.all([
    sql`
      SELECT
        l.id, l.title, l.slug, l.order_index,
        (p.lesson_id IS NOT NULL)::bool AS is_complete
      FROM lessons l
      LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = ${user.userId}
      WHERE l.module_id = ${lesson.module_id}
      ORDER BY l.order_index
    `,
    sql`
      SELECT COUNT(*)::int AS cnt
      FROM quiz_questions
      WHERE module_id = ${lesson.module_id}
    `,
  ]);
  const siblings     = siblingsRaw  as unknown as SiblingLesson[];
  const quizCountRaw = quizRaw      as unknown as { cnt: number }[];
  const hasQuiz      = (quizCountRaw[0]?.cnt ?? 0) > 0;
  const currentIdx = siblings.findIndex((l) => l.id === lesson.id);
  const nextSibling = siblings[currentIdx + 1] ?? null;
  const prevSibling = siblings[currentIdx - 1] ?? null;
  const isLastLesson = currentIdx === siblings.length - 1;
  const isAlreadyComplete = siblings[currentIdx]?.is_complete ?? false;

  // ── 3. Determine CTA ─────────────────────────────────────────────────────
  let ctaLabel: string;
  let ctaVariant: "primary" | "quiz";
  let ctaNextUrl: string;

  if (isLastLesson && hasQuiz) {
    ctaLabel   = "Take the quiz →";
    ctaVariant = "quiz";
    ctaNextUrl = `/course/${moduleSlug}/quiz`;
  } else if (isLastLesson && lesson.hard_gate && !hasQuiz) {
    const isCapstone = moduleSlug === "module-15-capstone";
    ctaLabel   = isCapstone ? "Submit capstone →" : "Submit project →";
    ctaVariant = "quiz";
    ctaNextUrl = isCapstone
      ? `/course/${moduleSlug}/capstone`
      : `/course/${moduleSlug}/checkpoint`;
  } else if (nextSibling) {
    ctaLabel   = isAlreadyComplete ? "Next lesson →" : "Mark complete →";
    ctaVariant = "primary";
    ctaNextUrl = lessonPath(moduleSlug, nextSibling.slug);
  } else {
    ctaLabel   = isAlreadyComplete ? "Back to course" : "Mark complete";
    ctaVariant = "primary";
    ctaNextUrl = "/course";
  }

  // ── 4. Render ─────────────────────────────────────────────────────────────
  const processedMdx = preprocessMdx(lesson.content_mdx ?? "");

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-navy-950)" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
        style={{
          background:     "rgba(8,15,30,0.90)",
          backdropFilter: "blur(12px)",
          borderBottom:   "1px solid var(--color-navy-700)",
          height:         "49px",
        }}
      >
        <Link
          href="/course"
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--color-gold)", textDecoration: "none" }}
        >
          Baxoptimized
        </Link>
        <div className="flex items-center gap-5">
          {/* Mobile: lesson count */}
          <span
            className="lg:hidden text-xs tabular-nums"
            style={{ color: "var(--color-text-muted)" }}
          >
            {currentIdx + 1} / {siblings.length}
          </span>
          <a
            href="/course"
            className="hidden sm:inline text-xs transition-colors"
            style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
          >
            ← All modules
          </a>
          <LogoutButton />
        </div>
      </header>

      {/* ── Two-column shell (sidebar + content) ────────────────────────── */}
      <LessonLayout
        sidebar={
          <Sidebar
            moduleTitle={lesson.module_title}
            currentId={lesson.id}
            lessons={siblings}
            moduleSlug={moduleSlug}
          />
        }
      >
        {/* Mobile: module breadcrumb + progress */}
        <div
          className="lg:hidden mb-8 flex items-center justify-between"
          aria-hidden="true"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest truncate"
            style={{ color: "var(--color-gold)" }}
          >
            {lesson.module_title}
          </p>
          <span
            className="ml-4 shrink-0 text-xs tabular-nums"
            style={{ color: "var(--color-text-muted)" }}
          >
            Lesson {currentIdx + 1} of {siblings.length}
          </span>
        </div>

        {/* Lesson title */}
        <h1
          className="mb-10 text-3xl font-bold tracking-tight leading-snug"
          style={{ color: "var(--color-text-primary)" }}
        >
          {lesson.title}
        </h1>

        {/* MDX body */}
        <MDXRemote source={processedMdx} components={mdxComponents} />

        {/* ── Footer nav ──────────────────────────────────────────────── */}
        <div
          className="mt-16 flex items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid var(--color-navy-700)" }}
        >
          {/* Prev lesson */}
          {prevSibling ? (
            <a
              href={lessonPath(moduleSlug, prevSibling.slug)}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline max-w-[180px] truncate">{prevSibling.title}</span>
              <span className="sm:hidden">Prev</span>
            </a>
          ) : (
            <a
              href="/course"
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All modules
            </a>
          )}

          {/* CTA */}
          <MarkCompleteButton
            lessonId={lesson.id}
            nextUrl={ctaNextUrl}
            label={ctaLabel}
            variant={ctaVariant}
            action={markLessonComplete}
          />
        </div>

        {/* Already complete note */}
        {isAlreadyComplete && (
          <p
            className="mt-3 text-center text-xs"
            style={{ color: "var(--color-success)" }}
          >
            ✓ You&apos;ve already completed this lesson
          </p>
        )}
      </LessonLayout>
    </div>
  );
}
