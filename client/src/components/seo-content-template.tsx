import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, ChevronRight, CheckCircle2, Sparkles,
  GraduationCap, BookOpen, HelpCircle
} from "lucide-react";

export interface ContentSection {
  heading: string;
  content: string;
  items?: string[];
  tip?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  title: string;
  href: string;
  description?: string;
}

export interface SeoContentPageProps {
  slug: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalPath: string;
  breadcrumbs: { name: string; url: string }[];
  heroColor?: string;
  sections: ContentSection[];
  faqs: FaqItem[];
  relatedLinks: RelatedLink[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonHref?: string;
  midCtaTitle?: string;
  midCtaDescription?: string;
  midCtaButtonText?: string;
  midCtaButtonHref?: string;
  publishDate?: string;
}

const SITE_DOMAIN = "https://www.nursenest.ca";

function AboveFoldCTA({ title, description, buttonText, buttonHref }: {
  title?: string; description?: string; buttonText?: string; buttonHref?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white mb-10" data-testid="cta-above-fold">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold mb-1">{title || "Get Hired Faster with ApplyNest Tools"}</h2>
          <p className="text-blue-100 text-sm">{description || "Access premium resume templates, interview prep tools, and career resources designed specifically for new graduate healthcare professionals."}</p>
        </div>
        <Link href={buttonHref || "/newgrad"} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shrink-0 text-sm" data-testid="button-cta-above-fold">
          {buttonText || "Explore Tools"} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function MidPageCTA({ title, description, buttonText, buttonHref }: {
  title?: string; description?: string; buttonText?: string; buttonHref?: string;
}) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl border border-indigo-100 p-6 sm:p-8 my-10" data-testid="cta-mid-page">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title || "Get Hired Faster with ApplyNest Tools"}</h3>
          <p className="text-sm text-gray-600 mb-4">{description || "Access premium resume builders, interview simulators, and career planning tools built specifically for new healthcare graduates."}</p>
          <Link href={buttonHref || "/newgrad"} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm" data-testid="button-cta-mid-page">
            {buttonText || "Explore Premium Tools"} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function EndPageCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" data-testid="cta-end-page">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <GraduationCap className="w-10 h-10 text-blue-200 mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t("components.seoContentTemplate.startYourCareerJourneyToday")}</h2>
        <p className="text-blue-100 mb-6 max-w-xl mx-auto">{t("components.seoContentTemplate.joinThousandsOfNewGraduate")}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/newgrad" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors" data-testid="button-cta-end-career-hub">
            Explore Career Hub <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-end-interview">
            Practice Interview Questions
          </Link>
        </div>
      </div>
    </section>
  );
}

