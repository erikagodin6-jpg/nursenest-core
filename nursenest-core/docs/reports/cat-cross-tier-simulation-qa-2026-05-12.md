# CAT Cross-Tier Simulation QA Report
**Date:** 2026-05-12  
**Scope:** Pre-ECG / Pre-premium-module-publish gate  
**Status:** ⚠️ DO NOT PUBLISH until G1 / G2 are confirmed resolved in production

---

## Tier-by-Tier Readiness Status

| Tier | Pathway | CAT Entrypoint | Readiness |
|---|---|---|---|
| RN / NCLEX-RN | `/us/rn/nclex-rn/cat` | Live (authenticated) | ✅ **Live-ready** (post-fix) |
| RPN / REx-PN | `/canada/rpn/rex-pn/cat` | Live (authenticated) | ✅ **Live-ready** (post-fix) |
| LPN / NCLEX-PN | — | Not present | 🔒 **Locked/Hidden** — no LPN CAT route found |
| NP / FNP | `/us/np/fnp/cat` | Waitlist/locked | ⚠️ **Limited beta** — fallback UI only, NP-pathway entitlement gap (G2) |
| NP / CNPLE | `/canada/np/cnple/cat` | Waitlist/locked | 🔒 **Locked** — blocked waitlist pathway |
| Allied Health | `/allied/allied-health/cat` | Marketing + sign-in gate | ⚠️ **Limited beta** — sign-in gate present, no allied-specific CAT live |
| New Grad | (no CAT route found) | — | 🔒 **Locked/Hidden** — no New Grad CAT route in e2e or app routes |

---

## CAT Pool Inventory

### Pool query (server-side, post-fix)
```sql
SELECT id, stem, options, difficulty, body_system, topic, question_type, correct_answer
FROM exam_questions
WHERE tier=$1 AND status='published'
  AND difficulty IS NOT NULL
  AND correct_answer IS NOT NULL
  AND (is_adaptive_eligible=true OR is_adaptive_eligible IS NULL)
  AND (module IS NULL OR module != 'ecg')   -- ← added in this pass
ORDER BY ABS(difficulty - $3), RANDOM()
LIMIT 20
```

Per-tier published counts require a live DB query (`buildCATPool(tier)`). No seed file counts are available at static analysis time. Minimum viable CAT pool threshold: **≥75 items per tier** for the stopping rule to activate; ≥20 items for meaningful ability estimation.

### NP CAT pool (Next.js engine)
Pool is scoped to `NP_EXAM_KEYS = ["np-aanp","np-aanpcnp","np-canp","np-fnp","np-agpcnp","np-pmhnp"]` with `isAdaptiveEligible: true`. No ECG exclusion clause — relies on data hygiene (items in NP exam keys should not carry ECG module tag; must be verified in DB).

---

## Question-Type Coverage Table

| Question Type | Renderer Registered | CAT Pool Eligible | Mobile Safe | Notes |
|---|---|---|---|---|
| MCQ (single-best) | ✅ | ✅ | ✅ | Full renderer + existing e2e |
| SATA (select-all) | ✅ | ✅ | ✅ | Full renderer + existing e2e |
| Bowtie / NGN | ✅ | ✅ | ⚠️ | Renderer present; mobile column crush is a known risk — no overflow measured at 375px yet |
| Matrix (single/multi) | ⚠️ Fallback only | ⚠️ If in DB | ❌ | Safe fallback UI ("specialized question format" alert) — no dedicated renderer |
| Drag-drop / ordering | ⚠️ Fallback only | ⚠️ If in DB | ❌ | Same safe fallback — no dedicated renderer |
| Case-study / unfolding | ⚠️ Fallback only | ⚠️ If in DB | ❌ | Safe fallback — no rendered case-study tabs |
| Hotspot | ⚠️ Fallback only | ❌ excluded | — | Not in `is_adaptive_eligible` pool per contract test |
| Fill-in-the-blank / dosage | ⚠️ Fallback only | ⚠️ If in DB | ❌ | No dedicated renderer |
| Exhibit/lab/chart tabs | ⚠️ Fallback only | ⚠️ If in DB | ❌ | No dedicated renderer |
| Audio/video/image | ⚠️ Fallback only | ⚠️ If in DB | — | No dedicated renderer |

