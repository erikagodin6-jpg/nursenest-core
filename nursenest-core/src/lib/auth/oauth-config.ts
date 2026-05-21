import type { NextAuthConfig } from "next-auth";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";

function envTrim(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v && v.length > 0 ? v : undefined;
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(envTrim("AUTH_GOOGLE_ID") && envTrim("AUTH_GOOGLE_SECRET"));
}

export function isAppleOAuthConfigured(): boolean {
  if (envTrim("AUTH_APPLE_ID") && envTrim("AUTH_APPLE_SECRET")) return true;
  return Boolean(
    envTrim("AUTH_APPLE_ID") &&
      envTrim("AUTH_APPLE_TEAM_ID") &&
      envTrim("AUTH_APPLE_KEY_ID") &&
      (envTrim("AUTH_APPLE_PRIVATE_KEY") || envTrim("AUTH_APPLE_PRIVATE_KEY_PATH")),
  );
}

function resolveApplePrivateKey(): string | undefined {
  const inline = envTrim("AUTH_APPLE_PRIVATE_KEY");
  if (inline) return inline.replace(/\\n/g, "\n");

  const path = envTrim("AUTH_APPLE_PRIVATE_KEY_PATH");
  if (!path) return undefined;

  try {
    const fs = require("node:fs") as typeof import("node:fs");
    return fs.readFileSync(path, "utf8");
  } catch {
    return undefined;
  }
}

function buildAppleProvider(): NextAuthConfig["providers"][number] | null {
  const clientId = envTrim("AUTH_APPLE_ID");
  if (!clientId) return null;

  const prebuiltSecret = envTrim("AUTH_APPLE_SECRET");
  if (prebuiltSecret) {
    return Apple({
      clientId,
      clientSecret: prebuiltSecret,
    });
  }

  const teamId = envTrim("AUTH_APPLE_TEAM_ID");
  const keyId = envTrim("AUTH_APPLE_KEY_ID");
  const privateKey = resolveApplePrivateKey();
  if (!teamId || !keyId || !privateKey) return null;

  return Apple({
    clientId,
    clientSecret: {
      appleId: clientId,
      teamId,
      keyId,
      privateKey,
    },
  });
}

function buildGoogleProvider(): NextAuthConfig["providers"][number] | null {
  const clientId = envTrim("AUTH_GOOGLE_ID");
  const clientSecret = envTrim("AUTH_GOOGLE_SECRET");
  if (!clientId || !clientSecret) return null;

  return Google({
    clientId,
    clientSecret,
    authorization: {
      params: {
        scope: "openid email profile",
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  });
}

/** Production-safe OAuth providers — omitted entirely when env is not configured. */
export function buildOAuthProviders(): NextAuthConfig["providers"] {
  const providers: NextAuthConfig["providers"] = [];
  const google = buildGoogleProvider();
  if (google) providers.push(google);
  const apple = buildAppleProvider();
  if (apple) providers.push(apple);
  return providers;
}

export function listConfiguredOAuthProviderIds(): ("google" | "apple")[] {
  const out: ("google" | "apple")[] = [];
  if (isGoogleOAuthConfigured()) out.push("google");
  if (isAppleOAuthConfigured()) out.push("apple");
  return out;
}