function RelatedResources({ links }: { links: RelatedLink[] }) {
  if (!links.length) return null;
  return (
    <section className="py-12 bg-gray-50 border-t border-gray-100" data-testid="section-related-resources">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" /> Related Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, i) => (
            <Link key={i} href={link.href} className="group" data-testid={`related-link-${i}`}>
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">{link.title}</h3>
                {link.description && <p className="text-xs text-gray-500">{link.description}</p>}
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium mt-2">
                  Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SeoContentPage({
  title, subtitle, seoTitle, seoDescription, seoKeywords, canonicalPath,
  breadcrumbs, heroColor = "blue", sections, faqs, relatedLinks,
  ctaTitle, ctaDescription, ctaButtonText, ctaButtonHref,
  midCtaTitle, midCtaDescription, midCtaButtonText, midCtaButtonHref,
  publishDate,
}: SeoContentPageProps) {
  const faqStructuredData = faqs.length > 0 ? buildFaqStructuredData(faqs) : null;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": seoDescription,
    "author": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": SITE_DOMAIN,
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": SITE_DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_DOMAIN}/brand-logo.gif`,
      },
    },
    "datePublished": publishDate || "2025-06-01",
    "dateModified": new Date().toISOString().split("T")[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_DOMAIN}${canonicalPath}`,
    },
    "inLanguage": "en",
  };

  const additionalStructuredData = [articleStructuredData];
  if (faqStructuredData) additionalStructuredData.push(faqStructuredData);

  const colorMap: Record<string, { bg: string; text: string; border: string; light: string }> = {
    blue: { bg: "from-blue-50 via-indigo-50/30 to-white", text: "text-blue-700", border: "border-blue-100", light: "bg-blue-100" },
    pink: { bg: "from-pink-50 via-rose-50/30 to-white", text: "text-pink-700", border: "border-pink-100", light: "bg-pink-100" },
    purple: { bg: "from-purple-50 via-indigo-50/30 to-white", text: "text-purple-700", border: "border-purple-100", light: "bg-purple-100" },
    green: { bg: "from-green-50 via-emerald-50/30 to-white", text: "text-green-700", border: "border-green-100", light: "bg-green-100" },
    indigo: { bg: "from-indigo-50 via-blue-50/30 to-white", text: "text-indigo-700", border: "border-indigo-100", light: "bg-indigo-100" },
  };
  const colors = colorMap[heroColor] || colorMap.blue;

  const midIndex = Math.floor(sections.length / 2);

  return (
    <div data-testid={`seo-content-page-${canonicalPath.replace(/\//g, "-")}`}>
      <Navigation />
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalPath={canonicalPath}
        additionalStructuredData={additionalStructuredData}
        breadcrumbs={breadcrumbs}
      />

      <section className={`relative py-16 sm:py-20 overflow-hidden`} data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label={t("components.seoContentTemplate.breadcrumb")} data-testid="breadcrumb-nav">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.url.replace(SITE_DOMAIN, "")} className="hover:text-blue-600">{crumb.name}</Link>
                ) : (
                  <span className={`${colors.text} font-medium`}>{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-hero-title">{title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-hero-subtitle">{subtitle}</p>
        </div>
      </section>

      <article className="py-12" data-testid="section-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboveFoldCTA title={ctaTitle} description={ctaDescription} buttonText={ctaButtonText} buttonHref={ctaButtonHref} />

          {sections.map((section, i) => (
            <div key={i}>
              <div className="mb-8" data-testid={`content-section-${i}`}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                <div className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">{section.content}</div>
                {section.items && section.items.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.tip && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-sm text-amber-800"><strong>{t("components.seoContentTemplate.proTip")}</strong> {section.tip}</p>
                  </div>
                )}
              </div>
              {i === midIndex && (
                <MidPageCTA title={midCtaTitle} description={midCtaDescription} buttonText={midCtaButtonText} buttonHref={midCtaButtonHref} />
              )}
            </div>
          ))}
        </div>
      </article>

      {faqs.length > 0 && (
        <section className="py-12 bg-gray-50" data-testid="section-faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`faq-item-${i}`}>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedResources links={relatedLinks} />
      <EndPageCTA />
      <Footer />
    </div>
  );
}

export interface SeoHubPageProps {
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalPath: string;
  breadcrumbs: { name: string; url: string }[];
  heroColor?: string;
  sections: {
    title: string;
    links: { title: string; href: string; description: string }[];
  }[];
  faqs: FaqItem[];
  toolLinks: { title: string; href: string; description: string }[];
}

export function SeoHubPage({
  title, subtitle, seoTitle, seoDescription, seoKeywords, canonicalPath,
  breadcrumbs, heroColor = "blue", sections, faqs, toolLinks,
}: SeoHubPageProps) {
  const faqStructuredData = faqs.length > 0 ? buildFaqStructuredData(faqs) : null;

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": seoDescription,
    "url": `${SITE_DOMAIN}${canonicalPath}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "NurseNest",
      "url": SITE_DOMAIN,
    },
  };

  const additionalStructuredData = [collectionStructuredData];
  if (faqStructuredData) additionalStructuredData.push(faqStructuredData);

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "from-blue-50 via-indigo-50/50 to-purple-50/30", text: "text-blue-700" },
    pink: { bg: "from-pink-50 via-rose-50/30 to-white", text: "text-pink-700" },
    purple: { bg: "from-purple-50 via-indigo-50/30 to-white", text: "text-purple-700" },
    green: { bg: "from-green-50 via-emerald-50/30 to-white", text: "text-green-700" },
    indigo: { bg: "from-indigo-50 via-blue-50/30 to-white", text: "text-indigo-700" },
  };
  const colors = colorMap[heroColor] || colorMap.blue;

  return (
    <div data-testid={`seo-hub-page-${canonicalPath.replace(/\//g, "-")}`}>
      <Navigation />
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalPath={canonicalPath}
        additionalStructuredData={additionalStructuredData}
        breadcrumbs={breadcrumbs}
      />

      <section className="relative py-16 sm:py-24 overflow-hidden" data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label={t("components.seoContentTemplate.breadcrumb2")} data-testid="breadcrumb-nav">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.url.replace(SITE_DOMAIN, "")} className="hover:text-blue-600">{crumb.name}</Link>
                ) : (
                  <span className={`${colors.text} font-medium`}>{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight" data-testid="text-hero-title">{title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl" data-testid="text-hero-subtitle">{subtitle}</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-hero-cta">
              Explore Career Hub <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="button-hero-secondary">
              Practice Interview Questions
            </Link>
          </div>
        </div>
      </section>

      {sections.map((section, i) => (
        <section key={i} className={`py-12 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`} data-testid={`hub-section-${i}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.links.map((link, j) => (
                <Link key={j} href={link.href} className="group" data-testid={`hub-link-${i}-${j}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">{link.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{link.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                      Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {toolLinks.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-indigo-50 to-blue-50" data-testid="section-tools">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("components.seoContentTemplate.premiumCareerTools")}</h2>
              <p className="text-gray-600 text-sm">{t("components.seoContentTemplate.handsonToolsToAccelerateYour")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolLinks.map((tool, i) => (
                <Link key={i} href={tool.href} className="group" data-testid={`tool-link-${i}`}>
                  <div className="bg-white rounded-xl border border-indigo-100 p-5 hover:shadow-md hover:border-indigo-200 transition-all h-full">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-indigo-700 transition-colors">{tool.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{tool.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium">
                      Try it <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="py-12 bg-white" data-testid="section-faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-6" data-testid={`faq-item-${i}`}>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <EndPageCTA />
      <Footer />
    </div>
  );
}
