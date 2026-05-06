# TypeScript stabilization guidelines (NurseNest)

Audience: engineers shipping learner, billing, and admin surfaces. Complements `AGENTS.md` and global engineering constraints.

---

## Commands

| Command | When to use |
|---------|-------------|
| `npm run typecheck` | **Required** before merge for any non-trivial change; CI baseline. |
| `npm run typecheck:critical` | Optional **faster** pass rooted at Stripe, auth, `db`, and `api/subscriptions` (`tsconfig.typecheck-critical.json`). Does **not** prove the whole app—full `typecheck` is still authoritative. |

---

## Acceptable patterns

1. **Narrow then access** — Discriminated unions (`PageEntitlementResult`, Prisma results) must be narrowed before property access.  
2. **Explicit nullish defaults** — Prefer `?? ""`, `?? undefined`, or early `continue` when runtime already guarantees safety.  
3. **Prisma relation writes** — When `UpdateInput` omits scalar FKs, use `connect` / `disconnect` / `set` per current Prisma version—mirror schema relations.  
4. **`groupBy` + `take`** — Prisma requires a deterministic `orderBy`; use `_count: { <groupedField>: "desc" }` when ordering by aggregate count, or omit `take` and slice in JS if the product set is bounded.  
5. **Bounded serialization for logs** — `JSON.stringify(obj).slice(0, N)` or scalar flags when log schema expects primitives.  
6. **Readonly vs mutable** — Prefer widening declared types (`string[]`) over pervasive `as mutable` casts; avoid `as const` on values assigned to mutable DTO fields.  
7. **Targeted helper** — Small pure functions (e.g. stripping `undefined` from i18n params) reduce duplication without new frameworks.

---

## Forbidden shortcuts

- **`any`** except at documented system boundaries (and then minimize scope).  
- **Broad `@ts-ignore` / `@ts-expect-error`** without ticket, owner, and removal plan.  
- **Disabling `strict`**, `noImplicitAny`, or other compiler safeguards repo-wide.  
- **Silent subscription or entitlement behavior changes** "to make types happy"—fix types or narrow; preserve runtime semantics.  
- **Giant `as` chains** on Prisma results instead of mapping to a typed view model.

---

## Runtime-sensitive areas (extra care)

| Domain | Notes |
|--------|--------|
| **Stripe** | Webhooks, checkout, customer resolution—use shared `getStripeClient()` / documented helpers only; never invent alternate clients. |
| **Auth / sessions** | NextAuth env and callbacks; server session is source of truth for sensitive pages. |
| **Entitlements** | `resolveEntitlementForPage` and related unions—always narrow `"error"`. |
| **Prisma mutations** | Admin routes: validate inputs, use typed `UpdateInput`, avoid raw stringly-typed patches. |
| **Learner study APIs** | Flashcards, practice, CAT—keep diagnostics **bounded** and non-PII. |

---

## Prisma typing guidance

1. After **`prisma generate`**, if types drift, prefer **relation-shaped** updates over guessing scalar column names.  
2. **`groupBy`**: confirm `orderBy` + `take`/`skip` rules for your Prisma minor version; validate with `tsc` locally.  
3. **`_count`**: access via a small helper if Prisma union for `_count` is `true | { … }`—keeps call sites readable.  
4. **Do not change `schema.prisma`** in a typecheck-only PR unless the task explicitly includes migrations.

---

## Stripe / payment safety

1. **Single client factory** — Avoid duplicate Stripe initialization paths.  
2. **Webhooks** — Preserve idempotency and event ordering assumptions; type fixes must not alter branching on `event.type` or subscription lifecycle.  
3. **Secrets** — Never widen types to smuggle keys into client bundles; no changes to env loading without security review.

---

## When temporary suppression is allowed

Only if:

1. **Blocked** on upstream types (e.g. third-party bug) with a **linked issue**.  
2. **Isolated** to one statement or import line.  
3. **Documented** with `// TODO(type): <category> — <ticket> — remove by <date>`.  
4. **Reviewed** by a second engineer for payment/auth paths.

Prefer **fixing types** or **adding a 5-line adapter** over suppression.

---

## Related docs

- `reports/typecheck-baseline-audit.md` — what was fixed in the stabilization sweep.  
- `reports/developer-onboarding.md` — onboarding + full command matrix.  
