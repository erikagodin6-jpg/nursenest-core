# NurseNest Premium UI System Blueprint

This is a production-oriented design-system reference for modernizing NurseNest without changing the existing leaf logo, brand identity, routes, entitlement rules, content architecture, or SEO behavior. The visual direction is premium clinical learning: AMBOSS-level confidence, Osmosis clarity, Linear density, Notion calm, and modern SaaS dashboard structure.

## Design Principles

- **Clinical confidence:** quiet surfaces, strong information hierarchy, meaningful semantic color, no decorative clutter.
- **Study efficiency:** dense but readable layouts, persistent progress, fast scanning, clear next actions.
- **One ecosystem:** marketing, learner, admin, lessons, exams, blogs, and tools share the same token system and component language.
- **Semantic memory:** colors and icons always mean something: red is urgent, amber is caution/labs, green is mastery/care, blue is learning/action, purple is insight, cyan is teaching/info.
- **Theme-safe:** Blossom, Sunset, Ocean, Garden, and Default Clinical use identical component architecture. Theme tokens shift atmosphere; semantic tokens keep meaning stable.

## Global Tokens

### Typography

Use the existing premium sans stack. Avoid oversized marketing-only type on operational screens.

| Token | Use | Desktop | Mobile |
| --- | --- | --- | --- |
| `display` | homepage hero only | 48-64 / 1.02 | 36-42 / 1.06 |
| `page-title` | hub/dashboard/page H1 | 34-44 / 1.08 | 28-34 / 1.12 |
| `section-title` | section headers | 22-28 / 1.16 | 20-24 / 1.18 |
| `card-title` | cards/tool panels | 16-19 / 1.25 | 16-18 / 1.25 |
| `body` | UI body | 15-16 / 1.55 | 15-16 / 1.5 |
| `dense` | dashboard tables, rails | 13-14 / 1.45 | 13-14 / 1.4 |
| `caption` | labels, metadata | 11-12 / 1.25 | 11-12 / 1.25 |

Rules:
- Letter spacing stays `0` for body and headings.
- Use weight for hierarchy before using size.
- Lesson/article prose should use `max-width` and line-height tuned for reading, while dashboards should use compact density.

### Spacing

Use a responsive 4px base scale with tighter operational density.

| Token | Value | Use |
| --- | --- | --- |
| `space-1` | 4 | icon gaps, tight labels |
| `space-2` | 8 | chip gaps, compact lists |
| `space-3` | 12 | form field groups |
| `space-4` | 16 | card inner rhythm |
| `space-5` | 20 | dashboard cards |
| `space-6` | 24 | page sections |
| `space-8` | 32 | major vertical rhythm |
| `space-10` | 40 | marketing bands |
| `space-12` | 48 | large desktop section transitions |

Rules:
- Desktop dashboards should rarely exceed `space-8` between related areas.
- Mobile should prefer `space-4` to `space-6`; avoid tall empty bands.
- Cards in repeated grids use consistent padding: `16-20px`, not hero-scale spacing.

### Shape

| Token | Value | Use |
| --- | --- | --- |
| `radius-sm` | 8 | small controls, chips |
| `radius-md` | 12 | buttons, inputs |
| `radius-lg` | 16 | utility cards |
| `radius-xl` | 20 | hero panels, dashboards |
| `radius-2xl` | 24 | major page shells only |

Use rounded-xl/2xl sparingly on dense tools. Cards inside cards are avoided.

### Elevation

Use neutral, layered shadows already aligned to theme luminance.

| Token | Use |
| --- | --- |
| `shadow-soft` | default cards, nav rails |
| `shadow-panel` | dashboard cards, study cards |
| `shadow-popover` | menus, drawers, tooltips |
| `shadow-focus` | active states, selected answers |

Hover should raise by one elevation step and tint border, not jump or animate dramatically.

### Color

Brand/theme tokens control atmosphere:
- `--theme-primary`, `--theme-accent`, `--theme-card-bg`, `--theme-heading-text`, `--theme-body-text`, `--theme-muted-text`, `--theme-border`

