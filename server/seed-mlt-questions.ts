import { pool } from "./storage";
import {
  MLT_SUBDISCIPLINES,
  MLT_CANADA_BLUEPRINT_CATEGORIES,
  MLT_USA_CONTENT_AREAS,
} from "@shared/mlt-taxonomy";
import OpenAI from "openai";

const disciplines = [
  { name: "Clinical Chemistry", count: 15, track: "canada" },
  { name: "Clinical Chemistry", count: 15, track: "usa" },
  { name: "Hematology", count: 15, track: "canada" },
  { name: "Hematology", count: 15, track: "usa" },
  { name: "Microbiology", count: 12, track: "canada" },
  { name: "Microbiology", count: 12, track: "usa" },
  { name: "Immunohematology / Blood Banking", count: 10, track: "canada" },
  { name: "Immunohematology / Blood Banking", count: 10, track: "usa" },
  { name: "Hemostasis / Coagulation", count: 8, track: "canada" },
  { name: "Hemostasis / Coagulation", count: 8, track: "usa" },
  { name: "Urinalysis & Body Fluids", count: 6, track: "canada" },
  { name: "Urinalysis & Body Fluids", count: 6, track: "usa" },
  { name: "Immunology / Serology", count: 5, track: "canada" },
  { name: "Immunology / Serology", count: 5, track: "usa" },
  { name: "Molecular Diagnostics", count: 5, track: "canada" },
  { name: "Molecular Diagnostics", count: 5, track: "usa" },
  { name: "Laboratory Operations & Quality Management", count: 5, track: "canada" },
  { name: "Laboratory Operations & Quality Management", count: 5, track: "usa" },
  { name: "Phlebotomy & Specimen Collection", count: 4, track: "canada" },
  { name: "Phlebotomy & Specimen Collection", count: 4, track: "usa" },
  { name: "Point-of-Care Testing", count: 3, track: "both" },
  { name: "Histotechnology", count: 3, track: "both" },
];

function jaccardSim(a: string, b: string): number {
  const wA = new Set(a.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/));
  const wB = new Set(b.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/));
  const inter = [...wA].filter((w) => wB.has(w)).length;
  const union = new Set([...wA, ...wB]).size;
  return union === 0 ? 0 : inter / union;
}

