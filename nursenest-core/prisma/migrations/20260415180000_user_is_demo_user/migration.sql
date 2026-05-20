-- Demo QA accounts: admin-only creation, no real billing (see isDemoUser guards in checkout/trial).
ALTER TABLE "User" ADD COLUMN "is_demo_user" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "User_is_demo_user_idx" ON "User"("is_demo_user");
