import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import {
  BookOpen, ChevronDown, ChevronRight, AlertTriangle, Lightbulb,
  Stethoscope, Heart, Brain, FileText, Shield, Activity, ClipboardList,
  HelpCircle, ArrowRight, Layers, ImageIcon, GraduationCap
} from "lucide-react";
import { ENCYCLOPEDIA_PROFESSIONS } from "@shared/schema";
import { slugToDisplayName } from "@/lib/canonical-display";

import { useI18n } from "@/lib/i18n";
interface EncyclopediaEntryData {
  id: string;
  topicId: string;
  profession: string;
  slug: string;
  title: string;
  category: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  overview: string | null;
  mechanismPhysiology: string | null;
  clinicalRelevance: string | null;
  signsSymptoms: string | null;
  assessment: string | null;
  management: string | null;
  complications: string | null;
  clinicalPearls: string[];
  examPitfalls: string[];
  faqJson: { q: string; a: string }[];
  relatedLessonIds: string[];
  relatedQuestionIds: string[];
  relatedFlashcardIds: string[];
  crossProfessionLinks: { profession: string; slug: string; title: string }[];
  imagePlaceholders: { section: string; alt: string; caption: string }[];
  relatedEntries: { id: string; slug: string; title: string; category: string }[];
  status: string;
}

const SECTION_CONFIG = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "mechanismPhysiology", label: "Mechanism & Physiology", icon: Brain },
  { key: "clinicalRelevance", label: "Clinical Relevance", icon: Heart },
  { key: "signsSymptoms", label: "Signs & Symptoms", icon: Activity },
  { key: "assessment", label: "Assessment", icon: ClipboardList },
  { key: "management", label: "Management", icon: Shield },
  { key: "complications", label: "Complications", icon: AlertTriangle },
] as const;

function ImagePlaceholder({ placeholder }: { placeholder: { section: string; alt: string; caption: string } }) {
  const { t } = useI18n();
  return (
    <figure className="my-6 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center" data-testid={`img-placeholder-${placeholder.section}`}>
      <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-lg mb-3">
        <ImageIcon className="w-12 h-12 text-gray-300" />
      </div>
      {placeholder.caption && (
        <figcaption className="text-sm text-gray-500 italic">{placeholder.caption}</figcaption>
      )}
    </figure>
  );
}

