"use client";

import { useMemo, useRef, useState } from "react";
import { Bookmark, ChevronDown, CheckCircle2 } from "lucide-react";
import {
  QUESTION_BOOKMARK_CATEGORIES,
  QUESTION_BOOKMARK_CATEGORY_LABELS,
  type QuestionBookmarkCategory,
  type QuestionBookmarkPayload,
} from "@/lib/bookmarks/question-bookmarks";

type QuestionBookmarkButtonProps = QuestionBookmarkPayload & {
  compact?: boolean;
  defaultBookmarked?: boolean;
  onSaved?: (category: QuestionBookmarkCategory) => void;
};

export function QuestionBookmarkButton({
  compact = false,
  defaultBookmarked = false,
  onSaved,
  ...payload
}: QuestionBookmarkButtonProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState<QuestionBookmarkCategory | null>(null);
  const [savedCategory, setSavedCategory] = useState<QuestionBookmarkCategory | null>(
    defaultBookmarked ? payload.category ?? "review_later" : null,
  );
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const sourceHref = useMemo(() => {
    if (payload.sourceHref) return payload.sourceHref;
    if (typeof window === "undefined") return null;
    return `${window.location.pathname}${window.location.search}`;
  }, [payload.sourceHref]);

  async function saveBookmark(category: QuestionBookmarkCategory) {
    if (!payload.sourceId.trim()) return;
    setSaving(category);
    try {
      const res = await fetch("/api/learner/question-bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          sourceHref,
          category,
        }),
      });
      if (!res.ok) throw new Error("bookmark-save-failed");
      setSavedCategory(category);
      setOpen(false);
      onSaved?.(category);
    } catch {
      setOpen(false);
    } finally {
      setSaving(null);
      buttonRef.current?.focus();
    }
  }

  return (
    <div className="relative inline-flex shrink-0" data-nn-question-bookmark-control="">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={[
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-sm font-semibold text-[var(--semantic-text-secondary)] transition-colors hover:bg-[var(--semantic-panel-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-focus-ring,var(--semantic-brand))]",
          compact ? "px-3" : "px-4",
          savedCategory
            ? "border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))] text-[var(--semantic-brand)]"
            : "",
        ].join(" ")}
      >
        <Bookmark className={`h-4 w-4 ${savedCategory ? "fill-current" : ""}`} aria-hidden />
        {compact ? null : <span>{savedCategory ? QUESTION_BOOKMARK_CATEGORY_LABELS[savedCategory] : "Bookmark"}</span>}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Bookmark category"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-1.5 shadow-[var(--semantic-shadow-soft)]"
        >
          {QUESTION_BOOKMARK_CATEGORIES.map((category) => {
            const selected = savedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="menuitem"
                disabled={saving !== null}
                onClick={() => void saveBookmark(category)}
                className="flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[var(--semantic-text-primary)] transition-colors hover:bg-[var(--semantic-panel-muted)] disabled:cursor-wait disabled:opacity-70"
              >
                <span>{saving === category ? "Saving..." : QUESTION_BOOKMARK_CATEGORY_LABELS[category]}</span>
                {selected ? <CheckCircle2 className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden /> : null}
              </button>
            );
          })}
          <a
            href="/app/account/bookmarks"
            className="mt-1 flex min-h-10 items-center rounded-xl border-t border-[var(--semantic-border-soft)] px-3 pt-2 text-sm font-semibold text-[var(--semantic-brand)]"
          >
            My Bookmarks
          </a>
        </div>
      ) : null}
    </div>
  );
}
