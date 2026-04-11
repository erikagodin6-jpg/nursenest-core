"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import type { ConfidenceLevel } from "./confidence-selector";
import {
  PremiumLockCard,
  LockedPreviewCard,
  UpgradePromptCard,
  usePremiumGateImpression,
} from "./premium-gate";

// ── Data Types ──────────────────────────────────────────────────────────────

export interface SmartReviewItem {
  id: string;
  index: number;
  stem: string;
  topic?: string | null;
  subtopic?: string | null;
  isCorrect: boolean;
  confidence: ConfidenceLevel | null;
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  relatedLessons?: { title: string; href: string }[];
}

type GroupId = "priority" | "needs-review" | "uncertain" | "strong";

interface ReviewGroup {
  id: GroupId;
  title: string;
  description: string;
  variantClass: string;
  defaultExpanded: boolean;
  items: SmartReviewItem[];
}

// ── Grouping Logic ──────────────────────────────────────────────────────────

/**
 * Assigns a question to exactly one of the 4 review groups.
 *
 * Priority:
 *   incorrect + high conf       → "priority"   (High Priority Fixes)
 *   incorrect + med/low/no conf → "needs-review"
 *   correct  + low/med conf     → "uncertain"   (Uncertain Knowledge)
 *   correct  + high/no conf     → "strong"      (Strong Areas)
 *
 * Unrated (null confidence): conservative — incorrect→needs-review, correct→uncertain.
 */
function assignGroup(isCorrect: boolean, conf: ConfidenceLevel | null): GroupId {
  if (!isCorrect) {
    return conf === "high" ? "priority" : "needs-review";
  }
  // Correct
  if (conf === "high") return "strong";
  if (conf === "low" || conf === "medium") return "uncertain";
  // Correct, unrated → uncertain (conservative)
  return "uncertain";
}

/**
 * Builds 4 sorted review groups from the raw item array.
 * Groups are ordered per spec; within each group items appear in session order.
 */
function buildGroups(items: SmartReviewItem[]): ReviewGroup[] {
  const buckets: Record<GroupId, SmartReviewItem[]> = {
    priority: [],
    "needs-review": [],
    uncertain: [],
    strong: [],
  };

  for (const item of items) {
    const groupId = assignGroup(item.isCorrect, item.confidence);
    buckets[groupId].push(item);
  }

  return [
    {
      id: "priority",
      title: "High Priority Fixes",
      description:
        "Answered incorrectly despite high confidence — these need the most immediate attention.",
      variantClass: "nn-review-group--priority",
      defaultExpanded: true,
      items: buckets.priority,
    },
    {
      id: "needs-review",
      title: "Needs Review",
      description:
        "Answered incorrectly with low or medium confidence — review the explanation and related lessons.",
      variantClass: "nn-review-group--needs-review",
      defaultExpanded: true,
      items: buckets["needs-review"],
    },
    {
      id: "uncertain",
      title: "Uncertain Knowledge",
      description:
        "Got it right but weren't sure — reinforce these to build reliable recall under exam pressure.",
      variantClass: "nn-review-group--uncertain",
      defaultExpanded: false,
      items: buckets.uncertain,
    },
    {
      id: "strong",
      title: "Strong Areas",
      description:
        "Correct with high confidence — these areas are stable and ready for exam conditions.",
      variantClass: "nn-review-group--strong",
      defaultExpanded: false,
      items: buckets.strong,
    },
  ];
}

// ── ReviewMetaChip ──────────────────────────────────────────────────────────

/**
 * ReviewMetaChip — compact status pill (correct/incorrect or confidence level).
 * Colors derive exclusively from semantic/role tokens (spec §6).
 */
export function ReviewMetaChip({
  type,
  value,
}: {
  type: "result" | "confidence";
  value: string;
}) {
  if (type === "result") {
    const cls =
      value === "correct" ? "nn-review-chip--correct" : "nn-review-chip--incorrect";
    const label = value === "correct" ? "✓ Correct" : "✗ Incorrect";
    return <span className={`nn-review-chip ${cls}`}>{label}</span>;
  }

  const confMap: Record<string, string> = {
    high: "nn-review-chip--high",
    medium: "nn-review-chip--medium",
    low: "nn-review-chip--low",
  };
  const cls = confMap[value] ?? "";
  const label =
    value === "high" ? "High" : value === "medium" ? "Medium" : "Low";
  return (
    <span className={`nn-review-chip ${cls}`} title={`${label} confidence`}>
      {label} confidence
    </span>
  );
}