Semantic tokens control meaning:
- Learning/action: blue
- Mastery/interventions: green
- Caution/labs: amber
- Urgent/red flags: red/coral
- Insights/pearls: purple
- Education/info: cyan
- Planning/neutral: slate

Every component should use semantic aliases rather than hardcoded theme accents for status meaning.

## Theme Model

All themes share the same layout, spacing, hierarchy, and interaction states.

| Theme | Personality | Primary Feeling |
| --- | --- | --- |
| Default Clinical | crisp blue/teal, neutral surfaces | professional medical software |
| Blossom | soft rose + clinical blue accents | warm, supportive, not childish |
| Sunset | coral/amber accents, controlled warmth | motivating, energetic |
| Ocean | cyan/indigo/teal | calm, focused, technical |
| Garden | emerald/sage/teal | growth, mastery, care |

Rules:
- Never use theme accent as the only color language.
- Red flags remain red in every theme.
- Labs remain amber in every theme.
- Patient teaching remains cyan/sky in every theme.
- Mastery remains green in every theme.

## Component Library

### Page Shells

**Marketing shell:** header, full-width bands, constrained content, image-led hero, trust strip, CTA band.  
**Learner shell:** sidebar or top rail, dense dashboard grid, persistent progress/status, direct study CTAs.  
**Lesson shell:** 3-zone study cockpit: sticky left rail, main content, right utilities.  
**Admin shell:** dense tables/cards, safety status, audit trails, admin-only actions.

### Navigation Rails

Desktop:
- 220-260px sticky rail
- section title, active pill, icon dots, progress meter
- compact metadata and jump actions

Mobile:
- sticky top progress strip
- contents drawer or accordion
- bottom-safe primary action when needed

### Cards

**Dashboard card:** white/neutral surface, strong header, metric, trend, small action.  
**Semantic card:** tinted surface, icon badge, left accent border, compact bullets.  
**Utility card:** small stacked panel, dense copy, one action.  
**Exam card:** selectable, high contrast, answer state border, rationale slot.  
**Article callout:** semantic background, title, 3-5 bullets, internal study link.

### Chips And Badges

Use chips for filters, status, phase, pathway, confidence, role, and content type.

States:
- Default: neutral surface
- Hover: soft semantic tint
- Active: filled or stronger border
- Completed: green dot/check
- Locked: muted, lock icon, clear tooltip/copy

### Progress Systems

Use consistent progress patterns:
- Thin bar for reading/progress
- Stepper for phase flow
- Ring or stacked bars for dashboard summary
- Micro bars for card-level mastery

Study phase model:
1. Readiness
2. Study
3. Reinforce
4. Mastered

### Forms And Filters

Inputs:
- 44px minimum touch target
- clear label or reliable accessible name
- helper/error text below
- semantic focus ring

Filters:
- segmented control for small option sets
- chips for topic/pathway filters
- search field with leading icon
- sticky filter row on mobile where the workflow is filter-heavy

### Accordions And Tabs

Use accordions for mobile density and FAQ.  
Use tabs for peer-level modes: overview, lessons, practice, analytics.  
Avoid nesting tabs inside tabs.

### Empty States

Premium empty states are useful, not cute:
- icon badge
- one concise explanation
- one primary action
- one secondary text link
- optional “why this is empty” detail for admin/QA surfaces

## Lesson Detail Mockup

### Desktop

Grid:
`[220-240 sticky study rail] [760-960 main] [260-300 utilities]`

Left rail:
- “On this page”
- section anchors with semantic dots/icons
- active section pill
- completed section checkmarks
- lesson progress mini bar
- current phase chip

Main:
- premium hero with pathway, lesson title, estimated time, staff edit control preserved
- horizontal phase stepper
- semantic section cards with compact rhythm
- bottom “Quick Clinical Summary” rapid review
- related reinforcement actions

Right rail:
- bookmark/save
- study time
- exam readiness
- reinforcement status
- quick recall toggle
- related practice CTA

