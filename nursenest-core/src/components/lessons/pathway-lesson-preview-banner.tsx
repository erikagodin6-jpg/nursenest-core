import Link from "next/link";
import type { PathwayLessonPreviewKind } from "@/lib/lessons/pathway-lesson-access";

type Props = {
  kind: PathwayLessonPreviewKind;
  pathwayShortName: string;
  pathwayCountryLabel: string;
};

/**
 * Explains why a pathway lesson is preview-only and routes users to the right recovery action.
 */
export function PathwayLessonPreviewBanner({ kind, pathwayShortName, pathwayCountryLabel }: Props) {
  const loginHref = `/login?callbackUrl=${encodeURIComponent("/app")}`;

  const copy: Record<PathwayLessonPreviewKind, { title: string; body: string }> = {
    anonymous: {
      title: "Preview mode",
      body: `You are reading a free preview of this ${pathwayShortName} lesson (${pathwayCountryLabel}). Create an account to save progress, then subscribe to unlock every section, rationales in the bank, and timed exams for this pathway.`,
    },
    inactive_subscription: {
      title: "Subscription required",
      body: `Your account does not have an active paid subscription, or billing needs attention. Renew or upgrade to unlock the full lesson, all sections, and pathway-scoped practice.`,
    },
    wrong_plan_country: {
      title: "Different plan or region",
      body: `This hub is for ${pathwayShortName} in ${pathwayCountryLabel}. Your current subscription targets another exam tier or country. Choose a matching plan on Pricing, or switch to a hub that aligns with your subscription.`,
    },
    np_specialty_mismatch: {
      title: "NP specialty alignment",
      body: `This lesson belongs to a specific NP certification hub. In your profile, set your learner pathway to the same NP track you are studying so lessons, questions, and mocks stay consistent.`,
    },
    default_preview: {
      title: "Preview-only content",
      body: `You see the first section only because of subscription preview rules—not because the lesson is missing from our catalog or untranslated. If a separate notice mentions language, that is about translation; this banner is about access. Full sections unlock with a plan that matches this pathway and country.`,
    },
  };

  const { title, body } = copy[kind];

  return (
    <aside className="nn-card mt-6 border-primary/20 bg-primary/5 p-4 text-sm text-[var(--theme-body-text)]">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-muted">{body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {kind === "anonymous" ? (
          <>
            <Link
              href={loginHref}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Sign in
            </Link>
            <Link href="/signup" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Create account
            </Link>
          </>
        ) : null}
        <Link href="/pricing" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          View plans
        </Link>
        {kind === "inactive_subscription" || kind === "wrong_plan_country" ? (
          <Link href="/app" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
            Open study hub
          </Link>
        ) : null}
        {kind === "np_specialty_mismatch" ? (
          <Link href="/app" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
            Profile & pathway
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
