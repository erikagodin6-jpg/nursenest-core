# NurseNest Premium UI Canvas

Mockup-only visual exploration for the premium NurseNest platform UI system. This folder does not modify production routes, app components, entitlement behavior, SEO, or branding assets.

## Source

- `nursenest-premium-ui-canvas.html` — self-contained Figma-style UI Canvas with 26 major surfaces, desktop/tablet/mobile modes, and Blossom/Ocean/Garden/Dark tokenized themes.

## Screenshot Capture

Run from `nursenest-core/`:

```bash
node docs/ui-canvas/capture-premium-ui-canvas.mjs
```

Generated previews are written to:

```text
docs/ui-canvas/screenshots/
```

## Brand Safety

The canvas includes a simple placeholder mark only to reserve logo space. It is not a logo proposal. Production implementation must keep the existing NurseNest leaf logo untouched.

## Implementation Intent

Use this canvas as design direction for later safe implementation slices:

1. Lesson design system foundation
2. Learner dashboard
3. Practice Tests
4. Flashcards
5. CAT exam
6. Pricing
7. Homepage
8. Blog index/detail
9. Admin dashboard
