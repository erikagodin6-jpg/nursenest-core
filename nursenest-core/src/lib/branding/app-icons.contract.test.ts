import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import {
  NURSENEST_APP_ICON_VERSION,
  NURSENEST_LEAF_BRAND_COLOR,
  NURSENEST_PINK_FAVICON_URL,
  nursenestAppIcons,
} from "@/lib/branding/app-icons";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function publicFile(rel: string): string {
  return path.join(pkgRoot, "public", rel.replace(/^\//, ""));
}

describe("NurseNest app icons (canonical leaf)", () => {
  it("exports only the approved CDN pink favicon for favicon surfaces", () => {
    for (const url of [
      nursenestAppIcons.favicon,
      nursenestAppIcons.ico,
      nursenestAppIcons.apple,
      nursenestAppIcons.png192,
      nursenestAppIcons.png512,
      nursenestAppIcons.mask,
    ]) {
      assert.match(url, new RegExp(`${NURSENEST_PINK_FAVICON_URL}\\?v=`));
    }
    assert.equal(NURSENEST_APP_ICON_VERSION, "2026-05-21-cdn-pink");
    assert.equal(NURSENEST_LEAF_BRAND_COLOR, "#f72fa8");
  });

  it("layout.tsx references shared app-icons module", () => {
    const layout = readFileSync(path.join(pkgRoot, "src/app/layout.tsx"), "utf8");
    assert.match(layout, /from "@\/lib\/branding\/app-icons"/);
    assert.match(layout, /nursenestAppIcons\.favicon/);
    assert.doesNotMatch(layout, /mask-icon/);
  });

  it("manifest.json references only the approved CDN pink favicon", () => {
    const manifest = readFileSync(publicFile("/manifest.json"), "utf8");
    assert.match(manifest, new RegExp(`${NURSENEST_PINK_FAVICON_URL}\\?v=${NURSENEST_APP_ICON_VERSION}`));
    assert.doesNotMatch(manifest, /favicon\.ico|icon-192\.png|icon-512\.png|apple-touch-icon/);
    assert.match(manifest, /"theme_color": "#f72fa8"/);
  });
});
