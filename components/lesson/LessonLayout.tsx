"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

// ── Scroll progress bar ───────────────────────────────────────────────────────

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div aria-hidden="true" className="lesson-progress-track">
      <div className="lesson-progress-fill" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

// ── GSAP scroll reveal ────────────────────────────────────────────────────────

function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then(({ default: gsap }) =>
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const els = ref.current?.querySelectorAll<HTMLElement>("[data-reveal='true']");
        if (!els?.length) return;
        gsap.set(els, { opacity: 0, y: 18 });
        const triggers = Array.from(els).map((el) =>
          gsap.to(el, {
            opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
          })
        );
        cleanup = () => {
          triggers.forEach((t) => t.kill());
          ScrollTrigger.getAll().forEach((st) => st.kill());
        };
      })
    );
    return () => cleanup?.();
  }, [ref]);
}

// ── Layout ────────────────────────────────────────────────────────────────────

export function LessonLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  useScrollReveal(contentRef);

  return (
    <>
      <ScrollProgressBar />

      <div className="flex min-h-dvh">
        {/* Sidebar — desktop only */}
        <aside
          className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 overflow-y-auto"
          style={{
            position:   "sticky",
            top:        "49px",
            height:     "calc(100dvh - 49px)",
            background: "var(--color-navy-900)",
            borderRight: "1px solid var(--color-navy-700)",
          }}
        >
          {sidebar}
        </aside>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          <main className="mx-auto max-w-3xl px-5 py-10 pb-32">
            <div ref={contentRef} className="lesson-prose">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
