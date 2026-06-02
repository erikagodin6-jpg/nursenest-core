import type { CSSProperties } from "react";

/**
 * DecorativeBrandWatermark
 *
 * Renders the NurseNest leaf image as a decorative, non-interactive background
 * element. Uses the actual brand leaf asset — never CSS masking or geometric
 * approximations. Opacity 0.02–0.05 so it never covers content.
 *
 * Usage:
 *   <DecorativeBrandWatermark />                 — top-right (default)
 *   <DecorativeBrandWatermark position="bl" />   — bottom-left
 *   <DecorativeBrandWatermark position="dual" /> — tr + bl pair
 */

interface DecorativeBrandWatermarkProps {
  /** Corner placement. "dual" renders two leaves (tr + bl). */
  position?: "tr" | "tl" | "br" | "bl" | "dual";
  /** Opacity for the primary leaf. Should stay between 0.02 and 0.05. */
  opacity?: number;
  /**
   * Size of the leaf (CSS length). Defaults scale per breakpoint via CSS.
   * Leave unset to use the built-in responsive default.
   */
  size?: string;
  className?: string;
}

const LEAF_SRC = "/branding/blossom-leaf/leaf-128.webp";
const LEAF_FALLBACK = "/branding/blossom-leaf.png";

function leafStyle(
  corner: "tr" | "tl" | "br" | "bl",
  opacity: number,
  size?: string,
): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    userSelect: "none",
    opacity,
    // Never clip the leaf into a geometric shape; let it breathe
    objectFit: "contain",
    objectPosition: "center",
    zIndex: 0,
  };

  const dim = size ?? "clamp(180px, 28vw, 360px)";

  if (corner === "tr") return { ...base, top: "-4%", right: "-4%", width: dim, height: dim };
  if (corner === "tl") return { ...base, top: "-4%", left: "-4%", width: dim, height: dim };
  if (corner === "br") return { ...base, bottom: "-4%", right: "-4%", width: dim, height: dim };
  return { ...base, bottom: "-4%", left: "-4%", width: dim, height: dim };
}

export function DecorativeBrandWatermark({
  position = "tr",
  opacity = 0.035,
  size,
  className = "",
}: DecorativeBrandWatermarkProps) {
  const clampedOpacity = Math.min(0.05, Math.max(0.02, opacity));

  const leafImg = (corner: "tr" | "tl" | "br" | "bl", op = clampedOpacity) => (
    <img
      key={corner}
      src={LEAF_SRC}
      onError={(e) => {
        (e.target as HTMLImageElement).src = LEAF_FALLBACK;
      }}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={leafStyle(corner, op, size)}
      // Ensure the leaf never becomes interactive or focusable
      tabIndex={-1}
    />
  );

  if (position === "dual") {
    return (
      <div
        aria-hidden="true"
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        style={{ zIndex: 0 }}
      >
        {leafImg("tr", clampedOpacity)}
        {leafImg("bl", clampedOpacity * 0.7)}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    >
      {leafImg(position)}
    </div>
  );
}
