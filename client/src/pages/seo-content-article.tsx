import { useRoute } from "wouter";
import { SeoContentPage } from "@/components/seo-content-template";
import { getArticleBySlug } from "@/data/seo-content-articles";
import type { SeoArticle } from "@/data/seo-content-articles";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

import { useI18n } from "@/lib/i18n";
const SITE_DOMAIN = "https://www.nursenest.ca";

function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div data-testid="seo-article-not-found">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.seoContentArticle.articleNotFound")}</h1>
        <p className="text-gray-600">{t("pages.seoContentArticle.theArticleYoureLookingFor")}</p>
      </div>
      <Footer />
    </div>
  );
}

function getValidatedArticle(slug: string | undefined, cluster: SeoArticle["cluster"]): SeoArticle | null {
  if (!slug) return null;
  const article = getArticleBySlug(slug);
  if (!article || article.cluster !== cluster) return null;
  return article;
}

export function ResumeArticlePage() {
  const [, params] = useRoute("/resumes-cover-letters/:slug");
  const article = getValidatedArticle(params?.slug, "resume");
  if (!article) return <NotFoundPage />;

  return (
    <SeoContentPage
      {...article}
      breadcrumbs={[
        { name: "Home", url: SITE_DOMAIN },
        { name: "Resumes & Cover Letters", url: `${SITE_DOMAIN}/resumes-cover-letters` },
        { name: article.title, url: `${SITE_DOMAIN}${article.canonicalPath}` },
      ]}
    />
  );
}

export function InterviewArticlePage() {
  const [, params] = useRoute("/interview-prep/:slug");
  const article = getValidatedArticle(params?.slug, "interview");
  if (!article) return <NotFoundPage />;

  return (
    <SeoContentPage
      {...article}
      breadcrumbs={[
        { name: "Home", url: SITE_DOMAIN },
        { name: "Interview Prep", url: `${SITE_DOMAIN}/interview-prep` },
        { name: article.title, url: `${SITE_DOMAIN}${article.canonicalPath}` },
      ]}
    />
  );
}

export function CareerArticlePage() {
  const [, params] = useRoute("/resources/:slug");
  const article = getValidatedArticle(params?.slug, "career");
  if (!article) return <NotFoundPage />;

  return (
    <SeoContentPage
      {...article}
      breadcrumbs={[
        { name: "Home", url: SITE_DOMAIN },
        { name: "Resources", url: `${SITE_DOMAIN}/resources` },
        { name: article.title, url: `${SITE_DOMAIN}${article.canonicalPath}` },
      ]}
    />
  );
}

export function PersonalStatementArticlePage() {
  const [, params] = useRoute("/personal-statements/:slug");
  const article = getValidatedArticle(params?.slug, "personal-statements");
  if (!article) return <NotFoundPage />;

  return (
    <SeoContentPage
      {...article}
      breadcrumbs={[
        { name: "Home", url: SITE_DOMAIN },
        { name: "Personal Statements", url: `${SITE_DOMAIN}/personal-statements` },
        { name: article.title, url: `${SITE_DOMAIN}${article.canonicalPath}` },
      ]}
    />
  );
}
