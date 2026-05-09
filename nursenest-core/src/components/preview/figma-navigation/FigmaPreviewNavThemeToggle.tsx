"use client";

import { ThemePicker } from "@/components/theme/theme-picker";

/** Compact theme control embedded in the preview utility cluster (not floating). */
export function FigmaPreviewNavThemeToggle({
  className = "",
  dropdownPortal = true,
}: {
  className?: string;
  /** Use fixed portal so theme menu clears sticky header layers on small viewports. */
  dropdownPortal?: boolean;
}) {
  return (
    <ThemePicker
      className={`shrink-0 ${className}`}
      pickerScope="publicMarketing"
      dropdownPortal={dropdownPortal}
      labels={{ navTheme: "Theme" }}
    />
  );
}
