"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import { type ComponentPropsWithoutRef, type ReactNode, type Ref, forwardRef } from "react";
import { useMarketingMobilePerfIsMobile } from "@/lib/ui/marketing-mobile-perf-context";
import { useReducedMotion } from "./use-reduced-motion";
import { pickTransition, pickVariants } from "./reduced-motion";
import { stripMotionDomProps } from "./strip-motion-dom-props";
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

function marketingPlainDivProps(rest: Record<string, unknown>): ComponentPropsWithoutRef<"div"> {
  return stripMotionDomProps(rest) as ComponentPropsWithoutRef<"div">;
}

function marketingPlainOlProps(rest: Record<string, unknown>): ComponentPropsWithoutRef<"ol"> {
  return stripMotionDomProps(rest) as ComponentPropsWithoutRef<"ol">;
}

function marketingPlainLiProps(rest: Record<string, unknown>): ComponentPropsWithoutRef<"li"> {
  return stripMotionDomProps(rest) as ComponentPropsWithoutRef<"li">;
}

/**
 * Fade-up reveal — opacity + light vertical travel (token clamped).
 */
export const FadeUp = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, whenInView = true, viewMargin = "-40px", once = true, ...rest }, ref) => {
    const reduced = useReducedMotion();
    const marketingPlain = useMarketingMobilePerfIsMobile() === true;
    if (marketingPlain) {
      return (
        <div ref={ref} {...marketingPlainDivProps(rest as unknown as Record<string, unknown>)}>
          {children}
        </div>
      );
    }
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
    const marketingPlain = useMarketingMobilePerfIsMobile() === true;
    if (marketingPlain) {
      return (
        <div ref={ref} {...marketingPlainDivProps(rest as unknown as Record<string, unknown>)}>
          {children}
        </div>
      );
    }
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
    const marketingPlain = useMarketingMobilePerfIsMobile() === true;
    if (marketingPlain) {
      return (
        <div ref={ref} {...marketingPlainDivProps(rest as unknown as Record<string, unknown>)}>
          {children}
        </div>
      );
    }
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
    const marketingPlain = useMarketingMobilePerfIsMobile() === true;
    if (marketingPlain) {
      return (
        <div ref={ref} {...marketingPlainDivProps(rest as unknown as Record<string, unknown>)}>
          {children}
        </div>
      );
    }
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
    const marketingPlain = useMarketingMobilePerfIsMobile() === true;
    if (marketingPlain) {
      if (as === "ol") {
        return (
          <ol ref={ref as Ref<HTMLOListElement>} {...marketingPlainOlProps(rest as unknown as Record<string, unknown>)}>
            {children}
          </ol>
        );
      }
      return (
        <div ref={ref as Ref<HTMLDivElement>} {...marketingPlainDivProps(rest as unknown as Record<string, unknown>)}>
          {children}
        </div>
      );
    }
    if (as === "ol") {
      return (
        <motion.ol
          ref={ref as Ref<HTMLOListElement>}
          variants={pickVariants(reduced, staggerContainer(staggerMs))}
          initial="hidden"
          {...(whenInView
            ? { whileInView: "visible", viewport: { once, margin: viewMargin } }
            : { animate: "visible" })}
          {...(rest as Omit<HTMLMotionProps<"ol">, "variants">)}
        >
          {children}
        </motion.ol>
      );
    }
    return (
      <motion.div
        ref={ref as Ref<HTMLDivElement>}
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
  const marketingPlain = useMarketingMobilePerfIsMobile() === true;
  if (marketingPlain) {
    if (as === "li") {
      return (
        <li ref={ref as Ref<HTMLLIElement>} {...marketingPlainLiProps(rest as unknown as Record<string, unknown>)}>
          {children as ReactNode}
        </li>
      );
    }
    return (
      <div ref={ref as Ref<HTMLDivElement>} {...marketingPlainDivProps(rest as unknown as Record<string, unknown>)}>
        {children as ReactNode}
      </div>
    );
  }
  const full = variant === "softReveal" ? softRevealVariants : fadeUpVariants;
  const tr = timing === "hero" ? transitionHeroReveal : transitionNormal;
  if (as === "li") {
    return (
      <motion.li
        ref={ref as Ref<HTMLLIElement>}
        variants={reduced ? reducedMotionVariants : full}
        transition={pickTransition(reduced, tr)}
        {...(rest as Omit<HTMLMotionProps<"li">, "variants">)}
      >
        {children}
      </motion.li>
    );
  }
  return (
    <motion.div
      ref={ref as Ref<HTMLDivElement>}
      variants={reduced ? reducedMotionVariants : full}
      transition={pickTransition(reduced, tr)}
      {...rest}
    >
      {children}
    </motion.div>
  );
});
StaggerItem.displayName = "StaggerItem";
