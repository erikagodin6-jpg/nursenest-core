import type { StaffTier } from "@/lib/auth/staff-roles";

/** Resolved staff identity after DB role check (admin API guard). */
export type AdminSession = {
  userId: string;
  role: string;
  tier: StaffTier;
};
