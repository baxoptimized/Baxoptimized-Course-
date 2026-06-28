"use client";

import { ReactNode, useRef, useEffect, useState } from "react";

// Wrapper component: receives the raw <table> children from MDX and renders
// them with proper styling. On mobile, tables with >2 columns become
// horizontally scrollable (stacked-card approach requires DOM inspection
// that's incompatible with streaming RSC).

export function StyledTable({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);

  // Detect on mount whether we have > 2 columns and the viewport is narrow
  useEffect(() => {
    const table = wrapperRef.current?.querySelector("table");
    if (!table) return;
    const colCount = table.querySelectorAll("thead tr th").length;
    function check() {
      setNarrow(colCount > 2 && window.innerWidth < 640);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div data-reveal="true" ref={wrapperRef} className="my-6 rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
      <div className={narrow ? "overflow-x-auto" : ""}>
        <table className="lesson-table w-full text-sm">
          {children}
        </table>
      </div>
    </div>
  );
}

// Individual cell components used by the MDX component map

export function Th({ children }: { children: ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest"
      style={{
        background: "var(--color-navy-800)",
        color: "var(--color-text-muted)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {children}
    </th>
  );
}

export function Td({ children }: { children: ReactNode }) {
  return (
    <td
      className="px-4 py-3 leading-relaxed"
      style={{
        color: "var(--color-text-secondary)",
        borderBottom: "1px solid rgba(28,45,72,0.6)",
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}
