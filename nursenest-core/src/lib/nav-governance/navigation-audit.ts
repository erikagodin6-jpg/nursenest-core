/**
 * Navigation Compliance Auditor
 *
 * Runtime-safe audit of the navigation contract. Reads the filesystem to
 * determine which learner routes are compliant and which are violations.
 *
 * Usage (scripts / tests / admin dashboard):
 *   import { buildNavigationAuditReport } from "@/lib/nav-governance/navigation-audit";
 *   const report = buildNavigationAuditReport();
 */

import fs from "node:fs";
import path from "node:path";

import {
  APPROVED_MODULE_EXCEPTIONS,
  CANONICAL_LEARNER_SHELL_PATH,
  NAVIGATION_CONTRACT_VERSION,
  isApprovedModuleException,
  getApprovedExceptionForRoute,
} from "./navigation-contract";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ComplianceStatus =
  | "compliant"         // Uses canonical learner shell
  | "approved-exception" // Listed in APPROVED_MODULE_EXCEPTIONS
  | "violation"         // Bypasses learner shell without approval
  | "unknown";          // Cannot determine from static analysis

export interface RouteAuditEntry {
  /** Filesystem path relative to project root. */
  filePath: string;
  /** URL route path (e.g. /app/modules/ecg). */
  routePath: string;
  status: ComplianceStatus;
  /** Explanation of the status. */
  detail: string;
  /** If approved-exception, the registered exception entry. */
  exception?: typeof APPROVED_MODULE_EXCEPTIONS[number];
  /** Key imports found in the layout. */
  importsFound: string[];
}

export interface NavigationAuditReport {
  contractVersion: string;
  auditedAt: string;
  canonicalShellPath: string;
  totalRoutes: number;
  compliantCount: number;
  approvedExceptionCount: number;
  violationCount: number;
  complianceRate: number; // 0–100
  routes: RouteAuditEntry[];
  violations: RouteAuditEntry[];
  summary: string;
}

// ─── Navigation-relevant component patterns ───────────────────────────────────

const VIOLATION_INDICATORS = [
  "PremiumEducationalModuleShell",
  "AdvancedEcgModuleShell",
  "custom-header",
  "module-nav",
] as const;

const SUBSECTION_PATTERNS = [
  "LearnerAccountNav",
  "LearnerAccountShellHeader",
  "ExamSessionShell",
  "LearnerExamChromeGate",
  "LabsWorkstationShell",
  "MedCalcWorkstationShell",
  "ClinicalSkillsWorkstationShell",
  "LearningModuleShell",
  "EcgWorkstationShell",
] as const;

// ─── Filesystem helpers ───────────────────────────────────────────────────────

function findLayoutFiles(root: string): string[] {
  const results: string[] = [];
  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === "layout.tsx" || entry.name === "layout.ts") {
        results.push(fullPath);
      }
    }
  }
  walk(root);
  return results;
}

