import { useParams } from "wouter";
import { LocaleLink } from "@/lib/LocaleLink";
import { useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  getChecklistBySlug,
  getRelatedChecklists,
  type NursingSkillChecklist,
  type SafetyAlert,
} from "@/data/nursing-skill-checklists";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  GraduationCap,
  FileText,
  ExternalLink,
  Info,
  XCircle,
  Lightbulb,
  Star,
} from "lucide-react";

function SafetyAlertBox({ alert }: { alert: SafetyAlert }) {
  const styles = {
    danger: { bg: "bg-red-50 border-red-200", icon: <ShieldAlert className="w-5 h-5 text-red-600" />, title: "text-red-900", desc: "text-red-800" },
    warning: { bg: "bg-amber-50 border-amber-200", icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, title: "text-amber-900", desc: "text-amber-800" },
    info: { bg: "bg-blue-50 border-blue-200", icon: <Info className="w-5 h-5 text-blue-600" />, title: "text-blue-900", desc: "text-blue-800" },
  };
  const s = styles[alert.type];

  return (
    <div className={`rounded-xl border p-4 ${s.bg}`}>
      <div className="flex items-start gap-3">
        {s.icon}
        <div>
          <h4 className={`font-bold text-sm ${s.title}`}>{alert.title}</h4>
          <p className={`text-xs mt-1 leading-relaxed ${s.desc}`}>{alert.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function NursingSkillChecklistDetail() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const checklist = getChecklistBySlug(params.slug || "");

  if (!checklist) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center" data-testid="text-not-found">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("skillChecklists.notFound")}</h1>
            <p className="text-gray-500 mb-4">{t("skillChecklists.notFoundDesc")}</p>
            <LocaleLink href="/nursing-skill-checklists">
              <Button data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("skillChecklists.backToHub")}
              </Button>
            </LocaleLink>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedChecklists = getRelatedChecklists(checklist.slug);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": checklist.title,
    "description": checklist.overview.slice(0, 160),
    "url": `https://www.nursenest.ca/nursing-skill-checklists/${checklist.slug}`,
    "author": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "publisher": { "@type": "Organization", "name": "NurseNest Education Inc.", "url": "https://www.nursenest.ca" },
    "mainEntityOfPage": `https://www.nursenest.ca/nursing-skill-checklists/${checklist.slug}`,
  };

  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": checklist.title,
    "description": checklist.overview,
    "totalTime": `PT${parseInt(checklist.estimatedTime) || 30}M`,
    "supply": checklist.equipmentNeeded.map(item => ({ "@type": "HowToSupply", "name": item })),
    "step": checklist.steps.map(step => ({
      "@type": "HowToStep",
      "position": step.stepNumber,
      "name": step.title,
      "text": step.description,
    })),
  };

  return (
    <>
      <SEO
        title={`${checklist.shortTitle} Checklist – Step-by-Step Nursing Procedure Guide`}
        description={checklist.overview.slice(0, 160)}
        keywords={`${checklist.shortTitle} procedure, ${checklist.shortTitle} checklist, nursing skill, clinical procedure, NCLEX, ${checklist.category.toLowerCase()}`}
        canonicalPath={`/nursing-skill-checklists/${checklist.slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={[
          buildFaqStructuredData(checklist.faqs),
          howToStructuredData,
        ]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Skill Checklists", url: "https://www.nursenest.ca/nursing-skill-checklists" },
          { name: checklist.shortTitle, url: `https://www.nursenest.ca/nursing-skill-checklists/${checklist.slug}` },
        ]}
      />
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <section className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white border-b" data-testid="section-hero">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav
              items={[
                { name: "Home", url: "https://www.nursenest.ca/" },
                { name: t("skillChecklists.breadcrumb"), url: "https://www.nursenest.ca/nursing-skill-checklists" },
                { name: checklist.shortTitle, url: `https://www.nursenest.ca/nursing-skill-checklists/${checklist.slug}` },
              ]}
            />
            <div className="mt-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-700 text-xs">{checklist.category}</Badge>
                <Badge className={`text-xs capitalize ${checklist.difficulty === "beginner" ? "bg-green-100 text-green-700" : checklist.difficulty === "intermediate" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                  {checklist.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />{checklist.estimatedTime}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-checklist-title">
                {checklist.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl" data-testid="text-checklist-overview">
                {checklist.overview}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            <div className="space-y-8">
              {checklist.safetyAlerts.length > 0 && (
                <div className="space-y-3" data-testid="section-safety-alerts">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    {t("skillChecklists.safetyAlerts")}
                  </h2>
                  {checklist.safetyAlerts.map((alert, i) => (
                    <SafetyAlertBox key={i} alert={alert} />
                  ))}
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="section-indications">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t("skillChecklists.indications")}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-2">{t("skillChecklists.indicationsLabel")}</h3>
                    <ul className="space-y-1.5">
                      {checklist.indications.map((ind, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-red-700 mb-2">{t("skillChecklists.contraindications")}</h3>
                    <ul className="space-y-1.5">
                      {checklist.contraindications.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <XCircle className="w-3.5 h-3.5 mt-0.5 text-red-400 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="section-equipment">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{t("skillChecklists.equipmentNeeded")}</h2>
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {checklist.equipmentNeeded.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div data-testid="section-steps">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("skillChecklists.stepByStep")}</h2>
                <div className="space-y-4">
                  {checklist.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className={`bg-white rounded-xl border p-5 ${step.criticalPoint ? "border-red-200 ring-1 ring-red-100" : "border-gray-200"}`}
                      data-testid={`step-${step.stepNumber}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.criticalPoint ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                          <span className="text-xs font-bold">{step.stepNumber}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 text-sm">{step.title}</h3>
                            {step.criticalPoint && (
                              <Badge className="bg-red-100 text-red-700 text-[10px]">
                                <AlertTriangle className="w-2.5 h-2.5 mr-0.5" /> Critical
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">{step.description}</p>
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                            <h4 className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" /> Rationale
                            </h4>
                            <p className="text-xs text-blue-700 leading-relaxed">{step.rationale}</p>
                          </div>
                          {step.tips && step.tips.length > 0 && (
                            <div className="mt-3 bg-amber-50 rounded-lg p-3 border border-amber-100">
                              <h4 className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                                <Star className="w-3 h-3" /> Clinical Tips
                              </h4>
                              <ul className="space-y-1">
                                {step.tips.map((tip, j) => (
                                  <li key={j} className="flex items-start gap-2 text-xs text-amber-800">
                                    <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="section-complications">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{t("skillChecklists.complications")}</h2>
                <ul className="space-y-1.5">
                  {checklist.complications.map((comp, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 text-amber-500 flex-shrink-0" />
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="section-documentation">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{t("skillChecklists.documentation")}</h2>
                <ul className="space-y-1.5">
                  {checklist.documentationRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <FileText className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6" data-testid="section-exam-notes">
                <h2 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  {t("skillChecklists.examNotes")}
                </h2>
                <ul className="space-y-2">
                  {checklist.examNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3" data-testid="section-faq">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("skillChecklists.faqTitle")}</h2>
                {checklist.faqs.map((faq, i) => (
                  <details key={i} className="bg-white rounded-xl p-4 border border-gray-200 group" data-testid={`faq-${i}`}>
                    <summary className="font-semibold text-sm text-gray-900 cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                    </summary>
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>

              {checklist.references.length > 0 && (
                <div className="text-xs text-gray-500" data-testid="section-references">
                  <h3 className="font-semibold text-gray-700 mb-2">{t("skillChecklists.references")}</h3>
                  <ul className="space-y-1">
                    {checklist.references.map((ref, i) => (
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
              <div className="sticky top-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-gray-900 mb-3">{t("skillChecklists.inThisGuide")}</h3>
                    <nav className="space-y-1">
                      <a href="#section-safety-alerts" className="block text-xs text-gray-600 hover:text-blue-600 py-1">{t("skillChecklists.safetyAlerts")}</a>
                      <a href="#section-indications" className="block text-xs text-gray-600 hover:text-blue-600 py-1">{t("skillChecklists.indications")}</a>
                      <a href="#section-equipment" className="block text-xs text-gray-600 hover:text-blue-600 py-1">{t("skillChecklists.equipmentNeeded")}</a>
                      <a href="#section-steps" className="block text-xs text-gray-600 hover:text-blue-600 py-1">{t("skillChecklists.stepByStep")}</a>
                      <a href="#section-complications" className="block text-xs text-gray-600 hover:text-blue-600 py-1">{t("skillChecklists.complications")}</a>
                      <a href="#section-documentation" className="block text-xs text-gray-600 hover:text-blue-600 py-1">{t("skillChecklists.documentation")}</a>
                      <a href="#section-exam-notes" className="block text-xs text-gray-600 hover:text-blue-600 py-1">{t("skillChecklists.examNotes")}</a>
                      <a href="#section-faq" className="block text-xs text-gray-600 hover:text-blue-600 py-1">{t("skillChecklists.faqTitle")}</a>
                    </nav>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">{t("pages.nursingSkillChecklistDetail.details")}</h4>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{checklist.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ClipboardCheck className="w-3 h-3 text-gray-400" />
                          <span>{checklist.steps.length} steps</span>
                        </div>
                        <div className="flex items-center gap-1.5 capitalize">
                          <GraduationCap className="w-3 h-3 text-gray-400" />
                          <span>{checklist.difficulty} level</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {relatedChecklists.length > 0 && (
          <section className="py-12 bg-gray-50 border-t" data-testid="section-related-checklists">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t("skillChecklists.relatedChecklists")}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedChecklists.map(related => (
                  <Card
                    key={related.slug}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation(`/nursing-skill-checklists/${related.slug}`)}
                    data-testid={`card-related-${related.slug}`}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{related.shortTitle}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{related.overview.slice(0, 100)}</p>
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <span>{t("pages.nursingSkillChecklistDetail.viewChecklist")}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 bg-white border-t" data-testid="section-cta">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("skillChecklists.ctaTitle")}</h2>
            <p className="text-sm text-gray-600 mb-6">{t("skillChecklists.ctaDesc")}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <LocaleLink href="/practice-questions">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-cta-practice">
                  {t("skillChecklists.ctaPractice")} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/flashcards">
                <Button variant="outline" data-testid="button-cta-flashcards">{t("skillChecklists.ctaFlashcards")}</Button>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
