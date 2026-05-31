# Multilingual Isolation Architecture Critical Audit

Date: 2026-05-31

Status: implemented foundation with contract-test protection.

## Executive Summary

NurseNest now has a dedicated multilingual isolation registry that separates language activation from the older shared marketing language list. English remains the only production/indexable language by default. French, Spanish, Hindi, Portuguese, Arabic, German, Japanese, Korean, Chinese Simplified, Chinese Traditional, Italian, and Tagalog have independent registry entries, subdomains, feature flags, SEO status, publication status, translation status, indexing status, and completion percentages.

The purpose of this pass is to prevent future language work from breaking English production routes, metadata, navigation, sitemap behavior, hreflang clusters, or translation files.

Primary implementation files:

- `src/lib/i18n/language-isolation-registry.ts`
- `src/lib/i18n/language-subdomains.ts`
- `src/lib/i18n/language-readiness.ts`
- `src/lib/i18n/marketing-languages.ts`
- `src/lib/seo/marketing-alternates.ts`
- `src/lib/seo/language-sitemap-xml.ts`
- `src/lib/seo/sitemap-index-children.ts`

Primary protection tests:

- `src/lib/i18n/language-isolation-registry.contract.test.ts`
- `src/lib/seo/english-seo-isolation.contract.test.ts`
- updated locale, sitemap, hreflang, and SEO leakage contracts.

## 1. Multilingual Architecture Audit

Previous risk: multilingual readiness was partially inferred from shared marketing language tiers. Some non-English locales were marked `full`, which made them eligible for switcher visibility, sitemap inclusion, or hreflang behavior through shared helpers.

New architecture:

| Layer | Isolation behavior |
|---|---|
| Registry | Each language has its own subdomain, feature flag, publication status, translation status, SEO status, indexing status, and completion percent. |
| Routing | Subdomain host resolution maps to an internal locale prefix without changing English apex routes. |
| SEO | Canonical, hreflang, robots, and sitemap inclusion now honor isolation status. |
| Switcher | Non-English languages are hidden by default until explicitly enabled. |
| Tests | English canonical, sitemap, hreflang, and i18n namespace isolation are contract-tested. |

Registered language architecture:

| Language | Internal locale | Public host | Feature flag | Default status |
|---|---|---|---|---|
| English | `en` | `nursenest.ca` | `ENABLE_ENGLISH` | published/indexable |
| French | `fr` | `fr.nursenest.ca` | `ENABLE_FRENCH` | preview/noindex |
| Spanish | `es` | `es.nursenest.ca` | `ENABLE_SPANISH` | preview/noindex |
| Hindi | `hi` | `hi.nursenest.ca` | `ENABLE_HINDI` | disabled/noindex |
| Portuguese | `pt` | `pt.nursenest.ca` | `ENABLE_PORTUGUESE` | disabled/noindex |
| Arabic | `ar` | `ar.nursenest.ca` | `ENABLE_ARABIC` | disabled/noindex |
| German | `de` | `de.nursenest.ca` | `ENABLE_GERMAN` | disabled/noindex |
| Japanese | `ja` | `jp.nursenest.ca` | `ENABLE_JAPANESE` | disabled/noindex |
| Korean | `ko` | `ko.nursenest.ca` | `ENABLE_KOREAN` | disabled/noindex |
| Chinese Simplified | `zh` | `zh.nursenest.ca` | `ENABLE_CHINESE_SIMPLIFIED` | disabled/noindex |
| Chinese Traditional | `zh-tw` | `zh-tw.nursenest.ca` | `ENABLE_CHINESE_TRADITIONAL` | disabled/noindex |
| Italian | `it` | `it.nursenest.ca` | `ENABLE_ITALIAN` | disabled/noindex |
| Tagalog | `tl` | `tl.nursenest.ca` | `ENABLE_TAGALOG` | disabled/noindex |

## 2. Translation Key Audit

