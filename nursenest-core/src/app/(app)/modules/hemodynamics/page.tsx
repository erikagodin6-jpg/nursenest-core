import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Heart,
  Lock,
  TrendingUp,
  Zap,
} from "lucide-react";
import { loadHemodynamicsAccess } from "@/lib/advanced-hemodynamics/advanced-hemodynamics-access";
import { HEMODYNAMICS_LESSON_INDEX, validateHemodynamicsLesson, HEMODYNAMICS_FULL_LESSONS } from "@/lib/hemodynamics/hemodynamics-curriculum";

export const dynamic = "force-dynamic";

const LEVEL_LABEL: Record<string, string> = {
  foundation: "Foundation",
  core: "Core",
  advanced: "Advanced",
  clinical: "Clinical",
  mastery: "Mastery",
};

const LEVEL_COLOR: Record<string, string> = {
  foundation: "bg-blue-50 text-blue-700 border-blue-100",
  core: "bg-emerald-50 text-emerald-700 border-emerald-100",
  advanced: "bg-violet-50 text-violet-700 border-violet-100",
  clinical: "bg-amber-50 text-amber-700 border-amber-100",
  mastery: "bg-rose-50 text-rose-700 border-rose-100",
};

const FRAMEWORK_SECTIONS = [
  { icon: Brain, label: "Mechanism", desc: "Why the waveform/metric looks the way it does — physiology before numbers" },
  { icon: Activity, label: "Normal Ranges", desc: "Measurable values with units and clinical notes" },
  { icon: TrendingUp, label: "Abnormal Patterns", desc: "High/low states, causes, and hemodynamic meaning" },
  { icon: Heart, label: "Nursing Priorities", desc: "Bedside assessment, monitoring, escalation triggers" },
  { icon: BookOpen, label: "Clinical Case", desc: "Realistic ICU/cardiac scenario requiring interpretation, not recall" },
  { icon: CheckCircle2, label: "Practice Items", desc: "Interpretation-first questions that force reasoning" },
];

