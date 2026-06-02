# NurseNest Allied Health Homepage — Truthfulness & Conversion Audit

**Date:** 2026-05-31
**Scope:** Every claim on the `/allied-health/` premium homepage verified against actual platform capability
**Method:** Direct code review of `allied-professions-registry.ts`, `allied-professions/registry.ts` (lesson catalogs), `allied-pathway-hub-overview.ts`, `cat-readiness-floor.ts`, and the DB schema

---

## Evidence Baseline

### Lesson Catalog Reality

| Profession | Dedicated Lesson Catalog | Lesson Topics (Sections) | Notes |
|---|---|---|---|
| Respiratory Therapy | ✅ Yes (`respiratory-therapy.ts` + `respiratory-therapy-floor-practice.ts`) | ventilationFoundations, abg, waveform, + floor practice | Strong — 6 RT-specific sections |
| Paramedic | ⚠️ None (EMT has `emergency-medical-services.ts`) | topicSlugsIn includes **"nursing-fundamentals"** | Pulls shared nursing content |
| MLT | ✅ Yes (`medical-laboratory-technology.ts`) | specimenIntegrity, hematology, chemistry, microbiology, transfusion, qualityControl | Strong — 6 lab-specific sections |
| Physiotherapy | ✅ Yes (`physiotherapy-rehab.ts`) | movementAssessment, therapeuticExercise, gaitMobility, neuroRehab, cardiopulmonary, documentationScope | Good — 6 PT-specific sections |
| Occupational Therapy | ✅ Yes (`occupational-therapy.ts`) | occupationBasedAssessment, adlIadlIntervention, cognitionPerception, upperExtremity, psychosocialPediatrics, documentationScope | Good — 6 OT-specific sections |
| Social Work | ✅ Yes (`mental-health-social-work.ts`, shared) | therapeuticCommunication, suicideRisk, addictionsRecovery, traumaInformedCare, crisisDeescalation, ethicsSystemsAdvocacy | Good — 6 sections; shared with psychotherapy |
| Psychotherapy | ✅ Yes (`mental-health-social-work.ts`, shared) | Same 6 sections as Social Work | Shared catalog — minimal differentiation |
| PSW / HCA | ❌ None | topicSlugsIn: patient-assessment, vital-signs, patient-communication, infection-control, healthcare-teamwork | Pure nursing fundamentals topics |

### Platform-Level Capability State

| Feature | Allied Health State | Notes |
|---|---|---|
| Lessons | Live — varies by profession | See catalog table above |
| Practice Questions | Conditionally live | DB-dependent; `questionSnapshot.status` may be "unavailable" |
| Flashcards | Conditionally live | Null if no flashcard decks created for pathway |
| CAT Adaptive Exams | Conditionally live | Requires ≥30 adaptive-eligible questions (`CAT_MIN_COMPLETE_POOL = 30`) |
| Clinical Simulations | ❌ Not yet live for allied | `simulations: null` hardcoded in overview; no `scenarioCatalogCategoryIds` set |
| Clinical Skills | ❌ No allied-specific count | `clinicalSkills: null` hardcoded in overview |
| Study Plans | Likely available | Platform-level feature, not allied-specific |
| Readiness Analytics | Partially live | Session reports exist; domain bands not allied-specific |
| Adaptive Remediation | Partially live | Weak-area routing tied to question bank; profession-specificity unclear |
| Report Cards | Likely available | Platform-level feature |
| Lab Interpretation | Nursing-first | Lab workstation is primarily RN/allied shared |

### Broken Link Found During Audit (Now Fixed)

RT homepage links used `"respiratory-therapy-exam-prep"` — the actual registry segment is `"rrt-exam-prep"`. Both `allied-health-homepage.tsx` and `homepage-allied-health-section.tsx` were corrected as part of this audit.

---

## Section-by-Section Audit

---

### HERO SECTION

**Claim 1:** "The Complete Allied Health Education Ecosystem."
- **Support level:** PARTIALLY SUPPORTED
- **Evidence:** Strong lesson catalogs exist for RT, MLT, PT, OT, Social Work/Psychotherapy. Simulations and clinical skills do not currently return allied-specific counts.
- **Risk:** MEDIUM — headline implies equivalent completeness to the nursing ecosystem, which does not yet exist.
- **Recommendation:** Change to "A Growing Allied Health Education Ecosystem" or add footnote: "Content depth varies by profession — see individual pathway for current coverage."

