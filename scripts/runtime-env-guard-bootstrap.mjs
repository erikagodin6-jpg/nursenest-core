// --- AUTH SECRET FIX (critical) ---

const authSecret =
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

// normalize for downstream auth usage
process.env.AUTH_SECRET = authSecret || "";
process.env.NEXTAUTH_SECRET = authSecret || "";

// runtime snapshot fix (DO logs rely on this)
export const runtimeEnvSnapshot = {
  AUTH_SECRET_present: !!authSecret,
};

// fail fast only if missing
if (!authSecret) {
  throw new Error(
    "Missing required runtime env vars: AUTH_SECRET (preferred) or NEXTAUTH_SECRET (legacy)"
  );
}
