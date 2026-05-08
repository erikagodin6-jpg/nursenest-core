# Pre-Nursing modules, lessons, quizzes, and publication audit

**Branch:** `audit/prenursing-theme-figma`  
**Date:** 2026-05-08  

## Summary

- **28** modules in `src/content/pre-nursing/pre-nursing-registry.ts`; all have TSX in `pre-nursing-module-map.tsx`.
- **10** modules have static marketing practice exams (`BANK_MODULE_SLUGS` in `pre-nursing-question-bank.ts`); `/pre-nursing/practice/[slug]` returns **404** for other slugs (intentional).
- **Routes:** `/pre-nursing`, `/pre-nursing/lessons`, `/pre-nursing/lessons/[slug]`, `/pre-nursing/mini-cat`, `/pre-nursing/study-plan`, plus practice for bank slugs only. Legacy `/pre-nursing/[slug]` → 301 to lessons detail.
- **TEAS/HESI:** No dedicated routes; future IA — see mockups in `preview-screenshots/prenursing/`.
- **Wiring:** `pre-nursing-module-engagement.tsx` only links practice for bank slugs; `pre-nursing-exam-engine.ts` next-steps match. **QA:** `/flashcards/{slug}` from mini-CAT vs `resolvePublicFlashcardLanding`.
- **Reference:** `reports/full-site-forgotten-pages-theme-audit.md` not available in this clone.

## Tests

`npx playwright test tests/e2e/smoke/pathway-prenursing-allied-access.spec.ts -g "Pre-nursing — canonical" --project=chromium` → skipped (matrix). `--list` includes pre-nursing row.
