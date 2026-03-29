const pg = require('pg');
const OpenAI = require('openai');
const crypto = require('crypto');
const fs = require('fs');

const PROGRESS_FILE = '/tmp/paramedic-gen-progress.json';
const TOTAL_QUESTIONS = 733;
const BATCH_SIZE = 5;
const MODEL = 'gpt-4o-mini';
const MAX_BATCHES_PER_RUN = parseInt(process.env.MAX_BATCHES || '50', 10);

const DOMAIN_CONFIG = [
  { domain: "Airway Management", count: 57, subtopics: ["BVM Ventilation", "Supraglottic Airways", "Endotracheal Intubation", "Surgical Airway", "Capnography", "RSI Technique", "Difficult Airway Assessment", "Oxygen Delivery Devices", "Suctioning Techniques"] },
  { domain: "Cardiology/ECG", count: 61, subtopics: ["12-Lead ECG Interpretation", "Acute Coronary Syndrome", "Dysrhythmia Recognition", "Cardioversion/Defibrillation", "Pacing", "Heart Failure", "Hypertensive Emergencies", "Cardiac Tamponade", "Sinus Rhythms and Blocks"] },
  { domain: "Trauma Management", count: 67, subtopics: ["Primary Survey", "Hemorrhage Control", "Spinal Motion Restriction", "Chest Trauma", "Abdominal Trauma", "Burns", "Blast Injuries", "Penetrating Trauma", "Blunt Trauma", "Musculoskeletal Injuries"] },
  { domain: "Medical Emergencies", count: 75, subtopics: ["Stroke Assessment", "Diabetic Emergencies", "Seizures", "Anaphylaxis", "Sepsis", "Electrolyte Disorders", "Respiratory Distress", "Shock Recognition", "Neurological Assessment", "Abdominal Emergencies"] },
  { domain: "ACLS/PALS Protocols", count: 75, subtopics: ["ACLS Algorithms", "Cardiac Arrest Management", "Post-Resuscitation Care", "Pediatric Resuscitation", "Neonatal Resuscitation", "ROSC Management"] },
  { domain: "Pharmacology", count: 60, subtopics: ["Drug Calculations", "Cardiac Drugs", "Sedation and Analgesia", "RSI Medications", "Vasopressors", "Antidotes", "Routes of Administration", "Toxicology and Poisoning"] },
  { domain: "Pediatric Emergencies", count: 98, subtopics: ["Pediatric Assessment Triangle", "PALS Algorithms", "Pediatric Airway", "Pediatric Pharmacology", "Child Abuse Recognition", "Pediatric Trauma", "Pediatric Medical Emergencies"] },
  { domain: "OB Emergencies", count: 84, subtopics: ["Normal Delivery", "Breech Presentation", "Cord Prolapse", "Eclampsia", "Postpartum Hemorrhage", "Neonatal Care"] },
  { domain: "Operations/EMS Systems", count: 81, subtopics: ["Scene Safety", "MCI and Triage", "Vehicle Extrication", "Hazmat Awareness", "Air Medical Transport", "Handover Communication", "Documentation Standards", "Crew Resource Management"] },
  { domain: "Environmental Emergencies", count: 30, subtopics: ["Hypothermia", "Heat Stroke", "Drowning", "High Altitude Illness", "Lightning Injuries", "Envenomation"] },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch (e) {}
  return { inserted: 0, flashcards: 0, batchId: `paramedic-gen-${Date.now()}`, domainCounts: {}, stemHashes: [] };
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p));
}

function hashStem(stem) {
  return crypto.createHash('md5').update(stem.toLowerCase().trim()).digest('hex');
}

function pickDifficulty() {
  const r = Math.random();
  if (r < 0.10) return 1;
  if (r < 0.35) return 2;
  if (r < 0.80) return 3;
  if (r < 0.95) return 4;
  return 5;
}

