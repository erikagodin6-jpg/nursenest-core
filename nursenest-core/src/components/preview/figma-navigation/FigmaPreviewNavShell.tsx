"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ScrollCtx = { scrolled: boolean };

const Ctx = createContext<ScrollCtx>({ scrolled: false });

export function useFigmaPreviewNavScroll(): ScrollCtx {
  return useContext(Ctx);
}

export function FigmaPreviewNavShell({
  variant,
  children,
  headerClassName = "",
}: {
  variant: "a" | "b" | "c";
  children: React.ReactNode;
  /** Outer `<header>` classes — variants supply interior layout. */
  headerClassName?: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const value = useMemo(() => ({ scrolled }), [scrolled]);

  return (
    <Ctx.Provider value={value}>
      <header
        data-preview-nav-variant={variant}
        data-preview-scrolled={scrolled ? "true" : "false"}
        className={`sticky top-0 z-[110] w-full ${headerClassName}`}
      >
        {children}
      </header>
    </Ctx.Provider>
  );
}