Current translation namespace structure already uses physical language folders:

```text
public/i18n/en/nav.json
public/i18n/fr/nav.json
public/i18n/es/nav.json
```

The new contract test verifies that English namespace files are physically separate from French and Spanish namespace files. The policy is:

- English dictionaries are locked production assets.
- New languages must use their own namespace folders.
- New language work must never overwrite `public/i18n/en/*`.
- Future translation import tools should write only to the target language namespace.

Remaining recommended hardening:

- Add a checksum snapshot for `public/i18n/en/*` in CI.
- Add import-tool tests that reject writes to English unless an explicit English-copy task is running.

## 3. Route Isolation Audit

English remains:

```text
https://nursenest.ca/{path}
```

Localized ecosystems use language subdomains:

```text
https://fr.nursenest.ca/{path}
https://es.nursenest.ca/{path}
https://jp.nursenest.ca/{path}
https://zh-tw.nursenest.ca/{path}
```

Internally, Next.js still renders via locale prefixes:

```text
fr.nursenest.ca/pricing -> /fr/pricing
es.nursenest.ca/nclex-rn -> /es/nclex-rn
jp.nursenest.ca/nclex-rn -> /ja/nclex-rn
```

English routing is not rewritten. The contract test verifies:

- `nursenest.ca/pricing` remains `/pricing`,
- localized hosts resolve independently,
- Japanese uses `jp.nursenest.ca` publicly while retaining `ja` internally,
- Chinese Traditional uses `zh-tw.nursenest.ca` and `/zh-tw`.

## 4. Database Isolation Audit

The codebase still needs full DB schema enforcement for language-aware content. Required content fields remain:

- `language`,
- `region`,
- `translationStatus`,
- `publicationStatus`,
- `sourceLanguage`,
- `localizationStatus`,
- `reviewStatus`,
- `seoStatus`,
- `indexingStatus`,
- `contentNamespace`.

Operating rule:

```text
No content query should load multilingual content by accident.
Every learner/content query must explicitly scope by language or default to English production.
```

Recommended next DB hardening:

- Add language-scoped unique constraints for slugs.
- Add query helpers that require language and region parameters.
- Add tests proving French/Spanish content cannot overwrite English lessons, questions, flashcards, blogs, CAT pools, or practice exams.

## 5. SEO Isolation Audit

English SEO remains isolated:

- English canonical URLs continue to use `https://nursenest.ca`.
- English hreflang output only includes `x-default` and `en-CA` while other languages are disabled.
- English sitemap generation omits localized subdomains.
- Non-English language sitemaps are valid but empty until approval.

New language sitemap stubs:

- `/sitemap-fr.xml`
- `/sitemap-es.xml`
- `/sitemap-hi.xml`
- `/sitemap-pt.xml`
- `/sitemap-ar.xml`
- `/sitemap-de.xml`
- `/sitemap-jp.xml`
- `/sitemap-ko.xml`
- `/sitemap-zh.xml`
- `/sitemap-zh-tw.xml`
- `/sitemap-it.xml`
- `/sitemap-tl.xml`

Non-English pages receive `noindex,nofollow` unless explicitly published and indexable in the isolation registry.

## 6. Build Isolation Audit

Current build isolation is improved through contract tests, but full independent build lanes still need CI orchestration.

Implemented:

- registry tests,
- English SEO isolation tests,
- language sitemap tests,
- locale leakage tests,
- localized SEO readiness tests.

Required next CI lanes:

```text
npm run test:i18n:english-lock
npm run test:i18n:registry
npm run test:seo:english-lock
npm run test:seo:language-sitemaps
npm run build:production
```

Future language failures should block that language's promotion, not rewrite English behavior. English production still needs the main build to pass before deployment.

## 7. Feature Flag Audit

Feature flags now exist as registry fields:

