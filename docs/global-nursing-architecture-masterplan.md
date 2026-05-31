# Global Nursing Architecture Masterplan

Date: 2026-05-31

Role lens: Principal Information Architect, International SEO Strategist, Nursing Education Director, Platform Scalability Consultant.

## Executive Answer

If NurseNest eventually serves nursing learners in 25+ countries, the scalable architecture is:

1. Keep one global learning platform and one canonical pathway registry.
2. Use country hubs as SEO and navigation entry points, not separate products.
3. Use exam pathways as the product units: country + profession + exam.
4. Use inherited global clinical content with country and exam overlays.
5. Gate every international market through launch readiness, pricing readiness, translation readiness, and content inventory checks.
6. Avoid duplicating content by country unless the regulator, scope of practice, terminology, medications, documentation, or exam format requires it.

Recommended canonical URL model:

```text
/{country}/
/{country}/{profession}/{exam}/
/{country}/{profession}/{exam}/{activity}/
```

Examples:

```text
/canada/rn/nclex-rn/
/canada/rpn/rex-pn/
/canada/np/cnple/
/us/rn/nclex-rn/
/us/lpn/nclex-pn/
/uk/rn/nmc-test-of-competence/
/australia/rn/ahpra-nmba/
/philippines/rn/pnle/
/india/rn/state-nursing-council-registration/
/saudi-arabia/rn/scfhs/
/nigeria/rn/nmcn/
```

Keep `/exams/{country}` as a discovery hub only. It should summarize the market and link into canonical country/profession/exam pathways. It should not become the paid product URL.

## Evidence From Current Codebase

The current platform already has many of the right primitives:

| Area | Evidence | Current State |
|---|---|---|
| Global market registry | `src/lib/exam-pathways/global-expansion-market-registry.ts` | Canada and US are `core`; UK and Australia are `next_wave`; Philippines, India, Nigeria, Saudi Arabia are future/research style markets with planned RN pathways. |
| Global exam registry | `src/lib/exam-pathways/global-exam-registry.ts` | UK, Australia, Philippines, India, Saudi Arabia are registered as admin-only hidden RN entries. Nigeria is planned in market registry and route surfaces, but not fully represented in the shown global exam registry excerpt. |
| Pathway definitions | `src/lib/exam-pathways/exam-pathways-data-segment-e.ts` | International RN pathways exist as hidden, waitlist, generic exam-family shells with empty `contentExamKeys`. |
| Launch gates | `src/lib/navigation/country-exam-launch-readiness.ts` | International RN foundation pathway IDs are explicitly treated as not public. `GLOBAL_REGION_EXPANSION_PUBLISHED` is empty. |
| Inventory snapshot | `src/config/pathway-readiness-snapshot.json` | UK, Australia, Philippines, India, Nigeria, Saudi Arabia each show `0` lessons and `0` questions. |
| Market readiness | `src/lib/navigation/market-readiness-data.ts` | Philippines and India are `partial`; UK, Australia, Nigeria, Saudi Arabia are marketing-only; none have full conversion funnel readiness. |
| Country/locale config | `src/lib/i18n/global-regions.ts` | Supports Philippines, India, Nigeria, Saudi Arabia, UK, Australia, Canada, US and many future regions. |
| Currency display | `src/lib/pricing/regional-pricing-map.ts` | Local currency display prices exist for target markets, but comments state this is read-only and does not replace billing. |
| Stripe billing | `src/lib/stripe/pricing-map.ts` | Stripe checkout is still CA/US oriented. International Stripe Price IDs are not the actual billing source of truth. |
| Checkout region gate | `src/lib/region/checkout-global-region-context.ts` | Region context is signed and can gate checkout where pricing is not available. |
| SEO/hreflang | `src/lib/seo/marketing-alternates.ts` and `src/lib/seo/locale-indexability-gate.ts` | Hreflang and locale indexability are guarded to avoid broken localized alternates and incomplete translation indexation. |
| Expansion hubs | `src/lib/marketing/global-region-exam-hubs.ts` | `/exams/uk`, `/exams/australia`, `/exams/india`, `/exams/nigeria`, `/exams/philippines`, and `/exams/middle-east` exist. Saudi Arabia maps to the Middle East hub. |
| Default exam pages | `src/app/(marketing)/(default)/exams/*` | Country discovery pages exist for UK, Australia, India, Nigeria, Philippines, and Middle East. |
| Localized exam pages | `src/app/(marketing)/[locale]/exams/*` | Localized shells exist for Australia, India, Nigeria, and Middle East, but not for UK or Philippines in the same route set. |

