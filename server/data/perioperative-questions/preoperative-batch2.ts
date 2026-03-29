import type { PerioperativeQuestion } from "./types";

export const preoperativeBatch2Questions: PerioperativeQuestion[] = [
  {
    stem: "A 58-year-old patient with chronic obstructive pulmonary disease (COPD) is scheduled for a right upper lobectomy. Preoperative pulmonary function tests show FEV1 of 1.2 L (45% predicted). The predicted postoperative FEV1 (ppoFEV1) is calculated at 33% predicted. What should the perioperative nurse anticipate regarding surgical candidacy?",
    options: [
      "The patient is an excellent surgical candidate with minimal pulmonary risk",
      "The ppoFEV1 of 33% is borderline — additional exercise testing (cardiopulmonary exercise test) may be needed to determine if the patient can tolerate the lobectomy",
      "The patient should be immediately scheduled for the lobectomy since FEV1 values have no bearing on surgical risk",
      "The patient requires a pneumonectomy instead of a lobectomy to maximize remaining lung function"
    ],
    correctAnswer: 1,
    rationaleLong: "Predicted postoperative FEV1 (ppoFEV1) is a critical metric in determining surgical candidacy for lung resection. The calculation estimates what the patient's pulmonary function will be after the planned resection. Guidelines generally classify risk as follows: ppoFEV1 >60% predicted = low risk, suitable for surgery; ppoFEV1 40-60% = moderate risk, usually acceptable; ppoFEV1 <40% = high risk, requires additional evaluation; ppoFEV1 <30% = very high risk, surgery generally contraindicated without further testing. A ppoFEV1 of 33% falls in the high-risk zone where additional evaluation is warranted. The cardiopulmonary exercise test (CPET), specifically measurement of peak oxygen consumption (VO2max), provides additional functional data. A VO2max >15 mL/kg/min generally indicates the patient can tolerate the surgery; VO2max 10-15 mL/kg/min is borderline; VO2max <10 mL/kg/min suggests prohibitive risk. Other assessment tools include the shuttle walk test and stair climbing test. The perioperative nurse should understand these parameters to anticipate the preoperative workup, counsel patients about risks, and prepare for the possibility of prolonged ventilatory support postoperatively. Patients with borderline pulmonary function who undergo lung resection need intensive postoperative pulmonary care including aggressive pulmonary toilet, early mobilization, and close monitoring for respiratory failure.",
    learningObjective: "Interpret predicted postoperative FEV1 values to assess surgical candidacy for lung resection procedures",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "pulmonary assessment",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ppoFEV1 <40% = high risk requiring additional testing (CPET). ppoFEV1 <30% = generally contraindicated. Know the thresholds.",
    clinicalPearls: [
      "ppoFEV1: >60% low risk, 40-60% moderate, <40% high risk (needs CPET), <30% very high risk",
      "CPET VO2max: >15 acceptable, 10-15 borderline, <10 prohibitive for lung resection",
      "Shuttle walk test and stair climbing are alternative functional assessments"
    ],
    safetyNote: "Patients with marginal pulmonary function require intensive postoperative pulmonary care and close monitoring for respiratory failure",
    distractorRationales: [
      "ppoFEV1 of 33% is not excellent — it is in the high-risk range requiring additional evaluation",
      "FEV1 and ppoFEV1 are critical determinants of surgical risk for lung resection",
      "Pneumonectomy removes more lung tissue and would further reduce ppoFEV1"
    ]
  },
  {
    stem: "A preoperative nurse is assessing a 72-year-old patient scheduled for a total hip arthroplasty. The patient's serum albumin level is 2.8 g/dL (normal 3.5-5.0 g/dL). Why is this finding significant for perioperative planning?",
    options: [
      "Low albumin has no clinical significance in the perioperative setting",
      "Hypoalbuminemia indicates malnutrition and is associated with increased risk of wound dehiscence, surgical site infection, poor wound healing, and increased morbidity and mortality",
      "Low albumin indicates the patient needs more IV fluids during surgery",
      "Albumin of 2.8 g/dL is within normal range for elderly patients"
    ],
    correctAnswer: 1,
    rationaleLong: "Serum albumin is one of the most reliable and widely studied biomarkers of nutritional status and is a strong independent predictor of perioperative morbidity and mortality. An albumin level below 3.5 g/dL indicates protein malnutrition, and levels below 3.0 g/dL are associated with significantly increased surgical risk. Hypoalbuminemia in the preoperative setting is linked to: (1) Impaired wound healing — albumin is essential for collagen synthesis, fibroblast proliferation, and tissue repair; (2) Increased surgical site infection (SSI) risk — malnutrition impairs immune function, including neutrophil and macrophage activity; (3) Wound dehiscence — poor tissue integrity due to protein deficiency; (4) Increased postoperative complications — including pneumonia, urinary tract infection, and venous thromboembolism; (5) Prolonged hospital length of stay; (6) Increased 30-day mortality — the National Surgical Quality Improvement Program (NSQIP) data consistently shows albumin <3.5 g/dL as the single strongest predictor of surgical morbidity and 30-day mortality. For elective procedures, optimization of nutritional status with high-protein oral supplements or enteral nutrition for 7-14 days before surgery can improve outcomes. The perioperative nurse should communicate hypoalbuminemia to the surgical team and advocate for nutritional optimization before elective surgery when feasible.",
    learningObjective: "Recognize hypoalbuminemia as a predictor of perioperative complications and advocate for nutritional optimization before elective surgery",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "nutritional assessment",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Albumin <3.5 g/dL is the single strongest predictor of surgical morbidity and 30-day mortality per NSQIP data.",
    clinicalPearls: [
      "Albumin <3.5 g/dL = malnutrition; <3.0 g/dL = significantly increased surgical risk",
      "Hypoalbuminemia increases SSI, dehiscence, pneumonia, and 30-day mortality risk",
      "Nutritional optimization with protein supplements for 7-14 days preoperatively improves outcomes"
    ],
    safetyNote: "Communicate hypoalbuminemia to the surgical team — for elective procedures, consider delaying surgery for nutritional optimization",
    distractorRationales: [
      "Low albumin is clinically significant and directly impacts surgical outcomes",
      "Hypoalbuminemia reflects nutritional status, not simply hydration needs",
      "Albumin of 2.8 g/dL is below normal for all age groups — it does not represent normal aging"
    ]
  },
  {
    stem: "During the preoperative assessment, a patient scheduled for a total knee arthroplasty reports taking clopidogrel (Plavix) 75 mg daily for a drug-eluting coronary stent placed 4 months ago. Current guidelines recommend what approach to clopidogrel management?",
    options: [
      "Discontinue clopidogrel immediately regardless of the time since stent placement",
      "Continue clopidogrel through surgery since it has minimal bleeding risk",
      "Consult with the patient's cardiologist, as drug-eluting stents typically require a minimum of 6-12 months of dual antiplatelet therapy and premature discontinuation risks catastrophic stent thrombosis",
      "Switch from clopidogrel to warfarin 5 days before surgery"
    ],
    correctAnswer: 2,
    rationaleLong: "Drug-eluting stents (DES) require a minimum period of dual antiplatelet therapy (DAPT — typically aspirin plus a P2Y12 inhibitor such as clopidogrel) to prevent stent thrombosis. Current ACC/AHA guidelines recommend a minimum of 6 months of DAPT after DES implantation (some older guidelines recommended 12 months, and newer studies suggest shorter durations may be acceptable in low-risk patients). This patient is only 4 months post-DES placement, which is within the critical period where premature discontinuation of clopidogrel carries a significant risk of stent thrombosis — an acute event where the stent occludes with thrombus, causing myocardial infarction with a mortality rate of 20-40%. Elective surgery should ideally be postponed until the minimum DAPT period is complete. If the surgery cannot be postponed, a multidisciplinary discussion between the surgeon, cardiologist, and anesthesiologist is essential. Options may include: proceeding with clopidogrel continued (accepting increased surgical bleeding), briefly discontinuing clopidogrel while continuing aspirin (lower risk but not zero), or bridging with a short-acting IV antiplatelet agent. The perioperative nurse's role is to identify this medication concern and facilitate the necessary cardiology consultation before proceeding.",
    learningObjective: "Understand the critical importance of dual antiplatelet therapy duration after drug-eluting stent placement and its implications for perioperative management",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "antiplatelet management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "DES requires minimum 6-12 months DAPT. Premature clopidogrel discontinuation causes stent thrombosis with 20-40% mortality. Elective surgery should be delayed.",
    clinicalPearls: [
      "DES: minimum 6 months DAPT (aspirin + P2Y12 inhibitor); premature discontinuation risks stent thrombosis",
      "Stent thrombosis mortality: 20-40% — elective surgery should be postponed during the critical DAPT period",
      "Multidisciplinary consultation (surgeon, cardiologist, anesthesiologist) is required before discontinuing DAPT"
    ],
    safetyNote: "Never discontinue clopidogrel after recent DES placement without cardiology consultation — the stent thrombosis risk is life-threatening",
    distractorRationales: [
      "Discontinuing clopidogrel at 4 months post-DES risks catastrophic stent thrombosis",
      "Clopidogrel significantly increases surgical bleeding — stating it has minimal risk is incorrect",
      "Warfarin is not a substitute for antiplatelet therapy in stent management"
    ]
  },
  {
    stem: "A preoperative nurse is performing a preoperative assessment on a 45-year-old female scheduled for a laparoscopic hysterectomy. The patient reports a history of deep vein thrombosis (DVT) 6 months ago that was treated with rivaroxaban. She completed 3 months of therapy and is no longer taking anticoagulation. What is the nursing priority regarding VTE prophylaxis?",
    options: [
      "No VTE prophylaxis is needed since the prior DVT was treated and resolved",
      "Communicate the prior DVT history to the surgical team and ensure an individualized VTE prophylaxis plan is in place, as this patient is at elevated risk for recurrent VTE",
      "Resume rivaroxaban 1 week before surgery for prophylaxis",
      "Apply sequential compression devices only after surgery, not before"
    ],
    correctAnswer: 1,
    rationaleLong: "A history of prior VTE (DVT or pulmonary embolism) is one of the strongest risk factors for perioperative venous thromboembolism. Surgical patients with a prior VTE history have a significantly higher recurrence risk compared to patients without VTE history. The Caprini Risk Assessment Model, which is the most widely used tool for surgical VTE risk stratification, assigns significant points for prior VTE, making these patients high-risk regardless of other factors. The perioperative nurse should: (1) Communicate the prior DVT history prominently in the preoperative documentation and verbally to the surgical and anesthesia teams; (2) Ensure an individualized VTE prophylaxis plan is developed — high-risk patients typically require both mechanical prophylaxis (sequential compression devices or SCDs, applied preoperatively and continued postoperatively until fully ambulatory) AND pharmacologic prophylaxis (low-molecular-weight heparin, unfractionated heparin, or fondaparinux — initiated at an appropriate time relative to the surgery and neuraxial anesthesia if applicable); (3) Advocate for early postoperative mobilization; (4) Monitor for signs and symptoms of recurrent VTE postoperatively (leg swelling, calf tenderness, dyspnea, tachycardia). Extended pharmacologic prophylaxis beyond hospitalization (up to 30 days) may be indicated for high-risk patients undergoing major surgery.",
    learningObjective: "Identify prior VTE as a significant risk factor for perioperative VTE recurrence and ensure appropriate prophylaxis planning",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "VTE risk assessment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Prior VTE history is one of the STRONGEST risk factors for perioperative VTE recurrence. These patients require both mechanical AND pharmacologic prophylaxis.",
    clinicalPearls: [
      "Prior VTE is a strong risk factor for perioperative recurrence — warrants aggressive prophylaxis",
      "High-risk patients need both mechanical (SCDs) AND pharmacologic (LMWH/UFH) prophylaxis",
      "Apply SCDs PREOPERATIVELY, before induction of anesthesia — not just postoperatively"
    ],
    safetyNote: "Perioperative VTE is a leading cause of preventable hospital death — proper risk assessment and prophylaxis are essential",
    distractorRationales: [
      "A completed course of anticoagulation does not eliminate future VTE risk, especially perioperatively",
      "Resuming full anticoagulation preoperatively without surgical team coordination creates bleeding risk",
      "SCDs should be applied BEFORE surgery (in the preoperative area) and continued postoperatively"
    ]
  },
  {
    stem: "A 60-year-old patient scheduled for coronary artery bypass grafting is taking metformin 1000 mg twice daily for type 2 diabetes. The preoperative nurse should be aware that metformin should be managed how before surgery?",
    options: [
      "Continue metformin through the morning of surgery with a sip of water",
      "Hold metformin on the day of surgery and for 48 hours postoperatively, especially if IV contrast may be used, due to the risk of metformin-associated lactic acidosis in the setting of renal hypoperfusion",
      "Double the metformin dose preoperatively to prevent hyperglycemia during surgery",
      "Switch metformin to glipizide the week before surgery"
    ],
    correctAnswer: 1,
    rationaleLong: "Metformin management in the perioperative setting requires careful consideration due to the risk of metformin-associated lactic acidosis (MALA). Metformin is renally excreted, and situations that compromise renal perfusion — such as hemodynamic instability during surgery, volume depletion, use of iodinated contrast media, or postoperative acute kidney injury — can cause metformin accumulation. Accumulated metformin inhibits mitochondrial complex I, impairing oxidative phosphorylation and leading to lactate accumulation. While MALA is rare, it carries a mortality rate of approximately 50%. Current guidelines recommend: holding metformin on the day of surgery, holding for 48 hours if iodinated contrast is used (as in cardiac catheterization, which may precede CABG), and verifying adequate renal function (GFR >30 mL/min) before restarting metformin postoperatively. For patients undergoing CABG surgery, the cardiovascular stress, potential for hemodynamic instability, use of cardiopulmonary bypass (which can impair renal perfusion), and possible perioperative contrast use all create conditions that increase MALA risk. The nurse should ensure the patient understands to hold metformin as directed and should communicate this medication management to the entire perioperative team.",
    learningObjective: "Apply perioperative metformin management guidelines to prevent metformin-associated lactic acidosis",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "diabetes medication management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Metformin is held on the day of surgery and for 48 hours if contrast is used. MALA mortality is ~50%. Verify GFR >30 before restarting.",
    clinicalPearls: [
      "Hold metformin on day of surgery; 48 hours if IV contrast used; verify GFR >30 before restarting",
      "MALA (metformin-associated lactic acidosis) has ~50% mortality rate",
      "Conditions that compromise renal perfusion increase MALA risk: hypotension, CPB, contrast, AKI"
    ],
    safetyNote: "Always verify renal function before restarting metformin postoperatively — acute kidney injury after surgery can precipitate fatal lactic acidosis",
    distractorRationales: [
      "Continuing metformin on the morning of surgery is not recommended due to MALA risk during hemodynamic stress",
      "Doubling the dose is dangerous and contrary to all guidelines",
      "Switching to glipizide creates different perioperative risks (hypoglycemia) and is not the standard recommendation"
    ]
  },
  {
    stem: "A patient scheduled for elective spinal fusion has a preoperative hemoglobin of 9.8 g/dL. The expected surgical blood loss is 800-1200 mL. What preoperative intervention should the nurse anticipate to optimize the patient's hemoglobin before surgery?",
    options: [
      "No intervention needed — the hemoglobin is adequate for surgery",
      "Implement a patient blood management program including iron supplementation (oral or IV), erythropoiesis-stimulating agents if appropriate, and possible preoperative autologous blood donation",
      "Transfuse 2 units of packed red blood cells preoperatively to raise the hemoglobin above 12 g/dL",
      "Schedule the surgery immediately before the hemoglobin drops further"
    ],
    correctAnswer: 1,
    rationaleLong: "Patient blood management (PBM) is an evidence-based, multidisciplinary approach to optimizing the care of patients who might need a blood transfusion. The first pillar of PBM is optimizing the patient's own red cell mass before surgery. A preoperative hemoglobin of 9.8 g/dL in a patient expected to lose 800-1200 mL of blood is concerning because the anticipated blood loss could drop the hemoglobin to a level requiring transfusion (typically below 7-8 g/dL in otherwise healthy patients). Preoperative optimization strategies include: (1) Iron supplementation — oral iron (ferrous sulfate 325 mg daily with vitamin C to enhance absorption) for mild iron deficiency, or IV iron (ferric carboxymaltose, iron sucrose) for more significant deficiency or when oral iron is not tolerated or time is limited; (2) Erythropoiesis-stimulating agents (ESAs) such as epoetin alfa — may be considered in select patients to stimulate red blood cell production over 2-4 weeks; (3) Identifying and treating the cause of anemia — iron deficiency, B12/folate deficiency, chronic kidney disease, or chronic disease anemia; (4) Preoperative autologous blood donation — the patient donates their own blood 2-5 weeks before surgery for potential autotransfusion; (5) Optimization of nutrition and hydration. Routine preoperative allogeneic transfusion to reach an arbitrary hemoglobin target is not recommended by PBM guidelines, as transfusion carries risks including transfusion reactions, infection, immunomodulation, and increased length of stay.",
    learningObjective: "Implement patient blood management strategies to optimize preoperative hemoglobin and reduce transfusion requirements",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "patient blood management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "PBM optimizes the patient's own red cell mass before surgery — routine preoperative allogeneic transfusion is NOT recommended.",
    clinicalPearls: [
      "Three pillars of PBM: optimize erythropoiesis, minimize blood loss, manage anemia tolerance",
      "IV iron acts faster than oral iron — use when oral is not tolerated or time is limited",
      "Preoperative anemia (Hgb <12 in women, <13 in men) is an independent predictor of poor surgical outcomes"
    ],
    safetyNote: "Identify and address preoperative anemia early — allowing 2-4 weeks for optimization significantly reduces transfusion requirements",
    distractorRationales: [
      "A hemoglobin of 9.8 with expected loss of 800-1200 mL is likely to require transfusion without optimization",
      "Routine preoperative allogeneic transfusion carries risks and is not recommended by PBM guidelines",
      "Rushing to surgery without hemoglobin optimization increases transfusion requirements and complications"
    ]
  },
  {
    stem: "A preoperative nurse is assessing a patient who reports a history of obstructive sleep apnea (OSA) diagnosed by polysomnography with an apnea-hypopnea index (AHI) of 35. The patient uses CPAP at home but did not bring the CPAP machine to the hospital. What is the perioperative significance of this finding?",
    options: [
      "OSA has no impact on perioperative care — patients sleep during surgery under anesthesia anyway",
      "The patient is at high risk for postoperative airway obstruction, hypoxemia, and respiratory depression — ensure the patient's CPAP machine is available for postoperative use and communicate OSA severity to the anesthesia team",
      "Cancel the surgery until the patient brings the CPAP machine",
      "OSA only affects sleep quality and has no anesthetic implications"
    ],
    correctAnswer: 1,
    rationaleLong: "Obstructive sleep apnea is a significant perioperative risk factor that affects anesthetic management, postoperative monitoring, and patient safety. An AHI of 35 indicates severe OSA (mild: 5-14, moderate: 15-29, severe: ≥30 events per hour). Patients with OSA, particularly severe OSA, are at increased risk for: difficult airway management during intubation (due to the same anatomic features that cause OSA), postoperative airway obstruction (residual anesthetic effects and sedation worsen upper airway collapse), hypoxemia and hypercapnia, postoperative respiratory depression (especially with opioid administration — patients with OSA have heightened sensitivity to opioid-induced respiratory depression), and cardiovascular complications (OSA is associated with hypertension, pulmonary hypertension, and arrhythmias). The perioperative nurse should: communicate the OSA diagnosis and severity to the anesthesia and surgical teams, ensure the patient's CPAP machine (or one from the facility's respiratory therapy department) is available for postoperative use, advocate for a multimodal pain management approach that minimizes opioid use, and plan for appropriate postoperative monitoring (continuous pulse oximetry, possibly in a monitored setting rather than a standard floor bed). The ASA Practice Guidelines for the Perioperative Management of Patients with OSA provide a scoring system to determine the level of monitoring required.",
    learningObjective: "Recognize severe OSA as a significant perioperative risk factor requiring specific anesthetic planning and postoperative monitoring",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "obstructive sleep apnea",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "AHI ≥30 = severe OSA. Key perioperative risks: difficult airway, postop airway obstruction, opioid sensitivity. CPAP must be available for postop use.",
    clinicalPearls: [
      "OSA severity by AHI: mild 5-14, moderate 15-29, severe ≥30 events/hour",
      "OSA patients have heightened sensitivity to opioid-induced respiratory depression",
      "Postoperative CPAP use is essential — ensure the patient's machine or a hospital-provided device is available"
    ],
    safetyNote: "OSA patients receiving opioids postoperatively require continuous pulse oximetry and may need a monitored care setting",
    distractorRationales: [
      "OSA significantly impacts perioperative care, airway management, and postoperative monitoring",
      "Surgery typically does not need to be cancelled but CPAP must be arranged through respiratory therapy if the patient's machine is unavailable",
      "OSA has major anesthetic implications including difficult airway risk and postoperative respiratory depression"
    ]
  },
  {
    stem: "A patient scheduled for a bilateral mastectomy with immediate reconstruction reports taking tamoxifen 20 mg daily for breast cancer prevention. The preoperative nurse should be aware of which perioperative concern related to tamoxifen?",
    options: [
      "Tamoxifen increases the risk of intraoperative bleeding",
      "Tamoxifen is a selective estrogen receptor modulator (SERM) that increases the risk of perioperative venous thromboembolism 2-3 fold, and discontinuation should be discussed with the oncologist",
      "Tamoxifen has no perioperative implications",
      "Tamoxifen causes hyperglycemia that complicates anesthesia management"
    ],
    correctAnswer: 1,
    rationaleLong: "Tamoxifen is a selective estrogen receptor modulator (SERM) used for breast cancer treatment and prevention. A well-documented side effect of tamoxifen is an increased risk of venous thromboembolism (VTE), including deep vein thrombosis and pulmonary embolism. This risk is approximately 2-3 times higher than in non-users and is compounded by the additional VTE risk associated with surgery and immobility. The combination of tamoxifen use plus major surgery creates a significantly elevated VTE risk. The perioperative management of tamoxifen is a clinical decision that must involve the patient's oncologist, surgeon, and anesthesiologist. Some practitioners recommend discontinuing tamoxifen 2-4 weeks before major elective surgery to allow the thrombophilic effects to dissipate, while others continue tamoxifen with aggressive VTE prophylaxis (mechanical and pharmacologic) given the importance of the medication for cancer treatment/prevention. The perioperative nurse should: identify tamoxifen on the medication reconciliation, communicate the VTE risk to the surgical team, ensure appropriate VTE prophylaxis is ordered and implemented (SCDs and pharmacologic prophylaxis), advocate for early postoperative mobilization, and monitor for signs of VTE postoperatively.",
    learningObjective: "Identify tamoxifen as a risk factor for perioperative VTE and facilitate appropriate multidisciplinary management",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "oncology medication management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Tamoxifen increases VTE risk 2-3 fold. Combined with surgical VTE risk, these patients require aggressive prophylaxis.",
    clinicalPearls: [
      "Tamoxifen increases VTE risk 2-3x — significant when combined with surgical immobility",
      "Some practitioners hold tamoxifen 2-4 weeks preoperatively; others continue with aggressive VTE prophylaxis",
      "Decision to hold or continue requires oncology consultation — the cancer treatment benefit must be weighed"
    ],
    safetyNote: "Ensure aggressive VTE prophylaxis (mechanical + pharmacologic) for tamoxifen-using patients undergoing surgery",
    distractorRationales: [
      "Tamoxifen's primary perioperative concern is VTE risk, not bleeding",
      "Tamoxifen has significant perioperative implications that must be addressed",
      "Tamoxifen does not cause hyperglycemia — its primary perioperative concern is thromboembolism"
    ]
  },
  {
    stem: "During a preoperative assessment, a 28-year-old patient scheduled for an exploratory laparotomy reports using cocaine recreationally within the past 24 hours. What is the MOST critical perioperative concern?",
    options: [
      "Risk of withdrawal symptoms during surgery",
      "Cocaine causes sympathetic nervous system stimulation, increasing the risk of intraoperative hypertensive crisis, tachyarrhythmias, myocardial ischemia, and coronary vasospasm — the anesthesiologist must be notified immediately",
      "Cocaine has no effect on anesthesia or surgery",
      "The main concern is the patient's legal liability for drug use"
    ],
    correctAnswer: 1,
    rationaleLong: "Recent cocaine use presents critical perioperative risks due to its potent sympathomimetic effects. Cocaine inhibits the reuptake of norepinephrine, dopamine, and serotonin, and also blocks sodium channels. The perioperative implications include: (1) Cardiovascular instability — cocaine causes tachycardia, hypertension, coronary artery vasoconstriction, and increases myocardial oxygen demand while simultaneously decreasing supply. This creates conditions for myocardial ischemia and infarction, even in young patients with no underlying coronary artery disease; (2) Arrhythmia risk — cocaine's sodium channel blocking properties create a pro-arrhythmic state, particularly when combined with volatile anesthetic agents and catecholamines; (3) Drug interactions — cocaine sensitizes the myocardium to catecholamines, making standard doses of epinephrine and other vasopressors potentially dangerous; (4) Hyperthermia — cocaine can cause hyperthermia that may be confused with malignant hyperthermia; (5) Seizures and cerebrovascular events. For elective surgery, the procedure should generally be postponed for at least 24-72 hours after the last cocaine use to allow cardiovascular effects to resolve. For emergency surgery that cannot be postponed, the anesthesiologist must be notified immediately to plan an anesthetic approach that avoids drugs that potentiate cocaine's cardiovascular effects and to have anti-hypertensive and anti-arrhythmic medications readily available.",
    learningObjective: "Recognize recent cocaine use as a critical perioperative risk factor requiring immediate anesthesia team notification and potential case postponement",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "substance use assessment",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cocaine sensitizes the myocardium to catecholamines — standard doses of epinephrine can trigger lethal arrhythmias. Elective surgery should be postponed 24-72 hours.",
    clinicalPearls: [
      "Cocaine: sympathomimetic + sodium channel blocker = hypertensive crisis, arrhythmias, coronary vasospasm",
      "Cocaine sensitizes the myocardium to catecholamines — epinephrine doses must be adjusted",
      "Elective surgery should be postponed 24-72 hours after last cocaine use"
    ],
    safetyNote: "Immediately notify the anesthesiologist of recent cocaine use — the standard anesthetic approach must be significantly modified",
    distractorRationales: [
      "Cocaine withdrawal does not cause dangerous acute withdrawal symptoms — the concern is the active drug effects",
      "Cocaine has profound effects on cardiovascular physiology that directly impact anesthesia safety",
      "Legal concerns are irrelevant to the clinical safety focus of the preoperative assessment"
    ]
  },
  {
    stem: "A perioperative nurse is reviewing the anesthesia consent for a patient with documented severe egg allergy (anaphylaxis). The anesthesiologist plans to use propofol for induction. What is the nurse's responsibility?",
    options: [
      "Confirm with the anesthesiologist that propofol is safe to use, as current evidence shows that egg allergy does not reliably predict propofol allergy despite propofol's egg lecithin content",
      "Refuse to allow propofol use and demand an alternative induction agent",
      "Administer a test dose of propofol on the patient's skin before IV administration",
      "Propofol does not contain any egg-derived ingredients, so there is no concern"
    ],
    correctAnswer: 0,
    rationaleLong: "Propofol is formulated as an oil-in-water emulsion containing soybean oil, egg lecithin (egg phosphatide), and glycerol. The egg lecithin is derived from egg yolk phospholipids and is a highly purified lipid component. Historically, there was concern that patients with egg allergies might react to propofol due to this egg-derived ingredient. However, current evidence from multiple studies and expert reviews indicates that egg allergy (which is typically a reaction to egg white proteins such as ovalbumin and ovomucoid) does NOT reliably predict propofol allergy. The egg lecithin in propofol is derived from egg YOLK, not egg white, and is a highly purified phospholipid that is unlikely to contain the allergenic proteins found in egg white. The American Academy of Allergy, Asthma & Immunology and several anesthesia societies have concluded that egg allergy is not a contraindication to propofol use. However, the nurse should confirm with the anesthesiologist that they are aware of the egg allergy and have made an informed decision. Soy allergy is similarly not a reliable predictor of propofol allergy, as the soybean oil in propofol is highly refined and typically lacks the allergenic soy proteins. True propofol allergy (which does exist but is rare) is likely a reaction to the propofol molecule itself or to other formulation components.",
    learningObjective: "Understand the evidence-based relationship between egg allergy and propofol safety to facilitate informed clinical decision-making",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "drug allergy assessment",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Egg allergy does NOT contraindicate propofol. Egg allergy is typically to egg WHITE proteins; propofol contains egg YOLK lecithin. They are different immunologic targets.",
    clinicalPearls: [
      "Egg allergy is NOT a reliable predictor of propofol allergy per current evidence",
      "Egg allergy targets egg white proteins; propofol's egg lecithin is from egg yolk phospholipids",
      "True propofol allergy is rare and likely a reaction to the propofol molecule itself"
    ],
    safetyNote: "Always communicate all documented allergies to the anesthesia team, but avoid unnecessarily restricting safe medication choices based on outdated allergy cross-reactivity assumptions",
    distractorRationales: [
      "Refusing propofol based on egg allergy alone is not evidence-based and may unnecessarily restrict safe options",
      "Skin testing is not reliable for predicting propofol allergy",
      "Propofol does contain egg-derived lecithin, but this does not predict allergic cross-reactivity"
    ]
  },
  {
    stem: "A preoperative nurse is reviewing the chart of a 75-year-old patient scheduled for a femoral-popliteal bypass graft. The patient has a history of recent stroke 3 weeks ago. What is the preoperative concern?",
    options: [
      "No concern — the stroke has been treated and the patient is medically stable",
      "Recent stroke within the past 3 months is a significant risk factor for perioperative stroke recurrence, and the risks of proceeding with elective surgery during this period must be weighed against the benefits",
      "The only concern is whether the patient can provide informed consent",
      "Stroke history only affects brain surgery, not vascular surgery"
    ],
    correctAnswer: 1,
    rationaleLong: "A recent stroke is a significant risk factor for perioperative stroke recurrence, particularly within the first 3 months after the initial event. The perioperative period creates conditions that can precipitate recurrent cerebrovascular events: hemodynamic fluctuations (hypotension, hypertension), alterations in coagulation, inflammatory responses to surgery, and potential disruption of antiplatelet or anticoagulant therapy. Studies have shown that the risk of perioperative stroke is approximately 5-15% within the first 3 months after a prior stroke, compared to <1% in patients without stroke history. The risk decreases significantly after 3 months and returns closer to baseline after 9-12 months. Current guidelines generally recommend delaying elective surgery for at least 3 months (and ideally 6-9 months) after a stroke when possible. For this patient at 3 weeks post-stroke, the risk of proceeding with elective vascular surgery is substantial. However, the decision must weigh the recurrent stroke risk against the consequences of delaying the femoral-popliteal bypass (progressive limb ischemia, potential limb loss). This is a multidisciplinary decision involving the vascular surgeon, neurologist, anesthesiologist, and patient. If the surgery cannot be safely delayed, the perioperative team must implement aggressive measures to maintain hemodynamic stability, continue appropriate antiplatelet therapy, and monitor for neurological changes.",
    learningObjective: "Recognize recent stroke as a contraindication to elective surgery and understand the recommended waiting period for surgical clearance",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "neurological risk assessment",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Perioperative stroke risk: 5-15% within 3 months of prior stroke. Delay elective surgery at least 3 months (ideally 6-9 months) post-stroke.",
    clinicalPearls: [
      "Perioperative stroke risk is 5-15% within 3 months of prior stroke — dramatically elevated",
      "Delay elective surgery at least 3 months; ideally 6-9 months after a stroke",
      "If surgery cannot be delayed, maintain hemodynamic stability and continue antiplatelet therapy"
    ],
    safetyNote: "Monitor for neurological changes in all postoperative patients with recent stroke history — early detection of recurrent stroke improves outcomes",
    distractorRationales: [
      "A 3-week-old stroke creates substantially elevated perioperative stroke recurrence risk",
      "Informed consent is important but the primary medical concern is stroke recurrence risk",
      "Stroke history affects all types of surgery through hemodynamic and inflammatory mechanisms"
    ]
  },
  {
    stem: "A preoperative nurse is assessing a patient with myasthenia gravis (MG) scheduled for a thymectomy. Which preoperative medication information is MOST critical for the anesthesia team?",
    options: [
      "The patient's antihypertensive medication dosage",
      "The patient's current pyridostigmine (Mestinon) dosage and timing, as MG patients have altered sensitivity to neuromuscular blocking agents used during anesthesia",
      "The patient's vitamin supplement regimen",
      "The patient's over-the-counter allergy medication use"
    ],
    correctAnswer: 1,
    rationaleLong: "Myasthenia gravis (MG) is an autoimmune disorder affecting the neuromuscular junction, where antibodies attack acetylcholine receptors. This has profound implications for anesthesia because neuromuscular blocking agents (NMBAs) used to facilitate intubation and surgical relaxation act at the same neuromuscular junction that is already compromised in MG. MG patients have altered sensitivity to NMBAs in two important ways: (1) They are RESISTANT to depolarizing agents (succinylcholine) — because the reduced number of functional acetylcholine receptors requires higher doses for effective depolarization; (2) They are EXTREMELY SENSITIVE to non-depolarizing agents (rocuronium, vecuronium, cisatracurium) — because the already compromised neuromuscular junction requires much less additional blockade to achieve complete paralysis, and recovery is prolonged and unpredictable. Pyridostigmine (Mestinon) is an acetylcholinesterase inhibitor that is the mainstay of MG treatment. Its dosage and timing are critical because: it affects the patient's baseline neuromuscular function, it interacts with NMBAs (inhibiting the metabolism of succinylcholine and potentially prolonging its effect), and perioperative interruption of pyridostigmine can precipitate myasthenic crisis (acute respiratory failure from severe muscle weakness).",
    learningObjective: "Identify pyridostigmine management and altered NMBA sensitivity as critical anesthesia considerations in myasthenia gravis patients",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "neuromuscular disease assessment",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "MG patients: RESISTANT to succinylcholine, EXTREMELY SENSITIVE to non-depolarizing NMBAs. Pyridostigmine dosing is critical for anesthesia planning.",
    clinicalPearls: [
      "MG + NMBAs: resistant to succinylcholine, hypersensitive to non-depolarizing agents (rocuronium, vecuronium)",
      "Pyridostigmine timing and dose are critical — interruption can cause myasthenic crisis",
      "Postoperative ventilatory support may be needed — MG patients are at high risk for postextubation respiratory failure"
    ],
    safetyNote: "Have ventilatory support immediately available for MG patients — postoperative respiratory failure requiring reintubation is common",
    distractorRationales: [
      "Antihypertensive dosing is relevant but not as critical as pyridostigmine for anesthesia planning in MG",
      "Vitamin supplements are rarely anesthetically significant compared to pyridostigmine in MG",
      "OTC allergy medications are less critical than the disease-specific medication management for MG"
    ]
  },
  {
    stem: "A 52-year-old patient is scheduled for a sleeve gastrectomy. During the preoperative interview, the patient discloses a history of anxiety disorder and panic attacks. She expresses significant fear about being 'put to sleep' and asks if she will wake up during the procedure. What is the MOST appropriate nursing response?",
    options: [
      "Tell the patient that awareness during surgery never happens with modern anesthesia",
      "Acknowledge the patient's fear, provide honest information about the extremely low but non-zero risk of awareness, explain monitoring techniques used to detect and prevent awareness, and notify the anesthesiologist of the patient's anxiety level",
      "Administer a sedative immediately to calm the patient before the interview continues",
      "Tell the patient to discuss these concerns with someone else as it is outside the preoperative nurse's scope"
    ],
    correctAnswer: 1,
    rationaleLong: "Preoperative anxiety is extremely common and requires therapeutic communication from the perioperative nurse. The patient's fear of intraoperative awareness is a legitimate concern that deserves honest, empathetic response. Intraoperative awareness (accidental awareness during general anesthesia, AAGA) occurs in approximately 1-2 per 1,000 general anesthetics — it is rare but not zero. Risk factors include: certain types of procedures (cardiac surgery, C-section, trauma surgery), use of neuromuscular blocking agents (which paralyze the patient, preventing them from signaling awareness), inadequate anesthetic depth, young age, female sex, obesity, and history of substance use or chronic opioid use. The nurse should: (1) Acknowledge and validate the patient's fear — saying 'I understand your concern' is therapeutic; (2) Provide honest information — awareness is rare and modern monitoring helps detect and prevent it; (3) Explain monitoring techniques such as processed EEG (BIS monitor) that can help assess anesthetic depth; (4) Notify the anesthesiologist of the patient's anxiety level so they can provide additional reassurance and consider BIS monitoring; (5) Discuss anxiolysis options — the anesthesiologist may prescribe a preoperative anxiolytic (midazolam) to reduce anxiety before induction. Telling the patient awareness 'never happens' is dishonest and undermines trust.",
    learningObjective: "Provide honest, therapeutic communication to address preoperative anxiety about intraoperative awareness",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "preoperative anxiety management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Intraoperative awareness occurs in 1-2 per 1,000 GA cases. Never tell patients it 'never happens' — honest communication builds trust.",
    clinicalPearls: [
      "AAGA incidence: 1-2 per 1,000 general anesthetics — rare but not zero",
      "Risk factors: cardiac surgery, C-section, trauma, NMBA use, inadequate anesthetic depth",
      "BIS monitoring can help detect and prevent awareness by measuring processed EEG"
    ],
    safetyNote: "Document preoperative anxiety level and communicate to the anesthesia team — severe preoperative anxiety can affect anesthetic management",
    distractorRationales: [
      "Stating awareness never happens is dishonest and does not address the patient's legitimate concern",
      "Administering sedatives without addressing the underlying fear does not constitute therapeutic communication",
      "Addressing preoperative anxiety and providing emotional support is within the perioperative nurse's scope"
    ]
  },
  {
    stem: "A preoperative nurse is reviewing the medication list of a 65-year-old patient scheduled for a total knee arthroplasty. The patient takes the following medications: atorvastatin 40 mg daily, amlodipine 5 mg daily, metformin 500 mg BID, and aspirin 325 mg daily. According to current perioperative medication management guidelines, which medication(s) should be CONTINUED on the morning of surgery?",
    options: [
      "All four medications should be held on the morning of surgery",
      "Atorvastatin and amlodipine should be continued; metformin should be held; aspirin management depends on surgeon preference based on bleeding vs. thrombotic risk",
      "Only metformin should be continued; all others should be held",
      "All four medications should be continued without modification"
    ],
    correctAnswer: 1,
    rationaleLong: "Perioperative medication management requires individualized assessment of each medication's risks and benefits when continued or held. For this patient's medication list: (1) Atorvastatin (statin) — CONTINUE. Statins have pleiotropic anti-inflammatory and endothelial stabilizing effects. Perioperative statin continuation is associated with reduced cardiac complications, and abrupt discontinuation can cause a rebound inflammatory response. (2) Amlodipine (calcium channel blocker) — CONTINUE (with caution). Calcium channel blockers are generally continued perioperatively to maintain blood pressure control. However, some anesthesiologists may hold them on the morning of surgery due to the potential for additive hypotension with anesthetic agents. The decision is individualized. (3) Metformin — HOLD. As discussed previously, metformin should be held on the day of surgery due to the risk of lactic acidosis in the setting of renal hypoperfusion during surgery. (4) Aspirin 325 mg — individualized decision. For TKA, the surgeon and anesthesiologist must weigh the bleeding risk (aspirin increases intraoperative blood loss) against the thrombotic risk (aspirin provides some VTE protection). Many orthopedic surgeons prefer to hold aspirin 7-10 days before major joint replacement, while others continue it. If the patient has cardiac stents, aspirin is generally continued. The perioperative nurse should clarify aspirin management with the surgical team.",
    learningObjective: "Apply individualized perioperative medication management guidelines for common chronic medications",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "perioperative medication management",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Statins: CONTINUE (anti-inflammatory benefit, rebound risk if stopped). Metformin: HOLD (lactic acidosis risk). CCBs: generally continue. Aspirin: individualized.",
    clinicalPearls: [
      "Statins should be continued perioperatively — abrupt discontinuation causes inflammatory rebound",
      "Metformin held on day of surgery; verify GFR before restarting postoperatively",
      "Aspirin management depends on cardiac history, stent status, and surgical bleeding risk"
    ],
    safetyNote: "Always clarify medication management with the surgical and anesthesia teams — medication errors around the surgical period are common",
    distractorRationales: [
      "Holding all medications is overly aggressive — statins should be continued and CCBs are generally continued",
      "Metformin should NOT be continued on the morning of surgery due to lactic acidosis risk",
      "Continuing all medications without assessment ignores the risks of metformin and potential aspirin concerns"
    ]
  }
];
