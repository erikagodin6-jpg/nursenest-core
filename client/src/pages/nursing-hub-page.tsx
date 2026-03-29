import { Link, useRoute } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import { fetchWithOptionalRetry } from "@/lib/fetch-utils";
import {
  ArrowRight, ChevronRight, HelpCircle, ExternalLink,
  BookOpen, Award, Route as RouteIcon, Clock, FileText,
  ArrowLeft, Bookmark
} from "lucide-react";

interface HubPageData {
  id: string;
  pageType: string;
  exam: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  contentHtml: string;
  tocJson: { id: string; label: string; level: number }[];
  faqJson: { question: string; answer: string }[];
  internalLinksJson: { url: string; anchor: string; context: string }[];
  relatedPages?: { slug: string; pageType: string; title: string; description: string }[];
}

const TYPE_CONFIG: Record<string, { label: string; pluralLabel: string; parentPath: string; parentLabel: string; accent: string; accentBg: string; accentBorder: string; icon: typeof Award }> = {
  certification: { label: "Certification", pluralLabel: "Certifications", parentPath: "/nursing-certifications", parentLabel: "Nursing Certifications", accent: "text-emerald-700", accentBg: "bg-emerald-50", accentBorder: "border-emerald-100", icon: Award },
  specialty: { label: "Specialty", pluralLabel: "Specialties", parentPath: "/nursing-specialties", parentLabel: "Nursing Specialties", accent: "text-blue-700", accentBg: "bg-blue-50", accentBorder: "border-blue-100", icon: BookOpen },
  "study-pathway": { label: "Study Pathway", pluralLabel: "Study Pathways", parentPath: "/study-pathways", parentLabel: "Study Pathways", accent: "text-violet-700", accentBg: "bg-violet-50", accentBorder: "border-violet-100", icon: RouteIcon },
};

const TYPE_TO_URL_PREFIX: Record<string, string> = {
  certification: "certifications",
  specialty: "specialties",
  "study-pathway": "study-pathways",
};

type HubLoadResult =
  | { status: "ok"; page: HubPageData }
  | { status: "not_found" }
  | { status: "unavailable" }
  | { status: "network" };

function normalizeHubPage(raw: unknown, slug: string, pageType: string): HubPageData | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  const title = typeof p.title === "string" ? p.title.trim() : "";
  const pageSlug = typeof p.slug === "string" ? p.slug : slug;
  if (!title) return null;

  const tocJson = Array.isArray(p.tocJson)
    ? p.tocJson
        .map((row: unknown) => {
          const r = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
          const id = typeof r.id === "string" ? r.id : "";
          const label = typeof r.label === "string" ? r.label : id;
          const level = typeof r.level === "number" ? r.level : 1;
          return { id, label, level };
        })
        .filter((x) => x.id || x.label)
    : [];

  const faqJson = Array.isArray(p.faqJson)
    ? p.faqJson
        .map((row: unknown) => {
          const r = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
          const question = typeof r.question === "string" ? r.question : "";
          const answer = typeof r.answer === "string" ? r.answer : "";
          return { question, answer };
        })
        .filter((x) => x.question || x.answer)
    : [];

  const internalLinksJson = Array.isArray(p.internalLinksJson)
    ? p.internalLinksJson
        .map((row: unknown) => {
          const r = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
          const url = typeof r.url === "string" ? r.url : "#";
          const anchor = typeof r.anchor === "string" ? r.anchor : "";
          const context = typeof r.context === "string" ? r.context : "content";
          return { url, anchor, context };
        })
        .filter((x) => x.url !== "#" || x.anchor)
    : [];

  const relatedPages = Array.isArray(p.relatedPages)
    ? p.relatedPages
        .map((row: unknown) => {
          const r = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
          const s = typeof r.slug === "string" ? r.slug : "";
          const pt = typeof r.pageType === "string" ? r.pageType : pageType;
          const tl = typeof r.title === "string" ? r.title : "";
          const description = typeof r.description === "string" ? r.description : "";
          return { slug: s, pageType: pt, title: tl, description };
        })
        .filter((x) => x.slug && x.title)
    : undefined;

  return {
    id: typeof p.id === "string" ? p.id : pageSlug,
    pageType: typeof p.pageType === "string" ? p.pageType : pageType,
    exam: typeof p.exam === "string" ? p.exam : "",
    title,
    slug: pageSlug,
    metaTitle: typeof p.metaTitle === "string" ? p.metaTitle : title,
    metaDescription: typeof p.metaDescription === "string" ? p.metaDescription : "",
    contentHtml: typeof p.contentHtml === "string" ? p.contentHtml : "",
    tocJson,
    faqJson,
    internalLinksJson,
    relatedPages,
  };
}

