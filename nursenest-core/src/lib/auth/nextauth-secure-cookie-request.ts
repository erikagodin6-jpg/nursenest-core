/**
 * Auth.js / NextAuth v5 names session cookies with a `__Secure-` prefix when issued over HTTPS.
 * `getToken({ req, secret })` defaults to `secureCookie: false`, which misses those cookies in proxy
 * and rate limiting — authenticated requests then look anonymous.
 */
export function nextAuthSecureCookieForRequest(request: { headers: Headers; nextUrl: URL }): boolean {
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  if (forwarded === "https" || forwarded === "http") {
    return forwarded === "https";
  }
  return request.nextUrl.protocol === "https:";
}
