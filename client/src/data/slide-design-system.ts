/**
 * NurseNest Slide Design System
 * A reusable design language for micro-lecture slides
 * Matches the NurseNest brand: clean, modern, pastel, cute-but-professional nursing education
 */

// ============================================================
// 1. COLOR PALETTE
// ============================================================

export const slideColors = {
  standard: {
    primary:          "#9d82dd",  // NurseNest lavender (brand anchor)
    primaryLight:     "#c4b0e8",  // Lighter lavender for hover/active states
    primaryDark:      "#7a5fc7",  // Deeper lavender for emphasis text
    secondary:        "#f3efff",  // Lavender wash for card backgrounds
    accent:           "#f4909f",  // Soft blush pink for callouts, alerts, clinical pearls
    accentLight:      "#fdeef0",  // Blush tint for accent card backgrounds
    background:       "#fdfcfa",  // Warm white (matches site warmwhite)
    surface:          "#ffffff",  // Pure white card surfaces
    surfaceElevated:  "#f8f6ff",  // Slightly tinted surface for nested cards
    border:           "#e9e2ff",  // Lavender border
    borderSubtle:     "#f0ecff",  // Even softer border for internal dividers
    textPrimary:      "#2d2640",  // Dark purple-gray for headings
    textBody:         "#4a4458",  // Medium purple-gray for body text
    textMuted:        "#8b82a0",  // Muted lavender-gray for captions, labels
    textOnPrimary:    "#ffffff",  // White text on primary backgrounds
    success:          "#5ed3ae",  // Mint green (matches mint theme) for correct/safe
    warning:          "#f5a623",  // Warm amber for caution indicators
    danger:           "#e55b6e",  // Soft coral-red for critical findings
    info:             "#6bb8e8",  // Calm sky blue for neutral informational boxes
  },

  highContrast: {
    primary:          "#6b4fb5",  // Deeper lavender, still pastel family
    primaryLight:     "#9d82dd",  // Standard lavender becomes the light
    primaryDark:      "#4a3590",  // Strong purple for maximum readability
    secondary:        "#ede5ff",  // Slightly more saturated wash
    accent:           "#d4616f",  // Deeper blush, still soft, higher contrast ratio
    accentLight:      "#fce4e8",  // Pink tint background
    background:       "#faf8ff",  // Very light lavender-white
    surface:          "#ffffff",
    surfaceElevated:  "#f3efff",
    border:           "#c4b0e8",  // More visible border
    borderSubtle:     "#d4c7f7",
    textPrimary:      "#1a1528",  // Near-black with purple undertone
    textBody:         "#2d2640",  // Dark purple-gray (promoted from heading)
    textMuted:        "#5c5470",  // Darker muted, still readable
    textOnPrimary:    "#ffffff",
    success:          "#2a9d7c",  // Darker mint
    warning:          "#c47f15",  // Deeper amber
    danger:           "#c43a4c",  // Stronger coral
    info:             "#3a8bc2",  // Deeper sky blue
  },
};

// Semantic color roles for slide elements
export const slideSemanticColors = {
  slideNumber:        slideColors.standard.textMuted,
  progressBar:        slideColors.standard.primary,
  progressTrack:      slideColors.standard.borderSubtle,
  bulletIcon:         slideColors.standard.primary,
  highlightBox:       slideColors.standard.secondary,
  clinicalPearl:      slideColors.standard.accentLight,
  clinicalPearlIcon:  slideColors.standard.accent,
  warningBox:         "#fef9e7",
  warningBorder:      slideColors.standard.warning,
  dangerBox:          "#fef2f2",
  dangerBorder:       slideColors.standard.danger,
  successBox:         "#ecfdf5",
  successBorder:      slideColors.standard.success,
  infoBox:            "#eff8ff",
  infoBorder:         slideColors.standard.info,
  codeBlock:          "#f8f6ff",
  codeBorder:         slideColors.standard.border,
};


// ============================================================
// 2. TYPOGRAPHY
// ============================================================

/**
 * Font Pairing
 * Heading: Nunito (rounded, friendly, professional, sans-serif)
 * Body: DM Sans (clean, geometric, highly readable, matches NurseNest site)
 *
 * Google Fonts import:
 * https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap
 */

