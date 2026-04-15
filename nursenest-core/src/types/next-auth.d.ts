import "next-auth";

/** Mirrors Prisma `UserRole` string values exposed on the JWT/session. */
export type SessionUserRole =
  | "LEARNER"
  | "ADMIN"
  | "SUPER_ADMIN"
  | "CONTENT_ADMIN"
  | "SUPPORT_ADMIN";

declare module "next-auth" {
  interface User {
    /** Set at credentials sign-in — drives JWT `exp` (brief vs remember session). */
    rememberMe?: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: SessionUserRole;
      country: "CA" | "US";
      tier: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED" | "PRE_NURSING" | "NEW_GRAD";
      /** For ALLIED tier users: their specific profession key (e.g. "paramedic", "mlt"). */
      alliedProfessionKey?: string | null;
      /** Mirrors last login; server routes still use resolveEntitlement — never trust alone for gating. */
      subscriptionStatus?: "active" | "grace" | "past_due_grace" | "past_due" | "none";
      /** Incremented server-side on password change; used to rotate trust across devices on next sign-in. */
      credentialVersion?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string | null;
    name?: string | null;
    role?: SessionUserRole;
    country?: "CA" | "US";
    tier?: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED" | "PRE_NURSING" | "NEW_GRAD";
    /** For ALLIED tier users: their specific profession key. */
    alliedProfessionKey?: string | null;
    subscriptionStatus?: "active" | "grace" | "past_due_grace" | "past_due" | "none";
    credentialVersion?: number;
  }
}
