# NurseNest — Homepage Positioning Rebalance Audit

**Date:** 2026-05-30
**Scope:** Nursing-first homepage rebalance + Allied Health as dedicated secondary ecosystem

---

## Current State Assessment

### What the Homepage Currently Does

The hero headline — "Master Nursing. Think Like a Clinician." — is already nursing-first. The subheading attempts to list every audience: "built for RN, PN or RPN, NP, allied health, and pre-nursing learners."

The `HomepageEcosystemDiscovery` section treats all six pathways (RN, RPN, NP, Allied Health, Pre-Nursing, New Graduate) as equal-weight cards.

**Result:** A visitor sees nursing in the headline but six equal-weight pathways below. The visual message is: six equal audiences, not "nursing platform with allied expansion."

### Allied Health Infrastructure (Already Built)

22+ professions registered in `/allied-health/` route tree:

| Category | Professions |
|---|---|
| Therapy & Rehab | OT, PT/Physiotherapy, OTA, PTA |
| Lab & Imaging | MLT, Radiography, Sonography, Imaging, Lab Assistant |
| Field & Acute | Paramedic, EMT, Respiratory Therapy |
| Clinical | Medical Assistant, Dental Assistant, Dental Hygiene, Pharmacy Tech |
| Community & Support | PSW/HCA, Social Work, Mental Health & Addictions, Community Health Worker |

**Existing routes:**
- `/allied-health/` — hub page with `AlliedHealthHomepage` component
- `/allied-health/[slug]` — per-profession pages via `AlliedHealthPathwayHub`
- `/allied/allied-health/` — global pathway hub with `AlliedHealthSubdomainHomepage`
- `allied.nursenest.ca` — subdomain referenced in server middleware and SEO config

### Homepage Allied Health Gap

| Metric | Current State | Target State |
|---|---|---|
| Allied Health above fold | Mention in subheading only | Dedicated section below pathways |
| Allied content weight | ~16% (1 of 6 equal pathway cards) | ~20–25% (dedicated section) |
| Link to allied hub from hero | None | CTA in dedicated section |
| Profession-specific screenshots | None on homepage | 3 featured profession screenshots |
| `allied.nursenest.ca` referenced | Never on homepage | CTA in dedicated section |
| Nursing content weight | ~70% | ~75–80% |

---

## Target Architecture

### Nursing-First Hierarchy

```
HOMEPAGE
│
├── HERO — "NurseNest is the most comprehensive nursing education ecosystem"
│    Eyebrow: "For RN, RPN, NP, Pre-Nursing & New Graduate Learners"
│    Headline: Clear nursing-first
│    No allied mention in hero (allied has its own section below)
│
├── ECOSYSTEM DISCOVERY — 15 feature cards + product demos
│    Nursing-scoped screenshots and copy
│
├── PLATFORM CAPABILITY STRIP — 8 clinical capabilities
│    Nursing lens
│
├── ECG SECTION — dedicated, prominent
│
├── PATHWAY SHOWCASE — 5 nursing cards
│    [RN] [RPN] [NP] [Pre-Nursing] [New Graduate]
│    No allied card here — moved to dedicated section below
│
├── CLINICAL DEPTH — 8 clinical domain cards
│
├── STUDY ECOSYSTEM — Read→Practice→Remediate flow
│
├── SOCIAL STUDY
│
├── READINESS PREVIEW
│
├── ── NEW ── ALLIED HEALTH ECOSYSTEM SECTION ──────────────────────────
│    Eyebrow: "Allied Health Pathways"
│    H2: "A Complete Allied Health Learning Ecosystem"
│    Body: Dedicated platform for 22+ allied professions
│    6 profession clusters with icons
│    CTA: "Explore Allied Health →" → /allied-health/
│
├── TRUST / TESTIMONIALS
│
├── BLOG TEASER
│
└── FINAL CTA
```

---

## Implementation Plan

### Change 1 — Hero Rebalance

**File:** `src/components/marketing/home/premium-homepage-hero.tsx`

