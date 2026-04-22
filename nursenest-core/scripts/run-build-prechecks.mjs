import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const skipPrebuild = /^(1|true|yes)$/i.test(process.env.SKIP_I18N_PREBUILD ?? "");

const marketingSurfaceScript = path.join(packageRoot, "scripts", "validate-marketing-production-surface.mjs");
console.log("[build-prechecks] running validate-marketing-production-surface.mjs (always)");
execFileSync(process.execPath, [marketingSurfaceScript], {
  cwd: packageRoot,
  stdio: "inherit",
});

const homeGlobalRegionsContractTest = path.join(
  packageRoot,
  "src",
  "lib",
  "marketing",
  "home-global-regions-i18n-alignment.contract.test.ts",
);
console.log("[build-prechecks] running home-global-regions i18n alignment contract test");
execFileSync(process.execPath, ["--import", "tsx", "--test", homeGlobalRegionsContractTest], {
  cwd: packageRoot,
  stdio: "inherit",
});

const marketingLayoutWebRegionTest = path.join(
  packageRoot,
  "src",
  "lib",
  "marketing",
  "marketing-default-layout-web-region.contract.test.ts",
);
console.log("[build-prechecks] running marketing-default-layout web region contract test");
execFileSync(process.execPath, ["--import", "tsx", "--test", marketingLayoutWebRegionTest], {
  cwd: packageRoot,
  stdio: "inherit",
});

const detectedIpCountryTest = path.join(
  packageRoot,
  "src",
  "lib",
  "region",
  "detected-ip-country.test.ts",
);
console.log("[build-prechecks] running detected-ip-country unit test");
execFileSync(process.execPath, ["--import", "tsx", "--test", detectedIpCountryTest], {
  cwd: packageRoot,
  stdio: "inherit",
});

const verifyPricingPayload = path.join(packageRoot, "scripts", "verify-pricing-payload.ts");
console.log("[build-prechecks] running verify-pricing-payload.ts");
execFileSync(process.execPath, ["--import", "tsx", verifyPricingPayload], {
  cwd: packageRoot,
  stdio: "inherit",
});

const pricingPayloadValidateTest = path.join(
  packageRoot,
  "src",
  "lib",
  "pricing",
  "pricing-options-payload-validate.test.ts",
);
console.log("[build-prechecks] running pricing-options-payload-validate.test.ts");
execFileSync(process.execPath, ["--import", "tsx", "--test", pricingPayloadValidateTest], {
  cwd: packageRoot,
  stdio: "inherit",
});

if (skipPrebuild) {
  console.log("[build-prechecks] skipping heavy i18n merge audits (SKIP_I18N_PREBUILD=1)");
  process.exit(0);
}

for (const scriptName of ["i18n:validate-production", "i18n:validate-chrome"]) {
  console.log(`[build-prechecks] running ${scriptName}`);
  execFileSync(npmCommand, ["run", scriptName], {
    cwd: packageRoot,
    stdio: "inherit",
  });
}