Bottom clinical summary:
Two-row grid:
- Key Takeaways
- Red Flags
- Priority Interventions
- Exam Traps
- Must-Know Labs
- Escalation Cues

### Lesson Section Themes

| Section | Accent | Icon | Visual Treatment |
| --- | --- | --- | --- |
| Pathophysiology | deep teal/indigo | Activity | cool tinted surface, mechanism divider |
| Diagnostics & Labs | amber/gold | FlaskConical | gold border, lab-value rows |
| Signs & Symptoms | orange | Thermometer | warm symptom clusters |
| Red Flags | coral/red | ShieldAlert | stronger border, urgent badge |
| Nursing Interventions | emerald | Stethoscope | care-priority checklist |
| Patient Teaching | sky/cyan | GraduationCap | teach-back rows |
| Medications/Treatments | rose/magenta | Pill | safety/monitoring callouts |
| Clinical Pearls | purple | Lightbulb | pearl badge, short insight blocks |
| Exam Focus | blue | Target | NCLEX/board trap cards |
| Next Steps | slate | Route | study plan accent |

### Mobile Lesson

Order:
1. lesson hero
2. sticky progress strip
3. contents drawer
4. collapsible semantic lesson cards
5. quick clinical summary
6. reinforcement actions

Rules:
- one column
- no right rail
- compact cards
- sticky strip no taller than 56px
- section anchors available through drawer

## Page Mockups

### 1. Homepage

Desktop:
- image-led hero with NurseNest brand, concise value prop, primary CTA, secondary pathway finder
- trust strip: learners, pathways, adaptive practice, clinical review
- pathway grid: RN, PN/RPN, NP, Allied, New Grad
- “How study works” workflow: orient, study, practice, reinforce
- semantic feature bands with real product screenshots/images
- testimonial/social proof strip
- final CTA panel

Mobile:
- compact hero, image remains visible
- pathway cards in 1-column/2-column depending width
- sticky Start Free option only if it does not fight header

### 2. Pricing

Desktop:
- plan cards with strong hierarchy, current price unchanged
- included feature matrix
- eligibility/region notes
- reassurance strip: secure checkout, cancel anytime, support
- FAQ accordion

Mobile:
- stacked plan cards, sticky selected plan CTA, compact comparison accordion

### 3. FAQ

- category chips
- search if already present
- accordion list with strong question typography
- support CTA panel
- no placeholder copy or vague “learn more” anchors

### 4. Blog Index

- editorial header with search/category filters
- feature article row
- card grid with topic chips
- specialty sections: pathophysiology, pharmacology, exam strategy, new grad
- internal study link panel

### 5. Blog Detail

Desktop:
- article hero, author/review metadata, specialty chips
- sticky TOC left or right based on width
- article content with clinical callouts
- key takeaway panel near top
- related lessons/questions panel
- readable line length

Mobile:
- sticky progress bar
- TOC drawer
- callouts full-width

### 6. Contact/Support

- support routes by intent: billing, account, content issue, school/institution
- compact form card
- response-time chip
- FAQ side panel

### 7-11. Pathway Hubs

RN, PN/RPN, NP, Allied, New Grad share one hub architecture:
- pathway hero with exam/role badge
- study surface cards: Lessons, Flashcards, Practice Questions, Practice Tests/CAT
- readiness module
- featured study plan
- recent/public article links
- pathway-specific semantic modules

NP hub:
- specialty selector: FNP, AGPCNP, PMHNP, WHNP, PNP-PC
- board framing without RN/PN leakage

Allied hub:
- occupation-first grouping
- modality requirements shown as compact badges where relevant

New Grad:
- floor/unit pathway cards
- shift-readiness checklist
- transition-to-practice CTA

### 12. Lesson Detail

Use the lesson cockpit above.

### 13. Flashcards Hub

Desktop:
- deck grid with progress bars
- filters by pathway/topic/confidence
- weak-area deck recommendations
- daily review CTA

Mobile:
- sticky filter/search
- deck cards with large tap targets

