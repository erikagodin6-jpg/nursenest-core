# RN NCLEX-RN lesson inventory (read-only audit)

Generated from repository analysis plus the bundled-data script  
`nursenest-core/scripts/debug-rn-lesson-inventory.mjs` (see §0). **No routing, auth, pricing, or lesson content was changed** for this report.

---

## 0. How to reproduce machine-readable output

From `nursenest-core/`:

```bash
node scripts/debug-rn-lesson-inventory.mjs --json-summary 2>rn-lesson-inventory.summary.json > rn-lesson-inventory.tsv
```

- **Stdout:** TSV with columns  
  `source_file`, `pathway`, `lesson_id`, `lesson_slug`, `title`, `topic`, `topic_slug`, `body_system`,  
  `public_complete_marketing_surface`, `matches_pathway_context`,  
  `in_simulated_catalog_hub_list`, `in_effective_catalog_marketing_list`  
  (plus Prisma rows when `DATABASE_URL` is set).
- **Stderr:** JSON summary when `--json-summary` is passed.

**Snapshot values on this clone** (commit at time of run; `catalog.json` changes will move numbers):

| Metric | `us-rn-nclex-rn` | `ca-rn-nclex-rn` |
|--------|------------------|------------------|
| Raw `catalog.json` rows in pathway bucket | 132 | 133 |
| `getCatalogPathwayLessonsSync` rows (JSON bucket + scoped-gold prepend + allied + new-grad merge, normalized) | 183 | 184 |
| Simulated marketing hub list (catalog runtime: safe slug → pathway context → dedupe; **no** DB, **no** verify/fill) | 183 | 184 |
| `getEffectiveCatalogLessonsForPathwaySync` (adds **`pathwayLessonEligibleForPublicMarketingSurface`**) | 31 | 96 |
| Published `pathway_lessons` rows (this environment) | 0 | 0 |

**Union:**

- **Total normalized catalog-sync rows (US+CA):** 367  
- **Distinct slug strings appearing in both US and CA pathways:** 156 (paired regional variants / shared gold slugs).

---

## 1. RN pathway IDs in product data

Only these two pathway IDs carry the NCLEX-RN RN product lesson library in `catalog.json` and the exam-pathway catalog:

| Pathway ID | Region |
|------------|--------|
| `us-rn-nclex-rn` | United States |
| `ca-rn-nclex-rn` | Canada |

There is **no separate third RN exam pathway** in the bundled lesson catalog; other “RN” surfaces are the same hubs under marketing routes (`/us/rn/nclex-rn/...`, `/canada/rn/nclex-rn/...`) wired through `exam-pathways` definitions.

---

## 2. Every class of source that can feed RN lesson surfaces

Roughly ordered by **runtime precedence** for the **marketing lessons hub** (`/…/lessons`):

1. **PostgreSQL `pathway_lessons`** (Prisma)  
   If **any** published row exists for the pathway (any locale), `resolveMarketingHubRenderableLessonList` in `pathway-lesson-loader.ts` takes the **`database`** branch and **does not** merge the static `catalog.json` list into the primary hub list. Extra catalog rows can still appear on **topic** sub-pages as a supplement when the DB has zero rows for that `topicSlug`.

2. **Study failover snapshots**  
   `marketing-hub-lessons-page-fetch.ts` → `readPathwayLessonsHubPageSnapshot` can serve a cached `PathwayLessonsPageResult` when live `getPathwayLessonsPageFresh` fails validation or policy (secondary source).

3. **Bundled JSON catalogs** (merged by `getCatalogLessonsRaw` in `pathway-lesson-catalog-sync.ts`)  
   - `src/content/pathway-lessons/catalog.json` — per-pathway `lessons[]`  
   - `src/content/pathway-lessons/allied-bundled-catalog.json` — optional extra rows by pathway id  
   - `src/content/pathway-lessons/new-grad-transition-catalog.json` — optional transition rows  

4. **Scoped gold registry** (`prependScopedGoldCatalogLessons` in `scoped-lessons/scoped-gold-registry.ts`)  
   Injects whole-lesson payloads when the slug is missing from the pathway’s JSON slice (shared sepsis/shock/COPD/ACS/etc. cores).

5. **Public i18n / educational overlays**  
   File-based `public/i18n/.../lessons.json` (+ optional DB overlay bundle) merged in `applyOverlayAndStructural` / `applyLessonEducationalOverlay` — affects **display strings**, not slug inventory.

6. **Legacy import pipeline** (offline)  
   `src/lib/legacy/legacy-lessons-practice-pipeline.ts` and fixtures under `src/lib/legacy/` — used to **populate** `pathway_lessons`, not a parallel runtime reader for the hub.

7. **Authoring / planning artifacts (not runtime list sources)**  
   - `rn-nclex-master-map.json`, `rn-nclex-explicit-inventory-aliases.json`, `nclex-rn-source-checklist.json`, `rn-nclex-catalog-import-state.json`, `docs/rn-nclex-rn-lesson-library.md` (referenced from master map) — shape backlog and SEO/taxonomy; they do **not** append lessons unless content is imported into (3) or (1).

