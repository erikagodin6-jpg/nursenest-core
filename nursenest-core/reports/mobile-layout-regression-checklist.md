# Mobile layout regression checklist

Run before shipping learner chrome, marketing header, lesson body, exam runners, or global `globals.css` layout tokens.

## Preconditions

- [ ] Playwright `npm run test:e2e:mobile` or real devices at 320–430px.  
- [ ] Optional: paid credentials for authenticated mobile projects.

## Width & scroll

- [ ] No **horizontal** scroll on marketing home, pricing, signup, RN hub, blog index.  
- [ ] No horizontal scroll on `/app`, lesson detail, flashcards hub, questions, practice-tests (incl. `?cat=1`), labs index, ECG video quiz, account billing.  
- [ ] Long lesson tables/code scroll **inside** the card.

## Navigation

- [ ] Hamburger opens/closes; focus returns sensibly.  
- [ ] Drawers do not trap page scroll behind.  
- [ ] Learner bottom nav does not cover last main content.

## Touch & CTAs

- [ ] Header actions meet ~40px minimum touch side.  
- [ ] Pricing / study CTAs do not overlap.  
- [ ] MCQ options and rationales usable at 320px.

## Exams & timers

- [ ] Practice/CAT hubs: timing copy visible; fixed chrome does not permanently obscure controls.

## Performance (perceived)

- [ ] No large layout jump when theme/i18n hydrates on header.

## Accessibility

- [ ] Muted nav text readable in light and dark themes.
