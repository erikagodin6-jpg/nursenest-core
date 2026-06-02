import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { SeoHubPageTemplate } from "@/components/seo-hub-templates";
import { getLocaleFromPath } from "@/lib/locale-utils";
import type { SeoHubPage as SeoHubPageType } from "@shared/schema";

import { useI18n } from "@/lib/i18n";
type SeoHubPageData = Omit<SeoHubPageType, "publishedAt" | "createdAt" | "updatedAt" | "medicallyReviewedAt"> & {
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  medicallyReviewedAt: string | null;
  relatedPages?: { title: string; href: string; type?: string; description?: string }[];
  siblingPages?: { title: string; href: string; type?: string }[];
  previewQuestions?: any[];
};

export default function SeoHubPage() {
  const { t } = useI18n();
  const params = useParams<Record<string, string>>();
  const [location] = useLocation();
  const [page, setPage] = useState<SeoHubPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { pathWithoutLocale } = getLocaleFromPath(location);
  const pathParts = pathWithoutLocale.split("/").filter(Boolean);

  const wildcard = params["*"] || params.rest || "";
  const tier = pathParts[0] || "";
  const rest = wildcard || pathParts.slice(1).join("/") || "";

  useEffect(() => {
    if (!tier || !rest) {
      setLoading(false);
      setError("Page not found");
      return;
    }
    setLoading(true);

    const slug = `${tier}/${rest}`;
    fetch(`/api/seo-hub/page/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setPage(null);
        } else {
          setPage(data);
          setError("");
        }
      })
      .catch(() => setError("Failed to load page"))
      .finally(() => setLoading(false));
  }, [tier, rest]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="loading-seo-hub">
          <div className="animate-pulse text-gray-400">{t("pages.seoHubPage.loading")}</div>
        </div>
      </>
    );
  }

  if (error || !page) {
    return (
      <>
        <Navigation />
        <SEO title={t("pages.seoHubPage.pageNotFound2")} description={t("pages.seoHubPage.theRequestedPageCouldNot")} noindex={true} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto bg-white rounded-xl p-8 text-center shadow-sm border">
            <h1 className="text-xl font-bold mb-2" data-testid="heading-error">{t("pages.seoHubPage.pageNotFound")}</h1>
            <p className="text-gray-600 mb-4" data-testid="text-error">
              {error || "This page could not be found."}
            </p>
            <a href="/" className="text-primary hover:underline" data-testid="link-go-home">{t("pages.seoHubPage.goHome")}</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <SeoHubPageTemplate
      page={page}
      previewQuestions={page.previewQuestions}
      relatedPages={page.relatedPages}
      siblingPages={page.siblingPages}
    />
  );
}
