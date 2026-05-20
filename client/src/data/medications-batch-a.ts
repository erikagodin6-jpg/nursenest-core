import type { Medication } from "./medications-types";

export const medicationsBatchA: Medication[] = [
  {
    id: "amlodipine",
    genericName: "Amlodipine",
    brandNames: ["Norvasc"],
    drugClass: "Dihydropyridine Calcium Channel Blocker",
    moaCategory: "Calcium Channel Blockers",
    mechanismOfAction: {
      summary: "Blocks L-type voltage-gated calcium channels in vascular smooth muscle, reducing intracellular calcium and causing arterial vasodilation, which lowers blood pressure.",
      receptorPathway: "L-type calcium channels (Cav1.2) on vascular smooth muscle → blocks Ca2+ influx → reduced intracellular calcium → decreased actin-myosin cross-bridge cycling → vasodilation.",
      cellularDetail: "Amlodipine selectively binds to the alpha-1 subunit of L-type (long-lasting) voltage-gated calcium channels in the inactive/inactivated state, stabilizing them in a non-conducting conformation. In vascular smooth muscle, this reduces calcium influx during depolarization, decreasing intracellular calcium available for calmodulin binding and myosin light chain kinase (MLCK) activation. Without MLCK-mediated phosphorylation of myosin regulatory light chains, actin-myosin cross-bridge cycling cannot occur, and the vessel relaxes. Amlodipine is highly selective for vascular smooth muscle over cardiac muscle due to the different voltage-dependent gating kinetics of L-type channels in these tissues. This vascular selectivity produces potent arterial vasodilation with minimal negative inotropic or chronotropic effects, distinguishing dihydropyridines from non-dihydropyridines (verapamil, diltiazem). The long half-life (~30-50 hours) provides stable 24-hour blood pressure control with once-daily dosing."
    },
    indications: ["Hypertension", "Chronic stable angina", "Vasospastic (Prinzmetal) angina", "Coronary artery disease"],
    sideEffects: [
      { effect: "Peripheral edema", mechanism: "Preferential arteriolar dilation without corresponding venodilation creates increased capillary hydrostatic pressure in dependent areas, driving fluid into interstitial spaces. This is NOT fluid retention: diuretics are ineffective", severity: "common" },
      { effect: "Headache", mechanism: "Cerebral arterial vasodilation increases intracranial blood flow and activates perivascular nociceptors", severity: "common" },
      { effect: "Flushing", mechanism: "Cutaneous arteriolar vasodilation increases dermal blood flow, producing warmth and erythema", severity: "common" },
      { effect: "Dizziness", mechanism: "Reduction in systemic vascular resistance and blood pressure can transiently reduce cerebral perfusion pressure, especially when standing", severity: "common" },
      { effect: "Reflex tachycardia", mechanism: "Arterial vasodilation triggers baroreceptor-mediated sympathetic activation, increasing heart rate to compensate for reduced peripheral resistance. Less pronounced with amlodipine due to slow onset", severity: "common" },
      { effect: "Gingival hyperplasia", mechanism: "Calcium channel blockade in gingival fibroblasts alters collagen metabolism, reducing collagenase activity and increasing extracellular matrix accumulation", severity: "common" }
    ],
    nursingConsiderations: [
      "Monitor blood pressure and heart rate regularly; assess for orthostatic hypotension especially during initiation",
      "Educate patient that peripheral edema is a pharmacological effect, not heart failure: elevation of legs helps but diuretics do not",
      "Assess for gingival hyperplasia: recommend meticulous oral hygiene and regular dental visits",
      "Can be taken without regard to food; consistent once-daily dosing provides stable blood pressure control",
      "Do NOT discontinue abruptly in angina patients: may precipitate increased anginal episodes"
    ],
    keyInteractions: [
      { drug: "Simvastatin", consequence: "Increased simvastatin levels and myopathy risk", mechanism: "Amlodipine inhibits CYP3A4, reducing simvastatin metabolism; simvastatin dose should not exceed 20 mg daily" },
      { drug: "Cyclosporine", consequence: "Increased cyclosporine levels", mechanism: "Amlodipine inhibits CYP3A4 and P-glycoprotein, reducing cyclosporine clearance" },
      { drug: "Beta-blockers", consequence: "Additive hypotension and potential bradycardia", mechanism: "Combined reduction in cardiac output (beta-blockers) and peripheral resistance (amlodipine) can produce excessive blood pressure reduction" }
    ],
    bodySystem: "Cardiovascular",
    relatedLessons: [{ id: "htn-management", title: "Hypertension Management" }, { id: "angina", title: "Angina" }]
  },
  {
    id: "digoxin",
    genericName: "Digoxin",
    brandNames: ["Lanoxin"],
    drugClass: "Cardiac Glycoside",
    moaCategory: "Cardiac Glycosides",
    mechanismOfAction: {
      summary: "Inhibits the sodium-potassium ATPase (Na+/K+ pump) in cardiac myocytes, increasing intracellular sodium, which reduces calcium extrusion via Na+/Ca2+ exchanger, ultimately increasing contractile force.",
      receptorPathway: "Na+/K+ ATPase inhibition → increased intracellular Na+ → reduced Na+/Ca2+ exchanger (NCX) activity → increased intracellular Ca2+ → enhanced actin-myosin interaction → increased contractility.",
      cellularDetail: "The Na+/K+ ATPase normally maintains the sodium gradient by pumping 3 Na+ out and 2 K+ in per cycle. Digoxin binds to the extracellular alpha subunit of this pump, inhibiting it. The resulting increase in intracellular sodium reduces the transmembrane sodium gradient that drives the Na+/Ca2+ exchanger (NCX), which normally exports 1 Ca2+ for 3 Na+ imported. With reduced NCX activity, intracellular calcium accumulates and is sequestered in the sarcoplasmic reticulum via SERCA2a. During subsequent action potentials, greater calcium release from the SR increases troponin C binding and actin-myosin cross-bridge formation, producing stronger contraction (positive inotropy). Additionally, digoxin sensitizes carotid baroreceptors and enhances vagal tone to the SA and AV nodes (parasympathomimetic effect), slowing heart rate (negative chronotropy) and AV conduction (negative dromotropy). This vagotonic effect is the primary mechanism for rate control in atrial fibrillation. The narrow therapeutic index (0.5-2.0 ng/mL) reflects the fine line between therapeutic Na+/K+ ATPase inhibition and toxic levels that cause dangerous calcium overload and triggered arrhythmias."
    },
    indications: ["Heart failure (systolic dysfunction)", "Atrial fibrillation (rate control)", "Atrial flutter (rate control)"],
    sideEffects: [
      { effect: "Cardiac arrhythmias (toxicity)", mechanism: "Excessive intracellular calcium causes delayed afterdepolarizations (DADs) due to spontaneous calcium release from overloaded SR activating NCX in forward mode, generating transient inward current that can trigger ectopic beats", severity: "life-threatening" },
      { effect: "Nausea/vomiting/anorexia", mechanism: "Digoxin stimulates the chemoreceptor trigger zone (CTZ) in the area postrema; these are often the earliest signs of toxicity", severity: "serious" },
      { effect: "Visual disturbances (yellow-green halos)", mechanism: "Inhibition of Na+/K+ ATPase in retinal cone cells alters color perception; classically described as xanthopsia", severity: "serious" },
      { effect: "Bradycardia", mechanism: "Enhanced vagal tone to the SA node slows the rate of spontaneous depolarization; excessive vagotonic effect can cause symptomatic sinus bradycardia or heart block", severity: "serious" },
      { effect: "Hyperkalemia (in toxicity)", mechanism: "Widespread Na+/K+ ATPase inhibition prevents potassium entry into cells throughout the body, causing serum potassium to rise", severity: "life-threatening" }
    ],
    nursingConsiderations: [
      "Check apical pulse for ONE FULL MINUTE before each dose. Hold and notify provider if HR < 60 bpm in adults or < 70 bpm in children",
      "Monitor serum digoxin levels: therapeutic range 0.5-2.0 ng/mL. Draw trough levels at least 6-8 hours after last dose",
      "Monitor potassium levels closely: HYPOkalemia dramatically increases digoxin toxicity because potassium and digoxin compete for the same Na+/K+ ATPase binding site",
      "Teach patients to recognize toxicity signs: nausea, vomiting, visual changes (yellow-green halos), new-onset irregular heartbeat",
      "Antidote for life-threatening toxicity: Digoxin Immune Fab (DigiFab) — binds free digoxin and prevents receptor interaction",
      "Avoid concurrent use of loop diuretics without potassium monitoring: furosemide-induced hypokalemia potentiates digoxin toxicity"
    ],
    keyInteractions: [
      { drug: "Amiodarone", consequence: "Doubled digoxin levels; risk of toxicity", mechanism: "Amiodarone inhibits P-glycoprotein and renal tubular secretion of digoxin, reducing clearance by approximately 50%. Digoxin dose must be halved" },
      { drug: "Loop diuretics (furosemide)", consequence: "Increased digoxin toxicity via hypokalemia", mechanism: "Diuretic-induced potassium depletion reduces competition for Na+/K+ ATPase binding, increasing digoxin's effect at the same serum level" },
      { drug: "Verapamil", consequence: "Increased digoxin levels and additive AV block", mechanism: "Verapamil inhibits P-glycoprotein efflux of digoxin and both drugs slow AV conduction: risk of complete heart block" }
    ],
    bodySystem: "Cardiovascular",
    relatedLessons: [{ id: "hf-advanced", title: "Heart Failure Advanced" }, { id: "afib", title: "Atrial Fibrillation" }]
  },
  {
    id: "amiodarone",
    genericName: "Amiodarone",
    brandNames: ["Cordarone", "Pacerone"],
    drugClass: "Class III Antiarrhythmic",
    moaCategory: "Antiarrhythmics",
    mechanismOfAction: {
      summary: "Multi-channel blocker that primarily prolongs the action potential duration and refractory period by blocking potassium channels, with additional sodium, calcium, and beta-adrenergic blocking properties.",
      receptorPathway: "Potassium channels (IKr, IKs) → prolonged repolarization → extended effective refractory period. Also blocks: fast Na+ channels (Class I), L-type Ca2+ channels (Class IV), beta-adrenergic receptors (Class II).",
      cellularDetail: "Amiodarone exhibits properties of all four Vaughan-Williams antiarrhythmic classes. Its primary effect (Class III) involves blockade of rapid (IKr/hERG) and slow (IKs) delayed rectifier potassium currents, prolonging phase 3 repolarization and extending the effective refractory period (ERP). This prevents re-entrant circuits from sustaining tachyarrhythmias. Class I effect: blocks inactivated sodium channels, slowing phase 0 depolarization and conduction velocity, particularly in ischemic tissue. Class IV effect: blocks L-type calcium channels, slowing conduction through the AV node. Class II effect: non-competitive beta-adrenergic blockade reduces sympathetic stimulation. The extraordinarily long half-life (40-55 days) reflects its extreme lipophilicity: amiodarone accumulates in adipose tissue, lungs, liver, thyroid, cornea, and skin, accounting for its unique multi-organ toxicity profile. It also contains two iodine atoms per molecule (37% iodine by weight), which profoundly affects thyroid function by releasing large amounts of iodine and directly inhibiting peripheral T4 to T3 conversion."
    },
    indications: ["Life-threatening ventricular arrhythmias (VT/VF)", "Atrial fibrillation (rhythm/rate control)", "ACLS: refractory VF/pulseless VT", "Supraventricular tachycardia"],
    sideEffects: [
      { effect: "Pulmonary toxicity (pneumonitis/fibrosis)", mechanism: "Direct cytotoxic damage to type II pneumocytes causes phospholipidosis (drug accumulates in lysosomes disrupting phospholipid metabolism). Immune-mediated hypersensitivity pneumonitis can also occur. Potentially fatal and irreversible", severity: "life-threatening" },
      { effect: "Thyroid dysfunction (hypo- or hyper-thyroidism)", mechanism: "Iodine load causes Wolff-Chaikoff effect (hypothyroidism) or Jod-Basedow phenomenon (hyperthyroidism). Also directly inhibits type I and II 5'-deiodinase, blocking T4 to T3 conversion", severity: "serious" },
      { effect: "Hepatotoxicity", mechanism: "Phospholipidosis in hepatocytes causes steatohepatitis resembling alcoholic hepatitis. Mitochondrial dysfunction contributes to cellular injury", severity: "serious" },
      { effect: "Corneal microdeposits", mechanism: "Lipophilic drug-phospholipid complexes accumulate in the corneal epithelium in nearly all patients (>90%). Usually asymptomatic but can cause visual halos", severity: "common" },
      { effect: "Photosensitivity / blue-gray skin discoloration", mechanism: "Amiodarone and its metabolite desethylamiodarone absorb UV light, generating free radicals in the skin. Long-term accumulation of lipofuscin-like deposits causes blue-gray pigmentation", severity: "common" },
      { effect: "QT prolongation", mechanism: "Potassium channel blockade prolongs repolarization; excessive prolongation can trigger torsades de pointes, though this is paradoxically less common than with other Class III agents due to amiodarone's multi-channel effects", severity: "serious" }
    ],
    nursingConsiderations: [
      "Baseline and periodic monitoring required: PFTs (pulmonary function tests) every 3-6 months, TFTs (thyroid function tests) every 6 months, LFTs, chest X-ray, ophthalmologic exam",
      "Assess for pulmonary toxicity: new-onset dyspnea, cough, or fever in a patient on amiodarone is pulmonary toxicity until proven otherwise",
      "IV administration: use in-line filter, administer through central line when possible (peripheral administration causes phlebitis). Never mix with other drugs",
      "Teach sun protection: wear sunscreen SPF 50+ and protective clothing due to severe photosensitivity",
      "Drug interactions are extensive due to CYP3A4 and CYP2C9 inhibition: reduce digoxin dose by 50% and warfarin dose by 30-50% when starting amiodarone",
      "Half-life is 40-55 days: adverse effects may persist for months after discontinuation"
    ],
    blackBoxWarnings: ["Pulmonary toxicity (potentially fatal). Hepatotoxicity. Proarrhythmic effects. Only for life-threatening arrhythmias due to toxicity risk."],
    keyInteractions: [
      { drug: "Digoxin", consequence: "Digoxin toxicity (levels double)", mechanism: "Amiodarone inhibits P-glycoprotein and renal clearance of digoxin; dose must be reduced by 50%" },
      { drug: "Warfarin", consequence: "Increased INR and bleeding risk", mechanism: "Inhibits CYP2C9, the primary enzyme metabolizing S-warfarin; warfarin dose typically needs 30-50% reduction" },
      { drug: "Simvastatin / other statins", consequence: "Rhabdomyolysis", mechanism: "CYP3A4 inhibition dramatically increases statin plasma levels; simvastatin dose must not exceed 20 mg" }
    ],
    bodySystem: "Cardiovascular",
    relatedLessons: [{ id: "ecg-interpretation", title: "ECG Interpretation" }, { id: "acls", title: "ACLS Protocols" }]
  },
  {
    id: "nitroglycerin",
    genericName: "Nitroglycerin",
    brandNames: ["Nitrostat", "Nitro-Bid", "Nitro-Dur"],
    drugClass: "Nitrate Vasodilator",
    moaCategory: "Nitrates",
    mechanismOfAction: {
      summary: "Releases nitric oxide (NO) in vascular smooth muscle, activating guanylate cyclase to produce cGMP, which causes vasodilation predominantly in venous capacitance vessels, reducing cardiac preload.",
      receptorPathway: "Nitroglycerin → bioactivated by mitochondrial aldehyde dehydrogenase (ALDH2) → releases NO → activates soluble guanylate cyclase (sGC) → increases cGMP → activates PKG → smooth muscle relaxation.",
      cellularDetail: "Nitroglycerin is a prodrug that requires bioactivation by mitochondrial aldehyde dehydrogenase (ALDH2) to release nitric oxide (NO). NO activates soluble guanylate cyclase (sGC), increasing intracellular cGMP levels. cGMP activates protein kinase G (PKG), which phosphorylates multiple targets: (1) myosin light chain phosphatase (MLCP) is activated, dephosphorylating myosin and preventing contraction, (2) IP3 receptor-associated cGMP kinase substrate (IRAG) inhibits IP3-mediated calcium release from the SR, (3) phospholamban phosphorylation increases SERCA activity, pumping calcium back into SR. At low doses, nitroglycerin preferentially dilates venous capacitance vessels, reducing venous return (preload) and cardiac filling pressures. At higher doses, arterial dilation occurs, reducing afterload. The net effect in angina is reduced myocardial oxygen demand (decreased wall stress via reduced preload and afterload) plus improved coronary perfusion (dilation of epicardial coronary arteries and collateral vessels). Tolerance develops with continuous exposure due to ALDH2 depletion and increased superoxide production."
    },
    indications: ["Acute angina pectoris", "Acute coronary syndrome", "Acute decompensated heart failure (preload reduction)", "Hypertensive emergency (IV)"],
    sideEffects: [
      { effect: "Headache", mechanism: "Meningeal arterial vasodilation stimulates perivascular trigeminal nociceptors. The most common side effect and often dose-limiting initially; tolerance typically develops", severity: "common" },
      { effect: "Hypotension", mechanism: "Venodilation reduces preload and cardiac filling, decreasing stroke volume and cardiac output. Exacerbated in volume-depleted patients", severity: "serious" },
      { effect: "Reflex tachycardia", mechanism: "Baroreceptor-mediated sympathetic activation in response to blood pressure reduction increases heart rate, which paradoxically increases myocardial oxygen demand", severity: "common" },
      { effect: "Tolerance", mechanism: "Continuous nitroglycerin exposure depletes ALDH2 (the enzyme required for bioactivation), increases superoxide production via uncoupled eNOS, and upregulates phosphodiesterase-1A (which degrades cGMP)", severity: "common" },
      { effect: "Methemoglobinemia (rare, high doses)", mechanism: "Nitric oxide oxidizes ferrous (Fe2+) hemoglobin to ferric (Fe3+) methemoglobin, which cannot bind oxygen. Clinically significant only at very high doses", severity: "life-threatening" }
    ],
    nursingConsiderations: [
      "Sublingual: instruct patient to sit down, place tablet under tongue, do NOT swallow. May repeat every 5 minutes x3 doses. Call 911 if pain persists after first dose (AHA updated guidelines)",
      "Check blood pressure before administration: hold if SBP < 90 mmHg. Contraindicated if patient has taken PDE5 inhibitors (sildenafil, tadalafil) within 24-48 hours",
      "Store sublingual tablets in original dark glass container: nitroglycerin degrades with light, heat, and moisture. Replace every 6 months",
      "For continuous IV infusion: use glass bottles and non-PVC tubing (nitroglycerin adsorbs to PVC, reducing delivered dose)",
      "Provide 10-12 hour nitrate-free interval daily (typically overnight) to prevent tolerance development",
      "Teach patients that a burning/tingling sensation under the tongue does NOT reliably indicate potency"
    ],
    keyInteractions: [
      { drug: "PDE5 inhibitors (sildenafil, tadalafil)", consequence: "Severe, potentially fatal hypotension", mechanism: "PDE5 inhibitors prevent cGMP breakdown: nitroglycerin increases cGMP production. Combined effect creates massive, uncontrolled vasodilation and catastrophic blood pressure drop" },
      { drug: "Antihypertensives", consequence: "Additive hypotension", mechanism: "Combined vasodilation from different mechanisms can produce symptomatic hypotension" },
      { drug: "Alteplase (tPA)", consequence: "Reduced thrombolytic efficacy", mechanism: "Nitroglycerin increases hepatic blood flow, potentially increasing alteplase clearance" }
    ],
    bodySystem: "Cardiovascular",
    relatedLessons: [{ id: "angina", title: "Angina" }, { id: "acs", title: "Acute Coronary Syndrome" }]
  },
  {
    id: "dopamine",
    genericName: "Dopamine",
    brandNames: ["Intropin"],
    drugClass: "Catecholamine / Vasopressor",
    moaCategory: "Vasopressors",
    mechanismOfAction: {
      summary: "Dose-dependent activation of dopaminergic, beta-1 adrenergic, and alpha-1 adrenergic receptors, producing renal vasodilation (low dose), increased cardiac contractility (moderate dose), or systemic vasoconstriction (high dose).",
      receptorPathway: "Low dose (1-5 mcg/kg/min): D1 receptors → renal/mesenteric vasodilation. Moderate dose (5-10 mcg/kg/min): Beta-1 receptors → increased contractility/heart rate. High dose (>10 mcg/kg/min): Alpha-1 receptors → systemic vasoconstriction.",
      cellularDetail: "Dopamine activates three receptor families in a dose-dependent hierarchy based on receptor affinity. At low doses (1-5 mcg/kg/min), dopamine primarily activates D1 receptors (Gs-coupled) in renal, mesenteric, and coronary vascular beds, stimulating adenylyl cyclase and increasing cAMP, producing local vasodilation. At moderate doses (5-10 mcg/kg/min), beta-1 adrenergic receptors (also Gs-coupled) in the myocardium are activated, increasing cAMP → PKA → phosphorylation of L-type calcium channels and phospholamban, enhancing calcium cycling and producing positive inotropy (increased contractility) and chronotropy (increased heart rate). At high doses (>10 mcg/kg/min), alpha-1 adrenergic receptors (Gq-coupled) on peripheral vascular smooth muscle are activated, stimulating phospholipase C → IP3 → calcium release from SR → vasoconstriction. This dose-dependent response allows titration to clinical needs, though the dose ranges overlap significantly between individuals. Dopamine also causes norepinephrine release from sympathetic nerve terminals (indirect sympathomimetic effect)."
    },
    indications: ["Cardiogenic shock", "Septic shock (adjunct)", "Symptomatic bradycardia (unresponsive to atropine)", "Acute heart failure"],
    sideEffects: [
      { effect: "Tachyarrhythmias", mechanism: "Beta-1 stimulation increases automaticity and conduction velocity in cardiac tissue, potentially triggering premature ventricular contractions, ventricular tachycardia, or atrial fibrillation", severity: "serious" },
      { effect: "Tissue necrosis (extravasation)", mechanism: "Alpha-1 mediated intense vasoconstriction at the extravasation site causes ischemic tissue injury. The vasoconstrictive effect concentrates in the surrounding microcirculation, leading to necrosis", severity: "life-threatening" },
      { effect: "Peripheral ischemia (high doses)", mechanism: "Excessive alpha-1 activation causes intense vasoconstriction in extremity and mesenteric vascular beds, reducing tissue perfusion and potentially causing digital or bowel ischemia", severity: "serious" },
      { effect: "Hypertension", mechanism: "Combined increase in cardiac output (beta-1) and systemic vascular resistance (alpha-1) at higher doses can produce excessive blood pressure elevation", severity: "serious" },
      { effect: "Nausea / vomiting", mechanism: "Activation of D2 receptors in the chemoreceptor trigger zone (CTZ) stimulates the vomiting center", severity: "common" }
    ],
    nursingConsiderations: [
      "MUST administer through central venous catheter when possible: extravasation causes severe tissue necrosis. If extravasation occurs, infiltrate area with phentolamine (alpha-blocker) immediately",
      "Continuous cardiac monitoring required: watch for new arrhythmias, ST changes, and blood pressure trends",
      "Titrate to hemodynamic goals: monitor MAP, heart rate, urine output, and signs of end-organ perfusion",
      "Taper gradually: abrupt discontinuation can cause rebound hypotension",
      "Monitor extremities for signs of peripheral ischemia: pallor, cyanosis, coolness, diminished pulses (especially at doses >10 mcg/kg/min)"
    ],
    keyInteractions: [
      { drug: "MAO inhibitors", consequence: "Hypertensive crisis", mechanism: "MAOIs prevent catecholamine breakdown, dramatically increasing the effect of exogenous dopamine. Dopamine dose must be reduced to 1/10th normal" },
      { drug: "Phenytoin", consequence: "Severe hypotension", mechanism: "IV phenytoin combined with dopamine can produce sudden hypotension and cardiac arrest through unclear mechanisms" },
      { drug: "Haloperidol / other D2 antagonists", consequence: "Reduced dopaminergic (renal) effect", mechanism: "D2 receptor blockade by antipsychotics antagonizes dopamine's renal vasodilatory effects at low doses" }
    ],
    bodySystem: "Cardiovascular",
    relatedLessons: [{ id: "shock-management", title: "Shock Management" }, { id: "critical-care", title: "Critical Care" }]
  },
  {
    id: "epinephrine",
    genericName: "Epinephrine",
    brandNames: ["EpiPen", "Adrenalin", "Auvi-Q"],
    drugClass: "Sympathomimetic (Catecholamine)",
    moaCategory: "Sympathomimetics",
    mechanismOfAction: {
      summary: "Non-selective adrenergic agonist that stimulates alpha-1, alpha-2, beta-1, and beta-2 receptors, producing vasoconstriction, increased cardiac output, and bronchodilation depending on dose and route.",
      receptorPathway: "Alpha-1 (Gq): vasoconstriction → increased SVR. Beta-1 (Gs): increased heart rate + contractility → increased cardiac output. Beta-2 (Gs): bronchodilation + vasodilation in skeletal muscle. Also stabilizes mast cells, reducing histamine/mediator release.",
      cellularDetail: "Epinephrine activates all adrenergic receptor subtypes. Alpha-1 receptors (Gq-coupled) on vascular smooth muscle activate phospholipase C → IP3 → calcium release → vasoconstriction, increasing systemic vascular resistance and redirecting blood flow to vital organs. Beta-1 receptors (Gs-coupled) in the heart increase cAMP → PKA activation → enhanced L-type calcium channel phosphorylation and increased calcium cycling, producing positive inotropy, chronotropy, and dromotropy. Beta-2 receptors (Gs-coupled) in bronchial smooth muscle increase cAMP → PKA → phosphorylation of MLCK (reducing its affinity for calcium-calmodulin) → bronchial smooth muscle relaxation. In anaphylaxis, epinephrine's critical actions include: (1) alpha-1 vasoconstriction reverses vasodilation and improves blood pressure, (2) beta-1 effects increase cardiac output to maintain perfusion, (3) beta-2 effects reverse bronchospasm, (4) stabilization of mast cell and basophil membranes via increased cAMP, reducing further histamine and mediator release. In ACLS, epinephrine's alpha-1 vasoconstriction increases aortic diastolic pressure, improving coronary perfusion pressure during CPR."
    },
    indications: ["Anaphylaxis (first-line)", "Cardiac arrest (ACLS)", "Severe asthma exacerbation", "Cardiogenic/distributive shock", "Croup (nebulized racemic epinephrine)"],
    sideEffects: [
      { effect: "Tachycardia / palpitations", mechanism: "Beta-1 stimulation increases SA node automaticity and AV conduction velocity, producing sinus tachycardia. May trigger atrial or ventricular arrhythmias in sensitized myocardium", severity: "serious" },
      { effect: "Hypertension", mechanism: "Alpha-1 mediated vasoconstriction combined with beta-1 mediated increased cardiac output can produce dangerously elevated blood pressure, especially at high doses", severity: "serious" },
      { effect: "Tremor / anxiety", mechanism: "Beta-2 receptor stimulation in skeletal muscle increases glycogenolysis and contractile readiness, producing tremor. Central nervous system stimulation produces anxiety and restlessness", severity: "common" },
      { effect: "Hyperglycemia", mechanism: "Beta-2 receptor activation in the liver increases glycogenolysis and gluconeogenesis. Alpha-2 receptor activation in pancreatic beta cells inhibits insulin secretion. Combined effect dramatically raises blood glucose", severity: "common" },
      { effect: "Tissue necrosis (extravasation or local injection)", mechanism: "Intense alpha-1 mediated vasoconstriction at the injection site can cause local ischemia. Repeated IM injections in the same site risk necrotic injury", severity: "serious" }
    ],
    nursingConsiderations: [
      "ANAPHYLAXIS: Administer IM into the lateral thigh (vastus lateralis) immediately. Do NOT delay for IV access. Dose: 0.3-0.5 mg of 1:1,000 (1 mg/mL) for adults",
      "ACLS cardiac arrest: 1 mg IV/IO of 1:10,000 (0.1 mg/mL) every 3-5 minutes. Know the concentration difference between anaphylaxis (1:1,000 IM) and cardiac arrest (1:10,000 IV)",
      "High-alert medication: verify concentration (1:1,000 vs 1:10,000) before administration. Wrong concentration by wrong route is a fatal medication error",
      "Monitor continuous ECG and blood pressure during IV infusion. Titrate to MAP goals in shock",
      "Teach patients with prescribed EpiPen: carry at all times, inject through clothing if needed, always call 911 after use (biphasic anaphylaxis risk)"
    ],
    keyInteractions: [
      { drug: "Beta-blockers", consequence: "Severe hypertension with reflex bradycardia", mechanism: "Beta-blockade leaves alpha-1 vasoconstriction unopposed, causing hypertensive crisis. Beta-2 bronchodilation is also blocked, reducing epinephrine's efficacy in anaphylaxis" },
      { drug: "MAO inhibitors", consequence: "Hypertensive crisis", mechanism: "MAOIs prevent catecholamine metabolism, dramatically amplifying and prolonging epinephrine's cardiovascular effects" },
      { drug: "Tricyclic antidepressants", consequence: "Potentiated cardiovascular effects", mechanism: "TCAs block norepinephrine reuptake at sympathetic nerve terminals, increasing the effect of administered catecholamines" }
    ],
    bodySystem: "Cardiovascular",
    relatedLessons: [{ id: "anaphylaxis", title: "Anaphylaxis" }, { id: "acls", title: "ACLS Protocols" }]
  },
  {
    id: "atropine",
    genericName: "Atropine",
    brandNames: ["AtroPen"],
    drugClass: "Anticholinergic (Muscarinic Antagonist)",
    moaCategory: "Anticholinergics",
    mechanismOfAction: {
      summary: "Competitively blocks acetylcholine at muscarinic receptors (M1-M5), preventing parasympathetic effects. In the heart, this removes vagal inhibition, increasing heart rate and conduction velocity.",
      receptorPathway: "Muscarinic receptors (M2 in heart → Gi protein) blocked → removes vagal (parasympathetic) inhibition → increased SA node firing rate and AV conduction velocity.",
      cellularDetail: "Atropine is a competitive antagonist at all five muscarinic acetylcholine receptor subtypes (M1-M5), but its cardiac effects are mediated primarily through M2 receptor blockade. The vagus nerve tonically releases acetylcholine onto M2 receptors in the SA node and AV node. M2 receptors are Gi-coupled: they inhibit adenylyl cyclase (reducing cAMP) and directly activate inward-rectifying potassium channels (IKACh/GIRK), hyperpolarizing nodal cells and slowing spontaneous depolarization. By blocking M2 receptors, atropine removes this vagal brake: cAMP levels rise, the funny current (If) increases, L-type calcium current increases, and IKACh closes. The net effect is acceleration of SA node firing rate and facilitation of AV conduction. In the eye, M3 blockade on the sphincter pupillae causes mydriasis, and M3 blockade on the ciliary muscle causes cycloplegia. In exocrine glands, M3 blockade reduces secretions (salivary, bronchial, gastric). In the GI tract, M3 blockade reduces smooth muscle tone and motility."
    },
    indications: ["Symptomatic bradycardia (ACLS first-line)", "Organophosphate/nerve agent poisoning", "Preoperative antisialagogue (reduce secretions)", "Ophthalmologic examination (mydriasis/cycloplegia)"],
    sideEffects: [
      { effect: "Tachycardia", mechanism: "Removal of vagal tone allows unopposed sympathetic stimulation of the SA node, producing sinus tachycardia. At very low doses (< 0.5 mg), paradoxical bradycardia can occur due to preferential blockade of presynaptic M1 autoreceptors that normally inhibit ACh release", severity: "common" },
      { effect: "Dry mouth (xerostomia)", mechanism: "M3 receptor blockade on salivary glands reduces parasympathetic-driven serous secretion. Saliva production can decrease by >90%", severity: "common" },
      { effect: "Urinary retention", mechanism: "M3 blockade on detrusor muscle reduces contractility, and M3 blockade on the internal urethral sphincter prevents relaxation. Particularly problematic in patients with BPH", severity: "serious" },
      { effect: "Blurred vision / photophobia", mechanism: "M3 blockade causes mydriasis (pupil dilation) preventing light regulation, and cycloplegia (ciliary muscle paralysis) preventing accommodation for near vision", severity: "common" },
      { effect: "Hyperthermia", mechanism: "M3 blockade on eccrine sweat glands eliminates cholinergic-mediated sweating, impairing thermoregulation. Particularly dangerous in children and elderly", severity: "serious" },
      { effect: "CNS excitation / delirium", mechanism: "Crosses blood-brain barrier and blocks central muscarinic receptors involved in cognition and consciousness. Classic anticholinergic toxidrome: 'Mad as a hatter'", severity: "serious" }
    ],
    nursingConsiderations: [
      "ACLS bradycardia: 1 mg IV every 3-5 minutes, maximum total dose 3 mg. Doses < 0.5 mg can cause paradoxical bradycardia",
      "Organophosphate poisoning: large doses needed (2-4 mg IV repeated frequently); endpoint is drying of secretions, not heart rate",
      "Monitor heart rate and rhythm continuously after administration",
      "Teach anticholinergic mnemonic: 'Hot as a hare (hyperthermia), Blind as a bat (mydriasis), Dry as a bone (no secretions), Red as a beet (flushing), Mad as a hatter (delirium)'",
      "Contraindicated in narrow-angle glaucoma: mydriasis blocks aqueous humor drainage, increasing intraocular pressure"
    ],
    keyInteractions: [
      { drug: "Other anticholinergics (diphenhydramine, TCAs)", consequence: "Additive anticholinergic toxicity", mechanism: "Combined muscarinic blockade from multiple sources can produce severe anticholinergic syndrome: hyperthermia, delirium, tachycardia, urinary retention" },
      { drug: "Potassium chloride (oral solid)", consequence: "GI ulceration from slowed transit", mechanism: "Atropine reduces GI motility, prolonging contact time of corrosive potassium with GI mucosa" }
    ],
    bodySystem: "Cardiovascular",
    relatedLessons: [{ id: "acls", title: "ACLS Protocols" }, { id: "toxicology", title: "Toxicology" }]
  },
  {
    id: "adenosine",
    genericName: "Adenosine",
    brandNames: ["Adenocard"],
    drugClass: "Antiarrhythmic (Endogenous Nucleoside)",
    moaCategory: "Antiarrhythmics",
    mechanismOfAction: {
      summary: "Activates A1 purinergic receptors on AV nodal cells, opening potassium channels and inhibiting calcium channels, causing transient AV block to terminate re-entrant SVTs that use the AV node as part of their circuit.",
      receptorPathway: "A1 adenosine receptors (Gi-coupled) → inhibits adenylyl cyclase → decreases cAMP → opens IKAdo (GIRK) potassium channels → hyperpolarization → slows/blocks AV conduction.",
      cellularDetail: "Adenosine activates A1 purinergic receptors in the AV node, which are coupled to Gi proteins. This produces two complementary effects: (1) Direct activation of IKAdo (GIRK/Kir3.x) potassium channels via released Gβγ subunits causes potassium efflux and membrane hyperpolarization, making AV nodal cells much harder to depolarize. (2) Gαi inhibits adenylyl cyclase, reducing cAMP levels and decreasing L-type calcium current (ICaL), which is the primary depolarizing current in AV nodal cells. The combined effect produces transient but near-complete AV block lasting 10-15 seconds. For SVTs that use the AV node as a necessary component of their re-entrant circuit (AVNRT, AVRT), this momentary interruption terminates the arrhythmia. The ultra-short half-life (<10 seconds) results from rapid cellular uptake via equilibrative nucleoside transporters (ENT1) and enzymatic degradation by adenosine deaminase. This extremely short duration of action makes adenosine remarkably safe despite its dramatic effect."
    },
    indications: ["Paroxysmal supraventricular tachycardia (PSVT) — first-line", "Diagnosis of wide-complex tachycardia (unmasking atrial activity)", "ACLS: stable narrow-complex SVT"],
    sideEffects: [
      { effect: "Transient asystole / sinus pause", mechanism: "This IS the intended mechanism: AV block and suppressed automaticity. Usually lasts only a few seconds. Patients should be warned they may feel a brief 'stopping' sensation", severity: "serious" },
      { effect: "Chest tightness / dyspnea", mechanism: "A1 and A2B receptor activation in bronchial smooth muscle causes bronchoconstriction. Also activates pulmonary C-fiber vagal afferents producing sensation of dyspnea", severity: "common" },
      { effect: "Flushing", mechanism: "A2A receptor-mediated vasodilation in cutaneous vascular beds causes transient facial and upper body flushing", severity: "common" },
      { effect: "Chest pain / pressure", mechanism: "Activation of cardiac A1 receptors may transiently reduce coronary blood flow; also may activate cardiac pain afferents directly", severity: "common" }
    ],
    nursingConsiderations: [
      "Administer as RAPID IV push at the port closest to the heart (antecubital preferred), immediately followed by 20 mL rapid NS flush. Must reach the heart before metabolism degrades it",
      "Initial dose: 6 mg rapid IV push. If ineffective after 1-2 minutes, give 12 mg. May repeat 12 mg once",
      "Continuous cardiac monitoring with rhythm strip running before, during, and after administration to capture the diagnostic response",
      "Warn patient in advance: 'You may feel chest tightness, flushing, or a brief sensation that your heart has stopped. This is expected and lasts only seconds.'",
      "Contraindicated in second/third-degree heart block and sick sinus syndrome (without pacemaker). Use with extreme caution in asthmatics (bronchoconstriction risk)"
    ],
    keyInteractions: [
      { drug: "Theophylline / caffeine", consequence: "Reduced or abolished adenosine effect", mechanism: "Theophylline and caffeine are competitive A1 receptor antagonists: they block adenosine's receptor binding. Higher doses of adenosine may be needed" },
      { drug: "Dipyridamole", consequence: "Potentiated and prolonged adenosine effect", mechanism: "Dipyridamole blocks ENT1 (equilibrative nucleoside transporter), preventing cellular uptake and metabolism of adenosine. Reduce adenosine dose by 50-75%" },
      { drug: "Carbamazepine", consequence: "Increased degree and duration of heart block", mechanism: "Carbamazepine potentiates adenosine's AV blocking effect through unclear mechanisms; risk of prolonged asystole" }
    ],
    bodySystem: "Cardiovascular",
    relatedLessons: [{ id: "ecg-interpretation", title: "ECG Interpretation" }, { id: "acls", title: "ACLS Protocols" }]
  },
  {
    id: "clopidogrel",
    genericName: "Clopidogrel",
    brandNames: ["Plavix"],
    drugClass: "Antiplatelet (P2Y12 Inhibitor)",
    moaCategory: "Antiplatelets",
    mechanismOfAction: {
      summary: "Irreversibly blocks the P2Y12 ADP receptor on platelets, preventing ADP-mediated platelet activation and aggregation for the entire lifespan of the platelet (7-10 days).",
      receptorPathway: "Clopidogrel (prodrug) → CYP2C19 hepatic activation → active thiol metabolite → irreversible binding to P2Y12 ADP receptor → blocks ADP-induced GPIIb/IIIa conformational change → prevents platelet aggregation.",
      cellularDetail: "Clopidogrel is a thienopyridine prodrug that requires two-step hepatic metabolism: first by CYP2C19 (primary), CYP3A4, CYP1A2, and CYP2B6 to produce the active thiol metabolite. This metabolite forms a disulfide bond with cysteine residues on the P2Y12 receptor, irreversibly blocking it. P2Y12 is a Gi-coupled receptor that normally amplifies platelet activation when ADP binds: it inhibits adenylyl cyclase (reducing cAMP), which allows GPIIb/IIIa integrin to undergo the conformational change needed for fibrinogen binding and platelet-platelet cross-linking. With P2Y12 blocked, platelet cAMP remains high, GPIIb/IIIa activation is impaired, and platelet aggregation is inhibited. Because the binding is irreversible (covalent), each platelet is affected for its remaining lifespan (7-10 days). Approximately 85% of the prodrug is hydrolyzed by esterases to an inactive metabolite, meaning only about 15% is available for activation. CYP2C19 polymorphisms significantly affect drug efficacy: poor metabolizers have substantially reduced active metabolite production and increased cardiovascular event rates."
    },
    indications: ["Acute coronary syndrome", "Post-PCI (percutaneous coronary intervention) / stent placement", "Recent MI or stroke", "Peripheral artery disease"],
    sideEffects: [
      { effect: "Bleeding", mechanism: "Irreversible platelet inhibition impairs primary hemostasis (platelet plug formation). Combined with aspirin in dual antiplatelet therapy (DAPT), bleeding risk is significantly amplified", severity: "serious" },
      { effect: "Thrombotic thrombocytopenic purpura (TTP)", mechanism: "Rare immune-mediated inhibition of ADAMTS13 protease, leading to accumulation of ultra-large von Willebrand factor multimers that cause platelet microthrombi in small vessels", severity: "life-threatening" },
      { effect: "GI bleeding", mechanism: "Impaired platelet function reduces the ability to seal mucosal defects in the GI tract, particularly in patients with underlying peptic ulcer disease or concurrent aspirin/NSAID use", severity: "serious" },
      { effect: "Bruising", mechanism: "Impaired primary hemostasis allows blood leakage into subcutaneous tissue from minor vascular disruption", severity: "common" }
    ],
    nursingConsiderations: [
      "Assess for CYP2C19 poor metabolizer status if available: FDA box warning recommends alternative antiplatelet agents (prasugrel, ticagrelor) for poor metabolizers",
      "Discontinue 5-7 days before elective surgery to allow new platelet production to restore hemostatic capacity",
      "Teach patients to report unusual bleeding: prolonged bleeding from cuts, blood in urine/stool, unexplained bruising, black tarry stools",
      "Monitor CBC periodically: assess for thrombocytopenia or signs of TTP (thrombocytopenia, microangiopathic hemolytic anemia, fever, renal dysfunction, neurological changes)",
      "Take with or without food; do not crush or break tablet"
    ],
    blackBoxWarnings: ["CYP2C19 poor metabolizers: Reduced effectiveness. Consider alternative antiplatelet therapy. Genetic testing available."],
    keyInteractions: [
      { drug: "Omeprazole / esomeprazole", consequence: "Reduced clopidogrel efficacy", mechanism: "Omeprazole competitively inhibits CYP2C19, reducing conversion of clopidogrel to its active metabolite by up to 45%. Use pantoprazole instead if PPI is needed" },
      { drug: "Aspirin", consequence: "Increased bleeding risk (intended in DAPT)", mechanism: "Aspirin inhibits COX-1 thromboxane A2 production while clopidogrel blocks ADP-mediated activation: dual pathway inhibition provides synergistic antiplatelet effect but increases hemorrhagic risk" },
      { drug: "NSAIDs", consequence: "Increased GI bleeding risk", mechanism: "NSAIDs damage GI mucosa and impair COX-1 protective prostaglandin production while clopidogrel prevents platelet-mediated sealing of mucosal defects" }
    ],
    bodySystem: "Hematology",
    relatedLessons: [{ id: "acs", title: "Acute Coronary Syndrome" }, { id: "stroke-management", title: "Stroke Management" }]
  },
  {
    id: "albuterol",
    genericName: "Albuterol",
    brandNames: ["Ventolin", "ProAir", "Proventil"],
    drugClass: "Short-Acting Beta-2 Agonist (SABA)",
    moaCategory: "Bronchodilators",
    mechanismOfAction: {
      summary: "Selectively stimulates beta-2 adrenergic receptors in bronchial smooth muscle, increasing cAMP and causing bronchodilation. The most important rescue medication for acute bronchospasm.",
      receptorPathway: "Beta-2 receptors (Gs-coupled) on bronchial smooth muscle → adenylyl cyclase activation → increased cAMP → PKA activation → bronchial smooth muscle relaxation.",
      cellularDetail: "Albuterol binds to beta-2 adrenergic receptors on bronchial smooth muscle cells, activating Gs proteins that stimulate adenylyl cyclase and increase intracellular cAMP. cAMP activates protein kinase A (PKA), which phosphorylates multiple targets: (1) Myosin light chain kinase (MLCK) is phosphorylated, reducing its affinity for the calcium-calmodulin complex, thereby preventing myosin phosphorylation and smooth muscle contraction. (2) Potassium channel (BKCa) activation causes membrane hyperpolarization, reducing calcium influx through voltage-gated calcium channels. (3) IP3 receptor phosphorylation reduces calcium release from the sarcoplasmic reticulum. The net effect is rapid bronchial smooth muscle relaxation and relief of bronchospasm. Albuterol also inhibits mast cell mediator release (via beta-2 receptors on mast cells increasing cAMP) and enhances mucociliary clearance by stimulating ciliary beat frequency. Onset of action is 5-15 minutes via inhalation, peak effect in 30-60 minutes, and duration of 4-6 hours. Chronic overuse leads to beta-2 receptor downregulation (desensitization) through receptor internalization and reduced receptor density."
    },
    indications: ["Acute bronchospasm (rescue therapy)", "Asthma exacerbation", "COPD exacerbation", "Exercise-induced bronchospasm (prevention)", "Hyperkalemia (adjunct: drives K+ intracellularly)"],
    sideEffects: [
      { effect: "Tachycardia / palpitations", mechanism: "At higher doses, beta-2 selectivity decreases and beta-1 cardiac receptors are stimulated. Also, beta-2-mediated peripheral vasodilation triggers baroreceptor reflex tachycardia", severity: "common" },
      { effect: "Tremor", mechanism: "Beta-2 receptor stimulation in skeletal muscle increases cAMP, enhancing contractile activity and producing fine tremor particularly in the hands", severity: "common" },
      { effect: "Hypokalemia", mechanism: "Beta-2 receptor activation stimulates Na+/K+ ATPase in skeletal muscle cells, driving potassium intracellularly. This is therapeutically exploited for emergency hyperkalemia treatment", severity: "serious" },
      { effect: "Hyperglycemia", mechanism: "Beta-2 stimulation in the liver promotes glycogenolysis and gluconeogenesis. In pancreatic beta cells, beta-2 activation increases insulin secretion but the net effect is hyperglycemic due to hepatic glucose output", severity: "common" },
      { effect: "Paradoxical bronchospasm", mechanism: "Rarely, inhalation of the propellant, preservatives, or the nebulization process itself triggers reflex bronchospasm. Requires immediate discontinuation and alternative bronchodilator", severity: "serious" }
    ],
    nursingConsiderations: [
      "Rescue inhaler: use for acute symptoms only. If needing albuterol more than 2x/week, asthma is uncontrolled and controller therapy needs escalation",
      "Teach proper MDI technique: shake well, exhale fully, coordinate actuation with slow deep inhalation, hold breath 10 seconds. Consider spacer device for improved delivery",
      "Monitor heart rate and potassium in patients receiving frequent nebulized treatments (status asthmaticus)",
      "In status asthmaticus: continuous nebulization may be ordered. Monitor for tremor, tachycardia, and hypokalemia",
      "When used with inhaled corticosteroid: administer albuterol FIRST (opens airways) then wait 5 minutes before corticosteroid for optimal drug deposition"
    ],
    keyInteractions: [
      { drug: "Beta-blockers (non-selective)", consequence: "Reduced bronchodilator efficacy", mechanism: "Non-selective beta-blockers (propranolol) block beta-2 receptors, directly antagonizing albuterol's bronchodilatory effect. Cardioselective beta-blockers (metoprolol) are preferred if beta-blockade is needed" },
      { drug: "Loop diuretics", consequence: "Additive hypokalemia", mechanism: "Both albuterol (intracellular shift) and loop diuretics (renal excretion) reduce serum potassium through complementary mechanisms" },
      { drug: "Digoxin", consequence: "Increased digoxin toxicity", mechanism: "Albuterol-induced hypokalemia increases myocardial sensitivity to digoxin by reducing competition at the Na+/K+ ATPase binding site" }
    ],
    bodySystem: "Respiratory",
    relatedLessons: [{ id: "asthma", title: "Asthma" }, { id: "copd", title: "COPD" }]
  },
  {
    id: "ipratropium",
    genericName: "Ipratropium",
    brandNames: ["Atrovent"],
    drugClass: "Anticholinergic Bronchodilator",
    moaCategory: "Anticholinergic Bronchodilators",
    mechanismOfAction: {
      summary: "Blocks muscarinic (M3) receptors in bronchial smooth muscle, preventing acetylcholine-mediated bronchoconstriction and reducing mucus secretion. Provides bronchodilation through the parasympathetic pathway.",
      receptorPathway: "Vagus nerve → releases acetylcholine → M3 muscarinic receptors on bronchial smooth muscle (BLOCKED by ipratropium) → prevents Gq-mediated calcium release → prevents bronchoconstriction.",
      cellularDetail: "The parasympathetic nervous system (vagus nerve) maintains baseline bronchomotor tone through acetylcholine release onto M3 muscarinic receptors on bronchial smooth muscle. M3 receptors are Gq-coupled: they activate phospholipase C → IP3 production → calcium release from the sarcoplasmic reticulum → calmodulin binding → MLCK activation → myosin phosphorylation → bronchoconstriction. Ipratropium is a quaternary ammonium compound that competitively blocks M3 receptors, preventing this parasympathetic-mediated bronchoconstriction. Because it is a quaternary amine, it carries a permanent positive charge, limiting absorption across mucosal barriers and the blood-brain barrier. This produces local bronchial effects with minimal systemic anticholinergic toxicity. Ipratropium also blocks M3 receptors on submucosal glands, reducing mucus hypersecretion. It is particularly effective in COPD where vagal tone is the primary mechanism of reversible bronchospasm, and it is additive with beta-2 agonists because it works through an entirely independent (complementary) mechanism."
    },
    indications: ["COPD maintenance therapy", "Acute bronchospasm (combined with albuterol)", "Rhinorrhea (nasal spray)", "Asthma exacerbation (adjunct to SABA)"],
    sideEffects: [
      { effect: "Dry mouth", mechanism: "M3 blockade on salivary glands reduces serous secretion. The most common side effect of inhaled ipratropium", severity: "common" },
      { effect: "Urinary retention", mechanism: "Systemic absorption (minimal) can affect M3 receptors on the detrusor muscle, reducing bladder contractility. More relevant in elderly males with BPH", severity: "common" },
      { effect: "Paradoxical bronchospasm", mechanism: "Rarely, the aerosolized formulation or its additives can trigger reflexive bronchospasm, particularly with the first use of a new canister", severity: "serious" },
      { effect: "Blurred vision", mechanism: "If aerosol spray contacts the eye, M3 blockade on the ciliary muscle causes cycloplegia (inability to accommodate for near vision) and mydriasis", severity: "common" }
    ],
    nursingConsiderations: [
      "Often combined with albuterol (Combivent/DuoNeb) for synergistic bronchodilation through complementary mechanisms",
      "Onset of action is slower than albuterol (15-30 min vs 5-15 min): not ideal as sole rescue medication",
      "Instruct patient to avoid spraying into eyes: can precipitate acute angle-closure glaucoma in susceptible individuals",
      "Teach proper nebulizer or MDI technique; rinse mouth after inhalation to reduce dry mouth",
      "Monitor for urinary retention in elderly patients, especially males with BPH"
    ],
    keyInteractions: [
      { drug: "Other anticholinergics (tiotropium, oxybutynin)", consequence: "Additive anticholinergic effects", mechanism: "Combined muscarinic blockade increases risk of urinary retention, constipation, and dry mouth" },
      { drug: "Albuterol", consequence: "Synergistic bronchodilation (beneficial)", mechanism: "Beta-2 agonism (albuterol) and muscarinic blockade (ipratropium) produce bronchodilation through independent pathways, providing additive effect greater than either agent alone" }
    ],
    bodySystem: "Respiratory",
    relatedLessons: [{ id: "copd", title: "COPD" }, { id: "asthma", title: "Asthma" }]
  },
  {
    id: "fluticasone",
    genericName: "Fluticasone",
    brandNames: ["Flovent", "Flonase", "Arnuity Ellipta"],
    drugClass: "Inhaled Corticosteroid (ICS)",
    moaCategory: "Corticosteroids",
    mechanismOfAction: {
      summary: "Binds to intracellular glucocorticoid receptors, translocating to the nucleus to suppress inflammatory gene transcription and enhance anti-inflammatory gene expression, reducing airway inflammation, edema, and mucus production.",
      receptorPathway: "Fluticasone → crosses cell membrane → binds cytoplasmic glucocorticoid receptor (GR) → GR-ligand complex translocates to nucleus → binds glucocorticoid response elements (GREs) → modulates gene transcription.",
      cellularDetail: "Fluticasone is a highly lipophilic synthetic corticosteroid with strong affinity for the glucocorticoid receptor (GR). Upon binding, the GR-ligand complex dissociates from heat shock proteins (HSP90), dimerizes, and translocates to the nucleus. Transactivation: the GR dimer binds to glucocorticoid response elements (GREs) in promoter regions, upregulating anti-inflammatory proteins including lipocortin-1 (annexin A1, which inhibits phospholipase A2 and thus arachidonic acid release), IκBα (which sequesters NF-κB in the cytoplasm), and beta-2 receptor expression (restoring receptor sensitivity). Transrepression: the GR monomer directly interacts with pro-inflammatory transcription factors NF-κB and AP-1, preventing their binding to DNA and suppressing production of cytokines (IL-1, IL-4, IL-5, TNF-α), chemokines, adhesion molecules, and inflammatory enzymes (COX-2, iNOS). The net effect is reduced inflammatory cell recruitment (eosinophils, T-lymphocytes, mast cells), decreased vascular permeability and edema, reduced mucus hypersecretion, and restoration of epithelial integrity. Effects take days to weeks to fully develop because they require changes in gene transcription and protein synthesis."
    },
    indications: ["Asthma maintenance therapy (controller medication)", "Allergic rhinitis (nasal spray)", "COPD (in combination with LABA)"],
    sideEffects: [
      { effect: "Oral candidiasis (thrush)", mechanism: "Local immunosuppression in the oropharynx impairs mucosal immune defenses against Candida albicans. Steroid particles deposited in the mouth provide an environment conducive to fungal overgrowth", severity: "common" },
      { effect: "Dysphonia (hoarseness)", mechanism: "Steroid deposition on vocal cords causes localized myopathy of the laryngeal muscles and mucosal changes, affecting vocal cord vibration", severity: "common" },
      { effect: "Adrenal suppression (high doses/long-term)", mechanism: "Absorbed fluticasone can suppress the hypothalamic-pituitary-adrenal (HPA) axis via negative feedback on CRH and ACTH secretion, reducing endogenous cortisol production", severity: "serious" },
      { effect: "Growth suppression in children", mechanism: "Systemic corticosteroid effects on growth hormone axis and direct effects on epiphyseal chondrocyte proliferation can reduce linear growth velocity, though final adult height is usually unaffected", severity: "serious" },
      { effect: "Osteoporosis (long-term high doses)", mechanism: "Corticosteroids reduce osteoblast function, increase osteocyte apoptosis, and enhance RANKL-mediated osteoclast activation, reducing bone mineral density over time", severity: "serious" }
    ],
    nursingConsiderations: [
      "ALWAYS rinse mouth and spit after each inhalation to prevent oral candidiasis: this is the single most important patient education point",
      "Controller medication: must be used daily as prescribed even when asymptomatic. NOT a rescue inhaler — will not relieve acute bronchospasm",
      "Onset of benefit: 1-2 weeks for noticeable improvement; maximum benefit may take 4-8 weeks. Set realistic expectations",
      "Use spacer device with MDI formulation: improves lung deposition and reduces oropharyngeal side effects",
      "Monitor growth in pediatric patients on long-term ICS therapy. Use lowest effective dose",
      "If switching from oral corticosteroids to ICS: taper oral steroids gradually to prevent adrenal crisis"
    ],
    keyInteractions: [
      { drug: "Ritonavir / strong CYP3A4 inhibitors", consequence: "Increased systemic corticosteroid effects, Cushing syndrome", mechanism: "Ritonavir potently inhibits CYP3A4, dramatically reducing fluticasone hepatic metabolism and increasing systemic exposure up to 350-fold. This combination is contraindicated" },
      { drug: "Ketoconazole", consequence: "Increased fluticasone levels", mechanism: "CYP3A4 inhibition reduces first-pass metabolism of absorbed fluticasone, increasing systemic bioavailability and risk of adrenal suppression" }
    ],
    bodySystem: "Respiratory",
    relatedLessons: [{ id: "asthma", title: "Asthma" }, { id: "copd", title: "COPD" }]
  },
  {
    id: "montelukast",
    genericName: "Montelukast",
    brandNames: ["Singulair"],
    drugClass: "Leukotriene Receptor Antagonist (LTRA)",
    moaCategory: "Leukotriene Modifiers",
    mechanismOfAction: {
      summary: "Selectively blocks the cysteinyl leukotriene receptor (CysLT1) on bronchial smooth muscle, inflammatory cells, and vascular endothelium, preventing leukotriene-mediated bronchoconstriction, inflammation, and mucus production.",
      receptorPathway: "Arachidonic acid → 5-lipoxygenase → leukotriene A4 → leukotriene C4/D4/E4 (cysteinyl leukotrienes) → CysLT1 receptor (BLOCKED by montelukast) → prevents bronchoconstriction and inflammation.",
      cellularDetail: "Cysteinyl leukotrienes (LTC4, LTD4, LTE4) are potent lipid mediators produced from arachidonic acid by the 5-lipoxygenase pathway in mast cells, eosinophils, and alveolar macrophages. They are 100-1000 times more potent bronchoconstrictors than histamine. CysLT1 receptors are Gq-coupled receptors on bronchial smooth muscle, vascular endothelium, eosinophils, and mucus-secreting cells. Activation produces: (1) potent bronchial smooth muscle contraction via IP3-mediated calcium release, (2) increased vascular permeability and edema through endothelial cell contraction, (3) eosinophil recruitment and activation via chemotaxis, (4) mucus hypersecretion from goblet cell stimulation, (5) airway remodeling through smooth muscle proliferation. Montelukast competitively and selectively blocks CysLT1 receptors, preventing all these leukotriene-mediated effects. Importantly, leukotrienes are produced even in patients on corticosteroids (which inhibit phospholipase A2 upstream but do not directly block 5-lipoxygenase), making montelukast complementary to ICS therapy. Montelukast is particularly effective in aspirin-exacerbated respiratory disease (AERD), where COX-1 inhibition shunts arachidonic acid metabolism toward the leukotriene pathway."
    },
    indications: ["Asthma maintenance therapy (add-on to ICS)", "Exercise-induced bronchospasm (prevention)", "Allergic rhinitis (seasonal and perennial)", "Aspirin-exacerbated respiratory disease"],
    sideEffects: [
      { effect: "Neuropsychiatric events", mechanism: "CysLT1 receptors are expressed in the brain (hippocampus, cerebral cortex). Blockade may alter central leukotriene signaling involved in mood regulation, sleep, and behavior, though the exact mechanism is incompletely understood", severity: "serious" },
      { effect: "Headache", mechanism: "Alteration in cerebral vascular tone or neuroinflammatory signaling through leukotriene pathway modulation", severity: "common" },
      { effect: "Abdominal pain", mechanism: "CysLT1 receptors are present in the GI tract; their blockade may alter GI motility or mucosal function", severity: "common" },
      { effect: "Upper respiratory infection", mechanism: "Not a direct drug effect but commonly reported in clinical trials; may reflect altered immune modulation through leukotriene pathway changes", severity: "common" }
    ],
    nursingConsiderations: [
      "FDA boxed warning: Monitor for neuropsychiatric events including agitation, depression, suicidal thinking, hallucinations, and sleep disturbances. Educate caregivers to watch for behavioral changes in children",
      "NOT a rescue medication: will not relieve acute bronchospasm. Must be used as scheduled controller therapy",
      "Administer in the evening for asthma (leukotrienes peak nocturnally); timing is less critical for allergic rhinitis",
      "Can be taken with or without food. Chewable tablets available for pediatric patients",
      "Particularly effective in aspirin-sensitive asthma and exercise-induced bronchospasm where leukotriene overproduction is the primary pathology"
    ],
    blackBoxWarnings: ["Neuropsychiatric events: agitation, aggression, depression, suicidal thinking and behavior, hallucinations. Monitor closely and discontinue if symptoms develop."],
    keyInteractions: [
      { drug: "Phenobarbital / CYP3A4 inducers", consequence: "Reduced montelukast levels", mechanism: "CYP3A4 inducers increase hepatic metabolism of montelukast, reducing plasma concentrations and potentially reducing efficacy" },
      { drug: "Gemfibrozil", consequence: "Increased montelukast levels", mechanism: "Gemfibrozil inhibits CYP2C8, a secondary metabolic pathway for montelukast, increasing systemic exposure" }
    ],
    bodySystem: "Respiratory",
    relatedLessons: [{ id: "asthma", title: "Asthma" }, { id: "allergy-management", title: "Allergy Management" }]
  }
];
