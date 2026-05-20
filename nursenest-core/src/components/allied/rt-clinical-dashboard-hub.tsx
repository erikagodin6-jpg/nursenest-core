import Link from "next/link";

const ventilatorParameters = [
  ["FiO₂", "60%"],
  ["PEEP", "12"],
  ["TV", "420 mL"],
  ["RR", "24"],
  ["SpO₂", "88%"],
  ["Mode", "AC/VC"],
] as const;

const abgValues = [
  ["pH", "7.28"],
  ["PaCO₂", "61"],
  ["HCO₃", "29"],
  ["PaO₂", "54"],
] as const;

const recommendedReview = [
  "ARDS PEEP Strategy",
  "Auto-PEEP Recognition",
  "Ventilator Dyssynchrony",
  "Shunt vs V/Q Mismatch",
] as const;

const modules = [
  {
    title: "Mechanical Ventilation",
    subtitle: "Modes, alarms, compliance, dyssynchrony, ARDS",
    lessons: 28,
    progress: 54,
    href: "/us/allied/allied-health/lessons?alliedProfession=respiratory&topic=mechanical-ventilation",
  },
  {
    title: "ABG Interpretation",
    subtitle: "Compensation, mixed disorders, oxygenation failure",
    lessons: 21,
    progress: 72,
    href: "/us/allied/allied-health/lessons?alliedProfession=respiratory&topic=abg-interpretation",
  },
  {
    title: "Ventilator Waveforms",
    subtitle: "Pressure, flow, loops, air trapping, leaks",
    lessons: 16,
    progress: 38,
    href: "/us/allied/allied-health/lessons?alliedProfession=respiratory&topic=ventilator-waveforms",
  },
  {
    title: "Critical Care RT",
    subtitle: "ARDS, sepsis, shock, escalation, ICU deterioration",
    lessons: 19,
    progress: 41,
    href: "/us/allied/allied-health/lessons?alliedProfession=respiratory&topic=critical-care-respiratory-therapy",
  },
] as const;

const waveformCards = [
  {
    title: "Auto-PEEP Recognition",
    description:
      "Flow waveform does not return to baseline before the next breath. Evaluate expiratory time and air trapping.",
    status: "High Priority",
  },
  {
    title: "ARDS Compliance Failure",
    description: "Rising plateau pressure with worsening oxygenation and refractory hypoxemia.",
    status: "Critical Care",
  },
  {
    title: "Bronchospasm Pattern",
    description:
      "Scooped expiratory flow curve with prolonged exhalation and increasing airway resistance.",
    status: "Waveforms",
  },
] as const;

const cases = [
  "ARDS Oxygenation Collapse",
  "COPD Hypercapnic Failure",
  "Ventilator Alarm Crisis",
  "Post-Operative Respiratory Deterioration",
  "Status Asthmaticus with Air Trapping",
] as const;

function WaveformPreview() {
  return (
    <svg viewBox="0 0 800 180" className="h-full w-full" aria-hidden="true">
      <path
        d="M0 140 C40 20, 80 20, 120 140 S200 20, 260 140 S340 20, 420 140 S500 20, 580 140 S660 20, 740 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-cyan-300"
      />
      <path
        d="M0 145 H800"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="8 10"
        className="text-cyan-900"
      />
    </svg>
  );
}