function buildPrompt(domain, subtopic, count, difficulty) {
  const lessonSlug = slugify(domain);
  const subSlug = slugify(subtopic);
  return `You are an expert paramedic exam question writer. Generate ${count} clinical vignette-style MCQ questions.

DOMAIN: ${domain} | SUBTOPIC: ${subtopic} | DIFFICULTY: ${difficulty}/5

Each question MUST be a prehospital scenario with patient demographics, scene description, chief complaint, vitals (BP/HR/RR/SpO2), and assessment findings.

Return a JSON object: {"questions": [array of question objects]}

Each question object:
{
  "learningObjective": "What the student should know",
  "blueprintCategory": "${domain}",
  "subtopic": "${subtopic}",
  "difficulty": ${difficulty},
  "cognitiveLevel": "${difficulty <= 2 ? 'recall' : difficulty === 3 ? 'application' : 'analysis'}",
  "stem": "Clinical vignette with patient age/sex, scene, complaint, vitals, findings, ending with a question",
  "options": ["A","B","C","D"],
  "correctAnswer": 0,
  "rationaleLong": "600+ words: why correct answer is right (pathophysiology), why each wrong answer is incorrect, clinical pearl, exam trick explanation, intervention priorities, scenario variations. End with: Learn more: /paramedic/lessons/${lessonSlug}/${subSlug}",
  "examTrap": "How this tricks test-takers",
  "clinicalPearls": ["Pearl 1","Pearl 2","Pearl 3"],
  "safetyNote": "Critical safety info",
  "distractorRationales": ["Why A right/wrong","Why B right/wrong","Why C right/wrong","Why D right/wrong"]
}

Rules: No "all/none of the above". Include specific drug doses, vital ranges, equipment sizes. Unique scenarios. correctAnswer is 0-3 index.`;
}