---

## Security / Entitlement Findings

### G1 — HIGH (FIXED in this pass)
**Finding:** `tier` in legacy `/api/cat/start` was caller-controlled (`req.body.tier`). An RPN subscriber could request RN-tier questions by supplying `tier: "rn"` in the POST body.  
**Fix applied:** `server/cat-session-api.ts` — tier now always derived from `user.tier` (authenticated server-side). Admins may override via request body for testing.  
**Status:** ✅ Fixed

### G2 — HIGH (NOT YET FIXED)
**Finding:** `/api/cat/np/session` (Next.js app) uses generic `requireSubscriberSession()` — checks active subscription but not NP-pathway entitlement. Any subscriber without an NP add-on can start an NP CAT session.  
**Recommendation:** Add `assertPathwayEntitlement(gate, "np")` or equivalent check before serving NP CAT questions.  
**Status:** ❌ Open — block NP CAT publish until resolved

### G3 — MEDIUM (FIXED in this pass)
**Finding:** No `module != 'ecg'` filter in standard CAT pool SQL. ECG questions could appear in standard CAT if data tagging is incomplete.  
**Fix applied:** `AND (module IS NULL OR module != 'ecg')` added to `selectNextQuestion` SQL.  
**Status:** ✅ Fixed (defense-in-depth; data hygiene still required)

### G4 — MEDIUM (Advisory)
**Finding:** Legacy server CAT has no hard minimum item count before session can terminate. `antiGamingFlags` set at `< 50 items` is advisory only.  
**Recommendation:** Enforce minimum 75 items server-side before accepting `exam_complete` action.  
**Status:** ⚠️ Open — does not block current publish; log for backlog

### G5 — MEDIUM (Advisory)
**Finding:** Learner-side NP CAT engine early-stop uses 5-question drift window (drift < 0.1 over last 5 answers after ≥20 questions). Susceptible to premature stop on short streaks.  
**Recommendation:** Widen drift window to 10 questions.  
**Status:** ⚠️ Open — advisory

### G6 — LOW
**Finding:** Legacy `/api/cat/:id/answer` returns `correct: isCorrect` immediately (real-time correctness reveal). Strict NCLEX CAT protocol does not reveal correctness during the exam.  
**Status:** ⚠️ Open — the NP CAT path does NOT reveal correctness; legacy path only

### G7 — LOW
**Finding:** NGN types (matrix, cloze, drag-drop, hotspot) fall through to a safe fallback alert UI with no dedicated renderer. Questions of these types will not render correctly in production.  
**Status:** ⚠️ Open — safe fallback exists; add to renderer backlog

### G8 — LOW
**Finding:** Typo `scoreDelata` (transposition) in `readiness-scorer.ts`.  
**Status:** ⚠️ Open — cosmetic only if callers use the exported name

---

## Visual QA Findings

Existing screenshots (in `docs/screenshots/playwright-full-regression/` and `preview-screenshots/aesthetic-audit-2026/`) confirm:

- Clean clinical visual hierarchy on ocean/midnight/blossom themes ✅
- Premium card surfaces on desktop ✅
- Progress indicator present (data-nn-qa-cat-adaptive-exam-footer) ✅
- Rationale column absent during CAT (`nn-question-session-rationale` count = 0) ✅
- No answer percentages during active session ✅
- Single anchored footer (no duplicate buttons) ✅

Unconfirmed (requires live run):
- Bowtie mobile column behavior at 375px — flagged as risk
- Long stems on matrix questions at mobile width

---

## Mobile QA Findings

- CAT exam compact viewport test (1366×768) exists and passes in CI ✅
- Mobile layout test (375px) added to new `cat-cross-tier-simulation.spec.ts` ✅
- Bowtie mobile overflow test added to new spec ✅
- No existing screenshot captured at 375px for bowtie — first run of new spec will capture this

---

## Clinical/Content Risks

