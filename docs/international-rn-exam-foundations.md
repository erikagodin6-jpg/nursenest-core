# International RN exam foundations — source of truth (audit)

This note captures where country-aware RN marketing hubs are wired before adding UK, Australia, and Philippines pathways.

## Config and registries

| Concern | Location |
|--------|----------|
| Pathway row shape (`countrySlug`, `examCode`, `seoTitle`, …) | `nursenest-core/src/lib/exam-pathways/types.ts`, `exam-pathways-data-segment-*.ts` |
| Catalog merge | `nursenest-core/src/lib/exam-pathways/exam-pathways-catalog.ts` |
| `/{country}/{role}/{exam}` resolution | `nursenest-core/src/lib/exam-pathways/exam-product-registry.ts` (`byRoute` from `EXAM_PATHWAYS`) |
| Prisma `CountryCode` / `ExamFamily` | `nursenest-core/prisma/schema.prisma` |
| Market tiers, SEO, pricing flags | `nursenest-core/src/lib/navigation/market-readiness-data.ts` |
| Region locale defaults | `nursenest-core/src/lib/i18n/global-regions.ts` (`REGION_CONFIG`, `MARKET_READINESS` keys: `uk`, `aus`, `philippines`) |
| Launch gates (lessons/questions/snapshot/approval) | `nursenest-core/src/lib/navigation/country-exam-launch-readiness.ts` |
| Committed inventory snapshot | `nursenest-core/src/config/pathway-readiness-snapshot.json` |

## Routes and SEO

| Concern | Location |
|--------|----------|
| Marketing exam hub page | `nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx` |
| Hub URL builder | `nursenest-core/src/lib/exam-pathways/build-exam-pathway-path.ts` |
| Hreflang for intl hubs | `nursenest-core/src/lib/seo/exam-pathway-hub-alternates.ts` |
| First-segment country detection | `nursenest-core/src/lib/i18n/exam-hub-path.ts` |
| Regional guides (`/exams/uk`, …) | `nursenest-core/src/app/(marketing)/(default)/exams/...` + `exams-australia-hub.tsx` |

## i18n

| Concern | Location |
|--------|----------|
| International RN hub copy keys | `intlNursing.intlRn.*` in `nursenest-core/public/i18n/en/marketing.json` (merged from `tools/i18n/marketing/intl-rn-pathway-hub-en.fragment.json` when editing shards) |
| Resolver | `nursenest-core/src/lib/marketing/intl-rn-pathway-hub-copy.ts` |
| Sections UI | `nursenest-core/src/components/marketing/international-rn-hub-sections.tsx` |

## International RN helpers

| Concern | Location |
|--------|----------|
| Foundation pathway ids | `INTL_RN_FOUNDATION_PATHWAY_IDS` / `isIntlRnFoundationPathwayId` in `country-exam-launch-readiness.ts` |
| Tier hub copy for `ExamFamily.GENERIC` | `nursenest-core/src/lib/marketing/nursing-tier-hub-content.ts` |

## Tests

| Concern | Location |
|--------|----------|
| Resolution, publish gate, hreflang | `nursenest-core/src/lib/exam-pathways/international-rn-exam-pathways.test.ts` |
