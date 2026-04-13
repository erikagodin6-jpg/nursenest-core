import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  THEME_LOGO_SPACE_KEYS,
  resolveThemeLogo,
} from "@/lib/branding/resolve-theme-logo";
import { THEME_LOGOS } from "@/lib/theme/theme-logo-config";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

describe("resolveThemeLogo", () => {
  it("returns a same-origin SVG path for a mapped theme (full variant)", () => {
    const r = resolveThemeLogo("teal", "full");
    assert.equal(r.kind, "local");
    assert.equal(r.url, "/logos/teal-brandlogo.svg");
    assert.equal(r.objectKey, null);
    assert.equal(r.assetThemeId, "teal");
  });

  it("resolves every registered theme id to its own local SVG (no CDN borrow)", () => {
    const r = resolveThemeLogo("ocean-mist", "full");
    assert.equal(r.kind, "local");
    assert.equal(r.assetThemeId, "ocean-mist");
    assert.equal(r.url, "/logos/ocean-mist-brandlogo.svg");
  });

  it("returns text-fallback for a non-registry / unknown theme string", () => {
    const r = resolveThemeLogo("__not_a_theme__", "full");
    assert.equal(r.kind, "text-fallback");
    assert.equal(r.url, null);
    assert.equal(r.objectKey, null);
    assert.equal(r.assetThemeId, null);
  });

  it("returns a /logos path for slate", () => {
    const r = resolveThemeLogo("slate", "full");
    assert.equal(r.kind, "local");
    assert.ok(r.url?.startsWith("/logos/"), r.url ?? "");
    assert.equal(r.url, "/logos/slate-brandlogo.svg");
  });

  it("resolves every registered theme to a local URL", () => {
    for (const t of THEME_OPTIONS) {
      const r = resolveThemeLogo(t.id, "full");
      assert.equal(r.kind, "local", t.id);
      assert.ok(r.url && r.url.startsWith("/logos/"), t.id);
      assert.equal(r.url, THEME_LOGOS[t.id], t.id);
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
