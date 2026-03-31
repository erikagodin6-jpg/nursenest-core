"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";
import {
  examPrepHrefForHint,
  secondaryExamPrepHrefForHint,
  type PreNursingFuturePathwayHint,
} from "@/lib/pre-nursing/pre-nursing-conversion-links";
import { nextPreNursingModuleSlug, preNursingCompletionFraction } from "@/lib/pre-nursing/pre-nursing-adaptive";

const dict = strings as Record<string, string>;

const LS_KEY = "pre-nursing-completed-slugs-v1";

function readLocalCompleted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function writeLocalCompleted(slugs: string[]) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(slugs));
  } catch {
    /* ignore */
  }
}

function moduleTitleForSlug(s: string): string {
  const m = PRE_NURSING_MODULE_REGISTRY.find((x) => x.slug === s);
  return m ? dict[m.titleKey] ?? s : s;
}

type ProgressApi = {
  authenticated: boolean;
  completedSlugs: string[];
  nextSlug: string | null;
  progressPercent: number;
  modulesTotal: number;
  completedCount: number;
};

export function PreNursingModuleEngagement({
  slug,
  moduleTitle,
}: {
  slug: string;
  moduleTitle: string;
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [hint, setHint] = useState<PreNursingFuturePathwayHint | null>(null);

  const load = useCallback(async () => {
    const local = readLocalCompleted();
    try {
      const res = await fetch("/api/learner/pre-nursing-progress", { method: "GET" });
      if (!res.ok) {
        setSignedIn(false);
        setCompleted(new Set(local));
        return;
      }
      const data = (await res.json()) as ProgressApi;
      setSignedIn(data.authenticated === true);
      const merged = new Set<string>([...(data.completedSlugs ?? []), ...local]);
      setCompleted(merged);
    } catch {
      setSignedIn(false);
      setCompleted(new Set(local));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/learner/pre-nursing-plan", { method: "GET" });
        if (!res.ok) return;
        const j = (await res.json()) as { preNursingFuturePathwayHint?: string | null };
        const h = j.preNursingFuturePathwayHint;
        if (h && ["rn", "rpn", "pn", "np", "unsure"].includes(h)) {
          setHint(h as PreNursingFuturePathwayHint);
        }
      } catch {
        /* optional */
      }
    })();
  }, []);

  const isDone = completed.has(slug);
  const { pct } = preNursingCompletionFraction(completed.size);
  const nextSlug = useMemo(() => nextPreNursingModuleSlug(completed), [completed]);

  const resumeSlug = useMemo(
    () => PRE_NURSING_MODULE_REGISTRY.find((m) => !completed.has(m.slug))?.slug ?? null,
    [completed],
  );
  const showResume = Boolean(resumeSlug && completed.size > 0 && resumeSlug !== slug);

  const nextTitle = nextSlug ? moduleTitleForSlug(nextSlug) : null;

  async function toggleDone(next: boolean) {
    setSaving(true);
    const nextSet = new Set(completed);
    if (next) nextSet.add(slug);
    else nextSet.delete(slug);
    writeLocalCompleted([...nextSet]);
    setCompleted(nextSet);

    try {
      const res = await fetch("/api/learner/pre-nursing-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, completed: next }),
      });
      if (res.ok) {
        setSignedIn(true);
        await load();
      } else if (res.status === 401) {
        setSignedIn(false);
      }
    } catch {
      /* keep local progress */
    }
    setSaving(false);
  }

  const primaryHref = examPrepHrefForHint(hint ?? "unsure");
  const secondaryHref = secondaryExamPrepHrefForHint(hint ?? "unsure");
  const pathwayHintSet = hint && hint !== "unsure";

  const showMilestoneCta = completed.size >= 3 || isDone;

  return (
    <section className="mx-auto mt-12 max-w-4xl border-t border-border px-4 pb-16 sm:px-6 lg:px-8">
      <div className="nn-card space-y-4 p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Your progress · {moduleTitle}</h2>
        <p className="text-sm text-muted">
          Pre-Nursing stays free — progress is optional.{" "}
          {signedIn === false ? "Sign in to sync completion across devices." : null}{" "}
          {signedIn === true ? "Signed in — completions save to your account." : null}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-2 flex-1 min-w-[120px] overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-medium text-foreground">{pct}% of modules</span>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={isDone}
            disabled={saving}
            onChange={(e) => void toggleDone(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Mark “{moduleTitle}” as complete
        </label>
        {showResume && resumeSlug ? (
          <p className="text-sm text-muted">
            Pick up where you left off:{" "}
            <Link href={`/pre-nursing/lessons/${resumeSlug}`} className="font-semibold text-primary hover:underline">
              {moduleTitleForSlug(resumeSlug)}
            </Link>
          </p>
        ) : null}
        {nextSlug && nextSlug !== slug && nextTitle ? (
          <p className="text-sm text-muted">
            Suggested next in sequence:{" "}
            <Link href={`/pre-nursing/lessons/${nextSlug}`} className="font-semibold text-primary hover:underline">
              {nextTitle}
            </Link>
          </p>
        ) : null}
        {nextSlug === null && completed.size >= PRE_NURSING_MODULE_REGISTRY.length ? (
          <p className="text-sm font-medium text-primary">
            You’ve touched every module in this catalog — explore exam prep below when you want practice under a paid plan.
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="nn-card p-6">
          <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Stay in Pre-Nursing</h3>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
            <li>
              <Link href="/pre-nursing/lessons" className="text-primary hover:underline">
                Browse all modules (paginated)
              </Link>
            </li>
            <li>
              <Link href="/pre-nursing/study-plan" className="text-primary hover:underline">
                Target date &amp; unsure pacing
              </Link>
            </li>
            <li>
              <Link href="/tools/med-math" className="text-primary hover:underline">
                Med math tools
              </Link>
            </li>
          </ul>
        </div>

        <div className="nn-card p-6">
          <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Ready for exam-style prep</h3>
          <p className="mt-2 text-sm text-muted">
            Paid NurseNest plans add full question banks, mocks, and pathway-scoped lessons — after you’re comfortable with
            the basics here.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/pricing" className="font-medium text-primary hover:underline">
                Compare plans
              </Link>
            </li>
            <li>
              <Link href="/exam-lessons" className="font-medium text-primary hover:underline">
                Browse exam lesson hubs
              </Link>
            </li>
            {primaryHref ? (
              <li>
                <Link href={primaryHref} className="font-medium text-primary hover:underline">
                  {hint === "rn"
                    ? "US RN (NCLEX-RN) pathway"
                    : hint === "pn"
                      ? "US PN (NCLEX-PN) pathway"
                      : hint === "rpn"
                        ? "Canada RPN (REX-PN) pathway"
                        : hint === "np"
                          ? "NP pathway hub"
                          : "Suggested pathway"}
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/exam-lessons" className="font-medium text-primary hover:underline">
                  Explore NCLEX &amp; RN/PN pathways
                </Link>
              </li>
            )}
            {secondaryHref ? (
              <li>
                <Link href={secondaryHref} className="font-medium text-muted-foreground hover:text-primary hover:underline">
                  Canada RN (NCLEX-RN) pathway
                </Link>
              </li>
            ) : null}
          </ul>
          {!pathwayHintSet ? (
            <p className="mt-3 text-xs text-muted">
              Set a likely route on the{" "}
              <Link href="/pre-nursing/study-plan" className="text-primary hover:underline">
                study planning
              </Link>{" "}
              page to personalize these links.
            </p>
          ) : null}
          {showMilestoneCta ? (
            <p className="mt-4 text-xs text-muted">
              You’ve built momentum — exam-style prep is there when you want timed practice and full banks under a paid plan.
            </p>
          ) : (
            <p className="mt-4 text-xs text-muted">Focus on foundations here; we’ll keep exam prep one click away.</p>
          )}
        </div>
      </div>
    </section>
  );
}
