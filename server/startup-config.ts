/**
 * Centralized production boot validation. Keep checks here — avoid duplicate
 * env rules scattered across db/session code.
 */

import { isProductionLikeRuntime } from "./db";

export type StartupValidationResult = { ok: boolean; errors: string[] };

/**
 * Required env for any production deploy. Fails fast with a single list of errors.
 */
export function validateCriticalStartupConfig(): StartupValidationResult {
  const errors: string[] = [];

  if (!process.env.ADMIN_JWT_SECRET?.trim()) {
    errors.push(
      "Required for production boot: ADMIN_JWT_SECRET — set a non-empty secret in your host env (e.g. Railway/Render dashboard).",
    );
  }

  if (isProductionLikeRuntime()) {
    // Either variable alone is enough; both are not required.
    const hasDb = Boolean(process.env.PROD_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim());
    if (!hasDb) {
      errors.push(
        "Required for production boot: set PROD_DATABASE_URL or DATABASE_URL (at least one PostgreSQL URL).",
      );
    }
  }

  return { ok: errors.length === 0, errors };
}
