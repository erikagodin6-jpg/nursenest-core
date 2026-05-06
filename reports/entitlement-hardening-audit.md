# Entitlement hardening audit — NurseNest web + mobile

**Date:** 2026-05-06  
**Scope:** Subscription / entitlement surfaces, mobile shell UX, duplicate checks, coverage classification.  
**Constraints preserved:** No IAP; no \`getUserAccess\` semantic changes; learner \`/app\` cache headers unchanged (\`private\`, \`no-store\` where configured); server remains source of truth for paid access.

## 1. Canonical server paths (SoT)

| Concern | Implementation |
|--------|------------------|
| DB-backed access | \`getUserAccess\` (\`nursenest-core/src/lib/entitlements/get-user-access.ts\`) |
| Subscriber APIs | \`requireSubscriberSession\` → \`getUserAccess\` → \`accessScopeFromUserAccess\` |
| Page / profile | \`resolveEntitlementForPage\`, \`resolveEntitlement\`, \`loadPersonalProfilePayload\` |

## 2. Duplicate subscription checks (client)

| Location | Pattern | Action |
|----------|---------|--------|
| \`learner-shell-user-bar.tsx\` | \`session.user.subscriptionStatus\` for **display** only | **Flag** — not a gate; JWT may lag DB |
| Mobile home (before) | \`subscriber\` from data while query idle / no cookies | **Fixed** — \`resolveSubscriberUiState\` + \`authReady\` |

## 3. Centralization

- \`@nursenest/mobile-shared\`: \`resolveSubscriberUiState\`, \`subscriberHeadlineFromSubscriberApi403\`.

## 4. Hydration / staleness

- Mobile: \`staleTime: 30_000\`, \`refetchOnWindowFocus: true\` on profile + subscriber-backed queries.
- Web: no cache header weakening; \`audit:paywall-security\` asserts \`/app\` headers.

## 5. Coverage matrix (summary)

| Scenario | Server-gated | Client UX |
|----------|--------------|-----------|
| Grace / past_due (paid window) | Yes | Profile: \`subscriberAccess\` boolean |
| Expired / lapsed | Yes | Neutral web billing copy |
| Anonymous | Yes (\`401\`) | Wait auth / credentials |
| Premium routes | \`requireSubscriberSession\` | — |
| Lessons / flashcards / CAT / practice | API routes | Mobile 403 headlines |

## 6. Tests

- \`npm -w @nursenest/mobile-shared run test\`
- \`npm --prefix nursenest-core run audit:paywall-security\`
- \`npm --prefix nursenest-core run typecheck:critical\`
- E2E \`test:e2e:tier-matrix\`: run when Playwright env is ready; else manual: web unpaid 403, mobile cold start no false lock, foreground refetch.

## 7. Follow-ups

- Optional periodic \`refreshSession()\` after long background (\`docs/mobile-auth-architecture.md\`).

## E2E tier-matrix (2026-05-06)

`npx playwright test -c playwright.tier-matrix.config.ts` **not run green** in this environment: webServer failed (`ERR_MODULE_NOT_FOUND` for `server/index.ts` under nursenest-core). Use CI or fix webServer command locally; manual checklist in audit §6 applies.
