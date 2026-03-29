import ts from "typescript";
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import path from "path";

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface Violation {
  file: string;
  line: number;
  column: number;
  text: string;
  severity: Severity;
  context: string;
  suggestion: string;
}

interface ScanConfig {
  criticalThreshold: number;
  totalThreshold: number;
  outputJson: boolean;
  outputPath: string;
  scanDir: string;
  failOnCritical: boolean;
  quiet: boolean;
}

const DEFAULT_CONFIG: ScanConfig = {
  criticalThreshold: 0,
  totalThreshold: Infinity,
  outputJson: false,
  outputPath: "i18n-violations-report.json",
  scanDir: "client/src",
  failOnCritical: true,
  quiet: false,
};

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  "__tests__",
  "__mocks__",
  "test",
  "tests",
  "ui",
]);

const IGNORED_FILES = new Set([
  "i18n.tsx",
  "i18n-en.ts",
  "i18n-types.ts",
  "i18n-translations.ts",
  "locale-utils.ts",
  "queryClient.ts",
  "utils.ts",
]);

const TECHNICAL_ATTR_NAMES = new Set([
  "className",
  "id",
  "data-testid",
  "htmlFor",
  "type",
  "name",
  "role",
  "href",
  "src",
  "method",
  "action",
  "target",
  "rel",
  "key",
  "style",
  "ref",
  "tabIndex",
  "autoComplete",
  "inputMode",
  "pattern",
  "accept",
  "encType",
  "xmlns",
  "viewBox",
  "fill",
  "stroke",
  "d",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x1",
  "x2",
  "y1",
  "y2",
  "width",
  "height",
  "transform",
  "strokeWidth",
  "strokeLinecap",
  "strokeLinejoin",
  "fillRule",
  "clipRule",
  "points",
  "gradientUnits",
  "offset",
  "stopColor",
  "stopOpacity",
  "color",
  "size",
  "variant",
  "side",
  "align",
  "orientation",
  "dir",
  "as",
  "asChild",
  "sideOffset",
  "alignOffset",
  "defaultValue",
  "value",
  "checked",
  "disabled",
  "required",
  "readOnly",
  "max",
  "min",
  "step",
  "rows",
  "cols",
  "span",
  "colSpan",
  "rowSpan",
  "scope",
  "loading",
  "decoding",
  "fetchPriority",
  "srcSet",
  "sizes",
  "media",
  "crossOrigin",
  "preload",
  "loop",
  "muted",
  "controls",
  "autoPlay",
  "poster",
]);

const USER_FACING_ATTR_NAMES = new Set([
  "title",
  "label",
  "placeholder",
  "alt",
  "aria-label",
  "aria-description",
  "description",
  "heading",
  "message",
  "tooltip",
  "content",
  "caption",
  "summary",
  "helperText",
  "errorMessage",
  "successMessage",
]);

const CRITICAL_JSX_TAGS = new Set([
  "button",
  "Button",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
]);

const HIGH_JSX_TAGS = new Set([
  "label",
  "Label",
  "p",
  "span",
  "li",
  "td",
  "th",
  "dt",
  "dd",
  "figcaption",
  "legend",
  "summary",
  "CardTitle",
  "CardDescription",
  "AlertTitle",
  "AlertDescription",
  "DialogTitle",
  "DialogDescription",
  "SheetTitle",
  "SheetDescription",
  "TooltipContent",
  "Badge",
  "AccordionTrigger",
  "TabsTrigger",
  "DropdownMenuItem",
  "SelectItem",
  "BreadcrumbLink",
  "NavigationMenuLink",
]);

const MEDIUM_JSX_TAGS = new Set([
  "div",
  "section",
  "article",
  "aside",
  "header",
  "footer",
  "nav",
  "main",
  "strong",
  "em",
  "b",
  "i",
  "small",
  "blockquote",
  "cite",
  "time",
  "mark",
  "abbr",
  "code",
  "pre",
  "option",
]);

