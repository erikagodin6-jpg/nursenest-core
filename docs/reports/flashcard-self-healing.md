# Flashcard Self-Healing — Phase 2

**Implemented:** 2026-06-01  
**Status:** ✅ Complete

---

## Problem

Before this fix, the flashcard study session flow had a single point of failure:

```
User opens deck → GET /api/flashcards/decks/[deckRef]/study
→ DB session build fails (after 3 withRetry attempts)
→ 503 "Unable to create study session"
→ User blocked — cannot study
```

This affected paying subscribers on any DB degradation, including transient spikes that outlast the 3-retry window.

---

## Solution: Three-Layer Fallback Chain

```
GET /api/flashcards/decks/[deckRef]/study
│
├── Primary: DB session (existing) ────────────────────────────
│   • Full SRS scheduling (due dates, repetition counts)
│   • User-specific progress weighting
│   • Bank-backed exam question supplement
│   • withRetry(3 attempts, exponential backoff)
│
├── Secondary: Stale content cache (existing) ─────────────────
│   • Process-local; served by /api/flashcards/decks list
│   • Not applicable to study session (session is real-time)
│
└── Tertiary: Static catalog fallback (NEW) ───────────────────
    • Served from TypeScript content bundles (no DB required)
    • mode="preview" — no SRS controls rendered
    • X-NurseNest-Content-Fallback: 1 header for monitoring
    • Best-effort topic filtering by deck title
    • Deterministic shuffle per deckRef
```

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/study-content-failover/flashcard-session-static-fallback.server.ts` | **NEW** — static fallback module |
| `src/app/api/flashcards/decks/[deckRef]/study/route.ts` | Added import + catch-block fallback |

---

## Static Fallback Module

**Path:** `src/lib/study-content-failover/flashcard-session-static-fallback.server.ts`

**Exports:**
- `buildFlashcardSessionFallback(args)` — builds a set of static cards in `FlashcardStudyApiCard` format
- `hasFallbackContentForPathway(pathwayId)` — guard to skip fallback if bundle is empty for this pathway

**Content sources:**
- `NCLEX_PN_GAP_FLASHCARDS` (100 cards: Ethics, DVT, Diuretics, Cardiac Medications, Medication Administration)
- `CNPLE_GAP_FLASHCARDS` (60 cards: Professional Practice, Health Promotion, Geriatrics)

**Pathway routing:**
- `us-lpn-nclex-pn`, `ca-rpn-rex-pn` → NCLEX-PN bundle
- `ca-np-cnple`, `us-np-fnp` → CNPLE bundle
- All others → mixed bundle (both)

---

## Fallback Response Shape

```json
{
  "mode": "preview",
  "title": "Cardiovascular",
  "cards": [
    {
      "id": "pn-dvt-fc-01",
      "front": "What are the three components of Virchow's Triad?",
      "back": "1) Venous stasis ...",
      "fullBackAvailable": true,
      "topic": "DVT",
      "subtopic": null,
      "sourceKey": "us-pn-dvt-deep-vein-thrombosis",
      "pathwayId": "us-lpn-nclex-pn"
    }
  ],
  "sessionMeta": { "requestedCount": 25, "returnedCount": 20, "totalAvailable": 100, "hasMore": false },
  "_fallback": true,
  "_fallbackSource": "static_catalog"
}
```

The `mode: "preview"` field tells the client to render cards without SRS controls (no "Got it" / "Needs review" tracking). The user can still flip cards and read content.

---

## Client Behavior (No Changes Required)

The `flashcard-study-client.tsx` already handles `mode: "preview"` responses — it renders cards in "preview" layout without SRS buttons. The `_fallback: true` field is ignored by the client but captured in monitoring.

The `flashcard-study-client.tsx` already has `fetchWithRetry` (2 attempts, 8s timeout) on the primary request. Combined with the server-side `withRetry` (3 attempts), the total retry budget is:

- Client retry 1 → server retry 1,2,3 → fallback
- Client retry 2 → server retry 1,2,3 → fallback
- Total: 6 server-side attempts before fallback

---

## Observability

| Log Event | Trigger |
|---|---|
| `api_flashcards_study / static_fallback_served` | Fallback successfully served |
| `api_flashcards_study / static_fallback_failed` | Fallback itself errored (rare) |
| `X-NurseNest-Content-Fallback: 1` header | Any fallback response |

---

## Limitations

1. **No SRS data** — Cards are served in preview mode without due-date weighting. Users on the fallback will not have their progress tracked for that session.
2. **Fixed topic coverage** — The static bundle covers the 10 gap-closure topics. Decks for niche body systems (e.g., musculoskeletal flashcards) will get the full mixed bundle rather than topic-matched cards.
3. **No custom session fallback** — The custom session endpoint (`/api/flashcards/custom-session`) does not yet have this fallback wired. Added to backlog.

---

## Recovery Timeline

| Time | State |
|---|---|
| T+0 | DB degradation begins |
| T+0 to T+2s | Client-side `fetchWithRetry` (attempt 1); server `withRetry` (3 attempts) |
| T+2s to T+4s | Client-side retry 2; server `withRetry` (3 more attempts) |
| T+4s | All retries exhausted → static fallback served |
| T+4s | User begins studying from static content |
| Recovery | Next session request hits DB again — SRS resumes |

User-visible delay: **≤4 seconds** before fallback content is served. User never sees a 503 error screen.
