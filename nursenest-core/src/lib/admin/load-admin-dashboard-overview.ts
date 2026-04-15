import "server-only";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { loadAdminDashboardStats, type QuestionTierBucket } from "@/lib/admin/load-admin-dashboard-stats";

export type AdminDashboardOverview = {
  generatedAt: string;
  content: {
    blogPosts: number | null;
    lessons: number | null;
    flashcards: number | null;
    questions: number | null;
  };
  users: {
    total: number | null;
    activeSubscribers: number | null;
  };
  exams: {
    totalQuestions: number | null;
    byTier: Partial<Record<QuestionTierBucket, number>> | null;
  };
  health: {
    dbOk: boolean | null;
    lastAutomation: { at: string; summary: string | null; jobType: string } | null;
  };
  env: {
    nodeEnv: string;
    vercelEnv: string | null;
  };
};

async function safeBlogCount(): Promise<number | null> {
  try {
    return await prisma.blogPost.count();
  } catch {
    return null;
  }
}

async function safeDbPing(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function safeLastAutomation(): Promise<AdminDashboardOverview["health"]["lastAutomation"]> {
  try {
    const row = await prisma.contentAutomationLog.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, summary: true, jobType: true },
    });
    if (!row) return null;
    return {
      at: row.createdAt.toISOString(),
      summary: row.summary,
      jobType: row.jobType,
    };
  } catch {
    return null;
  }
}

/**
 * Bounded metrics for the main /admin dashboard cards. Each query is isolated — failures become nulls.
 */
export async function loadAdminDashboardOverview(): Promise<AdminDashboardOverview> {
  const generatedAt = new Date().toISOString();
  const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    vercelEnv: process.env.VERCEL_ENV ?? null,
  };

  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return {
      generatedAt,
      content: { blogPosts: null, lessons: null, flashcards: null, questions: null },
      users: { total: null, activeSubscribers: null },
      exams: { totalQuestions: null, byTier: null },
      health: { dbOk: false, lastAutomation: null },
      env,
    };
  }

  const [blogPosts, stats, dbOk, lastAutomation] = await Promise.all([
    safeBlogCount(),
    loadAdminDashboardStats().catch(() => null),
    safeDbPing(),
    safeLastAutomation(),
  ]);

  const lessons =
    stats != null ? stats.totals.lessonsTotal : null;
  const flashcards = stats?.totals.flashcardsPublished ?? null;
  const questions = stats?.totals.questionsPublished ?? null;
  const totalUsers = stats?.totals.users ?? null;
  const activeSubscribers = stats?.totals.activeSubscriptions ?? null;

  return {
    generatedAt,
    content: {
      blogPosts,
      lessons,
      flashcards,
      questions,
    },
    users: {
      total: totalUsers,
      activeSubscribers,
    },
    exams: {
      totalQuestions: questions,
      byTier: stats?.questionsByTierBucket ?? null,
    },
    health: {
      dbOk,
      lastAutomation,
    },
    env,
  };
}
