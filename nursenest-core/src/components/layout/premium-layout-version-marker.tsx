export const PREMIUM_LAYOUT_VERSION = "2026-05-live-redesign-v2";

export function PremiumLayoutVersionMarker({ surface }: { surface: string }) {
  return (
    <span
      data-premium-layout-version={PREMIUM_LAYOUT_VERSION}
      data-premium-layout-surface={surface}
      data-live-layout-refresh="2026-05-18"
      hidden
    />
  );
}