export default async function HemodynamicsModulePage() {
  const access = await loadHemodynamicsAccess();

  if (!access.ok) {
    switch (access.reason) {
      case "sign_in_required":
        redirect("/login?next=/modules/hemodynamics");
      case "module_unavailable":
        redirect("/hemodynamic-monitoring");
      case "base_subscription_required":
        redirect("/pricing?ref=hemodynamics-fundamentals");
      case "tier_not_eligible":
        redirect("/hemodynamic-monitoring?ref=tier-not-eligible");
    }
  }

  const totalMinutes = HEMODYNAMICS_LESSON_INDEX.reduce(
    (acc, l) => acc + (l.estimatedMinutes ?? 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-400" aria-hidden />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Clinical Module</p>
              <h1 className="text-sm font-bold text-white">Hemodynamic Monitoring Fundamentals</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" aria-hidden />
            <span>{Math.round(totalMinutes / 60)} hours of content</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Module intro */}
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
            Included with your RN / NP subscription
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Understand hemodynamics, not just memorize it
          </h2>
          <p className="text-slate-300 leading-relaxed max-w-3xl">
            This module teaches hemodynamic monitoring from first principles. Every lesson explains the physiology first — why the waveform looks the way it does, what causes derangements, and how to reason through an unfamiliar scenario at 3 AM. Pattern recognition follows understanding.
          </p>
        </section>

        {/* Pedagogical framework */}
        <section aria-labelledby="framework-heading" className="mb-12">
          <h2 id="framework-heading" className="text-lg font-bold text-white mb-4">Every lesson follows this framework</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FRAMEWORK_SECTIONS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-blue-400" aria-hidden />
                  <span className="text-sm font-semibold text-white">{label}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lesson list */}
        <section aria-labelledby="lessons-heading" className="mb-12">
          <h2 id="lessons-heading" className="text-lg font-bold text-white mb-4">
            {HEMODYNAMICS_LESSON_INDEX.length} lessons — mechanism to mastery
          </h2>
          <div className="space-y-2">
            {HEMODYNAMICS_LESSON_INDEX.map((lesson) => {
              const hasFullContent = HEMODYNAMICS_FULL_LESSONS.some((l) => l.id === lesson.id);
              const levelLabel = LEVEL_LABEL[lesson.level] ?? lesson.level;
              const levelColor = LEVEL_COLOR[lesson.level] ?? "bg-gray-50 text-gray-600 border-gray-100";

              return (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors group"
                >
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-700 flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-slate-300">{String(lesson.number).padStart(2, "0")}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">{lesson.title}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${levelColor}`}>
                        {levelLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{lesson.subtitle}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="text-xs text-slate-500">{lesson.estimatedMinutes} min</span>
                    {hasFullContent ? (
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" aria-hidden />
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Lock className="w-3 h-3" aria-hidden />
                        <span className="hidden sm:inline">Coming</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sample lesson preview: Lesson 1 */}
        <section aria-labelledby="preview-heading" className="mb-12">
          <h2 id="preview-heading" className="text-lg font-bold text-white mb-4">Preview: Lesson 1 — Introduction to Hemodynamics</h2>

          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <p className="text-sm text-slate-300 font-semibold mb-2 uppercase tracking-widest">Mechanism</p>
              <p className="text-sm text-white leading-relaxed">
                Cardiac output (CO) = heart rate × stroke volume. Stroke volume is determined by three variables: <strong className="text-blue-300">preload</strong> (how much blood fills the ventricle before contraction), <strong className="text-blue-300">afterload</strong> (resistance the ventricle pumps against), and <strong className="text-blue-300">contractility</strong> (intrinsic muscle strength).
              </p>
            </div>

            <div className="p-6 border-b border-white/10">
              <p className="text-sm text-slate-300 font-semibold mb-3 uppercase tracking-widest">Normal Values</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { param: "Cardiac Output", val: "4–8 L/min", note: "Index by BSA for comparability" },
                  { param: "Cardiac Index", val: "2.5–4.0 L/min/m²", note: "<2.2 = cardiogenic territory" },
                  { param: "MAP", val: "70–100 mmHg", note: "Target ≥65 for organ perfusion" },
                  { param: "SVR", val: "800–1200 dynes·s/cm⁵", note: "Low = vasodilation; High = vasoconstriction" },
                ].map((row) => (
                  <div key={row.param} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                    <div>
                      <p className="text-xs font-semibold text-white">{row.param}</p>
                      <p className="text-sm font-bold text-blue-300">{row.val}</p>
                      <p className="text-[11px] text-slate-400">{row.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-b border-white/10">
              <p className="text-sm text-slate-300 font-semibold mb-2 uppercase tracking-widest">Common Trap</p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-400/20">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden />
                <p className="text-sm text-amber-200">
                  <strong>Equating normal BP with adequate perfusion.</strong> A patient can have SBP 110 with cardiac index 1.8 — normal blood pressure maintained by extreme vasoconstriction masking cardiogenic shock.
                </p>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-300 font-semibold mb-3 uppercase tracking-widest">Practice Question</p>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-white mb-3">
                  A patient with septic shock has MAP 58, CO 9.2 L/min, SVR 420. The ICU nurse correctly interprets this as:
                </p>
                <div className="space-y-2">
                  {[
                    "Cardiogenic shock — low MAP indicates pump failure",
                    "Distributive shock — high CO and low SVR indicate vasodilation",
                    "Hypovolemic shock — tachycardia and low MAP suggest volume depletion",
                    "Obstructive shock — elevated CO obstructs forward flow",
                  ].map((choice, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${i === 1 ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-200" : "bg-white/5 border border-white/10 text-slate-300"}`}
                    >
                      <span className="w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold border-current">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {choice}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {[
            { value: `${HEMODYNAMICS_LESSON_INDEX.length}`, label: "Lessons" },
            { value: `${Math.round(totalMinutes / 60)}h`, label: "Est. study time" },
            { value: "40+", label: "Practice questions" },
            { value: "10", label: "Clinical cases" },
          ].map(({ value, label }) => (
            <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Advanced upsell */}
        <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-rose-400" aria-hidden />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white mb-1">Advanced Hemodynamic Monitoring</p>
            <p className="text-sm text-slate-300">
              Swan-Ganz / PA catheter, cardiac index, SVR calculation, PAOP/wedge, SvO₂, vasopressor titration reasoning, and ICU case simulations. One-time add-on for RN and NP learners.
            </p>
          </div>
          <Link
            href="/advanced-hemodynamic-monitoring"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-400 transition-colors whitespace-nowrap"
          >
            Learn more
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </section>
      </main>
    </div>
  );
}
