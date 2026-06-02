import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEALTH_SECRET_HEADER = "x-nursenest-env-health-secret";

function isAuthorized(request: Request): boolean {
  const expected = process.env.NN_RUNTIME_ENV_HEALTH_SECRET?.trim();
  if (!expected) return false;
  const presented = request.headers.get(HEALTH_SECRET_HEADER)?.trim();
  return presented === expected;
}

function hasValue(key: string): boolean {
  return Boolean(process.env[key]?.trim());
}

function resolveAiProviderKey(): string {
  if (hasValue("AI_INTEGRATIONS_OPENAI_API_KEY") || hasValue("OPENAI_API_KEY")) return "openai";
  if (hasValue("OPENROUTER_API_KEY") || hasValue("BLOG_OPENROUTER_API_KEY")) return "openrouter";
  return "none";
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return new NextResponse(null, { status: 404 });
  }

  const deploymentId =
    process.env.DIGITALOCEAN_DEPLOYMENT_ID?.trim() ||
    process.env.APP_DEPLOYMENT_ID?.trim() ||
    process.env.NN_DO_ACTIVE_DEPLOYMENT_ID?.trim() ||
    null;

  return NextResponse.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    DATABASE_URL_present: hasValue("DATABASE_URL"),
    AUTH_SECRET_present: hasValue("AUTH_SECRET"),
    NEXTAUTH_URL_present: hasValue("NEXTAUTH_URL"),
    AUTH_URL_present: hasValue("AUTH_URL"),
    STRIPE_SECRET_KEY_present: hasValue("STRIPE_SECRET_KEY"),
    STRIPE_WEBHOOK_SECRET_present: hasValue("STRIPE_WEBHOOK_SECRET"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_present: hasValue("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
    ai_provider_key: resolveAiProviderKey(),
    NODE_ENV: process.env.NODE_ENV ?? null,
    deploymentId: deploymentId ?? null,
  });
}
