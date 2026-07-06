"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { hashPassword, validateEmail, validatePassword } from "@/lib/auth";
import { setSession } from "@/lib/session";

export type SignupState = { error?: string } | null;

export async function signupAction(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  const purchaseRows = await sql`
    SELECT id FROM purchases WHERE lower(email) = ${email} AND claimed_at IS NULL LIMIT 1
  `;
  const purchase = (purchaseRows as { id: string }[])[0];
  if (!purchase) {
    return {
      error:
        "We couldn't find a completed purchase for that email address. Use the same email you paid with, or check your inbox for the confirmation link.",
    };
  }

  const passwordHash = await hashPassword(password);

  let userId: string;
  try {
    const rows = await sql`
      INSERT INTO users (email, password_hash) VALUES (${email}, ${passwordHash}) RETURNING id
    `;
    userId = rows[0].id as string;
  } catch (err: unknown) {
    const pg = err as { code?: string };
    if (pg.code === "23505") {
      return { error: "An account with that email already exists." };
    }
    console.error("Signup DB error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  await sql`
    UPDATE purchases SET claimed_at = NOW(), user_id = ${userId} WHERE id = ${purchase.id}
  `;

  await setSession({ userId, email, role: "student" });
  redirect("/course");
}
