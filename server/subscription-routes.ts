import type { Express } from "express";
import { resolveAuthUser, requireAdmin, signUserToken, hashPassword } from "./admin-auth";
import { storage, pool } from "./storage";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import rateLimit from "express-rate-limit";

export interface SimpleEntitlements {
  isPremium: boolean;
  canAccessQuestions: boolean;
  canAccessFullBank: boolean;
  canAccessLessons: boolean;
  canAccessFlashcards: boolean;
  canAccessAnalytics: boolean;
  allowedRoles: string[];
  allowedExamTypes: string[];
}

export function computeSimpleEntitlements(user: any, subscription: any): SimpleEntitlements {
  const hasActiveSub = !!(subscription && subscription.status === "active" &&
    (!subscription.expiresAt || new Date(subscription.expiresAt) > new Date()));

  const userTierRaw = user?.tier || "free";
  const paidTiers = ["rpn", "rn", "np", "admin", "full_access"];
  const isTierPremium = paidTiers.includes(userTierRaw);
  const isTester = !!(user?.tester_access || user?.testerAccess) &&
    (!user?.tester_expiry && !user?.testerExpiry ||
     new Date(user?.tester_expiry || user?.testerExpiry) > new Date());
  const isLifetime = !!(user?.is_lifetime || user?.isLifetime);

  const isPremium = isTierPremium || hasActiveSub || isTester || isLifetime;

  const subTier = hasActiveSub && subscription.planId
    ? subscription.planId.replace("admin-grant-", "").replace("stripe-", "").split("-")[0]
    : null;
  const effectiveTier = subTier || userTierRaw;

  const allowedRolesSet = new Set<string>();
  if (isPremium || effectiveTier === "admin") {
    if (effectiveTier === "admin" || effectiveTier === "full_access") {
      allowedRolesSet.add("RPN").add("RN").add("NP").add("Allied").add("NewGrad");
    } else if (effectiveTier === "np") {
      allowedRolesSet.add("RPN").add("RN").add("NP");
    } else if (effectiveTier === "rn") {
      allowedRolesSet.add("RPN").add("RN");
    } else if (effectiveTier === "rpn") {
      allowedRolesSet.add("RPN");
    }
  }
  const allowedRoles: string[] = Array.from(allowedRolesSet);

  const allowedExamTypes: string[] = [];
  const country = user?.country || user?.region || "CA";
  if (isPremium) {
    if (country === "CA") {
      allowedExamTypes.push("NCLEX-RN", "CPNRE", "REX-PN");
    } else {
      allowedExamTypes.push("NCLEX-RN", "NCLEX-PN");
    }
  }

  const result: SimpleEntitlements = {
    isPremium: isPremium,
    canAccessQuestions: isPremium,
    canAccessFullBank: isPremium,
    canAccessLessons: isPremium || effectiveTier !== "free",
    canAccessFlashcards: isPremium,
    canAccessAnalytics: isPremium,
    allowedRoles: allowedRoles,
    allowedExamTypes: allowedExamTypes,
  };

  return result;
}

function sanitizeUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email || null,
    firstName: user.first_name || user.firstName || null,
    role: user.role || null,
    country: user.country || null,
    exam: user.exam || null,
    onboardingCompleted: user.onboarding_completed ?? user.onboardingCompleted ?? false,
    tier: user.tier || "free",
    region: user.region || "US",
    subscriptionStatus: user.subscription_status || user.subscriptionStatus || "inactive",
    testerAccess: user.tester_access ?? user.testerAccess ?? false,
    testerExpiry: user.tester_expiry || user.testerExpiry || null,
    preferredTheme: user.preferred_theme || user.preferredTheme || null,
    isLifetime: user.is_lifetime ?? user.isLifetime ?? false,
  };
}

const TOKEN_EXPIRY_SECONDS = 1800;

