import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TierQuestionCount {
  total: number;
  byCategory: Record<string, number>;
  byFormat: Record<string, number>;
  files: string[];
}

interface FileCountResult {
  filePath: string;
  count: number;
  categories: Record<string, number>;
  formats: Record<string, number>;
  error?: string;
}

const CAREER_QUESTIONS_DIR = path.resolve(__dirname, "../client/src/data/career-questions");
const EXAM_QUESTIONS_DIR = path.resolve(__dirname, "../client/src/data/exam-questions");
const SERVER_DATA_DIR = path.resolve(__dirname, "../server/data");

const ALLIED_HEALTH_FILE_MAP: Record<string, string[]> = {
  rrt: [
    "rrt-questions.ts",
    "rrt-questions-batch1.ts",
    "rrt-questions-batch2.ts",
    "rrt-questions-batch3.ts",
    "rrt-pharmacology-questions.ts",
  ],
  paramedic: ["paramedic-questions.ts"],
  pharmacyTech: [
    "pharmacy-tech-questions.ts",
    "pharmacy-tech-questions-extended.ts",
    "pharmacy-tech-questions-batch2.ts",
    "pharmacy-tech-questions-batch3.ts",
    "pharmacy-tech-questions-batch4.ts",
    "pharmacy-tech-questions-pebc.ts",
  ],
  mlt: ["mlt-questions.ts", "mlt-questions-batch2.ts"],
  imaging: ["imaging-questions.ts"],
  occupationalTherapyAssistant: [
    "ota-questions.ts",
    "ota-questions-batch2.ts",
    "ota-questions-batch3.ts",
    "ota-questions-batch4.ts",
    "ota-questions-batch5.ts",
    "ota-questions-batch6.ts",
    "ota-questions-batch7.ts",
    "ota-questions-batch8.ts",
    "ota-questions-batch9.ts",
    "ota-questions-batch10.ts",
  ],
  physiotherapyAssistant: [
    "pta-questions.ts",
    "pta-questions-batch1.ts",
    "pta-questions-batch2.ts",
    "pta-questions-batch3.ts",
    "pta-questions-batch4.ts",
    "pta-questions-batch5.ts",
    "pta-questions-batch6.ts",
    "pta-questions-batch7.ts",
    "pta-questions-batch8.ts",
    "pta-questions-batch9.ts",
    "pta-questions-batch10.ts",
    "pta-questions-batch11.ts",
    "pta-questions-batch12.ts",
    "pta-questions-batch13.ts",
    "pta-questions-batch14.ts",
    "pta-questions-batch15.ts",
    "pta-questions-batch16.ts",
    "pta-questions-batch17.ts",
    "pta-questions-batch18.ts",
  ],
  psychotherapist: ["psychotherapist-questions.ts"],
  socialWorker: [
    "social-worker-questions.ts",
    "social-worker-questions-batch2.ts",
    "social-worker-questions-batch3.ts",
    "social-worker-questions-batch4.ts",
    "social-worker-questions-batch5.ts",
    "social-worker-questions-batch6.ts",
    "social-worker-questions-batch7.ts",
    "social-worker-questions-batch8.ts",
    "social-worker-questions-batch9.ts",
    "social-worker-questions-batch10.ts",
    "social-worker-questions-batch11.ts",
    "social-worker-questions-batch12.ts",
    "social-worker-questions-batch13.ts",
    "social-worker-questions-batch14.ts",
    "social-worker-questions-batch15.ts",
    "social-worker-questions-batch16.ts",
    "social-worker-questions-batch17.ts",
    "social-worker-questions-batch18.ts",
    "social-worker-questions-batch19.ts",
    "social-worker-questions-batch20.ts",
    "social-worker-questions-batch21.ts",
    "social-worker-questions-batch22.ts",
  ],
  addictionsCounsellor: ["addictions-counsellor-questions.ts"],
  healthInfoMgmt: ["him-questions.ts"],
  diagnosticSonography: ["sonography-questions.ts"],
  cardiacSonographer: ["cardiac-sonographer-questions.ts"],
  surgicalTechnologist: [
    "surgical-technologist-questions.ts",
    "surgical-technologist-questions-2.ts",
    "surgical-technologist-questions-3.ts",
    "surgical-technologist-questions-4.ts",
    "surgical-technologist-questions-5.ts",
    "surgical-technologist-questions-6.ts",
  ],
};

