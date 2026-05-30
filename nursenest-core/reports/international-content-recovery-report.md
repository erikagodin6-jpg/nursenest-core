# PHASE 1 — International Content Recovery Report
Generated: 2026-05-30

## Executive Summary

NurseNest already contains a substantial global expansion infrastructure. Six international exam pathways are registered, 30+ regions are configured with locales and currencies, and 17 global exam hubs are live as marketing shells. However, **zero international content (lessons/questions) has been published** to any non-Canada/US pathway.

---

## Infrastructure Already Built

### Exam Pathways Registered (Segment E)
| Pathway ID | Country | Regulator | Status | Content |
|---|---|---|---|---|
| `uk-rn-nmc-test-of-competence` | United Kingdom | NMC CBT + OSCE | upcoming / waitlist | 0 lessons, 0 questions |
| `au-rn-iqnm-pathway` | Australia | NMBA–AHPRA IQNM | upcoming / waitlist | 0 lessons, 0 questions |
| `ph-rn-prc-pnle` | Philippines | PRC PNLE | upcoming / waitlist | 0 lessons, 0 questions |
| `in-rn-state-nursing-council-registration` | India | INC-aligned | upcoming / waitlist | 0 lessons, 0 questions |
| `ng-rn-nmcn-licensure` | Nigeria | NMCN | upcoming / waitlist | 0 lessons, 0 questions |
| `sa-rn-scfhs-licensure` | Saudi Arabia | SCFHS | upcoming / waitlist | 0 lessons, 0 questions |

All use `examFamily: "GENERIC"`, empty `contentExamKeys[]` arrays, and are blocked from the public sitemap until added to `GLOBAL_REGION_EXPANSION_PUBLISHED`.

### Market Readiness Tiers
| Tier | Markets |
|---|---|
| **Full support** | US, Canada |
| **Partial** | Philippines (SEO live, needs pricing + Tagalog), India (SEO live, needs INR pricing + Hindi) |
| **Marketing / SEO only** | UK, Ireland, Australia, New Zealand, Nigeria, Kenya, South Africa, Japan, China, South Korea, Indonesia, Vietnam, Thailand, Italy, Greece, Hungary, Portugal, Mexico, Germany, France, Singapore, UAE, Saudi Arabia, Pakistan, Bangladesh, Jamaica, Trinidad |
| **Planned** | (none explicitly — all above are at minimum "marketing") |

### Launch Approval Gates
- `PATHWAY_LAUNCH_APPROVED`: 9 pathways (US/CA NCLEX, CA RPN, US NP tracks, Allied)
- `GLOBAL_REGION_EXPANSION_PUBLISHED`: **Empty — no international regions approved for public launch**

### Locale Coverage (30+ Regions)
Languages configured beyond English: Japanese, Hindi, Simplified Chinese, Traditional Chinese, Korean, Italian, Greek, German, French, Hungarian, Portuguese, Spanish, Tagalog.

### Global Exam Hubs (Live Marketing Pages)
17 regions have shipped `/exams/…` marketing hubs including: UK, Australia, Philippines, India, Nigeria, UAE/Middle East, and major European/Asian markets.

---

## Content Status by Target Country

### Canada — ACTIVE ✅
- Pathways: `ca-rn-nclex-rn`, `ca-rpn-rex-pn`, `ca-np-cnple`
- Full exam prep: lessons, questions, CAT exams, flashcards
- French i18n configured

### United States — ACTIVE ✅
- Pathways: `us-rn-nclex-rn`, `us-lpn-nclex-pn`, US NP tracks, Allied
- Full exam prep: 200–436 lessons, 230–1496 questions per pathway

### United Kingdom — INFRASTRUCTURE ONLY 🏗️
- Pathway shell: registered, no content
- Sub-regions configured: England, Scotland, Wales, Northern Ireland (distinct SEO)
- NMC notes: "NMC exam pathway differs significantly from NCLEX. Needs dedicated question adaptation."
- Marketing hub: live at `/exams/uk`

### Australia — INFRASTRUCTURE ONLY 🏗️
- Pathway shell: registered, no content
- NMBA/AHPRA notes: "Needs adapted exam framing."
- Marketing hub: live at `/exams/australia`

### New Zealand — CONFIG ONLY 📋
- Pathway: not registered (no NCNZ pathway defined)
- Market config: `marketing` tier, SEO enabled

### Ireland — CONFIG ONLY 📋
- Pathway: not registered (no NMBI pathway defined)
- Market config: `marketing` tier, SEO enabled
- Notes: "NMBI registration. Distinct from UK system."

### Philippines — PARTIAL 🟡
- Pathway shell: registered, no content
- Market tier: `partial` — highest priority after US/CA
- SEO enabled, needs pricing + Tagalog overlays

---

## Reusable Assets Found

### Clinical Skills (221 Procedures)
20 clinical skill modules in `clinical-skills-catalog.ts` — all globally reusable (sterile technique, injection training, airway management, etc.)

### Simulations / ECG / Labs / Hemodynamics
Entire simulation engine (ventilator, physiology monitor, ECG, hemodynamics) is content-agnostic and globally reusable.

### Flashcard System
Fully built, pathway-agnostic, reusable across all markets.

### Blog / SEO Content
Blog infrastructure supports multi-locale publishing. Blog enabled for all 30+ regions.

---

## Gaps Identified

| Gap | Severity |
|---|---|
| No NCNZ pathway registered (New Zealand) | HIGH |
| No NMBI pathway registered (Ireland) | HIGH |
| All international pathways have 0 lessons/questions | CRITICAL |
| No pricing configured for any expansion market | HIGH |
| No questions adapted for NMC CBT, NMBA, NCNZ, NMBI | HIGH |
| `GLOBAL_REGION_EXPANSION_PUBLISHED` is empty | BLOCKER |

---

## Flags

- Nothing is accidentally indexed — all international pathways are gated via `isIntlRnFoundationPathwayId()` and blocked from sitemap
- All international pages use `robots: { index: false }` until approved
- Safe to begin content development; publication gate prevents premature launch
