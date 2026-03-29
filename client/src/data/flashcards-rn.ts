import { getAssetUrl } from "@/lib/asset-url";
import type { FlashcardData } from "./flashcards-rpn";
import { rnExpansionFlashcards } from "./flashcards-rn-expansion";
import { rnInfectiousDiseaseFlashcards } from "./flashcards-rn-infectious-disease";
import { rnPathoCardioNeuroFlashcards } from "./flashcards-rn-patho-cardio-neuro";
import { rnRespRenalFlashcards } from "./flashcards-rn-resp-renal";
import { rnRespRenalFlashcardsBatch2 } from "./flashcards-rn-resp-renal-batch2";
import { rnPathoExpansionFlashcards } from "./flashcards-rn-patho-expansion";
import { rnShockCriticalFlashcards } from "./flashcards-rn-shock-critical";
import { rnArrhythmiasChdAnticoagFlashcards } from "./flashcards-rn-arrhythmias-chd-anticoag";
import { rnGiCancerPedsIntegFlashcards } from "./flashcards-rn-gi-cancer-peds-integ";
import { imgUlcerativeColitis, imgSIADH, imgSickleCellCrisis, imgStomaCare, imgThrombocytopenia, imgUrinaryCatheterization, imgVitiligo, imgUrethralStricture, imgVestibularNeuritis, imgAddisons, imgAcuteHemolyticReaction, imgAtopicDermatitis, imgBPH, imgCastCareTraction, imgAcromegaly, imgNGTube, imgPancreatitis, imgPeritonealDialysis, imgPepticUlcer, imgOsteoporosis, imgCellulitis, imgCKD, imgClubfoot, imgCompartmentSyndrome, imgConjunctivitis, imgContracture, imgCushings, imgDelayedHemolyticReaction, imgDevHipDysplasia, imgDiabetes, imgDiabetesInsipidus, imgDiabeticNephropathy, imgDIC, imgDisuseAtrophy, imgDuchenne, imgEpiglottitis, imgEpistaxis, imgErysipelas, imgFallPrevention, imgHeadLice, imgHemophilia, imgGravesDisease, imgGout, imgPyloricStenosis, imgPlacentaPrevia, imgPostpartumHemorrhage, imgSerotoninSyndrome, imgVaricella, imgRhIncompatibility, imgIntussusception, imgLeadPoisoning, imgLeukemia, imgLungCancer, imgMeasles, imgMeningitisNew, imgMetabolicSyndrome, imgMRSA, imgCongenitalHypothyroidism, imgFetalMonitoring, imgInfantReflexes, imgWoundVAC, imgWoundInfection, imgEsophagealVarices, imgGIBleed, imgSucralfate, imgSyndactyly, imgSyringomyelia, imgTardiveDyskinesia, imgTetanus, imgThalassemiaV2, imgThermoregulationV2, imgThrombocytopeniaV2, imgThyroidStormV2, imgTinnitus, imgTonsillectomyV2, imgTraction, imgTrigeminalNeuralgia, imgTrisomy21V2, imgTSS, imgTumorMarkers, imgTurnerSyndromeV2, imgTURP, imgHepatitisB, imgDKA, imgDysphagia, imgEBV, imgEctopicPregnancy, imgEndocarditisFlashcard, imgEndometriosis, imgEnteralFeeding } from "./flashcards-rpn";
import { imgHeatStroke, imgHELLPNew, imgHemodialysis, imgHIV, imgHepatitisNew } from "./flashcards-rpn";
import { imgDecelsFlashcard, imgAVFistulaFlashcard, imgBariatricFlashcard } from "./flashcards-rpn";
import { imgStroke, imgProstatitis, imgRotavirus, imgRubella, imgScarletFever, imgShortBowelV4, imgSkinAssessment, imgSpinalStenosisV3, imgSprain, imgEsophagealStricture, imgScabiesV3 } from "./flashcards-rpn";

const imgImpetigo = getAssetUrl("impetigo_1773340649073.png");
const imgHypothyroidismNew = getAssetUrl("hypothyroidism_1773374939606.png");
const imgAntepartum = getAssetUrl("antepartum_1773340419064.png");
const imgAnxiety = getAssetUrl("anxiety_1773374656571.png");
const imgAPGAR = getAssetUrl("APGAR_1773340419064.png");
const imgBacterialMeningitis = getAssetUrl("bacterialmeningitis_1773374688442.png");
const imgCSection = getAssetUrl("c-section_1773374688442.png");
const imgCarSeatSafety = getAssetUrl("carseatsafety_1773340419064.png");
const imgDepression = getAssetUrl("depression_1773340419064.png");
const imgHELLP = getAssetUrl("HELLP_1773340513136.png");
const imgHepatitisC = getAssetUrl("hepatitisc_1773340513136.png");
const imgStevensJohnson = getAssetUrl("SJS_1773375229956.png");
const illustrationPressureInjuriesV2 = getAssetUrl("pressure-injuries-v2.png");
const illustrationPressureInjuryStagesV2 = getAssetUrl("pressure-injury-stages-v2.png");
const illustrationShinglesV2 = getAssetUrl("shingles-v2.png");
const illustrationScabiesV2 = getAssetUrl("scabies_1773375229956.png");
const illustrationRibFractures = getAssetUrl("rib-fractures.png");
const illustrationRheumatoidArthritis = getAssetUrl("rheumatoid-arthritis.png");
const imgPituitaryGlands = getAssetUrl("pituitaryglands_1773269379973.png");
const imgParkinsonsNew = getAssetUrl("parkinson_1773375118294.png");
const imgPeripheralNeuropathy = getAssetUrl("peripheralneuropathy_1773375118294.png");
const imgPepticUlcerNew = getAssetUrl("pepticulcer_1773375118294.png");
const imgPressureInjuriesNew = getAssetUrl("pressureinjuries_1773375118294.png");
const imgPediatricSeizuresNew = getAssetUrl("pediatricseizures_1773375118294.png");


const imgEpsteinBarr = getAssetUrl("epsteinbarrvirus_1773340513136.png");

export const rnFlashcards: FlashcardData[] = [
  // ============================================================
  // CARDIOVASCULAR (20 cards)
  // ============================================================
  {
    id: "rn-cv-q1",
    type: "question",
    question: "A client with acute STEMI has just received alteplase (tPA). Which assessment finding requires the MOST immediate nursing intervention?",
    options: ["Blood pressure 148/92 mmHg", "Oozing from the IV insertion site", "Sudden onset severe headache with altered mental status", "Heart rate of 56 bpm"],
    correctIndex: 2,
    answer: "Sudden severe headache with altered mental status after tPA administration suggests intracranial hemorrhage, the most lethal complication of thrombolytic therapy. The nurse must stop the infusion immediately, obtain a stat CT scan, and prepare for emergency intervention. This takes priority over mild bleeding from IV sites or hemodynamic changes.",
    category: "Cardiovascular",
    difficulty: 3,
    optionRationales: [
      "A blood pressure of 148/92 mmHg is mildly elevated but not immediately life-threatening post-tPA. While hypertension should be managed to reduce bleeding risk, it does not represent the acute emergency that intracranial hemorrhage does. BP parameters post-tPA are typically maintained below 180/105 mmHg.",
      "Minor oozing from IV insertion sites is a common and expected side effect of thrombolytic therapy due to the systemic fibrinolytic state. This can be managed with direct pressure and does not require stopping the infusion unless bleeding is uncontrolled.",
      "",
      "Bradycardia at 56 bpm may be a reperfusion arrhythmia, which is actually a positive sign indicating successful thrombolysis and restoration of coronary blood flow. Unless the client is symptomatic with hypotension, this does not require immediate intervention."
    ],
    clinicalPearl: "After administering tPA, perform neurological checks every 15 minutes for the first 2 hours, then every 30 minutes for 6 hours, then hourly for 16 hours. Any sudden change in neurological status (headache, vision changes, confusion, weakness) warrants immediate CT scan and discontinuation of the infusion. The window for intervention in hemorrhagic stroke is narrow."
  },
  {
    id: "rn-cv-q2",
    type: "question",
    question: "A nurse is caring for a client with a temporary transvenous pacemaker. The client's heart rate drops to 32 bpm and the pacemaker is not capturing. What is the priority action?",
    options: ["Increase the milliampere (mA) output on the pacemaker", "Prepare for immediate defibrillation", "Administer IV atropine 0.5 mg", "Reposition the client to the left lateral position"],
    correctIndex: 0,
    answer: "When a temporary pacemaker fails to capture (pacing spikes present without QRS response), increasing the mA output increases the electrical current delivered to the myocardium, which may restore capture. If increasing output fails, checking lead connections, repositioning the client, and notifying the physician are next steps. Atropine may be used as a bridge but does not fix the capture problem.",
    category: "Cardiovascular",
    difficulty: 3,
    optionRationales: [
      "",
      "Defibrillation is used for ventricular fibrillation or pulseless ventricular tachycardia, not for bradycardia with failure to capture. The client has a dangerously slow rate but is not in a shockable rhythm. Defibrillation would be inappropriate and potentially harmful in this situation.",
      "IV atropine 0.5 mg can temporarily increase heart rate by blocking vagal tone, but it does not address the underlying problem of pacemaker failure to capture. It is a temporizing measure, not the priority action when the pacemaker itself can be adjusted to restore function.",
      "Repositioning to the left lateral position might help if lead displacement is the cause of failure to capture, but this is not the first action. Increasing mA output is a quicker, less invasive intervention that addresses the most common cause of capture failure."
    ],
    clinicalPearl: "Remember the three types of pacemaker malfunction: failure to fire (no pacing spike seen), failure to capture (spike present but no QRS), and failure to sense (pacemaker fires despite intrinsic rhythm). Each requires a different intervention. For capture failure, increase mA; for sensing failure, increase sensitivity (lower the mV threshold)."
  },
  {
    id: "rn-cv-q3",
    type: "question",
    question: "A client post-cardiac catheterization via the femoral artery reports severe back pain and the nurse notes a firm, pulsatile mass in the groin. What does the nurse suspect?",
    options: ["Normal post-procedure discomfort", "Retroperitoneal hemorrhage", "Deep vein thrombosis formation", "Pseudoaneurysm at the insertion site"],
    correctIndex: 3,
    answer: "A pulsatile mass at the femoral puncture site after cardiac catheterization suggests a pseudoaneurysm, where blood leaks through the arterial wall into a contained space. Back pain may indicate retroperitoneal extension. The nurse should assess vital signs, mark the mass borders, apply manual pressure, and notify the cardiologist urgently. Ultrasound-guided compression or surgical repair may be needed.",
    category: "Cardiovascular",
    difficulty: 3,
    optionRationales: [
      "Post-procedure discomfort is typically mild soreness at the puncture site, not severe back pain with a pulsatile mass. A pulsatile mass is never a normal finding and always warrants immediate investigation. Dismissing this as normal could delay critical treatment.",
      "Retroperitoneal hemorrhage can cause back/flank pain but would not typically present with a pulsatile groin mass. Retroperitoneal bleeding is more often occult, presenting with hemodynamic instability (tachycardia, hypotension) and a dropping hemoglobin without visible external signs.",
      "DVT presents with unilateral leg swelling, warmth, and tenderness — not a pulsatile mass. DVT formation would not cause a pulsatile mass at the arterial puncture site. Additionally, DVT typically develops hours to days after the procedure, not in the immediate post-procedure period."
    ],
    clinicalPearl: "After femoral cardiac catheterization, assess the puncture site every 15 minutes for the first hour, then every 30 minutes. Check for the 5 P's of arterial compromise: Pain, Pallor, Pulselessness, Paresthesia, and Paralysis. Mark any hematoma borders with a pen and time-stamp to track expansion. A bruit heard over the site may indicate pseudoaneurysm or AV fistula formation."
  },
  {
    id: "rn-cv-q4",
    type: "question",
    question: "A client with heart failure is receiving a milrinone infusion. Which assessment finding indicates a therapeutic response?",
    options: ["Increased blood pressure from 88/60 to 130/85", "Decreased heart rate from 110 to 82 with improved urine output", "Resolution of peripheral neuropathy", "Decreased respiratory rate without change in oxygen saturation"],
    correctIndex: 1,
    answer: "Milrinone is a phosphodiesterase-3 inhibitor that provides both inotropic (increased contractility) and vasodilatory effects. A therapeutic response is improved cardiac output demonstrated by: decreased compensatory tachycardia, improved urine output (better renal perfusion), improved mental status, and decreased pulmonary congestion. Unlike dobutamine, milrinone may actually decrease blood pressure due to vasodilation.",
    category: "Cardiovascular",
    difficulty: 3,
    optionRationales: [
      "Milrinone causes vasodilation, so a significant increase in blood pressure would be unexpected and more consistent with a different medication response. In fact, hypotension is a common adverse effect of milrinone. The therapeutic goal is improved cardiac output, not elevated BP.",
      "",
      "Peripheral neuropathy is not related to heart failure or milrinone therapy. Neuropathy is associated with conditions like diabetes mellitus, vitamin B12 deficiency, or neurotoxic medications. This finding would not be expected to change with milrinone administration.",
      "A decreased respiratory rate alone without improved oxygenation may indicate respiratory depression rather than a therapeutic cardiac response. A true therapeutic response would show improved oxygen saturation, decreased crackles, and reduced work of breathing along with rate changes."
    ],
    clinicalPearl: "Milrinone is often called an 'inodilator' because it increases contractility (positive inotropy) AND causes vasodilation. Key nursing considerations: monitor for hypotension (most common adverse effect), assess for arrhythmias (especially ventricular), check platelet counts (thrombocytopenia can occur), and monitor I&O closely. It is preferred over dobutamine in patients on beta-blockers because its mechanism bypasses beta receptors."
  },
  {
    id: "rn-cv-q5",
    type: "question",
    question: "A client with aortic stenosis is scheduled for aortic valve replacement. Which preoperative finding is most concerning?",
    options: ["Systolic crescendo-decrescendo murmur", "Syncope on exertion", "Slow-rising carotid pulse (pulsus parvus et tardus)", "S4 heart sound"],
    correctIndex: 1,
    answer: "Syncope on exertion in aortic stenosis indicates that the left ventricle cannot increase cardiac output to meet exercise demands, causing cerebral hypoperfusion. This is one of the classic triad of aortic stenosis symptoms (angina, syncope, heart failure) and signals severe disease with increased risk of sudden cardiac death. Urgent surgical referral is warranted.",
    category: "Cardiovascular",
    difficulty: 3,
    optionRationales: [
      "A systolic crescendo-decrescendo murmur is the hallmark auscultatory finding of aortic stenosis and is expected in this diagnosis. While it confirms the disease, it is a diagnostic finding rather than a warning sign of imminent decompensation. The severity of the murmur does not always correlate with disease severity.",
      "",
      "Pulsus parvus et tardus (weak, delayed carotid upstroke) is a classic physical examination finding of severe aortic stenosis that reflects the reduced and delayed ejection of blood through the narrowed valve. While it indicates severity, it is a chronic finding and does not carry the same ominous prognostic significance as exertional syncope.",
      "An S4 heart sound reflects atrial contraction against a stiff, hypertrophied ventricle — common in long-standing aortic stenosis due to pressure overload. It indicates diastolic dysfunction but is an expected compensation and does not suggest imminent cardiac decompensation like syncope does."
    ],
    clinicalPearl: "The classic symptom triad of aortic stenosis follows a predictable pattern: Angina appears first (average survival 5 years without surgery), followed by Syncope (average survival 3 years), and finally Heart Failure (average survival 2 years). Once any of these symptoms appear, the prognosis worsens dramatically without valve replacement. Remember: AS = Angina → Syncope → heart failure (in order of appearance)."
  },
  {
    id: "rn-cv-q6",
    type: "question",
    question: "A nurse is interpreting a 12-lead ECG. The rhythm is regular at 150 bpm, there are no discernible P waves, and the QRS complexes are narrow. What is the most likely rhythm?",
    options: ["Sinus tachycardia", "Atrial flutter with 2:1 block", "Ventricular tachycardia", "Atrial fibrillation with rapid ventricular response"],
    correctIndex: 1,
    answer: "A regular narrow-complex tachycardia at exactly 150 bpm with no visible P waves is highly suggestive of atrial flutter with 2:1 conduction. The atrial rate is typically 300 bpm, and with every other impulse conducted, the ventricular rate is 150 bpm. Flutter waves may be hidden in the T waves. A rate of exactly 150 should always raise suspicion for atrial flutter.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-cv-q7",
    type: "question",
    question: "A client with an AICD (automatic implantable cardioverter-defibrillator) reports receiving three shocks in the past hour. What is the priority nursing action?",
    options: ["Tell the client this is normal and monitor at home", "Advise the client to come to the ED immediately for device interrogation", "Place a magnet over the device to disable it permanently", "Administer amiodarone by mouth"],
    correctIndex: 1,
    answer: "Multiple AICD shocks (electrical storm) require immediate evaluation. The shocks may be appropriate (recurrent life-threatening arrhythmias) or inappropriate (device malfunction, lead fracture). The client needs urgent ED evaluation with device interrogation, continuous cardiac monitoring, and possibly IV amiodarone or lidocaine. A magnet can temporarily inhibit therapy but should be used by trained personnel only.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-cv-q8",
    type: "question",
    question: "A client with acute decompensated heart failure is receiving IV nitroglycerin. The nurse notes the blood pressure has dropped from 118/72 to 82/50. What is the priority action?",
    options: ["Stop the nitroglycerin infusion and lower the head of bed", "Administer a fluid bolus of 500 mL normal saline", "Continue the infusion at the same rate and recheck in 15 minutes", "Switch to an oral nitrate formulation"],
    correctIndex: 0,
    answer: "Significant hypotension during IV nitroglycerin infusion requires immediately stopping the infusion. Nitroglycerin causes venous and arterial dilation, reducing preload and afterload. Lowering the head of bed (if respiratory status allows) helps increase venous return. Fluid bolus may be cautious in heart failure as it could worsen pulmonary congestion. Reassess vital signs frequently after stopping the drip.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-cv-q9",
    type: "question",
    question: "A client with pericarditis reports chest pain that worsens with deep breathing and lying flat. Which position would provide the most relief?",
    options: ["Supine with legs elevated", "Sitting upright and leaning forward", "Right lateral decubitus position", "Prone position"],
    correctIndex: 1,
    answer: "Sitting upright and leaning forward pulls the pericardium away from the epicardial surface, reducing friction between the inflamed pericardial layers and decreasing pain. The pain of pericarditis is characteristically pleuritic (worse with inspiration) and positional (worse lying flat, improved sitting forward). This differentiates it from MI pain, which is not typically positional.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-cv-q10",
    type: "question",
    question: "A nurse is preparing to administer IV amiodarone to a client with ventricular tachycardia. Which consideration is most important?",
    options: ["Amiodarone must be mixed only in D5W, never in normal saline", "Amiodarone should be given through a central line when possible due to phlebitis risk", "Amiodarone requires an inline filter for administration", "All of the above are correct considerations"],
    correctIndex: 3,
    answer: "IV amiodarone requires specific administration considerations: it must be mixed in D5W (it precipitates in NS), it causes severe peripheral phlebitis so central line administration is preferred, and an inline filter (0.22 micron) is required because the drug can leach toxic plasticizers from PVC tubing. These details are critical for safe medication administration and are frequently tested on NCLEX.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-cv-q11",
    type: "question",
    question: "A client with a new diagnosis of atrial fibrillation has a CHA2DS2-VASc score of 4. Which medication does the nurse anticipate?",
    options: ["Aspirin 81 mg daily", "Clopidogrel (Plavix) 75 mg daily", "Apixaban (Eliquis) 5 mg twice daily", "No anticoagulation is needed"],
    correctIndex: 2,
    answer: "A CHA2DS2-VASc score of 4 places the client at high risk for thromboembolic stroke. Direct oral anticoagulants (DOACs) like apixaban, rivaroxaban, or edoxaban are first-line for stroke prevention in non-valvular atrial fibrillation. Aspirin alone is no longer recommended for stroke prevention in AFib. The DOAC is preferred over warfarin for most clients due to fewer drug-food interactions and no INR monitoring requirement.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-cv-q12",
    type: "question",
    question: "A nurse is monitoring a client with an intra-aortic balloon pump (IABP). The nurse notices the balloon is inflating during systole. What is the consequence?",
    options: ["Improved coronary perfusion", "Decreased afterload", "Increased afterload and myocardial oxygen demand", "Enhanced cardiac output"],
    correctIndex: 2,
    answer: "The IABP should inflate during diastole (augmenting coronary perfusion and reducing afterload) and deflate during systole. If it inflates during systole, the balloon creates a mechanical obstruction the ventricle must pump against, dramatically increasing afterload and myocardial oxygen demand. This can worsen ischemia and cause hemodynamic collapse. The timing must be adjusted immediately.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-cv-q13",
    type: "question",
    question: "A client post-CABG surgery develops cardiac tamponade. Which assessment finding is most characteristic?",
    options: ["Widening pulse pressure and bounding pulses", "Beck's triad: muffled heart sounds, JVD, and hypotension", "Bilateral crackles and S3 gallop", "Kussmaul respirations and fruity breath odor"],
    correctIndex: 1,
    answer: "Beck's triad (muffled/distant heart sounds, jugular venous distension, and hypotension) is the classic presentation of cardiac tamponade. Blood or fluid in the pericardial space compresses the heart, preventing adequate filling. Other signs include pulsus paradoxus (>10 mmHg drop in systolic BP during inspiration), tachycardia, and narrowing pulse pressure. Emergency pericardiocentesis is required.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-cv-q14",
    type: "question",
    question: "A nurse is caring for a client with suspected acute aortic dissection. Which intervention is the MOST critical?",
    options: ["Prepare the client for emergency cardiac catheterization", "Administer IV esmolol to rapidly reduce heart rate and blood pressure", "Start IV heparin for anticoagulation", "Encourage the client to ambulate to prevent DVT"],
    correctIndex: 1,
    answer: "In acute aortic dissection, the priority is aggressive blood pressure and heart rate reduction to decrease aortic wall shear stress and prevent dissection propagation. IV beta-blockers (esmolol, labetalol) are first-line. Target heart rate is below 60 bpm and systolic BP below 120 mmHg. Anticoagulation (heparin) is CONTRAINDICATED as it can worsen bleeding. Catheterization may be needed for type A dissection.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-cv-q15",
    type: "question",
    question: "A nurse is interpreting hemodynamic readings from a pulmonary artery catheter. PCWP is 28 mmHg, CVP is 14 mmHg, cardiac index is 1.8 L/min/m², and SVR is 2,200 dyn·s/cm⁵. What type of shock do these readings suggest?",
    options: ["Hypovolemic shock", "Cardiogenic shock", "Septic shock (warm phase)", "Neurogenic shock"],
    correctIndex: 1,
    answer: "Elevated PCWP (normal 6-12 mmHg), elevated CVP (normal 2-6 mmHg), low cardiac index (normal 2.5-4.0 L/min/m²), and elevated SVR (normal 800-1,200) are classic hemodynamic findings of cardiogenic shock: the heart is failing as a pump, filling pressures are high, output is low, and the body is compensating with vasoconstriction. Septic shock would show low SVR and high cardiac output.",
    category: "Cardiovascular",
    difficulty: 3
  },
  // ============================================================
  // RESPIRATORY (18 cards)
  // ============================================================
  {
    id: "rn-resp-q1",
    type: "question",
    question: "A client with ARDS has a PaO2 of 52 mmHg on 100% FiO2 via non-rebreather mask. The PaO2/FiO2 ratio is 52. What intervention does the nurse anticipate?",
    options: ["Switch to nasal cannula at 6 L/min", "Prepare for endotracheal intubation and mechanical ventilation", "Administer bronchodilators via nebulizer", "Position the client prone and continue the current oxygen delivery"],
    correctIndex: 1,
    answer: "A PaO2/FiO2 ratio below 100 on maximal supplemental oxygen indicates severe ARDS with refractory hypoxemia. The client needs endotracheal intubation and mechanical ventilation with PEEP (positive end-expiratory pressure) to recruit collapsed alveoli and improve oxygenation. Lung-protective ventilation with low tidal volumes (6 mL/kg) reduces ventilator-induced lung injury.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-resp-q2",
    type: "question",
    question: "A client on mechanical ventilation has a sudden increase in peak inspiratory pressure from 25 to 48 cmH2O with oxygen desaturation. What should the nurse assess FIRST?",
    options: ["Check the ventilator tubing for kinks or water accumulation", "Assess the client for pneumothorax or mucus plugging", "Increase the FiO2 to 100%", "Obtain a stat chest X-ray"],
    correctIndex: 1,
    answer: "A sudden increase in peak inspiratory pressure with desaturation indicates increased airway resistance or decreased compliance. The nurse should immediately assess the client: auscultate for bilateral breath sounds (absent on one side suggests pneumothorax or mainstem intubation), check for mucus plugging (suction if needed), and assess for bronchospasm. Equipment checks are important but client assessment takes priority.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-resp-q3",
    type: "question",
    question: "A nurse is caring for a client with a chest tube. Continuous bubbling is observed in the water seal chamber during both inspiration and expiration. What does this indicate?",
    options: ["Normal air evacuation from the pleural space", "An air leak in the chest tube system", "The chest tube is properly positioned and functioning", "The client has developed a hemothorax"],
    correctIndex: 1,
    answer: "Continuous bubbling in the water seal chamber during both phases of respiration indicates an air leak in the system. The nurse should systematically check connections, starting from the insertion site and working toward the drainage system. Brief, intermittent bubbling during expiration or coughing may be normal with a pneumothorax, but continuous bubbling is pathological and requires investigation.",
    category: "Respiratory",
    difficulty: 2
  },
  {
    id: "rn-resp-q4",
    type: "question",
    question: "A client with COPD on long-term oxygen therapy asks why the flow rate is kept at 2 L/min. What is the best explanation?",
    options: ["Higher flow rates are always dangerous for all patients", "In chronic CO2 retainers, high oxygen can suppress the hypoxic drive, reducing respiratory stimulus", "Oxygen at higher rates causes pulmonary fibrosis", "Higher rates waste oxygen and are not more effective"],
    correctIndex: 1,
    answer: "Clients with chronic COPD may retain CO2 chronically. Their respiratory drive shifts from the normal CO2-driven stimulus to a hypoxic drive. Administering high-flow oxygen eliminates the hypoxic stimulus, potentially causing respiratory depression and CO2 narcosis. Low-flow oxygen (1-2 L/min) maintains SpO2 between 88-92%, sufficient for tissue oxygenation while preserving the hypoxic drive.",
    category: "Respiratory",
    difficulty: 2
  },
  {
    id: "rn-resp-q5",
    type: "question",
    question: "A nurse is prioritizing care for four respiratory clients. Which client should be assessed FIRST?",
    options: ["Client with pneumonia and SpO2 94% on 2L NC", "Client post-thoracotomy with 150 mL chest tube drainage over 8 hours", "Client with asthma who had wheezing 1 hour ago but now has a silent chest", "Client with TB on airborne precautions requesting pain medication"],
    correctIndex: 2,
    answer: "A silent chest in an asthma client who was previously wheezing is an ominous sign indicating severe bronchoconstriction with virtually no air movement. This represents imminent respiratory failure and potential respiratory arrest. The previous wheezing has stopped not because the client improved but because airflow is now too restricted to generate the sound. Immediate intervention with bronchodilators and preparation for intubation is critical.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-resp-q6",
    type: "question",
    question: "A client is receiving continuous BiPAP (bilevel positive airway pressure) for acute exacerbation of COPD. Which finding indicates BiPAP is failing and intubation may be necessary?",
    options: ["Respiratory rate decreased from 32 to 22 breaths per minute", "ABG shows pH 7.22, PaCO2 68, PaO2 54 after 2 hours on BiPAP", "Client is more alert and interactive", "SpO2 improved from 86% to 92%"],
    correctIndex: 1,
    answer: "Worsening or persistently abnormal ABGs after 1-2 hours of BiPAP (pH still below 7.25, rising PaCO2, low PaO2) indicate BiPAP failure. The client requires endotracheal intubation and mechanical ventilation. Other signs of BiPAP failure include worsening mental status, hemodynamic instability, inability to protect the airway, or inability to tolerate the mask.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-resp-q7",
    type: "question",
    question: "A client with a tracheostomy accidentally decannulates (the tube comes out). The stoma was created 3 days ago. What is the nurse's FIRST action?",
    options: ["Attempt to reinsert the tracheostomy tube", "Call a code blue", "Ventilate via the stoma with a bag-valve mask while preparing for oral intubation", "Cover the stoma and ventilate via mouth"],
    correctIndex: 2,
    answer: "For a fresh tracheostomy (less than 7 days), the tract is not yet mature and reinsertion may create a false passage. The nurse should call for help, provide ventilation through the stoma using a pediatric mask or adaptor connected to a bag-valve mask, and prepare for oral intubation as a backup. For mature tracts (>7 days), reinsertion with an obturator may be attempted by trained staff.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-resp-q8",
    type: "question",
    question: "A nurse is caring for a client on a ventilator. The ABG results show: pH 7.48, PaCO2 30, HCO3 24, PaO2 96. What ventilator change should the nurse anticipate?",
    options: ["Increase the tidal volume", "Decrease the respiratory rate", "Increase the FiO2", "Add PEEP"],
    correctIndex: 1,
    answer: "The ABG shows respiratory alkalosis (high pH, low CO2, normal HCO3). The client is being over-ventilated, blowing off too much CO2. Decreasing the respiratory rate will retain more CO2 and normalize the pH. Alternatively, decreasing tidal volume would achieve the same effect. Increasing tidal volume or rate would worsen the alkalosis. FiO2 and PEEP adjustments address oxygenation, not ventilation.",
    category: "Respiratory",
    difficulty: 2
  },
  {
    id: "rn-resp-q9",
    type: "question",
    question: "A client with a tension pneumothorax develops tracheal deviation, absent breath sounds on the affected side, and hemodynamic instability. What is the emergency intervention?",
    options: ["Stat chest X-ray before any intervention", "Needle decompression at the second intercostal space, midclavicular line on the affected side", "Chest tube insertion in the OR", "Administer bronchodilators immediately"],
    correctIndex: 1,
    answer: "Tension pneumothorax is a clinical diagnosis requiring immediate intervention without waiting for imaging. Needle decompression (large-bore needle at the 2nd intercostal space, midclavicular line) converts the tension pneumothorax to a simple pneumothorax, relieving the pressure that is shifting mediastinal structures and compressing the heart. This is followed by formal chest tube insertion.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-resp-q10",
    type: "question",
    question: "A nurse is educating a client about using a metered-dose inhaler (MDI) with a spacer. In which order should the client use their prescribed fluticasone (steroid) and albuterol (bronchodilator)?",
    options: ["Fluticasone first, then albuterol", "Albuterol first, then fluticasone after 1-2 minutes", "Either medication can be used first", "Mix both medications in one spacer"],
    correctIndex: 1,
    answer: "The bronchodilator (albuterol) should always be used first because it opens the airways, allowing the subsequent inhaled corticosteroid (fluticasone) to penetrate deeper into the lungs for better anti-inflammatory effect. Wait 1-2 minutes between medications. After using the steroid inhaler, the client must rinse the mouth to prevent oral candidiasis (thrush).",
    category: "Respiratory",
    difficulty: 1
  },
  {
    id: "rn-resp-q11",
    type: "question",
    question: "A nurse is caring for a client receiving prone positioning for severe ARDS. Which complication must the nurse monitor for most closely?",
    options: ["Pressure injuries on the face, chest, and anterior body surfaces", "Increased cardiac output", "Improved consciousness", "Decreased peak inspiratory pressures"],
    correctIndex: 0,
    answer: "Prone positioning improves oxygenation in ARDS by redistributing ventilation to dorsal lung regions, but it creates pressure injury risk on the face (especially forehead, chin, cheeks), anterior chest, iliac crests, and knees. The nurse must use appropriate padding, reposition the head every 2 hours, monitor skin integrity, secure all lines and tubes, and be prepared for emergency supine repositioning if needed.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-resp-q12",
    type: "question",
    question: "A client with community-acquired pneumonia has a sputum culture positive for Streptococcus pneumoniae. Which isolation precaution is appropriate?",
    options: ["Airborne precautions with N95 respirator", "Droplet precautions with surgical mask", "Contact precautions with gown and gloves", "Standard precautions only"],
    correctIndex: 3,
    answer: "Streptococcus pneumoniae (pneumococcal pneumonia) requires only standard precautions. It is not transmitted via the airborne route (unlike TB, which requires N95). Droplet precautions are used for Neisseria meningitidis, influenza, and pertussis. Understanding which organisms require specific isolation types is essential for NCLEX and clinical practice.",
    category: "Respiratory",
    difficulty: 2
  },
  {
    id: "rn-resp-q13",
    type: "question",
    question: "A client with a pulmonary embolism is started on a heparin drip with a target aPTT of 60-80 seconds. The current aPTT is 110 seconds. What should the nurse do?",
    options: ["Continue the current infusion rate", "Hold the infusion, notify the provider, and recheck aPTT per protocol", "Administer protamine sulfate immediately", "Increase the infusion rate"],
    correctIndex: 1,
    answer: "An aPTT of 110 seconds is above the therapeutic range (60-80 seconds), indicating over-anticoagulation and increased bleeding risk. The nurse should hold the heparin infusion per protocol, notify the provider, and recheck the aPTT as ordered (typically in 4-6 hours). Protamine sulfate (heparin reversal agent) is reserved for significant bleeding. The dose will be adjusted when restarted.",
    category: "Respiratory",
    difficulty: 2
  },
  {
    id: "rn-resp-q14",
    type: "question",
    question: "A nurse receives a client from the OR after a right pneumonectomy. The client should be positioned in which way?",
    options: ["On the left (non-operative) side only", "On the right (operative) side or supine", "In Trendelenburg position", "Prone to improve drainage"],
    correctIndex: 1,
    answer: "After pneumonectomy, the client should be positioned on the operative side or supine. Positioning on the operative side allows the remaining lung to fully expand on the non-operative side. The empty thoracic cavity gradually fills with serosanguineous fluid. Lying on the non-operative side could compress the remaining lung and cause respiratory compromise. Note: pneumonectomy clients do NOT have chest tubes.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-resp-q15",
    type: "question",
    question: "A nurse is interpreting an ABG: pH 7.32, PaCO2 48, HCO3 28, PaO2 68. What acid-base disturbance does this represent?",
    options: ["Respiratory acidosis, partially compensated", "Metabolic acidosis, uncompensated", "Respiratory alkalosis, fully compensated", "Mixed respiratory and metabolic acidosis"],
    correctIndex: 0,
    answer: "The pH is acidotic (below 7.35), PaCO2 is elevated (above 45, causing the acidosis = respiratory origin), and HCO3 is elevated (above 26, compensating by retaining bicarbonate). Since pH has not returned to normal, this is partially compensated respiratory acidosis. The elevated HCO3 shows the kidneys are attempting to buffer the respiratory acid by retaining bicarbonate, but compensation is not yet complete.",
    category: "Respiratory",
    difficulty: 2
  },
  {
    id: "rn-resp-q16",
    type: "question",
    question: "A client with cystic fibrosis is prescribed dornase alfa (Pulmozyme). What is the mechanism of action the nurse should explain?",
    options: ["It kills bacteria in the lungs", "It breaks down DNA in thick mucus, making secretions thinner and easier to clear", "It dilates the bronchioles", "It reduces inflammation in the airways"],
    correctIndex: 1,
    answer: "Dornase alfa is a recombinant human DNase enzyme that cleaves extracellular DNA released from neutrophils in the thick, viscous mucus of CF patients. Breaking down the DNA reduces mucus viscosity, improving airway clearance and reducing infection risk. It is administered via nebulizer daily. It does not have antimicrobial, bronchodilatory, or anti-inflammatory properties.",
    category: "Respiratory",
    difficulty: 2
  },
  {
    id: "rn-resp-q17",
    type: "question",
    question: "A nurse is caring for a client who had a thoracentesis 1 hour ago. Which finding requires immediate intervention?",
    options: ["Mild discomfort at the puncture site", "Decreased breath sounds on the affected side with tachypnea and tachycardia", "Clear amber-colored fluid removed during the procedure", "Mild anxiety about the results"],
    correctIndex: 1,
    answer: "Decreased breath sounds, tachypnea, and tachycardia after thoracentesis suggest a pneumothorax, the most common procedural complication. Air entered the pleural space during the procedure. The nurse should assess oxygen saturation, notify the provider immediately, and prepare for a stat chest X-ray. A chest tube may be needed if the pneumothorax is significant.",
    category: "Respiratory",
    difficulty: 2
  },
  {
    id: "rn-resp-q18",
    type: "question",
    question: "A nurse is assessing a client with suspected pulmonary embolism. Which diagnostic test is the gold standard for confirming PE?",
    options: ["D-dimer level", "Chest X-ray", "CT pulmonary angiography (CTPA)", "Arterial blood gas"],
    correctIndex: 2,
    answer: "CT pulmonary angiography (CTPA) is the gold standard for diagnosing pulmonary embolism. It provides direct visualization of the clot in the pulmonary vasculature with high sensitivity and specificity. D-dimer is a screening tool (high sensitivity but low specificity). Chest X-ray is often normal in PE. ABG may show hypoxemia but is non-specific. V/Q scan is an alternative when CTPA is contraindicated.",
    category: "Respiratory",
    difficulty: 2
  },
  // ============================================================
  // NEUROLOGICAL (17 cards)
  // ============================================================
  {
    id: "rn-neuro-q1",
    type: "question",
    question: "A client with a subarachnoid hemorrhage develops a severe headache on day 5 post-bleed. Transcranial Doppler shows increased velocity in the middle cerebral artery. What does the nurse suspect?",
    options: ["Rebleeding of the aneurysm", "Cerebral vasospasm", "Hydrocephalus", "Seizure activity"],
    correctIndex: 1,
    answer: "Cerebral vasospasm is a major complication of subarachnoid hemorrhage, typically occurring 4-14 days post-bleed (peak at days 7-10). Increased transcranial Doppler velocities indicate narrowing of cerebral arteries. Vasospasm can cause delayed cerebral ischemia and infarction. Treatment includes nimodipine (calcium channel blocker), hypertensive-hypervolemic-hemodilution (triple-H) therapy, and possibly endovascular intervention.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-neuro-q2",
    type: "question",
    question: "A nurse is caring for a client with a traumatic brain injury. The ICP monitor reads 28 mmHg. Which intervention should the nurse implement FIRST?",
    options: ["Administer IV mannitol as prescribed", "Elevate the head of bed to 30 degrees and ensure the head is midline", "Hyperventilate the client to a PaCO2 of 25 mmHg", "Prepare for emergent decompressive craniectomy"],
    correctIndex: 1,
    answer: "Normal ICP is 5-15 mmHg. An ICP of 28 mmHg requires immediate intervention. The FIRST action is proper positioning: HOB elevation to 30 degrees promotes venous drainage, and keeping the head midline prevents jugular vein compression. These simple interventions can reduce ICP by 5-10 mmHg. If ICP remains elevated, osmotic therapy (mannitol or hypertonic saline) and possible CSF drainage are next steps.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-neuro-q3",
    type: "question",
    question: "A client is brought to the ED after a seizure. Bystanders report the client was found down and may have been seizing for 20 minutes. The client is still seizing. After securing the airway, what is the priority medication?",
    options: ["Phenytoin (Dilantin) IV push", "Lorazepam (Ativan) IV followed by phenytoin loading", "Oral carbamazepine", "IM haloperidol"],
    correctIndex: 1,
    answer: "Status epilepticus (seizures lasting >5 minutes or recurrent without consciousness recovery) is a neurological emergency with increasing mortality as duration increases. The protocol is: IV benzodiazepine (lorazepam 4 mg IV, may repeat once) as the immediate first-line agent, followed by a phenytoin or fosphenytoin loading dose for seizure prevention. If seizures persist, propofol or midazolam infusion in an ICU setting.",
    category: "Neurological",
    difficulty: 3,
    image: imgPediatricSeizuresNew
  },
  {
    id: "rn-neuro-q4",
    type: "question",
    question: "A client with bacterial meningitis has a positive Kernig sign. What does this finding indicate?",
    options: ["Cranial nerve XII dysfunction", "Meningeal irritation demonstrated by resistance and pain with knee extension when the hip is flexed", "Frontal lobe damage", "Cerebellar dysfunction"],
    correctIndex: 1,
    answer: "Kernig sign is positive when the client experiences pain and resistance when the examiner attempts to extend the knee while the hip is flexed at 90 degrees. This stretches the inflamed meninges along the spinal cord, producing pain. Along with Brudzinski sign (involuntary hip flexion when the neck is flexed) and nuchal rigidity, it indicates meningeal irritation.",
    category: "Neurological",
    difficulty: 2,
    image: imgBacterialMeningitis
  },
  {
    id: "rn-neuro-q5",
    type: "question",
    question: "A nurse is assessing a client who presents with sudden unilateral facial drooping, arm weakness, and speech difficulty. Using the NIH Stroke Scale, the nurse determines the score is 18. What does this indicate?",
    options: ["Minor stroke not requiring intervention", "Moderate stroke requiring observation only", "Severe stroke requiring aggressive treatment and possible thrombectomy", "TIA that will resolve spontaneously"],
    correctIndex: 2,
    answer: "An NIHSS score of 18 indicates a severe stroke. Scores above 15 suggest large vessel occlusion and the client is a candidate for both IV tPA (within 4.5 hours) and mechanical thrombectomy (within 24 hours for select patients with large vessel occlusion on imaging). Time is critical: 'time is brain' with approximately 1.9 million neurons dying per minute during an acute ischemic stroke.",
    category: "Neurological",
    difficulty: 3,
    image: imgStroke
  },
  {
    id: "rn-neuro-q6",
    type: "question",
    question: "A client with myasthenia gravis is taking pyridostigmine. The client develops excessive salivation, bradycardia, diarrhea, and muscle fasciculations. What does this indicate?",
    options: ["Myasthenic crisis requiring more medication", "Cholinergic crisis from medication toxicity", "Allergic reaction to pyridostigmine", "Normal therapeutic effects"],
    correctIndex: 1,
    answer: "SLUDGE symptoms (Salivation, Lacrimation, Urination, Diarrhea, GI cramping, Emesis) plus bradycardia and fasciculations indicate cholinergic crisis (excessive acetylcholine from anticholinesterase overdose). The antidote is atropine. This contrasts with myasthenic crisis (worsening weakness from insufficient medication), which presents with ptosis, dysphagia, and respiratory failure WITHOUT SLUDGE symptoms.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-neuro-q7",
    type: "question",
    question: "A client with a C5 spinal cord injury asks the nurse what level of function they can expect. What should the nurse explain?",
    options: ["Full arm and hand function with lower body paralysis", "Ability to flex the elbow and shrug shoulders but no hand function; requires assistance with most ADLs", "Total paralysis below the chin with ventilator dependence", "Ability to walk with braces and a walker"],
    correctIndex: 1,
    answer: "C5 spinal cord injury preserves shoulder movement (deltoid) and elbow flexion (biceps) but loses hand function (C7-T1). The client can use adaptive equipment for some ADLs (feeding with adaptive utensils, electric wheelchair). Diaphragm function is preserved (C3-C5) so ventilator independence is expected. C3-C4 injuries may require ventilator support. C6 adds wrist extension, C7 adds elbow extension.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-neuro-q8",
    type: "question",
    question: "A client with a brain tumor is prescribed dexamethasone. What is the primary purpose of this medication in this context?",
    options: ["To shrink the tumor directly", "To reduce peritumoral cerebral edema and lower intracranial pressure", "To prevent seizures", "To treat the associated depression"],
    correctIndex: 1,
    answer: "Dexamethasone is a potent corticosteroid used in brain tumors primarily to reduce vasogenic cerebral edema surrounding the tumor. This decreases ICP and often dramatically improves neurological symptoms within hours. It does not treat the tumor itself. Side effects include hyperglycemia, immunosuppression, GI irritation, and with chronic use, Cushing syndrome and adrenal suppression.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-neuro-q9",
    type: "question",
    question: "A nurse is performing a neurological assessment. The client's pupils are 6mm bilaterally and non-reactive to light. The client is unresponsive and has no corneal reflex. What do these findings suggest?",
    options: ["Normal findings in a sleeping client", "Brainstem herniation or death", "Opiate overdose", "Pontine hemorrhage"],
    correctIndex: 1,
    answer: "Fixed, dilated pupils (6mm+) bilaterally with absent brainstem reflexes (corneal, gag) in an unresponsive client indicates severe brainstem dysfunction, likely from uncal herniation or brainstem death. This is an ominous neurological finding. Note: opioid overdose causes pinpoint (miotic) pupils, not dilated. Pontine hemorrhage also causes pinpoint pupils. Fixed bilateral dilation suggests herniation.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-neuro-q10",
    type: "question",
    question: "A client who had a stroke 2 days ago is being assessed for dysphagia before oral intake. Which assessment method is most appropriate?",
    options: ["Ask the client to drink a glass of water and observe", "Perform a bedside swallowing screen with small sips of water while monitoring for coughing or wet vocal quality", "Give the client a cracker and observe chewing ability", "Start with a regular diet and observe for 24 hours"],
    correctIndex: 1,
    answer: "A bedside swallowing screen involves giving small amounts of water while observing for signs of aspiration: coughing, choking, wet or gurgling voice quality, or oxygen desaturation. Silent aspiration (without coughing) occurs in up to 50% of dysphagic stroke patients. If the screen suggests difficulty, a formal speech-language pathology evaluation or modified barium swallow study should be ordered before any oral intake.",
    category: "Neurological",
    difficulty: 2,
    image: imgStroke
  },
  {
    id: "rn-neuro-q11",
    type: "question",
    question: "A nurse is educating a client about phenytoin (Dilantin) therapy. Which instruction is most important?",
    options: ["Take the medication with grapefruit juice to improve absorption", "Maintain excellent oral hygiene and see a dentist regularly because phenytoin causes gingival hyperplasia", "This medication is safe to stop abruptly if side effects occur", "Phenytoin has no significant drug interactions"],
    correctIndex: 1,
    answer: "Phenytoin commonly causes gingival hyperplasia (overgrowth of gum tissue), requiring meticulous oral hygiene and regular dental visits. Other important teaching: never stop abruptly (risk of status epilepticus), avoid alcohol, use reliable contraception (phenytoin reduces effectiveness of oral contraceptives), and maintain consistent vitamin D intake (phenytoin depletes vitamin D). Therapeutic level: 10-20 mcg/mL.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-neuro-q12",
    type: "question",
    question: "A client with Parkinson's disease on levodopa/carbidopa therapy has been experiencing an 'on-off' phenomenon. What does this mean?",
    image: imgParkinsonsNew,
    options: ["The client alternates between improvement and seizure activity", "The client experiences fluctuating periods of symptom control (on) and breakthrough symptoms (off) unpredictably", "The medication has stopped working completely", "The client is non-compliant with the medication schedule"],
    correctIndex: 1,
    answer: "The on-off phenomenon is a complication of long-term levodopa therapy where the client unpredictably alternates between 'on' periods (good symptom control, sometimes with dyskinesias) and 'off' periods (return of bradykinesia, rigidity, and tremor). It results from fluctuating dopamine levels. Management includes adjusting dose frequency, adding COMT inhibitors (entacapone), or considering deep brain stimulation.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-neuro-q13",
    type: "question",
    question: "A nurse is assessing a client after a lumbar puncture. The client reports a severe headache that worsens when sitting up. What is the most likely cause and intervention?",
    options: ["Tension headache treated with acetaminophen only", "Post-dural puncture headache from CSF leak; bed rest, hydration, caffeine, and possible epidural blood patch", "Meningitis requiring emergency antibiotics", "Migraine triggered by the procedure"],
    correctIndex: 1,
    answer: "Post-dural puncture headache results from CSF leaking through the dural puncture site, causing low CSF pressure. The headache characteristically worsens with upright position and improves when lying flat. Conservative management includes bed rest, IV or oral hydration, caffeine (causes cerebral vasoconstriction), and analgesics. If conservative measures fail, an epidural blood patch (injecting autologous blood to seal the leak) is highly effective.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-neuro-q14",
    type: "question",
    question: "A nurse is caring for a client who develops malignant hyperthermia during surgery. The client's temperature is 41°C, with muscle rigidity and tachycardia. What is the priority medication?",
    options: ["Acetaminophen", "Dantrolene sodium IV", "Propranolol", "Morphine sulfate"],
    correctIndex: 1,
    answer: "Dantrolene sodium is the specific antidote for malignant hyperthermia, a life-threatening hypermetabolic crisis triggered by volatile anesthetics or succinylcholine in genetically susceptible individuals. Dantrolene works by inhibiting calcium release from the sarcoplasmic reticulum, stopping the uncontrolled muscle contraction that generates massive heat. It should be available in all surgical suites.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-neuro-q15",
    type: "question",
    question: "A client with a ventriculostomy drain (external ventricular drain/EVD) has an ICP reading of 22 mmHg. The nurse opens the EVD stopcock to drain CSF. After draining 10 mL, the ICP drops to 12 mmHg. What should the nurse do next?",
    options: ["Continue draining until ICP reaches 5 mmHg", "Close the stopcock and continue monitoring ICP", "Lower the drainage bag to the floor to drain faster", "Administer IV mannitol now that ICP has normalized"],
    correctIndex: 1,
    answer: "After successfully reducing ICP to within normal range (5-15 mmHg) by draining CSF, the stopcock should be closed to resume ICP monitoring. Over-draining can cause ventricular collapse and subdural hematoma. The drainage bag level (usually set at the tragus of the ear as the zero reference point) should be prescribed by the neurosurgeon. Mannitol is not needed if CSF drainage was effective.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-neuro-q16",
    type: "question",
    question: "A client recovering from a right-hemispheric stroke consistently ignores food on the left side of the plate and does not acknowledge the left side of the body. Which condition is this?",
    options: ["Homonymous hemianopsia", "Unilateral neglect (hemispatial neglect)", "Expressive aphasia", "Agraphia"],
    correctIndex: 1,
    answer: "Unilateral neglect (hemispatial neglect) is a perceptual deficit common after right parietal lobe strokes where the client fails to attend to stimuli on the contralateral (left) side. It differs from hemianopsia (visual field loss) because the client is unaware of and does not compensate for the deficit. Nursing interventions include approaching from the affected side, placing items on the affected side, and using cueing strategies.",
    category: "Neurological",
    difficulty: 2,
    image: imgStroke
  },
  {
    id: "rn-neuro-q17",
    type: "question",
    question: "A client with a head injury develops clear fluid draining from the right ear. What should the nurse do?",
    options: ["Pack the ear with gauze to absorb the fluid", "Test the fluid for glucose and loosely cover the ear with a sterile dressing", "Irrigate the ear with normal saline", "Insert ear drops as prescribed for otitis"],
    correctIndex: 1,
    answer: "Clear drainage from the ear after head trauma suggests CSF otorrhea from a basilar skull fracture. CSF tests positive for glucose (halo sign on gauze). The ear should NEVER be packed (increases infection risk and ICP). Apply a loose sterile dressing, elevate the head of bed 30 degrees, instruct the client not to blow their nose or cough forcefully, and notify the neurosurgeon. Prophylactic antibiotics may be indicated.",
    category: "Neurological",
    difficulty: 2
  },
  // ============================================================
  // GI (16 cards)
  // ============================================================
  {
    id: "rn-gi-q1",
    type: "question",
    question: "A client with portal hypertension and esophageal varices has a Sengstaken-Blakemore tube inserted for bleeding control. Which complication is the nurse most concerned about?",
    options: ["Nausea from the tube", "Airway obstruction from balloon migration", "Mild discomfort in the throat", "Inability to eat solid food"],
    correctIndex: 1,
    answer: "The most life-threatening complication of a Sengstaken-Blakemore tube is upward migration of the gastric balloon, which can occlude the airway. Scissors must be kept at the bedside at all times to cut the tube and deflate the balloons immediately if respiratory distress occurs. The client should be in a monitored setting with suction available. The gastric balloon pressure must be checked regularly.",
    image: imgEsophagealVarices,
    category: "GI",
    difficulty: 3
  },
  {
    id: "rn-gi-q2",
    type: "question",
    question: "A nurse is caring for a client with acute liver failure who develops asterixis (liver flap). What does this finding indicate?",
    options: ["Improvement in liver function", "Hepatic encephalopathy from elevated ammonia levels", "Normal postoperative finding", "Vitamin K deficiency"],
    correctIndex: 1,
    answer: "Asterixis (flapping tremor of the hands when wrists are dorsiflexed) is a classic sign of hepatic encephalopathy caused by accumulated ammonia and other toxins the failing liver cannot metabolize. Ammonia crosses the blood-brain barrier and disrupts neurotransmitter function. Treatment includes lactulose (converts NH3 to NH4+ for fecal excretion) and rifaximin (reduces ammonia-producing gut bacteria). Protein restriction may be necessary.",
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q3",
    type: "question",
    question: "A nurse is assessing a client with a bowel obstruction. The client vomits fecal-smelling material. What does this indicate?",
    options: ["The client has eaten contaminated food", "Late-stage or distal bowel obstruction with bacterial overgrowth", "Normal finding in early obstruction", "Gastric ulcer perforation"],
    correctIndex: 1,
    answer: "Feculent vomiting (fecal-odor emesis) indicates late-stage or distal (lower) bowel obstruction. Bacteria in the stagnant bowel contents proliferate and produce gas and waste products that travel retrograde. This is an ominous sign suggesting possible bowel necrosis and perforation risk. The client needs emergent surgical evaluation, NG decompression, IV antibiotics, and fluid resuscitation.",
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q4",
    type: "question",
    question: "A client with acute upper GI bleeding has the following vital signs: HR 118, BP 86/52, RR 24, SpO2 96%. The nurse estimates blood loss class. What class of hemorrhage do these findings suggest?",
    options: ["Class I (less than 15% blood volume loss)", "Class II (15-30% blood volume loss)", "Class III (30-40% blood volume loss)", "Class IV (greater than 40% blood volume loss)"],
    correctIndex: 2,
    answer: "Tachycardia above 100, hypotension, and tachypnea suggest Class III hemorrhage (30-40% blood volume loss, approximately 1.5-2 liters). Class I has minimal vital sign changes. Class II shows tachycardia but maintained BP. Class III shows tachycardia, hypotension, and confusion. Class IV adds altered consciousness and may require massive transfusion protocol activation.",
    image: imgGIBleed,
    category: "GI",
    difficulty: 3
  },
  {
    id: "rn-gi-q5",
    type: "question",
    question: "A client with Crohn's disease is prescribed infliximab (Remicade). Before starting therapy, which screening test must be completed?",
    options: ["Hepatitis C antibody", "TB skin test (PPD) or interferon-gamma release assay", "HIV screening", "Pregnancy test"],
    correctIndex: 1,
    answer: "Infliximab is a TNF-alpha inhibitor that suppresses immune function. Before starting therapy, clients must be screened for latent tuberculosis (PPD or IGRA) because TNF-alpha inhibitors can reactivate latent TB, leading to disseminated disease. If the test is positive, prophylactic treatment for latent TB must be completed before starting infliximab. Hepatitis B screening is also recommended.",
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q6",
    type: "question",
    question: "A nurse is caring for a client with a T-tube after cholecystectomy. On post-op day 1, the T-tube drains 450 mL of green-brown fluid. What should the nurse do?",
    options: ["Clamp the tube immediately", "Document as expected drainage and continue monitoring", "Notify the surgeon about excessive drainage", "Flush the tube with 30 mL normal saline"],
    correctIndex: 1,
    answer: "Normal T-tube drainage is 300-500 mL of green-brown bile in the first 24 hours, gradually decreasing over several days. The bile is draining from the common bile duct while post-surgical edema resolves. The nurse should monitor the amount, color, and consistency of drainage. Never clamp without a provider order. Report sudden increase in drainage, change to bloody color, or signs of peritonitis.",
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q7",
    type: "question",
    question: "A client with an ileostomy has liquid green output of 1,200 mL over 8 hours. What is the nurse's primary concern?",
    options: ["Normal ileostomy output", "Dehydration and electrolyte imbalances from high-output ostomy", "Infection of the stoma", "Bowel obstruction"],
    correctIndex: 1,
    answer: "Normal ileostomy output is 500-800 mL/day of liquid-to-pasty consistency. Output of 1,200 mL in 8 hours (potential 3,600 mL/day) is a high-output ostomy that puts the client at significant risk for dehydration, hyponatremia, hypokalemia, and metabolic acidosis (loss of bicarbonate from small intestine). The nurse should monitor I&O strictly, replace fluids and electrolytes, and notify the provider.",
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q8",
    type: "question",
    question: "A client with suspected Zollinger-Ellison syndrome has severe peptic ulcer disease refractory to standard PPI therapy. What diagnostic finding confirms this syndrome?",
    options: ["Elevated serum amylase", "Elevated fasting serum gastrin level with positive secretin stimulation test", "Low serum albumin", "Positive H. pylori breath test"],
    correctIndex: 1,
    answer: "Zollinger-Ellison syndrome is caused by a gastrin-secreting tumor (gastrinoma) that produces massive gastric acid hypersecretion. Diagnosis is confirmed by a markedly elevated fasting serum gastrin level (often >1,000 pg/mL) and a positive secretin stimulation test (paradoxical rise in gastrin after secretin injection, which normally suppresses gastrin). Treatment includes high-dose PPIs and surgical tumor resection.",
    category: "GI",
    difficulty: 3,
    image: imgPepticUlcerNew
  },
  {
    id: "rn-gi-q9",
    type: "question",
    question: "A nurse is administering a blood transfusion. The client develops fever, flank pain, and tea-colored urine 15 minutes into the transfusion. What is the priority action?",
    options: ["Slow the transfusion rate and administer acetaminophen", "STOP the transfusion immediately, keep the IV line open with NS, and notify the blood bank", "Continue the transfusion and monitor closely", "Administer diphenhydramine and restart the transfusion"],
    correctIndex: 1,
    answer: "Fever, flank pain, and tea-colored urine (hemoglobinuria) indicate an acute hemolytic transfusion reaction, a life-threatening emergency caused by ABO incompatibility. The nurse must STOP the transfusion immediately, keep the IV open with NS (new tubing), send the blood bag and tubing to the blood bank for analysis, and draw blood samples (direct Coombs test, free hemoglobin). Monitor for DIC, renal failure, and shock.",
    image: imgAcuteHemolyticReaction,
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q10",
    type: "question",
    question: "A client with hepatitis C is prescribed sofosbuvir/ledipasvir (Harvoni). Which statement by the client indicates understanding of the treatment?",
    options: ["I will take this medication for 6 months to 1 year", "This treatment has a greater than 95% cure rate and lasts 8-12 weeks", "I need weekly blood tests while on this medication", "This medication cannot be taken with food"],
    correctIndex: 1,
    answer: "Direct-acting antivirals (DAAs) like sofosbuvir/ledipasvir have revolutionized hepatitis C treatment, achieving sustained virologic response (SVR/cure) rates above 95% with 8-12 weeks of oral therapy. This represents a dramatic improvement over older interferon-based regimens. The client should avoid amiodarone (risk of fatal bradycardia) and certain acid-reducing medications that can decrease drug absorption.",
    category: "GI",
    difficulty: 2,
    image: imgHepatitisC
  },
  {
    id: "rn-gi-q11",
    type: "question",
    question: "A nurse is caring for a client post-bariatric surgery (Roux-en-Y gastric bypass). The client reports increasing left shoulder pain on day 1. What is the nurse's concern?",
    options: ["Musculoskeletal pain from positioning during surgery", "Referred pain from anastomotic leak causing diaphragmatic irritation", "Normal postoperative gas pain", "Pneumonia on the left side"],
    correctIndex: 1,
    answer: "Left shoulder pain after abdominal surgery can indicate diaphragmatic irritation from an anastomotic leak. Gastric contents leaking into the peritoneum cause peritonitis that irritates the diaphragm, referring pain to the shoulder via the phrenic nerve. Other signs include tachycardia (often the earliest sign), fever, and abdominal pain. An upper GI series with water-soluble contrast can confirm the leak.",
    category: "GI",
    difficulty: 3,
    image: imgBariatricFlashcard
  },
  {
    id: "rn-gi-q12",
    type: "question",
    question: "A client with ulcerative colitis is being prepared for a total proctocolectomy with ileoanal pouch (J-pouch). What should the nurse teach about the expected outcome?",
    options: ["The client will need a permanent ileostomy", "The client will have continent stool through the anus but may have 4-8 loose stools per day initially", "Ulcerative colitis may recur in the J-pouch", "The client will have normal, formed bowel movements immediately after surgery"],
    correctIndex: 1,
    answer: "A J-pouch (ileoanal anastomosis) allows the client to have continent stool through the anus, avoiding a permanent ostomy. Initially, the client may have 4-8 loose stools per day, which typically decreases to 4-6 as the pouch adapts over 6-12 months. Since the entire colon and rectum are removed, ulcerative colitis cannot recur. Pouchitis (inflammation of the J-pouch) can occur and is treated with antibiotics.",
    image: imgUlcerativeColitis,
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q13",
    type: "question",
    question: "A nurse is managing total parenteral nutrition (TPN) for a malnourished client. The TPN bag runs out and a new one will not be available for 2 hours. What should the nurse do?",
    options: ["Hang D10W at the same rate until the new bag arrives", "Wait for the new bag without any intervention", "Hang normal saline at a rapid rate", "Discontinue the IV access since it is temporary"],
    correctIndex: 0,
    answer: "Abruptly stopping TPN can cause rebound hypoglycemia because the high glucose concentration in TPN stimulates insulin production. When TPN is suddenly discontinued, insulin levels remain elevated while the glucose source is removed, causing dangerous hypoglycemia. Hanging D10W (10% dextrose) at the same rate prevents this rebound effect until the new TPN bag is available.",
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q14",
    type: "question",
    question: "A client with acute pancreatitis has a Ranson score of 6. What does this indicate about the prognosis?",
    options: ["Mild pancreatitis with expected full recovery", "Moderate pancreatitis requiring monitoring only", "Severe pancreatitis with a mortality rate exceeding 40%", "The score is not clinically significant"],
    correctIndex: 2,
    answer: "Ranson's criteria predict the severity and mortality of acute pancreatitis. A score of 0-2 indicates mild disease with less than 5% mortality. A score of 3-4 indicates moderate severity with 15-20% mortality. A score of 5-6 indicates severe pancreatitis with mortality exceeding 40%. A score above 6 carries near 100% mortality. The client needs ICU admission with aggressive fluid resuscitation and close monitoring for organ failure.",
    category: "GI",
    difficulty: 3,
    image: imgPancreatitis
  },
  {
    id: "rn-gi-q15",
    type: "question",
    question: "A nurse is caring for a client with a newly diagnosed C. difficile infection. Which isolation precaution is required?",
    options: ["Standard precautions only", "Droplet precautions", "Contact precautions with hand washing using soap and water (not alcohol-based sanitizer)", "Airborne precautions with N95"],
    correctIndex: 2,
    answer: "C. difficile requires contact precautions (gown and gloves) with a critical distinction: hand washing must be done with soap and water because alcohol-based hand sanitizers do NOT kill C. difficile spores. Spores can persist on surfaces for months, so environmental cleaning with bleach-based disinfectants is required. Discontinue offending antibiotics if possible and start oral vancomycin or fidaxomicin.",
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q16",
    type: "question",
    question: "A client post-liver transplant is prescribed tacrolimus (Prograf). Which assessment finding requires immediate nursing action?",
    options: ["Mild tremor in the hands", "Serum creatinine rising from 1.0 to 2.8 mg/dL over 3 days", "Mild headache", "Increased appetite"],
    correctIndex: 1,
    answer: "A rapid rise in serum creatinine indicates nephrotoxicity, the most significant adverse effect of tacrolimus. Nephrotoxicity can lead to acute kidney injury and chronic kidney disease. The nurse should hold the tacrolimus, notify the transplant team, check the tacrolimus trough level (therapeutic: 5-15 ng/mL), and monitor renal function. Dose adjustment or medication switch may be needed.",
    category: "GI",
    difficulty: 3
  },
  // ============================================================
  // ENDOCRINE (16 cards)
  // ============================================================
  {
    id: "rn-endo-q1",
    type: "question",
    question: "A client with DKA has a blood glucose of 480 mg/dL and potassium of 5.6 mEq/L. After starting insulin and fluids, the potassium drops to 3.2 mEq/L. Why did this occur?",
    options: ["Insulin has no effect on potassium", "Insulin drives potassium into cells along with glucose, and the acidosis correction also shifts potassium intracellularly", "The IV fluids diluted the potassium", "The kidneys suddenly excreted all the potassium"],
    correctIndex: 1,
    answer: "In DKA, potassium shifts extracellularly due to acidosis (H+ enters cells, K+ exits to maintain electroneutrality) and insulin deficiency (insulin normally drives K+ into cells). The initial hyperkalemia is misleading because total body K+ is depleted from osmotic diuresis. When insulin is given, K+ shifts back into cells rapidly, unmasking the true deficit. This is why potassium must be monitored hourly during DKA treatment.",
    category: "Endocrine",
    difficulty: 3,
    image: imgDKA
  },
  {
    id: "rn-endo-q2",
    type: "question",
    question: "A nurse is assessing a client with suspected pheochromocytoma. Which assessment finding is most characteristic?",
    options: ["Chronic stable hypertension responding to ACE inhibitors", "Paroxysmal hypertension with severe headache, diaphoresis, and palpitations", "Hypotension with orthostatic changes", "Gradually progressive weight gain over months"],
    correctIndex: 1,
    answer: "Pheochromocytoma is a catecholamine-producing adrenal tumor. The classic presentation is paroxysmal (episodic) hypertension that can be severe (BP > 200/120), accompanied by the classic triad: headache, diaphoresis, and palpitations. The episodes can be triggered by exercise, stress, anesthesia, or even abdominal palpation. 24-hour urine for metanephrines and catecholamines is the diagnostic test. Avoid abdominal palpation in suspected cases.",
    category: "Endocrine",
    difficulty: 3
  },
  {
    id: "rn-endo-q3",
    type: "question",
    question: "A client with type 1 diabetes is using an insulin pump. The client's blood glucose has been persistently elevated at 350-400 mg/dL for the past 4 hours despite bolus corrections. What should the nurse suspect?",
    options: ["The insulin is expired", "Infusion site failure (kinked cannula, dislodged site, or insulin crystallization)", "The client is eating too much", "The pump battery is dead"],
    correctIndex: 1,
    answer: "Persistently elevated glucose despite pump corrections suggests infusion site failure. The cannula may be kinked, dislodged, or occluded by insulin crystallization. The nurse should instruct the client to change the infusion site AND tubing, administer a correction dose via syringe (bypassing the pump), check for ketones (clients on pumps have no long-acting insulin depot and can develop DKA rapidly), and then troubleshoot the pump.",
    category: "Endocrine",
    difficulty: 3
  },
  {
    id: "rn-endo-q4",
    type: "question",
    question: "A nurse is caring for a client who received radioactive iodine (I-131) therapy for Graves' disease. Which precaution is essential?",
    options: ["The client needs airborne isolation for 2 weeks", "Limit close contact with pregnant women and children for a specified period; use dedicated bathroom", "The client must wear a lead apron at all times", "No precautions are necessary after the first 24 hours"],
    correctIndex: 1,
    answer: "After I-131 therapy, the client emits low-level radiation primarily through body fluids (urine, saliva, sweat). Precautions include limiting close contact with pregnant women and small children (typically for 1-7 days depending on dose), using a dedicated toilet (flush twice, wipe up any spills), sleeping alone, and using separate eating utensils. The radiation level decreases rapidly (half-life is 8 days).",
    category: "Endocrine",
    difficulty: 2,
    image: imgGravesDisease
  },
  {
    id: "rn-endo-q5",
    type: "question",
    question: "A client with acromegaly reports increasing shoe size, headaches, and visual field changes. What is the most likely cause?",
    options: ["Hypothyroidism", "Growth hormone-secreting pituitary adenoma", "Adrenal cortical hyperplasia", "Parathyroid hyperplasia"],
    correctIndex: 1,
    answer: "Acromegaly is caused by excessive growth hormone (GH) from a pituitary adenoma in adults (after epiphyseal closure). Features include enlargement of hands, feet, jaw (prognathism), coarsening of facial features, headaches, and visual field defects (bitemporal hemianopsia) from tumor compression of the optic chiasm. Diagnosis is via elevated IGF-1 and failure to suppress GH with oral glucose tolerance test.",
    image: imgAcromegaly,
    category: "Endocrine",
    difficulty: 2,
    image: imgPituitaryGlands
  },
  {
    id: "rn-endo-q6",
    type: "question",
    question: "A client with a new insulin regimen is prescribed NPH and regular insulin to be mixed in the same syringe. Which technique is correct?",
    options: ["Draw up NPH first, then regular insulin", "Draw up regular (clear) insulin first, then NPH (cloudy)", "Either can be drawn up first", "NPH and regular cannot be mixed in the same syringe"],
    correctIndex: 1,
    answer: "The rule is 'Clear before Cloudy.' Regular insulin (clear) is always drawn up first to prevent contamination with NPH (cloudy), which contains protamine that would alter the regular insulin's action. After injecting air into both vials (NPH first, then regular), draw up regular insulin first, then NPH. This prevents NPH particles from entering the regular insulin vial.",
    category: "Endocrine",
    difficulty: 1
  },
  {
    id: "rn-endo-q7",
    type: "question",
    question: "A client on prednisone 40 mg daily for 3 months is being tapered. The client asks why the medication cannot be stopped all at once. What is the nurse's best explanation?",
    options: ["Stopping suddenly would cause the original disease to return immediately", "Long-term steroids suppress your adrenal glands. Stopping suddenly can cause a life-threatening adrenal crisis because your body cannot produce enough cortisol on its own", "The medication needs to be gradually reduced to prevent allergic reactions", "Stopping suddenly would cause rebound weight gain"],
    correctIndex: 1,
    answer: "Chronic exogenous corticosteroid use suppresses the hypothalamic-pituitary-adrenal (HPA) axis through negative feedback. The adrenal glands atrophy and cannot produce adequate cortisol if the medication is stopped abruptly. Adrenal crisis (Addisonian crisis) presents with severe hypotension, hypoglycemia, hyperkalemia, and cardiovascular collapse. Tapering allows the HPA axis to gradually recover endogenous cortisol production.",
    image: imgAddisons,
    category: "Endocrine",
    difficulty: 2,
    image: imgPituitaryGlands
  },
  {
    id: "rn-endo-q8",
    type: "question",
    question: "A nurse is caring for a client with diabetes who takes metformin. The client is scheduled for a CT scan with IV contrast. What is the correct protocol?",
    options: ["Continue metformin as scheduled", "Hold metformin for 48 hours after the contrast administration and monitor renal function", "Hold metformin for 1 week before the scan", "Switch to insulin permanently"],
    correctIndex: 1,
    answer: "Metformin must be held for 48 hours after IV contrast administration because contrast can cause acute kidney injury, and impaired kidneys cannot clear metformin, leading to dangerous lactic acidosis. Renal function (creatinine/eGFR) should be rechecked before restarting metformin. If baseline renal function is already impaired (eGFR < 30), metformin may need to be held before the scan as well.",
    category: "Endocrine",
    difficulty: 2
  },
  {
    id: "rn-endo-q9",
    type: "question",
    question: "A client with type 2 diabetes is started on an SGLT2 inhibitor (empagliflozin). Which unique side effect should the nurse monitor for?",
    options: ["Hypoglycemia as the primary concern", "Genital yeast infections and urinary tract infections due to glycosuria", "Weight gain", "Severe constipation"],
    correctIndex: 1,
    answer: "SGLT2 inhibitors work by blocking glucose reabsorption in the proximal tubule, causing glucosuria (glucose in urine). The glucose-rich urine creates an environment conducive to yeast and bacterial growth, increasing the risk of genital mycotic infections and UTIs. Clients should maintain good perineal hygiene and report symptoms promptly. Benefits include weight loss, blood pressure reduction, and cardiovascular/renal protection.",
    category: "Endocrine",
    difficulty: 2
  },
  {
    id: "rn-endo-q10",
    type: "question",
    question: "A client with a new diagnosis of type 1 diabetes asks about the 'honeymoon period.' What should the nurse explain?",
    options: ["It is a permanent remission of diabetes", "It is a temporary phase where remaining beta cells produce some insulin, requiring less exogenous insulin, but it always ends", "It means the client was misdiagnosed and does not have diabetes", "It refers to the time before diagnosis when symptoms were mild"],
    correctIndex: 1,
    answer: "The honeymoon period occurs shortly after diagnosis and insulin initiation in type 1 diabetes. The remaining functional beta cells recover temporarily (possibly due to reduced glucose toxicity after insulin therapy begins) and produce some endogenous insulin, reducing exogenous insulin requirements. This phase typically lasts weeks to months but ALWAYS ends as autoimmune destruction of beta cells continues. The client must understand that insulin will eventually be needed in full doses.",
    category: "Endocrine",
    difficulty: 2
  },
  {
    id: "rn-endo-q11",
    type: "question",
    question: "A nurse is monitoring a client with Addisonian crisis. Which set of lab values is most consistent with this diagnosis?",
    options: ["Na+ 148, K+ 3.0, glucose 180", "Na+ 122, K+ 6.4, glucose 48", "Na+ 140, K+ 4.0, glucose 100", "Na+ 155, K+ 2.8, glucose 350"],
    correctIndex: 1,
    answer: "Addisonian crisis (acute adrenal insufficiency) produces the classic triad: hyponatremia (cortisol and aldosterone deficiency impair sodium retention), hyperkalemia (aldosterone deficiency reduces potassium excretion), and hypoglycemia (cortisol is needed for gluconeogenesis). Treatment is IV hydrocortisone (addresses both cortisol and mineralocorticoid deficiency) and aggressive NS fluid resuscitation.",
    image: imgAddisons,
    category: "Endocrine",
    difficulty: 3
  },
  {
    id: "rn-endo-q12",
    type: "question",
    question: "A client with hypothyroidism has a TSH of 28 mIU/L and free T4 of 0.4 ng/dL. What do these lab values indicate?",
    options: ["Normal thyroid function", "Primary hypothyroidism with the pituitary trying to stimulate the failing thyroid", "Hyperthyroidism", "Secondary hypothyroidism from pituitary failure"],
    correctIndex: 1,
    answer: "Elevated TSH with low free T4 is the hallmark of primary hypothyroidism. The thyroid gland is failing, so T4 production drops. The pituitary gland detects the low T4 and increases TSH secretion in an attempt to stimulate the thyroid (negative feedback loop). In secondary hypothyroidism (pituitary failure), both TSH and T4 would be low because the pituitary cannot produce adequate TSH.",
    category: "Endocrine",
    difficulty: 2,
    image: imgHypothyroidismNew
  },
  {
    id: "rn-endo-q13",
    type: "question",
    question: "A client with type 1 diabetes has a continuous glucose monitor (CGM) that alerts to a blood glucose of 55 mg/dL. The client is drowsy and unable to swallow safely. What is the priority intervention?",
    options: ["Give orange juice by mouth", "Administer glucagon 1 mg IM or subcutaneously", "Start a D50 IV push", "Wait for the glucose to self-correct"],
    correctIndex: 1,
    answer: "For a hypoglycemic client who is unable to swallow safely (risk of aspiration), oral carbohydrates are contraindicated. Glucagon 1 mg IM or subcutaneously stimulates hepatic glycogenolysis, releasing glucose from liver glycogen stores. If IV access is available, D50 (50% dextrose) 25-50 mL IV push is preferred for immediate glucose correction. Position the client on their side to prevent aspiration if vomiting occurs (glucagon commonly causes nausea).",
    category: "Endocrine",
    difficulty: 2
  },
  {
    id: "rn-endo-q14",
    type: "question",
    question: "A client with diabetes insipidus is being treated with desmopressin (DDAVP). Which assessment indicates the medication is effective?",
    options: ["Blood glucose is normalized", "Urine output decreases and urine specific gravity increases", "Blood pressure decreases significantly", "Serum potassium normalizes"],
    correctIndex: 1,
    answer: "DDAVP replaces the deficient ADH, promoting water reabsorption in the collecting ducts. Effective treatment is indicated by decreased urine output (from massive polyuria to normal volumes), increased urine specific gravity (from very dilute <1.005 to more concentrated), decreased serum osmolality, normalized serum sodium, and decreased thirst. Monitor for water intoxication (hyponatremia) from over-treatment.",
    category: "Endocrine",
    difficulty: 2,
    image: imgDiabetesInsipidus
  },
  {
    id: "rn-endo-q15",
    type: "question",
    question: "A nurse is teaching a client about sick day rules for type 1 diabetes. Which instruction is most important?",
    options: ["Skip insulin doses when unable to eat", "NEVER skip insulin during illness; check blood glucose and ketones every 3-4 hours; increase fluid intake", "Take double the usual insulin dose when sick", "Only test blood glucose once daily when sick"],
    correctIndex: 1,
    answer: "During illness, counter-regulatory hormones (cortisol, glucagon, catecholamines) increase blood glucose even if the client is not eating. Skipping insulin during illness is the number one cause of DKA. Sick day rules: continue insulin (may need to increase), check BG every 3-4 hours, check urine or blood ketones, drink plenty of sugar-free fluids, and call the provider if BG stays above 240 mg/dL or ketones are present.",
    category: "Endocrine",
    difficulty: 2
  },
  {
    id: "rn-endo-q16",
    type: "question",
    question: "A client post-transsphenoidal hypophysectomy is instructed to avoid which activities? Select the most critical instruction.",
    image: imgPituitaryGlands,
    options: ["Avoid lying flat for 2 weeks", "Do not bend, strain, cough forcefully, or blow the nose to prevent CSF leak", "Avoid all dairy products", "Do not take thyroid medication for 6 months"],
    correctIndex: 1,
    answer: "After transsphenoidal surgery (through the nose/sinus to access the pituitary), the surgical site is at risk for CSF leak. Activities that increase intracranial pressure (bending, straining, coughing, sneezing, blowing the nose) can disrupt the repair and cause CSF rhinorrhea. The client should also avoid brushing teeth for 2 weeks (use mouthwash instead) and report any clear nasal drainage (test for glucose to identify CSF).",
    category: "Endocrine",
    difficulty: 2,
    image: imgPituitaryGlands
  },
  // ============================================================
  // RENAL/GU (16 cards)
  // ============================================================
  {
    id: "rn-renal-q1",
    type: "question",
    question: "A client receiving hemodialysis through an AV fistula develops severe bleeding from the fistula site. What is the priority nursing action?",
    options: ["Apply a tourniquet proximal to the fistula", "Apply firm, direct pressure to the site and call for help", "Elevate the arm above the heart", "Apply ice to the site"],
    correctIndex: 1,
    answer: "Severe bleeding from an AV fistula is a medical emergency because the fistula carries high-flow arterial blood. The priority is applying firm, direct pressure to the bleeding site. Do NOT apply a tourniquet as this can clot and destroy the fistula. Call for help while maintaining pressure. If bleeding does not stop with direct pressure, the client needs emergent surgical evaluation.",
    category: "Renal/GU",
    difficulty: 2,
    image: imgAVFistulaFlashcard
  },
  {
    id: "rn-renal-q2",
    type: "question",
    question: "A nurse is calculating the fluid allowance for a client on hemodialysis. The client's urine output is 200 mL/day. What is the typical daily fluid restriction?",
    options: ["Unrestricted fluid intake", "Urine output plus 500-1,000 mL per day", "500 mL per day regardless of urine output", "3,000 mL per day"],
    correctIndex: 1,
    answer: "The standard fluid restriction for hemodialysis patients is the previous day's urine output plus 500-1,000 mL for insensible losses (breathing, sweating). For this client: 200 mL + 500-1,000 mL = 700-1,200 mL/day. Weight gain between dialysis sessions should not exceed 2-3 kg (indicating 2-3 liters of retained fluid). Teaching should include ice chips, hard candy, and mouth rinses to manage thirst.",
    category: "Renal/GU",
    difficulty: 2,
    image: imgHemodialysis
  },
  {
    id: "rn-renal-q3",
    type: "question",
    question: "A nurse is caring for a client with chronic kidney disease whose phosphorus is 8.2 mg/dL and calcium is 7.0 mg/dL. The client is prescribed sevelamer (Renagel). When should this medication be taken?",
    options: ["On an empty stomach in the morning", "With meals to bind dietary phosphorus in the GI tract", "At bedtime with a full glass of water", "Only when phosphorus levels are above 10 mg/dL"],
    correctIndex: 1,
    answer: "Sevelamer is a non-calcium, non-aluminum phosphate binder that must be taken WITH meals. It works by binding dietary phosphorus in the GI tract, preventing absorption. Unlike calcium-based binders, sevelamer does not contribute to calcium overload or vascular calcification. Taking it without food would be ineffective as there is no dietary phosphorus to bind. It must not be crushed.",
    category: "Renal/GU",
    difficulty: 2,
    image: imgCKD
  },
  {
    id: "rn-renal-q4",
    type: "question",
    question: "A client with end-stage renal disease on erythropoietin (epoetin alfa) therapy has a hemoglobin of 12.8 g/dL. What should the nurse anticipate?",
    options: ["Continue the current dose", "Reduce or hold the dose because the hemoglobin exceeds the target range", "Increase the dose to achieve a hemoglobin of 14 g/dL", "Switch to iron supplementation only"],
    correctIndex: 1,
    answer: "The target hemoglobin for CKD patients on erythropoiesis-stimulating agents (ESAs) is 10-11 g/dL. Hemoglobin above 12 g/dL increases the risk of cardiovascular events (stroke, MI, death) and thromboembolic events. The dose should be reduced or held. The nurse should also ensure adequate iron stores (ferritin >100, TSAT >20%) as iron is needed for effective erythropoiesis.",
    category: "Renal/GU",
    difficulty: 3
  },
  {
    id: "rn-renal-q5",
    type: "question",
    question: "A client on peritoneal dialysis notes that the dialysate outflow is slower than usual and the abdomen feels distended. What should the nurse assess first?",
    options: ["Check if the client has eaten a large meal", "Reposition the client and check for catheter kinks, fibrin clots, or constipation", "Increase the dwell time", "Add more dialysate to the next exchange"],
    correctIndex: 1,
    answer: "Slow dialysate outflow commonly results from catheter malposition, kinking, or obstruction by fibrin clots. Constipation is another frequent cause as a full colon can compress the catheter. The nurse should reposition the client (side to side, sit upright), check tubing for kinks, and assess bowel function. If obstruction persists, catheter flushing with heparinized saline per protocol may be needed.",
    category: "Renal/GU",
    difficulty: 2,
    image: imgPeritonealDialysis
  },
  {
    id: "rn-renal-q6",
    type: "question",
    question: "A nurse is educating a client about the renal diet for stage 4 CKD. Which dietary restrictions are appropriate?",
    options: ["Low sodium, low potassium, low phosphorus, and moderate protein (0.6-0.8 g/kg/day)", "High protein, unrestricted sodium, unlimited fluids", "Low calorie, high fiber, unlimited potassium", "No dietary restrictions are needed until dialysis"],
    correctIndex: 0,
    answer: "The CKD diet restricts sodium (2,000 mg/day to control BP and edema), potassium (to prevent hyperkalemia), phosphorus (to prevent renal osteodystrophy), and moderate protein (to reduce uremic waste production). Calories should be adequate to prevent malnutrition. Once on dialysis, protein requirements increase. A renal dietitian should be involved in individualized meal planning.",
    category: "Renal/GU",
    difficulty: 2,
    image: imgCKD
  },
  {
    id: "rn-renal-q7",
    type: "question",
    question: "A client develops tumor lysis syndrome after starting chemotherapy for leukemia. Which electrolyte abnormalities does the nurse expect?",
    options: ["Hyperkalemia, hyperphosphatemia, hyperuricemia, and hypocalcemia", "Hypokalemia, hypophosphatemia, and hypercalcemia", "Isolated hyponatremia", "Hypermagnesemia only"],
    correctIndex: 0,
    answer: "Tumor lysis syndrome occurs when massive cancer cell death releases intracellular contents: potassium (hyperkalemia), phosphorus (hyperphosphatemia), uric acid (hyperuricemia), and nucleic acids. Elevated phosphorus binds calcium, causing secondary hypocalcemia. Uric acid can crystallize in the renal tubules causing acute kidney injury. Prevention includes aggressive IV hydration, allopurinol or rasburicase, and close electrolyte monitoring.",
    category: "Renal/GU",
    difficulty: 3,
    image: imgLeukemia
  },
  {
    id: "rn-renal-q8",
    type: "question",
    question: "A client post-kidney transplant is on tacrolimus and mycophenolate. The client reports a sore throat and fever. What is the nurse's primary concern?",
    options: ["Common cold that will resolve on its own", "Opportunistic infection due to immunosuppression", "Drug allergy to tacrolimus", "Rejection of the transplanted kidney"],
    correctIndex: 1,
    answer: "Immunosuppressed transplant recipients are at high risk for opportunistic infections. A sore throat and fever could indicate anything from a common viral URI to a serious bacterial or fungal infection. The nurse should obtain cultures (blood, throat), check the WBC and differential, and notify the transplant team. CMV, EBV, and fungal infections are particular concerns. Prophylactic medications (valganciclovir, TMP-SMX) are typically prescribed.",
    category: "Renal/GU",
    difficulty: 2,
    image: imgEBV
  },
  // ============================================================
  // PHARMACOLOGY (17 cards)
  // ============================================================
  {
    id: "rn-pharm-q1",
    type: "question",
    question: "A client is prescribed warfarin with a target INR of 2.0-3.0. The current INR is 5.8 and the client has no active bleeding. What is the expected intervention?",
    options: ["Continue warfarin at the current dose", "Hold warfarin and administer oral vitamin K", "Administer IV vitamin K and fresh frozen plasma", "Administer protamine sulfate"],
    correctIndex: 1,
    answer: "An INR of 5.8 without active bleeding requires holding warfarin and administering oral vitamin K (2.5-5 mg). IV vitamin K and FFP are reserved for active or life-threatening bleeding. Protamine sulfate is the antidote for heparin, NOT warfarin. Recheck the INR in 24-48 hours. Common causes of supratherapeutic INR include drug interactions (antibiotics, NSAIDs), dietary changes (decreased vitamin K intake), or liver disease.",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q2",
    type: "question",
    question: "A nurse is preparing to administer IV vancomycin. Which complication is specific to rapid IV administration of this medication?",
    options: ["Ototoxicity", "Red man syndrome (histamine-mediated flushing and hypotension)", "Nephrotoxicity", "Hepatotoxicity"],
    correctIndex: 1,
    answer: "Red man syndrome occurs when vancomycin is infused too rapidly, causing direct mast cell degranulation and histamine release. It presents as a red, flushing rash on the face, neck, and upper trunk, often with pruritus and sometimes hypotension. Prevention is infusing vancomycin slowly over at least 60 minutes (or longer for doses >1 gram). Premedication with diphenhydramine may be given. This is NOT a true allergy.",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q3",
    type: "question",
    question: "A client on a heparin drip develops heparin-induced thrombocytopenia (HIT). The platelet count drops from 240,000 to 82,000. What is the priority action?",
    options: ["Decrease the heparin rate by 50%", "Stop ALL heparin products immediately and initiate an alternative anticoagulant (argatroban or bivalirudin)", "Continue heparin and monitor platelets daily", "Administer platelet transfusion"],
    correctIndex: 1,
    answer: "HIT is an immune-mediated reaction where antibodies against heparin-platelet factor 4 complexes cause platelet activation and consumption. Despite low platelets, HIT is paradoxically prothrombotic, causing arterial and venous thrombosis. ALL heparin must be stopped (including heparin flushes and heparin-coated catheters). An alternative anticoagulant (argatroban, bivalirudin) must be started. Platelet transfusions are generally CONTRAINDICATED as they fuel the thrombotic process.",
    image: imgThrombocytopeniaV2,
    category: "Pharmacology",
    difficulty: 3
  },
  {
    id: "rn-pharm-q4",
    type: "question",
    question: "A nurse is teaching a client about the new prescription for carvedilol (Coreg) for heart failure. Which instruction is most important?",
    options: ["Take it on an empty stomach for best absorption", "Monitor blood pressure and heart rate; rise slowly from sitting or lying positions to prevent orthostatic hypotension", "This medication can be stopped abruptly if side effects occur", "Take the medication only when you feel your heart racing"],
    correctIndex: 1,
    answer: "Carvedilol is a non-selective beta-blocker with alpha-1 blocking properties, causing both bradycardia and vasodilation. Orthostatic hypotension is a significant risk, especially when starting therapy. The client should rise slowly, monitor BP and HR regularly, and report dizziness. The medication should NEVER be stopped abruptly as rebound tachycardia and hypertension can occur. The dose is started low and titrated up slowly.",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q5",
    type: "question",
    question: "A client receiving chemotherapy develops a temperature of 38.5°C and an absolute neutrophil count (ANC) of 400/mm³. What is this condition called and what is the priority?",
    options: ["Febrile neutropenia requiring immediate blood cultures and empiric broad-spectrum antibiotics", "Normal post-chemotherapy response requiring no intervention", "Thrombocytopenia requiring platelet transfusion", "Anemia requiring erythropoietin"],
    correctIndex: 0,
    answer: "Febrile neutropenia (fever + ANC <500/mm³) is an oncological emergency. Without functioning neutrophils, the client cannot mount an adequate inflammatory response, and sepsis can develop rapidly. The standard protocol is: obtain blood cultures from two sites BEFORE antibiotics, then administer empiric broad-spectrum IV antibiotics (often piperacillin-tazobactam or cefepime) within 60 minutes of fever recognition.",
    category: "Pharmacology",
    difficulty: 3
  },
  {
    id: "rn-pharm-q6",
    type: "question",
    question: "A client is receiving a continuous norepinephrine infusion for septic shock through a peripheral IV. The nurse notices blanching and pain at the IV site. What does this indicate and what is the action?",
    options: ["Normal vasoconstriction from the medication", "Extravasation of norepinephrine causing local tissue ischemia; stop the infusion, notify the provider, and prepare phentolamine for local injection", "Allergic reaction to the medication", "The IV site needs to be flushed with saline"],
    correctIndex: 1,
    answer: "Norepinephrine is a potent vasoconstrictor. Extravasation into surrounding tissue causes severe local vasoconstriction, ischemia, and potential tissue necrosis. The nurse must stop the infusion immediately, aspirate residual medication, and administer phentolamine (alpha-adrenergic antagonist) by local injection around the extravasation site to reverse vasoconstriction. Central line administration is strongly preferred for vasopressors.",
    category: "Pharmacology",
    difficulty: 3
  },
  {
    id: "rn-pharm-q7",
    type: "question",
    question: "A nurse is reviewing a client's medication list: lisinopril, potassium supplement, and spironolactone. What is the primary safety concern?",
    options: ["Hypokalemia from excessive potassium loss", "Hyperkalemia from three potassium-retaining agents", "Drug interaction causing liver toxicity", "Increased risk of bleeding"],
    correctIndex: 1,
    answer: "ACE inhibitors (lisinopril) reduce aldosterone, retaining potassium. Spironolactone is a potassium-sparing diuretic that blocks aldosterone. Adding a potassium supplement creates triple potassium retention with high risk of life-threatening hyperkalemia. The nurse should hold the potassium supplement, check the serum K+ level immediately, and notify the prescriber. This is a common dangerous medication combination.",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q8",
    type: "question",
    question: "A client with a suspected opioid overdose is given naloxone (Narcan) 0.4 mg IV. The client becomes responsive but the nurse must continue monitoring closely. Why?",
    options: ["Naloxone has a longer half-life than most opioids", "Naloxone's duration of action (30-90 minutes) is shorter than most opioids, and resedation/respiratory depression can recur", "Naloxone causes permanent opioid receptor blockade", "One dose of naloxone always completely reverses any opioid"],
    correctIndex: 1,
    answer: "Naloxone has a short duration of action (30-90 minutes), while most opioids (especially long-acting formulations like methadone or extended-release oxycodone) have much longer durations. After naloxone wears off, the opioid can re-exert its effects, causing recurrent respiratory depression. The client must be monitored for at least 2-4 hours (longer for long-acting opioids), and repeat doses or a continuous naloxone infusion may be needed.",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q9",
    type: "question",
    question: "A client is prescribed methotrexate for rheumatoid arthritis. Which medication should the nurse ensure is also prescribed?",
    options: ["Vitamin B12 supplements", "Folic acid 1 mg daily", "Iron supplements", "Calcium carbonate"],
    correctIndex: 1,
    answer: "Methotrexate is a folate antagonist that inhibits dihydrofolate reductase. Folic acid supplementation (1 mg daily, taken on days when methotrexate is NOT taken) reduces side effects including stomatitis, GI upset, hepatotoxicity, and bone marrow suppression without reducing the drug's efficacy. Leucovorin (folinic acid) is used for methotrexate toxicity rescue, not routine supplementation.",
    category: "Pharmacology",
    difficulty: 2,
    image: illustrationRheumatoidArthritis
  },
  {
    id: "rn-pharm-q10",
    type: "question",
    question: "A nurse is caring for a client who received too much IV potassium, resulting in a potassium level of 7.2 mEq/L and peaked T waves on the ECG. Which medication should be administered FIRST?",
    options: ["Sodium polystyrene sulfonate (Kayexalate)", "Insulin with D50", "IV calcium gluconate", "Albuterol nebulizer"],
    correctIndex: 2,
    answer: "IV calcium gluconate is the FIRST medication given in severe hyperkalemia with ECG changes because it stabilizes the cardiac membrane within minutes, reducing the risk of fatal arrhythmia. It does NOT lower potassium levels; it protects the heart while other medications work to shift K+ intracellularly (insulin/D50, albuterol) or remove it from the body (Kayexalate, dialysis).",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q11",
    type: "question",
    question: "A client on a PCA (patient-controlled analgesia) pump with morphine is found with a respiratory rate of 6, pinpoint pupils, and sedation score of 4 (unarousable). What is the priority intervention?",
    options: ["Stimulate the client and encourage deep breathing", "Stop the PCA pump and administer naloxone IV as prescribed", "Increase the PCA demand dose for better pain control", "Position the client in high Fowler's and apply oxygen"],
    correctIndex: 1,
    answer: "Respiratory rate below 8, excessive sedation, and pinpoint pupils indicate opioid overdose. The priority is to stop the PCA pump to prevent further opioid delivery and administer naloxone (Narcan) to reverse respiratory depression. Naloxone onset is 1-2 minutes IV. The client needs continuous monitoring after naloxone as redosing may be needed. Document the event and investigate the cause (programming error, family pushing the button).",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q12",
    type: "question",
    question: "A client is prescribed gentamicin IV. Which lab tests should the nurse monitor most closely?",
    options: ["Liver function tests and bilirubin", "Serum creatinine and peak/trough gentamicin levels", "Serum glucose and hemoglobin A1C", "Thyroid function and cortisol levels"],
    correctIndex: 1,
    answer: "Aminoglycosides (gentamicin, tobramycin, amikacin) have narrow therapeutic windows with two major toxicities: nephrotoxicity (monitor serum creatinine, BUN) and ototoxicity (monitor for hearing changes, tinnitus, vertigo). Peak levels (drawn 30 min after infusion) assess efficacy; trough levels (drawn before next dose) assess toxicity. Adequate hydration is important to prevent nephrotoxicity.",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q13",
    type: "question",
    question: "A client on warfarin asks about which foods to avoid. What is the most accurate instruction?",
    options: ["Avoid all green vegetables completely", "Maintain a consistent intake of vitamin K-containing foods rather than avoiding them entirely", "Eat as many leafy greens as possible to increase INR", "Vitamin K in food has no effect on warfarin therapy"],
    correctIndex: 1,
    answer: "The key teaching for warfarin and diet is CONSISTENCY, not avoidance. Vitamin K is the antidote to warfarin, so large fluctuations in vitamin K intake cause INR instability. The client should eat a consistent amount of vitamin K-rich foods (spinach, kale, broccoli, Brussels sprouts) each week. The warfarin dose is adjusted based on the client's usual diet. Drastic dietary changes in either direction will destabilize the INR.",
    category: "Pharmacology",
    difficulty: 1
  },
  {
    id: "rn-pharm-q14",
    type: "question",
    question: "A nurse is administering phenytoin (Dilantin) IV. Which solution should NEVER be used to dilute or mix phenytoin?",
    options: ["Normal saline (0.9% NaCl)", "D5W (5% dextrose in water)", "Sterile water for injection", "Lactated Ringer's"],
    correctIndex: 1,
    answer: "Phenytoin precipitates in dextrose-containing solutions (D5W, D5NS, etc.) due to pH incompatibility. It must be mixed only with normal saline. Additionally, phenytoin must be administered at no more than 50 mg/min in adults (25 mg/min in elderly) with continuous cardiac monitoring due to the risk of hypotension and cardiac arrhythmias. An inline filter (0.22-0.55 micron) is required.",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q15",
    type: "question",
    question: "A client is receiving alteplase (tPA) for acute ischemic stroke. Which finding would cause the nurse to hold the medication?",
    options: ["Blood pressure 170/95 mmHg", "INR of 1.8 and recent use of oral anticoagulants", "Symptom onset 2 hours ago", "Blood glucose 165 mg/dL"],
    correctIndex: 1,
    answer: "Contraindications for tPA in stroke include: INR >1.7 or PT >15 seconds (increased bleeding risk), recent anticoagulant use, platelet count <100,000, active internal bleeding, history of intracranial hemorrhage, BP >185/110 despite treatment, recent major surgery, and stroke symptoms present >4.5 hours. An INR of 1.8 indicates excessive anticoagulation and would significantly increase hemorrhagic transformation risk.",
    category: "Pharmacology",
    difficulty: 3,
    image: imgStroke
  },
  {
    id: "rn-pharm-q16",
    type: "question",
    question: "A nurse is preparing to administer dopamine at a 'renal dose' (1-3 mcg/kg/min). What is the expected effect at this dose range?",
    options: ["Increased cardiac contractility", "Renal and mesenteric vasodilation to promote urine output", "Peripheral vasoconstriction", "Bronchodilation"],
    correctIndex: 1,
    answer: "Dopamine has dose-dependent effects: at low doses (1-3 mcg/kg/min), it stimulates dopaminergic receptors causing renal and mesenteric vasodilation. At moderate doses (3-10 mcg/kg/min), it stimulates beta-1 receptors increasing cardiac contractility and heart rate. At high doses (>10 mcg/kg/min), it stimulates alpha-1 receptors causing peripheral vasoconstriction. Understanding dose-dependent pharmacology is critical for titrating vasopressors.",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q17",
    type: "question",
    question: "A client is prescribed enoxaparin (Lovenox) subcutaneously. Which administration technique is correct?",
    options: ["Inject into the deltoid muscle and massage the site", "Inject into the abdominal fat pad at a 90-degree angle without aspirating or rubbing the site", "Inject into the thigh and apply pressure", "Inject IV for faster absorption"],
    correctIndex: 1,
    answer: "Enoxaparin (LMWH) is injected subcutaneously into the abdominal fat pad (alternating sides), at least 2 inches from the umbilicus, at a 90-degree angle. Do NOT aspirate before injection (increases bruising and hematoma risk). Do NOT rub or massage the injection site after administration. Do NOT expel the air bubble from the prefilled syringe (it ensures complete dose delivery). Never give IM or IV.",
    category: "Pharmacology",
    difficulty: 1
  },
  // ============================================================
  // CRITICAL CARE (16 cards)
  // ============================================================
  {
    id: "rn-cc-q1",
    type: "question",
    question: "A nurse is caring for a client in septic shock. The MAP is 58 mmHg despite 30 mL/kg IV crystalloid resuscitation. Which vasopressor is first-line per the Surviving Sepsis Campaign?",
    options: ["Dopamine", "Norepinephrine", "Epinephrine", "Vasopressin"],
    correctIndex: 1,
    answer: "Norepinephrine is the first-line vasopressor for septic shock per the Surviving Sepsis Campaign guidelines. It increases MAP primarily through alpha-1 mediated vasoconstriction with modest beta-1 effects (increases cardiac contractility without excessive tachycardia). The target MAP is 65 mmHg or higher. Vasopressin may be added as a second agent. Dopamine is no longer preferred due to increased arrhythmia risk.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q2",
    type: "question",
    question: "A nurse is interpreting a central venous pressure (CVP) reading of 2 mmHg in a client with trauma. What does this suggest?",
    options: ["Fluid overload", "Hypovolemia requiring fluid resuscitation", "Normal CVP", "Right heart failure"],
    correctIndex: 1,
    answer: "Normal CVP is 2-6 mmHg (3-8 cmH2O). A CVP of 2 mmHg is at the very low end of normal and in a trauma client suggests hypovolemia/insufficient preload. The low CVP reflects decreased venous return to the right heart, likely from blood loss. Fluid resuscitation with crystalloids and blood products is indicated. Serial CVP measurements help guide fluid resuscitation adequacy.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q3",
    type: "question",
    question: "A ventilated client develops auto-PEEP (intrinsic PEEP) with air trapping. What ventilator adjustment may help?",
    options: ["Increase the respiratory rate", "Increase the inspiratory time", "Decrease the respiratory rate to allow more time for exhalation", "Increase the tidal volume"],
    correctIndex: 2,
    answer: "Auto-PEEP occurs when there is insufficient expiratory time for complete exhalation, causing air trapping. This is common in obstructive diseases (COPD, asthma). Decreasing the respiratory rate lengthens the expiratory time, allowing more complete exhalation. Other strategies include decreasing the inspiratory time (increasing I:E ratio toward 1:3 or 1:4), decreasing tidal volume, and increasing inspiratory flow rate.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q4",
    type: "question",
    question: "A nurse is caring for a client with a pulmonary artery catheter. The PCWP suddenly increases from 12 to 26 mmHg with development of bilateral crackles. What is the most likely cause?",
    options: ["Pulmonary embolism", "Acute left ventricular failure or fluid overload", "Right ventricular failure", "Pneumothorax"],
    correctIndex: 1,
    answer: "PCWP (pulmonary capillary wedge pressure) reflects left atrial pressure and left ventricular end-diastolic pressure. A sudden increase from 12 (normal) to 26 mmHg with bilateral crackles indicates acute left ventricular failure or fluid overload. Blood is backing up from the failing LV into the pulmonary vasculature, causing pulmonary edema. Treatment includes diuretics (furosemide), vasodilators (nitroglycerin), and possibly inotropic support.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q5",
    type: "question",
    question: "A nurse performing a rapid sequence intubation (RSI) prepares the medications. Which combination is typically used?",
    options: ["Propofol and vecuronium", "Etomidate and succinylcholine", "Morphine and midazolam", "Ketamine only"],
    correctIndex: 1,
    answer: "RSI typically uses an induction agent (etomidate preferred for hemodynamic stability, propofol or ketamine as alternatives) followed by a neuromuscular blocking agent (succinylcholine for rapid onset and short duration, or rocuronium for longer paralysis). The goal is rapid loss of consciousness and muscle relaxation to facilitate intubation while minimizing aspiration risk. Preoxygenation is performed before medications.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q6",
    type: "question",
    question: "A client with multiorgan failure has a serum lactate of 6.2 mmol/L. What does this level indicate?",
    options: ["Normal metabolic state", "Tissue hypoperfusion and anaerobic metabolism indicating inadequate oxygen delivery", "Liver function improvement", "Renal tubular acidosis"],
    correctIndex: 1,
    answer: "Elevated serum lactate (normal <2 mmol/L) indicates tissue hypoperfusion where cells have switched to anaerobic metabolism due to inadequate oxygen delivery. A level above 4 mmol/L is associated with significantly increased mortality. Lactate clearance (decreasing trend with treatment) is used as a resuscitation endpoint in sepsis and shock. Persistent elevation despite treatment suggests ongoing hypoperfusion.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q7",
    type: "question",
    question: "A nurse is managing a client on a propofol (Diprivan) infusion for ICU sedation. Which laboratory value must be monitored for propofol infusion syndrome?",
    options: ["Serum glucose", "Serum triglyceride level and creatine kinase (CK)", "Serum sodium", "Serum albumin"],
    correctIndex: 1,
    answer: "Propofol infusion syndrome (PRIS) is a rare but potentially fatal complication of prolonged, high-dose propofol infusion. It is characterized by metabolic acidosis, rhabdomyolysis (elevated CK), hyperkalemia, hepatomegaly, cardiac failure, and hypertriglyceridemia (propofol is formulated in a lipid emulsion). Triglycerides and CK should be monitored regularly. PRIS risk increases with infusion rates >5 mg/kg/hr for >48 hours.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q8",
    type: "question",
    question: "A nurse is caring for a client with acute respiratory failure who is intubated. The ventilator alarm sounds for high pressure. The nurse suctions the ETT and obtains a small amount of thick secretions. The alarm continues. What should the nurse assess next?",
    options: ["Check for pneumothorax by auscultating breath sounds bilaterally", "Increase the FiO2 to 100%", "Reposition the client and call respiratory therapy", "Check the ventilator settings have not been changed"],
    correctIndex: 0,
    answer: "After suctioning did not resolve the high-pressure alarm, the nurse should assess for other causes of increased airway resistance or decreased compliance. Auscultating for absent or diminished breath sounds on one side could indicate pneumothorax, mucus plug in a mainstem bronchus, or ETT migration into the right mainstem bronchus. Client assessment always takes priority over equipment troubleshooting.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q9",
    type: "question",
    question: "A client in the ICU with ARDS is being ventilated with lung-protective strategy. Which tidal volume setting is recommended?",
    options: ["10-12 mL/kg of ideal body weight", "6-8 mL/kg of ideal body weight", "15 mL/kg of actual body weight", "4 mL/kg of ideal body weight"],
    correctIndex: 1,
    answer: "The ARDSNet lung-protective ventilation strategy recommends low tidal volumes of 6-8 mL/kg based on IDEAL (predicted) body weight, not actual weight. This reduces overdistension of healthy alveoli (volutrauma) and decreases mortality. Permissive hypercapnia (allowing PaCO2 to rise above normal) may be accepted to maintain safe tidal volumes. Plateau pressures should be kept below 30 cmH2O.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q10",
    type: "question",
    question: "A nurse is preparing to perform endotracheal suctioning on an intubated client. Which technique is correct?",
    options: ["Apply continuous suction while inserting and withdrawing the catheter", "Insert the catheter without suction, then apply intermittent suction while withdrawing for no more than 10-15 seconds", "Suction for 30 seconds continuously for thorough secretion removal", "Instill 10 mL normal saline before every suction pass to loosen secretions"],
    correctIndex: 1,
    answer: "Correct suctioning technique: pre-oxygenate with 100% FiO2 for 30-60 seconds, insert the catheter without suction to prevent mucosal trauma, apply intermittent suction while withdrawing using a rotating motion for no more than 10-15 seconds to prevent hypoxia. Allow recovery between passes. Normal saline instillation is no longer routinely recommended as evidence shows it does not improve secretion removal and may increase infection risk.",
    category: "Critical Care",
    difficulty: 2
  },
  // ============================================================
  // MATERNITY (15 cards)
  // ============================================================
  {
    id: "rn-mat-q1",
    type: "question",
    question: "A nurse is monitoring a client receiving oxytocin (Pitocin) for labor induction. Contractions are occurring every 90 seconds, lasting 90 seconds, and the fetal heart rate shows late decelerations. What is the priority action?",
    options: ["Increase the oxytocin rate to speed delivery", "Stop the oxytocin infusion immediately and reposition the client on the left side", "Document the findings and continue monitoring", "Prepare for an amniotomy"],
    correctIndex: 1,
    answer: "Contractions every 90 seconds lasting 90 seconds represent uterine tachysystole (excessive uterine activity), and late decelerations indicate uteroplacental insufficiency. The nurse must immediately stop the oxytocin to allow the uterus to relax, reposition the client to left lateral (improves uterine blood flow), administer oxygen, and increase IV fluids. Terbutaline may be given to relax the uterus. Notify the provider.",
    category: "Maternity",
    difficulty: 3,
    image: imgDecelsFlashcard
  },
  {
    id: "rn-mat-q2",
    type: "question",
    question: "A client at 32 weeks gestation presents with painless bright red vaginal bleeding. The nurse suspects placenta previa. Which assessment is absolutely contraindicated?",
    options: ["Abdominal palpation", "Fetal heart rate monitoring", "Digital vaginal examination", "Blood pressure measurement"],
    correctIndex: 2,
    answer: "Digital vaginal examination is ABSOLUTELY CONTRAINDICATED in suspected placenta previa because the examiner's fingers can disrupt the placenta where it covers or is near the cervical os, causing massive, life-threatening hemorrhage. Diagnosis is confirmed by transabdominal ultrasound. External fetal monitoring and gentle abdominal palpation are safe and appropriate.",
    category: "Maternity",
    difficulty: 2,
    image: imgPlacentaPrevia
  },
  {
    id: "rn-mat-q3",
    type: "question",
    question: "A nurse is assessing a laboring client whose fetal monitor shows variable decelerations. What is the most common cause?",
    options: ["Head compression during descent", "Uteroplacental insufficiency", "Umbilical cord compression", "Fetal sleep cycle"],
    correctIndex: 2,
    answer: "Variable decelerations are abrupt drops in fetal heart rate that vary in timing, duration, and depth relative to contractions. They are caused by umbilical cord compression. Nursing interventions include repositioning the client (side to side, hands and knees), amnioinfusion if ordered (instilling saline into the uterus to cushion the cord), and discontinuing oxytocin if running. Early decelerations (head compression) are benign.",
    category: "Maternity",
    difficulty: 2,
    image: imgDecelsFlashcard
  },
  {
    id: "rn-mat-q4",
    type: "question",
    question: "A client with severe preeclampsia on magnesium sulfate develops respiratory depression (RR 8), absent deep tendon reflexes, and urine output of 15 mL/hour. What is the priority action?",
    options: ["Continue magnesium sulfate and observe", "Stop magnesium sulfate and administer calcium gluconate 1 g IV", "Increase the magnesium sulfate rate", "Administer narcan for respiratory depression"],
    correctIndex: 1,
    answer: "These findings indicate magnesium toxicity: respiratory depression (RR <12), absent DTRs, and oliguria (urine <30 mL/hr). The magnesium infusion must be stopped immediately and calcium gluconate (10 mL of 10% solution = 1 g) administered IV over 3-5 minutes as the antidote. Calcium gluconate directly antagonizes the neuromuscular blocking effects of magnesium. Therapeutic magnesium level is 4-7 mEq/L; toxic effects begin at 7-10 mEq/L.",
    category: "Maternity",
    difficulty: 3,
    image: imgAntepartum
  },
  {
    id: "rn-mat-q5",
    type: "question",
    question: "A nurse is assessing a newborn at 1 minute of life. The infant has a heart rate of 80 bpm, slow and irregular respirations, some flexion of extremities, grimace with stimulation, and blue body with blue extremities. What is the Apgar score?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
    answer: "Apgar scoring: Heart rate 80 (below 100) = 1; Respiratory effort (slow/irregular) = 1; Muscle tone (some flexion) = 1; Reflex irritability (grimace) = 1; Color (blue body) = 0. Total = 4. A score of 4-6 indicates moderate depression requiring stimulation and possibly assisted ventilation. Scores below 4 require aggressive resuscitation. The 5-minute Apgar determines if interventions are effective.",
    category: "Maternity",
    difficulty: 2,
    image: imgAPGAR
  },
  {
    id: "rn-mat-q6",
    type: "question",
    question: "A nurse is caring for a postpartum client who delivered vaginally 2 hours ago. On assessment, the uterine fundus is boggy and deviated to the right. What is the FIRST nursing action?",
    options: ["Administer oxytocin IV", "Massage the fundus and have the client void", "Notify the provider immediately", "Apply an ice pack to the abdomen"],
    correctIndex: 1,
    answer: "A boggy, displaced fundus suggests uterine atony (the most common cause of postpartum hemorrhage) and a full bladder displacing the uterus. The FIRST action is to massage the fundus to stimulate contraction and have the client empty their bladder (full bladder prevents uterine contraction). If the fundus does not firm with massage and emptying the bladder, then administer uterotonics (oxytocin, methylergonovine, carboprost) and notify the provider.",
    category: "Maternity",
    difficulty: 2,
    image: imgPostpartumHemorrhage
  },
  {
    id: "rn-mat-q7",
    type: "question",
    question: "A nurse is teaching a client about the risk factors for ectopic pregnancy. Which factor places the client at highest risk?",
    options: ["Previous cesarean delivery", "History of pelvic inflammatory disease (PID)", "First pregnancy", "Use of oral contraceptives"],
    correctIndex: 1,
    answer: "PID, particularly from Chlamydia trachomatis or Neisseria gonorrhoeae, causes tubal scarring and adhesions that impede the fertilized egg's passage through the fallopian tube, dramatically increasing ectopic pregnancy risk. Other risk factors include previous ectopic pregnancy, tubal surgery, IUD use, endometriosis, and smoking. Classic presentation: unilateral lower abdominal pain, vaginal bleeding, and positive pregnancy test.",
    category: "Maternity",
    difficulty: 2,
    image: imgEctopicPregnancy
  },
  {
    id: "rn-mat-q8",
    type: "question",
    question: "A nurse is assessing a newborn and notes a tuft of hair and dimple at the base of the spine. What should the nurse suspect?",
    options: ["Normal newborn variant", "Possible spina bifida occulta requiring further evaluation", "Pilonidal cyst", "Birth trauma"],
    correctIndex: 1,
    answer: "A tuft of hair, dermal sinus, or dimple at the base of the spine may indicate spina bifida occulta, the mildest form where the vertebral arch fails to close but the spinal cord and meninges are not herniated. While often asymptomatic, these cutaneous markers warrant further evaluation (spinal ultrasound in neonates or MRI) to rule out tethered cord or other occult spinal dysraphism.",
    category: "Maternity",
    difficulty: 2
  },
  {
    id: "rn-mat-q9",
    type: "question",
    question: "A client at 38 weeks gestation has a reactive non-stress test (NST). What does this result mean?",
    options: ["The fetus is in distress and needs immediate delivery", "The fetal heart rate shows at least 2 accelerations of 15 bpm above baseline lasting 15 seconds in a 20-minute period, indicating fetal well-being", "The test is inconclusive and must be repeated", "The fetus has a congenital heart defect"],
    correctIndex: 1,
    answer: "A reactive (normal) NST shows at least 2 accelerations of the fetal heart rate of 15 bpm above baseline lasting at least 15 seconds within a 20-minute window. Accelerations indicate a healthy, well-oxygenated fetus with intact autonomic nervous system. A non-reactive NST (no accelerations) requires further evaluation with a contraction stress test (CST) or biophysical profile (BPP).",
    category: "Maternity",
    difficulty: 2
  },
  {
    id: "rn-mat-q10",
    type: "question",
    image: imgHELLPNew,
    question: "A nurse is caring for a client diagnosed with HELLP syndrome. Which set of lab values is consistent with this diagnosis?",
    options: ["Elevated liver enzymes, low platelets, elevated LDH", "Normal liver enzymes, high platelets, low LDH", "Elevated liver enzymes, normal platelets, low WBC", "Low liver enzymes, low platelets, high albumin"],
    correctIndex: 0,
    answer: "HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) is a severe variant of preeclampsia. Lab findings include: hemolysis markers (elevated LDH, schistocytes on peripheral smear, elevated indirect bilirubin), elevated AST/ALT (liver enzymes), and thrombocytopenia (platelets <100,000). It is a medical emergency often requiring delivery regardless of gestational age. Complications include DIC, hepatic rupture, and placental abruption.",
    category: "Maternity",
    difficulty: 3
  },
  {
    id: "rn-mat-q11",
    type: "question",
    image: imgRhIncompatibility,
    question: "A nurse is caring for a postpartum client who is Rh-negative and delivered an Rh-positive baby. When should RhoGAM be administered?",
    options: ["Within 72 hours after delivery", "At the 6-week postpartum visit", "Only if the mother has a positive indirect Coombs test", "RhoGAM is not needed after delivery"],
    correctIndex: 0,
    answer: "RhoGAM (Rh immune globulin) must be administered within 72 hours of delivery of an Rh-positive infant to prevent Rh sensitization. RhoGAM destroys fetal Rh-positive red blood cells that entered the maternal circulation during delivery before the mother's immune system can produce anti-D antibodies. It is also given at 28 weeks gestation and after any potentially sensitizing event (amniocentesis, bleeding, trauma).",
    category: "Maternity",
    difficulty: 2
  },
  {
    id: "rn-mat-q12",
    type: "question",
    question: "A nurse is assessing a client in the transition phase of labor. Which findings are expected during this phase?",
    options: ["Cervical dilation 1-3 cm, mild contractions, client is chatty and relaxed", "Cervical dilation 8-10 cm, intense contractions every 1-2 minutes, nausea, irritability, and rectal pressure", "Cervical dilation 4-7 cm, moderate contractions, client is focused and cooperative", "No contractions with spontaneous rupture of membranes"],
    correctIndex: 1,
    answer: "Transition is the most intense phase of the first stage of labor (8-10 cm dilation). Contractions are very strong, lasting 60-90 seconds, occurring every 1-2 minutes. The client often experiences nausea/vomiting, extreme irritability, feelings of losing control, rectal pressure, and the urge to push. The nurse should provide continuous support, encouragement, and breathing guidance. This phase typically lasts 30 minutes to 2 hours.",
    category: "Maternity",
    difficulty: 2
  },
  {
    id: "rn-mat-q13",
    type: "question",
    question: "A nurse is caring for a newborn whose mother tested positive for hepatitis B. What should be administered to the newborn within 12 hours of birth?",
    options: ["Hepatitis B vaccine only", "Hepatitis B immune globulin (HBIG) only", "Both hepatitis B vaccine AND HBIG within 12 hours of birth", "No intervention needed; test the infant at 6 months"],
    correctIndex: 2,
    answer: "Neonates born to HBsAg-positive mothers must receive BOTH hepatitis B vaccine (active immunity) AND hepatitis B immune globulin (HBIG, passive immunity) within 12 hours of birth, preferably at different injection sites. This dual approach provides immediate protection (HBIG) while the vaccine stimulates the infant's own immune response. This combination is 85-95% effective in preventing perinatal hepatitis B transmission.",
    category: "Maternity",
    difficulty: 2,
    image: imgHepatitisNew
  },
  {
    id: "rn-mat-q14",
    type: "question",
    question: "A nurse is performing a postpartum assessment. Which finding indicates a potential complication that requires immediate notification of the provider?",
    options: ["Lochia rubra on day 1 postpartum", "Moderate uterine cramping during breastfeeding", "Foul-smelling lochia with fever of 38.5°C on day 3", "Perineal edema with ice pack in place"],
    correctIndex: 2,
    answer: "Foul-smelling lochia with fever suggests endometritis (postpartum uterine infection), a significant complication that requires prompt antibiotic therapy. Risk factors include cesarean delivery, prolonged rupture of membranes, multiple vaginal examinations, and chorioamnionitis. The nurse should assess the fundus (tender, boggy), obtain cultures, and anticipate IV antibiotic therapy (commonly clindamycin plus gentamicin).",
    category: "Maternity",
    difficulty: 2,
    image: imgCSection
  },
  {
    id: "rn-mat-q15",
    type: "question",
    question: "A nurse is caring for a client with gestational hypertension. The client's blood pressure is 168/108. Which assessment is most critical to differentiate gestational hypertension from preeclampsia?",
    options: ["Heart rate and respiratory rate", "Urinalysis for proteinuria", "Blood glucose level", "Complete blood count"],
    correctIndex: 1,
    answer: "The hallmark distinction between gestational hypertension and preeclampsia is the presence of proteinuria (>300 mg in 24-hour urine or protein/creatinine ratio >0.3). Preeclampsia may also present without proteinuria if accompanied by thrombocytopenia, elevated liver enzymes, renal insufficiency, pulmonary edema, or cerebral/visual symptoms. Lab work including liver enzymes, platelets, and creatinine should also be obtained.",
    category: "Maternity",
    difficulty: 2,
    image: imgAntepartum
  },
  // ============================================================
  // MENTAL HEALTH (15 cards)
  // ============================================================
  {
    id: "rn-mh-q1",
    type: "question",
    image: imgSerotoninSyndrome,
    question: "A client with major depressive disorder being treated with an SSRI develops hyperthermia, muscle rigidity, altered mental status, and clonus. What does the nurse suspect?",
    options: ["Neuroleptic malignant syndrome", "Serotonin syndrome", "Malignant hyperthermia", "Anticholinergic toxicity"],
    correctIndex: 1,
    answer: "The triad of hyperthermia, altered mental status, and neuromuscular abnormalities (clonus, hyperreflexia, myoclonus, rigidity) following SSRI use suggests serotonin syndrome. It occurs from excess serotonergic activity, often from drug interactions (SSRIs + MAOIs, tramadol, triptans, linezolid). Treatment includes stopping the offending agent, supportive care, and cyproheptadine (serotonin antagonist) for severe cases. Distinct from NMS which involves dopamine blockade.",
    category: "Mental Health",
    difficulty: 3
  },
  {
    id: "rn-mh-q2",
    type: "question",
    question: "A nurse is using therapeutic communication with a depressed client who says, 'Nobody would care if I just disappeared.' Which response is most therapeutic?",
    options: ["Don't say that, lots of people care about you", "Are you thinking about hurting yourself or ending your life?", "Everyone feels that way sometimes", "Let's talk about something more positive"],
    correctIndex: 1,
    answer: "Directly asking about suicidal ideation is therapeutic and does NOT plant the idea. The nurse must assess the client's safety by asking direct questions: 'Are you thinking about suicide? Do you have a plan? Do you have access to means?' Dismissing, minimizing, or redirecting from suicidal statements is unsafe and misses critical assessment data. The nurse should remain calm, non-judgmental, and use active listening.",
    category: "Mental Health",
    difficulty: 2
  },
  {
    id: "rn-mh-q3",
    type: "question",
    question: "A client with bipolar disorder has been stable on lithium for 2 years. The client wants to start a low-sodium diet for weight loss. What should the nurse advise?",
    options: ["A low-sodium diet is safe and encouraged", "Sodium and lithium compete for reabsorption in the kidneys; a low-sodium diet can cause dangerous lithium toxicity", "Sodium intake has no relationship to lithium levels", "The client should increase sodium intake while on lithium"],
    correctIndex: 1,
    answer: "Lithium and sodium are both reabsorbed in the proximal tubule of the kidney. When sodium intake decreases, the kidneys compensate by increasing reabsorption of both sodium AND lithium, leading to elevated lithium levels and potential toxicity. Clients on lithium must maintain consistent sodium and fluid intake. Dehydration, diuretics, excessive sweating, vomiting, and diarrhea also increase lithium levels dangerously.",
    category: "Mental Health",
    difficulty: 2
  },
  {
    id: "rn-mh-q4",
    type: "question",
    question: "A nurse is caring for a client with schizophrenia who is taking clozapine. The client develops a fever of 39°C and sore throat. What is the MOST critical action?",
    options: ["Administer acetaminophen and throat lozenges", "Obtain a STAT complete blood count with differential to rule out agranulocytosis", "Continue clozapine and monitor symptoms", "Switch to a different antipsychotic immediately without lab work"],
    correctIndex: 1,
    answer: "Fever and sore throat in a client on clozapine are RED FLAG symptoms for agranulocytosis (severe neutropenia with ANC <500), a potentially fatal side effect unique to clozapine. A STAT CBC with differential must be obtained immediately. If ANC is critically low, clozapine must be stopped permanently, the client placed in protective isolation, and broad-spectrum antibiotics started. This is why the Clozapine REMS program requires regular blood monitoring.",
    category: "Mental Health",
    difficulty: 3
  },
  {
    id: "rn-mh-q5",
    type: "question",
    question: "A nurse is caring for a client who is involuntarily committed to the psychiatric unit. The client asks to leave. Which statement by the nurse best addresses the client's rights?",
    options: ["You have no rights since you were committed", "You were admitted because a physician determined you are a danger to yourself or others. You have the right to a hearing and legal representation", "You can leave whenever you want", "You must stay until the insurance company approves discharge"],
    correctIndex: 1,
    answer: "Involuntarily committed clients retain most civil rights, including the right to a judicial hearing, legal representation, informed consent for treatment (with limited exceptions for emergency situations), communication with an attorney, and humane treatment. The commitment is based on clinical determination of danger to self or others or grave disability. The nurse must explain the legal process while maintaining safety.",
    category: "Mental Health",
    difficulty: 2
  },
  {
    id: "rn-mh-q6",
    type: "question",
    question: "A nurse is admitting a client with anorexia nervosa whose BMI is 14. Which complication is the MOST immediately life-threatening?",
    options: ["Amenorrhea", "Lanugo (fine body hair)", "Cardiac arrhythmia from electrolyte imbalance", "Dental erosion"],
    correctIndex: 2,
    answer: "The most immediately life-threatening complication of severe anorexia nervosa is cardiac arrhythmia caused by electrolyte imbalances, particularly hypokalemia, hypomagnesemia, and hypophosphatemia. Cardiac monitoring is essential. Prolonged QTc interval increases the risk of torsades de pointes and sudden cardiac death. Other cardiac complications include bradycardia, mitral valve prolapse, and heart failure from muscle wasting.",
    category: "Mental Health",
    difficulty: 3
  },
  {
    id: "rn-mh-q7",
    type: "question",
    question: "A client presents to the ED after being sexually assaulted. Which nursing action is the priority?",
    options: ["Collect forensic evidence (rape kit) immediately", "Ensure physical safety, provide emotional support, and obtain informed consent before any examination", "Encourage the client to take a shower to feel clean", "Contact law enforcement before doing anything else"],
    correctIndex: 1,
    answer: "The priority is ensuring the client's immediate physical safety and providing emotional support. Informed consent is required before any examination or evidence collection. The client must not be pressured and should be given control over the process. Do NOT have the client shower, change clothes, eat, drink, or urinate before evidence collection if consent is given. A SANE (Sexual Assault Nurse Examiner) should perform the forensic exam.",
    category: "Mental Health",
    difficulty: 2
  },
  {
    id: "rn-mh-q8",
    type: "question",
    question: "A client taking haloperidol (Haldol) develops severe muscle rigidity, high fever (41°C), autonomic instability, and altered consciousness. The CK is 12,000 U/L. What is this condition?",
    options: ["Serotonin syndrome", "Neuroleptic malignant syndrome (NMS)", "Extrapyramidal side effects", "Tardive dyskinesia"],
    correctIndex: 1,
    answer: "NMS is a life-threatening reaction to dopamine-blocking agents (typical antipsychotics like haloperidol are highest risk). The cardinal features are 'FEVER': Fever, Encephalopathy (altered consciousness), Vitals unstable (autonomic instability), Elevated enzymes (CK), and Rigidity (lead-pipe). Treatment: stop the antipsychotic, supportive care in ICU, dantrolene sodium (muscle relaxant), and bromocriptine (dopamine agonist). Mortality is 10-20% if untreated.",
    category: "Mental Health",
    difficulty: 3
  },
  {
    id: "rn-mh-q9",
    type: "question",
    question: "A client with generalized anxiety disorder asks the nurse about the difference between SSRIs and benzodiazepines for long-term anxiety management. What is the most accurate response?",
    options: ["Both are equally appropriate for long-term use", "SSRIs are preferred for long-term management as they are non-addictive; benzodiazepines are best for short-term or acute anxiety due to dependence risk", "Benzodiazepines are safer for long-term use", "Neither class is effective for anxiety"],
    correctIndex: 1,
    answer: "SSRIs (sertraline, escitalopram, paroxetine) are first-line for long-term anxiety management. They modify serotonin signaling without physical dependence risk. Benzodiazepines (lorazepam, alprazolam, clonazepam) provide rapid relief for acute anxiety but carry risks of tolerance, physical dependence, withdrawal seizures, and cognitive impairment with long-term use. They are best used short-term while SSRIs take effect (2-4 weeks).",
    category: "Mental Health",
    difficulty: 2,
    image: imgAnxiety
  },
  {
    id: "rn-mh-q10",
    type: "question",
    question: "A nurse is de-escalating an agitated client on a psychiatric unit. Which non-verbal approach is most appropriate?",
    options: ["Stand directly in front of the client with arms crossed to show authority", "Maintain a relaxed, open posture at a 45-degree angle with an escape route, at a distance of at least one arm's length", "Turn your back to the client to appear non-threatening", "Touch the client's shoulder to show empathy"],
    correctIndex: 1,
    answer: "De-escalation non-verbal techniques: stand at a 45-degree angle (less confrontational than face-to-face), maintain at least one arm's length distance (safety), ensure you have an exit path behind you, keep a relaxed open posture (uncrossed arms), speak calmly and slowly, and avoid touching the client (may escalate aggression). Never turn your back, corner the client, or invade personal space.",
    category: "Mental Health",
    difficulty: 2
  },
  {
    id: "rn-mh-q11",
    type: "question",
    question: "A client who recently started fluoxetine (Prozac) for depression reports feeling much more energetic after 1 week but still reports hopelessness. The nurse is MOST concerned because:",
    options: ["The medication is not working", "The client may now have enough energy to act on suicidal ideation that was previously inhibited by psychomotor retardation", "The client is having a manic episode", "Fluoxetine always causes increased energy before mood improvement"],
    correctIndex: 1,
    answer: "This is the most dangerous period of antidepressant therapy. SSRIs often improve energy and psychomotor function before improving mood and hopelessness. A previously immobilized depressed client now has the energy to carry out a suicide plan while still feeling hopeless. Close monitoring and safety assessment are critical during the first 2-4 weeks of antidepressant therapy and during dose changes. This is why a black box warning exists for SSRIs in young adults.",
    category: "Mental Health",
    difficulty: 3,
    image: imgDepression
  },
  {
    id: "rn-mh-q12",
    type: "question",
    question: "A client with borderline personality disorder repeatedly calls the nurse's station requesting PRN medication, threatening self-harm if it is not given. Which nursing approach is most appropriate?",
    options: ["Give the PRN medication immediately every time to prevent self-harm", "Set clear, consistent limits while acknowledging the client's distress and offering alternative coping strategies", "Ignore the client's requests entirely", "Threaten to transfer the client to a different unit"],
    correctIndex: 1,
    answer: "Clients with BPD require firm, consistent boundaries delivered in a compassionate, non-punitive manner. The nurse should acknowledge the distress ('I can see you're in pain'), maintain limits ('PRN medication is available every 6 hours per your treatment plan'), and offer alternatives ('Let's talk about what you're feeling, or try the coping skills we discussed'). Inconsistency reinforces manipulative behavior. All staff must follow the same care plan.",
    category: "Mental Health",
    difficulty: 2
  },
  {
    id: "rn-mh-q13",
    type: "question",
    question: "A client is receiving electroconvulsive therapy (ECT) for severe treatment-resistant depression. Which medication should the nurse anticipate administering before the procedure?",
    options: ["Haloperidol for sedation", "Succinylcholine (a short-acting neuromuscular blocker) and a brief general anesthetic", "Lithium for mood stabilization", "Naloxone for pain prevention"],
    correctIndex: 1,
    answer: "Modern ECT uses brief general anesthesia (methohexital or propofol) and a short-acting neuromuscular blocker (succinylcholine) to prevent injury from seizure-induced muscle contractions. Glycopyrrolate or atropine may be given to reduce secretions and prevent bradycardia. The client is pre-oxygenated and ventilated during the procedure. Common side effects include temporary confusion and memory loss. ECT is highly effective for treatment-resistant depression.",
    category: "Mental Health",
    difficulty: 2,
    image: imgDepression
  },
  {
    id: "rn-mh-q14",
    type: "question",
    question: "A nurse is teaching a client who is starting disulfiram (Antabuse) for alcohol use disorder. Which instruction is essential?",
    options: ["You may continue to drink small amounts of alcohol while taking this medication", "Avoid ALL forms of alcohol including mouthwash, cooking wines, cough syrups, and vinegar-based sauces, as even small amounts cause a severe reaction", "This medication reduces alcohol cravings", "Disulfiram can be started while the client is still actively drinking"],
    correctIndex: 1,
    answer: "Disulfiram inhibits aldehyde dehydrogenase, causing toxic acetaldehyde accumulation when any alcohol is consumed. The disulfiram-ethanol reaction includes flushing, throbbing headache, nausea, vomiting, chest pain, hypotension, and potentially cardiovascular collapse. ALL alcohol sources must be avoided, including hidden sources (cologne, hand sanitizer, vanilla extract, mouthwash, cooking wine). The client must be alcohol-free for at least 12 hours before starting.",
    category: "Mental Health",
    difficulty: 2
  },
  {
    id: "rn-mh-q15",
    type: "question",
    question: "A nurse assesses a client brought to the ED by paramedics after an intentional overdose of acetaminophen 6 hours ago. The client is alert, oriented, and asymptomatic. Should the nurse be concerned?",
    options: ["No, the client looks fine and can likely be discharged", "Yes, acetaminophen toxicity has a delayed presentation; the client needs an acetaminophen level, AST/ALT, and N-acetylcysteine (NAC) should be started if levels are above the treatment line on the Rumack-Matthew nomogram", "Only if the client took more than 10 tablets", "The client should be given activated charcoal and discharged"],
    correctIndex: 1,
    answer: "Acetaminophen toxicity is insidious. Stage 1 (0-24 hours) may be asymptomatic or have only mild nausea. Stage 2 (24-72 hours) brings hepatotoxicity (rising AST/ALT, RUQ pain). Stage 3 (72-96 hours) can involve fulminant liver failure, coagulopathy, encephalopathy, and death. N-acetylcysteine (NAC) is most effective within 8 hours but can benefit up to 72 hours. The 4-hour acetaminophen level is plotted on the Rumack-Matthew nomogram to guide treatment.",
    category: "Mental Health",
    difficulty: 2
  },
  // ============================================================
  // PEDIATRICS (15 cards)
  // ============================================================
  {
    id: "rn-peds-q1",
    type: "question",
    question: "A 2-year-old child with epiglottitis presents with high fever, drooling, and inspiratory stridor while sitting upright in the tripod position. Which action is contraindicated?",
    options: ["Administering humidified oxygen", "Examining the throat with a tongue depressor", "Keeping the child calm with the parent", "Preparing for possible intubation"],
    correctIndex: 1,
    answer: "NEVER examine the throat or use a tongue depressor in suspected epiglottitis. Manipulation of the inflamed epiglottis can cause complete airway obstruction and respiratory arrest. The child should remain calm, in the position of comfort (usually tripod/sitting), with humidified oxygen and preparation for emergency intubation by the most skilled provider available. IV antibiotics (ceftriaxone) are given after airway is secured.",
    category: "Pediatrics",
    difficulty: 2,
    image: imgEpiglottitis
  },
  {
    id: "rn-peds-q2",
    type: "question",
    question: "A nurse is assessing a 4-month-old infant with pyloric stenosis. Which finding is most characteristic?",
    options: ["Bilious vomiting and abdominal distension", "Non-bilious projectile vomiting, olive-shaped mass in RUQ, and hungry infant", "Bloody stools and fever", "Ribbon-like stools and failure to thrive"],
    correctIndex: 1,
    answer: "Pyloric stenosis presents with non-bilious projectile vomiting (the obstruction is above the ampulla of Vater where bile enters) that typically begins at 2-6 weeks of age. An olive-shaped mass may be palpated in the right upper quadrant (hypertrophied pylorus). The infant is characteristically hungry after vomiting. Visible gastric peristaltic waves may be seen. Labs show hypochloremic metabolic alkalosis. Treatment is pyloromyotomy.",
    category: "Pediatrics",
    difficulty: 2,
    image: imgPyloricStenosis
  },
  {
    id: "rn-peds-q3",
    type: "question",
    question: "A 3-year-old with nephrotic syndrome has severe edema, proteinuria, and a serum albumin of 1.4 g/dL. The parent asks why the child's face is so puffy in the morning. What is the nurse's explanation?",
    options: ["Fluid accumulates in the face overnight because gravity redistributes edema fluid to the head when the child lies flat", "The child is drinking too much water", "The medication is causing facial swelling", "The child has an allergic reaction"],
    correctIndex: 0,
    answer: "In nephrotic syndrome, massive proteinuria causes hypoalbuminemia, which reduces plasma oncotic pressure. Fluid shifts from intravascular to interstitial spaces. When the child lies flat overnight, gravity redistributes the edema to the face, causing periorbital puffiness most prominent in the morning. By evening, gravity pulls fluid to the lower extremities, and facial edema improves. Daily weights and I&O monitoring are essential.",
    category: "Pediatrics",
    difficulty: 2
  },
  {
    id: "rn-peds-q4",
    type: "question",
    question: "A nurse is calculating maintenance IV fluids for a 22-kg child using the Holliday-Segar method. What is the hourly rate?",
    options: ["42 mL/hour", "62 mL/hour", "52 mL/hour", "72 mL/hour"],
    correctIndex: 1,
    answer: "Holliday-Segar method: First 10 kg = 100 mL/kg/day (1,000 mL). Next 10 kg = 50 mL/kg/day (500 mL). Remaining 2 kg = 20 mL/kg/day (40 mL). Total = 1,540 mL/day ÷ 24 hours = 64.2 mL/hour (approximately 62-64 mL/hour). This method is essential for pediatric fluid calculations and is a common NCLEX and clinical calculation.",
    category: "Pediatrics",
    difficulty: 2,
    image: imgIntussusception
  },
  {
    id: "rn-peds-q5",
    type: "question",
    question: "A 6-month-old infant is brought to the ED with inconsolable crying, drawing up the legs, and 'currant jelly' stools. What condition does the nurse suspect?",
    options: ["Pyloric stenosis", "Intussusception", "Hirschsprung disease", "Necrotizing enterocolitis"],
    correctIndex: 1,
    answer: "The classic triad of intussusception is colicky abdominal pain (drawing up legs with crying episodes alternating with calm periods), vomiting, and currant jelly stools (mixture of blood and mucus from bowel wall ischemia). It occurs when one segment of bowel telescopes into an adjacent segment, most commonly ileocecal. Treatment is air or barium enema reduction; surgery is needed if reduction fails or if peritonitis is present.",
    category: "Pediatrics",
    difficulty: 2,
    image: imgIntussusception
  },
  {
    id: "rn-peds-q6",
    type: "question",
    question: "A nurse is teaching parents about car seat safety for a newborn. Which instruction is correct per current AAP guidelines?",
    options: ["The car seat should face forward from birth", "Rear-facing car seats should be used until at least age 2 or until the child exceeds the rear-facing weight/height limits", "Car seats are optional for short trips", "The car seat should be placed in the front passenger seat for easy access"],
    correctIndex: 1,
    answer: "Current AAP guidelines recommend rear-facing car seats for as long as possible, at least until age 2 or until the child exceeds the rear-facing height and weight limits of the seat. Rear-facing provides the best protection for the infant's head, neck, and spine in a frontal crash. The car seat must always be in the back seat. Never place a rear-facing car seat in front of an active airbag.",
    category: "Pediatrics",
    difficulty: 1,
    image: imgCarSeatSafety
  },
  {
    id: "rn-peds-q7",
    type: "question",
    question: "A nurse is caring for a child with cystic fibrosis. The parent asks why the child needs to take pancreatic enzymes (pancrelipase) with every meal and snack. What is the best explanation?",
    options: ["The enzymes prevent lung infections", "Thick mucus blocks the pancreatic ducts, preventing digestive enzymes from reaching the intestine. The supplement replaces these enzymes so the child can absorb nutrients from food", "The enzymes improve lung function", "The enzymes prevent diabetes"],
    correctIndex: 1,
    answer: "In CF, thick, viscous secretions obstruct the pancreatic ducts, preventing pancreatic enzymes (lipase, protease, amylase) from reaching the small intestine. Without these enzymes, fats, proteins, and starches cannot be properly digested and absorbed, leading to malnutrition, steatorrhea (foul-smelling, bulky, greasy stools), and fat-soluble vitamin deficiencies (A, D, E, K). Pancrelipase must be taken with every meal and snack.",
    category: "Pediatrics",
    difficulty: 2
  },
  {
    id: "rn-peds-q8",
    type: "question",
    question: "A 15-year-old with type 1 diabetes is admitted with DKA for the third time this year. The adolescent admits to skipping insulin doses. What is the most appropriate nursing approach?",
    options: ["Lecture the adolescent about the dangers of skipping insulin", "Assess barriers to adherence including psychosocial factors, peer pressure, body image concerns, and diabulimia in a non-judgmental manner", "Threaten to inform the school about the non-compliance", "Simply reinforce the insulin injection technique"],
    correctIndex: 1,
    answer: "Recurrent DKA in adolescents often has psychosocial underpinnings. 'Diabulimia' (intentional insulin omission for weight control) is a recognized and dangerous eating disorder in type 1 diabetes. The nurse should explore barriers non-judgmentally: body image concerns, peer pressure, mental health issues (depression, anxiety), family dynamics, and practical barriers. Referral to a diabetes educator, psychologist, and social worker may be needed.",
    category: "Pediatrics",
    difficulty: 3,
    image: imgDKA
  },
  {
    id: "rn-peds-q9",
    type: "question",
    question: "A nurse is assessing a newborn with a myelomeningocele. Which nursing action is the highest priority before surgical repair?",
    options: ["Cover the sac with a sterile, moist, non-adherent dressing to prevent drying and infection", "Place the infant in a supine position for comfort", "Begin oral feedings immediately", "Measure head circumference monthly"],
    correctIndex: 0,
    answer: "Myelomeningocele (open spina bifida) exposes the spinal cord and meninges. Before surgical repair, the sac must be covered with sterile, saline-moistened, non-adherent dressing to prevent drying, rupture, and infection. The infant is positioned prone or side-lying to prevent pressure on the sac. Latex precautions are essential (high latex allergy risk). Head circumference is monitored for hydrocephalus but the sac protection is the immediate priority.",
    category: "Pediatrics",
    difficulty: 2
  },
  {
    id: "rn-peds-q10",
    type: "question",
    question: "A nurse is calculating a pediatric medication dose. A 30-kg child is prescribed amoxicillin 25 mg/kg/day divided into three doses. The pharmacy supplies amoxicillin 250 mg/5 mL. How many mL should be given per dose?",
    options: ["5 mL", "10 mL", "15 mL", "20 mL"],
    correctIndex: 0,
    answer: "Step 1: Total daily dose = 25 mg/kg × 30 kg = 750 mg/day. Step 2: Dose per administration = 750 mg ÷ 3 doses = 250 mg per dose. Step 3: Volume per dose = (250 mg ÷ 250 mg) × 5 mL = 5 mL per dose. Pediatric medication calculations require weight-based dosing and must always be verified against safe dose ranges and double-checked before administration.",
    category: "Pediatrics",
    difficulty: 1
  },
  {
    id: "rn-peds-q11",
    type: "question",
    question: "A 5-year-old child is admitted with acute rheumatic fever following a group A streptococcal pharyngitis. Which finding is a major Jones criterion?",
    options: ["Fever", "Elevated ESR", "Carditis (new murmur)", "Prolonged PR interval on ECG"],
    correctIndex: 2,
    answer: "The revised Jones criteria for diagnosing acute rheumatic fever include 5 major criteria: Carditis (new murmur, pericarditis, heart failure), Polyarthritis (migratory joint inflammation), Chorea (Sydenham's chorea), Erythema marginatum (ring-shaped rash), Subcutaneous nodules. Minor criteria include fever, arthralgia, elevated ESR/CRP, and prolonged PR interval. Diagnosis requires 2 major OR 1 major + 2 minor criteria with evidence of prior strep infection.",
    category: "Pediatrics",
    difficulty: 2
  },
  {
    id: "rn-peds-q12",
    type: "question",
    question: "A nurse is educating parents of a child diagnosed with sickle cell disease about crisis prevention. Which instruction is most important?",
    options: ["Restrict the child's physical activity completely", "Ensure adequate hydration, avoid temperature extremes, and seek prompt treatment for infections", "Give aspirin for pain management", "The child should avoid all social activities to prevent infections"],
    correctIndex: 1,
    answer: "Crisis prevention in sickle cell disease focuses on avoiding triggers that cause sickling: dehydration (maintain generous fluid intake), temperature extremes (cold causes vasoconstriction), high altitude (low oxygen), and infections (functional asplenia increases risk from encapsulated organisms). Hydroxyurea reduces crisis frequency. Aspirin is avoided due to Reye syndrome risk in children. Moderate activity is encouraged; complete restriction is unnecessary.",
    image: imgSickleCellCrisis,
    category: "Pediatrics",
    difficulty: 2
  },
  {
    id: "rn-peds-q13",
    type: "question",
    question: "A nurse is caring for a child with suspected child abuse. Which documentation is most important?",
    options: ["The nurse's opinion about who caused the injuries", "Objective, detailed description of injuries (size, shape, color, location, stage of healing) with body diagrams and verbatim quotes from the child", "A brief note stating 'suspected abuse'", "Only photograph the injuries without written documentation"],
    correctIndex: 1,
    answer: "Documentation in suspected child abuse must be objective, thorough, and factual. Include: exact size and location of injuries using body diagrams, color and stage of healing (helps determine if injuries are of different ages), verbatim quotes from the child and caregivers (placed in quotation marks), photographs per facility protocol, and developmental stage assessment (can the child's development explain the injury mechanism described?). Nurses are mandated reporters.",
    category: "Pediatrics",
    difficulty: 2
  },
  {
    id: "rn-peds-q14",
    type: "question",
    question: "A nurse is caring for a child with hemophilia A who falls and develops a large hematoma on the knee. What is the priority treatment?",
    options: ["Apply heat to the area to promote absorption", "Administer factor VIII concentrate and apply RICE (rest, ice, compression, elevation)", "Administer aspirin for pain", "Encourage the child to walk on the affected leg to prevent stiffness"],
    correctIndex: 1,
    answer: "Hemophilia A is a deficiency of clotting factor VIII. Bleeding episodes are treated with factor VIII concentrate infusion to achieve hemostasis. RICE (rest, ice, compression, elevation) is applied to the joint to minimize swelling and further bleeding. Aspirin and NSAIDs are CONTRAINDICATED (impair platelet function). Heat is contraindicated acutely (increases blood flow and bleeding). Acetaminophen is safe for pain relief.",
    category: "Pediatrics",
    difficulty: 2,
    image: imgHemophilia
  },
  {
    id: "rn-peds-q15",
    type: "question",
    question: "A nurse is preparing to administer an IM injection to a 4-month-old infant. What is the preferred injection site?",
    options: ["Deltoid muscle", "Dorsogluteal muscle", "Vastus lateralis muscle of the anterolateral thigh", "Ventrogluteal muscle"],
    correctIndex: 2,
    answer: "The vastus lateralis (anterolateral thigh) is the preferred IM injection site for infants under 12 months. It has the largest muscle mass in infants and is free of major nerves and blood vessels. The deltoid is too small for IM injections in infants. The dorsogluteal site is NEVER used in children under 3 years (gluteal muscles are underdeveloped, risk of sciatic nerve injury). Ventrogluteal may be used in older infants with provider approval.",
    category: "Pediatrics",
    difficulty: 1
  },
  // ============================================================
  // EMERGENCY (15 cards)
  // ============================================================
  {
    id: "rn-emerg-q1",
    type: "question",
    question: "A nurse is performing CPR on an adult client. After 2 minutes of CPR, the AED analyzes the rhythm and advises 'no shock.' The client has no pulse. What should the nurse do?",
    options: ["Stop CPR and wait for advanced life support", "Resume CPR immediately for another 2 minutes", "Check the AED pads and retry the shock", "Begin rescue breathing only"],
    correctIndex: 1,
    answer: "A 'no shock advised' by the AED means the rhythm is not shockable (asystole or PEA), NOT that the client is alive. CPR must be resumed immediately for another 2 minutes before re-analysis. High-quality CPR (rate 100-120/min, depth 2-2.4 inches, full chest recoil, minimal interruptions) is the foundation of resuscitation. Epinephrine is the primary medication for non-shockable rhythms.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q2",
    type: "question",
    question: "A client with a suspected cervical spine injury is being transported. Which immobilization technique is most appropriate?",
    options: ["Manual inline stabilization with cervical collar, head blocks, and backboard", "Place the client in a sitting position with a soft collar", "Allow the client to position themselves for comfort", "Apply traction to the neck to realign the spine"],
    correctIndex: 0,
    answer: "Cervical spine immobilization requires manual inline stabilization (hands on either side of the head to prevent rotation, flexion, or extension), application of a properly sized rigid cervical collar, lateral head blocks (towel rolls or commercial head blocks), and securing to a long backboard with straps. The goal is to maintain neutral spine alignment and prevent secondary spinal cord injury during transport.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q3",
    type: "question",
    question: "A nurse in the ED is triaging 4 clients who arrive simultaneously. Which client should be seen FIRST?",
    options: ["Client with a closed forearm fracture and moderate pain", "Client with chest pain, diaphoresis, and jaw pain radiating to the left arm", "Client with a laceration on the forehead with controlled bleeding", "Client with a twisted ankle and mild swelling"],
    correctIndex: 1,
    answer: "Using the Emergency Severity Index (ESI) or any triage system, chest pain with diaphoresis and radiation to the jaw/left arm suggests acute myocardial infarction, which is immediately life-threatening. This client requires emergent evaluation (ESI Level 1-2). The forearm fracture and laceration are urgent but not immediately life-threatening (ESI Level 3). The twisted ankle is non-urgent (ESI Level 4-5).",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q4",
    type: "question",
    question: "A client is brought to the ED after a house fire with burns to the face, singeing of nasal hair, and a hoarse voice. What is the MOST critical concern?",
    options: ["Pain management for the facial burns", "Impending airway edema from inhalation injury", "Fluid resuscitation for burn shock", "Tetanus prophylaxis"],
    correctIndex: 1,
    answer: "Facial burns, singed nasal hairs, and hoarseness are classic signs of inhalation injury with impending airway compromise. Airway edema develops rapidly and can cause complete obstruction within hours. EARLY endotracheal intubation is essential before edema makes intubation impossible. Once airway is secured, fluid resuscitation (Parkland formula: 4 mL × %TBSA × kg in first 24 hours) and wound care can proceed.",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-emerg-q5",
    type: "question",
    question: "A nurse receives a client with a snakebite on the right hand. The area is swollen with two puncture marks. What is the priority nursing intervention?",
    options: ["Apply a tourniquet above the bite", "Apply ice directly to the bite", "Remove jewelry from the affected hand, keep the extremity below heart level, and prepare for antivenom administration", "Incise the wound and suction the venom"],
    correctIndex: 2,
    answer: "Priority interventions for snakebite: remove rings, watches, and constrictive clothing before swelling progresses; immobilize the extremity and keep it below heart level (slows venom distribution); establish IV access in the unaffected arm; prepare for antivenom (CroFab for pit viper bites). Do NOT apply tourniquet, ice, or incision/suction (outdated and harmful practices that can worsen tissue damage). Mark the edge of swelling and time it to track progression.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q6",
    type: "question",
    question: "During a mass casualty incident, a nurse is performing START triage. A victim is not breathing. After repositioning the airway, the victim begins breathing at 24 breaths/min. What triage color is assigned?",
    options: ["Green (minor/walking wounded)", "Yellow (delayed)", "Red (immediate)", "Black (expectant/deceased)"],
    correctIndex: 2,
    answer: "In START triage, if a non-breathing victim begins breathing after airway positioning, they are tagged RED (immediate) because they require urgent intervention. If breathing does not resume, they are BLACK (expectant/deceased). Victims breathing >30/min are RED. Victims with radial pulse absent or capillary refill >2 seconds are RED. Victims who cannot follow simple commands are RED. Walking wounded are GREEN. Others are YELLOW.",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-emerg-q7",
    type: "question",
    question: "A client presents to the ED with an acute anaphylactic reaction after a bee sting. BP is 68/40, widespread urticaria, and audible wheezing. What is the FIRST medication to administer?",
    options: ["Diphenhydramine (Benadryl) IV", "Epinephrine 0.3-0.5 mg IM into the anterolateral thigh", "Albuterol nebulizer", "Methylprednisolone IV"],
    correctIndex: 1,
    answer: "Epinephrine is the FIRST and MOST IMPORTANT medication in anaphylaxis. It is given IM (NOT subcutaneously) in the anterolateral thigh for fastest absorption. Dose: 0.3-0.5 mg of 1:1,000 concentration for adults. It reverses bronchospasm (beta-2), increases blood pressure (alpha-1), and reduces mast cell mediator release. Antihistamines and steroids are adjuncts but should NEVER delay epinephrine. May repeat every 5-15 minutes.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q8",
    type: "question",
    question: "A nurse is caring for a client with a flail chest segment. Which respiratory pattern does the nurse expect to observe?",
    options: ["Both sides of the chest rise symmetrically", "The flail segment moves inward during inspiration and outward during expiration (paradoxical movement)", "Rapid shallow breathing without chest wall abnormalities", "Normal chest movement with decreased breath sounds"],
    correctIndex: 1,
    answer: "Flail chest occurs when 3 or more adjacent ribs are fractured in 2 or more places, creating a free-floating segment. This segment moves paradoxically: inward during inspiration (negative intrathoracic pressure pulls the unsupported segment in) and outward during expiration. This impairs ventilation and the underlying pulmonary contusion further compromises gas exchange. Management includes pain control, positive pressure ventilation if needed, and pulmonary toilet.",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-emerg-q9",
    type: "question",
    question: "A client with a suspected tension pneumothorax has tracheal deviation, absent breath sounds on the left, JVD, and hypotension. The ED physician performs needle decompression. At which anatomical landmark is this performed?",
    options: ["5th intercostal space, mid-axillary line", "2nd intercostal space, midclavicular line on the affected side", "4th intercostal space, anterior axillary line", "Subxiphoid approach"],
    correctIndex: 1,
    answer: "Needle decompression for tension pneumothorax is performed at the 2nd intercostal space, midclavicular line on the AFFECTED side. A large-bore needle (14-16 gauge) is inserted above the 3rd rib (to avoid the neurovascular bundle running along the inferior border of each rib). A rush of air confirms the diagnosis. This converts the tension pneumothorax to a simple pneumothorax, followed by formal chest tube insertion.",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-emerg-q10",
    type: "question",
    question: "A nurse is providing care during a chemical exposure incident. Victims arrive at the ED with an unknown chemical exposure. What is the FIRST action?",
    options: ["Bring victims inside the ED immediately for treatment", "Perform decontamination OUTSIDE the ED before victims enter the building", "Start IV fluids on all victims", "Identify the specific chemical before taking any action"],
    correctIndex: 1,
    answer: "Decontamination must occur OUTSIDE the emergency department to prevent secondary contamination of the facility and staff. Victims remove all clothing (removes approximately 80% of contaminant) and undergo water-based decontamination before entering the ED. Staff performing decontamination must wear appropriate PPE. The ED should be in lockdown mode with controlled access until decontamination is complete.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q11",
    type: "question",
    question: "A client in the ED is found to be in pulseless ventricular tachycardia. According to ACLS guidelines, what is the sequence of interventions?",
    options: ["Epinephrine first, then defibrillation", "CPR, then defibrillation as soon as the defibrillator is available, then resume CPR", "Amiodarone first, then CPR", "Synchronized cardioversion at 50 joules"],
    correctIndex: 1,
    answer: "Pulseless VT is a shockable rhythm. ACLS sequence: begin high-quality CPR immediately, defibrillate as soon as the defibrillator is available (biphasic 120-200J), resume CPR for 2 minutes, then reassess. Epinephrine 1 mg IV/IO is given after the 2nd shock. Amiodarone 300 mg IV is given after the 3rd shock. Synchronized cardioversion is used for VT WITH a pulse, not pulseless VT.",
    category: "Emergency",
    difficulty: 3,
    image: getAssetUrl("lethaldysrhythmias_1773517523349.png")
  },
  {
    id: "rn-emerg-q12",
    type: "question",
    question: "A nurse is caring for a client with heat stroke. Core body temperature is 41.5°C (106.7°F). The client is confused and has hot, dry skin. What is the priority intervention?",
    options: ["Administer acetaminophen and encourage oral fluids", "Initiate rapid cooling with ice packs to groin, axillae, and neck, plus evaporative cooling with tepid water misting and fans", "Place the client in a warm room and monitor", "Give cold water to drink immediately"],
    correctIndex: 1,
    answer: "Heat stroke is a true medical emergency with mortality rates of 10-80% if untreated. The priority is rapid cooling to reduce core temperature below 39°C within 30 minutes. Methods include ice packs to major vessels (groin, axillae, neck), evaporative cooling (misting with tepid water plus fans), and cold IV fluids. Antipyretics (acetaminophen, NSAIDs) are INEFFECTIVE because the hyperthermia is from heat absorption, not pyrogen-mediated.",
    category: "Emergency",
    difficulty: 2,
    image: imgHeatStroke
  },
  {
    id: "rn-emerg-q13",
    type: "question",
    question: "A client is brought to the ED after near-drowning in cold water. The client is pulseless and hypothermic (30°C). Should resuscitation be attempted?",
    options: ["No, the client is already dead", "Yes, begin CPR and rewarming; hypothermic patients are not declared dead until warm and dead", "Only if the submersion time was less than 5 minutes", "Only if the client is under 18 years old"],
    correctIndex: 1,
    answer: "The principle 'no one is dead until warm and dead' applies to hypothermic cardiac arrest. Cold water can be protective by reducing metabolic demands. Resuscitation should continue with CPR and active rewarming (warmed IV fluids, warmed humidified oxygen, warm peritoneal lavage, potentially extracorporeal rewarming) until core temperature reaches at least 32-35°C. Defibrillation and medications may be ineffective until rewarming occurs.",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-emerg-q14",
    type: "question",
    question: "A client involved in a motor vehicle collision has a blood pressure of 78/50, heart rate 130, and the abdomen is distended and rigid. What type of shock is the nurse managing?",
    options: ["Cardiogenic shock", "Hypovolemic shock from intra-abdominal hemorrhage", "Neurogenic shock", "Septic shock"],
    correctIndex: 1,
    answer: "Hypotension, tachycardia, and a distended rigid abdomen after trauma indicate hypovolemic shock from intra-abdominal hemorrhage (likely splenic or hepatic laceration). Treatment includes two large-bore IVs, massive transfusion protocol activation (packed RBCs, FFP, platelets in 1:1:1 ratio), and emergent surgical intervention. The FAST exam (Focused Assessment with Sonography for Trauma) can quickly identify free fluid in the abdomen.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q15",
    type: "question",
    question: "A nurse is caring for a client with diabetic ketoacidosis who has Kussmaul respirations. What is the physiological purpose of this breathing pattern?",
    options: ["To increase oxygen delivery to tissues", "Deep, rapid breathing is the body's attempt to blow off CO2 to compensate for the metabolic acidosis", "It indicates pneumonia complicating the DKA", "The client is hyperventilating from anxiety"],
    correctIndex: 1,
    answer: "Kussmaul respirations (deep, rapid breathing) are a compensatory mechanism for metabolic acidosis in DKA. The lungs blow off CO2 (a volatile acid), which temporarily raises blood pH. This is respiratory compensation for metabolic acidosis. The equation: CO2 + H2O ↔ H2CO3 ↔ H+ + HCO3-. By exhaling more CO2, the equation shifts left, reducing H+ concentration. This compensation is limited and does not fully correct severe acidosis.",
    category: "Emergency",
    difficulty: 2,
    image: imgDKA
  },
  // ============================================================
  // INFECTION CONTROL (15 cards)
  // ============================================================
  {
    id: "rn-ic-q1",
    type: "question",
    question: "A client with active pulmonary tuberculosis is admitted to the hospital. Which type of isolation is required?",
    options: ["Contact precautions with gown and gloves", "Droplet precautions with surgical mask", "Airborne precautions with negative pressure room and N95 respirator", "Standard precautions only"],
    correctIndex: 2,
    answer: "Tuberculosis requires airborne precautions because TB bacilli (Mycobacterium tuberculosis) are transmitted via airborne nuclei that remain suspended in air for hours. Requirements: negative pressure room (air exhausted to outside or through HEPA filter), door kept closed, healthcare workers wear fitted N95 respirator, and the client wears a surgical mask during transport. Precautions continue until 3 consecutive negative sputum AFB smears.",
    category: "Infection Control",
    difficulty: 2
  },
  {
    id: "rn-ic-q2",
    type: "question",
    question: "A nurse has a needlestick injury from a client with unknown HIV status. What is the priority action?",
    options: ["Wait for the client's HIV test results before doing anything", "Immediately wash the wound, report to occupational health, and initiate post-exposure prophylaxis (PEP) within 72 hours (ideally within 2 hours)", "Apply a bandage and continue working", "Only report if symptoms develop"],
    correctIndex: 1,
    answer: "After a needlestick injury: immediately wash the wound with soap and water (do NOT squeeze or milk the wound), report to occupational health/supervisor, and seek evaluation for PEP. PEP (typically 3-drug antiretroviral regimen for 28 days) should ideally be started within 2 hours of exposure, no later than 72 hours. Baseline HIV testing of both the nurse and source client should be obtained. Follow-up testing at 6 weeks, 3 months, and 6 months.",
    category: "Infection Control",
    difficulty: 2,
    image: imgHIV
  },
  {
    id: "rn-ic-q3",
    type: "question",
    question: "A nurse is planning care for 4 clients. In which order should the nurse provide care to minimize infection transmission?",
    options: ["MRSA client first, then immunocompromised client, then routine client, then C. diff client", "Immunocompromised client first, then routine clients, then MRSA client, then C. difficile client last", "C. diff client first, then MRSA, then immunocompromised, then routine", "Order does not matter if hand hygiene is performed"],
    correctIndex: 1,
    answer: "The nurse should see the most vulnerable (immunocompromised) client first when the nurse is cleanest, followed by routine clients, then clients with infections. C. difficile should be last because spores are extremely difficult to remove and persist on surfaces. While proper hand hygiene and PPE should theoretically prevent transmission regardless of order, prioritizing care sequence adds an extra layer of safety.",
    category: "Infection Control",
    difficulty: 2
  },
  {
    id: "rn-ic-q4",
    type: "question",
    image: imgVaricella,
    question: "A nurse is caring for a client with varicella (chickenpox). Which isolation precautions are required?",
    options: ["Standard precautions only", "Contact precautions only", "Airborne AND contact precautions", "Droplet precautions only"],
    correctIndex: 2,
    answer: "Varicella-zoster virus (chickenpox) requires BOTH airborne AND contact precautions. The virus is transmitted via airborne route (respiratory droplets that can travel long distances) and via direct contact with the vesicular lesion fluid. Requirements: negative pressure room, N95 respirator, gown and gloves. Only immune healthcare workers (history of varicella or positive varicella titer) should care for these clients when possible.",
    category: "Infection Control",
    difficulty: 2
  },
  {
    id: "rn-ic-q5",
    type: "question",
    question: "A nurse is preparing to insert a urinary catheter. Which element of the CAUTI prevention bundle is most important?",
    options: ["Using the largest catheter available", "Using strict aseptic technique during insertion and removing the catheter as soon as it is no longer clinically indicated", "Irrigating the catheter daily with saline", "Changing the catheter every 48 hours routinely"],
    correctIndex: 1,
    answer: "CAUTI prevention bundles include: insert only when clinically indicated, use strict aseptic technique during insertion, use the smallest appropriate catheter size, maintain a closed drainage system, secure the catheter to prevent traction, keep the drainage bag below bladder level, perform daily reassessment and REMOVE as soon as possible. Each day a catheter remains increases infection risk by 3-7%. Routine catheter changes are NOT recommended.",
    image: imgUrinaryCatheterization,
    category: "Infection Control",
    difficulty: 2
  },
  {
    id: "rn-ic-q6",
    type: "question",
    question: "A nurse is educating staff about central line-associated bloodstream infection (CLABSI) prevention. Which element of the central line bundle is correct?",
    options: ["Change the central line dressing weekly regardless of condition", "Use maximal sterile barrier precautions during insertion: cap, mask, sterile gown, sterile gloves, and full-body sterile drape", "Femoral site is preferred for central line insertion", "Antibiotic prophylaxis is required before insertion"],
    correctIndex: 1,
    answer: "The CLABSI prevention bundle includes: hand hygiene, maximal sterile barrier precautions during insertion (cap, mask, sterile gown, sterile gloves, large sterile drape), chlorhexidine skin antisepsis, optimal catheter site selection (subclavian preferred, avoid femoral), daily assessment of line necessity with prompt removal when no longer needed, and proper dressing changes (transparent dressing every 7 days, gauze every 2 days).",
    category: "Infection Control",
    difficulty: 2
  },
  {
    id: "rn-ic-q7",
    type: "question",
    question: "A nurse is caring for a client with meningococcal meningitis. Which precautions are required, and for how long?",
    options: ["Airborne precautions for the duration of hospitalization", "Droplet precautions until 24 hours after effective antibiotic therapy", "Contact precautions for 7 days", "No isolation is needed for bacterial meningitis"],
    correctIndex: 1,
    answer: "Neisseria meningitidis (meningococcal meningitis) is transmitted via respiratory droplets and requires droplet precautions (surgical mask within 3-6 feet). Precautions are maintained until 24 hours after initiation of effective antibiotic therapy (ceftriaxone or penicillin G). Close contacts need chemoprophylaxis (ciprofloxacin, rifampin, or ceftriaxone) within 24 hours of identification to prevent secondary cases.",
    category: "Infection Control",
    difficulty: 2,
    image: imgBacterialMeningitis
  },
  {
    id: "rn-ic-q8",
    type: "question",
    question: "A nurse is performing hand hygiene. In which situation should soap and water be used instead of alcohol-based hand rub?",
    options: ["Before routine patient contact", "When hands are visibly soiled or contaminated with C. difficile spores", "After removing gloves when hands are clean", "Between caring for two clients in the same room"],
    correctIndex: 1,
    answer: "Alcohol-based hand sanitizers are preferred for most hand hygiene situations as they are more effective against most bacteria and viruses. However, soap and water MUST be used when: hands are visibly soiled or contaminated with body fluids, after caring for clients with C. difficile (alcohol does not kill spores), and after caring for clients with norovirus. The friction of washing physically removes spores that alcohol cannot kill.",
    category: "Infection Control",
    difficulty: 1
  },
  {
    id: "rn-ic-q9",
    type: "question",
    question: "A nurse is assessing a surgical wound on postoperative day 3. The wound has increasing redness, warmth, purulent drainage, and the client has a temperature of 38.8°C. What should the nurse do?",
    options: ["Apply warm compresses and reassess tomorrow", "Obtain a wound culture, notify the surgeon, and document detailed wound assessment", "Change the dressing and apply antibiotic ointment", "Tell the client this is normal postoperative healing"],
    correctIndex: 1,
    answer: "Increasing redness, warmth, purulent drainage, and fever on POD 3 indicate surgical site infection (SSI). The nurse should obtain a wound culture BEFORE antibiotics are started (to identify the causative organism and guide targeted therapy), notify the surgeon, and document the wound assessment objectively (size, drainage character and amount, surrounding tissue condition, odor). IV antibiotics and possible wound exploration may be needed.",
    image: imgWoundInfection,
    category: "Infection Control",
    difficulty: 2
  },
  {
    id: "rn-ic-q10",
    type: "question",
    question: "A nurse is donning PPE before entering the room of a client on contact and droplet precautions. What is the correct order for putting on PPE?",
    options: ["Gloves, gown, mask, eye protection", "Gown, mask/respirator, eye protection/face shield, gloves", "Mask, gloves, gown, eye protection", "Gloves, mask, eye protection, gown"],
    correctIndex: 1,
    answer: "The correct donning order is: 1) Hand hygiene, 2) Gown (ties in back), 3) Mask or N95 respirator (fit over nose and mouth), 4) Eye protection/face shield, 5) Gloves (over gown cuffs). For doffing (removal), the order is designed to minimize self-contamination: 1) Gloves, 2) Hand hygiene, 3) Gown, 4) Hand hygiene, 5) Eye protection, 6) Mask/respirator, 7) Hand hygiene.",
    category: "Infection Control",
    difficulty: 1
  },
  // ============================================================
  // FLUID & ELECTROLYTES (15 cards)
  // ============================================================
  {
    id: "rn-fe-q1",
    type: "question",
    question: "A client's ABG results show: pH 7.28, PaCO2 38, HCO3 16, PaO2 88. What acid-base disturbance is present?",
    options: ["Respiratory acidosis", "Metabolic acidosis, uncompensated", "Respiratory alkalosis", "Metabolic alkalosis"],
    correctIndex: 1,
    answer: "The pH is acidotic (below 7.35). PaCO2 is normal (35-45 mmHg), ruling out a respiratory cause. HCO3 is low (below 22 mEq/L), indicating the acidosis is metabolic in origin. Since PaCO2 is normal (the lungs are not compensating by blowing off CO2), this is uncompensated metabolic acidosis. Causes include diabetic ketoacidosis, renal failure, lactic acidosis, and severe diarrhea.",
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-fe-q2",
    type: "question",
    question: "A nurse is caring for a client with a sodium level of 118 mEq/L. The client is confused and lethargic. Which IV solution does the nurse anticipate?",
    options: ["D5W", "0.45% normal saline (half-normal)", "3% hypertonic saline", "Lactated Ringer's"],
    correctIndex: 2,
    answer: "Severe symptomatic hyponatremia (Na <120 mEq/L with neurological symptoms) requires 3% hypertonic saline administered via infusion pump. The goal is to raise sodium by no more than 10-12 mEq/L in 24 hours to prevent osmotic demyelination syndrome (central pontine myelinolysis). D5W would worsen hyponatremia. Frequent sodium level checks (every 2-4 hours) are mandatory during correction.",
    category: "Fluid & Electrolytes",
    difficulty: 3
  },
  {
    id: "rn-fe-q3",
    type: "question",
    question: "A client with SIADH has a serum osmolality of 260 mOsm/kg and urine osmolality of 600 mOsm/kg. What is the primary treatment?",
    options: ["Increase IV fluid rate", "Fluid restriction to 500-1,000 mL/day", "Administer furosemide and fluid bolus simultaneously", "Start DDAVP immediately"],
    correctIndex: 1,
    answer: "SIADH causes excess ADH secretion, leading to water retention, dilutional hyponatremia, and inappropriately concentrated urine (high urine osmolality relative to low serum osmolality). The primary treatment is fluid restriction (typically 500-1,000 mL/day) to allow the body to correct the dilutional state. In severe cases, hypertonic saline may be needed. DDAVP would worsen the condition (it IS ADH). Demeclocycline or tolvaptan may be used for chronic SIADH.",
    image: imgSIADH,
    category: "Fluid & Electrolytes",
    difficulty: 3
  },
  {
    id: "rn-fe-q4",
    type: "question",
    question: "A nurse is administering IV potassium chloride to a client with hypokalemia (K+ 2.8 mEq/L). Which safety precaution is essential?",
    options: ["Administer the potassium by IV push for rapid correction", "Never exceed 10-20 mEq/hour via peripheral IV, always on a pump with cardiac monitoring", "Mix potassium with D5W only", "Potassium can be safely given without cardiac monitoring"],
    correctIndex: 1,
    answer: "IV potassium chloride must NEVER be given by IV push (can cause fatal cardiac arrest). Standard guidelines: maximum concentration 40 mEq/L for peripheral IV (80 mEq/L for central line), maximum rate 10-20 mEq/hour (higher rates require ICU monitoring), always via infusion pump, with continuous cardiac monitoring. The nurse should monitor for burning at the IV site (potassium is vesicant) and assess for ECG changes (peaked T waves if correcting too rapidly).",
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-fe-q5",
    type: "question",
    question: "A client with hypercalcemia (Ca 14.2 mg/dL) from malignancy is prescribed IV normal saline and IV furosemide. What is the rationale for this combination?",
    options: ["NS provides hydration and furosemide promotes renal calcium excretion", "NS corrects the calcium directly", "Furosemide retains calcium for bone strengthening", "This combination is incorrect for hypercalcemia"],
    correctIndex: 0,
    answer: "Aggressive IV normal saline hydration expands intravascular volume and increases renal blood flow, enhancing calcium filtration. Furosemide (a loop diuretic) further promotes renal calcium excretion by inhibiting calcium reabsorption in the loop of Henle. This combination is first-line for acute hypercalcemia. Additional treatments may include bisphosphonates (zoledronic acid), calcitonin, and treating the underlying malignancy. Thiazide diuretics are CONTRAINDICATED (they retain calcium).",
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-fe-q6",
    type: "question",
    question: "A nurse is assessing a client with a magnesium level of 1.0 mEq/L. Which clinical finding does the nurse expect?",
    options: ["Bradycardia and constipation", "Hyperactive deep tendon reflexes, positive Trousseau and Chvostek signs, and cardiac arrhythmias", "Decreased reflexes and respiratory depression", "Polyuria and polydipsia"],
    correctIndex: 1,
    answer: "Hypomagnesemia (Mg <1.5 mEq/L) causes neuromuscular excitability similar to hypocalcemia: hyperactive DTRs, Trousseau and Chvostek signs (because magnesium depletion impairs parathyroid hormone release, causing secondary hypocalcemia), tremors, seizures, and cardiac arrhythmias (torsades de pointes, widened QRS). Hypermagnesemia causes the opposite: decreased reflexes, respiratory depression, and cardiac arrest.",
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-fe-q7",
    type: "question",
    question: "A client with severe burns has the following lab values 8 hours post-injury: K+ 6.4 mEq/L, Na+ 130 mEq/L, Hct 58%. What is the explanation for these values?",
    options: ["The client is dehydrated from insufficient oral intake", "Cell destruction from burns releases intracellular potassium; capillary leak causes hemoconcentration and third-spacing shifts sodium to interstitial space", "The lab values are normal for a burn patient", "The client has developed acute kidney injury"],
    correctIndex: 1,
    answer: "In the first 24-48 hours after major burns: massive cell destruction releases intracellular potassium (hyperkalemia). Increased capillary permeability causes plasma proteins and fluid to shift to the interstitium (third-spacing), concentrating the blood (elevated Hct) and causing hyponatremia (dilutional effect from fluid shifts). This is the burn shock phase requiring aggressive crystalloid resuscitation using the Parkland formula.",
    category: "Fluid & Electrolytes",
    difficulty: 3
  },
  {
    id: "rn-fe-q8",
    type: "question",
    question: "A nurse is administering 0.9% normal saline (NS) to a client. This solution is classified as which type of IV fluid?",
    options: ["Hypotonic", "Isotonic", "Hypertonic", "Colloid"],
    correctIndex: 1,
    answer: "0.9% NS (normal saline, 308 mOsm/L) is isotonic, meaning its osmolality is similar to blood plasma (275-295 mOsm/L). Isotonic fluids expand the intravascular compartment without causing osmotic shifts between compartments. Other isotonic fluids include lactated Ringer's and D5W (initially isotonic but becomes hypotonic as dextrose is metabolized). NS is the primary resuscitation fluid and is compatible with blood product administration.",
    category: "Fluid & Electrolytes",
    difficulty: 1
  },
  {
    id: "rn-fe-q9",
    type: "question",
    question: "A client receiving IV fluids develops crackles in the lung bases, JVD, bounding pulse, and weight gain of 2 kg in 24 hours. What complication has developed?",
    options: ["Dehydration", "Fluid volume excess (hypervolemia)", "Electrolyte imbalance", "Air embolism"],
    correctIndex: 1,
    answer: "Crackles (fluid in alveoli), JVD (venous congestion), bounding pulse (increased circulating volume), and rapid weight gain are classic signs of fluid volume excess/hypervolemia. Each kg of weight gain equals approximately 1 liter of retained fluid. The nurse should slow the IV rate, elevate the HOB, monitor I&O, and anticipate diuretic administration. Assessment for pulmonary edema should be ongoing.",
    category: "Fluid & Electrolytes",
    difficulty: 1
  },
  {
    id: "rn-fe-q10",
    type: "question",
    question: "A nurse is caring for a client with phosphorus level of 1.8 mg/dL (normal 2.5-4.5). What clinical manifestation is the nurse most concerned about?",
    options: ["Constipation", "Muscle weakness and potential respiratory failure from diaphragm weakness", "Hyperactive reflexes", "Bradycardia"],
    correctIndex: 1,
    answer: "Severe hypophosphatemia (<2.0 mg/dL) causes impaired ATP production, which is essential for muscle contraction and cellular energy. This leads to generalized muscle weakness that can progress to respiratory failure from diaphragm weakness, altered mental status, seizures, and hemolytic anemia (weak RBC membranes). Hypophosphatemia is common in refeeding syndrome, alcoholism, and DKA treatment. IV potassium phosphate may be needed for severe cases.",
    category: "Fluid & Electrolytes",
    difficulty: 3
  },
  // ============================================================
  // PAIN MANAGEMENT (10 cards)
  // ============================================================
  {
    id: "rn-pain-q1",
    type: "question",
    question: "A nurse is caring for a client who rates pain as 8/10 but is laughing and talking on the phone. How should the nurse respond to this discrepancy?",
    options: ["Document that the client does not appear to be in pain", "Treat the pain based on the client's self-report, as pain is subjective and individual", "Withhold pain medication because the behavior is inconsistent with the pain rating", "Confront the client about the inconsistency"],
    correctIndex: 1,
    answer: "Pain is whatever the client says it is. Self-report is the most reliable indicator of pain, regardless of behavioral observations. People cope with pain differently: some distract themselves by socializing or watching TV. Cultural, personal, and psychological factors influence pain expression. The nurse should treat based on the client's reported pain level and document both the self-report and observed behavior without making judgments.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q2",
    type: "question",
    question: "A client with chronic cancer pain is receiving a fentanyl transdermal patch. The client reports breakthrough pain. What type of medication is typically prescribed for breakthrough cancer pain?",
    options: ["Long-acting morphine", "Immediate-release oral opioid (e.g., oxycodone IR or morphine IR)", "Increased patch dose only", "Acetaminophen exclusively"],
    correctIndex: 1,
    answer: "Breakthrough pain in cancer patients on long-acting opioids (fentanyl patch, sustained-release morphine) is treated with immediate-release (IR) opioid formulations that provide rapid onset pain relief. The breakthrough dose is typically 10-20% of the total 24-hour opioid dose. If breakthrough doses are needed more than 3-4 times daily, the baseline long-acting dose should be increased. Acetaminophen alone is insufficient for cancer breakthrough pain.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q3",
    type: "question",
    question: "A postoperative client has a PCA pump with morphine. The nurse finds the client's spouse pressing the PCA button while the client sleeps. What should the nurse do?",
    options: ["Thank the spouse for helping manage the patient's pain", "Immediately stop the PCA, assess the client's respiratory status, and educate about PCA safety", "Allow the spouse to continue as the client needs rest", "Increase the lockout interval only"],
    correctIndex: 1,
    answer: "PCA by proxy (anyone other than the patient pressing the button) is a serious safety violation that can cause fatal respiratory depression. The patient must be the only one pressing the button because they will naturally stop pressing when sedated, creating a built-in safety mechanism. The nurse should stop the PCA, assess respiratory status (RR, SpO2, sedation level), educate the spouse firmly, and document the event as a safety concern.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q4",
    type: "question",
    question: "A nurse is managing a client with neuropathic pain from diabetic peripheral neuropathy. Which medication class is first-line for neuropathic pain?",
    image: imgPeripheralNeuropathy,
    options: ["Opioids (morphine)", "Anticonvulsants (gabapentin or pregabalin) or antidepressants (duloxetine)", "NSAIDs (ibuprofen)", "Muscle relaxants (cyclobenzaprine)"],
    correctIndex: 1,
    answer: "Neuropathic pain (burning, tingling, shooting pain from nerve damage) does not respond well to traditional analgesics. First-line agents include anticonvulsants (gabapentin, pregabalin) that stabilize nerve membranes, and SNRIs (duloxetine) that modulate descending pain inhibition pathways. Tricyclic antidepressants (amitriptyline) are second-line. Opioids are generally avoided due to limited efficacy and addiction risk. Topical lidocaine or capsaicin may provide adjunctive relief.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q5",
    type: "question",
    question: "A client on long-term opioid therapy requires progressively higher doses to achieve the same pain relief. What is this phenomenon called?",
    options: ["Addiction", "Tolerance", "Physical dependence", "Pseudoaddiction"],
    correctIndex: 1,
    answer: "Tolerance is a pharmacological phenomenon where the body adapts to the drug, requiring higher doses to achieve the same effect. It is a normal physiological response, NOT addiction. Addiction involves compulsive drug use despite harm, loss of control, and craving. Physical dependence (withdrawal symptoms if stopped suddenly) is also different from addiction. Pseudoaddiction is drug-seeking behavior caused by undertreated pain that resolves when pain is adequately managed.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q6",
    type: "question",
    question: "A nurse is preparing to administer ketorolac (Toradol) IM to a postoperative client. What is the maximum recommended duration for ketorolac therapy?",
    options: ["2 weeks", "5 days", "30 days", "No time limit"],
    correctIndex: 1,
    answer: "Ketorolac (Toradol) is a potent NSAID used for short-term management of moderate to severe pain. It must NOT be used for more than 5 days total (all routes combined) due to increased risk of GI bleeding, peptic ulceration, renal impairment, and cardiovascular events with prolonged use. It is contraindicated in clients with renal impairment, active GI bleeding, or those on anticoagulants.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q7",
    type: "question",
    question: "A nurse is using the FLACC scale to assess pain in a 2-year-old child. What does this scale assess?",
    options: ["Facial expression, Leg movement, Activity, Cry, and Consolability", "Fear, Language, Attention, Confusion, and Compliance", "Frequency, Location, Amplitude, Character, and Chronicity", "Function, Lifestyle, Appearance, Cognition, and Communication"],
    correctIndex: 0,
    answer: "FLACC is a behavioral pain assessment tool for children ages 2 months to 7 years or non-verbal patients who cannot self-report. Each category (Face, Legs, Activity, Cry, Consolability) is scored 0-2, for a total of 0-10. Score 0 = no pain, 1-3 = mild, 4-6 = moderate, 7-10 = severe. Self-report (Wong-Baker FACES, numerical scale) is preferred when the child is old enough (typically 3+ years).",
    category: "Pain Management",
    difficulty: 1
  },
  {
    id: "rn-pain-q8",
    type: "question",
    question: "A client is prescribed a fentanyl patch 50 mcg/hr. How long does it take for the patch to reach full therapeutic effect?",
    options: ["30 minutes", "2-4 hours", "12-24 hours", "48 hours"],
    correctIndex: 2,
    answer: "Fentanyl transdermal patches take 12-24 hours to reach full therapeutic effect because the drug must build up a depot in the subcutaneous tissue before steady absorption occurs. This means breakthrough pain medication must be available during the first 24 hours. Similarly, after removal, fentanyl continues to be absorbed from the tissue depot for 12-24 hours. Patches are changed every 72 hours. Avoid heat exposure (increases absorption rate dangerously).",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q9",
    type: "question",
    question: "A nurse is performing multimodal pain management for a postoperative client. What does multimodal analgesia mean?",
    options: ["Using the highest dose of one strong opioid", "Combining different classes of analgesics (opioids, NSAIDs, acetaminophen, local anesthetics, adjuvants) to target different pain pathways while reducing opioid requirements", "Using only non-pharmacological interventions", "Alternating between two opioids"],
    correctIndex: 1,
    answer: "Multimodal analgesia combines medications from different pharmacological classes that target different pain pathways: opioids (central mu receptors), NSAIDs (peripheral COX inhibition), acetaminophen (central COX inhibition), gabapentin (calcium channel modulation), local anesthetics (sodium channel blockade), and non-pharmacological methods (ice, positioning, relaxation). This approach provides superior pain control with lower opioid requirements and fewer side effects.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q10",
    type: "question",
    question: "A client receiving epidural morphine for post-cesarean pain reports pruritus. The nurse knows this is caused by:",
    options: ["An allergic reaction to morphine requiring epinephrine", "Histamine release from epidural opioids, a common side effect treated with nalbuphine or low-dose naloxone", "Latex allergy from the epidural catheter", "Infection at the epidural site"],
    correctIndex: 1,
    answer: "Pruritus (itching) is the most common side effect of epidural/intrathecal opioids, affecting up to 60-80% of clients. It is NOT a true allergic reaction but is caused by opioid receptor activation in the dorsal horn and possibly central histamine release. Treatment includes nalbuphine (partial opioid agonist-antagonist) or low-dose IV naloxone infusion, which reverses the pruritus without significantly affecting analgesia. Diphenhydramine has limited efficacy.",
    category: "Pain Management",
    difficulty: 3
  },
  // ============================================================
  // SAFETY & ETHICS (10 cards)
  // ============================================================
  {
    id: "rn-safe-q1",
    type: "question",
    question: "A nurse witnesses a colleague diverting opioid medications for personal use. What is the nurse's legal and ethical obligation?",
    options: ["Confront the colleague privately and give them a chance to stop", "Report the observation to the charge nurse and nurse manager immediately", "Ignore it to avoid workplace conflict", "Report only if patient harm has occurred"],
    correctIndex: 1,
    answer: "Nurses have a legal and ethical obligation to report suspected drug diversion immediately to the charge nurse, nurse manager, and follow facility reporting protocol. Drug diversion is a patient safety issue (patients may receive inadequate pain management), a criminal offense, and a sign that the colleague may need help. Many states have peer assistance programs for nurses with substance use disorders. Failure to report makes the witnessing nurse complicit.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-safe-q2",
    type: "question",
    question: "A nurse is delegating tasks to unlicensed assistive personnel (UAP). Which task is appropriate to delegate to a UAP?",
    options: ["Initial assessment of a newly admitted client", "Administration of oral medications", "Measuring and recording vital signs on a stable client", "Evaluating the effectiveness of a pain medication"],
    correctIndex: 2,
    answer: "The Five Rights of Delegation guide RN decision-making: Right Task (routine, standard procedures with predictable outcomes), Right Circumstances (stable client, not initial assessment), Right Person (trained UAP), Right Direction (clear, specific instructions), Right Supervision (RN monitors and evaluates). Measuring vital signs on a stable client is appropriate for UAP. Assessment, medication administration, and evaluation are RN responsibilities that cannot be delegated.",
    category: "Safety & Ethics",
    difficulty: 1
  },
  {
    id: "rn-safe-q3",
    type: "question",
    question: "A client with advanced cancer has a valid Do Not Resuscitate (DNR) order. The client goes into cardiac arrest. A family member demands that CPR be performed. What should the nurse do?",
    options: ["Begin CPR as the family requests", "Follow the DNR order and provide comfort measures; do NOT initiate CPR", "Wait for the physician to arrive before making a decision", "Ask other family members for their opinion"],
    correctIndex: 1,
    answer: "A valid DNR order is a legal medical order that reflects the client's wishes. It takes precedence over family demands in the moment of cardiac arrest. The nurse should not initiate CPR, provide comfort measures, and calmly explain the DNR order to the family. If the family has concerns, the nurse should facilitate a meeting with the healthcare team and palliative care after the immediate situation. The client's documented wishes are paramount.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-safe-q4",
    type: "question",
    question: "A nurse makes a medication error: the wrong dose of insulin was administered to a client. What should the nurse do FIRST?",
    options: ["Notify the risk management department", "Assess the client immediately and implement safety measures (check blood glucose, monitor for hypoglycemia)", "Complete an incident report", "Inform the client's family"],
    correctIndex: 1,
    answer: "After any medication error, the FIRST priority is the client's safety. Assess the client immediately, check blood glucose (since insulin was the medication), and implement interventions to prevent harm (D50 or glucose at bedside, frequent glucose monitoring). THEN: notify the healthcare provider, complete an incident/occurrence report per facility policy, and document the error factually in the medical record. Incident reports are NOT placed in the medical record.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-safe-q5",
    type: "question",
    question: "A nurse receives a telephone order from a physician. Which action ensures accuracy and legal compliance?",
    options: ["Write the order down and implement it without verification", "Read back the complete order to the physician for verification, document the order with date, time, physician name, and sign it", "Ask a colleague to witness the phone call", "Refuse all telephone orders and require the physician to come in person"],
    correctIndex: 1,
    answer: "The read-back process for telephone orders includes: write the order down as it is given, read the entire order back to the prescriber (including medication name spelled out, dose, route, frequency), receive verbal confirmation that the order is correct, document with date, time, prescriber name, and the nurse's signature with 'T.O.' or 'V.O.' (telephone/verbal order). The prescriber must cosign within the facility's specified timeframe (typically 24-48 hours).",
    category: "Safety & Ethics",
    difficulty: 1
  },
  {
    id: "rn-safe-q6",
    type: "question",
    question: "A nurse is caring for a client who speaks only Mandarin. The client's English-speaking family member offers to interpret. What is the most appropriate action?",
    options: ["Accept the family member's offer to save time", "Use a qualified medical interpreter (in-person or via phone/video) for all clinical communication", "Use hand gestures to communicate", "Wait until the client learns enough English"],
    correctIndex: 1,
    answer: "Professional medical interpreters must be used for all clinical communication with limited-English-proficiency clients. Family members should NOT serve as interpreters because they may lack medical terminology, may alter information to protect the client's feelings, and create confidentiality issues. Minor children should NEVER interpret for adult medical care. Professional interpreters are trained in medical terminology, confidentiality, and cultural mediation.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-safe-q7",
    type: "question",
    question: "A nurse is preparing to restrain an agitated client who is pulling at life-saving IV lines and attempting to remove the endotracheal tube. Which principle must guide the nurse's actions?",
    options: ["Apply restraints whenever the client is agitated", "Use the least restrictive restraint possible, with a physician order, and reassess per protocol (typically every 1-2 hours for medical restraints)", "Physical restraints can be applied indefinitely without reassessment", "Only the physician can apply restraints"],
    correctIndex: 1,
    answer: "Restraint use requires: a provider order (or standing protocol with immediate notification), use of least restrictive method, continuous assessment (circulation, sensation, movement every 1-2 hours), documentation of the clinical justification, alternative interventions attempted before restraint, regular release for ROM and toileting, and ongoing reassessment of the need for continued restraint. Restraints are a last resort after less restrictive measures fail.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-safe-q8",
    type: "question",
    question: "A client tells the nurse they want to refuse a blood transfusion based on religious beliefs (Jehovah's Witness). The client is competent. What is the nurse's role?",
    options: ["Override the client's wishes because the transfusion is medically necessary", "Respect the client's decision, ensure informed refusal is documented, and explore alternatives with the medical team", "Convince the client to accept the transfusion", "Contact the client's religious leader for permission to transfuse"],
    correctIndex: 1,
    answer: "Competent adults have the right to refuse any medical treatment, including life-saving blood transfusions, based on personal or religious beliefs. The nurse must: ensure the client is competent and fully informed of the risks of refusal, document informed refusal, notify the healthcare team, and explore alternatives (volume expanders, erythropoietin, cell salvage if acceptable). The nurse must not attempt to coerce, guilt, or manipulate the client's decision.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-safe-q9",
    type: "question",
    question: "A nurse discovers that a colleague posted a photo of a client's wound on social media, claiming it was for educational purposes. The client's name is not visible. Is this a HIPAA violation?",
    options: ["No, because the client's name is not visible", "Yes, this is a HIPAA violation because any identifiable health information shared without consent violates patient privacy", "Only if the client complains", "Only if the colleague tagged the hospital"],
    correctIndex: 1,
    answer: "This is a HIPAA violation. Protected health information (PHI) includes more than just the client's name: tattoos, birthmarks, room numbers, dates, and unique physical characteristics can identify a client. Posting any clinical images on social media without explicit written consent violates HIPAA regardless of whether the name is visible. Consequences include termination, fines ($100-$50,000 per violation), and possible criminal prosecution.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-safe-q10",
    type: "question",
    question: "A nurse is assigned 6 clients. One client is deteriorating rapidly and needs continuous monitoring. The charge nurse cannot provide relief. What should the nurse do?",
    options: ["Leave the deteriorating client to check on other clients equally", "Prioritize the unstable client, delegate appropriate tasks to UAP for stable clients, communicate the situation in writing to the charge nurse and supervisor", "Refuse the assignment entirely and leave the unit", "Document that staffing was adequate and proceed normally"],
    correctIndex: 1,
    answer: "The nurse should prioritize using ABCs and Maslow's hierarchy. Delegate appropriate tasks for stable clients to UAP. Communicate the unsafe staffing situation to the charge nurse AND supervisor in writing (assignment despite objection/ADO form). Continue providing care while documenting concerns. Abandoning the assignment (leaving) after accepting it constitutes patient abandonment. Falsifying documentation about adequate staffing is dishonest and dangerous.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-onc-q1",
    type: "question",
    question: "A client receiving chemotherapy has an absolute neutrophil count (ANC) of 400/mm³. What is the priority nursing intervention?",
    options: ["Encourage a high-fiber diet", "Initiate neutropenic precautions", "Administer aspirin for fever prophylaxis", "Encourage visitors to boost morale"],
    correctIndex: 1,
    answer: "An ANC below 500/mm³ indicates severe neutropenia. Neutropenic precautions include private room, strict hand hygiene, no fresh flowers or raw fruits/vegetables, avoid rectal temperatures, and monitor for subtle signs of infection since the inflammatory response is blunted.",
    category: "Oncology",
    difficulty: 2
  },
  {
    id: "rn-onc-q2",
    type: "question",
    question: "A client with cancer reports severe nausea 24 hours after chemotherapy. Which medication class is most effective for chemotherapy-induced nausea?",
    options: ["Antihistamines", "5-HT3 receptor antagonists (ondansetron)", "Proton pump inhibitors", "Antacids"],
    correctIndex: 1,
    answer: "5-HT3 receptor antagonists like ondansetron (Zofran) are the gold standard for chemotherapy-induced nausea and vomiting (CINV). They block serotonin receptors in the chemoreceptor trigger zone and GI tract. Often combined with dexamethasone for enhanced effect.",
    category: "Oncology",
    difficulty: 2
  },
  {
    id: "rn-onc-q3",
    type: "question",
    question: "A nurse is preparing to administer a vesicant chemotherapy agent through a peripheral IV. The client reports burning at the IV site. What is the priority action?",
    options: ["Slow the infusion rate", "Apply warm compresses and continue", "Stop the infusion immediately and aspirate residual drug", "Flush the line with normal saline and continue"],
    correctIndex: 2,
    answer: "Burning at the IV site during vesicant administration suggests extravasation, which can cause severe tissue necrosis. Immediately stop the infusion, aspirate residual drug, and administer the appropriate antidote. Document the incident and notify the provider. Never flush the line as this pushes more drug into tissue.",
    category: "Oncology",
    difficulty: 3
  },
  {
    id: "rn-onc-q4",
    type: "question",
    question: "A client with advanced lung cancer develops sudden facial swelling, neck vein distension, and upper extremity edema. What condition should the nurse suspect?",
    options: ["Anaphylaxis", "Superior vena cava syndrome", "Cardiac tamponade", "Angioedema"],
    correctIndex: 1,
    answer: "Superior vena cava (SVC) syndrome occurs when a tumor compresses the SVC, obstructing venous return from the head and upper extremities. It is an oncologic emergency. Signs include facial/periorbital edema, JVD, upper body edema, and dyspnea. Treatment includes radiation, chemotherapy, or stenting.",
    category: "Oncology",
    difficulty: 3,
    image: imgLungCancer
  },
  {
    id: "rn-onc-q5",
    type: "question",
    question: "A client receiving chemotherapy has a platelet count of 18,000/mm³. Which intervention is most important?",
    options: ["Encourage vigorous oral care with a hard-bristle toothbrush", "Implement bleeding precautions", "Administer IM injections for pain management", "Encourage high-impact exercise"],
    correctIndex: 1,
    answer: "A platelet count below 20,000/mm³ places the client at high risk for spontaneous bleeding. Bleeding precautions include soft-bristle toothbrush, electric razor, avoid IM injections and rectal procedures, apply pressure to venipuncture sites, monitor for petechiae, ecchymosis, and occult blood in stools.",
    category: "Oncology",
    difficulty: 2
  },
  {
    id: "rn-onc-q6",
    type: "question",
    question: "A client with breast cancer is receiving doxorubicin (Adriamycin). Which assessment is most critical for this medication?",
    options: ["Liver function tests", "Cardiac function (echocardiogram/MUGA scan)", "Thyroid function tests", "Bone density scan"],
    correctIndex: 1,
    answer: "Doxorubicin is an anthracycline with dose-dependent cardiotoxicity. Cumulative doses can cause irreversible cardiomyopathy and heart failure. Baseline and periodic echocardiograms or MUGA scans are required. The lifetime cumulative dose limit is typically 550 mg/m².",
    category: "Oncology",
    difficulty: 3
  },
  {
    id: "rn-onc-q7",
    type: "question",
    question: "A client with multiple myeloma presents with confusion, polyuria, constipation, and bone pain. Which electrolyte imbalance is most likely?",
    options: ["Hypokalemia", "Hypercalcemia", "Hyponatremia", "Hypermagnesemia"],
    correctIndex: 1,
    answer: "Hypercalcemia is common in multiple myeloma due to osteolytic bone destruction releasing calcium. The mnemonic 'Stones, Bones, Groans, and Moans' describes renal calculi, bone pain, GI symptoms (constipation, nausea), and neurologic changes (confusion, lethargy). Treatment includes IV hydration, calcitonin, and bisphosphonates.",
    category: "Oncology",
    difficulty: 2
  },
  {
    id: "rn-onc-q8",
    type: "question",
    question: "A client undergoing chemotherapy develops tumor lysis syndrome. Which lab findings are expected?",
    options: ["Low potassium, low phosphate, high calcium", "High potassium, high phosphate, high uric acid, low calcium", "Low potassium, high sodium, high glucose", "High calcium, low phosphate, low uric acid"],
    correctIndex: 1,
    answer: "Tumor lysis syndrome occurs when rapid tumor cell destruction releases intracellular contents: potassium (hyperkalemia), phosphate (hyperphosphatemia), uric acid (hyperuricemia), and nucleic acids. The high phosphate binds calcium, causing hypocalcemia. Prevention includes IV hydration and allopurinol or rasburicase before chemotherapy.",
    category: "Oncology",
    difficulty: 3
  },
  {
    id: "rn-onc-q9",
    type: "question",
    question: "A client with a sealed radiation implant (brachytherapy) is assigned to a nurse who is 8 weeks pregnant. What should the charge nurse do?",
    options: ["Allow the pregnant nurse to care for the client with a lead apron", "Reassign the client to a non-pregnant nurse", "Limit the pregnant nurse's time to 30 minutes per shift", "No special precautions are needed for sealed implants"],
    correctIndex: 1,
    answer: "Pregnant nurses should NOT be assigned to clients with radiation implants due to the risk of fetal exposure. Time, distance, and shielding are the principles of radiation safety. Even with sealed implants, pregnant healthcare workers should be reassigned to minimize any radiation exposure to the developing fetus.",
    category: "Oncology",
    difficulty: 2
  },
  {
    id: "rn-onc-q10",
    type: "question",
    question: "A client with colon cancer has a colostomy. During discharge teaching, which sign indicates the stoma is healthy?",
    options: ["Pale or white color", "Dark purple or black color", "Beefy red and moist", "Dry and cracked appearance"],
    correctIndex: 2,
    answer: "A healthy stoma should be beefy red and moist, similar to the inside of the mouth. A pale or white stoma indicates ischemia, while a dark purple/black stoma indicates necrosis — both require immediate provider notification. Some edema is normal in the first 6 weeks post-surgery.",
    image: imgStomaCare,
    category: "Oncology",
    difficulty: 1
  },
  {
    id: "rn-cc-q1",
    type: "question",
    question: "A client in the ICU develops a sudden drop in blood pressure, muffled heart sounds, and jugular vein distension. What condition does this triad indicate?",
    options: ["Tension pneumothorax", "Cardiac tamponade (Beck's triad)", "Pulmonary embolism", "Aortic dissection"],
    correctIndex: 1,
    answer: "Beck's triad (hypotension, muffled/distant heart sounds, JVD) is the hallmark of cardiac tamponade, where fluid accumulates in the pericardial sac compressing the heart. Emergency treatment is pericardiocentesis. Pulsus paradoxus (>10 mmHg drop in systolic BP during inspiration) is also a key finding.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q2",
    type: "question",
    question: "A mechanically ventilated client has a sudden increase in peak airway pressure with no change in plateau pressure. What is the most likely cause?",
    options: ["Pneumothorax", "ARDS worsening", "Mucus plug or kinked tubing", "Pulmonary fibrosis"],
    correctIndex: 2,
    answer: "Elevated peak pressure with normal plateau pressure indicates increased airway resistance (obstruction), such as a mucus plug, kinked ETT, bronchospasm, or biting the tube. If both peak and plateau pressures are elevated, it indicates decreased lung compliance (pneumothorax, ARDS, pulmonary edema).",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q3",
    type: "question",
    question: "A client with septic shock is receiving norepinephrine. The MAP is 58 mmHg. What is the nurse's priority?",
    options: ["Discontinue the norepinephrine", "Titrate norepinephrine to maintain MAP ≥ 65 mmHg", "Switch to oral vasopressors", "Administer a fluid bolus of D5W"],
    correctIndex: 1,
    answer: "The Surviving Sepsis Campaign recommends maintaining MAP ≥ 65 mmHg. Norepinephrine is the first-line vasopressor for septic shock. It should be titrated to achieve target MAP. Crystalloid fluid resuscitation (30 mL/kg) should be initiated first. D5W is not appropriate for volume resuscitation.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q4",
    type: "question",
    question: "A client on a ventilator develops auto-PEEP (intrinsic PEEP). What is the most appropriate initial intervention?",
    options: ["Increase the respiratory rate", "Decrease inspiratory time and increase expiratory time", "Add more external PEEP", "Suction the endotracheal tube"],
    correctIndex: 1,
    answer: "Auto-PEEP (air trapping) occurs when the client cannot fully exhale before the next breath. This is common in COPD and asthma. Interventions include decreasing respiratory rate, decreasing tidal volume, increasing expiratory time (decrease I:E ratio), and treating bronchospasm. Increasing the respiratory rate would worsen air trapping.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q5",
    type: "question",
    question: "A post-cardiac surgery client develops a cardiac output of 2.8 L/min, CVP of 18 mmHg, and cool, clammy skin. Which type of shock is this?",
    options: ["Hypovolemic shock", "Cardiogenic shock", "Distributive shock", "Obstructive shock"],
    correctIndex: 1,
    answer: "Cardiogenic shock presents with low cardiac output, elevated preload (high CVP/PCWP), and signs of poor perfusion (cool skin, oliguria). The heart is failing as a pump. Treatment includes inotropes (dobutamine), vasopressors, IABP, and possibly mechanical circulatory support. Fluids are typically restricted.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q6",
    type: "question",
    question: "A nurse is caring for a client with an arterial line. The waveform shows a dampened tracing. What should the nurse do first?",
    options: ["Recalibrate the transducer", "Check for air bubbles, kinks, or clots in the tubing", "Remove and replace the arterial line", "Increase the flush rate"],
    correctIndex: 1,
    answer: "A dampened arterial waveform (flattened, with loss of dicrotic notch) is commonly caused by air bubbles, blood clots, or kinks in the tubing system. First, check the system from catheter to transducer. Flush the line, remove air bubbles, and ensure all connections are tight. If unresolved, the catheter may need replacement.",
    category: "Critical Care",
    difficulty: 2
  },
  {
    id: "rn-cc-q7",
    type: "question",
    question: "A client with ARDS has a PaO2/FiO2 ratio of 85. What severity classification is this?",
    options: ["Mild ARDS", "Moderate ARDS", "Severe ARDS", "Not ARDS"],
    correctIndex: 2,
    answer: "ARDS severity is classified by PaO2/FiO2 ratio (Berlin criteria): Mild 200-300, Moderate 100-200, Severe < 100. A ratio of 85 is severe ARDS. Management includes low tidal volume ventilation (6 mL/kg), high PEEP, prone positioning, and neuromuscular blockade in severe cases.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q8",
    type: "question",
    question: "During a rapid response, a client becomes pulseless with ventricular fibrillation on the monitor. What is the first intervention?",
    options: ["Administer epinephrine", "Perform synchronized cardioversion", "Begin CPR and prepare for defibrillation", "Establish IV access"],
    correctIndex: 2,
    answer: "Ventricular fibrillation is a shockable rhythm. Per ACLS, begin high-quality CPR immediately and defibrillate as soon as possible. Epinephrine is given after the second shock. Synchronized cardioversion is for unstable tachyarrhythmias with a pulse. Early defibrillation is the most important intervention for VF survival.",
    category: "Critical Care",
    difficulty: 2,
    image: getAssetUrl("lethaldysrhythmias_1773517523349.png")
  },
  {
    id: "rn-cc-q9",
    type: "question",
    question: "A client on continuous renal replacement therapy (CRRT) suddenly has blood visible in the effluent bag. What does this indicate?",
    options: ["Normal finding during CRRT", "Filter membrane rupture", "Improved kidney function", "Excess anticoagulation"],
    correctIndex: 1,
    answer: "Blood in the effluent during CRRT indicates a filter membrane rupture, which is a serious complication. The nurse should immediately stop the treatment, clamp the blood lines, and notify the provider. The circuit must be discarded and replaced. Blood should never cross the filter membrane into the effluent.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q10",
    type: "question",
    question: "A client with a pulmonary artery catheter has a PCWP of 22 mmHg. What does this indicate?",
    options: ["Hypovolemia", "Left ventricular failure", "Right ventricular failure only", "Normal cardiac function"],
    correctIndex: 1,
    answer: "Normal PCWP (pulmonary capillary wedge pressure) is 6-12 mmHg. Elevated PCWP (>18 mmHg) indicates left ventricular failure with increased left atrial pressure backing up into the pulmonary vasculature. This leads to pulmonary edema. Treatment includes diuretics, vasodilators, and inotropes.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-emerg-q1",
    type: "question",
    question: "A client presents to the ED after a motor vehicle accident with paradoxical chest wall movement. What injury should the nurse suspect?",
    options: ["Simple rib fracture", "Flail chest", "Pneumothorax", "Hemothorax"],
    correctIndex: 1,
    answer: "Flail chest occurs when three or more adjacent ribs are fractured in two or more places, creating a free-floating segment that moves paradoxically (inward during inspiration, outward during expiration). This severely impairs ventilation. Treatment includes pain management, positive pressure ventilation, and possible surgical fixation.",
    category: "Emergency",
    difficulty: 3,
    image: illustrationRibFractures
  },
  {
    id: "rn-emerg-q2",
    type: "question",
    question: "A client with a snake bite presents with progressive swelling, ecchymosis, and coagulopathy. After stabilizing the client, what is the definitive treatment?",
    options: ["Tourniquets above the bite", "Ice application and elevation", "Antivenom (CroFab) administration", "Wound incision and suction"],
    correctIndex: 2,
    answer: "Antivenom (CroFab for pit vipers) is the definitive treatment for significant envenomation. Do NOT apply tourniquets, ice, or attempt wound incision. Immobilize the extremity at heart level, remove constrictive items, and monitor for anaphylaxis during antivenom administration. Serial coagulation studies are essential.",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-emerg-q3",
    type: "question",
    question: "During triage, a nurse assesses four clients. Which client should be seen first?",
    options: ["Client with a closed forearm fracture and intact pulses", "Client with chest pain radiating to the left arm and diaphoresis", "Client with a laceration requiring sutures", "Client with an ankle sprain and moderate swelling"],
    correctIndex: 1,
    answer: "Chest pain with radiation and diaphoresis suggests acute MI, which is a life-threatening emergency requiring immediate intervention. Using the ESI (Emergency Severity Index) or ABC prioritization, this client has the highest acuity. The fracture, laceration, and sprain are lower priority as they are not immediately life-threatening.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q4",
    type: "question",
    question: "A client is brought to the ED after near-drowning in cold water. Core temperature is 30°C (86°F). What is the priority intervention?",
    options: ["Passive external rewarming only", "Active core rewarming with warm IV fluids and warm humidified oxygen", "Immediate discharge after drying", "Administer antipyretics"],
    correctIndex: 1,
    answer: "Severe hypothermia (<30°C) requires active core rewarming: warm IV fluids (40-42°C), warm humidified oxygen, warm bladder/peritoneal lavage if needed. Passive rewarming alone is insufficient. Handle the client gently to avoid triggering ventricular fibrillation. Remember: 'No one is dead until warm and dead.'",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-emerg-q5",
    type: "question",
    question: "A client presents with an open fracture of the tibia with bone visible through the wound. What is the priority nursing action?",
    options: ["Reduce the fracture manually", "Cover the wound with a sterile saline-moistened dressing", "Apply direct pressure to push bone back in", "Immediately apply a cast"],
    correctIndex: 1,
    answer: "Open (compound) fractures require sterile wound coverage to prevent infection. Cover with sterile saline-moistened dressing. Never attempt to reduce the fracture or push bone back in. Assess neurovascular status distally, immobilize the extremity, and prepare for surgical debridement. Administer tetanus prophylaxis and antibiotics as ordered.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q6",
    type: "question",
    question: "A client is brought to the ED in status epilepticus. Seizures have been continuous for 8 minutes. What is the first-line medication?",
    options: ["Phenytoin IV push", "Lorazepam (Ativan) IV", "Phenobarbital IM", "Carbamazepine PO"],
    correctIndex: 1,
    answer: "Benzodiazepines (lorazepam IV) are first-line for status epilepticus. Status epilepticus is defined as continuous seizure activity lasting >5 minutes or recurrent seizures without regaining consciousness. Lorazepam is preferred over diazepam due to longer duration of action. If benzodiazepines fail, second-line agents include fosphenytoin or valproic acid.",
    category: "Emergency",
    difficulty: 2,
    image: imgPediatricSeizuresNew
  },
  {
    id: "rn-emerg-q7",
    type: "question",
    question: "A client with suspected cervical spine injury arrives in the ED. The client is alert and moving all extremities. What is the priority?",
    options: ["Remove the cervical collar to assess range of motion", "Maintain spinal immobilization until imaging clears the spine", "Encourage the client to sit up slowly", "Perform a neurological exam including neck flexion"],
    correctIndex: 1,
    answer: "Maintain cervical spine immobilization until cleared by imaging (CT or X-ray) and clinical assessment. Even if the client is moving all extremities, an unstable fracture could exist. Never remove the collar or assess range of motion until the spine is cleared. Log-roll the client for any repositioning.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q8",
    type: "question",
    question: "A client arrives at the ED after ingesting a large amount of acetaminophen 2 hours ago. Which antidote should the nurse anticipate?",
    options: ["Naloxone (Narcan)", "Flumazenil (Romazicon)", "N-acetylcysteine (Mucomyst)", "Protamine sulfate"],
    correctIndex: 2,
    answer: "N-acetylcysteine (NAC/Mucomyst) is the antidote for acetaminophen overdose. It works by replenishing glutathione stores in the liver, preventing hepatotoxicity. It is most effective when given within 8 hours of ingestion but can be beneficial up to 72 hours. Monitor hepatic function closely.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-fe-q1",
    type: "question",
    question: "A client with chronic kidney disease has a potassium level of 6.8 mEq/L and peaked T waves on ECG. What is the priority intervention?",
    options: ["Administer oral kayexalate", "Administer IV calcium gluconate", "Encourage potassium-rich foods", "Recheck the lab in 4 hours"],
    correctIndex: 1,
    answer: "Severe hyperkalemia (>6.5 mEq/L) with ECG changes is life-threatening. IV calcium gluconate is given first to stabilize the cardiac membrane (cardioprotective). It does not lower potassium but prevents fatal dysrhythmias. Then give insulin/dextrose, sodium bicarbonate, and kayexalate to actually lower potassium. Prepare for possible dialysis.",
    category: "Fluid & Electrolytes",
    difficulty: 3,
    image: imgCKD
  },
  {
    id: "rn-fe-q2",
    type: "question",
    question: "A client develops hypocalcemia after thyroidectomy. Which sign would the nurse assess for?",
    options: ["Kussmaul respirations", "Positive Trousseau's sign (carpal spasm with BP cuff inflation)", "Flushed, dry skin", "Bradycardia"],
    correctIndex: 1,
    answer: "Positive Trousseau's sign (carpopedal spasm when BP cuff is inflated above systolic for 3 minutes) indicates hypocalcemia, which can occur after thyroidectomy due to accidental removal or damage to the parathyroid glands. Also assess for Chvostek's sign (facial twitching when tapping facial nerve). Keep IV calcium gluconate at bedside.",
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-fe-q3",
    type: "question",
    question: "A client has a sodium level of 118 mEq/L and is confused and lethargic. What is the nurse's priority concern?",
    options: ["Hypernatremia", "Hyponatremia causing cerebral edema", "Hyperkalemia", "Metabolic alkalosis"],
    correctIndex: 1,
    answer: "Severe hyponatremia (<120 mEq/L) causes water to shift into brain cells, leading to cerebral edema with confusion, seizures, and potentially brain herniation. Correction must be gradual (no more than 10-12 mEq/L in 24 hours) to prevent osmotic demyelination syndrome (central pontine myelinolysis). Hypertonic saline (3%) may be used cautiously.",
    category: "Fluid & Electrolytes",
    difficulty: 3
  },
  {
    id: "rn-fe-q4",
    type: "question",
    question: "A client receiving IV magnesium sulfate for preeclampsia becomes lethargic with diminished deep tendon reflexes. What should the nurse do?",
    options: ["Increase the infusion rate", "Continue monitoring", "Stop the infusion and prepare calcium gluconate", "Administer a fluid bolus"],
    correctIndex: 2,
    answer: "Loss of deep tendon reflexes (DTRs) is an early sign of magnesium toxicity. Normal DTRs should be 2+ (present). The progression of magnesium toxicity: loss of DTRs → respiratory depression → cardiac arrest. Stop the infusion immediately and have calcium gluconate (the antidote for magnesium toxicity) at the bedside. Monitor respiratory rate (hold if <12/min).",
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-fe-q5",
    type: "question",
    question: "A client with hypokalemia is prescribed IV potassium chloride. Which administration guideline is most important?",
    options: ["Administer IV push for rapid correction", "Never exceed 10 mEq/hour via peripheral IV without cardiac monitoring", "Mix potassium in D5W only", "Potassium can be safely given IM"],
    correctIndex: 1,
    answer: "IV potassium must NEVER be given by IV push — it can cause fatal cardiac arrest. Maximum rate via peripheral IV is 10 mEq/hour (20 mEq/hour via central line with cardiac monitoring). Always use an infusion pump. The IV site should be assessed frequently as potassium is irritating to veins and can cause phlebitis.",
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-fe-q6",
    type: "question",
    question: "A client is receiving 0.9% normal saline at 200 mL/hr. Which assessment finding suggests fluid volume overload?",
    options: ["Dry mucous membranes", "Flat neck veins", "Crackles in lung bases and bounding pulse", "Decreased urine output and thirst"],
    correctIndex: 2,
    answer: "Signs of fluid volume overload (hypervolemia) include crackles/rales in lungs, bounding pulse, JVD, peripheral edema, weight gain, dyspnea, and elevated CVP. The nurse should slow or stop the infusion, elevate the head of bed, notify the provider, and anticipate diuretic administration.",
    category: "Fluid & Electrolytes",
    difficulty: 1
  },
  {
    id: "rn-fe-q7",
    type: "question",
    question: "A client with diabetic ketoacidosis (DKA) has a phosphate level of 1.0 mg/dL. Why is phosphate replacement important in DKA?",
    options: ["It prevents hypercalcemia", "Phosphate is needed for ATP production and oxygen delivery (2,3-DPG)", "It corrects the metabolic alkalosis", "It treats the hyperglycemia directly"],
    correctIndex: 1,
    answer: "Severe hypophosphatemia in DKA impairs oxygen delivery because phosphate is essential for 2,3-DPG (which helps hemoglobin release oxygen to tissues) and ATP production. Insulin therapy drives phosphate into cells, worsening the deficit. Monitor and replace as ordered, but avoid overly rapid correction which can cause hypocalcemia.",
    category: "Fluid & Electrolytes",
    difficulty: 3,
    image: imgDKA
  },
  {
    id: "rn-pain-q1",
    type: "question",
    question: "A post-operative client rates pain as 8/10 but is smiling and talking on the phone. What is the nurse's best action?",
    options: ["Document that the client is not in pain based on behavior", "Administer pain medication as the client reports", "Withhold medication until the client appears to be in pain", "Ask the client to rate pain again because behavior does not match"],
    correctIndex: 1,
    answer: "Pain is whatever the client says it is. The client's self-report is the most reliable indicator of pain, not behavioral observations. Clients may use coping mechanisms (distraction, laughter) despite significant pain. Cultural factors and chronic pain adaptation can also alter behavioral expression of pain.",
    category: "Pain Management",
    difficulty: 1
  },
  {
    id: "rn-pain-q2",
    type: "question",
    question: "A nurse is managing a client on patient-controlled analgesia (PCA) with morphine. Which finding requires immediate intervention?",
    options: ["Pain rating decreased from 7 to 4", "Respiratory rate of 8 breaths/min and sedation", "Mild nausea after a dose", "Client pressing the button every 10 minutes"],
    correctIndex: 1,
    answer: "Respiratory depression is the most dangerous adverse effect of opioid therapy. A respiratory rate <10/min with excessive sedation indicates opioid overdose. Stop the PCA, stimulate the client, and prepare to administer naloxone (Narcan). Keep the client's head of bed elevated and oxygen available.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q3",
    type: "question",
    question: "A client with chronic cancer pain is on long-acting morphine and reports breakthrough pain. What is the appropriate intervention?",
    options: ["Double the long-acting morphine dose", "Administer a short-acting opioid as prescribed for breakthrough pain", "Discontinue the long-acting morphine and switch entirely to PRN dosing", "Tell the client to wait for the next scheduled dose"],
    correctIndex: 1,
    answer: "Breakthrough pain is managed with short-acting (immediate-release) opioids in addition to the scheduled long-acting (sustained-release) medication. The breakthrough dose is typically 10-15% of the total daily opioid dose. Long-acting formulations should not be crushed or chewed as this releases the entire dose at once.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q4",
    type: "question",
    question: "A client receiving long-term opioid therapy develops tolerance. What does this mean?",
    options: ["The client is addicted to the medication", "Higher doses are needed to achieve the same analgesic effect", "The client is seeking drugs for non-medical reasons", "The medication is no longer effective and must be discontinued"],
    correctIndex: 1,
    answer: "Tolerance is a physiological adaptation where higher doses are needed over time to achieve the same effect. It is NOT the same as addiction (substance use disorder). Tolerance is expected with chronic opioid use and is managed by dose adjustment or opioid rotation. Physical dependence (withdrawal symptoms if stopped abruptly) is also a normal physiological response, distinct from addiction.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q5",
    type: "question",
    question: "Which non-pharmacological pain management technique is most appropriate for a client with acute pancreatitis?",
    options: ["Hot pack application to the abdomen", "Positioning in a side-lying knee-chest position", "Deep tissue massage of the abdomen", "Vigorous ambulation"],
    correctIndex: 1,
    answer: "The side-lying knee-chest (fetal) position reduces tension on the abdominal muscles and can decrease pancreatic pain. Heat should be avoided in acute pancreatitis as it may worsen inflammation. Abdominal massage is contraindicated. NPO status, IV fluids, and analgesics are standard medical management.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-del-q1",
    type: "question",
    question: "An RN has four clients. Which task can be safely delegated to an unlicensed assistive personnel (UAP)?",
    options: ["Teaching a newly diagnosed diabetic about insulin injection", "Measuring and recording vital signs on a stable post-op client", "Assessing a client's wound for signs of infection", "Administering oral medications to a stable client"],
    correctIndex: 1,
    answer: "UAPs can perform tasks that are routine, predictable, and do not require nursing judgment: vital signs on stable clients, bathing, feeding, ambulation, I&O recording, and fingerstick blood glucose. The RN cannot delegate assessment, teaching, evaluation, or any task requiring clinical judgment. Use the 5 Rights of Delegation: Right task, circumstance, person, direction, and supervision.",
    category: "Delegation/Prioritization",
    difficulty: 1
  },
  {
    id: "rn-del-q2",
    type: "question",
    question: "A charge nurse is making assignments. Which client is most appropriate for a new graduate RN?",
    options: ["Client on a ventilator with worsening ABGs", "Client 1 day post-total knee replacement with a continuous passive motion machine", "Client with a chest tube who just developed subcutaneous emphysema", "Client receiving a blood transfusion who has a history of transfusion reactions"],
    correctIndex: 1,
    answer: "A stable post-operative client with predictable care needs (CPM machine, pain management, ambulation) is most appropriate for a new graduate. The other clients have complications or high-risk situations requiring experienced clinical judgment. Assignments should match nurse competency with patient acuity.",
    category: "Delegation/Prioritization",
    difficulty: 2
  },
  {
    id: "rn-del-q3",
    type: "question",
    question: "An RN receives report on four clients. Which client should be assessed first?",
    options: ["Client with COPD and an SpO2 of 89%", "Client 2 hours post-cardiac catheterization with a hematoma at the insertion site that is increasing in size", "Client with diabetes and a blood glucose of 180 mg/dL", "Client requesting pain medication for a headache rated 5/10"],
    correctIndex: 1,
    answer: "An expanding hematoma post-cardiac catheterization indicates active bleeding from the femoral artery access site, which can lead to hemorrhage and hemodynamic instability. This requires immediate assessment and intervention (direct pressure, notify provider). The COPD client's SpO2 is within acceptable range (88-92%). The other clients have non-urgent needs.",
    category: "Delegation/Prioritization",
    difficulty: 2
  },
  {
    id: "rn-del-q4",
    type: "question",
    question: "During a mass casualty event using START triage, a victim is not breathing after repositioning the airway. What triage tag color is assigned?",
    options: ["Red (Immediate)", "Yellow (Delayed)", "Green (Minor)", "Black (Expectant/Deceased)"],
    correctIndex: 3,
    answer: "In START triage, if the victim is not breathing even after airway repositioning, they are tagged BLACK (expectant/deceased). In mass casualty events, resources are allocated to save the most lives. Red = immediate life-threatening but salvageable, Yellow = delayed but stable, Green = walking wounded (minor injuries).",
    category: "Delegation/Prioritization",
    difficulty: 2
  },
  {
    id: "rn-del-q5",
    type: "question",
    question: "An LPN/LVN reports that a stable client's blood pressure has dropped from 130/80 to 88/52 mmHg. What is the RN's best response?",
    options: ["Tell the LPN to recheck it in 30 minutes", "Thank the LPN and document the finding", "Immediately assess the client", "Delegate the assessment to a UAP"],
    correctIndex: 2,
    answer: "A significant drop in blood pressure requires immediate RN assessment. The RN must assess the client, evaluate for signs of shock or other acute changes, check medications, and notify the provider. Assessment and clinical decision-making cannot be delegated. The LPN appropriately reported the change to the RN.",
    category: "Delegation/Prioritization",
    difficulty: 1
  },
  {
    id: "rn-del-q6",
    type: "question",
    question: "Which task is within the scope of practice for an LPN/LVN?",
    options: ["Developing the initial nursing care plan", "Administering IV push medications", "Performing a focused assessment and reporting changes to the RN", "Receiving telephone orders from the provider in all states"],
    correctIndex: 2,
    answer: "LPN/LVNs can perform focused assessments (not comprehensive/initial assessments) and must report changes to the RN. They can administer oral and some parenteral medications but generally cannot give IV push medications (varies by state). Initial care plan development and receiving telephone orders are RN responsibilities in most jurisdictions.",
    category: "Delegation/Prioritization",
    difficulty: 2
  },
  {
    id: "rn-del-q7",
    type: "question",
    question: "Four clients ring their call lights simultaneously. Which client should the nurse see first?",
    options: ["Client who wants help to the bathroom", "Client reporting sudden onset of shortness of breath", "Client requesting a warm blanket", "Client asking when the next medication is due"],
    correctIndex: 1,
    answer: "Using ABCs (Airway, Breathing, Circulation), sudden onset shortness of breath takes priority as it indicates a potential respiratory emergency (PE, pneumothorax, anaphylaxis). The nurse should assess this client immediately while delegating comfort measures (blanket, bathroom assistance) to available UAP.",
    category: "Delegation/Prioritization",
    difficulty: 1
  },
  {
    id: "rn-del-q8",
    type: "question",
    question: "An RN is charge nurse and must send one nurse home due to low census. Which nurse is most appropriate to send?",
    options: ["The nurse with the most seniority who volunteers", "The float pool nurse who has no assigned clients", "The nurse caring for a client receiving a blood transfusion", "The nurse orienting a new graduate"],
    correctIndex: 1,
    answer: "The float pool nurse with no assigned clients is the most appropriate to send home as this causes the least disruption to patient care. Seniority alone is not the deciding factor — patient safety is paramount. Sending home the nurse with the blood transfusion or the preceptor would compromise patient care and new nurse education.",
    category: "Delegation/Prioritization",
    difficulty: 2
  },
  {
    id: "rn-ger-q1",
    type: "question",
    question: "An elderly client in a long-term care facility has become increasingly confused over the past 24 hours. What should the nurse assess first?",
    options: ["Cognitive decline due to dementia", "Urinary tract infection", "Depression", "Medication non-compliance"],
    correctIndex: 1,
    answer: "Acute confusion (delirium) in the elderly is often caused by an underlying medical condition. UTI is one of the most common causes of acute confusion in older adults, especially in women. Unlike dementia (gradual onset), delirium has an acute onset and is potentially reversible. Other causes include medications, dehydration, electrolyte imbalances, and infections.",
    category: "Geriatrics",
    difficulty: 2
  },
  {
    id: "rn-ger-q2",
    type: "question",
    question: "A nurse is assessing fall risk in an elderly client. Which finding represents the greatest risk factor for falls?",
    options: ["History of one fall in the past year", "Taking more than 4 medications including a benzodiazepine", "Age 70 years", "Mild hearing loss"],
    correctIndex: 1,
    answer: "Polypharmacy (≥4 medications) combined with psychoactive medications (benzodiazepines, opioids, antihypertensives) is the strongest modifiable risk factor for falls in the elderly. Benzodiazepines cause sedation, impaired balance, and orthostatic hypotension. Other risk factors include gait/balance disorders, visual impairment, cognitive impairment, and environmental hazards.",
    category: "Geriatrics",
    difficulty: 2
  },
  {
    id: "rn-ger-q3",
    type: "question",
    question: "An elderly client on multiple medications complains of dizziness when standing. Blood pressure sitting is 140/80, standing is 108/60. Which medication class is the most likely cause?",
    options: ["Statins", "Antihypertensives", "Proton pump inhibitors", "Thyroid supplements"],
    correctIndex: 1,
    answer: "Orthostatic hypotension (drop ≥20 mmHg systolic or ≥10 mmHg diastolic upon standing) is a common side effect of antihypertensive medications in the elderly due to impaired baroreceptor response. Teach the client to rise slowly, dangle legs before standing, and maintain adequate hydration. Medication adjustment may be needed.",
    category: "Geriatrics",
    difficulty: 1
  },
  {
    id: "rn-ger-q4",
    type: "question",
    question: "Which assessment tool is most appropriate for detecting depression in elderly clients?",
    options: ["Mini-Mental State Exam (MMSE)", "Geriatric Depression Scale (GDS)", "Glasgow Coma Scale", "Braden Scale"],
    correctIndex: 1,
    answer: "The Geriatric Depression Scale (GDS) is specifically designed to screen for depression in older adults. It uses yes/no questions that are easier for elderly clients to answer. The MMSE screens for cognitive impairment, the GCS assesses consciousness level, and the Braden Scale assesses pressure injury risk.",
    category: "Geriatrics",
    difficulty: 1
  },
  {
    id: "rn-ger-q5",
    type: "question",
    question: "An 82-year-old client is prescribed a new medication. The nurse notes the client has decreased renal function (GFR 35 mL/min). What is the nursing implication?",
    options: ["Medications are metabolized faster in elderly clients", "Dose adjustments may be needed due to decreased drug clearance", "Renal function does not affect medication dosing", "Only IV medications need adjustment"],
    correctIndex: 1,
    answer: "Age-related decline in renal function (decreased GFR) reduces drug clearance, increasing the risk of drug accumulation and toxicity. Many medications require dose adjustments based on creatinine clearance or GFR. This is especially important for renally-excreted drugs like digoxin, aminoglycosides, and metformin. The principle 'start low, go slow' applies to geriatric prescribing.",
    category: "Geriatrics",
    difficulty: 2
  },
  {
    id: "rn-ger-q6",
    type: "question",
    question: "An elderly client with dementia becomes agitated and combative during evening hours. What is this phenomenon called?",
    options: ["Delirium", "Sundowning", "Akathisia", "Psychosis"],
    correctIndex: 1,
    answer: "Sundowning is increased confusion, agitation, and behavioral disturbances that occur in the late afternoon and evening in clients with dementia. Contributing factors include fatigue, decreased lighting, disruption of circadian rhythm, and overstimulation. Non-pharmacological interventions include maintaining routine, adequate lighting, calming activities, and limiting caffeine and napping.",
    category: "Geriatrics",
    difficulty: 1
  },
  {
    id: "rn-ger-q7",
    type: "question",
    question: "A nurse is caring for an elderly client with dysphagia. Which dietary modification is most appropriate?",
    options: ["Thin liquids and regular-texture foods", "Thickened liquids and pureed foods", "NPO status indefinitely", "Encourage the client to eat quickly to finish meals"],
    correctIndex: 1,
    answer: "Clients with dysphagia are at high risk for aspiration. Thickened liquids (honey or nectar consistency) and pureed/mechanically altered foods are safer as they are easier to control during swallowing. Position the client upright (90 degrees) during and 30 minutes after meals. A speech-language pathologist should evaluate swallowing function.",
    category: "Geriatrics",
    difficulty: 1,
    image: imgDysphagia
  },
  {
    id: "rn-ger-q8",
    type: "question",
    question: "Which Beers Criteria medication should be avoided in elderly clients due to increased risk of falls and cognitive impairment?",
    options: ["Acetaminophen", "Diphenhydramine (Benadryl)", "Omeprazole", "Metformin"],
    correctIndex: 1,
    answer: "Diphenhydramine is a first-generation antihistamine with strong anticholinergic properties. The Beers Criteria identifies it as potentially inappropriate for elderly clients due to increased risk of confusion, sedation, falls, urinary retention, and constipation. Safer alternatives include second-generation antihistamines like loratadine or cetirizine.",
    category: "Geriatrics",
    difficulty: 2
  },
  {
    id: "rn-comm-q1",
    type: "question",
    question: "A community health nurse is conducting a home visit for a client recently discharged after a stroke. What is the priority assessment?",
    options: ["Medication reconciliation", "Home safety assessment for fall prevention", "Social support evaluation", "Dietary preferences"],
    correctIndex: 1,
    answer: "Home safety assessment is the priority for a post-stroke client due to potential mobility impairments, visual field deficits, and hemiparesis that increase fall risk. Assess for throw rugs, grab bars, adequate lighting, stair safety, and bathroom modifications. Also assess caregiver ability and establish a plan for rehabilitation therapy continuation.",
    category: "Community Health",
    difficulty: 2,
    image: imgStroke
  },
  {
    id: "rn-comm-q2",
    type: "question",
    question: "A public health nurse identifies an outbreak of measles in a school. What is the priority intervention?",
    options: ["Administer antibiotics to all students", "Isolate affected students and verify vaccination status of all contacts", "Close the school permanently", "Recommend bedrest for all students"],
    correctIndex: 1,
    answer: "For a measles outbreak, isolate infected individuals (airborne precautions, stay home for 4 days after rash onset), verify MMR vaccination status of all contacts, and offer post-exposure prophylaxis (MMR vaccine within 72 hours or immunoglobulin within 6 days) to susceptible individuals. Report to public health authorities as measles is a reportable disease.",
    category: "Community Health",
    difficulty: 2,
    image: imgMeasles
  },
  {
    id: "rn-comm-q3",
    type: "question",
    question: "A nurse working in a community clinic is developing a diabetes prevention program. Which level of prevention does this represent?",
    options: ["Primary prevention", "Secondary prevention", "Tertiary prevention", "Quaternary prevention"],
    correctIndex: 0,
    answer: "Primary prevention aims to prevent disease before it occurs through health promotion and risk reduction. A diabetes prevention program (diet education, exercise promotion, weight management) targets at-risk populations before disease develops. Secondary prevention involves early detection (screening). Tertiary prevention focuses on managing existing disease and preventing complications.",
    category: "Community Health",
    difficulty: 1
  },
  {
    id: "rn-comm-q4",
    type: "question",
    question: "A community health nurse is conducting tuberculin skin testing (TST) for a homeless shelter. A client's induration measures 8 mm. How should this be interpreted?",
    options: ["Negative for all populations", "Positive — the client is in a high-risk group (homeless)", "Positive only if the client has HIV", "Inconclusive — repeat in 2 weeks"],
    correctIndex: 1,
    answer: "TST interpretation depends on risk category: ≥5 mm is positive for HIV+, immunosuppressed, or recent TB contacts. ≥10 mm is positive for high-risk groups (homeless, IV drug users, healthcare workers, recent immigrants). ≥15 mm is positive for low-risk individuals. At 8 mm, this homeless client has a positive result requiring chest X-ray and further evaluation.",
    category: "Community Health",
    difficulty: 2
  },
  {
    id: "rn-comm-q5",
    type: "question",
    question: "A home health nurse discovers signs of elder abuse during a visit. What is the nurse's legal obligation?",
    options: ["Confront the caregiver immediately", "Report suspected abuse to Adult Protective Services", "Document but take no action unless the client requests help", "Wait for another visit to confirm findings"],
    correctIndex: 1,
    answer: "Nurses are mandated reporters. Suspected elder abuse (physical, emotional, financial, neglect, or sexual) must be reported to Adult Protective Services (APS) or the appropriate state agency. The nurse does not need to confirm abuse — reasonable suspicion triggers the reporting obligation. Document objective findings thoroughly. Failure to report can result in legal consequences.",
    category: "Community Health",
    difficulty: 1
  },
  {
    id: "rn-safe-q11",
    type: "question",
    question: "A nurse makes a medication error but the client is not harmed. What is the appropriate action?",
    options: ["Do not report since no harm occurred", "Report the error through the facility's incident reporting system", "Only tell the charge nurse verbally", "Document the error in the client's progress notes only"],
    correctIndex: 1,
    answer: "ALL medication errors must be reported through the facility's incident reporting system regardless of whether harm occurred. This supports a culture of safety and allows for system improvements. The nurse should also notify the provider, assess the client, and document the client's clinical status. Near-misses and no-harm events provide valuable data for preventing future errors.",
    category: "Safety & Ethics",
    difficulty: 1
  },
  {
    id: "rn-safe-q12",
    type: "question",
    question: "A client with a terminal illness tells the nurse they do not want to be resuscitated. The family insists on full code status. What should the nurse do?",
    options: ["Honor the family's wishes since they are the next of kin", "Advocate for the client's autonomy and facilitate a discussion with the healthcare team", "Change the code status without telling the family", "Ignore both and follow hospital policy"],
    correctIndex: 1,
    answer: "The client's autonomy takes precedence if they are competent to make decisions. The nurse should advocate for the client's wishes, facilitate communication between the client, family, and healthcare team, and ensure a proper DNR order is obtained. An ethics consult may be helpful. Document the client's expressed wishes carefully.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-safe-q13",
    type: "question",
    question: "A nurse discovers that a provider's order calls for a medication dose that is ten times the normal dose. What is the appropriate action?",
    options: ["Administer the medication as ordered since the provider is responsible", "Question the order with the prescribing provider before administering", "Administer half the dose as a compromise", "Ask another nurse to give the medication"],
    correctIndex: 1,
    answer: "The nurse has a legal and ethical obligation to question any order that appears unsafe or unclear. Contact the prescribing provider to clarify the dose. If the provider insists and the nurse still believes it is unsafe, follow the chain of command (charge nurse, supervisor, nursing administration). Administering a known unsafe dose can result in liability for the nurse.",
    category: "Safety & Ethics",
    difficulty: 1
  },
  {
    id: "rn-safe-q14",
    type: "question",
    question: "Which situation requires the nurse to break client confidentiality?",
    options: ["The client's spouse asks about test results", "The client expresses a plan to harm a specific person", "A coworker asks about the client's diagnosis", "The client's employer calls asking about the diagnosis"],
    correctIndex: 1,
    answer: "The duty to warn (Tarasoff duty) requires healthcare providers to break confidentiality when a client poses a credible threat to an identifiable person. This is an exception to HIPAA. Other exceptions include mandatory reporting (child/elder abuse, communicable diseases) and court orders. Spouse, employer, and coworker inquiries require client consent for disclosure.",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-safe-q15",
    type: "question",
    question: "A nurse is preparing to administer blood products. Which action is essential before starting the transfusion?",
    options: ["Warm the blood in a microwave", "Have two nurses independently verify the client's identity and blood product at the bedside", "Administer the blood through the same line as an IV medication", "Run the blood with D5W solution"],
    correctIndex: 1,
    answer: "Two licensed nurses must independently verify at the bedside: client identity (name, DOB, medical record number), blood type and crossmatch compatibility, expiration date, and unit number. Blood must be administered with 0.9% NS only (not D5W, which causes hemolysis, or Lactated Ringer's, which causes clotting). Use a blood administration set with a filter.",
    category: "Safety & Ethics",
    difficulty: 1
  },
  {
    id: "rn-onc-q11",
    type: "question",
    question: "A client with leukemia develops a temperature of 38.5°C (101.3°F) and an ANC of 300/mm³. What is the most critical nursing action?",
    options: ["Administer acetaminophen and recheck in 1 hour", "Obtain blood cultures and administer broad-spectrum antibiotics immediately as ordered", "Apply cooling blankets and monitor", "Delay antibiotics until culture results are available"],
    correctIndex: 1,
    answer: "Febrile neutropenia is an oncologic emergency. Blood cultures should be obtained and broad-spectrum IV antibiotics administered within 1 hour of fever onset. Do NOT delay antibiotics for culture results — sepsis can progress rapidly in neutropenic clients because they lack adequate immune response. This is a time-critical intervention.",
    category: "Oncology",
    difficulty: 3,
    image: imgLeukemia
  },
  {
    id: "rn-onc-q12",
    type: "question",
    question: "A client with cancer reports tingling and numbness in the hands and feet after receiving vincristine. What does this indicate?",
    options: ["Expected response that requires no intervention", "Peripheral neuropathy — a dose-limiting side effect", "Allergic reaction requiring epinephrine", "Fluid retention"],
    correctIndex: 1,
    answer: "Vincristine causes dose-limiting peripheral neuropathy (tingling, numbness, pain in extremities, loss of DTRs, foot drop). The nurse should assess neurological status, report findings to the oncologist, and anticipate dose reduction or discontinuation. Other neurotoxic agents include cisplatin, paclitaxel, and oxaliplatin. Neuropathy may be partially irreversible.",
    category: "Oncology",
    difficulty: 2
  },
  {
    id: "rn-cc-q11",
    type: "question",
    question: "A client with a traumatic brain injury has an ICP of 28 mmHg. What is the priority intervention?",
    options: ["Lower the head of bed flat", "Administer IV mannitol as ordered", "Cluster nursing care activities", "Apply warm packs to the head"],
    correctIndex: 1,
    answer: "Normal ICP is 0-15 mmHg; 28 mmHg is dangerously elevated. Mannitol is an osmotic diuretic that draws fluid from brain tissue to reduce ICP. Other interventions: elevate HOB 30 degrees, maintain head midline, avoid clustering care, maintain normothermia, and consider hypertonic saline. Hyperventilation is used only briefly for imminent herniation.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q12",
    type: "question",
    question: "A client in the ICU develops DIC (disseminated intravascular coagulation). Which lab finding pattern is characteristic?",
    options: ["Elevated platelets, elevated fibrinogen, decreased D-dimer", "Decreased platelets, decreased fibrinogen, elevated D-dimer and PT/PTT", "Normal platelets, elevated WBC, decreased ESR", "Elevated platelets, decreased PT, normal fibrinogen"],
    correctIndex: 1,
    answer: "DIC involves simultaneous clotting and bleeding. Clotting factors and platelets are consumed (decreased platelets, decreased fibrinogen, prolonged PT/PTT), while fibrin degradation products (D-dimer, FDP) are elevated from clot breakdown. Treatment addresses the underlying cause (sepsis, obstetric complications) and replaces blood products as needed.",
    category: "Critical Care",
    difficulty: 3,
    image: imgDIC
  },
  {
    id: "rn-emerg-q9",
    type: "question",
    question: "A client presents with a core body temperature of 41.5°C (106.7°F), altered mental status, and hot dry skin after outdoor exertion. What condition is this?",
    options: ["Heat exhaustion", "Heat stroke", "Malignant hyperthermia", "Neuroleptic malignant syndrome"],
    correctIndex: 1,
    answer: "Heat stroke is characterized by core temperature >40°C (104°F), altered mental status, and hot dry skin (anhidrosis — sweating mechanism fails). This is a medical emergency. Rapid cooling is critical: remove clothing, apply ice packs to groin/axillae/neck, cool IV fluids, evaporative cooling. Monitor for rhabdomyolysis, DIC, and organ failure.",
    category: "Emergency",
    difficulty: 2,
    image: imgHeatStroke
  },
  {
    id: "rn-emerg-q10",
    type: "question",
    question: "A client with known peanut allergy accidentally ate peanuts and presents with urticaria, throat tightness, and wheezing. What is the first intervention?",
    options: ["Administer diphenhydramine PO", "Administer epinephrine IM in the lateral thigh", "Start an IV and give corticosteroids", "Apply a cold compress to the throat"],
    correctIndex: 1,
    answer: "Anaphylaxis requires immediate IM epinephrine (1:1000, 0.3-0.5 mg) in the lateral thigh. Epinephrine is the FIRST-LINE treatment — it reverses bronchospasm, increases blood pressure, and reduces edema. Delay increases mortality. Secondary treatments include antihistamines, corticosteroids, IV fluids, and supplemental oxygen. Observe for biphasic reaction (4-6 hours).",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q11",
    type: "question",
    question: "During a disaster triage, a victim is breathing at 32 breaths/min with a capillary refill of 4 seconds and cannot follow commands. What triage color is assigned?",
    options: ["Green (Minor)", "Yellow (Delayed)", "Red (Immediate)", "Black (Expectant)"],
    correctIndex: 2,
    answer: "Using START triage: breathing is present but respiratory rate >30/min = abnormal. Circulation: capillary refill >2 seconds = abnormal. Mental status: cannot follow commands = abnormal. Any abnormal finding after confirming breathing = RED (immediate). This victim needs immediate life-saving intervention.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-fe-q8",
    type: "question",
    question: "A client with SIADH has a serum sodium of 122 mEq/L. Which intervention is most appropriate?",
    options: ["Encourage increased fluid intake", "Implement fluid restriction (typically 500-1000 mL/day)", "Administer hypertonic saline rapidly", "Give salt tablets without monitoring"],
    correctIndex: 1,
    answer: "SIADH causes excess ADH secretion, leading to water retention and dilutional hyponatremia. Fluid restriction is the primary treatment to allow sodium levels to normalize. In severe symptomatic hyponatremia (<120 mEq/L with seizures), hypertonic 3% NS may be used cautiously. Monitor I&O, daily weights, and sodium levels closely.",
    image: imgSIADH,
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-fe-q9",
    type: "question",
    question: "A client receiving large-volume blood transfusions develops tingling around the mouth, muscle tremors, and a prolonged QT interval. Which electrolyte imbalance is most likely?",
    options: ["Hyperkalemia", "Hypocalcemia from citrate toxicity", "Hypernatremia", "Hypomagnesemia"],
    correctIndex: 1,
    answer: "Citrate is used as an anticoagulant in stored blood products. With massive transfusions, citrate accumulates and binds calcium, causing hypocalcemia. Signs include perioral tingling, muscle spasms, tetany, Chvostek's sign, Trousseau's sign, and prolonged QT. Treatment includes slow IV calcium gluconate infusion. Monitor calcium levels during massive transfusion protocols.",
    category: "Fluid & Electrolytes",
    difficulty: 3
  },
  {
    id: "rn-fe-q10",
    type: "question",
    question: "A client with diabetes insipidus has a urine specific gravity of 1.002 and serum sodium of 152 mEq/L. What is the priority nursing intervention?",
    options: ["Restrict fluids", "Administer desmopressin (DDAVP) as ordered and ensure adequate fluid replacement", "Encourage a high-sodium diet", "Withhold all medications"],
    correctIndex: 1,
    answer: "Diabetes insipidus is characterized by insufficient ADH, causing massive diuresis of dilute urine (specific gravity <1.005) and dehydration with hypernatremia. Treatment includes desmopressin (synthetic ADH) for central DI, adequate fluid replacement, and monitoring I&O (may produce 5-20 L of urine per day). This is the opposite of SIADH.",
    category: "Fluid & Electrolytes",
    difficulty: 2,
    image: imgDiabetesInsipidus
  },
  {
    id: "rn-pain-q6",
    type: "question",
    question: "A client with sickle cell crisis rates pain at 10/10. The nurse notes the client's vital signs are normal. What is the appropriate action?",
    options: ["Question the pain rating because vital signs are normal", "Administer pain medication as prescribed — vital signs may not correlate with pain", "Wait 30 minutes and reassess", "Offer non-pharmacological measures only"],
    correctIndex: 1,
    answer: "Clients with chronic pain conditions like sickle cell disease may have normal vital signs despite severe pain due to physiological adaptation. Pain assessment is subjective and the client's self-report is the gold standard. Sickle cell pain crises require aggressive pain management, often with IV opioids. Never dismiss pain based on vital signs or appearance.",
    image: imgSickleCellCrisis,
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q7",
    type: "question",
    question: "Which medication is the preferred first-line analgesic for chronic osteoarthritis pain?",
    options: ["Morphine", "Acetaminophen", "Oxycodone", "Meperidine"],
    correctIndex: 1,
    answer: "Acetaminophen is recommended as first-line for mild to moderate chronic osteoarthritis pain due to its favorable safety profile compared to opioids and NSAIDs. Maximum daily dose is 3-4 g/day (lower in elderly or those with hepatic impairment). If acetaminophen is insufficient, topical NSAIDs or oral NSAIDs may be added. Opioids are reserved for severe pain unresponsive to other treatments.",
    category: "Pain Management",
    difficulty: 1
  },
  {
    id: "rn-pain-q8",
    type: "question",
    question: "A post-surgical client is on an epidural infusion for pain. Which assessment finding requires immediate action?",
    options: ["Pain rating of 3/10", "Numbness and inability to move the legs", "Mild itching", "Drowsiness"],
    correctIndex: 1,
    answer: "Motor block (inability to move legs) with an epidural suggests the catheter has migrated or the concentration is too high, potentially compressing the spinal cord. Notify the anesthesiologist immediately. Also monitor for respiratory depression, hypotension, and urinary retention. Mild itching and drowsiness are common side effects that can be managed.",
    category: "Pain Management",
    difficulty: 3
  },
  {
    id: "rn-del-q9",
    type: "question",
    question: "A nurse must prioritize care for four post-operative clients. Which client needs assessment first?",
    options: ["Client 4 hours post-appendectomy with pain rated 6/10", "Client 2 hours post-thyroidectomy reporting difficulty swallowing and a tight feeling in the neck", "Client 1 day post-hip replacement asking for assistance to the bathroom", "Client 3 hours post-cholecystectomy with nausea"],
    correctIndex: 1,
    answer: "Difficulty swallowing and neck tightness after thyroidectomy could indicate hemorrhage (hematoma compressing the airway) or laryngeal edema — both are life-threatening airway emergencies. Assess immediately for stridor, swelling, and respiratory distress. Keep an emergency tracheostomy tray at the bedside. The other clients have expected post-op findings that can wait.",
    category: "Delegation/Prioritization",
    difficulty: 2
  },
  {
    id: "rn-del-q10",
    type: "question",
    question: "An RN delegates fingerstick blood glucose monitoring to a UAP. The UAP reports a result of 42 mg/dL. What is the nurse's priority action?",
    options: ["Tell the UAP to recheck in 30 minutes", "Immediately assess the client and treat hypoglycemia per protocol", "Document the result and continue with other tasks", "Ask the UAP to give the client orange juice"],
    correctIndex: 1,
    answer: "A blood glucose of 42 mg/dL is critically low (hypoglycemia <70 mg/dL). The RN must immediately assess the client for symptoms (confusion, diaphoresis, tremors, tachycardia) and initiate treatment per protocol: if conscious, give 15g fast-acting carbohydrate (4 oz juice, glucose tablets). If unconscious, administer glucagon IM or dextrose 50% IV. Recheck in 15 minutes. The RN cannot delegate assessment or treatment decisions.",
    category: "Delegation/Prioritization",
    difficulty: 1
  },
  {
    id: "rn-ger-q9",
    type: "question",
    question: "An elderly client recently started on warfarin asks about dietary considerations. What teaching is most important?",
    options: ["Eliminate all vitamin K-containing foods", "Maintain consistent intake of vitamin K-rich foods", "Increase vitamin K intake to prevent bleeding", "No dietary changes are needed with warfarin"],
    correctIndex: 1,
    answer: "Clients on warfarin should maintain CONSISTENT vitamin K intake — not eliminate it. Sudden increases in vitamin K (leafy greens, broccoli, Brussels sprouts) decrease warfarin's effectiveness, while sudden decreases increase bleeding risk. Consistency allows stable INR management. Also avoid cranberry juice and alcohol in excess, and report any new medications or supplements.",
    category: "Geriatrics",
    difficulty: 1
  },
  {
    id: "rn-ger-q10",
    type: "question",
    question: "An elderly client with moderate dementia wanders away from the unit. What is the priority nursing intervention to prevent future incidents?",
    options: ["Apply physical restraints", "Place the client in a room closest to the nursing station and implement a wandering management plan", "Sedate the client with PRN medications", "Lock the client in their room"],
    correctIndex: 1,
    answer: "Least restrictive interventions should be used first: room near the nursing station, bed/door alarms, identification bracelet, structured activities, and a safe wandering path. Physical restraints and chemical sedation increase agitation, injury risk, and are used only as a last resort. Restraints require a provider order and frequent reassessment.",
    category: "Geriatrics",
    difficulty: 2
  },
  {
    id: "rn-comm-q6",
    type: "question",
    question: "A public health nurse is planning a health education program for a culturally diverse community. What is the most important consideration?",
    options: ["Use complex medical terminology for accuracy", "Provide materials in the predominant language and at an appropriate literacy level", "Assume all community members have internet access", "Develop one standard program for all cultural groups"],
    correctIndex: 1,
    answer: "Health literacy and language barriers are the most significant obstacles to effective health education. Materials should be at a 5th-6th grade reading level, available in the community's predominant languages, and culturally sensitive. Use teach-back methods to verify understanding. Consider cultural health beliefs, preferred learning styles, and trusted community leaders for program delivery.",
    category: "Community Health",
    difficulty: 2
  },
  {
    id: "rn-comm-q7",
    type: "question",
    question: "A school nurse discovers that a child has head lice. What is the current evidence-based recommendation?",
    options: ["Send the child home immediately and exclude until all nits are removed", "The child can remain in school for the rest of the day with treatment initiated at home", "Shave the child's head", "Report to the health department as a communicable disease"],
    correctIndex: 1,
    answer: "Current AAP and NASN guidelines do not support 'no-nit' policies. Children with head lice can finish the school day and begin treatment at home. Head lice are not a health hazard or vector for disease. OTC pediculicides (permethrin 1%) are first-line. Machine wash bedding/clothes in hot water. Check household contacts. Lice cannot survive >48 hours off the host.",
    category: "Community Health",
    difficulty: 1,
    image: imgHeadLice
  },
  {
    id: "rn-safe-q16",
    type: "question",
    question: "A nurse witnesses a coworker diverting controlled substances. What is the legal obligation?",
    options: ["Confront the coworker privately and ask them to stop", "Report immediately to the nurse manager and follow facility policy", "Ignore it to avoid conflict", "Only report if a client is harmed"],
    correctIndex: 1,
    answer: "Drug diversion is a serious offense that jeopardizes patient safety and is illegal. The nurse has a legal and ethical obligation to report immediately to the nurse manager, supervisor, or through the facility's reporting mechanism. Many states also require reporting to the Board of Nursing. Failure to report makes the witnessing nurse complicit and potentially liable.",
    category: "Safety & Ethics",
    difficulty: 1
  },
  {
    id: "rn-safe-q17",
    type: "question",
    question: "A client refuses a blood transfusion based on religious beliefs despite life-threatening anemia. What should the nurse do?",
    options: ["Administer the transfusion because it is medically necessary", "Respect the client's decision, document the refusal, and explore alternative treatments", "Convince the client that their beliefs are wrong", "Call the client's family to override the decision"],
    correctIndex: 1,
    answer: "Competent adults have the right to refuse any treatment, including life-saving treatment, based on religious or personal beliefs (autonomy). The nurse must respect this decision, ensure the client understands the consequences through informed consent, document thoroughly, and work with the healthcare team to identify alternatives (erythropoietin, iron supplementation, volume expanders).",
    category: "Safety & Ethics",
    difficulty: 2
  },
  {
    id: "rn-onc-q13",
    type: "question",
    question: "A client with lung cancer develops sudden back pain, lower extremity weakness, and urinary incontinence. What oncologic emergency should the nurse suspect?",
    options: ["Pathological fracture", "Spinal cord compression", "Tumor lysis syndrome", "Hypercalcemia"],
    correctIndex: 1,
    answer: "Spinal cord compression is an oncologic emergency caused by tumor growth into the epidural space. Signs include progressive back pain (worst lying down), motor weakness, sensory loss, and autonomic dysfunction (bowel/bladder changes). MRI is diagnostic. Emergency treatment includes high-dose corticosteroids, radiation therapy, and/or surgical decompression. Delay can cause permanent paralysis.",
    category: "Oncology",
    difficulty: 3,
    image: imgLungCancer
  },
  {
    id: "rn-cc-q13",
    type: "question",
    question: "A client in the ICU has a central venous catheter. The nurse notes the CVP waveform shows large 'a' waves. What condition does this suggest?",
    options: ["Hypovolemia", "Tricuspid stenosis or pulmonary hypertension", "Left ventricular failure", "Normal finding"],
    correctIndex: 1,
    answer: "Large 'a' waves on the CVP waveform represent increased resistance to right atrial emptying, seen in tricuspid stenosis, pulmonary hypertension, or pulmonary stenosis. Cannon 'a' waves (very large) occur when the atrium contracts against a closed tricuspid valve, as in complete heart block or junctional rhythm.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-emerg-q12",
    type: "question",
    question: "A client presents to the ED with acute ischemic stroke. CT scan is negative for hemorrhage. The onset of symptoms was 2 hours ago. What treatment should the nurse anticipate?",
    options: ["Anticoagulation with heparin", "IV alteplase (tPA) administration", "Emergency craniotomy", "Observation and supportive care only"],
    correctIndex: 1,
    answer: "IV alteplase (tPA) is the standard treatment for acute ischemic stroke when administered within 4.5 hours of symptom onset (door-to-needle time goal <60 min). CT must rule out hemorrhagic stroke first. Contraindications include recent surgery, active bleeding, and uncontrolled hypertension. Monitor closely for bleeding complications. BP must be <185/110 before and <180/105 after administration.",
    category: "Emergency",
    difficulty: 3,
    image: imgStroke
  },
  {
    id: "rn-emerg-q13",
    type: "question",
    question: "A client with a history of COPD presents to the ED in respiratory distress with accessory muscle use and inability to speak in full sentences. SpO2 is 82%. What is the priority intervention?",
    options: ["Apply a nasal cannula at 2 L/min", "Apply a non-rebreather mask and prepare for intubation", "Administer a metered-dose inhaler", "Obtain an ABG before any treatment"],
    correctIndex: 1,
    answer: "Severe respiratory distress with SpO2 of 82% and inability to speak requires immediate high-flow oxygen despite COPD. When a client is in extremis, oxygenation takes priority over the risk of suppressing hypoxic drive. Prepare for possible intubation and mechanical ventilation. Administer bronchodilators and corticosteroids simultaneously. ABG can be obtained but should not delay treatment.",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-fe-q11",
    type: "question",
    question: "A client receiving TPN (total parenteral nutrition) develops hyperglycemia. What is the most appropriate nursing action?",
    options: ["Discontinue TPN immediately", "Administer regular insulin per sliding scale as ordered", "Switch to D5W", "Increase the TPN infusion rate"],
    correctIndex: 1,
    answer: "Hyperglycemia is a common complication of TPN due to the high dextrose concentration. Manage with regular insulin sliding scale or add insulin directly to the TPN bag. Monitor blood glucose every 4-6 hours. TPN should never be abruptly discontinued (risk of rebound hypoglycemia) — taper gradually and hang D10W if the line must be interrupted.",
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-fe-q12",
    type: "question",
    question: "A client develops metabolic acidosis (pH 7.28, HCO3 14, PaCO2 28). The PaCO2 is lower than normal. What does this represent?",
    options: ["Uncompensated metabolic acidosis", "Respiratory compensation for metabolic acidosis", "Mixed respiratory and metabolic acidosis", "Fully corrected acid-base balance"],
    correctIndex: 1,
    answer: "The low PaCO2 (28 mmHg, normal 35-45) represents respiratory compensation — the lungs are blowing off CO2 (hyperventilating) to raise the pH toward normal. Since the pH is still acidotic (7.28 < 7.35), it is partially compensated metabolic acidosis. Full compensation would bring the pH to 7.35-7.45. Common causes include DKA, renal failure, and lactic acidosis.",
    category: "Fluid & Electrolytes",
    difficulty: 3
  },
  {
    id: "rn-del-q11",
    type: "question",
    question: "A nursing student is assigned to care for a client under the supervision of an RN. Who is ultimately responsible for the care provided?",
    options: ["The nursing student", "The clinical instructor only", "The RN who is supervising the student", "The charge nurse"],
    correctIndex: 2,
    answer: "The supervising RN maintains ultimate responsibility for care provided by nursing students. While the clinical instructor provides guidance and education, the RN assigned to the client retains accountability for patient outcomes. The RN must verify assessments, validate interventions, and ensure safe care delivery. The student is responsible for practicing within their level of education.",
    category: "Delegation/Prioritization",
    difficulty: 1
  },
  {
    id: "rn-ger-q11",
    type: "question",
    question: "An elderly client with osteoporosis is prescribed alendronate (Fosamax). Which instruction is most important?",
    options: ["Take it at bedtime with a snack", "Take it first thing in the morning with a full glass of water and remain upright for 30 minutes", "Take it with milk to increase calcium absorption", "Crush the tablet if difficulty swallowing"],
    correctIndex: 1,
    answer: "Bisphosphonates (alendronate) must be taken on an empty stomach first thing in the morning with 8 oz of plain water. Remain upright (sitting or standing) for at least 30 minutes to prevent esophageal irritation, erosion, or ulceration. Do not eat, drink, or take other medications for 30 minutes. Do not crush or chew. Taking with food or milk dramatically reduces absorption.",
    category: "Geriatrics",
    difficulty: 1,
    image: imgOsteoporosis
  },
  {
    id: "rn-ger-q12",
    type: "question",
    question: "An elderly client is admitted with a hip fracture. What is the priority assessment within the first 24 hours?",
    options: ["Nutritional status", "Neurovascular status of the affected extremity", "Bowel sounds", "Emotional response"],
    correctIndex: 1,
    answer: "Neurovascular assessment (5 Ps: Pain, Pulse, Pallor, Paresthesia, Paralysis) of the affected extremity is the priority to detect compartment syndrome or vascular compromise. Assess and compare to the unaffected limb. Also monitor for DVT (immobility risk), fat embolism syndrome (long bone fracture), and delirium in elderly post-fracture patients.",
    category: "Geriatrics",
    difficulty: 2,
    image: imgCompartmentSyndrome
  },
  {
    id: "rn-comm-q8",
    type: "question",
    question: "A nurse in a public health clinic is counseling a client about childhood immunizations. The client expresses concerns about vaccine safety. What is the best response?",
    options: ["Dismiss the concerns and insist on vaccination", "Provide evidence-based information about vaccine safety and address specific concerns with empathy", "Tell the client their concerns are not valid", "Refuse to see the client until they agree to vaccinate"],
    correctIndex: 1,
    answer: "Use motivational interviewing techniques: listen with empathy, acknowledge concerns without judgment, provide evidence-based information from reputable sources (CDC, WHO), address specific fears, and support informed decision-making. Building trust is essential. Dismissing concerns or being confrontational increases vaccine hesitancy. Document the discussion and offer written resources.",
    category: "Community Health",
    difficulty: 2
  },
  {
    id: "rn-safe-q18",
    type: "question",
    question: "A client develops a stage 2 pressure injury on the sacrum. What finding best describes a stage 2 pressure injury?",
    options: ["Intact skin with non-blanchable redness", "Partial-thickness skin loss with exposed dermis, may present as a blister", "Full-thickness skin loss with visible fat", "Full-thickness tissue loss with exposed bone, tendon, or muscle"],
    correctIndex: 1,
    answer: "Stage 2 pressure injury involves partial-thickness loss of skin with exposed dermis. The wound bed is pink/red and moist, and may present as an intact or ruptured serum-filled blister. Stage 1 is intact skin with non-blanchable erythema. Stage 3 involves full-thickness skin loss with visible fat. Stage 4 involves exposed bone/muscle/tendon.",
    category: "Safety & Ethics",
    difficulty: 1,
    image: illustrationPressureInjuryStagesV2
  },
  {
    id: "rn-cc-q14",
    type: "question",
    question: "A client on a ventilator is being assessed for readiness to wean. Which finding indicates the client is NOT ready for extubation?",
    options: ["Alert and following commands", "Negative inspiratory force of -25 cmH2O", "FiO2 requirement of 80% to maintain SpO2 >92%", "Respiratory rate of 16 on minimal ventilator support"],
    correctIndex: 2,
    answer: "Weaning criteria include: FiO2 ≤40%, PEEP ≤5-8 cmH2O, adequate oxygenation, hemodynamic stability, alert mental status, and ability to protect airway. Requiring 80% FiO2 indicates severe oxygenation impairment and the client is NOT ready for weaning. The rapid shallow breathing index (RSBI = RR/Vt) should be <105 for successful extubation.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-cc-q15",
    type: "question",
    question: "A client in neurogenic shock after a spinal cord injury presents with hypotension and bradycardia. Why does this hemodynamic pattern differ from other types of shock?",
    options: ["Massive blood loss causes both findings", "Loss of sympathetic tone causes vasodilation and unopposed vagal response", "Cardiac pump failure is the primary mechanism", "Anaphylactic mediators cause cardiac depression"],
    correctIndex: 1,
    answer: "Neurogenic shock results from loss of sympathetic nervous system tone below the level of spinal cord injury. This causes massive vasodilation (hypotension), loss of compensatory tachycardia (bradycardia due to unopposed parasympathetic/vagal tone), and poikilothermia (inability to regulate temperature). Treatment includes IV fluids, vasopressors (norepinephrine), and atropine for symptomatic bradycardia.",
    category: "Critical Care",
    difficulty: 3
  },
  {
    id: "rn-emerg-q14",
    type: "question",
    question: "A client is brought to the ED after electrical burn injury. The entry wound is small on the hand, but the client has dark brown urine. What complication should the nurse suspect?",
    options: ["Dehydration", "Rhabdomyolysis with myoglobinuria", "Urinary tract infection", "Liver failure"],
    correctIndex: 1,
    answer: "Electrical burns cause deep tissue damage along the current path that is far more extensive than surface wounds suggest. Muscle destruction releases myoglobin (rhabdomyolysis), which is filtered through the kidneys causing dark brown (tea/cola-colored) urine. Myoglobin can cause acute renal failure. Treatment includes aggressive IV fluid resuscitation to maintain urine output >100 mL/hr, alkalinization of urine, and monitoring CK levels.",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-emerg-q15",
    type: "question",
    question: "A client involved in a house fire has singed nasal hairs, hoarse voice, and carbonaceous sputum. What is the priority concern?",
    options: ["Smoke inhalation with impending airway compromise", "Carbon monoxide poisoning only", "Minor upper airway irritation", "Esophageal burns"],
    correctIndex: 0,
    answer: "Singed nasal hairs, hoarseness, stridor, and carbonaceous (sooty) sputum are signs of inhalation injury with potential airway edema. Airway swelling can progress rapidly to complete obstruction within hours. The priority is early intubation before edema worsens. Also assess for carbon monoxide poisoning (treat with 100% FiO2) and cyanide toxicity from synthetic material combustion.",
    category: "Emergency",
    difficulty: 3
  },
  {
    id: "rn-cv-q16",
    type: "question",
    question: "A client receiving heparin has a platelet count that dropped from 210,000 to 85,000 over the past 5 days. What complication should the nurse suspect?",
    options: ["Disseminated intravascular coagulation", "Heparin-induced thrombocytopenia (HIT)", "Idiopathic thrombocytopenic purpura", "Aplastic anemia"],
    correctIndex: 1,
    answer: "Heparin-induced thrombocytopenia (HIT) occurs when heparin triggers antibodies against platelet factor 4, causing platelet activation and paradoxical thrombosis. A >50% drop in platelets 5-10 days after heparin initiation is classic. Discontinue all heparin products immediately and start a direct thrombin inhibitor (argatroban).",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-cv-q17",
    type: "question",
    question: "A client with a mechanical heart valve asks about anticoagulation. What is the target INR for mechanical valve replacement?",
    options: ["1.5-2.0", "2.0-3.0", "2.5-3.5", "3.5-4.5"],
    correctIndex: 2,
    answer: "Mechanical heart valve replacement requires a target INR of 2.5-3.5, which is higher than the standard 2.0-3.0 for atrial fibrillation or DVT/PE. Lifelong warfarin is required. Bioprosthetic valves may only need short-term anticoagulation.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-resp-q19",
    type: "question",
    question: "A client after a motor vehicle accident develops sudden-onset dyspnea, absent breath sounds on the left, and subcutaneous emphysema. What is the priority intervention?",
    options: ["Obtain a chest X-ray", "Administer oxygen via face mask", "Prepare for chest tube insertion", "Position client in high Fowler's"],
    correctIndex: 2,
    answer: "Absent breath sounds, acute dyspnea, and subcutaneous emphysema (crepitus under the skin) after trauma indicate pneumothorax. A chest tube (thoracostomy) is the priority to re-expand the collapsed lung. A tension pneumothorax requires emergent needle decompression at the 2nd intercostal space, midclavicular line.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-resp-q20",
    type: "question",
    question: "A client with ARDS has a PaO2/FiO2 ratio of 120 mmHg. How is this classified?",
    options: ["Mild ARDS", "Moderate ARDS", "Severe ARDS", "Not ARDS"],
    correctIndex: 1,
    answer: "ARDS severity is classified by PaO2/FiO2 ratio: Mild 200-300, Moderate 100-200, Severe <100. A ratio of 120 is moderate ARDS. Management includes lung-protective ventilation with low tidal volumes (6 mL/kg), permissive hypercapnia, PEEP optimization, and prone positioning for severe cases.",
    category: "Respiratory",
    difficulty: 3
  },
  {
    id: "rn-neuro-q18",
    type: "question",
    question: "A client with a traumatic brain injury has a Glasgow Coma Scale score of 6. What does this indicate?",
    options: ["Mild brain injury", "Moderate brain injury", "Severe brain injury requiring intubation", "Normal neurological function"],
    correctIndex: 2,
    answer: "GCS ranges from 3-15. Severe TBI is GCS ≤8, moderate is 9-12, mild is 13-15. A GCS ≤8 indicates the client cannot protect their airway and requires endotracheal intubation. The three components are Eye opening (1-4), Verbal response (1-5), and Motor response (1-6).",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-neuro-q19",
    type: "question",
    question: "A client post-craniotomy develops clear fluid draining from the nose. What test should the nurse perform?",
    options: ["Culture the drainage", "Test for glucose using a test strip", "Apply nasal packing immediately", "Suction the nares"],
    correctIndex: 1,
    answer: "Clear nasal drainage (rhinorrhea) after cranial surgery may indicate a cerebrospinal fluid (CSF) leak from a dural tear. CSF tests positive for glucose (regular nasal mucus does not). The 'halo sign' (clear ring around blood on linen) also suggests CSF. Never pack the nose or suction, as this increases infection risk. Notify the provider immediately.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-gi-q17",
    type: "question",
    question: "A client with cirrhosis develops asterixis. What does this assessment finding indicate?",
    options: ["Hypoglycemia", "Hepatic encephalopathy", "Portal hypertension", "Hepatorenal syndrome"],
    correctIndex: 1,
    answer: "Asterixis (liver flap) is an involuntary flapping tremor of the hands when wrists are dorsiflexed. It is a hallmark sign of hepatic encephalopathy caused by elevated ammonia levels. Treatment includes lactulose (promotes ammonia excretion through stool) and rifaximin (reduces ammonia-producing gut bacteria). Restrict protein intake during acute episodes.",
    category: "GI",
    difficulty: 2
  },
  {
    id: "rn-gi-q18",
    type: "question",
    question: "A client with a nasogastric tube has coffee-ground emesis. What does this finding suggest?",
    options: ["Active arterial bleeding", "Old or digested blood in the stomach", "Bile reflux", "Normal gastric contents"],
    correctIndex: 1,
    answer: "Coffee-ground emesis indicates old blood that has been partially digested by gastric acid (oxidized hemoglobin). It suggests upper GI bleeding that may be slower or has partially stopped. Bright red hematemesis indicates active, fresh bleeding. Both require urgent assessment, NPO status, IV access, and preparation for possible endoscopy.",
    category: "GI",
    difficulty: 1,
    image: imgNGTube
  },
  {
    id: "rn-endo-q17",
    type: "question",
    question: "A client with Addison's disease presents with bronze skin pigmentation, weakness, and hypotension. Which hormone replacement is critical?",
    options: ["Insulin", "Levothyroxine", "Hydrocortisone and fludrocortisone", "Growth hormone"],
    correctIndex: 2,
    answer: "Addison's disease (primary adrenal insufficiency) results in deficient cortisol and aldosterone. Hydrocortisone replaces cortisol, and fludrocortisone replaces aldosterone. Bronze hyperpigmentation results from excess ACTH stimulating melanocytes. Clients must increase steroid doses during illness or stress to prevent adrenal crisis (Addisonian crisis).",
    image: imgAddisons,
    category: "Endocrine",
    difficulty: 2
  },
  {
    id: "rn-endo-q18",
    type: "question",
    question: "A client with pheochromocytoma is scheduled for surgery. Which medication class must be given BEFORE beta-blockers?",
    options: ["ACE inhibitors", "Alpha-adrenergic blockers", "Calcium channel blockers", "Diuretics"],
    correctIndex: 1,
    answer: "In pheochromocytoma (catecholamine-secreting adrenal tumor), alpha-blockers (phenoxybenzamine) must be started 10-14 days before surgery to prevent hypertensive crisis. Beta-blockers are added AFTER adequate alpha blockade. Giving beta-blockers first causes unopposed alpha stimulation, leading to severe hypertension.",
    category: "Endocrine",
    difficulty: 3
  },
  {
    id: "rn-peds-q16",
    type: "question",
    question: "A 3-year-old with suspected epiglottitis presents with drooling, tripod positioning, and stridor. What is the priority nursing action?",
    options: ["Inspect the throat with a tongue blade", "Obtain a throat culture", "Keep the child calm, maintain airway, and prepare for intubation", "Administer a nebulized bronchodilator"],
    correctIndex: 2,
    answer: "Epiglottitis is a life-threatening emergency. NEVER examine the throat or place anything in the mouth as this can cause complete airway obstruction. Keep the child calm in a position of comfort (usually sitting upright). Prepare emergency airway equipment, notify anesthesia, and keep a tracheostomy tray at bedside.",
    category: "Pediatrics",
    difficulty: 3,
    image: imgEpiglottitis
  },
  {
    id: "rn-peds-q17",
    type: "question",
    question: "An infant with pyloric stenosis presents with projectile vomiting. Which electrolyte imbalance should the nurse anticipate?",
    options: ["Hyperkalemia and metabolic acidosis", "Hypochloremic metabolic alkalosis", "Hypernatremia and respiratory acidosis", "Hypocalcemia and metabolic acidosis"],
    correctIndex: 1,
    answer: "Pyloric stenosis causes persistent vomiting of gastric acid (HCl), resulting in loss of hydrogen and chloride ions. This leads to hypochloremic, hypokalemic metabolic alkalosis. The infant presents with projectile, non-bilious vomiting, olive-shaped mass in the RUQ, and visible peristaltic waves. Treatment is pyloromyotomy after fluid/electrolyte correction.",
    category: "Pediatrics",
    difficulty: 3,
    image: imgPyloricStenosis
  },
  {
    id: "rn-mat-q16",
    type: "question",
    question: "A client at 28 weeks gestation with Rh-negative blood type has a negative antibody screen. What should the nurse administer?",
    options: ["Rubella vaccine", "RhoGAM (Rh immunoglobulin)", "Oxytocin", "Magnesium sulfate"],
    correctIndex: 1,
    answer: "RhoGAM is administered at 28 weeks gestation and within 72 hours after delivery (if the newborn is Rh-positive) to prevent Rh sensitization. RhoGAM prevents the mother from developing antibodies against Rh-positive fetal red blood cells. It is also given after any event with potential fetomaternal hemorrhage (amniocentesis, trauma, miscarriage).",
    category: "Maternity",
    difficulty: 1
  },
  {
    id: "rn-mat-q17",
    type: "question",
    question: "A client receiving magnesium sulfate for preeclampsia has a respiratory rate of 10/min and absent deep tendon reflexes. What is the priority action?",
    options: ["Continue the infusion and monitor", "Stop the magnesium sulfate and administer calcium gluconate", "Increase the infusion rate", "Position the client on the left side"],
    correctIndex: 1,
    answer: "Respiratory depression (<12/min) and absent DTRs are signs of magnesium toxicity. Stop the infusion immediately and administer the antidote: calcium gluconate 1g IV. Also monitor urine output (should be ≥30 mL/hr). Therapeutic magnesium level is 4-7 mEq/L. Loss of DTRs occurs at 7-10 mEq/L, respiratory arrest at 12+ mEq/L.",
    category: "Maternity",
    difficulty: 2
  },
  {
    id: "rn-mh-q16",
    type: "question",
    question: "A client on lithium for bipolar disorder reports tremors, nausea, and diarrhea. The serum lithium level is 2.0 mEq/L. What should the nurse do?",
    options: ["Administer the next scheduled dose", "Hold lithium and notify the provider immediately", "Give an extra dose of lithium", "Encourage the client to increase sodium intake"],
    correctIndex: 1,
    answer: "The therapeutic lithium range is 0.6-1.2 mEq/L. A level of 2.0 mEq/L is toxic. Early toxicity signs include GI symptoms (nausea, vomiting, diarrhea), fine hand tremors, and muscle weakness. Severe toxicity (>2.5) causes seizures, coma, and cardiac arrhythmias. Hold the medication, hydrate the client, and notify the provider for emergent management.",
    category: "Mental Health",
    difficulty: 2
  },
  {
    id: "rn-mh-q17",
    type: "question",
    question: "A client with anorexia nervosa has been on a refeeding protocol for 24 hours. Which complication should the nurse monitor for?",
    options: ["Hyperkalemia", "Refeeding syndrome with hypophosphatemia", "Hypernatremia", "Metabolic alkalosis"],
    correctIndex: 1,
    answer: "Refeeding syndrome occurs when severely malnourished clients are refed too rapidly. Insulin surge drives phosphorus, potassium, and magnesium into cells, causing dangerous hypophosphatemia. This can lead to cardiac arrhythmias, respiratory failure, seizures, and death. Refeed slowly, monitor electrolytes (especially phosphorus) every 12 hours, and supplement as needed.",
    category: "Mental Health",
    difficulty: 3
  },
  {
    id: "rn-pharm-q18",
    type: "question",
    question: "A client is prescribed metformin for type 2 diabetes. What is the most serious adverse effect the nurse should teach about?",
    options: ["Hypoglycemia", "Weight gain", "Lactic acidosis", "Hepatotoxicity"],
    correctIndex: 2,
    answer: "Lactic acidosis is a rare but potentially fatal complication of metformin. Risk increases with renal impairment, dehydration, alcohol use, and IV contrast dye use. Hold metformin 48 hours before and after contrast studies. Monitor renal function regularly. Metformin alone rarely causes hypoglycemia and is weight-neutral or causes modest weight loss.",
    category: "Pharmacology",
    difficulty: 2
  },
  {
    id: "rn-pharm-q19",
    type: "question",
    question: "A client on warfarin asks about foods to avoid. Which dietary instruction is most accurate?",
    options: ["Avoid all green vegetables completely", "Maintain consistent vitamin K intake rather than avoiding it entirely", "Increase vitamin K foods to counteract the drug", "Diet does not affect warfarin therapy"],
    correctIndex: 1,
    answer: "Clients on warfarin should maintain CONSISTENT vitamin K intake, not eliminate it entirely. Sudden increases or decreases in vitamin K-rich foods (leafy greens, broccoli, liver) can alter INR levels unpredictably. Consistency allows for stable dose adjustments. Also avoid cranberry juice and alcohol, which can potentiate warfarin's effect.",
    category: "Pharmacology",
    difficulty: 1
  },
  {
    id: "rn-renal-q9",
    type: "question",
    question: "A client with end-stage renal disease on hemodialysis has an arteriovenous fistula in the left arm. Which nursing action is correct?",
    options: ["Take blood pressure in the left arm", "Palpate the fistula for a thrill and auscultate for a bruit", "Draw blood from the fistula between dialysis sessions", "Apply a tourniquet above the fistula site"],
    correctIndex: 1,
    answer: "Assess the AV fistula for a palpable thrill (vibration) and audible bruit (swooshing sound), which indicate patency. NEVER take blood pressure, draw blood, or start an IV in the access arm. Avoid restrictive clothing or positioning. Report absence of thrill/bruit immediately as it may indicate clotting.",
    category: "Renal/GU",
    difficulty: 1,
    image: imgAVFistulaFlashcard
  },
  {
    id: "rn-renal-q10",
    type: "question",
    question: "A client with acute kidney injury has a potassium level of 6.8 mEq/L. Which medication should the nurse prepare to administer FIRST?",
    options: ["Oral kayexalate", "IV calcium gluconate", "IV insulin with dextrose", "Oral potassium supplements"],
    correctIndex: 1,
    answer: "IV calcium gluconate is administered FIRST for critical hyperkalemia to stabilize the cardiac membrane and prevent life-threatening arrhythmias. It does not lower potassium but protects the heart. Then IV insulin with D50 shifts potassium intracellularly. Kayexalate removes potassium via the GI tract but acts slowly. Monitor ECG for peaked T waves, widened QRS.",
    category: "Renal/GU",
    difficulty: 3
  },
  {
    id: "rn-fe-q13",
    type: "question",
    question: "A client with SIADH has a serum sodium of 118 mEq/L. What is the priority nursing intervention?",
    options: ["Encourage fluid intake", "Implement fluid restriction", "Administer hypertonic saline rapidly", "Increase dietary sodium"],
    correctIndex: 1,
    answer: "SIADH causes excess ADH secretion leading to water retention and dilutional hyponatremia. Fluid restriction (800-1000 mL/day) is the primary treatment. Severe hyponatremia (<120) with symptoms may require hypertonic saline (3% NaCl), but it must be infused SLOWLY to prevent osmotic demyelination syndrome (central pontine myelinolysis). Correct no faster than 8-12 mEq/L per 24 hours.",
    image: imgSIADH,
    category: "Fluid & Electrolytes",
    difficulty: 3
  },
  {
    id: "rn-fe-q14",
    type: "question",
    question: "A client receiving a blood transfusion develops fever, chills, and flank pain within 15 minutes. What type of reaction is this?",
    options: ["Febrile non-hemolytic reaction", "Acute hemolytic transfusion reaction", "Allergic reaction", "Circulatory overload"],
    correctIndex: 1,
    answer: "Acute hemolytic transfusion reaction occurs from ABO incompatibility. Signs include fever, chills, flank/back pain, hypotension, hemoglobinuria (dark urine), and DIC. STOP the transfusion immediately, maintain IV access with normal saline, send the blood bag and new blood samples to the lab. This is a medical emergency.",
    image: imgAcuteHemolyticReaction,
    category: "Fluid & Electrolytes",
    difficulty: 2
  },
  {
    id: "rn-pain-q11",
    type: "question",
    question: "A client receiving patient-controlled analgesia (PCA) with morphine has a respiratory rate of 8/min and is difficult to arouse. What is the priority action?",
    options: ["Administer the next PCA dose", "Stop the PCA and administer naloxone (Narcan)", "Encourage coughing and deep breathing", "Increase the PCA dose"],
    correctIndex: 1,
    answer: "Respiratory depression (RR <10/min) with excessive sedation indicates opioid overdose. Stop the PCA immediately and administer naloxone (Narcan), an opioid antagonist. Naloxone has a shorter half-life than most opioids, so re-sedation may occur; continue monitoring closely. Keep resuscitation equipment at bedside.",
    category: "Pain Management",
    difficulty: 2
  },
  {
    id: "rn-pain-q12",
    type: "question",
    question: "A client reports severe pain rated 9/10 but is laughing and talking on the phone. What is the most appropriate nursing action?",
    options: ["Document that the client does not appear to be in pain", "Accept and treat the client's self-report of pain", "Confront the client about inconsistent behavior", "Withhold analgesics until objective signs are present"],
    correctIndex: 1,
    answer: "Pain is whatever the client says it is (McCaffery definition). Self-report is the most reliable indicator of pain. Behavioral coping mechanisms (laughing, distraction) do not negate the existence of pain. Cultural background and individual coping strategies influence how pain is expressed. Document the client's self-report and treat accordingly.",
    category: "Pain Management",
    difficulty: 1
  },
  {
    id: "rn-onc-q14",
    type: "question",
    question: "A client receiving chemotherapy has an absolute neutrophil count (ANC) of 400 cells/mm³. What precaution should the nurse implement?",
    options: ["Standard precautions only", "Contact precautions", "Neutropenic precautions (protective isolation)", "Airborne precautions"],
    correctIndex: 2,
    answer: "An ANC <500 cells/mm³ indicates severe neutropenia and high infection risk. Implement neutropenic precautions: private room, strict hand hygiene, no fresh flowers or raw foods, avoid crowds, no rectal temperatures or suppositories, monitor for subtle signs of infection (fever may be the ONLY sign). No live vaccines.",
    category: "Oncology",
    difficulty: 2
  },
  {
    id: "rn-onc-q15",
    type: "question",
    question: "A client with cancer develops tumor lysis syndrome. Which lab abnormality is characteristic?",
    options: ["Hypokalemia, hypocalcemia, hypouricemia", "Hyperkalemia, hyperphosphatemia, hyperuricemia, hypocalcemia", "Hypernatremia, hypokalemia, hypercalcemia", "Normal electrolytes with elevated WBC"],
    correctIndex: 1,
    answer: "Tumor lysis syndrome occurs when rapid cancer cell destruction releases intracellular contents: potassium (hyperkalemia), phosphorus (hyperphosphatemia), uric acid (hyperuricemia), and nucleic acids. Phosphorus binds calcium causing hypocalcemia. This can lead to cardiac arrhythmias, seizures, and renal failure. Prevention: IV hydration and allopurinol or rasburicase before chemotherapy.",
    category: "Oncology",
    difficulty: 3
  },
  {
    id: "rn-ger-q13",
    type: "question",
    question: "An 82-year-old client admitted for a hip fracture becomes acutely confused and agitated at night. What is the most likely cause?",
    options: ["Dementia", "Delirium", "Depression", "Normal aging"],
    correctIndex: 1,
    answer: "Delirium is characterized by acute onset, fluctuating course, and altered level of consciousness. It is commonly triggered by hospitalization, infection, medications, pain, or metabolic disturbances in elderly clients. Unlike dementia (gradual onset, chronic), delirium is usually REVERSIBLE when the underlying cause is treated. Sundowning (evening worsening) is common.",
    category: "Geriatrics",
    difficulty: 1
  },
  {
    id: "rn-ger-q14",
    type: "question",
    question: "Which medication class should be avoided or used cautiously in elderly clients according to the Beers Criteria?",
    options: ["Acetaminophen", "Benzodiazepines", "Stool softeners", "Low-dose aspirin"],
    correctIndex: 1,
    answer: "The Beers Criteria identifies potentially inappropriate medications for older adults. Benzodiazepines increase fall risk, cognitive impairment, delirium, and respiratory depression in the elderly. Other drugs to avoid include anticholinergics, first-generation antihistamines (diphenhydramine), long-acting sulfonylureas, and muscle relaxants. Use the lowest effective dose and shortest duration when alternatives are unavailable.",
    category: "Geriatrics",
    difficulty: 1
  },
  {
    id: "rn-ic-q11",
    type: "question",
    question: "A client with Clostridium difficile infection is placed on which type of isolation precautions?",
    options: ["Airborne precautions", "Droplet precautions", "Contact precautions with soap and water hand hygiene", "Standard precautions only"],
    correctIndex: 2,
    answer: "C. difficile requires contact precautions: gown and gloves, dedicated equipment, private room. Critically, hand hygiene must be with SOAP AND WATER because alcohol-based sanitizers do NOT kill C. difficile spores. Bleach-based disinfectants are required for environmental cleaning. Common cause: antibiotic-associated diarrhea, especially after fluoroquinolones and clindamycin.",
    category: "Infection Control",
    difficulty: 1
  },
  {
    id: "rn-ic-q12",
    type: "question",
    question: "A nurse is exposed to a needlestick injury from a patient with unknown HIV status. What is the priority action?",
    options: ["Wait for the source patient's HIV test results", "Begin post-exposure prophylaxis (PEP) within 2 hours", "Apply alcohol to the wound", "Complete an incident report only"],
    correctIndex: 1,
    answer: "Post-exposure prophylaxis (PEP) should be initiated as soon as possible, ideally within 2 hours and no later than 72 hours after exposure. PEP consists of a 28-day antiretroviral regimen. Immediately wash the wound with soap and water, report to occupational health, baseline labs (HIV, HBV, HCV), and complete an incident report. Do NOT squeeze the wound.",
    category: "Infection Control",
    difficulty: 2,
    image: imgHIV
  },
  {
    id: "rn-del-q12",
    type: "question",
    question: "An RN has four clients to assess. Which client should the nurse see FIRST?",
    options: ["Client 2 hours post-appendectomy with pain rated 5/10", "Client with type 1 diabetes reporting cold sweats and tremors", "Client with COPD requesting a breathing treatment", "Client requesting discharge instructions"],
    correctIndex: 1,
    answer: "Cold sweats and tremors in a diabetic client suggest hypoglycemia, a potentially life-threatening emergency. This client needs immediate glucose assessment and treatment (15g rapid-acting carbohydrate or IV dextrose if unconscious). Use the ABCs and unstable-before-stable framework: acute physiological instability takes priority over pain management, routine treatments, or discharge planning.",
    category: "Delegation/Prioritization",
    difficulty: 1
  },
  {
    id: "rn-del-q13",
    type: "question",
    question: "Which task can the RN safely delegate to an unlicensed assistive personnel (UAP)?",
    options: ["Administering PRN medications", "Obtaining vital signs on a stable postoperative client", "Teaching a newly diagnosed diabetic about insulin injection", "Assessing a wound for signs of infection"],
    correctIndex: 1,
    answer: "UAPs can perform routine tasks on stable clients: vital signs, I&O measurement, bathing, feeding, ambulation, and blood glucose monitoring. The RN retains assessment, evaluation, teaching, medication administration, and care of unstable clients. Use the 5 Rights of Delegation: Right task, Right circumstance, Right person, Right direction/communication, Right supervision.",
    category: "Delegation/Prioritization",
    difficulty: 1
  },
  {
    id: "rn-comm-q9",
    type: "question",
    question: "A public health nurse is planning a community education program about fall prevention for elderly clients. Which setting is most appropriate?",
    options: ["Acute care hospital", "Senior community center", "Pediatric clinic", "Emergency department"],
    correctIndex: 1,
    answer: "Community health nursing focuses on population-based care in settings where clients live, work, and gather. A senior community center is the most appropriate venue to reach the target population for fall prevention education. Primary prevention strategies include exercise programs (balance and strength training), home safety assessments, medication reviews, and vision screening.",
    category: "Community Health",
    difficulty: 1,
    image: imgFallPrevention
  },
  {
    id: "rn-comm-q10",
    type: "question",
    question: "A home health nurse identifies that a client's home has throw rugs, poor lighting, and no grab bars in the bathroom. What is the priority nursing action?",
    options: ["Remove all the hazards immediately without permission", "Document the findings and develop a safety plan with the client", "Report the client to adult protective services", "Discontinue home health services"],
    correctIndex: 1,
    answer: "The nurse should assess and document environmental hazards, then collaborate with the client to develop a safety plan. Client autonomy must be respected. Recommendations include removing throw rugs, improving lighting, installing grab bars and non-slip mats, securing electrical cords, and ensuring smoke detectors are functional. Fall prevention is a primary nursing priority in home care.",
    category: "Community Health",
    difficulty: 1
  },
  {
    id: "rn-safe-q19",
    type: "question",
    question: "A nurse discovers that a medication error occurred but the client was not harmed. What is the most appropriate action?",
    options: ["Do not report since the client was unharmed", "Complete an incident/occurrence report and notify the provider", "Document the error in the nurses' notes only", "Discuss the error only during shift report"],
    correctIndex: 1,
    answer: "ALL medication errors must be reported regardless of whether harm occurred. Complete an incident/occurrence report (NOT filed in the medical record), notify the provider, assess the client, and document the client's condition in the medical record. Near-miss reporting supports a culture of safety and quality improvement. Never blame the individual; focus on system improvements.",
    category: "Safety & Ethics",
    difficulty: 1
  },
  {
    id: "rn-safe-q20",
    type: "question",
    question: "A competent adult client with terminal cancer refuses further treatment. The client's family insists on continuing chemotherapy. What is the nurse's obligation?",
    options: ["Support the family's wishes to continue treatment", "Advocate for the client's right to refuse treatment", "Consult the ethics committee before honoring the client's wishes", "Convince the client to reconsider"],
    correctIndex: 1,
    answer: "A competent adult has the right to refuse any treatment, including life-sustaining interventions (autonomy). The nurse's role is to advocate for the client's informed decision. Document the refusal, ensure the client understands the consequences, and support the family through therapeutic communication. The family cannot override a competent client's decision.",
    category: "Safety & Ethics",
    difficulty: 1
  },
  {
    id: "rn-cc-q16",
    type: "question",
    question: "A client in the ICU develops a systolic blood pressure of 70 mmHg, tachycardia, cold clammy skin, and decreased urine output after abdominal surgery. Which type of shock should the nurse suspect?",
    options: ["Cardiogenic shock", "Hypovolemic shock", "Septic shock", "Anaphylactic shock"],
    correctIndex: 1,
    answer: "Post-surgical hypotension with tachycardia, cold/clammy skin, and oliguria indicates hypovolemic shock from hemorrhage. The compensatory sympathetic response causes tachycardia and peripheral vasoconstriction (cool extremities). Treatment: 2 large-bore IVs, rapid crystalloid infusion, blood products, and surgical re-exploration if bleeding continues. Monitor lactate and base deficit.",
    category: "Critical Care",
    difficulty: 2
  },
  {
    id: "rn-emerg-q16",
    type: "question",
    question: "A client arrives in the emergency department after ingesting a large amount of acetaminophen 2 hours ago. What is the antidote?",
    options: ["Flumazenil", "Naloxone", "N-acetylcysteine (Mucomyst)", "Protamine sulfate"],
    correctIndex: 2,
    answer: "N-acetylcysteine (NAC/Mucomyst) is the antidote for acetaminophen overdose. It replenishes glutathione stores and prevents hepatotoxicity. Most effective when given within 8 hours of ingestion. Check acetaminophen level at 4 hours post-ingestion and plot on the Rumack-Matthew nomogram. Toxic dose is >150 mg/kg. Monitor liver function tests and INR.",
    category: "Emergency",
    difficulty: 2
  },
  {
    id: "rn-emerg-q17",
    type: "question",
    question: "During a mass casualty event using triage, a victim is walking and has minor lacerations. What triage color tag is assigned?",
    options: ["Red (immediate)", "Yellow (delayed)", "Green (minor/walking wounded)", "Black (expectant/deceased)"],
    correctIndex: 2,
    answer: "In mass casualty triage (START triage), GREEN tag is for walking wounded with minor injuries that can wait for treatment. RED is immediate/life-threatening, YELLOW is delayed but serious (can wait 1-2 hours), BLACK is expectant/deceased (unsurvivable injuries or no signs of life). The first step is to direct all walking victims to a designated area (GREEN).",
    category: "Emergency",
    difficulty: 1
  },
  {
    id: "rn-safe-q21",
    type: "question",
    question: "A nurse witnesses a coworker diverting controlled substances. What is the nurse's legal and ethical obligation?",
    options: ["Confront the coworker privately and ask them to stop", "Report the suspected diversion to the nurse manager and follow facility policy", "Ignore it to avoid workplace conflict", "Wait until there is definitive proof before taking action"],
    correctIndex: 1,
    answer: "Nurses have a legal and ethical obligation to report suspected drug diversion immediately to the nurse manager, supervisor, or facility compliance officer per facility policy. Failure to report can result in disciplinary action by the Board of Nursing and potential loss of licensure. Many facilities have employee assistance programs (EAPs) and alternative-to-discipline programs for impaired nurses. Document objectively and maintain confidentiality.",
    category: "Safety & Ethics",
    difficulty: 1
  },
  // ============================================================
  // MUSCULOSKELETAL (15 cards)
  // ============================================================
  {
    id: "rn-msk-q1",
    type: "question",
    question: "A client with a newly applied long-leg cast reports increasing pain unrelieved by elevation and prescribed analgesics. The nurse notes the toes are pale, cool, and the client reports tingling. What is the priority nursing action?",
    options: ["Elevate the extremity higher on pillows", "Administer a stronger analgesic as ordered", "Notify the healthcare provider immediately for possible compartment syndrome", "Apply ice packs around the cast"],
    correctIndex: 2,
    answer: "The classic signs of compartment syndrome include the 5 P's: Pain (disproportionate and unrelieved by analgesics), Pallor, Pulselessness, Paresthesia (tingling/numbness), and Paralysis. This is a surgical emergency requiring immediate notification of the provider. The cast may need to be bivalved or removed. Delay can lead to permanent nerve damage, muscle necrosis, and limb loss. Elevation and ice alone will not resolve compartment syndrome.",
    category: "Musculoskeletal",
    image: imgCompartmentSyndrome,
    difficulty: 3
  },
  {
    id: "rn-msk-q2",
    type: "question",
    question: "A client is in Buck's traction for a fractured hip awaiting surgical repair. Which nursing assessment finding requires immediate intervention?",
    options: ["The weights are hanging freely off the bed", "The client reports mild discomfort at the fracture site", "The traction rope is caught on the edge of the pulley", "The client's foot on the affected side is in a neutral position"],
    correctIndex: 2,
    answer: "Traction must be maintained continuously with ropes riding freely over pulleys and weights hanging freely. A rope caught on the pulley edge disrupts the line of pull, rendering the traction ineffective and potentially causing pain, malalignment, or muscle spasm. The nurse should immediately free the rope to restore proper traction. Weights hanging freely and neutral foot positioning are expected findings.",
    image: imgTraction,
    category: "Musculoskeletal",
    difficulty: 2
  },
  {
    id: "rn-msk-q3",
    type: "question",
    question: "A nurse is caring for a client 1 day after total hip arthroplasty (posterior approach). Which client action requires immediate correction?",
    options: ["Using a raised toilet seat", "Sitting in a chair with hips at 90 degrees", "Crossing the legs while sitting in bed", "Using an abduction pillow while sleeping"],
    correctIndex: 2,
    answer: "After posterior-approach total hip arthroplasty, the client must avoid hip flexion beyond 90 degrees, adduction (crossing legs), and internal rotation to prevent prosthetic dislocation. Crossing legs causes adduction past midline, directly risking dislocation. A raised toilet seat prevents excessive flexion, an abduction pillow maintains proper alignment, and sitting with hips at 90 degrees (not beyond) is acceptable.",
    category: "Musculoskeletal",
    difficulty: 2
  },
  {
    id: "rn-msk-q4",
    type: "question",
    question: "A client with a fractured femur is being treated with skeletal traction via a Steinmann pin. The nurse notes serous drainage at the pin site. What is the appropriate nursing action?",
    options: ["Remove the pin immediately and notify the provider", "Clean the pin site with sterile saline or prescribed solution per protocol", "Apply antibiotic ointment and cover with an occlusive dressing", "Discontinue traction and reposition the client"],
    correctIndex: 1,
    answer: "Small amounts of serous drainage at pin sites are expected findings. The nurse should perform pin site care per facility protocol, typically cleaning with sterile saline or chlorhexidine. Signs of infection (purulent drainage, erythema, warmth, fever) require provider notification. The nurse should never remove the pin or discontinue traction without a provider order, as this would compromise fracture alignment.",
    image: imgTraction,
    category: "Musculoskeletal",
    difficulty: 2
  },
  {
    id: "rn-msk-q5",
    type: "question",
    question: "A client with rheumatoid arthritis (RA) reports morning stiffness lasting over 2 hours. Which medication class is MOST likely to modify disease progression?",
    options: ["NSAIDs such as ibuprofen", "Opioid analgesics such as morphine", "Disease-modifying antirheumatic drugs (DMARDs) such as methotrexate", "Muscle relaxants such as cyclobenzaprine"],
    correctIndex: 2,
    answer: "DMARDs such as methotrexate are the cornerstone of RA treatment because they slow disease progression and joint destruction by modifying the underlying immune response. NSAIDs provide symptom relief but do not alter disease progression. Opioids manage pain but carry addiction risk and do not modify the disease. Muscle relaxants address spasm, not the autoimmune inflammatory process. Prolonged morning stiffness (>1 hour) is characteristic of RA.",
    category: "Musculoskeletal",
    difficulty: 2,
    image: illustrationRheumatoidArthritis
  },
  {
    id: "rn-msk-q6",
    type: "question",
    question: "A client with osteoporosis asks the nurse about preventing fractures. Which statement by the client indicates understanding of the teaching?",
    options: ["I will avoid all physical activity to prevent falls", "I will take my calcium supplement with my iron pill to save time", "I will do weight-bearing exercises like walking 30 minutes daily", "I will drink more coffee since it helps bone density"],
    correctIndex: 2,
    answer: "Weight-bearing exercises such as walking stimulate osteoblast activity and increase bone density, reducing fracture risk. Avoiding all activity leads to further bone loss. Calcium and iron should be taken at different times as they compete for absorption. Caffeine increases urinary calcium excretion and can contribute to bone loss. Additional recommendations include adequate vitamin D, fall prevention strategies, and avoiding smoking and excessive alcohol.",
    category: "Musculoskeletal",
    difficulty: 2
  },
  {
    id: "rn-msk-q7",
    type: "question",
    question: "A client post-laminectomy reports a clear drainage on the surgical dressing. The nurse tests the drainage with a glucose reagent strip and obtains a positive result. What should the nurse suspect?",
    options: ["Normal serosanguineous wound drainage", "Cerebrospinal fluid (CSF) leak", "Allergic reaction to the dressing material", "Wound infection with exudate"],
    correctIndex: 1,
    answer: "Clear drainage from a spinal surgery site that tests positive for glucose is highly suspicious for a cerebrospinal fluid (CSF) leak. CSF contains glucose while serous wound drainage typically does not. A CSF leak increases the risk of meningitis and requires immediate notification of the surgeon. The client should be positioned flat, the area should not be covered with an occlusive dressing, and the provider may order bed rest and hydration. Normal wound drainage is serosanguineous, not glucose-positive.",
    category: "Musculoskeletal",
    difficulty: 3
  },
  {
    id: "rn-msk-q8",
    type: "question",
    question: "A client with a below-knee amputation (BKA) is 2 days post-op. Which position should the nurse encourage to prevent hip flexion contracture?",
    options: ["Elevate the residual limb on two pillows at all times", "Maintain the client in a prone position for 20-30 minutes several times daily", "Keep the knee flexed on a pillow continuously", "Position the client in a high Fowler's position"],
    correctIndex: 1,
    answer: "Prone positioning for 20-30 minutes several times daily helps prevent hip flexion contractures after a BKA by extending the hip joint. Continuous elevation on pillows after the first 24-48 hours promotes hip flexion contracture. Keeping the knee flexed also promotes contracture. High Fowler's position does not specifically address hip extension. The residual limb may be elevated briefly for edema control in the first 24 hours but not continuously after that.",
    category: "Musculoskeletal",
    difficulty: 2,
    image: imgContracture
  },
  {
    id: "rn-msk-q9",
    type: "question",
    question: "A client reports sudden, severe pain and swelling in the great toe. Serum uric acid is 10.2 mg/dL (normal: 3.5-7.2). Which dietary modification should the nurse recommend?",
    options: ["Increase intake of organ meats and shellfish", "Limit fluid intake to 1000 mL per day", "Avoid high-purine foods such as red meat, organ meats, and alcohol", "Increase consumption of dried beans and lentils"],
    correctIndex: 2,
    answer: "Elevated uric acid with acute great toe inflammation (podagra) indicates gout. The nurse should recommend avoiding high-purine foods including organ meats, red meat, shellfish, and alcohol (especially beer) which increase uric acid production. Fluid intake should be increased to 2-3 liters daily to promote uric acid excretion. Dried beans and lentils are moderate-purine foods that should be limited. Organ meats and shellfish are the highest purine foods and should be avoided.",
    category: "Musculoskeletal",
    difficulty: 2,
    image: imgGout
  },
  {
    id: "rn-msk-q10",
    type: "question",
    question: "A client is admitted with a fat embolism syndrome 48 hours after a long bone fracture. Which is the earliest clinical manifestation the nurse should monitor for?",
    options: ["Sudden chest pain with hemoptysis", "Petechial rash on the chest, axillae, and conjunctivae", "Altered mental status and restlessness", "Severe hypotension and tachycardia"],
    correctIndex: 2,
    answer: "Altered mental status and restlessness are the earliest signs of fat embolism syndrome (FES) because fat globules cross the blood-brain barrier and cause cerebral hypoxia. FES typically develops 24-72 hours after a long bone fracture. Petechial rash is a classic but later sign, appearing on the chest, axillae, and conjunctivae. Respiratory symptoms (dyspnea, tachypnea) and cardiovascular instability develop subsequently. Early recognition and supportive care (oxygen, fluids) are critical.",
    category: "Musculoskeletal",
    difficulty: 3
  },
  {
    id: "rn-msk-q11",
    type: "question",
    question: "A nurse is teaching a client about crutch walking using a three-point gait. The client has a non-weight-bearing left leg. What is the correct sequence?",
    options: ["Move both crutches and the affected leg forward, then the unaffected leg", "Move the left crutch, then the right crutch, then swing both legs forward", "Move the right crutch and left leg forward, then the left crutch and right leg", "Move both crutches forward, then swing both legs through"],
    correctIndex: 0,
    answer: "In a three-point gait for non-weight-bearing, both crutches and the affected (non-weight-bearing) leg advance together, then the unaffected (strong) leg steps through. This gait pattern allows the crutches to bear the weight that the affected leg cannot. A two-point gait alternates opposite crutch and leg. A four-point gait moves each crutch and leg independently. Swing-through gait involves swinging both legs past the crutches.",
    category: "Musculoskeletal",
    difficulty: 2
  },
  {
    id: "rn-msk-q12",
    type: "question",
    question: "A client with systemic lupus erythematosus (SLE) is prescribed hydroxychloroquine. Which follow-up assessment is essential with this medication?",
    options: ["Annual renal biopsy", "Regular ophthalmologic examinations", "Monthly bone density scans", "Weekly liver function tests"],
    correctIndex: 1,
    answer: "Hydroxychloroquine can cause irreversible retinal toxicity (maculopathy), so clients must have baseline and regular ophthalmologic examinations (typically every 6-12 months after 5 years of use or sooner with risk factors). Early detection of retinal changes allows discontinuation before vision loss becomes permanent. While SLE can affect the kidneys, renal biopsy is not a routine monitoring requirement for hydroxychloroquine. Bone density and liver function are not primary concerns with this medication.",
    category: "Musculoskeletal",
    difficulty: 3
  },
  {
    id: "rn-msk-q13",
    type: "question",
    question: "A client with a cervical spinal cord injury at C4 is being admitted to the ICU. Which complication should the nurse anticipate as the HIGHEST priority?",
    options: ["Urinary retention requiring catheterization", "Autonomic dysreflexia causing hypertension", "Respiratory failure requiring mechanical ventilation", "Deep vein thrombosis from immobility"],
    correctIndex: 2,
    answer: "A C4 spinal cord injury affects the phrenic nerve (C3-C5) which innervates the diaphragm. Loss of diaphragmatic function causes respiratory failure, which is the highest-priority and most immediately life-threatening complication. The client will likely require mechanical ventilation. Autonomic dysreflexia occurs in injuries above T6 but develops after spinal shock resolves. Urinary retention and DVT are important but not as immediately life-threatening as respiratory failure.",
    category: "Musculoskeletal",
    difficulty: 3
  },
  {
    id: "rn-msk-q14",
    type: "question",
    question: "A client in a body cast reports a burning sensation under the cast near the abdomen after eating. What does the nurse suspect?",
    options: ["Normal skin irritation from the cast material", "Superior mesenteric artery (SMA) syndrome", "Allergic contact dermatitis to the plaster", "Anxiety-related gastrointestinal symptoms"],
    correctIndex: 1,
    answer: "Superior mesenteric artery (SMA) syndrome, or cast syndrome, occurs when a body cast compresses the duodenum between the SMA and the aorta, causing intestinal obstruction. Symptoms include abdominal distension, nausea, vomiting (especially after eating), and a burning sensation. It is a potentially life-threatening complication. The nurse should notify the provider, position the client prone or on the right side, and prepare for possible cast windowing or removal. Simple skin irritation would not correlate with eating.",
    category: "Musculoskeletal",
    difficulty: 3
  },
  {
    id: "rn-msk-q15",
    type: "question",
    question: "A nurse is assessing a client who fell and reports hip pain. The affected leg is shortened and externally rotated. What does this finding most likely indicate?",
    options: ["Posterior hip dislocation", "Femoral neck fracture (hip fracture)", "Muscle strain of the hip adductors", "Pelvic fracture with bladder injury"],
    correctIndex: 1,
    answer: "A shortened, externally rotated leg is the classic presentation of a femoral neck (hip) fracture, common in elderly clients with osteoporosis after a fall. Posterior hip dislocation typically presents with internal rotation, flexion, and adduction. Muscle strain would not cause limb shortening. Pelvic fracture may present with pelvic instability and hematuria but does not typically cause external rotation and shortening. X-ray confirmation and surgical intervention (hemiarthroplasty or ORIF) are usually required.",
    category: "Musculoskeletal",
    difficulty: 2
  },
  // ============================================================
  // PERIOPERATIVE (15 cards)
  // ============================================================
  {
    id: "rn-periop-q1",
    type: "question",
    question: "A client scheduled for surgery states, 'I don't really understand what the surgeon is going to do.' What is the nurse's BEST response?",
    options: ["Explain the surgical procedure in detail to the client", "Have the client sign the consent form and reassure them", "Notify the surgeon that the client needs further explanation before consent", "Tell the client to look up the procedure online"],
    correctIndex: 2,
    answer: "Informed consent requires that the client understands the procedure, risks, benefits, and alternatives. It is the surgeon's responsibility to explain the procedure. The nurse's role is to witness the consent and advocate for the client. If the client does not understand, the nurse must notify the surgeon to provide further explanation before consent is obtained. Having the client sign without understanding violates informed consent principles and is legally and ethically wrong.",
    category: "Perioperative",
    difficulty: 2
  },
  {
    id: "rn-periop-q2",
    type: "question",
    question: "During surgery, the client's temperature rapidly rises to 104°F (40°C), with muscle rigidity and tachycardia. What is the priority intervention?",
    options: ["Apply cooling blankets and administer acetaminophen", "Administer dantrolene sodium IV as ordered", "Increase IV fluid rate and administer antipyretics", "Stop all anesthetics and transport to the ICU"],
    correctIndex: 1,
    answer: "Malignant hyperthermia is a life-threatening reaction to volatile inhalational anesthetics (e.g., sevoflurane) or succinylcholine, causing uncontrolled skeletal muscle metabolism. Dantrolene sodium is the specific antidote that acts by inhibiting calcium release from the sarcoplasmic reticulum. All triggering agents must be discontinued immediately, but dantrolene administration is the priority pharmacological intervention. Cooling measures are supportive but secondary. Without dantrolene, mortality is extremely high.",
    category: "Perioperative",
    difficulty: 3
  },
  {
    id: "rn-periop-q3",
    type: "question",
    question: "A nurse in the PACU notes that a post-operative client's oxygen saturation drops to 88% and the client is making snoring respirations. What is the priority action?",
    options: ["Administer naloxone (Narcan) immediately", "Perform a jaw-thrust maneuver and open the airway", "Increase the IV fluid rate", "Obtain an arterial blood gas immediately"],
    correctIndex: 1,
    answer: "Snoring respirations with desaturation in the PACU suggest upper airway obstruction, commonly from the tongue falling back against the posterior pharynx due to residual anesthetic effects. The priority is airway management using a jaw-thrust or chin-lift maneuver to open the airway. Positioning the client in a lateral or side-lying position can also help. Naloxone would be indicated for opioid-induced respiratory depression (slow, shallow breathing) not obstruction. ABG and fluids do not address the immediate airway problem.",
    category: "Perioperative",
    difficulty: 2
  },
  {
    id: "rn-periop-q4",
    type: "question",
    question: "A client is 5 days post-abdominal surgery. While coughing, the client reports feeling a 'pop' and the nurse observes loops of intestine protruding through the incision. What is the priority action?",
    options: ["Push the intestine back into the abdomen and apply a dry sterile dressing", "Cover the wound with a sterile saline-moistened dressing and call the surgeon immediately", "Apply a tight abdominal binder and elevate the head of bed", "Administer IV pain medication and prepare for wound culture"],
    correctIndex: 1,
    answer: "Evisceration (protrusion of abdominal organs through the surgical incision) is a surgical emergency. The nurse should cover the exposed organs with a large sterile dressing moistened with sterile normal saline to prevent tissue desiccation and infection. The surgeon must be notified immediately for emergency surgical closure. Never push organs back into the abdomen as this risks contamination and organ damage. Place the client in low Fowler's position with knees bent to reduce abdominal tension.",
    category: "Perioperative",
    difficulty: 3
  },
  {
    id: "rn-periop-q5",
    type: "question",
    question: "A preoperative nurse is reviewing a client's medication list. The client takes warfarin daily. Which action should the nurse take?",
    options: ["Administer the warfarin as scheduled on the morning of surgery", "Verify that the warfarin was discontinued as ordered (typically 5-7 days before surgery) and check the INR", "Hold the warfarin only on the day of surgery", "Switch the client to aspirin on the morning of surgery"],
    correctIndex: 1,
    answer: "Warfarin must typically be discontinued 5-7 days before elective surgery to allow the INR to normalize (below 1.5 for most procedures) and reduce bleeding risk. The nurse should verify the medication was held as ordered and check the INR level. Administering warfarin on the day of surgery increases hemorrhage risk. Holding only one day is insufficient as warfarin has a long half-life (36-42 hours). Aspirin also impairs platelet function and is not a substitute. Some clients may need bridging with heparin, per provider orders.",
    category: "Perioperative",
    difficulty: 2
  },
  {
    id: "rn-periop-q6",
    type: "question",
    question: "A post-operative client has a Jackson-Pratt (JP) drain in place. The nurse notes the drainage has changed from serosanguineous to bright red, and the bulb is filling rapidly. What should the nurse do?",
    options: ["Empty the drain and recompress the bulb as routine", "Document the drainage and continue monitoring every 8 hours", "Notify the surgeon immediately as this may indicate hemorrhage", "Remove the drain and apply a pressure dressing"],
    correctIndex: 2,
    answer: "A sudden change to bright red drainage that fills the JP drain bulb rapidly is suggestive of active hemorrhage at the surgical site. This requires immediate notification of the surgeon for evaluation and potential return to the operating room. Routine emptying and documentation are insufficient responses to this acute change. The nurse should never remove a drain without a provider order. The nurse should also assess vital signs for signs of hypovolemic shock (tachycardia, hypotension).",
    category: "Perioperative",
    difficulty: 2
  },
  {
    id: "rn-periop-q7",
    type: "question",
    question: "Which preoperative assessment finding should the nurse report to the anesthesiologist before proceeding with surgery?",
    options: ["Blood pressure of 128/78 mmHg", "History of seasonal allergies to pollen", "Client reports drinking herbal supplement St. John's Wort daily", "Client last ate a light meal 10 hours ago"],
    correctIndex: 2,
    answer: "St. John's Wort can interact with anesthetic agents, causing prolonged sedation, serotonin syndrome, and altered drug metabolism through CYP450 enzyme induction. It should be discontinued 2-3 weeks before surgery. The anesthesiologist must be notified to adjust the anesthetic plan. The blood pressure is within normal range. Pollen allergies are not directly relevant to anesthesia (latex or medication allergies would be). NPO for 10 hours after a light meal meets fasting guidelines.",
    category: "Perioperative",
    difficulty: 3
  },
  {
    id: "rn-periop-q8",
    type: "question",
    question: "A nurse is counting surgical sponges before wound closure. The count reveals one sponge is missing. What is the appropriate action?",
    options: ["Close the wound and obtain a post-operative X-ray", "Repeat the count, search the field, and notify the surgeon before closure", "Document the missing sponge and continue with the procedure", "Ask the scrub technician to account for the sponge after surgery"],
    correctIndex: 1,
    answer: "An incorrect surgical count is a never event. The nurse must immediately stop the closure process, repeat the count, thoroughly search the surgical field, drapes, linen, and trash, and notify the surgeon. An intraoperative X-ray may be obtained to locate a retained sponge if the count cannot be reconciled. Closing the wound with a potentially retained sponge places the client at risk for infection, abscess, and additional surgery. This must be resolved before wound closure.",
    category: "Perioperative",
    difficulty: 2
  },
  {
    id: "rn-periop-q9",
    type: "question",
    question: "A client in the PACU is shivering and has a temperature of 95.5°F (35.3°C). What is the MOST appropriate nursing intervention?",
    options: ["Administer meperidine (Demerol) 25 mg IV as ordered for post-anesthetic shivering", "Apply warm blankets only and continue monitoring", "Initiate rapid rewarming with a heating pad directly on the skin", "Administer IV acetaminophen for temperature regulation"],
    correctIndex: 0,
    answer: "Post-anesthetic shivering is common and can increase oxygen consumption by 200-400%, placing stress on the cardiovascular and respiratory systems. Meperidine (Demerol) in low doses is the most effective pharmacological treatment for post-anesthetic shivering and is commonly ordered in PACU protocols. Warm blankets (forced-air warming devices like Bair Hugger) are also used but may not stop shivering quickly enough. Direct heating pads risk burns on anesthetized skin. Acetaminophen treats fever, not hypothermia-related shivering.",
    category: "Perioperative",
    difficulty: 3
  },
  {
    id: "rn-periop-q10",
    type: "question",
    question: "A post-operative client has not voided for 8 hours. The nurse palpates a distended, firm bladder above the symphysis pubis. What is the priority intervention?",
    options: ["Encourage the client to drink more fluids", "Perform a bladder scan and catheterize if volume exceeds 300-400 mL per protocol", "Wait until 12 hours post-op before intervening", "Apply warm compresses to the lower abdomen and wait"],
    correctIndex: 1,
    answer: "Urinary retention is common post-operatively due to anesthetic effects on bladder smooth muscle and the detrusor muscle. A palpable, distended bladder with inability to void for 8 hours requires bladder scanning to confirm volume. If volume exceeds 300-400 mL (per facility protocol), straight catheterization is indicated to prevent bladder overdistension, which can cause permanent damage. Conservative measures (running water, warm compresses) can be tried briefly but should not delay catheterization when retention is confirmed.",
    category: "Perioperative",
    difficulty: 2
  },
  {
    id: "rn-periop-q11",
    type: "question",
    question: "A nurse is performing a surgical time-out. Which elements are essential to verify? Select the BEST answer.",
    options: ["Client's insurance information, surgeon's schedule, and OR room number", "Correct client identity, correct surgical site and side, correct procedure, and relevant imaging displayed", "Anesthesia type, estimated blood loss, and post-operative bed assignment", "Client's advance directive status, pharmacy formulary, and discharge plan"],
    correctIndex: 1,
    answer: "The surgical time-out (per The Joint Commission Universal Protocol) requires verification of correct client identity, correct surgical site/side (confirmed with site marking), correct procedure, relevant imaging/test results, and any applicable implants or special requirements. This prevents wrong-site, wrong-procedure, and wrong-patient surgical errors. Insurance information, scheduling, bed assignments, and formulary status are administrative details not part of the safety time-out. All team members must participate and agree before the incision.",
    category: "Perioperative",
    difficulty: 2
  },
  {
    id: "rn-periop-q12",
    type: "question",
    question: "A client with a surgical wound has redness, warmth, purulent drainage, and a temperature of 101.8°F (38.8°C) on post-op day 4. What does the nurse suspect?",
    options: ["Normal inflammatory response to surgical healing", "Surgical site infection (SSI)", "Allergic reaction to suture material", "Hematoma formation under the incision"],
    correctIndex: 1,
    answer: "Purulent drainage, erythema, warmth, and fever developing on post-op day 3-5 are classic signs of surgical site infection (SSI). The normal inflammatory response occurs in the first 24-48 hours and does not produce purulent drainage. The nurse should obtain a wound culture as ordered, monitor vital signs, and prepare for possible antibiotic therapy. Allergic reactions to sutures typically present with localized reaction without purulence. Hematomas present as firm, discolored swelling without purulent drainage.",
    category: "Perioperative",
    difficulty: 2
  },
  {
    id: "rn-periop-q13",
    type: "question",
    question: "A nurse is preparing a client for surgery. The client states they have a latex allergy. Which fruit allergies should the nurse also assess for due to cross-reactivity?",
    options: ["Apples, grapes, and blueberries", "Bananas, avocados, kiwi, and chestnuts", "Oranges, lemons, and grapefruit", "Strawberries, watermelon, and pineapple"],
    correctIndex: 1,
    answer: "Latex allergy has well-documented cross-reactivity with certain tropical fruits including bananas, avocados, kiwi, and chestnuts due to shared proteins (chitinases). Clients with latex allergy who consume these foods may experience anaphylaxis. The OR team must use non-latex gloves, equipment, and supplies. Citrus fruits, berries, and other fruits listed are not significantly cross-reactive with latex. All members of the surgical team must be notified of the latex allergy.",
    category: "Perioperative",
    difficulty: 2
  },
  {
    id: "rn-periop-q14",
    type: "question",
    question: "A post-operative client on a patient-controlled analgesia (PCA) pump with morphine has a respiratory rate of 8 breaths per minute and is difficult to arouse. What is the priority action?",
    options: ["Turn off the PCA pump and administer naloxone (Narcan) as ordered", "Reduce the PCA dose and continue monitoring", "Administer oxygen via nasal cannula and reassess in 15 minutes", "Stimulate the client by calling their name and rubbing the sternum"],
    correctIndex: 0,
    answer: "Respiratory rate below 10 with excessive sedation indicates opioid overdose requiring immediate intervention. The nurse must stop the PCA pump to prevent further opioid delivery and administer naloxone (Narcan), the opioid antagonist, as ordered. Naloxone reverses respiratory depression within 1-2 minutes IV. Simply reducing the dose or adding oxygen does not address the acute respiratory depression. Sternal rub may temporarily arouse the client but does not treat the underlying opioid toxicity. Continue monitoring respiratory status as naloxone has a shorter half-life than morphine.",
    category: "Perioperative",
    difficulty: 3
  },
  {
    id: "rn-periop-q15",
    type: "question",
    question: "A client is scheduled for surgery at 0800. At 0600, the client reports taking a sip of water to swallow their blood pressure medication. What should the nurse do?",
    options: ["Cancel the surgery immediately", "Notify the anesthesiologist and document the intake", "Proceed with surgery as planned since a sip of water is insignificant", "Induce vomiting to empty the stomach"],
    correctIndex: 1,
    answer: "Current ASA (American Society of Anesthesiologists) fasting guidelines allow clear liquids up to 2 hours before elective surgery. A sip of water with an essential medication (such as an antihypertensive) is generally acceptable. However, the nurse must notify the anesthesiologist so they can assess the situation and make an informed decision about proceeding. The nurse should document the intake accurately. Canceling surgery is premature, and inducing vomiting creates aspiration risk. Essential cardiac and blood pressure medications are often continued with a sip of water per provider orders.",
    category: "Perioperative",
    difficulty: 2
  },
  // ============================================================
  // WOUND CARE (10 cards)
  // ============================================================
  {
    id: "rn-wound-q1",
    type: "question",
    question: "A nurse is staging a pressure injury and observes full-thickness tissue loss with visible subcutaneous fat, but bone, tendon, and muscle are not exposed. What stage is this pressure injury?",
    options: ["Stage 1", "Stage 2", "Stage 3", "Stage 4"],
    correctIndex: 2,
    answer: "Stage 3 pressure injuries involve full-thickness tissue loss where subcutaneous fat may be visible, but bone, tendon, and muscle are NOT exposed. Undermining and tunneling may be present. Stage 1 is intact skin with non-blanchable redness. Stage 2 involves partial-thickness skin loss presenting as a shallow open ulcer or blister. Stage 4 involves full-thickness tissue loss WITH exposed bone, tendon, or muscle. Unstageable injuries have the wound bed obscured by slough or eschar.",
    category: "Wound Care",
    difficulty: 2,
    image: illustrationPressureInjuryStagesV2
  },
  {
    id: "rn-wound-q2",
    type: "question",
    question: "A client with a large abdominal wound is being treated with negative pressure wound therapy (wound VAC). The nurse notes the seal has broken. What is the priority action?",
    options: ["Document the finding and wait for the wound care nurse", "Reapply the seal to maintain continuous negative pressure", "Remove the wound VAC and apply wet-to-dry dressings", "Irrigate the wound with normal saline before reapplying"],
    correctIndex: 1,
    answer: "A broken seal in wound VAC therapy disrupts the negative pressure, rendering the therapy ineffective. The nurse should reapply the seal immediately to restore continuous negative pressure, which promotes wound healing by removing excess exudate, reducing edema, promoting granulation tissue, and increasing blood flow. Waiting for the wound care nurse delays treatment. Removing the VAC and switching to wet-to-dry dressings requires a provider order. The wound should not be irrigated unnecessarily when the seal simply needs reapplication.",
    image: imgWoundVAC,
    category: "Wound Care",
    difficulty: 2
  },
  {
    id: "rn-wound-q3",
    type: "question",
    question: "A client is admitted with partial-thickness burns covering the entire anterior trunk and both arms. Using the Rule of Nines, what is the estimated total body surface area (TBSA) burned?",
    options: ["27%", "36%", "45%", "54%"],
    correctIndex: 1,
    answer: "Using the Rule of Nines for adults: the anterior trunk is 18%, and each arm is 9% (both arms = 18%). Total TBSA = 18% + 18% = 36%. This classification is important for fluid resuscitation calculations (Parkland formula: 4 mL × kg × %TBSA). Burns >20% TBSA in adults require IV fluid resuscitation. The posterior trunk is also 18%, each leg is 18%, the head is 9%, and the perineum is 1%. Accurate TBSA estimation guides treatment decisions.",
    category: "Wound Care",
    difficulty: 2
  },
  {
    id: "rn-wound-q4",
    type: "question",
    question: "A client with a deep wound has yellow, stringy tissue in the wound bed. The nurse documents this as which type of tissue?",
    options: ["Granulation tissue", "Epithelial tissue", "Slough (fibrinous tissue)", "Eschar"],
    correctIndex: 2,
    answer: "Slough is yellow, tan, or gray stringy/mucinous tissue that represents dead tissue in the wound bed. It must be removed (debrided) for wound healing to progress. Granulation tissue is beefy red, moist, and bumpy, indicating healthy wound healing. Epithelial tissue is pink/pearl and represents new skin growth from wound edges. Eschar is black or brown, hard, leathery necrotic tissue. The nurse should document the percentage of wound bed covered by each tissue type and collaborate with the wound care team for debridement.",
    category: "Wound Care",
    difficulty: 2
  },
  {
    id: "rn-wound-q5",
    type: "question",
    question: "A nurse is caring for a client with a skin graft donor site. Which assessment finding indicates a complication requiring intervention?",
    options: ["Pink, moist donor site with scant serous drainage", "Donor site covered with a transparent film dressing", "Foul-smelling purulent drainage and increasing erythema at the donor site", "Mild itching reported by the client at the healing donor site"],
    correctIndex: 2,
    answer: "Foul-smelling purulent drainage with erythema at the donor site indicates infection, which compromises healing and can spread systemically. The nurse should notify the provider, obtain wound cultures as ordered, and anticipate antibiotic therapy. Pink, moist tissue with serous drainage is a normal healing response. Transparent film dressings are appropriate for donor sites. Mild itching indicates healing. Donor site infection can also threaten the survival of the graft at the recipient site.",
    category: "Wound Care",
    difficulty: 2
  },
  {
    id: "rn-wound-q6",
    type: "question",
    question: "A client has a wound healing by secondary intention. The nurse measures the wound and notes it is 4 cm long, 2 cm wide, and 1.5 cm deep with tunneling at the 3 o'clock position extending 2 cm. How should the nurse document this?",
    options: ["Large wound with tunneling, needs surgical consult", "4 cm × 2 cm × 1.5 cm wound with 2 cm tunneling at 3 o'clock", "Open wound, healing well, moderate depth", "Approximately 5 cm wound with undermining noted"],
    correctIndex: 1,
    answer: "Wound documentation must be precise and include length (head to toe) × width (side to side) × depth, along with any tunneling or undermining described using clock position (12 o'clock = toward head, 6 o'clock = toward feet). Tunneling is a channel extending from the wound, while undermining is tissue destruction under intact wound edges. Subjective descriptions like 'large' or 'moderate' are not clinically useful. Accurate documentation enables tracking of wound healing progress and guides treatment decisions.",
    category: "Wound Care",
    difficulty: 2
  },
  {
    id: "rn-wound-q7",
    type: "question",
    question: "A client with major burns is being resuscitated using the Parkland formula. The client weighs 80 kg with 40% TBSA burns. How much IV lactated Ringer's solution should be administered in the first 8 hours?",
    options: ["3,200 mL", "6,400 mL", "12,800 mL", "9,600 mL"],
    correctIndex: 1,
    answer: "The Parkland formula is 4 mL × body weight (kg) × %TBSA burned = total fluid for first 24 hours. For this client: 4 × 80 × 40 = 12,800 mL total in 24 hours. Half of this amount (6,400 mL) is given in the first 8 hours from the time of the burn (not from hospital arrival), and the remaining half is given over the next 16 hours. Lactated Ringer's solution is the preferred crystalloid. Fluid resuscitation is guided by urine output (0.5-1 mL/kg/hr in adults).",
    category: "Wound Care",
    difficulty: 3
  },
  {
    id: "rn-wound-q8",
    type: "question",
    question: "A nurse is selecting a wound dressing for a wound with heavy exudate and a clean, granulating wound bed. Which dressing is MOST appropriate?",
    options: ["Hydrogel dressing", "Alginate dressing", "Transparent film dressing", "Dry gauze dressing"],
    correctIndex: 1,
    answer: "Alginate dressings are derived from seaweed and are highly absorbent, making them ideal for wounds with heavy exudate. They form a gel-like covering over the wound that maintains a moist environment while absorbing large amounts of drainage. Hydrogels donate moisture and are used for dry wounds. Transparent film dressings are for wounds with minimal exudate and are not absorbent. Dry gauze can adhere to the wound bed and damage granulation tissue upon removal. Matching the dressing to wound moisture level optimizes healing.",
    category: "Wound Care",
    difficulty: 2
  },
  {
    id: "rn-wound-q9",
    type: "question",
    question: "A client with circumferential full-thickness burns on the right forearm develops loss of radial pulse and increasing pain. What emergency procedure does the nurse anticipate?",
    options: ["Fasciotomy of the forearm", "Escharotomy of the burned tissue", "Skin grafting to the affected area", "Amputation of the forearm"],
    correctIndex: 1,
    answer: "Circumferential full-thickness burns create a constricting band of inelastic eschar that restricts blood flow as underlying tissue swells. Escharotomy is an emergency bedside incision through the eschar to release the constriction and restore circulation. Loss of pulses and increasing pain indicate vascular compromise requiring emergent intervention. Fasciotomy is for compartment syndrome in unburned tissue. Skin grafting is a later reconstructive procedure. Amputation is a last resort. Escharotomy does not require anesthesia because full-thickness burns destroy nerve endings.",
    category: "Wound Care",
    difficulty: 3,
    image: imgCompartmentSyndrome
  },
  {
    id: "rn-wound-q10",
    type: "question",
    question: "A nurse is performing wound irrigation. What is the recommended pressure for wound cleansing to remove debris without damaging granulation tissue?",
    options: ["1-2 psi using a bulb syringe", "4-15 psi using a 35 mL syringe with a 19-gauge angiocatheter", "25-30 psi using a high-pressure jet lavage", "No pressure; pour saline gently over the wound"],
    correctIndex: 1,
    answer: "The recommended irrigation pressure is 4-15 psi (pounds per square inch), achieved by using a 35 mL syringe with a 19-gauge angiocatheter or needle. This pressure is sufficient to remove bacteria and debris without damaging delicate granulation tissue. Pressure below 4 psi (bulb syringe) is insufficient for effective cleansing. Pressure above 15 psi can drive bacteria deeper into the wound and damage healthy tissue. Gentle pouring does not provide adequate mechanical cleansing force.",
    category: "Wound Care",
    difficulty: 3
  },
  // ============================================================
  // HEMATOLOGY/ONCOLOGY (10 cards)
  // ============================================================
  {
    id: "rn-hemonc-q1",
    type: "question",
    question: "A client receiving a blood transfusion develops fever, chills, flank pain, and dark urine 15 minutes after the transfusion began. What is the priority nursing action?",
    options: ["Slow the transfusion rate and administer acetaminophen", "Stop the transfusion immediately, maintain IV access with normal saline, and notify the provider", "Administer diphenhydramine and continue the transfusion", "Obtain a urine specimen and continue the transfusion at a slower rate"],
    correctIndex: 1,
    answer: "Fever, chills, flank pain, and dark urine (hemoglobinuria) are classic signs of an acute hemolytic transfusion reaction caused by ABO incompatibility. The transfusion must be stopped immediately. The IV line should be kept open with normal saline using new tubing. The provider and blood bank must be notified immediately. The nurse should send the blood bag, tubing, and blood/urine samples to the lab. This reaction can lead to DIC, renal failure, and death if not treated promptly. Never slow or continue a transfusion when hemolysis is suspected.",
    image: imgAcuteHemolyticReaction,
    category: "Hematology/Oncology",
    difficulty: 3
  },
  {
    id: "rn-hemonc-q2",
    type: "question",
    question: "A client with disseminated intravascular coagulation (DIC) has a platelet count of 22,000/mm³, elevated D-dimer, prolonged PT/INR, and bleeding from multiple sites. What treatment does the nurse anticipate?",
    options: ["Administer heparin to stop the clotting cascade", "Transfuse platelets, fresh frozen plasma, and cryoprecipitate as ordered while treating the underlying cause", "Administer vitamin K and protamine sulfate", "Apply pressure to bleeding sites only and await spontaneous resolution"],
    correctIndex: 1,
    answer: "DIC involves simultaneous widespread clotting and bleeding due to consumption of clotting factors and platelets. Treatment focuses on replacing consumed components (platelets, FFP for clotting factors, cryoprecipitate for fibrinogen) AND treating the underlying cause (sepsis, trauma, obstetric complications). Heparin may be used in some cases to interrupt the clotting cascade but is controversial and provider-dependent. Vitamin K and protamine are specific reversal agents, not DIC treatments. Waiting is dangerous with active hemorrhage.",
    category: "Hematology/Oncology",
    difficulty: 3,
    image: imgDIC
  },
  {
    id: "rn-hemonc-q3",
    type: "question",
    question: "A client receiving chemotherapy has a white blood cell count of 1,200/mm³ with an absolute neutrophil count (ANC) of 400/mm³. Which precaution is MOST important?",
    options: ["Maintain strict hand hygiene and implement neutropenic precautions", "Administer live vaccines to boost the immune system", "Place the client on contact isolation for C. difficile", "Allow fresh flowers and raw fruits in the client's room"],
    correctIndex: 0,
    answer: "An ANC below 500/mm³ indicates severe neutropenia with high infection risk. Neutropenic precautions include strict hand hygiene (most important), private room, avoiding fresh flowers/plants (harbor Aspergillus), avoiding raw/uncooked foods, no rectal temperatures, and monitoring for subtle signs of infection (neutropenic clients may not mount a typical fever/WBC response). Live vaccines are absolutely contraindicated in immunosuppressed clients. Contact isolation is for specific infections, not neutropenia.",
    category: "Hematology/Oncology",
    difficulty: 2
  },
  {
    id: "rn-hemonc-q4",
    type: "question",
    question: "A client with leukemia develops tumor lysis syndrome (TLS) after starting chemotherapy. Which lab values does the nurse expect to find?",
    options: ["Low potassium, low phosphorus, high calcium", "High potassium, high phosphorus, high uric acid, low calcium", "Normal potassium, high sodium, low magnesium", "Low potassium, low uric acid, high calcium"],
    correctIndex: 1,
    answer: "Tumor lysis syndrome occurs when massive cancer cell destruction releases intracellular contents into the bloodstream, causing hyperkalemia (potassium released from cells), hyperphosphatemia (phosphorus released from cells), hyperuricemia (purine breakdown to uric acid), and hypocalcemia (calcium binds to excess phosphorus). These electrolyte derangements can cause fatal cardiac arrhythmias, acute kidney injury, and seizures. Treatment includes aggressive IV hydration, allopurinol or rasburicase, and electrolyte management. TLS is most common with hematologic malignancies.",
    category: "Hematology/Oncology",
    difficulty: 3,
    image: imgLeukemia
  },
  {
    id: "rn-hemonc-q5",
    type: "question",
    question: "A nurse suspects chemotherapy extravasation when the client reports burning pain at the IV site and the nurse observes swelling. What is the priority action?",
    options: ["Apply warm compresses and increase the IV flow rate", "Stop the infusion immediately, aspirate residual drug, and notify the oncologist", "Flush the line with normal saline to dilute the medication", "Continue the infusion and elevate the extremity"],
    correctIndex: 1,
    answer: "Chemotherapy extravasation (leakage of vesicant drug into surrounding tissue) can cause severe tissue necrosis. The nurse must immediately stop the infusion, aspirate any residual drug from the catheter before removing it, and notify the oncologist. Specific antidotes may be required (e.g., dexrazoxane for anthracycline extravasation, hyaluronidase for vinca alkaloids). Never flush the line as this pushes more drug into the tissue. Warm or cold compresses depend on the specific agent. Document the event thoroughly and follow facility extravasation protocol.",
    category: "Hematology/Oncology",
    difficulty: 3
  },
  {
    id: "rn-hemonc-q6",
    type: "question",
    question: "A client is receiving a platelet transfusion. Which assessment finding indicates the transfusion is effective?",
    options: ["Increased bleeding time", "Decreased platelet count on follow-up CBC", "Cessation of petechiae and decreased oozing from mucous membranes", "Increased prothrombin time (PT)"],
    correctIndex: 2,
    answer: "Effective platelet transfusion is evidenced by clinical improvement: cessation of petechiae, decreased bleeding/oozing, and a rising platelet count on post-transfusion CBC. Bleeding time should decrease (not increase) as platelet function improves. A decreased platelet count would indicate ineffectiveness or refractoriness. PT measures coagulation factor function, not platelet activity; PT is corrected by FFP, not platelets. One unit of platelets typically raises the count by 5,000-10,000/mm³.",
    category: "Hematology/Oncology",
    difficulty: 2
  },
  {
    id: "rn-hemonc-q7",
    type: "question",
    question: "A client with cancer reports fatigue, pallor, and dyspnea on exertion. Hemoglobin is 7.2 g/dL. The provider orders packed red blood cells (PRBCs). What is the correct administration procedure?",
    options: ["Infuse PRBCs through a standard IV set with dextrose solution", "Infuse PRBCs through a blood administration set with normal saline, complete within 4 hours", "Infuse PRBCs rapidly over 30 minutes to correct anemia quickly", "Infuse PRBCs with lactated Ringer's solution using a microdrip set"],
    correctIndex: 1,
    answer: "PRBCs must be administered through a blood administration set with a 170-260 micron filter, using only normal saline (0.9% NaCl) as the compatible solution. Dextrose causes red blood cell hemolysis, and lactated Ringer's contains calcium which can cause clotting. Each unit must be completed within 4 hours to reduce bacterial contamination risk. Rapid infusion can cause fluid overload and transfusion-associated circulatory overload (TACO). Vital signs should be monitored before, during (15 minutes), and after the transfusion.",
    category: "Hematology/Oncology",
    difficulty: 2
  },
  {
    id: "rn-hemonc-q8",
    type: "question",
    question: "A client receiving chemotherapy asks why they need to have blood drawn before each treatment cycle. What is the BEST nursing response?",
    options: ["It is hospital policy to check labs on all clients", "Blood work checks if your bone marrow is recovering enough to safely receive the next treatment", "We need to check your blood sugar before chemotherapy", "It helps us schedule your appointments more efficiently"],
    correctIndex: 1,
    answer: "Pre-chemotherapy labs (CBC with differential, metabolic panel, liver/kidney function) are essential to ensure the client's bone marrow has recovered sufficiently (adequate WBC, ANC, platelet, and hemoglobin levels) to safely tolerate the next cycle. If counts are too low (nadir), treatment may be delayed or doses adjusted to prevent life-threatening myelosuppression. This is a critical safety measure, not just policy. The nurse should explain in understandable terms to promote informed participation in care.",
    category: "Hematology/Oncology",
    difficulty: 2
  },
  {
    id: "rn-hemonc-q9",
    type: "question",
    question: "A nurse is caring for a client with sickle cell disease experiencing a vaso-occlusive crisis. Which intervention is the HIGHEST priority?",
    options: ["Restrict fluid intake to prevent fluid overload", "Administer aggressive IV hydration and pain management", "Apply cold compresses to painful areas", "Encourage ambulation to prevent DVT"],
    correctIndex: 1,
    answer: "Vaso-occlusive (pain) crisis occurs when sickled red blood cells clump and obstruct blood flow, causing ischemia and severe pain. Priority interventions include aggressive IV hydration (to reduce blood viscosity and promote circulation), effective pain management (often requiring IV opioids), oxygen supplementation (to prevent further sickling), and rest. Fluid restriction worsens sickling. Cold compresses cause vasoconstriction which worsens the crisis; warm compresses may be used. Ambulation during acute crisis increases pain and oxygen demand.",
    image: imgSickleCellCrisis,
    category: "Hematology/Oncology",
    difficulty: 2
  },
  {
    id: "rn-hemonc-q10",
    type: "question",
    question: "A client with Hodgkin lymphoma is scheduled for radiation therapy to the chest. Which side effect should the nurse teach the client to expect?",
    options: ["Hair loss on the scalp", "Esophagitis and sore throat", "Peripheral neuropathy in the feet", "Diarrhea and abdominal cramping"],
    correctIndex: 1,
    answer: "Radiation side effects are local to the treatment field. Chest/mediastinal radiation affects the esophagus, causing esophagitis, dysphagia, and sore throat. Hair loss occurs only in the irradiated area (chest hair, not scalp). Peripheral neuropathy is a chemotherapy side effect (e.g., vincristine, cisplatin), not radiation. Diarrhea occurs with abdominal/pelvic radiation, not chest radiation. Other chest radiation effects include pneumonitis, cough, and skin changes in the treatment field. Teaching clients about site-specific effects promotes self-management.",
    category: "Hematology/Oncology",
    difficulty: 2
  },
  // ============================================================
  // COMMUNITY/PUBLIC HEALTH (10 cards)
  // ============================================================
  {
    id: "rn-commhealth-q1",
    type: "question",
    question: "A community health nurse receives a report of three confirmed cases of measles in a school. What is the nurse's FIRST action?",
    options: ["Close the school immediately for deep cleaning", "Identify and contact all exposed individuals for post-exposure prophylaxis evaluation", "Administer antibiotics to all students prophylactically", "Wait for additional cases to confirm an outbreak"],
    correctIndex: 1,
    answer: "The first action in outbreak investigation is case identification and contact tracing. The nurse must identify all exposed individuals to determine who needs post-exposure prophylaxis (MMR vaccine within 72 hours or immune globulin within 6 days of exposure). Measles is highly contagious (airborne transmission). Closing the school may be necessary but contact tracing is the immediate priority. Antibiotics are ineffective against viruses. Waiting for more cases delays containment and allows further spread. The nurse must also report to the local health department.",
    category: "Community/Public Health",
    difficulty: 2,
    image: imgMeasles
  },
  {
    id: "rn-commhealth-q2",
    type: "question",
    question: "A nurse is performing tuberculosis (TB) screening. A client's Mantoux tuberculin skin test (TST) shows 12 mm of induration at 48 hours. The client has no known risk factors. How does the nurse interpret this result?",
    options: ["Positive result; the client has active TB disease", "Negative result; only reactions of 15 mm or greater are positive in clients with no risk factors", "Positive result; the client needs further evaluation with chest X-ray", "Inconclusive; repeat the test in 2 weeks"],
    correctIndex: 1,
    answer: "TST interpretation depends on risk category. Induration of 5 mm or greater is positive for HIV-positive clients, recent TB contacts, and immunosuppressed clients. Induration of 10 mm or greater is positive for healthcare workers, recent immigrants, and certain high-risk groups. Induration of 15 mm or greater is positive for persons with no known risk factors. This client has 12 mm with no risk factors, which falls below the 15 mm threshold and is therefore interpreted as negative. A positive TST indicates TB exposure, not necessarily active disease. If the result had been positive, a chest X-ray would be the next step to evaluate for active TB.",
    category: "Community/Public Health",
    difficulty: 3
  },
  {
    id: "rn-commhealth-q3",
    type: "question",
    question: "A nurse is providing immunization teaching to parents of a 2-month-old infant. Which vaccines are recommended at this well-child visit?",
    options: ["MMR, varicella, and hepatitis A", "DTaP, IPV, Hib, PCV13, rotavirus, and hepatitis B (2nd dose)", "Only hepatitis B (3rd dose)", "Influenza and meningococcal vaccines only"],
    correctIndex: 1,
    answer: "At 2 months of age, the CDC immunization schedule recommends: DTaP (diphtheria, tetanus, pertussis), IPV (inactivated polio), Hib (Haemophilus influenzae type b), PCV13 (pneumococcal conjugate), rotavirus (oral), and hepatitis B (2nd dose if not yet given). MMR and varicella are given at 12-15 months. Hepatitis A starts at 12 months. Influenza is given starting at 6 months. Meningococcal vaccine is given at 11-12 years. The nurse should educate parents about expected side effects and when to seek medical attention.",
    category: "Community/Public Health",
    difficulty: 2
  },
  {
    id: "rn-commhealth-q4",
    type: "question",
    question: "During a community disaster, a nurse uses START triage. A victim is not breathing after repositioning the airway. What triage tag color is assigned?",
    options: ["Red (immediate)", "Yellow (delayed)", "Green (minor)", "Black (expectant/deceased)"],
    correctIndex: 3,
    answer: "In START (Simple Triage and Rapid Treatment) triage, if a victim is not breathing even after repositioning the airway (opening the airway with a head tilt-chin lift or jaw thrust), the victim is tagged BLACK (expectant/deceased). In mass casualty situations, resources are allocated to save the most lives, so individuals who are not breathing despite basic airway intervention are classified as unsalvageable. RED is for immediate life threats that are salvageable. YELLOW is delayed but serious. GREEN is for walking wounded with minor injuries.",
    category: "Community/Public Health",
    difficulty: 2
  },
  {
    id: "rn-commhealth-q5",
    type: "question",
    question: "A nurse suspects child abuse when examining a 3-year-old with bruises in various stages of healing on the buttocks and back. What is the nurse's legal obligation?",
    options: ["Confront the parent and ask for an explanation first", "Document the findings and report to Child Protective Services (CPS) immediately", "Wait for the physician to confirm abuse before reporting", "Contact law enforcement only if the child discloses abuse"],
    correctIndex: 1,
    answer: "Nurses are mandated reporters by law and must report suspected child abuse immediately to Child Protective Services (CPS) or the appropriate reporting agency. The nurse does not need to confirm abuse; reasonable suspicion is sufficient. Bruises in various healing stages on non-bony prominences (buttocks, back) in a young child are highly suspicious for non-accidental trauma. The nurse should document findings objectively (size, color, location of bruises) and not confront the parent, as this may endanger the child further. Waiting for physician confirmation or disclosure delays protection.",
    category: "Community/Public Health",
    difficulty: 2
  },
  {
    id: "rn-commhealth-q6",
    type: "question",
    question: "A public health nurse is planning a disease prevention program. Which activity represents PRIMARY prevention?",
    options: ["Screening for hypertension at a community health fair", "Providing immunizations at a flu vaccine clinic", "Rehabilitating a stroke client to regain mobility", "Performing mammography screening for breast cancer"],
    correctIndex: 1,
    answer: "Primary prevention aims to prevent disease BEFORE it occurs through health promotion and disease prevention activities. Immunizations prevent infectious diseases from developing. Screening (hypertension, mammography) is secondary prevention, which aims to detect disease early for prompt treatment. Rehabilitation is tertiary prevention, which aims to restore function and prevent complications after disease has occurred. Other primary prevention examples include health education, seatbelt use, nutrition counseling, and exercise promotion.",
    category: "Community/Public Health",
    difficulty: 2,
    image: imgLeadPoisoning
  },
  {
    id: "rn-commhealth-q7",
    type: "question",
    question: "A nurse is teaching a community group about lead poisoning prevention. Which children are at HIGHEST risk?",
    options: ["Children who live in homes built after 2000", "Children ages 1-5 who live in homes built before 1978 with peeling paint", "Teenagers who consume processed foods", "Infants who are exclusively breastfed"],
    correctIndex: 1,
    answer: "Children ages 1-5 are at highest risk for lead poisoning due to hand-to-mouth behavior and developing neurological systems. Homes built before 1978 may contain lead-based paint (banned in the US in 1978). Peeling paint produces lead-contaminated dust and paint chips that children ingest. Lead causes irreversible neurodevelopmental damage including cognitive impairment, behavioral problems, and learning disabilities. Screening blood lead levels are recommended for at-risk children. Lead exposure can also occur through contaminated water, soil, and imported toys or ceramics.",
    category: "Community/Public Health",
    difficulty: 2,
    image: imgLeadPoisoning
  },
  {
    id: "rn-commhealth-q8",
    type: "question",
    question: "A nurse is managing a client with active pulmonary TB on directly observed therapy (DOT). What does DOT involve?",
    options: ["The client self-administers medication and reports compliance weekly", "A healthcare worker watches the client swallow each dose of medication", "The client receives monthly injections of TB medication at the clinic", "The client's family members administer and document the medication"],
    correctIndex: 1,
    answer: "Directly Observed Therapy (DOT) requires a healthcare worker to physically watch the client swallow each dose of anti-TB medication. This strategy ensures compliance with the lengthy treatment regimen (typically 6-9 months of multiple drugs: isoniazid, rifampin, pyrazinamide, ethambutol). Non-adherence leads to treatment failure and development of multidrug-resistant TB (MDR-TB), a major public health threat. DOT is the WHO-recommended standard of care for TB treatment. Self-reporting is unreliable for ensuring compliance.",
    category: "Community/Public Health",
    difficulty: 2
  },
  {
    id: "rn-commhealth-q9",
    type: "question",
    question: "A home health nurse visits an elderly client and finds expired medications, spoiled food, and the client appears underweight and unkempt. The client lives with an adult child. What should the nurse do?",
    options: ["Clean the home and organize the medications for the client", "Report suspected elder neglect to Adult Protective Services (APS)", "Speak to the adult child and ask them to improve care", "Schedule more frequent nursing visits and monitor the situation"],
    correctIndex: 1,
    answer: "The findings of expired medications, spoiled food, malnutrition, and poor hygiene in an elderly client living with a caregiver are indicators of elder neglect, a form of elder abuse. Nurses are mandated reporters and must report suspected elder abuse or neglect to Adult Protective Services (APS) immediately. The nurse should document objective findings, not confront the caregiver (which may escalate the situation), and ensure the client's immediate safety needs are addressed. Simply monitoring or cleaning does not fulfill the legal obligation to report.",
    category: "Community/Public Health",
    difficulty: 2
  },
  {
    id: "rn-commhealth-q10",
    type: "question",
    question: "A public health nurse is developing an emergency preparedness plan for a bioterrorism event involving anthrax exposure. Which prophylactic medication should be available for exposed individuals?",
    options: ["Oseltamivir (Tamiflu)", "Ciprofloxacin or doxycycline", "Acyclovir", "Metronidazole"],
    correctIndex: 1,
    answer: "Ciprofloxacin (fluoroquinolone) or doxycycline (tetracycline) are the recommended prophylactic antibiotics for anthrax exposure (Bacillus anthracis). Post-exposure prophylaxis should begin immediately and continue for 60 days. Oseltamivir is an antiviral for influenza. Acyclovir treats herpes viruses. Metronidazole treats anaerobic bacterial and protozoal infections. The Strategic National Stockpile maintains supplies of these antibiotics for bioterrorism response. The anthrax vaccine may also be administered as part of post-exposure prophylaxis.",
    category: "Community/Public Health",
    difficulty: 3
  },
  // ============================================================
  // INTEGUMENTARY (10 cards)
  // ============================================================
  {
    id: "rn-integ-q1",
    type: "question",
    question: "A client develops widespread erythema, blistering of the skin and mucous membranes, and desquamation after starting a new medication. The nurse suspects Stevens-Johnson syndrome (SJS). What is the priority intervention?",
    options: ["Apply topical corticosteroids to all affected areas", "Discontinue the offending medication immediately and notify the provider", "Administer oral antihistamines and monitor for improvement", "Apply adhesive bandages to ruptured blisters"],
    correctIndex: 1,
    answer: "Stevens-Johnson syndrome is a severe, potentially life-threatening hypersensitivity reaction often triggered by medications (sulfonamides, anticonvulsants, allopurinol, NSAIDs, antibiotics). The priority is immediate discontinuation of the suspected causative drug. SJS affects less than 10% of body surface area; toxic epidermal necrolysis (TEN) affects more than 30%. Treatment is primarily supportive (similar to burn care): fluid resuscitation, wound care, pain management, and prevention of infection. Transfer to a burn unit may be required. Mortality ranges from 5-30%.",
    image: imgStevensJohnson,
    category: "Integumentary",
    difficulty: 3
  },
  {
    id: "rn-integ-q2",
    type: "question",
    question: "A nurse is assessing a client with suspected cellulitis on the lower leg. Which assessment findings support this diagnosis?",
    options: ["Well-demarcated, raised, red borders with a clear center", "Diffuse redness, warmth, swelling, and tenderness that spreads outward from the center", "Circular rash with central clearing (bull's-eye appearance)", "Small, painless vesicles in a linear pattern"],
    correctIndex: 1,
    answer: "Cellulitis is a bacterial skin infection (usually Staphylococcus or Streptococcus) presenting with diffuse erythema, warmth, edema, and tenderness that spreads outward without well-defined borders. It typically affects the lower extremities. Well-demarcated raised borders suggest erysipelas (a superficial cellulitis). Bull's-eye rash (erythema migrans) is characteristic of Lyme disease. Linear vesicles suggest contact dermatitis (such as poison ivy). Treatment includes systemic antibiotics, elevation, and monitoring for systemic infection signs.",
    category: "Integumentary",
    difficulty: 2,
    image: imgCellulitis
  },
  {
    id: "rn-integ-q3",
    type: "question",
    question: "A client presents with a painful, vesicular rash in a dermatomal distribution on the right thorax. The client reports a history of chickenpox as a child. What condition does the nurse suspect?",
    options: ["Contact dermatitis", "Herpes simplex type 1", "Herpes zoster (shingles)", "Impetigo"],
    correctIndex: 2,
    answer: "Herpes zoster (shingles) is caused by reactivation of the varicella-zoster virus (VZV) that has remained dormant in dorsal root ganglia after primary chickenpox infection. It presents as a painful, vesicular rash following a single dermatome (does not cross midline). The thoracic dermatomes are most commonly affected. Contact dermatitis is caused by irritants or allergens. Herpes simplex typically affects the mouth or genitals. Impetigo causes honey-crusted lesions. Treatment includes antivirals (acyclovir, valacyclovir) ideally within 72 hours of rash onset. Airborne and contact precautions are needed.",
    category: "Integumentary",
    difficulty: 2,
    image: imgImpetigo
  },
  {
    id: "rn-integ-q4",
    type: "question",
    question: "A nurse is teaching a client about skin self-examination for melanoma. Which mnemonic helps identify suspicious moles?",
    options: ["FAST (Face, Arms, Speech, Time)", "ABCDE (Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving)", "PQRST (Provokes, Quality, Region, Severity, Time)", "RACE (Rescue, Activate, Contain, Extinguish)"],
    correctIndex: 1,
    answer: "The ABCDE mnemonic is used for melanoma assessment: Asymmetry (one half does not match the other), Border irregularity (edges are ragged or blurred), Color variation (multiple shades of brown, black, red, white, or blue), Diameter greater than 6 mm (pencil eraser size), and Evolving (changing in size, shape, or color over time). Any lesion meeting these criteria requires dermatologic evaluation and possible biopsy. Early detection significantly improves melanoma prognosis. The other mnemonics apply to stroke assessment (FAST), pain assessment (PQRST), and fire safety (RACE).",
    category: "Integumentary",
    difficulty: 2
  },
  {
    id: "rn-integ-q5",
    type: "question",
    question: "A client with eczema (atopic dermatitis) asks the nurse about managing flare-ups. Which instruction is MOST appropriate?",
    options: ["Take long, hot showers to soothe the itching", "Apply topical corticosteroids as prescribed and use fragrance-free emollients daily", "Wear wool clothing to keep skin warm and dry", "Scrub the affected areas vigorously to remove scales"],
    correctIndex: 1,
    answer: "Management of atopic dermatitis includes topical corticosteroids to reduce inflammation during flares and daily application of fragrance-free emollients to maintain the skin moisture barrier. Hot showers strip natural oils and worsen dryness and itching. Wool and synthetic fabrics irritate eczematous skin; soft cotton is preferred. Vigorous scrubbing damages the compromised skin barrier and triggers more inflammation. Other recommendations include avoiding known triggers (allergens, stress), lukewarm baths, patting skin dry, and applying moisturizer within 3 minutes of bathing.",
    image: imgAtopicDermatitis,
    category: "Integumentary",
    difficulty: 2
  },
  {
    id: "rn-integ-q6",
    type: "question",
    question: "A nurse is assessing a client with contact dermatitis from poison ivy. Which characteristic finding does the nurse expect?",
    options: ["Symmetrical, scaling plaques on extensor surfaces", "Linear vesicular eruption in the pattern of plant contact with intense pruritus", "Honey-colored crusted lesions on the face", "Deep, painful nodules under the skin without surface changes"],
    correctIndex: 1,
    answer: "Allergic contact dermatitis from poison ivy (urushiol oil) presents with intensely pruritic, linear or streaky vesicular eruptions in the pattern where the plant contacted the skin. It is a type IV delayed hypersensitivity reaction occurring 24-72 hours after exposure. Symmetrical scaling plaques on extensor surfaces suggest psoriasis. Honey-colored crusts are characteristic of impetigo. Deep painful nodules suggest furuncles or cystic acne. Treatment includes removal of the allergen, cool compresses, topical corticosteroids, oral antihistamines, and systemic steroids for severe cases.",
    category: "Integumentary",
    difficulty: 2,
    image: imgImpetigo
  },
  {
    id: "rn-integ-q7",
    type: "question",
    question: "A client with psoriasis is prescribed methotrexate. Which laboratory test is essential to monitor during treatment?",
    options: ["Serum glucose levels", "Liver function tests (LFTs)", "Thyroid function tests", "Serum lipid panel"],
    correctIndex: 1,
    answer: "Methotrexate is hepatotoxic and can cause liver fibrosis and cirrhosis with long-term use. Regular monitoring of liver function tests (AST, ALT, albumin) is essential, along with CBC (methotrexate causes myelosuppression) and renal function tests (the drug is renally excreted). Baseline and periodic liver biopsies may be recommended for cumulative doses. Clients should avoid alcohol which compounds hepatotoxicity. Methotrexate is also teratogenic, so pregnancy must be avoided. Serum glucose, thyroid, and lipid panels are not primary monitoring targets for methotrexate.",
    category: "Integumentary",
    difficulty: 3
  },
  {
    id: "rn-integ-q8",
    type: "question",
    question: "A client presents with a skin lesion that has pearly, rolled borders with central ulceration and telangiectasia. What type of skin cancer does the nurse suspect?",
    options: ["Melanoma", "Basal cell carcinoma", "Squamous cell carcinoma", "Kaposi sarcoma"],
    correctIndex: 1,
    answer: "Basal cell carcinoma (BCC) is the most common skin cancer and classically presents with pearly, waxy, translucent nodules with rolled borders, central ulceration, and visible telangiectasia (small blood vessels). BCC is slow-growing and rarely metastasizes but causes local tissue destruction. It is most common on sun-exposed areas (face, ears, neck). Melanoma presents with asymmetric, multicolored lesions. Squamous cell carcinoma appears as scaly, red, crusted lesions. Kaposi sarcoma presents as purple/brown macules or plaques associated with HIV/AIDS.",
    category: "Integumentary",
    difficulty: 2,
    image: getAssetUrl("kaposisarcoma_1773517523349.png")
  },
  {
    id: "rn-integ-q9",
    type: "question",
    question: "A nurse is caring for a client with a full-thickness burn injury. Which phase of burn care focuses on fluid resuscitation and preventing hypovolemic shock?",
    options: ["Rehabilitation phase", "Emergent (resuscitative) phase", "Acute (wound healing) phase", "Pre-hospital phase"],
    correctIndex: 1,
    answer: "The emergent (resuscitative) phase begins at the time of injury and lasts 24-48 hours. The primary focus is fluid resuscitation to prevent hypovolemic shock caused by massive fluid shifts from the intravascular space to the interstitial space (third spacing). The Parkland formula guides fluid replacement. Other priorities include airway management, pain control, and preventing hypothermia. The acute phase follows and focuses on wound care, infection prevention, and nutritional support. The rehabilitation phase focuses on restoring function and preventing contractures.",
    category: "Integumentary",
    difficulty: 2
  },
  {
    id: "rn-integ-q10",
    type: "question",
    question: "A client is diagnosed with scabies. Which teaching point is essential for the nurse to include?",
    options: ["Only the client needs treatment; household members are not affected", "Apply permethrin cream from the neck down, leave on for 8-14 hours, and treat all close contacts simultaneously", "Scabies resolves on its own without treatment within a few days", "The client should take oral antifungal medication for 2 weeks"],
    correctIndex: 1,
    answer: "Scabies is caused by the Sarcoptes scabiei mite and is highly contagious through direct skin contact. Treatment involves applying permethrin 5% cream from the neck down (including under fingernails), leaving it on for 8-14 hours, then washing it off. All household members and close contacts must be treated simultaneously to prevent reinfestation. Bedding and clothing should be washed in hot water and dried on high heat. Itching may persist for 2-4 weeks after treatment due to residual hypersensitivity. Scabies requires treatment and does not resolve spontaneously. Antifungals are not effective.",
    category: "Integumentary",
    difficulty: 2,
    image: illustrationScabiesV2
  },
  // ============================================================
  // ETHICS/LEGAL (10 cards)
  // ============================================================
  {
    id: "rn-ethics-q1",
    type: "question",
    question: "A client with terminal cancer has a valid advance directive that specifies 'do not resuscitate' (DNR). The client's family insists that 'everything be done.' What should the nurse do?",
    options: ["Follow the family's wishes since they are present and the client cannot speak for themselves", "Follow the advance directive and notify the healthcare provider of the family's concerns", "Initiate CPR if the client codes since the family requests it", "Tell the family to get a lawyer to change the advance directive"],
    correctIndex: 1,
    answer: "A valid advance directive represents the client's autonomous wishes and takes legal precedence over family requests when the client cannot speak for themselves. The nurse must honor the DNR order while also providing supportive care and addressing the family's emotional needs. The nurse should notify the healthcare provider about the family's concerns so the provider can have a goals-of-care discussion with the family. Initiating CPR against a valid DNR violates the client's rights. A palliative care or ethics consult may help resolve the conflict.",
    category: "Ethics/Legal",
    difficulty: 3
  },
  {
    id: "rn-ethics-q2",
    type: "question",
    question: "A nurse receives a phone call from a client's employer asking about the client's diagnosis and expected return to work. What is the nurse's appropriate response?",
    options: ["Provide the diagnosis since the employer needs to plan for staffing", "Decline to confirm or deny that the person is a client, citing HIPAA privacy regulations", "Share only the expected return date but not the diagnosis", "Transfer the call to the physician to handle the inquiry"],
    correctIndex: 1,
    answer: "HIPAA (Health Insurance Portability and Accountability Act) prohibits disclosure of any protected health information (PHI) without the client's written authorization. This includes confirming or denying that someone is a client at the facility. The nurse cannot share any information—diagnosis, treatment, or expected return—with the employer. If the client has signed a specific release for their employer, then only the information specified in the release can be shared. The nurse should document the inquiry attempt and inform the client.",
    category: "Ethics/Legal",
    difficulty: 2
  },
  {
    id: "rn-ethics-q3",
    type: "question",
    question: "A client is found wandering in the hallway and attempting to leave the hospital against medical advice. The client is confused and has been deemed to lack decision-making capacity. What should the nurse do?",
    options: ["Allow the client to leave since all clients have the right to refuse treatment", "Apply bilateral wrist restraints immediately without a provider order", "Redirect the client back to bed, ensure safety, notify the provider, and document the assessment of impaired decision-making capacity", "Call security to physically remove the client from the hallway"],
    correctIndex: 2,
    answer: "A client who lacks decision-making capacity (due to confusion, altered mental status, delirium) cannot make informed decisions about leaving. The nurse should redirect the client to safety using the least restrictive intervention, notify the provider for a capacity evaluation and possible restraint order if necessary, ensure the environment is safe, and document the assessment findings. Restraints require a provider order and are used only as a last resort. Allowing an incapacitated client to leave poses a safety risk. Physical force by security should only be used in imminent danger situations.",
    category: "Ethics/Legal",
    difficulty: 3
  },
  {
    id: "rn-ethics-q4",
    type: "question",
    question: "A nurse must apply wrist restraints on an agitated client who is pulling at life-sustaining IV lines. Which action is correct regarding restraint use?",
    options: ["Apply the restraints and obtain a provider order within 24 hours", "Obtain a provider order, reassess the client every 1-2 hours, release restraints every 2 hours for circulation checks and ROM exercises", "Tie the restraints in a tight knot to the bed frame to prevent removal", "Apply restraints and leave them in place until the client is calm"],
    correctIndex: 1,
    answer: "Restraint use requires a provider order (cannot be a standing or PRN order) with specific time limits (4 hours for adults in non-behavioral situations). The nurse must assess the client every 1-2 hours (per facility policy) for circulation, sensation, movement, and skin integrity. Restraints should be released every 2 hours for circulation checks, ROM exercises, toileting, nutrition, and hydration. Restraints are tied with quick-release knots to the bed frame (not side rails) to allow rapid removal in emergencies. Continuous restraint use without reassessment and release violates patient safety standards.",
    category: "Ethics/Legal",
    difficulty: 2
  },
  {
    id: "rn-ethics-q5",
    type: "question",
    question: "A nurse is caring for a client who is brain dead and whose family has consented to organ donation. Which nursing action is appropriate?",
    options: ["Discontinue all life-sustaining measures immediately after brain death is declared", "Maintain hemodynamic stability and organ perfusion until organ procurement is coordinated", "Ask the family to select which organs they wish to donate", "Notify the funeral home before contacting the organ procurement organization"],
    correctIndex: 1,
    answer: "After brain death is declared and organ donation consent is obtained, the nurse must maintain hemodynamic stability (fluids, vasopressors, ventilator support) to preserve organ perfusion until the organ procurement organization (OPO) coordinates retrieval. The OPO manages all aspects of organ allocation and donor management. The family consents to donation but does not select specific organs; organ suitability is determined medically. The OPO must be notified before any cessation of life support. This is a time-sensitive process to preserve organ viability.",
    category: "Ethics/Legal",
    difficulty: 3
  },
  {
    id: "rn-ethics-q6",
    type: "question",
    question: "A nurse accidentally administers the wrong medication to a client. The client shows no adverse effects. What is the nurse's FIRST action?",
    options: ["Do not document the error since the client was not harmed", "Assess the client, notify the provider, complete an incident report, and document the event in the medical record", "Ask a colleague to help cover up the mistake", "Wait to see if the client develops any adverse effects before reporting"],
    correctIndex: 1,
    answer: "All medication errors must be reported regardless of whether harm occurred. The nurse should first assess the client for any adverse effects, then notify the healthcare provider immediately so appropriate monitoring or interventions can be ordered. An incident (occurrence) report must be completed per facility policy for quality improvement and risk management. The error and nursing actions taken should be documented factually in the medical record (but the incident report itself is not referenced in the chart). Concealing errors is unethical and potentially dangerous.",
    category: "Ethics/Legal",
    difficulty: 2
  },
  {
    id: "rn-ethics-q7",
    type: "question",
    question: "A 16-year-old client comes to the clinic requesting treatment for a sexually transmitted infection. The client asks the nurse not to tell their parents. What is the nurse's legal obligation?",
    options: ["Refuse to treat the minor without parental consent", "Treat the client confidentially since minors can consent to STI treatment in most jurisdictions", "Call the parents before providing treatment", "Report the STI to the school administration"],
    correctIndex: 1,
    answer: "In most US jurisdictions, minors can consent to treatment for sexually transmitted infections, substance abuse, mental health services, and reproductive health care without parental consent. These are exceptions to the general requirement for parental consent for minor treatment. The nurse should maintain confidentiality regarding the visit. Reporting STIs to schools violates confidentiality. However, mandatory reporting requirements (e.g., suspected abuse) still apply. The nurse should be familiar with their specific state laws regarding minor consent.",
    category: "Ethics/Legal",
    difficulty: 2
  },
  {
    id: "rn-ethics-q8",
    type: "question",
    question: "A nurse is assigned to care for a client whose treatment the nurse finds morally objectionable based on personal beliefs. What is the appropriate action?",
    options: ["Refuse to care for the client and leave the unit", "Provide substandard care to express disapproval", "Notify the charge nurse and request reassignment while ensuring the client's care is not compromised", "Tell the client about the moral objections to their treatment"],
    correctIndex: 2,
    answer: "Nurses have the right to conscientious objection but must ensure that client care is not abandoned or compromised. The appropriate action is to notify the charge nurse of the conflict and request reassignment. The nurse must continue providing care until an appropriate replacement is available. Abandoning the client (leaving without replacement) is a violation of the Nurse Practice Act. Providing substandard care or expressing personal moral judgments to clients is unethical and constitutes unprofessional conduct. The ANA Code of Ethics supports both patient advocacy and nurse integrity.",
    category: "Ethics/Legal",
    difficulty: 2
  },
  {
    id: "rn-ethics-q9",
    type: "question",
    question: "A nurse delegates vital sign measurement to a certified nursing assistant (CNA). The CNA reports a blood pressure of 78/50 mmHg on a post-surgical client. What is the nurse's responsibility?",
    options: ["Accept the CNA's report and document it without further action", "Verify the blood pressure personally, assess the client, and take appropriate action", "Tell the CNA to recheck the blood pressure and report back later", "Delegate the assessment to another RN since the CNA already reported it"],
    correctIndex: 1,
    answer: "The delegating nurse retains accountability for client outcomes even when tasks are delegated. A blood pressure of 78/50 mmHg is critically low and may indicate hypovolemic shock in a post-surgical client. The nurse must personally verify the reading, perform a comprehensive assessment (level of consciousness, heart rate, urine output, surgical drain output, skin color/temperature), and initiate appropriate interventions (notify the provider, prepare for fluid resuscitation). Delegation does not transfer accountability. The five rights of delegation include right task, right circumstance, right person, right supervision, and right direction.",
    category: "Ethics/Legal",
    difficulty: 2
  },
  {
    id: "rn-ethics-q10",
    type: "question",
    question: "A client's medical record needs to be corrected because the nurse documented on the wrong client's chart. What is the correct procedure for making this correction?",
    options: ["Use white-out to cover the incorrect entry", "Draw a single line through the error, write 'mistaken entry,' date, time, and initial it", "Remove the page from the chart and rewrite it correctly", "Delete the electronic entry completely and re-enter the correct information"],
    correctIndex: 1,
    answer: "The correct procedure for correcting a paper medical record error is to draw a single line through the incorrect entry (so it remains legible), write 'mistaken entry' or 'error' above or beside it, and add the date, time, and nurse's initials. In electronic health records, addendums are used and original entries are preserved with an audit trail. White-out, removing pages, and completely deleting entries are considered alteration or destruction of medical records, which is illegal and can constitute evidence tampering. Medical records are legal documents that may be used in court.",
    category: "Ethics/Legal",
    difficulty: 2
  },
  {
    id: "rn-derm-vitiligo-q1",
    type: "question",
    question: "A client newly diagnosed with vitiligo expresses distress about their appearance. What is the RN's priority intervention?",
    options: ["Reassure them the patches will eventually resolve on their own", "Provide psychosocial support and refer to dermatology for treatment options", "Recommend over-the-counter skin bleaching products", "Tell them it is only a cosmetic concern and not medically significant"],
    correctIndex: 1,
    answer: "Vitiligo significantly impacts quality of life and body image. The RN provides therapeutic communication, validates the client's feelings, and facilitates referral to dermatology for treatment options (topical corticosteroids, calcineurin inhibitors, narrowband UVB phototherapy). Support groups and counseling referrals are also appropriate.",
    image: imgVitiligo,
    category: "Dermatology",
    difficulty: 2
  },
  {
    id: "rn-gu-urethral-stricture-q1",
    type: "question",
    question: "A client is scheduled for urethral dilation to treat a urethral stricture. What post-procedure nursing assessment is most important?",
    options: ["Monitor for signs of urinary retention and hematuria", "Check for lower extremity edema", "Assess pupil reactivity", "Monitor blood glucose levels"],
    correctIndex: 0,
    answer: "After urethral dilation, the RN monitors for urinary retention (inability to void, bladder distension), hematuria (expected mild, report bright red or clots), signs of infection (fever, dysuria, cloudy urine), and adequate urine output. Teach the client to report inability to void, increasing pain, or heavy bleeding.",
    image: imgUrethralStricture,
    category: "Renal/GU",
    difficulty: 3
  },
  {
    id: "rn-neuro-vestibular-neuritis-q1",
    type: "question",
    question: "A client with vestibular neuritis is experiencing severe vertigo and nausea. Which nursing intervention is the priority?",
    options: ["Encourage ambulation to promote vestibular compensation", "Maintain a quiet, dimly lit environment with the client in a side-lying position", "Administer antibiotics as prescribed", "Perform the Dix-Hallpike maneuver to confirm diagnosis"],
    correctIndex: 1,
    answer: "During the acute phase of vestibular neuritis, reducing sensory stimulation (dim lights, quiet environment) minimizes the vestibular-visual mismatch that worsens vertigo and nausea. Position the client on their side (affected ear up) to reduce symptoms. Administer prescribed vestibular suppressants (meclizine) and antiemetics. Early ambulation is appropriate only after the acute phase subsides.",
    image: imgVestibularNeuritis,
    category: "Neurological",
    difficulty: 3
  },
  ...rnExpansionFlashcards,
  ...rnInfectiousDiseaseFlashcards,
  ...rnPathoCardioNeuroFlashcards,
  ...rnRespRenalFlashcards,
  ...rnRespRenalFlashcardsBatch2,
  ...rnPathoExpansionFlashcards,
  ...rnShockCriticalFlashcards,
  ...rnArrhythmiasChdAnticoagFlashcards,
  ...rnGiCancerPedsIntegFlashcards,
];
