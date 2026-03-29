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
  "palliative-eol-rpn": {
    title: "End-of-Life Care Principles for Practical Nurses",
    cellular: {
      title: "Pathophysiology and Principles of End-of-Life Care",
      content: "End-of-life (EOL) care encompasses the holistic management of patients in the final days to weeks of life, focusing on comfort, dignity, and quality rather than curative intervention. The dying process involves a predictable cascade of physiological changes as organ systems progressively fail. The cardiovascular system shows declining cardiac output with resultant peripheral vasoconstriction, mottling of the extremities (livedo reticularis), and eventual central cyanosis. Blood pressure gradually decreases and the pulse becomes weak, thready, and irregular. The respiratory system undergoes characteristic changes including Cheyne-Stokes breathing (cyclical pattern of increasing then decreasing respiratory depth with periods of apnea), terminal congestion commonly called the death rattle (caused by pooling of secretions in the oropharynx and trachea that the patient can no longer clear), and agonal breathing (irregular, gasping respirations occurring as brainstem function deteriorates). The neurological system shows progressive withdrawal from the environment: the patient first loses interest in surroundings, then becomes less responsive to verbal stimuli, and finally responds only to painful stimuli before becoming completely unresponsive. Importantly, hearing is believed to be the last sense lost, which has critical implications for communication at the bedside. The renal system shows oliguria progressing to anuria as renal perfusion decreases, and the gastrointestinal system demonstrates loss of appetite (anorexia), dysphagia, and cessation of bowel function. Thermoregulation becomes impaired as hypothalamic function declines, leading to temperature extremes. The practical nurse must understand that these changes represent the normal dying process and should not prompt aggressive intervention. Comfort-focused care at end of life includes meticulous symptom management (pain, dyspnea, nausea, agitation, secretion management), psychosocial and spiritual support for the patient and family, maintaining the patient's dignity, and providing a peaceful environment. Postmortem care involves preparing the body according to facility policy and cultural or religious practices, which includes identification verification, removal of non-permanent medical devices (IV lines, urinary catheters) unless an autopsy is pending, bathing and positioning the body, and supporting the family's grieving process."
    },
    riskFactors: [
      "Terminal diagnosis with prognosis of six months or less (cancer, end-stage heart failure, COPD, renal disease, dementia)",
      "Progressive functional decline (increasing Palliative Performance Scale scores, declining Karnofsky Performance Status)",
      "Recurrent hospitalizations for the same chronic condition within the past six months",
      "Significant unintentional weight loss exceeding 10 percent of body weight over six months",
      "Declining oral intake with progressive dysphagia and dehydration",
      "Multiple comorbidities with organ system failure (cardiac, renal, hepatic, pulmonary)",
      "Advanced age with frailty syndrome and loss of independent activities of daily living"
    ],
    diagnostics: [
      "Palliative Performance Scale (PPS): validated tool measuring ambulation, activity level, self-care ability, oral intake, and consciousness level on a scale from 0 to 100 percent; scores below 40 percent indicate significant decline",
      "Edmonton Symptom Assessment System (ESAS): patient self-report of nine common symptoms (pain, tiredness, nausea, depression, anxiety, drowsiness, appetite, well-being, shortness of breath) rated 0-10; guides symptom management priorities",
      "Serum albumin and prealbumin: declining levels reflect nutritional status deterioration and are prognostic indicators; albumin below 25 g/L associated with poor prognosis",
      "Basic metabolic panel: monitors electrolytes and renal function; rising creatinine and BUN indicate declining renal perfusion; potassium imbalances may contribute to cardiac dysrhythmias",
      "Pulse oximetry: trending oxygen saturation decline reflects progressive respiratory failure; however, continuous monitoring may not be appropriate if it causes patient distress",
      "Urinalysis and urine output monitoring: decreasing output below 30 mL/hour progressing to anuria reflects declining renal perfusion and approaching death"
    ],
    management: [
      "Implement comfort care orders: discontinue unnecessary medications, laboratory draws, vital sign monitoring, and interventions that do not contribute to comfort",
      "Administer opioids (morphine) for pain and dyspnea as prescribed; titrate to comfort rather than specific vital sign parameters; respiratory depression at end of life is managed differently than in acute care",
      "Manage terminal secretions with repositioning (lateral or semi-prone) and anticholinergic medications (scopolamine, glycopyrrolate) as ordered; suctioning is generally avoided as it causes discomfort and stimulates more secretion production",
      "Provide meticulous oral care every 1-2 hours using moistened swabs, lip balm, and small amounts of fluids as tolerated; avoid forcing oral intake",
      "Maintain skin integrity with gentle repositioning every 2-4 hours as tolerated; use pressure-relieving surfaces; prioritize comfort over strict turning schedules if repositioning causes distress",
      "Facilitate family presence and communication; educate family about the dying process including expected changes in breathing pattern, skin color, and responsiveness",
      "Coordinate with interdisciplinary team including chaplaincy, social work, and bereavement support services; ensure advance directives and code status are documented and honored"
    ],
    nursingActions: [
      "Assess pain and symptoms using appropriate tools (ESAS, numeric rating scale, or behavioral pain scale for unresponsive patients) at regular intervals and report uncontrolled symptoms to the registered nurse or physician immediately",
      "Monitor for signs of imminent death: mottling of extremities progressing centrally, Cheyne-Stokes breathing, terminal congestion (death rattle), mandibular breathing (jaw movement without effective ventilation), and unresponsiveness",
      "Administer medications via the most comfortable route available; convert oral medications to sublingual, buccal, subcutaneous, or rectal routes when the patient can no longer swallow",
      "Document all comfort measures provided, symptom assessments, and family interactions accurately; maintain clear communication with the registered nurse regarding changes in patient status",
      "Provide emotional support to family members; explain that changes in breathing patterns, decreased responsiveness, and skin color changes are part of the normal dying process",
      "Perform postmortem care according to facility policy: verify time of death with physician, close eyes and mouth, remove non-permanent medical devices (unless coroner case), bathe the body, apply clean linens, and allow family time with the deceased",
      "Respect cultural, spiritual, and religious practices surrounding death; accommodate family requests for rituals, prayers, or specific postmortem handling within facility capabilities"
    ],
    assessmentFindings: [
      "Cheyne-Stokes respiration: cyclical breathing pattern with periods of increasing depth followed by decreasing depth and apneic pauses lasting 10-60 seconds; indicates brainstem dysfunction",
      "Terminal congestion (death rattle): audible gurgling or rattling sound with each breath caused by secretions pooling in the pharynx and trachea; occurs in approximately 50-92 percent of dying patients",
      "Mottling: irregular purplish-blue discoloration of the skin, typically beginning on the knees, feet, and hands, progressing centrally; indicates failing peripheral circulation",
      "Progressive oliguria to anuria: urine output decreases to dark, concentrated small volumes and eventually ceases as renal perfusion fails",
      "Peripheral cyanosis progressing to central cyanosis: bluish discoloration of nail beds and extremities advancing to lips and central areas as oxygenation declines",
      "Loss of muscle tone: facial features relax, jaw drops open, inability to maintain body position, loss of sphincter control (incontinence of urine and stool)",
      "Temperature dysregulation: alternating fever and hypothermia; skin may feel cool and clammy to touch despite core temperature elevation"
    ],
    signs: {
      left: [
        "Decreased oral intake and progressive anorexia",
        "Increasing drowsiness and longer periods of sleep",
        "Withdrawal from social interactions and surroundings",
        "Restlessness or intermittent agitation (terminal restlessness)",
        "Peripheral edema and skin breakdown at pressure points",
        "Weak, thready pulse and declining blood pressure"
      ],
      right: [
        "Cheyne-Stokes or agonal breathing patterns",
        "Terminal congestion (death rattle) unresponsive to repositioning",
        "Mottling extending from extremities to trunk (indicates death within 24-48 hours)",
        "Complete unresponsiveness to verbal and painful stimuli",
        "Mandibular breathing (jaw movement only, no effective ventilation)",
        "Cardiac dysrhythmias progressing to asystole"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system and peripheral tissues, inhibiting ascending pain pathways, altering the perception of and emotional response to pain, and reducing the sensation of air hunger (dyspnea) by decreasing the medullary respiratory center's sensitivity to carbon dioxide",
        sideEffects: "Respiratory depression (expected and accepted at end of life when titrated to comfort), constipation, sedation, nausea, urinary retention, myoclonus at high doses, pruritus",
        contra: "True allergy to morphine (rare); use with extreme caution in severe renal impairment (active metabolite morphine-6-glucuronide accumulates and may cause neurotoxicity including myoclonus and hyperalgesia); consider hydromorphone as alternative in renal failure",
        pearl: "At end of life, morphine is titrated to comfort rather than to specific respiratory rate targets; the principle of double effect ethically supports administering adequate doses to relieve suffering even if it may hasten death; start low at 2-5 mg subcutaneous every 4 hours and titrate by 25-50 percent if pain uncontrolled"
      },
      {
        name: "Scopolamine (Hyoscine Hydrobromide)",
        type: "Anticholinergic / antimuscarinic agent",
        action: "Blocks muscarinic acetylcholine receptors in the salivary glands, bronchial mucosa, and gastrointestinal tract, reducing secretion production; decreases smooth muscle motility; also has central sedative effects that may help manage terminal agitation by crossing the blood-brain barrier",
        sideEffects: "Dry mouth (therapeutic at end of life), blurred vision, urinary retention, tachycardia, paradoxical agitation or delirium (particularly in elderly), drowsiness",
        contra: "Narrow-angle glaucoma; mechanical gastrointestinal or urinary obstruction; use with caution in patients with tachycardia as anticholinergic effects may worsen heart rate",
        pearl: "Available as a transdermal patch (1.5 mg applied behind the ear every 72 hours) for prophylactic secretion management or as subcutaneous injection (0.4-0.6 mg every 4 hours) for acute terminal secretions; more effective when initiated early before secretions accumulate; does not clear existing secretions already pooled in the airway"
      },
      {
        name: "Midazolam",
        type: "Benzodiazepine (short-acting GABA-A receptor agonist)",
        action: "Enhances the effect of gamma-aminobutyric acid (GABA) at the GABA-A receptor, increasing chloride conductance and neuronal inhibition; produces anxiolysis, sedation, skeletal muscle relaxation, and anticonvulsant effects; used at end of life for terminal agitation, myoclonus, seizures, and palliative sedation when other measures fail",
        sideEffects: "Respiratory depression (dose-dependent), excessive sedation, paradoxical agitation (especially in elderly), hypotension, amnesia",
        contra: "Acute narrow-angle glaucoma; severe respiratory insufficiency (relative at end of life where comfort is the goal); concurrent use with opioids requires careful titration due to synergistic respiratory depression",
        pearl: "Preferred benzodiazepine at end of life due to water solubility (compatible with subcutaneous infusion), rapid onset (2-3 minutes IV, 5-15 minutes subcutaneous), and short duration; starting dose for terminal agitation is typically 2.5-5 mg subcutaneous every 1-2 hours as needed; for palliative sedation, continuous subcutaneous infusion at 1-5 mg per hour may be initiated after interdisciplinary team discussion and family consent"
      }
    ],
    pearls: [
      "Hearing is believed to be the LAST sense lost during the dying process -- always speak to the patient as though they can hear you, and encourage family members to do the same; avoid saying anything at the bedside that you would not say directly to the patient",
      "Terminal secretions (death rattle) are typically more distressing to family members than to the patient -- explain that the patient is not drowning or choking, and that the sound results from air passing through pooled secretions the patient can no longer clear",
      "The principle of double effect ethically justifies administering opioids and sedatives at end of life: the intended effect is symptom relief (pain, dyspnea, agitation), even if the foreseen but unintended effect may be hastened death -- document the clinical indication for each dose",
      "Mottling of the knees is one of the most reliable signs that death is approaching within 24-48 hours -- when mottling extends from the extremities toward the trunk, death is typically imminent",
      "Do NOT suction terminal secretions routinely -- suctioning stimulates more secretion production, causes patient distress, and is generally ineffective; repositioning to lateral or semi-prone and anticholinergic medications are preferred interventions",
      "Artificial hydration and nutrition at end of life may increase patient discomfort by worsening edema, ascites, and respiratory secretions -- educate families that the body naturally reduces intake as part of the dying process and that forcing fluids can cause harm",
      "Always verify code status (DNR/DNI/Allow Natural Death) and ensure it is clearly documented and communicated to all team members BEFORE the patient deteriorates -- the practical nurse must know where to locate this documentation and whom to contact if there is any uncertainty"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a dying patient who develops audible gurgling respirations (death rattle). Which intervention should the practical nurse implement first?",
        options: [
          "Perform deep oropharyngeal suctioning to clear the airway",
          "Reposition the patient to a lateral or semi-prone position",
          "Increase the IV fluid rate to thin the secretions",
          "Administer supplemental oxygen via non-rebreather mask"
        ],
        correct: 1,
        rationale: "Repositioning to a lateral or semi-prone position uses gravity to drain secretions away from the upper airway and is the first-line non-pharmacological intervention for terminal congestion. Suctioning is generally avoided as it stimulates more secretion production and causes patient discomfort. Increasing IV fluids would worsen secretion accumulation. Supplemental oxygen is unlikely to benefit an actively dying patient and may prolong the dying process."
      },
      {
        question: "The family of a dying patient asks the practical nurse why their loved one seems to breathe deeply for a while, then stops breathing entirely for several seconds before starting again. Which response by the practical nurse is most appropriate?",
        options: [
          "This is called Cheyne-Stokes breathing and is a normal part of the dying process as the brain's respiratory center function changes",
          "This means the patient is in severe pain and needs an immediate increase in morphine dosage",
          "This breathing pattern indicates the patient needs to be intubated and mechanically ventilated immediately",
          "This is a sign of fluid overload and the IV fluids should be discontinued right away"
        ],
        correct: 0,
        rationale: "Cheyne-Stokes respiration is a cyclical breathing pattern with periods of increasing then decreasing respiratory depth followed by apneic pauses. It occurs due to altered sensitivity of the brainstem respiratory center to carbon dioxide levels and is a normal finding in the dying process. This pattern does not indicate pain, need for intubation, or fluid overload. Educating the family about expected changes helps reduce anxiety and supports their coping."
      },
      {
        question: "A practical nurse is preparing to administer sublingual morphine to a dying patient for comfort. The patient's respiratory rate is 8 breaths per minute. What is the most appropriate action?",
        options: [
          "Withhold the morphine and notify the physician about the low respiratory rate",
          "Administer the morphine as prescribed because the goal of care is comfort",
          "Administer half the prescribed dose and reassess in 30 minutes",
          "Hold the morphine and administer naloxone to reverse respiratory depression"
        ],
        correct: 1,
        rationale: "In end-of-life care, the goal is comfort rather than maintaining specific vital sign parameters. Morphine is titrated to relieve pain and dyspnea, and a respiratory rate of 8 breaths per minute in a dying patient does not warrant withholding a comfort medication. The principle of double effect supports administering adequate analgesia even if respiratory depression may occur. Administering naloxone would reverse pain relief and cause significant distress."
      }
    ]
  },

  "palliative-symptom-mgmt-rpn": {
    title: "Palliative Symptom Management for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Symptom Burden in Palliative Care",
      content: "Palliative care is a specialized approach to care that focuses on improving quality of life for patients facing life-threatening illness through the prevention and relief of suffering. Unlike hospice care, which is specifically for end-of-life, palliative care can be provided alongside curative treatment at any stage of serious illness. The symptom burden in palliative patients is complex and multidimensional, often involving simultaneous management of pain, dyspnea, nausea, delirium, fatigue, and psychological distress. Pain in palliative care is understood through the concept of total pain, encompassing physical, psychological, social, and spiritual dimensions. The World Health Organization (WHO) pain ladder provides a structured approach to analgesia: Step 1 uses non-opioid analgesics (acetaminophen, NSAIDs) for mild pain; Step 2 adds weak opioids (codeine, tramadol) for moderate pain; Step 3 uses strong opioids (morphine, hydromorphone, fentanyl) for severe pain. Adjuvant medications (antidepressants, anticonvulsants, corticosteroids) may be added at any step. Breakthrough pain is defined as transient flares of pain that occur despite around-the-clock analgesia, and breakthrough doses are typically calculated as 10-15 percent of the total 24-hour opioid dose. Dyspnea in palliative patients results from multiple mechanisms: decreased lung compliance, pleural effusions, airway obstruction, anemia, respiratory muscle weakness, and anxiety. Low-dose opioids reduce the perception of breathlessness by decreasing the medullary respiratory center's sensitivity to carbon dioxide without necessarily causing clinically significant respiratory depression. Nausea and vomiting in palliative care arise from multiple pathways: chemoreceptor trigger zone activation (opioids, metabolic derangements), vestibular input, vagal afferent stimulation from the gastrointestinal tract (bowel obstruction, gastroparesis), and cortical inputs (anxiety, anticipatory nausea). Understanding the underlying mechanism guides antiemetic selection. Delirium affects up to 88 percent of patients in the final weeks of life and results from metabolic derangements, medication effects (especially opioids and anticholinergics), infection, organ failure, and brain metastases. Terminal delirium is often irreversible and management focuses on safety and symptom control rather than identifying the cause. The practical nurse plays a critical role in symptom assessment using validated tools, timely medication administration, non-pharmacological comfort measures, and reporting changes in symptom burden to the supervising nurse or physician."
    },
    riskFactors: [
      "Advanced malignancy with metastatic disease (bone metastases cause severe nociceptive pain, brain metastases cause delirium)",
      "End-stage organ failure: heart failure (dyspnea, edema), renal failure (uremia causing nausea, pruritus, delirium), liver failure (ascites, encephalopathy)",
      "Polypharmacy with multiple symptom-generating medications (opioids causing constipation and nausea, anticholinergics causing delirium)",
      "History of chronic pain requiring high-dose opioid therapy (opioid tolerance, hyperalgesia, increased breakthrough pain frequency)",
      "Psychological distress including depression, anxiety, and existential suffering (amplifies perception of physical symptoms)",
      "Malnutrition and cachexia (cancer-related anorexia-cachexia syndrome affects up to 80 percent of advanced cancer patients)",
      "Bowel obstruction from tumor progression or adhesions (causes intractable nausea, vomiting, and colicky abdominal pain)"
    ],
    diagnostics: [
      "Edmonton Symptom Assessment System (ESAS-r): revised version assessing nine symptoms on 0-10 numeric rating scales; completed by patient or proxy; guides prioritization of symptom management; scores 4-6 indicate moderate severity, 7-10 indicate severe",
      "Palliative Performance Scale (PPS): observer-rated assessment of five domains (ambulation, activity/evidence of disease, self-care, intake, consciousness); correlates with prognosis and helps guide care planning",
      "Constipation Assessment Scale: evaluates bowel function in patients on opioid therapy; includes assessment of last bowel movement, stool consistency, abdominal distension, and patient-reported difficulty",
      "Confusion Assessment Method (CAM): screens for delirium using four features -- acute onset and fluctuating course, inattention, disorganized thinking, altered level of consciousness; positive if features 1 and 2 plus either 3 or 4 are present",
      "Numeric Rating Scale or Behavioral Pain Scale: NRS (0-10) for verbal patients; behavioral observation tools (facial grimacing, guarding, restlessness, vocalization) for non-verbal or cognitively impaired patients",
      "Serum electrolytes, calcium, and renal function: hypercalcemia causes confusion, nausea, constipation; uremia causes nausea, pruritus, altered mental status; guide reversible symptom management"
    ],
    management: [
      "Implement the WHO pain ladder systematically: start at appropriate step based on pain severity; use around-the-clock dosing for continuous pain with breakthrough doses available for pain flares calculated at 10-15 percent of total 24-hour opioid dose",
      "Manage opioid-induced constipation proactively: initiate a bowel regimen (stimulant laxative plus stool softener) simultaneously with opioid therapy; assess bowel function daily; consider methylnaltrexone for refractory opioid-induced constipation",
      "Treat nausea based on the underlying mechanism: dopamine antagonists (haloperidol, metoclopramide) for chemoreceptor trigger zone-mediated nausea; prokinetics (metoclopramide) for gastroparesis; anticholinergics for bowel obstruction with colic",
      "Manage dyspnea with both pharmacological and non-pharmacological approaches: low-dose morphine (2.5-5 mg oral every 4 hours), fan directed at the face, positioning (high Fowler or leaning forward on overbed table), oxygen therapy if hypoxemic",
      "Address delirium by identifying and treating reversible causes when appropriate (medications, infection, constipation, urinary retention, hypercalcemia); use low-dose haloperidol for agitated delirium; ensure patient safety",
      "Provide mouth care every 2 hours for patients with decreased oral intake; manage oral candidiasis with nystatin or fluconazole; treat xerostomia with artificial saliva or ice chips",
      "Coordinate with the interdisciplinary palliative care team including physician, social worker, chaplain, and bereavement counselor; facilitate family meetings for goals-of-care discussions"
    ],
    nursingActions: [
      "Assess symptoms using validated tools (ESAS-r) at minimum every shift and whenever there is a change in patient condition; report uncontrolled symptoms (any score 7 or higher on ESAS) to the supervising nurse or physician promptly",
      "Administer scheduled and breakthrough analgesics as ordered; document time of administration, dose, route, pain score before administration, and pain score 30-60 minutes after administration to evaluate effectiveness",
      "Monitor bowel function daily in all patients receiving opioids; report no bowel movement for 3 or more days; administer prescribed laxatives and document response; perform abdominal assessment including bowel sounds and distension",
      "Implement non-pharmacological comfort measures: repositioning for comfort, cool cloth to forehead, music therapy, guided imagery, therapeutic touch, back massage with gentle pressure",
      "Assess for signs of opioid toxicity: pinpoint pupils, excessive sedation (unable to rouse), respiratory rate below 8 breaths per minute, myoclonus (involuntary muscle jerking); report immediately and have naloxone accessible",
      "Maintain a calm, quiet environment for patients with delirium; use reorientation strategies (consistent caregivers, clock, calendar, familiar objects); avoid physical restraints; ensure fall prevention measures are in place",
      "Provide education to family members about the purpose of palliative medications, expected effects, and the importance of reporting uncontrolled symptoms; reinforce that adequate pain management is a patient right"
    ],
    assessmentFindings: [
      "Pain assessment: location, quality (sharp, dull, burning, aching), intensity (0-10), timing (constant vs intermittent), aggravating and relieving factors; differentiate nociceptive (somatic: well-localized, aching; visceral: diffuse, cramping) from neuropathic (burning, shooting, tingling) pain",
      "Dyspnea: subjective sensation of breathlessness rated on 0-10 scale; observe for accessory muscle use, nasal flaring, tachypnea, pursed-lip breathing, inability to speak in full sentences",
      "Nausea and vomiting: frequency, volume, content (undigested food suggests gastroparesis, bilious suggests bowel obstruction), relationship to meals or medications, associated symptoms (abdominal pain, distension)",
      "Delirium features: acute onset confusion, fluctuating consciousness, inattention (cannot recite months backward), disorganized speech, hallucinations (visual more common than auditory), agitation or hypoactive withdrawal",
      "Constipation: days since last bowel movement, stool consistency (Bristol Stool Scale), abdominal distension, tympany on percussion, hypoactive or absent bowel sounds, patient-reported bloating or cramping",
      "Fatigue and functional decline: progressive inability to perform activities of daily living, increasing time spent in bed, decreased appetite, social withdrawal",
      "Skin integrity: pressure injuries at sacrum, heels, and occiput in immobile patients; fungating wounds from tumor invasion (assess for odor, bleeding, exudate); edema from hypoalbuminemia or lymphatic obstruction"
    ],
    signs: {
      left: [
        "Mild to moderate pain (4-6 on numeric rating scale) managed with current analgesic regimen",
        "Intermittent nausea without vomiting responding to antiemetic therapy",
        "Mild constipation (soft stool every 2-3 days) on bowel regimen",
        "Fatigue with decreased activity tolerance but able to perform basic self-care",
        "Mild dyspnea on exertion relieved by rest and positioning",
        "Occasional anxiety or sadness responsive to supportive measures"
      ],
      right: [
        "Severe uncontrolled pain (7-10 on numeric rating scale) not responding to current analgesic regimen -- requires urgent dose adjustment",
        "Intractable nausea and vomiting with signs of dehydration or aspiration risk",
        "Fecal impaction or bowel obstruction (absent bowel sounds, abdominal distension, vomiting fecal material)",
        "Agitated delirium with risk of self-harm (pulling at lines, attempting to climb out of bed, combative behavior)",
        "Severe dyspnea at rest with oxygen saturation below 85 percent and respiratory distress",
        "Opioid toxicity signs: respiratory rate below 8, pinpoint pupils, unarousable sedation, myoclonus"
      ]
    },
    medications: [
      {
        name: "Haloperidol (Haldol)",
        type: "Butyrophenone antipsychotic (dopamine D2 receptor antagonist)",
        action: "Blocks dopamine D2 receptors in the chemoreceptor trigger zone (CTZ) and mesolimbic pathway; in palliative care, used for two primary indications: antiemetic effect (blocks dopamine-mediated nausea at the CTZ) and management of delirium (reduces agitation, hallucinations, and disorganized thinking by blocking mesolimbic dopamine pathways)",
        sideEffects: "Extrapyramidal symptoms (acute dystonia, akathisia, parkinsonism), QT prolongation (risk of torsades de pointes), sedation, orthostatic hypotension, neuroleptic malignant syndrome (rare but life-threatening: fever, rigidity, altered consciousness, autonomic instability)",
        contra: "Parkinson disease or Lewy body dementia (severe sensitivity to dopamine blockade causing life-threatening rigidity); prolonged QT interval; concurrent use with other QT-prolonging agents; severe CNS depression",
        pearl: "In palliative care, haloperidol is a first-line antiemetic for opioid-induced nausea (0.5-1 mg oral or subcutaneous every 8 hours) and first-line treatment for delirium (0.5-2 mg subcutaneous every 4-8 hours); uniquely useful because it can be given subcutaneously, has minimal anticholinergic effects compared to other antipsychotics, and is effective at low doses; always check ECG for QT interval before initiating"
      },
      {
        name: "Metoclopramide (Reglan/Maxeran)",
        type: "Prokinetic agent and antiemetic (dopamine D2 antagonist with peripheral prokinetic activity)",
        action: "Dual mechanism: centrally blocks dopamine D2 receptors in the chemoreceptor trigger zone to reduce nausea; peripherally enhances acetylcholine release from myenteric neurons in the upper gastrointestinal tract, increasing gastric motility, accelerating gastric emptying, and increasing lower esophageal sphincter tone; particularly effective for nausea caused by gastroparesis, gastric stasis from opioids, or functional bowel dysmotility",
        sideEffects: "Drowsiness, restlessness, diarrhea, extrapyramidal symptoms (dystonia, akathisia -- more common in younger patients), tardive dyskinesia with prolonged use (involuntary facial movements that may be irreversible), QT prolongation",
        contra: "Complete mechanical bowel obstruction (prokinetic action can worsen perforation risk), pheochromocytoma (may precipitate hypertensive crisis), seizure disorder (lowers seizure threshold), concurrent use with other dopamine antagonists, Parkinson disease",
        pearl: "Administer 30 minutes before meals and at bedtime for maximum prokinetic benefit; contraindicated in COMPLETE bowel obstruction but may be used in partial obstruction under physician guidance; limit use to 12 weeks maximum to reduce tardive dyskinesia risk; if extrapyramidal symptoms develop, administer diphenhydramine 25-50 mg as rescue"
      },
      {
        name: "Hydromorphone (Dilaudid)",
        type: "Semisynthetic opioid analgesic (mu-opioid receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system and peripheral tissues with approximately 5-7 times the potency of morphine on a milligram-per-milligram basis; inhibits ascending pain transmission in the spinal cord dorsal horn and alters pain perception in the brain; also provides antitussive effects and reduces dyspnea perception; metabolized hepatically to hydromorphone-3-glucuronide (H3G) which has neuroexcitatory properties at high doses",
        sideEffects: "Respiratory depression, constipation (nearly universal -- requires prophylactic bowel regimen), nausea and vomiting (usually resolves within 3-5 days), sedation, pruritus, urinary retention, myoclonus at high doses (from H3G accumulation)",
        contra: "Severe respiratory depression in unmonitored settings (relative in palliative care where comfort is the goal); paralytic ileus; concurrent use with MAO inhibitors (risk of serotonin syndrome and respiratory depression); known hypersensitivity",
        pearl: "Preferred alternative to morphine in patients with renal impairment because hydromorphone does not produce the neurotoxic metabolite morphine-6-glucuronide that accumulates in renal failure; equianalgesic conversion: oral morphine 30 mg equals oral hydromorphone approximately 6 mg; always initiate a bowel regimen (sennosides plus docusate) when starting any opioid"
      }
    ],
    pearls: [
      "The WHO pain ladder is a framework, not a rigid protocol -- patients with severe pain should start at Step 3 (strong opioids) immediately rather than progressing through Steps 1 and 2; the goal is rapid and effective pain control",
      "Breakthrough pain doses are calculated as 10-15 percent of the total 24-hour opioid dose; if a patient requires more than 3-4 breakthrough doses per day, the around-the-clock dose should be increased by the total amount of breakthrough medication used in the preceding 24 hours",
      "Always start a bowel regimen simultaneously with opioid therapy -- opioid-induced constipation does NOT develop tolerance like other opioid side effects (nausea, sedation), meaning it persists and worsens throughout treatment if not actively managed",
      "Low-dose morphine (2.5-5 mg oral or 1-2 mg subcutaneous) effectively treats dyspnea in palliative care by reducing the medullary respiratory center's sensitivity to carbon dioxide -- this is a different mechanism than analgesia and does not require high doses",
      "For patients with delirium, use haloperidol as first-line pharmacotherapy; benzodiazepines (lorazepam) should generally be AVOIDED as monotherapy for delirium as they can worsen confusion -- the exception is delirium tremens (alcohol withdrawal) where benzodiazepines are first-line",
      "Metoclopramide is the antiemetic of choice for gastroparesis and opioid-related gastric stasis, but it is absolutely CONTRAINDICATED in complete mechanical bowel obstruction where it could precipitate perforation",
      "Assess for and report the concept of total pain: a patient may report uncontrolled pain despite adequate analgesia because of unaddressed psychological suffering (fear, depression), social distress (family conflict, financial concerns), or spiritual anguish (existential questioning) -- effective palliative care addresses all dimensions"
    ],
    quiz: [
      {
        question: "A patient with advanced cancer is receiving sustained-release morphine 60 mg orally every 12 hours (total daily dose 120 mg). The patient reports sudden severe pain that breaks through the regular medication. What is the appropriate breakthrough dose the practical nurse should anticipate being ordered?",
        options: [
          "Morphine 5 mg oral immediate-release",
          "Morphine 12-18 mg oral immediate-release",
          "Morphine 30 mg oral immediate-release",
          "Morphine 60 mg oral immediate-release"
        ],
        correct: 1,
        rationale: "Breakthrough pain doses are calculated as 10-15 percent of the total 24-hour opioid dose. The patient's total daily morphine dose is 120 mg. Ten to fifteen percent of 120 mg equals 12-18 mg. This provides adequate relief for breakthrough pain without excessive dosing. A dose of 5 mg would be subtherapeutic, while 30 mg or 60 mg would represent excessive doses that increase the risk of adverse effects."
      },
      {
        question: "A practical nurse is caring for a palliative patient receiving morphine who has not had a bowel movement in 4 days. The patient reports abdominal distension and discomfort. Which intervention should the practical nurse prioritize?",
        options: [
          "Discontinue the morphine to resolve the constipation",
          "Administer the prescribed stimulant laxative and stool softener and report the finding to the registered nurse",
          "Encourage increased oral fluid intake only and reassess in 24 hours",
          "Apply a heating pad to the abdomen and wait for the next bowel movement"
        ],
        correct: 1,
        rationale: "Opioid-induced constipation requires active pharmacological management with stimulant laxatives (sennosides) plus stool softeners (docusate). Morphine should not be discontinued as pain management is a priority in palliative care. Fluid intake alone is insufficient to overcome opioid-induced constipation. The finding of 4 days without a bowel movement with abdominal distension requires prompt intervention and reporting."
      },
      {
        question: "A palliative care patient with advanced liver failure becomes acutely confused, agitated, and is pulling at intravenous lines. The patient was alert and oriented earlier in the shift. Which medication should the practical nurse anticipate will be ordered first?",
        options: [
          "Lorazepam 1 mg IV for sedation",
          "Haloperidol 0.5-1 mg subcutaneous",
          "Diphenhydramine 50 mg oral for agitation",
          "Morphine 5 mg subcutaneous for comfort"
        ],
        correct: 1,
        rationale: "Haloperidol is the first-line pharmacological treatment for delirium in palliative care. It blocks dopamine D2 receptors, reducing agitation and hallucinations effectively at low doses. Lorazepam and other benzodiazepines can worsen delirium and should be avoided as monotherapy (except in alcohol withdrawal delirium). Diphenhydramine has anticholinergic properties that would exacerbate delirium. Morphine does not treat delirium and could worsen confusion."
      }
    ]
  },

  "pancreatic-pseudocyst-rpn": {
    title: "Pancreatic Pseudocyst Management for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Pancreatic Pseudocyst Formation",
      content: "A pancreatic pseudocyst is an encapsulated collection of fluid rich in pancreatic enzymes (amylase, lipase, trypsin) that develops as a complication of acute or chronic pancreatitis, pancreatic trauma, or rarely pancreatic duct disruption from malignancy. The term pseudocyst distinguishes it from a true cyst because it lacks an epithelial lining; instead, the wall is composed of fibrous tissue, granulation tissue, and inflammatory debris that organizes over a period of 4-6 weeks following the initial pancreatic insult. The pathogenesis begins with pancreatic ductal disruption, which allows pancreatic juice to leak into the peripancreatic space. In acute pancreatitis, autoactivation of trypsinogen to trypsin within the pancreas initiates a cascade of enzyme activation that causes parenchymal autodigestion, necrosis, and inflammation. Inflammatory mediators (interleukin-1, interleukin-6, tumor necrosis factor alpha) increase vascular permeability, leading to fluid extravasation into the peripancreatic tissues and lesser sac. Over weeks, this fluid collection becomes encapsulated by a wall of reactive fibrous tissue without an epithelial lining, forming the pseudocyst. The fluid within the pseudocyst is rich in pancreatic enzymes (markedly elevated amylase and lipase), and the enzymatic content makes it potentially destructive to surrounding structures. Pseudocysts vary in size from small asymptomatic collections to large masses exceeding 10 cm that can compress adjacent organs. Complications include infection (infected pseudocyst or abscess), hemorrhage (erosion into splenic artery or gastroduodenal artery -- a life-threatening surgical emergency), rupture into the peritoneal cavity causing pancreatic ascites, obstruction of the bile duct causing jaundice, obstruction of the duodenum causing gastric outlet obstruction with nausea and vomiting, and splenic vein thrombosis leading to left-sided portal hypertension. Most small pseudocysts (less than 6 cm) resolve spontaneously within 6 weeks without intervention. Persistent pseudocysts larger than 6 cm or those causing symptoms typically require drainage, which can be performed endoscopically (EUS-guided cystogastrostomy or cystduodenostomy), percutaneously (CT-guided catheter drainage), or surgically (cystogastrostomy, cystojejunostomy, or distal pancreatectomy). The practical nurse's role centers on monitoring for complications, managing abdominal symptoms, maintaining nutritional support, and reporting changes in the patient's clinical status."
    },
    riskFactors: [
      "Acute pancreatitis (most common cause -- pseudocysts develop in approximately 5-15 percent of acute pancreatitis cases, more frequently in alcohol-related pancreatitis)",
      "Chronic pancreatitis with recurrent inflammatory episodes and progressive ductal damage",
      "Alcohol use disorder (most common cause of chronic pancreatitis in adults, leading to recurrent pancreatic injury and pseudocyst formation)",
      "Gallstone disease (second most common cause of acute pancreatitis through common bile duct obstruction and reflux of bile into the pancreatic duct)",
      "Pancreatic trauma (blunt abdominal injury from motor vehicle accidents, falls, or sports injuries can disrupt the pancreatic duct)",
      "Post-ERCP pancreatitis (endoscopic retrograde cholangiopancreatography can cause iatrogenic pancreatic ductal injury)",
      "Hypertriglyceridemia (triglyceride levels above 11.3 mmol/L or 1000 mg/dL can cause acute pancreatitis through toxic free fatty acid accumulation in pancreatic capillaries)"
    ],
    diagnostics: [
      "Contrast-enhanced CT scan of the abdomen: gold standard for pancreatic pseudocyst diagnosis and characterization; identifies location, size, wall thickness, and relationship to surrounding structures; differentiates pseudocyst from other pancreatic fluid collections (acute peripancreatic fluid collection, walled-off necrosis, cystic neoplasm)",
      "Endoscopic ultrasound (EUS): provides detailed imaging of the pseudocyst wall and contents; allows fine-needle aspiration of cyst fluid for analysis (amylase, CEA, cytology) to differentiate pseudocyst from cystic neoplasm; also serves as therapeutic tool for EUS-guided drainage",
      "Serum amylase and lipase: may be elevated if there is ongoing pancreatic inflammation or communication between the pseudocyst and pancreatic duct; lipase is more specific for pancreatic pathology; levels greater than 3 times normal are diagnostic of acute pancreatitis",
      "Complete blood count (CBC): elevated WBC suggests infection (infected pseudocyst or pancreatic abscess); low hemoglobin may indicate hemorrhage into the pseudocyst from erosion into adjacent blood vessels",
      "Cyst fluid analysis (obtained via EUS-guided aspiration): high amylase (typically greater than 250 U/L) confirms communication with the pancreatic duct; low CEA differentiates pseudocyst from mucinous cystic neoplasm; Gram stain and culture identify infected pseudocyst",
      "MRCP (magnetic resonance cholangiopancreatography): non-invasive imaging of the pancreatic and biliary ductal system; identifies ductal disruption, strictures, and communication between the pseudocyst and the pancreatic duct"
    ],
    management: [
      "Observe small asymptomatic pseudocysts (less than 6 cm) with serial imaging every 4-6 weeks; most resolve spontaneously within 6 weeks as the inflammatory process subsides and the pancreatic duct heals",
      "Maintain NPO status or clear liquid diet during acute episodes to reduce pancreatic enzyme stimulation; advance diet gradually as tolerated with low-fat, small, frequent meals",
      "Administer IV fluid resuscitation for patients with signs of dehydration, third-space fluid loss, or hemodynamic instability; monitor strict intake and output",
      "Manage pain with scheduled analgesics as ordered; position patient in side-lying or knee-to-chest position to reduce abdominal tension; avoid morphine if possible in pancreatitis due to theoretical sphincter of Oddi spasm (though evidence is limited)",
      "Prepare patient for drainage procedure when indicated: EUS-guided cystogastrostomy (endoscopic creation of a tract between the pseudocyst and the stomach), CT-guided percutaneous drainage (catheter placement through the skin into the pseudocyst), or surgical drainage (cystogastrostomy or Roux-en-Y cystojejunostomy)",
      "Administer pancreatic enzyme supplements as ordered for patients with chronic pancreatitis and exocrine insufficiency (malabsorption with steatorrhea)",
      "Initiate alcohol cessation counseling and support for patients with alcohol-related pancreatitis; arrange outpatient follow-up with gastroenterology"
    ],
    nursingActions: [
      "Monitor abdominal assessment findings every 4 hours: measure abdominal girth at the umbilicus and compare to baseline; auscultate bowel sounds in all four quadrants; palpate gently for tenderness, guarding, or new masses; report increasing distension or new-onset rigidity immediately",
      "Monitor vital signs for early signs of hemorrhage or sepsis: tachycardia, hypotension, fever, and report any acute deterioration; hemorrhage into a pseudocyst from arterial erosion is a surgical emergency presenting with sudden severe abdominal pain and hemodynamic instability",
      "Assess and document pain characteristics using PQRST format: Provocation (eating, lying flat), Quality (dull ache, sharp, radiating to back), Region (epigastric, left upper quadrant), Severity (0-10), Timing (constant vs postprandial); report uncontrolled pain",
      "If a percutaneous drain is in place: assess drain site for signs of infection (redness, swelling, purulent drainage), measure and document drain output (volume, color, consistency) every shift, maintain drain patency, secure the drain to prevent accidental dislodgement",
      "Monitor nutritional status: daily weights, serum albumin trends, caloric intake assessment; report signs of malabsorption (steatorrhea -- pale, foul-smelling, greasy stools that float) which indicate exocrine pancreatic insufficiency",
      "Administer prescribed medications and monitor for therapeutic response: proton pump inhibitors to reduce acid stimulation of the pancreas, antiemetics for nausea, antibiotics if infection is suspected, pancreatic enzyme replacements with meals",
      "Educate patient on dietary modifications: avoid alcohol completely, follow low-fat diet (less than 30 grams fat per day), eat small frequent meals, avoid caffeine and spicy foods that stimulate pancreatic secretion"
    ],
    assessmentFindings: [
      "Epigastric or left upper quadrant abdominal pain radiating to the back: characteristic of pancreatic pathology; pain often worsens after eating and when lying supine; may improve when leaning forward",
      "Palpable abdominal mass in the epigastrium: large pseudocysts (greater than 6 cm) may be palpable as a smooth, rounded, tender mass; distinguishable from malignancy by clinical history and imaging",
      "Early satiety and nausea: compression of the stomach or duodenum by an enlarging pseudocyst causes gastric outlet obstruction; patient reports feeling full after small amounts of food and progressive nausea",
      "Jaundice with pruritus: compression of the common bile duct by a pseudocyst in the head of the pancreas causes obstructive jaundice (elevated direct bilirubin, elevated alkaline phosphatase, clay-colored stools, dark urine)",
      "Weight loss and steatorrhea: malabsorption from exocrine pancreatic insufficiency; stools are pale, bulky, foul-smelling, and greasy due to undigested fat; patient may report difficulty flushing stools",
      "Fever with leukocytosis: suggests infected pseudocyst (pancreatic abscess); patient appears septic with fever, chills, tachycardia, and elevated WBC; requires urgent drainage and antibiotic therapy",
      "Sudden severe abdominal pain with hemodynamic instability: suggests pseudocyst hemorrhage from erosion into the splenic artery or gastroduodenal artery; this is a surgical emergency requiring immediate intervention"
    ],
    signs: {
      left: [
        "Mild to moderate epigastric pain managed with oral analgesics",
        "Intermittent nausea without vomiting controlled with antiemetics",
        "Stable pseudocyst size on serial imaging (not enlarging)",
        "Normal vital signs and laboratory values within expected range",
        "Adequate oral intake with low-fat diet tolerated",
        "Mild abdominal tenderness without guarding or rigidity"
      ],
      right: [
        "Sudden severe abdominal pain with hypotension and tachycardia (pseudocyst hemorrhage -- surgical emergency)",
        "Fever with chills and rising WBC (infected pseudocyst requiring urgent drainage)",
        "New-onset jaundice with elevated bilirubin (bile duct compression)",
        "Rapid increase in abdominal girth with peritoneal signs (pseudocyst rupture)",
        "Persistent vomiting with inability to tolerate oral intake (gastric outlet obstruction)",
        "Grey Turner sign (flank ecchymosis) or Cullen sign (periumbilical ecchymosis) indicating retroperitoneal hemorrhage"
      ]
    },
    medications: [
      {
        name: "Octreotide (Sandostatin)",
        type: "Somatostatin analog",
        action: "Mimics the action of naturally occurring somatostatin by binding to somatostatin receptors (primarily subtypes 2 and 5) in the pancreas, gastrointestinal tract, and pituitary gland; inhibits the secretion of pancreatic enzymes (amylase, lipase, trypsin), reduces pancreatic exocrine output volume, decreases splanchnic blood flow, and inhibits release of multiple gastrointestinal hormones (gastrin, secretin, cholecystokinin) thereby reducing pancreatic stimulation",
        sideEffects: "Nausea, abdominal cramps, diarrhea or steatorrhea (paradoxically, from reduced pancreatic enzyme output), gallstone formation (long-term use reduces gallbladder motility), hyperglycemia or hypoglycemia (alters insulin and glucagon secretion), injection site pain",
        contra: "Hypersensitivity to octreotide; use with caution in diabetes mellitus (unpredictable glucose fluctuations); caution in patients with gallbladder disease (accelerates cholelithiasis)",
        pearl: "Used in pancreatic pseudocyst management to reduce pancreatic secretion volume and promote pseudocyst resolution; subcutaneous injection 100-250 mcg three times daily or continuous IV infusion; monitor blood glucose every 4-6 hours as octreotide suppresses both insulin and glucagon; long-acting depot formulation (Sandostatin LAR) available for monthly injection in chronic management"
      },
      {
        name: "Pantoprazole (Pantoloc/Protonix)",
        type: "Proton pump inhibitor (PPI)",
        action: "Irreversibly binds to and inhibits the hydrogen-potassium ATPase enzyme system (proton pump) on the luminal surface of gastric parietal cells, blocking the final common pathway of acid secretion; in pancreatic disease, reducing gastric acid output decreases secretin release from duodenal S-cells, which in turn reduces pancreatic bicarbonate and fluid secretion, thereby decreasing intrapancreatic pressure and promoting duct healing",
        sideEffects: "Headache, diarrhea, nausea, flatulence; long-term use associated with Clostridioides difficile infection, hypomagnesemia (monitor magnesium annually with prolonged use), vitamin B12 deficiency, increased hip fracture risk, and potential for rebound acid hypersecretion upon discontinuation",
        contra: "Known hypersensitivity to proton pump inhibitors; concurrent use with rilpivirine or atazanavir (PPIs reduce absorption of these antiretrovirals by increasing gastric pH); caution with hepatic impairment (reduce dose in severe liver disease)",
        pearl: "In pancreatic pseudocyst management, PPIs reduce acid-mediated pancreatic stimulation and protect against stress ulceration; IV pantoprazole 40 mg every 12 hours for acute management, transitioning to oral 40 mg daily; administer oral form 30-60 minutes before the first meal of the day on an empty stomach for optimal acid suppression; do not crush enteric-coated tablets"
      },
      {
        name: "Meropenem (Merrem)",
        type: "Carbapenem antibiotic (broad-spectrum beta-lactam)",
        action: "Binds to penicillin-binding proteins (PBPs 2 and 3) on bacterial cell wall, inhibiting transpeptidase enzymes essential for peptidoglycan cross-linking, resulting in defective cell wall synthesis, osmotic instability, and bacterial cell lysis; has the broadest spectrum of any beta-lactam class covering gram-positive organisms, gram-negative organisms including Pseudomonas aeruginosa, and anaerobic bacteria; stable against most beta-lactamase enzymes including extended-spectrum beta-lactamases (ESBLs)",
        sideEffects: "Diarrhea (monitor for Clostridioides difficile colitis), nausea, headache, injection site inflammation, rash, seizures (lower seizure threshold than imipenem), elevated liver enzymes, thrombocytopenia",
        contra: "Known anaphylaxis to carbapenems; use with caution in patients with penicillin allergy (cross-reactivity approximately 1 percent); concurrent use with valproic acid (meropenem significantly reduces valproic acid levels, potentially causing breakthrough seizures); severe renal impairment requires dose adjustment",
        pearl: "Reserved for infected pancreatic pseudocyst or pancreatic abscess confirmed by CT-guided aspiration culture; one of the few antibiotics with adequate penetration into pancreatic tissue and necrotic collections; typical dose 1 g IV every 8 hours adjusted for renal function; unlike imipenem, meropenem has a lower seizure risk and does not require co-administration with cilastatin; obtain cultures before initiating therapy"
      }
    ],
    pearls: [
      "A pseudocyst differs from a true cyst in that it lacks an epithelial lining -- the wall is composed of fibrous and granulation tissue; this distinction is clinically important because cystic neoplasms (mucinous cystadenoma, IPMN) may mimic pseudocysts and require completely different management including potential surgical resection",
      "Most small pancreatic pseudocysts (less than 6 cm) resolve spontaneously within 6 weeks -- intervention is indicated only for symptomatic pseudocysts, pseudocysts larger than 6 cm that persist beyond 6 weeks, or pseudocysts with complications (infection, hemorrhage, obstruction)",
      "Sudden severe abdominal pain with hypotension in a patient with a known pseudocyst should be treated as pseudocyst hemorrhage until proven otherwise -- this is a surgical emergency caused by erosion of the pseudocyst into an adjacent artery (most commonly the splenic artery or gastroduodenal artery)",
      "EUS-guided cystogastrostomy has become the preferred drainage method for pseudocysts that abut the stomach wall -- it creates a tract between the pseudocyst and the gastric lumen, allowing internal drainage without external tubes; success rate exceeds 90 percent with lower complication rates than surgical drainage",
      "Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis) are late signs of retroperitoneal hemorrhage from severe pancreatitis -- they indicate blood tracking along tissue planes and are associated with significantly higher mortality",
      "Patients with chronic pancreatitis and pseudocysts often develop exocrine insufficiency resulting in steatorrhea -- prescribe pancreatic enzyme replacements (lipase, protease, amylase) to be taken WITH meals, not before or after; the enzymes must mix with food to function properly",
      "Alcohol cessation is the single most important modifiable factor in preventing pseudocyst recurrence in alcohol-related pancreatitis -- provide counseling, resources, and referral to addiction services at every encounter"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with a known 8 cm pancreatic pseudocyst. The patient suddenly develops severe epigastric pain, becomes diaphoretic, and the blood pressure drops to 80/50 mmHg with a heart rate of 130 beats per minute. What is the priority nursing action?",
        options: [
          "Administer oral pantoprazole and reposition the patient",
          "Activate the rapid response team and prepare for emergency intervention",
          "Apply ice to the abdomen and administer oral analgesics",
          "Obtain a urine sample and check blood glucose level"
        ],
        correct: 1,
        rationale: "The presentation of sudden severe abdominal pain with hemodynamic instability (hypotension, tachycardia, diaphoresis) in a patient with a known pseudocyst strongly suggests pseudocyst hemorrhage from arterial erosion. This is a life-threatening surgical emergency requiring immediate activation of the rapid response team, IV fluid resuscitation, type and crossmatch, and emergency surgical or interventional radiology consultation."
      },
      {
        question: "A patient is recovering from acute pancreatitis and has a 4 cm pancreatic pseudocyst identified on CT scan. The patient is asymptomatic. Which management approach should the practical nurse anticipate?",
        options: [
          "Immediate surgical drainage to prevent complications",
          "Observation with serial imaging every 4-6 weeks as most small pseudocysts resolve spontaneously",
          "Insertion of a percutaneous drainage catheter within 24 hours",
          "Initiation of total parenteral nutrition for 6 weeks"
        ],
        correct: 1,
        rationale: "Small asymptomatic pancreatic pseudocysts (less than 6 cm) typically resolve spontaneously within 6 weeks as the inflammatory process subsides. The standard approach is conservative management with observation and serial imaging to monitor for resolution, enlargement, or development of complications. Immediate drainage is reserved for symptomatic, enlarging, or complicated pseudocysts."
      },
      {
        question: "A practical nurse is monitoring a patient with a pancreatic pseudocyst who has a percutaneous drain in place. Which finding should be reported to the registered nurse immediately?",
        options: [
          "Clear straw-colored drainage of 50 mL over the past 8 hours",
          "Bloody drainage with new-onset fever and abdominal rigidity",
          "Mild tenderness at the drain insertion site without redness",
          "Patient reports mild discomfort when repositioning"
        ],
        correct: 1,
        rationale: "Bloody drainage combined with fever and abdominal rigidity suggests hemorrhage into the pseudocyst with possible infection and peritoneal irritation. This combination represents a potential life-threatening emergency requiring immediate physician notification, hemodynamic monitoring, and possible emergency intervention. Clear drainage, mild insertion site tenderness, and repositioning discomfort are expected findings that require routine monitoring."
      }
    ]
  },

  "patent-ductus-arteriosus-rpn": {
    title: "Patent Ductus Arteriosus for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Patent Ductus Arteriosus",
      content: "The ductus arteriosus is a normal fetal vascular structure that connects the pulmonary artery to the descending aorta, allowing blood to bypass the non-functioning fetal lungs. In utero, this shunt is essential because the placenta, not the lungs, performs gas exchange. The ductus arteriosus remains open during fetal life due to low oxygen tension in fetal blood and circulating prostaglandin E2 (PGE2) produced by the placenta and the ductal wall itself. PGE2 acts on smooth muscle prostaglandin receptors in the ductal wall, causing vasodilation and maintaining patency. At birth, two critical events trigger ductus closure: first, the newborn takes its first breaths, causing a dramatic rise in arterial oxygen tension (PaO2), which directly constricts ductal smooth muscle through oxygen-sensitive potassium channels; second, separation of the placenta eliminates the primary source of circulating PGE2, removing the vasodilatory stimulus. Functional closure of the ductus typically occurs within 12-24 hours of birth in term infants, with permanent anatomical closure (forming the ligamentum arteriosum) complete by 2-3 weeks. Patent ductus arteriosus (PDA) occurs when the ductus fails to close after birth, creating a persistent communication between the aorta and the pulmonary artery. Because aortic pressure exceeds pulmonary artery pressure after birth, blood flows from the aorta through the PDA into the pulmonary artery (left-to-right shunt), resulting in increased pulmonary blood flow and volume overload of the left atrium and left ventricle. The magnitude of the shunt depends on the diameter and length of the ductus and the pressure difference between the systemic and pulmonary circulations. A large PDA causes significant pulmonary overcirculation leading to pulmonary edema, increased work of breathing, congestive heart failure, and failure to thrive. The classic auscultatory finding is a continuous machinery-like murmur heard best at the left upper sternal border and left infraclavicular area, described as a murmur that extends through both systole and diastole because the aortic-to-pulmonary pressure gradient persists throughout the cardiac cycle. Premature infants are particularly vulnerable to PDA because ductal smooth muscle is less responsive to oxygen-mediated constriction and circulating PGE2 levels remain relatively high due to immature hepatic metabolism. If left untreated, chronic PDA with large left-to-right shunting can eventually cause irreversible pulmonary vascular remodeling and pulmonary hypertension, potentially reversing the shunt direction to right-to-left (Eisenmenger syndrome), which produces cyanosis and is no longer amenable to ductal closure."
    },
    riskFactors: [
      "Prematurity (most significant risk factor -- PDA occurs in approximately 30 percent of infants born before 30 weeks gestation and up to 60-70 percent of extremely premature infants born before 28 weeks)",
      "Low birth weight (inversely correlated with PDA incidence; infants weighing less than 1000 grams have the highest incidence)",
      "Respiratory distress syndrome (surfactant deficiency in premature infants contributes to persistent hypoxemia, which impairs ductal constriction)",
      "Maternal rubella infection during the first trimester (congenital rubella syndrome includes PDA as a classic cardiac manifestation)",
      "High altitude birth (chronic low oxygen environment impairs oxygen-mediated ductal closure)",
      "Female sex (PDA is approximately twice as common in females compared to males in term infants)",
      "Genetic conditions including Down syndrome (trisomy 21), DiGeorge syndrome (22q11.2 deletion), and Noonan syndrome (increased incidence of congenital heart defects)"
    ],
    diagnostics: [
      "Echocardiography (transthoracic): definitive diagnostic study for PDA; demonstrates the ductus connecting the aorta to the pulmonary artery with color Doppler showing continuous flow; measures ductal diameter, flow velocity, and direction of shunt; assesses left atrial and left ventricular size (enlargement indicates hemodynamically significant PDA)",
      "Chest X-ray: hemodynamically significant PDA shows cardiomegaly (increased cardiothoracic ratio greater than 0.6 in neonates), increased pulmonary vascular markings reflecting pulmonary overcirculation, and pulmonary edema in severe cases",
      "Continuous pulse oximetry: monitors for differential cyanosis (lower oxygen saturation in the lower extremities compared to the right upper extremity) which would suggest right-to-left ductal shunting and Eisenmenger physiology",
      "Arterial blood gas (ABG): may show metabolic acidosis from decreased systemic perfusion in large PDAs; widened alveolar-arterial oxygen gradient reflects pulmonary overcirculation and edema",
      "Complete blood count (CBC): low hemoglobin may worsen the hemodynamic impact of PDA; thrombocytopenia should be assessed before considering indomethacin (which affects platelet function)",
      "Serum electrolytes, BUN, creatinine, and urine output: baseline renal function must be assessed before administering indomethacin or ibuprofen lysine, as both can reduce renal blood flow and cause oliguria; monitor urine output closely during treatment"
    ],
    management: [
      "Conservative management for small PDAs without hemodynamic significance: observe with serial echocardiography; many small PDAs in term infants close spontaneously within the first year of life",
      "Fluid restriction (typically 120-140 mL/kg/day in neonates with hemodynamically significant PDA) to reduce pulmonary edema and volume overload; maintain strict intake and output monitoring",
      "Pharmacological closure with indomethacin or ibuprofen lysine: these cyclooxygenase (COX) inhibitors block prostaglandin synthesis, removing the vasodilatory stimulus that maintains ductal patency; most effective when given within the first 2 weeks of life in premature infants",
      "Administer diuretics (furosemide) as ordered for symptomatic heart failure with pulmonary edema; monitor for electrolyte imbalances (hypokalemia, hypochloremia, hyponatremia)",
      "Surgical ligation or transcatheter device closure for PDAs that fail pharmacological treatment, are too large for medical management, or present in patients with contraindications to indomethacin/ibuprofen; transcatheter closure via cardiac catheterization is preferred when anatomically feasible",
      "Administer prostaglandin E1 (alprostadil) to MAINTAIN ductal patency in specific situations: duct-dependent congenital heart lesions (transposition of great arteries, critical coarctation, pulmonary atresia) where the PDA provides essential blood flow until surgical repair can be performed",
      "Provide nutritional support: high-calorie formula or fortified breast milk to meet increased metabolic demands; consider gavage feeding if infant tires during oral feeds due to increased work of breathing and heart failure"
    ],
    nursingActions: [
      "Auscultate heart sounds every 4 hours: identify and report the characteristic continuous machinery murmur heard best at the left upper sternal border and left infraclavicular area; note any change in murmur intensity or character which may indicate change in shunt volume",
      "Monitor vital signs with attention to wide pulse pressure (systolic blood pressure normal or elevated with low diastolic pressure due to aortic diastolic runoff through the PDA), bounding peripheral pulses, and tachycardia; report resting heart rate greater than 160-180 beats per minute in neonates",
      "Monitor respiratory status closely: assess for tachypnea (respiratory rate greater than 60 in neonates), increased work of breathing (nasal flaring, intercostal and subcostal retractions, grunting), and oxygen desaturation; report worsening respiratory distress",
      "Maintain strict intake and output with daily weights: weigh at the same time each day using the same scale; report weight gain greater than 30 grams per day in neonates as this may indicate fluid retention from heart failure",
      "Monitor renal function during indomethacin or ibuprofen therapy: measure urine output every 4-8 hours (normal greater than 1 mL/kg/hour in neonates); report oliguria (less than 0.5 mL/kg/hour) immediately as these medications reduce renal perfusion; check serum creatinine and electrolytes as ordered",
      "Cluster nursing care activities to minimize energy expenditure and oxygen consumption: coordinate assessments, feeding, and diaper changes together; provide rest periods between interventions; maintain thermoneutral environment to reduce metabolic demand",
      "If alprostadil (PGE1) infusion is running to maintain ductal patency: monitor for apnea (occurs in 10-12 percent of neonates receiving PGE1), fever, hypotension, and flushing; keep intubation equipment at the bedside; never abruptly discontinue as sudden ductal closure can be fatal in duct-dependent lesions"
    ],
    assessmentFindings: [
      "Continuous machinery-like murmur: described as a harsh, rumbling murmur that begins in systole, peaks at S2, and continues into diastole; heard loudest at the left upper sternal border and left infraclavicular area; pathognomonic for PDA",
      "Bounding peripheral pulses with wide pulse pressure: the diastolic runoff of blood from the aorta through the PDA into the pulmonary artery lowers diastolic pressure; produces a wide pulse pressure and characteristically strong, bounding (waterhammer) pulses palpable in peripheral arteries",
      "Tachycardia and tachypnea: compensatory responses to decreased systemic cardiac output and increased pulmonary blood flow; resting heart rate greater than 160-180 bpm and respiratory rate greater than 60 breaths per minute in neonates indicate hemodynamic significance",
      "Signs of congestive heart failure: hepatomegaly (liver enlargement from right heart congestion), poor feeding with diaphoresis during feeds (increased metabolic demand), failure to thrive (weight gain below expected growth curve), periorbital or peripheral edema",
      "Increased work of breathing: nasal flaring, intercostal and subcostal retractions, grunting on expiration (indicates alveolar collapse from pulmonary edema), and head bobbing with each breath in neonates",
      "Differential cyanosis: if pulmonary hypertension develops and the shunt reverses (right-to-left through the PDA), the lower extremities become cyanotic while the upper extremities remain pink because desaturated blood enters the aorta distal to the left subclavian artery",
      "Poor weight gain and feeding difficulties: infants with hemodynamically significant PDA tire easily during feeds, sweat during feeding (diaphoresis), take small volumes, and fail to gain weight appropriately despite adequate caloric intake"
    ],
    signs: {
      left: [
        "Small PDA with soft murmur and no hemodynamic compromise",
        "Normal vital signs with appropriate weight gain",
        "Active infant with normal feeding pattern and behavior",
        "Pulse oximetry consistently above 95 percent in both pre- and post-ductal locations",
        "Normal urine output greater than 1 mL/kg/hour",
        "Stable respiratory rate without increased work of breathing"
      ],
      right: [
        "Loud continuous machinery murmur with palpable thrill indicating large shunt volume",
        "Signs of congestive heart failure: hepatomegaly, tachycardia, gallop rhythm, edema",
        "Respiratory distress with tachypnea, retractions, grunting, and oxygen desaturation requiring supplemental oxygen",
        "Poor feeding with diaphoresis, failure to thrive, and weight loss",
        "Oliguria (less than 0.5 mL/kg/hour) during indomethacin therapy indicating renal compromise",
        "Apnea episodes during alprostadil (PGE1) infusion requiring ventilatory support"
      ]
    },
    medications: [
      {
        name: "Indomethacin (Indocin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID) / cyclooxygenase inhibitor",
        action: "Non-selectively inhibits cyclooxygenase enzymes (COX-1 and COX-2), blocking the conversion of arachidonic acid to prostaglandins, including prostaglandin E2 (PGE2) which maintains ductal patency; removal of the PGE2-mediated vasodilatory stimulus allows the ductal smooth muscle to constrict in response to increased postnatal oxygen tension, promoting functional closure of the ductus arteriosus",
        sideEffects: "Oliguria and decreased renal blood flow (prostaglandins maintain renal vasodilation in neonates), hyponatremia, hyperkalemia, decreased platelet aggregation (increased bleeding risk), necrotizing enterocolitis (NEC) risk (reduced mesenteric blood flow), gastrointestinal bleeding, transient decrease in cerebral blood flow",
        contra: "Active bleeding (especially intracranial hemorrhage), necrotizing enterocolitis (proven or suspected), renal impairment (serum creatinine greater than 1.8 mg/dL or urine output less than 0.6 mL/kg/hour), thrombocytopenia (platelet count less than 50,000), untreated infection, duct-dependent congenital heart lesion where PDA is needed for survival",
        pearl: "Standard dosing protocol: 0.2 mg/kg IV for first dose, followed by 0.1-0.25 mg/kg IV every 12-24 hours for 2 additional doses (total 3 doses); must monitor urine output every 4-8 hours, serum creatinine, electrolytes, and platelet count during treatment; contraindicated if urine output drops below 0.6 mL/kg/hour; most effective when administered within the first 2 weeks of life; success rate approximately 70-80 percent in premature infants"
      },
      {
        name: "Ibuprofen Lysine (NeoProfen)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID) / cyclooxygenase inhibitor",
        action: "Inhibits cyclooxygenase enzymes (COX-1 and COX-2) to reduce prostaglandin E2 synthesis, promoting ductal constriction through the same mechanism as indomethacin; ibuprofen lysine is the water-soluble salt form specifically formulated for intravenous neonatal use; has equivalent efficacy to indomethacin for PDA closure with a potentially more favorable renal safety profile",
        sideEffects: "Renal impairment (less severe than indomethacin -- ibuprofen preserves renal blood flow better due to lesser effect on renal prostaglandin synthesis), hyperbilirubinemia (displaces bilirubin from albumin binding sites -- risk of kernicterus), bleeding tendency, adrenal insufficiency (rare), necrotizing enterocolitis",
        contra: "Proven or suspected NEC, significant renal impairment, active bleeding or coagulation defect, hyperbilirubinemia requiring exchange transfusion (ibuprofen competes with bilirubin for albumin binding), duct-dependent congenital heart disease, known hypersensitivity",
        pearl: "Dosing: initial dose 10 mg/kg IV, followed by 5 mg/kg IV at 24 and 48 hours (total 3 doses); increasingly preferred over indomethacin due to less impact on renal, mesenteric, and cerebral blood flow; however, must monitor bilirubin levels closely as ibuprofen displaces bilirubin from albumin and may increase the risk of kernicterus in jaundiced premature infants; check bilirubin before initiating treatment"
      },
      {
        name: "Alprostadil (Prostaglandin E1 / Prostin VR)",
        type: "Prostaglandin E1 analog (vasodilator)",
        action: "Directly relaxes smooth muscle in the ductus arteriosus wall by binding to prostaglandin EP receptors, maintaining ductal patency; used in duct-dependent congenital heart lesions where the PDA provides essential blood flow -- in right-sided obstructive lesions (pulmonary atresia, critical pulmonary stenosis, tricuspid atresia), the PDA provides pulmonary blood flow from the aorta; in left-sided obstructive lesions (hypoplastic left heart syndrome, critical coarctation, interrupted aortic arch), the PDA provides systemic blood flow from the pulmonary artery",
        sideEffects: "Apnea (occurs in approximately 10-12 percent of neonates, more common at higher doses and in infants less than 2 kg), fever, flushing, hypotension, bradycardia, diarrhea, seizures (rare), cortical hyperostosis with prolonged use (periosteal bone proliferation)",
        contra: "Respiratory distress syndrome without underlying duct-dependent heart disease (PDA would worsen pulmonary overcirculation); no absolute contraindications in truly duct-dependent lesions as the PDA is required for survival",
        pearl: "Continuous IV infusion starting at 0.05-0.1 mcg/kg/min, titrated to lowest effective dose once ductal patency is confirmed by echocardiography; ALWAYS have intubation equipment immediately available at the bedside due to apnea risk; the infusion must NEVER be abruptly discontinued in duct-dependent lesions as sudden ductal closure will be fatal; wean gradually under physician supervision; this medication MAINTAINS the PDA open -- it is the opposite clinical goal of indomethacin and ibuprofen"
      }
    ],
    pearls: [
      "The ductus arteriosus closes in response to TWO stimuli at birth: rising arterial oxygen levels (direct smooth muscle constriction) and falling prostaglandin E2 levels (removal of vasodilatory stimulus) -- understanding this mechanism explains why indomethacin and ibuprofen (which block prostaglandin synthesis) close the PDA, and why alprostadil (which provides prostaglandin E1) keeps it open",
      "The continuous machinery murmur of PDA is heard throughout BOTH systole AND diastole because the pressure gradient from the aorta to the pulmonary artery persists throughout the entire cardiac cycle -- this distinguishes it from an innocent flow murmur or VSD murmur which are systolic only",
      "Indomethacin and ibuprofen lysine are used to CLOSE the PDA, while alprostadil (PGE1) is used to KEEP the PDA OPEN -- these are opposite therapeutic goals and the practical nurse must clearly understand which clinical situation requires which medication to prevent a potentially fatal medication error",
      "Monitor urine output meticulously during indomethacin or ibuprofen therapy: report output less than 0.6 mL/kg/hour immediately -- prostaglandins maintain renal vasodilation in neonates, and blocking prostaglandin synthesis can cause significant renal impairment requiring drug discontinuation",
      "Wide pulse pressure and bounding pulses in a premature neonate suggest hemodynamically significant PDA -- blood runs off from the aorta through the PDA into the pulmonary artery during diastole, lowering diastolic pressure and creating characteristically bounding peripheral pulses",
      "Apnea is a critical side effect of alprostadil (PGE1) infusion occurring in approximately 10-12 percent of neonates -- always have intubation equipment and a resuscitation bag immediately available at the bedside; the infant may require elective intubation before transport to a cardiac surgery center",
      "Differential cyanosis (cyanotic lower body with pink upper body) in a neonate with known PDA indicates Eisenmenger physiology with reversal of the shunt to right-to-left -- this is a late and ominous finding indicating irreversible pulmonary hypertension; ductal closure is contraindicated at this stage"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a premature neonate receiving indomethacin for PDA closure. The urine output over the past 4 hours has been 0.3 mL/kg/hour. What is the priority nursing action?",
        options: [
          "Continue the indomethacin and increase IV fluid rate",
          "Hold the next indomethacin dose and report the decreased urine output to the physician immediately",
          "Administer furosemide to increase urine output before the next indomethacin dose",
          "Reposition the urinary catheter and continue monitoring"
        ],
        correct: 1,
        rationale: "Oliguria (urine output less than 0.6 mL/kg/hour) during indomethacin therapy indicates renal impairment from prostaglandin synthesis inhibition reducing renal blood flow. The indomethacin dose should be held and the physician notified immediately for further orders. Continuing the medication or administering furosemide without physician direction is inappropriate. Renal impairment is a known contraindication to continued indomethacin therapy."
      },
      {
        question: "A practical nurse is caring for a neonate with a duct-dependent congenital heart lesion receiving alprostadil (PGE1) infusion. Which equipment must be immediately available at the bedside?",
        options: [
          "Blood glucose monitor and dextrose solution",
          "Intubation equipment and resuscitation bag",
          "Phototherapy lights and bilirubin measurement tools",
          "Feeding pump and nasogastric tube supplies"
        ],
        correct: 1,
        rationale: "Apnea is a significant side effect of alprostadil (PGE1), occurring in approximately 10-12 percent of neonates receiving the infusion. Intubation equipment and a resuscitation bag must be immediately available at the bedside because apneic episodes may require emergency airway management. This is a critical safety measure for any neonate receiving PGE1 therapy."
      },
      {
        question: "A practical nurse auscultates a continuous murmur that sounds like machinery running throughout both systole and diastole at the left upper sternal border of a 3-day-old premature infant. This finding is most consistent with which condition?",
        options: [
          "Innocent flow murmur of the newborn",
          "Ventricular septal defect",
          "Patent ductus arteriosus",
          "Atrial septal defect"
        ],
        correct: 2,
        rationale: "A continuous machinery-like murmur heard throughout both systole and diastole at the left upper sternal border is the classic auscultatory finding of patent ductus arteriosus. The murmur is continuous because the pressure gradient between the aorta and pulmonary artery persists throughout the entire cardiac cycle. Innocent murmurs and VSD murmurs are systolic only. ASD typically produces a fixed split S2 rather than a continuous murmur."
      }
    ]
  },

  "patient-rights-rpn": {
    title: "Patient Rights and Advocacy for Practical Nurses",
    cellular: {
      title: "Ethical and Legal Foundations of Patient Rights",
      content: "Patient rights represent a fundamental framework of ethical and legal protections that ensure individuals receiving healthcare are treated with dignity, respect, and autonomy. These rights are grounded in four core bioethical principles established in the Belmont Report and widely adopted in healthcare ethics: autonomy (the right of competent individuals to make decisions about their own healthcare), beneficence (the obligation of healthcare providers to act in the patient's best interest), non-maleficence (the obligation to do no harm), and justice (the fair and equitable distribution of healthcare resources and treatment). Informed consent is the cornerstone of patient autonomy and requires three essential elements: the patient must receive adequate information about the proposed treatment (including the diagnosis, nature of the procedure, expected benefits, material risks, and available alternatives including the option of no treatment), the patient must have the capacity to understand and process this information (decision-making capacity requires the ability to understand the information, appreciate how it applies to their situation, reason about the options, and communicate a choice), and the consent must be given voluntarily without coercion, undue influence, or manipulation. The practical nurse does not obtain informed consent for medical procedures (this is the physician or nurse practitioner's responsibility) but serves as a witness to the consent process and must report any concerns that the patient does not appear to understand the information or feels pressured. Confidentiality is protected by legislation including the Personal Health Information Protection Act (PHIPA) in Ontario, the Personal Information Protection and Electronic Documents Act (PIPEDA) in Canada, and the Health Insurance Portability and Accountability Act (HIPAA) in the United States. Health information may only be disclosed with the patient's explicit written consent, as required by law (mandatory reporting of communicable diseases, suspected child abuse, fitness to drive), or within the circle of care for treatment purposes. The right to refuse treatment extends to competent adults even when refusal may result in death; however, healthcare providers must ensure the patient understands the consequences of refusal and document the informed refusal thoroughly. Advance directives are legal documents that allow individuals to express their healthcare wishes in advance should they become incapable of making decisions. These include living wills (written instructions about desired treatments), power of attorney for personal care (designating a substitute decision-maker), and do-not-resuscitate (DNR) or allow-natural-death (AND) orders. The practical nurse has a professional obligation to advocate for patient rights, which includes speaking up when patient rights may be violated, ensuring cultural and linguistic barriers are addressed, maintaining patient privacy and dignity, and supporting the patient's right to make informed decisions even when those decisions differ from the healthcare team's recommendations."
    },
    riskFactors: [
      "Cognitive impairment or altered level of consciousness (dementia, delirium, sedation, traumatic brain injury) that may compromise decision-making capacity",
      "Language barriers without adequate interpreter services (patients who cannot communicate effectively in the language of care are at risk of uninformed consent and missed safety concerns)",
      "Cultural or religious beliefs that conflict with standard medical recommendations (may lead to refusal of blood products, organ donation, or certain treatments)",
      "Age extremes: pediatric patients (parent or guardian makes decisions; assent from the child is sought when developmentally appropriate) and elderly patients (higher risk of paternalistic decision-making by family or providers)",
      "Mental health conditions (involuntary commitment, capacity assessments, and substitute decision-making create complex rights situations)",
      "Incarcerated or detained individuals (may face barriers to exercising healthcare rights due to institutional constraints)",
      "Social isolation or lack of family support (patients without advocates are more vulnerable to rights violations and may have difficulty navigating complex healthcare decisions)"
    ],
    diagnostics: [
      "Capacity assessment: formal evaluation of a patient's ability to make healthcare decisions; assesses four components -- understanding (can explain the condition and proposed treatment), appreciation (recognizes how the information applies to their personal situation), reasoning (can weigh risks and benefits and explain rationale for decision), and communication (can express a consistent choice); performed by the physician or designated healthcare provider",
      "Documentation review: verify that informed consent forms are signed, dated, and witnessed before any procedure; confirm that the consent matches the specific procedure being performed; ensure the consenting provider's name is documented",
      "Advance directive review: check patient chart for existing advance directives (living will, power of attorney for personal care, DNR/AND orders); verify that the designated substitute decision-maker's contact information is current and accessible",
      "Cultural and spiritual assessment: identify cultural practices, religious beliefs, dietary requirements, and language preferences that may affect care decisions; document preferred language and interpreter needs",
      "Pain and symptom assessment: ensure adequate symptom management is provided as part of the patient's right to comfort and dignity; document patient's pain rating and response to interventions",
      "Privacy audit: assess that patient information is not visible on hallway whiteboards, computer screens are not visible to unauthorized persons, conversations about patient care occur in private settings, and door curtains are drawn during care"
    ],
    management: [
      "Ensure informed consent is obtained before any invasive procedure: verify the consent form is signed, the patient can verbalize understanding of the procedure, risks, benefits, and alternatives; report any concerns about patient comprehension to the supervising nurse or physician before proceeding",
      "Maintain confidentiality at all times: discuss patient information only with members of the healthcare team who need to know for care purposes; do not discuss patients in public areas (elevators, cafeterias, hallways); log off computer terminals when stepping away; keep paper charts in secure locations",
      "Provide interpreter services for patients who do not speak the language of care: use professional medical interpreters (in-person or telephone/video interpretation services) rather than family members, children, or untrained staff for medical discussions; document interpreter use",
      "Support the patient's right to refuse treatment: document the refusal, ensure the patient understands the potential consequences of refusal, notify the physician, and continue to provide all other aspects of care with respect and without judgment",
      "Advocate for patients who cannot advocate for themselves: contact the designated substitute decision-maker when the patient lacks capacity; ensure substitute decisions align with the patient's previously expressed wishes or best interests; report concerns about substitute decision-making to the healthcare team",
      "Facilitate access to patient advocates, ethics committees, or patient relations departments when ethical dilemmas arise or when the patient expresses dissatisfaction with care",
      "Ensure cultural and spiritual needs are accommodated: arrange for chaplaincy visits, accommodate dietary restrictions, respect modesty requirements, and facilitate culturally specific practices during hospitalization and at end of life"
    ],
    nursingActions: [
      "Verify patient identity using two identifiers (name and date of birth or medical record number) before every medication administration, specimen collection, procedure, or treatment to protect the patient's right to safe care",
      "Witness informed consent by confirming the patient can verbalize what the procedure involves, the expected benefits, the material risks, and the available alternatives; if the patient cannot demonstrate understanding, do NOT proceed -- notify the physician that re-education is needed",
      "Protect patient privacy during all care activities: close doors and draw curtains before physical examinations, personal care, and conversations about sensitive health information; knock and announce before entering patient rooms",
      "Document patient refusal of treatment thoroughly: record what was refused, the patient's stated reason, confirmation that the patient was informed of potential consequences, notification of the physician, and the patient's ongoing agreement to or refusal of alternative treatments",
      "Report suspected violations of patient rights through appropriate channels: this includes suspected abuse or neglect, breaches of confidentiality, failure to obtain informed consent, or coercion of patients into treatment decisions",
      "Ensure patients and families have access to information about their diagnosis, treatment plan, and prognosis in language they can understand; provide written educational materials at an appropriate literacy level; verify understanding using the teach-back method",
      "Support patients in completing advance directives: provide information about advance directive options (living will, power of attorney for personal care), offer appropriate forms, and document the presence and location of advance directives in the medical record; do NOT provide legal advice or influence the patient's decisions"
    ],
    assessmentFindings: [
      "Patient demonstrates understanding of informed consent: can accurately describe the proposed procedure, state expected benefits and potential risks, identify alternatives, and express a voluntary choice without evidence of coercion",
      "Patient demonstrates intact decision-making capacity: alert and oriented, responds appropriately to questions about their condition, can weigh options rationally, and communicates a consistent choice over time",
      "Patient expresses refusal of treatment: clearly states they do not want a specific treatment or procedure; the nurse assesses whether the refusal is informed (patient understands consequences) and documents accordingly",
      "Patient exhibits signs of impaired capacity: confusion, disorientation, inability to process information, inconsistent decision-making, responding to internal stimuli (hallucinations), or extreme emotional distress that impairs rational thinking",
      "Privacy concerns identified: patient information visible on hallway whiteboards, staff discussing patient details in public areas, unauthorized individuals present during care, computer screens with patient data visible to visitors",
      "Cultural or spiritual needs affecting care: patient requests specific dietary accommodations, same-gender caregivers, prayer time, religious items at bedside, or specific postmortem handling practices",
      "Patient or family expresses dissatisfaction or concern: complaints about care quality, communication failures, perceived disrespect, or feeling that their wishes are being disregarded"
    ],
    signs: {
      left: [
        "Patient is alert, oriented, and participates actively in care decisions",
        "Informed consent obtained with patient verbalizing understanding",
        "Advance directives are documented and accessible in the medical record",
        "Cultural and spiritual needs are identified and accommodated",
        "Patient privacy is maintained during all care activities",
        "Patient and family express satisfaction with communication and care"
      ],
      right: [
        "Patient appears confused or unable to understand consent information (requires capacity assessment before proceeding)",
        "Evidence of coercion: patient states they feel pressured into a treatment decision by family members or healthcare providers",
        "Breach of confidentiality: patient information disclosed to unauthorized individuals or visible in public areas",
        "Suspected abuse or neglect: unexplained injuries, fear of caregivers, signs of financial exploitation, self-neglect",
        "Patient's expressed wishes being overridden by family or healthcare team without appropriate capacity assessment or legal authority",
        "Patient refusing life-sustaining treatment without documented informed refusal process"
      ]
    },
    medications: [
      {
        name: "Documentation Tools: Informed Consent Form",
        type: "Legal document / patient rights protection tool",
        action: "The informed consent form serves as legal documentation that the patient was provided with adequate information about a proposed procedure or treatment and voluntarily agreed to proceed; the form itself does not constitute consent -- consent is the process of communication between the provider and patient; the form merely provides evidence that the process occurred; must include the name of the procedure, the name of the performing provider, a description of risks and benefits discussed, alternatives offered, and the patient's signature with date and time",
        sideEffects: "Incomplete consent forms create legal liability; consent obtained under coercion is invalid; consent obtained from a patient without decision-making capacity is invalid and may constitute battery; failure to document consent can result in disciplinary action and civil liability",
        contra: "Cannot be signed by a patient who lacks decision-making capacity (an alternative decision-maker must be identified); cannot be signed by a minor (parent or legal guardian signs except in jurisdictions with mature minor doctrine); cannot replace an adequate verbal consent discussion between the provider and patient",
        pearl: "The practical nurse witnesses the consent by confirming the patient appears to understand the information provided and is signing voluntarily; if the patient asks the nurse questions about the procedure itself, the nurse must redirect to the physician rather than providing procedural explanations; always verify the consent form matches the exact procedure being performed -- wrong-site or wrong-procedure errors can result from consent form discrepancies"
      },
      {
        name: "Documentation Tools: Advance Directive Form",
        type: "Legal document / anticipatory decision-making tool",
        action: "An advance directive is a legal document that allows a competent adult to express their healthcare wishes in advance should they lose decision-making capacity in the future; includes living wills (written instructions specifying desired treatments such as resuscitation preferences, mechanical ventilation, artificial nutrition and hydration, dialysis) and power of attorney for personal care (designating a substitute decision-maker or healthcare proxy who will make decisions on the patient's behalf); once the patient loses capacity, the advance directive guides healthcare decisions in alignment with the patient's previously expressed values and preferences",
        sideEffects: "Advance directives that are vague or overly general may be difficult to interpret in specific clinical situations; family conflict may arise when the advance directive contradicts the family's wishes; advance directives may not be immediately accessible in emergency situations; patients may change their minds about preferences over time but fail to update documents",
        contra: "An advance directive cannot authorize healthcare providers to perform illegal acts (euthanasia in jurisdictions where it is not legal); cannot override public health requirements (mandatory isolation for communicable diseases); must be executed while the patient has decision-making capacity; advance directives from one jurisdiction may not be recognized in another without verification",
        pearl: "The practical nurse should ask every patient on admission whether they have an advance directive and document its presence and location in the medical record; if the patient does not have an advance directive, offer information about how to create one but do NOT provide legal advice or influence the patient's decisions; ensure the substitute decision-maker's current contact information is on file and accessible; advance directives should be reviewed and updated periodically, especially after major health events or changes in prognosis"
      },
      {
        name: "Documentation Tools: Consent for Refusal of Treatment Form",
        type: "Legal document / informed refusal documentation tool",
        action: "Documents the process of informed refusal when a competent patient declines recommended medical treatment; records that the patient was informed of their diagnosis, the recommended treatment, the expected benefits of treatment, the risks and potential consequences of refusing treatment (including the possibility of death), and any alternatives offered; ensures the healthcare team has fulfilled their duty to inform while respecting the patient's autonomous decision; signed by the patient, the physician who discussed the refusal, and a witness",
        sideEffects: "Inadequate documentation of informed refusal creates significant legal liability for the healthcare team; failure to document the discussion of consequences may lead to claims that the patient was not properly informed; refusal documentation that is coerced or obtained from a patient lacking capacity is invalid",
        contra: "Cannot be used to override mandatory treatment orders (court-ordered psychiatric treatment, quarantine orders for communicable diseases); cannot be used for pediatric patients without parent or guardian involvement (except in specific jurisdictions with mature minor provisions); should not replace ongoing therapeutic communication -- a documented refusal is not necessarily permanent and patients may change their decision",
        pearl: "When a patient refuses treatment, the practical nurse continues to provide all other aspects of care with respect and professionalism; never express disapproval or attempt to coerce the patient; document the refusal objectively without judgment; notify the physician and registered nurse; continue to offer the refused treatment at appropriate intervals as the patient's condition or understanding may change; if the refused treatment is life-sustaining, an ethics consultation may be warranted"
      }
    ],
    pearls: [
      "Informed consent is a PROCESS, not just a form -- the signed form provides evidence that the consent discussion occurred, but the actual consent is the verbal communication between the provider and patient; the practical nurse does not obtain consent for procedures but serves as a witness to verify the patient appears to understand and is signing voluntarily",
      "A competent adult has the RIGHT to refuse any treatment, even life-sustaining treatment, provided they understand the consequences -- the healthcare team must document informed refusal thoroughly and continue to provide all other aspects of care; refusing treatment does not mean the patient loses the right to other healthcare services",
      "The practical nurse has a DUTY to report suspected violations of patient rights including abuse, neglect, breaches of confidentiality, failure to obtain consent, and coercion -- failure to report makes the nurse complicit and may result in professional discipline",
      "NEVER use family members (especially children) as interpreters for medical discussions -- use professional medical interpreters who understand medical terminology and maintain neutrality; family interpreters may filter, omit, or modify information due to cultural norms or personal bias",
      "Decision-making capacity is assessed by the PHYSICIAN and is decision-specific (a patient may have capacity to refuse a blood draw but lack capacity to make decisions about complex surgical options) -- the practical nurse assesses and reports clinical findings that suggest altered capacity but does not make the formal capacity determination",
      "Advance directives should be verified on EVERY admission and after ANY significant change in health status -- preferences may change over time, and an outdated advance directive may not reflect the patient's current wishes; always confirm the substitute decision-maker's contact information is current",
      "The patient's right to privacy extends to ALL information about their care, including the fact that they are hospitalized -- do not confirm or deny a patient's presence to phone callers or visitors unless the patient has given explicit permission; follow facility policy for handling information requests"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing a patient for a procedure when the patient states, 'I signed the consent form but I still do not understand what the doctor is going to do.' What is the most appropriate nursing action?",
        options: [
          "Explain the procedure to the patient using simple language and proceed",
          "Reassure the patient that the doctor will explain everything during the procedure",
          "Hold the procedure and notify the physician that the patient requires further explanation before valid consent exists",
          "Ask a family member to explain the procedure to the patient"
        ],
        correct: 2,
        rationale: "Informed consent requires that the patient understands the proposed procedure, its risks, benefits, and alternatives. If the patient states they do not understand, the consent is not truly informed and the procedure should be held until the physician provides further explanation. The practical nurse does not obtain consent for procedures (this is the physician's responsibility). Family members are not appropriate substitutes for physician-patient consent discussions."
      },
      {
        question: "A competent adult patient with advanced cancer refuses a recommended blood transfusion, stating it conflicts with their religious beliefs. The patient understands that without the transfusion, they may die. What is the appropriate nursing action?",
        options: [
          "Override the patient's refusal because the transfusion is medically necessary to save their life",
          "Contact the patient's family to convince the patient to accept the transfusion",
          "Respect the patient's decision, document the informed refusal including the patient's understanding of consequences, and notify the physician",
          "Administer the transfusion while the patient is sedated to avoid conflict"
        ],
        correct: 2,
        rationale: "A competent adult has the legal and ethical right to refuse any treatment, including life-sustaining treatment, based on religious beliefs or personal values. The healthcare team must respect this autonomous decision, ensure the refusal is informed (patient understands consequences), document the refusal thoroughly, and continue providing all other aspects of care. Overriding the refusal or administering treatment without consent constitutes battery."
      },
      {
        question: "A practical nurse overhears two staff members discussing a patient's HIV diagnosis in the hospital cafeteria, where other patients and visitors are present. What should the practical nurse do?",
        options: [
          "Ignore the conversation because the nurse is not involved in that patient's care",
          "Join the conversation to offer clinical insight about the case",
          "Intervene immediately by reminding the staff members that patient information must not be discussed in public areas, and report the incident through appropriate channels",
          "Wait until the next shift to mention it casually to the charge nurse"
        ],
        correct: 2,
        rationale: "Discussing identifiable patient information in a public area constitutes a breach of patient confidentiality and violates privacy legislation (PHIPA/HIPAA). The practical nurse has a professional duty to intervene immediately to stop the breach and report the incident through the facility's privacy reporting mechanism. Ignoring the breach or delaying action allows continued violation of the patient's rights."
      }
    ]
  }
};

let total = 0;
let injected = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  total++;
  if (inject(id, lesson)) injected++;
}
console.log(`\nDone: ${injected}/${total} lessons injected.`);
