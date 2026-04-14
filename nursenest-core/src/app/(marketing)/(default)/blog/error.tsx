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
      title="Could not load the blog"
      description="Please try again. Your connection may be unstable, or we hit a temporary issue."
      primaryAction={{ label: "Home", href: "/" }}
      secondaryAction={{ label: "Exam lessons", href: "/lessons" }}
    />
  );
}
