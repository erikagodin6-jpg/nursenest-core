import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style psychiatry/suicide-risk case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_SUICIDE_RISK_LONGITUDINAL: PatientCase = {
  id: "cnple-sample-suicide-risk-001",
  title: "Ms. Julia Mercer — Depression, Suicide Risk, and Safety Planning",
  tagline: "Mental Health · Longitudinal Risk Assessment",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Canadian suicide risk assessment and safety planning principles",
      "Primary care depression management guidance",
      "Trauma-informed and culturally safer mental health care approaches",
    ],
  },
  patient: { age: 29, sex: "Female", pronouns: "she/her", setting: "NP-Led Primary Care Clinic" },
  chiefComplaint: "Exhaustion, hopelessness, insomnia, and worsening depression after relationship breakdown and work stress.",
  pmhx: [
    "Major depressive disorder",
    "Prior postpartum depression",
    "Migraine disorder",
    "No prior psychiatric hospitalization",
  ],
  medications: [
    { name: "Sertraline", dose: "50 mg", route: "PO", frequency: "daily", indication: "Depression" },
    { name: "Sumatriptan", dose: "PRN", route: "PO", frequency: "as needed", indication: "Migraine" },
  ],
  allergies: [{ substance: "No known drug allergies", reaction: "", severity: "mild" }],
  primaryDomain: "mental-health",
  secondaryDomains: ["professional-practice", "health-promotion-prevention", "acute-urgent-care"],
  difficulty: 5,
  stepCount: 3,
  estimatedMinutes: 20,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Initial suicide risk assessment",
      scenarioText:
        "Ms. Mercer, 29, presents tearful and exhausted. Over the past month she has had worsening insomnia, hopelessness, low appetite, guilt, and difficulty functioning at work after a recent separation and financial stress. She says, 'Sometimes I think everyone would be better off without me.' When asked directly, she admits to intermittent thoughts of wanting to disappear but denies a current plan or intent. She has been drinking wine nightly to sleep. She lives alone but speaks to her sister daily.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Depression with passive suicidal ideation, psychosocial stressors, insomnia, and alcohol use requiring structured suicide risk assessment.",
        newFindings: ["Hopelessness", "Passive suicidal thoughts", "Insomnia", "Alcohol use for sleep", "Lives alone", "Protective sister relationship"],
      },
      vitals: [{ label: "HR", value: "92", unit: "bpm" }, { label: "BP", value: "118/74", unit: "mmHg" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "mental-health",
      question: {
        stem: "Ms. Mercer reports passive suicidal thoughts without a disclosed plan or intent. What is the most appropriate NP response?",
        family: "suicide-risk-assessment-direct-questioning",
        options: [
          { id: "A", label: "Use direct, nonjudgmental suicide risk assessment including thoughts, plan, intent, means, protective factors, substance use, supports, and immediate safety while collaboratively determining disposition." },
          { id: "B", label: "Avoid asking detailed suicide questions because discussing suicide can increase suicide risk." },
          { id: "C", label: "Reassure her that passive thoughts are normal during breakups and book follow-up next month." },
          { id: "D", label: "Immediately call police despite no current plan, intent, or inability to engage in assessment." },
        ],
        correctOptionId: "A",
        rationale:
          "Evidence-based suicide risk assessment requires direct but compassionate questioning about thoughts, plan, intent, means, past attempts, supports, substance use, and protective factors. Asking about suicide does not implant suicidal thoughts. Passive ideation can still represent clinically significant risk, especially with hopelessness, isolation, alcohol use, insomnia, and worsening depression. Disposition should be individualized based on overall risk, ability to safety plan, supports, and evolving intent.",
        whyWrongByOptionId: {
          B: "Avoiding suicide questions misses critical safety information and is not evidence-based.",
          C: "Passive ideation plus functional decline and alcohol use requires structured assessment, not reassurance alone.",
          D: "Emergency intervention may be needed in some cases, but disposition should follow an actual risk assessment and current safety status.",
        },
        clinicalJudgmentFocus: "Performing a direct, trauma-informed suicide assessment without escalating unnecessarily or minimizing risk.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Ms. Mercer discloses worsening thoughts but remains engaged in assessment. Protective factors and risk factors are clarified, enabling collaborative safety planning." },
          B: { trajectory: "harmful", outcome: "Important risk details are missed and the patient feels unseen and unsupported." },
          C: { trajectory: "harmful", outcome: "Her symptoms worsen over several weeks without a safety plan or support structure." },
          D: { trajectory: "suboptimal", outcome: "She becomes fearful of future disclosure and distrusts mental health care after an unnecessarily coercive response." },
        },
      },
    },
    {
      index: 1,
      heading: "Safety planning and early follow-up",
      updateNarrative: "48 hours later — urgent mental health follow-up.",
      scenarioText:
        "Ms. Mercer returns for close follow-up. She denies active suicidal intent but says thoughts become stronger late at night when drinking. She admits she searched online for overdose information 3 nights ago but stopped when her sister called. She agrees she does not want to die but feels emotionally overwhelmed. She has no firearm access. Her sister is willing to stay with her temporarily.",
      clinicalUpdate: {
        direction: "critical",
        summary: "Risk has increased because preparatory behaviour emerged, but she remains help-seeking and collaborative with supports available.",
        newFindings: ["Searched overdose methods", "Nighttime worsening", "Alcohol-related escalation", "Supportive sister available", "No firearm access"],
      },
      vitals: [{ label: "HR", value: "88", unit: "bpm" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: { value: 48, unit: "hours", label: "48 hours later" },
      cnpleDomain: "mental-health",
      question: {
        stem: "Ms. Mercer now discloses searching overdose methods online but denies current intent and agrees to engage in care. What is the best NP plan?",
        family: "suicide-safety-planning-disposition",
        options: [
          { id: "A", label: "Create a collaborative written safety plan, reduce access to lethal means/medications, involve supports with consent, address alcohol use, arrange urgent mental health follow-up, and escalate to ED/emergency assessment if intent or inability to stay safe emerges." },
          { id: "B", label: "Rely only on a verbal promise not to self-harm and reassess in several weeks." },
          { id: "C", label: "Discharge with sleep medication only because insomnia is the main issue." },
          { id: "D", label: "Assume outpatient care is impossible because she searched methods online, regardless of current assessment and engagement." },
        ],
        correctOptionId: "A",
        rationale:
          "Method searching is a significant escalation in suicide risk and requires careful disposition assessment. However, not every patient with suicidal thoughts requires involuntary emergency intervention if they deny current intent, remain collaborative, can engage in safety planning, and have supports. The NP should create a detailed safety plan, address access to means, involve supports when appropriate, arrange rapid follow-up, address substances worsening risk, and maintain a low threshold for emergency escalation if risk intensifies.",
        whyWrongByOptionId: {
          B: "No-suicide contracts/promises alone are not evidence-based safety strategies.",
          C: "Sedatives alone do not address suicide risk drivers and may worsen overdose risk in some contexts.",
          D: "Disposition decisions require nuanced assessment rather than a single-factor rule.",
        },
        clinicalJudgmentFocus: "Balancing patient autonomy, outpatient safety planning, and escalation thresholds after preparatory suicidal behaviour.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "A detailed safety plan is completed. Her sister removes excess medications from the apartment and stays overnight during high-risk periods." },
          B: { trajectory: "harmful", outcome: "Risk escalates without a concrete safety structure or rapid reassessment." },
          C: { trajectory: "harmful", outcome: "Alcohol plus sedating medication worsens emotional dysregulation and overdose risk." },
          D: { trajectory: "suboptimal", outcome: "She disengages from outpatient care after feeling she lost control of the process despite remaining collaborative." },
        },
      },
    },
    {
      index: 2,
      heading: "Longitudinal recovery and relapse prevention",
      updateNarrative: "Six weeks later — structured follow-up.",
      scenarioText:
        "Ms. Mercer has reduced alcohol use, restarted therapy, and reports fewer suicidal thoughts. Sleep improved modestly after behavioural interventions and medication adjustment. She returned to part-time work. However, she worries that another crisis could happen suddenly. She says the written safety plan helped because she could not think clearly during severe distress. She asks whether recovery means she can stop follow-up soon.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Partial recovery with persistent relapse vulnerability and benefit from structured safety planning.",
        newFindings: ["Reduced alcohol use", "Therapy re-engagement", "Improved sleep", "Part-time work resumed", "Safety plan useful during crisis"],
      },
      vitals: [{ label: "BP", value: "116/72", unit: "mmHg" }],
      diagnosticArtifacts: [],
      medicationChanges: [{ name: "Sertraline", dose: "adjusted", route: "PO", frequency: "daily", indication: "Depression", flag: "changed" }],
      followUpInterval: { value: 6, unit: "weeks", label: "6 weeks later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "At longitudinal follow-up after a suicidal crisis, what approach best supports relapse prevention and recovery?",
        family: "suicide-relapse-prevention-longitudinal-care",
        options: [
          { id: "A", label: "Continue collaborative follow-up while gradually spacing visits as stability improves, reinforce the written safety plan, monitor substance use/sleep/mood changes, strengthen protective factors, and review early warning signs and crisis resources." },
          { id: "B", label: "Stop follow-up now because suicidal thoughts have improved." },
          { id: "C", label: "Avoid discussing suicide again because it may trigger recurrence of suicidal thinking." },
          { id: "D", label: "Focus only on medication and avoid psychosocial or functional recovery discussions." },
        ],
        correctOptionId: "A",
        rationale:
          "Suicide prevention is longitudinal. Improvement after crisis does not eliminate relapse risk, especially when stressors recur. Ongoing care should reinforce coping strategies, protective factors, sleep/substance management, therapy engagement, social connection, and practical crisis plans. Follow-up frequency can taper gradually as stability strengthens. Discussing suicide and warning signs openly is protective when done therapeutically and collaboratively.",
        whyWrongByOptionId: {
          B: "Abrupt discontinuation of follow-up after partial recovery may miss early relapse signs.",
          C: "Avoidance increases shame and can reduce future disclosure during worsening symptoms.",
          D: "Recovery includes functioning, relationships, coping, and psychosocial supports — not medication alone.",
        },
        clinicalJudgmentFocus: "Treating suicide prevention as ongoing chronic-care management rather than a one-time crisis response.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "She continues therapy, updates her safety plan, recognizes early warning signs sooner, and maintains stronger support engagement." },
          B: { trajectory: "suboptimal", outcome: "Support gradually erodes and warning signs are missed during a later stressor." },
          C: { trajectory: "suboptimal", outcome: "She becomes reluctant to disclose worsening thoughts because suicide discussion feels taboo." },
          D: { trajectory: "suboptimal", outcome: "Functional and relational recovery lags despite medication improvement." },
        },
      },
    },
  ],
};
