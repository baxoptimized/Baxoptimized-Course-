// Renders inline SVG diagrams from a text description, or a styled placeholder
// for diagrams too complex to auto-generate.
//
// Flagged as needing real assets (printed to console in dev):
//   - World map, heatmaps, annotated screenshots, balance scales, etc.

const NAVY_800 = "#142035";
const NAVY_700 = "#1c2d48";
const NAVY_600 = "#253a5e";
const ACCENT   = "#4f7cf7";
const GOLD     = "#f0a843";
const TEXT_PRI = "#f0f4ff";
const TEXT_MUT = "#4d6278";

// ── Detection helpers ─────────────────────────────────────────────────────────

function detectType(desc: string): "circle" | "linear" | "layers" | "row" | "complex" {
  const d = desc.toLowerCase();
  if (d.includes("in a circle") || d.includes("loop") || d.includes("cycle") ||
      d.includes("connected circle")) return "circle";
  if (d.includes("layer") || d.includes("split into") || d.includes("stacked") ||
      d.includes("skeleton") || d.includes("skin")) return "layers";
  if (d.includes("icons in a row") || d.includes("in a row") || d.includes("icons —")) return "row";
  if (d.includes("→") || d.includes("in sequence") || d.includes("step") ||
      d.includes("flow") || d.includes("boxes in")) return "linear";
  return "complex";
}

function parseNodes(desc: string): string[] {
  // Try "A → B → C" pattern (after a colon if present)
  const afterColon = desc.split(/:(.+)/)[1]?.trim() ?? desc;
  const arrowNodes = afterColon.split(/\s*→\s*/).map((n) =>
    n.replace(/\.$/, "").trim()
  );
  if (arrowNodes.length >= 2 && arrowNodes.every((n) => n.length < 60)) {
    return arrowNodes;
  }

  // Try "— A, B, C" pattern
  const dashMatch = desc.match(/—\s*(.+)/);
  if (dashMatch) {
    return dashMatch[1]
      .split(/,\s*/)
      .map((n) => n.replace(/^\p{Emoji}+\s*/u, "").trim())
      .filter(Boolean);
  }

  return [];
}

function truncate(s: string, max = 18): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

// ── SVG generators ────────────────────────────────────────────────────────────

