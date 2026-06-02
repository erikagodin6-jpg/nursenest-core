# Admin observability — audit-first hardening

**Date:** 2026-05-07  
**Prior note:** `reports/admin-observability-gaps.md`  
**Approach:** Audit-first — document what exists, payload limits, RBAC, and backlog **before** adding heavy new tiles.

## What ships today

| Surface | Role | Data shape |
|---------|------|-------------|
| Observability hub UI | Admin session + RBAC | Aggregates, counts, pathway sample chips |
| `GET /api/admin/observability/hub` | Admin-only | JSON hub payload; **no public caching** |
| `GET /api/admin/observability/learners` | Support/super only | Paginated roster (24/page, max 25 pages) |

Loader reference: `load-admin-observability-hub.ts` (counts, 7d windows, demo-user exclusions on relational filters).

## Hardening principles (non-negotiable)

1. **Bounded queries** — every list path uses `take` / cursor / max pages (roster already capped).
2. **No giant JSON** — hub avoids full lesson↔question scans; use pathway-scoped `lesson-question-link-coverage` API from ops when needed.
3. **Server enforcement** — hub and APIs require DB-backed admin/staff session; do not rely on UI hiding.
4. **No cache weakening** — never `force-static` or public CDN on admin observability JSON.

## Instrumentation touchpoints

- System status / ops banners: `src/lib/admin/system-status.ts` (changes should stay **read-only fast** — no unbounded scans).
- AI generation banners / admin AI routes: rate limits and policy tests (`admin-ai-policy.test.ts`) gate destructive operations separately from observability.

## Gap backlog (from gaps doc, unchanged priority)

1. Verified study deck usage in 7d strip (partial coverage today).
2. OSCE / clinical scenario volumes not merged into hub tiles.
3. Internal courses metrics remain on `/admin/courses`.
4. Lab module preview-only — when learner traffic exists, add entitlement-aware counts.
5. Multi-country pathway samples beyond US registry slice.

## Audit checklist (per release)

- [ ] Hub loads for **content** vs **support** tiers without exposing blocked APIs (path policy + UI).
- [ ] Roster pagination last page does not 500 on empty cursor.
- [ ] No new admin route ships without `requireAdmin` / path RBAC review.

## Verification

Static audit only this session; **no API or schema changes**. Pair with staging click-through of `/admin/observability` after deploy.
