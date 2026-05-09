# Playwright local workflow (NurseNest)

Canonical locations:

| Role | Path |
|------|------|
| **Git repository root** | `/root/nursenest-core` (clone root; `origin` remote, `main` branch for upstream truth) |
| **Next.js app root** (install, `next`, Playwright, scripts) | `/root/nursenest-core/nursenest-core` |

Unless a command explicitly says otherwise, run Playwright and npm scripts from the **Next app root**:

```bash
cd /root/nursenest-core/nursenest-core
```

Deeper runtime modes (standalone vs dev, port probes, `wait:app:ready` examples) live in the app tree: [`nursenest-core/docs/runtime/local-runtime-modes.md`](../../nursenest-core/docs/runtime/local-runtime-modes.md). This document focuses on **Playwright + local Next** and cross-links there to avoid duplicating long env tables.

---

## Correct dev command for App Router E2E

**Use `npm run dev:next` (or `npm run dev:next:3000`) for anything that hits the Next.js App Router.**

**Do not use `npm run dev` for Playwright or hub QA.** In this package, `npm run dev` starts `server/index.ts` (the legacy/monolith Express-style entry). That process is **not** the Next dev server Playwright expects on `:3000` for marketing and `/app` routes. Using it causes wrong port, missing routes, or tests that appear “flaky” because the HTTP listener is the wrong stack.

---

## Starting the app for E2E

**Interactive / default port (may shift to 3001 if 3000 is busy):**

```bash
cd /root/nursenest-core/nursenest-core
npm run dev:next
```

**Pinned `127.0.0.1:3000` (recommended for Playwright + screenshots):** fails fast if the port is taken instead of silently moving to 3001.

```bash
cd /root/nursenest-core/nursenest-core
npm run dev:next:3000
```

Pre-Nursing hub config uses `dev:next:3000` internally so local port matches `PLAYWRIGHT_BASE_URL` defaults.

---

## Readiness before tests (`wait-for-app-ready`)

Strict HTTP **200** checks (and optional `/api/auth/csrf`) are implemented in:

```text
nursenest-core/scripts/qa/wait-for-app-ready.mjs
```

(Path is relative to **git root**; from app root it is `scripts/qa/wait-for-app-ready.mjs`.)

**npm script (from app root):**

```bash
cd /root/nursenest-core/nursenest-core
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run wait:app:ready
```

Same as:

```bash
cd /root/nursenest-core/nursenest-core
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 node scripts/qa/wait-for-app-ready.mjs
```

Use this after you start the server manually, or when diagnosing “Playwright says ready but pages show compile overlay”. The script logs markers such as `Failed to compile` when `strictHttp200` body capture applies.

---

## `reuseExistingServer` (avoid duplicate `next dev`)

When `webServer` is enabled and `reuseExistingServer: true` (local, non-CI), Playwright **reuses** a process that already answers the configured `url`. That avoids spawning a **second** `next dev` on the same port (which would throw **EADDRINUSE** or produce empty responses).

If something is listening but is the **wrong** process (stale build, wrong repo), stop it first:

