import { contentMap } from "../client/src/data/lessons/index";

const results: { slug: string; title: string; issue: string; severity: string }[] = [];

function extractKeyTerms(title: string): string[] {
  const lower = title.toLowerCase()
    .replace(/\(rpn\/lvn\)/g, "")
    .replace(/\(rpn\)/g, "")
    .replace(/rpn/g, "")
    .replace(/basics/g, "")
    .replace(/nursing/g, "")
    .replace(/management/g, "")
    .replace(/assessment/g, "")
    .replace(/overview/g, "")
    .replace(/advanced/g, "")
    .replace(/clinical/g, "")
    .replace(/patient/g, "")
    .replace(/care/g, "")
    .replace(/&/g, "and")
    .trim();
  const words = lower.split(/[\s:,\-\/]+/).filter(w => w.length > 3);
  return words;
}

function checkContentMatch(slug: string, lesson: any): string[] {
  const issues: string[] = [];
  const title = (lesson.title || "").toLowerCase();
  const cellular = (lesson.cellular?.content || "").toLowerCase();
  const cellularTitle = (lesson.cellular?.title || "").toLowerCase();
  if (!cellular || cellular.length < 50) return [];

  const contentTopicWords: Record<string, string[]> = {
    "cystic fibrosis": ["cystic fibrosis", "cftr", "sweat chloride", "cf transmembrane"],
    "metered dose inhaler": ["metered dose inhaler", "mdi technique", "spacer device", "press the canister"],
    "diabetes mellitus": ["insulin resistance", "pancreatic beta cell", "hemoglobin a1c", "diabetic ketoacidosis"],
    "copd": ["chronic obstructive pulmonary", "emphysema", "chronic bronchitis", "fev1/fvc"],
    "heart failure": ["ventricular failure", "ejection fraction", "bnp level", "cardiac remodeling"],
    "stroke": ["cerebrovascular accident", "thrombolytic therapy", "ischemic stroke", "hemorrhagic stroke"],
    "asthma": ["bronchospasm", "peak expiratory flow", "leukotriene", "inhaled corticosteroid"],
    "pneumonia": ["alveolar consolidation", "pneumococcal", "community-acquired pneumonia", "sputum culture"],
    "renal failure": ["glomerular filtration", "creatinine clearance", "uremic", "dialysis"],
    "liver cirrhosis": ["hepatic fibrosis", "portal hypertension", "ascites", "hepatic encephalopathy"],
    "seizure": ["epileptiform", "tonic-clonic", "anticonvulsant", "seizure threshold"],
    "tuberculosis": ["mycobacterium tuberculosis", "acid-fast bacilli", "mantoux test", "isoniazid"],
  };

  for (const [topic, markers] of Object.entries(contentTopicWords)) {
    const topicWords = topic.split(" ");
    if (topicWords.some(tw => tw.length > 3 && title.includes(tw))) continue;
    if (topicWords.some(tw => tw.length > 3 && slug.includes(tw))) continue;

    const markerCount = markers.filter(m => cellular.includes(m)).length;
    if (markerCount >= 2) {
      const first500 = cellular.substring(0, 500);
      const mainTopicMarkers = markers.filter(m => first500.includes(m)).length;
      if (mainTopicMarkers >= 2) {
        issues.push(`Content intro discusses "${topic}" (${markerCount} markers, ${mainTopicMarkers} in intro) — title is "${lesson.title}"`);
      }
    }
  }
  return issues;
}

const contentHashes = new Map<string, string[]>();
let rpnCount = 0;
let issueCount = 0;

for (const [slug, lesson] of Object.entries(contentMap)) {
  if (!slug.endsWith("-rpn") && !slug.includes("-basics-rpn")) continue;
  rpnCount++;

  const cellular = (lesson as any).cellular?.content || "";
  if (!cellular || cellular.length < 50) continue;

  const hash = cellular.substring(0, 300).trim();
  if (!contentHashes.has(hash)) contentHashes.set(hash, []);
  contentHashes.get(hash)!.push(slug);

  const issues = checkContentMatch(slug, lesson);
  for (const issue of issues) {
    issueCount++;
    results.push({ slug, title: (lesson as any).title || slug, issue, severity: "HIGH" });
  }
}

// Duplicate content check
for (const [hash, slugs] of contentHashes.entries()) {
  if (slugs.length > 1) {
    // Check if these are legitimately shared (fallback from base lesson)
    const baseSlugs = slugs.map(s => s.replace(/-rpn$/, "").replace(/-basics-rpn$/, ""));
    const uniqueBases = new Set(baseSlugs);
    if (uniqueBases.size === slugs.length) continue; // Different bases = just fallback
    
    for (const slug of slugs) {
      const lesson = (contentMap as any)[slug];
      issueCount++;
      results.push({
        slug,
        title: lesson?.title || slug,
        issue: `Exact duplicate content (first 300 chars) shared with: ${slugs.filter(s => s !== slug).join(", ")}`,
        severity: "HIGH"
      });
    }
  }
}

results.sort((a, b) => a.slug.localeCompare(b.slug));

console.log(`\n=== RPN CONTENT AUDIT ===`);
console.log(`Total RPN lessons scanned: ${rpnCount}`);
console.log(`Issues found: ${results.length}\n`);

if (results.length === 0) {
  console.log("ALL CLEAR — No content mismatches detected across all RPN lessons.");
} else {
  for (const r of results) {
    console.log(`[${r.severity}] ${r.slug}`);
    console.log(`  Title: ${r.title}`);
    console.log(`  Issue: ${r.issue}\n`);
  }
}
