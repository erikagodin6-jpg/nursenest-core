"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
        },
      ) => string;
      remove?: (widgetId: string) => void;
    };
  }
}

/**
 * Renders only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set at build time.
 * Pair with `TURNSTILE_SECRET_KEY` on the server to enforce verification on `/api/signup`.
 */
export function TurnstileSignup({ onToken }: { onToken: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;

    const mount = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (t) => onToken(t),
        "error-callback": () => onToken(null),
      });
    };

    if (window.turnstile) {
      mount();
    } else {
      const existing = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
      if (existing) {
        existing.addEventListener("load", mount, { once: true });
      } else {
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        s.async = true;
        s.defer = true;
        s.onload = mount;
        document.body.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      if (id && window.turnstile?.remove) {
        try {
          window.turnstile.remove(id);
        } catch {
          /* ignore */
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, onToken]);

  if (!siteKey) return null;

  return <div ref={containerRef} className="flex min-h-[65px] items-center justify-center" />;
}
