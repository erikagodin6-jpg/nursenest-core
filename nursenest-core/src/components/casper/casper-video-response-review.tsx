import type { CasperVideoResponseRecord } from "@/lib/casper/casper-video-storage";

type CasperVideoResponseReviewProps = {
  responses: CasperVideoResponseRecord[];
};

export function CasperVideoResponseReview({
  responses,
}: CasperVideoResponseReviewProps) {
  if (responses.length === 0) {
    return (
      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
        <h2 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">
          No saved video responses yet.
        </h2>

        <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">
          Recorded video responses will appear here for replay and reflective review.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      {responses.map((response, index) => (
        <article
          key={response.id}
          className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
                Video response replay
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">
                Station {index + 1}
              </h2>
            </div>

            <div className="rounded-full border border-[var(--semantic-border-primary)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-secondary)]">
              {response.mimeType}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[var(--semantic-border-primary)] bg-black">
            <video
              controls
              src={response.blobUrl}
              className="aspect-video w-full object-cover"
            />
          </div>
        </article>
      ))}
    </section>
  );
}
