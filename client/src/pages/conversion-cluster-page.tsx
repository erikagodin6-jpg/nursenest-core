import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRightLeft,
  Calculator,
  FlaskConical,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Stethoscope,
  GraduationCap,
  RotateCcw,
  AlertTriangle,
  Heart,
  Table2,
} from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import {
  conversionEntries,
  convertValue,
  formatResult,
  type ConversionEntry,
  type ConversionDirection,
} from "@/lib/unit-conversions";
import type { ClusterPageData } from "@/data/conversion-cluster-data";

import { useI18n } from "@/lib/i18n";
function MiniConverter({ entry }: { entry: ConversionEntry }) {
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState("");
  const [direction, setDirection] = useState<ConversionDirection>("si-to-conv");

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || inputValue.trim() === "") return null;
    const converted = convertValue(entry, val, direction);
    return formatResult(converted);
  }, [inputValue, direction, entry]);

  const fromUnit = direction === "si-to-conv" ? entry.siUnit : entry.conventionalUnit;
  const toUnit = direction === "si-to-conv" ? entry.conventionalUnit : entry.siUnit;
  const fromLabel = direction === "si-to-conv" ? "SI" : "Conventional";
  const toLabel = direction === "si-to-conv" ? "Conventional" : "SI";

  return (
    <Card className="border border-gray-200 hover:border-primary/30 transition-colors" data-testid={`card-mini-converter-${entry.id}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{entry.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-gray-500 hover:text-primary"
            onClick={() => { setDirection(d => d === "si-to-conv" ? "conv-to-si" : "si-to-conv"); setInputValue(""); }}
            data-testid={`button-swap-${entry.id}`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 mr-1" /> Swap
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <label htmlFor={`cluster-input-${entry.id}`} className="text-xs text-gray-500 mb-1 block">{fromLabel} ({fromUnit})</label>
            <Input
              id={`cluster-input-${entry.id}`}
              type="number"
              step="any"
              placeholder={`Enter ${fromUnit}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-9 text-sm"
              data-testid={`input-cluster-${entry.id}`}
            />
          </div>
          <ArrowRightLeft className="w-4 h-4 text-gray-300 mt-5 flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">{toLabel} ({toUnit})</label>
            <div
              className={`h-9 rounded-md border px-3 flex items-center text-sm font-medium ${result ? "bg-primary/5 border-primary/20 text-gray-900" : "bg-gray-50 border-gray-200 text-gray-400"}`}
              data-testid={`text-cluster-result-${entry.id}`}
            >
              {result ? <span>{result.rounded} {toUnit}</span> : "—"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {entry.formula && (
            <span className="text-[10px] text-gray-400">{entry.formula}</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] text-gray-400 hover:text-gray-600 ml-auto"
            onClick={() => setInputValue("")}
            data-testid={`button-clear-${entry.id}`}
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Reset
          </Button>
        </div>
        {(entry.siNormalRange || entry.conventionalNormalRange) && (
          <div className="mt-2 text-[11px] text-gray-500 flex flex-wrap gap-x-4">
            {entry.siNormalRange && <span>SI normal: {entry.siNormalRange} {entry.siUnit}</span>}
            {entry.conventionalNormalRange && <span>Conv. normal: {entry.conventionalNormalRange} {entry.conventionalUnit}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ConversionClusterPage({ data }: { data: ClusterPageData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const converterEntries = useMemo(() => {
    return data.converterIds
      .map(id => conversionEntries.find(e => e.id === id))
      .filter((e): e is ConversionEntry => !!e);
  }, [data.converterIds]);

  const medicalWebPageData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: data.title,
    description: data.metaDescription,
    url: `https://www.nursenest.ca/en/${data.slug}`,
    audience: { "@type": "MedicalAudience", audienceType: "Nursing Students" },
    about: [
      { "@type": "MedicalEntity", name: "Clinical Laboratory Techniques" },
      { "@type": "MedicalEntity", name: "Unit Conversion" },
    ],
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  const faqStructuredData = data.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  const breadcrumbs = [
    { name: "Home", url: "https://www.nursenest.ca/" },
    { name: "SI ↔ Conventional Converter", url: "https://www.nursenest.ca/si-to-conventional-units-converter" },
    { name: data.breadcrumbLabel, url: `https://www.nursenest.ca/${data.slug}` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)]">
      <SEO
        title={data.metaTitle.replace(" | NurseNest", "")}
        description={data.metaDescription}
        keywords={data.keywords}
        canonicalPath={`/${data.slug}`}
        structuredData={medicalWebPageData}
        additionalStructuredData={faqStructuredData ? [faqStructuredData] : undefined}
        breadcrumbs={breadcrumbs}
      />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav items={breadcrumbs} />

        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-cluster-page-title">
                {data.h1}
              </h1>
            </div>
          </div>
          <p className="text-gray-600 mt-3 leading-relaxed text-sm sm:text-base max-w-3xl" data-testid="text-cluster-hero-description">
            {data.heroDescription}
          </p>

          <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 hover:bg-primary/10 transition-colors mt-4">
            <GraduationCap className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{t("pages.conversionClusterPage.freeStudyToolForNursing")}</p>
              <p className="text-xs text-gray-500">{t("pages.conversionClusterPage.rpnRnNpNclexRexpn")}</p>
            </div>
          </div>
        </div>

        {converterEntries.length > 0 && (
          <section className="mb-10" data-testid="section-cluster-calculator">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Interactive Calculator
            </h2>
            <div className={`grid grid-cols-1 ${converterEntries.length > 1 ? "md:grid-cols-2" : ""} gap-4`}>
              {converterEntries.map(entry => (
                <MiniConverter key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-10 space-y-6" data-testid="section-cluster-educational">
          <Card className="border border-gray-200">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {data.sections.whatIsThis.heading}
              </h2>
              {data.sections.whatIsThis.paragraphs.map((p, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                {data.sections.whyItMatters.heading}
              </h2>
              <ul className="text-sm text-gray-600 space-y-3">
                {data.sections.whyItMatters.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>{item.bold}</strong> {item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                {data.sections.clinicalContext.heading}
              </h2>
              {data.sections.clinicalContext.paragraphs.map((p, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mb-10" data-testid="section-cluster-examples">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            {data.sections.nursingExamples.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.sections.nursingExamples.examples.map((ex, i) => (
              <div key={i} className={`${ex.color} rounded-lg p-4 space-y-1`} data-testid={`example-card-${i}`}>
                <p className="font-medium text-gray-800 text-sm">{ex.label}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{ex.siValue}</span>
                  <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                  <span className="font-semibold">{ex.convValue}</span>
                </div>
                <p className="text-xs text-gray-500">{ex.interpretation}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10" data-testid="section-cluster-reference-chart">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Table2 className="w-5 h-5 text-primary" />
            {data.sections.referenceChart.heading}
          </h2>
          <Card className="border border-gray-200">
            <CardContent className="p-0 sm:p-2">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse" data-testid="table-cluster-reference">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.conversionClusterPage.conditionRange")}</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.conversionClusterPage.siValue")}</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.conversionClusterPage.convValue")}</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.conversionClusterPage.clinicalSignificance")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sections.referenceChart.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50/50" : ""} data-testid={`row-cluster-ref-${i}`}>
                        <td className="py-2 px-3 font-medium text-gray-800">{row.condition}</td>
                        <td className="py-2 px-3 text-gray-600">{row.siRange}</td>
                        <td className="py-2 px-3 text-gray-600">{row.convRange}</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">{row.significance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {data.faqs.length > 0 && (
          <section className="mb-10" data-testid="section-cluster-faq">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {data.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`cluster-faq-item-${i}`}>
                  <button
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    data-testid={`button-cluster-faq-${i}`}
                  >
                    <span className="font-medium text-gray-800 text-sm pr-4">{faq.question}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10" data-testid="section-cluster-hub-link">
          <LocaleLink href="/si-to-conventional-units-converter">
            <Card className="border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group" data-testid="link-cluster-hub">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{t("pages.conversionClusterPage.fullSiConventionalUnitsConverter")}</p>
                  <p className="text-sm text-gray-500">{t("pages.conversionClusterPage.convertAllLabValuesAnd")}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </CardContent>
            </Card>
          </LocaleLink>
        </section>

        {data.relatedClusterLinks.length > 0 && (
          <section className="mb-10" data-testid="section-cluster-related">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              Related Conversions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.relatedClusterLinks.map((link, i) => (
                <LocaleLink key={i} href={link.href}>
                  <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid={`link-cluster-related-${i}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <FlaskConical className="w-6 h-6 text-primary/70 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{link.label}</p>
                        <p className="text-xs text-gray-500 truncate">{link.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>
        )}

        {data.externalLinks.length > 0 && (
          <section className="mb-10" data-testid="section-cluster-tools">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              Related Study Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.externalLinks.map((link, i) => (
                <LocaleLink key={i} href={link.href}>
                  <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid={`link-cluster-tool-${i}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-primary/70 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{link.label}</p>
                        <p className="text-xs text-gray-500 truncate">{link.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>
        )}

        <Card className="border border-amber-200 bg-amber-50/30 mb-10">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("pages.conversionClusterPage.safetyNote")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This converter is an <strong>{t("pages.conversionClusterPage.educationalStudyTool")}</strong> for nursing students. While all conversion factors are based on standard clinical references, always verify critical lab values against your institution's reference ranges before making clinical decisions. Normal ranges may vary between laboratories, testing methods, and patient populations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-16 border-t border-gray-200 pt-6">
          <div className="flex items-start gap-2 text-xs text-gray-400 max-w-3xl mx-auto">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-gray-300" />
            <p>
              NurseNest provides independently developed educational content grounded in established physiological principles and widely accepted clinical reasoning frameworks. Not affiliated with or endorsed by any licensing or regulatory authority.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
