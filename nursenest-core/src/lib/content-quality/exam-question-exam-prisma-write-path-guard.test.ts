import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { EXAM_QUESTION_EXAM_PRISMA_WRITE_SITE_FILES } from "@/lib/content-quality/exam-question-exam-prisma-write-site-registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** `nursenest-core/` package root (parent of `src/`). */
const PKG_ROOT = join(__dirname, "../../..");

function rgFilesWithPrismaExamQuestionWrites(): string[] {
  const pattern = String.raw`(\bprisma\.|\btx\.)examQuestion\.(create|createMany|update|updateMany|upsert)`;
  try {
    const out = execFileSync(
      "rg",
      ["-l", "--glob", "*.ts", "--glob", "*.tsx", "--glob", "*.mts", pattern, "src", "scripts", "prisma"],
      { cwd: PKG_ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    return out
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .sort();
  } catch (e) {
    const err = e as { status?: number; stdout?: string };
    if (err.status === 1) {
      return [];
    }
    throw e;
  }
}

test("every Prisma ExamQuestion write site is registered (no silent new write paths)", () => {
  if (!existsSync(join(PKG_ROOT, "package.json"))) {
    return;
  }
  const found = rgFilesWithPrismaExamQuestionWrites();
  const expected = [...EXAM_QUESTION_EXAM_PRISMA_WRITE_SITE_FILES].sort();
  const missingFromRegistry = found.filter((f) => !expected.includes(f));
  const staleRegistry = expected.filter((f) => !found.includes(f));
  assert.deepEqual(
    missingFromRegistry,
    [],
    `Add new write sites to EXAM_QUESTION_EXAM_PRISMA_WRITE_SITE_FILES and ensure exam uses canonicalExamQuestionExamForDbWrite (or documented exempt repair). Offenders: ${missingFromRegistry.join(", ")}`,
  );
  assert.deepEqual(
    staleRegistry,
    [],
    `Remove stale paths from EXAM_QUESTION_EXAM_PRISMA_WRITE_SITE_FILES: ${staleRegistry.join(", ")}`,
  );
});
