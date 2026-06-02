"use client";

import Link from "next/link";
import { HeaderBrandLockup } from "@/components/brand/header-brand-lockup";

/**
 * Preview nav logo — reuses production leaf raster + wordmark via `HeaderBrandLockup`.
 */
export function FigmaPreviewNavLogo({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`nn-marketing-nav-link focus-visible:outline-offset-4 inline-flex min-w-0 shrink-0 items-center rounded-lg ${className}`}
      aria-label="NurseNest home"
    >
      <HeaderBrandLockup />
    </Link>
  );
}
