"use client";

import { useEffect } from "react";

/** Same dotted-key surface as marketing — admin should never show these in primary UI. */
const RENDERED_I18N_KEY_PREFIX_PATTERN =
  /\b(?:pages|footer|blog|admin|content|learner|app|nav|components|marketing|errors|forms)\.[A-Za-z0-9_.-]+/;

/**
 * Development-only: warn when document body text appears to contain a raw i18n key.
 * Does not run in production to avoid console noise and work on public pages.
 */
export function AdminRenderedI18nKeyDevGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return undefined;
    let lastLogged = "";

    function checkRenderedText() {
      try {
        const renderedText = document.body?.innerText ?? "";
        const match = renderedText.match(RENDERED_I18N_KEY_PREFIX_PATTERN)?.[0] ?? "";
        if (match && match !== lastLogged) {
          lastLogged = match;
          console.warn("[AdminUI] Rendered text matches a dotted message key pattern", { match });
        }
      } catch {
        // never break admin rendering
      }
    }

    checkRenderedText();
    if (!document.body) return undefined;
    const observer = new MutationObserver(checkRenderedText);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
