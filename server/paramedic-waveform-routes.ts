import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    result[camelKey] = snakeToCamel(value);
  }
  return result;
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

const ALLOWED_COLUMNS = [
  "waveform_type", "name", "slug", "category", "svg_path_data",
  "clinical_annotations", "identifying_features", "associated_conditions",
  "treatment_notes", "rate", "regularity", "clinical_significance",
  "difficulty", "visibility_tier", "content_domain", "sort_order", "status",
];

export function registerParamedicWaveformRoutes(app: Express) {
  app.get("/api/paramedic-waveforms/categories/list", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT DISTINCT category, COUNT(*)::int as count FROM paramedic_waveform_assets WHERE content_domain = 'paramedic' AND status = 'published' GROUP BY category ORDER BY category`
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic-waveforms", async (req: Request, res: Response) => {
    try {
      const { category, difficulty, waveformType, search } = req.query;
      let where = "WHERE content_domain = 'paramedic' AND status = 'published'";
      const params: any[] = [];
      let idx = 1;

      if (category) {
        where += ` AND category = $${idx}`;
        params.push(category);
        idx++;
      }
      if (difficulty) {
        where += ` AND difficulty = $${idx}`;
        params.push(difficulty);
        idx++;
      }
      if (waveformType) {
        where += ` AND waveform_type = $${idx}`;
        params.push(waveformType);
        idx++;
      }
      if (search) {
        where += ` AND (name ILIKE $${idx} OR category ILIKE $${idx})`;
        params.push(`%${search}%`);
        idx++;
      }

      const result = await pool.query(
        `SELECT * FROM paramedic_waveform_assets ${where} ORDER BY sort_order ASC, name ASC`,
        params
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic-waveforms/:idOrSlug", async (req: Request, res: Response) => {
    try {
      const val = req.params.idOrSlug;
      const result = await pool.query(
        `SELECT * FROM paramedic_waveform_assets WHERE (id = $1 OR slug = $1) AND content_domain = 'paramedic' AND status = 'published'`,
        [val]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/paramedic-waveforms", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { search, category, status } = req.query;
      let where = "WHERE content_domain = 'paramedic'";
      const params: any[] = [];
      let idx = 1;

      if (status) {
        where += ` AND status = $${idx}`;
        params.push(status);
        idx++;
      }
      if (category) {
        where += ` AND category = $${idx}`;
        params.push(category);
        idx++;
      }
      if (search) {
        where += ` AND (name ILIKE $${idx} OR slug ILIKE $${idx})`;
        params.push(`%${search}%`);
        idx++;
      }

      const result = await pool.query(
        `SELECT * FROM paramedic_waveform_assets ${where} ORDER BY sort_order ASC, name ASC`,
        params
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/paramedic-waveforms", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const body = req.body;
      if (!body.name || !body.slug || !body.category || !body.waveformType) {
        return res.status(400).json({ error: "name, slug, category, and waveformType are required" });
      }

      const existing = await pool.query(
        `SELECT id FROM paramedic_waveform_assets WHERE slug = $1`,
        [body.slug]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "Slug already exists" });
      }

      const cols: string[] = [];
      const vals: any[] = [];
      for (const [key, value] of Object.entries(body)) {
        const snakeKey = camelToSnake(key);
        if (!ALLOWED_COLUMNS.includes(snakeKey)) continue;
        cols.push(snakeKey);
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          vals.push(JSON.stringify(value));
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
          vals.push(JSON.stringify(value));
        } else {
          vals.push(value);
        }
      }

      if (!cols.includes("content_domain")) {
        cols.push("content_domain");
        vals.push("paramedic");
      }

      const placeholders = vals.map((_, i) => `$${i + 1}`).join(", ");
      const query = `INSERT INTO paramedic_waveform_assets (id, ${cols.join(", ")}, created_at, updated_at) VALUES (gen_random_uuid(), ${placeholders}, NOW(), NOW()) RETURNING *`;
      const result = await pool.query(query, vals);
      res.status(201).json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/paramedic-waveforms/:id", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const body = req.body;
      const sets: string[] = [];
      const vals: any[] = [];
      let idx = 1;

      for (const [key, value] of Object.entries(body)) {
        const snakeKey = camelToSnake(key);
        if (!ALLOWED_COLUMNS.includes(snakeKey) || snakeKey === "content_domain") continue;
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          sets.push(`${snakeKey} = $${idx}::jsonb`);
          vals.push(JSON.stringify(value));
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
          sets.push(`${snakeKey} = $${idx}::jsonb`);
          vals.push(JSON.stringify(value));
        } else {
          sets.push(`${snakeKey} = $${idx}`);
          vals.push(value);
        }
        idx++;
      }

      sets.push("updated_at = NOW()");
      vals.push(req.params.id);
      const query = `UPDATE paramedic_waveform_assets SET ${sets.join(", ")} WHERE id = $${idx} AND content_domain = 'paramedic' RETURNING *`;
      const result = await pool.query(query, vals);
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/paramedic-waveforms/:id", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query(
        `DELETE FROM paramedic_waveform_assets WHERE id = $1 AND content_domain = 'paramedic'`,
        [req.params.id]
      );
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/paramedic-waveforms/seed", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const count = await seedWaveformData();
      res.json({ ok: true, count });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}

export async function seedWaveformData(): Promise<number> {
  const existing = await pool.query(`SELECT COUNT(*)::int as cnt FROM paramedic_waveform_assets`);
  if (parseInt(existing.rows[0]?.cnt || "0") > 0) {
    return 0;
  }

  const waveforms = getWaveformSeedData();
  for (const w of waveforms) {
    await pool.query(
      `INSERT INTO paramedic_waveform_assets (id, waveform_type, name, slug, category, svg_path_data, clinical_annotations, identifying_features, associated_conditions, treatment_notes, rate, regularity, clinical_significance, difficulty, visibility_tier, content_domain, sort_order, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'paramedic', $15, 'published', NOW(), NOW())`,
      [
        w.waveformType, w.name, w.slug, w.category,
        JSON.stringify(w.svgPathData), JSON.stringify(w.clinicalAnnotations),
        w.identifyingFeatures, w.associatedConditions, w.treatmentNotes,
        w.rate, w.regularity, w.clinicalSignificance,
        w.difficulty, w.visibilityTier, w.sortOrder,
      ]
    );
  }

  console.log(`Seeded ${waveforms.length} paramedic waveform assets`);
  return waveforms.length;
}

function getWaveformSeedData() {
  return [
    {
      waveformType: "ecg-rhythm",
      name: "Normal Sinus Rhythm",
      slug: "normal-sinus-rhythm",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 15,50" },
          { type: "qrs-complex", path: "M 15,50 L 17,55 L 20,15 L 23,60 L 25,50" },
          { type: "st-segment", path: "M 25,50 L 30,50" },
          { type: "t-wave", path: "M 30,50 Q 37,35 44,50" },
          { type: "baseline", path: "M 44,50 L 70,50" },
        ],
        repeatInterval: 70,
        totalWidth: 700,
      },
      clinicalAnnotations: {
        prInterval: "0.12-0.20 sec",
        qrsDuration: "< 0.12 sec",
        qtInterval: "0.36-0.44 sec",
      },
      identifyingFeatures: ["Regular rate 60-100 bpm", "Each P wave followed by QRS", "Consistent PR interval 0.12-0.20s", "Upright P waves in Lead II"],
      associatedConditions: ["Normal healthy heart"],
      treatmentNotes: "No treatment required — this is the normal cardiac rhythm.",
      rate: "60-100 bpm",
      regularity: "Regular",
      clinicalSignificance: "Normal baseline rhythm. All intervals within normal limits. This is the standard against which all other rhythms are compared.",
      difficulty: "beginner",
      visibilityTier: "free",
      sortOrder: 1,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Sinus Bradycardia",
      slug: "sinus-bradycardia",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 15,50" },
          { type: "qrs-complex", path: "M 15,50 L 17,55 L 20,15 L 23,60 L 25,50" },
          { type: "st-segment", path: "M 25,50 L 30,50" },
          { type: "t-wave", path: "M 30,50 Q 37,35 44,50" },
          { type: "baseline", path: "M 44,50 L 100,50" },
        ],
        repeatInterval: 100,
        totalWidth: 700,
      },
      clinicalAnnotations: { prInterval: "0.12-0.20 sec", qrsDuration: "< 0.12 sec" },
      identifyingFeatures: ["Rate < 60 bpm", "Normal P-QRS-T morphology", "Regular rhythm", "One P wave per QRS"],
      associatedConditions: ["Athletes (physiologic)", "Hypothermia", "Hypothyroidism", "Beta-blocker/calcium channel blocker use", "Increased intracranial pressure"],
      treatmentNotes: "If symptomatic (hypotension, altered mental status): Atropine 0.5mg IV q3-5min (max 3mg). Consider transcutaneous pacing. Dopamine or epinephrine infusion if atropine ineffective.",
      rate: "< 60 bpm",
      regularity: "Regular",
      clinicalSignificance: "May be normal in athletes or during sleep. Concerning when causing symptoms of poor perfusion.",
      difficulty: "beginner",
      visibilityTier: "free",
      sortOrder: 2,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Sinus Tachycardia",
      slug: "sinus-tachycardia",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 4,42 8,50" },
          { type: "pr-segment", path: "M 8,50 L 12,50" },
          { type: "qrs-complex", path: "M 12,50 L 14,55 L 16,15 L 18,60 L 20,50" },
          { type: "st-segment", path: "M 20,50 L 24,50" },
          { type: "t-wave", path: "M 24,50 Q 29,38 34,50" },
          { type: "baseline", path: "M 34,50 L 45,50" },
        ],
        repeatInterval: 45,
        totalWidth: 700,
      },
      clinicalAnnotations: { prInterval: "0.12-0.20 sec", qrsDuration: "< 0.12 sec" },
      identifyingFeatures: ["Rate > 100 bpm", "Normal P-QRS-T morphology", "Regular rhythm", "P waves may merge with preceding T waves at high rates"],
      associatedConditions: ["Pain", "Fever", "Hypovolemia", "Anxiety", "Hypoxia", "PE", "Sepsis", "Anemia"],
      treatmentNotes: "Treat the underlying cause. Do NOT cardiovert sinus tachycardia. Volume resuscitation if hypovolemic. Antipyretics for fever. Analgesia for pain.",
      rate: "> 100 bpm",
      regularity: "Regular",
      clinicalSignificance: "A compensatory response. Always search for and treat the underlying cause rather than the tachycardia itself.",
      difficulty: "beginner",
      visibilityTier: "free",
      sortOrder: 3,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Atrial Fibrillation",
      slug: "atrial-fibrillation",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "fibrillation", path: "M 0,50 Q 2,47 4,50 Q 6,53 8,50 Q 10,48 12,50" },
          { type: "qrs-complex", path: "M 12,50 L 14,55 L 16,15 L 18,60 L 20,50" },
          { type: "t-wave", path: "M 22,50 Q 27,37 32,50" },
          { type: "fibrillation", path: "M 32,50 Q 35,47 38,50 Q 40,52 42,50 Q 44,48 46,50 Q 49,52 52,50 Q 54,47 55,50" },
          { type: "qrs-complex", path: "M 55,50 L 57,55 L 59,15 L 61,60 L 63,50" },
          { type: "t-wave", path: "M 65,50 Q 70,37 75,50" },
          { type: "fibrillation", path: "M 75,50 Q 77,48 79,50 Q 82,53 85,50" },
        ],
        repeatInterval: 85,
        totalWidth: 700,
        irregularSpacing: true,
      },
      clinicalAnnotations: { prInterval: "None (no organized P waves)", qrsDuration: "< 0.12 sec (usually)" },
      identifyingFeatures: ["Irregularly irregular rhythm", "No discernible P waves", "Fibrillatory baseline", "Variable R-R intervals"],
      associatedConditions: ["Hypertension", "Heart failure", "Valvular disease", "Hyperthyroidism", "PE", "Post-cardiac surgery", "Alcohol use (holiday heart)"],
      treatmentNotes: "Rate control: Diltiazem, beta-blockers, or digoxin. If unstable with rapid ventricular response: synchronized cardioversion. Anticoagulation for stroke prevention (CHA2DS2-VASc score).",
      rate: "Variable (uncontrolled often 100-180 bpm)",
      regularity: "Irregularly irregular",
      clinicalSignificance: "Most common sustained arrhythmia. Loss of atrial kick reduces cardiac output ~25%. Major risk factor for stroke.",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 4,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Atrial Flutter",
      slug: "atrial-flutter",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "flutter-waves", path: "M 0,50 Q 5,35 10,50 Q 15,65 20,50 Q 25,35 30,50 Q 35,65 40,50" },
          { type: "qrs-complex", path: "M 40,50 L 42,55 L 44,15 L 46,60 L 48,50" },
          { type: "flutter-waves", path: "M 48,50 Q 53,35 58,50 Q 63,65 68,50 Q 73,35 78,50 Q 83,65 88,50" },
          { type: "qrs-complex", path: "M 88,50 L 90,55 L 92,15 L 94,60 L 96,50" },
        ],
        repeatInterval: 96,
        totalWidth: 700,
      },
      clinicalAnnotations: { atrialRate: "~300 bpm", ventricularRate: "~150 bpm (with 2:1 block)" },
      identifyingFeatures: ["Sawtooth flutter waves (best in II, III, aVF, V1)", "Regular atrial rate ~300 bpm", "Ventricular rate depends on conduction ratio (2:1, 3:1, 4:1)", "Regular ventricular rhythm if fixed block"],
      associatedConditions: ["CAD", "Heart failure", "COPD", "Mitral valve disease", "Post cardiac surgery"],
      treatmentNotes: "Rate control with calcium channel blockers or beta-blockers. Synchronized cardioversion (50-100J) if unstable. Ablation is definitive treatment.",
      rate: "Atrial ~300, Ventricular depends on block ratio",
      regularity: "Regular (if fixed block ratio)",
      clinicalSignificance: "Organized macro-reentrant atrial circuit. A ventricular rate of ~150 bpm should always raise suspicion for atrial flutter with 2:1 block.",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 5,
    },
    {
      waveformType: "ecg-rhythm",
      name: "SVT (Supraventricular Tachycardia)",
      slug: "svt",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "qrs-complex", path: "M 0,50 L 2,55 L 4,15 L 6,60 L 8,50" },
          { type: "t-wave", path: "M 8,50 Q 12,40 16,50" },
          { type: "baseline", path: "M 16,50 L 25,50" },
        ],
        repeatInterval: 25,
        totalWidth: 700,
      },
      clinicalAnnotations: { prInterval: "Often not measurable (P waves hidden)", qrsDuration: "< 0.12 sec (narrow complex)" },
      identifyingFeatures: ["Narrow complex tachycardia (usually)", "Rate 150-250 bpm", "Regular rhythm", "P waves often buried in QRS or T wave", "Abrupt onset and termination"],
      associatedConditions: ["Accessory pathways (WPW)", "AV nodal reentry", "Caffeine/stimulant use", "Often in otherwise healthy young adults"],
      treatmentNotes: "Vagal maneuvers first (bearing down, carotid massage). Adenosine 6mg rapid IV push, repeat 12mg if needed. If unstable: synchronized cardioversion (50-100J).",
      rate: "150-250 bpm",
      regularity: "Regular",
      clinicalSignificance: "Paroxysmal: sudden onset and offset. Usually not life-threatening but can cause hemodynamic instability if sustained.",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 6,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Ventricular Tachycardia (Monomorphic)",
      slug: "ventricular-tachycardia-mono",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "wide-qrs", path: "M 0,50 L 3,70 L 8,10 L 13,75 L 18,30 L 22,50" },
          { type: "baseline", path: "M 22,50 L 30,50" },
        ],
        repeatInterval: 30,
        totalWidth: 700,
      },
      clinicalAnnotations: { qrsDuration: "> 0.12 sec (wide complex)", prInterval: "AV dissociation common" },
      identifyingFeatures: ["Wide QRS complexes (> 0.12 sec)", "Rate 100-250 bpm", "Regular rhythm", "AV dissociation", "Uniform QRS morphology", "Fusion and capture beats"],
      associatedConditions: ["Myocardial infarction", "Cardiomyopathy", "Electrolyte imbalances (hypokalemia, hypomagnesemia)", "Drug toxicity (digoxin, antiarrhythmics)"],
      treatmentNotes: "Pulseless VT: defibrillation, CPR, epinephrine, amiodarone per ACLS. Stable VT with pulse: amiodarone 150mg IV over 10 min. Unstable with pulse: synchronized cardioversion (100J).",
      rate: "100-250 bpm",
      regularity: "Regular",
      clinicalSignificance: "Life-threatening arrhythmia. Can rapidly deteriorate into VFib. Pulseless VT treated as cardiac arrest.",
      difficulty: "advanced",
      visibilityTier: "free",
      sortOrder: 7,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Ventricular Tachycardia (Polymorphic / Torsades de Pointes)",
      slug: "ventricular-tachycardia-poly",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "polymorphic", path: "M 0,50 L 3,25 L 6,60 L 9,20 L 12,65 L 15,15 L 18,50 L 21,55 L 24,45 L 27,70 L 30,30 L 33,75 L 36,20 L 39,70 L 42,15 L 45,50" },
        ],
        repeatInterval: 45,
        totalWidth: 700,
        twistingAxis: true,
      },
      clinicalAnnotations: { qrsDuration: "Wide, variable", qtProlongation: "Often associated with prolonged QT" },
      identifyingFeatures: ["Twisting of QRS axis around baseline", "Varying QRS amplitude", "Rate 150-300 bpm", "Undulating sinusoidal pattern", "Often preceded by prolonged QT"],
      associatedConditions: ["Prolonged QT syndrome", "Hypomagnesemia", "Hypokalemia", "Drug-induced (antiarrhythmics, antibiotics, antipsychotics)", "Bradycardia"],
      treatmentNotes: "Pulseless: defibrillation. Magnesium sulfate 2g IV over 5-20 min. Correct electrolyte abnormalities. Overdrive pacing to increase rate and shorten QT. Stop offending medications.",
      rate: "150-300 bpm",
      regularity: "Irregular",
      clinicalSignificance: "A specific form of polymorphic VT associated with prolonged QT interval. Different treatment than standard VT — magnesium is first-line.",
      difficulty: "advanced",
      visibilityTier: "paid",
      sortOrder: 8,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Ventricular Fibrillation",
      slug: "ventricular-fibrillation",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "chaotic", path: "M 0,50 Q 3,25 6,55 Q 9,70 12,40 Q 15,20 18,60 Q 21,75 24,35 Q 27,15 30,55 Q 33,70 36,30 Q 39,45 42,65 Q 45,20 48,50 Q 51,70 54,25 Q 57,55 60,40 Q 63,70 66,30 Q 69,50 72,45 Q 75,65 78,35 Q 81,55 84,25" },
        ],
        repeatInterval: 84,
        totalWidth: 700,
      },
      clinicalAnnotations: { qrsDuration: "No identifiable complexes", rhythm: "Chaotic electrical activity" },
      identifyingFeatures: ["No identifiable P waves, QRS, or T waves", "Chaotic undulating waveform", "No organized rhythm", "Coarse VFib has larger amplitude than fine VFib"],
      associatedConditions: ["Acute MI", "Severe electrolyte imbalances", "Drug toxicity", "Electric shock", "Drowning", "Hypothermia"],
      treatmentNotes: "Immediate defibrillation. CPR. Epinephrine 1mg IV q3-5min. Amiodarone 300mg IV (first dose), then 150mg IV. Treat reversible causes (H's and T's).",
      rate: "No measurable rate",
      regularity: "Chaotic",
      clinicalSignificance: "Cardiac arrest rhythm — no effective cardiac output. Most common initial rhythm in sudden cardiac arrest. Survival depends on early defibrillation.",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 9,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Asystole",
      slug: "asystole",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "flatline", path: "M 0,50 L 700,50" },
        ],
        repeatInterval: 700,
        totalWidth: 700,
      },
      clinicalAnnotations: { rhythm: "No electrical activity" },
      identifyingFeatures: ["Flat line (isoelectric)", "No P waves, QRS complexes, or T waves", "Confirm in two leads", "Check cable connections"],
      associatedConditions: ["Prolonged cardiac arrest", "End-stage heart disease", "Massive MI", "Severe hypothermia"],
      treatmentNotes: "CPR. Epinephrine 1mg IV q3-5min. NOT a shockable rhythm — do NOT defibrillate. Search for and treat reversible causes (H's and T's). Consider termination of resuscitation.",
      rate: "None",
      regularity: "None",
      clinicalSignificance: "Non-shockable cardiac arrest rhythm. Carries the worst prognosis of all arrest rhythms. Always confirm in at least 2 leads to rule out fine VFib.",
      difficulty: "beginner",
      visibilityTier: "free",
      sortOrder: 10,
    },
    {
      waveformType: "ecg-rhythm",
      name: "First-Degree Heart Block",
      slug: "first-degree-heart-block",
      category: "Heart Blocks",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 22,50" },
          { type: "qrs-complex", path: "M 22,50 L 24,55 L 26,15 L 28,60 L 30,50" },
          { type: "st-segment", path: "M 30,50 L 35,50" },
          { type: "t-wave", path: "M 35,50 Q 42,35 49,50" },
          { type: "baseline", path: "M 49,50 L 75,50" },
        ],
        repeatInterval: 75,
        totalWidth: 700,
      },
      clinicalAnnotations: { prInterval: "> 0.20 sec (prolonged)", qrsDuration: "< 0.12 sec" },
      identifyingFeatures: ["PR interval > 0.20 sec (> 5 small boxes)", "Each P wave followed by QRS", "Regular rhythm", "Consistent (fixed) prolonged PR"],
      associatedConditions: ["Increased vagal tone", "AV nodal disease", "Digoxin/beta-blocker/CCB use", "Inferior MI", "Myocarditis"],
      treatmentNotes: "Usually benign and requires no treatment. Monitor for progression to higher-degree blocks. Review medications that slow AV conduction.",
      rate: "Normal (60-100 bpm usually)",
      regularity: "Regular",
      clinicalSignificance: "Generally benign. The AV node conducts every impulse but with a delay. Can be a normal finding in athletes.",
      difficulty: "beginner",
      visibilityTier: "free",
      sortOrder: 11,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Second-Degree Heart Block Type I (Wenckebach)",
      slug: "second-degree-heart-block-type-1",
      category: "Heart Blocks",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 17,50" },
          { type: "qrs-complex", path: "M 17,50 L 19,55 L 21,15 L 23,60 L 25,50" },
          { type: "t-wave", path: "M 27,50 Q 32,38 37,50" },
          { type: "baseline", path: "M 37,50 L 45,50" },
          { type: "p-wave", path: "M 45,50 Q 50,40 55,50" },
          { type: "pr-segment", path: "M 55,50 L 65,50" },
          { type: "qrs-complex", path: "M 65,50 L 67,55 L 69,15 L 71,60 L 73,50" },
          { type: "t-wave", path: "M 75,50 Q 80,38 85,50" },
          { type: "baseline", path: "M 85,50 L 93,50" },
          { type: "p-wave", path: "M 93,50 Q 98,40 103,50" },
          { type: "dropped-beat", path: "M 103,50 L 130,50" },
        ],
        repeatInterval: 130,
        totalWidth: 700,
      },
      clinicalAnnotations: { prInterval: "Progressively lengthens until dropped QRS", qrsDuration: "< 0.12 sec" },
      identifyingFeatures: ["Progressive PR prolongation", "Eventual dropped QRS (non-conducted P wave)", "Grouped beating pattern", "Shortest PR follows dropped beat"],
      associatedConditions: ["Inferior MI", "Increased vagal tone", "Digoxin toxicity", "Myocarditis"],
      treatmentNotes: "Usually benign; often transient. Monitor closely. Atropine if symptomatic. Rarely requires pacing. Observe for progression to higher-degree block.",
      rate: "Atrial regular, ventricular slightly irregular",
      regularity: "Irregular (grouped beating)",
      clinicalSignificance: "Usually occurs at AV node level (supra-Hisian). Generally has a benign course. 'Longer, longer, longer, drop — that's a Wenckebach!'",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 12,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Second-Degree Heart Block Type II (Mobitz II)",
      slug: "second-degree-heart-block-type-2",
      category: "Heart Blocks",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 17,50" },
          { type: "qrs-complex", path: "M 17,50 L 19,55 L 21,15 L 23,60 L 25,50" },
          { type: "t-wave", path: "M 27,50 Q 32,38 37,50" },
          { type: "baseline", path: "M 37,50 L 45,50" },
          { type: "p-wave", path: "M 45,50 Q 50,40 55,50" },
          { type: "dropped-beat", path: "M 55,50 L 80,50" },
          { type: "p-wave", path: "M 80,50 Q 85,40 90,50" },
          { type: "pr-segment", path: "M 90,50 L 97,50" },
          { type: "qrs-complex", path: "M 97,50 L 99,55 L 101,15 L 103,60 L 105,50" },
          { type: "t-wave", path: "M 107,50 Q 112,38 117,50" },
        ],
        repeatInterval: 117,
        totalWidth: 700,
      },
      clinicalAnnotations: { prInterval: "Constant (when conducted)", qrsDuration: "Often > 0.12 sec (wide)" },
      identifyingFeatures: ["Constant PR interval for conducted beats", "Sudden dropped QRS without PR prolongation", "May have wide QRS", "2:1, 3:1, or variable conduction"],
      associatedConditions: ["Anterior MI", "Fibrosis of conduction system", "Post-cardiac surgery", "Structural heart disease"],
      treatmentNotes: "More dangerous than Type I. Transcutaneous pacing standby. Atropine may be ineffective (infra-nodal block). Transvenous pacing often required. Permanent pacemaker indicated.",
      rate: "Atrial regular, ventricular regular or irregular",
      regularity: "May be regular or irregular",
      clinicalSignificance: "Occurs below the AV node (infra-Hisian). High risk of progressing to complete heart block. Requires pacemaker placement.",
      difficulty: "advanced",
      visibilityTier: "paid",
      sortOrder: 13,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Third-Degree (Complete) Heart Block",
      slug: "third-degree-heart-block",
      category: "Heart Blocks",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,42 10,50" },
          { type: "baseline", path: "M 10,50 L 20,50" },
          { type: "p-wave", path: "M 20,50 Q 25,42 30,50" },
          { type: "qrs-complex", path: "M 33,50 L 36,55 L 39,10 L 42,65 L 45,50" },
          { type: "baseline", path: "M 45,50 L 52,50" },
          { type: "p-wave", path: "M 52,50 Q 57,42 62,50" },
          { type: "baseline", path: "M 62,50 L 75,50" },
          { type: "p-wave", path: "M 75,50 Q 80,42 85,50" },
          { type: "qrs-complex", path: "M 88,50 L 91,55 L 94,10 L 97,65 L 100,50" },
        ],
        repeatInterval: 100,
        totalWidth: 700,
      },
      clinicalAnnotations: { prInterval: "Variable (no relationship)", qrsDuration: "Wide if ventricular escape, narrow if junctional escape" },
      identifyingFeatures: ["AV dissociation — P waves march through independently", "Regular atrial rate, regular ventricular rate", "No consistent PR interval", "Ventricular rate 20-60 bpm (escape rhythm)"],
      associatedConditions: ["Anterior MI (poor prognosis)", "Inferior MI (often transient)", "Congenital", "Lyme disease", "Post-cardiac surgery"],
      treatmentNotes: "Transcutaneous pacing immediately if symptomatic. Atropine may help if junctional escape. Dopamine/epinephrine drip. Transvenous pacing. Permanent pacemaker.",
      rate: "Atrial: 60-100, Ventricular: 20-60 bpm",
      regularity: "Regular P-P intervals, regular R-R intervals, but independent of each other",
      clinicalSignificance: "Complete failure of AV conduction. Potentially lethal — patient depends entirely on escape rhythm for cardiac output.",
      difficulty: "advanced",
      visibilityTier: "free",
      sortOrder: 14,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Junctional Rhythm",
      slug: "junctional-rhythm",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "inverted-p", path: "M 0,50 Q 5,57 10,50" },
          { type: "pr-segment", path: "M 10,50 L 13,50" },
          { type: "qrs-complex", path: "M 13,50 L 15,55 L 17,15 L 19,60 L 21,50" },
          { type: "st-segment", path: "M 21,50 L 26,50" },
          { type: "t-wave", path: "M 26,50 Q 33,35 40,50" },
          { type: "baseline", path: "M 40,50 L 80,50" },
        ],
        repeatInterval: 80,
        totalWidth: 700,
      },
      clinicalAnnotations: { prInterval: "< 0.12 sec (if P wave visible) or absent", qrsDuration: "< 0.12 sec (narrow)" },
      identifyingFeatures: ["Rate 40-60 bpm", "Inverted P waves in II, III, aVF (if visible)", "P wave may be before, during, or after QRS", "Narrow QRS complex", "Regular rhythm"],
      associatedConditions: ["SA node dysfunction", "Digoxin toxicity", "Post-cardiac surgery", "Inferior MI", "Increased vagal tone"],
      treatmentNotes: "If asymptomatic, observe. If symptomatic: Atropine 0.5mg IV. Consider pacing if persistent bradycardia. Treat underlying cause.",
      rate: "40-60 bpm",
      regularity: "Regular",
      clinicalSignificance: "AV junction assumes pacemaker role when SA node fails or is too slow. A junctional escape rhythm is a safety mechanism.",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 15,
    },
    {
      waveformType: "ecg-rhythm",
      name: "Premature Ventricular Complexes (PVCs)",
      slug: "pvcs",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 15,50" },
          { type: "qrs-complex", path: "M 15,50 L 17,55 L 20,15 L 23,60 L 25,50" },
          { type: "t-wave", path: "M 27,50 Q 34,35 41,50" },
          { type: "baseline", path: "M 41,50 L 50,50" },
          { type: "pvc", path: "M 50,50 L 54,75 L 60,10 L 66,80 L 70,50" },
          { type: "compensatory-pause", path: "M 70,50 L 100,50" },
          { type: "p-wave", path: "M 100,50 Q 105,40 110,50" },
          { type: "pr-segment", path: "M 110,50 L 115,50" },
          { type: "qrs-complex", path: "M 115,50 L 117,55 L 120,15 L 123,60 L 125,50" },
          { type: "t-wave", path: "M 127,50 Q 134,35 141,50" },
        ],
        repeatInterval: 141,
        totalWidth: 700,
      },
      clinicalAnnotations: { qrsDuration: "> 0.12 sec for PVC", compensatoryPause: "Present (full compensatory pause)" },
      identifyingFeatures: ["Wide, bizarre QRS morphology", "No preceding P wave for PVC", "Compensatory pause follows", "T wave deflection opposite to QRS", "Unifocal (same morphology) or multifocal"],
      associatedConditions: ["Caffeine/stimulant use", "Hypoxia", "Electrolyte imbalances", "Heart disease", "Myocardial ischemia", "Stress/anxiety"],
      treatmentNotes: "Isolated PVCs usually benign — treat underlying cause. Frequent PVCs (>6/min, couplets, R-on-T) may need amiodarone or lidocaine. If hemodynamically significant, treat as VT.",
      rate: "Varies with frequency of PVCs",
      regularity: "Irregular (due to premature beats)",
      clinicalSignificance: "Common and often benign. Concerning when frequent, multifocal, in couplets, or R-on-T phenomenon. Can trigger VT/VFib.",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 16,
    },
    {
      waveformType: "ecg-12lead",
      name: "STEMI — Anterior Wall",
      slug: "stemi-anterior",
      category: "12-Lead Patterns",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 15,50" },
          { type: "qrs-complex", path: "M 15,50 L 17,55 L 20,15 L 23,60 L 25,50" },
          { type: "st-elevation", path: "M 25,40 L 30,38" },
          { type: "t-wave", path: "M 30,38 Q 37,25 44,50" },
          { type: "baseline", path: "M 44,50 L 70,50" },
        ],
        repeatInterval: 70,
        totalWidth: 700,
        leads: ["V1", "V2", "V3", "V4"],
        reciprocalChanges: ["II", "III", "aVF"],
      },
      clinicalAnnotations: { culpritArtery: "LAD (Left Anterior Descending)", stElevation: "V1-V4", reciprocal: "ST depression in II, III, aVF" },
      identifyingFeatures: ["ST elevation in V1-V4", "Reciprocal ST depression in inferior leads", "May have pathological Q waves in V1-V4", "Hyperacute T waves (early sign)"],
      associatedConditions: ["Acute coronary syndrome", "LAD occlusion", "Known as 'widowmaker' when proximal LAD"],
      treatmentNotes: "Activate cath lab — PCI within 90 minutes. Aspirin 324mg chewed. Heparin. Nitroglycerin (avoid if RV involvement). Morphine for pain. 12-lead ECG serial monitoring.",
      rate: "Variable",
      regularity: "Usually regular (may develop arrhythmias)",
      clinicalSignificance: "Large territory of myocardium at risk. Anterior STEMI has highest mortality. Can develop cardiogenic shock, CHF, VT/VFib.",
      difficulty: "advanced",
      visibilityTier: "paid",
      sortOrder: 17,
    },
    {
      waveformType: "ecg-12lead",
      name: "STEMI — Inferior Wall",
      slug: "stemi-inferior",
      category: "12-Lead Patterns",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 15,50" },
          { type: "qrs-complex", path: "M 15,50 L 17,55 L 20,15 L 23,60 L 25,50" },
          { type: "st-elevation", path: "M 25,40 L 30,38" },
          { type: "t-wave", path: "M 30,38 Q 37,25 44,50" },
          { type: "baseline", path: "M 44,50 L 70,50" },
        ],
        repeatInterval: 70,
        totalWidth: 700,
        leads: ["II", "III", "aVF"],
        reciprocalChanges: ["I", "aVL"],
      },
      clinicalAnnotations: { culpritArtery: "RCA (Right Coronary Artery) or LCx", stElevation: "II, III, aVF", reciprocal: "ST depression in I, aVL" },
      identifyingFeatures: ["ST elevation in II, III, aVF", "Reciprocal ST depression in I, aVL", "Check right-sided leads (V4R) for RV involvement", "III > II suggests RCA occlusion"],
      associatedConditions: ["RCA occlusion (85%)", "LCx occlusion (15%)", "May involve RV (check V4R)"],
      treatmentNotes: "Same as anterior STEMI protocol. If RV involved: avoid nitrates, give IV fluids for preload. Watch for bradycardia (RCA supplies SA/AV nodes).",
      rate: "Variable (often bradycardic)",
      regularity: "May be irregular (AV blocks common)",
      clinicalSignificance: "RCA supplies the inferior wall and often the SA/AV nodes. Inferior STEMI may present with bradycardia, AV blocks, and RV infarction.",
      difficulty: "advanced",
      visibilityTier: "paid",
      sortOrder: 18,
    },
    {
      waveformType: "ecg-12lead",
      name: "STEMI — Lateral Wall",
      slug: "stemi-lateral",
      category: "12-Lead Patterns",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 15,50" },
          { type: "qrs-complex", path: "M 15,50 L 17,55 L 20,15 L 23,60 L 25,50" },
          { type: "st-elevation", path: "M 25,40 L 30,38" },
          { type: "t-wave", path: "M 30,38 Q 37,25 44,50" },
          { type: "baseline", path: "M 44,50 L 70,50" },
        ],
        repeatInterval: 70,
        totalWidth: 700,
        leads: ["I", "aVL", "V5", "V6"],
        reciprocalChanges: ["III", "aVF"],
      },
      clinicalAnnotations: { culpritArtery: "LCx (Left Circumflex) or diagonal branch of LAD", stElevation: "I, aVL, V5, V6", reciprocal: "ST depression in III, aVF" },
      identifyingFeatures: ["ST elevation in I, aVL, V5, V6", "Reciprocal ST depression in III, aVF", "May extend to anterior leads"],
      associatedConditions: ["LCx occlusion", "LAD diagonal branch occlusion"],
      treatmentNotes: "Standard STEMI protocol with PCI. Lateral STEMI may be subtle — high lateral (I, aVL only) can be missed.",
      rate: "Variable",
      regularity: "Usually regular",
      clinicalSignificance: "Lateral wall involvement. High lateral STEMI (I, aVL only) is easily overlooked. Always check all 12 leads systematically.",
      difficulty: "advanced",
      visibilityTier: "paid",
      sortOrder: 19,
    },
    {
      waveformType: "ecg-rhythm",
      name: "PEA (Pulseless Electrical Activity)",
      slug: "pea",
      category: "Cardiac Rhythms",
      svgPathData: {
        segments: [
          { type: "p-wave", path: "M 0,50 Q 5,40 10,50" },
          { type: "pr-segment", path: "M 10,50 L 15,50" },
          { type: "qrs-complex", path: "M 15,50 L 17,55 L 20,15 L 23,60 L 25,50" },
          { type: "st-segment", path: "M 25,50 L 30,50" },
          { type: "t-wave", path: "M 30,50 Q 37,35 44,50" },
          { type: "baseline", path: "M 44,50 L 80,50" },
        ],
        repeatInterval: 80,
        totalWidth: 700,
      },
      clinicalAnnotations: { rhythm: "Organized electrical activity present", pulse: "No palpable pulse" },
      identifyingFeatures: ["Organized rhythm on monitor", "No palpable pulse", "Can look like any organized rhythm", "Diagnosis requires pulse check — ECG alone cannot distinguish"],
      associatedConditions: ["Hypovolemia", "Hypoxia", "Hydrogen ion (acidosis)", "Hypo/hyperkalemia", "Hypothermia", "Tension pneumothorax", "Tamponade", "Toxins", "Thrombosis (PE, MI)"],
      treatmentNotes: "CPR. Epinephrine 1mg IV q3-5min. NOT a shockable rhythm. Aggressively search for and treat reversible causes (H's and T's). Consider point-of-care ultrasound.",
      rate: "Varies (can appear normal)",
      regularity: "Can appear regular",
      clinicalSignificance: "Electrical activity without mechanical function. Treatment success depends on identifying and reversing the underlying cause. PEA is a clinical diagnosis, not purely an ECG finding.",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 20,
    },
    {
      waveformType: "capnography",
      name: "Normal Capnography Waveform",
      slug: "capnography-normal",
      category: "Capnography",
      svgPathData: {
        segments: [
          { type: "phase-1", path: "M 0,80 L 5,80" },
          { type: "phase-2", path: "M 5,80 L 10,30" },
          { type: "phase-3", path: "M 10,30 L 35,28" },
          { type: "phase-4", path: "M 35,28 L 40,80" },
          { type: "phase-0", path: "M 40,80 L 55,80" },
        ],
        repeatInterval: 55,
        totalWidth: 700,
        etco2: "35-45 mmHg",
      },
      clinicalAnnotations: { etco2Range: "35-45 mmHg", phase1: "Inspiratory baseline (0 mmHg CO2)", phase2: "Expiratory upstroke", phase3: "Alveolar plateau", phase4: "Inspiratory downstroke" },
      identifyingFeatures: ["Rectangular waveform shape", "Flat inspiratory baseline", "Sharp upstroke", "Alveolar plateau with slight upward slope", "Sharp downstroke to baseline", "ETCO2 35-45 mmHg"],
      associatedConditions: ["Normal ventilation and perfusion"],
      treatmentNotes: "Normal waveform — no intervention needed. Use as baseline for comparison.",
      rate: "12-20 breaths/min",
      regularity: "Regular",
      clinicalSignificance: "Confirms proper ET tube placement and adequate ventilation. ETCO2 correlates with PaCO2 in patients with normal V/Q matching.",
      difficulty: "beginner",
      visibilityTier: "free",
      sortOrder: 21,
    },
    {
      waveformType: "capnography",
      name: "Bronchospasm (Shark Fin)",
      slug: "capnography-bronchospasm",
      category: "Capnography",
      svgPathData: {
        segments: [
          { type: "phase-1", path: "M 0,80 L 5,80" },
          { type: "shark-fin", path: "M 5,80 Q 20,30 45,25" },
          { type: "phase-4", path: "M 45,25 L 50,80" },
          { type: "phase-0", path: "M 50,80 L 60,80" },
        ],
        repeatInterval: 60,
        totalWidth: 700,
        etco2: "Variable",
      },
      clinicalAnnotations: { pattern: "Shark fin or slanted upstroke", cause: "Obstructive airway disease" },
      identifyingFeatures: ["Slanted/prolonged upstroke (no sharp angle)", "'Shark fin' appearance", "No distinct alveolar plateau", "ETCO2 may be elevated"],
      associatedConditions: ["Asthma exacerbation", "COPD", "Bronchospasm", "Mucus plugging", "Kinked ET tube"],
      treatmentNotes: "Administer bronchodilators (albuterol, ipratropium). Monitor response — waveform should become more rectangular with effective treatment. Consider ET tube repositioning if mechanical obstruction.",
      rate: "Variable",
      regularity: "May be irregular",
      clinicalSignificance: "The 'shark fin' waveform is pathognomonic for obstructive airway disease. Serial waveform monitoring shows treatment response — improving waveform shape indicates bronchodilator effectiveness.",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 22,
    },
    {
      waveformType: "capnography",
      name: "Esophageal Intubation",
      slug: "capnography-esophageal",
      category: "Capnography",
      svgPathData: {
        segments: [
          { type: "flat", path: "M 0,80 L 700,80" },
        ],
        repeatInterval: 700,
        totalWidth: 700,
        etco2: "0 mmHg",
      },
      clinicalAnnotations: { etco2: "0 or near 0 mmHg", interpretation: "No CO2 detected = not in trachea" },
      identifyingFeatures: ["Flat waveform at zero", "No CO2 detected", "Immediate indicator of esophageal placement", "May see brief CO2 from gastric air (diminishes rapidly)"],
      associatedConditions: ["Esophageal intubation", "Complete airway obstruction", "Disconnected circuit", "Cardiac arrest (no perfusion)"],
      treatmentNotes: "Immediately remove tube and re-intubate. Ventilate with BVM while preparing. Confirm tracheal placement with bilateral breath sounds, chest rise, AND sustained ETCO2.",
      rate: "N/A",
      regularity: "N/A",
      clinicalSignificance: "Capnography is the gold standard for confirming ET tube placement. Absence of CO2 waveform after 6 breaths confirms esophageal placement. A brief CO2 reading from gastric air will rapidly diminish.",
      difficulty: "beginner",
      visibilityTier: "free",
      sortOrder: 23,
    },
    {
      waveformType: "capnography",
      name: "ROSC Detection",
      slug: "capnography-rosc",
      category: "Capnography",
      svgPathData: {
        segments: [
          { type: "low-plateau", path: "M 0,80 L 3,80 L 6,65 L 20,63 L 23,80 L 30,80" },
          { type: "low-plateau", path: "M 30,80 L 33,80 L 36,63 L 50,61 L 53,80 L 60,80" },
          { type: "rising-plateau", path: "M 60,80 L 63,80 L 66,50 L 80,48 L 83,80 L 90,80" },
          { type: "normal-plateau", path: "M 90,80 L 93,80 L 96,30 L 110,28 L 113,80 L 120,80" },
        ],
        repeatInterval: 120,
        totalWidth: 700,
        etco2: "Rising from <10 to >40 mmHg",
      },
      clinicalAnnotations: { etco2Trend: "Sudden sustained rise >40 mmHg", interpretation: "Return of spontaneous circulation" },
      identifyingFeatures: ["Sudden sustained increase in ETCO2", "ETCO2 rises from arrest levels (<10-20) to >40 mmHg", "Occurs with return of pulses", "Most reliable early indicator of ROSC"],
      associatedConditions: ["Return of spontaneous circulation during CPR", "Effective resuscitation"],
      treatmentNotes: "Check pulse to confirm ROSC. Initiate post-cardiac arrest care. Targeted temperature management. Hemodynamic optimization. 12-lead ECG. Consider cath lab.",
      rate: "Improving",
      regularity: "Becoming regular",
      clinicalSignificance: "A sudden sustained rise in ETCO2 (typically >40 mmHg) during CPR is the earliest and most reliable indicator of ROSC — often detected before a pulse is palpable.",
      difficulty: "intermediate",
      visibilityTier: "free",
      sortOrder: 24,
    },
    {
      waveformType: "capnography",
      name: "Hyperventilation Pattern",
      slug: "capnography-hyperventilation",
      category: "Capnography",
      svgPathData: {
        segments: [
          { type: "phase-1", path: "M 0,80 L 3,80" },
          { type: "phase-2", path: "M 3,80 L 6,55" },
          { type: "phase-3", path: "M 6,55 L 18,53" },
          { type: "phase-4", path: "M 18,53 L 21,80" },
          { type: "phase-0", path: "M 21,80 L 28,80" },
        ],
        repeatInterval: 28,
        totalWidth: 700,
        etco2: "< 35 mmHg",
      },
      clinicalAnnotations: { etco2: "< 35 mmHg (low)", rr: "> 20 breaths/min" },
      identifyingFeatures: ["Rapid respiratory rate (short waveform cycles)", "Low ETCO2 (< 35 mmHg)", "Normal waveform shape but short and shallow", "Decreased plateau height"],
      associatedConditions: ["Anxiety/panic attack", "Pain", "Metabolic acidosis (compensatory)", "PE", "Over-ventilation by BVM/ventilator"],
      treatmentNotes: "Reduce ventilation rate to 10-12/min. Coach breathing if anxiety-related. Investigate underlying cause. Avoid over-ventilation in traumatic brain injury (target ETCO2 35-40).",
      rate: "> 20 breaths/min",
      regularity: "Regular but rapid",
      clinicalSignificance: "Low ETCO2 from hyperventilation causes cerebral vasoconstriction and decreased cerebral blood flow. Critical to avoid in TBI patients where ETCO2 targets are 35-40 mmHg.",
      difficulty: "beginner",
      visibilityTier: "free",
      sortOrder: 25,
    },
  ];
}