const NON_TEXT_PATTERNS = [
  /^[a-z]+([A-Z][a-z]+)+$/,
  /^[a-z]+(-[a-z]+)+$/,
  /^[a-z]+(_[a-z]+)+$/,
  /^[a-z]+\.[a-z]/,
  /^(https?:\/\/|\/[a-z/])/i,
  /^\d+(\.\d+)?(%|px|em|rem|vh|vw|s|ms)?$/,
  /^#[0-9a-fA-F]{3,8}$/,
  /^rgba?\(/,
  /^hsla?\(/,
  /^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)$/,
  /^(string|number|boolean|object|undefined|null|void|any|never)$/,
  /^(div|span|p|h[1-6]|a|button|input|form|img|svg|path|circle|rect|line|text|g|section|article|aside|header|footer|nav|main|ul|ol|li|table|tr|td|th|thead|tbody|tfoot|select|option|textarea|label|fieldset|legend|details|summary|dialog|figure|figcaption)$/,
  /^(true|false)$/,
  /^\s*$/,
  /^[&|<>=!+\-*/%]+$/,
  /^[\w.-]+@[\w.-]+\.\w+$/,
  /^\w+:\/\//,
  /^[A-Z_][A-Z0-9_]+$/,
  /^[\w-]+\/[\w-]+$/,
  /^\d+$/,
  /^[a-z]{1,3}$/,
  /^\.{1,3}$/,
  /^(application|text|image|audio|video)\//,
  /^Bearer\s/,
  /^data:/,
  /^@(media|keyframes|font-face|import|charset)/,
  /^var\(--/,
  /^[\d.]+\s*(px|em|rem|%|vh|vw|ch|ex|cm|mm|in|pt|pc|deg|rad|grad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx|fr)$/,
];

function isNonTextContent(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0) return true;
  if (trimmed.length === 1) return true;
  if (trimmed.length > 300) return true;
  if (/^\{.*\}$/.test(trimmed)) return true;
  for (const pattern of NON_TEXT_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }
  if (!/[a-zA-Z]/.test(trimmed)) return true;
  if (/^[a-z][a-zA-Z]*\.[a-z][a-zA-Z.]*$/.test(trimmed)) return true;
  return false;
}

function generateTranslationKey(text: string, parentTag?: string): string {
  const prefix = parentTag ? parentTag.toLowerCase().replace(/[^a-z]/g, "") : "ui";
  const words = text
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .map((w) => w.toLowerCase());
  if (words.length === 0) return `${prefix}.text`;
  const key = words.join("_");
  return `${prefix}.${key}`;
}

function generateSuggestion(text: string, parentTag?: string): string {
  const key = generateTranslationKey(text, parentTag);
  return `t("${key}")`;
}

function getJsxTagName(node: ts.Node): string | undefined {
  let current = node.parent;
  while (current) {
    if (ts.isJsxElement(current)) {
      const tagName = current.openingElement.tagName;
      if (ts.isIdentifier(tagName)) return tagName.text;
      if (ts.isPropertyAccessExpression(tagName) && ts.isIdentifier(tagName.name)) return tagName.name.text;
    }
    if (ts.isJsxSelfClosingElement(current)) {
      const tagName = current.tagName;
      if (ts.isIdentifier(tagName)) return tagName.text;
      if (ts.isPropertyAccessExpression(tagName) && ts.isIdentifier(tagName.name)) return tagName.name.text;
    }
    current = current.parent;
  }
  return undefined;
}

function classifySeverity(text: string, parentTag?: string, attrName?: string): Severity {
  if (attrName) {
    if (attrName === "placeholder" || attrName === "title" || attrName === "label") return "HIGH";
    if (attrName === "alt" || attrName === "aria-label" || attrName === "aria-description") return "MEDIUM";
    if (USER_FACING_ATTR_NAMES.has(attrName)) return "HIGH";
    return "MEDIUM";
  }
  if (parentTag) {
    if (CRITICAL_JSX_TAGS.has(parentTag)) return "CRITICAL";
    if (HIGH_JSX_TAGS.has(parentTag)) return "HIGH";
    if (MEDIUM_JSX_TAGS.has(parentTag)) return "MEDIUM";
  }
  if (/^(Click|Submit|Sign|Log|Get Started|Buy|Add|Remove|Delete|Cancel|Save|Continue|Next|Back|Start|Learn|Try|Join)/i.test(text)) {
    return "CRITICAL";
  }
  return "MEDIUM";
}

function isInsideTCall(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isCallExpression(current)) {
      const expr = current.expression;
      if (ts.isIdentifier(expr) && expr.text === "t") return true;
      if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.name) && expr.name.text === "t") return true;
    }
    if (ts.isJsxExpression(current)) break;
    if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current)) break;
    current = current.parent;
  }
  return false;
}

function isInsideConsoleLog(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isCallExpression(current)) {
      const expr = current.expression;
      if (
        ts.isPropertyAccessExpression(expr) &&
        ts.isIdentifier(expr.expression) &&
        expr.expression.text === "console"
      ) {
        return true;
      }
    }
    current = current.parent;
  }
  return false;
}

