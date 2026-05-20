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
  "arrhythmogenic-rv-cardiomyopathy-rn": {
    title: "Arrhythmogenic Right Ventricular Cardiomyopathy (ARVC)",
    cellular: {
      title: "Desmosomal Pathology and Fibro-Fatty Replacement in ARVC",
      content: "Arrhythmogenic right ventricular cardiomyopathy (ARVC) is a heritable cardiomyopathy characterized by progressive fibro-fatty replacement of the right ventricular myocardium, predisposing to ventricular arrhythmias, right ventricular failure, and sudden cardiac death. ARVC accounts for approximately 11 to 22% of sudden cardiac death in athletes under age 35 and has an estimated prevalence of 1 in 2,000 to 1 in 5,000 in the general population. The disease is caused primarily by mutations in genes encoding desmosomal proteins, the intercellular junctions that provide mechanical coupling between adjacent cardiomyocytes.\n\nDesmosomes are specialized cell-cell adhesion complexes composed of five major proteins: plakoglobin (gamma-catenin), plakophilin-2, desmoplakin, desmoglein-2, and desmocollin-2. These proteins form a structural bridge between the intermediate filament cytoskeletons (desmin in cardiomyocytes) of adjacent cells, transmitting mechanical forces during contraction. In ARVC, mutations (most commonly in plakophilin-2, accounting for 25 to 40% of cases) destabilize desmosomal architecture, weakening mechanical coupling between cardiomyocytes. The weakened junctions cannot withstand the repetitive mechanical stress of cardiac contraction, particularly under conditions of increased wall stress such as vigorous exercise.\n\nThe pathogenesis proceeds through several interconnected mechanisms. Mechanical uncoupling leads to cardiomyocyte detachment and death, initially in the subepicardial layer of the right ventricle (where wall stress is highest) and progressing transmurally. The dying myocytes are replaced by fibrous tissue and adipose tissue (fibro-fatty replacement), creating islands of surviving myocardium interspersed with fibrosis and fat. This heterogeneous substrate is electrically unstable: areas of fibrosis create zones of slow conduction and conduction block, establishing the anatomic circuits necessary for reentrant ventricular tachycardia. Desmosomal dysfunction also impairs gap junction formation by disrupting connexin-43 distribution, further slowing intercellular conduction.\n\nAdditionally, destabilized plakoglobin translocates from the desmosome to the nucleus where it suppresses the canonical Wnt/beta-catenin signaling pathway. Suppression of Wnt signaling redirects cardiac progenitor cell differentiation toward adipogenesis rather than cardiomyogenesis, explaining the characteristic adipose tissue deposition. This process is accelerated by exercise, which increases right ventricular wall stress and mechanical strain on weakened desmosomes, explaining why ARVC-related events cluster around physical activity and why exercise restriction is a cornerstone of management.\n\nThe disease typically progresses through four phases. The concealed phase (often in adolescence/young adulthood) shows subtle structural changes with no symptoms but with risk of ventricular arrhythmias and sudden death during exercise. The overt electrical disorder phase features symptomatic ventricular tachycardia, typically with left bundle branch block morphology (because the arrhythmia originates in the right ventricle), palpitations, and syncope. The right ventricular failure phase shows progressive right ventricular dilation and dysfunction with tricuspid regurgitation, right heart failure symptoms (peripheral edema, hepatomegaly, jugular venous distension), and ascites. The biventricular failure phase involves left ventricular involvement and mimics dilated cardiomyopathy.\n\nDiagnosis uses the 2010 Task Force Criteria, which incorporate structural (RV dilation, regional wall motion abnormalities, fibro-fatty replacement on MRI), electrophysiological (epsilon waves, T-wave inversions in V1-V3, ventricular arrhythmias with LBBB morphology), histological (fibro-fatty replacement on endomyocardial biopsy), genetic (pathogenic desmosomal mutation), and family history criteria. Cardiac MRI with late gadolinium enhancement is the most sensitive non-invasive tool for detecting fibro-fatty replacement and regional wall motion abnormalities. Treatment focuses on arrhythmia prevention (antiarrhythmics, ICD implantation), exercise restriction, and heart failure management."
    },
    riskFactors: [
      "Pathogenic desmosomal gene mutation (plakophilin-2 most common, also desmoplakin, desmoglein-2, desmocollin-2, plakoglobin)",
      "Family history of ARVC or sudden cardiac death under age 35",
      "Competitive or vigorous endurance exercise (accelerates disease progression and arrhythmia risk)",
      "Male sex (2 to 3 times more likely to manifest clinically, though women carry mutations equally)",
      "Adolescence through young adulthood (disease typically manifests between ages 10 and 40)",
      "Italian and North American populations (higher prevalence in Veneto region of Italy)",
      "Myocarditis (enteroviral) may trigger or accelerate fibro-fatty replacement in genetically susceptible individuals"
    ],
    diagnostics: [
      "12-lead ECG: T-wave inversions in V1 through V3 (most common finding), epsilon waves (small positive deflections at end of QRS representing delayed RV activation through fibrotic tissue), prolonged terminal activation duration greater than 55 msec in V1",
      "Cardiac MRI with late gadolinium enhancement: identifies RV dilation, regional wall motion abnormalities (akinesia, dyskinesia, dyssynchrony), fibro-fatty replacement (intramyocardial fat on T1-weighted images, late gadolinium enhancement indicating fibrosis)",
      "24-hour Holter monitoring and exercise stress test: quantify PVC burden and identify exercise-induced ventricular arrhythmias with LBBB morphology (indicating RV origin)",
      "Signal-averaged ECG: detects late potentials (low-amplitude signals at the end of QRS) indicating slow conduction through fibrotic areas",
      "Genetic testing for desmosomal gene mutations (plakophilin-2, desmoplakin, desmoglein-2, desmocollin-2, plakoglobin); positive result with cascade family screening",
      "2010 Task Force Criteria: diagnosis requires 2 major, or 1 major plus 2 minor, or 4 minor criteria from structural, histological, ECG, arrhythmia, and family history categories"
    ],
    management: [
      "Exercise restriction: avoid competitive sports, endurance athletics, and high-intensity exercise; limit to low-intensity recreational activity (walking, golf); exercise accelerates fibro-fatty replacement and triggers arrhythmias",
      "ICD implantation for secondary prevention (survivors of cardiac arrest or sustained VT) and primary prevention (high-risk features: unexplained syncope, severe RV dysfunction, extensive disease, high PVC burden, or family history of sudden death)",
      "Antiarrhythmic therapy: sotalol or amiodarone to reduce VT burden and ICD shocks; beta-blockers for all patients regardless of symptoms",
      "Heart failure management: ACE inhibitors or ARBs, diuretics for volume overload, aldosterone antagonists for RV failure symptoms",
      "Catheter ablation for recurrent VT not controlled by medications and causing frequent ICD shocks; epicardial approach often required due to subepicardial location of arrhythmogenic substrate",
      "Heart transplantation for refractory biventricular failure or intractable ventricular arrhythmias despite maximal medical and interventional therapy",
      "Cascade family screening: first-degree relatives should undergo ECG, echocardiography, Holter monitoring, and genetic testing beginning in adolescence with periodic re-evaluation"
    ],
    nursingActions: [
      "Educate patient and family about the critical importance of exercise restriction: competitive sports and high-intensity exercise are strongly associated with sudden death in ARVC; help patient identify safe low-intensity activities and cope with lifestyle changes, particularly for young athletes whose identity may be tied to athletic participation",
      "Monitor telemetry continuously for ventricular arrhythmias: PVCs (especially frequent or with LBBB morphology), nonsustained VT, sustained VT; document rhythm strips and notify provider for sustained arrhythmias or hemodynamic instability",
      "Assess for right heart failure signs every shift: jugular venous distension (JVD), hepatojugular reflux, peripheral edema (measure ankle and calf circumference), hepatomegaly (palpate liver edge below right costal margin), ascites (measure abdominal girth at umbilicus), weight gain exceeding 1 kg per day",
      "For patients with ICDs: verify device function per protocol, educate about activity restrictions near strong electromagnetic fields, teach patient to recognize ICD shocks (sudden chest jolt) and when to seek emergency care (multiple shocks in succession indicating electrical storm), ensure medical identification is worn at all times",
      "Provide genetic counseling support: explain autosomal dominant inheritance with variable penetrance and expressivity, facilitate testing for first-degree relatives, address psychological impact of positive genetic diagnosis on family members including children, and connect with ARVC support organizations",
      "Monitor medication adherence and side effects: sotalol requires QTc monitoring (hold if QTc exceeds 500 msec), beta-blockers require heart rate and blood pressure monitoring (hold for HR below 50 or SBP below 90), amiodarone requires thyroid and liver function monitoring",
      "Assess psychological status: ARVC diagnosis in young adults often causes significant anxiety about sudden death, grief over lost athletic activities, and depression; screen with validated tools (PHQ-9) and refer to counseling or support services as needed"
    ],
    assessmentFindings: [
      "Palpitations and dizziness from ventricular ectopy and nonsustained VT",
      "Syncope or presyncope during or immediately after exercise (suggests hemodynamically significant VT)",
      "Right heart failure: JVD, peripheral edema, hepatomegaly, ascites, elevated right-sided filling pressures",
      "ECG: T-wave inversions in precordial leads V1 through V3, epsilon waves, PVCs or VT with LBBB morphology",
      "Cardiac MRI showing RV dilation, regional wall motion abnormalities, intramyocardial fat, and late gadolinium enhancement",
      "Family history of sudden cardiac death in young relatives or known ARVC diagnosis"
    ],
    signs: {
      left: [
        "Occasional palpitations during exercise or at rest",
        "Mild fatigue or exercise intolerance",
        "T-wave inversions in V1 to V3 on resting ECG",
        "Isolated PVCs with LBBB morphology on Holter monitoring",
        "Subtle RV dilation on echocardiography"
      ],
      right: [
        "Sustained ventricular tachycardia with hemodynamic compromise",
        "Cardiac arrest (VF) during exercise or competition",
        "Electrical storm (multiple VT/VF episodes requiring ICD shocks)",
        "Decompensated right heart failure with refractory edema and ascites",
        "Biventricular failure requiring mechanical circulatory support or transplant evaluation"
      ]
    },
    medications: [
      {
        name: "Sotalol",
        type: "Class III Antiarrhythmic / Non-selective Beta-Blocker",
        action: "Combines class III antiarrhythmic properties (potassium channel blockade prolonging repolarization and refractory period) with non-selective beta-adrenergic blockade (reducing heart rate, AV conduction, and sympathetically-triggered arrhythmias); effective for suppressing ventricular tachycardia in ARVC",
        sideEffects: "QTc prolongation (dose-dependent, risk of torsades de pointes), bradycardia, hypotension, fatigue, bronchospasm (non-selective beta-blockade), dizziness, proarrhythmia (especially with hypokalemia or hypomagnesemia)",
        contra: "Baseline QTc greater than 450 msec, creatinine clearance less than 40 mL/min (renally eliminated, accumulation risk), uncompensated heart failure, severe sinus bradycardia, second or third-degree heart block, reactive airway disease, concomitant use with other QTc-prolonging drugs",
        pearl: "Sotalol must be initiated in-hospital with continuous telemetry for at least 3 days to monitor QTc (hold if QTc exceeds 500 msec); requires dose adjustment for renal function; maintain potassium above 4.0 and magnesium above 2.0 to prevent torsades; more effective than other beta-blockers alone for VT suppression in ARVC due to the class III component"
      },
      {
        name: "Metoprolol Succinate",
        type: "Cardioselective Beta-1 Blocker (Extended Release)",
        action: "Selectively blocks beta-1 adrenergic receptors in the heart, reducing heart rate, myocardial contractility, and AV conduction; decreases sympathetic-mediated arrhythmia triggers; provides sustained 24-hour beta-blockade with extended-release formulation",
        sideEffects: "Bradycardia, hypotension, fatigue, dizziness, cold extremities, depression, masking of hypoglycemia symptoms in diabetic patients, weight gain, sexual dysfunction",
        contra: "Severe sinus bradycardia (HR less than 45), second or third-degree heart block without pacemaker, decompensated heart failure with cardiogenic shock, sick sinus syndrome, severe peripheral vascular disease, pheochromocytoma without prior alpha-blockade",
        pearl: "All ARVC patients should receive beta-blocker therapy regardless of arrhythmia history; extended-release formulation provides consistent 24-hour coverage including during exercise; do not abruptly discontinue (risk of rebound tachycardia and arrhythmia); titrate to target heart rate of 60 bpm at rest"
      },
      {
        name: "Amiodarone",
        type: "Class III Antiarrhythmic (Multichannel Blocker)",
        action: "Blocks multiple ion channels (potassium, sodium, calcium) and beta-adrenergic receptors; prolongs repolarization and refractory period in all cardiac tissues; most effective antiarrhythmic for suppressing ventricular arrhythmias in structural heart disease including ARVC",
        sideEffects: "Pulmonary toxicity (interstitial pneumonitis, fibrosis in 1 to 17% with chronic use), thyroid dysfunction (hypothyroidism 6%, hyperthyroidism 0.9-2% due to high iodine content), hepatotoxicity (monitor LFTs), corneal microdeposits (nearly universal but rarely symptomatic), photosensitivity and blue-gray skin discoloration, peripheral neuropathy, QTc prolongation",
        contra: "Severe sinus node dysfunction or high-degree heart block without pacemaker, cardiogenic shock, severe hepatic disease, known pulmonary fibrosis, baseline QTc greater than 500 msec, iodine hypersensitivity, pregnancy (Category D - fetal thyroid and cardiac toxicity)",
        pearl: "Reserved for ARVC patients with recurrent VT despite sotalol and ICD, or those with frequent ICD shocks; requires baseline and every 6-month monitoring: PFTs with DLCO, TFTs (TSH, free T4), LFTs, ophthalmology exam; extremely long half-life of 40 to 55 days means side effects persist weeks after discontinuation; drug interactions are extensive (warfarin, digoxin, many others)"
      }
    ],
    pearls: [
      "ARVC is the leading cause of sudden cardiac death in young competitive athletes in Italy and a major cause worldwide; exercise-triggered VF during sports is often the first manifestation, making pre-participation cardiac screening (ECG and family history) lifesaving",
      "Exercise restriction is the single most important non-pharmacologic intervention: endurance exercise accelerates the fibro-fatty replacement process by increasing RV wall stress on weakened desmosomes, and exercise is the most common trigger for lethal arrhythmias in ARVC",
      "Epsilon waves on ECG (small positive deflections after the QRS in V1-V2) are pathognomonic for ARVC but present in only 30% of patients; T-wave inversions in V1 through V3 are far more common (85% sensitivity) and should prompt further investigation in anyone under 40",
      "ARVC typically affects the triangle of dysplasia: the RV inflow tract (below the tricuspid valve), the RV outflow tract (below the pulmonic valve), and the RV apex; these are the areas of highest wall stress and earliest fibro-fatty replacement",
      "Genetic testing identifies a causative mutation in approximately 60% of ARVC patients; a negative genetic test does NOT exclude the diagnosis because many causative genes remain unknown; clinical diagnosis using the 2010 Task Force Criteria remains the standard",
      "ICD therapy is the only intervention proven to prevent sudden cardiac death in ARVC; antiarrhythmic drugs reduce VT burden and ICD shocks but do not eliminate the risk of fatal arrhythmias",
      "Young patients diagnosed with ARVC often experience significant psychological distress from exercise restrictions, ICD implantation, and knowledge of sudden death risk; nursing support should address grief, identity changes, and facilitate peer support connections"
    ],
    quiz: [
      {
        question: "A 22-year-old college athlete is diagnosed with ARVC after a syncopal episode during a basketball game. Which nursing teaching is most important for this patient?",
        options: [
          "Continue competitive sports with the ICD in place for protection",
          "Avoid all physical activity including walking and light stretching",
          "Discontinue competitive and vigorous exercise because it accelerates disease progression and triggers life-threatening arrhythmias",
          "Resume sports after 6 weeks of antiarrhythmic medication therapy"
        ],
        correct: 2,
        rationale: "Exercise restriction is the cornerstone of ARVC management. Vigorous and competitive exercise increases RV wall stress on weakened desmosomal junctions, accelerating fibro-fatty replacement and triggering ventricular arrhythmias. An ICD provides a safety net but does not prevent disease progression. Low-intensity recreational activity (walking, light cycling) is generally permitted, but competitive and high-intensity exercise should be permanently avoided."
      },
      {
        question: "A nurse is monitoring a patient with ARVC on telemetry who develops sustained monomorphic ventricular tachycardia with a heart rate of 180 bpm. The patient is conscious but complaining of chest pain and has a blood pressure of 85/60 mmHg. What is the priority intervention?",
        options: [
          "Administer adenosine 6 mg rapid IV push",
          "Prepare for immediate synchronized cardioversion",
          "Administer amiodarone 150 mg IV over 10 minutes",
          "Increase the IV fluid rate to treat hypotension"
        ],
        correct: 1,
        rationale: "This patient has unstable VT (hypotension, chest pain, tachycardia). Per ACLS, unstable tachycardia with a pulse requires immediate synchronized cardioversion. Adenosine is ineffective for VT and contraindicated for wide-complex tachycardia. Amiodarone is appropriate for stable VT but this patient is unstable. IV fluids alone will not correct the hemodynamic compromise caused by the arrhythmia."
      },
      {
        question: "A patient with ARVC is being initiated on sotalol in the hospital. Which nursing assessment is most critical during the first 3 days of therapy?",
        options: [
          "Daily weight measurements to monitor fluid retention",
          "Continuous QTc interval monitoring with telemetry, holding the drug if QTc exceeds 500 msec",
          "Serum drug level monitoring every 12 hours",
          "Daily chest X-rays to monitor for pulmonary toxicity"
        ],
        correct: 1,
        rationale: "Sotalol prolongs the QTc interval in a dose-dependent manner and carries a risk of torsades de pointes. In-hospital initiation with continuous telemetry for at least 3 days is mandatory to monitor QTc. The drug must be held if QTc exceeds 500 msec. Potassium and magnesium must be maintained in normal range to reduce proarrhythmia risk. Sotalol does not require serum drug level monitoring. Pulmonary toxicity is associated with amiodarone, not sotalol."
      }
    ]
  },

  "ascites-assessment-rn": {
    title: "Ascites Assessment and Management",
    cellular: {
      title: "Pathophysiology of Ascites Formation",
      content: "Ascites is the pathological accumulation of fluid within the peritoneal cavity, most commonly caused by portal hypertension in the setting of cirrhosis (accounting for approximately 85% of cases). Understanding the cellular and hemodynamic mechanisms underlying ascites formation is essential for effective nursing assessment and management.\n\nIn cirrhosis, chronic hepatocyte injury from alcohol, viral hepatitis, or non-alcoholic steatohepatitis triggers hepatic stellate cell activation and progressive fibrosis. Fibrotic bands and regenerative nodules distort the hepatic architecture, increasing resistance to portal blood flow. Portal pressure rises from the normal gradient of 1 to 5 mmHg to above 10 to 12 mmHg (the threshold for ascites formation), a state called clinically significant portal hypertension. The increased portal pressure raises hydrostatic pressure in the splanchnic capillary bed, favoring fluid transudation into the peritoneal cavity.\n\nSimultaneously, portal hypertension induces splanchnic vasodilation through increased production of nitric oxide (NO), carbon monoxide, and endogenous cannabinoids by the splanchnic endothelium. This vasodilation reduces effective arterial blood volume (EABV), activating neurohormonal compensatory systems: the renin-angiotensin-aldosterone system (RAAS), the sympathetic nervous system (SNS), and non-osmotic release of antidiuretic hormone (ADH/vasopressin). These systems promote renal sodium and water retention, expanding plasma volume. However, the retained fluid preferentially distributes to the splanchnic circulation (the path of least resistance due to vasodilation and portal hypertension), perpetuating ascites formation in a self-reinforcing cycle known as the peripheral arterial vasodilation hypothesis.\n\nHypoalbuminemia from impaired hepatic synthetic function reduces plasma oncotic pressure (albumin provides approximately 80% of intravascular oncotic pressure), further favoring fluid movement from the intravascular space into the peritoneal cavity. Normal serum albumin is 3.5 to 5.0 g/dL; in advanced cirrhosis, levels often fall below 2.5 g/dL. The serum-ascites albumin gradient (SAAG) calculated as serum albumin minus ascites albumin, is the most reliable test to determine the cause of ascites. A SAAG greater than or equal to 1.1 g/dL indicates portal hypertension as the cause (cirrhosis, heart failure, Budd-Chiari syndrome) with 97% accuracy. A SAAG less than 1.1 g/dL indicates non-portal-hypertensive causes (peritoneal carcinomatosis, tuberculosis, nephrotic syndrome, pancreatitis).\n\nAscitic fluid analysis is critical for identifying spontaneous bacterial peritonitis (SBP), a life-threatening infection of ascitic fluid occurring in 10 to 30% of hospitalized cirrhotic patients with ascites. SBP results from bacterial translocation across the edematous, permeable intestinal wall of portal-hypertensive patients (most commonly enteric gram-negative organisms such as Escherichia coli, Klebsiella pneumoniae, and streptococcal species). Diagnosis requires an ascitic fluid polymorphonuclear neutrophil (PMN) count of 250 cells/mm3 or greater, with or without positive culture. SBP carries a 20 to 40% in-hospital mortality rate and signals advanced liver disease with poor prognosis.\n\nAscites management follows a stepwise approach. Grade 1 (mild) ascites detectable only by ultrasound is managed with sodium restriction (less than 2 grams per day). Grade 2 (moderate) ascites with visible abdominal distension is treated with sodium restriction plus diuretics (spironolactone as first-line, often combined with furosemide in a 100:40 mg ratio). Grade 3 (large or tense) ascites requires large-volume paracentesis (LVP) with albumin infusion (6 to 8 grams per liter removed when more than 5 liters drained) to prevent post-paracentesis circulatory dysfunction (PPCD). Refractory ascites (unresponsive to maximum diuretic doses or recurring rapidly after LVP) may require transjugular intrahepatic portosystemic shunt (TIPS) placement or liver transplant evaluation."
    },
    riskFactors: [
      "Cirrhosis from any cause (alcohol, hepatitis B/C, NASH - accounts for 85% of ascites cases)",
      "Clinically significant portal hypertension (portal pressure gradient greater than 10 to 12 mmHg)",
      "Hypoalbuminemia (serum albumin less than 2.5 g/dL from impaired hepatic synthesis)",
      "Continued alcohol use in patients with alcoholic liver disease (prevents hepatic recovery)",
      "Hepatocellular carcinoma (may worsen portal hypertension or cause peritoneal carcinomatosis)",
      "Heart failure (right-sided or biventricular, causing hepatic congestion and portal hypertension)",
      "High dietary sodium intake (exceeding renal sodium excretion capacity in cirrhotic patients)"
    ],
    diagnostics: [
      "Diagnostic paracentesis: required for all new-onset ascites and all hospital admissions with ascites; obtain cell count with differential (PMN count 250 or greater indicates SBP), total protein, albumin, culture (inoculate blood culture bottles at bedside), glucose, and LDH",
      "Serum-ascites albumin gradient (SAAG): serum albumin minus ascites albumin; SAAG 1.1 or greater indicates portal hypertension; SAAG less than 1.1 indicates non-portal-hypertensive cause",
      "Abdominal ultrasound with Doppler: confirms ascites, assesses liver size and echogenicity, evaluates portal vein patency and flow direction, screens for hepatocellular carcinoma",
      "Serum labs: complete metabolic panel (sodium, creatinine, BUN for hepatorenal syndrome screening), albumin, INR/PT (synthetic function), CBC (thrombocytopenia from splenic sequestration in portal hypertension)",
      "24-hour urine sodium collection or spot urine sodium: assess response to diuretic therapy; goal urinary sodium excretion greater than dietary sodium intake; spot urine sodium greater than urinary potassium suggests adequate diuretic response",
      "MELD score calculation (bilirubin, INR, creatinine, sodium) to assess liver disease severity, prognosis, and transplant priority"
    ],
    management: [
      "Sodium restriction to less than 2 grams (88 mEq) per day as the foundation of ascites management; educate about hidden sodium in processed foods, restaurant meals, and medications",
      "Diuretic therapy: spironolactone 100 mg daily (starting dose, titrate up to 400 mg) combined with furosemide 40 mg daily (titrate up to 160 mg) maintaining the 100:40 ratio to balance potassium effects; goal weight loss 0.5 kg/day without peripheral edema, 1 kg/day with peripheral edema",
      "Large-volume paracentesis (LVP) for tense ascites: remove up to 8 to 10 liters per session; administer IV albumin 6 to 8 grams per liter removed when draining more than 5 liters to prevent post-paracentesis circulatory dysfunction",
      "SBP treatment: empiric IV ceftriaxone 2 grams daily (or cefotaxime 2 grams every 8 hours) for community-acquired SBP; IV albumin 1.5 g/kg on day 1 and 1 g/kg on day 3 to prevent hepatorenal syndrome",
      "SBP prophylaxis: norfloxacin 400 mg daily or trimethoprim-sulfamethoxazole for patients with prior SBP, GI bleed, or ascitic fluid protein less than 1.5 g/dL",
      "TIPS placement for refractory ascites unresponsive to diuretics and requiring frequent LVP; reduces portal pressure but may worsen hepatic encephalopathy",
      "Liver transplant evaluation for patients with refractory ascites (median survival 6 months without transplant) or recurrent SBP"
    ],
    nursingActions: [
      "Perform accurate daily weights at the same time, same scale, same clothing; ascites-related weight gain exceeding 0.5 to 1 kg/day indicates inadequate sodium restriction or diuretic response; report weight gain trend to provider for diuretic dose adjustment",
      "Measure abdominal girth daily at the level of the umbilicus with the patient supine; mark the measurement site with a skin marker to ensure consistency; an increase of more than 2 cm suggests ascites reaccumulation",
      "Assess for signs of SBP at every encounter: new or worsening abdominal pain or tenderness (may be subtle or absent in advanced cirrhosis), fever greater than 37.8 C, altered mental status (worsening hepatic encephalopathy), rebound tenderness; have low threshold for diagnostic paracentesis as SBP mortality increases with delayed treatment",
      "Monitor serum sodium, potassium, creatinine, and BUN during diuretic therapy: hold spironolactone if potassium exceeds 5.5 mEq/L, hold furosemide if potassium drops below 3.5 mEq/L; hold all diuretics if serum sodium drops below 125 mEq/L or creatinine rises more than 50% above baseline (risk of hepatorenal syndrome)",
      "During large-volume paracentesis: position patient supine or slightly lateral, monitor vital signs every 15 minutes during procedure, observe for signs of post-paracentesis circulatory dysfunction (tachycardia, hypotension, dizziness) for 1 hour after completion, administer prescribed IV albumin during or immediately after procedure",
      "Educate patient on low-sodium diet: provide specific examples (no added salt, avoid processed foods, canned soups, deli meats, restaurant meals); refer to dietitian; sodium content of less than 2 grams daily is difficult to achieve without education and support",
      "Assess for hepatic encephalopathy at each encounter using West Haven criteria or Number Connection Test: subtle personality changes, asterixis (flapping tremor), confusion, somnolence; lactulose adherence is critical for prevention"
    ],
    assessmentFindings: [
      "Abdominal distension with bulging flanks, positive shifting dullness (fluid moves to dependent side with position change), and positive fluid wave (palpable impulse transmitted across abdomen)",
      "Weight gain (may be rapid: several kilograms over days to weeks)",
      "Peripheral edema (bilateral lower extremity pitting edema, often preceding ascites)",
      "Dyspnea and orthopnea from diaphragmatic elevation by tense ascites compressing lung bases",
      "Caput medusae (distended periumbilical veins radiating from umbilicus), spider angiomata, palmar erythema indicating chronic liver disease",
      "Jaundice, scleral icterus, easy bruising from coagulopathy, and muscle wasting from malnutrition"
    ],
    signs: {
      left: [
        "Mild abdominal fullness and bloating",
        "Early satiety and decreased appetite",
        "Weight gain of 1 to 2 kg over several weeks",
        "Mild bilateral ankle edema",
        "Shifting dullness detected on abdominal percussion"
      ],
      right: [
        "Tense ascites with respiratory compromise (dyspnea, orthopnea, hypoxia)",
        "Spontaneous bacterial peritonitis (fever, abdominal pain, altered mental status)",
        "Hepatorenal syndrome (rising creatinine with oliguria in the absence of other renal pathology)",
        "Umbilical hernia rupture or rupture of ascites through abdominal wall",
        "Hepatic encephalopathy (confusion, asterixis, coma from ammonia accumulation)"
      ]
    },
    medications: [
      {
        name: "Spironolactone",
        type: "Potassium-Sparing Diuretic (Aldosterone Antagonist)",
        action: "Competitively blocks aldosterone receptors in the distal convoluted tubule and collecting duct, inhibiting sodium reabsorption and potassium excretion; directly counteracts the hyperaldosteronism that drives renal sodium retention in cirrhotic ascites; produces gentle natriuresis without the rapid electrolyte shifts of loop diuretics",
        sideEffects: "Hyperkalemia (dose-dependent, risk increases with renal impairment or concurrent ACE inhibitor/ARB use), painful gynecomastia and breast tenderness (anti-androgenic effect, occurs in up to 10%), menstrual irregularities, hyponatremia, metabolic acidosis",
        contra: "Hyperkalemia (potassium greater than 5.5 mEq/L), severe renal impairment (GFR less than 30 mL/min), Addison disease, concomitant use of other potassium-sparing agents or potassium supplements, anuria",
        pearl: "Spironolactone is the first-line and most important diuretic for cirrhotic ascites because it directly antagonizes the hyperaldosteronism driving sodium retention; onset of action is slow (3 to 5 days to full effect) so do not uptitrate more frequently than every 3 to 5 days; use 100:40 ratio with furosemide to maintain normokalemia; painful gynecomastia may require switch to amiloride (less effective but without anti-androgenic effects)"
      },
      {
        name: "Furosemide",
        type: "Loop Diuretic",
        action: "Inhibits the NKCC2 sodium-potassium-chloride cotransporter in the thick ascending limb of the loop of Henle, producing potent natriuresis and diuresis; used in combination with spironolactone to enhance sodium excretion and counterbalance spironolactone-induced hyperkalemia",
        sideEffects: "Hypokalemia, hyponatremia, hypomagnesemia, metabolic alkalosis (contraction alkalosis), prerenal azotemia (dehydration), ototoxicity (with rapid IV bolus or high doses), hyperuricemia, volume depletion with hypotension",
        contra: "Anuria unresponsive to fluid challenge, severe hyponatremia (sodium less than 125 mEq/L), hepatorenal syndrome (diuretics worsen renal function), uncorrected hypokalemia, sulfa allergy (cross-reactivity possible but rare)",
        pearl: "In cirrhotic ascites, furosemide is always used as an adjunct to spironolactone (never alone) because loop diuretics without aldosterone blockade are ineffective in hyperaldosteronism; maximum dose 160 mg/day; goal weight loss should not exceed 0.5 kg/day without edema or 1 kg/day with edema to prevent prerenal azotemia and hepatic encephalopathy; monitor potassium, sodium, and creatinine at least twice weekly during dose titration"
      },
      {
        name: "Albumin (Human, 25%)",
        type: "Plasma Volume Expander (Colloid)",
        action: "Provides oncotic pressure to maintain intravascular volume; in large-volume paracentesis, albumin infusion prevents post-paracentesis circulatory dysfunction (PPCD) by maintaining effective arterial blood volume; in SBP, albumin reduces hepatorenal syndrome incidence by 60% through plasma volume expansion",
        sideEffects: "Fluid overload (pulmonary edema if administered too rapidly in patients with cardiac dysfunction), allergic reactions (rare, including chills, fever, urticaria, anaphylaxis), hypertension from rapid volume expansion",
        contra: "Severe anemia (albumin cannot substitute for red blood cells), decompensated heart failure (volume overload risk), known allergy to albumin products",
        pearl: "For LVP removing more than 5 liters: administer 6 to 8 grams of albumin per liter removed (e.g., 8 liters removed equals 48 to 64 grams of 25% albumin, which is 192 to 256 mL); for SBP: 1.5 g/kg on day 1 and 1 g/kg on day 3; infuse at 1 to 2 mL/min for 25% albumin; the 25% concentration is preferred over 5% because it provides oncotic pull without excessive volume"
      }
    ],
    pearls: [
      "Every patient admitted to the hospital with ascites requires a diagnostic paracentesis to rule out SBP, regardless of symptoms; SBP can present with subtle findings or be completely asymptomatic in advanced cirrhosis, and delayed diagnosis markedly increases mortality",
      "The SAAG is superior to the exudate/transudate classification for determining the cause of ascites; a SAAG of 1.1 or greater has 97% accuracy for portal hypertension as the cause",
      "Post-paracentesis circulatory dysfunction (PPCD) occurs when large-volume paracentesis (more than 5 liters) without albumin replacement causes effective hypovolemia, activating RAAS and causing rapid ascites reaccumulation, hyponatremia, and hepatorenal syndrome; IV albumin prevents this",
      "Hepatorenal syndrome (HRS) is functional renal failure in advanced cirrhosis caused by extreme renal vasoconstriction from neurohormonal activation; it is heralded by rising creatinine with oliguria in the absence of structural renal disease; it is the most ominous complication of refractory ascites",
      "Diuretic-induced weight loss should not exceed 0.5 kg per day in patients without peripheral edema, as the peritoneum can only reabsorb approximately 500 mL of ascitic fluid daily; exceeding this rate causes intravascular volume depletion",
      "SBP prophylaxis with norfloxacin or trimethoprim-sulfamethoxazole reduces recurrence from 70% to 20% at one year; it is indicated after a first episode of SBP, in patients with GI bleeding, and in those with ascitic protein less than 1.5 g/dL with renal or liver dysfunction",
      "Refractory ascites (recurrence within 4 weeks of LVP or no response to maximum diuretic doses) carries a median survival of only 6 months and is an indication for liver transplant evaluation"
    ],
    quiz: [
      {
        question: "A cirrhotic patient is admitted with new-onset ascites. The ascitic fluid analysis shows a SAAG of 1.4 g/dL and PMN count of 380 cells/mm3. What does this indicate?",
        options: [
          "Peritoneal carcinomatosis requiring oncology referral",
          "Portal hypertension-related ascites with spontaneous bacterial peritonitis requiring immediate antibiotics",
          "Nephrotic syndrome-related ascites requiring nephrology consult",
          "Normal ascitic fluid requiring no additional intervention"
        ],
        correct: 1,
        rationale: "SAAG of 1.4 (greater than 1.1) confirms portal hypertension as the cause. PMN count of 380 (greater than 250 cells/mm3) confirms SBP. This requires immediate empiric antibiotics (ceftriaxone or cefotaxime) and IV albumin (1.5 g/kg on day 1, 1 g/kg on day 3). Delay in treatment increases mortality. Peritoneal carcinomatosis would show SAAG less than 1.1."
      },
      {
        question: "A nurse is managing a cirrhotic patient on spironolactone 200 mg and furosemide 80 mg daily. Morning labs show potassium 5.8 mEq/L, sodium 128 mEq/L, and creatinine 2.1 mg/dL (baseline 0.9). What is the priority action?",
        options: [
          "Increase furosemide to 120 mg to enhance potassium excretion",
          "Hold both diuretics, notify the provider, and monitor for signs of hepatorenal syndrome",
          "Continue current diuretics and recheck labs in 48 hours",
          "Administer IV potassium to correct the hyperkalemia"
        ],
        correct: 1,
        rationale: "This patient has multiple indications to hold diuretics: hyperkalemia (5.8 mEq/L, greater than 5.5 threshold), hyponatremia (128, less than 130 threshold), and creatinine more than doubled from baseline (2.1 from 0.9, suggesting hepatorenal syndrome). All diuretics must be held immediately. The rising creatinine with diuretic use may indicate hepatorenal syndrome, which requires volume expansion with albumin, not more diuretics."
      },
      {
        question: "During large-volume paracentesis, 7 liters of ascitic fluid are removed. How much IV albumin should the nurse administer?",
        options: [
          "No albumin is needed for paracentesis of any volume",
          "25 grams of 25% albumin (100 mL) as a standard dose",
          "42 to 56 grams of 25% albumin (6 to 8 grams per liter removed for volumes exceeding 5 liters)",
          "100 grams of 5% albumin (2000 mL) to match fluid removed"
        ],
        correct: 2,
        rationale: "When more than 5 liters are removed during LVP, albumin should be administered at 6 to 8 grams per liter removed to prevent post-paracentesis circulatory dysfunction. For 7 liters: 7 x 6 to 8 = 42 to 56 grams of albumin. Using 25% albumin, this equals 168 to 224 mL. Without albumin replacement, PPCD causes RAAS activation, rapid ascites reaccumulation, hyponatremia, and increased risk of hepatorenal syndrome."
      }
    ]
  },

  "assessment-rn": {
    title: "Comprehensive Nursing Assessment",
    cellular: {
      title: "Systematic Physical Assessment and Clinical Reasoning",
      content: "Comprehensive nursing assessment is the systematic, evidence-based process of collecting subjective and objective data about a patient's health status to identify actual and potential problems, establish baselines, and guide clinical decision-making. For the registered nurse, assessment is the first step of the nursing process and represents the foundation upon which all subsequent planning, implementation, and evaluation of care is built. Unlike task-focused vital sign collection, RN-level assessment requires integration of anatomical knowledge, pathophysiology, pharmacology, and clinical reasoning to detect subtle changes that may signal clinical deterioration.\n\nThe health history (subjective data) begins with the chief complaint documented in the patient's own words and explored using a standardized framework such as OLDCARTS (Onset, Location, Duration, Character, Aggravating factors, Relieving factors, Timing, Severity) or PQRSTU (Provocation, Quality, Region/Radiation, Severity, Timing, Understanding). The history must capture past medical history, surgical history, medications (including over-the-counter and herbal supplements), allergies (with specific reaction type documented, distinguishing true allergy from intolerance), family history (first-degree relatives for genetic risk), social history (tobacco, alcohol, substance use quantified in pack-years and drinks per week; living situation, support systems, occupation, advance directives), and review of systems (systematic head-to-toe questioning about symptoms in each body system).\n\nThe physical examination (objective data) uses four fundamental techniques applied in a consistent sequence. Inspection is always performed first: visual observation of the patient's general appearance, level of consciousness, body habitus, skin color and integrity, symmetry, and any abnormalities. Auscultation follows inspection (performed before palpation and percussion in the abdominal assessment because palpation can alter bowel sounds). Percussion determines organ size and the presence of fluid or air in body cavities: resonance over normal lung tissue, hyperresonance over air-filled spaces (emphysema, pneumothorax), dullness over solid organs (liver, spleen) or fluid (pleural effusion, ascites), and tympany over gas-filled structures (stomach, distended bowel). Palpation, performed last, assesses temperature, moisture, texture, turgor, tenderness, masses, organ size, and pulsations.\n\nNeurological assessment evaluates five domains. Level of consciousness is assessed using the Glasgow Coma Scale (GCS: eye opening 1-4, verbal response 1-5, motor response 1-6; total 3-15; less than 8 indicates coma and need for airway protection) and documented objectively as alert, verbal, pain-responsive, or unresponsive (AVPU). Cranial nerve examination evaluates the twelve cranial nerves systematically (olfactory through hypoglossal). Motor function assessment includes muscle strength grading (0 to 5 scale), tone, coordination, and gait. Sensory examination tests light touch, pain, temperature, proprioception, and vibration. Reflexes are graded on a 0 to 4+ scale with 2+ being normal.\n\nCardiovascular assessment begins with vital signs interpreted in the context of the patient's baseline and clinical status. Heart sounds are auscultated at five anatomic landmarks: aortic (right second intercostal space), pulmonic (left second intercostal space), Erb's point (left third intercostal space), tricuspid (left lower sternal border), and mitral/apical (fifth intercostal space at midclavicular line). Normal heart sounds include S1 (closure of mitral and tricuspid valves at the start of systole) and S2 (closure of aortic and pulmonic valves at the start of diastole). Abnormal sounds include S3 (early diastolic filling sound associated with volume overload and heart failure), S4 (late diastolic sound from atrial contraction against a stiff ventricle in hypertension and LV hypertrophy), and murmurs characterized by timing (systolic vs diastolic), location, radiation, grade (I to VI), and quality (blowing, harsh, rumbling).\n\nRespiratory assessment includes inspection of respiratory rate, depth, pattern, and effort (use of accessory muscles, nasal flaring, intercostal retractions, pursed-lip breathing). Auscultation of lung sounds identifies normal vesicular, bronchovesicular, and bronchial breath sounds, and abnormal adventitious sounds: crackles (fine crackles in early heart failure and pulmonary fibrosis; coarse crackles in pneumonia and pulmonary edema), wheezes (high-pitched in asthma and COPD; low-pitched rhonchi from secretions in large airways), stridor (high-pitched inspiratory sound indicating upper airway obstruction), and pleural friction rub (grating sound from inflamed pleural surfaces). Pulse oximetry provides continuous non-invasive monitoring of oxygen saturation, but has limitations: unreliable in carbon monoxide poisoning (falsely normal SpO2), severe anemia, hypothermia, poor perfusion, dark nail polish, and in patients with chronic hypoxemia (COPD patients may have a baseline SpO2 of 88 to 92%).\n\nAbdominal assessment follows the unique sequence of inspection, auscultation, percussion, and then palpation. Auscultation must precede palpation because physical manipulation can alter bowel sounds. Bowel sounds are assessed in all four quadrants: normal is 5 to 30 clicks or gurgles per minute, hypoactive (less than 5 per minute) suggests ileus or peritonitis, hyperactive suggests obstruction (high-pitched, tinkling sounds) or gastroenteritis. Percussion determines liver span (normal 6 to 12 cm at the right midclavicular line), splenic size, and presence of ascites (shifting dullness, fluid wave). Palpation identifies organomegaly, masses, tenderness, and peritoneal signs. Special tests include Murphy sign (inspiratory arrest during right subcostal palpation, positive in cholecystitis), McBurney sign (tenderness at McBurney's point in the right lower quadrant, suggesting appendicitis), Rovsing sign (right lower quadrant pain with left lower quadrant palpation, suggesting appendicitis), and rebound tenderness (pain upon sudden release of abdominal pressure, indicating peritoneal irritation).\n\nSkin assessment uses the Braden Scale to evaluate pressure injury risk (sensory perception, moisture, activity, mobility, nutrition, friction/shear; scores 6 to 23, with 18 or below indicating at-risk status). Wound assessment includes location, size (length x width x depth in centimeters), wound bed characteristics (granulation, slough, eschar), drainage (serous, sanguineous, serosanguineous, purulent), periwound skin condition, and tunnel or undermining measurement. Pain assessment uses validated tools appropriate for the patient population: numeric rating scale (0 to 10) for communicating adults, Wong-Baker FACES for children or cognitively impaired, FLACC (Face, Legs, Activity, Cry, Consolability) for preverbal children, and CPOT (Critical-Care Pain Observation Tool) for intubated patients."
    },
    riskFactors: [
      "Incomplete or inaccurate assessment leading to missed clinical deterioration (failure to rescue)",
      "Inconsistent assessment technique resulting in unreliable trending of findings over time",
      "Time pressure and competing priorities causing abbreviated assessments that miss subtle changes",
      "Cultural and language barriers interfering with subjective data collection",
      "Patient cognitive impairment or altered level of consciousness limiting history and participation",
      "Reliance on technology (monitors, labs) without integrating clinical assessment findings",
      "Inadequate documentation of assessment findings preventing continuity of care across shifts"
    ],
    diagnostics: [
      "Glasgow Coma Scale (GCS): standardized neurological assessment tool scoring eye opening (1-4), verbal response (1-5), and motor response (1-6); total 3 to 15; score less than 8 defines coma and need for definitive airway management",
      "Braden Scale: pressure injury risk assessment evaluating six subscales; score 18 or less indicates at-risk status requiring preventive interventions (repositioning every 2 hours, pressure-redistribution mattress, skin moisture management)",
      "Validated pain assessment tools: Numeric Rating Scale (NRS 0-10), Wong-Baker FACES, FLACC (pediatric), CPOT (critical care), Abbey Pain Scale (dementia) selected based on patient population and cognitive status",
      "Early Warning Score systems (NEWS2, MEWS): aggregate vital sign-based scoring systems that detect clinical deterioration; escalation criteria trigger rapid response team activation",
      "Focused assessment tools: NIHSS for stroke severity, CIWA-Ar for alcohol withdrawal, CAGE questionnaire for alcohol use disorder screening, PHQ-9 for depression screening, Morse Fall Scale for fall risk",
      "Diagnostic imaging and laboratory studies ordered based on assessment findings to confirm clinical suspicions and establish diagnoses"
    ],
    management: [
      "Perform systematic head-to-toe assessment at beginning of each shift and focused assessments as indicated by patient condition changes, interventions, or medication administration",
      "Use SBAR (Situation, Background, Assessment, Recommendation) framework for communicating assessment findings to providers to ensure critical information is conveyed efficiently",
      "Activate Rapid Response Team (RRT) when assessment identifies signs of clinical deterioration meeting institutional escalation criteria",
      "Delegate appropriate assessment tasks to UAP (vital signs, intake/output, blood glucose monitoring) while retaining RN responsibility for initial assessment, interpretation, and abnormal findings",
      "Document assessment findings objectively and completely in the electronic health record with accurate timestamps, avoiding subjective interpretations without supporting data",
      "Perform focused reassessments after interventions: reassess pain 30 minutes after IV medication and 60 minutes after oral medication; reassess vital signs after antihypertensive or vasopressor titration",
      "Integrate assessment findings with clinical knowledge to identify patterns suggesting clinical deterioration before overt decompensation occurs (early recognition saves lives)"
    ],
    nursingActions: [
      "Perform comprehensive head-to-toe assessment within 1 hour of shift start or patient admission, establishing baseline for all systems: neurological (GCS, pupil reactivity, orientation, motor strength), cardiovascular (heart sounds, rhythm, peripheral pulses, capillary refill, edema), respiratory (lung sounds, SpO2, work of breathing), gastrointestinal (bowel sounds, abdominal tenderness, last bowel movement), genitourinary (urine output, characteristics), integumentary (skin integrity, Braden score, wound status), musculoskeletal (range of motion, gait, fall risk), and psychosocial (mood, affect, safety concerns)",
      "Assess vital signs in clinical context: a blood pressure of 90/60 may be normal for a young healthy adult but concerning in an elderly patient on antihypertensives; a heart rate of 110 in a post-surgical patient requires assessment for pain, hypovolemia, infection, or pulmonary embolism rather than simple documentation",
      "Perform focused abdominal assessment using correct sequence (inspection, auscultation, percussion, palpation); auscultate BEFORE palpation as touching the abdomen can alter bowel sounds; listen for at least 1 to 2 minutes before declaring bowel sounds absent",
      "Auscultate heart sounds at all five landmarks with the patient in multiple positions: sitting upright and leaning forward best detects aortic regurgitation murmur; left lateral decubitus position best detects S3 gallop and mitral stenosis murmur; document any murmurs by location, timing, grade, and radiation pattern",
      "Perform neurovascular checks (the 6 Ps: pain, pallor, pulselessness, paresthesia, paralysis, poikilothermia) on any extremity with a cast, splint, tight dressing, or recent vascular procedure; compare bilaterally; report any changes immediately as compartment syndrome can cause permanent damage within 4 to 6 hours",
      "Use standardized handoff communication (SBAR or I-PASS) when transferring patient care: include active problems, current assessment findings, pending results, tasks to be completed, anticipated changes, and contingency plans for potential deterioration",
      "Recognize and act on assessment findings that require immediate intervention: absent or diminished pulses in an extremity (vascular emergency), new-onset unilateral weakness or speech difficulty (stroke code), sudden severe headache (subarachnoid hemorrhage), respiratory distress with absent breath sounds on one side (tension pneumothorax), pulseless extremity after cardiac catheterization (arterial occlusion)"
    ],
    assessmentFindings: [
      "Normal baseline findings for comparison: alert and oriented x4, skin warm and dry with brisk capillary refill, regular heart rhythm without murmur, clear bilateral breath sounds, soft non-tender abdomen with normoactive bowel sounds, equal bilateral pulses, appropriate pain level",
      "Abnormal cardiovascular findings: irregular rhythm, new murmur, S3 gallop (heart failure), jugular venous distension, peripheral edema (grade 1+ to 4+), diminished peripheral pulses, capillary refill greater than 3 seconds",
      "Abnormal respiratory findings: crackles (fine or coarse), wheezes, stridor, diminished or absent breath sounds, tachypnea (RR greater than 20), accessory muscle use, SpO2 less than 94% (or below baseline in COPD)",
      "Abnormal neurological findings: decreased GCS, unequal pupils, new focal weakness, facial droop, slurred speech, confusion, inability to follow commands, abnormal posturing (decorticate or decerebrate)",
      "Abnormal abdominal findings: absent bowel sounds (ileus), high-pitched tinkling bowel sounds (obstruction), rebound tenderness (peritonitis), rigid board-like abdomen (surgical emergency), distension, palpable mass",
      "Abnormal integumentary findings: stage I to IV pressure injuries, non-blanching erythema, cyanosis (central vs peripheral), jaundice, mottling, purpura, wound drainage changes (serous to purulent)"
    ],
    signs: {
      left: [
        "Mild changes from baseline vital signs",
        "Subjective complaints (pain, nausea, dizziness) without objective findings",
        "Subtle personality or behavior changes",
        "Mild tachycardia or slight blood pressure changes",
        "Minor wound changes requiring monitoring"
      ],
      right: [
        "Acute neurological changes: new-onset confusion, unilateral weakness, pupil changes, GCS drop of 2 or more points",
        "Hemodynamic instability: SBP less than 90, MAP less than 65, new arrhythmia, absent pulses",
        "Respiratory failure: RR greater than 30 or less than 8, SpO2 less than 88%, stridor, silent chest",
        "Acute abdomen: rigid board-like abdomen, rebound tenderness, absent bowel sounds with distension",
        "Signs of sepsis: temperature greater than 38.3 or less than 36 C, HR greater than 90, RR greater than 20, WBC greater than 12,000 or less than 4,000"
      ]
    },
    medications: [
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist (Emergency Reversal Agent)",
        action: "Competitively binds mu, kappa, and delta opioid receptors, displacing opioid agonists and rapidly reversing respiratory depression, sedation, and hypotension caused by opioid overdose; onset of action 1 to 2 minutes IV, 2 to 5 minutes IM/IN",
        sideEffects: "Acute opioid withdrawal syndrome (agitation, nausea, vomiting, diaphoresis, tachycardia, hypertension, piloerection, pain), pulmonary edema (rare), seizures (rare), ventricular arrhythmias (rare, from catecholamine surge)",
        contra: "Known hypersensitivity to naloxone (extremely rare); use with caution in opioid-dependent patients (precipitates withdrawal) and in cardiovascular disease patients (catecholamine surge may cause cardiac events)",
        pearl: "Duration of action (30 to 90 minutes) is shorter than most opioids; the patient MUST be monitored for re-sedation and recurrent respiratory depression after naloxone wears off; may need repeat doses or continuous infusion; titrate to respiratory rate above 12 (not full consciousness) to avoid precipitating severe withdrawal with unnecessary pain; intranasal route (4 mg) available for first-responder and community use"
      },
      {
        name: "Epinephrine",
        type: "Catecholamine (Non-selective Alpha and Beta Agonist)",
        action: "Stimulates alpha-1 receptors (peripheral vasoconstriction increasing SVR and blood pressure), beta-1 receptors (increased heart rate and contractility), and beta-2 receptors (bronchodilation); used in cardiac arrest, anaphylaxis, and severe hypotension",
        sideEffects: "Tachycardia, hypertension, ventricular arrhythmias, myocardial ischemia (from increased myocardial oxygen demand), anxiety, tremor, headache, tissue necrosis with extravasation",
        contra: "No absolute contraindications in cardiac arrest or anaphylaxis (benefits always outweigh risks); relative contraindications include tachyarrhythmias, coronary artery disease, narrow-angle glaucoma, concurrent use of MAO inhibitors or non-selective beta-blockers (exaggerated hypertensive response)",
        pearl: "Cardiac arrest dose: 1 mg (1:10,000 concentration) IV every 3 to 5 minutes; anaphylaxis dose: 0.3 to 0.5 mg (1:1,000 concentration) IM in anterolateral thigh (NOT IV in anaphylaxis unless peri-arrest); know the concentration difference - wrong concentration IV can cause fatal hypertension; monitor for extravasation with IV infusion and treat with phentolamine injection if it occurs"
      },
      {
        name: "Nitroglycerin (Sublingual)",
        type: "Organic Nitrate (Vasodilator)",
        action: "Converts to nitric oxide (NO) which activates guanylate cyclase, increasing cGMP in vascular smooth muscle; produces venodilation (reducing preload and myocardial oxygen demand at low doses) and arteriolar dilation (reducing afterload at higher doses); relieves anginal chest pain by improving myocardial oxygen supply-demand balance",
        sideEffects: "Headache (most common, due to meningeal vasodilation), hypotension, reflex tachycardia, dizziness, flushing, syncope, methemoglobinemia (rare, with excessive doses)",
        contra: "Concurrent use of phosphodiesterase-5 inhibitors (sildenafil, tadalafil, vardenafil) within 24 to 48 hours (causes severe, refractory hypotension), severe aortic stenosis, hypertrophic obstructive cardiomyopathy, right ventricular infarction (preload-dependent), hypotension (SBP less than 90 mmHg), concurrent use of riociguat",
        pearl: "Before administering sublingual nitroglycerin for chest pain: verify blood pressure (SBP must be above 90 mmHg), ask about PDE-5 inhibitor use in the last 24 to 48 hours, have the patient sit or lie down (prevents orthostatic hypotension); may repeat every 5 minutes for up to 3 doses; if pain persists after 1 dose, activate emergency response; tablets lose potency when exposed to light or air - store in original dark glass container, replace every 6 months"
      }
    ],
    pearls: [
      "Assessment is the only step of the nursing process that CANNOT be delegated; the RN must perform the initial assessment, interpret findings, and determine the nursing care plan; UAPs can measure vital signs and report values but cannot interpret them",
      "The abdominal examination is the only assessment where auscultation precedes palpation and percussion; palpating or percussing before listening can stimulate peristalsis and produce falsely hyperactive bowel sounds",
      "Glasgow Coma Scale less than 8 means intubate: this mnemonic reminds nurses that a GCS below 8 indicates the patient cannot protect their airway and requires endotracheal intubation for airway protection",
      "Trending is more valuable than any single assessment: a heart rate that increases from 78 to 88 to 98 to 110 over 4 hours reveals a concerning trajectory even though each individual value may fall within normal range; the RN must recognize patterns across serial assessments",
      "Assess pain using the right tool for the population: NRS for alert adults, FACES for children 3 and older, FLACC for infants and preverbal children, CPOT for intubated patients, Abbey for patients with advanced dementia; the wrong tool yields unreliable data",
      "The six Ps of neurovascular assessment (Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia) must be checked hourly on any extremity with a new cast, splint, or post-vascular procedure; compartment syndrome causes irreversible damage within 4 to 6 hours",
      "A change in level of consciousness is often the earliest sign of clinical deterioration; subtle changes such as new confusion, agitation, or increased somnolence should be investigated immediately rather than attributed to sleep deprivation or baseline behavior"
    ],
    quiz: [
      {
        question: "A nurse is performing an abdominal assessment on a patient with suspected appendicitis. In which order should the assessment techniques be performed?",
        options: [
          "Palpation, percussion, inspection, auscultation",
          "Inspection, palpation, percussion, auscultation",
          "Inspection, auscultation, percussion, palpation",
          "Auscultation, inspection, palpation, percussion"
        ],
        correct: 2,
        rationale: "The abdominal assessment uniquely follows the sequence: inspection, auscultation, percussion, palpation. Auscultation must be performed BEFORE palpation and percussion because physically manipulating the abdomen can stimulate peristalsis and alter bowel sounds, producing inaccurate findings. This is the only body system where the standard inspection-palpation-percussion-auscultation sequence is modified."
      },
      {
        question: "A post-operative patient has vital signs trending as follows over 4 hours: HR 82, 88, 96, 108; BP 130/80, 118/72, 108/68, 95/60; RR 16, 18, 20, 24. The patient reports feeling fine. What should the nurse do?",
        options: [
          "Document the findings and continue routine monitoring since the patient reports feeling fine",
          "Recognize the deteriorating trend, perform a focused assessment for possible hemorrhage or sepsis, and notify the provider using SBAR communication",
          "Administer IV fluid bolus without notifying the provider",
          "Increase the frequency of vital signs to every 15 minutes and wait for further changes"
        ],
        correct: 1,
        rationale: "The vital sign trends show progressive tachycardia, hypotension, and tachypnea over 4 hours, a pattern consistent with compensated shock (likely hemorrhage or sepsis in a post-operative patient). Patient self-report of feeling fine does not override objective trending data. The nurse must perform a focused assessment (wound, drain output, pain, urine output, mental status, skin assessment), assess for bleeding or infection, and notify the provider immediately using SBAR. Waiting for further changes delays intervention during the compensatory phase when treatment is most effective."
      },
      {
        question: "A nurse is assessing a patient and hears a low-pitched extra heart sound immediately after S2 at the apex when the patient is in the left lateral decubitus position. What does this finding most likely represent?",
        options: [
          "S4 heart sound associated with hypertensive heart disease",
          "S3 heart sound associated with volume overload and possible heart failure",
          "A normal finding in all adult patients",
          "A systolic ejection murmur from aortic stenosis"
        ],
        correct: 1,
        rationale: "An extra heart sound immediately after S2 (early diastole) heard best at the apex in the left lateral decubitus position is an S3 gallop. S3 represents rapid ventricular filling into a dilated, volume-overloaded ventricle and is associated with heart failure. It is often described as sounding like the word 'Kentucky' (S1-S2-S3). S4 occurs just before S1 (late diastole). S3 is normal in children and young adults but pathological in adults over 40."
      }
    ]
  },

  "atn-rn": {
    title: "Acute Tubular Necrosis (ATN)",
    cellular: {
      title: "Pathophysiology of Tubular Epithelial Injury and Recovery",
      content: "Acute tubular necrosis (ATN) is the most common cause of intrinsic acute kidney injury (AKI), accounting for approximately 45 to 50% of all AKI cases in hospitalized patients. ATN results from ischemic or nephrotoxic injury to the renal tubular epithelial cells, leading to tubular cell death, cast formation, tubular obstruction, and a precipitous decline in glomerular filtration rate (GFR). Understanding the cellular mechanisms of injury and repair is essential for the RN to anticipate the clinical course and implement evidence-based interventions.\n\nThe renal tubular epithelium is particularly vulnerable to ischemic injury because of the kidney's unique hemodynamic characteristics. Despite receiving 20 to 25% of cardiac output, the renal medulla operates in a state of relative hypoxia (PO2 of 10 to 20 mmHg compared to 50 mmHg in the cortex). The proximal tubule and thick ascending limb of the loop of Henle have the highest metabolic demands due to their intensive active transport functions (reabsorbing 65% of filtered sodium, glucose, amino acids, bicarbonate, and water via Na+/K+-ATPase pumps), yet they receive their blood supply from the peritubular capillaries, which carry already partially deoxygenated blood. This creates a supply-demand mismatch that makes these segments exquisitely sensitive to any reduction in oxygen delivery.\n\nIschemic ATN occurs when renal blood flow is reduced sufficiently to cause tubular cell injury. Common causes include prolonged hypotension (septic shock, cardiogenic shock, hemorrhage), major surgery (especially cardiac and aortic surgery with cross-clamping), and severe volume depletion. The pathogenesis proceeds through four phases. In the initiation phase (hours to days), reduced oxygen delivery depletes cellular ATP, causing failure of the Na+/K+-ATPase pump, loss of cell polarity, calcium influx, mitochondrial dysfunction, generation of reactive oxygen species (ROS), and activation of inflammatory cascades. Tubular cells undergo necrosis and apoptosis, detach from the basement membrane, and are shed into the tubular lumen where they form obstructive casts (muddy brown granular casts, the pathognomonic urinalysis finding of ATN).\n\nThe extension phase involves ongoing inflammation and further cell death. Injured tubular cells release damage-associated molecular patterns (DAMPs) that activate toll-like receptors on immune cells, recruiting neutrophils and macrophages that amplify tissue injury through additional ROS production, protease release, and cytokine secretion. Endothelial cell injury in the peritubular capillaries causes microvascular congestion, further reducing oxygen delivery to the outer medulla in a vicious cycle. Tubuloglomerular feedback (TGF) is activated: damaged tubular cells in the macula densa fail to reabsorb sodium normally, increasing sodium concentration at the macula densa, which signals the juxtaglomerular apparatus to constrict the afferent arteriole via adenosine release, further reducing GFR.\n\nThe maintenance phase (1 to 2 weeks) is characterized by persistently low GFR despite correction of the initial insult. During this phase, GFR remains at 5 to 10 mL/min, and the patient develops the complications of AKI: fluid overload, hyperkalemia, metabolic acidosis, uremia, and electrolyte disturbances. The maintenance phase duration depends on the severity and duration of the initial insult and the patient's comorbidities.\n\nThe recovery phase involves regeneration of the tubular epithelium. Surviving tubular cells at the margins of injury dedifferentiate, proliferate, and migrate to cover the denuded basement membrane, then redifferentiate to restore tubular function. This regenerative capacity is unique to the kidney and explains why ATN is potentially reversible, unlike many forms of nephron loss. Recovery is heralded by a polyuric phase: as tubular function returns, the concentrating ability of the recovering tubules is impaired, producing large volumes of dilute urine (often 3 to 5 liters per day). This diuretic phase carries its own risks: hypovolemia, hyponatremia, hypokalemia, and hypomagnesemia from the excessive dilute urine output if losses are not replaced.\n\nNephrotoxic ATN results from direct tubular cell injury by exogenous or endogenous toxins. Common exogenous nephrotoxins include aminoglycoside antibiotics (gentamicin, tobramycin, which accumulate in proximal tubular cells and disrupt mitochondrial function and phospholipid metabolism), radiocontrast agents (cause direct tubular toxicity and medullary vasoconstriction, termed contrast-induced nephropathy), amphotericin B (inserts into cell membranes, increasing permeability), cisplatin (forms DNA adducts causing apoptosis), and nonsteroidal anti-inflammatory drugs (NSAIDs, which inhibit prostaglandin-mediated afferent arteriolar dilation). Endogenous nephrotoxins include myoglobin (rhabdomyolysis), hemoglobin (hemolytic reactions), uric acid (tumor lysis syndrome), and light chains (multiple myeloma cast nephropathy).\n\nDiagnosis of ATN relies on clinical context and urinalysis findings. The fractional excretion of sodium (FENa) distinguishes prerenal AKI from ATN: FENa less than 1% indicates prerenal (tubules are functioning and avidly reabsorbing sodium), while FENa greater than 2% indicates ATN (damaged tubules cannot reabsorb sodium). Urine sediment examination revealing muddy brown granular casts and renal tubular epithelial cells is the hallmark finding. Urine osmolality in ATN is typically less than 350 mOsm/kg (isosthenuria: the damaged tubules cannot concentrate urine), compared to greater than 500 mOsm/kg in prerenal AKI."
    },
    riskFactors: [
      "Prolonged hypotension from any cause: septic shock, cardiogenic shock, hemorrhagic shock, distributive shock (most common cause of ischemic ATN)",
      "Major surgery, especially cardiac surgery with cardiopulmonary bypass and aortic cross-clamping (30 to 50% incidence of AKI)",
      "Nephrotoxic medications: aminoglycosides, amphotericin B, cisplatin, IV contrast dye, NSAIDs, vancomycin at high trough levels",
      "Rhabdomyolysis (crush injury, prolonged immobilization, statin myopathy, seizures, extreme exertion releasing myoglobin)",
      "Pre-existing chronic kidney disease (reduced nephron mass limits compensatory capacity)",
      "Advanced age (age-related decline in GFR, reduced renal reserve, frequent polypharmacy with nephrotoxins)",
      "Volume depletion or dehydration (reduced renal perfusion exacerbating nephrotoxic and ischemic injury)"
    ],
    diagnostics: [
      "Serum creatinine: rising creatinine is the primary marker of AKI; ATN typically shows progressive rise over 24 to 72 hours; KDIGO criteria define AKI as creatinine rise of 0.3 mg/dL within 48 hours or 1.5 times baseline within 7 days",
      "Urinalysis with microscopy: muddy brown granular casts (pathognomonic for ATN), renal tubular epithelial cells, coarse granular casts; in contrast, prerenal AKI shows hyaline casts or bland sediment",
      "Fractional excretion of sodium (FENa): calculated as (urine sodium x serum creatinine) / (serum sodium x urine creatinine) x 100; FENa greater than 2% supports ATN; FENa less than 1% supports prerenal; FENa is unreliable with diuretic use (use FE-urea instead)",
      "Urine sodium: greater than 40 mEq/L in ATN (damaged tubules cannot reabsorb sodium); less than 20 mEq/L in prerenal AKI (tubules avidly reabsorb sodium)",
      "BUN-to-creatinine ratio: greater than 20:1 suggests prerenal (urea is preferentially reabsorbed); 10 to 15:1 ratio suggests intrinsic renal disease (ATN)",
      "Renal ultrasound: normal kidney size with increased echogenicity in ATN; rules out obstructive (post-renal) AKI from hydronephrosis"
    ],
    management: [
      "Identify and treat the underlying cause: fluid resuscitation for hypovolemia, vasopressors for septic shock, discontinuation of nephrotoxic medications, relief of obstruction",
      "Maintain euvolemia: IV fluid resuscitation with isotonic crystalloid (0.9% NS or lactated Ringer's) for volume-depleted patients; avoid excessive fluid administration in oliguric ATN to prevent pulmonary edema",
      "Correct electrolyte abnormalities: treat hyperkalemia aggressively (calcium gluconate for cardiac protection, insulin-dextrose to shift potassium intracellularly, sodium polystyrene sulfonate or patiromer for potassium binding); correct metabolic acidosis with sodium bicarbonate if pH less than 7.1",
      "Avoid additional nephrotoxic insults: hold NSAIDs, aminoglycosides, ACE inhibitors/ARBs during acute phase; use isosmolar contrast agents only when absolutely necessary with pre-hydration; adjust all medications for renal function",
      "Diuretic therapy: furosemide may be used to manage fluid overload but does NOT accelerate recovery or reduce mortality; convert oliguric to non-oliguric ATN to facilitate fluid management",
      "Renal replacement therapy (dialysis): indications include refractory hyperkalemia (greater than 6.5 mEq/L), severe metabolic acidosis (pH less than 7.1), volume overload unresponsive to diuretics, uremic symptoms (encephalopathy, pericarditis, bleeding), and BUN greater than 100 mg/dL",
      "During recovery (polyuric) phase: monitor and replace fluid and electrolyte losses closely; urine output may exceed 3 to 5 liters/day with electrolyte wasting"
    ],
    nursingActions: [
      "Monitor strict intake and output with hourly urine output measurement; oliguria (less than 0.5 mL/kg/hour for 6 hours) is an early indicator of AKI and should trigger immediate assessment of volume status, medication review, and provider notification; daily weights are essential for tracking fluid balance",
      "Monitor serum creatinine and BUN trends at least daily (more frequently in critical care); recognize that creatinine rises lag behind actual GFR decline by 24 to 48 hours, so a normal creatinine does not exclude early ATN; a rising creatinine trajectory warrants proactive intervention",
      "Assess for hyperkalemia at each lab draw and with any ECG changes: peaked T waves, widened QRS, sine wave pattern are ECG manifestations of progressively worsening hyperkalemia; potassium above 6.0 mEq/L with ECG changes is a medical emergency requiring calcium gluconate for cardiac membrane stabilization followed by insulin-dextrose for intracellular potassium shifting",
      "Review all medications daily for nephrotoxic potential and dose appropriateness for current renal function; common offending agents in the inpatient setting include NSAIDs, ACE inhibitors/ARBs (hold in AKI), aminoglycosides (check trough levels), vancomycin (check trough levels), and IV contrast dye; advocate for medication alternatives when possible",
      "During the polyuric recovery phase: match IV fluid replacement to urine output to prevent hypovolemia; monitor electrolytes every 6 to 12 hours as potassium, sodium, and magnesium losses can be substantial; teach the patient to maintain adequate oral hydration and report dizziness or lightheadedness",
      "Assess fluid status comprehensively: lung auscultation for crackles (pulmonary edema from fluid overload), jugular venous distension, peripheral edema, orthopnea (all indicating volume overload requiring fluid restriction and possible diuresis); conversely, assess for dry mucous membranes, tachycardia, orthostatic hypotension, and poor skin turgor indicating volume depletion requiring repletion",
      "Prepare for and assist with renal replacement therapy if indicated: verify dialysis access (AV fistula, graft, or hemodialysis catheter), monitor hemodynamic stability during treatments, maintain aseptic technique for catheter care, and educate patient and family about the temporary nature of dialysis in most ATN cases (recovery expected in 1 to 3 weeks for most patients)"
    ],
    assessmentFindings: [
      "Oliguria (urine output less than 400 mL/day or less than 0.5 mL/kg/hour) or anuria in severe cases; non-oliguric ATN also occurs with normal or increased urine volume but rising creatinine",
      "Rising serum creatinine (often 0.3 to 0.5 mg/dL per day) and BUN over days",
      "Dark, concentrated urine or tea-colored urine (in myoglobin-induced ATN from rhabdomyolysis)",
      "Signs of uremia with severe ATN: nausea, vomiting, anorexia, metallic taste, pruritus, confusion, asterixis, pericardial friction rub",
      "Fluid overload: peripheral edema, pulmonary edema (crackles, dyspnea, orthopnea), hypertension, weight gain",
      "ECG changes of hyperkalemia: peaked T waves, prolonged PR interval, widened QRS, sine wave pattern"
    ],
    signs: {
      left: [
        "Decreased urine output (500 to 800 mL/day) with mild creatinine elevation",
        "Mild fatigue and decreased appetite",
        "Early laboratory changes: rising creatinine, mild hyperkalemia (5.0 to 5.5 mEq/L)",
        "Muddy brown granular casts on urinalysis",
        "FENa greater than 2% confirming intrinsic renal injury"
      ],
      right: [
        "Anuria (less than 100 mL/day) with rapidly rising creatinine",
        "Severe hyperkalemia (greater than 6.5 mEq/L) with ECG changes (widened QRS, sine wave)",
        "Pulmonary edema from fluid overload unresponsive to diuretics",
        "Uremic encephalopathy (confusion, asterixis, seizures)",
        "Uremic pericarditis (friction rub, chest pain, tamponade risk)"
      ]
    },
    medications: [
      {
        name: "Furosemide",
        type: "Loop Diuretic",
        action: "Inhibits NKCC2 cotransporter in the thick ascending limb of the loop of Henle, blocking sodium-potassium-chloride reabsorption; produces potent diuresis to manage fluid overload in oliguric ATN; may convert oliguric to non-oliguric ATN (easier to manage fluid balance) but does NOT improve outcomes or accelerate recovery",
        sideEffects: "Hypokalemia, hyponatremia, hypomagnesemia, metabolic alkalosis, dehydration, ototoxicity (with high IV bolus doses or concurrent aminoglycosides), hyperuricemia, hyperglycemia",
        contra: "Anuria unresponsive to fluid challenge (indicates complete tubular failure requiring dialysis rather than diuretics), severe hypovolemia, hepatic coma, uncorrected severe electrolyte depletion",
        pearl: "In ATN, furosemide is used only for volume management, NOT to treat AKI itself; higher doses are often needed (80 to 200 mg IV) because tubular damage impairs furosemide's delivery to its site of action; if no diuretic response after 200 mg IV, diuretic resistance is present and dialysis should be considered; monitor potassium closely as it may paradoxically normalize as diuretics take effect in a hyperkalemic patient"
      },
      {
        name: "Calcium Gluconate",
        type: "Electrolyte Supplement (Cardiac Membrane Stabilizer)",
        action: "Increases the threshold potential of cardiac myocytes, stabilizing the cell membrane against the arrhythmogenic effects of hyperkalemia; does NOT lower serum potassium levels but provides critical cardiac protection within 1 to 3 minutes while other potassium-lowering therapies take effect",
        sideEffects: "Bradycardia (with rapid IV administration), hypotension, nausea, flushing, tissue necrosis with extravasation (calcium chloride is more caustic than calcium gluconate), hypercalcemia with repeated dosing",
        contra: "Concurrent digitalis therapy (calcium potentiates digitalis toxicity and can cause fatal arrhythmia), hypercalcemia; calcium chloride preferred over calcium gluconate in cardiac arrest (3 times more ionized calcium per gram) but gluconate is safer for peripheral IV administration",
        pearl: "In hyperkalemic emergency with ECG changes: give calcium gluconate 10% 10 mL (1 gram) IV over 2 to 3 minutes FIRST for cardiac protection (onset 1 to 3 minutes, duration 30 to 60 minutes), then follow with insulin 10 units regular IV plus 25 grams dextrose (D50W) to shift potassium intracellularly; repeat ECG after calcium and after insulin-dextrose to confirm resolution of ECG changes; calcium gluconate is preferred for peripheral IV because calcium chloride causes severe tissue necrosis if it extravasates"
      },
      {
        name: "Sodium Polystyrene Sulfonate (Kayexalate)",
        type: "Cation Exchange Resin (Potassium Binder)",
        action: "Exchanges sodium ions for potassium ions in the gastrointestinal tract (primarily in the colon), increasing fecal potassium excretion; each gram binds approximately 0.5 to 1 mEq of potassium in exchange for 2 to 3 mEq of sodium; onset 2 to 6 hours for oral, 30 to 60 minutes for rectal",
        sideEffects: "Constipation (may require concurrent sorbitol), nausea, vomiting, gastric irritation, hypokalemia (with excessive use), hypernatremia (sodium loading from exchange), intestinal necrosis (rare but serious, especially when mixed with sorbitol in post-operative patients or those with bowel disease)",
        contra: "Bowel obstruction, post-operative ileus, neonates (risk of intestinal necrosis), concomitant oral sorbitol in post-operative patients (increased risk of colonic necrosis); newer agents (patiromer, sodium zirconium cyclosilicate) are preferred when available due to better safety profile",
        pearl: "Kayexalate is a slow-acting agent NOT appropriate for emergent hyperkalemia management; it takes 2 to 6 hours to lower potassium by approximately 0.5 to 1 mEq/L; do not administer with sorbitol in post-operative patients due to colonic necrosis risk; each dose delivers significant sodium load (approximately 60 to 100 mEq per standard dose) which may worsen fluid retention in AKI patients; newer potassium binders (patiromer, SZC) have fewer GI side effects and more predictable potassium reduction"
      }
    ],
    pearls: [
      "Muddy brown granular casts on urinalysis are the hallmark finding of ATN and distinguish it from prerenal AKI (which shows bland sediment or hyaline casts); always request urine microscopy in acute kidney injury",
      "FENa less than 1% suggests prerenal AKI (intact tubular function avidly reabsorbing sodium); FENa greater than 2% suggests ATN (damaged tubules unable to reabsorb sodium); FENa is unreliable in patients receiving diuretics - use fractional excretion of urea (FE-urea less than 35% suggests prerenal) instead",
      "The polyuric recovery phase of ATN (diuresis of 3 to 5 liters/day) is a critical period requiring aggressive fluid and electrolyte replacement; patients can become severely volume-depleted and hypokalemic if losses are not matched",
      "Serum creatinine is a lagging indicator of kidney injury - it rises 24 to 48 hours after injury and may not peak for 5 to 7 days; novel biomarkers (NGAL, KIM-1, IL-18) detect tubular injury much earlier but are not yet widely available clinically",
      "Every episode of AKI, even if apparently resolved, increases the risk of developing chronic kidney disease; patients recovering from ATN need long-term nephrology follow-up with monitoring of creatinine, proteinuria, and blood pressure",
      "Prevention is the most effective intervention: maintain euvolemia in surgical patients, use IV hydration before and after contrast exposure, monitor aminoglycoside and vancomycin trough levels, avoid concurrent nephrotoxins, and hold ACE inhibitors/ARBs during acute illness",
      "In hyperkalemic emergency, the treatment priority is: (1) calcium gluconate for cardiac membrane stabilization, (2) insulin plus dextrose to shift potassium intracellularly, (3) sodium bicarbonate if acidotic, (4) albuterol nebulization for additional potassium shifting, (5) potassium binders or dialysis for definitive removal"
    ],
    quiz: [
      {
        question: "A patient with septic shock develops oliguria (urine output 15 mL/hour), rising creatinine, and urinalysis showing muddy brown granular casts. The FENa is 3.5%. What is the most likely diagnosis?",
        options: [
          "Prerenal AKI from volume depletion",
          "Acute tubular necrosis (ATN) from ischemic injury",
          "Post-renal AKI from urinary obstruction",
          "Acute interstitial nephritis from medication reaction"
        ],
        correct: 1,
        rationale: "The clinical picture is classic for ischemic ATN: septic shock causing renal hypoperfusion, oliguria, rising creatinine, muddy brown granular casts (pathognomonic for ATN), and FENa greater than 2% (indicating tubular damage with inability to reabsorb sodium). Prerenal AKI would show FENa less than 1% with bland sediment. Post-renal would show hydronephrosis on ultrasound. AIN would show white blood cell casts and eosinophiluria."
      },
      {
        question: "A patient recovering from ATN suddenly develops urine output of 350 mL/hour. Serum potassium is 3.1 mEq/L and sodium is 131 mEq/L. What should the nurse do?",
        options: [
          "Restrict IV fluids because the patient is in the polyuric phase and excess output is expected",
          "Replace fluid and electrolyte losses by increasing IV fluid rate and administering potassium replacement, monitoring electrolytes every 6 to 12 hours",
          "Administer furosemide to maintain the high urine output and accelerate recovery",
          "Discontinue all IV fluids because the kidneys have recovered"
        ],
        correct: 1,
        rationale: "The polyuric recovery phase of ATN produces large volumes of dilute urine (tubules have regained filtration but not concentrating ability). The patient has hypokalemia (3.1 mEq/L) and hyponatremia (131 mEq/L) from excessive electrolyte losses. The priority is matching fluid replacement to output and aggressively replacing electrolytes. Fluid restriction would cause dangerous volume depletion. Furosemide would worsen electrolyte losses. Complete recovery has not yet occurred."
      },
      {
        question: "A nurse receives a potassium level of 6.8 mEq/L on a patient with ATN. The ECG shows peaked T waves and a widened QRS. What is the correct sequence of interventions?",
        options: [
          "Insulin plus dextrose first, then oral kayexalate, then dialysis if needed",
          "Calcium gluconate IV first for cardiac membrane stabilization, then insulin plus dextrose to shift potassium intracellularly",
          "IV sodium bicarbonate first, then nebulized albuterol",
          "Oral kayexalate immediately and recheck potassium in 6 hours"
        ],
        correct: 1,
        rationale: "Hyperkalemia greater than 6.5 mEq/L with ECG changes (peaked T waves, widened QRS) is a medical emergency. The correct sequence is: (1) Calcium gluconate 10% 10 mL IV over 2 to 3 minutes for immediate cardiac membrane stabilization (onset 1 to 3 minutes), followed by (2) Regular insulin 10 units IV plus D50W 25 grams to shift potassium into cells (onset 15 to 30 minutes). Calcium MUST be given first because it provides immediate cardiac protection. Kayexalate alone is too slow for emergent management."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone. Injected ${count}/${Object.keys(lessons).length} lessons.`);
