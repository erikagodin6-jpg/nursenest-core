import crypto from "crypto";
import pg from "pg";
import OpenAI from "openai";

const BATCH_SIZE = 50;
const TARGET_PER_CAREER = 500;
const MAX_RETRIES = 3;

interface CareerSpec {
  careerType: string;
  name: string;
  examNames: string[];
  domains: string[];
  scopePrompt: string;
}

const ALL_SPECS: Record<string, CareerSpec> = {
  paramedic: {
    careerType: "paramedic",
    name: "Paramedic / Advanced Care Paramedic",
    examNames: ["NREMT", "COPR", "PCP/ACP Provincial"],
    domains: [
      "Trauma", "Medical Emergencies", "Cardiac/ACLS", "Pediatric/PALS",
      "OB Emergencies", "Pharmacology", "Airway Management",
      "Assessment", "Operations", "Legal/Ethics",
    ],
    scopePrompt: `You are a senior Paramedic/ACP certification exam item writer for NREMT and COPR exams.
Paramedic scope: prehospital emergency care, trauma management, ACLS/PALS protocols, field pharmacology, airway management, patient assessment, triage.
Questions test rapid clinical decision-making in field settings. Include specific vital signs, ECG findings, medication dosages, and treatment algorithms.
Focus on scene safety, transport decisions, protocol adherence, and scope of practice.`,
  },
  rrt: {
    careerType: "rrt",
    name: "Registered Respiratory Therapist",
    examNames: ["NBRC TMC", "NBRC CSE", "CBRC"],
    domains: [
      "Airway Management", "Oxygen Therapy", "ABG Interpretation",
      "Mechanical Ventilation", "Pulmonary Function Testing",
      "Neonatal & Pediatric Respiratory Care", "Critical Care Respiratory Therapy",
      "Cardiopulmonary Physiology", "Aerosol & Medication Delivery",
      "Sleep & Noninvasive Ventilation", "Emergency Respiratory Care",
      "Patient Assessment", "Infection Control & Equipment",
    ],
    scopePrompt: `You are a senior Respiratory Therapy licensing exam item writer for NBRC TMC/CSE and CBRC exams.
RRT scope: ventilator management, ABG analysis, airway management, oxygen therapy, pulmonary diagnostics, neonatal/pediatric respiratory care.
Questions test clinical judgment at the application/analysis level. Focus on patient assessment, therapeutic interventions, equipment selection, and emergency protocols.
Use standard medical terminology. Include real-world clinical scenarios with specific patient data (vitals, lab values, ventilator settings).`,
  },
  mlt: {
    careerType: "mlt",
    name: "Medical Laboratory Technologist",
    examNames: ["CSMLS MLT", "ASCP MLS", "ASCP MLT"],
    domains: [
      "Clinical Chemistry", "Hematology", "Hemostasis / Coagulation",
      "Immunohematology / Blood Banking", "Microbiology",
      "Urinalysis & Body Fluids", "Immunology / Serology",
      "Molecular Diagnostics", "Histotechnology", "Mycology",
      "Parasitology", "Phlebotomy & Specimen Collection",
      "Laboratory Operations & Quality Management", "Point-of-Care Testing",
    ],
    scopePrompt: `You are a senior Medical Laboratory Technologist certification exam item writer for CSMLS and ASCP exams.
MLT scope: clinical chemistry, hematology, microbiology, blood banking, immunology, urinalysis, molecular diagnostics, histotechnology.
Questions test analytical reasoning with lab values, specimen handling, quality control, and result interpretation.
Include specific lab values, reagent names, instrument readings, and quality control scenarios. Use SI units where appropriate.`,
  },
  radtech: {
    careerType: "imaging",
    name: "Radiologic Technologist",
    examNames: ["ARRT Radiography", "CAMRT"],
    domains: [
      "Radiographic Positioning", "Radiation Safety", "Anatomy/Physiology",
      "Image Production", "Equipment Operation", "Patient Care",
      "Pathology Recognition", "CT Imaging", "MRI Physics", "Digital Imaging",
    ],
    scopePrompt: `You are a senior Radiologic Technologist certification exam item writer for ARRT Radiography and CAMRT exams.
Rad Tech scope: radiographic positioning, radiation safety/protection, image production, equipment operation, patient care, anatomy cross-sections, CT protocols.
Questions test technical knowledge of exposure factors, positioning accuracy, image quality assessment, and radiation dose optimization.
Include specific technical factors (kVp, mAs, SID), anatomy landmarks, positioning angles, and patient safety protocols.`,
  },
  sonography: {
    careerType: "imaging",
    name: "Diagnostic Medical Sonographer",
    examNames: ["ARDMS SPI", "ARDMS Abdomen", "ARDMS OB/GYN"],
    domains: [
      "Ultrasound Physics", "Abdominal Sonography", "OB/GYN Sonography",
      "Vascular Sonography", "Echocardiography", "Musculoskeletal Sonography",
      "Small Parts Sonography", "Sonographic Artifacts", "Doppler Principles",
      "Instrumentation",
    ],
    scopePrompt: `You are a senior Diagnostic Medical Sonography certification exam item writer for ARDMS SPI and specialty exams.
Sonography scope: ultrasound physics, abdominal scanning, OB/GYN sonography, vascular ultrasound, echocardiography, Doppler principles.
Questions test image recognition, scanning technique, physics concepts, and pathology identification on ultrasound.
Include specific measurements, transducer frequencies, Doppler waveform patterns, and sonographic appearances of pathology.`,
  },
};

