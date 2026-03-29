import * as parser from "@babel/parser";
import _traverse from "@babel/traverse";
import fg from "fast-glob";
import * as fs from "fs";
import * as path from "path";

const traverse = (_traverse as any).default || _traverse;

type Severity = "critical" | "high" | "medium" | "low";

interface Violation {
  file: string;
  line: number;
  column: number;
  text: string;
  context: string;
  severity: Severity;
}

interface ScanReport {
  timestamp: string;
  totalFiles: number;
  totalViolations: number;
  bySeverity: Record<Severity, number>;
  violations: Violation[];
}

const EXCLUDE_PATTERNS = [
  "node_modules/**",
  "dist/**",
  "build/**",
  "**/*.test.*",
  "**/*.spec.*",
  "**/__tests__/**",
  "**/i18n-en.ts",
  "**/i18n-*.ts",
  "tools/i18n/**",
  "**/i18n-translations.ts",
  "**/i18n-types.ts",
  "**/locale-utils.ts",
  "**/i18n.tsx",
  "scripts/**",
  "script/**",
];

const ALLOWED_STRINGS = new Set([
  "",
  " ",
  "-",
  ".",
  ",",
  ":",
  "/",
  "|",
  "&",
  "#",
  "@",
  "!",
  "?",
  "*",
  "+",
  "=",
  "<",
  ">",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "true",
  "false",
  "null",
  "undefined",
  "none",
  "px",
  "em",
  "rem",
  "%",
  "vh",
  "vw",
  "auto",
  "none",
  "block",
  "flex",
  "grid",
  "inline",
  "hidden",
  "visible",
  "absolute",
  "relative",
  "fixed",
  "sticky",
  "center",
  "left",
  "right",
  "top",
  "bottom",
  "inherit",
  "initial",
  "unset",
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
  "application/json",
  "Content-Type",
  "Authorization",
  "Bearer",
  "utf-8",
  "utf8",
  "base64",
  "hex",
  "ascii",
  "binary",
  "development",
  "production",
  "test",
  "staging",
  "div",
  "span",
  "button",
  "input",
  "form",
  "img",
  "a",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "table",
  "tr",
  "td",
  "th",
  "thead",
  "tbody",
  "tfoot",
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "text",
  "click",
  "change",
  "submit",
  "focus",
  "blur",
  "keydown",
  "keyup",
  "resize",
  "scroll",
  "load",
  "error",
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave",
]);