async function loadHubPage(slug: string, pageType: string): Promise<HubLoadResult> {
  const qs = new URLSearchParams({ pageType });
  let res: Response;
  try {
    res = await fetchWithOptionalRetry(`/api/nursing-hub/pages/${encodeURIComponent(slug)}?${qs.toString()}`);
  } catch {
    return { status: "network" };
  }
  if (res.status === 404) return { status: "not_found" };
  if (!res.ok) return { status: "unavailable" };
  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    return { status: "unavailable" };
  }
  const page = normalizeHubPage(raw, slug, pageType);
  if (!page) return { status: "not_found" };
  return { status: "ok", page };
}

export default function NursingHubPage({ pageType }: { pageType: string }) {
  const { t } = useI18n();
  const urlPrefix = TYPE_TO_URL_PREFIX[pageType] || pageType;
  const [, params] = useRoute(`/${urlPrefix}/:slug`);
  const slug = params?.slug || "";

  const config = TYPE_CONFIG[pageType] || TYPE_CONFIG.certification;

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["nursing-hub-page", slug, pageType],
    queryFn: () => loadHubPage(slug, pageType),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div data-testid="page-nursing-hub-loading">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">{t("pages.nursingHubPage.loading")}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (data.status === "not_found") {
    return (
      <div data-testid="page-nursing-hub-error">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900">{t("pages.nursingHubPage.pageNotFound")}</h1>
            <p className="text-gray-600">The {config.label.toLowerCase()} page you're looking for doesn't exist or has been moved.</p>
            <Link href={config.parentPath} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4" /> Back to {config.parentLabel}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (data.status !== "ok") {
    const isNet = data.status === "network";
    return (
      <div data-testid="page-nursing-hub-unavailable">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold text-gray-900">
              {isNet ? "Connection problem" : "This page couldn’t be loaded"}
            </h1>
            <p className="text-gray-600 text-sm">
              {isNet
                ? "Check your network connection, then try again."
                : "The server was busy or returned an error. Please try again shortly."}
            </p>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Retrying…" : "Try again"}
            </button>
            <div>
              <Link href={config.parentPath} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-4 h-4" /> Back to {config.parentLabel}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const page = data.page;

  const faqItems = Array.isArray(page.faqJson) ? page.faqJson : [];
  const tocItems = Array.isArray(page.tocJson) ? page.tocJson : [];
  const internalLinks = (Array.isArray(page.internalLinksJson) ? page.internalLinksJson : []).filter(
    (l) => l && typeof l.url === "string" && typeof l.anchor === "string",
  );
  const relatedPages = Array.isArray(page.relatedPages) ? page.relatedPages : [];
  const contentHtml = page.contentHtml || "";

  const faqStructuredData = faqItems.length > 0 ? buildFaqStructuredData(faqItems) : null;

  const breadcrumbItems = [
    { name: "Home", url: "https://www.nursenest.ca" },
    { name: config.parentLabel, url: `https://www.nursenest.ca${config.parentPath}` },
    { name: page.title?.split(":")[0]?.trim() || page.title || "", url: `https://www.nursenest.ca/${urlPrefix}/${page.slug}` },
  ];

  const productLinks = internalLinks.filter(l => l.context === "product");
  const relatedContentLinks = internalLinks.filter(l => l.context !== "product");

  return (
    <div data-testid={`page-nursing-hub-${pageType}-${slug}`}>
      <Navigation />
      <SEO
        title={page.metaTitle || page.title}
        description={page.metaDescription}
        canonicalPath={`/${urlPrefix}/${page.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "name": page.title,
          "description": page.metaDescription,
          "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
          "mainEntityOfPage": `https://www.nursenest.ca/${urlPrefix}/${page.slug}`,
        }}
        breadcrumbs={breadcrumbItems}
        additionalStructuredData={faqStructuredData ? [faqStructuredData] : undefined}
      />

      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-blue-600">{t("pages.nursingHubPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={config.parentPath} className="hover:text-blue-600">{config.parentLabel}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={`${config.accent} font-medium`}>{page.exam || page.title?.split(":")[0]?.trim() || ""}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
          <main>
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.accentBg} ${config.accent} mb-3`} data-testid="badge-page-type">
                <config.icon className="w-4 h-4" /> {config.label} Guide
              </div>
            </div>

            {contentHtml && (
              <article
                className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-li:leading-relaxed prose-ul:my-4 prose-ol:my-4 prose-strong:text-gray-900 [&_.lead]:text-lg [&_.lead]:text-gray-600 [&_.lead]:leading-relaxed [&_.exam-trap]:bg-amber-50 [&_.exam-trap]:border [&_.exam-trap]:border-amber-200 [&_.exam-trap]:rounded-lg [&_.exam-trap]:p-4 [&_.exam-trap]:my-4 [&_.exam-trap]:text-sm"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
                data-testid="article-content"
              />
            )}

            {faqItems.length > 0 && (
              <section className="mt-12 pt-8 border-t border-gray-200" data-testid="section-faq">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t("pages.nursingHubPage.frequentlyAskedQuestions")}</h2>
                <div className="space-y-3">
                  {faqItems.map((faq: { question: string; answer: string }, i: number) => (
                    <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                  ))}
                </div>
              </section>
            )}

            {relatedContentLinks.length > 0 && (
              <section className="mt-12 pt-8 border-t border-gray-200" data-testid="section-related-links">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nursingHubPage.relatedResources")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedContentLinks.map((link, i) => (
                    <Link key={i} href={link.url} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group" data-testid={`link-related-${i}`}>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        {link.context === "certification" ? <Award className="w-4 h-4 text-blue-600" /> :
                         link.context === "pathway" ? <RouteIcon className="w-4 h-4 text-blue-600" /> :
                         <BookOpen className="w-4 h-4 text-blue-600" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{link.anchor}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-auto group-hover:text-blue-600" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {relatedPages.length > 0 && (
              <section className="mt-12 pt-8 border-t border-gray-200" data-testid="section-more-pages">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nursingHubPage.exploreMore")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedPages.map((rp, i) => {
                    const rpPrefix = TYPE_TO_URL_PREFIX[rp.pageType] || rp.pageType;
                    const rpConfig = TYPE_CONFIG[rp.pageType] || TYPE_CONFIG.certification;
                    return (
                      <Link key={i} href={`/${rpPrefix}/${rp.slug}`} className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all group" data-testid={`card-related-${i}`}>
                        <span className={`text-xs font-medium ${rpConfig.accent} ${rpConfig.accentBg} px-2 py-0.5 rounded-full`}>{rpConfig.label}</span>
                        <h3 className="font-semibold text-gray-900 mt-2 mb-1 group-hover:text-blue-700 text-sm">{rp.title}</h3>
                        {rp.description && <p className="text-xs text-gray-500 line-clamp-2">{rp.description}</p>}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {tocItems.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5" data-testid="sidebar-toc">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{t("pages.nursingHubPage.onThisPage")}</h3>
                  <nav className="space-y-1.5">
                    {tocItems.map((item: { id: string; label: string }) => (
                      <a key={item.id} href={`#${item.id}`} className="block text-sm text-gray-600 hover:text-blue-700 transition-colors py-0.5" data-testid={`toc-link-${item.id}`}>
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {productLinks.length > 0 && (
                <div className={`rounded-xl border ${config.accentBorder} p-5 ${config.accentBg}`} data-testid="sidebar-cta">
                  <h3 className={`font-semibold ${config.accent} mb-3 text-sm`}>{t("pages.nursingHubPage.studyResources")}</h3>
                  <div className="space-y-2">
                    {productLinks.map((link, i) => (
                      <Link key={i} href={link.url} className={`flex items-center gap-2 text-sm font-medium ${config.accent} hover:underline`} data-testid={`cta-link-${i}`}>
                        <ArrowRight className="w-3.5 h-3.5" /> {link.anchor}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white" data-testid="sidebar-cta-pricing">
                <h3 className="font-semibold mb-2 text-sm">{t("pages.nursingHubPage.readyToStudy")}</h3>
                <p className="text-xs text-gray-300 mb-3">{t("pages.nursingHubPage.accessPracticeQuestionsFlashcardsAnd")}</p>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors w-full justify-center" data-testid="button-sidebar-pricing">
                  View Plans <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section className="py-12 bg-gradient-to-br from-gray-900 to-gray-800" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" data-testid="text-bottom-cta-heading">
            Continue Your Learning Journey
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Explore related certifications, specialty guides, and study pathways to advance your nursing career.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/nursing-certifications" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500 transition-colors" data-testid="button-bottom-certs">
              <Award className="w-4 h-4" /> Certifications
            </Link>
            <Link href="/nursing-specialties" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors" data-testid="button-bottom-specs">
              <BookOpen className="w-4 h-4" /> Specialties
            </Link>
            <Link href="/study-pathways" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-500 transition-colors" data-testid="button-bottom-paths">
              <RouteIcon className="w-4 h-4" /> Study Pathways
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>{answer}</div>}
    </div>
  );
}
