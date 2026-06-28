"use client";

import { useState } from "react";

export function LessonCheckbox({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <label className="flex items-center gap-3 cursor-pointer group my-2">
      <span
        onClick={() => setChecked((c) => !c)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-accent bg-accent text-white"
            : "border-border bg-navy-800 group-hover:border-accent/60"
        }`}
      >
        {checked && (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`text-sm transition-colors ${checked ? "line-through text-text-muted" : "text-text-secondary"}`}>
        {label}
      </span>
    </label>
  );
}
