"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { hashPassword, validatePassword } from "@/lib/auth";
import { setSession, SessionPayload } from "@/lib/session";
import { consumePasswordResetToken } from "@/lib/tokens";

export type SetPasswordState = { error?: string } | null;

export async function setPasswordAction(
  _prev: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const token = (formData.get("token") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const confirm = (formData.get("confirm") as string | null) ?? "";

  if (!token) return { error: "Invalid or expired link." };

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  if (password !== confirm) return { error: "Passwords do not match." };

  const userId = await consumePasswordResetToken(token);
  if (!userId) return { error: "This link has expired or already been used." };

  const passwordHash = await hashPassword(password);

  const rows = await sql`
    UPDATE users
    SET password_hash = ${passwordHash}
    WHERE id = ${userId}
    RETURNING id, email, role, has_paid
  `;

  if (rows.length === 0) return { error: "Account not found." };

  const user = rows[0];
  await setSession({
    userId: user.id as string,
    email: user.email as string,
    role: user.role as SessionPayload["role"],
    hasPaid: Boolean(user.has_paid),
  });

  redirect("/course");
}