function isInsideImportOrType(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isImportDeclaration(current)) return true;
    if (ts.isTypeAliasDeclaration(current)) return true;
    if (ts.isInterfaceDeclaration(current)) return true;
    if (ts.isEnumDeclaration(current)) return true;
    if (ts.isTypeReferenceNode(current)) return true;
    if (ts.isTypeLiteralNode(current)) return true;
    current = current.parent;
  }
  return false;
}

function isObjectPropertyKey(node: ts.Node): boolean {
  if (node.parent && ts.isPropertyAssignment(node.parent)) {
    return node.parent.name === node;
  }
  return false;
}

function isInsideObjectLiteralNotInJSX(node: ts.Node): boolean {
  let current = node.parent;
  let foundObject = false;
  while (current) {
    if (ts.isObjectLiteralExpression(current)) foundObject = true;
    if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current) || ts.isJsxExpression(current)) {
      return false;
    }
    if (ts.isJsxAttribute(current)) return false;
    current = current.parent;
  }
  return foundObject;
}

function isVariableDeclarationName(node: ts.Node): boolean {
  if (node.parent && ts.isVariableDeclaration(node.parent)) {
    return node.parent.name === node;
  }
  return false;
}

function isPartOfStructuredData(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isPropertyAssignment(current) && ts.isIdentifier(current.name)) {
      const name = current.name.text;
      if (name === "@context" || name === "@type" || name === "structuredData" || name === "additionalStructuredData") {
        return true;
      }
    }
    if (ts.isCallExpression(current)) {
      const expr = current.expression;
      if (ts.isIdentifier(expr) && (expr.text === "fetch" || expr.text === "require")) return true;
    }
    current = current.parent;
  }
  return false;
}

function isInSEOComponent(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isJsxElement(current)) {
      const tagName = current.openingElement.tagName;
      if (ts.isIdentifier(tagName) && tagName.text === "SEO") return true;
    }
    if (ts.isJsxSelfClosingElement(current)) {
      const tagName = current.tagName;
      if (ts.isIdentifier(tagName) && tagName.text === "SEO") return true;
    }
    current = current.parent;
  }
  return false;
}

function isInLazyImport(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isCallExpression(current)) {
      const expr = current.expression;
      if (ts.isIdentifier(expr) && (expr.text === "lazy" || expr.text === "import")) return true;
      if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.name) && expr.name.text === "then") return true;
    }
    current = current.parent;
  }
  return false;
}

function getJsxAttributeName(node: ts.Node): string | undefined {
  let current = node.parent;
  while (current) {
    if (ts.isJsxAttribute(current)) {
      if (ts.isIdentifier(current.name)) return current.name.text;
    }
    if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current)) break;
    current = current.parent;
  }
  return undefined;
}

function isInJsxContext(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current) || ts.isJsxAttribute(current) || ts.isJsxExpression(current)) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

function isJsxTextNode(node: ts.Node): node is ts.JsxText {
  return node.kind === ts.SyntaxKind.JsxText;
}

function isInsideErrorBoundary(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isClassDeclaration(current) && current.name && current.name.text === "ErrorBoundary") {
      return true;
    }
    current = current.parent;
  }
  return false;
}

function isInsideStyleProp(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isJsxAttribute(current) && ts.isIdentifier(current.name) && current.name.text === "style") {
      return true;
    }
    if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current)) break;
    current = current.parent;
  }
  return false;
}

function isInsideTechnicalAttribute(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ts.isJsxAttribute(current) && ts.isIdentifier(current.name)) {
      if (TECHNICAL_ATTR_NAMES.has(current.name.text)) return true;
    }
    if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current)) break;
    current = current.parent;
  }
  return false;
}

