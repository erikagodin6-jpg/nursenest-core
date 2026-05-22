import { UserRole } from "@prisma/client";

export const LIFECYCLE = {
  // Days of inactivity before each warning (free users)
  FREE_WARNING1_DAYS: 45,
  FREE_WARNING2_DAYS: 53,
  FREE_WARNING3_DAYS: 59,
  FREE_SOFT_DELETE_DAYS: 60,

  // Days of inactivity before each warning (engaged users with lessons/progress)
  ENGAGED_WARNING1_DAYS: 135,
  ENGAGED_WARNING2_DAYS: 143,
  ENGAGED_WARNING3_DAYS: 149,
  ENGAGED_SOFT_DELETE_DAYS: 150,

  // Days after soft-delete before permanent PII purge
  PERMANENT_PURGE_DAYS: 90,

  // Roles NEVER subject to automatic deletion
  PROTECTED_ROLES: [
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CONTENT_ADMIN,
    UserRole.SUPPORT_ADMIN,
  ] as UserRole[],
} as const;

export function daysToMs(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + daysToMs(days));
}

export function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
}
