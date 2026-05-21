"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";
import { NURSENEST_NAV_LEAF_SVG_PATH } from "@/lib/branding/app-icons";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

/**
 * Header-only brand lockup (all themes):
 * - Always the **leaf** raster from `useThemeLogo("leaf")` — never the full horizontal brand mark.
 * - Lucide `Leaf` silhouette only when the raster fails to load (same slot, no theme swap).
 * - Real text wordmark “NurseNest” for sharp rendering at every density.
 */
export function HeaderBrandLockup() {
  const { url, kind } = useThemeLogo("leaf");
  const [failedUrls, setFailedUrls] = useState<ReadonlySet<string>>(() => new Set());
  const leafUrl = kind === "local" && typeof url === "string" && url.trim().length > 0 ? url : null;
  const fallbackLeafUrl = NURSENEST_NAV_LEAF_SVG_PATH;
  const displayLeafUrl =
    leafUrl && !failedUrls.has(leafUrl)
      ? leafUrl
      : !failedUrls.has(fallbackLeafUrl)
        ? fallbackLeafUrl
        : null;
  const showLeafRaster = Boolean(displayLeafUrl);

  return (
    <span
      data-nn-header-brand-lockup
      className="nn-header-brand-lockup nn-header-brand-lockup--compact relative inline-flex items-center gap-0 overflow-visible align-middle leading-none"
    >
      <span
        className="logo-container relative z-[20] inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center text-current sm:h-[46px] sm:w-[46px] lg:h-[50px] lg:w-[50px]"
        data-nn-header-lockup="leaf"
      >
        {showLeafRaster ? (
          <img
            src={displayLeafUrl ?? ""}
            alt="NurseNest leaf logo"
            draggable={false}
            width={128}
            height={128}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            data-nn-header-logo
            className="block h-full w-full max-h-full max-w-full bg-transparent object-contain object-center"
            onError={() => {
              if (!displayLeafUrl) return;
              setFailedUrls((prev) => new Set(prev).add(displayLeafUrl));
            }}
          />
        ) : (
          <Leaf
            className="h-[72%] w-[72%] shrink-0 opacity-[0.96] text-current"
            strokeWidth={1.65}
            aria-hidden
          />
        )}
      </span>
      <span
        data-nn-header-lockup="wordmark"
        className="relative z-[21] text-[1.12rem] font-semibold tracking-[-0.025em] leading-none text-current sm:text-[1.18rem] lg:text-[1.28rem]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        NurseNest
      </span>
    </span>
  );
}
