# NurseNest UI Redesign Preview

Phase 1 visual exploration only. These screenshots are generated from the local UI Canvas in `docs/ui-canvas/` and are not production route screenshots. No production layouts, app routes, business logic, entitlement behavior, lesson data architecture, SEO metadata, i18n loaders, or logo assets were changed.

## Preview Set

| Surface | Screenshot |
| --- | --- |
| Homepage | `homepage-ocean-desktop.png` |
| Pricing page | `pricing-page-blossom-desktop.png` |
| FAQ page | `faq-page-garden-desktop.png` |
| RN hub | `rn-hub-ocean-desktop.png` |
| RPN hub | `rpn-hub-garden-desktop.png` |
| NP hub | `np-hub-blossom-desktop.png` |
| Desktop lesson page | `lesson-page-desktop-ocean-desktop.png` |
| Mobile lesson page | `lesson-page-mobile-dark-mobile.png` |
| Learner dashboard | `learner-dashboard-garden-desktop.png` |
| Flashcards hub | `flashcards-hub-ocean-desktop.png` |
| Flashcard session | `flashcard-session-dark-desktop.png` |
| Practice test builder | `practice-test-builder-ocean-desktop.png` |
| Practice test runner | `practice-test-runner-garden-desktop.png` |
| CAT exam interface | `cat-exam-interface-dark-desktop.png` |
| Blog index | `blog-index-ocean-desktop.png` |
| Blog detail | `blog-detail-garden-desktop.png` |

## Theme Coverage

The canvas supports Blossom, Ocean, Garden, and Dark mode. The screenshot set uses those themes across representative surfaces so the same structural system can be reviewed under different visual atmospheres.

## Design Patterns Represented

- Existing-logo-safe header/logo placement placeholder
- Premium dashboard surfaces and card elevation
- Sticky lesson study rail on desktop
- Mobile sticky progress and bottom navigation preview
- Lesson progress and study phase stepper
- Semantic section cards for pathophysiology, labs, symptoms, red flags, interventions, medications, clinical pearls, and exam focus
- Bottom Quick Clinical Summary preview
- Dashboard readiness, weak-area, and mastery card patterns
- Exam answer-card and rationale-panel patterns
- Blog sticky TOC and clinical callout patterns

## Generation Command

Run from `nursenest-core/`:

```bash
node docs/ui-canvas/capture-premium-ui-canvas.mjs
```

The command writes this review set to `reports/ui-redesign-preview/`.

## Approval Gate

Production implementation should not begin until these previews are reviewed. The proposed implementation order remains:

1. Lesson surfaces
2. Learner dashboard
3. Study tools: flashcards, practice exams, CAT
4. Marketing pages: pricing, homepage, hubs, blog