function randomizeOptions(q) {
  const opts = [...q.options];
  const correctText = opts[q.correctAnswer];
  const dr = q.distractorRationales ? [...q.distractorRationales] : null;
  const idx = [0,1,2,3];
  for (let i = 3; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const newOpts = idx.map(i => opts[i]);
  const newDr = dr ? idx.map(i => dr[i]) : null;
  return { ...q, options: newOpts, correctAnswer: newOpts.indexOf(correctText) >= 0 ? newOpts.indexOf(correctText) : 0, distractorRationales: newDr };
}

function makeFlashcards(q) {
  const cards = [];
  cards.push({ cardType: 'definition', front: q.learningObjective || q.subtopic, back: q.options[q.correctAnswer], rationale: (q.rationaleLong || '').substring(0, 500) });
  if (q.clinicalPearls && Array.isArray(q.clinicalPearls) && q.clinicalPearls.length > 0) {
    cards.push({ cardType: 'clinical_decision', front: `Clinical decision: ${q.subtopic} - What is the key clinical pearl?`, back: q.clinicalPearls[0], rationale: q.clinicalPearls.slice(1).join(' | ') });
  }
  if (q.safetyNote) {
    cards.push({ cardType: 'red_flag', front: `Red Flag: ${q.subtopic} - What safety concern must you remember?`, back: q.safetyNote, rationale: `From: ${q.blueprintCategory}` });
  }
  return cards;
}

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const openai = new OpenAI({ apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY, baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL });

  const progress = loadProgress();
  console.log(`Resume: ${progress.inserted} inserted, ${progress.flashcards} flashcards`);

  const existingStems = await pool.query("SELECT stem FROM allied_questions WHERE career_type='paramedic'");
  const hashes = new Set(existingStems.rows.map(r => hashStem(r.stem)));
  progress.stemHashes.forEach(h => hashes.add(h));

  let batchesDone = 0;

  while (progress.inserted < TOTAL_QUESTIONS && batchesDone < MAX_BATCHES_PER_RUN) {
    const needed = TOTAL_QUESTIONS - progress.inserted;
    if (needed <= 0) break;

    let bestDomain = null;
    let bestDeficit = -Infinity;
    for (const dc of DOMAIN_CONFIG) {
      const have = progress.domainCounts[dc.domain] || 0;
      const deficit = dc.count - have;
      if (deficit > bestDeficit) {
        bestDeficit = deficit;
        bestDomain = dc;
      }
    }

    if (!bestDomain || bestDeficit <= 0) {
      bestDomain = DOMAIN_CONFIG[Math.floor(Math.random() * DOMAIN_CONFIG.length)];
    }

    const subtopic = bestDomain.subtopics[Math.floor(Math.random() * bestDomain.subtopics.length)];
    const difficulty = pickDifficulty();
    const count = Math.min(BATCH_SIZE, needed);

    console.log(`[${progress.inserted}/${TOTAL_QUESTIONS}] ${bestDomain.domain} > ${subtopic} | diff=${difficulty} | n=${count}`);

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You generate paramedic exam questions. Return valid JSON only.' },
          { role: 'user', content: buildPrompt(bestDomain.domain, subtopic, count, difficulty) }
        ],
        temperature: 0.9,
        max_tokens: 16000,
        response_format: { type: "json_object" }
      });

      let content = response.choices[0].message.content.trim();
      const parsed = JSON.parse(content);
      const questions = Array.isArray(parsed) ? parsed : (parsed.questions || Object.values(parsed).find(v => Array.isArray(v)) || []);

      if (!Array.isArray(questions) || questions.length === 0) {
        console.log('  No valid questions returned, retrying...');
        batchesDone++;
        continue;
      }

      for (let q of questions) {
        if (progress.inserted >= TOTAL_QUESTIONS) break;
        if (!q.stem || !q.options || q.options.length < 4) continue;

        const h = hashStem(q.stem);
        if (hashes.has(h)) { console.log('  dup skipped'); continue; }

        q = randomizeOptions(q);
        const ca = typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 ? q.correctAnswer : 0;
        const diff = Math.max(1, Math.min(5, q.difficulty || difficulty));
        const cog = q.cognitiveLevel || (diff <= 2 ? 'recall' : diff === 3 ? 'application' : 'analysis');

        const result = await pool.query(`
          INSERT INTO allied_questions (career_type, batch_id, stem, options, correct_answer, rationale_long,
            learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type,
            exam_trap, clinical_pearls, safety_note, distractor_rationales, is_free, status)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
          ['paramedic', progress.batchId, q.stem, JSON.stringify(q.options), ca,
           q.rationaleLong || 'Rationale pending', q.learningObjective || subtopic,
           q.blueprintCategory || bestDomain.domain, q.subtopic || subtopic, diff, cog, 'multiple-choice',
           q.examTrap || null, q.clinicalPearls ? JSON.stringify(q.clinicalPearls) : null,
           q.safetyNote || null, q.distractorRationales ? JSON.stringify(q.distractorRationales) : null,
           false, 'approved']);

        const qId = result.rows[0].id;
        hashes.add(h);
        progress.stemHashes.push(h);
        progress.inserted++;
        progress.domainCounts[bestDomain.domain] = (progress.domainCounts[bestDomain.domain] || 0) + 1;

        const cards = makeFlashcards(q);
        for (const c of cards) {
          await pool.query(`INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, blueprint_category, subtopic)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            ['paramedic', qId, c.cardType, c.front, c.back, c.rationale, q.blueprintCategory || bestDomain.domain, q.subtopic || subtopic]);
          progress.flashcards++;
        }
      }

      console.log(`  OK. Total: ${progress.inserted} questions, ${progress.flashcards} flashcards`);
      saveProgress(progress);
      batchesDone++;

    } catch (err) {
      console.error(`  Error: ${err.message}`);
      batchesDone++;
      if (err.message.includes('429') || err.message.includes('rate')) {
        console.log('  Rate limited, waiting 30s...');
        await new Promise(r => setTimeout(r, 30000));
      } else {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  console.log(`\nRun complete. Inserted: ${progress.inserted}, Flashcards: ${progress.flashcards}`);
  saveProgress(progress);
  await pool.end();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
