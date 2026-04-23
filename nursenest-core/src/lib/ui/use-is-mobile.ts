"use client";

import * as React from "react";

/**
 * Client-only viewport gate (max-width 768px). Initial render is `false` to match SSR;
 * updates after mount via `matchMedia`.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}
