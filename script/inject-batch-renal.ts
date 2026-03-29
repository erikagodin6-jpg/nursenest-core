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
  if (l.lifespan) li.push(`    lifespan: { title: "${escapeStr(l.lifespan.title)}", content: "${escapeStr(l.lifespan.content)}" },`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let c = fs.readFileSync(fp, "utf8");
    const marker = `"${id}":`; 
    const idx = c.indexOf(marker);
    if (idx === -1) continue;
    if (!c.slice(idx, idx + 300).includes("[WRITE YOUR")) continue;
    let bc = 0, es = idx + marker.length;
    while (es < c.length && c[es] !== "{") es++;
    let start = es;
    for (let i = start; i < c.length; i++) {
      if (c[i] === "{") bc++;
      else if (c[i] === "}") { bc--; if (bc === 0) { es = i + 1; break; } }
    }
    const newBlock = `{\n    ${buildLS(lesson)}\n  }`;
    c = c.slice(0, start) + newBlock + c.slice(es);
    fs.writeFileSync(fp, c, "utf8");
    console.log(`Injected ${id} in ${file}`);
    return true;
  }
  console.log(`NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {

"kidney-stone-basics-rpn": {
  title: "Kidney Stones (Nephrolithiasis)",
  cellular: {
    title: "Pathophysiology of Kidney Stones",
    content: "Kidney stones (nephrolithiasis or renal calculi) form when dissolved minerals and salts in the urine crystallise and aggregate into solid masses within the urinary tract. The process begins with supersaturation - when the concentration of stone-forming substances exceeds the capacity of urine to keep them dissolved. Normal urine contains inhibitors of crystallisation (citrate, magnesium, pyrophosphate, glycosaminoglycans), and stones form when the balance between promoters and inhibitors tips toward crystallisation.\n\nFour main types of kidney stones exist, each with distinct pathophysiology. Calcium stones (calcium oxalate and calcium phosphate) account for 70-80% of all stones. Calcium oxalate stones are the most common subtype, forming when urinary calcium and oxalate concentrations are elevated. Hypercalciuria can result from increased intestinal absorption, decreased renal reabsorption, or increased bone resorption. Hyperoxaluria occurs with high dietary oxalate intake, inflammatory bowel disease (increased colonic oxalate absorption), or rarely primary hyperoxaluria (genetic enzyme deficiency).\n\nStruvite stones (magnesium ammonium phosphate) account for 10-15% and form exclusively in the setting of urinary tract infections with urease-producing organisms (Proteus, Klebsiella, Pseudomonas). Urease splits urea into ammonia and carbon dioxide, alkalinising the urine (pH >7.0) and creating conditions for magnesium ammonium phosphate crystallisation. Struvite stones can rapidly grow to fill the entire renal collecting system, forming large staghorn calculi.\n\nUric acid stones (5-10%) form in persistently acidic urine (pH <5.5) when uric acid, which is poorly soluble at low pH, precipitates. Risk factors include gout, high purine diet, metabolic syndrome, and chronic diarrhea (bicarbonate loss causing systemic acidosis). Uric acid stones are radiolucent (not visible on plain X-ray) but visible on CT.\n\nCystine stones (1-3%) result from cystinuria, an autosomal recessive disorder causing defective renal tubular reabsorption of cystine and other dibasic amino acids. Cystine has very low solubility in urine, leading to recurrent stone formation beginning in childhood.\n\nStones cause symptoms when they obstruct urine flow. A stone lodging at the ureteropelvic junction, the pelvic brim where the ureter crosses the iliac vessels, or the ureterovesical junction (the three natural narrowing points) causes acute obstruction. This increases pressure proximal to the obstruction, distending the renal pelvis and activating prostaglandin-mediated inflammation and ureteral smooth muscle spasm. The result is renal colic - severe, paroxysmal flank pain that radiates to the groin, often described as the most intense pain a patient has experienced."
  },
  riskFactors: [
    "Inadequate fluid intake (most important modifiable risk factor - urine output less than 2 litres per day significantly increases risk)",
    "Prior history of kidney stones (50% recurrence rate within 5-10 years without preventive measures)",
    "Family history of nephrolithiasis (genetic factors in calcium handling and cystinuria)",
    "Diet high in sodium, animal protein, and oxalate-rich foods (spinach, rhubarb, nuts, chocolate)",
    "Obesity and metabolic syndrome (increased uric acid excretion and acidic urine)",
    "Chronic dehydration states: hot climates, strenuous physical labour, inadequate hydration",
    "Conditions causing hypercalcemia: primary hyperparathyroidism, sarcoidosis, excessive vitamin D",
    "Inflammatory bowel disease or chronic diarrhea (fat malabsorption leads to increased oxalate absorption)",
    "Urinary tract infections with urease-producing organisms (struvite stone formation)",
    "Medications: topiramate, acetazolamide, calcium/vitamin D supplements in excess, protease inhibitors"
  ],
  diagnostics: [
    "Non-contrast CT abdomen/pelvis is the gold standard: detects all stone types including small stones and uric acid stones; determines size, location, and degree of obstruction (hydronephrosis)",
    "Urinalysis: hematuria (present in 85% of cases), pyuria and bacteriuria if concurrent infection, urine pH (>7 suggests struvite; <5.5 suggests uric acid)",
    "Urine culture: essential to rule out concurrent UTI, especially if pyuria present or struvite stone suspected",
    "Basic metabolic panel: creatinine (assess renal function), calcium (screen for hyperparathyroidism), uric acid, electrolytes",
    "KUB X-ray: identifies radiopaque calcium and struvite stones; uric acid stones are radiolucent and will NOT appear on plain films",
    "Renal ultrasound: first-line in pregnancy and paediatrics (avoids radiation); detects hydronephrosis and larger stones but may miss small or ureteral stones",
    "24-hour urine collection (after acute episode): volume, calcium, oxalate, citrate, uric acid, sodium, pH - identifies metabolic risk factors for prevention",
    "Stone analysis: all passed or surgically retrieved stones should be sent for chemical composition analysis to guide prevention strategies"
  ],
  management: [
    "Small stones (less than 5-6 mm): expectant management with aggressive hydration (2-3 litres/day), analgesics, and alpha-blocker (tamsulosin) for medical expulsive therapy to relax ureteral smooth muscle and facilitate passage",
    "Pain management: NSAIDs (ketorolac IV or ibuprofen) are first-line analgesics as they reduce prostaglandin-mediated inflammation and ureteral spasm; opioids for breakthrough pain",
    "Antiemetics (ondansetron) for associated nausea and vomiting",
    "Stones 6-10 mm: medical expulsive therapy may be attempted but intervention often needed; stones greater than 10 mm unlikely to pass spontaneously",
    "Extracorporeal shock wave lithotripsy (ESWL): non-invasive fragmentation using focused sound waves; effective for stones less than 2 cm in the kidney or proximal ureter",
    "Ureteroscopy with laser lithotripsy: endoscopic approach for ureteral stones and stones that fail ESWL; a ureteral stent may be placed afterward",
    "Percutaneous nephrolithotomy (PCNL): for large stones (>2 cm) or staghorn calculi; involves creating a percutaneous tract into the kidney for stone removal",
    "Emergency ureteral stent or percutaneous nephrostomy: required for obstructing stones with concurrent UTI/sepsis (infected hydronephrosis is a urologic emergency)",
    "Prevention: increase fluid intake to maintain urine output greater than 2.5 litres/day, reduce sodium intake, moderate animal protein, thiazide diuretics for recurrent calcium stones, potassium citrate for hypocitraturia or uric acid stones"
  ],
  nursingActions: [
    "Assess pain: location, severity (use 0-10 scale), quality (colicky vs constant), radiation pattern; renal colic typically presents as severe flank pain radiating to groin",
    "Strain ALL urine through a fine-mesh strainer to capture passed stones; send any retrieved material for chemical analysis",
    "Maintain strict intake and output; encourage oral fluid intake of 2-3 litres per day to promote stone passage and prevent new stone formation",
    "Administer analgesics as prescribed: NSAIDs first-line, opioids for breakthrough; reassess pain after administration",
    "Monitor for signs of infection with obstruction (obstructive pyelonephritis/urosepsis): fever, chills, flank pain, tachycardia, hypotension - this is an emergency requiring urgent decompression",
    "Administer tamsulosin as prescribed for medical expulsive therapy; educate about orthostatic hypotension and dizziness",
    "Monitor renal function: assess urine output (report oliguria), track BUN and creatinine trends",
    "Post-procedure care (ESWL/ureteroscopy): monitor for hematuria (expected initially), assess for ureteral stent complications (flank pain, bladder spasm, urgency), manage pain",
    "Discharge education: hydration goals, dietary modifications, medication adherence for prevention, signs to return (fever, inability to urinate, uncontrolled pain/vomiting)"
  ],
  assessmentFindings: [
    "Severe, colicky flank pain radiating from the costovertebral angle to the lower abdomen and groin (following ureteral course) - often described as worst pain ever experienced",
    "Restlessness and inability to find a comfortable position (distinguishes from peritoneal pain where patients lie still)",
    "Nausea and vomiting (vagal response to severe pain and renal capsular distension)",
    "Hematuria - gross or microscopic (present in approximately 85% of cases)",
    "Urinary urgency, frequency, and dysuria when stone is near the ureterovesical junction (mimics UTI symptoms)",
    "Costovertebral angle tenderness on percussion",
    "Diaphoresis, tachycardia, and sometimes hypertension from severe pain response"
  ],
  signs: {
    left: [
      "Severe colicky flank pain radiating to groin",
      "Restlessness and inability to find comfort",
      "Nausea and vomiting",
      "Hematuria (gross or microscopic)",
      "Costovertebral angle tenderness"
    ],
    right: [
      "Fever with chills (suggests infected obstruction - emergency)",
      "Oliguria or anuria (bilateral obstruction or obstruction of solitary kidney)",
      "Persistent vomiting with dehydration",
      "Hypotension and tachycardia (urosepsis)",
      "Peritoneal signs (rare - suggests stone perforation or alternative diagnosis)"
    ]
  },
  medications: [
    {
      name: "Ketorolac (Toradol)",
      type: "NSAID (Parenteral)",
      action: "Inhibits cyclooxygenase (COX-1 and COX-2), reducing prostaglandin synthesis and thereby decreasing renal pelvis and ureteral inflammation, smooth muscle spasm, and afferent nerve sensitisation",
      sideEffects: "GI bleeding, renal impairment (especially in dehydrated patients), platelet dysfunction, injection site pain; hypertension",
      contra: "Active GI bleeding, severe renal impairment (CrCl <30), concurrent anticoagulants, aspirin-sensitive asthma, use beyond 5 days",
      pearl: "First-line analgesic for renal colic - equivalent or superior to opioids with fewer side effects (no nausea, sedation, or dependence); maximum 5 days of use; avoid in patients with renal insufficiency"
    },
    {
      name: "Tamsulosin (Flomax)",
      type: "Alpha-1 Adrenergic Blocker",
      action: "Selectively blocks alpha-1A adrenergic receptors in ureteral smooth muscle, causing relaxation and dilation of the distal ureter, facilitating stone passage",
      sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, nasal congestion, headache",
      contra: "Concurrent use with strong CYP3A4 inhibitors, severe hepatic impairment, orthostatic hypotension",
      pearl: "Medical expulsive therapy: most effective for distal ureteral stones 5-10 mm; increases spontaneous passage rate by approximately 30%; takes 30 minutes after first dose to reduce smooth muscle tone; educate patients about rising slowly to prevent falls from orthostatic hypotension"
    },
    {
      name: "Potassium Citrate",
      type: "Alkalinising Agent / Stone Prevention",
      action: "Citrate binds calcium in urine, reducing calcium oxalate supersaturation; metabolised to bicarbonate, alkalinising urine and increasing solubility of uric acid and cystine",
      sideEffects: "GI upset, nausea, diarrhea, hyperkalemia (especially with renal impairment or ACE inhibitor/ARB use)",
      contra: "Hyperkalemia, severe renal impairment, untreated UTI with urease-producing organisms (alkaline urine promotes struvite stones), concurrent potassium-sparing diuretics",
      pearl: "Dual mechanism for prevention: raises urinary citrate (inhibits crystallisation) and raises urinary pH (dissolves uric acid and reduces cystine stone risk); monitor potassium levels; target urine pH 6.5-7.0 for uric acid stone prevention; take with meals to reduce GI effects"
    }
  ],
  pearls: [
    "A kidney stone with concurrent UTI and obstruction (infected hydronephrosis) is a UROLOGIC EMERGENCY requiring emergent decompression - antibiotics alone cannot clear an infection behind an obstruction",
    "Patients with renal colic are characteristically restless and writhing in pain, unable to find a comfortable position; peritoneal irritation (appendicitis, ectopic pregnancy) causes patients to lie still - this distinction aids differential diagnosis",
    "Strain ALL urine to capture passed stones - stone composition analysis is essential to guide specific dietary and pharmacologic prevention strategies",
    "Uric acid stones are radiolucent and invisible on plain X-ray (KUB) - CT is required; they are the only common stone type that can potentially be dissolved with urine alkalinisation using potassium citrate",
    "NSAIDs are first-line analgesics for renal colic, not opioids - NSAIDs reduce the prostaglandin-mediated inflammation and spasm that drive the pain",
    "The three narrowest points of the ureter where stones most commonly lodge: ureteropelvic junction, pelvic brim (iliac vessel crossing), and ureterovesical junction",
    "Prevention is critical because the 5-year recurrence rate is approximately 50% without intervention; increasing fluid intake to produce greater than 2.5 litres of urine daily is the single most effective preventive measure",
    "Do not confuse struvite stone prevention with other stone types - alkaline urine PROMOTES struvite formation but PREVENTS uric acid stones"
  ],
  quiz: [
    {
      question: "A patient presents with severe right flank pain radiating to the groin, nausea, vomiting, and microscopic hematuria. Vital signs show temperature 39.2 C, HR 115, BP 88/56. What is the priority nursing action?",
      options: [
        "Administer tamsulosin for medical expulsive therapy",
        "Strain urine and encourage oral fluids for stone passage",
        "Notify the provider immediately as these findings suggest obstructive pyelonephritis with urosepsis",
        "Administer ketorolac IV for pain management"
      ],
      correct: 2,
      rationale: "Fever, tachycardia, and hypotension in a patient with an obstructing kidney stone indicate infected hydronephrosis progressing to urosepsis - a urologic emergency. This requires immediate provider notification for IV antibiotics and emergent urinary tract decompression (ureteral stent or nephrostomy). Pain management and medical expulsive therapy are not priorities when sepsis is present."
    },
    {
      question: "A patient with a 4 mm distal ureteral stone is prescribed tamsulosin. What education should the nurse provide?",
      options: [
        "Take the medication on an empty stomach and avoid all fluids for 2 hours",
        "Rise slowly from sitting or lying positions as the medication can cause dizziness and drops in blood pressure",
        "The medication will dissolve the stone within 24-48 hours",
        "Stop the medication immediately if urine becomes pink-tinged"
      ],
      correct: 1,
      rationale: "Tamsulosin is an alpha-blocker that relaxes ureteral smooth muscle to facilitate stone passage. Its primary side effect is orthostatic hypotension, which can cause dizziness and falls. Patients should be educated to rise slowly from sitting/lying positions. Tamsulosin does not dissolve stones (it facilitates passage), and mild hematuria is expected with a ureteral stone."
    },
    {
      question: "Which type of kidney stone is NOT visible on a standard KUB X-ray?",
      options: [
        "Calcium oxalate stone",
        "Struvite stone",
        "Uric acid stone",
        "Calcium phosphate stone"
      ],
      correct: 2,
      rationale: "Uric acid stones are radiolucent, meaning they are not visible on plain X-rays (KUB). They require CT scan for detection. Calcium stones (oxalate and phosphate) and struvite stones are radiopaque and visible on plain films. This distinction is clinically important when choosing imaging modalities."
    }
  ]
},

"uti-basics-rpn": {
  title: "Urinary Tract Infection Basics",
  cellular: {
    title: "Pathophysiology of Urinary Tract Infections",
    content: "Urinary tract infections (UTIs) occur when pathogenic microorganisms colonise and multiply within the urinary tract. UTIs are classified anatomically: lower UTIs include cystitis (bladder infection) and urethritis (urethral infection), while upper UTIs refer to pyelonephritis (kidney infection). The distinction is clinically important because pyelonephritis carries significantly greater morbidity and can progress to urosepsis.\n\nThe urinary tract has several defence mechanisms against infection. The unidirectional flow of urine physically flushes bacteria from the tract. The ureterovesical junction has a valve mechanism preventing reflux. Urine itself has antibacterial properties: low pH, high osmolality, high urea concentration, and the Tamm-Horsfall protein that binds bacteria. The bladder epithelium (urothelium) secretes IgA antibodies and antimicrobial peptides. Complete bladder emptying with each void is critical as residual urine serves as a growth medium.\n\nMost UTIs are ascending infections. Bacteria from the perineal and periurethral area ascend the urethra to the bladder. The female urethra is anatomically shorter (3-4 cm vs 20 cm in males) and located closer to the vaginal and rectal flora, explaining the dramatically higher UTI prevalence in women (50% of women will experience at least one UTI in their lifetime). Sexual intercourse mechanically introduces bacteria into the female urethra (honeymoon cystitis).\n\nEscherichia coli is the causative organism in 75-95% of uncomplicated community-acquired UTIs. E. coli possesses virulence factors including type 1 fimbriae (pili) that bind to uroepithelial receptors, P fimbriae that facilitate ascent to the kidneys, and the ability to form biofilms. Other common pathogens include Staphylococcus saprophyticus (second most common in young women), Klebsiella, Proteus (associated with alkaline urine and struvite stones), Enterococcus, and Pseudomonas (healthcare-associated infections).\n\nCatheter-associated UTIs (CAUTIs) are the most common healthcare-associated infection, accounting for 40% of nosocomial infections. Bacteria colonise the catheter surface forming biofilms within 24-48 hours. The daily risk of bacteriuria increases 3-8% per day of catheterisation, reaching near 100% by 30 days. Biofilm-associated bacteria are protected from antibiotics and host immune responses, making eradication difficult.\n\nComplicated UTIs occur in the setting of structural or functional abnormalities of the urinary tract (obstruction, neurogenic bladder, urinary diversion, renal transplant), immunocompromised states, or pregnancy. These infections are more likely to involve resistant organisms and require broader-spectrum antibiotics and longer treatment courses.\n\nPyelonephritis develops when bacteria ascend from the bladder through the ureters to the renal parenchyma. Vesicoureteral reflux, ureteral obstruction, and pregnancy (progesterone-induced ureteral dilation and stasis) predispose to ascending infection. The renal medulla is particularly vulnerable to infection because its high osmolality impairs leukocyte function and complement activation. Untreated pyelonephritis can progress to renal abscess, perinephric abscess, or bacteremia with sepsis."
  },
  riskFactors: [
    "Female sex (short urethra, proximity to rectal flora - women have 30-fold higher UTI rates than men)",
    "Sexual activity in women (mechanical introduction of bacteria; new sexual partner increases risk)",
    "Indwelling urinary catheter (3-8% daily risk of bacteriuria; most common nosocomial infection)",
    "Urinary retention or incomplete bladder emptying (BPH in men, neurogenic bladder, anticholinergic medications)",
    "Pregnancy (progesterone-mediated ureteral relaxation and stasis, uterine compression of ureters)",
    "Diabetes mellitus (glucosuria promotes bacterial growth, impaired immune function, neurogenic bladder)",
    "Postmenopausal status (decreased estrogen leads to reduced lactobacilli colonisation and altered vaginal pH)",
    "Urinary tract obstruction (kidney stones, BPH, tumours, strictures)",
    "Immunocompromised states (HIV, chemotherapy, organ transplant)",
    "Previous UTI history (recurrence rate is 25-50% within 6 months)"
  ],
  diagnostics: [
    "Urinalysis with microscopy: pyuria (WBCs in urine >10 per high-power field), bacteriuria, positive leukocyte esterase, positive nitrites (produced by gram-negative bacteria reducing nitrate), hematuria",
    "Urine culture and sensitivity: gold standard for diagnosis; significant bacteriuria defined as greater than 100,000 CFU/mL for clean-catch specimen; lower counts may be significant in catheterised patients or those on antibiotics",
    "Dipstick urinalysis: positive leukocyte esterase (sensitive for pyuria) and nitrites (specific for gram-negative bacteriuria but not all organisms produce nitrites - Enterococcus and S. saprophyticus do not)",
    "Blood work for pyelonephritis: CBC (leukocytosis with left shift), CRP, blood cultures (if sepsis suspected), BUN/creatinine (assess renal function)",
    "Renal ultrasound: indicated for recurrent UTIs, suspected obstruction, treatment failure, or male UTI to evaluate for structural abnormalities",
    "CT abdomen/pelvis with contrast: for suspected complications (renal abscess, perinephric abscess, emphysematous pyelonephritis)"
  ],
  management: [
    "Uncomplicated cystitis in women: first-line antibiotics include nitrofurantoin (5 days), trimethoprim-sulfamethoxazole (3 days if local resistance <20%), or fosfomycin (single dose)",
    "Fluoroquinolones (ciprofloxacin) reserved for complicated UTIs or when first-line agents cannot be used due to increasing resistance and serious side effects",
    "Acute uncomplicated pyelonephritis: outpatient treatment with oral fluoroquinolone (7-14 days) or initial IV dose of ceftriaxone followed by oral step-down; hospitalise if unable to tolerate oral intake, sepsis, or pregnancy",
    "Complicated UTIs: broader-spectrum antibiotics (ceftriaxone, fluoroquinolone, piperacillin-tazobactam), longer treatment courses (10-14 days), address underlying structural or functional abnormality",
    "CAUTI: remove or replace the catheter before starting antibiotics (biofilm renders antibiotics less effective); treat only symptomatic bacteriuria (asymptomatic catheter bacteriuria is NOT treated)",
    "Asymptomatic bacteriuria: treat ONLY in pregnancy and before urologic procedures; do NOT treat in elderly, catheterised, or diabetic patients",
    "UTI in pregnancy: treat promptly with pregnancy-safe antibiotics (nitrofurantoin in first/second trimester, cephalexin, amoxicillin-clavulanate); avoid fluoroquinolones and TMP-SMX in first trimester and near term",
    "Recurrent UTI prevention: behavioural measures (adequate hydration, post-coital voiding, front-to-back wiping), prophylactic low-dose antibiotics, vaginal estrogen in postmenopausal women"
  ],
  nursingActions: [
    "Obtain proper clean-catch midstream urine specimen: educate patient on technique (cleanse periurethral area, begin voiding to flush urethral bacteria, then collect midstream portion) to avoid contamination",
    "For catheterised patients: obtain specimen from the sampling port using aseptic technique; NEVER collect from the drainage bag",
    "Assess for symptoms: dysuria, urgency, frequency, suprapubic pain (cystitis); fever, flank pain, costovertebral angle tenderness, nausea/vomiting (pyelonephritis)",
    "Implement catheter care protocols: maintain closed drainage system, keep bag below bladder level, perform daily meatal hygiene, assess daily for continued catheter necessity and advocate for early removal",
    "Administer antibiotics as prescribed; educate patient to complete the full course even if symptoms resolve",
    "Encourage adequate fluid intake (minimum 1.5-2 litres/day) to dilute urine and promote frequent voiding to flush bacteria",
    "Monitor urine characteristics: colour, clarity, odour, volume; document changes",
    "Assess elderly patients for atypical UTI presentations: confusion, agitation, falls, decreased appetite, or functional decline may be the only symptoms",
    "For pregnant patients with UTI: emphasise importance of treatment and follow-up culture as untreated UTI in pregnancy increases risk of pyelonephritis, preterm labour, and low birth weight"
  ],
  assessmentFindings: [
    "Lower UTI (cystitis): dysuria (painful burning with urination), urinary frequency and urgency, suprapubic discomfort or pressure, cloudy and/or malodorous urine, hematuria",
    "Upper UTI (pyelonephritis): all cystitis symptoms PLUS high fever (>38.5 C), rigors, unilateral or bilateral flank pain, costovertebral angle tenderness, nausea, vomiting",
    "Elderly patients: atypical presentations including new-onset confusion or delirium, behavioural changes, falls, decreased oral intake, functional decline; classic urinary symptoms may be absent",
    "Catheter-associated UTI: new fever, suprapubic tenderness, flank pain, change in urine character; note that bacteriuria alone without symptoms does NOT require treatment"
  ],
  signs: {
    left: [
      "Dysuria with urinary frequency and urgency",
      "Suprapubic tenderness",
      "Cloudy, malodorous urine",
      "Low-grade fever (cystitis)",
      "Costovertebral angle tenderness (pyelonephritis)"
    ],
    right: [
      "High fever with rigors (pyelonephritis or urosepsis)",
      "Flank pain with nausea and vomiting (upper UTI)",
      "New-onset confusion or delirium in elderly",
      "Tachycardia and hypotension (sepsis progression)",
      "Decreased urine output (renal involvement or obstruction)"
    ]
  },
  medications: [
    {
      name: "Nitrofurantoin (Macrobid)",
      type: "Urinary Antiseptic",
      action: "Concentrated in urine where it damages bacterial DNA, RNA, proteins, and cell walls through multiple mechanisms; achieves therapeutic concentrations only in the urinary tract, not in blood or tissues",
      sideEffects: "GI upset (take with food to reduce), headache; rare but serious: pulmonary fibrosis (with prolonged use >6 months), peripheral neuropathy, hepatotoxicity",
      contra: "Renal impairment with CrCl <30 (drug requires adequate renal function to concentrate in urine and is ineffective with poor renal clearance), G6PD deficiency (hemolytic anemia risk), pregnancy at term (36-42 weeks) due to risk of neonatal hemolytic anemia, pyelonephritis (does NOT achieve therapeutic tissue levels)",
      pearl: "First-line for uncomplicated cystitis; CANNOT treat pyelonephritis because it concentrates only in urine and does NOT reach therapeutic levels in renal tissue or blood; take with food to improve absorption and reduce GI effects; macrocrystalline form (Macrobid) has fewer GI side effects than microcrystalline"
    },
    {
      name: "Trimethoprim-Sulfamethoxazole (TMP-SMX, Bactrim)",
      type: "Antifolate Combination Antibiotic",
      action: "TMP and SMX block sequential steps in bacterial folic acid synthesis: SMX inhibits dihydropteroate synthase and TMP inhibits dihydrofolate reductase; the sequential blockade is synergistically bactericidal",
      sideEffects: "Rash (including Stevens-Johnson syndrome), GI upset, photosensitivity, bone marrow suppression, hyperkalemia (TMP blocks renal potassium secretion), crystalluria",
      contra: "Sulfonamide allergy, pregnancy (first trimester - neural tube defects; near term - kernicterus risk), severe hepatic or renal impairment, megaloblastic anemia from folate deficiency, G6PD deficiency",
      pearl: "First-line for uncomplicated cystitis ONLY if local E. coli resistance is less than 20%; monitor potassium in patients on ACE inhibitors/ARBs (TMP causes hyperkalemia through same mechanism as potassium-sparing diuretics); ensure adequate hydration to prevent crystalluria; avoid in pregnancy"
    },
    {
      name: "Ceftriaxone",
      type: "Third-Generation Cephalosporin",
      action: "Binds to penicillin-binding proteins (PBPs) to inhibit bacterial cell wall synthesis; broad-spectrum activity against gram-negative organisms with good tissue and renal parenchyma penetration",
      sideEffects: "Diarrhea, rash, injection site reactions, biliary sludging (pseudolithiasis - avoid concurrent calcium infusion in neonates), C. difficile-associated diarrhea, rare: hemolytic anemia",
      contra: "Severe penicillin allergy with anaphylaxis history (approximately 2% cross-reactivity), concurrent IV calcium in neonates (fatal cardiopulmonary reactions), hyperbilirubinemic neonates",
      pearl: "First-line parenteral antibiotic for pyelonephritis and complicated UTIs; single IM dose can serve as initial treatment for outpatient pyelonephritis before transitioning to oral antibiotics; safe in pregnancy; long half-life allows once-daily dosing"
    }
  ],
  pearls: [
    "Asymptomatic bacteriuria should ONLY be treated in pregnant women and patients undergoing urologic procedures - treating it in elderly or catheterised patients promotes resistance without clinical benefit",
    "Nitrofurantoin treats cystitis ONLY - it concentrates in urine but does NOT achieve therapeutic tissue levels needed to treat pyelonephritis; if a patient with a UTI develops fever and flank pain, a different antibiotic is needed",
    "Catheter-associated UTI prevention: the most effective strategy is avoiding unnecessary catheterisation and removing catheters as soon as possible; use a nurse-driven catheter removal protocol",
    "In elderly patients, new-onset confusion, agitation, or functional decline may be the ONLY signs of UTI - maintain a high index of suspicion and test urine in any elderly patient with acute behavioural changes",
    "For clean-catch specimens: educate patients thoroughly on technique; contaminated specimens lead to false positives and unnecessary antibiotic use",
    "Pregnant women should be screened for asymptomatic bacteriuria at the first prenatal visit because untreated bacteriuria progresses to pyelonephritis in 20-40% of pregnant women (vs 1-2% in non-pregnant)",
    "Cranberry products may have modest benefit in UTI prevention but are NOT treatment for active infection; evidence is strongest for recurrent UTIs in premenopausal women",
    "A negative nitrite test does NOT rule out UTI - gram-positive organisms (Enterococcus, Staphylococcus) do not convert nitrate to nitrite"
  ],
  quiz: [
    {
      question: "A nurse is caring for a patient with an indwelling urinary catheter who has bacteriuria on routine urinalysis but no symptoms. What is the appropriate action?",
      options: [
        "Start empiric antibiotics immediately to prevent progression to pyelonephritis",
        "Remove the catheter and repeat the culture in 48 hours",
        "Do not treat asymptomatic bacteriuria in catheterised patients; monitor for symptom development",
        "Irrigate the catheter with antibiotic solution to clear the bacteria"
      ],
      correct: 2,
      rationale: "Asymptomatic bacteriuria in catheterised patients should NOT be treated with antibiotics. Nearly all patients with long-term catheters develop bacteriuria, and treating it promotes antibiotic resistance without clinical benefit. Treatment is indicated only when the patient develops symptoms such as fever, flank pain, suprapubic pain, or systemic signs of infection. Catheter irrigation is not recommended for treating bacteriuria."
    },
    {
      question: "A patient is diagnosed with uncomplicated pyelonephritis. Why is nitrofurantoin NOT an appropriate antibiotic choice?",
      options: [
        "Nitrofurantoin causes severe kidney damage at high doses",
        "Nitrofurantoin only concentrates in the urine and does not reach therapeutic levels in renal tissue",
        "Nitrofurantoin is only available in IV formulation which is not needed for outpatient treatment",
        "Nitrofurantoin is not effective against E. coli, the most common UTI pathogen"
      ],
      correct: 1,
      rationale: "Nitrofurantoin achieves therapeutic concentrations only in the urine, not in blood or tissues including the renal parenchyma. Pyelonephritis involves infection of the kidney tissue, which requires an antibiotic with adequate tissue penetration such as a fluoroquinolone, TMP-SMX, or ceftriaxone. Nitrofurantoin is effective only for lower UTIs (cystitis) where its urinary concentration is therapeutic."
    },
    {
      question: "Which finding in an 85-year-old nursing home resident should prompt the nurse to assess for a urinary tract infection?",
      options: [
        "Complaint of mild constipation for 2 days",
        "Blood pressure reading of 128/78 mmHg",
        "New-onset confusion and increased agitation over the past 24 hours",
        "Decreased appetite at one meal"
      ],
      correct: 2,
      rationale: "In elderly patients, UTIs frequently present atypically without classic urinary symptoms. New-onset confusion, agitation, delirium, falls, or functional decline may be the sole presenting signs of UTI. Any acute change in mental status in an elderly patient should trigger assessment for infection, including urinalysis and urine culture."
    }
  ]
},

"hemodialysis-basics-rpn": {
  title: "Hemodialysis Basics",
  cellular: {
    title: "Pathophysiology and Principles of Hemodialysis",
    content: "Hemodialysis is a life-sustaining renal replacement therapy that performs the essential functions of the kidneys when they can no longer adequately filter blood, maintain fluid and electrolyte balance, or excrete metabolic waste products. It is indicated when the glomerular filtration rate (GFR) falls below 10-15 mL/min (end-stage renal disease, stage 5 CKD), or earlier if symptomatic uremia develops.\n\nThe kidneys normally filter approximately 180 litres of plasma daily, producing 1-2 litres of urine. They regulate fluid volume, electrolyte concentrations (sodium, potassium, calcium, phosphorus), acid-base balance, and excrete metabolic waste products (urea, creatinine, uric acid). The kidneys also produce erythropoietin (red blood cell production), activate vitamin D (calcium metabolism), and regulate blood pressure through the renin-angiotensin-aldosterone system. When these functions fail, toxic metabolites accumulate, causing the uremic syndrome.\n\nUremic syndrome manifests with multi-system dysfunction: neurological (encephalopathy, peripheral neuropathy, asterixis), cardiovascular (pericarditis, heart failure from fluid overload, accelerated atherosclerosis), haematological (anemia from erythropoietin deficiency, platelet dysfunction with bleeding tendency), gastrointestinal (nausea, vomiting, anorexia, uremic fetor - ammonia breath), dermatological (pruritus, uremic frost - urea crystal deposits on skin), and metabolic (hyperkalemia, metabolic acidosis, hyperphosphatemia, secondary hyperparathyroidism).\n\nHemodialysis operates on three physical principles. Diffusion is the primary mechanism: solutes move across the semipermeable dialysis membrane from the area of higher concentration (blood with accumulated waste) to the area of lower concentration (dialysate). The dialysate composition is specifically formulated to create favorable concentration gradients - it contains no urea or creatinine (maximising their removal from blood) and physiologic levels of electrolytes.\n\nUltrafiltration removes excess fluid by applying hydrostatic pressure across the membrane. The transmembrane pressure (TMP) is adjusted to remove the fluid volume that has accumulated between treatments (typically 2-4 litres over a 3-4 hour session). Excessive ultrafiltration rates cause intradialytic hypotension.\n\nConvection (solvent drag) occurs when water movement across the membrane carries dissolved solutes with it, contributing to removal of middle-molecular-weight substances.\n\nVascular access is critical for hemodialysis. The arteriovenous fistula (AVF) - a surgical anastomosis between a native artery and vein, typically in the forearm or upper arm - is the gold standard, offering the best long-term patency and lowest infection rates. The AVF requires 6-12 weeks to mature (arterialisation of the vein). An arteriovenous graft (AVG) uses a synthetic tube to connect artery and vein when native vessels are inadequate; it can be used within 2-4 weeks but has higher infection and thrombosis rates. Central venous catheters (tunnelled or non-tunnelled) provide immediate access but carry the highest risk of infection, thrombosis, and central vein stenosis; they are considered temporary or bridges to permanent access."
  },
  riskFactors: [
    "End-stage renal disease (stage 5 CKD with GFR <15 mL/min) from any cause: diabetes mellitus (leading cause), hypertension (second leading cause), glomerulonephritis, polycystic kidney disease",
    "Acute kidney injury unresponsive to medical management (emergent dialysis indication)",
    "Life-threatening hyperkalemia (K+ >6.5 or with ECG changes) refractory to medical therapy",
    "Severe metabolic acidosis (pH <7.1) not responding to bicarbonate therapy",
    "Volume overload with pulmonary edema refractory to diuretics",
    "Uremic pericarditis (high-risk complication requiring emergent dialysis)",
    "Uremic encephalopathy (altered mental status, asterixis, seizures)",
    "Certain drug overdoses (dialysable toxins: methanol, ethylene glycol, lithium, salicylates)"
  ],
  diagnostics: [
    "Pre-dialysis labs: BUN, creatinine, electrolytes (especially potassium), calcium, phosphorus, albumin, CBC, PTH (parathyroid hormone)",
    "Post-dialysis labs: BUN and electrolytes to calculate adequacy (Kt/V - target greater than 1.2, or URR - urea reduction ratio target >65%)",
    "Monthly monitoring: iron studies (ferritin, TSAT), lipid panel, hepatitis B and C serology annually",
    "Vascular access assessment: physical examination (thrill and bruit for AVF/AVG), duplex ultrasound for suspected stenosis or thrombosis, fistulogram if intervention needed",
    "ECG: monitor for hyperkalemia-related changes (peaked T waves, widened QRS, loss of P waves) and other cardiac abnormalities",
    "Chest X-ray: assess for fluid overload (pulmonary edema, pleural effusion), cardiac silhouette size",
    "Dialysis adequacy monitoring: Kt/V calculated regularly to ensure adequate waste clearance; inadequate dialysis increases mortality"
  ],
  management: [
    "Conventional hemodialysis: 3-4 hours per session, 3 times per week; blood flow rate 300-500 mL/min, dialysate flow 500-800 mL/min",
    "Dry weight determination: the target post-dialysis weight at which the patient is euvolemic without edema or hypotension; adjusted regularly based on clinical assessment",
    "Fluid restriction: typically 1-1.5 litres per day between dialysis sessions to limit interdialytic weight gain (target <2-3 kg between sessions)",
    "Dietary modifications: restrict potassium (2-3 g/day), phosphorus (800-1000 mg/day), sodium (2 g/day); adequate protein intake (1.2 g/kg/day - higher than pre-dialysis due to protein losses during dialysis)",
    "Medications: phosphate binders (calcium carbonate, sevelamer) taken WITH meals; erythropoiesis-stimulating agents (epoetin, darbepoetin) for renal anemia; IV iron supplementation; active vitamin D (calcitriol); antihypertensives (adjusted around dialysis schedule)",
    "Anticoagulation during dialysis: heparin to prevent clotting of the extracorporeal circuit; citrate-based anticoagulation for patients at bleeding risk",
    "Vascular access management: AVF is preferred access (plan and create early in CKD stage 4); catheter care with strict aseptic technique for central venous catheters"
  ],
  nursingActions: [
    "Pre-dialysis assessment: weight (calculate fluid removal needed), vital signs (baseline BP - hold antihypertensives per protocol if pre-dialysis BP low), vascular access assessment, review labs, assess for symptoms of uremia or fluid overload",
    "AVF/AVG assessment: auscultate for bruit (audible swooshing sound), palpate for thrill (palpable buzzing vibration), check for signs of infection (erythema, warmth, drainage), assess for steal syndrome (cool, pale hand distal to access)",
    "Protect the vascular access arm: NO blood pressure measurements, NO venipuncture, NO IV placement in the access arm; educate patient about access protection",
    "During dialysis: monitor vital signs every 15-30 minutes, assess for intradialytic hypotension (most common complication - light-headedness, nausea, cramping, diaphoresis), monitor access site for bleeding or disconnection",
    "Manage intradialytic hypotension: place patient in Trendelenburg position, administer normal saline bolus as prescribed, slow or temporarily stop ultrafiltration, reassess dry weight goal",
    "Post-dialysis: obtain standing weight, vital signs (assess for orthostatic hypotension), apply hemostasis to access sites (hold pressure for 10-20 minutes after needle removal from AVF/AVG), assess for post-dialysis disequilibrium syndrome (headache, nausea, seizures)",
    "Central venous catheter care: strict aseptic technique for all access; follow facility protocol for dressing changes, cap changes, and catheter lock solution (heparin or citrate); monitor for exit site infection and tunnel infection",
    "Educate patient on: fluid restriction management (ice chips, hard candy, mouth rinse), dietary restrictions (potassium, phosphorus, sodium), medication timing relative to dialysis, access care, recognising signs of infection, interdialytic weight gain monitoring"
  ],
  assessmentFindings: [
    "Pre-dialysis: elevated blood pressure, peripheral edema, weight gain since last treatment, dyspnea or orthopnea (fluid overload), decreased urine output or anuria",
    "Uremic symptoms: fatigue, nausea, anorexia, metallic taste, pruritus, restless legs, difficulty concentrating, uremic fetor (ammonia-like breath)",
    "Vascular access: palpable thrill and audible bruit over AVF/AVG (normal findings indicating patency); absence suggests thrombosis or stenosis",
    "Intradialytic complications: hypotension (most common), muscle cramps, nausea, headache, chest pain, air embolism (rare but life-threatening)",
    "Chronic findings: anemia-related pallor and fatigue, renal osteodystrophy (bone pain, fractures), secondary hyperparathyroidism, skin changes (yellow-grey discoloration, uremic frost in advanced cases)"
  ],
  signs: {
    left: [
      "Weight gain and edema between treatments",
      "Hypertension and dyspnea (fluid overload)",
      "Palpable thrill and audible bruit at AVF (normal patency)",
      "Fatigue and pallor (renal anemia)",
      "Pruritus and dry skin"
    ],
    right: [
      "Absent thrill/bruit at access (thrombosis - report immediately)",
      "Intradialytic hypotension (dizziness, nausea, cramping)",
      "Peaked T waves on ECG (hyperkalemia - pre-dialysis)",
      "Access site infection (erythema, purulent drainage, fever)",
      "Seizures or altered mental status (disequilibrium syndrome or uremic encephalopathy)"
    ]
  },
  medications: [
    {
      name: "Epoetin Alfa (Eprex/Epogen)",
      type: "Erythropoiesis-Stimulating Agent (ESA)",
      action: "Recombinant human erythropoietin that stimulates red blood cell production in the bone marrow by binding to erythropoietin receptors on erythroid progenitor cells, compensating for the kidney's inability to produce adequate endogenous erythropoietin",
      sideEffects: "Hypertension (most common - from increased blood viscosity and loss of hypoxia-mediated vasodilation), headache, arthralgia, pure red cell aplasia (rare - anti-erythropoietin antibodies), increased thromboembolic risk",
      contra: "Uncontrolled hypertension, pure red cell aplasia with anti-EPO antibodies, target hemoglobin above 110-120 g/L (increased cardiovascular and thromboembolic risk at higher targets)",
      pearl: "Target hemoglobin 100-115 g/L (do NOT over-correct to normal - landmark CHOIR and CREATE trials showed increased cardiovascular events and death at higher targets); ensure adequate iron stores (ferritin >200, TSAT >20%) BEFORE starting ESA as iron deficiency limits response; monitor blood pressure closely as hypertension is the most common side effect"
    },
    {
      name: "Sevelamer (Renagel/Renvela)",
      type: "Non-Calcium Phosphate Binder",
      action: "Binds dietary phosphorus in the GI tract to form an insoluble complex that is excreted in stool, preventing phosphorus absorption; reduces serum phosphorus levels without adding calcium load",
      sideEffects: "GI disturbances (nausea, constipation, diarrhea, bloating, flatulence), metabolic acidosis (sevelamer hydrochloride form), dysphagia with large tablets",
      contra: "Bowel obstruction, GI motility disorders, hypophosphatemia",
      pearl: "Must be taken WITH meals to bind dietary phosphorus - timing is critical; available as hydrochloride (Renagel) and carbonate (Renvela - preferred as does not worsen metabolic acidosis); preferred over calcium-based binders in patients at risk for vascular calcification; educate patients that this medication is useless if taken without food"
    },
    {
      name: "Calcitriol (Rocaltrol)",
      type: "Active Vitamin D (1,25-dihydroxyvitamin D3)",
      action: "The biologically active form of vitamin D; the failing kidney cannot perform the final hydroxylation step to produce calcitriol, leading to vitamin D deficiency, decreased calcium absorption, hypocalcemia, and secondary hyperparathyroidism; replacement suppresses PTH secretion and improves calcium absorption",
      sideEffects: "Hypercalcemia (most significant - monitor calcium levels closely), hyperphosphatemia (increases both calcium and phosphorus absorption), nausea, constipation, soft tissue calcification with chronically elevated calcium-phosphorus product",
      contra: "Hypercalcemia, vitamin D toxicity, hyperphosphatemia (correct phosphorus first before starting calcitriol)",
      pearl: "Correct hyperphosphatemia BEFORE starting calcitriol - high calcium-phosphorus product (>55) causes metastatic calcification in blood vessels, soft tissues, and organs; monitor serum calcium and phosphorus regularly; PTH target in dialysis patients is 150-300 pg/mL (some PTH activity is needed for bone turnover - oversuppression causes adynamic bone disease)"
    }
  ],
  pearls: [
    "NEVER take blood pressure, draw blood, or start an IV in the vascular access arm - compression can damage the fistula and cause thrombosis; educate the patient to protect their access arm at all times",
    "Absent thrill or bruit in an AVF/AVG is a sign of thrombosis and requires IMMEDIATE reporting and intervention to salvage the access",
    "Intradialytic hypotension is the most common complication: intervene with Trendelenburg position, normal saline bolus, and slowing/stopping ultrafiltration before it progresses to loss of consciousness",
    "Phosphate binders must be taken WITH meals - taking them at any other time has no effect on phosphorus levels because there is no dietary phosphorus to bind",
    "Dialysis patients are immunocompromised and at high risk for infections; catheter-related bloodstream infections are a leading cause of morbidity and mortality - strict aseptic technique for all catheter access is non-negotiable",
    "Hyperkalemia is the most immediately life-threatening electrolyte abnormality in dialysis patients between treatments - educate about potassium-rich foods to avoid (bananas, oranges, potatoes, tomatoes, salt substitutes containing KCl)",
    "Interdialytic weight gain should not exceed 2-3 kg; excessive weight gain requires high ultrafiltration rates that cause hemodynamic instability during dialysis",
    "Do NOT administer antihypertensives immediately before dialysis without checking the protocol - fluid removal during dialysis naturally lowers blood pressure, and pre-treatment antihypertensives can cause severe intradialytic hypotension"
  ],
  quiz: [
    {
      question: "A nurse assesses a patient's arteriovenous fistula before hemodialysis and cannot palpate a thrill or auscultate a bruit. What is the priority action?",
      options: [
        "Proceed with cannulation as some fistulae have weak thrills",
        "Apply warm compresses to the fistula for 15 minutes and reassess",
        "Notify the provider immediately as absent thrill and bruit indicate possible thrombosis",
        "Take the patient's blood pressure on the fistula arm to check for adequate blood flow"
      ],
      correct: 2,
      rationale: "Absent thrill and bruit in an AVF are signs of thrombosis, which is an emergency requiring immediate intervention (thrombolysis or surgical thrombectomy) to salvage the access. Attempting to cannulate a thrombosed fistula is contraindicated. Blood pressure should NEVER be taken on the access arm. Warm compresses may help with vasospasm but do not address thrombosis."
    },
    {
      question: "When should a dialysis patient take their phosphate binder medication?",
      options: [
        "First thing in the morning on an empty stomach",
        "At bedtime to work overnight",
        "With meals to bind dietary phosphorus in the GI tract",
        "Two hours before eating for maximum absorption"
      ],
      correct: 2,
      rationale: "Phosphate binders work by binding to dietary phosphorus in the GI tract, forming insoluble complexes that are excreted in stool rather than absorbed. They must be taken WITH meals when phosphorus-containing food is present. Taking them on an empty stomach or away from food provides no benefit because there is no dietary phosphorus to bind."
    },
    {
      question: "During hemodialysis, a patient complains of light-headedness, nausea, and muscle cramping. Blood pressure has dropped from 140/85 to 88/52. What should the nurse do FIRST?",
      options: [
        "Stop dialysis immediately and remove the needles",
        "Place the patient in Trendelenburg position, administer normal saline bolus, and slow the ultrafiltration rate",
        "Administer epoetin alfa to increase blood volume",
        "Increase the dialysate temperature to promote vasodilation"
      ],
      correct: 1,
      rationale: "Intradialytic hypotension is the most common complication of hemodialysis. The immediate interventions are: Trendelenburg position (increases venous return), normal saline bolus (volume expansion), and reducing or stopping ultrafiltration (decreasing fluid removal rate). Stopping dialysis entirely is not the first step. Epoetin alfa treats anemia, not acute hypotension. Increasing dialysate temperature would worsen hypotension."
    }
  ]
},

"incontinence-management-rpn": {
  title: "Urinary Incontinence Management",
  cellular: {
    title: "Pathophysiology of Urinary Incontinence",
    content: "Urinary incontinence is defined as the involuntary loss of urine that is objectively demonstrable and constitutes a social or hygienic problem. It affects an estimated 25-45% of women and 5-15% of men, with prevalence increasing significantly with age. Despite its high prevalence, incontinence is underreported because patients feel embarrassed or believe it is a normal part of aging - it is NOT.\n\nNormal continence requires intact anatomy and coordinated neurological control. The bladder detrusor muscle must relax during filling (parasympathetic inhibition, sympathetic activation via beta-3 receptors), allowing the bladder to store 300-500 mL of urine at low pressure. The internal urethral sphincter (smooth muscle at the bladder neck, sympathetic alpha-1 control) and external urethral sphincter (striated muscle, somatic pudendal nerve control) maintain closure pressure exceeding intravesical pressure. During voiding, parasympathetic activation (S2-S4, acetylcholine on muscarinic M3 receptors) contracts the detrusor while the sphincters relax coordinately.\n\nStress urinary incontinence (SUI) is the involuntary urine loss with effort, physical exertion, sneezing, or coughing. It results from weakness of the pelvic floor muscles and/or urethral sphincter mechanism, allowing urethral closure pressure to be overcome during increases in intra-abdominal pressure. Causes include pregnancy and vaginal delivery (stretching and injury to pelvic floor muscles, fascia, and pudendal nerve), menopause (estrogen deficiency causing urethral mucosal atrophy and decreased vascularity), obesity, chronic coughing, and pelvic surgery. In men, SUI occurs primarily after prostatectomy.\n\nUrge urinary incontinence (UUI, or overactive bladder) involves involuntary urine loss associated with a sudden compelling desire to void that is difficult to defer. It is caused by detrusor overactivity - involuntary detrusor contractions during the filling phase. This may be neurogenic (multiple sclerosis, Parkinson disease, spinal cord injury, stroke - loss of cortical inhibition of the micturition reflex) or idiopathic (presumed myogenic changes or sensory receptor upregulation in the bladder wall). Patients experience urgency, frequency, nocturia, and may leak before reaching the toilet.\n\nMixed urinary incontinence combines features of both stress and urge incontinence and is the most common type in older women.\n\nOverflow incontinence results from chronic urinary retention with bladder distension, causing passive leakage when intravesical pressure exceeds outlet resistance. Causes include bladder outlet obstruction (BPH in men, pelvic organ prolapse) or detrusor underactivity (diabetic neuropathy, spinal cord injury, medications with anticholinergic effects).\n\nFunctional incontinence occurs in patients with normal urinary tract function but inability to reach the toilet in time due to physical impairment (arthritis, reduced mobility), cognitive impairment (dementia), environmental barriers (bed rails, restraints, distant bathroom), or medication effects (sedation, diuretics).\n\nTransient causes of incontinence can be remembered with the mnemonic DIAPPERS: Delirium, Infection (UTI), Atrophic urethritis/vaginitis, Pharmaceuticals (diuretics, alpha-blockers, anticholinergics, sedatives), Psychological (depression, impaired motivation), Excessive urine output (hyperglycemia, heart failure, excessive fluid intake), Restricted mobility, Stool impaction (fecal impaction compresses bladder and irritates detrusor)."
  },
  riskFactors: [
    "Female sex (shorter urethra, effects of pregnancy, childbirth, and menopause on pelvic floor)",
    "Vaginal childbirth, especially multiple deliveries, large birth weight, prolonged second stage, or forceps delivery",
    "Age (pelvic floor muscle weakening, decreased tissue elasticity, neurologic changes; NOT a normal part of aging but risk increases)",
    "Menopause and estrogen deficiency (urethral mucosal atrophy reduces closure pressure)",
    "Obesity (increased intra-abdominal pressure on the bladder and pelvic floor)",
    "Prostatectomy in men (damage to external urethral sphincter during surgery)",
    "Neurological conditions: stroke, multiple sclerosis, Parkinson disease, spinal cord injury, dementia",
    "Benign prostatic hyperplasia (outlet obstruction leading to overflow incontinence)",
    "Chronic constipation and fecal impaction (direct pressure on bladder, straining weakens pelvic floor)",
    "Medications: diuretics (urgency), alpha-blockers (sphincter relaxation), anticholinergics (retention/overflow), sedatives (functional impairment)"
  ],
  diagnostics: [
    "Thorough history: type (stress vs urge vs mixed), frequency, severity, triggers (coughing, urgency, activity), fluid intake pattern, pad usage, impact on quality of life",
    "Bladder diary (voiding diary): 3-day record of fluid intake, voiding times, voided volumes, incontinence episodes, and associated activities - essential baseline assessment tool",
    "Physical examination: pelvic exam (pelvic organ prolapse assessment, cough stress test, vaginal atrophy), digital rectal exam in men (prostate assessment), neurological exam (perineal sensation, anal tone, bulbocavernosus reflex)",
    "Post-void residual (PVR) measurement: via bladder scan or catheterisation; normal is less than 50 mL; >200 mL suggests significant retention with risk of overflow incontinence",
    "Urinalysis and culture: rule out UTI as a reversible cause of urgency and incontinence",
    "Urodynamic studies: formal testing of bladder filling pressures, detrusor activity, urethral function, and voiding dynamics for complex or refractory cases",
    "Cough stress test: patient coughs with a comfortably full bladder while the examiner observes for urine leakage at the urethral meatus"
  ],
  management: [
    "Behavioural interventions (first-line for ALL types): pelvic floor muscle training (Kegel exercises), bladder training (scheduled voiding with progressive interval lengthening), prompted voiding for cognitively impaired patients, urge suppression techniques",
    "Pelvic floor muscle training (PFMT/Kegels): contract pelvic floor muscles for 5-10 seconds, relax for equal duration, repeat 10-15 times, 3 times daily; requires 6-12 weeks of consistent practice for improvement; proper technique instruction is critical",
    "Lifestyle modifications: weight loss (even 5-10% weight reduction significantly improves SUI), reduce caffeine and alcohol (bladder irritants), manage constipation, smoking cessation, adequate but not excessive fluid intake",
    "Stress incontinence medications: duloxetine (SNRI that increases urethral sphincter tone via serotonin and norepinephrine in pudendal nerve; not first-line, used when surgery declined)",
    "Urge incontinence medications: antimuscarinics/anticholinergics (oxybutynin, tolterodine, solifenacin) or beta-3 agonist (mirabegron) to relax detrusor muscle",
    "Vaginal estrogen (topical cream or ring) for postmenopausal women with urogenital atrophy contributing to SUI or UUI",
    "Surgical options for refractory SUI: midurethral sling (tension-free vaginal tape), Burch colposuspension; for men post-prostatectomy: artificial urinary sphincter",
    "Overflow incontinence: treat underlying cause (alpha-blocker or surgery for BPH, discontinue causative medications); intermittent catheterisation if detrusor underactivity is irreversible",
    "Absorbent products and external collection devices: used as adjuncts to treatment, not as sole management; properly fitted to prevent skin breakdown"
  ],
  nursingActions: [
    "Conduct thorough continence assessment: type, onset, frequency, triggers, severity, current management strategies, and impact on daily life and emotional wellbeing",
    "Implement and teach pelvic floor muscle exercises (Kegels): ensure patient can correctly identify and isolate pelvic floor muscles (stop-start urine test for identification only, not as exercise); provide written instructions and follow-up plan",
    "Establish individualised toileting programs: timed voiding (scheduled toileting every 2-3 hours during waking hours), prompted voiding for cognitively impaired patients (check, prompt, praise), bladder retraining (gradually increase intervals between voids for urge incontinence)",
    "Provide skin care: assess perineal skin at every shift, cleanse gently after each episode, apply moisture barrier cream, use appropriate absorbent products sized correctly, change wet products promptly to prevent incontinence-associated dermatitis (IAD)",
    "Administer anticholinergic medications as prescribed; monitor for side effects: dry mouth, constipation, blurred vision, urinary retention, cognitive impairment in elderly (avoid in dementia patients)",
    "Ensure environmental modifications for functional incontinence: clear path to bathroom, adequate lighting (especially at night), raised toilet seat, handrails, bedside commode if mobility limited, clothing easy to remove (elastic waistbands)",
    "Monitor post-void residual volumes for patients on anticholinergics or those at risk for retention",
    "Educate on fluid management: adequate but not excessive intake (1.5-2 litres/day), avoid caffeine, alcohol, and artificial sweeteners (bladder irritants); do NOT restrict fluid excessively as concentrated urine irritates the bladder",
    "Address psychosocial impact: incontinence causes embarrassment, social isolation, depression, and reduced quality of life; normalise the conversation, provide reassurance that effective treatments exist"
  ],
  assessmentFindings: [
    "Stress incontinence: small volume urine leakage with coughing, sneezing, laughing, lifting, or exercise; no urgency or nocturia",
    "Urge incontinence: sudden compelling urge to void with inability to reach toilet in time; large-volume leakage; urinary frequency (>8 times/day) and nocturia (>2 times/night)",
    "Mixed incontinence: features of both stress and urge",
    "Overflow incontinence: constant dribbling or frequent small-volume leakage, palpable distended bladder, weak urinary stream, incomplete emptying sensation, elevated PVR (>200 mL)",
    "Functional incontinence: normal voiding pattern when assisted to toilet; incontinence occurs due to mobility, cognitive, or environmental barriers",
    "Perineal skin assessment: redness, maceration, excoriation, or frank skin breakdown from urine contact (incontinence-associated dermatitis)"
  ],
  signs: {
    left: [
      "Urine leakage with coughing/sneezing (stress incontinence)",
      "Urgency with frequency and nocturia (urge incontinence)",
      "Perineal skin irritation or breakdown",
      "Use of absorbent pads or protective garments",
      "Social withdrawal or activity avoidance"
    ],
    right: [
      "Palpable distended bladder (overflow incontinence)",
      "Elevated post-void residual volume (>200 mL)",
      "Recurrent urinary tract infections",
      "Falls related to rushing to bathroom (urge incontinence)",
      "Cognitive impairment affecting toileting ability (functional incontinence)"
    ]
  },
  medications: [
    {
      name: "Oxybutynin (Ditropan)",
      type: "Antimuscarinic / Anticholinergic",
      action: "Blocks muscarinic M3 receptors on the detrusor muscle, inhibiting involuntary detrusor contractions during bladder filling; also has local anesthetic and antispasmodic properties on bladder smooth muscle",
      sideEffects: "Dry mouth (most common and often dose-limiting), constipation, blurred vision, drowsiness, cognitive impairment (especially in elderly - crosses blood-brain barrier), urinary retention, tachycardia, heat intolerance (reduced sweating)",
      contra: "Uncontrolled narrow-angle glaucoma (increases intraocular pressure), urinary retention, gastric retention, severe GI conditions (ulcerative colitis, toxic megacolon), myasthenia gravis, dementia or significant cognitive impairment",
      pearl: "Extended-release and transdermal formulations have significantly fewer anticholinergic side effects than immediate-release oral; AVOID in elderly patients with dementia or cognitive impairment (anticholinergics worsen cognition and are associated with increased dementia risk in Beers Criteria); dry mouth can be managed with sugar-free gum or candy"
    },
    {
      name: "Mirabegron (Myrbetriq)",
      type: "Beta-3 Adrenergic Agonist",
      action: "Stimulates beta-3 adrenergic receptors on the detrusor muscle, promoting relaxation during the filling phase; increases bladder capacity without blocking acetylcholine, providing an alternative mechanism to antimuscarinics",
      sideEffects: "Hypertension (most significant - monitor blood pressure), urinary tract infection, headache, nasopharyngitis, tachycardia",
      contra: "Severe uncontrolled hypertension (can elevate BP 1-2 mmHg on average), end-stage renal disease, severe hepatic impairment",
      pearl: "Preferred over anticholinergics in elderly patients because it does NOT cause anticholinergic side effects (no dry mouth, constipation, or cognitive impairment); can be combined with low-dose anticholinergic for refractory OAB; monitor blood pressure at baseline and periodically; swallow whole - do not crush or chew"
    },
    {
      name: "Topical Vaginal Estrogen (Estradiol Cream/Ring)",
      type: "Hormone Replacement (Local)",
      action: "Restores estrogen-dependent tissue integrity of the urethral and vaginal mucosa, increasing urethral mucosal coaptation (sealing), vascularity, and supporting tissue collagen; improves the local microbiome and reduces pH",
      sideEffects: "Vaginal irritation or discharge, breast tenderness (minimal with topical application), headache; minimal systemic absorption with local application",
      contra: "History of estrogen-dependent cancer (breast, endometrial) - requires individual risk assessment with oncologist; undiagnosed vaginal bleeding, active DVT or PE",
      pearl: "Local vaginal estrogen has minimal systemic absorption and is considered safe for most postmenopausal women including those on aromatase inhibitors (discuss with oncologist); highly effective for urogenital atrophy symptoms (dryness, dyspareunia, recurrent UTIs) and improves both stress and urge incontinence; takes 4-6 weeks for full benefit"
    }
  ],
  pearls: [
    "Urinary incontinence is NOT a normal part of aging - it always has an identifiable cause and is treatable; normalising it leads to undertreatment and reduced quality of life",
    "Use DIAPPERS mnemonic to identify reversible causes before pursuing long-term treatment: Delirium, Infection, Atrophic changes, Pharmaceuticals, Psychological, Excessive output, Restricted mobility, Stool impaction",
    "Pelvic floor muscle exercises (Kegels) are first-line for stress incontinence but require 6-12 weeks of consistent correct practice; many patients perform them incorrectly - proper instruction and follow-up are essential",
    "Avoid anticholinergic medications (oxybutynin, tolterodine) in elderly patients with dementia or cognitive impairment - they worsen cognition and are listed on the Beers Criteria as potentially inappropriate medications; use mirabegron instead",
    "Do NOT restrict fluids excessively in incontinent patients - concentrated urine irritates the bladder and worsens urgency and frequency; target 1.5-2 litres of fluid spread throughout the day",
    "Prompted voiding is evidence-based for cognitively impaired patients: check (assess for wetness), prompt (ask if they need to void), praise (positive reinforcement for staying dry and for successful toileting)",
    "Incontinence-associated dermatitis (IAD) is preventable with prompt changing of wet products, gentle cleansing, and application of moisture barrier creams - skin breakdown significantly increases infection risk and reduces quality of life",
    "Caffeine is a bladder irritant and mild diuretic that worsens urgency and frequency; reducing caffeine intake is a simple, effective first step"
  ],
  quiz: [
    {
      question: "A postmenopausal woman reports urine leakage when she coughs, sneezes, or lifts groceries. She denies urgency or frequency. What type of incontinence is this most consistent with?",
      options: [
        "Urge incontinence",
        "Stress incontinence",
        "Overflow incontinence",
        "Functional incontinence"
      ],
      correct: 1,
      rationale: "Urine leakage with activities that increase intra-abdominal pressure (coughing, sneezing, lifting) without urgency is the hallmark of stress urinary incontinence. Urge incontinence involves a sudden compelling need to void. Overflow incontinence presents with constant dribbling and bladder distension. Functional incontinence involves normal urinary function but inability to reach the toilet."
    },
    {
      question: "An 82-year-old patient with mild dementia is prescribed oxybutynin for overactive bladder. The nurse should question this order because:",
      options: [
        "Oxybutynin is not effective for overactive bladder in patients over 80",
        "Anticholinergic medications can worsen cognitive impairment in patients with dementia and are listed on the Beers Criteria",
        "Oxybutynin is only available as an IV medication not suitable for community use",
        "Patients with dementia cannot learn to take medications on schedule"
      ],
      correct: 1,
      rationale: "Anticholinergic medications like oxybutynin cross the blood-brain barrier and can significantly worsen cognitive function in patients with dementia. The Beers Criteria lists anticholinergics as potentially inappropriate medications in the elderly. Mirabegron (a beta-3 agonist) would be the preferred pharmacological option as it does not have anticholinergic cognitive effects."
    },
    {
      question: "What is the most important nursing education about pelvic floor muscle exercises for a patient with stress incontinence?",
      options: [
        "Practice stopping the urine stream as the primary exercise method",
        "Results are immediate and the patient should notice improvement within 1-2 days",
        "Consistent practice for 6-12 weeks is needed before improvement occurs, and correct technique is essential",
        "Pelvic floor exercises should only be performed while lying down"
      ],
      correct: 2,
      rationale: "Pelvic floor muscle training requires consistent practice (typically 3 sets of 10-15 contractions daily) for 6-12 weeks before significant improvement occurs. Correct muscle identification and technique are essential - many patients inadvertently contract abdominal or gluteal muscles instead. Stopping urine mid-stream should only be used briefly for muscle identification, not as an exercise. Exercises can be performed in any position."
    }
  ]
},

"diabetic-nephropathy-rpn": {
  title: "Diabetic Nephropathy",
  cellular: {
    title: "Pathophysiology of Diabetic Nephropathy",
    content: "Diabetic nephropathy (diabetic kidney disease) is a progressive kidney disease caused by chronic hyperglycemia and its downstream metabolic and hemodynamic effects. It is the leading cause of end-stage renal disease (ESRD) in developed countries, affecting 20-40% of patients with diabetes, and significantly increases cardiovascular morbidity and mortality.\n\nThe pathogenesis begins with glomerular hyperfiltration. In the early stages of diabetes, chronic hyperglycemia increases renal blood flow and glomerular filtration rate (GFR) by 20-50% above normal. This hyperfiltration is driven by afferent arteriolar vasodilation (from glucose-mediated nitric oxide release and prostaglandins), efferent arteriolar vasoconstriction (from angiotensin II), and tubuloglomerular feedback disruption (glucose and sodium co-absorption in the proximal tubule reduces sodium delivery to the macula densa, triggering afferent dilation). The result is increased intraglomerular pressure that damages the filtration barrier over time.\n\nHyperglycemia directly damages glomerular cells through several mechanisms. Advanced glycation end-products (AGEs) form when glucose non-enzymatically binds to proteins, lipids, and nucleic acids, creating cross-linked modified proteins that activate inflammatory pathways. The polyol pathway converts excess glucose to sorbitol via aldose reductase, causing osmotic cellular stress. Protein kinase C (PKC) activation stimulates production of transforming growth factor-beta (TGF-beta), vascular endothelial growth factor (VEGF), and extracellular matrix proteins. Oxidative stress from mitochondrial superoxide production compounds the damage.\n\nThese mechanisms converge to cause progressive structural changes. The glomerular basement membrane thickens, reducing its filtration efficiency. Mesangial expansion occurs as matrix proteins accumulate, compressing capillary loops and reducing the filtration surface area. Eventually, nodular glomerulosclerosis develops (Kimmelstiel-Wilson nodules, pathognomonic for diabetic nephropathy). Tubulointerstitial fibrosis and arteriolar hyalinosis accompany the glomerular changes.\n\nClinically, diabetic nephropathy progresses through five stages. Stage 1 is hyperfiltration with elevated GFR and normal albumin excretion. Stage 2 is a silent phase with normal GFR and albumin but progressive structural damage. Stage 3 is incipient nephropathy marked by microalbuminuria (albumin excretion 30-300 mg/day or albumin-to-creatinine ratio 3-30 mg/mmol), the earliest clinically detectable sign. Stage 4 is overt nephropathy with macroalbuminuria (>300 mg/day) and declining GFR. Stage 5 is ESRD requiring renal replacement therapy.\n\nMicroalbuminuria is not only a marker of kidney damage but also a powerful independent predictor of cardiovascular disease. Endothelial dysfunction underlying albuminuria also promotes systemic atherosclerosis, explaining why diabetic nephropathy dramatically increases cardiovascular mortality even in early stages."
  },
  riskFactors: [
    "Poorly controlled diabetes (chronically elevated HbA1c above 7% is the strongest modifiable risk factor)",
    "Duration of diabetes (typically develops after 10-15 years of type 1 diabetes; may be present at diagnosis in type 2 due to preceding years of undiagnosed hyperglycemia)",
    "Uncontrolled hypertension (accelerates GFR decline; often coexists as both cause and consequence of nephropathy)",
    "Genetic predisposition and family history of diabetic nephropathy or ESRD",
    "African American, Hispanic, and Indigenous populations have higher rates",
    "Smoking (accelerates vascular damage and GFR decline)",
    "Obesity and dyslipidemia (contribute to glomerular hyperfiltration and vascular damage)",
    "Concurrent use of nephrotoxic agents (NSAIDs, contrast media, aminoglycosides)",
    "Type 1 diabetes (30-40% develop nephropathy) and type 2 diabetes (20-30%)"
  ],
  diagnostics: [
    "Urine albumin-to-creatinine ratio (UACR): preferred screening test; microalbuminuria (3-30 mg/mmol or 30-300 mg/g) is the earliest clinical marker; requires confirmation on 2 of 3 specimens over 3-6 months",
    "Estimated GFR (eGFR): calculated from serum creatinine using CKD-EPI formula; stages CKD severity (stage 1: >90, stage 2: 60-89, stage 3: 30-59, stage 4: 15-29, stage 5: <15 mL/min)",
    "Serum creatinine: rises as GFR declines but is a LATE marker - significant kidney damage occurs before creatinine rises above normal range",
    "HbA1c: assesses glycemic control over the preceding 2-3 months; target <7% for most patients to prevent progression",
    "Lipid panel: dyslipidemia is common and contributes to cardiovascular risk",
    "Blood pressure monitoring: target <130/80 mmHg in patients with albuminuria",
    "Annual screening: all type 1 diabetics starting 5 years after diagnosis; all type 2 diabetics from the time of diagnosis; screen with UACR and eGFR annually"
  ],
  management: [
    "Glycemic control: target HbA1c less than 7% for most patients; intensive control in early disease slows progression; adjust hypoglycemic agents as GFR declines (metformin contraindicated below eGFR 30; many oral agents require dose adjustment or discontinuation)",
    "Blood pressure control: ACE inhibitor or ARB is first-line (renoprotective beyond blood pressure lowering); target less than 130/80 mmHg; avoid combining ACE inhibitor + ARB (increased adverse events without benefit)",
    "SGLT2 inhibitors (empagliflozin, dapagliflozin, canagliflozin): now a cornerstone of management; reduce intraglomerular pressure by restoring tubuloglomerular feedback, reduce proteinuria, slow GFR decline, and provide cardiovascular benefit; recommended for eGFR >20 with albuminuria regardless of diabetes type",
    "Finerenone (non-steroidal mineralocorticoid receptor antagonist): additional renoprotective and cardiovascular benefit when added to ACE/ARB + SGLT2 inhibitor; monitor potassium closely",
    "Lipid management: statin therapy for cardiovascular risk reduction",
    "Dietary modifications: moderate protein restriction (0.8 g/kg/day) may slow progression; sodium restriction (<2 g/day) to support blood pressure control",
    "Avoid nephrotoxins: minimise NSAID use, ensure adequate hydration with contrast procedures, avoid aminoglycosides when possible",
    "Smoking cessation: smoking accelerates decline in renal function",
    "Preparation for renal replacement therapy: begin planning for dialysis access or transplant evaluation when eGFR approaches 20 mL/min"
  ],
  nursingActions: [
    "Monitor and educate about glycemic control: blood glucose monitoring, HbA1c targets, medication adherence, recognition of hypoglycemia (risk increases as kidney function declines because insulin clearance decreases)",
    "Monitor blood pressure at every visit: target <130/80 mmHg; educate on home blood pressure monitoring technique",
    "Administer and educate about ACE inhibitors/ARBs: take consistently, report persistent dry cough (ACE inhibitor side effect, switch to ARB), recognise signs of hyperkalemia (muscle weakness, palpitations), avoid pregnancy (teratogenic)",
    "Monitor renal function trends: track eGFR and UACR at recommended intervals; educate patient that these numbers tell us how the kidneys are performing over time",
    "Assess for edema: peripheral edema, periorbital edema (nephrotic syndrome in advanced nephropathy), daily weights, fluid balance",
    "Medication review: identify and flag nephrotoxic medications, adjust medication doses for renal impairment, ensure dose adjustments for diabetes medications as eGFR changes (especially metformin, sulfonylureas)",
    "Educate about dietary modifications in collaboration with dietitian: sodium restriction, moderate protein intake, potassium management as disease progresses",
    "Screen for and manage cardiovascular risk factors: diabetic nephropathy dramatically increases cardiovascular mortality; ensure lipid management, smoking cessation, and physical activity",
    "Foot care and eye care reminders: diabetic nephropathy often coexists with retinopathy and neuropathy; ensure all diabetic complications are being screened"
  ],
  assessmentFindings: [
    "Often asymptomatic in early stages - detected only through screening (microalbuminuria and eGFR)",
    "Peripheral edema, initially dependent (ankles, feet) progressing to generalised (periorbital, sacral, anasarca in nephrotic-range proteinuria)",
    "Hypertension (both a cause and consequence of nephropathy; often difficult to control)",
    "Foamy or frothy urine (proteinuria - protein creates a bubbly appearance in the toilet)",
    "Fatigue and reduced exercise tolerance (anemia from erythropoietin deficiency in advanced disease)",
    "Nausea, decreased appetite, metallic taste (uremic symptoms in late-stage disease)",
    "Pruritus (phosphorus retention in advanced CKD)",
    "Evidence of other diabetic complications: retinopathy on fundoscopic exam, peripheral neuropathy, peripheral vascular disease"
  ],
  signs: {
    left: [
      "Microalbuminuria on screening (earliest detectable sign)",
      "Elevated blood pressure",
      "Peripheral edema",
      "Declining eGFR on serial monitoring",
      "Foamy urine (proteinuria)"
    ],
    right: [
      "Nephrotic syndrome (massive proteinuria, hypoalbuminemia, hyperlipidemia, anasarca)",
      "Uremic symptoms (nausea, encephalopathy, pericarditis - advanced disease)",
      "Severe anemia (erythropoietin deficiency)",
      "Hyperkalemia (dangerous in advanced CKD + ACE inhibitor/ARB use)",
      "Pulmonary edema from fluid overload"
    ]
  },
  medications: [
    {
      name: "Ramipril (ACE Inhibitor)",
      type: "Angiotensin-Converting Enzyme Inhibitor",
      action: "Blocks conversion of angiotensin I to angiotensin II; dilates efferent arteriole preferentially, reducing intraglomerular pressure and proteinuria independently of its blood pressure-lowering effect; also reduces aldosterone secretion and bradykinin degradation",
      sideEffects: "Dry cough (10-15%, from bradykinin accumulation in lungs), hyperkalemia (reduced aldosterone), dizziness, hypotension, acute kidney injury (in bilateral renal artery stenosis), angioedema (rare but potentially fatal)",
      contra: "Pregnancy (teratogenic - causes fetal renal agenesis, oligohydramnios), bilateral renal artery stenosis, history of angioedema with ACE inhibitor, hyperkalemia >5.5 mEq/L",
      pearl: "Renoprotective INDEPENDENT of blood pressure effect: reduces proteinuria by 30-40% and slows GFR decline; expect a mild rise in creatinine (up to 30%) when starting - this is acceptable and reflects reduced intraglomerular pressure, not renal damage; monitor potassium and creatinine at 1-2 weeks after initiation or dose change"
    },
    {
      name: "Empagliflozin (Jardiance)",
      type: "SGLT2 Inhibitor",
      action: "Blocks sodium-glucose co-transporter 2 in the proximal tubule, preventing glucose and sodium reabsorption; reduces tubuloglomerular feedback-mediated afferent arteriolar dilation, lowering intraglomerular pressure; also provides glucosuria-mediated glucose lowering, natriuresis, and osmotic diuresis",
      sideEffects: "Genital yeast infections (most common, especially in women), urinary tract infections, volume depletion with hypotension, euglycemic diabetic ketoacidosis (rare but serious - can occur without significant hyperglycemia), Fournier gangrene (rare necrotising fasciitis of perineum)",
      contra: "Type 1 diabetes (increased DKA risk), eGFR <20 mL/min (for initiation; can be continued if already started), severe hepatic impairment, dialysis",
      pearl: "Landmark EMPA-REG and CREDENCE trials showed significant renal and cardiovascular benefits; now recommended for ALL patients with diabetic nephropathy (albuminuria + eGFR >20) regardless of glycemic status; expect an initial GFR dip of 3-5 mL/min (hemodynamic, not structural - reflects reduced intraglomerular pressure, similar to ACE inhibitor initiation); educate about genital hygiene to prevent yeast infections"
    },
    {
      name: "Finerenone (Kerendia)",
      type: "Non-Steroidal Mineralocorticoid Receptor Antagonist (MRA)",
      action: "Selectively blocks mineralocorticoid receptor (MR) activation in the kidney and heart; reduces MR-mediated inflammation and fibrosis in the kidney that contributes to progressive nephropathy; more selective than spironolactone with fewer sexual side effects",
      sideEffects: "Hyperkalemia (most significant - requires monitoring), hypotension, hyponatremia",
      contra: "Severe hepatic impairment, concurrent strong CYP3A4 inhibitors, adrenal insufficiency, concomitant use with other MRAs, potassium >5.0 mEq/L at initiation, eGFR <25 mL/min",
      pearl: "FIDELIO-DKD and FIGARO-DKD trials demonstrated additional renal and cardiovascular benefit when added to ACE/ARB therapy; the triple combination (ACE/ARB + SGLT2 inhibitor + finerenone) is the emerging standard; hyperkalemia risk requires monitoring at baseline, 1 month, then periodically; avoid potassium supplements and potassium-rich diet"
    }
  ],
  pearls: [
    "Microalbuminuria (UACR 3-30 mg/mmol) is the EARLIEST detectable sign of diabetic nephropathy and also predicts cardiovascular disease - annual screening is mandatory for all diabetic patients",
    "ACE inhibitors/ARBs are renoprotective even in normotensive patients with diabetic nephropathy - they are prescribed for their proteinuria-reducing and renoprotective effects, not just blood pressure control",
    "Expect a mild creatinine rise (up to 30%) when starting ACE inhibitor, ARB, or SGLT2 inhibitor - this reflects beneficial reduction in intraglomerular pressure and should NOT lead to discontinuation",
    "As kidney function declines, insulin clearance decreases and hypoglycemia risk INCREASES - patients may paradoxically need LESS insulin or oral hypoglycemic medication as nephropathy worsens",
    "SGLT2 inhibitors have transformed diabetic nephropathy management with proven renal and cardiovascular benefits; they should be offered to all eligible patients with albuminuria and eGFR >20",
    "Serum creatinine is a LATE marker of kidney damage - significant nephron loss (50%) occurs before creatinine rises above the normal range; this is why screening with UACR and eGFR is essential",
    "Do NOT combine ACE inhibitor + ARB (dual RAAS blockade) - the ONTARGET trial showed increased hyperkalemia, acute kidney injury, and hypotension without additional renal benefit",
    "Diabetic nephropathy rarely occurs in isolation - always screen for concurrent retinopathy (present in 90% of type 1 and 60% of type 2 patients with nephropathy) and neuropathy"
  ],
  quiz: [
    {
      question: "A patient with type 2 diabetes has a urine albumin-to-creatinine ratio (UACR) of 15 mg/mmol (normal <3) and blood pressure of 128/78 mmHg. Which medication should the nurse anticipate being prescribed?",
      options: [
        "Furosemide for blood pressure control",
        "An ACE inhibitor for renoprotection regardless of blood pressure",
        "A calcium channel blocker as first-line antihypertensive",
        "No medication needed as blood pressure is below 130/80"
      ],
      correct: 1,
      rationale: "ACE inhibitors (or ARBs) are indicated for ALL diabetic patients with microalbuminuria, even if blood pressure is within normal range. Their renoprotective effect (reducing intraglomerular pressure and proteinuria) is independent of blood pressure lowering. The UACR of 15 mg/mmol confirms microalbuminuria (stage 3 nephropathy), and early intervention slows progression to overt nephropathy."
    },
    {
      question: "Two weeks after starting an ACE inhibitor, a patient's serum creatinine rises from 110 to 135 umol/L (a 23% increase). What is the appropriate nursing action?",
      options: [
        "Hold the medication and report the creatinine rise as a sign of acute kidney injury",
        "Recognise that a creatinine rise up to 30% is expected and reflects beneficial reduction in intraglomerular pressure; continue monitoring",
        "Double the ACE inhibitor dose to provide further renal protection",
        "Switch immediately to a calcium channel blocker"
      ],
      correct: 1,
      rationale: "A mild creatinine rise of up to 30% after starting an ACE inhibitor is expected and reflects the desired hemodynamic effect of reducing intraglomerular pressure (efferent arteriolar dilation). This is NOT acute kidney injury and should NOT lead to discontinuation. If the rise exceeds 30% or potassium rises above 5.5, then the medication should be held and the prescriber notified. Continue monitoring creatinine and potassium."
    },
    {
      question: "Which screening tests should be performed annually for ALL patients with diabetes to detect early nephropathy?",
      options: [
        "24-hour urine collection and renal ultrasound",
        "Serum creatinine and urine albumin-to-creatinine ratio (UACR)",
        "Serum BUN and urinalysis dipstick only",
        "Kidney biopsy and CT scan"
      ],
      correct: 1,
      rationale: "Annual screening with UACR (to detect microalbuminuria) and serum creatinine (to calculate eGFR) is recommended for all patients with diabetes - type 1 starting 5 years after diagnosis, type 2 from diagnosis. Microalbuminuria is the earliest detectable marker. A 24-hour urine collection is less practical and the spot UACR is an acceptable substitute. Kidney biopsy is not a screening test."
    }
  ]
}

};

let injected = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
}
console.log(`\nDone: injected ${injected}/${Object.keys(lessons).length} lessons`);
