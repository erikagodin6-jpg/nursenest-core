import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

interface Q {
  question: string; optionA: string; optionB: string; optionC: string; optionD: string;
  correctAnswer: string; rationale: string; category: string; topic: string;
  difficulty: number; country: string; bodyPart?: string; modality?: string; exam: string;
  examDomain: string; masteryCategory?: string;
}

const QUESTIONS: Q[] = [
  { question: "A technologist performing a portable abdominal radiograph on a bariatric patient (BMI > 40) should consider:", optionA: "Using the same technique as a standard patient", optionB: "Increasing mAs significantly, using higher kVp, ensuring adequate SID, and potentially using two overlapping images to cover the abdomen", optionC: "Reducing technique factors", optionD: "Using a lower grid ratio", correctAnswer: "B", rationale: "Bariatric patients require significantly increased technique (higher mAs and kVp) due to greater tissue thickness and attenuation. A single 14×17 IR may not cover the entire abdomen; two overlapping images may be needed.", category: "Patient Care", topic: "Special Populations", difficulty: 3, country: "usa", bodyPart: "Abdomen", exam: "arrt", examDomain: "Patient Care", masteryCategory: "clinical" },
  { question: "For an AP axial projection of the zygomatic arches using the Towne method, the CR is angled:", optionA: "15 degrees cephalad", optionB: "30 degrees caudad to the OML to project the arches below the cranium", optionC: "Perpendicular", optionD: "45 degrees cephalad", correctAnswer: "B", rationale: "The modified Towne for zygomatic arches uses 30 degrees caudal to OML. This projects both arches inferiorly, free of cranial superimposition, for bilateral comparison.", category: "Procedures", topic: "Skull and Facial Bones", difficulty: 3, country: "usa", bodyPart: "Facial Bones", exam: "arrt", examDomain: "Procedures", masteryCategory: "clinical" },
  { question: "A lateral projection of the knee showing the femoral condyles with the medial condyle anterior to the lateral condyle indicates:", optionA: "Proper positioning", optionB: "The leg is slightly internally rotated from true lateral; the lateral condyle should project slightly posterior", optionC: "Severe pathology", optionD: "The image is inverted", correctAnswer: "B", rationale: "On a true lateral knee, the adductor tubercle on the medial condyle is located posteriorly. If the medial condyle appears anterior, slight internal rotation has occurred. Adjust external rotation to achieve a true lateral.", category: "Image Production", topic: "Image Quality", difficulty: 3, country: "usa", bodyPart: "Knee", exam: "arrt", examDomain: "Image Production", masteryCategory: "clinical" },
  { question: "The cell survival curve for mammalian cells exposed to radiation shows a 'shoulder' region at low doses. This shoulder represents:", optionA: "Immediate cell death", optionB: "The cell's ability to repair sublethal damage at low doses before accumulation overwhelms repair mechanisms", optionC: "No biological effect", optionD: "Complete protection from radiation", correctAnswer: "B", rationale: "The shoulder on the cell survival curve represents accumulation and repair of sublethal damage. At low doses, cells can repair damage between radiation events. At higher doses, damage accumulates faster than repair.", category: "Radiation Safety", topic: "Radiation Biology", difficulty: 5, country: "usa", exam: "arrt", examDomain: "Radiation Safety", masteryCategory: "knowledge" },
  { question: "For a PA projection of the chest on a patient with severe kyphosis, the technologist should:", optionA: "Use standard positioning", optionB: "Angle the CR caudad to compensate for the kyphotic curvature and prevent foreshortening of the lung fields", optionC: "Only do a lateral projection", optionD: "Use a lordotic position", correctAnswer: "B", rationale: "Severe kyphosis causes the upper thorax to tilt forward. A caudal CR angle (5-10 degrees) helps open the lung fields and reduce superimposition of the clavicles on the apices.", category: "Radiographic Positioning", topic: "Chest", difficulty: 3, country: "canada", bodyPart: "Chest", exam: "camrt", examDomain: "Radiographic Positioning", masteryCategory: "clinical" },
  { question: "For anteroposterior (AP) bilateral weight-bearing ankle projections, the purpose is to:", optionA: "Demonstrate fractures only", optionB: "Evaluate ankle joint space narrowing and alignment under physiologic load for suspected arthritis or ligamentous laxity", optionC: "Demonstrate the calcaneus only", optionD: "Evaluate soft tissue masses", correctAnswer: "B", rationale: "Weight-bearing ankle views demonstrate joint space narrowing, talar tilt, and ankle alignment under physiologic load. This is important for evaluating chronic ankle instability, arthritis, and post-injury alignment.", category: "Radiographic Positioning", topic: "Lower Extremity", difficulty: 3, country: "canada", bodyPart: "Ankle", exam: "camrt", examDomain: "Radiographic Positioning", masteryCategory: "clinical" },
  { question: "In dual-energy DR imaging for bone densitometry (DXA), the two energy levels are used to:", optionA: "Improve spatial resolution", optionB: "Separate bone mineral content from soft tissue to measure bone mineral density (BMD) in g/cm²", optionC: "Reduce patient dose only", optionD: "Improve contrast resolution only", correctAnswer: "B", rationale: "DXA uses two X-ray energies to differentiate bone from soft tissue based on their different energy-dependent attenuation. This allows precise measurement of bone mineral density for osteoporosis diagnosis.", category: "Equipment Operation", topic: "Advanced Imaging", difficulty: 3, country: "canada", exam: "camrt", examDomain: "Equipment Operation", masteryCategory: "knowledge" },
];

async function seed() {
  let inserted = 0;
  for (const q of QUESTIONS) {
    const exists = await pool.query(`SELECT id FROM imaging_questions WHERE question = $1 AND country = $2 LIMIT 1`, [q.question, q.country]);
    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO imaging_questions (id, question, option_a, option_b, option_c, option_d, correct_answer, rationale, category, topic, difficulty, country, body_part, modality, exam, exam_domain, mastery_category, status, created_at, updated_at)
         VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'published',NOW(),NOW())`,
        [q.question, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer, q.rationale, q.category, q.topic, q.difficulty, q.country, q.bodyPart||null, q.modality||null, q.exam, q.examDomain, q.masteryCategory||null]
      );
      inserted++;
    }
  }
  console.log(`[Final Topup] Inserted ${inserted}/${QUESTIONS.length} questions`);
}

seed().then(() => pool.end()).catch(e => { console.error(e); pool.end(); });
