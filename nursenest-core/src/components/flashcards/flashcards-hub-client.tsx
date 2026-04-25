"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import {
  flashcardBodySystemsUiOutcomeFromParsed,
  parseFlashcardCustomSessionResponse,
} from "@/lib/flashcards/flashcard-custom-session-response";
import {
  countSavedStudyItems,
  getStudyItemIdsMatchingFilters,
} from "@/lib/flashcards/study-session-persistence";
import { LearnerCtaLink } from "@/components/learner-ui/learner-cta-link";
import { weakAreaFlashcardsHref } from "@/lib/learner/weak-area-flashcards-href";
import { reduceFlashcardsHubKpiSettled } from "@/lib/flashcards/flashcards-hub-kpi-load";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";

const CARD_COUNTS = [10, 20, 30, 50] as const;

export function FlashcardsHubClient({
  scopedPathwayId,
  pathwayDisplayName,
  pathwayBootstrapSource = "primary",
}: {
  scopedPathwayId: string;
  pathwayDisplayName: string;
  pathwayBootstrapSource?: "primary" | "secondary";
}) {
  const { t } = useMarketingI18n();

  const [builderCategories, setBuilderCategories] = useState<any[]>([]);
  const [selectedBodyIds, setSelectedBodyIds] = useState<string[]>([]);
  const [cardLimit, setCardLimit] = useState(20);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [weakOnly, setWeakOnly] = useState(false);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [revisitOnly, setRevisitOnly] = useState(false);
  const [notStudiedOnly, setNotStudiedOnly] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const allBodyIds = useMemo(
    () => builderCategories.map((c) => c.id),
    [builderCategories]
  );

  const toggleBodySystem = (id: string) => {
    if (selectedBodyIds.length === 0) {
      setSelectedBodyIds(allBodyIds.filter((x) => x !== id));
      return;
    }
    if (selectedBodyIds.includes(id)) {
      const next = selectedBodyIds.filter((x) => x !== id);
      setSelectedBodyIds(next.length === 0 ? [] : next);
    } else {
      const next = [...selectedBodyIds, id];
      if (next.length >= allBodyIds.length) setSelectedBodyIds([]);
      else setSelectedBodyIds(next);
    }
  };

  const sessionSummaryLine = [
    `${cardLimit} cards`,
    selectedBodyIds.length === 0
      ? "all systems"
      : `${selectedBodyIds.length} systems`,
    shuffleOn ? "shuffle on" : "shuffle off",
  ].join(" · ");

  const startHref = `/app/flashcards/custom?pathwayId=${scopedPathwayId}&cardLimit=${cardLimit}`;

  const filteredCategories = builderCategories.filter((c) =>
    categorySearch
      ? c.title.toLowerCase().includes(categorySearch.toLowerCase())
      : true
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
          {t("learner.flashcards.hub.title")}
        </h1>
        <p className="text-sm text-gray-500">
          {t("learner.flashcards.hub.subtitle")}
        </p>
      </header>

      {/* BODY SYSTEMS */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            {t("learner.flashcards.hub.bodySystemsHeading")}
          </h2>
          <p className="text-xs text-blue-500">{pathwayDisplayName}</p>

          {/* 🔥 NEW SUMMARY */}
          <p className="text-xs text-gray-500 mt-1">
            {sessionSummaryLine}
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="search"
          placeholder="Search body systems…"
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        {/* SYSTEM CHIPS */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((c) => {
            const selected =
              selectedBodyIds.length === 0 ||
              selectedBodyIds.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => toggleBodySystem(c.id)}
                data-selected={selected}
                className="border rounded-lg p-3 text-left transition-all hover:scale-[1.02] data-[selected=true]:ring-2 data-[selected=true]:ring-blue-400"
              >
                <div className="font-medium">
                  {formatTitleCase(c.title)}
                </div>
                {c.count ? (
                  <div className="text-xs text-gray-400">
                    {c.count} cards
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {/* FILTERS */}
      <section className="space-y-5 border-t pt-4">

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={weakOnly}
            onChange={(e) => setWeakOnly(e.target.checked)}
          />
          Weak areas only
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={incorrectOnly}
            onChange={(e) => setIncorrectOnly(e.target.checked)}
          />
          Previously incorrect
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notStudiedOnly}
            onChange={(e) => setNotStudiedOnly(e.target.checked)}
          />
          Not studied
        </label>

      </section>

      {/* 🔥 STICKY CTA */}
      <div className="sticky bottom-0 bg-white border-t pt-3 pb-2 mt-6 z-10">

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">

          <div>
            <Link
              href={startHref}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold inline-block"
            >
              Start studying
            </Link>

            <p className="text-xs text-gray-500 mt-1">
              {sessionSummaryLine}
            </p>
          </div>

          <Link
            href={weakAreaFlashcardsHref(scopedPathwayId)}
            className="text-xs text-blue-500 underline"
          >
            Weak areas
          </Link>

        </div>
      </div>

    </div>
  );
}