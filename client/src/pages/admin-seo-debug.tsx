import { useState, useEffect, useMemo } from "react";
import { SEO } from "@/components/seo";

import { useI18n } from "@/lib/i18n";
interface HreflangEntry {
  lang: string;
  href: string;
}

interface SeoDebugRoute {
  url: string;
  path: string;
  locale: string;
  canonical: string;
  robotsMeta: string;
  hreflangs: HreflangEntry[];
  inSitemap: boolean;
  title: string;
}

interface SeoDebugData {
  routes: SeoDebugRoute[];
  locales: string[];
  totalRoutes: number;
}

export default function AdminSeoDebug() {
  const { t } = useI18n();
  const [data, setData] = useState<SeoDebugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [localeFilter, setLocaleFilter] = useState("all");
  const [robotsFilter, setRobotsFilter] = useState("all");

  useEffect(() => {
    fetch("/api/seo-debug")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.routes.filter(r => {
      if (filter && !r.path.toLowerCase().includes(filter.toLowerCase()) && !r.url.toLowerCase().includes(filter.toLowerCase())) return false;
      if (localeFilter !== "all" && r.locale !== localeFilter) return false;
      if (robotsFilter === "index" && r.robotsMeta.includes("noindex")) return false;
      if (robotsFilter === "noindex" && !r.robotsMeta.includes("noindex")) return false;
      return true;
    });
  }, [data, filter, localeFilter, robotsFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8" data-testid="seo-debug-loading">
        <div className="text-center text-gray-500">{t("pages.adminSeoDebug.loadingSeoDebugData")}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8" data-testid="seo-debug-error">
        <div className="text-center text-red-500">{t("pages.adminSeoDebug.failedToLoadSeoDebug")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-testid="seo-debug-page">
      <SEO title={t("pages.adminSeoDebug.seoDebugPanel2")} description={t("pages.adminSeoDebug.adminSeoDebugPanel")} canonicalPath="/admin/seo-debug" noindex />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-2" data-testid="text-page-title">{t("pages.adminSeoDebug.seoDebugPanel")}</h1>
        <p className="text-gray-600 mb-6" data-testid="text-route-count">
          {filtered.length} of {data.totalRoutes} routes shown
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder={t("pages.adminSeoDebug.filterByUrlPattern")}
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg w-64 text-sm"
            data-testid="input-url-filter"
          />
          <select
            value={localeFilter}
            onChange={e => setLocaleFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            data-testid="select-locale-filter"
          >
            <option value="all">{t("pages.adminSeoDebug.allLocales")}</option>
            {data.locales.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <select
            value={robotsFilter}
            onChange={e => setRobotsFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            data-testid="select-robots-filter"
          >
            <option value="all">{t("pages.adminSeoDebug.allRobots")}</option>
            <option value="index">{t("pages.adminSeoDebug.indexableOnly")}</option>
            <option value="noindex">{t("pages.adminSeoDebug.noindexOnly")}</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm" data-testid="table-seo-debug">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left p-3 font-semibold">URL</th>
                <th className="text-left p-3 font-semibold">{t("pages.adminSeoDebug.locale")}</th>
                <th className="text-left p-3 font-semibold">{t("pages.adminSeoDebug.canonical")}</th>
                <th className="text-left p-3 font-semibold">{t("pages.adminSeoDebug.robots")}</th>
                <th className="text-left p-3 font-semibold">{t("pages.adminSeoDebug.hreflangs")}</th>
                <th className="text-left p-3 font-semibold">{t("pages.adminSeoDebug.sitemap")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((route, i) => {
                const canonicalMatch = route.url === route.canonical;
                const selfHreflang = route.hreflangs.some(h => h.href === route.url);
                return (
                  <tr key={i} className="border-b hover:bg-gray-50" data-testid={`row-route-${i}`}>
                    <td className="p-3 font-mono text-xs max-w-xs truncate" title={route.url} data-testid={`text-url-${i}`}>
                      {route.path}
                    </td>
                    <td className="p-3" data-testid={`text-locale-${i}`}>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{route.locale}</span>
                    </td>
                    <td className="p-3 font-mono text-xs max-w-xs truncate" title={route.canonical} data-testid={`text-canonical-${i}`}>
                      <span className={canonicalMatch ? "text-green-700" : "text-orange-600"}>
                        {route.canonical}
                      </span>
                    </td>
                    <td className="p-3" data-testid={`text-robots-${i}`}>
                      <span className={`px-2 py-0.5 rounded text-xs ${route.robotsMeta.includes("noindex") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                        {route.robotsMeta}
                      </span>
                    </td>
                    <td className="p-3" data-testid={`text-hreflang-${i}`}>
                      <span className={`text-xs ${selfHreflang ? "text-green-700" : "text-orange-600"}`}>
                        {route.hreflangs.length} tags {selfHreflang ? "(self-ref)" : "(no self)"}
                      </span>
                    </td>
                    <td className="p-3" data-testid={`text-sitemap-${i}`}>
                      <span className={`px-2 py-0.5 rounded text-xs ${route.inSitemap ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                        {route.inSitemap ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