---

**Claim 2:** "Profession-specific — not rebranded nursing prep" (trust pill)
- **Support level:** PARTIALLY SUPPORTED — RISK
- **Evidence:**
  - RT, MLT, PT, OT, Social Work: TRUE — dedicated lesson catalogs with profession-specific content
  - **Paramedic: FALSE** — `topicSlugsIn` explicitly includes `"nursing-fundamentals"`. Paramedic learners receive nursing fundamentals lessons mixed into their pathway.
  - **PSW/HCA: FALSE** — `topicSlugsIn` is entirely shared nursing topics: patient-assessment, vital-signs, patient-communication, infection-control, healthcare-teamwork. This is nursing fundamentals content.
- **Risk:** HIGH — this is the most prominent trust claim and is falsified by two high-profile professions.
- **Recommendation:** Qualify to "Profession-specific content for RT, MLT, PT, OT, Social Work, and Psychotherapy. Paramedic and PSW pathways draw from shared clinical fundamentals." Or invest in dedicated catalogs for paramedic and PSW before this claim can stand.

---

**Claim 3:** "22+ allied health professions supported" (trust pill)
- **Support level:** FULLY SUPPORTED
- **Evidence:** 22 professions registered in `ALLIED_PROFESSIONS` array in the registry.
- **Risk:** LOW

---

**Claim 4:** Stats row (question count, lesson count, flashcard count)
- **Support level:** PARTIALLY SUPPORTED
- **Evidence:** Stats are pulled from `getHomepagePublicHomeStats()` which returns platform-wide numbers — RN + NP + allied combined. These are not allied-only counts.
- **Risk:** MEDIUM — a visitor may believe these are allied health-specific counts. If the platform has 43,000 questions, almost all are nursing-scoped.
- **Recommendation:** Remove stats from the hero or qualify with "across all NurseNest pathways." Do not imply these are allied-only figures.

---

### PROFESSION SHOWCASE (Phase 2)

**Claim 5:** Certification names (NBRC/CRT/RRT, NREMT/ACP, CSMLS/ASCP, NPTE/PCE, NBCOT/COTEC, ASWB, CRPO, HCAP)
- **Support level:** FULLY SUPPORTED as naming
- **Evidence:** These are the actual certification bodies for each profession. Platform doesn't claim to be accredited by them, only to provide prep.
- **Risk:** LOW — correctly lists the certifications each profession targets.

---

**Claim 6:** Domain badges per profession card (e.g., RT: "Airway Management", "Mechanical Ventilation", etc.)
- **Support level:** FULLY SUPPORTED for RT, MLT, PT, OT, Social Work
- **Evidence:** Dedicated lesson catalogs contain exactly these topics.
- **Partial risk for Paramedic and PSW** — domain badges like "Trauma Assessment" and "Shock Management" imply dedicated paramedic content, but the actual lesson content pulls shared topics.
- **Risk:** MEDIUM for paramedic and PSW cards.

---

**Claim 7:** "Explore pathway" links for each profession
- **Support level:** PARTIALLY SUPPORTED
- **Evidence:** Segments verified for all except RT (now fixed). All 8 professions shown have live pages.
- **Bug fixed:** RT was `/allied-health/respiratory-therapy-exam-prep` (404) — corrected to `/allied-health/rrt-exam-prep`.
- **Risk:** LOW after fix.

---

### ECOSYSTEM SECTION (Phase 3 — "Everything Included")

**Claim 8:** "Profession-Specific Lessons"
- **Support level:** PARTIALLY SUPPORTED
- **Evidence:** 6 professions have dedicated catalogs. 2 (paramedic, PSW) draw from shared nursing topics.
- **Risk:** MEDIUM

---

