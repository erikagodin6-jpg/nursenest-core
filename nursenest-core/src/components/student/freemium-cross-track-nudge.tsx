import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

export type FreemiumCrossTrackVariant = "lessons_exhausted" | "questions_exhausted";

export async function FreemiumCrossTrackNudge({ variant }: { variant: FreemiumCrossTrackVariant }) {
  const { t } = await getLearnerMarketingBundle();
  const key =
    variant === "lessons_exhausted" ? "freemium.crossBanner.lessonsExhausted" : "freemium.crossBanner.questionsExhausted";
  return (
    <div
      role="status"
      className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[var(--semantic-info-soft)] px-4 py-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]"
    >
      {t(key)}
    </div>
  );
}
