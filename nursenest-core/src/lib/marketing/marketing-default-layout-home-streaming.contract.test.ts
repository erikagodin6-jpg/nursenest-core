import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(here, "..", "..");

function readSrc(relativeFromSrc: string): string {
  return readFileSync(join(srcRoot, relativeFromSrc), "utf8");
}

test("default marketing layout streams SiteFooter via MarketingMainI18nShards trailingChrome (not before deferred main)", () => {
  const layout = readSrc("app/(marketing)/(default)/layout.tsx");
  assert.match(layout, /trailingChrome=\{\s*<SiteFooter/s);
  assert.match(layout, /<MarketingMainI18nShards[\s\S]*trailingChrome=/s);
});

test("locale marketing layout streams SiteFooter via MarketingMainI18nShards trailingChrome", () => {
  const layout = readSrc("app/(marketing)/[locale]/layout.tsx");
  assert.match(layout, /trailingChrome=\{\s*<SiteFooter/s);
  assert.doesNotMatch(layout, /<\/main>\s*\n\s*<SiteFooter/s);
});

test("marketing main shards component accepts trailingChrome after children", () => {
  const shards = readSrc("components/i18n/marketing-main-i18n-shards.tsx");
  assert.match(shards, /trailingChrome\?:/);
  assert.match(shards, /\{trailingChrome\}/);
});

test("homepage passes global intro as HomeRestoredWithDeferredStats children (not introAfterHero prop)", () => {
  const page = readSrc("app/(marketing)/(default)/page.tsx");
  assert.doesNotMatch(page, /introAfterHero/);
  assert.match(page, /HomepageGlobalIntroSlot/);
  assert.match(page, /children:\s*<HomepageGlobalIntroSlot\s*\/>/);
});

test("HomeRestoredWithDeferredStats forwards children into HomeRestoredClient", () => {
  const stats = readSrc("components/marketing/home-restored-with-deferred-stats.server.tsx");
  assert.match(stats, /<HomeRestoredClient[\s\S]*>\s*\{\s*children\s*\}\s*<\/HomeRestoredClient>/s);
});

test("HomeRestoredClient renders PremiumHomepageHero before children slot (global hub strip)", () => {
  const client = readSrc("components/marketing/home-restored-client.tsx");
  const hero = client.indexOf("<PremiumHomepageHero");
  const childrenSlot = client.indexOf("{children}");
  assert.ok(hero !== -1, "expected PremiumHomepageHero");
  assert.ok(childrenSlot !== -1, "expected children slot");
  assert.ok(hero < childrenSlot, "hero must precede children slot in source order");
});

/**
 * Network smoke (off by default): `RUN_HOMEPAGE_NETWORK_SMOKE=1 npm run test:homepage`
 */
test("optional: homepage HTML has hero before footer marketing copy", async (t) => {
  if (process.env.RUN_HOMEPAGE_NETWORK_SMOKE !== "1") {
    t.skip();
    return;
  }
  const url = process.env.HOMEPAGE_SMOKE_URL ?? "https://www.nursenest.ca/";
  let html: string;
  try {
    const res = await fetch(url, { redirect: "follow" });
    assert.equal(res.ok, true, `fetch ${url} status ${res.status}`);
    html = await res.text();
  } catch {
    t.skip();
    return;
  }
  const hero = html.indexOf("home-conversion-hero-heading");
  const footer = html.indexOf("Supporting Nurses Globally");
  const globalOverview = html.indexOf("Global marketing overview");
  const globalHeadline = html.indexOf("Canada-First Nursing Exam Prep, Built for Nurses Worldwide");
  assert.ok(hero !== -1, "expected home hero heading in HTML");
  assert.ok(footer !== -1, "expected footer copy in HTML");
  assert.ok(hero < footer, `hero should appear before footer in HTML (hero@${hero} footer@${footer})`);
  if (globalOverview !== -1) {
    assert.ok(
      hero < globalOverview,
      `hero should appear before global intro landmark (hero@${hero} global@${globalOverview})`,
    );
  }
  if (globalHeadline !== -1) {
    assert.ok(
      hero < globalHeadline,
      `hero should appear before global root headline copy (hero@${hero} headline@${globalHeadline})`,
    );
  }
});