export const slideTypography = {
  fontFamily: {
    heading: "'Nunito', 'DM Sans', system-ui, sans-serif",
    body:    "'DM Sans', system-ui, sans-serif",
  },

  // Font sizes in px (designed for 1280x720 slide canvas)
  fontSize: {
    slideTitle:      "42px",   // Main title slide heading
    sectionTitle:    "34px",   // Section/concept heading within content slides
    subtitle:        "22px",   // Subtitle under titles, learning objective headers
    bodyLarge:       "20px",   // Primary body text, bullet points
    body:            "18px",   // Standard body text
    bodySmall:       "16px",   // Secondary info, table cell text
    caption:         "14px",   // Footnotes, citations, slide numbers
    label:           "12px",   // Tiny labels, tags, badges
  },

  fontWeight: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },

  lineHeight: {
    tight:   1.2,   // Headings
    normal:  1.5,   // Body text
    relaxed: 1.7,   // Long-form voiceover scripts
  },

  letterSpacing: {
    tight:   "-0.01em",  // Large headings
    normal:  "0em",
    wide:    "0.02em",   // Uppercase labels
    wider:   "0.05em",   // All-caps tags
  },
};


// ============================================================
// 3. LAYOUT AND SPACING RULES
// ============================================================

export const slideLayout = {
  // Canvas dimensions (standard 16:9)
  canvas: {
    width: 1280,
    height: 720,
  },

  // Slide margins (inner padding from canvas edge)
  margin: {
    top:    "48px",
    bottom: "48px",
    left:   "64px",
    right:  "64px",
  },

  // Spacing scale (based on 8px grid)
  spacing: {
    xs:  "4px",
    sm:  "8px",
    md:  "16px",
    lg:  "24px",
    xl:  "32px",
    xxl: "48px",
  },

  // Card styles
  card: {
    borderRadius:  "16px",       // Generously rounded
    padding:       "24px",
    shadow:        "0 2px 12px rgba(157, 130, 221, 0.08)",  // Soft lavender shadow
    shadowHover:   "0 4px 20px rgba(157, 130, 221, 0.14)",
    borderWidth:   "1px",
    borderColor:   slideColors.standard.border,
  },

  // Nested cards (cards inside cards)
  cardNested: {
    borderRadius: "12px",
    padding:      "16px",
    shadow:       "0 1px 6px rgba(157, 130, 221, 0.06)",
    borderColor:  slideColors.standard.borderSubtle,
  },

  // Content rules
  content: {
    maxBulletLength:     80,     // Characters per bullet point (keep concise)
    maxBulletsPerSlide:  6,      // No more than 6 bullets on one slide
    maxColumnsPerRow:    3,      // Grid columns for comparison layouts
    iconSize:            "24px", // Standard icon size
    iconSizeLarge:       "32px", // Featured/header icons
    iconSizeSmall:       "18px", // Inline icons
  },

  // Grid system
  grid: {
    columns: 12,
    gutter:  "24px",     // Space between grid columns
    half:    "calc(50% - 12px)",  // Two-column split
    third:   "calc(33.33% - 16px)",  // Three-column split
  },
};


// ============================================================
// 4. VISUAL LANGUAGE
// ============================================================

export const slideVisualLanguage = {
  iconStyle: {
    type:          "simple line icons",
    strokeWidth:   1.75,
    cornerRadius:  "rounded",
    library:       "Lucide React (consistent with NurseNest site)",
    colorDefault:  slideColors.standard.primary,
    colorOnDark:   slideColors.standard.textOnPrimary,
  },

  illustrationStyle: {
    type:       "flat pastel medical illustrations",
    palette:    "Use slide color palette; avoid photorealism",
    outline:    "Thin 1.5px strokes in textMuted color",
    fill:       "Pastel fills from secondary/accent palette",
    shapes:     "Rounded, organic shapes. No sharp corners on illustrations.",
  },

  doList: [
    "Use generous whitespace between elements",
    "Keep bullet text short and scannable (under 80 characters)",
    "Use consistent icon sizing across all slides",
    "Apply soft shadows to cards for gentle depth",
    "Use the lavender primary as the visual anchor on every slide",
    "Separate clinical pearls with the blush accent color",
    "Use numbered steps for sequential processes",
    "Include a subtle progress bar at the bottom of each slide",
    "Maintain a visual hierarchy: title > subtitle > body > caption",
    "Use color coding consistently (success=safe, danger=critical, warning=caution)",
    "Round all corners generously (12-16px for cards, 8px for buttons/badges)",
  ],

  doNotList: [
    "Avoid clutter: never exceed 6 bullet points per slide",
    "Avoid heavy gradients or glossy effects",
    "Avoid harsh neon or saturated colors",
    "Avoid stock photography; use flat illustrations or diagrams",
    "Avoid walls of text; break content across multiple slides",
    "Avoid decorative fonts or script typefaces",
    "Avoid drop shadows darker than rgba(0,0,0,0.12)",
    "Avoid placing text over busy backgrounds",
    "Avoid more than 3 colors per slide (excluding text colors)",
    "Avoid centered body text; left-align for readability",
    "Avoid using red for non-critical information",
  ],
};


// ============================================================
// 5. SLIDE TEMPLATES
// ============================================================

