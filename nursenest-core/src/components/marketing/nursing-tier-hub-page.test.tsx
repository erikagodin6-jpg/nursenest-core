import "@happy-dom/global-registrator/register";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import React from "react";
import { SessionContext } from "next-auth/react";

(globalThis as unknown as { React?: typeof React }).React = React;
import { cleanup, render } from "@testing-library/react";
import { NursingTierHubPage } from "@/components/marketing/nursing-tier-hub-page";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { buildNursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";

afterEach(() => {
  cleanup();
});

function renderHub(
  ui: React.ReactElement,
  sessionValue: {
    data: { user: { id?: string; name?: string | null; email?: string | null } } | null;
    status: "authenticated" | "unauthenticated" | "loading";
    update: () => Promise<void>;
  },
) {
  return render(<SessionContext.Provider value={sessionValue}>{ui}</SessionContext.Provider>);
}

describe("NursingTierHubPage", () => {
  it("Flashcards tile links to the public flashcards hub when SSR guest but client authenticated", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const content = buildNursingTierHubContent(pathway);
    const { container } = renderHub(
      <NursingTierHubPage pathway={pathway} hubPath="/us/rn/nclex-rn" content={content} viewerSignedIn={false} />,
      {
        data: { user: { id: "sess_user_1", name: "Test", email: "t@example.com" } },
        status: "authenticated",
        update: async () => {},
      },
    );

    const card = container.querySelector(".nn-qa-nursing-tier-hub-flashcards-card");
    assert.ok(card);
    const link = card.closest("a");
    assert.ok(link);
    assert.equal(link.getAttribute("href"), "/flashcards");
  });

  it("Flashcards tile stays public when guest on server and client", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const content = buildNursingTierHubContent(pathway);
    const { container } = renderHub(
      <NursingTierHubPage pathway={pathway} hubPath="/us/rn/nclex-rn" content={content} viewerSignedIn={false} />,
      {
        data: null,
        status: "unauthenticated",
        update: async () => {},
      },
    );

    const card = container.querySelector(".nn-qa-nursing-tier-hub-flashcards-card");
    assert.ok(card);
    const link = card.closest("a");
    assert.ok(link);
    assert.equal(link.getAttribute("href"), "/flashcards");
  });

  it("Canada RN hub Flashcards uses the public flashcards hub", () => {
    const pathway = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(pathway);
    const content = buildNursingTierHubContent(pathway);
    const { container } = renderHub(
      <NursingTierHubPage pathway={pathway} hubPath="/canada/rn/nclex-rn" content={content} viewerSignedIn />,
      {
        data: null,
        status: "unauthenticated",
        update: async () => {},
      },
    );

    const card = container.querySelector(".nn-qa-nursing-tier-hub-flashcards-card");
    assert.ok(card);
    const link = card.closest("a");
    assert.ok(link);
    assert.equal(link.getAttribute("href"), "/flashcards");
  });

  it("New Grad transition hub renders guided study path strip", () => {
    const pathway = getExamPathwayById("us-rn-new-grad-transition");
    assert.ok(pathway);
    const content = buildNursingTierHubContent(pathway);
    const { container } = renderHub(
      <NursingTierHubPage pathway={pathway} hubPath="/us/rn/new-grad-transition" content={content} viewerSignedIn={false} />,
      {
        data: null,
        status: "unauthenticated",
        update: async () => {},
      },
    );
    assert.ok(container.querySelector('[data-nn-marketing-hub-guided-path="1"]'));
  });

  it("Flashcards card is interactive link for signed-in SSR, not locked article", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const content = buildNursingTierHubContent(pathway);
    const { container } = renderHub(
      <NursingTierHubPage pathway={pathway} hubPath="/us/rn/nclex-rn" content={content} viewerSignedIn />,
      {
        data: null,
        status: "unauthenticated",
        update: async () => {},
      },
    );

    const card = container.querySelector(".nn-qa-nursing-tier-hub-flashcards-card");
    assert.ok(card);
    assert.equal(card.getAttribute("aria-disabled"), null);
    const link = card.closest("a");
    assert.ok(link);
    assert.equal(link.getAttribute("role"), null);
  });
});
