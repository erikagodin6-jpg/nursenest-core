import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveStudyLoopCatDestination } from "@/lib/exam-pathways/study-loop-cat-routing";

describe("resolveStudyLoopCatDestination", () => {
  it("routes signed-in learners with a known pathway to app CAT start", () => {
    const destination = resolveStudyLoopCatDestination({
      authState: "signed_in",
      pathwayId: "us-rn-nclex-rn",
      intent: "start",
    });

    assert.equal(destination.kind, "app_start");
    assert.equal(destination.href, "/app/practice-tests/start?pathwayId=us-rn-nclex-rn");
    assert.equal(destination.pathwayId, "us-rn-nclex-rn");
    assert.equal(destination.isPathwayScoped, true);
  });

  it("routes signed-in learners with a known pathway and weak focus to CAT-explicit weak builder", () => {
    const destination = resolveStudyLoopCatDestination({
      authState: "signed_in",
      pathwayId: "ca-rpn-rex-pn",
      intent: "weak_focus",
      topic: "Pharmacology",
    });

    assert.equal(destination.kind, "app_weak_focus");
    assert.equal(
      destination.href,
      "/app/practice-tests?cat=1&focus=weak&pathwayId=ca-rpn-rex-pn&topic=Pharmacology",
    );
    assert.equal(destination.pathwayId, "ca-rpn-rex-pn");
    assert.equal(destination.isPathwayScoped, true);
  });

  it("routes logged-out users with a known pathway to the public pathway CAT page", () => {
    const destination = resolveStudyLoopCatDestination({
      authState: "public",
      pathwayId: "us-np-fnp",
      intent: "start",
    });

    assert.equal(destination.kind, "public");
    assert.equal(destination.href, "/us/np/fnp/cat");
    assert.equal(destination.pathwayId, "us-np-fnp");
    assert.equal(destination.isPathwayScoped, true);
  });

  it("uses an honest generic chooser for signed-in ambiguous pathways", () => {
    const destination = resolveStudyLoopCatDestination({
      authState: "signed_in",
      availablePathwayIds: ["us-rn-nclex-rn", "us-np-fnp"],
      intent: "start",
    });

    assert.equal(destination.kind, "generic_chooser");
    assert.equal(destination.href, "/app/practice-tests/start");
    assert.equal(destination.pathwayId, null);
    assert.equal(destination.isPathwayScoped, false);
  });

  it("keeps CAT-explicit weak-focus intent when the signed-in learner still needs to choose a pathway", () => {
    const destination = resolveStudyLoopCatDestination({
      authState: "signed_in",
      availablePathwayIds: ["us-rn-nclex-rn", "us-np-fnp"],
      intent: "weak_focus",
      topic: "Cardiac",
    });

    assert.equal(destination.kind, "app_weak_focus");
    assert.equal(destination.href, "/app/practice-tests?cat=1&focus=weak&topic=Cardiac");
    assert.equal(destination.pathwayId, null);
    assert.equal(destination.isPathwayScoped, false);
  });

  it("uses the public exam-selection surface when logged-out pathway context is missing", () => {
    const destination = resolveStudyLoopCatDestination({
      authState: "public",
      intent: "start",
    });

    assert.equal(destination.kind, "generic_chooser");
    assert.equal(destination.href, "/practice-exams");
    assert.equal(destination.pathwayId, null);
    assert.equal(destination.isPathwayScoped, false);
  });

  it("falls back to the correct chooser when the provided pathway id is invalid", () => {
    const signedIn = resolveStudyLoopCatDestination({
      authState: "signed_in",
      pathwayId: "not-a-real-pathway",
      intent: "start",
    });
    const loggedOut = resolveStudyLoopCatDestination({
      authState: "public",
      pathwayId: "not-a-real-pathway",
      intent: "start",
    });

    assert.equal(signedIn.kind, "generic_chooser");
    assert.equal(signedIn.href, "/app/practice-tests/start");
    assert.equal(loggedOut.kind, "generic_chooser");
    assert.equal(loggedOut.href, "/practice-exams");
  });
});
