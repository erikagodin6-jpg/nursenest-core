# Mobile accessibility audit — `apps/mobile`

**Date:** 2026-05-06  
**Method:** Static pass over edited surfaces + RN a11y props (not a full automated audit).

## Dynamic Type (`allowFontScaling`)

- **Improved:** Home tab body copy, onboarding flows, login, flashcards/practice stubs, account, lessons hub (existing + reinforced), lesson detail (already strong).
- **Gap:** Some `TextInput` placeholder scaling follows system; custom `Text` inside rare components may still omit `allowFontScaling` — recommend a future sweep with ESLint custom rule or design-system `AppText` wrapper.

## Labels & roles

| Location | Change |
|----------|--------|
| Login | `accessibilityLabel` on inputs, checkbox, submit; `accessibilityRole` where applicable |
| Lessons hub | Row `accessibilityLabel` (`Lesson, {title}`); topic chips labeled as filters |
| Lesson detail | Related lessons, back, retry labeled |
| Pathway pickers | Pathway rows labeled; onboarding "Continue/Next" actions labeled |
| `(app)` stack | Header "Sign out" `accessibilityLabel` + min touch height |
| Home | "Change pathway" button labeled |

## Hit targets (≥ 44pt)

- Topic chips, retry actions, primary/secondary buttons on account, onboarding CTAs, pathway rows use `HIT_TARGET_MIN` (44) or explicit `minHeight` where noted.
- Tab bar: default platform heights; `tabBarHideOnKeyboard` reduces overlap while typing.

## Contrast & color

- Removed hardcoded `#1d4ed8` / grays on onboarding and login in favor of `semanticBrand`, `semanticBorderSoft`, `semanticSurfaceElevated`, `semanticText*`, `semanticWarning` / `semanticDanger`.
- **Account primary button:** Uses `semanticOnBrand` on `semanticBrand` background (both themes).

## Screen reader / focus

- No custom focus traps added; modals use system `Alert` on login failure (acceptable).
- **Gap:** No `accessibilityHint` on complex lesson hub filters (optional enhancement).

## Motion

- Reanimated plugin enabled for correctness; no new motion that would require "Reduce motion" overrides. **Gap:** Consider `AccessibilityInfo.isReduceMotionEnabled` for future animations.

## Tablet & landscape

- Horizontal padding scales with `useLearnerHorizontalPadding()` for readable line length (max content width 720 logical px).

## Outstanding recommendations

1. Run **VoiceOver** (iOS) and **TalkBack** (Android) on a device build.  
2. Add **contrast verification** screenshots in light/dark for WCAG AA on warning/error text on tinted surfaces.  
3. Consider central **`AppText`** component defaulting `allowFontScaling` + max font multiplier if design requires caps.
