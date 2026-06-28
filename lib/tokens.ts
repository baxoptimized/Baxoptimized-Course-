import crypto from "crypto";
import { sql } from "./db";

export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

  await sql`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `;

  return token;
}

export async function consumePasswordResetToken(
  token: string
): Promise<string | null> {
  const rows = await sql`
    SELECT user_id FROM password_reset_tokens
    WHERE token = ${token}
      AND expires_at > NOW()
      AND used = FALSE
  `;

  if (rows.length === 0) return null;

  await sql`
    UPDATE password_reset_tokens SET used = TRUE WHERE token = ${token}
  `;

  return rows[0].user_id as string;
}
