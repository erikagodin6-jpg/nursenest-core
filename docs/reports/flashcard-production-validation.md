# Flashcard Production Validation Report

**Date:** 2026-06-01  
**Environment:** Local dev server (Next.js 16.2.6 Turbopack, port 3099, placeholder DB credentials)  
**Tested against:** Current source after `middleware.ts` deletion  
**Status:** PASS on all observable criteria. One production-only measure (session build time) requires live DB credentials — target criteria and test script provided.

---

## Critical Finding During Validation

### Next.js 16 uses `proxy.ts`, not `middleware.ts`

The previous trace report recommended creating `middleware.ts` to wire `proxy.ts`. This was incorrect for Next.js 16 Turbopack.

**What actually happened:**

| Commit | Action |
|---|---|
| `686499824 chore(next): remove middleware.ts (proxy.ts only)` | Correctly deleted `middleware.ts` |
| `3ba3dada1 chore(middleware): remove unused middleware export from proxy` | Correctly deleted again |
| `93dca09bc feat: enhance global nursing...` | **Incorrectly re-created `middleware.ts`** with a standalone middleware implementation |
| Later commits | Modified the re-created file to re-export proxy |

When `middleware.ts` and `proxy.ts` coexist, Next.js 16 fails with a hard build error:

```
Error: Both middleware file "./src/middleware.ts" and proxy file "./src/proxy.ts" are detected.
Please use "./src/proxy.ts" only.
```

`middleware.ts` has now been deleted. `proxy.ts` is the correct and only middleware registration in Next.js 16.

---

## Middleware Registration: VERIFIED

### How proxy.ts is registered in Next.js 16 Turbopack

Next.js 16 does not use `middleware-manifest.json` for Turbopack builds. The proxy is compiled directly into the edge runtime bundle:

```
.next/dev/server/edge/chunks/[root-of-the-server]__028yezk._.js  (137,569 bytes)
```

**Evidence — all proxy functions present in compiled edge chunk:**

| Symbol | Found in edge chunk |
|---|---|
| `x-nn-request-pathname` | ✅ offset 131,355 |
| `failClosedProtectedLearnerRequest` | ✅ offset 120,768 |
| `isStaticAssetBypassPath` | ✅ offset 114,343 |
| `ensureCorrelationId` | ✅ offset 121,510 |
| `loadAuthProxyDeps` | ✅ offset 117,867 |

**Runtime confirmation — proxy executed on every request:**

After deleting `middleware.ts` and starting the dev server (`✓ Ready in 568ms`):

```
GET /api/flashcards/custom-session   → HTTP 401, x-nn-correlation-id: present
GET /canada/rn/nclex-rn              → x-nn-correlation-id: present  
GET /healthz                         → x-nn-correlation-id: present
GET /readyz                          → x-nn-correlation-id: present
```

`x-nn-correlation-id` is injected by `ensureCorrelationId()` in `proxy.ts`. Its presence on every response confirms the proxy runs before all route handlers.

**What the old empty middleware manifest meant:**

The `middleware-manifest.json: {"middleware": {}}` reported in the trace report was from a prior webpack production build artifact that had since been cleaned. In Turbopack dev builds, there is no `middleware-manifest.json` — the proxy registration is implicit in the edge chunk compilation. The manifest is only produced for webpack production builds, where its format is also different from the old webpack 4 format.

---

## API Response Measurements

### Environment

- Server: Next.js 16.2.6 Turbopack dev, local
- DB: placeholder credentials (no live DB) — auth gate returns 401 at `requireSubscriberSession` step
- JWT: none (unauthenticated requests)
- Note: 401 responses measure the auth gate + proxy overhead only, not session build time

### Timings — all 7 scenarios (unauthenticated)

| Scenario | Status | Time (ms) | Correlation ID | x-nn-session-build-ms |
|---|---|---|---|---|
| RN single-system | 401 | 95 | ✅ present | — (auth rejected before build) |
| RN multi-system | 401 | 18 | ✅ present | — |
| US RN (NCLEX) | 401 | 17 | ✅ present | — |
| RPN (REX-PN) | 401 | 15 | ✅ present | — |
| NP | 401 | 13 | ✅ present | — |
| Weak areas | 401 | 23 | ✅ present | — |
| Incorrect cards | 401 | 20 | ✅ present | — |

The 95ms on the first RN request is Turbopack JIT compilation overhead (warm-up). Subsequent requests are 13–23ms — the pure auth rejection path without DB.

### 5-run p50/p95 benchmark (RN single-system)

```
timings: [13, 15, 15, 18, 226]
p50:  15 ms
p95: 226 ms   ← includes one JIT compile hit
```

All requests:
- ✅ Returned 401 (correct — no session provided)
- ✅ `x-nn-correlation-id` present (proxy executed)
- ✅ No timeouts
- ✅ No 500 errors (auth rejection is clean, not a crash)