**Claim 9:** "Flashcards — Spaced-repetition recall for terminology, procedures, and certification content."
- **Support level:** CONDITIONALLY SUPPORTED
- **Evidence:** Flashcard decks exist at the pathway level. `flashcardCount` in the overview returns null if no decks are created for the allied pathway IDs.
- **Risk:** MEDIUM — if the flashcard bank for allied is sparse or empty, this feature is prominently shown but not deliverable.
- **Recommendation:** Only show the flashcard feature card when `flashcardCount > 0` OR qualify with "expanding library."

---

**Claim 10:** "CAT Adaptive Exams — Computer-adaptive testing that adjusts difficulty to your actual readiness."
- **Support level:** CONDITIONALLY SUPPORTED
- **Evidence:** `practiceExamReady` in the overview is calculated from `marketingCatCompletePoolUsable()` which requires ≥30 adaptive-eligible questions. If the allied question bank has fewer than 30 adaptive-eligible items, CAT is not available.
- **Risk:** MEDIUM-HIGH — showing CAT as a guaranteed feature when it has a minimum pool requirement.
- **Recommendation:** The feature can be shown but should include a softer claim: "Adaptive exam practice when sufficient questions are available for your pathway."

---

**Claim 11:** "Clinical Simulations — Branching scenarios with patient deterioration, decision points, and outcomes."
- **Support level:** FUTURE CAPABILITY
- **Evidence:**
  - `contentCounts.simulations` is hardcoded `null` in `allied-pathway-hub-overview.ts` (line 121)
  - No `scenarioCatalogCategoryIds` is set for any profession in the registry
  - The hub page code comments: "Preview the learner scenarios shell with your occupation in the URL" — indicating a shell exists but content may be absent
- **Risk:** HIGH — this is the strongest-sounding clinical feature claim on the homepage. It appears in the hero ("branching scenarios"), the ecosystem grid, and the clinical reasoning section.
- **Recommendation:** Remove or heavily qualify all simulation claims. Change to: "Clinical simulation scenarios — coming for allied pathways" or gate behind actual content availability.

---

**Claim 12:** "Clinical Skills — Procedural competency workflows with OSCE-style step sequencing."
- **Support level:** FUTURE CAPABILITY / UNVERIFIED
- **Evidence:** `contentCounts.clinicalSkills` is hardcoded `null`. The clinical skills module in the main platform is nursing-first. No allied-specific clinical skills content confirmed.
- **Risk:** HIGH — this is presented as a live feature.
- **Recommendation:** Remove from the ecosystem grid until allied-specific clinical skills content is confirmed live.

---

**Claim 13:** "Lab Interpretation — CBC, ABG, chemistry panels, and diagnostic reasoning connected to clinical actions."
- **Support level:** PARTIALLY SUPPORTED
- **Evidence:** The lab workstation exists and is used for RN learners. MLT learners would benefit directly. RT learners benefit from ABG content. However, this is primarily a shared platform feature.
- **Risk:** LOW-MEDIUM — the feature exists; the risk is whether it's truly profession-scoped or just shared nursing lab content.

---

**Claim 14:** "Study Plans", "Report Cards", "Progress Tracking"
- **Support level:** LIKELY SUPPORTED
- **Evidence:** These are infrastructure-level features that likely work for all learners including allied. No allied-specific configuration required.
- **Risk:** LOW — these are genuine platform features.

---

**Claim 15:** "Readiness Analytics — Domain mastery bands, confidence calibration, and readiness scores."
- **Support level:** PARTIALLY SUPPORTED
- **Evidence:** The analytics infrastructure (confidence analytics, session reports) exists platform-wide. However, domain-specific mastery bands for allied health (e.g., "RT: ABG Interpretation 74%") are not confirmed as profession-specific outputs.
- **Risk:** MEDIUM — if analytics shows generic question accuracy rather than allied domain bands, this oversells the feature.

---

**Claim 16:** "Weak Area Review — Missed items and low-confidence topics route into focused review loops."
- **Support level:** LIKELY SUPPORTED
- **Evidence:** Smart review / weak area routing is a core platform feature tied to question bank results. Works for any pathway with questions.
- **Risk:** LOW — genuine feature.

---

### CLINICAL REASONING SECTION (Phase 5)

