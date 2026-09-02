"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function dismissWelcome() {
  const store = await cookies();
  store.set("welcomed", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  redirect("/course");
}
