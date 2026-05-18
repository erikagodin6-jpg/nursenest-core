import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

const REQUIRED_SITEMAP_ROUTE_ARTIFACTS = [
  "sitemap.xml/route.js",
  "sitemap-core.xml/route.js",
  "sitemap-blog.xml/route.js",
  "sitemap-pathways.xml/route.js",
  "sitemap-lessons.xml/route.js",
  "sitemap-localized.xml/route.js",
  "sitemap-clinical-modules.xml/route.js",
  "sitemap-allied.xml/route.js",
  "sitemap-new-grad.xml/route.js",
];

export function verifySitemapRouteArtifactsPresent(root = packageRoot) {
  const appServerRoot = path.join(root, ".next", "server", "app");
  const missing = REQUIRED_SITEMAP_ROUTE_ARTIFACTS
    .map((relativePath) => path.join(appServerRoot, relativePath))
    .filter((artifactPath) => !existsSync(artifactPath));

  if (missing.length > 0) {
    throw new Error(
      "[sitemap-artifact] FATAL: built Next sitemap route artifacts are missing.\n" +
        "This deploy would likely make /sitemap.xml stale or make child sitemap routes return HTML instead of XML.\n" +
        "Missing artifacts:\n" +
        missing.map((artifactPath) => `  - ${artifactPath}`).join("\n") +
        "\nRun a fresh `npm run build` before postbuild packaging, then redeploy and purge sitemap/robots cache.",
    );
  }

  console.log(
    `[sitemap-artifact] verified ${REQUIRED_SITEMAP_ROUTE_ARTIFACTS.length} sitemap route bundle(s) under ${appServerRoot}`,
  );
}

const scriptPath = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === scriptPath;

if (isDirectRun) {
  try {
    verifySitemapRouteArtifactsPresent();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[nursenest-core] ${message}`);
    process.exit(1);
  }
}
