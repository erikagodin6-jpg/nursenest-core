#!/usr/bin/env node
/**
 * Single Next.js dev server on **127.0.0.1:3000** (avoids silent fallback to 3001).
 *
 * Preflight:
 *   - Runs scripts/assert-local-auth-secret.mjs (unless NN_SKIP_DEV_AUTH_SECRET=1)
 *   - Ensures port 3000 is free OR exits with listener PIDs (unless DEV_NEXT_ALLOW_PORT_CLASH=1)
 *
 * Usage (from nursenest-core package):
 *   npm run dev:next:3000
 *
 * Env:
 *   DEV_NEXT_ALLOW_PORT_CLASH=1  — start even if something already answers on 3000 (dangerous; last resort)
 *   NN_SKIP_DEV_AUTH_SECRET=1      — skip auth secret assert (compile-only)
 */
import { spawn } from "node:child_process";
import { execSync } from "node:child_process";
import net from "node:net";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..");
const PORT = Number(process.env.DEV_NEXT_PORT || "3000");
const HOST = process.env.DEV_NEXT_HOST || "127.0.0.1";

function portIsFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(false));
    srv.listen(port, HOST, () => {
      srv.close(() => resolve(true));
    });
  });
}

function describeListeners(port) {
  const lines = [];
  try {
    const out = execSync(`ss -ltnp 'sport = :${port}' 2>/dev/null || true`, {
      encoding: "utf8",
      maxBuffer: 512 * 1024,
    });
    if (out.trim()) lines.push(out.trim());
  } catch {
    /* ignore */
  }
  try {
    const out = execSync(`command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:${port} -sTCP:LISTEN 2>/dev/null || true`, {
      encoding: "utf8",
      maxBuffer: 512 * 1024,
    });
    if (out.trim()) lines.push(out.trim());
  } catch {
    /* ignore */
  }
  return lines.length ? lines.join("\n") : "(no ss/lsof output — install iproute2 or lsof for PID details)";
}

async function main() {
  const free = await portIsFree(PORT);
  if (!free && process.env.DEV_NEXT_ALLOW_PORT_CLASH !== "1") {
    console.error(`[dev:next:3000] Port ${HOST}:${PORT} is already in use.\n`);
    console.error("[dev:next:3000] Listener snapshot:\n", describeListeners(PORT));
    console.error(
      "\nStop the other process (see PID above) or set DEV_NEXT_ALLOW_PORT_CLASH=1 only if you accept undefined behavior.\n",
    );
    process.exit(1);
  }
  if (!free && process.env.DEV_NEXT_ALLOW_PORT_CLASH === "1") {
    console.warn(`[dev:next:3000] WARNING: port ${PORT} in use; starting another next dev anyway (DEV_NEXT_ALLOW_PORT_CLASH=1).`);
  }

  const assertAuth = join(APP_ROOT, "scripts", "assert-local-auth-secret.mjs");
  const ensureMem = join(APP_ROOT, "scripts", "ensure-node-memory.mjs");
  const memExports = join(APP_ROOT, "scripts", ".node-memory-exports.sh");

  const chain = [
    `cd "${APP_ROOT}"`,
    `node "${assertAuth}"`,
    `node "${ensureMem}"`,
    `. "${memExports}"`,
    `npx next dev --hostname ${HOST} --port ${PORT}`,
  ].join(" && ");

  console.log(`[dev:next:3000] Starting Next.js on http://${HOST}:${PORT}\n`);

  const child = spawn("bash", ["-lc", chain], {
    stdio: "inherit",
    cwd: APP_ROOT,
    env: { ...process.env },
  });
  child.on("exit", (code, signal) => {
    if (signal) {
      console.error(`[dev:next:3000] child signal ${signal}`);
      process.exit(1);
    }
    process.exit(code ?? 0);
  });
}

main().catch((e) => {
  console.error("[dev:next:3000] FATAL:", e);
  process.exit(1);
});
