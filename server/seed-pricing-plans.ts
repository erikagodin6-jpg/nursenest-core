import { pool } from "./storage";
import {
  pricingConfig,
  durationLabels,
  type TierKey,
  type DurationKey,
} from "../shared/pricing-config";

const TIERS: TierKey[] = ["rpn", "rn", "np", "allied"];
const DURATIONS: DurationKey[] = ["monthly", "3-month", "6-month", "yearly"];

export async function seedPricingPlans(): Promise<void> {
  for (const tier of TIERS) {
    let order = 0;
    for (const duration of DURATIONS) {
      order++;
      const cad = pricingConfig[tier].cad[duration];
      const usd = pricingConfig[tier].usd[duration];
      const isPopular = duration === "6-month";
      const label = durationLabels[duration];

      const existing = await pool.query(
        "SELECT id FROM pricing_plans WHERE tier = $1 AND duration = $2 AND is_lifetime = false LIMIT 1",
        [tier, duration]
      );

      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE pricing_plans
           SET price_cad = $1, price_usd = $2, is_enabled = true,
               is_popular = $3, display_order = $4, label = $5, updated_at = NOW()
           WHERE id = $6`,
          [cad, usd, isPopular, order, label, existing.rows[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO pricing_plans (tier, duration, label, price_cad, price_usd, is_enabled, is_popular, display_order, is_lifetime, is_founding_price)
           VALUES ($1, $2, $3, $4, $5, true, $6, $7, false, false)`,
          [tier, duration, label, cad, usd, isPopular, order]
        );
      }
    }
  }

  console.log(`Seeded/verified ${TIERS.length * DURATIONS.length} pricing plan rows`);
}
