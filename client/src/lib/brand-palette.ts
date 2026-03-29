export const NURSENEST_PALETTE = {
  primary: "#BFA6F6",
  secondary: "#AEE3E1",
  accent: "#FFD6A5",
  highlight: "#FFF3B0",
  text: "#2E3A59",
  border: "#E5E7EB",
  white: "#FFFFFF",
  lightGray: "#F9FAFB",
} as const;

export const INFOGRAPHIC_PROMPT_BASE = `Professional nursing education infographic for NurseNest.ca. Clean clinical medical education style with white background and subtle pastel gradient. Soft pastel medical aesthetic with rounded corners, minimalist design, and soft shadows.

COLOR PALETTE (strict):
- Primary headers: #BFA6F6 pastel lavender
- Clinical info blocks: #AEE3E1 soft teal
- Warnings and peak values: #FFD6A5 peach
- Key highlights: #FFF3B0 light yellow
- All text: #2E3A59 deep slate
- Table borders and dividers: #E5E7EB soft grey

STYLE RULES:
- Rounded cell edges with soft drop shadows
- Alternating subtle pastel row tints
- Clean sans-serif typography (DM Sans style)
- Small watermark "NurseNest.ca" bottom right in light grey
- No emoji, no cartoon style, no neon colors
- Professional nursing exam prep study guide quality
- Suitable for PDF study guides and exam prep materials`;

export const INFOGRAPHIC_NEGATIVE_PROMPT =
  "blurry, low quality, pixelated, distorted text, messy layout, cluttered, dark background, neon colors, cartoon style, hand-drawn, watermark over content, emoji";
