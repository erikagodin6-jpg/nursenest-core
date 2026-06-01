# Component Size Audit

Generated: 2026-06-01

## Scope

Audited React/TypeScript component files under `src/components` for:

- file size greater than 50 KB
- file size greater than 75 KB
- 10 or more `useEffect` references

The remediation focused on low-risk component boundary cleanup only: no UI redesign, no learner behavior changes, no scoring changes, no entitlement changes, and no route changes.

## Findings Before Remediation

| Component                                                  |      Size | useEffect refs | Finding                            |
| ---------------------------------------------------------- | --------: | -------------: | ---------------------------------- |
| `src/components/student/practice-test-runner-client.tsx`   | 199,405 B |             25 | Over 75 KB and over hook threshold |
| `src/components/admin/admin-blog-control-panel-client.tsx` | 126,651 B |              3 | Over 75 KB                         |
| `src/components/student/question-bank-practice-client.tsx` |  95,527 B |             17 | Over 75 KB and over hook threshold |
| `src/components/layout/site-header.tsx`                    |  86,709 B |             11 | Over 75 KB and over hook threshold |
| `src/components/marketing/pricing-page-client.tsx`         |  79,536 B |              9 | Over 75 KB                         |
| `src/components/flashcards/flashcards-hub-client.tsx`      |  61,854 B |              7 | Over 50 KB                         |
| `src/components/marketing/allied-health-homepage.tsx`      |  56,094 B |              0 | Over 50 KB                         |
| `src/components/ui-preview/homepage-premium-preview.tsx`   |  54,424 B |              0 | Over 50 KB                         |
| `src/components/marketing/marketing-hero-carousel.tsx`     |  28,233 B |             11 | Over hook threshold                |

## Refactor Applied

The five shared component files above 75 KB were converted into thin compatibility entrypoints and their heavy implementations were moved into feature modules.

| Previous shared component                                  | New shared entrypoint size | Feature module                                                 |
| ---------------------------------------------------------- | -------------------------: | -------------------------------------------------------------- |
| `src/components/student/practice-test-runner-client.tsx`   |                      114 B | `src/features/practice-tests/practice-test-runner-client.tsx`  |
| `src/components/admin/admin-blog-control-panel-client.tsx` |                      117 B | `src/features/admin-blog/admin-blog-control-panel-client.tsx`  |
| `src/components/student/question-bank-practice-client.tsx` |                      117 B | `src/features/question-bank/question-bank-practice-client.tsx` |
| `src/components/layout/site-header.tsx`                    |                       76 B | `src/features/layout/site-header.tsx`                          |
| `src/components/marketing/pricing-page-client.tsx`         |                       92 B | `src/features/pricing/pricing-page-client.tsx`                 |

This preserves all existing import paths and public exports while removing large route-specific implementations from the shared component layer.

## Findings After Remediation

No `src/components` file remains above 75 KB.

Files still above 50 KB:

| Component                                                |     Size | useEffect refs | Recommendation                                                                        |
| -------------------------------------------------------- | -------: | -------------: | ------------------------------------------------------------------------------------- |
| `src/components/flashcards/flashcards-hub-client.tsx`    | 61,854 B |              7 | Keep for now; below 75 KB. Split launcher panels later if flashcard hub work resumes. |
| `src/components/marketing/allied-health-homepage.tsx`    | 56,094 B |              0 | Keep for now; below 75 KB and static marketing surface.                               |
| `src/components/ui-preview/homepage-premium-preview.tsx` | 54,424 B |              0 | Keep for now; preview-only surface and below 75 KB.                                   |

Files still at or above 10 `useEffect` references:

| File                                                           | useEffect refs | Notes                                                                                                                 |
| -------------------------------------------------------------- | -------------: | --------------------------------------------------------------------------------------------------------------------- |
| `src/features/practice-tests/practice-test-runner-client.tsx`  |             25 | Feature module still needs deeper hook extraction, but behavior-preserving extraction is larger than this audit pass. |
| `src/features/question-bank/question-bank-practice-client.tsx` |             17 | Feature module still needs runner hook extraction.                                                                    |
| `src/features/layout/site-header.tsx`                          |             11 | Feature module still needs account/menu hook extraction.                                                              |
| `src/components/marketing/marketing-hero-carousel.tsx`         |             11 | Below size threshold; hook count should be addressed in a future carousel-specific cleanup.                           |

## Current Feature Modules Above 75 KB

These are no longer shared component entrypoints, but they remain large feature implementations:

| Feature module                                                 |      Size | useEffect refs | Next safe split                                                                                   |
| -------------------------------------------------------------- | --------: | -------------: | ------------------------------------------------------------------------------------------------- |
| `src/features/practice-tests/practice-test-runner-client.tsx`  | 199,405 B |             25 | Extract session hydration, CAT transition, keyboard shortcuts, and answer persistence into hooks. |
| `src/features/admin-blog/admin-blog-control-panel-client.tsx`  | 126,651 B |              3 | Extract generation forms and table panels into admin-blog submodules.                             |
| `src/features/question-bank/question-bank-practice-client.tsx` |  95,527 B |             17 | Extract question hydration, keyboard handling, and rationale panels.                              |
| `src/features/layout/site-header.tsx`                          |  86,709 B |             11 | Extract account menu, mobile drawer wiring, and nudge handling.                                   |
| `src/features/pricing/pricing-page-client.tsx`                 |  79,536 B |              9 | Extract checkout orchestration and pricing plan selection hook.                                   |

## Verification

- `find src/components ... >= 75000`: no matching component files.
- `npx eslint` on changed wrappers and moved feature modules: passed with 0 errors.
- `npm run typecheck:critical`: passed.

Known lint warnings remain in moved feature modules. They were pre-existing in the oversized implementations and were not changed in this pass.
