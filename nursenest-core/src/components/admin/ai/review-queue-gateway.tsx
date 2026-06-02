"use client";

import dynamic from "next/dynamic";

const ReviewQueueClient = dynamic(() => import("./review-queue-client").then((m) => m.ReviewQueueClient), {
  loading: () => <p className="text-sm text-muted">Loading review queue…</p>,
  ssr: false,
});

export function ReviewQueueGateway() {
  return <ReviewQueueClient />;
}
