import { NextResponse } from "next/server";

import {
  CASPER_STRIPE_PRICE_ENV_KEY,
  CASPER_STRIPE_PRODUCT_KEY,
} from "@/lib/casper/casper-premium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CasperCheckoutBody = {
  learnerId?: string;
  returnTo?: string;
};

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as CasperCheckoutBody;
  const priceId = process.env[CASPER_STRIPE_PRICE_ENV_KEY];

  if (!priceId) {
    return NextResponse.json(
      {
        ok: false,
        error: "CASPer checkout is not configured.",
        missingEnv: CASPER_STRIPE_PRICE_ENV_KEY,
        productKey: CASPER_STRIPE_PRODUCT_KEY,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    productKey: CASPER_STRIPE_PRODUCT_KEY,
    priceId,
    learnerId: body.learnerId ?? "guest",
    returnTo: body.returnTo ?? "/app/casper",
    note: "CASPer checkout scaffold is configured. Wire this into the shared Stripe checkout creator before enabling paid traffic.",
  });
}
