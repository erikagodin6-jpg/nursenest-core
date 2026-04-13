import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  THEME_LOGO_SPACE_KEYS,
  resolveThemeLogo,
} from "@/lib/branding/resolve-theme-logo";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

describe("resolveThemeLogo", () => {
  it("returns a CDN URL for a mapped theme (full variant)", () => {
    const r = resolveThemeLogo("teal", "full");
    assert.equal(r.kind, "local");
    assert.equal(r.url, "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/teal-leaf_transparent.png");
    assert.equal(r.objectKey, "Logos/teal-leaf_transparent.png");
    assert.equal(r.assetThemeId, "teal");
  });

  it("resolves every registered theme id from the explicit CDN key map", () => {
    const r = resolveThemeLogo("ocean-mist", "full");
    assert.equal(r.kind, "local");
    assert.equal(r.assetThemeId, "ocean-mist");
    assert.equal(r.objectKey, "Logos/north-sea-leaf-transparent.png");
    assert.equal(r.url, "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png");
  });

  it("falls back to the intentional default mapped theme for unknown theme strings", () => {
    const r = resolveThemeLogo("__not_a_theme__", "full");
    assert.equal(r.kind, "local");
    assert.equal(r.assetThemeId, "ocean");
    assert.equal(r.objectKey, "Logos/north-sea-leaf-transparent.png");
    assert.equal(r.url, "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png");
  });

  it("returns an explicit mapped key for slate", () => {
    const r = resolveThemeLogo("slate", "full");
    assert.equal(r.kind, "local");
    assert.equal(r.objectKey, "Logos/slate-leaf_transparent.png");
    assert.equal(r.url, "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/slate-leaf_transparent.png");
  });

  it("resolves every registered theme to a mapped CDN URL", () => {
    for (const t of THEME_OPTIONS) {
      const r = resolveThemeLogo(t.id, "full");
      assert.equal(r.kind, "local", t.id);
      assert.ok(r.objectKey && r.objectKey.startsWith("Logos/"), t.id);
      assert.ok(r.url && r.url.includes("/Logos/"), t.id);
      assert.equal(r.assetThemeId, t.id, t.id);
    }
  });

  it("has no duplicate keys in THEME_LOGO_SPACE_KEYS (object literal guarantee + registry check)", () => {
    const keys = Object.keys(THEME_LOGO_SPACE_KEYS);
    assert.equal(keys.length, new Set(keys).size);
    const allowed = new Set(THEME_OPTIONS.map((t) => t.id));
    for (const id of keys) {
      assert.ok(allowed.has(id), `unexpected theme id in map: ${id}`);
    }
  });
});
