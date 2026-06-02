/**
 * Barrel for the premium-ui design-system foundation.
 *
 * Import:
 *   import { GlassPanel, GradientButton, PillBadge, SectionShell }
 *     from "@/components/premium-ui";
 *
 * The CSS tokens this folder relies on live in `./tokens.css`. Make sure
 * that file is loaded once at app boot (e.g. imported from `globals.css`)
 * before the redesigned homepage / nav surfaces start consuming these
 * primitives.
 */

export { GlassPanel, type GlassPanelProps } from "./glass-panel";
export { GradientButton, type GradientButtonProps } from "./gradient-button";
export { PillBadge, type PillBadgeProps, type PillTone } from "./pill-badge";
export {
  PlatformBreadcrumbs,
  PlatformButton,
  PlatformFeedback,
  PlatformIconButton,
  PlatformInput,
  PlatformLabel,
  PlatformPanel,
  PlatformSegmentedControl,
  PlatformSelect,
  PlatformTabs,
  PlatformTextarea,
  PlatformText,
  PlatformTopbar,
  type PlatformButtonProps,
  type PlatformFeedbackProps,
  type PlatformIconButtonProps,
  type PlatformInputProps,
  type PlatformPanelProps,
  type PlatformTextProps,
} from "./platform-primitives";
export { SectionShell, type SectionShellProps } from "./section-shell";
