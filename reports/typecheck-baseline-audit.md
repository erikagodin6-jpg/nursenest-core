# TypeScript baseline audit (controlled)

**Generated:** 2026-05-06  
**App:** `nursenest-core/` (`npm run typecheck`, `tsc --noEmit --incremental false`)  
**Narrow check:** `npm run typecheck:critical` (`tsconfig.typecheck-critical.json` — Stripe, auth, DB, subscription API roots)

---

## 1. Revenue-sensitive Stripe / webhook status

### `getStripeClientForNotification` investigation

| Check | Result |
|-------|--------|
| Repo-wide `rg getStripeClientForNotification` | **No matches** — symbol not defined or referenced. |
| `apply-stripe-webhook-event.ts` Stripe SDK | Imports **`getStripeClient`** from `@/lib/stripe/stripe-client`. |
| Paid subscription SMS notify path (~L262–275) | Uses `await getStripeClient()`; if null, notify is skipped (same billing-disabled semantics as rest of handler). |
| Root cause class | **Stale refactor / renamed helper** — the correct shared helper is `getStripeClient()` (single cached SDK instance keyed off `STRIPE_SECRET_KEY`). |

**Conclusion:** There is nothing to “wire” to `getStripeClientForNotification`; the revenue-sensitive failure is **already corrected** on current `main`. A **static regression test** was added in `src/lib/stripe/stripe-webhook-policy.test.ts` to forbid reintroducing the old name.

**Behavior:** No intentional change to subscription mapping, idempotency, or webhook allowlist in this audit pass — only documentation + contract test.

---

## 2. Current typecheck surface (this clone)

| Command | Result | Blocks deploy? |
|---------|--------|----------------|
| `npm run typecheck` | **PASS** (zero `TS` errors at time of audit) | No |
| `npm run typecheck:critical` | **PASS** | No |

If your checkout shows failures, run `npm run db:generate`, ensure Node 20, and compare branch to `main`; paste `tsc` output into a new section below.

---

## 3. Remaining failures grouped by category

**At audit time: none.** Use this table when new errors appear.

### A. Revenue / runtime risk

| File | Error summary | Suspected cause | Recommended fix | Risk | Blocks deploy? |
|------|---------------|-----------------|-----------------|------|----------------|
| *(none)* | | | | | |

### B. Deploy / build risk

| File | Error summary | Suspected cause | Recommended fix | Risk | Blocks deploy? |
|------|---------------|-----------------|-----------------|------|----------------|
| *(none)* | | | | | |

### C. Prisma / generated type mismatch

| File | Error summary | Suspected cause | Recommended fix | Risk | Blocks deploy? |
|------|---------------|-----------------|-----------------|------|----------------|
| *(historical)* `api/admin/printables/[id]/route.ts` | `UpdateInput` rejected scalar FK fields | Prisma client prefers relation writes for some relations | `connect` / `disconnect` for `updatedBy`, `fileAsset`, `thumbnailAsset` | Medium | Yes if unfixed |
| *(historical)* `printable-analytics.server.ts` | `groupBy` + `take` requires `orderBy`; `_count` typing | Prisma version aggregate input shape | Use `_count: { <groupField>: "desc" }` in `orderBy`; helper for `_count._all` | Low | Unlikely |

### D. Nullable / narrowing

| File | Error summary | Suspected cause | Recommended fix | Risk | Blocks deploy? |
|------|---------------|-----------------|-----------------|------|----------------|
| *(historical)* `learner-account-center-overview.tsx` | `hasAccess` on `"error"` union | `PageEntitlementResult` discriminant | `entitlement !== "error" && !entitlement.hasAccess` | Medium | No |

### E. Readonly vs mutable

| File | Error summary | Suspected cause | Recommended fix | Risk | Blocks deploy? |
|------|---------------|-----------------|-----------------|------|----------------|
| *(historical)* `app-lessons-hub-published-snapshot-fallback.ts` | `readonly [string]` vs `string[]` | `as const` on hub list opts | Omit `as const` on taxonomy array fragment | Low | No |

### F. i18n / SEO typing

| File | Error summary | Suspected cause | Recommended fix | Risk | Blocks deploy? |
|------|---------------|-----------------|-----------------|------|----------------|
| *(historical)* `breadcrumb-i18n.ts` | `BreadcrumbI18nParams` vs `Record<string, string \| number>` | `undefined` in param values | Strip undefined before `formatMarketingMessage` | Low | No |
| *(historical)* `sitemap-blog-xml.ts` | `Date` vs `never` in max lastmod | Control-flow narrowing | Compare with `.getTime()` | Low | No |

### G. Legacy / content pipeline

| File | Error summary | Suspected cause | Recommended fix | Risk | Blocks deploy? |
|------|---------------|-----------------|-----------------|------|----------------|
| *(historical)* `transform-med-math-lesson.ts` | Enrichment context / pathway | API drift on migration script | Pass full `LegacyFiveBlockEnrichmentContext`; guard `getExamPathwayById` | Low | No |

---

## 4. Validation log (reproducible)

```bash
cd nursenest-core
rg "getStripeClientForNotification" .. || true   # expect no matches
npm run typecheck:critical   # ~tens of seconds
npm run typecheck            # full project; several minutes
node --import tsx --test src/lib/stripe/stripe-webhook-policy.test.ts src/lib/stripe/stripe-webhook-signature-contract.test.ts
```

---

## 5. Sign-off

- [x] Stripe webhook module uses `getStripeClient` only; no `getStripeClientForNotification`.  
- [x] Regression test added for webhook apply source.  
- [x] Full typecheck green on audited revision.  
- [x] Remaining debt: **none on this revision** — re-run this doc when `tsc` regresses.

See `reports/typecheck-stabilization-guidelines.md` for merge-time rules.
