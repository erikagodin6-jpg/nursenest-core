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
      title="Just a moment"
      description="We’re loading this article. Try again in a moment — or browse the blog from the link below."
      primaryAction={{ label: "Blog", href: "/blog" }}
      secondaryAction={{ label: "Home", href: "/" }}
    />
  );
}
