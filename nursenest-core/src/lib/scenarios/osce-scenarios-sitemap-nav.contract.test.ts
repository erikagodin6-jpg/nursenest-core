import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import { collectOsceScenariosMarketingHubUrls } from "@/lib/scenarios/scenario-marketing-sitemap-urls";
import { resolveOsceScenarioRouteAccessMode } from "@/lib/scenarios/scenario-access";
import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

describe("OSCE / clinical scenarios gates", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS;
    delete process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS;
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  });

  it("collectOsceScenariosMarketingHubUrls is empty when both public flags are off", () => {
    delete process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS;
    delete process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS;
    const urls = collectOsceScenariosMarketingHubUrls("https://example.com");
    assert.equal(urls.length, 0);
  });

  it("collectOsceScenariosMarketingHubUrls includes OSCE hubs when OSCE flag is on (clinical flag off → no clinical-scenarios URLs)", () => {
    process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS = "true";
    delete process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS;
    const urls = collectOsceScenariosMarketingHubUrls("https://example.com");
    assert.ok(urls.length > 0);
    assert.ok(urls.some((u) => u.endsWith("/osce")));
    assert.equal(urls.some((u) => u.includes("clinical-scenarios")), false);
    const alliedOsce = urls.filter((u) => u.includes("allied-health") && u.endsWith("/osce"));
    assert.equal(alliedOsce.length, 0);
    const rnOsce = urls.filter((u) => /\/us\/rn\/[^/]+\/osce$/u.test(new URL(u).pathname));
    assert.ok(rnOsce.length >= 1, "expected at least one US RN OSCE marketing URL");
  });

  it("collectOsceScenariosMarketingHubUrls adds clinical-scenarios only when clinical flag is on", () => {
    process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS = "true";
    process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS = "true";
    const urls = collectOsceScenariosMarketingHubUrls("https://example.com");
    assert.ok(urls.some((u) => u.includes("clinical-scenarios")));
  });

  it("resolveOsceScenarioRouteAccessMode returns production_blocked in production when flag is off", () => {
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS;
    assert.equal(resolveOsceScenarioRouteAccessMode(), "production_blocked");
  });

  it("resolveOsceScenarioRouteAccessMode returns dev_preview outside production when flag is off", () => {
    process.env.NODE_ENV = "development";
    delete process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS;
    assert.equal(resolveOsceScenarioRouteAccessMode(), "dev_preview");
  });

  it("isOsceScenariosPubliclyEnabled is true only for explicit true string", () => {
    delete process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS;
    assert.equal(isOsceScenariosPubliclyEnabled(), false);
    process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS = "false";
    assert.equal(isOsceScenariosPubliclyEnabled(), false);
    process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS = "true";
    assert.equal(isOsceScenariosPubliclyEnabled(), true);
  });
});
