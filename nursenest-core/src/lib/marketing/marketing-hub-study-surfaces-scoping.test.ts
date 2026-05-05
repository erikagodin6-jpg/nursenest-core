import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { buildNursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";

const CASES = [
  { id: "us-rn-nclex-rn", lessons: "/us/rn/nclex-rn/lessons", questions: "/us/rn/nclex-rn/questions", cat: "/us/rn/nclex-rn/cat" },
  { id: "ca-rn-nclex-rn", lessons: "/canada/rn/nclex-rn/lessons", questions: "/canada/rn/nclex-rn/questions", cat: "/canada/rn/nclex-rn/cat" },
  { id: "us-lpn-nclex-pn", lessons: "/us/pn/nclex-pn/lessons", questions: "/us/pn/nclex-pn/questions", cat: "/us/pn/nclex-pn/cat" },
  { id: "ca-rpn-rex-pn", lessons: "/canada/pn/rex-pn/lessons", questions: "/canada/pn/rex-pn/questions", cat: "/canada/pn/rex-pn/cat" },
  { id: "us-np-fnp", lessons: "/us/np/fnp/lessons", questions: "/us/np/fnp/questions", cat: "/us/np/fnp/cat" },
  { id: "ca-np-cnple", lessons: "/canada/np/cnple/lessons", questions: "/canada/np/cnple/questions", cat: "/canada/np/cnple/cat" },
  { id: "us-allied-core", lessons: "/us/allied/allied-health/lessons", questions: "/us/allied/allied-health/questions", cat: "/us/allied/allied-health/cat" },
  { id: "ca-allied-core", lessons: "/canada/allied/allied-health/lessons", questions: "/canada/allied/allied-health/questions", cat: "/canada/allied/allied-health/cat" },
  { id: "us-rn-new-grad-transition", lessons: "/us/rn/new-grad-transition/lessons", questions: "/us/rn/new-grad-transition/questions", cat: "/us/rn/new-grad-transition/cat" },
] as const;

describe("marketing hub study surfaces stay tier + country scoped", () => {
  for (const row of CASES) {
    it(`pathway ${row.id}: lessons / questions / CAT never use global /lessons`, () => {
      const p = getExamPathwayById(row.id);
      assert.ok(p, `missing pathway ${row.id}`);
      assert.equal(buildExamPathwayPath(p!, "lessons"), row.lessons);
      assert.equal(buildExamPathwayPath(p!, "questions"), row.questions);
      assert.equal(buildExamPathwayPath(p!, "cat"), row.cat);
      assert.notEqual(buildExamPathwayPath(p!, "lessons"), "/lessons");
      assert.equal(p!.countrySlug === "canada", row.lessons.startsWith("/canada/"));
      assert.equal(p!.countrySlug === "us", row.lessons.startsWith("/us/"));
    });
  }

  it("tier hub action cards: flashcards + practice use pathway id; no cross-country prefix", () => {
    const p = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(p);
    const content = buildNursingTierHubContent(p!);
    const byId = new Map(content.actions.map((a) => [a.id, a]));
    assert.equal(byId.get("lessons")?.href, "/canada/pn/rex-pn/lessons");
    assert.equal(byId.get("practice_questions")?.href, "/canada/pn/rex-pn/questions");
    assert.equal(byId.get("exams")?.href, "/canada/pn/rex-pn/cat");
    assert.equal(byId.get("flashcards")?.href, `/app/flashcards?pathwayId=${encodeURIComponent("ca-rpn-rex-pn")}`);
  });

  it("region-aware exam naming: US PN vs Canada PN", () => {
    const usPn = getExamPathwayById("us-lpn-nclex-pn");
    const caPn = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(usPn && caPn);
    assert.equal(pathwayRegionAwareExamName(usPn!), "NCLEX-PN");
    assert.equal(pathwayRegionAwareExamName(caPn!), "REx-PN");
  });
});

describe("pre-nursing marketing hub does not deep-link into US/Canada exam pathway hubs", () => {
  it("documented pre-nursing surface hrefs avoid /us/ and /canada/ exam segments", () => {
    const preNursingHubHrefs = ["/pre-nursing/lessons", "/flashcards", "/question-bank", "/pre-nursing/mini-cat"];
    for (const h of preNursingHubHrefs) {
      assert.equal(h.startsWith("/us/"), false, h);
      assert.equal(h.startsWith("/canada/"), false, h);
    }
  });
});
