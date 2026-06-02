import pg from "pg";
import { getPreflightCheckedPool } from "./environment-write-service";
import { hasSeparateProdDb } from "./db";

const TOTAL_TARGET = 1400;
const BATCH_SIZE = 10;
const SIMILARITY_THRESHOLD = 0.7;

async function getOpenAI() {
  const OpenAI = (await import("openai")).default;
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  });
}

/* =========================
   UTILITIES
========================= */

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function similarity(a: string, b: string) {
  const A = new Set(normalize(a).split(" "));
  const B = new Set(normalize(b).split(" "));
  const intersection = [...A].filter((x) => B.has(x)).length;
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : intersection / union;
}

function isValid(q: any) {
  return (
    q?.stem?.length > 30 &&
    Array.isArray(q?.options) &&
    q.options.length === 4 &&
    typeof q.correctAnswer === "number" &&
    q.rationaleLong?.length > 50
  );
}

/* =========================
   PROMPT
========================= */

function buildPrompt(discipline: string, count: number) {
  return {
    system: `You are an expert MLT exam writer.`,
    user: `Generate ${count} clinical vignette questions for ${discipline}.
Return JSON array only.`,
  };
}

/* =========================
   MAIN
========================= */

async function main() {
  console.log(`[MLT] Starting generation`);

  const pool = await getPreflightCheckedPool(
    hasSeparateProdDb() ? "production" : "development",
    "MLT"
  );

  const openai = await getOpenAI();

  const existing = new Set<string>();

  const existingRes = await pool.query(
    `SELECT stem FROM allied_questions WHERE career_type='mlt'`
  );

  for (const row of existingRes.rows) {
    existing.add(normalize(row.stem));
  }

  console.log(`[MLT] Existing questions: ${existing.size}`);

  let accepted = 0;
  let rejected = 0;

  while (accepted < TOTAL_TARGET) {
    const remaining = TOTAL_TARGET - accepted;
    const batchSize = Math.min(BATCH_SIZE, remaining);

    const { system, user } = buildPrompt("General MLT", batchSize);

    try {
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.7,
      });

      let parsed: any[] = [];

      try {
        const content = res.choices[0]?.message?.content ?? "";
        parsed = JSON.parse(
          content.match(/\[[\s\S]*\]/)?.[0] || "[]"
        );
      } catch {
        console.warn("[MLT] Parse failed");
        continue;
      }

      for (const q of parsed) {
        if (!isValid(q)) {
          rejected++;
          continue;
        }

        const norm = normalize(q.stem);

        let duplicate = false;

        for (const ex of existing) {
          if (similarity(norm, ex) > SIMILARITY_THRESHOLD) {
            duplicate = true;
            break;
          }
        }

        if (duplicate) {
          rejected++;
          continue;
        }

        existing.add(norm);

        try {
          await pool.query(
            `INSERT INTO allied_questions
            (career_type, stem, options, correct_answer, rationale_long)
            VALUES ('mlt',$1,$2,$3,$4)`,
            [
              q.stem,
              JSON.stringify(q.options),
              q.correctAnswer,
              q.rationaleLong,
            ]
          );

          accepted++;
        } catch {
          rejected++;
        }
      }

      console.log(`[MLT] Progress: ${accepted}/${TOTAL_TARGET}`);

      await new Promise((r) => setTimeout(r, 300));
    } catch (err: any) {
      console.error("[MLT] Batch failed:", err.message);
    }
  }

  console.log(`[MLT] DONE`);
  console.log(`[MLT] Accepted: ${accepted}`);
  console.log(`[MLT] Rejected: ${rejected}`);

  await pool.end();
  process.exit(0);
}

main();