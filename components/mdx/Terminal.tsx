// Renders a stylized terminal window for command/output sequences — git,
// npm, vercel deploy, etc. Deliberately generic chrome (not a specific
// terminal app's real UI) since that's accurate regardless of what the
// student's own machine actually looks like.
//
// GOTCHA: MDX parses JSX children as nested markdown before this component
// ever sees them. A line starting with "# " becomes an H1 heading (not a
// "# comment" line) and gets silently mangled — same risk for "-", "*",
// ">", or a leading numbered list, at the start of a line. When authoring
// a <Terminal> block, only use "$ command" and plain output lines; avoid
// the "# comment" convention and any line starting with those characters.

import type { ReactNode } from "react";

function parseLine(line: string): { type: "command" | "output" | "comment"; text: string } {
  if (line.startsWith("$ ")) return { type: "command", text: line.slice(2) };
  if (line.startsWith("# ")) return { type: "comment", text: line.slice(2) };
  return { type: "output", text: line };
}

// MDX passes multi-line JSX children as an array of text/element nodes, not
// a single string — flatten it before splitting into lines. A blank line in
// the source becomes a paragraph break once MDX re-parses the JSX children
// as markdown, i.e. separate sibling nodes at the top level; joining those
// with "" would fuse two commands onto one line instead of just losing the
// blank line, so the top-level array rejoins with "\n\n" (nested/inline
// children within one line still join with no separator).
function childrenToText(node: ReactNode, topLevel = false): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    const parts = node.map((child) => childrenToText(child, false));
    return topLevel ? parts.join("\n\n") : parts.join("");
  }
  if (node && typeof node === "object" && "props" in (node as object)) {
    const props = (node as { props: Record<string, unknown> }).props;
    return childrenToText(props?.children as ReactNode);
  }
  return "";
}

export function Terminal({ children, label }: { children: ReactNode; label?: string }) {
  const lines = childrenToText(children, true).trim().split("\n").map(parseLine);

  return (
    <figure data-reveal="true" className="my-6">
      <div
        className="mx-auto max-w-2xl overflow-hidden rounded-lg"
        style={{ border: "1px solid var(--color-navy-600)" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ background: "var(--color-navy-800)", borderBottom: "1px solid var(--color-navy-600)" }}
        >
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#f87171" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#fbbf24" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#34d399" }} />
          </span>
          {label && (
            <span
              className="mx-auto -ml-14 font-mono text-[11px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {label}
            </span>
          )}
        </div>
        <pre
          className="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed"
          style={{ background: "var(--color-navy-900)", fontFamily: "var(--font-mono)" }}
        >
          {lines.map((line, i) => (
            <div key={i}>
              {line.type === "command" && (
                <span>
                  <span style={{ color: "var(--color-accent)" }}>$ </span>
                  <span style={{ color: "var(--color-text-primary)" }}>{line.text}</span>
                </span>
              )}
              {line.type === "comment" && (
                <span style={{ color: "var(--color-text-muted)" }}># {line.text}</span>
              )}
              {line.type === "output" && (
                <span style={{ color: "var(--color-text-secondary)" }}>{line.text || " "}</span>
              )}
            </div>
          ))}
        </pre>
      </div>
    </figure>
  );
}