function computeStemHash(stem: string): string {
  return crypto.createHash("md5").update(stem.toLowerCase().trim()).digest("hex");
}

function computeContentHash(stem: string, careerType: string): string {
  return crypto.createHash("sha256").update(`allied:${careerType}:${stem}`).digest("hex").slice(0, 32);
}

function getOpenAI(): OpenAI {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function buildPrompt(spec: CareerSpec, domain: string, count: number, existingStems: string[]): { system: string; user: string } {
  const antiDupe = existingStems.length > 0
    ? `\nAvoid duplicating these recent stems:\n${existingStems.slice(-15).map((s, i) => `${i + 1}. ${s.substring(0, 80)}...`).join("\n")}`
    : "";

  const system = `${spec.scopePrompt}

CRITICAL RULES:
1. Output ONLY valid JSON. No markdown, no code fences, no prose.
2. Every question must have a unique, distinct clinical scenario.
3. Do NOT use any emoji characters. Plain text only.
4. Each question must have exactly 4 answer choices labeled A through D.
5. Each question's rationale must be 80-150 words explaining why the correct answer is right and why each distractor is wrong.
6. Include a clinical pearl, exam trap, and safety note for each question.
7. Difficulty 1-5: 1=recall, 2=comprehension, 3=application, 4=analysis, 5=synthesis.

Difficulty distribution: ~30% easy (1-2), ~40% moderate (3), ~30% hard (4-5).

Return JSON: {"items": [...]} with exactly ${count} question objects.

Each question object:
{
  "stem": "A detailed clinical scenario question (min 60 chars)",
  "options": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}],
  "correctAnswer": 0-3,
  "difficulty": 1-5,
  "cognitiveLevel": "recall"|"application"|"analysis",
  "questionType": "multiple_choice",
  "domain": "${domain}",
  "subtopic": "specific subtopic",
  "learningObjective": "what the student should learn",
  "rationaleLong": "80-150 word detailed rationale",
  "distractorRationales": ["why A is wrong/right", "why B", "why C", "why D"],
  "clinicalPearls": ["pearl 1", "pearl 2", "pearl 3"],
  "examTrap": "common mistake",
  "safetyNote": "safety consideration"
}
${antiDupe}

Return EXACTLY ${count} items. JSON only.`;

  const user = `Generate ${count} unique ${spec.name} licensing exam questions for ${domain}. Each must have a distinct clinical/technical scenario. Target exams: ${spec.examNames.join(", ")}.`;
  return { system, user };
}

async function generateBatch(openai: OpenAI, spec: CareerSpec, domain: string, count: number, existingStems: string[]): Promise<any[]> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { system, user } = buildPrompt(spec, domain, count, existingStems);
      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        temperature: 0.5,
        max_tokens: Math.min(count * 800 + 500, 16384),
        response_format: { type: "json_object" },
      });
      const content = resp.choices[0]?.message?.content || "{}";
      let cleaned = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(cleaned);
      const items = Array.isArray(parsed.items) ? parsed.items : Array.isArray(parsed.questions) ? parsed.questions : Array.isArray(parsed) ? parsed : [];
      if (items.length > 0) return items;
      console.log(`  Attempt ${attempt + 1}: 0 items for ${domain}, retrying...`);
    } catch (err: any) {
      console.error(`  Attempt ${attempt + 1} failed for ${domain}:`, err.message);
    }
    if (attempt < MAX_RETRIES) await new Promise(r => setTimeout(r, 2000));
  }
  return [];
}

