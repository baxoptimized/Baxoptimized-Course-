import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { parseModuleTitle } from "@/lib/moduleTitle";
import { CourseNav } from "@/components/course/CourseNav";
import { ModuleCard, type ProcessedModule } from "@/components/course/ModuleCard";
import { CourseRail } from "@/components/course/CourseRail";
import { AssistantWidget } from "@/components/course/AssistantWidget";

// ── Raw DB row type ───────────────────────────────────────────────────────────

type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  is_staff_only: boolean;
  hard_gate: boolean;
  total_lessons: number;
  completed_lessons: number;
  target_lesson_id: string | null;
  target_lesson_slug: string | null;
  quiz_passed: boolean;
  has_quiz: boolean;
  checkpoint_status: "pending" | "approved" | "needs_revision" | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildModules(rows: ModuleRow[], role: string): ProcessedModule[] {
  const visible = rows.filter((m) => role !== "student" || !m.is_staff_only);

  // Lock state must propagate down the *whole* chain, not just from the
  // immediately-preceding module: a gate-less module (no quiz, no
  // hard_gate) is trivially "cleared" and must NOT reset an earlier block
  // back to unlocked for everything after it.
  let chainBlocked = false;

  return visible.map((m, idx) => {
    const isLocked = idx > 0 && chainBlocked;

    let status: ProcessedModule["status"] = "not_started";
    if (isLocked) {
      status = "locked";
    } else if (m.hard_gate && m.checkpoint_status === "pending") {
      status = "pending_review";
    } else if (
      m.total_lessons > 0 &&
      m.completed_lessons >= m.total_lessons &&
      (!m.has_quiz || m.quiz_passed) &&
      (!m.hard_gate || m.checkpoint_status === "approved")
    ) {
      status = "completed";
    } else if (m.completed_lessons > 0) {
      status = "in_progress";
    }

    const cleared = (!m.has_quiz || m.quiz_passed) && (!m.hard_gate || m.checkpoint_status === "approved");
    if (!cleared) chainBlocked = true;

    const { num, cleanTitle } = parseModuleTitle(m.title);
    return { ...m, num, cleanTitle, isLocked, status };
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CoursePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Single query: all module data with per-user progress and quiz state
  const rows = (await sql`
    WITH
      lc AS (
        SELECT
          l.module_id,
          COUNT(*)::int            AS total,
          COUNT(p.lesson_id)::int  AS completed
        FROM lessons l
        LEFT JOIN progress p
               ON p.lesson_id = l.id
              AND p.user_id   = ${user.userId}
        GROUP BY l.module_id
      ),
      fl AS (
        -- First lesson per module (fallback when all lessons done)
        SELECT DISTINCT ON (module_id) module_id, id AS lesson_id, slug AS lesson_slug
        FROM lessons
        ORDER BY module_id, order_index
      ),
      fi AS (
        -- First INCOMPLETE lesson per module
        SELECT DISTINCT ON (l.module_id) l.module_id, l.id AS lesson_id, l.slug AS lesson_slug
        FROM lessons l
        LEFT JOIN progress p
               ON p.lesson_id = l.id
              AND p.user_id   = ${user.userId}
        WHERE p.lesson_id IS NULL
        ORDER BY l.module_id, l.order_index
      ),
      pq AS (
        SELECT DISTINCT module_id
        FROM quiz_attempts
        WHERE user_id = ${user.userId} AND passed = true
      ),
      hq AS (
        SELECT DISTINCT module_id FROM quiz_questions
      ),
      cp AS (
        -- Latest checkpoint submission status per module
        SELECT DISTINCT ON (module_id) module_id, status
        FROM checkpoint_submissions
        WHERE user_id = ${user.userId}
        ORDER BY module_id, submitted_at DESC
      )
    SELECT
      m.id,
      m.slug,
      m.title,
      m.order_index,
      m.is_staff_only,
      m.hard_gate,
      COALESCE(lc.total,     0)                       AS total_lessons,
      COALESCE(lc.completed, 0)                       AS completed_lessons,
      COALESCE(fi.lesson_id,   fl.lesson_id)          AS target_lesson_id,
      COALESCE(fi.lesson_slug, fl.lesson_slug)        AS target_lesson_slug,
      (pq.module_id IS NOT NULL)                      AS quiz_passed,
      (hq.module_id IS NOT NULL)                      AS has_quiz,
      cp.status                                       AS checkpoint_status
    FROM modules m
    LEFT JOIN lc ON lc.module_id = m.id
    LEFT JOIN fl ON fl.module_id = m.id
    LEFT JOIN fi ON fi.module_id = m.id
    LEFT JOIN pq ON pq.module_id = m.id
    LEFT JOIN hq ON hq.module_id = m.id
    LEFT JOIN cp ON cp.module_id = m.id
    ORDER BY m.order_index
  `) as ModuleRow[];

  const modules = buildModules(rows, user.role);

  // Certificate (if capstone approved)
  const certRaw = await sql`
    SELECT id, user_name, issued_at FROM certificates WHERE user_id = ${user.userId} LIMIT 1
  `;
  const certificate = (certRaw as unknown as { id: string; user_name: string; issued_at: string }[])[0] ?? null;

  // Overall stats
  const totalLessons   = modules.reduce((s, m) => s + m.total_lessons,   0);
  const doneLessons    = modules.reduce((s, m) => s + m.completed_lessons, 0);
  const pct            = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  // First-ever visit: send new students to a short orientation before the module wall.
  if (doneLessons === 0) {
    const store = await cookies();
    if (!store.get("welcomed")) redirect("/course/welcome");
  }
  const quizzesPassed  = modules.filter((m) => m.quiz_passed).length;
  const modulesStarted = modules.filter(
    (m) => m.completed_lessons > 0 && m.status !== "completed"
  ).length;

  const firstName = user.email.split("@")[0];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-navy-950)" }}>

      <CourseNav
        extra={
          <a
            href="/course/bookmarks"
            className="hidden sm:inline text-xs transition-colors"
            style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
          >
            Bookmarks
          </a>
        }
      />

      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 px-5 pb-24 pt-12 lg:grid-cols-[minmax(0,680px)_320px] lg:px-8">

      <main>

        {/* ── Welcome + overall progress ─────────────────────────────────── */}
        <div className="mb-12">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-gold)" }}
          >
            Your progress
          </p>
          <h1 className="mb-6 text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Welcome back{firstName ? `, ${firstName}` : ""}.
          </h1>

          {/* Overall bar */}
          <div
            className="mb-3 overflow-hidden rounded-full"
            style={{ height: "6px", background: "var(--color-navy-700)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width:      `${pct}%`,
                background: "linear-gradient(90deg, var(--color-accent) 0%, var(--color-success) 100%)",
                transition: "width 1s ease",
              }}
            />
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap gap-x-6 gap-y-1 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span>
              <strong style={{ color: "var(--color-text-primary)" }}>{pct}%</strong> complete
            </span>
            <span>
              <strong style={{ color: "var(--color-text-primary)" }}>{doneLessons}</strong> of {totalLessons} lessons done
            </span>
            {quizzesPassed > 0 && (
              <span>
                <strong style={{ color: "var(--color-text-primary)" }}>{quizzesPassed}</strong>
                {" "}quiz{quizzesPassed !== 1 ? "zes" : ""} passed
              </span>
            )}
            {modulesStarted > 0 && (
              <span>
                <strong style={{ color: "var(--color-text-primary)" }}>{modulesStarted}</strong>
                {" "}module{modulesStarted !== 1 ? "s" : ""} in progress
              </span>
            )}
          </div>
        </div>

        {/* ── Certificate banner ────────────────────────────────────────── */}
        {certificate && (
          <div
            className="mb-10 flex items-center justify-between gap-4 rounded-xl px-5 py-4"
            style={{
              background: "linear-gradient(135deg, rgba(240,168,67,0.12) 0%, rgba(52,211,153,0.07) 100%)",
              border:     "1px solid rgba(240,168,67,0.30)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" fill="rgba(240,168,67,0.15)" stroke="var(--color-gold)" strokeWidth="1.2" />
                <path d="M9 16l4.5 4.5 9-9" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-gold)" }}>
                  Course complete
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  Your certificate is ready, {certificate.user_name || firstName}.
                </p>
              </div>
            </div>
            <a
              href="/course/certificate"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold"
              style={{ background: "var(--color-gold)", color: "#000" }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1l1.4 3.5 3.6.3-2.7 2.3.9 3.5L5.5 8.6 2.3 10.6l.9-3.5L.5 4.8l3.6-.3z" fill="currentColor" />
              </svg>
              View certificate
            </a>
          </div>
        )}

        {/* ── Module timeline ────────────────────────────────────────────── */}
        <section>
          <p
            className="mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)" }}
          >
            Course modules
          </p>

          <div>
            {modules.map((mod, i) => (
              <ModuleCard key={mod.id} mod={mod} isLast={i === modules.length - 1} />
            ))}
          </div>
        </section>

      </main>

      <CourseRail
        modules={modules}
        pct={pct}
        doneLessons={doneLessons}
        totalLessons={totalLessons}
        quizzesPassed={quizzesPassed}
        hasCertificate={!!certificate}
      />

      </div>

      <AssistantWidget
        progress={{
          scope: "course",
          pct,
          doneLessons,
          totalLessons,
          currentModuleTitle: modules.find((m) => m.status === "in_progress")?.cleanTitle ?? null,
        }}
      />
    </div>
  );
}
