import { pool } from "./storage";

console.log("═══════════════════════════════════════════");
console.log("[Worker] NurseNest Background Worker (SAFE MODE)");
console.log("═══════════════════════════════════════════");

process.env.PROCESS_ROLE = "worker";

let shuttingDown = false;

async function startWorker(): Promise<void> {
  try {
    const dbResult = await pool.query("SELECT current_database() AS db");
    console.log(`[Worker] Database connected: ${dbResult.rows[0].db}`);
  } catch (err: any) {
    console.error("[Worker] Cannot connect to database:", err.message);
    process.exit(1);
  }

  console.log("[Worker] Running in SAFE MODE");
  console.log("[Worker] Heavy background jobs DISABLED");
  console.log("═══════════════════════════════════════════");
}

async function gracefulShutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`[Worker] ${signal} received, shutting down...`);

  setTimeout(() => process.exit(0), 1000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startWorker().catch(err => {
  console.error("[Worker] Fatal startup error:", err);
  process.exit(1);
});