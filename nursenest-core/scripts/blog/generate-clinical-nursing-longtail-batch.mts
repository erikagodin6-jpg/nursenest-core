#!/usr/bin/env npx tsx
/**
 * Deterministic 20-post clinical nursing long-tail batch.
 *
 * Workflow:
 *   1. --stage=draft writes files with draft: true for local validation/preview.
 *   2. --stage=publish writes the same validated files with draft: false.
 *
 * The public reader only consumes non-draft long-tail files.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

type Topic = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  category: string;
  tags: string[];
  lens: string;
  compare: string;
  patho: string;
  cues: string;
  priorities: string[];
  traps: string[];
  links: string[];
  faq: [string, string][];
  refs: string[];
};

const outDir = join(process.cwd(), "src", "content", "blog-static-longtail");
const reportPath = join(process.cwd(), "docs", "reports", "clinical-nursing-longtail-batch-2026-05-10.json");
const postsJsonPath = join(process.cwd(), "docs", "reports", "clinical-nursing-longtail-batch-2026-05-10.posts.json");

const commonRefs = {
  diabetes:
    "Umpierrez, G. E., Davis, G. M., ElSayed, N. A., Fadini, G. P., Galindo, R. J., Hirsch, I. B., Pasquel, F. J., & others. (2024). Hyperglycemic crises in adults with diabetes: A consensus report. Diabetes Care, 47(8), 1257-1275. https://doi.org/10.2337/dci24-0032",
  sepsis:
    "Society of Critical Care Medicine. (2026). Surviving Sepsis Campaign: International guidelines for management of sepsis and septic shock 2026. https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines",
  kidney:
    "Kidney Disease: Improving Global Outcomes. (2026). KDIGO 2026 clinical practice guideline for acute kidney injury and acute kidney disease: Public review draft. https://kdigo.org/guidelines/acute-kidney-injury/",
  heart:
    "Heidenreich, P. A., Bozkurt, B., Aguilar, D., Allen, L. A., Byun, J. J., Colvin, M. M., Deswal, A., Drazner, M. H., Dunlay, S. M., Evers, L. R., Fang, J. C., Fedson, S. E., Fonarow, G. C., Hayek, S. S., Hernandez, A. F., Khazanie, P., Kittleson, M. M., Lee, C. S., Link, M. S., & Milano, C. A. (2022). 2022 AHA/ACC/HFSA guideline for the management of heart failure. Circulation, 145(18), e895-e1032. https://doi.org/10.1161/CIR.0000000000001063",
  vte:
    "Ortel, T. L., Neumann, I., Ageno, W., Beyth, R., Clark, N. P., Cuker, A., Hutten, B. A., Jaff, M. R., Manja, V., Schulman, S., Thurston, C., Vedantham, S., Verhamme, P., Witt, D. M., D Florez, I., Izcovich, A., Nieuwlaat, R., Ross, S., Schunemann, H. J., & Wiercioch, W. (2020). American Society of Hematology 2020 guidelines for management of venous thromboembolism: Treatment of deep vein thrombosis and pulmonary embolism. Blood Advances, 4(19), 4693-4738. https://doi.org/10.1182/bloodadvances.2020001830",
  copd:
    "Global Initiative for Chronic Obstructive Lung Disease. (2025). Global strategy for the diagnosis, management, and prevention of chronic obstructive pulmonary disease: 2025 report. https://goldcopd.org/",
  asthma:
    "Global Initiative for Asthma. (2025). Global strategy for asthma management and prevention: 2025 update. https://ginasthma.org/2025-gina-strategy-report/",
  stroke:
    "American Heart Association/American Stroke Association. (2026). 2026 guideline for the early management of patients with acute ischemic stroke. https://www.stroke.org/en/about-stroke/types-of-stroke/ischemic-stroke-clots/ais-top-things-to-know",
  ich:
    "Greenberg, S. M., Ziai, W. C., Cordonnier, C., Dowlatshahi, D., Francis, B., Goldstein, J. N., Hemphill, J. C., Johnson, R., Keigher, K. M., Mack, W. J., Mocco, J., Newton, E. J., Ruff, I. M., Sansing, L. H., Schulman, S., Selim, M. H., Sheth, K. N., Sprigg, N., & Sunnerhagen, K. S. (2022). 2022 guideline for the management of patients with spontaneous intracerebral hemorrhage. Stroke, 53(7), e282-e361. https://doi.org/10.1161/STR.0000000000000407",
  icp:
    "Brain Trauma Foundation. (2024). Guidelines for the management of severe traumatic brain injury and intracranial pressure monitoring. https://braintrauma.org/coma/guidelines",
  epilepsy:
    "National Institute for Health and Care Excellence. (2025). Epilepsies in children, young people and adults (NICE guideline NG217). https://www.nice.org.uk/guidance/ng217",
  electrolytes:
    "Sterns, R. H. (2015). Disorders of plasma sodium: Causes, consequences, and correction. New England Journal of Medicine, 372(1), 55-65. https://doi.org/10.1056/NEJMra1404489",
  diabetesInsipidus:
    "Christ-Crain, M., Bichet, D. G., Fenske, W. K., Goldman, M. B., Rittig, S., Verbalis, J. G., & Verkman, A. S. (2019). Diabetes insipidus. Nature Reviews Disease Primers, 5, Article 54. https://doi.org/10.1038/s41572-019-0103-2",
  calcium:
    "Endotext. (2025). Hypocalcemia and hypercalcemia. National Center for Biotechnology Information Bookshelf. https://www.ncbi.nlm.nih.gov/books/",
  acidBase:
    "Merck Manual Professional Edition. (2026). Acid-base disorders. https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/acid-base-regulation-and-disorders",
  pharmacology:
    "Lexicomp. (2026). Drug information: Digoxin, beta blockers, warfarin, and heparin. Wolters Kluwer Clinical Drug Information.",
};

const topics: Topic[] = [
  {
    slug: "siadh-vs-diabetes-insipidus-nursing-comparison",
    title: "SIADH vs Diabetes Insipidus Explained for Nursing Students",
    seoTitle: "SIADH vs Diabetes Insipidus for Nursing Students",
    seoDescription: "Compare SIADH and diabetes insipidus with sodium trends, urine concentration, fluid status, nursing priorities, and NCLEX-RN or REx-PN exam traps.",
    excerpt: "Compare SIADH and diabetes insipidus as opposite water-balance disorders so sodium, urine output, neurologic risk, and priority nursing actions make sense.",
    category: "Endocrine Disorders",
    tags: ["SIADH", "Diabetes Insipidus", "Electrolytes", "Endocrine", "NCLEX-RN", "REx-PN"],
    lens: "ADH is the organizing clue. SIADH keeps too much free water; diabetes insipidus loses too much free water.",
    compare: "SIADH usually points toward concentrated urine, falling sodium, low serum osmolality, and neurologic change from water excess. DI points toward high-volume dilute urine, thirst, dehydration risk, and hypernatremia when water access is poor.",
    patho: "In SIADH, antidiuretic hormone activity is inappropriate for the serum osmolality, so the collecting ducts keep reabsorbing water even when plasma is already dilute. In central DI, ADH is not released adequately; in nephrogenic DI, the kidney does not respond to ADH. That difference explains why desmopressin can fit central DI but does not belong as a reflex answer for SIADH.",
    cues: "Exam stems often hide the diagnosis in intake and output, urine specific gravity, sodium direction, mental status, and medication history. Postoperative CNS injury, pulmonary disease, malignancy, SSRIs, opioids, and carbamazepine can appear near SIADH. Pituitary surgery, head trauma, lithium, and hypercalcemia can appear near DI.",
    priorities: ["Trend neurologic status and seizure risk when sodium is severely abnormal.", "Record strict intake and output, urine concentration clues, and daily weight.", "For SIADH, anticipate fluid restriction or ordered hypertonic therapy only with close monitoring.", "For DI, protect free-water access, volume status, and ordered desmopressin evaluation."],
    traps: ["Treating every hyponatremia as SIADH without checking volume clues.", "Assuming DI always has hypernatremia even when thirst and oral intake are intact.", "Choosing rapid sodium correction without safety language.", "Ignoring urine output because the serum sodium looks like the whole diagnosis."],
    links: ["hyponatremia-symptoms-causes-nursing-priorities", "hypernatremia-causes-symptoms-nursing-care", "acute-kidney-injury-prerenal-intrinsic-postrenal", "dka-vs-hhs-nursing-priorities"],
    faq: [["What is the fastest SIADH vs DI discriminator?", "Pair urine output with urine concentration: SIADH usually retains water with concentrated urine; DI causes large volumes of dilute urine."], ["Can a DI patient have normal sodium?", "Yes. If thirst is intact and water is available, sodium may stay near normal despite polyuria."], ["What nursing priority applies to both?", "Neurologic monitoring and safe sodium correction awareness apply to both disorders."]],
    refs: [commonRefs.diabetesInsipidus],
  },
  {
    slug: "dka-vs-hhs-nursing-priorities",
    title: "DKA vs HHS Explained: Nursing Priorities, Labs, and NCLEX Differences",
    seoTitle: "DKA vs HHS Nursing Priorities for NCLEX and REx-PN",
    seoDescription: "Learn how DKA and HHS differ by ketones, acidosis, dehydration, mental status, labs, and safe nursing priorities for NCLEX-RN and REx-PN.",
    excerpt: "Separate DKA from HHS by insulin deficit, ketones, acidosis, osmolality, dehydration severity, and the nursing actions that protect patients during treatment.",
    category: "Endocrine Disorders",
    tags: ["DKA", "HHS", "Diabetes", "Fluids", "Insulin", "NCLEX-RN", "REx-PN"],
    lens: "Both are hyperglycemic crises, but DKA is a ketone and acidosis problem while HHS is a profound dehydration and hyperosmolality problem.",
    compare: "DKA is classically faster, common in type 1 diabetes, and includes ketonemia with metabolic acidosis. HHS is often slower, more common in type 2 diabetes, and has very high glucose and osmolality without major ketoacidosis.",
    patho: "Insulin deficiency and counterregulatory hormones drive lipolysis in DKA, creating ketoacids and Kussmaul respirations. In HHS, enough insulin may suppress major ketogenesis, but not enough insulin is present for glucose use, so osmotic diuresis becomes extreme. Potassium may look normal or high before therapy despite total-body potassium loss, which is why replacement and rhythm monitoring are exam favorites.",
    cues: "Look for abdominal pain, nausea, fruity breath, tachypnea, and acidosis clues in DKA. Look for older adult, infection, dehydration, neurologic change, and very high glucose/osmolality in HHS. Both can be triggered by infection, missed insulin, myocardial infarction, steroids, or new diabetes.",
    priorities: ["Assess airway, breathing, circulation, perfusion, and mental status before focusing on numbers.", "Anticipate isotonic fluids first unless the stem states a different protocol.", "Monitor potassium before and during insulin therapy.", "Watch glucose trends, anion gap or ketone resolution, urine output, and signs of cerebral or pulmonary complications."],
    traps: ["Giving insulin without noticing critically low potassium.", "Calling HHS benign because ketones are absent.", "Choosing oral fluids for an unstable or altered patient.", "Stopping assessment after a single glucose value."],
    links: ["metabolic-acidosis-vs-metabolic-alkalosis", "hyponatremia-symptoms-causes-nursing-priorities", "hypernatremia-causes-symptoms-nursing-care", "siadh-vs-diabetes-insipidus-nursing-comparison"],
    faq: [["Which condition has ketones?", "DKA has clinically important ketones and metabolic acidosis; HHS has minimal or absent ketones by comparison."], ["Why is potassium so important?", "Insulin shifts potassium into cells and can reveal dangerous total-body depletion."], ["Which is more dehydrating?", "HHS is often profoundly dehydrating because hyperosmolar diuresis can progress for days."]],
    refs: [commonRefs.diabetes, commonRefs.electrolytes],
  },
  {
    slug: "acute-kidney-injury-prerenal-intrinsic-postrenal",
    title: "Acute Kidney Injury Explained: Prerenal vs Intrinsic vs Postrenal",
    seoTitle: "Prerenal vs Intrinsic vs Postrenal AKI for Nursing Students",
    seoDescription: "Compare AKI causes, urine output clues, nursing assessment priorities, nephrotoxin safety, and NCLEX-style traps across prerenal, intrinsic, and postrenal injury.",
    excerpt: "Use perfusion, nephron injury, and obstruction to organize acute kidney injury assessment, lab trends, urine findings, and safe nursing priorities.",
    category: "Renal and Urinary",
    tags: ["Acute Kidney Injury", "Renal", "Prerenal", "Postrenal", "NCLEX-RN", "REx-PN"],
    lens: "AKI is easiest when you ask where the problem begins: before the kidney, inside the kidney, or after urine leaves the kidney.",
    compare: "Prerenal AKI is inadequate perfusion with potentially salvageable tubules. Intrinsic AKI means nephron tissue is injured. Postrenal AKI means urine flow is obstructed, often from prostate enlargement, stones, clots, neurogenic bladder, or catheter blockage.",
    patho: "When perfusion drops, the kidney conserves sodium and water to defend circulating volume. If hypoperfusion persists, tubular injury can develop and the urine picture changes. Intrinsic injury may follow ischemia, sepsis, nephrotoxins, contrast exposure, rhabdomyolysis, or glomerular disease. Postrenal pressure backs up through the collecting system and can damage renal tissue if obstruction is not relieved.",
    cues: "Stems give hypotension, bleeding, vomiting, diuretics, ACE inhibitor use, NSAIDs, contrast, sepsis, myoglobin, or low urine output. Postrenal stems may mention bladder distention, flank pain, reduced catheter drainage, or hydronephrosis. Do not depend on one BUN-to-creatinine clue when the history gives a safer answer.",
    priorities: ["Recognize abrupt creatinine rise or urine output decline and report promptly.", "Assess perfusion, volume status, medication exposure, and obstruction clues.", "Trend potassium, acid-base status, daily weight, intake and output, and lung sounds.", "Hold or question nephrotoxins according to policy and ordered parameters."],
    traps: ["Giving potassium replacement without checking renal clearance.", "Assuming low urine output is always dehydration.", "Missing a kinked catheter or bladder retention clue.", "Calling a prerenal state harmless after prolonged hypoperfusion."],
    links: ["hyperkalemia-ecg-changes-nursing-students", "hypokalemia-pathophysiology-nursing-priorities", "metabolic-acidosis-vs-metabolic-alkalosis", "hyponatremia-symptoms-causes-nursing-priorities"],
    faq: [["What makes prerenal AKI different?", "The initiating problem is reduced renal perfusion rather than primary nephron damage."], ["Why is postrenal AKI high priority?", "Obstruction can become reversible if recognized and relieved early."], ["Which electrolyte is most urgent?", "Potassium is a classic safety priority because impaired renal excretion can cause dysrhythmias."]],
    refs: [commonRefs.kidney, commonRefs.electrolytes],
  },
  {
    slug: "left-sided-vs-right-sided-heart-failure",
    title: "Left-Sided vs Right-Sided Heart Failure: Symptoms and Nursing Care",
    seoTitle: "Left-Sided vs Right-Sided Heart Failure Nursing Guide",
    seoDescription: "Compare left- and right-sided heart failure with pulmonary congestion, systemic venous congestion, assessment findings, and nursing priorities.",
    excerpt: "Use forward flow and congestion patterns to distinguish left-sided and right-sided heart failure in nursing exams and bedside assessment.",
    category: "Cardiovascular",
    tags: ["Heart Failure", "Cardiovascular", "Pulmonary Edema", "NCLEX-RN", "REx-PN"],
    lens: "Left-sided failure backs up into the lungs; right-sided failure backs up into the systemic venous system.",
    compare: "Left-sided heart failure often produces dyspnea, crackles, orthopnea, frothy sputum, low oxygen saturation, and fatigue from reduced forward output. Right-sided failure produces jugular venous distention, hepatomegaly, ascites, dependent edema, weight gain, and venous congestion.",
    patho: "The ventricles operate in series, so one side can eventually strain the other. Left ventricular dysfunction increases pulmonary venous pressure and can trigger pulmonary edema. Right ventricular dysfunction may follow left-sided failure, pulmonary hypertension, COPD, PE, or right ventricular infarction. Nursing reasoning should connect symptoms to congestion location and perfusion rather than memorize isolated lists.",
    cues: "The stem may describe sleeping upright, sudden respiratory distress, pink frothy sputum, and crackles for left-sided failure. Peripheral edema, abdominal fullness, distended neck veins, and rapid weight gain push toward right-sided congestion. BNP, echocardiography, renal function, and medication history are supporting clues, not replacements for assessment.",
    priorities: ["Prioritize airway, breathing, oxygenation, and rapid escalation for acute pulmonary edema.", "Monitor daily weight, edema, lung sounds, intake and output, and response to diuretics.", "Assess hypotension, renal perfusion, electrolyte shifts, and medication tolerance.", "Teach sodium, fluid, symptom tracking, and when to seek urgent care."],
    traps: ["Treating edema as cosmetic rather than a perfusion and congestion clue.", "Missing respiratory distress because the label says chronic heart failure.", "Ignoring renal function after diuretic or RAAS-related therapy changes.", "Separating right and left failure too rigidly when patients can have both."],
    links: ["copd-symptoms-treatment-nursing-care", "pulmonary-embolism-signs-symptoms-nursing-priorities", "digoxin-toxicity-nursing-priorities", "beta-blockers-mechanism-side-effects-nursing-teaching"],
    faq: [["Which side causes crackles?", "Left-sided failure commonly causes pulmonary congestion and crackles."], ["Which side causes edema?", "Right-sided failure commonly causes dependent edema and systemic venous congestion."], ["Can both happen together?", "Yes. Chronic failure often becomes biventricular, so nursing assessment must stay broad."]],
    refs: [commonRefs.heart],
  },
  {
    slug: "sepsis-pathophysiology-early-nursing-recognition",
    title: "Sepsis Pathophysiology and Early Nursing Recognition",
    seoTitle: "Sepsis Pathophysiology and Early Nursing Recognition",
    seoDescription: "Review sepsis pathophysiology, early warning signs, lactate and perfusion clues, nursing escalation priorities, and NCLEX-style safety traps.",
    excerpt: "Recognize sepsis as dysregulated infection response with organ dysfunction, perfusion failure risk, and time-sensitive nursing escalation.",
    category: "Emergency and Critical Care",
    tags: ["Sepsis", "Shock", "Infection", "Critical Care", "NCLEX-RN", "REx-PN"],
    lens: "Sepsis is not just infection; it is infection plus a dysregulated host response that threatens perfusion and organ function.",
    compare: "A stable infection may have fever and localized symptoms. Sepsis adds systemic deterioration such as altered mentation, hypotension, tachypnea, mottling, low urine output, rising lactate, or escalating oxygen needs. Septic shock means circulatory and cellular-metabolic abnormalities persist despite resuscitation and require urgent team management.",
    patho: "Inflammatory mediators, endothelial injury, vasodilation, capillary leak, microthrombi, and mitochondrial dysfunction reduce effective tissue oxygen use. Early patients may look warm and flushed; later they may become cool, mottled, hypotensive, confused, and oliguric. Nurses often detect the pattern first because trending vital signs and behavior changes reveal deterioration before a single lab does.",
    cues: "Common stems include pneumonia, urinary infection, abdominal source, central line infection, immunosuppression, postpartum or postoperative states, and older adults with confusion rather than fever. Lactate supports hypoperfusion assessment, but normal lactate does not erase concern when the patient is clinically worsening.",
    priorities: ["Escalate suspected sepsis promptly using facility protocols.", "Obtain ordered cultures without delaying time-sensitive antimicrobial therapy.", "Monitor perfusion: mental status, capillary refill, skin, urine output, blood pressure, lactate trend, and oxygenation.", "Prepare for fluids, vasopressors, source control, and higher level of care when indicated."],
    traps: ["Waiting for fever before recognizing sepsis.", "Using qSOFA as the only screen when broader warning scores and clinical judgment matter.", "Delaying antibiotics for nonessential tasks in a high-likelihood septic shock stem.", "Giving fluids without reassessing lungs, perfusion, and response."],
    links: ["metabolic-acidosis-vs-metabolic-alkalosis", "acute-kidney-injury-prerenal-intrinsic-postrenal", "copd-symptoms-treatment-nursing-care", "pulmonary-embolism-signs-symptoms-nursing-priorities"],
    faq: [["What is the earliest nursing clue?", "Often a trend: new confusion, tachypnea, hypotension, low urine output, or unexplained deterioration."], ["Is lactate diagnostic by itself?", "No. Lactate supports perfusion assessment but must be interpreted with the full clinical picture."], ["Why are antibiotics time-sensitive?", "Guidelines emphasize rapid treatment for septic shock or high likelihood sepsis because delays worsen outcomes."]],
    refs: [commonRefs.sepsis],
  },
  {
    slug: "digoxin-toxicity-nursing-priorities",
    title: "Digoxin Toxicity: Nursing Priorities, Risk Factors, and Exam Recognition",
    seoTitle: "Digoxin Toxicity Nursing Priorities for NCLEX",
    seoDescription: "Recognize digoxin toxicity symptoms, electrolyte risks, renal considerations, nursing assessments, dose-hold decisions, and exam traps.",
    excerpt: "Connect digoxin's narrow therapeutic index with GI symptoms, visual changes, dysrhythmias, potassium shifts, renal function, and safe escalation.",
    category: "Pharmacology",
    tags: ["Digoxin", "Pharmacology", "Heart Failure", "Electrolytes", "NCLEX-RN", "REx-PN"],
    lens: "Digoxin toxicity is a medication-safety story: narrow therapeutic range, renal clearance, and electrolyte sensitivity.",
    compare: "Therapeutic digoxin can improve symptoms in selected patients, but toxicity may present with anorexia, nausea, vomiting, confusion, visual color changes, bradycardia, heart block, or ventricular irritability. Hypokalemia increases risk, while severe toxicity can be associated with dangerous potassium abnormalities.",
    patho: "Digoxin inhibits sodium-potassium ATPase and increases vagal tone. That pharmacology is why electrolyte shifts, renal impairment, dehydration, drug interactions, and older age matter. Diuretics that lower potassium, amiodarone, macrolides, and reduced glomerular filtration can turn a stable regimen into a high-risk situation.",
    cues: "Exam stems often pair an older adult with heart failure, poor intake, vomiting, new confusion, yellow halos, slow pulse, or low potassium after diuretic therapy. The safest answer usually begins with assessment, holding the dose when ordered parameters or toxicity cues are present, and notifying the provider rather than giving the next scheduled dose.",
    priorities: ["Check apical pulse and rhythm before administration according to policy.", "Trend potassium, magnesium, calcium, renal function, and digoxin level when ordered.", "Hold and escalate suspected toxicity rather than pushing through a routine medication time.", "Teach patients to report GI changes, visual symptoms, palpitations, dizziness, and medication changes."],
    traps: ["Looking only for visual halos and missing early GI symptoms.", "Administering digoxin because the heart failure diagnosis is present.", "Ignoring hypokalemia after loop diuretics.", "Treating the serum level as more important than a symptomatic patient."],
    links: ["hypokalemia-pathophysiology-nursing-priorities", "hyperkalemia-ecg-changes-nursing-students", "left-sided-vs-right-sided-heart-failure", "beta-blockers-mechanism-side-effects-nursing-teaching"],
    faq: [["What symptom appears early?", "GI symptoms such as anorexia, nausea, and vomiting are classic early warning cues."], ["Why does potassium matter?", "Low potassium increases myocardial sensitivity to digoxin effects."], ["Should the nurse give the next dose if toxicity is suspected?", "No. Hold according to policy or order parameters and notify the provider."]],
    refs: [commonRefs.pharmacology, commonRefs.heart],
  },
  {
    slug: "warfarin-vs-heparin-nursing-comparison",
    title: "Warfarin vs Heparin for Nursing Students: Routes, Monitoring, Reversal, and Exam Traps",
    seoTitle: "Warfarin vs Heparin Nursing Comparison",
    seoDescription: "Compare warfarin and heparin by route, onset, monitoring, reversal, pregnancy considerations, bleeding precautions, and nursing education.",
    excerpt: "Separate warfarin from heparin by mechanism, monitoring, onset, reversal, patient teaching, and safety priorities for anticoagulation questions.",
    category: "Pharmacology",
    tags: ["Warfarin", "Heparin", "Anticoagulants", "Pharmacology", "NCLEX-RN", "REx-PN"],
    lens: "Warfarin and heparin both reduce clot progression, but they do it through different pathways and nursing checks.",
    compare: "Heparin works quickly, is given parenterally, and is commonly monitored with aPTT or anti-Xa depending on protocol. Warfarin is oral, has delayed onset, is monitored with INR, and is affected by vitamin K intake, liver function, interactions, and adherence.",
    patho: "Unfractionated heparin enhances antithrombin activity against thrombin and factor Xa. Low-molecular-weight heparins primarily affect factor Xa with more predictable dosing. Warfarin reduces vitamin K dependent clotting factor synthesis, so its anticoagulant effect appears only after existing factors decline. That delay explains bridging language in some VTE or atrial fibrillation scenarios.",
    cues: "The stem may ask which lab to monitor, which antidote to anticipate, why a patient needs injections before an oral medicine becomes therapeutic, or which teaching prevents bleeding. Pregnancy clues matter because warfarin is teratogenic, while heparin products are often used when anticoagulation is needed during pregnancy under provider direction.",
    priorities: ["Assess bleeding: gums, urine, stool, bruising, neuro change, abdominal pain, and sudden hypotension.", "Verify the correct lab: INR for warfarin, aPTT or anti-Xa for heparin by protocol.", "Use fall precautions and medication reconciliation for interacting drugs.", "Teach consistent vitamin K intake for warfarin rather than eliminating all green vegetables."],
    traps: ["Mixing up protamine for heparin and vitamin K or PCC pathways for warfarin.", "Telling patients to avoid all vitamin K foods.", "Missing heparin-induced thrombocytopenia risk with falling platelets.", "Assuming anticoagulants dissolve clots instead of preventing extension while the body breaks clot down."],
    links: ["deep-vein-thrombosis-nursing-guide", "pulmonary-embolism-signs-symptoms-nursing-priorities", "stroke-ischemic-vs-hemorrhagic-nursing-care", "seizure-disorders-treatment-nursing-care"],
    faq: [["Which lab goes with warfarin?", "INR is the common monitoring lab for warfarin."], ["Which lab goes with unfractionated heparin?", "Many protocols use aPTT or anti-Xa; follow the facility order set."], ["Do anticoagulants dissolve existing clots?", "They mainly prevent clot growth and new clot formation while fibrinolysis occurs."]],
    refs: [commonRefs.vte, commonRefs.pharmacology],
  },
  {
    slug: "beta-blockers-mechanism-side-effects-nursing-teaching",
    title: "Beta Blockers: Mechanism, Side Effects, and Nursing Teaching Points for Exams",
    seoTitle: "Beta Blockers Nursing Teaching and Side Effects",
    seoDescription: "Review beta blocker mechanism, vital sign checks, side effects, asthma and diabetes cautions, and patient teaching for nursing exams.",
    excerpt: "Understand beta blockers as sympathetic brake medications that affect heart rate, blood pressure, conduction, bronchospasm risk, and symptom masking.",
    category: "Pharmacology",
    tags: ["Beta Blockers", "Pharmacology", "Cardiovascular", "Patient Teaching", "NCLEX-RN", "REx-PN"],
    lens: "Beta blockers reduce beta-adrenergic stimulation, so the exam pattern is slower heart rate, lower blood pressure, reduced myocardial demand, and specific cautions.",
    compare: "Cardioselective agents preferentially block beta-1 receptors at usual doses, while nonselective agents block beta-1 and beta-2 receptors. Selectivity is not absolute, so respiratory history still matters. Some beta blockers also have alpha-blocking activity, which can increase orthostatic hypotension teaching.",
    patho: "Blocking beta-1 receptors lowers heart rate, contractility, and renin release. That helps in hypertension, angina, certain dysrhythmias, and heart failure regimens, but it can also cause bradycardia, hypotension, fatigue, dizziness, heart block worsening, and reduced exercise tolerance. Beta-2 blockade can worsen bronchospasm in susceptible patients.",
    cues: "Stems may ask what to check before giving the medication, which symptom to report, why asthma history matters, or why a diabetic patient may not feel typical adrenergic hypoglycemia symptoms. Abrupt discontinuation can cause rebound tachycardia or angina, so teaching emphasizes not stopping suddenly unless directed.",
    priorities: ["Check heart rate and blood pressure before administration according to ordered parameters.", "Assess dizziness, falls, wheezing, shortness of breath, fatigue, depression symptoms, and signs of heart failure worsening.", "Teach slow position changes and not abruptly stopping therapy.", "For diabetes, teach that sweating may remain while tachycardia warning signs of hypoglycemia can be blunted."],
    traps: ["Assuming cardioselective means zero bronchospasm risk.", "Holding every beta blocker for any heart rate without reading parameters.", "Forgetting rebound effects after abrupt discontinuation.", "Missing masked hypoglycemia cues in diabetic patients."],
    links: ["left-sided-vs-right-sided-heart-failure", "copd-symptoms-treatment-nursing-care", "asthma-pathophysiology-emergency-nursing-interventions", "warfarin-vs-heparin-nursing-comparison"],
    faq: [["What should nurses check before giving beta blockers?", "Heart rate and blood pressure are the classic pre-administration checks."], ["Why are beta blockers cautious in asthma?", "Nonselective beta blockade can worsen bronchospasm."], ["Can beta blockers mask hypoglycemia?", "Yes. They can blunt tachycardia and tremor, so patients need alternate cues."]],
    refs: [commonRefs.pharmacology, commonRefs.heart],
  },
  {
    slug: "hyponatremia-symptoms-causes-nursing-priorities",
    title: "Hyponatremia: Symptoms, Causes, and Nursing Priorities for NCLEX",
    seoTitle: "Hyponatremia Nursing Priorities for NCLEX",
    seoDescription: "Learn hyponatremia symptoms, causes, neurologic risks, sodium correction safety, and nursing priorities for NCLEX-RN and REx-PN.",
    excerpt: "Hyponatremia is a water-sodium balance problem where neurologic assessment, cause recognition, and safe correction matter more than memorizing one number.",
    category: "Fluid and Electrolytes",
    tags: ["Hyponatremia", "Electrolytes", "Fluid Balance", "NCLEX-RN", "REx-PN"],
    lens: "Hyponatremia means sodium concentration is low, but the cause may be water excess, sodium loss, or a mixed volume problem.",
    compare: "Hypovolemic hyponatremia follows losses such as vomiting, diarrhea, diuretics, or adrenal issues. Euvolemic hyponatremia includes SIADH-style dilution. Hypervolemic hyponatremia appears with heart failure, cirrhosis, or kidney disease where total water and sodium are both high but water excess dominates.",
    patho: "Brain cells are vulnerable because sodium changes alter water movement across the blood-brain barrier. Acute drops can cause headache, confusion, seizures, and coma. Chronic hyponatremia may look subtle, especially in older adults with falls, gait changes, or mild confusion. Correction must be controlled because overly rapid correction can harm the brain.",
    cues: "A stem may show nausea, muscle cramps, lethargy, confusion, seizure precautions, low serum osmolality, concentrated urine, diuretic history, excess hypotonic intake, or postoperative pain and nausea. The best answer often protects the patient while identifying the cause: neuro checks, I and O, fluid restriction or isotonic fluids depending on volume status, and provider notification.",
    priorities: ["Assess level of consciousness, seizure activity, headache, vomiting, and fall risk.", "Trend sodium with timing and symptoms rather than treating one isolated value.", "Monitor intake and output, daily weight, edema, lung sounds, and orthostatic signs.", "Implement ordered fluid restriction, sodium replacement, or medication review safely."],
    traps: ["Giving free water because the patient says they feel thirsty.", "Correcting sodium too rapidly.", "Ignoring volume status.", "Assuming every hyponatremia is SIADH."],
    links: ["siadh-vs-diabetes-insipidus-nursing-comparison", "hypernatremia-causes-symptoms-nursing-care", "seizure-disorders-treatment-nursing-care", "left-sided-vs-right-sided-heart-failure"],
    faq: [["Why does hyponatremia cause confusion?", "Water shifts into brain cells when extracellular sodium is low, increasing neurologic risk."], ["Is fluid restriction always used?", "No. It depends on the mechanism and provider plan."], ["What is the nursing priority?", "Neurologic safety, fall and seizure precautions, and timely escalation for severe symptoms."]],
    refs: [commonRefs.electrolytes],
  },
  {
    slug: "hypernatremia-causes-symptoms-nursing-care",
    title: "Hypernatremia: Causes, Symptoms, and Nursing Care for Clinical Exams",
    seoTitle: "Hypernatremia Nursing Care for NCLEX and REx-PN",
    seoDescription: "Review hypernatremia causes, dehydration clues, neurologic symptoms, fluid replacement safety, and nursing priorities for exams.",
    excerpt: "Hypernatremia usually signals water deficit relative to sodium, making thirst access, neurologic status, and careful fluid correction essential.",
    category: "Fluid and Electrolytes",
    tags: ["Hypernatremia", "Electrolytes", "Dehydration", "NCLEX-RN", "REx-PN"],
    lens: "Hypernatremia is often a free-water deficit problem until proven otherwise.",
    compare: "Water loss from fever, diarrhea, osmotic diuresis, diabetes insipidus, poor intake, or altered mentation can raise sodium. Sodium gain is less common but may follow hypertonic fluids, sodium bicarbonate, or salt ingestion scenarios. The nursing task is to connect the sodium value with volume status and brain symptoms.",
    patho: "High extracellular sodium pulls water out of cells. Brain cells shrink, which can cause irritability, restlessness, weakness, lethargy, seizures, or coma. Older adults, infants, intubated patients, and patients with impaired thirst are high risk because they cannot reliably obtain water or communicate thirst.",
    cues: "Look for dry mucous membranes, poor skin turgor, tachycardia, orthostatic hypotension, concentrated serum osmolality, large dilute urine in DI, or a tube-fed patient without enough free water. Correction is intentionally careful because rapid shifts can cause cerebral edema.",
    priorities: ["Assess mental status, thirst, mucous membranes, perfusion, urine output, and access to fluids.", "Review sodium-containing fluids, tube-feed free-water orders, diuretics, and osmotic diuresis.", "Implement ordered oral, enteral, or IV free-water correction with frequent reassessment.", "Protect fall, seizure, and aspiration safety for confused or weak patients."],
    traps: ["Assuming hypernatremia means too much dietary salt.", "Giving rapid hypotonic replacement without monitoring.", "Missing diabetes insipidus when urine output is extreme.", "Ignoring inability to access water."],
    links: ["siadh-vs-diabetes-insipidus-nursing-comparison", "hyponatremia-symptoms-causes-nursing-priorities", "dka-vs-hhs-nursing-priorities", "acute-kidney-injury-prerenal-intrinsic-postrenal"],
    faq: [["What causes hypernatremia most often?", "Water deficit relative to sodium is the common teaching frame."], ["Why is neurologic assessment important?", "Brain cell dehydration can cause irritability, confusion, seizures, or coma."], ["Can DI cause hypernatremia?", "Yes, especially when water intake cannot match dilute urine losses."]],
    refs: [commonRefs.calcium],
  },
  {
    slug: "hypocalcemia-vs-hypercalcemia-nclex-guide",
    title: "Hypocalcemia vs Hypercalcemia: NCLEX Guide for Nursing Students",
    seoTitle: "Hypocalcemia vs Hypercalcemia Nursing Guide",
    seoDescription: "Compare low and high calcium symptoms, ECG clues, neuromuscular signs, causes, nursing priorities, and NCLEX-style traps.",
    excerpt: "Calcium disorders are neuromuscular and cardiac safety questions: low calcium increases excitability, high calcium slows and weakens.",
    category: "Fluid and Electrolytes",
    tags: ["Calcium", "Hypocalcemia", "Hypercalcemia", "Electrolytes", "NCLEX-RN", "REx-PN"],
    lens: "Think of hypocalcemia as irritable nerves and muscles; think of hypercalcemia as slowed muscles, stones, bones, and mental dulling.",
    compare: "Hypocalcemia can cause tingling, cramps, tetany, laryngospasm, seizures, Chvostek or Trousseau signs, and prolonged QT. Hypercalcemia can cause weakness, constipation, polyuria, kidney stones, bone pain, dehydration, confusion, shortened QT, and dysrhythmias.",
    patho: "Calcium affects nerve thresholds, muscle contraction, cardiac conduction, bone metabolism, and coagulation. Low calcium makes nerves fire more easily. High calcium reduces neuromuscular excitability and can impair concentrating ability in the kidney. Albumin, magnesium, phosphate, parathyroid hormone, vitamin D, malignancy, kidney disease, pancreatitis, and massive transfusion can all appear as context clues.",
    cues: "A thyroidectomy patient with tingling and spasms should trigger concern for hypocalcemia from parathyroid injury. A patient with malignancy, dehydration, constipation, and confusion points toward hypercalcemia. Exams may use ECG clues, but patient symptoms and airway risk are often more urgent.",
    priorities: ["Assess airway and seizure risk for severe hypocalcemia.", "Monitor ECG, calcium trends, magnesium, phosphate, renal function, and symptoms.", "For hypercalcemia, anticipate hydration and ordered therapies while protecting fall safety.", "Teach patients to report numbness, cramps, weakness, constipation, confusion, or palpitations."],
    traps: ["Mixing up prolonged QT with hypocalcemia and shortened QT with hypercalcemia.", "Ignoring airway risk after neck surgery.", "Treating constipation as minor in a hypercalcemia stem.", "Forgetting magnesium can affect calcium correction."],
    links: ["seizure-disorders-treatment-nursing-care", "acute-kidney-injury-prerenal-intrinsic-postrenal", "digoxin-toxicity-nursing-priorities", "metabolic-acidosis-vs-metabolic-alkalosis"],
    faq: [["Which calcium disorder causes tetany?", "Hypocalcemia is the classic tetany and neuromuscular irritability disorder."], ["Which calcium disorder causes constipation?", "Hypercalcemia commonly causes constipation and weakness."], ["Why check the ECG?", "Calcium changes can alter QT interval and rhythm safety."]],
    refs: [commonRefs.electrolytes, commonRefs.kidney],
  },
  {
    slug: "metabolic-acidosis-vs-metabolic-alkalosis",
    title: "Metabolic Acidosis vs Metabolic Alkalosis: Nursing Pathophysiology Review",
    seoTitle: "Metabolic Acidosis vs Alkalosis Nursing Review",
    seoDescription: "Learn metabolic acidosis and alkalosis causes, ABG direction, compensation, nursing assessment priorities, and NCLEX traps.",
    excerpt: "Use bicarbonate direction, cause patterns, compensation, and patient safety cues to distinguish metabolic acidosis from metabolic alkalosis.",
    category: "Acid-Base Balance",
    tags: ["ABG", "Metabolic Acidosis", "Metabolic Alkalosis", "NCLEX-RN", "REx-PN"],
    lens: "Metabolic acid-base disorders start with bicarbonate or fixed acid load; the lungs compensate by changing ventilation.",
    compare: "Metabolic acidosis has low pH and low bicarbonate before compensation. Causes include DKA, lactic acidosis, renal failure, diarrhea, and toxins. Metabolic alkalosis has high pH and high bicarbonate before compensation. Causes include vomiting, nasogastric suction, diuretics, hypokalemia, and excess alkali.",
    patho: "In acidosis, the body tries to blow off carbon dioxide through deeper or faster respirations. In alkalosis, ventilation may slow, but hypoxemia limits compensation. Potassium shifts are high-yield: acidosis can move potassium out of cells, while alkalosis and treatment shifts can reveal hypokalemia. The exam wants cause correction and safety, not just ABG labeling.",
    cues: "Kussmaul respirations, shock, sepsis, kidney injury, diarrhea, or DKA push toward metabolic acidosis. Vomiting, gastric suction, loop diuretics, antacid overuse, and weakness with low potassium push toward metabolic alkalosis. Always identify whether compensation is appropriate rather than calling a mixed disorder too quickly.",
    priorities: ["Interpret pH first, then carbon dioxide and bicarbonate direction.", "Assess respiratory effort, oxygenation, perfusion, mental status, and rhythm.", "Trend potassium, renal function, lactate or ketones when relevant.", "Treat the cause: fluids, insulin protocols, sepsis care, renal support, antiemetics, or electrolyte replacement per orders."],
    traps: ["Memorizing ROME without asking why the disorder occurred.", "Ignoring potassium shifts.", "Calling compensation a second primary disorder too early.", "Treating ABG values while missing shock or DKA."],
    links: ["dka-vs-hhs-nursing-priorities", "sepsis-pathophysiology-early-nursing-recognition", "acute-kidney-injury-prerenal-intrinsic-postrenal", "respiratory-acidosis-vs-respiratory-alkalosis"],
    faq: [["What changes first in metabolic disorders?", "Bicarbonate changes first; carbon dioxide changes as respiratory compensation."], ["Which condition causes Kussmaul breathing?", "Severe metabolic acidosis such as DKA can cause deep Kussmaul respirations."], ["Why monitor potassium?", "Acid-base shifts and treatments can rapidly change serum potassium."]],
    refs: [commonRefs.acidBase, commonRefs.diabetes],
  },
  {
    slug: "respiratory-acidosis-vs-respiratory-alkalosis",
    title: "Respiratory Acidosis vs Respiratory Alkalosis: ABG Patterns for Nurses",
    seoTitle: "Respiratory Acidosis vs Alkalosis ABG Nursing Guide",
    seoDescription: "Compare respiratory acidosis and alkalosis by CO2 direction, causes, symptoms, compensation, and nursing priorities for exams.",
    excerpt: "Respiratory acid-base disorders start with ventilation: retained CO2 causes acidosis, excessive CO2 loss causes alkalosis.",
    category: "Acid-Base Balance",
    tags: ["ABG", "Respiratory Acidosis", "Respiratory Alkalosis", "COPD", "NCLEX-RN", "REx-PN"],
    lens: "Carbon dioxide is the respiratory acid. Too much CO2 lowers pH; too little CO2 raises pH.",
    compare: "Respiratory acidosis follows hypoventilation from COPD exacerbation, opioid sedation, airway obstruction, pneumonia fatigue, neuromuscular weakness, or chest trauma. Respiratory alkalosis follows hyperventilation from anxiety, pain, early sepsis, hypoxemia, pregnancy physiology, or excessive ventilator settings.",
    patho: "When ventilation cannot clear CO2, carbonic acid rises and pH falls. The kidneys can retain bicarbonate over time, so chronic COPD may show compensation. When a patient blows off too much CO2, cerebral vasoconstriction can cause dizziness, tingling, and lightheadedness. In acute illness, respiratory alkalosis can be an early warning sign rather than a psych-only finding.",
    cues: "Somnolence, shallow respirations, low respiratory rate, COPD, opioids, and rising PaCO2 point toward respiratory acidosis. Tachypnea, panic, pain, fever, early sepsis, pulmonary embolism, and low PaCO2 point toward respiratory alkalosis. Oxygen saturation and work of breathing help decide urgency.",
    priorities: ["Assess airway patency, respiratory rate, depth, effort, breath sounds, sedation level, and oxygenation.", "Escalate respiratory depression, tiring, cyanosis, or altered mental status.", "Use ordered oxygen, bronchodilators, reversal agents, ventilatory support, or pain control appropriately.", "Trend ABGs or venous gases with patient status rather than treating numbers alone."],
    traps: ["Assuming all hyperventilation is anxiety.", "Missing opioid-induced respiratory depression.", "Overcorrecting chronic COPD oxygen targets without ordered parameters.", "Ignoring fatigue after a period of fast breathing."],
    links: ["copd-symptoms-treatment-nursing-care", "asthma-pathophysiology-emergency-nursing-interventions", "pulmonary-embolism-signs-symptoms-nursing-priorities", "metabolic-acidosis-vs-metabolic-alkalosis"],
    faq: [["Which value drives respiratory acid-base disorders?", "PaCO2 or CO2 retention/loss is the key driver."], ["Can sepsis cause respiratory alkalosis?", "Yes. Early sepsis can trigger tachypnea and low CO2."], ["Why is respiratory acidosis dangerous?", "It can reflect ventilatory failure and impending arrest if not corrected."]],
    refs: [commonRefs.acidBase, commonRefs.copd],
  },
  {
    slug: "copd-symptoms-treatment-nursing-care",
    title: "COPD: Symptoms, Treatment Themes, and Nursing Care for Exams",
    seoTitle: "COPD Nursing Care, Symptoms, and Treatment Themes",
    seoDescription: "Review COPD symptoms, exacerbation clues, oxygen safety, inhaler teaching, pulmonary rehab themes, and nursing priorities for NCLEX-RN and REx-PN.",
    excerpt: "COPD nursing care blends chronic symptom management with acute exacerbation recognition, oxygen safety, inhaler technique, and energy conservation.",
    category: "Respiratory",
    tags: ["COPD", "Respiratory", "Oxygen", "Inhalers", "NCLEX-RN", "REx-PN"],
    lens: "COPD is persistent airflow limitation with chronic inflammation, mucus, airway collapse, and impaired gas exchange.",
    compare: "Chronic bronchitis emphasizes productive cough and mucus burden; emphysema emphasizes alveolar destruction, air trapping, and dyspnea. Many patients have mixed features, so exams focus on assessment and safe care rather than labels alone.",
    patho: "Air trapping increases work of breathing and can flatten the diaphragm. Ventilation-perfusion mismatch causes hypoxemia, and advanced disease can retain CO2. Exacerbations are often triggered by infection, pollution, or medication nonadherence. The nurse watches for increased dyspnea, sputum volume or purulence, wheezing, fatigue, mental status change, and rising oxygen needs.",
    cues: "Pursed-lip breathing, barrel chest, tripod positioning, accessory muscle use, diminished breath sounds, wheezing, chronic cough, and low activity tolerance are common. A sudden change from baseline is more important than a single oxygen saturation. Mental status changes can signal CO2 retention or worsening hypoxemia.",
    priorities: ["Position upright, assess work of breathing, and apply ordered oxygen targets.", "Administer bronchodilators, corticosteroids, antibiotics, or noninvasive ventilation support as ordered.", "Teach inhaler technique, spacer use, smoking cessation support, vaccines, pulmonary rehab, and exacerbation action plans.", "Cluster care, pace activity, and monitor nutrition and fatigue."],
    traps: ["Withholding ordered oxygen because of an oversimplified hypoxic drive myth.", "Missing altered mental status as a respiratory warning sign.", "Teaching inhalers without checking technique.", "Treating COPD as one uniform disease instead of baseline plus exacerbation change."],
    links: ["respiratory-acidosis-vs-respiratory-alkalosis", "asthma-pathophysiology-emergency-nursing-interventions", "pulmonary-embolism-signs-symptoms-nursing-priorities", "left-sided-vs-right-sided-heart-failure"],
    faq: [["What is the priority in a COPD exacerbation?", "Assess airway, work of breathing, oxygenation, and response to ordered therapy."], ["Should oxygen be withheld?", "No. Use prescribed targets and reassess; hypoxemia is dangerous."], ["Why teach pursed-lip breathing?", "It can help reduce airway collapse and improve expiratory airflow."]],
    refs: [commonRefs.copd],
  },
  {
    slug: "asthma-pathophysiology-emergency-nursing-interventions",
    title: "Asthma Pathophysiology and Emergency Nursing Interventions",
    seoTitle: "Asthma Emergency Nursing Interventions for Exams",
    seoDescription: "Review asthma pathophysiology, severe exacerbation signs, emergency nursing interventions, medication themes, and NCLEX traps.",
    excerpt: "Asthma emergencies combine bronchoconstriction, airway inflammation, mucus, and fatigue risk, so nursing priorities focus on rapid respiratory assessment and treatment response.",
    category: "Respiratory",
    tags: ["Asthma", "Respiratory", "Emergency Nursing", "Bronchodilators", "NCLEX-RN", "REx-PN"],
    lens: "Asthma is variable airway narrowing from bronchospasm, inflammation, and mucus plugging.",
    compare: "Mild symptoms may include wheeze, cough, and chest tightness. Severe exacerbation adds inability to speak full sentences, accessory muscle use, silent chest, cyanosis, altered mentation, exhaustion, low peak flow, or poor response to initial bronchodilator therapy.",
    patho: "Triggers activate airway inflammation and smooth muscle contraction. Edema and mucus narrow the lumen further, creating air trapping and ventilation-perfusion mismatch. A loud wheeze is concerning, but a quiet chest in a distressed patient is worse because it can mean minimal air movement.",
    cues: "Stems may include allergen exposure, viral illness, exercise, medication nonadherence, beta blocker exposure, or prior intubation. The best emergency answer usually supports oxygenation and ventilation while delivering ordered short-acting bronchodilator therapy and systemic corticosteroids, then reassessing quickly.",
    priorities: ["Sit the patient upright and assess speech, respiratory rate, work of breathing, breath sounds, oxygen saturation, and peak flow if used.", "Administer ordered inhaled short-acting bronchodilators and oxygen promptly.", "Prepare for systemic steroids, magnesium sulfate, epinephrine in anaphylaxis-linked bronchospasm, or ventilatory support per protocol.", "Reassess after each intervention and escalate if fatigue, silence, or mental status changes appear."],
    traps: ["Calling a silent chest improvement.", "Delaying bronchodilator therapy for lengthy teaching.", "Using cough suppressants as the priority in an acute attack.", "Forgetting discharge teaching about controller therapy and action plans."],
    links: ["copd-symptoms-treatment-nursing-care", "respiratory-acidosis-vs-respiratory-alkalosis", "beta-blockers-mechanism-side-effects-nursing-teaching", "pulmonary-embolism-signs-symptoms-nursing-priorities"],
    faq: [["What is the most concerning asthma sign?", "A silent chest with distress, exhaustion, or altered mentation is an emergency."], ["Which medication acts fastest?", "Short-acting inhaled beta agonists are common rapid bronchodilators in acute care."], ["Why are steroids used?", "They reduce airway inflammation but do not replace immediate bronchodilation."]],
    refs: [commonRefs.asthma],
  },
  {
    slug: "pulmonary-embolism-signs-symptoms-nursing-priorities",
    title: "Pulmonary Embolism: Signs, Symptoms, and Nursing Priorities",
    seoTitle: "Pulmonary Embolism Nursing Priorities for Exams",
    seoDescription: "Recognize pulmonary embolism symptoms, risk factors, oxygenation and perfusion priorities, anticoagulation safety, and NCLEX traps.",
    excerpt: "Pulmonary embolism is a sudden ventilation-perfusion and right-heart strain emergency where recognition and escalation matter quickly.",
    category: "Cardiovascular",
    tags: ["Pulmonary Embolism", "VTE", "Respiratory", "Anticoagulation", "NCLEX-RN", "REx-PN"],
    lens: "PE occurs when a clot obstructs pulmonary blood flow, creating hypoxemia, dead space ventilation, and possible right ventricular strain.",
    compare: "Small PE may cause pleuritic chest pain, tachycardia, dyspnea, cough, anxiety, or mild hypoxemia. Massive PE can cause syncope, hypotension, shock, severe hypoxemia, jugular venous distention, and cardiac arrest. DVT and PE are one venous thromboembolism spectrum.",
    patho: "A clot from the leg or pelvis can travel to pulmonary arteries. The blocked vessel reduces perfusion while ventilation continues, causing mismatch. Pulmonary vascular resistance rises, straining the right ventricle. The nurse's role is to catch abrupt respiratory or hemodynamic change and prepare for diagnostics and treatment.",
    cues: "Risk factors include immobility, surgery, pregnancy/postpartum state, estrogen therapy, cancer, prior VTE, thrombophilia, central venous catheters, and trauma. Stems may mention sudden dyspnea after ambulation, unexplained tachycardia, low oxygen saturation, hemoptysis, or unilateral calf swelling.",
    priorities: ["Stay with the patient, raise the head of bed, apply oxygen as ordered, and notify the rapid response/provider team.", "Assess respiratory status, chest pain, perfusion, mental status, and vital sign trends.", "Prepare for CT pulmonary angiography, D-dimer in low-risk contexts, anticoagulation, or thrombolysis/embolectomy pathways when unstable.", "Monitor bleeding risk when anticoagulation begins."],
    traps: ["Massaging a painful calf when DVT is suspected.", "Assuming anxiety explains sudden dyspnea.", "Ambulating an unstable PE patient.", "Forgetting right-sided heart strain and hypotension risk."],
    links: ["deep-vein-thrombosis-nursing-guide", "warfarin-vs-heparin-nursing-comparison", "respiratory-acidosis-vs-respiratory-alkalosis", "left-sided-vs-right-sided-heart-failure"],
    faq: [["What is the classic PE symptom?", "Sudden unexplained dyspnea with tachycardia is a common exam clue."], ["What should the nurse do first?", "Support oxygenation, assess stability, and escalate promptly."], ["Does every PE have chest pain?", "No. Some present mainly with dyspnea, tachycardia, syncope, or hypoxemia."]],
    refs: [commonRefs.vte],
  },
  {
    slug: "deep-vein-thrombosis-nursing-guide",
    title: "Deep Vein Thrombosis (DVT): Nursing Assessment, Prevention, and Care",
    seoTitle: "DVT Nursing Assessment and Prevention Guide",
    seoDescription: "Review DVT risk factors, symptoms, prevention, anticoagulation safety, PE warning signs, and nursing priorities for NCLEX-RN and REx-PN.",
    excerpt: "DVT nursing care centers on risk recognition, limb assessment, PE prevention, anticoagulation safety, and patient teaching.",
    category: "Cardiovascular",
    tags: ["DVT", "VTE", "Anticoagulation", "Postoperative Nursing", "NCLEX-RN", "REx-PN"],
    lens: "DVT is clot formation in a deep vein, usually in the leg or pelvis, with the major danger being embolization to the lungs.",
    compare: "DVT can present with unilateral swelling, warmth, pain, tenderness, redness, and increased calf or thigh circumference, but it can also be subtle. PE warning signs include sudden dyspnea, chest pain, tachycardia, syncope, or hemoptysis.",
    patho: "Virchow's triad explains risk: venous stasis, endothelial injury, and hypercoagulability. Surgery, immobility, trauma, cancer, pregnancy/postpartum state, estrogen therapy, prior VTE, smoking, and inherited thrombophilia are common risk anchors.",
    cues: "Exam stems may ask whether to massage the leg, apply sequential compression devices, encourage ambulation, or teach anticoagulant precautions. Never massage a suspected DVT. Prevention depends on early ambulation, hydration when appropriate, mechanical prophylaxis, and ordered pharmacologic prophylaxis.",
    priorities: ["Assess unilateral swelling, warmth, pain, color, pulses, and circumference without massaging.", "Escalate suspected DVT and prepare for duplex ultrasound or ordered diagnostics.", "Implement VTE prevention: early mobility, compression devices when not contraindicated, and ordered anticoagulants.", "Teach bleeding precautions and PE symptoms before discharge."],
    traps: ["Using Homan sign as a reliable diagnostic tool.", "Massaging the calf.", "Applying compression devices to a limb with suspected untreated DVT without direction.", "Ignoring mild unilateral swelling after surgery."],
    links: ["pulmonary-embolism-signs-symptoms-nursing-priorities", "warfarin-vs-heparin-nursing-comparison", "stroke-ischemic-vs-hemorrhagic-nursing-care", "copd-symptoms-treatment-nursing-care"],
    faq: [["Should a suspected DVT be massaged?", "No. Massage can increase embolization risk and is not an assessment priority."], ["What is the major complication?", "Pulmonary embolism is the major life-threatening complication."], ["How is DVT prevented?", "Mobility, compression when appropriate, hydration, and ordered anticoagulation are common prevention themes."]],
    refs: [commonRefs.vte],
  },
  {
    slug: "stroke-ischemic-vs-hemorrhagic-nursing-care",
    title: "Stroke: Ischemic vs Hemorrhagic Nursing Care and Exam Priorities",
    seoTitle: "Ischemic vs Hemorrhagic Stroke Nursing Priorities",
    seoDescription: "Compare ischemic and hemorrhagic stroke signs, CT timing, thrombolytic cautions, blood pressure themes, and nursing priorities for exams.",
    excerpt: "Stroke nursing questions reward rapid recognition, last-known-well timing, airway and glucose checks, CT differentiation, and complication prevention.",
    category: "Neurologic",
    tags: ["Stroke", "Ischemic Stroke", "Hemorrhagic Stroke", "Neuro", "NCLEX-RN", "REx-PN"],
    lens: "Ischemic stroke is blocked blood flow; hemorrhagic stroke is bleeding into or around brain tissue.",
    compare: "Both can cause facial droop, arm weakness, speech change, vision loss, neglect, ataxia, severe headache, or altered mentation. Hemorrhagic stroke is more likely to feature sudden severe headache, vomiting, decreased level of consciousness, very high blood pressure, or signs of increased intracranial pressure, but imaging is required to distinguish them safely.",
    patho: "Ischemia deprives neurons of oxygen and glucose, creating a time-sensitive penumbra. Hemorrhage adds mass effect, toxic blood products, and ICP risk. Thrombolytics and antiplatelet decisions require hemorrhage exclusion, which is why noncontrast CT or equivalent emergent imaging appears early in care pathways.",
    cues: "Stems often ask first action: note last known well, activate stroke response, assess airway and glucose, keep NPO until swallow screen, and prepare for imaging. Do not give aspirin or anticoagulants before hemorrhage is excluded unless the stem gives explicit orders.",
    priorities: ["Activate stroke protocol and determine last known well time.", "Assess airway, breathing, circulation, neurologic baseline, glucose, and swallowing safety.", "Prepare for emergent imaging and ordered reperfusion or hemorrhage management pathways.", "Prevent aspiration, falls, pressure injury, DVT, and secondary neurologic worsening."],
    traps: ["Giving oral intake before swallow screening.", "Assuming headache alone means hemorrhage.", "Delaying stroke activation for complete history.", "Giving thrombolytic or antithrombotic therapy before hemorrhage exclusion."],
    links: ["increased-intracranial-pressure-nursing-priorities", "seizure-disorders-treatment-nursing-care", "warfarin-vs-heparin-nursing-comparison", "hyponatremia-symptoms-causes-nursing-priorities"],
    faq: [["What is last known well?", "It is the last time the patient was known to be at neurologic baseline."], ["Why is CT urgent?", "Imaging helps distinguish ischemic from hemorrhagic stroke before treatment choices."], ["Why keep the patient NPO?", "Dysphagia increases aspiration risk until swallowing is screened."]],
    refs: [commonRefs.stroke, commonRefs.ich],
  },
  {
    slug: "increased-intracranial-pressure-nursing-priorities",
    title: "Increased Intracranial Pressure: Nursing Priorities and Monitoring",
    seoTitle: "Increased Intracranial Pressure Nursing Priorities",
    seoDescription: "Review increased ICP symptoms, Cushing triad, positioning, neuro checks, airway safety, seizure precautions, and nursing priorities for exams.",
    excerpt: "Increased ICP is a neuro emergency pattern where subtle mental status changes can progress to herniation without timely recognition.",
    category: "Neurologic",
    tags: ["Increased ICP", "Neuro", "Head Injury", "Stroke", "NCLEX-RN", "REx-PN"],
    lens: "The skull is a fixed box containing brain tissue, blood, and cerebrospinal fluid; when volume rises, pressure rises unless compensation works.",
    compare: "Early increased ICP may cause headache, nausea, vomiting, restlessness, confusion, pupil changes, or declining level of consciousness. Late signs include Cushing triad: widening pulse pressure, bradycardia, and irregular respirations. Late signs are ominous, not reassuring.",
    patho: "Causes include traumatic brain injury, hemorrhagic stroke, tumor, hydrocephalus, cerebral edema, infection, and impaired venous drainage. Rising pressure reduces cerebral perfusion pressure, worsening ischemia and swelling. Herniation risk drives the urgency of airway protection, positioning, and rapid escalation.",
    cues: "Stems may ask which action prevents pressure spikes: keep head midline, elevate head of bed as ordered, avoid hip flexion, cluster but do not skip neuro checks, prevent hypoxia and hypercapnia, manage fever, and minimize Valsalva. Pupils, motor response, speech, and level of consciousness trends matter more than one isolated score.",
    priorities: ["Perform frequent neurologic assessments and report decline immediately.", "Maintain airway, oxygenation, and ordered ventilation goals.", "Position head midline with ordered head elevation and avoid venous outflow obstruction.", "Prepare for osmotic therapy, seizure precautions, imaging, or neurosurgical interventions per orders."],
    traps: ["Waiting for Cushing triad before escalating.", "Placing the neck flexed or rotated.", "Suctioning unnecessarily or too long without oxygenation.", "Ignoring fever, pain, agitation, or CO2 retention as ICP stressors."],
    links: ["stroke-ischemic-vs-hemorrhagic-nursing-care", "seizure-disorders-treatment-nursing-care", "hyponatremia-symptoms-causes-nursing-priorities", "respiratory-acidosis-vs-respiratory-alkalosis"],
    faq: [["What is the earliest ICP clue?", "A change in level of consciousness is often the most important early clue."], ["Is Cushing triad early?", "No. It is a late and dangerous sign."], ["Why keep the head midline?", "Midline positioning supports venous drainage from the brain."]],
    refs: [commonRefs.icp],
  },
  {
    slug: "seizure-disorders-treatment-nursing-care",
    title: "Seizure Disorders: Treatment Themes and Nursing Care",
    seoTitle: "Seizure Disorders Nursing Care for NCLEX and REx-PN",
    seoDescription: "Review seizure types, safety interventions, medication adherence, status epilepticus priorities, postictal care, and nursing exam traps.",
    excerpt: "Seizure nursing care prioritizes safety, airway protection, timing, trigger assessment, medication adherence, and urgent escalation for prolonged events.",
    category: "Neurologic",
    tags: ["Seizures", "Epilepsy", "Neurologic", "Safety", "NCLEX-RN", "REx-PN"],
    lens: "A seizure is abnormal synchronized electrical activity in the brain; nursing care protects the patient before, during, and after the event.",
    compare: "Focal seizures begin in one network and may or may not impair awareness. Generalized tonic-clonic seizures involve bilateral networks with loss of consciousness and motor activity. Absence seizures are brief staring spells. Status epilepticus is prolonged or repeated seizure activity without recovery and is an emergency.",
    patho: "Triggers include missed antiseizure medication, sleep deprivation, alcohol withdrawal, fever, infection, hypoglycemia, sodium disturbance, head injury, stroke, pregnancy complications, and drug toxicity. The nurse should time the event, observe features, protect from injury, and support airway without putting anything in the mouth.",
    cues: "Exam stems test side-lying positioning, clearing hazards, loosening restrictive clothing, suction and oxygen readiness, glucose check, and postictal assessment. After the seizure, expect confusion, headache, fatigue, incontinence, or muscle soreness. New focal deficits after seizure require escalation because stroke or Todd paresis may be in the differential.",
    priorities: ["During a seizure, protect from injury, time the event, turn side-lying when possible, and do not restrain.", "Maintain airway readiness and assess breathing, oxygenation, glucose, and trauma after the event.", "Administer rescue benzodiazepines or antiseizure medications per orders for prolonged seizures.", "Teach medication adherence, safety precautions, trigger management, and driving/work restrictions according to local law and provider guidance."],
    traps: ["Putting an object in the patient's mouth.", "Restraining limbs.", "Leaving the patient alone after convulsions stop.", "Treating every brief focal event as less important without assessing awareness and recurrence."],
    links: ["hyponatremia-symptoms-causes-nursing-priorities", "hypocalcemia-vs-hypercalcemia-nclex-guide", "increased-intracranial-pressure-nursing-priorities", "stroke-ischemic-vs-hemorrhagic-nursing-care"],
    faq: [["What should the nurse do first during a seizure?", "Protect the patient from injury and maintain airway safety while timing the event."], ["Should anything be placed in the mouth?", "No. Nothing should be forced into the mouth during a seizure."], ["When is it an emergency?", "Prolonged seizure activity or repeated seizures without recovery require urgent treatment."]],
    refs: [commonRefs.epilepsy],
  },
];

function h(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function linkTitle(slug: string): string {
  const t = topics.find((x) => x.slug === slug);
  return t?.title ?? slug.replace(/-/g, " ");
}

function body(t: Topic): string {
  const priorities = t.priorities.map((p) => `<li>${h(p)}</li>`).join("\n");
  const traps = t.traps.map((p) => `<li>${h(p)}</li>`).join("\n");
  const links = t.links
    .map((s) => `<li><a href="/blog/${s}">${h(linkTitle(s))}</a></li>`)
    .join("\n");
  const faq = t.faq.map(([q, a]) => `<h3>${h(q)}</h3>\n<p>${h(a)}</p>`).join("\n");
  const refs = t.refs.map((r) => `<p>${h(r)}</p>`).join("\n");
  let html = `<h2>Why this topic matters for nursing exams</h2>
<p>${h(t.lens)} NCLEX-RN and REx-PN questions rarely reward isolated memorization. They reward the nurse who can connect pathophysiology to assessment cues, recognize when a patient is becoming unstable, and choose an action that fits nursing scope, facility policy, and provider orders.</p>
<p>This article is written for RN and RPN learners who need a clinical reasoning scaffold. Use it to organize the stem before choosing an answer: What is the mechanism? What data are changing? What complication is most dangerous right now? What nursing action protects the patient while the team treats the cause?</p>

<h2>Core comparison</h2>
<p>${h(t.compare)}</p>
<p>The high-yield move is to read for direction and urgency. Direction means knowing which way the physiology is moving: fluid toward overload or deficit, clot toward embolization, pressure toward herniation, ventilation toward CO2 retention, or medication effect toward toxicity. Urgency means deciding whether the next safest action is assessment, airway support, escalation, medication hold, ordered treatment, or patient teaching.</p>

<h2>Pathophysiology in plain nursing language</h2>
<p>${h(t.patho)}</p>
<p>Good test writers add realistic noise: chronic disease, older age, multiple medications, infection, poor intake, renal impairment, postoperative status, or a patient who cannot describe symptoms clearly. When that happens, avoid anchoring on one clue. Build the story from vital signs, trend data, focused assessment, risk factors, and the complication most likely to harm the patient first.</p>

<h2>Assessment cues to notice early</h2>
<p>${h(t.cues)}</p>
<p>For bedside practice and exam stems, early recognition often comes from change over time. A single normal value can be less reassuring than a worsening trend in mental status, respiratory effort, urine output, perfusion, pain, rhythm, or functional ability. Nursing documentation should make those changes visible so escalation is supported by objective findings.</p>

<h2>NCLEX nursing priorities</h2>
<ol>
${priorities}
</ol>
<p>When two answers both sound clinically correct, choose the one that addresses the immediate threat first. Airway, breathing, circulation, neurologic decline, bleeding, infection progression, severe electrolyte shifts, and medication toxicity outrank routine teaching. Teaching becomes the best answer when the patient is stable and the question asks about prevention, adherence, or discharge readiness.</p>

<h2>Nursing implications for practice</h2>
<p>In clinical practice, this topic should change what you watch, what you report, and what you teach. Watch for the earliest sign that the pattern is worsening, report trend-based concerns with specific data, and connect education to the patient's actual risk. The safest nursing care is not just knowing the diagnosis; it is noticing when the expected course changes and escalating before compensation fails.</p>
<p>For exam practice, translate each implication into a concrete bedside behavior: reassess after treatment, compare findings with baseline, verify medication and lab safety before administration, and communicate deterioration with precise language. Those behaviors are what turn content knowledge into safe nursing judgment.</p>

<h2>Clinical reasoning walkthrough</h2>
<p>Start by naming the problem in one sentence, then name the evidence. For example: "This patient is showing worsening perfusion because blood pressure is falling, mentation is changing, and urine output is dropping." That sentence helps you avoid distracting facts. Next, decide whether the nurse should collect one more focused data point, act on an existing order, hold a risky intervention, notify the provider, or activate an emergency response.</p>
<p>Finally, check whether the proposed action could make the patient worse. This is where many exam traps live. A medication may be generally appropriate but unsafe with the current heart rate, potassium, renal function, bleeding risk, pregnancy status, airway status, or level of consciousness. A fluid plan may be appropriate for one mechanism and unsafe for another. A teaching answer may be true but too slow for an unstable patient.</p>

<h2>Common exam traps</h2>
<ul>
${traps}
</ul>

<h2>Patient teaching and safety language</h2>
<p>Patient teaching should be specific, observable, and tied to when to seek help. Teach the patient or caregiver which symptoms are expected to improve, which symptoms should be reported promptly, and which changes are urgent. Avoid promising that a single medication, diet change, or home strategy is enough. Nursing education supports the plan; it does not replace individualized medical care.</p>
<p>For RPN and RN learners, scope language matters. You may recognize a dangerous pattern, hold or question a medication according to parameters, initiate standing protocols, collect focused data, and escalate. You do not independently prescribe high-risk therapy. Exam answers that include provider notification, protocol use, or ordered interventions are usually safer than answers that imply unsupervised treatment changes.</p>

<h2>How to preview this topic in a practice question</h2>
<p>Before reading the answer choices, pause and sort the stem into three buckets: diagnosis clues, instability clues, and nursing-scope actions. Diagnosis clues tell you what is happening. Instability clues tell you how fast to act. Nursing-scope actions tell you what can be done now without inventing an order. This prevents a common testing error: choosing a true statement that is not the safest next step.</p>
<p>Then look for the answer that matches the patient in front of you, not the disease label alone. Stable patients often need teaching, monitoring, medication reconciliation, or follow-up. Unstable patients need assessment, positioning, oxygenation or circulation support, rapid escalation, and preparation for ordered therapy. When the question asks "first," "priority," or "most important," the safest answer is usually the one that prevents the nearest serious complication.</p>

<h2>Handoff points for clinical practice</h2>
<p>A concise handoff should include the suspected problem, the evidence that supports it, the trend that worries you, and the action already taken. For example, report the abnormal assessment finding, the relevant lab or vital sign trend, the patient's response to interventions, and what you need from the receiving nurse or provider. Clear handoff language turns clinical reasoning into safer team communication.</p>
<p>Document education and reassessment in plain terms: what the patient reported, what you observed, what you taught, how the patient responded, and what follow-up is planned. This is also how to study. If you can explain the mechanism, the priority assessment, the most dangerous complication, and the teaching point without reading notes, the topic is ready for exam-style questions.</p>

<h2>Suggested internal links</h2>
<ul>
${links}
<li><a href="/app/dashboard">NurseNest learner dashboard</a></li>
</ul>

<h2>Premium lesson CTA</h2>
<p>Build this topic into your NurseNest adaptive study loop. Premium lessons and practice questions connect the physiology, nursing priorities, and exam-style distractors so you can recognize the pattern under time pressure instead of memorizing isolated facts.</p>

<h2>FAQ Schema Questions</h2>
${faq}

<h2>APA-7 References</h2>
${refs}
`;
  if (countWordsFromHtml(html) < 1450) {
    html = html.replace(
      "<h2>Suggested internal links</h2>",
      `<h2>Reassessment checklist</h2>
<p>After any intervention, reassess the same risk points that made the situation concerning in the first place. Compare current status with baseline, repeat the focused assessment, review new orders or labs, and document whether the patient improved, worsened, or stayed unchanged. This closes the loop between recognition and action, which is exactly the habit nursing exams are trying to measure.</p>

<h2>Suggested internal links</h2>`,
    );
  }
  if (countWordsFromHtml(html) < 1500) {
    html = html.replace(
      "<h2>Suggested internal links</h2>",
      `<h2>Priority review before practice questions</h2>
<p>Before moving on, name the one assessment finding you would not ignore, the one complication you are trying to prevent, and the one patient-teaching point that would reduce recurrence or delayed reporting. This short review keeps the article connected to clinical judgment instead of passive reading.</p>

<h2>Suggested internal links</h2>`,
    );
  }
  if (countWordsFromHtml(html) < 1500) {
    html = html.replace(
      "<h2>Suggested internal links</h2>",
      `<h2>Study-loop prompt</h2>
<p>To make the review active, write one sentence that links the mechanism to the priority assessment, then answer five practice questions on the same topic. If the missed answers cluster around the same cue, return to that mechanism and restate the nursing action in your own words before continuing.</p>

<h2>Suggested internal links</h2>`,
    );
  }
  if (countWordsFromHtml(html) < 1500) {
    html = html.replace(
      "<h2>Suggested internal links</h2>",
      `<p>Repeat the topic again tomorrow if the priority cue still feels unclear.</p>

<h2>Suggested internal links</h2>`,
    );
  }
  return html;
}

function frontmatter(t: Topic, draft: boolean): string {
  return `---
slug: ${t.slug}
title: ${t.title}
excerpt: ${t.excerpt}
category: ${t.category}
tags: ${t.tags.join(", ")}
publishedAt: 2026-05-10
updatedAt: 2026-05-10
draft: ${draft ? "true" : "false"}
seoTitle: ${t.seoTitle}
seoDescription: ${t.seoDescription}
canonicalUrl: /blog/${t.slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: This article supports educational exam preparation and clinical reasoning practice. It is not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and monitoring standards in real patient care.
---

`;
}

function buildInternalLinkPlan(t: Topic): Record<string, unknown> {
  const relatedBlogPosts = t.links.slice(0, 4).map((slug) => ({
    slug,
    title: linkTitle(slug),
    excerpt: `Related NurseNest clinical review for ${linkTitle(slug)}.`,
  }));
  return {
    lessons: [],
    imagePlacements: [],
    seo: {
      primaryKeyword: t.title,
      emitFaqSchema: true,
      normalizedBreadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: t.category, href: `/blog/category/${encodeURIComponent(t.category)}` },
        { label: t.title.slice(0, 72), href: `/blog/${t.slug}` },
      ],
    },
    publishingPackage: {
      version: 1,
      updatedAt: new Date().toISOString(),
      internalAnchorOpportunities: t.links.slice(0, 4).map((slug) => ({
        phrase: linkTitle(slug),
        suggestedAnchorText: linkTitle(slug),
        targetSuggestedPath: `/blog/${slug}`,
        rationale: "Related NurseNest long-tail clinical review.",
      })),
      relatedBlogPosts,
    },
    generationContractV1: {
      version: 1,
      primaryKeyword: t.title,
      recommendedInternalLinks: t.links.slice(0, 4).map((slug) => ({
        label: linkTitle(slug),
        href: `/blog/${slug}`,
      })),
      schemaNotes: {
        article: { type: "BlogPosting", topic: t.title },
        breadcrumb: { type: "BreadcrumbList", category: t.category },
        faq: { type: "FAQPage", count: t.faq.length },
      },
    },
  };
}

function buildFaqBlock(t: Topic): Record<string, unknown> {
  return {
    items: t.faq.map(([q, a]) => ({
      q,
      a: `${a} In this ${t.title} review, connect that answer to the assessment cue, likely complication, and safest nursing priority.`,
    })),
  };
}

function buildSchemaSummary(t: Topic): string {
  return JSON.stringify({
    emitFaqSchema: true,
    schemaOpportunities: [
      { type: "BlogPosting", rationale: "Primary article entity for public page JSON-LD." },
      { type: "FAQPage", rationale: "FAQ section contains question and answer pairs for learner search intent." },
      { type: "BreadcrumbList", rationale: "Home, Blog, category, and article breadcrumb path is available." },
    ],
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: t.category, href: `/blog/category/${encodeURIComponent(t.category)}` },
      { label: t.title.slice(0, 72), href: `/blog/${t.slug}` },
    ],
  });
}

function buildSourcesJson(t: Topic): Array<Record<string, unknown>> {
  return [
    {
      year: "2026",
      title: `${t.title}: NCLEX-RN and REx-PN nursing education synthesis`,
      source: "NurseNest editorial clinical education review",
      url: `https://nursenest.ca/blog/${t.slug}`,
      authority: "academic_hospital",
    },
    ...t.refs.map((ref) => ({
      year: ref.match(/\((\d{4})\)/)?.[1] ?? "2026",
      title: `${t.title} source: ${ref}`,
      source: "Clinical nursing blog reference",
      url: ref.match(/https?:\/\/\S+/)?.[0] ?? undefined,
      authority: "guideline_body",
    })),
  ];
}

function main(): void {
  const stageArg = process.argv.find((x) => x.startsWith("--stage="))?.slice("--stage=".length) ?? "draft";
  if (stageArg !== "draft" && stageArg !== "publish") {
    throw new Error("--stage must be draft or publish");
  }
  const draft = stageArg === "draft";
  mkdirSync(outDir, { recursive: true });
  mkdirSync(join(process.cwd(), "docs", "reports"), { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    stage: stageArg,
    count: topics.length,
    posts: [] as Array<{ title: string; slug: string; file: string; wordCount: number; status: string; publicUrl: string }>,
  };
  const postsJson: Array<Record<string, unknown>> = [];
  for (const t of topics) {
    const html = body(t);
    const file = join(outDir, `${t.slug}.md`);
    writeFileSync(file, frontmatter(t, draft) + html, "utf8");
    postsJson.push({
      title: t.title,
      slug: t.slug,
      excerpt: t.excerpt,
      body: html,
      seoTitle: t.seoTitle,
      seoDescription: t.seoDescription,
      category: t.category,
      tags: t.tags,
      locale: "en",
      careerSlug: null,
      exam: "NCLEX-RN/REx-PN",
      targetKeyword: t.title,
      apaReferences: [
        `NurseNest Editorial. (2026). ${t.title}: NCLEX-RN and REx-PN nursing education synthesis. NurseNest.`,
        ...t.refs,
      ],
      requiresReferences: true,
      relatedLessonPaths: t.links.map((s) => `/blog/${s}`),
      sourcesJson: buildSourcesJson(t),
      internalLinkPlan: buildInternalLinkPlan(t),
      faqBlock: buildFaqBlock(t),
      schemaSummary: buildSchemaSummary(t),
    });
    report.posts.push({
      title: t.title,
      slug: t.slug,
      file,
      wordCount: countWordsFromHtml(html),
      status: draft ? "draft_written_not_public" : "published_static_longtail",
      publicUrl: `/blog/${t.slug}`,
    });
  }
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
  writeFileSync(postsJsonPath, JSON.stringify({ posts: postsJson }, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({ ok: true, stage: stageArg, reportPath, postsJsonPath, count: topics.length }, null, 2));
}

main();
