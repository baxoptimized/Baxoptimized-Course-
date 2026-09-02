import Image from "next/image";
import type { ProcessedModule } from "./ModuleCard";
import { lessonUrlPart } from "@/lib/lessonUrl";

const TIPS = [
  "When you're stuck on a prompt, show Claude exactly what you want instead of describing it. A screenshot beats three sentences.",
  "Found a site you like the feel of? Screenshot it and hand it to Claude Design as a reference. That's a completely normal way to work.",
  "Bookmark any lesson you'll want later. Client work moves fast, and you won't remember which module had the answer.",
  "The quiz has unlimited retakes for a reason. Failing one isn't a big deal, it's just telling you what to reread.",
  "Every module builds on the last one. If something feels confusing, the fix is usually back a module or two, not ahead.",
];

function dailyTip(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return TIPS[dayOfYear % TIPS.length];
}

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

        {/* Tip of the day */}
        <div
          className="flex items-start gap-3 rounded-xl p-4"
          style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image src="/bax-portrait-alt.jpg" alt="Baxter" fill sizes="36px" className="object-cover" style={{ objectPosition: "center 15%" }} />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-gold)" }}>
              Tip from Baxter
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {dailyTip()}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
