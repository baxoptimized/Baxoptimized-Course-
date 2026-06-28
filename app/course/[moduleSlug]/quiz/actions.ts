"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";

type QuizQuestion = {
  id: string;
  question_type: "multiple_choice" | "reflection";
  correct_answer_index: number | null;
};

export type QuizActionState = { error: string } | null;

export async function submitQuiz(
  _prev: QuizActionState,
  formData: FormData
): Promise<QuizActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const moduleSlug = formData.get("moduleSlug") as string;
  if (!moduleSlug) redirect("/course");

  let attemptId: string;

  try {
    const [modRaw, questionsRaw] = await Promise.all([
      sql`SELECT id, pass_threshold FROM modules WHERE slug = ${moduleSlug} LIMIT 1`,
      sql`
        SELECT id, question_type, correct_answer_index
        FROM quiz_questions
        WHERE module_id = (SELECT id FROM modules WHERE slug = ${moduleSlug})
        ORDER BY order_index
      `,
    ]);

    const mod       = (modRaw      as unknown as { id: string; pass_threshold: number }[])[0];
    const questions = questionsRaw as unknown as QuizQuestion[];

    if (!mod) redirect("/course");

    // Collect submitted answers — form field name is "q_<question-uuid>"
    const answers: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("q_")) {
        answers[key.slice(2)] = value as string;
      }
    }

    const mcQuestions = questions.filter((q) => q.question_type === "multiple_choice");
    let correct = 0;
    for (const q of mcQuestions) {
      const given = parseInt(answers[q.id] ?? "", 10);
      if (!isNaN(given) && given === q.correct_answer_index) {
        correct++;
      }
    }

    const score  = mcQuestions.length > 0
      ? Math.round((correct / mcQuestions.length) * 100)
      : 100;
    const passed = score >= mod.pass_threshold;

    const attemptRaw = await sql`
      INSERT INTO quiz_attempts (user_id, module_id, score, passed, answers)
      VALUES (${user.userId}, ${mod.id}, ${score}, ${passed}, ${JSON.stringify(answers)})
      RETURNING id
    `;
    attemptId = (attemptRaw as unknown as { id: string }[])[0].id;
  } catch (err) {
    unstable_rethrow(err);
    console.error("Quiz submission failed:", err);
    return { error: "Something went wrong saving your answers. Please try again." };
  }

  redirect(`/course/${moduleSlug}/quiz?attempt=${attemptId!}`);
}
