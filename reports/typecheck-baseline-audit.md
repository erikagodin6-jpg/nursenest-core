# TypeScript baseline audit (stabilization sweep)

**Date:** 2026-05-06  
**Scope:** `nursenest-core` — `npm run typecheck` (full app `tsc --noEmit`).  
**Outcome:** Full typecheck **passes** (`exit_code: 0`). A narrower **`npm run typecheck:critical`** was added for faster feedback on payments/auth/DB/subscription API roots.

---

## Executive summary

| Area | Runtime / revenue risk | Action taken |
|------|------------------------|----------------|
| Stripe webhooks | **High** if undefined client | **Verified:** `apply-stripe-webhook-event.ts` uses `getStripeClient()` from `stripe-client.ts` (no `getStripeClientForNotification` in tree). No code change required in this sweep. |
| Admin printables PATCH | **Medium** (admin write drift) | Prisma `UpdateInput` uses **relation** writes (`updatedBy`, `fileAsset`, `thumbnailAsset` connect/disconnect) instead of unsupported scalar FK fields in generated types. |
| Flashcards / lesson-linked bank | **Medium** (study surfaces) | Normalized Prisma rows to `BankExamRowForFlashcard` with explicit `null` for optional JSON fields; typed `withDatabaseFallback` callback return. |
| Flashcard hub dev log | **Low** | Replaced non-primitive `studyQuestionPool` log field with boolean + truncated JSON string (matches `safeServerLog` scalar contract). |
| Learner account / billing UI | **Medium** (paywall messaging) | Narrowed `PageEntitlementResult` before reading `hasAccess`. |
| Printable analytics `groupBy` | **Low** (admin metrics) | Prisma requires `orderBy` when `take` is set; use `_count: { printableProductId: "desc" }` / `pathwayId`; keep defensive `_count` reader + in-memory sort. |
| Marketing / allied diagnostics | **Low** | Removed redundant `NODE_ENV === "test"` branch that narrowed to impossible union with `!== "production"`. |
| Lesson hub snapshot opts | **Low** | Dropped `as const` on taxonomy tuple so `taxonomySlugsIn` is mutable `string[]`. |
| Allied pathway scope | **Low** | Guard `scopedPathwayId` before `exclusiveTopicSlugsForAlliedProfession`. |
| OSCE marketing | **Low** | Optional `description`; examiner questions use `expectedAnswer` / `rationale` (type-aligned). |
| Med-math migration | **Low** (tooling) | Passed full `LegacyFiveBlockEnrichmentContext`; asserted pathway exists in URL builder. |
| Blog control panel logs | **Low** | `warnings` array → `warningsJoined` string for structured log schema. |
| Breadcrumb i18n | **Low** | Strip `undefined` interpolation params before `formatMarketingMessage`. |
| Blog sitemap lastmod | **Low** | Compare `Date` with `.getTime()` to satisfy control-flow typing. |
| Core pathway exam SQL helper | **Low** | `regionSql(country: string)` to accept registry country without Prisma `CountryCode` friction. |
| `infer-continue-study-from-activity` | **Low** | Removed nonexistent `updatedAt` from `FlashcardProgress` select; skip rows without `lastReviewedAt`. |

---

## Detailed inventory (errors addressed)

