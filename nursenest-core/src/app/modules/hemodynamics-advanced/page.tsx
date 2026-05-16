import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowRight, Lock } from "lucide-react";
import { loadAdvancedHemodynamicsAccess } from "@/lib/advanced-hemodynamics/advanced-hemodynamics-access";

export const dynamic = "force-dynamic";

const ADVANCED_CURRICULUM = [
  { title: "Swan-Ganz / Pulmonary Artery Catheter", desc: "Insertion waveform progression, wedge pressure, and troubleshooting" },
  { title: "Cardiac Index & Output", desc: "Thermodilution, Fick principle, and clinical interpretation" },
  { title: "SVR & PVR", desc: "Systemic and pulmonary vascular resistance: calculation and manipulation" },
  { title: "Stroke Volume Variation (SVV)", desc: "Dynamic fluid responsiveness predictor with mechanical ventilation" },
  { title: "PAOP / Wedge Pressure", desc: "Left heart preload estimation, cardiogenic vs non-cardiogenic pulmonary edema" },
  { title: "Mixed Venous O2 Saturation (SvO2)", desc: "Oxygen delivery/consumption balance, SvO2 vs ScvO2" },
  { title: "Septic Shock Hemodynamics", desc: "Vasodilation, low SVR, high CO, SvO2 misinterpretation pitfalls" },
  { title: "Cardiogenic Shock", desc: "Low CO, elevated PAOP, elevated SVR — vasopressor + inotrope selection" },
  { title: "Vasopressor Reasoning", desc: "Norepinephrine, vasopressin, epinephrine, phenylephrine — when to add vs switch" },
  { title: "Fluid Responsiveness", desc: "PLR, SVV, PPV, IVC collapsibility — evidence-based assessment" },
  { title: "Waveform Interpretation", desc: "PA waveform artifacts, overwedging, air emboli, catheter migration" },
  { title: "ICU Case Simulations", desc: "Multi-parameter hemodynamic decision-making with clinical feedback" },
];

export default async function AdvancedHemodynamicsModulePage() {
  const access = await loadAdvancedHemodynamicsAccess();

  if (!access.ok) {
    switch (access.reason) {
      case "sign_in_required":
        redirect("/login?next=/modules/hemodynamics-advanced");
      case "module_unavailable":
        redirect("/advanced-hemodynamic-monitoring");
      case "base_subscription_required":
        redirect("/pricing?ref=advanced-hemodynamics");
      case "tier_not_eligible":
        redirect("/hemodynamic-monitoring?ref=tier-not-eligible");
      case "advanced_hemodynamics_upgrade_required":
        // Fall through to render the upgrade wall below
        break;
    }
  }

  if (access.ok) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Advanced Hemodynamic Monitoring</h1>
          <p className="text-gray-600">Swan-Ganz catheters, cardiac index, SVR, PAOP, SvO2, vasopressor reasoning, and ICU case simulations.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {ADVANCED_CURRICULUM.map((module) => (
            <div key={module.title} className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
              <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500 shrink-0" />
                {module.title}
              </h2>
              <p className="text-sm text-gray-600">{module.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Upgrade wall — user has base access but not the advanced hemodynamics entitlement
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center" id="upgrade">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
        <Lock className="w-6 h-6 text-rose-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Advanced Hemodynamic Monitoring</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Unlock Swan-Ganz catheter interpretation, cardiac index, SVR, PAOP/wedge pressure, SvO2, vasopressor reasoning, and ICU case simulations.
        One-time add-on for your active RN or NP subscription.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Add-on</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">$149 <span className="text-sm font-normal text-gray-500">CAD</span></p>
          <p className="text-sm text-gray-600 mb-4">Advanced Hemodynamic Monitoring</p>
          <Link href="/api/subscriptions/checkout/advanced-hemodynamics" className="block text-center px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all">
            Get Advanced Hemodynamics
          </Link>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Best value</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">$249 <span className="text-sm font-normal text-gray-500">CAD</span></p>
          <p className="text-sm text-gray-600 mb-4">Critical Care Bundle — Advanced ECG + Advanced Hemodynamics</p>
          <Link href="/critical-care-bundle" className="block text-center px-4 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-sm hover:brightness-110 transition-all">
            Get Critical Care Bundle
          </Link>
        </div>
      </div>

      <Link href="/advanced-hemodynamic-monitoring" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        Learn what's included
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