export function registerSubscriptionRoutes(app: Express): void {
  const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { error: "Too many signup attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: true, trustProxy: true },
  });

  app.post("/api/auth/signup", signupLimiter, async (req, res) => {
    try {
      const parsed = insertUserSchema.parse(req.body);
      const { inviteCode, referralCode: refCode, firstName, role: userRole, country, exam } = req.body;

      if (parsed.email && typeof parsed.email === "string" && parsed.email.includes("@")) {
        parsed.email = parsed.email.trim().toLowerCase();
      }

      const existing = await storage.getUserByUsername(parsed.username);
      if (existing) return res.status(400).json({ error: "Username already taken" });
      parsed.password = await hashPassword(parsed.password);

      const insertPayload = { ...parsed, tier: "free", region: "US" } as InsertUser & {
        tier: string;
        region: string;
      };
      if ((insertPayload as any).adminRole) delete (insertPayload as any).adminRole;
      if ((insertPayload as any).subscriptionStatus) delete (insertPayload as any).subscriptionStatus;
      if ((insertPayload as any).testerAccess) delete (insertPayload as any).testerAccess;
      if ((insertPayload as any).isLifetime) delete (insertPayload as any).isLifetime;

      const user = await storage.createUser(insertPayload as InsertUser);

      if (firstName || userRole || country || exam) {
        const updates: string[] = [];
        const params: any[] = [];
        let idx = 1;
        if (firstName) { updates.push(`first_name = $${idx++}`); params.push(firstName); }
        if (userRole) { updates.push(`role = $${idx++}`); params.push(userRole); }
        if (country) { updates.push(`country = $${idx++}`); params.push(country); }
        if (exam) { updates.push(`exam = $${idx++}`); params.push(exam); }
        if (updates.length > 0) {
          params.push(user.id);
          await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = $${idx}`, params);
        }
      }

      if (inviteCode && typeof inviteCode === "string" && inviteCode.trim()) {
        try {
          const normalizedCode = inviteCode.trim().toUpperCase();
          const code = await storage.getTesterInviteCode(normalizedCode);
          if (code && code.isActive && code.usedCount < code.maxUses && (!code.expiresAt || new Date(code.expiresAt) > new Date())) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            await storage.setTesterAccess(user.id, true, expiryDate, normalizedCode);
            await storage.incrementTesterInviteCodeUsage(normalizedCode, user.id);
            if (code.tier && code.tier !== "free") {
              await storage.updateUserTier(user.id, code.tier);
            }
            try { await storage.generateReferralCode(user.id); } catch (e: any) {
              console.warn("[Signup] Failed to generate referral code:", e?.message);
            }
          }
        } catch (e: any) {
          console.warn("[Signup] Invite code processing error:", e?.message);
        }
      }

      if (refCode && typeof refCode === "string" && refCode.trim()) {
        try {
          const normalizedRef = refCode.trim().toUpperCase();
          if (normalizedRef.startsWith("NN-REF-")) {
            const referrer = await storage.getUserByReferralCode(normalizedRef);
            if (referrer) {
              await storage.setReferredBy(user.id, normalizedRef);
              await storage.incrementReferralUses(normalizedRef);
            }
          }
        } catch (e: any) {
          console.warn("[Signup] Referral code processing error:", e?.message);
        }
      }

      const freshUser = await storage.getUser(user.id);
      const subscription = await storage.getUserSubscription(user.id);
      const entitlements = computeSimpleEntitlements(freshUser || user, subscription);

      const ut = signUserToken(user.id, user.username);

      res.json({
        user: sanitizeUser(freshUser || user),
        subscription: subscription || null,
        entitlements,
        userToken: ut.userToken,
        userTokenExpiry: ut.expiresInSeconds,
      });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/logout", async (_req, res) => {
    res.json({ success: true, message: "Logged out successfully" });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      let subscription: any = null;
      try {
        subscription = await storage.getUserSubscription(user.id);
      } catch (subErr: any) {
        console.error("[auth/me] subscription lookup failed (non-fatal):", subErr?.message);
      }

      let entitlements: SimpleEntitlements | null = null;
      try {
        entitlements = computeSimpleEntitlements(user, subscription);
      } catch {}

      const { buildAuthUserResponse } = await import("./auth-response");
      const userResponse = await buildAuthUserResponse(user);
      res.json({
        ...userResponse,
        subscription: subscription || null,
        entitlements: entitlements || userResponse.entitlements || null,
      });
    } catch (e: any) {
      console.error("[auth/me] Fatal error:", e?.message);
      try {
        const user = await resolveAuthUser(req as any);
        if (user) {
          const { buildAuthUserResponse } = await import("./auth-response");
          const userResponse = await buildAuthUserResponse(user);
          return res.json(userResponse);
        }
      } catch {}
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });

  app.get("/api/me/subscription", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const subscription = await storage.getUserSubscription(user.id);
      res.json({
        subscription: subscription || null,
      });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  app.get("/api/me/entitlements", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const subscription = await storage.getUserSubscription(user.id);
      const entitlements = computeSimpleEntitlements(user, subscription);
      res.json({
        entitlements,
      });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch entitlements" });
    }
  });

  app.post("/api/admin/grant-test-premium", async (req, res) => {
    try {
      const adminUser = await requireAdmin(req, res);
      if (!adminUser) return;

      const { userId, tier, durationDays } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const targetTier = tier || "rn";
      const days = durationDays || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      await storage.updateUserTier(userId, targetTier);
      await storage.updateUserStripeInfo(userId, { subscriptionStatus: "active" });

      const subscription = await storage.upsertUserSubscription(userId, {
        planId: `admin-grant-${targetTier}`,
        planName: `Admin Granted ${targetTier.toUpperCase()}`,
        billingInterval: "monthly",
        status: "active",
        activeFrom: new Date(),
        expiresAt,
        purchaseSource: "admin",
        lastVerifiedAt: new Date(),
      });

      console.log(`[Admin] Granted test premium to user ${userId}: tier=${targetTier}, expires=${expiresAt.toISOString()}, by admin ${adminUser.id}`);

      res.json({
        success: true,
        subscription,
        message: `Granted ${targetTier} premium for ${days} days`,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
