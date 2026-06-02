import { IconArrowRight } from "./workspace-icons";

export type ContinueStudyingData = {
  title: string;
  subtitle: string;
  href: string;
} | null;

/** Skeleton shown via Suspense while server data streams in */
export function ContinueStudyingCardSkeleton() {
  return (
    <div
      className="nn-workspace-continue"
      aria-hidden="true"
      style={{ opacity: 0.5 }}
    >
      <div
        style={{
          height: "0.625rem",
          width: "60%",
          borderRadius: "0.25rem",
          background: "var(--semantic-border-soft)",
          marginBottom: "0.4rem",
        }}
      />
      <div
        style={{
          height: "0.75rem",
          width: "90%",
          borderRadius: "0.25rem",
          background: "var(--semantic-border-soft)",
          marginBottom: "0.25rem",
        }}
      />
      <div
        style={{
          height: "0.625rem",
          width: "40%",
          borderRadius: "0.25rem",
          background: "var(--semantic-border-soft)",
        }}
      />
    </div>
  );
}

/** Rendered once server data resolves */
export function ContinueStudyingCard({ data, fallbackHref }: { data: ContinueStudyingData; fallbackHref: string }) {
  if (!data) {
    return (
      <a href={fallbackHref} className="nn-workspace-continue">
        <div className="nn-workspace-continue__label">Start Studying</div>
        <div className="nn-workspace-continue__title">Begin your study plan</div>
        <div className="nn-workspace-continue__cta">
          Start <IconArrowRight />
        </div>
      </a>
    );
  }

  return (
    <a href={data.href} className="nn-workspace-continue">
      <div className="nn-workspace-continue__label">Continue Studying</div>
      <div className="nn-workspace-continue__title" title={data.title}>
        {data.title}
      </div>
      <div className="nn-workspace-continue__sub">{data.subtitle}</div>
      <div className="nn-workspace-continue__cta">
        Resume <IconArrowRight />
      </div>
    </a>
  );
}
