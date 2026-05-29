# Alpine Theme Figma Brief

Status: implementation-aligned design brief. Live Figma frame creation requires the external Figma workspace; no Figma connector is available in this coding environment.

## Theme Intent

Alpine is the clean technical NurseNest theme for learners who prefer a modern, polished, gender-neutral interface. It should feel intelligent, confident, crisp, and premium, with the restraint of Apple, Linear, Notion, and modern outdoor technical brands.

Alpine must not feel like dark mode, gaming, crypto, or a simple recolor of Ocean.

## Core Tokens

| Role | Token | Value |
| --- | --- | --- |
| Primary | `--theme-primary` | `#2F5E87` |
| Secondary | `--theme-secondary` | `#5F86A8` |
| Accent | `--theme-accent` | `#9CC3E8` |
| Success | `--semantic-success` | `#4FA772` |
| Warning | `--semantic-warning` | `#D19A44` |
| Info | `--semantic-info` | `#5F86A8` |
| Background | `--theme-page-bg` | `#F7F9FB` |
| Surface | `--theme-card-bg` | `#FFFFFF` |
| Border | `--theme-border` | `#D8E1EA` |
| Text | `--theme-heading-text` / `--theme-body-text` | `#1F2933` |
| Muted Text | `--theme-muted-text` | `#61707E` |

Hero accent tokens:

| Token | Value |
| --- | --- |
| `--hero-accent-start` | `#2F5E87` |
| `--hero-accent-middle` | `#5F86A8` |
| `--hero-accent-end` | `#9CC3E8` |
| `--hero-accent-solid-fallback` | `#2F5E87` |

## Required Frames

Create desktop and mobile frames for each surface:

| Surface | Desktop | Mobile |
| --- | --- | --- |
| Homepage | 1440 x 1200 | 390 x 1200 |
| Pricing | 1440 x 1400 | 390 x 1600 |
| Flashcards | 1440 x 1100 | 390 x 1200 |
| Questions | 1440 x 1100 | 390 x 1200 |
| Lessons | 1440 x 1100 | 390 x 1200 |
| Analytics | 1440 x 1100 | 390 x 1200 |
| Clinical Skills | 1440 x 1100 | 390 x 1200 |

Each frame must use the existing NurseNest layout and components. Change only theme-token expression, atmosphere, and decorative restraint.

## Visual Guidance

- Use white surfaces on a cool `#F7F9FB` canvas with steel-blue borders.
- Use Deep Alpine Blue for primary hierarchy, active states, and premium emphasis.
- Use Ice Blue as a crisp accent, not as a dominant full-page wash.
- Keep gradients subtle and directional; avoid rainbow, neon, or saturated effects.
- Low-opacity leaves, geometric overlays, and atmospheric accents may appear behind content only when they do not compete with learning material.

## Accessibility Targets

Minimum contrast targets:

| Pair | Expected |
| --- | --- |
| `#1F2933` on `#F7F9FB` | WCAG AA |
| `#1F2933` on `#FFFFFF` | WCAG AA |
| `#61707E` on `#FFFFFF` | WCAG AA |
| `#FFFFFF` on `#2F5E87` | WCAG AA |
| `#1F2933` on `#5F86A8` | WCAG AA |
| `#1F2933` on `#9CC3E8` | WCAG AA |

## QA Checklist

- Alpine appears in public marketing theme selection.
- Alpine appears in learner theme selection.
- Homepage, pricing, lessons, questions, flashcards, CAT, LOFT, clinical skills, pharmacology, ECG, analytics, profile, and admin inherit Alpine through shared tokens.
- Mobile frames have no clipping, hidden controls, or low-contrast text.
- Hero accent words use dedicated Alpine hero tokens.
- The interface reads modern, sophisticated, professional, clean, and premium, while remaining clearly different from Ocean.
