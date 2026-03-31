import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "LEARNER" | "ADMIN";
      country: "CA" | "US";
      tier: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";
      /** Mirrors last login; server routes still use resolveEntitlement — never trust alone for gating. */
      subscriptionStatus?: "active" | "grace" | "none";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string | null;
    name?: string | null;
    role?: "LEARNER" | "ADMIN";
    country?: "CA" | "US";
    tier?: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";
    subscriptionStatus?: "active" | "grace" | "none";
  }
}
