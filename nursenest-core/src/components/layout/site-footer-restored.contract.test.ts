import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

function read(relPath: string): string {
  return readFileSync(join(ROOT, relPath), "utf8");
}

describe("restored global marketing footer", () => {
  const footer = read("src/components/layout/site-footer.tsx");
  const footerNav = read("src/lib/navigation/footer-marketing-nav.ts");
  const marketingHubs = read("src/lib/marketing/marketing-entry-routes.ts");
  const footerSources = `${footer}\n${footerNav}\n${marketingHubs}`;

  it("includes required professional footer sections", () => {
    for (const label of ["Company", "Legal", "Platform", "Exams", "Resources", "Support"]) {
      assert.match(footer, new RegExp(label), `footer missing ${label} section`);
    }
  });

  it("links required footer destinations to routable pages", () => {
    const expectedRoutes = [
      "/about",
      "/contact",
      "/careers",
      "/blog",
      "/privacy",
      "/terms",
      "/cookie-policy",
      "/disclaimer",
      "/pricing",
      "/membership-tiers",
      "/for-institutions",
      "/enterprise-solutions",
      "/features",
      "/faq",
      "/support",
      "/providers/resources",
      "/patients/find-care",
      "/how-it-works",
    ];

    for (const route of expectedRoutes) {
      assert.match(footerSources, new RegExp(route.replace("/", "\\/")), `footer missing ${route}`);
    }
  });

  it("has page files for newly restored footer routes", () => {
    const newRouteFiles = [
      "src/app/(marketing)/(default)/careers/page.tsx",
      "src/app/(marketing)/(default)/cookie-policy/page.tsx",
      "src/app/(marketing)/(default)/membership-tiers/page.tsx",
      "src/app/(marketing)/(default)/enterprise-solutions/page.tsx",
      "src/app/(marketing)/(default)/features/page.tsx",
      "src/app/(marketing)/(default)/support/page.tsx",
      "src/app/(marketing)/(default)/providers/resources/page.tsx",
      "src/app/(marketing)/(default)/patients/find-care/page.tsx",
    ];

    for (const relPath of newRouteFiles) {
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
