import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  getEcgModuleReadiness,
  summarizeEcgModuleGates,
} from "@/lib/ecg-module/ecg-module-readiness";
import {
  isEcgModuleEnabled,
  isEcgModuleMarketingInventoryEnabled,
} from "@/lib/ecg-module/ecg-module-config";
import {
  advancedEcgStripePriceEnvKey,
  isAdvancedEcgModuleEnabled,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";
import { getPediatricCurriculumReadinessGates } from "@/lib/ecg-module/ecg-pediatric-governance";
import { PEDIATRIC_SEED_QUESTION_COUNT, PEDIATRIC_SEED_QUESTION_COUNTS_BY_CATEGORY } from "@/lib/ecg-module/ecg-pediatric-questions-seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EnvCheckResult = {
  coreModuleEnabled: boolean;
  coreMarketingEnabled: boolean;
  advancedModuleEnabled: boolean;
  /** Key = STRIPE_PRICE_ADVANCED_ECG (single price covers all billing durations) */
  stripeAdvancedEcgConfigured: boolean;
  blockers: string[];
};

function checkEnvVars(): EnvCheckResult {
  const coreModuleEnabled = isEcgModuleEnabled();
  const coreMarketingEnabled = isEcgModuleMarketingInventoryEnabled();
  const advancedModuleEnabled = isAdvancedEcgModuleEnabled();

  // Single price key — advancedEcgStripePriceEnvKey() always returns "STRIPE_PRICE_ADVANCED_ECG"
  const stripeKey = advancedEcgStripePriceEnvKey();
  const stripeAdvancedEcgConfigured = Boolean(process.env[stripeKey]?.trim());

  const blockers: string[] = [];
  if (!coreModuleEnabled) blockers.push("ENABLE_ECG_MODULE is not set to true");
  if (!coreMarketingEnabled) blockers.push("NEXT_PUBLIC_ENABLE_ECG_MODULE is not set to true");
  if (!stripeAdvancedEcgConfigured) blockers.push(`${stripeKey} is not configured`);

  return { coreModuleEnabled, coreMarketingEnabled, advancedModuleEnabled, stripeAdvancedEcgConfigured, blockers };
}

/**
 * GET /api/admin/modules/ecg/readiness
 *
 * Returns full ECG module readiness: env vars, content gates, and canPublish flag.
 * Call before triggering POST /api/admin/modules/ecg/publish.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const [readiness, env] = await Promise.all([
    getEcgModuleReadiness(),
    Promise.resolve(checkEnvVars()),
  ]);

  const gateFailures = summarizeEcgModuleGates(readiness);
  const allBlockers = [...env.blockers, ...gateFailures];

  // Pediatric lane readiness gates (pure — no DB calls)
  const pediatricGates = getPediatricCurriculumReadinessGates();
  const pediatricGateFailures = pediatricGates.filter((g) => !g.passed).map((g) => g.reason);

  return NextResponse.json({
    ok: allBlockers.length === 0,
    canPublish: readiness.canPublish && env.coreModuleEnabled && env.stripeAdvancedEcgConfigured,
    env,
    readiness: {
      status: readiness.status,
      canPublish: readiness.canPublish,
      counts: readiness.counts,
      percentages: readiness.percentages,
      gates: readiness.gates,
      gateFailures,
    },
    pediatric: {
      canPublish: pediatricGateFailures.length === 0,
      gates: pediatricGates,
      gateFailures: pediatricGateFailures,
      seedQuestionCount: PEDIATRIC_SEED_QUESTION_COUNT,
      seedCountsByCategory: PEDIATRIC_SEED_QUESTION_COUNTS_BY_CATEGORY,
    },
    blockers: allBlockers,
  });
}
