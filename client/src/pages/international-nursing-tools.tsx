import { useState, useCallback } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { TranslationFallbackNotice } from "@/components/translation-fallback-notice";
import { useI18n } from "@/lib/i18n";
import {
  ArrowLeft, Check, X, ChevronDown, Globe, ClipboardCheck,
  BarChart3, Search, Languages, CheckCircle2, Circle,
} from "lucide-react";

interface CountryRequirements {
  slug: string;
  name: string;
  flag: string;
  regulatoryBody: string;
  requiredExams: string[];
  languageTests: { test: string; minScore: string; accepted: boolean }[];
  timeline: string;
  salary: string;
  visaTypes: string[];
  licensingSteps: string[];
  additionalReqs: string[];
}

const COUNTRY_DATA: CountryRequirements[] = [
  {
    slug: "canada", name: "Canada", flag: "\u{1F1E8}\u{1F1E6}",
    regulatoryBody: "NNAS / Provincial Colleges (CNO, BCCNM)",
    requiredExams: ["NCLEX-RN or REx-PN", "Jurisprudence exam (varies by province)"],
    languageTests: [
      { test: "IELTS Academic", minScore: "6.5 overall, 7.0 speaking", accepted: true },
      { test: "CELBAN", minScore: "CLB 7+ in all skills", accepted: true },
      { test: "OET", minScore: "B grade in all sub-tests", accepted: true },
    ],
    timeline: "8\u201314 months",
    salary: "$70,000\u2013$95,000 CAD/year",
    visaTypes: ["Express Entry", "Provincial Nominee Program", "Atlantic Immigration Program"],
    licensingSteps: [
      "Apply to NNAS for credential evaluation",
      "Submit advisory report to provincial regulatory body",
      "Complete bridging program if required",
      "Pass language proficiency test (IELTS/CELBAN/OET)",
      "Register for and pass NCLEX-RN or REx-PN",
      "Apply for provincial registration",
    ],
    additionalReqs: ["Police clearance certificate", "Immunization records", "Professional references"],
  },
  {
    slug: "united-states", name: "United States", flag: "\u{1F1FA}\u{1F1F8}",
    regulatoryBody: "CGFNS / State Boards of Nursing",
    requiredExams: ["NCLEX-RN"],
    languageTests: [
      { test: "IELTS Academic", minScore: "6.5 overall", accepted: true },
      { test: "TOEFL iBT", minScore: "83+", accepted: true },
      { test: "OET", minScore: "B grade", accepted: false },
    ],
    timeline: "6\u201312 months",
    salary: "$65,000\u2013$120,000 USD/year",
    visaTypes: ["VisaScreen (CGFNS)", "H-1B", "EB-3 Green Card"],
    licensingSteps: [
      "Apply for CGFNS Certification Program or VisaScreen",
      "Submit credential evaluation documents",
      "Pass English proficiency test",
      "Apply to state board of nursing",
      "Register for and pass NCLEX-RN",
      "Obtain state nursing license",
    ],
    additionalReqs: ["VisaScreen certificate", "Social Security Number", "State-specific requirements"],
  },
  {
    slug: "united-kingdom", name: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}",
    regulatoryBody: "NMC (Nursing & Midwifery Council)",
    requiredExams: ["NMC CBT (Computer-Based Test)", "NMC OSCE (Objective Structured Clinical Examination)"],
    languageTests: [
      { test: "IELTS Academic", minScore: "7.0 overall, 7.0 each band", accepted: true },
      { test: "OET", minScore: "B grade in all sub-tests", accepted: true },
      { test: "CELBAN", minScore: "N/A", accepted: false },
    ],
    timeline: "4\u20138 months",
    salary: "\u00a325,000\u2013\u00a345,000 GBP/year",
    visaTypes: ["Health & Care Worker visa", "Skilled Worker visa"],
    licensingSteps: [
      "Create NMC online account",
      "Submit self-assessment of nursing competencies",
      "Pass English language test (IELTS/OET)",
      "Pass NMC CBT Part 1 (Theory)",
      "Pass NMC OSCE Part 2 (Clinical)",
      "Receive NMC PIN and register",
    ],
    additionalReqs: ["DBS (criminal record) check", "Occupational health clearance", "TB screening"],
  },
  {
    slug: "australia", name: "Australia", flag: "\u{1F1E6}\u{1F1FA}",
    regulatoryBody: "AHPRA / ANMAC",
    requiredExams: ["NCLEX-RN (pilot program)", "Skills assessment"],
    languageTests: [
      { test: "IELTS Academic", minScore: "7.0 in each band", accepted: true },
      { test: "OET", minScore: "B grade in all sub-tests", accepted: true },
      { test: "PTE Academic", minScore: "65+ in each skill", accepted: true },
    ],
    timeline: "6\u201312 months",
    salary: "A$70,000\u2013A$100,000 AUD/year",
    visaTypes: ["Skilled Worker visa (Subclass 482)", "Skilled Migration (Subclass 189/190)"],
    licensingSteps: [
      "Apply to ANMAC for skills assessment",
      "Submit nursing qualifications and transcripts",
      "Pass English language test",
      "Apply to AHPRA for registration",
      "Complete any required supervised practice",
      "Receive AHPRA registration",
    ],
    additionalReqs: ["National police check", "Working with Children check", "Immunization records"],
  },
  {
    slug: "new-zealand", name: "New Zealand", flag: "\u{1F1F3}\u{1F1FF}",
    regulatoryBody: "NCNZ (Nursing Council of New Zealand)",
    requiredExams: ["Competence Assessment Programme (CAP)"],
    languageTests: [
      { test: "IELTS Academic", minScore: "7.0 in each band", accepted: true },
      { test: "OET", minScore: "B grade in all sub-tests", accepted: true },
      { test: "PTE Academic", minScore: "65+ in each skill", accepted: true },
    ],
    timeline: "6\u201310 months",
    salary: "NZ$60,000\u2013NZ$90,000 NZD/year",
    visaTypes: ["Essential Skills Work Visa", "Skilled Migrant Category"],
    licensingSteps: [
      "Apply to NCNZ for registration assessment",
      "Submit credential documents",
      "Pass English language test",
      "Complete CAP programme if required",
      "Apply for practising certificate",
      "Receive NCNZ registration",
    ],
    additionalReqs: ["Police vetting", "Health screening", "Professional references"],
  },
  {
    slug: "ireland", name: "Ireland", flag: "\u{1F1EE}\u{1F1EA}",
    regulatoryBody: "NMBI (Nursing and Midwifery Board of Ireland)",
    requiredExams: ["NMBI Aptitude Test (QQI Level 8)"],
    languageTests: [
      { test: "IELTS Academic", minScore: "6.5 overall", accepted: true },
      { test: "OET", minScore: "B grade", accepted: true },
      { test: "CELBAN", minScore: "N/A", accepted: false },
    ],
    timeline: "4\u20138 months",
    salary: "\u20ac35,000\u2013\u20ac55,000 EUR/year",
    visaTypes: ["Critical Skills Employment Permit", "General Employment Permit"],
    licensingSteps: [
      "Apply to NMBI for registration",
      "Submit qualification documents",
      "Pass English language test",
      "Complete adaptation programme or aptitude test",
      "Receive NMBI registration",
      "Apply for work permit if non-EU",
    ],
    additionalReqs: ["Garda vetting", "Occupational health report", "Professional indemnity insurance"],
  },
  {
    slug: "uae", name: "United Arab Emirates", flag: "\u{1F1E6}\u{1F1EA}",
    regulatoryBody: "DHA / DOH / MOH",
    requiredExams: ["DHA exam", "HAAD exam", "MOH exam (varies by emirate)"],
    languageTests: [
      { test: "IELTS Academic", minScore: "Not always required", accepted: true },
      { test: "OET", minScore: "Not always required", accepted: true },
      { test: "Arabic proficiency", minScore: "Preferred", accepted: true },
    ],
    timeline: "2\u20136 months",
    salary: "AED 8,000\u2013AED 18,000/month",
    visaTypes: ["Employment visa (employer-sponsored)"],
    licensingSteps: [
      "Obtain job offer from UAE healthcare facility",
      "Apply to relevant authority (DHA/DOH/MOH)",
      "Submit credential documents and dataflow verification",
      "Pass licensing exam (DHA/HAAD/MOH)",
      "Receive professional license",
      "Obtain employment visa",
    ],
    additionalReqs: ["Dataflow verification", "Good standing certificate", "Medical fitness test"],
  },
  {
    slug: "saudi-arabia", name: "Saudi Arabia", flag: "\u{1F1F8}\u{1F1E6}",
    regulatoryBody: "SCFHS (Saudi Commission for Health Specialties)",
    requiredExams: ["Prometric exam / SCFHS licensing exam"],
    languageTests: [
      { test: "IELTS Academic", minScore: "Not always required", accepted: true },
      { test: "OET", minScore: "Not always required", accepted: true },
      { test: "Arabic proficiency", minScore: "Preferred", accepted: true },
    ],
    timeline: "2\u20134 months",
    salary: "SAR 6,000\u2013SAR 15,000/month",
    visaTypes: ["Employment visa (employer-sponsored)"],
    licensingSteps: [
      "Obtain job offer from Saudi healthcare employer",
      "Apply to SCFHS for classification",
      "Submit credential documents and dataflow verification",
      "Pass Prometric / SCFHS exam",
      "Receive SCFHS professional license",
      "Obtain work visa and iqama",
    ],
    additionalReqs: ["Dataflow verification", "Medical fitness certificate", "Attested documents"],
  },
];

