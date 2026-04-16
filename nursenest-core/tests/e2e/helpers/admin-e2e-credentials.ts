/**
 * Admin Playwright diagnostics (`tests/e2e/admin/*`) — credentials are **never** committed.
 *
 * Set in `.env.playwright.local` (see `playwright.env.ts`) or the shell:
 * - `E2E_ADMIN_EMAIL`
 * - `E2E_ADMIN_PASSWORD`
 *
 * **Provision a dedicated QA staff user** (not a personal account): ensure a User row has a staff
 * `role` in the DB (`ADMIN`, `SUPER_ADMIN`, `CONTENT_ADMIN`, or `SUPPORT_ADMIN`), then sign-in picks
 * up staff access via `getStaffSession()` (`requireAdmin` in admin routes).
 *
 * ```
 * DATABASE_URL=... npx tsx scripts/admin-staff-users.mts list
 * DATABASE_URL=... npx tsx scripts/admin-staff-users.mts promote qa-admin@your-domain.com
 * DATABASE_URL=... npx tsx scripts/reset-staff-user-password.mts qa-admin@your-domain.com
 * ```
 */
export function hasAdminE2eCredentials(): boolean {
  const p = process.env.E2E_ADMIN_PASSWORD;
  return Boolean(process.env.E2E_ADMIN_EMAIL?.trim() && p !== undefined && String(p).length > 0);
}

export function getAdminE2eCredentials(): { email: string; password: string } | null {
  const email = process.env.E2E_ADMIN_EMAIL?.trim();
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || password === undefined || String(password).length === 0) return null;
  return { email, password: String(password) };
}