**Claim 17:** "NurseNest allied health content is written from the ground up for each profession — profession-specific rationales, clinical pearls, adaptive pathways, and simulations that reflect the environments where allied health professionals actually work."
- **Support level:** PARTIALLY SUPPORTED — RISK
- **Evidence:**
  - "Written from ground up" TRUE for RT, MLT, PT, OT, Social Work, Psychotherapy
  - "Written from ground up" FALSE for Paramedic (includes nursing-fundamentals) and PSW (entirely nursing topics)
  - "Simulations that reflect the environments" — simulations are `null` for all allied pathways
- **Risk:** HIGH — this is a prominent differentiation claim and is partially false.
- **Recommendation:** Qualify to specify which professions have fully independent content. Remove simulation reference until live.

---

**Claim 18:** "An RT learner never sees NCLEX-RN content. An MLT learner sees laboratory science, not clinical nursing. Content scope is enforced at the data layer."
- **Support level:** TRUE FOR RT AND MLT — FALSE FOR PARAMEDIC AND PSW
- **Evidence:**
  - RT: Uses `topicSlugsIn: ["patient-assessment", "vital-signs", "emergency-response", "infection-control", "human-physiology"]` — these are shared but not RN-specific
  - MLT: `topicSlugsIn: ["lab-values", "infection-control", "medical-terminology", "clinical-documentation"]` — appropriate scope
  - **Paramedic:** `topicSlugsIn: ["nursing-fundamentals", ...]` — directly contradicts this claim
  - **PSW:** Uses nursing fundamentals topic slugs exclusively
- **Risk:** HIGH — specific claim that can be fact-checked by a learner who signs up.
- **Recommendation:** This claim must be qualified or the paramedic and PSW `topicSlugsIn` must be fixed to remove nursing-fundamentals.

---

### READINESS PREVIEW SECTION (Phase 6)

**Claim 19:** Per-profession domain readiness bars (RT: Airway Management 88%, Ventilation 74%, etc.)
- **Support level:** SAMPLE DATA — APPROPRIATELY LABELED
- **Evidence:** Component explicitly labels this "Sample readiness — not real learner data"
- **Risk:** LOW — disclaimer is present and clear.

---

**Claim 20:** "Readiness signals combine domain mastery bands, question accuracy trends, competency progression, and study momentum — all mapped to your specific profession's certification blueprint domains."
- **Support level:** ASPIRATIONAL / PARTIALLY SUPPORTED
- **Evidence:** The readiness infrastructure combines these signals for RN/NP pathways. Whether it maps specifically to allied profession certification blueprints (NBRC domains, CSMLS domains, etc.) is not confirmed.
- **Risk:** MEDIUM — implies blueprint mapping that may not exist for allied professions.
- **Recommendation:** Change to "Readiness signals combine domain accuracy trends, study momentum, and weak-area routing — building toward profession-specific readiness framing as pathways mature."

---

### TESTIMONIALS SECTION (Phase 7)

**Claim 21:** 6 profession-specific testimonials
- **Support level:** MARKED AS REPRESENTATIVE — APPROPRIATE
- **Evidence:** Component inherits the trust section disclaimer pattern ("representative feedback"). The testimonials are not presented as verified reviews.
- **Risk:** LOW — the claims within each testimonial are plausible and profession-specific.
- **Note:** The PSW testimonial says "PSW content covers the actual care settings — long-term care, home support, palliative." The PSW lesson catalog only filters from nursing fundamentals topics. This testimonial is more aspirational than factual.
- **Risk for PSW testimonial:** MEDIUM — PSW content is not currently as differentiated as this implies.

---

### FAQ SECTION (Phase 8)

**Claim 22:** "NurseNest includes profession-specific clinical scenarios with branching decision points, patient deterioration cues, and outcome feedback tailored to each allied profession." (FAQ Q3)
- **Support level:** FUTURE CAPABILITY
- **Evidence:** `simulations: null` for all allied pathways. No `scenarioCatalogCategoryIds` set. The hub page references "case scenarios shell."
- **Risk:** HIGH — this is a specific, verifiable claim in the FAQ which gets scraped by Google for rich results.
- **Action required:** Update FAQ answer to: "Clinical simulation scenarios are being developed for allied health pathways. Currently, practice questions, lessons, and adaptive study tools are available."

