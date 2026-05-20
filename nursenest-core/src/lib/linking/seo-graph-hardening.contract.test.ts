import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(thisDir, "..", "..", "..");

function read(rel: string): string {
  return fs.readFileSync(path.join(repoRoot, rel), "utf8");
}

describe("SEO graph hardening — contracts", () => {
  it("lesson detail wires topic siblings, remediation, and auto-related graph", () => {
    const body = read(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
    );
    assert.match(body, /PathwayLessonTopicSiblingsStrip/);
    assert.match(body, /PathwayLessonRemediationChain/);
    assert.match(body, /AutomaticRelatedContentForPublic/);
  });

  it("lessons hub wires topic educational intro and FAQ schema", () => {
    const hub = read("src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx");
    const intro = read("src/components/lessons/topic-hub-educational-intro.tsx");
    assert.match(hub, /TopicHubEducationalIntro/);
    assert.match(intro, /TopicHubLearningGraph/);
    assert.match(hub, /pathwayLessonsHubFaqSchema/);
  });

  it("catalog-derived targets bootstrap in link registry", () => {
    const reg = read("src/lib/linking/link-target-registry.ts");
    assert.match(reg, /getCatalogDerivedLinkTargets/);
    assert.match(reg, /_bootstrapCatalogDerivedTargets/);
  });

  it("marketing surfaces avoid legacy /canada/rpn/rex-pn hrefs in footer and rex-pn cluster", () => {
    const footer = read("src/components/layout/site-footer.tsx");
    assert.doesNotMatch(footer, /href="\/canada\/rpn\/rex-pn/);
    const rex = read("src/lib/seo/rex-pn-seo-cluster.ts");
    assert.match(rex, /REX_PN_HUB = "\/canada\/pn\/rex-pn"/);
  });

  it("clinical interpretation and glossary routes exist", () => {
    assert.ok(fs.existsSync(path.join(repoRoot, "src/app/(marketing)/(default)/clinical-interpretation/page.tsx")));
    assert.ok(fs.existsSync(path.join(repoRoot, "src/app/(marketing)/(default)/nursing-glossary/page.tsx")));
  });

  it("route canonicalization audit script scans content and blog seeds", () => {
    const script = read("scripts/audit-route-canonicalization.mjs");
    assert.match(script, /blog-static-longtail/);
    assert.match(script, /walkContent/);
  });

  it("lesson remediation chain uses governed telemetry client", () => {
    const chain = read("src/components/lessons/pathway-lesson-remediation-chain.tsx");
    assert.match(chain, /orchestrateEducationalGraph/);
    assert.match(chain, /PathwayLessonRemediationChainClient/);
  });
});
