import Stripe from "stripe";
import { sql } from "@/lib/db";
import { createPasswordResetToken } from "@/lib/tokens";
import { sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", msg);
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email;
    const stripeCustomerId =
      typeof session.customer === "string" ? session.customer : null;

    if (!email) {
      console.error("Stripe webhook: no email on completed session", session.id);
      return new Response("No email on session", { status: 400 });
    }

    const lowerEmail = email.toLowerCase();

    // Upsert user: create if new, update has_paid if existing
    const rows = await sql`
      INSERT INTO users (email, has_paid, stripe_customer_id)
      VALUES (${lowerEmail}, TRUE, ${stripeCustomerId})
      ON CONFLICT (email)
      DO UPDATE SET has_paid = TRUE,
                    stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, users.stripe_customer_id)
      RETURNING id
    `;
    const userId = rows[0].id as string;

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const token = await createPasswordResetToken(userId);
    const setPasswordUrl = `${base}/set-password?token=${token}`;

    try {
      await sendWelcomeEmail(lowerEmail, setPasswordUrl);
    } catch (err) {
      // Don't fail the webhook if email sending fails — account is already created
      console.error("Failed to send welcome email:", err);
    }
  }

  return new Response("ok", { status: 200 });
}
