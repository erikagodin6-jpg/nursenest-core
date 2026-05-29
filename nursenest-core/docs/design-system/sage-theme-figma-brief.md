# Sage Theme Figma Brief

Status: implementation-aligned design brief. Live Figma frame creation requires the external Figma workspace; no Figma connector is available in this coding environment.

## Theme Intent

Sage is the professional clinical NurseNest theme for learners who prefer a mature, calm, gender-neutral interface. It should feel like premium healthcare technology and clinical leadership education: focused, trustworthy, modern, and restrained.

Sage must not feel military, neon, gaming-oriented, corporate banking, or monochromatic.

## Core Tokens

| Role | Token | Value |
| --- | --- | --- |
| Primary | `--theme-primary` | `#5F8F79` |
| Secondary | `--theme-secondary` | `#7FA79A` |
| Accent | `--theme-accent` | `#3D6B5B` |
| Success | `--semantic-success` | `#4E9B72` |
| Warning | `--semantic-warning` | `#C99745` |
| Info | `--semantic-info` | `#6C8DA8` |
| Background | `--theme-page-bg` | `#F7F8F6` |
| Surface | `--theme-card-bg` | `#FFFFFF` |
| Border | `--theme-border` | `#D7DDD9` |
| Text | `--theme-heading-text` / `--theme-body-text` | `#22302B` |
| Muted Text | `--theme-muted-text` | `#64716C` |

Hero accent tokens:

| Token | Value |
| --- | --- |
| `--hero-accent-start` | `#5F8F79` |
| `--hero-accent-middle` | `#7FA79A` |
| `--hero-accent-end` | `#3D6B5B` |
| `--hero-accent-solid-fallback` | `#3D6B5B` |

## Required Frames

Create desktop and mobile frames for each surface:

| Surface | Desktop | Mobile |
| --- | --- | --- |
| Homepage | 1440 x 1200 | 390 x 1200 |
| Pricing | 1440 x 1400 | 390 x 1600 |
| Lesson | 1440 x 1100 | 390 x 1200 |
| Question | 1440 x 1100 | 390 x 1200 |
| Flashcard | 1440 x 1100 | 390 x 1200 |
| Analytics | 1440 x 1100 | 390 x 1200 |
| Profile | 1440 x 1100 | 390 x 1200 |

Each frame must show the existing NurseNest layout with only theme-token changes. Do not change IA, spacing, CTA placement, learner shell structure, or core component hierarchy.

## Visual Guidance

- Use white cards on `#F7F8F6` with subtle green-gray borders.
- Use soft eucalyptus gradients only for large decorative bands or quiet backgrounds.
- Keep controls crisp: no glow, bloom, neon, or heavy blur.
- Use evergreen for high-value accents, selected states, and fallback hero accent color.
- Organic NurseNest leaf motifs may appear as low-opacity background accents only.

## Accessibility Targets

Minimum contrast targets:

| Pair | Expected |
| --- | --- |
| `#22302B` on `#F7F8F6` | WCAG AA |
| `#22302B` on `#FFFFFF` | WCAG AA |
| `#64716C` on `#FFFFFF` | WCAG AA |
| `#061E1A` on `#5F8F79` | WCAG AA |
| `#FFFFFF` on `#3D6B5B` | WCAG AA |
| `#22302B` on `#7FA79A` | WCAG AA |

## QA Checklist

- Sage appears in public marketing theme selection.
- Sage appears in learner theme selection.
- Homepage, pricing, lessons, questions, flashcards, CAT, LOFT, clinical skills, pharmacology, ECG, analytics, and profile inherit Sage through shared tokens.
- Mobile frames have no clipping, hidden controls, or low-contrast text.
- Accent words use dedicated hero accent tokens and keep crisp rendering.
- The interface reads professional, clinical, calming, premium, and modern without becoming bland.