const NURSING_CERT_FILE_MAP: Record<string, string[]> = {
  criticalCare: ["critical-care-questions.ts"],
  emergencyNursing: ["emergency-nursing-questions.ts"],
  perioperative: ["perioperative-questions.ts"],
  oncologyNursing: ["oncology-nursing-questions.ts"],
  pediatricCert: ["pediatric-cert-questions.ts"],
};

function discoverNursingTierFiles(dir: string): Record<string, string[]> {
  const tiers: Record<string, string[]> = {
    rn: [],
    rpn: [],
    np: [],
    preNursing: [],
  };

  if (!fs.existsSync(dir)) return tiers;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "types.ts");

  for (const file of files) {
    if (file.startsWith("rn-")) {
      tiers.rn.push(file);
    } else if (file.startsWith("rpn-")) {
      tiers.rpn.push(file);
    } else if (file.startsWith("np-")) {
      tiers.np.push(file);
    } else if (file.startsWith("prenursing")) {
      tiers.preNursing.push(file);
    }
  }

  return tiers;
}

const SERVER_DATA_MAP: Record<string, { dir: string; excludeFiles: string[] }> = {
  emergencyNursingServer: {
    dir: "emergency-nursing-questions",
    excludeFiles: ["types.ts"],
  },
  paramedicServer: {
    dir: "paramedic-questions",
    excludeFiles: ["types.ts", "generate-all.ts"],
  },
  perioperativeServer: {
    dir: "perioperative-questions",
    excludeFiles: ["types.ts", "index.ts", "seed-perioperative.ts"],
  },
};

function countQuestionsInFile(filePath: string): FileCountResult {
  const result: FileCountResult = {
    filePath,
    count: 0,
    categories: {},
    formats: {},
  };

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    let questionCount = 0;
    const categories: Record<string, number> = {};
    const formats: Record<string, number> = {};

    const idPatterns = [
      /^\s*"?id"?\s*:\s*"/,
      /^\s*id:\s*"/,
      /^\s*"id"\s*:\s*"/,
      /\{\s*id:\s*"/,
      /\{\s*"id"\s*:\s*"/,
    ];

    const categoryPatterns = [
      /"?category"?\s*:\s*"([^"]+)"/,
      /"?blueprintCategory"?\s*:\s*"([^"]+)"/,
    ];

    const formatPatterns = [
      /"?questionType"?\s*:\s*"([^"]+)"/,
      /"?question_type"?\s*:\s*"([^"]+)"/,
    ];

    let lastCategory = "";
    let lastFormat = "MCQ";

    for (const line of lines) {
      const isQuestionStart = idPatterns.some((p) => p.test(line));

      if (isQuestionStart) {
        if (questionCount > 0) {
          categories[lastCategory] = (categories[lastCategory] || 0) + 1;
          formats[lastFormat] = (formats[lastFormat] || 0) + 1;
        }
        questionCount++;
        lastCategory = "";
        lastFormat = "MCQ";
      }

      for (const cp of categoryPatterns) {
        const cm = line.match(cp);
        if (cm) lastCategory = cm[1];
      }

      for (const fp of formatPatterns) {
        const fm = line.match(fp);
        if (fm) lastFormat = fm[1];
      }
    }

    if (questionCount > 0) {
      categories[lastCategory] = (categories[lastCategory] || 0) + 1;
      formats[lastFormat] = (formats[lastFormat] || 0) + 1;
    }

    result.count = questionCount;
    result.categories = categories;
    result.formats = formats;
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  }

  return result;
}

