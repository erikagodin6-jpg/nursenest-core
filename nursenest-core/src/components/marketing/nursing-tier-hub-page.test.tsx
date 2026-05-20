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
  it("Flashcards tile links to /app/flashcards with pathwayId when SSR guest but client authenticated", () => {
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
    assert.equal(link.getAttribute("href"), "/app/flashcards?pathwayId=us-rn-nclex-rn");
  });

  it("Flashcards tile uses login callback when guest on server and client", () => {
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
    const href = link.getAttribute("href") ?? "";
    assert.match(href, /^\/login\?callbackUrl=/);
    assert.ok(href.includes(encodeURIComponent("/app/flashcards?pathwayId=us-rn-nclex-rn")));
  });

  it("Canada RN hub Flashcards uses ca-rn-nclex-rn pathwayId when signed in", () => {
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
    assert.equal(link.getAttribute("href"), "/app/flashcards?pathwayId=ca-rn-nclex-rn");
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
