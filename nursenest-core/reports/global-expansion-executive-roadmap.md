# PHASE 10 — Global Expansion Executive Roadmap
Generated: 2026-05-30

## What Already Exists

NurseNest has invested significantly in international infrastructure. Do not rebuild what already exists.

| Asset | Status | Location |
|---|---|---|
| 6 international exam pathway shells | Registered, hidden | `exam-pathways-data-segment-e.ts` |
| 30+ global region configs | Configured | `market-readiness-data.ts`, `global-regions.ts` |
| 17 global exam marketing hubs | Live | `/exams/[region]` routes |
| 14 country nav priority maps | Configured | `country-nav-priority-map.ts` |
| Launch readiness gate | Built | `country-exam-launch-readiness.ts` |
| Content isolation gate | Built | `GLOBAL_REGION_EXPANSION_PUBLISHED` (empty) |
| Multi-locale i18n | Configured | 13+ languages |
| Global content reuse architecture | Designed | `examFamily`, `contentExamKeys` pattern |
| Clinical Skills (221 procedures) | Live, globally reusable | `clinical-skills-catalog.ts` |
| All simulations (ECG, ventilator, hemodynamics, physiology) | Live, globally reusable | Multiple modules |

---

## What Must Be Built

| Item | Markets | Effort | Priority |
|---|---|---|---|
| NMC CBT question bank (~500 adapted Q's) | UK | 8 weeks | P1 |
| OSCE station prep content | UK | 6 weeks | P1 |
| GBP Stripe pricing | UK | 1 week | P1 |
| PNLE question bank adaptation | Philippines | 6 weeks | P2 |
| PHP Stripe pricing + Tagalog overlays | Philippines | 3 weeks | P2 |
| NMBA/IQNM content (portfolio framing) | Australia | 8 weeks | P2 |
| NCNZ pathway registration + content | New Zealand | 6 weeks (post-AU) | P3 |
| NMBI pathway registration + content | Ireland | 5 weeks (post-UK) | P3 |
| US billing/Stripe + minor content tagging | United States | 2 weeks | P0 |

---

## What Should Be Delayed

| Item | Reason |
|---|---|
| India full launch | Needs INR pricing, Hindi i18n — high effort, lower ARPU |
| Nigeria full launch | Very low ARPU; needs NGN pricing + local compliance |
| Japan/China/Korea | Requires full translation + culturally different study patterns |
| Saudi Arabia | Needs Arabic UI; regulatory complexity high |
| European markets (DE/FR/IT) | Low nursing exam specialisation; market uncertain |

---

## Recommended Launch Sequence

### Phase A — United States (NOW → 4 weeks)

**What to do:**
1. Tag all existing NCLEX-RN Canada content with `us-rn-nclex-rn` exam key
2. Configure USD Stripe pricing
3. Enable US billing in conversion funnel
4. Add `us-rn-nclex-rn` to `PATHWAY_LAUNCH_APPROVED`
5. Add `us` to `GLOBAL_REGION_EXPANSION_PUBLISHED`
6. Test sitemap, CAT exam, and flashcard delivery for US subscribers

**What NOT to build:** New lesson/question content — 92% of CA content works as-is.

---

### Phase B — Philippines (Q3 2026, ~12 weeks)

**What to do:**
1. Adapt 300–500 NCLEX-RN questions for PNLE format
2. Configure PHP Stripe pricing
3. Add Tagalog i18n overlay layer
4. Add `ph-rn-prc-pnle` to `PATHWAY_LAUNCH_APPROVED`
5. Add `philippines` to `GLOBAL_REGION_EXPANSION_PUBLISHED`

**Content reuse:** ~80% of clinical science lessons, all simulations, all clinical skills

---

### Phase C — United Kingdom (Q4 2026, ~16 weeks)

**What to do:**
1. Build NMC CBT question bank (500+ questions in NMC format)
2. Build OSCE station preparation content (20+ stations)
3. Add UK drug name terminology overlay
4. Configure GBP Stripe pricing
5. Map NMC Standards of Proficiency to content tags
6. Add `uk-rn-nmc-test-of-competence` to `PATHWAY_LAUNCH_APPROVED`
7. Add `uk` to `GLOBAL_REGION_EXPANSION_PUBLISHED`

**Content reuse:** 82% of lessons, 95% of simulations, 97% of clinical skills

---

### Phase D — Australia + New Zealand (Q1 2027, ~14 weeks)

**What to do:**
1. Build IQNM portfolio guidance content
2. Map NMBA competency standards to lesson tags
3. Configure AUD + NZD Stripe pricing
4. Register NCNZ pathway in exam-pathways-data (new entry needed)
5. Add `aus`/`new-zealand` to `GLOBAL_REGION_EXPANSION_PUBLISHED`
6. Build NCNZ competency mapping supplement (leverages AU content)

---

### Phase E — Ireland (Q2 2027, ~8 weeks)

**What to do:**
1. Register NMBI pathway in exam-pathways-data (new entry needed)
2. Build NMBI standards mapping document
3. Configure EUR Stripe pricing (shared with UK region)
4. Map HSE system orientation content
5. Add `ireland` to `GLOBAL_REGION_EXPANSION_PUBLISHED`

**Content reuse:** 88% from UK content base

---

## Content Migration Architecture

```
GLOBAL CORE LESSON (e.g., "Heart Failure Management")
│
├── Core content: identical for all markets
│     • Pathophysiology
│     • Clinical presentation
│     • Diagnostic criteria
│     • Management principles
│     • Lab interpretation
│     • Pharmacology core
│
├── 🍁 Canada/US supplement
│     • NCLEX-RN question format
│     • NGN item integration
│     • CNA/BRN scope notes
│
├── 🇬🇧 UK supplement
│     • NMC CBT question format
│     • UK drug names (furosemide → frusemide historical note)
│     • NHS care pathway references
│     • NMC standards of proficiency mapping
│
├── 🇦🇺 AU/NZ supplement
│     • NMBA/NCNZ competency mapping
│     • AHPRA documentation framing
│     • Australian drug names (paracetamol etc.)
│
└── 🇮🇪 Ireland supplement
      • NMBI code mapping
      • HSE system context
      • Minor UK/IE terminology differences
```

**Single source of truth. No duplicate lesson files. Country supplements are thin overlays only.**

---

## Success Metrics

| Market | 6-Month Target MAU | 12-Month Target MRR |
|---|---|---|
| United States | 3,000 | $150K |
| Philippines | 5,000 | $75K |
| United Kingdom | 1,000 | $55K |
| Australia | 600 | $30K |
| New Zealand | 200 | $9K |
| Ireland | 250 | $11K |

---

## All International Pathways Hidden Until Released

All international pathways remain gated behind:
- `PATHWAY_LAUNCH_APPROVED` (editorial sign-off)
- `GLOBAL_REGION_EXPANSION_PUBLISHED` (regional sign-off)
- `status: "upcoming"` + `acquisitionMode: "waitlist"` (prevents subscription)
- `robots: { index: false }` until regional SEO approval

No international content will appear publicly until explicitly approved at both levels.