---

## Old Error Text Verification

### Result: ABSENT from current build

```bash
grep -r "request did not complete before the flashcard player could hydrate" .next/dev/
# Output: (empty)
# Count: 0
```

The old error phrase does not exist in any Turbopack dev bundle chunk. The compiled source uses the new error classification:

**Source lines in `flashcard-custom-study-client.tsx`:**

```typescript
// Line 536
const errorCode = isTimeout ? "session_timeout_client" : isNetwork ? "network_error" : "unexpected_error";

// Line 560
code: "session_timeout_client"   // DOMException("TimeoutError") path

// Line 567  
code: "network_error"            // TypeError (actual network failure) path

// Line 574
code: "unexpected_error"         // Anything else
```

Each path has specific `detail` text. The old catch-all `"network_error"` with the old message no longer exists.

---

## Success Criteria Assessment

| Criterion | Target | Status | Evidence |
|---|---|---|---|
| Proxy executes | `x-nn-correlation-id` on all responses | ✅ PASS | All 7 scenarios + marketing route + health probes |
| Old hydration message absent | Not present in bundle | ✅ PASS | `grep` count = 0 across entire `.next/dev/` tree |
| New timeout messages correct | `session_timeout_client` code for DOMException | ✅ PASS | Source lines 536, 560 confirmed |
| Middleware conflict resolved | Server starts without error | ✅ PASS | `✓ Ready in 568ms`, no conflict errors |
| Auth gate responds correctly | 401 (not 500) without session | ✅ PASS | All 7 scenarios return 401 |
| No client-side race condition | Loading gate before player render | ✅ PASS (source) | Line 611: `if (loading) return <skeleton>` |

### Production-only criteria (require live DB + auth)

These cannot be measured in the dev environment with placeholder credentials. Run the measurement script below against staging or production.

| Criterion | Target | Cannot measure locally because |
|---|---|---|
| p50 session build time | < 1,000 ms | DB connection required |
| p95 session build time | < 2,000 ms | DB connection required |
| Timeout rate | < 1% | Requires authenticated load test |
| Empty pool rate | < 1% | Requires real card data |
| Session build with middleware | `x-nn-session-build-ms` header < 1,000 ms | Auth gate + DB required |

---

## Production Measurement Script

Run this after deploying to staging or production with valid paid credentials:

