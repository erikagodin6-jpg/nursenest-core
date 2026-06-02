"use client";

import { createPortal } from "react-dom";
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  computeMarketingUtilityFloatingPanelRect,
  MARKETING_UTILITY_PANEL_GAP_PX,
  MARKETING_UTILITY_PANEL_VIEWPORT_MARGIN,
} from "@/components/layout/marketing-utility-floating-panel-geometry";

const Z_INDEX = 520;

type RectState = { top: number; left: number; width: number };

/**
 * Fixed-position portal panel anchored to a trigger — avoids header stacking-context
 * and row-boundary issues where `absolute` dropdowns visually overlap the logo/auth row.
 */
export function MarketingUtilityFloatingPanel({
  open,
  anchorRef,
  panelRef,
  widthPx,
  children,
}: {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  widthPx: number;
  children: ReactNode;
}) {
  const [rect, setRect] = useState<RectState | null>(null);

  const measure = useCallback(() => {
    const el = anchorRef.current;
    if (!el || !open) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    const { top, left, width } = computeMarketingUtilityFloatingPanelRect({
      anchor: { top: r.top, right: r.right, bottom: r.bottom, left: r.left },
      panelWidthPx: widthPx,
      viewportWidthPx: window.innerWidth,
      gapPx: MARKETING_UTILITY_PANEL_GAP_PX,
      viewportMargin: MARKETING_UTILITY_PANEL_VIEWPORT_MARGIN,
    });
    setRect({ top, left, width });
  }, [anchorRef, open, widthPx]);

  useLayoutEffect(() => {
    measure();
  }, [measure, open]);

  useLayoutEffect(() => {
    if (!open) return;
    const onWin = () => measure();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, measure]);

  if (!open || typeof document === "undefined" || !rect) return null;

  return createPortal(
    <div
      ref={panelRef as RefObject<HTMLDivElement>}
      className="pointer-events-auto max-h-[min(70vh,22rem)] overflow-y-auto"
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        zIndex: Z_INDEX,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
