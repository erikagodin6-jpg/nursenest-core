"use client";

import type { ReactNode } from "react";
import { BrandedLeafMark } from "@/components/ui/premium-loader/branded-leaf-mark";
import styles from "@/components/ui/premium-loader/premium-loader.module.css";
import { useDelayedLoading } from "@/components/ui/premium-loader/use-delayed-loading";
import { cn } from "@/lib/utils";

export type BrandedInlineLoaderProps = {
  active?: boolean;
  delayMs?: number;
  label?: string;
  className?: string;
  trailing?: ReactNode;
};

/**
 * Compact inline loader for session shells / secondary surfaces.
 */
export function BrandedInlineLoader({
  active = true,
  delayMs = 280,
  label,
  className,
  trailing,
}: BrandedInlineLoaderProps) {
  const showDeferred = useDelayedLoading(active, { delayMs });

  return (
    <span
      className={cn(styles.inlineRoot, className)}
      aria-busy="true"
      aria-live="polite"
      aria-label={label ?? "Loading"}
    >
      <span className={cn(styles.inlineLeaf, showDeferred && styles.inlineLeafMotion)}>
        <BrandedLeafMark className="!h-[1.15rem] !w-[0.95rem]" />
      </span>
      {label && showDeferred ? <span className={styles.inlineLabel}>{label}</span> : null}
      {trailing}
    </span>
  );
}
