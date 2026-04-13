"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
import { successLeafTransition } from "@/lib/motion/presets";
import { pickTransition } from "@/lib/motion/reduced-motion";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface SuccessLeafProps {
  /** Controls whether the leaf is visible. Animates in when true. */
  show: boolean;
  /** Size in px. Default 28. */
  size?: number;
  className?: string;
}

/**
 * Animated NurseNest leaf icon for completion states.
 * Scales from 0.95 to 1.0 with a soft opacity fade over 220ms.
 * Reduced motion: appears instantly.
 */
export function SuccessLeaf({ show, size = 28, className = "" }: SuccessLeafProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.span
          className={`inline-flex shrink-0 items-center justify-center ${className}`}
          initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={pickTransition(reduced, successLeafTransition)}
          aria-hidden
        >
          <BrandLeafIcon tone="success" size={size} />
        </motion.span>
      )}
    </AnimatePresence>
  );
}
