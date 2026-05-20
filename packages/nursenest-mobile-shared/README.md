# @nursenest/mobile-shared

Metro-safe TypeScript shared by **`apps/mobile`**: API boundary types, pathway allowlist (RN / PN-RPN / NP V1), NextAuth cookie helpers, learner API path builders, offline key taxonomy (Phase 2), and tests.

**Source-of-truth contracts** for naming/semantics: `nursenest-core/src/lib/mobile-native/`.

## Install / typecheck / tests

```bash
npm install --prefix packages/nursenest-mobile-shared --no-fund --no-audit
npm --prefix packages/nursenest-mobile-shared run typecheck
npm --prefix packages/nursenest-mobile-shared run test
```
