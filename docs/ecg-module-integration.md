# ECG product architecture — Core vs Advanced

NurseNest ECG is **two product layers**, not one. Design, Figma, engineering, and entitlements must keep them distinct.

| Layer | Positioning | Audience |
|--------|---------------|-----------|
| **Core ECG / telemetry learning** | Integrated nursing telemetry education — pathways, hubs, exam readiness, bedside literacy | RN, PN/RPN (where product allows), NP, Allied (clinical fit), New Grad tracks |
| **Advanced ECG Program** (“Advanced ECG & Telemetry Mastery”) | **Separate future premium vertical** — specialty telemetry mastery, not bundled with nursing subscriptions | ICU, ER, telemetry, critical care, rapid response, advanced practice, experienced clinicians, monitor techs, specialty cardiac learners |

**Do not** treat these as the same offering in UX, pricing, catalogs, or gates.

---

## Core ECG / telemetry learning

### Purpose

- Foundational telemetry literacy  
- Rhythm recognition basics  
- Nursing-focused ECG interpretation  
- Exam readiness  
- Bedside telemetry understanding  
- Educational / coaching tone  

### Example content scope

Sinus rhythms; AFib/flutter; PVCs; VT/VFib basics; heart blocks; STEMI recognition **basics**; rate/rhythm interpretation; telemetry prioritization; nursing interventions.

### Where it belongs (when product + entitlements allow)

- Pathway lesson hubs (contextual tiles — **no global dump**)  
- Linked learning / related study  
- Practice exams and flashcards (core-appropriate items only)  
- Adaptive remediation and dashboard recommendations (**core** signals only)  
- PN/RPN/NP/Allied/New Grad surfaces **only** where clinically appropriate and **entitled**  

### Visual / UX direction

- Feels **native** to NurseNest lesson hubs and coaching flows  
- Premium, calm, clinically trustworthy — **integrated nursing telemetry education**  

### Implementation stance

- Integrate via existing hub loaders, linked learning, and shared shells  
- Use theme tokens (`semantic-*`, learner surfaces) — no duplicate render stacks  
- Linked-learning hub link today targets **core entry**: `/modules/ecg/basic/lessons` (`ecg-linked-learning.ts`)

---

## Advanced ECG Program (separate premium product)

### Hard product rules

The Advanced ECG Program **must not**:

- Be bundled into RN/PN/NP/allied nursing subscriptions as “included”  
- Unlock automatically with standard nursing plans  
- Clutter normal lesson hubs as core curriculum  
- Be assumed in tier metadata or copy as “part of NCLEX/RN prep”  

It **must**:

- Carry its **own entitlement** (future separate SKU / subscription) — placeholder constant: `ADVANCED_ECG_TELEMETRY_MASTERY_PAID` in `module-entitlement-placeholders.ts`  
- Have **separate** pricing, upgrade flow, marketing, dashboard/progress, and analytics  
- Gate **all** advanced surfaces server-side (no public leakage of premium advanced content)  

### Feature examples (program scope — not core hub dumps)

Advanced rhythm interpretation; 12-lead analysis; axis deviation; ischemia localization; advanced STEMI patterns; electrolyte progression; telemetry trends; ICU deterioration scenarios; hemodynamic integration; waveform pathology; advanced pharmacology interactions; pacing; ACLS-level interpretation; advanced case simulations.

### Visual / UX direction

Still **aligns with NurseNest** (DM Sans, theme architecture, leaf/wordmark) but feels:

- More immersive, technical, workstation-oriented  
- Higher intensity — **premium telemetry mastery platform**  
- **Midnight / dark-clinical workstation** as flagship mood; layered monitoring surfaces; advanced analytics  

Figma should ship **two distinct mockup sets**:

1. **Core ECG** — integrated pathway/hub/coaching surfaces  
2. **Advanced ECG Program** — specialty upgrade, locked previews, program dashboard, upgrade CTAs, isolated chrome acceptable  

---

## Current codebase vs product split (engineering note)

| Area | Today | Target alignment |
|------|--------|-------------------|
| `ECG_ROUTE_CONFIGS` | Routes under `/modules/ecg/basic/*` and `/modules/ecg/advanced/*` | **`basic`** aligns with **Core ECG**. **`advanced`** routes are technical grouping today — when the Advanced Program ships, they should be gated by **`ADVANCED_ECG_TELEMETRY_MASTERY_PAID`** (or successor), **not** assumed included in nursing plans. |
| `ECG_MASTERY_PAID` | Placeholder for module entitlement | Treat as **core** (or rename when Stripe/catalog splits). |
| `getCurrentEcgModuleAccess` | Single gate for `/modules/ecg/*` | **Future:** split checks — core nursing entitlement vs advanced program entitlement; avoid one flag implying both. |
| CAT / linear pools | Exclude `ecg_video` | Preserves exam integrity; core vs advanced still uses dedicated ECG pipelines. |

