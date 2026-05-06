-- Premium flag for clinical simulations (first-class column; referencesJson may still mark legacy rows).
ALTER TABLE "clinical_nursing_scenarios"
ADD COLUMN IF NOT EXISTS "is_premium" BOOLEAN NOT NULL DEFAULT false;