function normalizeQ(q: any, domain: string): any {
  const correctAnswer = q.correctAnswer ?? q.correct_answer ?? 0;
  const rationaleLong = q.rationaleLong || q.rationale_long || q.rationale || "";
  const options = Array.isArray(q.options) ? q.options.map((o: any, i: number) => {
    if (typeof o === "string") return { label: String.fromCharCode(65 + i), text: o };
    return { label: o.label || String.fromCharCode(65 + i), text: o.text || String(o) };
  }) : [];
  const distractorRationales = q.distractorRationales || q.distractor_rationales || [];
  const clinicalPearls = q.clinicalPearls || q.clinical_pearls || [q.clinicalPearl || "Review this topic."];
  return {
    stem: q.stem, options,
    correctAnswer: typeof correctAnswer === "number" ? correctAnswer : 0,
    difficulty: q.difficulty || 3,
    cognitiveLevel: q.cognitiveLevel || q.cognitive_level || "application",
    questionType: "multiple_choice",
    domain: q.domain || domain,
    subtopic: q.subtopic || domain,
    learningObjective: q.learningObjective || q.learning_objective || `Understand key concepts in ${domain}`,
    rationaleLong,
    distractorRationales: Array.isArray(distractorRationales) ? distractorRationales : [distractorRationales],
    clinicalPearls: Array.isArray(clinicalPearls) ? clinicalPearls : [clinicalPearls],
    examTrap: q.examTrap || q.exam_trap || null,
    safetyNote: q.safetyNote || q.safety_note || null,
  };
}

const ALLIED_IMAGE_MAP: Record<string, { file: string; alt: string }[]> = {
  "abg": [{ file: "ABGreference", alt: "ABG reference chart" }],
  "arterial blood gas": [{ file: "ABGreference", alt: "ABG reference chart" }],
  "ventilator": [{ file: "ventilator", alt: "Ventilator settings" }],
  "pneumonia": [{ file: "pneumonia", alt: "Pneumonia illustration" }],
  "copd": [{ file: "copd", alt: "COPD illustration" }],
  "asthma": [{ file: "asthma", alt: "Asthma illustration" }],
  "cardiac tamponade": [{ file: "cardiactamponade", alt: "Cardiac tamponade illustration" }],
  "heart failure": [{ file: "heartfailure", alt: "Heart failure illustration" }],
  "stroke": [{ file: "stroke", alt: "Stroke illustration" }],
  "fracture": [{ file: "fracture", alt: "Fracture illustration" }],
  "burns": [{ file: "burns", alt: "Burns illustration" }],
  "compartment syndrome": [{ file: "compartmentsyndrome.png", alt: "Compartment syndrome" }],
  "diabetes": [{ file: "diabetes", alt: "Diabetes infographic" }],
  "anemia": [{ file: "anemia", alt: "Anemia illustration" }],
  "sickle cell": [{ file: "sicklecell", alt: "Sickle cell illustration" }],
  "dvt": [{ file: "dvt", alt: "DVT illustration" }],
  "pulmonary embolism": [{ file: "pe", alt: "Pulmonary embolism illustration" }],
  "seizure": [{ file: "seizure", alt: "Seizure management" }],
  "opioid": [{ file: "opioid", alt: "Opioid overdose illustration" }],
  "hypothyroidism": [{ file: "hypothyroidism_1773374939606", alt: "Hypothyroidism" }],
  "hyperthyroidism": [{ file: "hyperthyroidism", alt: "Hyperthyroidism" }],
  "pancreatitis": [{ file: "pancreatitis", alt: "Pancreatitis illustration" }],
};

