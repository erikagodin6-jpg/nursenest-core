/** Client-safe OAuth env probes — no Node fs (used by login/signup client trees). */

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

export function listConfiguredOAuthProviderIds(): ("google" | "apple")[] {
  const out: ("google" | "apple")[] = [];
  if (isGoogleOAuthConfigured()) out.push("google");
  if (isAppleOAuthConfigured()) out.push("apple");
  return out;
}
