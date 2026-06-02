import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { AutoRelatedContent } from "@/components/auto-related-content";
import { useState } from "react";
import {
  BookOpen, ArrowRight, HelpCircle, ChevronDown,
  Stethoscope, Activity, FileText, Brain, Pill,
  Heart, Beaker, Zap, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  getCategoryHubBySlug,
  CATEGORY_HUBS,
  type CategoryHub,
  type CategoryHubTopic,
} from "@shared/category-hub-data";

const ICON_MAP: Record<string, any> = {
  Heart, Stethoscope, Activity, Brain, Pill, Beaker, Zap, Shield, BookOpen, FileText, HelpCircle,
};

function getIcon(name: string) {

  return ICON_MAP[name] || BookOpen;
}

function CategoryHubPageContent({ hub }: { hub: CategoryHub }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const HubIcon = getIcon(hub.iconName);

  const faqStructuredData = buildFaqStructuredData(hub.faqs);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": hub.title,
    "description": hub.metaDescription,
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": PARENT_EDUCATIONAL_ORG.name,
        "url": PARENT_EDUCATIONAL_ORG.url,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/${hub.slug}`,
    },
  };

  const breadcrumbItems = [
    { name: "Home", url: "https://www.nursenest.ca" },
    { name: "Topics", url: "https://www.nursenest.ca/topics" },
    { name: hub.title, url: `https://www.nursenest.ca/${hub.slug}` },
  ];

  const relatedHubs = CATEGORY_HUBS.filter(h => hub.relatedHubSlugs.includes(h.slug));

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`page-category-hub-${hub.slug}`}>
      <Navigation />
      <SEO
        title={hub.metaTitle}
        description={hub.metaDescription}
        keywords={hub.keywords}
        canonicalPath={`/${hub.slug}`}
        structuredData={structuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={breadcrumbItems}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${hub.colorAccent}60, white, ${hub.colorAccent}30)` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white" style={{ backgroundColor: hub.color }} data-testid="badge-hub-category">
              <HubIcon className="w-3 h-3 mr-1" /> {hub.title} Hub
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-hub-title">
              {hub.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-hub-description">
              {hub.introduction}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-12" data-testid="section-topics">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3" data-testid="heading-topics">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${hub.color}15` }}>
              <BookOpen className="w-5 h-5" style={{ color: hub.color }} />
            </div>
            {hub.title} Topics
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {hub.topics.map((topic) => {
              const TopicIcon = getIcon(topic.iconName);
              return (
                <LocaleLink key={topic.slug} href={`/${topic.slug}`}>
                  <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`card-topic-${topic.slug}`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${topic.color}15` }}>
                          <TopicIcon className="w-4 h-4" style={{ color: topic.color }} />
                        </div>
                        <Badge variant="outline" className="text-[10px]">{topic.category}</Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{topic.description}</p>
                      <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                        Read More <ArrowRight className="w-3 h-3" />
                      </span>
                    </CardContent>
                  </Card>
                </LocaleLink>
              );
            })}
          </div>
        </section>

        <div className="my-8 rounded-xl p-6 text-center" style={{ backgroundColor: `${hub.color}10`, borderLeft: `4px solid ${hub.color}` }} data-testid="cta-practice">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Test Your {hub.title} Knowledge</h3>
          <p className="text-sm text-gray-600 mb-4">Practice with exam-style questions covering {hub.title.toLowerCase()} topics and clinical scenarios.</p>
          <LocaleLink href="/practice-questions">
            <Button className="text-white" style={{ backgroundColor: hub.color }} data-testid="button-cta-practice">
              Start Practice Questions <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </LocaleLink>
        </div>

        <section className="mb-12" data-testid="section-why-it-matters">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${hub.color}15` }}>
              <Stethoscope className="w-5 h-5" style={{ color: hub.color }} />
            </div>
            Why {hub.title} Matters in Nursing
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-700 leading-relaxed">{hub.whyItMatters}</p>
          </div>
        </section>

        <section className="mb-12" data-testid="section-related-resources">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-50">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            Study Resources
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <LocaleLink href="/lessons">
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid="link-lessons">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-6 h-6 mx-auto mb-2" style={{ color: hub.color }} />
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{t("pages.categoryHubPage.clinicalLessons")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.categoryHubPage.indepthPathophysiologyLessons")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/flashcards">
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid="link-flashcards">
                <CardContent className="p-4 text-center">
                  <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{t("pages.categoryHubPage.flashcards")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.categoryHubPage.spacedrepetitionReviewCards")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/practice-questions">
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid="link-practice">
                <CardContent className="p-4 text-center">
                  <FileText className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{t("pages.categoryHubPage.practiceQuestions")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.categoryHubPage.nclexstyleExamQuestions")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        {relatedHubs.length > 0 && (
          <section className="mb-12" data-testid="section-related-hubs">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100">
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </div>
              Related Nursing Topics
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedHubs.map((related) => {
                const RelIcon = getIcon(related.iconName);
                return (
                  <LocaleLink key={related.slug} href={`/${related.slug}`}>
                    <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid={`link-hub-${related.slug}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${related.color}15` }}>
                            <RelIcon className="w-4 h-4" style={{ color: related.color }} />
                          </div>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                          {related.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{related.topics.length} topics</p>
                      </CardContent>
                    </Card>
                  </LocaleLink>
                );
              })}
            </div>
          </section>
        )}

        <section id="faq" className="mb-12" data-testid="section-faq">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-amber-50">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {hub.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  data-testid={`button-faq-${i}`}
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <AutoRelatedContent
          slug={hub.slug}
          contentType="lesson"
          title={hub.title}
          category={hub.title}
          sectionTitle={`More ${hub.title} Resources`}
          className="mb-12"
        />

        <div className="mb-12">
          <EndOfContentLeadCapture leadMagnetType="study_guide" source={`category_hub_${hub.slug}`} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CategoryHubPage({ slug }: { slug: string }) {
  const hub = getCategoryHubBySlug(slug);

  if (!hub) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-hub-not-found">{t("pages.categoryHubPage.hubNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.categoryHubPage.theCategoryHubYouAre")}</p>
          <LocaleLink href="/topics">
            <Button data-testid="button-back-to-topics">{t("pages.categoryHubPage.browseAllTopics")}</Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  return <CategoryHubPageContent hub={hub} />;
}

export function CardiologyHub() { return <CategoryHubPage slug="cardiology-nursing" />; }
export function RespiratoryHub() { return <CategoryHubPage slug="respiratory-nursing" />; }
export function EndocrineHub() { return <CategoryHubPage slug="endocrine-nursing" />; }
export function NeurologyHub() { return <CategoryHubPage slug="neurology-nursing" />; }
export function ElectrolytesHub() { return <CategoryHubPage slug="electrolytes-nursing" />; }
export function PharmacologyNursingHub() { return <CategoryHubPage slug="pharmacology-nursing" />; }
