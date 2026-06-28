"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { QuizActionState } from "@/app/course/[moduleSlug]/quiz/actions";

export type QuizQuestion = {
  id: string;
  question_text: string;
  options: string[] | null;
  question_type: "multiple_choice" | "reflection";
  order_index: number;
};

// ── Submit button with loading state ─────────────────────────────────────────

function SubmitButton({ allAnswered }: { allAnswered: boolean }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col items-end gap-2">
      {!allAnswered && (
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Answer all questions to submit
        </p>
      )}
      <button
        type="submit"
        disabled={pending || !allAnswered}
        className="inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-semibold transition-opacity disabled:opacity-50"
        style={{ background: "var(--color-accent)", color: "#fff" }}
      >
        {pending ? (
          <>
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                strokeDasharray="40" strokeDashoffset="20" />
            </svg>
            Submitting…
          </>
        ) : (
          "Submit answers →"
        )}
      </button>
    </div>
  );
}

// ── Option card ───────────────────────────────────────────────────────────────

function OptionCard({
  questionId,
  index,
  text,
  selected,
  onSelect,
}: {
  questionId: string;
  index: number;
  text: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const letter = String.fromCharCode(65 + index);

  return (
    <label
      className="flex cursor-pointer items-start gap-4 rounded-lg px-4 py-3.5 transition-all"
      style={{
        background:  selected ? "rgba(79,124,247,0.08)" : "var(--color-navy-800)",
        border:      `1px solid ${selected ? "var(--color-accent)" : "var(--color-navy-600)"}`,
        boxShadow:   selected ? "0 0 0 1px var(--color-accent)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) (e.currentTarget as HTMLElement).style.borderColor = "var(--color-navy-500)";
      }}
      onMouseLeave={(e) => {
        if (!selected) (e.currentTarget as HTMLElement).style.borderColor = "var(--color-navy-600)";
      }}
    >
      <input
        type="radio"
        name={`q_${questionId}`}
        value={index}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold"
        style={{
          background: selected ? "var(--color-accent)" : "var(--color-navy-700)",
          color:      selected ? "#fff" : "var(--color-text-muted)",
        }}
      >
        {letter}
      </span>
      <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
        {text}
      </span>
    </label>
  );
}

// ── Question card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  total,
  selectedIndex,
  reflectionValue,
  onSelect,
  onReflectionChange,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  selectedIndex: number | undefined;
  reflectionValue: string;
  onSelect: (idx: number) => void;
  onReflectionChange: (val: string) => void;
}) {
  const isReflection = question.question_type === "reflection";

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background:  "var(--color-navy-900)",
        border:      "1px solid var(--color-navy-700)",
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums"
          style={{ background: "var(--color-navy-700)", color: "var(--color-text-secondary)" }}
        >
          {index + 1}
        </span>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          of {total}
          {isReflection && (
            <span
              className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(240,168,67,0.15)", color: "var(--color-gold)" }}
            >
              Reflection
            </span>
          )}
        </span>
      </div>

      <p
        className="mb-5 text-base font-medium leading-relaxed"
        style={{ color: "var(--color-text-primary)" }}
      >
        {question.question_text}
      </p>

      {isReflection ? (
        <div>
          <textarea
            name={`q_${question.id}`}
            rows={4}
            placeholder="Type your answer here…"
            value={reflectionValue}
            onChange={(e) => onReflectionChange(e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm leading-relaxed resize-y"
            style={{
              background:  "var(--color-navy-800)",
              border:      "1px solid var(--color-navy-600)",
              color:       "var(--color-text-primary)",
              outline:     "none",
              fontFamily:  "var(--font-sans)",
            }}
            onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-accent)"; }}
            onBlur={(e)  => { (e.target as HTMLElement).style.borderColor = "var(--color-navy-600)"; }}
          />
          <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Reflection questions are always accepted — write in your own words.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {(question.options ?? []).map((opt, idx) => (
            <OptionCard
              key={idx}
              questionId={question.id}
              index={idx}
              text={opt}
              selected={selectedIndex === idx}
              onSelect={() => onSelect(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function QuizForm({
  questions,
  moduleSlug,
  action,
}: {
  questions: QuizQuestion[];
  moduleSlug: string;
  action: (prev: QuizActionState, formData: FormData) => Promise<QuizActionState>;
}) {
  const [state, formAction] = useActionState(action, null);
  const [mcAnswers,   setMcAnswers]   = useState<Record<string, number>>({});
  const [reflections, setReflections] = useState<Record<string, string>>({});

  const mcQuestions  = questions.filter((q) => q.question_type === "multiple_choice");
  const allAnswered  = mcQuestions.every((q) => mcAnswers[q.id] !== undefined);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="moduleSlug" value={moduleSlug} />

      {state?.error && (
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
          style={{
            background: "rgba(248,113,113,0.08)",
            border:     "1px solid rgba(248,113,113,0.25)",
            color:      "var(--color-error)",
          }}
          role="alert"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {state.error}
        </div>
      )}

      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          total={questions.length}
          selectedIndex={mcAnswers[q.id]}
          reflectionValue={reflections[q.id] ?? ""}
          onSelect={(idx) => setMcAnswers((s) => ({ ...s, [q.id]: idx }))}
          onReflectionChange={(val) => setReflections((s) => ({ ...s, [q.id]: val }))}
        />
      ))}

      <div className="pt-2">
        <SubmitButton allAnswered={allAnswered} />
      </div>
    </form>
  );
}
