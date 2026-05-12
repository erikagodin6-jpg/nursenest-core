"use client";

import Image from "next/image";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

type LeafWatermarkProps = {
  className?: string;
  imageClassName?: string;
  size?: number;
};

export function LeafWatermark({ className = "", imageClassName = "", size = 420 }: LeafWatermarkProps) {
  const { url, kind } = useThemeLogo("leaf");
  const leafUrl = kind === "local" && typeof url === "string" && url.trim().length > 0 ? url : null;
  if (!leafUrl) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute overflow-hidden select-none ${className}`.trim()}
    >
      <Image
        src={leafUrl}
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        loading="lazy"
        draggable={false}
        className={`h-auto w-auto max-w-none grayscale ${imageClassName}`.trim()}
      />
    </div>
  );
}