async function main() {
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const existingBatch = await pool.query(
    "SELECT id FROM mlt_generation_batches WHERE discipline = 'multi-seed' AND status = 'running'"
  );
  let batchId: string;
  if (existingBatch.rows[0]) {
    batchId = existingBatch.rows[0].id;
  } else {
    const batchRes = await pool.query(
      "INSERT INTO mlt_generation_batches (country_track, requested_count, discipline, status, triggered_by, created_at) VALUES ('both', 220, 'multi-seed', 'running', 'seed_script', NOW()) RETURNING id"
    );
    batchId = batchRes.rows[0].id;
  }
  console.log("Batch ID:", batchId);

  const alreadyRes = await pool.query(
    "SELECT COUNT(*) as c FROM allied_questions WHERE batch_id = $1",
    [batchId]
  );
  let totalAccepted = parseInt(alreadyRes.rows[0].c);
  let totalRejected = 0;
  console.log("Already inserted:", totalAccepted);

  const existingRes = await pool.query(
    "SELECT stem FROM allied_questions WHERE career_type = 'mlt' AND status != 'archived' LIMIT 10000"
  );
  const existingStems: string[] = existingRes.rows.map((r: any) => r.stem);
  console.log("Existing stems:", existingStems.length);

  let skipCount = totalAccepted;

  for (const chunk of disciplines) {
    if (skipCount >= chunk.count) {
      skipCount -= chunk.count;
      console.log("Skipping", chunk.name, chunk.track, "(already done)");
      continue;
    }
    skipCount = 0;

    const subdisciplines = MLT_SUBDISCIPLINES[chunk.name] || [];
    const canadaCat = MLT_CANADA_BLUEPRINT_CATEGORIES.find((c) =>
      (c.disciplines as readonly string[]).includes(chunk.name)
    );
    const usaArea = MLT_USA_CONTENT_AREAS.find((c) =>
      (c.disciplines as readonly string[]).includes(chunk.name)
    );

    const countryContext =
      chunk.track === "canada"
        ? "Focus on Canadian CSMLS certification exam content."
        : chunk.track === "usa"
          ? "Focus on American ASCP Board of Certification exam content."
          : "Questions applicable to both Canadian CSMLS and American ASCP exams.";

    try {
      console.log(`Generating ${chunk.count} ${chunk.name} (${chunk.track})...`);
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert MLT/MLS exam item writer. ${countryContext} Create realistic lab scenarios with specific patient data and test results. NEVER use all/none of the above.`,
          },
          {
            role: "user",
            content: `Generate ${chunk.count} unique MLT questions for ${chunk.name}. Subtopics: ${subdisciplines.join(", ")}. Mix: 20% easy(diff=2), 45% medium(diff=3), 25% hard(diff=4), 10% very-hard(diff=5). Cognitive: 35% recall, 45% application, 20% analysis. JSON array: [{"stem":"...","options":["A","B","C","D"],"correctAnswer":0,"rationaleLong":"100+ word rationale","subdiscipline":"...","difficulty":2-5,"cognitiveLevel":"recall|application|analysis","tags":["tag1"],"learningObjective":"...","examTrap":"...","clinicalPearls":["pearl1"],"distractorRationales":["a","b","c","d"]}]. ONLY JSON array.`,
          },
        ],
        max_tokens: Math.min(chunk.count * 1500, 16000),
        temperature: 0.75,
      });

      const content = response.choices[0]?.message?.content || "";
      const arrMatch = content.match(/\[[\s\S]*\]/);
      if (!arrMatch) {
        console.log("  Failed to parse");
        continue;
      }

      let questions: any[];
      try {
        questions = JSON.parse(arrMatch[0]);
      } catch {
        console.log("  JSON parse error");
        continue;
      }
      console.log(`  Parsed ${questions.length} questions`);

      for (const q of questions) {
        if (!q.stem || q.stem.length < 30 || !q.options || q.options.length < 4) {
          totalRejected++;
          continue;
        }

        let isDup = false;
        for (const ex of existingStems) {
          if (jaccardSim(q.stem, ex) > 0.7) {
            isDup = true;
            break;
          }
        }
        if (isDup) {
          totalRejected++;
          continue;
        }

        existingStems.push(q.stem);

        const subtopicVal =
          chunk.track === "canada"
            ? `${canadaCat?.name || chunk.name} [canada/csmls]`
            : chunk.track === "usa"
              ? `${usaArea?.name || chunk.name} [usa/ascp]`
              : `${chunk.name} [both]`;

        try {
          await pool.query(
            `INSERT INTO allied_questions (id, career_type, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, exam_trap, clinical_pearls, safety_note, distractor_rationales, is_free, status, batch_id, created_at)
             VALUES (gen_random_uuid(), 'mlt', $1, $2, $3, $4, $5, $6, $7, $8, $9, 'mcq', $10, $11, $12, $13, false, 'draft', $14, NOW())`,
            [
              q.stem,
              JSON.stringify(q.options.slice(0, 4)),
              typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
              q.rationaleLong || "",
              q.learningObjective || "",
              chunk.name,
              subtopicVal,
              q.difficulty || 3,
              q.cognitiveLevel || "application",
              q.examTrap || null,
              JSON.stringify(q.clinicalPearls || []),
              q.safetyNote || null,
              JSON.stringify(q.distractorRationales || []),
              batchId,
            ]
          );
          totalAccepted++;
        } catch (dbErr: any) {
          console.log("  DB error:", dbErr.message);
          totalRejected++;
        }
      }
      console.log(`  Running total: accepted=${totalAccepted}, rejected=${totalRejected}`);
    } catch (e: any) {
      console.error(`  Error: ${e.message}`);
    }
  }

  await pool.query(
    "UPDATE mlt_generation_batches SET status = $1, generated_count = $2, accepted_count = $3, rejected_count = $4, completed_at = NOW() WHERE id = $5",
    ["completed", totalAccepted + totalRejected, totalAccepted, totalRejected, batchId]
  );

  console.log("");
  console.log("=== SEED COMPLETE ===");
  console.log("Batch:", batchId);
  console.log("Accepted:", totalAccepted);
  console.log("Rejected:", totalRejected);

  process.exit(0);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
