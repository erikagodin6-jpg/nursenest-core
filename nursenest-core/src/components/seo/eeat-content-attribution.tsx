import Link from "next/link";

type BlogProps = {
  variant: "blog";
  authorDisplayName?: string | null;
  authorCredentials?: string | null;
  authorBio?: string | null;
  medicalReviewerName?: string | null;
  medicalReviewerCredentials?: string | null;
};

type LessonProps = {
  variant: "lesson";
};

export type EeatContentAttributionProps = BlogProps | LessonProps;

/**
 * YMYL trust block: author/reviewer when present; otherwise institutional editorial disclosure + policy links.
 */
export function EeatContentAttribution(props: EeatContentAttributionProps) {
  if (props.variant === "lesson") {
    return (
      <aside
        className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--semantic-surface))] p-4 text-sm text-[var(--semantic-text-primary)]"
        aria-label="Editorial and review"
      >
        <p className="font-semibold text-[var(--semantic-text-primary)]">Editorial quality</p>
        <p className="mt-1.5 text-[var(--semantic-text-muted)]">
          NurseNest lessons are written for exam preparation, reviewed under our editorial standards, and updated when
          exam emphasis changes. This page is not a substitute for facility policy, orders, or independent clinical
          judgment.
        </p>
        <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
          <Link className="font-medium text-[var(--semantic-brand)] underline-offset-2 hover:underline" href="/editorial-policy">
            Editorial policy
          </Link>
          {" · "}
          <Link
            className="font-medium text-[var(--semantic-brand)] underline-offset-2 hover:underline"
            href="/content-review-policy"
          >
            Content review policy
          </Link>
          {" · "}
          <Link className="font-medium text-[var(--semantic-brand)] underline-offset-2 hover:underline" href="/disclaimer">
            Disclaimer
          </Link>
        </p>
      </aside>
    );
  }

  const {
    authorDisplayName,
    authorCredentials,
    authorBio,
    medicalReviewerName,
    medicalReviewerCredentials,
  } = props;

  const hasNamedAuthor = Boolean(authorDisplayName?.trim());

  return (
    <aside
      className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] p-4 text-sm"
      aria-label="Author and review"
    >
      {hasNamedAuthor ? (
        <>
          <p className="font-semibold text-[var(--semantic-text-primary)]">
            {authorDisplayName}
            {authorCredentials?.trim() ? (
              <span className="font-normal text-[var(--semantic-text-muted)]"> · {authorCredentials.trim()}</span>
            ) : null}
          </p>
          {authorBio?.trim() ? (
            <p className="mt-2 text-[var(--semantic-text-muted)]">{authorBio.trim()}</p>
          ) : null}
        </>
      ) : (
        <p className="text-[var(--semantic-text-muted)]">
          <span className="font-semibold text-[var(--semantic-text-primary)]">NurseNest editorial</span> — exam-prep
          content produced under our{" "}
          <Link className="font-medium text-[var(--semantic-brand)] underline-offset-2 hover:underline" href="/editorial-policy">
            editorial policy
          </Link>
          . Author bylines are added over time for stronger transparency.
        </p>
      )}
      {medicalReviewerName?.trim() ? (
        <div className="mt-3 space-y-2">
          <span className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_40%,var(--semantic-surface))] px-2.5 py-0.5 text-xs font-semibold text-[var(--semantic-text-primary)]">
            Clinically reviewed
          </span>
          <p className="text-[var(--semantic-text-muted)]">
            <span className="font-semibold text-[var(--semantic-text-primary)]">Reviewer:</span>{" "}
            {medicalReviewerName.trim()}
            {medicalReviewerCredentials?.trim() ? ` · ${medicalReviewerCredentials.trim()}` : null}
          </p>
        </div>
      ) : null}
      <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
        <Link className="font-medium text-[var(--semantic-brand)] underline-offset-2 hover:underline" href="/content-review-policy">
          How we review content
        </Link>
        {" · "}
        <Link className="font-medium text-[var(--semantic-brand)] underline-offset-2 hover:underline" href="/disclaimer">
          Educational disclaimer
        </Link>
      </p>
    </aside>
  );
}
