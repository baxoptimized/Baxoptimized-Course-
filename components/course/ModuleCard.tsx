"use client";

export type ProcessedModule = {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  is_staff_only: boolean;
  total_lessons: number;
  completed_lessons: number;
  target_lesson_id: string | null;
  target_lesson_slug: string | null;
  quiz_passed: boolean;
  has_quiz: boolean;
  num: string;
  cleanTitle: string;
  hard_gate: boolean;
  checkpoint_status: "pending" | "approved" | "needs_revision" | null;
  isLocked: boolean;
  status: "completed" | "in_progress" | "not_started" | "locked" | "pending_review";
};

/** Convert a full DB lesson slug ("moduleSlug--lessonPart") to a URL-safe part. */
function lessonUrlPart(lessonSlug: string, moduleSlug: string): string {
  const prefix = moduleSlug + "--";
  return lessonSlug.startsWith(prefix) ? lessonSlug.slice(prefix.length) : lessonSlug;
}

const STATUS = {
  completed: {
    badge:      { bg: "var(--color-success)", color: "#000" },
    border:     "var(--color-success)",
    label:      "Completed",
    labelColor: "var(--color-success)",
  },
  in_progress: {
    badge:      { bg: "var(--color-accent)", color: "#fff" },
    border:     "var(--color-accent)",
    label:      "In progress",
    labelColor: "var(--color-accent)",
  },
  not_started: {
    badge:      { bg: "var(--color-navy-700)", color: "var(--color-text-muted)" },
    border:     "var(--color-navy-700)",
    label:      "Not started",
    labelColor: "var(--color-text-muted)",
  },
  locked: {
    badge:      { bg: "var(--color-navy-800)", color: "var(--color-text-muted)" },
    border:     "transparent",
    label:      "Locked",
    labelColor: "var(--color-text-muted)",
  },
  pending_review: {
    badge:      { bg: "var(--color-gold)", color: "#000" },
    border:     "var(--color-gold)",
    label:      "Pending review",
    labelColor: "var(--color-gold)",
  },
} as const;

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-navy-700)" }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: color, transition: "width 0.7s ease" }}
      />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3" y="6.5" width="8" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 4.5V7l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ModuleCard({ mod, isLast }: { mod: ProcessedModule; isLast: boolean }) {
  const s = STATUS[mod.status];
  const isClickable = !mod.isLocked && !!mod.target_lesson_id;
  const pct =
    mod.total_lessons > 0
      ? Math.round((mod.completed_lessons / mod.total_lessons) * 100)
      : 0;

  const cardInner = (
    <div
      className="module-card-inner relative ml-2 flex-1 rounded-xl p-5"
      style={{
        background:  mod.isLocked ? "rgba(13,22,40,0.5)" : "var(--color-navy-900)",
        border:      `1px solid ${mod.isLocked ? "var(--color-navy-700)" : s.border + "44"}`,
        opacity:     mod.isLocked ? 0.65 : 1,
        transition:  "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Status badge */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          style={{
            background:  mod.isLocked ? "transparent" : s.badge.bg + "22",
            color:       s.labelColor,
            border:      `1px solid ${s.labelColor}33`,
          }}
        >
          {mod.status === "completed" && <CheckIcon />}
          {mod.isLocked && <LockIcon />}
          {s.label}
        </span>

        <span className="text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
          {mod.total_lessons === 0 ? "—" : `${mod.completed_lessons} / ${mod.total_lessons} lessons`}
        </span>
      </div>

      {/* Title + hard-gate badge */}
      <div className="mb-1 flex items-start gap-2">
        <h2
          className="flex-1 text-base font-semibold leading-snug"
          style={{ color: mod.isLocked ? "var(--color-text-muted)" : "var(--color-text-primary)" }}
        >
          {mod.cleanTitle}
        </h2>
        {mod.hard_gate && (
          <span
            className="mt-0.5 shrink-0 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
            style={{
              background: "rgba(239,68,68,0.12)",
              color:      "#ef4444",
              border:     "1px solid rgba(239,68,68,0.30)",
            }}
            title="Requires manual approval before the next module unlocks"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Hard gate
          </span>
        )}
      </div>

      {/* Progress + CTA */}
      {!mod.isLocked && mod.total_lessons > 0 && (
        <div className="mt-4 space-y-2">
          <ProgressBar pct={pct} color={s.border} />
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "var(--color-text-muted)" }}>{pct}% complete</span>
            {isClickable && (
              <span className="font-medium" style={{ color: s.labelColor }}>
                {mod.status === "completed" ? "Review →" : "Continue →"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Locked hint */}
      {mod.isLocked && (
        <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          Complete the previous module to unlock this one
        </p>
      )}
    </div>
  );

  return (
    <div className="relative flex gap-3">
      {/* Timeline spine */}
      <div className="relative flex flex-col items-center">
        <div
          className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums"
          style={{
            background:  s.badge.bg,
            color:       s.badge.color,
            boxShadow:   !mod.isLocked && mod.status !== "not_started"
                           ? `0 0 0 4px ${s.border}22`
                           : undefined,
          }}
        >
          {mod.status === "completed"
            ? <CheckIcon />
            : mod.isLocked
            ? <LockIcon />
            : mod.status === "pending_review"
            ? <ClockIcon />
            : mod.num}
        </div>

        {!isLast && (
          <div
            className="mt-1 w-px flex-1"
            style={{
              minHeight: "1.5rem",
              background: `linear-gradient(to bottom, ${s.border}66, var(--color-navy-700))`,
            }}
          />
        )}
      </div>

      {/* Anchor or div */}
      {isClickable ? (
        <a
          href={
            mod.target_lesson_slug
              ? `/course/${mod.slug}/${lessonUrlPart(mod.target_lesson_slug, mod.slug)}`
              : `/course/${mod.slug}`
          }
          className="module-card-link mb-4 flex-1"
          style={{ textDecoration: "none" }}
          onMouseEnter={(e) => {
            const inner = e.currentTarget.querySelector<HTMLElement>(".module-card-inner");
            if (inner) {
              inner.style.transform = "translateY(-2px)";
              inner.style.boxShadow = `0 8px 32px ${s.border}22, 0 0 0 1px ${s.border}44`;
            }
          }}
          onMouseLeave={(e) => {
            const inner = e.currentTarget.querySelector<HTMLElement>(".module-card-inner");
            if (inner) {
              inner.style.transform = "";
              inner.style.boxShadow = "";
            }
          }}
        >
          {cardInner}
        </a>
      ) : (
        <div className="mb-4 flex-1">{cardInner}</div>
      )}
    </div>
  );
}
