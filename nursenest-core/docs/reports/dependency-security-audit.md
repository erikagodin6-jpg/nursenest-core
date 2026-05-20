# Dependency Security Audit

Generated: 2026-05-10

## Summary

This pass used `npm audit --omit=dev`, `npm outdated`, and targeted package graph checks from `nursenest-core/`. The primary deploy-blocking advisory called out in the plan was the Inngest SDK vulnerability in `3.22.0 - 3.53.1`.

## Packages Upgraded

| Package | Previous | Updated | Reason | Risk |
| --- | ---: | ---: | --- | --- |
| `inngest` | `3.35.0` | `3.54.2` | Fixes GHSA-2jf5-6wwv-vhxx, where unhandled HTTP methods in `serve()` could expose environment variables. | Medium: same major, but SDK serve behavior is security-sensitive and should be covered by API/build checks. |
| `next` | `16.2.1` | `16.2.6` | Conservative patch update for the current Next 16 line, responding to the Server Components DoS advisory surfaced by audit. | Medium: framework patch on App Router runtime, requires build and smoke validation. |
| `express-rate-limit` | `^8.2.1` resolved `8.4.1` | `^8.5.1` resolved `8.5.1` | Pulls in a version that avoids the vulnerable `ip-address <=10.1.0` advisory path. | Low: focused minor update for request throttling helper. |

## Direct Production Dependency Review

- `@auth/core` / `next-auth`: no direct upgrade applied. Current `next-auth` v5 beta and the pinned `@auth/core` override are intentional compatibility constraints; latest registry metadata reports a lower stable major line for `next-auth`.
- `stripe`, `resend`, `twilio`: no audit-driven production vulnerability required a conservative upgrade in this pass. Latest majors exist and should be evaluated separately because they may change API behavior.
- `@sentry/nextjs`: no audit-driven upgrade required. Latest patch/minor can be evaluated after the Next patch is validated.
- `openai`: no audit-driven upgrade required. Patch/minor is available but not necessary for the identified deploy risk.
- `prisma` / `@prisma/client`: no patch applied. Current installed client generated successfully at `6.19.3`; Prisma 7 is a major upgrade and outside this hardening pass.

## Remaining Known Risks

`npm audit --omit=dev` still reports unresolved items that require separate migration decisions:

- `@google-cloud/storage` transitive path through `teeny-request`, `http-proxy-agent`, and `@tootallnate/once`. Audit suggests a force fix that downgrades `@google-cloud/storage` to `5.18.3`, which is breaking and not suitable for this pass.
- Expo/mobile transitive advisories through `@xmldom/xmldom`, `@expo/*`, `tar`, `cacache`, and nested `postcss`. Audit suggests breaking Expo changes; this should be handled as a mobile dependency upgrade track.
- `drizzle-orm <0.45.2` SQL identifier advisory. Audit marks the fix as breaking from the current `0.39.3`; defer to a focused Drizzle compatibility pass.
- `fast-uri` and `fast-xml-builder` advisories remain in the tree through transitive dependencies. `npm audit fix` should be tested separately because it may change multiple indirect packages.
- `xlsx` has high-severity advisories with no fix available. Replace or isolate SheetJS usage in a dedicated content import/export hardening task.
- `next` still appears in audit due to the nested `postcss` advisory classification even after moving to `16.2.6`. This needs follow-up with Next advisory metadata and lockfile resolution once the upstream audit range is corrected or a newer safe patch is available.

## Verification Evidence

- `npm ls inngest next express-rate-limit` resolved `inngest@3.54.2`, `next@16.2.6`, and `express-rate-limit@8.5.1`.
- `npm install` completed and regenerated Prisma Client successfully.
- `npm audit --omit=dev` was re-run after the update; remaining findings are documented above.
- `npm outdated` was re-run to capture the current dependency drift baseline.

## Rollback

Rollback is limited to `package.json` and `package-lock.json`: restore `inngest` to `3.35.0`, `next` to `16.2.1`, and `express-rate-limit` to the prior range if validation reveals runtime incompatibility. Because the Inngest version fixes a high-severity advisory, rollback should be treated as temporary and paired with a compensating deployment block or route-level mitigation.
