import { spawn } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const SYNTHETIC_SCRIPT = path.join(ROOT, "scripts", "synthetic-learning-monitor.ts");
const ROLLBACK_WEBHOOK_URL = process.env.LEARNING_DELIVERY_ROLLBACK_WEBHOOK_URL?.trim();
const DEPLOYMENT_ID =
  process.env.NN_BUILD_COMMIT ||
  process.env.SOURCE_COMMIT ||
  process.env.GITHUB_SHA ||
  process.env.DIGITALOCEAN_GIT_COMMIT_SHA ||
  "unknown";

function runSyntheticMonitor(): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["--import", "tsx", SYNTHETIC_SCRIPT], {
      cwd: ROOT,
      env: process.env,
      stdio: "inherit",
    });
    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

async function requestRollback(reason: string): Promise<void> {
  if (!ROLLBACK_WEBHOOK_URL) return;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 10_000);
  try {
    await fetch(ROLLBACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source: "learning_delivery_predeploy_gate",
        reason,
        deploymentId: DEPLOYMENT_ID,
        createdAt: new Date().toISOString(),
      }),
      signal: ac.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

const code = await runSyntheticMonitor();
if (code !== 0) {
  await requestRollback("tier_1_learning_delivery_synthetic_failure").catch((error) => {
    console.error("[learning-delivery-gate] rollback webhook failed", error);
  });
  console.error("[learning-delivery-gate] blocked deployment: Tier 1 learning launch checks failed");
  process.exitCode = code;
} else {
  console.log("[learning-delivery-gate] Tier 1 learning launch checks passed");
}

