import "../server/load-env";
import { seedReplitJsonImports } from "../server/seed-replit-json-imports";
import { pool } from "../server/storage";

async function main() {
  await seedReplitJsonImports(pool);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