function countStemBasedQuestions(filePath: string): FileCountResult {
  const result: FileCountResult = {
    filePath,
    count: 0,
    categories: {},
    formats: {},
  };

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    let questionCount = 0;
    const categories: Record<string, number> = {};
    const formats: Record<string, number> = {};

    const stemPattern = /^\s+"?stem"?\s*:\s*"/;
    const categoryPatterns = [
      /^\s*"?blueprintCategory"?\s*:\s*"([^"]+)"/,
      /^\s*"?category"?\s*:\s*"([^"]+)"/,
      /^\s*"?subtopic"?\s*:\s*"([^"]+)"/,
    ];
    const formatPattern = /^\s*"?questionType"?\s*:\s*"([^"]+)"/;

    let lastCategory = "";
    let lastFormat = "MCQ_SINGLE";
    let isInterfaceDef = false;

    for (const line of lines) {
      if (line.includes("interface ") || line.includes("export type ")) {
        isInterfaceDef = true;
      }
      if (isInterfaceDef && line.includes("}")) {
        isInterfaceDef = false;
        continue;
      }
      if (isInterfaceDef) continue;

      if (stemPattern.test(line)) {
        if (questionCount > 0) {
          categories[lastCategory] = (categories[lastCategory] || 0) + 1;
          formats[lastFormat] = (formats[lastFormat] || 0) + 1;
        }
        questionCount++;
        lastCategory = "";
        lastFormat = "MCQ_SINGLE";
      }

      for (const cp of categoryPatterns) {
        const cm = line.match(cp);
        if (cm && !isInterfaceDef) lastCategory = cm[1];
      }

      const fm = line.match(formatPattern);
      if (fm && !isInterfaceDef) lastFormat = fm[1];
    }

    if (questionCount > 0) {
      categories[lastCategory] = (categories[lastCategory] || 0) + 1;
      formats[lastFormat] = (formats[lastFormat] || 0) + 1;
    }

    result.count = questionCount;
    result.categories = categories;
    result.formats = formats;
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  }

  return result;
}

function countExamQuestions(filePath: string): FileCountResult {
  const result: FileCountResult = {
    filePath,
    count: 0,
    categories: {},
    formats: {},
  };

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    let questionCount = 0;
    const categories: Record<string, number> = {};
    const formats: Record<string, number> = {};

    const qPattern = /^\s+"?q"?\s*:\s*"/;
    const idPattern = /^\s+"?id"?\s*:\s*"/;
    const stemPattern = /^\s+"?stem"?\s*:\s*"/;
    const compactIdPattern = /\{\s*id:\s*"/;

    const examCategoryPattern = /^\s+s:\s*"([^"]+)"/;
    const topicPattern = /^\s+"?topic"?\s*:\s*"([^"]+)"/;
    const coursePattern = /^\s+"?course"?\s*:\s*"([^"]+)"/;

    const examTypePattern = /^\s+t:\s*"([^"]+)"/;
    const fullTypePattern = /^\s+"?type"?\s*:\s*"([^"]+)"/;

    const VALID_FORMATS = new Set(["mcq", "sata", "ordered", "fill-in-blank", "hot-spot", "bowtie", "MCQ", "MCQ_SINGLE", "SATA"]);

    let lastCategory = "";
    let lastFormat = "mcq";
    let isInterfaceDef = false;

    for (const line of lines) {
      if (line.includes("interface ") || line.includes("export type ") || line.includes("export interface ")) {
        isInterfaceDef = true;
      }
      if (isInterfaceDef && /^\s*\}/.test(line)) {
        isInterfaceDef = false;
        continue;
      }
      if (isInterfaceDef) continue;

      const isQuestion =
        qPattern.test(line) ||
        (idPattern.test(line) && !line.includes("generationId")) ||
        stemPattern.test(line) ||
        compactIdPattern.test(line);

      if (isQuestion) {
        if (questionCount > 0) {
          categories[lastCategory] = (categories[lastCategory] || 0) + 1;
          formats[lastFormat] = (formats[lastFormat] || 0) + 1;
        }
        questionCount++;
        lastCategory = "";
        lastFormat = "mcq";
      }

      if (!isInterfaceDef) {
        const catMatch = line.match(examCategoryPattern) || line.match(topicPattern) || line.match(coursePattern);
        if (catMatch && catMatch[1].length < 60) {
          lastCategory = catMatch[1];
        }

        const typeMatch = line.match(examTypePattern) || line.match(fullTypePattern);
        if (typeMatch && VALID_FORMATS.has(typeMatch[1])) {
          lastFormat = typeMatch[1];
        }
      }
    }

    if (questionCount > 0) {
      categories[lastCategory] = (categories[lastCategory] || 0) + 1;
      formats[lastFormat] = (formats[lastFormat] || 0) + 1;
    }

    result.count = questionCount;
    result.categories = categories;
    result.formats = formats;
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  }

  return result;
}

