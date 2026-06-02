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
  "ain-rn": {
    title: "Acute Interstitial Nephritis (AIN) for Registered Nurses",
    cellular: {
      title: "Pathophysiology of Acute Interstitial Nephritis",
      content: "Acute interstitial nephritis (AIN) is an immune-mediated inflammatory condition affecting the renal interstitium and tubules, representing approximately 15-27% of all cases of acute kidney injury (AKI) requiring biopsy. The hallmark of AIN is inflammatory cell infiltration of the renal interstitium with tubular damage in the absence of primary glomerular or vascular pathology. The most common cause is drug hypersensitivity (accounting for 70-75% of cases), followed by autoimmune conditions (10-15%) and infections (5-10%). The registered nurse plays a critical role in identifying the offending agent, monitoring renal function trends, and managing the supportive care required during the recovery period.\n\nDrug-induced AIN is a type IV (delayed-type) hypersensitivity reaction mediated by T-lymphocytes rather than antibodies. When a drug or its metabolite acts as a hapten (a small molecule that alone cannot trigger an immune response), it binds to renal tubular proteins, forming a hapten-carrier complex that is processed and presented by antigen-presenting cells (dendritic cells, macrophages) to T-helper lymphocytes via MHC class II molecules. The activated T-cells release pro-inflammatory cytokines (interferon-gamma, interleukin-2, tumor necrosis factor-alpha) that recruit additional inflammatory cells -- cytotoxic T-lymphocytes, monocytes/macrophages, and eosinophils -- to the renal interstitium. These inflammatory cells directly damage tubular epithelial cells through cytotoxic mechanisms and further amplify the inflammatory response.\n\nThe interstitial inflammation causes edema of the renal parenchyma, which compresses the peritubular capillaries and reduces renal blood flow at the microvascular level. The damaged tubular cells lose their ability to concentrate urine (loss of medullary concentration gradient), reabsorb sodium (causing sodium wasting), secrete potassium and hydrogen ions (causing hyperkalemia and metabolic acidosis), and reabsorb low-molecular-weight proteins (causing tubular proteinuria). The combination of interstitial edema, peritubular capillary compression, and tubular dysfunction produces the clinical picture of AKI with rising serum creatinine and decreasing urine output.\n\nThe most commonly implicated drugs include antibiotics (penicillins, cephalosporins, sulfonamides, fluoroquinolones, rifampin), nonsteroidal anti-inflammatory drugs (NSAIDs), proton pump inhibitors (PPIs -- increasingly recognized as a major cause, responsible for up to 12% of drug-induced AIN cases), allopurinol, and immune checkpoint inhibitors (nivolumab, pembrolizumab, ipilimumab -- emerging as an important cause in oncology patients). The latency period between drug exposure and AIN onset is highly variable: as short as 3-5 days for drugs the patient has previously been exposed to (anamnestic response), 1-3 weeks for most antibiotics, and weeks to months for NSAIDs and PPIs. This variable latency often makes it difficult to identify the offending agent.\n\nThe classic clinical triad of fever, rash, and eosinophilia (the so-called drug hypersensitivity triad) is present in only 10-30% of cases, making clinical diagnosis unreliable. Urinalysis in AIN characteristically shows white blood cells (sterile pyuria), white blood cell casts, low-grade proteinuria (typically less than 1 g/day, tubular pattern), and eosinophiluria (urinary eosinophils, detected by Hansel stain rather than Wright stain). However, eosinophiluria has a sensitivity of only 40-60% and a positive predictive value of approximately 38%, so its absence does not exclude AIN, and its presence is not diagnostic.\n\nThe definitive diagnosis of AIN requires renal biopsy, which shows the characteristic findings of interstitial edema with inflammatory cell infiltrates (lymphocytes, monocytes, plasma cells, and eosinophils) between the renal tubules, with invasion of inflammatory cells into the tubular epithelium (tubulitis). Granulomatous interstitial nephritis (granulomas within the interstitium) is associated with specific causes including sarcoidosis, tuberculosis, and certain drugs (especially sulfonamides). The degree of interstitial fibrosis on biopsy is the strongest predictor of renal recovery -- patients with minimal fibrosis have excellent recovery prospects, while extensive fibrosis indicates chronic damage with poor recovery potential.\n\nThe primary treatment is identification and removal of the offending agent. In many cases, renal function improves spontaneously within weeks of discontinuing the causative drug. Corticosteroid therapy (prednisone 1 mg/kg/day for 4-6 weeks with gradual taper) is controversial but is generally recommended for patients who do not show improvement within 3-7 days of drug discontinuation, or when AIN is severe enough to require dialysis. Several observational studies suggest that early corticosteroid treatment (within 2 weeks of diagnosis) is associated with better renal recovery than delayed treatment, although randomized controlled trial evidence is limited. Supportive care includes management of fluid and electrolyte imbalances, avoidance of nephrotoxic agents, and temporary renal replacement therapy if indicated."
    },
    riskFactors: [
      "Recent initiation of a known culprit medication: antibiotics (penicillins, cephalosporins, sulfonamides, fluoroquinolones, rifampin), NSAIDs, proton pump inhibitors (omeprazole, pantoprazole, lansoprazole), allopurinol",
      "Immune checkpoint inhibitor therapy for malignancy (nivolumab, pembrolizumab, ipilimumab) -- AIN occurs in 2-5% of patients and is becoming increasingly common",
      "Polypharmacy in elderly patients (increased exposure to potential culprit drugs and reduced renal reserve)",
      "Previous episode of drug-induced AIN (sensitization results in rapid onset with re-exposure to the same or cross-reacting drug)",
      "Autoimmune conditions: systemic lupus erythematosus, Sjogren syndrome, sarcoidosis, IgG4-related disease (autoimmune AIN)",
      "Concurrent infections: Legionella, leptospirosis, Epstein-Barr virus, cytomegalovirus, streptococcal infection (infection-associated AIN)",
      "Pre-existing chronic kidney disease (reduced functional nephron reserve makes the remaining kidney tissue more vulnerable to inflammatory damage)"
    ],
    diagnostics: [
      "Serum creatinine trending: rising creatinine (typically non-oliguric AKI) developing days to weeks after initiation of a culprit drug; rate of rise and peak creatinine help guide management intensity",
      "Urinalysis with microscopy: sterile pyuria (WBCs without bacteria), white blood cell casts (indicate renal origin of inflammation), low-grade proteinuria (less than 1 g/day, tubular pattern), microscopic hematuria",
      "Urine eosinophils (Hansel stain): eosinophiluria supports AIN diagnosis but sensitivity is only 40-60%; order specifically as Hansel stain (Wright stain is less sensitive for urinary eosinophils)",
      "Complete blood count: peripheral eosinophilia (present in 35% of drug-induced AIN); helps support diagnosis when present but absence does not exclude AIN",
      "Fractional excretion of sodium (FENa): typically above 1% (indicating tubular damage and inability to reabsorb sodium), helping differentiate from prerenal AKI (FENa below 1%); however, NSAIDs may cause low FENa even in AIN",
      "Renal biopsy (definitive diagnosis): interstitial edema with lymphocytic/eosinophilic infiltrates, tubulitis, variable granulomas; degree of interstitial fibrosis predicts recovery potential; indicated when diagnosis is uncertain or renal function fails to improve after drug withdrawal"
    ],
    management: [
      "IMMEDIATELY discontinue the suspected offending agent; this is the single most important intervention and alone is sufficient for recovery in many cases; review the complete medication list and consider ALL potentially nephrotoxic drugs",
      "If renal function does not improve within 3-7 days of drug discontinuation, initiate corticosteroid therapy: prednisone 1 mg/kg/day (maximum 60 mg/day) for 2-4 weeks, then taper over 4-8 weeks; early steroid treatment (within 2 weeks of diagnosis) is associated with better outcomes",
      "Provide supportive management of AKI: strict fluid balance monitoring, electrolyte correction (hyperkalemia management, metabolic acidosis treatment with oral bicarbonate), avoidance of additional nephrotoxic agents (contrast dye, aminoglycosides, NSAIDs)",
      "Initiate temporary renal replacement therapy (hemodialysis or CRRT) if indicated by standard AKI criteria: refractory hyperkalemia, severe metabolic acidosis, fluid overload unresponsive to diuretics, or uremic symptoms (encephalopathy, pericarditis, bleeding)",
      "Adjust doses of all renally excreted medications based on current GFR estimation; consult pharmacy for dose modifications",
      "For PPI-induced AIN: discontinue the PPI permanently and consider alternative acid suppression (H2 blockers such as famotidine are generally safe alternatives); PPIs as a class should be avoided in the future as cross-reactivity between different PPIs occurs in up to 50% of cases",
      "Long-term follow-up: monitor serum creatinine monthly for 3-6 months after recovery; some patients develop chronic kidney disease despite treatment; document the causative drug in the allergy/adverse reaction list to prevent re-exposure"
    ],
    nursingActions: [
      "Review the complete medication list systematically to identify potential culprit drugs; cross-reference timing of medication initiation with onset of AKI; flag any drug started within the preceding 1-4 weeks as potentially causative",
      "Monitor serum creatinine, BUN, and electrolytes at least daily during acute phase; trend values and calculate rate of creatinine rise; report rising creatinine despite drug discontinuation (may indicate need for steroids or biopsy)",
      "Maintain strict intake and output monitoring; many AIN patients are NON-OLIGURIC (maintaining adequate urine output despite rising creatinine), which can create false reassurance; rising creatinine with normal urine output still indicates significant renal injury",
      "Assess for the classic triad of drug hypersensitivity (fever, maculopapular rash, peripheral eosinophilia) but do NOT rely on its presence to suspect AIN -- this triad is present in only 10-30% of cases",
      "Monitor for hyperkalemia: check serum potassium every 6-12 hours in acute phase; assess ECG for hyperkalemic changes (peaked T waves, widened QRS); restrict dietary potassium intake; have calcium gluconate and insulin/dextrose available",
      "When corticosteroids are initiated, monitor for steroid adverse effects: blood glucose every 6 hours (steroid-induced hyperglycemia), blood pressure, mood and sleep changes, GI symptoms (administer with PPI for GI prophylaxis); educate about the importance of completing the full taper",
      "Educate patient about the permanently flagged medication: add the offending drug to the allergy/adverse reaction list with specific notation of AIN; educate patient to report this drug allergy to all future healthcare providers; provide written documentation"
    ],
    assessmentFindings: [
      "Rising serum creatinine developing 1-3 weeks after starting a new medication (variable latency: 3-5 days for previously sensitized patients, weeks to months for NSAIDs and PPIs)",
      "Low-grade fever (not always present; more common with antibiotic-induced AIN than NSAID or PPI-induced AIN)",
      "Maculopapular rash on trunk and extremities (drug hypersensitivity manifestation; present in only 15-20% of cases)",
      "Non-oliguric AKI: urine output may be maintained or only mildly reduced despite significant creatinine elevation; this is because tubular damage impairs concentrating ability, producing dilute urine",
      "Flank pain or costovertebral angle tenderness from renal capsule distension due to interstitial edema (present in some cases)",
      "Arthralgias and myalgias as part of a systemic drug hypersensitivity reaction (less common but may accompany the classic triad)",
      "Urinalysis showing sterile pyuria, white blood cell casts, mild proteinuria, and possibly eosinophiluria (Hansel stain positive)"
    ],
    signs: {
      left: [
        "Mild creatinine elevation (1.5-2 times baseline) with stable trend",
        "Normal urine output with mild urinalysis abnormalities",
        "No systemic symptoms (no fever, rash, or eosinophilia)",
        "Normal potassium and acid-base status",
        "Improving creatinine after drug discontinuation",
        "No indications for dialysis"
      ],
      right: [
        "Rapidly rising creatinine (more than 3 times baseline or above 4 mg/dL)",
        "Oliguria (urine output below 400 mL/day) or anuria",
        "Hyperkalemia above 6.0 mEq/L with ECG changes",
        "Severe metabolic acidosis (pH below 7.2) refractory to bicarbonate therapy",
        "Failure to improve after 7 days of drug discontinuation (may need biopsy and steroids)",
        "Uremic symptoms: encephalopathy, pericardial friction rub, platelet dysfunction with bleeding"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Suppresses the T-cell-mediated immune response driving interstitial inflammation by inhibiting T-lymphocyte proliferation and cytokine production (IL-2, IFN-gamma, TNF-alpha), reducing inflammatory cell recruitment to the renal interstitium, promoting apoptosis of activated T-cells, and reducing interstitial edema; used when AIN does not improve after culprit drug withdrawal to prevent progression to chronic interstitial fibrosis",
        sideEffects: "Hyperglycemia (monitor blood glucose every 6 hours), fluid retention and hypertension, GI irritation and peptic ulceration (co-administer PPI), mood changes and insomnia, increased infection risk, adrenal suppression with prolonged use (never stop abruptly -- taper required), osteoporosis with chronic use",
        contra: "Active untreated systemic infection (steroids impair immune response); uncontrolled diabetes (relative -- monitor closely); active peptic ulcer disease; psychosis from prior steroid use",
        pearl: "Start 1 mg/kg/day (maximum 60 mg) for 2-4 weeks, then taper over 4-8 weeks; early initiation (within 2 weeks of AIN onset) is associated with better renal recovery than delayed treatment; monitor blood glucose closely as steroid-induced hyperglycemia is common; do NOT stop abruptly -- adrenal suppression requires gradual tapering"
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic",
        action: "Blocks the sodium-potassium-2 chloride (NKCC2) cotransporter in the thick ascending limb of the loop of Henle, inhibiting sodium, potassium, and chloride reabsorption; produces potent diuresis to manage fluid overload in AIN-related AKI; also promotes potassium excretion which may help manage hyperkalemia as an adjunctive therapy",
        sideEffects: "Hypovolemia and dehydration (can worsen renal injury), hypokalemia (may be beneficial in hyperkalemic AIN patients), hyponatremia, hypocalcemia, hypomagnesemia, ototoxicity (especially with rapid IV push or high doses), metabolic alkalosis",
        contra: "Anuria unresponsive to a test dose (indicates complete renal shutdown); severe hypovolemia; hepatic encephalopathy with electrolyte derangement; sulfonamide allergy (cross-sensitivity possible)",
        pearl: "Used for fluid management in AIN, NOT to treat the underlying disease; high doses may be needed in AKI (80-200 mg IV) as damaged tubules are less responsive to diuretics; if no response to IV bolus, consider continuous infusion (10-40 mg/hour); always ensure adequate intravascular volume before administering; monitor electrolytes closely"
      },
      {
        name: "Sodium Polystyrene Sulfonate (Kayexalate) or Patiromer (Veltassa)",
        type: "Potassium-binding resin / cation exchange agent",
        action: "Sodium polystyrene sulfonate exchanges sodium ions for potassium ions in the gastrointestinal tract (primarily in the colon), increasing fecal potassium excretion; patiromer is a newer non-absorbed polymer that binds potassium in the GI tract with greater selectivity and fewer GI side effects; both are used to manage hyperkalemia in AIN when renal potassium excretion is impaired",
        sideEffects: "Sodium polystyrene sulfonate: constipation, nausea, hypokalemia with overuse, hypernatremia (sodium loading), intestinal necrosis (rare but serious -- avoid in patients with bowel ischemia or obstruction); Patiromer: constipation, hypomagnesemia, diarrhea, abdominal discomfort",
        contra: "Sodium polystyrene sulfonate: bowel obstruction, ileus, or reduced gut motility (risk of intestinal necrosis); neonates; hypernatremia; Patiromer: administer separately from other oral medications (wait 3 hours) due to drug binding in the GI tract",
        pearl: "These are temporizing measures for hyperkalemia in AIN while the underlying renal injury resolves; onset of action is 2-6 hours for SPS and 4-7 hours for patiromer -- neither provides emergent potassium lowering; for potassium above 6.5 mEq/L with ECG changes, use IV calcium gluconate (immediate cardiac protection) plus insulin/dextrose (rapid intracellular shift) first"
      }
    ],
    pearls: [
      "The classic triad of fever, rash, and eosinophilia is present in only 10-30% of drug-induced AIN cases -- do NOT rely on its presence to suspect the diagnosis; AIN should be considered whenever AKI develops within days to weeks of starting a new medication",
      "Proton pump inhibitors (PPIs) are an increasingly recognized cause of AIN that is frequently missed because PPIs are often started months before AIN develops (unlike antibiotics which cause AIN within 1-3 weeks); always include PPIs in the differential for unexplained AKI",
      "Non-oliguric AKI is common in AIN: the patient may have normal or near-normal urine output despite significant creatinine elevation; do not be falsely reassured by adequate urine volume -- creatinine trend is the key monitoring parameter",
      "The offending drug must be permanently added to the patient's allergy/adverse reaction list with specific documentation of AIN; re-exposure to the same drug (or cross-reacting drugs in the same class) will cause rapid recurrence with potentially worse outcomes",
      "Early corticosteroid treatment (within 2 weeks of AIN onset) is associated with better renal recovery; delayed treatment allows progression to interstitial fibrosis which is irreversible and leads to chronic kidney disease",
      "Eosinophiluria (detected by HANSEL stain, not Wright stain) has only 40-60% sensitivity for AIN; its absence does NOT exclude the diagnosis; when clinical suspicion is high, proceed with renal biopsy for definitive diagnosis",
      "Delegate I&O recording and vital sign monitoring to UAP; retain medication review and identification of culprit drugs, creatinine trend interpretation, potassium monitoring with ECG correlation, steroid therapy management, and patient education about drug avoidance"
    ],
    quiz: [
      {
        question: "A patient develops acute kidney injury 10 days after starting amoxicillin for sinusitis. Urinalysis shows sterile pyuria and white blood cell casts. The patient has no fever, rash, or peripheral eosinophilia. Which action should the nurse take?",
        options: [
          "Reassure the patient that the absence of fever and rash rules out drug-related kidney injury",
          "Suspect acute interstitial nephritis and notify the physician to consider discontinuing amoxicillin",
          "Increase IV fluid rate to flush the kidneys and continue the antibiotic",
          "Administer furosemide to increase urine output and clear the white blood cells"
        ],
        correct: 1,
        rationale: "The classic triad of fever, rash, and eosinophilia is present in only 10-30% of AIN cases. AKI developing within 10 days of antibiotic initiation with sterile pyuria and WBC casts is highly suspicious for AIN regardless of the absence of systemic hypersensitivity signs. The nurse should suspect AIN and communicate findings to the physician for drug discontinuation."
      },
      {
        question: "A patient with drug-induced AIN has been off the offending medication for 5 days but creatinine continues to rise. What is the MOST appropriate next step?",
        options: [
          "Continue to monitor as AIN always resolves spontaneously after drug discontinuation",
          "Initiate corticosteroid therapy (prednisone 1 mg/kg/day) to suppress the ongoing immune-mediated inflammation",
          "Restart the offending drug at a lower dose to induce tolerance",
          "Begin empiric antibiotics for possible urinary tract infection"
        ],
        correct: 1,
        rationale: "When AIN does not improve within 3-7 days of drug discontinuation, corticosteroids should be considered to suppress the ongoing T-cell-mediated immune response and prevent progression to irreversible interstitial fibrosis. Early steroid treatment is associated with better renal recovery. Never re-expose to the offending drug."
      },
      {
        question: "Which class of medications has the nurse should be most vigilant about as an increasingly recognized cause of AIN that is frequently missed due to its long latency period?",
        options: [
          "Beta-blockers",
          "ACE inhibitors",
          "Proton pump inhibitors (PPIs)",
          "Statins"
        ],
        correct: 2,
        rationale: "PPIs are increasingly recognized as a major cause of AIN, responsible for up to 12% of drug-induced AIN cases. PPI-induced AIN is frequently missed because the latency between drug initiation and AIN onset can be weeks to months, unlike antibiotics which typically cause AIN within 1-3 weeks. Cross-reactivity between different PPIs occurs in up to 50% of cases."
      }
    ]
  },

  "alpha1-antitrypsin-deficiency-rn": {
    title: "Alpha-1 Antitrypsin Deficiency for Registered Nurses",
    cellular: {
      title: "Molecular Pathophysiology of Alpha-1 Antitrypsin Deficiency",
      content: "Alpha-1 antitrypsin (AAT) deficiency is one of the most common hereditary conditions affecting the lungs and liver, with an estimated prevalence of 1 in 2,000-5,000 individuals of European descent. It is an autosomal codominant disorder caused by mutations in the SERPINA1 gene on chromosome 14, which encodes alpha-1 antitrypsin, a serine protease inhibitor (serpin) primarily produced by hepatocytes. AAT deficiency leads to two distinct organ pathologies through two different mechanisms: destructive lung disease from unopposed protease activity and liver disease from toxic accumulation of misfolded AAT protein within hepatocytes.\n\nAlpha-1 antitrypsin is the most abundant circulating serine protease inhibitor in human plasma, with normal serum levels of 100-220 mg/dL. Its primary physiological function is to protect the lower respiratory tract from destruction by neutrophil elastase, a powerful serine protease released by activated neutrophils during their normal antimicrobial function. Neutrophil elastase is capable of degrading virtually all components of the extracellular matrix, including elastin (the structural protein that gives the lung its elastic recoil), collagen, and proteoglycans. Under normal circumstances, AAT rapidly binds to and inactivates neutrophil elastase through a suicide-substrate mechanism: AAT's reactive center loop mimics the natural substrate of neutrophil elastase, but when the protease cleaves the reactive loop, AAT undergoes a dramatic conformational change that traps the enzyme in an irreversible complex, permanently inactivating it.\n\nThe SERPINA1 gene has over 120 identified variants, designated by letters based on their isoelectric focusing migration pattern. The normal allele is designated Pi*M (protease inhibitor, medium migration), and the normal genotype is Pi*MM. The two most clinically significant deficiency alleles are Pi*Z (the most common severe deficiency allele, found in 1-3% of Northern Europeans) and Pi*S (a milder deficiency allele). The Pi*Z mutation (Glu342Lys) causes the AAT protein to misfold in the endoplasmic reticulum of hepatocytes. Approximately 85% of the Z-variant AAT polymerizes within the hepatocyte ER, forming insoluble aggregates that are retained in the liver rather than being secreted into the circulation. This has two consequences: first, the serum AAT level drops to only 10-15% of normal (typically 20-50 mg/dL), leaving the lungs unprotected from neutrophil elastase; second, the accumulated polymer aggregates in hepatocytes cause a toxic gain-of-function liver injury through ER stress, autophagy activation, and eventually hepatocyte death.\n\nThe pulmonary disease in AAT deficiency is panacinar (panlobular) emphysema, which characteristically affects the lung bases (in contrast to smoking-related centrilobular emphysema which predominantly affects the upper lobes). The pathogenesis follows the protease-antiprotease imbalance theory: with insufficient AAT to neutralize neutrophil elastase, the enzyme degrades alveolar wall elastin unchecked. The loss of elastin destroys the alveolar septa, creating enlarged airspaces with reduced surface area for gas exchange (emphysema). The loss of elastic recoil causes small airway collapse during expiration (air trapping), producing the obstructive physiology seen on pulmonary function testing. Cigarette smoking dramatically accelerates lung destruction in AAT deficiency through two synergistic mechanisms: smoking recruits and activates additional neutrophils to the lungs (increasing the elastase burden), and oxidants in cigarette smoke directly inactivate the small amount of AAT that does reach the lungs (further reducing the antiprotease shield). AAT-deficient smokers develop clinically significant emphysema by age 35-40, while non-smokers may not develop symptoms until age 50-60.\n\nThe liver disease in AAT deficiency (specifically the Pi*ZZ genotype) results from the toxic accumulation of polymerized Z-variant AAT within the hepatocyte endoplasmic reticulum. These polymer inclusions are visible on liver biopsy as periodic acid-Schiff (PAS)-positive, diastase-resistant globules within hepatocytes. The retained polymers activate the unfolded protein response (UPR), a cellular stress pathway that attempts to restore ER homeostasis by reducing protein synthesis, increasing chaperone production, and activating ER-associated degradation (ERAD). When these compensatory mechanisms are overwhelmed, the hepatocyte activates autophagy (self-digestion of the polymer aggregates) and eventually apoptosis. This chronic hepatocyte injury produces a spectrum of liver disease: neonatal cholestasis (presenting as conjugated hyperbilirubinemia in infancy), chronic hepatitis, cirrhosis (developing in 10-15% of Pi*ZZ adults), and hepatocellular carcinoma.\n\nAugmentation therapy with IV purified human AAT (Prolastin-C, Aralast, Zemaira) is the specific treatment for AAT deficiency-associated lung disease. Weekly IV infusion of 60 mg/kg raises serum AAT levels above the protective threshold of 57 mg/dL (11 micromol/L), restoring the antiprotease shield in the lungs. While augmentation therapy has been shown to slow the rate of lung density loss on CT scan and may slow FEV1 decline, it does not reverse existing emphysema and has no effect on the liver disease (the liver pathology is caused by the retained mutant protein, not by the absence of circulating AAT)."
    },
    riskFactors: [
      "Pi*ZZ genotype (homozygous for the Z allele) -- the most severe genotype with serum AAT levels of 10-15% of normal; highest risk for both lung and liver disease",
      "Cigarette smoking (the single most important modifiable risk factor) -- dramatically accelerates emphysema onset by increasing neutrophil recruitment and oxidatively inactivating remaining AAT; smokers develop symptoms by age 35-40 versus 50-60 for non-smokers",
      "Occupational or environmental exposure to inhaled pollutants, dust, fumes, or chemicals that recruit neutrophils to the lungs and increase the protease burden",
      "Northern European descent (highest carrier frequency for Pi*Z allele, approximately 1 in 25-30 individuals carry one Z allele)",
      "Family history of early-onset emphysema (before age 45) or unexplained liver disease across generations (autosomal codominant inheritance)",
      "Pi*SZ compound heterozygotes (serum AAT approximately 35-40% of normal) have intermediate risk, especially if they smoke",
      "Recurrent respiratory infections increasing neutrophil influx and protease burden in the lungs"
    ],
    diagnostics: [
      "Serum alpha-1 antitrypsin level: initial screening test; levels below 57 mg/dL (11 micromol/L -- the protective threshold) indicate clinically significant deficiency; Pi*ZZ individuals typically have levels of 20-50 mg/dL",
      "AAT phenotyping (isoelectric focusing) or genotyping (SERPINA1 gene analysis): identifies the specific allele variant (Pi*MM, Pi*MZ, Pi*SZ, Pi*ZZ, etc.); essential for confirming the diagnosis and determining the specific deficiency type",
      "Pulmonary function tests (spirometry): reveals obstructive pattern with reduced FEV1/FVC ratio; reduced FEV1 correlates with disease severity; reversibility testing with bronchodilator may show partial response",
      "High-resolution CT chest: shows panacinar (panlobular) emphysema predominantly in the lung bases (basal-predominant emphysema in a young patient is virtually pathognomonic for AAT deficiency); also identifies bronchiectasis which coexists in up to 40% of patients",
      "Liver function tests and hepatic imaging: AST/ALT may be mildly elevated; liver biopsy shows PAS-positive, diastase-resistant globules in hepatocytes (accumulated AAT polymers); liver elastography (FibroScan) screens for fibrosis non-invasively",
      "Arterial blood gas: may show hypoxemia and hypercapnia in advanced disease; guides oxygen therapy decisions"
    ],
    management: [
      "Augmentation therapy with weekly IV infusion of purified human AAT (Prolastin-C, Aralast NP, Zemaira, Glassia) at 60 mg/kg: the specific treatment for AAT deficiency-associated lung disease; raises serum AAT above the protective threshold of 57 mg/dL; slows emphysema progression but does not reverse existing damage",
      "Absolute smoking cessation is the single most important intervention: smoking accelerates FEV1 decline by 2-3 times compared to non-smoking AAT-deficient individuals; provide comprehensive cessation support including pharmacotherapy (varenicline, bupropion, NRT) and behavioral counseling",
      "Standard COPD management per GOLD guidelines: inhaled bronchodilators (LABA + LAMA combination), inhaled corticosteroids for patients with frequent exacerbations and eosinophilic phenotype, pulmonary rehabilitation, influenza and pneumococcal vaccination",
      "Supplemental oxygen therapy for patients with resting PaO2 below 55 mmHg or SpO2 below 88% (LTOT criteria); titrate to maintain SpO2 92-95%",
      "Lung transplantation evaluation for patients with advanced disease (FEV1 below 25% predicted) refractory to medical therapy; AAT deficiency is one of the most common indications for lung transplantation",
      "Liver disease management: regular hepatic surveillance (LFTs every 6-12 months, liver ultrasound, elastography); avoid alcohol; hepatology referral for patients with evidence of fibrosis or cirrhosis; liver transplantation for end-stage liver disease (curative -- donor liver produces normal AAT)",
      "Family screening: offer AAT level testing and genotyping to all first-degree relatives of diagnosed individuals; genetic counseling for family planning"
    ],
    nursingActions: [
      "Administer weekly IV AAT augmentation infusion per protocol: verify product identity, reconstitute according to manufacturer instructions, infuse at prescribed rate (typically over 15-30 minutes for most products), monitor for infusion reactions (fever, chills, urticaria, dyspnea) especially during the first several infusions",
      "Assess respiratory status comprehensively at each visit: auscultate breath sounds (diminished in emphysematous areas, wheezes if bronchospastic), monitor SpO2, assess dyspnea using validated scale (Modified Medical Research Council [mMRC] dyspnea scale), document exercise tolerance and ADL performance",
      "Provide smoking cessation education and support at every encounter: assess readiness to quit using the 5 As framework (Ask, Advise, Assess, Assist, Arrange follow-up); reinforce that smoking cessation is the single most impactful intervention to slow disease progression",
      "Teach proper inhaler technique and verify at every visit: incorrect inhaler use is the most common cause of suboptimal bronchodilator response; demonstrate technique, observe return demonstration, and correct errors; ensure patient can operate their specific device",
      "Monitor for signs of hepatic involvement: assess for jaundice, hepatomegaly (palpate liver edge), ascites, spider angiomata, palmar erythema; review liver function tests; report any abnormalities to the physician for hepatology referral",
      "Coordinate care across multiple disciplines: pulmonology for lung management, hepatology for liver surveillance, genetic counseling for family planning, social work for insurance navigation (augmentation therapy is expensive, approximately $100,000/year), pulmonary rehabilitation for functional optimization",
      "Educate about infection prevention: annual influenza vaccination, pneumococcal vaccination (PCV20 or PCV15 + PPSV23), COVID-19 vaccination; teach hand hygiene and avoidance of crowded indoor spaces during respiratory virus season; early treatment of respiratory infections to minimize exacerbations"
    ],
    assessmentFindings: [
      "Progressive exertional dyspnea beginning at a younger age than typical COPD (before age 45 in smokers, before age 60 in non-smokers) -- the hallmark presenting symptom",
      "Diminished breath sounds bilaterally, particularly at the lung bases (basal-predominant emphysema), with prolonged expiratory phase and barrel chest deformity in advanced disease",
      "Chronic productive cough in some patients due to coexisting bronchiectasis (present in up to 40% of AAT-deficient individuals with lung disease)",
      "Wheezing responsive to bronchodilators (many patients are initially misdiagnosed with asthma before the correct diagnosis is established, particularly in non-smokers)",
      "Hepatomegaly, jaundice, or signs of portal hypertension (ascites, splenomegaly, caput medusae) in patients with advanced liver involvement",
      "Panniculitis (necrotizing inflammation of subcutaneous fat) -- a rare but specific dermatological manifestation of AAT deficiency presenting as painful, red, indurated nodules that may drain oily fluid",
      "Family history pattern: early-onset emphysema in multiple family members across generations, or unexplained neonatal/childhood liver disease in siblings"
    ],
    signs: {
      left: [
        "Mild exertional dyspnea with preserved ADL function",
        "FEV1 above 65% predicted with stable trend",
        "Normal liver function tests and no hepatomegaly",
        "SpO2 above 92% on room air at rest and with exertion",
        "Serum AAT level maintained above 57 mg/dL with augmentation therapy",
        "No recent exacerbations (stable disease)"
      ],
      right: [
        "Severe resting dyspnea with oxygen dependence (SpO2 below 88% on room air)",
        "FEV1 below 30% predicted with accelerating decline despite therapy",
        "Frequent COPD exacerbations (2 or more per year requiring hospitalization)",
        "Evidence of cirrhosis: jaundice, ascites, coagulopathy, portal hypertension",
        "Hypercapnic respiratory failure (PaCO2 above 50 mmHg) requiring non-invasive ventilation",
        "Progressive weight loss and muscle wasting (pulmonary cachexia indicating advanced disease)"
      ]
    },
    medications: [
      {
        name: "Alpha-1 Proteinase Inhibitor, Human (Prolastin-C/Aralast NP/Zemaira)",
        type: "Augmentation therapy / serine protease inhibitor replacement",
        action: "Purified human AAT protein derived from pooled donor plasma; when infused intravenously at 60 mg/kg weekly, it raises serum AAT levels above the protective threshold of 57 mg/dL (11 micromol/L), restoring the antiprotease shield in the lower respiratory tract; the infused AAT diffuses from the bloodstream into the pulmonary interstitium and alveolar lining fluid where it neutralizes neutrophil elastase and prevents further elastin degradation",
        sideEffects: "Infusion-related reactions (headache, dizziness, nausea, fever, chills -- typically mild and more common with initial infusions), urticaria, hypotension (rare), delayed hypersensitivity reactions, theoretical risk of blood-borne pathogen transmission (products are virally inactivated)",
        contra: "Known hypersensitivity to the product or its components; IgA deficiency with anti-IgA antibodies (some products contain trace IgA -- anaphylaxis risk); acute exacerbation of lung disease (not a treatment for acute episodes)",
        pearl: "Weekly infusion for life; takes 4-6 weeks to reach steady-state trough levels above the protective threshold; monitor trough AAT levels periodically to ensure adequacy; does NOT reverse existing emphysema or treat liver disease; most patients can be trained for self-infusion at home; some products now available as subcutaneous formulations; annual cost approximately $100,000 -- insurance prior authorization and specialty pharmacy coordination essential"
      },
      {
        name: "Ipratropium Bromide (Atrovent) / Tiotropium (Spiriva)",
        type: "Anticholinergic bronchodilator (muscarinic receptor antagonist)",
        action: "Blocks muscarinic (M3) acetylcholine receptors on bronchial smooth muscle, preventing acetylcholine-mediated bronchoconstriction; reduces airway smooth muscle tone, decreases mucus hypersecretion, and improves airflow in obstructive lung disease; tiotropium (LAMA) provides 24-hour bronchodilation with once-daily dosing versus ipratropium (SAMA) which requires dosing every 6-8 hours",
        sideEffects: "Dry mouth (most common), urinary retention (especially in males with prostatic hypertrophy), constipation, blurred vision (if powder contacts eyes), paradoxical bronchospasm (rare), tachycardia",
        contra: "Known hypersensitivity to atropine or its derivatives; severe milk protein allergy (tiotropium HandiHaler capsules contain milk protein); narrow-angle glaucoma (relative -- monitor if used); significant bladder outlet obstruction",
        pearl: "Tiotropium (LAMA) is preferred over ipratropium for maintenance therapy in AAT deficiency-associated COPD due to once-daily dosing and superior bronchodilation; the HandiHaler requires adequate inspiratory flow to disperse the powder -- verify technique; do NOT use soft mist inhaler (Respimat) and HandiHaler simultaneously (both contain tiotropium); rinse mouth after use to reduce dry mouth"
      },
      {
        name: "N-Acetylcysteine (NAC/Mucomyst)",
        type: "Mucolytic agent / antioxidant",
        action: "Breaks disulfide bonds in mucus glycoproteins, reducing mucus viscosity and facilitating clearance from the airways; also serves as a precursor to glutathione (the body's primary intracellular antioxidant), potentially reducing oxidative stress in the lungs of AAT-deficient patients; may reduce COPD exacerbation frequency in some patients through its anti-inflammatory and antioxidant properties",
        sideEffects: "Nausea, vomiting, stomatitis (oral route); bronchospasm when nebulized (pre-treat with bronchodilator), unpleasant sulfur odor and taste, rhinorrhea; IV use: anaphylactoid reactions (dose-related, usually with loading dose)",
        contra: "Active peptic ulcer disease (oral route); severe asthma without bronchodilator pretreatment (nebulized route may trigger bronchospasm); known hypersensitivity",
        pearl: "When nebulized, ALWAYS pre-treat with an inhaled bronchodilator (albuterol) 15 minutes before NAC to prevent bronchospasm; oral NAC (600-1200 mg daily) may reduce COPD exacerbation frequency as an adjunctive therapy; the sulfur smell is strong -- warn patients; store opened vials in refrigerator and use within 96 hours"
      }
    ],
    pearls: [
      "Think AAT deficiency when you see emphysema in a patient under 45, emphysema in a non-smoker, basal-predominant emphysema on CT (typical COPD is upper-lobe predominant), unexplained liver disease, or family history of early-onset emphysema or liver disease across generations",
      "Smoking cessation is the single most important intervention in AAT deficiency -- it is more impactful than augmentation therapy; AAT-deficient smokers lose FEV1 at approximately 100-130 mL/year versus 40-60 mL/year in non-smokers; counsel at every encounter",
      "Augmentation therapy costs approximately $100,000/year and requires weekly IV infusions for life; the RN plays a critical role in infusion administration, adverse reaction monitoring, self-infusion training, and insurance/specialty pharmacy coordination",
      "AAT deficiency-associated liver disease is caused by ACCUMULATION of misfolded Z-protein in hepatocytes (toxic gain-of-function), NOT by the absence of circulating AAT; augmentation therapy treats lung disease only and has no effect on liver disease",
      "Liver transplantation for AAT-related cirrhosis is CURATIVE because the donor liver produces normal (Pi*M) AAT, eliminating both liver disease (no more polymer accumulation) and lung disease progression (normal AAT levels)",
      "All first-degree relatives of a diagnosed patient should be offered screening (serum AAT level and genotyping); early identification allows smoking prevention counseling and early augmentation therapy initiation before significant lung damage occurs",
      "Delegate vital sign monitoring and SpO2 measurement to UAP; retain respiratory assessment, auscultation interpretation, augmentation infusion administration and monitoring, inhaler technique education, smoking cessation counseling, and care coordination"
    ],
    quiz: [
      {
        question: "A 38-year-old non-smoking male presents with progressive dyspnea. High-resolution CT chest shows panacinar emphysema predominantly affecting the lung bases. Which diagnostic test should the nurse anticipate?",
        options: [
          "Sputum culture and sensitivity",
          "Serum alpha-1 antitrypsin level",
          "Tuberculin skin test (PPD)",
          "Bronchoscopy with biopsy"
        ],
        correct: 1,
        rationale: "Early-onset emphysema (under 45), non-smoker status, and basal-predominant panacinar emphysema are virtually pathognomonic for alpha-1 antitrypsin deficiency. The initial screening test is a serum AAT level. If low, genotyping confirms the specific variant."
      },
      {
        question: "During weekly augmentation therapy infusion with Prolastin-C, a patient reports headache, mild chills, and nausea. What is the nurse's BEST response?",
        options: [
          "Stop the infusion permanently and notify the physician of anaphylaxis",
          "Slow the infusion rate, administer antipyretics as prescribed, and monitor closely",
          "Increase the infusion rate to complete the dose more quickly",
          "Switch the route to intramuscular injection"
        ],
        correct: 1,
        rationale: "Mild infusion-related reactions (headache, chills, nausea) are common, especially with initial infusions, and are typically managed by slowing the infusion rate and administering antipyretics. These are NOT anaphylaxis. True anaphylaxis (hypotension, bronchospasm, angioedema) requires stopping the infusion and treating with epinephrine."
      },
      {
        question: "Which statement by a patient with alpha-1 antitrypsin deficiency indicates the nurse's teaching has been effective?",
        options: [
          "My weekly infusion will reverse the damage already done to my lungs",
          "Since I never smoked, I don't need to worry about my lung function declining",
          "I should have my children tested for this condition since it runs in families",
          "The infusion will also treat my liver disease from this condition"
        ],
        correct: 2,
        rationale: "AAT deficiency is autosomal codominant, meaning children of an affected individual may inherit deficiency alleles. First-degree relatives should be screened. Augmentation therapy slows but does not reverse lung damage; non-smokers still have progressive disease (just slower); augmentation therapy does not treat liver disease."
      }
    ]
  },

  "anti-nmda-receptor-encephalitis-rn": {
    title: "Anti-NMDA Receptor Encephalitis for Registered Nurses",
    cellular: {
      title: "Immunopathophysiology of Anti-NMDA Receptor Encephalitis",
      content: "Anti-N-methyl-D-aspartate (NMDA) receptor encephalitis is an autoimmune neurological disorder caused by IgG antibodies directed against the GluN1 (NR1) subunit of the NMDA receptor, a glutamate-gated ion channel critical for synaptic transmission, neuronal plasticity, learning, and memory. It is the most common cause of autoimmune encephalitis and the second most common cause of encephalitis overall (after viral encephalitis) in young adults. The disease predominantly affects young women (80% of adult cases are female), often in association with ovarian teratomas, and follows a characteristic clinical progression from psychiatric symptoms to neurological deterioration that can mimic primary psychiatric illness, leading to delayed diagnosis and treatment.\n\nThe NMDA receptor is a heteromeric glutamate receptor composed of two GluN1 (NR1) obligatory subunits and two GluN2 (NR2A-D) or GluN3 subunits. It functions as a ligand-gated and voltage-gated ion channel that requires both glutamate binding (to GluN2) and glycine/D-serine binding (to GluN1) plus membrane depolarization (to release the magnesium block from the channel pore) for activation. When activated, NMDA receptors allow calcium influx into the postsynaptic neuron, triggering intracellular signaling cascades that mediate long-term potentiation (LTP) -- the molecular basis of learning and memory formation. NMDA receptors are abundantly expressed in the hippocampus, amygdala, prefrontal cortex, and basal ganglia -- regions critical for memory, emotion regulation, executive function, and movement control.\n\nIn anti-NMDA receptor encephalitis, IgG1 antibodies bind to the extracellular domain of the GluN1 subunit and cause receptor internalization through cross-linking and antibody-mediated endocytosis. This progressively reduces the density of NMDA receptors on the synaptic surface without causing neuronal death (unlike cytotoxic mechanisms in some other autoimmune diseases). The reduction in surface NMDA receptor density produces a functional NMDA receptor hypofunction state that closely mirrors the pharmacological effects of NMDA receptor antagonists such as ketamine and phencyclidine (PCP). This NMDA receptor hypofunction model explains the remarkable clinical similarity between anti-NMDA receptor encephalitis and PCP intoxication: both produce psychosis, movement abnormalities, autonomic instability, and decreased consciousness.\n\nNMDA receptor hypofunction disrupts the balance between glutamatergic excitatory and GABAergic inhibitory neurotransmission. In the normal brain, NMDA receptors on GABAergic interneurons help maintain inhibitory tone that modulates cortical and subcortical circuit activity. When NMDA receptors on these interneurons are blocked or internalized, the interneurons become less active, releasing adjacent glutamatergic neurons from inhibitory control. This disinhibition produces excessive glutamate release in the frontal cortex (causing psychotic symptoms: hallucinations, delusions, thought disorganization), hippocampus (causing memory impairment, seizures), basal ganglia (causing movement disorders: orofacial dyskinesias, choreoathetosis, dystonia), and brainstem autonomic centers (causing autonomic instability: tachycardia, blood pressure fluctuations, central hypoventilation, hyperthermia).\n\nIn approximately 40-50% of young women with anti-NMDA receptor encephalitis, the immune trigger is an ovarian teratoma -- a germ cell tumor containing multiple tissue types including nervous tissue that expresses NMDA receptors. The immune system generates antibodies against the NMDA receptors expressed by the tumor, and these antibodies cross-react with the patient's own neuronal NMDA receptors (paraneoplastic mechanism). However, the remaining 50-60% of cases are non-paraneoplastic, occurring without an identifiable tumor, often following a viral prodrome (particularly herpes simplex virus encephalitis, which may expose NMDA receptor antigens during the inflammatory destruction of brain tissue).\n\nThe clinical course follows a characteristic five-stage progression. Stage 1 (prodromal phase, days 1-14): nonspecific viral-like symptoms including headache, fever, nausea, and fatigue, often mistaken for a common viral illness. Stage 2 (psychiatric phase, weeks 1-2): prominent psychiatric symptoms dominate -- anxiety, insomnia, paranoia, visual and auditory hallucinations, bizarre behavior, psychosis, and personality changes. Patients at this stage are frequently admitted to psychiatric units and treated with antipsychotics, which are typically ineffective and may worsen symptoms. Stage 3 (unresponsive phase, weeks 2-4): decreased consciousness, catatonia, mutism, orofacial dyskinesias (lip-smacking, chewing, grimacing), limb choreoathetosis, seizures, and autonomic instability. Stage 4 (hyperkinetic phase, weeks to months): autonomous breathing dysfunction (central hypoventilation requiring mechanical ventilation), severe autonomic storms (alternating tachycardia/bradycardia, hypertension/hypotension, hyperthermia), and continued movement disorders. Stage 5 (recovery phase, months to years): gradual improvement in reverse order (autonomic stability returns first, followed by movement control, then cognition, then personality normalization); some patients have persistent cognitive and behavioral deficits.\n\nDiagnosis requires detection of anti-NMDA receptor antibodies (IgG class) in CSF, which is more sensitive than serum testing. CSF analysis typically shows lymphocytic pleocytosis (50-80% of cases), elevated protein, and often negative oligoclonal bands initially (though they may develop over time). MRI may be normal in up to 50% of cases, or show non-specific T2/FLAIR hyperintensities in the medial temporal lobes, cerebral cortex, brainstem, or cerebellum. EEG characteristically shows a unique extreme delta brush pattern (rhythmic delta activity with superimposed fast beta activity) that is highly suggestive of anti-NMDA receptor encephalitis."
    },
    riskFactors: [
      "Female sex (80% of adult cases; male predominance in children under 12 years, where teratoma association is less common)",
      "Young age (median age of onset 21 years; 37% of cases occur in patients under 18 years)",
      "Ovarian teratoma (present in 40-50% of women over 18 years; rare in children and males; tumor removal is essential for treatment and reduces relapse risk)",
      "Prior herpes simplex virus (HSV) encephalitis (approximately 20-30% of patients develop anti-NMDA receptor antibodies weeks to months after HSV encephalitis, presumably from NMDA receptor antigen exposure during viral-mediated brain tissue destruction)",
      "Other tumors expressing NMDA receptors (rarely: mediastinal teratoma, testicular teratoma, small cell lung cancer, neuroblastoma)",
      "Previous episode of anti-NMDA receptor encephalitis (relapse rate 12-25%, higher in patients without tumor removal or without adequate immunotherapy)",
      "Immunologically susceptible individuals with genetic predisposition to autoimmunity"
    ],
    diagnostics: [
      "CSF anti-NMDA receptor antibodies (IgG class): the definitive diagnostic test; CSF testing is MORE sensitive than serum testing (serum can be negative with positive CSF in 14% of cases); send to specialized reference laboratory using cell-based assay",
      "CSF analysis: lymphocytic pleocytosis (in 50-80% of cases), mildly elevated protein, normal glucose; oligoclonal bands may develop over the disease course but are often initially absent",
      "MRI brain with gadolinium contrast: normal in up to 50% of cases; when abnormal, shows non-specific T2/FLAIR hyperintensities in medial temporal lobes, cerebral cortex, or brainstem; helps exclude other causes of encephalitis",
      "EEG: diffuse slowing is most common; the extreme delta brush pattern (rhythmic delta with superimposed beta) is highly suggestive and considered virtually pathognomonic when present (occurring in approximately 30% of cases)",
      "Pelvic MRI or transvaginal ultrasound: mandatory in all female patients to screen for ovarian teratoma; CT chest/abdomen/pelvis for other teratoma locations; repeat imaging every 6 months for 4 years if initial screening is negative",
      "Complete metabolic panel, thyroid function, HIV, syphilis, viral encephalitis panel (HSV PCR): to exclude metabolic, infectious, and other autoimmune causes of encephalitis; often negative in anti-NMDA receptor encephalitis"
    ],
    management: [
      "Tumor removal (if present): surgical resection of ovarian teratoma is critical and should be performed as soon as possible; patients with tumor removal have faster improvement and lower relapse rates (0-4%) compared to those without tumor removal (relapse rate 25-35%)",
      "First-line immunotherapy: high-dose IV methylprednisolone (1g/day for 5 days) AND intravenous immunoglobulin (IVIG 0.4g/kg/day for 5 days, total 2g/kg) AND/OR therapeutic plasma exchange (5-7 exchanges over 10-14 days); most clinicians use combinations for severe disease",
      "Second-line immunotherapy (if no improvement after 2-4 weeks of first-line therapy): rituximab (375 mg/m2 IV weekly for 4 weeks, targeting CD20+ B-cells) AND/OR cyclophosphamide (750 mg/m2 IV monthly for 6 months); approximately 50% of patients who fail first-line therapy respond to second-line agents",
      "Seizure management: broad-spectrum anticonvulsants (levetiracetam, valproate, lacosamide); avoid carbamazepine and phenytoin which may worsen psychiatric symptoms; benzodiazepines for status epilepticus or severe movement disorders",
      "ICU-level supportive care for severe cases: mechanical ventilation for central hypoventilation (may be required for weeks to months), management of autonomic storms (short-acting agents: esmolol for tachycardia, labetalol for hypertension, atropine for bradycardia), temperature management, nutrition (enteral feeding via NG or PEG tube), DVT prophylaxis",
      "Long-term immunosuppression maintenance to prevent relapse: mycophenolate mofetil or azathioprine for 1-2 years; serial monitoring of anti-NMDA receptor antibody titers; repeat tumor screening every 6 months",
      "Multidisciplinary rehabilitation: physical therapy, occupational therapy, speech-language pathology, neuropsychological rehabilitation; recovery is typically prolonged (months to years) and occurs in reverse order of symptom onset"
    ],
    nursingActions: [
      "Perform comprehensive neurological and psychiatric assessment every 2-4 hours: level of consciousness (GCS), orientation, presence of hallucinations or delusions, motor function, abnormal movements (document type, location, frequency of orofacial dyskinesias and choreoathetosis), seizure activity, speech/language function",
      "Monitor for autonomic instability continuously: heart rate (sudden bradycardia or tachycardia), blood pressure (wide fluctuations), temperature (central hyperthermia), respiratory pattern (central hypoventilation may develop insidiously), diaphoresis; have short-acting vasoactive medications at bedside",
      "Ensure patient safety in the setting of agitation, psychosis, and movement disorders: padded side rails, fall prevention measures, 1:1 observation for severe agitation, minimize restraints when possible (may worsen dystonia), calm and consistent environment with reduced stimulation",
      "Monitor respiratory status closely: central hypoventilation is a potentially fatal complication that may develop gradually; track respiratory rate, tidal volume, SpO2, and end-tidal CO2; prepare for intubation if respiratory pattern becomes irregular or hypoxemia develops",
      "Manage continuous EEG monitoring: ensure leads remain in place, document any clinical events with time stamps for EEG correlation, alert neurology team of any electrographic seizures detected; patients may have non-convulsive seizures that are not clinically apparent",
      "Administer immunotherapy as prescribed and monitor for adverse effects: methylprednisolone (hyperglycemia, hypertension), IVIG (headache, aseptic meningitis, renal impairment, thrombotic events), plasma exchange (hypotension, electrolyte shifts, line complications)",
      "Provide psychoeducation and emotional support to family: explain that psychiatric symptoms are caused by antibodies attacking the brain (not a primary psychiatric illness), discuss expected prolonged recovery timeline, connect with support resources; document behavioral patterns to distinguish immune-mediated symptoms from medication side effects"
    ],
    assessmentFindings: [
      "Acute-onset psychiatric symptoms in a previously healthy young person: anxiety, insomnia, paranoia, hallucinations (visual and auditory), bizarre behavior, personality changes, psychomotor agitation -- often leads to initial psychiatric admission before the autoimmune etiology is recognized",
      "Progressive decline in consciousness over days to weeks: from agitation and psychosis to decreased responsiveness, catatonia, and mutism (the transition from psychiatric to neurological phase)",
      "Orofacial dyskinesias: involuntary lip-smacking, chewing, tongue protrusion, grimacing; these characteristic movement abnormalities are a clinical hallmark that should trigger consideration of anti-NMDA receptor encephalitis",
      "Seizures: focal or generalized, occurring in approximately 60-80% of patients; may be the presenting symptom in some cases, particularly in children",
      "Autonomic instability: alternating tachycardia and bradycardia, blood pressure lability (hypertensive crises alternating with hypotension), central hyperthermia, profuse diaphoresis, hypersalivation",
      "Central hypoventilation: diminished respiratory drive requiring mechanical ventilation; may develop insidiously with gradually decreasing respiratory rate and tidal volume; some patients require ventilatory support for weeks to months",
      "Memory deficits and cognitive impairment persisting into recovery: anterograde amnesia for the acute illness period is nearly universal; residual executive dysfunction, attention deficits, and behavioral changes may persist for months to years"
    ],
    signs: {
      left: [
        "Mild anxiety and insomnia with intact orientation and cognition",
        "Isolated new-onset seizure with normal interictal neurological examination",
        "Mild personality changes noticed by family without functional impairment",
        "Normal vital signs and stable autonomic function",
        "Responsive to verbal commands with preserved airway reflexes",
        "Normal or mildly abnormal MRI and EEG findings"
      ],
      right: [
        "Catatonia, mutism, or obtundation with GCS below 10",
        "Severe orofacial dyskinesias with limb choreoathetosis requiring sedation",
        "Status epilepticus or refractory seizures requiring continuous EEG monitoring",
        "Autonomic storms: severe blood pressure lability, tachycardia/bradycardia alternating, hyperthermia above 40 degrees C",
        "Central hypoventilation requiring mechanical ventilation",
        "Failure to improve after first-line immunotherapy (requiring escalation to rituximab/cyclophosphamide)"
      ]
    },
    medications: [
      {
        name: "Rituximab (Rituxan)",
        type: "Monoclonal antibody (anti-CD20 B-cell depleting agent)",
        action: "Chimeric monoclonal antibody that binds to the CD20 antigen on the surface of pre-B and mature B-lymphocytes, causing B-cell depletion through complement-dependent cytotoxicity (CDC), antibody-dependent cellular cytotoxicity (ADCC), and direct induction of apoptosis; by depleting B-cells, rituximab reduces the production of pathogenic anti-NMDA receptor antibodies; used as second-line therapy when first-line immunotherapy fails",
        sideEffects: "Infusion-related reactions (fever, chills, rigors, urticaria, bronchospasm -- pre-medicate with acetaminophen, diphenhydramine, and methylprednisolone), severe immunosuppression with increased infection risk, progressive multifocal leukoencephalopathy (PML -- rare but potentially fatal JC virus reactivation), hepatitis B reactivation, late-onset neutropenia",
        contra: "Active severe infection; known hypersensitivity to murine proteins; hepatitis B surface antigen positive (risk of fatal reactivation -- screen before use); live vaccines contraindicated during and for 6-12 months after treatment",
        pearl: "Standard dosing: 375 mg/m2 IV weekly for 4 weeks; pre-medicate 30 minutes before each infusion; first infusion start at 50 mg/hour and increase by 50 mg/hour every 30 minutes to maximum 400 mg/hour; monitor for infusion reactions especially during the first infusion; check hepatitis B serology before initiating; monitor immunoglobulin levels and CBC periodically"
      },
      {
        name: "Methylprednisolone (Solu-Medrol)",
        type: "Systemic corticosteroid (high-dose pulse therapy)",
        action: "Potent glucocorticoid that suppresses the immune-mediated inflammation by inhibiting T-cell and B-cell proliferation, reducing pro-inflammatory cytokine production, decreasing blood-brain barrier permeability to inflammatory cells, and promoting anti-inflammatory pathways; high-dose IV pulse therapy produces rapid immunosuppression in autoimmune encephalitis",
        sideEffects: "Hyperglycemia (monitor blood glucose every 6 hours), hypertension, insomnia, mood changes (may be difficult to distinguish from disease-related psychiatric symptoms), GI irritation, increased infection risk, adrenal suppression with tapering required",
        contra: "Systemic fungal infection; live vaccine administration; uncontrolled severe infection; relative: uncontrolled diabetes",
        pearl: "First-line therapy at 1g IV daily for 3-5 days; infuse over 30-60 minutes; often combined simultaneously with IVIG for synergistic effect in severe cases; monitor blood glucose closely as steroid-induced hyperglycemia can worsen neurological symptoms; distinguish steroid-induced psychiatric effects from underlying disease -- timing relative to dosing helps differentiate"
      },
      {
        name: "Intravenous Immunoglobulin (IVIG)",
        type: "Immunomodulatory agent (pooled human IgG)",
        action: "Modulates the immune response through Fc receptor blockade (reducing antibody-mediated cellular destruction), anti-idiotypic antibody effects (neutralizing pathogenic autoantibodies), complement pathway inhibition, and modulation of T-cell and B-cell function; combined with steroids as first-line therapy for anti-NMDA receptor encephalitis",
        sideEffects: "Headache (most common -- can be severe, resembling aseptic meningitis), fever and chills (rate-related), nausea, myalgias, hypertension, acute kidney injury (especially sucrose-containing products), thrombotic events, anaphylaxis in IgA-deficient patients",
        contra: "IgA deficiency with anti-IgA antibodies (anaphylaxis risk -- check IgA level before first dose); severe renal impairment (use non-sucrose formulations); known hypersensitivity to human immunoglobulin",
        pearl: "Total dose 2g/kg divided over 5 days (0.4g/kg/day); pre-medicate with acetaminophen and diphenhydramine; start at slow rate and advance per protocol; ensure adequate hydration to prevent renal complications; headache is common and managed by slowing infusion rate; if severe headache with neck stiffness develops 24-48 hours post-infusion, evaluate for aseptic meningitis versus disease progression"
      }
    ],
    pearls: [
      "The key diagnostic clue is a young woman presenting with acute psychiatric symptoms (psychosis, personality change, hallucinations) that rapidly progress to neurological deterioration (seizures, movement disorders, decreased consciousness) -- this psychiatric-to-neurological progression is the hallmark of anti-NMDA receptor encephalitis",
      "Orofacial dyskinesias (lip-smacking, chewing, tongue protrusion) developing in a patient with encephalitis should immediately trigger consideration of anti-NMDA receptor encephalitis; these movements are highly characteristic and uncommon in other forms of encephalitis",
      "ALL female patients diagnosed with anti-NMDA receptor encephalitis MUST undergo pelvic imaging (MRI or transvaginal ultrasound) to screen for ovarian teratoma; tumor removal is critical for treatment success and relapse prevention; repeat screening every 6 months for 4 years",
      "CSF antibody testing is MORE sensitive than serum testing: 14% of confirmed cases have positive CSF but negative serum antibodies; always send CSF for anti-NMDA receptor antibodies when this diagnosis is suspected",
      "Central hypoventilation is a potentially fatal complication that may develop insidiously: monitor respiratory rate, pattern, and tidal volume closely; some patients require mechanical ventilation for weeks to months during the autonomic phase",
      "Recovery is typically prolonged (months to years) and occurs in REVERSE order of symptom onset: autonomic stability returns first, followed by movement control, then cognition, then personality; families need extensive education about the expected timeline",
      "Delegate vital sign monitoring and safety surveillance to UAP with clear parameters for immediate RN notification; retain neurological and psychiatric assessment, seizure management, immunotherapy administration, respiratory status evaluation, and family communication"
    ],
    quiz: [
      {
        question: "A 22-year-old previously healthy woman is admitted to the psychiatric unit for acute-onset psychosis with hallucinations. Over the next 3 days she develops seizures, involuntary lip-smacking movements, and progressively decreasing consciousness. Which diagnosis should the nurse suspect?",
        options: [
          "Schizophrenia with catatonic features",
          "Substance-induced psychosis",
          "Anti-NMDA receptor encephalitis",
          "Viral meningitis"
        ],
        correct: 2,
        rationale: "The progression from acute psychiatric symptoms to neurological deterioration (seizures, orofacial dyskinesias, decreased consciousness) in a young woman is the hallmark of anti-NMDA receptor encephalitis. Schizophrenia does not typically produce seizures or movement disorders. Viral meningitis does not typically cause psychosis and dyskinesias."
      },
      {
        question: "A patient with confirmed anti-NMDA receptor encephalitis has been diagnosed. Which additional diagnostic study is MANDATORY for all female patients?",
        options: [
          "CT scan of the head with contrast",
          "Pelvic MRI or transvaginal ultrasound to screen for ovarian teratoma",
          "Lumbar puncture for repeat CSF analysis",
          "Bone marrow biopsy"
        ],
        correct: 1,
        rationale: "Ovarian teratoma is present in 40-50% of adult female patients with anti-NMDA receptor encephalitis and serves as the immune trigger by expressing NMDA receptors. Tumor removal is essential for treatment success and reduces relapse rates from 25-35% to 0-4%. All female patients must undergo pelvic imaging."
      },
      {
        question: "A nurse is caring for a patient with anti-NMDA receptor encephalitis in the ICU. The patient's respiratory rate gradually decreases from 16 to 8 breaths per minute over 6 hours with declining SpO2. What complication is developing?",
        options: [
          "Opioid-induced respiratory depression from pain medication",
          "Central hypoventilation from brainstem autonomic dysfunction",
          "Pneumonia causing respiratory failure",
          "Pulmonary embolism from prolonged immobility"
        ],
        correct: 1,
        rationale: "Central hypoventilation is a characteristic and potentially fatal complication of anti-NMDA receptor encephalitis, caused by antibody-mediated dysfunction of brainstem respiratory centers. It develops insidiously with gradually decreasing respiratory rate and tidal volume and may require mechanical ventilation for weeks to months."
      }
    ]
  },

  "antisynthetase-syndrome-rn": {
    title: "Antisynthetase Syndrome for Registered Nurses",
    cellular: {
      title: "Immunopathophysiology of Antisynthetase Syndrome",
      content: "Antisynthetase syndrome (ASS) is a systemic autoimmune disorder characterized by the triad of inflammatory myopathy (myositis), interstitial lung disease (ILD), and non-erosive arthritis, occurring in the context of autoantibodies directed against aminoacyl-tRNA synthetases. These enzymes catalyze the attachment of specific amino acids to their corresponding transfer RNA (tRNA) molecules, a critical step in protein synthesis. The syndrome represents one of the most clinically significant subsets of idiopathic inflammatory myopathies because of its distinctive clinical features, specific autoantibody associations, and the prominence of interstitial lung disease, which is the leading cause of morbidity and mortality.\n\nAminoacyl-tRNA synthetases (ARSs) are a family of 20 enzymes, each specific to one of the 20 standard amino acids. In antisynthetase syndrome, the immune system generates autoantibodies against one or more of these enzymes. The most common and best-characterized antisynthetase antibody is anti-Jo-1 (anti-histidyl-tRNA synthetase), which accounts for 60-80% of antisynthetase syndrome cases. Other identified antisynthetase antibodies include anti-PL-7 (anti-threonyl-tRNA synthetase), anti-PL-12 (anti-alanyl-tRNA synthetase), anti-EJ (anti-glycyl-tRNA synthetase), anti-OJ (anti-isoleucyl-tRNA synthetase), anti-KS (anti-asparaginyl-tRNA synthetase), anti-Zo (anti-phenylalanyl-tRNA synthetase), and anti-Ha/YRS (anti-tyrosyl-tRNA synthetase). Each antibody is associated with slightly different clinical phenotypes: anti-Jo-1 is associated with the most balanced presentation of myositis, ILD, and arthritis, while anti-PL-7 and anti-PL-12 are more strongly associated with ILD-predominant disease with less prominent myositis.\n\nThe immunopathogenesis involves both humoral and cell-mediated autoimmunity. Environmental triggers, particularly respiratory infections or lung injury, may expose intracellular aminoacyl-tRNA synthetases to the immune system. ARSs have been shown to have extracellular functions beyond protein synthesis: they can act as chemokines, attracting immune cells, and can be released from damaged cells during tissue injury. It is hypothesized that viral infection or pulmonary damage releases ARSs, which are then taken up and processed by antigen-presenting cells, leading to activation of autoreactive T-cells and B-cells in genetically susceptible individuals (particularly those with certain HLA-DRB1 alleles).\n\nThe muscle disease in antisynthetase syndrome is an inflammatory myopathy characterized histologically by perimysial inflammation (inflammation around the connective tissue sheaths surrounding muscle fascicles) with perifascicular necrosis (necrosis of muscle fibers at the periphery of fascicles). This pattern differs from the endomysial CD8+ T-cell infiltrates seen in inclusion body myositis and the perifascicular atrophy seen in dermatomyositis. The inflammatory infiltrate consists predominantly of CD4+ T-cells, macrophages, and dendritic cells that release pro-inflammatory cytokines (TNF-alpha, IL-1, IFN-gamma) causing direct myofiber damage and impaired muscle regeneration. Clinically, the myositis presents as symmetric proximal muscle weakness (difficulty rising from chairs, climbing stairs, raising arms above the head) with elevated serum creatine kinase (CK) levels, typically 5-50 times the upper limit of normal.\n\nThe interstitial lung disease in antisynthetase syndrome is the most clinically significant manifestation because it determines long-term prognosis and is the leading cause of death. The histopathological pattern is most commonly nonspecific interstitial pneumonia (NSIP), followed by organizing pneumonia (OP, formerly called BOOP), usual interstitial pneumonia (UIP), and diffuse alveolar damage (DAD). The lung inflammation involves both the alveolar epithelium and the pulmonary interstitium, with inflammatory cell infiltration, fibroblast proliferation, and progressive fibrosis. The ILD may be the presenting manifestation of antisynthetase syndrome (preceding myositis by months or years in up to 30% of cases), may occur simultaneously with myositis, or may develop years after the initial myositis diagnosis. High-resolution CT (HRCT) of the chest characteristically shows bilateral ground-glass opacities and consolidation (in NSIP/OP patterns) or honeycombing and traction bronchiectasis (in UIP pattern, which carries a worse prognosis).\n\nThe characteristic skin finding in antisynthetase syndrome is mechanic's hands -- hyperkeratotic, fissured, roughened skin on the lateral and palmar surfaces of the fingers and hands, resembling the hands of a manual laborer. This finding is present in 30-70% of antisynthetase syndrome patients and is nearly pathognomonic when present in combination with myositis and ILD. Additional features include Raynaud phenomenon (30-40% of patients), arthritis (typically non-erosive, affecting the small joints of the hands), fever (often the presenting symptom, sometimes occurring in a relapsing pattern), and constitutional symptoms (weight loss, fatigue).\n\nDiagnosis is confirmed by detection of an antisynthetase antibody (anti-Jo-1 is available in most laboratories; other antibodies may require specialized reference laboratories) in the context of compatible clinical features. The modified Connors criteria or the Solomon criteria are used for classification. Treatment requires a multidisciplinary approach addressing both myositis and ILD: corticosteroids (prednisone 1 mg/kg/day) for initial disease control, followed by steroid-sparing immunosuppressive agents (azathioprine, mycophenolate mofetil, methotrexate, or tacrolimus) for long-term management. Rituximab is used for refractory disease, particularly refractory ILD. The prognosis depends primarily on the severity and progression of ILD: patients with NSIP or OP patterns have better outcomes than those with UIP pattern, and early aggressive immunosuppression may prevent progression to fibrosis."
    },
    riskFactors: [
      "Female sex (female-to-male ratio approximately 2:1; higher predominance in anti-PL-7 and anti-PL-12 subsets)",
      "Age of onset typically between 40-60 years (although antisynthetase syndrome can occur at any age, including childhood)",
      "HLA-DRB1 genetic susceptibility: certain HLA alleles (particularly HLA-DRB1*0301) are strongly associated with anti-Jo-1 antibody production",
      "Environmental triggers: respiratory infections, occupational dust or chemical exposure, and cigarette smoking may trigger or worsen ILD in genetically susceptible individuals",
      "African American race (higher incidence and more severe ILD compared to Caucasian patients)",
      "Presence of anti-PL-7, anti-PL-12, or anti-MDA5 antibodies (associated with more severe and treatment-resistant ILD compared to anti-Jo-1)",
      "Delayed diagnosis and treatment (ILD progression continues during the diagnostic delay, leading to irreversible pulmonary fibrosis)"
    ],
    diagnostics: [
      "Antisynthetase antibody panel: anti-Jo-1 (most common, 60-80%), anti-PL-7, anti-PL-12, anti-EJ, anti-OJ, anti-KS; send to reference laboratory if standard panel is negative but clinical suspicion remains high; each antibody is associated with distinct clinical phenotypes",
      "Serum creatine kinase (CK): elevated 5-50 times the upper limit of normal in active myositis; CK levels correlate with disease activity and guide treatment response; may be normal in ILD-predominant disease without clinical myositis",
      "High-resolution CT (HRCT) chest: bilateral ground-glass opacities and consolidation (NSIP/OP patterns) or honeycombing with traction bronchiectasis (UIP pattern); HRCT pattern influences prognosis and treatment decisions",
      "Pulmonary function tests (PFTs): restrictive pattern with reduced FVC and reduced diffusing capacity for carbon monoxide (DLCO); DLCO is the most sensitive PFT parameter and may be abnormal even when FVC is preserved; serial PFTs monitor progression",
      "Muscle biopsy (when myositis is present): perimysial inflammation with perifascicular necrosis; distinguishes antisynthetase myopathy from other inflammatory myopathies; may not be necessary if antibody and CK are clearly diagnostic",
      "MRI of proximal muscles (thighs, upper arms): shows edema and inflammation in affected muscle groups on STIR sequences; useful for identifying active myositis and guiding biopsy site selection; also identifies fatty replacement indicating chronic damage"
    ],
    management: [
      "Initiate high-dose corticosteroids: prednisone 1 mg/kg/day (maximum 60-80 mg/day) for 4-6 weeks for initial disease control of both myositis and ILD; begin steroid taper once CK normalizes and clinical improvement is documented; total steroid course 6-12 months",
      "Start steroid-sparing immunosuppressive agent concurrently with steroids for long-term disease control: azathioprine (2-3 mg/kg/day) or mycophenolate mofetil (2-3 g/day) are first-line for combined myositis-ILD; methotrexate (15-25 mg/week) is effective for myositis and arthritis but less effective for ILD",
      "For refractory disease (failing steroids plus one conventional immunosuppressant): rituximab (1g IV x 2 doses, 2 weeks apart, repeated every 6 months) has demonstrated efficacy for both refractory myositis and refractory ILD in antisynthetase syndrome",
      "Manage ILD-specific complications: supplemental oxygen for hypoxemia (SpO2 below 88%), pulmonary rehabilitation to optimize functional capacity, annual influenza and pneumococcal vaccination, monitoring for pulmonary hypertension development (echocardiography annually)",
      "Treat arthritis with hydroxychloroquine (200-400 mg/day) as adjunctive therapy; provides anti-inflammatory benefits with minimal immunosuppression; monitor for retinal toxicity with annual ophthalmologic examination after 5 years of use",
      "Address Raynaud phenomenon: calcium channel blockers (nifedipine extended-release 30-60 mg/day), cold avoidance education, smoking cessation; for severe Raynaud with digital ulceration, consider IV prostacyclin or PDE5 inhibitors",
      "Long-term monitoring: serial CK levels (every 1-3 months), serial PFTs (every 3-6 months), annual HRCT chest, annual echocardiography for pulmonary hypertension screening; treatment adjustments based on trends in these parameters"
    ],
    nursingActions: [
      "Assess respiratory status comprehensively at each encounter: auscultate bilateral lung bases (Velcro-like crackles are characteristic of ILD), monitor SpO2 at rest and with exertion (6-minute walk test desaturation is an early sign of ILD progression), assess dyspnea severity using a validated scale (mMRC or Borg)",
      "Assess muscle strength systematically: test proximal muscle groups (hip flexors, shoulder abductors, neck flexors); use manual muscle testing (0-5 scale) or functional tests (time to rise from chair, time to climb stairs, arm raise endurance); document and trend results",
      "Examine hands for mechanic's hands (hyperkeratotic, fissured skin on lateral and palmar surfaces of fingers); also assess for Raynaud phenomenon (digital pallor, cyanosis, rubor with cold exposure), arthritis (joint swelling, tenderness), and skin rashes (heliotrope, Gottron papules if dermatomyositis overlap)",
      "Monitor for immunosuppressive therapy adverse effects: complete blood count every 2-4 weeks initially (myelosuppression from azathioprine/mycophenolate), liver function tests (azathioprine/methotrexate hepatotoxicity), renal function, blood glucose (steroid-induced hyperglycemia)",
      "Educate about infection prevention: immunosuppressive therapy significantly increases infection risk; teach hand hygiene, avoidance of sick contacts, early reporting of fever or respiratory symptoms; ensure vaccinations are current (NO live vaccines during immunosuppression); Pneumocystis jirovecii prophylaxis (TMP-SMX) may be indicated during high-dose immunosuppression",
      "Coordinate multidisciplinary care: pulmonology for ILD management, rheumatology for myositis and arthritis, physical therapy for exercise programming (controlled, low-impact exercise is beneficial for myositis -- NOT bed rest), occupational therapy for ADL adaptation, social work for disability and insurance support",
      "Provide education about the chronic nature of antisynthetase syndrome: disease requires long-term immunosuppressive therapy, relapses are common (especially when steroids are tapered too quickly), regular monitoring is essential; empower patient to recognize flare symptoms (increasing weakness, worsening dyspnea, fever)"
    ],
    assessmentFindings: [
      "Symmetric proximal muscle weakness: difficulty rising from seated position without using arms, difficulty climbing stairs, inability to lift arms above the head (washing hair, reaching shelves); neck flexor weakness (difficulty lifting head from pillow)",
      "Exertional dyspnea and dry cough from interstitial lung disease; bilateral inspiratory Velcro-like crackles at the lung bases on auscultation (present in 70-80% of patients with ILD); may precede myositis by months or years",
      "Mechanic's hands: hyperkeratotic, cracked, darkened, roughened skin on the lateral and palmar aspects of the fingers, resembling the hands of a manual laborer; nearly pathognomonic for antisynthetase syndrome",
      "Non-destructive arthritis: symmetric polyarthritis affecting the small joints of the hands (metacarpophalangeal and proximal interphalangeal joints), wrists, and knees; morning stiffness exceeding 30 minutes; typically non-erosive on X-ray",
      "Raynaud phenomenon: episodic digital color changes (white to blue to red) triggered by cold exposure or emotional stress, present in 30-40% of patients",
      "Constitutional symptoms: low-grade fever (may be presenting symptom), fatigue, weight loss, myalgias preceding the onset of clinically apparent myositis",
      "Elevated serum CK (5-50 times upper limit of normal) correlating with active myositis; CK may be normal in patients with ILD-predominant disease without clinical myositis"
    ],
    signs: {
      left: [
        "Mild proximal weakness (MRC grade 4/5) without functional limitation",
        "Mild exertional dyspnea with SpO2 above 92% on exertion",
        "Stable PFTs with FVC above 70% predicted and DLCO above 60%",
        "Low-level CK elevation (less than 5 times ULN) on stable therapy",
        "Raynaud phenomenon without digital ulceration",
        "Arthralgia without joint swelling or morning stiffness"
      ],
      right: [
        "Severe proximal weakness (MRC grade 2-3/5) with inability to perform ADLs or respiratory muscle involvement",
        "Rapidly progressive ILD with declining FVC (more than 10% decrease in 6 months) or DLCO decline",
        "Hypoxemia requiring supplemental oxygen (SpO2 below 88% at rest or with exertion)",
        "Refractory disease failing steroids plus conventional immunosuppressant (requiring rituximab or cyclophosphamide)",
        "Development of pulmonary hypertension (elevated estimated RVSP on echocardiography, right heart failure symptoms)",
        "Dysphagia from pharyngeal muscle involvement (aspiration risk)"
      ]
    },
    medications: [
      {
        name: "Azathioprine (Imuran)",
        type: "Purine synthesis inhibitor / immunosuppressive agent",
        action: "Metabolized to 6-mercaptopurine and then to thiopurine nucleotides that are incorporated into DNA, inhibiting purine synthesis and reducing lymphocyte proliferation; suppresses both T-cell and B-cell mediated immune responses; used as the primary steroid-sparing agent in antisynthetase syndrome for long-term control of both myositis and interstitial lung disease",
        sideEffects: "Myelosuppression (leukopenia, thrombocytopenia, anemia -- dose-limiting toxicity), hepatotoxicity (monitor LFTs), nausea and vomiting (take with food), increased infection risk, pancreatitis (rare but serious), increased long-term risk of lymphoma and non-melanoma skin cancer",
        contra: "Known hypersensitivity; concurrent use with allopurinol (allopurinol inhibits xanthine oxidase, dramatically increasing azathioprine toxicity -- reduce dose by 75% if combination is unavoidable); pregnancy category D; severe hepatic or renal impairment requires dose adjustment",
        pearl: "Check thiopurine methyltransferase (TPMT) enzyme activity or genotype BEFORE starting azathioprine: patients with low or absent TPMT activity are at dramatically increased risk of life-threatening myelosuppression; monitor CBC every 2 weeks for the first 2 months, then monthly; therapeutic effect takes 6-12 weeks to develop"
      },
      {
        name: "Mycophenolate Mofetil (CellCept)",
        type: "Inosine monophosphate dehydrogenase (IMPDH) inhibitor / immunosuppressive agent",
        action: "Inhibits inosine monophosphate dehydrogenase (IMPDH), the rate-limiting enzyme in de novo purine synthesis; lymphocytes are uniquely dependent on the de novo pathway for proliferation (unlike other cell types that can use the salvage pathway), making mycophenolate selectively cytostatic for lymphocytes; suppresses both T-cell and B-cell responses; emerging as the preferred steroid-sparing agent for ILD-predominant antisynthetase syndrome",
        sideEffects: "GI disturbances (diarrhea, nausea, vomiting, abdominal pain -- most common, dose-related), myelosuppression (leukopenia, anemia), increased infection risk (particularly CMV reactivation), teratogenicity (pregnancy category X -- requires contraception counseling)",
        contra: "Pregnancy or planned pregnancy (CATEGORY X -- absolutely contraindicated); breastfeeding; hypersensitivity; severe GI disease (may worsen); concurrent live vaccines",
        pearl: "Typical dose 2-3 g/day divided twice daily; take on an empty stomach for best absorption; GI side effects are dose-limiting and may be reduced by dividing into 3-4 daily doses or switching to enteric-coated mycophenolate sodium (Myfortic); requires effective contraception in women of childbearing potential -- pregnancy test before starting and monthly during treatment; monitor CBC every 2 weeks for first 2 months, then monthly"
      },
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Suppresses the immune-mediated inflammatory response driving myositis and ILD by inhibiting T-cell and B-cell proliferation, reducing pro-inflammatory cytokine production, decreasing inflammatory cell recruitment to muscles and lungs, and reducing immune complex deposition; provides rapid initial disease control while slower-acting steroid-sparing agents take effect",
        sideEffects: "Weight gain and Cushingoid features, hyperglycemia (monitor blood glucose), osteoporosis (initiate calcium, vitamin D, and consider bisphosphonate), hypertension, mood changes and insomnia, increased infection risk, GI irritation (co-administer PPI), cataracts and glaucoma with prolonged use, avascular necrosis, adrenal suppression (taper required)",
        contra: "Active untreated infection; live vaccines during therapy; uncontrolled diabetes (relative); active peptic ulcer disease; psychosis from prior steroid use",
        pearl: "Starting dose 1 mg/kg/day (max 60-80 mg) for 4-6 weeks, then gradual taper over 6-12 months guided by CK levels and clinical response; steroid-sparing agent should be started CONCURRENTLY because long-term high-dose steroids cause unacceptable toxicity; relapses are common when steroids are tapered too quickly -- reduce by no more than 10% of current dose every 2-4 weeks; bone protection must be initiated from day one"
      }
    ],
    pearls: [
      "The classic antisynthetase syndrome triad is myositis + interstitial lung disease + non-erosive arthritis, but not all three must be present simultaneously; ILD can precede myositis by months to years, so a patient with new ILD should be screened with an antisynthetase antibody panel",
      "Mechanic's hands (hyperkeratotic, fissured, darkened skin on the lateral and palmar fingers) is a clinical hallmark of antisynthetase syndrome that is nearly pathognomonic when present with myositis or ILD; always examine the hands in patients presenting with unexplained proximal weakness or ILD",
      "ILD is the leading cause of morbidity and mortality in antisynthetase syndrome; serial PFTs (FVC and DLCO) every 3-6 months are essential for monitoring progression; a decline in FVC of more than 10% or DLCO of more than 15% indicates clinically significant progression requiring treatment escalation",
      "Check TPMT enzyme activity BEFORE starting azathioprine: patients with low or absent TPMT are at dramatically increased risk for life-threatening myelosuppression; this is a mandatory pre-treatment test",
      "Mycophenolate is pregnancy category X: all women of childbearing potential must have a negative pregnancy test before starting and must use effective contraception throughout treatment and for 6 weeks after discontinuation; this counseling must be documented",
      "Anti-Jo-1 is the most common antisynthetase antibody (60-80% of cases), but anti-PL-7 and anti-PL-12 are associated with more severe ILD-predominant disease; the specific antibody type guides prognosis and treatment intensity",
      "Delegate vital sign measurement and SpO2 monitoring to UAP; retain respiratory assessment, muscle strength testing, medication side effect monitoring, immunosuppressant education, and coordination of multidisciplinary care"
    ],
    quiz: [
      {
        question: "A patient with known anti-Jo-1 positive antisynthetase syndrome presents for routine follow-up. The nurse examines the patient's hands and notes hyperkeratotic, cracked, roughened skin on the lateral aspects of the fingers. What finding does this represent?",
        options: [
          "Contact dermatitis from occupational exposure",
          "Mechanic's hands -- a characteristic finding of antisynthetase syndrome",
          "Psoriatic skin changes",
          "Fungal infection of the hands (tinea manuum)"
        ],
        correct: 1,
        rationale: "Mechanic's hands is a characteristic dermatological finding of antisynthetase syndrome, presenting as hyperkeratotic, cracked, roughened, darkened skin on the lateral and palmar aspects of the fingers. It is nearly pathognomonic for antisynthetase syndrome and should prompt evaluation for myositis and ILD."
      },
      {
        question: "Before starting azathioprine for antisynthetase syndrome, which laboratory test is ESSENTIAL to obtain?",
        options: [
          "Serum ferritin level",
          "Thiopurine methyltransferase (TPMT) enzyme activity",
          "Erythrocyte sedimentation rate (ESR)",
          "Serum complement levels (C3 and C4)"
        ],
        correct: 1,
        rationale: "TPMT enzyme activity must be checked before starting azathioprine because patients with low or absent TPMT cannot adequately metabolize the drug, leading to accumulation of toxic thiopurine metabolites that cause life-threatening myelosuppression. This is a mandatory pre-treatment test."
      },
      {
        question: "A patient with antisynthetase syndrome on mycophenolate mofetil asks about starting a family. Which response by the nurse is MOST appropriate?",
        options: [
          "Mycophenolate is safe during pregnancy at the current dose",
          "You should reduce the dose to half during pregnancy",
          "Mycophenolate is absolutely contraindicated in pregnancy and must be discussed with your rheumatologist before conception planning",
          "Switch to the enteric-coated form during pregnancy for better safety"
        ],
        correct: 2,
        rationale: "Mycophenolate mofetil is pregnancy category X, meaning it is absolutely contraindicated in pregnancy due to teratogenic effects (increased risk of spontaneous abortion and congenital malformations). The patient must discuss with their rheumatologist to transition to a pregnancy-compatible immunosuppressant before conception."
      }
    ]
  }
};

console.log("RN Batch 3: Injecting 4 lessons...");
let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`Done: ${count} lessons injected`);
