# Local Runtime Modes

This repo has two important roots:

- Git root: `/root/nursenest-core`
- Next app root: `/root/nursenest-core/nursenest-core`

All runtime, build, and Playwright commands below run from the Next app root unless a command says otherwise:

```bash
cd /root/nursenest-core/nursenest-core
```

## Dev Server

Use `npm run dev:next` for normal local feature work with hot reload:

```bash
cd /root/nursenest-core/nursenest-core
npm run dev:next
```

Use `npm run dev:next:3000` for local QA and screenshots. It fails if `127.0.0.1:3000` is already in use, instead of silently letting Next move to another port:

```bash
cd /root/nursenest-core/nursenest-core
npm run dev:next:3000
```

Choose dev mode when you need fast iteration, source maps, route compilation diagnostics, or hot reload. If dev compile instability makes Playwright hard to diagnose, start the server manually and run tests with `PLAYWRIGHT_SKIP_WEB_SERVER=1`.

## Standalone Server

This app sets `output: "standalone"` in `next.config.mjs`.

Never run plain `next start` for standalone output. Next.js warns that **`next start` is not valid for `output: "standalone"`** — use the generated `server.js` instead (wording varies by version; the intent is always: **do not use `next start` on standalone output**). Standalone output must be started with Node against the generated `server.js`:

```bash
node .next/standalone/server.js
```

In this monorepo, Next may emit either of these paths:

```text
.next/standalone/nursenest-core/server.js
.next/standalone/server.js
```

Use the helper unless you are intentionally reproducing a raw `server.js` issue:

```bash
cd /root/nursenest-core/nursenest-core
npm run runtime:standalone:build
PORT=3000 HOSTNAME=127.0.0.1 npm run runtime:standalone:start
```

The helper resolves the emitted `server.js`, sets `NODE_ENV=production`, validates local runtime env, checks for a port collision, uses the correct standalone cwd, and then runs Node directly.

For raw manual debugging after a build, use the emitted path that exists:

```bash
cd /root/nursenest-core/nursenest-core
npm run runtime:standalone:build

# Monorepo standalone layout, when present:
cd /root/nursenest-core/nursenest-core/.next/standalone/nursenest-core
NODE_ENV=production PORT=3000 HOSTNAME=127.0.0.1 node server.js

# Simpler standalone layout, when present:
cd /root/nursenest-core/nursenest-core/.next/standalone
NODE_ENV=production PORT=3000 HOSTNAME=127.0.0.1 node server.js
```

Use `npm start` only when you want the app’s production bootstrap proxy with `/healthz` and `/readyz` behavior:

```bash
cd /root/nursenest-core/nursenest-core
npm run runtime:standalone:build
PORT=3000 HOSTNAME=0.0.0.0 npm start
```

## Minimal Env

Do not commit secret values. For local QA, set names like these in your shell or local env file:

```bash
export AUTH_SECRET="$(openssl rand -base64 32)"
export AUTH_URL="http://127.0.0.1:3000"
export NEXTAUTH_URL="$AUTH_URL"
export NEXT_PUBLIC_APP_URL="http://127.0.0.1:3000"
export PLAYWRIGHT_BASE_URL="http://127.0.0.1:3000"
export DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
```

Required and common variables:

- `AUTH_SECRET` or `NEXTAUTH_SECRET`: Auth.js session/JWT signing. Required for runtime QA.
- `AUTH_URL` or `NEXTAUTH_URL`: Auth callback origin. Use an origin only, no path.
- `NEXT_PUBLIC_APP_URL`: Public app origin used by canonical and billing callback logic.
- `DATABASE_URL`: Postgres connection string. Required for Prisma-backed routes, especially learner `/app` flows.
- `PLAYWRIGHT_BASE_URL`: Base URL for Playwright and the readiness probe.
- `SCREENSHOT_BASE_URL`: Base URL used by screenshot tooling; the readiness probe also supports it.
- `PORT`: Standalone/dev port. Defaults to `3000`.
- `HOSTNAME`: Standalone bind host. Use `127.0.0.1` for local raw standalone.

Validate local runtime env before standalone startup:

```bash
cd /root/nursenest-core/nursenest-core
npm run runtime:env:validate
```

Validate env and check the port before raw standalone startup:

```bash
cd /root/nursenest-core/nursenest-core
node scripts/runtime/validate-local-env.mjs --check-port
```

