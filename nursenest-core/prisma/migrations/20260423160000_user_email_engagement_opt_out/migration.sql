-- Learner engagement / retention email opt-out (security and verification email unaffected).
ALTER TABLE "User" ADD COLUMN "email_engagement_opt_out" BOOLEAN NOT NULL DEFAULT false;
