import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import {
  NURSENEST_APP_ICON_VERSION,
  NURSENEST_LEAF_BRAND_COLOR,
  NURSENEST_PINK_FAVICON_PATH,
  NURSENEST_PINK_FAVICON_URL,
  nursenestAppIcons,
} from "@/lib/branding/app-icons";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function publicFile(rel: string): string {
  return path.join(pkgRoot, "public", rel.replace(/^\//, ""));
}

describe("NurseNest app icons (canonical leaf)", () => {
  it("exports one cache-busted same-origin pink favicon path for metadata", () => {
    assert.equal(nursenestAppIcons.favicon, NURSENEST_PINK_FAVICON_PATH);
    assert.equal(nursenestAppIcons.ico, "/favicon.ico");
    assert.equal(nursenestAppIcons.apple, "/apple-touch-icon.png");
    assert.equal(nursenestAppIcons.png192, "/icon-192.png");
    assert.equal(nursenestAppIcons.png512, "/icon-512.png");
    assert.equal(
      NURSENEST_PINK_FAVICON_URL,
      "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/pinkfavicon.png",
    );
    assert.equal(NURSENEST_APP_ICON_VERSION, "2026-05-22-pink-v3");
    assert.equal(NURSENEST_LEAF_BRAND_COLOR, "#f72fa8");
  });

  it("layout.tsx references shared app-icons module", () => {
    const layout = readFileSync(path.join(pkgRoot, "src/app/layout.tsx"), "utf8");
    assert.match(layout, /from "@\/lib\/branding\/app-icons"/);
    assert.match(layout, /nursenestAppIcons\.favicon/);
    assert.doesNotMatch(layout, /rel="icon"/);
    assert.doesNotMatch(layout, /rel="shortcut icon"/);
    assert.doesNotMatch(layout, /rel="apple-touch-icon"/);
    assert.doesNotMatch(layout, /mask-icon/);
  });

  it("public fallback icon files exist and are non-trivial after icons:generate", () => {
    const ico = readFileSync(publicFile("/favicon.ico"));
    assert.ok(ico.byteLength > 200, "favicon.ico should be regenerated from pinkfavicon.png");
    const png = readFileSync(publicFile(NURSENEST_PINK_FAVICON_PATH));
    assert.ok(png.byteLength > 1000, `${NURSENEST_PINK_FAVICON_PATH} should be generated from pinkfavicon.png`);
  });

  it("manifest.json references only generated same-origin app icons", () => {
    const manifest = readFileSync(publicFile("/manifest.json"), "utf8");
    assert.match(manifest, /"src": "\/icon-192\.png"/);
    assert.match(manifest, /"src": "\/icon-512\.png"/);
    assert.doesNotMatch(manifest, /favicon\.ico|apple-touch-icon|https?:\/\//);
    assert.match(manifest, /"theme_color": "#f72fa8"/);
  });
});
