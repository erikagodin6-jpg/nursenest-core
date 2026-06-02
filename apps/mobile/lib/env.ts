import Constants from "expo-constants";

/**
 * Public web origin for Next.js (Auth.js at `/api/auth`, learner `/app/*`).
 * Configure via `EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN` (primary) or `EXPO_PUBLIC_API_ORIGIN` as an alias — never embed secrets in the client.
 */
export function getWebOrigin(): string {
  const fromEnv =
    process.env.EXPO_PUBLIC_APP_ORIGIN?.trim() ||
    process.env.EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN?.trim() ||
    process.env.EXPO_PUBLIC_API_ORIGIN?.trim();
  const fromExtra = (Constants.expoConfig?.extra as { webOrigin?: string } | undefined)?.webOrigin?.trim();
  const raw = fromEnv || fromExtra || "";
  return raw.replace(/\/$/, "");
}
