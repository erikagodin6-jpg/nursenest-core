import { useEffect } from "react";

const CANONICAL_BASE = "https://www.nursenest.ca";

export function useAlliedCanonical(path: string, queryParams?: Record<string, string>) {
  useEffect(() => {
    const alliedPath = path.startsWith("/allied-health") ? path : `/allied-health${path}`;
    let canonical = `${CANONICAL_BASE}${alliedPath}`;
    if (queryParams) {
      const search = new URLSearchParams(queryParams).toString();
      if (search) canonical += `?${search}`;
    }

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    return () => {
      if (link && link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [path, JSON.stringify(queryParams)]);
}
