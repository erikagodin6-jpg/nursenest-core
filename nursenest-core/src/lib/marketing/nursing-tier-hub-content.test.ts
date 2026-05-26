import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import {
  buildNursingTierHubContent,
  resolveNursingTierHubActionHref,
  resolveNursingTierHubStudyCardHref,
} from "@/lib/marketing/nursing-tier-hub-content";

describe("buildNursingTierHubContent", () => {
  it("builds stable RN hub content with four primary study actions including CAT", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);

    const content = buildNursingTierHubContent(pathway);

    assert.equal(content.title, "NCLEX-RN practice questions for the US");
    assert.equal(content.audienceLabel, "RN");
    assert.equal(content.examLabel, "NCLEX-RN");
    assert.deepEqual(
      content.actions.map((action) => [action.id, action.label, action.href]),
      [
        ["lessons", "Lessons", "/us/rn/nclex-rn/lessons"],
        ["flashcards", "Flashcards", "/flashcards"],
        ["practice_questions", "Practice Questions", "/us/rn/nclex-rn/questions"],
        ["cat", "CAT", "/us/rn/nclex-rn/cat"],
      ],
    );
    assert.equal(content.actions.some((action) => action.id === "exams"), false);
  });

  it("uses region-aware PN naming for the United States", () => {
    const pathway = getExamPathwayById("us-lpn-nclex-pn");
    assert.ok(pathway);

    const content = buildNursingTierHubContent(pathway);

    assert.equal(content.audienceLabel, "LPN / LVN");
    assert.equal(content.examLabel, "NCLEX-PN");
    assert.match(content.includedNote, /Practical-nursing tier|PN\/RPN/i);
    assert.match(content.intro, /LVN\/LPN scope|NCLEX-PN prep for the United States/i);
    assert.equal(content.actions.some((action) => action.id === "exams"), false);
  });

  it("uses region-aware PN naming for Canada", () => {
    const pathway = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(pathway);

    const content = buildNursingTierHubContent(pathway);

    assert.equal(content.audienceLabel, "RPN");
    assert.equal(content.examLabel, "REx-PN");
    assert.match(content.includedNote, /RPN/i);
    assert.equal(content.actions.some((action) => action.id === "exams"), false);
  });

  it("keeps NP landing copy tier-first while preserving the current default pathway links", () => {
    const pathway = getExamPathwayById("us-np-fnp");
    assert.ok(pathway);

    const content = buildNursingTierHubContent(pathway);

    assert.equal(content.title, "FNP NP exam prep for the US");
    assert.equal(content.audienceLabel, "NP");
    assert.equal(content.examLabel, "ANCC / AANP - Family NP");
    assert.equal(content.actions[0]?.href, "/us/np/fnp/lessons");
    assert.match(content.includedNote, /Family NP/i);
    assert.equal(content.actions.some((action) => action.id === "exams"), false);
  });

  it("Canadian RN hub copy names Canada (not US) and keeps /canada/ routes on cards", () => {
    const pathway = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(pathway);
    const content = buildNursingTierHubContent(pathway);
    assert.match(content.description, /Canada/);
    assert.equal(content.description.includes("United States"), false);
    assert.deepEqual(
      content.actions.map((a) => a.href),
      [
        "/canada/rn/nclex-rn/lessons",
        "/flashcards",
        "/canada/rn/nclex-rn/questions",
        "/canada/rn/nclex-rn/cat",
      ],
    );
    assert.equal(content.actions.some((action) => action.id === "exams"), false);
  });
});

describe("resolveNursingTierHubStudyCardHref", () => {
  it("guest RN: flashcards, practice questions, and CAT stay on marketing hubs", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const content = buildNursingTierHubContent(pathway);
    const byId = new Map(content.actions.map((a) => [a.id, a]));
    const flash = byId.get("flashcards")!;
    const practice = byId.get("practice_questions")!;
    const cat = byId.get("cat")!;
    assert.equal(byId.has("exams"), false);
    assert.equal(resolveNursingTierHubStudyCardHref(pathway, flash, { viewerSignedIn: false }), "/flashcards");
    assert.equal(resolveNursingTierHubStudyCardHref(pathway, practice, { viewerSignedIn: false }), "/us/rn/nclex-rn/questions");
    assert.equal(resolveNursingTierHubStudyCardHref(pathway, cat, { viewerSignedIn: false }), "/us/rn/nclex-rn/cat");
  });

  it("signed-in RN: flashcards and CAT launch app sessions, and practice questions stay on the marketing hub", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const content = buildNursingTierHubContent(pathway);
    const byId = new Map(content.actions.map((a) => [a.id, a]));
    assert.equal(byId.has("exams"), false);
    assert.equal(
      resolveNursingTierHubStudyCardHref(pathway, byId.get("flashcards")!, { viewerSignedIn: true }),
      "/app/flashcards/custom?pathwayId=us-rn-nclex-rn&includeCards=1&shuffle=1&cardLimit=20",
    );
    assert.equal(
      resolveNursingTierHubStudyCardHref(pathway, byId.get("practice_questions")!, { viewerSignedIn: true }),
      "/us/rn/nclex-rn/questions",
    );
    assert.equal(
      resolveNursingTierHubStudyCardHref(pathway, byId.get("cat")!, { viewerSignedIn: true }),
      appPathwayCatSessionStartPath("us-rn-nclex-rn"),
    );
  });
});

