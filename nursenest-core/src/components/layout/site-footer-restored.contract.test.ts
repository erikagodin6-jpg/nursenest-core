import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

function read(relPath: string): string {
  return readFileSync(join(ROOT, relPath), "utf8");
}

describe("restored global marketing footer — clean minimal structure", () => {
  const footer = read("src/components/layout/site-footer.tsx");
  const footerNav = read("src/lib/navigation/footer-marketing-nav.ts");
  const marketingHubs = read("src/lib/marketing/marketing-entry-routes.ts");
  const footerSources = `${footer}\n${footerNav}\n${marketingHubs}`;

  it("includes required clean footer sections (Company, Exams, Study Tools, Support, Legal)", () => {
    for (const label of ["Company", "Exams", "Study Tools", "Support", "Legal"]) {
      assert.match(footer, new RegExp(label), `footer missing ${label} section`);
    }
  });

  it("no longer includes redundant sections (Platform, Resources)", () => {
    const hasPlatform = /Platform/.test(footer);
    assert.equal(hasPlatform, false, 'footer must not contain redundant "Platform" section');
    const hasResources = /Resources/.test(footer);
    assert.equal(hasResources, false, 'footer must not contain redundant "Resources" section (overlaps other sections)');
  });

  it("links required footer destinations to routable pages", () => {
    const expectedRoutes = [
      "/about",
      "/contact",
      "/careers",
      "/blog",
      "/privacy",
      "/terms",
      "/disclaimer",
      "/editorial-policy",
      "/faq",
      "/support",
      "/new-grad",
    ];

    for (const route of expectedRoutes) {
      assert.match(footerSources, new RegExp(route.replace("/", "\\/")), `footer missing ${route}`);
    }
  });

  it("no longer links bloated old footer routes", () => {
    const removed = ["/cookie-policy", "/membership-tiers", "/enterprise-solutions", "/for-institutions", "/features", "/providers/resources", "/patients/find-care", "/how-it-works"];
    for (const route of removed) {
      const stillPresent = new RegExp(route.replace("/", "\\/")).test(footer);
      assert.equal(stillPresent, false, `footer must not link removed route ${route}`);
    }
  });

  it("has page files for all footer-linked routes", () => {
    const routeFiles = [
      "src/app/(marketing)/(default)/careers/page.tsx",
      "src/app/(marketing)/(default)/about/page.tsx",
      "src/app/(marketing)/(default)/blog/page.tsx",
      "src/app/(marketing)/(default)/contact/page.tsx",
      "src/app/(marketing)/(default)/privacy/page.tsx",
      "src/app/(marketing)/(default)/terms/page.tsx",
      "src/app/(marketing)/(default)/disclaimer/page.tsx",
      "src/app/(marketing)/(default)/faq/page.tsx",
      "src/app/(marketing)/(default)/support/page.tsx",
    ];

    for (const relPath of routeFiles) {
      assert.equal(existsSync(join(ROOT, relPath)), true, `${relPath} is missing`);
    }
  });

  it("keeps footer in normal, static-home, and failsafe marketing shells", () => {
    const layout = read("src/app/(marketing)/(default)/layout.tsx");
    assert.match(layout, /SiteFooter/, "marketing layout should reference SiteFooter");
    assert.match(layout, /defaultMarketingSiteFooter|trailingChrome/, "marketing layout should stream footer via trailing chrome");
  });

  it("footer hrefs resolve to known App Router paths (audit-footer-links)", () => {
    const result = spawnSync("npx", ["tsx", "scripts/audit-footer-links.mts"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    assert.equal(
      result.status,
      0,
      result.stderr?.trim() || result.stdout?.trim() || "audit-footer-links failed",
    );
  });
});

describe("pricing page business audience coverage", () => {
  const pricing = read("src/components/marketing/pricing-page-client.tsx");

  it("includes required pricing audiences and CTAs", () => {
    for (const copy of [
      "Individual Providers",
      "Clinics",
      "Healthcare Organizations",
      "Institutional / Enterprise Pricing",
      "Book a Demo",
      "Contact Sales",
      "Get Started",
      "custom contracts",
      "multi-provider onboarding",
      "enterprise support",
      "analytics and reporting",
      "API/EHR integration planning",
      "Scalable licensing",
    ]) {
      assert.match(pricing, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `pricing missing ${copy}`);
    }
  });
});
