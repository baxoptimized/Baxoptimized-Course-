#!/usr/bin/env node
/**
 * Admin script: create a new user account.
 * Usage: npm run create-user
 */

import { createInterface } from "readline/promises";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const VALID_ROLES = ["student", "staff", "admin"];

async function prompt(rl, question) {
  return (await rl.question(question)).trim();
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is not set. Run with --env-file=.env.local");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    const email = (await prompt(rl, "Email: ")).toLowerCase();
    if (!email.includes("@")) {
      console.error("Error: invalid email address");
      process.exit(1);
    }

    const password = await prompt(rl, "Temporary password (min 8 chars): ");
    if (password.length < 8) {
      console.error("Error: password must be at least 8 characters");
      process.exit(1);
    }

    const roleInput = await prompt(rl, "Role (student/staff/admin) [student]: ");
    const role = VALID_ROLES.includes(roleInput) ? roleInput : "student";
    if (roleInput && !VALID_ROLES.includes(roleInput)) {
      console.error(`Warning: unknown role "${roleInput}", defaulting to "student"`);
    }

    rl.close();

    console.log("\nHashing password...");
    const passwordHash = await bcrypt.hash(password, 12);

    // Staff and admin never need to pay; grant has_paid so middleware lets them through
    const hasPaid = role !== "student";

    const rows = await sql`
      INSERT INTO users (email, password_hash, role, has_paid)
      VALUES (${email}, ${passwordHash}, ${role}, ${hasPaid})
      RETURNING id, email, role, created_at
    `;

    const user = rows[0];
    console.log("\nUser created successfully:");
    console.log(`  ID:    ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role:  ${user.role}`);
  } catch (err) {
    rl.close();
    if (err?.code === "23505") {
      console.error("Error: an account with that email already exists.");
    } else {
      console.error("Error:", err.message ?? err);
    }
    process.exit(1);
  }
}

main();
