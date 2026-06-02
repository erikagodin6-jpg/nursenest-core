#!/usr/bin/env node
/**
 * Fail fast before `next build` when free disk space is critically low (avoids opaque ENOSPC).
 *
 * Env:
 *   MIN_FREE_DISK_MB — minimum free MiB required (default: 512)
 *   SKIP_DISK_CHECK=1 — skip (CI sandboxes without accurate df, local override)
 */
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const minMb = Math.max(64, Number(process.env.MIN_FREE_DISK_MB || 512));

if (process.env.SKIP_DISK_CHECK === "1") {
  console.log("[disk-check] skipped (SKIP_DISK_CHECK=1)");
  process.exit(0);
}

if (process.platform === "win32") {
  console.log("[disk-check] skipped on win32 (set SKIP_DISK_CHECK=1 to silence)");
  process.exit(0);
}

try {
  const out = execSync(`df -Pk "${pkgRoot}"`, { encoding: "utf8", maxBuffer: 64 * 1024 });
  const line = out.trim().split("\n").pop();
  if (!line) throw new Error("empty df output");
  const parts = line.trim().split(/\s+/);
  const availKb = parseInt(parts[3], 10);
  if (!Number.isFinite(availKb)) throw new Error("could not parse available KiB");
  const freeMb = Math.floor(availKb / 1024);
  console.log(`[disk-check] free ~${freeMb} MiB on build volume (require ≥ ${minMb} MiB)`);
  if (freeMb < minMb) {
    console.error(
      `\n[disk-check] FAIL: Free disk space is below ${minMb} MiB. Next.js may hit ENOSPC while writing .next.\n` +
        "Free space, run npm run clean:build, or point TMPDIR at a larger volume, then retry.\n",
    );
    process.exit(1);
  }
} catch (e) {
  console.warn("[disk-check] could not read free space; continuing build:", e instanceof Error ? e.message : e);
  process.exit(0);
}
