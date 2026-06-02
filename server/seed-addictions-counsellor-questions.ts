import { pool } from "./storage";
import OpenAI from "openai";

const CAREER_TYPE = "addictionsCounsellor";
const TOTAL_QUESTIONS = 1000;
const SIMILARITY_THRESHOLD = 0.80;
const MIN_RATIONALE_WORDS = 20;

const DOMAINS: Record<string, { weight: number; subtopics: string[] }> = {
  "Substance Use Disorders": { weight: 0.18, subtopics: ["Alcohol Use Disorder", "Opioid Use Disorder", "Stimulant Use Disorder", "Cannabis Use Disorder", "Hallucinogen Effects", "Polysubstance Use", "Nicotine Dependence", "Sedative/Hypnotic Use"] },
  "Withdrawal Syndromes": { weight: 0.16, subtopics: ["Alcohol Withdrawal/DTs", "Opioid Withdrawal", "Benzodiazepine Withdrawal", "Stimulant Withdrawal", "Nicotine Withdrawal", "Neonatal Abstinence Syndrome", "CIWA/COWS Scales"] },
  "Treatment Modalities": { weight: 0.18, subtopics: ["MAT (Methadone/Buprenorphine/Naltrexone)", "CBT for Addiction", "Contingency Management", "12-Step Facilitation", "Therapeutic Communities", "Detox Protocols", "Outpatient vs Inpatient"] },
  "Relapse Prevention": { weight: 0.14, subtopics: ["Relapse Warning Signs", "Coping Strategies", "Trigger Identification", "Recovery Capital", "Gorski Model", "HALT Assessment", "Continuing Care Planning"] },
  "Motivational Interviewing": { weight: 0.14, subtopics: ["OARS Techniques", "Stages of Change", "Change Talk vs Sustain Talk", "Rolling with Resistance", "Decisional Balance", "Readiness Rulers", "MI Spirit"] },
  "Harm Reduction": { weight: 0.10, subtopics: ["Naloxone Distribution", "Needle Exchange", "Safe Consumption Sites", "Drug Checking", "Overdose Prevention", "Managed Alcohol Programs", "Housing First"] },
  "Co-occurring Disorders": { weight: 0.10, subtopics: ["Dual Diagnosis Assessment", "Integrated Treatment", "PTSD and SUD", "Depression and SUD", "Psychosis and SUD", "Screening Tools (AUDIT, DAST, CAGE)"] },
};

const LESSON_SLUGS: Record<string, string> = {
  "Alcohol Use Disorder": "alcohol-use-disorder", "Opioid Use Disorder": "opioid-use-disorder",
  "Stimulant Use Disorder": "stimulant-use-disorder", "Cannabis Use Disorder": "cannabis-use-disorder",
  "Hallucinogen Effects": "hallucinogen-effects", "Polysubstance Use": "polysubstance-use",
  "Nicotine Dependence": "nicotine-dependence", "Sedative/Hypnotic Use": "sedative-hypnotic-use",
  "Alcohol Withdrawal/DTs": "alcohol-withdrawal", "Opioid Withdrawal": "opioid-withdrawal",
  "Benzodiazepine Withdrawal": "benzodiazepine-withdrawal", "Stimulant Withdrawal": "stimulant-withdrawal",
  "Nicotine Withdrawal": "nicotine-withdrawal", "Neonatal Abstinence Syndrome": "neonatal-abstinence-syndrome",
  "CIWA/COWS Scales": "ciwa-cows-scales", "MAT (Methadone/Buprenorphine/Naltrexone)": "medication-assisted-treatment",
  "CBT for Addiction": "cbt-for-addiction", "Contingency Management": "contingency-management",
  "12-Step Facilitation": "twelve-step-facilitation", "Therapeutic Communities": "therapeutic-communities",
  "Detox Protocols": "detox-protocols", "Outpatient vs Inpatient": "outpatient-vs-inpatient",
  "Relapse Warning Signs": "relapse-warning-signs", "Coping Strategies": "coping-strategies",
  "Trigger Identification": "trigger-identification", "Recovery Capital": "recovery-capital",
  "Gorski Model": "gorski-model", "HALT Assessment": "halt-assessment",
  "Continuing Care Planning": "continuing-care-planning", "OARS Techniques": "oars-techniques",
  "Stages of Change": "stages-of-change", "Change Talk vs Sustain Talk": "change-talk-sustain-talk",
  "Rolling with Resistance": "rolling-with-resistance", "Decisional Balance": "decisional-balance",
  "Readiness Rulers": "readiness-rulers", "MI Spirit": "mi-spirit",
  "Naloxone Distribution": "naloxone-distribution", "Needle Exchange": "needle-exchange",
  "Safe Consumption Sites": "safe-consumption-sites", "Drug Checking": "drug-checking",
  "Overdose Prevention": "overdose-prevention", "Managed Alcohol Programs": "managed-alcohol-programs",
  "Housing First": "housing-first", "Dual Diagnosis Assessment": "dual-diagnosis-assessment",
  "Integrated Treatment": "integrated-treatment", "PTSD and SUD": "ptsd-and-sud",
  "Depression and SUD": "depression-and-sud", "Psychosis and SUD": "psychosis-and-sud",
  "Screening Tools (AUDIT, DAST, CAGE)": "screening-tools-audit-dast-cage",
};

