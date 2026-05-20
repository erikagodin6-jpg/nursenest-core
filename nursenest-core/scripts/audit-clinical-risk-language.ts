#!/usr/bin/env tsx

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import {
  scanClinicalRiskLanguage,
  type ClinicalRiskSignal,
} from "../src/lib/questions/clinical-risk-language";
import { EXAM_QUESTION_STATUS_PUBLISHED_SQL } from "../src/lib/questions/exam-question-bank-sql";

type ExamQuestionRow = {
  id: string;
  exam: string | null;
  topic: string | null;
  body_system: string | null;
  stem: string | null;
  rationale: string | null;
  clinical_reasoning: string | null;
  exam_strategy: string | null;
  options: unknown;
};

type AuditFinding = {
  id: string;
  exam: string | null;
  topic: string | null;
  bodySystem: string | null;
  severity: "review" | "high";
  signalCodes: string[];
  findings: ClinicalRiskSignal[];
  stemPreview: string;
};

function loadDotenvFromPackageRoot(): void {
  const root = process.cwd();
  for (const name of [".env", ".env.local", ".env.production"]) {
    const p = resolve(root, name);
    if (!existsSync(p)) continue;
    const parsed = parseDotenv(readFileSync(p, "utf8"));
    for (const [k, v] of Object.entries(parsed)) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

function highestSeverity(signals: ClinicalRiskSignal[]): "review" | "high" {
  return signals.some((signal) => signal.severity === "high") ? "high" : "review";
}

async function main(): Promise<void> {
  loadDotenvFromPackageRoot();

  const rawUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!rawUrl) {
    console.log("DATABASE_URL is unset — skipping clinical risk audit.");
    process.exit(0);
  }

  const limit = Math.max(1, Number.parseInt(process.env.NN_CLINICAL_RISK_AUDIT_LIMIT ?? "5000", 10));
  const prisma = new PrismaClient();

  try {
    const rows = await prisma.$queryRaw<ExamQuestionRow[]>`
      SELECT
        id,
        exam,
        topic,
        body_system,
        stem,
        rationale,
        clinical_reasoning,
        exam_strategy,
        options
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
      LIMIT ${limit}
    `;

    const findings: AuditFinding[] = [];

    for (const row of rows) {
      const signals = scanClinicalRiskLanguage({
        stem: row.stem,
        rationale: row.rationale,
        clinicalReasoning: row.clinical_reasoning,
        examStrategy: row.exam_strategy,
        options: row.options,
        topic: row.topic,
        bodySystem: row.body_system,
      });

      if (signals.length === 0) continue;

      findings.push({
        id: row.id,
        exam: row.exam,
        topic: row.topic,
        bodySystem: row.body_system,
        severity: highestSeverity(signals),
        signalCodes: signals.map((signal) => signal.code),
        findings: signals,
        stemPreview: String(row.stem ?? "").replace(/\s+/g, " ").slice(0, 180),
      });
    }

    findings.sort((a, b) => {
      const rank = { high: 0, review: 1 } as const;
      return rank[a.severity] - rank[b.severity];
    });

    console.log("\n╔══════════════════════════════════════════════════════════════════════╗");
    console.log("║  Clinical risk language audit                                       ║");
    console.log("╚══════════════════════════════════════════════════════════════════════╝\n");
    console.log(`Scanned rows        : ${rows.length.toLocaleString()}`);
    console.log(`Flagged rows        : ${findings.length.toLocaleString()}`);
    console.log(`High severity rows  : ${findings.filter((f) => f.severity === "high").length.toLocaleString()}`);

    for (const finding of findings.slice(0, 20)) {
      console.log(`\n[${finding.severity.toUpperCase()}] ${finding.id} | ${finding.exam ?? "(exam?)"} | ${finding.topic ?? "(topic?)"}`);
      console.log(`  ${finding.signalCodes.join(", ")}`);
      console.log(`  ${finding.stemPreview}`);
    }

    const reportsDir = resolve(process.cwd(), "reports");
    mkdirSync(reportsDir, { recursive: true });

    const outPath = resolve(reportsDir, "clinical-risk-language-audit.json");
    writeFileSync(
      outPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          scannedRows: rows.length,
          flaggedRows: findings.length,
          highSeverityRows: findings.filter((f) => f.severity === "high").length,
          findings,
        },
        null,
        2,
      ),
    );

    console.log(`\nWrote ${outPath}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
