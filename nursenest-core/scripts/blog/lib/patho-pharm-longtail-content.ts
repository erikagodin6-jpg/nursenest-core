import type { LongTailTopic } from "./patho-pharm-longtail-topic-catalog";

export const UNSAFE_HTML = /<\s*script\b|<\s*iframe\b|javascript:\s*|on\w+\s*=/i;

const PLACEHOLDER = /\[(insert|todo|tbd|fixme|placeholder)|\bTBD\b|\bFIXME\b|\bXXX\b|Lorem ipsum|as an AI language model|I'm an AI\b/gi;

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function wordCountFromHtml(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ");
  return plain.split(/\s+/).filter(Boolean).length;
}

export function countH2(html: string): number {
  return (html.match(/<h2\b/gi) ?? []).length;
}

export function buildConservativeApaReferences(accessDate: string): string[] {
  return [
    `Centers for Disease Control and Prevention. (2024). CDC health topics A–Z index. Retrieved ${accessDate}, from https://www.cdc.gov/az/a.html`,
    `World Health Organization. (2024). WHO health topics. Retrieved ${accessDate}, from https://www.who.int/health-topics`,
    `National Library of Medicine. (2024). MedlinePlus: trusted consumer health information. Retrieved ${accessDate}, from https://medlineplus.gov/`,
    `National Institutes of Health. (2024). NCBI Bookshelf (StatPearls and other books). Retrieved ${accessDate}, from https://www.ncbi.nlm.nih.gov/books`,
    `U.S. Food and Drug Administration. (2024). Drugs@FDA and related drug information resources. Retrieved ${accessDate}, from https://www.fda.gov/drugs`,
  ];
}

export function buildSchemaJsonLd(input: {
  title: string;
  slug: string;
  excerpt: string;
  siteBase: string;
  publishedIso: string;
  faqItems: { q: string; a: string }[];
}): Record<string, unknown> {
  const url = `${input.siteBase.replace(/\/$/, "")}/blog/${input.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      headline: input.title,
      description: input.excerpt,
      url,
      datePublished: input.publishedIso,
      inLanguage: "en-US",
      isAccessibleForFree: true,
      articleSection: "Nursing education",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${input.siteBase.replace(/\/$/, "")}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${input.siteBase.replace(/\/$/, "")}/blog` },
        { "@type": "ListItem", position: 3, name: input.title, item: url },
      ],
    },
  ];
  if (input.faqItems.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: input.faqItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function escapeHtmlPlain(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function validatePostContent(html: string, title: string, minBlogLinksRequired: number): string | null {
  if (UNSAFE_HTML.test(html)) return "unsafe_html";
  if (PLACEHOLDER.test(html)) return "placeholder_or_disallowed_phrase";
  const wc = wordCountFromHtml(html);
  if (wc < 900) return `body_under_900_words:${wc}`;
  if (countH2(html) < 5) return "insufficient_h2_sections";
  const low = html.toLowerCase();
  const h1Needle = `<h1>${escapeHtmlPlain(title.trim())}</h1>`;
  if (!html.includes(h1Needle)) return "h1_title_misalignment";
  if (!low.includes("pathophysiology") && !low.includes("pharmacology") && !low.includes("mechanism")) {
    return "missing_mechanism_section";
  }
  if (!low.includes("nursing assessment")) return "missing_nursing_assessment";
  if (!low.includes("nursing intervention") && !low.includes("nursing implications")) {
    return "missing_nursing_interventions_or_implications";
  }
  if (!low.includes("patient teaching")) return "missing_patient_teaching";
  if (!low.includes("nclex")) return "missing_nclex_section";
  if (!low.includes("when to escalate")) return "missing_escalation_section";
  if (!low.includes('id="faq"') && !low.includes("faq")) return "missing_faq";
  if (!low.includes("apa-style") && !low.includes("references")) return "missing_references_section";
  if (!low.includes("nursing education and exam preparation")) return "missing_educational_disclaimer";
  if (!low.includes("not personal medical advice")) return "missing_medical_advice_disclaimer";
  const blogLinks = (html.match(/href="\/blog\//g) ?? []).length;
  const need = Math.min(3, Math.max(0, minBlogLinksRequired));
  if (need > 0 && blogLinks < need) return `insufficient_internal_blog_links:${blogLinks}_need_${need}`;
  return null;
}

export function buildArticleHtml(
  topic: LongTailTopic,
  internalLinks: { slug: string; title: string }[],
  accessDate: string,
): string {
  const esc = escapeHtmlPlain;
  const t = esc(topic.title);
  const sys = esc(topic.bodySystem);
  const tag = esc(topic.conditionOrDrug);
  const mechLabel = topic.pharm ? "Pharmacology mechanism" : "Pathophysiology mechanism";

  const links =
    internalLinks.length > 0
      ? `<ul>${internalLinks
          .map((l) => `<li><a href="/blog/${esc(l.slug)}">${esc(l.title)}</a></li>`)
          .join("")}</ul>`
      : "<p>No additional internal blog matches were available in this environment; add more published posts to improve cross-linking.</p>";

  const refs = buildConservativeApaReferences(accessDate)
    .map((r) => `<li>${esc(r)}</li>`)
    .join("");

  return `
<article>
<h1>${t}</h1>
<p><strong>Educational disclaimer:</strong> This article is for nursing education and exam preparation, not personal medical advice. It summarizes widely taught mechanisms and nursing priorities; always follow facility policy, provider orders, and scope of practice.</p>

<h2>${mechLabel}</h2>
<p>This section focuses on how <strong>${tag}</strong> connects to measurable physiology in the <strong>${sys}</strong> context. Rather than memorizing isolated facts, link each step to a vital sign, lab, or bedside observation you can trend.</p>
<p>For many NCLEX-style items, the “why” is more important than the brand name: identify the primary imbalance, the compensatory response, and the earliest unsafe deviation. When medications are involved, connect receptor or pathway effects to the assessments you repeat after dosing changes.</p>
<p>Common teaching frames include supply/demand mismatch, inflammation altering endothelial function, neurohormonal activation, autoregulation limits, and oxygen delivery dependencies. Use those frames to explain why two patients with the same diagnosis may look different based on age, comorbidities, and chronic compensation.</p>
<p>When data are incomplete in a stem, choose the option that stabilizes the highest-risk problem first while monitoring for predictable side effects of the intervention itself.</p>
<p>Finally, rehearse a two-sentence synthesis: what is the primary mechanism you are managing, and what is the complication you are trying to prevent in the next few hours?</p>

<h2>Nursing assessment findings</h2>
<p>Cluster subjective and objective cues by system. Trend beats snapshots: compare work of breathing, perfusion, urine output, and mental status to prior baselines when available.</p>
<p>Pair each medication class with the assessments that move first when therapy works—or when toxicity appears. For example, watch perfusion and rhythm when autonomic tone changes; watch electrolytes and renal function when volume or nephron stress changes.</p>
<p>Document escalation triggers clearly: persistent hypotension, rising oxygen requirements, new arrhythmias, worsening neurologic checks, or uncontrolled pain that masks deterioration.</p>
<p>Include focused reassessment after every high-risk intervention, not only on scheduled vitals.</p>
<p>Teach patients which symptoms should prompt urgent evaluation versus routine follow-up, using plain language and teach-back.</p>

<h2>Nursing interventions and implications</h2>
<p>Align monitoring frequency with acuity, polypharmacy, and renal/hepatic clearance. Verify allergies, high-alert medication protocols, and independent double checks where required.</p>
<p>Coordinate with pharmacy and providers for titration plans, laboratory monitoring intervals, and antidote availability when applicable. Prevent common harms: falls from orthostasis, bleeding from anticoagulation, and electrolyte shifts from fluid or diuretic therapy.</p>
<p>Support adherence with practical strategies: medication schedules aligned to meals when absorption matters, written instructions, interpreter services, and home monitoring when appropriate.</p>
<p>Prevent complications with mobility, infection prevention, glycemic control, VTE prophylaxis when ordered, and skin protection when perfusion is marginal.</p>
<p>Reinforce safety teaching for high-risk classes: avoid double dosing, avoid unsupervised NSAID or herbal stacking, and call before starting new OTC products that affect blood pressure, bleeding, or sedation.</p>

<h2>Patient teaching</h2>
<p>Use plain language and teach-back for warning signs, medication timing, and follow-up expectations. Emphasize lifestyle supports that match the mechanism: sodium/fluid awareness for volume states, inhaler technique for obstructive disease, foot care for neuropathy risk, and fall precautions when orthostasis or sedation is possible.</p>
<p>Encourage an updated medication list and a plan for who to call when thresholds are crossed.</p>
<p>Discuss vaccines, smoking cessation, and chronic disease follow-up when relevant to the underlying condition.</p>
<p>Provide written summaries when cognitive load, pain, or language barriers may limit recall.</p>
<p>Reinforce that online education articles are not a substitute for individualized medical guidance from licensed clinicians.</p>

<h2>NCLEX-style clinical reasoning</h2>
<p>Practice identifying the <em>first</em> unstable problem in the stem, then choose the option that addresses it with the least avoidable harm. Watch for distractors that are true statements but not the priority.</p>
<p>When two answers seem reasonable, compare which one is tied to the mechanism explicitly described (perfusion, oxygenation, airway protection, or electrolyte safety).</p>
<p>Use “if/then” reasoning: if this pathway fails, then this assessment changes first—select the intervention that matches that sequence.</p>
<p>For pharmacology items, connect adverse effect mechanisms to the monitoring you would intensify.</p>
<p>Finally, practice explaining your choice in one sentence using mechanism language; that habit transfers directly to clinical handoffs.</p>

<h2>When to escalate care</h2>
<p>Escalate urgently when airway protection is at risk, perfusion is failing despite initial therapy, neurologic status is declining, or oxygenation cannot be maintained with reasonable interventions.</p>
<p>Escalate when you identify a pattern suggesting organ ischemia, uncontrolled hemorrhage, sepsis progression, or arrhythmia instability—follow facility rapid response and provider notification policies.</p>
<p>Escalate early if you are uncertain but the trajectory is wrong: repeated hypotension, rising lactate, narrowing pulse pressure, or sudden confusion in a high-risk patient should not wait for “perfect” confirmation.</p>
<p>Document times, interventions attempted, and patient response to help the receiving team continue safe care.</p>
<p>Remember: escalation is a nursing strength, not a failure.</p>

<h2>Related NurseNest blog reading</h2>
${links}

<h2 id="faq">FAQ</h2>
<div id="faq">
<h3>What should I prioritize first in an unstable presentation?</h3>
<p>Protect airway, breathing, and circulation, then treat the underlying mechanism while trending focused reassessments.</p>
<h3>How do I avoid choosing a “true but not best” NCLEX answer?</h3>
<p>Pick the option that addresses the primary mechanism and highest-risk harm described in the stem.</p>
<h3>Can I use this page as medical advice for a real patient?</h3>
<p>No—this article is for nursing education and exam preparation, not personal medical advice. Individual care requires licensed evaluation.</p>
</div>

<h2>Safety and scope boundaries</h2>
<p>This template intentionally uses conservative language and emphasizes reassessment. Avoid stating rare complications as universal rules, and avoid implying that a single screen replaces bedside judgment.</p>
<p>When sources conflict across institutions, follow your local protocol and escalate questions through appropriate channels.</p>
<p>Remember that social determinants, language access, and caregiver availability change what “safe discharge teaching” looks like in practice.</p>
<p>Documentation should reflect objective data, patient statements, education provided, and the patient’s response to teaching.</p>
<p>If you are ever unsure, prioritize patient safety, notify the appropriate clinician, and continue monitoring while awaiting guidance.</p>

<h2>References (APA-style list)</h2>
<section id="references" class="apa-style-references">
<p>The reference list below uses conservative, organization-level entries suitable when a page-specific peer-reviewed citation is not embedded. Prefer primary literature, clinical practice guidelines, and official labeling when writing for publication outside this educational template.</p>
<ol>
${refs}
</ol>
</section>

<h2>Clinical synthesis</h2>
<p>Bring mechanism, assessment, interventions, teaching, escalation criteria, and follow-up into one concise handoff narrative. This mirrors safe nursing communication: problem, supporting data, actions taken, and what you are watching next.</p>
<p>Continue linking <strong>${tag}</strong> teaching to <strong>${sys}</strong> physiology so long-tail questions feel familiar rather than novel.</p>
</article>
`.trim();
}