function scanFileAST(filePath: string, sourceFile: ts.SourceFile): Violation[] {
  const violations: Violation[] = [];

  function visit(node: ts.Node) {
    if (isJsxTextNode(node)) {
      const text = node.text.trim();
      if (text && !isNonTextContent(text) && !isInsideTCall(node) && !isInsideErrorBoundary(node)) {
        const parentTag = getJsxTagName(node);
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const severity = classifySeverity(text, parentTag);
        const lineText = sourceFile.text.split("\n")[line]?.trim() || "";
        violations.push({
          file: filePath,
          line: line + 1,
          column: character + 1,
          text,
          severity,
          context: lineText.substring(0, 150),
          suggestion: generateSuggestion(text, parentTag),
        });
      }
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const text = node.text.trim();
      if (
        text &&
        !isNonTextContent(text) &&
        !isInsideTCall(node) &&
        !isInsideImportOrType(node) &&
        !isObjectPropertyKey(node) &&
        !isVariableDeclarationName(node) &&
        !isInLazyImport(node) &&
        !isPartOfStructuredData(node) &&
        !isInsideStyleProp(node) &&
        !isInsideErrorBoundary(node)
      ) {
        if (isInsideConsoleLog(node)) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          const lineText = sourceFile.text.split("\n")[line]?.trim() || "";
          violations.push({
            file: filePath,
            line: line + 1,
            column: character + 1,
            text,
            severity: "LOW",
            context: lineText.substring(0, 150),
            suggestion: generateSuggestion(text),
          });
          ts.forEachChild(node, visit);
          return;
        }

        const attrName = getJsxAttributeName(node);

        if (attrName) {
          if (TECHNICAL_ATTR_NAMES.has(attrName)) {
            ts.forEachChild(node, visit);
            return;
          }
          if (USER_FACING_ATTR_NAMES.has(attrName)) {
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            const severity = classifySeverity(text, undefined, attrName);
            const lineText = sourceFile.text.split("\n")[line]?.trim() || "";
            const parentTag = getJsxTagName(node);
            violations.push({
              file: filePath,
              line: line + 1,
              column: character + 1,
              text,
              severity,
              context: lineText.substring(0, 150),
              suggestion: generateSuggestion(text, parentTag),
            });
          }
        } else if (isInJsxContext(node) && !isInSEOComponent(node) && !isInsideObjectLiteralNotInJSX(node)) {
          const hasLetters = /[a-zA-Z]{2,}/.test(text);
          const looksLikePhrase = /\s/.test(text) || (hasLetters && text.length > 3 && /^[A-Z]/.test(text));
          if (looksLikePhrase) {
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            const parentTag = getJsxTagName(node);
            const severity = classifySeverity(text, parentTag);
            const lineText = sourceFile.text.split("\n")[line]?.trim() || "";
            violations.push({
              file: filePath,
              line: line + 1,
              column: character + 1,
              text,
              severity,
              context: lineText.substring(0, 150),
              suggestion: generateSuggestion(text, parentTag),
            });
          }
        }
      }
    }

    if (ts.isTemplateExpression(node)) {
      const headText = node.head.text.trim();
      if (
        headText &&
        !isNonTextContent(headText) &&
        !isInsideTCall(node) &&
        !isInsideConsoleLog(node) &&
        !isInsideImportOrType(node) &&
        !isPartOfStructuredData(node) &&
        !isInsideStyleProp(node) &&
        !isInsideTechnicalAttribute(node) &&
        isInJsxContext(node) &&
        !isInSEOComponent(node) &&
        !isInsideErrorBoundary(node)
      ) {
        const hasLetters = /[a-zA-Z]{2,}/.test(headText);
        if (hasLetters) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          const parentTag = getJsxTagName(node);
          const severity = classifySeverity(headText, parentTag);
          const lineText = sourceFile.text.split("\n")[line]?.trim() || "";
          violations.push({
            file: filePath,
            line: line + 1,
            column: character + 1,
            text: `\`${headText}...\``,
            severity,
            context: lineText.substring(0, 150),
            suggestion: generateSuggestion(headText, parentTag),
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (IGNORED_DIRECTORIES.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (/\.(tsx|ts)$/.test(entry) && !/\.(test|spec)\.(tsx|ts)$/.test(entry) && !IGNORED_FILES.has(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

function severityColor(s: Severity): string {
  switch (s) {
    case "CRITICAL": return "\x1b[31m";
    case "HIGH": return "\x1b[33m";
    case "MEDIUM": return "\x1b[36m";
    case "LOW": return "\x1b[90m";
  }
}

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

export interface ScanOptions {
  criticalThreshold?: number;
  totalThreshold?: number;
  outputJson?: boolean;
  outputPath?: string;
  scanDir?: string;
  failOnCritical?: boolean;
  quiet?: boolean;
}

export function runI18nScan(options: ScanOptions = {}): boolean {
  const config: ScanConfig = {
    ...DEFAULT_CONFIG,
    ...options,
  };

  const scanDir = path.resolve(process.cwd(), config.scanDir);

  if (!config.quiet) {
    console.log(`${BOLD}🔍 AST Hardcoded String Scanner${RESET}`);
    console.log(`   Scanning: ${scanDir}\n`);
  }

  const files = walkDir(scanDir);

  if (!config.quiet) {
    console.log(`   Found ${files.length} files to scan\n`);
  }

  const allViolations: Violation[] = [];

  for (const filePath of files) {
    const content = readFileSync(filePath, "utf-8");
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const violations = scanFileAST(filePath, sourceFile);
    allViolations.push(...violations);
  }

  const bySeverity: Record<Severity, Violation[]> = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    LOW: [],
  };
  for (const v of allViolations) {
    bySeverity[v.severity].push(v);
  }

  const byFile = new Map<string, Violation[]>();
  for (const v of allViolations) {
    const rel = path.relative(process.cwd(), v.file);
    if (!byFile.has(rel)) byFile.set(rel, []);
    byFile.get(rel)!.push(v);
  }

  if (!config.quiet) {
    console.log(`${BOLD}━━━ Summary ━━━${RESET}`);
    console.log(`   ${severityColor("CRITICAL")}CRITICAL: ${bySeverity.CRITICAL.length}${RESET}`);
    console.log(`   ${severityColor("HIGH")}HIGH:     ${bySeverity.HIGH.length}${RESET}`);
    console.log(`   ${severityColor("MEDIUM")}MEDIUM:   ${bySeverity.MEDIUM.length}${RESET}`);
    console.log(`   ${severityColor("LOW")}LOW:      ${bySeverity.LOW.length}${RESET}`);
    console.log(`   ${BOLD}TOTAL:    ${allViolations.length}${RESET}\n`);

    for (const [file, violations] of byFile) {
      console.log(`${BOLD}📄 ${file}${RESET} (${violations.length} violation${violations.length === 1 ? "" : "s"})`);
      const sorted = violations.sort((a, b) => {
        const order: Record<Severity, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return order[a.severity] - order[b.severity] || a.line - b.line;
      });
      for (const v of sorted) {
        const color = severityColor(v.severity);
        console.log(`   ${color}[${v.severity}]${RESET} Line ${v.line}:${v.column} — "${v.text}"`);
        console.log(`      ${DIM}${v.context}${RESET}`);
        console.log(`      💡 Suggestion: ${v.suggestion}`);
      }
      console.log();
    }
  }

  if (config.outputJson) {
    const report = {
      timestamp: new Date().toISOString(),
      scanDir: config.scanDir,
      totalFiles: files.length,
      summary: {
        critical: bySeverity.CRITICAL.length,
        high: bySeverity.HIGH.length,
        medium: bySeverity.MEDIUM.length,
        low: bySeverity.LOW.length,
        total: allViolations.length,
      },
      violations: allViolations.map((v) => ({
        ...v,
        file: path.relative(process.cwd(), v.file),
      })),
    };
    writeFileSync(config.outputPath, JSON.stringify(report, null, 2));
    if (!config.quiet) {
      console.log(`📋 Full report written to ${config.outputPath}\n`);
    }
  }

  let shouldFail = false;
  if (config.failOnCritical && bySeverity.CRITICAL.length > config.criticalThreshold) {
    if (!config.quiet) {
      console.log(`${severityColor("CRITICAL")}${BOLD}❌ BUILD BLOCKED: ${bySeverity.CRITICAL.length} CRITICAL violation(s) found (threshold: ${config.criticalThreshold})${RESET}`);
    }
    shouldFail = true;
  }
  if (allViolations.length > config.totalThreshold) {
    if (!config.quiet) {
      console.log(`${severityColor("HIGH")}${BOLD}❌ BUILD BLOCKED: ${allViolations.length} total violation(s) exceed threshold of ${config.totalThreshold}${RESET}`);
    }
    shouldFail = true;
  }

  if (shouldFail) {
    if (!config.quiet) {
      console.log(`\n${BOLD}Wrap user-facing strings with t() from the useI18n() hook.${RESET}`);
      console.log(`Example: <button>{t("action.submit")}</button>\n`);
    }
    return false;
  }

  if (!config.quiet) {
    if (allViolations.length > 0) {
      console.log(`${DIM}⚠  ${allViolations.length} violation(s) found but below blocking threshold.${RESET}`);
      console.log(`${DIM}   Wrap user-facing strings with t() from the useI18n() hook.${RESET}\n`);
    } else {
      console.log(`${BOLD}✅ No hardcoded string violations found!${RESET}\n`);
    }
  }

  return true;
}