| File | Error (summary) | Category | Runtime risk | Fix strategy | Temporary suppression OK? |
|------|-------------------|----------|--------------|--------------|----------------------------|
| `apply-stripe-webhook-event.ts` | *(historical)* `getStripeClientForNotification` | Runtime-risk (payments) | **High** | Verified correct helper already wired | No |
| `api/admin/printables/[id]/route.ts` | Prisma `UpdateInput` field mismatch | Prisma typing drift | Medium | Relation connect/disconnect | No |
| `build-flashcard-custom-session.ts` | Object not assignable to log scalars | Strict typing / observability | Low | Serialize diagnostics | No |
| `lesson-linked-flashcards-for-pathway.ts` | `distractorRationales` optional vs `JsonValue` | Nullable / Prisma select | Medium | Map rows to normalized shape + explicit async return type | No |
| `learner-account-center-overview.tsx` | `entitlement` union `"error"` | Nullable / discriminated union | Medium | Narrow before `hasAccess` | No |
| `printable-analytics.server.ts` | `orderBy` / `_count` typing | Prisma typing drift | Low | Valid `_count` order fields + helper | No |
| `page.tsx` (exam hub) + `allied-health/page.tsx` | `NODE_ENV` comparison overlap | Strict typing mismatch | Low | Simplify env predicate | No |
| `lessons/page.tsx` | `null` vs `undefined` for allied meta | Nullable handling | Low | Initialize with `undefined` | No |
| `osce/.../page.tsx` | `description` possibly undefined | Nullable handling | Low | Fallback to `scenarioIntro` | No |
| `osce-station-detail-body.tsx` | `passingCriteria` optional; `answer` missing | Legacy / schema drift | Low | Defaults + `expectedAnswer`/`rationale` | No |
| `blog-control-panel-generation.ts` | `string[]` in log payload | Strict typing | Low | Join warnings | No |
| `app-lessons-hub-published-snapshot-fallback.ts` | readonly tuple vs `string[]` | Readonly vs mutable | Low | Remove `as const` on taxonomy fragment | No |
| `app-pathway-lesson-list-scope.ts` | `string \| null` to `string` | Nullable handling | Low | Guard empty `scopedPathwayId` | No |
| `transform-med-math-lesson.ts` | Enrichment context / pathway undefined | Legacy tooling + nullable | Low | Complete context + throw on unknown pathway | No |
| `breadcrumb-i18n.ts` | `BreadcrumbI18nParams` vs `Record` | Record typing | Low | Sanitize undefined values | No |
| `sitemap-blog-xml.ts` | `Date` vs `never` | Control-flow narrowing | Low | Explicit `Date` compare | No |
| `ensure-core-pathway-exam-questions.ts` | `string` vs `CountryCode` | Enum / registry drift | Low | Widen `regionSql` parameter to `string` | Prefer registry alignment later |
| `infer-continue-study-from-activity.ts` | Invalid select + missing relation fields | Prisma schema truth | Low | Match schema (`lastReviewedAt`, include `flashcard`) | No |

---

## Remaining debt strategy

- **Re-run** `npm run typecheck` on every PR touching payments, entitlements, Prisma client, or admin mutations.  
- Use **`npm run typecheck:critical`** for a quicker signal; it does **not** replace full `typecheck` before release.  
- **Prisma upgrades:** re-audit `groupBy` + `UpdateInput` patterns; prefer relation writes when scalars disappear from generated types.  
- **Observability:** keep `safeServerLog` payloads to scalars or bounded strings.

---

## Sign-off checklist

- [x] Full `npm run typecheck` passes  
- [x] `npm run typecheck:critical` passes  
- [x] No `tsconfig` strictness downgrades  
- [x] No blanket `@ts-expect-error` added in this sweep  

See `reports/typecheck-stabilization-guidelines.md` for ongoing rules.

---

## Post-sweep notes (2026-05-06 follow-up)

1. **`npm run db:generate`** — If `UserSelect` (or other models) appears missing columns that exist in `schema.prisma`, regenerate the Prisma client before chasing phantom TS errors. This sweep required generate for `measurementPreference` alignment.

2. **`src/lib/env/env-diagnostics.ts`** — Production profile temporarily overrides `NODE_ENV` for diagnostics. Implemented via `process.env as Record<string, string | undefined>` to satisfy read-only `ProcessEnv` typing without changing runtime behavior.

3. **`npm run typecheck:critical`** — Added `tsconfig.typecheck-critical.json` + script; on this host it completed much faster than full `typecheck` while still following imports from the listed roots.
