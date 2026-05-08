# Release control incident — main direct pushes (2026-05-08)

**Repo:** `/root/nursenest-core`  
**Remote:** `origin` → `git@github.com:erikagodin6-jpg/nursenest-core.git`  
**Audit time:** after `git fetch origin --prune` on 2026-05-08

## Latest `origin/main` at audit

| Field | Value |
|--------|--------|
| **HEAD** | `13597d6fd` — `docs(prenursing): complete audit, HTML previews, and generator` |

## Direct pushes / commits reviewed

### `c152661e1` — `fix(marketing): keep gated module URLs out of public allied hub data`

**Files:** `nursenest-core/src/lib/marketing/allied-hub-route-smoke.test.tsx`, `nursenest-core/src/lib/marketing/allied-pathway-hub-overview.ts`, `nursenest-core/src/lib/modules/hidden-module-preview.test.ts`

**Risk:** Low — gated learner URLs removed from public allied hub data; hidden-module nav scan excludes test/spec sources.

**Recommendation:** **ACCEPT**

### `673f36d0b` — `fix(ui): theme routing, learner i18n, and palette contract tests`

**Files:** `nursenest-core/public/i18n/en/learner.json`, `nursenest-core/scripts/capture-modules-ui-previews.mjs`, `nursenest-core/src/components/layout/global-context-switcher.tsx`, `nursenest-core/src/lib/theme/premium-palettes.contract.test.ts`, `reports/theme-token-consistency-audit.md`

**Risk:** Medium — learner i18n + theme routing + new capture script.

**Recommendation:** **NEEDS REVIEW**

### `12bc02714` — `Merge branch 'hotfix/public-site-keys-theme-routing' into main`

**Files (merge diff ^1..^2):** same six paths as hotfix bundle (learner.json, prenursing audit, capture script, global-context-switcher, premium-palettes test, theme-token audit).

**Risk:** Medium.

**Recommendation:** **NEEDS REVIEW**

### `218bfafac` — `docs(prenursing): add audit docs and preview capture README`

**Files:** `nursenest-core/docs/prenursing-figma-redesign-summary.md`, `nursenest-core/docs/prenursing-modules-lessons-quizzes-audit.md`, `nursenest-core/preview-screenshots/prenursing/README.md`

**Risk:** Low.

**Recommendation:** **ACCEPT**

### `13597d6fd` — `docs(prenursing): complete audit, HTML previews, and generator` *(HEAD at audit)*

**Files:** 30 paths (audit updates, static HTML under `preview-screenshots/prenursing/` and `reports/ui-redesign-preview/prenursing/`, `nursenest-core/scripts/gen-prenursing-preview-html.py`).

**Risk:** Medium–high for process (volume); review artifact policy.

**Recommendation:** **NEEDS REVIEW**

## Summary

- **Freeze `main`:** no further direct pushes; PR + checks.
- **Revert:** not advised for marketing/docs-only commits unless policy requires removing prenursing artifacts (`13597d6fd`).