### 14. Flashcard Study Session

- immersive centered card
- front/back flip with restrained motion
- confidence buttons: Again, Hard, Good, Easy
- rationale drawer/panel
- progress bar and exit/save controls

### 15. Practice Exam Builder

- pathway selector
- mode selector: adaptive/CAT, linear, topic review
- question count controls
- topic chips
- readiness/status preview
- clear start CTA

### 16. Practice Exam Runner

- focused shell, minimal chrome
- question card
- premium answer cards
- flag/review controls
- progress/status bar
- rationale panel only when rules allow

### 17. CAT Exam Interface

- strict focused interface
- timer/status, item count, confidence/readiness language
- no rationale during true CAT if existing rules hide it
- post-session report with readiness, weak areas, next steps

### 18. Learner Dashboard

- “Today’s study plan” primary panel
- streak, readiness, mastery, questions due
- weak areas with semantic urgency
- continue learning row
- recent practice/report previews
- next best action CTA

### 19. Admin Dashboard

- dense operational shell
- safety/status cards
- content QA queues
- users/subscriptions tables
- pathway/lesson management cards
- audit/event panels
- admin-only controls stay explicit and server-gated

### 20. Report Cards

- readiness score hero
- domain performance bars
- strengths/weaknesses
- missed topics
- recommended next actions
- printable/shareable summary

### 21. Analytics/Progress

- trend lines, mastery heatmaps, practice volume
- weak-area clusters
- cohort/benchmark if available
- compact explanations, no fake precision

### 22. Pre-Nursing

- roadmap hero
- prerequisite/checklist cards
- skill-building modules
- admissions/interview prep
- CTA into free tools and early study plan

### 23. Tools/Calculators

- tool hub cards by category
- input panel + result panel
- explanation card
- safety notes where clinically relevant
- mobile forms with large controls

### 24. Mobile Navigation

- compact top header with preserved logo
- drawer grouped by Learn, Practice, Track, Account
- sticky auth CTA for guests only when non-obstructive
- active route indication

### 25. Mobile Lesson

Use sticky progress, contents drawer, collapsible section cards, bottom summary.

### 26. Mobile Dashboard

- today card first
- horizontal stat chips
- continue learning
- weak areas
- practice CTA
- account/support links at bottom

### 27. Tablet Layouts

- two-zone layouts: main + collapsible rail
- sidebars become drawers at narrow tablet
- grids shift from 3 columns to 2 columns
- lesson right utilities merge into main below hero

## Interaction States

Buttons:
- default, hover, active, focus-visible, loading, disabled

Cards:
- default, hover elevation, active border/ring, completed check, locked muted

Answers:
- selected, correct, incorrect, flagged, review-needed

Progress:
- empty, partial, completed, current phase, locked paid-only state

Motion:
- 120-180ms ease-out for hover/focus
- 180-240ms for drawers
- no large bouncing, spinning, or gamified motion
- honor reduced motion

## Accessibility

- Preserve semantic landmarks and headings.
- Every icon-only button needs a label or tooltip.
- Touch targets at least 44px.
- Do not rely on color alone for status.
- Contrast must pass on every theme.
- Sticky elements must not cover anchors or focused fields.

## Implementation Guidance

1. Start with tokens and primitives: page shells, card variants, chips, progress, rails.
2. Apply to lessons and dashboards first because they define the clinical learning language.
3. Modernize marketing pages after primitives are stable.
4. Keep public SEO routes server-rendered.
5. Avoid large client-only redesign wrappers.
6. Preserve NurseNest logo assets and existing brand lockup.
7. Add visual and route smoke checks per slice.

## Done Criteria

- All major surfaces share one token/component system.
- Semantic colors are consistent across themes.
- Lesson sections are visually recognizable by type.
- Dashboards are dense, actionable, and calm.
- Exams and flashcards are focused and readable.
- Blog content feels medically authoritative and linked into study workflows.
- Mobile layouts are compact, touch-friendly, and free of overflow.