const DATA_ATTR_PATTERN = /^data-/;
const CSS_CLASS_PATTERN = /^[a-z][a-z0-9-]*(\s[a-z][a-z0-9-]*)*$/;
const URL_PATTERN = /^(https?:\/\/|\/api\/|\/[a-z]|#|mailto:|tel:)/;
const TEMPLATE_PATTERN = /^\$\{|^\{\{/;
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{3,8}$/;
const NUMERIC_PATTERN = /^[\d.,]+(%|px|em|rem|vh|vw|ms|s)?$/;
const TAILWIND_PATTERN = /^[a-z]+-[a-z0-9-]+(\s[a-z]+-[a-z0-9-]+)*$/;
const ENV_VAR_PATTERN = /^[A-Z][A-Z0-9_]+$/;
const MIME_TYPE_PATTERN = /^(application|text|image|audio|video|multipart)\//;
const FILE_EXT_PATTERN = /^\.[a-z0-9]+$/i;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;
const ROUTER_PATH_PATTERN = /^\/[a-z0-9/:_-]*$/i;
const SQL_PATTERN = /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|JOIN|ORDER|GROUP|HAVING|LIMIT|SET|VALUES|INTO)\b/i;
const CONSOLE_LOG_PATTERN = /^\[(Info|Warn|Error|Debug|Log)\]/i;
const I18N_KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z]/;

function isUserFacingString(text: string): boolean {
  if (text.length < 2) return false;
  if (ALLOWED_STRINGS.has(text)) return false;
  if (NUMERIC_PATTERN.test(text)) return false;
  if (HEX_COLOR_PATTERN.test(text)) return false;
  if (URL_PATTERN.test(text)) return false;
  if (TEMPLATE_PATTERN.test(text)) return false;
  if (DATA_ATTR_PATTERN.test(text)) return false;
  if (ENV_VAR_PATTERN.test(text)) return false;
  if (MIME_TYPE_PATTERN.test(text)) return false;
  if (FILE_EXT_PATTERN.test(text)) return false;
  if (ISO_DATE_PATTERN.test(text)) return false;
  if (ROUTER_PATH_PATTERN.test(text)) return false;
  if (SQL_PATTERN.test(text)) return false;
  if (CONSOLE_LOG_PATTERN.test(text)) return false;
  if (I18N_KEY_PATTERN.test(text)) return false;

  if (/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(text)) return false;

  if (TAILWIND_PATTERN.test(text) && text.length < 100 && !text.includes(" ")) return false;

  const hasSpaces = /\s/.test(text);
  const isLikelyPhrase = hasSpaces && text.length > 3;
  const isCapitalizedWord = /^[A-Z][a-z]+$/.test(text) && text.length >= 3;
  const isSentenceLike = /^[A-Z][a-z]/.test(text) && text.length > 4;
  const isMultiWordLabel = /^[A-Z][a-z]+(\s[A-Z]?[a-z]+)+$/.test(text);

  return isLikelyPhrase || isSentenceLike || isCapitalizedWord || isMultiWordLabel;
}

function classifySeverity(text: string, context: string): Severity {
  const lowerContext = context.toLowerCase();

  if (
    lowerContext.includes("jsxtext") ||
    lowerContext.includes("jsx_element") ||
    lowerContext.includes("return") ||
    lowerContext.includes("render")
  ) {
    return "critical";
  }

  if (
    lowerContext.includes("placeholder") ||
    lowerContext.includes("label") ||
    lowerContext.includes("title") ||
    lowerContext.includes("aria-") ||
    lowerContext.includes("alt=") ||
    lowerContext.includes("description")
  ) {
    return "high";
  }

  if (
    lowerContext.includes("toast") ||
    lowerContext.includes("alert") ||
    lowerContext.includes("message") ||
    lowerContext.includes("notification") ||
    lowerContext.includes("error")
  ) {
    return "medium";
  }

  return "low";
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const code = fs.readFileSync(filePath, "utf-8");

  let ast: any;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
      errorRecovery: true,
    });
  } catch {
    return violations;
  }

  traverse(ast, {
    StringLiteral(pathNode: any) {
      const { value, loc } = pathNode.node;
      if (!isUserFacingString(value)) return;

      const parent = pathNode.parent;
      if (!parent) return;

      if (
        parent.type === "ImportDeclaration" ||
        parent.type === "ExportNamedDeclaration" ||
        parent.type === "ExportDefaultDeclaration"
      ) {
        return;
      }

      if (parent.type === "CallExpression") {
        const calleeName =
          parent.callee?.name ||
          parent.callee?.property?.name ||
          "";
        if (
          ["require", "import", "console", "log", "warn", "error", "info", "debug", "t", "translate", "i18n"].includes(
            calleeName
          )
        ) {
          return;
        }
      }

      if (parent.type === "ObjectProperty" && parent.key === pathNode.node) {
        return;
      }

      if (
        parent.type === "MemberExpression" &&
        parent.property === pathNode.node
      ) {
        return;
      }

      let context = parent.type;
      if (parent.type === "JSXAttribute") {
        context = `JSXAttribute:${parent.name?.name || "unknown"}`;
      } else if (parent.type === "JSXExpressionContainer") {
        context = "jsx_element";
      }

      const severity = classifySeverity(value, context);

      violations.push({
        file: filePath,
        line: loc?.start?.line || 0,
        column: loc?.start?.column || 0,
        text: value.length > 80 ? value.substring(0, 77) + "..." : value,
        context,
        severity,
      });
    },

    JSXText(pathNode: any) {
      const { value, loc } = pathNode.node;
      const trimmed = value.trim();
      if (!trimmed || trimmed.length < 2) return;
      if (/^[\s\n\r]+$/.test(trimmed)) return;
      if (!isUserFacingString(trimmed)) return;

      violations.push({
        file: filePath,
        line: loc?.start?.line || 0,
        column: loc?.start?.column || 0,
        text:
          trimmed.length > 80
            ? trimmed.substring(0, 77) + "..."
            : trimmed,
        context: "JSXText",
        severity: "critical",
      });
    },

    TemplateLiteral(pathNode: any) {
      const { quasis, loc } = pathNode.node;
      if (!quasis || quasis.length === 0) return;

      const parent = pathNode.parent;
      if (parent?.type === "TaggedTemplateExpression") return;
      if (parent?.type === "CallExpression") {
        const calleeName =
          parent.callee?.name ||
          parent.callee?.property?.name ||
          "";
        if (
          ["require", "console", "log", "warn", "error", "info", "debug", "sql", "query"].includes(calleeName)
        ) {
          return;
        }
      }

      for (const quasi of quasis) {
        const text = quasi.value?.cooked || quasi.value?.raw || "";
        if (isUserFacingString(text)) {
          violations.push({
            file: filePath,
            line: loc?.start?.line || 0,
            column: loc?.start?.column || 0,
            text:
              text.length > 80 ? text.substring(0, 77) + "..." : text,
            context: "TemplateLiteral",
            severity: classifySeverity(text, "TemplateLiteral"),
          });
        }
      }
    },
  });

  return violations;
}

