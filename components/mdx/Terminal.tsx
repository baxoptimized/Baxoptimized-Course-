// Renders a stylized terminal window for command/output sequences — git,
// npm, vercel deploy, etc. Deliberately generic chrome (not a specific
// terminal app's real UI) since that's accurate regardless of what the
// student's own machine actually looks like.

function parseLine(line: string): { type: "command" | "output" | "comment"; text: string } {
  if (line.startsWith("$ ")) return { type: "command", text: line.slice(2) };
  if (line.startsWith("# ")) return { type: "comment", text: line.slice(2) };
  return { type: "output", text: line };
}

export function Terminal({ children, label }: { children: string; label?: string }) {
  const lines = children.trim().split("\n").map(parseLine);

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
