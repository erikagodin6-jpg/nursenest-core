/**
 * Paramedic / EMS slice governance contracts.
 *
 * Run: node --import tsx --test src/lib/paramedic/paramedic-readiness.contract.test.ts
 *
 * These tests guard the first production EMS vertical slice:
 * - Airway + trauma curriculum readiness
 * - ECG adapter reuses canonical ECG curriculum instead of duplicating it
 * - Scenario catalog contains operational metadata and readiness domains
 * - Slice readiness snapshot remains honest about UI/questions/billing gaps
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PARAMEDIC_AIRWAY_FOUNDATIONS_READINESS_PERCENT } from "./airway/paramedic-airway-foundations";
import { PARAMEDIC_TRAUMA_FOUNDATIONS_READINESS_PERCENT } from "./trauma/paramedic-trauma-foundations";
import {
  PARAMEDIC_ECG_ADAPTER_READINESS_PERCENT,
  PARAMEDIC_ECG_TOPIC_ADAPTERS,
  buildParamedicEcgStateFromCoreTopic,
  getParamedicEcgMappedTopics,
  listCoreEcgTopicsNotYetMappedForParamedic,
} from "./runtime/ecg-module-adapter";
import {
  PARAMEDIC_SCENARIO_CATALOG,
  PARAMEDIC_SCENARIO_CATALOG_READINESS_PERCENT,
  getParamedicScenarioBySlug,
  getParamedicScenarioOperationalRisk,
} from "./scenarios/paramedic-scenario-catalog";
import {
  PARAMEDIC_SLICE_READINESS_SNAPSHOT,
  calculateParamedicOverallReadinessPercent,
  getParamedicReadinessAreas,
} from "./paramedic-readiness";

describe("Paramedic curriculum readiness", () => {
  it("airway foundations are production-ready at the scaffold level", () => {
    assert.ok(
      PARAMEDIC_AIRWAY_FOUNDATIONS_READINESS_PERCENT >= 95,
      `Airway readiness expected >=95, got ${PARAMEDIC_AIRWAY_FOUNDATIONS_READINESS_PERCENT}`,
    );
  });

  it("trauma foundations are production-ready at the scaffold level", () => {
    assert.ok(
      PARAMEDIC_TRAUMA_FOUNDATIONS_READINESS_PERCENT >= 95,
      `Trauma readiness expected >=95, got ${PARAMEDIC_TRAUMA_FOUNDATIONS_READINESS_PERCENT}`,
    );
  });
});

describe("Paramedic ECG adapter governance", () => {
  it("maps EMS ECG to existing canonical ECG curriculum topics", () => {
    const mapped = getParamedicEcgMappedTopics();
    assert.ok(mapped.length >= 5, `Expected at least 5 mapped ECG topics, got ${mapped.length}`);
    assert.equal(mapped.length, PARAMEDIC_ECG_TOPIC_ADAPTERS.length, "Every paramedic ECG adapter must resolve to a core ECG topic");
  });

  it("keeps the ECG adapter readiness high without duplicating the core ECG module", () => {
    assert.ok(
      PARAMEDIC_ECG_ADAPTER_READINESS_PERCENT >= 90,
      `ECG adapter readiness expected >=90, got ${PARAMEDIC_ECG_ADAPTER_READINESS_PERCENT}`,
    );
  });

  it("builds an EMS ECG state from core ST-T changes for STEMI transport framing", () => {
    const state = buildParamedicEcgStateFromCoreTopic("st-t-changes");
    assert.ok(state, "Expected st-t-changes to build an EMS ECG runtime state");
    assert.ok(state!.findings.length >= 1, "Expected at least one EMS ECG finding");
    assert.ok(state!.perfusionRisk >= 35, "ST-T changes should carry meaningful EMS perfusion risk");
  });

  it("leaves unmapped ECG topics available for future EMS expansion", () => {
    const unmapped = listCoreEcgTopicsNotYetMappedForParamedic();
    assert.ok(unmapped.length >= 1, "Expected some core ECG topics to remain unmapped for future EMS expansion");
  });
});

describe("Paramedic scenario governance", () => {
  it("catalogs the inferior STEMI rural transport scenario", () => {
    const entry = getParamedicScenarioBySlug("inferior-stemi-rural-transport");
    assert.ok(entry, "Inferior STEMI scenario must be cataloged");
    assert.equal(entry!.scenario.category, "cardiology");
    assert.ok(entry!.readinessDomains.includes("transport-decision"));
    assert.ok(entry!.readinessDomains.includes("reassessment"));
  });

  it("scenario catalog is production-candidate at the scaffold level", () => {
    assert.ok(
      PARAMEDIC_SCENARIO_CATALOG_READINESS_PERCENT >= 85,
      `Scenario catalog readiness expected >=85, got ${PARAMEDIC_SCENARIO_CATALOG_READINESS_PERCENT}`,
    );
  });

  it("scenario operational risk recognizes inferior STEMI as high acuity", () => {
    const risk = getParamedicScenarioOperationalRisk("inferior-stemi-rural-transport");
    assert.ok(risk !== null, "Expected operational risk for inferior STEMI scenario");
    assert.ok(risk! >= 75, `Expected inferior STEMI operational risk >=75, got ${risk}`);
  });

  it("all catalog entries have SEO metadata and at least three readiness domains or keywords", () => {
    for (const entry of PARAMEDIC_SCENARIO_CATALOG) {
      assert.ok(entry.seo.title.length >= 20, `${entry.scenario.slug} SEO title is too short`);
      assert.ok(entry.seo.description.length >= 60, `${entry.scenario.slug} SEO description is too short`);
      assert.ok(entry.seo.keywords.length >= 3, `${entry.scenario.slug} needs at least 3 SEO keywords`);
      assert.ok(entry.readinessDomains.length >= 3, `${entry.scenario.slug} needs at least 3 readiness domains`);
    }
  });
});

describe("Paramedic slice readiness snapshot", () => {
  it("contains all required readiness areas", () => {
    const areas = getParamedicReadinessAreas().map((area) => area.area);
    for (const required of ["airway", "trauma", "ecg", "scenarios", "runtime", "ui", "questions", "billing", "qa"] as const) {
      assert.ok(areas.includes(required), `Missing readiness area: ${required}`);
    }
  });

  it("overall readiness is calculated from weighted area readiness", () => {
    const calculated = calculateParamedicOverallReadinessPercent();
    assert.equal(PARAMEDIC_SLICE_READINESS_SNAPSHOT.overallPercent, calculated);
    assert.ok(calculated >= 50, `Expected paramedic readiness >=50, got ${calculated}`);
    assert.ok(calculated < 90, "Paramedic slice should not claim production readiness before UI/questions/billing/QA are complete");
  });

  it("keeps visible product readiness honest while architecture is high", () => {
    assert.ok(PARAMEDIC_SLICE_READINESS_SNAPSHOT.architecturePercent >= 90);
    assert.ok(PARAMEDIC_SLICE_READINESS_SNAPSHOT.visibleProductPercent < 50);
  });

  it("names the next highest-impact work", () => {
    assert.ok(PARAMEDIC_SLICE_READINESS_SNAPSHOT.nextHighestImpactWork.length >= 3);
    assert.ok(
      PARAMEDIC_SLICE_READINESS_SNAPSHOT.nextHighestImpactWork.some((item) => item.toLowerCase().includes("scenario player")),
      "Next work should include building the scenario player",
    );
  });
});
