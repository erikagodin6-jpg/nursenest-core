import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const coreRoot = join(here, "..", "..");

describe("Pre-Nursing marketing hub surface", () => {
  it("default and locale pre-nursing pages render the shared hub with premium foundations modules", () => {
    const defaultPage = readFileSync(
      join(coreRoot, "app/(marketing)/(default)/pre-nursing/page.tsx"),
      "utf8",
    );
    const localePage = readFileSync(join(coreRoot, "app/(marketing)/[locale]/pre-nursing/page.tsx"), "utf8");
    assert.match(defaultPage, /PreNursingMarketingHubMain/);
    assert.match(localePage, /PreNursingMarketingHubMain/);
    assert.match(defaultPage, /linkHref=\{\(p\) => p\}/);
    assert.match(localePage, /linkHref=\{\(p\) => l\(p\)\}/);
    assert.match(defaultPage, /heroTitle="Pre-Nursing"/);
  });
});
