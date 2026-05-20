/** Canonical app origin for links in transactional emails. */
export function appOriginForEmail(): string {
  const raw =
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "";
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}
