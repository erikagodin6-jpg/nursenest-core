import Link from "next/link";
import type { PathwayLessonPreviewKind } from "@/lib/lessons/pathway-lesson-access";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

type Props = {
  kind: PathwayLessonPreviewKind;
  pathwayShortName: string;
  pathwayCountryLabel: string;
  /** Current marketing lesson URL — keeps users in the same shell after sign-in. */
  postAuthReturnPath?: string;
};

const FEATURE_BULLETS = [
  "Full lesson content — every section and clinical note",
  "Rationales for every practice question",
  "Pathway-matched flashcard decks",
  "Timed mock exams and question bank",
];

/**
 * Explains why a pathway lesson is preview-only and routes users to the right recovery action.
 * Renders server-side; no client state required.
 */
export function PathwayLessonPreviewBanner({ kind, pathwayShortName, pathwayCountryLabel, postAuthReturnPath }: Props) {
  const resume = postAuthReturnPath?.trim()
    ? postAuthReturnPath.startsWith("/")
      ? postAuthReturnPath
      : `/${postAuthReturnPath}`
    : "/";
  const loginHref = loginWithCallback(resume);

  const copy: Record<PathwayLessonPreviewKind, { badge: string; title: string; body: string }> = {
    anonymous: {
      badge: "Free preview",
      title: "Unlock the full lesson",
      body: `You are reading the free preview of this ${pathwayShortName} lesson (${pathwayCountryLabel}). Create an account and subscribe to access every section, practice questions with rationales, and timed exams.`,
    },
    inactive_subscription: {
      badge: "Subscription required",
      title: "Renew to continue reading",
      body: "Your account does not have an active subscription, or billing needs attention. Renew or upgrade to unlock all sections and pathway-scoped practice for this hub.",
    },
    wrong_plan_country: {
      badge: "Plan mismatch",
      title: "Switch to a matching plan",
      body: `This hub covers ${pathwayShortName} in ${pathwayCountryLabel}. Your current subscription targets a different exam tier or country. Choose a matching plan on Pricing, or switch to a hub aligned with your subscription.`,
    },
    np_specialty_mismatch: {
      badge: "NP specialty",
      title: "Align your learner pathway",
      body: "This lesson belongs to a specific NP certification hub. In your profile, set your learner pathway to the same NP track you are studying so lessons, questions, and mocks stay consistent.",
    },
    default_preview: {
      badge: "Preview only",
      title: "Preview-only content",
      body: "Full sections unlock with a plan that matches this pathway and country. If a separate notice mentions language, that is about translation — this banner is about access only.",
    },
  };

  const { badge, title, body } = copy[kind];
  const showFeatureBullets = kind === "anonymous" || kind === "inactive_subscription";

  return (
    <aside
      className="nn-card mt-4 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--bg-card)_94%,var(--semantic-brand-soft)_6%)] p-4 sm:p-5"
      aria-label="Lesson access"
    >
      {/* Badge + title */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] px-2.5 py-0.5 text-xs font-medium text-[var(--semantic-brand)]">
          {badge}
        </span>
      </div>
      <p className="mt-1.5 text-base font-medium leading-relaxed text-[var(--theme-heading-text)]">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--theme-body-text)]">{body}</p>

      {/* Feature bullets */}
      {showFeatureBullets ? (
        <ul className="mt-4 space-y-1.5">
          {FEATURE_BULLETS.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-[var(--theme-body-text)]">
              <span className="mt-0.5 shrink-0 text-[var(--semantic-success)]" aria-hidden>
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
      ) : null}

      {/* CTAs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {kind === "anonymous" ? (
          <>
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
            >
              Start free trial
            </Link>
            <Link
              href={loginHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-border-soft)_40%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
            >
              Sign in
            </Link>
          </>
        ) : null}

        {kind === "inactive_subscription" ? (
          <>
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
            >
              Subscribe
            </Link>
            <Link
              href="/app"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-border-soft)_40%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
            >
              Open study hub
            </Link>
          </>
        ) : null}

        {kind === "wrong_plan_country" ? (
          <>
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
            >
              View plans
            </Link>
            <Link
              href="/app"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-border-soft)_40%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
            >
              Study hub
            </Link>
          </>
        ) : null}

        {kind === "np_specialty_mismatch" ? (
          <Link
            href="/app"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
          >
            Profile &amp; pathway
          </Link>
        ) : null}

        {kind === "default_preview" ? (
          <Link
            href="/pricing"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
          >
            View plans
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
