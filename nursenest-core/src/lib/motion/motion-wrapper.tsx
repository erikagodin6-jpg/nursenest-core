"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import { type ReactNode, forwardRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";
import { pickTransition, pickVariants } from "./reduced-motion";
import {
  fadeInVariants,
  fadeUpVariants,
  scaleInVariants,
  softRevealVariants,
  staggerContainer,
  transitionHeroReveal,
  transitionNormal,
  reducedMotionVariants,
} from "./presets";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  whenInView?: boolean;
  viewMargin?: string;
  once?: boolean;
  className?: string;
}

/**
 * Fade-up reveal — opacity + light vertical travel (token clamped).
 */
export const FadeUp = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, whenInView = true, viewMargin = "-40px", once = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={pickVariants(reduced, fadeUpVariants)}
        initial="hidden"
        {...(whenInView
          ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
          : { animate: "visible" })}
        transition={pickTransition(reduced, transitionNormal)}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);
FadeUp.displayName = "FadeUp";

/**
 * Softer vertical travel than FadeUp — supporting lines, secondary hierarchy.
 */
export const SoftReveal = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, whenInView = true, viewMargin = "-32px", once = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={pickVariants(reduced, softRevealVariants)}
        initial="hidden"
        {...(whenInView
          ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
          : { animate: "visible" })}
        transition={pickTransition(reduced, transitionNormal)}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);
SoftReveal.displayName = "SoftReveal";

export const Fade = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, whenInView = true, viewMargin = "-40px", once = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={pickVariants(reduced, fadeInVariants)}
        initial="hidden"
        {...(whenInView
          ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
          : { animate: "visible" })}
        transition={pickTransition(reduced, transitionNormal)}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);
Fade.displayName = "Fade";

export interface ScaleInProps extends RevealProps {
  /** `hero` uses {@link transitionHeroReveal} for homepage media framing. */
  timing?: "default" | "hero";
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, whenInView = true, viewMargin = "-40px", once = true, timing = "default", ...rest }, ref) => {
    const reduced = useReducedMotion();
    const t = timing === "hero" ? transitionHeroReveal : transitionNormal;
    return (
      <motion.div
        ref={ref}
        variants={pickVariants(reduced, scaleInVariants)}
        initial="hidden"
        {...(whenInView
          ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
          : { animate: "visible" })}
        transition={pickTransition(reduced, t)}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);
ScaleIn.displayName = "ScaleIn";

interface StaggerProps extends RevealProps {
  staggerMs?: number;
}

export const StaggerGroup = forwardRef<HTMLDivElement, StaggerProps>(
  ({ children, staggerMs = 50, whenInView = true, viewMargin = "-40px", once = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={pickVariants(reduced, staggerContainer(staggerMs))}
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

export type StaggerItemVariant = "fadeUp" | "softReveal";

export const StaggerItem = forwardRef<
  HTMLDivElement,
  Omit<HTMLMotionProps<"div">, "variants"> & {
    variant?: StaggerItemVariant;
    /** `hero` tightens item duration to the brand hero tier (~220ms). */
    timing?: "default" | "hero";
  }
>(({ children, variant = "fadeUp", timing = "default", ...rest }, ref) => {
  const reduced = useReducedMotion();
  const full = variant === "softReveal" ? softRevealVariants : fadeUpVariants;
  const tr = timing === "hero" ? transitionHeroReveal : transitionNormal;
  return (
    <motion.div
      ref={ref}
      variants={reduced ? reducedMotionVariants : full}
      transition={pickTransition(reduced, tr)}
      {...rest}
    >
      {children}
    </motion.div>
  );
});
StaggerItem.displayName = "StaggerItem";
