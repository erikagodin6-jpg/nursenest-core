# Branch protection (assumptions)

Configure these on **`main`** in GitHub **Settings → Branches → Branch protection rules** (or rulesets). Exact names depend on your org; adjust to match the checks that appear on pull requests.

## Recommended settings

1. **Require a pull request before merging**  
   - Require approvals (at least one), or more for sensitive repos.  
   - Optionally **Dismiss stale pull request approvals** when new commits are pushed.

2. **Require status checks to pass**  
   Enable at least:
   - **`repo-hygiene / hygiene`** — verifies **`docs/ENGINEERING_POLICY.md`**, then Gitleaks, tracked large files, secret-pattern scan, **forbidden paths**, **content JSON import allowlist**, **no client pathway JSON**, and a **soft catalog size** warning (`.github/workflows/repo-hygiene.yml`). Pick the exact name from the PR “Checks” tab after the first run.

   Also keep any existing required checks your team already relies on (typecheck, tests, deploy previews, etc.).

3. **Require branches to be up to date** before merge (recommended for teams).

4. **Restrict who can push** to `main` (optional but typical: only via PR).

5. **Require linear history** or **squash merge** (team choice); document in your contributing guide.

## Code owners (optional)

If you add real patterns to `.github/CODEOWNERS` (see `docs/CODEOWNERS.template`), you may enable **Require review from Code Owners** for paths that matter (e.g. API routes, auth, payments).

## Notes

- Repository policy: **`docs/ENGINEERING_POLICY.md`**. Secret scanning uses **Gitleaks** with `.gitleaks.toml`, plus a **high-confidence pattern** scan on tracked files. Env/secrets detail: `nursenest-core/docs/SECRETS_AND_ENV.md`. Enable **Secret scanning** and **Push protection** in repository settings when available.
- Large files are blocked by `scripts/ci/check-tracked-large-files.mjs` except documented exemptions in `docs/REPO_COMMIT_POLICY.md`.
