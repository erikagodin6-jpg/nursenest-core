# Business Continuity And Protection Runbook

## Operating Principle

Learning delivery is Tier 1. Billing analytics, recommendations, friends, referrals, leaderboards, readiness scoring, and growth systems are Tier 2. Tier 2 failure must not block Flashcards, Practice Questions, CAT, Lessons, Clinical Skills, Pharmacology, or ECG.

## Chargeback Evidence Procedure

1. Open the admin user detail page.
2. Confirm the user identity and subscription row.
3. Generate the evidence package:
   - JSON: `/api/admin/users/[userId]/activity-evidence`
   - Text: `/api/admin/users/[userId]/activity-evidence?format=txt`
   - HTML/PDF: `/api/admin/users/[userId]/activity-evidence?format=html`
4. Review:
   - Subscription history.
   - Policy acceptances.
   - Login/session evidence.
   - Study activity timeline.
   - Account-sharing or abuse review signals.
5. Submit only factual usage evidence to Stripe. Do not include passwords, raw payment card details, or private clinical notes.

Every export is written to `chargeback_evidence_exports`.

## Checkout Policy Evidence

Checkout must reject requests unless `acceptPolicies: true` and the posted policy bundle version equals `LEGAL_POLICY_BUNDLE_VERSION`.

After Stripe session creation, the server writes `policy_acceptance_records` with the accepted wording and request context. If the durable evidence insert fails, checkout still continues because `User.legalPoliciesAcceptedAt` and Stripe metadata are already recorded; investigate the warning log immediately.

## Admin Audit

Admin API mutations and enabled audited reads pass through `requireAdmin(req)`. Successful gates write to:

- Structured logs through `admin_audit`.
- Durable rows in `admin_audit_events`.

For highly sensitive admin workflows, pass explicit old/new values through `recordAdminAuditEvent()` in the route handler.

## Account Sharing Review

Signals are stored in:

- `learner_session_activities`
- `learner_session_ip_observations`
- `protection_abuse_reviews`

Recommended handling:

1. Review the evidence before restricting access.
2. Prefer warning or re-authentication for medium-risk signals.
3. Temporarily restrict only high-confidence abuse or clear impossible-travel patterns.

## Deployment Failure

1. Run release gates before promotion:
   - `npm run gate:learning-delivery`
   - `npm run qa:release-gate:paid`
2. If Tier 1 launch checks fail after deploy, roll back to the last healthy deployment in the hosting provider.
3. Verify:
   - `/healthz`
   - `/readyz`
   - Flashcards launch
   - CAT launch
   - Practice Questions launch
   - Lesson launch
4. Review `docs/mission-critical-learning-continuity.md` and `docs/production-incident-runbooks.md` for detailed incident response.

## Database Failure

1. Confirm whether `/readyz` and database health checks fail.
2. Keep learner content delivery in emergency mode where cached content is available.
3. Restore primary DB service or fail over to the provider replica.
4. Confirm recent backups and point-in-time recovery availability.
5. After recovery, run a targeted data integrity check for:
   - subscriptions
   - learner activity events
   - policy acceptance records
   - chargeback evidence exports

## Stripe Failure

1. Do not block active learners from studying.
2. Pause new checkout messaging if Stripe is unavailable.
3. Continue honoring existing local subscription rows.
4. Reconcile Stripe when service returns using existing billing reconciliation tooling.

## Authentication Failure

1. Validate `AUTH_SECRET` / `NEXTAUTH_SECRET` and provider availability.
2. Confirm admin access via DB-backed staff roles.
3. Roll back auth-related deployments if the incident correlates with a release.
4. Do not weaken admin authorization to recover access.

## Content Loss Or Bad Publish

1. Stop the import/publish job.
2. Use `content_entity_revisions` and `docs/CONTENT_VERSIONING.md` to identify the previous version.
3. Roll forward with a restored snapshot where possible.
4. Verify learner hot-path tables after recovery.

## Monthly Governance Checklist

- Export one sample chargeback evidence package.
- Confirm `policy_acceptance_records` receives new checkout rows.
- Review high-risk account-sharing rows.
- Verify release gates still include Tier 1 activity launch checks.
- Run one restore drill for backups or document provider restore evidence.
- Review failed-payment and churn-risk dashboards for actionability.