export function RTClinicalDashboardHub() {
  return (
    <section className="min-h-screen bg-[#061018] text-slate-100" data-rt-clinical-dashboard="true">
      <div className="border-b border-cyan-950 bg-[#08131d]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-400">Respiratory Therapy</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">ICU Respiratory Dashboard</h1>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-cyan-900 bg-[#0b1722] px-4 py-3 shadow-2xl shadow-cyan-950/30">
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Clinical Readiness</div>
              <div className="text-sm font-medium text-emerald-300">Active Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-cyan-950 bg-gradient-to-br from-[#0b1621] to-[#081018] p-6 shadow-2xl shadow-cyan-950/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-cyan-400">Live Ventilator Simulation</div>
                <h2 className="mt-2 text-2xl font-semibold">ARDS Oxygenation Failure</h2>
              </div>

              <div className="rounded-2xl border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm text-red-200">
                Refractory Hypoxemia
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {ventilatorParameters.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-cyan-950 bg-[#0d1824] p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
                  <div className="mt-2 text-2xl font-semibold text-cyan-200">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-cyan-950 bg-[#08131d] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-cyan-400">Pressure-Time Waveform</div>
                  <div className="mt-1 text-sm text-slate-400">Rising plateau pressure with worsening compliance</div>
                </div>

                <div className="rounded-xl border border-amber-900 bg-amber-950/30 px-3 py-1 text-xs font-medium text-amber-300">
                  Compliance Alert
                </div>
              </div>

              <div className="mt-5 h-48 overflow-hidden rounded-2xl border border-cyan-950 bg-[#04080d] p-4">
                <WaveformPreview />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-cyan-950 bg-[#0b1621] p-6 shadow-xl shadow-cyan-950/10">
              <div className="text-xs uppercase tracking-[0.25em] text-cyan-400">ABG Interpreter</div>
              <h3 className="mt-2 text-xl font-semibold">Acid/Base Analysis</h3>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {abgValues.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-cyan-950 bg-[#07111a] p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
                    <div className="mt-2 text-2xl font-semibold text-cyan-200">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4 text-sm text-amber-100">
                <div className="font-semibold">Acute-on-Chronic Respiratory Acidosis</div>
                <div className="mt-2 text-amber-200/80">
                  Elevated bicarbonate indicates chronic retention with acute ventilatory decompensation.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-950 bg-[#0b1621] p-6 shadow-xl shadow-cyan-950/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-cyan-400">Study Focus</div>
                  <h3 className="mt-2 text-xl font-semibold">Recommended Review</h3>
                </div>

                <div className="rounded-xl border border-cyan-900 bg-cyan-950/20 px-3 py-1 text-xs text-cyan-200">
                  Adaptive
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {recommendedReview.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-cyan-950 bg-[#07111a] px-4 py-3">
                    <span className="text-sm text-slate-200">{item}</span>
                    <span className="text-xs text-cyan-300">Review</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-400">Learning Domains</div>
              <h2 className="mt-2 text-3xl font-semibold">Respiratory Therapy Curriculum</h2>
            </div>

            <Link
              href="/app/practice-tests/start?pathway=us-allied-core&alliedProfession=respiratory"
              className="rounded-2xl border border-cyan-800 bg-cyan-950/20 px-5 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-900/30"
            >
              Open Board Simulation
            </Link>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {modules.map((module) => (
              <div key={module.title} className="rounded-3xl border border-cyan-950 bg-[#0b1621] p-5 shadow-xl shadow-cyan-950/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{module.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{module.subtitle}</p>
                  </div>

                  <div className="rounded-xl border border-cyan-900 bg-cyan-950/20 px-3 py-2 text-xs text-cyan-300">
                    {module.lessons} lessons
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[#07111a]">
                    <div className="h-full rounded-full bg-cyan-400" style={{ width: `${module.progress}%` }} />
                  </div>
                </div>

                <Link
                  href={module.href}
                  className="mt-6 block w-full rounded-2xl border border-cyan-800 bg-cyan-950/10 px-4 py-3 text-center text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/30"
                >
                  Continue Module
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-cyan-950 bg-[#0b1621] p-6 shadow-xl shadow-cyan-950/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-cyan-400">Waveform Lab</div>
                <h3 className="mt-2 text-2xl font-semibold">Pattern Recognition</h3>
              </div>

              <div className="rounded-xl border border-cyan-900 bg-cyan-950/20 px-3 py-1 text-xs text-cyan-300">
                ICU Training
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {waveformCards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-cyan-950 bg-[#07111a] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-100">{card.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.description}</p>
                    </div>

                    <div className="whitespace-nowrap rounded-xl border border-cyan-900 bg-cyan-950/20 px-3 py-1 text-xs text-cyan-300">
                      {card.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-950 bg-[#0b1621] p-6 shadow-xl shadow-cyan-950/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-cyan-400">ICU Simulations</div>
                <h3 className="mt-2 text-2xl font-semibold">RT Clinical Cases</h3>
              </div>

              <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-3 py-1 text-xs text-red-200">
                High Acuity
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {cases.map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-cyan-950 bg-[#07111a] px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-slate-100">{item}</div>
                    <div className="mt-1 text-xs text-slate-500">Progressive ICU deterioration scenario</div>
                  </div>

                  <div className="rounded-xl border border-cyan-900 bg-cyan-950/20 px-3 py-1 text-xs text-cyan-300">
                    Case {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/app/cases?pathway=us-allied-core&alliedProfession=respiratory"
              className="mt-6 block w-full rounded-2xl border border-cyan-800 bg-cyan-950/10 px-5 py-4 text-center text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/30"
            >
              Launch ICU Simulation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RTClinicalDashboardHub;
