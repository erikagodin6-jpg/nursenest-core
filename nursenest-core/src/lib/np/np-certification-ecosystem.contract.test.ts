import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  listHiddenDevelopmentNpPathways,
  NP_CERTIFICATION_SPECIALTY_PATHWAYS,
  NP_CORE_LIBRARY_DOMAINS,
  NP_CORE_LIBRARY_TARGETS,
  summarizeNpCoreLibraryTargets,
  validateNpCertificationEcosystem,
} from "./np-certification-ecosystem";

describe("NP certification ecosystem expansion", () => {
  it("defines a shared NP core library that exceeds target depth", () => {
    assert.deepEqual(validateNpCertificationEcosystem(), []);
    const totals = summarizeNpCoreLibraryTargets();
    assert.ok(totals.lessons >= NP_CORE_LIBRARY_TARGETS.lessons);
    assert.ok(totals.flashcards >= NP_CORE_LIBRARY_TARGETS.flashcards);
    assert.ok(totals.questions >= NP_CORE_LIBRARY_TARGETS.questions);
    assert.ok(totals.clinicalCases >= NP_CORE_LIBRARY_TARGETS.clinicalCases);
    assert.ok(NP_CORE_LIBRARY_DOMAINS.some((domain) => domain.id === "advanced-assessment"));
    assert.ok(NP_CORE_LIBRARY_DOMAINS.some((domain) => domain.id === "advanced-pharmacology"));
  });

  it("registers current and future NP certifications without requiring duplicate core content", () => {
    const tags = new Set(NP_CERTIFICATION_SPECIALTY_PATHWAYS.map((pathway) => pathway.tag));
    for (const tag of ["FNP", "AGPCNP", "PMHNP", "WHNP", "PNP_PC", "PNP_AC", "ACNPC_AG", "ENP", "CNPLE"]) {
      assert.ok(tags.has(tag as never), `missing ${tag}`);
    }
    for (const pathway of NP_CERTIFICATION_SPECIALTY_PATHWAYS) {
      assert.deepEqual(pathway.sharedCoreTags, ["NP_CORE"]);
    }
  });

  it("keeps future NP certifications hidden until launch approval", () => {
    const hidden = listHiddenDevelopmentNpPathways();
    assert.deepEqual(hidden.map((pathway) => pathway.id).sort(), ["acnpc-ag", "enp", "pnp-ac"].sort());
    for (const pathway of hidden) {
      assert.equal(pathway.published, false);
      assert.equal(pathway.visibleInNavigation, false);
      assert.equal(pathway.launchReady, false);
      assert.equal(pathway.indexable, false);
      assert.equal(pathway.adminOnly, true);
      assert.equal(pathway.existingExamPathwayId, null);
    }
  });

  it("keeps specialty pathways clinically distinct", () => {
    const byId = new Map(NP_CERTIFICATION_SPECIALTY_PATHWAYS.map((pathway) => [pathway.id, pathway]));
    assert.ok(byId.get("pmhnp")!.focusAreas.some((area) => /Psychopharmacology/i.test(area)));
    assert.ok(byId.get("whnp")!.focusAreas.some((area) => /Contraception/i.test(area)));
    assert.ok(byId.get("pnp-pc")!.focusAreas.some((area) => /Growth|Development/i.test(area)));
    assert.ok(byId.get("acnpc-ag")!.focusAreas.some((area) => /Hemodynamics|Ventilation/i.test(area)));
    assert.ok(byId.get("enp")!.focusAreas.some((area) => /Trauma|Resuscitation/i.test(area)));
  });
});
