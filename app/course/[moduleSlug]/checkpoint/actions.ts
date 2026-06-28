"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";

export type CheckpointActionState = { error: string } | null;

export async function submitCheckpoint(
  _prev: CheckpointActionState,
  formData: FormData
): Promise<CheckpointActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const moduleSlug = formData.get("moduleSlug") as string;
  const notes      = (formData.get("notes") as string | null) ?? "";
  const file       = formData.get("screenshot") as File | null;

  if (!moduleSlug) redirect("/course");

  try {
    const modRaw = await sql`
      SELECT id, slug, hard_gate FROM modules WHERE slug = ${moduleSlug} LIMIT 1
    `;
    const mod = (modRaw as unknown as { id: string; slug: string; hard_gate: boolean }[])[0];
    if (!mod) redirect("/course");

    const status = mod.hard_gate ? "pending" : "approved";

    const fileUrls: string[] = [];
    if (file && file.size > 0) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.warn("BLOB_READ_WRITE_TOKEN not set — file upload skipped");
      } else {
        try {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const blob = await put(
            `checkpoints/${user.userId}/${Date.now()}-${safeName}`,
            file,
            { access: "public" },
          );
          fileUrls.push(blob.url);
        } catch (uploadErr) {
          console.error("Blob upload failed — continuing without file:", uploadErr);
        }
      }
    }

    await sql`
      INSERT INTO checkpoint_submissions (user_id, module_id, content, file_urls, status)
      VALUES (
        ${user.userId},
        ${mod.id},
        ${notes},
        ${JSON.stringify(fileUrls)},
        ${status}
      )
    `;
  } catch (err) {
    unstable_rethrow(err);
    console.error("Checkpoint submission failed:", err);
    return { error: "Something went wrong saving your submission. Please try again." };
  }

  redirect(`/course/${moduleSlug}/checkpoint`);
}