**Current eyebrow:** "Adaptive Clinical Readiness"
**New eyebrow:** "For RN, RPN, NP, Pre-Nursing & New Graduate Learners"

This removes allied health from the hero positioning entirely — they have their dedicated section below. The hero now speaks directly and exclusively to the nursing audience.

**Current subheading mentions:** "allied health" as one of many audiences
**New subheading:** Remove "allied health" — focus on nursing scope depth

Example subheading:
> "Lessons, NGN practice, CAT exams, ECG, labs, medication math, clinical skills, and simulations — built for NCLEX-RN, REx-PN, CNPLE, and pre-nursing in one connected ecosystem."

**Secondary CTA fix:** Change `HUB.examLessons` destination → `HUB.pricing` (or equivalent pricing constant)

### Change 2 — Pathway Showcase Rebalance

**File:** `src/components/marketing/home/premium-pathway-showcase.tsx`

**Current:** 5 cards — RN, PN/RPN, NP, Allied Health, Pre-Nursing (equal weight)
**New:** 5 nursing-only cards — RN, RPN, NP, Pre-Nursing, New Graduate

Remove Allied Health from the pathway showcase. Allied Health gets its own dedicated section below.

Update Pre-Nursing card body: Add "ATI TEAS, HESI A2, CASPer" explicitly.
Update NP card body: Add "CNPLE, FNP, PMHNP, WHNP, AGPCNP" explicitly.

### Change 3 — Allied Health Ecosystem Section (New Component)

**New file:** `src/components/marketing/home/homepage-allied-health-section.tsx`

**Section position:** After `PremiumHomepageTrust`, before `HomeBlogTeaserSection`

This section communicates:
1. Allied Health is a full ecosystem, not an afterthought
2. 22+ professions are supported
3. Direct CTA to `/allied-health/`
4. Featured profession clusters (RT, Paramedic, MLT)

**Content:**
```
Eyebrow: Allied Health Pathways
H2: A Complete Allied Health Learning Ecosystem
Body: NurseNest supports 22+ allied health professions with 
occupation-specific lessons, questions, clinical skills, and 
certification prep — separate from nursing pathways.

[Respiratory Therapy] [Paramedic/EMT] [Medical Lab] [Physiotherapy] [OT] [PSW]
Screenshots: RT-specific, Paramedic-specific, MLT-specific

CTA: "Explore Allied Health" → /allied-health/
```

### Change 4 — HomepageEcosystemDiscovery Pathway Grid Update

**File:** `src/components/marketing/home/homepage-ecosystem-discovery.tsx`

Update the `PATHWAYS` constant: Replace "Allied Health" with "New Graduate" (since Allied Health now has its own section). The pathway grid becomes 5 nursing-specific entries.

---

## Allied Health Hub Audit — /allied-health/

### Current State

The `/allied-health/` page (`AlliedHealthHubPage`) uses:
- `AlliedHealthHomepage` component — hero with profession chips
- `AlliedHubProfessionSections` — categorized profession directory
- `AlliedHealthTrustStrip` — trust section

**Hero headline:** "Built for Allied Health Professionals"
**Eyebrow:** "Allied Health Pathways"
**Profession chips:** RT, Medical Laboratory, Paramedicine, Physiotherapy, Diagnostic Imaging, OT, Social Work, Pharmacy Tech

**Assessment:** The allied health hub has a strong hero that is clearly profession-specific. It does NOT look like "a nursing page with renamed labels" — it has its own visual identity and profession grid.

### Gaps in Current Allied Hub

| Gap | Priority |
|---|---|
| No visible link to `allied.nursenest.ca` or description of subdomain | MEDIUM |
| No profession-specific screenshots in hub hero (chips only) | HIGH |
| No "what sets this apart from nursing prep" section | HIGH |
| No certification names visible in hub overview (NBRC, NREMT, etc.) | HIGH |
| Hub meta title: generic ("Allied Health Hub") vs keyword-specific | MEDIUM |
| No comparison: Allied Health NurseNest vs generic study apps | LOW |

---

## Profession Landing Page Audit

### Audit Criteria (per profession)

