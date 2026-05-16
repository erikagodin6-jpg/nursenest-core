import { redirect } from "next/navigation";
import { loadHemodynamicsAccess } from "@/lib/advanced-hemodynamics/advanced-hemodynamics-access";

export const dynamic = "force-dynamic";

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hemodynamic Monitoring Fundamentals</h1>
        <p className="text-gray-600">
          Perfusion basics, preload, afterload, contractility, MAP, arterial lines, CVP, cardiac output, shock states, and nursing priorities.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: "Perfusion & MAP", desc: "Mean arterial pressure calculation, normal ranges, and organ perfusion thresholds" },
          { title: "Preload & Afterload", desc: "Frank-Starling mechanism, clinical correlates, and hemodynamic manipulators" },
          { title: "Arterial Lines", desc: "Waveform interpretation, zeroing, dampening, and troubleshooting" },
          { title: "Central Venous Pressure", desc: "CVP normal range, interpretation in volume status and cardiac function" },
          { title: "Cardiac Output", desc: "Fick principle, CO determinants, and clinical estimation" },
          { title: "Shock States", desc: "Distributive, cardiogenic, hypovolemic, and obstructive shock hemodynamic profiles" },
          { title: "Vasopressors", desc: "Norepinephrine, dopamine, vasopressin — mechanism and hemodynamic effects" },
          { title: "Nursing Priorities", desc: "Assessment, alarm response, documentation, and escalation triggers" },
        ].map((module) => (
          <div key={module.title} className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
            <h2 className="font-bold text-gray-900 mb-1">{module.title}</h2>
            <p className="text-sm text-gray-600">{module.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 rounded-xl border border-rose-100 bg-rose-50">
        <p className="text-sm font-semibold text-rose-800 mb-1">Ready for advanced hemodynamics?</p>
        <p className="text-sm text-rose-700">
          Unlock Swan-Ganz catheters, cardiac index, SVR, PAOP, SvO2, vasopressor reasoning, and ICU case simulations with the Advanced Hemodynamic Monitoring add-on ($149 CAD one-time).
        </p>
        <a href="/advanced-hemodynamic-monitoring" className="inline-block mt-3 text-sm font-semibold text-rose-700 hover:text-rose-900 underline underline-offset-2">
          Explore Advanced Hemodynamics →
        </a>
      </div>
    </div>
  );
}
