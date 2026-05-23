import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FlaskConical, Lock, Zap } from "lucide-react";
import { loadAdvancedLabsAccess } from "@/lib/advanced-labs/advanced-labs-access";
import { ADVANCED_LABS_LESSON_INDEX } from "@/lib/advanced-labs/advanced-labs-curriculum";

export const dynamic = "force-dynamic";

const LEVEL_STYLE: Record<string, string> = {
  advanced: "bg-violet-50 text-violet-700",
  mastery: "bg-rose-50 text-rose-700",
};

export default async function AdvancedLabsModulePage() {
  const access = await loadAdvancedLabsAccess();

  if (!access.ok) {
    switch (access.reason) {
      case "sign_in_required":
        redirect("/login?next=/modules/labs-advanced");
      case "module_unavailable":
        redirect("/advanced-labs-interpretation");
      case "base_subscription_required":
        redirect("/pricing?ref=advanced-labs");
      case "tier_not_eligible":
        redirect("/labs-interpretation?ref=tier-not-eligible");
      case "advanced_labs_upgrade_required":
        // Fall through to upgrade wall
        break;
    }
  }

  const totalMinutes = ADVANCED_LABS_LESSON_INDEX.reduce(
    (acc, l) => acc + l.estimatedMinutes,
    0,
  );

  if (access.ok) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-emerald-400" aria-hidden />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Premium Module</p>
                <h1 className="text-sm font-bold text-white">Advanced Labs Interpretation</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" aria-hidden />
              <span>{Math.round(totalMinutes / 60)}h of content · {ADVANCED_LABS_LESSON_INDEX.length} lessons</span>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <section className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
              Advanced Labs Interpretation — Unlocked
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Clinical lab interpretation that drives decisions, not just documentation
            </h2>
            <p className="text-slate-300 leading-relaxed max-w-3xl">
              Every lesson teaches you to interpret labs in clinical context — not just compare numbers to normal ranges.
              You will understand what the bone marrow is doing, what the anion gap is telling you, and why the potassium
              will not stay up without magnesium.
            </p>
          </section>

          <section aria-labelledby="lessons-heading" className="mb-12">
            <h2 id="lessons-heading" className="text-lg font-bold text-white mb-4">
              {ADVANCED_LABS_LESSON_INDEX.length} lessons — from CBC to critical care electrolytes
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {ADVANCED_LABS_LESSON_INDEX.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/modules/labs-advanced/${lesson.slug}`}
                  className="group p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-400/30 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 w-5">
                        {String(lesson.number).padStart(2, "0")}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${LEVEL_STYLE[lesson.level] ?? ""}`}>
                        {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {lesson.estimatedMinutes} min
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-1 text-sm leading-snug group-hover:text-emerald-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{lesson.subtitle}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-400 group-hover:gap-2 transition-all">
                    Open lesson <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: `${ADVANCED_LABS_LESSON_INDEX.length}`, label: "Lessons" },
              { value: `${Math.round(totalMinutes / 60)}h`, label: "Est. study time" },
              { value: "30+", label: "Practice questions" },
              { value: "10", label: "Clinical cases" },
            ].map(({ value, label }) => (
              <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Upgrade wall
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center" id="upgrade">
      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <Lock className="w-6 h-6 text-emerald-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Advanced Labs Interpretation</h1>
      <p className="text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
        Unlock CBC mastery, anion gap calculation, DKA lab patterns, ABG interpretation, AKI staging,
        coagulation management, and critical care electrolytes.
        One-time add-on for your active RN or NP subscription.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Add-on</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">$149 <span className="text-sm font-normal text-gray-500">CAD</span></p>
          <p className="text-sm text-gray-600 mb-4">Advanced Labs Interpretation</p>
          <Link
            href="/api/subscriptions/checkout/advanced-labs"
            className="block text-center px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all"
          >
            Get Advanced Labs
          </Link>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Best value</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">$299 <span className="text-sm font-normal text-gray-500">CAD</span></p>
          <p className="text-sm text-gray-600 mb-4">Critical Care Bundle — ECG + Hemodynamics + Labs</p>
          <Link
            href="/critical-care-bundle"
            className="block text-center px-4 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-sm hover:brightness-110 transition-all"
          >
            Get Critical Care Bundle
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left">
        {[
          "CBC: RBC indices, differential, HIT recognition",
          "BMP/CMP: anion gap, electrolyte emergencies",
          "LFTs: hepatocellular vs cholestatic patterns",
          "Coagulation: PT/INR, aPTT, anti-Xa, DIC",
          "Lactate + sepsis-3 lab cluster",
          "ABG: 5-step systematic interpretation",
          "Cardiac markers: troponin kinetics, BNP",
          "DKA: complete lab pattern + K management",
          "AKI: KDIGO staging, FENa, nephrotoxins",
          "Critical electrolytes: Mg, phos, ionized Ca",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {item}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/advanced-labs-interpretation"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          Learn what&apos;s included <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/critical-care-bundle"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-100"
        >
          <Zap className="w-3.5 h-3.5" />
          Critical Care Bundle
        </Link>
      </div>
    </div>
  );
}
