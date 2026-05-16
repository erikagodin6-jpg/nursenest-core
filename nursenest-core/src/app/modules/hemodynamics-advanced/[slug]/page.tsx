import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Activity, BookOpen, AlertTriangle, CheckCircle2, Brain } from "lucide-react";
import { loadAdvancedHemodynamicsAccess } from "@/lib/advanced-hemodynamics/advanced-hemodynamics-access";
import {
  getAdvancedHemodynamicsLessonBySlug,
  ADVANCED_HEMODYNAMICS_LESSON_INDEX,
  type AdvancedHemodynamicsLesson,
} from "@/lib/advanced-hemodynamics/advanced-hemodynamics-curriculum";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return ADVANCED_HEMODYNAMICS_LESSON_INDEX.map((l) => ({ slug: l.slug }));
}

const LEVEL_STYLE: Record<string, string> = {
  advanced: "bg-violet-50 text-violet-700 border border-violet-100",
  mastery: "bg-rose-50 text-rose-700 border border-rose-100",
};

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
        <Icon className="w-4 h-4 text-rose-500 shrink-0" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function PracticeCard({ item, idx }: { item: AdvancedHemodynamicsLesson["practiceItems"][number]; idx: number }) {
  const letters = ["A", "B", "C", "D"] as const;
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 mb-4">
      <p className="font-medium text-gray-900 mb-3 text-sm leading-relaxed">
        <span className="font-bold text-rose-600 mr-1">{idx + 1}.</span>
        {item.stem}
      </p>
      <ul className="space-y-1 mb-3">
        {item.choices.map((c, i) => (
          <li
            key={i}
            className={`text-sm px-3 py-1.5 rounded-lg ${i === item.correct ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium" : "bg-white border border-gray-100 text-gray-700"}`}
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

export default async function AdvancedHemodynamicsLessonPage({
  params,
}: {
  params: { slug: string };
}) {
  // ── Paywall ────────────────────────────────────────────────────────────────
  const access = await loadAdvancedHemodynamicsAccess();

  if (!access.ok) {
    switch (access.reason) {
      case "sign_in_required":
        redirect(`/login?next=/modules/hemodynamics-advanced/${params.slug}`);
      case "module_unavailable":
        redirect("/advanced-hemodynamic-monitoring");
      case "base_subscription_required":
        redirect("/pricing?ref=advanced-hemodynamics");
      case "tier_not_eligible":
        redirect("/hemodynamic-monitoring?ref=tier-not-eligible");
      case "advanced_hemodynamics_upgrade_required":
        redirect("/modules/hemodynamics-advanced#upgrade");
    }
  }

  // ── Content ────────────────────────────────────────────────────────────────
  const lesson = getAdvancedHemodynamicsLessonBySlug(params.slug);
  if (!lesson) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back nav */}
      <Link
        href="/modules/hemodynamics-advanced"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Advanced Hemodynamic Monitoring
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${LEVEL_STYLE[lesson.level] ?? ""}`}>
            {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {lesson.estimatedMinutes} min
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{lesson.title}</h1>
        <p className="text-gray-500 text-sm">{lesson.subtitle}</p>
      </div>

      {/* Overview */}
      <Section icon={BookOpen} title="Clinical Significance">
        <p className="text-sm text-gray-700 leading-relaxed">{lesson.overview.clinicalSignificance}</p>
        <p className="mt-3 text-sm font-semibold text-rose-700">
          Key question: <span className="font-normal text-gray-700">{lesson.overview.keyQuestion}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {lesson.overview.commonSettings.map((s) => (
            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      </Section>

      {/* Mechanism */}
      <Section icon={Brain} title="Mechanism & Physiology">
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{lesson.mechanism.physiologicalBasis}</p>
        <ul className="space-y-1">
          {lesson.mechanism.keyRelationships.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-rose-400 mt-0.5 shrink-0">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        {lesson.mechanism.whyItLooksLikeThis && (
          <p className="mt-3 text-sm text-gray-600 italic border-l-2 border-rose-200 pl-3">
            {lesson.mechanism.whyItLooksLikeThis}
          </p>
        )}
      </Section>

      {/* Normal ranges */}
      {lesson.normalRanges.length > 0 && (
        <Section icon={Activity} title="Normal Ranges">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Parameter</th>
                  <th className="py-2 pr-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Value</th>
                  <th className="py-2 pr-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Unit</th>
                  <th className="py-2 font-semibold text-gray-600 text-xs uppercase tracking-wider">Clinical Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lesson.normalRanges.map((r) => (
                  <tr key={r.parameter}>
                    <td className="py-2 pr-4 font-medium text-gray-900">{r.parameter}</td>
                    <td className="py-2 pr-4 text-gray-700 font-mono">{r.value}</td>
                    <td className="py-2 pr-4 text-gray-500">{r.unit}</td>
                    <td className="py-2 text-gray-600 text-xs">{r.clinicalNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Abnormal patterns */}
      {lesson.abnormalPatterns.length > 0 && (
        <Section icon={AlertTriangle} title="Abnormal Patterns">
          <div className="space-y-3">
            {lesson.abnormalPatterns.map((p) => (
              <div key={p.pattern} className="rounded-lg border border-gray-100 bg-white p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm">{p.pattern}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${p.direction === "high" ? "bg-red-50 text-red-700" : p.direction === "low" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                    {p.direction}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">Causes: {p.causes.join(", ")}</p>
                <p className="text-sm text-gray-700">{p.clinicalMeaning}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Deep dive */}
      {lesson.deepDive && (
        <Section icon={BookOpen} title="Deep Dive">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-line">{lesson.deepDive}</p>
          </div>
        </Section>
      )}

      {/* Nursing priorities */}
      <Section icon={CheckCircle2} title="Nursing Priorities">
        <ul className="space-y-2">
          {lesson.nursingPriorities.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
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
            <li key={t} className="flex items-start gap-2 text-sm text-gray-700">
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
            {lesson.notThisBecause.map((n) => (
              <div key={n.mimicker} className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                <p className="text-sm font-semibold text-amber-900 mb-1">❌ {n.mimicker}</p>
                <p className="text-sm text-amber-800">✓ {n.differentiator}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Case application */}
      <Section icon={BookOpen} title="Clinical Case">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Patient</p>
          <p className="text-sm text-blue-900 mb-2">{lesson.caseApplication.patientProfile}</p>
          <div className="grid sm:grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Vitals</p>
              <p className="text-xs text-blue-800">{lesson.caseApplication.vitals}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Hemodynamics</p>
              <p className="text-xs text-blue-800">{lesson.caseApplication.hemodynamicData}</p>
            </div>
          </div>
          <p className="text-xs text-blue-700 mb-3">{lesson.caseApplication.clinicalContext}</p>
          <p className="font-semibold text-blue-900 text-sm mb-2">{lesson.caseApplication.question}</p>
          <div className="bg-white rounded-lg p-3 mb-3 border border-blue-100">
            <p className="text-xs font-bold text-gray-600 mb-1">Clinical Reasoning</p>
            <p className="text-xs text-gray-700 leading-relaxed">{lesson.caseApplication.reasoning}</p>
          </div>
          <p className="text-xs font-bold text-blue-600 mb-1">Nursing Actions</p>
          <ul className="space-y-1">
            {lesson.caseApplication.nursingActions.map((a) => (
              <li key={a} className="flex items-start gap-1.5 text-xs text-blue-800">
                <span className="text-blue-400 shrink-0">→</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Practice items */}
      {lesson.practiceItems.length > 0 && (
        <Section icon={CheckCircle2} title="Practice Questions">
          {lesson.practiceItems.map((item, i) => (
            <PracticeCard key={i} item={item} idx={i} />
          ))}
        </Section>
      )}

      {/* Footer nav */}
      <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
        <Link
          href="/modules/hemodynamics-advanced"
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All advanced lessons
        </Link>
        <span className="text-xs text-gray-400">Advanced Hemodynamic Monitoring</span>
      </div>
    </div>
  );
}
