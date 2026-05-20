import { runFullBackup } from "../../backup-system/backup-full";
import { verifyBackup } from "../../backup-system/backup-verify";

async function runPredeploySnapshot() {
  console.log(`[PreDeploy] Starting pre-deployment backup at ${new Date().toISOString()}`);

  const backupResult = await runFullBackup({ includeStripe: true, includeObjectStorage: true });
  console.log(`[PreDeploy] Backup completed: ${backupResult.status}`);

  if (backupResult.status === "failed") {
    console.error("[PreDeploy] CRITICAL: Pre-deploy backup failed. Deployment should be paused.");
    return { backup: backupResult, safe: false };
  }

  let verification;
  try {
    verification = await verifyBackup();
    console.log(`[PreDeploy] Verification: ${verification.valid ? "VALID" : "ISSUES"}`);
  } catch (err: any) {
    console.error(`[PreDeploy] Verification error: ${err.message}`);
    verification = { valid: false, errors: [err.message] };
  }

  const safe = backupResult.status === "success" && (verification?.valid ?? false);
  console.log(`[PreDeploy] Safe to deploy: ${safe ? "YES" : "NO - review warnings"}`);

  return { backup: backupResult, verification, safe };
}

if (process.argv[1] && process.argv[1].includes("run-predeploy-snapshot")) {
  runPredeploySnapshot()
    .then((result) => {
      console.log(`\nPre-Deploy Snapshot: ${result.safe ? "SAFE" : "REVIEW NEEDED"}`);
      if (!result.safe) process.exit(1);
    })
    .catch((err) => {
      console.error("Pre-deploy snapshot failed:", err);
      process.exit(1);
    });
}
