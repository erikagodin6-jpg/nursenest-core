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
  "renal-artery-stenosis-rpn": {
    title: "Renal Artery Stenosis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Renovascular Hypertension",
      content: "Renal artery stenosis (RAS) is the narrowing of one or both renal arteries, reducing blood flow to the kidney and triggering a cascade of hormonal responses that produce secondary hypertension. The two primary etiologies are atherosclerotic disease (approximately 90% of cases, predominantly affecting older adults with cardiovascular risk factors) and fibromuscular dysplasia (FMD, approximately 10% of cases, predominantly affecting younger women aged 15 to 50). In atherosclerotic RAS, lipid-laden plaques accumulate in the proximal one-third of the renal artery, progressively narrowing the lumen and reducing perfusion pressure to the glomerulus. In fibromuscular dysplasia, the arterial wall develops alternating areas of thickened and thinned media, producing a characteristic string-of-beads appearance on angiography; the lesion most commonly affects the middle and distal segments of the renal artery. When renal perfusion drops below a critical threshold, the juxtaglomerular cells in the afferent arteriole sense decreased stretch and reduced sodium chloride delivery to the macula densa, triggering renin release. Renin cleaves angiotensinogen (produced by the liver) into angiotensin I, which is then converted to angiotensin II by angiotensin-converting enzyme (ACE) in the pulmonary vasculature. Angiotensin II is a potent vasoconstrictor that directly raises systemic blood pressure by increasing peripheral vascular resistance. It also stimulates the adrenal cortex to release aldosterone, which promotes sodium and water reabsorption in the distal tubule and collecting duct, expanding intravascular volume and further elevating blood pressure. This pathological activation of the renin-angiotensin-aldosterone system (RAAS) produces renovascular hypertension that is characteristically resistant to standard antihypertensive therapy. Over time, the ischemic kidney undergoes progressive nephron loss, tubular atrophy, and interstitial fibrosis, leading to ischemic nephropathy with declining glomerular filtration rate. The contralateral kidney, if unaffected, initially compensates by increasing filtration but eventually suffers damage from chronic exposure to elevated systemic pressures. Clinical suspicion for RAS should arise when a patient presents with severe hypertension before age 30 or after age 55, hypertension resistant to three or more antihypertensive medications, an abdominal bruit on auscultation, recurrent flash pulmonary edema, or acute kidney injury following initiation of ACE inhibitor or angiotensin receptor blocker therapy. The practical nurse plays a critical role in accurate blood pressure monitoring, medication administration, recognizing signs of worsening renal function, and reporting changes in condition to the registered nurse or physician."
    },
    riskFactors: [
      "Atherosclerosis (most common cause; shares risk factors with coronary and peripheral artery disease)",
      "Age over 55 years (atherosclerotic RAS increases with advancing age)",
      "Smoking (accelerates atherosclerotic plaque formation and endothelial damage)",
      "Diabetes mellitus (promotes vascular endothelial dysfunction and accelerated atherosclerosis)",
      "Hyperlipidemia (elevated LDL cholesterol contributes to plaque development in renal arteries)",
      "Female sex aged 15 to 50 (fibromuscular dysplasia predominantly affects younger women)",
      "History of peripheral artery disease or coronary artery disease (systemic atherosclerosis often involves renal arteries)"
    ],
    diagnostics: [
      "Renal artery duplex ultrasound: first-line non-invasive screening test; measures peak systolic velocity in renal arteries; velocity greater than 200 cm/s suggests significant stenosis (greater than 60%); also assesses renal size asymmetry (difference greater than 1.5 cm suggests chronic ischemic nephropathy)",
      "CT angiography (CTA) of renal arteries: provides detailed anatomical visualization of stenosis location and severity; requires iodinated contrast (check renal function and allergy history before procedure); sensitivity 94-96%",
      "Magnetic resonance angiography (MRA) with gadolinium: alternative to CTA for patients with contrast allergy or borderline renal function; can demonstrate the string-of-beads pattern of FMD; avoid gadolinium if GFR less than 30 mL/min (risk of nephrogenic systemic fibrosis)",
      "Plasma renin activity and aldosterone level: elevated renin suggests RAAS activation from renal ischemia; helps confirm renovascular etiology",
      "Basic metabolic panel (BMP): serum creatinine and BUN to assess baseline renal function; rising creatinine after starting ACE inhibitor or ARB is a hallmark finding suggesting bilateral RAS or stenosis to a solitary kidney",
      "Catheter-based renal angiography: gold standard for definitive diagnosis and allows simultaneous intervention (angioplasty with stenting); reserved for cases where non-invasive studies are inconclusive or intervention is planned"
    ],
    management: [
      "Medical management is first-line for atherosclerotic RAS: antihypertensive therapy targeting blood pressure below 140/90 mmHg (or below 130/80 mmHg if diabetic or CKD present)",
      "Percutaneous transluminal renal angioplasty (PTRA) with stenting: primary intervention for FMD (excellent outcomes with angioplasty alone); considered for atherosclerotic RAS when blood pressure is refractory to optimal medical therapy or renal function is declining",
      "Surgical revascularization (aortorenal bypass): reserved for complex anatomical situations not amenable to percutaneous intervention",
      "Smoking cessation: critical to slow atherosclerotic progression; provide cessation resources and support",
      "Lipid-lowering therapy with statins: reduces cardiovascular risk and may slow plaque progression in atherosclerotic RAS",
      "Monitor renal function closely (serum creatinine, BUN, GFR) at baseline and regularly during antihypertensive therapy, especially after initiating or adjusting ACE inhibitors or ARBs",
      "Strict glycemic control in diabetic patients to reduce microvascular and macrovascular complications"
    ],
    nursingActions: [
      "Monitor blood pressure in both arms at each assessment (asymmetry may indicate aortic or subclavian disease); document readings accurately and report systolic pressure greater than 180 mmHg or diastolic greater than 120 mmHg immediately",
      "Auscultate the abdomen for renal artery bruits (high-pitched systolic-diastolic murmur heard in the epigastric or flank region); document and report new or changing bruits",
      "Monitor intake and output strictly; report urine output less than 30 mL/hour or significant changes in fluid balance",
      "Administer antihypertensive medications as prescribed; hold medication and notify physician if systolic blood pressure is below 90 mmHg or heart rate is below 60 bpm (unless otherwise ordered)",
      "Monitor serum creatinine and potassium levels; report rising creatinine (greater than 30% increase from baseline after starting ACE inhibitor/ARB) or hyperkalemia (potassium greater than 5.5 mEq/L) immediately",
      "Assess for signs of flash pulmonary edema: sudden onset dyspnea, orthopnea, bilateral crackles, pink frothy sputum; report immediately as this is a hallmark presentation of bilateral RAS",
      "Reinforce dietary education as delegated: sodium restriction (less than 2 g/day), heart-healthy diet, adequate hydration unless fluid-restricted"
    ],
    assessmentFindings: [
      "Severe hypertension resistant to three or more antihypertensive medications at optimal doses (treatment-resistant hypertension)",
      "Abdominal bruit: high-pitched systolic or continuous murmur auscultated in the epigastric region or flanks, heard in approximately 40% of patients with significant RAS",
      "Asymmetric kidney size on imaging: the ischemic kidney is typically smaller (difference greater than 1.5 cm) due to chronic hypoperfusion and nephron loss",
      "Flash pulmonary edema: sudden-onset severe dyspnea with bilateral crackles and hypoxia, often occurring with bilateral RAS or stenosis to a solitary kidney",
      "Acute kidney injury following initiation of ACE inhibitor or ARB therapy: creatinine rises greater than 30% because these drugs reduce efferent arteriolar tone, further decreasing glomerular filtration in the stenotic kidney",
      "Hypokalemia (from secondary hyperaldosteronism) or hyperkalemia (if on ACE inhibitor/ARB with declining renal function)",
      "Peripheral edema and weight gain from sodium and water retention secondary to aldosterone excess"
    ],
    signs: {
      left: [
        "Elevated blood pressure readings despite medication compliance",
        "Mild peripheral edema (ankles and feet)",
        "Fatigue and exercise intolerance",
        "Headache related to hypertension",
        "Mild increase in serum creatinine from baseline",
        "Abdominal bruit on auscultation"
      ],
      right: [
        "Blood pressure greater than 180/120 mmHg (hypertensive crisis)",
        "Flash pulmonary edema (sudden dyspnea, crackles, pink frothy sputum)",
        "Acute kidney injury (oliguria, rapidly rising creatinine)",
        "Severe hyperkalemia (potassium greater than 6.0 mEq/L with ECG changes)",
        "Hypertensive encephalopathy (severe headache, confusion, vision changes, seizures)",
        "Signs of end-organ damage (chest pain, visual disturbances, altered mental status)"
      ]
    },
    medications: [
      {
        name: "Amlodipine (Norvasc)",
        type: "Calcium channel blocker (dihydropyridine)",
        action: "Blocks L-type calcium channels in vascular smooth muscle cells, reducing intracellular calcium concentration and producing arterial vasodilation. This decreases peripheral vascular resistance and lowers blood pressure without significantly affecting cardiac conduction. Amlodipine is preferred in renovascular hypertension because it does not depend on RAAS modulation and does not carry the risk of acute kidney injury seen with ACE inhibitors in bilateral RAS.",
        sideEffects: "Peripheral edema (dose-dependent, occurs in up to 10% of patients), headache, flushing, dizziness, palpitations, fatigue",
        contra: "Severe aortic stenosis; cardiogenic shock; unstable angina (for immediate-release formulations); known hypersensitivity",
        pearl: "Amlodipine has a long half-life (30-50 hours) allowing once-daily dosing; peripheral edema is a pharmacological effect (arteriolar dilation) not fluid overload -- it does not respond to diuretics; start at 5 mg daily and titrate to 10 mg based on blood pressure response"
      },
      {
        name: "Lisinopril (Zestril/Prinivil)",
        type: "Angiotensin-converting enzyme (ACE) inhibitor",
        action: "Blocks the conversion of angiotensin I to angiotensin II by inhibiting ACE, reducing vasoconstriction and aldosterone secretion. This lowers blood pressure and reduces afterload. In the kidney, ACE inhibitors dilate the efferent arteriole more than the afferent, reducing intraglomerular pressure and providing renoprotective effects in diabetic nephropathy and proteinuric kidney disease.",
        sideEffects: "Dry persistent cough (due to bradykinin accumulation, occurs in 5-20% of patients), hyperkalemia, dizziness, hypotension (especially first dose), angioedema (rare but life-threatening), acute kidney injury in bilateral RAS",
        contra: "Bilateral renal artery stenosis or stenosis to a solitary kidney (risk of acute kidney failure); pregnancy (teratogenic, especially second and third trimesters); history of angioedema with ACE inhibitor use; concurrent use with aliskiren in diabetic patients",
        pearl: "CRITICAL: Monitor serum creatinine 1-2 weeks after initiation or dose increase -- a rise greater than 30% from baseline suggests bilateral RAS and requires immediate medication discontinuation and physician notification; monitor potassium levels closely as ACE inhibitors reduce aldosterone and can cause hyperkalemia"
      },
      {
        name: "Aspirin (ASA)",
        type: "Antiplatelet agent (cyclooxygenase inhibitor)",
        action: "Irreversibly acetylates cyclooxygenase-1 (COX-1) in platelets, blocking the formation of thromboxane A2 and inhibiting platelet aggregation for the lifespan of the platelet (7-10 days). In atherosclerotic RAS, aspirin reduces the risk of thrombus formation at the site of stenotic plaques and decreases overall cardiovascular morbidity and mortality.",
        sideEffects: "GI irritation and bleeding (dyspepsia, gastritis, peptic ulcer), increased bleeding risk, tinnitus at high doses, Reye syndrome in children with viral illness",
        contra: "Active GI bleeding or peptic ulcer disease; aspirin allergy or aspirin-exacerbated respiratory disease; bleeding disorders; children under 18 years with viral illness (Reye syndrome risk); concurrent use with methotrexate at high doses",
        pearl: "Low-dose aspirin (81 mg daily) is recommended for cardiovascular risk reduction in atherosclerotic RAS; administer with food or enteric-coated formulation to reduce GI irritation; hold aspirin 7-10 days before elective surgery as directed; monitor for signs of bleeding (black tarry stools, bruising, prolonged bleeding from cuts)"
      }
    ],
    pearls: [
      "Suspect renal artery stenosis when hypertension is severe, onset before age 30 (think FMD) or after age 55 (think atherosclerotic), or resistant to three or more medications at optimal doses",
      "An abdominal bruit is present in approximately 40% of patients with hemodynamically significant RAS -- always auscultate the epigastric and flank regions during assessment of hypertensive patients",
      "A rise in serum creatinine greater than 30% after starting an ACE inhibitor or ARB is a hallmark finding suggesting bilateral RAS or stenosis to a solitary kidney -- stop the medication and notify the physician immediately",
      "Flash pulmonary edema (sudden-onset severe respiratory distress without clear cardiac cause) in a hypertensive patient should raise suspicion for bilateral RAS -- this is a medical emergency requiring immediate intervention",
      "Fibromuscular dysplasia produces a characteristic string-of-beads appearance on angiography and responds well to balloon angioplasty alone (without stenting), with cure rates of 50-60% for hypertension",
      "Atherosclerotic RAS is often managed medically because clinical trials (ASTRAL, CORAL) showed no significant benefit of stenting over optimal medical therapy in most patients",
      "Monitor blood pressure in both arms at every visit -- a difference greater than 15 mmHg between arms may indicate additional vascular disease (subclavian stenosis or aortic coarctation)"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 62-year-old patient with newly diagnosed renal artery stenosis. The physician starts lisinopril 10 mg daily. Two weeks later, laboratory results show serum creatinine has increased from 1.2 mg/dL to 1.8 mg/dL (a 50% increase). What is the priority nursing action?",
        options: [
          "Continue the medication and recheck creatinine in one month",
          "Hold the medication and report the creatinine increase to the physician immediately",
          "Encourage the patient to increase fluid intake to flush the kidneys",
          "Administer an additional dose of lisinopril to improve renal blood flow"
        ],
        correct: 1,
        rationale: "A rise in serum creatinine greater than 30% after starting an ACE inhibitor is a hallmark finding suggesting bilateral renal artery stenosis or stenosis to a solitary kidney. The medication should be held immediately and the physician notified because continued use can lead to acute kidney failure. ACE inhibitors dilate the efferent arteriole, further reducing glomerular filtration pressure in a kidney already compromised by stenosis."
      },
      {
        question: "During an assessment of a hypertensive patient, the practical nurse auscultates a high-pitched continuous murmur in the epigastric region. This finding is most consistent with which condition?",
        options: [
          "Aortic valve stenosis",
          "Renal artery stenosis (abdominal bruit)",
          "Mitral valve prolapse",
          "Abdominal aortic aneurysm"
        ],
        correct: 1,
        rationale: "A high-pitched systolic or continuous murmur (bruit) auscultated in the epigastric or flank region is a characteristic finding in renal artery stenosis, caused by turbulent blood flow through the narrowed renal artery. This finding is present in approximately 40% of patients with hemodynamically significant stenosis and warrants further diagnostic evaluation."
      },
      {
        question: "A practical nurse is caring for a patient with bilateral renal artery stenosis who presents with sudden-onset severe dyspnea, bilateral crackles, and pink frothy sputum. Which condition does this presentation most likely represent?",
        options: [
          "Community-acquired pneumonia",
          "Chronic obstructive pulmonary disease exacerbation",
          "Flash pulmonary edema",
          "Pulmonary embolism"
        ],
        correct: 2,
        rationale: "Flash pulmonary edema is a hallmark presentation of bilateral renal artery stenosis. Impaired renal perfusion activates the RAAS, causing massive sodium and water retention and rapid fluid accumulation in the lungs. This presents with sudden-onset severe dyspnea, bilateral crackles, and pink frothy sputum, and constitutes a medical emergency requiring immediate intervention."
      }
    ]
  },

  "renal-calculi-types-rpn": {
    title: "Renal Calculi Types and Management for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Kidney Stone Formation",
      content: "Renal calculi (kidney stones or nephrolithiasis) form when dissolved minerals and salts in the urine crystallize and aggregate into solid masses within the renal collecting system. Stone formation occurs when urine becomes supersaturated with stone-forming substances, meaning the concentration of dissolved solutes exceeds the capacity of the urine to keep them in solution. This supersaturation is influenced by three factors: increased excretion of stone-forming substances (calcium, oxalate, uric acid, cystine), decreased urine volume (concentrated urine), and decreased levels of crystallization inhibitors (citrate, magnesium, pyrophosphate). There are four major types of renal calculi, each with distinct composition, etiology, and management. Calcium stones are the most common (approximately 80% of all stones) and occur in two forms: calcium oxalate (the most frequent subtype, often associated with hypercalciuria, hyperoxaluria, or hypocitraturia) and calcium phosphate (associated with renal tubular acidosis and hyperparathyroidism). Calcium oxalate stones are hard, irregular, and radiopaque on imaging. Uric acid stones (approximately 5-10% of stones) form in persistently acidic urine (pH below 5.5) and are associated with gout, high purine diets, metabolic syndrome, and conditions producing high cell turnover (tumor lysis syndrome). Uric acid stones are unique because they are radiolucent (invisible on plain X-ray) but visible on CT scan, and they can be dissolved by alkalinizing the urine to pH 6.5-7.0. Struvite stones (approximately 10-15%, also called infection stones or triple phosphate stones) are composed of magnesium ammonium phosphate and form exclusively in the presence of urease-producing bacteria (Proteus mirabilis is the classic organism, along with Klebsiella and some Pseudomonas species). Urease splits urea into ammonia, which alkalinizes the urine and promotes struvite crystallization. Struvite stones can grow rapidly to fill the entire renal pelvis and calyces, forming large staghorn calculi that can destroy kidney tissue. Cystine stones (approximately 1-2%) result from cystinuria, an inherited autosomal recessive disorder that causes defective renal tubular reabsorption of cystine and other dibasic amino acids. Cystine is poorly soluble in urine and crystallizes when concentrations exceed the solubility threshold. These stones typically present in childhood or adolescence and tend to recur frequently. When a stone becomes dislodged from the kidney and enters the ureter, it causes renal colic -- an acute, severe, intermittent pain that is widely described as one of the most intense forms of pain a human can experience. The pain originates in the flank (costovertebral angle) and radiates anteriorly and inferiorly toward the groin and inner thigh, following the path of the ureter. The pain results from ureteral smooth muscle spasm, dilation of the renal pelvis from obstruction, and inflammatory mediators released from the damaged urothelium. The practical nurse must recognize the clinical presentation of renal colic, monitor for complications such as urinary obstruction, infection (obstructive pyelonephritis), and urosepsis, and administer prescribed analgesics promptly."
    },
    riskFactors: [
      "Dehydration and low fluid intake (most significant modifiable risk factor; concentrated urine promotes crystallization)",
      "History of previous kidney stones (recurrence rate approximately 50% within 5-10 years without preventive measures)",
      "Family history of nephrolithiasis (genetic predisposition to hypercalciuria, hyperoxaluria, or cystinuria)",
      "Diet high in sodium, animal protein, and oxalate-rich foods (spinach, rhubarb, nuts, chocolate, tea)",
      "Obesity and metabolic syndrome (associated with uric acid stones due to insulin resistance producing acidic urine)",
      "Chronic urinary tract infections with urease-producing organisms (Proteus, Klebsiella) predispose to struvite stones",
      "Hyperparathyroidism (excessive parathyroid hormone causes hypercalcemia and hypercalciuria, promoting calcium stone formation)"
    ],
    diagnostics: [
      "Non-contrast CT scan of the abdomen and pelvis (CT KUB): gold standard for kidney stone detection with 95-98% sensitivity; identifies stone size, location, density, and number; can detect all stone types including radiolucent uric acid stones; no contrast needed (avoids nephrotoxicity risk)",
      "Kidney-ureter-bladder (KUB) X-ray: plain radiograph that can identify radiopaque calcium and struvite stones but misses radiolucent uric acid and small cystine stones; useful for follow-up monitoring of known radiopaque stones",
      "Renal ultrasound: first-line imaging in pregnancy and pediatric patients; detects hydronephrosis (dilation of the renal pelvis indicating obstruction) but has lower sensitivity for ureteral stones",
      "Urinalysis: assess for hematuria (present in 85-90% of acute renal colic), crystalluria (crystal shape helps identify stone type), pyuria and bacteriuria (suggest concurrent infection), and urine pH (acidic pH less than 5.5 suggests uric acid stones; alkaline pH greater than 7.0 suggests struvite stones)",
      "24-hour urine collection for metabolic analysis: measures calcium, oxalate, uric acid, citrate, sodium, and total volume; performed after acute episode resolves to guide prevention strategies",
      "Basic metabolic panel: serum calcium (to screen for hyperparathyroidism), uric acid (elevated in gout), creatinine and BUN (assess renal function and obstruction impact); serum phosphorus and PTH if hypercalcemia identified"
    ],
    management: [
      "Aggressive fluid hydration: encourage oral intake of 2.5-3 liters per day to produce urine output of at least 2 liters daily; IV normal saline for patients unable to tolerate oral fluids or with signs of dehydration",
      "Pain management is the immediate priority: NSAIDs (ketorolac) are first-line for renal colic as they reduce prostaglandin-mediated ureteral inflammation and spasm; opioids are second-line for severe pain unresponsive to NSAIDs",
      "Medical expulsive therapy with tamsulosin (alpha-1 blocker): relaxes ureteral smooth muscle to facilitate spontaneous stone passage for stones 5-10 mm in the distal ureter",
      "Extracorporeal shock wave lithotripsy (ESWL): uses focused high-energy shock waves to fragment stones less than 2 cm in the kidney or proximal ureter into passable fragments; outpatient procedure",
      "Ureteroscopy with laser lithotripsy: endoscopic approach for ureteral and lower pole kidney stones; a flexible scope is passed through the urethra and bladder into the ureter to visualize and fragment the stone with a holmium laser",
      "Percutaneous nephrolithotomy (PCNL): used for large stones (greater than 2 cm), staghorn calculi, or stones resistant to ESWL; involves creating a tract through the flank directly into the kidney",
      "Stone-specific prevention: thiazide diuretics for calcium stones (reduce urinary calcium excretion); potassium citrate for uric acid and cystine stones (alkalinizes urine); antibiotics and surgical removal for struvite stones"
    ],
    nursingActions: [
      "Strain ALL urine through a fine mesh strainer to capture passed stone fragments for laboratory analysis; stone composition determines prevention strategy",
      "Administer analgesics promptly as prescribed -- renal colic pain is severe and should not be undertreated; document pain level before and after medication using a standardized pain scale",
      "Monitor vital signs every 4 hours (or more frequently as ordered); report fever (temperature greater than 38.5 C / 101.3 F) immediately as it may indicate obstructive pyelonephritis or urosepsis requiring emergency decompression",
      "Maintain strict intake and output; report urine output less than 30 mL/hour or signs of complete obstruction (anuria, worsening flank pain, increasing creatinine)",
      "Assess urine color, clarity, and presence of blood (hematuria is expected but should be monitored for worsening or clot formation)",
      "Encourage ambulation when pain is controlled to promote stone migration through the ureter",
      "Reinforce dietary teaching as delegated: increase fluid intake, limit sodium to less than 2,300 mg/day, moderate animal protein intake, maintain adequate calcium intake through diet (restricting dietary calcium paradoxically increases oxalate absorption and stone risk)"
    ],
    assessmentFindings: [
      "Renal colic: acute, severe, intermittent flank pain radiating from the costovertebral angle (CVA) anteriorly toward the groin, inner thigh, and labia or scrotum; pain intensity fluctuates with ureteral peristalsis and spasm",
      "Hematuria: gross (visible red or tea-colored urine) or microscopic (detected on urinalysis); present in 85-90% of cases; absence does not rule out stones",
      "Nausea and vomiting: common accompaniments of severe renal colic due to shared autonomic innervation between the kidneys and GI tract via the celiac plexus",
      "Restlessness and inability to find a comfortable position: patients with renal colic characteristically writhe in pain and cannot lie still (distinguishes from peritonitis where patients lie motionless)",
      "Costovertebral angle (CVA) tenderness on percussion: positive finding suggests renal involvement",
      "Dysuria, frequency, and urgency: occur when the stone reaches the ureterovesical junction or bladder",
      "Fever with chills (rigors): indicates concurrent infection (obstructive pyelonephritis) and requires urgent intervention -- an obstructed infected kidney is a urological emergency"
    ],
    signs: {
      left: [
        "Mild intermittent flank discomfort",
        "Microscopic hematuria on urinalysis",
        "Mild nausea without vomiting",
        "Urinary frequency or urgency (stone near bladder)",
        "Mild CVA tenderness on palpation",
        "History of previous stone passage (recurrent former)"
      ],
      right: [
        "Severe unrelenting flank pain with diaphoresis and vomiting",
        "Fever greater than 38.5 C with chills (infected obstructed kidney -- urological emergency)",
        "Anuria or oliguria (complete ureteral obstruction, especially in solitary kidney)",
        "Gross hematuria with clot formation",
        "Sepsis signs: tachycardia, hypotension, altered mental status with concurrent obstruction",
        "Rapidly rising serum creatinine indicating acute kidney injury from obstruction"
      ]
    },
    medications: [
      {
        name: "Ketorolac (Toradol)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits cyclooxygenase (COX-1 and COX-2) enzymes, blocking prostaglandin synthesis. In renal colic, prostaglandins mediate afferent arteriolar vasodilation (reducing glomerular filtration pressure behind the obstruction), ureteral smooth muscle spasm, and inflammatory edema at the stone impaction site. By blocking prostaglandins, ketorolac reduces ureteral spasm, decreases ureteral edema, and lowers intrarenal pressure, providing effective pain relief.",
        sideEffects: "GI bleeding and peptic ulceration, renal impairment (reduced renal blood flow), platelet dysfunction and bleeding risk, nausea, dizziness, injection site pain",
        contra: "Active GI bleeding or peptic ulcer disease; significant renal impairment (creatinine clearance less than 30 mL/min); aspirin or NSAID allergy; perioperative use in CABG surgery; concurrent anticoagulant therapy; pregnancy (third trimester)",
        pearl: "Ketorolac is the most effective analgesic for renal colic and is preferred over opioids as first-line therapy because it directly addresses the pathophysiology of pain (prostaglandin-mediated ureteral spasm); IV/IM use is limited to a maximum of 5 days to minimize GI and renal toxicity; monitor renal function during use"
      },
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1 adrenergic receptor blocker (selective alpha-1A)",
        action: "Selectively blocks alpha-1A adrenergic receptors concentrated in the distal ureter and ureterovesical junction smooth muscle, producing relaxation and dilation of the ureteral lumen. This facilitates spontaneous passage of stones 5-10 mm in the distal ureter by reducing ureteral tone, peristaltic frequency, and spasm around the stone.",
        sideEffects: "Orthostatic hypotension (especially first dose), dizziness, retrograde ejaculation, nasal congestion, headache, asthenia",
        contra: "Known hypersensitivity; concurrent use with strong CYP3A4 inhibitors; planned cataract surgery (intraoperative floppy iris syndrome); severe hepatic impairment",
        pearl: "Medical expulsive therapy with tamsulosin 0.4 mg daily is most effective for distal ureteral stones 5-10 mm; take 30 minutes after the same meal each day; counsel patients about orthostatic hypotension -- rise slowly from sitting or lying position; stone passage may take 1-4 weeks; patient should strain all urine during treatment"
      },
      {
        name: "Potassium Citrate (Urocit-K)",
        type: "Urinary alkalinizer / crystallization inhibitor",
        action: "Metabolized to bicarbonate in the body, raising urine pH and increasing urinary citrate excretion. Citrate binds to calcium in the urine, forming a soluble calcium-citrate complex that prevents calcium from binding to oxalate or phosphate (preventing calcium stone formation). In uric acid stones, alkalinizing urine to pH 6.5-7.0 increases the solubility of uric acid, allowing dissolution of existing stones and preventing new stone formation. In cystine stones, alkalinizing urine to pH above 7.0 increases cystine solubility.",
        sideEffects: "GI upset (nausea, vomiting, diarrhea, abdominal discomfort), hyperkalemia (especially in renal impairment or concurrent ACE inhibitor/ARB use), metabolic alkalosis with excessive dosing",
        contra: "Hyperkalemia; severe renal impairment (inability to excrete potassium); urinary tract infection with urease-producing organisms (alkaline urine promotes struvite stone growth); concurrent potassium-sparing diuretics",
        pearl: "Target urine pH 6.5-7.0 for uric acid stone dissolution and prevention; patients should be taught to monitor urine pH with dipstick strips at home; take with meals to minimize GI upset; do NOT use for struvite stones -- alkalinizing urine promotes struvite crystal growth; monitor serum potassium levels regularly"
      }
    ],
    pearls: [
      "The four major stone types can be remembered by composition: Calcium oxalate/phosphate (80%, most common), Uric acid (5-10%, radiolucent, dissolves with urine alkalinization), Struvite (10-15%, infection stones, can form staghorn calculi), and Cystine (1-2%, hereditary, recurrent in young patients)",
      "Patients with renal colic are characteristically unable to lie still and constantly change position seeking relief -- this distinguishes kidney stone pain from peritonitis (where patients lie motionless to avoid movement)",
      "Fever with an obstructed kidney stone is a urological emergency requiring immediate decompression (ureteral stent or nephrostomy tube) -- an infected obstructed kidney can progress to urosepsis and death within hours",
      "Strain ALL urine and save any stone fragments for laboratory analysis -- stone composition directly determines the prevention strategy and dietary modifications",
      "Paradoxically, restricting dietary calcium INCREASES kidney stone risk because unbound oxalate in the gut is absorbed and excreted by the kidneys -- patients should maintain normal calcium intake (1,000-1,200 mg/day) through dietary sources",
      "Uric acid stones are the only common stone type that is radiolucent (invisible on plain X-ray) but visible on CT scan -- if clinical presentation suggests stones but KUB is negative, CT scan is essential",
      "The single most effective prevention measure for ALL stone types is increasing fluid intake to produce at least 2 liters of urine per day -- this dilutes stone-forming substances below their supersaturation threshold"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient who presents with severe right flank pain radiating to the groin, nausea, and hematuria on urinalysis. The patient is restless and unable to find a comfortable position. A non-contrast CT scan reveals a 7 mm stone in the right distal ureter. Which medication is the priority for initial pain management?",
        options: [
          "Tamsulosin (Flomax) to relax the ureter",
          "Potassium citrate to dissolve the stone",
          "Ketorolac (Toradol) for pain relief",
          "Furosemide to increase urine output"
        ],
        correct: 2,
        rationale: "Pain management is the immediate priority in acute renal colic. Ketorolac is the first-line analgesic because it directly addresses the pathophysiology of renal colic by blocking prostaglandin-mediated ureteral spasm, inflammation, and edema. Tamsulosin is used for medical expulsive therapy but does not provide immediate pain relief. Potassium citrate is for long-term prevention. Furosemide is not indicated for kidney stones."
      },
      {
        question: "A patient with a history of recurrent kidney stones passes a stone that laboratory analysis identifies as struvite (magnesium ammonium phosphate). The practical nurse recognizes this stone type is most commonly associated with which condition?",
        options: [
          "Gout and high purine diet",
          "Urinary tract infection with urease-producing bacteria",
          "Hyperparathyroidism with hypercalcemia",
          "Autosomal recessive cystinuria"
        ],
        correct: 1,
        rationale: "Struvite stones form exclusively in the presence of urease-producing bacteria (most commonly Proteus mirabilis). Urease splits urea into ammonia, which alkalinizes the urine to pH greater than 7.0 and promotes crystallization of magnesium ammonium phosphate. Struvite stones can grow rapidly into large staghorn calculi. Treatment requires both stone removal and eradication of the underlying infection."
      },
      {
        question: "A practical nurse is reinforcing dietary teaching for a patient with calcium oxalate kidney stones. Which statement by the patient indicates correct understanding of prevention strategies?",
        options: [
          "I should eliminate all calcium from my diet to prevent more stones.",
          "I need to drink enough fluids to produce at least 2 liters of urine daily.",
          "I should limit my fluid intake to keep my urine concentrated.",
          "I can eat as much sodium as I want because only calcium matters."
        ],
        correct: 1,
        rationale: "Increasing fluid intake to produce at least 2 liters of urine daily is the single most effective prevention measure for all types of kidney stones. Concentrated urine promotes supersaturation and crystallization. Restricting dietary calcium is actually harmful because it increases oxalate absorption. Excess sodium increases urinary calcium excretion and should be limited to less than 2,300 mg/day."
      }
    ]
  },

  "restraint-use-rpn": {
    title: "Restraint Use and Patient Safety for Practical Nurses",
    cellular: {
      title: "Principles of Restraint Use in Clinical Practice",
      content: "Restraints are any manual method, physical device, material, or equipment that restricts a patient's freedom of movement, physical activity, or normal access to their body. The use of restraints in healthcare is governed by strict regulatory, ethical, and clinical standards designed to protect patient autonomy, dignity, and safety. The fundamental principle underlying restraint use is the least restrictive intervention -- restraints should only be applied when all less restrictive alternatives have been exhausted and the patient poses an immediate risk of harm to themselves or others. Restraints are classified into three categories: physical restraints, chemical restraints, and environmental restraints. Physical restraints include devices such as wrist restraints (limb holders), vest or jacket restraints, mitt restraints, belt restraints, and side rails when used to restrict rather than assist movement. Chemical restraints refer to medications administered specifically to control behavior or restrict movement, rather than to treat a medical or psychiatric condition; commonly used agents include haloperidol, lorazepam, and olanzapine. Environmental restraints include seclusion rooms and locked units that restrict a patient's ability to leave a designated area. The Centers for Medicare and Medicaid Services (CMS) and The Joint Commission have established comprehensive regulations governing restraint use. A physician or licensed independent practitioner (LIP) must provide an order for restraints; standing orders and PRN orders for restraints are NEVER acceptable. For medical-surgical patients, a new order must be obtained every 24 hours (calendar day). For behavioral health patients, time limits are more restrictive: 4 hours for adults 18 and older, 2 hours for children and adolescents ages 9-17, and 1 hour for children under 9. The physician must perform a face-to-face assessment within 1 hour of the restraint being applied for behavioral health restraints. The practical nurse must perform and document patient assessments at a minimum of every 2 hours (many facilities require every 1-2 hours), including circulation checks, skin integrity, respiratory status, nutrition and hydration needs, toileting needs, vital signs, continued need for the restraint, and the patient's emotional status. The restraint must be removed at regular intervals (at least every 2 hours) to allow for range of motion exercises, repositioning, skin assessment, and meeting basic needs. Restraints carry significant risks including strangulation (particularly vest and belt restraints), aspiration, peripheral nerve damage, pressure injuries, circulatory impairment, psychological trauma (anxiety, agitation, depression, loss of dignity), and death. Between 1995 and 2006, the FDA received over 100 reports of deaths associated with restraint use in medical settings. The practical nurse must be thoroughly trained in proper restraint application techniques, continuous assessment protocols, documentation requirements, and alternative interventions to try before resorting to restraint use."
    },
    riskFactors: [
      "Acute delirium or confusion (post-anesthesia, ICU delirium, metabolic encephalopathy) increasing risk of self-harm through line or tube removal",
      "Dementia with behavioral and psychological symptoms (wandering, aggression, self-injurious behavior)",
      "Traumatic brain injury or acute neurological event with agitation and impaired judgment",
      "Substance withdrawal states (alcohol, benzodiazepine, or opioid withdrawal with agitation and risk of seizures)",
      "Mechanical ventilation with patient attempts to self-extubate (removal of endotracheal tube is immediately life-threatening)",
      "History of falls with injury in patients who are unable to comprehend safety instructions or use call bell",
      "Acute psychiatric crisis with imminent risk of harm to self or others (command hallucinations, violent ideation)"
    ],
    diagnostics: [
      "Standardized fall risk assessment: use validated tools such as the Morse Fall Scale or Hendrich II Fall Risk Model to objectively measure fall risk and guide interventions before considering restraints",
      "Confusion Assessment Method (CAM): systematic screening tool for delirium; identifies acute onset, fluctuating course, inattention, and altered level of consciousness or disorganized thinking to differentiate delirium from dementia",
      "Richmond Agitation-Sedation Scale (RASS): standardized assessment of agitation and sedation levels ranging from +4 (combative) to -5 (unarousable); helps determine appropriate intervention level and guide medication titration",
      "Standardized behavioral assessment: document specific behaviors triggering restraint consideration including frequency, duration, antecedents, and consequences to identify patterns and alternative interventions",
      "Neurovascular assessment: check circulation, sensation, and movement (CSM) distal to any physical restraint at minimum every 2 hours; includes capillary refill, skin color, temperature, pulses, numbness, tingling, and range of motion",
      "Comprehensive medication review: evaluate all medications for potential contributions to confusion, agitation, or fall risk (anticholinergics, benzodiazepines, opioids, antihistamines, muscle relaxants)"
    ],
    management: [
      "Implement least restrictive alternatives FIRST: bed alarm, chair alarm, non-slip footwear, 1:1 sitter, reorientation strategies, therapeutic communication, environmental modifications (lowered bed, padded side rails, night lights), pain management, toileting schedule, medication review",
      "Obtain a physician order for restraint use that specifies type of restraint, clinical justification, time limits, and assessment frequency; document that alternatives were attempted and were ineffective",
      "Apply restraints using proper technique: allow two-finger width between restraint and skin, secure ties with quick-release knots (never square knots) to a non-movable part of the bed frame (never the side rail), position patient to prevent aspiration (head of bed elevated), ensure call light is within reach",
      "Perform comprehensive assessments every 2 hours (or per facility policy): circulation checks (pulses, capillary refill, skin color, sensation), skin integrity under and around restraint, respiratory status, nutrition/hydration, elimination needs, comfort and emotional status, continued need for restraint",
      "Release restraints every 2 hours for at least 10 minutes: perform range of motion exercises, reposition patient, offer food/fluids, assist with toileting, assess skin integrity, provide emotional support",
      "Document meticulously: ongoing assessment findings, continued clinical justification, alternatives attempted, patient response, release intervals, care provided during release, and reassessment of need for continuation",
      "Discontinue restraints as soon as clinically safe; reassess need with each assessment interval; involve the interdisciplinary team in ongoing decision-making"
    ],
    nursingActions: [
      "Exhaust ALL less restrictive alternatives before applying restraints; document each alternative tried and the patient's response to demonstrate clinical decision-making",
      "Verify a current, valid physician order exists before applying any restraint; ensure the order specifies restraint type, clinical justification, and time parameters; obtain new orders per CMS timelines (every 24 hours for medical-surgical, every 4 hours for behavioral health adults)",
      "Apply restraints correctly: two-finger space between device and skin, quick-release knots tied to the bed frame (never the side rail), patient positioned to prevent aspiration, call light and personal items within reach",
      "Perform neurovascular checks every 2 hours: assess pulses distal to restraint, capillary refill (less than 3 seconds), skin color and temperature, sensation, movement, and presence of edema; report any abnormalities immediately",
      "Monitor respiratory status continuously for patients in vest or jacket restraints: ensure the restraint is not constricting the chest, observe for dyspnea, assess breath sounds, monitor oxygen saturation",
      "Provide emotional support and maintain patient dignity: explain the reason for the restraint to the patient and family, use calm and reassuring communication, offer comfort measures, address concerns and fears",
      "Report and document any adverse events related to restraint use (skin breakdown, circulatory compromise, respiratory distress, increased agitation, injury) immediately to the registered nurse and physician"
    ],
    assessmentFindings: [
      "Indicators for restraint consideration: repeated attempts to remove life-sustaining medical devices (ET tube, central lines, arterial lines, feeding tubes), persistent attempts to climb out of bed despite alternatives, physically aggressive behavior toward staff or other patients",
      "Signs of restraint-related complications: skin redness, abrasion, or breakdown under or near restraint device; decreased pulses or capillary refill distal to wrist restraints; cyanosis or pallor of restrained extremities; reports of numbness, tingling, or pain",
      "Respiratory compromise in vest/jacket restraints: dyspnea, tachypnea, decreased oxygen saturation, inability to expand chest fully, adventitious breath sounds",
      "Psychological distress: increased agitation, crying, screaming, withdrawal, depression, loss of appetite, refusal to communicate; these indicate the restraint may be worsening the patient's condition",
      "Aspiration risk indicators: patient sliding down in bed with vest restraint tightening around neck/chest, vomiting while restrained, altered level of consciousness with impaired gag reflex",
      "Improvement indicators warranting restraint removal: patient is calm, oriented, cooperative; delirium resolved; medication effects have cleared; patient demonstrates safe behavior without restraint; able to follow safety instructions"
    ],
    signs: {
      left: [
        "Mild restlessness or confusion in a patient with multiple IV lines",
        "Occasional pulling at medical devices but easily redirected",
        "Intermittent agitation that responds to reorientation and therapeutic communication",
        "Fall risk assessment score indicating moderate risk",
        "Mild skin redness at restraint site that resolves with repositioning",
        "Patient verbalizing frustration but not attempting to harm self or others"
      ],
      right: [
        "Strangulation or near-strangulation event (vest or belt restraint riding up around neck)",
        "Loss of pulse or sensation distal to wrist or ankle restraint (neurovascular compromise)",
        "Aspiration event while restrained (unable to turn head to clear airway)",
        "Severe skin breakdown or pressure injury at restraint site",
        "Respiratory distress from chest constriction by vest restraint",
        "Patient death or cardiac arrest associated with restraint use"
      ]
    },
    medications: [
      {
        name: "Restraint Order Documentation",
        type: "Documentation Tools",
        action: "The restraint order form is a standardized document that must contain the following elements: physician or LIP name and signature, date and time of order, specific type of restraint authorized, clinical justification for restraint use, specific time limit (per CMS regulations), assessment and monitoring frequency, criteria for discontinuation, and documentation that less restrictive alternatives were tried and failed. Standing orders and PRN orders for restraints are NEVER permitted under CMS regulations.",
        sideEffects: "Incomplete documentation exposes the facility to regulatory citations and legal liability; missing orders constitute unauthorized restraint use",
        contra: "PRN restraint orders, standing restraint orders, telephone orders without timely co-signature, orders that do not specify restraint type or time limits",
        pearl: "CMS time limits for restraint orders: medical-surgical patients require renewal every 24 hours (calendar day); behavioral health patients require renewal every 4 hours (adults 18+), every 2 hours (ages 9-17), or every 1 hour (under age 9); a face-to-face physician assessment is required within 1 hour for behavioral health restraints"
      },
      {
        name: "Restraint Assessment Checklist",
        type: "Documentation Tools",
        action: "A standardized assessment checklist used every 1-2 hours (per facility policy) to ensure comprehensive monitoring of restrained patients. The checklist includes: neurovascular status (circulation, sensation, movement distal to restraint), skin integrity under and around the restraint device, respiratory status (rate, depth, oxygen saturation, chest expansion), vital signs, nutrition and hydration status, elimination needs (toileting offered and provided), range of motion exercises performed during release intervals, emotional and psychological status, continued clinical justification for restraint use, and assessment of readiness for restraint removal.",
        sideEffects: "Failure to complete assessments at required intervals constitutes neglect and regulatory non-compliance; inadequate monitoring increases risk of complications",
        contra: "Assessment intervals exceeding regulatory requirements (minimum every 2 hours); skipping assessment components; failure to document release intervals",
        pearl: "Many facilities require assessments every 1 hour rather than the CMS minimum of every 2 hours; always follow the MORE restrictive standard (facility policy vs. regulatory requirement); document that the patient was offered fluids, food, and toileting at each assessment interval even if the patient refused"
      },
      {
        name: "Patient Monitoring and Safety Log",
        type: "Documentation Tools",
        action: "A continuous monitoring log that provides a minute-by-minute or interval-based record of the restrained patient's condition, behavior, and care provided. The log documents the time restraint was applied, type and location of restraint, behavior or condition necessitating restraint, alternatives attempted before application, all assessment findings at required intervals, times of restraint release and duration of release, care provided during release (ROM exercises, toileting, nutrition, skin care), patient's response to restraint (behavioral changes, communication, emotional status), and time of restraint removal with clinical rationale for discontinuation.",
        sideEffects: "Gaps in the monitoring log may be interpreted as periods of unmonitored restraint use, which constitutes regulatory non-compliance and potential patient endangerment",
        contra: "Relying solely on narrative notes without structured monitoring documentation; charting by exception for restrained patients; delayed documentation",
        pearl: "The monitoring log serves as a legal document that demonstrates the facility provided continuous, compassionate, and clinically justified care during the restraint episode; include direct patient quotes when possible (for example: Patient states I feel calmer now) to demonstrate ongoing assessment of emotional status and readiness for removal"
      }
    ],
    pearls: [
      "The cornerstone principle of restraint use is LEAST RESTRICTIVE INTERVENTION -- always exhaust alternatives first: bed alarm, sitter, reorientation, therapeutic communication, medication review, environmental modification, pain management, toileting schedule",
      "PRN orders and standing orders for restraints are NEVER acceptable under CMS regulations -- each restraint application requires an individual time-limited physician order with clinical justification",
      "Quick-release knots must be used for ALL restraint ties so the restraint can be removed immediately in an emergency (fire, cardiac arrest, aspiration) -- never use square knots or tie restraints to side rails",
      "Two-finger rule: always ensure you can slide two fingers between the restraint device and the patient's skin to prevent circulatory compromise, nerve damage, and skin breakdown",
      "Vest and jacket restraints carry the highest risk of strangulation and death -- monitor respiratory status continuously and ensure the restraint is snug but allows full chest expansion; the V of the vest always opens in the FRONT",
      "Assess neurovascular status (circulation, sensation, movement) distal to wrist and ankle restraints at least every 2 hours -- report diminished pulses, cyanosis, pallor, numbness, tingling, or edema immediately",
      "The emotional and psychological impact of restraints can be profound -- patients may experience fear, humiliation, anger, helplessness, and depression; always explain the reason for restraints, maintain dignity, and involve family in the plan of care"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a restrained patient. During a 2-hour assessment, the nurse notes the patient's right hand is cool, pale, and the radial pulse is weak. The patient reports numbness in the fingers. What is the priority nursing action?",
        options: [
          "Document the findings and continue monitoring at the next assessment interval",
          "Loosen or remove the wrist restraint immediately and notify the registered nurse",
          "Apply a warm blanket over the hand and reassess in 30 minutes",
          "Reposition the restraint to the other wrist to equalize circulation"
        ],
        correct: 1,
        rationale: "Cool, pale skin, weak pulse, and numbness distal to a restraint indicate neurovascular compromise from impaired circulation. The restraint must be loosened or removed immediately to restore blood flow, and the registered nurse or physician must be notified. Delaying intervention can result in permanent nerve damage or tissue ischemia. Continuing to monitor without action or simply switching the restraint to another limb does not address the acute circulatory compromise."
      },
      {
        question: "A physician writes an order for PRN wrist restraints for a medical-surgical patient who is intermittently pulling at his IV lines. What should the practical nurse do?",
        options: [
          "Apply the restraints the next time the patient pulls at the IV lines",
          "Recognize that PRN restraint orders are not permitted and clarify the order with the physician",
          "Apply the restraints and obtain a new order within 24 hours",
          "Have the charge nurse cosign the PRN order to make it valid"
        ],
        correct: 1,
        rationale: "PRN (as needed) orders for restraints are NEVER permitted under CMS regulations. Each restraint application requires an individual, time-limited physician order with specific clinical justification. The practical nurse should recognize this as an invalid order and contact the physician to obtain a proper restraint order that specifies the restraint type, duration, clinical justification, and monitoring requirements. Applying restraints under a PRN order constitutes unauthorized restraint use."
      },
      {
        question: "A practical nurse is applying a vest restraint to a patient at risk for falling out of bed. Which action demonstrates correct restraint application technique?",
        options: [
          "Tie the restraint straps to the side rail using a square knot",
          "Apply the vest with the V-opening in the back to prevent the patient from unfastening it",
          "Ensure two fingers can fit between the vest and the patient's chest, tie with quick-release knots to the bed frame",
          "Apply the vest as tightly as possible to prevent the patient from sliding out"
        ],
        correct: 2,
        rationale: "Correct vest restraint application requires ensuring two fingers can fit between the vest and the patient's chest (to allow adequate chest expansion for breathing), applying the vest with the V-opening in the FRONT (applying it backwards increases strangulation risk), and securing ties with quick-release knots to the bed frame (never the side rail, and never using square knots). A vest that is too tight can restrict respirations and cause respiratory arrest."
      }
    ]
  },

  "retinal-detachment-rpn": {
    title: "Retinal Detachment for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Retinal Detachment",
      content: "Retinal detachment is a sight-threatening ophthalmological emergency in which the neurosensory retina separates from the underlying retinal pigment epithelium (RPE), disrupting the blood supply and metabolic support that the retina requires for normal function. The retina is a thin, multilayered neural tissue that lines the posterior two-thirds of the eye and contains the photoreceptor cells (rods and cones) responsible for converting light into electrical signals transmitted to the brain via the optic nerve. The retina consists of two layers: the outer retinal pigment epithelium (a single layer of pigmented cells attached to the choroid) and the inner neurosensory retina (containing photoreceptors, bipolar cells, and ganglion cells). Under normal conditions, the neurosensory retina is held against the RPE by several forces: the vitreous humor pressing against it, interphotoreceptor matrix adhesion molecules, and an active fluid transport pump in the RPE that continuously removes subretinal fluid. When these mechanisms fail, fluid accumulates in the potential space between the neurosensory retina and the RPE, causing detachment. There are three types of retinal detachment. Rhegmatogenous retinal detachment (most common, approximately 90% of cases) occurs when a full-thickness break (tear or hole) develops in the neurosensory retina, allowing liquefied vitreous humor to pass through the break and accumulate in the subretinal space, mechanically separating the retina from the RPE. The most common cause is posterior vitreous detachment (PVD), in which the aging vitreous humor shrinks, pulls away from the retina, and creates traction that tears the retina at points of firm vitreoretinal adhesion. Tractional retinal detachment (second most common) occurs when fibrovascular proliferative tissue on the retinal surface contracts and physically pulls the retina away from the RPE without a retinal break. This is most commonly seen in proliferative diabetic retinopathy, where neovascularization produces fragile new blood vessels and fibrous tissue that adhere to and exert traction on the retinal surface. Exudative (serous) retinal detachment (least common) occurs when fluid accumulates beneath the retina from an external source without a retinal break or traction; causes include choroidal tumors (melanoma), inflammatory conditions (posterior uveitis, Vogt-Koyanagi-Harada disease), and severe hypertension. The hallmark symptom of retinal detachment is a progressive, painless loss of vision described as a curtain, veil, or shadow descending across the visual field. Premonitory symptoms include sudden onset of floaters (small dark spots or cobweb-like shapes caused by blood or pigment cells released into the vitreous), photopsia (flashes of light caused by mechanical stimulation of the retina from vitreous traction), and a shower of floaters (indicating vitreous hemorrhage from a torn retinal vessel). Retinal detachment is a time-sensitive emergency because the photoreceptor cells begin to die within hours of losing contact with the RPE blood supply, and irreversible vision loss occurs if the detachment is not repaired promptly. If the macula (the central area of the retina responsible for sharp, detailed vision) remains attached (macula-on detachment), surgical repair within 24-72 hours typically preserves central vision. If the macula has already detached (macula-off detachment), visual prognosis is significantly worse even with successful surgical repair. The practical nurse must recognize the warning signs of retinal detachment, understand the urgency of the condition, provide appropriate pre- and post-operative care, and reinforce patient education regarding positioning requirements and activity restrictions following surgical repair."
    },
    riskFactors: [
      "High myopia (nearsightedness greater than -6 diopters; elongated globe thins the peripheral retina and increases vitreoretinal adhesion points)",
      "Previous retinal detachment in either eye (10-15% risk of detachment in the fellow eye)",
      "History of cataract surgery (posterior capsulotomy increases vitreoretinal traction and risk of PVD)",
      "Trauma to the eye or head (blunt force can cause retinal tears from sudden vitreous movement)",
      "Family history of retinal detachment (genetic predisposition to lattice degeneration and thin peripheral retina)",
      "Proliferative diabetic retinopathy (neovascularization creates fibrous traction bands that pull on the retina)",
      "Age over 50 years (posterior vitreous detachment becomes increasingly common with aging as vitreous humor liquefies and shrinks)"
    ],
    diagnostics: [
      "Dilated fundoscopic examination: gold standard for diagnosing retinal detachment; performed by ophthalmologist using indirect ophthalmoscope and scleral depression; reveals the detached retina as a gray, elevated, undulating membrane; identifies location and extent of detachment and presence of retinal breaks",
      "B-scan ultrasonography: used when direct visualization of the retina is not possible (dense cataract, vitreous hemorrhage obscuring view); shows the detached retina as a bright, mobile membrane within the vitreous cavity",
      "Optical coherence tomography (OCT): high-resolution cross-sectional imaging of the retina; differentiates between types of detachment; identifies subretinal fluid and assesses macular involvement; critical for determining urgency of repair (macula-on vs. macula-off)",
      "Visual acuity testing: documents baseline vision using Snellen chart; decreased visual acuity indicates macular involvement; serial testing documents visual recovery after repair",
      "Visual field testing (confrontation or automated perimetry): identifies the pattern and extent of visual field loss corresponding to the area of detachment; the visual field deficit is opposite to the area of retinal detachment (superior detachment produces inferior field loss)",
      "Intraocular pressure (IOP) measurement: IOP is typically lower in the eye with retinal detachment compared to the fellow eye; significantly elevated IOP may suggest a different diagnosis"
    ],
    management: [
      "Retinal detachment is a surgical emergency: immediate ophthalmology consultation and surgical intervention within 24-72 hours (sooner if macula is still attached)",
      "Scleral buckle surgery: a silicone band is sutured around the outside of the eye, indenting the sclera inward to bring the RPE back in contact with the detached retina; the retinal break is sealed with cryotherapy (freezing) or laser photocoagulation; effective for rhegmatogenous detachments with identifiable breaks",
      "Pars plana vitrectomy (PPV): the vitreous humor is removed and replaced with a gas bubble (SF6 or C3F8) or silicone oil that pushes the retina flat against the RPE while the retinal break heals; patient must maintain strict face-down positioning for 1-3 weeks to keep the gas bubble against the detached area",
      "Pneumatic retinopexy: an expanding gas bubble is injected into the vitreous cavity in the office; the patient is positioned so the bubble tamponades the retinal break; the break is then sealed with cryotherapy or laser; used for uncomplicated superior detachments with single small breaks",
      "Laser photocoagulation or cryotherapy: used to seal retinal tears or holes BEFORE they progress to full detachment (prophylactic treatment); creates an adhesive scar around the break that prevents fluid from entering the subretinal space",
      "Post-operative positioning compliance is critical: patients who receive gas bubble tamponade must maintain the prescribed head position (usually face-down) for 1-3 weeks to keep the bubble in contact with the repair site; non-compliance significantly increases the risk of re-detachment",
      "Activity restrictions post-operatively: no air travel or ascending to high altitudes while gas bubble is present (gas expands at reduced atmospheric pressure, causing dangerously elevated intraocular pressure); avoid heavy lifting, straining, and vigorous activity for 4-6 weeks"
    ],
    nursingActions: [
      "Recognize warning signs of retinal detachment and treat as an emergency: new onset of floaters, flashes of light (photopsia), curtain or shadow across vision, or sudden decrease in visual acuity require immediate ophthalmology referral",
      "Position the patient with the detached area of the retina in the dependent (lowest) position pre-operatively to use gravity to prevent further detachment progression; if the detachment location is unknown, position the patient supine with the head of bed flat",
      "Administer prescribed eye medications: mydriatic drops (atropine 1%) to dilate the pupil and prevent iris adhesion to the lens, timolol eye drops to reduce intraocular pressure, and acetazolamide orally to reduce aqueous humor production if IOP is elevated",
      "Maintain a calm, safe environment: orient the patient to surroundings, ensure call light is within reach, assist with ambulation (vision is impaired), keep side rails up, remove obstacles from pathways",
      "Post-operatively, reinforce strict positioning requirements: patients with gas bubble must maintain face-down positioning as prescribed; use positioning aids (face-down support pillows, massage table adaptation) to improve compliance; encourage breaks only as approved by surgeon",
      "Apply eye shield or patch as ordered to protect the operative eye; instruct the patient not to rub, press on, or manipulate the eye; administer antibiotic and anti-inflammatory eye drops as prescribed",
      "Educate patient about critical post-operative restrictions: NO air travel until gas bubble has completely absorbed (typically 2-8 weeks depending on gas type); avoid activities that increase intraocular pressure (heavy lifting, straining, bending at the waist, Valsalva maneuver)"
    ],
    assessmentFindings: [
      "Curtain, veil, or shadow across the visual field: the hallmark symptom, described as a dark area progressively encroaching on vision from one direction; corresponds to the area of retinal detachment",
      "Sudden onset of floaters: described as small dark spots, cobwebs, or strings floating across the visual field; caused by blood or pigment cells released into the vitreous from a retinal tear or detachment",
      "Photopsia (flashes of light): brief, arc-like flashes of light in the peripheral vision, typically occurring in dim lighting; caused by mechanical stimulation of the retina from vitreous traction",
      "Painless progressive vision loss: retinal detachment is characteristically painless; pain suggests a different diagnosis (acute angle-closure glaucoma, endophthalmitis) or a secondary complication",
      "Decreased visual acuity: occurs when the detachment involves or threatens the macula; central vision loss (difficulty reading, recognizing faces) indicates macular involvement and urgent surgical repair",
      "Relative afferent pupillary defect (RAPD or Marcus Gunn pupil): may be present in extensive retinal detachment; detected with the swinging flashlight test; indicates significant retinal dysfunction",
      "Post-operative findings to monitor: eye redness, pain level, visual acuity changes, signs of infection (purulent discharge, increasing pain, fever), intraocular pressure changes, positioning compliance"
    ],
    signs: {
      left: [
        "New onset of a few floaters without vision loss",
        "Occasional brief flashes of light in peripheral vision",
        "Mild blurred vision that may fluctuate",
        "Slight peripheral visual field change noticed incidentally",
        "Mild eye discomfort post-operatively",
        "Small areas of lattice degeneration on dilated exam (risk factor requiring monitoring)"
      ],
      right: [
        "Progressive curtain or shadow across vision with decreasing visual acuity (active detachment)",
        "Sudden shower of floaters with flashes (vitreous hemorrhage from torn retinal vessel)",
        "Complete visual field loss in one eye (total retinal detachment)",
        "Macula-off detachment (central vision loss indicating macula has detached -- poor visual prognosis)",
        "Post-operative signs of endophthalmitis (severe pain, purulent discharge, decreased vision, hypopyon)",
        "Elevated intraocular pressure with gas bubble (headache, severe eye pain, nausea -- possible angle closure)"
      ]
    },
    medications: [
      {
        name: "Atropine Sulfate 1% Ophthalmic (Isopto Atropine)",
        type: "Mydriatic / cycloplegic (anticholinergic)",
        action: "Blocks muscarinic acetylcholine receptors in the iris sphincter muscle and ciliary body, causing pupil dilation (mydriasis) and paralysis of accommodation (cycloplegia). In retinal detachment, atropine dilates the pupil to facilitate fundoscopic examination, prevents posterior synechia (adhesion of the iris to the lens), reduces ciliary spasm and associated pain, and keeps the pupil dilated post-operatively for ongoing retinal assessment.",
        sideEffects: "Photophobia (sensitivity to light due to pupil dilation), blurred near vision (cycloplegia), stinging on instillation, increased intraocular pressure (in patients with narrow angles), dry mouth, tachycardia (from systemic absorption), urinary retention in older adults",
        contra: "Narrow-angle (angle-closure) glaucoma or anatomically narrow anterior chamber angles (dilation can precipitate acute angle closure); known hypersensitivity; caution in elderly patients (systemic anticholinergic effects: urinary retention, constipation, confusion, tachycardia)",
        pearl: "Apply digital pressure to the nasolacrimal duct (punctal occlusion) for 1-2 minutes after instillation to minimize systemic absorption and reduce anticholinergic side effects; atropine has a prolonged duration of action (7-14 days for full recovery of accommodation) -- warn patients about extended blurred vision and photophobia; advise wearing sunglasses outdoors"
      },
      {
        name: "Timolol Maleate 0.5% Ophthalmic (Timoptic)",
        type: "Beta-adrenergic blocker (non-selective beta-1 and beta-2 antagonist)",
        action: "Blocks beta-adrenergic receptors in the ciliary body epithelium, reducing the production of aqueous humor and lowering intraocular pressure (IOP). In retinal detachment, timolol is used to control IOP that may become elevated from inflammation, hemorrhage, or gas bubble tamponade following surgical repair.",
        sideEffects: "Ocular stinging and burning on instillation, blurred vision, dry eyes; SYSTEMIC effects from absorption: bradycardia, hypotension, bronchospasm (beta-2 blockade), fatigue, dizziness, depression, masking of hypoglycemia symptoms in diabetic patients",
        contra: "Asthma or severe COPD (beta-2 blockade causes bronchospasm); sinus bradycardia, second or third-degree heart block, cardiogenic shock, or decompensated heart failure; known hypersensitivity to timolol or other beta-blockers",
        pearl: "Even though timolol is applied topically to the eye, significant systemic absorption occurs through the nasal mucosa via the nasolacrimal duct; apply punctal occlusion for 1-2 minutes after instillation; check heart rate and blood pressure before administration -- hold if HR less than 60 bpm or systolic BP less than 90 mmHg and notify physician; assess respiratory status in patients with pulmonary disease"
      },
      {
        name: "Acetazolamide (Diamox)",
        type: "Carbonic anhydrase inhibitor",
        action: "Inhibits the enzyme carbonic anhydrase in the ciliary body epithelium, reducing bicarbonate formation and decreasing sodium and water transport into the posterior chamber, thereby reducing aqueous humor production and lowering intraocular pressure by 40-60%. Also inhibits carbonic anhydrase in the renal proximal tubule (mild diuretic effect).",
        sideEffects: "Paresthesias (tingling in fingers, toes, and lips -- common and dose-related), malaise and fatigue, altered taste (metallic taste with carbonated beverages), GI upset (nausea, diarrhea), hypokalemia, metabolic acidosis, kidney stones (alkaline urine precipitates calcium phosphate), aplastic anemia (rare)",
        contra: "Sulfonamide allergy (cross-sensitivity -- acetazolamide is a sulfonamide derivative); severe hepatic disease (may precipitate hepatic encephalopathy by decreasing ammonia excretion); severe renal disease; hyponatremia or hypokalemia; Addison disease; hyperchloremic acidosis",
        pearl: "Oral acetazolamide 250-500 mg is used to rapidly reduce IOP in acute situations before surgery; warn patients that tingling in extremities is a common expected side effect, not an emergency; encourage adequate fluid intake (2-3 L/day) to prevent kidney stones; monitor serum potassium and bicarbonate levels; duration of use is typically short-term (days to weeks)"
      }
    ],
    pearls: [
      "The classic triad of retinal detachment symptoms is: new floaters, flashes of light (photopsia), and curtain or shadow across the visual field -- any combination of these requires URGENT ophthalmology evaluation within 24 hours",
      "Retinal detachment is PAINLESS -- if a patient presents with severe eye pain and vision loss, consider alternative diagnoses such as acute angle-closure glaucoma (pain, halos around lights, fixed mid-dilated pupil) or endophthalmitis (pain, redness, purulent discharge post-surgery)",
      "Macula status determines visual prognosis: macula-on detachments repaired within 24-72 hours typically preserve good central vision; macula-off detachments have significantly worse visual outcomes even with successful surgical repair",
      "Post-operative face-down positioning after gas bubble vitrectomy is critical for surgical success -- the gas bubble must float upward against the posterior retina to tamponade the repair site; poor positioning compliance is the most common cause of surgical failure",
      "Patients with intraocular gas bubbles must NEVER fly in an airplane or ascend to high altitudes -- the gas expands at reduced atmospheric pressure and can cause dangerously elevated intraocular pressure leading to central retinal artery occlusion and permanent blindness",
      "Apply punctal occlusion (pressing on the inner corner of the eye near the nose) for 1-2 minutes after instilling any eye drops to minimize systemic absorption -- this is especially important for timolol (prevents bradycardia) and atropine (prevents anticholinergic effects)",
      "High myopia (nearsightedness) is the strongest risk factor for rhegmatogenous retinal detachment in younger patients -- the elongated globe stretches and thins the peripheral retina, creating weak areas prone to tears"
    ],
    quiz: [
      {
        question: "A 58-year-old patient reports sudden onset of floating dark spots in the right eye followed by flashes of light and a shadow in the lower visual field. The patient denies any eye pain. Based on these findings, the practical nurse should recognize this presentation as most consistent with which condition?",
        options: [
          "Acute angle-closure glaucoma",
          "Retinal detachment",
          "Macular degeneration",
          "Conjunctivitis"
        ],
        correct: 1,
        rationale: "The classic presentation of retinal detachment includes sudden onset of floaters, photopsia (flashes of light), and a curtain or shadow across the visual field, which is characteristically painless. Acute angle-closure glaucoma presents with severe pain, halos, and a red eye. Macular degeneration causes gradual central vision loss. Conjunctivitis presents with redness and discharge without vision-threatening symptoms."
      },
      {
        question: "A practical nurse is caring for a patient who had vitrectomy with gas bubble insertion for retinal detachment repair. The surgeon has ordered strict face-down positioning. The patient asks why this position is necessary. Which response by the nurse is most accurate?",
        options: [
          "The position helps prevent infection at the surgical site.",
          "The gas bubble needs to float upward against the retina to hold the repair in place while it heals.",
          "Face-down positioning reduces blood pressure in the eye.",
          "This position is routine after all eye surgeries to reduce swelling."
        ],
        correct: 1,
        rationale: "After vitrectomy with gas bubble tamponade, the gas bubble rises to the highest point within the eye. Face-down positioning causes the bubble to float upward against the posterior retina, pressing the detached retina against the underlying retinal pigment epithelium at the repair site. This tamponade effect holds the retina in place while the cryotherapy or laser seal heals. Poor positioning compliance allows the bubble to move away from the repair site, significantly increasing the risk of re-detachment."
      },
      {
        question: "A patient with an intraocular gas bubble following retinal detachment repair asks the practical nurse about travel plans for next week. Which instruction is most important for the nurse to reinforce?",
        options: [
          "Air travel is safe as long as the patient wears an eye patch during the flight.",
          "The patient must NOT fly in an airplane until the gas bubble has completely absorbed because the gas expands at high altitude and can damage the eye.",
          "The patient can fly if they take acetazolamide before the flight to lower eye pressure.",
          "Short flights under 2 hours are safe but longer flights should be avoided."
        ],
        correct: 1,
        rationale: "Air travel is absolutely contraindicated while an intraocular gas bubble is present. At the reduced cabin pressure of an airplane (equivalent to 6,000-8,000 feet altitude), the gas bubble expands significantly, causing dangerously elevated intraocular pressure that can occlude the central retinal artery and cause permanent blindness. Patients must wait until the gas bubble has completely absorbed (typically 2-8 weeks depending on the gas type) before flying. No medication can safely prevent this complication."
      }
    ]
  },

  "retinopathy-of-prematurity-rpn": {
    title: "Retinopathy of Prematurity for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Retinopathy of Prematurity",
      content: "Retinopathy of prematurity (ROP) is a vasoproliferative disorder of the developing retina that affects premature infants, particularly those born before 31 weeks gestational age or weighing less than 1,500 grams at birth. Understanding ROP requires knowledge of normal retinal vascular development. The human retina is completely avascular until approximately 16 weeks of gestation, when retinal blood vessels begin growing from the optic disc and progressively extend outward toward the peripheral retina (the ora serrata). This process of retinal vascularization is not complete until approximately 36-40 weeks gestational age for the nasal retina and 40-44 weeks for the temporal retina. Therefore, infants born prematurely have incompletely vascularized retinas with an avascular peripheral zone that is vulnerable to injury. The pathophysiology of ROP occurs in two distinct phases. Phase 1 (vaso-obliterative phase) begins when the premature infant is exposed to relatively hyperoxic conditions compared to the hypoxic intrauterine environment. The immature retina is exquisitely sensitive to oxygen levels, and exposure to supplemental oxygen therapy (or even room air, which is relatively hyperoxic compared to in utero conditions) causes downregulation of vascular endothelial growth factor (VEGF) production by the avascular retinal cells. VEGF is the critical growth factor driving normal retinal vascularization, so its suppression causes cessation of normal vessel growth and obliteration of some existing immature vessels. This creates a large zone of avascular, ischemic retina. Phase 2 (vasoproliferative phase) develops as the metabolic demands of the growing retina increase and the avascular zone becomes increasingly hypoxic. The ischemic retinal cells respond by massively upregulating VEGF production, which triggers pathological neovascularization -- the growth of abnormal, fragile blood vessels that extend from the retinal surface into the vitreous cavity rather than growing along the retinal plane as normal vessels do. These abnormal vessels are structurally weak, prone to hemorrhage, and associated with fibrous tissue formation. The fibrovascular proliferation can contract and exert traction on the retina, leading to tractional retinal detachment and potentially irreversible blindness. ROP is classified by zone (location of disease from the optic disc), stage (severity from 1 to 5), and extent (measured in clock hours of involvement). Stage 1 is a demarcation line between vascularized and avascular retina. Stage 2 is a ridge (the demarcation line develops height and volume). Stage 3 is a ridge with extraretinal fibrovascular proliferation (neovascularization extending into the vitreous). Stage 4 is partial retinal detachment (4A: macula attached; 4B: macula detached). Stage 5 is total retinal detachment (funnel-shaped). Plus disease is a critical modifier indicating vascular dilation and tortuosity of the posterior pole vessels, signifying aggressive disease activity. Threshold disease (now largely replaced by the concept of type 1 ROP requiring treatment) indicates ROP that has reached the point where the risk of blindness exceeds 50% without treatment. The practical nurse caring for premature infants in the NICU must understand the relationship between oxygen exposure and ROP risk, adhere strictly to ordered oxygen saturation targets, recognize the screening schedule, and support families through the diagnostic and treatment process."
    },
    riskFactors: [
      "Gestational age less than 31 weeks at birth (most significant risk factor; degree of retinal immaturity directly correlates with ROP risk)",
      "Birth weight less than 1,500 grams (low birth weight is independently associated with ROP, likely reflecting overall developmental immaturity)",
      "Supplemental oxygen therapy (prolonged exposure to high FiO2 or fluctuating oxygen levels damages developing retinal vessels; strict SpO2 targeting reduces risk)",
      "Fluctuating oxygen saturation levels (repeated cycles of hypoxia and hyperoxia are more damaging than stable oxygen exposure; alarm fatigue can contribute to undetected fluctuations)",
      "Sepsis and necrotizing enterocolitis (systemic inflammatory responses release cytokines that disrupt normal retinal vascularization)",
      "Blood transfusions (adult hemoglobin releases oxygen more readily to tissues than fetal hemoglobin, potentially causing relative retinal hyperoxia)",
      "Intraventricular hemorrhage and poor weight gain (markers of overall clinical instability associated with increased ROP severity)"
    ],
    diagnostics: [
      "Dilated retinal examination by pediatric ophthalmologist: gold standard screening method; performed using indirect ophthalmoscopy with scleral indentation; first screening at 31 weeks postmenstrual age or 4 weeks chronological age (whichever is later) for infants born at 27 weeks or less; screening continues at 1-3 week intervals until retinal vascularization is complete or disease has regressed",
      "RetCam wide-field digital retinal imaging: specialized camera captures high-resolution photographs of the infant retina through a dilated pupil; allows remote telemedicine interpretation by specialists in facilities without on-site pediatric ophthalmologists; images can be stored for comparison across examinations",
      "Continuous pulse oximetry monitoring: not a diagnostic for ROP itself but essential for prevention; target SpO2 ranges (typically 90-95% for preterm infants on supplemental oxygen) must be maintained to balance adequate oxygenation against retinal oxygen toxicity",
      "Classification documentation: every ROP examination must document zone (I, II, or III), stage (1-5), extent in clock hours, and presence or absence of plus disease (vascular tortuosity and dilation); this standardized documentation guides treatment decisions",
      "Fluorescein angiography (rarely used in neonates): can demonstrate areas of retinal non-perfusion and neovascularization in complex cases; technically challenging in premature infants due to small pupil size and patient cooperation"
    ],
    management: [
      "Prevention is the primary strategy: maintain prescribed oxygen saturation targets (typically SpO2 90-95% for preterm infants on supplemental oxygen) to minimize oxygen toxicity while avoiding hypoxemia; respond promptly to oxygen saturation alarms",
      "Laser photocoagulation of avascular retina: standard treatment for type 1 ROP (zone I any stage with plus disease, zone I stage 3 without plus, zone II stage 2 or 3 with plus disease); laser burns destroy the avascular peripheral retina, eliminating the source of VEGF production and halting pathological neovascularization; performed under general anesthesia or sedation",
      "Intravitreal anti-VEGF injection (bevacizumab/Avastin): directly neutralizes the excess VEGF driving neovascularization; increasingly used as first-line treatment for aggressive posterior ROP (zone I disease) because it preserves more peripheral retina than laser; requires close long-term follow-up due to risk of late recurrence as the drug effect wears off",
      "Scleral buckle or vitrectomy: surgical interventions for stage 4 and 5 ROP (retinal detachment); outcomes are generally poor for stage 5 (total detachment), making early detection and treatment at earlier stages critical",
      "Follow-up schedule after treatment: examinations every 1-2 weeks until disease regression is confirmed and retinal vascularization progresses to the peripheral retina; anti-VEGF treated infants require extended follow-up for 60-65 weeks postmenstrual age or longer due to risk of late recurrence",
      "Long-term ophthalmologic follow-up: all infants with history of ROP (even regressed disease) require ongoing eye examinations throughout childhood for increased risk of myopia, strabismus, amblyopia, and late retinal detachment"
    ],
    nursingActions: [
      "Maintain prescribed SpO2 targets meticulously: set alarm limits appropriately (typically 88-95% or per unit protocol), respond to alarms within 60 seconds, avoid both hyperoxia (SpO2 above upper target) and hypoxemia (SpO2 below lower target); document oxygen adjustments and SpO2 trends",
      "Minimize oxygen saturation fluctuations: use blended oxygen rather than 100% oxygen for resuscitation when possible; wean FiO2 gradually; cluster care activities to reduce episodes of desaturation; position infant to optimize respiratory function",
      "Prepare infant for ROP screening examinations: administer prescribed mydriatic eye drops (typically phenylephrine 2.5% and cyclopentolate 0.5% or tropicamide 0.5%) 30-60 minutes before examination; monitor for systemic effects of mydriatics (tachycardia, feeding intolerance, abdominal distension); provide comfort measures (swaddling, sucrose pacifier) during the examination",
      "Monitor for signs of treatment complications: after laser therapy, observe for vitreous hemorrhage (blood in anterior chamber), corneal edema, anterior segment inflammation; after anti-VEGF injection, monitor for endophthalmitis (eye redness, discharge, swelling), intraocular pressure changes, and systemic effects",
      "Support parent education and emotional needs: explain ROP screening schedule, treatment options, and prognosis in simple terms; acknowledge parental anxiety; facilitate communication between parents and the ophthalmologist; ensure parents understand the importance of follow-up appointments after NICU discharge",
      "Document all ROP-related activities: screening dates and results, treatments performed, medications administered, infant response, SpO2 compliance data, and parent education provided",
      "Coordinate follow-up care: ensure ROP screening results and treatment plans are communicated in the discharge summary; schedule the first outpatient ophthalmology appointment before discharge; provide parents with written follow-up instructions including warning signs of retinal detachment"
    ],
    assessmentFindings: [
      "Oxygen saturation pattern analysis: frequent episodes of SpO2 above target range (hyperoxia) or wide SpO2 fluctuations correlate with increased ROP risk; trending SpO2 data over time reveals patterns that may need intervention",
      "ROP screening results documented by stage, zone, extent, and plus disease status: progressive disease from one examination to the next indicates worsening and may require treatment intervention",
      "Plus disease indicators: dilated, tortuous posterior pole retinal vessels visible on ophthalmoscopy; indicates aggressive disease activity and is a key indicator for treatment decisions; presence of plus disease in any stage significantly worsens prognosis",
      "Signs of visual impairment in older infants: inability to fixate on objects, lack of visual tracking, absence of social smile in response to faces, nystagmus (involuntary rhythmic eye movements), strabismus (eye misalignment)",
      "Post-treatment assessment: regression of neovascularization (vessels flatten and disease activity decreases), completion of retinal vascularization, resolution of plus disease; or treatment failure (persistent or worsening neovascularization, progression to retinal detachment)",
      "Systemic assessment findings relevant to ROP: overall clinical stability, weight gain trajectory, respiratory support requirements, hemoglobin levels (transfusion threshold), presence of sepsis or NEC markers"
    ],
    signs: {
      left: [
        "Stable oxygen saturations within prescribed target range",
        "Stage 1 or 2 ROP without plus disease (mild disease that often regresses spontaneously)",
        "Appropriate weight gain and decreasing respiratory support needs",
        "Normal pupillary responses and early visual fixation behaviors",
        "Gradual regression of ROP findings on serial examinations",
        "Mild post-examination irritability that resolves with comfort measures"
      ],
      right: [
        "Rapidly progressive ROP advancing from stage 2 to stage 3 with plus disease (treatment threshold reached)",
        "Zone I disease with any stage and plus disease (aggressive posterior ROP requiring urgent treatment)",
        "Stage 4A or 4B retinal detachment (partial detachment requiring surgical intervention)",
        "Stage 5 total retinal detachment (poor visual prognosis even with surgery)",
        "Post-treatment complications: vitreous hemorrhage, endophthalmitis, lens opacity",
        "Leukocoria (white pupillary reflex) suggesting advanced ROP with retrolental fibroplasia or retinal detachment"
      ]
    },
    medications: [
      {
        name: "Bevacizumab (Avastin) -- intravitreal injection",
        type: "Anti-VEGF monoclonal antibody (off-label use in ROP)",
        action: "Bevacizumab is a humanized monoclonal antibody that binds to and neutralizes all isoforms of vascular endothelial growth factor-A (VEGF-A), the primary growth factor responsible for pathological neovascularization in ROP. By blocking VEGF, the drug halts the growth of abnormal blood vessels extending from the retinal surface into the vitreous cavity, allows regression of existing neovascularization, and permits normal retinal vascularization to resume over time. Unlike laser photocoagulation, which permanently destroys avascular retina, anti-VEGF therapy preserves the peripheral retina and allows continued normal vascular development.",
        sideEffects: "Ocular: vitreous hemorrhage, endophthalmitis (infection inside the eye), retinal detachment, elevated intraocular pressure, lens opacity; Systemic: because VEGF is critical for normal organ development in premature infants, systemic absorption of anti-VEGF raises theoretical concerns about impaired development of lungs, brain, kidneys, and other organs (long-term data still being collected)",
        contra: "Active ocular or periocular infection; known hypersensitivity to bevacizumab; relative contraindication: use requires careful risk-benefit analysis given potential systemic effects on developing organs in premature infants",
        pearl: "Anti-VEGF injection provides rapid regression of neovascularization (often within days) but the effect is temporary -- late ROP recurrence can occur weeks to months after injection as the drug is cleared; this mandates extended follow-up (minimum 60-65 weeks postmenstrual age); standard intravitreal dose for ROP is 0.625 mg in 0.025 mL, which is significantly lower than the adult dose for other conditions"
      },
      {
        name: "Vitamin E (Alpha-tocopherol)",
        type: "Fat-soluble antioxidant vitamin",
        action: "Vitamin E is a lipid-soluble antioxidant that protects cell membranes from oxidative damage by scavenging free radicals generated by oxygen metabolism. In the context of ROP, the theory is that oxidative stress from supplemental oxygen and fluctuating oxygen levels contributes to damage of immature retinal vessels, and antioxidant supplementation might provide a protective effect. Vitamin E integrates into cellular membranes and interrupts the chain reaction of lipid peroxidation, potentially reducing oxygen-mediated vascular injury in the developing retina.",
        sideEffects: "At high doses: increased risk of necrotizing enterocolitis (NEC), sepsis, intraventricular hemorrhage, and retinal hemorrhage in premature infants; hepatotoxicity; coagulopathy (vitamin E inhibits vitamin K-dependent clotting factor activation); GI intolerance",
        contra: "Vitamin K deficiency or bleeding disorders; concurrent use with anticoagulants (increased bleeding risk); hepatic impairment; high-dose supplementation in very low birth weight infants (associated with increased NEC and sepsis risk)",
        pearl: "Despite theoretical rationale, clinical trials have shown inconsistent results for vitamin E supplementation in preventing ROP, and high-dose supplementation increases the risk of serious complications (NEC, sepsis) in premature infants; current practice does NOT recommend routine high-dose vitamin E supplementation for ROP prevention; ensure adequate but not excessive vitamin E levels through standard parenteral nutrition formulations"
      },
      {
        name: "Erythropoietin (EPO) considerations",
        type: "Hematopoietic growth factor (recombinant glycoprotein)",
        action: "Erythropoietin stimulates red blood cell production in the bone marrow by binding to EPO receptors on erythroid progenitor cells, promoting their proliferation, differentiation, and survival. In the NICU, recombinant EPO (epoetin alfa) is sometimes used to reduce the need for red blood cell transfusions in premature infants (anemia of prematurity). However, EPO receptors are also present on retinal cells, and EPO has been shown to have both pro-angiogenic properties (which could worsen ROP by promoting neovascularization) and neuroprotective properties (which could protect retinal neurons from ischemic damage). The relationship between EPO and ROP is complex and remains an area of active research.",
        sideEffects: "Hypertension, polycythemia (excessive red blood cell production), iron deficiency (increased iron utilization for erythropoiesis), injection site reactions; theoretical concern for worsening ROP through pro-angiogenic effects, though clinical data are conflicting",
        contra: "Uncontrolled hypertension; pure red cell aplasia associated with previous EPO exposure; hypersensitivity to mammalian cell-derived products or human albumin",
        pearl: "The relationship between EPO administration and ROP risk remains controversial -- some studies suggest early EPO may be protective while late EPO may increase risk; the practical nurse should be aware that EPO use may be discussed in the context of ROP risk when managing anemia of prematurity; blood transfusions (which EPO aims to reduce) are themselves a risk factor for ROP because adult hemoglobin in transfused blood releases oxygen more readily than fetal hemoglobin, potentially causing relative retinal hyperoxia"
      }
    ],
    pearls: [
      "The two most significant risk factors for ROP are low gestational age (less than 31 weeks) and low birth weight (less than 1,500 grams) -- the more premature the infant, the larger the avascular retinal zone and the greater the vulnerability to oxygen-related injury",
      "Oxygen management is the single most important modifiable risk factor for ROP prevention -- maintain SpO2 within prescribed target ranges (typically 90-95%), respond promptly to alarms, and minimize fluctuations between hyperoxia and hypoxemia",
      "ROP screening should begin at 31 weeks postmenstrual age or 4 weeks chronological age (whichever is later) for infants born at 27 weeks or less gestational age -- early detection and timely treatment are critical to preventing blindness",
      "Plus disease (vascular dilation and tortuosity of posterior pole vessels) is the single most important clinical indicator of disease severity and treatment need -- its presence in any stage significantly worsens prognosis and typically triggers treatment",
      "Anti-VEGF therapy (bevacizumab) provides rapid disease regression but requires extended follow-up for late recurrence -- infants must be monitored until at least 60-65 weeks postmenstrual age; families must understand the critical importance of follow-up appointments",
      "Most ROP (approximately 80-90% of cases) regresses spontaneously without treatment, particularly stages 1 and 2 without plus disease -- this information helps reassure families while emphasizing the importance of continued screening",
      "All premature infants with a history of ROP require long-term ophthalmologic follow-up throughout childhood for increased risk of myopia, strabismus, amblyopia, and late retinal detachment -- include ophthalmology follow-up in NICU discharge planning"
    ],
    quiz: [
      {
        question: "A practical nurse in the NICU is caring for a 26-week premature infant on supplemental oxygen. The pulse oximeter alarm sounds, showing SpO2 of 98%. What is the most appropriate nursing action?",
        options: [
          "Silence the alarm because 98% is a safe oxygen level for any patient",
          "Reduce the FiO2 as prescribed to bring the SpO2 back within the target range of 90-95%",
          "Increase the FiO2 to ensure the infant remains well-oxygenated",
          "Remove the pulse oximeter probe because it may be giving a false reading"
        ],
        correct: 1,
        rationale: "SpO2 of 98% exceeds the typical target range of 90-95% for premature infants on supplemental oxygen. Hyperoxia (excessive oxygen) is a major risk factor for ROP because it suppresses VEGF production, halting normal retinal vascular development and causing existing immature vessels to regress. The FiO2 should be reduced as prescribed to bring SpO2 back within the target range, balancing adequate oxygenation against the risk of retinal oxygen toxicity."
      },
      {
        question: "A practical nurse is preparing a premature infant for an ROP screening examination. Which nursing action is essential before the ophthalmologist arrives?",
        options: [
          "Administer prescribed mydriatic eye drops 30-60 minutes before the examination to dilate the pupils",
          "Keep the infant NPO for 6 hours before the examination",
          "Administer a sedative to ensure the infant remains still during the examination",
          "Apply antibiotic eye ointment to prevent infection during the examination"
        ],
        correct: 0,
        rationale: "Mydriatic eye drops (typically phenylephrine 2.5% and cyclopentolate 0.5% or tropicamide) must be administered 30-60 minutes before the ROP screening examination to adequately dilate the infant's pupils, allowing the ophthalmologist to visualize the peripheral retina. The nurse should monitor for systemic effects of these medications, including tachycardia and feeding intolerance. The infant does not need to be NPO or sedated for a standard screening examination."
      },
      {
        question: "The parents of a premature infant diagnosed with stage 2 ROP without plus disease are very anxious about their baby's vision. Which statement by the practical nurse is most accurate and appropriate?",
        options: [
          "Your baby will definitely need laser surgery to prevent blindness.",
          "Stage 2 ROP without plus disease often resolves on its own, but your baby will continue to have regular eye examinations to monitor for any changes.",
          "There is nothing that can be done at this stage, so we will wait and see what happens.",
          "Your baby's vision will be completely normal once the ROP resolves."
        ],
        correct: 1,
        rationale: "Approximately 80-90% of ROP cases, particularly stages 1 and 2 without plus disease, regress spontaneously without treatment. However, continued screening is essential because disease can progress. This response is accurate, provides reassurance while maintaining honesty, and emphasizes the importance of ongoing monitoring. It avoids false guarantees about outcomes while not causing unnecessary alarm."
      }
    ]
  }
};

let injected = 0;
let failed = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) { injected++; } else { failed++; }
}
console.log(`\nDone: ${injected} injected, ${failed} skipped`);
