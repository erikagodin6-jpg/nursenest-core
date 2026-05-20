# History remediation (large files and secrets)

If something that should never have been committed is **already in Git history**, deleting the file in a new commit is **not enough**: clones and forks still contain the old blobs.

## When to rewrite history

- **Secrets** were committed (even once): rotate the credential immediately, then remove from history.
- **Large or sensitive blobs** (dumps, exports, private keys) were committed and you need to shrink the repo or meet compliance.

## Preferred tools

- **[git-filter-repo](https://github.com/newren/git-filter-repo)** (recommended): flexible, well maintained.
- **[BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)**: simple for file removal.

## Example: remove a path from all history

After **backing up the repo** and coordinating with the team (everyone must re-clone or hard-reset):

```bash
# Using git-filter-repo (install from your package manager or pip)
git filter-repo --path scripts/english-content.json --invert-paths
```

Then **force-push** `main` only with org-wide agreement. Open PRs will need to be rebased.

## After rewriting

- Invalidate and rotate any exposed secrets.
- Ask collaborators to **re-clone** or follow your documented reset procedure.
- Consider a one-time **GitHub support** cache clear only if GitHub still serves removed objects in edge cases (rare for normal rewrites).

## Prevention

Follow `docs/REPO_COMMIT_POLICY.md` and keep **`repo-hygiene`** required on `main`.