function wc(t: string): number { return t.trim().split(/\s+/).filter(Boolean).length; }

function cosSim(a: string, b: string): number {
  const wA = a.toLowerCase().split(/\s+/), wB = b.toLowerCase().split(/\s+/);
  const v = new Set([...wA, ...wB]);
  const vA: number[] = [], vB: number[] = [];
  for (const w of v) { vA.push(wA.filter(x=>x===w).length); vB.push(wB.filter(x=>x===w).length); }
  let d=0,mA=0,mB=0;
  for (let i=0;i<vA.length;i++) { d+=vA[i]*vB[i]; mA+=vA[i]*vA[i]; mB+=vB[i]*vB[i]; }
  const dn=Math.sqrt(mA)*Math.sqrt(mB);
  return dn===0?0:d/dn;
}

function validate(q: any, stems: string[]): { ok: boolean; why: string[] } {
  const r: string[] = [];
  if (!q.learningObjective || q.learningObjective.length < 10) r.push("no_lo");
  if (!q.stem || q.stem.length < 20) r.push("short_stem");
  if (!q.options || !Array.isArray(q.options) || q.options.length < 4) r.push("bad_opts");
  if (q.correctAnswer === undefined || q.correctAnswer === null) r.push("no_answer");
  if (!q.difficulty || q.difficulty < 1 || q.difficulty > 5) r.push("bad_diff");
  if (wc(q.rationaleLong || "") < MIN_RATIONALE_WORDS) r.push("short_rationale");
  if (!q.distractorRationales || !Array.isArray(q.distractorRationales) || q.distractorRationales.length < 3) r.push("no_dist_rat");
  const opts = (q.options||[]).map((o:string)=>(o||"").toLowerCase());
  if (opts.some((o:string)=>o.includes("all of the above")||o.includes("none of the above"))) r.push("aota");
  for (const s of stems) { if (cosSim(q.stem, s) > SIMILARITY_THRESHOLD) { r.push("dup"); break; } }
  return { ok: r.length === 0, why: r };
}

function makeFlashcards(q: any) {
  const cards: Array<{cardType:string;front:string;back:string;rationale:string}> = [];
  const opts = typeof q.options==='string'?JSON.parse(q.options):q.options;
  const correctOpt = opts?.[q.correct_answer] || opts?.[0] || "See rationale";
  cards.push({ cardType:"definition", front:q.learning_objective || q.subtopic || "Key concept", back:correctOpt, rationale:(q.rationale_long||"").substring(0,500) });
  const pearls = typeof q.clinical_pearls==='string'?JSON.parse(q.clinical_pearls):q.clinical_pearls;
  if (pearls?.length > 0) cards.push({ cardType:"clinical_decision", front:`Clinical decision: ${q.subtopic} - Key clinical pearl?`, back:pearls[0] || "See rationale", rationale:(pearls.slice(1).join(" | ")) || "N/A" });
  if (q.safety_note) cards.push({ cardType:"red_flag", front:`Red Flag: ${q.subtopic} - Safety concern?`, back:q.safety_note, rationale:`From: ${q.blueprint_category}` });
  return cards;
}