describe("resolveNursingTierHubActionHref", () => {
  it("ignores placeholder # href and uses pathway lessons index", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const href = resolveNursingTierHubActionHref(pathway, {
      id: "lessons",
      label: "Lessons",
      description: "x",
      href: "#",
    });
    assert.equal(href, "/us/rn/nclex-rn/lessons");
  });

  it("ignores fragment-only hrefs for lessons", () => {
    const pathway = getExamPathwayById("us-lpn-nclex-pn");
    assert.ok(pathway);
    const href = resolveNursingTierHubActionHref(pathway, {
      id: "lessons",
      label: "Lessons",
      description: "x",
      href: "#topics",
    });
    assert.equal(href, "/us/pn/nclex-pn/lessons");
  });

  it("ignores overridden lessons href and always uses the pathway lessons index", () => {
    const pathway = getExamPathwayById("us-np-fnp");
    assert.ok(pathway);
    const href = resolveNursingTierHubActionHref(pathway, {
      id: "lessons",
      label: "Lessons",
      description: "x",
      href: "/us/np/fnp/lessons?topicSlug=foo",
    });
    assert.equal(href, "/us/np/fnp/lessons");
  });

  it("treats empty lessons href as invalid and uses the pathway lessons index", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    assert.equal(
      resolveNursingTierHubActionHref(pathway, {
        id: "lessons",
        label: "Lessons",
        description: "x",
        href: "",
      }),
      "/us/rn/nclex-rn/lessons",
    );
    assert.equal(
      resolveNursingTierHubActionHref(pathway, {
        id: "lessons",
        label: "Lessons",
        description: "x",
        href: "   ",
      }),
      "/us/rn/nclex-rn/lessons",
    );
  });

  it("rejects javascript:, data:, and vbscript: for practice questions", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const want = "/us/rn/nclex-rn/questions";
    for (const href of ["javascript:alert(1)", "data:text/html,<p>x</p>", "vbscript:msgbox(1)"] as const) {
      assert.equal(
        resolveNursingTierHubActionHref(pathway, {
          id: "practice_questions",
          label: "Practice",
          description: "x",
          href,
        }),
        want,
      );
    }
  });

  it("preserves a safe internal lessons href that matches this pathway lessons index", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    assert.equal(
      resolveNursingTierHubActionHref(pathway, {
        id: "lessons",
        label: "Lessons",
        description: "x",
        href: "/us/rn/nclex-rn/lessons",
      }),
      "/us/rn/nclex-rn/lessons",
    );
  });

  it("resolves RN, PN, and NP lesson tiles to distinct pathway lessons hubs", () => {
    const rn = getExamPathwayById("us-rn-nclex-rn");
    const pn = getExamPathwayById("us-lpn-nclex-pn");
    const np = getExamPathwayById("us-np-fnp");
    assert.ok(rn && pn && np);
    const rnL = resolveNursingTierHubActionHref(rn, { id: "lessons", label: "L", description: "d", href: "#" });
    const pnL = resolveNursingTierHubActionHref(pn, { id: "lessons", label: "L", description: "d", href: "#topics" });
    const npL = resolveNursingTierHubActionHref(np, { id: "lessons", label: "L", description: "d", href: "#" });
    assert.equal(rnL, "/us/rn/nclex-rn/lessons");
    assert.equal(pnL, "/us/pn/nclex-pn/lessons");
    assert.equal(npL, "/us/np/fnp/lessons");
    assert.notEqual(rnL, pnL);
    assert.notEqual(pnL, npL);
  });

  it("rejects placeholder practice and exams hrefs in favor of pathway hubs", () => {
    const pathway = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(pathway);
    assert.equal(
      resolveNursingTierHubActionHref(pathway, {
        id: "practice_questions",
        label: "Practice",
        description: "x",
        href: "#",
      }),
      "/canada/rn/nclex-rn/questions",
    );
    assert.equal(
      resolveNursingTierHubActionHref(pathway, {
        id: "exams",
        label: "Exams",
        description: "x",
        href: "#topics",
      }),
      "/app/practice-tests?pathwayId=ca-rn-nclex-rn",
    );
  });
});