---

**Claim 23:** "Every allied health practice question includes a clinical rationale written through the lens of your profession." (FAQ Q5)
- **Support level:** PARTIALLY SUPPORTED
- **Evidence:** Questions with `careerType: "allied"` and `exam: "ALLIED"` exist in the DB. Whether rationales are profession-specific rather than generic is not confirmed by the question schema alone.
- **Risk:** MEDIUM — the rationale quality claim is hard to verify without content sampling.

---

**Claim 24:** "Your subscription includes profession-specific lessons, practice questions with rationales, flashcards, clinical simulations, clinical skills, adaptive CAT exams, study plans, readiness analytics, and session report cards." (FAQ Q8)
- **Support level:** PARTIALLY SUPPORTED — RISK
- **Evidence:**
  - Clinical simulations: NOT yet live for allied
  - Clinical skills: NOT confirmed for allied
  - CAT exams: Conditional on question bank depth (min 30)
  - Flashcards: Conditional on deck creation for pathway
- **Risk:** HIGH — this FAQ answer lists features that are not yet guaranteed for allied health subscriptions.
- **Action required:** Update FAQ Q8 to omit clinical simulations and clinical skills, or add "where available for your specific pathway."

---

## Summary Risk Matrix

| Claim | Section | Support Level | Risk | Action |
|---|---|---|---|---|
| "Complete ecosystem" headline | Hero | Partially Supported | MEDIUM | Soften to "growing ecosystem" |
| "Not rebranded nursing prep" (trust pill) | Hero | **FALSE for Paramedic + PSW** | HIGH | Qualify or fix content scope |
| Stats row = allied-specific | Hero | Overstated | MEDIUM | Remove or add "across all pathways" |
| Clinical simulations exist | Ecosystem Grid, Clinical Reasoning, FAQ | **Future Capability** | HIGH | Remove or heavily qualify |
| Clinical skills exist | Ecosystem Grid | **Unconfirmed** | HIGH | Remove until confirmed |
| CAT exams always available | Ecosystem Grid | Conditional | MEDIUM | Add "where pathway depth supports it" |
| Flashcards always available | Ecosystem Grid | Conditional | MEDIUM | Show only when deck count > 0 |
| "Not nursing content" for paramedic | Clinical Reasoning | **FALSE** | HIGH | Fix topicSlugsIn or qualify |
| Blueprint-mapped readiness | Readiness Preview | Aspirational | MEDIUM | Soften language |
| PSW differentiated content | Testimonials | Overstated | MEDIUM | Fix PSW topicSlugsIn or soften testimonial |
| Simulations in FAQ | FAQ Q3, Q8 | **Future Capability** | HIGH | Update FAQ answers |
| Broken RT link | Profession Cards | **Bug — FIXED** | Fixed | rrt-exam-prep corrected |

---

## Features: Retain, Qualify, or Future-Flag

### ✅ Retain Without Change

- Profession showcase cards (RT, MLT, PT, OT, Social Work, Psychotherapy) — dedicated catalogs confirmed
- Certification names per profession — accurate
- Lessons feature card — accurate with qualification
- Practice Questions feature card — accurate with conditional language
- Study Plans, Report Cards, Weak Area Review, Progress Tracking — platform-level, works for all
- Testimonials (non-PSW) — representative, plausible
- FAQ answers for Q1, Q2, Q4, Q6, Q7 — accurate

### ⚠️ Qualify Before Shipping

| Feature/Claim | Qualification Needed |
|---|---|
| "Complete ecosystem" headline | → "Growing ecosystem" or "Comprehensive [profession] exam prep" |
| Stats row in hero | → Label as "platform-wide" or remove |
| Paramedic domain badges | → Add "Lessons include shared clinical fundamentals" |
| PSW domain badges | → Add "Core clinical fundamentals" (not profession-specific) |
| CAT exams | → "Adaptive exams where question depth supports it" |
| Flashcards | → "Growing flashcard library" |
| Readiness analytics | → Remove "blueprint-mapped" language |
| FAQ Q8 | → Remove clinical simulations and skills from subscription description |
| "Not rebranded nursing" trust pill | → Qualify: "for RT, MLT, PT, OT, Social Work, and Psychotherapy" |

