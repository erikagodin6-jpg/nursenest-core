import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  ChevronRight, BookOpen, Target, Award,
  HelpCircle, Link as LinkIcon, FileText, Brain,
  ClipboardList, Layers, ArrowRight, Star,
  GraduationCap, CheckCircle2, ExternalLink
} from "lucide-react";

type ContentBlock = {
  type: "hero" | "overview" | "features" | "benefits" | "internal-links" | "text-section" | "stats";
  heading?: string;
  subheading?: string;
  content?: string;
  ctaText?: string;
  ctaUrl?: string;
  items?: Array<{ title: string; description: string; icon?: string; url?: string }>;
  stats?: Array<{ value: string; label: string }>;
};

type FAQ = { q: string; a: string };
type InternalLink = { label: string; url: string; description: string };
type RelatedLink = { label: string; url: string; type: string };
type BreadcrumbItem = { name: string; url: string };

type SeoLandingPageData = {
  slug: string;
  cluster: string;
  pageType: string;
  profession: string;
  exam: string;
  audience: string;
  country: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  contentBlocks: ContentBlock[];
  faqItems: FAQ[];
  internalLinks: InternalLink[];
  relatedLinks: RelatedLink[];
  relatedPages: string[];
  breadcrumbs: BreadcrumbItem[];
};

const CLUSTER_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  "nursing-exam": { bg: "from-blue-50 via-indigo-50/50 to-white", text: "text-blue-700", accent: "bg-blue-100" },
  "allied-health-exam": { bg: "from-teal-50 via-cyan-50/50 to-white", text: "text-teal-700", accent: "bg-teal-100" },
  "certification": { bg: "from-purple-50 via-violet-50/50 to-white", text: "text-purple-700", accent: "bg-purple-100" },
  "new-grad": { bg: "from-indigo-50 via-blue-50/50 to-white", text: "text-indigo-700", accent: "bg-indigo-100" },
  "career-guide": { bg: "from-emerald-50 via-green-50/50 to-white", text: "text-emerald-700", accent: "bg-emerald-100" },
  "comparison": { bg: "from-amber-50 via-orange-50/50 to-white", text: "text-amber-700", accent: "bg-amber-100" },
};

const PAGE_TYPE_LABELS: Record<string, string> = {
  "exam-prep": "Exam Preparation",
  "certification": "Certification Guide",
  "career-guide": "Career Guide",
  "comparison": "Comparison Guide",
  "new-grad": "New Graduate Guide",
};

function HeroBlock({ page, colors }: { page: SeoLandingPageData; colors: typeof CLUSTER_COLORS[string] }) {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  return (
    <section className={`relative overflow-hidden py-12 sm:py-16`} data-testid="section-hero">
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl ${colors.accent} flex items-center justify-center shrink-0`}>
            {page.pageType === "exam-prep" && <Target className={`w-6 h-6 ${colors.text}`} />}
            {page.pageType === "certification" && <Award className={`w-6 h-6 ${colors.text}`} />}
            {page.pageType === "career-guide" && <GraduationCap className={`w-6 h-6 ${colors.text}`} />}
            {page.pageType === "comparison" && <ClipboardList className={`w-6 h-6 ${colors.text}`} />}
            {!["exam-prep", "certification", "career-guide", "comparison"].includes(page.pageType) && <BookOpen className={`w-6 h-6 ${colors.text}`} />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className={`text-xs ${colors.text} border-current`} data-testid="badge-page-type">
                {PAGE_TYPE_LABELS[page.pageType] || page.pageType}
              </Badge>
              {page.exam && (
                <Badge className={`text-xs ${colors.accent} ${colors.text} border-0`} data-testid="badge-exam">
                  {page.exam}
                </Badge>
              )}
              {page.country && page.country !== "BOTH" && (
                <Badge variant="outline" className="text-xs" data-testid="badge-country">
                  {page.country === "CA" ? "Canada" : page.country === "US" ? "United States" : page.country}
                </Badge>
              )}
            </div>
            {page.heroSubheading && (
              <p className={`text-sm font-medium ${colors.text} mb-1`} data-testid="text-hero-subheading">
                {page.heroSubheading}
              </p>
            )}
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-testid="heading-hero">
          {page.heroHeading}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mb-6" data-testid="text-hero-description">
          {page.heroDescription}
        </p>
        {page.internalLinks && page.internalLinks.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate(page.internalLinks[0].url)} className="gap-2" data-testid="button-hero-cta-primary">
              {page.internalLinks[0].label} <ArrowRight className="w-4 h-4" />
            </Button>
            {page.internalLinks.length > 1 && (
              <Button variant="outline" onClick={() => navigate(page.internalLinks[1].url)} data-testid="button-hero-cta-secondary">
                {page.internalLinks[1].label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ContentBlockRenderer({ block, index }: { block: ContentBlock; index: number }) {
  if (block.type === "overview" || block.type === "text-section") {
    return (
      <section className="mb-10" data-testid={`section-content-${index}`}>
        {block.heading && (
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid={`heading-content-${index}`}>
            <Brain className="w-5 h-5 text-primary" />
            {block.heading}
          </h2>
        )}
        {block.content && (
          <div className="text-gray-700 leading-relaxed text-base" data-testid={`text-content-${index}`}>
            {block.content}
          </div>
        )}
      </section>
    );
  }

  if (block.type === "features" || block.type === "benefits") {
    return (
      <section className="mb-10" data-testid={`section-features-${index}`}>
        {block.heading && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid={`heading-features-${index}`}>
            <Star className="w-5 h-5 text-primary" />
            {block.heading}
          </h2>
        )}
        {block.items && (
          <div className="grid sm:grid-cols-2 gap-4" data-testid={`grid-features-${index}`}>
            {block.items.map((item, i) => (
              <Card key={i} className="border-gray-200/80 hover:border-primary/20 transition-colors" data-testid={`card-feature-${index}-${i}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    );
  }

  return null;
}

