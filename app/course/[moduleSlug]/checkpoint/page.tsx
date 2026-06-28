import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { CourseNav } from "@/components/course/CourseNav";
import { CheckpointForm } from "@/components/checkpoint/CheckpointForm";
import { submitCheckpoint } from "./actions";

const CAPSTONE_SLUG = "module-15-capstone";

// ── Types ─────────────────────────────────────────────────────────────────────

type CheckpointModule = {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  is_staff_only: boolean;
};

type Submission = {
  id: string;
  status: "pending" | "approved" | "needs_revision";
  content: string;
  file_urls: string[];
  submitted_at: string;
};

type NextModule = {
  slug: string;
  title: string;
};

// ── Status card ───────────────────────────────────────────────────────────────

function StatusCard({
  submission,
  mod,
  nextModule,
}: {
  submission: Submission;
  mod: CheckpointModule;
  nextModule: NextModule | null;
}) {
  const { status, submitted_at, content, file_urls } = submission;
  const submittedDate = new Date(submitted_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const STATUS_META = {
    approved: {
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" fill="rgba(52,211,153,0.15)" stroke="var(--color-success)" strokeWidth="1.5" />
          <path d="M8 14l4 4 8-8" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label:  "Approved",
      color:  "var(--color-success)",
      bg:     "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.25)",
      message: "Your submission has been approved.",
    },
    pending: {
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" fill="rgba(240,168,67,0.12)" stroke="var(--color-gold)" strokeWidth="1.5" />
          <path d="M14 9v5l3 3" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label:  "Pending review",
      color:  "var(--color-gold)",
      bg:     "rgba(240,168,67,0.07)",
      border: "rgba(240,168,67,0.22)",
      message: "Your submission is with us — we'll review it within a few days.",
    },
    needs_revision: {
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" fill="rgba(248,113,113,0.10)" stroke="var(--color-error)" strokeWidth="1.5" />
          <path d="M14 9v6M14 17v1.5" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      label:  "Needs revision",
      color:  "var(--color-error)",
      bg:     "rgba(248,113,113,0.07)",
      border: "rgba(248,113,113,0.22)",
      message: "Your submission needs some changes — review the notes and resubmit.",
    },
  } as const;

  const meta = STATUS_META[status];

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div
        className="rounded-xl p-6"
        style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
      >
        <div className="flex items-start gap-4">
          {meta.icon}
          <div>
            <p className="text-sm font-semibold" style={{ color: meta.color }}>
              {meta.label}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {meta.message}
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Submitted {submittedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Next module CTA (approved only) */}
      {status === "approved" && (
        <div
          className="rounded-xl p-6 text-center"
          style={{
            background: "rgba(52,211,153,0.06)",
            border:     "1px solid rgba(52,211,153,0.20)",
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
                href={`/course/${nextModule.slug}`}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold"
                style={{ background: "var(--color-gold)", color: "#000" }}
              >
                Start next module →
              </a>
            </>
          ) : (
            <>
              <p className="mb-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>
                🎉 Course complete — congratulations!
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

      {/* Summary of what was submitted */}
      {(content || file_urls.length > 0) && (
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)" }}>
            Your submission
          </p>
          {content && (
            <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}>
              {content}
            </p>
          )}
          {file_urls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--color-accent)", textDecoration: "none" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M8 1h3v3M11 1L5.5 6.5" stroke="currentColor" strokeWidth="1.2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Screenshot {i + 1}
            </a>
          ))}
        </div>
      )}

      {/* Resubmit option for needs_revision or pending (capstone) */}
      {(status === "needs_revision" || status === "pending") && (
        <div>
          <p className="mb-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Want to update your submission?
          </p>
          <CheckpointForm
            moduleSlug={mod.slug}
            action={submitCheckpoint}
            isCapstone={mod.slug === CAPSTONE_SLUG}
          />
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CheckpointPage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { moduleSlug } = await params;

  // Load module + latest submission + next module
  const [modRaw, submissionRaw, nextRaw] = await Promise.all([
    sql`
      SELECT id, slug, title, order_index, hard_gate, is_staff_only
      FROM modules WHERE slug = ${moduleSlug} LIMIT 1
    `,
    sql`
      SELECT id, status, content, file_urls, submitted_at
      FROM checkpoint_submissions
      WHERE user_id = ${user.userId}
        AND module_id = (SELECT id FROM modules WHERE slug = ${moduleSlug})
      ORDER BY submitted_at DESC
      LIMIT 1
    `,
    sql`
      SELECT slug, title FROM modules
      WHERE order_index > (SELECT order_index FROM modules WHERE slug = ${moduleSlug})
        AND is_staff_only = false
      ORDER BY order_index
      LIMIT 1
    `,
  ]);

  const mod        = (modRaw        as unknown as (CheckpointModule & { hard_gate: boolean })[])[0];
  const submission = (submissionRaw as unknown as Submission[])[0] ?? null;
  const nextModule = (nextRaw       as unknown as NextModule[])[0]  ?? null;

  if (!mod || !mod.hard_gate) notFound();

  // Guard: staff-only module requires staff/admin role
  if (mod.is_staff_only && user.role === "student") redirect("/course");

  const isCapstone = mod.slug === CAPSTONE_SLUG;

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-navy-950)" }}>

      <CourseNav back={{ href: "/course", label: "← All modules" }} />

      <main className="mx-auto max-w-2xl px-5 pb-24 pt-10">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-gold)" }}>
            {mod.title}
          </p>
          <h1 className="mb-2 text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}>
            {isCapstone ? "Capstone Submission" : "Practical Checkpoint"}
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {isCapstone
              ? "Submit your completed capstone project for review."
              : "Show what you built. Your submission will be verified immediately."}
          </p>
        </div>

        {submission ? (
          <StatusCard
            submission={submission}
            mod={mod}
            nextModule={nextModule}
          />
        ) : (
          <CheckpointForm
            moduleSlug={moduleSlug}
            action={submitCheckpoint}
            isCapstone={isCapstone}
          />
        )}

      </main>
    </div>
  );
}
