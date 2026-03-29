import { Link } from "wouter";
import {
  ArrowRight, CheckCircle2, Star, Shield, Users, Award,
  BookOpen, Brain, FileText, Zap, Target, Clock, TrendingUp,
  GraduationCap, Globe, AlertCircle, type LucideIcon
} from "lucide-react";
import { useParamedicRegion, type ParamedicRegion } from "@/allied/contexts/paramedic-region-context";

import { useI18n } from "@/lib/i18n";
interface HeroCTAProps {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

export function HeroCTA({ badge, title, titleHighlight, subtitle, primaryCTA, secondaryCTA }: HeroCTAProps) {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden py-16 sm:py-24" data-testid="paramedic-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-lavender-50 to-white" style={{ background: "linear-gradient(135deg, #f3f0ff 0%, #ede9fe 30%, #f0fdfa 70%, #ffffff 100%)" }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100/20 rounded-full translate-y-1/3 -translate-x-1/3" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100/80 text-purple-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6" data-testid="badge-paramedic">
            <Zap className="w-4 h-4" />
            {badge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight" data-testid="text-hero-title">
            {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">{titleHighlight}</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            {subtitle}
          </p>
          <div className="max-w-lg mx-auto p-4 rounded-xl bg-white/70 border border-purple-100 backdrop-blur-sm mb-6" data-testid="hero-clarity-block">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">{t("allied.paramedicComponents.whatYouGet")}</p>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>{t("allied.paramedicComponents.careerspecificQuestionBanksWithDetailed")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>{t("allied.paramedicComponents.blueprintweightedMockExamsThatMirror")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>{t("allied.paramedicComponents.aipoweredStudyPlansAndReadiness")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href={primaryCTA.href} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" data-testid="button-hero-primary">
              {primaryCTA.label} <ArrowRight className="w-4 h-4" />
            </Link>
            {secondaryCTA && (
              <Link href={secondaryCTA.href} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-teal-700 rounded-xl text-base font-semibold hover:bg-teal-50 transition-all border border-teal-200" data-testid="button-hero-secondary">
                {secondaryCTA.label}
              </Link>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500" data-testid="hero-trust-badges">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>{t("allied.paramedicComponents.noCreditCardRequired")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>{t("allied.paramedicComponents.blueprintalignedContent")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>{t("allied.paramedicComponents.cancelAnytime")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StudyStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function StudyPathSteps({ steps }: { steps: StudyStep[] }) {
  return (
    <section className="py-16 sm:py-20 bg-white" data-testid="section-study-path">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicComponents.yourStudySystemIn4")}</h2>
          <p className="text-gray-600 max-w-xl mx-auto">{t("allied.paramedicComponents.aStructuredEvidencebasedApproachTo")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="relative text-center" data-testid={`step-${s.step}`}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-7 h-7 text-teal-600" />
              </div>
              <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Step {s.step}</div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.description}</p>
              {s.step < steps.length && (
                <div className="hidden md:block absolute top-7 left-full w-full">
                  <div className="w-full h-0.5 bg-gradient-to-r from-teal-200 to-purple-200" style={{ width: "calc(100% - 3.5rem)", marginLeft: "1.75rem" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TrackCardProps {
  title: string;
  description: string;
  examNames: string[];
  href: string;
  color: string;
  icon: LucideIcon;
}

export function TrackCard({ title, description, examNames, href, color, icon: Icon }: TrackCardProps) {
  return (
    <Link href={href} className="group" data-testid={`card-track-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all h-full">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {examNames.map(e => (
            <span key={e} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">{e}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

interface PainPointCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function PainPointCard({ icon: Icon, title, description }: PainPointCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid={`card-pain-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <Icon className="w-8 h-8 text-purple-500 mb-3" />
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-teal-200 transition-all" data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <Icon className="w-8 h-8 text-teal-500 mb-3" />
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

interface TopicCategoryCardProps {
  title: string;
  questionCount: number;
  href: string;
}

export function TopicCategoryCard({ title, questionCount, href }: TopicCategoryCardProps) {
  return (
    <Link href={href} className="group" data-testid={`card-topic-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-md hover:border-teal-200 transition-all flex items-center gap-3">
        <Target className="w-5 h-5 text-teal-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{title}</h3>
          <p className="text-xs text-gray-400">{questionCount} questions</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors" />
      </div>
    </Link>
  );
}

interface FreePreviewBlockProps {
  title?: string;
  subtitle?: string;
  previewItems: { label: string; description: string }[];
  ctaHref: string;
  ctaLabel?: string;
}

export function FreePreviewBlock({ title = "Try It Free — No Account Required", subtitle, previewItems, ctaHref, ctaLabel = "Start Free Preview" }: FreePreviewBlockProps) {
  return (
    <section className="py-16 sm:py-20" data-testid="section-free-preview">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl p-8 sm:p-12 border border-purple-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
            {subtitle && <p className="text-gray-600 max-w-lg mx-auto">{subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {previewItems.map((item) => (
              <div key={item.label} className="bg-white/80 rounded-xl p-4 text-center" data-testid={`preview-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <CheckCircle2 className="w-6 h-6 text-teal-500 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" data-testid="button-free-preview">
              {ctaLabel} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ExamPathCardProps {
  title: string;
  description: string;
  features: string[];
  href: string;
  badge?: string;
}

export function ExamPathCard({ title, description, features, href, badge }: ExamPathCardProps) {
  return (
    <Link href={href} className="group" data-testid={`card-exam-path-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all h-full">
        {badge && (
          <span className="inline-block px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mb-3">{badge}</span>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export function TrustBlock() {
  const stats = [
    { value: "500+", label: "Practice Questions" },
    { value: "10", label: "Exam Domains" },
    { value: "10", label: "In-Depth Lessons" },
    { value: "600+", label: "Word Rationales" },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white" data-testid="section-trust">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicComponents.builtByHealthcareEducatorsFor")}</h2>
          <p className="text-gray-600 max-w-xl mx-auto">{t("allied.paramedicComponents.everyQuestionLessonAndTool")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map(s => (
            <div key={s.label} className="text-center bg-white rounded-2xl border border-gray-100 p-5" data-testid={`trust-stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="text-2xl font-bold text-teal-700">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <Shield className="w-8 h-8 text-teal-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("allied.paramedicComponents.blueprintaligned")}</h3>
            <p className="text-xs text-gray-500">{t("allied.paramedicComponents.allContentMapsToOfficial")}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("allied.paramedicComponents.expertwritten")}</h3>
            <p className="text-xs text-gray-500">{t("allied.paramedicComponents.questionsAndRationalesByPracticing")}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <TrendingUp className="w-8 h-8 text-teal-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("allied.paramedicComponents.continuouslyUpdated")}</h3>
            <p className="text-xs text-gray-500">{t("allied.paramedicComponents.newQuestionsAndContentAdded")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FinalCTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

export function FinalCTASection({ title = "Ready to Start Studying?", subtitle = "Join thousands of paramedic students using NurseNest to prepare for their certification exams with confidence.", primaryCTA, secondaryCTA }: FinalCTASectionProps) {
  return (
    <section className="py-16 sm:py-20" data-testid="section-final-cta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 rounded-2xl overflow-hidden p-8 sm:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-1/3 -translate-x-1/3" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-final-cta-title">{title}</h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">{subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={primaryCTA.href} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-teal-500 text-white rounded-xl text-base font-semibold hover:bg-teal-400 transition-colors" data-testid="button-final-cta-primary">
                {primaryCTA.label} <ArrowRight className="w-4 h-4" />
              </Link>
              {secondaryCTA && (
                <Link href={secondaryCTA.href} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white rounded-xl text-base font-semibold hover:bg-white/20 transition-colors" data-testid="button-final-cta-secondary">
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FAQItem {
  q: string;
  a: string;
}

export function FAQSection({ title = "Frequently Asked Questions", faqs }: { title?: string; faqs: FAQItem[] }) {
  return (
    <section className="py-16 sm:py-20 bg-white" data-testid="section-faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{title}</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100" data-testid={`faq-${i}`}>
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-semibold text-gray-900 hover:text-teal-700 transition-colors list-none">
                {faq.q}
                <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ContentCardProps {
  title: string;
  description: string;
  meta?: string;
  tags?: string[];
  href: string;
  badge?: string;
  icon?: LucideIcon;
}

export function ContentCard({ title, description, meta, tags, href, badge, icon: Icon }: ContentCardProps) {
  return (
    <Link href={href} className="group" data-testid={`card-content-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-teal-200 transition-all h-full">
        <div className="flex items-start justify-between mb-3">
          {Icon && <Icon className="w-6 h-6 text-teal-500" />}
          {badge && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{badge}</span>}
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        {meta && <p className="text-xs text-gray-400 mb-2">{meta}</p>}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(t => (
              <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs">{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${active ? "bg-teal-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
      data-testid={`filter-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}
    </button>
  );
}

interface HubHeroProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function HubHero({ title, subtitle, breadcrumbs }: HubHeroProps) {
  return (
    <section className="relative py-12 sm:py-16 overflow-hidden" data-testid="hub-hero">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #f3f0ff 0%, #ede9fe 30%, #f0fdfa 70%, #ffffff 100%)" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="w-3 h-3" />}
              {bc.href ? (
                <Link href={bc.href} className="hover:text-teal-600 transition-colors" data-testid={`breadcrumb-${bc.label.toLowerCase().replace(/\s+/g, "-")}`}>{bc.label}</Link>
              ) : (
                <span className="text-teal-700 font-medium" data-testid={`breadcrumb-${bc.label.toLowerCase().replace(/\s+/g, "-")}`}>{bc.label}</span>
              )}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-hub-title">{title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl" data-testid="text-hub-subtitle">{subtitle}</p>
      </div>
    </section>
  );
}

export function RegionSelector() {
  const { region, setRegion } = useParamedicRegion();
  return (
    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-1 py-1 shadow-sm" data-testid="region-selector">
      <button
        onClick={() => setRegion("CA")}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          region === "CA"
            ? "bg-red-50 text-red-700 border border-red-200"
            : "text-gray-500 hover:text-gray-700"
        }`}
        data-testid="button-region-ca"
      >
        <span className="text-base">🇨🇦</span>
        Canada
      </button>
      <button
        onClick={() => setRegion("US")}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          region === "US"
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "text-gray-500 hover:text-gray-700"
        }`}
        data-testid="button-region-us"
      >
        <span className="text-base">🇺🇸</span>
        United States
      </button>
    </div>
  );
}

export function RegionNotesCallout({ caNote, usNote }: { caNote?: string; usNote?: string }) {
  const { region, isCanada } = useParamedicRegion();
  const note = isCanada ? caNote : usNote;
  if (!note) return null;

  return (
    <div
      className={`rounded-xl border p-4 my-4 flex items-start gap-3 ${
        isCanada
          ? "bg-red-50 border-red-200"
          : "bg-blue-50 border-blue-200"
      }`}
      data-testid="region-notes-callout"
    >
      <Globe className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isCanada ? "text-red-500" : "text-blue-500"}`} />
      <div>
        <h4 className={`text-sm font-semibold mb-1 ${isCanada ? "text-red-800" : "text-blue-800"}`}>
          {isCanada ? "Canadian Context" : "US Context"}
        </h4>
        <p className={`text-sm leading-relaxed ${isCanada ? "text-red-900" : "text-blue-900"}`}>
          {note}
        </p>
      </div>
    </div>
  );
}
