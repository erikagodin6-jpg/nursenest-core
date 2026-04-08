/**
 * Suspense fallback for exam pathway lesson hubs, topic pages, and lesson detail —
 * keeps navigation responsive when DB/catalog work is slow.
 */
export default function ExamPathwayLessonsSegmentLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="h-6 max-w-xs animate-pulse rounded bg-muted/30" />
      <div className="mt-4 h-4 max-w-md animate-pulse rounded bg-muted/20" />
      <div className="mt-3 h-4 max-w-sm animate-pulse rounded bg-muted/20" />
      <div className="mt-10 space-y-3">
        <div className="h-16 animate-pulse rounded-lg bg-muted/15" />
        <div className="h-16 animate-pulse rounded-lg bg-muted/15" />
        <div className="h-16 animate-pulse rounded-lg bg-muted/15" />
      </div>
    </div>
  );
}
