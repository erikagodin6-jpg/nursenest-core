#!/usr/bin/env node
/**
 * Build-time guardrails: pathway-scoped catalog slices must not contain forbidden cross-country exam terms.
 * Scope is by JSON slice (start key → end key), not repo-wide grep.
 *
 * Documented exceptions: if a line contains a forbidden match but also contains one of these substrings, skip.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "src/content/pathway-lessons/catalog.json");

/** @type {{ ruleId: string, lineIncludes: string }[]} */
const DOCUMENTED_EXCEPTIONS = [
  {
    ruleId: "ca-pn-client-needs",
    lineIncludes: "matching client needs with provider competency",
  },
];

function sliceCatalog(text, startKey, endKey) {
  const start = text.indexOf(`"${startKey}":`);
  const end = text.indexOf(`"${endKey}":`, start + 1);
  if (start === -1) throw new Error(`Start key ${startKey} not found`);
  if (end === -1) throw new Error(`End key ${endKey} not found after ${startKey}`);
  return { segment: text.slice(start, end), segmentStart: start };
}

/**
 * @param {string} fullText
 * @param {number} segmentStart
 * @param {string} segment
 * @param {RegExp} re
 * @returns {{ line: number, col: number, match: string, lineText: string }[]}
 */
function findMatchesWithLines(fullText, segmentStart, segment, re) {
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  const r = new RegExp(re.source, flags);
  const out = [];
  let m;
  while ((m = r.exec(segment)) !== null) {
    const abs = segmentStart + m.index;
    const line = fullText.slice(0, abs).split("\n").length;
    const lineStart = fullText.lastIndexOf("\n", abs - 1) + 1;
    const lineEnd = fullText.indexOf("\n", abs);
    const lineText = fullText.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
    const col = abs - lineStart + 1;
    out.push({ line, col, match: m[0], lineText: lineText.slice(0, 200) });
  }
  return out;
}

function isExcepted(ruleId, lineText) {
  return DOCUMENTED_EXCEPTIONS.some((x) => x.ruleId === ruleId && lineText.includes(x.lineIncludes));
}

/** @type {{ id: string, name: string, slice: [string, string], forbidden: RegExp[] }[]} */
const rules = [
  {
    id: "ca-pn-nclex-pn",
    name: "Canada REx-PN slice must not frame US NCLEX-PN as the learner exam",
    slice: ["ca-rpn-rex-pn", "us-rn-nclex-rn"],
    forbidden: [/\bNCLEX-PN\b/i, /\bNCLEX_PN\b/i],
  },
  {
    id: "ca-pn-uap",
    name: "Canada REx-PN slice must not use US-style UAP labeling",
    slice: ["ca-rpn-rex-pn", "us-rn-nclex-rn"],
    forbidden: [/\bUAP\b/i],
  },
  {
    id: "ca-pn-lvn",
    name: "Canada REx-PN slice must not use US LVN labeling",
    slice: ["ca-rpn-rex-pn", "us-rn-nclex-rn"],
    forbidden: [/\bLVN\b/i],
  },
  {
    id: "ca-pn-state-board",
    name: "Canada REx-PN slice must not use US state board phrasing",
    slice: ["ca-rpn-rex-pn", "us-rn-nclex-rn"],
    forbidden: [/\bstate board\b/i],
  },
  {
    id: "ca-pn-client-needs",
    name: "Canada REx-PN slice: avoid US-centric “client needs” exam framing (review if matched)",
    slice: ["ca-rpn-rex-pn", "us-rn-nclex-rn"],
    forbidden: [/\bclient needs\b/i],
  },
  {
    id: "us-pn-rex-pn",
    name: "US NCLEX-PN slice must not reference Canadian REx-PN as the learner exam",
    slice: ["us-lpn-nclex-pn", "us-np-fnp"],
    forbidden: [/\bREx-PN\b/i, /\bREX_PN\b/i],
  },
  {
    id: "us-rn-rex-pn",
    name: "US RN slice must not reference Canadian REx-PN exam naming",
    slice: ["us-rn-nclex-rn", "us-lpn-nclex-pn"],
    forbidden: [/\bREx-PN\b/i, /\bREX_PN\b/i],
  },
];

function main() {
  const text = fs.readFileSync(catalogPath, "utf8");
  const failures = [];

  for (const rule of rules) {
    const [a, b] = rule.slice;
    let segment;
    let segmentStart;
    try {
      const s = sliceCatalog(text, a, b);
      segment = s.segment;
      segmentStart = s.segmentStart;
    } catch (e) {
      failures.push(`${rule.name} (${rule.id}): ${e.message}`);
      continue;
    }
    for (const re of rule.forbidden) {
      const hits = findMatchesWithLines(text, segmentStart, segment, re);
      for (const h of hits) {
        if (isExcepted(rule.id, h.lineText)) continue;
        failures.push(
          `${rule.name} (${rule.id}): matched ${JSON.stringify(h.match)} at ${path.relative(root, catalogPath)}:${h.line}:${h.col} — ${h.lineText}`,
        );
      }
    }
  }

  if (failures.length) {
    console.error("validate-exam-content-guardrails: FAILED\n", failures.join("\n"));
    process.exit(1);
  }
  console.log("validate-exam-content-guardrails: OK");
}

main();
