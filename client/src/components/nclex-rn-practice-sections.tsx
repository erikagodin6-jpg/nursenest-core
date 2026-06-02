import { useEffect, useMemo, useState } from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { getPoolStats } from "@/lib/question-pool";
import {
  ArrowRight, BookOpen, CheckCircle2, ClipboardList, GitBranch, Layers,
  LineChart, ListChecks, Sparkles, Target, XCircle,
} from "lucide-react";

function slugifySystem(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Map each body-system label from the bank to an NCLEX-RN Client Needs subcategory (test plan). */
function nclexSubcategoryForBodySystem(system: string): string {
  const s = system.toLowerCase();
  if (/immune|infection|isolation|precaution/i.test(s)) return "safety-infection";
  if (/legal|delegat|leadership|ethical|priorit|multi-system|fundamental|professional/i.test(s)) return "mgmt-care";
  if (/maternal|reproductive|prenatal|immuniz|pediatric|growth|screening|wellness|health.?promo/i.test(s)) return "health-promo";
  if (/psych|mental|grief|abuse|cultural|crisis|therapeutic/i.test(s)) return "psychosocial";
  if (/pharm|medication|drug|infusion|parenteral/i.test(s)) return "pharm";
  if (/lab|diagnostic|risk|perioper|assessment|vital|monitor/i.test(s)) return "risk-potential";
  if (/comfort|adl|mobility|nutrition|elimination|hygiene/i.test(s)) return "basic-care";
  return "physio-adaptation";
}

const NCLEX_ROWS: {
  id: string;
  planLabel: string;
  sublabel: string;
}[] = [
  { id: "mgmt-care", planLabel: "Safe & Effective Care Environment", sublabel: "Management of Care" },
  { id: "safety-infection", planLabel: "Safe & Effective Care Environment", sublabel: "Safety & Infection Control" },
  { id: "health-promo", planLabel: "Health Promotion & Maintenance", sublabel: "" },
  { id: "psychosocial", planLabel: "Psychosocial Integrity", sublabel: "" },
  { id: "basic-care", planLabel: "Physiological Integrity", sublabel: "Basic Care & Comfort" },
  { id: "pharm", planLabel: "Physiological Integrity", sublabel: "Pharmacological & Parenteral Therapies" },
  { id: "risk-potential", planLabel: "Physiological Integrity", sublabel: "Reduction of Risk Potential" },
  { id: "physio-adaptation", planLabel: "Physiological Integrity", sublabel: "Physiological Adaptation" },
];

export function NclexRnPracticePrepSections() {
  const [systems, setSystems] = useState<Record<string, number>>({});

  useEffect(() => {
    getPoolStats("rn").then((s) => setSystems(s.systems));
  }, []);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const row of NCLEX_ROWS) counts[row.id] = 0;
    for (const [sys, n] of Object.entries(systems)) {
      const key = nclexSubcategoryForBodySystem(sys);
      counts[key] = (counts[key] || 0) + n;
    }
    return counts;
  }, [systems]);

  const totalInCategories = useMemo(
    () => Object.values(categoryStats).reduce((a, b) => a + b, 0),
    [categoryStats],
  );

  const bestSystemForCategory = useMemo(() => {
    const best: Record<string, string> = {};
    for (const row of NCLEX_ROWS) best[row.id] = "";
    for (const [sys, n] of Object.entries(systems)) {
      const key = nclexSubcategoryForBodySystem(sys);
      if (!best[key] || n > (systems[best[key]] || 0)) best[key] = sys;
    }
    return best;
  }, [systems]);

  return (
    <div className="space-y-16 mb-16" data-testid="nclex-rn-prep-sections">
      {/* 1 — How to use */}
      <section id="how-to-use-questions" className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How to use these questions effectively</h2>
            <p className="text-sm text-gray-600 mt-1">Strategy beats volume. Use each item to train clinical judgment, not memorization speed.</p>
          </div>
        </div>
        <ol className="space-y-3 border-l-2 border-primary/25 pl-5 ml-3">
          {[
            "Answer first, then reveal — commit to a priority or action before reading options so you practice like CAT (no peeking at hints).",
            "Read every rationale, including distractors — NCLEX rewards knowing why the tempting wrong answers fail (scope, timing, risk).",
            "Tag your error pattern: Was it content (didn’t know the rule), interpretation (missed a cue), or execution (right idea, wrong first action)?",
            "Cap new items when review is backlogged — if your missed-question queue is growing, pause new volume and clear it.",
            "Connect to one lesson or lab value per session — pair a question cluster with a single deep review (e.g., K⁺ + ECG changes) so knowledge consolidates.",
          ].map((text, i) => (
            <li key={i} className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">{i + 1}. </span>
              {text}
            </li>
          ))}
        </ol>
      </section>

      {/* 2 — CAT */}
      <section id="how-nclex-works" className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700/10 flex items-center justify-center shrink-0">
            <GitBranch className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How the NCLEX actually works</h2>
            <p className="text-sm text-gray-600 mt-1">Computerized adaptive testing (CAT) estimates your ability as you go — it is not a fixed 150-item scan of every topic.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li><span className="font-semibold text-gray-900">Adaptive difficulty:</span> Each response updates the estimate of your ability; the next item is chosen to measure you efficiently.</li>
            <li><span className="font-semibold text-gray-900">Length:</span> Most candidates see <span className="whitespace-nowrap">85–150</span> scored items (RN), with pretest items possible depending on form — the exam stops when the pass/fail decision rules are met.</li>
            <li><span className="font-semibold text-gray-900">Pass/fail:</span> Outcome is based on whether you perform at or above the passing standard for that administration — not a curved percentage of the cohort.</li>
          </ul>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">CAT decision flow (simplified)</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-1 text-sm">
            {["Start", "Answer item", "Update ability estimate", "Enough info?", "Pass / Fail / Continue"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <div className="rounded-lg bg-gray-100 px-3 py-2 text-center text-gray-800 font-medium flex-1 border border-gray-200/80">{step}</div>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block shrink-0" />}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">NGN item types (case study, bow-tie, SATA, matrix) are scored within the same CAT framework — they are longer stems, not a separate exam.</p>
        </div>
      </section>

      {/* 3 — Category navigation */}
      <section id="nclex-categories" className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Browse by NCLEX-RN test plan category</h2>
            <p className="text-sm text-gray-600 mt-1">
              Counts reflect RN bank items grouped by Client Needs (body-system labels mapped to categories).{" "}
              {totalInCategories > 0 && (
                <span className="text-gray-800 font-medium">{totalInCategories.toLocaleString()} items classified.</span>
              )}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100 bg-white overflow-hidden">
          {NCLEX_ROWS.map((row) => {
            const count = categoryStats[row.id] ?? 0;
            const sys = bestSystemForCategory[row.id];
            const href = sys ? `/practice-questions/rn/${slugifySystem(sys)}` : "/practice-questions";
            return (
              <LocaleLink
                key={row.id}
                href={href}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3.5 hover:bg-primary/[0.03] transition-colors group"
                data-testid={`nclex-cat-${row.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{row.planLabel}</p>
                  {row.sublabel && <p className="text-xs text-gray-500">{row.sublabel}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm tabular-nums text-gray-600">{count.toLocaleString()} Qs</span>
                  <span className="text-xs font-medium text-primary group-hover:underline flex items-center gap-1">
                    Practice <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </LocaleLink>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3">Mapping uses body-system metadata in the bank; use filters inside practice for finer control.</p>
      </section>

      {/* 4 — Strong rationale */}
      <section id="sample-rationale" className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">What a strong rationale looks like</h2>
            <p className="text-sm text-gray-600 mt-1">Below is a representative acute-care stem with the level of reasoning NurseNest aims for on every option.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 overflow-hidden shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200/80 bg-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Sample item — Physiological Integrity</p>
            <p className="text-sm sm:text-[15px] text-slate-900 leading-relaxed">
              A patient with acute ST-elevation myocardial infarction (STEMI) arrives in the emergency department. Which intervention takes highest priority?
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
              <li><span className="font-mono text-xs text-slate-500 mr-2">A</span> Administer chewable aspirin 325 mg</li>
              <li><span className="font-mono text-xs text-slate-500 mr-2">B</span> Obtain a 12-lead ECG within 10 minutes</li>
              <li><span className="font-mono text-xs text-slate-500 mr-2">C</span> Activate the cardiac catheterization lab for PCI</li>
              <li><span className="font-mono text-xs text-slate-500 mr-2">D</span> Start a heparin infusion per protocol</li>
            </ul>
          </div>
          <div className="px-4 sm:px-6 py-4 space-y-4 text-sm text-slate-700 leading-relaxed">
            <div>
              <p className="flex items-center gap-2 font-semibold text-emerald-800 mb-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Correct answer (C) — why it wins
              </p>
              <p>
                STEMI care centers on timely reperfusion. Once STEMI is recognized, activating the cath lab for percutaneous coronary intervention (PCI) addresses the infarct-related artery directly; door-to-balloon time is a core quality metric because myocardium is lost in minutes.
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                <XCircle className="w-4 h-4 shrink-0" /> Incorrect options — what they miss
              </p>
              <ul className="space-y-2 pl-0 list-none">
                <li><span className="font-mono text-xs text-slate-500 mr-1">A</span> Aspirin is important early antiplatelet therapy but does not reperfuse an occluded vessel as the highest priority action after STEMI confirmation.</li>
                <li><span className="font-mono text-xs text-slate-500 mr-1">B</span> Rapid ECG is diagnostic and time-sensitive, yet once STEMI is identified, escalation to definitive reperfusion supersedes repeating the diagnostic step.</li>
                <li><span className="font-mono text-xs text-slate-500 mr-1">D</span> Anticoagulation may be ordered in the pathway, but it does not replace the need to restore flow in the culprit artery as the overriding intervention.</li>
              </ul>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200/70 px-4 py-3">
              <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-1">Clinical takeaway</p>
              <p className="text-amber-950/90">On the exam, “priority” in acute coronary syndrome usually means the action that limits infarct size — reperfusion first when STEMI criteria are met — not the first nursing task you might chart in routine order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — NGN preview */}
      <section id="ngn-preview" className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-sky-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Next Generation NCLEX (NGN) — question shapes you will see</h2>
            <p className="text-sm text-gray-600 mt-1">NGN measures clinical judgment in layered formats. Unlike older NCLEX with mostly independent multiple-choice, NGN often ties several items to one evolving case.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 p-4 bg-white">
              <p className="text-xs font-bold text-sky-800 uppercase tracking-wide mb-2">Bow-tie</p>
              <p className="text-sm text-gray-700">Two conditions/actions on the left and right connected to a central “anchor” outcome — tests whether you link assessment findings to the correct problem and priority intervention.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 bg-gradient-to-br from-white to-slate-50">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">Case study</p>
              <p className="text-sm text-gray-700">A multi-tab patient record with progressive data; follow-up questions depend on the same scenario — rewards integration, not isolated facts.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 p-4 bg-white">
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-2">SATA — Select all that apply</p>
              <p className="text-sm text-gray-700">Multiple correct options; partial scoring may apply depending on item design. Tests discrimination when more than one action is appropriate.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 bg-gradient-to-br from-white to-slate-50">
              <p className="text-xs font-bold text-violet-800 uppercase tracking-wide mb-2">Matrix / grid</p>
              <p className="text-sm text-gray-700">Rows (e.g., interventions) × columns (e.g., safe vs not) — fast check of rules across a set (isolation, consent, scope).</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Weak areas mock */}
      <section id="weak-areas-preview" className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <LineChart className="w-5 h-5 text-orange-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your weak areas will look like this</h2>
            <p className="text-sm text-gray-600 mt-1">Illustrative performance view — category accuracy and trend after you practice with tracking enabled.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm" data-testid="mock-weak-areas-report">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Session snapshot</p>
              <p className="text-lg font-bold text-gray-900">RN readiness — last 7 days</p>
            </div>
            <div className="text-sm text-emerald-700 font-semibold">Trend: +6% vs prior week</div>
          </div>
          <div className="p-4 sm:p-6 grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3">Accuracy by Client Needs (sample)</p>
              <ul className="space-y-2">
                {[
                  { label: "Physiological Adaptation", pct: 72, bar: "bg-emerald-500" },
                  { label: "Pharmacological Therapies", pct: 58, bar: "bg-amber-500" },
                  { label: "Safety & Infection Control", pct: 81, bar: "bg-emerald-600" },
                  { label: "Management of Care", pct: 64, bar: "bg-amber-400" },
                ].map((row) => (
                  <li key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">{row.label}</span>
                      <span className="tabular-nums text-gray-900 font-medium">{row.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full rounded-full ${row.bar}`} style={{ width: `${row.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3">Rolling performance</p>
              <div className="h-36 flex items-end gap-1 rounded-lg bg-slate-50 border border-slate-100 px-2 pb-2 pt-4">
                {[42, 48, 45, 55, 52, 61, 58].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div
                      className="w-full rounded-t bg-primary/80 min-h-[12px]"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-gray-400">{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Bars = weighted accuracy per study day. Spikes often follow focused review, not cramming.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 — Common mistakes */}
      <section id="common-mistakes" className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-red-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Common mistakes students make on the NCLEX</h2>
            <p className="text-sm text-gray-600 mt-1">Exam-specific pitfalls we see in item analysis — not generic “study harder” advice.</p>
          </div>
        </div>
        <ul className="space-y-3">
          {[
            "Choosing a true statement instead of the *best* nursing action — two options can be textbook-correct; CAT rewards the safest, most time-critical choice for that stem.",
            "Ignoring isolation or visitor rules in infection-control stems — partial understanding of PPE order or room assignment loses points on tight Safety items.",
            "Treating SATA like two correct answers when the stem requires *all* that apply — leaving one selected option unchecked because it felt “obvious.”",
            "Over-focusing lab numbers without the patient context — e.g., treating a potassium value without checking renal function, IV access, or ECG changes.",
            "Delegating assessment or teaching that must stay at the RN level — mixing LPN/UAP scope on Management-of-Care items.",
          ].map((text, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
              <span className="text-gray-400 font-mono text-xs pt-0.5 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 8 — Study progression */}
      <section id="study-progression" className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Study progression that matches how NCLEX measures you</h2>
            <p className="text-sm text-gray-600 mt-1">Close the loop on errors — the exam rewards stable judgment over one-off scores.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Practice", detail: "Timed or tutor mode with new items" },
              { label: "Analyze", detail: "Rationale + distractor review" },
              { label: "Review", detail: "Lesson, lab, or med reference tied to the gap" },
              { label: "Retest", detail: "Similar items or mixed block" },
              { label: "Readiness", detail: "Mock CAT + category balance check" },
            ].map((step, i) => (
              <div key={step.label} className="relative rounded-xl bg-white border border-indigo-100/80 px-3 py-3 shadow-sm">
                <span className="absolute -top-2 -left-1 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm font-bold text-indigo-900 pt-1">{step.label}</p>
                <p className="text-xs text-gray-600 mt-1 leading-snug">{step.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
            <ArrowRight className="w-3 h-3 text-indigo-400" />
            Flow left-to-right: each loop should tighten accuracy in your lowest category, not increase total question count alone.
          </p>
        </div>
      </section>
    </div>
  );
}
