"use client";

import { NnErrorCard } from "@/components/error/nn-error-card";

export default function BlogPostError({
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
      surface="marketing_blog_post"
      title="Could not load this article"
      description="Try again in a moment. If the problem continues, return to the blog list."
      primaryAction={{ label: "Blog", href: "/blog" }}
      secondaryAction={{ label: "Home", href: "/" }}
    />
  );
}
