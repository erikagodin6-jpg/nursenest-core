# Release deploy checklist

Concise checklist for promoting a build. **Deploy safety (precheck, health, rollback, verification):** **[`deploy-safety.md`](./deploy-safety.md)**.

Pair with **`npm run validate:release`**, **`npm run qa:release-gate`** (pre-promote), and **`npm run qa:verify:production`** (post-deploy). See **[`release-verification.md`](./release-verification.md)** and **[`RELEASE_QA.md`](./RELEASE_QA.md)**.

---

## Environment

- [ ] `BASE_URL` / `AUTH_URL` / `NEXTAUTH_URL` correct for the target environment.
- [ ] Secrets present: `NEXTAUTH_SECRET`, OAuth client secrets, Stripe keys, DB URL, email provider.
- [ ] Feature flags and `NODE_ENV` match intent (no debug endpoints exposed in prod).

## Database

- [ ] Migrations applied (`prisma migrate deploy` or platform equivalent).
- [ ] Readiness: `/api/health/ready` returns **200** when DB is up (see `RELEASE_QA.md`).

## Auth

- [ ] Staff/admin users exist where needed; QA admin E2E creds documented for smoke.
- [ ] Login / signup / forgot-password flows spot-checked or covered by verification suite.

## Payments

- [ ] Stripe webhook URL and signing secret match the deployed host.
- [ ] Price / product env keys match the plans shown on `/pricing` (smoke: `smoke-checkout-path`).

## Entitlements

- [ ] Paid vs free surfaces match product rules (paid + free smoke tests when creds available).
- [ ] No accidental widening of lesson/question access (server-side checks unchanged).

## Navigation & marketing

- [ ] Home, pricing, login, signup load (post-deploy + pre-deploy public tests).
- [ ] Mobile nav opens/closes on key pages (`smoke-mobile-nav` or pre-deploy mobile section).

## Admin

- [ ] `/admin` reachable for staff; destructive ops remain manual unless explicitly automated.
- [ ] Optional: `E2E_ADMIN_*` set and `admin-dashboard` smoke passes.

## Mobile

- [ ] Critical paths usable at 390px width (smoke mobile spec or pre-deploy mobile).

## After deploy

- [ ] `npm run qa:verify:production` with production `BASE_URL` (or staging first).
- [ ] **Edge + origin:** optional `ORIGIN_BASE_URL` (DO `*.ondigitalocean.app`) + `VERIFY_CANONICAL_HOME=1` with `npm run qa:verify:health` — see **`deploy-safety.md`** §5 and **`edge-origin-troubleshooting.md`**.
- [ ] Enable **`production-public-health-watch`** GitHub Actions secrets + failure notifications if not already (external HTTP / `/` regression guard).
- [ ] Scan dashboards for 5xx, checkout errors, auth errors (see `release-verification.md` monitoring table).
