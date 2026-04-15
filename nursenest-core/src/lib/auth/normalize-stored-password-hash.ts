/**
 * Stored bcrypt hashes must be a single modular-crypt string (e.g. `$2b$12$...`).
 * Trimming fixes rare production issues where `passwordHash` picked up leading/trailing
 * whitespace from imports or manual SQL, which makes `bcrypt.compare` throw or always fail.
 */
export function normalizeStoredPasswordHash(stored: string | null | undefined): string | null {
  if (stored == null) return null;
  const t = stored.trim();
  return t.length > 0 ? t : null;
}
