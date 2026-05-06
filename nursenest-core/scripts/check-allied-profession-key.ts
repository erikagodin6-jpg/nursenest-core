

/**
 * NurseNest — Allied Profession Key Schema Readiness Check
 *
 * Checks if the `pathway_lessons.allied_profession_key` column exists.
 * Exits with code 0 if ready, code 1 if missing.
 *
 * Usage: tsx scripts/check-allied-profession-key.ts
 */

import "./load-dotenv-for-cli.mts";
import { Client } from "pg";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pathway_lessons'
        AND column_name = 'allied_profession_key'
      ) as exists;
    `);

    const columnExists = result.rows[0]?.exists ?? false;

    if (columnExists) {
      console.log("✅ Schema ready: pathway_lessons.allied_profession_key column exists");
      process.exit(0);
    } else {
      console.error("❌ Schema not ready: pathway_lessons.allied_profession_key column is missing");
      console.error("");
      console.error("This column is required for the Allied Profession Completeness Audit.");
      console.error("Please run migrations first:");
      console.error("  npm run db:migrate:deploy:safe");
      console.error("");
      console.error("Or if you need to generate the Prisma client:");
      console.error("  npm run db:generate:safe");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Failed to check schema:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();