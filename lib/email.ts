import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    client = new Resend(key);
  }
  return client;
}

export async function sendPurchaseConfirmationEmail(email: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const signupUrl = `${appUrl}/signup?email=${encodeURIComponent(email)}`;
  const from = process.env.RESEND_FROM_EMAIL ?? "Baxoptimized <onboarding@resend.dev>";

  const { error } = await getClient().emails.send({
    from,
    to: email,
    subject: "You're in — create your Baxoptimized account",
    html: `
      <p>Thanks for your purchase! Your payment has been confirmed.</p>
      <p>Click below to create your account and start the course:</p>
      <p><a href="${signupUrl}">${signupUrl}</a></p>
      <p>Use the same email address you just paid with (${email}) when creating your account.</p>
    `,
  });

  if (error) {
    throw new Error(`Resend rejected purchase confirmation email: ${error.name} — ${error.message}`);
  }
}
