"use client";

import { useEffect, useState } from "react";

function makeKey(label: string) {
  // Use pathname + label slug so keys survive route changes
  const slug = label
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 60);
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  return `checklist:${path}:${slug}`;
}

export function Checkbox({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  const [mounted, setMounted] = useState(false);

  // Read persisted state after mount to avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(makeKey(label));
    if (stored !== null) setChecked(stored === "1");
  }, [label]);

  function toggle() {
    setChecked((prev) => {
      const next = !prev;
      localStorage.setItem(makeKey(label), next ? "1" : "0");
      return next;
    });
  }

  return (
    <label
      className="flex cursor-pointer items-start gap-3 py-1.5 group select-none"
      style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.15s" }}
    >
      {/* Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={toggle}
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all duration-200"
        style={{
          background: checked ? "var(--color-accent)" : "var(--color-navy-800)",
          border: `1.5px solid ${checked ? "var(--color-accent)" : "var(--color-navy-600)"}`,
          boxShadow: checked ? "0 0 0 3px rgba(79,124,247,0.15)" : undefined,
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 5l2.5 2.5 4.5-4.5"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Label text */}
      <span
        className="text-sm leading-relaxed transition-colors duration-200"
        style={{
          color: checked ? "var(--color-text-muted)" : "var(--color-text-secondary)",
          textDecoration: checked ? "line-through" : "none",
          textDecorationColor: "var(--color-text-muted)",
        }}
      >
        {label}
      </span>
    </label>
  );
}
