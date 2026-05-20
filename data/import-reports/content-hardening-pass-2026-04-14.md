# Content & localization hardening pass — implementation report

**Date:** 2026-04-14  
**Scope:** Evidence-driven batch planning and targeted UI i18n; no new regions, routes, SEO URLs, pricing, entitlements, or auth flow changes.

---

## Part 1 — E-E-A-T remediation batch

**Sources:** `data/audit/eeat-page-scores.json`, `eeat-completion-queue.json`, `eeat-final-status.json`, `eeat-final-status.json` priorities, `topical-clusters.json`, `content-freshness.json`, `/admin/eeat-editorial`.

**Deliverable:** `data/import-reports/eeat-remediation-batch-plan.json`

- **First 100** IDs from `prioritized` in `eeat-completion-queue.json` (operational order aligned with the admin dashboard).
- **Grouped by root cause** (counts in JSON):
  - **T1** — `structure_incomplete` + `internal_links_low` (pathway lessons): systematic spine + link backfill.
  - **T2** — `structure_incomplete` only.
  - **T3** — `internal_links_low` only (dominant bucket in this slice: 64).
  - **T4** — `thin_programmatic` on `seo:*` slugs: editorial expand/consolidate; **no auto-generated replacement copy** in this pass.

**Evidence snapshot (from `eeat-final-status.json`):** 601 pages scored; 547 below 70; 538 internal-link gaps; programmatic SEO: 39 slugs, 26 thin flags; ranking readiness `moderate_needs_content_ops`.

**Highest-priority queues (conceptual):** lowest scores + thin + stale + missing attribution + missing links — the completion queue already merges score + flags; stale/missing-attribution rows are additionally visible in `eeat-page-scores.json` flags and `content-freshness.json` for blog samples.

**Not done in this pass:** Automated copy generation; per-page edits in content files.

---

## Part 2 — User-surface localization hardening

**Sources:** `translation-gaps-by-namespace.json`, `hardcoded-ui-strings-nursenest-core-user-surfaces.json`, `i18n-missing-keys.json`, `public/i18n/educational-overlays/`.

**Honest limitation:** Educational lesson/question/flashcard **body** text remains largely English outside overlay files; this pass does **not** claim full translation of educational content.

**Code + keys (this pass):**

| Area | Change |
|------|--------|
| **Auth — trial blocked card** | `trial-blocked-card.tsx` uses `useMarketingI18n` + `auth.trialBlocked.*` keys. |
| **Auth — email verification banner** | `email-verification-banner.tsx` uses `auth.emailVerification.*` keys. |
| **Canonical English** | New keys in `tools/i18n/marketing/marketing-en.json`; `npm run i18n:compile` run so merged JSON includes them. |

**Strategic overlays:** Not expanded in this pass (low-risk batch would target `fr`/`es`/`tl` overlays per existing pipeline — document as follow-up).

**Admin:** Unchanged (only shared auth components).

---

## Part 3 — Restoration priority execution (plan only)

**Sources:** `restoration-priority-queue.json`, `parity-final-status.json`, `parity-registry-lesson-snapshot.json`, `unimported-legacy-content.json`.

**Evidence highlights:**

- **Tier 1 nursing-first:** Pathway lessons, questions, flashcards (per restoration queue tiers).
- **Parity summary:** 13 pathways in registry; ~906 catalog lesson rows; **4084** legacy lesson keys not matched to current snapshots; **523** approx. high-quality missing lessons; structural incomplete lessons **633** (gate from lesson audit).
- **Ready-to-import samples** listed under `lessonAnalysisGroups.readyToImport` in `unimported-legacy-content.json` (evidence-backed IDs/titles — not executed here).

**Implementation-ready batch principles (no broad speculative import):**

1. Chunked imports with `import-reports/*.json` checkpoints (per repo rules).
2. Prefer **ready_to_import** + **master map / catalog alignment** before ad-hoc slug mapping.
3. Nursing tiers (RN/PN/NP) before allied in priority ordering when choosing batches.

---

## Part 4 — Mobile follow-up validation

**Sources:** `mobile-ux-audit.json`, `import-reports/mobile-ux-fixes.json`.

**Remaining limitations (from fixes report):**

| Item | Triage |
|------|--------|
| No automated visual regression | Process/tooling — not a shared component one-liner. |
| Tables/filters not exhaustively restyled | Often **page-level**; shared fix: `overflow-x-auto` + `min-w-0` parents where missing. |
| Desktop mega-menu unchanged | Intentional; mobile uses hamburger. |

**This pass:** No additional mobile code changes (prior pass already touched header, context bar, learner shell, drawer). Further work = selective page audits at 320–414px.

---

## Part 5 — Validation

| Check | Result |
|-------|--------|
| `npm run i18n:compile` (repo root) | **Pass** after `marketing-en.json` edits. |
| ESLint on touched TSX | **Pass** (see IDE diagnostics). |
| Full repo `tsc` | May still fail in **unrelated** tests/libs — treat as pre-existing; run before merge if your branch gates on full typecheck. |

---

## Files changed (this pass)

| File | Type |
|------|------|
| `tools/i18n/marketing/marketing-en.json` | Content — new `auth.emailVerification.*`, `auth.trialBlocked.*` keys. |
| `nursenest-core/src/components/auth/trial-blocked-card.tsx` | UI — i18n wired. |
| `nursenest-core/src/components/auth/email-verification-banner.tsx` | UI — i18n wired. |
| `nursenest-core/public/i18n/*.json` (merged) | Generated by `i18n:compile` |
| `data/import-reports/eeat-remediation-batch-plan.json` | **New** — E-E-A-T batch plan. |
| `data/import-reports/content-hardening-pass-2026-04-14.md` | **New** — this report. |

---

## Top issues addressed vs remaining

| Addressed | Remaining (highest priority) |
|-----------|-------------------------------|
| Operational 100-page E-E-A-T batch plan grouped by template | Execute spine + internal-link backfill in content pipelines |
| Auth trial / email verification strings in i18n bundle | More hardcoded strings in `hardcoded-ui-strings-nursenest-core-user-surfaces.json` (large backlog) |
| Compile-safe key addition | Locale overlays for new `auth.*` keys (non-en may show English until translated) |
| | Restoration: chunked imports from `readyToImport` + catalog alignment |
| | Educational overlays for non-strategic locales |
| | Mobile page-level tables / lesson-question UIs |

**UI-only vs content:** UI-only = auth components + i18n keys. Content/restoration = E-E-A-T and legacy plans remain **documentation + JSON plans** until editorial/import batches run.
