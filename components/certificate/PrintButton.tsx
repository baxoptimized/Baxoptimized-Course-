"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold"
      style={{ background: "var(--color-gold)", color: "#000" }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 5V2h8v3M3 10H1V5h12v5h-2M3 8h8v4H3z"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Save as PDF
    </button>
  );
}
