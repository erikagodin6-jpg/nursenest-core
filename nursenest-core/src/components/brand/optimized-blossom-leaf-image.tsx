import {
  BLOSSOM_LEAF_128_AVIF,
  BLOSSOM_LEAF_128_WEBP,
  BLOSSOM_LEAF_64_AVIF,
  BLOSSOM_LEAF_64_WEBP,
  BLOSSOM_LEAF_DEFAULT_SRC,
} from "@/lib/branding/blossom-leaf-assets";
import type { ReactEventHandler } from "react";

type OptimizedBlossomLeafImageProps = {
  alt: string;
  className?: string;
  /** Rendered CSS width in px (intrinsic sizes use 64 / 128). */
  width: number;
  /** Rendered CSS height in px. */
  height: number;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  draggable?: boolean;
  "data-nn-header-logo"?: boolean;
  onError?: ReactEventHandler<HTMLImageElement>;
  onLoad?: () => void;
};

/**
 * Responsive AVIF/WebP Blossom leaf — replaces the 1.3MB CDN PNG for nav/footer marks.
 */
export function OptimizedBlossomLeafImage({
  alt,
  className,
  width,
  height,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  draggable,
  onError,
  onLoad,
  ...rest
}: OptimizedBlossomLeafImageProps) {
  const use128 = width > 56 || height > 56;

  return (
    <picture>
      <source
        srcSet={use128 ? BLOSSOM_LEAF_128_AVIF : BLOSSOM_LEAF_64_AVIF}
        type="image/avif"
      />
      <source
        srcSet={use128 ? BLOSSOM_LEAF_128_WEBP : BLOSSOM_LEAF_64_WEBP}
        type="image/webp"
      />
      <img
        src={use128 ? BLOSSOM_LEAF_128_WEBP : BLOSSOM_LEAF_DEFAULT_SRC}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        draggable={draggable}
        className={className}
        onError={onError}
        onLoad={onLoad}
        {...rest}
      />
    </picture>
  );
}