// ── ReviewQuestionRow ───────────────────────────────────────────────────────

/**
 * ReviewQuestionRow — single question row with inline expandable rationale.
 *
 * LEFT:    Q number
 * MIDDLE:  truncated stem + optional topic tag
 * RIGHT:   correct/incorrect chip + confidence chip + Review / Lesson buttons
 *
 * Clicking "Review" toggles an inline rationale panel (spec §8).
 */
export function ReviewQuestionRow({ item }: { item: SmartReviewItem }) {
  const [expanded, setExpanded] = useState(false);

  const rationaleText = item.correctAnswerExplanation ?? item.rationale;
  const firstLesson = item.relatedLessons?.[0];

  return (
    <li className="nn-review-q-row">
      <div className="nn-review-q-row__main">
        {/* Question number */}
        <span className="nn-review-q-row__num">Q{item.index + 1}</span>

        {/* Stem + topic */}
        <div className="nn-review-q-row__body">
          <p className="nn-review-q-row__text" title={item.stem}>
            {item.stem}
          </p>
          {item.topic ? (
            <span className="nn-review-q-row__topic">{item.topic}</span>
          ) : null}
        </div>

        {/* Chips + action buttons */}
        <div className="nn-review-q-row__meta">
          <div className="nn-review-q-row__chips">
            <ReviewMetaChip
              type="result"
              value={item.isCorrect ? "correct" : "incorrect"}
            />
            {item.confidence ? (
              <ReviewMetaChip type="confidence" value={item.confidence} />
            ) : null}
          </div>
          <div className="nn-review-q-row__actions">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className={`nn-review-action-btn${expanded ? " nn-review-action-btn--active" : ""}`}
              aria-expanded={expanded}
              aria-controls={`rationale-${item.id}`}
            >
              {expanded ? "Close" : "Review"}
            </button>
            {firstLesson ? (
              <Link
                href={firstLesson.href}
                className="nn-review-action-link"
                target={firstLesson.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  firstLesson.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
              >
                <BookOpen className="mr-1 h-3 w-3" aria-hidden />
                Lesson
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Inline rationale panel */}
      {expanded ? (
        <div
          id={`rationale-${item.id}`}
          className="nn-review-q-rationale"
          role="region"
          aria-label={`Explanation for question ${item.index + 1}`}
        >
          {/* Full stem */}
          <p className="nn-review-q-rationale__stem">{item.stem}</p>

          {/* Explanation */}
          {rationaleText ? (
            <>
              <p className="nn-review-q-rationale__label">
                {item.isCorrect ? "Why This Is Correct" : "Explanation"}
              </p>
              <p className="nn-review-q-rationale__text">{rationaleText}</p>
            </>
          ) : (
            <p className="nn-review-q-rationale__text italic text-[var(--semantic-text-muted)]">
              No detailed explanation available for this question.
            </p>
          )}

          {/* Lesson links */}
          {(item.relatedLessons?.length ?? 0) > 0 ? (
            <div className="nn-review-q-rationale__links">
              {item.relatedLessons!.map(({ title, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="nn-review-action-link"
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <BookOpen className="mr-1 h-3 w-3" aria-hidden />
                  {title}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

// ── ReviewGroupSection ──────────────────────────────────────────────────────

/**
 * ReviewGroupSection — collapsible group container (spec §9).
 *
 * Groups 1 and 2 default to expanded; 3 and 4 default to collapsed.
 * The header is fully keyboard accessible via button semantics.
 */
export function ReviewGroupSection({
  group,
  filteredItems,
}: {
  group: ReviewGroup;
  filteredItems: SmartReviewItem[];
}) {
  const [expanded, setExpanded] = useState(group.defaultExpanded);

  return (
    <div className={`nn-review-group ${group.variantClass}`}>
      {/* Collapsible header */}
      <button
        type="button"
        className="nn-review-group__header w-full text-left"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls={`group-body-${group.id}`}
      >
        <div className="nn-review-group__header-main">
          <div className="nn-review-group__title-row">
            <span className="nn-review-group__title">{group.title}</span>
            <span className="nn-review-group__count" aria-label={`${filteredItems.length} questions`}>
              {filteredItems.length}
            </span>
          </div>
          <p className="nn-review-group__desc">{group.description}</p>
        </div>
        <ChevronDown
          className={`nn-review-group__chevron${expanded ? " nn-review-group__chevron--open" : ""}`}
          aria-hidden
        />
      </button>

      {/* Group body */}
      {expanded ? (
        <div id={`group-body-${group.id}`} className="nn-review-group__body">
          {filteredItems.length === 0 ? (
            <p className="nn-review-group__empty">
              {emptyMessage(group.id)}
            </p>
          ) : (
            <ul className="nn-review-q-rows">
              {filteredItems.map((item) => (
                <ReviewQuestionRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function emptyMessage(groupId: GroupId): string {
  switch (groupId) {
    case "priority":
      return "No high-confidence mistakes in this session — excellent calibration.";
    case "needs-review":
      return "No incorrect answers in this group. Keep it up!";
    case "uncertain":
      return "No uncertain correct answers — your confidence is well-calibrated.";
    case "strong":
      return "No high-confidence correct answers yet — keep practicing to reach this stage.";
  }
}

// ── ReviewFilters ───────────────────────────────────────────────────────────

/**
 * ReviewFilters — compact inline filter controls (spec §10).
 *
 * Provides:
 * - Toggle: show only incorrect
 * - Toggle: show only high confidence
 * - Dropdown: filter by topic
 */
export function ReviewFilters({
  showOnlyIncorrect,
  showOnlyHighConf,
  filterTopic,
  topics,
  onToggleIncorrect,
  onToggleHighConf,
  onTopicChange,
}: {
  showOnlyIncorrect: boolean;
  showOnlyHighConf: boolean;
  filterTopic: string | null;
  topics: string[];
  onToggleIncorrect: () => void;
  onToggleHighConf: () => void;
  onTopicChange: (topic: string | null) => void;
}) {
  return (
    <div className="nn-review-filters" role="group" aria-label="Review filters">
      <span className="nn-review-filter-label">Filter:</span>

      <button
        type="button"
        onClick={onToggleIncorrect}
        aria-pressed={showOnlyIncorrect}
        className={`nn-review-filter-toggle${showOnlyIncorrect ? " nn-review-filter-toggle--active" : ""}`}
      >
        Incorrect only
      </button>

      <button
        type="button"
        onClick={onToggleHighConf}
        aria-pressed={showOnlyHighConf}
        className={`nn-review-filter-toggle${showOnlyHighConf ? " nn-review-filter-toggle--active" : ""}`}
      >
        High confidence
      </button>

      {topics.length > 0 ? (
        <select
          value={filterTopic ?? ""}
          onChange={(e) =>
            onTopicChange(e.target.value === "" ? null : e.target.value)
          }
          className="nn-review-filter-select"
          aria-label="Filter by topic"
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}

// ── ReviewSummaryStrip ──────────────────────────────────────────────────────

/**
 * ReviewSummaryStrip — top surface-emphasis card with a one-sentence summary
 * derived from the confidence/correctness pattern (spec §3).
 */
export function ReviewSummaryStrip({
  groups,
  totalItems,
}: {
  groups: ReviewGroup[];
  totalItems: number;
}) {
  const priorityCount = groups.find((g) => g.id === "priority")?.items.length ?? 0;
  const uncertainCount = groups.find((g) => g.id === "uncertain")?.items.length ?? 0;
  const strongCount = groups.find((g) => g.id === "strong")?.items.length ?? 0;

  function buildSummary(): string {
    if (priorityCount > 0 && uncertainCount > 0) {
      return `You had ${priorityCount} high-confidence mistake${priorityCount !== 1 ? "s" : ""} and ${uncertainCount} uncertain correct answer${uncertainCount !== 1 ? "s" : ""} — focus on the top groups first.`;
    }
    if (priorityCount > 0) {
      return `You had ${priorityCount} high-confidence mistake${priorityCount !== 1 ? "s" : ""} — these are your highest priority to review.`;
    }
    if (uncertainCount > 0) {
      return `Good accuracy overall, but ${uncertainCount} answer${uncertainCount !== 1 ? "s were" : " was"} correct with low confidence — reinforce those areas.`;
    }
    if (strongCount === totalItems && totalItems > 0) {
      return "Outstanding — every answer was correct with high confidence. Your knowledge is well-calibrated.";
    }
    return "Review your session below, organized by correctness and confidence.";
  }

  return (
    <div className="nn-smart-review-strip">
      <p className="nn-smart-review-strip__heading">Review Your Performance</p>
      <p className="nn-smart-review-strip__body">{buildSummary()}</p>
    </div>
  );
}

// ── SmartReviewLayout ───────────────────────────────────────────────────────

export interface SmartReviewScreenProps {
  items: SmartReviewItem[];
  /** Pass false for free users to show gated preview (spec §6). Default true. */
  isEntitled?: boolean;
}

/**
 * SmartReviewLayout — the full Smart Review Screen (spec §2).
 *
 * Gating (spec §6):
 *   isEntitled = true  → all 4 groups + filters
 *   isEntitled = false → Group 1 (limited to 3 items) + locked preview of
 *                        Group 2 + PremiumLockCard for Groups 3-4
 *
 * Groups:
 *   1. High Priority Fixes   — incorrect + high conf   (warning surface)
 *   2. Needs Review          — incorrect + other        (neutral surface)
 *   3. Uncertain Knowledge   — correct + low/med        (info surface)
 *   4. Strong Areas          — correct + high conf      (success surface)
 */
export function SmartReviewLayout({ items, isEntitled = true }: SmartReviewScreenProps) {
  usePremiumGateImpression("smartReviewLockedViewed", isEntitled);

  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);
  const [showOnlyHighConf, setShowOnlyHighConf] = useState(false);
  const [filterTopic, setFilterTopic] = useState<string | null>(null);

  const groups = useMemo(() => buildGroups(items), [items]);

  const topics = useMemo(() => {
    const ts = new Set<string>();
    for (const item of items) {
      if (item.topic) ts.add(item.topic);
    }
    return [...ts].sort();
  }, [items]);

  function applyFilters(groupItems: SmartReviewItem[]): SmartReviewItem[] {
    return groupItems.filter((item) => {
      if (showOnlyIncorrect && item.isCorrect) return false;
      if (showOnlyHighConf && item.confidence !== "high") return false;
      if (filterTopic && item.topic !== filterTopic) return false;
      return true;
    });
  }

  // ── Free (non-entitled) view ─────────────────────────────────────────────
  if (!isEntitled) {
    const priorityGroup = groups.find((g) => g.id === "priority")!;
    const needsReviewGroup = groups.find((g) => g.id === "needs-review")!;

    // Group 1: show up to 3 items, no filters, no lesson deep-links
    const limitedPriorityItems = priorityGroup.items.slice(0, 3);

    return (
      <div className="nn-smart-review">
        {/* Summary strip (always free) */}
        <ReviewSummaryStrip groups={groups} totalItems={items.length} />

        {/* Group 1 — High Priority Fixes (limited to 3, no filters) */}
        <ReviewGroupSection
          group={priorityGroup}
          filteredItems={limitedPriorityItems}
        />

        {/* Locked preview of Group 2 */}
        {needsReviewGroup.items.length > 0 ? (
          <LockedPreviewCard
            overlayTitle="Unlock Smart Review"
            overlayDescription="See exactly what you're getting wrong and how to fix it. Every question grouped by confidence and review priority."
          >
            <ReviewGroupSection
              group={needsReviewGroup}
              filteredItems={needsReviewGroup.items.slice(0, 2)}
            />
          </LockedPreviewCard>
        ) : null}

        {/* Groups 3-4 fully locked */}
        <PremiumLockCard
          title="Unlock Smart Review"
          description="See exactly what you're getting wrong and how to fix it — overconfidence patterns, uncertain knowledge, and a prioritised review queue."
          secondaryHref="/pricing"
          secondaryLabel="View Plans"
        />
      </div>
    );
  }

  // ── Premium (entitled) view ──────────────────────────────────────────────
  return (
    <div className="nn-smart-review">
      {/* 1 — Summary strip */}
      <ReviewSummaryStrip groups={groups} totalItems={items.length} />

      {/* 2 — Filter controls */}
      {items.length > 1 ? (
        <ReviewFilters
          showOnlyIncorrect={showOnlyIncorrect}
          showOnlyHighConf={showOnlyHighConf}
          filterTopic={filterTopic}
          topics={topics}
          onToggleIncorrect={() => setShowOnlyIncorrect((v) => !v)}
          onToggleHighConf={() => setShowOnlyHighConf((v) => !v)}
          onTopicChange={setFilterTopic}
        />
      ) : null}

      {/* 3 — All 4 groups */}
      {groups.map((group) => (
        <ReviewGroupSection
          key={group.id}
          group={group}
          filteredItems={applyFilters(group.items)}
        />
      ))}
    </div>
  );
}