```bash
ss -ltnp 'sport = :3000'
# or
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

To **force** Playwright to own the server lifecycle from a clean slate, stop the old listener, then run tests without an existing server.

---

## `PLAYWRIGHT_SKIP_WEB_SERVER=1` — when to set it

Set **`PLAYWRIGHT_NO_REUSE_WEB_SERVER=1`** when you want Playwright to **always spawn** a new `webServer` locally instead of reusing an existing listener (debugging stale processes; default is reuse when not CI).

Set **`PLAYWRIGHT_SKIP_WEB_SERVER=1`** when:

1. You **already** started Next yourself (`dev:next` / `dev:next:3000` / standalone) and want Playwright to **not** spawn another server.
2. You are targeting **staging/preview** with `PLAYWRIGHT_BASE_URL` / `BASE_URL` pointing at a non-loopback host (configs skip `webServer` automatically for remote origins).
3. Playwright’s integrated `webServer` keeps timing out (compile hang, env validation) and you need to **tee** logs from a manual terminal:  
   `npm run dev:next:3000 2>&1 | tee /tmp/nn-next-dev.log`

This flag does **not** relax test assertions; it only disables the config’s `webServer` block.

---

## EADDRINUSE and “healthy listener” checks

**Symptoms:** `listen EADDRINUSE: address already in use :::3000`, or Playwright connects but gets wrong content.

**Diagnose:**

```bash
ss -ltnp 'sport = :3000'
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/
```

HTTP **200** on `/` (or your chosen path) usually means **something** is serving; combine with `ss`/`lsof` to confirm it is **your** Next dev instance.

**`dev:next:3000`** refuses to start if the port is in use (unless `DEV_NEXT_ALLOW_PORT_CLASH=1`, last resort).

---

## Auth / env variable **names** (no values)

Typical names for local Playwright + Next (see also `local-runtime-modes.md`):

- `AUTH_SECRET` or `NEXTAUTH_SECRET`
- `AUTH_URL`, `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL` (needed for many `/app` and auth-backed flows)
- `PLAYWRIGHT_BASE_URL` / `BASE_URL` / `SCREENSHOT_BASE_URL`
- Paid / visual QA (when running those projects): `E2E_PAID_EMAIL`, `E2E_PAID_PASSWORD` (and documented aliases in `tests/e2e/helpers/`)

Never commit secret values.

---

## Standalone vs `next dev` for E2E

| Mode | Use when |
|------|-----------|
| **`npm run dev:next` / `dev:next:3000`** | Fast feedback, source maps, hub marketing specs, most Playwright `webServer` configs. |
| **`npm run runtime:standalone:build` + `runtime:standalone:start`** | Production-shaped server, `/healthz`-style checks; see `local-runtime-modes.md`. |

Playwright configs that integrate `webServer` assume **`next dev`** semantics unless you set `PLAYWRIGHT_SKIP_WEB_SERVER=1` and start standalone yourself with a matching `PLAYWRIGHT_BASE_URL`.

---

## Hub-focused Playwright commands (exact)

From **`/root/nursenest-core/nursenest-core`**:

```bash
# Pre-Nursing hub (global setup runs wait-for-app-ready)
npm run test:e2e:pre-nursing-hub

# Nursing pathway hub smoke
npx playwright test -c playwright.nursing-hubs.config.ts

# Pathway hub premium modules (tier gates, ECG/NP visibility in spec)
npm run test:e2e:hub-modules

# Pre-nursing + allied access smoke
npx playwright test -c playwright.pathways-prenursing-allied.config.ts

# With an already-healthy server on 3000
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e:pre-nursing-hub
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.nursing-hubs.config.ts
```

**New Grad / Allied** specs exist under `tests/e2e/public/` (e.g. `new-grad-hubs.spec.ts`, `allied-health-hubs.spec.ts`, `allied-hub-premium-smoke.spec.ts`). Run with the default config or grep-driven file list; example:

```bash
cd /root/nursenest-core/nursenest-core
npx playwright test -c playwright.config.ts tests/e2e/public/new-grad-hubs.spec.ts tests/e2e/public/allied-health-hubs.spec.ts
```

Visual QA (separate config):

```bash
npm run visual-qa:check-env
npm run test:e2e:visual-qa-guest-baseline
```

---

## CI vs local

- **`CI` set:** Playwright configs typically set `reuseExistingServer: false` so CI always controls the server process.
- **Local:** Prefer reuse when the `url` probe succeeds so you do not stack duplicate dev servers.

---

## Related

- [`nursenest-core/docs/runtime/local-runtime-modes.md`](../../nursenest-core/docs/runtime/local-runtime-modes.md) — standalone, port matrix, `wait:app:ready` overrides.
- [`nursenest-core/scripts/qa/wait-for-app-ready.mjs`](../../nursenest-core/scripts/qa/wait-for-app-ready.mjs) — readiness implementation.
- [`docs/governance/ecosystem-qa-master-program.md`](../governance/ecosystem-qa-master-program.md) — broader QA matrix.
