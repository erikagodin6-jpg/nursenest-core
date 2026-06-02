# Flashcard session — visual QA (premium redesign)

## Preview route (no auth; noindex)

Use the live shell preview to exercise **the same** `ActiveStudySession` + `FlashcardStudyQuestionStack` as production, with `?theme=` driving `document.documentElement` for full `html[data-theme]` semantic overrides:

- Ocean: `http://localhost:3000/preview/flashcard-session-live?theme=ocean`
- Blossom: `http://localhost:3000/preview/flashcard-session-live?theme=blossom`
- Midnight: `http://localhost:3000/preview/flashcard-session-live?theme=midnight`
- Forest: `http://localhost:3000/preview/flashcard-session-live?theme=forest`

## Local dev

From `nursenest-core/` (this app root):

```bash
NN_SKIP_DEV_AUTH_SECRET=1 npm run dev:next
```

## What to confirm (2026-05)

- **No clipping** in the main hero card, rail, or header; **no** giant empty answer column (single-column hero + rail on large screens).
- **No hot pink** on Blossom: chips and accents should stay **soft rose / lilac** via semantic chart hues + Blossom palette—not neon magenta body text.
- **Contrast**: stem text remains `--semantic-text-primary`; muted copy uses `--semantic-text-secondary` / `--semantic-text-muted`.
- **Responsive**: stack layout collapses with rail **below** the card below `lg`; check tablet (~768px) and mobile (~390px).

## Optional screenshots (Playwright CLI)

With dev running:

```bash
npx playwright screenshot "http://localhost:3000/preview/flashcard-session-live?theme=ocean" ocean-desktop.png --viewport-size=1280,900
npx playwright screenshot "http://localhost:3000/preview/flashcard-session-live?theme=ocean" ocean-mobile.png --viewport-size=390,844
```

Repeat with `blossom`, `midnight`, and `forest`. Save artifacts next to this README or attach to the PR.
