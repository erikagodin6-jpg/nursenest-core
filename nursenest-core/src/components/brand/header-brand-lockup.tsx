"use client";

import { useThemeLogo } from "@/lib/theme/use-theme-logo";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";

/**
 * Header-only brand lockup:
 * - Theme leaf asset (single source, no image fallback chain)
 * - Real text wordmark for sharp rendering at every density
 */
export function HeaderBrandLockup() {
  const { url, kind } = useThemeLogo("leaf");
  const showLeafAsset = kind === "local" && Boolean(url);

  return (
    <span className="inline-flex items-center gap-2.5 overflow-visible align-middle leading-none">
      {showLeafAsset ? (
        <img
          src={url ?? ""}
          alt=""
          aria-hidden="true"
          draggable={false}
          width={72}
          height={72}
          className="block h-[30px] w-[30px] shrink-0 bg-transparent object-contain sm:h-[34px] sm:w-[34px] lg:h-[36px] lg:w-[36px]"
        />
      ) : (
        <BrandLeafIcon size={36} className="shrink-0" />
      )}
      <span
        className="text-[1.125rem] font-semibold tracking-[-0.01em] leading-none text-[var(--nav-fg)] sm:text-[1.2rem] lg:text-[1.25rem]"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        NurseNest
      </span>
    </span>
  );
}
