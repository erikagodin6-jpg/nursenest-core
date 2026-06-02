# Route Governance Standard

Date: 2026-05-31

## Purpose

This standard defines how NurseNest routes are owned, named, localized, monetized, and audited. It extends the existing navigation compliance system into platform governance.

## Current Route Governance Evidence

| Area | Evidence | Status |
|---|---|---|
| Learner route registry | `nursenest-core/src/lib/nav-governance/navigation-contract.ts` | Implemented |
| Approved route exceptions | `APPROVED_MODULE_EXCEPTIONS` in navigation contract | Implemented |
| Static audit | `nursenest-core/src/lib/nav-governance/navigation-audit.ts` | Implemented |
| Admin dashboard | `/admin/navigation-compliance` | Implemented |
| Platform dashboard | `/admin/platform-governance` | Implemented in this pass |

## Ownership Standard

Every route must have an owner through one of these registries:

- Learner route ownership: navigation contract.
- Feature ownership: platform feature registry.
- Marketing/global expansion ownership: exam pathway and market registries.
- Admin ownership: admin route convention plus server-side admin guard.

Allowed owner groups:

- `learning-platform`
- `adaptive-assessment`
- `clinical-readiness`
- `content-governance`
- `growth-platform`

## Naming Standards

Learner routes:

- Use `/app/{feature}` for canonical learner surfaces.
- Use `/app/{feature}/{id-or-slug}` for detail pages.
- Do not create feature-specific nav roots outside the learner shell.
- Do not add parallel module-specific headers unless registered as an approved exception.

Marketing routes:

- Use stable public URLs.
- Product pathways should follow country/profession/exam architecture where applicable.
- Discovery hubs must not compete with canonical paid product paths.

Admin routes:

- Use `/admin/{domain}`.
- Enforce staff/admin access server-side.
- Do not expose learner entitlement or billing mutation paths without admin guard.

## URL Standards

| Route type | Standard |
|---|---|
| Learner dashboard | `/app` |
| Learner feature hub | `/app/{feature}` |
| Learner detail | `/app/{feature}/{slug-or-id}` |
| Practice/CAT session | `/app/practice-tests/{id}` |
| Account | `/app/account/{section}` |
| Admin | `/admin/{domain}` |
| Marketing country hub | `/{country}` |
| Marketing exam pathway | `/{country}/{profession}/{exam}` |
| Discovery exam hub | `/exams/{country}` |

## Localization Standards

- Public localized routes must use existing locale infrastructure and indexability gates.
- Do not emit hreflang for routes that do not exist or are not translation-ready.
- Do not create localized learner routes that bypass entitlement, paywall, or learner shell behavior.
- International product routes must remain gated until content, pricing, translation, and launch readiness pass.

## Exception Standard

Exceptions are allowed only when:

1. The route cannot use the canonical learner shell for a documented reason.
2. The exception is listed in `APPROVED_MODULE_EXCEPTIONS`.
3. The route has an owner and migration status.
4. The route appears in `/admin/navigation-compliance`.

## CI Enforcement

Current route enforcement:

```text
src/lib/nav-governance/navigation-contract.ts
src/lib/nav-governance/navigation-audit.ts
tests/contracts/learner-shell-navigation.contract.test.ts
```

Platform-wide enforcement:

```text
npm run test:platform-governance
```

## Developer Checklist

Before adding a route:

1. Decide whether the route is learner, admin, marketing, API, or runtime.
2. Confirm the route belongs to an existing feature or add a feature registry row.
3. Use the canonical learner shell for `/app` learner pages.
4. Add server-side entitlement/admin checks where required.
5. Add analytics events using snake_case names.
6. Update route/feature governance if the route creates a new surface.
7. Run navigation and platform governance tests.

## Standard Answer

A compliant route has:

- An owner.
- A canonical URL pattern.
- A shell/navigation posture.
- A localization/indexability posture when public.
- A monetization posture when premium.
- Analytics naming coverage.
- Launch readiness scoring.

If any of those are unknown, the route is not platform-governed yet.
