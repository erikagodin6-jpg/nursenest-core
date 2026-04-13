"use client";

import { motion } from "framer-motion";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type Props = {
  /** Visual width in px */
  size?: number;
  className?: string;
};

/**
 * Subtle entrance motion for the brand leaf (404 and similar surfaces).
 * Reduced motion: static leaf, no travel.
 */
export function BrandLeafMark({ size = 56, className = "" }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`.trim()}
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
      }
      aria-hidden
    >
      <BrandLeafIcon tone="brand" size={size} />
    </motion.div>
  );
}
