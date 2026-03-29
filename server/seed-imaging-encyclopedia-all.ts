import { execSync } from "child_process";

const scripts = [
  "server/seed-imaging-encyclopedia.ts",
  "server/seed-imaging-encyclopedia-part2.ts",
  "server/seed-imaging-encyclopedia-part3.ts",
  "server/seed-imaging-encyclopedia-part4.ts",
  "server/seed-imaging-related-content.ts",
];

async function runAll() {
  console.log("=== Imaging Encyclopedia: Unified Seed Runner ===\n");
  for (const script of scripts) {
    console.log(`\n--- Running ${script} ---`);
    execSync(`npx tsx ${script}`, { stdio: "inherit" });
  }
  console.log("\n=== All imaging encyclopedia seed scripts complete ===");
}

runAll().catch((err) => {
  console.error("Unified seed failed:", err);
  process.exit(1);
});