function LinearDiagram({ nodes }: { nodes: string[] }) {
  const W = 640;
  const H = 100;
  const PAD = 16;
  const ARROW = 28;
  const usable = W - 2 * PAD;
  const n = nodes.length;
  const boxW = Math.min(120, (usable - (n - 1) * ARROW) / n);
  const boxH = 52;
  const y = (H - boxH) / 2;

  const totalW = n * boxW + (n - 1) * ARROW;
  const startX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Flow diagram">
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill={ACCENT} />
        </marker>
      </defs>
      {nodes.map((label, i) => {
        const x = startX + i * (boxW + ARROW);
        const midX = x + boxW / 2;
        return (
          <g key={i}>
            <rect x={x} y={y} width={boxW} height={boxH} rx="6" fill={NAVY_800} stroke={i === 0 ? ACCENT : NAVY_600} strokeWidth={i === 0 ? 1.5 : 1} />
            {/* Step number */}
            <text x={x + 8} y={y + 13} fill={ACCENT} fontSize="9" fontFamily="ui-monospace,monospace" fontWeight="600">
              {String(i + 1).padStart(2, "0")}
            </text>
            {/* Label — may wrap to two lines */}
            {splitLabel(truncate(label, 20), boxW - 10).map((line, li) => (
              <text key={li} x={midX} y={y + 26 + li * 14} fill={TEXT_PRI} fontSize="11" textAnchor="middle" fontFamily="ui-sans-serif,sans-serif">
                {line}
              </text>
            ))}
            {/* Arrow to next box */}
            {i < n - 1 && (
              <line
                x1={x + boxW + 2}
                y1={y + boxH / 2}
                x2={x + boxW + ARROW - 6}
                y2={y + boxH / 2}
                stroke={ACCENT}
                strokeWidth="1.5"
                markerEnd="url(#arr)"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function CircleDiagram({ nodes }: { nodes: string[] }) {
  const SIZE = 300;
  const CX = 150;
  const CY = 150;
  const R = 105;  // radius for node centres
  const NR = 38;  // node oval half-width
  const NH = 28;  // node oval half-height
  const n = nodes.length;
  const step = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // top

  const points = nodes.map((_, i) => {
    const angle = startAngle + i * step;
    return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
  });

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-sm mx-auto" role="img" aria-label="Cycle diagram">
      <defs>
        <marker id="carr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill={ACCENT} />
        </marker>
      </defs>
      {/* Connecting lines between nodes */}
      {points.map((p, i) => {
        const next = points[(i + 1) % n];
        // Midpoint slightly inward for a curved feel
        const mx = (p.x + next.x) / 2 * 0.85 + CX * 0.15;
        const my = (p.y + next.y) / 2 * 0.85 + CY * 0.15;
        return (
          <path
            key={i}
            d={`M ${p.x} ${p.y} Q ${mx} ${my} ${next.x} ${next.y}`}
            fill="none"
            stroke={ACCENT}
            strokeWidth="1.2"
            opacity="0.5"
            markerEnd="url(#carr)"
          />
        );
      })}
      {/* Node ellipses */}
      {points.map((p, i) => (
        <g key={i}>
          <ellipse cx={p.x} cy={p.y} rx={NR} ry={NH} fill={NAVY_800} stroke={i === 0 ? ACCENT : NAVY_600} strokeWidth={i === 0 ? 1.5 : 1} />
          {splitLabel(truncate(nodes[i], 14), NR * 2 - 4).map((line, li, arr) => (
            <text
              key={li}
              x={p.x}
              y={p.y + (li - (arr.length - 1) / 2) * 13}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={TEXT_PRI}
              fontSize="10"
              fontFamily="ui-sans-serif,sans-serif"
            >
              {line}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}

function LayerDiagram({ nodes }: { nodes: string[] }) {
  const W = 560;
  const LH = 48;
  const GAP = 6;
  const PAD = 40;
  const H = nodes.length * (LH + GAP) + 20;
  const colors = [ACCENT, "#7c9ef7", "#a8bef9", "#c8d4fb", "#dde5fd"];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Layer diagram">
      {nodes.map((label, i) => {
        const y = 10 + i * (LH + GAP);
        const indent = i * 16;
        const w = W - 2 * PAD - indent * 2;
        const x = PAD + indent;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={LH} rx="5" fill={NAVY_800} stroke={colors[i % colors.length]} strokeWidth="1.5" />
            <text x={W / 2} y={y + LH / 2} textAnchor="middle" dominantBaseline="middle" fill={TEXT_PRI} fontSize="12" fontFamily="ui-sans-serif,sans-serif">
              {truncate(label, 36)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RowDiagram({ nodes }: { nodes: string[] }) {
  return <LinearDiagram nodes={nodes} />;
}

// ── Text wrapping helper ──────────────────────────────────────────────────────

function splitLabel(text: string, maxWidth: number): string[] {
  const charsPerLine = Math.max(8, Math.floor(maxWidth / 7));
  if (text.length <= charsPerLine) return [text];
  const mid = Math.floor(text.length / 2);
  const space = text.lastIndexOf(" ", mid);
  if (space < 1) return [text.slice(0, charsPerLine), text.slice(charsPerLine)];
  return [text.slice(0, space).trim(), text.slice(space + 1).trim()];
}

// ── Placeholder card (complex / un-auto-generatable) ─────────────────────────

const COMPLEX_TRIGGERS = [
  "map", "heatmap", "wireframe", "annotated", "balance scale", "logo",
  "palette", "swatch", "screenshot", "colour-coded", "color-coded",
  "spline", "three.js", "real prompt", "f-pattern", "brand board",
  "decision-tree", "decision tree", "looker", "liquid-glass",
];

function isComplex(desc: string): boolean {
  const d = desc.toLowerCase();
  return COMPLEX_TRIGGERS.some((t) => d.includes(t));
}

function PlaceholderCard({ description }: { description: string }) {
  return (
    <div
      className="my-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-8 px-6 text-center"
      style={{ borderColor: NAVY_600, background: "rgba(20,32,53,0.5)" }}
      data-reveal="true"
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill={NAVY_700} />
        <rect x="8" y="10" width="24" height="18" rx="2" stroke={TEXT_MUT} strokeWidth="1.5" />
        <path d="M8 22l7-6 5 5 4-3 8 7" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="17" r="2.5" fill={TEXT_MUT} />
      </svg>
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: TEXT_MUT }}>
        Diagram Placeholder
      </p>
      <p className="text-sm max-w-sm leading-relaxed" style={{ color: TEXT_MUT }}>
        {description}
      </p>
    </div>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

export function DiagramPlaceholder({ description }: { description: string }) {
  if (isComplex(description)) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.info(`[DiagramPlaceholder] Needs manual asset: "${description.slice(0, 80)}"`);
    }
    return <PlaceholderCard description={description} />;
  }

  const type = detectType(description);
  const nodes = parseNodes(description);

  if (nodes.length < 2) return <PlaceholderCard description={description} />;

  const wrapperClass = "my-6 rounded-xl overflow-hidden p-4";
  const wrapperStyle = { background: "rgba(8,15,30,0.6)", border: `1px solid ${NAVY_700}` };

  return (
    <figure data-reveal="true" className={wrapperClass} style={wrapperStyle}>
      {type === "circle" && <CircleDiagram nodes={nodes} />}
      {(type === "linear" || type === "complex") && <LinearDiagram nodes={nodes} />}
      {type === "layers" && <LayerDiagram nodes={nodes} />}
      {type === "row" && <RowDiagram nodes={nodes} />}
      <figcaption className="mt-3 text-center text-xs" style={{ color: TEXT_MUT }}>
        {description.split(/[:.—]/)[0].trim()}
      </figcaption>
    </figure>
  );
}
