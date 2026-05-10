import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { AlliedHealthPathwayHub } from "@/components/marketing/allied-health-pathway-hub";
import { ALLIED_GLOBAL_HUB_PATH } from "@/lib/allied/allied-global-pathway";
import { resolveAlliedProfessionFromRouteSlug } from "@/lib/allied/allied-professions-registry";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, "..", "..", "..");
const REPO_ROOT = resolve(PKG_ROOT, "..");
const MARKETING_EN = join(REPO_ROOT, "tools", "i18n", "marketing", "marketing-en.json");

function loadMarketingEn(): Record<string, string> {
  return JSON.parse(readFileSync(MARKETING_EN, "utf8")) as Record<string, string>;
}

const overviewPagePath = join(process.cwd(), "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx");
const homepagePath = join(process.cwd(), "src/app/(marketing)/(default)/page.tsx");
const globalAlliedPagePath = join(process.cwd(), "src/app/(marketing)/(default)/allied/allied-health/page.tsx");

const labsModuleOverview = {
  lessonCount: 99,
  flashcardDeckCount: 2,
  practiceExamReady: true,
  questionSnapshot: {
    status: "ok" as const,
    pathwayScopedCount: 50,
    adaptiveEligibleCount: 10,
    examKeys: ["ALLIED"],
  },
  moduleCards: [] as const,
};

describe("allied health pathway hub route smoke", () => {
  it("resolves public allied pathway hubs to real pathway records", async () => {
    const cases = [
      { country: "canada", role: "allied", exam: "allied-health", pathwayId: "ca-allied-core" },
      { country: "us", role: "allied", exam: "allied-health", pathwayId: "us-allied-core" },
    ] as const;

    for (const row of cases) {
      const resolved = await resolveExamPathwaySafe(row.country, row.role, row.exam, {
        pathname: `/${row.country}/${row.role}/${row.exam}`,
      });
      assert.ok(resolved, `expected allied hub to resolve for ${row.country}`);
      assert.equal(resolved?.id, row.pathwayId);
      assert.equal(buildExamPathwayPath(resolved!), ALLIED_GLOBAL_HUB_PATH);
    }
  });

  it("renders Allied Health-specific hub content for the global allied route", () => {
    const pathway = getExamPathwayById("ca-allied-core");
    assert.ok(pathway);

    const html = renderToStaticMarkup(
      <AlliedHealthPathwayHub
        pathway={pathway!}
        hubPath={ALLIED_GLOBAL_HUB_PATH}
        overview={{
          lessonCount: 42,
          flashcardDeckCount: 3,
          practiceExamReady: true,
          questionSnapshot: {
            status: "ok",
            pathwayScopedCount: 120,
            adaptiveEligibleCount: 55,
            examKeys: ["ALLIED"],
          },
          moduleCards: [],
        }}
      />,
    );

    assert.match(html, /Choose your Allied Health track/);
    assert.doesNotMatch(html, /Practice exams/);
    assert.doesNotMatch(html, /nn-qa-allied-hub-practice-exams/);
    assert.match(html, /Open study hub/);
    assert.match(html, /href="\/allied\/[^"]+"/);
    assert.match(html, /Units for allied study/);
    assert.doesNotMatch(html, /Homepage content failed to load/);
    assert.doesNotMatch(html, /Go home/);
  });

  it("locale-prefixed allied hub mirrors global occupation chooser (no study mode strip)", () => {
    const pathway = getExamPathwayById("us-allied-core");
    assert.ok(pathway);
    const html = renderToStaticMarkup(
      <AlliedHealthPathwayHub pathway={pathway!} hubPath="/us/allied/allied-health" overview={labsModuleOverview} />,
    );
    assert.match(html, /Choose your Allied Health track/);
    assert.doesNotMatch(html, /Study modes/);
    assert.match(html, /Open study hub/);
    assert.doesNotMatch(html, /nn-qa-allied-hub-lessons/);
    assert.doesNotMatch(html, /Homepage content failed to load/);
  });

  it("occupation-scoped allied hub renders study modes and module strip", () => {
    const pathway = getExamPathwayById("us-allied-core");
    assert.ok(pathway);
    const prof = resolveAlliedProfessionFromRouteSlug("medical-assistant-exam-prep");
    assert.ok(prof);
    const messages = loadMarketingEn();
    const html = renderToStaticMarkup(
      <MarketingI18nProvider locale="en" messages={messages}>
        <AlliedHealthPathwayHub
          pathway={pathway!}
          hubPath={`/allied/${prof.professionKey}`}
          profession={prof}
          overview={labsModuleOverview}
        />
      </MarketingI18nProvider>,
    );
    assert.match(html, /Study modes/);
    assert.match(html, /nn-qa-allied-hub-lessons/);
    assert.doesNotMatch(html, /Specialized modules/);
  });

  it("allied exam hub + global hub pages load overview and measurement wiring (no Canada-only directory fork)", () => {
    const globalSrc = readFileSync(globalAlliedPagePath, "utf8");
    const src = readFileSync(overviewPagePath, "utf8");
    const layoutPath = join(process.cwd(), "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/layout.tsx");
    const layoutSrc = readFileSync(layoutPath, "utf8");
    const nextConfig = readFileSync(join(process.cwd(), "next.config.mjs"), "utf8");
    assert.match(globalSrc, /ALLIED_GLOBAL_HUB_PATH/);
    assert.match(globalSrc, /fallbackAlliedPathwayHubOverview/);
    assert.match(globalSrc, /syncMeasurementPreferenceToProfile/);
    assert.match(src, /loadAlliedPathwayHubOverview/);
    assert.match(src, /const isAlliedHub = pathway\.roleTrack === "allied" && pathway\.examCode === "allied-health"/);
    assert.doesNotMatch(src, /alliedCanadaOccupationDirectoryHub/);
    assert.match(layoutSrc, /legacyCountryAlliedHealthMarketingRedirectDestination/);
    assert.ok(nextConfig.includes("/canada/allied/allied-health"));
    assert.match(src, /allied_hub_route_diagnostic/);
  });

  it("homepage source remains untouched by the allied hub fix", () => {
    const src = readFileSync(homepagePath, "utf8");
    assert.match(src, /HomeRestoredWithDeferredStats/);
    assert.match(src, /MarketingHomeEmergencyFallback/);
    assert.doesNotMatch(src, /loadAlliedPathwayHubOverview/);
  });
});
