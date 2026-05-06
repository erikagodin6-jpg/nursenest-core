# TypeScript stabilization guidelines

For external developers and anyone merging into `main`. Complements `AGENTS.md` and production governance rules.

---

## 1. Payment / Stripe safety

- **One SDK entrypoint:** Use `getStripeClient()` from `src/lib/stripe/stripe-client.ts` for any server path that needs the Stripe SDK (webhooks, reconciliation, optional notify). Do not invent parallel clients or alternate env var names.
- **Never reference removed helpers:** `getStripeClientForNotification` is **not** part of the codebase — if it appears in a merge, **revert to `getStripeClient()`** and run `src/lib/stripe/stripe-webhook-policy.test.ts`.
- **Webhooks:** Keep `claimStripeWebhookEvent` before `applyStripeWebhookEvent`; do not weaken signature verification or allowlist handling (see existing static tests).
- **Subscription logic:** Type fixes must not change status mapping, period end merges, or entitlement audits — fix types with narrowing, correct Prisma shapes, or imports only.

---

## 2. Prisma typing rules

- Prefer **generated** `Prisma.*Input` types for writes; if the client rejects scalar FKs, use **`connect` / `disconnect` / `update`** on relations (as with `PrintableProductUpdateInput`).
- **`groupBy` + `take`:** Prisma requires a compatible **`orderBy`** — use an aggregate `orderBy` on a field in `by`, or remove `take` and slice in application code.
- After **schema or Prisma version** bumps: run `npm run db:generate` before `typecheck`.
- Avoid `as any` on query results; use small mappers or `satisfies` where it clarifies intent.

---

## 3. Acceptable narrow casts

- **Bounded:** `unknown` → validated shape (Zod / manual guard) before use.
- **Prisma JSON:** Normalize `undefined` optional JSON columns to `null` when a downstream type requires `JsonValue`.
- **Discriminated unions:** Narrow `PageEntitlementResult` (`!== "error"`) before accessing `AccessScope` fields.

---

## 4. Forbidden shortcuts

- Disabling **`strict`** or lowering `noEmit` / `skipLibCheck` globally to “go green”.
- Blanket **`@ts-ignore` / `@ts-expect-error`** without ticket, owner, and removal date.
- **`as any`** on webhook, checkout, or entitlement payloads.
- Changing **runtime** subscription or paywall behavior to silence a type error.

---

## 5. Checks before merging

| Step | Command |
|------|---------|
| Fast Stripe/auth/db/API roots | `npm run typecheck:critical` |
| Full project | `npm run typecheck` |
| Stripe static contracts | `node --import tsx --test src/lib/stripe/stripe-webhook-policy.test.ts src/lib/stripe/stripe-webhook-signature-contract.test.ts` |
| After Prisma changes | `npm run db:generate` then typecheck |

CI should keep **`typecheck`** as the merge gate; `typecheck:critical` is for **local iteration** and quick signal (still follows imports from included roots).

---

## 6. How to document remaining debt

When `tsc` reports errors you cannot fix in the same PR:

1. Add a row to **`reports/typecheck-baseline-audit.md`** under the right category (revenue, Prisma, nullable, etc.).  
2. Include **file**, **error summary**, **cause hypothesis**, **fix plan**, **risk**, **deploy blocker?**.  
3. Link the tracking issue; do not leave debt only in chat.

---

## 7. Observability / logging

- **`safeServerLog`** and similar helpers expect **scalar or short string** properties — do not pass arbitrary nested objects; use `JSON.stringify(...).slice(0, N)` or booleans.

---

## 8. Related paths

- Webhook entry: `src/app/api/subscriptions/webhook/route.ts`  
- Apply handler: `src/lib/stripe/apply-stripe-webhook-event.ts`  
- Stripe client: `src/lib/stripe/stripe-client.ts`  
- Critical TS config: `nursenest-core/tsconfig.typecheck-critical.json`
