#!/usr/bin/env node
/**
 * Generate batch-02/{locale}/{01-05}.md from English masters.
 * - Keeps every ## heading line exactly as English (validator).
 * - Copies ## References (APA 7) block verbatim from EN (APA titles stay English).
 * - Translates # title and section bodies; FAQ preserves **Q:** / **A:** markers.
 *
 * Run: node scripts/blog-pipeline/translate-batch02-locales.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const BATCH = path.join(ROOT, "data/blog-pipeline/batch-02");
const EN = path.join(BATCH, "en");

const TARGETS = {
  fr: "fr",
  es: "es",
  pt: "pt",
  tl: "tl",
  ar: "ar",
  hi: "hi",
  zh: "zh-CN",
  pa: "pa",
  vi: "vi",
  ur: "ur",
  ko: "ko",
  ja: "ja",
  de: "de",
  it: "it",
};

const FILES = ["01", "02", "03", "04", "05"];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function googleTranslate(text, tl) {
  if (!text.trim()) return text;
  const maxChunk = 4500;
  const parts = [];
  for (let i = 0; i < text.length; i += maxChunk) {
    const chunk = text.slice(i, i + maxChunk);
    const params = new URLSearchParams({
      client: "gtx",
      sl: "en",
      tl,
      dt: "t",
      q: chunk,
    });
    const url = "https://translate.googleapis.com/translate_a/single?" + params.toString();
    const res = await fetch(url);
    if (!res.ok) throw new Error(`translate HTTP ${res.status} ${tl}`);
    const data = await res.json();
    let out = "";
    if (Array.isArray(data[0])) {
      for (const seg of data[0]) {
        if (seg && seg[0]) out += seg[0];
      }
    }
    parts.push(out || chunk);
    await sleep(100);
  }
  return parts.join("");
}

function extractReferencesBlock(md) {
  const m = md.match(/## References \(APA 7\)[\s\S]*/);
  return m ? m[0].trimEnd() : "";
}

function stripReferences(md) {
  return md.replace(/## References \(APA 7\)[\s\S]*/, "").trimEnd();
}

/** Split markdown (after title line) into { heading: '## X', content: string }[] */
function splitSections(rest) {
  const lines = rest.split("\n");
  const sections = [];
  let cur = null;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (cur) sections.push(cur);
      cur = { heading: line, content: [] };
    } else if (cur) {
      cur.content.push(line);
    }
  }
  if (cur) sections.push(cur);
  return sections.map((s) => ({
    heading: s.heading,
    content: s.content.join("\n").replace(/^\n+/, "").replace(/\n+$/, ""),
  }));
}

async function translateFaqBody(body, tl) {
  const re =
    /\*\*Q:\*\*\s*([^\n]+)\n+\*\*A:\*\*\s*([^\n]+(?:\n(?!\*\*Q:\*\*)[^\n]+)*)/g;
  const pieces = [];
  let last = 0;
  let m;
  while ((m = re.exec(body)) !== null) {
    pieces.push(body.slice(last, m.index));
    const tq = (await googleTranslate(m[1].trim(), tl)).trim();
    await sleep(80);
    const ta = (await googleTranslate(m[2].trim(), tl)).trim();
    await sleep(80);
    pieces.push(`**Q:** ${tq}\n\n**A:** ${ta}`);
    last = re.lastIndex;
  }
  pieces.push(body.slice(last));
  return pieces.join("");
}

async function translateOneSection(heading, content, tl) {
  if (heading.trim() === "## FAQ") {
    return await translateFaqBody(content, tl);
  }
  return (await googleTranslate(content, tl)).trimEnd();
}

async function translateFile(idx, locale, tlCode) {
  const srcPath = path.join(EN, `${idx}.md`);
  const outDir = path.join(BATCH, locale);
  fs.mkdirSync(outDir, { recursive: true });
  const raw = fs.readFileSync(srcPath, "utf8");
  const refs = extractReferencesBlock(raw);
  if (!refs) throw new Error(`Missing References block in en/${idx}.md`);

  const withoutRefs = stripReferences(raw);
  const lines = withoutRefs.split("\n");
  const titleLine = lines[0]?.startsWith("# ") ? lines[0] : "";
  const rest = lines.slice(1).join("\n");
  const titlePlain = titleLine.replace(/^#\s+/, "").trim();
  const translatedTitle = (await googleTranslate(titlePlain, tlCode)).trim();
  await sleep(80);

  const sections = splitSections(rest);
  const outParts = [`# ${translatedTitle}`, ""];
  for (const sec of sections) {
    outParts.push(sec.heading);
    outParts.push("");
    const translated = await translateOneSection(sec.heading, sec.content, tlCode);
    outParts.push(translated);
    outParts.push("");
    await sleep(60);
  }
  outParts.push(refs);
  outParts.push("");
  const out = outParts.join("\n").replace(/\n{3,}/g, "\n\n");
  fs.writeFileSync(path.join(outDir, `${idx}.md`), out, "utf8");
  console.log("Wrote", locale, idx);
}

async function main() {
  for (const idx of FILES) {
    for (const [locale, tl] of Object.entries(TARGETS)) {
      await translateFile(idx, locale, tl);
    }
  }
  console.log("Done batch-02 locale generation.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