function prompt(domain: string, subtopic: string, n: number, diff: number, cog: string): string {
  const slug = LESSON_SLUGS[subtopic] || subtopic.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  return `Expert Addictions Counsellor exam writer. IC&RC ADC/CASAC/CCAC exams.
Generate ${n} questions for ${domain} > ${subtopic}. Difficulty: ${diff}/5. Cognitive: ${cog}.

JSON array format - each object must have ALL fields:
{"learningObjective":"...","blueprintCategory":"${domain}","subtopic":"${subtopic}","difficulty":${diff},"cognitiveLevel":"${cog}","questionType":"multiple-choice","stem":"Clinical vignette 50-100 words with specific patient details","options":["A","B","C","D"],"correctAnswer":0,"rationaleLong":"Explain why correct, why each distractor wrong, clinical reasoning, exam trap analysis. See: ${subtopic} → /addictions-counsellor/lessons/${slug}","examTrap":"How this tricks test-takers","clinicalPearls":["Pearl1","Pearl2","Pearl3"],"safetyNote":"Safety info","distractorRationales":["Why A","Why B","Why C","Why D"],"isFree":false}

Rules: No "all/none of the above". Unique clinical scenarios. Include specific clinical values. Return ONLY valid JSON array.`;
}

async function ensureBP(): Promise<string> {
  const e = await pool.query("SELECT id FROM allied_blueprints WHERE career_type=$1 AND is_active=true",[CAREER_TYPE]);
  if (e.rows[0]) return e.rows[0].id;
  const v = await pool.query("SELECT COALESCE(MAX(version),0) as v FROM allied_blueprints WHERE career_type=$1",[CAREER_TYPE]);
  const nv = (v.rows[0]?.v||0)+1;
  const dw: Record<string,number> = {};
  Object.entries(DOMAINS).forEach(([d,c])=>{dw[d]=c.weight;});
  const r = await pool.query(
    `INSERT INTO allied_blueprints (career_type,version,domains,difficulty_distribution,cognitive_distribution,allowed_question_types,is_active) VALUES ($1,$2,$3,$4,$5,$6,true) RETURNING id`,
    [CAREER_TYPE,nv,JSON.stringify(dw),JSON.stringify({1:0.10,2:0.20,3:0.35,4:0.25,5:0.10}),JSON.stringify({recall:{min:0.10,max:0.30},application:{min:0.40,max:0.60},analysis:{min:0.20,max:0.40}}),JSON.stringify(["multiple-choice"])]
  );
  return r.rows[0].id;
}

