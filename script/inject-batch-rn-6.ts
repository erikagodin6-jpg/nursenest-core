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
  "atrial-myxoma-rn": {
    title: "Atrial Myxoma",
    cellular: {
      title: "Pathophysiology and Hemodynamic Effects of Atrial Myxoma",
      content: "Atrial myxoma is the most common primary cardiac tumor, accounting for approximately 50% of all benign cardiac neoplasms in adults. These tumors arise from multipotent mesenchymal stem cells in the subendocardium and are composed of scattered stellate or polygonal myxoma cells (lipidic cells) embedded in an abundant mucopolysaccharide-rich stroma (myxoid matrix) with variable amounts of collagen, elastic fibers, and smooth muscle cells. The gross appearance is typically a pedunculated, gelatinous, lobulated mass attached to the interatrial septum at the fossa ovalis by a narrow stalk, though sessile and broad-based variants also occur.\n\nApproximately 75 to 80% of myxomas originate in the left atrium, 15 to 20% in the right atrium, and rarely in the ventricles. The left atrial location is clinically significant because the tumor prolapses through the mitral valve during diastole, creating intermittent mitral valve obstruction that mimics mitral stenosis. This ball-valve effect produces position-dependent symptoms: patients characteristically experience dyspnea, syncope, and dizziness that worsen with specific body positions (particularly sitting upright or leaning forward) and improve with lying down or position changes that shift the tumor away from the mitral orifice.\n\nThe hemodynamic consequences depend on tumor size, mobility, and location. Left atrial myxomas obstruct mitral inflow, elevating left atrial pressure and producing pulmonary venous congestion with dyspnea, orthopnea, paroxysmal nocturnal dyspnea, and pulmonary edema. The elevated left atrial pressure transmits retrograde to the pulmonary vasculature, eventually causing secondary pulmonary hypertension and right heart failure. Auscultation may reveal a characteristic tumor plop, a low-pitched early diastolic sound produced by the tumor striking the endocardium or mitral valve apparatus as it prolapses through the valve orifice. This tumor plop can be confused with an S3 gallop or an opening snap of mitral stenosis, but unlike these sounds, it varies with body position.\n\nSystemic embolization is a major complication occurring in 30 to 50% of patients with left atrial myxomas. Fragments of the friable, gelatinous tumor surface or superimposed thrombi break off and travel through the systemic arterial circulation, causing stroke (most common embolic event, accounting for 50% of emboli), peripheral arterial occlusion (limb ischemia, blue toe syndrome), coronary artery embolism (myocardial infarction), renal infarction, mesenteric ischemia, and retinal artery occlusion. Right atrial myxomas can embolize to the pulmonary vasculature, causing pulmonary embolism and pulmonary infarction.\n\nConstitutional symptoms occur in approximately 50% of patients and are caused by the tumor's production of interleukin-6 (IL-6), a proinflammatory cytokine that drives the acute phase response. IL-6 stimulates hepatic synthesis of C-reactive protein (CRP), fibrinogen, and serum amyloid A, producing fever, weight loss, elevated ESR, anemia of chronic inflammation (IL-6 induces hepcidin, which blocks intestinal iron absorption and sequesters iron in macrophages), hypergammaglobulinemia, and leukocytosis. These constitutional symptoms can mimic endocarditis, vasculitis, or malignancy, often leading to delayed diagnosis.\n\nFamilial myxomas (Carney complex) account for approximately 7% of atrial myxomas and are caused by inactivating mutations in the PRKAR1A gene (protein kinase A regulatory subunit 1-alpha), which normally functions as a tumor suppressor. Carney complex is an autosomal dominant syndrome characterized by cardiac myxomas (often multiple, recurrent, and affecting multiple chambers), spotty skin pigmentation (lentigines and blue nevi on the face, lips, and conjunctivae), endocrine overactivity (primary pigmented nodular adrenocortical disease causing Cushing syndrome, pituitary adenomas, thyroid tumors, testicular tumors), and myxomas in other locations (skin, breast). Unlike sporadic myxomas, familial myxomas have a 12 to 22% recurrence rate after excision.\n\nDiagnosis is established by transthoracic echocardiography (TTE), which has a sensitivity of greater than 95% for detecting atrial myxomas. The echocardiographic hallmark is a pedunculated, mobile, heterogeneous mass attached to the interatrial septum that prolapses through the mitral valve during diastole. Transesophageal echocardiography (TEE) provides superior spatial resolution and is used for preoperative planning. Cardiac MRI with gadolinium enhancement can further characterize the mass and distinguish myxoma from thrombus or other cardiac tumors. Treatment is urgent surgical excision with full-thickness resection of the interatrial septum at the attachment site and reconstruction with a pericardial or Dacron patch. Surgery is curative for sporadic myxomas with a recurrence rate of 1 to 3%. Long-term echocardiographic surveillance is recommended annually for at least 5 years to detect recurrence."
    },
    riskFactors: [
      "Carney complex (PRKAR1A mutation, autosomal dominant, multiple recurrent myxomas)",
      "Female sex (approximately 65 to 70% of sporadic myxomas occur in women)",
      "Age 30 to 60 years (peak incidence for sporadic myxomas)",
      "Family history of cardiac myxoma or Carney complex (7% of cases are familial)",
      "No established modifiable risk factors for sporadic atrial myxoma",
      "Spotty skin pigmentation or endocrine tumors suggesting Carney complex",
      "Prior incomplete myxoma resection (recurrence from residual tumor cells)"
    ],
    diagnostics: [
      "Transthoracic echocardiography (TTE): pedunculated mobile mass attached to interatrial septum at fossa ovalis, prolapsing through mitral valve during diastole; sensitivity greater than 95%",
      "Transesophageal echocardiography (TEE): superior spatial resolution for preoperative planning, assessing tumor attachment, size, and relationship to mitral valve apparatus",
      "Cardiac MRI with gadolinium: tissue characterization distinguishing myxoma (heterogeneous enhancement) from thrombus (no enhancement) and other cardiac tumors",
      "Laboratory studies: elevated ESR, CRP, IL-6 levels, anemia of chronic inflammation, hypergammaglobulinemia, leukocytosis (from IL-6-mediated acute phase response)",
      "CT angiography of head, viscera, and extremities if systemic embolization is suspected (stroke, peripheral ischemia, renal or mesenteric infarction)",
      "Genetic testing for PRKAR1A mutation if Carney complex is suspected (young age, multiple myxomas, skin pigmentation, endocrine tumors, family history)"
    ],
    management: [
      "Urgent surgical excision is the definitive treatment: full-thickness resection of interatrial septum at tumor attachment site with pericardial or Dacron patch reconstruction to minimize recurrence",
      "Preoperative anticoagulation may be considered to reduce thromboembolic risk while awaiting surgery, though the friable tumor itself is the embolic source",
      "Treat embolic complications: stroke (neurology consultation, thrombolysis or thrombectomy if eligible), limb ischemia (vascular surgery), coronary embolism (percutaneous coronary intervention)",
      "Postoperative echocardiographic surveillance annually for at least 5 years (1 to 3% recurrence for sporadic, 12 to 22% for familial/Carney complex)",
      "Screen for Carney complex if patient is under 40, has multiple myxomas, family history, or associated findings (lentigines, endocrine tumors)",
      "Manage heart failure symptoms (diuretics, oxygen) preoperatively while awaiting surgical excision",
      "Cascade screening with echocardiography for first-degree relatives of Carney complex patients"
    ],
    nursingActions: [
      "Monitor hemodynamic status closely for signs of mitral valve obstruction: position-dependent dyspnea, syncope or presyncope with position changes (especially sitting upright), and assess for tumor plop on auscultation (low-pitched early diastolic sound at apex that varies with position)",
      "Assess for embolic events at each encounter: new focal neurological deficits (stroke), unilateral limb pain with pallor and pulselessness (peripheral embolism), flank pain with hematuria (renal infarction), sudden severe abdominal pain (mesenteric embolism), sudden visual changes (retinal artery occlusion)",
      "Monitor constitutional symptoms and inflammatory markers: daily temperature trending, weight monitoring for unexplained weight loss, assess for fatigue and malaise; track ESR, CRP, and hemoglobin levels as markers of tumor-driven inflammation",
      "Preoperative nursing care: maintain bed rest with head of bed elevated to optimize hemodynamics, avoid positions that exacerbate symptoms (determine patient-specific positional triggers), continuous telemetry monitoring for arrhythmias, and maintain IV access for emergency medication administration",
      "Postoperative cardiac surgery nursing: monitor for surgical complications including bleeding (chest tube output greater than 200 mL/hour for 2 consecutive hours), cardiac tamponade (Beck triad: hypotension, muffled heart sounds, JVD), atrial arrhythmias (common after interatrial septum resection), and wound infection",
      "Educate patient about lifelong echocardiographic surveillance for recurrence, especially for Carney complex patients who have significantly higher recurrence rates; emphasize that most sporadic myxomas are cured with single surgery",
      "Assess psychosocial impact of cardiac tumor diagnosis: patients often fear that cardiac tumor means cancer; educate that atrial myxomas are benign with excellent prognosis after surgical removal; connect with cardiac surgery support resources"
    ],
    assessmentFindings: [
      "Position-dependent dyspnea, syncope, or dizziness that changes with body position (pathognomonic for ball-valve obstruction)",
      "Tumor plop: low-pitched early diastolic sound at the cardiac apex, varying with position, distinct from S3 or opening snap",
      "Signs of mitral stenosis: diastolic rumbling murmur at apex, pulmonary congestion with bilateral crackles, elevated JVP",
      "Constitutional symptoms: unexplained fever, weight loss, malaise, night sweats (from IL-6 production)",
      "Embolic phenomena: stroke symptoms, blue toe syndrome, splinter hemorrhages, Janeway lesions (mimicking endocarditis)",
      "Laboratory: elevated ESR and CRP, normocytic anemia (anemia of chronic inflammation), hypergammaglobulinemia"
    ],
    signs: {
      left: [
        "Intermittent dyspnea with position changes",
        "Mild fatigue and exercise intolerance",
        "Elevated ESR and CRP on routine labs",
        "Normocytic anemia of chronic inflammation",
        "Incidental finding on echocardiography"
      ],
      right: [
        "Acute stroke from tumor embolization",
        "Syncope or sudden death from complete mitral obstruction",
        "Acute pulmonary edema from ball-valve obstruction",
        "Peripheral arterial embolism with acute limb ischemia",
        "Hemodynamic collapse requiring emergent surgical excision"
      ]
    },
    medications: [
      {
        name: "Furosemide",
        type: "Loop Diuretic",
        action: "Inhibits NKCC2 cotransporter in the thick ascending limb of the loop of Henle, producing natriuresis and diuresis to reduce pulmonary congestion and preload in patients with atrial myxoma causing mitral obstruction and heart failure symptoms",
        sideEffects: "Hypokalemia, hyponatremia, hypomagnesemia, metabolic alkalosis, dehydration, ototoxicity, hyperuricemia, hypotension",
        contra: "Anuria, severe hypovolemia, hepatic coma, uncorrected hypokalemia; use cautiously in atrial myxoma as excessive preload reduction may worsen cardiac output if obstruction is severe",
        pearl: "Furosemide provides symptomatic relief of pulmonary congestion while awaiting definitive surgical excision; monitor electrolytes closely; diuretics are a temporizing measure only and do not address the underlying obstruction; excessive diuresis can reduce preload dangerously in fixed obstruction"
      },
      {
        name: "Heparin (Unfractionated)",
        type: "Anticoagulant (Indirect Thrombin Inhibitor)",
        action: "Binds antithrombin III, potentiating its inhibition of thrombin (factor IIa) and factor Xa by 1000-fold; used preoperatively to reduce thromboembolic risk from thrombi forming on the myxoma surface, though it does not prevent tumor fragment embolization",
        sideEffects: "Bleeding (most common), heparin-induced thrombocytopenia (HIT type II: immune-mediated, occurs 5 to 14 days after exposure), osteoporosis with prolonged use, hyperkalemia (aldosterone suppression), injection site reactions",
        contra: "Active major bleeding, severe uncontrolled hypertension, HIT history, recent surgery within high-risk areas (CNS, eye), thrombocytopenia below 50,000",
        pearl: "Anticoagulation reduces thrombus-related embolism but cannot prevent embolization of tumor fragments from the friable myxoma surface; monitor aPTT every 6 hours during IV infusion (goal 1.5 to 2.5 times control); platelet count monitoring on days 4 to 14 for HIT; protamine sulfate reverses heparin (1 mg per 100 units of heparin given in the last 2 to 3 hours)"
      },
      {
        name: "Metoprolol",
        type: "Cardioselective Beta-1 Blocker",
        action: "Selectively blocks beta-1 adrenergic receptors in the heart, reducing heart rate and extending diastolic filling time; in atrial myxoma with mitral obstruction, rate control optimizes diastolic filling around the obstructing mass and reduces myocardial oxygen demand",
        sideEffects: "Bradycardia, hypotension, fatigue, cold extremities, bronchospasm at high doses, masking of hypoglycemia, depression, sexual dysfunction",
        contra: "Severe sinus bradycardia, second or third-degree heart block without pacemaker, cardiogenic shock, decompensated heart failure, severe reactive airway disease; use cautiously if myxoma causes fixed obstruction as reduced heart rate may not compensate for fixed stroke volume limitation",
        pearl: "Rate control with beta-blockers is used cautiously in atrial myxoma: slowing heart rate extends diastole which may paradoxically allow more time for tumor prolapse through the mitral valve in some patients; avoid in hemodynamically unstable patients; this is strictly a temporizing measure before definitive surgery"
      }
    ],
    pearls: [
      "Atrial myxoma is the great mimic of cardiology: it can present as mitral stenosis (obstruction), endocarditis (emboli, constitutional symptoms, elevated inflammatory markers), vasculitis (embolic skin lesions, elevated ESR), or malignancy (weight loss, anemia, fever), leading to diagnostic delay averaging 1 to 2 years",
      "Position-dependent symptoms are the clinical hallmark: syncope or dyspnea that occurs in specific body positions and resolves with position change strongly suggests a mobile intracardiac mass; always ask about positional symptom variation",
      "The tumor plop is a pathognomonic auscultatory finding: a low-pitched early diastolic sound at the apex that varies with body position, distinguishing it from S3 (consistent regardless of position) and the opening snap of mitral stenosis (also position-independent)",
      "Systemic embolization occurs in 30 to 50% of left atrial myxomas; any young patient with stroke, peripheral arterial embolism, or unexplained multi-organ infarction should have an echocardiogram to rule out cardiac tumor as the embolic source",
      "Carney complex should be suspected in any patient under 40 with atrial myxoma, multiple or bilateral myxomas, or family history; the triad is cardiac myxomas plus spotty skin pigmentation plus endocrine overactivity (particularly primary pigmented nodular adrenocortical disease causing Cushing syndrome)",
      "Surgical excision is curative for 97 to 99% of sporadic myxomas; however, Carney complex patients have a 12 to 22% recurrence rate requiring lifelong annual echocardiographic surveillance",
      "IL-6 production by the myxoma drives the constitutional symptoms and abnormal laboratory values; these resolve completely after tumor excision, confirming the tumor as the cytokine source and serving as a marker for recurrence"
    ],
    quiz: [
      {
        question: "A 45-year-old woman presents with dyspnea that worsens when she sits upright and improves when she lies down, an elevated ESR, and an early diastolic sound at the cardiac apex that varies with position. What should the nurse suspect?",
        options: [
          "Mitral stenosis from rheumatic heart disease",
          "Left atrial myxoma with intermittent mitral valve obstruction",
          "Infective endocarditis with valvular vegetations",
          "Pericardial effusion with cardiac tamponade"
        ],
        correct: 1,
        rationale: "The combination of position-dependent dyspnea (worsens sitting up, improves lying down), elevated ESR (from IL-6-mediated inflammation), and a position-variable early diastolic sound at the apex (tumor plop) is classic for left atrial myxoma with ball-valve mitral obstruction. Mitral stenosis causes a fixed opening snap that does not vary with position. Endocarditis has fever and positive blood cultures. Tamponade causes Beck triad."
      },
      {
        question: "A patient with a known left atrial myxoma awaiting surgery suddenly develops right-sided weakness, facial droop, and slurred speech. What is the most likely cause and the priority nursing action?",
        options: [
          "Hypertensive crisis causing hemorrhagic stroke; administer IV labetalol",
          "Tumor embolization causing ischemic stroke; activate stroke code immediately",
          "Transient ischemic attack that will resolve spontaneously; continue monitoring",
          "Medication side effect; hold all anticoagulants and recheck neurological status in 1 hour"
        ],
        correct: 1,
        rationale: "Acute onset of unilateral weakness, facial droop, and slurred speech in a patient with left atrial myxoma is most likely an ischemic stroke from tumor embolization (occurs in 30 to 50% of left atrial myxomas). The priority is immediate stroke code activation (time is brain) for evaluation for thrombolysis or thrombectomy. TIA should never be assumed. Waiting 1 hour wastes the critical intervention window."
      },
      {
        question: "After successful surgical excision of a sporadic left atrial myxoma, what follow-up does the nurse educate the patient about?",
        options: [
          "No follow-up is needed because the tumor was benign",
          "Annual echocardiographic surveillance for at least 5 years to monitor for recurrence",
          "Monthly cardiac MRI for the first year to detect metastasis",
          "Lifelong chemotherapy to prevent tumor recurrence"
        ],
        correct: 1,
        rationale: "Even though sporadic atrial myxomas have a low recurrence rate (1 to 3%), annual echocardiographic surveillance for at least 5 years is recommended to detect recurrence early. Myxomas are benign and do not metastasize, so chemotherapy is not indicated. MRI is not needed monthly. Complete absence of follow-up risks missing the small percentage of recurrences."
      }
    ]
  },

  "autoimmune-encephalitis-rn": {
    title: "Autoimmune Encephalitis",
    cellular: {
      title: "Immune-Mediated Neuronal Dysfunction in Autoimmune Encephalitis",
      content: "Autoimmune encephalitis (AE) encompasses a group of inflammatory brain disorders caused by antibodies directed against neuronal cell-surface or synaptic proteins, resulting in encephalopathy with cognitive impairment, psychiatric symptoms, seizures, and movement disorders. Unlike paraneoplastic encephalitides that involve T-cell-mediated neuronal destruction (targeting intracellular antigens), antibody-mediated AE targets extracellular epitopes on neuronal surface proteins, making the neuronal injury potentially reversible with immunotherapy and antibody removal.\n\nAnti-NMDA receptor encephalitis is the most common and best-characterized form of AE, affecting predominantly young women and children. The N-methyl-D-aspartate receptor (NMDAR) is a glutamate-gated ion channel critical for synaptic plasticity, learning, memory, and excitatory neurotransmission. The NMDAR is a heterotetrameric receptor composed of two GluN1 (NR1) obligatory subunits and two GluN2 (NR2A-D) regulatory subunits that form a cation channel permeable to calcium, sodium, and potassium. In anti-NMDA receptor encephalitis, IgG antibodies target the GluN1 subunit, causing receptor internalization through cross-linking and antibody-mediated endocytosis. This dramatically reduces NMDAR density on the synaptic surface without destroying the neurons themselves.\n\nThe reduction in NMDAR function produces a predictable clinical syndrome that mirrors the effects of NMDAR antagonists such as ketamine and phencyclidine (PCP). The pathogenesis proceeds through distinct clinical phases. The prodromal phase (1 to 2 weeks) presents with viral-like symptoms: headache, fever, malaise, and upper respiratory or gastrointestinal symptoms. The psychiatric phase follows with behavioral changes, psychosis (paranoia, delusions, hallucinations), agitation, anxiety, and cognitive dysfunction (memory deficits, language difficulties, disorientation). Many patients are initially misdiagnosed with a primary psychiatric disorder and admitted to psychiatric facilities. The neurological phase then emerges with seizures (often refractory), movement disorders (orofacial dyskinesias, choreoathetosis, dystonia, opisthotonus), speech deterioration (echolalia, mutism), decreased level of consciousness, and autonomic instability. Autonomic dysfunction includes central hypoventilation (requiring mechanical ventilation in 75% of severe cases), cardiac arrhythmias, labile blood pressure, hyperthermia, and sialorrhea. In the most severe cases, patients become catatonic and unresponsive.\n\nThe association between anti-NMDA receptor encephalitis and ovarian teratomas is well established: approximately 40 to 50% of adult women (but only 9% of men and children) have an underlying ovarian teratoma. Teratomas contain ectopic neural tissue that expresses NMDAR on their surface, triggering the autoimmune response through molecular mimicry and loss of immune tolerance. Tumor removal (oophorectomy) is an essential component of treatment, as the tumor serves as the ongoing antigenic stimulus for antibody production.\n\nOther important forms of AE include LGI1 (leucine-rich glioma-inactivated 1) antibody encephalitis, which presents in older adults (median age 60) with faciobrachial dystonic seizures (brief, frequent tonic contractions of the face and arm on the same side), hyponatremia (from SIADH, as LGI1 is expressed in the hypothalamus), and rapid cognitive decline. CASPR2 (contactin-associated protein-like 2) antibody encephalitis presents with limbic encephalitis, Morvan syndrome (encephalopathy, neuromyotonia, autonomic dysfunction, insomnia), and peripheral nerve hyperexcitability. GABA-B receptor antibody encephalitis presents with limbic encephalitis and refractory seizures, with approximately 50% having an underlying malignancy (small cell lung cancer).\n\nDiagnosis requires a combination of clinical features, CSF analysis, and antibody testing. CSF typically shows lymphocytic pleocytosis (elevated white blood cells, predominantly lymphocytes), elevated protein, and often oligoclonal bands. Anti-neuronal antibodies should be tested in both serum and CSF (CSF is more sensitive and specific for anti-NMDAR antibodies). MRI may show T2/FLAIR hyperintensities in the medial temporal lobes (limbic encephalitis pattern) or may be normal in up to 50% of anti-NMDA receptor encephalitis cases. EEG often shows diffuse slowing, seizure activity, or the extreme delta brush pattern (rhythmic delta activity with superimposed beta frequency activity), which is nearly pathognomonic for anti-NMDA receptor encephalitis.\n\nTreatment follows a two-line immunotherapy approach. First-line immunotherapy includes high-dose IV methylprednisolone (1 gram daily for 3 to 5 days), intravenous immunoglobulin (IVIG, 0.4 g/kg/day for 5 days), and/or plasma exchange (5 to 7 sessions over 10 to 14 days). If there is insufficient clinical improvement within 2 weeks, second-line immunotherapy with rituximab (anti-CD20 monoclonal antibody that depletes B cells) and/or cyclophosphamide is initiated. Tumor removal (teratoma resection) should be performed as soon as possible in patients with identified tumors. Recovery is often prolonged (months to years) and follows the reverse order of symptom onset: autonomic function improves first, followed by movement disorders and seizures, then cognition and behavior. Approximately 80% of patients achieve good functional recovery with early, aggressive treatment."
    },
    riskFactors: [
      "Ovarian teratoma (present in 40 to 50% of adult women with anti-NMDA receptor encephalitis; the ectopic neural tissue triggers the autoimmune response)",
      "Female sex (anti-NMDA receptor encephalitis has 4:1 female predominance in adults)",
      "Young age (median onset age 21 for anti-NMDA receptor encephalitis; LGI1 encephalitis peaks at age 60)",
      "Preceding viral illness (herpes simplex encephalitis can trigger secondary anti-NMDA receptor antibodies in 20 to 27% of cases)",
      "Underlying malignancy: small cell lung cancer (GABA-B receptor), thymoma (CASPR2/LGI1), ovarian teratoma (NMDAR)",
      "Autoimmune predisposition (concurrent autoimmune thyroid disease, systemic lupus erythematosus)",
      "Prior herpes simplex encephalitis (post-HSE autoimmune encephalitis occurs in up to 27% of cases)"
    ],
    diagnostics: [
      "Anti-neuronal antibody testing in serum AND CSF: anti-NMDAR antibodies (CSF more sensitive than serum), anti-LGI1, anti-CASPR2, anti-GABA-B, anti-AMPAR; send paired samples to specialized reference laboratory",
      "CSF analysis: lymphocytic pleocytosis (50 to 80% of cases), elevated protein, oligoclonal bands, normal glucose; CSF may be normal early in the disease course",
      "Brain MRI with contrast: T2/FLAIR hyperintensities in medial temporal lobes (limbic pattern) in LGI1 and GABA-B AE; normal in up to 50% of anti-NMDAR encephalitis; exclude other causes of encephalitis",
      "EEG: diffuse slowing, seizure activity, or extreme delta brush pattern (rhythmic delta with superimposed beta, nearly pathognomonic for anti-NMDAR encephalitis)",
      "CT/MRI/ultrasound of pelvis to screen for ovarian teratoma in all females with anti-NMDAR encephalitis; whole-body PET-CT if other antibodies suggest paraneoplastic etiology",
      "Comprehensive tumor screening: CT chest, abdomen, pelvis; consider PET-CT; testicular ultrasound in males with CASPR2 antibodies"
    ],
    management: [
      "First-line immunotherapy initiated emergently: IV methylprednisolone 1 gram daily for 3 to 5 days, IVIG 0.4 g/kg/day for 5 days, and/or plasma exchange (5 to 7 sessions over 10 to 14 days); often administered in combination",
      "Second-line immunotherapy if insufficient improvement within 2 weeks: rituximab 375 mg/m2 weekly for 4 weeks (depletes CD20+ B cells) and/or cyclophosphamide 750 mg/m2 monthly",
      "Tumor removal: urgent oophorectomy for ovarian teratoma, thymectomy for thymoma, or resection of other identified tumors; tumor removal eliminates the antigenic stimulus and improves outcomes",
      "Seizure management: broad-spectrum antiepileptic drugs (levetiracetam, valproic acid, lacosamide); seizures are often refractory to standard AEDs and improve with immunotherapy",
      "Supportive ICU care for severe cases: mechanical ventilation for central hypoventilation, hemodynamic monitoring for autonomic instability, DVT prophylaxis, nutritional support via enteral feeding, skin integrity management for prolonged immobility",
      "Long-term immunosuppression with mycophenolate mofetil or azathioprine for relapse prevention, particularly in patients without identified tumors",
      "Prolonged rehabilitation: physical, occupational, speech, and cognitive therapy; recovery often takes months to years and follows reverse order of symptom onset"
    ],
    nursingActions: [
      "Perform comprehensive neurological assessment every 2 to 4 hours: Glasgow Coma Scale, pupil reactivity, motor strength, cranial nerve function, presence of abnormal movements (orofacial dyskinesias, choreoathetosis, dystonia), speech assessment (mutism, echolalia), and orientation; document changes objectively for comparison across shifts",
      "Monitor for autonomic instability continuously: heart rate variability (tachycardia alternating with bradycardia), labile blood pressure (hypertensive crises alternating with hypotension), central hypoventilation (assess respiratory rate, depth, and pattern; SpO2 may not decline until late), hyperthermia or hypothermia, excessive salivation, and cardiac arrhythmias on telemetry",
      "Implement seizure precautions and manage actively: maintain suction at bedside, padded side rails, IV access secured, seizure rescue medications (lorazepam) immediately available; document seizure characteristics (type, duration, post-ictal state); many seizures in AE are subtle or non-convulsive requiring continuous EEG monitoring",
      "Provide patient safety during agitation and psychosis: maintain a calm, low-stimulation environment, avoid restraints if possible (use de-escalation techniques first), administer prescribed antipsychotics cautiously (avoid typical antipsychotics which worsen movement disorders), 1:1 observation for fall prevention and self-harm prevention",
      "Administer immunotherapy per protocol: for IVIG infusion, premedicate with acetaminophen and diphenhydramine, start at slow rate and titrate as tolerated, monitor for infusion reactions (headache, chills, nausea, hypotension, anaphylaxis); for plasma exchange, monitor hemodynamic stability during and after sessions, check fibrinogen post-treatment",
      "Support family through the prolonged illness trajectory: educate that AE is NOT a psychiatric illness but an immune-mediated brain disease; recovery is expected but often slow (months to years); early aggressive treatment improves outcomes; connect with Autoimmune Encephalitis Alliance support resources",
      "Coordinate multidisciplinary care: neurology (immunotherapy, seizure management), gynecology/oncology (tumor screening and removal), psychiatry (behavioral management), rehabilitation services (PT, OT, speech, cognitive therapy), social work (family support, financial resources, placement planning for prolonged recovery)"
    ],
    assessmentFindings: [
      "Prodromal viral-like symptoms (headache, fever, malaise) 1 to 2 weeks before neuropsychiatric onset",
      "Psychiatric symptoms: acute behavioral changes, psychosis (hallucinations, delusions), agitation, paranoia, anxiety, personality changes; often misdiagnosed as primary psychiatric disorder",
      "Seizures: focal or generalized, often refractory to standard antiepileptic drugs",
      "Movement disorders: orofacial dyskinesias (lip smacking, jaw movements, grimacing), choreoathetoid movements, dystonic posturing, opisthotonus",
      "Cognitive decline: confusion, disorientation, memory impairment, language deterioration, mutism",
      "Autonomic instability: tachycardia, bradycardia, labile blood pressure, central hypoventilation, hyperthermia, diaphoresis, sialorrhea"
    ],
    signs: {
      left: [
        "New-onset psychiatric symptoms in a previously healthy young person",
        "Mild cognitive difficulty and memory impairment",
        "Isolated seizure with post-ictal confusion",
        "Low-grade fever and headache",
        "Subtle personality changes noted by family"
      ],
      right: [
        "Refractory status epilepticus requiring ICU admission",
        "Catatonia with mutism and unresponsiveness",
        "Central hypoventilation requiring mechanical ventilation",
        "Severe autonomic storms with hemodynamic instability",
        "Prolonged unresponsiveness for weeks to months"
      ]
    },
    medications: [
      {
        name: "Methylprednisolone (IV Pulse)",
        type: "Glucocorticoid (Anti-inflammatory/Immunosuppressant)",
        action: "Suppresses immune response through multiple mechanisms: inhibits NF-kB transcription factor reducing proinflammatory cytokine production, induces lymphocyte apoptosis, reduces blood-brain barrier permeability, decreases antibody production, and suppresses complement activation; high-dose pulse therapy rapidly reduces CNS inflammation",
        sideEffects: "Hyperglycemia (monitor blood glucose every 4 to 6 hours), hypertension, insomnia, psychosis and mood changes (steroid psychosis), gastric irritation (administer with proton pump inhibitor), immunosuppression with infection risk, hypokalemia, fluid retention, adrenal suppression with prolonged use",
        contra: "Active systemic fungal infection, live vaccine administration, known hypersensitivity; relative: uncontrolled diabetes (hyperglycemia), active peptic ulcer disease, uncontrolled hypertension, active tuberculosis",
        pearl: "IV pulse methylprednisolone 1 gram daily for 3 to 5 days is first-line treatment for AE; infuse over 60 minutes to reduce cardiovascular side effects; monitor blood glucose every 4 to 6 hours and use insulin sliding scale as needed; the psychiatric side effects of high-dose steroids can be difficult to distinguish from the psychiatric symptoms of AE itself; taper if used beyond 5 days to prevent adrenal crisis"
      },
      {
        name: "Rituximab",
        type: "Anti-CD20 Monoclonal Antibody (B-Cell Depleting Agent)",
        action: "Binds CD20 surface antigen on pre-B and mature B lymphocytes, inducing B-cell depletion through complement-dependent cytotoxicity, antibody-dependent cellular cytotoxicity, and direct apoptosis; reduces production of pathogenic anti-neuronal antibodies by eliminating antibody-producing B-cell precursors",
        sideEffects: "Infusion reactions (fever, chills, rigors, hypotension, bronchospasm - especially first infusion), increased infection risk (bacterial, viral including PML from JC virus reactivation, hepatitis B reactivation), hypogammaglobulinemia with repeated cycles, late-onset neutropenia, tumor lysis syndrome (rare in AE context)",
        contra: "Active severe infections, hepatitis B carrier status without antiviral prophylaxis, severe immunodeficiency, pregnancy (Category C), known hypersensitivity to murine proteins; screen for hepatitis B, hepatitis C, and tuberculosis before initiation",
        pearl: "Second-line therapy for AE when first-line treatment fails; premedicate with methylprednisolone 100 mg IV, acetaminophen 650 mg, and diphenhydramine 50 mg 30 minutes before infusion to reduce reactions; start infusion slowly (50 mg/hour) and increase every 30 minutes as tolerated; B-cell depletion lasts 6 to 12 months; check quantitative immunoglobulins before repeat cycles"
      },
      {
        name: "Levetiracetam",
        type: "Antiepileptic Drug (SV2A Ligand)",
        action: "Binds synaptic vesicle protein 2A (SV2A), modulating neurotransmitter release and reducing neuronal excitability; provides broad-spectrum seizure protection without hepatic enzyme induction; does not interact with immunotherapy medications",
        sideEffects: "Behavioral changes (irritability, agitation, aggression - particularly problematic in AE patients already exhibiting psychiatric symptoms), somnolence, dizziness, headache, fatigue, mood changes, suicidal ideation",
        contra: "Known hypersensitivity to levetiracetam; dose adjustment required for renal impairment (renally eliminated); use cautiously in patients with severe psychiatric symptoms as behavioral side effects may worsen psychiatric presentation of AE",
        pearl: "Preferred first-line AED in autoimmune encephalitis because it has no hepatic enzyme induction (unlike carbamazepine, phenytoin) and no drug interactions with immunotherapy; seizures in AE are often refractory to AEDs alone and improve primarily with immunotherapy; behavioral side effects (anger, agitation) can be difficult to distinguish from AE symptoms; dose range 500 to 1500 mg twice daily"
      }
    ],
    pearls: [
      "The hallmark diagnostic clue for anti-NMDA receptor encephalitis is a young woman with acute psychiatric symptoms followed by seizures, movement disorders (especially orofacial dyskinesias), and autonomic instability; any young patient with new-onset psychosis and seizures should be tested for anti-NMDAR antibodies",
      "A normal MRI does NOT exclude autoimmune encephalitis: up to 50% of anti-NMDAR encephalitis patients have normal brain MRI; CSF antibody testing and EEG are more sensitive diagnostic tools",
      "The extreme delta brush pattern on EEG (rhythmic delta activity with superimposed beta) is nearly pathognomonic for anti-NMDA receptor encephalitis and should prompt immediate antibody testing and empiric immunotherapy",
      "All women diagnosed with anti-NMDA receptor encephalitis must undergo pelvic imaging (ultrasound, CT, or MRI) to screen for ovarian teratoma; tumor removal dramatically improves outcomes and reduces relapse risk",
      "Recovery from anti-NMDA receptor encephalitis follows the reverse order of symptom onset: autonomic function normalizes first, then movement disorders and seizures resolve, and finally cognition and behavior recover over months to years",
      "Herpes simplex encephalitis (HSE) can trigger secondary anti-NMDA receptor antibodies in 20 to 27% of HSE survivors, causing a relapse of encephalitis 2 to 8 weeks after initial recovery; this post-HSE AE requires immunotherapy, not repeat antiviral treatment",
      "Early initiation of immunotherapy (within 4 weeks of symptom onset) is associated with significantly better outcomes; every week of delay reduces the likelihood of good functional recovery"
    ],
    quiz: [
      {
        question: "A 23-year-old previously healthy woman is admitted to psychiatry with acute-onset paranoia, hallucinations, and agitation. On day 3, she develops seizures and orofacial dyskinesias. What should the nurse advocate for?",
        options: [
          "Increasing the dose of antipsychotic medication for worsening psychiatric symptoms",
          "Urgent anti-NMDAR antibody testing in CSF and serum, pelvic imaging for ovarian teratoma, and neurology consultation",
          "CT scan of the head and discharge if normal",
          "Observation for medication side effects causing the movement disorder"
        ],
        correct: 1,
        rationale: "Acute psychiatric symptoms followed by seizures and orofacial dyskinesias in a young woman is the classic presentation of anti-NMDA receptor encephalitis. The nurse should advocate for anti-NMDAR antibody testing (CSF and serum), pelvic imaging to screen for ovarian teratoma (present in 40 to 50%), and neurology consultation for immunotherapy. This is NOT a primary psychiatric disorder. Increasing antipsychotics may worsen movement disorders and delays diagnosis."
      },
      {
        question: "During IVIG infusion for autoimmune encephalitis, a patient develops rigors, fever, and hypotension. What is the priority nursing action?",
        options: [
          "Stop the infusion immediately, maintain IV access, administer prescribed antihistamine and antipyretic, and notify the provider",
          "Slow the infusion rate by 50% and continue monitoring",
          "Switch to a different brand of IVIG and restart at the same rate",
          "Administer epinephrine IM immediately for anaphylaxis"
        ],
        correct: 0,
        rationale: "Rigors, fever, and hypotension during IVIG infusion constitute an infusion reaction. The priority is to stop the infusion immediately, maintain IV access, administer prescribed medications (antihistamine, antipyretic, and possibly corticosteroids), and notify the provider. This presentation is an infusion reaction, not anaphylaxis (which would include bronchospasm, urticaria, angioedema requiring epinephrine). The infusion may be restarted at a slower rate after symptoms resolve if approved by the provider."
      },
      {
        question: "A patient with anti-NMDA receptor encephalitis develops tachycardia alternating with bradycardia, blood pressure fluctuating between 200/110 and 80/50, and a respiratory rate of 6 breaths per minute. What is the nurse's primary concern?",
        options: [
          "Medication toxicity requiring immediate dose reduction",
          "Autonomic instability and central hypoventilation requiring ICU transfer and possible mechanical ventilation",
          "Sepsis requiring blood cultures and empiric antibiotics",
          "Seizure activity requiring increased antiepileptic medications"
        ],
        correct: 1,
        rationale: "Labile heart rate (tachycardia alternating with bradycardia), wildly fluctuating blood pressure, and central hypoventilation (RR 6) are hallmarks of autonomic instability in anti-NMDA receptor encephalitis. Central hypoventilation occurs in up to 75% of severe cases and requires ICU-level monitoring and likely mechanical ventilation. This is not sepsis (no infectious source) or medication toxicity, but a direct manifestation of the autoimmune process affecting brainstem autonomic centers."
      }
    ]
  },

  "autoimmune-hepatitis-rn": {
    title: "Autoimmune Hepatitis (AIH)",
    cellular: {
      title: "Immune-Mediated Hepatocyte Destruction in Autoimmune Hepatitis",
      content: "Autoimmune hepatitis (AIH) is a chronic, progressive inflammatory liver disease characterized by immune-mediated destruction of hepatocytes, leading to interface hepatitis, fibrosis, and ultimately cirrhosis if untreated. AIH affects approximately 10 to 17 per 100,000 persons, with a strong female predominance (3.6:1 female to male ratio) and a bimodal age distribution peaking in adolescence/young adulthood and again between ages 40 to 60.\n\nThe pathogenesis of AIH involves a breakdown of self-tolerance to hepatocyte autoantigens, resulting in T-cell-mediated liver injury. The process begins when hepatocyte surface antigens are presented to CD4+ T-helper cells by antigen-presenting cells (APCs) in the context of major histocompatibility complex (MHC) class II molecules. Certain HLA haplotypes, particularly HLA-DR3 (DRB1*0301) and HLA-DR4 (DRB1*0401), confer genetic susceptibility by presenting hepatocyte autoantigens more effectively. The activated CD4+ T-helper cells secrete proinflammatory cytokines (interferon-gamma, interleukin-2, TNF-alpha) that recruit and activate CD8+ cytotoxic T lymphocytes, natural killer (NK) cells, and macrophages. These effector cells directly attack hepatocytes through perforin-granzyme-mediated cytotoxicity, Fas/FasL-mediated apoptosis, and antibody-dependent cellular cytotoxicity (ADCC).\n\nAIH is classified into two types based on the pattern of circulating autoantibodies. Type 1 AIH (most common, accounting for 80% of cases) is characterized by antinuclear antibodies (ANA) and/or anti-smooth muscle antibodies (ASMA). The target antigen for ASMA is F-actin, a component of the hepatocyte cytoskeleton. Type 1 affects all ages, has a more gradual onset, and is more commonly associated with other autoimmune diseases (thyroiditis, ulcerative colitis, rheumatoid arthritis, Sjogren syndrome). Type 2 AIH (less common, primarily affects children and young adults) is characterized by anti-liver kidney microsomal type 1 antibodies (anti-LKM1) targeting cytochrome P450 2D6 (CYP2D6) and/or anti-liver cytosol type 1 (anti-LC1) antibodies. Type 2 has a more aggressive clinical course with more frequent acute presentations and higher rates of progression to cirrhosis.\n\nThe histological hallmark of AIH is interface hepatitis (formerly called piecemeal necrosis): lymphoplasmacytic inflammation at the junction between the portal tract and the hepatic parenchyma, with hepatocyte destruction at this interface. Plasma cells are characteristically prominent in the inflammatory infiltrate. Other histological features include lobular inflammation (hepatitis extending into the hepatic lobule), hepatocyte rosette formation (regenerating hepatocytes arranged in rosette patterns), and emperipolesis (penetration of one cell by another, typically lymphocytes within hepatocytes). As the disease progresses, bridging necrosis (bands of necrosis connecting portal tracts to central veins or adjacent portal tracts) and fibrosis develop, eventually leading to cirrhosis.\n\nThe clinical presentation of AIH is highly variable, ranging from asymptomatic elevation of liver enzymes to acute hepatic failure. Approximately 25 to 30% of patients present with acute hepatitis mimicking viral hepatitis (jaundice, fatigue, nausea, abdominal pain), while others present insidiously with fatigue, malaise, arthralgias, and mildly elevated transaminases discovered incidentally. Up to 30% of patients have established cirrhosis at diagnosis, indicating prolonged subclinical disease. Rarely (5 to 10%), AIH presents as acute liver failure with coagulopathy, encephalopathy, and jaundice requiring emergency liver transplant evaluation.\n\nLaboratory findings include elevated serum aminotransferases (AST and ALT, often 5 to 10 times the upper limit of normal during flares, though sometimes exceeding 1000 IU/L in acute presentations), elevated immunoglobulin G (IgG is characteristically and often markedly elevated, sometimes greater than 2 times ULN), and the presence of characteristic autoantibodies. The International Autoimmune Hepatitis Group (IAIHG) developed a simplified scoring system for diagnosis: 6 or more points from the combination of autoantibodies (ANA, ASMA, or anti-LKM1 titers), IgG level, liver histology (compatible with or typical for AIH), and absence of viral hepatitis markers.\n\nTreatment is immunosuppressive and induces remission in approximately 80% of patients. Standard induction therapy consists of prednisone (or prednisolone) with or without azathioprine. Prednisone is initiated at 0.5 to 1 mg/kg/day (typically 40 to 60 mg/day) and tapered over 4 to 8 weeks to a maintenance dose of 5 to 10 mg/day. Azathioprine is added as a steroid-sparing agent at 1 to 2 mg/kg/day after confirming normal thiopurine methyltransferase (TPMT) enzyme activity (TPMT deficiency increases risk of life-threatening myelosuppression). The combination of prednisone plus azathioprine allows lower steroid doses, reducing steroid-related side effects. Biochemical remission is defined as normalization of transaminases and IgG levels, and histological remission requires resolution of interface hepatitis on biopsy. Treatment withdrawal is considered only after at least 2 years of sustained biochemical remission, but relapse rates after discontinuation are high (50 to 87%), and many patients require lifelong maintenance therapy. Budesonide (a topically active corticosteroid with 90% first-pass hepatic metabolism) can be used instead of prednisone in non-cirrhotic patients to reduce systemic steroid side effects. Mycophenolate mofetil is used as a second-line agent for azathioprine-intolerant patients. Liver transplantation is indicated for acute liver failure unresponsive to immunosuppression or decompensated cirrhosis; AIH recurs in the transplanted liver in 20 to 40% of cases."
    },
    riskFactors: [
      "Female sex (3.6:1 female to male ratio, estrogen may modulate immune tolerance)",
      "Genetic susceptibility: HLA-DR3 (DRB1*0301) and HLA-DR4 (DRB1*0401) haplotypes",
      "Concurrent autoimmune diseases: thyroiditis, ulcerative colitis, rheumatoid arthritis, Sjogren syndrome, type 1 diabetes, celiac disease",
      "Family history of autoimmune diseases (genetic predisposition to immune dysregulation)",
      "Drug-induced triggers: minocycline, nitrofurantoin, statins, TNF-alpha inhibitors (infliximab) can trigger AIH or AIH-like syndrome",
      "Bimodal age distribution: first peak in adolescence/young adulthood, second peak ages 40 to 60",
      "Environmental triggers: viral infections (hepatitis A, EBV, measles) may initiate molecular mimicry in genetically susceptible individuals"
    ],
    diagnostics: [
      "Serum aminotransferases (AST, ALT): typically elevated 5 to 10 times ULN during flares; ALT predominant; may fluctuate with periods of apparent spontaneous improvement",
      "Autoantibody panel: ANA (antinuclear antibody), ASMA (anti-smooth muscle antibody targeting F-actin), anti-LKM1 (anti-liver kidney microsomal antibody targeting CYP2D6); titers 1:40 or greater are significant",
      "Serum immunoglobulin G (IgG): characteristically elevated, often greater than 1.5 to 2 times ULN; useful for monitoring treatment response and disease activity",
      "Liver biopsy: essential for diagnosis confirmation showing interface hepatitis with lymphoplasmacytic infiltration, plasma cell predominance, hepatocyte rosettes, emperipolesis; also stages fibrosis (Ishak or METAVIR scoring)",
      "Viral hepatitis serology: hepatitis A IgM, hepatitis B surface antigen and core antibody, hepatitis C antibody to exclude viral etiologies (AIH is a diagnosis of exclusion for viral causes)",
      "TPMT (thiopurine methyltransferase) genotype or enzyme activity BEFORE initiating azathioprine: TPMT deficiency affects 0.3% of population and causes life-threatening myelosuppression"
    ],
    management: [
      "Induction therapy: prednisone 0.5 to 1 mg/kg/day (typically 40 to 60 mg) with gradual taper over 4 to 8 weeks to maintenance dose of 5 to 10 mg/day; or budesonide 9 mg/day (non-cirrhotic patients only) with taper to 3 to 6 mg/day",
      "Azathioprine (steroid-sparing agent): initiated at 50 mg/day and increased to 1 to 2 mg/kg/day based on tolerance; MUST check TPMT activity before starting; allows lower prednisone maintenance doses",
      "Monitor biochemical response: serial AST, ALT, IgG levels every 2 to 4 weeks during induction, then every 3 to 6 months during maintenance; goal is complete normalization of transaminases and IgG",
      "Second-line agents for azathioprine intolerance: mycophenolate mofetil 1 to 2 grams/day; tacrolimus or cyclosporine for refractory disease",
      "Treatment withdrawal consideration: only after minimum 2 years of sustained biochemical and histological remission; requires liver biopsy showing resolution of interface hepatitis; relapse rate 50 to 87% after withdrawal",
      "Cirrhosis management: standard cirrhosis care (hepatocellular carcinoma screening with ultrasound every 6 months, variceal screening with EGD, bone density monitoring for steroid-induced osteoporosis)",
      "Liver transplant evaluation for acute liver failure unresponsive to immunosuppression, decompensated cirrhosis, or hepatocellular carcinoma; AIH recurs in graft in 20 to 40%"
    ],
    nursingActions: [
      "Monitor liver function tests (AST, ALT, alkaline phosphatase, bilirubin, albumin, INR) and IgG levels per provider-ordered schedule; trending transaminases and IgG is the primary method of assessing treatment response; rising values may indicate disease flare, non-adherence, or inadequate immunosuppression",
      "Assess for signs of corticosteroid side effects during induction therapy: Cushingoid appearance (moon face, buffalo hump, central obesity, striae), hyperglycemia (check blood glucose before meals and at bedtime), hypertension (monitor blood pressure at each visit), mood changes (insomnia, irritability, psychosis), and infection risk (educate to report fever, sore throat, or wounds that do not heal)",
      "Monitor complete blood count every 1 to 2 weeks after initiating or changing azathioprine dose to detect myelosuppression: leukopenia (WBC less than 3,500), neutropenia (ANC less than 1,500), thrombocytopenia (platelets less than 100,000), macrocytic anemia; hold azathioprine and notify provider immediately for significant cytopenias",
      "Assess for signs of hepatic decompensation at each encounter: jaundice (worsening scleral icterus or skin yellowing), ascites (abdominal girth measurement, shifting dullness), hepatic encephalopathy (asterixis, confusion, reversed sleep-wake cycle), variceal bleeding (hematemesis, melena), and coagulopathy (easy bruising, prolonged bleeding)",
      "Educate about lifelong medication adherence: explain that AIH is a chronic disease requiring long-term immunosuppression; abrupt discontinuation of steroids or azathioprine causes disease flare and potential liver failure; patients must not stop medications without provider guidance; carry medical identification listing immunosuppressive medications",
      "Coordinate bone density monitoring (DEXA scan) at baseline and annually for patients on long-term corticosteroids; administer calcium and vitamin D supplementation as prescribed; assess for osteoporotic fracture risk especially in postmenopausal women",
      "Screen for concurrent autoimmune conditions at diagnosis and annually: thyroid function tests (thyroiditis), celiac antibodies, and review of systems for arthralgias (rheumatoid arthritis), dry eyes/mouth (Sjogren syndrome), and bloody diarrhea (ulcerative colitis)"
    ],
    assessmentFindings: [
      "Fatigue (most common symptom, often debilitating and disproportionate to biochemical disease activity)",
      "Jaundice and scleral icterus (present in 50% at diagnosis, more common in acute presentations)",
      "Right upper quadrant discomfort or fullness from hepatomegaly",
      "Arthralgias without joint deformity (common extra-hepatic manifestation)",
      "Spider angiomata, palmar erythema, and other stigmata of chronic liver disease if cirrhosis has developed",
      "Laboratory: elevated AST and ALT (5 to 10 times ULN), elevated IgG, positive ANA and/or ASMA (Type 1) or anti-LKM1 (Type 2)"
    ],
    signs: {
      left: [
        "Asymptomatic elevated transaminases on routine labs",
        "Mild fatigue and arthralgias",
        "Mildly elevated IgG with low-titer autoantibodies",
        "Hepatomegaly on examination without jaundice",
        "Fluctuating transaminases with periods of apparent improvement"
      ],
      right: [
        "Acute liver failure with coagulopathy (INR greater than 1.5) and encephalopathy",
        "Decompensated cirrhosis with variceal bleeding",
        "Severe jaundice with bilirubin greater than 10 mg/dL",
        "Azathioprine-induced pancytopenia requiring drug discontinuation",
        "Steroid-resistant disease requiring escalation to second-line immunosuppression"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic Corticosteroid (Glucocorticoid)",
        action: "Binds intracellular glucocorticoid receptors, translocates to the nucleus, and modulates gene transcription: suppresses proinflammatory cytokines (IL-1, IL-6, TNF-alpha), inhibits NF-kB pathway, induces T-lymphocyte apoptosis, and reduces hepatocyte-directed immune attack in AIH; rapidly reduces transaminase levels in most patients",
        sideEffects: "Weight gain and Cushingoid features, hyperglycemia and steroid-induced diabetes, hypertension, osteoporosis and avascular necrosis, cataracts and glaucoma, mood changes (insomnia, psychosis, depression), immunosuppression with infection susceptibility, peptic ulcer disease, adrenal suppression with prolonged use, skin thinning and easy bruising",
        contra: "Active systemic fungal infection, live vaccine administration; relative: uncontrolled diabetes, active peptic ulcer, uncontrolled hypertension, severe osteoporosis, psychotic disorders; must taper gradually after prolonged use to prevent adrenal crisis",
        pearl: "Prednisone is activated by hepatic conversion to prednisolone; in severe liver disease or cirrhosis, use prednisolone directly to bypass this activation step; the combination of prednisone plus azathioprine allows lower steroid doses (maintenance 5 to 10 mg) reducing long-term side effects; NEVER abruptly discontinue after more than 2 weeks of use due to adrenal suppression risk"
      },
      {
        name: "Azathioprine",
        type: "Purine Antimetabolite (Immunosuppressant)",
        action: "Prodrug converted to 6-mercaptopurine (6-MP) which is further metabolized to thioguanine nucleotides (TGNs) that incorporate into DNA, inhibiting purine synthesis and suppressing T and B lymphocyte proliferation; serves as steroid-sparing agent allowing lower corticosteroid doses in AIH maintenance therapy",
        sideEffects: "Myelosuppression (leukopenia, thrombocytopenia, anemia - dose-dependent and potentially life-threatening with TPMT deficiency), nausea and vomiting (common, dose-related), hepatotoxicity, pancreatitis (idiosyncratic, occurs early), increased infection risk, increased long-term malignancy risk (lymphoma, skin cancer with UV exposure)",
        contra: "TPMT deficiency (homozygous - absolute contraindication; heterozygous - requires dose reduction); pregnancy (Category D - teratogenic); concurrent allopurinol use (inhibits xanthine oxidase, markedly increasing 6-MP levels and toxicity - reduce azathioprine dose by 75% if unavoidable); severe hepatic impairment",
        pearl: "ALWAYS check TPMT genotype or enzyme activity BEFORE starting azathioprine: 0.3% of population is homozygous deficient (fatal pancytopenia risk), 11% are heterozygous (require 50% dose reduction); monitor CBC every 1 to 2 weeks for first 3 months, then monthly; onset of therapeutic effect takes 3 to 6 months; pancreatitis is an idiosyncratic reaction occurring in 2 to 5% and is a contraindication to rechallenge"
      },
      {
        name: "Mycophenolate Mofetil",
        type: "Inosine Monophosphate Dehydrogenase (IMPDH) Inhibitor",
        action: "Prodrug hydrolyzed to mycophenolic acid (MPA), which selectively and reversibly inhibits inosine monophosphate dehydrogenase (IMPDH), the rate-limiting enzyme in de novo purine synthesis in lymphocytes; T and B lymphocytes are uniquely dependent on this pathway (unlike other cells that use salvage pathways), providing selective immunosuppression",
        sideEffects: "Gastrointestinal (diarrhea, nausea, vomiting - most common and dose-limiting), leukopenia and anemia, increased infection risk (CMV, BK virus, opportunistic infections), teratogenicity (Category D - requires effective contraception), progressive multifocal leukoencephalopathy (rare, JC virus)",
        contra: "Pregnancy or planned pregnancy (potent teratogen causing first-trimester loss, congenital anomalies including cleft lip and palate, limb and cardiac defects - requires two negative pregnancy tests before starting and effective contraception throughout therapy); hypersensitivity to mycophenolate or mycophenolic acid; severe active GI disease (worsens diarrhea)",
        pearl: "Second-line agent for AIH patients intolerant of azathioprine (pancreatitis, severe GI symptoms, myelosuppression); dose 1 to 2 grams/day divided twice daily; take on empty stomach for optimal absorption; monitor CBC every 2 weeks for first 3 months, then monthly; effective contraception is MANDATORY for women of childbearing potential - pregnancy must be avoided for 6 weeks after discontinuation"
      }
    ],
    pearls: [
      "AIH should be considered in any patient with unexplained elevation of transaminases, regardless of age, sex, or alcohol use; it is a diagnosis that is frequently delayed because it mimics viral hepatitis, drug-induced liver injury, and alcoholic hepatitis",
      "Up to 30% of AIH patients already have cirrhosis at diagnosis, indicating that the disease can progress silently for years with minimal symptoms; the lesson is that fatigue and mildly elevated liver enzymes always warrant investigation",
      "TPMT testing before azathioprine initiation is a patient safety imperative, not optional: 1 in 300 patients is homozygous TPMT deficient and will develop fatal pancytopenia without dose modification; 11% are heterozygous and require 50% dose reduction",
      "Prednisone must never be abruptly discontinued after more than 2 weeks of therapy due to hypothalamic-pituitary-adrenal (HPA) axis suppression; adrenal crisis presents with acute hypotension, hypoglycemia, hyponatremia, and cardiovascular collapse",
      "The combination of prednisone plus azathioprine is superior to prednisone alone for AIH: the steroid-sparing effect of azathioprine allows maintenance prednisone doses of 5 to 10 mg daily, dramatically reducing long-term steroid toxicity (osteoporosis, diabetes, Cushing features)",
      "Treatment withdrawal is risky: relapse occurs in 50 to 87% of patients after stopping immunosuppression, even after years of biochemical remission; most patients require lifelong low-dose maintenance therapy",
      "AIH can present as acute liver failure requiring emergency transplant evaluation; the modified IAIHG criteria recognize this acute severe presentation and recommend a trial of corticosteroids with early transplant referral if no improvement within 7 to 14 days"
    ],
    quiz: [
      {
        question: "A nurse is reviewing orders for a patient newly diagnosed with AIH who is about to start azathioprine. Which test result must the nurse verify before administering the first dose?",
        options: [
          "Serum iron and ferritin levels",
          "TPMT (thiopurine methyltransferase) genotype or enzyme activity",
          "Hemoglobin A1c level",
          "Serum potassium and magnesium levels"
        ],
        correct: 1,
        rationale: "TPMT testing is mandatory before azathioprine initiation. TPMT metabolizes azathioprine's active metabolites; deficiency (0.3% homozygous, 11% heterozygous) causes accumulation of cytotoxic thioguanine nucleotides, leading to life-threatening myelosuppression. Homozygous deficient patients should never receive azathioprine. Heterozygous patients require 50% dose reduction. This is a critical patient safety checkpoint."
      },
      {
        question: "A patient with AIH on prednisone 40 mg daily for 3 weeks tells the nurse they feel much better and want to stop the medication. What is the appropriate nursing response?",
        options: [
          "Agree that feeling better indicates the disease is cured and support medication discontinuation",
          "Educate that prednisone cannot be stopped abruptly after more than 2 weeks due to adrenal suppression risk, and that AIH requires long-term immunosuppression with a gradual steroid taper",
          "Reduce the prednisone dose by half immediately and stop after 2 more days",
          "Switch to an over-the-counter anti-inflammatory medication instead"
        ],
        correct: 1,
        rationale: "Prednisone after more than 2 weeks of use suppresses the HPA axis, and abrupt discontinuation can cause adrenal crisis (acute hypotension, hypoglycemia, cardiovascular collapse). Additionally, AIH requires long-term immunosuppression; stopping steroids without bridging to a steroid-sparing agent (azathioprine) causes disease relapse in 50 to 87% of cases. The nurse must educate that treatment requires gradual taper under medical supervision."
      },
      {
        question: "A patient with AIH on azathioprine has a CBC showing WBC 2,800 with ANC 1,200 and platelets 85,000. What is the priority nursing action?",
        options: [
          "Document the results and recheck in 1 month",
          "Hold azathioprine immediately, implement neutropenic precautions, and notify the provider of significant cytopenias",
          "Administer a dose of filgrastim to boost the WBC count",
          "Increase the azathioprine dose to suppress the autoimmune response more effectively"
        ],
        correct: 1,
        rationale: "Leukopenia (WBC 2,800), neutropenia (ANC 1,200), and thrombocytopenia (85,000) indicate azathioprine-induced myelosuppression, a serious and potentially life-threatening side effect. The priority is to hold the drug immediately, implement neutropenic precautions (infection prevention), and notify the provider. The dose may need to be reduced or the drug discontinued. Continuing or increasing the dose could cause fatal pancytopenia."
      }
    ]
  },

  "ballard-score-rn": {
    title: "Ballard Maturational Assessment (Gestational Age)",
    cellular: {
      title: "Developmental Embryology and Neonatal Maturation Assessment",
      content: "The Ballard Maturational Assessment (also known as the New Ballard Score) is a standardized clinical tool used to estimate gestational age of newborns from 20 to 44 weeks based on external physical characteristics and neuromuscular maturity criteria. This assessment is critical for the RN because gestational age determines appropriate growth parameters, anticipatory guidance, and the identification of complications specific to preterm, term, or post-term infants. The Ballard score is most accurate when performed within the first 12 to 48 hours of life.\n\nThe developmental embryology underlying the Ballard score reflects the progressive maturation of organ systems that follows a predictable timetable during fetal development. Each physical and neuromuscular criterion evaluated in the Ballard score corresponds to specific developmental processes occurring at defined gestational ages.\n\nSkin maturity progresses from extremely transparent and gelatinous in the previable fetus (20 to 24 weeks) to opaque with superficial peeling and desquamation in the post-term infant (greater than 42 weeks). At 24 to 28 weeks, the skin is thin and translucent with visible veins due to minimal subcutaneous fat deposition (only 1% body fat at 24 weeks compared to 15% at term). The epidermis has few layers with a poorly developed stratum corneum, making the skin highly permeable to water loss (transepidermal water loss at 24 weeks is 60 g/m2/hour compared to 6 to 8 g/m2/hour at term). As gestation advances, the epidermis thickens, the stratum corneum keratinizes, subcutaneous fat accumulates, and vernix caseosa (a protective lipid-rich coating produced by sebaceous glands beginning at 20 weeks) covers the skin surface. By 36 to 38 weeks, the skin appears smooth and opaque with good turgor. Post-term skin shows desquamation, deep cracking, and a leathery appearance from loss of vernix and prolonged amniotic fluid exposure.\n\nLanugo is the fine, soft, unpigmented hair that first appears at 16 to 20 weeks of gestation, covering the entire fetal body by 24 to 28 weeks. Lanugo begins to thin at 28 to 32 weeks starting from the face and anterior trunk, progressing toward the extremities and back. By 36 weeks, lanugo is largely absent except on the shoulders and upper back. The presence and distribution of lanugo provides a reliable gestational age indicator.\n\nPlantar surface creases develop from the anterior (toe) portion of the sole progressing toward the heel. At less than 32 weeks, the soles are smooth with no creases. By 34 to 36 weeks, anterior transverse creases appear in the anterior one-third to two-thirds of the sole. At term (37 to 40 weeks), creases cover the entire sole including the heel. This progression reflects the maturation of the plantar epidermis and the effects of weight-bearing pressure on the foot in utero.\n\nBreast tissue maturity correlates with gestational age. At 24 to 28 weeks, the breast bud is imperceptible with a flat areola. At 30 to 34 weeks, the areola becomes raised and a small breast bud (1 to 2 mm) may be palpable. At 36 to 38 weeks, the areola is raised with a 3 to 4 mm breast bud. At term, the areola is full with a well-defined breast bud of 5 to 10 mm. The breast bud size reflects adipose tissue deposition and hormonal influences (maternal estrogen stimulating mammary tissue development).\n\nEar cartilage maturation follows a predictable sequence. At 24 to 28 weeks, the pinna is flat, soft, and pliable with minimal cartilage; when folded, it remains folded (poor recoil). By 32 to 34 weeks, cartilage begins to stiffen and the ear slowly unfolds when released. At 36 weeks, the pinna has good cartilage with instant recoil to the unfolded position. At term, the ear is firm with well-defined cartilage and thick pinna that immediately returns to the normal position when folded and released. Ear recoil is a quick and reliable bedside assessment of maturity.\n\nGenital maturity: In males, the testes descend from the abdominal cavity into the inguinal canal at 28 to 32 weeks and into the scrotum by 34 to 36 weeks. At term, testes are fully descended with deep scrotal rugae. In females, the clitoris and labia minora are prominent at 24 to 28 weeks because the labia majora (which are composed primarily of fat) have not yet developed. By 36 to 38 weeks, the labia majora enlarge and begin to cover the clitoris and labia minora. At term, the labia majora completely cover the labia minora and clitoris.\n\nNeuromuscular maturity criteria reflect the caudal-to-cephalic progression of muscle tone development (tone develops first in the lower extremities, then progresses to the upper extremities and finally the trunk). Posture progresses from full extension (hypotonia) at 24 to 28 weeks to full flexion at term. Square window angle (degree of wrist flexion when the hand is flexed toward the ventral forearm) decreases from 90 degrees at 28 weeks to 0 degrees at term. Arm recoil (the degree to which the forearm springs back after being fully extended) is absent at 28 weeks and brisk at term. Popliteal angle (the angle behind the knee when the thigh is flexed against the abdomen and the lower leg is extended) decreases from 180 degrees at 26 weeks to 90 degrees or less at term. Scarf sign (how far the elbow crosses the midline when the hand is pulled across the chest) indicates increasing resistance with maturity. Heel-to-ear maneuver (how close the foot can be brought to the ear) shows decreasing range with increasing gestational age due to progressive increase in muscle tone.\n\nThe total Ballard score is calculated by summing the physical maturity score (maximum 25 points from 6 physical criteria each scored -1 to 5) and neuromuscular maturity score (maximum 25 points from 6 neuromuscular criteria each scored -1 to 5). The total score (range -10 to 50) corresponds to a gestational age estimate with an accuracy of plus or minus 2 weeks. The assessment should be performed within 12 to 48 hours of birth for maximum accuracy; after 48 hours, extrauterine adaptations alter the neuromuscular examination."
    },
    riskFactors: [
      "Preterm birth (less than 37 weeks, all complications of prematurity correlate with gestational age determined by Ballard)",
      "Unknown or uncertain last menstrual period (LMP) requiring clinical gestational age estimation",
      "Discrepancy between prenatal ultrasound dating and clinical assessment (may indicate IUGR or macrosomia)",
      "Maternal conditions affecting fetal maturation: diabetes (may accelerate some physical features but not neuromuscular), preeclampsia (may cause IUGR), substance use (may alter growth parameters)",
      "Post-term pregnancy (greater than 42 weeks, showing post-maturity signs on Ballard assessment)",
      "Multiple gestation (twins/triplets often have discordant growth requiring individual gestational age assessment)",
      "Late or no prenatal care (no ultrasound dating available, making clinical assessment the only dating method)"
    ],
    diagnostics: [
      "New Ballard Score: 12-criteria assessment (6 physical maturity + 6 neuromuscular maturity) performed within 12 to 48 hours of birth; total score -10 to 50 correlates with gestational age 20 to 44 weeks",
      "Physical maturity criteria: skin texture, lanugo distribution, plantar surface creases, breast bud size, ear/eye characteristics, genital development; each scored -1 to 5",
      "Neuromuscular maturity criteria: posture, square window angle, arm recoil, popliteal angle, scarf sign, heel-to-ear maneuver; each scored -1 to 5",
      "Growth parameters plotted on gestational age growth chart (Fenton or Olsen): weight, length, and head circumference classified as SGA (less than 10th percentile), AGA (10th to 90th percentile), or LGA (greater than 90th percentile)",
      "Comparison with prenatal ultrasound dating and last menstrual period calculation; discrepancies greater than 2 weeks warrant further evaluation for growth abnormalities",
      "Anterior lens capsule vascular assessment (if available): the tunica vasculosa lentis degenerates predictably between 27 and 34 weeks and can supplement the Ballard assessment in very preterm infants"
    ],
    management: [
      "Perform Ballard assessment within 12 to 48 hours of birth for optimal accuracy; document total score and corresponding gestational age estimate",
      "Plot weight, length, and head circumference on gestational age-specific growth charts to classify as SGA, AGA, or LGA; each classification carries specific risk profiles requiring targeted interventions",
      "For preterm infants (less than 37 weeks): implement gestational-age-appropriate care including thermoregulation (kangaroo care, radiant warmer, incubator), respiratory support (surfactant readiness, CPAP), glucose monitoring (risk of hypoglycemia), feeding support (gavage feeding if unable to coordinate suck-swallow-breathe before 34 weeks)",
      "For SGA infants: monitor blood glucose every 1 to 2 hours for first 12 hours (high risk of hypoglycemia from depleted glycogen stores), assess for polycythemia, and screen for congenital infections (TORCH screen)",
      "For LGA infants: assess for birth injuries (shoulder dystocia, brachial plexus injury, clavicle fracture), monitor blood glucose (hypoglycemia from hyperinsulinism if maternal diabetes), assess for hyperbilirubinemia",
      "For post-term infants (greater than 42 weeks): monitor for meconium aspiration syndrome, hypoglycemia (depleted glycogen stores), polycythemia, and temperature instability",
      "Communicate gestational age findings to the care team and family; ensure appropriate level of care (NICU, special care nursery, or well-baby nursery) based on gestational age and clinical status"
    ],
    nursingActions: [
      "Perform the New Ballard Score systematically within 12 to 48 hours of birth: assess all 6 physical maturity criteria (skin, lanugo, plantar surface, breast, eye/ear, genitals) and 6 neuromuscular criteria (posture, square window, arm recoil, popliteal angle, scarf sign, heel-to-ear) using the standardized scoring sheet; total the scores and convert to estimated gestational age using the reference table",
      "Assess ear recoil as a rapid bedside maturity indicator: fold the ear pinna flat against the head and release; in preterm infants (less than 32 weeks), the ear remains folded or slowly unfolds; in term infants, the ear immediately springs back to the upright position due to well-developed cartilage",
      "Evaluate plantar creases under good lighting: differentiate true creases (which persist with skin stretching) from superficial lines (which disappear when the skin is stretched); in extremely preterm infants, measure foot length (less than 40 mm indicates less than 26 weeks) since creases may not have developed",
      "Document gestational age assessment findings completely: individual scores for each criterion, total physical maturity score, total neuromuscular maturity score, combined total score, and corresponding gestational age; compare with prenatal dating and note any discrepancy greater than 2 weeks",
      "Implement thermoregulation immediately for preterm infants identified by Ballard assessment: preterm infants have large surface area relative to body weight, minimal subcutaneous fat, immature skin barrier, and inability to generate heat through shivering; maintain neutral thermal environment (axillary temperature 36.5 to 37.5 degrees C); use plastic wrap for extremely preterm infants (less than 28 weeks) to reduce evaporative heat loss",
      "Initiate gestational age-appropriate feeding: infants less than 34 weeks typically cannot coordinate suck-swallow-breathe and require gavage (OG or NG) feeding; assess feeding readiness signs (rooting, sucking on fingers, alertness) before attempting oral feeds; colostrum should be offered within the first hour for term infants",
      "Educate parents about their infant's gestational age and what it means for their baby's care plan: explain the difference between chronological age and corrected gestational age for developmental milestones; reassure that preterm infants reach milestones based on corrected age, not birth date"
    ],
    assessmentFindings: [
      "Preterm physical findings: thin translucent skin with visible veins, abundant lanugo, smooth soles without creases, flat areola with imperceptible breast bud, soft pinna with poor recoil, prominent clitoris/labia minora (females) or undescended testes (males)",
      "Term physical findings: opaque cracking skin, no lanugo, creases over entire sole, raised areola with 3 to 4 mm breast bud, well-formed firm pinna with instant recoil, labia majora covering minora (females) or descended testes with deep rugae (males)",
      "Preterm neuromuscular findings: extended posture (hypotonia), square window 60 to 90 degrees, minimal arm recoil, popliteal angle 160 to 180 degrees, elbow passes midline on scarf sign, heel reaches ear easily",
      "Term neuromuscular findings: flexed posture with good tone, square window 0 degrees, brisk arm recoil, popliteal angle 90 degrees or less, elbow does not reach midline on scarf sign, heel cannot reach ear",
      "Post-term findings: leathery cracked peeling skin with deep creases, no lanugo, wide plantar creases, well-developed breast tissue, very firm ear cartilage, mature genitalia",
      "Discordant findings (physical vs neuromuscular) may indicate pathology: neurological depression, birth asphyxia, medication effects, or neuromuscular disease"
    ],
    signs: {
      left: [
        "Term infant with Ballard score consistent with prenatal dating",
        "Well-developed reflexes and flexed posture",
        "Age-appropriate growth parameters (AGA on growth chart)",
        "Normal skin with appropriate vernix distribution",
        "Mature feeding reflexes (coordinated suck-swallow-breathe)"
      ],
      right: [
        "Extremely preterm (less than 28 weeks) with transparent skin and fused eyelids",
        "Significant discrepancy between Ballard and prenatal dating (greater than 3 weeks)",
        "SGA classification with risk of hypoglycemia, polycythemia, hypothermia",
        "Hypotonia disproportionate to gestational age (may indicate neurological insult)",
        "Post-term with meconium-stained amniotic fluid and peeling skin (aspiration risk)"
      ]
    },
    medications: [
      {
        name: "Beractant (Survanta)",
        type: "Exogenous Pulmonary Surfactant (Natural Bovine)",
        action: "Replaces deficient endogenous surfactant in preterm lungs; reduces alveolar surface tension at the air-liquid interface during expiration, preventing alveolar collapse (atelectasis); type II pneumocytes begin producing surfactant at 24 to 28 weeks but adequate amounts are not present until 34 to 36 weeks",
        sideEffects: "Transient bradycardia and oxygen desaturation during instillation (from brief airway obstruction by the liquid surfactant), pulmonary hemorrhage (rare), tube obstruction during administration, rapid improvement in compliance may require immediate ventilator adjustment to prevent pneumothorax from overdistension",
        contra: "Known hypersensitivity to bovine proteins; use with caution in infants with active pulmonary hemorrhage; not indicated for term infants with respiratory distress from non-surfactant-deficient causes",
        pearl: "Administered via endotracheal tube in 4 aliquots with repositioning between doses (right lateral, left lateral, slight Trendelenburg) to ensure distribution to all lung segments; do NOT suction the ETT for at least 1 hour after instillation to allow surfactant distribution; rapid compliance improvement after surfactant requires immediate ventilator adjustment (reduce PIP and FiO2) to prevent pneumothorax and oxygen toxicity"
      },
      {
        name: "Caffeine Citrate",
        type: "Methylxanthine (Central Respiratory Stimulant)",
        action: "Blocks adenosine receptors in the brainstem respiratory center, increasing central respiratory drive, chemoreceptor sensitivity to CO2, and diaphragmatic contractility; reduces apnea of prematurity which results from immature brainstem respiratory control in preterm infants less than 34 to 36 weeks",
        sideEffects: "Tachycardia, feeding intolerance (GI irritation, increased gastric residuals), jitteriness, irritability, seizures (at toxic levels), diuresis, hyperglycemia",
        contra: "Known hypersensitivity; use cautiously in seizure disorders, significant cardiac arrhythmias, and NEC (may worsen GI symptoms); monitor caffeine levels if renal function is impaired",
        pearl: "Loading dose 20 mg/kg IV over 30 minutes, maintenance 5 to 10 mg/kg/day IV or PO starting 24 hours after loading dose; therapeutic level 5 to 25 mcg/mL; caffeine has the added benefit of reducing rates of bronchopulmonary dysplasia (BPD) in preterm infants treated early; continue until the infant is 33 to 35 weeks corrected gestational age and has been apnea-free for 5 to 7 days"
      },
      {
        name: "Dextrose 10% (D10W)",
        type: "Glucose Solution (Metabolic Support)",
        action: "Provides exogenous glucose to maintain euglycemia in neonates at risk for hypoglycemia; preterm and SGA infants have limited glycogen stores, impaired gluconeogenesis, and high metabolic demands relative to body weight, making them dependent on continuous glucose supply",
        sideEffects: "Hyperglycemia (monitor blood glucose, risk of osmotic diuresis and intraventricular hemorrhage in preterm infants), IV infiltration causing tissue injury, rebound hypoglycemia if infusion is abruptly discontinued, fluid overload",
        contra: "Hyperglycemia (blood glucose greater than 200 mg/dL); D10W is the maximum concentration for peripheral IV in neonates (higher concentrations require central line to prevent phlebitis and extravasation injury)",
        pearl: "Neonatal hypoglycemia (less than 45 mg/dL in first 48 hours, less than 50 mg/dL after 48 hours) requires treatment: for symptomatic hypoglycemia, D10W 2 mL/kg IV bolus over 5 to 10 minutes followed by continuous D10W infusion at glucose infusion rate (GIR) of 4 to 6 mg/kg/min; never use D25W or D50W in neonates (hyperosmolar solutions cause sclerosing of small veins and risk of cerebral edema); monitor point-of-care glucose every 30 to 60 minutes until stable"
      }
    ],
    pearls: [
      "The Ballard score is most accurate when performed between 12 and 48 hours of life; assessment before 12 hours may underestimate gestational age (neuromuscular tone is transiently depressed after birth), and after 48 hours, extrauterine adaptation alters physical and neuromuscular features",
      "Ear recoil is one of the most rapid and reliable bedside indicators of gestational maturity: a pinna that stays folded suggests less than 32 weeks, slow recoil suggests 32 to 36 weeks, and immediate spring-back indicates 36 or more weeks",
      "In extremely preterm infants (less than 26 weeks), plantar creases may not yet exist; in these cases, measure the foot length: a sole length less than 40 mm suggests less than 26 weeks gestational age",
      "Neuromuscular tone develops in a caudal-to-cephalic direction: lower extremity tone matures before upper extremity tone, which matures before trunk tone; this is why popliteal angle and heel-to-ear tests are more sensitive for early gestational age differences than scarf sign or square window",
      "SGA infants may appear more neurologically mature than their gestational age because chronic intrauterine stress accelerates brain maturation; their physical maturity score may underestimate gestational age while neuromuscular score may overestimate it",
      "A discrepancy of more than 2 weeks between Ballard estimated gestational age and prenatal ultrasound dating warrants investigation for growth restriction (SGA) or macrosomia (LGA) and their associated complications",
      "The transition from fetal to neonatal life is a critical period: the Ballard assessment helps determine the level of respiratory, metabolic, and thermoregulatory support needed based on the maturity of these organ systems at the estimated gestational age"
    ],
    quiz: [
      {
        question: "A nurse is performing a Ballard assessment on a newborn and finds: translucent skin with visible veins, abundant lanugo, smooth soles, flat areola with no breast bud, soft pinna with no recoil, and extended posture with popliteal angle of 160 degrees. What is the most likely gestational age estimate?",
        options: [
          "24 to 28 weeks (extremely preterm)",
          "33 to 36 weeks (moderate/late preterm)",
          "37 to 40 weeks (term)",
          "Greater than 42 weeks (post-term)"
        ],
        correct: 0,
        rationale: "All findings indicate extreme prematurity (24 to 28 weeks): translucent skin with visible veins (minimal subcutaneous fat), abundant lanugo (present from 20 to 28 weeks before thinning), smooth soles (creases develop after 32 weeks), no breast tissue (develops after 30 weeks), poor ear recoil (cartilage develops after 32 weeks), and extended posture with wide popliteal angle (flexion tone develops after 28 to 30 weeks starting in lower extremities)."
      },
      {
        question: "A newborn's Ballard score estimates gestational age at 34 weeks, but prenatal ultrasound at 20 weeks estimated 37 weeks. The infant's weight is below the 10th percentile. What does this discrepancy suggest?",
        options: [
          "The Ballard score is inaccurate and should be repeated after 72 hours",
          "The prenatal ultrasound was performed incorrectly",
          "The infant may be small for gestational age (SGA) with the ultrasound dating being more accurate; assess for intrauterine growth restriction causes",
          "Both assessments are wrong and the true gestational age is somewhere in between"
        ],
        correct: 2,
        rationale: "A 20-week ultrasound is the gold standard for pregnancy dating (accuracy plus or minus 7 to 10 days). The Ballard score, with accuracy of plus or minus 2 weeks, may underestimate gestational age in SGA infants because physical features like skin thickness and breast development can be delayed by growth restriction. Weight below the 10th percentile confirms SGA classification. The nurse should assess for causes of IUGR and implement SGA-specific monitoring (hypoglycemia screening, polycythemia screening)."
      },
      {
        question: "While performing a Ballard assessment, the nurse folds the newborn's ear pinna flat and releases it. The ear immediately snaps back to its normal upright position. What does this finding indicate about gestational maturity?",
        options: [
          "The infant is extremely preterm (less than 28 weeks)",
          "The infant is approximately 30 to 32 weeks with developing cartilage",
          "The infant is at least 36 weeks with well-developed ear cartilage indicating maturity",
          "Ear recoil is not a reliable indicator of gestational age"
        ],
        correct: 2,
        rationale: "Immediate ear recoil to the upright position indicates well-developed auricular cartilage, which occurs at 36 or more weeks of gestation. At less than 28 weeks, the ear stays folded (no cartilage). At 30 to 32 weeks, the ear slowly unfolds. At 34 to 36 weeks, there is moderate recoil. Immediate snap-back at 36+ weeks. Ear recoil is one of the quickest and most reliable bedside assessments of neonatal maturity."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone. Injected ${count}/${Object.keys(lessons).length} lessons.`);
