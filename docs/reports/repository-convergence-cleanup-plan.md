# Repository convergence cleanup plan (2026-05-10)

Governance-only notes — **no deletions** in the originating RC convergence task.

## Canonical paths

| Kind | Preferred location |
|------|--------------------|
| Curated screenshots / theme matrix | `docs/screenshots/` (git root) |
| Release status + convergence write-ups | `docs/reports/` (git root) |

## Secondary / historical trees

- `nursenest-core/docs/screenshots/` — package-local captures; when refreshing evidence, **prefer adding or copying into** root `docs/screenshots/` and link from one README to avoid parallel “sources of truth.”
- Runtime **`reports/`** (artifacts from tools) — not interchangeable with **`docs/reports/`**.

## Safe vs risky (future PRs)

- **Safe:** index READMEs, cross-links, additive screenshots.
- **Risky:** deleting or moving trees referenced by CI, Playwright snapshot paths, or open PRs; large moves bundled with product code.

## RC branch strategy

Short-lived branches off `main`; additive docs first; defer physical removal of legacy trees until after RC sign-off.

## See also

- [release-candidate-convergence-2026-05-10.md](./release-candidate-convergence-2026-05-10.md)
- [release-hardening-status-2026-05-10.md](./release-hardening-status-2026-05-10.md)
- [release-reconciliation-2026-05-10.md](./release-reconciliation-2026-05-10.md)
