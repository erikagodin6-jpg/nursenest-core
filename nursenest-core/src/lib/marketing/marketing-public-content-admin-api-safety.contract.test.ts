/**
 * Static contracts for admin marketing public content API — RBAC, empty publish rejection,
 * and public loader draft isolation (no anonymous draft leakage).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const appRoot = join(process.cwd(), "src");

describe("marketing public content admin API safety contracts", () => {
  it("GET and POST require admin gate", () => {
    const src = readFileSync(join(appRoot, "app/api/admin/marketing-public-content/route.ts"), "utf8");
    const getIdx = src.indexOf("export async function GET");
    const postIdx = src.indexOf("export async function POST");
    assert.ok(getIdx >= 0 && src.slice(getIdx, getIdx + 400).includes("requireAdmin"));
    assert.ok(postIdx >= 0 && src.slice(postIdx, postIdx + 400).includes("requireAdmin"));
  });

  it("immediate publish rejects empty trimmed value", () => {
    const src = readFileSync(join(appRoot, "app/api/admin/marketing-public-content/route.ts"), "utf8");
    assert.match(src, /empty_value/);
    assert.match(src, /Published text cannot be empty/);
  });

  it("public override loader only selects published rows", () => {
    const src = readFileSync(join(appRoot, "lib/marketing/load-marketing-public-content-overrides.ts"), "utf8");
    assert.match(src, /isPublished:\s*true/);
  });

  it("GET enriches slots with default catalog for search + diagnostics", () => {
    const src = readFileSync(join(appRoot, "app/api/admin/marketing-public-content/route.ts"), "utf8");
    assert.match(src, /defaultCatalogValue/);
    assert.match(src, /getMarketingPublicContentDefaultCatalogValue/);
  });

  it("marketing public content route imports requireAdmin from ensure-admin", () => {
    const src = readFileSync(join(appRoot, "app/api/admin/marketing-public-content/route.ts"), "utf8");
    assert.match(src, /from\s+"@\/lib\/admin\/ensure-admin"/);
    assert.match(src, /requireAdmin\(req\)/);
  });

  it("marketing layouts fail-soft when override loader rejects", () => {
    const src = readFileSync(join(appRoot, "app/(marketing)/[locale]/layout.tsx"), "utf8");
    assert.match(
      src,
      /loadMarketingPublicContentOverridesForLocale\([^\)]*\)\.catch\(\(\)\s*=>\s*\(\{\}\s+as\s+Record<string,\s*string>\)\)/,
    );
  });
});