function FAQBlock({ faqs }: { faqs: FAQ[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="mb-12" data-testid="section-faq">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="heading-faq">
        <HelpCircle className="w-6 h-6 text-primary" /> Frequently Asked Questions
      </h2>
      <div className="space-y-3" data-testid="section-faq-list">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              aria-expanded={openFaq === i}
              aria-controls={`faq-answer-${i}`}
              data-testid={`button-faq-toggle-${i}`}
            >
              <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
              <ChevronRight className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
            </button>
            {openFaq === i && (
              <div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`} className="px-5 pb-4 text-gray-600 border-t border-gray-100 pt-3 leading-relaxed" data-testid={`text-faq-answer-${i}`}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function InternalLinksBlock({ links, title }: { links: InternalLink[]; title?: string }) {
  const [, navigate] = useLocation();

  if (!links || links.length === 0) return null;

  return (
    <section className="mb-12" data-testid="section-internal-links">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-internal-links">
        <LinkIcon className="w-5 h-5 text-primary" /> {title || "Study Resources & Tools"}
      </h2>
      <div className="grid sm:grid-cols-2 gap-3" data-testid="grid-internal-links">
        {links.map((link, i) => (
          <button
            key={i}
            onClick={() => navigate(link.url)}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group text-left w-full"
            data-testid={`link-internal-${i}`}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{link.label}</p>
              {link.description && (
                <p className="text-xs text-gray-500 truncate">{link.description}</p>
              )}
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary shrink-0" />
          </button>
        ))}
      </div>
    </section>
  );
}

function RelatedGuidesBlock({ links }: { links: RelatedLink[] }) {
  if (!links || links.length === 0) return null;

  const guideLinks = links.filter(l => l.type === "related-guide");
  if (guideLinks.length === 0) return null;

  return (
    <section className="mb-12" data-testid="section-related-guides">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-related-guides">
        <Layers className="w-5 h-5 text-primary" /> Related Guides
      </h2>
      <div className="grid sm:grid-cols-2 gap-3" data-testid="grid-related-guides">
        {guideLinks.map((link, i) => (
          <a
            key={i}
            href={link.url}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
            data-testid={`link-related-guide-${i}`}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-2">{link.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function CTABlock({ page }: { page: SeoLandingPageData }) {
  const [, navigate] = useLocation();
  const ctaUrl = page.internalLinks?.[0]?.url || "/pricing";
  const ctaLabel = page.internalLinks?.[0]?.label || "Get Started";

  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 text-center mb-8" data-testid="section-cta">
      <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid="heading-cta">
        Ready to Start Studying?
      </h3>
      <p className="text-gray-600 mb-4" data-testid="text-cta">
        Access practice questions, study guides, mock exams, and more to prepare with confidence.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => navigate(ctaUrl)} className="gap-2" data-testid="button-cta-primary">
          {ctaLabel} <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={() => navigate("/pricing")} data-testid="button-cta-pricing">
          View Pricing
        </Button>
      </div>
    </div>
  );
}

function BreadcrumbNav({ breadcrumbs, slug }: { breadcrumbs: BreadcrumbItem[]; slug: string }) {
  const [, navigate] = useLocation();

  const crumbs = breadcrumbs.length > 0 ? breadcrumbs : [
    { name: "Home", url: "/" },
    { name: slug.split("/")[0], url: `/${slug.split("/")[0]}` },
  ];

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap py-3" data-testid="nav-breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="w-3 h-3" />}
          {i < crumbs.length - 1 ? (
            <button
              onClick={() => navigate(crumb.url.replace("https://www.nursenest.ca", ""))}
              className="hover:text-primary"
              data-testid={`breadcrumb-${i}`}
            >
              {crumb.name}
            </button>
          ) : (
            <span className="text-gray-800 font-medium" data-testid={`breadcrumb-current`}>
              {crumb.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function SeoLandingPage({ slug: propSlug }: { slug?: string } = {}) {
  const [location, navigate] = useLocation();
  const [page, setPage] = useState<SeoLandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const slug = propSlug || location.replace(/^\//, "");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const parts = slug.split("/");
    const cluster = parts[0];
    const pageSlug = parts.slice(1).join("/");

    fetch(`/api/seo-content/${cluster}/${pageSlug}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (data.error) { setError(data.error); setPage(null); }
        else { setPage(data); setError(""); }
      })
      .catch(() => setError("Failed to load page"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="loading-seo-landing">
        <div className="animate-pulse text-gray-400">{t("pages.seoLandingPage.loading")}</div>
      </div>
    </>
  );

  if (error || !page) return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-bold mb-2" data-testid="heading-error">{t("pages.seoLandingPage.pageNotFound")}</h1>
            <p className="text-gray-600 mb-4" data-testid="text-error">{error || "This page could not be found."}</p>
            <Button onClick={() => navigate("/")} data-testid="button-go-home">{t("pages.seoLandingPage.goHome")}</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const colors = CLUSTER_COLORS[page.cluster] || CLUSTER_COLORS["nursing-exam"];

  const faqSchema = page.faqItems && page.faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqItems.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": page.pageType === "comparison" ? "Article" : "Course",
    ...(page.pageType === "comparison" ? { headline: page.metaTitle } : { name: page.title }),
    description: page.metaDescription,
    ...(page.pageType !== "comparison" ? {
      provider: { "@type": "EducationalOrganization", name: "NurseNest", url: "https://www.nursenest.ca" },
      courseMode: "online",
      inLanguage: "en",
    } : {
      author: { "@type": "Organization", name: "NurseNest" },
      publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    }),
    url: `https://www.nursenest.ca/${page.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.nursenest.ca/${page.slug}` },
  };

  return (
    <>
      <Navigation />
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        canonicalPath={`/${page.slug}`}
        structuredData={articleSchema}
        additionalStructuredData={faqSchema ? [faqSchema] : undefined}
        breadcrumbs={page.breadcrumbs.map(b => ({ name: b.name, url: b.url }))}
      />

      <main className="min-h-screen bg-white" data-testid="seo-landing-page">
        <div className="max-w-5xl mx-auto px-4">
          <BreadcrumbNav breadcrumbs={page.breadcrumbs} slug={page.slug} />
        </div>

        <HeroBlock page={page} colors={colors} />

        <div className="max-w-5xl mx-auto px-4 py-8">
          {page.contentBlocks && page.contentBlocks.map((block, i) => (
            <ContentBlockRenderer key={i} block={block} index={i} />
          ))}

          <FAQBlock faqs={page.faqItems} />

          <InternalLinksBlock links={page.internalLinks} />

          <RelatedGuidesBlock links={page.relatedLinks} />

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <MedicalReviewBadge />
            <MedicalReferences lessonId={page.slug} />
          </div>

          <MedicalReviewJsonLd
            title={page.metaTitle}
            slug={page.slug}
            description={page.metaDescription}
            pageUrl={`https://www.nursenest.ca/${page.slug}`}
          />

          <CTABlock page={page} />
        </div>
      </main>

      <Footer />
    </>
  );
}

export function SeoLandingBySlug({ slug }: { slug: string }) {
  return <SeoLandingPage slug={slug} />;
}
