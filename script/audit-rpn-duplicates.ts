import { contentMap } from "../client/src/data/lessons/index";

const rpnLessons: { slug: string; title: string; first200: string; cellular: string }[] = [];

for (const [slug, lesson] of Object.entries(contentMap)) {
  if (!slug.endsWith("-rpn") && !slug.includes("-basics-rpn")) continue;
  const cellular = (lesson as any).cellular?.content || "";
  if (!cellular || cellular.length < 50) continue;
  rpnLessons.push({
    slug,
    title: (lesson as any).title || slug,
    first200: cellular.substring(0, 200).trim(),
    cellular
  });
}

console.log(`Total RPN lessons with content: ${rpnLessons.length}`);

// Check for lessons with identical first 200 chars (excluding legitimate tier fallbacks)
const groupedByContent = new Map<string, typeof rpnLessons>();
for (const l of rpnLessons) {
  const key = l.first200;
  if (!groupedByContent.has(key)) groupedByContent.set(key, []);
  groupedByContent.get(key)!.push(l);
}

let dupeGroups = 0;
for (const [content, lessons] of groupedByContent.entries()) {
  if (lessons.length <= 1) continue;
  
  // Check if these are different slugs with the same base (legitimate fallback)
  const bases = lessons.map(l => l.slug.replace(/-basics-rpn$/, "").replace(/-rpn$/, ""));
  const uniqueBases = new Set(bases);
  
  // If all share the same base, it's just a fallback - skip
  if (uniqueBases.size === 1) continue;
  
  dupeGroups++;
  console.log(`\nDUPLICATE GROUP #${dupeGroups}:`);
  for (const l of lessons) {
    console.log(`  ${l.slug} — "${l.title}"`);
  }
  console.log(`  Content starts: "${content.substring(0, 100)}..."`);
}

if (dupeGroups === 0) {
  console.log("\nNO DUPLICATE CONTENT DETECTED across RPN lessons (excluding legitimate tier fallbacks).");
}

// Also check: are any RPN lessons showing content from a totally different slug?
console.log("\n--- Cross-checking title vs content topic ---");
let crossIssues = 0;

for (const l of rpnLessons) {
  const titleLower = l.title.toLowerCase();
  const contentLower = l.cellular.toLowerCase();
  const first300 = contentLower.substring(0, 300);
  
  // Extract the main noun from the title (first significant word)
  const titleWords = titleLower
    .replace(/\(.*?\)/g, "")
    .replace(/basics|nursing|overview|management|assessment|rpn|lvn|advanced|clinical|patient|care|&|and|the|for|of|in|with|to|a|an/gi, "")
    .trim()
    .split(/[\s:,\-\/]+/)
    .filter(w => w.length > 3);
  
  if (titleWords.length === 0) continue;
  
  // Check if AT LEAST ONE significant title word appears in the first 300 chars
  const found = titleWords.some(tw => first300.includes(tw));
  if (!found) {
    crossIssues++;
    console.log(`\n[MISMATCH?] ${l.slug}`);
    console.log(`  Title: "${l.title}"`);
    console.log(`  Title keywords: [${titleWords.join(", ")}]`);
    console.log(`  Content starts: "${l.first200.substring(0, 150)}..."`);
  }
}

if (crossIssues === 0) {
  console.log("ALL CLEAR — Every RPN lesson's content intro matches its title topic.");
}

console.log(`\n=== AUDIT COMPLETE ===`);
