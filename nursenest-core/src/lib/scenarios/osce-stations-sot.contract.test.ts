import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import { prisma } from "@/lib/db";
import { legacyOsceSkillStationToPrismaCreate } from "@/lib/scenarios/osce-station-mapper";
import type { OSCESkillStation } from "@/lib/scenarios/legacy-osce-stations-runtime";
import { loadPublicOsceStationsDtos } from "@/lib/scenarios/osce-stations-resolve.server";

const SLUG = "__contract_osce_sot__";

const TEMPLATE: OSCESkillStation = {
  id: "contract-osce-template",
  title: "OSCE contract template",
  category: "Assessment",
  difficulty: "Foundational",
  icon: "ClipboardList",
  description: "Contract test OSCE station template.",
  scenarioIntro: "A learner completes a focused assessment for a standardized client.",
  equipment: [],
  steps: [{ label: "Introduce self" }, { label: "Verify identity" }],
  commonErrors: [],
  passingCriteria: "Completes safety-critical assessment steps.",
  clinicalPearls: ["Keep the station focused."],
  examLevel: "Foundational",
  timeLimit: "10 minutes",
  candidateInstructions: "Complete the focused station.",
  patientActorScript: "Answer learner questions consistently.",
  examinerChecklist: [{ action: "Introduces self", marks: 1 }],
  criticalFailCriteria: [],
  examinerQuestions: [],
  teachingPoints: [],
};

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

    await prisma.osceStation.deleteMany({ where: { slug: SLUG } });

    const base = legacyOsceSkillStationToPrismaCreate(
      { ...TEMPLATE, id: SLUG, title: "OSCE SOT contract seed" },
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