---

## 3. Key files that contribute RN lesson pages, hubs, cards, clusters, search, or SEO

### 3.1 Data on disk

| Path | Role |
|------|------|
| `src/content/pathway-lessons/catalog.json` | Primary bundled lesson bodies + metadata for `us-rn-nclex-rn` / `ca-rn-nclex-rn` |
| `src/content/pathway-lessons/allied-bundled-catalog.json` | Optional merged rows |
| `src/content/pathway-lessons/new-grad-transition-catalog.json` | Optional merged rows |
| `src/content/pathway-lessons/rn-nclex-master-map.json` | Build-order + topic graph / authoring alignment |
| `src/content/pathway-lessons/rn-nclex-explicit-inventory-aliases.json` | Alias / inventory metadata |
| `src/content/pathway-lessons/nclex-rn-source-checklist.json` | Source checklist |
| `public/i18n/**/lessons.json` (shards) | Educational overlays for lesson titles/bodies where compiled |

### 3.2 Loader, gates, dedupe, hub layout

| Path | Role |
|------|------|
| `src/lib/lessons/pathway-lesson-loader.ts` | `getPathwayLessonsPage` / `Fresh`, `resolveMarketingHubRenderableLessonList`, DB vs catalog branch, topic pages, counts |
| `src/lib/lessons/pathway-lesson-catalog-sync.ts` | JSON require, `normalizeLesson`, `getCatalogPathwayLessonsSync`, `getEffectiveCatalogLessonsForPathwayContext`, marketing context match |
| `src/lib/lessons/pathway-lesson-route-access.ts` | `pathwayLessonEligibleForPublicMarketingSurface`, entitlement/detail gates |
| `src/lib/lessons/pathway-lesson-dedupe.ts` | Slug-level dedupe for hub + library |
| `src/lib/lessons/pathway-lesson-hub-organize.ts` | Hub presentation ordering (slug-only merge disabled on marketing hub) |
| `src/lib/lessons/pathway-lesson-body-system-groups.ts` | Body-system buckets for cards |
| `src/lib/lessons/lesson-topic-cluster-registry.ts` | Topic cluster metadata / routing support |
| `src/lib/lessons/pathway-lesson-public-preview-priority.ts` | Curated slug ordering for previews / sort tail |
| `src/lib/lessons/marketing-hub-lesson-inventory-fill.ts` | Minimum visible lesson fill for marketing hub |
| `src/lib/lessons/pathway-lesson-hub-link-integrity.ts` | `verifyMarketingHubLessonRowsResolve` — hydrates lessons and can drop rows |
| `src/lib/pathways/pathway-learning-structure.ts` | Hub category taxonomy (`RN_PN_RPN_HUB_CATEGORIES`) |
| `src/lib/lessons/scoped-lessons/scoped-gold-registry.ts` | Injects scoped gold lessons into catalog merge |

### 3.3 Marketing / App routes & UI

| Path | Role |
|------|------|
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` | Lessons hub page: `loadPathwayLessonsHubAggregates`, `PathwayLessonsCurriculumHub`, counts, verify + fill |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx` | Lesson detail body |
| `src/components/pathway-lessons/pathway-lessons-curriculum-hub.tsx` | Dedupe → organize → href filter → `buildPathwayLessonSystemSections` |
| `src/components/pathway-lessons/lesson-system-card.tsx` | Renders lesson links inside body-system sections |
| `src/components/pathway-lessons/pathway-topic-cluster-*.tsx` | Topic cluster navigation + programmatic SEO sibling |
| `src/lib/exam-pathways/marketing-hub-optional-data.ts` | `loadPathwayLessonsHubAggregates` |
| `src/lib/exam-pathways/marketing-hub-lessons-page-fetch.ts` | Snapshot + `getPathwayLessonsPageFresh` orchestration |
| `src/lib/study-content-failover/pathway-lessons-hub-snapshot-read.ts` | Failover snapshot read |

### 3.4 SEO & programmatic surfaces

| Path | Role |
|------|------|
| `src/lib/seo/sitemap-static-xml.ts` | Lesson URLs for sitemap via pathway lesson loader |
| `src/lib/seo/internal-links.ts` | Prisma-backed internal lesson links |
| `src/lib/seo/content-backed-study-resource-hub.ts` | DB-backed study resource grouping |
| `src/lib/seo/load-programmatic-question-topic-page.ts` | Programmatic topic pages referencing lesson slugs |

### 3.5 In-app learner hub (non-marketing)

| Path | Role |
|------|------|
| `src/app/(student)/app/(learner)/lessons/page.tsx` | Authenticated lessons index |
| `src/lib/lessons/app-lessons-hub-published-snapshot-fallback.ts` | Snapshot fallback for app hub |

### 3.6 Admin / API

| Path | Role |
|------|------|
| `src/app/api/admin/pathway-lessons/route.ts` | Admin API for lesson CRUD |

---

## 4. Counts by source (conceptual)