For each of the 22+ profession pages (`/allied-health/[slug]`):

| Criterion | Check |
|---|---|
| Self-identification within 3 seconds | H1 must say the profession name + "exam prep" |
| Profession-specific screenshots | Should NOT show NCLEX questions |
| Competencies visible | examOverview array must have ≥3 items |
| Certification names visible | Must name the actual exam (NBRC, NREMT, etc.) |
| Placement/career tools visible | roleHero.whereYouWork must be populated |
| Clinical skills visible | features array must mention skills |
| Simulations visible | scenarioCatalogCategoryIds or features must mention scenarios |

### Profession-by-Profession Gap Analysis

**Respiratory Therapy (`/allied-health/respiratory-therapy-exam-prep`)**
- ✅ H1: "Respiratory therapy exam prep"
- ✅ examOverview populated (ventilation, gas exchange, airway management)
- ⚠️ Certification name: NBRC/CRT/RRT not explicitly named in the registry entry
- ⚠️ Screenshots: Uses shared allied template — no RT-specific screenshots confirmed
- ❌ Simulations: `scenarioCatalogCategoryIds` not confirmed for RT

**Paramedic (`/allied-health/paramedic-exam-prep`)**
- ✅ H1: "Paramedic exam prep"
- ✅ Category: "acute" — appropriate
- ⚠️ Certification: NREMT, ACP not explicitly named
- ❌ Screenshots: No paramedic-specific trauma assessment screenshot
- ⚠️ Registry: `roleHero` / `skillOverlay` populated?

**MLT (`/allied-health/mlt-exam-prep`)**
- ✅ H1: "Medical laboratory technology exam prep" (needs verify)
- ✅ Category: "lab" — appropriate
- ⚠️ Certification: CSMLS, ASCP MLT not explicitly named
- ❌ Screenshots: No MLT-specific CBC/hematology screenshot

**Physiotherapy (`/allied-health/physiotherapy-exam-prep`)**
- ✅ H1: "Physiotherapy exam prep"
- ⚠️ Certification: NPTE, PCE not explicitly named
- ❌ Screenshots: No gait/mobility assessment screenshot

**Occupational Therapy (`/allied-health/occupational-therapy-exam-prep`)**
- ✅ H1: "Occupational therapy exam prep"
- ⚠️ Certification: NBCOT not explicitly named
- ❌ Screenshots: No ADL/functional evaluation screenshot

**PSW/HCA (`/allied-health/psw-hca-exam-prep`)**
- ✅ Category: "support" — appropriate
- ⚠️ Certification: Province-specific (HCAP, etc.) not named
- ❌ Placement/career tools: unclear if populated

### Screenshot Strategy for Profession Pages

The current profession pages use the shared `AlliedHealthPathwayHub` component which renders generic study cards. Without profession-specific screenshot images, the pages look like nursing hubs with a different title.

**Required screenshot set (priority order):**

| Profession | Screenshot Needed | Alt Text |
|---|---|---|
| RT | `allied-rt-abg-interpretation.png` | "ABG interpretation workflow with pH, PaCO2, PaO2, and compensation assessment" |
| Paramedic | `allied-paramedic-trauma-assessment.png` | "Primary trauma survey decision workflow for paramedic certification" |
| MLT | `allied-mlt-cbc-interpretation.png` | "CBC panel interpretation with WBC, RBC, hemoglobin, and platelet analysis" |
| Physiotherapy | `allied-pt-mobility-assessment.png` | "Gait analysis and functional mobility assessment workflow" |
| OT | `allied-ot-adl-evaluation.png` | "ADL evaluation with activity analysis and goal-setting framework" |

These screenshots need to be generated or captured from actual platform content for these professions.

---

## Internal Linking Plan

### Homepage → Allied Health

Current: Zero direct links from homepage to `/allied-health/`
Target: One prominent CTA in the new Allied Health Ecosystem section

