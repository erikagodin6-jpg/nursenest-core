import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { THEME_LOGO_SPACE_KEYS, resolveThemeLogo } from "@/lib/branding/resolve-theme-logo";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

const CDN_BASE = "https://nursenest-images.tor1.cdn.digitaloceanspaces.com";

describe("resolveThemeLogo", () => {
  it("returns exact public CDN URL for a mapped theme (full variant)", () => {
    const r = resolveThemeLogo("teal", "full");
    assert.equal(r.kind, "cdn");
    assert.ok(r.url?.startsWith(CDN_BASE), r.url ?? "");
    assert.equal(
      r.url,
      `${CDN_BASE}/Logos/teal-leaf_transparent.png`,
    );
    assert.equal(r.objectKey, "Logos/teal-leaf_transparent.png");
  });

  it("returns null and text-fallback for an unmapped registered theme", () => {
    const r = resolveThemeLogo("ocean-mist", "full");
    assert.equal(r.kind, "text-fallback");
    assert.equal(r.url, null);
    assert.equal(r.objectKey, null);
  });

  it("does not return a same-origin path for a mapped theme", () => {
    const r = resolveThemeLogo("slate", "full");
    assert.equal(r.kind, "cdn");
    assert.ok(r.url && !r.url.startsWith("/"), r.url ?? "");
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
