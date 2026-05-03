# Allied health hub content audit

**Date:** 2026-05-02  
**Scope:** Marketing allied hubs, canonical pathway lessons hub, `/app` learner lessons, and catalog/loader behavior for `us-allied-core`.  
**Method:** Code-path verification plus a local run of `npx tsx scripts/audit-allied-hub-catalog.ts` from the `nursenest-core` app package (same helpers as production: `getCatalogLessonsRaw`, `filterCatalogLessonsForAlliedProfessionHub`, topic filter mirroring `filterCatalogLessonsByTopicSlugs`).

---

## Verdict: **AUDIT FAILED**

| Criterion | Result |
|-----------|--------|
| ≥ 100 lessons per profession (marketing list substance) | **Fail** — merged catalog path in this environment returned **15** total rows; per-profession counts after topic filter are **4–5** for most keyed professions, **15** (full catalog) for professions with **no** `topicSlugsIn`. Production may serve **database**-backed lists when published rows exist; those paths still **do not** filter by `alliedProfessionKey` (see below). |
| ≤ 20% "shared" vs profession-specific | **Fail** — profession scoping by `alliedProfessionKey` is a **no-op** until keyed catalog rows exist; differentiation is only **`topicSlugsIn`**, and topics overlap heavily (e.g. OTA vs PTA Jaccard **0.67** on slug sets in the script run). |
| Profession taxonomy present and applied | **Fail** — bundled merged catalog rows carry **`alliedProfessionKey`: 0 / 15** in the measured build; `filterCatalogLessonsForAlliedProfessionHub` explicitly **falls back to the full row list** when no row matches the hub key. |
| Hubs do not render identical lesson sets where they should differ | **Fail** for professions with **empty** `topicSlugsIn` — they receive the **same full** catalog slice as the profession filter fallback. |

---

## 1. Route and component map

### Marketing

| Surface | Path / behavior |
|---------|------------------|
| Allied landing | `src/app/(marketing)/(default)/allied-health/page.tsx` — groups `ALLIED_PROFESSIONS` for navigation; not a lesson list. |
| Per-profession hero | `src/app/(marketing)/(default)/allied-health/[slug]/page.tsx` — SEO/hero for segment URLs. |
| Legacy career lessons URL | `src/app/(marketing)/(default)/allied/[career]/lessons/page.tsx` — **301/redirect** to canonical lessons hub with `?alliedProfession=` (no duplicate lesson tree). |
| **Canonical lessons hub** | `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` — builds `listOpts` including **`alliedProfessionKey`** when `getAlliedProfessionByProfessionKey` resolves `?alliedProfession=`. |

### `/app` (learner)

| Surface | Path / behavior |
|---------|------------------|
| Lessons hub | `src/app/(student)/app/(learner)/lessons/page.tsx` — filters by **`pathwayId`**, **`topic` / `topicSlug`**, **`q`**; **does not** read `alliedProfession` or pass `alliedProfessionKey` into list/snapshot opts. |
| Snapshot fallback keying | `src/lib/lessons/app-lessons-hub-published-snapshot-fallback.ts` — `appLessonsHubListOptsForSnapshot` only supports **`q`** and **`topicSlugsIn`** (no allied key). |
| Flashcards | `flashcards/page.tsx` — uses `alliedProfession` query for **CAT href** and display props, not the core lesson list query shape for `/app/lessons`. |
| Clinical scenarios | `clinical-scenarios/page.tsx` — resolves allied profession for **scenario** filtering (`scenarioCatalogCategoryIds`), not the pathway lesson hub pipeline. |

### Loaders / filtering

| Function | Role |
|----------|------|
| `resolveMarketingHubRenderableLessonList` in `pathway-lesson-loader.ts` | If **any** published `PathwayLesson` exists for the pathway (cross-locale count > 0), uses **Prisma** paths with **`topicSlugsIn` only** — **`alliedProfessionKey` is not passed into `loadPublishedLessonInputsAllChunked` / counts**. If **no** DB inventory, **catalog** branch: `filterCatalogLessonsForAlliedProfessionHub` then `filterCatalogLessonsByTopicSlugs`. |
| `filterCatalogLessonsForAlliedProfessionHub` | If no catalog row has `alliedProfessionKey ===` hub key, returns **all** `rows` (documented fallback). |

---

## 2. Does marketing pass `listOpts: { alliedProfessionKey: "…" }`?

**Yes**, when the pathway is the allied marketing core id and `?alliedProfession=` resolves (see `lessons/page.tsx`: merges `alliedProfessionResolved.professionKey` into `listOpts`).