- `ENABLE_FRENCH`
- `ENABLE_SPANISH`
- `ENABLE_HINDI`
- `ENABLE_PORTUGUESE`
- `ENABLE_ARABIC`
- `ENABLE_GERMAN`
- `ENABLE_JAPANESE`
- `ENABLE_KOREAN`
- `ENABLE_CHINESE_SIMPLIFIED`
- `ENABLE_CHINESE_TRADITIONAL`
- `ENABLE_ITALIAN`
- `ENABLE_TAGALOG`

Default behavior:

- English enabled.
- Every non-English language disabled from public switcher visibility.
- Every non-English language excluded from sitemap and hreflang.
- Every non-English language noindexed.

Required next step:

- Wire feature flags to an admin publication workflow rather than environment variables alone.
- Require approval from clinical, language, SEO, and product owners before enabling.

## 8. Regression Protection Audit

Implemented regression contracts validate:

- English canonical unchanged.
- English hreflang unchanged.
- English sitemap excludes localized subdomain URLs.
- Non-English languages stay out of switcher and hreflang by default.
- Non-English languages stay noindex/nofollow by default.
- Required language subdomains are registered.
- English i18n files are physically isolated from non-English namespaces.
- Sitemap index includes language sitemap stubs.

Focused test command:

```bash
node --import tsx --test \
  src/lib/i18n/language-isolation-registry.contract.test.ts \
  src/lib/i18n/language-subdomains.contract.test.ts \
  src/lib/i18n/language-readiness-sitemap.test.ts \
  src/lib/seo/english-seo-isolation.contract.test.ts \
  src/lib/seo/language-sitemap-xml.contract.test.ts \
  src/lib/seo/localized-seo-readiness.test.ts \
  src/lib/seo/sitemap-index.contract.test.ts \
  src/lib/seo/locale-seo-leakage.contract.test.ts
```

Latest result:

```text
59 passed, 0 failed
```

## 9. Future Scalability Report

The registry model supports expansion to:

- 50+ languages,
- 100+ country variants,
- language subdomains,
- regional hreflang variants,
- independent sitemap files,
- independent publication states,
- independent translation completion percentages.

Future country variants should be added as separate registry entries only when they have distinct SEO, content, or regulatory requirements. Example:

```text
es-US
es-MX
es-PR
fr-CA
fr-FR
pt-BR
pt-PT
zh-Hans
zh-Hant
```

Do not reuse a production content object across language variants. Use inheritance metadata and explicit source links instead.

## 10. Risk Assessment

| Risk | Current mitigation | Remaining risk |
|---|---|---|
| English SEO regression | English canonical/hreflang/sitemap tests | Add CI-required English metadata snapshots. |
| Translation key corruption | Physical namespace isolation test | Add checksum locks for `public/i18n/en`. |
| Non-English indexation leak | Registry-driven noindex/nofollow and sitemap exclusion | Add live robots/meta Playwright checks per subdomain. |
| Route conflict | Subdomain registry and middleware mapping tests | Add middleware unit tests with mocked `NextRequest`. |
| DB content collision | Documented required fields | Needs schema/query enforcement in a future pass. |
| Build failures from language work | Focused contract tests | Needs CI split lanes and language-specific smoke tests. |
| Mixed-language learner UI | Switcher disabled by default | Needs route-level QA before enabling any language. |

## Success Criteria Status

| Requirement | Status |
|---|---|
| English remains production default | Implemented |
| Required language subdomains registered | Implemented |
| Non-English languages disabled/noindex by default | Implemented |
| English canonical protected | Implemented |
| English sitemap protected | Implemented |
| English hreflang protected | Implemented |
| Language sitemap stubs | Implemented |
| Translation namespace isolation | Partially implemented with tests |
| DB-level content isolation | Designed; not yet schema-enforced |
| Independent language build lanes | Designed; not yet CI-enforced |

Conclusion: the production-critical isolation foundation is now in place. The remaining work is deeper DB/query enforcement and CI orchestration, not another shared i18n expansion layer.

