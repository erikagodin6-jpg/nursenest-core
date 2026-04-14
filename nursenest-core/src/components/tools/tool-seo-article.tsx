import Link from "next/link";
import type { ReactNode } from "react";
import type { ToolSlug } from "@/lib/tools/tool-registry";
import { HUB, RN } from "@/lib/marketing/marketing-entry-routes";

type SeoBlock = {
  id: string;
  title: string;
  panel: "cool" | "warm" | "positive" | "muted";
  children: ReactNode;
};

const panelClass: Record<SeoBlock["panel"], string> = {
  cool: "border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)]",
  warm: "border-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)]",
  positive: "border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)]",
  muted: "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]",
};

function Section({ block }: { block: SeoBlock }) {
  return (
    <section
      aria-labelledby={`tool-seo-${block.id}`}
      className={`mb-8 rounded-2xl border p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6 ${panelClass[block.panel]}`}
    >
      <h2 id={`tool-seo-${block.id}`} className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">
        {block.title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--theme-body-text)] [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--theme-heading-text)] [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-[var(--theme-heading-text)]">
        {block.children}
      </div>
    </section>
  );
}

const RELATED = {
  ivInfusion: {
    lessons: [
      { href: RN.usLessons, label: "NCLEX-RN lesson library (US)" },
      { href: "/us/pn/nclex-pn/lessons", label: "NCLEX-PN lesson library (US)" },
      { href: HUB.examLessons, label: "Browse all exam lesson hubs" },
    ],
  },
  medMath: {
    lessons: [
      { href: RN.usLessons, label: "Clinical lessons for NCLEX-RN" },
      { href: "/us/pn/nclex-pn/lessons", label: "NCLEX-PN clinical lessons" },
      { href: HUB.questionBank, label: "Question bank overview" },
    ],
  },
  labValues: {
    lessons: [
      { href: RN.usLessons, label: "Pathway lessons for lab interpretation" },
      { href: HUB.examLessons, label: "All nursing exam lesson hubs" },
      { href: "/canada/rn/nclex-rn/lessons", label: "NCLEX-RN lessons (Canada)" },
    ],
  },
  electrolyteAbg: {
    lessons: [
      { href: RN.usLessons, label: "Respiratory and acid-base topics (RN hub)" },
      { href: "/us/pn/nclex-pn/lessons", label: "PN lesson hub" },
      { href: HUB.flashcards, label: "Flashcards by topic" },
    ],
  },
  transfusionSafety: {
    lessons: [
      { href: RN.usLessons, label: "RN lesson library" },
      { href: "/us/pn/nclex-pn/lessons", label: "PN lesson library" },
      { href: HUB.questionBank, label: "Practice questions by pathway" },
    ],
  },
} as const;