async function main() {
  const openai = new OpenAI({ apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY, baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL });
  const bpId = await ensureBP();

  const cntRes = await pool.query("SELECT COUNT(*) as c FROM allied_questions WHERE career_type=$1 AND status='approved'",[CAREER_TYPE]);
  let approved = parseInt(cntRes.rows[0].c);
  console.log(`Have ${approved}/${TOTAL_QUESTIONS} approved`);
  if (approved >= TOTAL_QUESTIONS) { await verify(); return; }

  const stemRes = await pool.query("SELECT stem FROM allied_questions WHERE career_type=$1 AND status!='rejected'",[CAREER_TYPE]);
  const stems: string[] = stemRes.rows.map((r:any)=>r.stem);

  const assignments: Array<{domain:string;subtopic:string;count:number}> = [];
  for (const [domain,config] of Object.entries(DOMAINS)) {
    const dt = Math.round(TOTAL_QUESTIONS * config.weight);
    const ps = Math.floor(dt / config.subtopics.length);
    let rem = dt - ps * config.subtopics.length;
    for (const st of config.subtopics) {
      assignments.push({domain,subtopic:st,count:ps+(rem>0?1:0)});
      if (rem>0) rem--;
    }
  }

  const diffs = [1,2,2,3,3,3,3,4,4,5];
  const cogs = ["recall","application","application","application","analysis","analysis"];
  let batchNum = 0;
  let totalRej = 0;
  let totalFC = 0;

  for (const asgn of assignments) {
    if (approved >= TOTAL_QUESTIONS) break;
    const needed = Math.min(asgn.count, TOTAL_QUESTIONS - approved);
    if (needed <= 0) continue;
    batchNum++;

    const batchRes = await pool.query(
      "INSERT INTO allied_batch_runs (career_type,blueprint_id,requested_count,status) VALUES ($1,$2,$3,'running') RETURNING id",
      [CAREER_TYPE,bpId,needed]
    );
    const batchId = batchRes.rows[0].id;
    let bAcc=0, bRej=0, bGen=0;

    const callSize = 5;
    const iters = Math.ceil(needed / callSize);

    for (let i=0; i<iters && bAcc<needed; i++) {
      const n = Math.min(callSize, needed-bAcc);
      const d = diffs[(i*callSize) % diffs.length];
      const c = cogs[(i*callSize) % cogs.length];

      try {
        const resp = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: prompt(asgn.domain, asgn.subtopic, n, d, c) },
            { role: "user", content: `Generate ${n} questions. Valid JSON array only.` },
          ],
          max_tokens: 16384,
          temperature: 0.85,
        });

        const txt = resp.choices[0]?.message?.content || "";
        let qs: any[];
        try { const m = txt.match(/\[[\s\S]*\]/); qs = m ? JSON.parse(m[0]) : []; } catch { qs = []; }

        for (const q of qs) {
          bGen++;
          const v = validate(q, stems);
          if (!v.ok) {
            bRej++; totalRej++;
            await pool.query(
              `INSERT INTO allied_questions (career_type,blueprint_id,batch_id,stem,options,correct_answer,rationale_long,learning_objective,blueprint_category,subtopic,difficulty,cognitive_level,question_type,exam_trap,clinical_pearls,safety_note,distractor_rationales,is_free,status,flag_reason)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,'rejected',$19)`,
              [CAREER_TYPE,bpId,batchId,q.stem||"",JSON.stringify(q.options||[]),q.correctAnswer||0,q.rationaleLong||"",q.learningObjective||"",q.blueprintCategory||asgn.domain,q.subtopic||asgn.subtopic,q.difficulty||3,q.cognitiveLevel||"application",q.questionType||"multiple-choice",q.examTrap||null,JSON.stringify(q.clinicalPearls||[]),q.safetyNote||null,JSON.stringify(q.distractorRationales||[]),q.isFree||false,v.why.join(",")]
            );
            continue;
          }
          bAcc++;
          stems.push(q.stem);
          await pool.query(
            `INSERT INTO allied_questions (career_type,blueprint_id,batch_id,stem,options,correct_answer,rationale_long,learning_objective,blueprint_category,subtopic,difficulty,cognitive_level,question_type,exam_trap,clinical_pearls,safety_note,distractor_rationales,is_free,status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,'pending')`,
            [CAREER_TYPE,bpId,batchId,q.stem,JSON.stringify(q.options),q.correctAnswer,q.rationaleLong,q.learningObjective,q.blueprintCategory||asgn.domain,q.subtopic||asgn.subtopic,q.difficulty,q.cognitiveLevel,q.questionType,q.examTrap||null,JSON.stringify(q.clinicalPearls||[]),q.safetyNote||null,JSON.stringify(q.distractorRationales||[]),q.isFree||false]
          );
        }
      } catch (err: any) {
        console.error(`  API err: ${err.message}`);
        await new Promise(r=>setTimeout(r,1000));
      }
    }

    await pool.query("UPDATE allied_batch_runs SET generated_count=$1,accepted_count=$2,rejected_count=$3,status='completed',completed_at=NOW() WHERE id=$4",[bGen,bAcc,bRej,batchId]);

    const pRes = await pool.query("SELECT * FROM allied_questions WHERE batch_id=$1 AND status='pending'",[batchId]);
    if (pRes.rows.length > 0) {
      await pool.query("UPDATE allied_questions SET status='approved' WHERE batch_id=$1 AND status='pending'",[batchId]);
      let fc=0;
      for (const q of pRes.rows) {
        for (const card of makeFlashcards(q)) {
          await pool.query("INSERT INTO allied_flashcards (career_type,question_id,card_type,front,back,rationale,blueprint_category,subtopic) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
            [q.career_type,q.id,card.cardType,card.front,card.back,card.rationale,q.blueprint_category,q.subtopic]);
          fc++;
        }
      }
      totalFC+=fc;
      await pool.query("UPDATE allied_batch_runs SET status='committed' WHERE id=$1",[batchId]);
    }
    approved += bAcc;
    console.log(`B${batchNum} ${asgn.domain}/${asgn.subtopic}: +${bAcc} acc, ${bRej} rej, ${totalFC} fc | ${approved}/${TOTAL_QUESTIONS}`);
  }

  console.log(`\nDone: ${approved} approved, ${totalRej} rejected, ${totalFC} flashcards`);
  await verify();
}

