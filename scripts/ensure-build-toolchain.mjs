import { existsSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoScriptsDir = path.dirname(__filename);
console.log(`[prebuild] repo scripts directory (resolved): ${repoScriptsDir}`);
const siblingValidate = path.join(repoScriptsDir, "root-prebuild-i18n-validate.mjs");
if (!existsSync(siblingValidate)) {
  console.error(
    `[prebuild] FATAL: expected monorepo scripts at ${repoScriptsDir} but missing root-prebuild-i18n-validate.mjs. ` +
      "Ensure the Docker image copies repo-root ./scripts next to nursenest-core (see Dockerfile COPY scripts).",
  );
  process.exit(1);
}
const repoScriptDir = path.join(repoScriptsDir, "..", "script");
const compileMarker = path.join(repoScriptDir, "compile-i18n.ts");
if (!existsSync(compileMarker)) {
  console.error(
    `[prebuild] FATAL: expected monorepo script/ at ${repoScriptDir} but missing compile-i18n.ts. ` +
      "Ensure the Docker image copies repo-root ./script (see Dockerfile COPY script).",
  );
  process.exit(1);
}

function hasPackage(pkgName) {
  // Package existence check via package.json keeps this fast and reliable.
  return existsSync(path.join("node_modules", pkgName, "package.json"));
}

const REQUIRED = ["esbuild", "vite", "tsx", "typescript"];
const missing = REQUIRED.filter((p) => !hasPackage(p));

if (missing.length > 0) {
  console.log(`[ensure-build-toolchain] missing: ${missing.join(", ")}; installing build toolchain...`);

  execSync(
    [
      "npm install --no-save",
      "--include=dev",
      // Keep the list aligned with scripts/production-build.sh (canonical prod install + build).
      "tsx typescript esbuild vite",
      "@vitejs/plugin-react @tailwindcss/vite",
      "tailwindcss vite-plugin-circular-dependency",
      "@replit/vite-plugin-runtime-error-modal",
    ].join(" "),
    { stdio: "inherit" },
  );
} else {
  console.log("[ensure-build-toolchain] toolchain already present; skipping.");
}