const ALLIED_LESSON_MAP: Record<string, { title: string; slug: string }> = {
  "abg": { title: "ABG Interpretation", slug: "abg-interpretation" },
  "ventilator": { title: "Mechanical Ventilation", slug: "mechanical-ventilation" },
  "airway": { title: "Airway Management", slug: "airway-management" },
  "oxygen therapy": { title: "Oxygen Therapy", slug: "oxygen-therapy" },
  "trauma": { title: "Trauma Assessment", slug: "trauma-assessment" },
  "acls": { title: "ACLS Protocols", slug: "acls-protocols" },
  "pals": { title: "PALS Protocols", slug: "pals-protocols" },
  "ecg": { title: "ECG Interpretation", slug: "ecg-interpretation" },
  "hematology": { title: "Hematology", slug: "hematology" },
  "microbiology": { title: "Microbiology", slug: "microbiology" },
  "blood banking": { title: "Blood Banking", slug: "blood-banking" },
  "clinical chemistry": { title: "Clinical Chemistry", slug: "clinical-chemistry" },
  "radiation safety": { title: "Radiation Safety", slug: "radiation-safety" },
  "positioning": { title: "Radiographic Positioning", slug: "radiographic-positioning" },
  "ultrasound": { title: "Ultrasound Physics", slug: "ultrasound-physics" },
  "doppler": { title: "Doppler Principles", slug: "doppler-principles" },
  "pharmacology": { title: "Pharmacology Review", slug: "pharmacology" },
  "diabetes": { title: "Diabetes Management", slug: "diabetes-management" },
  "heart failure": { title: "Heart Failure", slug: "heart-failure" },
  "pneumonia": { title: "Pneumonia", slug: "pneumonia" },
  "stroke": { title: "Stroke Assessment", slug: "stroke" },
  "seizure": { title: "Seizure Management", slug: "seizure-disorders" },
};

function matchImages(stem: string, domain: string): { url: string; alt: string }[] {
  const text = `${stem} ${domain}`.toLowerCase();
  const matches: { url: string; alt: string }[] = [];
  for (const [keyword, images] of Object.entries(ALLIED_IMAGE_MAP)) {
    if (text.includes(keyword)) {
      for (const img of images) {
        if (!matches.find(m => m.url.includes(img.file))) {
          matches.push({ url: `/attached_assets/${img.file}`, alt: img.alt });
        }
      }
    }
  }
  return matches.slice(0, 3);
}

function findLessonLink(stem: string, domain: string, careerType: string): { title: string; url: string } | null {
  const text = `${stem} ${domain}`.toLowerCase();
  for (const [keyword, lesson] of Object.entries(ALLIED_LESSON_MAP)) {
    if (text.includes(keyword)) {
      return { title: lesson.title, url: `/lessons/${lesson.slug}-${careerType}` };
    }
  }
  return null;
}

