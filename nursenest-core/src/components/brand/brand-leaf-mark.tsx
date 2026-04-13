"use client";

import { motion } from "framer-motion";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
import {
  notFoundLeafFloatTransition,
  transitionNotFoundLeafEntrance,
} from "@/lib/motion/presets";
import { pickTransition, pickVariants } from "@/lib/motion/reduced-motion";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { fadeUpVariants } from "@/lib/motion/presets";

type Props = {
  /** Visual width in px */
  size?: number;
  className?: string;
};

const leafEntranceHidden = { opacity: 0, y: 8 };
const leafEntranceVisible = { opacity: 1, y: 0 };

/**
 * 404 and similar surfaces: calm entrance, then a very slow decorative float (disabled when reduced motion).
 */
export function BrandLeafMark({ size = 56, className = "" }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`.trim()}
      initial={reduced ? { opacity: 1, y: 0 } : leafEntranceHidden}
      animate={reduced ? { opacity: 1, y: 0 } : leafEntranceVisible}
      transition={pickTransition(reduced, transitionNotFoundLeafEntrance)}
      aria-hidden
    >
      <motion.div
        className="inline-flex"
        animate={
          reduced
            ? { y: 0, rotate: 0, opacity: 1 }
            : {
                y: [0, -3, 0],
                rotate: [0, 1.25, 0],
                opacity: [1, 0.94, 1],
              }
        }
        transition={reduced ? { duration: 0 } : notFoundLeafFloatTransition}
      >
        <BrandLeafIcon tone="brand" size={size} />
      </motion.div>
    </motion.div>
  );
}
