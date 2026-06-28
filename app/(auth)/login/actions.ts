"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { verifyPassword, validateEmail } from "@/lib/auth";
import { setSession, SessionPayload } from "@/lib/session";

export type LoginState = { error?: string } | null;

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };

  if (!password) return { error: "Password is required." };

  type UserRow = { id: string; password_hash: string; role: string; has_paid: boolean };
  const rows = await sql`
    SELECT id, password_hash, role, has_paid FROM users WHERE email = ${email}
  `;
  const user = rows[0] as UserRow | undefined;

  // Constant-time path: always run bcrypt even if user not found to prevent timing attacks
  const hashToCheck = user?.password_hash ?? "$2b$12$invalidhashpaddingtomatchlength000000000000000000000";
  const valid = await verifyPassword(password, hashToCheck);

  if (!user || !valid) {
    return { error: "Incorrect email or password." };
  }

  await setSession({
    userId: user.id,
    email,
    role: user.role as SessionPayload["role"],
    hasPaid: Boolean(user.has_paid),
  });
  redirect("/course");
}
