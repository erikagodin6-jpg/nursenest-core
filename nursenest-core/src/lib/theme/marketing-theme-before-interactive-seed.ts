import { NURSENEST_DEFAULT_THEME, PUBLIC_MARKETING_THEME_ALLOWLIST, THEME_STORAGE_KEY } from "@/lib/theme/theme-registry";

/** Inline script for `next/script` `strategy="beforeInteractive"` — first paint matches persisted theme. */
export function marketingThemeBeforeInteractiveInlineScript(): string {
  const allowJson = JSON.stringify([...PUBLIC_MARKETING_THEME_ALLOWLIST]);
  const storageKeyJson = JSON.stringify(THEME_STORAGE_KEY);
  const defaultJson = JSON.stringify(NURSENEST_DEFAULT_THEME);
  return `(function(){
  try {
    var allow = ${allowJson};
    var allowed = {};
    for (var i = 0; i < allow.length; i++) allowed[allow[i]] = true;
    var raw = (function(){ try { return localStorage.getItem(${storageKeyJson}) || ""; } catch (e) { return ""; } })();
    var id = (raw || "").trim();
    if (!allowed[id]) id = ${defaultJson};
    document.documentElement.setAttribute("data-theme", id);
  } catch (e) {}
})();`;
}
