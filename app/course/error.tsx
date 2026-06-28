"use client";

import { useEffect } from "react";

export default function CourseError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "var(--color-navy-950)" }}
    >
      <div className="max-w-sm w-full text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="mx-auto mb-5"
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="var(--color-error)"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />
          <path
            d="M24 15v12M24 31v2"
            stroke="var(--color-error)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <h1
          className="mb-2 text-xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Something went wrong
        </h1>
        <p
          className="mb-8 text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          We couldn&apos;t load this page. This is usually a temporary issue —
          try again or head back to the dashboard.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={unstable_retry}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            Try again
          </button>
          <a
            href="/course"
            className="text-sm"
            style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
          >
            ← Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
