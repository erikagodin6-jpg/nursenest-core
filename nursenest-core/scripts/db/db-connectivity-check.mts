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
import "../../src/lib/db/script-env-bootstrap";
import {
  databaseUrlDriftAuditPublic,
  logDatabaseUrlDriftAuditEvent,
} from "../../src/lib/db/database-url-drift-audit";
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
          databaseUrlDrift: null,
          steps,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  const databaseUrlDrift = databaseUrlDriftAuditPublic(process.env.DATABASE_URL?.trim() ?? "");
  if (databaseUrlDrift) {
    logDatabaseUrlDriftAuditEvent("db_connectivity_check");
  }

  const prisma = new PrismaClient();

  async function runStep<T>(name: string, fn: () => Promise<T>): Promise<{ ok: true; value: T } | { ok: false }> {
    const t0 = performance.now();
    try {
      const value = await fn();
      steps.push({ step: name, ok: true, ms: Math.round(performance.now() - t0), value: value as unknown });
      return { ok: true, value };
    } catch (e) {
      const category = classifyHubDbFailure(e);
      const detail = e instanceof Error ? e.message : String(e);
      steps.push({
        step: name,
        ok: false,
        category,
        ms: Math.round(performance.now() - t0),
        detail: detail.slice(0, 500),
      });
      return { ok: false };
    }
  }

  try {
    if ((await runStep("select_1", () => prisma.$queryRaw`SELECT 1 as connect_ok`)).ok === false) {
      throw new Error("select_1_failed");
    }
    if ((await runStep("blog_post_count", () => prisma.blogPost.count())).ok === false) {
      throw new Error("blog_post_count_failed");
    }
    if (
      (
        await runStep("pathway_lesson_count_published", () =>
          prisma.pathwayLesson.count({
            where: { pathwayId, status: ContentStatus.PUBLISHED },
          }),
        )
      ).ok === false
    ) {
      throw new Error("pathway_lesson_count_failed");
    }
    if (
      (
        await runStep("pathway_lesson_locale_groupby", () =>
          prisma.pathwayLesson.groupBy({
            by: ["locale"],
            where: { pathwayId, status: ContentStatus.PUBLISHED },
            _count: { _all: true },
          }),
        )
      ).ok === false
    ) {
      throw new Error("pathway_lesson_locale_groupby_failed");
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          at: new Date().toISOString(),
          pathwayId,
          database_url_configured: true,
          database_host: urlInfo.host ?? null,
          databaseUrlDrift,
          total_ms: Math.round(performance.now() - tAll),
          steps,
        },
        null,
        2,
      ),
    );
  } catch {
    const lastFail = [...steps].reverse().find((s) => !s.ok);
    console.log(
      JSON.stringify(
        {
          ok: false,
          at: new Date().toISOString(),
          pathwayId,
          database_url_configured: true,
          database_host: urlInfo.host ?? null,
          databaseUrlDrift,
          outcome: lastFail?.category ?? "db_error",
          failed_step: lastFail?.step ?? null,
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
