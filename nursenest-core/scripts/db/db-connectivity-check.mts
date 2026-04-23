#!/usr/bin/env npx tsx
/**
 * Production/staging DB connectivity smoke test for Prisma + lessons hub queries.
 *
 * Usage (from nursenest-core/):
 *   npm run db:connectivity-check
 *   npm run db:connectivity-check -- --pathway=us-rn-nclex-rn
 *
 * Requires DATABASE_URL (see `src/lib/db/env-bootstrap.ts`).
 */
import "../../src/lib/db/env-bootstrap";
import { classifyHubDbFailure } from "../../src/lib/db/safe-database";
import { ContentStatus, PrismaClient } from "@prisma/client";

const pathwayArg = process.argv.find((a) => a.startsWith("--pathway="));
const pathwayId = pathwayArg?.split("=", 2)[1]?.trim() || "ca-rn-nclex-rn";

type StepResult = {
  step: string;
  ok: boolean;
  category?: string;
  ms?: number;
  detail?: string;
  value?: unknown;
};

function summarizeUrl(): { configured: boolean; host?: string } {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return { configured: false };
  try {
    const u = new URL(raw.replace(/^postgresql:/, "http:"));
    return { configured: true, host: u.hostname };
  } catch {
    return { configured: true };
  }
}

async function main(): Promise<void> {
  const urlInfo = summarizeUrl();
  const steps: StepResult[] = [];
  const tAll = performance.now();

  if (!urlInfo.configured) {
    steps.push({ step: "env_database_url", ok: false, category: "db_missing_url", detail: "DATABASE_URL unset" });
    console.log(
      JSON.stringify(
        {
          ok: false,
          at: new Date().toISOString(),
          pathwayId,
          database_url_configured: false,
          steps,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const t1 = performance.now();
    await prisma.$queryRaw`SELECT 1 as connect_ok`;
    steps.push({ step: "select_1", ok: true, ms: Math.round(performance.now() - t1) });

    const t2 = performance.now();
    const blogCount = await prisma.blogPost.count();
    steps.push({ step: "blog_post_count", ok: true, ms: Math.round(performance.now() - t2), value: blogCount });

    const t3 = performance.now();
    const lessonCount = await prisma.pathwayLesson.count({
      where: { pathwayId, status: ContentStatus.PUBLISHED },
    });
    steps.push({
      step: "pathway_lesson_count_published",
      ok: true,
      ms: Math.round(performance.now() - t3),
      value: lessonCount,
    });

    const t4 = performance.now();
    const groupByRows = await prisma.pathwayLesson.groupBy({
      by: ["locale"],
      where: { pathwayId, status: ContentStatus.PUBLISHED },
      _count: { _all: true },
    });
    steps.push({
      step: "pathway_lesson_locale_groupby",
      ok: true,
      ms: Math.round(performance.now() - t4),
      value: groupByRows,
    });

    console.log(
      JSON.stringify(
        {
          ok: true,
          at: new Date().toISOString(),
          pathwayId,
          database_url_configured: true,
          database_host: urlInfo.host ?? null,
          total_ms: Math.round(performance.now() - tAll),
          steps,
        },
        null,
        2,
      ),
    );
  } catch (e) {
    const category = classifyHubDbFailure(e);
    const detail = e instanceof Error ? e.message : String(e);
    steps.push({ step: "prisma_operation", ok: false, category, detail: detail.slice(0, 500) });
    console.log(
      JSON.stringify(
        {
          ok: false,
          at: new Date().toISOString(),
          pathwayId,
          database_url_configured: true,
          database_host: urlInfo.host ?? null,
          outcome: category,
          total_ms: Math.round(performance.now() - tAll),
          steps,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        at: new Date().toISOString(),
        pathwayId,
        outcome: classifyHubDbFailure(e),
        detail: e instanceof Error ? e.message : String(e),
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
