# Pre-nursing UI redesign preview

## Mockups (`preview-screenshots/prenursing/`)

| PNG | Intent |
|-----|--------|
| mockup-pre-nursing-hub-desktop.png | Hub hero + CTAs + topic grid |
| mockup-pre-nursing-lesson-library.png | Lesson library cards |
| mockup-pre-nursing-anatomy-module.png | Anatomy module split layout |
| mockup-pre-nursing-quiz-desktop-mobile.png | Quiz + mobile |
| mockup-pre-nursing-teas-hesi-tracks.png | Future TEAS/HESI tracks |
| mockup-pre-nursing-mobile-hub.png | Mobile hub |

## Code map (Phase 3)

- Hub: `src/app/(marketing)/(default)/pre-nursing/page.tsx`
- Lessons: `pre-nursing/lessons/page.tsx`
- Modules: `src/content/pre-nursing/modules/*.tsx`
- Quiz: `pre-nursing-quiz-runner.tsx`, `pre-nursing/practice/[slug]/page.tsx`

## References

Homepage premium direction: `src/app/(marketing)/(default)/page.tsx` + marketing home components.
