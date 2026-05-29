import "server-only";

import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import {
  calculateSeatUtilization,
  normalizeInstitutionType,
  type InstitutionalDashboardData,
  type InstitutionalLearnerRow,
} from "@/lib/institutional/licensing-types";

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function parseWeakAreas(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 4);
}

async function organizationTableExists(): Promise<boolean> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return false;
  const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'institutional_organizations'
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

export async function loadInstitutionalDashboardData(
  selectedOrganizationId?: string | null,
): Promise<InstitutionalDashboardData | null> {
  if (!(await organizationTableExists())) return null;

  const organizationsRaw = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      slug: string;
      type: string;
      status: string;
      seat_cap: number;
      renewal_at: Date | null;
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
      primary_timezone: string | null;
      created_at: Date;
      learner_count: bigint;
      faculty_count: bigint;
      admin_count: bigint;
      avg_readiness_score: number | null;
      completed_lessons: bigint;
      learner_activity_7d: bigint;
    }>
  >`
    SELECT
      o.id,
      o.name,
      o.slug,
      o.type,
      o.status,
      o.seat_cap,
      o.renewal_at,
      o.stripe_customer_id,
      o.stripe_subscription_id,
      o.primary_timezone,
      o.created_at,
      COUNT(DISTINCT m.user_id) FILTER (WHERE m.status = 'active' AND m.role = 'learner')::bigint AS learner_count,
      COUNT(DISTINCT m.user_id) FILTER (WHERE m.status = 'active' AND m.role = 'faculty')::bigint AS faculty_count,
      COUNT(DISTINCT m.user_id) FILTER (WHERE m.status = 'active' AND m.role = 'institution_admin')::bigint AS admin_count,
      AVG(s.readiness_score)::double precision AS avg_readiness_score,
      COUNT(DISTINCT p.id) FILTER (WHERE p.completed = true)::bigint AS completed_lessons,
      COUNT(DISTINCT lae.user_id) FILTER (WHERE lae.created_at >= NOW() - INTERVAL '7 days')::bigint AS learner_activity_7d
    FROM institutional_organizations o
    LEFT JOIN institutional_memberships m ON m.organization_id = o.id AND m.status = 'active'
    LEFT JOIN student_study_profiles s ON s.user_id = m.user_id AND m.role = 'learner'
    LEFT JOIN "Progress" p ON p."userId" = m.user_id AND m.role = 'learner'
    LEFT JOIN learner_activity_events lae ON lae.user_id = m.user_id AND m.role = 'learner'
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  const organizations = organizationsRaw.map((row) => {
    const assignedSeats = Number(row.learner_count);
    const utilization = calculateSeatUtilization(row.seat_cap, assignedSeats);
    const learnerCount = Number(row.learner_count);
    const completedLessons = Number(row.completed_lessons);
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      type: row.type,
      status: row.status,
      seatCap: utilization.seatCap,
      assignedSeats: utilization.assignedSeats,
      availableSeats: utilization.availableSeats,
      renewalAt: toIso(row.renewal_at),
      stripeCustomerId: row.stripe_customer_id,
      stripeSubscriptionId: row.stripe_subscription_id,
      primaryTimezone: row.primary_timezone,
      learnerCount,
      facultyCount: Number(row.faculty_count),
      adminCount: Number(row.admin_count),
      avgReadinessScore:
        row.avg_readiness_score == null ? null : Math.round(Number(row.avg_readiness_score) * 10) / 10,
      completionRatePct:
        learnerCount > 0 ? Math.min(100, Math.round((completedLessons / Math.max(learnerCount, 1)) * 1000) / 10) : null,
      activeLearners7d: Number(row.learner_activity_7d),
      createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    };
  });

  const selectedOrganization = organizations.find((org) => org.id === selectedOrganizationId) ?? organizations[0] ?? null;
  const orgId = selectedOrganization?.id ?? null;

  const learners = orgId
    ? await prisma.$queryRaw<
        Array<{
          user_id: string;
          name: string | null;
          email: string;
          tier: string;
          learner_path: string | null;
          readiness_score: number | null;
          readiness_level: string | null;
          weak_areas: unknown;
          cat_completed: bigint;
          lessons_completed: bigint;
          flashcards_completed: bigint;
          clinical_skills_activity: bigint;
          last_active_at: Date | null;
        }>
      >`
        WITH weak_topics AS (
          SELECT
            uts."userId" AS user_id,
            jsonb_agg(uts.topic ORDER BY uts."wrongCount" DESC, uts."updatedAt" DESC) FILTER (WHERE uts."wrongCount" > uts."correctCount") AS weak_areas
          FROM "UserTopicStat" uts
          GROUP BY uts."userId"
        )
        SELECT
          u.id AS user_id,
          NULLIF(trim(COALESCE(u."displayName", u.name)), '') AS name,
          u.email,
          u.tier::text AS tier,
          u."learnerPath" AS learner_path,
          s.readiness_score,
          s.readiness_level,
          wt.weak_areas,
          COUNT(DISTINCT pt.id) FILTER (WHERE pt.status = 'COMPLETED')::bigint AS cat_completed,
          COUNT(DISTINCT p.id) FILTER (WHERE p.completed = true)::bigint AS lessons_completed,
          COALESCE(MAX(s.flashcards_studied), 0)::bigint AS flashcards_completed,
          COUNT(DISTINCT lae.id) FILTER (WHERE lae.activity_type IN ('clinical_skills', 'clinical-skills'))::bigint AS clinical_skills_activity,
          GREATEST(
            COALESCE(MAX(lae.created_at), 'epoch'::timestamp),
            COALESCE(MAX(p."updatedAt"), 'epoch'::timestamp),
            COALESCE(MAX(pt."updatedAt"), 'epoch'::timestamp),
            COALESCE(MAX(s.updated_at), 'epoch'::timestamp)
          ) AS last_active_at
        FROM institutional_memberships im
        JOIN "User" u ON u.id = im.user_id
        LEFT JOIN student_study_profiles s ON s.user_id = u.id
        LEFT JOIN weak_topics wt ON wt.user_id = u.id
        LEFT JOIN practice_tests pt ON pt."userId" = u.id
        LEFT JOIN "Progress" p ON p."userId" = u.id
        LEFT JOIN learner_activity_events lae ON lae.user_id = u.id
        WHERE im.organization_id = ${orgId}
          AND im.status = 'active'
          AND im.role = 'learner'
        GROUP BY u.id, u."displayName", u.name, u.email, u.tier, u."learnerPath", s.readiness_score, s.readiness_level, wt.weak_areas
        ORDER BY last_active_at DESC
        LIMIT 150
      `
    : [];

  const cohorts = orgId
    ? await prisma.$queryRaw<
        Array<{
          id: string;
          organization_id: string;
          name: string;
          default_pathway_id: string | null;
          status: string;
          learner_count: bigint;
          avg_readiness_score: number | null;
          completed_lessons: bigint;
        }>
      >`
        SELECT
          c.id,
          c.organization_id,
          c.name,
          c.default_pathway_id,
          c.status,
          COUNT(DISTINCT cm.user_id) FILTER (WHERE cm.active = true AND cm.role = 'learner')::bigint AS learner_count,
          AVG(s.readiness_score)::double precision AS avg_readiness_score,
          COUNT(DISTINCT p.id) FILTER (WHERE p.completed = true)::bigint AS completed_lessons
        FROM institutional_cohorts c
        LEFT JOIN institutional_cohort_memberships cm ON cm.cohort_id = c.id AND cm.active = true
        LEFT JOIN student_study_profiles s ON s.user_id = cm.user_id
        LEFT JOIN "Progress" p ON p."userId" = cm.user_id
        WHERE c.organization_id = ${orgId}
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `
    : [];

  const recentEvents = orgId
    ? await prisma.$queryRaw<
        Array<{
          id: string;
          organization_id: string;
          actor_user_id: string | null;
          event_type: string;
          seat_delta: number | null;
          meta: unknown;
          created_at: Date;
        }>
      >`
        SELECT id, organization_id, actor_user_id, event_type, seat_delta, meta, created_at
        FROM institutional_license_events
        WHERE organization_id = ${orgId}
        ORDER BY created_at DESC
        LIMIT 30
      `
    : [];

  const learnerRows: InstitutionalLearnerRow[] = learners.map((row) => ({
    userId: row.user_id,
    name: row.name,
    email: row.email,
    tier: row.tier,
    learnerPath: row.learner_path,
    readinessScore: row.readiness_score,
    readinessLevel: row.readiness_level,
    weakAreas: parseWeakAreas(row.weak_areas),
    catCompleted: Number(row.cat_completed),
    lessonsCompleted: Number(row.lessons_completed),
    flashcardsCompleted: Number(row.flashcards_completed),
    clinicalSkillsActivity: Number(row.clinical_skills_activity),
    lastActiveAt: row.last_active_at && row.last_active_at.getTime() > 0 ? row.last_active_at.toISOString() : null,
  }));

  const totals = organizations.reduce(
    (acc, org) => {
      acc.organizations += 1;
      acc.seatsPurchased += org.seatCap;
      acc.seatsAssigned += org.assignedSeats;
      acc.seatsAvailable += org.availableSeats;
      acc.activeLearners7d += org.activeLearners7d;
      return acc;
    },
    { organizations: 0, seatsPurchased: 0, seatsAssigned: 0, seatsAvailable: 0, activeLearners7d: 0 },
  );
  const readinessValues = organizations
    .map((org) => org.avgReadinessScore)
    .filter((score): score is number => typeof score === "number");
  const completionValues = organizations
    .map((org) => org.completionRatePct)
    .filter((score): score is number => typeof score === "number");

  return {
    generatedAt: new Date().toISOString(),
    organizations,
    selectedOrganization,
    learners: learnerRows,
    cohorts: cohorts.map((row) => {
      const learnerCount = Number(row.learner_count);
      const completedLessons = Number(row.completed_lessons);
      return {
        id: row.id,
        organizationId: row.organization_id,
        name: row.name,
        defaultPathwayId: row.default_pathway_id,
        status: row.status,
        learnerCount,
        avgReadinessScore:
          row.avg_readiness_score == null ? null : Math.round(Number(row.avg_readiness_score) * 10) / 10,
        completionRatePct:
          learnerCount > 0 ? Math.min(100, Math.round((completedLessons / Math.max(learnerCount, 1)) * 1000) / 10) : null,
      };
    }),
    recentEvents: recentEvents.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      actorUserId: row.actor_user_id,
      eventType: row.event_type,
      seatDelta: row.seat_delta,
      meta: row.meta,
      createdAt: row.created_at.toISOString(),
    })),
    totals: {
      ...totals,
      avgReadinessScore:
        readinessValues.length > 0
          ? Math.round((readinessValues.reduce((sum, score) => sum + score, 0) / readinessValues.length) * 10) / 10
          : null,
      completionRatePct:
        completionValues.length > 0
          ? Math.round((completionValues.reduce((sum, score) => sum + score, 0) / completionValues.length) * 10) / 10
          : null,
    },
  };
}

export type CreateInstitutionInput = {
  name?: unknown;
  type?: unknown;
  seatCap?: unknown;
  renewalAt?: unknown;
  stripeCustomerId?: unknown;
  stripeSubscriptionId?: unknown;
};

export async function createInstitutionalOrganization(input: CreateInstitutionInput, actorUserId: string | null) {
  if (!(await organizationTableExists())) {
    throw new Error("Institutional licensing migration has not been applied.");
  }
  const name = cleanText(input.name, 160);
  if (name.length < 2) throw new Error("Institution name is required.");
  const type = normalizeInstitutionType(cleanText(input.type, 64) || "nursing_school");
  const requestedSlug = slugify(name);
  if (!requestedSlug) throw new Error("Institution name must include letters or numbers.");
  const seatCap = Math.max(0, Math.min(100_000, Number(input.seatCap) || 0));
  const renewalText = cleanText(input.renewalAt, 40);
  const renewalAt = renewalText ? new Date(renewalText) : null;
  const id = randomUUID();
  const slug = `${requestedSlug}-${id.slice(0, 8)}`;
  const stripeCustomerId = cleanText(input.stripeCustomerId, 128) || null;
  const stripeSubscriptionId = cleanText(input.stripeSubscriptionId, 128) || null;

  await prisma.$transaction([
    prisma.$executeRaw`
      INSERT INTO institutional_organizations (
        id, name, slug, type, status, seat_cap, renewal_at, stripe_customer_id, stripe_subscription_id, created_by_user_id, created_at, updated_at
      )
      VALUES (
        ${id}, ${name}, ${slug}, ${type}, 'active', ${seatCap}, ${renewalAt}, ${stripeCustomerId}, ${stripeSubscriptionId}, ${actorUserId}, NOW(), NOW()
      )
    `,
    prisma.$executeRaw`
      INSERT INTO institutional_license_events (id, organization_id, actor_user_id, event_type, seat_delta, meta, created_at)
      VALUES (${randomUUID()}, ${id}, ${actorUserId}, 'institution_created', ${seatCap}, ${JSON.stringify({ name, type })}::jsonb, NOW())
    `,
  ]);
  return { id, slug };
}

export async function updateInstitutionalLicense(input: {
  organizationId: string;
  seatCap: unknown;
  renewalAt?: unknown;
  status?: unknown;
  stripeCustomerId?: unknown;
  stripeSubscriptionId?: unknown;
  actorUserId: string | null;
}) {
  if (!(await organizationTableExists())) throw new Error("Institutional licensing migration has not been applied.");
  const existing = await prisma.$queryRaw<Array<{ seat_cap: number }>>`
    SELECT seat_cap FROM institutional_organizations WHERE id = ${input.organizationId} LIMIT 1
  `;
  if (!existing[0]) throw new Error("Institution not found.");
  const oldSeatCap = Number(existing[0].seat_cap);
  const seatCap = Math.max(0, Math.min(100_000, Number(input.seatCap) || 0));
  const renewalText = cleanText(input.renewalAt, 40);
  const renewalAt = renewalText ? new Date(renewalText) : null;
  const status = cleanText(input.status, 32) || "active";
  const stripeCustomerId = cleanText(input.stripeCustomerId, 128) || null;
  const stripeSubscriptionId = cleanText(input.stripeSubscriptionId, 128) || null;

  await prisma.$transaction([
    prisma.$executeRaw`
      UPDATE institutional_organizations
      SET seat_cap = ${seatCap},
          renewal_at = ${renewalAt},
          status = ${status},
          stripe_customer_id = ${stripeCustomerId},
          stripe_subscription_id = ${stripeSubscriptionId},
          updated_at = NOW()
      WHERE id = ${input.organizationId}
    `,
    prisma.$executeRaw`
      INSERT INTO institutional_license_events (id, organization_id, actor_user_id, event_type, seat_delta, meta, created_at)
      VALUES (
        ${randomUUID()},
        ${input.organizationId},
        ${input.actorUserId},
        'license_updated',
        ${seatCap - oldSeatCap},
        ${JSON.stringify({ oldSeatCap, seatCap, renewalAt: renewalAt?.toISOString() ?? null, status })}::jsonb,
        NOW()
      )
    `,
  ]);
}

export async function assignInstitutionSeat(input: {
  organizationId: string;
  email: unknown;
  role?: unknown;
  actorUserId: string | null;
}) {
  if (!(await organizationTableExists())) throw new Error("Institutional licensing migration has not been applied.");
  const email = cleanText(input.email, 320).toLowerCase();
  if (!email.includes("@")) throw new Error("A valid user email is required.");
  const role = cleanText(input.role, 32) || "learner";
  if (!["learner", "faculty", "institution_admin"].includes(role)) throw new Error("Unsupported institution role.");

  const orgRows = await prisma.$queryRaw<Array<{ seat_cap: number; assigned: bigint }>>`
    SELECT
      o.seat_cap,
      COUNT(m.id) FILTER (WHERE m.status = 'active' AND m.role = 'learner')::bigint AS assigned
    FROM institutional_organizations o
    LEFT JOIN institutional_memberships m ON m.organization_id = o.id
    WHERE o.id = ${input.organizationId}
    GROUP BY o.id
    LIMIT 1
  `;
  const org = orgRows[0];
  if (!org) throw new Error("Institution not found.");
  if (role === "learner" && Number(org.assigned) >= Number(org.seat_cap)) {
    throw new Error("No available learner seats remain for this institution.");
  }

  const userRows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "User" WHERE lower(email) = ${email} LIMIT 1
  `;
  const userId = userRows[0]?.id;
  if (!userId) throw new Error("No NurseNest user exists with that email.");

  await prisma.$transaction([
    prisma.$executeRaw`
      INSERT INTO institutional_memberships (id, organization_id, user_id, role, status, invited_email, assigned_at, removed_at, created_at, updated_at)
      VALUES (${randomUUID()}, ${input.organizationId}, ${userId}, ${role}, 'active', ${email}, NOW(), NULL, NOW(), NOW())
      ON CONFLICT (organization_id, user_id)
      DO UPDATE SET role = ${role}, status = 'active', invited_email = ${email}, assigned_at = NOW(), removed_at = NULL, updated_at = NOW()
    `,
    prisma.$executeRaw`
      INSERT INTO institutional_license_events (id, organization_id, actor_user_id, event_type, seat_delta, meta, created_at)
      VALUES (${randomUUID()}, ${input.organizationId}, ${input.actorUserId}, 'seat_assigned', ${role === "learner" ? 1 : 0}, ${JSON.stringify({ email, role })}::jsonb, NOW())
    `,
  ]);
  return { userId };
}

export async function removeInstitutionSeat(input: {
  organizationId: string;
  userId: string;
  actorUserId: string | null;
}) {
  if (!(await organizationTableExists())) throw new Error("Institutional licensing migration has not been applied.");
  await prisma.$transaction([
    prisma.$executeRaw`
      UPDATE institutional_memberships
      SET status = 'removed', removed_at = NOW(), updated_at = NOW()
      WHERE organization_id = ${input.organizationId} AND user_id = ${input.userId}
    `,
    prisma.$executeRaw`
      INSERT INTO institutional_license_events (id, organization_id, actor_user_id, event_type, seat_delta, meta, created_at)
      VALUES (${randomUUID()}, ${input.organizationId}, ${input.actorUserId}, 'seat_removed', -1, ${JSON.stringify({ userId: input.userId })}::jsonb, NOW())
    `,
  ]);
}

export function pathwayFilterSql(pathwayId: string | null): Prisma.Sql {
  return pathwayId ? Prisma.sql`AND u."learnerPath" = ${pathwayId}` : Prisma.empty;
}
