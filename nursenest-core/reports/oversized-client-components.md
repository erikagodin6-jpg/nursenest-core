# Oversized client components — NurseNest (audit only)

**Metric:** Line count (`wc -l`) as a **proxy for bundle complexity** (not gzipped kB). Heavier imports increase **parse + hydrate** cost. **No bundle graph** was generated in this audit.

---

## Tier S — Extreme (>2500 lines)

| Lines (approx) | Path | Role | Transitive hot spots (from imports) | Category |
|----------------|------|------|--------------------------------------|------------|
| **~3118** | `src/components/student/practice-test-runner-client.tsx` | CAT / linear practice session runner | `StudyPlan`, `SmartReviewLayout`, `ConfidenceSelector` + analytics, `EcgVideoQuestionMedia`, `PracticeRationaleFullPanel`, CAT question card, exam shell, fetch/retry, teaching review | DEV_REVIEW |
| **~2858** | `src/components/admin/admin-blog-control-panel-client.tsx` | Blog ops UI | Admin dialogs, media picker, large inline state | DEVELOPER_ONLY |

---

## Tier A — Very large (1500–2500 lines)

| Lines (approx) | Path | Category |
|----------------|------|----------|
| **~1897** | `src/components/student/question-bank-practice-client.tsx` | DEV_REVIEW |
| **~1511** | `src/components/student/practice-tests-hub-client.tsx` | DEV_REVIEW |

---

## Tier B — Large (800–1500 lines)

| Lines (approx) | Path | Category |
|----------------|------|----------|
| **~1173** | `src/components/layout/site-header.tsx` | SAFE_FOR_AI |
| **~898** | `src/components/study/study-plan.tsx` | DEV_REVIEW |
| **~568** | `src/components/marketing/marketing-practice-questions-hub-client.tsx` | SAFE_FOR_AI |

---

## Tier C — Notable “wide” `use client` surfaces

| Path | Note |
|------|------|
| `src/components/ui/study-card.tsx` | **Client** study card used widely — any page importing it pulls client JS for **all** hub/list consumers. |
| `src/components/study/premium-gate.tsx` | Large paywall / lock UI — many study surfaces. |
| `src/components/student/subscription-paywall.tsx` | Full-page paywall — fewer imports but dense UI. |
| `src/content/pre-nursing/modules/*.tsx` | Many **client** lesson modules — cumulative size on pre-nursing routes. |
| `src/legacy/marketing/*.tsx` | Legacy marketing blocks still `use client` — audit for dead weight on homepage. |

---

## Giant JSON (not components, but payload-adjacent)

See `route-payload-ranking.md` §A. Largest files **exceed 10 MiB**; they must never be bundled for browser. `lesson-library.json` ~4.7 MiB is called out in tests as **catastrophic** if imported on hub renders.

---

## Bundle impact (qualitative)

| Factor | Effect |
|--------|--------|
| Single 3k-line module | Large **single chunk**; hard for bundler to tree-shake unused branches if statically imported. |
| Lucide icon imports | `practice-test-runner-client` imports multiple icons — consider **lazy** icon subsets in future refactors (audit only). |
| `useMarketingI18n` inside giant clients | Ties runner/question UI to **marketing i18n** client bundle path — watch duplication with learner-only copy. |

---

## Suggested canonical split points (for future work — not executed)

1. **`practice-test-runner-client`:** `LinearRunner` / `CatRunner` / `ResultsView` lazy boundaries.  
2. **`admin-blog-control-panel-client`:** feature tabs as separate dynamic imports.  
3. **`question-bank-practice-client`:** session vs setup vs review panels.

---

## Verification commands (optional, out of scope)

- `ANALYZE=true next build` or `@next/bundle-analyzer` — actual kB.  
- `node scripts/audit-runtime-payloads.mjs` — JSON + `src/app` import isolation (already green in this clone).
