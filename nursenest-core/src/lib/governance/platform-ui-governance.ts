export type PlatformUiPrimitiveCategory =
  | "buttons"
  | "inputs"
  | "panels"
  | "feedback"
  | "navigation"
  | "typography";

export type PlatformUiMigrationPriority = "p0" | "p1" | "p2";

export type PlatformUiMigrationTarget = {
  id: string;
  label: string;
  priority: PlatformUiMigrationPriority;
  preserveClinicalDensity: boolean;
  preserveExistingFlow: boolean;
  requiredConvergence: string[];
};

export type PlatformUiGovernanceViolation = {
  ruleId: string;
  label: string;
  index: number;
  match: string;
};

export const PLATFORM_UI_AUTH_REFERENCE = {
  primitivesPath: "src/components/auth/auth-experience/auth-primitives.tsx",
  tokenPath: "src/app/styles/marketing/auth-tokens.css",
  shellPath: "src/components/auth/auth-experience/auth-experience-shell.tsx",
} as const;

export const PLATFORM_UI_ALLOWED_TOKEN_PREFIXES = [
  "--semantic-",
  "--auth-",
  "--role-",
  "--surface-",
  "--theme-",
  "--focus-",
  "--border-",
  "--text-",
  "--bg-",
  "--nn-",
] as const;

export const PLATFORM_UI_PRIMITIVE_CATEGORIES: Record<PlatformUiPrimitiveCategory, string[]> = {
  buttons: ["primary", "secondary", "ghost", "icon", "destructive"],
  inputs: ["text", "password", "search", "textarea", "select"],
  panels: ["card", "glass", "monitor", "report"],
  feedback: ["banner", "alert", "toast", "inline-validation"],
  navigation: ["tabs", "segmented-control", "breadcrumbs", "topbar"],
  typography: ["heading", "label", "helper-text", "educational-copy", "metadata"],
};

export const PLATFORM_UI_SPACING_SCALE = [
  "0",
  "0.25rem",
  "0.5rem",
  "0.75rem",
  "1rem",
  "1.25rem",
  "1.5rem",
  "2rem",
  "2.5rem",
  "3rem",
] as const;

export const PLATFORM_UI_MOTION_PRESETS = {
  instant: "var(--nn-motion-instant)",
  fast: "var(--nn-motion-fast)",
  base: "var(--nn-motion-base)",
  slow: "var(--nn-motion-slow)",
  easing: "var(--nn-motion-ease)",
} as const;

export const PLATFORM_UI_ELEVATION_PRESETS = {
  flat: "var(--nn-elevation-flat)",
  card: "var(--nn-elevation-card)",
  raised: "var(--nn-elevation-raised)",
  overlay: "var(--nn-elevation-overlay)",
  monitor: "var(--nn-elevation-monitor)",
} as const;

export const PLATFORM_UI_ACCESSIBILITY_REQUIREMENTS = [
  "WCAG AA contrast",
  "keyboard navigation",
  "logical tab order",
  "visible focus treatment",
  "aria-invalid for invalid controls",
  "aria-live for async feedback",
  "prefers-reduced-motion support",
  "screen-reader semantics",
  "minimum touch target sizing",
] as const;

export const PLATFORM_UI_CROSS_THEME_VALIDATION = ["blossom", "ocean", "midnight"] as const;

export const PLATFORM_UI_MIGRATION_TARGETS: PlatformUiMigrationTarget[] = [
  {
    id: "flashcards-practice-exams",
    label: "Flashcards and Practice Exams",
    priority: "p0",
    preserveClinicalDensity: false,
    preserveExistingFlow: true,
    requiredConvergence: [
      "launcher screens",
      "setup flows",
      "question controls",
      "rationale panels",
      "confidence controls",
      "progress bars",
      "bottom action areas",
    ],
  },
  {
    id: "ecg-telemetry",
    label: "ECG and Telemetry",
    priority: "p1",
    preserveClinicalDensity: true,
    preserveExistingFlow: true,
    requiredConvergence: [
      "typography hierarchy",
      "spacing rhythm",
      "panel structure",
      "button behavior",
      "focus treatment",
      "interaction timing",
    ],
  },
  {
    id: "physiology-monitor-workstation",
    label: "Physiology Monitor Workstation",
    priority: "p1",
    preserveClinicalDensity: true,
    preserveExistingFlow: true,
    requiredConvergence: [
      "token usage",
      "accessibility",
      "keyboard support",
      "motion standards",
      "clinical workstation layout",
    ],
  },
  {
    id: "reports",
    label: "Reports and Institutional Analytics",
    priority: "p1",
    preserveClinicalDensity: true,
    preserveExistingFlow: true,
    requiredConvergence: [
      "hierarchy",
      "typography",
      "panel spacing",
      "score visualization",
      "print and export layout",
      "mobile readability",
    ],
  },
];

