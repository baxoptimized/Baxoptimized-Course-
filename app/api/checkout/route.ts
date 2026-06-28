import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) {
    return NextResponse.json({ error: "NEXT_PUBLIC_BASE_URL not set" }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Number(process.env.COURSE_PRICE_CENTS ?? 29700), // $297 default
          product_data: {
            name: "Baxoptimized Course",
            description: "Lifetime access to all modules, quizzes, and community.",
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${base}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
