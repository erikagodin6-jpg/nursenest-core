# Standalone Runtime i18n Hardening — 2026-05-11

## Summary

Standalone deployment i18n asset audit, path-resolution hardening, and build-time verification pass. Server islands and shard loaders are now resilient across Docker, non-Docker standalone, and environments where `process.cwd()` differs from the package root.

---

## Standalone Asset Packaging Findings

### Docker Deployment (Primary — DigitalOcean App Platform)

**Status: CORRECT before this pass.**

The `Dockerfile` runner stage already explicitly copies `public/` into the runtime image:
```dockerfile
COPY --from=builder /app/nursenest-core/public ./public
```

The standalone server is spawned with `cwd: pkgRoot` = `/app/nursenest-core`. The i18n shard loader uses `process.cwd()/public/i18n` = `/app/nursenest-core/public/i18n` ✓.

### Non-Docker Standalone Deployments

**Status: Improved by this pass.**

For raw standalone deployments (Railway bare metal, CI smoke runners without Docker), the `public/i18n` directory must be placed adjacent to the package root or inside the standalone server directory. Without the Dockerfile `COPY`, this was not guaranteed.

**Fix applied:** New `scripts/ensure-standalone-public.mjs` copies `public/i18n` into each discovered standalone `server.js` directory as a belt-and-suspenders step.

### Runtime Path Assumptions

**Status: Hardened by this pass.**

The shard loader (`load-marketing-message-shards.ts`) previously used a single `process.cwd()/public/i18n` path. This is correct for Docker but fragile for non-Docker environments. The loader now tries three candidate roots in order:

1. `process.cwd()/public/i18n` — primary (Docker, standard node invocations)
2. `__dirname`-relative path — stable absolute from the compiled module's location
3. `.next/standalone/nursenest-core/public/i18n` — populated by `ensure-standalone-public.mjs`

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/marketing-i18n/load-marketing-message-shards.ts` | Multi-root resolution, once-cached dir lookup, diagnostic stderr logging |
| `scripts/ensure-standalone-public.mjs` | **New** — copies `public/i18n` into each standalone server directory |
| `scripts/verify-standalone-artifact.mjs` | Added `verifyPublicI18nArtifact()` with hard-fail package-root check and warn-only standalone-adjacent check |
| `package.json` | Added `ensure-standalone-public.mjs` to `build:deploy:postbuild` pipeline |
| `src/lib/marketing-i18n/standalone-i18n-runtime.contract.test.ts` | **New** — 14 standalone i18n and reliability contracts |
| `package.json` (test:homepage) | Added new contract test file to `test:homepage` suite |

---

## Reliability / Fail-Soft Changes

### A. `load-marketing-message-shards.ts` — Multi-Root Resolution

**Before:** Single-path resolution: `process.cwd()/public/i18n`. If `cwd` is wrong or files are missing, the loader returns `{}` silently.

**After:**
1. Tries three candidate paths in priority order (cwd, module-relative, standalone-adjacent)
2. Resolves exactly once at module load time — cached in `_resolvedI18nDir` to avoid per-request `existsSync` overhead
3. Emits a single actionable `process.stderr.write` message when no candidate is found:
   ```
   [nn-i18n] public/i18n not found at any candidate path. Shard loading will use English defaults.
   ```
4. Still returns `{}` (never throws) — fail-soft contract preserved

### B. `ensure-standalone-public.mjs` — Explicit Asset Copy

**New script** that:
1. Discovers all standalone `server.js` paths via `discoverStandaloneServerJsPaths()`
2. Copies `public/i18n` into `<serverDir>/public/i18n/` for each discovered server
3. Validates file counts match source after copy
4. Logs actionable output per asset per server
5. Warns (does not fail) when no standalone servers exist yet (build-only environment)

**Integrated into `build:deploy:postbuild`** after `ensure-standalone-static.mjs`.

### C. `verifyPublicI18nArtifact()` — Build-Time Verification

Added to `verify-standalone-artifact.mjs`:
- **Hard fail** if `public/i18n/en/` is missing from the package root (i18n compilation pipeline did not run)
- **Hard fail** if `public/i18n/en/` is empty
- **Warn-only** if standalone-adjacent `public/i18n/en/` is missing (Docker deployments are not affected)
- Called in the `isDirectRun` block so it runs during `npm run verify:standalone-artifact` in production builds

---

## Locale / Runtime Verification

### English (en)

- `public/i18n/en/` — 11 shard files ✓
- Required shards (`nav`, `brand`, `pages`, `marketing`) — all present and non-empty ✓
- `pages.home.premium.*` keys — present in `pages.json` ✓

### French (fr)

- `public/i18n/fr/` — exists ✓
- At least 1 shard file ✓
- Homepage routes under `/fr/` render with French i18n context via `MarketingI18nProvider` ✓

### International RN Markets

- `public/i18n/en/marketing.json` — contains `intlNursing.intlRn.*` keys for UK, AU, PH, IN, NG, SA ✓ (added in previous pass)
- International RN hub copy resolves via `intl-rn-pathway-hub-copy.ts` using loaded messages ✓

### Allied / Public Marketing Locales

- Multiple locales under `public/i18n/`: ar, de, es, hi, id, ja, ko, pt, ru, tl, vi, zh, zh-tw, etc.
- All fail-soft: if a locale shard is missing, falls back to English defaults ✓

---

## Runtime Path Assumptions (Documented)

| Context | `process.cwd()` | `public/i18n` path | Status |
|---|---|---|---|
| Docker (DigitalOcean App Platform) | `/app/nursenest-core` | `/app/nursenest-core/public/i18n` | ✓ Correct (Dockerfile COPY) |
| Docker + new script | `/app/nursenest-core` | + `…/standalone/nursenest-core/public/i18n` | ✓ Belt-and-suspenders |
| Non-Docker standalone | Varies | Falls through to standalone-adjacent | ✓ Covered by new copy step |
| CI/test environment | Repo root | `<repo>/nursenest-core/public/i18n` | ✓ Covered by module-relative path |

---

## Diagnostics / Logging Added

### Shard Loader Diagnostic (once per process start)

When no i18n root candidate is found, `process.stderr.write` emits:
```
[nn-i18n] public/i18n not found at any candidate path. Shard loading will use English defaults. Searched: [<paths>]
```

This is:
- Emitted exactly once (cached resolution)
- Actionable (shows searched paths)
- Safe (no secrets, no PII)
- Non-blocking (never throws, never delays the render)

### Build Verification Output

`verifyPublicI18nArtifact()` logs:
```
[i18n-artifact] package-root public/i18n/en/ OK: 11 shard(s) at /path/to/public/i18n/en
[i18n-artifact] standalone-adjacent public/i18n/en/ OK: 11 shard(s) at /path/to/.next/standalone/.../public/i18n/en
```

Or warns when standalone-adjacent is missing (Docker is unaffected):
```
[i18n-artifact] WARN: standalone-adjacent public/i18n/en/ missing: /path/...
  Run `node scripts/ensure-standalone-public.mjs` after `next build`.
  Docker deployments are unaffected (Dockerfile COPY handles public/).
