import { runFullBackup } from "../../backup-system/backup-full";
import { verifyBackup } from "../../backup-system/backup-verify";

async function runDailySnapshot() {
  console.log(`[DailySnapshot] Starting daily backup at ${new Date().toISOString()}`);

  const backupResult = await runFullBackup({ includeStripe: true });
  console.log(`[DailySnapshot] Backup completed: ${backupResult.status}`);

  if (backupResult.status !== "failed") {
    try {
      const verification = await verifyBackup();
      console.log(`[DailySnapshot] Verification: ${verification.valid ? "VALID" : "ISSUES FOUND"}`);
      if (verification.warnings.length > 0) {
        console.log(`[DailySnapshot] Warnings: ${verification.warnings.join(", ")}`);
      }
    } catch (err: any) {
      console.error(`[DailySnapshot] Verification failed: ${err.message}`);
    }
  }

  return backupResult;
}

if (process.argv[1] && process.argv[1].includes("run-daily-snapshot")) {
  runDailySnapshot()
    .then((result) => {
      console.log(`\nDaily Snapshot Complete: ${result.status}`);
      if (result.status === "failed") process.exit(1);
    })
    .catch((err) => {
      console.error("Daily snapshot failed:", err);
      process.exit(1);
    });
}
