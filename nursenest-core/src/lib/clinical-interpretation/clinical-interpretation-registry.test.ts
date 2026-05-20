import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TOPIC_CLUSTER_DEFINITIONS } from "@/lib/lessons/lesson-topic-cluster-registry";
import {
  CLINICAL_INTERPRETATION_HUB_PATH,
  CLINICAL_INTERPRETATION_REGISTRY,
  clinicalInterpretationGuidePath,
  clinicalInterpretationRobotsDirective,
  getClinicalInterpretationBySlug,
  isClinicalInterpretationIndexable,
  type ClinicalInterpretationEntry,
} from "@/lib/clinical-interpretation/clinical-interpretation-registry";

const TOPIC_SLUG_SET = new Set(TOPIC_CLUSTER_DEFINITIONS.map((d) => d.topicSlug));

const PLACEHOLDER_RE = /\b(TODO|FIXME|lorem ipsum|placeholder text|TBD)\b/i;

function assertNoPlaceholder(entry: ClinicalInterpretationEntry, field: string, value: string) {
  assert.ok(!PLACEHOLDER_RE.test(value), `${entry.id}.${field} must not contain placeholder language`);
}

describe("clinical interpretation registry", () => {
  it("has nine clusters with unique ids and slugs", () => {
    assert.equal(CLINICAL_INTERPRETATION_REGISTRY.length, 9);
    const ids = new Set(CLINICAL_INTERPRETATION_REGISTRY.map((e) => e.id));
    const slugs = new Set(CLINICAL_INTERPRETATION_REGISTRY.map((e) => e.slug));
    assert.equal(ids.size, CLINICAL_INTERPRETATION_REGISTRY.length);
    assert.equal(slugs.size, CLINICAL_INTERPRETATION_REGISTRY.length);
  });

  it("uses canonical hub paths without traversal", () => {
    for (const e of CLINICAL_INTERPRETATION_REGISTRY) {
      const path = clinicalInterpretationGuidePath(e.slug);
      assert.ok(path.startsWith(`${CLINICAL_INTERPRETATION_HUB_PATH}/`), path);
      assert.ok(!path.includes(".."), path);
      assert.equal(getClinicalInterpretationBySlug(e.slug)?.id, e.id);
    }
  });

  it("SEO titles and descriptions are unique and substantive", () => {
    const titles = new Set<string>();
    const descs = new Set<string>();
    for (const e of CLINICAL_INTERPRETATION_REGISTRY) {
      assert.ok(e.seoTitle.trim().length >= 28, e.id);
      assert.ok(e.metaDescription.trim().length >= 80, e.id);
      assert.ok(e.h1.trim().length >= 12, e.id);
      assert.ok(!titles.has(e.seoTitle), `duplicate seoTitle: ${e.seoTitle}`);
      assert.ok(!descs.has(e.metaDescription), `duplicate metaDescription for ${e.id}`);
      titles.add(e.seoTitle);
      descs.add(e.metaDescription);
      assertNoPlaceholder(e, "seoTitle", e.seoTitle);
      assertNoPlaceholder(e, "metaDescription", e.metaDescription);
      assertNoPlaceholder(e, "h1", e.h1);
    }
  });

  it("maps robots/noindex to lifecycle status (unfinished stays noindex)", () => {
    for (const e of CLINICAL_INTERPRETATION_REGISTRY) {
      const indexed = isClinicalInterpretationIndexable(e);
      assert.equal(indexed, e.status === "published");
      assert.equal(
        clinicalInterpretationRobotsDirective(e),
        indexed ? "index,follow" : "noindex,follow",
      );
    }
  });

  it("keeps free vs premium segmentation non-empty (layered funnel)", () => {
    for (const e of CLINICAL_INTERPRETATION_REGISTRY) {
      assert.ok(e.segmentation.freeHighlights.length >= 3, e.id);
      assert.ok(e.segmentation.premiumHighlights.length >= 3, e.id);
    }
  });

  it("references only canonical pathway topic slugs", () => {
    for (const e of CLINICAL_INTERPRETATION_REGISTRY) {
      for (const t of e.related.topicSlugs) {
        assert.ok(TOPIC_SLUG_SET.has(t), `${e.id} unknown topicSlug: ${t}`);
      }
    }
  });

  it("uses stable internal href prefixes for related tools", () => {
    for (const e of CLINICAL_INTERPRETATION_REGISTRY) {
      for (const href of e.related.appToolHrefs) {
        assert.ok(href.startsWith("/app/"), `${e.id} appToolHref ${href}`);
      }
      for (const href of e.related.marketingHrefs) {
        assert.ok(href.startsWith("/modules/"), `${e.id} marketingHref ${href}`);
      }
      if (e.related.marketingArticlePaths) {
        for (const href of e.related.marketingArticlePaths) {
          assert.ok(href.startsWith("/"), `${e.id} marketingArticlePaths ${href}`);
        }
      }
    }
  });

  it("lesson slugs are lowercase kebab-case when present", () => {
    const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const e of CLINICAL_INTERPRETATION_REGISTRY) {
      for (const ls of e.related.lessonSlugs) {
        assert.ok(slugPattern.test(ls), `${e.id} lessonSlug ${ls}`);
      }
    }
  });
});
