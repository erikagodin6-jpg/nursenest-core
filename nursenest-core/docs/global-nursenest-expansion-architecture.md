# Global NurseNest Expansion Architecture

Date: 2026-05-30

## Objective

NurseNest should grow from a Canada/U.S. platform into a global healthcare education ecosystem without creating disconnected country forks. The architecture should let new countries, professions, and exam pathways be added through configuration, content metadata, and market launch governance.

## Core Model

Every learner belongs to:

1. Country
2. Profession
3. Exam Pathway

Examples:

| Country | Profession | Exam Pathway |
| --- | --- | --- |
| Canada | RN | NCLEX-RN |
| Canada | RPN | REx-PN |
| United States | RN | NCLEX-RN |
| United States | LPN/LVN | NCLEX-PN |
| United States | NP | FNP, AGPCNP, PMHNP, WHNP, PNP-PC |
| United Kingdom | RN | NMC CBT / OSCE |
| Australia | RN | NMBA / AHPRA pathway |
| New Zealand | RN | NCNZ |
| Ireland | RN | NMBI registration |

The account-level scoping fields remain:

- `User.country`
- `User.tier`
- `User.learnerPath`
- `User.targetExamPathwayId`
- `User.examFocus`

No schema migration is required for the current architecture pass. Future countries not yet present in `CountryCode` are represented in `global-expansion-market-registry.ts` until they are ready for full user-account storage.

## Configuration Sources

| Layer | File | Purpose |
| --- | --- | --- |
| Exam pathway catalog | `src/lib/exam-pathways/exam-pathways-catalog.ts` | Active/upcoming pathway definitions used by hubs, SEO, entitlements, and loaders |
| Global market registry | `src/lib/exam-pathways/global-expansion-market-registry.ts` | Launch tiers, selector countries, language plan, supported/planned pathways, dashboard segments |
| Account preference helper | `src/lib/exam-pathways/account-exam-preference.ts` | Resolves signup/profile selections into primary pathway IDs and country-scoped display labels |
| Content audit | `docs/multi-country-content-audit.md` | Current content scoping readiness and gap map |

## Country Launch Priorities

| Tier | Markets | Strategy |
| --- | --- | --- |
| Tier 1 | Canada, United States | Core revenue markets; full product depth, paid subscriptions, active content investment |
| Tier 2 | United Kingdom, Australia, New Zealand, Ireland | English-speaking expansion wave; high-value healthcare education markets |
| Tier 3 | Philippines, India, Nigeria, South Africa | Healthcare migration markets; large learner populations and international mobility |
| Tier 4 | Saudi Arabia, UAE, Qatar, Kuwait, Singapore | Middle East and Asia-Pacific expansion; strong healthcare investment and licensure demand |

## Content Reuse Strategy

Every content item should be tagged by reuse intent:

| Scope | Description | Examples |
| --- | --- | --- |
| Global | Clinically true across markets | Heart failure pathophysiology, sepsis recognition, airway basics |
| Country Specific | Depends on local healthcare system, terminology, law, scope, or workflow | Medicare, NHS structure, Canadian healthcare system, delegation rules |
| Exam Specific | Depends on a particular exam blueprint or item style | NCLEX NGN, REx-PN terminology, NMC CBT domains, CNPLE competencies |

Default rule:

- Start with global clinical foundations.
- Add country-specific overlays only where policy, scope, legal language, or health-system context differs.
- Add exam-specific overlays only where blueprint, item type, scoring, or terminology differs.

This prevents content inflation while preserving local accuracy.

## Multi-Language Strategy

English remains the source language.

Localization should be layered, not forked:

| Language | Priority Use |
| --- | --- |
| French | Canada |
| Spanish | United States and future international support |
| Portuguese | Future global expansion |
| Hindi | India |
| Tagalog | Philippines |
| Arabic | Saudi Arabia, UAE, Qatar, Kuwait |
| German | Future international expansion |
| Japanese | Future international expansion |
| Korean | Future international expansion |
| Mandarin | Singapore and future international expansion |

Localization requirements:

- Preserve the source content ID.
- Store locale overlays separately.
- Keep clinical review status per locale.
- Do not localize unreviewed clinical claims automatically into production learning surfaces.

## Global Homepage Direction

Future homepage and pathway discovery should expose three simple choices:

1. Choose Your Country
2. Choose Your Profession
3. Choose Your Exam

The country selector should use the global market registry, not hardcoded country pairs. Visitors can browse all markets. Signed-in learners default to their selected pathway.

## International SEO

Preferred URL shape:

| Market | Example |
| --- | --- |
| Canada RN | `/canada/rn/nclex-rn` |
| United States RN | `/us/rn/nclex-rn` |
| United Kingdom RN | `/uk/rn/nmc-cbt` |
| Australia RN | `/au/rn` |
| New Zealand RN | `/nz/rn` |
| Ireland RN | `/ie/rn` |

SEO requirements:

- Country-specific metadata.
- Country-specific schema.
- Country-aware sitemaps.
- `hreflang` for localized equivalents.
- `x-default` for global discovery pages.
- No indexable claims for exams or regulators without official-source review.

## Global Business Dashboard

Analytics should track:

- Users by country.
- Revenue by country.
- Trial conversion by country.
- Retention by country.
- Subscription tier by country.
- Exam pathway growth.
- Content gap count by country/pathway.
- Waitlist demand by future market.
- Localized content coverage.
- Clinical review backlog by region.

The `dashboardSegmentKey` in the global registry provides stable grouping keys such as `country.ca`, `country.us`, `country.gb`, and `country.ae`.

## Implementation Rules

1. Add countries to `global-expansion-market-registry.ts` first.
2. Add a full `EXAM_PATHWAYS` entry only when the product has a real pathway shell, URL, SEO copy, and launch status.
3. Add Prisma `CountryCode` support only when users can store that country as an account preference.
4. Keep shared clinical content global unless country or exam differences are real.
5. Do not create country-specific module shells.
6. Use the same learner navigation, entitlement model, progress analytics, and adaptive study loops across markets.
7. Localize content through overlays, not duplicated libraries.
8. Gate market launch with clinical review, SEO review, and legal/regulatory copy review.

## Current Readiness

Ready now:

- Canada and U.S. account-level pathway scoping.
- Canada and U.S. country-specific pathway labels.
- Upcoming pathway shells for UK, Australia, Philippines, India, Nigeria, and Saudi Arabia.
- Global market registry with launch tiers and selector options.
- Content scope vocabulary for global, country-specific, and exam-specific reuse.

Needs future implementation:

- Prisma `CountryCode` expansion for New Zealand, Ireland, UAE, Qatar, Kuwait, South Africa, and Singapore.
- Public country selector UI using the global registry.
- Global business dashboard surfaces.
- Localized content overlay storage and review workflow.
- Full international sitemap and hreflang expansion.
- Country-specific clinical/legal review for each new market.