function countTier(
  baseDir: string,
  fileNames: string[],
  countFn: (fp: string) => FileCountResult = countQuestionsInFile
): { tierCount: TierQuestionCount; failures: string[] } {
  const tierCount: TierQuestionCount = {
    total: 0,
    byCategory: {},
    byFormat: {},
    files: [],
  };
  const failures: string[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(baseDir, fileName);
    if (!fs.existsSync(filePath)) {
      failures.push(`${filePath}: file not found`);
      continue;
    }

    const result = countFn(filePath);
    if (result.error) {
      failures.push(`${filePath}: ${result.error}`);
      continue;
    }

    tierCount.total += result.count;
    tierCount.files.push(fileName);
    for (const [cat, n] of Object.entries(result.categories)) {
      tierCount.byCategory[cat] = (tierCount.byCategory[cat] || 0) + n;
    }
    for (const [fmt, n] of Object.entries(result.formats)) {
      tierCount.byFormat[fmt] = (tierCount.byFormat[fmt] || 0) + n;
    }
  }

  return { tierCount, failures };
}

function countServerDataDir(
  dirName: string,
  excludeFiles: string[]
): { tierCount: TierQuestionCount; failures: string[] } {
  const dirPath = path.join(SERVER_DATA_DIR, dirName);
  const tierCount: TierQuestionCount = {
    total: 0,
    byCategory: {},
    byFormat: {},
    files: [],
  };
  const failures: string[] = [];

  if (!fs.existsSync(dirPath)) {
    failures.push(`${dirPath}: directory not found`);
    return { tierCount, failures };
  }

  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".ts") && !excludeFiles.includes(f));

  for (const fileName of files) {
    const filePath = path.join(dirPath, fileName);
    const result = countStemBasedQuestions(filePath);

    if (result.error) {
      failures.push(`${filePath}: ${result.error}`);
      continue;
    }

    if (result.count > 0) {
      tierCount.total += result.count;
      tierCount.files.push(`${dirName}/${fileName}`);
      for (const [cat, n] of Object.entries(result.categories)) {
        tierCount.byCategory[cat] = (tierCount.byCategory[cat] || 0) + n;
      }
      for (const [fmt, n] of Object.entries(result.formats)) {
        tierCount.byFormat[fmt] = (tierCount.byFormat[fmt] || 0) + n;
      }
    }
  }

  return { tierCount, failures };
}

function generateContentHash(alliedHealth: Record<string, TierQuestionCount>, nursing: Record<string, TierQuestionCount>, nursingCert: Record<string, TierQuestionCount>): string {
  const data = JSON.stringify({ alliedHealth, nursing, nursingCert });
  return crypto.createHash("sha256").update(data).digest("hex").slice(0, 16);
}

async function queryDatabaseCounts(): Promise<{
  generatedQuestions: number;
  alliedQuestions: number;
  byCareerType: Record<string, number>;
}> {
  const defaultResult = {
    generatedQuestions: 0,
    alliedQuestions: 0,
    byCareerType: {} as Record<string, number>,
  };

  try {
    const pg = await import("pg");
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.log("  [DB] No DATABASE_URL set, skipping database counts");
      return defaultResult;
    }

    const pool = new pg.default.Pool({ connectionString: dbUrl });

    const r1 = await pool.query("SELECT count(*)::int as cnt FROM generated_questions");
    const r2 = await pool.query("SELECT count(*)::int as cnt FROM allied_questions");
    const r3 = await pool.query(
      "SELECT career_type, count(*)::int as cnt FROM allied_questions GROUP BY career_type ORDER BY cnt DESC"
    );

    await pool.end();

    return {
      generatedQuestions: r1.rows[0].cnt,
      alliedQuestions: r2.rows[0].cnt,
      byCareerType: Object.fromEntries(
        r3.rows.map((row: { career_type: string; cnt: number }) => [row.career_type, row.cnt])
      ),
    };
  } catch (err) {
    console.log(`  [DB] Failed to query database: ${err instanceof Error ? err.message : String(err)}`);
    return defaultResult;
  }
}

