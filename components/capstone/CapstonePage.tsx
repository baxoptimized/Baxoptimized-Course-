"use client";

import { useState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";

// ── Types ─────────────────────────────────────────────────────────────────────

type Submission = {
  id: string;
  status: "pending" | "approved" | "needs_revision";
  content: string;
  file_urls: string[];
  submitted_at: string;
};

type Certificate = {
  id: string;
  user_name: string;
  brief: string;
  issued_at: string;
};

type Props = {
  submission: Submission | null;
  certificate: Certificate | null;
  action: (formData: FormData) => Promise<void>;
};

// ── Rubric definition ─────────────────────────────────────────────────────────

type RubricItem  = { key: string; label: string; required: boolean };
type RubricGroup = { heading: string; items: RubricItem[] };

const RUBRIC: RubricGroup[] = [
  {
    heading: "Design & Build",
    items: [
      { key: "design_pages",       label: "All required pages built (Home, Services/Menu, About, Contact)", required: true },
      { key: "mobile_responsive",  label: "Mobile-responsive — checked on a narrow viewport",               required: true },
      { key: "design_fundamentals",label: "Follows Module 5's design fundamentals",                         required: true },
      { key: "no_placeholder",     label: "No placeholder text anywhere",                                   required: true },
      { key: "correct_voice",      label: "Correct voice — AHPRA-compliant if Brief B chosen",             required: true },
    ],
  },
  {
    heading: "Functionality",
    items: [
      { key: "contact_form",   label: "Contact form wired to Resend — real test email sent and received", required: true },
      { key: "phone_clickable",label: "Phone number clickable on mobile",                                 required: true },
      { key: "all_links",      label: "All links work",                                                   required: true },
    ],
  },
  {
    heading: "Technical & Deployment",
    items: [
      { key: "github_repo",     label: "Pushed to a private GitHub repo, clean commit history",           required: true },
      { key: "vercel_deployed", label: "Deployed and live on Vercel",                                     required: true },
      { key: "env_vars",        label: "Environment variables correctly set in Vercel",                   required: true },
    ],
  },
  {
    heading: "SEO & Speed",
    items: [
      { key: "title_meta",     label: "Title tags + meta descriptions on every page, within limits",      required: true },
      { key: "image_alt",      label: "Image alt text throughout",                                        required: true },
      { key: "pagespeed_90",   label: "PageSpeed Insights mobile score 90+",                              required: true },
      { key: "ga4",            label: "GA4 installed and tracking",                                       required: true },
      { key: "search_console", label: "Search Console verified, sitemap submitted",                       required: true },
    ],
  },
  {
    heading: "Visual polish (optional — Module 7.5)",
    items: [
      { key: "visual_effects", label: "At least 2–3 visual effects added, matched to the brand's tone",  required: false },
    ],
  },
  {
    heading: "Going all the way (optional)",
    items: [
      { key: "custom_domain", label: "Custom domain connected, DNS configured",                           required: false },
      { key: "ssl",           label: "SSL confirmed working",                                             required: false },
    ],
  },
];

const REQUIRED_KEYS = RUBRIC.flatMap((g) => g.items.filter((i) => i.required).map((i) => i.key));

// ── Brief data ────────────────────────────────────────────────────────────────

const BRIEFS = [
  {
    id:       "A",
    name:     "Brief A — Thirroul Beachside Café",
    client:   "Sea & Sand Café",
    location: "Thirroul, NSW",
    summary:  "Instagram following, no website. Wants foot traffic, menu, beachside vibe, hours. Has nice phone photos. Wants warm, casual, not corporate.",
    tag:      "No AHPRA restrictions",
    tagColor: "var(--color-success)",
    accent:   "#38bdf8",
    warning:  null,
  },
  {
    id:       "B",
    name:     "Brief B — Illawarra Physio Clinic",
    client:   "Illawarra Movement Physiotherapy",
    location: "Wollongong",
    summary:  "Outdated, unprofessional site. Wants something reflecting real expertise, easy booking. Professional headshots only. Clean, calm, trustworthy.",
    tag:      "⚠️ AHPRA restrictions apply",
    tagColor: "#f59e0b",
    accent:   "#818cf8",
    warning:  "Use the AHPRA-safe copywriting prompt from Module 6. No clinical outcome testimonials, no comparative claims, no guarantees.",
  },
  {
    id:       "C",
    name:     "Brief C — Local Electrician",
    client:   "Sparkwise Electrical",
    location: "Shellharbour",
    summary:  "Word-of-mouth only. Wants emergency call-out and residential search visibility. Phone photos, no logo. Fast-loading, trustworthy, clear emergency contact.",
    tag:      "No AHPRA restrictions",
    tagColor: "var(--color-success)",
    accent:   "#fb923c",
    warning:  null,
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold transition-opacity disabled:opacity-40"
      style={{ background: "var(--color-gold)", color: "#000" }}
    >
      {pending ? (
        <>
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
              strokeDasharray="40" strokeDashoffset="20" />
          </svg>
          Submitting…
        </>
      ) : (
        "Submit capstone →"
      )}
    </button>
  );
}

function FileUploadField({
  name,
  label,
  hint,
  required,
  onFileSelect,
}: {
  name: string;
  label: string;
  hint: string;
  required?: boolean;
  onFileSelect?: (hasFile: boolean) => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </p>
      <p className="mb-2.5 text-xs" style={{ color: "var(--color-text-muted)" }}>{hint}</p>
      <input
        ref={ref}
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        required={required}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setFileName(f?.name ?? null);
          onFileSelect?.(!!f);
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
        style={{
          background: "var(--color-navy-800)",
          border:     `1px dashed ${fileName ? "var(--color-success)" : "var(--color-navy-600)"}`,
          color:      fileName ? "var(--color-success)" : "var(--color-text-muted)",
          cursor:     "pointer",
        }}
      >
        {fileName ? (
          <>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="7" fill="rgba(52,211,153,0.15)" stroke="var(--color-success)" strokeWidth="1" />
              <path d="M4 7.5l2.5 2.5 4.5-4.5" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {fileName}
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 2v8M4.5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 11v1a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Choose file…
          </>
        )}
      </button>
    </div>
  );
}

// ── Status card ───────────────────────────────────────────────────────────────

function StatusCard({ submission, certificate }: { submission: Submission; certificate: Certificate | null }) {
  const parsed = (() => {
    try { return JSON.parse(submission.content) as Record<string, unknown>; }
    catch { return {}; }
  })();

  const liveUrl   = (parsed.live_url   as string) || null;
  const githubUrl = (parsed.github_url as string) || null;
  const brief     = (parsed.brief      as string) || null;
  const name      = (parsed.name       as string) || null;

  const submittedDate = new Date(submission.submitted_at).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  if (submission.status === "approved" && certificate) {
    return (
      <div className="space-y-5">
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(240,168,67,0.12) 0%, rgba(52,211,153,0.08) 100%)",
            border:     "1px solid rgba(240,168,67,0.35)",
          }}
        >
          <div className="mb-4 flex justify-center">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="25" fill="rgba(240,168,67,0.15)" stroke="var(--color-gold)" strokeWidth="1.5" />
              <path d="M16 26l6.5 6.5 13-14" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-gold)" }}>
            Capstone approved
          </p>
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            You did it{name ? `, ${name}` : ""}.
          </h2>
          <p className="mb-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Your Baxoptimized Method Certificate is ready to download.
          </p>
          <a
            href="/course/certificate"
            className="inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-semibold"
            style={{ background: "var(--color-gold)", color: "#000" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.8 4.5 4.7.4-3.5 3 1.1 4.5L7 10.7l-4.1 2.7 1.1-4.5-3.5-3 4.7-.4z" fill="currentColor" />
            </svg>
            View your certificate
          </a>
        </div>

        {(liveUrl || githubUrl) && (
          <div className="rounded-xl p-5 space-y-2"
            style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
              Submitted · Brief {brief}
            </p>
            {liveUrl && <LinkRow href={liveUrl} label={liveUrl} />}
            {githubUrl && <LinkRow href={githubUrl} label={githubUrl} />}
          </div>
        )}
      </div>
    );
  }

  const isPending = submission.status === "pending";

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl p-6"
        style={{
          background: isPending ? "rgba(240,168,67,0.08)"  : "rgba(239,68,68,0.07)",
          border:     `1px solid ${isPending ? "rgba(240,168,67,0.25)" : "rgba(239,68,68,0.22)"}`,
        }}
      >
        <div className="flex items-start gap-4">
          {isPending ? (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
              <circle cx="14" cy="14" r="13" fill="rgba(240,168,67,0.12)" stroke="var(--color-gold)" strokeWidth="1.5" />
              <path d="M14 9v5l3 3" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
              <circle cx="14" cy="14" r="13" fill="rgba(239,68,68,0.10)" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M14 9v6M14 17v1.5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <div>
            <p className="text-sm font-semibold"
              style={{ color: isPending ? "var(--color-gold)" : "#ef4444" }}>
              {isPending ? "Under review" : "Needs revision"}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {isPending
                ? "Your capstone is with Baxter — we'll review it within a few days."
                : "Your submission needs changes — review the feedback and resubmit."}
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Submitted {submittedDate}
            </p>
          </div>
        </div>
      </div>

      {(liveUrl || githubUrl) && (
        <div className="rounded-xl p-5 space-y-2"
          style={{ background: "var(--color-navy-900)", border: "1px solid var(--color-navy-700)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
            Your submission
          </p>
          {liveUrl   && <LinkRow href={liveUrl}   label={liveUrl} />}
          {githubUrl && <LinkRow href={githubUrl} label={githubUrl} />}
        </div>
      )}
    </div>
  );
}

function LinkRow({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm truncate"
      style={{ color: "var(--color-accent)", textDecoration: "none" }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
        <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7M8 1h3v3M11 1 5.5 6.5"
          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="truncate">{label}</span>
    </a>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CapstonePage({ submission, certificate, action }: Props) {
  const [selectedBrief, setSelectedBrief]   = useState<string | null>(null);
  const [checkedItems, setCheckedItems]     = useState<Record<string, boolean>>({});
  const [hasPagespeed, setHasPagespeed]     = useState(false);

  useEffect(() => {
    const brief  = localStorage.getItem("capstone_brief");
    const rubric = localStorage.getItem("capstone_rubric");
    if (brief)  setSelectedBrief(brief);
    if (rubric) { try { setCheckedItems(JSON.parse(rubric)); } catch { /* ignore */ } }
  }, []);

  const persistBrief = (id: string) => {
    setSelectedBrief(id);
    localStorage.setItem("capstone_brief", id);
  };

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("capstone_rubric", JSON.stringify(next));
      return next;
    });
  };

  const checkedCount       = REQUIRED_KEYS.filter((k) => checkedItems[k]).length;
  const allRequiredChecked = checkedCount === REQUIRED_KEYS.length;
  const checkedKeys        = Object.entries(checkedItems).filter(([, v]) => v).map(([k]) => k);
  const canSubmit          = !!selectedBrief && allRequiredChecked && hasPagespeed;

  const showForm = !submission || submission.status === "needs_revision";

  return (
    <main className="mx-auto max-w-2xl px-5 pb-32 pt-10">

      {/* Hero */}
      <div className="mb-10">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-gold)" }}>
          Module 15
        </p>
        <h1 className="mb-3 text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
          The Capstone
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Build a complete second site, solo, no hand-holding. Choose a brief below, work through the
          rubric honestly, then submit your proof. A pass issues your certificate.
        </p>
      </div>

      {/* Status if already submitted */}
      {submission && (
        <div className="mb-10">
          <StatusCard submission={submission} certificate={certificate} />
        </div>
      )}

      {showForm && (
        <>
          {/* ── 1. Brief selection ──────────────────────────────────────────── */}
          <section className="mb-10">
            <SectionHeader num={1} title="Choose your brief" />
            <div className="space-y-3">
              {BRIEFS.map((b) => {
                const selected = selectedBrief === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => persistBrief(b.id)}
                    className="w-full rounded-xl p-5 text-left transition-all"
                    style={{
                      background: selected ? `${b.accent}10` : "var(--color-navy-900)",
                      border:     `1.5px solid ${selected ? b.accent : "var(--color-navy-700)"}`,
                      boxShadow:  selected ? `0 0 0 3px ${b.accent}18` : undefined,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="mb-0.5 font-semibold text-sm"
                          style={{ color: selected ? b.accent : "var(--color-text-primary)" }}>
                          {b.name}
                        </p>
                        <p className="mb-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {b.client} · {b.location}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                          {b.summary}
                        </p>
                        {b.warning && selected && (
                          <p className="mt-2 text-xs" style={{ color: "#f59e0b" }}>{b.warning}</p>
                        )}
                        <span
                          className="mt-3 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: `${b.tagColor}18`, color: b.tagColor, border: `1px solid ${b.tagColor}44` }}
                        >
                          {b.tag}
                        </span>
                      </div>
                      {/* Radio circle */}
                      <div
                        className="mt-1 shrink-0 flex h-5 w-5 items-center justify-center rounded-full border-2"
                        style={{
                          borderColor: selected ? b.accent : "var(--color-navy-600)",
                          background:  selected ? b.accent : "transparent",
                        }}
                      >
                        {selected && (
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <path d="M1.5 4.5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── 2. Rubric ───────────────────────────────────────────────────── */}
          <section className="mb-10">
            <SectionHeader
              num={2}
              title="Self-assess the rubric"
              sub={`${checkedCount} / ${REQUIRED_KEYS.length} required`}
            />
            <p className="mb-5 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Only tick when it&apos;s actually done. Stuck on something? Every item maps back to an
              earlier module — re-read that module rather than guessing.
            </p>

            <div className="space-y-7">
              {RUBRIC.map((group) => (
                <div key={group.heading}>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: "var(--color-text-muted)" }}>
                    {group.heading}
                  </p>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const checked = !!checkedItems[item.key];
                      return (
                        <label
                          key={item.key}
                          className="flex cursor-pointer items-start gap-3 rounded-lg px-4 py-3"
                          style={{
                            background: checked ? "rgba(52,211,153,0.06)" : "var(--color-navy-900)",
                            border:     `1px solid ${checked ? "rgba(52,211,153,0.25)" : "var(--color-navy-700)"}`,
                            transition: "background 0.15s, border-color 0.15s",
                          }}
                        >
                          {/* Custom checkbox */}
                          <span className="mt-0.5 shrink-0">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() => toggleItem(item.key)}
                            />
                            <span
                              className="flex items-center justify-center rounded"
                              style={{
                                width:      "18px",
                                height:     "18px",
                                background: checked ? "var(--color-success)" : "transparent",
                                border:     `2px solid ${checked ? "var(--color-success)" : "var(--color-navy-600)"}`,
                                transition: "background 0.15s, border-color 0.15s",
                              }}
                            >
                              {checked && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M1.5 5l2.5 2.5 5-5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                          </span>
                          <span className="flex-1 text-sm leading-snug"
                            style={{ color: checked ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                            {item.label}
                          </span>
                          {!item.required && (
                            <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                              style={{ background: "var(--color-navy-800)", color: "var(--color-text-muted)" }}>
                              optional
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
                <span>Required items</span>
                <span style={{ color: allRequiredChecked ? "var(--color-success)" : undefined }}>
                  {checkedCount} / {REQUIRED_KEYS.length}{allRequiredChecked ? " ✓" : ""}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-navy-700)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width:      `${(checkedCount / REQUIRED_KEYS.length) * 100}%`,
                    background: allRequiredChecked ? "var(--color-success)" : "var(--color-accent)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          </section>

          {/* ── 3. Submission form ──────────────────────────────────────────── */}
          <section>
            <SectionHeader num={3} title="Submit your proof" />
            <form action={action} className="space-y-6">
              <input type="hidden" name="brief"  value={selectedBrief ?? ""} />
              <input type="hidden" name="rubric" value={JSON.stringify(checkedKeys)} />

              {/* Name */}
              <TextInput
                id="cert-name"
                name="name"
                type="text"
                label="Your name"
                required
                hint="This is how your name will appear on your certificate."
                placeholder="Baxter Hanley"
              />

              {/* Live URL */}
              <TextInput
                id="live-url"
                name="live_url"
                type="url"
                label="Live site URL"
                required
                placeholder="https://your-site.vercel.app"
              />

              {/* GitHub URL */}
              <TextInput
                id="github-url"
                name="github_url"
                type="url"
                label="GitHub repository link"
                required
                placeholder="https://github.com/you/your-project"
              />

              {/* PageSpeed screenshot (required) */}
              <FileUploadField
                name="pagespeed_screenshot"
                label="PageSpeed Insights mobile screenshot"
                hint="Must show mobile score 90+. PNG, JPG or WebP up to 10 MB."
                required
                onFileSelect={setHasPagespeed}
              />

              {/* Email screenshot (optional) */}
              <FileUploadField
                name="email_screenshot"
                label="Test email received screenshot"
                hint="Screenshot showing a real test email arrived in an inbox. Optional but recommended."
              />

              {/* Notes */}
              <div>
                <label htmlFor="capstone-notes" className="mb-1.5 block text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}>
                  Anything else to note{" "}
                  <span style={{ color: "var(--color-text-muted)" }}>(optional)</span>
                </label>
                <textarea
                  id="capstone-notes"
                  name="notes"
                  rows={3}
                  placeholder="Context, decisions you made, anything you want Baxter to know…"
                  className="w-full rounded-lg px-4 py-3 text-sm leading-relaxed resize-y"
                  style={{
                    background: "var(--color-navy-800)",
                    border:     "1px solid var(--color-navy-600)",
                    color:      "var(--color-text-primary)",
                    outline:    "none",
                    fontFamily: "var(--font-sans)",
                  }}
                  onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-accent)"; }}
                  onBlur={(e)  => { (e.target as HTMLElement).style.borderColor = "var(--color-navy-600)"; }}
                />
              </div>

              {/* Blocker hints */}
              {!selectedBrief && (
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  ↑ Select a brief above first
                </p>
              )}
              {selectedBrief && !allRequiredChecked && (
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  ↑ {REQUIRED_KEYS.length - checkedCount} required rubric item
                  {REQUIRED_KEYS.length - checkedCount !== 1 ? "s" : ""} remaining
                </p>
              )}
              {selectedBrief && allRequiredChecked && !hasPagespeed && (
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  ↑ Add your PageSpeed screenshot
                </p>
              )}

              <div className="pt-2">
                <SubmitButton disabled={!canSubmit} />
              </div>
            </form>
          </section>
        </>
      )}
    </main>
  );
}

// ── Tiny shared components ────────────────────────────────────────────────────

function SectionHeader({ num, title, sub }: { num: number; title: string; sub?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{ background: "var(--color-accent)", color: "#fff" }}
      >
        {num}
      </span>
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </h2>
      {sub && (
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{sub}</span>
      )}
    </div>
  );
}

function TextInput({
  id, name, type, label, hint, placeholder, required,
}: {
  id: string; name: string; type: string; label: string;
  hint?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium"
        style={{ color: "var(--color-text-primary)" }}>
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {hint && <p className="mb-2 text-xs" style={{ color: "var(--color-text-muted)" }}>{hint}</p>}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg px-4 py-3 text-sm"
        style={{
          background:  "var(--color-navy-800)",
          border:      "1px solid var(--color-navy-600)",
          color:       "var(--color-text-primary)",
          outline:     "none",
          fontFamily:  "var(--font-sans)",
        }}
        onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-accent)"; }}
        onBlur={(e)  => { (e.target as HTMLElement).style.borderColor = "var(--color-navy-600)"; }}
      />
    </div>
  );
}