This is a strong foundation, but it is not yet a scalable 25-country architecture because too much is still hand-coded per route, paid products are not yet country-ready, and content inheritance is not explicit enough.

## Phase 1: Global Architecture Audit

### Routes

Current route patterns:

| Pattern | Example | Role | Issue |
|---|---|---|---|
| Country hubs | `/canada`, `/us`, `/philippines`, `/middle-east` | Broad marketing entry | Only some countries have top-level country entry routes. |
| Exam discovery hubs | `/exams/uk`, `/exams/australia`, `/exams/india` | SEO discovery | Good for TOFU, but should not become the paid product canonical. |
| Product pathways | `/canada/rn/nclex-rn`, `/canada/rpn/rex-pn` | Mature product route | This is the scalable model. |
| Hidden pathway registry paths | `/uk/rn`, `/au/rn`, `/ph/rn`, `/in/rn`, `/ng/rn`, `/sa/rn` | Admin/draft planned path | Current registry public paths are shorter than the recommended SEO path. |
| Localized marketing | `/{locale}/...` | Translation surface | Good, but not every expansion hub has a localized shell. |

Scalability risks:

1. `aus` vs `australia` is a naming mismatch between global region slug and pathway country slug.
2. `/exams/{country}` and `/{country}/rn/...` can compete if both are indexable for the same intent.
3. International route pages are hand-authored instead of registry-generated.
4. Saudi Arabia is represented in region config and pathway registry but public discovery is consolidated under `/exams/middle-east`, which weakens Saudi-specific SEO.
5. UK and Philippines do not have the same localized `/[locale]/exams/...` shells as some other regions.

### Pathways

Current mature pathway model:

| Market | Product pathways |
|---|---|
| Canada | RN NCLEX-RN, RPN REx-PN, NP CNPLE, Allied Core, Pre-Nursing CA |
| United States | RN NCLEX-RN, LPN NCLEX-PN, NP tracks, Allied Core, Pre-Nursing |

Current international pathway shells:

| Market | Pathway ID | Current status | Inventory |
|---|---|---:|---:|
| UK | `uk-rn-nmc-test-of-competence` | hidden, waitlist | 0 lessons / 0 questions |
| Australia | `au-rn-iqnm-pathway` | hidden, waitlist | 0 lessons / 0 questions |
| Philippines | `ph-rn-prc-pnle` | hidden, waitlist | 0 lessons / 0 questions |
| India | `in-rn-state-nursing-council-registration` | hidden, waitlist | 0 lessons / 0 questions |
| Nigeria | `ng-rn-nmcn-licensure` | hidden, waitlist | 0 lessons / 0 questions |
| Saudi Arabia | `sa-rn-scfhs-licensure` | hidden, waitlist | 0 lessons / 0 questions |

This means international pages can support discovery and waitlists today, but not paid exam-prep claims.

### SEO Structure

Current strengths:

- `marketingAlternatesSharedPage` prevents broken hreflang alternates.
- `robotsForRegionalMarketingHub` noindexes unpublished expansion hubs.
- Country discovery pages include metadata and FAQ schema.
- `locale-indexability-gate` blocks incomplete translated pages from indexation.

Current risks:

- Some country pages are content-rich but noindex because launch gates are not cleared.
- `/exams/{country}` pages can become the wrong canonical if product URLs are not defined early.
- Global content pages may be reused in multiple country contexts without clear canonical/inheritance rules.

### Localization

Current config supports:

| Region | Default locale | Allowed locales |
|---|---|---|
| Philippines | `tl` | `tl`, `en` |
| India | `en` | `en`, `hi` |
| Nigeria | `en` | `en` |
| Saudi Arabia | `en` | `en` |
| UK | `en` | `en` |
| Australia | `en` | `en` |
| Canada | `en` | `en`, `fr` |
| US | `en` | `en`, `es` |

The architecture can handle language expansion, but actual launch should require:

- content translation readiness score,
- clinical terminology review,
- English leakage audit,
- localized metadata,
- localized schema,
- local reviewer sign-off where healthcare claims are localized.

### Country Handling

Country handling is split across:

- `CountrySlug` in pathway types,
- `GlobalRegionSlug` in region config,
- `CountryCode` from Prisma,
- marketing region toggles currently limited to `US | CA`,
- global region cookies and checkout context cookies.

Scalability risk: the platform has at least four country abstractions. For 25+ markets, keep them, but define strict ownership:

| Concept | Owner | Purpose |
|---|---|---|
| `CountrySlug` | exam pathway registry | URL and product pathway identity |
| `GlobalRegionSlug` | marketing/i18n/pricing | region selection, locale, currency display |
| Prisma `CountryCode` | database/account | learner account and entitlement country |
| `MarketingRegionToggle` | legacy US/CA marketing | should not be extended to all countries; replace with registry-driven region selection |

### Currency and Subscription Handling

Current state:

- Regional display pricing exists for many markets.
- Stripe checkout price lookup is CA/US oriented.
- Checkout context can block unsupported regions.
- `market-readiness-data.ts` marks international pricing as not configured.

Scalability risk:

If every region, tier, profession, and duration becomes an env var, 25 countries can create hundreds of Stripe Price IDs and a brittle deployment matrix.

Recommendation:

- Keep display pricing in the registry.
- Add a database-backed `billingPriceCatalog` or Stripe product lookup table before 10+ paid markets.
- Use a region support gate: `display_only`, `waitlist`, `checkout_enabled`, `tax_ready`, `full_support`.

## Phase 2: Country Structure Design

### Option A: Full country-name slugs

```text
/canada/
/united-states/
/united-kingdom/
/philippines/
```

Pros:

- Clear to users.
- Strong SEO readability.
- Good for less-abbreviated countries.

Cons:

- Conflicts with current `/us` and `/uk` patterns.
- Longer URLs for common country abbreviations that users search directly.
- Requires redirects from current routes.

### Option B: ISO-style abbreviations

```text
/ca/
/us/
/uk/
/ph/
/in/
/ng/
```

Pros:

- Short.
- Programmatically simple.

Cons:

- Weak SEO readability for Philippines, India, Nigeria, Saudi Arabia.
- Ambiguous for users.
- Less aligned with current `/canada` route.

### Option C: Global hub plus country hubs

```text
/nursing-exams/
/canada/
/us/
/uk/
/australia/
/philippines/
/india/
/saudi-arabia/
/nigeria/
```

Product routes:

```text
/{country}/{profession}/{exam}/
```

Pros:

- Supports broad discovery and country-specific SEO.
- Preserves current mature `/canada` and `/us` routes.
- Lets `/exams/{country}` remain a discovery surface.
- Works for 25+ countries without a rewrite.

Cons:

- Requires strict canonical rules to prevent `/exams/{country}` from competing with `/{country}/{profession}/{exam}`.

Recommendation: Option C.

Specific slug policy:

| Country | Canonical country slug |
|---|---|
| Canada | `/canada` |
| United States | `/us` |
| United Kingdom | `/uk` |
| Australia | `/australia` |
| Philippines | `/philippines` |
| India | `/india` |
| Saudi Arabia | `/saudi-arabia` |
| Nigeria | `/nigeria` |
| Ireland | `/ireland` |
| New Zealand | `/new-zealand` |
| Singapore | `/singapore` |
| South Africa | `/south-africa` |
| UAE | `/uae` |

Keep `/us` and `/uk` because they are widely recognized and already exist in the pathway model. Do not switch to `/united-states` or `/united-kingdom` unless there is a hard SEO migration reason.

## Phase 3: Exam Architecture

### Canonical Exam URL Pattern