async function verify() {
  console.log("\n=== VERIFICATION ===");
  const t = await pool.query("SELECT COUNT(*) as c FROM allied_questions WHERE career_type=$1 AND status='approved'",[CAREER_TYPE]);
  console.log(`Approved: ${t.rows[0].c}`);
  const dom = await pool.query("SELECT blueprint_category,COUNT(*) as c FROM allied_questions WHERE career_type=$1 AND status='approved' GROUP BY blueprint_category ORDER BY c DESC",[CAREER_TYPE]);
  console.log("Domains:"); for (const r of dom.rows) console.log(`  ${r.blueprint_category}: ${r.c}`);
  const diff = await pool.query("SELECT difficulty,COUNT(*) as c FROM allied_questions WHERE career_type=$1 AND status='approved' GROUP BY difficulty ORDER BY difficulty",[CAREER_TYPE]);
  const total=parseInt(t.rows[0].c);
  console.log("Difficulty:"); for (const r of diff.rows) console.log(`  L${r.difficulty}: ${r.c} (${total>0?((parseInt(r.c)/total)*100).toFixed(1):0}%)`);
  const cog = await pool.query("SELECT cognitive_level,COUNT(*) as c FROM allied_questions WHERE career_type=$1 AND status='approved' GROUP BY cognitive_level",[CAREER_TYPE]);
  console.log("Cognitive:"); for (const r of cog.rows) console.log(`  ${r.cognitive_level}: ${r.c} (${total>0?((parseInt(r.c)/total)*100).toFixed(1):0}%)`);
  const fc = await pool.query("SELECT COUNT(*) as c FROM allied_flashcards WHERE career_type=$1",[CAREER_TYPE]);
  console.log(`Flashcards: ${fc.rows[0].c}`);
  const rej = await pool.query("SELECT COUNT(*) as c FROM allied_questions WHERE career_type=$1 AND status='rejected'",[CAREER_TYPE]);
  const all = await pool.query("SELECT COUNT(*) as c FROM allied_questions WHERE career_type=$1",[CAREER_TYPE]);
  console.log(`Rejection rate: ${parseInt(all.rows[0].c)>0?((parseInt(rej.rows[0].c)/parseInt(all.rows[0].c))*100).toFixed(1):0}%`);
  console.log("=== DONE ===");
}

main().then(()=>process.exit(0)).catch(e=>{console.error("FATAL:",e);process.exit(1)});
