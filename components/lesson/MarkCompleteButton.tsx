"use client";

import { useFormStatus } from "react-dom";
import type { ComponentProps } from "react";

function SubmitBtn({ label, variant }: { label: string; variant: "primary" | "quiz" }) {
  const { pending } = useFormStatus();

  const styles =
    variant === "quiz"
      ? { background: "var(--color-gold)",   color: "#000" }
      : { background: "var(--color-accent)", color: "#fff" };

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity disabled:opacity-60"
      style={styles}
    >
      {pending ? (
        <>
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="20" />
          </svg>
          Saving…
        </>
      ) : label}
    </button>
  );
}

type Props = ComponentProps<"form"> & {
  lessonId: string;
  nextUrl: string;
  label: string;
  variant: "primary" | "quiz";
  action: (formData: FormData) => Promise<void>;
};

export function MarkCompleteButton({ lessonId, nextUrl, label, variant, action }: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="nextUrl"  value={nextUrl} />
      <SubmitBtn label={label} variant={variant} />
    </form>
  );
}