```text
/{country}/{profession}/{exam}/
/{country}/{profession}/{exam}/lessons/
/{country}/{profession}/{exam}/questions/
/{country}/{profession}/{exam}/flashcards/
/{country}/{profession}/{exam}/practice-exams/
/{country}/{profession}/{exam}/study-plan/
/{country}/{profession}/{exam}/readiness/
```

### Exam Registry Model

Each exam pathway should store:

| Field | Purpose |
|---|---|
| `pathwayId` | Stable product key |
| `countrySlug` | Canonical country path |
| `countryCode` | Account/billing/reporting |
| `profession` | RN, PN, NP, allied |
| `examCode` | URL segment |
| `regulator` | Display and EEAT |
| `contentInheritanceProfile` | Global core, localized, or rebuilt |
| `examBlueprintVersion` | Content governance |
| `launchStatus` | hidden, waitlist, review, public |
| `seoStatus` | noindex, indexable discovery, indexable product |
| `billingStatus` | waitlist, display price, checkout ready |

### Country Exam Map

| Country | Exams / pathways | Architecture note |
|---|---|---|
| Canada | NCLEX-RN, REx-PN, CNPLE | Already mature. Keep as reference implementation. |
| United States | NCLEX-RN, NCLEX-PN, FNP, AGPCNP, PMHNP, WHNP, PNP-PC | Already mature. Keep as reference implementation. |
| Philippines | PNLE | Must not reuse NCLEX as PNLE. Use global clinical lessons plus PNLE exam overlay. |
| UK | NMC CBT, NMC OSCE | CBT can reuse knowledge content with UK terminology; OSCE requires rebuilt station/skill workflows. |
| Australia | AHPRA/NMBA IQNM pathway | Reuse clinical content; build Australian registration/orientation and NMBA/AHPRA pathway content separately. |
| India | State nursing council registration, INC-aligned education, entrance/government exams if later chosen | Do not frame as a single national NCLEX equivalent. |
| Saudi Arabia | SCFHS RN licensure | Requires Saudi-specific licensing, Prometric-style framing, DataFlow/eligibility orientation, Arabic future layer. |
| Nigeria | NMCN licensure | Requires NMCN-specific pathway and local exam content; current product inventory is zero. |

### Duplication Avoidance

Use this hierarchy:

```text
Global Clinical Concept
  -> Country Clinical/Terminology Overlay
    -> Regulator/Exam Blueprint Overlay
      -> Activity Type
```

Example:

```text
Heart Failure
  -> UK nursing terminology and documentation overlay
    -> NMC CBT knowledge objective
      -> CBT question

Heart Failure
  -> UK OSCE overlay
    -> assessment/communication station
      -> OSCE checklist simulation
```

## Phase 4: Content Reuse Framework

### Reuse Classification

| Content type | Global reuse | Localization required | Country-specific only |
|---|---|---|---|
| Lessons | High for pathophysiology, safety, ECG, labs | Terminology, spelling, scope, documentation, medication names | Regulator/exam process lessons |
| Flashcards | High for definitions and clinical facts | Drug names, units, local terms | Exam policy and local legal terms |
| Practice exams | Low to medium | Must match local blueprint and format | Most paid exam simulations |
| CAT exams | NCLEX-specific only unless local exam is adaptive | Not enough to localize wording | Country-specific CAT only when exam format supports it |
| Simulations | Medium to high | Scope, escalation, documentation, equipment | OSCE stations, local emergency pathways |
| Clinical skills | Medium | Scope, documentation, equipment names, local policy | OSCE/skills checklists, regulator station rules |
| Pharmacology | Medium | Brand/generic names, availability, formularies, controlled drug language | Local prescribing/scope modules |
| ECG | High | Mostly terminology and local escalation pathways | Exam-specific ECG station format |
| Labs | High | Units, reference ranges, reporting conventions | Country-specific lab reporting and exam blueprints |

### Global Content Inheritance Model

Create these content layers:

1. `global_core`: physiology, clinical reasoning, safety, common conditions.
2. `country_overlay`: spelling, terminology, scope, units, local documentation, regulatory notes.
3. `exam_overlay`: blueprint, format, scoring, timing, official exam behaviors.
4. `activity_overlay`: MCQ, CAT, OSCE, simulation, flashcard, care plan, clinical skill.

Required content metadata:

```ts
type ContentInheritance = {
  canonicalTopicId: string;
  globalCoreId?: string;
  countryOverlayIds: string[];
  examOverlayIds: string[];
  localizationStatus: "none" | "terminology" | "clinical_reviewed" | "fully_localized";
  regulatorReviewStatus: "not_required" | "needed" | "reviewed";
};
```

Do not fork entire lessons for every country unless the educational objective changes.

## Phase 5: International SEO Framework

### Canonical Strategy

Rules:

1. `/{country}/` is the canonical country hub.
2. `/exams/{country}` is a discovery page that links to `/{country}/{profession}/{exam}`.
3. `/{country}/{profession}/{exam}` is the canonical product hub.
4. Activity pages canonicalize to their exact exam pathway.
5. Translated pages canonicalize to themselves only when translation readiness passes.
6. Unlaunched countries remain noindex even if route exists.

### Hreflang Strategy

Use hreflang only when:

- the route exists,
- the locale is allowed for the region,
- translation readiness passes,
- metadata and JSON-LD are localized,
- no English leakage exists in the body.

Do not emit hreflang for default-only expansion hubs. Current `marketing-alternates.ts` already follows this principle.

### Country Targeting

Use country-specific pages for:

- registration process,
- exam preparation,
- salary/career content,
- regulatory body pages,
- school/program directories,
- clinical placement expectations.

Use global pages for:

- clinical concepts,
- ECG,
- labs,
- pharmacology foundations,
- care plans,
- general nursing study methods.

### Duplicate Content Prevention

Every country page needs at least one of:

- unique regulator/exam process,
- unique terminology/scope,
- unique pricing/commercial funnel,
- unique local profession context,
- unique search intent.

If not, use a global page with country-specific internal links instead of a new indexable page.

### Breadcrumb Standard

Examples:

```text
Home > Countries > United Kingdom > RN > NMC Test of Competence
Home > Countries > Philippines > RN > PNLE
Home > Countries > Saudi Arabia > RN > SCFHS
Home > Clinical Topics > Cardiovascular > Heart Failure
```

### Schema Standard

Use:

- `WebPage` for hubs,
- `Course` for paid pathway/product surfaces,
- `FAQPage` for exam process pages,
- `BreadcrumbList` everywhere,
- `Organization`,
- `EducationalOrganization` where applicable,
- `DefinedTerm` for glossary terms,
- `MedicalWebPage` only where content is clinical and reviewed.

## Phase 6: Monetization Framework

### Current Reality

Regional pricing display exists, but checkout is not internationally enabled. `regional-pricing-map.ts` states it is read-only display/configuration and does not replace the CAD/US billing pipeline. `stripe/pricing-map.ts` resolves CA/US Stripe price entries.

### Required Global Pricing Model

Add a registry-backed pricing lifecycle:

| Status | Meaning |
|---|---|
| `not_listed` | Country not visible in pricing |
| `waitlist` | Pricing hidden or soft estimate only |
| `display_only` | Local price shown, checkout disabled |
| `checkout_ready` | Stripe price IDs configured |
| `tax_ready` | Tax/VAT/GST handling reviewed |
| `full_support` | checkout, renewals, refunds, support, receipts, and alerts verified |

### Pricing Architecture

Recommended data shape:

```ts
type RegionalBillingPlan = {
  region: GlobalRegionSlug;
  pathwayId: string;
  currency: string;
  amount: number;
  duration: "monthly" | "3-month" | "6-month" | "yearly";
  stripePriceId: string | null;
  taxMode: "stripe_tax" | "manual_review" | "not_supported";
  checkoutStatus: "waitlist" | "display_only" | "checkout_ready" | "full_support";
};
```

Before 10 countries, env vars are tolerable. Before 25 countries, move price configuration into a database or managed catalog.

### Trial Strategy

