import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  FlaskConical,
} from "lucide-react";
import { loadAdvancedLabsAccess } from "@/lib/advanced-labs/advanced-labs-access";
import {
  getAdvancedLabsLessonBySlug,
  ADVANCED_LABS_LESSON_INDEX,
  type AdvancedLabsLesson,
} from "@/lib/advanced-labs/advanced-labs-curriculum";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return ADVANCED_LABS_LESSON_INDEX.map((l) => ({ slug: l.slug }));
}

const LEVEL_STYLE: Record<string, string> = {
  advanced: "bg-violet-50 text-violet-700 border border-violet-100",
  mastery: "bg-rose-50 text-rose-700 border border-rose-100",
};

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
        <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function PracticeCard({
  item,
  idx,
}: {
  item: AdvancedLabsLesson["practiceItems"][number];
  idx: number;
}) {
  const letters = ["A", "B", "C", "D"] as const;
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 mb-4">
      <p className="font-medium text-gray-900 mb-3 text-sm leading-relaxed">
        <span className="font-bold text-emerald-600 mr-1">{idx + 1}.</span>
        {item.stem}
      </p>
      <ul className="space-y-1 mb-3">
        {item.choices.map((c, i) => (
          <li
            key={i}
            className={`text-sm px-3 py-1.5 rounded-lg ${
              i === item.correct
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium"
                : "bg-white border border-gray-100 text-gray-700"
            }`}
          >
            <span className="font-bold mr-1">{letters[i]}.</span> {c}
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
        <p className="text-xs font-bold text-blue-700 mb-0.5">Rationale</p>
        <p className="text-xs text-blue-800 leading-relaxed">{item.rationale}</p>
        <p className="text-xs text-blue-600 mt-1 italic">Trap guarded: {item.trapGuarded}</p>
      </div>
    </div>
  );
}

export default async function AdvancedLabsLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const access = await loadAdvancedLabsAccess();

  if (!access.ok) {
    switch (access.reason) {
      case "sign_in_required":
        redirect(`/login?next=/modules/labs-advanced/${slug}`);
      case "module_unavailable":
        redirect("/advanced-labs-interpretation");
      case "base_subscription_required":
        redirect("/pricing?ref=advanced-labs");
      case "tier_not_eligible":
        redirect("/labs-interpretation?ref=tier-not-eligible");
      case "advanced_labs_upgrade_required":
        redirect("/modules/labs-advanced#upgrade");
    }
  }

  const lesson = getAdvancedLabsLessonBySlug(slug);
  if (!lesson) notFound();

  const levelStyle = LEVEL_STYLE[lesson.level] ?? "";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/modules/labs-advanced"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Advanced Labs Interpretation
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${levelStyle}`}>
            {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {lesson.estimatedMinutes} min
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        <p className="text-gray-600 leading-relaxed">{lesson.subtitle}</p>
      </div>

      {/* Objectives */}
      <Section icon={CheckCircle2} title="Learning Objectives">
        <ul className="space-y-2">
          {lesson.objectives.map((obj) => (
            <li key={obj} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              {obj}
            </li>
          ))}
        </ul>
      </Section>

      {/* Overview */}
      <Section icon={FlaskConical} title="Clinical Overview">
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5 mb-4">
          <p className="text-sm text-gray-800 leading-relaxed mb-3">
            {lesson.overview.clinicalSignificance}
          </p>
          <p className="text-xs font-bold text-emerald-700 mb-1">Key clinical question</p>
          <p className="text-sm italic text-emerald-800">{lesson.overview.keyQuestion}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {lesson.overview.commonSettings.map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {s}
            </span>
          ))}
        </div>
      </Section>

      {/* Mechanism */}
      <Section icon={Brain} title="Mechanism & Physiology">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {lesson.mechanism.physiologicalBasis}
        </p>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Key relationships</p>
          <ul className="space-y-1.5">
            {lesson.mechanism.keyRelationships.map((rel) => (
              <li key={rel} className="text-xs text-slate-700 flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold mt-0.5">→</span>
                {rel}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <p className="text-xs font-bold text-amber-700 mb-1">Why this matters clinically</p>
          <p className="text-xs text-amber-800 leading-relaxed">{lesson.mechanism.whyItMatters}</p>
        </div>
      </Section>

      {/* Normal ranges */}
      <Section icon={BookOpen} title="Normal Ranges">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Parameter</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Value</th>
                <th className="text-left py-2 font-semibold text-gray-600 text-xs uppercase tracking-wider">Clinical note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lesson.normalRanges.map((row) => (
                <tr key={row.parameter}>
                  <td className="py-2.5 pr-4 font-medium text-gray-900 text-sm">{row.parameter}</td>
                  <td className="py-2.5 pr-4 text-emerald-700 font-semibold text-sm whitespace-nowrap">
                    {row.value} <span className="text-gray-400 font-normal text-xs">{row.unit}</span>
                  </td>
                  <td className="py-2.5 text-xs text-gray-500 leading-relaxed">{row.clinicalNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Abnormal patterns */}
      <Section icon={AlertTriangle} title="Abnormal Patterns">
        <div className="space-y-4">
          {lesson.abnormalPatterns.map((pattern) => (
            <div key={pattern.pattern} className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  pattern.direction === "high"
                    ? "bg-red-50 text-red-700"
                    : pattern.direction === "low"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-amber-50 text-amber-700"
                }`}>
                  {pattern.direction === "high" ? "↑ Elevated" : pattern.direction === "low" ? "↓ Low" : "Abnormal"}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm">{pattern.pattern}</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2 italic">{pattern.clinicalMeaning}</p>
              <div className="flex flex-wrap gap-1.5">
                {pattern.causes.map((c) => (
                  <span key={c} className="text-xs px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-gray-600">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Deep dive */}
      <Section icon={Brain} title="Deep Dive">
        <div className="rounded-xl bg-slate-900 text-white p-6">
          <p className="text-sm leading-relaxed text-slate-200">{lesson.deepDive}</p>
        </div>
      </Section>

      {/* Nursing priorities */}
      <Section icon={CheckCircle2} title="Nursing Priorities">
        <ul className="space-y-2">
          {lesson.nursingPriorities.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-gray-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              {p}
            </li>
          ))}
        </ul>
      </Section>

      {/* Common traps */}
      <Section icon={AlertTriangle} title="Common Traps">
        <ul className="space-y-2">
          {lesson.commonTraps.map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              {t}
            </li>
          ))}
        </ul>
      </Section>

      {/* Not this because */}
      {lesson.notThisBecause.length > 0 && (
        <Section icon={Brain} title="Not This Because…">
          <div className="space-y-3">
            {lesson.notThisBecause.map((item) => (
              <div key={item.mimicker} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800 mb-1">{item.mimicker}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{item.differentiator}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Case application */}
      <Section icon={FlaskConical} title="Clinical Case">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 overflow-hidden">
          <div className="p-5 border-b border-emerald-100">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Patient</p>
            <p className="text-sm text-gray-800">{lesson.caseApplication.patientProfile}</p>
          </div>
          <div className="p-5 border-b border-emerald-100">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Lab Snapshot</p>
            <p className="text-sm font-mono text-gray-800 bg-white rounded-lg px-3 py-2 border border-emerald-100">
              {lesson.caseApplication.labSnapshot}
            </p>
          </div>
          <div className="p-5 border-b border-emerald-100">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Context</p>
            <p className="text-sm text-gray-800 leading-relaxed">{lesson.caseApplication.clinicalContext}</p>
          </div>
          <div className="p-5 border-b border-emerald-100">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Clinical Question</p>
            <p className="text-sm font-semibold text-gray-900">{lesson.caseApplication.question}</p>
          </div>
          <div className="p-5 border-b border-emerald-100">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Reasoning</p>
            <p className="text-sm text-gray-800 leading-relaxed">{lesson.caseApplication.reasoning}</p>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Nursing Actions</p>
            <ul className="space-y-1.5">
              {lesson.caseApplication.nursingActions.map((action) => (
                <li key={action} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Practice items */}
      <Section icon={BookOpen} title="Practice Questions">
        {lesson.practiceItems.map((item, idx) => (
          <PracticeCard key={idx} item={item} idx={idx} />
        ))}
      </Section>

      {/* Next lesson nav */}
      <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
        <Link
          href="/modules/labs-advanced"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All lessons
        </Link>
        {lesson.number < ADVANCED_LABS_LESSON_INDEX.length && (
          <Link
            href={`/modules/labs-advanced/${ADVANCED_LABS_LESSON_INDEX[lesson.number]?.slug ?? ""}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Next lesson
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        )}
      </div>
    </div>
  );
}
