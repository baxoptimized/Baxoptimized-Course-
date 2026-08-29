import type { ProcessedModule } from "./ModuleCard";
import { lessonUrlPart } from "@/lib/lessonUrl";

function StatTile({ value, label }: { value: number | string; label: string }) {
  return (
    <div
      className="rounded-lg px-3 py-3"
      style={{ background: "var(--color-navy-800)", border: "1px solid var(--color-navy-700)" }}
    >
      <p className="font-display text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

export function CourseRail({
  modules,
  pct,
  doneLessons,
  totalLessons,
  quizzesPassed,
  hasCertificate,
}: {
  modules: ProcessedModule[];
  pct: number;
  doneLessons: number;
  totalLessons: number;
  quizzesPassed: number;
  hasCertificate: boolean;
}) {
  const modulesCompleted = modules.filter((m) => m.status === "completed").length;
  const nextModule =
    modules.find((m) => m.status === "in_progress") ??
    modules.find((m) => !m.isLocked && m.status === "not_started" && m.target_lesson_id);

  const nextHref =
    nextModule && nextModule.target_lesson_slug
      ? `/course/${nextModule.slug}/${lessonUrlPart(nextModule.target_lesson_slug, nextModule.slug)}`
      : nextModule
      ? `/course/${nextModule.slug}`
      : null;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-8 space-y-5">
        {/* Continue card */}
        {nextModule && nextHref ? (
          <a
            href={nextHref}
            className="block rounded-xl p-5 transition-transform hover:-translate-y-0.5"
            style={{
              textDecoration: "none",
              background: "linear-gradient(160deg, rgba(232,100,26,0.14) 0%, var(--color-navy-900) 65%)",
              border: "1px solid rgba(232,100,26,0.35)",
            }}
          >
            <p
              className="mb-2 text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "var(--color-accent)" }}
            >
              {modules.some((m) => m.completed_lessons > 0) ? "Continue" : "Start here"}
            </p>
            <p className="font-display text-lg font-semibold leading-snug" style={{ color: "var(--color-text-primary)" }}>
              {nextModule.cleanTitle}
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Module {nextModule.num} &middot; {nextModule.completed_lessons}/{nextModule.total_lessons} lessons
            </p>
            <span
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--color-accent)" }}
            >
              Resume →
            </span>
          </a>
        ) : (
          hasCertificate && (
            <div
              className="rounded-xl p-5"
              style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-gold)" }}
            >
              <p className="mb-1 text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-gold)" }}>
                All done
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Every module is complete. Revisit any lesson from the list any time.
              </p>
            </div>
          )
        )}

        {/* Stats card */}
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Your stats
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile value={`${pct}%`} label="Course complete" />
            <StatTile value={modulesCompleted} label={`of ${modules.length} modules`} />
            <StatTile value={doneLessons} label={`of ${totalLessons} lessons`} />
            <StatTile value={quizzesPassed} label="Quizzes passed" />
          </div>
        </div>
      </div>
    </aside>
  );
}
