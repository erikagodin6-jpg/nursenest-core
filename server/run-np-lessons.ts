import { seedNpLessons, getNpLessonPlan } from "./seed-np-lessons";
import { getProdPool, getDevPool, hasSeparateProdDb } from "./db";

type CliOptions = {
  dryRun: boolean;
  useDev: boolean;
  startFrom: number;
  batchSize: number;
  showPlan: boolean;
};

function parseNumberFlag(args: string[], prefix: string, defaultValue: number): number {
  const match = args.find((arg) => arg.startsWith(prefix));
  if (!match) return defaultValue;

  const value = Number.parseInt(match.slice(prefix.length), 10);
  return Number.isFinite(value) ? value : defaultValue;
}

function parseArgs(args: string[]): CliOptions {
  return {
    dryRun: args.includes("--dry-run"),
    useDev: args.includes("--dev"),
    showPlan: args.includes("--plan"),
    startFrom: parseNumberFlag(args, "--start=", 0),
    batchSize: parseNumberFlag(args, "--batch=", 25),
  };
}

function printPlan(): void {
  const plan = getNpLessonPlan();
  const domains: Record<string, number> = {};

  for (const lesson of plan) {
    domains[lesson.domain] = (domains[lesson.domain] || 0) + 1;
  }

  console.log(`\nNP Lesson Plan: ${plan.length} total lessons\n`);

  for (const [domain, count] of Object.entries(domains)) {
    console.log(`  ${domain}: ${count} lessons`);
  }
}

function getDbTargetLabel(useDev: boolean): string {
  if (useDev) return "DEVELOPMENT";
  if (hasSeparateProdDb()) return "PRODUCTION";
  return "DEFAULT (dev=prod)";
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.showPlan) {
    printPlan();
    process.exit(0);
  }

  const targetPool = options.useDev ? getDevPool() : getProdPool();
  const dbTarget = getDbTargetLabel(options.useDev);

  console.log("Starting NP lesson generation (AI-powered with validation)...");
  console.log(`  Database target: ${dbTarget}`);
  console.log(`  Batch size: ${options.batchSize}`);
  console.log(`  Start from: ${options.startFrom}`);
  console.log(`  Dry run: ${options.dryRun}`);

  try {
    const result = await seedNpLessons(targetPool, {
      batchSize: options.batchSize,
      startFrom: options.startFrom,
      dryRun: options.dryRun,
    });

    console.log("\nResult:", JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

void main();