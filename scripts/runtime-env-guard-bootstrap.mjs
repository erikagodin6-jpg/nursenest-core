// --- AUTH SECRET FIX (critical) ---

const authSecret =
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

// normalize for downstream auth usage
process.env.AUTH_SECRET = authSecret || "";
process.env.NEXTAUTH_SECRET = authSecret || "";

// runtime snapshot (for logs)
globalThis.__AUTH_SECRET_PRESENT__ = !!authSecret;

// fail fast only if missing
if (!authSecret) {
  throw new Error(
    "Missing required runtime env vars: AUTH_SECRET (preferred) or NEXTAUTH_SECRET (legacy)"
  );
}
