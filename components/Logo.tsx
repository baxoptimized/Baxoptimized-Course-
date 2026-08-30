"use client";

import { useEffect, useState } from "react";

// Uses public/LOGOS/baxoptimized-logo-black-bg.png — the only one of the four
// supplied variants with light text, so it's the one that reads on our dark
// nav (the others are dark text on transparent, meant for light backgrounds,
// or a small square icon mark). Renders the text fallback until a
// client-side preload confirms the image actually loads — deliberately NOT
// an <img onError>: that races React hydration (the native error event can
// fire before React attaches the listener) and gets stuck showing a
// broken-image icon instead of falling back.
export function Logo({ className, height = 22 }: { className?: string; height?: number }) {
  const [imageOk, setImageOk] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImageOk(true);
    img.onerror = () => setImageOk(false);
    img.src = "/LOGOS/baxoptimized-logo-black-bg.png";
  }, []);

  if (imageOk) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src="/LOGOS/baxoptimized-logo-black-bg.png"
        alt="Baxoptimized"
        height={height}
        style={{ height, width: "auto" }}
        className={className}
      />
    );
  }

  return (
    <span
      className={`font-display text-sm font-semibold uppercase tracking-wide ${className ?? ""}`}
      style={{ color: "var(--color-gold)" }}
    >
      Baxoptimized
    </span>
  );
}
