import { seedParamedicEncyclopedia } from "./seed-paramedic-encyclopedia";

async function main() {
  try {
    const result = await seedParamedicEncyclopedia();
    console.log(`\nParamedic Encyclopedia Seeding Results:`);
    console.log(`  Inserted: ${result.inserted}`);
    console.log(`  Errors: ${result.errors}`);
    process.exit(0);
  } catch (e: any) {
    console.error("Fatal error:", e.message);
    process.exit(1);
  }
}

main();