export interface SlideTemplate {
  name: string;
  description: string;
  layout: string;
  zones: string[];
  designNotes: string[];
}

export const slideTemplates: SlideTemplate[] = [
  {
    name: "Title Slide",
    description: "Opening slide for each lecture. Sets the topic and tone.",
    layout: "centered-stack",
    zones: [
      "Top: Small NurseNest logo or icon, left-aligned",
      "Center: Large lecture title (slideTitle size, extrabold, textPrimary)",
      "Below title: Subtitle with tier badge and duration (subtitle size, textMuted)",
      "Bottom-left: Category tag in a rounded pill badge (primary bg, white text)",
      "Bottom-right: Slide count indicator (caption size, textMuted)",
    ],
    designNotes: [
      "Background: warm white (#fdfcfa) with a subtle lavender gradient arc in the top-right corner",
      "A single decorative medical icon (e.g., heart, stethoscope) in primaryLight at 20% opacity, positioned bottom-right",
      "Title text has tight letter-spacing for visual weight",
      "Pill badge uses borderRadius 9999px (fully rounded)",
    ],
  },
  {
    name: "Learning Objectives",
    description: "Lists 3-5 measurable objectives for the lecture.",
    layout: "header-plus-list",
    zones: [
      "Top: Section title 'Learning Objectives' with GraduationCap icon (sectionTitle size)",
      "Body: Numbered list of objectives inside a single rounded card",
      "Each objective: Numbered circle (primary bg) + objective text (bodyLarge)",
      "Bottom: Thin progress bar spanning slide width",
    ],
    designNotes: [
      "Card background is secondary (#f3efff)",
      "Number circles are 28px diameter, primary color, white text, bold",
      "Each objective separated by a borderSubtle divider line",
      "Keep objectives to 3-5 items; each under 80 characters",
      "Left margin inside card aligns number circles consistently",
    ],
  },
  {
    name: "Concept Diagram",
    description: "Visual explanation of a mechanism, pathway, or relationship.",
    layout: "split-or-full",
    zones: [
      "Top: Concept title (sectionTitle size)",
      "Main area: Diagram space (centered, takes 60-70% of slide height)",
      "Diagram elements: Rounded boxes connected by soft arrows",
      "Bottom or side: 1-2 sentence caption explaining the key takeaway",
    ],
    designNotes: [
      "Diagram boxes use card styling (16px radius, lavender border, white fill)",
      "Arrows are 2px solid in primaryLight, with rounded endpoints",
      "Use the color scale semantically: normal process = primary, pathological = danger, intervention = success",
      "Keep diagram to 4-7 nodes maximum",
      "If using a two-column split, diagram left (60%) and explanation right (40%)",
      "Add small relevant icons inside diagram nodes (iconSizeSmall)",
    ],
  },
  {
    name: "Comparison Table",
    description: "Side-by-side comparison of two or three related concepts.",
    layout: "header-plus-columns",
    zones: [
      "Top: Comparison title (sectionTitle size)",
      "Body: 2-3 equal-width columns, each in its own rounded card",
      "Column header: Colored top strip (each column gets a distinct pastel)",
      "Column body: 3-5 short bullet points per column",
      "Bottom: Optional 'Key Difference' callout in accent card",
    ],
    designNotes: [
      "Column 1 header: primary (#9d82dd), Column 2: accent (#f4909f), Column 3: success (#5ed3ae)",
      "Header strips use borderRadius only on top (16px 16px 0 0)",
      "Column cards have equal height (use flexbox stretch)",
      "Bullets use small dot indicators in the column's header color",
      "Key Difference callout uses accentLight background with accent left-border (3px)",
      "Maximum 3 columns; 2 is preferred for clarity",
    ],
  },
  {
    name: "Clinical Reasoning Flow",
    description: "Step-by-step clinical thinking process or decision pathway.",
    layout: "vertical-flow",
    zones: [
      "Top: Flow title (sectionTitle size) with a Lightbulb or Brain icon",
      "Body: 3-5 vertical steps connected by dotted lines",
      "Each step: Numbered circle + step card with title and 1-line description",
      "Right margin: Optional 'Nurse Action' annotation on relevant steps",
    ],
    designNotes: [
      "Step cards are nested card style (12px radius, smaller padding)",
      "Connecting line is 2px dashed in borderSubtle color, centered vertically",
      "Step numbers in primary-colored circles (same style as Learning Objectives)",
      "Nurse Action annotations use a small rounded badge in success color",
      "The flow reads top-to-bottom, never left-to-right (for slide readability)",
      "Highlight the critical decision step with a subtle primary border glow",
    ],
  },
  {
    name: "Summary and Clinical Pearls",
    description: "Closing slide summarizing key points and high-yield exam takeaways.",
    layout: "two-section-stack",
    zones: [
      "Top section: 'Key Takeaways' with CheckCircle icon, 3-4 concise bullets",
      "Bottom section: 'Clinical Pearls' with Heart icon, 2-3 high-yield exam pearls",
      "Footer: 'Next Lecture' preview link or 'Review Flashcards' call-to-action button",
    ],
    designNotes: [
      "Key Takeaways section: white card with primary left-border (3px solid primary)",
      "Clinical Pearls section: accentLight background card with accent left-border (3px solid accent)",
      "Pearl items use a small diamond or gem icon in accent color",
      "CTA button uses primary background, white text, fully rounded (9999px), subtle shadow",
      "This slide should feel like a reward: clean, spacious, confident",
      "No more than 4 takeaways and 3 pearls total",
    ],
  },
];


