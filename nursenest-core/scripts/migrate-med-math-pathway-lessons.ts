/**
 * Safe migration pipeline: legacy med-math-lessons → pathway_lessons only.
 *
 * Usage:
 *   cd nursenest-core && npx tsx scripts/migrate-med-math-pathway-lessons.ts --dry-run --pathwayId=us-rn-nclex-rn
 *   cd nursenest-core && npx tsx scripts/migrate-med-math-pathway-lessons.ts --write --pathwayId=us-rn-nclex-rn
 *   cd nursenest-core && npx tsx scripts/migrate-med-math-pathway-lessons.ts --write --verify-base-url=http://127.0.0.1:3000
 *
 * Flags: --dry-run, --write (at least one), --skip-existing, --report-file=path.md
 *
 * Environment: DATABASE_URL when --write. Dry-run does not connect.
 */
import "dotenv/config";

import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";
import { medMathLessons } from "@legacy-client/data/lessons/med-math-lessons";
import type { LessonContent } from "@legacy-client/data/lessons/types";

import { assertPathwayAllowed } from "@/lib/legacy/legacy-public-content-merge";
import { computeStructuralPublicCompleteFromDbRow } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { MedMathPathwayLessonCreatePayload } from "@/lib/migrations/med-math-pathway-lesson/types";
import {
  buildMedMathCreatePayload,
  buildMedMathMigrationUrls,
  buildMedMathPathwayLessonRecord,
  countMedMathLessonWords,
  evaluateMedMathStructuralQuality,
} from "@/lib/migrations/med-math-pathway-lesson/transform-med-math-lesson";
import {
  MED_MATH_MIGRATION_MIN_WORDS,
  validateMedMathLessonContent,
  validateMedMathPayloadCorpus,
} from "@/lib/migrations/med-math-pathway-lesson/validate-med-math-payload";

type Cli = {
  dryRun: boolean;
  write: boolean;
  pathwayId: string;
  verifyBaseUrl: string | null;
  skipExisting: boolean;
  reportFile: string | null;
};

function parseCli(argv: string[]): Cli {
  const dryRun = argv.includes("--dry-run");
  const write = argv.includes("--write");
  const skipExisting = argv.includes("--skip-existing");
  const pathwayArg = argv.find((a) => a.startsWith("--pathwayId="));
  const pathwayId = pathwayArg?.split("=", 2)[1]?.trim() || "us-rn-nclex-rn";
  const verifyArg = argv.find((a) => a.startsWith("--verify-base-url="));
  const verifyBaseUrl = verifyArg?.split("=", 2)[1]?.trim() || null;
  const reportArg = argv.find((a) => a.startsWith("--report-file="));
  const reportFile = reportArg?.split("=", 2)[1]?.trim() || null;
  if (!dryRun && !write) {
    console.error("Specify --dry-run and/or --write");
    process.exit(2);
  }
  return { dryRun, write, pathwayId, verifyBaseUrl, skipExisting, reportFile };
}