| Market type | Trial strategy |
|---|---|
| Mature high-price markets | 7-day trial or mini-pack lead magnet |
| Lower purchasing-power markets | low-friction starter pack plus lower monthly price |
| Migration markets | waitlist + free pathway checklist + NCLEX bridge offer |
| Regulator-specific markets | free orientation hub, paid exam bank only after blueprint review |

## Phase 7: Global Navigation

### Navigation Principles

1. Users choose country first only when country changes exam eligibility or pricing.
2. Users choose profession second.
3. Users choose exam/pathway third.
4. The learner dashboard should remember pathway, not just country.
5. Marketing navigation should avoid showing unlaunched markets as equivalent to launched products.

### Header Specification

Global header:

- Country selector: grouped by `Full support`, `Coming next`, `Explore guides`.
- Profession selector: RN, PN/LPN/RPN, NP, Allied, Pre-Nursing.
- Exam selector appears after country/profession is known.
- Pricing is shown only if `canShowPricing(region)` is true.
- Unlaunched markets use `Join waitlist` or `Read guide`, not `Start studying`.

### Country Selector States

| State | UI behavior |
|---|---|
| Full support | Show product CTAs and pricing |
| Partial support | Show guide, free resources, waitlist |
| Marketing only | Show content hub and email capture |
| Planned | Hide from public nav or show under "Future regions" only |

### Learner Dashboard

The dashboard should be pathway-first:

```text
Current pathway: United States > RN > NCLEX-RN
Switch pathway
Recommended modules
Readiness
Country-specific notes
```

Do not use generic country-only dashboards for exam prep.

## Phase 8: Expansion Simulation

### 10-Country Scenario

Likely markets: Canada, US, UK, Australia, Philippines, India, Saudi Arabia, Nigeria, Ireland, New Zealand.

Bottlenecks:

- manageable route count,
- manual `/exams/{country}` pages still tolerable,
- pricing env vars still barely tolerable,
- reviewer governance becomes important.

Required before reaching 10:

- registry-generated country hub templates,
- billing status registry,
- content inheritance metadata,
- country/exam launch dashboard.

### 25-Country Scenario

Bottlenecks:

- hand-coded route pages do not scale,
- hreflang matrix becomes fragile,
- Stripe price env vars become operationally risky,
- content QA by country becomes difficult,
- duplicate country pages can cause SEO bloat.

Required before reaching 25:

- dynamic country hub renderer,
- dynamic exam pathway renderer,
- database-backed billing catalog,
- content inheritance engine,
- automated noindex rules from launch status,
- localized metadata QA,
- country-specific reviewer queue.

### 50-Country Scenario

Bottlenecks:

- translation management,
- local regulatory updates,
- support burden,
- payment/tax complexity,
- content freshness and exam blueprint changes,
- entity graph governance.

Required before reaching 50:

- regulator update tracker,
- jurisdiction-specific content owners,
- localization vendor workflow,
- country revenue attribution,
- canonical entity graph,
- automated internal linking by country/exam/profession,
- content deprecation/merge/redirect automation.

## Scalability Risks And Fixes

| Risk | Evidence | Fix |
|---|---|---|
| Multiple country abstractions drift | `CountrySlug`, `GlobalRegionSlug`, Prisma `CountryCode`, `MarketingRegionToggle` | Create a country identity map and require all route/build helpers to derive from it. |
| `aus` vs `australia` naming | Region slug is `aus`, country slug is `australia` | Add explicit alias map and prefer canonical URL slug `australia`. |
| International product paths too short | Registry public paths like `/uk/rn`, `/ph/rn` | Use canonical exam paths like `/uk/rn/nmc-test-of-competence`. |
| Paid product claims before inventory | Snapshot shows 0 lessons/questions for international pathways | Keep waitlist/noindex until content and regulator review pass. |
| Pricing display without checkout | Regional pricing map is read-only; Stripe map is CA/US | Add billing status lifecycle and DB-backed price catalog. |
| Localized routes inconsistent | `[locale]/exams` exists for some regions but not UK/Philippines | Generate localized shells from registry only when translation-ready. |
| Hand-authored country pages | Many `/exams/*/page.tsx` files | Move to registry-driven page template with country-specific content blocks. |
| NCLEX over-reuse risk | International pathways have generic exam family and empty content keys | Add country/exam overlays and block use of NCLEX CAT unless explicitly mapped. |

