-- Admin-editable marketing copy overrides (allowlisted keys; public read merged at render time).

CREATE TABLE "marketing_public_content_overrides" (
    "id" TEXT NOT NULL,
    "message_key" VARCHAR(320) NOT NULL,
    "locale" VARCHAR(32) NOT NULL DEFAULT 'en',
    "surface" VARCHAR(64) NOT NULL,
    "value" TEXT NOT NULL,
    "previous_value" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "updated_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_public_content_overrides_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "marketing_public_content_overrides_message_key_locale_key"
ON "marketing_public_content_overrides"("message_key", "locale");

CREATE INDEX "marketing_public_content_overrides_surface_locale_idx"
ON "marketing_public_content_overrides"("surface", "locale");

CREATE INDEX "marketing_public_content_overrides_updated_at_idx"
ON "marketing_public_content_overrides"("updated_at" DESC);

ALTER TABLE "marketing_public_content_overrides"
ADD CONSTRAINT "marketing_public_content_overrides_updated_by_user_id_fkey"
FOREIGN KEY ("updated_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "marketing_public_content_override_revisions" (
    "id" TEXT NOT NULL,
    "message_key" VARCHAR(320) NOT NULL,
    "locale" VARCHAR(32) NOT NULL,
    "value" TEXT NOT NULL,
    "action" VARCHAR(24) NOT NULL DEFAULT 'upsert',
    "actor_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_public_content_override_revisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "marketing_public_content_override_revisions_message_key_locale_created_at_idx"
ON "marketing_public_content_override_revisions"("message_key", "locale", "created_at" DESC);

ALTER TABLE "marketing_public_content_override_revisions"
ADD CONSTRAINT "marketing_public_content_override_revisions_actor_user_id_fkey"
FOREIGN KEY ("actor_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
