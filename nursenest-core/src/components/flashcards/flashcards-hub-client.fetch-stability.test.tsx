import "@happy-dom/global-registrator/register";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import React from "react";

// tsx + tsconfig `jsx: "preserve"` leaves classic JSX runtime; child modules expect `React` in scope.
(globalThis as unknown as { React?: typeof React }).React = React;
import { cleanup, render, waitFor } from "@testing-library/react";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { FlashcardsHubClient } from "@/components/flashcards/flashcards-hub-client";

const hubMessages: Record<string, string> = {
  "learner.flashcards.hub.title": "Flashcards",
  "learner.flashcards.hub.subtitle": "Pick topics",
  "learner.flashcards.hub.bodySystemsHeading": "Body systems",
  "flashcards.startSession": "Start",
};

afterEach(() => {
  cleanup();
});

describe("FlashcardsHubClient", () => {
  it("loads custom-session inventory once per filter set (no dependency churn loop)", async () => {
    const origFetch = globalThis.fetch;
    let fetchCount = 0;

    globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
      const url = String(args[0]);
      if (url.includes("/api/flashcards/custom-session")) {
        fetchCount += 1;
        return new Response(
          JSON.stringify({
            ok: true,
            summary: {
              pathwayId: "ca-rn-nclex-rn",
              selectedCategories: [],
              matchingCards: 12,
              returnedCards: 0,
              mode: "mixed",
              shuffle: true,
              weakOnly: false,
              incorrectOnly: false,
              starredOnly: false,
              savedOnly: false,
              notesOnly: false,
              revisitOnly: false,
              notStudiedOnly: false,
              recentStudiedOnly: false,
              recentDays: 7,
              sourceKind: "all",
              cardLimit: "20",
              queryRelaxation: "none",
              sessionShuffleSalt: "test-salt",
            },
            categoryOptions: [
              { id: "cardiovascular", title: "Cardiovascular", count: 5 },
              { id: "respiratory", title: "Respiratory", count: 7 },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return origFetch(...args);
    };

    render(
      <MarketingI18nProvider locale="en" messages={hubMessages}>
        <FlashcardsHubClient scopedPathwayId="ca-rn-nclex-rn" pathwayDisplayName="Canada RN (NCLEX-RN)" />
      </MarketingI18nProvider>,
    );

    await waitFor(() => assert.ok(fetchCount > 0), { timeout: 4000 });
    await new Promise((r) => setTimeout(r, 500));
    assert.ok(
      fetchCount <= 4,
      `expected a bounded number of custom-session fetches (React Strict Mode may double), got ${fetchCount}`,
    );

    globalThis.fetch = origFetch;
  });
});