## Phase 9: Five-Year Roadmap

### Year 1: Stabilize Architecture And Launch One Or Two Markets

Priorities:

1. Freeze canonical URL model.
2. Create country identity map.
3. Convert international hidden pathways to full canonical exam paths.
4. Keep all international product routes noindex until launch gates pass.
5. Launch one low-rebuild market: UK or Australia for English SEO, or Philippines for migration funnel.
6. Add billing lifecycle statuses.
7. Build global content inheritance metadata.
8. Add international pathway readiness dashboard.

Best first architecture launch:

1. UK: high SEO value, English-first, clear NMC CBT/OSCE split, but requires rebuilt OSCE assets.
2. Australia: English-first and high pricing potential, but AHPRA/NMBA pathway content must be precise.
3. Philippines: strong migration market and existing content inventory, but local price/support sensitivity is higher.

### Year 3: Registry-Driven International Platform

Priorities:

1. Replace hand-coded country pages with dynamic registry-driven pages.
2. Add database-backed regional billing catalog.
3. Add regulator/exam blueprint versioning.
4. Add content inheritance and overlay editor.
5. Add country-specific SEO dashboards.
6. Add translation readiness workflows for Tagalog, Hindi, Arabic, French, Spanish.
7. Launch 5-10 markets only when country-specific content and conversion are ready.

### Year 5: 25+ Country Healthcare Learning Network

Priorities:

1. Fully registry-driven country/profession/exam routing.
2. Multi-country entity graph.
3. Localized content governance by region.
4. Country-specific pricing/tax/checkout support.
5. International school/employer/career content layers.
6. Automated content freshness by regulator and exam blueprint.
7. Global revenue attribution by country, profession, exam, and content cluster.

## Implementation Priorities

### Next 30 Days

1. Create `global-country-identity-map.ts` to unify country slug, region slug, ISO code, display name, default locale, allowed locales, currency, and route base.
2. Decide canonical product paths for UK, Australia, Philippines, India, Saudi Arabia, Nigeria.
3. Add redirect/alias policy for short draft paths such as `/ph/rn`.
4. Add a contract test that every global exam registry entry has a canonical country/profession/exam path.
5. Add launch-dashboard rows for each international pathway: content count, pricing status, SEO status, localization status.
6. Keep all unfinished markets noindex and waitlist-only.

### Next 90 Days

1. Convert `/exams/{country}` pages to registry-driven templates.
2. Add content inheritance metadata for lessons, questions, flashcards, simulations, skills, labs, ECG, and pharmacology.
3. Define country overlay fields: terminology, spelling, medication naming, units, documentation, scope, regulator notes.
4. Add international billing catalog model or JSON registry with checkout status.
5. Build first country-specific exam blueprint overlay for one market.
6. Add SEO cannibalization checks: `/exams/{country}` must not target the same primary keyword as `/{country}/rn/{exam}`.

### Next 12 Months

1. Launch 1-2 international paid pathways.
2. Add localized lead magnets by market.
3. Add country-specific clinical reviewer workflow.
4. Add country-specific content freshness schedules.
5. Add revenue attribution by country/exam.
6. Build the global nursing exam command center.

## Final Recommendation

Do not build separate country mini-apps.

Build a registry-driven global pathway system:

```text
Country -> Profession -> Exam -> Activity -> Content inheritance layer
```

Keep the existing US/Canada product routes as the reference model. Use `/exams/{country}` for discovery, not product delivery. Use `/{country}/{profession}/{exam}` for canonical paid pathways. Use global clinical content with country and exam overlays. Do not reuse NCLEX CAT, NCLEX question formats, or North American scope assumptions for countries where the exam, regulator, or practice model differs.

This lets NurseNest expand to 25+ countries without a rewrite because the platform adds countries as registry rows, overlays, launch gates, and content mappings rather than new mini-platforms.
