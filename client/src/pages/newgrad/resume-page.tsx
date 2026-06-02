import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA, PremiumContentGate, useNewGradAccess } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import {
  RESUME_BULLET_BANK,
  COVER_LETTER_BANK,
  PERSONAL_STATEMENT_BANK,
} from "@/data/newgrad/premium-toolkit";
import {
  ChevronRight, ChevronDown, ArrowRight, FileText, Lock, CheckCircle2,
  Download, Eye, Sparkles, Copy, Lightbulb, PenTool, GraduationCap
} from "lucide-react";

const totalBullets = RESUME_BULLET_BANK.reduce((sum, cat) => sum + cat.bullets.length, 0);
const totalCoverLetters = COVER_LETTER_BANK.length;
const totalStatements = PERSONAL_STATEMENT_BANK.length;

export default function ResumePage() {
  const { hasAccess } = useNewGradAccess();
  const { t } = useI18n();
  const [expandedBulletCat, setExpandedBulletCat] = useState<string | null>(null);
  const [expandedCoverLetter, setExpandedCoverLetter] = useState<string | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [copiedBullet, setCopiedBullet] = useState<string | null>(null);

  const RESUME_TIPS = [
    { title: t("newGrad.resume.tip1Title"), desc: t("newGrad.resume.tip1Desc") },
    { title: t("newGrad.resume.tip2Title"), desc: t("newGrad.resume.tip2Desc") },
    { title: t("newGrad.resume.tip3Title"), desc: t("newGrad.resume.tip3Desc") },
    { title: t("newGrad.resume.tip4Title"), desc: t("newGrad.resume.tip4Desc") },
    { title: t("newGrad.resume.tip5Title"), desc: t("newGrad.resume.tip5Desc") },
    { title: t("newGrad.resume.tip6Title"), desc: t("newGrad.resume.tip6Desc") },
  ];

  const TEMPLATE_TYPES = [
    { type: "resume", title: t("newGrad.resume.templateResume"), desc: t("newGrad.resume.templateResumeDesc"), count: "8+" },
    { type: "cover-letter", title: t("newGrad.resume.templateCoverLetter"), desc: t("newGrad.resume.templateCoverLetterDesc"), count: "5+" },
    { type: "portfolio", title: t("newGrad.resume.templatePortfolio"), desc: t("newGrad.resume.templatePortfolioDesc"), count: "3+" },
  ];

  const { data: templates = [] } = useQuery({
    queryKey: ["/api/newgrad/templates", "resume"],
    queryFn: async () => {
      const res = await fetch("/api/newgrad/templates?type=resume");
      return res.ok ? res.json() : [];
    },
  });

  function copyBullet(bullet: string) {
    navigator.clipboard.writeText(bullet).catch(() => {});
    setCopiedBullet(bullet);
    setTimeout(() => setCopiedBullet(null), 2000);
  }

  return (
    <div data-testid="newgrad-resume-page">
      <Navigation />
      <SEO
        title={t("newGrad.resume.seoTitle")}
        description={t("newGrad.resume.seoDescription")}
        keywords="new grad nurse resume, nursing resume template, nurse cover letter, ATS resume nursing, new graduate nurse resume tips, nursing portfolio, personal statement nursing, nursing scholarship essay"
        canonicalPath="/newgrad/resume"
        breadcrumbs={[
          { name: t("newGrad.common.home"), url: "https://www.nursenest.ca" },
          { name: t("newGrad.common.newGradCareerHub"), url: "https://www.nursenest.ca/newgrad" },
          { name: t("newGrad.resume.badge"), url: "https://www.nursenest.ca/newgrad/resume" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50/30 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("newGrad.common.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("newGrad.common.newGradCareerHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-pink-700 font-medium">{t("newGrad.resume.badge")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-pink-100 text-pink-700">
            <FileText className="w-4 h-4" /> {t("newGrad.resume.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-title">
            {t("newGrad.resume.title")}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t("newGrad.resume.subtitle")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-pink-100 p-3 text-center" data-testid="stat-bullets">
              <div className="text-xl font-bold text-pink-700">{totalBullets}+</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.resumePage.resumeBullets")}</div>
            </div>
            <div className="bg-white rounded-xl border border-pink-100 p-3 text-center" data-testid="stat-cover-letters">
              <div className="text-xl font-bold text-pink-700">{totalCoverLetters}</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.resumePage.coverLetterExamples")}</div>
            </div>
            <div className="bg-white rounded-xl border border-pink-100 p-3 text-center" data-testid="stat-statements">
              <div className="text-xl font-bold text-pink-700">{totalStatements}</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.resumePage.statementPrompts")}</div>
            </div>
            <div className="bg-white rounded-xl border border-pink-100 p-3 text-center" data-testid="stat-templates">
              <div className="text-xl font-bold text-pink-700">16+</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.resumePage.templates")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-resume-tips">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">{t("newGrad.resume.freeTipsTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESUME_TIPS.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-all" data-testid={`tip-${i}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-500">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" id="bullet-bank" data-testid="section-bullet-bank">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Copy className="w-5 h-5 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-900">{t("pages.newgrad.resumePage.resumeBulletBank")}</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {totalBullets}+ copy-paste resume bullets organized by category. Click any bullet to copy it to your clipboard.
          </p>
          <div className="space-y-3">
            {RESUME_BULLET_BANK.map((cat) => {
              const isExpanded = expandedBulletCat === cat.id;
              return (
                <div key={cat.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`bullet-category-${cat.id}`}>
                  <button
                    onClick={() => setExpandedBulletCat(isExpanded ? null : cat.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    data-testid={`button-bullet-${cat.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-pink-500" />
                      <div>
                        <span className="font-medium text-gray-900">{cat.category}</span>
                        <span className="text-xs text-gray-400 ml-2">({cat.bullets.length} bullets)</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-2">
                      {cat.bullets.map((bullet, j) => (
                        <div
                          key={j}
                          onClick={() => copyBullet(bullet)}
                          className="group flex items-start gap-2 p-3 rounded-lg hover:bg-pink-50 cursor-pointer transition-colors"
                          data-testid={`bullet-${cat.id}-${j}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0" />
                          <span className="text-sm text-gray-700 flex-1">{bullet}</span>
                          <span className="text-xs text-pink-500 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity">
                            {copiedBullet === bullet ? "Copied!" : "Click to copy"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16" id="cover-letters" data-testid="section-cover-letters">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <PenTool className="w-5 h-5 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-900">{t("pages.newgrad.resumePage.coverLetterExampleBank")}</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {totalCoverLetters} specialty-specific cover letter examples with customizable frameworks. Each includes key elements to include and adapt for your application.
          </p>
          <div className="space-y-3">
            {COVER_LETTER_BANK.slice(0, 2).map((letter) => {
              const isExpanded = expandedCoverLetter === letter.id;
              return (
                <div key={letter.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`cover-letter-${letter.id}`}>
                  <button
                    onClick={() => setExpandedCoverLetter(isExpanded ? null : letter.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    data-testid={`button-cover-letter-${letter.id}`}
                  >
                    <div>
                      <span className="font-medium text-gray-900">{letter.title}</span>
                      <span className="text-xs text-gray-400 ml-2">({letter.targetUnit})</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-4">
                      <pre className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">{letter.content}</pre>
                      <div className="bg-pink-50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-pink-800 mb-2 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" /> Key Elements
                        </h4>
                        <ul className="space-y-1">
                          {letter.keyElements.map((elem, j) => (
                            <li key={j} className="text-sm text-pink-700 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              {elem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {COVER_LETTER_BANK.length > 2 && (
            <PremiumContentGate requiredEntitlement="toolkit" previewContent={
              <div className="space-y-3 mt-4">
                {COVER_LETTER_BANK.slice(2).map((letter) => (
                  <div key={letter.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 opacity-60" data-testid={`preview-cover-letter-${letter.id}`}>
                    <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600">{letter.title} ({letter.targetUnit})</span>
                  </div>
                ))}
              </div>
            }>
              <div className="space-y-3 mt-4">
                {COVER_LETTER_BANK.slice(2).map((letter) => {
                  const isExpanded = expandedCoverLetter === letter.id;
                  return (
                    <div key={letter.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`cover-letter-premium-${letter.id}`}>
                      <button
                        onClick={() => setExpandedCoverLetter(isExpanded ? null : letter.id)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <span className="font-medium text-gray-900">{letter.title}</span>
                          <span className="text-xs text-gray-400 ml-2">({letter.targetUnit})</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-4">
                          <pre className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">{letter.content}</pre>
                          <div className="bg-pink-50 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-pink-800 mb-2">{t("pages.newgrad.resumePage.keyElements")}</h4>
                            <ul className="space-y-1">
                              {letter.keyElements.map((elem, j) => (
                                <li key={j} className="text-sm text-pink-700 flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                  {elem}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </PremiumContentGate>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50" id="personal-statements" data-testid="section-personal-statements">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-900">{t("pages.newgrad.resumePage.personalStatementScholarshipPromptBank")}</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {totalStatements} personal statement prompts for nursing school applications, scholarship essays, and graduate program admissions. Each includes writing tips and a sample opening.
          </p>
          <div className="space-y-3">
            {PERSONAL_STATEMENT_BANK.slice(0, 3).map((prompt) => {
              const isExpanded = expandedPrompt === prompt.id;
              return (
                <div key={prompt.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`prompt-${prompt.id}`}>
                  <button
                    onClick={() => setExpandedPrompt(isExpanded ? null : prompt.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    data-testid={`button-prompt-${prompt.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 font-medium mr-2">{prompt.category}</span>
                      <span className="font-medium text-gray-900">{prompt.title}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("pages.newgrad.resumePage.prompt")}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{prompt.prompt}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" /> Writing Tips
                        </h4>
                        <ul className="space-y-1">
                          {prompt.tips.map((tip, j) => (
                            <li key={j} className="text-sm text-amber-700 flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">{t("pages.newgrad.resumePage.sampleOpening")}</h4>
                        <p className="text-sm text-blue-700 italic leading-relaxed">{prompt.sampleOpener}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {PERSONAL_STATEMENT_BANK.length > 3 && (
            <PremiumContentGate requiredEntitlement="toolkit" previewContent={
              <div className="space-y-3 mt-4">
                {PERSONAL_STATEMENT_BANK.slice(3).map((prompt) => (
                  <div key={prompt.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 opacity-60" data-testid={`preview-prompt-${prompt.id}`}>
                    <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600">{prompt.title} ({prompt.category})</span>
                  </div>
                ))}
              </div>
            }>
              <div className="space-y-3 mt-4">
                {PERSONAL_STATEMENT_BANK.slice(3).map((prompt) => {
                  const isExpanded = expandedPrompt === prompt.id;
                  return (
                    <div key={prompt.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`prompt-premium-${prompt.id}`}>
                      <button
                        onClick={() => setExpandedPrompt(isExpanded ? null : prompt.id)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 font-medium mr-2">{prompt.category}</span>
                          <span className="font-medium text-gray-900">{prompt.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-4">
                          <p className="text-sm text-gray-600">{prompt.prompt}</p>
                          <div className="bg-amber-50 rounded-lg p-3">
                            <ul className="space-y-1">
                              {prompt.tips.map((tip, j) => (
                                <li key={j} className="text-sm text-amber-700 flex items-start gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-blue-800 mb-2">{t("pages.newgrad.resumePage.sampleOpening2")}</h4>
                            <p className="text-sm text-blue-700 italic">{prompt.sampleOpener}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </PremiumContentGate>
          )}
        </div>
      </section>

      <section className="py-16" data-testid="section-templates">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Download className="w-5 h-5 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-900">{t("newGrad.resume.templatesTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {TEMPLATE_TYPES.map((tmpl, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 text-center" data-testid={`template-type-${tmpl.type}`}>
                <div className="text-2xl font-bold text-pink-700 mb-1">{tmpl.count}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{tmpl.title}</h3>
                <p className="text-xs text-gray-500">{tmpl.desc}</p>
              </div>
            ))}
          </div>
          {templates.length > 0 ? (
            <div className="space-y-3">
              {templates.map((template: any, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between" data-testid={`template-${i}`}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-pink-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">{template.title}</h3>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  </div>
                  {hasAccess || !template.is_premium ? (
                    <a href={template.download_url} className="inline-flex items-center gap-1 px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors" data-testid={`button-download-${i}`}>
                      <Download className="w-4 h-4" /> Download
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-400 rounded-lg text-sm">
                      <Lock className="w-4 h-4" /> Premium
                    </span>
                  )}
                </div>
              ))}
              <PremiumUpgradeCTA requiredEntitlement="toolkit" context="Unlock all resume templates, cover letter frameworks, and portfolio templates. Each template is ATS-tested and designed specifically for new graduate nurses." />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{t("newGrad.resume.templatesPreparing")}</p>
          )}
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-pink-50 to-rose-50" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("newGrad.resume.completeToolkit")}</h2>
          <p className="text-sm text-gray-500 mb-4">
            {t("newGrad.resume.applynestNote")} <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="text-pink-700 font-semibold hover:underline" data-testid="link-applynest-resume">{t("newGrad.resume.applynestLink")}</a>.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-pink-700 rounded-xl font-semibold hover:bg-pink-50 transition-colors border border-pink-200" data-testid="link-interview">
              {t("newGrad.common.interviewPrep")}
            </Link>
            <Link href="/newgrad/scenarios" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-pink-700 rounded-xl font-semibold hover:bg-pink-50 transition-colors border border-pink-200" data-testid="link-scenarios">
              Workplace Scenarios
            </Link>
            <Link href="/newgrad/salary" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-pink-700 rounded-xl font-semibold hover:bg-pink-50 transition-colors border border-pink-200" data-testid="link-salary">
              {t("newGrad.common.salaryNegotiation")}
            </Link>
            <Link href="/newgrad/certifications" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-pink-700 rounded-xl font-semibold hover:bg-pink-50 transition-colors border border-pink-200" data-testid="link-certifications">
              {t("newGrad.common.certifications")}
            </Link>
            <Link href="/newgrad/clinical-references" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-pink-700 rounded-xl font-semibold hover:bg-pink-50 transition-colors border border-pink-200" data-testid="link-clinical-refs">
              {t("newGrad.common.clinicalReferences")}
            </Link>
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors" data-testid="link-hub">
              {t("newGrad.common.careerHub")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
