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
  "polypharmacy-rpn": {
    title: "Polypharmacy Management for Practical Nurses",
    cellular: {
      title: "Pharmacokinetic Changes and Drug Interaction Mechanisms in Polypharmacy",
      content: "Polypharmacy is defined as the concurrent use of five or more medications by a single patient, though some definitions extend this to include any unnecessary or inappropriate medication regardless of total count. The prevalence of polypharmacy increases dramatically with age: approximately 40% of adults over age 65 take five or more prescription medications, and when over-the-counter products and supplements are included, this number rises substantially. The physiological basis for polypharmacy risk lies in age-related pharmacokinetic changes that alter how the body handles medications. Absorption changes include decreased gastric acid production, reduced gastrointestinal motility, and decreased splanchnic blood flow, all of which can alter the rate and extent of oral drug absorption. Distribution is affected by changes in body composition: older adults have increased body fat (which extends the half-life of lipophilic drugs such as diazepam), decreased total body water (which increases serum concentrations of hydrophilic drugs such as digoxin), and decreased serum albumin (which increases the free fraction of highly protein-bound drugs such as warfarin and phenytoin). Hepatic metabolism declines with aging due to reduced liver mass, decreased hepatic blood flow, and reduced activity of cytochrome P450 enzymes, particularly CYP3A4 and CYP2D6. This results in slower first-pass metabolism and prolonged drug half-lives. Phase I reactions (oxidation, reduction, hydrolysis) are more affected by aging than Phase II reactions (conjugation). Renal excretion decreases due to age-related decline in glomerular filtration rate (GFR), reduced renal blood flow, and decreased tubular secretion. Creatinine clearance declines approximately 1 mL/min per year after age 40, yet serum creatinine may remain normal due to decreased muscle mass. Drug-drug interactions occur through pharmacokinetic mechanisms (one drug alters absorption, distribution, metabolism, or excretion of another) or pharmacodynamic mechanisms (additive, synergistic, or antagonistic effects at receptor sites). The Beers Criteria, maintained by the American Geriatrics Society, is a consensus-based list of potentially inappropriate medications for older adults. Categories include medications to avoid regardless of diagnosis, medications to avoid in specific diseases, drug-drug interactions to avoid, and medications requiring dose adjustment based on renal function. Common high-risk combinations include concurrent use of multiple central nervous system depressants (increased fall and sedation risk), anticoagulants with antiplatelet agents (increased bleeding risk), and anticholinergic medications with cholinesterase inhibitors (pharmacological antagonism). The practical nurse plays a critical role in medication reconciliation, monitoring for adverse drug reactions, and reporting signs of drug toxicity or interactions to the registered nurse or physician."
    },
    riskFactors: [
      "Age 65 years or older (age-related pharmacokinetic changes increase sensitivity to medications)",
      "Multiple chronic conditions requiring treatment by multiple prescribers (fragmented care increases duplication risk)",
      "Recent hospital discharge or care transitions (medication discrepancies occur in up to 70% of transitions)",
      "Cognitive impairment or dementia (impaired ability to manage complex medication regimens)",
      "Living alone without caregiver support (no medication oversight, increased non-adherence risk)",
      "Use of over-the-counter medications and herbal supplements without provider knowledge",
      "History of adverse drug reactions or falls (indicator of existing polypharmacy complications)"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation: compare all medication sources (prescription bottles, pharmacy records, patient self-report) at every care transition to identify discrepancies, duplications, and omissions",
      "Beers Criteria screening: systematically review medication list against the American Geriatrics Society Beers Criteria to identify potentially inappropriate medications for older adults",
      "Renal function assessment: serum creatinine and estimated GFR (eGFR) to guide dose adjustments for renally cleared medications; remember that serum creatinine alone can be misleading in elderly patients with low muscle mass",
      "Hepatic function panel: AST, ALT, albumin, and INR to assess liver function and protein binding capacity; low albumin increases free drug levels of protein-bound medications",
      "Drug level monitoring: obtain trough levels for narrow therapeutic index drugs (digoxin, phenytoin, lithium, aminoglycosides, vancomycin) to ensure therapeutic range and prevent toxicity",
      "Fall risk assessment: use validated tools such as the Morse Fall Scale to evaluate fall risk related to medication side effects (sedation, orthostatic hypotension, dizziness)"
    ],
    management: [
      "Perform thorough medication reconciliation at admission, transfer, and discharge using a standardized form that includes prescription medications, OTC products, and supplements",
      "Collaborate with the pharmacist and prescriber to identify and discontinue unnecessary medications (deprescribing) using a stepwise approach: identify target medication, plan tapering schedule, monitor for withdrawal or return of symptoms",
      "Implement a brown bag review: ask patients to bring all medication containers to appointments to verify what they are actually taking versus what is prescribed",
      "Use pill organizers and medication administration aids for patients with complex regimens; teach patients and caregivers to pre-fill weekly containers",
      "Consolidate medication schedules where possible: reduce dosing frequency, use combination products when appropriate, and align administration times to reduce pill burden",
      "Report all suspected adverse drug reactions to the prescriber using SBAR format; document the suspected medication, the adverse effect observed, and the time relationship between medication administration and symptom onset",
      "Coordinate care communication among multiple prescribers to prevent therapeutic duplication and drug-drug interactions"
    ],
    nursingActions: [
      "Perform medication reconciliation at every care encounter: compare the current medication list with previous records and question any discrepancies before administering medications",
      "Screen the medication list for high-risk combinations: multiple CNS depressants, multiple anticholinergics, anticoagulant-antiplatelet combinations, and medications that lower seizure threshold",
      "Monitor for anticholinergic burden using cumulative scoring: dry mouth, constipation, urinary retention, confusion, tachycardia, and blurred vision -- report cumulative symptoms suggesting anticholinergic toxicity",
      "Assess for orthostatic hypotension (blood pressure drop of 20 mmHg systolic or 10 mmHg diastolic within 3 minutes of standing) in patients taking antihypertensives, diuretics, or CNS depressants",
      "Monitor renal function trends and report declining eGFR to the prescriber, as dose adjustments may be needed for renally cleared medications",
      "Reinforce patient education on the importance of not stopping medications abruptly without prescriber guidance (withdrawal risk with beta-blockers, corticosteroids, benzodiazepines, antidepressants)",
      "Document the complete medication list including dose, route, frequency, indication, and prescriber for every medication at each care encounter"
    ],
    assessmentFindings: [
      "Cognitive changes: new confusion, memory impairment, or delirium -- may indicate anticholinergic burden, benzodiazepine accumulation, or opioid-induced neurotoxicity",
      "Falls or near-falls: may be caused by orthostatic hypotension from antihypertensives, sedation from CNS depressants, or hypoglycemia from diabetes medications",
      "Gastrointestinal symptoms: nausea, constipation, diarrhea, or GI bleeding -- common adverse effects of NSAIDs, opioids, iron supplements, and antibiotics",
      "Unexplained weight changes: weight loss may indicate medication-induced anorexia or malabsorption; weight gain may indicate fluid retention from NSAIDs or corticosteroids",
      "Electrolyte abnormalities: hypokalemia from diuretics, hyperkalemia from ACE inhibitors or potassium-sparing diuretics, hyponatremia from SSRIs or thiazide diuretics",
      "Bleeding signs: bruising, petechiae, dark stools, hematuria -- may indicate excessive anticoagulation or NSAID-anticoagulant interaction",
      "Skin reactions: new rash, pruritus, or photosensitivity -- may indicate drug allergy or drug-induced skin reaction"
    ],
    signs: {
      left: [
        "Mild drowsiness or fatigue (CNS depressant accumulation)",
        "Dry mouth or constipation (anticholinergic effects)",
        "Mild dizziness upon standing (early orthostatic changes)",
        "Decreased appetite or mild nausea",
        "Mild confusion or forgetfulness",
        "Increased frequency of bathroom visits (diuretic effect)"
      ],
      right: [
        "Acute delirium or sudden cognitive decline (drug toxicity)",
        "Severe orthostatic hypotension with syncope (fall risk emergency)",
        "GI hemorrhage (melena, hematemesis from NSAID-anticoagulant interaction)",
        "Severe bradycardia or heart block (beta-blocker or calcium channel blocker toxicity)",
        "Serotonin syndrome (agitation, hyperthermia, clonus, diaphoresis from serotonergic drug combination)",
        "Respiratory depression (opioid-benzodiazepine combination)"
      ]
    },
    medications: [
      {
        name: "Medication Reconciliation Form (Systematic Tool)",
        type: "Assessment Tool for polypharmacy management",
        action: "Provides a standardized framework for documenting and comparing all medications a patient is taking across all sources (prescriptions, OTC, supplements, herbal products) to identify discrepancies, duplications, interactions, and potentially inappropriate medications",
        sideEffects: "Incomplete reconciliation if patient cannot recall all medications or if pharmacy records are incomplete; time-intensive process that requires dedicated nursing time",
        contra: "Not a contraindication per se, but the reconciliation must be performed with reliable sources; self-report alone is insufficient in cognitively impaired patients",
        pearl: "Use the brown bag method (patient brings all containers) combined with pharmacy records and prescriber lists; the most dangerous time for medication errors is during care transitions (admission, transfer, discharge)"
      },
      {
        name: "Beers Criteria Checklist (American Geriatrics Society)",
        type: "Clinical decision support tool for inappropriate medication identification",
        action: "Provides an evidence-based, peer-reviewed list of medications that are potentially inappropriate in older adults, categorized by medications to avoid regardless of condition, medications to avoid with specific diseases, drug-drug interactions to avoid, and dose adjustments for renal function",
        sideEffects: "Overly rigid application may lead to withholding medications that are appropriate in specific clinical contexts; the criteria are guidelines, not absolute rules",
        contra: "Should not be used as a substitute for clinical judgment; some Beers-listed medications may be the best option in certain clinical situations after risk-benefit analysis",
        pearl: "Key Beers Criteria medications to flag: benzodiazepines (fall risk), first-generation antihistamines like diphenhydramine (anticholinergic delirium), long-acting sulfonylureas (hypoglycemia), and meperidine (neurotoxic metabolite accumulation in renal impairment)"
      },
      {
        name: "Drug Interaction Screening Tool (Clinical Resource)",
        type: "Pharmacological safety screening instrument",
        action: "Systematic review process using pharmacy databases or clinical decision support software to identify clinically significant drug-drug interactions, drug-food interactions, and drug-disease interactions that may cause harm",
        sideEffects: "Alert fatigue if too many low-significance interactions are flagged; may generate false positives that require clinical judgment to interpret",
        contra: "Electronic screening tools may not capture all herbal supplement interactions; manual review is still required for completeness",
        pearl: "High-priority interactions to always screen for: warfarin with NSAIDs or antibiotics (bleeding risk), metformin with contrast dye (lactic acidosis), ACE inhibitors with potassium supplements (hyperkalemia), and MAOIs with SSRIs (serotonin syndrome)"
      }
    ],
    pearls: [
      "The Beers Criteria lists diphenhydramine (Benadryl) as potentially inappropriate in older adults due to strong anticholinergic effects causing confusion, urinary retention, and increased fall risk -- avoid using as a sleep aid in elderly patients",
      "Medication reconciliation should occur at EVERY care transition: admission, transfer between units, and discharge -- up to 70% of medication errors occur during these transitions",
      "The anticholinergic burden scale helps quantify cumulative anticholinergic load: each anticholinergic medication adds to the total burden, increasing risk of delirium, constipation, urinary retention, and cognitive impairment",
      "Brown bag medication reviews (patient brings all containers to the visit) consistently reveal discrepancies between what is prescribed and what the patient is actually taking -- always verify",
      "Deprescribing should be approached systematically: identify the medication with the worst risk-benefit ratio, taper gradually (never abruptly discontinue beta-blockers, corticosteroids, benzodiazepines, or antidepressants), and monitor for withdrawal or symptom recurrence",
      "Serum creatinine alone is unreliable for assessing renal function in elderly patients because decreased muscle mass produces less creatinine -- always use estimated GFR (eGFR) for medication dosing decisions",
      "Cascade prescribing occurs when a new medication is prescribed to treat the side effect of an existing medication (e.g., prescribing a laxative for opioid-induced constipation, then prescribing an antidiarrheal when the laxative causes diarrhea) -- recognize and report this pattern"
    ],
    quiz: [
      {
        question: "A practical nurse is performing medication reconciliation for an 82-year-old patient taking 9 medications who was just admitted from a long-term care facility. Which action is the HIGHEST priority?",
        options: [
          "Administer all medications as listed on the transfer document",
          "Compare the transfer medication list with pharmacy records and the patient's own reported medications to identify discrepancies",
          "Hold all medications until the physician reviews the chart",
          "Ask the patient to name all medications from memory"
        ],
        correct: 1,
        rationale: "Medication reconciliation requires comparing multiple sources (transfer documents, pharmacy records, patient self-report, and medication containers when available) to identify discrepancies, duplications, and errors. Simply administering medications from a single source without verification is a leading cause of medication errors during care transitions."
      },
      {
        question: "An elderly patient taking multiple medications develops new-onset confusion, dry mouth, constipation, and urinary retention. The practical nurse recognizes these symptoms as most consistent with which drug-related problem?",
        options: [
          "Serotonin syndrome",
          "Anticholinergic toxicity",
          "Neuroleptic malignant syndrome",
          "Opioid overdose"
        ],
        correct: 1,
        rationale: "The combination of confusion, dry mouth, constipation, and urinary retention represents the classic anticholinergic syndrome. Multiple medications have anticholinergic properties (antihistamines, tricyclic antidepressants, antispasmodics, some antipsychotics), and their effects are cumulative. The practical nurse should calculate the anticholinergic burden and report findings to the prescriber."
      },
      {
        question: "A practical nurse is caring for a 78-year-old patient who takes atenolol, lisinopril, and furosemide. The patient's blood pressure is 142/88 mmHg lying down and 108/62 mmHg standing. Which finding should be reported immediately?",
        options: [
          "The lying blood pressure of 142/88 mmHg",
          "The orthostatic blood pressure drop of 34/26 mmHg",
          "The standing blood pressure of 108/62 mmHg alone",
          "No findings need to be reported as this is expected with these medications"
        ],
        correct: 1,
        rationale: "A systolic blood pressure drop of 20 mmHg or more (or diastolic drop of 10 mmHg or more) within 3 minutes of standing defines orthostatic hypotension. This patient has a 34 mmHg systolic drop, which represents significant orthostatic hypotension and places the patient at high risk for falls and syncope. This must be reported immediately so the prescriber can evaluate the medication regimen."
      }
    ]
  },

  "postmortem-care-rpn": {
    title: "Postmortem Care for Practical Nurses",
    cellular: {
      title: "Physiological Changes After Death and Clinical Considerations",
      content: "Postmortem care encompasses all nursing activities performed after a patient has been pronounced dead, including body preparation, family support, documentation, and coordination with relevant agencies. Understanding the physiological changes that occur after death is essential for the practical nurse to perform competent postmortem care and to communicate accurately with families and the healthcare team. Death occurs when irreversible cessation of circulatory and respiratory functions takes place, or when irreversible cessation of all functions of the entire brain, including the brainstem, occurs. Clinical death is confirmed by the absence of heartbeat, respirations, and brainstem reflexes. The physician, nurse practitioner, or other authorized provider pronounces death and documents the time of death. After circulatory arrest, a predictable sequence of postmortem changes begins. Algor mortis (cooling of the body) begins immediately as the body equilibrates with ambient temperature, cooling at approximately 1 to 1.5 degrees Celsius per hour under standard conditions. Livor mortis (dependent lividity) develops within 1 to 2 hours as blood pools in dependent areas under the influence of gravity, producing reddish-purple discoloration of the skin on the underside of the body. This discoloration becomes fixed (non-blanching) after approximately 8 to 12 hours as hemoglobin breaks down in the tissues. Rigor mortis (stiffening of skeletal muscles) begins within 2 to 4 hours after death, progressing from the small muscles of the face and jaw to the larger muscles of the trunk and extremities. This occurs because ATP is no longer produced, and calcium ions accumulate in the muscle fibers, causing sustained contraction. Rigor mortis is typically complete by 12 hours and resolves (secondary flaccidity) after 24 to 48 hours as muscle proteins degrade. The practical nurse must understand these timelines because postmortem care, including positioning and grooming of the body, should ideally be completed before rigor mortis sets in. Body fluids may drain from natural orifices after death due to relaxation of sphincter muscles and decomposition gases. The practical nurse is responsible for placing the body in a dignified position, closing the eyes and mouth, removing or securing medical devices per facility policy, applying identification tags, and providing culturally sensitive support to the family. In cases requiring autopsy or coroner notification (unexpected death, death within 24 hours of admission, death during surgery, suspected foul play, deaths of unknown cause), the body and all lines, tubes, and devices must be left in place until the coroner or medical examiner authorizes their removal."
    },
    riskFactors: [
      "Unexpected or sudden death (increased family trauma, mandatory coroner notification in most jurisdictions)",
      "Death of a child or young person (heightened emotional impact on family and staff, often requires coroner investigation)",
      "Death following prolonged illness (family may experience both grief and relief, requiring sensitive communication)",
      "Death in isolation or without family present (increased guilt and complicated grief for family members)",
      "Cultural or religious diversity (specific practices around death care that must be honored)",
      "Infectious disease precautions (standard precautions continue after death; additional precautions may apply for certain pathogens)",
      "Organ or tissue donation candidacy (time-sensitive coordination required with procurement organizations)"
    ],
    diagnostics: [
      "Verification of death pronouncement: confirm that the authorized provider has documented cessation of cardiac and respiratory function, absence of brainstem reflexes, time of death, and their printed name and signature",
      "Identification verification: confirm patient identity using two identifiers (hospital wristband and medical record number) before applying postmortem identification tags",
      "Documentation review: verify that all required documentation is complete including death certificate information, medication administration records, and any advance directives or medical assistance in dying (MAID) documentation",
      "Coroner notification checklist: determine whether the death meets criteria for coroner or medical examiner notification per jurisdictional requirements (e.g., unexpected death, death within 24 hours of admission, death during anesthesia or surgery)",
      "Organ and tissue donation screening: contact the organ procurement organization (OPO) as required by facility policy to screen for donation eligibility before initiating routine postmortem care",
      "Personal effects inventory: document all personal belongings including jewelry, dentures, eyeglasses, clothing, and valuables using the facility inventory form with witness signature"
    ],
    management: [
      "Position the body supine with arms at sides or folded across the abdomen before rigor mortis develops (within 2-4 hours of death); place a small pillow under the head to prevent pooling of blood in the face",
      "Close the eyes by gently holding the eyelids closed for 30 seconds; if eyes do not remain closed, apply moist cotton balls over the closed eyelids",
      "Close the mouth by placing a rolled towel under the chin or using a chin strap; insert dentures if available, as facial features will change once rigor mortis sets in and dentures cannot be inserted later",
      "Remove all external medical devices per facility policy (IV lines, urinary catheters, nasogastric tubes) UNLESS the death requires coroner investigation, in which case all devices must remain in place",
      "Perform hygiene care: wash the body with warm water, comb the hair, and apply clean linens; place absorbent pads under the body to collect any drainage from natural orifices",
      "Apply identification tags per facility protocol: typically one on the wrist or ankle and one on the outside of the shroud or body bag; include patient name, medical record number, date and time of death, and attending physician name",
      "Wrap the body in a clean sheet or place in a body bag per facility protocol; coordinate timely transfer to the morgue or funeral home"
    ],
    nursingActions: [
      "Provide emotional support to family members: offer privacy, allow time with the body, facilitate cultural or religious rituals, and contact spiritual care services if requested",
      "Maintain standard precautions during all postmortem care activities: wear gloves, gown if splashing is anticipated, and follow facility protocols for handling of the deceased",
      "Document postmortem care in the medical record including: time of death (as pronounced by authorized provider), notification of family, notifications made (coroner, organ procurement, attending physician), disposition of personal belongings, and postmortem care performed",
      "Complete required facility paperwork: death certificate worksheet with demographic information, cause of death (as determined by the pronouncing provider), and any additional documentation required by the jurisdiction",
      "Notify all relevant parties: attending physician (if not the pronouncing provider), next of kin, funeral home (per family direction), hospital chaplain or spiritual care, organ procurement organization, and coroner if applicable",
      "Support fellow staff members who may be affected by the death, particularly if the death was unexpected or involved a patient with whom staff had developed a close relationship",
      "Secure and inventory all personal belongings: document each item on the personal effects form, obtain family signature for items released, and secure unclaimed items per facility policy"
    ],
    assessmentFindings: [
      "Absence of pulse (apical and carotid): no heartbeat detected on auscultation for a minimum of one full minute",
      "Absence of respirations: no chest rise, no breath sounds on auscultation, no air movement detected for a minimum of one full minute",
      "Fixed, dilated pupils: pupils do not constrict in response to light (indicates cessation of brainstem function)",
      "Absence of blood pressure: no measurable blood pressure by auscultatory or palpatory method",
      "Pallor and cyanosis: skin becomes pale and then develops cyanotic or mottled appearance as circulation ceases",
      "Algor mortis: body temperature progressively decreases toward ambient temperature after circulatory arrest",
      "Loss of muscle tone: jaw drops, sphincters relax (may result in incontinence of urine or stool), extremities become flaccid initially then progress to rigor mortis"
    ],
    signs: {
      left: [
        "Family expressing anticipatory grief before death occurs",
        "Patient showing signs of active dying (Cheyne-Stokes breathing, mottling)",
        "Gradual decrease in level of consciousness",
        "Decreasing urine output and oral intake",
        "Cool, mottled extremities with weak or absent peripheral pulses",
        "Family requesting spiritual care or cultural practices"
      ],
      right: [
        "Unexpected or sudden cardiac arrest requiring code status verification",
        "Death meeting coroner notification criteria (do NOT remove devices)",
        "Family expressing anger, denial, or inability to cope with the death",
        "Signs of potential organ or tissue donation candidacy requiring urgent OPO notification",
        "Suspicion of abuse, neglect, or foul play requiring immediate reporting",
        "Staff experiencing acute emotional distress following patient death"
      ]
    },
    medications: [
      {
        name: "Death Certificate (Legal Documentation Tool)",
        type: "Legal document required for all deaths",
        action: "Provides the official legal record of death including the decedent's demographic information, time and date of death, cause of death (immediate cause and contributing conditions), manner of death (natural, accident, suicide, homicide, undetermined), and certifying provider signature; required for burial or cremation authorization, estate settlement, and insurance claims",
        sideEffects: "Errors on the death certificate can cause significant legal and administrative complications for the family, including delays in funeral arrangements, insurance claim denials, and estate processing difficulties",
        contra: "The practical nurse does not complete the cause of death section (this is the responsibility of the physician or nurse practitioner); however, the practical nurse assists with demographic information and ensures the form is accurately completed",
        pearl: "Ensure the death certificate worksheet is completed with accurate demographic information before it leaves the unit; incorrect spelling of names, wrong dates of birth, or missing Social Security/Health Insurance numbers create significant problems for families during an already difficult time"
      },
      {
        name: "Postmortem Care Checklist (Clinical Protocol Tool)",
        type: "Standardized procedure guide for after-death care",
        action: "Provides a systematic framework for all postmortem nursing activities to ensure nothing is omitted during an emotionally difficult time: body positioning, hygiene care, device removal (or retention for coroner cases), identification tagging, personal effects inventory, family support, notifications, and documentation",
        sideEffects: "Rigid adherence to a checklist without sensitivity to cultural and family needs can appear impersonal; balance thoroughness with compassion",
        contra: "The standard checklist must be modified in coroner cases (do NOT remove tubes, lines, or devices); in organ donation cases (coordinate timing with OPO); and for specific cultural or religious practices (may require immediate body washing by designated persons, specific positioning, or rapid release)",
        pearl: "Complete the postmortem care checklist BEFORE the body is transferred to the morgue; once the body leaves the unit, correcting documentation errors or retrieving personal items becomes much more difficult"
      },
      {
        name: "Coroner/Medical Examiner Notification Protocol (Reporting Tool)",
        type: "Mandatory reporting instrument for qualifying deaths",
        action: "Guides the healthcare team through the required process of notifying the coroner or medical examiner when a death meets jurisdictional reporting criteria, ensuring preservation of evidence, maintenance of medical devices in situ, and proper chain of custody documentation",
        sideEffects: "Coroner cases may delay routine postmortem care and body release, which can be distressing for families who want to take the deceased home or to a funeral home promptly",
        contra: "Failure to report a coroner-qualifying death is a legal violation; when in doubt about whether a death requires coroner notification, always notify -- it is better to report unnecessarily than to fail to report a qualifying death",
        pearl: "Common coroner notification triggers: death within 24 hours of hospital admission, death during surgery or anesthesia, death of unknown cause, death from suspected poisoning or overdose, death from trauma, death in custody, maternal death, and death where abuse or neglect is suspected"
      }
    ],
    pearls: [
      "Postmortem care should be completed within 2-4 hours of death, before rigor mortis sets in -- once rigor mortis develops, positioning the body and inserting dentures becomes extremely difficult",
      "In coroner cases, do NOT remove any tubes, lines, drains, or medical devices -- leave everything in place exactly as it was at the time of death until the coroner or medical examiner authorizes removal",
      "Always insert dentures before rigor mortis develops if they are available -- facial features change significantly without dentures, which can be distressing for family members viewing the body",
      "Contact the organ procurement organization (OPO) BEFORE initiating routine postmortem care -- even patients who seem unlikely donors may be eligible for tissue donation (corneas, skin, bone, heart valves)",
      "Cultural and religious practices vary widely regarding postmortem care: some traditions require the body to be washed by specific family members, some prohibit autopsy, some require burial within 24 hours, and some require the body to face a specific direction -- always ask the family about their preferences",
      "The practical nurse is often the last healthcare professional to provide physical care to the patient -- performing postmortem care with dignity and respect honors the patient's life and provides comfort to the family",
      "Document the time of death as recorded by the pronouncing provider, not the time when the practical nurse first noticed the absence of vital signs -- these may be different, particularly if the death was unwitnessed"
    ],
    quiz: [
      {
        question: "A patient dies unexpectedly 18 hours after hospital admission. The practical nurse is preparing to perform postmortem care. Which action should be taken FIRST?",
        options: [
          "Remove all IV lines and urinary catheter to prepare the body",
          "Notify the coroner or medical examiner before performing any postmortem care",
          "Wash the body and apply clean linens immediately",
          "Transfer the body to the morgue as quickly as possible"
        ],
        correct: 1,
        rationale: "A death occurring within 24 hours of hospital admission meets coroner notification criteria in most jurisdictions. The coroner must be notified BEFORE routine postmortem care is performed, and all medical devices (IV lines, catheters, tubes) must remain in place until the coroner authorizes their removal. Removing devices before coroner authorization may compromise the investigation."
      },
      {
        question: "A practical nurse is performing postmortem care. Which action should be prioritized BEFORE rigor mortis develops?",
        options: [
          "Completing the personal effects inventory",
          "Notifying the funeral home of the patient's death",
          "Inserting dentures, closing the eyes, and positioning the body",
          "Completing all documentation in the medical record"
        ],
        correct: 2,
        rationale: "Rigor mortis begins within 2-4 hours of death and makes it impossible to reposition the body, insert dentures, or close the mouth once it sets in. Physical care (positioning, denture insertion, eye and mouth closure) must be completed before rigor mortis develops. Documentation, personal effects inventory, and funeral home notification, while important, are not time-sensitive in the same way."
      },
      {
        question: "The family of a deceased patient asks the practical nurse why the body feels cold. Which response is most appropriate?",
        options: [
          "The heating system in this room is not working properly",
          "After death, the body naturally cools to match the surrounding temperature -- this is a normal process called algor mortis",
          "I will turn up the thermostat to make the body warmer for you",
          "You should not touch the body until the funeral home arrives"
        ],
        correct: 1,
        rationale: "Algor mortis is the natural cooling of the body after death as it equilibrates with the ambient temperature. Providing a straightforward, honest explanation using simple language helps the family understand what is happening and normalizes their experience. Families should be encouraged to touch, hold, and spend time with their loved one after death if they wish."
      }
    ]
  },

  "postpartum-hemorrhage-basics-rpn": {
    title: "Postpartum Hemorrhage for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Postpartum Hemorrhage and Hemostatic Mechanisms",
      content: "Postpartum hemorrhage (PPH) is defined as cumulative blood loss of 1000 mL or more, or blood loss accompanied by signs and symptoms of hypovolemia, within 24 hours of birth regardless of delivery method. This updated definition from the American College of Obstetricians and Gynecologists (ACOG) replaced the previous threshold of 500 mL for vaginal delivery and 1000 mL for cesarean delivery. PPH is classified as primary (early), occurring within 24 hours of delivery, or secondary (late), occurring between 24 hours and 12 weeks postpartum. Primary PPH accounts for approximately 70-80% of all PPH cases. The pathophysiology of PPH is organized using the 4 Ts mnemonic: Tone, Trauma, Tissue, and Thrombin. Uterine atony (Tone) is the most common cause, accounting for approximately 70-80% of all PPH cases. After placental delivery, the myometrium must contract firmly to compress the spiral arteries at the former placental site. These blood vessels, which carried 500-700 mL/min of blood flow to the placental bed during pregnancy, rely entirely on myometrial contraction (physiological ligatures of Pinard) for hemostasis. When the uterus fails to contract adequately (atony), these vessels remain open, resulting in rapid, life-threatening hemorrhage. Risk factors for uterine atony include overdistended uterus (multiple gestation, polyhydramnios, macrosomia), prolonged labor, rapid labor, chorioamnionitis, use of tocolytic agents (magnesium sulfate, terbutaline), general anesthesia, and high parity. Trauma accounts for approximately 20% of PPH and includes lacerations of the cervix, vagina, or perineum, uterine rupture, and hematoma formation. Tissue retention (retained placental fragments or membranes) prevents complete uterine contraction and accounts for approximately 10% of cases. Retained tissue provides a surface that prevents the myometrium from contracting around the spiral arteries. Thrombin disorders (coagulopathies) are the least common cause but the most dangerous, including disseminated intravascular coagulation (DIC), pre-existing bleeding disorders (von Willebrand disease, thrombocytopenia), and anticoagulant therapy. During pregnancy, blood volume increases by 40-50% (physiological hypervolemia), which provides a compensatory buffer against blood loss. However, this also means that clinical signs of hypovolemia may not appear until blood loss exceeds 15-20% of total blood volume. The practical nurse must be vigilant in monitoring blood loss, fundal tone, and vital signs because tachycardia (the earliest compensatory sign) may be masked by epidural anesthesia or beta-blocker use."
    },
    riskFactors: [
      "Uterine overdistension: multiple gestation, polyhydramnios, fetal macrosomia (birth weight greater than 4000 grams)",
      "Prolonged or augmented labor (myometrial fatigue from extended oxytocin exposure)",
      "Rapid or precipitous labor (less than 3 hours, insufficient time for coordinated uterine contraction)",
      "Chorioamnionitis (intrauterine infection impairs myometrial contractility)",
      "Grand multiparity (5 or more prior deliveries -- decreased uterine muscle tone from repeated stretching)",
      "History of previous PPH (recurrence rate approximately 15-20%)",
      "Placental abnormalities: placenta previa, placenta accreta spectrum, manual placenta removal"
    ],
    diagnostics: [
      "Quantitative blood loss (QBL) measurement: weigh blood-soaked pads, sponges, and drapes (1 gram = 1 mL blood); use calibrated drapes for delivery; gravimetric measurement is more accurate than visual estimation, which consistently underestimates blood loss by 30-50%",
      "Fundal assessment: palpate the uterine fundus immediately after placental delivery and every 15 minutes for the first 1-2 hours; a firm, contracted fundus should feel like a grapefruit at or below the umbilicus; a boggy, soft, or displaced fundus indicates atony",
      "Complete blood count (CBC): hemoglobin and hematocrit may not reflect acute blood loss for 4-6 hours because hemodilution has not yet occurred; trending values is more useful than a single measurement",
      "Coagulation studies: PT, PTT, INR, fibrinogen level, and platelet count to assess for coagulopathy; fibrinogen below 200 mg/dL in the postpartum period is a strong predictor of severe PPH progression",
      "Type and crossmatch: ensure blood type and antibody screen are available for potential transfusion; in emergencies, O-negative packed red blood cells are used until type-specific blood is available",
      "Ultrasound: bedside ultrasound may be used to assess for retained placental tissue or uterine hematoma if hemorrhage does not respond to uterotonics"
    ],
    management: [
      "Perform bimanual uterine massage immediately when a boggy fundus is detected: place one hand on the abdomen cupping the fundal area and massage firmly in a circular motion until the uterus firms (continuous massage, not intermittent)",
      "Administer uterotonic medications as ordered in the following sequence: oxytocin first-line, methylergonovine second-line, carboprost (Hemabate) third-line if first two are ineffective",
      "Establish two large-bore IV lines (16-18 gauge) for rapid fluid resuscitation and blood product administration; infuse warmed crystalloid solution (normal saline or lactated Ringer) to maintain circulating volume",
      "Prepare for blood product administration: packed red blood cells to replace oxygen-carrying capacity, fresh frozen plasma to replace clotting factors, cryoprecipitate to replace fibrinogen; follow massive transfusion protocol if blood loss exceeds 1500 mL",
      "Empty the bladder (insert urinary catheter if not already in place) because a full bladder displaces the uterus and prevents effective contraction",
      "Apply a uterine compression suture (B-Lynch suture) or uterine tamponade balloon (Bakri balloon) as ordered if medications and massage fail to control hemorrhage",
      "Monitor and document blood loss using quantitative measurement (QBL) and report cumulative totals to the healthcare team in real time"
    ],
    nursingActions: [
      "Assess fundal tone and position every 15 minutes during the first hour postpartum, then every 30 minutes for the next hour, then per facility protocol: document firmness (firm, boggy), position (at umbilicus, 1 fingerbreadth above/below), and midline status",
      "Monitor vital signs every 15 minutes during active hemorrhage: tachycardia (heart rate above 100 bpm) is often the EARLIEST sign of hypovolemia in postpartum patients, preceding hypotension",
      "Quantify blood loss using gravimetric measurement: weigh all blood-soaked items (1 g = 1 mL), use calibrated collection drapes, and maintain a running total on the hemorrhage flow sheet",
      "Monitor urine output: insert Foley catheter during active PPH management; report output less than 30 mL/hour as this indicates inadequate renal perfusion from hypovolemia",
      "Administer oxygen via non-rebreather mask at 10-15 L/min during active hemorrhage to maximize oxygen delivery to tissues with reduced circulating hemoglobin",
      "Monitor for signs of coagulopathy: oozing from IV sites, petechiae, ecchymosis, hematuria, blood that does not clot in collection containers -- report immediately as these suggest DIC",
      "Provide emotional support to the patient and family: explain interventions as they occur, maintain calm professionalism, and address anxiety and fear directly"
    ],
    assessmentFindings: [
      "Boggy, soft, non-contracted uterus on palpation (uterine atony -- the most common cause of PPH, responsible for 70-80% of cases)",
      "Fundus displaced to the right or above the umbilicus (may indicate full bladder preventing uterine contraction, or uterine distension from retained clots)",
      "Tachycardia (heart rate above 100 bpm) often appears before hypotension and may be the first indicator of significant blood loss in postpartum patients",
      "Excessive lochia: saturating more than one perineal pad per hour, passing clots larger than a quarter, or continuous bright red bleeding after the first postpartum hour",
      "Cool, clammy skin with pallor and delayed capillary refill (signs of peripheral vasoconstriction compensating for hypovolemia)",
      "Restlessness, anxiety, or altered mental status (early signs of cerebral hypoperfusion from hemorrhagic shock)",
      "Decreasing blood pressure: systolic below 90 mmHg is a LATE sign of hypovolemic shock -- by the time hypotension appears, the patient has already lost a significant volume of blood"
    ],
    signs: {
      left: [
        "Moderate lochia rubra (expected in first 1-3 days postpartum)",
        "Mild uterine cramping with fundal massage (afterpains)",
        "Slightly boggy fundus that firms with massage",
        "Small blood clots (smaller than a quarter)",
        "Mild fatigue and thirst",
        "Heart rate 80-100 bpm with stable blood pressure"
      ],
      right: [
        "Severe, uncontrolled vaginal bleeding saturating pads within minutes",
        "Firm fundus with continued bright red bleeding (suggests laceration or retained tissue, not atony)",
        "Tachycardia above 120 bpm with narrowing pulse pressure",
        "Hypotension (systolic BP below 90 mmHg -- late, ominous sign)",
        "Signs of DIC: oozing from IV sites, gingival bleeding, petechiae",
        "Altered consciousness, confusion, or loss of consciousness (hemorrhagic shock)"
      ]
    },
    medications: [
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic agent (first-line treatment for PPH)",
        action: "Binds to oxytocin receptors on uterine smooth muscle cells, activating phospholipase C and increasing intracellular calcium, which stimulates rhythmic uterine contractions and compresses the spiral arteries at the placental site to achieve hemostasis",
        sideEffects: "Water intoxication and hyponatremia (antidiuretic effect with high-dose IV infusion), uterine hyperstimulation, nausea, vomiting, hypotension with rapid IV bolus",
        contra: "Hypersensitivity to oxytocin; should not be used for labor augmentation when fetal distress is present or when vaginal delivery is contraindicated (though this applies to antepartum use, not PPH management)",
        pearl: "For PPH, administer 20-40 units in 1000 mL crystalloid IV infusion (NOT as an IV push bolus, which can cause profound hypotension and cardiac arrhythmia); also administer 10 units IM as an alternative route; oxytocin is the first-line uterotonic in ALL PPH management protocols"
      },
      {
        name: "Methylergonovine (Methergine)",
        type: "Ergot alkaloid uterotonic (second-line agent)",
        action: "Directly stimulates uterine smooth muscle contraction through alpha-adrenergic and serotonergic receptor activation, producing sustained (tetanic) uterine contraction that compresses bleeding vessels; acts within 2-5 minutes IM and produces contraction lasting 3 hours",
        sideEffects: "Hypertension (potentially severe), nausea, vomiting, headache, peripheral vasoconstriction, chest pain, coronary vasospasm",
        contra: "ABSOLUTELY CONTRAINDICATED in hypertension, preeclampsia, and eclampsia due to potent vasoconstrictive effects that can precipitate hypertensive crisis, stroke, or myocardial infarction; also contraindicated with concurrent use of CYP3A4 inhibitors (azole antifungals, macrolide antibiotics, protease inhibitors)",
        pearl: "The critical safety check before administering methylergonovine is to verify blood pressure -- if the patient has ANY elevation in blood pressure, do NOT administer and notify the prescriber immediately; administer 0.2 mg IM (NOT IV unless life-threatening emergency); can repeat every 2-4 hours as needed"
      },
      {
        name: "Carboprost Tromethamine (Hemabate)",
        type: "Prostaglandin F2-alpha analogue uterotonic (third-line agent)",
        action: "Stimulates myometrial contractions by directly acting on uterine smooth muscle prostaglandin receptors, producing sustained uterine contraction; also increases intracellular calcium in myometrial cells; effective when oxytocin and methylergonovine have failed",
        sideEffects: "Diarrhea (most common -- occurs in up to 30% of patients), nausea, vomiting, fever, bronchospasm (can be severe), hypertension, flushing",
        contra: "CONTRAINDICATED in asthma due to potent bronchoconstrictive effects that can precipitate severe bronchospasm and respiratory failure; also contraindicated in active pulmonary, cardiac, renal, or hepatic disease",
        pearl: "The critical safety check before administering carboprost is to verify the patient does NOT have asthma -- bronchospasm can be life-threatening; administer 0.25 mg deep IM (not IV); can repeat every 15-90 minutes; maximum 8 doses (2 mg total); expect diarrhea as a common side effect"
      }
    ],
    pearls: [
      "The 4 Ts of PPH: Tone (uterine atony, 70-80% of cases), Trauma (lacerations, 20%), Tissue (retained placenta, 10%), Thrombin (coagulopathy, 1%) -- uterine atony is BY FAR the most common cause",
      "Tachycardia is the EARLIEST vital sign change in postpartum hemorrhage -- do not wait for hypotension, which is a late and ominous sign indicating decompensation; a heart rate above 100 bpm in a postpartum patient should prompt immediate assessment",
      "Visual estimation of blood loss is inaccurate and consistently underestimates actual blood loss by 30-50% -- always use quantitative (gravimetric) measurement: weigh blood-soaked pads and linens (1 gram = 1 mL of blood)",
      "Methylergonovine (Methergine) is CONTRAINDICATED in hypertension and preeclampsia -- always check blood pressure before administration; carboprost (Hemabate) is CONTRAINDICATED in asthma -- always check respiratory history before administration",
      "A full bladder displaces the uterus and prevents effective contraction -- if the fundus is displaced to the right or above the umbilicus, empty the bladder first before concluding the uterus is atonic",
      "The pregnant body has 40-50% more blood volume than the non-pregnant state, which means postpartum patients can lose a significant amount of blood before showing classic signs of shock -- maintain a high index of suspicion",
      "Fundal massage technique: cup the fundus with the dominant hand on the abdomen and apply firm, circular pressure while supporting the lower uterine segment with the other hand above the symphysis pubis (to prevent uterine inversion) -- massage until the uterus feels firm like a grapefruit"
    ],
    quiz: [
      {
        question: "A practical nurse assesses a patient 30 minutes after vaginal delivery. The uterine fundus is boggy and located 2 fingerbreadths above the umbilicus. What is the FIRST action?",
        options: [
          "Administer methylergonovine (Methergine) IM immediately",
          "Perform firm bimanual uterine massage and have the patient empty her bladder",
          "Prepare for emergency hysterectomy",
          "Apply an ice pack to the lower abdomen"
        ],
        correct: 1,
        rationale: "A boggy fundus above the umbilicus suggests uterine atony and possible bladder distension (which prevents uterine contraction). The first actions are to massage the fundus firmly to stimulate contraction and empty the bladder (a full bladder displaces the uterus upward and prevents contraction). Medications are second-line if massage is ineffective."
      },
      {
        question: "A postpartum patient with a history of preeclampsia is experiencing PPH from uterine atony. Oxytocin infusion has been started but is not controlling the bleeding. The physician orders a second uterotonic. Which medication should the practical nurse question?",
        options: [
          "Carboprost (Hemabate) 0.25 mg IM",
          "Methylergonovine (Methergine) 0.2 mg IM",
          "Misoprostol (Cytotec) 800 mcg rectally",
          "Additional oxytocin in the IV infusion"
        ],
        correct: 1,
        rationale: "Methylergonovine (Methergine) is ABSOLUTELY CONTRAINDICATED in patients with hypertension or preeclampsia because it causes potent vasoconstriction that can precipitate hypertensive crisis, stroke, or myocardial infarction. The practical nurse must verify blood pressure and hypertensive history before administering any ergot alkaloid and should question this order."
      },
      {
        question: "A practical nurse is monitoring a postpartum patient and notes the heart rate has increased from 82 bpm to 118 bpm over the past 30 minutes while blood pressure remains 118/72 mmHg. The fundus is slightly boggy. What does this assessment suggest?",
        options: [
          "Normal postpartum recovery with expected vital sign changes",
          "Possible early hemorrhage with compensatory tachycardia before hypotension develops",
          "Anxiety related to the birth experience requiring reassurance only",
          "Medication side effect from epidural anesthesia wearing off"
        ],
        correct: 1,
        rationale: "Tachycardia is the EARLIEST compensatory sign of hypovolemia in postpartum hemorrhage. The body increases heart rate to maintain cardiac output before blood pressure drops. A heart rate rising from 82 to 118 bpm with a boggy fundus strongly suggests developing hemorrhage. Blood pressure may remain stable initially due to the 40-50% expanded blood volume of pregnancy, but this is a warning sign that requires immediate intervention."
      }
    ]
  },

  "post-polio-syndrome-rpn": {
    title: "Post-Polio Syndrome for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Post-Polio Syndrome and Motor Neuron Degeneration",
      content: "Post-polio syndrome (PPS) is a condition that affects survivors of acute paralytic poliomyelitis, typically emerging 15 to 40 years after the initial poliovirus infection. It is estimated to affect 25-40% of polio survivors and represents one of the most common motor neuron diseases in North America. The pathophysiology of PPS is rooted in the original poliovirus damage and subsequent compensatory mechanisms. During the acute poliomyelitis infection, the poliovirus selectively destroys anterior horn motor neurons in the spinal cord and motor nuclei in the brainstem. These lower motor neurons innervate skeletal muscle fibers through motor units (one motor neuron plus all the muscle fibers it innervates). When motor neurons are destroyed, the muscle fibers they innervated become denervated and would normally atrophy. However, surviving motor neurons compensate through a process called axonal sprouting: each surviving motor neuron extends new axonal branches (sprouts) to reinnervate the orphaned muscle fibers from destroyed neurons. A single surviving motor neuron that originally innervated 200 muscle fibers may eventually innervate 1000 to 2000 fibers through sprouting. This compensatory reinnervation can be remarkably effective, explaining the functional recovery many polio survivors experienced during rehabilitation. However, this compensation comes at a metabolic cost. The enlarged motor units place enormous metabolic demands on the surviving motor neurons, which must synthesize proteins, neurotransmitters, and structural components for vastly expanded axonal arbors. After decades of this increased metabolic burden, the overworked motor neurons begin to fail. Distal axonal sprouts degenerate first (dying back neuropathy), leading to progressive denervation of muscle fibers that can no longer be compensated. The result is new muscle weakness, fatigue, and atrophy in muscles previously affected by polio and sometimes in muscles that appeared clinically unaffected during the initial illness (because subclinical motor neuron loss occurred but was fully compensated). Additional contributing factors include the normal age-related loss of motor neurons (which begins around age 60), chronic overuse of compensating muscles, disuse atrophy from decreased activity, and musculoskeletal deformities that developed from the original polio. Central fatigue (originating from the reticular activating system, which was also damaged by the poliovirus) contributes to the profound generalized fatigue that patients experience, which is disproportionate to their level of physical activity. PPS is a diagnosis of exclusion: other causes of progressive weakness (amyotrophic lateral sclerosis, myasthenia gravis, radiculopathy, thyroid disease) must be ruled out before the diagnosis is made."
    },
    riskFactors: [
      "History of severe acute paralytic poliomyelitis with significant motor neuron loss (greater initial damage means fewer surviving neurons to compensate)",
      "Greater degree of functional recovery after acute polio (paradoxically, better recovery indicates more compensatory sprouting, which creates larger metabolic burden on surviving neurons)",
      "Longer interval since acute polio infection (typically 15-40 years, average 35 years before PPS onset)",
      "Physical overexertion and chronic overuse of weakened muscles without adequate rest periods",
      "Age-related motor neuron loss compounding the original polio-related neuron deficit",
      "Weight gain or obesity (increased mechanical load on already compromised musculoskeletal system)",
      "Cold temperatures (cold intolerance is common in PPS due to impaired thermoregulation from autonomic nervous system involvement)"
    ],
    diagnostics: [
      "Clinical history: confirmed history of acute paralytic poliomyelitis with partial or complete motor recovery, followed by a stable period of at least 15 years, then gradual onset of new weakness, fatigue, or muscle atrophy",
      "Electromyography (EMG) and nerve conduction studies: demonstrate chronic denervation and reinnervation changes consistent with prior poliomyelitis; may show active denervation in muscles with new weakness; giant motor unit potentials reflect compensatory sprouting",
      "Muscle strength testing: manual muscle testing using the Medical Research Council (MRC) scale to document baseline strength and track progressive weakness; compare current strength to prior documented levels",
      "Pulmonary function tests: forced vital capacity (FVC) and maximum inspiratory/expiratory pressures to assess respiratory muscle involvement; FVC below 50% predicted indicates significant respiratory compromise requiring intervention",
      "Sleep study (polysomnography): to evaluate for sleep-disordered breathing (central or obstructive sleep apnea), which is common in PPS due to respiratory muscle weakness and brainstem involvement",
      "Laboratory studies to exclude other diagnoses: thyroid function tests, creatine kinase (CK, usually normal or mildly elevated in PPS), vitamin B12, erythrocyte sedimentation rate (ESR), and rheumatoid factor"
    ],
    management: [
      "Implement pacing and energy conservation strategies: teach the patient to alternate periods of activity with rest, break tasks into smaller steps, use assistive devices, and avoid exercising to the point of fatigue or pain",
      "Prescribe non-fatiguing exercise programs: low-intensity, low-repetition strengthening and aquatic therapy in warm water (pool temperature 84-88 degrees F); avoid high-intensity or exhaustive exercise that worsens muscle damage",
      "Optimize respiratory function: monitor FVC regularly, initiate non-invasive positive pressure ventilation (BiPAP) for nocturnal hypoventilation, teach assisted cough techniques, and administer pneumococcal and influenza vaccines",
      "Manage pain with multimodal approach: acetaminophen for musculoskeletal pain, low-dose tricyclic antidepressants or gabapentin for neuropathic pain, physical therapy modalities (heat, TENS), and ergonomic modifications to reduce biomechanical stress",
      "Address mobility and function: evaluate for appropriate assistive devices (orthotics, braces, canes, wheelchairs, scooters), home modifications (grab bars, ramps, stair lifts), and occupational therapy for adaptive techniques",
      "Manage fatigue: establish consistent sleep schedule, treat sleep-disordered breathing, address depression if present, implement energy conservation techniques, and consider modafinil for persistent central fatigue unresponsive to non-pharmacological interventions",
      "Provide psychosocial support: PPS patients often experience grief, frustration, and depression as they lose function they worked hard to regain; facilitate support group connections and counseling referrals"
    ],
    nursingActions: [
      "Assess muscle strength systematically at each visit using the MRC scale and document changes to track progression; compare findings to baseline and report any decline",
      "Monitor respiratory function: assess respiratory rate, depth, and pattern; report dyspnea on exertion, orthopnea, morning headaches (CO2 retention), or daytime somnolence (nocturnal hypoventilation)",
      "Implement fall prevention measures: assess gait stability, ensure proper fit and use of assistive devices, evaluate home environment for hazards, and educate patient about fall risks from muscle weakness and fatigue",
      "Monitor nutritional status and weight: excessive weight gain increases mechanical stress on weakened muscles and joints; assess swallowing function if bulbar muscles are affected (dysphagia screening)",
      "Reinforce energy conservation techniques: teach the patient to prioritize activities, use adaptive equipment, sit instead of stand when possible, and schedule rest periods throughout the day",
      "Assess pain using validated tools: document location, quality, severity, and relationship to activity; PPS pain is often musculoskeletal from biomechanical stress, neuropathic from nerve damage, or related to overuse",
      "Monitor for signs of depression and social isolation: PPS patients may withdraw from activities as weakness progresses; assess mood and coping at each visit and facilitate referrals to mental health services"
    ],
    assessmentFindings: [
      "New, progressive muscle weakness in muscles previously affected by polio (most common presentation) or in muscles that appeared clinically unaffected during the acute illness",
      "Profound generalized fatigue disproportionate to activity level (central fatigue from brainstem reticular activating system involvement, distinct from muscle fatigue)",
      "Muscle atrophy with fasciculations in affected muscle groups (visible twitching from spontaneous firing of enlarged motor units)",
      "Cold intolerance: extremities become cold, painful, and discolored in cool environments due to impaired autonomic regulation of peripheral blood flow",
      "New joint pain and musculoskeletal pain: from biomechanical stress on joints and soft tissues compensating for muscle weakness; common in shoulders, knees, and lower back",
      "Sleep disturbances: insomnia, frequent awakening, morning headaches, and excessive daytime sleepiness (may indicate nocturnal hypoventilation or sleep apnea)",
      "Dysphagia and dysarthria if bulbar muscles are involved: difficulty swallowing, nasal regurgitation of liquids, voice changes, and aspiration risk"
    ],
    signs: {
      left: [
        "Mild muscle fatigue with increased activity",
        "Occasional muscle cramps or fasciculations",
        "Mild joint stiffness in the morning",
        "Increased need for rest during the day",
        "Mild cold sensitivity in extremities",
        "Gradual decrease in walking distance or endurance"
      ],
      right: [
        "Acute respiratory distress from respiratory muscle failure (FVC below 30% predicted)",
        "Aspiration pneumonia from unrecognized dysphagia",
        "Falls resulting in fractures (osteoporosis common from prolonged immobility)",
        "Severe dysphagia with aspiration risk and weight loss",
        "Progressive respiratory insufficiency requiring mechanical ventilation",
        "Severe depression with suicidal ideation (loss of hard-won independence)"
      ]
    },
    medications: [
      {
        name: "Pyridostigmine (Mestinon)",
        type: "Acetylcholinesterase inhibitor",
        action: "Inhibits the enzyme acetylcholinesterase at the neuromuscular junction, preventing breakdown of acetylcholine and prolonging its action; this enhances neuromuscular transmission in motor units where the number of functioning nerve terminals has been reduced by PPS, potentially improving muscle strength and reducing fatigue",
        sideEffects: "Gastrointestinal effects (nausea, diarrhea, abdominal cramps, increased salivation), increased bronchial secretions, bradycardia, diaphoresis, muscle fasciculations",
        contra: "Mechanical gastrointestinal or urinary obstruction; use with caution in asthma (increases bronchial secretions) and cardiac arrhythmias (vagotonic effects may worsen bradycardia)",
        pearl: "Evidence for pyridostigmine in PPS is limited and mixed; some patients report modest improvement in fatigue and endurance; start at low doses (30 mg three times daily) and titrate based on response; cholinergic crisis (overdose) presents with excessive secretions, bradycardia, and muscle weakness -- opposite of the therapeutic effect"
      },
      {
        name: "Modafinil (Alertec/Provigil)",
        type: "Wakefulness-promoting agent (non-amphetamine stimulant)",
        action: "Promotes wakefulness through multiple mechanisms including inhibition of dopamine reuptake, activation of glutamatergic circuits, and inhibition of GABAergic neurons in the sleep-wake regulatory centers of the hypothalamus; used off-label in PPS to address severe central fatigue that does not respond to energy conservation and sleep optimization",
        sideEffects: "Headache (most common), nausea, nervousness, insomnia, dizziness, anxiety; rare but serious: Stevens-Johnson syndrome (rash requiring immediate discontinuation), psychiatric symptoms",
        contra: "Known hypersensitivity; left ventricular hypertrophy or mitral valve prolapse with prior stimulant use; caution in patients with hypertension or anxiety disorders; pregnancy (teratogenic potential)",
        pearl: "Use only after non-pharmacological fatigue management strategies have been optimized (sleep hygiene, energy conservation, treatment of sleep apnea); start at 100 mg daily in the morning; if effective, may increase to 200 mg; avoid afternoon dosing to prevent insomnia; monitor blood pressure as modafinil can cause mild hypertension"
      },
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits cyclooxygenase-1 and cyclooxygenase-2 (COX-1 and COX-2) enzymes, reducing prostaglandin synthesis and thereby decreasing inflammation, pain, and fever; particularly effective for musculoskeletal pain from biomechanical stress in PPS patients",
        sideEffects: "Gastrointestinal irritation, ulceration, and bleeding (COX-1 inhibition reduces protective gastric prostaglandins); renal impairment (prostaglandins maintain renal blood flow); cardiovascular risk with prolonged use; hypertension",
        contra: "Active peptic ulcer disease or GI bleeding; severe renal impairment (CrCl below 30 mL/min); third trimester of pregnancy; concurrent anticoagulant therapy (increased bleeding risk); history of NSAID-induced asthma or anaphylaxis",
        pearl: "Use the lowest effective dose for the shortest duration necessary; administer with food to reduce GI irritation; in PPS patients, combine with non-pharmacological pain management (heat therapy, positioning, ergonomic modifications); monitor renal function and blood pressure with chronic use; consider gastroprotection with a PPI if long-term use is necessary"
      }
    ],
    pearls: [
      "Post-polio syndrome is a diagnosis of EXCLUSION -- other causes of progressive weakness (ALS, myasthenia gravis, thyroid disease, vitamin B12 deficiency, radiculopathy) must be systematically ruled out before attributing symptoms to PPS",
      "The cardinal rule of exercise in PPS is to NEVER exercise to the point of pain or fatigue -- overuse of already compromised motor units accelerates degeneration; teach patients the difference between good muscle soreness and harmful overuse pain",
      "Energy conservation is the cornerstone of PPS management: teach patients to pace activities, use assistive devices early (before they become absolutely necessary), sit instead of stand, and schedule rest periods throughout the day",
      "Cold intolerance is common and clinically significant in PPS -- cold temperatures worsen muscle weakness, pain, and fatigue due to impaired autonomic regulation; advise patients to dress warmly, avoid prolonged cold exposure, and use warming strategies",
      "Respiratory muscle involvement is the most life-threatening complication of PPS -- monitor FVC regularly and initiate non-invasive ventilation (BiPAP) when FVC drops below 50% predicted or when symptoms of nocturnal hypoventilation appear (morning headaches, daytime sleepiness, difficulty concentrating)",
      "PPS patients often experience significant psychological distress because they are losing function they worked extremely hard to regain through rehabilitation after their original polio -- acknowledge this grief and facilitate support services",
      "Falls are a major safety concern in PPS due to progressive leg weakness, gait instability, and fatigue -- perform fall risk assessment at every visit and encourage early adoption of assistive devices"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 68-year-old patient diagnosed with post-polio syndrome who asks about starting a vigorous exercise program to rebuild strength. Which response is most appropriate?",
        options: [
          "Encourage vigorous exercise as it will strengthen the weakened muscles",
          "Advise against all exercise because it will worsen muscle damage",
          "Recommend low-intensity, non-fatiguing exercise with rest periods, and stress the importance of never exercising to the point of pain or fatigue",
          "Suggest the patient wait until the weakness stabilizes before starting any exercise"
        ],
        correct: 2,
        rationale: "In PPS, overworked motor neurons are already under metabolic stress from decades of compensatory sprouting. Vigorous or exhaustive exercise can accelerate motor neuron degeneration and worsen weakness. However, complete inactivity leads to deconditioning and disuse atrophy. The recommended approach is low-intensity, non-fatiguing exercise (such as warm-water aquatic therapy) with scheduled rest periods, never exercising to the point of pain or fatigue."
      },
      {
        question: "A patient with post-polio syndrome reports severe fatigue despite sleeping 8 hours per night, along with morning headaches and difficulty concentrating during the day. What should the practical nurse suspect and report?",
        options: [
          "Normal aging-related fatigue that requires no intervention",
          "Depression requiring antidepressant therapy",
          "Possible nocturnal hypoventilation from respiratory muscle weakness requiring sleep study evaluation",
          "Medication side effects from pain medications"
        ],
        correct: 2,
        rationale: "Morning headaches, excessive daytime sleepiness, and difficulty concentrating despite adequate sleep duration are classic signs of nocturnal hypoventilation (CO2 retention during sleep from respiratory muscle weakness). PPS commonly affects respiratory muscles, and nocturnal hypoventilation can be life-threatening if untreated. The patient should be referred for pulmonary function testing and polysomnography to evaluate for sleep-disordered breathing."
      },
      {
        question: "A practical nurse is teaching energy conservation to a patient with post-polio syndrome. Which instruction is most appropriate?",
        options: [
          "Push through fatigue to maintain muscle strength and prevent atrophy",
          "Alternate periods of activity with scheduled rest, prioritize essential tasks, and use assistive devices to reduce energy expenditure",
          "Remain on complete bedrest to preserve energy for essential functions",
          "Exercise vigorously in the morning when energy levels are highest"
        ],
        correct: 1,
        rationale: "Energy conservation in PPS involves pacing activities with scheduled rest periods, prioritizing essential tasks, using assistive devices to reduce energy expenditure, and modifying the environment to reduce physical demands. Pushing through fatigue accelerates motor neuron degeneration, while complete bedrest leads to deconditioning. The goal is to maintain function while protecting overworked motor neurons from further damage."
      }
    ]
  },

  "pregnancy-nutrition-rpn": {
    title: "Pregnancy Nutrition for Practical Nurses",
    cellular: {
      title: "Physiological Basis of Nutritional Requirements During Pregnancy",
      content: "Pregnancy induces profound physiological changes that significantly alter nutritional requirements to support both maternal adaptation and fetal growth and development. The total energy cost of pregnancy is approximately 80,000 additional kilocalories over the entire gestational period, distributed unevenly across trimesters. During the first trimester, caloric needs increase minimally (no additional calories are recommended) because the embryo is small and growth is primarily cellular differentiation rather than mass accumulation. During the second trimester, an additional 340 kilocalories per day are recommended to support the rapid expansion of maternal blood volume, growth of the uterus, and early fetal growth. During the third trimester, an additional 452 kilocalories per day are recommended to support the most rapid period of fetal growth, fat deposition, and brain development. Protein requirements increase from 46 grams per day (non-pregnant) to 71 grams per day during pregnancy to provide amino acids for fetal tissue synthesis, placental development, expansion of maternal blood volume (albumin synthesis), and uterine growth. Iron requirements nearly double during pregnancy from 18 mg to 27 mg per day. The expanding maternal red blood cell mass requires approximately 500 mg of additional iron, and the fetus and placenta require approximately 300 mg. Iron absorption efficiency increases from approximately 10% in the first trimester to 50% in the third trimester, mediated by increased transferrin receptor expression and decreased hepcidin (the master iron regulatory hormone). Despite this increased absorption, dietary intake alone is usually insufficient, and supplementation is recommended. Iron deficiency anemia during pregnancy is associated with preterm birth, low birth weight, and increased risk of postpartum hemorrhage. Folic acid (vitamin B9) is critical for DNA synthesis and cell division, making it essential during the period of rapid embryonic development. Inadequate folic acid during the first 28 days of gestation (when the neural tube closes) significantly increases the risk of neural tube defects (NTDs) including spina bifida and anencephaly. The recommended intake of folic acid is 600 mcg daily during pregnancy, with 400 mcg recommended preconceptionally. Women with a history of a prior NTD-affected pregnancy require 4 mg (4000 mcg) daily beginning one month before conception. Calcium requirements during pregnancy are 1000 mg per day (same as non-pregnant women aged 19-50), because calcium absorption efficiency doubles during pregnancy under the influence of increased calcitriol (active vitamin D). However, inadequate calcium intake forces the maternal skeleton to supply calcium to the fetus, increasing maternal risk of osteoporosis. Docosahexaenoic acid (DHA), an omega-3 fatty acid, is essential for fetal brain and retinal development, with the most rapid accumulation occurring during the third trimester. The recommended intake is at least 200-300 mg DHA daily. Gestational weight gain guidelines from the Institute of Medicine are based on pre-pregnancy body mass index (BMI): underweight (BMI below 18.5) should gain 28-40 pounds; normal weight (BMI 18.5-24.9) should gain 25-35 pounds; overweight (BMI 25-29.9) should gain 15-25 pounds; and obese (BMI 30 or above) should gain 11-20 pounds. Excessive weight gain increases the risk of gestational diabetes, preeclampsia, macrosomia, cesarean delivery, and postpartum weight retention."
    },
    riskFactors: [
      "Pre-existing nutritional deficiencies: iron deficiency anemia, vitamin D deficiency, or low folate levels before conception increase risk of complications during pregnancy",
      "Restrictive diets: vegetarian, vegan, or elimination diets may lack adequate iron, vitamin B12, calcium, zinc, and DHA unless carefully supplemented",
      "Adolescent pregnancy: increased nutritional needs due to ongoing maternal growth competing with fetal nutritional demands",
      "Multiple gestation (twins, triplets): significantly higher caloric, protein, iron, and micronutrient requirements than singleton pregnancy",
      "Hyperemesis gravidarum: persistent nausea and vomiting limiting oral intake and causing dehydration, electrolyte imbalances, and weight loss",
      "Pre-pregnancy obesity (BMI 30 or above): associated with increased risk of gestational diabetes, preeclampsia, and neural tube defects despite excess caloric intake (due to micronutrient deficiencies)",
      "Short interpregnancy interval (less than 18 months): insufficient time to replenish maternal iron stores and nutritional reserves between pregnancies"
    ],
    diagnostics: [
      "Complete blood count (CBC) at first prenatal visit and repeat at 24-28 weeks: hemoglobin below 11 g/dL in the first and third trimesters or below 10.5 g/dL in the second trimester indicates anemia requiring treatment",
      "Serum ferritin: the most sensitive early marker of iron depletion; ferritin below 30 ng/mL in pregnancy warrants iron supplementation even if hemoglobin is normal",
      "One-hour glucose challenge test (GCT) at 24-28 weeks: 50 g oral glucose load followed by blood glucose measurement at 1 hour; values 130-140 mg/dL or higher (depending on facility cutoff) require a 3-hour glucose tolerance test to diagnose gestational diabetes",
      "25-hydroxyvitamin D level: optimal level during pregnancy is 30-50 ng/mL; deficiency (below 20 ng/mL) is common and associated with preeclampsia, gestational diabetes, and impaired fetal bone development",
      "Urine dipstick for protein and glucose at each prenatal visit: proteinuria may indicate preeclampsia; glycosuria may indicate hyperglycemia requiring further evaluation",
      "Pre-pregnancy BMI calculation and gestational weight gain tracking: plot weight gain on the Institute of Medicine recommended weight gain curve at each prenatal visit to identify inadequate or excessive gain early"
    ],
    management: [
      "Prescribe prenatal vitamins containing folic acid (at least 600 mcg), iron (27-30 mg elemental iron), calcium (if dietary intake is insufficient), vitamin D (600-1000 IU), iodine (150 mcg), and DHA (200-300 mg)",
      "Provide trimester-specific caloric guidance: no additional calories in the first trimester, approximately 340 extra calories/day in the second trimester, and approximately 452 extra calories/day in the third trimester above pre-pregnancy needs",
      "Counsel on foods to avoid during pregnancy: raw or undercooked meat, fish, and eggs (Salmonella, Toxoplasma, Listeria risk); unpasteurized dairy products and juices; high-mercury fish (swordfish, shark, king mackerel, tilefish); deli meats and hot dogs unless heated to steaming (Listeria risk)",
      "Address nausea management in the first trimester: eat small, frequent meals; avoid strong odors; try dry crackers before rising; ginger supplements (250 mg four times daily); vitamin B6 (pyridoxine) 10-25 mg three times daily; doxylamine-pyridoxine (Diclectin/Diclegis) if non-pharmacological measures are insufficient",
      "Monitor gestational weight gain at each prenatal visit: counsel on appropriate gain based on pre-pregnancy BMI; address excessive gain with dietary counseling and activity recommendations; address inadequate gain with nutritional assessment and social service referrals if food insecurity is identified",
      "Screen for food insecurity and refer to community resources: WIC (Women, Infants, and Children) program, food banks, prenatal nutrition programs, and social services",
      "Provide specific dietary guidance for common pregnancy concerns: constipation (increase fiber to 28 g/day and fluids), heartburn (small frequent meals, avoid lying down after eating), and leg cramps (adequate calcium and magnesium intake)"
    ],
    nursingActions: [
      "Assess dietary intake using a 24-hour recall or food frequency questionnaire at the first prenatal visit and periodically throughout pregnancy to identify nutritional gaps and cultural food practices",
      "Reinforce the importance of taking prenatal vitamins daily: iron supplements should be taken on an empty stomach with vitamin C (orange juice) to enhance absorption; calcium and iron should be taken at least 2 hours apart because calcium inhibits iron absorption",
      "Monitor weight at each prenatal visit and plot on the gestational weight gain chart: report gains outside the recommended range to the supervising nurse or provider",
      "Educate on safe food handling practices to prevent foodborne illness: wash hands before food preparation, cook meats to proper internal temperatures, wash all produce thoroughly, and store foods at proper temperatures",
      "Assess for signs and symptoms of iron deficiency anemia: fatigue, pallor, tachycardia, dyspnea on exertion, pica (craving non-food items like ice, starch, or dirt), and koilonychia (spoon-shaped nails)",
      "Screen for hyperemesis gravidarum: assess frequency and severity of nausea and vomiting, monitor weight changes, assess for ketonuria (indicates starvation ketosis), and report inability to keep food or fluids down for more than 24 hours",
      "Counsel on caffeine limitation: recommend no more than 200 mg caffeine per day (approximately one 12-oz cup of coffee); excessive caffeine is associated with increased risk of miscarriage and low birth weight"
    ],
    assessmentFindings: [
      "Inadequate weight gain: less than 1 pound per month in the second and third trimesters may indicate insufficient caloric intake, hyperemesis, or underlying medical condition",
      "Excessive weight gain: more than 3 pounds per week may indicate fluid retention (preeclampsia), excessive caloric intake, or gestational diabetes",
      "Signs of iron deficiency anemia: pallor (conjunctival, palmar), fatigue disproportionate to activity, tachycardia at rest, dyspnea on exertion, pica (craving ice, starch, clay, or dirt)",
      "Signs of dehydration from hyperemesis: dry mucous membranes, decreased skin turgor, concentrated urine, orthostatic hypotension, and ketones in urine",
      "Edema assessment: mild dependent edema (ankles, feet) is normal in pregnancy; sudden onset of facial or periorbital edema, or non-dependent edema with hypertension and proteinuria, suggests preeclampsia",
      "Fundal height measurement: should correlate with gestational age in centimeters (between 20 and 36 weeks); discrepancy of more than 2 cm may indicate growth restriction (inadequate nutrition) or macrosomia (excessive nutrition or gestational diabetes)",
      "Fetal movement assessment after 28 weeks: decreased fetal movement may indicate fetal compromise from nutritional insufficiency, growth restriction, or other complications"
    ],
    signs: {
      left: [
        "Mild nausea in the first trimester (morning sickness, typically resolves by 12-14 weeks)",
        "Mild fatigue in the first and third trimesters",
        "Food aversions and cravings (common and usually benign)",
        "Mild constipation (from iron supplements and progesterone effects)",
        "Mild ankle edema in the third trimester (physiological)",
        "Heartburn and gastroesophageal reflux (progesterone-related relaxation of lower esophageal sphincter)"
      ],
      right: [
        "Hyperemesis gravidarum: persistent vomiting with weight loss greater than 5% of pre-pregnancy weight, ketonuria, and dehydration",
        "Pica (craving non-food substances): may indicate severe iron deficiency and poses risk of toxin ingestion or bowel obstruction",
        "Severe anemia: hemoglobin below 7 g/dL with tachycardia, dyspnea, and risk of high-output cardiac failure",
        "Sudden excessive weight gain with facial edema and hypertension (preeclampsia warning signs)",
        "Fundal height significantly less than expected for gestational age (intrauterine growth restriction)",
        "Ketonuria with weight loss (starvation ketosis from inadequate caloric intake)"
      ]
    },
    medications: [
      {
        name: "Prenatal Vitamin with Folic Acid",
        type: "Multivitamin and mineral supplement for pregnancy",
        action: "Provides essential micronutrients for maternal health and fetal development: folic acid (600 mcg) for neural tube closure and DNA synthesis; iron (27-30 mg) for maternal red blood cell expansion and fetal iron stores; calcium (200-300 mg, partial supplementation) for fetal skeletal development; vitamin D (400-1000 IU) for calcium absorption and immune function; iodine (150 mcg) for fetal thyroid development and brain growth; DHA (200 mg) for fetal brain and retinal development",
        sideEffects: "Nausea (most common complaint, often from iron content), constipation (iron-related), dark stools (normal iron effect), metallic taste; some patients tolerate prenatal vitamins better when taken at bedtime with a small snack",
        contra: "Hypersensitivity to any component; hemochromatosis or iron overload conditions (contraindicate iron-containing formulations); vitamin A-containing formulations should not exceed 5000 IU daily (teratogenic at high doses)",
        pearl: "If the patient cannot tolerate the prenatal vitamin due to nausea, try switching to a different formulation (chewable, gummy, liquid), taking it at bedtime instead of morning, or temporarily substituting folic acid alone until nausea resolves; folic acid supplementation is most critical in the first 28 days of gestation when the neural tube closes"
      },
      {
        name: "Ferrous Sulfate (Iron Supplement)",
        type: "Oral iron replacement for iron deficiency anemia in pregnancy",
        action: "Provides elemental iron (65 mg per 325 mg tablet) that is absorbed in the duodenum and upper jejunum, incorporated into hemoglobin for oxygen transport, and stored as ferritin; replaces depleted iron stores and supports the 40-50% expansion of maternal red blood cell mass required during pregnancy",
        sideEffects: "Constipation (most common), nausea, epigastric pain, dark/black stools (normal and expected), diarrhea; GI side effects are dose-dependent and the most common reason for non-adherence",
        contra: "Hemochromatosis, hemolytic anemias not caused by iron deficiency, repeated blood transfusions (iron overload risk); parenteral iron formulations may be needed if oral iron is not tolerated or absorbed",
        pearl: "Take on an empty stomach with vitamin C (orange juice) to enhance absorption by converting ferric iron (Fe3+) to the more absorbable ferrous form (Fe2+); separate from calcium supplements, antacids, coffee, and tea by at least 2 hours as these inhibit iron absorption; if constipation is intolerable, try every-other-day dosing (emerging evidence suggests comparable absorption with fewer side effects) or switch to iron bisglycinate (better tolerated formulation)"
      },
      {
        name: "Calcium Carbonate (Tums/Caltrate)",
        type: "Calcium supplement and antacid",
        action: "Provides elemental calcium (40% by weight, highest percentage of any calcium salt) for fetal skeletal mineralization, maternal bone health maintenance, and supplementation of dietary calcium deficits; also neutralizes gastric acid (useful for pregnancy-related heartburn); the fetus accumulates approximately 30 grams of calcium during pregnancy, primarily in the third trimester",
        sideEffects: "Constipation, bloating, gas, hypercalcemia (with excessive doses), renal calculi with chronic high doses; may reduce absorption of iron, thyroid medications, and certain antibiotics",
        contra: "Hypercalcemia, hyperparathyroidism, severe renal impairment, calcium-containing kidney stones; excessive calcium intake (above 2500 mg/day) may increase risk of renal calculi and cardiovascular events",
        pearl: "Total daily calcium intake from food and supplements should reach 1000 mg for women aged 19-50 (1300 mg for adolescents); take in divided doses of 500 mg or less for optimal absorption (calcium absorption is saturable); take calcium at least 2 hours apart from iron supplements; calcium carbonate requires gastric acid for absorption so should be taken with food, while calcium citrate can be taken on an empty stomach"
      }
    ],
    pearls: [
      "Folic acid supplementation should ideally begin at least one month BEFORE conception because the neural tube closes by day 28 of gestation -- often before a woman knows she is pregnant; this is why public health guidelines recommend 400 mcg folic acid daily for all women of childbearing age",
      "Iron and calcium supplements should NEVER be taken at the same time because calcium inhibits iron absorption in the GI tract -- separate administration by at least 2 hours",
      "Pica (craving and eating non-food substances such as ice, starch, dirt, clay, or laundry detergent) is a clinical sign of iron deficiency -- always screen for pica when assessing pregnant patients and check iron studies if present",
      "The Institute of Medicine gestational weight gain guidelines are based on pre-pregnancy BMI: underweight (28-40 lbs), normal weight (25-35 lbs), overweight (15-25 lbs), obese (11-20 lbs) -- excessive gain increases risk of macrosomia, cesarean delivery, and gestational diabetes",
      "Listeria monocytogenes infection in pregnancy can cause miscarriage, stillbirth, and neonatal sepsis -- counsel patients to avoid unpasteurized dairy, deli meats (unless heated to steaming), and soft cheeses (Brie, Camembert, queso fresco)",
      "Caffeine should be limited to 200 mg per day (approximately one 12-oz cup of coffee) -- excessive caffeine crosses the placenta and is associated with increased risk of miscarriage and low birth weight",
      "Vitamin A intake should not exceed 5000 IU (1500 mcg RAE) daily from supplements during pregnancy -- excessive preformed vitamin A (retinol) is teratogenic, causing craniofacial, cardiac, and central nervous system malformations; beta-carotene (provitamin A from plants) is NOT teratogenic and is safe"
    ],
    quiz: [
      {
        question: "A pregnant patient at 10 weeks gestation asks the practical nurse when she should start taking folic acid supplements. Which response is most accurate?",
        options: [
          "You should begin taking folic acid now and continue throughout pregnancy",
          "Folic acid is most important in the third trimester for brain development",
          "Ideally, folic acid should be started at least one month before conception because the neural tube closes by day 28 of pregnancy, but starting now is still beneficial",
          "Folic acid is only necessary if you have a family history of birth defects"
        ],
        correct: 2,
        rationale: "The neural tube closes by day 28 of gestation, often before a woman knows she is pregnant. Ideally, folic acid supplementation (400-600 mcg daily) should begin at least one month before conception. However, at 10 weeks, it is still beneficial to start supplementation for ongoing cell division and fetal development, and the nurse should encourage compliance while being honest about optimal timing."
      },
      {
        question: "A practical nurse is teaching a pregnant patient about her iron supplement. The patient reports taking it with her calcium supplement and a glass of milk at breakfast. Which correction is most important?",
        options: [
          "The patient should take the iron at bedtime instead of at breakfast",
          "The patient should take iron separately from calcium by at least 2 hours because calcium inhibits iron absorption",
          "The patient should take the iron with milk because it reduces nausea",
          "The patient should take both supplements on an empty stomach for better absorption"
        ],
        correct: 1,
        rationale: "Calcium inhibits iron absorption in the gastrointestinal tract. Iron supplements should be taken at least 2 hours apart from calcium supplements and calcium-rich foods (milk, cheese). For optimal absorption, iron should be taken on an empty stomach with a source of vitamin C (such as orange juice) to enhance conversion to the absorbable ferrous form."
      },
      {
        question: "A pregnant patient at 32 weeks gestation reports craving and eating large amounts of ice (2-3 trays per day). The practical nurse recognizes this behavior as potentially indicating which condition?",
        options: [
          "Normal pregnancy craving requiring no further assessment",
          "Gestational diabetes with increased thirst",
          "Iron deficiency anemia (pica is a clinical sign of iron depletion)",
          "Dehydration from inadequate fluid intake"
        ],
        correct: 2,
        rationale: "Pica is the craving and consumption of non-nutritive substances, and pagophagia (compulsive ice consumption) is one of the most common forms. Pica is a clinical sign of iron deficiency and should prompt assessment of iron status (hemoglobin, serum ferritin). The practical nurse should report this finding and anticipate orders for iron studies and possible increased iron supplementation."
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
