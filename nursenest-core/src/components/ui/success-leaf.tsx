"use client";

import { motion, AnimatePresence } from "framer-motion";
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
          transition={reduced ? { duration: 0 } : { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 32"
            width={size}
            height={Math.round(size * 0.64)}
          >
            <path
              d="M6 28 C6 17 14.5 9 25 9 S44 17 44 28 Z"
              fill="var(--semantic-success, var(--theme-primary))"
            />
            <path
              d="M11 28 C11 20.5 17 15 25 15 S39 20.5 39 28 Z"
              fill="var(--theme-card-bg, #fff)"
            />
          </svg>
        </motion.span>
      )}
    </AnimatePresence>
  );
}
