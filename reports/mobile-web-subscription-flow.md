# Mobile ↔ web subscription flow

**Purchases: website only.** Mobile uses the same Auth.js **cookie jar** against the web origin.

## Flow

1. **Sign-in:** \`postCredentialsSignIn\` → store \`Set-Cookie\` in SecureStore (\`apps/mobile/lib/auth-context.tsx\`).
2. **Session:** \`fetchAuthSession(origin, jar)\` — same session endpoint as web.
3. **APIs:** \`Cookie\` header on \`/api/learner/personal-profile\`, \`/api/learner/command-center\`, etc. (\`packages/nursenest-mobile-shared/src/api-paths.ts\`).
4. **Entitlements:** \`requireSubscriberSession\` / \`getUserAccess\` / \`resolveEntitlement*\` on server — mobile consumes JSON + HTTP codes only.

## Helpers

- \`resolveSubscriberUiState\` — profile JSON + query flags (no client entitlement math).
- \`subscriberHeadlineFromSubscriberApi403\` — maps \`code\` from subscriber APIs to neutral copy.
