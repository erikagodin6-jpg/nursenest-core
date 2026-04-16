"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";

export default function BlogIndexError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <NnErrorCard
      error={error}
      reset={reset}
      surface="marketing_blog_index"
      title="Just a moment"
      description="We’re loading the blog. Try again in a moment — or head home and come back when you’re ready."
      primaryAction={{ label: "Home", href: "/" }}
      secondaryAction={{ label: "Exam lessons", href: "/lessons" }}
    />
  );
}
