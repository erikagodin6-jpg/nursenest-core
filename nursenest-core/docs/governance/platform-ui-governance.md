# Platform UI Governance

NurseNest UI convergence is a governance program, not a redesign program. The premium auth pass is the reference implementation for token usage, focus behavior, primitive structure, motion restraint, and accessibility quality.

## Canonical Sources

- Auth primitive reference: `src/components/auth/auth-experience/auth-primitives.tsx`
- Platform primitive layer: `src/components/premium-ui/platform-primitives.tsx`
- Platform governance contract: `src/lib/governance/platform-ui-governance.ts`
- Platform CSS tokens: `src/app/platform-ui-governance.css`
- CI guard: `tests/contracts/ui-governance.contract.test.ts`

## Token Standards

New UI must resolve color through semantic variables, not raw color literals. Approved token families are:

- `--semantic-*`
- `--auth-*`
- `--role-*`
- `--surface-*`
- existing shared surface and text aliases such as `--theme-*`, `--bg-*`, `--text-*`, `--border-*`, `--focus-*`, and `--nn-*`

Do not introduce hardcoded hex, rgb, hsl, oklch, inline color styles, or component-level theme branching. Theme adaptation belongs in token definitions and theme CSS, not inside component logic.

## Spacing Standards

Use the platform four-pixel rhythm exposed by `--nn-space-*` tokens. New convergence work should avoid arbitrary Tailwind spacing values and one-off inline spacing.

When a dense clinical interface needs compact spacing, use the same scale at smaller steps. Do not invent a separate monitor spacing system unless it is documented as a clinical exception and still maps to tokens.

## Motion Standards

Use approved motion tokens only:

- `--nn-motion-instant`
- `--nn-motion-fast`
- `--nn-motion-base`
- `--nn-motion-slow`
- `--nn-motion-ease`

Motion should be calm, clinical, premium, and stable. It should clarify state changes, never distract from patient data, rationales, or exam actions. All motion-bearing surfaces must honor `prefers-reduced-motion`.

## Elevation Standards

Use the approved elevation set:

- `--nn-elevation-flat`
- `--nn-elevation-card`
- `--nn-elevation-raised`
- `--nn-elevation-overlay`
- `--nn-elevation-monitor`

Do not create arbitrary box shadows in components. Clinical monitor views may use the monitor elevation token to preserve workstation seriousness.

## Primitive Usage

New shared UI should compose platform primitives before adding local markup:

- Buttons: `PlatformButton`, `PlatformIconButton`
- Inputs: `PlatformInput`, `PlatformTextarea`, `PlatformSelect`, `PlatformLabel`
- Panels: `PlatformPanel`
- Feedback: `PlatformFeedback`
- Navigation: `PlatformTopbar`, `PlatformTabs`, `PlatformSegmentedControl`, `PlatformBreadcrumbs`
- Typography: `PlatformText`

Existing modules do not need broad rewrites in one pass. Migration should happen at owned boundaries: launcher screens, question controls, rationale panels, topbars, bottom action strips, reports, and monitor panels.

## Clinical UI Rules

Clinical and educational surfaces should remain readable, dense where appropriate, and clinically serious. Governance must not flatten monitor systems, convert telemetry into dashboard cards, or replace clinical realism with consumer whitespace.

Flashcards and practice exams must preserve their original launcher hierarchy and study flow while converging on tokenized controls, panel structure, focus behavior, and motion.

ECG, telemetry, and physiology monitor workstations may preserve high-information layouts. Telemetry and monitor workstations may use denser panel layouts when the density supports clinical interpretation. They still need semantic tokens, keyboard access, stable focus states, and reduced-motion behavior.

## Accessibility Standards

Every migrated surface must validate:

- WCAG AA contrast
- keyboard navigation
- logical tab order
- visible focus treatment
- `aria-invalid` for invalid controls
- `aria-live` for async feedback
- prefers-reduced-motion support
- screen-reader semantics
- minimum touch target sizing

Auth-level accessibility is the target quality bar.

## Cross-Theme Validation

Minimum required validation themes:

- Blossom
- Ocean
- Midnight

Theme parity means the same component structure, spacing, motion, and interaction model across themes. Theme-specific visual changes must come from tokens only.

## Deviation Rules

Deviation is allowed only when it protects clinical realism, monitor density, print/export fidelity, or learner comprehension. A deviation must be documented with:

- the module
- the clinical or educational reason
- the token mapping used
- the accessibility validation performed

Undocumented component-specific theme hacks are not allowed.
