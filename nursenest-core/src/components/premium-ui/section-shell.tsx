/**
 * SectionShell — outer responsive container with consistent breathing room.
 *
 * Replaces the ad-hoc `mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8` pattern
 * scattered across marketing surfaces. Drives spacing from `--pui-section-py-*`
 * and `--pui-container-max` so cadence stays consistent and adjustable.
 *
 * Use this for new homepage and study-hub sections going forward. Existing
 * sections can be migrated incrementally.
 */

import * as React from "react";

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  /** Tighten or loosen vertical padding. Default `comfortable`. */
  spacing?: "compact" | "comfortable" | "spacious";
  /** Constrain inner content width. Default `xl` (1280). */
  width?: "md" | "lg" | "xl" | "full";
  /** HTML tag to render. Default `section`. */
  as?: "section" | "div" | "header" | "footer" | "main";
}

const PADDING: Record<NonNullable<SectionShellProps["spacing"]>, string> = {
  compact: "py-8 md:py-10",
  comfortable: "py-12 md:py-20",
  spacious: "py-16 md:py-28",
};

const WIDTH: Record<NonNullable<SectionShellProps["width"]>, string> = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export function SectionShell({
  spacing = "comfortable",
  width = "xl",
  as: Tag = "section",
  className,
  children,
  ...rest
}: SectionShellProps) {
  const Component = Tag as "section";
  return (
    <Component
      {...rest}
      className={[PADDING[spacing], "px-4 sm:px-6 lg:px-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={["mx-auto w-full", WIDTH[width]].join(" ")}>{children}</div>
    </Component>
  );
}
