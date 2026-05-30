"use client";

import Image from "next/image";
import { useState } from "react";
import type { MarketingProofShot } from "@/lib/marketing/marketing-proof-screenshots";
import { MARKETING_HERO_LOCAL_FALLBACK } from "@/lib/marketing-hero-image";

const FALLBACK_CHAIN = [MARKETING_HERO_LOCAL_FALLBACK] as const;

export function MarketingProofScreenshot({
  shot,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  shot: MarketingProofShot;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const chain = [shot.src, shot.fallbackSrc, ...FALLBACK_CHAIN];
  const [index, setIndex] = useState(0);
  const src = chain[Math.min(index, chain.length - 1)]!;

  return (
    <Image
      src={src}
      alt={shot.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover object-top ${className}`.trim()}
      loading={priority ? undefined : "lazy"}
      decoding="async"
      data-nn-marketing-proof-theme={shot.theme}
      onError={() => {
        setIndex((current) => (current < chain.length - 1 ? current + 1 : current));
      }}
    />
  );
}
