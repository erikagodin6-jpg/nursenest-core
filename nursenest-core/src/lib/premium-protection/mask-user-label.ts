/** Display-safe identifier for watermarks (not a secret). */
export function maskUserLabelForWatermark(email: string | null | undefined, userId: string): string {
  if (email && email.includes("@")) {
    const [local, domain] = email.split("@");
    if (local && domain) {
      const safeLocal = local.length <= 2 ? `${local[0] ?? "?"}…` : `${local.slice(0, 2)}…`;
      return `${safeLocal}@${domain}`;
    }
  }
  return `id:${userId.slice(0, 8)}…`;
}
