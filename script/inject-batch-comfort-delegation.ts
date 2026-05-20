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
  "comfort-measures-rpn": {
    title: "Comfort Measures and Non-Pharmacological Pain Management for Practical Nurses",
    cellular: {
      title: "Physiology of Pain Perception and Comfort",
      content: "Pain is a complex sensory and emotional experience initiated when tissue damage or potential damage activates specialized nerve endings called nociceptors. These nociceptors are found in skin, muscles, joints, visceral organs, and periosteum and are classified into two main types: A-delta fibers (myelinated, fast-conducting fibers that transmit sharp, well-localized pain) and C fibers (unmyelinated, slow-conducting fibers that transmit dull, aching, diffuse pain). When tissue is injured, damaged cells release inflammatory mediators including prostaglandins, bradykinin, histamine, and substance P. These chemicals lower the pain threshold at the nociceptor site (peripheral sensitization), making the area more sensitive to stimuli. The pain signal travels along the afferent nerve fibers to the dorsal horn of the spinal cord, where it synapses with second-order neurons. At this spinal level, the Gate Control Theory explains how non-painful input (such as gentle touch, pressure, or vibration) can close the neural gate and inhibit pain signal transmission to the brain by activating large-diameter A-beta fibers. This is the physiological basis for many non-pharmacological comfort measures including massage, repositioning, therapeutic touch, and transcutaneous electrical nerve stimulation (TENS). From the spinal cord, pain signals ascend via the spinothalamic tract to the thalamus and then to the somatosensory cortex for conscious pain perception, the limbic system for emotional response, and the frontal cortex for cognitive interpretation. The descending modulation system originates in the brainstem (periaqueductal gray matter and rostral ventromedial medulla) and releases endogenous opioids -- endorphins, enkephalins, and dynorphins -- which bind to opioid receptors in the spinal cord and brain to inhibit pain transmission. Relaxation techniques, guided imagery, music therapy, and deep breathing exercises enhance descending inhibition by reducing sympathetic nervous system activation and promoting endorphin release. Chronic pain involves central sensitization, where repeated nociceptive input causes neuroplastic changes in the dorsal horn neurons. These neurons become hyperexcitable, responding to normally non-painful stimuli (allodynia) and amplifying painful stimuli (hyperalgesia). Understanding these mechanisms allows the practical nurse to select appropriate comfort interventions that target different levels of pain processing: peripheral (heat/cold therapy to alter inflammatory mediators), spinal (massage, TENS to activate gate control), and supraspinal (relaxation, distraction to enhance descending inhibition). Multimodal pain management combines pharmacological and non-pharmacological approaches to target multiple pain pathways simultaneously, improving pain relief while reducing medication requirements and side effects."
    },
    riskFactors: [
      "Surgical procedures and postoperative recovery (incisional pain, immobility-related discomfort)",
      "Chronic conditions including arthritis, fibromyalgia, and chronic low back pain",
      "Cancer-related pain from tumor invasion, nerve compression, or treatment side effects",
      "Cognitive impairment or communication barriers (dementia, aphasia, intubation) limiting pain self-report",
      "History of substance use disorder (altered pain perception, opioid tolerance, hyperalgesia)",
      "Older adult population (polypharmacy risks, altered drug metabolism, higher sensitivity to opioid side effects)",
      "Cultural and psychosocial factors affecting pain expression and willingness to report discomfort"
    ],
    diagnostics: [
      "Numeric Rating Scale (NRS 0-10): gold standard for self-report pain assessment in verbal, cognitively intact adults; ask patient to rate pain intensity from 0 (no pain) to 10 (worst imaginable pain)",
      "Wong-Baker FACES Pain Scale: validated for children aged 3 years and older and adults with communication barriers; patient selects facial expression matching their pain level",
      "FLACC Scale (Face, Legs, Activity, Cry, Consolability): behavioral pain assessment tool for infants and non-verbal children aged 2 months to 7 years; scored 0-10",
      "PAINAD Scale (Pain Assessment in Advanced Dementia): observational tool assessing breathing, vocalization, facial expression, body language, and consolability in patients with advanced cognitive impairment",
      "Abbey Pain Scale: designed for end-of-life patients unable to self-report; assesses vocalization, facial expression, body language, behavioral change, physiological change, and physical change",
      "Vital signs trending: tachycardia, hypertension, tachypnea, and diaphoresis may indicate acute pain; however, vital signs are NOT reliable indicators of chronic pain and should never replace self-report"
    ],
    management: [
      "Implement multimodal pain management combining pharmacological and non-pharmacological strategies to target different pain pathways",
      "Apply heat therapy (warm packs, warm blankets, warm baths) for muscle spasm, chronic joint stiffness, and back pain; avoid in acute inflammation (first 24-48 hours), active bleeding, or areas with impaired sensation",
      "Apply cold therapy (ice packs wrapped in cloth, cold compresses) for acute injuries, sprains, surgical site swelling; apply for 15-20 minutes with a protective barrier; avoid in peripheral vascular disease or Raynaud phenomenon",
      "Perform therapeutic repositioning every 2 hours using supportive pillows, wedges, and rolled towels; proper body alignment reduces pressure on pain-generating structures",
      "Facilitate relaxation techniques: progressive muscle relaxation (systematic tensing and releasing of muscle groups), deep breathing exercises (diaphragmatic breathing with 4-second inhale, 7-second hold, 8-second exhale), and jaw relaxation",
      "Implement distraction techniques: music therapy, guided imagery (directing patient to visualize peaceful scenes engaging all senses), conversation, television, or reading to shift attention away from pain signals",
      "Coordinate with interdisciplinary team for physical therapy, occupational therapy, and complementary therapies when available"
    ],
    nursingActions: [
      "Assess pain using the appropriate validated tool at regular intervals: on admission, with each vital sign check, before and 30-60 minutes after intervention, and whenever the patient reports a change",
      "Document pain assessment comprehensively using OPQRSTUV format: Onset, Provocation/Palliation, Quality, Region/Radiation, Severity, Timing, Understanding, Values (patient's pain goal)",
      "Administer prescribed analgesics on time and as ordered; around-the-clock dosing is more effective than PRN for persistent pain",
      "Monitor for medication side effects including respiratory depression (rate below 12), sedation, constipation, nausea, and pruritus with opioid administration",
      "Apply non-pharmacological comfort measures before, during, and between medication doses to enhance overall pain relief",
      "Report pain that is unrelieved after two consecutive interventions or pain rated above the patient's stated comfort goal to the registered nurse or physician",
      "Educate patient and family about available comfort measures, the importance of reporting pain early, and the pain management plan including realistic expectations"
    ],
    assessmentFindings: [
      "Self-report of pain: location, quality (sharp, dull, burning, aching, throbbing), severity on validated scale, timing (constant vs intermittent), aggravating and relieving factors",
      "Facial grimacing, furrowed brow, clenched jaw, tightly closed or widely opened eyes -- behavioral cues of pain especially in non-verbal patients",
      "Guarding behavior: patient splinting or holding the affected area, reluctance to move, altered gait or posture",
      "Physiological indicators in acute pain: tachycardia, hypertension, tachypnea, diaphoresis, dilated pupils (note: these normalize with chronic pain due to autonomic adaptation)",
      "Functional impairment: decreased mobility, inability to perform activities of daily living, disrupted sleep pattern, decreased appetite",
      "Emotional and behavioral changes: irritability, restlessness, anxiety, withdrawal, crying, or flat affect in patients experiencing chronic or overwhelming pain",
      "Moaning, groaning, or crying out -- vocalizations that may indicate pain in patients unable to use standard self-report tools"
    ],
    signs: {
      left: [
        "Mild pain reported (NRS 1-3 of 10)",
        "Occasional grimacing with movement",
        "Slight guarding or splinting of affected area",
        "Mild restlessness or difficulty finding comfortable position",
        "Request for repositioning or comfort measures",
        "Mild tachycardia or blood pressure elevation"
      ],
      right: [
        "Severe unrelieved pain (NRS 8-10 of 10) despite interventions",
        "Sudden change in pain character or location (may indicate new complication)",
        "Respiratory depression (rate below 12) following opioid administration",
        "Decreased level of consciousness with pinpoint pupils (opioid toxicity)",
        "Chest pain with diaphoresis, dyspnea, and radiation (possible cardiac event)",
        "New onset severe headache described as worst of life (possible intracranial emergency)"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-opioid analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamus to lower fever and diminish pain perception. Unlike NSAIDs, acetaminophen has minimal peripheral anti-inflammatory activity and does not affect platelet function or gastric mucosa.",
        sideEffects: "Hepatotoxicity (dose-dependent, most common cause of acute liver failure in North America), nausea, allergic reactions (rare), skin rash (rare Stevens-Johnson syndrome)",
        contra: "Severe hepatic impairment or active liver disease; chronic alcohol use (3 or more drinks daily increases hepatotoxicity risk); known hypersensitivity",
        pearl: "Maximum 4 grams per day in healthy adults, reduced to 2 grams per day in patients with liver disease or chronic alcohol use; found in over 600 combination products -- always check ALL medication sources to prevent accidental overdose; N-acetylcysteine (NAC) is the specific antidote for acetaminophen toxicity"
      },
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (full mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the brain, spinal cord, and peripheral tissues, mimicking endogenous endorphins. Inhibits ascending pain pathways, alters pain perception at the cortical level, and activates descending inhibitory pathways from the brainstem. Produces analgesia, sedation, euphoria, and respiratory depression through central mechanisms.",
        sideEffects: "Respiratory depression (most dangerous side effect), constipation (most common, tolerance does NOT develop), sedation, nausea and vomiting, pruritus, urinary retention, hypotension, miosis (pinpoint pupils)",
        contra: "Respiratory depression or severe bronchial asthma without monitoring; paralytic ileus or known GI obstruction; concurrent use of MAO inhibitors within 14 days; head injury with increased intracranial pressure (masks neurological changes)",
        pearl: "Always assess respiratory rate, depth, and sedation level before each dose -- hold and notify prescriber if respiratory rate is below 12 or sedation score is elevated; naloxone (Narcan) is the specific antagonist and must be readily available; morphine releases histamine and can cause flushing, itching, and hypotension; start with lowest effective dose and titrate to effect"
      },
      {
        name: "Diazepam (Valium)",
        type: "Benzodiazepine (anxiolytic, skeletal muscle relaxant, anticonvulsant)",
        action: "Enhances the effect of the inhibitory neurotransmitter gamma-aminobutyric acid (GABA) at the GABA-A receptor by increasing the frequency of chloride channel opening. This produces CNS depression resulting in anxiolysis, muscle relaxation, sedation, and anticonvulsant effects. Muscle relaxation occurs through both central (brainstem reticular formation) and spinal (interneuron inhibition) mechanisms.",
        sideEffects: "Excessive sedation, drowsiness, ataxia, respiratory depression (especially when combined with opioids or alcohol), paradoxical agitation in older adults, anterograde amnesia, physical dependence with prolonged use",
        contra: "Severe respiratory insufficiency; acute narrow-angle glaucoma; sleep apnea syndrome; concurrent use with opioids requires extreme caution and dose reduction; myasthenia gravis",
        pearl: "When combined with opioids, the risk of respiratory depression and death increases significantly -- monitor respiratory rate and sedation level closely; flumazenil (Anexate/Romazicon) is the specific benzodiazepine antagonist; avoid abrupt discontinuation after prolonged use due to withdrawal seizure risk; onset is rapid IV (1-3 minutes) but IM absorption is erratic -- IV route preferred for acute needs"
      }
    ],
    pearls: [
      "Pain is whatever the patient says it is -- self-report is the single most reliable indicator of pain and should always be believed and acted upon, regardless of behavioral cues or vital sign findings",
      "The Gate Control Theory explains why non-pharmacological interventions work: gentle touch, massage, and TENS activate large A-beta nerve fibers that close the spinal gate to pain signals carried by smaller C fibers",
      "Heat therapy is used for chronic muscle pain and stiffness (vasodilation improves blood flow and reduces spasm); cold therapy is used for acute injuries and inflammation (vasoconstriction reduces swelling and slows nerve conduction)",
      "Around-the-clock (ATC) analgesic dosing is significantly more effective than PRN dosing for persistent pain because it prevents pain from escalating above the therapeutic threshold",
      "Always reassess pain 30 minutes after IV medication and 60 minutes after oral medication to evaluate effectiveness -- document both the intervention and the reassessment result",
      "Constipation is the most common opioid side effect, and tolerance to this effect does NOT develop -- a bowel regimen (stool softener plus stimulant laxative) should be initiated with the first opioid dose",
      "Respiratory depression is the most dangerous opioid side effect -- assess respiratory rate, depth, and sedation level (using a sedation scale such as Pasero) before every dose; sedation precedes respiratory depression and serves as an early warning sign"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient 6 hours after knee replacement surgery. The patient rates pain at 7 out of 10 despite receiving scheduled acetaminophen. The next dose of morphine is not due for 2 hours. Which non-pharmacological intervention should the practical nurse implement first?",
        options: [
          "Apply heat therapy directly to the surgical site",
          "Reposition the patient and apply a cold pack to the surgical knee with a protective barrier",
          "Instruct the patient that pain is expected and to wait for the next morphine dose",
          "Administer the morphine dose 2 hours early"
        ],
        correct: 1,
        rationale: "Repositioning and cold therapy to the surgical site are appropriate non-pharmacological interventions for acute postoperative pain. Cold therapy reduces swelling and slows nerve conduction. Heat therapy is contraindicated on acute surgical sites in the first 24-48 hours. The nurse should never advise the patient to simply endure pain or administer medications outside of ordered times without authorization."
      },
      {
        question: "A practical nurse prepares to administer a scheduled dose of morphine 5 mg IV to a postoperative patient. Which assessment finding requires the nurse to withhold the dose and notify the registered nurse?",
        options: [
          "Pain rated 4 out of 10",
          "Respiratory rate of 10 breaths per minute with moderate sedation",
          "Blood pressure of 128/78 mmHg",
          "Heart rate of 88 beats per minute"
        ],
        correct: 1,
        rationale: "A respiratory rate below 12 with moderate sedation indicates risk for opioid-induced respiratory depression. Morphine should be withheld and the registered nurse or physician notified immediately. Naloxone (Narcan) should be available. The other findings are within normal limits and do not warrant holding the medication."
      },
      {
        question: "A patient with advanced dementia is moaning, grimacing, and resisting care during repositioning. The practical nurse cannot obtain a verbal pain report. Which pain assessment tool is most appropriate for this patient?",
        options: [
          "Numeric Rating Scale (NRS)",
          "Wong-Baker FACES Scale",
          "PAINAD Scale (Pain Assessment in Advanced Dementia)",
          "Visual Analog Scale (VAS)"
        ],
        correct: 2,
        rationale: "The PAINAD Scale is specifically designed to assess pain in patients with advanced dementia who cannot self-report. It uses behavioral observations (breathing, vocalization, facial expression, body language, consolability) scored 0-10. The NRS and VAS require self-report. The Wong-Baker FACES Scale requires the patient to select a face, which may not be possible in advanced dementia."
      }
    ]
  },

  "death-dying-stages-rpn": {
    title: "Death, Dying, and End-of-Life Care for Practical Nurses",
    cellular: {
      title: "Physiology of the Dying Process",
      content: "The dying process involves progressive, predictable physiological changes across all organ systems as the body transitions from active cellular metabolism toward cessation of function. Understanding these changes at the cellular level allows the practical nurse to anticipate symptoms, provide appropriate comfort care, and educate families about what to expect. The cardiovascular system deteriorates as the myocardium weakens and peripheral vascular resistance drops. Cardiac output decreases, leading to reduced perfusion of vital organs. The kidneys receive less blood flow, resulting in decreased urine output (oliguria progressing to anuria) and accumulation of metabolic waste products (azotemia). Reduced renal clearance contributes to elevated blood urea nitrogen, which can cause terminal restlessness, confusion, and myoclonic jerking. Peripheral circulation diminishes in a predictable centripetal pattern: extremities become cool and mottled first (acrocyanosis), then cyanosis progresses centrally. Mottling typically appears on the knees, feet, and hands before progressing to the trunk. Blood pressure drops progressively, and the pulse becomes weak, thready, and irregular. The respiratory system undergoes characteristic changes as respiratory muscle strength declines. Cheyne-Stokes breathing (cyclical pattern of gradually increasing tidal volume followed by gradually decreasing tidal volume with periods of apnea lasting 10-60 seconds) is common in the days before death and reflects brainstem dysfunction in respiratory control centers. As the swallowing reflex diminishes and secretions accumulate in the posterior pharynx and upper airway, the characteristic sound known as the death rattle develops. This gurgling or rattling sound occurs with each breath and is caused by air passing through pooled secretions; importantly, it is typically more distressing to family members than to the patient, who is usually obtunded at this stage. The neurological system progressively deteriorates from the cortex downward. Consciousness diminishes from drowsiness to obtundation to coma. Hearing is traditionally believed to be the last sense to be lost, which is why nurses counsel families to continue speaking to their dying loved one and to be mindful of conversations in the room. The pupils become fixed and dilated as brainstem reflexes cease. The gastrointestinal system slows dramatically: appetite decreases, then thirst diminishes, and finally the swallowing reflex is lost. The liver reduces metabolism of medications, necessitating dose adjustments or route changes. Thermoregulation fails as hypothalamic function declines, and the patient may have alternating fever and hypothermia. Peripheral vasoconstriction leads to cool extremities even in the presence of core fever. Understanding these changes enables the practical nurse to shift the care goal from cure to comfort, focusing on symptom management, dignity, and family support. Kubler-Ross identified five stages of grief that patients and families may experience: denial, anger, bargaining, depression, and acceptance. These stages are not linear, not universal, and may be experienced in any order or simultaneously. The practical nurse must recognize that grief is an individual process and avoid forcing patients or families through prescribed stages."
    },
    riskFactors: [
      "Terminal diagnosis with expected prognosis of 6 months or less (hospice eligibility criterion)",
      "Progressive organ failure (heart failure NYHA Class IV, end-stage renal disease, end-stage liver disease, advanced COPD)",
      "Advanced cancer with widespread metastasis or failure of disease-directed treatment",
      "Advanced neurodegenerative disease (end-stage Alzheimer disease, ALS, Parkinson disease) with declining functional status",
      "Severe frailty with multiple comorbidities, recurrent infections, and progressive functional decline",
      "Failure to thrive in older adults with unintentional weight loss exceeding 10% in 6 months",
      "Recurrent hospitalizations (3 or more in the past year) with declining baseline function between admissions"
    ],
    diagnostics: [
      "Palliative Performance Scale (PPS): standardized tool measuring ambulation, activity level, self-care, intake, and consciousness on a 0-100% scale; PPS below 30% indicates limited prognosis",
      "ECOG Performance Status: 5-point scale (0 = fully active, 4 = completely disabled) used in oncology to assess functional decline and guide care decisions",
      "Serum albumin: values below 25 g/L in advanced illness correlate with poor prognosis; reflects nutritional status and hepatic synthetic function",
      "Electrolyte monitoring: primarily for symptom management rather than correction in actively dying patients; hypercalcemia of malignancy causes confusion, nausea, and constipation",
      "Assessment of vital sign trends: progressive hypotension, tachycardia, and irregular respiratory patterns indicate approaching death; vital signs are assessed for comfort intervention guidance, not for aggressive correction",
      "Functional status assessment tools (Katz ADL, Barthel Index): serial decline in ability to perform basic activities of daily living predicts approaching end of life"
    ],
    management: [
      "Implement comfort-focused care plan: discontinue non-essential medications, laboratory tests, and monitoring that do not contribute to symptom relief or comfort",
      "Manage pain with regular opioid dosing (morphine is the gold standard for end-of-life pain); reassess frequently and titrate to comfort; do not withhold pain medication due to concerns about hastening death -- the principle of double effect supports adequate symptom management",
      "Manage terminal secretions (death rattle) with positioning (turn patient on side to facilitate drainage), gentle oral suctioning only if visible secretions are accessible, and anticholinergic medication (hyoscine/scopolamine) to reduce secretion production",
      "Manage terminal restlessness (agitation, confusion, moaning in the dying patient) by ruling out reversible causes (urinary retention, fecal impaction, pain, full bladder), then administering haloperidol or midazolam as ordered",
      "Maintain oral comfort: provide mouth care every 1-2 hours using moist swabs, water-based lip moisturizer, and small ice chips if swallowing is intact; discontinue IV fluids if causing fluid overload and worsening respiratory secretions",
      "Support thermoregulation: apply light blankets for comfort without overheating; use cool cloths for fever-related discomfort rather than aggressive antipyretic therapy",
      "Provide psychosocial and spiritual support: facilitate visits from chaplaincy, social work, and family; respect cultural and religious practices around death and dying"
    ],
    nursingActions: [
      "Assess for signs of active dying and communicate findings to the registered nurse, family, and interdisciplinary team using clear, non-medical language",
      "Reposition the patient every 2-4 hours for comfort; reduce frequency if repositioning causes distress; place in side-lying position to reduce aspiration risk and minimize secretion sounds",
      "Provide comprehensive mouth care every 1-2 hours: moisten lips, apply water-based lubricant, use soft sponge swabs for oral mucosa -- this is one of the most important comfort measures in active dying",
      "Monitor and document signs of approaching death: mottling, Cheyne-Stokes breathing, decreased urine output, decreasing consciousness, death rattle, loss of reflexes",
      "Educate family about expected physical changes during the dying process: skin color changes, breathing pattern changes, decreased responsiveness, cessation of eating and drinking -- normalize these changes as part of the natural dying process",
      "Ensure advance directives, goals of care, and code status are documented and accessible; advocate for the patient's expressed wishes",
      "Provide post-mortem care with dignity: position the body supine with arms at sides, close the eyes and mouth, remove medical equipment per facility policy, prepare the body according to cultural and religious practices, and allow family time with the deceased"
    ],
    assessmentFindings: [
      "Weeks before death: progressive weakness, increased sleep, decreased appetite, social withdrawal, intermittent confusion, increased pain or need for pain medication adjustments",
      "Days before death: bed-bound, minimal oral intake, semi-comatose or comatose, Cheyne-Stokes breathing, mottling of extremities, coolness of distal extremities, decreased urine output",
      "Hours before death: mandibular breathing (jaw moves with each breath), irregular respirations with prolonged apneic pauses, death rattle (noisy wet breathing), cyanosis progressing centrally, fixed and dilated pupils, loss of all reflexes",
      "Terminal restlessness: agitation, confusion, picking at bed linens, moaning, attempting to get out of bed -- may indicate uncontrolled pain, urinary retention, constipation, or spiritual distress",
      "Grief responses in family: crying, anger directed at staff, denial of prognosis, guilt, bargaining, anticipatory grief, difficulty making decisions about withdrawing treatment",
      "Signs of approaching death in pediatric patients may differ: children may have a terminal surge (brief improvement in alertness and energy before death)"
    ],
    signs: {
      left: [
        "Progressive fatigue and increased sleeping",
        "Decreased appetite and oral intake",
        "Social withdrawal and desire for fewer visitors",
        "Mild confusion or disorientation",
        "Cool extremities with mild mottling of lower limbs",
        "Decreased urine output (oliguria)"
      ],
      right: [
        "Cheyne-Stokes or agonal breathing pattern",
        "Death rattle (gurgling respirations from pooled secretions)",
        "Severe uncontrolled pain despite prescribed analgesics",
        "Unmanaged terminal restlessness or agitation causing distress",
        "Hemorrhage (massive bleeding from tumor erosion or DIC)",
        "Acute respiratory distress or dyspnea causing significant suffering"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (full mu-receptor agonist) -- gold standard for end-of-life pain and dyspnea",
        action: "Binds to mu-opioid receptors in the central nervous system, inhibiting ascending pain pathways and altering pain perception. In end-of-life care, low-dose morphine (1-2 mg IV/SC or 2.5-5 mg oral) also relieves the sensation of dyspnea by reducing the ventilatory response to hypoxia and hypercapnia in the medullary respiratory center, decreasing the subjective experience of air hunger without necessarily changing respiratory rate.",
        sideEffects: "Respiratory depression (dose-dependent), constipation, nausea, sedation, myoclonus (at high doses or with renal impairment), pruritus",
        contra: "Relative in end-of-life care: comfort is the priority; avoid only if patient has documented severe allergy; use hydromorphone as alternative if true morphine allergy exists",
        pearl: "In palliative care, there is no maximum dose ceiling -- titrate to comfort; the principle of double effect states that providing adequate pain and symptom relief is ethical even if it may secondarily hasten death, provided the intent is comfort; subcutaneous route is preferred when IV access is unavailable or oral route is lost"
      },
      {
        name: "Hyoscine Butylbromide (Buscopan) / Scopolamine",
        type: "Anticholinergic / antimuscarinic agent",
        action: "Blocks muscarinic acetylcholine receptors in smooth muscle, secretory glands, and the central nervous system. Reduces production of saliva, bronchial secretions, and GI secretions. Hyoscine butylbromide (Buscopan) does not cross the blood-brain barrier effectively, so it primarily reduces peripheral secretions without causing central sedation. Scopolamine (hyoscine hydrobromide) does cross the blood-brain barrier and additionally provides mild sedation and antiemetic effects.",
        sideEffects: "Dry mouth (therapeutic in managing secretions but may require mouth care), urinary retention, tachycardia, blurred vision, constipation, confusion and agitation (primarily with scopolamine/hyoscine hydrobromide due to central anticholinergic effects)",
        contra: "Narrow-angle glaucoma; mechanical GI or urinary obstruction; myasthenia gravis; tachyarrhythmias (anticholinergic effects worsen tachycardia)",
        pearl: "For death rattle, start hyoscine butylbromide 20 mg SC every 4-6 hours or as needed; most effective when given early before large volumes of secretions accumulate -- suctioning is less effective and more distressing; educate family that the death rattle sounds distressing but the patient is typically unaware due to decreased consciousness"
      },
      {
        name: "Haloperidol (Haldol)",
        type: "Butyrophenone antipsychotic / dopamine D2 receptor antagonist",
        action: "Blocks postsynaptic dopamine D2 receptors in the mesolimbic pathway, reducing psychotic symptoms, agitation, and delirium. Also blocks dopamine receptors in the chemoreceptor trigger zone (CTZ), providing potent antiemetic effects. In end-of-life care, haloperidol is the first-line medication for terminal delirium and restlessness, and is also used for nausea refractory to other antiemetics.",
        sideEffects: "Extrapyramidal symptoms (akathisia, dystonia, parkinsonism), sedation, QT prolongation (dose-dependent), neuroleptic malignant syndrome (rare but life-threatening: hyperthermia, rigidity, autonomic instability, altered consciousness), hypotension",
        contra: "Parkinson disease (worsens dopaminergic deficit); severe QT prolongation or concurrent use of multiple QT-prolonging drugs; CNS depression from other sedating agents (use lower doses); documented hypersensitivity",
        pearl: "For terminal delirium, start with haloperidol 0.5-1 mg SC or IV every 4-8 hours; titrate to calm but not overly sedate the patient; can be given subcutaneously when IV access is unavailable; has minimal respiratory depression compared to benzodiazepines, making it safer for agitation in dying patients; midazolam may be added if haloperidol alone is insufficient"
      }
    ],
    pearls: [
      "Hearing is believed to be the last sense lost in the dying process -- always speak to the patient as if they can hear, and remind families to continue talking to and comforting their loved one even when unresponsive",
      "The death rattle (noisy wet breathing from pooled secretions) is typically more distressing to the family than the patient -- educate families that the patient is usually too obtunded to be aware of the sound; position on side and administer anticholinergics as ordered",
      "The Kubler-Ross five stages of grief (denial, anger, bargaining, depression, acceptance) are NOT linear or universal -- patients and families may experience stages in any order, skip stages, or revisit them; never force someone through a prescribed grief sequence",
      "Principle of double effect in palliative care: providing adequate pain and symptom relief is ethically justified even if it may secondarily hasten death, as long as the primary intent is to relieve suffering, not to cause death",
      "Discontinue non-essential medications in actively dying patients: antihypertensives, statins, vitamins, and preventive medications no longer contribute to comfort and may increase pill burden and side effects",
      "Mouth care every 1-2 hours is one of the most important and often overlooked comfort measures in the actively dying patient -- dry mouth causes significant discomfort; use moist swabs and water-based lip lubricant",
      "Document advance directives, goals of care conversations, and code status clearly and ensure they are accessible to all team members -- the practical nurse advocates for the patient's expressed wishes regarding end-of-life care"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a terminally ill patient who has developed noisy, gurgling respirations (death rattle). The family is visibly distressed. Which action should the practical nurse take first?",
        options: [
          "Perform deep oropharyngeal suctioning to remove all secretions",
          "Explain to the family that the sound is caused by secretions the patient is likely unaware of, and reposition the patient on their side",
          "Increase the IV fluid rate to thin the secretions",
          "Apply supplemental oxygen via non-rebreather mask"
        ],
        correct: 1,
        rationale: "The death rattle is caused by air passing through pooled secretions in the posterior pharynx. The patient is typically too obtunded to be aware of the sound. The first action is to educate the family and reposition the patient on their side to facilitate secretion drainage. Deep suctioning is invasive and often ineffective. IV fluids may worsen secretion volume. Oxygen does not address the underlying cause."
      },
      {
        question: "A family member of a dying patient is angry and says to the practical nurse: 'You are not doing enough to save my mother. I want every treatment available.' Which response by the practical nurse demonstrates therapeutic communication?",
        options: [
          "I understand you are upset. Your mother's care team has determined that further treatment would not change the outcome.",
          "I can see how much you love your mother. Tell me more about what is concerning you right now.",
          "Anger is a normal stage of grief. You will eventually reach acceptance.",
          "I will ask the doctor to order more tests and treatments."
        ],
        correct: 1,
        rationale: "Acknowledging the family member's emotions and inviting them to express their concerns demonstrates therapeutic communication and empathy. Labeling their emotions as a grief stage may feel dismissive. Providing false reassurance or ordering unnecessary interventions is inappropriate. The nurse should listen, validate, and facilitate a care conference if needed."
      },
      {
        question: "A practical nurse is reviewing the medication orders for an actively dying patient. Which medication should the nurse question as potentially non-essential at this stage of care?",
        options: [
          "Morphine 2 mg subcutaneous every 4 hours for pain",
          "Hyoscine butylbromide 20 mg subcutaneous every 6 hours for secretions",
          "Atorvastatin 40 mg oral daily for cholesterol management",
          "Haloperidol 1 mg subcutaneous PRN for agitation"
        ],
        correct: 2,
        rationale: "Atorvastatin is a statin used for long-term cardiovascular risk reduction and provides no comfort benefit in an actively dying patient. It should be discontinued to reduce unnecessary medication burden. Morphine, hyoscine, and haloperidol are all appropriate comfort medications for symptom management at end of life."
      }
    ]
  },

  "delegation-rpn": {
    title: "Delegation Principles for Practical Nurses",
    cellular: {
      title: "Foundations of Professional Delegation and Scope of Practice",
      content: "Delegation is the process by which a regulated health professional (such as a registered nurse or registered practical nurse) transfers the authority to perform a specific nursing activity to another person (such as a personal support worker or unregulated care provider) while retaining accountability for the overall outcome of care. The concept of delegation is rooted in professional nursing standards, legislation, and regulatory frameworks that define scope of practice boundaries for each category of healthcare provider. The registered practical nurse (RPN) in Canada (or licensed practical nurse/LPN in most US jurisdictions) holds a defined scope of practice that includes performing nursing assessments within a predictable client population, administering medications (including some controlled substances depending on jurisdiction), performing wound care, inserting nasogastric tubes, and providing direct patient care across multiple settings. The RPN practices under the direction of a registered nurse (RN) or physician in complex or unpredictable situations, but functions with increasing autonomy for stable, predictable clients. The scope of practice for each regulated nursing professional is determined by four key elements: legislation (the Nursing Act and profession-specific regulations), entry-level competencies (defined by the regulatory body), employer policies and procedures, and individual competence (the nurse's own education, skill, and judgment). When considering delegation, the RPN must apply the Five Rights of Delegation: Right Task (is this task appropriate to delegate based on regulation, policy, and patient stability?), Right Circumstance (is the patient's condition stable and predictable enough for this task to be safely delegated?), Right Person (does the delegate have the knowledge, skill, and training to perform this task safely?), Right Direction and Communication (have clear, specific instructions been given, including what to do, what to observe, and when to report?), and Right Supervision and Evaluation (is appropriate monitoring in place, and will the outcome be evaluated?). Tasks that can NEVER be delegated include initial nursing assessment, care planning, clinical judgment, evaluation of patient outcomes, patient teaching (initial), and tasks requiring professional licensure. Activities that MAY be delegated to unregulated care providers (personal support workers) include assisting with activities of daily living (bathing, dressing, feeding, toileting), measuring vital signs in stable patients, performing simple wound dressing changes per established protocol, ambulating stable patients, performing blood glucose monitoring using point-of-care devices, and recording intake and output. The delegating nurse retains accountability for the decision to delegate, the adequacy of the supervision provided, and the overall care outcome. The delegate is responsible for their own actions and for reporting any changes or concerns to the delegating nurse promptly. Accountability cannot be delegated. Effective delegation requires ongoing assessment of the patient's condition, the delegate's competence, and the appropriateness of the delegated task throughout the shift. If the patient's condition becomes unstable or unpredictable, previously delegated tasks must be reassumed by the regulated professional."
    },
    riskFactors: [
      "High patient acuity with rapidly changing conditions requiring frequent reassessment and clinical judgment",
      "Staffing shortages leading to pressure to delegate tasks beyond the competence of available personnel",
      "Unclear organizational policies regarding scope of practice boundaries and delegation authority",
      "Inadequate orientation and training of unregulated care providers for specific delegated tasks",
      "Communication barriers (language differences, hearing impairment, unclear verbal or written instructions)",
      "Complex medication regimens requiring nursing assessment before administration (pain medications, insulin, anticoagulants)",
      "New or inexperienced staff unfamiliar with facility policies, patient population, or equipment"
    ],
    diagnostics: [
      "Review provincial/state nursing legislation and regulatory body practice standards to confirm scope of practice boundaries for RPN, RN, and unregulated care providers",
      "Assess the patient's current clinical status using validated acuity tools to determine stability and predictability of care needs before delegating tasks",
      "Evaluate the delegate's competency through direct observation, return demonstration, training records, and verbal confirmation of understanding",
      "Review facility policies and procedures regarding delegation authority, approved task lists for each care provider category, and documentation requirements",
      "Assess the current patient assignment for complexity: number of patients, acuity levels, and required monitoring to determine which tasks can safely be delegated",
      "Review the patient's medication administration record and care plan for tasks that require professional nursing judgment versus those that are routine and protocol-driven"
    ],
    management: [
      "Apply the Five Rights of Delegation before every delegation decision: Right Task, Right Circumstance, Right Person, Right Direction/Communication, Right Supervision/Evaluation",
      "Provide clear, specific, and measurable instructions to the delegate including: what to do, how to do it, when to do it, what to observe, what findings to report immediately, and when the task is expected to be completed",
      "Establish a system for ongoing supervision: check in with delegates at regular intervals, require verbal report of completed tasks and any observations, and be physically available for questions and concerns",
      "Document delegation decisions including: what was delegated, to whom, instructions given, supervision plan, and outcomes -- this protects both the delegating nurse and the delegate",
      "Intervene immediately if unsafe practice is observed: stop the task, assess the patient, provide corrective instruction, determine if the delegate requires additional training, and document the event per facility policy",
      "Reassess delegation decisions when patient status changes: if a previously stable patient becomes unstable, reassume delegated tasks and increase the level of professional nursing assessment",
      "Participate in team debriefing to evaluate delegation effectiveness and identify areas for improvement in communication, training, or workflow"
    ],
    nursingActions: [
      "Perform the initial nursing assessment personally -- this cannot be delegated to an unregulated care provider; assessment requires professional judgment and is a regulated act",
      "Communicate delegation decisions using SBAR format: Situation (what needs to be done), Background (relevant patient information), Assessment (why delegation is appropriate), Recommendation (specific instructions and reporting expectations)",
      "Verify delegate competency before assigning tasks: ask the delegate to verbalize understanding of the task, expected outcomes, and situations requiring immediate reporting to the nurse",
      "Monitor and follow up on all delegated tasks: verify completion, assess patient outcomes, and document results; the delegating nurse is accountable for the outcome of delegated care",
      "Refuse to delegate tasks that are outside the delegate's training, outside the patient's stability level, or prohibited by regulation or facility policy -- document the decision and rationale",
      "Report delegation concerns to the charge nurse or nurse manager: patterns of unsafe practice, inadequate staffing that forces inappropriate delegation, or delegates performing tasks outside their scope",
      "Maintain professional accountability: even when tasks are delegated, the RPN remains responsible for the nursing care plan, clinical judgment, and patient outcomes"
    ],
    assessmentFindings: [
      "Effective delegation indicators: tasks completed correctly and on time, delegate reports observations accurately, patient outcomes are maintained, communication is clear and bidirectional",
      "Ineffective delegation indicators: tasks not completed or completed incorrectly, delegate fails to report changes, patient safety events occur, delegate expresses uncertainty about assigned tasks",
      "Over-delegation: nurse assigns too many tasks or tasks exceeding the delegate's competence, resulting in compromised patient safety and overwhelmed staff",
      "Under-delegation: nurse attempts to perform all tasks personally, resulting in burnout, delayed care, and inefficient use of available team resources",
      "Scope of practice violation indicators: unregulated care provider performing initial assessments, administering medications without authorization, making clinical judgments about patient care",
      "Patient safety concerns related to delegation: missed assessments, medication errors, failure to recognize and report deterioration, inadequate supervision of delegated tasks"
    ],
    signs: {
      left: [
        "Delegate verbalizes understanding of assigned tasks and reporting expectations",
        "Delegated tasks completed accurately and within expected timeframe",
        "Delegate reports patient observations including vital sign changes appropriately",
        "Teamwork functions smoothly with clear role delineation",
        "Patients express satisfaction with care received from all team members",
        "Documentation of delegated activities is complete and accurate"
      ],
      right: [
        "Delegate performing tasks outside their scope (administering medications, performing assessments)",
        "Patient deterioration unrecognized because delegated monitoring was inadequate",
        "Medication error resulting from unauthorized administration by unlicensed personnel",
        "Patient fall or injury during task performed by unsupervised, inadequately trained delegate",
        "Failure to report critical vital sign changes or patient complaints",
        "Near-miss or adverse event directly related to inappropriate delegation decision"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-opioid analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system to reduce prostaglandin synthesis, lowering pain perception and fever. Commonly used as a teaching example for delegation because in some jurisdictions and settings, regulated care aides may be authorized to administer certain over-the-counter medications per established medical directive or protocol.",
        sideEffects: "Hepatotoxicity (dose-dependent; most common cause of acute liver failure), nausea, allergic reaction (rare), rash",
        contra: "Severe hepatic impairment, active liver disease, chronic alcohol use (3 or more drinks daily)",
        pearl: "Even when a medical directive permits certain personnel to administer acetaminophen, the RPN must ensure the delegate has been trained, the patient's condition is assessed, the maximum daily dose (4 g/day, 2 g with liver disease) is tracked across all sources, and documentation is completed; the RPN retains accountability for the medication outcome"
      },
      {
        name: "Insulin (Regular, NPH, or Analog)",
        type: "Hormone replacement -- antidiabetic agent",
        action: "Replaces endogenous insulin to facilitate glucose transport from the blood into cells via GLUT4 transporters, lowering blood glucose. Different insulin types have different onset, peak, and duration profiles that require nursing assessment before administration. Insulin is a HIGH-ALERT medication that requires two-nurse verification in many facilities.",
        sideEffects: "Hypoglycemia (most dangerous: tremor, diaphoresis, confusion, seizure, loss of consciousness), injection site lipodystrophy, weight gain, hypokalemia (insulin drives potassium into cells)",
        contra: "Hypoglycemia (blood glucose below 4.0 mmol/L or 72 mg/dL); known hypersensitivity to insulin formulation components",
        pearl: "Insulin administration cannot be delegated to unregulated care providers -- it requires nursing assessment (blood glucose check, meal intake assessment, hypoglycemia screening) before every dose; blood glucose monitoring by point-of-care device may be delegated with proper training, but the nurse must interpret the result and make the insulin dosing decision"
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low-molecular-weight heparin (LMWH) anticoagulant",
        action: "Binds to antithrombin III, enhancing its ability to inhibit activated factor Xa (and to a lesser extent, factor IIa/thrombin), preventing the conversion of prothrombin to thrombin and thereby inhibiting clot formation. Used for deep vein thrombosis prophylaxis and treatment.",
        sideEffects: "Bleeding (most significant), injection site bruising and hematoma, thrombocytopenia (including heparin-induced thrombocytopenia/HIT), elevated liver enzymes, spinal/epidural hematoma with neuraxial anesthesia",
        contra: "Active major bleeding; history of heparin-induced thrombocytopenia (HIT); concurrent use with other anticoagulants without physician direction; epidural catheter in place (risk of spinal hematoma)",
        pearl: "Enoxaparin requires nursing assessment before administration: check platelet count, assess for signs of bleeding (bruising, petechiae, hematuria, melena, gum bleeding), and verify correct dose; inject subcutaneously into the abdomen, alternating sides; do NOT expel the air bubble; do NOT rub the injection site; this medication cannot be delegated to unregulated care providers"
      }
    ],
    pearls: [
      "The Five Rights of Delegation are: Right Task, Right Circumstance, Right Person, Right Direction/Communication, and Right Supervision/Evaluation -- use this framework EVERY time before delegating any task",
      "Accountability CANNOT be delegated -- the RPN who delegates a task retains professional accountability for the delegation decision, the adequacy of supervision, and the patient outcome even though the delegate is responsible for their own actions",
      "Tasks that can NEVER be delegated to unregulated care providers include: initial nursing assessment, care plan development, clinical judgment and decision-making, medication administration (unless covered by specific medical directive), patient teaching (initial), and evaluation of patient outcomes",
      "The most common delegation error is failing to match the task complexity with the delegate's competence -- always verify the delegate has been trained, has demonstrated competency, and is comfortable performing the assigned task",
      "When patient status changes from stable to unstable, previously delegated tasks must be immediately reassumed by the regulated nurse -- delegation decisions are not static and must be continuously reassessed throughout the shift",
      "Clear communication is the foundation of safe delegation: provide specific instructions, expected outcomes, parameters for reporting, and a timeline; ask the delegate to repeat back key elements to confirm understanding",
      "Document all delegation decisions including: what was delegated, to whom, instructions provided, and the supervision and follow-up plan -- this documentation provides legal protection and supports continuity of care"
    ],
    quiz: [
      {
        question: "A practical nurse is working with a personal support worker (PSW) on a medical unit. Which task is appropriate for the practical nurse to delegate to the PSW?",
        options: [
          "Performing the initial shift assessment on a newly admitted patient",
          "Administering oral medications to a stable patient",
          "Assisting a stable patient with bathing and recording intake and output",
          "Evaluating a patient's response to a new pain medication"
        ],
        correct: 2,
        rationale: "Assisting with activities of daily living (bathing) and recording intake and output are within the scope of a personal support worker for stable patients. Initial assessment, medication administration, and evaluation of treatment response require professional nursing judgment and cannot be delegated to unregulated care providers."
      },
      {
        question: "A practical nurse delegates vital sign measurement to a personal support worker for a patient who was stable at the beginning of the shift. The PSW reports a blood pressure of 82/50 mmHg. What should the practical nurse do first?",
        options: [
          "Ask the PSW to recheck the blood pressure in 30 minutes",
          "Document the finding and continue with other patient care",
          "Personally assess the patient immediately, including a full set of vital signs and clinical assessment",
          "Delegate a more experienced PSW to reassess the patient"
        ],
        correct: 2,
        rationale: "A blood pressure of 82/50 mmHg represents a potentially dangerous change requiring immediate professional nursing assessment. The practical nurse must personally assess the patient, including repeat vital signs, level of consciousness, and other clinical indicators. Delaying assessment or re-delegating assessment to another unregulated provider is unsafe. This situation demonstrates that when delegated monitoring reveals abnormal findings, the nurse must reassume direct care."
      },
      {
        question: "Which element of the Five Rights of Delegation is being addressed when a practical nurse asks a personal support worker to describe how they would perform a blood glucose check before delegating the task?",
        options: [
          "Right Task",
          "Right Circumstance",
          "Right Person",
          "Right Supervision"
        ],
        correct: 2,
        rationale: "Assessing whether the delegate has the knowledge, skill, and training to perform the task safely addresses the Right Person component of the Five Rights of Delegation. Asking the PSW to verbalize or demonstrate the procedure confirms their competency. Right Task addresses whether the task itself is appropriate to delegate. Right Circumstance considers the patient's stability. Right Supervision addresses the monitoring and follow-up plan."
      }
    ]
  },

  "fluid-balance-monitoring-rpn": {
    title: "Fluid Balance Monitoring for Practical Nurses",
    cellular: {
      title: "Physiology of Fluid Distribution and Balance",
      content: "Total body water comprises approximately 60% of adult body weight and is distributed between two major compartments: the intracellular fluid (ICF, approximately 40% of body weight, found inside cells) and the extracellular fluid (ECF, approximately 20% of body weight). The extracellular fluid is further divided into intravascular fluid (plasma, approximately 5% of body weight, contained within blood vessels), interstitial fluid (approximately 15% of body weight, surrounding cells in tissues), and transcellular fluid (a small volume found in specialized spaces such as cerebrospinal fluid, synovial fluid, and pleural fluid). Water movement between compartments is governed by osmotic pressure (determined by solute concentration, primarily sodium in the ECF and potassium in the ICF) and hydrostatic pressure (the mechanical force exerted by fluid against vessel or membrane walls). Osmosis drives water from areas of low solute concentration to high solute concentration across semipermeable membranes until equilibrium is reached. Normal serum osmolality ranges from 275 to 295 mOsm/kg and is primarily determined by sodium concentration. The body maintains fluid balance through several regulatory mechanisms. The hypothalamus contains osmoreceptors that detect changes in serum osmolality: when osmolality rises (indicating dehydration), the hypothalamus stimulates thirst and triggers the posterior pituitary to release antidiuretic hormone (ADH/vasopressin). ADH acts on the renal collecting ducts to increase water reabsorption, producing concentrated urine and reducing water loss. When blood volume or pressure decreases, the juxtaglomerular cells of the kidneys release renin, activating the renin-angiotensin-aldosterone system (RAAS). Angiotensin II causes vasoconstriction (raising blood pressure) and stimulates aldosterone release from the adrenal cortex. Aldosterone acts on the renal distal tubules and collecting ducts to increase sodium and water reabsorption while excreting potassium, thereby expanding blood volume. Atrial natriuretic peptide (ANP), released from atrial myocytes when the atria are stretched by excessive volume, opposes the RAAS by promoting sodium and water excretion. Fluid volume deficit (FVD/dehydration/hypovolemia) occurs when fluid output exceeds fluid intake or when fluid shifts from the intravascular space to other compartments. Causes include vomiting, diarrhea, hemorrhage, excessive diuresis, burns, and inadequate oral intake. Clinical findings include thirst, decreased skin turgor, dry mucous membranes, concentrated urine (high specific gravity), tachycardia, hypotension, and decreased urine output. Fluid volume excess (FVE/hypervolemia/fluid overload) occurs when fluid intake or retention exceeds output. Causes include heart failure, renal failure, excessive IV fluid administration, and conditions that increase aldosterone (liver cirrhosis). Clinical findings include weight gain, peripheral edema, pulmonary edema (crackles, dyspnea, orthopnea), jugular venous distension, and elevated blood pressure. Third-spacing is the pathological shift of fluid from the intravascular compartment into a non-functional interstitial space or body cavity (ascites, pleural effusion, tissue edema after burns or surgery). Third-spacing creates an intravascular deficit despite an overall increase in total body water, leading to the paradox of peripheral edema with concurrent dehydration and hypotension. Insensible fluid losses are water losses that occur continuously but are not easily measured: approximately 300-500 mL/day through the skin (evaporation, not sweat) and 300-400 mL/day through the lungs (exhaled water vapor). These losses increase with fever (add 100-150 mL per degree Celsius above 37 degrees), tachypnea, mechanical ventilation with dry gas, and low humidity environments. Accurate fluid balance monitoring through intake and output measurement and daily weights is essential for the practical nurse to identify fluid imbalances early and report them promptly."
    },
    riskFactors: [
      "Heart failure (impaired cardiac output leads to fluid retention through RAAS activation and reduced renal perfusion)",
      "Chronic kidney disease or acute kidney injury (decreased ability to excrete water and regulate electrolytes)",
      "Liver cirrhosis with portal hypertension (ascites formation, decreased albumin production, activation of RAAS)",
      "Major surgery or trauma (third-spacing, blood loss, increased metabolic demand, NPO status)",
      "Burns (massive fluid shifts from intravascular to interstitial space, increased insensible losses through damaged skin)",
      "Older adult population (decreased thirst perception, reduced total body water percentage, impaired renal concentrating ability)",
      "Prolonged vomiting, diarrhea, or nasogastric suctioning (loss of water, electrolytes, and acid-base balance)"
    ],
    diagnostics: [
      "Daily weight measurement: the most accurate indicator of short-term fluid balance changes; 1 kg of weight change equals approximately 1 liter of fluid gain or loss; weigh at the same time daily, same clothing, same scale",
      "Intake and output (I&O) recording: measure all fluid intake (oral, IV, tube feeds, blood products, medications) and all measurable output (urine, wound drainage, nasogastric output, emesis, diarrhea); total and compare every 8-12 hours",
      "Serum sodium: primary determinant of serum osmolality; hyponatremia (below 135 mEq/L) may indicate dilutional excess; hypernatremia (above 145 mEq/L) may indicate free water deficit",
      "BUN and creatinine: BUN/creatinine ratio greater than 20:1 suggests prerenal (dehydration) cause; both elevated proportionally suggests intrinsic renal disease",
      "Urine specific gravity: normal 1.005-1.030; elevated (above 1.025) indicates concentrated urine (dehydration or ADH effect); low (below 1.005) indicates dilute urine (overhydration or diabetes insipidus)",
      "Serum albumin: levels below 25 g/L reduce oncotic pressure within blood vessels, promoting fluid shift into interstitial space (edema); common in malnutrition, liver disease, and nephrotic syndrome"
    ],
    management: [
      "Maintain accurate intake and output records: measure all fluid sources using calibrated containers; estimate insensible losses (add 100-150 mL per degree Celsius fever above 37 degrees); total every 8 hours and report significant positive or negative balance",
      "Perform daily weights using the same scale, same time (preferably before breakfast), same clothing; report weight gain greater than 1 kg in 24 hours or 2.5 kg in one week as potential fluid retention",
      "For fluid volume deficit: administer prescribed IV fluids (isotonic solutions for volume replacement); encourage oral fluid intake if appropriate; monitor vital signs for improvement (heart rate normalization, blood pressure stabilization, urine output increase)",
      "For fluid volume excess: restrict fluids as ordered (distribute allowance: 50% during day, 25% evening, 25% night); restrict sodium intake as ordered; administer diuretics as prescribed; elevate edematous extremities; semi-Fowler position for respiratory comfort",
      "Monitor IV fluid infusion rates carefully using an infusion pump for all continuous infusions; verify rate against physician orders at least every hour",
      "Assess for signs of IV fluid overload during infusion: dyspnea, crackles on auscultation, new peripheral edema, JVD, increasing blood pressure -- slow or stop infusion and notify registered nurse immediately",
      "Replace electrolytes as ordered: potassium, magnesium, calcium, and phosphorus imbalances frequently accompany fluid disturbances and require concurrent correction"
    ],
    nursingActions: [
      "Measure and record ALL intake: oral fluids, IV fluids (including medication diluents and flushes), tube feeding, blood products, and ice chips (record at 50% of container volume since ice melts to approximately half the volume)",
      "Measure and record ALL output: urine (using graduated cylinder or hat collector), wound drainage (empty and measure from drains), nasogastric suction output, emesis, diarrhea (estimate using standardized volumes: small = 100 mL, moderate = 200 mL, large = 300 mL)",
      "Assess skin turgor by gently pinching skin over the sternum or inner forearm (NOT the dorsum of the hand in older adults as age-related loss of skin elasticity makes this site unreliable); turgor that returns in less than 2 seconds is normal; tenting indicates dehydration",
      "Monitor mucous membranes for moisture: dry, sticky, or cracked oral mucous membranes suggest dehydration; inspect tongue furrows (furrowed, dry tongue is a reliable dehydration indicator)",
      "Assess peripheral edema using a standardized scale: 1+ (2 mm depression, barely detectable), 2+ (4 mm, rebounds in less than 15 seconds), 3+ (6 mm, rebounds in 15-30 seconds), 4+ (8 mm, rebounds in more than 30 seconds); document location, severity, and whether bilateral or unilateral",
      "Monitor respiratory status for signs of pulmonary edema: auscultate lung bases for crackles, assess for dyspnea, orthopnea (ask how many pillows the patient sleeps with), and cough with frothy sputum",
      "Report significant findings immediately to the registered nurse: urine output less than 30 mL/hour (or less than 0.5 mL/kg/hour) for two consecutive hours, weight gain exceeding 1 kg in 24 hours, new onset crackles or dyspnea, significant I&O imbalance"
    ],
    assessmentFindings: [
      "Fluid volume deficit (FVD/dehydration): thirst, dry mucous membranes, decreased skin turgor, concentrated dark urine, oliguria, tachycardia, orthostatic hypotension, flat neck veins, sunken fontanelle in infants, weight loss",
      "Fluid volume excess (FVE/hypervolemia): weight gain, dependent edema (sacral in bed-bound patients, pedal in ambulatory patients), pulmonary crackles, dyspnea, orthopnea, jugular venous distension, bounding pulse, elevated blood pressure, cough with frothy sputum",
      "Third-spacing: peripheral edema with concurrent signs of intravascular dehydration (tachycardia, hypotension, decreased urine output); abdominal distension (ascites); decreased serum albumin; positive fluid balance on I&O with clinical signs of volume depletion",
      "Overhydration from excessive IV fluids: sudden weight gain during infusion, new onset dyspnea, increasing blood pressure, crackles at lung bases, sacral or peripheral edema not present before infusion",
      "Dehydration in older adults: may present atypically with confusion, dizziness, falls, or decreased level of consciousness rather than classic thirst; dry axillae and longitudinal tongue furrows are more reliable indicators in this population",
      "Pediatric dehydration assessment: decreased urine output (fewer wet diapers), sunken fontanelle in infants, dry mucous membranes, absence of tears when crying, capillary refill greater than 2 seconds"
    ],
    signs: {
      left: [
        "Thirst and dry mucous membranes",
        "Mild tachycardia at rest (heart rate 100-110)",
        "Decreased urine output (less than 30 mL/hour for 1 hour)",
        "Weight change of 0.5-1 kg in 24 hours",
        "Mild dependent edema (1+ pitting)",
        "Dark concentrated urine (specific gravity above 1.025)"
      ],
      right: [
        "Urine output less than 0.5 mL/kg/hour for 2 or more consecutive hours (possible acute kidney injury)",
        "Severe hypotension with tachycardia (possible hypovolemic shock)",
        "Pulmonary edema: severe dyspnea, crackles throughout lung fields, cough with frothy pink sputum",
        "Jugular venous distension with rapid weight gain (acute heart failure decompensation)",
        "Altered level of consciousness (severe dehydration or fluid overload with pulmonary compromise)",
        "Weight gain exceeding 2 kg in 24 hours with respiratory distress"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid IV solution",
        action: "Isotonic solution with osmolality matching that of blood plasma (approximately 308 mOsm/L). Because it has the same tonicity as blood, infused normal saline remains in the extravascular space proportionally to its distribution: approximately 25% stays intravascular while 75% moves into the interstitial space. Used for volume replacement in dehydration, hemorrhage, and shock; also used as a medication diluent and IV flush solution.",
        sideEffects: "Fluid overload if infused too rapidly (pulmonary edema, peripheral edema), hypernatremia, hyperchloremic metabolic acidosis (excess chloride displaces bicarbonate) with large volume infusions",
        contra: "Fluid overload, decompensated heart failure, severe hypernatremia; use caution in patients with renal impairment or conditions requiring sodium restriction",
        pearl: "Normal saline is the ONLY IV solution compatible with blood product administration; when used for aggressive resuscitation, monitor for hyperchloremic metabolic acidosis (check serum chloride and bicarbonate); 1 liter of NS provides approximately 154 mEq each of sodium and chloride"
      },
      {
        name: "Lactated Ringer Solution (LR/Hartmann Solution)",
        type: "Isotonic crystalloid IV solution with electrolytes",
        action: "Isotonic solution containing sodium (130 mEq/L), potassium (4 mEq/L), calcium (3 mEq/L), chloride (109 mEq/L), and lactate (28 mEq/L). The lactate is metabolized by the liver into bicarbonate, providing a buffering effect. LR more closely approximates plasma electrolyte composition than normal saline and is preferred for large-volume resuscitation because it does not cause hyperchloremic acidosis.",
        sideEffects: "Fluid overload with rapid or excessive infusion, hyperkalemia in patients with renal failure (contains potassium), metabolic alkalosis (excess lactate conversion to bicarbonate), hypercalcemia risk in susceptible patients",
        contra: "Severe hepatic failure (impaired lactate metabolism), hyperkalemia, hypercalcemia; NOT compatible with blood product transfusion (calcium can cause clotting with citrated blood); NOT compatible with ceftriaxone (forms calcium-ceftriaxone precipitate)",
        pearl: "Preferred over normal saline for surgical patients, trauma resuscitation, and burn patients (Parkland formula uses LR); remember: LR is NOT compatible with blood products (use normal saline for blood) and NOT compatible with ceftriaxone; contains potassium so avoid in hyperkalemia or renal failure"
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic",
        action: "Inhibits the sodium-potassium-chloride cotransporter (NKCC2) in the thick ascending limb of the loop of Henle, preventing reabsorption of sodium, potassium, and chloride. This creates a powerful diuresis by preventing water reabsorption in the concentrating segment of the nephron. Also increases renal blood flow and reduces preload by venodilation, providing rapid symptomatic relief in acute pulmonary edema.",
        sideEffects: "Hypokalemia (most common and clinically significant), hyponatremia, hypochloremia, metabolic alkalosis, dehydration, ototoxicity (especially with rapid IV administration or concurrent aminoglycosides), hyperuricemia, hyperglycemia, hypocalcemia, hypomagnesemia",
        contra: "Anuria (no urine production indicates renal shutdown), severe electrolyte depletion (hypokalemia or hyponatremia), hepatic coma, known sulfonamide allergy (cross-sensitivity possible)",
        pearl: "IV furosemide should be administered no faster than 4 mg per minute to prevent ototoxicity; onset is 5 minutes IV, 30-60 minutes oral; always monitor potassium before and during therapy (hypokalemia causes cardiac dysrhythmias); patients should be weighed daily and have strict I&O; administer morning doses to prevent nocturia; monitor for orthostatic hypotension"
      }
    ],
    pearls: [
      "Daily weight is the single most accurate indicator of short-term fluid balance: 1 kg of weight change equals approximately 1 liter (1000 mL) of fluid gained or lost -- always weigh at the same time, same scale, same clothing for accuracy",
      "Urine output less than 0.5 mL/kg/hour for two consecutive hours is a critical finding that may indicate acute kidney injury, severe dehydration, or inadequate cardiac output and must be reported immediately",
      "When assessing skin turgor in older adults, test over the sternum or inner forearm rather than the dorsum of the hand -- age-related loss of skin elasticity causes tenting on the hand that does not accurately reflect hydration status",
      "Normal saline is the ONLY IV solution compatible with blood product transfusion; Lactated Ringer contains calcium which can cause clotting with citrated blood products",
      "Insensible fluid losses (skin evaporation and respiratory vapor) total approximately 600-900 mL/day in healthy adults; these losses increase with fever (add 100-150 mL per degree Celsius above 37), tachypnea, open wounds, and burns",
      "Edema grading scale: 1+ = 2 mm depression (mild), 2+ = 4 mm (moderate), 3+ = 6 mm (moderately severe), 4+ = 8 mm (severe) -- always document location, grade, and bilateral vs. unilateral distribution",
      "Furosemide causes potassium loss -- always monitor serum potassium before and during loop diuretic therapy; hypokalemia (below 3.5 mEq/L) can cause life-threatening cardiac dysrhythmias including ventricular tachycardia and ventricular fibrillation"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with heart failure who has a fluid restriction of 1500 mL per day. How should the nurse distribute the fluid allowance across the day?",
        options: [
          "Allow the patient to drink freely until the limit is reached",
          "Distribute as 750 mL during day shift, 375 mL during evening shift, and 375 mL during night shift",
          "Restrict all fluids until the physician reassesses the order",
          "Distribute equally as 500 mL per 8-hour shift"
        ],
        correct: 1,
        rationale: "The recommended distribution for a 24-hour fluid restriction is approximately 50% during the day (when the patient is most active and takes meals and medications), 25% during the evening, and 25% during the night. This ensures fluids are available when most needed while maintaining the restriction. Equal distribution does not account for higher daytime needs. Allowing unrestricted intake until the limit is reached could result in no fluids available for evening or nighttime medications."
      },
      {
        question: "A practical nurse weighs a patient and finds a weight gain of 2.3 kg compared to the previous day. Assuming this change is entirely due to fluid, approximately how much fluid has the patient retained?",
        options: [
          "230 mL",
          "1,150 mL",
          "2,300 mL",
          "4,600 mL"
        ],
        correct: 2,
        rationale: "One kilogram of weight change equals approximately 1 liter (1,000 mL) of fluid. A gain of 2.3 kg equals approximately 2,300 mL of retained fluid. This significant weight gain should be reported immediately, especially in patients with heart failure or renal disease, as it indicates fluid volume excess requiring intervention."
      },
      {
        question: "A practical nurse is preparing to administer a blood transfusion. Which IV solution should be used to prime the blood tubing and as the only concurrent infusion?",
        options: [
          "Lactated Ringer solution",
          "D5W (5% Dextrose in Water)",
          "Normal Saline (0.9% Sodium Chloride)",
          "D5 0.45% Normal Saline"
        ],
        correct: 2,
        rationale: "Normal saline (0.9% NaCl) is the ONLY IV solution compatible with blood product transfusion. Lactated Ringer solution contains calcium, which can cause clotting with the citrate anticoagulant in stored blood. Dextrose-containing solutions can cause hemolysis (destruction) of red blood cells. Only normal saline may be infused concurrently with or used to prime blood administration tubing."
      }
    ]
  },

  "fluid-resuscitation-logic-rpn": {
    title: "Fluid Resuscitation Principles and Monitoring for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Shock and Fluid Resuscitation",
      content: "Fluid resuscitation is the rapid administration of intravenous fluids to restore adequate circulating blood volume and tissue perfusion in patients experiencing shock or severe fluid loss. Shock is defined as a state of inadequate tissue perfusion in which oxygen delivery to cells is insufficient to meet metabolic demand, resulting in cellular hypoxia, anaerobic metabolism, and ultimately, organ dysfunction and death if untreated. At the cellular level, when oxygen delivery fails, cells switch from aerobic metabolism (which produces 36-38 ATP molecules per glucose molecule via the Krebs cycle and oxidative phosphorylation) to anaerobic metabolism (which produces only 2 ATP molecules per glucose molecule via glycolysis). This energy deficit causes failure of the sodium-potassium ATPase pump, leading to sodium and water influx into the cell (cellular edema), potassium efflux (hyperkalemia), and ultimately cell membrane rupture (lysis). Anaerobic metabolism produces lactic acid as a byproduct, leading to lactic acidosis (serum lactate above 2 mmol/L; levels above 4 mmol/L indicate severe tissue hypoperfusion and carry high mortality). There are four primary types of shock. Hypovolemic shock results from loss of circulating blood volume through hemorrhage (trauma, GI bleeding, surgical blood loss) or fluid loss (severe dehydration from vomiting, diarrhea, burns, or diabetic ketoacidosis). Compensatory mechanisms (tachycardia, peripheral vasoconstriction, ADH and aldosterone release) initially maintain blood pressure; hypotension is a LATE sign indicating loss of approximately 30% of blood volume (Class III hemorrhage). Distributive shock occurs when blood vessels inappropriately vasodilate, reducing systemic vascular resistance and creating a relative hypovolemia despite normal or increased total blood volume. Subtypes include septic shock (most common, caused by systemic inflammatory response to infection releasing vasodilatory mediators including nitric oxide, interleukins, and tumor necrosis factor), anaphylactic shock (massive histamine and leukotriene release from IgE-mediated immune response causing vasodilation, bronchospasm, and increased capillary permeability), and neurogenic shock (loss of sympathetic tone from spinal cord injury above T6 causing vasodilation and bradycardia). Cardiogenic shock results from pump failure: the heart cannot generate adequate cardiac output to perfuse tissues. Causes include massive myocardial infarction (loss of more than 40% of left ventricular muscle), severe heart failure, cardiac tamponade, and massive pulmonary embolism. Obstructive shock results from mechanical obstruction of blood flow, including tension pneumothorax (air compressing the heart and great vessels), cardiac tamponade (fluid compressing the heart), and massive pulmonary embolism. Fluid resuscitation addresses hypovolemic and distributive shock by replacing lost volume or filling the expanded vascular space. Crystalloid solutions (normal saline, lactated Ringer) are first-line because they are readily available, inexpensive, and effective at expanding intravascular volume. However, because crystalloids distribute freely across the extracellular fluid (approximately 25% remains intravascular and 75% moves into interstitial space), large volumes may be needed, and excessive administration causes peripheral edema, pulmonary edema, and abdominal compartment syndrome. Colloid solutions (albumin, hydroxyethyl starch) contain large molecules that remain in the intravascular space longer, providing more sustained volume expansion per volume infused. Mean arterial pressure (MAP) is the primary perfusion pressure target during resuscitation: MAP = diastolic BP + 1/3 (systolic BP minus diastolic BP). A MAP of at least 65 mmHg is the minimum target to maintain adequate organ perfusion. The Parkland formula for burn resuscitation calculates fluid requirements in the first 24 hours: 4 mL x body weight (kg) x total body surface area (TBSA) burned (%). Half of the calculated volume is given in the first 8 hours from the time of burn (not from hospital arrival), and the remaining half is given over the next 16 hours. Lactated Ringer solution is the preferred fluid for burn resuscitation. Urine output is the most reliable real-time indicator of adequate resuscitation: the target is 0.5 mL/kg/hour in adults (30-50 mL/hour) and 1 mL/kg/hour in children."
    },
    riskFactors: [
      "Hemorrhage from trauma, surgery, or gastrointestinal bleeding (most common cause of hypovolemic shock)",
      "Severe sepsis or septic shock (systemic vasodilation and capillary leak from infection-mediated inflammatory response)",
      "Major burns (massive fluid shifts through damaged capillaries; fluid requirements proportional to burn surface area)",
      "Severe dehydration from prolonged vomiting, diarrhea, diabetic ketoacidosis, or heat-related illness",
      "Anaphylaxis causing massive vasodilation and increased capillary permeability (insect stings, medications, foods)",
      "Acute pancreatitis (massive third-spacing of fluid into the retroperitoneal space and peritoneal cavity)",
      "Postoperative patients (blood loss, NPO status, third-spacing, insensible losses from surgical exposure)"
    ],
    diagnostics: [
      "Serum lactate: most important marker of tissue perfusion during resuscitation; lactate above 2 mmol/L indicates tissue hypoperfusion; above 4 mmol/L indicates severe shock with high mortality; trending lactate clearance (decrease of 10-20% every 2 hours) indicates effective resuscitation",
      "Arterial blood gas (ABG): identifies metabolic acidosis (decreased pH, decreased bicarbonate) from lactic acid accumulation in shock; base deficit greater than -6 mEq/L correlates with significant tissue oxygen debt",
      "Complete blood count (CBC): hemoglobin and hematocrit assess blood loss (may be falsely normal in acute hemorrhage before hemodilution occurs); white blood cell count elevated in sepsis or may be critically low in severe sepsis",
      "Basic metabolic panel (BMP): BUN/creatinine assess renal perfusion (rising creatinine indicates acute kidney injury from inadequate perfusion); electrolytes guide replacement therapy",
      "Coagulation studies (INR, PTT, fibrinogen): assess for disseminated intravascular coagulation (DIC) in septic shock and massive hemorrhage; prolonged INR/PTT with low fibrinogen and elevated D-dimer indicate DIC",
      "Central venous pressure (CVP) monitoring: when available, CVP below 8 cmH2O suggests hypovolemia and need for volume; CVP above 12 cmH2O may indicate adequate filling or fluid overload; interpreted in conjunction with clinical response"
    ],
    management: [
      "Establish two large-bore IV lines (16-18 gauge) in antecubital fossa for rapid fluid administration; larger gauge catheters allow faster flow rates (flow rate is proportional to the fourth power of catheter radius)",
      "Administer isotonic crystalloid boluses as ordered: typical initial bolus is 500-1000 mL of normal saline or lactated Ringer over 15-30 minutes; reassess after each bolus (vital signs, urine output, level of consciousness) before administering additional boluses",
      "For burn resuscitation using the Parkland formula: 4 mL x body weight (kg) x %TBSA burned; give half in first 8 hours from time of burn, remaining half over next 16 hours; titrate based on urine output target of 0.5 mL/kg/hour",
      "Monitor MAP continuously; target MAP of 65 mmHg or greater; if MAP does not improve with fluid administration alone, anticipate vasopressor support (norepinephrine is first-line for septic shock)",
      "Monitor urine output hourly via indwelling catheter: target 0.5 mL/kg/hour in adults (approximately 30-50 mL/hour); urine output below this target for 2 consecutive hours despite fluid administration indicates inadequate resuscitation or developing organ dysfunction",
      "Monitor for signs of fluid overload during aggressive resuscitation: new onset crackles, increasing oxygen requirements, rising JVP, new peripheral edema -- report immediately as this may indicate cardiogenic component or over-resuscitation",
      "Warm all IV fluids to body temperature when administering large volumes to prevent hypothermia (hypothermia worsens coagulopathy, acidosis, and cardiac function in shocked patients -- the lethal triad of trauma is hypothermia, acidosis, and coagulopathy)"
    ],
    nursingActions: [
      "Perform rapid primary assessment (ABCDE: Airway, Breathing, Circulation, Disability, Exposure) and report findings using SBAR to the medical team immediately",
      "Obtain and document baseline vital signs including blood pressure, heart rate, respiratory rate, temperature, oxygen saturation, and level of consciousness; reassess every 5-15 minutes during active resuscitation",
      "Insert indwelling urinary catheter as ordered and measure urine output hourly; report output less than 0.5 mL/kg/hour for 2 consecutive hours -- this is the most reliable bedside indicator of resuscitation adequacy",
      "Administer IV fluids and blood products as ordered using an infusion pump or pressure bag for rapid infusion; verify fluid type, rate, and volume against physician orders before initiating",
      "Position patient in modified Trendelenburg (legs elevated 15-30 degrees with trunk flat) to augment venous return in hypovolemic shock; avoid this position in cardiogenic shock or head injury",
      "Monitor and record all intake and output meticulously: IV fluids, blood products, medications, urine, wound drainage, nasogastric output, and estimated blood loss; calculate fluid balance every 1-2 hours during resuscitation",
      "Monitor for signs of transfusion reaction if blood products are administered: fever, chills, urticaria, dyspnea, back pain, hemoglobinuria -- stop transfusion immediately, maintain normal saline infusion, and notify physician"
    ],
    assessmentFindings: [
      "Early (compensated) shock: anxiety, restlessness, tachycardia (first sign), mild tachypnea, normal or slightly decreased blood pressure (compensatory vasoconstriction maintains BP initially), cool pale skin, delayed capillary refill (greater than 3 seconds), slightly decreased urine output",
      "Progressive (decompensated) shock: confusion, agitation, significant tachycardia, hypotension (systolic below 90 mmHg or MAP below 65 mmHg), rapid shallow breathing, cold clammy skin, mottling, oliguria (below 0.5 mL/kg/hour), weak thready pulse, metabolic acidosis on ABG",
      "Irreversible (refractory) shock: obtunded or unresponsive, severe hypotension unresponsive to fluids and vasopressors, bradycardia (pre-terminal sign), agonal breathing, anuria, multiple organ dysfunction, disseminated intravascular coagulation",
      "Septic shock (warm/distributive phase): warm flushed skin, bounding pulse, fever, tachycardia, wide pulse pressure, hypotension despite fluid resuscitation; later transitions to cold shock with vasoconstriction and organ failure",
      "Adequate resuscitation indicators: MAP 65 mmHg or greater, urine output 0.5 mL/kg/hour or greater, serum lactate trending downward (lactate clearance), improving level of consciousness, capillary refill less than 2 seconds, normalized heart rate",
      "Over-resuscitation indicators: new pulmonary crackles, rising oxygen requirements, jugular venous distension, increasing abdominal girth (abdominal compartment syndrome from massive crystalloid administration), worsening peripheral edema"
    ],
    signs: {
      left: [
        "Tachycardia (heart rate above 100 -- earliest sign of hypovolemia)",
        "Mild anxiety or restlessness",
        "Slightly decreased urine output (less than 30 mL/hour for one measurement)",
        "Cool extremities with capillary refill 3-4 seconds",
        "Mild tachypnea (respiratory rate 20-24)",
        "Systolic blood pressure maintained above 90 mmHg by compensatory mechanisms"
      ],
      right: [
        "Hypotension (systolic below 90 mmHg or MAP below 65 mmHg) unresponsive to initial fluid bolus",
        "Anuria (no urine output) or severe oliguria despite fluid administration",
        "Altered level of consciousness (confusion, obtundation, unresponsiveness)",
        "Serum lactate above 4 mmol/L or rising lactate despite resuscitation",
        "Signs of massive hemorrhage (visible blood loss, dropping hemoglobin, coagulopathy)",
        "Cardiac arrest (PEA or asystole) from uncorrected hypovolemia"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid IV solution -- first-line resuscitation fluid",
        action: "Isotonic solution (308 mOsm/L) that expands intravascular volume by distributing across the entire extracellular fluid compartment. Approximately 25% of infused volume remains intravascular while 75% shifts to interstitial space. In shock, rapid infusion of 1-2 liters over 15-30 minutes increases preload, cardiac output, and mean arterial pressure. Compatible with all blood products and most IV medications.",
        sideEffects: "Hyperchloremic metabolic acidosis with large volumes (chloride exceeds physiological concentration at 154 mEq/L), fluid overload (pulmonary edema, peripheral edema), hypernatremia, dilutional coagulopathy with massive infusion",
        contra: "Known fluid overload or decompensated heart failure (use with extreme caution and smaller volumes); severe hypernatremia; conditions requiring potassium-containing solutions",
        pearl: "Normal saline is the default resuscitation fluid and the ONLY IV solution compatible with blood products; for large-volume resuscitation (greater than 2 liters), consider switching to or alternating with lactated Ringer to reduce risk of hyperchloremic acidosis; warm fluids to 37-40 degrees Celsius for massive resuscitation to prevent hypothermia"
      },
      {
        name: "Lactated Ringer Solution (LR/Hartmann Solution)",
        type: "Isotonic crystalloid IV solution -- preferred for burn and surgical resuscitation",
        action: "Balanced isotonic crystalloid containing sodium (130 mEq/L), potassium (4 mEq/L), calcium (3 mEq/L), chloride (109 mEq/L), and lactate (28 mEq/L). The lactate is converted to bicarbonate by the liver, providing a buffering effect that counteracts acidosis. Lower chloride concentration compared to normal saline reduces risk of hyperchloremic metabolic acidosis. Standard fluid for Parkland formula burn resuscitation.",
        sideEffects: "Fluid overload, hyperkalemia (contains potassium -- dangerous in renal failure), metabolic alkalosis (excessive lactate conversion), hypercalcemia risk, lactic acidosis if liver cannot metabolize lactate (severe liver failure)",
        contra: "Hyperkalemia or severe renal failure; severe hepatic failure (cannot metabolize lactate); NOT compatible with blood product transfusion (calcium causes clotting with citrated blood); NOT compatible with ceftriaxone (calcium-ceftriaxone precipitate)",
        pearl: "Preferred over normal saline for large-volume resuscitation in burns (Parkland formula), trauma, and surgical patients because its electrolyte composition more closely matches plasma and avoids hyperchloremic acidosis; critical reminder: NEVER run LR with blood products (use NS) and NEVER mix with ceftriaxone"
      },
      {
        name: "Norepinephrine (Levophed)",
        type: "Catecholamine vasopressor -- first-line for septic shock",
        action: "Potent alpha-1 adrenergic agonist with moderate beta-1 activity. Alpha-1 stimulation causes arterial and venous vasoconstriction, increasing systemic vascular resistance and raising blood pressure. Beta-1 stimulation increases heart rate and contractility, augmenting cardiac output. In septic shock, norepinephrine counteracts the pathological vasodilation caused by inflammatory mediators, restoring vascular tone and organ perfusion pressure.",
        sideEffects: "Peripheral ischemia (vasoconstriction reduces blood flow to extremities, skin, and kidneys), cardiac dysrhythmias, hypertension (overshoot), tissue necrosis if extravasation occurs (alpha-mediated vasoconstriction causes local ischemia), reflex bradycardia, anxiety, headache",
        contra: "Uncorrected hypovolemia (vasopressors without adequate volume resuscitation worsen tissue ischemia); mesenteric or peripheral vascular thrombosis; concurrent use with certain anesthetic agents (halothane -- increases dysrhythmia risk)",
        pearl: "Norepinephrine MUST be administered through a central venous catheter to prevent tissue necrosis from extravasation; if extravasation occurs, phentolamine (alpha-blocker) is injected locally as an antidote; always ensure adequate fluid resuscitation BEFORE initiating vasopressors -- vasopressors on a dry tank worsen organ ischemia; titrate to maintain MAP of 65 mmHg or greater; the practical nurse must monitor the infusion site continuously and report any signs of infiltration immediately"
      }
    ],
    pearls: [
      "Tachycardia is the EARLIEST sign of hypovolemia and shock -- do not wait for hypotension (which is a LATE sign indicating approximately 30% blood volume loss) to initiate assessment and intervention",
      "Urine output is the most reliable bedside indicator of adequate resuscitation: target 0.5 mL/kg/hour in adults (approximately 30-50 mL/hour); urine output below this target for 2 consecutive hours requires immediate reporting and intervention",
      "The Parkland formula for burn resuscitation: 4 mL x body weight (kg) x %TBSA burned = total fluid for first 24 hours; give HALF in the first 8 hours from time of burn (not hospital arrival), remaining half over next 16 hours; use lactated Ringer solution",
      "Mean arterial pressure (MAP) must be maintained at 65 mmHg or greater to ensure adequate organ perfusion; MAP = diastolic BP + 1/3(systolic - diastolic); report MAP below 65 immediately",
      "The lethal triad of trauma is hypothermia, acidosis, and coagulopathy -- each element worsens the others; warm all resuscitation fluids to body temperature and monitor for these complications during massive fluid administration",
      "Always ensure adequate volume resuscitation BEFORE vasopressor initiation -- vasopressors on a hypovolemic patient ('dry tank') cause dangerous vasoconstriction that worsens organ ischemia rather than improving perfusion",
      "Normal saline is the ONLY IV fluid compatible with blood products; lactated Ringer contains calcium which causes clotting in citrated blood products -- this is a critical safety principle during massive transfusion protocols"
    ],
    quiz: [
      {
        question: "A practical nurse is monitoring a patient receiving fluid resuscitation for hypovolemic shock. The patient's heart rate has decreased from 128 to 96 beats per minute, blood pressure has increased from 78/52 to 104/68 mmHg, and urine output is 40 mL in the past hour. How should the nurse interpret these findings?",
        options: [
          "The patient is deteriorating and requires immediate vasopressor support",
          "The patient is responding appropriately to fluid resuscitation with improving perfusion indicators",
          "The patient is developing fluid overload and IV fluids should be stopped immediately",
          "The findings are inconclusive and no action is needed"
        ],
        correct: 1,
        rationale: "Decreasing heart rate (from tachycardia toward normal), increasing blood pressure, and adequate urine output (0.5 mL/kg/hour target) are all positive indicators of effective fluid resuscitation. The compensatory tachycardia is resolving as circulating volume improves. These findings should be documented and reported, and the nurse should continue monitoring closely."
      },
      {
        question: "A patient with 40% total body surface area burns weighing 80 kg is being resuscitated using the Parkland formula. What is the total volume of lactated Ringer solution to be infused in the first 24 hours?",
        options: [
          "6,400 mL",
          "9,600 mL",
          "12,800 mL",
          "16,000 mL"
        ],
        correct: 2,
        rationale: "The Parkland formula calculates: 4 mL x body weight (kg) x %TBSA burned. For this patient: 4 mL x 80 kg x 40% = 12,800 mL in the first 24 hours. Half (6,400 mL) is given in the first 8 hours from the time of burn, and the remaining half (6,400 mL) is given over the next 16 hours using lactated Ringer solution."
      },
      {
        question: "A practical nurse notices that a norepinephrine infusion has infiltrated into the surrounding tissue at the peripheral IV site. The skin around the insertion site is blanched and cool. What is the priority nursing action?",
        options: [
          "Apply warm compresses to the infiltrated area and continue the infusion at a different site",
          "Stop the infusion immediately, notify the physician, and anticipate phentolamine injection into the affected area",
          "Increase the infusion rate to maintain blood pressure while finding another IV site",
          "Document the finding and recheck the site in 30 minutes"
        ],
        correct: 1,
        rationale: "Norepinephrine extravasation is an emergency because its potent alpha-adrenergic vasoconstriction can cause tissue necrosis and gangrene. The infusion must be stopped immediately. Phentolamine (an alpha-adrenergic blocker) is the specific antidote and should be injected subcutaneously into the affected area to reverse local vasoconstriction. Norepinephrine should be administered through a central venous catheter to prevent this complication. Continuing infusion or delaying treatment risks permanent tissue damage."
      }
    ]
  }
};

let ok = 0;
let fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} skipped`);
