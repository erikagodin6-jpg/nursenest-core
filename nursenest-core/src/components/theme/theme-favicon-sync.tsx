"use client";

import { useEffect, useMemo } from "react";

import { nursenestAppIcons } from "@/lib/branding/app-icons";
import { resolveThemeLogo } from "@/lib/branding/resolve-theme-logo";
import { parseRegisteredThemeId } from "@/lib/theme/theme-logo-resolve";
import { NURSENEST_DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme/theme-registry";

const FALLBACK_FAVICON = nursenestAppIcons.svg;
const FAVICON_SELECTORS = [
  'link[rel="icon"]',
  'link[rel="shortcut icon"]',
  'link[rel="apple-touch-icon"]',
].join(",");

function readActiveTheme(): string {
  if (typeof document === "undefined") return NURSENEST_DEFAULT_THEME;
  const attr = document.documentElement.getAttribute("data-theme")?.trim();
  if (attr) return attr;
  try {
    return localStorage.getItem(THEME_STORAGE_KEY)?.trim() || NURSENEST_DEFAULT_THEME;
  } catch {
    return NURSENEST_DEFAULT_THEME;
  }
}

function faviconUrlForTheme(themeId: string): string {
  const registeredThemeId = parseRegisteredThemeId(themeId) ?? NURSENEST_DEFAULT_THEME;
  return resolveThemeLogo(registeredThemeId, "leaf").url ?? FALLBACK_FAVICON;
}

function upsertIconLink(rel: string, href: string, type?: string) {
  const escapedRel = rel.replace(/"/g, "");
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${escapedRel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.rel = escapedRel;
    document.head.appendChild(link);
  }
  link.href = href;
  if (type) link.type = type;
}

function syncFavicon() {
  const href = faviconUrlForTheme(readActiveTheme());

  document.head.querySelectorAll<HTMLLinkElement>(FAVICON_SELECTORS).forEach((link) => {
    const rel = link.rel.toLowerCase();
    if (rel.includes("apple-touch-icon")) return;
    link.href = href;
    link.type = href.endsWith(".svg") ? "image/svg+xml" : "image/png";
  });

  upsertIconLink("icon", href, href.endsWith(".svg") ? "image/svg+xml" : "image/png");
  upsertIconLink("shortcut icon", href, href.endsWith(".svg") ? "image/svg+xml" : "image/png");
}

/** Keeps the browser tab icon aligned with the active NurseNest theme leaf. */
export function ThemeFaviconSync() {
  const storageKey = useMemo(() => THEME_STORAGE_KEY, []);

  useEffect(() => {
    syncFavicon();

    const root = document.documentElement;
    const observer = new MutationObserver(syncFavicon);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey) syncFavicon();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", onStorage);
    };
  }, [storageKey]);

  return null;
}
