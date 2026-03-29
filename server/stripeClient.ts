import Stripe from "stripe";

type StripeCredentials = {
  publishableKey: string;
  secretKey: string;
};

type CredentialInfo = {
  keyType: "LIVE" | "TEST" | "UNKNOWN";
  keyPrefix: string;
  source: "cache" | "env" | "missing";
};

let cached: StripeCredentials | null = null;

/* =========================
   HELPERS
========================= */

function isProduction(): boolean {
  return process.env.REPLIT_DEPLOYMENT === "1";
}

function mask(key: string): string {
  return key.slice(0, 10) + "..." + key.slice(-4);
}

function getEnvCredentials(): StripeCredentials | null {
  const secret = process.env.STRIPE_SECRET_KEY;
  const pub =
    process.env.STRIPE_PUBLISHABLE_KEY ||
    process.env.VITE_STRIPE_PUBLIC_KEY;

  if (!secret || !pub) return null;

  return { secretKey: secret, publishableKey: pub };
}

function getKeyType(secretKey?: string): "LIVE" | "TEST" | "UNKNOWN" {
  if (!secretKey) return "UNKNOWN";
  if (secretKey.startsWith("sk_live_")) return "LIVE";
  if (secretKey.startsWith("sk_test_")) return "TEST";
  return "UNKNOWN";
}

function validateKeys(creds: StripeCredentials) {
  if (isProduction()) {
    if (creds.secretKey.startsWith("sk_test_")) {
      throw new Error("Stripe misconfigured: TEST key in production");
    }
    if (creds.publishableKey.startsWith("pk_test_")) {
      throw new Error("Stripe misconfigured: TEST publishable key in production");
    }
  }
}

/* =========================
   CORE CREDENTIAL LOADER
========================= */

async function getCredentials(): Promise<StripeCredentials> {
  if (cached) return cached;

  const envCreds = getEnvCredentials();

  if (!envCreds) {
    throw new Error(
      "Stripe keys missing. Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY"
    );
  }

  validateKeys(envCreds);

  console.log(
    `[Stripe] Loaded (${isProduction() ? "prod" : "dev"}) → ${mask(
      envCreds.secretKey
    )}`
  );

  cached = envCreds;
  return envCreds;
}

/* =========================
   CLIENT
========================= */

export async function getStripeClient(): Promise<Stripe> {
  const { secretKey } = await getCredentials();

  return new Stripe(secretKey, {
    apiVersion: "2025-08-27.basil" as any,
  });
}

/* =========================
   UTILITIES
========================= */

export async function getPublishableKey(): Promise<string> {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

// Backward-compatible alias used throughout route modules.
export async function getUncachableStripeClient(): Promise<Stripe> {
  return getStripeClient();
}

// Backward-compatible alias used in existing route modules.
export async function getStripePublishableKey(): Promise<string> {
  return getPublishableKey();
}

export function getCredentialInfo(): CredentialInfo {
  if (!cached) {
    const envCreds = getEnvCredentials();
    if (!envCreds) {
      return { keyType: "UNKNOWN", keyPrefix: "none", source: "missing" };
    }
    return {
      keyType: getKeyType(envCreds.secretKey),
      keyPrefix: envCreds.secretKey.slice(0, 8),
      source: "env",
    };
  }

  return {
    keyType: getKeyType(cached.secretKey),
    keyPrefix: cached.secretKey.slice(0, 8),
    source: "cache",
  };
}

export async function validateStripeConnection(): Promise<boolean> {
  try {
    const stripe = await getStripeClient();
    await stripe.balance.retrieve();

    console.log("[Stripe] Connection OK");
    return true;
  } catch (err: any) {
    console.error("[Stripe] Connection FAILED:", err.message);

    // reset cache if bad key
    cached = null;

    return false;
  }
}

export function getStripeStatus() {
  if (!cached) {
    return {
      status: "not_loaded",
      mode: "unknown",
    };
  }

  return {
    status: "ready",
    mode: cached.secretKey.startsWith("sk_live_") ? "live" : "test",
  };
}

/* =========================
   OPTIONAL SYNC (SAFE LOAD)
========================= */

let stripeSync: any = null;

export async function getStripeSync() {
  if (stripeSync) return stripeSync;

  const { StripeSync } = await import("stripe-replit-sync");
  const { secretKey } = await getCredentials();

  stripeSync = new StripeSync({
    poolConfig: {
      connectionString: process.env.DATABASE_URL || "",
      max: 2,
    },
    stripeSecretKey: secretKey,
  });

  return stripeSync;
}