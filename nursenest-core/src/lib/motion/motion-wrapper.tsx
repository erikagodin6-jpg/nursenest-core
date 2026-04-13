"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import { type ReactNode, type Ref, forwardRef } from "react";
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
  /** Root element for semantics (e.g. `ol` for ordered steps). Default `div`. */
  as?: "div" | "ol";
}

export const StaggerGroup = forwardRef<HTMLDivElement | HTMLOListElement, StaggerProps>(
  ({ children, staggerMs = 50, whenInView = true, viewMargin = "-40px", once = true, as = "div", ...rest }, ref) => {
    const reduced = useReducedMotion();
    const Tag = as === "ol" ? motion.ol : motion.div;
    return (
      <Tag
        ref={ref as Ref<HTMLDivElement & HTMLOListElement>}
        variants={pickVariants(reduced, staggerContainer(staggerMs))}
        initial="hidden"
        {...(whenInView
          ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
          : { animate: "visible" })}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
StaggerGroup.displayName = "StaggerGroup";

export type StaggerItemVariant = "fadeUp" | "softReveal";

export const StaggerItem = forwardRef<
  HTMLDivElement | HTMLLIElement,
  Omit<HTMLMotionProps<"div">, "variants"> & {
    variant?: StaggerItemVariant;
    /** `hero` tightens item duration to the brand hero tier (~220ms). */
    timing?: "default" | "hero";
    /** Root element for semantics (e.g. `li` inside an `ol`). Default `div`. */
    as?: "div" | "li";
  }
>(({ children, variant = "fadeUp", timing = "default", as = "div", ...rest }, ref) => {
  const reduced = useReducedMotion();
  const full = variant === "softReveal" ? softRevealVariants : fadeUpVariants;
  const tr = timing === "hero" ? transitionHeroReveal : transitionNormal;
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      ref={ref as Ref<HTMLDivElement & HTMLLIElement>}
      variants={reduced ? reducedMotionVariants : full}
      transition={pickTransition(reduced, tr)}
      {...rest}
    >
      {children}
    </Tag>
  );
});
StaggerItem.displayName = "StaggerItem";
