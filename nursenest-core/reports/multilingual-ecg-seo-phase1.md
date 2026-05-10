# Multilingual ECG SEO — Phase 1 delivery report

**Date:** 2026-05-10  
**Scope:** Long-tail `blog-static-longtail` posts for international ECG/EKG SEO funneling to the premium ECG module (`/modules/ecg/*`).  
**Constraints honored:** No external APIs; UTF-8; kebab-case slugs; frontmatter matches loader; English canonical + localized adaptations with shared `translationGroupId` for clusters 01–10.

## Counts per language

| languageCode | locale  | posts | translationGroupId range (inclusive) |
| ------------ | ------- | ----: | -------------------------------------- |
| en           | en-US   |    40 | nn-ecg-p1-01 … nn-ecg-p1-40           |
| es           | es-ES   |    10 | nn-ecg-p1-01 … nn-ecg-p1-10           |
| fr           | fr-FR   |    10 | nn-ecg-p1-01 … nn-ecg-p1-10           |
| pt           | pt-BR   |    10 | nn-ecg-p1-01 … nn-ecg-p1-10           |
| ar           | ar-SA   |    10 | nn-ecg-p1-01 … nn-ecg-p1-10           |
| hi           | hi-IN   |    10 | nn-ecg-p1-01 … nn-ecg-p1-10           |
| tl           | tl-PH   |    10 | nn-ecg-p1-01 … nn-ecg-p1-10           |
| zh           | zh-CN   |    10 | nn-ecg-p1-01 … nn-ecg-p1-10           |
| ja           | ja-JP   |    10 | nn-ecg-p1-01 … nn-ecg-p1-10           |
| **Total**    |         | **120** |                                       |

English posts use descriptive slugs (e.g. `ecg-p1-read-twelve-lead-systematic-rn-paramedic`). Localized siblings use short slugs `ecg-p1-{01–10}-{es|fr|pt|ar|hi|tl|zh|ja}`.

## Word count (body HTML, text-only)

Sampling `stripHtml` + whitespace token count:

| slug (sample) | languageCode | approx. words |
| ------------- | ------------- | ------------: |
| ecg-p1-read-twelve-lead-systematic-rn-paramedic | en | ~2694 |
| ecg-p1-01-es | es | ~2603 |

Generator targets **≥1680** words (EN) and **≥1580** words (non-EN) in the expandable block plus fixed sections; measured samples exceed **1600** total words.

## Internal ECG / product links (verified routes)

Every article **Suggested internal links** section includes (at minimum):

- `/modules/ecg`
- `/modules/ecg/basic`
- `/modules/ecg/advanced`
- `/modules/ecg/basic/lessons`
- `/modules/ecg/basic/quizzes`
- `/modules/ecg/advanced/video-drills`
- `/modules/ecg/advanced/scenarios`
- `/blog/hyperkalemia-ecg-changes-nursing-students`
- `/blog/ecg-interpretation-nursing-foundations-rhythm-recognition`
- `/app/dashboard`

## Schema / code changes (minimal)

- **`BlogStaticLongtailRecord`**: `locale`, `languageCode`, `translationGroupId` (present in types + loader).
- **`blog-static-longtail-validate.ts`**: If any of the three i18n fields is present, all three are required; `languageCode` validated with a short `en` / `en-US`-style pattern.
- **`static-blog-posts.ts`**: `publishedBlogPostFromLongtailRecord` maps `locale` and `translationGroupId` from the long-tail record into the synthetic `BlogPost` (defaults remain `en` / null when omitted).

## Regeneration

From `nursenest-core/`:

```bash
npx tsx scripts/blog/generate-multilingual-ecg-phase1.mts
```

Sources:

- `scripts/blog/ecg-phase1-topics.ts` — 40 EN topic definitions.
- `scripts/blog/ecg-phase1-i18n-meta.ts` — localized titles/excerpts/SEO for clusters 01–10 × 8 languages.
- `scripts/blog/ecg-phase1-slots.ts` — multilingual clause banks + seeded expansion sentences.
- `scripts/blog/generate-multilingual-ecg-phase1.mts` — writer.

## Validation and tests (exit codes)

| Command | Exit |
| ------- | ---: |
| `npm run validate:blog-static-longtail` | 0 |
| `npm run diagnose:blog-slug-collisions -- --write-report` | 0 |
| `npm run typecheck:critical` | 0 |
| `npm run test:blog-recovery` | 0 |
| `npm run test:homepage` | 0 |

**DB slug collisions:** Diagnostic reported **20** live DB ∩ supplement overlaps; **none** were `ecg-p1-*` Phase-1 slugs. Report file: `docs/reports/blog-slug-collision-diagnostic.txt`.

## Known limitations / Phase 2

1. **English long-tail aspirational 340–360:** Phase 1 shipped **40** EN posts (not 340+). Further batches can extend `ECG_PHASE1_EN_TOPICS` and re-run the generator.
2. **Mixed-language list bullets:** "Key Takeaways" and some checklist items remain **English** inside localized articles for structural consistency; body expansions and headings are localized. Phase 2 can translate those lists per locale.
3. **Internal link labels:** Link anchor text is English across locales; URLs are universal.
4. **FAQ "schema":** FAQ is present as HTML headings/paragraphs; not injected as JSON-LD in markdown (aligns with existing long-tail pattern).

## Files touched (summary)

- **New:** `scripts/blog/ecg-phase1-topics.ts`, `ecg-phase1-i18n-meta.ts`, `ecg-phase1-slots.ts`, `generate-multilingual-ecg-phase1.mts`
- **New:** 120 × `src/content/blog-static-longtail/ecg-p1-*.md`
- **Updated:** `src/lib/blog/blog-static-longtail-validate.ts`, `src/lib/blog/static-blog-posts.ts`
- **This report:** `reports/multilingual-ecg-seo-phase1.md`

---

Truthpack `copy.json` was not present in this workspace clone; CTA strings were authored inline in the generator.
