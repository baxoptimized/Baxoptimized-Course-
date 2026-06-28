import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { CourseNav } from "@/components/course/CourseNav";
import { QuizForm, type QuizQuestion } from "@/components/quiz/QuizForm";
import { submitQuiz } from "./actions";

// ── Types ─────────────────────────────────────────────────────────────────────

type QuizModule = {
  id: string;
  title: string;
  slug: string;
  pass_threshold: number;
  order_index: number;
  is_staff_only: boolean;
};

type Attempt = {
  id: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
};

type NextModule = {
  id: string;
  slug: string;
  title: string;
};

// ── Score ring SVG ────────────────────────────────────────────────────────────

function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const r   = 52;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);

  const color = passed ? "var(--color-success)" : "var(--color-warning)";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--color-navy-700)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>
          {score}%
        </span>
      </div>
    </div>
  );
}

// ── Results view (pass or fail) ───────────────────────────────────────────────

function ResultsView({
  attempt,
  questions,
  mod,
  nextModule,
}: {
  attempt: Attempt;
  questions: QuizQuestion[];
  mod: QuizModule;
  nextModule: NextModule | null;
}) {
  const { score, passed, answers } = attempt;
  const mcQuestions = questions.filter((q) => q.question_type === "multiple_choice");
  const correctCount = mcQuestions.filter((q) => {
    const given = parseInt(answers[q.id] ?? "", 10);
    return !isNaN(given) && given === (q as QuizQuestion & { correct_answer_index: number | null }).correct_answer_index;
  }).length;

  const wrongQuestions = mcQuestions.filter((q) => {
    const given = parseInt(answers[q.id] ?? "", 10);
    return isNaN(given) || given !== (q as QuizQuestion & { correct_answer_index: number | null }).correct_answer_index;
  });

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">

      {/* Score header */}
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <ScoreRing score={score} passed={passed} />

        {passed ? (
          <>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>
              You passed!
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {mcQuestions.length > 0
                ? `${correctCount} of ${mcQuestions.length} questions correct`
                : "All reflection questions accepted"}
              {" "}· {mod.pass_threshold}% required
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              Not quite — keep going
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {correctCount} of {mcQuestions.length} correct
              {" "}· Need {mod.pass_threshold}% to pass
            </p>
          </>
        )}
      </div>

      {/* Pass: next-module card */}
      {passed && (
        <div
          className="mb-8 rounded-xl p-6 text-center"
          style={{
            background: "rgba(52,211,153,0.08)",
            border:     "1px solid rgba(52,211,153,0.25)",
          }}
        >
          {nextModule ? (
            <>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-success)" }}>
                Next up
              </p>
              <p className="mb-4 font-medium" style={{ color: "var(--color-text-primary)" }}>
                {nextModule.title}
              </p>
              <a
                href="/course"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold"
                style={{ background: "var(--color-gold)", color: "#000" }}
              >
                Start next module →
              </a>
            </>
          ) : (
            <>
              <p className="mb-4 font-medium" style={{ color: "var(--color-text-primary)" }}>
                🎉 You&apos;ve completed all modules!
              </p>
              <a
                href="/course"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold"
                style={{ background: "var(--color-gold)", color: "#000" }}
              >
                Back to course →
              </a>
            </>
          )}
        </div>
      )}

      {/* Wrong questions (fail state) */}
      {!passed && wrongQuestions.length > 0 && (
        <div className="mb-8">
          <p className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            Review these before retaking:
          </p>
          <div className="space-y-3">
            {wrongQuestions.map((q) => {
              const givenIdx = parseInt(answers[q.id] ?? "", 10);
              const givenText = !isNaN(givenIdx) && q.options
                ? q.options[givenIdx]
                : "No answer given";

              return (
                <div
                  key={q.id}
                  className="rounded-lg p-4"
                  style={{
                    background: "rgba(248,113,113,0.06)",
                    border:     "1px solid rgba(248,113,113,0.20)",
                  }}
                >
                  <div className="mb-2 flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" fill="rgba(248,113,113,0.15)" stroke="var(--color-error)" strokeWidth="1" />
                        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="var(--color-error)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {q.question_text}
                    </p>
                  </div>
                  <p className="ml-7 text-xs" style={{ color: "var(--color-error)" }}>
                    Your answer: <em>{givenText}</em>
                  </p>
                  <p className="ml-7 mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Review this topic in the module content to understand why.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fail: retake + review links */}
      {!passed && (
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`/course/${mod.slug}/quiz`}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            Retake quiz
          </a>
          <a
            href="/course"
            className="text-sm"
            style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
          >
            ← Back to course
          </a>
        </div>
      )}

      {/* Passed: also offer review */}
      {passed && (
        <div className="mt-4 text-center">
          <a
            href="/course"
            className="text-sm"
            style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
          >
            ← All modules
          </a>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function QuizPage({
  params,
  searchParams,
}: {
  params:      Promise<{ moduleSlug: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { moduleSlug } = await params;
  const { attempt: attemptId } = await searchParams;

  // Always load module + questions
  const [modRaw, questionsRaw] = await Promise.all([
    sql`
      SELECT id, title, slug, pass_threshold, order_index, is_staff_only
      FROM modules WHERE slug = ${moduleSlug}
      LIMIT 1
    `,
    sql`
      SELECT id, question_text, options, question_type, correct_answer_index, order_index
      FROM quiz_questions
      WHERE module_id = (SELECT id FROM modules WHERE slug = ${moduleSlug})
      ORDER BY order_index
    `,
  ]);

  const mod       = (modRaw      as unknown as QuizModule[])[0];
  const questions = questionsRaw as unknown as (QuizQuestion & { correct_answer_index: number | null })[];

  if (!mod) notFound();

  // Guard: staff-only module requires staff/admin role
  if (mod.is_staff_only && user.role === "student") redirect("/course");

  if (!questions.length) redirect("/course");

  // ── Results view ──────────────────────────────────────────────────────────
  if (attemptId) {
    const [attemptRaw, nextRaw] = await Promise.all([
      sql`
        SELECT id, score, passed, answers
        FROM quiz_attempts
        WHERE id = ${attemptId} AND user_id = ${user.userId}
        LIMIT 1
      `,
      sql`
        SELECT id, slug, title FROM modules
        WHERE order_index > ${mod.order_index}
          AND is_staff_only = false
        ORDER BY order_index
        LIMIT 1
      `,
    ]);

    const attempt    = (attemptRaw as unknown as Attempt[])[0];
    const nextModule = (nextRaw    as unknown as NextModule[])[0] ?? null;

    if (!attempt) redirect(`/course/${moduleSlug}/quiz`);

    return (
      <div className="min-h-dvh" style={{ background: "var(--color-navy-950)" }}>
        <CourseNav back={{ href: "/course", label: "← All modules" }} />

        <div className="mx-auto max-w-2xl px-5 pt-8">
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-gold)" }}>
            {mod.title} — Quiz Results
          </p>
        </div>

        <ResultsView
          attempt={attempt}
          questions={questions}
          mod={mod}
          nextModule={nextModule}
        />
      </div>
    );
  }

  // ── Quiz form view ────────────────────────────────────────────────────────

  const mcCount         = questions.filter((q) => q.question_type === "multiple_choice").length;
  const reflectionCount = questions.filter((q) => q.question_type === "reflection").length;

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-navy-950)" }}>
      <CourseNav back={{ href: `/course/${moduleSlug}`, label: "← Back to module" }} />

      <main className="mx-auto max-w-2xl px-5 pb-24 pt-10">
        {/* Quiz header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-gold)" }}>
            {mod.title}
          </p>
          <h1 className="mb-2 text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}>
            Module Quiz
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {mcCount > 0 && `${mcCount} question${mcCount !== 1 ? "s" : ""}`}
            {mcCount > 0 && reflectionCount > 0 && " · "}
            {reflectionCount > 0 && `${reflectionCount} reflection${reflectionCount !== 1 ? "s" : ""}`}
            {" · "}{mod.pass_threshold}% to pass
          </p>
        </div>

        {/* Passing threshold reminder */}
        <div
          className="mb-8 flex items-center gap-3 rounded-lg px-4 py-3"
          style={{
            background: "rgba(79,124,247,0.07)",
            border:     "1px solid rgba(79,124,247,0.18)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="var(--color-accent)" strokeWidth="1.3" />
            <path d="M8 7v4M8 5v.5" stroke="var(--color-accent)" strokeWidth="1.5"
              strokeLinecap="round" />
          </svg>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            You can retake this quiz as many times as you need. Select the best answer for each question.
          </p>
        </div>

        <QuizForm questions={questions} moduleSlug={moduleSlug} action={submitQuiz} />
      </main>
    </div>
  );
}
