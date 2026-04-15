-- Entitlement hot path: `getUserAccess` queries subscriptions by `userId` ordered by `createdAt` DESC
-- (see `src/lib/entitlements/get-user-access.ts`). Backward-compatible index-only change.
CREATE INDEX "Subscription_userId_createdAt_idx" ON "Subscription"("userId", "createdAt" DESC);
