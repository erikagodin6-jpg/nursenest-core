import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "eol-basics-rpn": {
    title: "End-of-Life Care for Practical Nurses",
    cellular: {
      title: "Pathophysiology of the Dying Process",
      content: "The dying process involves a predictable cascade of physiological changes as organ systems progressively shut down. Understanding these changes at the cellular and systems level is essential for the practical nurse providing competent, compassionate end-of-life care. The distinction between palliative care and hospice care is clinically important: palliative care focuses on symptom management and quality of life at any stage of serious illness and can be provided alongside curative treatments, whereas hospice care is specifically for patients with a terminal prognosis of six months or less who have elected comfort-focused care rather than curative interventions. As the body approaches death, cardiovascular decline begins with decreasing cardiac output. The heart rate may become irregular with periods of tachycardia alternating with bradycardia. Peripheral vasoconstriction redirects blood flow to vital organs, causing mottling of the extremities (livedo reticularis), beginning at the knees, feet, and hands and progressing centrally. The skin becomes cool, cyanotic, and may develop a waxy pallor. Blood pressure progressively drops as the myocardium weakens and peripheral vascular resistance fails. Respiratory changes are among the most distressing for families to witness. Cheyne-Stokes respirations develop as the brainstem respiratory centers become less responsive to carbon dioxide levels. This pattern consists of progressively deeper breaths followed by progressively shallower breaths, interspersed with periods of apnea lasting 10 to 30 seconds. The death rattle -- a gurgling or rattling sound produced by air moving through pooled secretions in the pharynx and trachea -- occurs in approximately 50% of dying patients. This sound is caused by the loss of the cough and swallow reflexes as the glossopharyngeal and vagus nerve function diminishes. The secretions accumulate because the patient can no longer clear them effectively. Importantly, the death rattle is generally not distressing to the patient (who is typically unresponsive at this point) but is very distressing to family members who may interpret it as choking or suffering. Neurological decline progresses from confusion and agitation (terminal restlessness or terminal delirium) to somnolence and ultimately unresponsiveness. Terminal restlessness affects approximately 42% of dying patients and manifests as agitation, moaning, grimacing, restless movements, and pulling at bed linens or clothing. It may result from multiple factors including uncontrolled pain, urinary retention, constipation, hypoxia, metabolic derangements (uremia, hypercalcemia), medication toxicity (particularly opioid metabolite accumulation), or existential/spiritual distress. Renal function declines as cardiac output falls, leading to oliguria and eventually anuria. The kidneys can no longer concentrate urine or excrete metabolic waste products, leading to accumulation of urea, creatinine, and other toxins that further depress neurological function. Urine becomes dark and concentrated, and output progressively decreases to less than 100 mL per day in the final hours. Gastrointestinal motility slows dramatically as the autonomic nervous system fails. The patient loses appetite and thirst as the body naturally reduces its metabolic demands. Hepatic function declines, impairing drug metabolism and potentially leading to drug accumulation and toxicity. The practical nurse must understand that these changes are normal and expected parts of the dying process, not complications requiring aggressive intervention."
    },
    riskFactors: [
      "Terminal illness with prognosis of six months or less (cancer, end-stage organ failure, advanced dementia)",
      "Progressive functional decline (increasing dependence in activities of daily living, declining Palliative Performance Scale score)",
      "Recurrent hospitalizations or emergency department visits despite ongoing treatment",
      "Unintentional weight loss exceeding 10% of body weight over six months",
      "Declining oral intake and progressive dysphagia",
      "Advanced age combined with multiple comorbidities and frailty",
      "Serum albumin less than 2.5 g/dL indicating severe protein-calorie malnutrition and catabolic state"
    ],
    diagnostics: [
      "Palliative Performance Scale (PPS): validated tool measuring ambulation, activity level, self-care ability, oral intake, and level of consciousness on a 0-100% scale; scores below 30% indicate the patient is primarily bedbound with severely limited intake",
      "Palliative Prognostic Index (PPI): combines PPS score with clinical symptoms (oral intake, edema, dyspnea at rest, delirium) to estimate survival; score above 6 suggests survival less than 3 weeks",
      "Edmonton Symptom Assessment System (ESAS): patient self-report tool rating 9 common symptoms (pain, tiredness, nausea, depression, anxiety, drowsiness, appetite, wellbeing, shortness of breath) on 0-10 scale",
      "Pain assessment using validated tools: Numeric Rating Scale (NRS) for alert patients, Pain Assessment in Advanced Dementia (PAINAD) scale for nonverbal patients, assessing facial expression, vocalization, body language, consolability",
      "Basic laboratory monitoring as appropriate to goals of care: electrolytes, renal function, hepatic function; note that routine bloodwork may be discontinued if it does not change management",
      "Oxygen saturation monitoring: may be used to guide oxygen therapy for comfort, but continuous monitoring is often discontinued in actively dying patients to reduce alarm fatigue and promote peaceful environment"
    ],
    management: [
      "Establish and document goals of care through family meetings involving the interdisciplinary team; ensure code status (DNR/DNI/AND) is clearly documented and communicated to all team members",
      "Implement comfort-focused symptom management: prioritize pain control, dyspnea relief, secretion management, and anxiolysis using the least invasive routes (subcutaneous, sublingual, rectal, transdermal)",
      "Reposition patient every 2-4 hours for comfort rather than strict pressure injury prevention; use pillows and positioning aids to support natural body alignment",
      "Provide meticulous oral care every 1-2 hours using mouth swabs moistened with water; apply lip balm to prevent drying; avoid lemon-glycerin swabs which can cause further drying and irritation",
      "Discontinue unnecessary medications, vital sign monitoring, blood glucose checks, and routine interventions that do not contribute to comfort",
      "Manage death rattle with anticholinergic medications (hyoscine/glycopyrrolate) and gentle repositioning; avoid deep suctioning which causes discomfort and is generally ineffective for pharyngeal secretions",
      "Provide family education about expected physiological changes of dying: mottling, Cheyne-Stokes respirations, decreased urine output, decreased oral intake; normalize these changes to reduce family anxiety"
    ],
    nursingActions: [
      "Assess pain and other symptoms using appropriate validated tools at regular intervals (minimum every 4 hours) and before/after interventions; document effectiveness of comfort measures",
      "Monitor for signs of terminal restlessness (agitation, moaning, picking at linens, facial grimacing) and report promptly; assess for reversible causes including urinary retention, fecal impaction, and uncontrolled pain",
      "Maintain a calm, quiet environment: dim lighting, minimize unnecessary noise and alarms, limit visitors to those desired by patient/family, play soft music if preferred by the patient",
      "Provide emotional and spiritual support to patient and family; facilitate visits from chaplain, social worker, or cultural/spiritual advisors as requested",
      "Document all changes in patient condition, comfort measures provided, and family communication; ensure advance directives and code status are easily accessible in the chart",
      "Educate family about signs that death is imminent: Cheyne-Stokes respirations, mottling progressing centrally, unresponsiveness, mandibular breathing (jaw dropping with each breath)",
      "Provide postmortem care with dignity and cultural sensitivity; allow family adequate time with the deceased; follow facility protocols for notification and documentation"
    ],
    assessmentFindings: [
      "Cheyne-Stokes respirations: cyclic pattern of gradually increasing then decreasing respiratory depth with periods of apnea; indicates brainstem respiratory center depression",
      "Mottling of extremities (livedo reticularis): purplish-blue discoloration beginning at knees and feet, progressing centrally; indicates peripheral vasoconstriction and circulatory failure",
      "Death rattle: gurgling or rattling sound with respirations caused by secretions pooling in the pharynx; occurs in approximately 50% of dying patients",
      "Terminal restlessness: agitation, moaning, pulling at linens, grimacing in a previously calm patient; may indicate uncontrolled pain, urinary retention, or existential distress",
      "Oliguria progressing to anuria: urine output decreasing to less than 100 mL per day; dark concentrated urine; indicates renal shutdown from decreased cardiac output",
      "Progressive decrease in level of consciousness: from confusion to somnolence to unresponsiveness; may retain hearing as the last sense to diminish",
      "Mandibular breathing: jaw drops open with each inspiration; indicates imminent death, typically within hours"
    ],
    signs: {
      left: [
        "Increasing fatigue and prolonged periods of sleep",
        "Decreasing oral intake and loss of appetite",
        "Progressive weakness and dependence in ADLs",
        "Mild confusion or disorientation to time",
        "Social withdrawal and decreased verbal communication",
        "Cool extremities with delayed capillary refill"
      ],
      right: [
        "Cheyne-Stokes respirations with prolonged apneic periods",
        "Mottling progressing from extremities to trunk (indicates death within hours)",
        "Death rattle (pooled pharyngeal secretions)",
        "Terminal restlessness or agitation requiring pharmacological intervention",
        "Mandibular breathing (jaw dropping with each breath -- death imminent)",
        "Complete unresponsiveness with fixed dilated pupils"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system and peripheral tissues, inhibiting ascending pain pathways and altering pain perception and emotional response to pain. In end-of-life care, morphine also reduces the sensation of dyspnea by decreasing the central respiratory drive response to hypercapnia and hypoxia, and by reducing pulmonary vascular congestion through venodilation. Low-dose morphine (1-2 mg subcutaneous or sublingual) is the first-line agent for dyspnea management in dying patients.",
        sideEffects: "Sedation, respiratory depression (therapeutic at end of life for dyspnea), constipation, nausea, pruritus, myoclonus (especially with renal impairment due to accumulation of the active metabolite morphine-6-glucuronide)",
        contra: "Known true allergy (rare); use with caution in severe renal impairment (switch to hydromorphone which has no active metabolites); respiratory depression is NOT a contraindication in actively dying patients receiving comfort care",
        pearl: "The principle of double effect applies: administering morphine with the primary intention of relieving pain or dyspnea is ethically and legally appropriate even if it may hasten death as a secondary effect; subcutaneous route is preferred when IV access is unavailable; sublingual concentrated morphine (20 mg/mL) can be administered even in unresponsive patients via absorption through oral mucosa"
      },
      {
        name: "Hyoscine Butylbromide (Buscopan) / Glycopyrrolate",
        type: "Anticholinergic / antimuscarinic agent",
        action: "Blocks muscarinic acetylcholine receptors in smooth muscle and secretory glands, reducing the volume of respiratory and salivary secretions that cause the death rattle. Hyoscine butylbromide does not cross the blood-brain barrier (unlike hyoscine hydrobromide/scopolamine) and therefore does not cause central nervous system sedation or delirium. Glycopyrrolate has a similar peripheral anticholinergic profile. These agents reduce NEW secretion production but do not remove secretions already pooled in the pharynx.",
        sideEffects: "Dry mouth, urinary retention, tachycardia, blurred vision, constipation; paradoxical agitation may occur with scopolamine (which crosses the blood-brain barrier) but not with hyoscine butylbromide or glycopyrrolate",
        contra: "Mechanical GI or urinary obstruction; narrow-angle glaucoma; myasthenia gravis; tachyarrhythmias",
        pearl: "Most effective when started early at the first sign of secretion accumulation rather than waiting until the death rattle is fully established; gentle repositioning to a lateral position with head slightly elevated allows secretions to drain by gravity and complements pharmacological management; reassure family that the sound is generally not distressing to the patient"
      },
      {
        name: "Midazolam",
        type: "Benzodiazepine (GABA-A receptor agonist)",
        action: "Enhances the effect of gamma-aminobutyric acid (GABA) at the GABA-A receptor in the central nervous system, producing anxiolysis, sedation, muscle relaxation, and anticonvulsant effects. In end-of-life care, midazolam is used for terminal restlessness, refractory agitation, seizure control, and as part of palliative sedation protocols when other symptom management approaches have failed. It has rapid onset (3-5 minutes subcutaneous) and relatively short duration (1-2 hours), making it suitable for titration.",
        sideEffects: "Respiratory depression, excessive sedation, paradoxical agitation (particularly in elderly patients), hypotension",
        contra: "Known hypersensitivity to benzodiazepines; acute narrow-angle glaucoma; severe respiratory depression is NOT a contraindication in actively dying patients receiving comfort-focused care",
        pearl: "Midazolam can be administered subcutaneously, intranasally, buccally, or rectally when IV access is unavailable; for continuous subcutaneous infusion, midazolam is compatible with morphine and glycopyrrolate in the same syringe driver; palliative sedation is a measure of last resort for refractory symptoms and requires informed consent and documentation of the indication"
      }
    ],
    pearls: [
      "Hearing is widely believed to be the last sense to diminish in the dying process -- always speak to and about the patient as if they can hear, even when unresponsive; encourage family to continue talking to their loved one",
      "The death rattle is distressing to families but generally not to the patient -- proactive education about this expected finding significantly reduces family anxiety and prevents unnecessary interventions like deep suctioning",
      "Terminal restlessness affects approximately 42% of dying patients and requires a systematic assessment for reversible causes (urinary retention, fecal impaction, pain, medication toxicity) before initiating pharmacological sedation",
      "The principle of double effect provides ethical and legal justification for administering opioids and sedatives at end of life: the primary intent is symptom relief, and the potential secondary effect of hastening death does not make the action unethical",
      "Withholding or withdrawing artificial nutrition and hydration in actively dying patients is appropriate and does not cause suffering -- dehydration at end of life actually reduces pulmonary secretions, edema, and dyspnea, improving comfort",
      "Practical nurses should monitor for anticipatory grief in family members (depression, anxiety, social withdrawal before the death occurs) and facilitate referrals to social work and bereavement services",
      "Cultural and spiritual practices at end of life vary widely -- always ask the patient and family about specific rituals, prayers, or practices they wish to observe and accommodate these within the care plan"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for an actively dying patient whose family is distressed by a loud gurgling sound with each breath. The nurse recognizes this as the death rattle. Which intervention should the nurse implement first?",
        options: [
          "Perform deep oropharyngeal suctioning to clear the secretions",
          "Reposition the patient to a lateral position and administer prescribed anticholinergic medication",
          "Increase the oxygen flow rate to improve respiratory effort",
          "Encourage the family to step out of the room until the sound resolves"
        ],
        correct: 1,
        rationale: "The death rattle is managed by gentle repositioning to allow gravity drainage of secretions and administering anticholinergic medications (hyoscine butylbromide or glycopyrrolate) to reduce new secretion production. Deep suctioning is generally ineffective for pharyngeal secretions and causes patient discomfort. Increasing oxygen does not address the underlying cause. Family should be educated about the finding rather than asked to leave."
      },
      {
        question: "A previously calm dying patient becomes agitated, moaning, and pulling at bed linens. Which assessment should the practical nurse perform first before administering prescribed sedation?",
        options: [
          "Assess blood glucose level",
          "Assess for urinary retention by palpating the bladder",
          "Assess oxygen saturation and apply supplemental oxygen",
          "Assess the patient's spiritual needs and call the chaplain"
        ],
        correct: 1,
        rationale: "Terminal restlessness requires assessment for reversible causes before initiating pharmacological sedation. Urinary retention is one of the most common and easily reversible causes of agitation in dying patients. A distended bladder can cause significant discomfort even in patients who cannot verbalize pain. Straight catheterization may provide immediate relief. While spiritual distress is important to address, physical causes should be ruled out first."
      },
      {
        question: "A family member asks the practical nurse why the patient's feet and knees have turned purplish-blue. Which response by the nurse is most appropriate?",
        options: [
          "The discoloration means the patient has developed a blood clot and needs treatment",
          "This is mottling, which occurs when blood flow is redirected to the vital organs as part of the natural dying process",
          "The patient's oxygen level is too low and we need to increase the oxygen immediately",
          "This is a sign of a pressure injury from being in bed too long"
        ],
        correct: 1,
        rationale: "Mottling (livedo reticularis) is a normal physiological change in the dying process caused by peripheral vasoconstriction as the cardiovascular system redirects blood flow to vital organs. It typically begins at the knees and feet and progresses centrally. Educating the family that this is an expected part of the dying process helps reduce anxiety. It is not a blood clot, pressure injury, or indication for aggressive oxygen therapy."
      }
    ]
  },

  "dnr-directives-rpn": {
    title: "Code Status and Advance Directives for Practical Nurses",
    cellular: {
      title: "Ethical and Legal Foundations of Advance Care Planning",
      content: "Advance care planning is a process by which patients, in consultation with their healthcare providers and loved ones, make decisions about their future medical care in the event they become unable to communicate their wishes. The legal and ethical framework supporting advance care planning is rooted in the bioethical principle of autonomy -- the right of every competent individual to make informed decisions about their own body and medical treatment, including the right to refuse life-sustaining treatment. In Canada, advance directives are governed by provincial legislation, and terminology varies by jurisdiction. The most common terms include Do Not Resuscitate (DNR), Allow Natural Death (AND), Do Not Intubate (DNI), and Medical Orders for Scope of Treatment (MOST, used in British Columbia and other provinces). A DNR order specifically instructs healthcare providers not to perform cardiopulmonary resuscitation (CPR) -- including chest compressions, defibrillation, and advanced cardiac life support -- in the event of cardiac or respiratory arrest. It is important to understand that a DNR order does NOT mean 'do not treat.' Patients with DNR orders should continue to receive all appropriate medical and nursing care, including pain management, antibiotics, IV fluids, and other treatments consistent with their goals of care. A DNI (Do Not Intubate) order specifies that the patient does not wish to have an endotracheal tube placed for mechanical ventilation. A patient may have a DNI order but still wish to receive CPR (chest compressions and defibrillation) without intubation, or may have both DNR and DNI in place. Allow Natural Death (AND) is a term increasingly used as an alternative to DNR because it frames the decision in a more positive, patient-centered manner. AND communicates that the goal is to allow the natural dying process to occur without artificial interference, focusing on comfort and dignity. Research suggests that families are more receptive to AND terminology than DNR because it emphasizes what will be done (comfort care, symptom management) rather than what will not be done (resuscitation). Medical Orders for Scope of Treatment (MOST) forms in British Columbia, or similar provincial equivalents such as Goals of Care Designation (GCD) in Alberta, provide a more comprehensive framework that addresses not just resuscitation but the full spectrum of care interventions. These forms typically categorize care into levels: full resuscitative care (Level R or C1), medical interventions including hospital transfer but no CPR (Level M or C2), and comfort care only (Level C or C3). The practical nurse must understand several critical legal and ethical concepts related to advance directives. Informed consent requires that the patient (or substitute decision-maker) receives complete, accurate information about the benefits, risks, and alternatives to proposed treatments, including the option of no treatment. The patient must demonstrate understanding and make the decision voluntarily without coercion. Capacity assessment determines whether a patient can understand the information provided, appreciate how it applies to their situation, reason through the options, and communicate a decision. Capacity is decision-specific and time-specific: a patient may have capacity for some decisions but not others, and capacity may fluctuate. When a patient lacks capacity, a substitute decision-maker (SDM) -- identified through a power of attorney for personal care, provincial hierarchy legislation, or court appointment -- makes decisions based on the patient's previously expressed wishes or, if no wishes are known, the patient's best interests. The practical nurse's role in advance care planning includes identifying patients who may benefit from advance care planning discussions, ensuring that the patient's code status and advance directives are clearly documented and communicated to the healthcare team, advocating for the patient's wishes when conflicts arise, and providing emotional support to patients and families navigating these difficult decisions."
    },
    riskFactors: [
      "Terminal diagnosis with estimated prognosis of less than twelve months",
      "Advanced chronic illness with declining functional status (heart failure NYHA Class IV, end-stage renal disease, advanced COPD with home oxygen, advanced dementia)",
      "Recurrent hospitalizations (two or more in the past six months) suggesting disease progression",
      "Age greater than 80 years with multiple comorbidities and increasing frailty",
      "Patient or family expressing wishes to focus on comfort rather than aggressive treatment",
      "Admission to long-term care or transfer to palliative care unit",
      "Critical illness requiring ICU admission where the patient's prognosis is uncertain"
    ],
    diagnostics: [
      "Capacity assessment: evaluate the patient's ability to understand, appreciate, reason, and communicate regarding treatment decisions; document findings clearly in the medical record",
      "Review existing advance directive documents: power of attorney for personal care, living will, MOST/GCD forms; verify documents are current and legally valid",
      "Identify substitute decision-maker (SDM): confirm identity through power of attorney documents or provincial hierarchy (typically spouse, adult child, parent, sibling); document SDM contact information",
      "Palliative Performance Scale (PPS): assess functional status to guide goals of care discussions; declining PPS indicates disease progression and may prompt advance care planning review",
      "Prognostic assessment: review disease trajectory, functional status, nutritional status, and recent clinical changes to inform realistic discussions about expected outcomes",
      "Family meeting documentation: record participants, topics discussed, decisions made, and any conflicts or unresolved issues; ensure all team members have access to these notes"
    ],
    management: [
      "Ensure code status is clearly documented in the medical record and communicated during every handoff, transfer, and shift change; verify that code status orders are current and signed by the attending physician",
      "Place visible code status identifiers according to facility policy (colored wristband, bedside sign, flagged chart); ensure these are updated if the patient's wishes change",
      "Continue all appropriate medical and nursing care consistent with the patient's goals: DNR does NOT mean 'do not treat' -- patients with DNR orders may still receive antibiotics, IV fluids, pain management, and other comfort-focused interventions",
      "Facilitate goals of care discussions between the patient/family and the physician or nurse practitioner; the practical nurse supports these conversations by providing information about what the patient is experiencing and advocating for the patient's expressed wishes",
      "Address conflicts between family members or between family and healthcare team through interdisciplinary team meetings, ethics committee consultation, and social work involvement",
      "Review and update advance directives at key transition points: admission, significant change in condition, transfer between units or facilities, and at the patient's request",
      "Provide written information about advance care planning to patients and families; connect them with community resources such as advance care planning facilitators and legal aid for completing directive documents"
    ],
    nursingActions: [
      "Verify code status and advance directive documentation at the beginning of every shift and confirm that the information matches the physician orders in the medical record",
      "Report any discrepancies between the patient's expressed wishes and the documented code status to the charge nurse and attending physician immediately",
      "Document verbatim statements made by patients about their care wishes when possible (for example: 'Patient stated: I do not want to be on a breathing machine')",
      "Provide emotional support to families during goals of care discussions; acknowledge the difficulty of these decisions without expressing personal opinions about the right choice",
      "Advocate for the patient's autonomy: if a family member is requesting interventions that conflict with the patient's documented advance directive, escalate to the physician and ethics committee",
      "Educate patients and families about the difference between DNR, DNI, AND, and full code status using clear, non-medical language; correct common misconceptions (such as the belief that DNR means no treatment will be provided)",
      "In the event of cardiac arrest in a patient with a valid DNR order: do NOT initiate CPR; provide comfort measures; notify the physician; support the family; document the time of death and circumstances"
    ],
    assessmentFindings: [
      "Patient expresses desire to discuss future care preferences or asks questions about what will happen if their condition worsens",
      "Patient or family demonstrates misunderstanding of code status (for example, believing DNR means all treatment will stop)",
      "Discrepancy identified between documented code status and patient's verbally expressed wishes",
      "Family conflict regarding patient's care wishes, evidenced by disagreement among family members or between family and healthcare team",
      "Patient demonstrates fluctuating capacity: able to participate in some decisions but not others, or capacity varies with time of day, medication effects, or disease progression",
      "Change in patient's clinical condition warranting review of goals of care: significant deterioration, new terminal diagnosis, or unexpected improvement",
      "Patient admitted without advance directive documentation or with outdated documents that may not reflect current wishes"
    ],
    signs: {
      left: [
        "Patient asking questions about future care options and prognosis",
        "Family requesting meeting with healthcare team to discuss treatment plan",
        "Gradual decline in functional status and increasing symptom burden",
        "Patient expressing fatigue with ongoing treatments or hospital visits",
        "Mild confusion or fluctuating capacity noted during care discussions",
        "Patient or family expressing concern about quality of life versus quantity of life"
      ],
      right: [
        "Patient in cardiac arrest with unclear or conflicting code status documentation (requires immediate clarification)",
        "Family demanding aggressive resuscitation against patient's documented wishes (ethical emergency)",
        "Patient with capacity withdrawing consent for life-sustaining treatment currently in progress",
        "Healthcare provider refusing to honor a valid advance directive (requires immediate supervisor and ethics involvement)",
        "Active conflict between substitute decision-makers regarding treatment decisions",
        "Patient requesting Medical Assistance in Dying (MAiD) -- requires immediate referral to qualified assessors per legislation"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system, modulating pain perception and reducing the sensation of dyspnea by decreasing the medullary respiratory center's sensitivity to carbon dioxide. In the context of code status and comfort care, morphine is the cornerstone of symptom management for pain and dyspnea in patients who have elected comfort-focused care. Low-dose morphine (0.5-2 mg subcutaneous every 4 hours or as needed) provides effective dyspnea relief without causing clinically significant respiratory depression at these doses.",
        sideEffects: "Sedation, constipation, nausea, respiratory depression (dose-dependent and typically not clinically significant at comfort-care doses), pruritus, urinary retention",
        contra: "True morphine allergy (extremely rare -- distinguish from expected side effects like itching); severe unmonitored respiratory depression in patients with full code status; in comfort care patients, respiratory depression may be an acceptable and expected effect",
        pearl: "When a patient transitions from full code to comfort care, opioid doses should be titrated to symptom relief, not to respiratory rate or level of consciousness; the ethical principle of double effect supports the use of morphine for comfort even if it may hasten death as an unintended secondary consequence"
      },
      {
        name: "Glycopyrrolate (Robinul)",
        type: "Anticholinergic / antimuscarinic agent (quaternary ammonium compound)",
        action: "Competitively blocks muscarinic acetylcholine receptors at peripheral sites including salivary glands, respiratory mucosa, and bronchial smooth muscle. Reduces the volume of oropharyngeal and tracheobronchial secretions that contribute to the death rattle. As a quaternary ammonium compound, glycopyrrolate does not cross the blood-brain barrier, making it less likely to cause central nervous system effects such as sedation, confusion, or delirium compared to tertiary amine anticholinergics like atropine or scopolamine.",
        sideEffects: "Dry mouth, urinary retention, tachycardia, constipation, blurred vision; does NOT cause CNS sedation or delirium because it cannot cross the blood-brain barrier",
        contra: "Mechanical gastrointestinal obstruction; paralytic ileus; severe ulcerative colitis; myasthenia gravis; unstable cardiovascular status with tachyarrhythmia; narrow-angle glaucoma",
        pearl: "Glycopyrrolate is preferred over atropine and scopolamine for secretion management at end of life because it has no CNS effects and does not worsen delirium; it reduces new secretion production but does not remove already pooled secretions -- start early when secretions first become audible for best results; can be given subcutaneously 0.2-0.4 mg every 4-6 hours"
      },
      {
        name: "Lorazepam (Ativan)",
        type: "Benzodiazepine (GABA-A receptor positive allosteric modulator)",
        action: "Binds to the benzodiazepine site on the GABA-A receptor complex, enhancing the inhibitory effect of gamma-aminobutyric acid (GABA) in the central nervous system. This produces anxiolysis, sedation, muscle relaxation, and anticonvulsant effects. In comfort care, lorazepam is used to manage anxiety, terminal restlessness, and seizures. It can be administered via multiple routes including sublingual, subcutaneous, rectal, and IV, making it versatile when oral administration is no longer possible.",
        sideEffects: "Sedation, respiratory depression, paradoxical agitation (especially in elderly or delirious patients), hypotension, amnesia; metabolized by hepatic conjugation (not oxidative metabolism), making it safer than diazepam in patients with hepatic impairment",
        contra: "Known hypersensitivity to benzodiazepines; severe respiratory depression in patients with full code status; acute narrow-angle glaucoma; in comfort care patients, respiratory depression is an acceptable consequence when the primary intent is symptom relief",
        pearl: "Lorazepam is preferred over diazepam at end of life because it has no active metabolites and does not require oxidative hepatic metabolism (Phase I); sublingual administration provides rapid absorption (onset 15-30 minutes) and is useful when the patient can no longer swallow; for refractory terminal restlessness, continuous subcutaneous infusion may be necessary"
      }
    ],
    pearls: [
      "DNR does NOT mean 'do not treat' -- this is the most common misconception among patients, families, AND healthcare providers; patients with DNR orders should receive all care consistent with their goals, including pain management, antibiotics, blood products, and diagnostic tests if aligned with comfort goals",
      "Allow Natural Death (AND) is increasingly preferred over DNR terminology because it reframes the conversation positively -- AND communicates what WILL be done (comfort, dignity, symptom management) rather than what will NOT be done (CPR)",
      "Code status must be verified at every handoff, transfer, and transition of care -- failure to communicate code status is a patient safety event that can result in unwanted resuscitation or failure to provide desired interventions",
      "Capacity is decision-specific and time-specific: a patient with early dementia may have capacity to decide about code status today but not tomorrow; capacity must be assessed for each specific decision at the time the decision needs to be made",
      "The substitute decision-maker (SDM) must make decisions based on the patient's previously expressed wishes, NOT on what the SDM would want for themselves -- this is the substituted judgment standard; if no prior wishes are known, the SDM uses the best interests standard",
      "Practical nurses should NEVER express personal opinions about what code status a patient should choose -- this violates the principle of autonomy; the nurse's role is to provide information, answer questions, correct misconceptions, and support the patient's informed decision",
      "In the event of a cardiac arrest with unclear code status, initiate CPR while the code status is being clarified -- it is easier to stop CPR once a valid DNR is confirmed than to reverse the consequences of delayed resuscitation in a patient who wanted full intervention"
    ],
    quiz: [
      {
        question: "A patient with a documented DNR order develops a urinary tract infection with fever. A family member asks the practical nurse whether the patient will receive antibiotics. Which response is most appropriate?",
        options: [
          "No, the DNR order means we will not treat any new conditions",
          "Yes, a DNR order means no CPR will be performed if the heart stops, but the patient will still receive appropriate treatment including antibiotics for infections",
          "We need to wait for the physician to decide whether treatment is appropriate",
          "The family should consider changing the code status to full code so we can treat the infection"
        ],
        correct: 1,
        rationale: "A DNR order specifically means that CPR (chest compressions, defibrillation, ACLS) will not be performed in the event of cardiac or respiratory arrest. It does NOT mean that other treatments are withheld. Patients with DNR orders continue to receive all appropriate medical care consistent with their goals, including antibiotics, IV fluids, pain management, and other interventions. The common misconception that DNR means 'do not treat' must be corrected."
      },
      {
        question: "A practical nurse is caring for an elderly patient with advanced dementia. The patient's daughter (identified as substitute decision-maker) requests full resuscitation, but the patient's advance directive states 'no CPR or mechanical ventilation.' Which action should the nurse take?",
        options: [
          "Follow the daughter's verbal request because she is the legal substitute decision-maker",
          "Follow the written advance directive and notify the physician and charge nurse of the conflict between the SDM's request and the patient's documented wishes",
          "Wait until the patient can express their own wishes before making any decision",
          "Ask another family member to break the tie between the directive and the daughter's request"
        ],
        correct: 1,
        rationale: "The patient's own documented advance directive takes precedence over the substitute decision-maker's preferences. The SDM is legally obligated to make decisions based on the patient's previously expressed wishes (substituted judgment standard), not on what the SDM would want. The nurse should advocate for the patient's documented wishes, notify the physician and charge nurse, and facilitate a family meeting to address the conflict. Ethics committee consultation may be required."
      },
      {
        question: "During shift handoff, a practical nurse discovers that a newly admitted patient has no code status documented in the medical record. The patient is stable but has multiple chronic conditions. What is the priority nursing action?",
        options: [
          "Assume the patient is full code and document this in the chart",
          "Ask the patient directly what code status they prefer and document their response",
          "Notify the admitting physician that code status documentation is missing and needs to be addressed",
          "Wait until the next family visit to discuss code status preferences"
        ],
        correct: 2,
        rationale: "Code status discussions and orders must be initiated by the physician or nurse practitioner who can provide the medical context necessary for informed decision-making. The practical nurse's responsibility is to identify the gap in documentation and notify the physician so that a proper goals of care discussion can occur. While the default is generally full code in the absence of a documented order, the nurse should not document an assumption. The practical nurse supports the discussion but does not independently establish code status."
      }
    ]
  },

  "cord-care-rpn": {
    title: "Umbilical Cord Care for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of the Umbilical Cord",
      content: "The umbilical cord is the lifeline connecting the developing fetus to the placenta throughout pregnancy. It contains two umbilical arteries that carry deoxygenated blood and metabolic waste from the fetus to the placenta, and one umbilical vein that carries oxygenated, nutrient-rich blood from the placenta to the fetus. The cord is surrounded and protected by Wharton jelly, a mucoid connective tissue composed primarily of mucopolysaccharides that provides cushioning and prevents compression of the blood vessels. The average cord length is approximately 50 to 60 centimeters, and the average diameter is 1 to 2 centimeters. The cord is covered by a single layer of amnion epithelium continuous with the amniotic membrane. At birth, the umbilical cord is clamped and cut, severing the fetal-placental circulation. The current evidence supports delayed cord clamping (DCC), defined as clamping the cord at least 30 to 60 seconds after birth (and up to 3 minutes in some guidelines), to allow continued blood transfer from the placenta to the newborn. Delayed cord clamping provides the newborn with an additional 80 to 100 mL of blood, increasing iron stores by 30 to 50 mg/kg and reducing the risk of iron deficiency anemia through the first year of life. In preterm infants, DCC reduces the risk of intraventricular hemorrhage and necrotizing enterocolitis and decreases the need for blood transfusions. After clamping and cutting, the cord stump undergoes a process of dry gangrene (mummification). The Wharton jelly desiccates and the cord stump shrinks, darkens from yellowish-green to brown to black, and eventually separates from the skin through a process of leukocyte-mediated enzymatic digestion at the junction between the cord stump and the periumbilical skin. Separation typically occurs between 7 and 21 days of life, with an average of 10 to 14 days. The base of the cord stump, where it meets the abdominal skin, is a portal of entry for bacteria because the thrombosed umbilical vessels communicate with the systemic circulation. The umbilical vein connects to the portal venous system and thus to the liver, while the umbilical arteries connect to the internal iliac arteries. This vascular communication means that infection at the cord stump (omphalitis) can rapidly progress to systemic sepsis, portal vein thrombosis, liver abscess, or necrotizing fasciitis. Omphalitis is a serious neonatal infection with an incidence of approximately 0.7% in developed countries but up to 8% in developing regions. It is caused most commonly by Staphylococcus aureus, Group A Streptococcus, and gram-negative organisms including Escherichia coli and Klebsiella. The clinical presentation includes periumbilical erythema extending beyond the cord base, induration, warmth, purulent or foul-smelling discharge, and periumbilical edema. Systemic signs include fever, lethargy, poor feeding, tachycardia, and irritability. Omphalitis requires urgent medical evaluation and parenteral antibiotic therapy because of the risk of rapid progression to sepsis. Current evidence-based cord care recommendations have evolved significantly. The World Health Organization and major pediatric organizations now recommend dry cord care (also called natural cord care) for healthy term newborns in developed countries: keep the cord stump clean and dry, fold the diaper below the cord stump to prevent urine contamination, expose the stump to air, and avoid applying any antiseptic agents, alcohol, or other substances. Research has demonstrated that dry cord care results in faster cord separation without increasing infection rates compared to antiseptic application. However, in settings with high neonatal mortality and poor hygiene conditions, chlorhexidine 4% application to the cord stump reduces omphalitis and neonatal mortality."
    },
    riskFactors: [
      "Unsterile cord cutting instruments or technique (home birth without sterile supplies, cultural cord-cutting practices)",
      "Application of traditional substances to the cord stump (cow dung, ash, turmeric, mustard oil) which introduce pathogenic organisms",
      "Prolonged rupture of membranes (greater than 18 hours before delivery) increasing risk of ascending infection",
      "Low birth weight or preterm birth (immature immune system, decreased neutrophil function, lower immunoglobulin levels)",
      "Maternal chorioamnionitis (intra-amniotic infection) indicating potential exposure of the newborn to pathogenic organisms",
      "Poor hand hygiene by caregivers handling the cord stump",
      "Covering the cord stump with occlusive dressings or diapers that trap moisture and create a warm, dark environment conducive to bacterial growth"
    ],
    diagnostics: [
      "Visual inspection of the cord stump at every diaper change and at minimum every nursing assessment: evaluate color, odor, moisture, surrounding skin condition, and signs of separation",
      "Periumbilical skin assessment: measure and document any erythema extending beyond the cord base using a ruler; erythema extending more than 2 cm from the cord base warrants physician notification",
      "Cord stump culture and sensitivity: if purulent discharge is present, obtain a swab for culture before initiating antibiotics; identifies the causative organism and guides targeted antibiotic therapy",
      "Complete blood count (CBC) with differential: elevated white blood cell count with left shift (increased bands/immature neutrophils) suggests bacterial infection; neutropenia may indicate severe sepsis in neonates",
      "Blood culture: obtained if systemic infection is suspected (fever, lethargy, poor feeding); identifies bacteremia; collect before antibiotic administration",
      "C-reactive protein (CRP) and procalcitonin: inflammatory markers that help distinguish bacterial infection from other causes of neonatal symptoms; serial measurements can monitor treatment response"
    ],
    management: [
      "Implement dry cord care for healthy term newborns: keep the cord stump clean and dry, expose to air, fold the diaper below the stump, and avoid applying antiseptic agents or alcohol unless specifically ordered",
      "Clean the cord stump with warm water only if visibly soiled with urine or stool; gently pat dry with a clean cloth; do not pull or tug on the cord stump even if it appears loose",
      "Educate parents on expected cord changes: initial yellowish-green color transitioning to brown then black as it dries; slight moisture or small amount of clear/yellow drainage at the base is normal; foul-smelling discharge or bleeding beyond a few drops is NOT normal",
      "If omphalitis is diagnosed, administer prescribed parenteral antibiotics (typically IV ampicillin plus gentamicin for broad-spectrum coverage of gram-positive and gram-negative organisms)",
      "Apply chlorhexidine 4% solution to the cord stump in high-risk settings or as prescribed by the physician; single daily application to the cord stump and surrounding skin",
      "Sponge bathe the newborn until the cord stump has separated and the umbilicus is completely healed; avoid submerging the cord stump in water during tub bathing",
      "Monitor for delayed cord separation (beyond 30 days) which may indicate leukocyte adhesion deficiency (LAD), a rare primary immunodeficiency; report to physician for further investigation"
    ],
    nursingActions: [
      "Inspect the umbilical cord stump at every diaper change for signs of infection: erythema, edema, warmth, purulent or foul-smelling discharge, and periumbilical induration",
      "Verify at birth that the cord contains three vessels (two arteries and one vein); a two-vessel cord (single umbilical artery) is associated with renal and cardiac anomalies and requires physician notification and diagnostic follow-up",
      "Document cord stump appearance at each assessment using standardized descriptors: color (yellow-green, brown, black), moisture (dry, moist, draining), odor (none, foul), surrounding skin (normal, erythematous with measurement in cm), and integrity (intact, partially separated, fully separated)",
      "Teach parents proper cord care before discharge: keep clean and dry, fold diaper below stump, avoid covering with clothing or dressings, sponge bathe only, and signs of infection requiring immediate medical attention",
      "Perform hand hygiene before and after every cord assessment or care; instruct all caregivers including parents on proper hand washing technique before handling the newborn",
      "Apply cord clamp correctly and verify security; the clamp should be placed 2 to 3 cm from the abdominal wall; check that no skin is caught in the clamp",
      "Report immediately to the physician: periumbilical erythema extending more than 2 cm, purulent or foul-smelling discharge, active bleeding from the cord stump, systemic signs of infection (fever, lethargy, poor feeding, tachycardia), or cord separation before day 3 (possible infection) or after day 30 (possible immune deficiency)"
    ],
    assessmentFindings: [
      "Normal cord stump appearance at days 1-3: yellowish-green, moist, Wharton jelly visible; gradual drying and color change to brown then black over 7-14 days",
      "Normal small amount of clear or slightly yellow drainage at the cord base during separation process; a few drops of blood at separation are normal",
      "Granuloma: small, round, moist, pink or red tissue mass at the umbilicus after cord separation; treated with silver nitrate cauterization by the physician",
      "Omphalitis signs: periumbilical erythema, edema, warmth, induration, purulent discharge, foul odor; erythema extending beyond 2 cm from the cord base indicates significant infection",
      "Umbilical hernia: bulging of abdominal contents through a weakness in the umbilical ring; usually self-resolves by age 3-4 years; no treatment needed unless incarcerated",
      "Delayed cord separation beyond 30 days: may indicate leukocyte adhesion deficiency (LAD) or other immune disorder; requires immunological evaluation"
    ],
    signs: {
      left: [
        "Normal cord drying and color change (yellowish-green to brown to black)",
        "Small amount of clear or yellow drainage at the cord base during separation",
        "Slight periumbilical skin redness (less than 0.5 cm) without induration or discharge",
        "Mild moisture at the cord base without odor",
        "Cord stump slightly loosened but still attached",
        "Small umbilical hernia visible with crying or straining"
      ],
      right: [
        "Periumbilical erythema extending more than 2 cm from the cord base (omphalitis)",
        "Purulent, foul-smelling discharge from the cord stump",
        "Active bleeding from the cord stump that does not stop with gentle pressure",
        "Periumbilical induration and warmth indicating spreading cellulitis",
        "Systemic signs: fever, lethargy, poor feeding, tachycardia (neonatal sepsis)",
        "Crepitus around the umbilicus (suggests necrotizing fasciitis -- surgical emergency)"
      ]
    },
    medications: [
      {
        name: "Chlorhexidine 4% Solution",
        type: "Topical antiseptic (biguanide antimicrobial)",
        action: "Disrupts bacterial cell membranes by binding to negatively charged phospholipid components, causing leakage of intracellular contents and cell death. Chlorhexidine has broad-spectrum activity against gram-positive bacteria, gram-negative bacteria, and some fungi. It provides residual antimicrobial activity on the skin for up to 6 hours after application because it binds to the stratum corneum. When applied to the umbilical cord stump, it reduces bacterial colonization and prevents omphalitis.",
        sideEffects: "Local skin irritation, contact dermatitis, rare anaphylaxis; may cause chemical burns in preterm infants with immature skin barrier -- use with caution in neonates less than 32 weeks gestational age",
        contra: "Known hypersensitivity to chlorhexidine; avoid contact with eyes, ears, and mucous membranes; use with caution on premature infant skin (increased absorption and potential toxicity)",
        pearl: "WHO recommends chlorhexidine 7.1% gel (delivering 4% chlorhexidine) for cord care in high-neonatal-mortality settings; in developed countries with clean birth practices, dry cord care alone is recommended for healthy term newborns; if prescribed, apply once daily to the cord stump and 2 cm of surrounding skin using a clean cotton ball or swab"
      },
      {
        name: "Isopropyl Alcohol 70% (Rubbing Alcohol)",
        type: "Topical antiseptic (alcohol-based antimicrobial)",
        action: "Denatures bacterial proteins and dissolves lipid membranes, producing rapid bactericidal action against a broad spectrum of bacteria, fungi, and viruses. When applied to the cord stump, it was historically used to reduce bacterial colonization and accelerate cord drying. However, alcohol application actually delays cord separation by interfering with the normal process of leukocyte migration and enzymatic digestion at the cord-skin junction.",
        sideEffects: "Local skin irritation, drying of surrounding skin, stinging sensation; delays cord separation by 2-3 days compared to dry cord care",
        contra: "Current evidence-based guidelines recommend AGAINST routine alcohol application to the cord stump in healthy term newborns because it delays cord separation without reducing infection rates compared to dry cord care",
        pearl: "Although alcohol was standard cord care practice for decades, multiple randomized controlled trials have demonstrated that dry cord care results in faster cord separation without increasing infection rates in clean birthing environments; some facilities may still include alcohol in their protocols -- always follow current facility policy while advocating for evidence-based practice updates"
      },
      {
        name: "Erythromycin 0.5% Ophthalmic Ointment",
        type: "Macrolide antibiotic (protein synthesis inhibitor)",
        action: "Binds to the 50S ribosomal subunit of susceptible bacteria, inhibiting translocation of aminoacyl transfer RNA and blocking protein synthesis. Applied to the newborn's eyes within 1 hour of birth to prevent ophthalmia neonatorum (neonatal conjunctivitis) caused by Neisseria gonorrhoeae and Chlamydia trachomatis. While not directly related to cord care, erythromycin ophthalmic prophylaxis is a critical component of immediate newborn care performed alongside cord clamping and assessment.",
        sideEffects: "Mild conjunctival irritation, chemical conjunctivitis (temporary redness and swelling), temporary blurred vision in the newborn; these effects typically resolve within 24-48 hours",
        contra: "Known hypersensitivity to erythromycin or macrolide antibiotics",
        pearl: "Erythromycin ophthalmic prophylaxis is legally mandated in most Canadian provinces and US states; apply a 1-2 cm ribbon of ointment to each lower conjunctival sac within 1 hour of birth; do NOT irrigate the eyes after application; document administration including time, route, and any parental refusal (which must be documented and may require reporting per jurisdiction)"
      }
    ],
    pearls: [
      "Current evidence supports dry cord care (clean and dry, no antiseptics) for healthy term newborns in developed countries -- this approach results in faster cord separation without increasing infection rates compared to alcohol or antiseptic application",
      "Always verify the number of cord vessels at birth: a normal cord has THREE vessels (two arteries, one vein); a single umbilical artery (two-vessel cord) occurs in approximately 1% of births and is associated with renal anomalies, cardiac defects, and chromosomal abnormalities requiring follow-up imaging",
      "Delayed cord clamping (30-60 seconds minimum, up to 3 minutes) provides the newborn with 80-100 mL of additional blood, increasing iron stores by 30-50 mg/kg and reducing iron deficiency anemia risk for up to 6 months",
      "Omphalitis is a neonatal emergency because the thrombosed umbilical vessels provide a direct pathway for bacteria to enter the portal circulation (via the umbilical vein) and systemic circulation (via the umbilical arteries) -- periumbilical erythema extending more than 2 cm from the cord base requires urgent physician notification",
      "Teach parents to fold the diaper BELOW the cord stump to prevent urine contamination and to keep the area exposed to air -- moisture and warmth promote bacterial growth and delay cord separation",
      "Cord separation before day 3 of life may indicate infection; separation delayed beyond day 30 may indicate leukocyte adhesion deficiency (LAD), a rare primary immunodeficiency disorder -- both extremes warrant physician evaluation",
      "A small amount of bleeding (a few drops) at the time of cord separation is normal and resolves with gentle pressure; active or persistent bleeding requires immediate physician notification to rule out coagulopathy or vascular anomaly"
    ],
    quiz: [
      {
        question: "A practical nurse is teaching a new mother about umbilical cord care before discharge. Which instruction is most consistent with current evidence-based practice for a healthy term newborn?",
        options: [
          "Clean the cord stump with rubbing alcohol at every diaper change to prevent infection",
          "Apply antibiotic ointment to the cord stump three times daily until it separates",
          "Keep the cord stump clean and dry, fold the diaper below the stump, and expose to air",
          "Cover the cord stump with a sterile gauze dressing and change it every 8 hours"
        ],
        correct: 2,
        rationale: "Current evidence-based guidelines recommend dry cord care for healthy term newborns in developed countries. This involves keeping the cord stump clean and dry, folding the diaper below the stump to prevent urine contamination, and exposing the stump to air. Research demonstrates that dry cord care results in faster cord separation without increasing infection rates compared to alcohol or antiseptic application. Covering the stump traps moisture and promotes bacterial growth."
      },
      {
        question: "During a newborn assessment, a practical nurse notes that the umbilical cord contains only two vessels instead of the expected three. Which action should the nurse take?",
        options: [
          "Document the finding as a normal anatomical variant requiring no follow-up",
          "Report the finding to the physician because a two-vessel cord is associated with renal and cardiac anomalies",
          "Recount the vessels after the cord stump dries because vessels are difficult to see when the cord is fresh",
          "Apply a special cord clamp designed for two-vessel cords"
        ],
        correct: 1,
        rationale: "A normal umbilical cord contains three vessels: two arteries and one vein. A single umbilical artery (two-vessel cord) occurs in approximately 1% of births and is associated with renal anomalies, cardiac defects, and chromosomal abnormalities. The nurse should report this finding to the physician so that appropriate diagnostic follow-up (renal ultrasound, echocardiogram) can be ordered. This is NOT a normal variant and requires investigation."
      },
      {
        question: "A practical nurse observes periumbilical erythema extending 3 cm from the cord base with purulent, foul-smelling discharge in a 5-day-old newborn. The baby's temperature is 38.2 degrees Celsius. Which action takes priority?",
        options: [
          "Clean the area with chlorhexidine and apply a sterile dressing",
          "Document the findings and reassess in 4 hours",
          "Report findings immediately to the physician as these signs indicate omphalitis requiring urgent treatment",
          "Advise the mother to increase breastfeeding frequency to boost the infant's immune system"
        ],
        correct: 2,
        rationale: "Periumbilical erythema extending more than 2 cm from the cord base combined with purulent discharge, foul odor, and fever are classic signs of omphalitis, a serious neonatal infection. Because the thrombosed umbilical vessels provide a direct pathway to the systemic and portal circulation, omphalitis can rapidly progress to sepsis, portal vein thrombosis, or necrotizing fasciitis. Immediate physician notification is required so that parenteral antibiotic therapy can be initiated and blood cultures obtained."
      }
    ]
  },

  "fundal-height-rpn": {
    title: "Uterine Fundal Assessment for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of the Uterus During Pregnancy and Postpartum",
      content: "The uterus is a hollow muscular organ situated in the pelvic cavity between the bladder and the rectum. In its non-pregnant state, the uterus weighs approximately 60 grams and measures approximately 7.5 centimeters in length. During pregnancy, the uterus undergoes remarkable changes driven by estrogen and progesterone: it increases in weight to approximately 1000 grams (a 16-fold increase), its capacity increases from 10 mL to 5000 mL or more, and its blood flow increases from 50 mL per minute to approximately 500 to 700 mL per minute at term. The uterine wall consists of three layers: the endometrium (inner mucosal layer, which becomes the decidua during pregnancy), the myometrium (thick muscular middle layer composed of smooth muscle cells arranged in interlocking bundles), and the perimetrium (outer serosal layer continuous with the peritoneum). The myometrium is the thickest layer and is responsible for the powerful contractions of labor. The unique figure-of-eight arrangement of myometrial muscle fibers surrounding blood vessels is critical to understanding postpartum hemostasis: when these fibers contract after placental delivery, they compress the blood vessels that supplied the placental site (often called physiological ligatures or living ligatures), effectively controlling bleeding. This mechanism makes myometrial contraction the primary defense against postpartum hemorrhage. Fundal height measurement during pregnancy uses the McDonald rule: the distance in centimeters from the symphysis pubis to the top of the uterine fundus correlates approximately with the gestational age in weeks between 20 and 36 weeks. For example, at 28 weeks gestation, the fundal height should measure approximately 28 centimeters (plus or minus 2 cm). A fundal height measurement more than 2 cm greater than expected for gestational age may indicate multiple gestation, polyhydramnios (excess amniotic fluid), fetal macrosomia, or incorrect dating. A measurement more than 2 cm less than expected may indicate intrauterine growth restriction (IUGR), oligohydramnios (decreased amniotic fluid), transverse lie, or incorrect dating. During pregnancy, the uterine fundus rises predictably: at 12 weeks it is palpable just above the symphysis pubis, at 20 weeks it reaches the umbilicus, and at 36 weeks it reaches the xiphoid process before dropping slightly at 38-40 weeks as the fetal head descends into the pelvis (lightening). After delivery, the uterine fundus should be palpable at or slightly below the level of the umbilicus immediately after placental delivery. Postpartum involution is the process by which the uterus returns to its pre-pregnant size and position. During involution, the uterus decreases in size by approximately one fingerbreadth (approximately 1 cm) per day. By day 10-14 postpartum, the uterus should no longer be palpable above the symphysis pubis. Involution is mediated by autolysis (self-digestion of uterine tissue by intracellular proteolytic enzymes) and by the compressive effect of myometrial contractions. Factors that impair involution include uterine atony, retained placental fragments, overdistended uterus (macrosomia, multiple gestation, polyhydramnios), full bladder (displaces the uterus and prevents effective contraction), and infection (endometritis). A boggy, soft, non-contracted uterus is the most common cause of early postpartum hemorrhage and requires immediate intervention. The practical nurse must be proficient in assessing fundal height and firmness, recognizing deviations from expected findings, and implementing first-line interventions for uterine atony including fundal massage and bladder emptying."
    },
    riskFactors: [
      "Grand multiparity (five or more previous pregnancies) resulting in reduced myometrial tone and increased risk of uterine atony",
      "Uterine overdistension from macrosomic fetus (greater than 4000 grams), multiple gestation, or polyhydramnios",
      "Prolonged labor (greater than 20 hours for nulliparas, greater than 14 hours for multiparas) causing myometrial fatigue",
      "Precipitous labor (less than 3 hours) with inadequate time for progressive uterine adaptation",
      "Chorioamnionitis (intrauterine infection during labor) predisposing to postpartum endometritis and impaired involution",
      "Use of tocolytic agents (terbutaline, magnesium sulfate) that promote uterine relaxation",
      "Retained placental fragments preventing effective myometrial contraction at the placental site"
    ],
    diagnostics: [
      "Fundal height measurement (McDonald rule): using a non-elastic measuring tape, measure from the superior border of the symphysis pubis over the abdominal curve to the top of the uterine fundus; result in centimeters should approximate gestational age in weeks (plus or minus 2 cm) between 20 and 36 weeks",
      "Postpartum fundal assessment: palpate the uterine fundus using one hand to support the lower uterine segment while the other hand locates the top of the fundus; assess height relative to the umbilicus, firmness (firm vs boggy), and position (midline vs deviated)",
      "Ultrasound measurement of fundal height: used when tape measurement is unreliable (obesity, fibroids, abnormal lie); provides fetal biometry for growth assessment",
      "Lochia assessment: evaluate amount (scant, light, moderate, heavy), color (rubra days 1-3, serosa days 4-10, alba days 11-21+), odor (should not be foul-smelling), and presence of clots; correlate with fundal findings",
      "Complete blood count (CBC): hemoglobin and hematocrit to assess for blood loss; baseline should be obtained on admission and repeated if hemorrhage is suspected",
      "Quantitative blood loss (QBL): weigh blood-soaked pads and linens (1 gram equals approximately 1 mL of blood); more accurate than visual estimation for detecting postpartum hemorrhage"
    ],
    management: [
      "Antepartum: measure fundal height at every prenatal visit from 20 weeks onward; plot measurements on a growth chart to identify trends suggesting SGA or LGA",
      "Immediate postpartum: assess fundal height, firmness, and position every 15 minutes for the first hour, then every 30 minutes for the next hour, then every 4 hours for 24 hours per facility protocol",
      "If uterus is boggy (soft and non-contracted): first ensure the bladder is empty (a full bladder displaces the uterus and prevents effective contraction), then perform fundal massage by placing one hand on the lower uterine segment for support and using the other hand to firmly massage the fundus in a circular motion until it becomes firm",
      "Administer uterotonic medications as prescribed: oxytocin (first-line), methylergonovine (second-line), misoprostol (when other agents are unavailable or contraindicated)",
      "If fundal height during pregnancy is more than 2 cm greater or less than expected for gestational age, report to the physician or midwife for further evaluation (ultrasound for fetal growth, amniotic fluid volume, and presentation)",
      "Encourage early ambulation and breastfeeding postpartum: breastfeeding stimulates endogenous oxytocin release which promotes uterine contraction and involution",
      "Monitor for subinvolution (failure of the uterus to return to pre-pregnant size by 6 weeks postpartum): causes include retained products of conception and endometritis; report persistent elevation of the fundus, heavy or prolonged bleeding, and foul-smelling lochia"
    ],
    nursingActions: [
      "Measure fundal height during pregnancy using the McDonald rule: empty the bladder first, position the patient supine with knees slightly flexed, place the zero mark of the tape at the symphysis pubis, and measure to the top of the fundus without stretching the tape",
      "Assess postpartum fundal position by documenting the number of fingerbreadths above or below the umbilicus (for example: fundus firm, midline, at the umbilicus; or fundus firm, 2 fingerbreadths below the umbilicus)",
      "Always assess bladder fullness before fundal assessment: a full bladder displaces the uterus upward and laterally (typically to the right) and prevents effective myometrial contraction -- encourage voiding or catheterize if unable to void",
      "Document lochia concurrently with fundal assessment: increased lochia with a rising or boggy fundus suggests uterine atony or retained products; foul-smelling lochia suggests endometritis",
      "Teach the postpartum patient self-assessment of fundal firmness and how to perform self-massage if the uterus feels soft; instruct on signs requiring immediate medical attention (heavy bleeding, large clots, dizziness, feeling faint)",
      "Report immediately: boggy uterus that does not respond to massage, fundal height that is rising rather than descending postpartum, heavy bleeding with clots, or uterine deviation from midline that persists after bladder emptying",
      "Calculate and document estimated blood loss or quantitative blood loss per facility protocol; recognize that postpartum hemorrhage is defined as blood loss greater than 500 mL for vaginal delivery or greater than 1000 mL for cesarean delivery"
    ],
    assessmentFindings: [
      "Normal antepartum: fundal height in centimeters approximately equals gestational age in weeks between 20 and 36 weeks (plus or minus 2 cm)",
      "Normal immediate postpartum: fundus firm, midline, at or one fingerbreadth below the umbilicus; lochia rubra moderate amount",
      "Boggy uterus: soft, non-contracted, spongy feel on palpation; the most common cause of early postpartum hemorrhage; requires immediate fundal massage and bladder emptying",
      "Uterine deviation from midline (typically to the right): most commonly caused by a distended bladder; fundus may also be higher than expected because a full bladder elevates the uterus",
      "Fundal height greater than expected for gestational age (more than 2 cm above): suggests macrosomia, multiple gestation, polyhydramnios, or incorrect dating",
      "Fundal height less than expected for gestational age (more than 2 cm below): suggests intrauterine growth restriction, oligohydramnios, transverse lie, or incorrect dating",
      "Subinvolution: uterus remains enlarged beyond expected timeline; lochia persists beyond 3 weeks or returns to rubra; may indicate retained products of conception or endometritis"
    ],
    signs: {
      left: [
        "Fundal height appropriate for gestational age (within 2 cm of expected)",
        "Postpartum fundus firm and midline, descending approximately 1 cm per day",
        "Normal lochia progression: rubra (days 1-3), serosa (days 4-10), alba (days 11-21)",
        "Mild uterine cramping with breastfeeding (afterpains from oxytocin release)",
        "Slight fundal deviation corrected after bladder emptying",
        "Small clots (less than golf ball size) in lochia within first 24 hours"
      ],
      right: [
        "Boggy uterus not responding to fundal massage (uterine atony -- postpartum hemorrhage risk)",
        "Heavy bleeding saturating more than one pad per hour with large clots",
        "Fundal height rising rather than descending postpartum (suggests hemorrhage or retained products)",
        "Persistent uterine deviation from midline despite empty bladder (may indicate pelvic mass or hematoma)",
        "Foul-smelling lochia with fever and uterine tenderness (endometritis)",
        "Signs of hypovolemic shock: tachycardia, hypotension, pallor, diaphoresis, altered level of consciousness"
      ]
    },
    medications: [
      {
        name: "Oxytocin (Pitocin/Syntocinon)",
        type: "Uterotonic agent (synthetic posterior pituitary hormone)",
        action: "Binds to oxytocin receptors on myometrial smooth muscle cells, activating the phospholipase C-inositol triphosphate (IP3) signaling cascade that releases intracellular calcium stores. The resulting increase in intracellular calcium activates myosin light-chain kinase, producing sustained myometrial contraction. Postpartum oxytocin promotes uterine contraction to compress the spiral arteries at the placental site, preventing hemorrhage. The number of oxytocin receptors increases dramatically during pregnancy, reaching peak density at term, which explains the uterus's increasing sensitivity to oxytocin as pregnancy progresses.",
        sideEffects: "Water intoxication and hyponatremia (oxytocin has antidiuretic hormone-like effects at high doses), hypotension (especially with rapid IV bolus), nausea, vomiting, uterine hyperstimulation (tachysystole)",
        contra: "Hypersensitivity to oxytocin; situations where vaginal delivery is contraindicated (for labor induction); caution with IV bolus as it can cause severe hypotension",
        pearl: "Postpartum oxytocin is administered as a continuous IV infusion (10-40 units in 1000 mL of lactated Ringer solution) or as an IM injection (10 units); NEVER give oxytocin as an undiluted IV bolus because it can cause life-threatening hypotension; breastfeeding triggers endogenous oxytocin release which naturally supports involution"
      },
      {
        name: "Methylergonovine (Methergine)",
        type: "Ergot alkaloid uterotonic agent",
        action: "Directly stimulates smooth muscle contraction by acting on alpha-adrenergic and serotonin receptors in the myometrium, producing a sustained tetanic contraction. Unlike oxytocin which produces rhythmic contractions, methylergonovine produces a prolonged, firm contraction of the uterus that compresses uterine blood vessels and controls hemorrhage. It also constricts peripheral and cerebral blood vessels through alpha-adrenergic receptor activation.",
        sideEffects: "Hypertension (significant risk due to systemic vasoconstriction), nausea, vomiting, headache, dizziness, chest pain, coronary vasospasm, peripheral vasoconstriction causing numbness and tingling in extremities",
        contra: "ABSOLUTELY CONTRAINDICATED in hypertension, preeclampsia, and eclampsia because of the risk of severe hypertension, stroke, and seizures; also contraindicated in peripheral vascular disease and coronary artery disease",
        pearl: "ALWAYS check blood pressure BEFORE administering methylergonovine -- if BP is greater than 140/90 mmHg, withhold the medication and notify the physician; administer IM (0.2 mg) as first-line route; oral form (0.2 mg every 6-8 hours) may be prescribed for up to 7 days postpartum for persistent bleeding; never administer IV unless life-threatening hemorrhage (risk of severe hypertensive crisis)"
      },
      {
        name: "Misoprostol (Cytotec)",
        type: "Prostaglandin E1 analogue (uterotonic agent)",
        action: "Binds to prostaglandin EP2 and EP3 receptors on myometrial smooth muscle cells, increasing intracellular calcium concentration and producing sustained uterine contractions. Misoprostol also promotes cervical ripening by stimulating collagen degradation and increasing cervical water content. As a synthetic prostaglandin E1 analogue, it stimulates both uterine contraction and gastrointestinal motility. It is heat-stable and does not require refrigeration, making it invaluable in resource-limited settings where oxytocin cold chain cannot be maintained.",
        sideEffects: "Diarrhea (most common), nausea, vomiting, abdominal cramping, fever and chills (especially with higher doses), shivering, headache",
        contra: "Known hypersensitivity to prostaglandins; use with caution in patients with asthma (may cause bronchospasm); pregnancy (teratogenic -- used only when pregnancy termination is the intended goal or postpartum)",
        pearl: "Misoprostol can be administered orally, sublingually, rectally, or buccally, making it extremely versatile when IV access is unavailable; for postpartum hemorrhage, the typical dose is 600-800 mcg rectally or sublingually; it is the WHO-recommended alternative when oxytocin is unavailable; shivering and fever are dose-dependent side effects that should not be confused with infection"
      }
    ],
    pearls: [
      "A full bladder is the most common REVERSIBLE cause of uterine atony in the immediate postpartum period -- always assess bladder fullness and encourage voiding (or catheterize) before performing fundal massage or administering uterotonics",
      "The McDonald rule (fundal height in centimeters equals gestational age in weeks) is reliable between 20 and 36 weeks; beyond 36 weeks, fetal descent into the pelvis (lightening) and variable fetal position make the measurement less reliable",
      "Postpartum fundal height should decrease by approximately one fingerbreadth (1 cm) per day -- a fundus that is rising or remaining at the same level suggests complications such as hemorrhage, retained placental fragments, or full bladder",
      "ALWAYS check blood pressure before administering methylergonovine (Methergine) -- this medication is ABSOLUTELY CONTRAINDICATED in hypertension and preeclampsia because it causes systemic vasoconstriction that can precipitate hypertensive crisis, stroke, or seizures",
      "Afterpains (uterine cramping with breastfeeding) are caused by endogenous oxytocin release stimulated by infant suckling -- they are more intense in multiparous women because the uterus must contract more vigorously to involute after being stretched by multiple pregnancies",
      "When assessing the fundus, use TWO hands: one hand supports the lower uterine segment (just above the symphysis pubis) while the other hand palpates and locates the top of the fundus -- failure to support the lower segment can cause uterine inversion, a life-threatening obstetric emergency",
      "Quantitative blood loss (QBL) using weighed pads and linens (1 gram = 1 mL blood) is more accurate than visual estimation for detecting postpartum hemorrhage -- visual estimation consistently underestimates blood loss by 30-50%"
    ],
    quiz: [
      {
        question: "During a postpartum assessment, the practical nurse finds the uterus displaced to the right side and the fundus is two fingerbreadths above the umbilicus. The patient delivered vaginally 2 hours ago. What is the nurse's first action?",
        options: [
          "Administer the prescribed oxytocin infusion",
          "Perform vigorous fundal massage",
          "Assist the patient to void or catheterize if she cannot void",
          "Notify the physician immediately"
        ],
        correct: 2,
        rationale: "A uterus displaced to the right and higher than expected is the classic presentation of bladder distension. A full bladder elevates and displaces the uterus, preventing effective myometrial contraction. The first action is to empty the bladder by assisting the patient to void or performing catheterization. Once the bladder is empty, the fundus should return to midline and descend. If the uterus remains boggy after bladder emptying, then fundal massage and uterotonics are indicated."
      },
      {
        question: "A physician orders methylergonovine (Methergine) 0.2 mg IM for a postpartum patient with persistent uterine atony. The patient's blood pressure is 152/96 mmHg. What should the practical nurse do?",
        options: [
          "Administer the medication as ordered since uterine atony is the priority concern",
          "Withhold the medication and notify the physician because methylergonovine is contraindicated in hypertension",
          "Administer a lower dose of methylergonovine to reduce the risk of hypertensive effects",
          "Give the medication orally instead of IM to reduce the hypertensive effect"
        ],
        correct: 1,
        rationale: "Methylergonovine (Methergine) is ABSOLUTELY CONTRAINDICATED in patients with hypertension because it causes systemic vasoconstriction that can precipitate severe hypertensive crisis, stroke, or seizures. With a blood pressure of 152/96 mmHg, the nurse must withhold the medication and notify the physician so an alternative uterotonic (such as misoprostol or additional oxytocin) can be prescribed. This is a safety-critical medication check."
      },
      {
        question: "A practical nurse is measuring fundal height during a routine prenatal visit at 32 weeks gestation. The measurement is 38 cm. Which action should the nurse take?",
        options: [
          "Document the finding as normal since there is a range of variation",
          "Report the discrepancy to the physician because the measurement is more than 2 cm greater than expected for gestational age",
          "Remeasure in one week to see if the discrepancy persists",
          "Ask the patient about her last menstrual period to recalculate the due date"
        ],
        correct: 1,
        rationale: "According to the McDonald rule, fundal height at 32 weeks should measure approximately 32 cm (plus or minus 2 cm, so the normal range would be 30-34 cm). A measurement of 38 cm is 6 cm greater than expected, which may indicate macrosomia, multiple gestation, polyhydramnios, or incorrect dating. The nurse should report this discrepancy to the physician so that an ultrasound can be ordered for further evaluation. A difference of more than 2 cm from expected warrants investigation."
      }
    ]
  },

  "erysipelas-rpn": {
    title: "Erysipelas: Superficial Skin Infection for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Erysipelas",
      content: "Erysipelas is an acute bacterial infection of the upper dermis and superficial lymphatic system, distinguished from deeper cellulitis by its involvement of the superficial dermal layers and lymphatic vessels rather than the deeper subcutaneous tissue. The causative organism in the vast majority of cases (approximately 80%) is Group A beta-hemolytic Streptococcus (Streptococcus pyogenes), although Group B, C, and G streptococci can also cause the infection. Staphylococcus aureus is an uncommon cause of erysipelas but is a more frequent pathogen in cellulitis. Understanding the distinction between erysipelas and cellulitis is clinically important because it affects treatment decisions, prognosis, and patient education. The pathogenesis of erysipelas begins with bacterial entry through a break in the skin barrier. The most common portals of entry include skin trauma (abrasions, lacerations, insect bites), surgical wounds, fungal infections of the skin (tinea pedis or athlete's foot is a particularly important predisposing factor for lower extremity erysipelas), eczema, and venous stasis ulcers. Once the bacteria penetrate the epidermis, they invade the upper dermis and the superficial lymphatic vessels. Streptococcus pyogenes produces several virulence factors that facilitate tissue invasion and inflammatory response. Streptolysin O and S are cytotoxic enzymes that lyse red blood cells, white blood cells, and tissue cells. Hyaluronidase breaks down hyaluronic acid in the extracellular matrix, allowing the bacteria to spread through tissues. Streptokinase activates plasminogen to plasmin, dissolving fibrin clots that might otherwise contain the infection. M protein on the bacterial surface inhibits phagocytosis by neutrophils, allowing the bacteria to evade the innate immune response. The invasion of the superficial lymphatic vessels triggers an intense inflammatory response. Bacterial toxins and the host immune response cause vasodilation, increased vascular permeability, and neutrophil infiltration in the upper dermis. This produces the characteristic clinical appearance of erysipelas: a sharply demarcated, raised, erythematous plaque with a palpable leading edge that is clearly distinct from the surrounding normal skin. The sharp demarcation occurs because the infection spreads through the superficial lymphatic network, which creates a distinct border between infected and uninfected tissue. In contrast, cellulitis involves the deeper subcutaneous tissue where tissue planes are less defined, resulting in poorly demarcated borders that blend gradually into surrounding skin. The classic butterfly distribution on the face (bilateral involvement of the cheeks with sparing of the nasolabial folds, crossing the bridge of the nose) is a well-recognized presentation of facial erysipelas, though it now accounts for only about 5-20% of cases. Lower extremity involvement accounts for approximately 70-80% of erysipelas cases and is strongly associated with predisposing factors such as lymphedema, venous insufficiency, obesity, tinea pedis, and previous episodes of cellulitis or erysipelas. Lymphatic damage from the infection itself creates a vicious cycle: each episode of erysipelas damages the superficial lymphatic vessels, impairing lymphatic drainage and creating lymphedema, which in turn increases the risk of recurrence. Approximately 30% of patients with erysipelas experience recurrence, and each episode further damages the lymphatic system. Complications of erysipelas include abscess formation, lymphatic obstruction leading to chronic lymphedema (elephantiasis nostra), bacteremia (occurring in approximately 5% of cases), poststreptococcal glomerulonephritis (a non-suppurative immune-mediated complication), deep vein thrombosis (due to venous compression from edema and inflammation), and necrotizing fasciitis (rare but life-threatening progression into the deep fascial planes). The practical nurse must be able to differentiate erysipelas from other causes of acute skin erythema and recognize signs of complications requiring urgent medical intervention."
    },
    riskFactors: [
      "Lymphedema (impaired lymphatic drainage creates a medium for bacterial growth and reduces local immune surveillance)",
      "Chronic venous insufficiency with stasis dermatitis or venous leg ulcers providing portals of bacterial entry",
      "Tinea pedis (athlete's foot) causing interdigital skin breakdown that serves as the most common entry point for lower extremity erysipelas",
      "Obesity (BMI greater than 30) associated with impaired lymphatic drainage, skin fold maceration, and chronic venous insufficiency",
      "Previous episodes of erysipelas or cellulitis (each episode damages lymphatic vessels, increasing recurrence risk)",
      "Diabetes mellitus with peripheral neuropathy (decreased sensation allows unnoticed skin trauma) and impaired immune function",
      "Immunocompromised state: corticosteroid use, chemotherapy, HIV/AIDS, or other causes of impaired neutrophil function"
    ],
    diagnostics: [
      "Clinical diagnosis: erysipelas is primarily diagnosed based on characteristic clinical presentation -- sharply demarcated, raised, erythematous plaque with a palpable border; laboratory tests support but do not replace clinical assessment",
      "Complete blood count (CBC) with differential: elevated white blood cell count with neutrophilia and left shift (increased bands) supports the diagnosis of bacterial infection",
      "Blood cultures: positive in only approximately 5% of erysipelas cases; obtain if systemic toxicity is present (high fever, rigors, hemodynamic instability) or in immunocompromised patients",
      "C-reactive protein (CRP) and erythrocyte sedimentation rate (ESR): elevated inflammatory markers support the diagnosis and can be used to monitor treatment response",
      "Wound culture: if there is an identifiable portal of entry with drainage, a swab culture may identify the causative organism; negative culture does not exclude the diagnosis",
      "Duplex ultrasound of the affected extremity: ordered if deep vein thrombosis (DVT) is suspected as a complication; distinguishes DVT from the inflammatory edema of erysipelas"
    ],
    management: [
      "Administer prescribed antibiotic therapy: oral penicillin V or amoxicillin is first-line for uncomplicated erysipelas; IV penicillin G for severe cases requiring hospitalization; cephalexin or clindamycin for patients with penicillin allergy",
      "Elevate the affected extremity above heart level to reduce edema, promote lymphatic drainage, and decrease pain; use pillows to maintain elevation continuously during acute phase",
      "Apply cool compresses to the affected area for comfort; avoid heat application which can increase inflammation and edema",
      "Administer prescribed analgesics and antipyretics (acetaminophen or ibuprofen) for pain and fever management",
      "Mark the borders of erythema with a skin marker and document the date and time to objectively monitor progression or improvement; remeasure and remark at each assessment",
      "Treat predisposing conditions: prescribe antifungal therapy for tinea pedis, optimize compression therapy for lymphedema and venous insufficiency, manage blood glucose in diabetic patients",
      "Implement prophylactic antibiotic therapy (penicillin V 250 mg twice daily or monthly intramuscular benzathine penicillin injections) for patients with recurrent erysipelas (three or more episodes per year) as prescribed"
    ],
    nursingActions: [
      "Assess the affected area at each evaluation: measure and document the extent of erythema, note the sharpness of borders, assess for warmth, tenderness, edema, bullae (fluid-filled blisters), and any areas of skin necrosis",
      "Mark the leading edge of erythema with a skin marker at the initial assessment and at each subsequent assessment to objectively track whether the infection is spreading or resolving; include the date and time with each marking",
      "Monitor vital signs every 4 hours or as ordered: fever greater than 38.5 degrees Celsius, tachycardia, hypotension, and altered mental status may indicate systemic sepsis",
      "Assess for signs of complications: increasing pain disproportionate to clinical findings (possible necrotizing fasciitis), bullae or hemorrhagic blisters, crepitus on palpation (gas gangrene), and signs of compartment syndrome in the affected extremity",
      "Administer antibiotics on time per the prescribed schedule; document any missed or delayed doses and report to the physician; ensure full course of therapy is completed (typically 10-14 days)",
      "Provide meticulous skin care: keep the affected area clean and dry; apply emollients to surrounding unaffected skin to maintain skin barrier integrity; inspect between skin folds and between toes for fungal infections",
      "Educate the patient about prevention of recurrence: daily skin inspection, prompt treatment of any skin breaks or fungal infections, proper skin moisturizing, leg elevation, compression stockings if prescribed, and early reporting of any new skin redness or warmth"
    ],
    assessmentFindings: [
      "Sharply demarcated, raised, erythematous plaque with a well-defined, palpable leading edge (the hallmark distinguishing feature of erysipelas from cellulitis)",
      "Butterfly pattern on the face: bilateral erythema across both cheeks and the bridge of the nose with sparing of the nasolabial folds (classic but now uncommon presentation, seen in 5-20% of cases)",
      "Peau d'orange appearance (skin surface resembling orange peel) due to edema in the dermis surrounding hair follicles and sweat glands",
      "Systemic symptoms: acute onset of fever (often 38.5-40 degrees Celsius), rigors, malaise, and headache; symptoms may precede visible skin changes by several hours",
      "Regional lymphadenopathy: tender, enlarged lymph nodes draining the affected area (inguinal lymphadenopathy with leg involvement, cervical lymphadenopathy with facial involvement)",
      "Bullae (fluid-filled blisters) or hemorrhagic vesicles may develop on the surface of the erythematous plaque in severe cases (bullous erysipelas)",
      "Lymphangitic streaking: red streaks extending from the affected area along the course of superficial lymphatic vessels toward regional lymph nodes"
    ],
    signs: {
      left: [
        "Well-demarcated area of erythema with warmth and mild tenderness",
        "Low-grade fever (38.0-38.5 degrees Celsius)",
        "Mild peripheral edema of the affected extremity",
        "Small area of erythema (less than 10 cm) without bullae or skin necrosis",
        "Regional lymph node tenderness without significant enlargement",
        "Intact skin surface without blistering or drainage"
      ],
      right: [
        "Rapidly spreading erythema despite antibiotic therapy (treatment failure or necrotizing fasciitis)",
        "Pain disproportionate to clinical findings (hallmark sign of necrotizing fasciitis -- surgical emergency)",
        "Hemorrhagic bullae, skin necrosis, or crepitus on palpation",
        "High fever with hemodynamic instability (tachycardia, hypotension) suggesting sepsis",
        "Circumferential involvement of an extremity with signs of compartment syndrome (tense swelling, pain with passive stretch)",
        "Purple or dusky discoloration of the skin indicating vascular compromise or tissue necrosis"
      ]
    },
    medications: [
      {
        name: "Penicillin V (Pen-VK) / Penicillin G",
        type: "Natural penicillin antibiotic (beta-lactam, cell wall synthesis inhibitor)",
        action: "Binds to penicillin-binding proteins (PBPs) on the bacterial cell wall, inhibiting transpeptidation -- the final cross-linking step in peptidoglycan synthesis. Without intact peptidoglycan cross-links, the bacterial cell wall loses structural integrity, leading to osmotic lysis and bacterial death. Penicillin is bactericidal against Group A Streptococcus, which remains universally susceptible to penicillin with no documented resistance. This consistent susceptibility makes penicillin the gold standard first-line treatment for erysipelas.",
        sideEffects: "Hypersensitivity reactions (urticaria, anaphylaxis in approximately 0.01-0.05% of patients), gastrointestinal disturbance (nausea, diarrhea), Clostridioides difficile-associated diarrhea, drug rash",
        contra: "Known penicillin allergy (obtain detailed allergy history -- many reported penicillin allergies are not true IgE-mediated reactions); cross-reactivity with cephalosporins is approximately 1-2% (lower than historically believed)",
        pearl: "Group A Streptococcus has NEVER developed resistance to penicillin, making it the most reliable antibiotic choice for erysipelas; oral penicillin V 500 mg four times daily for 10-14 days for uncomplicated cases; IV penicillin G 2-4 million units every 4-6 hours for severe or hospitalized cases; clinical improvement (defervescence, decreased erythema) expected within 48-72 hours of initiating appropriate therapy"
      },
      {
        name: "Cephalexin (Keflex)",
        type: "First-generation cephalosporin (beta-lactam, cell wall synthesis inhibitor)",
        action: "Like penicillin, cephalexin inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins and blocking peptidoglycan cross-linking. First-generation cephalosporins have excellent activity against gram-positive cocci including streptococci and methicillin-sensitive Staphylococcus aureus (MSSA). Cephalexin is used as an alternative to penicillin when broader gram-positive coverage is desired or when the distinction between erysipelas and cellulitis is unclear (cellulitis may be caused by S. aureus which is not adequately covered by penicillin alone).",
        sideEffects: "Gastrointestinal disturbance (nausea, diarrhea, abdominal pain), hypersensitivity reactions (less frequent than with penicillin), Clostridioides difficile-associated diarrhea, vaginal candidiasis",
        contra: "Known cephalosporin allergy; use with caution in patients with severe penicillin allergy (anaphylaxis) due to potential cross-reactivity (approximately 1-2%); dose adjustment required in renal impairment",
        pearl: "Cephalexin 500 mg four times daily for 10-14 days is the standard dose for skin and soft tissue infections; often chosen when the clinician cannot distinguish between erysipelas (streptococcal) and cellulitis (may include staphylococcal) because it covers both organisms; take with food to reduce GI side effects; monitor for superinfection (oral thrush, vaginal yeast infection) especially with prolonged courses"
      },
      {
        name: "Clindamycin (Dalacin)",
        type: "Lincosamide antibiotic (protein synthesis inhibitor)",
        action: "Binds to the 50S ribosomal subunit of susceptible bacteria, inhibiting the translocation step of protein synthesis. Clindamycin is bacteriostatic at usual concentrations but may be bactericidal at higher concentrations. It has excellent activity against gram-positive cocci (streptococci and staphylococci, including community-acquired MRSA) and most anaerobic bacteria. An important additional benefit of clindamycin in severe streptococcal infections is its ability to suppress bacterial toxin production by inhibiting protein synthesis, which may reduce the severity of toxin-mediated tissue damage.",
        sideEffects: "Clostridioides difficile-associated diarrhea (highest risk among all antibiotics used for skin infections -- occurs in up to 10% of patients), nausea, abdominal pain, skin rash, hepatotoxicity (rare)",
        contra: "History of Clostridioides difficile infection; known hypersensitivity to clindamycin or lincomycin; use with caution in patients with hepatic impairment or inflammatory bowel disease",
        pearl: "Reserved for patients with true penicillin allergy who cannot take cephalosporins; uniquely valuable in severe streptococcal infections because it suppresses toxin production (added to penicillin in necrotizing fasciitis and toxic shock syndrome); monitor for diarrhea throughout treatment and for 4-6 weeks after completion -- any watery or bloody diarrhea should prompt testing for C. difficile toxin; dose is 300-450 mg orally four times daily for 10-14 days"
      }
    ],
    pearls: [
      "The hallmark distinguishing feature of erysipelas from cellulitis is the SHARPLY DEMARCATED, RAISED border with a palpable leading edge -- erysipelas involves the upper dermis and lymphatics (sharp borders) while cellulitis involves the deeper subcutaneous tissue (diffuse, poorly defined borders)",
      "Group A Streptococcus has NEVER developed resistance to penicillin -- penicillin remains the gold standard treatment for confirmed erysipelas; broader-spectrum antibiotics are unnecessary and increase the risk of resistance and C. difficile infection",
      "Tinea pedis (athlete's foot) is the most common portal of entry for lower extremity erysipelas -- always examine between the toes and treat any fungal infection to prevent erysipelas recurrence",
      "Mark the borders of erythema with a skin marker at EVERY assessment with the date and time -- this is the most reliable method to objectively determine whether the infection is spreading or responding to treatment; verbal descriptions alone are insufficient",
      "Pain disproportionate to clinical findings is the hallmark warning sign of necrotizing fasciitis -- if a patient with erysipelas develops severe pain that seems out of proportion to the visible skin changes, escalate immediately because necrotizing fasciitis requires emergency surgical debridement",
      "Each episode of erysipelas damages the superficial lymphatic vessels, creating lymphedema that increases the risk of recurrence (30% recurrence rate) -- address modifiable risk factors aggressively and consider prophylactic antibiotics for patients with three or more episodes per year",
      "The classic butterfly facial pattern (bilateral cheek erythema crossing the nasal bridge) must be differentiated from systemic lupus erythematosus (SLE) malar rash -- erysipelas is acute with fever, warmth, and tenderness, while SLE malar rash is typically non-tender and spares the nasolabial folds; however, both conditions spare the nasolabial folds"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a patient with an acutely red, warm, and tender area on the lower leg. Which assessment finding would most strongly suggest erysipelas rather than cellulitis?",
        options: [
          "The patient has a fever of 38.8 degrees Celsius",
          "The erythematous area has sharply demarcated, raised borders with a palpable leading edge",
          "The affected leg is edematous compared to the other leg",
          "The patient reports pain in the affected area that worsens with walking"
        ],
        correct: 1,
        rationale: "The hallmark distinguishing feature of erysipelas is sharply demarcated, raised borders with a palpable leading edge. This occurs because erysipelas involves the upper dermis and superficial lymphatic system, which creates a distinct boundary between infected and uninfected tissue. Cellulitis involves the deeper subcutaneous tissue where tissue planes are less defined, resulting in poorly demarcated, diffuse borders. Fever, edema, and pain can occur in both conditions."
      },
      {
        question: "A patient with erysipelas on the right lower leg has been receiving oral penicillin for 48 hours. The practical nurse notes that the erythema has spread beyond the previously marked borders. Which action should the nurse take first?",
        options: [
          "Continue the current antibiotic and reassess in 24 hours since improvement may take up to 72 hours",
          "Remark the new borders, document the progression, and notify the physician immediately",
          "Apply a warm compress to the area to increase blood flow and antibiotic delivery",
          "Elevate the leg higher to promote lymphatic drainage"
        ],
        correct: 1,
        rationale: "Spreading erythema despite 48 hours of appropriate antibiotic therapy is a concerning finding that may indicate treatment failure, abscess formation, or progression to a more serious deep tissue infection (necrotizing fasciitis). The nurse should remark the new borders with a skin marker (including date and time), document the progression, and notify the physician immediately so that the treatment plan can be reassessed. The physician may order imaging, change antibiotics, or arrange surgical consultation."
      },
      {
        question: "A practical nurse is providing discharge teaching to a patient recovering from their second episode of erysipelas on the left leg. The patient has a history of tinea pedis. Which teaching point is MOST important for preventing recurrence?",
        options: [
          "Take prophylactic antibiotics for the rest of your life to prevent future episodes",
          "Avoid any exercise involving the legs to prevent skin trauma",
          "Treat and prevent tinea pedis with antifungal medication because fungal infections between the toes are the most common entry point for bacteria causing leg erysipelas",
          "Apply antibiotic ointment to the legs daily as a preventive measure"
        ],
        correct: 2,
        rationale: "Tinea pedis (athlete's foot) is the most common portal of entry for lower extremity erysipelas. The interdigital skin breakdown caused by fungal infection provides an opening for Group A Streptococcus to invade the dermis. Treating and preventing tinea pedis with antifungal medication is the single most important modifiable risk factor for preventing erysipelas recurrence. Prophylactic antibiotics may be considered after three or more episodes, but addressing the entry point is the priority. Daily antibiotic ointment is not evidence-based for prevention."
      }
    ]
  }
};

let injected = 0;
let skipped = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
  else skipped++;
}
console.log(`\nDone: ${injected} injected, ${skipped} skipped`);
