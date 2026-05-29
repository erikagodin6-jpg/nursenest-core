# Institutional Licensing Platform

NurseNest now has a persisted institutional licensing foundation for schools, hospitals, health systems, colleges, universities, new grad programs, and residency programs.

## What Is Live

- Admin route: `/admin/institutions`
- Admin API: `/api/admin/institutions`
- License API: `/api/admin/institutions/[institutionId]/license`
- Seat API: `/api/admin/institutions/[institutionId]/seats`
- Migration: `prisma/migrations/20260529143000_institutional_licensing_platform/migration.sql`

The dashboard uses real persisted rows only. If no institutions exist, it shows an empty operational state rather than mock data.

## Data Model

- `institutional_organizations`: organization account, type, status, seat cap, renewal date, Stripe linkage.
- `institutional_memberships`: learner, faculty, and institution-admin membership. Active learner rows consume seats.
- `institutional_cohorts`: class, residency, or orientation cohort metadata.
- `institutional_cohort_memberships`: learner/faculty cohort roster.
- `institutional_license_events`: immutable ledger for creation, license updates, assignment, and removal.

## Workflows

- Create institution licensing accounts.
- Purchase or renew seats by updating seat cap, renewal date, status, and Stripe mirror IDs.
- Assign existing NurseNest users as learners, faculty, or institution admins.
- Remove learner seats without deleting the learner account.
- View readiness, weak areas, CAT completions, lesson completion, flashcard activity, clinical-skills activity, cohort performance, and license events.

## Guardrails

- Super admins can mutate institution licenses and seats.
- Support staff can view institutional data through existing admin RBAC.
- Content admins are blocked because this surface contains learner PII and billing-adjacent information.
- Faculty dashboards aggregate existing learner performance signals and do not expose passwords, payment card data, or raw answer content.

## Stripe Integration

The current implementation mirrors institutional Stripe customer/subscription IDs and seat counts after purchase or renewal. Full self-service institution checkout can be layered on top by creating Stripe seat-price checkout sessions that write the same organization and license event records after webhook confirmation.
