import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CANADA_NEW_GRAD_MARKETING_HUB_PATH, US_NEW_GRAD_MARKETING_HUB_PATH } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import { newGradWorkAreaHubPath } from "@/lib/navigation/new-grad-marketing-hub-paths";
import { listNewGradWorkAreaSlugs } from "@/lib/new-grad/new-grad-work-areas";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..", "app", "(marketing)", "(default)");

function assertPageExists(relativeUnderApp: string) {
  const full = join(appRoot, relativeUnderApp);
  assert.ok(existsSync(full), `expected page at ${full}`);
}

describe("New Grad work-area routes", () => {
  it("lists every slug under US and Canada marketing shells", () => {
    const slugs = listNewGradWorkAreaSlugs();
    assert.ok(slugs.length >= 20);
    for (const slug of slugs) {
      assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.equal(newGradWorkAreaHubPath("us", slug), `${US_NEW_GRAD_MARKETING_HUB_PATH}/${slug}`);
      assert.equal(newGradWorkAreaHubPath("canada", slug), `${CANADA_NEW_GRAD_MARKETING_HUB_PATH}/${slug}`);
    }
  });

  it("has matching Next.js page files for US + CA dynamic hubs", () => {
    assertPageExists(join("us", "new-grad", "[workArea]", "page.tsx"));
    assertPageExists(join("canada", "new-grad", "[workArea]", "page.tsx"));
    assertPageExists(join("us", "new-grad", "page.tsx"));
  });
});