## Playwright Web Server

Playwright-focused commands, `reuseExistingServer`, and `PLAYWRIGHT_SKIP_WEB_SERVER` patterns are summarized at **[`../../../docs/runtime/playwright-local-workflow.md`](../../../docs/runtime/playwright-local-workflow.md)** (git repo root).

Preferred diagnosable local flow:

```bash
cd /root/nursenest-core/nursenest-core
npm run dev:next:3000 2>&1 | tee /tmp/nn-next-dev.log
```

In another terminal:

```bash
cd /root/nursenest-core/nursenest-core
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run wait:app:ready
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e:pre-nursing-hub
```

`PLAYWRIGHT_SKIP_WEB_SERVER=1` tells Playwright not to spawn its configured `webServer`. Use it when you already started a healthy server manually, when dev compile is unstable, or when you are testing a preview/staging URL.

`PLAYWRIGHT_NO_REUSE_WEB_SERVER=1` forces Playwright to start a **new** `webServer` process even locally (default is to reuse a healthy listener on the same port to avoid duplicate `next dev` / **EADDRINUSE**).

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://preview.example.com npm run test:e2e:pre-nursing-hub
```

If `PLAYWRIGHT_SKIP_WEB_SERVER` is not set and the base URL is local, `playwright.pre-nursing-hub.config.ts` starts `npm run dev:next:3000`. That path still requires a real auth secret because the dev script runs `scripts/assert-local-auth-secret.mjs`.

## Readiness

`scripts/qa/wait-for-app-ready.mjs` (via `npm run wait:app:ready`) uses **strict HTTP 200** per path. Default paths are **`/`, `/login`, `/pre-nursing`** (guest-safe: `/app` often returns **307** to sign-in when unauthenticated). Optionally still probes **`GET /api/auth/csrf`** unless `APP_READY_AUTH_CSRF=0`.

Run:

```bash
cd /root/nursenest-core/nursenest-core
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run wait:app:ready
```

The probe chooses the base URL in this order (see script header):

```text
PLAYWRIGHT_BASE_URL
SCREENSHOT_BASE_URL
APP_READY_BASE_URL
http://127.0.0.1:3000
```

Useful overrides:

```bash
APP_READY_TIMEOUT_MS=600000 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run wait:app:ready
APP_READY_PATHS="/,/login,/pre-nursing,/app" PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run wait:app:ready
APP_READY_AUTH_CSRF=0 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run wait:app:ready
```

Pre-Nursing Playwright global setup defaults to the same guest-safe path list. Add `/app` to `APP_READY_PATHS` only when you expect a **200** (for example after seeding a session).

## Port Conflicts

Symptoms:

- `npm run dev:next` starts on `3001` instead of `3000`.
- Playwright waits for one port while another server is running elsewhere.
- Standalone exits before readiness because the port is already bound.

Diagnose:

```bash
ss -ltnp 'sport = :3000'
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

Fix by stopping the listener or selecting a new port consistently:

```bash
PORT=3010 HOSTNAME=127.0.0.1 npm run runtime:standalone:start
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3010 npm run wait:app:ready
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3010 npm run test:e2e:pre-nursing-hub
```

## Local QA Expectations

Before reporting local E2E as reproducible, capture command exit codes for:

```bash
cd /root/nursenest-core/nursenest-core
npm run runtime:env:validate
npm run typecheck:critical
npm run test:homepage
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run wait:app:ready
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e:pre-nursing-hub
```

For standalone-specific QA:

```bash
cd /root/nursenest-core/nursenest-core
npm run runtime:standalone:build
PORT=3000 HOSTNAME=127.0.0.1 npm run runtime:standalone:start
```

Then run readiness and Playwright from another terminal with the same base URL.

## Related Files

- `next.config.mjs`: `output: "standalone"`.
- `scripts/runtime/validate-local-env.mjs`: local env and optional port validation.
- `scripts/runtime/build-standalone.mjs`: build, sync standalone static assets, verify artifact.
- `scripts/runtime/start-standalone.mjs`: raw `node server.js` standalone starter.
- `scripts/start-standalone.mjs`: production bootstrap proxy starter used by `npm start`.
- `scripts/qa/wait-for-app-ready.mjs`: strict readiness probe for QA and Playwright.
- `playwright.pre-nursing-hub.config.ts`: Pre-Nursing suite config.
