import fs from 'fs';
import path from 'path';

const SAFE_PATTERNS = [
  /^[\s]*$/,
  /^\d+(\.\d+)?$/,
  /^[{}()\[\]<>\/\\|:;,.!?@#$%^&*+=~`'"_-]+$/,
  /^https?:\/\//,
  /^mailto:/,
  /^#[a-fA-F0-9]{3,8}$/,
  /^(px|em|rem|vh|vw|%|ms|s|fr|auto|none|inherit|block|flex|grid|inline|absolute|relative|fixed|sticky|center|left|right|top|bottom|start|end|space-between|space-around|column|row|wrap|nowrap|hidden|visible|scroll|pointer|default|normal|bold|italic|underline|uppercase|lowercase|capitalize)$/i,
  /^(div|span|p|a|h[1-6]|img|button|input|form|ul|ol|li|table|tr|td|th|thead|tbody|svg|path|circle|rect|g|defs|stop|linearGradient|radialGradient|clipPath|mask|use|symbol|text|tspan|foreignObject|animate|animateTransform)$/,
  /^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/,
  /^(true|false|null|undefined)$/,
  /^(sm|md|lg|xl|2xl|xs)$/,
  /^[a-z]+(-[a-z]+)*$/,
  /^(className|onClick|onChange|onSubmit|onBlur|onFocus|onKeyDown|onKeyUp|onMouseEnter|onMouseLeave|type|name|id|role|aria-|htmlFor|tabIndex|placeholder|value|defaultValue|checked|disabled|required|readOnly|autoFocus|autoComplete|method|action|target|rel|href|src|alt|width|height|fill|stroke|viewBox|xmlns|d|cx|cy|r|rx|ry|x|y|x1|y1|x2|y2|offset|stopColor|gradientUnits|clipRule|fillRule|strokeWidth|strokeLinecap|strokeLinejoin)$/,
];

const SAFE_CONTENT_PATTERNS = [
  /^\s*$/,
  /^[{}()\[\]<>\/\\|:;,.!?@#$%^&*+=~`'"_-\s]+$/,
  /^\d+(\.\d+)?(%|px|em|rem|vh|vw)?$/,
  /^&[a-z]+;$/,
  /^&#\d+;$/,
  /^\{.*\}$/,
  /^\.{2,3}$/,
  /^[•·–—→←↑↓|×÷±≤≥≠∞√∑∏∫]+$/,
  /^(\/[a-z0-9\-\/]*)?$/i,
];

const IGNORE_DIRS = new Set([
  'node_modules', 'dist', '.git', 'scripts', 'server',
  'data', 'generated', 'seed-data', '__tests__', '__mocks__',
]);

const IGNORE_FILES = new Set([
  'i18n.tsx', 'i18n-translations.ts', 'i18n-types.ts',
  'locale-utils.ts', 'theme.ts', 'constants.ts',
]);

function shouldIgnoreFile(filePath) {
  const parts = filePath.split(path.sep);
  for (const part of parts) {
    if (IGNORE_DIRS.has(part)) return true;
  }
  const base = path.basename(filePath);
  if (IGNORE_FILES.has(base)) return true;
  if (base.startsWith('i18n-') && base.endsWith('.ts')) return true;
  return false;
}

function isSafeString(str) {
  const trimmed = str.trim();
  if (trimmed.length === 0) return true;
  if (trimmed.length <= 1) return true;
  for (const pattern of SAFE_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }
  return false;
}

function isSafeContent(str) {
  const trimmed = str.trim();
  if (trimmed.length === 0) return true;
  if (trimmed.length <= 1) return true;
  for (const pattern of SAFE_CONTENT_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }
  if (/^[^a-zA-Z]*$/.test(trimmed)) return true;
  return false;
}

function findTsxFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        results.push(...findTsxFiles(fullPath));
      }
    } else if (entry.name.endsWith('.tsx') && !shouldIgnoreFile(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (/^\s*(\/\/|\/\*|\*)/.test(line)) continue;
    if (/^\s*import\s/.test(line)) continue;
    if (/^\s*export\s+(type|interface|const|function|default)\s/.test(line)) continue;

    const jsxTextRegex = />([^<>{}`]+)</g;
    let match;
    while ((match = jsxTextRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (text.length < 2) continue;
      if (isSafeContent(text)) continue;
      if (/\bt\(/.test(line)) continue;
      if (/\{t\(/.test(line)) continue;
      if (/data-testid/.test(line)) continue;

      if (/^[A-Z][a-z]/.test(text) && text.length >= 3 && /[a-z]/.test(text)) {
        violations.push({
          file: filePath,
          line: lineNum,
          text: text.substring(0, 80),
          type: 'jsx-text',
        });
      }
    }

    const stringPropRegex = /(?:title|label|placeholder|alt|aria-label|description|message|header|heading|subtitle|tooltip)=["']([^"'{}]+)["']/g;
    while ((match = stringPropRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (text.length < 3) continue;
      if (isSafeString(text)) continue;
      if (/\bt\(/.test(match[0])) continue;
      if (/data-testid/.test(match[0])) continue;

      if (/[A-Za-z]{3,}/.test(text)) {
        violations.push({
          file: filePath,
          line: lineNum,
          text: text.substring(0, 80),
          type: 'string-prop',
        });
      }
    }
  }

  return violations;
}

const args = process.argv.slice(2);
const enforce = args.includes('--enforce');
const warnOnly = args.includes('--warn');

const clientDir = path.resolve('client/src');
if (!fs.existsSync(clientDir)) {
  console.error('ERROR: client/src directory not found');
  process.exit(1);
}

console.log('\n=== Hardcoded String Scanner ===');
const tsxFiles = findTsxFiles(clientDir);
console.log(`Scanning ${tsxFiles.length} .tsx files...\n`);

let allViolations = [];
for (const file of tsxFiles) {
  const violations = scanFile(file);
  allViolations.push(...violations);
}

if (allViolations.length === 0) {
  console.log('✓ No hardcoded strings detected in React components.');
} else {
  console.log(`Found ${allViolations.length} potential hardcoded string(s):\n`);
  const byFile = {};
  for (const v of allViolations) {
    const rel = path.relative(process.cwd(), v.file);
    if (!byFile[rel]) byFile[rel] = [];
    byFile[rel].push(v);
  }
  for (const [file, violations] of Object.entries(byFile)) {
    console.log(`  ${file}:`);
    for (const v of violations.slice(0, 5)) {
      console.log(`    L${v.line} [${v.type}]: "${v.text}"`);
    }
    if (violations.length > 5) {
      console.log(`    ... and ${violations.length - 5} more`);
    }
  }
}

const reportPath = path.resolve('scripts/hardcoded-strings-report.json');
fs.writeFileSync(reportPath, JSON.stringify(allViolations, null, 2));
console.log(`\nReport saved to: ${reportPath}`);

if (enforce && allViolations.length > 0) {
  console.error(`\n=== HARDCODED STRING SCAN FAILED ===`);
  console.error(`${allViolations.length} hardcoded string(s) found in React components.`);
  console.error(`All user-visible text must use the t() translation function.`);
  process.exit(1);
}

if (warnOnly && allViolations.length > 0) {
  console.warn(`\nWARN: ${allViolations.length} potential hardcoded string(s) found (non-blocking).`);
}
