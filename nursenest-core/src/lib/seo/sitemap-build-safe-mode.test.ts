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
  const mergedXml = readAppFile("lib/seo/sitemap-all-xml.ts");

  assert.match(staticXml, /shouldReduceNonCriticalBuildWork/);
  assert.match(staticXml, /sitemap_build_safe_mode_core_only/);
  assert.match(staticXml, /return base;/);
  assert.match(staticXml, /getAllProgrammaticQuestionTopicSlugs\(\)/);

  assert.match(mergedXml, /shouldReduceNonCriticalBuildWork/);
  assert.match(mergedXml, /if \(!reduceForBuildSafeMode\)/);
  assert.match(mergedXml, /buildSafeMode: reduceForBuildSafeMode \? "1" : "0"/);
});
