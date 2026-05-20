# Phase 10 — Ecosystem & platform expansion foundations

**Status:** architecture + TypeScript contracts (`src/lib/platform/phase10/`). No new public APIs, no entitlement bypass, no multi-tenant data paths.

## 1. Current platform boundaries (audit summary)

| Area | Primary enforcement / coupling | Reusable services | Future API boundary |
|------|--------------------------------|-------------------|---------------------|
| **Entitlements** | `getUserAccess`, `requireSubscriberSession`, Stripe-backed subscription reads | `AccessScope`, `UserAccess`, pathway/tier/country normalization | Internal BFF only; any partner API must re-resolve entitlements server-side per request |
| **Admin** | `requireAdmin`, `getStaffSession`, `isPathAllowedForStaffTier`, `staffTierHasInstitutionalCapability` | Path RBAC matrix, institutional capability enum | Scoped admin Graph/REST behind mTLS + staff session (future) |
| **Lessons** | Pathway-scoped content, i18n shards, RSC loaders; RN library safety rules | Pathway types, lesson card DTOs, canonical hubs | Content ingestion → normalization pipeline (internal) |
| **Flashcards / practice / CAT** | Pathway-scoped SQL pools, `build-flashcard-custom-session`, inventory aggregates | Pool diagnostics, canonical WHERE builders | Read-only inventory APIs for partners only with same gates |
| **Adaptive learning** | `@/lib/adaptive-learning` deterministic engine; caller supplies weak signals | `AdaptiveRecommendationBundle`, post-miss orchestration | Event hooks feeding recommendations (server-only) |
| **Cohort / institution** | RBAC institutional capabilities (additive); no single org model hard-coded in product core | `InstitutionalCapability` matrix | Org id on future tables + row-level scope in queries |
| **Analytics** | PostHog / structured logs; learner QA bypass flags in `UserAccess` | `EcosystemAnalyticsHook` strings (phase10) | Tenant-prefixed properties + export jobs |

**Tightly coupled:** session → JWT → `getUserAccess`; admin routes → Prisma + staff tier; lesson list → pagination + pathway.

**Multi-tenant risks:** shared `User` row without `orgId`; cross-org analytics dimensions; theme/logo loaded from client-only config; webhooks without host allowlists.

**White-label blockers today:** marketing + app share global `data-theme` and brand tokens; no tenant-scoped feature flag store; no domain→tenant resolver.

## 2. Platform extensibility layer (implemented contracts)

Location: `src/lib/platform/phase10/`

- **`PlatformCapabilityKind`** — internal allowlist for future plugin-style modules (ingest, analytics sink, simulation host, LMS sync).
- **`PluginRegistrationDescriptor`** — `integrityClass` forces explicit signing story before dynamic loading.
- **`ExternalContentIngestionEnvelope`** — checksum + pathway suggestions; normalization and authz remain upstream.
- **`EntitlementAwareExtensionContext`** — **hints only**; every extension must re-check `getUserAccess` / staff session.
- **`EcosystemAnalyticsHook`** — opaque event names for governance-sensitive emits.

**Rules:** no runtime auto-registration in production without security review; no client-trusted registration payloads.

## 3. Instructor / creator tooling foundations

**Ownership:** distinguish `platform` | `instructor` | `institution` in marketplace metadata types; align with `InstitutionalCapability.CohortInstructorAssign` / analytics read for future cohort scope.

**Moderation:** `ModerationPipelineState` on listing metadata — workflow tables deferred.

**Analytics:** hook `instructor_authoring_save` reserved; actual emission stays server-side.

**Entitlement safety:** instructor-created assets never widen `AccessScope`; publishing gates reuse admin/content paths + future review state.

## 4. Marketplace architecture (direction only)

- **`MarketplaceOfferKind`** — SKU taxonomy for premium modules, packs, simulations, specialty review.
- **`MarketplaceListingMetadata`** — ties listing to moderation + optional `entitlementProductCode` (must match Stripe when wired).
- **Billing:** all charges remain server-authoritative; listing metadata does not carry prices from clients.

## 5. White-label readiness

**Today:** `semantic-status-tokens.css` + `theme-palettes.css` — identity is tokenized; tenant overrides would be a **parallel CSS variable layer** keyed by `data-tenant` or server-injected class, not a fork of components.

**Institution config:** future `tenantConfig` blob loaded server-side only (logo URL allowlist, feature flags, support links).

**Routing / domains:** middleware resolves host → tenant id → inject read-only tenant context into RSC **without** changing learner URL structure until a deliberate product decision.

**Analytics isolation:** require `analyticsNamespace` + org id on all ecosystem events when multi-tenant ships.

## 6. Integration architecture

**File:** `integration-events.ts` — `IntegrationEventDomain` taxonomy + `WebhookSubscriptionContract` with **host allowlist** and `authClass` (HMAC / mTLS placeholder).

**LMS / SSO:** SAML/OAuth expansion sits behind new routes using same session upgrade pattern as today; no JWT trust from external IdP without explicit mapping table.

**Exports:** analytics export ready event → async job + signed download URL (future).

## 7. Ecosystem governance & analytics

**File:** `governance-metadata.ts` — `ModuleOwnershipRecord`, `ContentLineageRef`, `IntegrationAuditLogEntry` (no raw secrets in audit rows).

**Lineage:** `upstreamSources` for imported content provenance.

**Integration audit:** actions for register/rotate/disable/export — correlate with staff actor.

## 8. Future public API strategy

1. **Phase A:** Internal service-to-service with mTLS + fixed allowlists (no public internet).
2. **Phase B:** Partner read APIs (entitlements + rate limits + scoped DTOs) — OpenAPI published, no raw Prisma shapes.
3. **Phase C:** Webhook subscriptions with signed deliveries + replay ids.
4. Never expose `getUserAccess` internals or full `User` rows.

## 9. Validation

- `npm run test:unit:phase10-platform`
- `npm run typecheck`
- `npm run build`
- Mobile / release smoke: unchanged (no Playwright config edits in this phase).

## 10. Code map

| Path | Role |
|------|------|
| `src/lib/platform/phase10/*.ts` | Contracts |
| `src/lib/rbac/institutional-capabilities.ts` | Staff capability matrix (already Phase-10-aligned) |
| `src/lib/entitlements/get-user-access.ts` | Source of truth for paid access |
| `src/lib/adaptive-learning/` | Recommendation engine boundaries |

**See also:** [Phase 11 developer platform](./phase-11-developer-platform.md) — public API strategy, gateway auth, observability.