**Linking hierarchy from homepage:**
```
Homepage Allied Health Section
├── CTA: "Explore Allied Health" → /allied-health/
├── RT chip → /allied-health/respiratory-therapy-exam-prep
├── Paramedic chip → /allied-health/paramedic-exam-prep
├── MLT chip → /allied-health/mlt-exam-prep
├── Physiotherapy chip → /allied-health/physiotherapy-exam-prep
├── OT chip → /allied-health/occupational-therapy-exam-prep
└── "View all 22+ professions" → /allied-health/
```

### Cross-Domain Authority (nursenest.ca ↔ allied.nursenest.ca)

**Current issue:** The main domain and allied subdomain appear to be separate deployments. `robots.txt` explicitly prevents allied.nursenest.ca sitemap URLs from appearing in the main sitemap. This means the subdomain is treated as a separate SEO entity.

**Implication:** Internal links from `www.nursenest.ca` to `allied.nursenest.ca` are treated as external links by Google — they pass authority but do not create an "internal" link graph. This is acceptable for brand architecture but means:
1. Allied content does NOT inherit the main domain's authority
2. Allied pages must build their own authority
3. The main homepage should still link to `allied.nursenest.ca` for brand discovery, but should also maintain `/allied-health/` as the primary on-domain discovery point

**Recommended architecture:**
- Primary discovery: `www.nursenest.ca/allied-health/` (on-domain, benefits from main domain authority)
- Secondary: `allied.nursenest.ca` (dedicated brand experience for heavy allied users)
- Homepage should link to both, with `/allied-health/` as the primary CTA

---

## SEO Targeting Rebalance

### Homepage Keywords — After Rebalance

**Target (retain):**
- "NCLEX RN study" / "NCLEX practice questions"
- "REx-PN prep" / "RPN exam prep"
- "CNPLE prep" / "NP exam prep"
- "nursing school" / "nursing education"
- "nursing flashcards" / "nursing questions"
- "NGN practice questions"

**Removed from hero:**
- "allied health study" (moves to /allied-health/)
- "respiratory therapy prep" (moves to /allied-health/respiratory-therapy-exam-prep)
- "paramedic study" (moves to /allied-health/paramedic-exam-prep)

### Homepage Meta Title (After Rebalance)

**Current CA:** "NurseNest | Global Nursing Exam Prep — Canada-First Depth for RN, RPN, NP & Allied Health"
**Proposed CA:** "NurseNest | Complete Nursing Exam Prep — NCLEX-RN, REx-PN, CNPLE for RN, RPN & NP"

**Current US:** "NurseNest | US NCLEX-RN, NCLEX-PN (LPN/LVN), NP & allied exam prep"
**Proposed US:** "NurseNest | NCLEX-RN, NCLEX-PN & NP Exam Prep with ECG, Labs, NGN & Clinical Skills"

Removing "allied" from meta title focuses the homepage on its strongest keyword cluster while allied health keywords are targeted via `/allied-health/` which has its own indexed pages.

---

## Success Criteria

After rebalance implementation:

**Homepage (nursing-first):**
- [ ] Visitor understands platform is nursing-first within 3 seconds
- [ ] Hero eyebrow names RN, RPN, NP, Pre-Nursing, New Grad explicitly
- [ ] No allied health in hero eyebrow or headline
- [ ] Five nursing pathway cards (RN, RPN, NP, Pre-Nursing, New Grad)
- [ ] "ATI TEAS, HESI A2, CASPer" visible on Pre-Nursing card
- [ ] "CNPLE, FNP, PMHNP" visible on NP card
- [ ] Secondary CTA links to pricing, not lessons

**Allied Health Discovery:**
- [ ] Dedicated "Allied Health Ecosystem" section on homepage
- [ ] 6 profession clusters visible with links
- [ ] CTA to /allied-health/ from homepage
- [ ] Allied health hub feels like a dedicated platform

**Allied Health Hub (/allied-health/):**
- [ ] Visitor identifies as RT/Paramedic/MLT within 3 seconds
- [ ] Profession-specific certification names visible (NBRC, NREMT, CSMLS)
- [ ] Screenshots reflect profession-specific content
- [ ] Strong internal linking to each profession page
