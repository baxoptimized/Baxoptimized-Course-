import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@/lib/db";
import { sendPurchaseConfirmationEmail } from "@/lib/email";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // This Stripe account is used for more than just the course, so this
  // webhook (scoped to the whole account) fires for every product's
  // checkout — not just the course's. Only react to sessions started
  // from one of the course's own Payment Link(s).
  const allowedLinkIds = (process.env.STRIPE_COURSE_PAYMENT_LINK_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (allowedLinkIds.length === 0) {
    console.error(
      "STRIPE_COURSE_PAYMENT_LINK_IDS is not set — ignoring checkout session to avoid granting course access for unrelated purchases:",
      session.id
    );
    return NextResponse.json({ received: true });
  }

  const sessionLinkId = typeof session.payment_link === "string" ? session.payment_link : session.payment_link?.id;
  if (!sessionLinkId || !allowedLinkIds.includes(sessionLinkId)) {
    return NextResponse.json({ received: true });
  }

  const email = session.customer_details?.email ?? session.customer_email;

  if (!email) {
    console.error("Checkout session completed with no email:", session.id);
    return NextResponse.json({ received: true });
  }

  let inserted: Record<string, unknown>[];
  try {
    inserted = await sql`
      INSERT INTO purchases (email, stripe_session_id, stripe_customer_id, amount_total, currency)
      VALUES (
        ${email.toLowerCase()},
        ${session.id},
        ${typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null)},
        ${session.amount_total},
        ${session.currency}
      )
      ON CONFLICT (stripe_session_id) DO NOTHING
      RETURNING id
    `;
  } catch (err) {
    console.error("Failed to record purchase:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (inserted.length === 0) {
    // Row already existed — a retried/duplicate webhook delivery for a session
    // we've already recorded. Don't re-send the confirmation email.
    return NextResponse.json({ received: true });
  }

  try {
    await sendPurchaseConfirmationEmail(email);
  } catch (err) {
    // Purchase is already recorded — don't fail the webhook over an email hiccup.
    console.error("Failed to send purchase confirmation email:", err);
  }

  return NextResponse.json({ received: true });
}
