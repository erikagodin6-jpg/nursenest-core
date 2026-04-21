import type { UserRole } from "@prisma/client";
import { normalizeEmailForDedup } from "@/lib/auth/email-address-normalization";
import { prisma } from "@/lib/db";

/**
 * Lightweight role lookup for credentials login rate-limit routing only.
 * Must not change auth outcomes — used only to pick staff vs public Redis combo buckets.
 * On DB errors returns `null` (fail-safe → public bucket).
 */
export async function loadStaffRoleHintForLoginIdentifier(
  enteredEmailLower: string,
  authMode: "email" | "username",
): Promise<UserRole | null> {
  if (!enteredEmailLower) return null;
  try {
    if (authMode === "email") {
      const dedup = normalizeEmailForDedup(enteredEmailLower);
      const row = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: enteredEmailLower, mode: "insensitive" } },
            { normalizedEmail: dedup },
          ],
        },
        select: { role: true },
      });
      return row?.role ?? null;
    }
    const row = await prisma.user.findFirst({
      where: { username: { equals: enteredEmailLower, mode: "insensitive" } },
      select: { role: true },
    });
    return row?.role ?? null;
  } catch {
    return null;
  }
}
