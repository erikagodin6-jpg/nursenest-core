# Blossom Auth Premium — Figma program (FINAL)

**Date:** 2026-05-21  
**Program:** `docs/planning/auth-blossom-figma-program.md`  
**Figma:** https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU/ — page `Blossom Auth Premium`

## Delivered

- Eight program screens on canvas (`auth/*` names)
- PNG imports for desktop/mobile baselines (01–08) + error reference (09)
- Figma-built: verify-email pending, magic-link sent/invalid/expired
- Variables: `NN / Blossom Auth`
- Grid layout with row labels

See `VIEW-BLOSSOM-AUTH.md` for node IDs.

## Implementation order

sign-in → sign-up → forgot → verify → reset → session-expired → magic-link → oauth

Code: `nursenest-core/src/components/auth/auth-experience/auth-experience-shell.tsx`

## Deferred

Ocean/Midnight themes, extra mobile frames, Figma vs app screenshots.
