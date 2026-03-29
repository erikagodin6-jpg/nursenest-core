import { useEffect } from "react";

const ALLIED_DOMAIN = "https://www.nursenest.ca";

interface AlliedSEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
  structuredData?: Record<string, any>;
  additionalStructuredData?: Record<string, any>[];
}

export function AlliedSEO({ title, description, keywords, canonicalPath, ogType = "website", structuredData, additionalStructuredData }: AlliedSEOProps) {
  useEffect(() => {
    const fullTitle = title.includes("NurseNest") ? title : `${title} | NurseNest Allied`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:image", "https://www.nursenest.ca/opengraph.jpg", true);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:image", "https://www.nursenest.ca/opengraph.jpg");

    if (canonicalPath) {
      const alliedCanonicalPath = canonicalPath.startsWith("/allied-health") ? canonicalPath : `/allied-health${canonicalPath}`;
      const canonicalUrl = `${ALLIED_DOMAIN}${alliedCanonicalPath}`;
      setMeta("og:url", canonicalUrl, true);
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }

    document.querySelectorAll('script[id^="allied-structured-data"]').forEach((el) => el.remove());
    if (canonicalPath?.startsWith("/allied-health") || window.location.pathname.startsWith("/allied-health")) {
      document.querySelectorAll('script[type="application/ld+json"]:not([id])').forEach((el) => {
        try {
          const data = JSON.parse(el.textContent || "");
          if (data?.["@type"] === "LearningResource" && data?.url?.includes("/allied-health")) {
            el.remove();
          }
        } catch {}
      });
    }

    const scriptIds: string[] = [];

    if (structuredData) {
      const script = document.createElement("script");
      script.id = "allied-structured-data";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
      scriptIds.push("allied-structured-data");
    }

    if (additionalStructuredData) {
      additionalStructuredData.forEach((data, i) => {
        const id = `allied-structured-data-${i}`;
        const script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
        scriptIds.push(id);
      });
    }

    return () => {
      scriptIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.remove();
    };
  }, [title, description, keywords, canonicalPath, ogType, structuredData, additionalStructuredData]);

  return null;
}
