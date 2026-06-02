# Pathway hub title case fix — QA report

**Date:** 2026-05-07  
**Scope:** Title Case for pathway `displayName` (and allied `shortName`) used as marketing pathway hub H1s; English marketing `metaTitle` for the top-level allied landing; allied hub kicker now derives from `pathway.shortName`.

---

## 1. Files changed (paths + brief reason)

| Path | Reason |
|------|--------|
| `nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-d.ts` | Allied pathway `displayName` + `shortName` (H1 + kicker inputs). |
| `nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-c.ts` | US NP specialty pathway `displayName` strings. |
| `nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-a.ts` | Canadian NP pathway `displayName`. |
| `nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-b.ts` | New Grad RN pathway `displayName`. |
| `nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-e.ts` | Pre-Nursing pathway `displayName` strings. |
| `nursenest-core/src/components/marketing/allied-health-pathway-hub.tsx` | Global/regional kickers use `pathway.shortName` instead of hardcoded `"Allied health"` (stays consistent with data; CSS still uppercases kicker). |
| `tools/i18n/marketing/marketing-en.json` | English `pages.alliedHealthHub.metaTitle` Title Case (SEO `<title>` on `/allied-health` when that route loads). |

**Not changed (intentional):** `seoDescription`, `boardLabel`, lesson/catalog JSON, `nursing-tier-public-labels.ts` (tier description prose), non-English marketing locale JSON (per instructions: English-only for i18n unless locale reproduces the bug).

---

## 2. Every title field corrected (file:line, before → after)

### `exam-pathways-data-segment-d.ts`

- **L14** `displayName`: `Allied health certification prep (Canada)` → `Allied Health Certification Prep (Canada)`
- **L15** `shortName`: `Allied health` → `Allied Health`
- **L32** `displayName`: `Allied health certification prep (United States)` → `Allied Health Certification Prep (United States)`
- **L33** `shortName`: `Allied health` → `Allied Health`

### `exam-pathways-data-segment-c.ts`

- **L15** `displayName`: `FNP certification prep` → `FNP Certification Prep`
- **L34** `displayName`: `AGPCNP certification prep` → `AGPCNP Certification Prep`
- **L53** `displayName`: `PMHNP certification prep` → `PMHNP Certification Prep`
- **L72** `displayName`: `WHNP certification prep` → `WHNP Certification Prep`
- **L91** `displayName`: `PNP-PC certification prep` → `PNP-PC Certification Prep`

### `exam-pathways-data-segment-a.ts`

- **L53** `displayName`: `Canadian NP licensure (CNPLE track)` → `Canadian NP Licensure (CNPLE Track)`

### `exam-pathways-data-segment-b.ts`

- **L34** `displayName`: `New Grad RN: transition to practice` → `New Grad RN: Transition to Practice`

### `exam-pathways-data-segment-e.ts`

- **L139** `displayName`: `Pre-Nursing foundations (US)` → `Pre-Nursing Foundations (US)`
- **L158** `displayName`: `Pre-Nursing foundations (Canada)` → `Pre-Nursing Foundations (Canada)`

### `marketing-en.json`

- **`pages.alliedHealthHub.metaTitle`**: `Allied health certification prep | RT, MLT, paramedic & more | NurseNest` → `Allied Health Certification Prep | RT, MLT, paramedic & more | NurseNest`

### `allied-health-pathway-hub.tsx`

- **Hero kicker:** Replaced hardcoded `"Allied health · Global pathway"` / `` `${countryLine} · Allied health` `` with `` `${pathway.shortName} · Global pathway` `` / `` `${countryLine} · ${pathway.shortName}` `` (no user-visible prose change beyond capitalization alignment with `shortName`).

---

## 3. Routes verified in browser (final URLs + screenshots)

| Route | Verification |
|--------|----------------|
| `http://127.0.0.1:3000/allied/allied-health` | Playwright screenshots (desktop 1440×900, mobile 375×812); `curl` grep confirmed HTML contains `Allied Health Certification Prep`; `document.title` = `Allied Health \| NurseNest` (see `document-titles.txt`). |
| `http://127.0.0.1:3000/us/np/fnp` | Playwright desktop screenshot; `document.title` = `FNP Exam Prep \| AANP Practice Exam & Readiness \| NurseNest`. |
| `http://127.0.0.1:3000/us/new-grad` | Playwright desktop screenshot; `document.title` captured in `document-titles.txt`. |

**Blocked / incomplete:** `http://127.0.0.1:3000/allied-health` — requests exceeded 15–60s timeouts in this environment (no screenshot). English `metaTitle` was still updated for when the route is healthy.

---

## 4. Screenshots saved (paths; confirmed via `ls`)

Directory: `qa-reports/title-case-fix-20260507/screenshots/`

- `allied-global-hub-desktop.png`
- `allied-global-hub-mobile.png`
- `fnp-pathway-hub-desktop.png`
- `new-grad-pathway-hub-desktop.png`

Confirmed on disk with `ls -la` (files present, non-zero size).

---

## 5. Other titles noticed but NOT changed (with reason)

- **International RN foundation hubs** (`segment-e`, e.g. `India RN / state nursing council registration (INC-aligned)`): Mixed slash style and intentional lowercasing in places; not the same “certification prep” hub pattern; left unchanged to avoid scope creep.
- **`PATHWAY_EXAM_LABEL` / lesson `examLabel` fallbacks** (`gold-premium-synthesis.ts`, etc.): Bridging lesson prose / labels, not marketing pathway hub H1; user asked not to alter body/lesson copy.
- **`pathwayLessonHubH1` allied branch** (`pathway-lesson-hub-seo.ts`): Lesson index H1 pattern (`Allied health exam prep lessons for …`); not the same field as pathway catalog `displayName`.
- **`nursing-tier-public-labels.ts`**, **`nursing-tier-hub-content.ts`**: Tier description / nav helper strings, not pathway `displayName`.
- **Non-English `tools/i18n/marketing/locale/*.json`**: Per task, English-only marketing JSON edit for `metaTitle`.
- **`seoTitle` on allied rows:** Already Title Case (`Allied Health Exam Prep | …`); unchanged.

---

## 6. Snapshot / test files updated

None. No test fixtures matched the old hub `displayName` literals.

---

## 7. Console errors (before vs after)

Headless Playwright **screenshot CLI** does not capture browser console. No new application errors were observed from these edits during `curl` + screenshot runs. (A separate environment note: other agents’ logs showed unrelated marketing client errors on some `/allied/*` routes; not attributed to this title-case change.)

---

## 8. Confirmation: marketing copy / body text

- **Altered:** Pathway `displayName` (and allied `shortName`), English allied hub `metaTitle`, allied hub kicker template to use `shortName`.
- **Not altered:** Any `seoDescription`, `boardLabel`, subtitles, CTAs, eyebrow wording structure, lesson bodies, or catalog JSON.

---

## Summary counts

- **Pathway `displayName` fields updated:** 11  
- **Pathway `shortName` fields updated (allied only):** 2  
- **English marketing `metaTitle` keys updated:** 1  
- **TSX logic update:** 1 file (kicker uses `pathway.shortName`)

**Top before → after (reported Allied US hub H1):**  
`Allied health certification prep (United States)` → **`Allied Health Certification Prep (United States)`**

---

## Truthpack

`.vibecheck/truthpack/copy.json` was not present in this workspace clone; changes follow existing in-repo strings and routes only.