export const PLATFORM_UI_CLINICAL_EXCEPTIONS = [
  "Telemetry and monitor workstations may use denser panel layouts when clinical realism requires it.",
  "Monitor displays may retain high-information grouping when tokenized spacing, focus, and contrast rules are still met.",
  "Clinical reports may prioritize scan density over marketing whitespace when institutional readability is improved.",
] as const;

export const PLATFORM_UI_FORBIDDEN_PATTERNS = [
  {
    ruleId: "hardcoded-hex",
    label: "Hardcoded hex values",
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
  },
  {
    ruleId: "arbitrary-tailwind-color",
    label: "Arbitrary Tailwind color classes",
    pattern: /\b(?:bg|text|border|ring|from|via|to|shadow)-\[[^\]]*(?:#|rgb|hsl|oklch)[^\]]*\]/g,
  },
  {
    ruleId: "inline-color-style",
    label: "Inline color styles",
    pattern: /style=\{\{[^}]*\b(?:color|background|backgroundColor|borderColor)\s*:/g,
  },
  {
    ruleId: "arbitrary-spacing",
    label: "Arbitrary spacing outside token scale",
    pattern: /\b(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|space-x|space-y)-\[[^\]]+\]/g,
  },
  {
    ruleId: "arbitrary-radius",
    label: "Arbitrary radii",
    pattern: /\brounded-\[[^\]]+\]/g,
  },
  {
    ruleId: "arbitrary-shadow",
    label: "Arbitrary shadows",
    pattern: /\bshadow-\[[^\]]+\]/g,
  },
  {
    ruleId: "custom-transition-duration",
    label: "Custom transition durations",
    pattern: /\bduration-\[(?!var\(--nn-motion-)[^\]]+\]|\btransitionDuration\s*:/g,
  },
  {
    ruleId: "ad-hoc-opacity",
    label: "Ad hoc opacity values",
    pattern: /\bopacity-\[(?!var\()[^\]]+\]/g,
  },
  {
    ruleId: "component-theme-branching",
    label: "Theme branching inside components",
    pattern: /\b(?:theme|resolvedTheme)\s*===\s*["'`][a-z-]+["'`]/g,
  },
] as const;

export function tokenLooksGoverned(value: string): boolean {
  return PLATFORM_UI_ALLOWED_TOKEN_PREFIXES.some((prefix) => value.includes(`var(${prefix}`));
}

export function scanUiGovernanceSource(source: string): PlatformUiGovernanceViolation[] {
  const violations: PlatformUiGovernanceViolation[] = [];

  for (const rule of PLATFORM_UI_FORBIDDEN_PATTERNS) {
    const matches = source.matchAll(rule.pattern);
    for (const match of matches) {
      violations.push({
        ruleId: rule.ruleId,
        label: rule.label,
        index: match.index ?? 0,
        match: match[0],
      });
    }
  }

  return violations;
}

export function summarizePlatformUiGovernance() {
  return {
    authReference: PLATFORM_UI_AUTH_REFERENCE,
    primitiveCategories: PLATFORM_UI_PRIMITIVE_CATEGORIES,
    migrationTargets: PLATFORM_UI_MIGRATION_TARGETS,
    accessibilityRequirements: PLATFORM_UI_ACCESSIBILITY_REQUIREMENTS,
    crossThemeValidation: PLATFORM_UI_CROSS_THEME_VALIDATION,
    clinicalExceptions: PLATFORM_UI_CLINICAL_EXCEPTIONS,
  };
}
