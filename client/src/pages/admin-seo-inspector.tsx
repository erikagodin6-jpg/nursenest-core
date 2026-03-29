import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Search, RefreshCw, CheckCircle2, AlertTriangle, XCircle,
  Globe, Link2, FileSearch, Eye, Shield
} from "lucide-react";

const LOCALES = [
  { code: "en", name: "English" }, { code: "fr", name: "French" },
  { code: "es", name: "Spanish" }, { code: "fil", name: "Filipino" },
  { code: "hi", name: "Hindi" }, { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" }, { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" }, { code: "pa", name: "Punjabi" },
  { code: "vi", name: "Vietnamese" }, { code: "ht", name: "Haitian Creole" },
  { code: "ur", name: "Urdu" }, { code: "ja", name: "Japanese" },
  { code: "fa", name: "Farsi" },
];

const INSPECTABLE_ROUTES = [
  "/", "/lessons", "/flashcards", "/pricing", "/start-free", "/anatomy",
  "/med-math", "/lab-values", "/mock-exams", "/clinical-clarity", "/blog",
  "/pre-nursing", "/question-of-the-day", "/question-bank", "/lectures",
  "/nursing", "/nursing-specialties", "/faq", "/about", "/contact",
  "/terms", "/privacy", "/glossary", "/medication-mastery",
];

type InspectionResult = {
  url: string;
  locale: string;
  canonical: string;
  robotsStatus: string;
  hreflangSet: { locale: string; url: string; isIndexable: boolean }[];
  sitemapInclusion: boolean;
  translation: {
    percentage: number;
    translatedKeys: number;
    totalKeys: number;
    readiness: string;
    untranslatedKeys: string[];
  };
  warnings: string[];
  title: string;
  description: string;
};

export default function AdminSeoInspector() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedPath, setSelectedPath] = useState("/");
  const [selectedLocale, setSelectedLocale] = useState("en");
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.tier !== "admin") {
      navigate("/");
    }
  }, [user]);

  async function inspect() {
    setLoading(true);
    try {
      const token = localStorage.getItem("nursenest-admin-token");
      const params = new URLSearchParams({ path: selectedPath, locale: selectedLocale });
      const res = await fetch(`/api/admin/seo-inspector?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to inspect");
      setResult(await res.json());
    } catch (e) {
      console.error("Inspection failed:", e);
    }
    setLoading(false);
  }

  if (!user || user.tier !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title={t("pages.adminSeoInspector.seoInspector")} description={t("pages.adminSeoInspector.inspectSeoMetaForAny")} noindex />
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6" data-testid="text-page-title">
          <FileSearch className="w-6 h-6 text-primary" />
          SEO &amp; Translation Inspector
        </h1>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-1">{t("pages.adminSeoInspector.route")}</label>
                <select
                  value={selectedPath}
                  onChange={(e) => setSelectedPath(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  data-testid="select-route"
                >
                  {INSPECTABLE_ROUTES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">{t("pages.adminSeoInspector.locale")}</label>
                <select
                  value={selectedLocale}
                  onChange={(e) => setSelectedLocale(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  data-testid="select-locale"
                >
                  {LOCALES.map(l => (
                    <option key={l.code} value={l.code}>{l.name} ({l.code})</option>
                  ))}
                </select>
              </div>
              <Button onClick={inspect} disabled={loading} data-testid="button-inspect">
                {loading ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Search className="w-4 h-4 mr-1" />}
                Inspect
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="grid gap-4">
            {result.warnings.length > 0 && (
              <Card className="border-yellow-300 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-4 h-4" />Warnings ({result.warnings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="text-sm text-yellow-700" data-testid={`text-warning-${i}`}>• {w}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Link2 className="w-4 h-4" />SEO Meta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block">{t("pages.adminSeoInspector.url")}</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded" data-testid="text-url">{result.url}</code>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{t("pages.adminSeoInspector.title")}</span>
                    <span data-testid="text-title">{result.title || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{t("pages.adminSeoInspector.description")}</span>
                    <span className="text-xs" data-testid="text-description">{result.description?.slice(0, 120) || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{t("pages.adminSeoInspector.canonical")}</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all" data-testid="text-canonical">{result.canonical || "—"}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t("pages.adminSeoInspector.robots")}</span>
                    <Badge variant={result.robotsStatus.includes("noindex") ? "destructive" : "default"} data-testid="badge-robots">
                      {result.robotsStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t("pages.adminSeoInspector.inSitemap")}</span>
                    {result.sitemapInclusion
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <XCircle className="w-4 h-4 text-red-400" />}
                    <span data-testid="text-sitemap">{result.sitemapInclusion ? "Yes" : "No"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4" />Translation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t("pages.adminSeoInspector.coverage")}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${result.translation.percentage >= 95 ? "bg-green-500" : result.translation.percentage >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(result.translation.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs" data-testid="text-coverage">{result.translation.percentage}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("pages.adminSeoInspector.keys")}</span>{" "}
                    <span data-testid="text-keys">{result.translation.translatedKeys} / {result.translation.totalKeys}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t("pages.adminSeoInspector.readiness")}</span>
                    <Badge variant="outline" data-testid="badge-readiness">{result.translation.readiness}</Badge>
                  </div>
                  {result.translation.untranslatedKeys.length > 0 && (
                    <div>
                      <span className="text-gray-500 block mb-1">{t("pages.adminSeoInspector.missingKeysFirst20")}</span>
                      <div className="max-h-32 overflow-y-auto bg-gray-50 rounded p-2" data-testid="text-missing-keys">
                        {result.translation.untranslatedKeys.map((k, i) => (
                          <div key={i} className="font-mono text-xs text-red-600">{k}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />Hreflang Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1 px-2">{t("pages.adminSeoInspector.locale2")}</th>
                        <th className="text-left py-1 px-2">URL</th>
                        <th className="text-center py-1 px-2">{t("pages.adminSeoInspector.indexable")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.hreflangSet.map((h, i) => (
                        <tr key={i} className="border-b" data-testid={`row-hreflang-${h.locale}`}>
                          <td className="py-1 px-2 font-mono text-xs">{h.locale}</td>
                          <td className="py-1 px-2 text-xs break-all">{h.url}</td>
                          <td className="py-1 px-2 text-center">
                            {h.isIndexable
                              ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                              : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
