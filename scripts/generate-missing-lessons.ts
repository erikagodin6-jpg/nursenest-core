import fs from "fs";
import path from "path";

const MISSING_LESSONS: Record<string, { title: string; tier: string; examTarget: string }> = {
  "clinical-scenarios": { title: "Clinical Scenarios & Critical Thinking", tier: "rn", examTarget: "NCLEX-RN" },
  "cv-core-physiology-np": { title: "Cardiovascular Core Physiology", tier: "np", examTarget: "NP" },
  "delegation-core": { title: "Delegation & Prioritization Core", tier: "rn", examTarget: "NCLEX-RN" },
  "endocrine-np": { title: "Endocrine Disorders: NP Management", tier: "np", examTarget: "NP" },
  "exam-strategy-np": { title: "NP Exam Strategy & Test-Taking", tier: "np", examTarget: "NP" },
  "free-cardiovascular": { title: "Cardiovascular Essentials", tier: "free", examTarget: "NCLEX-RN" },
  "free-endocrine": { title: "Endocrine Essentials", tier: "free", examTarget: "NCLEX-RN" },
  "free-gi-renal": { title: "GI & Renal Essentials", tier: "free", examTarget: "NCLEX-RN" },
  "free-immune-infectious": { title: "Immune & Infectious Disease Essentials", tier: "free", examTarget: "NCLEX-RN" },
  "free-maternal": { title: "Maternal Health Essentials", tier: "free", examTarget: "NCLEX-RN" },
  "free-mental-health": { title: "Mental Health Essentials", tier: "free", examTarget: "NCLEX-RN" },
  "free-musculoskeletal": { title: "Musculoskeletal Essentials", tier: "free", examTarget: "NCLEX-RN" },
  "free-oncology": { title: "Oncology Essentials", tier: "free", examTarget: "NCLEX-RN" },
  "free-pharmacology": { title: "Pharmacology Essentials", tier: "free", examTarget: "NCLEX-RN" },
  "hematology-np": { title: "Hematology: NP Management", tier: "np", examTarget: "NP" },
  "heme-core-np": { title: "Hematologic Core Concepts", tier: "np", examTarget: "NP" },
  "infectious-disease-prescribing-np": { title: "Infectious Disease Prescribing", tier: "np", examTarget: "NP" },
  "maternity-np": { title: "Maternity & Reproductive Health: NP Management", tier: "np", examTarget: "NP" },
  "med-math-core": { title: "Medication Math & Dosage Calculations", tier: "rn", examTarget: "NCLEX-RN" },
  "mens-health-np": { title: "Men's Health: NP Management", tier: "np", examTarget: "NP" },
  "mens-health-rpn": { title: "Men's Health Fundamentals", tier: "rpn", examTarget: "RPN/LPN" },
  "musculoskeletal-rn": { title: "Musculoskeletal Disorders: RN Management", tier: "rn", examTarget: "NCLEX-RN" },
  "neonatal-np": { title: "Neonatal Care: NP Management", tier: "np", examTarget: "NP" },
  "neurological-np": { title: "Neurological Disorders: NP Management", tier: "np", examTarget: "NP" },
  "pediatrics-core-np": { title: "Pediatrics Core: NP Management", tier: "np", examTarget: "NP" },
  "professional-practice-rpn": { title: "Professional Practice & Standards", tier: "rpn", examTarget: "RPN/LPN" },
  "renal-gu-core-np": { title: "Renal & Genitourinary Core", tier: "np", examTarget: "NP" },
  "renal-np": { title: "Renal Disorders: NP Management", tier: "np", examTarget: "NP" },
  "toxicology-np": { title: "Toxicology: NP Management", tier: "np", examTarget: "NP" },
  "toxicology-rn": { title: "Toxicology: RN Management", tier: "rn", examTarget: "NCLEX-RN" },
  "womens-health-core-np": { title: "Women's Health Core: NP Management", tier: "np", examTarget: "NP" },
  "rn-acute-coronary-syndrome": { title: "Acute Coronary Syndrome", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-acute-lumbosacral-strain": { title: "Acute Lumbosacral Strain", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-acute-otitis-media": { title: "Acute Otitis Media", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-acute-rheumatic-fever": { title: "Acute Rheumatic Fever", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-addison-disease": { title: "Addison Disease", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-appendiceal-rupture": { title: "Appendiceal Rupture", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-aspiration": { title: "Aspiration", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-aspiration-pneumonia": { title: "Aspiration Pneumonia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-atrioventricular-canal-defect": { title: "Atrioventricular Canal Defect", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-botulism": { title: "Botulism", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-bronchiolitis": { title: "Bronchiolitis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-cardiac-dysrhythmias": { title: "Cardiac Dysrhythmias", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-chronic-bronchitis": { title: "Chronic Bronchitis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-chronic-obstructive-pulmonary-disease": { title: "Chronic Obstructive Pulmonary Disease", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-cleft-palate": { title: "Cleft Palate", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-conversion-disorder": { title: "Conversion Disorder", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-coronary-artery-aneurysm": { title: "Coronary Artery Aneurysm", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-cystic-fibrosis": { title: "Cystic Fibrosis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-emphysema": { title: "Emphysema", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-encopresis": { title: "Encopresis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-esophageal-atresia": { title: "Esophageal Atresia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-functional-fecal-incontinence": { title: "Functional Fecal Incontinence", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-gallstones": { title: "Gallstones (Cholelithiasis)", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hemophilia": { title: "Hemophilia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hemorrhage": { title: "Hemorrhage", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hepatitis-b": { title: "Hepatitis B", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hiatal-hernia": { title: "Hiatal Hernia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hyperhemolytic-crisis": { title: "Hyperhemolytic Crisis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hyperkalemia": { title: "Hyperkalemia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypertension": { title: "Hypertension", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypertensive-encephalopathy": { title: "Hypertensive Encephalopathy", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypertrophic-pyloric-stenosis": { title: "Hypertrophic Pyloric Stenosis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypocalcemia": { title: "Hypocalcemia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypoglycemia": { title: "Hypoglycemia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypokalemia": { title: "Hypokalemia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypomagnesemia": { title: "Hypomagnesemia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypoparathyroidism": { title: "Hypoparathyroidism", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypophosphatemia": { title: "Hypophosphatemia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-hypoxia": { title: "Hypoxia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-increased-intracranial-pressure": { title: "Increased Intracranial Pressure", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-inguinal-hernia": { title: "Inguinal Hernia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-ischemia": { title: "Ischemia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-lumbosacral-disc-herniation": { title: "Lumbosacral Disc Herniation", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-magnesium-toxicity": { title: "Magnesium Toxicity", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-mechanical-bowel-obstruction": { title: "Mechanical Bowel Obstruction", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-medication-extravasation": { title: "Medication Extravasation", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-menopause": { title: "Menopause", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-mitral-valve-insufficiency": { title: "Mitral Valve Insufficiency", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-mononucleosis": { title: "Mononucleosis (Epstein-Barr Virus)", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-morning-sickness": { title: "Morning Sickness (Hyperemesis Gravidarum)", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-neonatal-abstinence-syndrome": { title: "Neonatal Abstinence Syndrome", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-nephrotic-syndrome": { title: "Nephrotic Syndrome", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-newborn-hypoglycemia": { title: "Newborn Hypoglycemia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-paralytic-ileus": { title: "Paralytic Ileus", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-pericarditis": { title: "Pericarditis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-peritonitis": { title: "Peritonitis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-placental-abruption": { title: "Placental Abruption", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-pleurisy": { title: "Pleurisy", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-pulmonary-edema": { title: "Pulmonary Edema", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-pulmonary-stenosis": { title: "Pulmonary Stenosis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-respiratory-syncytial-virus-infection": { title: "Respiratory Syncytial Virus (RSV) Infection", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-right-ventricular-hypertrophy": { title: "Right Ventricular Hypertrophy", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-septic-arthritis": { title: "Septic Arthritis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-sequestration-crisis": { title: "Sequestration Crisis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-sickle-cell-disease": { title: "Sickle Cell Disease", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-streptococcal-infection": { title: "Streptococcal Infection (Group A Strep)", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-submersion-injury": { title: "Submersion Injury (Near Drowning)", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-sydenham-chorea": { title: "Sydenham Chorea", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-testicular-torsion": { title: "Testicular Torsion", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-thrombocytopenia": { title: "Thrombocytopenia", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-tracheoesophageal-fistula": { title: "Tracheoesophageal Fistula", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-uterine-rupture": { title: "Uterine Rupture", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-vaso-occlusive-crisis": { title: "Vaso-occlusive Crisis", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-ventricular-bigeminy": { title: "Ventricular Bigeminy", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-ventricular-septal-defect": { title: "Ventricular Septal Defect", tier: "rn", examTarget: "NCLEX-RN" },
  "rn-wilms-tumor": { title: "Wilms Tumor (Nephroblastoma)", tier: "rn", examTarget: "NCLEX-RN" },
};

async function generateLessonContent(id: string, info: { title: string; tier: string; examTarget: string }): Promise<string> {
  const { routeAIRequest } = await import("../server/ai-provider-router");
  
  const systemPrompt = `You are a senior nursing clinical educator creating high-yield exam-ready content for Canadian nursing students. Generate a JSON object with the EXACT structure shown below. All content must be clinically accurate, concise, and exam-focused. Use Canadian guidelines (CDA, RNAO) where applicable. Each field is required.

Output ONLY valid JSON matching this structure:
{
  "title": "string - condition/topic name",
  "cellular": { "title": "string - pathophysiology section title", "content": "string - detailed pathophysiology explanation, 150-300 words" },
  "riskFactors": ["string array - 6-8 specific risk factors"],
  "diagnostics": ["string array - 6-8 diagnostic tests/findings, written as nursing actions starting with verbs like 'Monitor', 'Expect', 'Assess'"],
  "management": ["string array - 6-8 management interventions, written as nursing actions"],
  "nursingActions": ["string array - 6-8 priority nursing actions with specific parameters"],
  "signs": { "left": ["4 early/mild signs"], "right": ["4 late/severe/emergency signs"] },
  "medications": [{ "name": "Drug Name", "type": "Drug Class", "action": "Mechanism", "sideEffects": "Key side effect", "contra": "Key contraindication", "pearl": "Clinical pearl" }],
  "pearls": ["string array - 3-4 high-yield exam pearls"],
  "quiz": [{ "question": "NCLEX-style question", "options": ["4 answer options"], "correct": 0, "rationale": "Explanation why correct answer is right and others wrong" }, { "question": "second question", "options": ["4 options"], "correct": 0, "rationale": "explanation" }]
}

IMPORTANT: medications array must have 2-4 entries. quiz array must have exactly 2 entries. Do not include any text outside the JSON object.`;

  const userPrompt = `Generate comprehensive ${info.examTarget} exam-ready lesson content for: "${info.title}"

Target audience: ${info.examTarget === "NP" ? "Nurse Practitioner students" : info.examTarget === "RPN/LPN" ? "Registered Practical Nurse / Licensed Practical Nurse students" : "Registered Nurse students preparing for NCLEX-RN"}

Focus on:
- Pathophysiology at the cellular/tissue level
- Priority nursing assessments and interventions
- Key medications with nursing considerations
- Signs and symptoms (early vs. late/emergency)
- NCLEX-style critical thinking questions
${info.examTarget === "NP" ? "- Include prescribing considerations, differential diagnosis, and advanced assessment" : ""}`;

  const result = await routeAIRequest(systemPrompt, userPrompt, {
    model: "gpt-4o-mini",
    maxTokens: 4096,
    temperature: 0.7,
    responseFormat: { type: "json_object" },
    taskType: "content",
    feature: "missing-lesson-generator",
  });

  return result.content || "{}";
}

function escapeForTS(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function jsonToTSLesson(id: string, data: any): string {
  const lines: string[] = [];
  lines.push(`  "${id}": {`);
  lines.push(`    title: "${escapeForTS(data.title || "")}",`);
  
  if (typeof data.cellular === "object" && data.cellular) {
    lines.push(`    cellular: { title: "${escapeForTS(data.cellular.title || "")}", content: "${escapeForTS(data.cellular.content || "")}" },`);
  } else {
    lines.push(`    cellular: "${escapeForTS(String(data.cellular || ""))}",`);
  }

  for (const field of ["riskFactors", "diagnostics", "management", "nursingActions", "pearls"]) {
    if (Array.isArray(data[field])) {
      lines.push(`    ${field}: [${data[field].map((s: string) => `"${escapeForTS(s)}"`).join(", ")}],`);
    }
  }

  if (data.signs) {
    if (data.signs.left && data.signs.right) {
      lines.push(`    signs: {`);
      lines.push(`      left: [${data.signs.left.map((s: string) => `"${escapeForTS(s)}"`).join(", ")}],`);
      lines.push(`      right: [${data.signs.right.map((s: string) => `"${escapeForTS(s)}"`).join(", ")}]`);
      lines.push(`    },`);
    } else if (Array.isArray(data.signs)) {
      lines.push(`    signs: [${data.signs.map((s: string) => `"${escapeForTS(s)}"`).join(", ")}],`);
    }
  } else {
    lines.push(`    signs: { left: ["See assessment findings"], right: ["See emergency signs"] },`);
  }

  if (Array.isArray(data.medications) && data.medications.length > 0) {
    lines.push(`    medications: [`);
    for (const med of data.medications) {
      lines.push(`      { name: "${escapeForTS(med.name || "")}", type: "${escapeForTS(med.type || "")}", action: "${escapeForTS(med.action || "")}", sideEffects: "${escapeForTS(med.sideEffects || "")}", contra: "${escapeForTS(med.contra || "")}", pearl: "${escapeForTS(med.pearl || "")}" },`);
    }
    lines.push(`    ],`);
  } else {
    lines.push(`    medications: [],`);
  }

  if (Array.isArray(data.quiz) && data.quiz.length > 0) {
    lines.push(`    quiz: [`);
    for (const q of data.quiz) {
      lines.push(`      { question: "${escapeForTS(q.question || "")}", options: [${(q.options || []).map((o: string) => `"${escapeForTS(o)}"`).join(", ")}], correct: ${q.correct || 0}, rationale: "${escapeForTS(q.rationale || "")}" },`);
    }
    lines.push(`    ],`);
  } else {
    lines.push(`    quiz: [],`);
  }

  lines.push(`  },`);
  return lines.join("\n");
}

async function main() {
  const entries = Object.entries(MISSING_LESSONS);
  const BATCH_SIZE = 10;
  const totalBatches = Math.ceil(entries.length / BATCH_SIZE);
  
  console.log(`Generating ${entries.length} lessons in ${totalBatches} batches...`);

  for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
    const batch = entries.slice(batchIdx * BATCH_SIZE, (batchIdx + 1) * BATCH_SIZE);
    const batchNum = String(batchIdx + 1).padStart(2, "0");
    const exportName = `missingBatch${batchNum}Lessons`;
    
    console.log(`\nBatch ${batchNum}: Generating ${batch.length} lessons...`);
    
    const lessonEntries: string[] = [];
    
    const results = await Promise.all(
      batch.map(async ([id, info]) => {
        try {
          console.log(`  Generating: ${id}`);
          const raw = await generateLessonContent(id, info);
          const data = JSON.parse(raw);
          if (!data.title) data.title = info.title;
          return { id, data, error: null };
        } catch (err: any) {
          console.error(`  FAILED: ${id} - ${err.message}`);
          return { id, data: null, error: err.message };
        }
      })
    );
    
    for (const { id, data, error } of results) {
      if (data) {
        lessonEntries.push(jsonToTSLesson(id, data));
      } else {
        console.error(`  Skipping ${id}: ${error}`);
      }
    }
    
    if (lessonEntries.length === 0) {
      console.error(`Batch ${batchNum}: No lessons generated, skipping file.`);
      continue;
    }

    const fileContent = `import type { LessonContent } from "./types";\n\nexport const ${exportName}: Record<string, LessonContent> = {\n${lessonEntries.join("\n")}\n};\n`;
    
    const filePath = path.join("client/src/data/lessons", `missing-batch-${batchNum}.ts`);
    fs.writeFileSync(filePath, fileContent);
    console.log(`  Written: ${filePath} (${lessonEntries.length} lessons)`);
  }
  
  console.log("\nAll batches complete! Now update index.ts to import the new files.");
}

main().catch(console.error);
