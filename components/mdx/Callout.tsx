"use client";

import { ReactNode } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export type CalloutType =
  | "tip"        // 💡
  | "warning"    // ⚠️
  | "keypoint"   // 🎯
  | "link"       // 🔗
  | "practical"  // 🛠️
  | "stop"       // 🚫
  | "pin"        // 📍
  | "lock"       // 🔒
  | "info";      // default / ☁️ / other

/** Map the leading emoji in a markdown blockquote to the right callout type. */
export function emojiToCalloutType(text: string): CalloutType | null {
  if (text.includes("💡")) return "tip";
  if (text.includes("⚠️") || text.includes("⚠")) return "warning";
  if (text.includes("🎯")) return "keypoint";
  if (text.includes("🔗")) return "link";
  if (text.includes("🛠️") || text.includes("🛠")) return "practical";
  if (text.includes("🚫")) return "stop";
  if (text.includes("📍")) return "pin";
  if (text.includes("🔒")) return "lock";
  // Everything else that starts with any emoji-ish character is generic info
  return "info";
}

// ── Per-type styling ─────────────────────────────────────────────────────────

type TypeDef = {
  label: string;
  icon: ReactNode;
  borderColor: string;
  bgColor: string;
  labelColor: string;
  prominent?: boolean;    // 🎯 gets extra visual weight
  monospace?: boolean;    // 🛠️ gets monospace feel
};

const TYPES: Record<CalloutType, TypeDef> = {
  tip: {
    label: "Tip",
    icon: <LightbulbIcon />,
    borderColor: "var(--color-accent)",
    bgColor: "rgba(79,124,247,0.08)",
    labelColor: "var(--color-accent)",
  },
  warning: {
    label: "Warning",
    icon: <WarningIcon />,
    borderColor: "var(--color-warning)",
    bgColor: "rgba(251,191,36,0.08)",
    labelColor: "var(--color-warning)",
  },
  keypoint: {
    label: "Key point",
    icon: <TargetIcon />,
    borderColor: "var(--color-gold)",
    bgColor: "rgba(240,168,67,0.10)",
    labelColor: "var(--color-gold)",
    prominent: true,
  },
  link: {
    label: "Connects to",
    icon: <LinkIcon />,
    borderColor: "var(--color-navy-500)",
    bgColor: "rgba(47,74,119,0.25)",
    labelColor: "var(--color-text-secondary)",
  },
  practical: {
    label: "Practical",
    icon: <ToolboxIcon />,
    borderColor: "var(--color-success)",
    bgColor: "rgba(52,211,153,0.07)",
    labelColor: "var(--color-success)",
    monospace: true,
  },
  stop: {
    label: "Don't do this",
    icon: <StopIcon />,
    borderColor: "var(--color-error)",
    bgColor: "rgba(248,113,113,0.08)",
    labelColor: "var(--color-error)",
  },
  pin: {
    label: "Note",
    icon: <PinIcon />,
    borderColor: "var(--color-navy-600)",
    bgColor: "rgba(37,58,94,0.30)",
    labelColor: "var(--color-text-muted)",
  },
  lock: {
    label: "Restricted",
    icon: <LockIcon />,
    borderColor: "var(--color-error)",
    bgColor: "rgba(248,113,113,0.06)",
    labelColor: "var(--color-error)",
  },
  info: {
    label: "Note",
    icon: <InfoIcon />,
    borderColor: "var(--color-navy-600)",
    bgColor: "rgba(37,58,94,0.30)",
    labelColor: "var(--color-text-muted)",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export function Callout({
  type = "info",
  children,
}: {
  type?: CalloutType;
  children: ReactNode;
}) {
  const t = TYPES[type];

  return (
    <div
      data-reveal="true"
      style={{
        borderLeftColor: t.borderColor,
        backgroundColor: t.bgColor,
        boxShadow: t.prominent
          ? `0 0 0 1px ${t.borderColor}33, 0 4px 24px ${t.borderColor}18`
          : undefined,
      }}
      className={[
        "my-6 rounded-r-xl border-l-[3px] px-5 py-4",
        t.prominent ? "py-5" : "",
        t.monospace ? "font-mono text-sm" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Label row */}
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: t.labelColor }} className="flex h-4 w-4 shrink-0 items-center">
          {t.icon}
        </span>
        <span
          style={{ color: t.labelColor }}
          className={[
            "text-xs font-bold uppercase tracking-widest",
            t.prominent ? "text-sm" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {t.label}
        </span>
      </div>

      {/* Content */}
      <div
        style={{ color: "var(--color-text-secondary)" }}
        className={[
          "[&>p]:mt-0 [&>p]:mb-0 [&>p+p]:mt-2 leading-relaxed",
          t.prominent ? "text-base font-medium" : "text-sm",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

// ── Icons (inline SVG, no dep) ───────────────────────────────────────────────

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2a4 4 0 0 1 2 7.464V11H6V9.464A4 4 0 0 1 8 2Z" />
      <path d="M6 11h4v1.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V11Z" />
    </svg>
  );
}
function WarningIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.5">
      <path d="M7.12 2.6a1 1 0 0 1 1.76 0l5.5 9.5A1 1 0 0 1 13.5 13.5h-11a1 1 0 0 1-.88-1.4l5.5-9.5Z" />
      <path d="M8 6.5v3M8 11.25v.25" strokeLinecap="round" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <circle cx="8" cy="8" r="3" />
      <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.5 9.5a3.536 3.536 0 0 0 5 0l2-2a3.536 3.536 0 0 0-5-5l-1 1" strokeLinecap="round" />
      <path d="M9.5 6.5a3.536 3.536 0 0 0-5 0l-2 2a3.536 3.536 0 0 0 5 5l1-1" strokeLinecap="round" />
    </svg>
  );
}
function ToolboxIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="7" width="13" height="7" rx="1" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" />
      <path d="M1.5 10h13" />
    </svg>
  );
}
function StopIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2a3.5 3.5 0 0 1 3.5 3.5c0 2.625-3.5 7-3.5 7S4.5 8.125 4.5 5.5A3.5 3.5 0 0 1 8 2Z" />
      <circle cx="8" cy="5.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="7.5" width="10" height="7" rx="1" />
      <path d="M5 7.5V5a3 3 0 0 1 6 0v2.5" strokeLinecap="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7.5v4M8 5.5v.5" strokeLinecap="round" />
    </svg>
  );
}
