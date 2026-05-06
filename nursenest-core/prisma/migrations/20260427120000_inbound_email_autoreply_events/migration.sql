-- Idempotency + audit for Postmark inbound → AI autoreply webhook.
CREATE TYPE "InboundEmailAutoreplyStatus" AS ENUM ('PENDING', 'SKIPPED', 'REPLIED', 'FAILED');

CREATE TABLE "inbound_email_autoreply_events" (
    "id" TEXT NOT NULL,
    "postmark_inbound_message_id" VARCHAR(200) NOT NULL,
    "sender_email" VARCHAR(320) NOT NULL,
    "subject" VARCHAR(998) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reply_sent_at" TIMESTAMP(3),
    "status" "InboundEmailAutoreplyStatus" NOT NULL DEFAULT 'PENDING',
    "failure_reason" TEXT,
    "postmark_outbound_message_id" VARCHAR(200),

    CONSTRAINT "inbound_email_autoreply_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "inbound_email_autoreply_events_postmark_inbound_message_id_key" ON "inbound_email_autoreply_events"("postmark_inbound_message_id");

CREATE INDEX "inbound_email_autoreply_events_status_received_at_idx" ON "inbound_email_autoreply_events"("status", "received_at");
