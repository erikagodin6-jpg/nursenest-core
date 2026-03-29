CREATE TABLE IF NOT EXISTS "platform_alerts" (
  "id" text PRIMARY KEY,
  "severity" text NOT NULL,
  "category" text NOT NULL,
  "title" text NOT NULL,
  "message" text NOT NULL,
  "source" text,
  "acknowledged" boolean DEFAULT false,
  "data" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platform_health_checks" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "service" text NOT NULL,
  "status" text NOT NULL,
  "latency_ms" integer DEFAULT 0,
  "details" text,
  "checked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platform_emergency_log" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "action" text NOT NULL,
  "reason" text,
  "actor" text,
  "auto_triggered" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "actor_role" text;
  ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "action_category" text;
  ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "target_type" text;
  ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "target_id" varchar;
  ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "reason" text;
  ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "confirmation_required" boolean DEFAULT false;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "admin_role" text;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_action_category" ON "audit_logs" ("action_category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_actor_id" ON "audit_logs" ("actor_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_created_at" ON "audit_logs" ("created_at");
