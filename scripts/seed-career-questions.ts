import "../server/load-env";
import { seedAlliedHealthQuestions } from "../server/seeds/seed-allied-health-questions";
import { pool } from "../server/storage";

async function main() {
  console.log("Seeding allied career exam questions from data/career-questions/*.json (when present) and client modules...\n");
  await seedAlliedHealthQuestions(pool);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
