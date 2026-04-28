import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function readAppFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

test("sitemap builders gate long-tail SEO fan-out behind build safe mode", () => {
  const staticXml = readAppFile("lib/seo/sitemap-static-xml.ts");
  const routeSrc = readAppFile("app/sitemap.xml/route.ts");

  assert.match(staticXml, /shouldReduceNonCriticalBuildWork/);
  assert.match(staticXml, /sitemap_build_safe_mode_core_only/);
  assert.match(staticXml, /return base;/);
  assert.match(staticXml, /getAllProgrammaticQuestionTopicSlugs\(\)/);
  assert.match(staticXml, /productionSafeStatic/);

  assert.match(routeSrc, /STATIC_SITEMAP_PATHS/);
  assert.match(routeSrc, /resolveCanonicalSiteOrigin/);
  assert.match(routeSrc, /application\/xml/);
});
