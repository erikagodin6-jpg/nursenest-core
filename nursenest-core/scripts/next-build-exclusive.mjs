/**
 * Cross-entry mutex so two `next build` invocations cannot run concurrently
 * (separate terminals, Cursor integrated terminal + CI, etc.).
 */
import fs from "node:fs";
import path from "node:path";

export function exclusiveNextBuildLockPath(packageRoot) {
  return path.join(packageRoot, ".nn-next-build-exclusive.lock");
}

function isProcessAlive(pid) {
  if (!Number.isFinite(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * @returns {string} lock file path
 */
export function acquireExclusiveNextBuildLock(packageRoot) {
  const lockPath = exclusiveNextBuildLockPath(packageRoot);
  fs.mkdirSync(packageRoot, { recursive: true });

  if (fs.existsSync(lockPath)) {
    const raw = fs.readFileSync(lockPath, "utf8").trim();
    const oldPid = parseInt(raw, 10);
    if (Number.isFinite(oldPid) && oldPid > 0 && isProcessAlive(oldPid)) {
      const err = new Error(
        `Another next build process is already running (pid ${oldPid}). If it exited uncleanly, remove: ${lockPath}`,
      );
      err.code = "ELOCKED";
      throw err;
    }
    try {
      fs.unlinkSync(lockPath);
    } catch {
      /* stale */
    }
  }

  fs.writeFileSync(lockPath, String(process.pid), { flag: "wx" });
  return lockPath;
}

export function releaseExclusiveNextBuildLock(packageRoot) {
  const lockPath = exclusiveNextBuildLockPath(packageRoot);
  try {
    if (!fs.existsSync(lockPath)) return;
    const holder = fs.readFileSync(lockPath, "utf8").trim();
    if (holder === String(process.pid)) fs.unlinkSync(lockPath);
  } catch {
    /* best-effort */
  }
}
