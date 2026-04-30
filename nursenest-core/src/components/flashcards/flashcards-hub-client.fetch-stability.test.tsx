import "@happy-dom/global-registrator/register";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import React from "react";

// tsx + tsconfig `jsx: "preserve"` leaves classic JSX runtime; child modules expect `React` in scope.
(globalThis as unknown as { React?: typeof React }).React = React;
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { FlashcardsHubClient } from "@/components/flashcards/flashcards-hub-client";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";

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

  it("skips the first custom-session fetch when RSC passed initialHub (categoryOptions)", async () => {
    const origFetch = globalThis.fetch;
    let fetchCount = 0;

    globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
      const url = String(args[0]);
      if (url.includes("/api/flashcards/custom-session")) {
        fetchCount += 1;
        return new Response(JSON.stringify({ ok: false }), { status: 500 });
      }
      return origFetch(...args);
    };

    render(
      <MarketingI18nProvider locale="en" messages={hubMessages}>
        <FlashcardsHubClient
          scopedPathwayId="ca-rn-nclex-rn"
          pathwayDisplayName="Canada RN (NCLEX-RN)"
          initialHub={{
            categoryOptions: [
              { id: "cardiovascular", title: "Cardiovascular", count: 3 },
              { id: "respiratory", title: "Respiratory", count: 2 },
            ],
            matchingTotal: 5,
            lessonVirtualDiagnostics: null,
          }}
        />
      </MarketingI18nProvider>,
    );

    await new Promise((r) => setTimeout(r, 800));
    assert.equal(fetchCount, 0, "initialHub with categories must skip duplicate inventory fetch");

    globalThis.fetch = origFetch;
  });

  it("runs one inventory fetch when initialHub is skeleton-only (zero counts, no matches) so counts hydrate", async () => {
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
              matchingCards: 2,
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
              sessionShuffleSalt: "salt",
            },
            categoryOptions: [
              { id: "cardiovascular", title: "Cardiovascular", count: 2 },
              { id: "respiratory", title: "Respiratory", count: 0 },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return origFetch(...args);
    };

    render(
      <MarketingI18nProvider locale="en" messages={hubMessages}>
        <FlashcardsHubClient
          scopedPathwayId="ca-rn-nclex-rn"
          pathwayDisplayName="Canada RN (NCLEX-RN)"
          initialHub={{
            categoryOptions: [
              { id: "cardiovascular", title: "Cardiovascular", count: 0 },
              { id: "respiratory", title: "Respiratory", count: 0 },
            ],
            matchingTotal: 0,
            lessonVirtualDiagnostics: null,
          }}
        />
      </MarketingI18nProvider>,
    );

    await waitFor(() => assert.equal(fetchCount, 1), { timeout: 4000 });

    globalThis.fetch = origFetch;
  });

  it("skips first fetch when initialHub has matchingTotal only (virtual inventory without category rows yet)", async () => {
    const origFetch = globalThis.fetch;
    let fetchCount = 0;

    globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
      const url = String(args[0]);
      if (url.includes("/api/flashcards/custom-session")) {
        fetchCount += 1;
      }
      return origFetch(...args);
    };

    const lessonVirtualDiagnostics: FlashcardLessonVirtualDiagnostics = {
      pathwayId: "ca-rn-nclex-rn",
      catalogLessonCount: 10,
      lessonsWithDerivedCards: 3,
      totalGeneratedVirtualCards: 12,
      recallVirtualCount: 4,
      sectionDerivedVirtualCount: 8,
      genericFillerSectionCardHits: 0,
      selectedCategoryIds: [],
      filterModeLabel: "all cards",
    };

    render(
      <MarketingI18nProvider locale="en" messages={hubMessages}>
        <FlashcardsHubClient
          scopedPathwayId="ca-rn-nclex-rn"
          pathwayDisplayName="Canada RN (NCLEX-RN)"
          initialHub={{
            categoryOptions: [],
            matchingTotal: 12,
            lessonVirtualDiagnostics,
          }}
        />
      </MarketingI18nProvider>,
    );

    await waitFor(() => assert.ok(fetchCount >= 1), { timeout: 4000 });

    globalThis.fetch = origFetch;
  });

  it("initialWeakOnly pre-checks the weak filter (URL deep link parity)", async () => {
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
      const url = String(args[0]);
      if (url.includes("/api/flashcards/custom-session")) {
        return new Response(
          JSON.stringify({
            ok: true,
            summary: {
              pathwayId: "ca-rn-nclex-rn",
              selectedCategories: [],
              matchingCards: 3,
              returnedCards: 0,
              mode: "mixed",
              shuffle: true,
              weakOnly: true,
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
              sessionShuffleSalt: "weak-init-test",
            },
            categoryOptions: [{ id: "respiratory", title: "Respiratory", count: 3 }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return origFetch(...args);
    };

    render(
      <MarketingI18nProvider locale="en" messages={hubMessages}>
        <FlashcardsHubClient
          scopedPathwayId="ca-rn-nclex-rn"
          pathwayDisplayName="Canada RN (NCLEX-RN)"
          initialHub={{
            categoryOptions: [{ id: "respiratory", title: "Respiratory", count: 3 }],
            matchingTotal: 3,
            lessonVirtualDiagnostics: null,
          }}
          initialWeakOnly
        />
      </MarketingI18nProvider>,
    );

    await waitFor(() => {
      const weak = screen.getByRole("checkbox", { name: /weak areas only/i }) as HTMLInputElement;
      assert.equal(weak.checked, true);
    });

    globalThis.fetch = origFetch;
  });
});
