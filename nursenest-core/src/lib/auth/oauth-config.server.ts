import "server-only";

import { readFileSync } from "node:fs";
import type { NextAuthConfig } from "next-auth";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";
import { generateAppleClientSecretJwt } from "@/lib/auth/apple-client-secret-jwt";
import { isAppleOAuthConfigured, isGoogleOAuthConfigured } from "@/lib/auth/oauth-config-env";

function envTrim(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v && v.length > 0 ? v : undefined;
}

function resolveApplePrivateKey(): string | undefined {
  const inline = envTrim("AUTH_APPLE_PRIVATE_KEY");
  if (inline) return inline.replace(/\\n/g, "\n");

  const path = envTrim("AUTH_APPLE_PRIVATE_KEY_PATH");
  if (!path) return undefined;

  try {
    return readFileSync(path, "utf8");
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

  const clientSecret = generateAppleClientSecretJwt({
    clientId,
    teamId,
    keyId,
    privateKey,
  });

  return Apple({
    clientId,
    clientSecret,
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
  if (isGoogleOAuthConfigured()) {
    const google = buildGoogleProvider();
    if (google) providers.push(google);
  }
  if (isAppleOAuthConfigured()) {
    const apple = buildAppleProvider();
    if (apple) providers.push(apple);
  }
  return providers;
}
