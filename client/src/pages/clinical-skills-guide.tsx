import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  getClinicalSkillGuideBySlug,
  getRelatedClinicalSkillGuides,
  type ClinicalSkillGuide,
} from "@/data/clinical-skills-guides";
import {
  ChevronRight,
  BookOpen,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Lightbulb,
  Target,
  Star,
} from "lucide-react";

function TableOfContents({ guide }: { guide: ClinicalSkillGuide }) {
  const { t } = useI18n();
  return (
    <div className="sticky top-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-3">{t("pages.clinicalSkillsGuide.inThisGuide")}</h3>
          <nav className="space-y-1">
            <a href="#overview" className="block text-xs text-gray-600 hover:text-blue-600 py-1 transition-colors" data-testid="toc-overview">{t("pages.clinicalSkillsGuide.overview")}</a>
            {guide.sections.map((section, i) => (
              <a
                key={i}
                href={`#section-${i}`}
                className="block text-xs text-gray-600 hover:text-blue-600 py-1 transition-colors truncate"
                data-testid={`toc-section-${i}`}
              >
                {section.title}
              </a>
            ))}
            <a href="#common-mistakes" className="block text-xs text-gray-600 hover:text-blue-600 py-1 transition-colors" data-testid="toc-mistakes">{t("pages.clinicalSkillsGuide.commonMistakes")}</a>
            <a href="#best-practices" className="block text-xs text-gray-600 hover:text-blue-600 py-1 transition-colors" data-testid="toc-best-practices">{t("pages.clinicalSkillsGuide.bestPractices")}</a>
            {guide.practiceScenarios.length > 0 && (
              <a href="#practice" className="block text-xs text-gray-600 hover:text-blue-600 py-1 transition-colors" data-testid="toc-practice">{t("pages.clinicalSkillsGuide.practiceScenarios")}</a>
            )}
            <a href="#faq" className="block text-xs text-gray-600 hover:text-blue-600 py-1 transition-colors" data-testid="toc-faq">FAQ</a>
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-500 mb-2">{t("pages.clinicalSkillsGuide.details")}</h4>
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>{guide.readTime} read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="w-3 h-3 text-gray-400" />
                <span className="capitalize">{guide.difficulty} level</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-gray-400" />
                <span>{guide.applicableProfessions.length} professions</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-500 mb-2">{t("pages.clinicalSkillsGuide.applicableTo")}</h4>
            <div className="flex flex-wrap gap-1">
              {guide.applicableProfessions.map(p => (
                <Badge key={p} variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                  {p.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PracticeScenario({ scenario, index }: {
  scenario: ClinicalSkillGuide["practiceScenarios"][0];
  index: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected !== null) setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5" data-testid={`scenario-${index}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-blue-700">{index + 1}</span>
        </div>
        <div>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">{scenario.scenario}</p>
          <p className="text-sm font-semibold text-gray-900">{scenario.question}</p>
        </div>
      </div>

      <div className="space-y-2 ml-11">
        {scenario.options.map((opt, idx) => {
          let cls = "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer";
          if (submitted) {
            if (idx === scenario.correct) cls = "border-green-500 bg-green-50";
            else if (idx === selected && idx !== scenario.correct) cls = "border-red-400 bg-red-50";
            else cls = "border-gray-200 opacity-50";
          } else if (idx === selected) {
            cls = "border-blue-500 bg-blue-50";
          }

          return (
            <button
              key={idx}
              onClick={() => !submitted && setSelected(idx)}
              disabled={submitted}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls} ${submitted ? "cursor-default" : ""}`}
              data-testid={`button-option-${index}-${idx}`}
            >
              <div className="flex items-center gap-2">
                {submitted && idx === scenario.correct && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
                {submitted && idx === selected && idx !== scenario.correct && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                <span>{String.fromCharCode(65 + idx)}. {opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <div className="ml-11 mt-3">
          <Button
            onClick={handleSubmit}
            disabled={selected === null}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm"
            data-testid={`button-submit-${index}`}
          >
            Check Answer
          </Button>
        </div>
      )}

      {submitted && (
        <div className={`ml-11 mt-3 p-3 rounded-lg text-xs leading-relaxed ${
          selected === scenario.correct ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"
        }`} data-testid={`rationale-${index}`}>
          <p className="font-semibold mb-1">
            {selected === scenario.correct ? "Correct!" : "Incorrect"}
          </p>
          <p>{scenario.rationale}</p>
        </div>
      )}
    </div>
  );
}

export default function ClinicalSkillsGuidePage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const guide = getClinicalSkillGuideBySlug(params.slug || "");

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-not-found">{t("pages.clinicalSkillsGuide.clinicalSkillsGuideNotFound")}</h1>
            <p className="text-gray-600 mb-4">{t("pages.clinicalSkillsGuide.theGuideYoureLookingFor")}</p>
            <Link href="/clinical-skills" className="text-blue-600 hover:underline" data-testid="link-back">{t("pages.clinicalSkillsGuide.browseAllClinicalSkillsGuides")}</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedGuides = getRelatedClinicalSkillGuides(guide.slug);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.metaDescription,
    "url": `https://www.nursenest.ca/clinical-skills/${guide.slug}`,
    "author": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NurseNest Education Inc.",
      "url": "https://www.nursenest.ca"
    },
    "mainEntityOfPage": `https://www.nursenest.ca/clinical-skills/${guide.slug}`,
    "about": {
      "@type": "MedicalEntity",
      "name": guide.title
    },
    "educationalLevel": guide.difficulty === "beginner" ? "Beginner" : guide.difficulty === "intermediate" ? "Intermediate" : "Advanced",
    "keywords": guide.keywords.join(", ")
  };

  return (
    <div className="min-h-screen flex flex-col" data-testid={`clinical-skills-guide-${guide.slug}`}>
      <Navigation />
      <SEO
        title={guide.metaTitle}
        description={guide.metaDescription}
        keywords={guide.keywords.join(", ")}
        canonicalPath={`/clinical-skills/${guide.slug}`}
        additionalStructuredData={[
          buildFaqStructuredData(guide.faqs),
          structuredData,
        ]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Clinical Skills", url: "https://www.nursenest.ca/clinical-skills" },
          { name: guide.title, url: `https://www.nursenest.ca/clinical-skills/${guide.slug}` },
        ]}
      />

      <section className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border-b" data-testid="section-hero">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.clinicalSkillsGuide.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/clinical-skills" className="hover:text-blue-600">{t("pages.clinicalSkillsGuide.clinicalSkills")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium truncate">{guide.title}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-blue-100 text-blue-700 text-xs capitalize">{guide.category}</Badge>
            <Badge className={`text-xs capitalize ${guide.difficulty === "beginner" ? "bg-green-100 text-green-700" : guide.difficulty === "intermediate" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
              {guide.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />{guide.readTime}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-guide-title">
            {guide.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl" data-testid="text-guide-overview">
            {guide.overview}
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_260px] gap-8">
            <div className="space-y-8">
              <div id="overview" className="bg-blue-50 rounded-xl p-6 border border-blue-100" data-testid="section-why-matters">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h2 className="font-bold text-gray-900 mb-2">{t("pages.clinicalSkillsGuide.whyThisMatters")}</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{guide.whyItMatters}</p>
                  </div>
                </div>
              </div>

              {guide.sections.map((section, i) => (
                <div key={i} id={`section-${i}`} className="bg-white rounded-xl border border-gray-200 p-6" data-testid={`section-content-${i}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                  {section.tips && section.tips.length > 0 && (
                    <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-100">
                      <h4 className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" /> Clinical Tips
                      </h4>
                      <ul className="space-y-1.5">
                        {section.tips.map((tip, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-amber-800">
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              <div id="common-mistakes" className="bg-red-50 rounded-xl border border-red-100 p-6" data-testid="section-common-mistakes">
                <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Common Mistakes to Avoid
                </h2>
                <ul className="space-y-2">
                  {guide.commonMistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                      <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div id="best-practices" className="bg-green-50 rounded-xl border border-green-100 p-6" data-testid="section-best-practices">
                <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Best Practices
                </h2>
                <ul className="space-y-2">
                  {guide.bestPractices.map((practice, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {guide.practiceScenarios.length > 0 && (
                <div id="practice" data-testid="section-practice-scenarios">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.clinicalSkillsGuide.practiceScenarios2")}</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Test your understanding with these clinical scenarios. Select the best answer and check your reasoning.
                  </p>
                  <div className="space-y-4">
                    {guide.practiceScenarios.map((scenario, i) => (
                      <PracticeScenario key={i} scenario={scenario} index={i} />
                    ))}
                  </div>
                </div>
              )}

              <div id="faq" className="space-y-4" data-testid="section-faq">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.clinicalSkillsGuide.frequentlyAskedQuestions")}</h2>
                {guide.faqs.map((faq, i) => (
                  <details key={i} className="bg-white rounded-xl p-4 border border-gray-200 group" data-testid={`faq-${i}`}>
                    <summary className="font-semibold text-sm text-gray-900 cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                    </summary>
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>

              {guide.externalReferences.length > 0 && (
                <div className="text-xs text-gray-500" data-testid="section-references">
                  <h3 className="font-semibold text-gray-700 mb-2">{t("pages.clinicalSkillsGuide.references")}</h3>
                  <ul className="space-y-1">
                    {guide.externalReferences.map((ref, i) => (
                      <li key={i}>
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 inline-flex items-center gap-1" data-testid={`link-reference-${i}`}>
                          {ref.title} <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <TableOfContents guide={guide} />
            </div>
          </div>
        </div>
      </section>

      {relatedGuides.length > 0 && (
        <section className="py-12 bg-gray-50" data-testid="section-related-guides">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t("pages.clinicalSkillsGuide.relatedClinicalSkillsGuides")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedGuides.map(related => (
                <Card
                  key={related.slug}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setLocation(`/clinical-skills/${related.slug}`)}
                  data-testid={`card-related-${related.slug}`}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{related.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{related.overview}</p>
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <span>{t("pages.clinicalSkillsGuide.readGuide")}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/clinical-skills" data-testid="link-browse-all">
                <Button variant="outline" className="text-sm">
                  Browse All Clinical Skills Guides <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-white border-t" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pages.clinicalSkillsGuide.readyToTestYourKnowledge")}</h2>
          <p className="text-sm text-gray-600 mb-6">{t("pages.clinicalSkillsGuide.practiceWithExamstyleQuestionsFlashcards")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/practice-questions" data-testid="link-cta-practice">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Practice Questions <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/flashcards" data-testid="link-cta-flashcards">
              <Button variant="outline">
                Study Flashcards
              </Button>
            </Link>
            <Link href="/lessons" data-testid="link-cta-lessons">
              <Button variant="outline">
                Browse Lessons
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