function filePathToRoutePath(absolutePath: string, appDir: string): string {
  const rel = path.relative(appDir, absolutePath).replace(/layout\.(tsx|ts)$/, "").replace(/\\/g, "/");
  // Remove Next.js route group parens: (app)/app/(learner)/flashcards → /app/flashcards
  let route = "/" + rel
    .replace(/\/layout\.(tsx|ts)$/, "")
    .replace(/\(app\)\//g, "")
    .replace(/\(learner\)\//g, "")
    .replace(/\(study-tools\)\//g, "")
    .replace(/\([^)]+\)\//g, "")
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");
  if (!route || route === "") route = "/";
  return route;
}

function extractImports(source: string): string[] {
  const imports: string[] = [];
  const importRe = /import\s+(?:type\s+)?(?:\{[^}]*\}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;
  const componentRe = /\{([^}]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(source)) !== null) {
    const specifier = m[1] ?? "";
    // Also extract named imports
    const nameMatch = m[0];
    const namedRe = /\{([^}]+)\}/;
    const named = namedRe.exec(nameMatch);
    if (named) {
      const names = named[1]!.split(",").map((n) => n.trim().split(" as ")[0]!.trim()).filter(Boolean);
      imports.push(...names);
    }
    imports.push(specifier);
  }
  return [...new Set(imports)];
}

function isLearnerShellLayout(absolutePath: string, root: string): boolean {
  const rel = path.relative(root, absolutePath).replace(/\\/g, "/");
  return rel === CANONICAL_LEARNER_SHELL_PATH;
}

function isUnderLearnerShell(absolutePath: string, root: string): boolean {
  const rel = path.relative(root, absolutePath).replace(/\\/g, "/");
  // Under (app)/app/(learner)/ but NOT the root learner layout itself
  return (
    rel.includes("(app)/app/(learner)/") &&
    rel !== CANONICAL_LEARNER_SHELL_PATH
  );
}

function isModuleLayout(absolutePath: string, root: string): boolean {
  const rel = path.relative(root, absolutePath).replace(/\\/g, "/");
  return rel.includes("(app)/modules/");
}

function isAppRootLayout(absolutePath: string, root: string): boolean {
  const rel = path.relative(root, absolutePath).replace(/\\/g, "/");
  // These are structural layouts, not learner-facing
  return rel === "src/app/(app)/layout.tsx" || rel === "src/app/(app)/app/layout.tsx";
}

// ─── Audit logic ──────────────────────────────────────────────────────────────

function auditLayoutFile(
  absolutePath: string,
  root: string,
): RouteAuditEntry {
  const source = fs.readFileSync(absolutePath, "utf8");
  const imports = extractImports(source);
  const relPath = path.relative(root, absolutePath).replace(/\\/g, "/");
  const routePath = filePathToRoutePath(absolutePath, path.join(root, "src/app"));

  // The canonical shell itself — always compliant
  if (isLearnerShellLayout(absolutePath, root)) {
    return {
      filePath: relPath,
      routePath: "/app (canonical shell)",
      status: "compliant",
      detail: "This IS the canonical learner shell — navigation source of truth.",
      importsFound: [],
    };
  }

  // Structural app/layout.tsx files — skip (not learner surfaces)
  if (isAppRootLayout(absolutePath, root)) {
    return {
      filePath: relPath,
      routePath,
      status: "compliant",
      detail: "Structural provider layout — not a learner navigation surface.",
      importsFound: [],
    };
  }

  // Under (learner)/ → inherits canonical shell → compliant
  if (isUnderLearnerShell(absolutePath, root)) {
    const subsectionComponents = SUBSECTION_PATTERNS.filter((c) => source.includes(c));
    const detail = subsectionComponents.length > 0
      ? `Inherits canonical learner shell. Adds approved subsection chrome: ${subsectionComponents.join(", ")}.`
      : "Inherits canonical learner shell. Adds CSS/metadata only.";
    return {
      filePath: relPath,
      routePath,
      status: "compliant",
      detail,
      importsFound: subsectionComponents,
    };
  }

  // Module routes — check against approved exceptions
  if (isModuleLayout(absolutePath, root)) {
    const fullRoutePath = relPath
      .replace("src/app/(app)/modules", "/app/modules")
      .replace(/\/layout\.(tsx|ts)$/, "");

    if (isApprovedModuleException(fullRoutePath)) {
      const exception = getApprovedExceptionForRoute(fullRoutePath);
      const navComponents = VIOLATION_INDICATORS.filter((c) => source.includes(c));
      return {
        filePath: relPath,
        routePath: fullRoutePath,
        status: "approved-exception",
        detail: exception?.justification ?? "Listed in APPROVED_MODULE_EXCEPTIONS.",
        exception: exception ?? undefined,
        importsFound: navComponents,
      };
    }

    // Module route NOT in approved list → VIOLATION
    const navComponents = VIOLATION_INDICATORS.filter((c) => source.includes(c));
    return {
      filePath: relPath,
      routePath,
      status: "violation",
      detail: `Module route bypasses canonical learner shell without approval. Navigation components found: ${navComponents.join(", ") || "unknown"}. Add to APPROVED_MODULE_EXCEPTIONS or migrate to (learner)/ shell.`,
      importsFound: navComponents,
    };
  }

  // Any other layout outside (learner)/ — likely a violation
  const navComponents = VIOLATION_INDICATORS.filter((c) => source.includes(c));
  if (navComponents.length > 0) {
    return {
      filePath: relPath,
      routePath,
      status: "violation",
      detail: `Layout outside canonical shell renders navigation components: ${navComponents.join(", ")}. Move to (app)/app/(learner)/ or register as approved exception.`,
      importsFound: navComponents,
    };
  }

  return {
    filePath: relPath,
    routePath,
    status: "unknown",
    detail: "Layout path is outside the canonical learner shell but no obvious navigation components detected. Manual review required.",
    importsFound: [],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Build a full navigation compliance audit report by scanning the filesystem.
 * Run from the project root (nursenest-core/).
 */
export function buildNavigationAuditReport(projectRoot?: string): NavigationAuditReport {
  const root = projectRoot ?? process.cwd();
  const appDir = path.join(root, "src", "app");

  if (!fs.existsSync(appDir)) {
    throw new Error(`Cannot find src/app directory at ${appDir}. Run from nursenest-core/.`);
  }

  const layoutFiles = findLayoutFiles(appDir);
  const routes = layoutFiles.map((f) => auditLayoutFile(f, root));

  const compliant = routes.filter((r) => r.status === "compliant");
  const exceptions = routes.filter((r) => r.status === "approved-exception");
  const violations = routes.filter((r) => r.status === "violation");
  const indexable = routes.filter((r) => r.status !== "unknown");

  const complianceRate = indexable.length > 0
    ? Math.round(((compliant.length + exceptions.length) / indexable.length) * 100)
    : 100;

  const summary = violations.length === 0
    ? `Navigation contract: 100% compliant. ${compliant.length} routes use the canonical learner shell. ${exceptions.length} approved exceptions.`
    : `Navigation contract: ${complianceRate}% compliant. ${violations.length} VIOLATION(S) detected. ${violations.map((v) => v.routePath).join(", ")} bypass the canonical learner shell without approval.`;

  return {
    contractVersion: NAVIGATION_CONTRACT_VERSION,
    auditedAt: new Date().toISOString(),
    canonicalShellPath: CANONICAL_LEARNER_SHELL_PATH,
    totalRoutes: routes.length,
    compliantCount: compliant.length,
    approvedExceptionCount: exceptions.length,
    violationCount: violations.length,
    complianceRate,
    routes,
    violations,
    summary,
  };
}
