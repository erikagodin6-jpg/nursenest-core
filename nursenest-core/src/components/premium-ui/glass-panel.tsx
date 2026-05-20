/**
 * GlassPanel — frosted premium surface.
 *
 * Used by:
 *   - Floating navigation chrome (planned, Phase 3)
 *   - Hero side panels (planned, Phase 4)
 *   - Premium modal dialogs
 *
 * Token-driven: pulls --pui-glass-bg / --pui-glass-border / --pui-glass-blur
 * from `premium-ui/tokens.css`, which themselves resolve from the active
 * `[data-theme]` palette. Works in light and dark themes (Midnight, Apex).
 */

import * as React from "react";

type Elevation = 1 | 2 | 3 | 4;

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual elevation (1 = subtle card, 4 = floating modal). Default 2. */
  elevation?: Elevation;
  /** Use rounded-xl (default) or rounded-pill. */
  shape?: "card" | "pill";
  /** Render as a different element if needed (default: div). */
  as?: "div" | "section" | "header" | "aside";
}

const SHADOW_VAR: Record<Elevation, string> = {
  1: "var(--pui-shadow-1)",
  2: "var(--pui-shadow-2)",
  3: "var(--pui-shadow-3)",
  4: "var(--pui-shadow-4)",
};

export function GlassPanel({
  elevation = 2,
  shape = "card",
  as: Tag = "div",
  className,
  style,
  children,
  ...rest
}: GlassPanelProps) {
  const Component = Tag as "div";
  return (
    <Component
      {...rest}
      className={["pui-glass-panel", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--pui-glass-bg)",
        border: "1px solid var(--pui-glass-border)",
        backdropFilter: "blur(var(--pui-glass-blur))",
        WebkitBackdropFilter: "blur(var(--pui-glass-blur))",
        borderRadius:
          shape === "pill" ? "var(--pui-radius-pill)" : "var(--pui-radius-xl)",
        boxShadow: SHADOW_VAR[elevation],
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
