"use client";

/**
 * Below-fold marketing stills: load directly from CDN with srcSet (no `/_next/image`).
 * Avoids optimizer/proxy failures while keeping responsive selection and lazy loading.
 */
export function MarketingCdnScreenshot({
  src,
  srcSet,
  sizes,
  alt,
  className,
}: {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