function CountryComparisonTable() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string[]>(["canada", "united-states"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedCountries = COUNTRY_DATA.filter(c => selected.includes(c.slug));
  const availableCountries = COUNTRY_DATA.filter(c => !selected.includes(c.slug));

  const addCountry = (slug: string) => {
    setSelected(prev => [...prev, slug]);
    setDropdownOpen(false);
  };

  const removeCountry = (slug: string) => {
    setSelected(prev => prev.filter(s => s !== slug));
  };

  const aspects = [
    { key: "regulatoryBody", label: t("intl.label.regulatoryBody"), getValue: (c: CountryRequirements) => c.regulatoryBody },
    { key: "requiredExams", label: t("intl.label.requiredExams"), getValue: (c: CountryRequirements) => c.requiredExams.join(", ") },
    { key: "timeline", label: t("intl.label.timeline"), getValue: (c: CountryRequirements) => c.timeline },
    { key: "salary", label: t("intl.label.salary"), getValue: (c: CountryRequirements) => c.salary },
    { key: "visaTypes", label: t("intl.label.visaTypes"), getValue: (c: CountryRequirements) => c.visaTypes.join(", ") },
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="comparison-table-section">
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">{t("intl.tools.comparison.title")}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">{t("intl.tools.comparison.desc")}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {selected.map(slug => {
          const c = COUNTRY_DATA.find(x => x.slug === slug);
          if (!c) return null;
          return (
            <span key={slug} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm" data-testid={`selected-country-${slug}`}>
              {c.flag} {c.name}
              <button onClick={() => removeCountry(slug)} className="ml-1 hover:text-red-500" data-testid={`remove-country-${slug}`}>
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          );
        })}
        {availableCountries.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
              data-testid="button-add-country"
            >
              {t("intl.tools.comparison.addCountry")} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[180px]">
                {availableCountries.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => addCountry(c.slug)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    data-testid={`add-country-${c.slug}`}
                  >
                    {c.flag} {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedCountries.length < 2 ? (
        <p className="text-sm text-gray-500 italic" data-testid="text-no-selection">{t("intl.tools.comparison.noSelection")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" data-testid="comparison-table">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-semibold text-gray-700 min-w-[140px]">{t("intl.label.aspect")}</th>
                {selectedCountries.map(c => (
                  <th key={c.slug} className="text-left py-3 px-3 font-semibold text-gray-700 min-w-[200px]">
                    {c.flag} {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aspects.map((aspect, i) => (
                <tr key={aspect.key} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-3 px-3 font-medium text-gray-700">{aspect.label}</td>
                  {selectedCountries.map(c => (
                    <td key={c.slug} className="py-3 px-3 text-gray-600">{aspect.getValue(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function LicensingChecklist() {
  const { t } = useI18n();
  const [selectedCountry, setSelectedCountry] = useState("canada");
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const country = COUNTRY_DATA.find(c => c.slug === selectedCountry);
  const steps = country?.licensingSteps || [];
  const progress = steps.length > 0 ? Math.round((checked.size / steps.length) * 100) : 0;

  const toggleStep = useCallback((idx: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }, []);

  const handleCountryChange = (slug: string) => {
    setSelectedCountry(slug);
    setChecked(new Set());
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="licensing-checklist-section">
      <div className="flex items-center gap-3 mb-4">
        <ClipboardCheck className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">{t("intl.tools.licensing.title")}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">{t("intl.tools.licensing.desc")}</p>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-2">{t("intl.tools.licensing.selectCountry")}</label>
        <select
          value={selectedCountry}
          onChange={e => handleCountryChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-xs"
          data-testid="select-licensing-country"
        >
          {COUNTRY_DATA.map(c => (
            <option key={c.slug} value={c.slug}>{c.flag} {c.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">{t("intl.tools.licensing.progress")}</span>
          <span className="text-gray-500">{checked.size}/{steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} data-testid="licensing-progress-bar" />
        </div>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => toggleStep(idx)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${checked.has(idx) ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200 hover:bg-gray-100"}`}
            data-testid={`licensing-step-${idx}`}
          >
            {checked.has(idx) ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
            )}
            <span className={`text-sm ${checked.has(idx) ? "text-green-800 line-through" : "text-gray-700"}`}>
              {step}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ReadinessChecklist() {
  const { t } = useI18n();
  const items = [
    "intl.tools.readiness.education",
    "intl.tools.readiness.license",
    "intl.tools.readiness.experience",
    "intl.tools.readiness.english",
    "intl.tools.readiness.documents",
    "intl.tools.readiness.financial",
    "intl.tools.readiness.destination",
    "intl.tools.readiness.timeline",
  ];
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const score = items.length > 0 ? Math.round((checked.size / items.length) * 100) : 0;

  const toggleItem = useCallback((idx: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }, []);

  const getResult = () => {
    if (score >= 80) return { text: t("intl.tools.readiness.result.ready"), color: "text-green-700 bg-green-50 border-green-200" };
    if (score >= 50) return { text: t("intl.tools.readiness.result.partial"), color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { text: t("intl.tools.readiness.result.notReady"), color: "text-red-700 bg-red-50 border-red-200" };
  };

  const result = getResult();

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="readiness-checklist-section">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">{t("intl.tools.readiness.title")}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">{t("intl.tools.readiness.desc")}</p>

      <div className="space-y-2 mb-6">
        {items.map((key, idx) => (
          <button
            key={key}
            onClick={() => toggleItem(idx)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${checked.has(idx) ? "bg-purple-50 border border-purple-200" : "bg-gray-50 border border-gray-200 hover:bg-gray-100"}`}
            data-testid={`readiness-item-${idx}`}
          >
            {checked.has(idx) ? (
              <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
            )}
            <span className={`text-sm ${checked.has(idx) ? "text-purple-800" : "text-gray-700"}`}>
              {t(key)}
            </span>
          </button>
        ))}
      </div>

      <div className={`p-4 rounded-lg border ${result.color}`} data-testid="readiness-result">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">{t("intl.tools.readiness.score")}</span>
          <span className="font-bold text-lg">{score}%</span>
        </div>
        <p className="text-sm">{result.text}</p>
      </div>
    </section>
  );
}

function ExamRequirementLookup() {
  const { t } = useI18n();
  const [selectedCountry, setSelectedCountry] = useState("");

  const country = COUNTRY_DATA.find(c => c.slug === selectedCountry);

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="exam-lookup-section">
      <div className="flex items-center gap-3 mb-4">
        <Search className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-bold text-gray-900">{t("intl.tools.examLookup.title")}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">{t("intl.tools.examLookup.desc")}</p>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-2">{t("intl.tools.examLookup.selectCountry")}</label>
        <select
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-xs"
          data-testid="select-exam-country"
        >
          <option value="">{t("intl.tools.examLookup.selectCountry")}</option>
          {COUNTRY_DATA.map(c => (
            <option key={c.slug} value={c.slug}>{c.flag} {c.name}</option>
          ))}
        </select>
      </div>

      {country && (
        <div className="space-y-4" data-testid="exam-results">
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2">{t("intl.tools.examLookup.licensingExams")}</h3>
            <ul className="space-y-1">
              {country.requiredExams.map((exam, i) => (
                <li key={i} className="text-sm text-orange-700 flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" /> {exam}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">{t("intl.tools.examLookup.languageExams")}</h3>
            <ul className="space-y-1">
              {country.languageTests.filter(lt => lt.accepted).map((lt, i) => (
                <li key={i} className="text-sm text-blue-700 flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" /> {lt.test} \u2014 {lt.minScore}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">{t("intl.tools.examLookup.additionalReqs")}</h3>
            <ul className="space-y-1">
              {country.additionalReqs.map((req, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" /> {req}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function LanguageRequirementComparison() {
  const { t } = useI18n();

  const tests = ["IELTS Academic", "OET", "CELBAN", "PTE Academic", "TOEFL iBT"];
  const countries = COUNTRY_DATA;

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6" data-testid="language-comparison-section">
      <div className="flex items-center gap-3 mb-4">
        <Languages className="w-6 h-6 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-900">{t("intl.tools.language.title")}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">{t("intl.tools.language.desc")}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" data-testid="language-comparison-table">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 font-semibold text-gray-700 min-w-[120px]">{t("intl.tools.language.test")}</th>
              {countries.map(c => (
                <th key={c.slug} className="text-center py-3 px-2 font-semibold text-gray-700 min-w-[100px]">
                  <span className="block text-lg">{c.flag}</span>
                  <span className="text-xs">{c.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tests.map((test, i) => (
              <tr key={test} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-3 px-3 font-medium text-gray-700">{test}</td>
                {countries.map(c => {
                  const lt = c.languageTests.find(l => l.test === test);
                  if (!lt) {
                    return <td key={c.slug} className="py-3 px-2 text-center text-gray-400 text-xs">\u2014</td>;
                  }
                  return (
                    <td key={c.slug} className="py-3 px-2 text-center">
                      {lt.accepted ? (
                        <div>
                          <Check className="w-4 h-4 text-green-500 mx-auto mb-1" />
                          <span className="text-xs text-gray-600">{lt.minScore}</span>
                        </div>
                      ) : (
                        <X className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I compare nursing licensing requirements across countries?",
      acceptedAnswer: { "@type": "Answer", text: "Use the Country Requirement Comparison tool to compare regulatory bodies, required exams, timelines, salaries, and visa types across 8 major nursing destinations side by side." },
    },
    {
      "@type": "Question",
      name: "What is a nursing readiness checklist?",
      acceptedAnswer: { "@type": "Answer", text: "The International Nurse Readiness Checklist helps you assess whether you are prepared to begin the international licensing process by evaluating your education, experience, language proficiency, documents, and financial readiness." },
    },
    {
      "@type": "Question",
      name: "Which language proficiency tests are accepted for nursing licensure?",
      acceptedAnswer: { "@type": "Answer", text: "IELTS Academic and OET are the most widely accepted. Some countries also accept CELBAN, PTE Academic, or TOEFL iBT. Requirements and minimum scores vary by country." },
    },
  ],
};

export default function InternationalNursingTools() {
  const { t } = useI18n();

  return (
    <>
      <SEO
        title={t("intl.tools.metaTitle")}
        description={t("intl.tools.metaDesc")}
        keywords={t("intl.seo.toolsKeywords")}
        canonicalPath="/international-nurses/tools"
        structuredData={faqStructuredData}
      />
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <BreadcrumbNav />
          <TranslationFallbackNotice />

          <div className="mb-4">
            <Link href="/international-nurses" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700" data-testid="link-back-to-hub">
              <ArrowLeft className="w-4 h-4" /> {t("intl.cta.backToHub")}
            </Link>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
              <Globe className="w-4 h-4" /> {t("intl.hub.tools")}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-tools-heading">{t("intl.tools.heading")}</h1>
            <p className="text-lg text-gray-600" data-testid="text-tools-subheading">{t("intl.tools.subheading")}</p>
          </div>

          <div className="space-y-8">
            <CountryComparisonTable />
            <LicensingChecklist />
            <ReadinessChecklist />
            <ExamRequirementLookup />
            <LanguageRequirementComparison />
          </div>

          <div className="mt-12 text-center">
            <Link href="/international-nurses" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors" data-testid="link-explore-hub">
              <Globe className="w-5 h-5" /> {t("intl.hub.exploreCountries")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