function RelatedLessons({ slug }: { slug: ToolSlug }) {
  const key =
    slug === "iv-infusion"
      ? "ivInfusion"
      : slug === "med-math"
        ? "medMath"
        : slug === "lab-values"
          ? "labValues"
          : slug === "electrolyte-abg"
            ? "electrolyteAbg"
            : "transfusionSafety";
  const items = RELATED[key].lessons;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="font-medium text-primary underline-offset-4 hover:underline">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

const CONTENT: Record<ToolSlug, SeoBlock[]> = {
  "iv-infusion": [
    {
      id: "what",
      title: "What this tool does",
      panel: "cool",
      children: (
        <>
          <p>
            <strong>IV drip calculation nursing</strong> means solving <strong>mL/hr</strong>, <strong>gtt/min</strong>, or{" "}
            <strong>infusion time</strong> from the volume, rate, and time clues in the order—the same setup as medication
            administration stems. For <strong>NCLEX</strong> and shift work, cross-check every result with the order and the
            patient; the common trap is correct math paired with a priority that ignores instability in the scenario.
          </p>
          <p>
            In practice, follow active orders, pump guardrails, and policy—escalate when the scenario and the numbers disagree.
          </p>
        </>
      ),
    },
    {
      id: "formula",
      title: "Formula explanation (pump rate, gtt/min, time)",
      panel: "muted",
      children: (
        <>
          <h3>Pump rate (mL/hr) from volume and time</h3>
          <p>
            When an infusion runs on a pump, the fundamental relationship is: <strong>rate (mL/hr) = total volume (mL) ÷ time (hours)</strong>.
            If time is given in minutes, convert to hours (minutes ÷ 60) before dividing. This is the same structure as “infuse 500 mL over 8 hours”
            items on nursing exams.
          </p>
          <h3>Manual drip rate (gtt/min)</h3>
          <p>
            For gravity tubing, drops per minute links mL/hr to the <strong>drop factor</strong> (gtt/mL) printed on the drip chamber package.
            A common form is: <strong>gtt/min = (mL/hr × gtt/mL) ÷ 60</strong>. The tool uses equivalent algebra so you can check your work both ways.
            Exam questions may give any two of rate, drop factor, or gtt/min and ask you to solve for the third.
          </p>
          <h3>Duration from volume and rate</h3>
          <p>
            If you know the bag volume and the ordered mL/hr, infusion time in hours is: <strong>time (hr) = volume (mL) ÷ rate (mL/hr)</strong>.
            This is useful for planning shifts, handoffs, and recognizing when a bag should finish.
          </p>
        </>
      ),
    },
    {
      id: "example",
      title: "Step-by-step example (worked NCLEX-style problem)",
      panel: "positive",
      children: (
        <>
          <p>
            <strong>Order:</strong> Infuse 1,000 mL lactated Ringer&apos;s over 10 hours on a pump. <strong>Find:</strong> the pump rate in mL/hr.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Identify volume = 1,000 mL and total time = 10 hr.</li>
            <li>Apply rate = 1,000 ÷ 10 = 100 mL/hr.</li>
            <li>
              Sanity-check: 100 mL/hr × 10 hr = 1,000 mL, which matches the bag. On the NCLEX, rounding rules follow the question stem; when in doubt,
              match the precision the item requests.
            </li>
          </ol>
          <p>
            <strong>Second check (drip):</strong> If the same order were gravity with a <strong>15 gtt/mL</strong> set and you already found 100 mL/hr, you can
            estimate gtt/min using the relationship between mL/hr, drop factor, and minutes. Always verify the drop factor from the tubing, not from memory.
          </p>
          <p>
            Another common variant: the stem gives <strong>mL remaining</strong> and <strong>current rate</strong>, then asks when the infusion will finish. That is
            the duration form—same underlying relationship, rearranged. Practice rewriting the algebra in both directions so you are not locked into only “find
            mL/hr.”
          </p>
        </>
      ),
    },
    {
      id: "mistakes",
      title: "Common mistakes & NCLEX traps",
      panel: "warm",
      children: (
        <>
          <ul>
            <li>
              <strong>Time units:</strong> Dividing by minutes without converting to hours (or mixing minutes and hours in the denominator).
            </li>
            <li>
              <strong>Drop factor errors:</strong> Using the wrong gtt/mL (macro vs micro) or forgetting to divide by 60 when converting mL/hr to gtt/min.
            </li>
            <li>
              <strong>Wrong bag or line:</strong> The math can be perfect while the route or solution is wrong—exams test whether you notice unsafe mismatch.
            </li>
            <li>
              <strong>Rounding drift:</strong> Rounding too early in multi-step problems; keep one extra decimal through the middle steps when allowed.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "scenario",
      title: "Practice scenario (clinical reasoning)",
      panel: "cool",
      children: (
        <>
          <p>
            Your patient has a maintenance infusion running at <strong>75 mL/hr</strong>. The remaining volume in the current bag is <strong>180 mL</strong>. Without
            changing the rate, about how many hours until the bag is empty? Which assessment findings would prompt you to reassess the order versus the pump
            versus the line?
          </p>
          <p>
            Reasoning path: time ≈ 180 ÷ 75 = 2.4 hr. Then think through occlusion alarms, infiltration, patient position, and whether the clinical picture still
            matches the indication for that fluid—NCLEX rewards <strong>safety and prioritization</strong>, not only the number.
          </p>
          <p>
            If the patient develops sudden dyspnea, hypotension, or chest pain during infusion, your first actions are not “re-run the calculator”—they are
            assessment, stopping the infusion when indicated, calling for help, and preparing for escalation per protocol. The math supports care; it does not replace
            clinical urgency.
          </p>
        </>
      ),
    },
    {
      id: "checklist",
      title: "Before you leave: infusion study checklist",
      panel: "positive",
      children: (
        <>
          <ul>
            <li>Convert time units once, write the conversion line on paper, then calculate rate or duration.</li>
            <li>State the drop factor from equipment, not recall, when estimating gtt/min.</li>
            <li>Cross-check: does your answer match the order&apos;s intent and the patient&apos;s clinical context?</li>
            <li>Pair every calculation with one safety action you would take if the result were unexpectedly high or low.</li>
          </ul>
        </>
      ),
    },
    {
      id: "related",
      title: "Related lessons & next steps",
      panel: "muted",
      children: (
        <>
          <p>
            Pair this <strong>IV drip calculator nursing</strong> practice with pathway lessons on fluid balance, electrolytes, and medication safety. Start here:
          </p>
          <RelatedLessons slug="iv-infusion" />
          <p className="text-xs text-[var(--theme-muted-text)]">
            Exam hub URLs use <code className="rounded bg-[var(--theme-page-bg)] px-1">/us/</code> and{" "}
            <code className="rounded bg-[var(--theme-page-bg)] px-1">/canada/</code> routing—choose the region that matches your registration context.
          </p>
        </>
      ),
    },
  ],
  "med-math": [
    {
      id: "what",
      title: "What this tool does",
      panel: "cool",
      children: (
        <>
          <p>
            The <strong>medication math</strong> tool helps you practice the same calculation patterns tested on the <strong>NCLEX</strong>: unit conversions,
            dose per kg, tablet splitting, liquid concentrations, and “total dose divided by frequency” problems. It is designed to keep your workflow aligned with
            safe medication administration: one clear question, explicit inputs, and a result you can double-check.
          </p>
          <p>
            Use it to build speed after you have mastered the concepts. On exams and at the bedside, the priority is <strong>accuracy and safety</strong>, not
            racing the clock without a verification step.
          </p>
          <p>
            High performers on the <strong>NCLEX medication math</strong> items treat every problem like a short safety brief: identify the patient and allergy
            context implied by the stem, confirm the route and frequency, then calculate. If the numbers work but the route is wrong for the drug, choose the safe
            nursing action—not the arithmetic answer alone.
          </p>
        </>
      ),
    },
    {
      id: "formula",
      title: "Core formulas you should own",
      panel: "muted",
      children: (
        <>
          <h3>Dose → amount to administer</h3>
          <p>
            If you know desired dose and available strength, you are essentially solving: <strong>amount to give = (desired ÷ available) × vehicle</strong>, where
            “vehicle” might be mL of liquid, number of tablets, or milligrams per unit. Always track units (mg vs mcg, mL vs tablets) explicitly—this is a classic
            NCLEX trap.
          </p>
          <h3>Weight-based dosing</h3>
          <p>
            For mg/kg orders, convert pounds to kilograms when needed (kg = lb ÷ 2.2), compute total mg, then map to the concentration on hand. Write the units in
            every line of work so you cannot accidentally invert a ratio.
          </p>
          <p>
            For liquid concentrations, think in “mg per mL” consistently. If the label says 25 mg/5 mL, you can simplify to mg/mL before you set up your proportion, or
            you can keep 5 mL as the denominator—either is fine if you stay consistent. Exam writers love problems where the vial volume is not 1 mL, because they
            test whether you can scale without panic.
          </p>
          <p>
            For tablets, remember measurable increments: you cannot administer 0.33 of a scored tablet if the stem says “do not split.” When splitting is allowed,
            document and teach the patient how to avoid uneven halves that change the dose day to day.
          </p>
        </>
      ),
    },
    {
      id: "example",
      title: "Step-by-step example",
      panel: "positive",
      children: (
        <>
          <p>
            <strong>Order:</strong> Give 0.3 mg IM. <strong>On hand:</strong> 0.5 mg/mL. <strong>Find:</strong> mL to administer.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Set up: mL = (0.3 mg ÷ 0.5 mg) × 1 mL.</li>
            <li>Compute: 0.3 ÷ 0.5 = 0.6 mL.</li>
            <li>
              Verify: 0.6 mL × 0.5 mg/mL = 0.3 mg. If your program requires rounding to a measurable syringe increment, follow the stem&apos;s rules.
            </li>
          </ol>
          <p>
            Extension drill: if the order were written per kg and the patient&apos;s weight changed since admission, recalculate before administration. NCLEX-style
            stems often embed a weight update, a renal consideration, or a “hold parameters” clause—read the whole scenario before touching the calculator.
          </p>
        </>
      ),
    },
    {
      id: "mistakes",
      title: "Common mistakes & NCLEX traps",
      panel: "warm",
      children: (
        <>
          <ul>
            <li>
              <strong>Decimal movement:</strong> mg ↔ mcg errors (factor of 1,000).
            </li>
            <li>
              <strong>Inverse ratios:</strong> Dividing the wrong term when setting up strength per mL.
            </li>
            <li>
              <strong>Frequency confusion:</strong> Confusing daily total with per-dose amounts across scheduled medications.
            </li>
            <li>
              <strong>Apothecary or household units</strong> appearing in older teaching items—convert cleanly to metric before calculating.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "scenario",
      title: "Practice scenario",
      panel: "cool",
      children: (
        <>
          <p>
            A child is ordered a weight-based dose. You have vials with different concentrations. Before calculating, what two identifiers must match the order,
            and what independent check reduces the risk of a tenfold concentration error?
          </p>
          <p>
            Follow-up: the parent asks why the volume is so small. How do you explain measurement accuracy, oral syringe use, and what to do if the child spits out
            part of the dose—without promising a replacement dose on your own authority?
          </p>
        </>
      ),
    },
    {
      id: "checklist",
      title: "Medication math checklist (exam day)",
      panel: "positive",
      children: (
        <>
          <ul>
            <li>Circle the unit of the desired dose and the unit of the supplied strength before algebra.</li>
            <li>Recheck mg versus mcg and mL versus tablets on every step.</li>
            <li>Ask: Does this route and frequency match the drug class and the patient population in the stem?</li>
            <li>Verify with a second method when the problem allows (ratio-and-proportion vs dimensional analysis).</li>
          </ul>
        </>
      ),
    },
    {
      id: "related",
      title: "Related lessons",
      panel: "muted",
      children: (
        <>
          <RelatedLessons slug="med-math" />
        </>
      ),
    },
  ],
  "lab-values": [
    {
      id: "what",
      title: "What this tool does",
      panel: "cool",
      children: (
        <>
          <p>
            The <strong>lab values</strong> reference supports quick recall of common adult reference ranges used in nursing school and on exams like the{" "}
            <strong>NCLEX</strong>. It is organized to help you connect numbers to clinical meaning: what “high” or “low” suggests, what to monitor next, and what
            questions belong in your assessment cluster (not isolated memorization).
          </p>
          <p>
            Reference intervals can vary slightly by laboratory method and patient population. Treat this as a <strong>study scaffold</strong>, not a substitute for
            your institution&apos;s printed ranges or provider interpretation.
          </p>
          <p>
            When students search for <strong>nursing lab values</strong> or <strong>NCLEX lab interpretation</strong>, the real skill is not flashcard speed—it is
            knowing which abnormality belongs in the first column of your nursing process (assessment vs analysis vs intervention) and which findings require immediate
            escalation.
          </p>
        </>
      ),
    },
    {
      id: "formula",
      title: "How to interpret labs (framework, not trivia)",
      panel: "muted",
      children: (
        <>
          <p>
            Instead of memorizing disconnected cutoffs, learn a repeatable pattern: <strong>trend + context + symptoms + associated risks</strong>. For example,
            rising creatinine with low urine output means something different in dehydration than in obstruction—your job is to connect the lab change to the
            patient story.
          </p>
          <p>
            On exams, labs often appear as part of a cluster (CBC, BMP, coags). Practice asking: <strong>what is the priority problem</strong>, and{" "}
            <strong>what intervention is safest first</strong>?
          </p>
          <p>
            For glucose, think about acute symptoms (altered mental status, diuresis, infection) and chronic control (adherence, steroids, steroids + infection).
            For hemoglobin, pair with vitals and bleeding risk rather than treating a single number. For WBC, differentiate infection stress response from marrow
            suppression contexts when the stem gives clues.
          </p>
        </>
      ),
    },
    {
      id: "example",
      title: "Step-by-step example (interpretation drill)",
      panel: "positive",
      children: (
        <>
          <p>
            You see sodium 128 mEq/L in a patient with heart failure on diuretics who feels nauseated and lethargic. List three findings you would correlate on
            review, two interventions you would expect to be considered, and one red flag that would change priority to rapid escalation.
          </p>
          <p>
            Add: what neurologic checks matter if sodium is corrected too quickly, and what intake/output pattern you would expect the charting to show if diuretics
            are driving the shift.
          </p>
        </>
      ),
    },
    {
      id: "mistakes",
      title: "Common mistakes & NCLEX traps",
      panel: "warm",
      children: (
        <>
          <ul>
            <li>
              <strong>Treating a single lab in isolation</strong> without the clinical picture.
            </li>
            <li>
              <strong>Confusing screening vs diagnostic tests</strong> for the same analyte in different settings.
            </li>
            <li>
              <strong>Ignoring critical trends</strong> when the “current” value is barely inside reference range.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "scenario",
      title: "Practice scenario",
      panel: "cool",
      children: (
        <>
          <p>
            Post-op patient: Hgb trending down, HR rising, BP soft. Which additional assessments and labs complete the picture before you choose between
            fluid resuscitation, bleeding evaluation, and escalation?
          </p>
          <p>
            Name two nursing actions that protect the patient while diagnostics are pending, and one communication element you would include in handoff so the next
            nurse can continue trend monitoring safely.
          </p>
        </>
      ),
    },
    {
      id: "checklist",
      title: "Lab value study checklist",
      panel: "positive",
      children: (
        <>
          <ul>
            <li>State the trend direction, not only whether a value is “high” or “low.”</li>
            <li>Pair each abnormal lab with at least one assessment finding and one risk.</li>
            <li>Identify the intervention that is safest first when the patient is unstable.</li>
            <li>Know when to escalate versus when to continue monitoring on a stable trajectory.</li>
          </ul>
        </>
      ),
    },
    {
      id: "related",
      title: "Related lessons",
      panel: "muted",
      children: (
        <>
          <RelatedLessons slug="lab-values" />
        </>
      ),
    },
  ],
  "electrolyte-abg": [
    {
      id: "what",
      title: "What this tool does",
      panel: "cool",
      children: (
        <>
          <p>
            This area supports <strong>electrolyte and ABG</strong> reasoning: relationships between pH, PaCO₂, bicarbonate, oxygenation, and key electrolytes such as
            potassium, sodium, calcium, and magnesium. For <strong>NCLEX</strong> preparation, the payoff is pattern recognition: metabolic vs respiratory
            processes, compensation expectations, and the nursing actions that protect airway, perfusion, and correction safety.
          </p>
          <p>
            Search intent around <strong>ABG interpretation nursing</strong> usually maps to three exam skills: naming the primary acid-base disturbance, identifying
            whether compensation is present, and choosing the safest nursing response when the patient is unstable. The numbers matter, but the airway and circulation
            come first.
          </p>
        </>
      ),
    },
    {
      id: "formula",
      title: "Core relationships (how the numbers talk to each other)",
      panel: "muted",
      children: (
        <>
          <h3>ABG interpretation (introductory)</h3>
          <p>
            Start with pH, then identify the primary process moving pH in the expected direction (CO₂ for respiratory, bicarbonate for metabolic in many classic
            teaching frames). Look for compensation that makes physiologic sense, and always pair numbers with ventilation, perfusion, and clinical status.
          </p>
          <h3>Electrolytes that love to pair with ABG questions</h3>
          <p>
            Potassium shifts with acid-base disturbances, calcium changes with albumin and critical illness, and sodium problems often present with neurologic changes.
            Exam items frequently test whether you protect the airway and treat emergent causes before “chasing numbers.”
          </p>
          <p>
            Oxygenation questions often pair PaO₂/FiO₂ thinking with clinical cues: work of breathing, mental status, and whether noninvasive support is appropriate for
            the scenario’s stability level. Always match the device and escalation pathway to the policy implied by the stem.
          </p>
        </>
      ),
    },
    {
      id: "example",
      title: "Step-by-step example",
      panel: "positive",
      children: (
        <>
          <p>
            pH 7.25, PaCO₂ 55 mmHg, HCO₃⁻ 24 mEq/L: describe the primary process in plain language, identify the system you would support first in a deteriorating
            patient, and name two bedside priorities while diagnostics continue.
          </p>
          <p>
            Add: if the patient is obtunded, what airway considerations take priority before detailed acid-base teaching, and what repeat blood gas timing is typically
            used to evaluate response to initial interventions?
          </p>
        </>
      ),
    },
    {
      id: "mistakes",
      title: "Common mistakes & NCLEX traps",
      panel: "warm",
      children: (
        <>
          <ul>
            <li>
              <strong>Labeling compensation as “mixed”</strong> without a full clinical story.
            </li>
            <li>
              <strong>Rapid correction of sodium</strong> without monitoring for osmotic demyelination risk in chronicity contexts.
            </li>
            <li>
              <strong>Replacing potassium</strong> without knowing renal function and monitoring rhythm.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "scenario",
      title: "Practice scenario",
      panel: "cool",
      children: (
        <>
          <p>
            A patient on diuretics has muscle cramps, a weak pulse, and a funny rhythm on the monitor. Which labs do you want urgently, what is your immediate safety
            focus, and what education will you reinforce before discharge?
          </p>
        </>
      ),
    },
    {
      id: "checklist",
      title: "Electrolyte & ABG checklist",
      panel: "positive",
      children: (
        <>
          <ul>
            <li>Stabilize airway, breathing, and circulation before deep diving into compensation labels.</li>
            <li>Name the primary process, then ask whether the patient’s story supports acute versus chronic patterns.</li>
            <li>Link potassium, calcium, and magnesium abnormalities to rhythm risk when the stem provides cardiac data.</li>
            <li>Choose the nursing action that matches policy-level escalation for the scenario’s severity.</li>
          </ul>
        </>
      ),
    },
    {
      id: "related",
      title: "Related lessons",
      panel: "muted",
      children: (
        <>
          <RelatedLessons slug="electrolyte-abg" />
        </>
      ),
    },
  ],
  "transfusion-safety": [
    {
      id: "what",
      title: "What this tool does",
      panel: "cool",
      children: (
        <>
          <p>
            The <strong>transfusion safety</strong> tool supports structured thinking through patient identifiers, informed consent themes, pre-transfusion checks,
            infusion monitoring, and reaction recognition. Nursing exams—including the <strong>NCLEX</strong>—reward the sequence: verify, monitor, recognize,
            intervene, and escalate.
          </p>
          <p>
            For <strong>blood transfusion nursing</strong> review, anchor your studying on systems: patient identification, product verification, vital sign
            monitoring intervals, and the specific symptom clusters that differentiate mild allergic reactions from hemolytic or septic transfusion emergencies as the
            stem presents them.
          </p>
        </>
      ),
    },
    {
      id: "formula",
      title: "What to memorize vs what to reason through",
      panel: "muted",
      children: (
        <>
          <p>
            Instead of a single formula, learn a <strong>time-based checklist</strong>: baseline vitals, rate initiation rules per policy, interval monitoring, and
            stop conditions for fever, pain, dyspnea, urticaria, or hypotension. Your program and facility policies are authoritative—use this page to practice the
            reasoning categories those policies encode.
          </p>
          <p>
            Documentation is part of safety: what you assessed, what you notified, what you stopped or continued, and patient education about expected sensations versus
            warning symptoms. Exam questions often test whether you communicate clearly during a reaction, not only whether you recognize it.
          </p>
        </>
      ),
    },
    {
      id: "example",
      title: "Step-by-step example (reaction recognition)",
      panel: "positive",
      children: (
        <>
          <p>
            Ten minutes after starting, the patient reports chills and back pain, BP is dropping, and you hear new anxiety in their voice. What do you do first with
            the infusion, what do you call for, and what data do you collect for the provider and blood bank workflow?
          </p>
        </>
      ),
    },
    {
      id: "mistakes",
      title: "Common mistakes & NCLEX traps",
      panel: "warm",
      children: (
        <>
          <ul>
            <li>
              <strong>Skipping two-nurse verification</strong> concepts when the scenario tests safety systems.
            </li>
            <li>
              <strong>Treating all reactions the same</strong> without airway and circulation first when indicated.
            </li>
            <li>
              <strong>Stopping monitoring</strong> too early after an uneventful first few minutes.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "scenario",
      title: "Practice scenario",
      panel: "cool",
      children: (
        <>
          <p>
            A patient with a history of previous transfusion reaction needs blood. What history questions matter most, what premedication discussions belong to the
            provider, and what will you teach the patient about symptoms to report immediately?
          </p>
        </>
      ),
    },
    {
      id: "checklist",
      title: "Transfusion safety checklist",
      panel: "positive",
      children: (
        <>
          <ul>
            <li>Verify patient identity and product match using your facility’s required process.</li>
            <li>Establish baseline vitals; monitor per policy after start and after rate changes.</li>
            <li>Stay at the bedside during the critical first minutes when the stem emphasizes high risk.</li>
            <li>Stop, assess, notify, and support airway and circulation first when reaction symptoms appear.</li>
          </ul>
        </>
      ),
    },
    {
      id: "related",
      title: "Related lessons",
      panel: "muted",
      children: (
        <>
          <RelatedLessons slug="transfusion-safety" />
        </>
      ),
    },
  ],
};

export function ToolSeoArticle({ slug }: { slug: ToolSlug }) {
  const blocks = CONTENT[slug];
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-2 sm:px-6 lg:px-8">
      <div className="border-t border-[var(--semantic-border-soft)] pt-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Nursing guide</p>
        <p className="mb-8 text-sm text-[var(--theme-muted-text)]">
          Exam-focused context for this calculator. For clinical care, follow orders, policies, and local protocols.
        </p>
        {blocks.map((block) => (
          <Section key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
