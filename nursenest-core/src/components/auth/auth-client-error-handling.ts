/**
 * Shared client-side classification for auth flows (login, signup, forgot password).
 * Keeps “Invalid email or password” only for confirmed credential failures — not for
 * network timeouts, slow responses, or thrown fetch/signIn errors.
 */
export function isLikelyNetworkFailure(err: unknown): boolean {
  if (err == null) return false;
  if (typeof TypeError !== "undefined" && err instanceof TypeError) return true;
  if (err instanceof Error) {
    const m = err.message.toLowerCase();
    if (m.includes("failed to fetch") || m.includes("networkerror") || m.includes("load failed")) {
      return true;
    }
  }
  if (typeof DOMException !== "undefined" && err instanceof DOMException) {
    return err.name === "NetworkError" || err.name === "AbortError";
  }
  return false;
}
