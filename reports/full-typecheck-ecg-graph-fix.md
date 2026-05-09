# Full TypeScript check — ECG graph restore (isolated branch)

**Date:** 2026-05-09  
**Hostname:** nursenest-vm  
**Base:** `origin/main` @ `13597d6fd`  
**Isolated branch:** `fix/full-typecheck-ecg-graph-isolated`  
**Original cherry-pick:** `f5ae47ca9` (`fix(ecg): restore full typecheck graph`)  
**Backup (pre-isolation):** local branch `backup/fix-full-typecheck-ecg-graph-pre-isolation` points at prior `fix/full-typecheck-ecg-graph` tip (not force-pushed).

## Commits on isolated branch (newest first)

| SHA | Message |
| --- | --- |
| `510082d44` | fix(ecg): align catalog test count and export ECG shell nav helper |
| `1ced8489b` | docs(ecg): narrow graph recovery report scope (removed `reports/release-control-incident-2026-05-08.md`) |
| `a0d1625b0` | fix(ecg): restore full typecheck graph (cherry-picked from `f5ae47ca9`) |

## File scope

- **ECG sources:** `nursenest-core/src/lib/ecg/**`, `nursenest-core/src/components/ecg/**`
- **Nav helper (minimal Option A):** `nursenest-core/src/lib/navigation/learner-primary-nav.ts` — adds `buildOptionalEcgShellNavItem` + `ECG_SHELL_NAV_ID` so `ecg-nav-policy.test.ts` resolves on `main` graph
- **Report:** `reports/full-typecheck-ecg-graph-fix.md` (this file)
- **Removed from cherry-pick scope for narrow PR:** `reports/release-control-incident-2026-05-08.md` (deleted on isolated branch)

## Validation (executed from `nursenest-core/` app package)

| Check | Result |
| --- | --- |
| `npm run typecheck:critical` | **PASS** (exit 0) |
| Full graph `npx tsc -p tsconfig.json --noEmit --pretty false` | **FAIL** (exit 2) — **7** unrelated errors; **no** matches for `grep -E "TS6053|ecg-rhythm-strip|ecg-catalog|ecg-rhythm-svg"` on `/tmp/full-tsc-ecg-graph.txt` |
| `node --import tsx --test` (ECG tests: access, catalog-scope, nav-policy, pn-guard, rhythm-svg) | **PASS** — **15** tests, **0** failed |

### Full `tsc` grep (ECG / missing-file signals)

```
(no matches — TS6053 / ecg-rhythm-strip / ecg-catalog / ecg-rhythm-svg not present in output)
```

### Unrelated full-graph `tsc` errors (complete list from `/tmp/full-tsc-ecg-graph.txt`, 7 lines)

```
src/components/student/learner-study-modes-band.tsx(104,9): error TS2322: Type '"dashboard_study_modes_grid"' is not assignable to type 'StudyLoopCatSurface'.
src/components/ui/premium-loader/use-delayed-loading.ts(27,7): error TS2322: Type 'number' is not assignable to type 'Timeout'.
src/lib/ai/blog-ai-provider.ts(113,19): error TS18048: 'resp.choices' is possibly 'undefined'.
src/lib/blog/blog-generation-jobs.ts(304,27): error TS2345: Argument of type '(batch: { ... }, opts?: SerializeJobOpts | undefined) => BlogGenerationJobPayload' is not assignable to parameter of type '(value: { ... }, index: number, array: ...) => BlogGenerationJobPayload'.
src/lib/theme/theme-registry.ts(170,38): error TS2345: Argument of type 'string' is not assignable to parameter of type '"ocean"'.
```

*(blog-generation-jobs line truncated in capture; see full log on runner at `/tmp/full-tsc-ecg-graph.txt`.)*

## Out of scope for this PR

- Fixing unrelated full-graph errors above (learner study modes, premium loader timer typing, blog AI, blog jobs serializer, theme registry).
- Wiring `buildOptionalEcgShellNavItem` into `learner-shell-primary-nav.tsx` (not required for restored typecheck graph / unit tests; optional follow-up).
- `fix/full-typecheck-ecg-graph` (7-commit branch): preserved via backup branch; **no force-push** applied.

## Stashes (local agent session)

- `stash@{0}` or similar: `TEMP before isolated ECG branch recreation` — saved unrelated WIP before branch work.
- Additional stashes may exist for hotfix/docs branches; see `git stash list`.

## Merge recommendation

Merge **`fix/full-typecheck-ecg-graph-isolated`** after review. Treat full `tsc` failures as pre-existing blockers outside ECG scope unless CI gates on full graph.
