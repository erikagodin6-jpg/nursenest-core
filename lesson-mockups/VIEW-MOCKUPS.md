# How to view lesson mockups

PNG folders were hidden because the repo `.gitignore` had a global `exports/` rule.

**Use this folder (visible in the repo):**

```
lesson-mockups/design-png/
├── lesson-detail-v2/     ← reading workspace PNGs
├── lesson-pre-post/      ← pre/post test PNGs
└── index.html            ← open in browser to see all images
```

**Or open the HTML designs directly (no PNG needed):**

- `lesson-mockups/rn-lesson-detail-reading-v2-design.html`
- `lesson-mockups/rn-lesson-pre-post-assessment-design.html`

Regenerate PNGs:

```bash
cd nursenest-core
npx playwright test tests/e2e/preview/lesson-detail-reading-v2.capture.spec.ts --project=chromium
npx playwright test tests/e2e/preview/lesson-pre-post-assessment.capture.spec.ts --project=chromium
```
