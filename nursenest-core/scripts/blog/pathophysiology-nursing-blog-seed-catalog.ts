/**
 * Deterministic long-tail pathophysiology topics for nursing exam prep (NCLEX-style framing).
 * Consumed only by `import-pathophysiology-nursing-blog-seeds.mts` — not bundled in the Next app.
 */

export type PathophysiologySeedTopic = {
  slug: string;
  title: string;
  keyword: string;
  system: string;
  condition: string;
  mechanism: string;
};

const SYSTEMS = [
  "cardiovascular",
  "respiratory",
  "renal and fluid",
  "neurological",
  "endocrine and metabolic",
  "gastrointestinal",
  "hematologic",
  "immune and infectious",
  "musculoskeletal",
  "integumentary",
  "reproductive and obstetric",
  "multisystem critical care",
] as const;

const CONDITIONS = [
  "heart failure",
  "hypertensive crisis",
  "hypovolemic shock",
  "septic shock",
  "COPD exacerbation",
  "asthma attack",
  "acute respiratory failure",
  "diabetic ketoacidosis",
  "hyperosmolar hyperglycemic state",
  "acute kidney injury",
  "chronic kidney disease progression",
  "ischemic stroke",
  "hemorrhagic stroke",
  "iron deficiency anemia",
  "sickle cell crisis",
  "major burns",
  "pressure injury",
  "preeclampsia",
  "postpartum hemorrhage",
  "community-acquired pneumonia",
  "aspiration risk",
  "acute pancreatitis",
  "cirrhosis decompensation",
  "pulmonary embolism",
  "deep vein thrombosis",
  "acute coronary syndrome",
  "atrial fibrillation with RVR",
  "hypothyroid myxedema",
  "thyroid storm",
  "adrenal insufficiency",
  "cellulitis",
  "meningitis",
  "Guillain-Barré syndrome",
  "multiple sclerosis exacerbation",
  "rheumatoid arthritis flare",
  "gout flare",
  "acute liver failure",
  "electrolyte emergency",
  "dehydration in older adults",
] as const;

const MECHANISMS = [
  "preload and afterload",
  "tissue oxygen delivery",
  "inflammatory cascade",
  "autonomic imbalance",
  "fluid compartment shifts",
  "electrolyte gradients",
  "neurohormonal compensation",
  "cellular energy failure",
  "microvascular perfusion",
  "coagulation balance",
  "immunoregulation",
  "ventilation-perfusion matching",
  "acid-base buffering",
  "renal sodium handling",
  "baroreceptor reflex",
] as const;

function slugifyPart(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 28);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Enumerates up to `limit` unique slugs (default 500) from the Cartesian product with collision handling.
 */
export function enumeratePathophysiologySeeds(limit = 500): PathophysiologySeedTopic[] {
  const out: PathophysiologySeedTopic[] = [];
  const seen = new Set<string>();
  outer: for (const system of SYSTEMS) {
    for (const condition of CONDITIONS) {
      for (const mechanism of MECHANISMS) {
        if (out.length >= limit) break outer;
        let slug = `pp-${slugifyPart(system)}-${slugifyPart(condition)}-${slugifyPart(mechanism)}`;
        if (slug.length > 115) slug = slug.slice(0, 115).replace(/-+$/g, "");
        let unique = slug;
        let n = 0;
        while (seen.has(unique)) {
          n += 1;
          unique = `${slug}-x${n}`.slice(0, 120);
        }
        seen.add(unique);
        const title = `${condition}: ${mechanism} — pathophysiology for ${system} nursing care`;
        const keyword = `${condition} pathophysiology nursing`;
        out.push({
          slug: unique,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          keyword,
          system,
          condition,
          mechanism,
        });
      }
    }
  }
  return out;
}

export function excerptFromBody(html: string): string {
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.slice(0, 280) + (plain.length > 280 ? "…" : "");
}

export function buildPathophysiologyBlogBody(topic: PathophysiologySeedTopic): string {
  const sys = esc(topic.system);
  const cond = esc(topic.condition);
  const mech = esc(topic.mechanism);
  const kw = esc(topic.keyword);
  const lessons = `<a href="/canada/rn/nclex-rn/lessons">NCLEX-RN lessons</a>`;
  const bank = `<a href="/question-bank">question bank</a>`;
  const blog = `<a href="/blog">exam prep blog</a>`;

  const disclaimer = `<p><strong>Educational use only.</strong> This article explains exam-style pathophysiology patterns for nursing students. It is not individualized medical advice, diagnosis, or treatment. Always follow local protocols and scope of practice.</p>`;

  const core = `<h2>Pathophysiology snapshot</h2><p>We frame <strong>${cond}</strong> within <strong>${sys}</strong> physiology, emphasizing <strong>${mech}</strong> as the lever that changes assessments, monitoring priorities, and safe interventions on exams.</p>`;

  const stem = `<h2>How NCLEX-style items test this</h2><ul><li>Cause-and-effect chains: what worsens first, and what compensates.</li><li>Red-flag data that should change your priority hypothesis.</li><li>Interventions tied to the mechanism (not memorised tricks alone).</li></ul><p>Keyword focus: ${kw}.</p>`;

  const nursing = `<h2>Nursing assessment anchors</h2><ul><li>Vital trends and work of breathing when relevant.</li><li>Perfusion, mentation, and urine output as whole-patient signals.</li><li>Escalation thresholds that match the mechanism you suspect.</li></ul>`;

  const study = `<h2>Study with structure</h2><p>Pair this reading with ${lessons}, then apply the mechanism in ${bank} items. Browse more ${blog} for long-tail topics.</p>`;

  return `${disclaimer}${core}${stem}${nursing}${study}`;
}
