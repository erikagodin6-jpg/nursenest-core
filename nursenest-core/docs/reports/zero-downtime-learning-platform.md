# Zero-Downtime Learning Platform

Date: 2026-06-01

## Objective

Users should keep access to core study content during database, cache, session-builder, deployment, API, or origin failures. The platform should recover through cached and static layers before showing a user-visible error.

This pass implements the lowest-risk, highest-impact foundations immediately and defines the remaining infrastructure phases that require Redis, CDN publishing, read replicas, and secondary-origin provisioning.

## Architecture Diagram

```text
Learner action
  |
  v
Fresh dynamic session / lesson / study API
  |
  | success
  v
Normal interactive study surface
  |
  | failure / timeout / empty payload
  v
Recovery chain
  |
  +--> Redis/session cache              (planned infra)
  |
  +--> Database persisted backup        (planned schema/DAL work)
  |
  +--> Browser continuity backup        (implemented for custom flashcards)
  |
  +--> Static emergency inventory       (implemented for flashcard continuity)
  |
  +--> CDN static manifests/lessons     (planned publish pipeline)
  |
  v
Read-only continuity UI
```

## Implemented Immediately

### Flashcard Session Continuity

Files:

- `src/components/flashcards/flashcard-custom-study-client.tsx`
- `src/lib/reliability/emergency-study-inventory.ts`
- `public/emergency-study/inventory-manifest.json`
- `public/emergency-study/rn-cardiology.json`
- `public/emergency-study/rn-respiratory.json`
- `public/emergency-study/rpn-fundamentals.json`
- `public/emergency-study/np-primary-care.json`

Behavior now:

1. The flashcard player first tries the normal custom-session API.
2. After a successful fresh session, it stores a browser continuity backup for 24 hours.
3. If the session API times out, returns invalid JSON, returns an invalid payload, returns empty/unrenderable cards, or has a transient network failure, the client attempts browser backup recovery.
4. If browser backup is unavailable, it loads a static emergency study inventory from `/public/emergency-study/`.
5. If recovery succeeds, the player renders study cards and shows only: "Continuing your study session."

This avoids fatal flashcard launch errors for the most common dynamic session-builder failure class.

### Static Emergency Study Inventories

Added static inventories:

- RN Cardiology
- RN Respiratory
- RPN/PN Fundamentals
- NP Primary Care

Each inventory contains:

- flashcards
- questions
- rationales
- pearls

No database, auth, or session builder is required to read these files. They are intentionally small, clinically safe, and suitable for emergency continuity rather than as a replacement for the canonical content pool.

### Recovery Observability Hooks

Implemented in the flashcard launch path:

- `learning_session_recovered` runtime event
- `recovered_from_browser_backup` client diagnostic
- `recovered_from_emergency_inventory` client diagnostic
- `emergency_recovery_failed` client diagnostic

These provide the first events needed for the Recovery Metrics dashboard.

## Phase Status

| Phase | Status | Notes |
| --- | --- | --- |
| 1. Session Failover | Partially implemented | Browser backup implemented for custom flashcards. Redis and DB backup require shared session persistence design for CAT, practice, skills, and study plans. |
| 2. Emergency Study Mode | Partially implemented | Static flashcard emergency inventories added and wired into flashcard launch. CAT/practice/skills emergency mode still needs surface-specific renderers. |
| 3. Static Inventory Manifests | Partially implemented | Emergency study manifest added locally. Full lesson/question/pathway manifest generation and Spaces CDN publishing are not yet implemented. |
| 4. Edge-Cached Lessons | Planned | Existing lesson catalog fallbacks exist in the codebase, but full lesson HTML/JSON/CDN export pipeline is not implemented in this pass. |
| 5. Read Only Mode | Planned | Requires global runtime mode flag, write queue, and API-level write suppression. |
| 6. Automatic Retry Layer | Partially implemented | Existing `fetchWithRetry` is used. Flashcard launch now falls through to browser/static recovery. Broader alternate endpoint/cache endpoint registry remains planned. |
| 7. Secondary Origin | Infrastructure required | Requires DigitalOcean/Vercel provisioning, environment sync, asset sync, and DNS/failover routing. |
| 8. Database Failover | Infrastructure required | Requires primary Postgres, read replica, read routing, and failover policy. |
| 9. Spaces CDN Content Backup | Planned | Static emergency files are local. Nightly Spaces publish job is still required. |
| 10. Recovery Observability | Partially implemented | Flashcard recovery events added. Dashboard/report aggregation still required. |
| 11. Playwright Disaster Testing | Planned | Existing flashcard failure tests can be extended to assert emergency continuity mode. |

