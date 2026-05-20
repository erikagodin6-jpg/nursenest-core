const TIER_LABELS: Record<string, string> = {
  free: "Free",
  rpn: "RPN/LVN",
  rn: "RN/NCLEX",
  np: "NP Advanced",
  newgrad: "New Grad Success Toolkit",
  new_grad_toolkit: "New Grad Toolkit",
  certification_prep: "Certification Prep",
  full_access: "Full Access",
  admin: "Admin",
};

const NEWGRAD_TIER_HIERARCHY: Record<string, number> = {
  new_grad_toolkit: 1,
  certification_prep: 2,
  full_access: 3,
};

const NEWGRAD_TIERS = new Set(["newgrad", "new_grad_toolkit", "certification_prep", "full_access"]);

function normalizeNewGradTier(tier: string): string {
  return tier === "newgrad" ? "new_grad_toolkit" : tier;
}

export function canAccessTier(userTier: string | null | undefined, targetTier: string, testerAccess?: boolean, testerExpiry?: string | null): boolean {
  if (!targetTier || targetTier === "free") return true;
  if (!userTier || userTier === "free") {
    if (testerAccess && (!testerExpiry || new Date(testerExpiry) > new Date())) return true;
    return false;
  }
  if (userTier === "admin") return true;

  if (NEWGRAD_TIERS.has(targetTier)) {
    const normalizedUser = normalizeNewGradTier(userTier);
    const normalizedTarget = normalizeNewGradTier(targetTier);
    const userLevel = NEWGRAD_TIER_HIERARCHY[normalizedUser] ?? 0;
    const targetLevel = NEWGRAD_TIER_HIERARCHY[normalizedTarget] ?? 0;
    return userLevel >= targetLevel;
  }

  return userTier === targetTier;
}

export function getTierLabel(tier: string): string {
  return TIER_LABELS[tier] || tier;
}

export function getAccessibleTiers(userTier: string | null | undefined, testerAccess?: boolean, testerExpiry?: string | null): string[] {
  if (testerAccess && (!testerExpiry || new Date(testerExpiry) > new Date())) return ["free", "rpn", "rn", "np", "newgrad", "new_grad_toolkit", "certification_prep", "full_access"];
  if (!userTier || userTier === "free") return ["free"];
  if (userTier === "admin") return ["free", "rpn", "rn", "np", "newgrad", "new_grad_toolkit", "certification_prep", "full_access", "admin"];
  if (userTier === "full_access") return ["free", "newgrad", "new_grad_toolkit", "certification_prep", "full_access"];
  if (userTier === "certification_prep") return ["free", "newgrad", "new_grad_toolkit", "certification_prep"];
  if (userTier === "new_grad_toolkit") return ["free", "newgrad", "new_grad_toolkit"];
  return ["free", userTier];
}

export function getUserTierOnly(userTier: string | null | undefined): string | null {
  if (!userTier || userTier === "free") return null;
  if (userTier === "admin") return null;
  return userTier;
}

export function getAllowedLessonTiers(userTier: string | null | undefined): string[] {
  if (!userTier || userTier === "free") return ["free", "general"];
  if (userTier === "admin") return ["free", "general", "rpn", "rn", "np", "newgrad", "new_grad_toolkit", "certification_prep", "full_access"];
  if (userTier === "full_access") return ["free", "general", "newgrad", "new_grad_toolkit", "certification_prep", "full_access"];
  if (userTier === "certification_prep") return ["free", "general", "newgrad", "new_grad_toolkit", "certification_prep"];
  if (userTier === "new_grad_toolkit") return ["free", "general", "newgrad", "new_grad_toolkit"];
  return ["free", "general", userTier];
}

export function getTierPricingPath(tier: string | null | undefined): string {
  if (!tier || tier === "free") return "/pricing";
  const tierPaths: Record<string, string> = {
    rpn: "/pricing?tier=rpn",
    rn: "/pricing?tier=rn",
    np: "/pricing?tier=np",
    allied: "/pricing?tier=allied",
    newgrad: "/subscribe/newgrad",
    new_grad_toolkit: "/subscribe/newgrad",
    certification_prep: "/subscribe/newgrad?plan=certification_prep",
    full_access: "/subscribe/newgrad?plan=full_access",
  };
  return tierPaths[tier] || "/pricing";
}

export function filterContentByTier<T extends { tier?: string }>(
  items: T[],
  userTier: string | null | undefined,
  testerAccess?: boolean,
  testerExpiry?: string | null
): T[] {
  const allowed = new Set(
    testerAccess && (!testerExpiry || new Date(testerExpiry) > new Date())
      ? ["free", "general", "rpn", "rn", "np", "newgrad", "new_grad_toolkit", "certification_prep", "full_access"]
      : getAllowedLessonTiers(userTier)
  );
  return items.filter(item => {
    const t = item.tier || "free";
    return allowed.has(t);
  });
}
