# Enterprise Business Protection Governance Report

Generated: 2026-05-29

## Scope

This pass audited and hardened the existing NurseNest business-protection foundation for chargeback defense, checkout acknowledgement evidence, admin auditability, account-sharing review, continuity controls, and operational governance.

## Implemented In This Pass

| Area | Status | Evidence |
| --- | --- | --- |
| Immutable checkout policy records | Implemented | `prisma/migrations/20260708120000_business_protection_audit/migration.sql` creates `policy_acceptance_records`. |
| Exact accepted wording storage | Implemented | `CHECKOUT_POLICY_ACCEPTANCE_WORDING` in `src/lib/business-protection/business-protection-audit.ts` stores the five required acknowledgement statements plus `wording_sha256`. |
| Subscriber checkout proof | Implemented | Main subscription checkout and add-on checkout routes call `recordCheckoutPolicyAcceptance()` after Stripe session creation. |
| Chargeback evidence export audit | Implemented | `src/app/api/admin/users/[userId]/activity-evidence/route.ts` writes `chargeback_evidence_exports` for JSON, text, and HTML exports. |
| Admin API mutation audit persistence | Implemented | `src/lib/admin/admin-audit-log.ts` persists allowed admin API gate events to `admin_audit_events` for successful audited admin reads/mutations. |
| Evidence package policy context | Implemented | `src/lib/admin/account-activity-evidence.ts` now includes policy acceptance rows in JSON, text, and HTML reports. |
| Contract coverage | Implemented | `src/lib/business-protection/business-protection-audit.contract.test.ts` verifies migration tables, checkout wiring, and evidence export auditing. |

## Existing Protection Found

| Phase | Existing Repository Evidence | Status |
| --- | --- | --- |
| Chargeback activity evidence | `LearnerActivityEvent`, `LearnerActivityAuditSnapshot`, `buildAccountActivityEvidence()`, `/api/admin/users/[userId]/activity-evidence` | Implemented |
| Legal policy version tracking | `User.legalPoliciesAcceptedAt`, `User.legalPoliciesVersion`, checkout `policyVersion` validation | Implemented, now strengthened |
| Account sharing detection | `LearnerSessionActivity`, `LearnerSessionIpObservation`, `ProtectionAbuseReview`, `maybeBlockOrTouchAccountSharingAfterSubscriberOk()` | Implemented |
| Admin impersonation | `/api/admin/users/[userId]/impersonate`, `/admin/users/[userId]/view-as` | Implemented |
| Subscriber health score | `computeLearnerHealthScore()`, `loadRetentionRiskDashboard()` | Implemented |
| Content recovery/versioning | `content_entity_revisions`, `content_import_runs`, `docs/CONTENT_VERSIONING.md` | Implemented for content pipeline rows |
| Synthetic learning checks | `SyntheticLearningCheckResult`, `scripts/synthetic-learning-monitor.ts`, `docs/mission-critical-learning-continuity.md` | Implemented |
| Ops center | `/api/admin/ops-center`, `buildOpsCenterSnapshot()` | Implemented |
| Release gates | `gate:learning-delivery`, `qa:release-gate:paid`, `docs/RELEASE_QA.md` | Implemented |

## Database Schema Added

`policy_acceptance_records`

- Captures user, scope, policy bundle version, timestamp, IP, country, user agent, inferred browser/device, exact acknowledgement wording, wording hash, Stripe session/customer/subscription IDs, plan, amount, currency, and metadata.
- Indexed by user/date, scope/date, and Stripe checkout session.

`admin_audit_events`

- Captures admin actor, action, target, method/path, result, request context, old/new values, metadata, and timestamp.
- Indexed by actor/date, action/date, and target/date.

`chargeback_evidence_exports`

- Captures who generated an evidence package, for which user, format, summary metrics, and timestamp.
- Indexed by target user/date and admin/date.

## Chargeback Evidence Package Contents

The admin activity evidence endpoint now includes:

- Account activity summary.
- Subscription history.
- Policy acceptance records.
- Access breakdown.
- Recent learner timeline.
- Evidence notes explaining privacy-preserving telemetry.
- Export audit record.

Available formats:

- JSON: `/api/admin/users/[userId]/activity-evidence`
- Text: `/api/admin/users/[userId]/activity-evidence?format=txt`
- HTML / print-to-PDF: `/api/admin/users/[userId]/activity-evidence?format=html`

## Remaining Gaps

These were not completed in this pass and should not be represented as done:

- Full UI dashboard for content governance review queues.
- Failed-payment dunning email automation.
- Automatic production rollback implementation; current repository documents gates/webhook hooks, but platform-specific rollback automation remains deployment-provider work.
- User-facing self-service data export UI.
- Full Playwright coverage for every business-protection flow.
- Screenshots of admin workflows.

## Verification

Added contract test:

```bash
node --import tsx --test src/lib/business-protection/business-protection-audit.contract.test.ts
```

Full TypeScript verification was attempted after implementation. The repository currently has pre-existing unrelated TypeScript failures in ECG/physiology modules documented in the final handoff.
