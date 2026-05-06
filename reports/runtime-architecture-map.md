# NurseNest — runtime architecture map (routes & runtimes)

**Last audited:** documentation-only pass over `nursenest-core/src/app/**` layout groups and key libs.  
**Constraint:** this doc does **not** propose URL changes — it describes **current** ownership.

---

## 1. Route group topology (Next App Router)

| Group | Path prefix (typical) | Auth / audience | Layout entry |
|-------|----------------------|-----------------|----------------|
| **`(marketing)`** | `/`, `/blog`, `/[locale]/…`, `/exams/…`, `/allied-health/…`, `/modules/…` | Public (per-route auth for tools) | `src/app/(marketing)/layout.tsx`, `(default)/layout.tsx`, `[locale]/layout.tsx` |
| **`(student)`** | `/app`, `/app/*` | Learner session + entitlements | `src/app/(student)/app/(learner)/layout.tsx` |
| **`(admin)`** | `/admin`, `/admin/*` | **Server** staff session + RBAC | `src/app/(admin)/admin/layout.tsx` |
| **`modules/`** (under `src/app`) | `/modules/ecg/*`, `/modules/lab-values/*` | Public marketing-style module sites | Nested `modules/*/layout.tsx` |
| **`internal/`** | `/internal/*` | Internal / staff tooling (not learner marketing) | `internal/layout.tsx` |

**Root `src/app/layout.tsx`:** wraps entire app shell (theme, providers).

---

## 2. Public vs learner vs admin (ownership matrix)

| Concern | Public (marketing) | Learner (`/app`) | Admin |
|----------|-------------------|------------------|-------|
| **Lesson article read** | Hub routes under `[locale]/[slug]/[examCode]/lessons/*` | `/app/lessons/[id]` (UUID / id) | `/admin/pathway-lessons/*` |
| **Flashcards** | Marketing flashcard landings | `/app/flashcards` + APIs | `/admin/ai/flashcards`, study cards |
| **Questions** | Some marketing “questions” landings | `/app/questions` + APIs | `/admin/questions`, AI drafts |
| **CAT / practice** | Marketing CAT landing pages | `/app/practice-tests/*`, exams | Diagnostics, blueprint sessions |
| **Blogs** | `/blog/*`, nested allied blog | (usually none — blogs are acquisition) | `/admin/blog/*` |
| **SEO** | `generateMetadata`, sitemaps | Learner routes often `noindex` or private cache — preserve existing cache headers | N/A |

---

## 3. Routing conventions and **known inconsistencies**

### 3.1 Duplicate “locale vs default” trees

Marketing exists under:

- **`(marketing)/(default)/…`** — default-locale URLs.  
- **`(marketing)/[locale]/…`** — explicit locale prefix.

**Risk:** duplicate implementations of similar pages (blog, tools, exams). **Policy:** when changing copy or metadata, check **both** trees or extract shared loaders (see `legacy-restoration-map.md` “change both” warning for Vite vs Next).

### 3.2 `modules/*` vs `(learner)/*`

ECG / lab **marketing modules** live under **`/modules/...`** while **learner labs** live under **`/app/labs/...`**. Different SoT (`labs-engine` vs static module pages). Do not assume one maps to the other 1:1.

### 3.3 Practice “exam” vs “test” naming

Two learner URLs; **one** `PracticeTest` backend (see system SoT doc). Inconsistent naming increases support load — document in UI copy, not by adding a second table.

### 3.4 Parallel CAT code trees

**`lib/exams/cat-engine`** (practice) vs **`lib/cat/*`** (study layer). Naming collision is easy for new contributors — treat as **separate bounded contexts** until a deliberate consolidation project exists.

### 3.5 Monolith (`client/`) vs Next

Vite SPA remains for parts of the ecosystem per `docs/legacy-restoration-map.md`. Next is production for marketing home + learner shell under `nursenest-core/`. **Do not** assume shared router state.

---

## 4. Generated vs manually authored (runtime-relevant)

| Asset | Generated? | Manual? |
|-------|--------------|---------|
| **Merged i18n JSON** | Yes — `npm run i18n:compile` | Sources in `tools/i18n` |
| **Pathway lesson indexes** | Yes — `generated-indexes/`, build scripts | Authored JSON + DB rows |
| **Blog posts (live)** | Optional AI pipeline | Human publish gate on `BlogPost` |
| **Lesson bodies (canonical)** | Import pipelines | **DB `PathwayLesson`** |
| **Labs corpus** | N/A | **TS modules** (`labs-engine`) |
| **ECG module pages** | N/A | **TSX pages** under `modules/ecg` |

---

## 5. Key integration boundaries

- **Auth:** NextAuth / session helpers in `src/lib/auth/*` — learner vs staff separation.  
- **Entitlements:** `resolve-entitlement-for-page`, `content-access-scope` — must stay server-side.  
- **DB access:** `prisma` client + `withDatabaseFallback` patterns on hot paths.  
- **Observability:** structured logs + Sentry server context on APIs.

---

## 6. Further reading

- `reports/system-source-of-truth.md`  
- `reports/critical-production-surfaces.md`  
- `reports/refactor-priority-list.md`  
- `docs/legacy-restoration-map.md`  
- `docs/i18n-architecture.md`


---

## 7. API boundary map (representative)

| Domain | Example routes | Notes |
|--------|----------------|-------|
| **Lessons (subscriber list)** | `GET /api/lessons` | Paginated; `ContentItem` list path for legacy list mode. |
| **Flashcards** | `GET /api/flashcards`, deck study routes | Subscriber-only backs. |
| **Practice sessions** | `POST /api/practice-tests`, follow-up session routes | Single creator for `PracticeTest`. |
| **Assets / i18n** | `GET /api/assets/i18n/*` | Fallback contract for monolith parity. |

Full enumeration belongs in a generated OpenAPI task — not duplicated here.
