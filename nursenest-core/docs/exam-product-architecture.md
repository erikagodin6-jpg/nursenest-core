# Exam product architecture (NurseNest Core)

This document describes the **config-first exam pathway model** introduced for scalable country / role / exam separation.

## 1. Entity model

| Concept | Implementation (Phase 1) | Future |
|--------|---------------------------|--------|
| Country | `CountryCode` (Prisma) + URL slug `canada` \| `us` | Same |
| Role / license track | URL segment `rpn` \| `lpn` \| `rn` \| `np` \| `allied` | May add APRN subtracks |
| Exam family | Prisma `ExamFamily` on exams + registry | FK to pathway |
| Specific exam / cert | Registry `examCode` + stable `id` | Stripe + DB linkage |
| User selection | `User.learnerPath` → registry `id` | Profile UI + migration |

## 2. Registry / config

Single source: `src/lib/exam-pathways/exam-product-registry.ts`

Each row (`ExamPathwayDefinition`) includes: `id`, country, role track, `examCode`, `stripeTier`, `contentExamKeys[]`, SEO fields, `status` (`active` \| `upcoming` \| `legacy` \| `beta` \| `hidden`), `acquisitionMode`.

Adding a pathway = add a row + deploy (no route rewrite).

## 3. Routes

| Pattern | Purpose |
|---------|---------|
| `/{countrySlug}/{roleTrack}/{examCode}` | Overview hub |
| `.../pricing` | Pathway-specific pricing / waitlist copy |
| `.../questions` | SEO landing → app bank |

Legacy programmatic URLs (`/{slug}`) can **redirect** to hubs via `programmatic-slug-redirects.ts` + `next.config.ts` when a single canonical hub exists; the map may be empty when slugs serve multi-country or multi-pathway audiences at `/{slug}` instead.

## 4. Entitlements

- **Billing (today):** Stripe checkout still uses **`country` + `TierCode`** (`resolve-entitlement`, checkout API).
- **Content:** Optional `pathwayId` on `GET /api/questions` applies `questionAccessWhereWithPathway` (tier/country + `exam_questions.exam` ∈ `contentExamKeys`).
- **NP specialties:** Share `TierCode.NP` until per-pathway Stripe prices exist; **never** share product copy—use `User.learnerPath = pathway.id` to pick FNP vs PMHNP vs AGPCNP content.

## 5. Interim content mapping

`contentExamKeys` maps to the string column `exam_questions.exam` until granular tags or FKs exist.

## 6. SEO

- Hub URLs included in `collectCoreUrls` / sitemap via `collectExamPathwayUrls`.
- Programmatic SEO pages (`/{slug}` → `/seo/[slug]`) remain; selective redirects reduce duplicate REx-PN entry points.

## 7. Phased implementation

- **Phase 1 (done in repo):** Registry + routes + sitemap + API pathway filter + redirects + docs.
- **Phase 2:** Checkout metadata + DB columns for `examPathwayId`; progress tables keyed by pathway.
- **Phase 3:** Retire overlapping thin programmatic pages where hubs supersede.

## Repository

All changes belong in **`nursenest-core`** on **`main`** (see deploy spec).
