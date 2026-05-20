-- Durable learner cognition envelope (Educational Cognition OS persistence pass).
-- Apply on production when deploying schema.prisma `User.learnerCognitionEnvelope`.

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "learner_cognition_envelope" JSONB;
