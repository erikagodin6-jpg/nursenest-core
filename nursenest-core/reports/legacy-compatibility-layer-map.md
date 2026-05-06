# Legacy and compatibility layer map — NurseNest

**Scope:** `src/lib/legacy/*`, `legacy-marketing-routes.ts`, deprecated exports, Replit/monolith bridges, exam/content normalization. **Audit only.**

Each entry: **file/system** · **why risky** · **onboarding** · **runtime** · **SAFE_FOR_AI / DEV_ONLY** · **stabilization path**.

---

## 1. `src/lib/legacy/` — explicit legacy pipelines

| Area | Files (representative) | Purpose | Onboarding | Runtime | Tag | Stabilization |
|------|------------------------|---------|------------|---------|-----|---------------|
| **Exam questions import/merge** | `legacy-exam-question-merge.ts`, `legacy-exam-question-apply.ts` | Normalize old export rows → Prisma | High cognitive load | Wrong pool = data integrity | **DEV_ONLY** | Run only via documented admin scripts; keep contract tests |
| **Pathway lesson sections** | `legacy-pathway-lesson-section-merge.ts`, `legacy-pathway-lesson-apply.ts` | Map legacy blocks → pathway sections | High | Content shape bugs | **DEV_ONLY** | Prefer `PathwayLesson` loaders for new work |
| **Public content merge** | `legacy-public-content-merge.ts`, `legacy-public-content-pipeline.ts` | Staff import pipelines | Med | Publishing mistakes | **DEV_ONLY** | Surface registry (`admin-edit-publish-surface`) |
| **Lessons/practice export** | `legacy-lessons-practice-pipeline.ts`, `legacy-site-export-collector.ts` | Export/import tooling | Med | N/A offline tools | **DEV_ONLY** | Document CLI entrypoints in one README |
| **Blog import/recovery** | `legacy-blog-post-import-*.ts`, `legacy-blog-draft-recovery-*.ts` | Draft recovery / imports | High | SEO / duplicate posts | **DEV_ONLY** | Keep dry-run flags; never chain with prod without review |

---

## 2. Marketing route compatibility

| File | Purpose | Risk | Tag | Stabilization |
|------|---------|------|-----|---------------|
| `src/lib/legacy-marketing-routes.ts` | Maps old allied / lesson hrefs → current paths | Missing map → 404 for old bookmarks | **SAFE_FOR_AI** | Update when URL policy changes; test redirect matrix |
| `legacyCountryAlliedHealthMarketingRedirectDestination` (layout + hub) | Country-prefixed allied → global hub | Wrong redirect loop if edited wrong | **DEV_ONLY** | E2E smoke already referenced in tests |

---

## 3. Deprecated-but-exported APIs (compatibility shims)

| Symbol | Location | Replacement | Tag | Stabilization |
|--------|----------|-------------|-----|---------------|
| `safeExamHubMetadata` | `safe-marketing-metadata.ts` | `safeGenerateMetadata` + `marketing.exam_hub` | **DEV_ONLY** | Grep imports → migrate → remove |
| `buildAlliedHealthPathwayMarketingPath` pattern | `allied-global-pathway.ts` | `buildAlliedGlobalHubPath` (see **@deprecated**) | **DEV_ONLY** | Remove callers |
| `validatePublishRationaleLenient` (name per grep) | `publish-validation.ts` | `governExamQuestionPublish` | **DEV_ONLY** | Admin flows only |
| `normalizeLesson` (deprecated) | `pathway-lesson-catalog-sync.ts` | `normalizeLesson` successor per comment | **DEV_ONLY** | Internal catalog sync only — don’t expose |
| Motion / title-case / learner-shell **aliases** | various `src/lib/*` | Prefer non-deprecated names | **SAFE_FOR_AI** | Codemod when batch cleanup approved |
| `tests/marketing/forbidden-marketing-placeholders.ts` | Re-export for Playwright | Import path confusion | **SAFE_FOR_AI** | Point tests at `@/lib/validation/forbidden-production-text` |

---

## 4. Data model compatibility (not in `legacy/` folder)

| System | Why “compat” | Risk | Tag | Stabilization |
|--------|--------------|------|-----|---------------|
| **`exam-question-exam-normalization.ts`** | Legacy board strings → canonical storage enums | Wrong exam label in analytics | **DEV_ONLY** | Keep normalization table versioned; tests already exist |
| **`exam-question-bank-sql.ts`** | Published casing variants | Query drift | **DEV_ONLY** | Single source for status enum |
| **`blog-control-panel-generation.ts`** | `legacyCompatiblePlanner` / `legacyCompatibleBody` flags | Two generator behaviors | **DEV_ONLY** | Deprecate flag after pipeline unified |
| **`transform-med-math-lesson.ts`** | Imports `@legacy-client/data/lessons/types` | Monolith type coupling | **DEV_ONLY** | Copy minimal types or shared package when allowed |
| **`editorial-publish-policy.ts`** | “Content-item lessons (legacy JSON body)” | Dual publish gates | **DEV_ONLY** | Single policy table in docs |

---

## 5. Parallel stacks (architectural compatibility)

| System | Location | Risk | Tag | Stabilization |
|--------|----------|------|-----|---------------|
| **Vite `client/` + Next marketing** | `docs/legacy-restoration-map.md` | Duplicate hero/nav work | **DEV_ONLY** | Long-term convergence or explicit “do not sync” list |
| **`server/` Express-era modules** | repo root `server/` | Next vs monolith entitlements narrative | **DEV_ONLY** | Feature matrix row per new auth/billing change |
| **`home-restored-client.tsx`** | Wraps `src/legacy/marketing/*` | Lazy-load boundaries | **SAFE_FOR_AI** | Keep lazy imports when adding sections |

---

## 6. Temporary / ops-oriented code paths

| Location | Signal | Tag | Stabilization |
|----------|--------|-----|---------------|
| `lessons/page.tsx` — `RN_LESSONS_HUB_DIAGNOSTICS`, pipeline env flags | Diagnostic logging for ops | **DEV_ONLY** | Fold into structured metrics or admin-only tool |
| `env-diagnostics.ts` — `PROD_DATABASE_URL` warning | Legacy env detection | **SAFE_FOR_AI** | Already user-facing message — keep |

---

## 7. Acceptance

**Temporary compatibility layers**, **legacy pipelines**, **deprecated shims**, and **parallel architectures** are **mapped** with clear **risk / onboarding / runtime** notes and **stabilization** recommendations — **no code changes** in this audit.
