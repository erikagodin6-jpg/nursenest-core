# PHASE 8 — Hidden International Content Library Specification
Generated: 2026-05-30

## Purpose

All future international content must remain hidden until officially released. This document specifies the architecture and implementation pattern.

---

## Current Gate Infrastructure (Already Built)

The content isolation system already exists. Do not rebuild it.

### Gate 1 — Pathway Level
```typescript
// src/lib/navigation/country-exam-launch-readiness.ts
export const PATHWAY_LAUNCH_APPROVED: ReadonlySet<string> = new Set([
  "us-rn-nclex-rn",
  // ... 8 more approved pathways
  // International pathways are NOT in this set → never published
]);
```

**Effect:** Unapproved pathways are never returned in sitemap, SEO indexes, or marketing nav.

### Gate 2 — Region Level
```typescript
export const GLOBAL_REGION_EXPANSION_PUBLISHED: ReadonlySet<GlobalRegionSlug> = new Set([
  // Currently empty — no international regions approved
]);
```

**Effect:** Regions not in this set return `status: "ready_for_review"` — never public.

### Gate 3 — Pathway Status
```typescript
// All international pathways have:
status: "upcoming",
acquisitionMode: "waitlist",
```

**Effect:** Visitors see waitlist registration, not subscription flow.

### Gate 4 — SEO Robots
```typescript
// All international pathway pages:
robots: { index: false, follow: false }
```

**Effect:** Google cannot index any international content until robots tag is removed.

### Gate 5 — Content Exam Keys
```typescript
contentExamKeys: [], // All international pathways have empty array
```

**Effect:** No questions, lessons, or flashcards are served to international pathway subscribers (even if someone joins the waitlist, there is nothing to show them).

---

## Requirements for Future International Content

All content added for international markets must follow this pattern:

### Database Records
```sql
-- Questions
INSERT INTO exam_questions (tier, exam_keys, published, ...)
VALUES ('RN', ARRAY['NMC_TOC'], false, ...);
-- published=false until pathway approved

-- Lessons  
INSERT INTO pathway_lessons (exam_key, published, ...)
VALUES ('NMC_TOC', false, ...);

-- Flashcards
INSERT INTO flashcard_decks (exam_keys, visible_in_navigation, ...)
VALUES (ARRAY['NMC_TOC'], false, ...);
```

### Pathway Registration
```typescript
// Only add to PATHWAY_LAUNCH_APPROVED after:
// 1. QA review complete
// 2. Regulatory disclaimers approved
// 3. Pricing configured in Stripe
// 4. Min. content thresholds met (lessons ≥ 50, questions ≥ 200)
// 5. Executive sign-off
```

### Region Publication
```typescript
// Only add to GLOBAL_REGION_EXPANSION_PUBLISHED after:
// 1. Pathway approved (above)
// 2. SEO robots tags reviewed
// 3. Marketing hub content reviewed
// 4. Support team briefed on market-specific queries
// 5. Legal/compliance sign-off on country-specific disclaimers
```

---

## Admin Visibility

International content should be visible to admin/staff in the admin panel at:
- `/admin/exam-pathways` — view all pathways including international
- `/admin/content-quality` — filter by examKey to see international content status
- Market readiness dashboard (to be built)

All hidden content is visible to staff via the `?pathwayId=uk-rn-nmc-test-of-competence` query parameter override when viewing as learner.

---

## Naming Conventions

| Market | Pathway ID Pattern | Exam Keys | Locale |
|---|---|---|---|
| UK NMC | `uk-rn-nmc-*` | `NMC_TOC`, `NMC_OSCE` | `en-GB` |
| Australia | `au-rn-iqnm-*` | `IQNM`, `ANSAT` | `en-AU` |
| New Zealand | `nz-rn-ncnz-*` | `NCNZ` | `en-NZ` |
| Ireland | `ie-rn-nmbi-*` | `NMBI` | `en-IE` |
| Philippines | `ph-rn-prc-*` | `PNLE` | `en-PH`, `tl` |

---

## Checklist Before Any International Launch

```
□ Pathway registered in exam-pathways-data-segment-*.ts
□ contentExamKeys populated (not empty array)
□ Questions adapted and seeded with correct examKey
□ Lessons published with correct examKey  
□ Flashcards tagged with correct examKey
□ Stripe product + price created for market currency
□ Regulatory disclaimers reviewed by legal
□ Marketing hub content reviewed for accuracy
□ robots tags removed from pathway hub page
□ Pathway added to PATHWAY_LAUNCH_APPROVED
□ Region added to GLOBAL_REGION_EXPANSION_PUBLISHED
□ Support documentation updated
□ Smoke test: subscribe → onboard → study → CAT exam
```
