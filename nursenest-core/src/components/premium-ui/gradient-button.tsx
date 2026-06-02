/**
 * GradientButton — premium CTA-grade button.
 *
 * Resolves its gradient from `--pui-gradient-cta` (which itself is built on
 * `--theme-primary` + `--theme-accent`), so each palette automatically
 * carries its own brand identity through.
 *
 * Wraps the existing shadcn/ui Button so existing accessibility, focus ring,
 * and keyboard semantics are preserved. Intended for hero CTAs and pricing
 * conversion CTAs only — do not use for routine inline actions.
 */

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface GradientButtonProps extends ButtonProps {
  /** Visual size — large is the default for CTA usage. */
  cta?: "lg" | "md";
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  function GradientButton({ cta = "lg", className, style, children, ...rest }, ref) {
    const sizeClasses =
      cta === "lg"
        ? "h-12 rounded-2xl px-7 text-[1rem] font-bold"
        : "h-10 rounded-xl px-5 text-sm font-bold";
    return (
      <Button
        ref={ref}
        {...rest}
        className={[sizeClasses, className].filter(Boolean).join(" ")}
        style={{
          background: "var(--pui-gradient-cta)",
          color: "var(--theme-primary-foreground, #ffffff)",
          boxShadow: "var(--pui-shadow-cta)",
          border: "0",
          ...style,
        }}
      >
        {children}
      </Button>
    );
  },
);
