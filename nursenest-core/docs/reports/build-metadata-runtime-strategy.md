# Build Metadata Runtime Strategy

Generated: 2026-05-10

## Goal

Make every deployed build diagnosable without copying `.git` into the Docker image or exposing secrets. The runtime surfaces remain public-safe and cache-bypassing so deployment drift, CDN cache questions, and screenshot provenance can be checked quickly.

## Metadata Shape

`public/nn-build-meta.json` now writes:

```json
{
  "commit": "...",
  "branch": "...",
  "recordedAt": "...",
  "environment": "production",
  "buildPlatform": "digitalocean",
  "source": "env:DIGITALOCEAN_GIT_COMMIT_SHA"
}
```

The legacy `/api/version` fields (`ok`, `commit`, `branch`, `recordedAt`) remain present. The response now also includes `environment`, `buildPlatform`, `deploymentMode`, `runtimeEnvironment`, and `source`.

## Source Resolution Order

Commit resolution checks local git first when available, then public CI/deploy metadata envs:

- `SOURCE_COMMIT`
- `SOURCE_VERSION`
- `DIGITALOCEAN_GIT_COMMIT_SHA`
- `GITHUB_SHA`
- `VERCEL_GIT_COMMIT_SHA`
- `COMMIT_SHA`
- `NN_GIT_COMMIT_SHA`

Branch resolution uses local git when it is not detached, then:

- `SOURCE_BRANCH`
- `DIGITALOCEAN_GIT_BRANCH`
- `GITHUB_REF_NAME`
- `VERCEL_GIT_COMMIT_REF`
- `BRANCH_NAME`
- `NN_GIT_BRANCH`

Detached `HEAD` is treated as unknown and can be filled by branch env metadata.

## DigitalOcean Docker Behavior

The Dockerfile now declares public git metadata `ARG`s and passes them into the build environment so `scripts/write-build-git-meta.mjs` can use App Platform or CI-provided values even though `.dockerignore` excludes `.git`. These values are public commit/branch identifiers only; secret runtime envs are not added to build metadata or logged.

## Runtime Endpoints

- `/api/version`: compatibility endpoint, expanded with public-safe diagnostics.
- `/api/runtime/version`: explicit deployment diagnostic endpoint with the same payload.

Both endpoints use `runtime = "nodejs"`, `dynamic = "force-dynamic"`, and `Cache-Control: no-store`.

## Verification

- `node --test scripts/write-build-git-meta.test.mjs` covers DigitalOcean envs, GitHub Actions envs, detached HEAD fallback, and no-git/no-env behavior.
- `node --import tsx --test src/lib/build/runtime-version.test.ts` covers the public runtime payload shape and missing metadata fallback.

## Rollback

Rollback is low risk: revert `scripts/write-build-git-meta.mjs`, `src/lib/build/runtime-version.ts`, `/api/version`, `/api/runtime/version`, and the Docker metadata `ARG`/`ENV` block. This affects diagnostics only and does not alter routing, auth, entitlement, SEO, or learner UX behavior.
