import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  listHealthcareTestBankPagePaths,
  listHealthcareTestBankPages,
} from "@/lib/seo/healthcare-test-bank-pages";
import { SITEMAP_FALLBACK_PATHWAYS_PATHS } from "@/lib/seo/sitemap-index-children";

const appRoot = path.join(process.cwd(), "src/app/(marketing)/(default)");

function routeFileForPath(urlPath: string): string {
  if (urlPath.startsWith("/us/")) {
    return path.join(appRoot, "[locale]", "[slug]", "[examCode]", "test-bank", "page.tsx");
  }
  return path.join(appRoot, ...urlPath.split("/").filter(Boolean), "page.tsx");
}

test("phase 1 healthcare test-bank registry activates only the five requested pages", () => {
  assert.deepEqual([...listHealthcareTestBankPagePaths()].sort(), [
    "/canada/np/cnple/test-bank",
    "/canada/rpn/rex-pn/test-bank",
    "/us/np/agpcnp/test-bank",
    "/us/np/fnp/test-bank",
    "/us/rn/nclex-rn/test-bank",
  ]);
});

test("healthcare test-bank pages have production metadata bounds and substantive content", () => {
  const seenH1 = new Set<string>();
  for (const page of listHealthcareTestBankPages()) {
    assert.ok(page.title.length <= 60, `${page.id} SEO title exceeds 60 chars`);
    assert.ok(page.description.length <= 155, `${page.id} meta description exceeds 155 chars`);
    assert.ok(page.description.length >= 110, `${page.id} meta description is too thin`);
    assert.match(page.path, /^\/(us|canada)\//, `${page.id} must use canonical regional path`);
    assert.ok(page.h1.length >= 30, `${page.id} needs a substantive H1`);
    assert.ok(!seenH1.has(page.h1), `${page.id} reuses another page H1`);
    seenH1.add(page.h1);
    assert.ok(page.sections.length >= 3, `${page.id} needs at least three content sections`);
    assert.ok(page.sections.every((section) => section.body.join(" ").length >= 240), `${page.id} has a thin section`);
    assert.ok(page.faqs.length >= 3, `${page.id} needs FAQPage content`);
    assert.ok(page.inventoryClaim.length > 20, `${page.id} needs an inventory claim`);
    assert.doesNotMatch(page.inventoryClaim, /\bTBD\b|coming soon|placeholder/i, `${page.id} has unsupported inventory copy`);
  }
});

test("healthcare test-bank pages link to required study and conversion surfaces", () => {
  for (const page of listHealthcareTestBankPages()) {
    assert.match(page.premiumCta.href, /^\/pricing|^\/.*\/pricing$/, `${page.id} missing premium CTA`);
    assert.match(page.freePracticeCta.href, /\/questions$/, `${page.id} missing free-practice CTA`);
    assert.match(page.links.questions.href, /\/questions$/, `${page.id} missing question-bank link`);
    assert.match(page.links.flashcards.href, /\/flashcards$/, `${page.id} missing flashcards link`);
    assert.match(page.links.lessons.href, /\/lessons$/, `${page.id} missing lessons link`);
    assert.match(page.links.pricing.href, /\/pricing$/, `${page.id} missing pricing link`);
    if (page.path.includes("/cnple/")) {
      assert.equal(page.links.cat.href, "/canada/np/cnple/simulation", "CNPLE should link to LOFT simulation, not CAT");
    } else {
      assert.match(page.links.cat.href, /\/cat$/, `${page.id} missing CAT link`);
    }
  }
});

test("healthcare test-bank route files exist and render the shared page template", () => {
  for (const page of listHealthcareTestBankPages()) {
    const file = routeFileForPath(page.path);
    assert.ok(fs.existsSync(file), `missing route file for ${page.path}`);
    const src = fs.readFileSync(file, "utf8");
    assert.match(src, /metadataForHealthcareTestBankPage/, `${page.path} missing metadata helper`);
    assert.match(src, /HealthcareTestBankPage/, `${page.path} missing shared renderer`);
  }
});

test("healthcare test-bank sitemap fallback includes only activated canonical routes", () => {
  const fallback = new Set(SITEMAP_FALLBACK_PATHWAYS_PATHS);
  for (const page of listHealthcareTestBankPages()) {
    assert.ok(fallback.has(page.path), `sitemap fallback missing ${page.path}`);
  }
  for (const alias of ["/nclex-rn/test-bank", "/rex-pn/test-bank", "/cnple/test-bank", "/np/test-bank"]) {
    assert.ok(!fallback.has(alias), `planned alias leaked into sitemap fallback: ${alias}`);
  }
});

test("planned short test-bank aliases have explicit inactive route files", () => {
  for (const alias of ["/nclex-rn/test-bank", "/rex-pn/test-bank", "/cnple/test-bank", "/np/test-bank"]) {
    const file = path.join(appRoot, ...alias.split("/").filter(Boolean), "page.tsx");
    assert.ok(fs.existsSync(file), `missing inactive alias route file for ${alias}`);
    assert.match(fs.readFileSync(file, "utf8"), /notFound\(\)/, `${alias} must remain inactive until substantive content exists`);
  }
});