export default function EncyclopediaEntryPage() {
  const params = useParams<{ profession: string; slug: string }>();
  const [, navigate] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  const { data: entry, isLoading, error } = useQuery<EncyclopediaEntryData>({
    queryKey: ["/api/encyclopedia", params.profession, params.slug],
    queryFn: async () => {
      const res = await fetch(`/api/encyclopedia/${params.profession}/${params.slug}`);
      if (!res.ok) throw new Error("Entry not found");
      return res.json();
    },
    enabled: !!params.profession && !!params.slug,
  });

  const professionInfo = useMemo(() =>
    ENCYCLOPEDIA_PROFESSIONS.find(p => p.slug === params.profession),
    [params.profession]
  );

  const tocSections = useMemo(() => {
    if (!entry) return [];
    const sections: { id: string; label: string }[] = [];
    for (const sec of SECTION_CONFIG) {
      if (entry[sec.key as keyof EncyclopediaEntryData]) {
        sections.push({ id: sec.key, label: sec.label });
      }
    }
    if (entry.clinicalPearls?.length) sections.push({ id: "clinicalPearls", label: "Clinical Pearls" });
    if (entry.examPitfalls?.length) sections.push({ id: "examPitfalls", label: "Exam Pitfalls" });
    if (entry.faqJson?.length) sections.push({ id: "faq", label: "FAQ" });
    return sections;
  }, [entry]);

  useEffect(() => {
    const handleScroll = () => {
      for (const sec of tocSections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sec.id);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocSections]);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (error || !entry) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center px-4" data-testid="text-entry-not-found">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.encyclopediaEntry.entryNotFound")}</h1>
            <p className="text-gray-500 mb-4">{t("pages.encyclopediaEntry.thisEncyclopediaEntryCouldNot")}</p>
            <Button onClick={() => navigate(`/${params.profession}-encyclopedia`)} data-testid="button-back-hub">
              Back to Encyclopedia
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const faqs = Array.isArray(entry.faqJson) ? entry.faqJson : [];
  const pearls = Array.isArray(entry.clinicalPearls) ? entry.clinicalPearls : [];
  const pitfalls = Array.isArray(entry.examPitfalls) ? entry.examPitfalls : [];
  const crossLinks = Array.isArray(entry.crossProfessionLinks) ? entry.crossProfessionLinks : [];
  const imagePlaceholders = Array.isArray(entry.imagePlaceholders) ? entry.imagePlaceholders : [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.seoTitle || entry.title,
    description: entry.seoDescription || entry.overview?.slice(0, 200) || "",
    author: { "@type": "Organization", name: "NurseNest" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/encyclopedia/${entry.profession}/${entry.slug}`,
    },
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name: entry.title,
    description: entry.seoDescription || entry.overview?.slice(0, 300) || "",
    signOrSymptom: entry.signsSymptoms ? { "@type": "MedicalSignOrSymptom", name: entry.title + " symptoms" } : undefined,
  };

  const additionalSchemas = [medicalSchema];
  if (faqSchema) additionalSchemas.push(faqSchema);

  const getPlaceholdersForSection = (sectionKey: string) =>
    imagePlaceholders.filter(p => p.section === sectionKey);

  return (
    <>
      <Navigation />
      <SEO
        title={entry.seoTitle || `${entry.title} — ${professionInfo?.label || entry.profession} Encyclopedia`}
        description={entry.seoDescription || entry.overview?.slice(0, 160) || `Learn about ${entry.title} in the ${professionInfo?.label || entry.profession} encyclopedia.`}
        keywords={entry.seoKeywords?.join(", ") || `${entry.title}, ${entry.category}, ${entry.profession}`}
        canonicalPath={`/encyclopedia/${entry.profession}/${entry.slug}`}
        structuredData={articleSchema}
        additionalStructuredData={additionalSchemas}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Encyclopedia", url: "https://www.nursenest.ca/encyclopedia" },
          { name: professionInfo?.label || entry.profession, url: `https://www.nursenest.ca/${entry.profession}-encyclopedia` },
          { name: entry.title, url: `https://www.nursenest.ca/encyclopedia/${entry.profession}/${entry.slug}` },
        ]}
      />

      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "/" },
              { name: "Encyclopedia", url: "/encyclopedia" },
              { name: professionInfo?.label || entry.profession, url: `/${entry.profession}-encyclopedia` },
              { name: entry.title, url: "" },
            ]}
          />

          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            {tocSections.length > 0 && (
              <aside className="lg:w-56 shrink-0">
                <nav className="sticky top-24 bg-gray-50 rounded-xl border border-gray-100 p-4" data-testid="nav-toc">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t("pages.encyclopediaEntry.contents")}</h3>
                  <ul className="space-y-1">
                    {tocSections.map(sec => (
                      <li key={sec.id}>
                        <a
                          href={`#${sec.id}`}
                          className={`text-sm block py-1 px-2 rounded transition-colors ${activeSection === sec.id ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
                          data-testid={`link-toc-${sec.id}`}
                        >
                          {sec.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}

            <article className="flex-1 min-w-0">
              <header className="mb-8">
                <Badge variant="outline" className="mb-3 text-xs" data-testid="badge-category">
                  {entry.category}
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }} data-testid="heading-entry-title">
                  {entry.title}
                </h1>
                {entry.seoDescription && (
                  <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-entry-description">
                    {entry.seoDescription}
                  </p>
                )}
              </header>

              {SECTION_CONFIG.map(sec => {
                const content = entry[sec.key as keyof EncyclopediaEntryData] as string | null;
                if (!content) return null;
                const Icon = sec.icon;
                const sectionPlaceholders = getPlaceholdersForSection(sec.key);
                return (
                  <section key={sec.key} id={sec.key} className="mb-10 scroll-mt-24" data-testid={`section-${sec.key}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {sec.label}
                      </h2>
                    </div>
                    <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed pl-11">
                      {content.split("\n").map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
                    </div>
                    {sectionPlaceholders.map((ph, i) => (
                      <div className="pl-11" key={i}>
                        <ImagePlaceholder placeholder={ph} />
                      </div>
                    ))}
                  </section>
                );
              })}

              {pearls.length > 0 && (
                <section id="clinicalPearls" className="mb-10 scroll-mt-24" data-testid="section-clinical-pearls">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Clinical Pearls
                    </h2>
                  </div>
                  <div className="space-y-3 pl-11">
                    {pearls.map((pearl, i) => (
                      <div key={i} className="flex gap-3 bg-amber-50 border border-amber-100 rounded-lg p-4" data-testid={`text-pearl-${i}`}>
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-amber-900">{pearl}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {pitfalls.length > 0 && (
                <section id="examPitfalls" className="mb-10 scroll-mt-24" data-testid="section-exam-pitfalls">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Exam Pitfalls
                    </h2>
                  </div>
                  <div className="space-y-3 pl-11">
                    {pitfalls.map((pitfall, i) => (
                      <div key={i} className="flex gap-3 bg-red-50 border border-red-100 rounded-lg p-4" data-testid={`text-pitfall-${i}`}>
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-900">{pitfall}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {faqs.length > 0 && (
                <section id="faq" className="mb-10 scroll-mt-24" data-testid="section-faq">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Frequently Asked Questions
                    </h2>
                  </div>
                  <div className="space-y-3 pl-11">
                    {faqs.map((faq, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          data-testid={`button-faq-toggle-${i}`}
                        >
                          <span className="font-medium text-gray-800 pr-4 text-sm">{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                        </button>
                        {openFaq === i && (
                          <div className="px-5 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed" data-testid={`text-faq-answer-${i}`}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(entry.relatedLessonIds?.length > 0 || entry.relatedQuestionIds?.length > 0 || entry.relatedFlashcardIds?.length > 0) && (
                <section className="mb-10" data-testid="section-related-content">
                  <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Related Study Material
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {entry.relatedLessonIds?.map((id, i) => (
                      <Link key={id} href={`/lessons/${id}`} className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg hover:border-green-300 transition-colors" data-testid={`link-related-lesson-${i}`}>
                        <BookOpen className="w-4 h-4 text-green-600 shrink-0" />
                        <span className="text-sm text-green-800 font-medium truncate">{slugToDisplayName(id)}</span>
                      </Link>
                    ))}
                    {entry.relatedQuestionIds?.length > 0 && (
                      <Link href={`/${entry.profession}/question-bank`} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg hover:border-blue-300 transition-colors" data-testid="link-practice-questions">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-sm text-blue-800 font-medium">Practice Questions ({entry.relatedQuestionIds.length})</span>
                      </Link>
                    )}
                    {entry.relatedFlashcardIds?.length > 0 && (
                      <Link href={`/${entry.profession}/flashcards`} className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-lg hover:border-purple-300 transition-colors" data-testid="link-flashcards">
                        <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="text-sm text-purple-800 font-medium">Review Flashcards ({entry.relatedFlashcardIds.length})</span>
                      </Link>
                    )}
                  </div>
                </section>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                <MedicalReviewBadge />
                <MedicalReferences lessonId={entry.slug} pageType="encyclopedia" />
              </div>

              <MedicalReviewJsonLd
                title={entry.title}
                slug={entry.slug}
                description={entry.seoDescription || entry.overview?.slice(0, 160) || ""}
                pageUrl={`https://www.nursenest.ca/encyclopedia/${entry.profession}/${entry.slug}`}
              />

              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 sm:p-8 mb-10" data-testid="section-cta">
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Master {entry.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Test your knowledge with practice questions, review flashcards, or take a mock exam.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/${entry.profession}/question-bank`}>
                    <Button size="sm" data-testid="button-cta-questions">
                      <FileText className="w-4 h-4 mr-1.5" /> Test Your Knowledge
                    </Button>
                  </Link>
                  <Link href={`/${entry.profession}/flashcards`}>
                    <Button size="sm" variant="outline" data-testid="button-cta-flashcards">
                      <Layers className="w-4 h-4 mr-1.5" /> Review Flashcards
                    </Button>
                  </Link>
                  <Link href={`/${entry.profession}/mock-exams`}>
                    <Button size="sm" variant="outline" data-testid="button-cta-mock-exam">
                      <GraduationCap className="w-4 h-4 mr-1.5" /> Start Mock Exam
                    </Button>
                  </Link>
                </div>
              </div>

              {crossLinks.length > 0 && (
                <section className="mb-10" data-testid="section-cross-profession">
                  <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    This Topic in Other Professions
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {crossLinks.map((link, i) => {
                      const prof = ENCYCLOPEDIA_PROFESSIONS.find(p => p.slug === link.profession);
                      return (
                        <Link key={i} href={`/encyclopedia/${link.profession}/${link.slug}`} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors" data-testid={`link-cross-profession-${i}`}>
                          <span className="text-sm font-medium text-gray-700">{link.title}</span>
                          <Badge variant="outline" className="ml-auto text-[10px] shrink-0">{prof?.label || link.profession}</Badge>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {entry.relatedEntries && entry.relatedEntries.length > 0 && (
                <section className="mb-10" data-testid="section-related-entries">
                  <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    More in {entry.category}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {entry.relatedEntries.map((re, i) => (
                      <Link key={re.id} href={`/encyclopedia/${entry.profession}/${re.slug}`} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors group" data-testid={`link-related-entry-${i}`}>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{re.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary shrink-0" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
