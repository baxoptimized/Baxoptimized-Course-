"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

// ── Scroll progress bar ───────────────────────────────────────────────────────

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="lesson-progress-track"
    >
      <div
        className="lesson-progress-fill"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

// ── GSAP scroll reveal ────────────────────────────────────────────────────────

function useScrollReveal(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then(({ default: gsap }) =>
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const els = containerRef.current?.querySelectorAll<HTMLElement>("[data-reveal='true']");
        if (!els?.length) return;

        // Set initial state
        gsap.set(els, { opacity: 0, y: 18 });

        const triggers = Array.from(els).map((el) =>
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          })
        );

        cleanup = () => {
          triggers.forEach((t) => t.kill());
          ScrollTrigger.getAll().forEach((st) => st.kill());
        };
      })
    );

    return () => cleanup?.();
  }, [containerRef]);
}

// ── Shell component ───────────────────────────────────────────────────────────

export function LessonShell({
  title,
  moduleTitle,
  children,
}: {
  title: string;
  moduleTitle?: string;
  children: ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  useScrollReveal(contentRef);

  return (
    <>
      <ScrollProgressBar />

      <main
        className="mx-auto max-w-3xl px-5 pb-24 pt-10"
        style={{ color: "var(--color-text-primary)" }}
      >
        {/* Breadcrumb */}
        {moduleTitle && (
          <p className="mb-4 text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--color-gold)" }}>
            {moduleTitle}
          </p>
        )}

        {/* Lesson title */}
        <h1
          className="mb-10 text-3xl font-bold tracking-tight leading-snug"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h1>

        {/* MDX content */}
        <div ref={contentRef} className="lesson-prose">
          {children}
        </div>
      </main>
    </>
  );
}
