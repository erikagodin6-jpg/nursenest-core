export { runFullBackup } from "../../backup-system/backup-full";

if (process.argv[1] && process.argv[1].includes("backup-full")) {
  import("../../backup-system/backup-full").then(({ runFullBackup }) => {
    runFullBackup()
      .then((result) => {
        console.log("\nFull Backup Report");
        console.log("=".repeat(40));
        console.log(`  Status: ${result.status}`);
        console.log(`  Duration: ${result.duration}ms`);
        console.log(`  Components: ${Object.keys(result.components).length}`);
        if (result.errors.length > 0) {
          console.log(`  Errors: ${result.errors.join(", ")}`);
        }
        if (result.warnings.length > 0) {
          console.log(`  Warnings: ${result.warnings.join(", ")}`);
        }
      })
      .catch((err) => {
        console.error("Full backup failed:", err);
        process.exit(1);
      });
  });
}
