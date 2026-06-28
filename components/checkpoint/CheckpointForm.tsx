"use client";

import { useState, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { CheckpointActionState } from "@/app/course/[moduleSlug]/checkpoint/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-semibold transition-opacity disabled:opacity-60"
      style={{ background: "var(--color-accent)", color: "#fff" }}
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
        "Submit →"
      )}
    </button>
  );
}

export function CheckpointForm({
  moduleSlug,
  action,
  isCapstone,
}: {
  moduleSlug: string;
  action: (prev: CheckpointActionState, formData: FormData) => Promise<CheckpointActionState>;
  isCapstone: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="moduleSlug" value={moduleSlug} />

      {state?.error && (
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
          style={{
            background: "rgba(248,113,113,0.08)",
            border:     "1px solid rgba(248,113,113,0.25)",
            color:      "var(--color-error)",
          }}
          role="alert"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {state.error}
        </div>
      )}

      {/* Notes / links */}
      <div>
        <label
          htmlFor="checkpoint-notes"
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Notes, links, or description
        </label>
        <p className="mb-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
          Share your live URL, GitHub repo link, or describe what you built.
        </p>
        <textarea
          id="checkpoint-notes"
          name="notes"
          rows={5}
          placeholder="https://yoursite.com — I built a full landing page with…"
          className="w-full rounded-lg px-4 py-3 text-sm leading-relaxed resize-y"
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

      {/* Screenshot upload */}
      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Screenshot <span style={{ color: "var(--color-text-muted)" }}>(optional)</span>
        </label>
        <p className="mb-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
          Upload a screenshot of your finished work. PNG, JPG, or WebP up to 10 MB.
        </p>

        <input
          ref={fileRef}
          type="file"
          name="screenshot"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            setFileName(e.target.files?.[0]?.name ?? null);
          }}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors"
          style={{
            background:  "var(--color-navy-800)",
            border:      `1px dashed ${fileName ? "var(--color-success)" : "var(--color-navy-600)"}`,
            color:       fileName ? "var(--color-success)" : "var(--color-text-muted)",
            cursor:      "pointer",
          }}
        >
          {fileName ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(52,211,153,0.15)" stroke="var(--color-success)" strokeWidth="1" />
                <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {fileName}
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 11v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Choose file…
            </>
          )}
        </button>
      </div>

      {/* Manual review notice */}
      <div
        className="flex items-start gap-3 rounded-lg px-4 py-3"
        style={{
          background: "rgba(240,168,67,0.08)",
          border:     "1px solid rgba(240,168,67,0.25)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
          <circle cx="8" cy="8" r="7" stroke="var(--color-gold)" strokeWidth="1.3" />
          <path d="M8 7v4M8 5v.5" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {isCapstone
            ? "Your capstone will be manually reviewed. You'll keep full access while you wait — we'll review within a few days."
            : "This checkpoint requires manual approval before the next module unlocks. You'll keep full access while you wait — we'll review within a few days."}
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
