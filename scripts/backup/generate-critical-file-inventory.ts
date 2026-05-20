import { generateManifests } from "./generate-manifests";

if (process.argv[1] && process.argv[1].includes("generate-critical-file-inventory")) {
  generateManifests()
    .then((result) => {
      console.log("\nCritical File Inventory");
      console.log("=".repeat(50));
      for (const file of result.criticalFiles) {
        const icon = file.exists ? "[OK]" : "[MISSING]";
        const size = file.exists ? ` (${file.sizeBytes} bytes)` : "";
        console.log(`  ${icon} ${file.path}${size}`);
      }
      const present = result.criticalFiles.filter(f => f.exists).length;
      const total = result.criticalFiles.length;
      console.log(`\n  ${present}/${total} critical files present`);
    })
    .catch((err) => {
      console.error("Critical file inventory failed:", err);
      process.exit(1);
    });
}