function validateStrict(q: any): boolean {
  if (!q.stem || typeof q.stem !== "string" || q.stem.length < 40) return false;
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  const ca = q.correctAnswer ?? q.correct_answer;
  if (ca === undefined || ca === null) return false;
  if (typeof ca === "number" && (ca < 0 || ca > 3)) return false;
  const rat = q.rationaleLong || q.rationale_long || q.rationale || "";
  const wordCount = rat.split(/\s+/).filter(Boolean).length;
  if (wordCount < 80) return false;
  return true;
}

function buildFlashcardBack(q: any): string {
  const parts: string[] = [];
  const correctOpt = q.options[q.correctAnswer];
  if (correctOpt) parts.push(`Correct Answer: ${correctOpt.label}. ${correctOpt.text}`);
  parts.push(`\nRationale: ${q.rationaleLong}`);
  if (q.clinicalPearls?.[0]) parts.push(`\nClinical Pearl: ${q.clinicalPearls[0]}`);
  if (q.examTrap) parts.push(`\nExam Trap: ${q.examTrap}`);
  return parts.join("\n");
}

async function runForCareer(specKey: string) {
  const spec = ALL_SPECS[specKey];
  if (!spec) { console.error(`Unknown spec: ${specKey}`); process.exit(1); }

  const dbUrl = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) { console.error("No database URL"); process.exit(1); }
  const dbPool = new pg.Pool({ connectionString: dbUrl });
  const openai = getOpenAI();

  console.log(`[${spec.name}] Starting expansion...`);
  console.log(`[${spec.name}] DB: ${dbUrl.replace(/\/\/.*@/, "//***@")}`);

  const { rows: countRows } = await dbPool.query(
    `SELECT COUNT(*) as c FROM allied_questions WHERE career_type = $1 AND status != 'rejected' AND blueprint_category = ANY($2)`,
    [spec.careerType, spec.domains]
  );
  const existingCount = parseInt(countRows[0].c);
  const needed = Math.max(0, TARGET_PER_CAREER - existingCount);
  console.log(`[${spec.name}] Existing: ${existingCount}, Need: ${needed}`);

  if (needed === 0) {
    console.log(`[${spec.name}] Already at target, skipping.`);
    await dbPool.end();
    return;
  }

  const { rows: existingRows } = await dbPool.query(
    `SELECT stem FROM allied_questions WHERE career_type = $1 AND status != 'rejected'`, [spec.careerType]
  );
  const existingHashes = new Set(existingRows.map((r: any) => computeStemHash(r.stem)));

  const tierMap: Record<string, string> = { rrt: "rrt-basic", mlt: "mlt-basic", paramedic: "pcp", imaging: "img-basic" };
  const tier = tierMap[spec.careerType] || "free";

  const perDomain = Math.floor(needed / spec.domains.length);
  const remainder = needed % spec.domains.length;
  const domainPlan: Record<string, number> = {};
  spec.domains.forEach((d, i) => { domainPlan[d] = perDomain + (i < remainder ? 1 : 0); });

  let totalInserted = 0;
  let totalFlashcards = 0;
  let totalDuplicates = 0;
  let batchNum = 0;
  const recentStems: string[] = [];

  for (const [domain, domainTarget] of Object.entries(domainPlan)) {
    let remaining = domainTarget;
    while (remaining > 0) {
      const batchSize = Math.min(BATCH_SIZE, remaining);
      batchNum++;
      console.log(`  Batch ${batchNum}: ${batchSize} for ${domain}`);

      const items = await generateBatch(openai, spec, domain, batchSize, recentStems);
      let bIns = 0, bFc = 0, bDup = 0;

      for (const raw of items) {
        if (!validateStrict(raw)) continue;

        const item = normalizeQ(raw, domain);
        const stemHash = computeStemHash(item.stem);
        if (existingHashes.has(stemHash)) { bDup++; continue; }

        const images = matchImages(item.stem, item.domain);
        const lessonLink = findLessonLink(item.stem, item.domain, spec.careerType);
        if (lessonLink) {
          item.rationaleLong += `\n\nTo review this concept, see: ${lessonLink.title} -> ${lessonLink.url}`;
        }

        const client = await dbPool.connect();
        try {
          await client.query("BEGIN");

          const { rows: inserted } = await client.query(
            `INSERT INTO allied_questions (
              career_type, stem, options, correct_answer, rationale_long,
              learning_objective, blueprint_category, subtopic, difficulty,
              cognitive_level, question_type, exam_trap, clinical_pearls,
              safety_note, distractor_rationales, status
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id`,
            [
              spec.careerType, item.stem, JSON.stringify(item.options), item.correctAnswer,
              item.rationaleLong, item.learningObjective, item.domain, item.subtopic,
              item.difficulty, item.cognitiveLevel, item.questionType, item.examTrap,
              JSON.stringify(item.clinicalPearls), item.safetyNote,
              JSON.stringify(item.distractorRationales), "approved",
            ]
          );

          if (!inserted?.length) { await client.query("ROLLBACK"); bDup++; continue; }

          const qId = inserted[0].id;
          existingHashes.add(stemHash);
          bIns++;
          recentStems.push(item.stem.substring(0, 100));
          if (recentStems.length > 30) recentStems.splice(0, recentStems.length - 20);

          const fcHash = computeContentHash(item.stem, spec.careerType);
          const fcBack = buildFlashcardBack(item);

          const lessonLinks = lessonLink ? [{ lessonTitle: lessonLink.title, lessonUrl: lessonLink.url }] : [];
          const rationaleMedia = images.map(img => ({ imageUrl: img.url, imageAlt: img.alt }));

          await client.query(
            `INSERT INTO flashcard_bank (
              tier, front, back, content_hash, status, source_type, source_question_id,
              question_type, options, correct_answer, rationale_correct,
              clinical_takeaway, exam_pearl, difficulty, topic, subtopic,
              flashcard_enabled, category, career_type, rationale_media, lesson_links
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
            ON CONFLICT (content_hash) DO NOTHING`,
            [
              tier, item.stem, fcBack, fcHash, "approved", "allied_expansion", qId,
              "multiple_choice", JSON.stringify(item.options),
              JSON.stringify([item.options[item.correctAnswer]?.label || "A"]),
              item.rationaleLong, item.clinicalPearls[0] || null, item.examTrap || null,
              item.difficulty, item.domain, item.subtopic, true, item.domain, spec.careerType,
              JSON.stringify(rationaleMedia), JSON.stringify(lessonLinks),
            ]
          );
          bFc++;

          await client.query("COMMIT");
        } catch (err: any) {
          await client.query("ROLLBACK").catch(() => {});
          if (err.code === "23505") bDup++;
          else console.error(`  Insert error:`, err.message);
        } finally {
          client.release();
        }
      }

      totalInserted += bIns;
      totalFlashcards += bFc;
      totalDuplicates += bDup;
      remaining -= bIns > 0 ? bIns : batchSize;

      console.log(`  Batch ${batchNum} done: +${bIns} questions, +${bFc} flashcards, ${bDup} dupes. Total: ${existingCount + totalInserted}/${TARGET_PER_CAREER}`);
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`\n[${spec.name}] COMPLETE: ${totalInserted} questions, ${totalFlashcards} flashcards, ${totalDuplicates} dupes`);
  console.log(`[${spec.name}] Final count: ${existingCount + totalInserted}/${TARGET_PER_CAREER}`);

  await dbPool.end();
}

const specKey = process.argv[2];
if (!specKey) {
  console.log("Usage: npx tsx server/run-allied-expansion.ts <career>");
  console.log("Careers: paramedic, rrt, mlt, radtech, sonography");
  process.exit(1);
}

runForCareer(specKey).then(() => process.exit(0)).catch(e => { console.error("Fatal:", e); process.exit(1); });