```

---

## Tests / Contracts Added

**`src/lib/marketing-i18n/standalone-i18n-runtime.contract.test.ts`** — 14 tests:

| Test | Guards Against |
|---|---|
| `public/i18n/en/` exists with required shard files | Missing i18n compilation output |
| Contains nav, brand, pages, marketing shards | Critical shards missing |
| `public/i18n/fr/` exists (French locale) | French locale fallback degradation |
| `pages.json` contains `pages.home.premium.*` keys | Server islands missing copy keys |
| Shard loader uses multi-root resolution | Single-path fragility |
| Shard loader emits diagnostic log (not throws) when missing | Silent degradation |
| Shard loader caches resolved dir (once, not per-request) | Per-request existsSync overhead |
| `ensure-standalone-public.mjs` exists and targets i18n | Missing belt-and-suspenders script |
| `build:deploy:postbuild` includes ensure-standalone-public | Copy step not in pipeline |
| ensure-standalone-public runs AFTER ensure-standalone-static | Wrong order in pipeline |
| `verify-standalone-artifact.mjs` exports verifyPublicI18nArtifact | Missing verification function |
| verifyPublicI18nArtifact is called in main block | Verification not actually running |
| Server island loader imports correct module | Wrong-module import silent failure |
| Homepage uses Promise.allSettled everywhere | Cascade rejection causing 504 |

---

## Verification Results

```
npm run test:homepage    → 140/140 pass (was 126 at start of this session)
typecheck:critical       → 0 errors
```

---

## Remaining Deployment Risks

### Risk 1: First Deploy After Module Addition

On the first production deploy after these changes, the new `load-marketing-message-shards.ts` module code runs with `__dirname` set to the compiled location inside the standalone bundle. The module-relative path `path.resolve(__dirname, "../../../../public/i18n")` navigates 4 directories up from the compiled module location. This path needs verification in a real production build to confirm it reaches `public/i18n`.

**Mitigation:** The CWD-based primary path is sufficient for Docker deployments. The module-relative path is belt-and-suspenders. The shard loader always returns `{}` if no path works.

### Risk 2: Non-Docker DigitalOcean Deployments (Buildpack Mode)

If DigitalOcean App Platform is configured in buildpack mode (not Docker), the `Dockerfile` is not used. In that case, `public/i18n` availability depends on the platform's file system layout. The multi-root resolution in the loader reduces risk but cannot guarantee path correctness without platform-specific testing.

**Recommendation:** Confirm Dockerfile-based builds in the DigitalOcean App Platform spec.

### Risk 3: `ensure-standalone-public.mjs` File Count Mismatch on Large Locale Additions

The script validates file counts after copying. If a new locale is added to `public/i18n` but the copy somehow misses files, the count mismatch throws and fails the build. This is intentional (fail loudly rather than silently ship incomplete i18n).

---

## Recommended Future Operational Safeguards

1. **Add `public/i18n/en/` existence to railway.toml / app.yaml health probes** — Fail deployment if the directory is empty at runtime startup.

2. **Add smoke test in `start-standalone.mjs`** — Before starting the standalone server, check that `public/i18n/en/nav.json` exists. If missing, log a warning but continue (do not block the server from starting).

3. **CI pipeline assertion** — Add `npm run verify:standalone-artifact` as an explicit CI step after `npm run build:deploy` so the i18n verification runs on every pull request.

4. **Locale smoke test in production verification script** — Extend the production verification to `curl /fr` and assert the response contains a French nav label (e.g., "Se connecter") to confirm i18n is actually working, not just returning English fallbacks.

5. **Monitor "Shard loading will use English defaults" in production logs** — Any occurrence of this log line indicates a runtime path mismatch that should be investigated. Add an alert in the DigitalOcean monitoring dashboard for this string.
