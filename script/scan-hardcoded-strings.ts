import { readFileSync } from "fs";
import { runI18nScan, type ScanOptions } from "./scan-hardcoded-strings-lib";

const args = process.argv.slice(2);

let configOptions: Record<string, any> = {};
try {
  configOptions = JSON.parse(readFileSync("i18n-scan.config.json", "utf-8"));
} catch {}

const options: ScanOptions = {
  scanDir: configOptions.scanDir ?? "client/src",
  criticalThreshold: configOptions.criticalThreshold ?? 0,
  totalThreshold: configOptions.totalThreshold ?? 30000,
  failOnCritical: configOptions.failOnCritical ?? true,
  outputJson: configOptions.outputJson ?? true,
  outputPath: configOptions.outputPath ?? "i18n-violations-report.json",
  quiet: false,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--threshold" && args[i + 1]) {
    options.totalThreshold = parseInt(args[++i], 10);
  } else if (args[i] === "--no-json") {
    options.outputJson = false;
  } else if (args[i] === "--json") {
    options.outputJson = true;
  } else if (args[i] === "--output" && args[i + 1]) {
    options.outputPath = args[++i];
  } else if (args[i] === "--dir" && args[i + 1]) {
    options.scanDir = args[++i];
  } else if (args[i] === "--no-fail") {
    options.failOnCritical = false;
    options.totalThreshold = Infinity;
  } else if (args[i] === "--quiet") {
    options.quiet = true;
  } else if (args[i] === "--ci") {
    options.quiet = false;
  }
}

const passed = runI18nScan(options);
process.exit(passed ? 0 : 1);
