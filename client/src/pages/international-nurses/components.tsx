import { useState } from "react";
import { ChevronDown, ChevronRight, ArrowRight, BookOpen, CheckCircle, Globe, FileText, AlertTriangle, Star, MapPin, Clock, DollarSign, GraduationCap, Briefcase, Shield, Users } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface BreadcrumbItem {
  label: string;
  href: string;
}

export function IntlBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t("pages.internationalNurses.components.breadcrumb")} className="max-w-5xl mx-auto px-4 pt-4 text-sm text-gray-500" data-testid="breadcrumbs">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-300">/</span>}
            {i < items.length - 1 ? (
              <a href={item.href} className="hover:text-teal-600 transition-colors" data-testid={`breadcrumb-${i}`}>{item.label}</a>
            ) : (
              <span className="text-gray-700 font-medium" data-testid={`breadcrumb-${i}`}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function IntlHero({ title, subtitle, flag, badges }: { title: string; subtitle?: string; flag?: string; badges?: string[] }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 border-b border-gray-100 py-12 px-4" data-testid="intl-hero">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          {flag && <span className="text-4xl" data-testid="text-country-flag">{flag}</span>}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-page-title">{title}</h1>
        </div>
        {subtitle && <p className="text-lg text-gray-600 max-w-3xl" data-testid="text-page-subtitle">{subtitle}</p>}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.map((badge, i) => (
              <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700" data-testid={`badge-${i}`}>{badge}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionRenderer({ sections }: { sections: { heading: string; content: string; bullets?: string[] }[] }) {
  if (!sections || sections.length === 0) return null;
  return (
    <div className="space-y-8">
      {sections.map((section, i) => (
        <div key={i} data-testid={`section-${i}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
          <p className="text-gray-700 leading-relaxed mb-3">{section.content}</p>
          {section.bullets && (
            <ul className="list-disc pl-5 space-y-1.5 text-gray-700 text-sm">
              {section.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function FAQSection({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!items || items.length === 0) return null;
  return (
    <div className="my-10" data-testid="faq-section">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">{t("pages.internationalNurses.components.frequentlyAskedQuestions")}</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
              data-testid={`faq-toggle-${i}`}
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              {openIndex === i ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 ml-2" />}
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-gray-700 leading-relaxed border-t border-gray-100" data-testid={`faq-answer-${i}`}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CountryGrid({ countries }: { countries: { slug: string; name: string; flag: string; averageSalary: string; registrationTimeline: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8" data-testid="country-grid">
      {countries.map((c) => (
        <a
          key={c.slug}
          href={`/international-nurses/${c.slug}`}
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all group"
          data-testid={`country-card-${c.slug}`}
        >
          <div className="text-3xl mb-2">{c.flag}</div>
          <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{c.name}</h3>
          <div className="mt-2 space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{c.averageSalary}</div>
            <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.registrationTimeline}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

export function MigrationGrid({ pathways }: { pathways: { slug: string; sourceCountry: string; destinationCountry: string; estimatedTimeline: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8" data-testid="migration-grid">
      {pathways.map((p) => (
        <a
          key={p.slug}
          href={`/international-nurses/${p.slug}`}
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
          data-testid={`migration-card-${p.slug}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">{p.sourceCountry} → {p.destinationCountry}</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{p.estimatedTimeline}</div>
        </a>
      ))}
    </div>
  );
}

export function ComparisonGrid({ comparisons }: { comparisons: { slug: string; countryA: string; countryB: string; title: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8" data-testid="comparison-grid">
      {comparisons.map((c) => (
        <a
          key={c.slug}
          href={`/international-nurses/${c.slug}`}
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all group"
          data-testid={`comparison-card-${c.slug}`}
        >
          <div className="text-sm font-semibold text-purple-700 mb-1">{c.countryA} vs {c.countryB}</div>
          <p className="text-xs text-gray-500">{t("pages.internationalNurses.components.sidebysideComparisonOfLicensingSalary")}</p>
        </a>
      ))}
    </div>
  );
}

export function ComparisonTable({ countryA, countryB, points }: { countryA: string; countryB: string; points: { aspect: string; valueA: string; valueB: string }[] }) {
  if (!points || points.length === 0) return null;
  return (
    <div className="overflow-x-auto my-8" data-testid="comparison-table">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b">{t("pages.internationalNurses.components.aspect")}</th>
            <th className="text-left px-4 py-3 font-semibold text-teal-700 border-b">{countryA}</th>
            <th className="text-left px-4 py-3 font-semibold text-purple-700 border-b">{countryB}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-3 font-medium text-gray-900 border-b">{p.aspect}</td>
              <td className="px-4 py-3 text-gray-700 border-b">{p.valueA}</td>
              <td className="px-4 py-3 text-gray-700 border-b">{p.valueB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StepTimeline({ steps }: { steps: { stepNumber: number; title: string; description: string; timeline?: string }[] }) {
  return (
    <div className="my-8 space-y-4" data-testid="step-timeline">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.internationalNurses.components.stepbystepProcess")}</h2>
      {steps.map((step) => (
        <div key={step.stepNumber} className="flex gap-4 items-start" data-testid={`step-${step.stepNumber}`}>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
            {step.stepNumber}
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">{step.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{step.description}</p>
            {step.timeline && (
              <div className="mt-2 text-xs text-teal-600 font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{step.timeline}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DocumentChecklist({ documents }: { documents: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  if (!documents || documents.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 my-8" data-testid="document-checklist">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-teal-600" />{t("pages.internationalNurses.components.requiredDocuments")}</h2>
      <div className="space-y-2">
        {documents.map((doc, i) => (
          <label key={i} className="flex items-center gap-3 cursor-pointer group" data-testid={`document-${i}`}>
            <button
              onClick={() => {
                const next = new Set(checked);
                next.has(i) ? next.delete(i) : next.add(i);
                setChecked(next);
              }}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checked.has(i) ? "bg-teal-600 border-teal-600 text-white" : "border-gray-300 group-hover:border-teal-400"}`}
              data-testid={`checkbox-document-${i}`}
            >
              {checked.has(i) && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
            <span className={`text-sm ${checked.has(i) ? "text-gray-400 line-through" : "text-gray-700"}`}>{doc}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">{checked.size}/{documents.length} documents checked</div>
    </div>
  );
}

export function CommonMistakes({ mistakes }: { mistakes: string[] }) {
  if (!mistakes || mistakes.length === 0) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8" data-testid="common-mistakes">
      <h2 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{t("pages.internationalNurses.components.commonMistakesToAvoid")}</h2>
      <ul className="space-y-2">
        {mistakes.map((m, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-red-800">
            <span className="text-red-400 mt-0.5">✕</span>
            <span>{m}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PrepTips({ tips }: { tips: string[] }) {
  if (!tips || tips.length === 0) return null;
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8" data-testid="prep-tips">
      <h2 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2"><GraduationCap className="w-5 h-5" />{t("pages.internationalNurses.components.preparationTips")}</h2>
      <ul className="space-y-2">
        {tips.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-green-800">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InfoCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5" data-testid={`info-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
            <span className="text-teal-500 mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ConversionCTA({ title, description, ctaText, ctaHref, variant = "primary" }: {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  variant?: "primary" | "secondary";
}) {
  const bg = variant === "primary" ? "bg-gradient-to-r from-teal-600 to-teal-700" : "bg-gradient-to-r from-blue-600 to-blue-700";
  return (
    <div className={`${bg} rounded-2xl p-8 my-10 text-center`} data-testid="conversion-cta">
      <h3 className="text-xl font-bold text-white mb-2">{title || "Start Your International Nursing Journey"}</h3>
      <p className="text-teal-100 text-sm mb-5 max-w-lg mx-auto">{description || "Join thousands of international nurses using NurseNest to prepare for their licensing exams and build their nursing careers abroad."}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a href={ctaHref || "/question-bank"} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors" data-testid="button-cta-primary">
          {ctaText || "Start Exam Prep"} <ArrowRight className="w-4 h-4" />
        </a>
        <a href="/international-nurses" className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent border border-white/30 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors" data-testid="button-cta-secondary">
          Explore Licensing Guides
        </a>
      </div>
    </div>
  );
}

export function RelatedLinks({ links }: { links: { title: string; href: string }[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="bg-gray-50 rounded-xl p-6 my-8" data-testid="related-links">
      <h3 className="font-semibold text-gray-900 mb-3">{t("pages.internationalNurses.components.relatedGuides")}</h3>
      <div className="space-y-2">
        {links.map((link, i) => (
          <a key={i} href={link.href} className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600 transition-colors" data-testid={`related-link-${i}`}>
            <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export function TrustBlock() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 my-8" data-testid="trust-block">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{t("pages.internationalNurses.components.whoThisGuideIsFor")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900">{t("pages.internationalNurses.components.internationallyEducatedNurses")}</h4>
            <p className="text-gray-600">{t("pages.internationalNurses.components.nursesWithQualificationsFromAny")}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900">{t("pages.internationalNurses.components.nursingStudentsPlanningAhead")}</h4>
            <p className="text-gray-600">{t("pages.internationalNurses.components.studentsResearchingInternationalNursingCareer")}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Briefcase className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900">{t("pages.internationalNurses.components.nursesSeekingBetterOpportunities")}</h4>
            <p className="text-gray-600">{t("pages.internationalNurses.components.experiencedNursesLookingForHigher")}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900">{t("pages.internationalNurses.components.healthcareEmployers")}</h4>
            <p className="text-gray-600">{t("pages.internationalNurses.components.organizationsLookingToUnderstandThe")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CountryQuickFacts({ regulatoryBody, requiredExams, languageTests, registrationTimeline, averageSalary }: {
  regulatoryBody: string;
  requiredExams: string[];
  languageTests: string[];
  registrationTimeline: string;
  averageSalary: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8" data-testid="quick-facts">
      <InfoCard icon={<Shield className="w-5 h-5 text-blue-600" />} title={t("pages.internationalNurses.components.regulatoryBody")} items={[regulatoryBody]} />
      <InfoCard icon={<GraduationCap className="w-5 h-5 text-purple-600" />} title={t("pages.internationalNurses.components.requiredExams")} items={requiredExams} />
      <InfoCard icon={<BookOpen className="w-5 h-5 text-green-600" />} title={t("pages.internationalNurses.components.languageTests")} items={languageTests} />
      <InfoCard icon={<DollarSign className="w-5 h-5 text-amber-600" />} title={t("pages.internationalNurses.components.salaryTimeline")} items={[`Salary: ${averageSalary}`, `Timeline: ${registrationTimeline}`]} />
    </div>
  );
}

export function ClusterPageGrid({ pages }: { pages: { slug: string; title: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-8" data-testid="cluster-grid">
      {pages.map((p) => (
        <a
          key={p.slug}
          href={`/international-nurses/${p.slug}`}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 hover:shadow-sm transition-all"
          data-testid={`cluster-link-${p.slug}`}
        >
          <BookOpen className="w-4 h-4 text-teal-500 shrink-0" />
          <span className="text-sm font-medium text-gray-900">{p.title}</span>
        </a>
      ))}
    </div>
  );
}

export function ExamPageGrid({ pages }: { pages: { slug: string; title: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-8" data-testid="exam-grid">
      {pages.map((p) => (
        <a
          key={p.slug}
          href={`/${p.slug}`}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all"
          data-testid={`exam-link-${p.slug}`}
        >
          <GraduationCap className="w-4 h-4 text-purple-500 shrink-0" />
          <span className="text-sm font-medium text-gray-900">{p.title}</span>
        </a>
      ))}
    </div>
  );
}

export function buildJsonLd(type: "hub" | "country" | "migration" | "comparison" | "cluster" | "exam", data: any, breadcrumbs: BreadcrumbItem[]) {
  const schemas: Record<string, any>[] = [];
  const domain = "https://www.nursenest.ca";

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: `${domain}${b.href}`,
    })),
  });

  if (type === "hub" || type === "cluster" || type === "exam" || type === "country") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.metaTitle || data.title,
      description: data.metaDescription || "",
      publisher: { "@type": "Organization", name: "NurseNest", url: domain },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${domain}${breadcrumbs[breadcrumbs.length - 1]?.href || ""}` },
    });
  }

  if (type === "migration") {
    const steps = data.steps || [];
    if (steps.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: data.title,
        description: data.metaDescription || "",
        totalTime: data.estimatedTimeline ? `P${data.estimatedTimeline}` : undefined,
        step: steps.map((s: any) => ({
          "@type": "HowToStep",
          position: s.stepNumber,
          name: s.title,
          text: s.description,
        })),
      });
    }
  }

  const faq = data.faq || [];
  if (faq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f: any) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return schemas;
}
