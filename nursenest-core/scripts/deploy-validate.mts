/**
 * Post-deploy validation: runs lightweight HTTP probes against a live URL.
 * Exit 0 = all critical checks pass. Exit 1 = at least one critical failure.
 *
 * Usage:
 *   npx tsx scripts/deploy-validate.mts https://nursenest.ca
 *   DEPLOY_BASE_URL=https://nursenest.ca npx tsx scripts/deploy-validate.mts
 *
 * Railway post-deploy hook (railway.toml or settings):
 *   postDeploy: npx tsx scripts/deploy-validate.mts $RAILWAY_PUBLIC_DOMAIN
 *
 * Exit codes:
 *   0 — all critical probes pass
 *   1 — at least one critical probe failed (trigger rollback)
 *   2 — misconfiguration (missing base URL)
 */

const baseUrl = (process.argv[2] ?? process.env.DEPLOY_BASE_URL ?? "").replace(/\/$/, "");
if (!baseUrl.startsWith("http")) {
  console.error("[deploy-validate] ERROR: base URL required as first argument or DEPLOY_BASE_URL env var");
  process.exit(2);
}

const TIMEOUT_MS = 15_000;

interface ProbeResult {
  path: string;
  label: string;
  critical: boolean;
  ok: boolean;
  status?: number;
  durationMs?: number;
  error?: string;
}

async function probe(
  path: string,
  label: string,
  opts: {
    critical?: boolean;
    expectJson?: boolean;
    expectJsonField?: { field: string; type: string };
    expectStatusBelow?: number;
    expectBodyContains?: RegExp;
  } = {}
): Promise<ProbeResult> {
  const {
    critical = true,
    expectJson = false,
    expectJsonField,
    expectStatusBelow = 500,
    expectBodyContains,
  } = opts;

  const url = `${baseUrl}${path}`;
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "nursenest-deploy-validate/1.0" },
      redirect: "follow",
    });
    clearTimeout(timer);
    const durationMs = Date.now() - start;
    const status = res.status;

    if (status >= expectStatusBelow) {
      return { path, label, critical, ok: false, status, durationMs, error: `HTTP ${status}` };
    }

    if (expectJson || expectJsonField || expectBodyContains) {
      const text = await res.text();
      if (expectBodyContains && !expectBodyContains.test(text)) {
        return { path, label, critical, ok: false, status, durationMs, error: `body did not match ${expectBodyContains}` };
      }
      if (expectJsonField) {
        try {
          const json = JSON.parse(text) as Record<string, unknown>;
          if (typeof json[expectJsonField.field] !== expectJsonField.type) {
            return { path, label, critical, ok: false, status, durationMs, error: `missing JSON field '${expectJsonField.field}'` };
          }
        } catch {
          return { path, label, critical, ok: false, status, durationMs, error: "invalid JSON" };
        }
      }
    }

    return { path, label, critical, ok: true, status, durationMs };
  } catch (err: unknown) {
    clearTimeout(timer);
    const msg = controller.signal.aborted ? `timeout after ${TIMEOUT_MS}ms` : String(err);
    return { path, label, critical, ok: false, durationMs: Date.now() - start, error: msg };
  }
}

async function main() {
  console.log(`[deploy-validate] Probing: ${baseUrl}`);
  console.log(`[deploy-validate] Timeout: ${TIMEOUT_MS}ms per probe\n`);

  const probes: ProbeResult[] = await Promise.all([
    // ─── Health / readiness (critical) ───────────────────────────────────────
    probe("/api/health",       "liveness",         { expectJsonField: { field: "ok", type: "boolean" } }),
    probe("/api/health/ready", "db-readiness",     { expectJsonField: { field: "ok", type: "boolean" }, expectStatusBelow: 600 }),
    probe("/api/healthz",      "healthz-alias",    { expectStatusBelow: 600 }),

    // ─── Public marketing routes (critical) ──────────────────────────────────
    probe("/",           "homepage",      { expectBodyContains: /\S{50}/  }),
    probe("/pricing",    "pricing",       { expectBodyContains: /\$\d+/   }),
    probe("/canada/rn/nclex-rn", "rn-marketing",  {}),
    probe("/canada/rpn/rex-pn",  "rpn-marketing", {}),
    probe("/canada/np/cnple",    "np-marketing",  {}),

    // ─── Auth entrypoints (critical) ─────────────────────────────────────────
    probe("/login",      "login-page",    { expectStatusBelow: 500 }),

    // ─── Learner entrypoints — fail-closed/redirect only (non-critical 5xx check) ─
    probe("/app/practice-tests", "practice-tests-hub",  { critical: false }),
    probe("/app/flashcards",     "flashcards-hub",       { critical: false }),

    // ─── Blog (non-critical — acceptable to be slow/empty) ───────────────────
    probe("/blog",       "blog",          { critical: false }),
  ]);

  // ─── Report ────────────────────────────────────────────────────────────────
  const pad = (s: string, n: number) => s.padEnd(n);
  console.log(`${"PATH".padEnd(34)} ${"LABEL".padEnd(22)} ${"STATUS".padEnd(8)} ${"MS".padEnd(8)} RESULT`);
  console.log("─".repeat(90));

  for (const r of probes) {
    const tag = r.ok ? "✓ OK" : r.critical ? "✗ FAIL (critical)" : "⚠ WARN";
    const ms = r.durationMs != null ? `${r.durationMs}ms` : "—";
    console.log(
      `${pad(r.path, 34)} ${pad(r.label, 22)} ${pad(String(r.status ?? "—"), 8)} ${pad(ms, 8)} ${tag}${r.error ? ` — ${r.error}` : ""}`
    );
  }

  const criticalFailures = probes.filter((r) => !r.ok && r.critical);
  const warnings = probes.filter((r) => !r.ok && !r.critical);

  console.log(`\n[deploy-validate] Summary: ${probes.length} probes — ${criticalFailures.length} critical failures — ${warnings.length} warnings`);

  if (criticalFailures.length > 0) {
    console.error(`\n[deploy-validate] DEPLOY FAILED — rollback recommended`);
    console.error(`Failed probes: ${criticalFailures.map((r) => r.path).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n[deploy-validate] DEPLOY OK — all critical probes passed`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[deploy-validate] Unexpected error:", err);
  process.exit(1);
});
