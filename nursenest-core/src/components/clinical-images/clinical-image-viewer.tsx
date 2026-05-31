"use client";

import { useMemo, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";

export type ClinicalImageViewerImage = {
  url: string;
  alt: string;
  caption?: string | null;
  title?: string | null;
};

function safeScale(value: number): number {
  return Math.max(1, Math.min(2.5, Number(value.toFixed(2))));
}

function imageSrcFromHtmlOrUrl(value: string): string {
  const raw = value.trim();
  const srcMatch = raw.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
  return srcMatch?.[1]?.trim() || raw;
}

export function normalizeClinicalImageInput(image: ClinicalImageViewerImage): ClinicalImageViewerImage {
  return {
    ...image,
    url: imageSrcFromHtmlOrUrl(image.url),
  };
}

export function ClinicalImageViewer({
  image,
  className = "",
  compact = false,
}: {
  image: ClinicalImageViewerImage;
  className?: string;
  compact?: boolean;
}) {
  const normalized = useMemo(() => normalizeClinicalImageInput(image), [image]);
  const [scale, setScale] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const frameId = `clinical-image-${normalized.url.replace(/[^a-z0-9]+/gi, "-").slice(0, 48)}`;

  return (
    <figure
      className={`rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 shadow-[var(--semantic-shadow-soft)] ${className}`}
      data-nn-clinical-image-viewer
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <figcaption className="min-w-0 text-sm font-semibold text-[var(--semantic-text-primary)]">
          {normalized.title ?? "Clinical Image"}
        </figcaption>
        <div className="flex items-center gap-1" aria-label="Image zoom controls">
          <button
            type="button"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
            onClick={() => setScale((v) => safeScale(v - 0.25))}
            aria-label="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
            onClick={() => setScale((v) => safeScale(v + 0.25))}
            aria-label="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
            onClick={() => setScale(1)}
            aria-label="Reset zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={frameId}
            aria-label={expanded ? "Use standard image view" : "Use expanded image view"}
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
      <div
        id={frameId}
        className={`mt-3 overflow-auto rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] ${expanded ? "max-h-[75dvh]" : compact ? "max-h-[18rem]" : "max-h-[min(56dvh,32rem)]"}`}
        tabIndex={0}
        aria-label="Scrollable zoomable clinical image frame"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- clinical images may be CDN or local SVG assets already governed by the image catalog */}
        <img
          src={normalized.url}
          alt={normalized.alt}
          className="mx-auto h-auto max-w-none object-contain transition-transform duration-150 ease-out"
          style={{ width: `${scale * 100}%` }}
          loading="lazy"
        />
      </div>
      {normalized.caption ? (
        <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{normalized.caption}</p>
      ) : null}
    </figure>
  );
}

export function ClinicalImageGallery({
  images,
  className = "",
}: {
  images: ClinicalImageViewerImage[];
  className?: string;
}) {
  const normalized = images
    .map(normalizeClinicalImageInput)
    .filter((image) => image.url.startsWith("https://") || image.url.startsWith("/"));
  if (normalized.length === 0) return null;

  return (
    <div className={`grid gap-3 ${className}`} data-nn-clinical-image-gallery>
      {normalized.map((image) => (
        <ClinicalImageViewer key={`${image.url}:${image.title ?? ""}`} image={image} />
      ))}
    </div>
  );
}