// ============================================================
// EXAMPLE: Heart Failure Title Slide (rendered spec)
// ============================================================

/**
 * Example Slide: Title Slide for Heart Failure Lecture
 *
 * Canvas: 1280 x 720px
 * Background: #fdfcfa (warm white)
 * Decorative element: Soft lavender arc (radial gradient) in top-right corner,
 *   using rgba(157, 130, 221, 0.06) fading to transparent
 *
 * Layout:
 * +-----------------------------------------------------------------+
 * |  [NurseNest icon]  (top-left, 24px, primaryLight)               |
 * |                                                                  |
 * |                                                                  |
 * |       Heart Failure                                              |
 * |       Classification, Pathophysiology, and Management            |
 * |                                                                  |
 * |       (Nunito, 42px, extrabold, #2d2640)                        |
 * |       (DM Sans, 22px, medium, #8b82a0)                          |
 * |                                                                  |
 * |                                                                  |
 * |  [RN/NCLEX]              20 min  |  16 slides                   |
 * |  (pill badge              (DM Sans, 14px,   (DM Sans, 14px,    |
 * |   #9d82dd bg,              #8b82a0)           #8b82a0)          |
 * |   white text,                                                    |
 * |   12px, semibold)                                                |
 * |                                                    [heart icon]  |
 * |                                                    (primaryLight |
 * |                                                     20% opacity) |
 * +-----------------------------------------------------------------+
 * |  [========                          ] 1/16                       |
 * |  (progress bar: 4px tall, primary fill, borderSubtle track)      |
 * +-----------------------------------------------------------------+
 *
 * CSS-ready values:
 *   Title:    font-family: Nunito; font-size: 42px; font-weight: 800; color: #2d2640; letter-spacing: -0.01em;
 *   Subtitle: font-family: DM Sans; font-size: 22px; font-weight: 500; color: #8b82a0; line-height: 1.5;
 *   Badge:    background: #9d82dd; color: #fff; font-size: 12px; font-weight: 600; padding: 4px 14px; border-radius: 9999px;
 *   Card:     background: #fff; border: 1px solid #e9e2ff; border-radius: 16px; box-shadow: 0 2px 12px rgba(157,130,221,0.08);
 */

export const exampleTitleSlide = {
  template: "Title Slide",
  lecture: "Heart Failure",
  elements: {
    logo: {
      position: "top-left",
      size: "24px",
      color: slideColors.standard.primaryLight,
    },
    title: {
      text: "Heart Failure",
      font: slideTypography.fontFamily.heading,
      size: slideTypography.fontSize.slideTitle,
      weight: slideTypography.fontWeight.extrabold,
      color: slideColors.standard.textPrimary,
      letterSpacing: slideTypography.letterSpacing.tight,
    },
    subtitle: {
      text: "Classification, Pathophysiology, and Management",
      font: slideTypography.fontFamily.body,
      size: slideTypography.fontSize.subtitle,
      weight: slideTypography.fontWeight.medium,
      color: slideColors.standard.textMuted,
      lineHeight: slideTypography.lineHeight.normal,
    },
    tierBadge: {
      text: "RN / NCLEX",
      background: slideColors.standard.primary,
      color: slideColors.standard.textOnPrimary,
      fontSize: slideTypography.fontSize.label,
      fontWeight: slideTypography.fontWeight.semibold,
      padding: "4px 14px",
      borderRadius: "9999px",
    },
    metadata: {
      duration: "20 min",
      slideCount: "16 slides",
      font: slideTypography.fontFamily.body,
      size: slideTypography.fontSize.caption,
      color: slideColors.standard.textMuted,
    },
    decorativeIcon: {
      icon: "Heart",
      position: "bottom-right",
      size: "120px",
      color: slideColors.standard.primaryLight,
      opacity: 0.2,
    },
    progressBar: {
      height: "4px",
      fillColor: slideColors.standard.primary,
      trackColor: slideColors.standard.borderSubtle,
      progress: "1/16",
      borderRadius: "2px",
    },
  },
};
