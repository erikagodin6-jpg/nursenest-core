import type { Medication } from "./medications-types";

export const medicationsBatchD: Medication[] = [
  {
    id: "spironolactone",
    genericName: "Spironolactone",
    brandNames: ["Aldactone"],
    drugClass: "Potassium-Sparing Diuretic",
    moaCategory: "Diuretics",
    mechanismOfAction: {
      summary: "Competitively antagonizes aldosterone at the mineralocorticoid receptor in the distal convoluted tubule and collecting duct, preventing sodium reabsorption and potassium excretion.",
      receptorPathway: "Aldosterone normally binds mineralocorticoid receptor (MR) → translocates to nucleus → upregulates ENaC and Na+/K+ ATPase expression → sodium reabsorption and potassium secretion. Spironolactone blocks MR binding.",
      cellularDetail: "Aldosterone is a steroid hormone that enters principal cells of the collecting duct and binds intracellular mineralocorticoid receptors. The activated receptor-hormone complex translocates to the nucleus and acts as a transcription factor, upregulating expression of epithelial sodium channels (ENaC) on the luminal membrane and Na+/K+ ATPase on the basolateral membrane. This increases sodium reabsorption from tubular fluid and creates an electrochemical gradient that drives potassium secretion through ROMK channels. Spironolactone competitively binds the mineralocorticoid receptor, preventing aldosterone from initiating this transcriptional cascade. The result is mild natriuresis with potassium retention. Beyond its diuretic effects, spironolactone blocks aldosterone-mediated cardiac fibrosis and remodeling: this is the basis for its mortality benefit in heart failure (RALES trial). Because spironolactone also binds androgen and progesterone receptors due to structural similarity, it causes anti-androgenic side effects."
    },
    indications: ["Heart failure (NYHA III-IV)", "Resistant hypertension", "Primary hyperaldosteronism", "Ascites (hepatic cirrhosis)", "Hirsutism/acne (off-label anti-androgen)"],
    sideEffects: [
      { effect: "Hyperkalemia", mechanism: "Blocking aldosterone-mediated potassium secretion via ROMK channels in the collecting duct causes potassium retention. Risk is dramatically increased in renal impairment or when combined with ACE inhibitors/ARBs", severity: "life-threatening" },
      { effect: "Gynecomastia", mechanism: "Spironolactone's steroidal structure allows it to bind androgen receptors as an antagonist and increase peripheral conversion of testosterone to estradiol, causing breast tissue proliferation in males", severity: "common" },
      { effect: "Menstrual irregularities", mechanism: "Anti-androgenic and progestational effects disrupt hypothalamic-pituitary-gonadal axis feedback, causing irregular menstruation, amenorrhea, or postmenopausal bleeding", severity: "common" },
      { effect: "Metabolic acidosis (hyperchloremic)", mechanism: "Reduced hydrogen ion secretion in the collecting duct (aldosterone normally stimulates H+ ATPase) leads to type 4 renal tubular acidosis", severity: "serious" }
    ],
    nursingConsiderations: [
      "Monitor potassium levels closely: check baseline, within 1 week of initiation, and regularly thereafter. Hold if K+ > 5.0 mEq/L",
      "Teach patient to AVOID potassium supplements, salt substitutes (KCl), and potassium-rich foods in excess while on this medication",
      "Monitor for gynecomastia in male patients: if intolerable, eplerenone (Inspra) is a selective mineralocorticoid antagonist with fewer anti-androgenic effects",
      "Assess renal function (BUN/creatinine) regularly: declining GFR dramatically increases hyperkalemia risk",
      "In heart failure patients, this medication reduces mortality: emphasize adherence even when diuretic effect seems minimal"
    ],
    keyInteractions: [
      { drug: "ACE inhibitors / ARBs", consequence: "Severe hyperkalemia", mechanism: "Both drug classes reduce aldosterone-mediated potassium excretion through complementary mechanisms: ACE inhibitors reduce aldosterone synthesis while spironolactone blocks its receptor" },
      { drug: "Potassium supplements", consequence: "Life-threatening hyperkalemia", mechanism: "Exogenous potassium loading combined with impaired renal potassium excretion creates dangerous accumulation" },
      { drug: "Digoxin", consequence: "Increased digoxin levels", mechanism: "Spironolactone reduces renal tubular secretion of digoxin and may displace it from tissue binding sites, increasing serum concentration" }
    ],
    bodySystem: "Renal",
    relatedLessons: [{ id: "hf-advanced", title: "Heart Failure Advanced" }, { id: "aki-ckd", title: "AKI / CKD" }]
  },
  {
    id: "hydrochlorothiazide",
    genericName: "Hydrochlorothiazide",
    brandNames: ["Microzide", "HydroDIURIL"],
    drugClass: "Thiazide Diuretic",
    moaCategory: "Diuretics",
    mechanismOfAction: {
      summary: "Inhibits the sodium-chloride cotransporter (NCC) in the distal convoluted tubule, reducing sodium and chloride reabsorption and promoting diuresis.",
      receptorPathway: "NCC (SLC12A3) on luminal membrane of distal convoluted tubule → simultaneous Na+ and Cl- transport from lumen to cell. HCTZ blocks NCC → sodium and water remain in lumen → diuresis.",
      cellularDetail: "The distal convoluted tubule normally reabsorbs approximately 5-8% of filtered sodium via the thiazide-sensitive NCC cotransporter. HCTZ inhibits this transporter, increasing sodium delivery to the collecting duct where it is exchanged for potassium and hydrogen ions (via ENaC/ROMK), causing hypokalemia and metabolic alkalosis. Unlike loop diuretics, thiazides do not disrupt the medullary concentration gradient, making them less potent diuretics but more effective for chronic blood pressure control. The long-term antihypertensive mechanism extends beyond volume reduction: HCTZ causes direct arteriolar vasodilation through mechanisms involving reduced vascular smooth muscle calcium content (possibly via activation of calcium-activated potassium channels). Thiazides also decrease urinary calcium excretion by enhancing proximal tubule calcium reabsorption secondary to volume contraction and by upregulating TRPV5 calcium channels in the distal tubule: this makes them useful in preventing calcium kidney stones and in osteoporosis."
    },
    indications: ["Hypertension (first-line)", "Edema (mild)", "Calcium nephrolithiasis prevention", "Nephrogenic diabetes insipidus (paradoxical effect)"],
    sideEffects: [
      { effect: "Hypokalemia", mechanism: "Increased sodium delivery to collecting duct enhances ENaC-mediated Na+ reabsorption, generating a lumen-negative potential that drives K+ secretion through ROMK channels", severity: "serious" },
      { effect: "Hyperuricemia/gout", mechanism: "Volume contraction increases proximal tubule reabsorption of uric acid via URAT1 transporter. HCTZ also competes with uric acid for secretion via OAT transporters", severity: "common" },
      { effect: "Hyperglycemia", mechanism: "Hypokalemia impairs insulin secretion from pancreatic beta cells (K-ATP channel dysfunction) and reduces peripheral insulin sensitivity", severity: "common" },
      { effect: "Hypercalcemia", mechanism: "Volume contraction enhances proximal calcium reabsorption; direct stimulation of TRPV5 calcium channels and basolateral NCX exchanger in distal tubule increases calcium reabsorption", severity: "common" },
      { effect: "Hyponatremia", mechanism: "Impaired diluting capacity of the kidney (distal convoluted tubule is the cortical diluting segment) combined with continued ADH-mediated water reabsorption in collecting duct", severity: "serious" },
      { effect: "Hyperlipidemia", mechanism: "Mechanism incompletely understood; may relate to insulin resistance and altered hepatic lipid metabolism secondary to electrolyte disturbances", severity: "common" }
    ],
    nursingConsiderations: [
      "Monitor potassium, sodium, calcium, uric acid, and glucose levels regularly: thiazides affect multiple electrolytes simultaneously",
      "Administer in the morning to prevent nocturia and sleep disruption",
      "Teach patients about sun sensitivity: thiazides cause photosensitivity reactions. Recommend sunscreen and protective clothing",
      "Assess for sulfonamide allergy: HCTZ contains a sulfonamide group, though cross-reactivity is rare and debated",
      "Ineffective when GFR < 30 mL/min: switch to loop diuretic for patients with significant renal impairment"
    ],
    keyInteractions: [
      { drug: "Lithium", consequence: "Lithium toxicity", mechanism: "Thiazide-induced volume contraction increases proximal tubule lithium reabsorption (lithium follows sodium), raising serum levels to toxic range" },
      { drug: "Digoxin", consequence: "Digoxin toxicity", mechanism: "HCTZ-induced hypokalemia increases myocardial sensitivity to digoxin by reducing competition at the Na+/K+ ATPase binding site" },
      { drug: "NSAIDs", consequence: "Reduced antihypertensive and diuretic effect", mechanism: "NSAIDs inhibit renal prostaglandin synthesis, causing sodium and water retention that opposes the diuretic effect" }
    ],
    bodySystem: "Renal",
    relatedLessons: [{ id: "hypertension", title: "Hypertension Management" }, { id: "electrolytes", title: "Electrolyte Imbalances" }]
  },
  {
    id: "mannitol",
    genericName: "Mannitol",
    brandNames: ["Osmitrol"],
    drugClass: "Osmotic Diuretic",
    moaCategory: "Diuretics",
    mechanismOfAction: {
      summary: "Acts as an osmotic agent that is freely filtered at the glomerulus but not reabsorbed, creating an osmotic gradient that retains water in the renal tubule and draws water from intracellular and interstitial spaces.",
      receptorPathway: "No receptor binding. Mannitol exerts effects purely through osmotic pressure: freely filtered at glomerulus → remains in tubular lumen → osmotically obligates water to stay with it → diuresis.",
      cellularDetail: "Mannitol is a sugar alcohol (C6H14O6) that is pharmacologically inert: it does not bind any receptor or enzyme. Its mechanism is entirely physical-chemical. After IV administration, mannitol distributes into the extracellular fluid compartment, raising plasma osmolality. This osmotic gradient draws water from intracellular spaces (including brain cells and the vitreous humor of the eye) into the vascular space. In the kidney, mannitol is freely filtered at the glomerulus but is not reabsorbed by any tubular segment due to its molecular structure. Its presence in the tubular lumen creates an osmotic force that retains water, opposing the normal osmotic reabsorption of water. This produces a large-volume, electrolyte-dilute urine (osmotic diuresis). The cerebral dehydrating effect makes mannitol critical in managing raised intracranial pressure: by reducing brain cell water content, it decreases brain volume and ICP within 15-30 minutes of administration."
    },
    indications: ["Elevated intracranial pressure (cerebral edema)", "Acute angle-closure glaucoma (reduces intraocular pressure)", "Prevention of acute renal failure (oliguric phase)", "Forced diuresis for toxin elimination"],
    sideEffects: [
      { effect: "Volume overload / pulmonary edema", mechanism: "Initial osmotic effect draws water into the vascular space, expanding intravascular volume before diuresis begins. In patients with compromised cardiac function, this acute volume expansion can precipitate pulmonary edema", severity: "life-threatening" },
      { effect: "Electrolyte imbalances (hyponatremia, hyperkalemia)", mechanism: "Osmotic diuresis produces hypotonic urine loss. The initial osmotic shift dilutes serum sodium. Potassium shifts extracellularly as water moves out of cells", severity: "serious" },
      { effect: "Rebound intracranial hypertension", mechanism: "With prolonged use, mannitol eventually crosses a disrupted blood-brain barrier and accumulates in brain tissue, reversing the osmotic gradient and drawing water INTO the brain", severity: "serious" },
      { effect: "Acute kidney injury", mechanism: "In dehydrated patients, mannitol-induced osmotic nephropathy causes tubular epithelial cell swelling and vacuolization, obstructing the tubular lumen", severity: "serious" }
    ],
    nursingConsiderations: [
      "Administer through an in-line filter (0.22 micron): mannitol can crystallize at low temperatures. Inspect solution for crystals before administration and warm if crystallized",
      "Monitor serum osmolality: hold if osmol gap > 55 mOsm/kg or serum osmolality > 320 mOsm/kg to prevent renal injury",
      "Monitor strict intake and output: expect large urine volumes. Insert Foley catheter for accurate measurement in critically ill patients",
      "Assess for signs of volume overload before and during infusion: auscultate lungs, monitor CVP if available. Contraindicated in patients with pulmonary edema or anuria",
      "Monitor neurological status frequently when used for ICP management: pupillary response, GCS, and ICP readings if monitored"
    ],
    keyInteractions: [
      { drug: "Loop diuretics (furosemide)", consequence: "Profound diuresis and dehydration", mechanism: "Synergistic diuretic effect through different mechanisms: osmotic diuresis (mannitol) combined with NKCC2 inhibition (furosemide) can cause dangerous volume depletion" },
      { drug: "Lithium", consequence: "Reduced lithium levels", mechanism: "Osmotic diuresis increases renal lithium clearance, potentially reducing therapeutic levels below effective range" }
    ],
    bodySystem: "Renal",
    relatedLessons: [{ id: "icp-management", title: "ICP Management" }, { id: "aki-ckd", title: "AKI / CKD" }]
  },
  {
    id: "enoxaparin",
    genericName: "Enoxaparin",
    brandNames: ["Lovenox"],
    drugClass: "Low-Molecular-Weight Heparin (LMWH)",
    moaCategory: "Anticoagulants",
    mechanismOfAction: {
      summary: "Binds antithrombin III via a specific pentasaccharide sequence, preferentially catalyzing the inactivation of Factor Xa over thrombin due to its shorter chain length.",
      receptorPathway: "Enoxaparin pentasaccharide → binds antithrombin III → conformational change → primarily accelerates Factor Xa inactivation (~4:1 anti-Xa to anti-IIa ratio).",
      cellularDetail: "Enoxaparin is produced by alkaline depolymerization of unfractionated heparin, yielding fragments averaging 4,500 daltons (compared to 15,000 for UFH). Like UFH, enoxaparin contains the critical pentasaccharide sequence that binds antithrombin III. However, the shorter chain length means most fragments cannot simultaneously bridge antithrombin III and thrombin (which requires a minimum of 18 saccharides). Therefore, enoxaparin primarily inhibits Factor Xa (anti-Xa:anti-IIa ratio approximately 4:1). Factor Xa sits at the convergence of the intrinsic and extrinsic pathways, making it a strategic anticoagulant target. The shorter chain length also means less binding to plasma proteins, endothelial cells, and macrophages: this produces more predictable pharmacokinetics, longer half-life (4-5 hours vs 1-2 hours for UFH), and more reliable dose-response relationships. This predictability allows weight-based dosing without routine laboratory monitoring in most patients."
    },
    indications: ["DVT/PE prophylaxis (surgical, medical)", "DVT/PE treatment", "Acute coronary syndrome (NSTEMI)", "Bridge therapy"],
    sideEffects: [
      { effect: "Hemorrhage", mechanism: "Factor Xa inhibition prevents thrombin generation from both intrinsic and extrinsic pathways, impairing normal hemostasis at sites of vascular injury", severity: "life-threatening" },
      { effect: "HIT (heparin-induced thrombocytopenia)", mechanism: "Cross-reactivity with heparin-PF4 antibodies is possible but less frequent than with UFH due to reduced binding to platelet factor 4. Risk is approximately 0.1% vs 1-3% for UFH", severity: "life-threatening" },
      { effect: "Injection site hematoma/ecchymosis", mechanism: "Subcutaneous administration into adipose tissue with local anticoagulant effect causes small vessel hemorrhage at injection site", severity: "common" },
      { effect: "Spinal/epidural hematoma", mechanism: "In patients with indwelling epidural catheters or recent neuraxial procedures, even minor bleeding in the confined epidural space can cause cord compression", severity: "life-threatening" }
    ],
    nursingConsiderations: [
      "Administer subcutaneously into the abdomen (love handles): alternate left and right sides. NEVER administer IM. Do not expel air bubble from prefilled syringe",
      "Do NOT rub injection site: this causes bruising. Apply gentle pressure only",
      "Routine aPTT monitoring is NOT required (predictable dose-response). Anti-Xa levels are monitored in obesity, renal impairment, and pregnancy",
      "Assess renal function: enoxaparin is renally cleared. Dose adjustment required when CrCl < 30 mL/min (reduce to once daily)",
      "Protamine sulfate provides only partial reversal (~60% of anti-Xa activity neutralized): important to know for surgical emergencies",
      "Monitor platelet count: check baseline and periodically. Although HIT risk is lower than UFH, it can still occur"
    ],
    blackBoxWarnings: ["Spinal/epidural hematoma risk in patients receiving neuraxial anesthesia or spinal puncture. Risk increased by indwelling epidural catheters, concomitant drugs affecting hemostasis, traumatic or repeated puncture, or spinal deformity."],
    keyInteractions: [
      { drug: "Antiplatelet agents (aspirin, clopidogrel)", consequence: "Increased bleeding risk", mechanism: "Dual pathway inhibition: antiplatelet agents impair primary hemostasis while enoxaparin impairs secondary hemostasis (coagulation cascade)" },
      { drug: "NSAIDs", consequence: "Increased bleeding risk", mechanism: "COX inhibition impairs platelet thromboxane A2 production and causes GI mucosal injury, creating both systemic and local hemorrhagic risk" }
    ],
    bodySystem: "Hematology",
    relatedLessons: [{ id: "dvt-pe", title: "DVT / PE" }, { id: "perioperative-care", title: "Perioperative Care" }]
  },
  {
    id: "alteplase",
    genericName: "Alteplase (tPA)",
    brandNames: ["Activase", "Cathflo Activase"],
    drugClass: "Thrombolytic (Fibrinolytic)",
    moaCategory: "Thrombolytics",
    mechanismOfAction: {
      summary: "A recombinant tissue plasminogen activator that converts plasminogen to plasmin, the enzyme responsible for dissolving fibrin clots.",
      receptorPathway: "Alteplase binds fibrin in the clot → selectively activates fibrin-bound plasminogen → plasmin generation → fibrin degradation → clot dissolution.",
      cellularDetail: "Alteplase is a serine protease identical to endogenous tissue plasminogen activator (tPA). It preferentially binds to fibrin in a thrombus, creating a ternary complex with plasminogen that is also bound to fibrin. This fibrin-bound configuration dramatically accelerates plasminogen conversion to plasmin (approximately 400-fold enhancement compared to circulating plasminogen). Plasmin is a broad-spectrum serine protease that cleaves fibrin polymers at multiple lysine and arginine residues, dissolving the structural framework of the clot. The relative fibrin selectivity means alteplase preferentially activates plasminogen at the clot surface rather than systemically, though at therapeutic doses significant systemic plasminogen activation still occurs, consuming fibrinogen and factors V and VIII and creating a systemic lytic state. The resulting fibrin degradation products (including D-dimer) also have anticoagulant properties, further impairing hemostasis."
    },
    indications: ["Acute ischemic stroke (within 3-4.5 hours of onset)", "Acute STEMI (when PCI is unavailable)", "Massive pulmonary embolism (with hemodynamic instability)", "Central venous catheter occlusion"],
    sideEffects: [
      { effect: "Hemorrhage (including intracranial hemorrhage)", mechanism: "Systemic plasmin generation degrades fibrinogen, Factor V, and Factor VIII, creating a systemic lytic state that impairs hemostasis at all sites. Intracranial hemorrhage risk is 6-7% in stroke patients", severity: "life-threatening" },
      { effect: "Angioedema (orolingual)", mechanism: "Plasmin activates the complement and kinin-kallikrein cascades, generating bradykinin that increases vascular permeability. More common in patients on ACE inhibitors (which also increase bradykinin)", severity: "serious" },
      { effect: "Reperfusion arrhythmias", mechanism: "Rapid restoration of blood flow to ischemic myocardium causes washout of accumulated metabolic waste (lactate, potassium) and generation of reactive oxygen species, triggering electrical instability", severity: "serious" }
    ],
    nursingConsiderations: [
      "For acute stroke: verify symptom onset within treatment window (3-4.5 hours). CT scan MUST rule out hemorrhagic stroke before administration",
      "Assess all absolute contraindications: active internal bleeding, recent (3 months) intracranial surgery/stroke/head trauma, known intracranial neoplasm, suspected aortic dissection",
      "During infusion and for 24 hours after: avoid arterial puncture, IM injections, urinary catheter insertion, NG tube placement. Minimize venipuncture",
      "Perform neurological assessments every 15 minutes during infusion, every 30 minutes for 6 hours, then hourly for 24 hours. Any deterioration may indicate intracranial hemorrhage",
      "Monitor for signs of bleeding: hematuria, hematemesis, bleeding from IV sites, gum bleeding, changes in mental status",
      "Have aminocaproic acid (Amicar) or tranexamic acid available as antifibrinolytic reversal agents"
    ],
    blackBoxWarnings: ["Risk of serious and potentially fatal hemorrhage, including intracranial hemorrhage."],
    keyInteractions: [
      { drug: "Anticoagulants (heparin, warfarin)", consequence: "Dramatically increased hemorrhage risk", mechanism: "Simultaneous impairment of fibrinolysis (alteplase), coagulation cascade (heparin/warfarin), and physiologic hemostasis creates catastrophic bleeding potential" },
      { drug: "Antiplatelet agents (aspirin, clopidogrel)", consequence: "Increased bleeding risk", mechanism: "Impaired platelet plug formation combined with active fibrinolysis eliminates both primary and secondary hemostatic mechanisms" }
    ],
    bodySystem: "Hematology",
    relatedLessons: [{ id: "stroke-management", title: "Stroke Management" }, { id: "mi-management", title: "MI Management" }]
  },
  {
    id: "acetaminophen",
    genericName: "Acetaminophen",
    brandNames: ["Tylenol", "Ofirmev (IV)"],
    drugClass: "Non-Opioid Analgesic / Antipyretic",
    moaCategory: "Non-Opioid Analgesics",
    mechanismOfAction: {
      summary: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamus to produce analgesic and antipyretic effects without significant peripheral anti-inflammatory activity.",
      receptorPathway: "Central COX-2 (and possibly COX-3) inhibition → reduced prostaglandin E2 (PGE2) synthesis in hypothalamic thermoregulatory center → antipyresis. Central PGE2 reduction also modulates descending pain inhibitory pathways.",
      cellularDetail: "Unlike NSAIDs, acetaminophen's COX inhibition is primarily central (brain and spinal cord) rather than peripheral. The exact mechanism remains debated but involves: (1) Inhibition of the peroxidase function of COX enzymes, which is effective in the low-peroxide environment of the CNS but not in peripheral inflamed tissues where peroxide concentrations are high. (2) Possible inhibition of a COX isoform variant (COX-3) expressed primarily in the cerebral cortex. (3) Activation of descending serotonergic pain inhibitory pathways. (4) Interaction with the endocannabinoid system: acetaminophen's metabolite AM404 inhibits anandamide reuptake, activating cannabinoid CB1 receptors. The lack of peripheral COX inhibition explains why acetaminophen has no clinically significant anti-inflammatory or antiplatelet effects. Hepatotoxicity occurs because CYP2E1-mediated metabolism produces N-acetyl-p-benzoquinone imine (NAPQI), a reactive metabolite normally conjugated by glutathione. When glutathione stores are depleted (overdose, chronic alcohol use, malnutrition), NAPQI causes hepatocellular necrosis."
    },
    indications: ["Mild to moderate pain", "Fever reduction", "Osteoarthritis", "Headache/migraine (adjunctive)", "Post-procedural analgesia"],
    sideEffects: [
      { effect: "Hepatotoxicity (overdose)", mechanism: "CYP2E1 converts acetaminophen to NAPQI. At therapeutic doses, glutathione conjugates NAPQI safely. At doses exceeding 4g/day (less in alcoholics/malnourished), glutathione depletion allows NAPQI to covalently bind hepatocyte proteins, causing centrilobular necrosis", severity: "life-threatening" },
      { effect: "Acute liver failure", mechanism: "Massive hepatocellular necrosis from NAPQI accumulation overwhelms hepatic regenerative capacity, leading to coagulopathy, encephalopathy, and multi-organ failure", severity: "life-threatening" },
      { effect: "Allergic reactions (rare)", mechanism: "Immune-mediated hypersensitivity reactions including urticaria and anaphylaxis, though extremely rare compared to NSAIDs", severity: "serious" }
    ],
    nursingConsiderations: [
      "Maximum daily dose: 4g/day for healthy adults, 2g/day for patients with hepatic impairment or chronic alcohol use. Track ALL sources including combination products (Vicodin, Percocet, NyQuil)",
      "N-acetylcysteine (NAC) is the antidote for overdose: replenishes glutathione stores. Most effective within 8 hours of ingestion but beneficial up to 72 hours. Administer per Rumack-Matthew nomogram",
      "Assess liver function (AST, ALT) in patients on chronic therapy or those with risk factors for hepatotoxicity",
      "Does NOT have anti-inflammatory properties: not appropriate as sole therapy for inflammatory conditions (rheumatoid arthritis, acute gout)",
      "Safe in pregnancy (preferred analgesic/antipyretic). Safe for patients who cannot take NSAIDs (GI bleeding risk, renal impairment, aspirin-sensitive asthma)"
    ],
    blackBoxWarnings: ["Hepatotoxicity: Acetaminophen has been associated with cases of acute liver failure, at times resulting in liver transplant and death. Most cases involve doses exceeding 4,000 mg/day and often involve more than one acetaminophen-containing product."],
    keyInteractions: [
      { drug: "Alcohol (chronic use)", consequence: "Increased hepatotoxicity risk", mechanism: "Chronic alcohol use induces CYP2E1, increasing NAPQI production, while simultaneously depleting glutathione stores needed for NAPQI detoxification" },
      { drug: "Warfarin", consequence: "Increased INR at regular doses", mechanism: "Acetaminophen metabolite (NAPQI) may inhibit vitamin K-dependent carboxylase enzymes. Regular use of >2g/day can increase INR by 1-2 points" },
      { drug: "Isoniazid", consequence: "Increased hepatotoxicity risk", mechanism: "Isoniazid induces CYP2E1 and is itself hepatotoxic, creating dual hepatotoxic insult with increased NAPQI formation" }
    ],
    bodySystem: "Neurological",
    relatedLessons: [{ id: "pain-management", title: "Pain Management" }, { id: "liver-disorders", title: "Liver Disorders" }]
  },
  {
    id: "ibuprofen",
    genericName: "Ibuprofen",
    brandNames: ["Advil", "Motrin"],
    drugClass: "Nonsteroidal Anti-Inflammatory Drug (NSAID)",
    moaCategory: "NSAIDs",
    mechanismOfAction: {
      summary: "Reversibly inhibits both cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes, blocking prostaglandin and thromboxane synthesis to produce anti-inflammatory, analgesic, and antipyretic effects.",
      receptorPathway: "Arachidonic acid → COX-1/COX-2 (blocked by ibuprofen) → Prostaglandins (PGE2, PGI2, PGD2) and Thromboxane A2. Blocking this pathway reduces inflammation, pain sensitization, fever, and platelet aggregation.",
      cellularDetail: "COX enzymes convert arachidonic acid (released from membrane phospholipids by phospholipase A2) into prostaglandin H2, the precursor to all prostaglandins and thromboxane A2. COX-1 is constitutively expressed and produces prostaglandins that maintain GI mucosal integrity (PGE2 stimulates mucus and bicarbonate secretion, reduces acid secretion), renal perfusion (PGE2 and PGI2 vasodilate afferent arterioles), and platelet aggregation (thromboxane A2). COX-2 is inducible and upregulated at sites of inflammation, producing prostaglandins that mediate pain (PGE2 sensitizes nociceptors to bradykinin and histamine), fever (PGE2 raises the hypothalamic set point), and inflammation (vasodilation, increased vascular permeability). Ibuprofen non-selectively inhibits both isoforms. The anti-inflammatory and analgesic effects come primarily from COX-2 inhibition, while the adverse effects (GI ulceration, renal impairment, bleeding) come primarily from COX-1 inhibition. Ibuprofen's inhibition is reversible (unlike aspirin's irreversible acetylation), so platelet function recovers as the drug is cleared."
    },
    indications: ["Mild to moderate pain", "Fever reduction", "Inflammatory conditions (rheumatoid arthritis, osteoarthritis)", "Dysmenorrhea", "Patent ductus arteriosus closure (IV in neonates)"],
    sideEffects: [
      { effect: "GI ulceration/bleeding", mechanism: "COX-1 inhibition reduces protective prostaglandin PGE2 synthesis in gastric mucosa: decreased mucus production, decreased bicarbonate secretion, and reduced mucosal blood flow expose epithelium to acid damage", severity: "serious" },
      { effect: "Acute kidney injury", mechanism: "In volume-depleted states, renal prostaglandins (PGE2, PGI2) maintain afferent arteriolar vasodilation to preserve GFR. COX inhibition removes this compensatory mechanism, causing afferent arteriolar constriction and decreased renal perfusion", severity: "serious" },
      { effect: "Cardiovascular events (MI, stroke)", mechanism: "COX-2 inhibition reduces endothelial PGI2 (prostacyclin: vasodilator and antiplatelet) while COX-1-derived thromboxane A2 production may be incompletely suppressed, creating a prothrombotic imbalance", severity: "serious" },
      { effect: "Prolonged bleeding time", mechanism: "COX-1 inhibition in platelets reduces thromboxane A2 synthesis, impairing platelet aggregation and primary hemostasis. Effect is reversible and duration-limited (clears in 24 hours)", severity: "common" },
      { effect: "Hypertension", mechanism: "Reduced renal prostaglandin synthesis impairs natriuresis, causing sodium and water retention that increases blood volume and blood pressure", severity: "common" }
    ],
    nursingConsiderations: [
      "Administer with food or milk to reduce GI irritation. For patients at high GI risk, co-prescribe a PPI (omeprazole) for gastroprotection",
      "Monitor renal function (BUN/creatinine) especially in elderly, volume-depleted, or patients with pre-existing renal disease",
      "Assess for bleeding: GI (black/tarry stools, hematemesis), bruising, prolonged bleeding from cuts",
      "Avoid in third trimester of pregnancy: prostaglandin inhibition causes premature closure of the ductus arteriosus and oligohydramnios",
      "Teach patients to avoid concurrent use with aspirin for cardioprotection: ibuprofen can block aspirin's access to COX-1 in platelets, negating its cardioprotective antiplatelet effect"
    ],
    keyInteractions: [
      { drug: "Aspirin (low-dose cardioprotective)", consequence: "Negated cardioprotective effect", mechanism: "Ibuprofen reversibly occupies the COX-1 active site, preventing aspirin's irreversible acetylation. If ibuprofen is taken first, aspirin cannot permanently inactivate platelet COX-1" },
      { drug: "ACE inhibitors / ARBs", consequence: "Reduced antihypertensive effect, increased renal risk", mechanism: "NSAIDs cause sodium retention (opposing antihypertensive effect) and afferent arteriolar constriction while ACE/ARBs cause efferent dilation: combined reduction of glomerular filtration pressure can precipitate AKI" },
      { drug: "Anticoagulants (warfarin, heparin)", consequence: "Increased bleeding risk", mechanism: "COX-1 inhibition impairs platelet function and causes GI mucosal damage, creating synergistic hemorrhagic risk with anticoagulants" }
    ],
    bodySystem: "Musculoskeletal",
    relatedLessons: [{ id: "pain-management", title: "Pain Management" }, { id: "aki-ckd", title: "AKI / CKD" }]
  },
  {
    id: "ketorolac",
    genericName: "Ketorolac",
    brandNames: ["Toradol"],
    drugClass: "Nonsteroidal Anti-Inflammatory Drug (NSAID)",
    moaCategory: "NSAIDs",
    mechanismOfAction: {
      summary: "Potent, non-selective COX-1 and COX-2 inhibitor providing analgesic efficacy comparable to moderate-dose opioids, primarily through peripheral and central prostaglandin synthesis inhibition.",
      receptorPathway: "Same as ibuprofen: arachidonic acid → COX-1/COX-2 (blocked) → reduced prostaglandins and thromboxane. Ketorolac's analgesic potency exceeds its anti-inflammatory effect.",
      cellularDetail: "Ketorolac is one of the most potent non-selective COX inhibitors available, with analgesic efficacy comparable to 6-12 mg of morphine. Its profound analgesic effect is attributed to: (1) Potent peripheral COX-2 inhibition at sites of tissue injury, reducing PGE2-mediated nociceptor sensitization. (2) Central COX inhibition in the spinal cord dorsal horn, reducing prostaglandin-mediated central sensitization and wind-up. (3) Possible additional analgesic mechanisms beyond COX inhibition, including modulation of descending pain pathways. However, its potent COX-1 inhibition produces dose-dependent GI toxicity and platelet dysfunction that limits its use to a maximum of 5 days. The GI and renal toxicity risk is significantly higher than with other NSAIDs due to its potency: even short courses can cause clinically significant GI bleeding, especially in elderly patients."
    },
    indications: ["Moderate to severe acute pain (short-term, ≤5 days)", "Post-operative pain (opioid-sparing)", "Renal colic", "Migraine (acute treatment)"],
    sideEffects: [
      { effect: "GI bleeding/ulceration", mechanism: "Potent COX-1 inhibition severely reduces gastric mucosal protection. Risk is dose-dependent and increases dramatically with duration of use and in elderly patients", severity: "life-threatening" },
      { effect: "Acute kidney injury", mechanism: "Potent renal prostaglandin inhibition can cause acute papillary necrosis and interstitial nephritis, particularly in volume-depleted or renally compromised patients", severity: "serious" },
      { effect: "Bleeding (surgical site, GI)", mechanism: "Profound platelet thromboxane A2 inhibition impairs platelet aggregation and primary hemostasis. Clinically significant in perioperative settings", severity: "serious" },
      { effect: "Cardiovascular thrombotic events", mechanism: "Non-selective COX inhibition at high potency creates prothrombotic imbalance similar to other NSAIDs but with increased risk due to potency", severity: "serious" }
    ],
    nursingConsiderations: [
      "STRICT 5-day maximum for ALL routes combined (PO, IV, IM): exceeding this dramatically increases GI and renal toxicity risk",
      "Contraindicated in patients with active or history of peptic ulcer disease, GI bleeding, advanced renal disease, or high bleeding risk",
      "Not for use in labor and delivery: prostaglandin inhibition can impair uterine contractions and promote fetal ductus arteriosus closure",
      "Useful as opioid-sparing strategy in multimodal pain management: can reduce opioid requirements by 25-50% post-operatively",
      "Administer IV over at least 15 seconds. IM injection should be given deeply into a large muscle mass"
    ],
    blackBoxWarnings: ["Increased risk of serious cardiovascular thrombotic events, GI bleeding, ulceration, and perforation. Contraindicated for perioperative pain in CABG surgery. Limited to 5 days of use."],
    keyInteractions: [
      { drug: "Anticoagulants (heparin, enoxaparin, warfarin)", consequence: "Severe hemorrhage risk", mechanism: "Ketorolac's potent antiplatelet effect combined with anticoagulation creates profound hemostatic impairment" },
      { drug: "Other NSAIDs or aspirin", consequence: "Additive GI and renal toxicity", mechanism: "Concurrent COX inhibition compounds mucosal damage and renal prostaglandin depletion without additive analgesic benefit" },
      { drug: "Probenecid", consequence: "Increased ketorolac levels", mechanism: "Probenecid inhibits renal tubular secretion and glucuronide conjugation of ketorolac, increasing plasma concentration and half-life" }
    ],
    bodySystem: "Musculoskeletal",
    relatedLessons: [{ id: "pain-management", title: "Pain Management" }, { id: "perioperative-care", title: "Perioperative Care" }]
  },
  {
    id: "fentanyl",
    genericName: "Fentanyl",
    brandNames: ["Sublimaze", "Duragesic", "Actiq", "Subsys"],
    drugClass: "Opioid Agonist (Synthetic)",
    moaCategory: "Opioid Analgesics",
    mechanismOfAction: {
      summary: "Highly potent synthetic mu-opioid receptor agonist (50-100x more potent than morphine) that inhibits pain signal transmission through the same G-protein coupled receptor mechanisms as morphine.",
      receptorPathway: "Mu-opioid receptors (MOR) → Gi protein → inhibits adenylyl cyclase → decreases cAMP. Same pathway as morphine but fentanyl's high lipophilicity allows rapid CNS penetration and receptor binding.",
      cellularDetail: "Fentanyl activates mu-opioid receptors identically to morphine at the cellular level: presynaptic calcium channel closure, postsynaptic potassium channel opening, and descending inhibitory pathway activation. However, fentanyl's phenylpiperidine structure gives it dramatically higher lipid solubility compared to morphine's hydrophilic structure. This has critical pharmacokinetic implications: (1) Rapid onset: high lipophilicity enables fentanyl to cross the blood-brain barrier within seconds of IV administration (onset 1-2 minutes vs 5-15 minutes for morphine). (2) Potency: fentanyl has approximately 50-100x the molar potency of morphine at mu receptors, attributed to both receptor binding affinity and enhanced CNS access. (3) Short duration after single dose: rapid redistribution from the brain to muscle and fat produces a short clinical duration (30-60 minutes IV) despite high potency. However, with repeated dosing or continuous infusion, tissue saturation eliminates the redistribution effect, causing prolonged duration (context-sensitive half-time increases). (4) Transdermal delivery: lipophilicity enables skin penetration for sustained-release patch formulations. Fentanyl does NOT cause histamine release (unlike morphine), making it preferred in hemodynamically unstable patients."
    },
    indications: ["Severe pain management (acute and chronic)", "Surgical anesthesia (IV)", "Breakthrough cancer pain (transmucosal)", "Chronic pain (transdermal patch)", "Procedural sedation (IV)"],
    sideEffects: [
      { effect: "Respiratory depression", mechanism: "Identical to morphine: mu receptor activation in the pre-Bötzinger complex reduces chemosensitivity to CO2. More dangerous due to potency: small dosing errors can cause profound respiratory arrest", severity: "life-threatening" },
      { effect: "Chest wall rigidity (wooden chest syndrome)", mechanism: "Rapid IV bolus of high doses activates mu receptors in the striatum and brainstem, causing generalized skeletal muscle rigidity including the intercostal and diaphragm muscles, making ventilation impossible without neuromuscular blockade", severity: "life-threatening" },
      { effect: "Bradycardia", mechanism: "Central vagal nucleus stimulation increases parasympathetic output to the heart. Unlike morphine, fentanyl does not cause histamine-mediated tachycardia to counterbalance this effect", severity: "serious" },
      { effect: "Constipation", mechanism: "Same as morphine: mu receptor activation in the enteric nervous system inhibits peristalsis. No tolerance develops with chronic use", severity: "common" },
      { effect: "Delayed respiratory depression (patch)", mechanism: "Transdermal fentanyl creates a subcutaneous depot that continues to release drug for 12-24 hours after patch removal. Temperature increases (fever, heating pads) increase absorption rate unpredictably", severity: "life-threatening" }
    ],
    nursingConsiderations: [
      "50-100x more potent than morphine: always double-check dose calculations. High-alert medication requiring independent verification",
      "For transdermal patches: do NOT cut patches (disrupts controlled-release mechanism and causes dose dumping). Apply to non-irradiated, non-hairy, intact skin on upper body. Remove old patch before applying new one",
      "NEVER expose fentanyl patches to heat sources (heating pads, electric blankets, hot tubs, fever): heat increases drug release rate and can cause fatal overdose",
      "Monitor respiratory rate and oxygen saturation continuously in opioid-naive patients. Have naloxone immediately available",
      "Chest wall rigidity: if it occurs, treat with naloxone AND/OR neuromuscular blocking agent (succinylcholine) to enable ventilation",
      "For transdermal: onset is 12-24 hours. Do NOT use for acute pain. Provide breakthrough medication during patch initiation"
    ],
    blackBoxWarnings: ["Life-threatening respiratory depression, accidental exposure (especially in children), abuse potential, neonatal withdrawal, interaction with CYP3A4 inhibitors, transdermal patch application errors."],
    keyInteractions: [
      { drug: "CYP3A4 inhibitors (ketoconazole, erythromycin, ritonavir, grapefruit juice)", consequence: "Increased fentanyl levels and respiratory depression", mechanism: "CYP3A4 is the primary metabolic pathway for fentanyl. Inhibitors reduce clearance, increasing plasma concentration and duration of effect" },
      { drug: "Benzodiazepines / CNS depressants", consequence: "Profound respiratory depression, coma, death", mechanism: "Synergistic CNS depression through complementary mechanisms: mu receptor activation (fentanyl) plus GABA potentiation (benzodiazepines)" },
      { drug: "Serotonergic drugs (SSRIs, MAOIs)", consequence: "Serotonin syndrome", mechanism: "Fentanyl has weak serotonin reuptake inhibitor properties. Combined with other serotonergic agents, can produce life-threatening serotonin excess" }
    ],
    bodySystem: "Neurological",
    relatedLessons: [{ id: "pain-management", title: "Pain Management" }, { id: "anesthesia-sedation", title: "Anesthesia & Sedation" }]
  },
  {
    id: "hydromorphone",
    genericName: "Hydromorphone",
    brandNames: ["Dilaudid", "Exalgo"],
    drugClass: "Opioid Agonist (Semi-Synthetic)",
    moaCategory: "Opioid Analgesics",
    mechanismOfAction: {
      summary: "Semi-synthetic opioid agonist approximately 5-7x more potent than morphine, binding mu-opioid receptors to produce analgesia through the same cellular mechanisms as morphine.",
      receptorPathway: "Mu-opioid receptors → Gi protein → decreased cAMP → reduced neurotransmitter release. Same as morphine but with higher receptor binding affinity and enhanced lipophilicity.",
      cellularDetail: "Hydromorphone is a hydrogenated ketone of morphine with enhanced lipophilicity compared to the parent compound. This structural modification produces: (1) Higher mu-receptor binding affinity: approximately 5-7x the potency of morphine on a milligram-per-milligram basis. (2) Faster onset: increased lipid solubility allows faster blood-brain barrier penetration (IV onset 5 minutes, peak 10-20 minutes). (3) Shorter duration: 3-4 hours compared to morphine's 4-6 hours. (4) Reduced histamine release compared to morphine: produces less vasodilation, pruritus, and bronchospasm. Cellular effects are identical to morphine: presynaptic voltage-gated calcium channel inhibition, postsynaptic GIRK channel opening causing hyperpolarization, and descending inhibitory pathway activation. Hydromorphone is metabolized hepatically primarily by glucuronidation to hydromorphone-3-glucuronide (H3G), a neuroexcitatory metabolite that can cause myoclonus, agitation, and seizures: this is clinically significant in renal impairment where H3G accumulates."
    },
    indications: ["Moderate to severe pain", "Post-operative pain", "Cancer pain", "Chronic pain (extended-release)"],
    sideEffects: [
      { effect: "Respiratory depression", mechanism: "Mu receptor activation in the medullary respiratory center reduces ventilatory drive. Potency makes dose errors more dangerous: 1 mg hydromorphone = 5-7 mg morphine", severity: "life-threatening" },
      { effect: "Neuroexcitation (myoclonus, seizures)", mechanism: "Accumulation of hydromorphone-3-glucuronide (H3G), a neuroexcitatory metabolite, in patients with renal impairment. H3G activates NMDA receptors and inhibits glycine-mediated inhibition", severity: "serious" },
      { effect: "Hypotension", mechanism: "Less histamine release than morphine but still causes vasodilation through central sympatholytic effects and direct vascular smooth muscle relaxation", severity: "serious" },
      { effect: "Constipation", mechanism: "Mu receptor activation in enteric nervous system inhibits peristalsis: no tolerance develops. Identical mechanism to morphine", severity: "common" },
      { effect: "Nausea/vomiting", mechanism: "Chemoreceptor trigger zone stimulation and vestibular pathway activation. Tolerance typically develops within days of initiation", severity: "common" }
    ],
    nursingConsiderations: [
      "HIGH-ALERT medication: 5-7x more potent than morphine. DILAUDID-morphine confusion is a common and potentially fatal error. Always verify drug name and dose independently",
      "Assess respiratory rate, depth, and SpO2 before each dose. Hold for RR < 12 and notify provider. Naloxone must be immediately available",
      "Preferred over morphine in renal impairment for SHORT-TERM use (no active morphine-6-glucuronide metabolite), but H3G accumulation with prolonged use can cause neuroexcitation",
      "IV push: administer slowly over 2-3 minutes to reduce respiratory depression and hypotension risk",
      "Equianalgesic dosing: 1.5 mg IV hydromorphone ≈ 10 mg IV morphine. Always use equianalgesic conversion tables when switching opioids"
    ],
    blackBoxWarnings: ["Respiratory depression, abuse potential, neonatal withdrawal syndrome, interaction with CNS depressants/benzodiazepines, accidental ingestion can cause fatal overdose in children."],
    keyInteractions: [
      { drug: "Benzodiazepines / CNS depressants", consequence: "Profound respiratory depression, coma, death", mechanism: "Synergistic CNS depression from combined mu-receptor activation and GABAergic potentiation" },
      { drug: "MAO inhibitors", consequence: "Severe respiratory depression, serotonin syndrome", mechanism: "Unpredictable neurotransmitter excess from impaired monoamine metabolism combined with opioid-mediated CNS depression" }
    ],
    bodySystem: "Neurological",
    relatedLessons: [{ id: "pain-management", title: "Pain Management" }, { id: "palliative-care", title: "Palliative Care" }]
  },
  {
    id: "magnesium-sulfate",
    genericName: "Magnesium Sulfate",
    brandNames: ["MgSO4"],
    drugClass: "Electrolyte / Tocolytic / Anticonvulsant",
    moaCategory: "Electrolytes",
    mechanismOfAction: {
      summary: "Acts as a physiologic calcium antagonist and NMDA receptor blocker, reducing neuromuscular excitability, preventing seizures in eclampsia, and relaxing smooth muscle including the myometrium.",
      receptorPathway: "Mg2+ competes with Ca2+ at voltage-gated calcium channels → reduces calcium influx → decreased neurotransmitter release and muscle contraction. Also blocks NMDA glutamate receptors → reduces excitatory neurotransmission.",
      cellularDetail: "Magnesium exerts multiple cellular effects through its role as a physiologic calcium antagonist: (1) Neuromuscular junction: Mg2+ competes with Ca2+ at presynaptic voltage-gated calcium channels, reducing calcium influx needed for acetylcholine vesicle release. This produces neuromuscular blockade and reduces skeletal muscle excitability. (2) NMDA receptor blockade: Mg2+ normally occupies the NMDA receptor channel pore in a voltage-dependent manner. At therapeutic concentrations, this blockade reduces excitatory glutamate neurotransmission, raising the seizure threshold: the primary mechanism for eclampsia seizure prevention. (3) Smooth muscle relaxation: reduced calcium influx into myometrial smooth muscle cells decreases myosin light chain kinase activation, reducing uterine contractility (tocolytic effect). (4) Vasodilation: reduced vascular smooth muscle calcium causes arteriolar vasodilation, lowering blood pressure. (5) Cardiac effects: slows AV conduction and prolongs refractory period, useful in torsades de pointes by stabilizing membrane potential and reducing early afterdepolarizations."
    },
    indications: ["Eclampsia/pre-eclampsia seizure prophylaxis", "Tocolysis (preterm labor)", "Torsades de pointes", "Hypomagnesemia replacement", "Acute asthma (severe, refractory)"],
    sideEffects: [
      { effect: "Respiratory depression / arrest", mechanism: "Neuromuscular blockade at the diaphragm and intercostal muscles: magnesium reduces acetylcholine release at the neuromuscular junction. Progressive: first loss of deep tendon reflexes, then respiratory depression, then cardiac arrest", severity: "life-threatening" },
      { effect: "Hypotension", mechanism: "Vasodilation from reduced vascular smooth muscle calcium entry and decreased systemic vascular resistance", severity: "serious" },
      { effect: "Flushing and warmth", mechanism: "Peripheral vasodilation increases cutaneous blood flow, producing visible flushing and sensation of warmth: a common and expected effect at therapeutic levels", severity: "common" },
      { effect: "Cardiac arrest", mechanism: "At toxic levels (>12 mEq/L), profound calcium channel antagonism causes cardiac conduction failure: prolonged PR, widened QRS, and eventually asystole", severity: "life-threatening" },
      { effect: "Neonatal depression", mechanism: "Magnesium freely crosses the placenta, causing fetal respiratory depression, hypotonia, and hyporeflexia in the neonate. More pronounced with prolonged administration (>48 hours)", severity: "serious" }
    ],
    nursingConsiderations: [
      "Monitor deep tendon reflexes (DTRs) BEFORE and during infusion: loss of patellar reflex is the earliest sign of magnesium toxicity. Hold infusion if DTRs are absent",
      "Monitor respiratory rate: hold for RR < 12/min. Respiratory depression occurs before cardiac arrest in the toxicity progression",
      "Monitor urine output: minimum 30 mL/hr. Magnesium is renally excreted: oliguria causes rapid accumulation to toxic levels",
      "Therapeutic serum level: 4-7 mEq/L for eclampsia prophylaxis. Check levels every 4-6 hours",
      "CALCIUM GLUCONATE 1g IV is the antidote: keep at bedside during all magnesium infusions. Calcium directly antagonizes magnesium's effects at calcium channels",
      "Continuous fetal monitoring when used in obstetric patients: decreased fetal heart rate variability is expected but persistent bradycardia requires intervention"
    ],
    keyInteractions: [
      { drug: "Calcium channel blockers (nifedipine)", consequence: "Severe hypotension, neuromuscular blockade", mechanism: "Both agents reduce calcium entry into cells through complementary mechanisms: synergistic vasodilation and neuromuscular depression" },
      { drug: "Neuromuscular blocking agents (succinylcholine)", consequence: "Prolonged neuromuscular blockade", mechanism: "Magnesium enhances the effect of both depolarizing and non-depolarizing neuromuscular blockers by reducing presynaptic acetylcholine release and postsynaptic sensitivity" },
      { drug: "CNS depressants", consequence: "Enhanced CNS and respiratory depression", mechanism: "Magnesium's NMDA receptor blockade and neuromuscular effects compound the respiratory depressant effects of opioids, benzodiazepines, and general anesthetics" }
    ],
    bodySystem: "Maternity",
    relatedLessons: [{ id: "preeclampsia", title: "Pre-eclampsia / Eclampsia" }, { id: "preterm-labor", title: "Preterm Labor" }]
  },
  {
    id: "oxytocin",
    genericName: "Oxytocin",
    brandNames: ["Pitocin"],
    drugClass: "Uterotonic",
    moaCategory: "Uterotonics",
    mechanismOfAction: {
      summary: "Binds oxytocin receptors on myometrial smooth muscle cells, triggering intracellular calcium release that activates the contractile apparatus and produces rhythmic uterine contractions.",
      receptorPathway: "Oxytocin receptor (OXTR, a Gq-coupled GPCR) → phospholipase C → IP3 + DAG → IP3 releases Ca2+ from sarcoplasmic reticulum → Ca2+-calmodulin → myosin light chain kinase activation → uterine contraction.",
      cellularDetail: "Oxytocin receptors are Gq-protein coupled receptors whose density on myometrial cells increases dramatically (up to 200-fold) during late pregnancy under the influence of rising estrogen levels. When oxytocin binds its receptor, the Gq protein activates phospholipase C, which cleaves PIP2 into IP3 and DAG. IP3 triggers calcium release from the sarcoplasmic reticulum, while DAG activates protein kinase C. The increased intracellular calcium binds calmodulin, forming a complex that activates myosin light chain kinase (MLCK). MLCK phosphorylates the regulatory light chain of myosin, enabling actin-myosin cross-bridge cycling and smooth muscle contraction. Oxytocin also stimulates prostaglandin synthesis (PGF2α and PGE2) from decidual and myometrial cells, creating a positive feedback amplification loop. Additionally, oxytocin increases gap junction formation between myometrial cells (connexin-43), synchronizing contractions across the uterus. This explains why oxytocin can cause hyperstimulation: the positive feedback and gap junction coupling can produce tetanic contractions that compromise uteroplacental blood flow."
    },
    indications: ["Labor induction", "Labor augmentation", "Postpartum hemorrhage prevention and treatment", "Incomplete/inevitable abortion management"],
    sideEffects: [
      { effect: "Uterine hyperstimulation (tachysystole)", mechanism: "Excessive oxytocin causes sustained myometrial contraction (tetany) or contractions too frequent (>5 in 10 minutes). The compressed uterine blood vessels cannot deliver oxygen to the fetus during sustained contractions", severity: "life-threatening" },
      { effect: "Fetal distress", mechanism: "Uterine hyperstimulation compresses spiral arteries supplying the intervillous space, causing uteroplacental insufficiency: the fetus develops hypoxia, acidosis, and late decelerations on fetal heart rate monitoring", severity: "life-threatening" },
      { effect: "Water intoxication / hyponatremia", mechanism: "Oxytocin has structural similarity to antidiuretic hormone (ADH/vasopressin) and weakly activates V2 receptors on renal collecting duct cells, increasing water reabsorption. High-dose prolonged infusions with hypotonic IV fluids can cause dangerous hyponatremia", severity: "serious" },
      { effect: "Uterine rupture", mechanism: "In patients with prior uterine surgery (cesarean section scar), excessive uterine pressure from oxytocin-stimulated contractions can cause catastrophic separation along the surgical scar", severity: "life-threatening" },
      { effect: "Hypotension", mechanism: "IV bolus causes transient vasodilation through vascular oxytocin receptor activation and nitric oxide release, reducing systemic vascular resistance", severity: "serious" }
    ],
    nursingConsiderations: [
      "ALWAYS administer via infusion pump with precise rate control. NEVER give as IV bolus for labor induction (only controlled bolus for postpartum hemorrhage per protocol)",
      "Continuous electronic fetal monitoring is MANDATORY during oxytocin administration: assess fetal heart rate pattern and uterine contraction frequency/duration/intensity every 15 minutes",
      "If tachysystole occurs (>5 contractions in 10 minutes or contractions lasting >2 minutes): stop oxytocin immediately, position patient on left side, administer oxygen, notify provider. Terbutaline 0.25 mg SQ may be ordered as a tocolytic rescue",
      "Titrate per hospital protocol: typically start at 0.5-2 mU/min and increase by 1-2 mU/min every 15-30 minutes until adequate contraction pattern (3 contractions in 10 minutes, each lasting 60-90 seconds)",
      "Assess cervical readiness (Bishop score) before induction: an unripe cervix may require cervical ripening agents before oxytocin",
      "Document intake and output strictly: risk of water intoxication increases with prolonged high-dose infusions"
    ],
    blackBoxWarnings: ["Not indicated for elective induction of labor when not medically warranted. Can cause uterine hyperstimulation with fetal distress, uterine rupture, and maternal death."],
    keyInteractions: [
      { drug: "Prostaglandins (misoprostol, dinoprostone)", consequence: "Uterine hyperstimulation and rupture", mechanism: "Both classes stimulate myometrial contraction through complementary pathways: synergistic effect dramatically increases risk of tetanic contractions and uteroplacental insufficiency" },
      { drug: "Vasopressors", consequence: "Severe hypertension", mechanism: "Oxytocin has mild vasopressor activity at high doses: combined with exogenous vasopressors, can cause dangerous hypertension" }
    ],
    bodySystem: "Maternity",
    relatedLessons: [{ id: "labor-delivery", title: "Labor & Delivery" }, { id: "postpartum-hemorrhage", title: "Postpartum Hemorrhage" }]
  },
  {
    id: "terbutaline",
    genericName: "Terbutaline",
    brandNames: ["Brethine"],
    drugClass: "Beta-2 Adrenergic Agonist (Tocolytic)",
    moaCategory: "Beta Agonists",
    mechanismOfAction: {
      summary: "Selectively stimulates beta-2 adrenergic receptors on uterine smooth muscle, activating adenylyl cyclase to increase cAMP and cause myometrial relaxation, suppressing preterm contractions.",
      receptorPathway: "Beta-2 receptors → Gs protein → adenylyl cyclase → increased cAMP → PKA activation → myosin light chain kinase (MLCK) phosphorylation (inactivation) → smooth muscle relaxation.",
      cellularDetail: "Beta-2 adrenergic receptors on myometrial smooth muscle cells are coupled to stimulatory Gs proteins. When terbutaline binds, the activated Gs protein stimulates adenylyl cyclase, increasing intracellular cAMP concentration. cAMP activates protein kinase A (PKA), which produces smooth muscle relaxation through multiple mechanisms: (1) PKA phosphorylates myosin light chain kinase (MLCK), reducing its affinity for the calcium-calmodulin complex and preventing myosin phosphorylation needed for contraction. (2) PKA stimulates calcium efflux via plasma membrane Ca2+-ATPase and uptake into the sarcoplasmic reticulum via SERCA, lowering intracellular calcium. (3) PKA opens large-conductance calcium-activated potassium (BK) channels, hyperpolarizing the cell and reducing voltage-gated calcium channel opening. The net effect is profound myometrial relaxation. However, beta-2 receptors are also present on vascular smooth muscle (vasodilation), skeletal muscle (tremor, potassium uptake), hepatocytes (glycogenolysis), and cardiac tissue (at higher doses, beta-1 cross-activation causes tachycardia). These non-uterine effects limit the therapeutic index and cause significant maternal side effects."
    },
    indications: ["Acute tocolysis (preterm labor, short-term)", "Uterine hyperstimulation rescue (oxytocin overdose)", "Acute bronchospasm (less common use due to albuterol preference)"],
    sideEffects: [
      { effect: "Maternal tachycardia", mechanism: "Beta-2 mediated vasodilation causes reflex tachycardia. At higher doses, some beta-1 receptor cross-activation directly increases heart rate and contractility", severity: "serious" },
      { effect: "Pulmonary edema", mechanism: "Fluid retention from increased ADH secretion, combined with tachycardia-induced diastolic filling reduction, can cause non-cardiogenic pulmonary edema especially with concurrent corticosteroid use and IV fluid administration", severity: "life-threatening" },
      { effect: "Hypokalemia", mechanism: "Beta-2 receptor activation on skeletal muscle cells stimulates Na+/K+ ATPase, driving potassium intracellularly. This shift can lower serum potassium to arrhythmogenic levels", severity: "serious" },
      { effect: "Hyperglycemia", mechanism: "Beta-2 stimulation promotes hepatic glycogenolysis and gluconeogenesis while reducing insulin sensitivity. Particularly dangerous in gestational diabetics", severity: "common" },
      { effect: "Tremor", mechanism: "Beta-2 receptor activation in skeletal muscle increases intracellular cAMP, enhancing neuromuscular transmission and causing fine tremor, especially in the hands", severity: "common" },
      { effect: "Fetal tachycardia", mechanism: "Terbutaline crosses the placenta and activates fetal cardiac beta receptors, causing fetal tachycardia. Prolonged use can cause fetal myocardial damage", severity: "serious" }
    ],
    nursingConsiderations: [
      "FDA black box warning limits IV/SQ use to acute tocolysis for up to 48-72 hours: prolonged use has been associated with maternal cardiac events and death",
      "Monitor maternal heart rate continuously: hold if HR > 120 bpm. Assess for chest pain, dyspnea, or signs of pulmonary edema",
      "Monitor potassium and glucose levels: hypokalemia can cause arrhythmias; hyperglycemia requires monitoring especially in gestational diabetes",
      "Continuous fetal monitoring: assess for fetal tachycardia (baseline > 160 bpm) which may indicate excessive placental transfer",
      "SQ injection (0.25 mg) for acute rescue of oxytocin-induced uterine hyperstimulation: onset within 5 minutes. Position patient on left side and administer oxygen simultaneously",
      "Strict intake and output monitoring: pulmonary edema risk increases with excessive IV fluids, concurrent betamethasone administration, and multi-fetal gestation"
    ],
    blackBoxWarnings: ["Do not use injectable terbutaline for prevention or prolonged treatment (beyond 48-72 hours) of preterm labor. Serious adverse reactions, including death, have been reported after administration to pregnant women."],
    keyInteractions: [
      { drug: "Beta-blockers", consequence: "Mutual antagonism", mechanism: "Beta-blockers directly oppose terbutaline at beta-2 receptors, negating tocolytic effect. Non-selective beta-blockers (propranolol) are contraindicated in preterm labor management" },
      { drug: "Corticosteroids (betamethasone)", consequence: "Increased pulmonary edema risk", mechanism: "Corticosteroids cause sodium and water retention that compounds terbutaline-induced fluid shifts and reduced cardiac diastolic filling time from tachycardia" },
      { drug: "MAO inhibitors", consequence: "Hypertensive crisis", mechanism: "MAO inhibitors prevent breakdown of catecholamines: combined with beta-agonist stimulation, can cause severe sympathomimetic excess with dangerous hypertension and tachycardia" }
    ],
    bodySystem: "Maternity",
    relatedLessons: [{ id: "preterm-labor", title: "Preterm Labor" }, { id: "labor-delivery", title: "Labor & Delivery" }]
  }
];
