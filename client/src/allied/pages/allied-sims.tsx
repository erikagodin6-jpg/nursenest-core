import { useState } from "react";
import { useParams, Link } from "wouter";
import { getCareerByRouteSlug, getCanonicalRoute, type CareerConfig } from "@shared/careers";
import { Zap, ChevronRight, ArrowRight, CheckCircle2, AlertTriangle, Clock, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
interface SimStage {
  title: string;
  narrative: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

function getSampleSim(career: CareerConfig): {
title: string; intro: string; patient: string; stages: SimStage[] } {
  const simsByCareer: Record<string, any> = {
    rrt: {
      title: "COPD Exacerbation with Respiratory Failure",
      intro: "You are called to assess a patient in the emergency department with increasing respiratory distress.",
      patient: "68-year-old male with history of COPD, current smoker, presenting with worsening dyspnea over 3 days.",
      stages: [
        { title: "Initial Assessment", narrative: "Patient is sitting upright, using accessory muscles. RR 32, SpO2 82% on room air, HR 110, BP 150/90. Pursed lip breathing noted.", question: "What is your first priority?", options: ["Apply supplemental oxygen via nasal cannula at 2 L/min", "Immediately intubate the patient", "Obtain arterial blood gas", "Start IV antibiotics"], correctIndex: 0, feedback: "Correct. In COPD patients, start with low-flow O2 (1-2 L/min) to avoid suppressing hypoxic drive. Titrate to SpO2 88-92%." },
        { title: "ABG Results", narrative: "ABG drawn after O2 applied: pH 7.28, PaCO2 68 mmHg, PaO2 58 mmHg, HCO3 30 mEq/L. SpO2 improved to 88%.", question: "How do you interpret this ABG?", options: ["Respiratory alkalosis with compensation", "Acute on chronic respiratory acidosis", "Metabolic acidosis with respiratory compensation", "Normal ABG values"], correctIndex: 1, feedback: "Correct. pH is acidotic, PaCO2 elevated (respiratory acidosis), and HCO3 elevated (chronic compensation). The acute pH drop indicates acute-on-chronic respiratory acidosis." },
        { title: "Treatment Decision", narrative: "Patient's respiratory rate remains elevated at 28. He is becoming drowsy. SpO2 92% on 2L NC.", question: "What is the most appropriate next intervention?", options: ["Increase nasal cannula to 6 L/min", "Initiate BiPAP (non-invasive ventilation)", "Prepare for immediate intubation", "Administer IV sedation for comfort"], correctIndex: 1, feedback: "Correct. BiPAP is first-line for acute COPD exacerbation with respiratory acidosis. It reduces work of breathing, improves gas exchange, and may prevent intubation." },
      ],
    },
    paramedic: {
      title: "Multi-Vehicle Collision: Triage and Management",
      intro: "You arrive on scene at a highway multi-vehicle collision with 3 patients requiring assessment.",
      patient: "Scene: 3-car pile-up. You are the first paramedic crew on scene. Bystanders are flagging you down.",
      stages: [
        { title: "Scene Size-Up", narrative: "Scene is on a highway shoulder. Fire department not yet on scene. Three vehicles involved, one with deployed airbags.", question: "What is your first action?", options: ["Triage all patients immediately using START", "Request additional resources and establish command", "Begin treating the closest patient", "Direct bystanders to move patients to safety"], correctIndex: 1, feedback: "Correct. Scene safety and establishing incident command come first. Request additional resources early. Do not begin triage until the scene is safe." },
        { title: "Primary Survey - Patient A", narrative: "Patient A: 45M, ambulatory, holding his neck, complaining of pain. GCS 15. Airway clear, breathing normal, radial pulse present.", question: "What triage category for this patient?", options: ["Red (Immediate)", "Yellow (Delayed)", "Green (Minor)", "Black (Deceased/Expectant)"], correctIndex: 1, feedback: "Correct. Patient is ambulatory (initially suggests Green), but cervical spine complaint with mechanism warrants Yellow (Delayed). Needs immobilization but is stable." },
        { title: "Critical Patient", narrative: "Patient C: 22F, unresponsive in vehicle. Airway: snoring respirations. Breathing: labored, RR 8. No radial pulse, carotid weak. GCS 6.", question: "What is your immediate intervention?", options: ["Full spinal immobilization first", "Open airway with jaw thrust, assist ventilations", "Start IV access for fluid resuscitation", "Apply tourniquet to visible extremity bleeding"], correctIndex: 1, feedback: "Correct. Airway management is the immediate priority. Use jaw thrust (suspected c-spine injury) and assist ventilations with BVM for RR of 8. Follow MARCH/ABCDE." },
      ],
    },
    "pharmacy-tech": {
      title: "High-Alert Medication Verification Error",
      intro: "You are working in the inpatient pharmacy when a critical medication order comes through.",
      patient: "Order received: Insulin glargine 100 units subcutaneous at bedtime for a newly admitted diabetic patient.",
      stages: [
        { title: "Order Review", narrative: "The physician ordered 'Insulin glargine 100 units SC QHS.' You notice the dose seems unusually high for a new patient.", question: "What should you do first?", options: ["Fill the order as written since the physician ordered it", "Flag the order and consult the pharmacist before dispensing", "Change the dose to 10 units without notifying anyone", "Call the nurse to verify the patient's weight"], correctIndex: 1, feedback: "Correct. Insulin is a high-alert medication. Doses over 80 units of basal insulin are uncommon for new patients. Always flag potentially unsafe doses for pharmacist review." },
        { title: "Pharmacist Clarification", narrative: "The pharmacist contacts the physician who confirms the dose should be 10 units, not 100. A near-miss report is generated.", question: "What type of error was this?", options: ["Dispensing error", "Prescribing error", "Administration error", "Monitoring error"], correctIndex: 1, feedback: "Correct. This was a prescribing error caught during the verification process. The tech's vigilance in flagging the unusual dose prevented a potentially fatal insulin overdose." },
        { title: "ISMP Alert", narrative: "You are asked to help implement a safety protocol for insulin orders going forward.", question: "Which safety measure is most effective for preventing insulin dosing errors?", options: ["Requiring all insulin orders to include the indication and patient weight", "Banning all insulin from the pharmacy", "Having nurses double-check doses after administration", "Color-coding all insulin vials"], correctIndex: 0, feedback: "Correct. ISMP recommends that insulin orders include indication, patient weight, and dose calculation. This provides context for verification and catches potential errors." },
      ],
    },
    mlt: {
      title: "Critical QC Failure in Hematology",
      intro: "During your morning quality control run in the hematology lab, you notice a control result outside acceptable range.",
      patient: "QC Run: Level 2 (Normal) control for CBC analyzer. WBC result is 15.2 (expected range 6.0-9.0 x10^3/uL).",
      stages: [
        { title: "Initial QC Assessment", narrative: "The Level 2 control WBC is significantly above the expected range. Level 1 (Low) control was within range. Level 3 (High) control has not been run yet.", question: "What is your first action?", options: ["Report all patient results run this morning", "Repeat the Level 2 control with a fresh aliquot", "Continue running patient samples", "Shut down the analyzer for maintenance"], correctIndex: 1, feedback: "Correct. Always repeat the out-of-range control with a fresh aliquot before escalating. The error could be a sample-related issue rather than an instrument problem." },
        { title: "Repeated QC", narrative: "Repeated Level 2 control: WBC 14.8. Still out of range. You apply Westgard rules.", question: "Which Westgard rule violation does this represent?", options: ["1-2s warning", "1-3s rejection", "2-2s rejection", "R-4s rejection"], correctIndex: 1, feedback: "Correct. The result exceeds 3 standard deviations from the mean (1-3s rule), which is an immediate rejection rule. No patient results should be reported until the issue is resolved." },
        { title: "Corrective Action", narrative: "After recalibration and fresh reagent, QC passes. You need to determine which patient results are affected.", question: "Which patient results need to be reviewed?", options: ["Only results run after the failed QC", "All results run since the last acceptable QC", "All results from the past 24 hours", "No results need review since QC now passes"], correctIndex: 1, feedback: "Correct. All patient results run since the last acceptable QC must be evaluated. This is the bracketed QC approach - results between the last good QC and current corrective action are potentially affected." },
      ],
    },
    imaging: {
      title: "Contrast Reaction Emergency",
      intro: "You are performing a CT scan with IV contrast when the patient begins showing signs of an adverse reaction.",
      patient: "52-year-old female undergoing CT abdomen/pelvis with iodinated contrast. No known allergies documented.",
      stages: [
        { title: "Reaction Onset", narrative: "Two minutes after contrast injection, patient reports throat tightness, develops urticaria on chest and arms. HR increases to 108, BP 130/85.", question: "What severity level is this reaction?", options: ["Mild reaction", "Moderate reaction", "Severe reaction", "Normal side effect of contrast"], correctIndex: 1, feedback: "Correct. Throat tightness with urticaria and tachycardia indicates a moderate reaction. Mild would be only urticaria/pruritis. Severe would include respiratory distress, hypotension, or loss of consciousness." },
        { title: "Immediate Response", narrative: "Patient's symptoms are progressing. She now has audible wheezing and difficulty speaking.", question: "What is the priority intervention?", options: ["Complete the CT scan quickly then treat", "Stop contrast, call code team, prepare epinephrine", "Give oral diphenhydramine and continue monitoring", "Have the patient sit up and breathe slowly"], correctIndex: 1, feedback: "Correct. This is escalating to a severe reaction. Stop contrast immediately, activate emergency response, and prepare IM epinephrine (0.3mg 1:1000). Airway compromise requires immediate intervention." },
        { title: "Post-Event", narrative: "Emergency team treated with epinephrine and the patient stabilized. She is being observed in the ED.", question: "What documentation is essential?", options: ["Note the reaction in the patient's allergy list and contrast reaction registry", "No documentation needed since the patient recovered", "Only document in the radiology report", "File an incident report but do not update the allergy list"], correctIndex: 0, feedback: "Correct. Document the specific contrast agent, reaction type/severity, treatment given, and outcome. Update the patient's allergy/adverse reaction list so future providers can premedicate or use alternative agents." },
      ],
    },
  };
  return simsByCareer[career.slug] || simsByCareer.rrt;
}

export default function AlliedSimsPage() {
  const params = useParams<{ careerSlug: string }>();
  const career = getCareerByRouteSlug(params.careerSlug || "");
  const { user } = useAuth();
  const isPro = user?.tier === "admin" || user?.subscriptionStatus === "active";

  const [started, setStarted] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!career) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.alliedSims.careerNotFound")}</h1></div>;
  }

  const seoElement = (
    <AlliedSEO
      title={`${career.name} Case Simulations - Clinical Scenarios`}
      description={`Practice ${career.name} clinical decision-making with unfolding case simulations. Realistic patient scenarios that mirror ${career.examNames[0]} exam formats and build critical thinking skills.`}
      keywords={`${career.name} case simulations, ${career.name} clinical scenarios, ${career.examNames[0]} case studies, clinical decision making, ${career.name} exam practice`}
      canonicalPath={`/career/${params.careerSlug}/sims`}
    />
  );

  const sim = getSampleSim(career);
  const stage = sim.stages[stageIdx];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (idx === stage.correctIndex) setScore(s => s + 1);
  };

  const nextStage = () => {
    if (stageIdx < sim.stages.length - 1) {
      setStageIdx(i => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center" data-testid="sim-debrief">
        {seoElement}
        <CheckCircle2 className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.alliedSims.caseComplete")}</h1>
        <p className="text-gray-600 mb-4">{sim.title}</p>
        <div className="text-4xl font-bold text-teal-600 mb-2">{score}/{sim.stages.length}</div>
        <p className="text-gray-500 mb-8">{t("allied.alliedSims.stagesAnsweredCorrectly")}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setStarted(false); setStageIdx(0); setScore(0); setCompleted(false); setSelectedAnswer(null); setAnswered(false); }} className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-restart-sim">{t("allied.alliedSims.tryAgain")}</button>
          <Link href={getCanonicalRoute(career.slug)} className="px-6 py-2.5 bg-white text-teal-700 rounded-xl text-sm font-medium border border-teal-200 hover:bg-teal-50" data-testid="button-back-career">Back to {career.shortName}</Link>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8" data-testid="allied-sims-page">
        {seoElement}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href={getCanonicalRoute(career.slug)} className="hover:text-teal-600">{career.shortName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-teal-700 font-medium">{t("allied.alliedSims.caseSimulators")}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-sims-title">{career.shortName} Case Simulators</h1>
        <p className="text-gray-600 mb-8">{t("allied.alliedSims.unfoldingClinicalScenariosWithDecision")}</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-200 hover:shadow-md transition-all" data-testid="sim-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-teal-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{sim.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{sim.intro}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t("allied.alliedSims.10Min")}</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {sim.patient.split(",")[0]}</span>
                <span>{sim.stages.length} stages</span>
              </div>
              <button onClick={() => setStarted(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-start-sim">
                Start Case <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" data-testid="sim-session">
      {seoElement}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">Stage {stageIdx + 1} of {sim.stages.length}</span>
        <span className="text-sm font-medium text-teal-700">{sim.title}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${((stageIdx + 1) / sim.stages.length) * 100}%` }} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">{stage.title}</h3>
        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-700 leading-relaxed" data-testid="text-narrative">{stage.narrative}</div>
        <p className="font-medium text-gray-900 mb-4" data-testid="text-sim-question">{stage.question}</p>
        <div className="space-y-3">
          {stage.options.map((opt, idx) => {
            let cls = "border-gray-200 hover:border-teal-300";
            if (answered) {
              if (idx === stage.correctIndex) cls = "border-green-300 bg-green-50";
              else if (idx === selectedAnswer) cls = "border-red-300 bg-red-50";
            } else if (idx === selectedAnswer) cls = "border-teal-400 bg-teal-50";
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} className={`w-full text-left px-4 py-3 rounded-xl border ${cls} transition-all text-sm text-gray-700`} data-testid={`sim-option-${idx}`}>
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <div className="bg-teal-50 rounded-xl border border-teal-100 p-5 mb-4" data-testid="sim-feedback">
          <div className="flex items-start gap-2">
            {selectedAnswer === stage.correctIndex ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-teal-900 leading-relaxed">{stage.feedback}</p>
          </div>
        </div>
      )}

      {answered && (
        <button onClick={nextStage} className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="button-next-stage">
          {stageIdx < sim.stages.length - 1 ? "Next Stage" : "View Debrief"}
        </button>
      )}
    </div>
  );
}
