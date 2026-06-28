"use client";

import { useState, ReactNode } from "react";

const LANG_COLOR: Record<string, string> = {
  bash: "#34d399",
  sh: "#34d399",
  shell: "#34d399",
  js: "#fbbf24",
  javascript: "#fbbf24",
  ts: "#4f7cf7",
  typescript: "#4f7cf7",
  html: "#f87171",
  css: "#c084fc",
  json: "#94a3b8",
  sql: "#f0a843",
  mdx: "#8da0bc",
  md: "#8da0bc",
};

export function CodeBlock({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const lang = className?.replace("language-", "").split(" ")[0] ?? "";
  const langLabel = lang || "code";
  const accentColor = LANG_COLOR[lang] ?? "var(--color-text-muted)";

  function copy() {
    const text =
      typeof children === "string"
        ? children.trim()
        : (document.getElementById("cb-content")?.innerText ?? "");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      data-reveal="true"
      className="group my-6 rounded-xl overflow-hidden"
      style={{
        background: "#111827",          // neutral dark-grey (distinct from prompt card navy)
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: accentColor, opacity: 0.8 }}
          />
          <span
            className="text-xs font-mono font-medium"
            style={{ color: accentColor }}
          >
            {langLabel}
          </span>
        </div>

        <button
          onClick={copy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition-all"
          style={{
            color: copied ? "var(--color-success)" : "var(--color-text-muted)",
            background: "transparent",
          }}
        >
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <rect x="4" y="4" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 4V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto px-5 py-4 text-sm leading-relaxed">
        <code
          id="cb-content"
          className={`font-mono ${className ?? ""}`}
          style={{ color: "#e2e8f0" }}
        >
          {children}
        </code>
      </pre>
    </div>
  );
}
