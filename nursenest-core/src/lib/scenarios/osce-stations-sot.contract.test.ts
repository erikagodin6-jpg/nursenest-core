import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import { prisma } from "@/lib/db";
import { legacyOsceSkillStationToPrismaCreate } from "@/lib/scenarios/osce-station-mapper";
import { getMergedLegacyOsceSkillStations } from "@/lib/scenarios/legacy-osce-stations-runtime";
import { loadPublicOsceStationsDtos } from "@/lib/scenarios/osce-stations-resolve.server";

const SLUG = "__contract_osce_sot__";

describe("OSCE DB source of truth (admin write → public read)", () => {
  it("PATCH semantics via Prisma: public loader reflects title change", async () => {
    if (!process.env.DATABASE_URL?.trim()) {
      return;
    }

    try {
      await prisma.osceStation.count();
    } catch (e) {
      if (String(e).includes("does not exist")) return;
      throw e;
    }

    const merged = getMergedLegacyOsceSkillStations();
    const template = merged.find((s) => s.id === "head-to-toe-assessment");
    assert.ok(template);

    await prisma.osceStation.deleteMany({ where: { slug: SLUG } });

    const base = legacyOsceSkillStationToPrismaCreate(
      { ...template, id: SLUG, title: "OSCE SOT contract seed" },
      "contract-test",
    );
    await prisma.osceStation.create({ data: base });

    let pub = await loadPublicOsceStationsDtos();
    assert.equal(pub.readSource, "db");
    const row0 = pub.stations.find((s) => s.id === SLUG);
    assert.ok(row0?.dbId);
    assert.equal(row0?.title, "OSCE SOT contract seed");

    await prisma.osceStation.update({
      where: { slug: SLUG },
      data: { title: "OSCE SOT contract patched" },
    });

    pub = await loadPublicOsceStationsDtos();
    const row1 = pub.stations.find((s) => s.id === SLUG);
    assert.equal(row1?.title, "OSCE SOT contract patched");

    await prisma.osceStation.update({
      where: { slug: SLUG },
      data: { isPublished: false },
    });
    pub = await loadPublicOsceStationsDtos();
    assert.ok(!pub.stations.some((s) => s.id === SLUG), "unpublished station must not appear in public list");
  });

  after(async () => {
    if (!process.env.DATABASE_URL?.trim()) return;
    try {
      await prisma.osceStation.deleteMany({ where: { slug: SLUG } });
    } catch (e) {
      if (String(e).includes("does not exist")) return;
      throw e;
    }
  });
});
