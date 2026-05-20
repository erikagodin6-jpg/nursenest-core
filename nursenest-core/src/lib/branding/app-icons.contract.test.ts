import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import {
  NURSENEST_APP_ICON_VERSION,
  NURSENEST_CANONICAL_LEAF_SVG_PATH,
  NURSENEST_LEAF_BRAND_COLOR,
  NURSENEST_NAV_LEAF_SVG_PATH,
  nursenestAppIcons,
} from "@/lib/branding/app-icons";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function publicFile(rel: string): string {
  return path.join(pkgRoot, "public", rel.replace(/^\//, ""));
}

describe("NurseNest app icons (canonical leaf)", () => {
  it("exports versioned URLs for all raster and vector surfaces", () => {
    assert.match(nursenestAppIcons.svg, new RegExp(`${NURSENEST_CANONICAL_LEAF_SVG_PATH}\\?v=`));
    assert.match(nursenestAppIcons.ico, /\/favicon\.ico\?v=/);
    assert.match(nursenestAppIcons.apple, /\/apple-touch-icon\.png\?v=/);
    assert.match(nursenestAppIcons.png192, /\/icon-192\.png\?v=/);
    assert.match(nursenestAppIcons.png512, /\/icon-512\.png\?v=/);
    assert.match(nursenestAppIcons.mask, /\/mask-icon\.svg\?v=/);
    assert.equal(NURSENEST_APP_ICON_VERSION, "2026-05-20-leaf");
    assert.equal(NURSENEST_LEAF_BRAND_COLOR, "#375f7a");
  });

  it("layout.tsx references shared app-icons module", () => {
    const layout = readFileSync(path.join(pkgRoot, "src/app/layout.tsx"), "utf8");
    assert.match(layout, /from "@\/lib\/branding\/app-icons"/);
    assert.match(layout, /nursenestAppIcons\.ico/);
    assert.match(layout, /nursenestAppIcons\.svg/);
    assert.match(layout, /mask-icon/);
  });

  it("generated public raster icons exist and are non-empty", () => {
    for (const rel of ["favicon.ico", "apple-touch-icon.png", "icon-192.png", "icon-512.png"]) {
      const file = publicFile(rel);
      assert.ok(statSync(file).size > 0, `${rel} must be generated (npm run icons:generate)`);
    }
  });

  it("canonical vector marks are synced to public brand and nav paths", () => {
    const canonical = readFileSync(path.join(pkgRoot, "src/assets/brand/leaf-logo.svg"), "utf8");
    const brandPublic = readFileSync(publicFile("/brand/leaf-logo.svg"), "utf8");
    const navPublic = readFileSync(publicFile(NURSENEST_NAV_LEAF_SVG_PATH), "utf8");
    assert.equal(brandPublic, canonical);
    assert.equal(navPublic, canonical);
  });

  it("favicon source uses same outer path geometry as nav leaf", () => {
    const nav = readFileSync(path.join(pkgRoot, "src/assets/brand/leaf-logo.svg"), "utf8");
    const favicon = readFileSync(path.join(pkgRoot, "src/assets/brand/leaf-logo-favicon.svg"), "utf8");
    const outerPath = 'd="M6 40 C6 29 14.5 21 25 21 S44 29 44 40 Z"';
    assert.match(nav, new RegExp(outerPath));
    assert.match(favicon, new RegExp(outerPath));
    const innerNav = 'd="M11 40 C11 32.5 17 27 25 27 S39 32.5 39 40 Z"';
    assert.match(favicon, new RegExp(innerNav));
  });

  it("manifest.json references versioned PWA icons", () => {
    const manifest = readFileSync(publicFile("/manifest.json"), "utf8");
    assert.match(manifest, new RegExp(`favicon\\.ico\\?v=${NURSENEST_APP_ICON_VERSION}`));
    assert.match(manifest, new RegExp(`icon-192\\.png\\?v=${NURSENEST_APP_ICON_VERSION}`));
    assert.match(manifest, /"theme_color": "#375f7a"/);
  });
});