async function verifyPublicRender(baseUrl: string, marketingPath: string, title: string): Promise<string[]> {
  const issues: string[] = [];
  const url = `${baseUrl.replace(/\/$/, "")}${marketingPath.startsWith("/") ? "" : "/"}${marketingPath.replace(/^\//, "")}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      issues.push(`fetch ${url} → HTTP ${res.status}`);
      return issues;
    }
    const html = await res.text();
    if (!html.includes(title)) {
      issues.push(`render: HTML did not contain expected title substring for ${url}`);
    }
  } catch (e) {
    issues.push(`fetch_failed: ${String(e)}`);
  }
  return issues;
}

function sectionsJsonStable(sections: unknown): string {
  return JSON.stringify(sections);
}

function verifyDbMatchesPayload(
  dbSections: unknown,
  payload: MedMathPathwayLessonCreatePayload,
  dbTitle: string,
): string[] {
  const issues: string[] = [];
  if (dbTitle !== payload.title) {
    issues.push(`db title mismatch: "${dbTitle}" vs payload "${payload.title}"`);
  }
  if (sectionsJsonStable(dbSections) !== sectionsJsonStable(payload.sections)) {
    issues.push("db sections JSON differs from payload (serialized compare)");
  }
  return issues;
}

async function main() {
  const cli = parseCli(process.argv.slice(2));
  if (cli.write) {
    await import("@/lib/db/env-bootstrap");
  }
  assertPathwayAllowed(cli.pathwayId);

  const prisma = cli.write ? new PrismaClient() : null;
  const reportLines: string[] = [];
  const header = [
    "# Med-math → pathway_lessons migration report",
    "",
    `- pathwayId: \`${cli.pathwayId}\``,
    `- dryRun: ${cli.dryRun}`,
    `- write: ${cli.write}`,
    `- verifyBaseUrl: ${cli.verifyBaseUrl ?? "(none)"}`,
    `- minWords: ${MED_MATH_MIGRATION_MIN_WORDS}`,
    "",
    "| legacy slug | new slug | word count | valid? | structural complete? | marketing URL | admin URL | notes |",
    "|---|---:|---:|:---|:---|---|---|---|",
  ];
  reportLines.push(...header);

  let migrated = 0;
  let skippedDup = 0;
  let validationFailed = 0;
  let blockedDuplicate = 0;
  let verifyFailed = 0;

  const entries = Object.entries(medMathLessons as Record<string, LessonContent>);

  try {
    for (const [legacySlug, lesson] of entries) {
      const newSlug = legacySlug;
      const contentIssues = validateMedMathLessonContent(lesson);
      const payload = buildMedMathCreatePayload({ legacySlug, lesson, pathwayId: cli.pathwayId });
      const corpusIssues = validateMedMathPayloadCorpus(payload.sections);
      const record = buildMedMathPathwayLessonRecord({ legacySlug, lesson, pathwayId: cli.pathwayId });
      const gate = evaluateMedMathStructuralQuality(record);
      const allIssues = [...contentIssues, ...corpusIssues, ...gate.issues];
      const urls = buildMedMathMigrationUrls(cli.pathwayId, newSlug);
      const wc = countMedMathLessonWords(payload.sections);
      const valid = allIssues.length === 0;
      const structOk = gate.publicComplete;
      if (!valid || !structOk) validationFailed += 1;

      console.log("\n---");
      console.log("legacy slug:", legacySlug);
      console.log("new slug:   ", newSlug);
      console.log("pathwayId:  ", cli.pathwayId);
      console.log("marketing: ", urls.marketingLessonUrl);
      console.log("admin:      ", urls.adminEditUrl);
      console.log("word count: ", wc);
      console.log("valid:      ", valid ? "yes" : `no (${allIssues.join("; ")})`);
      console.log("structural: ", structOk ? "publicComplete" : `issues: ${gate.issues.join("; ")}`);

      const notes = [
        ...allIssues,
        ...(gate.warnings?.length ? gate.warnings.map((w) => `warn:${w}`) : []),
      ].join(" · ");

      reportLines.push(
        `| \`${legacySlug}\` | \`${newSlug}\` | ${wc} | ${valid ? "yes" : "no"} | ${structOk ? "yes" : "no"} | \`${urls.marketingLessonUrl}\` | \`${urls.adminEditUrl}\` | ${notes.replace(/\|/g, "\\|")} |`,
      );

      if (!cli.write || !valid || !structOk) {
        continue;
      }

      if (!prisma) continue;

      const existing = await prisma.pathwayLesson.findUnique({
        where: {
          pathwayId_slug_locale: {
            pathwayId: cli.pathwayId,
            slug: newSlug,
            locale: "en",
          },
        },
        select: { id: true },
      });
      if (existing) {
        if (cli.skipExisting) {
          skippedDup += 1;
          console.log("skip existing row:", existing.id);
          continue;
        }
        blockedDuplicate += 1;
        console.error("Refusing overwrite: row exists for slug", newSlug, "id=", existing.id, "(use --skip-existing)");
        continue;
      }

      const created = await prisma.pathwayLesson.create({
        data: {
          pathwayId: cli.pathwayId,
          slug: newSlug,
          locale: "en",
          title: payload.title,
          topic: payload.topic,
          topicSlug: payload.topicSlug,
          bodySystem: payload.bodySystem,
          previewSectionCount: payload.previewSectionCount,
          seoTitle: payload.seoTitle,
          seoDescription: payload.seoDescription,
          sections: payload.sections as unknown as Prisma.InputJsonValue,
          status: payload.status,
          tierCode: payload.tierCode,
          sortOrder: payload.sortOrder,
          exams: payload.exams,
          countries: payload.countries,
          priority: payload.priority,
          examMeta: payload.examMeta as Prisma.InputJsonValue,
          structuralPublicComplete: false,
          published_at: new Date(),
        },
        select: {
          id: true,
          slug: true,
          title: true,
          pathwayId: true,
          sections: true,
          locale: true,
          seoTitle: true,
          seoDescription: true,
          topic: true,
          topicSlug: true,
          bodySystem: true,
          previewSectionCount: true,
          exams: true,
          countries: true,
          priority: true,
          examMeta: true,
        },
      });

      const structuralPublicComplete = computeStructuralPublicCompleteFromDbRow({
        ...created,
        pathwayId: cli.pathwayId,
      });
      await prisma.pathwayLesson.update({
        where: { id: created.id },
        data: { structuralPublicComplete },
      });

      migrated += 1;
      const afterUrls = buildMedMathMigrationUrls(cli.pathwayId, newSlug, created.id);
      console.log("INSERTED id:", created.id);
      console.log("learner:   ", afterUrls.learnerDetailUrlAfterWrite);

      const row = await prisma.pathwayLesson.findUnique({
        where: { id: created.id },
        select: { title: true, sections: true, structuralPublicComplete: true },
      });
      const dbIssues = row ? verifyDbMatchesPayload(row.sections, payload, row.title) : ["VERIFY DB: row missing after insert"];
      if (dbIssues.length) {
        console.error("VERIFY DB:", dbIssues.join("; "));
        verifyFailed += 1;
      } else {
        console.log("VERIFY DB: sections + title match payload");
      }
      if (row && !row.structuralPublicComplete) {
        console.warn("VERIFY: structuralPublicComplete still false after recompute");
      }

      if (cli.verifyBaseUrl) {
        const vIssues = await verifyPublicRender(cli.verifyBaseUrl, urls.marketingLessonUrl, payload.title);
        if (vIssues.length) {
          console.error("VERIFY render:", vIssues.join("; "));
          verifyFailed += 1;
        } else {
          console.log("VERIFY fetch: OK (title present in HTML)");
        }
      }
    }
  } finally {
    if (prisma) await prisma.$disconnect();
  }

  reportLines.push(
    "",
    "## Summary",
    "",
    `- lessons in source: ${entries.length}`,
    `- migrated (write): ${migrated}`,
    `- skipped duplicate (--skip-existing): ${skippedDup}`,
    `- blocked duplicate (refused overwrite): ${blockedDuplicate}`,
    `- validation / structural failures: ${validationFailed}`,
    `- verify failures (HTTP or DB compare): ${verifyFailed}`,
    "",
  );

  const report = reportLines.join("\n");
  console.log("\n======== MIGRATION REPORT (markdown) ========\n");
  console.log(report);
  if (cli.reportFile) {
    writeFileSync(cli.reportFile, report, "utf8");
    console.log("Wrote report file:", cli.reportFile);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});