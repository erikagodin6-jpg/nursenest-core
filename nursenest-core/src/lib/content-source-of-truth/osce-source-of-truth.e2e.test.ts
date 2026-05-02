import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import { prisma } from "@/lib/db";
import { resolveContentRoutes } from "@/lib/content-source-of-truth/resolve-content-routes";
import { getMergedLegacyOsceSkillStations } from "@/lib/scenarios/legacy-osce-stations-runtime";
import { legacyOsceSkillStationToPrismaCreate } from "@/lib/scenarios/osce-station-mapper";
import {
  getLastOscePublicReadDiagnostics,
  getOsceSkillStationResolved,
  loadPublicOsceStationDtoByIdOrSlug,
  loadPublicOsceStationsDtos,
  resetOscePublicReadDiagnosticsForTests,
} from "@/lib/scenarios/osce-stations-resolve.server";

const SLUG = "__osce_sot_e2e_station__";

describe("OSCE source-of-truth (DB primary, admin-equivalent write)", () => {
  it("published DB row drives public + detail loaders; PATCH-visible fields match; legacy blocked when published exists", async () => {
    if (!process.env.DATABASE_URL?.trim()) return;

    try {
      await prisma.osceStation.count();
    } catch (e) {
      const msg = String(e);
      if (msg.includes("does not exist") || msg.includes("Unknown table")) return;
      throw e;
    }

    const merged = getMergedLegacyOsceSkillStations();
    const template = merged.find((s) => s.id === "head-to-toe-assessment");
    assert.ok(template);

    await prisma.osceStation.deleteMany({ where: { slug: SLUG } });

    const base = legacyOsceSkillStationToPrismaCreate(
      {
        ...template,
        id: SLUG,
        title: "E2E OSCE seed title",
        scenarioIntro: "E2E scenario intro seed",
      },
      "osce-e2e-test",
    );
    const created = await prisma.osceStation.create({ data: base });

    resetOscePublicReadDiagnosticsForTests();
    const prevFb = process.env.OSCE_LEGACY_FALLBACK;
    process.env.OSCE_LEGACY_FALLBACK = "1";

    try {
      const pub = await loadPublicOsceStationsDtos();
      assert.equal(pub.readSource, "db", "must not use legacy when published DB rows exist");
      const dto = pub.stations.find((s) => s.id === SLUG);
      assert.ok(dto?.dbId);
      assert.equal(dto?.title, "E2E OSCE seed title");
      assert.equal(dto?.scenarioIntro, "E2E scenario intro seed");
      assert.ok(Array.isArray(dto?.examinerChecklist) && dto.examinerChecklist.length > 0, "checklist renders (non-empty)");

      const single = await loadPublicOsceStationDtoByIdOrSlug(SLUG);
      assert.equal(single.readSource, "db");
      assert.equal(single.station?.dbId, created.id);

      const learner = await getOsceSkillStationResolved(SLUG);
      assert.equal(learner.readSource, "db");
      assert.equal(learner.station?.title, "E2E OSCE seed title");

      const diag = getLastOscePublicReadDiagnostics();
      assert.equal(diag?.readSource, "db");
      assert.equal(diag?.usedDbPublishedPrimary, true);

      await prisma.osceStation.update({
        where: { id: created.id },
        data: { title: "E2E OSCE patched title", scenarioIntro: "E2E scenario intro patched" },
      });

      const pub2 = await loadPublicOsceStationsDtos();
      const dto2 = pub2.stations.find((s) => s.id === SLUG);
      assert.equal(dto2?.title, "E2E OSCE patched title");
      assert.equal(dto2?.scenarioIntro, "E2E scenario intro patched");
    } finally {
      if (prevFb === undefined) delete process.env.OSCE_LEGACY_FALLBACK;
      else process.env.OSCE_LEGACY_FALLBACK = prevFb;
      resetOscePublicReadDiagnosticsForTests();
    }
  });

  it("resolveContentRoutes(osce_stations) resolves admin/public/learner templates", () => {
    const r = resolveContentRoutes("osce_stations", "head-to-toe", {
      locale: "en",
      hubSlug: "us",
      examCode: "nclex-rn",
      osceStationSlug: "head-to-toe",
    });
    assert.ok(r.publicRoute?.includes("osce"), r.publicRoute ?? "");
    assert.ok(r.learnerRoute?.includes("/app/osce"), r.learnerRoute ?? "");
    assert.ok(r.adminEditRoute?.includes("osce-stations"), r.adminEditRoute ?? "");
    assert.ok(r.adminCreateRoute?.includes("POST"), r.adminCreateRoute ?? "");
    assert.equal(r.canonicalSource, "OsceStation (osce_stations)");
    assert.equal(r.isLive, true);
  });

  after(async () => {
    if (!process.env.DATABASE_URL?.trim()) return;
    try {
      await prisma.osceStation.deleteMany({ where: { slug: SLUG } });
    } catch (e) {
      const msg = String(e);
      if (msg.includes("does not exist") || msg.includes("Unknown table")) return;
      throw e;
    }
  });
});
