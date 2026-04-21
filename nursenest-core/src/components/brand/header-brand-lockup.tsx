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
    <span className="relative inline-flex items-center gap-1 overflow-visible align-middle leading-none">
      <span className="relative z-[20] -my-4 inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center sm:h-[58px] sm:w-[58px] lg:h-[64px] lg:w-[64px]">
        {showLeafRaster ? (
          <img
            src={leafUrl ?? ""}
            alt="NurseNest leaf logo"
            draggable={false}
            width={128}
            height={128}
            className="block h-full w-full bg-transparent object-contain"
            onError={() => setLeafLoadFailed(true)}
          />
        ) : (
          <Leaf
            className="h-[70%] w-[70%] shrink-0 text-[var(--nav-fg)] opacity-[0.92]"
            strokeWidth={1.75}
            aria-hidden
          />
        )}
      </span>
      <span
        className="relative z-[21] text-[1.125rem] font-medium tracking-[-0.01em] leading-none sm:text-[1.2rem] lg:text-[1.3125rem]"
        style={{
          fontFamily: "var(--font-sans)",
          color: "color-mix(in srgb, var(--theme-primary) 32%, var(--nav-fg))",
        }}
      >
        NurseNest
      </span>
    </span>
  );
}
