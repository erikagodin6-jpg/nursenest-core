# Regional nursing verticals — inventory (hardening pass)

Scope: Philippines, India, Middle East, Australia, China, South Korea, Japan, Germany, France, Italy, Hungary.  
No new countries in this document.

## Consistency matrix (shipped / partial / missing)

Legend: **S** = shipped, **P** = partial, **—** = missing or N/A for that vertical.

| Requirement | PH | IN | ME | AU | CN | KR | JP | DE | FR | IT | HU |
|-------------|----|----|----|----|----|----|----|----|----|----|-----|
| `/exams/{region}` hub route | S | S | S | S | S | S | S | S | S | S | S |
| Topic / country guide routes (where designed) | P | S | S | S | S | S | S | S | S | S | S |
| Hub metadata + FAQ/schema | S | S | S | S | S | S | S | S | S | S | S |
| Regional nav strip (`resolveRegionalMarketingStrip`) | S | S | S | S | S | S | S | S | S | S | S |
| “What NurseNest covers” (explicit) | S | P→S | S | S | S | S | P→S | P→S | P→S | P→S | P→S |
| Shared truth strip (authority / not bank / not legal) | S* | S | —** | —** | —** | —** | S | S | S | S | S |
| Language honesty note | S* | P | P | P | S | S | P | P | P | P | S*** |
| Blog manifest (200-topic style) | — | S | S | S | S | S | S | S | S | S | S |
| Blog materializer to disk | P**** | S***** | S***** | S***** | S***** | S***** | — | — | — | — | — |
| `blog-content/` vs `blog-materialized/` | P | sample | sample | sample | dir | dir | — | — | — | — | — |

\* Philippines: single-file hub (`exams/philippines/page.tsx`), English-only body; disclosures inline, not shared i18n component.  
\*\* Australia, Middle East, China, Korea: already had dedicated `nurseNestCovers` + (CN/KR) `languageHonesty` sections; shared strip omitted to avoid duplicate prose.  
\*\*\* Hungary: `RegionalHubLanguageNoteStrip` added (generic English-first note).  
\*\*\*\* Philippines uses NLE seed/import pipeline, not the `*-nursing-200.manifest.json` pattern.  
\*\*\*\*\* India / ME / Australia: `materialize-regional-blog-batches.mts` → `data/blog-materialized/{region}/`.  
\*\*\*\*\* China / Korea: `materialize-china-korea-blog-content.mts` → `data/blog-content/{china,korea}-nursing/`.

## Navigation precedence (single strip)

Implemented in `src/lib/marketing/regional-marketing-nav-priority.ts`: **pathname → `nn_global_region` cookie → locale hint**. Only one strip resolves at a time.

Locale hints (when path and cookie unset): `tl`→Philippines, `zh`/`zh-tw`→China, `ko`→Korea, `ja`→Japan, `de`→Germany, `fr`→France, `it`→Italy, `hu`→Hungary, `pt`→Portugal, Indic locales→India, `ar`/`ur`→Middle East.

## Language overlay classification (truthful)

| Region | Full | Partial | Fallback / English-primary |
|--------|------|---------|----------------------------|
| Philippines | — (product EN-first) | Tagalog on key marketing routes (per hub copy) | Many regional languages: not localized |
| India | Hindi overlay file where merged | Other locales often EN duplicate | Same pattern in merge scripts |
| Middle East | — | AR/UR routes where merged | Many locales EN duplicate |
| Australia | — | EN-first + manifest langs | Verify per locale bundle |
| China | EN clinical + partial ZH | ZH / ZH-TW where merged | AR, HI, TL often EN |
| Korea | EN + partial KO | KO where merged | JA, ZH, etc. verify per bundle |
| Japan | JA where merged | EN shell | Others verify |
| Germany | DE where merged | EN shell | Others verify |
| France | FR where merged | EN shell | Others verify |
| Italy | IT where merged | EN shell | Others verify |
| Hungary | HU manifest rows | EN-heavy UI | **Native marketing copy TODO** (strip calls this out) |

Manifest **language codes** ≠ full UI localization. Run `npm run blog:validate-regional-manifests` for distribution only.

## Commands (standardization)

- `npm run i18n:merge-regional-hub-standard` — shared hub truth + language note keys into all `public/i18n/*.json`.
- `npm run blog:validate-regional-manifests` — duplicate slug/title + required fields + lang counts for all `*-nursing-200.manifest.json`.
- Existing: `blog:materialize-regional-batches`, `blog:materialize-china-korea-content`, `blog:validate-china-korea-content`.

## Next high-leverage follow-ups

1. Optional: add `RegionalHubTruthStrip` to AU/ME/CN/KR only if product wants identical global bullets above `nurseNestCovers` (watch duplication).
2. Philippines: migrate canonical hub to shared i18n + `RegionalHubTruthStrip` when safe (preserve SEO paragraph).
3. EU JP manifests: add materializers reusing `regional-manifest-blog-body` + same validation tier as India when content strategy is ready (keep off build path).
