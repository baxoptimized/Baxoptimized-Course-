"use client";

import { useRef, useState } from "react";

export type AssistantProgress = {
  scope: "course" | "module";
  pct: number;
  doneLessons: number;
  totalLessons: number;
  currentModuleTitle?: string | null;
};

type ChatMessage = { role: "user" | "assistant"; content: string };

function checkInMessage({ scope, pct, doneLessons, totalLessons, currentModuleTitle }: AssistantProgress): string {
  const scopeLabel = scope === "course" ? "the course" : "this module";
  if (totalLessons === 0) return "Welcome in. Lesson 1 is a five-minute read — no pressure, just start.";
  if (pct >= 100 && scope === "course") return "Every lesson's done. That's the whole course — your certificate is one click away.";
  if (pct >= 100) return "This module's done. Nice work — on to the next one.";
  if (doneLessons === 0) return "Ready when you are. Lesson 1 takes about five minutes.";
  if (scope === "module" && currentModuleTitle) {
    return `${pct}% through ${currentModuleTitle} — ${doneLessons} of ${totalLessons} lessons done.`;
  }
  if (currentModuleTitle) {
    return `${pct}% through ${scopeLabel}, ${doneLessons} of ${totalLessons} lessons done. Currently in ${currentModuleTitle}.`;
  }
  return `${pct}% through ${scopeLabel} — ${doneLessons} of ${totalLessons} lessons done. Keep the momentum going.`;
}

export function AssistantWidget({
  progress,
  lessonTitle,
  lessonContent,
}: {
  progress: AssistantProgress;
  /** When set (lesson pages), the widget offers real Q&A scoped to this lesson's content. */
  lessonTitle?: string;
  lessonContent?: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "bax@baxoptimized.com.au";
  const canChat = !!lessonContent;

  async function send() {
    const question = input.trim();
    if (!question || sending) return;
    setError(null);
    setInput("");
    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: question }, { role: "assistant", content: "" }]);
    setSending(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, lessonTitle, lessonContent, history }),
      });
      if (!res.ok || !res.body) {
        throw new Error(await res.text().catch(() => "Something went wrong."));
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: full };
          return next;
        });
        threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
      }
    } catch {
      setError("Couldn't reach the assistant — try again, or email us below.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Course assistant"
          className="flex w-[320px] flex-col rounded-2xl p-5 shadow-2xl"
          style={{
            background: "var(--color-navy-900)",
            border: "1px solid var(--color-navy-700)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            maxHeight: "min(600px, 80vh)",
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm"
              style={{ background: "var(--color-accent-subtle)", color: "var(--color-accent)" }}
              aria-hidden="true"
            >
              ●
            </span>
            <p className="font-display text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Your progress
            </p>
          </div>

          <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {checkInMessage(progress)}
          </p>

          <div className="mb-4 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--color-navy-700)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${progress.pct}%`, background: "var(--color-accent)", transition: "width 0.6s ease" }}
            />
          </div>

          {canChat && (
            <div className="border-t pt-3" style={{ borderColor: "var(--color-navy-700)" }}>
              <p className="mb-2 text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>
                Ask about this lesson
              </p>

              {messages.length > 0 && (
                <div ref={threadRef} className="mb-2 max-h-64 space-y-2 overflow-y-auto pr-1">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className="rounded-lg px-3 py-2 text-xs leading-relaxed"
                      style={{
                        background: m.role === "user" ? "var(--color-accent-subtle)" : "var(--color-navy-800)",
                        color: m.role === "user" ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                        marginLeft: m.role === "user" ? "1.5rem" : 0,
                      }}
                    >
                      {m.content || (m.role === "assistant" && sending ? "…" : "")}
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <p className="mb-2 text-xs" style={{ color: "var(--color-error)" }}>
                  {error}
                </p>
              )}

              <form
                className="flex items-center gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What's confusing you?"
                  disabled={sending}
                  className="flex-1 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  style={{
                    background: "var(--color-navy-800)",
                    border: "1px solid var(--color-navy-700)",
                    color: "var(--color-text-primary)",
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  aria-label="Send"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg disabled:opacity-40"
                  style={{ background: "var(--color-accent)", color: "#fff" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--color-navy-700)" }}>
            <p className="mb-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
              {canChat ? "Still stuck? We read every message." : "Stuck on something? We read every message."}
            </p>
            <a
              href={`mailto:${supportEmail}?subject=${encodeURIComponent("Question about the course")}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: "var(--color-accent)", textDecoration: "none" }}
            >
              Email us →
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close progress check-in" : "Open progress check-in"}
        className="flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-105"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(232,100,26,0.35)",
        }}
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2a6 6 0 0 1 6 6c0 2.5-1.5 4-1.5 5.5V15H4.5v-1.5C4.5 12 3 10.5 3 8a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M7 15.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