Topic narrowing for allied professions is applied via `topicSlugsIn` on `listOpts` when the registry defines `topicSlugsIn`.

**Important:** Passing `alliedProfessionKey` does **not** change the **database** query path — `alliedProfessionKey` is only used in the **catalog** branch of `resolveMarketingHubRenderableLessonList`.

---

## 3. Is `alliedProfessionKey` actually narrowing content?

### Catalog path

- **`filterCatalogLessonsForAlliedProfessionHub`** returns keyed rows only if **at least one** merged row has that key; else **full catalog**.
- **`loadAlliedProfessionDedicatedLessonsForPathway`** can attach keyed overlays from `dedicatedCatalogFile`, but **`dedicatedCatalogFile` is unset** for every entry in `ALLIED_PROFESSIONS` today — so **no** per-profession JSON shard merge runs.
- Local measurement: **`lessonsWithAlliedProfessionKeyField: 0` / `totalMergedCatalogLessons: 15`** for `us-allied-core` after merge — so profession filter is always the **no-op fallback** on catalog.

### Database path

- Published lessons are loaded with **`topicSlugsIn`** (from marketing `listOpts`) but **no** `alliedProfessionKey` column / WHERE clause in the hub pipeline in `pathway-lesson-loader.ts` (DB branch).

So: **`alliedProfessionKey` is wired on marketing `listOpts` but does not filter DB-backed lists** and does not filter the bundled catalog until keyed rows or dedicated files exist.

---

## 4. Per-profession summary (catalog path — local merged data)

**Legend:** *After profession filter* = always **15** (= full catalog) with current data. *After topic filter* = intersection with `topicSlugsIn`. *% keyed* = **0%** on raw rows.

| User-facing target | Registry `professionKey` | Topic slugs | Lessons after topic filter (local) | Full-catalog fallback? |
|--------------------|--------------------------|-------------|-------------------------------------|-------------------------|
| MLT | `mlt` | 4 | **4** | No |
| Paramedic | `paramedic` | 5 | **5** | No |
| OTA | `ota` | 5 | **5** | No |
| PTA | `pta` | 5 | **5** | No |
| Social Work | `social-work` | 4 | **4** | No |
| Respiratory Therapy | `respiratory` | 5 | **5** | No |
| PSW | `psw-hca` | 5 | **5** | No |
| Pharmacy Technician | `pharmacy-tech` | 4 | **4** | No |
| Psychotherapy (naming) | No `psychotherapy` key — use **`mental-health-addictions`** | 4 | **4** | No |
| EMT | `emt` | **0** | **15** | **Yes** |
| PT (separate) | No dedicated PT key — **PTA** is `pta` | — | — | — |

**Professions with zero topics (15-lesson full catalog on catalog path):** `community-health-worker`, `medical-assistant`, `dental-assistant`, `dental-hygiene`, `dietetic-technician`, `emt`, `sonography`, `radiography`, `lab-assistant`.

### Duplication / overlap (Jaccard > 0.15 from script)

- **OTA vs PTA: 0.667**
- **Paramedic** vs OTA/PTA/respiratory/PSW: ~**0.43**
- Professions with 15 rows vs 4–5 share slugs wherever topics intersect.

---

## 5. Fail criteria checklist

| Rule | Evidence |
|------|----------|
| < 100 lessons per profession | Catalog: **15** max; **4–5** typical after topics. |
| > 20% shared | **0** keyed rows ⇒ shared bank until topic filter; high cross-profession overlap. |
| No profession taxonomy on lists | No `alliedProfessionKey` on merged catalog rows; DB hub list not keyed by profession. |
| Identical hub content | All zero-topic professions: **same 15** slugs on catalog path. |

---

## 6. SEO risk

- **Duplicate:** Overlapping slug sets across `?alliedProfession=` URLs when topics align (e.g. social-work vs mental-health-addictions use the same four topic slugs in the registry).
- **Thin:** Very small slices (4–5) for “exam prep” positioning; zero-topic professions show the **entire** pathway catalog slice.

---

## 7. Recommendations

1. Populate `alliedProfessionKey` on catalog rows **or** add `dedicatedCatalogFile` per profession.
2. Add `topicSlugsIn` for **EMT** and all professions currently at **0** topics.
3. If DB is authoritative, add profession dimension to published content **or** document topic-only slicing for marketing.
4. Align product names: psychotherapy vs `mental-health-addictions`; PT vs PTA.

---

## 8. Artifacts

- `scripts/audit-allied-hub-catalog.ts` — re-run from `nursenest-core/` after catalog or registry changes.

