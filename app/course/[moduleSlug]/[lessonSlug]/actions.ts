"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";

export async function markLessonComplete(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const lessonId = formData.get("lessonId") as string;
  const nextUrl  = formData.get("nextUrl")  as string;

  await sql`
    INSERT INTO progress (user_id, lesson_id)
    VALUES (${user.userId}, ${lessonId})
    ON CONFLICT DO NOTHING
  `;

  redirect(nextUrl || "/course");
}