| Source | What was counted | This clone |
|--------|------------------|------------|
| `catalog.json` bucket only | `pathways[pid].lessons.length` | US 132, CA 133 |
| Bundled merge + gold + allied + new-grad | `getCatalogPathwayLessonsSync(pid).length` | US 183, CA 184 |
| “Strict” marketing catalog list | `getEffectiveCatalogLessonsForPathwaySync` | US 31, CA 96 |
| Prisma published rows | `pathway_lessons` where status=PUBLISHED | 0 (no DB in run) |
| Failover snapshot | Blob / KV read — not enumerated offline | N/A |

---

## 5. Unique IDs and slugs

- **Synthetic catalog-sync ID** (script): `catalog-sync:{pathwayId}:{slug}`  
- **Database ID** (when present): Prisma `PathwayLesson.id` (`cuid()`)

**Slug uniqueness:**

- Within a single pathway list, **dedupe** is by `pathwayId + slug` (`pathway-lesson-dedupe.ts`).  
- **156** slug strings appear under **both** `us-rn-nclex-rn` and `ca-rn-nclex-rn` (regional pairs + identical gold slugs).

---

## 6. Visible lesson cards on the RN marketing lessons hub

The toolbar badge uses **`hubListCountForChrome = hubCurriculumLessons.length`** after:

1. Loader: `pageResult.renderableAll` from `resolveMarketingHubRenderableLessonList` (DB **or** catalog branch).  
2. `prepareLessonsForHubCurriculum` (safe slug, dedupe, organize, marketing href).  
3. **`verifyMarketingHubLessonRowsResolve`** (can drop “soft” rows).  
4. **`fillMarketingHubLessonInventoryToMinimum`** (may add strict rows to reach a minimum visible count).

So **visible card rows** correspond to **`lessonsForCurriculumHub`** (full verified set when under `PATHWAY_HUB_PAGE_SIZE_MAX`), **not** raw `catalog.json` length and **not** `getEffectiveCatalogLessonsForPathwaySync` alone.

**Per-card links:** `LessonSystemCard` only renders up to `LESSON_SYSTEM_HUB_CARD_PREVIEW_MAX` link buttons per body-system section; additional lessons in that section may be reached via “view all” patterns — see `pathway-lessons-curriculum-hub.tsx` and `lesson-system-card.tsx`.

---

## 7. Duplicate / variant patterns (automated samples)

### 7.1 Same normalized title, different slug (catalog-sync corpus)

Detected by normalizing `(NCLEX-RN, US|Canada)` suffixes and whitespace:

- **US:** `antihypertensives` → slugs `med-family-antihypertensives-gold`, `antihypertensive-combos`  
- **CA:** same pair

(Full automated duplicate-title scan is limited to 40 entries per pathway in the script summary; extend the script if you need exhaustive dumps.)

### 7.2 Same slug in US and Canada

**156** shared slugs — expected for mirrored curriculum + shared scoped-gold slugs (e.g. `acute-coronary-syndrome-gold`, `sepsis-early-recognition-gold`).

### 7.3 Same clinical concept, different slug (US vs CA)

Many conditions use **different** slugs per country (e.g. `us-rn-heart-failure` vs `ca-rn-heart-failure` for parallel rows). The inventory TSV lists both.

### 7.4 Same slug, different title

No collision observed **within** a single pathway bucket for the current JSON (slug is the stable primary key in code).

---

## 8. Why UI / hub counts differ from “`catalog.json` has N lessons”

1. **Merged pipeline:** Hub inventory uses `getCatalogLessonsRaw` → **`getCatalogPathwayLessonsSync`**, which prepends **scoped gold** and may merge **allied** / **new-grad** slices — row count **exceeds** the `catalog.json` slice for that pathway.  
2. **Database wins:** If Prisma has published lessons, the hub list is **DB-first**; static JSON counts are irrelevant to the primary list (catalog only used when DB is empty for that pathway).  
3. **Marketing gates:** `getEffectiveCatalogLessonsForPathwaySync` applies **`pathwayLessonEligibleForPublicMarketingSurface`**; the live hub pipeline before verify uses **`pathwayLessonMatchesMarketingPathwayContext`** and does **not** apply the same filter set as that helper-only export — so “catalog JSON rows” ≠ “effective marketing export” ≠ “rendered cards after verify/fill”.  
4. **Verify + fill:** The grid count is **`hubCurriculumLessons.length`**, not `pageResult.total` from the loader alone.  
5. **Pagination vs grid:** The curriculum grid intentionally uses the **full** verified list (when under cap) while pagination may use a smaller page size — see comments in `lessons/page.tsx`.

---

## 9. Follow-ups (out of scope for this inventory)

- Run the same script **with production `DATABASE_URL` read-only** to append live Prisma rows to the TSV.  
- Run `marketing-hub-lesson-inventory-audit.ts` / smoke tests with `NN_MARKETING_HUB_PIPELINE_DEBUG=1` to capture verify drop reasons for a specific environment.  
- Align reporting vocabulary (`raw JSON` vs `catalog-sync` vs `effective marketing`) in dashboards to avoid comparing incompatible stages.
