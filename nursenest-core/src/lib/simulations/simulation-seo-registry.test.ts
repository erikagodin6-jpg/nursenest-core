import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TOPIC_CLUSTER_DEFINITIONS } from "@/lib/lessons/lesson-topic-cluster-registry";
import {
  SIMULATION_SEO_HUB_PATH,
  SIMULATION_SEO_REGISTRY,
  getSimulationSeoBySlug,
  isSimulationSeoIndexable,
  simulationSeoPagePath,
  simulationSeoRobots,
} from "@/lib/simulations/simulation-seo-registry";

const TOPIC_SLUG_SET = new Set(TOPIC_CLUSTER_DEFINITIONS.map((d) => d.topicSlug));

const PLACEHOLDER_RE = /\b(TODO|FIXME|lorem ipsum|TBD)\b/i;

describe("simulation SEO registry", () => {
  it("has seven clusters with unique ids and slugs", () => {
    assert.equal(SIMULATION_SEO_REGISTRY.length, 7);
    assert.equal(new Set(SIMULATION_SEO_REGISTRY.map((e) => e.id)).size, 7);
    assert.equal(new Set(SIMULATION_SEO_REGISTRY.map((e) => e.slug)).size, 7);
  });

  it("uses stable canonical paths", () => {
    for (const e of SIMULATION_SEO_REGISTRY) {
      const path = simulationSeoPagePath(e.slug);
      assert.ok(path.startsWith(`${SIMULATION_SEO_HUB_PATH}/`), path);
      assert.ok(!path.includes(".."));
      assert.equal(getSimulationSeoBySlug(e.slug)?.id, e.id);
    }
  });

  it("SEO titles and descriptions are unique and substantive", () => {
    const titles = new Set<string>();
    const descs = new Set<string>();
    for (const e of SIMULATION_SEO_REGISTRY) {
      assert.ok(e.seoTitle.trim().length >= 28);
      assert.ok(e.metaDescription.trim().length >= 80);
      assert.ok(e.h1.trim().length >= 12);
      assert.ok(!titles.has(e.seoTitle));
      assert.ok(!descs.has(e.metaDescription));
      titles.add(e.seoTitle);
      descs.add(e.metaDescription);
      assert.ok(!PLACEHOLDER_RE.test(e.seoTitle));
      assert.ok(!PLACEHOLDER_RE.test(e.metaDescription));
    }
  });

  it("maps robots for unfinished surfaces", () => {
    for (const e of SIMULATION_SEO_REGISTRY) {
      assert.equal(isSimulationSeoIndexable(e), e.status === "published");
      assert.equal(simulationSeoRobots(e), e.status === "published" ? "index,follow" : "noindex,follow");
    }
  });

  it("keeps free vs premium segmentation", () => {
    for (const e of SIMULATION_SEO_REGISTRY) {
      assert.ok(e.segmentation.freeHighlights.length >= 3);
      assert.ok(e.segmentation.premiumHighlights.length >= 3);
    }
  });

  it("references only canonical pathway topic slugs", () => {
    for (const e of SIMULATION_SEO_REGISTRY) {
      for (const t of e.related.topicSlugs) {
        assert.ok(TOPIC_SLUG_SET.has(t), `${e.id} unknown topicSlug ${t}`);
      }
    }
  });

  it("uses stable app tool href prefixes", () => {
    for (const e of SIMULATION_SEO_REGISTRY) {
      for (const href of e.related.appToolHrefs) {
        assert.ok(href.startsWith("/app/"), `${e.id} ${href}`);
      }
      for (const href of e.related.marketingHrefs) {
        assert.ok(href.startsWith("/modules/") || href.startsWith("/clinical-"), `${e.id} ${href}`);
      }
    }
  });

  it("declares scenario capabilities consistently", () => {
    for (const e of SIMULATION_SEO_REGISTRY) {
      assert.ok(e.scenarioTypes.length >= 1);
      assert.ok(e.specialties.length >= 1);
      assert.ok(typeof e.capabilities.branching === "boolean");
    }
  });
});
