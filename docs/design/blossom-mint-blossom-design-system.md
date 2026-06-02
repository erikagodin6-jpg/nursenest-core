# Blossom + Mint Blossom design system

**Figma file:** https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU/ (NurseNest ecosystem — nav/theme swatches nodes `54:2`–`54:4`)

**Production tokens:** `nursenest-core/src/app/theme-palettes.css`, `semantic-status-tokens.css`, `color-roles.css`, `styles/marketing/blossom-mint-polish.css`

## Themes

| Theme id | Label | Character |
|----------|-------|-----------|
| `blossom` | Blossom | Pink-forward airy pastel; sky + butter accents |
| `mint-blossom` | Mint Blossom | Signature mint + pink + sky + warm yellow; mint-forward shell |

## Color tokens (semantic)

### Blossom

| Token | Value |
|-------|-------|
| background / page | `#FFFDFB` |
| surface | `#FFFFFF` |
| surface-strong | `#FFF9FB` |
| primary | `#FFA9CC` |
| secondary | `#FFF9FB` |
| accent (mint CTA alt) | `#D9F8E7` |
| text-primary | `#3A3142` |
| text-secondary | `#4A4453` |
| muted | `#554D5E` |
| border | `color-mix(#FFB7D5 22%, #FFF9FB)` |
| success | `#B7EFD1` |
| info / sky | `#BFE7FF` / `#D6F0FF` |
| warning / butter | `#FFF6CC` / `#FFF2B8` |

### Mint Blossom

| Token | Value |
|-------|-------|
| background / page | `#FAFDFC` |
| surface | `#FFFFFF` |
| surface-strong | `#FFFEFE` |
| primary | `#FFB7D5` |
| secondary | `#D9F8E7` |
| accent sky | `#D6F0FF` |
| text-primary | `#3A3142` |
| text-secondary | `#4A4453` |
| border | `color-mix(#B7EFD1 24%, #FFF9FB)` |

### Page wash gradient (both)

```css
linear-gradient(
  135deg,
  #FFF9FB 0%,
  #E8FFF3 45%,
  #D6F0FF 100%
);
```

## Spacing (airy)

| Scale | rem |
|-------|-----|
| card padding | 1.25–1.75 |
| section block | 2.75–4.5 |
| stack gap | 1–1.5 |
| blog prose max | 42rem |

## Typography

| Role | Weight | Line-height |
|------|--------|-------------|
| body | 400 | 1.65 |
| UI / questions | 500 | 1.35–1.65 |
| section headings | 600 max | 1.08–1.22 |
| hero | 600–700 | 1.0–1.08 |

## Cards

- 1px pastel border (`#FFB7D5` or `#B7EFD1` at 12–14% mix)
- Soft dual shadow: pink/mint + sky, no grey slabs
- Background: 94% white mix on semantic surface

## Buttons

- **Primary:** blossom pink fill, plum ink `#3A3142`, soft lift on hover
- **Secondary (Mint Blossom):** `#D9F8E7` fill, mint border

## Figma implementation checklist

- [ ] Variable collection `NurseNest / Atmosphere` with modes `Blossom`, `Mint Blossom`
- [ ] Primitives: pink, mint, sky, butter, neutrals (table above)
- [ ] Semantic aliases: background, surface, card, elevated-card, primary, secondary, text-*, border, shadow
- [ ] Text styles: Marketing/Body 400, Marketing/H2 500–600
- [ ] Effect styles: Card/Rest, Card/Hover (pastel only)
- [ ] Component samples: Card, Button primary/secondary, FAQ accordion row
