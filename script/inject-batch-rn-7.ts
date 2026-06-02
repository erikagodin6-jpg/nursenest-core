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
  console.log(`  NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {
  "bartter-syndrome-rn": {
    title: "Bartter Syndrome",
    cellular: {
      title: "Renal Tubular Ion Transport Defects in Bartter Syndrome",
      content: "Bartter syndrome is a group of rare inherited renal tubular disorders characterized by impaired sodium chloride reabsorption in the thick ascending limb (TAL) of the loop of Henle, resulting in salt wasting, hypokalemic metabolic alkalosis, hyperreninemia, hyperaldosteronism, and normal to low blood pressure despite markedly elevated renin and aldosterone levels. The syndrome mimics the effects of chronic loop diuretic (furosemide) administration, earning it the description of a genetic furosemide-like condition.\n\nTo understand Bartter syndrome, the RN must appreciate normal ion transport in the TAL. The TAL is responsible for reabsorbing approximately 25 to 30% of filtered sodium chloride. The primary transporter is the sodium-potassium-chloride cotransporter type 2 (NKCC2, also called BSC1) located on the luminal (apical) membrane. NKCC2 transports one sodium, one potassium, and two chloride ions from the tubular lumen into the TAL cell. This process is driven by the low intracellular sodium concentration maintained by the basolateral Na+/K+-ATPase, which pumps sodium out of the cell into the peritubular capillary. Potassium that enters the cell via NKCC2 recycles back into the lumen through the renal outer medullary potassium channel (ROMK), maintaining the lumen-positive transepithelial voltage that drives paracellular reabsorption of calcium and magnesium. Chloride exits the cell basolaterally through chloride channels (ClC-Kb, requiring its subunit barttin).\n\nBartter syndrome is classified into five types based on the specific gene mutation. Type I (neonatal, severe) involves loss-of-function mutations in SLC12A1 encoding NKCC2 itself. Type II (neonatal) involves mutations in KCNJ1 encoding the ROMK potassium channel. Type III (classic Bartter) involves mutations in CLCNKB encoding the basolateral chloride channel ClC-Kb. Type IV (neonatal with sensorineural deafness) involves mutations in BSND encoding barttin, the beta-subunit of ClC-Ka and ClC-Kb chloride channels expressed in both the kidney and inner ear. Type V involves gain-of-function mutations in CASR encoding the calcium-sensing receptor, which inhibits ROMK and NKCC2 activity.\n\nThe pathophysiology cascades from impaired NaCl reabsorption in the TAL. The defective transporter causes sodium chloride wasting into the urine. The resulting volume contraction activates the renin-angiotensin-aldosterone system (RAAS): juxtaglomerular cells sense reduced renal perfusion and release renin, which converts angiotensinogen to angiotensin I, then angiotensin-converting enzyme (ACE) produces angiotensin II, which stimulates aldosterone release from the adrenal zona glomerulosa. Aldosterone acts on the collecting duct principal cells to increase sodium reabsorption through epithelial sodium channels (ENaC) in exchange for potassium and hydrogen ion secretion. This aldosterone-driven exchange produces the hallmark hypokalemia and metabolic alkalosis.\n\nDespite markedly elevated angiotensin II levels, patients with Bartter syndrome maintain normal or low blood pressure. This paradox is explained by increased production of vasodilatory prostaglandins (primarily prostaglandin E2, PGE2) by the macula densa and interstitial cells in response to the TAL dysfunction. PGE2 production is stimulated by reduced NaCl delivery to the macula densa and by the volume depletion itself, creating a compensatory vasodilatory state that counteracts the vasoconstrictive effects of angiotensin II. This prostaglandin overproduction also contributes to the polyuria, fever, and failure to thrive seen in neonatal Bartter syndrome.\n\nThe loss of the lumen-positive transepithelial voltage in the TAL (normally generated by ROMK-mediated potassium recycling) impairs paracellular reabsorption of calcium and magnesium, causing hypercalciuria and hypomagnesemia. Chronic hypercalciuria leads to nephrocalcinosis (calcium deposition in the renal medulla), which can further impair renal concentrating ability and contribute to progressive chronic kidney disease.\n\nClinically, neonatal Bartter syndrome (types I, II, IV) presents in the first weeks of life with severe polyuria, polydipsia, dehydration, failure to thrive, fever, and electrolyte derangements. Pregnancy may be complicated by polyhydramnios (excessive amniotic fluid) due to fetal polyuria. Classic Bartter syndrome (type III) presents later in childhood or adolescence with milder symptoms: muscle weakness, cramps, fatigue, growth retardation, salt craving, constipation, and polyuria. Laboratory findings consistently show hypokalemia (often 2.0 to 3.0 mEq/L), metabolic alkalosis (serum bicarbonate greater than 28 mEq/L), elevated renin and aldosterone, normal to low blood pressure, and elevated urinary chloride (differentiating from vomiting-induced alkalosis where urinary chloride is less than 10 mEq/L).\n\nTreatment targets the prostaglandin-mediated and aldosterone-mediated pathophysiology. Indomethacin (a non-selective cyclooxygenase inhibitor) reduces PGE2 production, decreasing salt and water wasting and improving growth. Potassium supplementation (potassium chloride, 3 to 10 mEq/kg/day) is essential to correct and maintain normokalemia. Potassium-sparing diuretics (spironolactone, amiloride) reduce aldosterone-driven potassium wasting. Magnesium supplementation is required for concomitant hypomagnesemia. ACE inhibitors or ARBs may be used to reduce aldosterone production. Sodium chloride supplementation is needed in neonatal forms with severe salt wasting."
    },
    riskFactors: [
      "Autosomal recessive inheritance (both parents must carry the mutation; 25% recurrence risk per pregnancy)",
      "Consanguineous parents (increased probability of homozygous mutations for rare recessive disorders)",
      "Family history of Bartter syndrome or unexplained neonatal salt wasting",
      "Neonatal presentation: polyhydramnios during pregnancy, preterm birth, failure to thrive in first weeks of life",
      "Genetic mutations in SLC12A1 (NKCC2), KCNJ1 (ROMK), CLCNKB (ClC-Kb), BSND (barttin), or CASR (calcium-sensing receptor)",
      "Populations with high rates of consanguinity (higher carrier frequency of recessive alleles)",
      "Sensorineural hearing loss in infancy (suggestive of Type IV Bartter with barttin mutation)"
    ],
    diagnostics: [
      "Serum electrolytes: hypokalemia (typically 2.0 to 3.0 mEq/L, may be severe), metabolic alkalosis (bicarbonate greater than 28 mEq/L), hypomagnesemia (less than 1.5 mg/dL in many subtypes), hyponatremia in severe cases",
      "Serum renin and aldosterone: both markedly elevated (hyperreninemic hyperaldosteronism) with normal or low blood pressure (distinguishing from Conn syndrome where blood pressure is elevated)",
      "Urine electrolytes: elevated urinary chloride (greater than 20 mEq/L, distinguishing from vomiting-induced hypokalemic alkalosis where urinary chloride is less than 10 mEq/L), elevated urinary sodium, elevated urinary calcium (hypercalciuria in types I and II)",
      "Renal ultrasound: nephrocalcinosis (medullary calcium deposits) especially in types I and II with chronic hypercalciuria; assess kidney size and cortical echogenicity",
      "Genetic testing: mutation analysis of SLC12A1, KCNJ1, CLCNKB, BSND, CASR genes for definitive diagnosis and subtype classification",
      "Audiometry: sensorineural hearing loss assessment for suspected Type IV (barttin mutation affecting inner ear chloride channels)"
    ],
    management: [
      "Potassium chloride supplementation: 3 to 10 mEq/kg/day in divided doses to maintain potassium above 3.0 mEq/L; higher doses may be required due to ongoing renal wasting; use KCl (not other potassium salts) to simultaneously replace chloride losses",
      "Indomethacin: 1 to 3 mg/kg/day in divided doses; reduces prostaglandin E2 production, decreasing polyuria, improving electrolyte retention, and promoting growth in neonatal Bartter; monitor for GI and renal side effects",
      "Potassium-sparing diuretics: spironolactone 1 to 3 mg/kg/day or amiloride 0.3 to 0.6 mg/kg/day to reduce aldosterone-driven potassium excretion in the collecting duct",
      "Magnesium supplementation: magnesium oxide or magnesium gluconate for hypomagnesemia; monitor levels every 2 to 4 weeks during dose adjustment",
      "Sodium chloride supplementation in neonatal forms with severe salt wasting: 5 to 10 mEq/kg/day to maintain hydration and volume status",
      "ACE inhibitors (captopril or enalapril) or ARBs (losartan) to reduce angiotensin II and aldosterone-mediated potassium wasting; monitor blood pressure and renal function carefully",
      "Long-term monitoring: serial renal function (creatinine, GFR), electrolytes, growth parameters, renal ultrasound for nephrocalcinosis progression, and hearing assessments for Type IV"
    ],
    nursingActions: [
      "Monitor serum potassium level closely: check at least every 6 to 8 hours in acute presentations and with any dose change; hypokalemia below 2.5 mEq/L causes life-threatening cardiac arrhythmias (U waves, ST depression, VT, VF) and respiratory muscle weakness; connect to cardiac monitor when potassium is below 3.0 mEq/L",
      "Administer potassium supplementation safely: oral KCl should be diluted in water or juice (concentrated solutions cause nausea and esophageal irritation); IV potassium should never exceed 0.5 mEq/kg/hour via peripheral line (risk of phlebitis and cardiac arrest); always infuse on a cardiac monitor; never give IV potassium by push",
      "Monitor strict intake and output and daily weights: polyuria is a hallmark of Bartter syndrome and can be severe (urine output exceeding 5 mL/kg/hour in neonates); inadequate fluid replacement leads to dehydration, hypotension, and acute kidney injury",
      "Assess for signs of dehydration at each encounter: decreased skin turgor, dry mucous membranes, sunken fontanelle (in infants), tachycardia, decreased urine output, prolonged capillary refill; weight loss exceeding 5% of body weight indicates significant dehydration requiring IV fluid resuscitation",
      "Administer indomethacin with food or milk to reduce GI side effects; monitor for adverse effects: epigastric pain, GI bleeding (test stool for occult blood), renal function deterioration (check creatinine weekly during initiation), and headache; hold and notify provider if creatinine rises more than 30% above baseline",
      "Monitor growth parameters in pediatric patients: plot height, weight, and head circumference on age-appropriate growth charts at every visit; failure to thrive and growth retardation are common in inadequately treated Bartter syndrome and should improve with proper electrolyte and prostaglandin management",
      "Educate family about lifelong management: Bartter syndrome is a chronic genetic condition requiring ongoing electrolyte supplementation, medication adherence, and regular monitoring; teach parents to recognize signs of hypokalemia (muscle weakness, cramps, palpitations, fatigue) and dehydration; provide written action plan for sick days when fluid and electrolyte losses increase"
    ],
    assessmentFindings: [
      "Polyuria and polydipsia (often the presenting complaint in older children; severe polyuria in neonates)",
      "Failure to thrive and growth retardation (from chronic electrolyte imbalances and caloric losses)",
      "Muscle weakness, cramps, and fatigue (from hypokalemia affecting skeletal muscle function)",
      "Salt craving (compensatory behavior for chronic sodium chloride wasting)",
      "Dehydration signs: poor skin turgor, dry mucous membranes, tachycardia, sunken fontanelle in infants",
      "ECG changes of hypokalemia: flattened or inverted T waves, prominent U waves, ST segment depression, prolonged QT interval"
    ],
    signs: {
      left: [
        "Mild polyuria with salt craving",
        "Potassium 3.0 to 3.5 mEq/L with mild fatigue",
        "Growth slightly below expected trajectory",
        "Mild metabolic alkalosis (bicarbonate 28 to 32 mEq/L)",
        "Intermittent muscle cramps with exercise"
      ],
      right: [
        "Severe hypokalemia (less than 2.0 mEq/L) with cardiac arrhythmias (VT, VF)",
        "Severe dehydration with hemodynamic instability in neonates",
        "Nephrocalcinosis with progressive chronic kidney disease",
        "Respiratory muscle weakness causing hypoventilation",
        "Growth failure below the 3rd percentile despite treatment"
      ]
    },
    medications: [
      {
        name: "Indomethacin",
        type: "Non-selective Cyclooxygenase (COX) Inhibitor (NSAID)",
        action: "Inhibits both COX-1 and COX-2 enzymes, reducing prostaglandin E2 (PGE2) synthesis in the kidney; in Bartter syndrome, excessive PGE2 production contributes to salt wasting, polyuria, fever, and failure to thrive; indomethacin reduces these effects, improving electrolyte balance, reducing polyuria, and promoting growth",
        sideEffects: "Gastric irritation, peptic ulcer disease, GI bleeding (COX-1 inhibition reduces protective gastric prostaglandins), nephrotoxicity (reduced renal blood flow from prostaglandin inhibition), headache, dizziness, fluid retention, hypertension, platelet dysfunction",
        contra: "Active GI bleeding or peptic ulcer disease, severe renal impairment (GFR less than 30), aspirin allergy or NSAID sensitivity, third trimester of pregnancy (premature closure of ductus arteriosus), severe heart failure",
        pearl: "Indomethacin is the first-line prostaglandin synthesis inhibitor for Bartter syndrome; administer with food to reduce GI side effects; monitor creatinine weekly for the first month as prostaglandin inhibition can transiently reduce GFR; the therapeutic goal is reduced polyuria, improved electrolytes, and improved growth velocity; ibuprofen or celecoxib may be used as alternatives with potentially fewer GI side effects"
      },
      {
        name: "Potassium Chloride (KCl)",
        type: "Electrolyte Replacement",
        action: "Provides exogenous potassium and chloride to replace chronic renal losses; potassium is essential for cardiac conduction, skeletal muscle contraction, and acid-base balance; chloride replacement is specifically important in Bartter syndrome because the metabolic alkalosis is chloride-responsive",
        sideEffects: "Nausea, vomiting, abdominal pain, diarrhea (oral forms), esophageal ulceration (if tablet lodges in esophagus), hyperkalemia (with excessive supplementation or concurrent potassium-sparing agents), phlebitis and tissue necrosis (with concentrated IV solutions), cardiac arrhythmias (if IV given too rapidly)",
        contra: "Hyperkalemia (greater than 5.5 mEq/L), severe renal impairment with oliguria (inability to excrete potassium), concurrent use of potassium-sparing diuretics without close monitoring, esophageal compression or stricture (oral tablets)",
        pearl: "In Bartter syndrome, potassium requirements are high (3 to 10 mEq/kg/day) due to ongoing renal losses; KCl is preferred over other potassium salts (citrate, gluconate) because chloride replacement helps correct the metabolic alkalosis; dilute oral liquid preparations in water or juice to reduce GI irritation; IV potassium must never exceed 0.5 mEq/kg/hour peripherally or 1 mEq/kg/hour centrally, always on a cardiac monitor; sudden cessation can cause rebound hypokalemia"
      },
      {
        name: "Spironolactone",
        type: "Potassium-Sparing Diuretic (Aldosterone Antagonist)",
        action: "Competitively blocks aldosterone receptors in the collecting duct principal cells, reducing ENaC-mediated sodium reabsorption and the coupled potassium and hydrogen ion secretion; in Bartter syndrome, this directly counteracts the hyperaldosteronism that drives renal potassium wasting",
        sideEffects: "Hyperkalemia (especially if combined with potassium supplements and indomethacin), gynecomastia and breast tenderness (anti-androgenic effect), menstrual irregularities, nausea, diarrhea, headache, hyponatremia",
        contra: "Hyperkalemia greater than 5.5 mEq/L, severe renal impairment (GFR less than 30), Addison disease, concurrent use of other potassium-sparing agents without monitoring, anuria",
        pearl: "Spironolactone reduces potassium wasting by blocking the downstream effect of elevated aldosterone in Bartter syndrome; onset of action is slow (3 to 5 days for full effect); when used with potassium supplements (standard in Bartter), monitor potassium frequently to avoid hyperkalemia; gynecomastia may be problematic in adolescent males - amiloride is an alternative without anti-androgenic effects"
      }
    ],
    pearls: [
      "Bartter syndrome mimics chronic furosemide use: both produce hypokalemic metabolic alkalosis with elevated renin and aldosterone, hypercalciuria, and normal to low blood pressure; the key difference is that Bartter is genetic and lifelong while furosemide effect is reversible",
      "The urinary chloride is the critical differentiator between Bartter syndrome and vomiting-induced hypokalemic alkalosis: urinary chloride greater than 20 mEq/L in Bartter (salt wasting) versus less than 10 mEq/L in vomiting (kidneys avidly retain chloride to compensate for GI losses)",
      "Polyhydramnios during pregnancy is often the first clue to neonatal Bartter syndrome: fetal polyuria (from impaired tubular sodium reabsorption) increases amniotic fluid volume, which may cause preterm labor",
      "Nephrocalcinosis from chronic hypercalciuria is a common complication of types I and II Bartter syndrome; regular renal ultrasound monitoring is essential, and indomethacin may reduce calcium excretion by restoring some tubular function",
      "Normal or low blood pressure despite markedly elevated renin and aldosterone is the hemodynamic paradox of Bartter syndrome, explained by compensatory prostaglandin E2-mediated vasodilation; this distinguishes Bartter from primary aldosteronism (Conn syndrome) where blood pressure is elevated",
      "IV potassium administration requires extreme caution: never exceed 0.5 mEq/kg/hour peripherally, always on continuous cardiac monitoring; rapid IV potassium can cause fatal cardiac arrest even in patients who are hypokalemic",
      "Growth failure in Bartter syndrome improves dramatically with appropriate treatment (indomethacin plus electrolyte supplementation); catch-up growth is expected within 6 to 12 months of initiating therapy, making growth velocity an important marker of treatment adequacy"
    ],
    quiz: [
      {
        question: "A 3-month-old infant presents with polyuria, failure to thrive, and serum potassium of 2.4 mEq/L with metabolic alkalosis. The urinary chloride is 45 mEq/L. What does this presentation most likely indicate?",
        options: [
          "Pyloric stenosis causing vomiting-induced alkalosis",
          "Bartter syndrome with renal salt wasting",
          "Conn syndrome (primary aldosteronism)",
          "Excessive diuretic administration (Munchausen by proxy)"
        ],
        correct: 1,
        rationale: "Hypokalemic metabolic alkalosis with elevated urinary chloride (45 mEq/L) in an infant with polyuria and failure to thrive is classic for Bartter syndrome. Pyloric stenosis causes vomiting-induced alkalosis but the urinary chloride would be less than 10 mEq/L (kidneys conserve chloride). Conn syndrome presents with hypertension, which Bartter does not. Diuretic abuse is a differential but less likely in a 3-month-old."
      },
      {
        question: "A nurse is administering IV potassium chloride to a child with Bartter syndrome who has a potassium level of 2.1 mEq/L. Which safety precaution is most critical?",
        options: [
          "Administer the potassium by IV push to rapidly correct the severe deficit",
          "Infuse at a maximum rate of 0.5 mEq/kg/hour via peripheral IV with continuous cardiac monitoring",
          "Infuse the entire daily dose over 30 minutes to correct the deficit quickly",
          "Administer undiluted potassium chloride concentrate through a peripheral IV"
        ],
        correct: 1,
        rationale: "IV potassium must never exceed 0.5 mEq/kg/hour via peripheral IV (1 mEq/kg/hour via central line) and must always be administered with continuous cardiac monitoring. IV push potassium is NEVER given as it causes fatal cardiac arrest. Concentrated potassium causes severe phlebitis and tissue necrosis. Even in severe hypokalemia, rapid correction risks fatal hyperkalemia and arrhythmias."
      },
      {
        question: "A patient with Bartter syndrome on indomethacin has a serum creatinine that has risen from 0.6 to 1.0 mg/dL over 2 weeks. What should the nurse do?",
        options: [
          "Continue the medication as the creatinine is still within normal range",
          "Hold indomethacin, notify the provider about the greater than 50% creatinine rise indicating nephrotoxicity, and monitor renal function",
          "Double the indomethacin dose to improve electrolyte retention",
          "Add furosemide to increase urine output and protect the kidneys"
        ],
        correct: 1,
        rationale: "A creatinine rise from 0.6 to 1.0 mg/dL represents a 67% increase, exceeding the 30% threshold that indicates significant nephrotoxicity from prostaglandin inhibition. Indomethacin reduces renal prostaglandin-mediated vasodilation, potentially decreasing renal blood flow and GFR. The drug should be held and the provider notified. Adding furosemide would be counterproductive as it mimics the tubular defect already present in Bartter syndrome."
      }
    ]
  },

  "behcet-disease-rn": {
    title: "Behcet Disease",
    cellular: {
      title: "Vasculitic Pathology and Multi-System Inflammation in Behcet Disease",
      content: "Behcet disease (BD) is a chronic, relapsing systemic vasculitis of unknown etiology that can affect blood vessels of all sizes (small, medium, and large, both arteries and veins), making it unique among vasculitides. BD classically presents with the triad of recurrent oral ulcers, genital ulcers, and ocular inflammation (uveitis), but can involve virtually any organ system including the vascular, neurological, gastrointestinal, musculoskeletal, and pulmonary systems. The disease has a striking geographic distribution along the ancient Silk Road, with highest prevalence in Turkey (420 per 100,000), Iran, Japan, Korea, and Mediterranean countries.\n\nThe pathogenesis of BD involves a complex interplay between genetic susceptibility, innate immune dysregulation, and environmental triggers. The strongest genetic association is with HLA-B51 (present in 50 to 70% of BD patients versus 15 to 20% of the general population in endemic areas), a class I MHC allele that presents intracellular peptide antigens to CD8+ cytotoxic T cells. HLA-B51 may promote BD by presenting specific microbial or self-peptide antigens that trigger cross-reactive immune responses, or by misfolding in the endoplasmic reticulum and activating the unfolded protein response, leading to IL-23 production and Th17 cell activation.\n\nInnate immune dysfunction plays a central role. Neutrophils in BD are hyperactivated, demonstrating enhanced chemotaxis, superoxide production, and phagocytosis compared to healthy controls. This neutrophilic hyperreactivity underlies the pathergy phenomenon, a hallmark diagnostic feature: a skin prick with a sterile needle causes a disproportionate papulopustular reaction at 24 to 48 hours (positive pathergy test). The hyperactivated neutrophils infiltrate vessel walls and perivascular tissues, releasing reactive oxygen species, proteases, and neutrophil extracellular traps (NETs) that damage the endothelium and propagate inflammation.\n\nT-cell dysregulation in BD involves polarization toward Th1 and Th17 effector pathways. Th1 cells produce interferon-gamma and TNF-alpha, driving macrophage activation and granuloma-like inflammation. Th17 cells produce IL-17, which recruits and activates neutrophils, amplifying the neutrophilic vasculitis. Regulatory T cells (Tregs) that normally suppress autoimmune responses are functionally deficient in BD, allowing unchecked effector T-cell activity. Gamma-delta T cells, an innate-like T-cell subset, are expanded in BD and produce large amounts of TNF-alpha and IL-17.\n\nThe vasculitis in BD is characterized by neutrophilic infiltration of vessel walls with endothelial cell activation, swelling, and necrosis. Unlike most vasculitides, BD causes both arterial and venous inflammation. Venous involvement is more common (occurring in 20 to 40% of patients) and includes superficial thrombophlebitis, deep vein thrombosis, cerebral venous sinus thrombosis, and hepatic vein thrombosis (Budd-Chiari syndrome). The thrombosis in BD is unique: it is inflammatory (caused by endothelial inflammation rather than hypercoagulability), the thrombi are adherent to the inflamed vessel wall (reducing embolic risk compared to thrombosis from other causes), and the treatment is immunosuppression rather than anticoagulation alone. Arterial involvement includes aneurysm formation (particularly pulmonary artery aneurysms, which are nearly pathognomonic for BD and carry a high mortality from rupture and massive hemoptysis), aortic aneurysms, and arterial occlusions.\n\nOcular involvement (uveitis) is the most vision-threatening manifestation, affecting 50 to 70% of patients, predominantly young males. The uveitis can be anterior (iritis with hypopyon, a visible layer of white blood cells settling in the anterior chamber), posterior (retinal vasculitis, vitritis), or panuveitis. Without treatment, BD uveitis causes blindness in 25% of cases within 5 years through retinal ischemia, optic atrophy, and macular edema.\n\nNeuro-Behcet disease (NBD) affects 5 to 10% of patients and carries significant morbidity and mortality. Parenchymal NBD presents with brainstem/diencephalic lesions causing cranial nerve palsies, pyramidal signs, cerebellar ataxia, and cognitive-behavioral changes. Vascular NBD presents with cerebral venous sinus thrombosis causing headache, papilledema, and elevated intracranial pressure. CSF shows pleocytosis with elevated protein.\n\nDiagnosis relies on the International Study Group (ISG) criteria: recurrent oral ulceration (at least 3 episodes in 12 months) plus any 2 of recurrent genital ulceration, ocular lesions (anterior/posterior uveitis, retinal vasculitis), skin lesions (erythema nodosum, pseudofolliculitis, papulopustular lesions, acneiform nodules), or positive pathergy test. No diagnostic laboratory test exists; ESR and CRP are often elevated during flares, and HLA-B51 supports the diagnosis but is not required.\n\nTreatment is organ-specific and follows a step-up approach. Mucocutaneous disease is managed with topical corticosteroids, colchicine (reduces neutrophil chemotaxis), and apremilast (PDE4 inhibitor). Ocular disease requires systemic immunosuppression with azathioprine, and anti-TNF agents (infliximab, adalimumab) for sight-threatening uveitis. Vascular disease requires immunosuppression (cyclophosphamide for arterial aneurysms, corticosteroids for venous thrombosis) with cautious anticoagulation. Neuro-Behcet requires high-dose corticosteroids and azathioprine or infliximab for refractory cases."
    },
    riskFactors: [
      "HLA-B51 positive genotype (strongest genetic risk factor, present in 50 to 70% of BD patients)",
      "Geographic origin along the ancient Silk Road: Turkey, Iran, Japan, Korea, China, Mediterranean basin",
      "Young adult onset: peak incidence ages 20 to 40 years",
      "Male sex (males have more severe disease, particularly ocular and vascular involvement; female predominance in some Western countries)",
      "Family history of Behcet disease (8 to 15 times increased risk in first-degree relatives)",
      "Environmental triggers: Streptococcal infections (oral streptococci may trigger molecular mimicry), viral infections (HSV-1), microbial dysbiosis",
      "Smoking (associated with increased vascular complications in BD)"
    ],
    diagnostics: [
      "International Study Group criteria: recurrent oral ulceration (3 or more episodes in 12 months) PLUS 2 of: genital ulceration, ocular lesions, skin lesions, or positive pathergy test",
      "Pathergy test: intradermal insertion of a sterile 20-gauge needle; read at 24 to 48 hours; positive if papulopustular lesion develops at the puncture site (indicates neutrophilic hyperreactivity); more sensitive in Middle Eastern and Asian populations",
      "Ophthalmologic examination: slit-lamp examination for anterior uveitis with hypopyon, fundoscopy for posterior uveitis and retinal vasculitis, fluorescein angiography for vascular leakage and ischemia, optical coherence tomography for macular edema",
      "Inflammatory markers: ESR and CRP elevated during flares but not specific; no pathognomonic laboratory test exists for BD",
      "HLA-B51 typing: supports diagnosis but is not required for diagnosis and not specific (present in general population); positive in 50 to 70% of BD patients in endemic areas",
      "MRI brain with gadolinium for suspected neuro-Behcet: parenchymal lesions in brainstem and diencephalon; MR venography for cerebral venous sinus thrombosis; CT angiography for pulmonary artery aneurysms"
    ],
    management: [
      "Mucocutaneous disease (oral/genital ulcers): topical corticosteroids (triamcinolone paste, dexamethasone mouthwash), colchicine 0.5 to 1 mg twice daily (first-line systemic for mucocutaneous), apremilast 30 mg twice daily (FDA-approved for oral ulcers in BD)",
      "Ocular disease: azathioprine 2.5 mg/kg/day (first-line for prevention of uveitis flares), anti-TNF agents (infliximab 5 mg/kg or adalimumab 40 mg biweekly) for sight-threatening posterior uveitis or retinal vasculitis, intravitreal corticosteroid injections for acute flares",
      "Vascular disease: immunosuppression is the mainstay (cyclophosphamide for arterial aneurysms, corticosteroids for venous thrombosis); anticoagulation is used cautiously for venous thrombosis but is CONTRAINDICATED with pulmonary artery aneurysms (risk of fatal hemorrhage from aneurysm rupture)",
      "Neuro-Behcet: high-dose IV methylprednisolone 1 gram daily for 5 to 7 days then oral taper; azathioprine or infliximab for maintenance; cyclosporine is AVOIDED in neuro-Behcet (neurotoxic in this context)",
      "Gastrointestinal Behcet: corticosteroids, azathioprine, or anti-TNF agents for intestinal ulcerations; sulfasalazine for mild disease; surgery for perforation or refractory bleeding",
      "Pulmonary artery aneurysm: medical emergency; high-dose corticosteroids plus cyclophosphamide; anticoagulation is CONTRAINDICATED; embolization or surgery for active hemorrhage",
      "Long-term immunosuppressive maintenance to prevent flares and organ damage; treatment decisions guided by organ involvement severity"
    ],
    nursingActions: [
      "Perform systematic oral cavity assessment at each encounter: inspect for oral ulcers (typically 1 to 3 cm, round with erythematous halo on buccal mucosa, tongue, lips, soft palate), document number, size, location, and healing stage; provide oral care with soft-bristle toothbrush, alcohol-free mouthwash, and topical analgesics (viscous lidocaine 2%) before meals to facilitate nutrition",
      "Assess for ocular symptoms at every visit: ask about eye pain, redness, blurred vision, floaters, photophobia, and visual field changes; any new visual symptom requires urgent ophthalmology referral within 24 hours as delayed treatment of uveitis causes irreversible vision loss; educate patient that regular ophthalmologic follow-up (every 3 to 6 months even when asymptomatic) is essential",
      "Monitor for vascular complications: assess for signs of DVT (unilateral leg swelling, pain, warmth, Homans sign), cerebral venous sinus thrombosis (severe headache, papilledema, visual changes), and pulmonary artery aneurysm (hemoptysis is a medical emergency requiring immediate intervention); hemoptysis in BD must be treated as potentially life-threatening",
      "Administer and monitor immunosuppressive therapy: check CBC every 2 to 4 weeks for azathioprine (myelosuppression), liver function tests monthly, and assess for infection signs; for infliximab infusions, premedicate as prescribed, monitor for infusion reactions (fever, chills, chest tightness, hypotension), and screen for tuberculosis before initiating anti-TNF therapy",
      "Perform genital ulcer assessment with sensitivity and privacy: genital ulcers are painful and psychologically distressing; document size, location, depth, and signs of secondary infection; provide sitz baths for comfort, topical anesthetics, and barrier protection to prevent clothing friction; address sexual health concerns and refer to counseling if needed",
      "Assess skin daily for new lesions: look for erythema nodosum (tender red nodules on shins), papulopustular lesions, pseudofolliculitis, and pathergy reactions at venipuncture sites; avoid unnecessary skin trauma (use smaller gauge needles, minimize venipuncture attempts, avoid blood pressure cuff on the same arm repeatedly) to reduce pathergy-triggered lesions",
      "Educate about the chronic relapsing nature of BD and the importance of medication adherence during remission to prevent flares and organ damage; teach patients to recognize warning signs requiring urgent medical attention: sudden visual changes (uveitis), severe headache (cerebral venous thrombosis), hemoptysis (pulmonary artery aneurysm), and new neurological symptoms (neuro-Behcet)"
    ],
    assessmentFindings: [
      "Recurrent oral ulcers: painful, round or oval, 1 to 3 cm, with yellow-white pseudomembrane and erythematous halo; occur on buccal mucosa, tongue, lips, gingiva, and soft palate; heal in 1 to 3 weeks but recur",
      "Genital ulcers: painful ulcers on scrotum (males) or vulva (females), morphologically similar to oral ulcers; leave scars (distinguishing from oral ulcers which usually heal without scarring)",
      "Ocular inflammation: eye redness, pain, photophobia, blurred vision; hypopyon (visible white layer in anterior chamber) is characteristic; bilateral involvement common",
      "Skin lesions: erythema nodosum (tender red nodules on shins), papulopustular lesions, acneiform lesions, positive pathergy reaction at needle-stick sites",
      "Arthritis: non-deforming, oligoarticular (affecting few joints), commonly affecting knees and ankles",
      "Neurological: headache, cognitive changes, cranial nerve palsies, ataxia, pyramidal signs (neuro-Behcet)"
    ],
    signs: {
      left: [
        "Recurrent oral ulcers (3 or more per year) without other organ involvement",
        "Mild arthralgia without joint deformity",
        "Papulopustular skin lesions",
        "Positive pathergy test without systemic symptoms",
        "Mild anterior uveitis responding to topical steroids"
      ],
      right: [
        "Posterior uveitis or retinal vasculitis threatening vision",
        "Pulmonary artery aneurysm with hemoptysis (life-threatening emergency)",
        "Cerebral venous sinus thrombosis with elevated intracranial pressure",
        "Parenchymal neuro-Behcet with brainstem dysfunction",
        "Arterial aneurysm (aortic or peripheral) with rupture risk"
      ]
    },
    medications: [
      {
        name: "Colchicine",
        type: "Anti-inflammatory (Microtubule Inhibitor)",
        action: "Binds tubulin and inhibits microtubule polymerization, disrupting neutrophil chemotaxis, adhesion, and degranulation; reduces NLRP3 inflammasome activation and IL-1-beta production; the primary mechanism in BD is suppression of the neutrophilic hyperreactivity that drives mucocutaneous and joint manifestations",
        sideEffects: "Diarrhea (most common, dose-limiting), nausea, vomiting, abdominal cramps, bone marrow suppression (with chronic high-dose use), peripheral neuropathy, myopathy, rhabdomyolysis (especially with concurrent statin or CYP3A4 inhibitor use)",
        contra: "Severe renal impairment (GFR less than 30 without dose reduction), severe hepatic impairment, concurrent strong CYP3A4 inhibitors (clarithromycin, ketoconazole) or P-glycoprotein inhibitors (cyclosporine) which markedly increase colchicine levels causing toxicity, pregnancy (Category C)",
        pearl: "Colchicine is first-line systemic therapy for mucocutaneous BD (oral/genital ulcers, erythema nodosum, arthritis); dose 0.5 to 1 mg twice daily; diarrhea is the most common reason for discontinuation - start at low dose and titrate; colchicine has a narrow therapeutic index: toxic doses cause multi-organ failure (GI hemorrhage, bone marrow failure, cardiovascular collapse); NEVER combine with strong CYP3A4 inhibitors"
      },
      {
        name: "Infliximab",
        type: "Anti-TNF Monoclonal Antibody (Chimeric Mouse/Human IgG1)",
        action: "Binds soluble and transmembrane TNF-alpha with high affinity, neutralizing its proinflammatory effects; induces apoptosis of TNF-expressing inflammatory cells; in BD, rapidly suppresses the TNF-alpha-driven vasculitis, uveitis, and mucocutaneous inflammation that characterize severe disease",
        sideEffects: "Infusion reactions (fever, chills, urticaria, dyspnea, hypotension), increased infection risk (tuberculosis reactivation, opportunistic infections including PML, fungal infections), hepatotoxicity, heart failure exacerbation, demyelinating disease, lupus-like syndrome, increased lymphoma risk with long-term use",
        contra: "Active infections including latent tuberculosis (must screen with PPD or IGRA and chest X-ray before starting), moderate to severe heart failure (NYHA Class III-IV), active hepatitis B, known hypersensitivity, concurrent live vaccines, demyelinating disease",
        pearl: "Infliximab is the most effective therapy for sight-threatening BD uveitis and severe neuro-Behcet; dose 5 mg/kg IV at weeks 0, 2, 6, then every 6 to 8 weeks; MUST screen for latent TB before starting (treat latent TB with isoniazid for at least 1 month before infliximab); premedicate with acetaminophen, diphenhydramine, and hydrocortisone to reduce infusion reactions; monitor for infection throughout treatment"
      },
      {
        name: "Apremilast",
        type: "Phosphodiesterase-4 (PDE4) Inhibitor",
        action: "Inhibits phosphodiesterase-4, increasing intracellular cAMP levels in inflammatory cells; elevated cAMP reduces production of TNF-alpha, IL-17, IL-23, and other proinflammatory cytokines while increasing anti-inflammatory IL-10; FDA-approved specifically for oral ulcers in Behcet disease",
        sideEffects: "Diarrhea (most common, often self-limiting after 2 to 4 weeks), nausea, headache, upper respiratory tract infections, weight loss (monitor weight), depression and suicidal ideation (screen before and during treatment), insomnia",
        contra: "Known hypersensitivity to apremilast, severe hepatic impairment; use cautiously in patients with history of depression or suicidal ideation; dose reduction required for severe renal impairment (GFR less than 30)",
        pearl: "Apremilast 30 mg twice daily is FDA-approved for oral ulcers in BD and significantly reduces ulcer number and pain; requires a 5-day dose titration to reduce GI side effects (start 10 mg daily, increase by 10 mg every day); screen for depression and suicidal ideation at baseline and periodically during treatment; advantageous over biologics because it is oral, does not require TB screening, and has a favorable safety profile for long-term use"
      }
    ],
    pearls: [
      "Behcet disease is the only vasculitis that affects both arteries and veins of all sizes; this distinguishes it from other vasculitides which typically affect vessels of a specific caliber (large-vessel: Takayasu, giant cell arteritis; medium-vessel: PAN; small-vessel: ANCA-associated vasculitis)",
      "Hemoptysis in a patient with Behcet disease is a medical emergency suggesting pulmonary artery aneurysm; anticoagulation is CONTRAINDICATED as it increases hemorrhage risk from the aneurysm; treatment is immunosuppression with cyclophosphamide and possible embolization",
      "The pathergy test is nearly unique to Behcet disease: a disproportionate papulopustular reaction to a sterile needle prick demonstrates the neutrophilic hyperreactivity central to BD pathogenesis; it is more often positive in Middle Eastern and Asian patients than in Western patients",
      "Cyclosporine is effective for BD uveitis but is CONTRAINDICATED in neuro-Behcet because it paradoxically worsens CNS disease through neurotoxicity; infliximab or azathioprine are preferred for neuro-Behcet",
      "Venous thrombosis in BD is inflammatory, not primarily thrombophilic; the thrombi adhere tightly to the inflamed vessel wall, so pulmonary embolism is less common than in other causes of DVT; treatment priorities are immunosuppression over anticoagulation",
      "Oral ulcers in BD are clinically indistinguishable from common aphthous stomatitis; the key to diagnosis is recurrence (3 or more episodes in 12 months) combined with extra-oral manifestations; any patient with recurrent severe oral ulcers should be evaluated for BD",
      "Young males with BD have the worst prognosis due to higher rates of ocular disease (risk of blindness), vascular disease (pulmonary artery aneurysm, DVT), and neuro-Behcet; aggressive early immunosuppression is indicated for this high-risk group"
    ],
    quiz: [
      {
        question: "A patient with Behcet disease presents with hemoptysis. The nurse knows that this symptom may indicate which life-threatening complication, and what is CONTRAINDICATED?",
        options: [
          "Pneumonia; corticosteroids are contraindicated",
          "Pulmonary embolism; thrombolytics are contraindicated",
          "Pulmonary artery aneurysm; anticoagulation is contraindicated because it increases hemorrhage risk from the aneurysm",
          "Bronchitis; NSAIDs are contraindicated"
        ],
        correct: 2,
        rationale: "Hemoptysis in Behcet disease suggests pulmonary artery aneurysm, which is nearly pathognomonic for BD and carries high mortality from rupture. Anticoagulation is CONTRAINDICATED because it increases the risk of fatal hemorrhage from the aneurysm. Treatment is immunosuppression (high-dose corticosteroids plus cyclophosphamide) and possible embolization. This is a medical emergency requiring immediate intervention."
      },
      {
        question: "A nurse performs a pathergy test on a patient suspected of having Behcet disease. How should the test be performed and interpreted?",
        options: [
          "Apply a patch with common allergens and read in 72 hours for contact dermatitis",
          "Insert a sterile 20-gauge needle intradermally and read at 24 to 48 hours; positive if a papulopustular lesion forms at the site",
          "Inject tuberculin purified protein derivative and read at 48 to 72 hours for induration",
          "Scratch the forearm with common allergens and read in 15 minutes for wheal formation"
        ],
        correct: 1,
        rationale: "The pathergy test involves intradermal insertion of a sterile 20-gauge needle into the forearm. The site is examined at 24 to 48 hours. A positive result is the formation of a papulopustular lesion at the puncture site, demonstrating the exaggerated neutrophilic inflammatory response characteristic of Behcet disease. This is not an allergy test (patch or scratch test) or tuberculin test."
      },
      {
        question: "A patient with Behcet disease and posterior uveitis is being started on infliximab. Which screening test must the nurse verify was completed before the first infusion?",
        options: [
          "Serum uric acid level",
          "Tuberculosis screening (PPD or IGRA) and chest X-ray",
          "Hemoglobin A1c",
          "Thyroid function panel"
        ],
        correct: 1,
        rationale: "All patients must be screened for latent tuberculosis before initiating anti-TNF therapy (infliximab, adalimumab). TNF-alpha is essential for containing Mycobacterium tuberculosis in granulomas; blocking TNF can reactivate latent TB, causing disseminated and often fatal tuberculosis. Screening includes PPD skin test or IGRA blood test plus chest X-ray. If latent TB is found, treatment with isoniazid must begin at least 1 month before infliximab."
      }
    ]
  },

  "bishop-score-rn": {
    title: "Bishop Score and Cervical Readiness Assessment",
    cellular: {
      title: "Cervical Physiology and Ripening Mechanisms for Labor Induction",
      content: "The Bishop Score is a standardized clinical assessment tool used to evaluate cervical readiness (favorability) for labor induction. Developed by Dr. Edward Bishop in 1964, it assigns a numerical score to five cervical characteristics: dilation, effacement, station, consistency, and position. The total score (0 to 13) predicts the likelihood of successful vaginal delivery following induction, with a score of 8 or higher indicating a favorable cervix with high probability of successful induction, while a score of 6 or less indicates an unfavorable cervix that may require cervical ripening before oxytocin induction.\n\nUnderstanding the physiology of cervical ripening is essential for the RN managing labor induction. The cervix is a cylindrical structure composed primarily of connective tissue (85 to 90% collagen with small amounts of elastin and smooth muscle) with a central canal lined by columnar epithelium. During most of pregnancy, the cervix remains firm, closed, and posterior, providing structural support to the uterus and preventing premature delivery. This mechanical barrier function depends on the dense cross-linked collagen network (primarily type I and type III collagen) and the high concentration of proteoglycans, particularly dermatan sulfate, which stabilizes collagen fibrils.\n\nCervical ripening is the process of structural remodeling that transforms the cervix from a rigid barrier to a soft, distensible structure capable of dilating to 10 cm during labor. This process involves four key molecular changes. First, collagen degradation: matrix metalloproteinases (MMP-1, MMP-2, MMP-8, MMP-9) are activated by inflammatory mediators (IL-1-beta, IL-8, TNF-alpha) released by cervical fibroblasts, macrophages, and neutrophils. These enzymes cleave the triple-helical collagen molecules, disrupting the organized collagen network. Second, glycosaminoglycan changes: dermatan sulfate (which stabilizes collagen) decreases while hyaluronic acid (which attracts water and causes tissue edema) increases dramatically, causing cervical softening through increased water content. Third, inflammatory cell infiltration: macrophages and neutrophils infiltrate the cervical stroma, releasing cytokines and proteases that drive the remodeling process. This is sometimes called the inflammatory model of parturition. Fourth, smooth muscle relaxation: the small amount of smooth muscle in the cervix relaxes, contributed to by nitric oxide and prostaglandin E2 production.\n\nProstaglandins play the central role in cervical ripening. Prostaglandin E2 (PGE2) and prostaglandin F2-alpha (PGF2-alpha) are produced locally in the cervix, decidua, and fetal membranes. PGE2 acts on cervical fibroblasts to increase hyaluronic acid synthesis, activate MMPs, recruit inflammatory cells, and soften cervical tissue. PGF2-alpha has similar effects and additionally stimulates myometrial contractions. The cervical ripening agents used clinically (dinoprostone/Cervidil, misoprostol/Cytotec) are synthetic prostaglandin analogs that mimic these natural processes.\n\nMechanical cervical ripening methods include the Foley catheter balloon and the Cook double-balloon catheter. These devices work by exerting mechanical pressure on the internal cervical os, which stimulates local prostaglandin release, promotes Ferguson reflex-mediated oxytocin secretion, and physically separates the lower uterine segment membranes from the decidua (membrane stripping effect), releasing additional prostaglandins from the decidua and fetal membranes.\n\nThe five Bishop Score components each evaluate a specific aspect of cervical readiness. Dilation measures the degree of cervical os opening (0 = closed, 1 = 1 to 2 cm, 2 = 3 to 4 cm, 3 = 5 to 6 cm). Effacement measures cervical thinning and shortening (0 = 0 to 30%, 1 = 40 to 50%, 2 = 60 to 70%, 3 = 80% or more). Station measures the relationship of the fetal presenting part to the maternal ischial spines (-3 to +3, where 0 is at the spines). Consistency assesses cervical firmness (0 = firm like the tip of the nose, 1 = medium like the earlobe, 2 = soft like the lip). Position assesses the cervical orientation in the vaginal canal (0 = posterior, 1 = mid-position, 2 = anterior).\n\nClinical significance: A Bishop Score of 8 or higher has a success rate for vaginal delivery comparable to spontaneous labor onset (approximately 95%). A score of 6 or less indicates an unfavorable cervix with lower induction success rates (approximately 50 to 60% for vaginal delivery without prior ripening). For unfavorable cervixes, cervical ripening agents or mechanical dilation should be employed before initiating oxytocin to improve outcomes. Modified Bishop scores have been developed that incorporate additional factors such as parity, gestational age, and BMI to improve predictive accuracy.\n\nIndications for labor induction include post-term pregnancy (41 to 42 weeks), preeclampsia/eclampsia, premature rupture of membranes (PROM) without spontaneous labor onset, chorioamnionitis, gestational diabetes with poor glycemic control or macrosomia, oligohydramnios, fetal growth restriction, fetal demise, and various maternal conditions (chronic hypertension, renal disease, cholestasis of pregnancy). Contraindications include placenta previa, vasa previa, umbilical cord prolapse, active genital herpes, prior classical (vertical) uterine incision, transverse fetal lie, and certain situations where vaginal delivery is unsafe.\n\nThe most important safety consideration for the RN during labor induction is uterine tachysystole (previously called hyperstimulation): more than 5 contractions in 10 minutes averaged over 30 minutes. Tachysystole reduces uteroplacental blood flow between contractions, causing fetal hypoxemia. Management includes discontinuing or reducing the inducing agent (stop oxytocin, remove dinoprostone insert), administering IV terbutaline 0.25 mg subcutaneously for acute tocolysis, positioning the patient in left lateral position, increasing IV fluid rate, and administering oxygen by face mask if fetal heart rate abnormalities persist."
    },
    riskFactors: [
      "Nulliparity (cervix has not previously dilated, typically less favorable Bishop score, longer induction time)",
      "Unfavorable Bishop Score less than 6 (cervix is closed, firm, posterior, thick, and presenting part is high)",
      "Post-term pregnancy greater than 41 weeks (most common indication for induction)",
      "Preeclampsia or gestational hypertension requiring delivery (medical indication for induction regardless of Bishop score)",
      "Premature rupture of membranes without spontaneous labor onset within 12 to 24 hours",
      "Maternal obesity (BMI greater than 30 associated with lower Bishop scores and higher rates of failed induction)",
      "Prior cesarean delivery with low transverse incision (relative; induction with caution using mechanical methods, oxytocin at lower maximum doses; prostaglandins generally contraindicated due to uterine rupture risk)"
    ],
    diagnostics: [
      "Bishop Score assessment: systematic cervical examination evaluating dilation (0 to 6 cm), effacement (0 to 80%+), station (-3 to +3), consistency (firm to soft), and position (posterior to anterior); total score 0 to 13",
      "Fetal well-being assessment before induction: non-stress test (NST) to confirm reactive fetal heart rate pattern, biophysical profile (BPP) if indicated, ultrasound for estimated fetal weight and amniotic fluid index",
      "Group B streptococcus (GBS) status: verify culture results and administer intrapartum antibiotic prophylaxis (penicillin G or ampicillin) if positive or if status is unknown at the time of membrane rupture",
      "Cervical length by transvaginal ultrasound: cervical length less than 25 mm may predict more favorable response to induction; sonographic cervical assessment is more objective and reproducible than digital examination",
      "Fetal presentation confirmation: ultrasound to verify cephalic presentation before induction; breech or transverse lie are contraindications to vaginal delivery and induction",
      "Laboratory studies: CBC, type and screen, coagulation studies (if preeclampsia), liver function and platelet count (if HELLP syndrome suspected)"
    ],
    management: [
      "Bishop Score 8 or greater (favorable cervix): proceed directly with oxytocin induction using institutional protocol; amniotomy may be performed to accelerate labor",
      "Bishop Score 6 or less (unfavorable cervix): cervical ripening required before oxytocin; options include pharmacologic (dinoprostone, misoprostol) or mechanical (Foley catheter balloon) methods",
      "Dinoprostone (Cervidil): 10 mg vaginal insert placed in posterior fornix for up to 12 hours; can be removed if tachysystole occurs; must wait 30 minutes after removal before starting oxytocin",
      "Misoprostol (Cytotec): 25 mcg intravaginally every 4 to 6 hours (maximum 6 doses) or 25 to 50 mcg orally every 4 hours; CONTRAINDICATED in prior cesarean delivery due to uterine rupture risk",
      "Foley catheter cervical ripening: 30 to 60 mL balloon inserted through cervical os and inflated; applies mechanical pressure; expels spontaneously at approximately 3 cm dilation; safe in prior cesarean delivery",
      "Oxytocin induction: start at 1 to 2 milliunits/minute, increase by 1 to 2 milliunits every 15 to 30 minutes until adequate contraction pattern (3 contractions in 10 minutes lasting 60 to 90 seconds); maximum dose per institutional protocol",
      "Amniotomy (artificial rupture of membranes): may be performed when cervix is 3 to 4 cm dilated to augment labor; document amniotic fluid color (clear, bloody, meconium-stained), volume, and time of rupture; assess fetal heart rate immediately before and after"
    ],
    nursingActions: [
      "Perform Bishop Score assessment accurately using sterile digital cervical examination: evaluate each of the 5 components (dilation, effacement, station, consistency, position), total the score, and document findings; communicate score to provider to guide induction method selection; reassess after cervical ripening agent administration to determine readiness for oxytocin",
      "Administer cervical ripening agents per protocol: for dinoprostone (Cervidil) insert, place in posterior vaginal fornix with patient supine for 30 minutes after placement; continuous electronic fetal monitoring (EFM) for at least 2 hours after placement; can remove string to withdraw insert if tachysystole occurs; for misoprostol, administer prescribed dose and route, keeping patient recumbent for 30 minutes",
      "Monitor for uterine tachysystole during ripening and induction: more than 5 contractions in 10 minutes averaged over 30 minutes; if tachysystole occurs with fetal heart rate decelerations: stop oxytocin infusion immediately, remove dinoprostone insert, position patient in left lateral decubitus, increase IV fluid rate, administer oxygen by face mask 10 L/min, prepare terbutaline 0.25 mg SC if needed, and notify provider",
      "Perform continuous electronic fetal monitoring during labor induction: assess fetal heart rate baseline (110 to 160 bpm), variability (moderate is reassuring), accelerations (present is reassuring), and decelerations (classify as early, variable, or late); late decelerations with loss of variability indicate fetal hypoxemia requiring immediate intervention",
      "For Foley catheter cervical ripening: verify correct placement (balloon behind internal os), tape catheter to inner thigh with gentle traction; monitor for signs of cord prolapse after insertion (fetal heart rate decelerations); assess for spontaneous balloon expulsion indicating cervical dilation to approximately 3 cm; avoid excessive traction that may cause cervical laceration",
      "Maintain accurate labor documentation: contraction frequency, duration, and intensity; cervical examination findings with time stamps; fetal heart rate patterns; medication administration times and doses; maternal vital signs every 30 to 60 minutes during induction; fluid intake and urine output; any interventions for abnormal patterns",
      "Educate the patient about the induction process: explain that induction may take 12 to 24 hours or longer, especially with an unfavorable cervix; discuss the step-wise approach (ripening then oxytocin); explain the purpose of continuous monitoring; provide comfort measures and positioning options; support informed decision-making about pain management options"
    ],
    assessmentFindings: [
      "Favorable cervix (Bishop 8+): cervix dilated 3 to 4 cm, 70 to 80% effaced, station 0, soft consistency, anterior position",
      "Unfavorable cervix (Bishop 0 to 5): cervix closed or minimally dilated, less than 30% effaced, station -3, firm consistency, posterior position",
      "Progressive cervical change after ripening: increasing dilation, effacement, and descent of presenting part indicating cervical response to ripening agent",
      "Adequate contraction pattern: 3 contractions in 10 minutes lasting 60 to 90 seconds with 60-second rest periods between contractions",
      "Category I fetal heart rate tracing (normal/reassuring): baseline 110 to 160 bpm, moderate variability, accelerations present, no decelerations",
      "Category III fetal heart rate tracing (abnormal): sinusoidal pattern or absent variability with recurrent late decelerations, recurrent variable decelerations, or bradycardia requiring immediate intervention"
    ],
    signs: {
      left: [
        "Progressive cervical change with regular contractions",
        "Category I fetal heart rate tracing throughout induction",
        "Patient comfortable with adequate pain management",
        "Appropriate contraction pattern without tachysystole",
        "Clear amniotic fluid after amniotomy"
      ],
      right: [
        "Uterine tachysystole (more than 5 contractions in 10 minutes) with fetal heart rate decelerations",
        "Category III fetal heart rate tracing (absent variability with recurrent lates)",
        "Cord prolapse after amniotomy (palpable cord, sudden prolonged deceleration)",
        "Uterine rupture (sudden severe abdominal pain, loss of fetal station, loss of contractions, hemorrhage)",
        "Failed induction after maximum ripening and oxytocin requiring cesarean delivery"
      ]
    },
    medications: [
      {
        name: "Oxytocin (Pitocin)",
        type: "Synthetic Posterior Pituitary Hormone (Uterotonic)",
        action: "Binds oxytocin receptors on myometrial cells, activating phospholipase C, increasing intracellular calcium through the inositol triphosphate pathway, and stimulating rhythmic uterine contractions through actin-myosin coupling; also stimulates prostaglandin production by the decidua, further enhancing contractile activity; oxytocin receptor density increases dramatically (100 to 200 fold) near term, explaining the increased uterine sensitivity to oxytocin at term",
        sideEffects: "Uterine tachysystole (most important, can cause fetal hypoxemia), water intoxication and hyponatremia (oxytocin has antidiuretic hormone-like activity at high doses), nausea, vomiting, uterine rupture (rare, higher risk with prior uterine surgery), hypotension (with rapid IV bolus - never give as bolus for induction), postpartum hemorrhage from uterine atony after prolonged use (receptor desensitization)",
        contra: "Placenta previa, vasa previa, active genital herpes, cord prolapse, transverse fetal lie, prior classical uterine incision, fetal distress requiring immediate delivery, cephalopelvic disproportion; use cautiously with prior low transverse cesarean (TOLAC - lower maximum oxytocin doses)",
        pearl: "Always administered via infusion pump with precise titration; start at 1 to 2 milliunits/minute, increase by 1 to 2 milliunits every 15 to 30 minutes; goal is 3 contractions in 10 minutes; if tachysystole occurs with fetal heart rate changes, STOP the infusion immediately (half-life is only 3 to 5 minutes so effects resolve quickly); do NOT piggyback oxytocin - use a dedicated line with the infusion pump closest to the IV insertion site to prevent bolus delivery"
      },
      {
        name: "Misoprostol (Cytotec)",
        type: "Synthetic Prostaglandin E1 Analog (Cervical Ripening Agent)",
        action: "Binds EP2 and EP3 prostaglandin receptors on cervical fibroblasts, activating matrix metalloproteinases that degrade cervical collagen, increasing hyaluronic acid synthesis (causing tissue softening through water absorption), and stimulating myometrial contractions; produces both cervical ripening and uterine contractile effects",
        sideEffects: "Uterine tachysystole (more common than with dinoprostone), nausea, vomiting, diarrhea, fever and chills, uterine rupture (risk is significantly higher in patients with prior uterine surgery - CONTRAINDICATED in prior cesarean), meconium passage (from prostaglandin-stimulated fetal GI motility)",
        contra: "Prior cesarean delivery or other uterine surgery (5 to 15 fold increased risk of uterine rupture with prostaglandin cervical ripening), placenta previa, active genital herpes, unexplained vaginal bleeding, known hypersensitivity; cannot be removed once administered (unlike dinoprostone insert)",
        pearl: "Low-dose vaginal misoprostol 25 mcg is the preferred dose for cervical ripening (doses of 50 mcg or higher significantly increase tachysystole risk); wait at least 4 hours between doses; maximum 6 doses; wait at least 4 hours after last misoprostol dose before starting oxytocin; CRITICAL safety difference from dinoprostone: misoprostol cannot be removed once administered, so tachysystole management relies on tocolysis (terbutaline) rather than agent removal"
      },
      {
        name: "Terbutaline",
        type: "Beta-2 Adrenergic Agonist (Acute Tocolytic)",
        action: "Stimulates beta-2 adrenergic receptors on myometrial smooth muscle cells, activating adenylyl cyclase, increasing intracellular cAMP, and decreasing intracellular calcium, causing rapid uterine relaxation; used as a rescue tocolytic for acute uterine tachysystole during labor induction when fetal heart rate abnormalities are present",
        sideEffects: "Maternal tachycardia (most common, beta-1 cross-reactivity), palpitations, tremor, anxiety, headache, hyperglycemia, hypokalemia, pulmonary edema (with prolonged use or excessive IV fluids), fetal tachycardia",
        contra: "Maternal heart disease (tachyarrhythmia risk), uncontrolled diabetes (hyperglycemia worsening), maternal heart rate greater than 120 bpm, concurrent use with other beta-agonists; FDA black box warning against prolonged use for preterm labor (maternal death from cardiac events)",
        pearl: "For acute tachysystole with fetal distress: terbutaline 0.25 mg subcutaneous injection; onset within 5 to 15 minutes; may repeat once in 15 to 30 minutes if needed; this is a rescue medication for acute uterine relaxation, NOT for ongoing tocolysis; monitor maternal heart rate and blood pressure every 5 minutes after administration; document fetal heart rate response"
      }
    ],
    pearls: [
      "A Bishop Score of 8 or higher predicts successful vaginal delivery after induction at rates comparable to spontaneous labor; a score of 6 or less requires cervical ripening before oxytocin to avoid failed induction and unnecessary cesarean delivery",
      "Misoprostol is absolutely CONTRAINDICATED in patients with prior cesarean delivery or uterine surgery due to a 5 to 15 fold increased risk of uterine rupture; Foley catheter balloon is the preferred ripening method for trial of labor after cesarean (TOLAC)",
      "The critical difference between Cervidil and misoprostol for nursing safety: Cervidil has a retrieval string and can be removed if tachysystole occurs, while misoprostol cannot be removed once administered; choose accordingly based on the clinical situation",
      "Continuous electronic fetal monitoring is mandatory during all labor induction; intermittent auscultation is NOT appropriate because induction agents create a higher risk of tachysystole and fetal distress compared to spontaneous labor",
      "Uterine tachysystole (more than 5 contractions in 10 minutes) occurs in 1 to 5% of oxytocin inductions and 10 to 15% of misoprostol inductions; the rapid recognition-and-response nursing protocol (stop agent, left lateral position, IV fluids, oxygen, terbutaline if needed) prevents fetal hypoxemic injury",
      "The Ferguson reflex explains how mechanical cervical dilation (Foley catheter) promotes labor: pressure on the cervix activates stretch receptors that send signals via pelvic nerves to the hypothalamus, triggering oxytocin release from the posterior pituitary, which stimulates uterine contractions, creating a positive feedback loop",
      "Failed induction does not mean failed immediately; ACOG defines failed induction as inability to achieve active labor (6 cm dilation with membrane rupture) after adequate oxytocin duration (at least 12 to 18 hours for latent phase); premature diagnosis of failed induction leads to unnecessary cesarean deliveries"
    ],
    quiz: [
      {
        question: "A nurse performs a cervical examination on a patient scheduled for labor induction and finds: cervix 1 cm dilated, 30% effaced, station -2, firm consistency, posterior position. The Bishop Score is 3. What does this indicate?",
        options: [
          "The cervix is favorable and oxytocin induction can begin immediately",
          "The cervix is unfavorable and cervical ripening should be performed before oxytocin induction",
          "The patient is in active labor and no intervention is needed",
          "A cesarean delivery should be performed immediately"
        ],
        correct: 1,
        rationale: "A Bishop Score of 3 indicates an unfavorable cervix (score of 6 or less). Initiating oxytocin induction with an unfavorable cervix has a high failure rate (40 to 50%). Cervical ripening with pharmacologic agents (dinoprostone, misoprostol) or mechanical methods (Foley catheter balloon) should be performed first to improve the Bishop score before starting oxytocin."
      },
      {
        question: "During oxytocin induction, the electronic fetal monitor shows 7 contractions in 10 minutes with late decelerations and minimal variability. What is the priority nursing action?",
        options: [
          "Increase the oxytocin rate to strengthen contractions and facilitate delivery",
          "Stop the oxytocin infusion immediately, position patient in left lateral decubitus, increase IV fluids, administer oxygen, and notify the provider",
          "Decrease the oxytocin rate by 50% and continue monitoring",
          "Perform a vaginal examination to assess cervical dilation"
        ],
        correct: 1,
        rationale: "This is uterine tachysystole (7 contractions in 10 minutes, more than the threshold of 5) with concerning fetal heart rate findings (late decelerations with minimal variability indicating fetal hypoxemia). The priority is to STOP oxytocin immediately (half-life 3 to 5 minutes), position left lateral to maximize uteroplacental blood flow, increase IV fluids to improve uterine perfusion, apply oxygen, and notify the provider for possible terbutaline administration. Increasing oxytocin would worsen the situation."
      },
      {
        question: "A patient with a prior low transverse cesarean delivery requires labor induction for preeclampsia at 37 weeks. The Bishop score is 4. Which cervical ripening method is safest for this patient?",
        options: [
          "Misoprostol 50 mcg intravaginally every 4 hours",
          "Dinoprostone (Cervidil) vaginal insert for 12 hours",
          "Foley catheter balloon cervical ripening",
          "High-dose oxytocin protocol starting at 6 milliunits/minute"
        ],
        correct: 2,
        rationale: "Prostaglandin agents (misoprostol and dinoprostone) are CONTRAINDICATED in patients with prior cesarean delivery due to significantly increased uterine rupture risk (5 to 15 fold for misoprostol). The Foley catheter balloon is the safest cervical ripening method for trial of labor after cesarean (TOLAC) because it works mechanically without pharmacologic myometrial stimulation. Oxytocin can be used for TOLAC but at lower maximum doses, and the cervix needs ripening first with a Bishop score of 4."
      }
    ]
  },

  "blastomycosis-rn": {
    title: "Blastomycosis",
    cellular: {
      title: "Dimorphic Fungal Pathogenesis of Blastomyces dermatitidis",
      content: "Blastomycosis is a systemic fungal infection caused by the dimorphic fungus Blastomyces dermatitidis (and the recently reclassified Blastomyces gilchristii), endemic to the Ohio and Mississippi River valleys, the Great Lakes region, and the St. Lawrence River valley in North America. Understanding the unique biology of this dimorphic fungus and the host immune response is essential for the RN to recognize the diverse clinical presentations and implement appropriate care.\n\nBlastomyces dermatitidis exists in two distinct morphological forms depending on temperature, a property called thermal dimorphism shared with other endemic mycoses (histoplasmosis, coccidioidomycosis). In the environment (soil, decaying organic matter near waterways at temperatures of 25 to 30 degrees C), the organism grows as a mold (mycelial form), producing hyphae with terminal conidia (asexual spores 2 to 10 micrometers in diameter). When soil is disturbed by activities such as excavation, hunting, camping near waterways, or agricultural work, these conidia become aerosolized and are inhaled into the lungs. Upon reaching the warm environment of the host pulmonary alveoli (37 degrees C), the conidia undergo a critical morphological transformation over 48 to 72 hours, converting to the yeast form: large (8 to 15 micrometers, sometimes up to 30 micrometers), thick-walled yeast cells that reproduce by broad-based budding (the bud has a wide attachment to the parent cell, which is the pathognomonic microscopic finding distinguishing Blastomyces from other yeasts).\n\nThe yeast form is the pathogenic form. Its large cell size prevents effective phagocytosis by alveolar macrophages, and its thick cell wall (composed of alpha-1,3-glucan, chitin, and the immunomodulatory surface glycoprotein BAD1, formerly WI-1) resists intracellular killing mechanisms. BAD1 (Blastomyces adhesin 1) is the principal virulence factor: it mediates adhesion to host tissues, suppresses TNF-alpha production by macrophages (undermining the inflammatory response needed for fungal containment), and inhibits complement-mediated opsonization.\n\nThe initial host defense depends on the innate immune system. When conidia are inhaled, alveolar macrophages and neutrophils are recruited to the site of infection. Neutrophils can kill conidia through oxidative burst mechanisms (myeloperoxidase, reactive oxygen species), but the yeast form is more resistant to neutrophil killing. Macrophages ingest the conidia but are unable to kill the yeast form effectively without T-cell-mediated activation. Dendritic cells process fungal antigens and migrate to regional lymph nodes, presenting antigens to naive T cells and initiating the adaptive immune response.\n\nThe adaptive immune response is critical for disease containment. CD4+ Th1 cells produce interferon-gamma (IFN-gamma) and TNF-alpha, which activate macrophages to enhance their fungicidal activity through increased production of nitric oxide, reactive oxygen intermediates, and phagolysosomal fusion. Activated macrophages can then kill intracellular yeast cells. The formation of well-organized granulomas (composed of epithelioid macrophages, multinucleated giant cells, and a surrounding rim of T lymphocytes) is the hallmark of effective immune containment. These granulomas wall off the organisms and prevent dissemination. When T-cell immunity is deficient (HIV/AIDS with CD4 count less than 200, organ transplant recipients on immunosuppression, TNF-alpha inhibitor therapy), the granulomatous response fails, and Blastomyces disseminates widely, causing fulminant and often fatal disease.\n\nClinically, blastomycosis has four major presentations. Pulmonary blastomycosis (60 to 90% of cases) presents as an acute pneumonia (fever, productive cough, chest pain, myalgias mimicking community-acquired bacterial pneumonia) or chronic pneumonia (cough, low-grade fever, weight loss, night sweats mimicking tuberculosis or lung cancer). Chest imaging shows lobar or multilobar consolidation, mass-like lesions (often mistaken for lung cancer), miliary patterns, or cavitary disease. Cutaneous blastomycosis (40 to 80% of disseminated cases) presents with verrucous (wart-like) lesions with raised, irregular borders and central ulceration, or ulcerative lesions with sharp undermined borders draining purulent material. These skin lesions are often painless and may be mistaken for skin cancer, tuberculosis, or pyoderma gangrenosum. Osteoarticular blastomycosis (10 to 25% of disseminated cases) affects long bones, vertebrae, and ribs, presenting as osteomyelitis with pain, swelling, and draining sinuses. Genitourinary blastomycosis (10 to 30% of male disseminated cases) presents as prostatitis or epididymoorchitis.\n\nDiagnosis is confirmed by visualizing the characteristic broad-based budding yeast on microscopy of clinical specimens (sputum, BAL fluid, wound drainage, tissue biopsy) using KOH preparation, calcofluor white staining, or histopathology with GMS (Gomori methenamine silver) or PAS (periodic acid-Schiff) stains. Culture on Sabouraud dextrose agar grows mold colonies in 1 to 4 weeks; definitive identification requires DNA probe or MALDI-TOF mass spectrometry. The Blastomyces urine antigen test (enzyme immunoassay for galactomannan) has 90% sensitivity in disseminated disease and 76% in pulmonary disease, but cross-reacts with Histoplasma (both produce galactomannan).\n\nTreatment depends on disease severity. Mild to moderate pulmonary disease: itraconazole 200 mg three times daily for 3 days (loading dose), then 200 mg twice daily for 6 to 12 months. Moderate to severe pulmonary disease or any disseminated disease: IV amphotericin B lipid formulation (3 to 5 mg/kg/day) for 1 to 2 weeks or until clinical improvement, followed by step-down to itraconazole 200 mg twice daily to complete 12 months total. CNS blastomycosis: high-dose IV amphotericin B (5 mg/kg/day) for 4 to 6 weeks followed by oral fluconazole or voriconazole (which penetrate the CNS better than itraconazole) for at least 12 months."
    },
    riskFactors: [
      "Residence in or travel to endemic areas: Ohio and Mississippi River valleys, Great Lakes region, St. Lawrence River valley",
      "Outdoor occupational or recreational activities: hunting, fishing, camping, forestry work, farming, construction near waterways where soil contains the organism",
      "Soil disruption activities: excavation, demolition, digging near water, handling decaying organic matter in endemic areas",
      "Immunosuppression: HIV/AIDS (CD4 less than 200), organ transplant recipients, TNF-alpha inhibitor therapy, chronic corticosteroid use (risk of disseminated and fatal disease)",
      "Male sex (2 to 10 fold higher incidence in males, possibly due to greater outdoor occupational exposure)",
      "Dog exposure (dogs develop clinical blastomycosis from shared environmental exposure, serving as a sentinel for human risk; dogs do NOT transmit to humans)",
      "Middle-aged adults (peak incidence ages 30 to 60 years)"
    ],
    diagnostics: [
      "Microscopy of clinical specimens (sputum, BAL fluid, wound drainage, tissue biopsy): KOH wet mount or calcofluor white staining revealing large (8 to 15 mcm) thick-walled yeast with broad-based budding (bud attachment is as wide as the parent cell - pathognomonic)",
      "Fungal culture: growth on Sabouraud dextrose agar at 25 C produces white mold colonies in 1 to 4 weeks; conversion to yeast form at 37 C confirms dimorphism; DNA probe for definitive species identification",
      "Histopathology (tissue biopsy with GMS or PAS stains): mixed pyogranulomatous inflammation with neutrophils and epithelioid granulomas containing large broad-based budding yeast forms",
      "Blastomyces urine antigen (enzyme immunoassay): sensitivity 90% in disseminated disease, 76% in isolated pulmonary disease; cross-reacts with Histoplasma antigen (both organisms produce galactomannan); useful for diagnosis and monitoring treatment response",
      "Chest imaging (X-ray and CT): lobar consolidation, mass lesions mimicking lung cancer, miliary pattern, cavitary disease, or mediastinal lymphadenopathy",
      "Itraconazole trough level monitoring: therapeutic range 1 to 5 mcg/mL; check after 2 weeks of therapy; subtherapeutic levels are a common cause of treatment failure"
    ],
    management: [
      "Mild to moderate pulmonary blastomycosis: itraconazole 200 mg three times daily for 3 days (loading), then 200 mg twice daily for 6 to 12 months; take with food and acidic beverage to optimize absorption",
      "Moderate to severe pulmonary or disseminated disease: IV amphotericin B lipid formulation (AmBisome 3 to 5 mg/kg/day) for 1 to 2 weeks until clinical improvement, then step-down to itraconazole 200 mg twice daily for total 12 months",
      "CNS blastomycosis: high-dose IV amphotericin B (5 mg/kg/day) for 4 to 6 weeks followed by oral voriconazole or fluconazole (better CNS penetration than itraconazole) for at least 12 months and until CSF normalization",
      "Immunocompromised patients: all cases treated as severe disease with initial IV amphotericin B regardless of clinical severity; lifelong suppressive itraconazole therapy (200 mg daily) if immunosuppression cannot be reversed",
      "Monitor itraconazole trough levels at 2 weeks; target 1 to 5 mcg/mL; drug interactions are extensive (CYP3A4 inhibition) requiring medication reconciliation",
      "Monitor Blastomyces urine antigen serially during treatment: declining levels indicate therapeutic response; rising levels suggest treatment failure or relapse",
      "Wound care for cutaneous lesions: keep lesions clean and dry, use non-adherent dressings, document size and healing progress; skin lesions resolve with systemic antifungal therapy"
    ],
    nursingActions: [
      "Assess respiratory status systematically in pulmonary blastomycosis: auscultate lung sounds bilaterally (crackles, decreased breath sounds, bronchial sounds over consolidation), monitor SpO2 continuously, assess work of breathing (accessory muscle use, tachypnea), track sputum characteristics (amount, color, consistency) and collect specimens for fungal culture and microscopy",
      "Monitor for amphotericin B infusion-related reactions: fever, rigors, chills, nausea, vomiting, headache (occur in 50 to 90% of patients during initial infusions); premedicate with acetaminophen 650 mg, diphenhydramine 25 to 50 mg, and meperidine 25 to 50 mg IV for rigors; hydrate with 500 to 1000 mL NS before and after infusion to prevent nephrotoxicity",
      "Monitor renal function during amphotericin B therapy: check BUN, creatinine, potassium, and magnesium at least every other day; amphotericin B causes renal tubular damage leading to potassium and magnesium wasting (supplement aggressively), decreased GFR (hold dose if creatinine doubles from baseline), and renal tubular acidosis; lipid formulations (AmBisome) are less nephrotoxic than conventional amphotericin B deoxycholate",
      "Ensure correct itraconazole administration: must be taken with FOOD and an ACIDIC beverage (cola, orange juice) to maximize absorption; capsule form requires gastric acid for dissolution - proton pump inhibitors and H2 blockers significantly reduce absorption; verify there are no drug interactions (itraconazole is a potent CYP3A4 inhibitor that increases levels of statins, warfarin, calcium channel blockers, benzodiazepines, and many other drugs)",
      "Perform wound assessment for cutaneous lesions: measure and photograph lesions at each dressing change, document border characteristics (verrucous vs ulcerative), drainage character, and signs of secondary bacterial infection; educate patient that skin lesions are NOT contagious (person-to-person transmission does not occur with blastomycosis); expect lesion improvement within 2 to 4 weeks of antifungal therapy",
      "Educate patient about treatment duration: blastomycosis requires 6 to 12 months of antifungal therapy for cure; premature discontinuation leads to relapse; symptoms typically improve within 2 to 4 weeks but treatment must be completed; emphasize that feeling better does not mean the infection is cured",
      "Assess for signs of treatment failure or relapse: persistent or worsening symptoms after 2 to 4 weeks of appropriate therapy, new skin lesions or bone pain, rising urine antigen levels, subtherapeutic itraconazole trough levels; report any concerns to the provider for treatment adjustment"
    ],
    assessmentFindings: [
      "Pulmonary: productive cough, fever, chest pain, dyspnea, night sweats, weight loss; may mimic community-acquired pneumonia, tuberculosis, or lung cancer",
      "Cutaneous: verrucous (wart-like) papules and plaques with raised irregular borders, central ulceration, and purulent drainage; or ulcerative lesions with undermined borders; painless or mildly tender; most commonly on exposed skin (face, extremities)",
      "Osteoarticular: bone pain (especially long bones, vertebrae, ribs), localized swelling, draining sinus tracts, decreased range of motion at affected joints",
      "Genitourinary (males): prostatitis symptoms (dysuria, frequency, perineal pain), scrotal mass or swelling from epididymoorchitis",
      "Constitutional: fever, malaise, fatigue, anorexia, weight loss (common in disseminated disease)",
      "Chest imaging: lobar consolidation, mass lesion (may be biopsied as presumed lung cancer), miliary pattern, cavitary disease"
    ],
    signs: {
      left: [
        "Mild cough with low-grade fever in endemic area",
        "Single small verrucous skin lesion on exposed area",
        "Self-limited pulmonary infection (50% of infections are asymptomatic or subclinical)",
        "Mild fatigue and myalgias resembling influenza",
        "Positive urine antigen with localized pulmonary disease"
      ],
      right: [
        "ARDS from overwhelming pulmonary blastomycosis (mortality 50 to 89% in ARDS)",
        "CNS blastomycosis with meningitis or brain abscess",
        "Disseminated disease in immunocompromised host (mortality 30 to 40%)",
        "Vertebral osteomyelitis with epidural abscess and cord compression",
        "Miliary pattern on chest imaging with multi-organ dissemination"
      ]
    },
    medications: [
      {
        name: "Itraconazole",
        type: "Triazole Antifungal (Ergosterol Synthesis Inhibitor)",
        action: "Inhibits lanosterol 14-alpha-demethylase (CYP51), a cytochrome P450 enzyme essential for converting lanosterol to ergosterol in the fungal cell membrane; ergosterol depletion increases membrane permeability and disrupts cell wall integrity, inhibiting fungal growth; fungistatic against Blastomyces at standard doses",
        sideEffects: "Nausea, diarrhea, abdominal pain, hepatotoxicity (monitor LFTs monthly), hypertension, peripheral edema (negative inotropic effect), hypokalemia, headache, rash, adrenal insufficiency (inhibits cortisol synthesis at high doses)",
        contra: "Congestive heart failure or ventricular dysfunction (negative inotropic effect), concurrent use with certain CYP3A4 substrates (simvastatin, lovastatin, ergot alkaloids, pimozide, quinidine, dofetilide - risk of fatal drug interactions), pregnancy (Category C - teratogenic in animals), severe hepatic impairment",
        pearl: "Itraconazole capsules require gastric acid for absorption - take with food and acidic beverage; PPIs and H2 blockers reduce absorption by 60 to 80%; the oral solution has better bioavailability and should be taken on an empty stomach; check trough levels at 2 weeks (goal 1 to 5 mcg/mL); loading dose is essential (200 mg TID for 3 days) to achieve therapeutic levels quickly; extensive CYP3A4 drug interactions require thorough medication reconciliation"
      },
      {
        name: "Amphotericin B Liposomal (AmBisome)",
        type: "Polyene Antifungal (Ergosterol Binding Agent)",
        action: "Binds directly to ergosterol in the fungal cell membrane, forming transmembrane pores that allow leakage of potassium, sodium, and other ions, leading to cell death; fungicidal activity; the liposomal formulation encapsulates amphotericin B in phospholipid liposomes, reducing binding to mammalian cholesterol and thereby reducing nephrotoxicity compared to conventional amphotericin B deoxycholate",
        sideEffects: "Infusion-related reactions (fever, rigors, chills, nausea, headache), nephrotoxicity (reduced with liposomal formulation but still present: rising creatinine, renal tubular acidosis, potassium and magnesium wasting), hypokalemia, hypomagnesemia, anemia (suppresses erythropoietin production), thrombophlebitis at IV site",
        contra: "Known hypersensitivity to amphotericin B or liposomal components; relative: renal impairment (use liposomal formulation preferentially, monitor closely); concurrent nephrotoxic drugs (aminoglycosides, vancomycin, contrast dye) increase nephrotoxicity risk",
        pearl: "For severe blastomycosis: dose 3 to 5 mg/kg/day IV; premedicate with acetaminophen, diphenhydramine, and meperidine (for rigors); infuse over 2 hours (rapid infusion causes cardiovascular toxicity); hydrate with NS 500 to 1000 mL before and after each dose to protect kidneys; check BUN, creatinine, potassium, and magnesium every other day; supplement potassium and magnesium aggressively; if creatinine doubles from baseline, hold dose and discuss with provider"
      },
      {
        name: "Voriconazole",
        type: "Second-Generation Triazole Antifungal",
        action: "Inhibits fungal lanosterol 14-alpha-demethylase (CYP51) with broader spectrum and greater potency than itraconazole; excellent CNS penetration (CSF-to-plasma ratio approximately 50%) making it preferred for CNS blastomycosis where itraconazole has poor penetration",
        sideEffects: "Visual disturbances (photopsia, enhanced brightness, blurred vision - occur in 30% of patients, usually transient), hepatotoxicity (monitor LFTs weekly for first month then monthly), photosensitivity with risk of squamous cell carcinoma with prolonged use (strict sun protection required), QTc prolongation, hallucinations, peripheral neuropathy, periostitis with chronic use, fluoride excess",
        contra: "Concurrent use with rifampin, carbamazepine, long-acting barbiturates (potent CYP inducers that reduce voriconazole to subtherapeutic levels), sirolimus, ergot alkaloids, pimozide; pregnancy (Category D - teratogenic); severe hepatic impairment; concurrent use with other QTc-prolonging drugs",
        pearl: "Preferred over itraconazole for CNS blastomycosis due to superior CSF penetration; dose 6 mg/kg IV every 12 hours for 2 doses (loading), then 4 mg/kg IV every 12 hours or 200 mg PO every 12 hours; monitor trough levels (goal 1 to 5.5 mcg/mL); visual disturbances are common and usually resolve - warn patients before starting; strict sun protection and annual dermatologic screening for skin cancer with prolonged use; extensive CYP450 interactions (both substrate and inhibitor)"
      }
    ],
    pearls: [
      "Broad-based budding is the pathognomonic microscopic finding of Blastomyces: the bud attachment to the parent yeast cell is as wide as the bud itself, unlike Cryptococcus (narrow-based budding) or Histoplasma (intracellular within macrophages); this single finding on KOH prep or histopathology establishes the diagnosis",
      "Blastomycosis is NOT contagious: person-to-person transmission does not occur because the yeast form in tissues cannot be transmitted; the infection is acquired only by inhaling conidia from the environmental mold form; patients do not require respiratory isolation",
      "Dogs serve as sentinel animals for blastomycosis: if a patient's dog has been diagnosed with blastomycosis, the patient has had the same environmental exposure and may be incubating or have subclinical infection; shared geographic exposure, not transmission from the dog",
      "ARDS from fulminant pulmonary blastomycosis carries a mortality rate of 50 to 89% despite appropriate antifungal therapy; early initiation of amphotericin B and ICU-level respiratory support are essential for survival",
      "Itraconazole absorption is dramatically reduced by proton pump inhibitors and H2 blockers (60 to 80% decrease); always review concurrent medications and ensure the patient takes itraconazole capsules with food and an acidic beverage; check trough levels at 2 weeks to confirm adequate absorption",
      "Blastomycosis mass lesions on chest CT are frequently biopsied as presumed lung cancer; the pathologist identifies granulomatous inflammation with broad-based budding yeast, redirecting management from oncology to infectious disease; always consider endemic mycosis in the differential of lung masses in endemic areas",
      "Treatment failure in blastomycosis is most commonly caused by subtherapeutic itraconazole levels (inadequate absorption, drug interactions, non-adherence) rather than true antifungal resistance; check trough levels before escalating therapy"
    ],
    quiz: [
      {
        question: "A nurse is reviewing a sputum microscopy report that describes large thick-walled yeast cells with broad-based budding. What organism does this finding indicate?",
        options: [
          "Cryptococcus neoformans",
          "Histoplasma capsulatum",
          "Blastomyces dermatitidis",
          "Candida albicans"
        ],
        correct: 2,
        rationale: "Large (8 to 15 micrometers) thick-walled yeast with broad-based budding is pathognomonic for Blastomyces dermatitidis. The broad base of the bud (as wide as the parent cell) distinguishes it from Cryptococcus (narrow-based budding with capsule), Histoplasma (small, intracellular within macrophages), and Candida (pseudohyphae with germ tubes). This single finding establishes the diagnosis."
      },
      {
        question: "A patient with pulmonary blastomycosis is prescribed itraconazole 200 mg twice daily. The nurse notes the patient also takes omeprazole 20 mg daily. What concern should the nurse raise with the provider?",
        options: [
          "Omeprazole increases the risk of itraconazole hepatotoxicity",
          "Omeprazole reduces gastric acid, decreasing itraconazole capsule absorption by 60 to 80%, potentially causing treatment failure",
          "Omeprazole and itraconazole together cause QTc prolongation",
          "There is no significant interaction between these medications"
        ],
        correct: 1,
        rationale: "Itraconazole capsules require gastric acid for dissolution and absorption. Proton pump inhibitors like omeprazole reduce gastric acid production, decreasing itraconazole absorption by 60 to 80%. This can result in subtherapeutic drug levels and treatment failure. The nurse should advocate for alternative acid suppression or switching to itraconazole oral solution (which does not require acid for absorption)."
      },
      {
        question: "During amphotericin B infusion, a patient develops rigors, fever of 39.5 C, and shaking chills. What should the nurse do?",
        options: [
          "Discontinue the infusion permanently and switch to a different antifungal class",
          "Slow the infusion rate, administer premedications (acetaminophen, diphenhydramine, meperidine for rigors), and notify the provider",
          "Increase the infusion rate to complete the dose faster",
          "Administer epinephrine for anaphylaxis"
        ],
        correct: 1,
        rationale: "Infusion-related reactions (fever, rigors, chills) occur in 50 to 90% of patients during initial amphotericin B infusions and are expected side effects, not allergic reactions. Management includes slowing the infusion rate and administering premedications: acetaminophen for fever, diphenhydramine for inflammation, and meperidine for rigors. The infusion can usually be completed at a slower rate. These reactions typically decrease with subsequent infusions. Permanent discontinuation is not needed unless the reaction is severe or anaphylactic."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone. Injected ${count}/${Object.keys(lessons).length} lessons.`);
