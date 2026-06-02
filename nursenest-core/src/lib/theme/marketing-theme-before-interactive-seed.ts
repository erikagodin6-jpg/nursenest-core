import {
  NURSENEST_DEFAULT_THEME,
  PUBLIC_MARKETING_THEME_ALLOWLIST,
  THEME_ID_ALIASES,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";

/** Inline script for `next/script` `strategy="beforeInteractive"` — first paint matches persisted theme. */
export function marketingThemeBeforeInteractiveInlineScript(): string {
  const allowJson = JSON.stringify([...PUBLIC_MARKETING_THEME_ALLOWLIST]);
  const aliasesJson = JSON.stringify(THEME_ID_ALIASES);
  const storageKeyJson = JSON.stringify(THEME_STORAGE_KEY);
  const defaultJson = JSON.stringify(NURSENEST_DEFAULT_THEME);
  return `(function(){
  try {
    var allow = ${allowJson};
    var aliases = ${aliasesJson};
    var allowed = {};
    for (var i = 0; i < allow.length; i++) allowed[allow[i]] = true;
    var raw = (function(){ try { return localStorage.getItem(${storageKeyJson}) || ""; } catch (e) { return ""; } })();
    var id = (raw || "").trim().toLowerCase();
    id = aliases[id] || id;
    if (!allowed[id]) id = ${defaultJson};
    try { if (raw && raw !== id) localStorage.setItem(${storageKeyJson}, id); } catch (e) {}
    document.documentElement.setAttribute("data-theme", id);
  } catch (e) {}
})();`;
}
