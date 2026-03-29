import type { Express, Request, Response } from "express";
import { pool } from "./storage";

function mapPage(row: any) {
  return {
    id: row.id,
    pageType: row.page_type,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    canonicalUrl: row.canonical_url,
    bodySystem: row.body_system,
    category: row.category,
    summary: row.summary,
    data: typeof row.data === "string" ? JSON.parse(row.data) : (row.data || {}),
    practiceQuestions: typeof row.practice_questions === "string" ? JSON.parse(row.practice_questions) : (row.practice_questions || []),
    references: typeof row.references === "string" ? JSON.parse(row.references) : (row.references || []),
    relatedSlugs: row.related_slugs || [],
    seoKeywords: row.seo_keywords || [],
    status: row.status,
    publishedAt: row.published_at,
    lastReviewedAt: row.last_reviewed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function registerClinicalSeoRoutes(app: Express): void {
  app.get("/api/clinical-seo/:pageType/:slug", async (req: Request, res: Response) => {
    try {
      const { pageType, slug } = req.params;
      const result = await pool.query(
        "SELECT * FROM clinical_seo_pages WHERE page_type = $1 AND slug = $2 AND status = 'published'",
        [pageType, slug]
      );
      if (!result.rows[0]) return res.status(404).json({ error: "Page not found" });
      res.json(mapPage(result.rows[0]));
    } catch (e: any) {
      console.error("[ClinicalSEO] Error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/clinical-seo/:pageType", async (req: Request, res: Response) => {
    try {
      const { pageType } = req.params;
      const limit = Math.min(parseInt(String(req.query.limit)) || 50, 200);
      const bodySystem = req.query.bodySystem ? String(req.query.bodySystem) : null;

      let query = "SELECT * FROM clinical_seo_pages WHERE page_type = $1 AND status = 'published'";
      const params: any[] = [pageType];
      if (bodySystem) {
        query += " AND body_system = $2";
        params.push(bodySystem);
        query += " ORDER BY title ASC LIMIT $3";
        params.push(limit);
      } else {
        query += " ORDER BY title ASC LIMIT $2";
        params.push(limit);
      }

      const result = await pool.query(query, params);
      res.json(result.rows.map(mapPage));
    } catch (e: any) {
      console.error("[ClinicalSEO] Error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/clinical-seo-all", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT slug, page_type, title, body_system FROM clinical_seo_pages WHERE status = 'published' ORDER BY page_type, title"
      );
      res.json(result.rows.map(r => ({
        slug: r.slug,
        pageType: r.page_type,
        title: r.title,
        bodySystem: r.body_system,
      })));
    } catch (e: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

export async function seedClinicalSeoPages(): Promise<void> {
  try {
    const existing = await pool.query("SELECT COUNT(*)::int AS c FROM clinical_seo_pages");
    if (parseInt(existing.rows[0]?.c || "0") > 0) return;

    console.log("[ClinicalSEO] Seeding clinical SEO pages...");

    const pages = [
      ...getConditionSeeds(),
      ...getSymptomSeeds(),
      ...getMedicationSeeds(),
      ...getLabValueSeeds(),
      ...getComparisonSeeds(),
    ];

    for (const page of pages) {
      await pool.query(
        `INSERT INTO clinical_seo_pages (page_type, slug, title, meta_title, meta_description, canonical_url, body_system, category, summary, data, practice_questions, "references", related_slugs, seo_keywords, status, published_at, last_reviewed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'published', NOW(), NOW())
         ON CONFLICT (slug) DO NOTHING`,
        [
          page.pageType, page.slug, page.title, page.metaTitle, page.metaDescription,
          page.canonicalUrl, page.bodySystem, page.category, page.summary,
          JSON.stringify(page.data), JSON.stringify(page.practiceQuestions),
          JSON.stringify(page.references), page.relatedSlugs, page.seoKeywords,
        ]
      );
    }

    console.log(`[ClinicalSEO] Seeded ${pages.length} clinical SEO pages`);
  } catch (e: any) {
    console.error("[ClinicalSEO] Seed error:", e.message);
  }
}

function getConditionSeeds() {
  return [
    {
      pageType: "condition",
      slug: "heart-failure",
      title: "Heart Failure",
      metaTitle: "Heart Failure: Nursing Assessment, Interventions & NCLEX Guide | NurseNest",
      metaDescription: "Comprehensive nursing guide to heart failure — pathophysiology, signs & symptoms, lab values (CA & US ranges), medications, priority nursing interventions, complications, and NCLEX practice questions.",
      canonicalUrl: "https://www.nursenest.ca/nclex/cardiac/heart-failure",
      bodySystem: "Cardiac",
      category: "Cardiovascular",
      summary: "Heart failure (HF) is a clinical syndrome where the heart cannot pump sufficient blood to meet metabolic demands. It is classified as left-sided (systolic or diastolic) or right-sided, and staged using the NYHA classification system.",
      data: {
        pathophysiology: "Heart failure occurs when the heart muscle becomes weakened (systolic HF) or stiff (diastolic HF), leading to inadequate cardiac output. In left-sided HF, blood backs up into the pulmonary circulation causing pulmonary edema. In right-sided HF, blood backs up into the systemic venous circulation causing peripheral edema, hepatomegaly, and JVD. Neurohormonal compensation (RAAS activation, SNS stimulation) initially maintains perfusion but ultimately worsens the condition through fluid retention and cardiac remodeling.",
        signsSymptoms: {
          left: ["Dyspnea on exertion", "Orthopnea", "Paroxysmal nocturnal dyspnea", "Crackles/rales in lungs", "S3 heart sound (ventricular gallop)", "Fatigue and weakness", "Frothy pink-tinged sputum", "Tachycardia"],
          right: ["Peripheral edema (pitting)", "Jugular venous distension (JVD)", "Hepatomegaly", "Ascites", "Weight gain", "Nocturia", "Anorexia/nausea", "Hepatojugular reflux"]
        },
        labValues: {
          bnp: { name: "BNP (B-type Natriuretic Peptide)", normalCA: "< 100 pg/mL", normalUS: "< 100 pg/mL", significance: "Elevated in HF; levels > 400 pg/mL strongly suggest HF. Used to differentiate cardiac from pulmonary dyspnea." },
          ntProBnp: { name: "NT-proBNP", normalCA: "< 300 pg/mL (age-dependent)", normalUS: "< 300 pg/mL (age-dependent)", significance: "More sensitive than BNP; levels > 900 pg/mL in patients > 50 years suggest HF." },
          sodium: { name: "Sodium", normalCA: "135–145 mmol/L", normalUS: "135–145 mEq/L", significance: "Dilutional hyponatremia common due to fluid retention and ADH activation." },
          potassium: { name: "Potassium", normalCA: "3.5–5.0 mmol/L", normalUS: "3.5–5.0 mEq/L", significance: "Monitor closely — loop diuretics cause hypokalemia; ACE inhibitors and ARBs can cause hyperkalemia." },
          creatinine: { name: "Creatinine", normalCA: "60–110 µmol/L", normalUS: "0.7–1.3 mg/dL", significance: "Elevated in cardiorenal syndrome; monitor renal function with diuretic use." }
        },
        medications: [
          { name: "Furosemide (Lasix)", class: "Loop Diuretic", mechanism: "Inhibits sodium-potassium-chloride cotransporter in the loop of Henle, promoting diuresis and reducing fluid overload", sideEffects: ["Hypokalemia", "Hypotension", "Ototoxicity", "Dehydration", "Hypomagnesemia"], contraindications: ["Anuria", "Severe electrolyte depletion"], nursingConsiderations: "Monitor daily weights, I&O, electrolytes (especially K+). Administer in the morning to prevent nocturia. Hold if systolic BP < 90 mmHg." },
          { name: "Lisinopril", class: "ACE Inhibitor", mechanism: "Blocks conversion of angiotensin I to angiotensin II, reducing afterload and preventing cardiac remodeling", sideEffects: ["Dry cough", "Hyperkalemia", "Angioedema", "Hypotension", "Dizziness"], contraindications: ["Pregnancy", "History of angioedema", "Bilateral renal artery stenosis"], nursingConsiderations: "Monitor BP, potassium, and renal function. Persistent dry cough may require switch to ARB. Report swelling of face/lips immediately." },
          { name: "Carvedilol", class: "Beta-Blocker", mechanism: "Blocks beta-1 and beta-2 receptors and alpha-1 receptors, reducing heart rate, BP, and myocardial oxygen demand", sideEffects: ["Bradycardia", "Hypotension", "Fatigue", "Dizziness", "Weight gain"], contraindications: ["Decompensated HF", "Severe bradycardia", "Heart block > 1st degree", "Severe hepatic impairment"], nursingConsiderations: "Start low, go slow. Take with food. Monitor HR (hold if < 60 bpm). Do not abruptly discontinue — taper gradually." },
          { name: "Spironolactone", class: "Potassium-Sparing Diuretic / Aldosterone Antagonist", mechanism: "Blocks aldosterone receptors in the distal tubule, reducing sodium reabsorption and potassium excretion", sideEffects: ["Hyperkalemia", "Gynecomastia", "GI upset", "Dizziness"], contraindications: ["Hyperkalemia (K+ > 5.5)", "Severe renal impairment", "Addison's disease"], nursingConsiderations: "Monitor potassium closely (risk of hyperkalemia with ACE inhibitors). Avoid potassium supplements and salt substitutes." },
          { name: "Digoxin", class: "Cardiac Glycoside", mechanism: "Inhibits Na+/K+ ATPase pump, increasing intracellular calcium and contractility (positive inotrope)", sideEffects: ["Bradycardia", "Nausea/vomiting", "Visual disturbances (yellow-green halos)", "Dysrhythmias"], contraindications: ["Hypokalemia", "Ventricular fibrillation", "Hypertrophic cardiomyopathy"], nursingConsiderations: "Check apical pulse for 1 full minute before administering — hold if < 60 bpm. Therapeutic range: 0.5–2.0 ng/mL. Hypokalemia increases digoxin toxicity risk." }
        ],
        nursingInterventions: [
          "Monitor daily weights at the same time each day — report gain > 2 lbs/day or 5 lbs/week",
          "Strict I&O monitoring with fluid restriction (typically 1.5–2 L/day)",
          "Elevate HOB to 45 degrees (high Fowler's) to reduce pulmonary congestion",
          "Administer supplemental oxygen to maintain SpO2 > 94%",
          "Apply compression stockings to reduce peripheral edema",
          "Implement sodium-restricted diet (< 2,000 mg/day)",
          "Monitor and report signs of digoxin toxicity",
          "Assess lung sounds every 4 hours for crackles",
          "Assess peripheral edema using pitting scale (1+ to 4+)",
          "Educate patient on medication adherence, dietary restrictions, and when to seek emergency care"
        ],
        complications: [
          { name: "Pulmonary Edema", description: "Acute decompensation with severe respiratory distress, frothy pink sputum, and crackles throughout lung fields. Requires immediate intervention with IV furosemide, morphine, and positive pressure ventilation." },
          { name: "Cardiogenic Shock", description: "Severe pump failure with systolic BP < 90 mmHg, altered mental status, and end-organ hypoperfusion. Requires vasopressors (dopamine, dobutamine) and hemodynamic monitoring." },
          { name: "Dysrhythmias", description: "Electrolyte imbalances and cardiac remodeling predispose to atrial fibrillation, ventricular tachycardia, and sudden cardiac death." },
          { name: "Renal Failure", description: "Cardiorenal syndrome — decreased cardiac output leads to renal hypoperfusion and progressive kidney injury." },
          { name: "Deep Vein Thrombosis", description: "Venous stasis from reduced mobility and peripheral edema increases DVT risk. Prophylactic anticoagulation may be indicated." }
        ],
        examInsights: [
          "NCLEX frequently tests the nurse's priority action when a patient with HF develops acute dyspnea — position in high Fowler's first, then administer oxygen",
          "Know the difference between left-sided HF (pulmonary symptoms) and right-sided HF (systemic symptoms) — this is a common select-all-that-apply question",
          "Understand why ACE inhibitors are first-line therapy and the importance of monitoring potassium with combined diuretic/ACE inhibitor therapy",
          "Digoxin toxicity questions are high-yield — know the symptoms (visual changes, bradycardia, nausea) and the role of hypokalemia",
          "Daily weight monitoring is the MOST reliable indicator of fluid status — expect questions about when to notify the healthcare provider"
        ]
      },
      practiceQuestions: [
        { question: "A patient with heart failure reports waking up at night gasping for air. Which term best describes this symptom?", options: ["Orthopnea", "Paroxysmal nocturnal dyspnea", "Dyspnea on exertion", "Cheyne-Stokes respiration"], correct: 1, rationale: "Paroxysmal nocturnal dyspnea (PND) is characterized by sudden onset of severe dyspnea during sleep, causing the patient to wake up gasping. It occurs due to fluid redistribution when lying flat. Orthopnea is difficulty breathing when lying flat but occurs immediately upon reclining." },
        { question: "Which assessment finding is MOST consistent with right-sided heart failure?", options: ["Crackles in lung bases", "Frothy pink sputum", "Jugular venous distension", "S3 heart sound"], correct: 2, rationale: "JVD is a hallmark of right-sided heart failure, resulting from blood backing up into the systemic venous circulation. Crackles and frothy sputum are associated with left-sided HF and pulmonary congestion." },
        { question: "A nurse is caring for a patient on furosemide and lisinopril. Which lab value requires immediate follow-up?", options: ["Sodium 140 mEq/L", "Potassium 2.8 mEq/L", "BUN 18 mg/dL", "BNP 250 pg/mL"], correct: 1, rationale: "Potassium 2.8 mEq/L is critically low (hypokalemia). Furosemide (loop diuretic) causes potassium loss, while lisinopril (ACE inhibitor) can increase potassium. However, the net effect with concurrent use still requires close monitoring. Severe hypokalemia can cause life-threatening dysrhythmias." },
        { question: "Before administering digoxin, the nurse should perform which priority assessment?", options: ["Check blood pressure", "Auscultate lung sounds", "Check apical pulse for 1 full minute", "Review serum sodium level"], correct: 2, rationale: "The nurse must check the apical pulse for a full minute before giving digoxin. The medication should be held if the heart rate is < 60 bpm (adult) due to risk of severe bradycardia and heart block." },
        { question: "A patient with HF gained 4 pounds overnight. What is the nurse's priority action?", options: ["Restrict oral fluids to 1 L/day", "Notify the healthcare provider", "Reweigh the patient to confirm", "Administer an extra dose of furosemide"], correct: 1, rationale: "A weight gain > 2 lbs/day or 5 lbs/week indicates significant fluid retention and worsening HF. The nurse should notify the healthcare provider for orders to adjust diuretic therapy. The nurse should not independently change medication dosing." },
        { question: "Which patient statement indicates effective teaching about heart failure management?", options: ["I will weigh myself once a week on the same scale", "I should limit my sodium intake to less than 2,000 mg per day", "I can stop taking my medications when I feel better", "I should drink at least 3 liters of water daily"], correct: 1, rationale: "Sodium restriction to < 2,000 mg/day is a key component of HF management to prevent fluid retention. Patients should weigh themselves daily (not weekly), never stop medications without provider guidance, and follow fluid restrictions (not increase fluid intake)." },
        { question: "A patient on digoxin reports seeing yellow-green halos around lights. What should the nurse do FIRST?", options: ["Administer the next dose as scheduled", "Check the serum digoxin level", "Hold the medication and notify the provider", "Reassure the patient this is a common side effect"], correct: 2, rationale: "Yellow-green halos are a classic sign of digoxin toxicity. The nurse should hold the medication immediately and notify the provider. A serum digoxin level should be drawn, but the priority is to stop the drug and report the finding." }
      ],
      references: [
        { source: "American Heart Association", title: "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure", url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001063", year: "2022" },
        { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" },
        { source: "Heart and Stroke Foundation of Canada", title: "Heart Failure Management Guidelines", url: "https://www.heartandstroke.ca/", year: "2023" },
        { source: "Registered Nurses' Association of Ontario (RNAO)", title: "Best Practice Guidelines: Managing Heart Failure in the Community", year: "2021" }
      ],
      relatedSlugs: ["myocardial-infarction", "pulmonary-edema", "cardiogenic-shock", "atrial-fibrillation", "potassium"],
      seoKeywords: ["heart failure nursing", "HF pathophysiology", "heart failure NCLEX", "heart failure nursing interventions", "BNP levels heart failure", "left vs right sided heart failure"]
    },
    {
      pageType: "condition",
      slug: "myocardial-infarction",
      title: "Myocardial Infarction (Heart Attack)",
      metaTitle: "Myocardial Infarction: Nursing Guide, Assessment & NCLEX Prep | NurseNest",
      metaDescription: "Master myocardial infarction for nursing exams — pathophysiology of STEMI vs NSTEMI, troponin levels, MONA-B protocol, nursing interventions, and practice questions.",
      canonicalUrl: "https://www.nursenest.ca/nclex/cardiac/myocardial-infarction",
      bodySystem: "Cardiac",
      category: "Cardiovascular",
      summary: "Myocardial infarction (MI) occurs when coronary artery blood flow is critically reduced or occluded, causing ischemia and necrosis of myocardial tissue. Classified as STEMI or NSTEMI based on ECG findings.",
      data: {
        pathophysiology: "MI results from rupture of an atherosclerotic plaque in a coronary artery, triggering thrombus formation that partially or completely occludes blood flow. Myocardial cells deprived of oxygen undergo ischemia within seconds, injury within minutes, and irreversible necrosis within 20–40 minutes. The area of necrosis expands outward from the endocardium to the epicardium. STEMI involves transmural (full-thickness) injury with ST elevation on ECG. NSTEMI involves subendocardial injury with ST depression or T-wave inversion.",
        signsSymptoms: {
          left: ["Crushing substernal chest pain radiating to left arm, jaw, or back", "Diaphoresis", "Nausea and vomiting", "Dyspnea", "Anxiety and sense of impending doom", "Pallor", "Tachycardia"],
          right: ["Atypical presentations (common in women, elderly, diabetics)", "Fatigue without chest pain", "Epigastric discomfort", "Jaw or back pain only", "Shortness of breath without chest pain"]
        },
        labValues: {
          troponin: { name: "Troponin I/T", normalCA: "< 0.04 ng/mL", normalUS: "< 0.04 ng/mL", significance: "Most specific cardiac biomarker. Rises 3–6 hours after onset, peaks at 12–24 hours, stays elevated 7–14 days. Serial levels q6–8h to detect trend." },
          ckMb: { name: "CK-MB", normalCA: "< 25 U/L", normalUS: "< 25 U/L", significance: "Rises 4–8 hours after MI, peaks 12–24 hours, returns to normal in 48–72 hours. Useful for detecting reinfarction." },
          bnp: { name: "BNP", normalCA: "< 100 pg/mL", normalUS: "< 100 pg/mL", significance: "Elevated with post-MI heart failure. Helps assess cardiac dysfunction severity." },
          cbc: { name: "WBC", normalCA: "4.5–11.0 × 10⁹/L", normalUS: "4,500–11,000/µL", significance: "Leukocytosis (stress response) common post-MI. Elevated WBC associated with larger infarct size." }
        },
        medications: [
          { name: "Morphine", class: "Opioid Analgesic", mechanism: "Reduces pain, anxiety, and preload through venous dilation", sideEffects: ["Hypotension", "Respiratory depression", "Nausea", "Constipation"], contraindications: ["Hypotension", "Right ventricular infarction"], nursingConsiderations: "Monitor respiratory rate and BP. Have naloxone available. Use is controversial — some guidelines now recommend against routine use in NSTEMI." },
          { name: "Nitroglycerin", class: "Vasodilator", mechanism: "Relaxes vascular smooth muscle, reducing preload and myocardial oxygen demand", sideEffects: ["Headache", "Hypotension", "Dizziness", "Tachycardia"], contraindications: ["Systolic BP < 90 mmHg", "Right ventricular infarction", "Use of PDE5 inhibitors within 24–48 hours"], nursingConsiderations: "Administer sublingual every 5 minutes × 3 doses. Monitor BP before each dose. Protect tablets from light." },
          { name: "Aspirin", class: "Antiplatelet", mechanism: "Irreversibly inhibits cyclooxygenase, preventing thromboxane A2 production and platelet aggregation", sideEffects: ["GI bleeding", "Bruising", "Tinnitus"], contraindications: ["Active bleeding", "Aspirin allergy/sensitivity"], nursingConsiderations: "Give 162–325 mg chewed immediately upon symptom onset. Patient should chew, not swallow whole, for rapid absorption." },
          { name: "Heparin", class: "Anticoagulant", mechanism: "Enhances antithrombin III activity, preventing clot extension", sideEffects: ["Bleeding", "Thrombocytopenia (HIT)", "Bruising"], contraindications: ["Active hemorrhage", "HIT", "Severe thrombocytopenia"], nursingConsiderations: "Monitor aPTT (target 1.5–2.5× control). Assess for bleeding signs. Have protamine sulfate available as antidote." },
          { name: "Atorvastatin", class: "HMG-CoA Reductase Inhibitor (Statin)", mechanism: "Inhibits cholesterol synthesis, stabilizes atherosclerotic plaques, reduces inflammation", sideEffects: ["Myalgia", "Elevated liver enzymes", "Rhabdomyolysis (rare)"], contraindications: ["Active liver disease", "Pregnancy"], nursingConsiderations: "Monitor liver function tests. Report unexplained muscle pain. High-intensity statin recommended for all post-MI patients." }
        ],
        nursingInterventions: [
          "Perform 12-lead ECG within 10 minutes of presentation",
          "Administer oxygen only if SpO2 < 94% (routine O2 no longer recommended)",
          "Establish IV access and draw cardiac biomarkers (troponin q6h × 3)",
          "Administer aspirin 162–325 mg chewed immediately",
          "Continuous cardiac monitoring for dysrhythmias",
          "Maintain bed rest during acute phase",
          "Monitor vital signs every 15 minutes during acute phase",
          "Prepare for percutaneous coronary intervention (PCI) — door-to-balloon time < 90 minutes",
          "Monitor for complications: cardiogenic shock, heart failure, dysrhythmias, cardiac tamponade",
          "Provide emotional support and anxiety reduction"
        ],
        complications: [
          { name: "Cardiogenic Shock", description: "Severe pump failure requiring vasopressor and inotropic support. Occurs in 5–8% of STEMI patients." },
          { name: "Ventricular Fibrillation", description: "Most common cause of death in the first hour post-MI. Requires immediate defibrillation." },
          { name: "Papillary Muscle Rupture", description: "Leads to acute mitral regurgitation with new systolic murmur. Occurs 2–7 days post-MI." },
          { name: "Ventricular Septal Rupture", description: "New harsh holosystolic murmur 3–5 days post-MI. Requires surgical repair." },
          { name: "Pericarditis (Dressler Syndrome)", description: "Autoimmune inflammatory response 2–10 weeks post-MI. Presents with pleuritic chest pain, friction rub, and fever." }
        ],
        examInsights: [
          "Know MONA-B protocol and current evidence-based modifications (oxygen only if SpO2 < 94%)",
          "Door-to-balloon time < 90 minutes is a key quality metric for STEMI",
          "Troponin is the MOST specific and sensitive biomarker for myocardial injury",
          "Differentiate STEMI (ST elevation, emergent PCI) from NSTEMI (ST depression/T-wave changes, medical management first)",
          "Nitroglycerin is contraindicated in right ventricular infarction due to preload dependence"
        ]
      },
      practiceQuestions: [
        { question: "A patient arrives in the ED with crushing chest pain. After establishing IV access, what is the nurse's FIRST priority?", options: ["Administer morphine for pain", "Obtain a 12-lead ECG", "Administer aspirin 325 mg chewed", "Start a nitroglycerin drip"], correct: 1, rationale: "A 12-lead ECG should be obtained within 10 minutes of presentation to identify STEMI vs NSTEMI, as this determines the treatment pathway. While aspirin should be given quickly, identifying the type of MI is the priority to determine if emergent PCI is needed." },
        { question: "Which cardiac biomarker is MOST specific for myocardial damage?", options: ["CK-MB", "Troponin I", "Myoglobin", "LDH"], correct: 1, rationale: "Troponin I (and T) are the most specific and sensitive biomarkers for myocardial injury. They rise 3–6 hours after onset and remain elevated for 7–14 days, making them ideal for both early and late diagnosis." },
        { question: "Why is nitroglycerin contraindicated in a right ventricular MI?", options: ["It increases afterload", "It causes excessive tachycardia", "It reduces preload that the failing right ventricle needs", "It interferes with thrombolytic therapy"], correct: 2, rationale: "The right ventricle in RV infarction depends on adequate preload to maintain cardiac output. Nitroglycerin reduces preload through venodilation, which can cause severe hypotension and hemodynamic collapse." },
        { question: "A patient took sildenafil (Viagra) 12 hours ago and is now experiencing chest pain. Which medication should the nurse withhold?", options: ["Aspirin", "Morphine", "Nitroglycerin", "Heparin"], correct: 2, rationale: "PDE5 inhibitors (sildenafil, tadalafil) potentiate the hypotensive effects of nitrates. Nitroglycerin should be withheld for 24–48 hours after PDE5 inhibitor use to prevent severe, potentially fatal hypotension." },
        { question: "Which complication should the nurse assess for 2–7 days after an MI?", options: ["Dressler syndrome", "Papillary muscle rupture", "Ventricular remodeling", "Aortic dissection"], correct: 1, rationale: "Papillary muscle rupture typically occurs 2–7 days post-MI, presenting with a new systolic murmur from acute mitral regurgitation. This is a surgical emergency. Dressler syndrome occurs later (2–10 weeks)." }
      ],
      references: [
        { source: "American College of Cardiology / AHA", title: "2021 ACC/AHA Guideline for Coronary Artery Revascularization", year: "2021" },
        { source: "European Society of Cardiology", title: "2023 ESC Guidelines for Management of Acute Coronary Syndromes", year: "2023" },
        { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }
      ],
      relatedSlugs: ["heart-failure", "troponin", "chest-pain-nursing-assessment", "cardiogenic-shock", "atrial-fibrillation"],
      seoKeywords: ["myocardial infarction nursing", "MI NCLEX", "STEMI vs NSTEMI nursing", "troponin levels MI", "MONA protocol nursing"]
    },
    {
      pageType: "condition",
      slug: "pneumonia",
      title: "Pneumonia",
      metaTitle: "Pneumonia: Nursing Assessment, Management & NCLEX Review | NurseNest",
      metaDescription: "Complete nursing guide to pneumonia — types, pathophysiology, assessment findings, antibiotics, oxygen therapy, and NCLEX practice questions for nursing students.",
      canonicalUrl: "https://www.nursenest.ca/nclex/respiratory/pneumonia",
      bodySystem: "Respiratory",
      category: "Respiratory",
      summary: "Pneumonia is an inflammatory condition of the lung parenchyma, most commonly caused by infection. It is classified as community-acquired (CAP), hospital-acquired (HAP), or ventilator-associated (VAP).",
      data: {
        pathophysiology: "Infectious organisms (bacteria, viruses, fungi) enter the lower respiratory tract, triggering an inflammatory response. The alveoli fill with exudate (fluid, WBCs, cellular debris), impairing gas exchange. Consolidation occurs as the exudate solidifies. Bacterial pneumonia (Streptococcus pneumoniae most common in CAP) typically presents with sudden onset of symptoms, while viral and atypical pneumonias have more gradual onset.",
        signsSymptoms: {
          left: ["Productive cough (rust-colored or purulent sputum)", "Fever and chills", "Tachypnea", "Crackles/rales on auscultation", "Diminished breath sounds over affected area", "Pleuritic chest pain (sharp, worsens with inspiration)"],
          right: ["Dyspnea", "Tachycardia", "Confusion (especially in elderly)", "Cyanosis", "Dullness to percussion over consolidation", "Bronchial breath sounds over consolidation"]
        },
        labValues: {
          wbc: { name: "WBC", normalCA: "4.5–11.0 × 10⁹/L", normalUS: "4,500–11,000/µL", significance: "Leukocytosis with left shift (↑ bands/immature neutrophils) indicates bacterial infection. Leukopenia in severe sepsis is a poor prognostic sign." },
          abg: { name: "ABG (PaO2)", normalCA: "80–100 mmHg", normalUS: "80–100 mmHg", significance: "Hypoxemia (PaO2 < 60 mmHg) indicates significant gas exchange impairment. Respiratory alkalosis from tachypnea may progress to respiratory acidosis." },
          procalcitonin: { name: "Procalcitonin", normalCA: "< 0.1 ng/mL", normalUS: "< 0.1 ng/mL", significance: "Elevated in bacterial infections, helps differentiate bacterial from viral pneumonia and guide antibiotic therapy duration." }
        },
        medications: [
          { name: "Amoxicillin", class: "Aminopenicillin", mechanism: "Inhibits bacterial cell wall synthesis by binding penicillin-binding proteins", sideEffects: ["Diarrhea", "Nausea", "Rash", "Allergic reaction"], contraindications: ["Penicillin allergy", "Infectious mononucleosis (causes rash)"], nursingConsiderations: "First-line for outpatient CAP in otherwise healthy adults. Assess for penicillin allergy before administration. Complete full course even if symptoms improve." },
          { name: "Azithromycin", class: "Macrolide Antibiotic", mechanism: "Inhibits bacterial protein synthesis by binding 50S ribosomal subunit", sideEffects: ["GI upset", "QT prolongation", "Hepatotoxicity"], contraindications: ["History of cholestatic jaundice with prior azithromycin use", "QT prolongation"], nursingConsiderations: "Used for atypical pneumonia coverage (Mycoplasma, Chlamydophila). Z-pack provides therapeutic levels for 10 days. Monitor for cardiac arrhythmias." },
          { name: "Ceftriaxone", class: "Third-Generation Cephalosporin", mechanism: "Inhibits bacterial cell wall synthesis with broad-spectrum gram-negative coverage", sideEffects: ["Diarrhea", "Rash", "Cholestasis", "C. difficile colitis"], contraindications: ["Cephalosporin allergy", "Neonates with hyperbilirubinemia (displaces bilirubin)"], nursingConsiderations: "IV/IM for inpatient CAP. Cross-reactivity with penicillin allergy is approximately 1–2%. Monitor for superinfection and C. difficile." }
        ],
        nursingInterventions: [
          "Monitor respiratory status: rate, depth, SpO2 every 2–4 hours",
          "Administer supplemental oxygen to maintain SpO2 > 94%",
          "Encourage incentive spirometry every 1–2 hours while awake",
          "Position in semi-Fowler's or high Fowler's to optimize ventilation",
          "Encourage adequate fluid intake (2–3 L/day unless contraindicated) to thin secretions",
          "Administer antibiotics as prescribed — first dose within 4 hours of diagnosis",
          "Obtain sputum culture before starting antibiotics if possible",
          "Cluster nursing care to allow adequate rest periods",
          "Implement aspiration precautions for at-risk patients",
          "Administer pneumococcal and influenza vaccines per protocol"
        ],
        complications: [
          { name: "Sepsis / Septic Shock", description: "Pneumonia is the most common cause of sepsis. Monitor for SIRS criteria, hypotension, and end-organ dysfunction." },
          { name: "Pleural Effusion", description: "Fluid accumulation in the pleural space. May require thoracentesis if large or symptomatic." },
          { name: "Empyema", description: "Infected pleural effusion requiring chest tube drainage and IV antibiotics." },
          { name: "Lung Abscess", description: "Localized area of necrosis with pus formation. More common in aspiration pneumonia." },
          { name: "ARDS", description: "Severe inflammatory response causing non-cardiogenic pulmonary edema and refractory hypoxemia." }
        ],
        examInsights: [
          "Know the difference between CAP, HAP, and VAP — HAP occurs ≥ 48 hours after admission",
          "Incentive spirometry and early ambulation are key post-operative pneumonia prevention strategies",
          "Elderly patients may present atypically — confusion may be the only symptom",
          "Rust-colored sputum is classic for Streptococcus pneumoniae (pneumococcal pneumonia)",
          "Aspiration pneumonia occurs in the RIGHT lower lobe due to the right main bronchus being wider, shorter, and more vertical"
        ]
      },
      practiceQuestions: [
        { question: "Which assessment finding is MOST characteristic of bacterial pneumonia?", options: ["Non-productive dry cough", "Gradual onset over several weeks", "Rust-colored productive sputum with fever", "Bilateral diffuse wheezing"], correct: 2, rationale: "Bacterial pneumonia (especially S. pneumoniae) presents with sudden onset of high fever, chills, and productive cough with rust-colored or purulent sputum. Gradual onset and dry cough are more typical of atypical or viral pneumonia." },
        { question: "A patient is admitted with CAP. Which nursing action takes HIGHEST priority?", options: ["Obtain sputum culture", "Administer first dose of antibiotics", "Encourage incentive spirometry", "Apply supplemental oxygen"], correct: 3, rationale: "Maintaining adequate oxygenation is the highest priority (airway and breathing). While sputum culture should be obtained before antibiotics when possible, ensuring the patient can breathe adequately takes precedence." },
        { question: "Aspiration pneumonia most commonly affects which area of the lungs?", options: ["Left upper lobe", "Right lower lobe", "Both upper lobes", "Left lower lobe"], correct: 1, rationale: "The right main bronchus is wider, shorter, and more vertical than the left, making the right lower lobe the most common site for aspiration pneumonia. This is a high-yield anatomy fact for NCLEX." },
        { question: "Which vaccine should the nurse recommend for a 68-year-old patient to prevent pneumonia?", options: ["Tdap only", "Pneumococcal conjugate vaccine (PCV20)", "Varicella vaccine", "Meningococcal vaccine"], correct: 1, rationale: "Adults ≥ 65 years should receive the pneumococcal conjugate vaccine (PCV20 or PCV15 + PPSV23). This protects against the most common serotypes of S. pneumoniae that cause invasive pneumococcal disease." },
        { question: "A post-surgical patient develops pneumonia. Which preventive measure was most likely inadequate?", options: ["Hand hygiene", "Use of incentive spirometry", "Fluid restriction", "Bed rest"], correct: 1, rationale: "Incentive spirometry promotes deep breathing and prevents atelectasis, which is a major risk factor for post-surgical pneumonia. Early ambulation and incentive spirometry are the primary preventive strategies. Bed rest and fluid restriction would actually increase pneumonia risk." }
      ],
      references: [
        { source: "American Thoracic Society / IDSA", title: "Diagnosis and Treatment of Adults with Community-Acquired Pneumonia", year: "2019" },
        { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" },
        { source: "Public Health Agency of Canada", title: "Canadian Immunization Guide: Pneumococcal Vaccine", year: "2023" }
      ],
      relatedSlugs: ["copd", "chest-pain-nursing-assessment", "wbc", "oxygen-therapy", "sepsis"],
      seoKeywords: ["pneumonia nursing", "pneumonia NCLEX", "CAP nursing assessment", "pneumonia nursing interventions", "aspiration pneumonia nursing"]
    },
    {
      pageType: "condition",
      slug: "diabetes-type-2",
      title: "Type 2 Diabetes Mellitus",
      metaTitle: "Type 2 Diabetes: Nursing Assessment, Management & NCLEX Guide | NurseNest",
      metaDescription: "Complete nursing guide to Type 2 Diabetes Mellitus — insulin resistance pathophysiology, HbA1c interpretation, oral hypoglycemics, nursing interventions, and practice questions.",
      canonicalUrl: "https://www.nursenest.ca/nclex/endocrine/diabetes-type-2",
      bodySystem: "Endocrine",
      category: "Endocrine",
      summary: "Type 2 Diabetes Mellitus (T2DM) is a metabolic disorder characterized by insulin resistance and progressive beta-cell dysfunction, resulting in chronic hyperglycemia.",
      data: {
        pathophysiology: "In T2DM, peripheral tissues (muscle, fat, liver) develop insulin resistance, requiring the pancreas to produce more insulin. Over time, pancreatic beta cells become exhausted and insulin production declines. The resulting hyperglycemia causes osmotic diuresis, cellular dehydration, and progressive microvascular and macrovascular damage. Hepatic glucose production increases inappropriately. The 'ominous octet' includes impaired insulin secretion, increased glucagon, increased hepatic glucose production, decreased glucose uptake, increased lipolysis, decreased incretin effect, increased glucose reabsorption in kidneys, and neurotransmitter dysfunction.",
        signsSymptoms: {
          left: ["Polyuria (excessive urination)", "Polydipsia (excessive thirst)", "Polyphagia (excessive hunger)", "Fatigue", "Blurred vision", "Slow wound healing", "Recurrent infections (UTIs, skin)"],
          right: ["Acanthosis nigricans (darkened skin folds)", "Numbness/tingling in extremities", "Weight loss (if severe)", "Erectile dysfunction", "Increased triglycerides", "Hypertension"]
        },
        labValues: {
          hba1c: { name: "HbA1c (Glycated Hemoglobin)", normalCA: "< 6.0% (non-diabetic); < 7.0% (diabetic goal)", normalUS: "< 5.7% (normal); < 7.0% (diabetic goal)", significance: "Reflects average blood glucose over 2–3 months. HbA1c ≥ 6.5% is diagnostic of diabetes. Target < 7.0% for most adults with diabetes." },
          fbg: { name: "Fasting Blood Glucose", normalCA: "3.9–5.5 mmol/L", normalUS: "70–99 mg/dL", significance: "Fasting glucose ≥ 7.0 mmol/L (126 mg/dL) is diagnostic of diabetes. Values 5.6–6.9 mmol/L indicate prediabetes." },
          ogtt: { name: "2-Hour OGTT", normalCA: "< 7.8 mmol/L", normalUS: "< 140 mg/dL", significance: "Value ≥ 11.1 mmol/L (200 mg/dL) at 2 hours post 75g glucose load confirms diabetes." },
          lipids: { name: "Lipid Panel (LDL)", normalCA: "< 2.0 mmol/L (diabetic goal)", normalUS: "< 100 mg/dL (diabetic goal)", significance: "T2DM patients are at high cardiovascular risk. Statin therapy recommended for most patients. Dyslipidemia pattern: ↑ triglycerides, ↓ HDL, ↑ small dense LDL." }
        },
        medications: [
          { name: "Metformin", class: "Biguanide", mechanism: "Decreases hepatic glucose production, increases insulin sensitivity in peripheral tissues, reduces intestinal glucose absorption", sideEffects: ["GI upset (nausea, diarrhea)", "Metallic taste", "Lactic acidosis (rare)", "Vitamin B12 deficiency"], contraindications: ["eGFR < 30 mL/min", "Acute/chronic metabolic acidosis", "Hold 48 hours before/after IV contrast"], nursingConsiderations: "First-line for T2DM. Take with meals to reduce GI effects. Monitor renal function annually. Does NOT cause hypoglycemia when used alone." },
          { name: "Glipizide", class: "Sulfonylurea", mechanism: "Stimulates pancreatic beta cells to release more insulin", sideEffects: ["Hypoglycemia", "Weight gain", "GI upset"], contraindications: ["Type 1 diabetes", "DKA", "Severe hepatic/renal disease"], nursingConsiderations: "Take 30 minutes before meals. Teach patient signs of hypoglycemia. Carries risk of hypoglycemia unlike metformin." },
          { name: "Empagliflozin (Jardiance)", class: "SGLT2 Inhibitor", mechanism: "Blocks glucose reabsorption in the proximal tubule, causing glycosuria and lowering blood glucose", sideEffects: ["UTIs", "Genital yeast infections", "Polyuria", "Euglycemic DKA (rare)"], contraindications: ["Severe renal impairment", "Type 1 diabetes", "History of DKA"], nursingConsiderations: "Cardiovascular and renal protective benefits. Teach patient about increased urination and infection signs. Stay hydrated." },
          { name: "Insulin Glargine (Lantus)", class: "Long-Acting Basal Insulin", mechanism: "Provides steady baseline insulin coverage over 24 hours, mimicking physiologic basal insulin secretion", sideEffects: ["Hypoglycemia", "Weight gain", "Injection site lipodystrophy"], contraindications: ["Hypoglycemia", "Hypersensitivity"], nursingConsiderations: "Administer at the same time daily (usually bedtime). Do NOT mix with other insulins. Clear solution (do not shake). Rotate injection sites." }
        ],
        nursingInterventions: [
          "Assess blood glucose levels as ordered (fasting, pre-meal, 2-hour post-prandial)",
          "Educate on proper blood glucose monitoring technique and target ranges",
          "Perform comprehensive foot assessment every visit — inspect for ulcers, calluses, deformities",
          "Teach carbohydrate counting and meal planning principles",
          "Monitor for signs of hypoglycemia (tremors, diaphoresis, confusion, tachycardia) and treat with 15g fast-acting carbs",
          "Administer insulin using proper technique (rotation, angle, timing)",
          "Assess for diabetic complications: retinopathy (annual eye exam), nephropathy (microalbumin), neuropathy",
          "Encourage regular physical activity (150 min/week moderate intensity)",
          "Monitor HbA1c every 3–6 months",
          "Provide sick day management education (continue medications, monitor BG more frequently)"
        ],
        complications: [
          { name: "Diabetic Ketoacidosis (DKA)", description: "More common in T1DM but can occur in T2DM during physiologic stress. Characterized by hyperglycemia > 250 mg/dL, metabolic acidosis (pH < 7.30), and ketonemia. Requires IV insulin drip, aggressive fluid resuscitation, and electrolyte replacement." },
          { name: "Hyperosmolar Hyperglycemic State (HHS)", description: "Severe hyperglycemia (> 600 mg/dL) with extreme dehydration and hyperosmolarity, WITHOUT significant ketosis. More common in elderly T2DM patients. Higher mortality rate than DKA." },
          { name: "Diabetic Retinopathy", description: "Microvascular damage to retinal blood vessels. Leading cause of blindness in working-age adults. Annual dilated eye exams recommended." },
          { name: "Diabetic Nephropathy", description: "Progressive kidney damage from glomerular hyperfiltration. Screen with urine microalbumin annually. ACE inhibitors/ARBs are renoprotective." },
          { name: "Peripheral Neuropathy", description: "Nerve damage causing numbness, tingling, and pain in extremities. Increases risk for foot ulcers and Charcot joint. Daily foot inspection is essential." }
        ],
        examInsights: [
          "Metformin is ALWAYS first-line for T2DM — know it doesn't cause hypoglycemia alone",
          "Know the difference between DKA (T1DM, ketones, Kussmaul breathing) and HHS (T2DM, extreme hyperglycemia, no ketones)",
          "Hypoglycemia treatment: Rule of 15 — give 15g fast-acting carbs, recheck in 15 minutes",
          "HbA1c target < 7.0% for most adults — each 1% decrease reduces microvascular complications by ~25%",
          "NCLEX loves foot care questions — inspect daily, proper footwear, never go barefoot"
        ]
      },
      practiceQuestions: [
        { question: "A patient newly diagnosed with T2DM asks why metformin was prescribed first. What is the nurse's BEST response?", options: ["It stimulates your pancreas to make more insulin", "It reduces sugar absorption and improves how your body uses insulin, with low risk of low blood sugar", "It replaces the insulin your body can no longer make", "It is the cheapest diabetes medication available"], correct: 1, rationale: "Metformin is first-line because it reduces hepatic glucose production, improves insulin sensitivity, and does NOT cause hypoglycemia when used alone. It also has cardiovascular benefits and is weight-neutral. It does not stimulate insulin secretion." },
        { question: "Which HbA1c value indicates that a diabetic patient's glucose control has been inadequate over the past 3 months?", options: ["5.4%", "6.2%", "6.8%", "8.5%"], correct: 3, rationale: "An HbA1c of 8.5% is above the target of < 7.0% for most diabetic adults, indicating poor glucose control over the preceding 2–3 months. This value corresponds to an estimated average glucose of approximately 197 mg/dL." },
        { question: "A patient on glipizide becomes diaphoretic and confused. What should the nurse do FIRST?", options: ["Check blood glucose level", "Give 15 grams of a fast-acting carbohydrate", "Administer insulin", "Call the healthcare provider"], correct: 1, rationale: "While the symptoms suggest hypoglycemia, the nurse should first confirm with a blood glucose check before treatment. However, if a glucometer is not immediately available, the nurse should treat empirically with 15g of fast-acting carbohydrate (Rule of 15)." },
        { question: "During a foot assessment, the nurse notes a painless ulcer on the patient's heel. This finding is MOST likely related to:", options: ["Peripheral arterial disease", "Diabetic neuropathy", "Venous insufficiency", "Contact dermatitis"], correct: 1, rationale: "Painless foot ulcers are characteristic of diabetic peripheral neuropathy. Loss of protective sensation prevents the patient from feeling injuries, leading to unnoticed wounds that progress to ulcers. Pain would be expected with arterial disease." },
        { question: "Which instruction should the nurse include in sick day management education for a T2DM patient?", options: ["Stop all diabetes medications when ill", "Monitor blood glucose every 2–4 hours", "Decrease fluid intake to prevent nausea", "Skip insulin doses if not eating"], correct: 1, rationale: "During illness, stress hormones (cortisol, epinephrine) raise blood glucose. Patients should monitor glucose every 2–4 hours, continue taking medications (especially insulin), stay hydrated, and contact their provider if glucose remains elevated or they cannot keep fluids down." }
      ],
      references: [
        { source: "Diabetes Canada", title: "2024 Clinical Practice Guidelines for the Prevention and Management of Diabetes in Canada", year: "2024" },
        { source: "American Diabetes Association", title: "Standards of Care in Diabetes — 2024", year: "2024" },
        { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }
      ],
      relatedSlugs: ["hba1c", "metformin", "insulin-nursing-guide", "dka-vs-hhs", "potassium"],
      seoKeywords: ["type 2 diabetes nursing", "T2DM NCLEX", "diabetes nursing interventions", "HbA1c interpretation", "metformin nursing considerations"]
    },
    {
      pageType: "condition",
      slug: "chronic-kidney-disease",
      title: "Chronic Kidney Disease (CKD)",
      metaTitle: "Chronic Kidney Disease: Nursing Guide, Stages & NCLEX Prep | NurseNest",
      metaDescription: "Comprehensive nursing guide to CKD — stages, GFR interpretation, electrolyte management, dialysis nursing care, medications, and NCLEX practice questions.",
      canonicalUrl: "https://www.nursenest.ca/nclex/renal/chronic-kidney-disease",
      bodySystem: "Renal",
      category: "Renal",
      summary: "Chronic Kidney Disease (CKD) is progressive, irreversible loss of renal function over months to years. Classified into 5 stages based on GFR. Leading causes are diabetes and hypertension.",
      data: {
        pathophysiology: "Progressive nephron loss leads to declining glomerular filtration rate (GFR). Remaining nephrons hypertrophy to compensate, but eventually become sclerosed. As GFR falls below 60 mL/min, the kidneys lose ability to regulate fluid, electrolytes, acid-base balance, and erythropoietin production. Stage 5 (ESRD, GFR < 15) requires renal replacement therapy. Complications cascade: hyperkalemia, metabolic acidosis, hyperphosphatemia with secondary hyperparathyroidism, anemia, fluid overload, and uremia.",
        signsSymptoms: {
          left: ["Fatigue and weakness", "Decreased urine output (oliguria)", "Edema (periorbital, peripheral)", "Hypertension", "Pruritus (uremic frost)", "Nausea and vomiting", "Metallic taste in mouth"],
          right: ["Anemia (pallor, dyspnea)", "Bone pain (renal osteodystrophy)", "Muscle cramps", "Cognitive changes", "Ammonia breath (uremic fetor)", "Ecchymosis (easy bruising)", "Peripheral neuropathy"]
        },
        labValues: {
          gfr: { name: "eGFR", normalCA: "> 90 mL/min/1.73m²", normalUS: "> 90 mL/min/1.73m²", significance: "Stage 1: ≥ 90 (kidney damage with normal GFR); Stage 2: 60–89; Stage 3: 30–59; Stage 4: 15–29; Stage 5/ESRD: < 15 (requires dialysis)" },
          creatinine: { name: "Creatinine", normalCA: "60–110 µmol/L", normalUS: "0.7–1.3 mg/dL", significance: "Elevated creatinine indicates decreased GFR and impaired waste filtration. Doubling of creatinine represents ~50% decline in GFR." },
          potassium: { name: "Potassium", normalCA: "3.5–5.0 mmol/L", normalUS: "3.5–5.0 mEq/L", significance: "Hyperkalemia (> 5.5 mEq/L) is life-threatening in CKD. Impaired renal excretion is the primary cause. Can cause fatal cardiac dysrhythmias." },
          phosphorus: { name: "Phosphorus", normalCA: "0.81–1.45 mmol/L", normalUS: "2.5–4.5 mg/dL", significance: "Hyperphosphatemia develops as kidneys cannot excrete phosphorus. Triggers secondary hyperparathyroidism and renal osteodystrophy." },
          hemoglobin: { name: "Hemoglobin", normalCA: "120–160 g/L (female); 140–180 g/L (male)", normalUS: "12–16 g/dL (female); 14–18 g/dL (male)", significance: "Anemia of CKD due to decreased erythropoietin production. Target Hgb 100–115 g/L with ESA therapy. Do not exceed 115 g/L." }
        },
        medications: [
          { name: "Epoetin Alfa (Epogen/Procrit)", class: "Erythropoiesis-Stimulating Agent (ESA)", mechanism: "Stimulates RBC production in bone marrow, replacing deficient endogenous erythropoietin", sideEffects: ["Hypertension", "Thromboembolism", "Pure red cell aplasia", "Headache"], contraindications: ["Uncontrolled hypertension", "Hgb > 11 g/dL (do not target > 11)"], nursingConsiderations: "Do not shake vial. Monitor Hgb biweekly. Target Hgb 100–115 g/L. Ensure adequate iron stores (ferritin > 200 µg/L) before starting. Black box warning: increased cardiovascular events if Hgb > 11 g/dL." },
          { name: "Sevelamer (Renagel)", class: "Phosphate Binder", mechanism: "Binds dietary phosphorus in the GI tract, preventing absorption", sideEffects: ["Nausea", "Constipation", "Flatulence", "Dyspepsia"], contraindications: ["Bowel obstruction", "Hypophosphatemia"], nursingConsiderations: "Take WITH meals for maximum effect. Do not crush or chew. Does not contain calcium (preferred over calcium-based binders in CKD)." },
          { name: "Calcitriol", class: "Active Vitamin D (1,25-dihydroxyvitamin D3)", mechanism: "Replaces active vitamin D that kidneys can no longer convert. Suppresses PTH and improves calcium absorption", sideEffects: ["Hypercalcemia", "Hyperphosphatemia", "Nausea", "Weakness"], contraindications: ["Hypercalcemia", "Vitamin D toxicity"], nursingConsiderations: "Monitor calcium and phosphorus levels. Avoid use with calcium-based phosphate binders (risk of hypercalcemia). Teach patient to avoid excessive dairy." },
          { name: "Sodium Polystyrene Sulfonate (Kayexalate)", class: "Cation Exchange Resin", mechanism: "Exchanges sodium for potassium in the intestine, promoting potassium excretion in stool", sideEffects: ["Constipation", "Hypokalemia (if overused)", "Sodium retention", "Bowel necrosis (rare)"], contraindications: ["Hypokalemia", "Bowel obstruction/ileus"], nursingConsiderations: "For hyperkalemia management. Can be given orally or rectally. Takes 1–2 hours to work — not for emergency hyperkalemia (use IV calcium gluconate + insulin/glucose for acute management)." }
        ],
        nursingInterventions: [
          "Monitor I&O and daily weights — restrict fluids as ordered (often 1–1.5 L/day in Stage 4–5)",
          "Maintain dietary restrictions: low potassium, low phosphorus, low sodium, controlled protein",
          "Assess for fluid overload: lung sounds, edema, weight gain, JVD",
          "Monitor electrolytes, BUN, creatinine, and GFR regularly",
          "Administer phosphate binders WITH meals",
          "Protect AV fistula/graft: no BP measurements, no blood draws, no IVs in the access arm",
          "Assess AV fistula for bruit (auscultate) and thrill (palpate) every shift",
          "Educate patient on medication timing and dietary compliance",
          "Assess for uremic symptoms: pruritus, nausea, confusion, pericarditis",
          "Support emotional coping with chronic disease management"
        ],
        complications: [
          { name: "Hyperkalemia", description: "Life-threatening potassium elevation causing peaked T waves, widened QRS, and risk of cardiac arrest. Emergency treatment: IV calcium gluconate (cardioprotection), insulin + glucose (shift K+ intracellularly), kayexalate (excretion)." },
          { name: "Metabolic Acidosis", description: "Kidneys cannot excrete hydrogen ions or regenerate bicarbonate. May require oral sodium bicarbonate supplementation." },
          { name: "Renal Osteodystrophy", description: "Bone disease from hyperphosphatemia, secondary hyperparathyroidism, and vitamin D deficiency. Increases fracture risk." },
          { name: "Uremic Pericarditis", description: "Inflammation of pericardium from uremic toxins. Friction rub on auscultation. May require emergency dialysis." },
          { name: "Anemia", description: "Normocytic normochromic anemia from decreased erythropoietin production. Treated with ESAs and iron supplementation." }
        ],
        examInsights: [
          "Know the CKD stages by GFR — Stage 3 (30–59) is most commonly tested",
          "Hyperkalemia management priority: IV calcium gluconate to stabilize the heart, THEN insulin/glucose to shift K+",
          "NEVER use the AV fistula arm for BP, blood draws, or IVs — this is a classic NCLEX question",
          "Phosphate binders must be taken WITH meals to be effective",
          "Dietary restrictions: low K+, low phosphorus, low Na+, and protein restriction (but adequate calories)"
        ]
      },
      practiceQuestions: [
        { question: "A nurse is caring for a patient with CKD Stage 4. Which lab result requires IMMEDIATE action?", options: ["BUN 45 mg/dL", "Creatinine 4.2 mg/dL", "Potassium 6.8 mEq/L", "Phosphorus 5.8 mg/dL"], correct: 2, rationale: "Potassium 6.8 mEq/L is critically elevated and poses immediate risk for fatal cardiac dysrhythmias. The nurse should obtain a stat ECG, notify the provider, and prepare for emergency potassium-lowering interventions (IV calcium gluconate, insulin/glucose). While the other values are abnormal, they are expected in Stage 4 CKD and not immediately life-threatening." },
        { question: "Which instruction should the nurse give regarding phosphate binders?", options: ["Take on an empty stomach in the morning", "Take with each meal", "Take at bedtime with a full glass of water", "Take only when phosphorus levels are elevated"], correct: 1, rationale: "Phosphate binders must be taken WITH meals to bind dietary phosphorus in the GI tract and prevent absorption. Taking them on an empty stomach renders them ineffective." },
        { question: "The nurse assesses an AV fistula and cannot palpate a thrill or hear a bruit. What is the PRIORITY action?", options: ["Document the finding as normal", "Apply a warm compress and reassess", "Notify the healthcare provider immediately", "Elevate the extremity above heart level"], correct: 2, rationale: "Absence of thrill and bruit indicates possible AV fistula clotting (thrombosis), which is a medical emergency. The nurse must notify the provider immediately for vascular surgery consultation. Delay can result in permanent access loss." },
        { question: "A patient with CKD asks why they need to limit potassium intake. Which foods should they AVOID?", options: ["White bread and pasta", "Bananas, oranges, and potatoes", "Lean chicken and fish", "Rice and corn"], correct: 1, rationale: "Bananas, oranges, potatoes, tomatoes, and avocados are HIGH in potassium and should be limited in CKD. The damaged kidneys cannot excrete potassium adequately, leading to dangerous hyperkalemia." },
        { question: "Which complication of CKD is treated with erythropoietin-stimulating agents (ESAs)?", options: ["Metabolic acidosis", "Hyperphosphatemia", "Anemia", "Hypertension"], correct: 2, rationale: "CKD-related anemia results from decreased erythropoietin production by the failing kidneys. ESAs (epoetin alfa, darbepoetin) stimulate RBC production. Target hemoglobin is 100–115 g/L — exceeding this increases cardiovascular risk." }
      ],
      references: [
        { source: "KDIGO", title: "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD", year: "2024" },
        { source: "Canadian Society of Nephrology", title: "Caring for Canadians with Kidney Failure", year: "2023" },
        { source: "National Kidney Foundation", title: "KDOQI Clinical Practice Guidelines", year: "2022" }
      ],
      relatedSlugs: ["potassium", "creatinine", "heart-failure", "diabetes-type-2", "dka-vs-hhs"],
      seoKeywords: ["CKD nursing", "chronic kidney disease NCLEX", "CKD stages GFR", "dialysis nursing care", "hyperkalemia CKD management"]
    },
    {
      pageType: "condition",
      slug: "copd",
      title: "Chronic Obstructive Pulmonary Disease (COPD)",
      metaTitle: "COPD: Nursing Assessment, Oxygen Therapy & NCLEX Guide | NurseNest",
      metaDescription: "Comprehensive COPD nursing guide — emphysema vs chronic bronchitis pathophysiology, low-flow oxygen therapy, bronchodilators, nursing interventions, and NCLEX practice questions.",
      canonicalUrl: "https://www.nursenest.ca/nclex/respiratory/copd",
      bodySystem: "Respiratory",
      category: "Respiratory",
      summary: "COPD is a progressive, irreversible airflow limitation encompassing chronic bronchitis (productive cough ≥ 3 months/year for 2 consecutive years) and emphysema (permanent destruction of alveolar walls).",
      data: {
        pathophysiology: "COPD involves two overlapping conditions: Chronic bronchitis — airway inflammation and excess mucus production narrow the bronchial lumen, causing airflow obstruction. Emphysema — destruction of alveolar walls by protease-antiprotease imbalance (elastase vs alpha-1 antitrypsin) leads to loss of elastic recoil, air trapping, and hyperinflation. Both result in impaired gas exchange, V/Q mismatch, and chronic hypoxemia. The hypoxic drive becomes the primary respiratory stimulus (CO2 narcosis in severe COPD).",
        signsSymptoms: {
          left: ["Chronic productive cough (chronic bronchitis)", "Progressive dyspnea", "Barrel chest (emphysema)", "Wheezing and prolonged expiration", "Use of accessory muscles", "Pursed-lip breathing", "Digital clubbing (chronic hypoxemia)"],
          right: ["Cyanosis", "Weight loss (emphysema — pink puffer)", "Peripheral edema (chronic bronchitis — blue bloater)", "Tripod positioning", "Diminished breath sounds", "Increased AP diameter of chest", "Frequent respiratory infections"]
        },
        labValues: {
          abg: { name: "ABG", normalCA: "pH 7.35–7.45, PaCO2 35–45 mmHg, PaO2 80–100 mmHg, HCO3 22–26 mmol/L", normalUS: "pH 7.35–7.45, PaCO2 35–45 mmHg, PaO2 80–100 mmHg, HCO3 22–26 mEq/L", significance: "Chronic respiratory acidosis (↑ PaCO2, ↑ HCO3 compensation, normal or slightly ↓ pH). Acute exacerbation shows worsening hypoxemia and acidosis." },
          fev1: { name: "FEV1/FVC Ratio", normalCA: "> 0.70 (70%)", normalUS: "> 0.70 (70%)", significance: "FEV1/FVC < 0.70 confirms airflow obstruction. FEV1 alone classifies severity: Mild > 80%, Moderate 50–79%, Severe 30–49%, Very Severe < 30%." },
          cbc: { name: "Hemoglobin/Hematocrit", normalCA: "120–160 g/L", normalUS: "12–16 g/dL", significance: "Polycythemia (↑ RBC production) occurs as compensation for chronic hypoxemia. Hematocrit may exceed 55%." }
        },
        medications: [
          { name: "Albuterol (Ventolin)", class: "Short-Acting Beta-2 Agonist (SABA)", mechanism: "Relaxes bronchial smooth muscle by stimulating beta-2 receptors, producing rapid bronchodilation", sideEffects: ["Tachycardia", "Tremor", "Anxiety", "Hypokalemia"], contraindications: ["Tachyarrhythmias", "Hypersensitivity"], nursingConsiderations: "Rescue inhaler — use for acute symptoms. Teach proper MDI technique. If using > 2 times/week, controller therapy needs adjustment. Shake before use, wait 1 minute between puffs." },
          { name: "Tiotropium (Spiriva)", class: "Long-Acting Muscarinic Antagonist (LAMA)", mechanism: "Blocks acetylcholine at muscarinic receptors in airway smooth muscle, producing sustained bronchodilation", sideEffects: ["Dry mouth", "Constipation", "Urinary retention", "Blurred vision"], contraindications: ["Narrow-angle glaucoma", "Urinary retention", "Hypersensitivity to atropine derivatives"], nursingConsiderations: "Maintenance therapy — NOT for acute rescue. Use HandiHaler device properly. Rinse mouth after use. Once daily dosing improves adherence." },
          { name: "Prednisone", class: "Systemic Corticosteroid", mechanism: "Reduces airway inflammation by suppressing immune response and decreasing edema and mucus production", sideEffects: ["Hyperglycemia", "Immunosuppression", "Osteoporosis", "Adrenal suppression", "GI ulceration"], contraindications: ["Active infections", "Live vaccines during use"], nursingConsiderations: "Short courses (5–7 days) for acute exacerbations. Taper if used > 7 days. Monitor blood glucose. Take with food. Long-term use not recommended for stable COPD." }
        ],
        nursingInterventions: [
          "Administer supplemental oxygen at 1–2 L/min via nasal cannula (target SpO2 88–92%)",
          "NEVER administer high-flow oxygen to COPD patients — risk of eliminating hypoxic drive",
          "Position in high Fowler's or tripod position to ease breathing",
          "Teach pursed-lip breathing technique (prolongs exhalation, prevents air trapping)",
          "Teach diaphragmatic breathing technique",
          "Encourage smoking cessation — single most important intervention",
          "Administer bronchodilators before meals and activities",
          "Provide small, frequent meals (large meals impair diaphragm excursion)",
          "Monitor for signs of acute exacerbation: increased dyspnea, sputum changes, fever",
          "Ensure annual influenza and pneumococcal vaccinations are current"
        ],
        complications: [
          { name: "Acute Exacerbation", description: "Worsening of symptoms beyond normal daily variation, often triggered by infection. Requires increased bronchodilator therapy, systemic corticosteroids, and possibly antibiotics." },
          { name: "Cor Pulmonale", description: "Right-sided heart failure secondary to chronic pulmonary hypertension from COPD. Presents with JVD, peripheral edema, and hepatomegaly." },
          { name: "Pneumothorax", description: "Spontaneous rupture of emphysematous blebs. Sudden onset pleuritic chest pain and dyspnea. Requires chest tube insertion." },
          { name: "Respiratory Failure", description: "Inability to maintain adequate gas exchange. May require intubation and mechanical ventilation during severe exacerbation." },
          { name: "CO2 Narcosis", description: "Excessive oxygen administration eliminates hypoxic drive, causing CO2 retention, somnolence, and respiratory arrest." }
        ],
        examInsights: [
          "COPD oxygen therapy: LOW flow (1–2 L/min), target SpO2 88–92% — this is the MOST commonly tested concept",
          "Know the difference: Pink Puffer (emphysema — thin, barrel chest, pursed lips) vs Blue Bloater (chronic bronchitis — cyanotic, edematous, productive cough)",
          "SABA before LAMA/ICS — rescue inhaler first, then maintenance inhaler",
          "Smoking cessation is the ONLY intervention proven to slow disease progression",
          "Pursed-lip breathing prevents alveolar collapse and air trapping — teach this to every COPD patient"
        ]
      },
      practiceQuestions: [
        { question: "A patient with COPD is on 2 L/min O2 via nasal cannula. The SpO2 reads 86%. What is the nurse's FIRST action?", options: ["Increase oxygen to 6 L/min", "Assess the patient and check the equipment", "Call the respiratory therapist", "Apply a non-rebreather mask"], correct: 1, rationale: "Before changing oxygen settings, the nurse should first assess the patient (breathing pattern, level of consciousness) and check the equipment (is the cannula in place? Is the O2 flowing?). COPD patients rely on hypoxic drive — abruptly increasing O2 can suppress respiratory drive and cause CO2 narcosis." },
        { question: "Which finding is consistent with emphysema (pink puffer)?", options: ["Productive cough with purulent sputum", "Barrel chest with pursed-lip breathing", "Cyanosis with peripheral edema", "Frequent respiratory infections"], correct: 1, rationale: "Emphysema patients are classically described as 'pink puffers' — thin, barrel-chested (from air trapping and hyperinflation), using pursed-lip breathing, and relatively pink (maintaining PaO2 through hyperventilation). Blue bloater describes chronic bronchitis." },
        { question: "Which is the MOST important health promotion intervention for COPD?", options: ["Annual pulmonary function testing", "Daily use of supplemental oxygen", "Smoking cessation", "Weekly respiratory physiotherapy"], correct: 2, rationale: "Smoking cessation is the single most important intervention to slow the progression of COPD. It is the only intervention proven to reduce the rate of FEV1 decline. All other interventions manage symptoms but do not alter disease course." },
        { question: "A patient uses albuterol (Ventolin) and tiotropium (Spiriva). In what order should these be administered?", options: ["Tiotropium first, then albuterol", "Albuterol first, then tiotropium", "Both at the same time", "Alternate between them every other day"], correct: 1, rationale: "Albuterol (SABA) should be administered first because it provides rapid bronchodilation within minutes, opening the airways so the tiotropium (LAMA) can penetrate deeper into the lungs for sustained effect. This is the correct sequencing for combination inhaler therapy." },
        { question: "The nurse teaches a COPD patient about pursed-lip breathing. Which patient demonstration indicates correct technique?", options: ["Inhale quickly through the mouth, exhale through the nose", "Inhale through the nose, exhale slowly through pursed lips", "Hold breath for 10 seconds, then exhale forcefully", "Breathe rapidly and shallowly"], correct: 1, rationale: "Correct pursed-lip breathing: inhale slowly through the nose (2 counts), then exhale slowly through pursed lips (4 counts). This creates back-pressure that keeps airways open, prevents premature airway collapse, and helps expel trapped air." }
      ],
      references: [
        { source: "Global Initiative for Chronic Obstructive Lung Disease (GOLD)", title: "2024 GOLD Report: Global Strategy for Diagnosis, Management, and Prevention of COPD", year: "2024" },
        { source: "Canadian Thoracic Society", title: "Canadian COPD Guidelines", year: "2023" },
        { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }
      ],
      relatedSlugs: ["pneumonia", "chest-pain-nursing-assessment", "oxygen-therapy", "respiratory-assessment", "abg-interpretation"],
      seoKeywords: ["COPD nursing", "COPD NCLEX", "emphysema vs chronic bronchitis", "COPD oxygen therapy", "pursed lip breathing COPD"]
    }
  ];
}

function getSymptomSeeds() {
  return [
    {
      pageType: "symptom",
      slug: "chest-pain-nursing-assessment",
      title: "Chest Pain",
      metaTitle: "Chest Pain Nursing Assessment: Differential Diagnosis & Red Flags | NurseNest",
      metaDescription: "Comprehensive nursing guide to chest pain assessment — differential diagnoses, red flags, PQRST assessment, clinical decision-making framework, and NCLEX practice questions.",
      canonicalUrl: "https://www.nursenest.ca/symptoms/chest-pain-nursing-assessment",
      bodySystem: "Cardiac",
      category: "Emergency",
      summary: "Chest pain is one of the most common and potentially life-threatening chief complaints in emergency and acute care settings. Rapid assessment and differentiation between cardiac and non-cardiac causes is essential for patient safety.",
      data: {
        differentialDiagnoses: [
          { condition: "Acute Coronary Syndrome (ACS)", characteristics: "Crushing, substernal pressure radiating to left arm/jaw. Diaphoresis, nausea, SOB.", urgency: "emergent", keyDifferentiator: "Not relieved by position change or antacids. ECG changes and elevated troponin." },
          { condition: "Pulmonary Embolism", characteristics: "Sudden onset pleuritic chest pain with dyspnea and tachycardia. Unilateral leg swelling (DVT source).", urgency: "emergent", keyDifferentiator: "Pleuritic (worsens with inspiration). Risk factors: immobility, recent surgery, OCP use." },
          { condition: "Tension Pneumothorax", characteristics: "Sudden severe chest pain with absent breath sounds on affected side. Tracheal deviation to opposite side.", urgency: "emergent", keyDifferentiator: "Absent breath sounds, hyperresonance to percussion, tracheal deviation." },
          { condition: "Aortic Dissection", characteristics: "Sudden, tearing/ripping chest pain radiating to the back. Unequal BP in arms.", urgency: "emergent", keyDifferentiator: "Tearing quality, BP differential > 20 mmHg between arms, wide mediastinum on CXR." },
          { condition: "Pericarditis", characteristics: "Sharp, pleuritic chest pain that improves sitting forward. Friction rub on auscultation.", urgency: "urgent", keyDifferentiator: "Relieved by sitting forward, worsened by lying flat. Diffuse ST elevation on ECG." },
          { condition: "GERD/Esophageal Spasm", characteristics: "Burning substernal discomfort, often related to meals. Relieved by antacids.", urgency: "non-emergent", keyDifferentiator: "Relationship to meals, relief with antacids, no ECG changes, normal troponin." },
          { condition: "Costochondritis", characteristics: "Localized, reproducible chest wall tenderness. Sharp pain worsened by palpation or movement.", urgency: "non-emergent", keyDifferentiator: "Reproducible on palpation. No associated dyspnea or hemodynamic changes." },
          { condition: "Anxiety/Panic Attack", characteristics: "Chest tightness with hyperventilation, palpitations, numbness/tingling. History of anxiety.", urgency: "non-emergent", keyDifferentiator: "Diagnosis of exclusion. Normal ECG, troponin, and vital signs. Associated hyperventilation." }
        ],
        redFlags: [
          "Crushing or pressure-like chest pain radiating to arm, jaw, or back",
          "Associated diaphoresis, nausea, or vomiting",
          "Hypotension (systolic BP < 90 mmHg) or severe hypertension",
          "New-onset dyspnea or tachypnea",
          "Oxygen saturation < 92%",
          "Altered level of consciousness",
          "Absent breath sounds on one side",
          "Tracheal deviation",
          "BP differential > 20 mmHg between arms",
          "History of recent surgery, immobilization, or DVT risk factors"
        ],
        assessmentSteps: [
          { step: "PQRST Assessment", description: "Provocation/Palliation (what makes it better/worse), Quality (crushing, sharp, burning, tearing), Region/Radiation (substernal, left arm, jaw, back), Severity (0–10 scale), Timing (onset, duration, constant vs intermittent)" },
          { step: "Vital Signs", description: "Blood pressure (both arms), heart rate, respiratory rate, SpO2, temperature. Compare BP bilaterally to rule out aortic dissection." },
          { step: "12-Lead ECG", description: "Obtain within 10 minutes. Look for ST elevation (STEMI), ST depression (NSTEMI), T-wave inversions, new bundle branch block, or diffuse ST changes (pericarditis)." },
          { step: "Cardiac Biomarkers", description: "Troponin I or T (serial q3–6 hours). CK-MB for reinfarction detection. BNP if heart failure suspected." },
          { step: "Physical Examination", description: "Auscultate heart sounds (S3, S4, murmur, friction rub), lung sounds (crackles, absent breath sounds), assess JVD, peripheral edema, palpate chest wall for reproducible tenderness." },
          { step: "Risk Stratification", description: "Apply HEART score or TIMI score to determine risk of major adverse cardiac events and guide disposition (discharge, observation, catheterization)." }
        ],
        clinicalDecisionFramework: {
          emergent: "If chest pain with hemodynamic instability, ST elevation, or absent breath sounds → activate code/rapid response, obtain IV access, administer aspirin, prepare for emergent intervention (PCI, chest tube, surgical consult).",
          urgent: "If chest pain with ECG changes, elevated troponin, or significant risk factors → admit for observation, serial troponins, cardiology consult. Initiate antiplatelet and anticoagulant therapy per protocol.",
          nonEmergent: "If chest pain reproducible on palpation, relieved by antacids, or associated with anxiety in setting of normal ECG and troponin → consider outpatient follow-up with appropriate reassurance and education."
        }
      },
      practiceQuestions: [
        { question: "A patient presents with sudden tearing chest pain radiating to the back with BP 180/110 in the right arm and 150/90 in the left arm. Which condition should the nurse suspect?", options: ["Myocardial infarction", "Pulmonary embolism", "Aortic dissection", "Pericarditis"], correct: 2, rationale: "Sudden tearing/ripping pain radiating to the back with BP differential > 20 mmHg between arms is classic for aortic dissection. This requires immediate surgical consultation and BP control with IV beta-blockers." },
        { question: "Which chest pain assessment finding indicates the pain is MOST likely musculoskeletal?", options: ["Pain worsens with deep inspiration", "Pain is reproduced by palpation of the chest wall", "Pain radiates to the left arm", "Pain is associated with diaphoresis"], correct: 1, rationale: "Chest wall tenderness reproducible on palpation is characteristic of costochondritis or musculoskeletal chest pain. Cardiac chest pain is NOT reproducible with palpation." },
        { question: "The nurse is using the PQRST assessment for a patient with chest pain. What does the 'Q' represent?", options: ["Quantity of pain", "Quality of pain", "Questions to ask", "Quadrant of pain"], correct: 1, rationale: "Q = Quality — the nurse asks the patient to describe the character of the pain (crushing, sharp, burning, tearing, squeezing). Quality helps differentiate cardiac (crushing, pressure) from pleuritic (sharp, stabbing) from GI (burning) causes." },
        { question: "A patient with chest pain has a troponin I of 0.02 ng/mL and a normal ECG. Which nursing action is MOST appropriate?", options: ["Discharge the patient home immediately", "Obtain serial troponin levels at 3 and 6 hours", "Prepare the patient for cardiac catheterization", "Administer thrombolytic therapy"], correct: 1, rationale: "A single normal troponin does not rule out ACS. Troponin may not be elevated for 3–6 hours after onset. Serial testing at 3 and 6 hours is essential to detect a rising trend that would confirm myocardial injury." },
        { question: "Which patient with chest pain should be triaged FIRST in the emergency department?", options: ["A 55-year-old with burning chest pain after eating", "A 45-year-old with crushing chest pain, diaphoresis, and SpO2 89%", "A 30-year-old with sharp chest pain reproduced by palpation", "A 60-year-old with chest pain relieved by sitting forward"], correct: 1, rationale: "Crushing chest pain with diaphoresis and hypoxemia (SpO2 89%) suggests ACS with hemodynamic compromise — this is the highest priority. The patient needs immediate ECG, IV access, oxygen, and aspirin." }
      ],
      references: [
        { source: "American Heart Association", title: "2021 AHA/ACC Chest Pain Guideline", year: "2021" },
        { source: "Tintinalli", title: "Emergency Medicine: A Comprehensive Study Guide, 9th Edition", year: "2020" },
        { source: "Canadian Cardiovascular Society", title: "Guidelines for the Management of Chest Pain", year: "2022" }
      ],
      relatedSlugs: ["myocardial-infarction", "heart-failure", "troponin", "pulmonary-embolism-assessment", "aortic-dissection-assessment"],
      seoKeywords: ["chest pain nursing assessment", "chest pain differential diagnosis", "PQRST assessment nursing", "chest pain red flags", "chest pain NCLEX"]
    },
    {
      pageType: "symptom",
      slug: "dyspnea-nursing-assessment",
      title: "Dyspnea (Shortness of Breath)",
      metaTitle: "Dyspnea Nursing Assessment: Causes, Red Flags & Clinical Decision-Making | NurseNest",
      metaDescription: "Complete nursing guide to dyspnea assessment — cardiac vs respiratory causes, red flags, SpO2 interpretation, and NCLEX practice questions for nursing students.",
      canonicalUrl: "https://www.nursenest.ca/symptoms/dyspnea-nursing-assessment",
      bodySystem: "Respiratory",
      category: "Respiratory",
      summary: "Dyspnea is the subjective sensation of difficulty breathing or air hunger. It is a symptom, not a disease, and requires systematic assessment to identify the underlying cause.",
      data: {
        differentialDiagnoses: [
          { condition: "Heart Failure", characteristics: "Orthopnea, PND, peripheral edema, crackles in lung bases, JVD, S3 heart sound", urgency: "urgent", keyDifferentiator: "Elevated BNP, bilateral crackles, response to diuretics, positional component" },
          { condition: "COPD Exacerbation", characteristics: "Worsening dyspnea with increased sputum production, wheezing, prolonged expiration", urgency: "urgent", keyDifferentiator: "History of COPD/smoking, wheezing, barrel chest, response to bronchodilators" },
          { condition: "Asthma", characteristics: "Episodic wheezing, chest tightness, cough. Triggered by allergens, exercise, cold air", urgency: "urgent", keyDifferentiator: "Reversible airflow obstruction (responds to albuterol), peak flow variability, atopic history" },
          { condition: "Pulmonary Embolism", characteristics: "Sudden onset dyspnea, pleuritic chest pain, tachycardia, unilateral leg swelling", urgency: "emergent", keyDifferentiator: "Risk factors (immobility, surgery, DVT), elevated D-dimer, V/Q mismatch on CT angiography" },
          { condition: "Pneumonia", characteristics: "Dyspnea with productive cough, fever, pleuritic chest pain, crackles", urgency: "urgent", keyDifferentiator: "Fever, focal crackles, consolidation on CXR, elevated WBC/procalcitonin" },
          { condition: "Anxiety/Panic", characteristics: "Dyspnea with hyperventilation, palpitations, paresthesias, sense of doom", urgency: "non-emergent", keyDifferentiator: "Normal SpO2, respiratory alkalosis on ABG, symptom reproduction with hyperventilation, diagnosis of exclusion" }
        ],
        redFlags: [
          "SpO2 < 90% on room air",
          "Respiratory rate > 30/min or < 8/min",
          "Use of accessory muscles or tripod positioning",
          "Inability to speak in full sentences",
          "Stridor (upper airway obstruction)",
          "Cyanosis (central or peripheral)",
          "Altered mental status or confusion",
          "Sudden onset at rest without clear trigger",
          "Hemoptysis (coughing up blood)",
          "Chest pain associated with dyspnea"
        ],
        assessmentSteps: [
          { step: "ABC Assessment", description: "Ensure airway is patent, breathing is present, and circulation is adequate. Intervene immediately if any component is compromised." },
          { step: "Vital Signs and SpO2", description: "Respiratory rate, depth, and pattern. SpO2 (target > 94% in most patients, 88–92% in COPD). Heart rate and blood pressure." },
          { step: "History (OLDCARTS)", description: "Onset (sudden vs gradual), Location, Duration, Character, Aggravating factors, Relieving factors, Timing, Severity (dyspnea scale 0–10). Ask about orthopnea (how many pillows?), PND, exercise tolerance." },
          { step: "Lung Auscultation", description: "Bilateral comparison in 6 fields. Listen for crackles (HF, pneumonia), wheezing (asthma, COPD), stridor (upper airway), absent sounds (pneumothorax, effusion), rhonchi (mucus)." },
          { step: "Targeted Physical Exam", description: "JVD and peripheral edema (HF). Chest wall movement symmetry. Barrel chest (COPD). Leg swelling/redness (DVT/PE). Tracheal position (pneumothorax)." },
          { step: "Diagnostics", description: "ABG (gas exchange and acid-base), CXR (consolidation, effusion, pneumothorax), BNP (HF vs pulmonary), D-dimer (PE risk), ECG (cardiac cause), CT angiography if PE suspected." }
        ],
        clinicalDecisionFramework: {
          emergent: "SpO2 < 88%, severe respiratory distress, stridor, altered consciousness → prepare for advanced airway, high-flow O2 (unless COPD), rapid response/code activation.",
          urgent: "SpO2 88–94%, moderate dyspnea at rest, new-onset or worsening from baseline → supplemental O2, stat CXR, ABG, cardiac workup, close monitoring.",
          nonEmergent: "Dyspnea only on exertion, SpO2 > 94%, stable vital signs → outpatient pulmonary/cardiac workup, PFTs, echocardiogram, ambulatory SpO2 monitoring."
        }
      },
      practiceQuestions: [
        { question: "A patient reports sleeping on 3 pillows to breathe comfortably. This finding is documented as:", options: ["Paroxysmal nocturnal dyspnea", "Three-pillow orthopnea", "Dyspnea on exertion", "Tripod positioning"], correct: 1, rationale: "Orthopnea is the sensation of dyspnea when lying flat. It is quantified by the number of pillows needed to sleep comfortably (e.g., three-pillow orthopnea). This is a classic finding in heart failure, as the supine position increases venous return and worsens pulmonary congestion." },
        { question: "Which ABG result is MOST consistent with acute respiratory distress?", options: ["pH 7.38, PaCO2 40, PaO2 95", "pH 7.50, PaCO2 28, PaO2 70", "pH 7.32, PaCO2 55, PaO2 58", "pH 7.40, PaCO2 42, PaO2 90"], correct: 2, rationale: "pH 7.32 (acidic), PaCO2 55 (elevated), PaO2 58 (hypoxemia) indicates acute respiratory acidosis with hypoxemia — the patient is retaining CO2 and not oxygenating adequately. This is consistent with respiratory failure requiring immediate intervention." },
        { question: "A COPD patient's SpO2 is 87%. What is the target SpO2 range for this patient?", options: ["95–100%", "88–92%", "92–96%", "> 98%"], correct: 1, rationale: "COPD patients rely on hypoxic drive for respiratory stimulation. The target SpO2 is 88–92%. Higher levels may suppress the hypoxic drive, leading to hypoventilation and CO2 narcosis." },
        { question: "Which assessment finding differentiates cardiac dyspnea from pulmonary dyspnea?", options: ["Wheezing on expiration", "Elevated BNP and bilateral crackles", "Productive cough with purulent sputum", "Chest wall tenderness on palpation"], correct: 1, rationale: "Elevated BNP (B-type natriuretic peptide) indicates cardiac origin of dyspnea (heart failure). BNP > 400 pg/mL strongly suggests HF. Bilateral crackles from pulmonary congestion further support the cardiac diagnosis." },
        { question: "A patient with sudden dyspnea has absent breath sounds on the right side with tracheal deviation to the left. What condition should the nurse suspect?", options: ["Right-sided pneumonia", "Right tension pneumothorax", "Right pleural effusion", "Right-sided heart failure"], correct: 1, rationale: "Absent breath sounds with tracheal deviation AWAY from the affected side is classic for tension pneumothorax. This is a life-threatening emergency requiring immediate needle decompression (14-gauge needle, 2nd intercostal space, midclavicular line) followed by chest tube insertion." }
      ],
      references: [
        { source: "American Thoracic Society", title: "Mechanisms, Assessment, and Management of Dyspnea", year: "2012" },
        { source: "Canadian Respiratory Guidelines", title: "Assessment and Management of Acute Dyspnea", year: "2022" },
        { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }
      ],
      relatedSlugs: ["chest-pain-nursing-assessment", "heart-failure", "copd", "pneumonia", "pulmonary-embolism-assessment"],
      seoKeywords: ["dyspnea nursing assessment", "shortness of breath differential diagnosis", "orthopnea nursing", "dyspnea NCLEX", "respiratory assessment nursing"]
    },
    {
      pageType: "symptom",
      slug: "edema-nursing-assessment",
      title: "Edema",
      metaTitle: "Edema Nursing Assessment: Types, Causes & Clinical Decision-Making | NurseNest",
      metaDescription: "Nursing guide to edema assessment — pitting vs non-pitting, peripheral vs pulmonary, systemic causes, grading scales, and NCLEX practice questions.",
      canonicalUrl: "https://www.nursenest.ca/symptoms/edema-nursing-assessment",
      bodySystem: "Cardiovascular",
      category: "Cardiovascular",
      summary: "Edema is the abnormal accumulation of fluid in interstitial tissues. It can be localized or generalized, pitting or non-pitting, and reflects underlying cardiac, renal, hepatic, or vascular pathology.",
      data: {
        differentialDiagnoses: [
          { condition: "Heart Failure", characteristics: "Bilateral dependent edema, JVD, weight gain, dyspnea, orthopnea", urgency: "urgent", keyDifferentiator: "Bilateral, dependent, improves with elevation and diuretics, elevated BNP" },
          { condition: "DVT", characteristics: "Unilateral leg swelling, warmth, redness, pain, positive Homans' sign (unreliable)", urgency: "urgent", keyDifferentiator: "Unilateral, calf tenderness, risk factors (immobility, surgery). Confirm with venous duplex ultrasound." },
          { condition: "Nephrotic Syndrome", characteristics: "Generalized edema (anasarca), periorbital edema (especially morning), proteinuria", urgency: "urgent", keyDifferentiator: "Periorbital edema, massive proteinuria (> 3.5 g/day), hypoalbuminemia" },
          { condition: "Liver Cirrhosis", characteristics: "Ascites, peripheral edema, spider angiomas, jaundice, caput medusae", urgency: "urgent", keyDifferentiator: "Ascites predominant, hypoalbuminemia, portal hypertension signs" },
          { condition: "Lymphedema", characteristics: "Non-pitting edema, usually unilateral, skin thickening", urgency: "non-emergent", keyDifferentiator: "Non-pitting, stemmer sign positive, history of lymph node removal or radiation" },
          { condition: "Medication-Induced", characteristics: "Bilateral peripheral edema without other systemic findings", urgency: "non-emergent", keyDifferentiator: "Temporal relationship with medication initiation (CCBs, NSAIDs, corticosteroids)" }
        ],
        redFlags: [
          "Unilateral leg swelling with pain (DVT until proven otherwise)",
          "Rapid onset generalized edema with dyspnea (anaphylaxis, HF decompensation)",
          "Facial/airway edema (angioedema — potential airway emergency)",
          "Edema with fever and erythema (cellulitis, necrotizing fasciitis)",
          "New-onset periorbital edema with decreased urine output (renal failure)",
          "Edema with weight gain > 2 lbs/day (fluid overload)"
        ],
        assessmentSteps: [
          { step: "Inspection & Distribution", description: "Is edema bilateral or unilateral? Dependent (gravity) or non-dependent? Peripheral, periorbital, sacral, or generalized (anasarca)? Note skin changes (discoloration, tightness, weeping)." },
          { step: "Pitting Assessment", description: "Press firmly for 5 seconds over bony prominence. Grade: 1+ (2mm, rapid rebound), 2+ (4mm, 15-second rebound), 3+ (6mm, 30-second rebound), 4+ (8mm, > 30-second rebound, deep pit)." },
          { step: "Daily Weight", description: "Weigh at the same time each day, same scale, similar clothing. 1 kg weight gain ≈ 1 liter fluid retention. Report gain > 1 kg/day or 2.5 kg/week." },
          { step: "Measurement", description: "Measure limb circumference at consistent anatomical landmarks to track progression. Compare bilaterally." },
          { step: "Systemic Assessment", description: "Lung sounds (crackles = pulmonary edema), JVD (right HF), ascites (liver disease), urine output (renal function), albumin level (oncotic pressure)." }
        ],
        clinicalDecisionFramework: {
          emergent: "Facial/airway edema → assess airway patency, prepare for intubation, administer epinephrine if anaphylaxis. Acute pulmonary edema → position upright, O2, IV furosemide, morphine.",
          urgent: "Unilateral leg edema → apply DVT risk assessment, obtain venous duplex ultrasound. Do NOT massage the limb. New generalized edema → assess BNP, albumin, renal function, liver function.",
          nonEmergent: "Chronic bilateral lower extremity edema with known HF → optimize diuretic therapy, dietary sodium restriction, compression stockings, leg elevation."
        }
      },
      practiceQuestions: [
        { question: "A nurse presses a thumb into a patient's ankle for 5 seconds and observes a 6mm depression that rebounds in 30 seconds. How should this be documented?", options: ["1+ pitting edema", "2+ pitting edema", "3+ pitting edema", "4+ pitting edema"], correct: 2, rationale: "3+ pitting edema: 6mm deep pit with 30-second rebound time. The grading scale: 1+ = 2mm/rapid rebound, 2+ = 4mm/15sec, 3+ = 6mm/30sec, 4+ = 8mm/>30sec." },
        { question: "Which finding should lead the nurse to suspect DVT rather than heart failure as the cause of leg edema?", options: ["Bilateral dependent edema", "Unilateral calf swelling with warmth and tenderness", "Weight gain of 3 lbs in 2 days", "Orthopnea requiring 3 pillows"], correct: 1, rationale: "DVT classically presents as UNILATERAL leg swelling with local warmth, erythema, and calf tenderness. Heart failure causes bilateral dependent edema with systemic symptoms (orthopnea, JVD, weight gain)." },
        { question: "Periorbital edema that is worse in the morning is MOST suggestive of:", options: ["Heart failure", "Nephrotic syndrome", "DVT", "Liver cirrhosis"], correct: 1, rationale: "Periorbital edema worse upon waking is characteristic of nephrotic syndrome, caused by massive proteinuria leading to hypoalbuminemia and decreased plasma oncotic pressure. Gravity causes fluid to accumulate in periorbital tissues during sleep." },
        { question: "Which nursing intervention is MOST important for a patient with 3+ pitting edema of the lower extremities?", options: ["Encourage high-sodium diet", "Apply compression stockings and elevate legs", "Restrict all oral fluids", "Administer IV normal saline"], correct: 1, rationale: "Compression stockings and leg elevation promote venous return and reduce fluid accumulation. Sodium restriction (not increase) and diuretic therapy are also important. Fluid restriction may be indicated, but not complete restriction." },
        { question: "A patient with new-onset facial swelling after starting an ACE inhibitor. What is the PRIORITY nursing action?", options: ["Administer the next dose and monitor", "Assess airway patency and hold the medication", "Apply a cold compress to the face", "Document and monitor for 24 hours"], correct: 1, rationale: "Facial/lip swelling in a patient on an ACE inhibitor suggests angioedema — a potentially life-threatening side effect. The nurse must immediately assess airway patency, hold the medication, notify the provider, and prepare for emergency airway management if needed." }
      ],
      references: [
        { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" },
        { source: "Canadian Cardiovascular Society", title: "Heart Failure Management Guidelines", year: "2023" },
        { source: "Bates", title: "Bates' Guide to Physical Examination and History Taking, 13th Edition", year: "2021" }
      ],
      relatedSlugs: ["heart-failure", "chronic-kidney-disease", "dvt-nursing-assessment", "albumin", "chest-pain-nursing-assessment"],
      seoKeywords: ["edema nursing assessment", "pitting edema grading", "edema causes nursing", "peripheral edema assessment", "edema NCLEX"]
    },
    {
      pageType: "symptom",
      slug: "hypotension-nursing-assessment",
      title: "Hypotension",
      metaTitle: "Hypotension Nursing Assessment: Causes, Types & Clinical Management | NurseNest",
      metaDescription: "Nursing guide to hypotension assessment — orthostatic, hypovolemic, cardiogenic causes, assessment steps, emergency management, and NCLEX practice questions.",
      canonicalUrl: "https://www.nursenest.ca/symptoms/hypotension-nursing-assessment",
      bodySystem: "Cardiovascular",
      category: "Emergency",
      summary: "Hypotension is defined as systolic blood pressure < 90 mmHg or a drop > 20 mmHg from baseline. It can be physiologic or pathologic, and requires rapid assessment to identify the underlying cause and prevent end-organ damage.",
      data: {
        differentialDiagnoses: [
          { condition: "Hypovolemic Shock", characteristics: "Tachycardia, weak/thready pulse, cool clammy skin, decreased urine output, altered consciousness", urgency: "emergent", keyDifferentiator: "History of bleeding, dehydration, or fluid loss. Low CVP, flat neck veins." },
          { condition: "Cardiogenic Shock", characteristics: "Hypotension with JVD, crackles, S3 heart sound, cool extremities", urgency: "emergent", keyDifferentiator: "JVD and crackles present (volume overload vs volume depletion). History of MI or heart failure." },
          { condition: "Septic Shock", characteristics: "Warm flushed skin (early/warm), tachycardia, fever, altered mental status, bounding pulse initially", urgency: "emergent", keyDifferentiator: "Warm skin initially (vasodilation), fever or hypothermia, suspected or confirmed infection source, elevated lactate." },
          { condition: "Orthostatic Hypotension", characteristics: "BP drop ≥ 20 mmHg systolic or ≥ 10 mmHg diastolic within 3 minutes of standing, with dizziness", urgency: "urgent", keyDifferentiator: "Positional — occurs on standing. Common with dehydration, medications (antihypertensives), and autonomic dysfunction." },
          { condition: "Anaphylaxis", characteristics: "Sudden hypotension with urticaria, angioedema, bronchospasm, exposure to allergen", urgency: "emergent", keyDifferentiator: "History of allergen exposure, hives, swelling, wheezing, rapid onset (minutes)." },
          { condition: "Medication-Induced", characteristics: "Gradual onset, temporal relationship with medication initiation or dose change", urgency: "urgent", keyDifferentiator: "Common with antihypertensives, nitrates, diuretics, opioids, beta-blockers." }
        ],
        redFlags: [
          "Systolic BP < 70 mmHg or MAP < 65 mmHg",
          "Altered mental status (confusion, lethargy, unresponsiveness)",
          "Heart rate > 120 bpm or < 50 bpm",
          "Urine output < 0.5 mL/kg/hr",
          "Cool, mottled, or cyanotic extremities",
          "Lactate > 4 mmol/L (tissue hypoperfusion)",
          "Active hemorrhage",
          "Signs of anaphylaxis (urticaria, angioedema, wheezing)"
        ],
        assessmentSteps: [
          { step: "Immediate Assessment", description: "Check level of consciousness (AVPU or GCS), vital signs, SpO2. Assess skin color, temperature, moisture (cool/clammy = shock). Assess peripheral pulses." },
          { step: "Orthostatic Vitals", description: "If patient is hemodynamically stable, measure BP and HR in supine, sitting, and standing positions. Wait 1–3 minutes between position changes. Positive = ≥ 20 mmHg drop systolic or ≥ 10 mmHg diastolic, or HR increase ≥ 20 bpm." },
          { step: "Volume Status Assessment", description: "JVD (flat veins = hypovolemia, distended = cardiogenic), skin turgor, mucous membranes, urine output, daily weight, I&O records." },
          { step: "Identify the Cause", description: "Look for bleeding source, infection signs, medication review, cardiac history, allergen exposure, recent procedures, fluid balance." },
          { step: "Targeted Diagnostics", description: "CBC (anemia/infection), lactate (perfusion), BMP (electrolytes/renal), coagulation studies (bleeding), blood cultures (sepsis), ECG (cardiac), bedside echo (cardiac function/tamponade)." }
        ],
        clinicalDecisionFramework: {
          emergent: "MAP < 65 mmHg with signs of shock → rapid IV fluid bolus (20 mL/kg crystalloid), place 2 large-bore IVs, Trendelenburg position, prepare vasopressors (norepinephrine first-line), activate rapid response.",
          urgent: "Symptomatic hypotension (dizziness, lightheadedness) with stable consciousness → IV fluid challenge (500 mL NS bolus), recheck BP in 15 minutes, review medications, hold antihypertensives.",
          nonEmergent: "Asymptomatic low BP or known chronic hypotension → educate on slow position changes, hydration, compression stockings, medication review at next visit."
        }
      },
      practiceQuestions: [
        { question: "A patient's BP drops from 130/80 lying to 100/60 standing with dizziness. What should the nurse document?", options: ["Normotension", "Orthostatic hypotension", "Stage 1 hypertension", "Hypovolemic shock"], correct: 1, rationale: "A systolic BP drop of ≥ 20 mmHg (130 → 100 = 30 mmHg drop) upon standing with associated symptoms (dizziness) meets the criteria for orthostatic hypotension." },
        { question: "A patient in septic shock has a MAP of 55 mmHg despite 2L IV fluid. What medication should the nurse anticipate?", options: ["Epinephrine", "Norepinephrine", "Dopamine", "Dobutamine"], correct: 1, rationale: "Norepinephrine is the first-line vasopressor for septic shock per the Surviving Sepsis Campaign guidelines. It provides potent alpha-1 vasoconstriction to increase SVR and MAP with mild beta-1 cardiac stimulation." },
        { question: "Which assessment finding differentiates cardiogenic shock from hypovolemic shock?", options: ["Tachycardia", "Hypotension", "JVD and crackles", "Altered mental status"], correct: 2, rationale: "JVD and pulmonary crackles indicate fluid overload — the heart is failing as a pump. In hypovolemic shock, neck veins are FLAT (low volume) and lungs are clear. Both conditions share tachycardia, hypotension, and altered mental status." },
        { question: "The nurse identifies a patient in anaphylactic shock. What is the FIRST medication to administer?", options: ["Diphenhydramine (Benadryl)", "Methylprednisolone (Solu-Medrol)", "Epinephrine IM", "Albuterol nebulizer"], correct: 2, rationale: "Epinephrine IM (0.3–0.5 mg of 1:1,000 in the anterolateral thigh) is the FIRST-LINE treatment for anaphylaxis. It reverses bronchospasm, vasoconstriction, and reduces vascular permeability. Antihistamines and steroids are adjunct treatments." },
        { question: "A patient on metoprolol has a BP of 85/50 and HR 48. What should the nurse do FIRST?", options: ["Give the next dose as scheduled", "Hold the medication and notify the provider", "Administer IV normal saline", "Recheck the BP in 1 hour"], correct: 1, rationale: "Metoprolol (beta-blocker) is causing symptomatic bradycardia and hypotension. The nurse should hold the medication and notify the provider immediately. Atropine and IV fluids may be needed. Never give another dose when the drug is causing the problem." }
      ],
      references: [
        { source: "Surviving Sepsis Campaign", title: "International Guidelines for Management of Sepsis and Septic Shock 2021", year: "2021" },
        { source: "American Heart Association", title: "2020 AHA Guidelines for CPR and Emergency Cardiovascular Care", year: "2020" },
        { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }
      ],
      relatedSlugs: ["chest-pain-nursing-assessment", "heart-failure", "myocardial-infarction", "potassium", "sepsis-assessment"],
      seoKeywords: ["hypotension nursing assessment", "orthostatic hypotension nursing", "shock types nursing", "hypotension management NCLEX", "vasopressors nursing"]
    },
    {
      pageType: "symptom",
      slug: "altered-level-of-consciousness",
      title: "Altered Level of Consciousness (LOC)",
      metaTitle: "Altered LOC Nursing Assessment: GCS, Causes & Emergency Management | NurseNest",
      metaDescription: "Complete nursing guide to altered level of consciousness — GCS assessment, neurological causes, metabolic etiologies, AEIOU-TIPS mnemonic, and NCLEX practice questions.",
      canonicalUrl: "https://www.nursenest.ca/symptoms/altered-level-of-consciousness",
      bodySystem: "Neurological",
      category: "Neurological",
      summary: "Altered level of consciousness (LOC) represents a spectrum from confusion to coma and indicates a change in cerebral function. It requires urgent assessment to identify reversible causes and prevent secondary brain injury.",
      data: {
        differentialDiagnoses: [
          { condition: "Stroke (CVA)", characteristics: "Sudden onset focal neurological deficits: facial droop, arm weakness, speech changes", urgency: "emergent", keyDifferentiator: "Sudden onset, unilateral deficits, FAST assessment positive, CT shows hemorrhage or ischemia" },
          { condition: "Hypoglycemia", characteristics: "Confusion, diaphoresis, tremor, tachycardia, seizures", urgency: "emergent", keyDifferentiator: "Blood glucose < 3.9 mmol/L (70 mg/dL), rapid response to glucose administration" },
          { condition: "Increased ICP", characteristics: "Headache, vomiting, papilledema, Cushing's triad (hypertension, bradycardia, irregular respirations)", urgency: "emergent", keyDifferentiator: "Cushing's triad is a late and ominous sign. Pupillary changes (unilateral dilation = uncal herniation)." },
          { condition: "Sepsis/Infection", characteristics: "Acute confusion in elderly (delirium), fever or hypothermia, tachycardia, elevated WBC", urgency: "urgent", keyDifferentiator: "Infection source identified, fluctuating confusion (delirium), elevated lactate and procalcitonin" },
          { condition: "Medication/Drug Effect", characteristics: "Variable presentation based on substance. Opioids: pinpoint pupils, respiratory depression. Benzodiazepines: ataxia, slurred speech.", urgency: "urgent", keyDifferentiator: "Medication history, toxicology screen, response to specific antidotes (naloxone, flumazenil)" },
          { condition: "Hepatic Encephalopathy", characteristics: "Confusion, asterixis (flapping tremor), fetor hepaticus, history of liver disease", urgency: "urgent", keyDifferentiator: "Elevated ammonia level, history of cirrhosis, asterixis, responds to lactulose" }
        ],
        redFlags: [
          "Sudden onset of altered consciousness",
          "GCS ≤ 8 (unable to protect airway)",
          "Unilateral pupil dilation (uncal herniation)",
          "Cushing's triad (hypertension, bradycardia, irregular breathing)",
          "Focal neurological deficits (stroke until proven otherwise)",
          "Blood glucose < 2.8 mmol/L (50 mg/dL)",
          "Fever > 39°C with nuchal rigidity (meningitis)",
          "Respiratory depression (RR < 8, SpO2 declining)"
        ],
        assessmentSteps: [
          { step: "Glasgow Coma Scale (GCS)", description: "Eye Opening: Spontaneous (4), To voice (3), To pain (2), None (1). Verbal Response: Oriented (5), Confused (4), Inappropriate words (3), Incomprehensible sounds (2), None (1). Motor Response: Obeys commands (6), Localizes pain (5), Withdrawal (4), Abnormal flexion (3), Extension (2), None (1). Total: 3–15. GCS ≤ 8 = severe, requires airway protection." },
          { step: "AEIOU-TIPS Mnemonic", description: "A = Alcohol/Acidosis, E = Epilepsy/Electrolytes/Encephalopathy, I = Insulin (hypo/hyperglycemia), O = Opiates/Overdose, U = Uremia. T = Trauma/Temperature, I = Infection, P = Psychiatric/Poisoning, S = Stroke/Shock/Seizure." },
          { step: "Pupil Assessment", description: "Size (mm), equality, reactivity to light. Unilateral dilation = ipsilateral herniation. Bilateral dilation = brain death or anticholinergic drugs. Pinpoint = opioids or pontine lesion." },
          { step: "Point-of-Care Glucose", description: "ALWAYS check blood glucose immediately in altered LOC. Hypoglycemia is the most rapidly reversible cause." },
          { step: "Neurological Examination", description: "Motor function (strength, reflexes), cranial nerves (pupil response, corneal reflex, gag reflex), posturing (decorticate = flexion, decerebrate = extension), Babinski sign." }
        ],
        clinicalDecisionFramework: {
          emergent: "GCS ≤ 8 or declining → protect airway (position, suction, prepare for intubation), check glucose, assess pupils, establish IV access, CT head, contact neurology/neurosurgery.",
          urgent: "GCS 9–13 with new onset → full neurological assessment, stat CT head, comprehensive metabolic panel, toxicology screen, close neurological monitoring q15–30min.",
          nonEmergent: "Chronic baseline cognitive impairment with no acute change → establish and document baseline, assess for reversible contributing factors (medications, UTI in elderly, constipation, pain)."
        }
      },
      practiceQuestions: [
        { question: "A patient opens eyes to voice, gives confused verbal responses, and localizes pain. What is the GCS score?", options: ["10", "11", "12", "13"], correct: 2, rationale: "Eye Opening to Voice = 3, Verbal Response Confused = 4, Motor Response Localizes Pain = 5. Total GCS = 3 + 4 + 5 = 12." },
        { question: "An elderly patient in the ICU is suddenly confused and picking at the bedsheets. Vital signs show temp 38.8°C and HR 110. What should the nurse suspect?", options: ["Dementia", "Delirium secondary to infection", "Depression", "Stroke"], correct: 1, rationale: "Acute onset confusion in an elderly patient with fever and tachycardia strongly suggests delirium secondary to infection (likely UTI or pneumonia). Delirium is acute and fluctuating, unlike dementia which is chronic and progressive." },
        { question: "A patient with altered LOC has pinpoint pupils and RR of 6. Which medication should the nurse prepare?", options: ["Flumazenil", "Naloxone (Narcan)", "Dextrose 50%", "Epinephrine"], correct: 1, rationale: "Pinpoint pupils with respiratory depression is the classic triad of opioid overdose. Naloxone (Narcan) is the specific opioid antagonist. Administer IV/IM/IN and monitor for recurrence of respiratory depression." },
        { question: "What is the FIRST assessment the nurse should perform for any patient with altered level of consciousness?", options: ["Glasgow Coma Scale", "Pupil assessment", "Point-of-care blood glucose", "Head CT scan"], correct: 2, rationale: "Blood glucose should ALWAYS be checked immediately in altered LOC because hypoglycemia is the most rapidly reversible cause and can cause permanent brain damage if untreated. It takes seconds to check and can immediately change management." },
        { question: "A patient's GCS drops from 11 to 7 over 2 hours. What is the nurse's PRIORITY action?", options: ["Recheck the GCS in 1 hour", "Notify the healthcare provider immediately", "Administer acetaminophen", "Reposition the patient"], correct: 1, rationale: "A declining GCS (especially to ≤ 8) indicates worsening neurological status and potential need for airway protection and emergent intervention. The nurse must notify the provider immediately for further evaluation (stat CT, possible intubation)." }
      ],
      references: [
        { source: "American Association of Neuroscience Nurses (AANN)", title: "Clinical Practice Guidelines for Assessment of Neurological Status", year: "2022" },
        { source: "Teasdale & Jennett", title: "Assessment of Coma and Impaired Consciousness: A Practical Scale (GCS)", year: "1974" },
        { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }
      ],
      relatedSlugs: ["stroke-nursing-assessment", "hypoglycemia", "sepsis-assessment", "chest-pain-nursing-assessment", "sodium"],
      seoKeywords: ["altered LOC nursing", "Glasgow Coma Scale nursing", "GCS assessment NCLEX", "AEIOU TIPS mnemonic", "neurological assessment nursing"]
    }
  ];
}

function getMedicationSeeds() {
  return [
    {
      pageType: "medication",
      slug: "metoprolol",
      title: "Metoprolol (Lopressor/Toprol-XL)",
      metaTitle: "Metoprolol Nursing Guide: Uses, Side Effects & Patient Teaching | NurseNest",
      metaDescription: "Complete metoprolol nursing guide — mechanism of action, nursing considerations, side effects, contraindications, patient teaching, drug interactions, and NCLEX practice questions.",
      canonicalUrl: "https://www.nursenest.ca/meds/metoprolol",
      bodySystem: "Cardiac",
      category: "Cardiovascular",
      summary: "Metoprolol is a selective beta-1 adrenergic blocker used for hypertension, angina, heart failure, and post-MI. Available as immediate-release (Lopressor) and extended-release (Toprol-XL).",
      data: {
        genericName: "Metoprolol",
        brandNames: ["Lopressor (immediate-release)", "Toprol-XL (extended-release)"],
        drugClass: "Selective Beta-1 Adrenergic Blocker (Cardioselective)",
        mechanismOfAction: "Selectively blocks beta-1 adrenergic receptors in the heart, reducing heart rate, contractility, and conduction velocity through the AV node. Decreases myocardial oxygen demand and cardiac workload. At higher doses, selectivity may be lost, affecting beta-2 receptors in the lungs.",
        indications: ["Hypertension", "Angina pectoris", "Heart failure (Toprol-XL only)", "Post-myocardial infarction", "Atrial fibrillation/flutter rate control", "Migraine prophylaxis"],
        dosing: {
          hypertension: "25–100 mg PO twice daily (IR) or 25–200 mg PO daily (XL)",
          heartFailure: "Start 12.5–25 mg PO daily (XL), titrate every 2 weeks to target 200 mg daily",
          postMI: "25–50 mg PO every 6 hours × 48 hours, then 100 mg PO twice daily",
          atrialFibrillation: "2.5–5 mg IV bolus over 2 minutes, may repeat every 5 minutes (max 15 mg)"
        },
        sideEffects: [
          { effect: "Bradycardia", severity: "Common", management: "Hold if HR < 60 bpm. Monitor telemetry. Atropine for symptomatic bradycardia." },
          { effect: "Hypotension", severity: "Common", management: "Hold if systolic BP < 90 mmHg. Assess for orthostatic changes. IV fluids if symptomatic." },
          { effect: "Fatigue and dizziness", severity: "Common", management: "Usually improves with time. Advise changing positions slowly." },
          { effect: "Bronchospasm", severity: "Serious", management: "More common at high doses when beta-2 selectivity is lost. Caution in asthma/COPD." },
          { effect: "Masking hypoglycemia symptoms", severity: "Serious", management: "Masks tachycardia response to low blood sugar. Diaphoresis may be the only symptom. Critical teaching for diabetic patients." },
          { effect: "Rebound hypertension/tachycardia", severity: "Life-threatening", management: "NEVER abruptly discontinue — taper over 1–2 weeks. Sudden withdrawal can cause rebound hypertension, angina, or MI." }
        ],
        contraindications: ["Severe bradycardia (HR < 45 bpm)", "Heart block > first degree (without pacemaker)", "Decompensated heart failure", "Cardiogenic shock", "Severe peripheral vascular disease", "Pheochromocytoma (without alpha-blocker)"],
        nursingConsiderations: [
          "Check apical pulse for 1 full minute before administration — hold if HR < 60 bpm",
          "Monitor blood pressure before and after administration",
          "Do NOT crush or chew extended-release (Toprol-XL) tablets",
          "Administer with or immediately after meals to enhance absorption",
          "Monitor for signs of heart failure exacerbation (weight gain, dyspnea, edema)",
          "Teach patient to rise slowly from sitting/lying to prevent orthostatic hypotension",
          "Taper gradually over 1–2 weeks when discontinuing — never stop abruptly",
          "Monitor blood glucose in diabetic patients (masks tachycardia from hypoglycemia)"
        ],
        patientTeaching: [
          "Take your pulse before each dose — call your provider if heart rate is below 60 bpm",
          "Do not stop this medication suddenly — this can cause dangerous rebound effects",
          "Rise slowly from sitting or lying positions to prevent dizziness",
          "If you have diabetes, monitor blood sugar closely — this medication can hide symptoms of low blood sugar",
          "Avoid alcohol — it increases the blood pressure-lowering effect",
          "Report shortness of breath, swelling in feet/ankles, unusual fatigue, or weight gain > 2 lbs/day",
          "Do not crush extended-release tablets (Toprol-XL) — swallow whole"
        ],
        herbalInteractions: [
          { herb: "Ephedra (Ma Huang)", interaction: "May counteract antihypertensive effects and increase heart rate" },
          { herb: "Hawthorn", interaction: "Additive hypotensive and bradycardic effects — monitor closely" },
          { herb: "St. John's Wort", interaction: "May decrease metoprolol levels through CYP2D6 induction" },
          { herb: "Grapefruit juice", interaction: "May increase metoprolol absorption and plasma levels" }
        ],
        examTips: [
          "NCLEX favorite: Check apical pulse × 1 full minute before giving beta-blockers. Hold if < 60 bpm.",
          "Know that beta-blockers mask tachycardia in hypoglycemia — diaphoresis becomes the primary warning sign",
          "Never abruptly discontinue — always taper. This is tested frequently.",
          "Metoprolol is beta-1 SELECTIVE (heart) at low doses. At high doses, selectivity is lost (affects lungs too).",
          "Heart failure: Start low, go slow. Only Toprol-XL is approved for HF (not immediate-release Lopressor)."
        ]
      },
      practiceQuestions: [
        { question: "Before administering metoprolol, the nurse obtains an apical pulse of 54 bpm. What is the appropriate action?", options: ["Administer the medication as scheduled", "Hold the medication and notify the provider", "Give half the prescribed dose", "Recheck the pulse in 30 minutes and then give"], correct: 1, rationale: "Metoprolol should be held if the heart rate is < 60 bpm due to risk of symptomatic bradycardia. The nurse should notify the provider for further orders. This is a classic NCLEX question." },
        { question: "A patient on metoprolol and insulin reports feeling sweaty but denies palpitations. What should the nurse suspect?", options: ["Anxiety attack", "Metoprolol toxicity", "Masked hypoglycemia", "Normal side effect of metoprolol"], correct: 2, rationale: "Beta-blockers mask the tachycardia response to hypoglycemia. Diaphoresis (sweating) may be the only remaining symptom. The nurse should immediately check the blood glucose level." },
        { question: "A patient asks why they cannot stop metoprolol abruptly. What is the BEST explanation?", options: ["The medication needs time to leave your system", "Sudden stopping can cause a dangerous spike in heart rate and blood pressure", "Your body needs to slowly adjust to lower doses", "It will cause permanent heart damage"], correct: 1, rationale: "Abrupt discontinuation causes rebound sympathetic activation (upregulation of beta receptors), leading to rebound tachycardia, hypertension, and potentially angina or MI. The medication must be tapered over 1–2 weeks." },
        { question: "Which patient should the nurse question before administering metoprolol?", options: ["A patient with hypertension and HR 72", "A patient with heart failure on stable dose", "A patient with asthma and HR 88", "A patient post-MI with HR 68"], correct: 2, rationale: "Beta-blockers can cause bronchospasm in patients with asthma by blocking beta-2 receptors in the lungs. While metoprolol is beta-1 selective, selectivity is lost at higher doses. The nurse should question this order and verify with the provider." },
        { question: "The nurse is teaching about Toprol-XL (extended-release metoprolol). Which statement indicates correct understanding?", options: ["I should crush the tablet if I have trouble swallowing", "I should take it on an empty stomach for best results", "I should swallow the tablet whole with food", "I should take it only when I feel my heart racing"], correct: 2, rationale: "Extended-release tablets must be swallowed whole — crushing destroys the sustained-release mechanism, causing rapid absorption and potentially dangerous effects. Taking with food enhances absorption." }
      ],
      references: [
        { source: "Lexicomp / UpToDate", title: "Metoprolol: Drug Information", year: "2024" },
        { source: "American Heart Association", title: "2022 AHA/ACC Heart Failure Guidelines", year: "2022" },
        { source: "CPS (Compendium of Pharmaceuticals and Specialties)", title: "Metoprolol Monograph", year: "2024" }
      ],
      relatedSlugs: ["heart-failure", "myocardial-infarction", "carvedilol", "lisinopril", "atrial-fibrillation"],
      seoKeywords: ["metoprolol nursing", "metoprolol side effects", "beta blocker nursing considerations", "metoprolol NCLEX", "metoprolol patient teaching"]
    },
    {
      pageType: "medication", slug: "lisinopril", title: "Lisinopril (Zestril/Prinivil)", metaTitle: "Lisinopril Nursing Guide: ACE Inhibitor Considerations & Teaching | NurseNest", metaDescription: "Complete nursing guide to lisinopril — mechanism, angioedema risk, dry cough, potassium monitoring, patient teaching, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/meds/lisinopril", bodySystem: "Cardiac", category: "Cardiovascular", summary: "Lisinopril is an ACE inhibitor that blocks conversion of angiotensin I to angiotensin II, reducing blood pressure, afterload, and cardiac remodeling. First-line for hypertension, heart failure, and diabetic nephropathy.",
      data: { genericName: "Lisinopril", brandNames: ["Zestril", "Prinivil"], drugClass: "Angiotensin-Converting Enzyme (ACE) Inhibitor", mechanismOfAction: "Inhibits ACE, preventing conversion of angiotensin I to angiotensin II. This reduces aldosterone secretion, decreases sodium/water retention, reduces peripheral vascular resistance, and prevents cardiac remodeling. Also increases bradykinin (responsible for cough).", indications: ["Hypertension", "Heart failure", "Post-MI", "Diabetic nephropathy (renoprotective)", "Chronic kidney disease"], sideEffects: [{ effect: "Dry persistent cough", severity: "Common", management: "Occurs in 5–20% due to bradykinin accumulation. Switch to ARB (losartan) if intolerable." }, { effect: "Hyperkalemia", severity: "Serious", management: "Monitor K+ regularly. Avoid potassium supplements and salt substitutes." }, { effect: "Angioedema", severity: "Life-threatening", management: "Swelling of face, lips, tongue, throat. Discontinue immediately. May require epinephrine and airway management." }, { effect: "Hypotension (first-dose)", severity: "Common", management: "Start low dose. Administer at bedtime initially. Monitor after first dose." }], contraindications: ["Pregnancy (teratogenic — category X)", "History of angioedema", "Bilateral renal artery stenosis"], nursingConsiderations: ["Monitor BP, potassium, BUN/creatinine", "Teach to report facial/lip/tongue swelling immediately (angioedema)", "Dry cough is expected — switch to ARB if intolerable", "Avoid in pregnancy — causes fetal renal agenesis", "Monitor first-dose effect — may cause significant hypotension"], patientTeaching: ["Report swelling of face, lips, or tongue immediately — this is a medical emergency", "A dry cough may develop — report to provider but do not stop medication on your own", "Avoid potassium supplements and salt substitutes (contain KCl)", "This medication is dangerous during pregnancy — use reliable contraception", "Take as directed even if you feel fine — hypertension is often asymptomatic"], herbalInteractions: [{ herb: "Potassium-containing salt substitutes", interaction: "Additive hyperkalemia risk" }, { herb: "Licorice root", interaction: "May counteract antihypertensive effects" }], examTips: ["ACE inhibitor + dry cough = switch to ARB (not stop altogether)", "Angioedema is a LIFE-THREATENING side effect — discontinue immediately", "Pregnancy is an ABSOLUTE contraindication", "Monitor potassium — ACE inhibitors INCREASE potassium"] },
      practiceQuestions: [{ question: "A patient on lisinopril develops swelling of the lips and tongue. What is the PRIORITY nursing action?", options: ["Administer diphenhydramine", "Discontinue the medication and assess airway", "Reassure the patient this is temporary", "Apply ice to reduce swelling"], correct: 1, rationale: "Lip and tongue swelling in a patient on an ACE inhibitor indicates angioedema — a potentially life-threatening emergency. The nurse must immediately discontinue the medication, assess airway patency, and prepare for emergency airway management. Epinephrine may be needed." }, { question: "A patient reports a persistent dry cough since starting lisinopril. What should the nurse anticipate?", options: ["Increasing the lisinopril dose", "Switching to an ARB such as losartan", "Adding a cough suppressant", "Discontinuing all antihypertensives"], correct: 1, rationale: "Dry cough is a common side effect of ACE inhibitors due to bradykinin accumulation. If intolerable, the standard approach is to switch to an ARB (angiotensin receptor blocker) like losartan, which does not cause cough." }, { question: "Why are ACE inhibitors contraindicated in pregnancy?", options: ["They cause maternal hypertension", "They are teratogenic and cause fetal renal damage", "They increase risk of gestational diabetes", "They cause placental abruption"], correct: 1, rationale: "ACE inhibitors are pregnancy category X — they cause fetal renal agenesis (failure of kidney development), oligohydramnios, skull hypoplasia, and fetal/neonatal death. They must be discontinued immediately if pregnancy is discovered." }, { question: "Which lab should be monitored MOST closely in a patient on lisinopril and spironolactone?", options: ["Sodium", "Calcium", "Potassium", "Magnesium"], correct: 2, rationale: "Both lisinopril (ACE inhibitor) and spironolactone (potassium-sparing diuretic) increase potassium retention. Combined use creates significant hyperkalemia risk. Serum potassium must be monitored closely." }, { question: "A patient's BP is 88/56 after the first dose of lisinopril. What should the nurse do?", options: ["This is expected — continue monitoring", "Hold the next dose and notify the provider", "Administer a second dose to lower BP further", "Position the patient in Trendelenburg"], correct: 1, rationale: "First-dose hypotension is a known effect of ACE inhibitors, especially in volume-depleted patients. The nurse should hold the next dose, notify the provider, and monitor the patient. IV fluids may be needed if symptomatic." }],
      references: [{ source: "Lexicomp / UpToDate", title: "Lisinopril: Drug Information", year: "2024" }, { source: "AHA/ACC", title: "2022 Heart Failure Guidelines", year: "2022" }],
      relatedSlugs: ["metoprolol", "heart-failure", "potassium", "chronic-kidney-disease", "losartan"],
      seoKeywords: ["lisinopril nursing", "ACE inhibitor nursing considerations", "lisinopril angioedema", "lisinopril NCLEX", "ACE inhibitor patient teaching"]
    },
    {
      pageType: "medication", slug: "warfarin", title: "Warfarin (Coumadin)", metaTitle: "Warfarin Nursing Guide: INR Monitoring, Interactions & Patient Teaching | NurseNest", metaDescription: "Complete warfarin nursing guide — mechanism, INR monitoring, vitamin K interactions, bleeding precautions, patient teaching, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/meds/warfarin", bodySystem: "Hematology", category: "Hematology", summary: "Warfarin is an oral anticoagulant that inhibits vitamin K-dependent clotting factor synthesis. It is used for DVT/PE treatment/prevention, atrial fibrillation, and mechanical heart valves.",
      data: { genericName: "Warfarin", brandNames: ["Coumadin", "Jantoven"], drugClass: "Vitamin K Antagonist (Oral Anticoagulant)", mechanismOfAction: "Inhibits the hepatic synthesis of vitamin K-dependent clotting factors (II, VII, IX, X) and proteins C and S. Takes 3–5 days for full anticoagulant effect because existing clotting factors must be depleted.", indications: ["DVT/PE treatment and prevention", "Atrial fibrillation (stroke prevention)", "Mechanical heart valve", "Post-MI (select patients)"], sideEffects: [{ effect: "Bleeding", severity: "Life-threatening", management: "Minor: apply pressure. Major: IV vitamin K (phytonadione), FFP, or PCC. Monitor INR." }, { effect: "Skin necrosis", severity: "Serious", management: "Rare — occurs 3–8 days after initiation. Related to protein C depletion. Bridge with heparin." }, { effect: "Purple toe syndrome", severity: "Serious", management: "Cholesterol microemboli to toes. Discontinue warfarin." }], contraindications: ["Active major bleeding", "Pregnancy (teratogenic)", "Severe liver disease", "Recent surgery of CNS or eye", "Unsupervised patients with high fall risk"], nursingConsiderations: ["Monitor INR regularly — therapeutic range 2.0–3.0 (2.5–3.5 for mechanical valves)", "Antidote: Vitamin K (phytonadione) — IV for emergencies, PO for supratherapeutic INR", "Numerous drug interactions (CYP2C9) — review ALL medications including OTC and herbal", "Consistent vitamin K intake — do NOT eliminate green vegetables, but keep intake CONSISTENT", "Educate on bleeding precautions: soft toothbrush, electric razor, avoid contact sports"], patientTeaching: ["Take at the SAME TIME every day", "Keep vitamin K intake CONSISTENT (do not suddenly increase or decrease leafy greens)", "Report any unusual bleeding: black stools, blood in urine, nosebleeds, excessive bruising", "Use a soft toothbrush and electric razor", "Wear a medical alert bracelet", "Inform ALL healthcare providers (including dentists) that you take warfarin", "Avoid aspirin, ibuprofen, and other NSAIDs unless approved by your provider"], herbalInteractions: [{ herb: "Ginkgo biloba", interaction: "Increases bleeding risk (antiplatelet effect)" }, { herb: "Garlic supplements", interaction: "May increase anticoagulant effect and bleeding risk" }, { herb: "Ginseng", interaction: "May decrease warfarin effectiveness" }, { herb: "Cranberry juice (large amounts)", interaction: "May increase INR and bleeding risk" }, { herb: "St. John's Wort", interaction: "Decreases warfarin levels through CYP induction — can cause subtherapeutic INR" }], examTips: ["Therapeutic INR range: 2.0–3.0 (most common) or 2.5–3.5 (mechanical heart valves)", "Vitamin K is the antidote — know IV vs PO routes", "Do NOT eliminate vitamin K foods — keep intake CONSISTENT", "Takes 3–5 days for full effect — must bridge with heparin initially", "NCLEX loves warfarin interaction questions — know vitamin K foods, NSAIDs, antibiotics"] },
      practiceQuestions: [{ question: "A patient on warfarin has an INR of 5.2. What should the nurse anticipate?", options: ["Increase the warfarin dose", "Hold warfarin and administer oral vitamin K", "Administer heparin", "Continue current dose and recheck in 1 week"], correct: 1, rationale: "INR 5.2 is supratherapeutic (increased bleeding risk). The nurse should anticipate holding warfarin and administering vitamin K. For INR > 4.5 without bleeding, oral vitamin K and holding doses is standard. For active major bleeding, IV vitamin K, FFP, or PCC is used." }, { question: "Which patient statement indicates a need for further warfarin teaching?", options: ["I should take my warfarin at the same time every day", "I need to completely avoid all green vegetables", "I should use an electric razor when shaving", "I should report any unusual bruising to my doctor"], correct: 1, rationale: "Patients should NOT completely avoid green vegetables — they should maintain CONSISTENT vitamin K intake. Sudden elimination of dietary vitamin K would cause INR to rise dangerously. Sudden increase would cause INR to drop, reducing anticoagulation." }, { question: "A patient on warfarin plans to take ibuprofen for a headache. What should the nurse advise?", options: ["Take it as needed — it's safe with warfarin", "Avoid ibuprofen — use acetaminophen instead", "Take half the normal dose", "Take it only with food"], correct: 1, rationale: "NSAIDs (ibuprofen, naproxen) increase bleeding risk when taken with warfarin by inhibiting platelet function and potentially increasing INR. Acetaminophen (Tylenol) is the recommended alternative for pain relief." }, { question: "Why is heparin administered concurrently when initiating warfarin therapy?", options: ["Warfarin increases the risk of DVT initially", "Warfarin takes 3–5 days to reach therapeutic effect", "Heparin enhances warfarin absorption", "Heparin prevents warfarin side effects"], correct: 1, rationale: "Warfarin inhibits synthesis of NEW clotting factors, but existing factors must be depleted first (3–5 days). During this window, the patient is unprotected. Heparin provides immediate anticoagulation until warfarin becomes therapeutic." }, { question: "Which food is HIGHEST in vitamin K and would most affect warfarin therapy if consumed inconsistently?", options: ["Chicken breast", "White rice", "Kale and spinach", "Bananas"], correct: 2, rationale: "Kale and spinach are among the highest dietary sources of vitamin K. Inconsistent consumption would cause INR fluctuations — high intake lowers INR (less anticoagulation), low intake raises INR (more anticoagulation)." }],
      references: [{ source: "American College of Chest Physicians (ACCP)", title: "Antithrombotic Therapy Guidelines, 10th Edition", year: "2022" }, { source: "Lexicomp / UpToDate", title: "Warfarin: Drug Information", year: "2024" }],
      relatedSlugs: ["metoprolol", "heparin-nursing-guide", "inr", "dvt-assessment", "atrial-fibrillation"],
      seoKeywords: ["warfarin nursing", "INR monitoring nursing", "warfarin vitamin K", "warfarin NCLEX", "warfarin patient teaching"]
    },
    {
      pageType: "medication", slug: "furosemide", title: "Furosemide (Lasix)", metaTitle: "Furosemide Nursing Guide: Loop Diuretic Considerations & Teaching | NurseNest", metaDescription: "Complete furosemide nursing guide — mechanism, electrolyte monitoring, ototoxicity, patient teaching, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/meds/furosemide", bodySystem: "Renal", category: "Cardiovascular", summary: "Furosemide is a loop diuretic that inhibits sodium-potassium-chloride cotransporter in the ascending loop of Henle, producing rapid and potent diuresis. Used for heart failure, pulmonary edema, and renal disease.",
      data: { genericName: "Furosemide", brandNames: ["Lasix"], drugClass: "Loop Diuretic", mechanismOfAction: "Inhibits the Na+/K+/2Cl- cotransporter in the thick ascending loop of Henle, blocking reabsorption of sodium, potassium, and chloride. Produces rapid, potent diuresis. Also causes venodilation, reducing preload before diuretic effect begins.", indications: ["Heart failure with fluid overload", "Acute pulmonary edema", "Edema from hepatic/renal disease", "Hypertension (second-line)", "Hypercalcemia"], sideEffects: [{ effect: "Hypokalemia", severity: "Serious", management: "Monitor K+ levels. Supplement with KCl 20–40 mEq. Eat potassium-rich foods." }, { effect: "Hypotension/dehydration", severity: "Serious", management: "Monitor BP, daily weights, I&O. Hold if systolic < 90 mmHg." }, { effect: "Ototoxicity", severity: "Serious", management: "Rapid IV push increases risk. Administer IV no faster than 4 mg/min. Report tinnitus or hearing changes." }, { effect: "Hyponatremia", severity: "Serious", management: "Monitor sodium levels. Restrict free water if Na+ < 130 mEq/L." }, { effect: "Hyperglycemia", severity: "Common", management: "Monitor blood glucose in diabetic patients." }], contraindications: ["Anuria", "Severe electrolyte depletion", "Hepatic coma", "Hypersensitivity to sulfonamides (cross-reactivity)"], nursingConsiderations: ["Monitor daily weights (same time, same scale) — most reliable indicator of fluid balance", "Monitor I&O strictly", "Monitor electrolytes: K+, Na+, Cl-, Mg2+, Ca2+", "Administer PO dose in the morning (and second dose by 2 PM if bid) to prevent nocturia", "IV push: administer no faster than 4 mg/min to prevent ototoxicity", "Assess for dehydration: skin turgor, mucous membranes, orthostatic hypotension", "Monitor BUN/creatinine — watch for prerenal azotemia from over-diuresis"], patientTeaching: ["Take in the morning to avoid nighttime urination", "Eat potassium-rich foods: bananas, oranges, potatoes, spinach", "Weigh yourself daily — report gain > 2 lbs/day or 5 lbs/week", "Rise slowly from sitting or lying positions", "Report ringing in ears, muscle cramps, or dizziness", "Avoid excessive sun exposure (photosensitivity)"], herbalInteractions: [{ herb: "Licorice root", interaction: "Worsens potassium loss — additive hypokalemia" }, { herb: "Ginseng", interaction: "May interfere with diuretic effect" }], examTips: ["Hypokalemia is the #1 side effect to monitor — low K+ increases digoxin toxicity risk", "Daily weight is the MOST reliable indicator of fluid status (not I&O alone)", "Administer IV no faster than 4 mg/min — too fast = ototoxicity", "Furosemide has sulfa cross-reactivity — assess for sulfa allergy", "Morning administration prevents nocturia — this is a patient teaching essential"] },
      practiceQuestions: [{ question: "A patient receiving both furosemide and digoxin has a potassium level of 3.0 mEq/L. Why is this dangerous?", options: ["Low potassium reduces digoxin effectiveness", "Low potassium increases the risk of digoxin toxicity", "Low potassium causes furosemide to stop working", "Low potassium is normal when taking diuretics"], correct: 1, rationale: "Hypokalemia increases digoxin's binding to the Na+/K+ ATPase pump, enhancing its effect and increasing the risk of life-threatening toxicity (bradycardia, visual changes, dysrhythmias). Potassium must be maintained > 3.5 mEq/L when taking digoxin." }, { question: "At what rate should IV furosemide be administered to prevent ototoxicity?", options: ["1 mg/min", "4 mg/min", "10 mg/min", "As a rapid bolus"], correct: 1, rationale: "IV furosemide should be administered no faster than 4 mg/min. Rapid administration increases the risk of ototoxicity (tinnitus, reversible or irreversible hearing loss)." }, { question: "When is the BEST time for a patient to take oral furosemide?", options: ["At bedtime", "In the morning", "With dinner", "Whenever they remember"], correct: 1, rationale: "Oral furosemide should be taken in the morning to prevent nocturia. If a second dose is needed, it should be taken by 2 PM." }, { question: "A patient taking furosemide reports muscle cramps and weakness. Which electrolyte imbalance should the nurse suspect?", options: ["Hyperkalemia", "Hypokalemia", "Hypernatremia", "Hypercalcemia"], correct: 1, rationale: "Furosemide causes significant potassium loss. Hypokalemia symptoms include muscle cramps, weakness, fatigue, and cardiac dysrhythmias. The nurse should check the potassium level and notify the provider." }, { question: "Which assessment is MOST reliable for monitoring the effectiveness of furosemide?", options: ["Blood pressure", "Daily weight", "Serum creatinine", "Urine specific gravity"], correct: 1, rationale: "Daily weight is the MOST reliable indicator of fluid status. A loss of 1 kg represents approximately 1 liter of fluid lost. This is more accurate than I&O alone because it captures insensible losses." }],
      references: [{ source: "Lexicomp / UpToDate", title: "Furosemide: Drug Information", year: "2024" }, { source: "AHA/ACC", title: "Heart Failure Management Guidelines", year: "2022" }],
      relatedSlugs: ["heart-failure", "potassium", "chronic-kidney-disease", "metoprolol", "digoxin-nursing-guide"],
      seoKeywords: ["furosemide nursing", "Lasix nursing considerations", "loop diuretic NCLEX", "furosemide patient teaching", "furosemide ototoxicity"]
    },
    {
      pageType: "medication", slug: "insulin-nursing-guide", title: "Insulin (All Types)", metaTitle: "Insulin Nursing Guide: Types, Administration & Patient Teaching | NurseNest", metaDescription: "Complete insulin nursing guide — rapid vs long-acting types, onset/peak/duration, injection technique, hypoglycemia management, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/meds/insulin-nursing-guide", bodySystem: "Endocrine", category: "Endocrine", summary: "Insulin is a hormone replacement therapy used in Type 1 and Type 2 diabetes to lower blood glucose. Understanding onset, peak, and duration of different insulin types is critical for safe administration.",
      data: { genericName: "Insulin (various types)", brandNames: ["Humalog (lispro)", "NovoLog (aspart)", "Regular (Humulin R)", "NPH (Humulin N)", "Lantus (glargine)", "Levemir (detemir)", "Tresiba (degludec)"], drugClass: "Hormone / Antidiabetic", mechanismOfAction: "Facilitates glucose uptake into cells by binding to insulin receptors, activating glucose transport proteins (GLUT4). Promotes glycogen synthesis, protein synthesis, and lipogenesis. Inhibits gluconeogenesis, glycogenolysis, and lipolysis.", indications: ["Type 1 Diabetes (absolute requirement)", "Type 2 Diabetes (when oral agents fail)", "DKA and HHS (emergency IV insulin)", "Hyperkalemia (shifts K+ intracellularly)", "Gestational diabetes"], sideEffects: [{ effect: "Hypoglycemia", severity: "Life-threatening", management: "Rule of 15: 15g fast-acting carbs, recheck in 15 min. Glucagon IM if unconscious." }, { effect: "Weight gain", severity: "Common", management: "Anabolic effect. Monitor weight, adjust diet and exercise." }, { effect: "Lipodystrophy", severity: "Common", management: "Rotate injection sites to prevent. Lipohypertrophy (lumps) and lipoatrophy (pits)." }, { effect: "Hypokalemia", severity: "Serious", management: "Insulin shifts K+ into cells. Monitor K+ especially during IV insulin infusions." }], contraindications: ["Hypoglycemia", "Known hypersensitivity to insulin type"], nursingConsiderations: ["Always verify the correct insulin type, dose, route, and timing", "Only Regular insulin can be given IV — all others are SubQ only", "When mixing NPH and Regular: draw up Regular (clear) first, then NPH (cloudy) — 'clear before cloudy'", "Rotate injection sites (abdomen has fastest absorption, then arms, thighs, buttocks)", "Store unopened vials in refrigerator. In-use pens/vials at room temperature for up to 28 days", "Monitor blood glucose before meals and at bedtime", "Assess for hypoglycemia symptoms during peak action times", "Lantus and Levemir should NEVER be mixed with other insulins"], patientTeaching: ["Learn to recognize signs of hypoglycemia: shakiness, sweating, confusion, rapid heartbeat", "Always carry a fast-acting carbohydrate source (glucose tablets, juice)", "Rotate injection sites — do not inject in the same spot repeatedly", "Do NOT skip meals after taking mealtime insulin", "Store insulin properly — refrigerate unopened, room temp once opened", "Inspect insulin before use — Regular should be clear, NPH should be uniformly cloudy", "Wear a medical alert bracelet"], herbalInteractions: [{ herb: "Chromium", interaction: "May enhance insulin sensitivity and cause hypoglycemia" }, { herb: "Bitter melon", interaction: "Has glucose-lowering properties — additive hypoglycemia risk" }, { herb: "Fenugreek", interaction: "May lower blood glucose — monitor closely" }], examTips: ["Know onset/peak/duration: Rapid (lispro/aspart): 15 min/1 hr/3-5 hr. Regular: 30 min/2-4 hr/6-8 hr. NPH: 1-2 hr/4-12 hr/18-24 hr. Glargine: 1-2 hr/NO peak/24 hr.", "Only REGULAR insulin can be given IV", "Clear before cloudy when mixing (Regular before NPH)", "Hypoglycemia risk is highest at PEAK time — know when to monitor", "Lantus (glargine) has NO peak — steady 24-hour coverage, less hypoglycemia risk"] },
      practiceQuestions: [{ question: "A nurse is preparing to mix NPH and Regular insulin in the same syringe. Which insulin should be drawn up FIRST?", options: ["NPH insulin", "Regular insulin", "Either can be drawn first", "These insulins cannot be mixed"], correct: 1, rationale: "When mixing insulins, always draw up Regular (clear) first, then NPH (cloudy) — 'clear before cloudy.' This prevents contamination of the Regular insulin vial with NPH, which would alter the onset of future Regular insulin doses." }, { question: "A patient received lispro (Humalog) insulin at 7:30 AM. When should the nurse monitor MOST closely for hypoglycemia?", options: ["8:00 AM", "8:30 AM (1 hour after)", "12:00 PM", "6:00 PM"], correct: 1, rationale: "Lispro is a rapid-acting insulin with peak action at approximately 1 hour after administration. This is when hypoglycemia risk is highest. The nurse should monitor blood glucose around 8:30 AM (1 hour post-dose)." }, { question: "Which insulin can be administered intravenously?", options: ["NPH", "Glargine (Lantus)", "Regular (Humulin R)", "Detemir (Levemir)"], correct: 2, rationale: "Only Regular insulin can be given IV. It is the insulin of choice for DKA, HHS, and hyperkalemia management via IV infusion. All other insulin types are administered subcutaneously only." }, { question: "A patient on insulin is unconscious with blood glucose of 38 mg/dL. What should the nurse administer?", options: ["Oral glucose tablets", "Orange juice", "Glucagon 1 mg IM", "Regular insulin IV"], correct: 2, rationale: "An unconscious patient cannot safely swallow oral glucose (aspiration risk). Glucagon 1 mg IM stimulates hepatic glycogenolysis, raising blood glucose within 10–15 minutes. IV dextrose (D50) can also be used if IV access is available." }, { question: "Which is the MOST important patient teaching point about insulin glargine (Lantus)?", options: ["Shake the vial before drawing up", "It should be mixed with Regular insulin for better coverage", "It provides basal coverage with no peak and should not be mixed", "Take it only when blood sugar is high"], correct: 2, rationale: "Glargine provides steady 24-hour basal coverage with NO peak, reducing hypoglycemia risk. It must NEVER be mixed with other insulins as this alters its pharmacokinetics. It is given at the same time daily regardless of blood glucose." }],
      references: [{ source: "American Diabetes Association", title: "Standards of Care in Diabetes — 2024", year: "2024" }, { source: "Diabetes Canada", title: "Clinical Practice Guidelines", year: "2024" }],
      relatedSlugs: ["diabetes-type-2", "metformin", "hba1c", "potassium", "dka-vs-hhs"],
      seoKeywords: ["insulin nursing", "insulin types onset peak duration", "insulin NCLEX", "insulin administration nursing", "mixing insulin nursing"]
    }
  ];
}

function getLabValueSeeds() {
  return [
    {
      pageType: "lab-value", slug: "potassium", title: "Potassium (K+)", metaTitle: "Potassium Lab Value: Normal Ranges, Interpretation & Nursing Guide | NurseNest", metaDescription: "Complete potassium lab value guide — normal ranges (CA & US), hyperkalemia vs hypokalemia, ECG changes, nursing interventions, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/labs/potassium", bodySystem: "Renal", category: "Electrolytes", summary: "Potassium is the major intracellular cation essential for cardiac conduction, muscle contraction, and nerve impulse transmission. Even small deviations from normal can cause life-threatening cardiac dysrhythmias.",
      data: { labName: "Potassium (K+)", normalRangeCA: "3.5–5.0 mmol/L", normalRangeUS: "3.5–5.0 mEq/L", criticalLow: "< 3.0 mEq/L", criticalHigh: "> 6.0 mEq/L", specimen: "Serum (red or green top tube)", interpretation: { elevated: { causes: ["Renal failure (most common)", "Potassium-sparing diuretics (spironolactone)", "ACE inhibitors / ARBs", "Tissue destruction (burns, crush injury, rhabdomyolysis)", "Metabolic acidosis (H+/K+ exchange)", "Hemolyzed specimen (false elevation)"], ecgChanges: ["Peaked T waves (earliest sign)", "Widened QRS complex", "Flattened P waves", "Sine wave pattern (pre-arrest)"], nursingActions: ["Continuous cardiac monitoring", "Administer IV calcium gluconate (cardiac stabilization)", "Administer regular insulin + dextrose (shifts K+ into cells)", "Administer sodium polystyrene sulfonate (Kayexalate) — excretion", "Restrict dietary potassium", "Prepare for emergent dialysis if refractory"] }, decreased: { causes: ["Loop diuretics (furosemide) — most common medication cause", "Vomiting/NG suction", "Diarrhea", "Metabolic alkalosis", "Insulin administration", "Inadequate dietary intake"], ecgChanges: ["Flattened T waves", "Prominent U waves", "ST depression", "Prolonged QT interval"], nursingActions: ["Oral KCl supplementation (20–40 mEq)", "IV KCl infusion (never push IV — max 10 mEq/hr peripherally, 20 mEq/hr centrally)", "Increase dietary potassium (bananas, oranges, potatoes)", "Monitor digoxin levels if applicable (hypokalemia ↑ digoxin toxicity)", "Continuous cardiac monitoring for dysrhythmias"] } }, clinicalSignificance: "Potassium is critical for maintaining the resting membrane potential of cardiac and skeletal muscle cells. Hypokalemia increases automaticity and can cause lethal dysrhythmias. Hyperkalemia decreases cardiac conduction and can progress to asystole.", relatedConditions: ["Heart failure", "Chronic kidney disease", "Diabetic ketoacidosis", "Addison's disease", "Cushing's syndrome", "Metabolic acidosis/alkalosis"] },
      practiceQuestions: [{ question: "A patient's potassium level is 6.5 mEq/L. Which ECG change should the nurse expect?", options: ["Prolonged QT interval", "ST elevation", "Peaked T waves", "Absent P waves with normal QRS"], correct: 2, rationale: "Peaked (tall, narrow, tent-shaped) T waves are the earliest ECG sign of hyperkalemia. As potassium rises further, the PR interval lengthens, P waves flatten, QRS widens, and eventually a sine wave pattern develops before cardiac arrest." }, { question: "Which medication should the nurse administer FIRST for a patient with potassium of 7.0 mEq/L and ECG changes?", options: ["Kayexalate orally", "Regular insulin IV", "IV calcium gluconate", "Oral potassium supplement"], correct: 2, rationale: "IV calcium gluconate is administered FIRST because it stabilizes the cardiac membrane within minutes, protecting against lethal dysrhythmias. It does NOT lower potassium — it buys time while other interventions (insulin/glucose, kayexalate, dialysis) take effect." }, { question: "IV potassium chloride must NEVER be administered by which route?", options: ["Peripheral IV infusion", "Central line infusion", "IV push (bolus)", "Diluted in 100 mL NS"], correct: 2, rationale: "IV potassium must NEVER be given by IV push — it can cause immediate cardiac arrest. It must always be diluted and infused at a controlled rate (max 10 mEq/hr peripherally, 20 mEq/hr centrally with cardiac monitoring)." }, { question: "A patient on furosemide has muscle cramps and fatigue. Which lab should the nurse check?", options: ["Sodium", "Calcium", "Potassium", "Magnesium"], correct: 2, rationale: "Furosemide (loop diuretic) causes significant potassium loss. Hypokalemia symptoms include muscle cramps, weakness, fatigue, and cardiac dysrhythmias. The nurse should check potassium and supplement as needed." }, { question: "Why does hypokalemia increase the risk of digoxin toxicity?", options: ["Low potassium makes digoxin less effective", "Low potassium increases digoxin absorption", "Potassium and digoxin compete for the same receptor — low K+ allows more digoxin binding", "Low potassium causes digoxin to be excreted faster"], correct: 2, rationale: "Digoxin and potassium compete for binding sites on the Na+/K+ ATPase pump. When potassium is low, more digoxin binds to the pump, increasing its effect and toxicity risk. Always maintain K+ > 3.5 mEq/L in patients on digoxin." }],
      references: [{ source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }, { source: "National Kidney Foundation", title: "Potassium and Your CKD Diet", year: "2023" }],
      relatedSlugs: ["heart-failure", "chronic-kidney-disease", "furosemide", "sodium", "dka-vs-hhs"],
      seoKeywords: ["potassium lab value nursing", "hyperkalemia nursing", "hypokalemia nursing", "potassium ECG changes", "potassium NCLEX"]
    },
    {
      pageType: "lab-value", slug: "sodium", title: "Sodium (Na+)", metaTitle: "Sodium Lab Value: Normal Ranges, Hypo/Hypernatremia & Nursing Guide | NurseNest", metaDescription: "Complete sodium lab value guide — normal ranges (CA & US), hyponatremia vs hypernatremia, clinical significance, nursing interventions, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/labs/sodium", bodySystem: "Renal", category: "Electrolytes", summary: "Sodium is the major extracellular cation and the primary determinant of serum osmolality and fluid balance. Sodium imbalances are the most common electrolyte disorders in hospitalized patients.",
      data: { labName: "Sodium (Na+)", normalRangeCA: "135–145 mmol/L", normalRangeUS: "135–145 mEq/L", criticalLow: "< 120 mEq/L", criticalHigh: "> 160 mEq/L", specimen: "Serum (red or green top tube)", interpretation: { elevated: { causes: ["Dehydration (most common)", "Diabetes insipidus", "Excessive sodium intake", "Cushing's syndrome", "Hyperaldosteronism", "Hypertonic IV solutions"], ecgChanges: [], nursingActions: ["Assess neurological status (confusion, lethargy, seizures)", "Calculate free water deficit", "Administer hypotonic fluids (0.45% NS or D5W) slowly", "Correct no faster than 10–12 mEq/L per 24 hours to prevent cerebral edema", "Monitor I&O and daily weights", "Seizure precautions"] }, decreased: { causes: ["Heart failure (dilutional)", "SIADH", "Excessive water intake", "Diuretic therapy", "Adrenal insufficiency (Addison's)", "Renal failure", "Burns (sodium loss through skin)"], ecgChanges: [], nursingActions: ["Assess neurological status — hyponatremia is the most common cause of hospital-acquired seizures", "Fluid restriction (often 1–1.5 L/day for dilutional hyponatremia)", "Hypertonic saline (3% NaCl) for severe symptomatic hyponatremia (Na+ < 120) — via central line", "Correct no faster than 8–10 mEq/L per 24 hours to prevent osmotic demyelination syndrome (ODS)", "Monitor Na+ every 2–4 hours during correction", "Seizure precautions"] } }, clinicalSignificance: "Sodium determines fluid distribution between intracellular and extracellular compartments through osmosis. Hyponatremia causes cellular swelling (most dangerous in brain — cerebral edema). Hypernatremia causes cellular shrinkage. Rapid correction of either is dangerous.", relatedConditions: ["Heart failure", "SIADH", "Diabetes insipidus", "Adrenal insufficiency", "Cirrhosis", "Burns"] },
      practiceQuestions: [{ question: "A patient with SIADH has a sodium level of 118 mEq/L. What is the PRIORITY nursing intervention?", options: ["Administer normal saline IV rapidly", "Implement seizure precautions and fluid restriction", "Encourage oral fluid intake", "Administer 3% hypertonic saline as a rapid bolus"], correct: 1, rationale: "Severe hyponatremia (< 120 mEq/L) puts the patient at high risk for seizures from cerebral edema. Seizure precautions and fluid restriction are the immediate priorities. Hypertonic saline may be ordered, but must be administered slowly via central line — never as a rapid bolus (risk of osmotic demyelination syndrome)." }, { question: "Why is rapid correction of hyponatremia dangerous?", options: ["It causes hyperkalemia", "It can cause osmotic demyelination syndrome (central pontine myelinolysis)", "It leads to renal failure", "It causes pulmonary edema"], correct: 1, rationale: "Rapid correction of hyponatremia causes osmotic demyelination syndrome (ODS), previously known as central pontine myelinolysis. This devastating neurological condition results from rapid water movement out of brain cells during correction. Maximum safe correction: 8–10 mEq/L per 24 hours." }, { question: "Which condition causes hypernatremia through excessive free water loss?", options: ["SIADH", "Heart failure", "Diabetes insipidus", "Cirrhosis"], correct: 2, rationale: "Diabetes insipidus involves a deficiency of ADH (central DI) or kidney resistance to ADH (nephrogenic DI), causing massive free water loss through dilute urine. This concentrates sodium in the blood, causing hypernatremia." }, { question: "A patient's sodium is 128 mEq/L. Which symptom should the nurse MOST expect?", options: ["Excessive thirst", "Confusion and lethargy", "Polyuria", "Hypertension"], correct: 1, rationale: "Hyponatremia causes neurological symptoms due to cerebral edema (water moves into brain cells via osmosis). Mild: nausea, headache. Moderate: confusion, lethargy. Severe (< 120): seizures, coma." }, { question: "What IV fluid is used to treat hyponatremia caused by dehydration?", options: ["D5W (hypotonic)", "0.9% Normal Saline (isotonic)", "3% Hypertonic Saline", "D5 0.45% NS"], correct: 1, rationale: "Hyponatremia from dehydration (hypovolemic hyponatremia) is treated with 0.9% Normal Saline — this replaces both sodium and volume. D5W would worsen hyponatremia. Hypertonic saline is reserved for severe symptomatic hyponatremia (seizures, Na+ < 120)." }],
      references: [{ source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }, { source: "Sterns RH", title: "Treatment of Hyponatremia: UpToDate", year: "2024" }],
      relatedSlugs: ["potassium", "heart-failure", "chronic-kidney-disease", "diabetes-insipidus", "siadh-nursing"],
      seoKeywords: ["sodium lab value nursing", "hyponatremia nursing", "hypernatremia nursing", "sodium NCLEX", "SIADH sodium"]
    },
    {
      pageType: "lab-value", slug: "troponin", title: "Troponin (I and T)", metaTitle: "Troponin Lab Value: Normal Ranges, MI Diagnosis & Nursing Guide | NurseNest", metaDescription: "Complete troponin lab value guide — normal ranges, serial testing protocol, sensitivity for MI diagnosis, nursing considerations, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/labs/troponin", bodySystem: "Cardiac", category: "Cardiac Biomarkers", summary: "Troponin is a protein released from damaged cardiac muscle cells and is the most specific and sensitive biomarker for myocardial injury. It is the gold standard for diagnosing myocardial infarction.",
      data: { labName: "Troponin I/T", normalRangeCA: "< 0.04 ng/mL (conventional); < 14 ng/L (high-sensitivity)", normalRangeUS: "< 0.04 ng/mL (conventional); < 14 ng/L (high-sensitivity)", criticalLow: "N/A", criticalHigh: "> 0.4 ng/mL strongly suggests MI", specimen: "Serum (red or green top tube)", interpretation: { elevated: { causes: ["Myocardial infarction (STEMI/NSTEMI)", "Myocarditis", "Heart failure", "Pulmonary embolism", "Cardiac surgery", "Renal failure (reduced clearance)", "Sepsis/critical illness", "Takotsubo cardiomyopathy"], ecgChanges: ["ST elevation (STEMI)", "ST depression (NSTEMI)", "T-wave inversions", "New left bundle branch block"], nursingActions: ["Serial troponin levels at 0, 3, and 6 hours (detect rising trend)", "Continuous cardiac monitoring", "12-lead ECG comparison with baseline", "Report positive troponin to provider immediately", "Implement ACS protocol if clinical suspicion (aspirin, heparin, nitroglycerin)", "Prepare for cardiac catheterization if STEMI"] }, decreased: { causes: ["Normal finding — troponin should be undetectable in healthy individuals"], ecgChanges: [], nursingActions: ["Document as within normal limits", "Continue clinical assessment — a single negative troponin does not rule out MI"] } }, clinicalSignificance: "Troponin rises 3–6 hours after myocardial injury, peaks at 12–24 hours, and remains elevated for 7–14 days. A rising and/or falling pattern on serial testing confirms acute myocardial injury. High-sensitivity troponin assays can detect smaller amounts of myocardial damage and enable faster rule-out protocols.", relatedConditions: ["Myocardial infarction", "Heart failure", "Myocarditis", "Pulmonary embolism", "Renal failure", "Cardiac contusion"] },
      practiceQuestions: [{ question: "A patient with chest pain has a troponin I of 0.02 ng/mL in the ED. What is the appropriate next step?", options: ["Discharge the patient — troponin is normal", "Repeat troponin in 3–6 hours", "Prepare for immediate cardiac catheterization", "Administer thrombolytic therapy"], correct: 1, rationale: "A single negative troponin does NOT rule out MI. Troponin may not rise for 3–6 hours after symptom onset. Serial testing at 3 and 6 hours is essential to detect a rising trend that would confirm acute myocardial injury." }, { question: "Which statement about high-sensitivity troponin is correct?", options: ["It has lower specificity than conventional troponin", "It can detect smaller amounts of myocardial damage, enabling faster diagnosis", "It is only elevated in STEMI, not NSTEMI", "It replaces the need for ECG monitoring"], correct: 1, rationale: "High-sensitivity troponin (hs-cTn) can detect much smaller amounts of cardiac injury, allowing for faster rule-in and rule-out protocols (0/1-hour or 0/2-hour algorithms). It has comparable specificity when clinical context is applied." }, { question: "A patient with chronic kidney disease has a persistently elevated troponin. How should this be interpreted?", options: ["It always indicates MI", "Chronic mild elevation is common in CKD — look for a RISING pattern to diagnose acute MI", "It should be ignored", "It indicates the patient needs immediate dialysis"], correct: 1, rationale: "Patients with CKD may have chronically elevated troponin due to reduced clearance and chronic myocardial stress. In these patients, a RISING and FALLING pattern (delta change) on serial testing is needed to diagnose acute MI, not a single elevated value." }, { question: "How long does troponin remain elevated after a myocardial infarction?", options: ["6–12 hours", "24–48 hours", "3–5 days", "7–14 days"], correct: 3, rationale: "Troponin remains elevated for 7–14 days after MI. This prolonged elevation makes it useful for diagnosing MI even if the patient presents late, but it also means it cannot detect reinfarction in this window (CK-MB is used for reinfarction)." }, { question: "A troponin result is reported as elevated. Which additional finding confirms a STEMI?", options: ["Elevated BNP", "ST elevation on 12-lead ECG", "Positive D-dimer", "Elevated CRP"], correct: 1, rationale: "STEMI is defined by ST elevation on ECG with positive troponin. This combination confirms transmural myocardial injury and indicates need for emergent reperfusion therapy (PCI or thrombolytics). Elevated BNP suggests heart failure, not necessarily STEMI." }],
      references: [{ source: "ESC", title: "Fourth Universal Definition of Myocardial Infarction", year: "2018" }, { source: "ACC/AHA", title: "Guidelines for the Evaluation and Diagnosis of Chest Pain", year: "2021" }],
      relatedSlugs: ["myocardial-infarction", "chest-pain-nursing-assessment", "heart-failure", "potassium", "ck-mb"],
      seoKeywords: ["troponin lab value", "troponin normal range", "troponin MI diagnosis", "serial troponin nursing", "troponin NCLEX"]
    },
    {
      pageType: "lab-value", slug: "hba1c", title: "HbA1c (Glycated Hemoglobin)", metaTitle: "HbA1c Lab Value: Normal Ranges, Diabetes Diagnosis & Nursing Guide | NurseNest", metaDescription: "Complete HbA1c guide — normal ranges (CA & US), diabetes diagnosis criteria, interpretation, target goals, and NCLEX practice questions for nursing students.", canonicalUrl: "https://www.nursenest.ca/labs/hba1c", bodySystem: "Endocrine", category: "Endocrine/Metabolic", summary: "HbA1c measures the percentage of hemoglobin that has glucose attached, reflecting average blood glucose control over the preceding 2–3 months. It is used for both diagnosis and monitoring of diabetes.",
      data: { labName: "HbA1c (Glycated Hemoglobin / A1C)", normalRangeCA: "< 6.0% (non-diabetic); < 7.0% (diabetic target)", normalRangeUS: "< 5.7% (normal); 5.7–6.4% (prediabetes); ≥ 6.5% (diabetes diagnosis)", criticalLow: "N/A (low HbA1c may indicate frequent hypoglycemia)", criticalHigh: "> 10% (very poor control, high complication risk)", specimen: "Whole blood (EDTA/lavender top tube)", interpretation: { elevated: { causes: ["Uncontrolled or poorly controlled diabetes", "New-onset diabetes", "Medication non-compliance", "Inadequate diet management", "Illness or physiologic stress (cortisol elevates glucose)"], ecgChanges: [], nursingActions: ["Review medication adherence with patient", "Assess for barriers to diabetes management (health literacy, financial, access)", "Reinforce dietary education (carbohydrate counting, portion control)", "Review blood glucose monitoring logs", "Notify provider for medication adjustment (intensification of therapy)", "Screen for diabetic complications (retinopathy, nephropathy, neuropathy)"] }, decreased: { causes: ["Excellent glucose control", "Frequent hypoglycemic episodes (over-treatment)", "Hemolytic anemia (shortened RBC lifespan gives falsely low HbA1c)", "Recent blood transfusion", "Pregnancy (hemodilution)"], ecgChanges: [], nursingActions: ["Assess for hypoglycemia episodes and patterns", "Review insulin/medication doses for potential over-treatment", "Consider conditions causing falsely low HbA1c"] } }, clinicalSignificance: "HbA1c reflects the non-enzymatic glycation of hemoglobin over the 120-day lifespan of red blood cells. The past 30 days contribute approximately 50% of the value, making recent glucose control more influential than earlier control. Each 1% decrease in HbA1c reduces microvascular complications by approximately 25%.", relatedConditions: ["Type 1 Diabetes", "Type 2 Diabetes", "Gestational diabetes", "Prediabetes", "Metabolic syndrome"] },
      practiceQuestions: [{ question: "A patient's HbA1c result is 8.2%. What does this indicate?", options: ["Normal glucose control", "Prediabetes", "Inadequate diabetes management over the past 2–3 months", "Acute hyperglycemia in the past 24 hours"], correct: 2, rationale: "An HbA1c of 8.2% is above the target of < 7.0% for most adults with diabetes, indicating inadequate glucose control over the past 2–3 months. This corresponds to an estimated average glucose of approximately 189 mg/dL. Medication and lifestyle adjustments are needed." }, { question: "At what HbA1c level is diabetes diagnosed?", options: ["≥ 5.7%", "≥ 6.0%", "≥ 6.5%", "≥ 7.0%"], correct: 2, rationale: "Diabetes is diagnosed when HbA1c ≥ 6.5% (confirmed on two separate occasions or with another diagnostic test). 5.7–6.4% indicates prediabetes. < 5.7% is normal." }, { question: "Why might HbA1c be falsely low in a patient with hemolytic anemia?", options: ["Hemolyzed RBCs don't carry hemoglobin", "Shortened RBC lifespan means less time for glucose to attach to hemoglobin", "Hemolysis destroys the glucose molecules", "Anemia increases insulin production"], correct: 1, rationale: "HbA1c reflects glucose exposure over the RBC lifespan (120 days). In hemolytic anemia, RBCs are destroyed prematurely (shorter lifespan), giving them less time to accumulate glycated hemoglobin. This produces a falsely low HbA1c that does not reflect true glucose control." }, { question: "How often should HbA1c be monitored in a patient with stable diabetes?", options: ["Monthly", "Every 3 months", "Every 6 months", "Annually"], correct: 1, rationale: "HbA1c should be checked every 3 months (quarterly) for patients not meeting goals or with recent therapy changes. For patients with stable, well-controlled diabetes, testing every 6 months may be acceptable. However, every 3 months is the standard monitoring interval." }, { question: "Each 1% decrease in HbA1c reduces microvascular complications by approximately:", options: ["10%", "15%", "25%", "50%"], correct: 2, rationale: "Landmark studies (DCCT, UKPDS) demonstrated that each 1% reduction in HbA1c reduces the risk of microvascular complications (retinopathy, nephropathy, neuropathy) by approximately 25%. This emphasizes the clinical significance of even modest improvements in glucose control." }],
      references: [{ source: "American Diabetes Association", title: "Standards of Care in Diabetes — 2024", year: "2024" }, { source: "Diabetes Canada", title: "Clinical Practice Guidelines", year: "2024" }],
      relatedSlugs: ["diabetes-type-2", "metformin", "insulin-nursing-guide", "potassium", "creatinine"],
      seoKeywords: ["HbA1c lab value", "HbA1c normal range", "glycated hemoglobin nursing", "HbA1c diabetes diagnosis", "HbA1c NCLEX"]
    },
    {
      pageType: "lab-value", slug: "creatinine", title: "Creatinine & GFR", metaTitle: "Creatinine & GFR Lab Values: Normal Ranges & Kidney Function Guide | NurseNest", metaDescription: "Complete creatinine and GFR guide — normal ranges (CA & US), CKD staging, interpretation, medication adjustments, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/labs/creatinine", bodySystem: "Renal", category: "Renal Function", summary: "Creatinine is a waste product of muscle metabolism filtered by the kidneys. Serum creatinine and estimated GFR (eGFR) are the primary laboratory markers used to assess kidney function and stage chronic kidney disease.",
      data: { labName: "Serum Creatinine / eGFR", normalRangeCA: "Creatinine: 60–110 µmol/L (male), 45–90 µmol/L (female). eGFR: > 90 mL/min/1.73m²", normalRangeUS: "Creatinine: 0.7–1.3 mg/dL (male), 0.6–1.1 mg/dL (female). eGFR: > 90 mL/min/1.73m²", criticalLow: "N/A", criticalHigh: "Creatinine > 4.0 mg/dL or eGFR < 15 mL/min (ESRD)", specimen: "Serum (red or green top tube)", interpretation: { elevated: { causes: ["Acute kidney injury (AKI)", "Chronic kidney disease", "Dehydration (prerenal azotemia)", "Nephrotoxic medications (NSAIDs, aminoglycosides, contrast dye)", "Rhabdomyolysis", "High muscle mass (physiologic)", "Post-renal obstruction"], ecgChanges: [], nursingActions: ["Assess for signs of renal failure (oliguria, edema, electrolyte imbalances)", "Review medications for nephrotoxic agents — notify provider", "Monitor I&O and daily weights", "Ensure adequate hydration (unless fluid-restricted)", "Monitor electrolytes (especially potassium)", "Assess for uremic symptoms (nausea, pruritus, confusion)", "Prepare for potential dialysis if ESRD"] }, decreased: { causes: ["Low muscle mass (elderly, malnourished)", "Pregnancy (increased GFR)", "Not clinically significant in most cases"], ecgChanges: [], nursingActions: ["Document as WNL or expected for patient population"] } }, clinicalSignificance: "Creatinine is inversely related to GFR — as GFR declines, creatinine rises. Importantly, a doubling of creatinine represents approximately 50% loss of kidney function. eGFR is calculated from creatinine using CKD-EPI equation and is used to stage CKD: Stage 1 (≥90), Stage 2 (60–89), Stage 3a (45–59), Stage 3b (30–44), Stage 4 (15–29), Stage 5 (<15, ESRD).", relatedConditions: ["Chronic kidney disease", "Acute kidney injury", "Diabetic nephropathy", "Heart failure (cardiorenal syndrome)", "Rhabdomyolysis"] },
      practiceQuestions: [{ question: "A patient's creatinine doubles from 1.0 to 2.0 mg/dL over 48 hours. What does this indicate?", options: ["Normal variation", "Approximately 50% decline in kidney function", "The patient is dehydrated", "The lab specimen was hemolyzed"], correct: 1, rationale: "A doubling of serum creatinine represents approximately 50% loss of GFR (kidney function). This acute rise over 48 hours suggests acute kidney injury (AKI) and requires immediate evaluation for the cause (prerenal, intrinsic, or post-renal)." }, { question: "Which medication should the nurse question in a patient with eGFR of 25 mL/min?", options: ["Acetaminophen", "Metformin", "Lisinopril", "Furosemide"], correct: 1, rationale: "Metformin is contraindicated when eGFR < 30 mL/min due to the risk of lactic acidosis from impaired renal clearance. The nurse should hold the medication and notify the provider for an alternative diabetes treatment." }, { question: "What is the eGFR threshold for Stage 5 CKD (ESRD)?", options: ["< 60 mL/min", "< 30 mL/min", "< 15 mL/min", "< 90 mL/min"], correct: 2, rationale: "Stage 5 CKD (End-Stage Renal Disease) is defined as eGFR < 15 mL/min/1.73m². At this stage, the kidneys can no longer maintain fluid, electrolyte, or waste balance, and renal replacement therapy (dialysis or transplant) is typically required." }, { question: "A patient is scheduled for a CT scan with IV contrast. Their creatinine is 2.5 mg/dL. What should the nurse do?", options: ["Proceed with the scan as ordered", "Notify the provider — contrast may worsen kidney function", "Give extra oral fluids before the scan", "Check a BUN level"], correct: 1, rationale: "IV contrast is nephrotoxic, and an elevated creatinine indicates already compromised kidney function. The nurse should notify the provider before the scan — contrast-induced nephropathy risk assessment is needed, and IV hydration with NS may be ordered before and after the procedure." }, { question: "Why is creatinine a better indicator of kidney function than BUN?", options: ["Creatinine is only produced by the kidneys", "Creatinine is not affected by diet, hydration, or protein intake like BUN is", "Creatinine is easier to measure", "Creatinine is always higher than BUN"], correct: 1, rationale: "Creatinine is produced at a relatively constant rate from muscle metabolism and is freely filtered by the kidneys without significant reabsorption. Unlike BUN, creatinine is NOT significantly affected by dietary protein intake, hydration status, or GI bleeding, making it a more reliable indicator of GFR." }],
      references: [{ source: "KDIGO", title: "Clinical Practice Guideline for the Evaluation and Management of CKD", year: "2024" }, { source: "National Kidney Foundation", title: "GFR Calculator and CKD Staging", year: "2023" }],
      relatedSlugs: ["chronic-kidney-disease", "potassium", "metformin", "diabetes-type-2", "heart-failure"],
      seoKeywords: ["creatinine lab value", "GFR interpretation nursing", "creatinine normal range", "CKD staging GFR", "creatinine NCLEX"]
    }
  ];
}

function getComparisonSeeds() {
  return [
    {
      pageType: "comparison", slug: "dka-vs-hhs", title: "DKA vs HHS", metaTitle: "DKA vs HHS: Side-by-Side Comparison for Nursing Exams | NurseNest", metaDescription: "Compare diabetic ketoacidosis (DKA) and hyperosmolar hyperglycemic state (HHS) — pathophysiology, lab values, clinical features, nursing interventions, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/clinical-compare/dka-vs-hhs", bodySystem: "Endocrine", category: "Endocrine", summary: "DKA and HHS are both serious hyperglycemic emergencies in diabetes. Understanding their key differences is critical for NCLEX success and safe clinical practice.",
      data: {
        entityA: { name: "Diabetic Ketoacidosis (DKA)", description: "A metabolic emergency characterized by hyperglycemia, metabolic acidosis, and ketosis. Most common in Type 1 DM but can occur in Type 2 DM during physiologic stress." },
        entityB: { name: "Hyperosmolar Hyperglycemic State (HHS)", description: "A metabolic emergency characterized by extreme hyperglycemia, severe dehydration, and hyperosmolarity WITHOUT significant ketosis. Most common in Type 2 DM, especially elderly patients." },
        comparisonTable: [
          { feature: "Typical Diabetes Type", entityA: "Type 1 DM (primarily)", entityB: "Type 2 DM (primarily)" },
          { feature: "Blood Glucose", entityA: "> 250 mg/dL (14 mmol/L)", entityB: "> 600 mg/dL (33 mmol/L)" },
          { feature: "Serum pH", entityA: "< 7.30 (acidotic)", entityB: "> 7.30 (normal or mildly acidotic)" },
          { feature: "Bicarbonate (HCO3)", entityA: "< 18 mEq/L", entityB: "> 18 mEq/L" },
          { feature: "Ketones", entityA: "Strongly positive (blood and urine)", entityB: "Absent or mildly positive" },
          { feature: "Serum Osmolality", entityA: "Variable (usually < 320 mOsm/kg)", entityB: "> 320 mOsm/kg (often > 350)" },
          { feature: "Dehydration", entityA: "Moderate (3–5 L deficit)", entityB: "Severe (8–12 L deficit)" },
          { feature: "Onset", entityA: "Rapid (hours to 1–2 days)", entityB: "Gradual (days to weeks)" },
          { feature: "Kussmaul Respirations", entityA: "Present (deep rapid breathing to compensate for acidosis)", entityB: "Absent" },
          { feature: "Fruity Breath", entityA: "Present (acetone from ketone metabolism)", entityB: "Absent" },
          { feature: "Neurological Status", entityA: "Alert to mildly confused", entityB: "Significantly altered — stupor to coma" },
          { feature: "Mortality Rate", entityA: "~1–5%", entityB: "~10–20% (higher mortality)" }
        ],
        keyDifferentiators: [
          "DKA has ketones and acidosis; HHS does NOT have significant ketosis",
          "HHS has MUCH higher blood glucose (> 600) and severe dehydration",
          "HHS has higher mortality rate despite appearing 'less acute'",
          "Kussmaul breathing and fruity breath odor are specific to DKA (compensating for metabolic acidosis)",
          "Neurological changes are MORE severe in HHS (due to hyperosmolarity and dehydration)",
          "HHS develops gradually over days/weeks; DKA develops rapidly over hours"
        ],
        nursingInterventionsA: [
          "IV fluid resuscitation: 0.9% NS initially (1–1.5 L in first hour), then 0.45% NS",
          "IV regular insulin drip (0.1 units/kg/hr) — do NOT bolus until potassium is > 3.5",
          "Potassium replacement — insulin shifts K+ intracellularly, monitor q1–2hr",
          "Switch to D5 0.45% NS when glucose reaches 200–250 mg/dL (prevent hypoglycemia)",
          "Bicarbonate replacement ONLY if pH < 6.9",
          "Monitor ABG, electrolytes, glucose hourly",
          "Identify and treat precipitating cause (infection, missed insulin, new-onset T1DM)"
        ],
        nursingInterventionsB: [
          "Aggressive IV fluid resuscitation: 0.9% NS (often 1–2 L in first hour, then 250–500 mL/hr)",
          "IV regular insulin drip (0.1 units/kg/hr) — fluid replacement is the PRIMARY treatment",
          "Potassium replacement as with DKA",
          "Monitor serum osmolality and neurological status closely",
          "Prevent rapid osmolality shifts (can cause cerebral edema)",
          "Thromboprophylaxis (high DVT/PE risk due to severe dehydration and hyperviscosity)",
          "Identify trigger (often infection in elderly, medication non-compliance, new diagnosis)"
        ],
        examTips: [
          "NCLEX tip: If the question mentions ketones and acidosis → DKA. If extreme hyperglycemia without ketones and altered LOC → HHS.",
          "Remember: HHS has the 3 H's — Higher glucose, Higher osmolality, Higher mortality",
          "In DKA, always check potassium BEFORE starting insulin — if K+ < 3.3 mEq/L, replace potassium first",
          "The primary treatment for HHS is FLUID replacement (not insulin) — these patients can lose 8–12 liters",
          "Both conditions require ICU monitoring, hourly glucose checks, and identification of the precipitating cause"
        ]
      },
      practiceQuestions: [{ question: "A patient presents with blood glucose 780 mg/dL, pH 7.38, negative ketones, and altered mental status. Which condition does this represent?", options: ["DKA", "HHS", "Hypoglycemia", "Metabolic alkalosis"], correct: 1, rationale: "Extreme hyperglycemia (> 600), normal pH (no acidosis), absent ketones, and altered mental status are classic for HHS. DKA would show acidosis (pH < 7.30) and positive ketones." }, { question: "Why are Kussmaul respirations present in DKA but NOT in HHS?", options: ["DKA causes respiratory infection", "Kussmaul breathing compensates for the metabolic acidosis in DKA — HHS does not have significant acidosis", "HHS causes respiratory muscle weakness", "DKA causes bronchospasm"], correct: 1, rationale: "Kussmaul respirations (deep, rapid breathing) are the respiratory compensation for metabolic acidosis in DKA. The body blows off CO2 to raise the pH. Since HHS does not have significant metabolic acidosis, Kussmaul breathing does not occur." }, { question: "Before starting an insulin drip for a patient in DKA, which lab must be checked?", options: ["Troponin", "Sodium", "Potassium", "Calcium"], correct: 2, rationale: "Potassium must be checked before starting insulin because insulin shifts potassium from extracellular to intracellular space. If potassium is already low (< 3.3 mEq/L), starting insulin could cause fatal hypokalemia. Potassium must be replaced BEFORE insulin is initiated." }, { question: "Which statement correctly differentiates the mortality rates of DKA and HHS?", options: ["DKA has higher mortality than HHS", "HHS has higher mortality (10–20%) compared to DKA (1–5%)", "Both have the same mortality rate", "Neither condition is life-threatening with modern treatment"], correct: 1, rationale: "Despite appearing 'less acute' (no acidosis or ketones), HHS carries a significantly higher mortality rate (10–20%) compared to DKA (1–5%). This is largely due to the severe dehydration, the elderly patient population, and the altered mental status that delays diagnosis." }, { question: "What is the PRIMARY initial treatment priority for HHS?", options: ["IV insulin bolus", "IV bicarbonate", "Aggressive IV fluid replacement", "Oral glucose tablets"], correct: 2, rationale: "The primary treatment for HHS is aggressive IV fluid replacement. These patients can have 8–12 liter fluid deficits. Isotonic saline (0.9% NS) is given at 1–2 L/hour initially. Insulin is important but secondary to volume resuscitation — dehydration itself can lower glucose significantly." }],
      references: [{ source: "American Diabetes Association", title: "Hyperglycemic Crises in Diabetes: DKA and HHS", year: "2024" }, { source: "Diabetes Canada", title: "Clinical Practice Guidelines: Hyperglycemic Emergencies", year: "2024" }],
      relatedSlugs: ["diabetes-type-2", "insulin-nursing-guide", "potassium", "sodium", "hba1c"],
      seoKeywords: ["DKA vs HHS", "DKA vs HHS nursing", "DKA vs HHS NCLEX", "diabetic ketoacidosis comparison", "hyperosmolar hyperglycemic state"]
    },
    {
      pageType: "comparison", slug: "left-vs-right-heart-failure", title: "Left-Sided vs Right-Sided Heart Failure", metaTitle: "Left vs Right Heart Failure: Side-by-Side Comparison | NurseNest", metaDescription: "Compare left-sided and right-sided heart failure — pathophysiology, symptoms, assessment findings, treatment differences, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/clinical-compare/left-vs-right-heart-failure", bodySystem: "Cardiac", category: "Cardiovascular", summary: "Understanding the difference between left-sided and right-sided heart failure is fundamental for nursing assessment, intervention, and NCLEX exam success.",
      data: {
        entityA: { name: "Left-Sided Heart Failure", description: "The left ventricle fails to pump blood effectively to the systemic circulation, causing blood to back up into the pulmonary circulation." },
        entityB: { name: "Right-Sided Heart Failure", description: "The right ventricle fails to pump blood effectively to the pulmonary circulation, causing blood to back up into the systemic venous circulation." },
        comparisonTable: [
          { feature: "Primary Cause", entityA: "Hypertension, coronary artery disease, aortic valve disease", entityB: "Left-sided heart failure (most common cause), pulmonary hypertension, cor pulmonale" },
          { feature: "Where Blood Backs Up", entityA: "Pulmonary circulation (lungs)", entityB: "Systemic venous circulation (body)" },
          { feature: "Key Symptoms", entityA: "Dyspnea, orthopnea, PND, crackles, frothy sputum, fatigue", entityB: "Peripheral edema, JVD, hepatomegaly, ascites, weight gain" },
          { feature: "Lung Sounds", entityA: "Crackles/rales (pulmonary congestion)", entityB: "Usually clear (unless biventricular failure)" },
          { feature: "Heart Sound", entityA: "S3 gallop (ventricular gallop)", entityB: "S3 gallop may be present" },
          { feature: "Edema Location", entityA: "Pulmonary edema (lungs)", entityB: "Peripheral edema (ankles, legs, sacrum if bedridden)" },
          { feature: "JVD", entityA: "Usually absent (unless biventricular)", entityB: "Present — distended neck veins" },
          { feature: "Hepatomegaly", entityA: "Absent", entityB: "Present — liver congestion" },
          { feature: "Key Labs", entityA: "BNP elevated, CXR shows pulmonary congestion", entityB: "BNP elevated, liver enzymes may be elevated" },
          { feature: "Oxygen Needs", entityA: "Increased O2 demand (hypoxemia from pulmonary edema)", entityB: "Usually adequate oxygenation unless severe" }
        ],
        keyDifferentiators: [
          "Left-sided = pulmonary symptoms (lungs fill with fluid). Right-sided = systemic symptoms (body fills with fluid)",
          "Think 'L = Lungs' and 'R = Rest of the body'",
          "Most cases of right-sided HF are CAUSED by left-sided HF (the #1 cause)",
          "Biventricular failure has features of both — crackles AND peripheral edema",
          "JVD is the hallmark of right-sided HF; crackles are the hallmark of left-sided HF"
        ],
        nursingInterventionsA: ["Position in high Fowler's to reduce pulmonary congestion", "Administer supplemental oxygen to maintain SpO2 > 94%", "Administer diuretics (furosemide) to reduce fluid overload", "Monitor lung sounds every 4 hours", "Restrict fluids (1.5–2 L/day) and sodium (< 2g/day)", "Assess for signs of pulmonary edema (frothy pink sputum, severe dyspnea)"],
        nursingInterventionsB: ["Monitor daily weights and I&O", "Assess peripheral edema using pitting scale", "Elevate legs when sitting to promote venous return", "Apply compression stockings as ordered", "Restrict sodium and fluids as ordered", "Monitor liver function tests and abdominal girth (ascites)"],
        examTips: [
          "NCLEX favorite: 'Which finding is associated with LEFT-sided HF?' → Crackles, dyspnea, orthopnea",
          "NCLEX favorite: 'Which finding is associated with RIGHT-sided HF?' → JVD, peripheral edema, hepatomegaly",
          "Remember: L = Lungs, R = Rest of body",
          "The MOST common cause of right-sided HF is left-sided HF",
          "BNP is elevated in BOTH types of heart failure"
        ]
      },
      practiceQuestions: [{ question: "Which assessment finding is specific to LEFT-sided heart failure?", options: ["Jugular venous distension", "Hepatomegaly", "Crackles in lung bases", "Peripheral edema"], correct: 2, rationale: "Crackles in the lung bases result from fluid backing up into the pulmonary circulation due to left ventricular failure. JVD, hepatomegaly, and peripheral edema are signs of RIGHT-sided HF." }, { question: "What is the MOST common cause of right-sided heart failure?", options: ["Pulmonary embolism", "Left-sided heart failure", "COPD", "Mitral stenosis"], correct: 1, rationale: "Left-sided HF is the most common cause of right-sided HF. When the left ventricle fails, blood backs up into the pulmonary circulation, increasing pulmonary pressures. This increased afterload on the right ventricle eventually causes it to fail as well." }, { question: "A patient with HF has JVD, 3+ pitting edema in both legs, and clear lung sounds. Which type of HF does this suggest?", options: ["Left-sided systolic HF", "Left-sided diastolic HF", "Isolated right-sided HF", "Biventricular HF"], correct: 2, rationale: "JVD and peripheral edema are signs of right-sided HF. Clear lung sounds indicate the pulmonary circulation is NOT congested, which rules out significant left-sided HF. This presentation suggests isolated right-sided HF (possibly from pulmonary hypertension or cor pulmonale)." }, { question: "A patient with left-sided HF has increasing dyspnea and coughs up frothy pink sputum. What complication is occurring?", options: ["Pneumonia", "Pulmonary embolism", "Acute pulmonary edema", "Tension pneumothorax"], correct: 2, rationale: "Frothy pink-tinged sputum is the hallmark of acute pulmonary edema — a life-threatening complication of left-sided HF. Fluid floods the alveoli, mixing with air and blood to produce the characteristic frothy pink secretions." }, { question: "Which mnemonic helps differentiate left from right heart failure symptoms?", options: ["RICE", "L = Lungs, R = Rest of the body", "FAST", "ABCDE"], correct: 1, rationale: "L = Lungs (left-sided HF causes pulmonary symptoms) and R = Rest of the body (right-sided HF causes systemic venous congestion — edema, JVD, hepatomegaly). This simple mnemonic is an effective exam strategy." }],
      references: [{ source: "AHA/ACC/HFSA", title: "2022 Guideline for the Management of Heart Failure", year: "2022" }, { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }],
      relatedSlugs: ["heart-failure", "myocardial-infarction", "potassium", "furosemide", "chest-pain-nursing-assessment"],
      seoKeywords: ["left vs right heart failure", "left sided vs right sided HF nursing", "heart failure comparison NCLEX", "left right heart failure symptoms"]
    },
    {
      pageType: "comparison", slug: "type1-vs-type2-diabetes", title: "Type 1 vs Type 2 Diabetes", metaTitle: "Type 1 vs Type 2 Diabetes: Side-by-Side Nursing Comparison | NurseNest", metaDescription: "Compare Type 1 and Type 2 Diabetes — pathophysiology, onset, treatment approaches, key differences, nursing considerations, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/clinical-compare/type1-vs-type2-diabetes", bodySystem: "Endocrine", category: "Endocrine", summary: "Type 1 and Type 2 diabetes are both characterized by hyperglycemia but have fundamentally different pathophysiology and management approaches.",
      data: {
        entityA: { name: "Type 1 Diabetes Mellitus", description: "An autoimmune disease where the immune system destroys pancreatic beta cells, resulting in absolute insulin deficiency. Requires exogenous insulin for survival." },
        entityB: { name: "Type 2 Diabetes Mellitus", description: "A metabolic disorder characterized by insulin resistance and progressive beta-cell dysfunction. Managed with lifestyle modifications, oral medications, and eventually insulin." },
        comparisonTable: [
          { feature: "Pathophysiology", entityA: "Autoimmune destruction of beta cells → absolute insulin deficiency", entityB: "Insulin resistance + progressive beta-cell dysfunction → relative insulin deficiency" },
          { feature: "Typical Age of Onset", entityA: "Childhood/adolescence (can occur at any age)", entityB: "Adulthood > 40 years (increasingly in younger patients due to obesity)" },
          { feature: "Body Habitus", entityA: "Usually lean/normal weight", entityB: "Usually overweight/obese (85% of cases)" },
          { feature: "Onset", entityA: "Rapid (days to weeks)", entityB: "Gradual (months to years, often asymptomatic)" },
          { feature: "Insulin Production", entityA: "None (absolute deficiency)", entityB: "Present but insufficient or poorly utilized" },
          { feature: "Insulin Required", entityA: "ALWAYS (survival depends on it)", entityB: "Not initially — may need insulin as disease progresses" },
          { feature: "DKA Risk", entityA: "HIGH (primary hyperglycemic emergency)", entityB: "LOW (HHS is more common)" },
          { feature: "HHS Risk", entityA: "LOW", entityB: "HIGH (primary hyperglycemic emergency)" },
          { feature: "C-Peptide Level", entityA: "Low or absent (no insulin production)", entityB: "Normal or elevated (insulin is being produced but ineffective)" },
          { feature: "Autoantibodies", entityA: "Positive (GAD65, IA-2, ZnT8)", entityB: "Negative" },
          { feature: "First-Line Treatment", entityA: "Insulin (basal-bolus or pump)", entityB: "Metformin + lifestyle modifications" },
          { feature: "Genetic Component", entityA: "HLA-associated, less familial", entityB: "Strong genetic/familial component" }
        ],
        keyDifferentiators: [
          "Type 1 = NO insulin (autoimmune destruction). Type 2 = insulin resistance (body makes insulin but can't use it effectively).",
          "Type 1 ALWAYS requires insulin. Type 2 starts with oral medications.",
          "Type 1 is prone to DKA. Type 2 is prone to HHS.",
          "C-peptide levels differentiate: Low = Type 1, Normal/high = Type 2.",
          "Type 1 is typically lean. Type 2 is typically obese."
        ],
        nursingInterventionsA: ["Administer insulin as prescribed (basal-bolus regimen or insulin pump)", "Teach carbohydrate counting for accurate insulin dosing", "Monitor blood glucose at least 4 times daily (before meals and bedtime)", "Educate on DKA prevention and recognition", "Teach proper insulin injection technique and rotation", "Provide psychosocial support (chronic disease management in young patients)"],
        nursingInterventionsB: ["Educate on lifestyle modifications (weight loss, diet, exercise)", "Administer oral hypoglycemics as prescribed (metformin first-line)", "Teach blood glucose monitoring (frequency varies)", "Monitor HbA1c every 3 months", "Screen for diabetic complications annually (eye exam, foot exam, microalbumin)", "Educate on sick day management and HHS prevention"],
        examTips: [
          "Know that Type 1 always needs insulin, Type 2 starts with metformin",
          "DKA = Type 1 (primarily), HHS = Type 2 (primarily) — this distinction is heavily tested",
          "C-peptide differentiates: absent in Type 1, present in Type 2",
          "Type 2 has a STRONGER genetic component than Type 1",
          "Metformin is ONLY for Type 2 — it does NOT replace insulin in Type 1"
        ]
      },
      practiceQuestions: [{ question: "Which lab test differentiates Type 1 from Type 2 diabetes?", options: ["HbA1c", "Fasting glucose", "C-peptide level", "Triglycerides"], correct: 2, rationale: "C-peptide is produced when proinsulin is cleaved into insulin + C-peptide. In Type 1 DM, C-peptide is low or absent (no beta cells producing insulin). In Type 2 DM, C-peptide is normal or elevated (insulin is produced but not effective)." }, { question: "A newly diagnosed Type 2 diabetic patient asks about treatment. What should the nurse explain is the first-line approach?", options: ["Start insulin injections immediately", "Metformin combined with lifestyle modifications", "Restrict all carbohydrates completely", "Wait and monitor for 6 months"], correct: 1, rationale: "Metformin is the first-line pharmacological treatment for Type 2 DM, combined with lifestyle modifications (weight loss, exercise, dietary changes). Unlike Type 1, insulin is not required initially in most cases." }, { question: "Why is a Type 1 diabetic at higher risk for DKA than a Type 2 diabetic?", options: ["Type 1 patients eat more carbohydrates", "Type 1 patients have NO insulin — without insulin, the body breaks down fat for energy, producing ketones", "Type 1 patients are less compliant with medication", "DKA only occurs in Type 1 diabetes"], correct: 1, rationale: "In Type 1 DM, there is ABSOLUTE insulin deficiency. Without insulin, glucose cannot enter cells, so the body breaks down fat for energy. This produces ketone bodies, leading to ketoacidosis. Type 2 patients have SOME insulin, which usually prevents significant ketosis." }, { question: "Which statement about Type 2 diabetes is correct?", options: ["It is an autoimmune disease", "It can never require insulin therapy", "It has a stronger genetic component than Type 1", "It typically presents with DKA at diagnosis"], correct: 2, rationale: "Type 2 DM has a strong genetic and familial component — if one identical twin has T2DM, the other has a 60–90% chance of developing it. Type 1 has HLA associations but a lower concordance rate (~50%). T2DM is NOT autoimmune." }, { question: "A patient on metformin is having surgery tomorrow. What should the nurse anticipate?", options: ["Continue metformin as usual", "Hold metformin the day of surgery", "Switch to insulin permanently", "Double the metformin dose"], correct: 1, rationale: "Metformin is typically held before surgery (and for 48 hours after if IV contrast is used) due to the risk of lactic acidosis, especially if renal function is compromised during the perioperative period. Blood glucose is managed with sliding scale insulin during this time." }],
      references: [{ source: "ADA", title: "Standards of Care in Diabetes — 2024", year: "2024" }, { source: "Diabetes Canada", title: "Clinical Practice Guidelines", year: "2024" }],
      relatedSlugs: ["diabetes-type-2", "insulin-nursing-guide", "metformin", "hba1c", "dka-vs-hhs"],
      seoKeywords: ["type 1 vs type 2 diabetes", "DM comparison nursing", "type 1 type 2 diabetes NCLEX", "diabetes types comparison"]
    },
    {
      pageType: "comparison", slug: "crohns-vs-ulcerative-colitis", title: "Crohn's Disease vs Ulcerative Colitis", metaTitle: "Crohn's vs UC: Side-by-Side IBD Comparison for Nurses | NurseNest", metaDescription: "Compare Crohn's disease and ulcerative colitis — location, pathology, symptoms, complications, surgical options, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/clinical-compare/crohns-vs-ulcerative-colitis", bodySystem: "Gastrointestinal", category: "Gastrointestinal", summary: "Crohn's disease and ulcerative colitis are the two main types of inflammatory bowel disease (IBD). Distinguishing between them is essential for nursing care and heavily tested on nursing exams.",
      data: {
        entityA: { name: "Crohn's Disease", description: "A chronic inflammatory bowel disease that can affect ANY part of the GI tract (mouth to anus), with transmural (full-thickness) inflammation and skip lesions." },
        entityB: { name: "Ulcerative Colitis", description: "A chronic inflammatory bowel disease LIMITED to the colon and rectum, with inflammation confined to the mucosal and submucosal layers." },
        comparisonTable: [
          { feature: "Location", entityA: "Any part of GI tract (most common: terminal ileum)", entityB: "Colon and rectum only (starts at rectum, extends proximally)" },
          { feature: "Distribution", entityA: "Skip lesions (patchy, discontinuous)", entityB: "Continuous inflammation (no skip lesions)" },
          { feature: "Depth of Inflammation", entityA: "Transmural (full-thickness wall involvement)", entityB: "Mucosal and submucosal layers only" },
          { feature: "Stool Pattern", entityA: "Non-bloody diarrhea, steatorrhea (fat malabsorption)", entityB: "Bloody diarrhea with mucus (hallmark)" },
          { feature: "Abdominal Pain", entityA: "Right lower quadrant (terminal ileum), crampy", entityB: "Left lower quadrant, crampy, relieved by defecation" },
          { feature: "Fistulas", entityA: "COMMON (transmural inflammation creates tracts)", entityB: "RARE" },
          { feature: "Strictures", entityA: "COMMON (fibrosis from transmural inflammation)", entityB: "RARE" },
          { feature: "Colon Cancer Risk", entityA: "Slightly increased", entityB: "SIGNIFICANTLY increased (after 8–10 years)" },
          { feature: "Surgical Cure", entityA: "NO (recurrence after surgery is common)", entityB: "YES (total colectomy is curative)" },
          { feature: "Cobblestone Appearance", entityA: "Present (on colonoscopy)", entityB: "Absent — continuous, friable mucosa with pseudopolyps" },
          { feature: "Granulomas on Biopsy", entityA: "Present (non-caseating granulomas)", entityB: "Absent" },
          { feature: "Smoking Effect", entityA: "WORSENS disease", entityB: "May have mild protective effect (paradoxically)" }
        ],
        keyDifferentiators: [
          "Crohn's can affect ANY part of the GI tract; UC is LIMITED to the colon",
          "Crohn's is transmural (full-thickness) → fistulas and strictures; UC is superficial (mucosal) → bloody diarrhea",
          "UC is CURABLE with surgery (colectomy); Crohn's is NOT curable",
          "Bloody diarrhea is the HALLMARK of UC; non-bloody diarrhea with malabsorption is more common in Crohn's",
          "Smoking WORSENS Crohn's but may paradoxically protect against UC"
        ],
        nursingInterventionsA: ["Monitor for fistula formation and abscess development", "Assess nutritional status — malabsorption is common (vitamin B12, fat-soluble vitamins)", "Administer immunomodulators and biologics as ordered", "Provide TPN if severe malnutrition or bowel rest needed", "Monitor for bowel obstruction (stricture-related)", "Assess perianal area for fistulas"],
        nursingInterventionsB: ["Monitor stool frequency, consistency, and blood content", "Administer 5-ASA agents (mesalamine) as first-line therapy", "Assess for toxic megacolon (fever, abdominal distension, absent bowel sounds — emergency)", "Prepare patient for possible colectomy with ileostomy", "Provide colonoscopy surveillance for colon cancer (begins 8–10 years after diagnosis)", "Monitor for dehydration from bloody diarrhea"],
        examTips: [
          "NCLEX tip: Bloody diarrhea = UC. Non-bloody diarrhea with skip lesions = Crohn's.",
          "Fistulas and strictures are CROHN'S complications (transmural inflammation)",
          "UC is curable with total colectomy — Crohn's is NOT curable",
          "Toxic megacolon is a life-threatening complication of UC — acute dilation of colon",
          "Colon cancer screening is especially important in UC (starts 8–10 years post-diagnosis)"
        ]
      },
      practiceQuestions: [{ question: "A patient with IBD has bloody diarrhea with mucus, limited to the colon. Which diagnosis is MOST likely?", options: ["Crohn's disease", "Ulcerative colitis", "Irritable bowel syndrome", "Celiac disease"], correct: 1, rationale: "Bloody diarrhea with mucus limited to the colon is the hallmark of ulcerative colitis. Crohn's typically presents with non-bloody diarrhea and can affect any part of the GI tract." }, { question: "Which complication is specific to Crohn's disease and NOT typical of UC?", options: ["Bloody diarrhea", "Fistula formation", "Toxic megacolon", "Colon cancer"], correct: 1, rationale: "Fistulas are specific to Crohn's disease because Crohn's causes transmural (full-thickness) inflammation, which can create abnormal tracts between the bowel and other organs or skin. UC only affects the mucosa and does not create fistulas." }, { question: "Which treatment option is CURATIVE for ulcerative colitis?", options: ["Methotrexate", "Infliximab (Remicade)", "Total colectomy", "Lifelong mesalamine"], correct: 2, rationale: "Total colectomy (removal of the entire colon) is curative for UC because the disease is limited to the colon. This option does not exist for Crohn's, which can affect any part of the GI tract and typically recurs after surgery." }, { question: "What effect does smoking have on Crohn's disease?", options: ["Smoking is protective", "Smoking worsens the disease and increases flares", "Smoking has no effect", "Smoking only affects UC"], correct: 1, rationale: "Smoking WORSENS Crohn's disease — it increases the risk of flares, need for surgery, and post-surgical recurrence. Paradoxically, smoking may have a mild protective effect against UC. Smoking cessation is strongly recommended for Crohn's patients." }, { question: "A patient with UC develops fever, abdominal distension, and absent bowel sounds. What complication should the nurse suspect?", options: ["Bowel obstruction", "Toxic megacolon", "Fistula formation", "Appendicitis"], correct: 1, rationale: "Toxic megacolon is a life-threatening complication of UC characterized by acute colonic dilation with fever, abdominal distension, absent bowel sounds, and risk of perforation. It requires emergent surgical consultation and possible colectomy." }],
      references: [{ source: "Crohn's and Colitis Foundation", title: "IBD Fact Book", year: "2023" }, { source: "Hinkle & Cheever", title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, 15th Edition", year: "2022" }],
      relatedSlugs: ["diabetes-type-2", "chest-pain-nursing-assessment", "potassium", "sodium", "edema-nursing-assessment"],
      seoKeywords: ["Crohn's vs UC", "Crohn's vs ulcerative colitis nursing", "IBD comparison NCLEX", "inflammatory bowel disease nursing"]
    },
    {
      pageType: "comparison", slug: "delirium-vs-dementia", title: "Delirium vs Dementia", metaTitle: "Delirium vs Dementia: Key Differences for Nursing Exams | NurseNest", metaDescription: "Compare delirium and dementia — onset, causes, reversibility, clinical features, nursing interventions, and NCLEX practice questions.", canonicalUrl: "https://www.nursenest.ca/clinical-compare/delirium-vs-dementia", bodySystem: "Neurological", category: "Neurological", summary: "Delirium and dementia both present with cognitive changes but have fundamentally different etiologies, onset patterns, and prognoses. Distinguishing between them is critical for appropriate nursing care.",
      data: {
        entityA: { name: "Delirium", description: "An ACUTE, fluctuating change in mental status with disturbed consciousness and impaired attention. It is a MEDICAL EMERGENCY that is usually REVERSIBLE when the underlying cause is treated." },
        entityB: { name: "Dementia", description: "A CHRONIC, progressive, irreversible decline in cognitive function affecting memory, thinking, behavior, and ability to perform daily activities. Alzheimer's disease is the most common type." },
        comparisonTable: [
          { feature: "Onset", entityA: "ACUTE (hours to days)", entityB: "GRADUAL (months to years)" },
          { feature: "Duration", entityA: "Days to weeks (resolves with treatment)", entityB: "PERMANENT and progressive" },
          { feature: "Reversibility", entityA: "REVERSIBLE (when cause is treated)", entityB: "IRREVERSIBLE" },
          { feature: "Level of Consciousness", entityA: "FLUCTUATES (waxing and waning)", entityB: "Alert until late stages" },
          { feature: "Attention", entityA: "IMPAIRED (cannot focus, easily distracted)", entityB: "Usually intact until late stages" },
          { feature: "Course", entityA: "Fluctuating (worse at night — 'sundowning')", entityB: "Stable throughout the day" },
          { feature: "Hallucinations", entityA: "Common (visual hallucinations typical)", entityB: "Less common (may occur in late stages or Lewy body)" },
          { feature: "Psychomotor Activity", entityA: "Hyper- or hypoactive", entityB: "Usually normal until late stages" },
          { feature: "Cause", entityA: "MEDICAL (infection, medications, metabolic, pain, surgery)", entityB: "Neurodegenerative (Alzheimer's, vascular, Lewy body)" },
          { feature: "Medical Emergency?", entityA: "YES — treat the underlying cause urgently", entityB: "No — chronic management" },
          { feature: "Memory", entityA: "Impaired (primarily registration and recall)", entityB: "Short-term memory impaired first, then long-term" }
        ],
        keyDifferentiators: [
          "Delirium is ACUTE and REVERSIBLE; dementia is CHRONIC and IRREVERSIBLE",
          "Delirium is a MEDICAL EMERGENCY — look for the underlying cause (UTI in elderly is #1)",
          "Fluctuating consciousness is the HALLMARK of delirium — dementia patients remain alert until late stages",
          "Visual hallucinations are more common in delirium than dementia",
          "Delirium can be SUPERIMPOSED on dementia — patients with dementia are at higher risk for delirium"
        ],
        nursingInterventionsA: ["Identify and treat the underlying cause (UTI, medication toxicity, pain, dehydration, constipation)", "Ensure patient safety — fall precautions, bed alarm, 1:1 sitter if needed", "Reorient frequently (time, place, person)", "Minimize environmental stimuli (quiet room, nightlight, consistent staff)", "Avoid physical restraints (worsen agitation)", "Review and minimize deliriogenic medications (anticholinergics, benzodiazepines, opioids)", "Maintain sleep-wake cycle (avoid daytime sleeping, provide nighttime darkness)", "Ensure sensory aids are available (glasses, hearing aids)"],
        nursingInterventionsB: ["Maintain consistent daily routines", "Provide a calm, structured environment", "Use simple, direct communication (short sentences, yes/no questions)", "Assist with ADLs as cognitive function declines", "Ensure safety (remove hazards, prevent wandering, ID bracelet)", "Support caregiver well-being (education, respite care, support groups)", "Administer cholinesterase inhibitors as prescribed (donepezil/Aricept)", "Plan for advanced directives and long-term care needs"],
        examTips: [
          "NCLEX tip: Acute onset + fluctuating consciousness = DELIRIUM. Gradual onset + progressive = DEMENTIA.",
          "Always look for the CAUSE of delirium — UTI is the #1 cause in elderly, followed by medications",
          "Delirium is REVERSIBLE — dementia is NOT. This distinction is heavily tested.",
          "Delirium CAN occur in a patient with dementia (delirium superimposed on dementia)",
          "Avoid benzodiazepines and anticholinergics in elderly — they CAUSE delirium"
        ]
      },
      practiceQuestions: [{ question: "An 82-year-old patient was oriented yesterday but is now confused, agitated, and picking at invisible objects. Which condition should the nurse suspect FIRST?", options: ["Alzheimer's disease progression", "Delirium", "Depression", "Parkinson's disease"], correct: 1, rationale: "The ACUTE onset (was oriented yesterday, confused today) with agitation and visual hallucinations (picking at invisible objects) is classic for delirium. Alzheimer's is gradual. The nurse should immediately investigate for underlying causes (UTI, infection, medication change)." }, { question: "What is the MOST common cause of delirium in elderly hospitalized patients?", options: ["Stroke", "Urinary tract infection", "Depression", "Medication non-compliance"], correct: 1, rationale: "UTI is the most common precipitant of delirium in elderly patients. Other common causes include medications (anticholinergics, benzodiazepines, opioids), dehydration, constipation, and pain. The nurse should obtain a urinalysis and urine culture when delirium is suspected." }, { question: "Which feature BEST distinguishes delirium from dementia?", options: ["Memory impairment", "Inability to perform ADLs", "Fluctuating level of consciousness", "Anxiety"], correct: 2, rationale: "Fluctuating level of consciousness (waxing and waning alertness, worse at night) is the hallmark feature of delirium. Dementia patients maintain a relatively stable level of consciousness until late stages. Both conditions affect memory and ADLs." }, { question: "A patient with dementia becomes suddenly more confused. What should the nurse assess?", options: ["Accept this as disease progression", "Assess for delirium superimposed on dementia", "Increase the donepezil dose", "Provide reassurance only"], correct: 1, rationale: "Patients with dementia are at INCREASED risk for delirium. Any acute change in cognitive status should prompt investigation for delirium causes (infection, medication change, metabolic imbalance), not simply be attributed to dementia progression." }, { question: "Which medication should the nurse question for an elderly patient at risk for delirium?", options: ["Acetaminophen", "Diphenhydramine (Benadryl)", "Metformin", "Amlodipine"], correct: 1, rationale: "Diphenhydramine is an anticholinergic medication that is a well-known cause of delirium in elderly patients (Beers Criteria). It should be avoided in older adults due to cognitive and fall risks. The nurse should question this order and suggest an alternative." }],
      references: [{ source: "American Geriatrics Society", title: "Beers Criteria for Potentially Inappropriate Medication Use in Older Adults", year: "2023" }, { source: "Inouye SK", title: "Delirium in Older Persons (NEJM)", year: "2006" }],
      relatedSlugs: ["altered-level-of-consciousness", "sodium", "edema-nursing-assessment", "hypotension-nursing-assessment", "chest-pain-nursing-assessment"],
      seoKeywords: ["delirium vs dementia", "delirium vs dementia nursing", "delirium vs dementia NCLEX", "acute confusion nursing"]
    }
  ];
}
