"use client";

import { useEffect, useMemo } from "react";

import { nursenestAppIcons } from "@/lib/branding/app-icons";
import { THEME_STORAGE_KEY } from "@/lib/theme/theme-registry";

const CANONICAL_FAVICON = nursenestAppIcons.favicon;
const FAVICON_SELECTORS = [
  'link[rel="icon"]',
  'link[rel="shortcut icon"]',
  'link[rel="apple-touch-icon"]',
].join(",");

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
  const href = CANONICAL_FAVICON;

  document.head.querySelectorAll<HTMLLinkElement>(FAVICON_SELECTORS).forEach((link) => {
    link.href = href;
    link.type = "image/png";
  });

  upsertIconLink("icon", href, "image/png");
  upsertIconLink("shortcut icon", href, "image/png");
  upsertIconLink("apple-touch-icon", href, "image/png");
}

/** Keeps the browser tab icon locked to the approved NurseNest pink favicon. */
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