**Do not** expose Advanced Program content publicly until product ships gated surfaces. Placeholder upgrade/locked cards are acceptable; full catalogs must not mix advanced items into core lesson inventories.

---

## Paywall and entitlement requirements

### Core ECG

- Respect pathway/tier/premium rules product chooses (today: server gates in `ecg-module.server.ts`; PN/RPN policy may evolve).  
- Free users: previews/locked surfaces **when** product adds explicit preview routes (today many gated routes `notFound()` — do not weaken without intent).  

### Advanced ECG Program

- Future separate SKU/subscription  
- Isolated entitlement checks (e.g. `ADVANCED_ECG_TELEMETRY_MASTERY_PAID` + DB/Stripe when wired)  
- Upgrade prompts, locked preview cards, **separate** dashboard metrics  
- **Never** hardcode “ECG advanced included with nursing plan”  

---

## Architecture snapshot (implementation)

| Layer | Role |
|--------|------|
| **`src/lib/ecg-module/`** | Waveform templates, deterministic strips, question store, readiness gates, **linked-learning helpers** (`ecg-linked-learning.ts`). |
| **`src/components/ecg-module/`** | Module shell (`EcgModulePage`), client lists, admin publish controls. |
| **`src/components/study/ecg-live-strip.tsx`** | Theme-aware SVG strip using `ecg-waveform-generator`. |
| **`src/components/study/ecg-video-question-media.tsx`** | Practice / exam runners embed ECG video questions. |
| **`src/lib/ecg-module/ecg-module.server.ts`** | Gate for `/modules/ecg/*` (feature flag, publish, auth, tier, premium, RPN rules). **Split for core vs advanced when SKUs exist.** |

ECG video questions use `ecgVideoQuestion` + dedicated APIs; linear CAT/practice pools **exclude** `ecg_video` / `ecg-video` (`cat-pool.ts`, exam bank SQL).

---

## Homepage marketing (public)

The premium homepage (`PremiumHomepageEcg`) communicates:

- **Core ECG**: integrated adaptive telemetry learning — CTAs use **public** hubs (`HUB.examLessons`, `HUB.questionBank`), not gated `/modules/ecg` URLs (avoid 404 for anonymous visitors).
- **Advanced ECG & Telemetry Mastery**: teaser card with **Coming soon**, specialty framing, link to **pricing** only as “plans & upgrades”, and an explicit disclaimer that the program is **not included** in standard nursing subscriptions.

Figma / screenshots: mirror `premium-homepage-ecg.tsx` layout — Core column + Advanced aside; strongest Midnight/readability via shared hero strip CSS.

---

## Linked learning (lesson pages) — Core only

Automatic related content merges an optional **`hub`** candidate:

- **When**: pathway eligible for core discovery (`pathwayAllowsEcgLinkedLearning`) **and** lesson signals cardiac/ECG relevance (`lessonSignalsEcgLinkedLearning`).  
- **Href**: `/modules/ecg/basic/lessons` (Core entry).  
- **UI**: `RelatedContentBlock` → **Explore** (`kind: "hub"`).  

Advanced Program must **not** appear here until explicitly designed as an upgrade CTA with correct entitlement.

---

## Implementation roadmap

1. **Hub category grids** — Core ECG tiles only where taxonomy/clinical fit; no Advanced in core catalogs.  
2. **Dashboard / Study Next** — Core ECG recommendations vs **separate** Advanced Program strip (future).  
3. **Entitlement split** — Wire `ADVANCED_ECG_TELEMETRY_MASTERY_PAID` (or product-final key) to routes under advanced program surfaces; keep nursing plans from unlocking it by accident.  
4. **Preview routes** — Optional locked/demo surfaces for Advanced (marketing + server checks).  
5. **Figma** — Maintain **two** artifact families (Core integrated vs Advanced mastery platform).  

---

## Tests

- `src/lib/ecg-module/ecg-linked-learning.test.ts` — Core pathway + lesson heuristics.  
- `src/lib/ecg-module/ecg-module-contract.test.ts` — Routing, APIs, CAT exclusion, admin publish.  

---

## Files reference (linked-learning + types)

- `src/lib/ecg-module/ecg-linked-learning.ts` — Core entry deep-links only.  
- `src/lib/modules/module-entitlement-placeholders.ts` — `ECG_MASTERY_PAID`, `ADVANCED_ECG_TELEMETRY_MASTERY_PAID`.  
- `src/lib/linking/internal-link-types.ts` — `ResolvedLinks.hubs`.  
- `src/lib/linking/automatic-internal-links.ts` — merges Core hub candidate.  
- `src/lib/i18n/marketing-path.ts` — `/modules` not locale-prefixed incorrectly.  