1. NP CAT pool exclusivity depends on exam-key data hygiene. An NP question miscategorized with an RN exam key would enter the RN pool.
2. ECG questions excluded by `module != 'ecg'` filter in legacy path; NP path has no such filter — must confirm via DB query that no NP exam key questions carry ECG module tag.
3. Unfolding case questions are not rendered — if they exist in the adaptive pool they will silently show the fallback alert, degrading clinical realism.

---

## Tests Run

| Test | Command | Result |
|---|---|---|
| typecheck:critical | `npm run typecheck:critical` | ✅ 0 errors |
| CAT unit + hardening (113 → 135) | `npm run test:unit:cat` | ✅ 135/135 pass |
| Practice unit (bowtie, grading) | `npm run test:unit:practice` | ✅ 13/13 pass |
| New cross-tier simulation tests | `node --test src/lib/cat/cat-cross-tier-simulation.test.ts` | ✅ 22/22 pass |
| CAT e2e entrypoints (CI, no live server) | `npm run test:e2e:cat-entrypoints` | ⏳ Requires live server |
| New cross-tier Playwright spec | `test:e2e:cat-question-types` (extend) | ⏳ Requires live server + paid creds |

---

## New Files Created / Modified

| File | Type | Summary |
|---|---|---|
| `server/cat-session-api.ts` | Fix | Tier forced from `user.tier`; ECG exclusion filter added to SQL |
| `src/lib/cat/cat-cross-tier-simulation.test.ts` | New test | 22 tests: tier isolation, ECG exclusion, stopping rule, no-rationale, allied isolation, ability convergence |
| `src/lib/questions/cat-runner-renderer-coverage.test.ts` | Extended | 25 new tests: question-type support catalog, bowtie NGN routing, runtime matrix coverage |
| `tests/e2e/cat/cat-cross-tier-simulation.spec.ts` | New Playwright spec | 18 tests across 7 blocks: RN, RPN, NP, Allied, ECG exclusion, mobile layout, entitlement gating |

---

## Screenshots Inventory

| Screenshot | Source | Status |
|---|---|---|
| CAT desktop ocean/midnight/blossom | `preview-screenshots/aesthetic-audit-2026/desktop/` | ✅ Existing |
| CAT mobile ocean/midnight/blossom | `preview-screenshots/aesthetic-audit-2026/mobile/` | ✅ Existing |
| CAT tablet ocean/midnight/blossom | `preview-screenshots/aesthetic-audit-2026/tablet/` | ✅ Existing |
| CAT desktop (playwright regression) | `docs/screenshots/playwright-full-regression/cat-desktop-*.png` | ✅ Existing |
| CAT mobile (playwright regression) | `docs/screenshots/playwright-full-regression/cat-mobile-*.png` | ✅ Existing |
| Each question type (new spec) | `tests/screenshots/cat-*-{timestamp}.png` | ⏳ Generated on first live run |
| Locked/entitlement-failure state | `tests/screenshots/cat-entitlement-*-{timestamp}.png` | ⏳ Generated on first live run |

---

## Deployment Recommendation

| Condition | Status |
|---|---|
| ✅ typecheck:critical passes | PASS |
| ✅ 135/135 CAT unit tests pass | PASS |
| ✅ ECG exclusion filter added to standard CAT SQL | PASS |
| ✅ Tier escalation via req.body fixed | PASS |
| ✅ No-rationale rule verified in contract tests | PASS |
| ✅ No answer-% verified in API serialization | PASS |
| ❌ G2: NP CAT pathway entitlement not gated | **BLOCK NP CAT publish** |
| ⏳ Live e2e smoke with paid credentials needed | Required before ECG module publish |
| ⏳ Bowtie mobile 375px overflow not yet measured live | Required before bowtie-heavy content push |

**Recommendation:** ECG module and premium content changes may publish after:
1. G2 (NP pathway entitlement) is resolved and tested
2. Live Playwright run of `cat-cross-tier-simulation.spec.ts` completes without failures
3. Bowtie mobile overflow measurement confirms no horizontal bleed at 375px
