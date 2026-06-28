"use client";

import { useRef, useState, ReactNode } from "react";

// Splits text on [bracketed placeholders] and renders them highlighted.
function HighlightedCode({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\[.+\]$/.test(part) ? (
          <mark
            key={i}
            style={{
              background: "rgba(240,168,67,0.20)",
              color: "var(--color-gold)",
              borderRadius: "3px",
              padding: "0 2px",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Recursively extract plain text from React children (handles nested elements
// rendered from MDX HTML entity decoding).
function childrenToText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(childrenToText).join("");
  if (node && typeof node === "object" && "props" in (node as object)) {
    const props = (node as { props: Record<string, unknown> }).props;
    return childrenToText(props?.children as ReactNode);
  }
  return "";
}

export function PromptCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const label = title || "PROMPT";

  function copy() {
    const text = codeRef.current?.innerText?.trim() ?? childrenToText(children).trim();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Extract the raw text for display with bracket highlighting
  const rawText = childrenToText(children).trim();

  return (
    <div
      data-reveal="true"
      className="my-8 rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d1628 0%, #080f1e 100%)",
        border: "1px solid var(--color-accent)",
        boxShadow: "0 0 0 1px rgba(79,124,247,0.10), 0 8px 32px rgba(79,124,247,0.12)",
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: "rgba(79,124,247,0.10)",
          borderBottom: "1px solid rgba(79,124,247,0.20)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Robot icon */}
          <span
            className="flex h-6 w-6 items-center justify-center rounded"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="4.5" cy="8.5" r="1" fill="currentColor" />
              <circle cx="9.5" cy="8.5" r="1" fill="currentColor" />
              <path d="M5.5 2.5A1.5 1.5 0 0 1 7 1a1.5 1.5 0 0 1 1.5 1.5V5h-3V2.5Z" stroke="currentColor" strokeWidth="1.3" />
              <path d="M7 1V0M4 5H2.5M11.5 5H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </span>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--color-accent)" }}
          >
            {label}
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={copy}
          aria-label="Copy prompt"
          className="flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all"
          style={{
            background: copied ? "rgba(52,211,153,0.15)" : "rgba(79,124,247,0.15)",
            color: copied ? "var(--color-success)" : "var(--color-accent)",
            border: `1px solid ${copied ? "rgba(52,211,153,0.30)" : "rgba(79,124,247,0.25)"}`,
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="4" y="4" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 4V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre
        ref={codeRef}
        className="overflow-x-auto px-5 py-5 text-sm leading-relaxed"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-text-primary)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <HighlightedCode text={rawText} />
      </pre>
    </div>
  );
}
