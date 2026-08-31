import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCurrentUser } from "@/lib/session";

const MAX_QUESTION_LENGTH = 2000;
const MAX_HISTORY_TURNS = 6;
const MAX_LESSON_CHARS = 12000;

type HistoryTurn = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("The assistant isn't set up yet — email us instead.", { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const lessonTitle = typeof body?.lessonTitle === "string" ? body.lessonTitle : "";
  const lessonContent = typeof body?.lessonContent === "string" ? body.lessonContent : "";
  const rawHistory: unknown[] = Array.isArray(body?.history) ? body.history : [];

  if (!question) {
    return new Response("Ask a question first.", { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return new Response("That question's a bit long — try trimming it down.", { status: 400 });
  }

  const history: HistoryTurn[] = rawHistory
    .filter(
      (m): m is HistoryTurn =>
        !!m &&
        typeof m === "object" &&
        ((m as Record<string, unknown>).role === "user" || (m as Record<string, unknown>).role === "assistant") &&
        typeof (m as Record<string, unknown>).content === "string"
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION_LENGTH) }));

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `You are the course assistant embedded directly in a lesson on the Baxoptimized course, which teaches beginners to design, build, and launch real websites using an AI-assisted workflow (Claude Design, VS Code + Claude Code, GitHub, Vercel).

You're attached to this lesson right now:

Title: ${lessonTitle || "Untitled lesson"}

Lesson content:
"""
${lessonContent.slice(0, MAX_LESSON_CHARS)}
"""

Only answer questions about this lesson, the course's teaching method, or web-development concepts a beginner in this course would reasonably run into. If a question is unrelated to the course, say briefly that you're scoped to this course and steer back to the lesson — don't answer it.

Keep answers short: a few sentences, plain text, no markdown headers or bullet walls. This is a small chat widget, not a document.`;

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: question },
  ];

  const stream = client.messages.stream({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: systemPrompt,
    output_config: { effort: "low" },
    messages,
  });

  const encoder = new TextEncoder();
  const responseBody = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("Assistant chat error:", err);
        controller.enqueue(encoder.encode("\n\n(Something went wrong on our end — try again in a moment.)"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(responseBody, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