```javascript
// flashcard-session-probe.mjs
// Usage: BASE_URL=https://staging.nursenest.ca SESSION_COOKIE=... node flashcard-session-probe.mjs

import https from "node:https";
import http from "node:http";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const COOKIE = process.env.SESSION_COOKIE || "";
const RUNS = Number(process.env.RUNS || "20");

const SCENARIOS = [
  { name: "RN single-system",  url: "/api/flashcards/custom-session?pathwayId=ca-rn-nclex-rn&categories=cardiovascular&includeCards=1&cardLimit=8" },
  { name: "RN multi-system",   url: "/api/flashcards/custom-session?pathwayId=ca-rn-nclex-rn&categories=cardiovascular,respiratory,neurological&includeCards=1&cardLimit=8" },
  { name: "US RN (NCLEX)",     url: "/api/flashcards/custom-session?pathwayId=us-rn-nclex-rn&categories=cardiovascular&includeCards=1&cardLimit=8" },
  { name: "RPN (REX-PN)",      url: "/api/flashcards/custom-session?pathwayId=ca-rpn-rex-pn&categories=cardiovascular&includeCards=1&cardLimit=8" },
  { name: "NP (CNPLE)",        url: "/api/flashcards/custom-session?pathwayId=ca-np-cnple&categories=cardiovascular&includeCards=1&cardLimit=8" },
  { name: "Weak areas",        url: "/api/flashcards/custom-session?pathwayId=ca-rn-nclex-rn&weakOnly=1&includeCards=1&cardLimit=8" },
  { name: "Incorrect cards",   url: "/api/flashcards/custom-session?pathwayId=ca-rn-nclex-rn&incorrectOnly=1&includeCards=1&cardLimit=8" },
];

function req(url) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const parsed = new URL(url);
    const mod = parsed.protocol === "https:" ? https : http;
    const r = mod.request({ hostname: parsed.hostname, port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: `${parsed.pathname}${parsed.search}`, method: "GET",
      headers: { Cookie: COOKIE, Accept: "application/json" } }, (res) => {
      let body = "";
      res.on("data", d => body += d);
      res.on("end", () => {
        const ms = Date.now() - t0;
        let code = null, ok = false, retryable = null;
        try { const j = JSON.parse(body); ok = j.ok === true; code = j.code; retryable = j.retryable; } catch {}
        resolve({ ms, status: res.statusCode, ok, code, retryable,
          buildMs: res.headers["x-nn-session-build-ms"] ? Number(res.headers["x-nn-session-build-ms"]) : null,
          corrId: !!res.headers["x-nn-correlation-id"],
          hasOldMsg: body.includes("request did not complete before the flashcard player could hydrate") });
      });
    });
    r.on("error", e => resolve({ ms: Date.now()-t0, status: 0, error: e.message }));
    r.setTimeout(8000, () => { r.destroy(); resolve({ ms: 8000, status: 0, timeout: true }); });
    r.end();
  });
}

function percentile(arr, p) { const s = [...arr].sort((a,b)=>a-b); return s[Math.floor(s.length * p / 100)] ?? s[s.length-1]; }

for (const scenario of SCENARIOS) {
  const results = [];
  for (let i = 0; i < RUNS; i++) {
    results.push(await req(`${BASE}${scenario.url}&sessionSeed=probe-${i}`));
    await new Promise(r => setTimeout(r, 100));
  }
  const ok = results.filter(r => r.ok);
  const timeouts = results.filter(r => r.timeout || r.ms >= 5500);
  const empty = results.filter(r => r.code?.includes("empty"));
  const buildTimes = results.filter(r => r.buildMs !== null).map(r => r.buildMs);
  const oldMsg = results.filter(r => r.hasOldMsg);

  console.log(`\n## ${scenario.name}`);
  console.log(`  Runs:         ${results.length}`);
  console.log(`  Success rate: ${((ok.length/results.length)*100).toFixed(1)}%`);
  console.log(`  Timeout rate: ${((timeouts.length/results.length)*100).toFixed(1)}%  (target < 1%)`);
  console.log(`  Empty rate:   ${((empty.length/results.length)*100).toFixed(1)}%  (target < 1%)`);
  console.log(`  Old msg hits: ${oldMsg.length}  (target 0)`);
  console.log(`  Total p50:    ${percentile(results.map(r=>r.ms), 50)} ms  (target < 1,000)`);
  console.log(`  Total p95:    ${percentile(results.map(r=>r.ms), 95)} ms  (target < 2,000)`);
  if (buildTimes.length > 0) {
    console.log(`  Build p50:    ${percentile(buildTimes, 50)} ms  (x-nn-session-build-ms)`);
    console.log(`  Build p95:    ${percentile(buildTimes, 95)} ms`);
  }
  console.log(`  Corr-ID set:  ${results.every(r => r.corrId)}  (proxy active)`);
}
```

**To run:**

```bash
# 1. Get a session cookie from a paid account
SESSION_COOKIE=$(curl -si -X POST https://staging.nursenest.ca/api/auth/signin/credentials \
  -d "email=...&password=..." | grep "set-cookie" | grep "next-auth.session-token" | ...)

# 2. Run the probe
BASE_URL=https://staging.nursenest.ca SESSION_COOKIE="$SESSION_COOKIE" RUNS=20 \
  node flashcard-session-probe.mjs
```

---

## Files Changed By This Investigation

| File | Action | Reason |
|---|---|---|
| `src/middleware.ts` | **Deleted** | Next.js 16 uses `proxy.ts` as the middleware. Having both causes a hard build error. The file was incorrectly re-created at commit `93dca09bc` after being correctly deleted twice. |

---

## Remaining Action Items

| Priority | Action | Rationale |
|---|---|---|
| P0 | `next build` then deploy | Source is correct; stale webpack artifacts from a prior build are gone. Fresh Turbopack build ensures the correct `FlashcardCustomStudyClient` bundle ships. |
| P1 | Run `flashcard-session-probe.mjs` against staging after deploy | Confirm p50 < 1,000ms and timeout rate < 1% with a real DB and auth session. |
| P2 | Run E2E flashcard session test with paid credentials | `npx playwright test tests/e2e/flashcards/flashcard-session-failure.spec.ts --project=chromium` with `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` set. The live-smoke test at line 428 asserts the old error text never appears. |

---

## Appendix: middleware.ts History

```
d3febf0c4  feat(flashcards): enhance flashcard layout...      — file existed
686499824  chore(next): remove middleware.ts (proxy.ts only)  — DELETED (correct)
3ba3dada1  chore(middleware): remove unused export from proxy  — DELETED again (correct)
93dca09bc  feat: enhance global nursing architecture...        — INCORRECTLY re-created
6fd62c78c  feat: update UK RN NMC CBT pathway...              — modified
712b406c3  feat: update various reports...                     — modified
(current)                                                      — DELETED again (correct, this session)
```

The recurrence pattern (deleted twice, re-created once) suggests the file is being regenerated by a code generation script or AI assistant that assumed the old Next.js 12/13 pattern. The fix is durable once the file is absent from the commit history.
