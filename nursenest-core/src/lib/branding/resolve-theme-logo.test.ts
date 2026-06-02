import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NURSENEST_AURORA_PAGE_LOGO_URL,
  NURSENEST_BLOSSOM_LEAF_LOGO_URL,
} from "@/lib/branding/app-icons";
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
    assert.equal(
      r.url,
      "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png",
    );
  });

  it("falls back to the intentional default mapped theme for unknown theme strings", () => {
    const r = resolveThemeLogo("__not_a_theme__", "full");
    assert.equal(r.kind, "local");
    assert.equal(r.assetThemeId, "ocean");
    assert.equal(r.objectKey, "Logos/north-sea-leaf-transparent.png");
    assert.equal(
      r.url,
      "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png",
    );
  });

  it("uses the blue North Sea leaf for Ocean (default theme)", () => {
    const r = resolveThemeLogo("ocean", "leaf");
    assert.equal(r.kind, "local");
    assert.equal(r.assetThemeId, "ocean");
    assert.ok(r.url?.includes("north-sea-leaf-transparent"));
    assert.notEqual(r.url, NURSENEST_BLOSSOM_LEAF_LOGO_URL);
  });

  it("returns an explicit mapped key for slate", () => {
    const r = resolveThemeLogo("slate", "full");
    assert.equal(r.kind, "local");
    assert.equal(r.objectKey, "Logos/slate-leaf_transparent.png");
    assert.equal(r.url, "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/slate-leaf_transparent.png");
  });

  it("uses the approved CDN leaf assets for Blossom and Aurora", () => {
    const blossom = resolveThemeLogo("blossom", "leaf");
    assert.equal(blossom.kind, "local");
    assert.equal(blossom.assetThemeId, "blossom");
    assert.equal(blossom.url, NURSENEST_BLOSSOM_LEAF_LOGO_URL);
    assert.equal(blossom.objectKey, "branding/blossom-leaf/leaf-128.webp");

    const aurora = resolveThemeLogo("aurora", "leaf");
    assert.equal(aurora.kind, "local");
    assert.equal(aurora.assetThemeId, "aurora");
    assert.equal(aurora.url, NURSENEST_AURORA_PAGE_LOGO_URL);
    assert.equal(aurora.objectKey, "00e0dc0f-b614-4e28-9fa9-33cdcf89cf0c.png");
  });

  it("uses the arctic-frost CDN leaf for arctic-frost leaf variant", () => {
    const r = resolveThemeLogo("arctic-frost", "leaf");
    assert.equal(r.kind, "local");
    assert.equal(r.assetThemeId, "arctic-frost");
    assert.ok(r.url?.includes("arcticfrost"));
    assert.notEqual(r.url, NURSENEST_BLOSSOM_LEAF_LOGO_URL);
    const full = resolveThemeLogo("arctic-frost", "full");
    assert.ok(full.url?.includes("arcticfrost"), "full variant still uses CDN map for non-header callers");
  });

  it("resolves every registered theme to a mapped CDN URL", () => {
    for (const t of THEME_OPTIONS) {
      const r = resolveThemeLogo(t.id, "full");
      assert.equal(r.kind, "local", t.id);
      assert.ok(r.objectKey, t.id);
      assert.ok(
        r.url &&
          (r.url.startsWith("https://nursenest-images.tor1.cdn.digitaloceanspaces.com/") ||
            r.url.startsWith("/branding/")),
        t.id,
      );
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
