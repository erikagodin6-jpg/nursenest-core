"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import { type ReactNode, forwardRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";
import {
  fadeUpVariants,
  fadeVariants,
  scaleInVariants,
  staggerContainer,
  transitionEntrance,
  transitionNormal,
  reducedMotionVariants,
} from "./presets";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  /** Trigger animation when element enters viewport. Default true. */
  whenInView?: boolean;
  /** Viewport trigger margin. */
  viewMargin?: string;
  /** Animate only the first time it enters view. Default true. */
  once?: boolean;
  className?: string;
}

/**
 * Fade-up reveal. Animates children upward 12px with opacity on viewport entry.
 * Respects prefers-reduced-motion by showing content instantly.
 */
export const FadeUp = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, whenInView = true, viewMargin = "-40px", once = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={reduced ? reducedMotionVariants : fadeUpVariants}
        initial="hidden"
        {...(whenInView
          ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
          : { animate: "visible" })}
        transition={transitionEntrance}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);
FadeUp.displayName = "FadeUp";

/**
 * Simple opacity fade.
 */
export const Fade = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, whenInView = true, viewMargin = "-40px", once = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={reduced ? reducedMotionVariants : fadeVariants}
        initial="hidden"
        {...(whenInView
          ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
          : { animate: "visible" })}
        transition={transitionEntrance}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);
Fade.displayName = "Fade";

/**
 * Subtle scale-in from 97%.
 */
export const ScaleIn = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, whenInView = true, viewMargin = "-40px", once = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={reduced ? reducedMotionVariants : scaleInVariants}
        initial="hidden"
        {...(whenInView
          ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
          : { animate: "visible" })}
        transition={transitionNormal}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);
ScaleIn.displayName = "ScaleIn";

interface StaggerProps extends RevealProps {
  /** Delay between children in ms. Default 60. */
  staggerMs?: number;
}

/**
 * Container that staggers the entrance of its children.
 * Each direct child should use a motion variant (e.g. FadeUp content).
 */
export const StaggerGroup = forwardRef<HTMLDivElement, StaggerProps>(
  ({ children, staggerMs = 60, whenInView = true, viewMargin = "-40px", once = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={reduced ? reducedMotionVariants : staggerContainer(staggerMs)}
        initial="hidden"
        {...(whenInView
          ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
          : { animate: "visible" })}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);
StaggerGroup.displayName = "StaggerGroup";

/**
 * Child item for StaggerGroup. Fade-up by default.
 */
export const StaggerItem = forwardRef<HTMLDivElement, Omit<HTMLMotionProps<"div">, "variants">>(
  ({ children, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={reduced ? reducedMotionVariants : fadeUpVariants}
        transition={transitionEntrance}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);
StaggerItem.displayName = "StaggerItem";
