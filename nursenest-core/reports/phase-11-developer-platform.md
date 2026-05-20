# Phase 11 — Public API & developer platform foundations

**Status:** architecture + TypeScript contracts under `src/lib/platform/phase11/`. **No new public HTTP routes**, no entitlement bypass, no learner PII in constants.

**Related:** Phase 10 ecosystem contracts (`src/lib/platform/phase10/`, `reports/phase-10-ecosystem-platform.md`).

---

## 1. Internal API boundary audit (summary)

| Surface | Role today | Internal-only? | Candidate future public? | Isolation / risk |
|---------|------------|------------------|---------------------------|------------------|
| Learner `/app` APIs | Session + `getUserAccess` / `requireSubscriberSession` | Yes | Narrow **read-only self** progress with extra scopes | Cross-user IDOR if handler trusts token alone |
| Admin APIs | `requireAdmin` + staff path RBAC | Yes | **No** broad public admin; partner admin = separate mTLS service | JWT from browser must never drive partner calls |
| Flashcards / practice / CAT | Pathway-scoped SQL + paywall | Yes | Read-only inventory with same canonical WHERE | Pool leakage if pathway omitted |
| Entitlements | `getUserAccess`, Stripe-backed | N/A (always server) | Never exposed as raw objects | Tier/country spoof if claims trusted |
| Cohort / institution | RBAC matrix (`InstitutionalCapability`) | Mostly future | Aggregate analytics + assignment APIs behind org token | Multi-tenant row miss without `orgKey` on every query |
| Analytics / reporting | PostHog, structured logs | Yes | Export jobs + **read-only** job tokens | PII in event props |
| Webhooks / events | Phase 10 taxonomy (`IntegrationEventDomain`) | Planned | Verified subscriptions only | SSRF without host allowlist; replay without `deliveryId` |
| Auth / session | Auth.js, `AUTH_SECRET` | Yes | OAuth client credentials **future** | Secret in logs (mitigated elsewhere) |

**Tightly coupled:** session cookie → same-origin BFF routes; admin → Prisma + staff tier.

**Unsafe assumptions:** trusting `pathwayId` query param without entitlement re-check; trusting any `userId` from partner payload.

**Rate-limit gaps:** partner routes will need per-`integrationClientId` + per-IP buckets (not implemented in this phase).

---

## 2. Public API architecture (direction)

**Versioning:** `NurseNestApiVersion`, header `x-nursenest-api-version` (`api-versioning.ts`). Server rejects unknown versions.

**Resource families (future routes, not implemented):** scopes in `developer-api-scopes.ts` map to:
- Learner self progress (read)
- Institution cohort analytics (aggregate read)
- Assignments / remediation (write, org-scoped)
- Institution sync (ingest write — server-mediated)
- Webhook subscription management
- Analytics export job lifecycle (read)
- AI tutor session **metadata** (read — narrow)
- Simulation launch **ticket** (read, short-lived)

**UI decoupling:** public JSON DTOs must not mirror RSC props; stable field names with explicit deprecation policy per version.

---

## 3. Entitlement-aware API gateway (foundations)

**Types:** `ApiGatewayRequestContext`, `ApiTokenKind` (`gateway-request-context.ts`).

**Rules:**
1. Every handler calls `getUserAccess` / staff checks **after** token authentication.
2. `entitlementHints` reuse Phase 10 `EntitlementAwareExtensionContext` — **hints only**.
3. `institutionKey` on context must match row-level filters for org-scoped data.
4. **Staff/instructor** tokens must not be interchangeable with DTC learner tokens (`ApiTokenKind.staffOrInstructor` boundary).

**Scoped tokens (future):** HMAC or OAuth client credentials with TTL + scope allowlist; rotation via `integration-governance` registration record.

---

## 4. Developer tooling & documentation (direction)

| Topic | Direction |
|-------|-----------|
| **OpenAPI** | Generate from Zod or hand-maintained `openapi.yaml` for **published** routes only; never export Prisma models. |
| **Internal SDK** | TypeScript client generated from OpenAPI; publish as private package or git submodule. |
| **Testing** | Contract tests for scope strings + version headers; Pact-style provider tests when first partner ships. |
| **Sandbox** | Separate DO app or env prefix with synthetic org + rate limits; no production data. |
| **Examples** | Curl + `x-nn-delivery-id` webhook verify samples in docs (no live secrets). |

---

## 5. External integration governance

**Types:** `IntegrationRegistrationV1`, `WebhookVerificationClass`, `EventReplayPolicy`, `WEBHOOK_IDEMPOTENCY_HEADERS` (`integration-governance.ts`).

**Model:** register integration → grant **explicit** `DeveloperApiScope[]` → configure verification class → replay policy.

**Unsafe integration detection:** monitor `ApiObservabilityMetric.suspiciousToken` + `tenantBoundaryReject`; block hosts outside allowlist.

**Moderation:** content ingest scope pairs with Phase 10 `ModerationPipelineState` when listings exist.

---

## 6. Observability & security

**Constants:** `ApiObservabilityMetric` (`observability-metrics.ts`).

Emit with dimensions: `route_family`, `api_version`, `token_kind`, `integration_id` (hashed prefix), `outcome` — **never** raw emails, passwords, or bearer tokens.

**Metrics:** latency histogram, rate-limit counter, auth failure, entitlement denied, suspicious token, tenant boundary reject, integration replay drop.

---

## 7. Multi-tenant API risks (explicit)

- Missing `institutionKey` on token → cross-org reads.
- Aggregate analytics re-identification via small cohorts — minimum cell size / suppression (product).
- Webhook callback SSRF — outbound allowlists **from** NurseNest only for health checks; inbound partner URLs validated + DNS pinning policy (future).
- AI tutor integrations — prompt injection via external content; keep tutor scope read-only meta until red-team signoff.

---

## 8. Future SDK recommendations

- **Public:** thin fetch wrapper + typed DTOs from OpenAPI.
- **Internal:** reuse Prisma types only inside monorepo server; never in published SDK.
- **Retries:** idempotent GET only; POST with `Idempotency-Key` header standard.

---

## 9. Code map

| Path | Role |
|------|------|
| `src/lib/platform/phase11/*.ts` | Phase 11 contracts |
| `src/lib/platform/phase10/integration-events.ts` | Event taxonomy (re-exported from phase11 barrel) |
| `src/lib/entitlements/get-user-access.ts` | Entitlement source of truth |
| `src/lib/entitlements/require-subscriber-session.ts` | Subscriber API gate |

---

## 10. Validation

```bash
cd nursenest-core
npm run test:unit:phase11-developer-platform
npm run typecheck
npm run build
```

Release / mobile smoke: unchanged (no Playwright or route edits in this phase).

---

## 11. Constraints checklist

- [x] No unsafe public APIs shipped.
- [x] Entitlement boundaries unchanged in runtime code paths.
- [x] No learner analytics export without explicit future scope + policy.
- [x] APIs not coupled to current UI DTOs (contract-level only).
- [x] Institutional isolation preserved (explicit `institutionKey` + docs).
- [x] SEO / marketing routes untouched.

**See also:** [Phase 12 platform intelligence](./phase-12-platform-intelligence.md) — observability intelligence, predictive analytics direction, content quality automation, governance.