async function main() {
  const alliedHealth: Record<string, TierQuestionCount> = {};
  const nursing: Record<string, TierQuestionCount> = {};
  const nursingCert: Record<string, TierQuestionCount> = {};
  const allFailures: string[] = [];
  let totalFileCount = 0;

  console.log("=== Question Manifest Generator ===\n");

  console.log("Scanning allied health question files...");
  for (const [key, files] of Object.entries(ALLIED_HEALTH_FILE_MAP)) {
    const { tierCount, failures } = countTier(CAREER_QUESTIONS_DIR, files);
    alliedHealth[key] = tierCount;
    allFailures.push(...failures);
    totalFileCount += tierCount.files.length;
    console.log(`  ${key}: ${tierCount.total} questions (${tierCount.files.length} files)`);
  }

  console.log("\nScanning nursing certification question files...");
  for (const [key, files] of Object.entries(NURSING_CERT_FILE_MAP)) {
    const { tierCount, failures } = countTier(CAREER_QUESTIONS_DIR, files);
    nursingCert[key] = tierCount;
    allFailures.push(...failures);
    totalFileCount += tierCount.files.length;
    console.log(`  ${key}: ${tierCount.total} questions (${tierCount.files.length} files)`);
  }

  console.log("\nScanning nursing tier question files (exam-questions)...");
  const nursingTierFiles = discoverNursingTierFiles(EXAM_QUESTIONS_DIR);
  for (const [tier, files] of Object.entries(nursingTierFiles)) {
    const { tierCount, failures } = countTier(EXAM_QUESTIONS_DIR, files, countExamQuestions);
    nursing[tier] = tierCount;
    allFailures.push(...failures);
    totalFileCount += tierCount.files.length;
    console.log(`  ${tier}: ${tierCount.total} questions (${tierCount.files.length} files)`);
  }

  console.log("\nScanning server-side question data...");
  for (const [key, config] of Object.entries(SERVER_DATA_MAP)) {
    const { tierCount, failures } = countServerDataDir(
      config.dir,
      config.excludeFiles
    );
    const targetKey = key.replace("Server", "ServerData");
    const existingNursing = nursing[targetKey];
    if (existingNursing) {
      existingNursing.total += tierCount.total;
      existingNursing.files.push(...tierCount.files);
      for (const [cat, n] of Object.entries(tierCount.byCategory)) {
        existingNursing.byCategory[cat] = (existingNursing.byCategory[cat] || 0) + n;
      }
      for (const [fmt, n] of Object.entries(tierCount.byFormat)) {
        existingNursing.byFormat[fmt] = (existingNursing.byFormat[fmt] || 0) + n;
      }
    } else {
      nursing[targetKey] = tierCount;
    }
    allFailures.push(...failures);
    totalFileCount += tierCount.files.length;
    console.log(`  ${key}: ${tierCount.total} questions (${tierCount.files.length} files)`);
  }

  const alliedHealthTotal = Object.values(alliedHealth).reduce(
    (sum, tc) => sum + tc.total,
    0
  );
  const nursingStaticTotal = Object.values(nursing).reduce(
    (sum, tc) => sum + tc.total,
    0
  );
  const nursingCertTotal = Object.values(nursingCert).reduce(
    (sum, tc) => sum + tc.total,
    0
  );

  console.log("\nQuerying database counts...");
  const dbCounts = await queryDatabaseCounts();
  console.log(`  generated_questions: ${dbCounts.generatedQuestions}`);
  console.log(`  allied_questions: ${dbCounts.alliedQuestions}`);
  for (const [ct, cnt] of Object.entries(dbCounts.byCareerType)) {
    console.log(`    ${ct}: ${cnt}`);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    version: 1,
    static: {
      alliedHealth,
      nursing,
      nursingCert,
    },
    database: {
      generatedQuestions: dbCounts.generatedQuestions,
      alliedQuestions: dbCounts.alliedQuestions,
      byCareerType: dbCounts.byCareerType,
    },
    totals: {
      alliedHealthStatic: alliedHealthTotal,
      nursingStatic: nursingStaticTotal,
      nursingCertStatic: nursingCertTotal,
      databaseGenerated: dbCounts.generatedQuestions + dbCounts.alliedQuestions,
      publicTotal: alliedHealthTotal + nursingCertTotal,
    },
    integrity: {
      fileCount: totalFileCount,
      parseFailures: allFailures,
      contentHash: generateContentHash(alliedHealth, nursing, nursingCert),
    },
  };

  console.log("\n=== Summary ===");
  console.log(`Allied Health Static: ${alliedHealthTotal}`);
  console.log(`Nursing Cert Static: ${nursingCertTotal}`);
  console.log(`Server Data (nursing): ${nursingStaticTotal}`);
  console.log(`Total Public-Facing: ${manifest.totals.publicTotal}`);
  console.log(`Files Scanned: ${totalFileCount}`);
  if (allFailures.length > 0) {
    console.log(`\nParse Failures (${allFailures.length}):`);
    allFailures.forEach((f) => console.log(`  - ${f}`));
  }

  const outputPath = path.resolve(
    __dirname,
    "../client/src/data/career-questions/question-manifest.json"
  );
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to: ${outputPath}`);

  return manifest;
}

main().catch(console.error);
