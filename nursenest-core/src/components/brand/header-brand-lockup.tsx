"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

/**
 * Header-only brand lockup (all themes):
 * - Always the **leaf** raster from `useThemeLogo("leaf")` — never the full horizontal brand mark.
 * - Lucide `Leaf` silhouette only when the raster fails to load (same slot, no theme swap).
 * - Real text wordmark “NurseNest” for sharp rendering at every density.
 */
export function HeaderBrandLockup() {
  const { url, kind } = useThemeLogo("leaf");
  const [leafLoadFailed, setLeafLoadFailed] = useState(false);
  const leafUrl = kind === "local" && typeof url === "string" && url.trim().length > 0 ? url : null;
  const showLeafRaster = Boolean(leafUrl) && !leafLoadFailed;

  return (
    <span className="relative inline-flex items-center gap-1.5 overflow-visible align-middle leading-none">
      <span className="logo-container relative z-[20] inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center sm:h-[50px] sm:w-[50px] lg:h-[54px] lg:w-[54px]">
        {showLeafRaster ? (
          <img
            src={leafUrl ?? ""}
            alt="NurseNest leaf logo"
            draggable={false}
            width={128}
            height={128}
            data-nn-header-logo
            className="block h-full w-full max-h-full max-w-full bg-transparent object-contain object-center"
            onError={() => setLeafLoadFailed(true)}
          />
        ) : (
          <Leaf
            className="h-[70%] w-[70%] shrink-0 text-[var(--logo-primary)] opacity-[0.95]"
            strokeWidth={1.75}
            aria-hidden
          />
        )}
      </span>
      <span
        className="relative z-[21] text-[1.125rem] font-medium tracking-[-0.01em] leading-none text-[var(--logo-primary)] sm:text-[1.2rem] lg:text-[1.3125rem]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        NurseNest
      </span>
    </span>
  );
}
