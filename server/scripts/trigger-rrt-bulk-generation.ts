import pg from "pg";

const PROD_URL = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
if (!PROD_URL) {
  console.error("No database URL configured");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: PROD_URL });

async function main() {
  console.log("[RRT Trigger] Starting RRT bulk question generation...");
  console.log("[RRT Trigger] Target: 1,500 questions across 13 domains");
  
  const dbCheck = await pool.query("SELECT current_database() as db");
  console.log(`[RRT Trigger] Connected to database: ${dbCheck.rows[0]?.db}`);

  const existingCount = await pool.query(
    "SELECT COUNT(*) as c FROM allied_questions WHERE career_type = 'rrt' AND status = 'approved'"
  );
  console.log(`[RRT Trigger] Existing approved RRT questions: ${existingCount.rows[0].c}`);

  let blueprintRes = await pool.query(
    "SELECT * FROM allied_blueprints WHERE career_type = 'rrt' AND is_active = true ORDER BY version DESC LIMIT 1"
  );

  if (!blueprintRes.rows[0]) {
    console.log("[RRT Trigger] No active RRT blueprint found. Creating one...");
    
    const vRes = await pool.query(
      "SELECT COALESCE(MAX(version), 0) as max_v FROM allied_blueprints WHERE career_type = 'rrt'"
    );
    const nextVersion = (vRes.rows[0]?.max_v || 0) + 1;

    await pool.query("UPDATE allied_blueprints SET is_active = false WHERE career_type = 'rrt'");

    const domainWeights: Record<string, number> = {
      "Airway Management": 0.10,
      "Oxygen Therapy": 0.08,
      "ABG Interpretation": 0.10,
      "Mechanical Ventilation": 0.12,
      "Pulmonary Function Testing": 0.06,
      "Neonatal & Pediatric Respiratory Care": 0.08,
      "Critical Care Respiratory Therapy": 0.10,
      "Cardiopulmonary Physiology": 0.08,
      "Aerosol & Medication Delivery": 0.06,
      "Sleep & Noninvasive Ventilation": 0.06,
      "Emergency Respiratory Care": 0.06,
      "Patient Assessment": 0.06,
      "Infection Control & Equipment": 0.04,
    };

    const difficultyDist = { 1: 0.175, 2: 0.175, 3: 0.45, 4: 0.10, 5: 0.10 };
    const cognitiveDist = { recall: { min: 0.15, max: 0.25 }, application: { min: 0.40, max: 0.55 }, analysis: { min: 0.25, max: 0.40 } };

    blueprintRes = await pool.query(
      `INSERT INTO allied_blueprints (career_type, version, domains, difficulty_distribution, cognitive_distribution, allowed_question_types, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *`,
      [
        "rrt", nextVersion, JSON.stringify(domainWeights),
        JSON.stringify(difficultyDist), JSON.stringify(cognitiveDist),
        JSON.stringify(["multiple-choice"])
      ]
    );
    console.log(`[RRT Trigger] Created RRT blueprint v${nextVersion} with 13 domains`);
  }

  const blueprint = blueprintRes.rows[0];
  console.log(`[RRT Trigger] Using blueprint: v${blueprint.version} (${blueprint.id})`);

  console.log("[RRT Trigger] Blueprint and database ready.");
  console.log("[RRT Trigger] To trigger the generation, call:");
  console.log("  POST /api/allied/pipeline/rrt-bulk-generate");
  console.log("  Header: x-admin-id: <your-admin-user-id>");
  console.log("");
  console.log("[RRT Trigger] Or check status at:");
  console.log("  GET /api/allied/pipeline/rrt-bulk-status/<batchId>");

  await pool.end();
}

main().catch(err => {
  console.error("[RRT Trigger] Fatal error:", err);
  process.exit(1);
});
