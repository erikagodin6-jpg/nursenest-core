import { existsSync } from "fs";
import path from "path";
import { execSync } from "child_process";

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