export async function runScan(): Promise<ScanReport> {
  const files = await fg(
    ["client/src/**/*.{tsx,ts,jsx,js}"],
    {
      ignore: EXCLUDE_PATTERNS,
      absolute: false,
    }
  );

  const allViolations: Violation[] = [];

  for (const file of files) {
    const violations = scanFile(file);
    allViolations.push(...violations);
  }

  const bySeverity: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const v of allViolations) {
    bySeverity[v.severity]++;
  }

  return {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    totalViolations: allViolations.length,
    bySeverity,
    violations: allViolations,
  };
}

const args = process.argv.slice(2);
const isCI = args.includes("--ci");
const isBuildGuard = args.includes("--build-guard");
const threshold = parseInt(args.find((a) => a.startsWith("--threshold="))?.split("=")[1] || "0");

runScan()
  .then((report) => {
    const reportPath = path.resolve("scripts/i18n-scan-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("\n=== i18n Hardcoded String Scanner ===");
    console.log(`Scanned: ${report.totalFiles} files`);
    console.log(`Total violations: ${report.totalViolations}`);
    console.log(`  Critical: ${report.bySeverity.critical}`);
    console.log(`  High: ${report.bySeverity.high}`);
    console.log(`  Medium: ${report.bySeverity.medium}`);
    console.log(`  Low: ${report.bySeverity.low}`);
    console.log(`\nReport saved to: ${reportPath}`);

    if (report.violations.length > 0) {
      console.log("\n--- Top violations ---");
      const topViolations = report.violations
        .sort((a, b) => {
          const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
          return order[a.severity] - order[b.severity];
        })
        .slice(0, 20);

      for (const v of topViolations) {
        console.log(
          `[${v.severity.toUpperCase()}] ${v.file}:${v.line}:${v.column} "${v.text}" (${v.context})`
        );
      }
    }

    const blockingCount = report.bySeverity.critical + report.bySeverity.high;

    if (isBuildGuard && blockingCount > threshold) {
      console.error(
        `\nBuild guard FAILED: ${blockingCount} critical/high violations exceed threshold of ${threshold}`
      );
      process.exit(1);
    }

    if (isCI && blockingCount > threshold) {
      console.error(
        `\nCI check FAILED: ${blockingCount} critical/high violations exceed threshold of ${threshold}`
      );
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Scanner error:", err);
    process.exit(1);
  });
