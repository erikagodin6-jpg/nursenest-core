"use client";

import { useState } from "react";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

/**
 * Header-only brand lockup:
 * - Theme leaf asset (single source, no image fallback chain)
 * - Real text wordmark for sharp rendering at every density
 */
export function HeaderBrandLockup() {
  const { url, kind } = useThemeLogo("leaf");
  const [leafLoadFailed, setLeafLoadFailed] = useState(false);
  const leafUrl = kind === "local" && typeof url === "string" && url.trim().length > 0 ? url : null;
  const showLeafAsset = Boolean(leafUrl) && !leafLoadFailed;

  return (
    <span className="relative inline-flex items-center gap-1.5 overflow-visible align-middle leading-none">
      <span className="relative z-[20] -my-4 inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center sm:h-[58px] sm:w-[58px] lg:h-[64px] lg:w-[64px]">
        {showLeafAsset ? (
          <img
            src={leafUrl ?? ""}
            alt="NurseNest leaf logo"
            draggable={false}
            width={128}
            height={128}
            className="block h-full w-full bg-transparent object-contain"
            onError={() => setLeafLoadFailed(true)}
          />
        ) : null}
      </span>
      <span
        className="relative z-[21] text-[1.125rem] font-semibold tracking-[-0.01em] leading-none text-[var(--nav-fg)] sm:text-[1.2rem] lg:text-[1.3125rem]"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        NurseNest
      </span>
    </span>
  );
}