## Required Code Changes By Surface

### Flashcards

Implemented:

- Browser continuity backup after fresh custom-session success.
- Automatic recovery from browser backup.
- Automatic recovery from static emergency inventory.
- Calm recovery message.

Still required:

- Server-side Redis backup.
- Database persisted custom-session snapshot.
- Disaster Playwright tests for API timeout, empty payload, and emergency inventory recovery.

### CAT Exams

Required:

- Persist CAT session state to browser backup after each answered item.
- Add server session snapshot restore endpoint.
- Add static emergency CAT-lite inventory for non-scored continuity.
- Preserve scoring validity by clearly separating emergency practice mode from official CAT readiness scoring.

### Practice Tests

Existing foundations:

- Practice runner already uses `fetchWithRetry`.
- Several practice/question flows already persist local session state.

Required:

- Normalize local backup envelope with the same recovery telemetry.
- Add emergency question inventory renderer.
- Queue progress writes when read-only mode is active.

### Clinical Skills

Required:

- Export static skill steps/checklists into emergency manifests.
- Add read-only skill session fallback.
- Queue completion/progress writes.

### Study Plans

Required:

- Cache last generated study plan in browser and server-side snapshot.
- Show cached plan if AI/DB generation fails.
- Mark write/progress sync as delayed during read-only mode.

### Lessons

Required:

- Add nightly lesson export job for HTML, JSON, metadata, pearls, and image references.
- Publish lesson export to Spaces CDN.
- Add CDN fallback loader before lesson unavailable UI.

## Risk Analysis

Low risk:

- Browser continuity backups for already-loaded sessions.
- Static emergency files under `/public`.
- Fallback telemetry events.
- Read-only UI messaging for delayed progress sync.

Medium risk:

- Emergency inventories for CAT/practice because scored readiness must not be mixed with fallback practice.
- CDN fallback for lessons because canonical metadata, paywall state, and entitlement messaging must remain correct.

High risk:

- Database read/write routing.
- Primary/secondary origin failover.
- Redis-backed session recovery without a shared invalidation/versioning contract.
- Silent account/pathway changes during recovery.

## Cost Estimate

Approximate monthly infrastructure costs:

- Redis managed cache: low to moderate, depending on memory and HA tier.
- DigitalOcean Spaces + CDN: low for manifests and lesson JSON/HTML; image/video-heavy exports may increase bandwidth costs.
- Postgres read replica: moderate; usually close to the cost of another database node.
- Secondary origin: low to moderate for a warm standby, higher for active-active.
- Observability: depends on retention and event volume; recovery metrics should be sampled or aggregated.

Engineering cost estimate:

- Phase 1 shared session envelope across all surfaces: 3-5 days.
- Phase 2 emergency modes beyond flashcards: 3-6 days.
- Phase 3/4 manifest and lesson CDN export pipeline: 5-10 days.
- Phase 5 read-only mode and write queue: 5-8 days.
- Phase 7/8 infrastructure failover: 5-10 days plus deployment testing.
- Phase 11 disaster Playwright suite: 3-5 days.

## Rollout Sequence

1. Ship flashcard emergency continuity and telemetry. (Implemented in this pass.)
2. Add Playwright coverage for flashcard emergency mode.
3. Define a shared session backup envelope for CAT, practice, skills, and study plans.
4. Add browser backup to CAT and practice runners.
5. Add read-only runtime flag and write queue primitives.
6. Generate full static inventory manifests locally.
7. Publish manifests and lesson exports to Spaces CDN nightly.
8. Add CDN fallback loaders for lessons and inventory navigation.
9. Provision Redis and server-side backup storage.
10. Provision read replica and secondary origin.
11. Run disaster suite before enabling aggressive SEO crawls or large content pushes.

## Verification Evidence

Passed:

```bash
npm run typecheck:critical
```

Passed:

```bash
node -e "for (const f of ['inventory-manifest.json','rn-cardiology.json','rn-respiratory.json','rpn-fundamentals.json','np-primary-care.json']) JSON.parse(require('fs').readFileSync('public/emergency-study/'+f,'utf8'))"
```

Recommended next tests:

```bash
npx playwright test tests/e2e/flashcards/flashcard-session-failure.spec.ts --project=chromium
```

Add new Playwright assertions:

- custom-session API returns 503 -> continuity mode renders
- custom-session API returns empty pool -> continuity mode renders
- custom-session API timeout -> continuity mode renders
- local backup restore beats emergency inventory
- emergency inventory works with JavaScript hydration and no auth-only API dependency