### 🔴 Remove Until Live (Future Capability)

| Feature | Why |
|---|---|
| Clinical Simulations (all references) | `simulations: null` in all allied overviews; no content configured |
| Clinical Skills (as an allied feature) | `clinicalSkills: null`; no allied-specific skills content confirmed |
| FAQ Q3 (simulation answer) | Would appear in Google PAA rich results — must be accurate |

---

## Conversion Risk Assessment

### High Conversion Risk (User Subscribes Then Finds Missing Feature)

1. **Simulations** — Described prominently in 4 sections (hero subheading, ecosystem grid, clinical reasoning, FAQ). If a Paramedic or RT learner subscribes expecting branching clinical simulations and finds none, this is a high churn and refund risk.

2. **PSW pathway** — If a PSW learner subscribes expecting "personal care, safety priorities, dementia care" content and finds only generic patient-assessment lessons, this creates a trust violation.

3. **Paramedic pathway** — If a paramedic learner subscribes trusting "not adapted from nursing" and finds nursing fundamentals in their lesson feed, this contradicts the explicit trust pill claim.

### Medium Conversion Risk (Disappointed But Not Deceived)

4. **Flashcards** — Featured prominently but may be sparse or empty for some allied pathways. Learner discovers limited deck count.

5. **CAT exams** — Shown as a feature but may not activate for all allied pathways without sufficient question volume.

---

## Required Immediate Code Changes

### 1. RT Segment Bug (COMPLETED)
Both `allied-health-homepage.tsx` and `homepage-allied-health-section.tsx` corrected from `"respiratory-therapy-exam-prep"` to `"rrt-exam-prep"`.

### 2. Remove Simulation Feature Claims
Remove the "Clinical Simulations" feature card from `AlliedEcosystemSection` in `allied-health-homepage.tsx`, or replace with "Clinical Simulations (coming soon)."

### 3. Remove Clinical Skills Feature Claims
Remove the "Clinical Skills" feature card from `AlliedEcosystemSection`, or replace with honest scope.

### 4. Update FAQ Q3 and Q8
Change Q3 answer to: "Clinical simulation scenarios are being developed. Currently, profession-specific lessons, practice questions, flashcards, and adaptive study tools are available."
Change Q8 answer to remove "clinical simulations" and "clinical skills."

### 5. Update "Not Rebranded Nursing" Trust Pill
Change to: "Profession-specific content for RT, MLT, PT, OT, Social Work & more" (removes the absolute claim that fails for Paramedic and PSW).

### 6. Remove Platform Stats Row from Allied Hero
The stats pulled from `getHomepagePublicHomeStats()` are platform-wide nursing + allied combined. Remove the stats row from `AlliedHealthHero` until allied-specific counts can be calculated.

### 7. Soften Simulation References in Clinical Reasoning Section
The "Simulation Pathways" card in `AlliedClinicalReasoningSection` claims "Branching patient scenarios with telemetry, labs, and deterioration recognition." This must be changed to "Building towards: branching scenarios for allied learners as content expands."

---

## Required Content Development (Not Code)

| Priority | Action | Professions Affected |
|---|---|---|
| HIGH | Remove `"nursing-fundamentals"` from paramedic `topicSlugsIn` | Paramedic |
| HIGH | Create dedicated PSW lesson catalog (not nursing topic filter) | PSW/HCA |
| HIGH | Create any allied simulation scenario content | All |
| MEDIUM | Populate allied health flashcard decks | All |
| MEDIUM | Build sufficient allied question banks to meet CAT threshold (30+) | All |
| MEDIUM | Verify psychotherapy has meaningfully different content from social work | Psychotherapy |
| LOW | Verify paramedic's EMT catalog content depth | Paramedic |

---

*Audit generated from: `src/lib/allied/allied-professions-registry.ts`, `src/content/pathway-lessons/allied-professions/` (all files), `src/lib/marketing/allied-pathway-hub-overview.ts`, `src/lib/practice-tests/cat-readiness-floor.ts`, `src/lib/exam-pathways/pathway-marketing-practice-gates.ts`*
