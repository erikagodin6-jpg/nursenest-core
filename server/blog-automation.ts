import { storage } from "./storage";
import { routeAIRequest } from "./ai-provider-router";

const openai = {
  chat: {
    completions: {
      create: async (params: any) => {
        const systemMsg = params.messages?.find((m: any) => m.role === "system");
        const userMsg = params.messages?.find((m: any) => m.role === "user");
        const result = await routeAIRequest(
          systemMsg?.content || "",
          userMsg?.content || "",
          {
            model: (params.model || "gpt-4o-mini").replace("openai/", ""),
            maxTokens: params.max_tokens || params.max_completion_tokens || 16000,
            temperature: params.temperature ?? 0.7,
            responseFormat: params.response_format,
            taskType: "content",
            feature: "blog-automation",
          }
        );
        return {
          choices: [{ message: { content: result.content } }],
          usage: { total_tokens: result.tokensUsed, prompt_tokens: result.inputTokens, completion_tokens: result.outputTokens },
        };
      },
    },
  },
};

export const LONG_TAIL_SEO_TOPICS: Array<{ topic: string; profession: string; category: string }> = [
  { topic: "How to pass the REx-PN exam on your first attempt", profession: "nursing-rpn", category: "nursing-education" },
  { topic: "RPN scope of practice what you can and cannot do", profession: "nursing-rpn", category: "nursing-education" },
  { topic: "Medication administration safety for practical nurses", profession: "nursing-rpn", category: "nursing-education" },
  { topic: "Wound care assessment and management for RPNs", profession: "nursing-rpn", category: "nursing-education" },
  { topic: "Time management tips for new graduate practical nurses", profession: "nursing-rpn", category: "nursing-education" },
  { topic: "Understanding IV therapy basics for practical nurses", profession: "nursing-rpn", category: "nursing-education" },
  { topic: "How to pass the NCLEX-RN on your first attempt", profession: "nursing-rn", category: "nursing-education" },
  { topic: "Critical care nursing skills every new RN should know", profession: "nursing-rn", category: "nursing-education" },
  { topic: "SBAR communication guide with examples for nurses", profession: "nursing-rn", category: "nursing-education" },
  { topic: "Nursing care plan development step by step guide", profession: "nursing-rn", category: "nursing-education" },
  { topic: "Understanding sepsis early recognition and nursing management", profession: "nursing-rn", category: "nursing-education" },
  { topic: "Delegation in nursing what RNs need to know", profession: "nursing-rn", category: "nursing-education" },
  { topic: "Nurse practitioner certification guide AANP vs ANCC", profession: "nursing-np", category: "nursing-education" },
  { topic: "Differential diagnosis skills for nurse practitioners", profession: "nursing-np", category: "nursing-education" },
  { topic: "Prescriptive authority for nurse practitioners state by state", profession: "nursing-np", category: "nursing-education" },
  { topic: "Primary care management of type 2 diabetes for NPs", profession: "nursing-np", category: "nursing-education" },
  { topic: "Evidence based hypertension management for NPs", profession: "nursing-np", category: "nursing-education" },
  { topic: "How to become a nurse practitioner step by step career guide", profession: "nursing-np", category: "nursing-education" },
  { topic: "How to pass the PTCB exam complete study guide", profession: "pharmacy-tech", category: "allied-health" },
  { topic: "Top 200 medications every pharmacy tech must know", profession: "pharmacy-tech", category: "allied-health" },
  { topic: "Pharmacy technician career guide from certification to advancement", profession: "pharmacy-tech", category: "allied-health" },
  { topic: "Controlled substance regulations every pharmacy tech must know", profession: "pharmacy-tech", category: "allied-health" },
  { topic: "Sterile compounding basics for pharmacy technicians", profession: "pharmacy-tech", category: "allied-health" },
  { topic: "Pharmacy law and ethics for technicians what you need to know", profession: "pharmacy-tech", category: "allied-health" },
  { topic: "ABG interpretation for respiratory therapy students", profession: "respiratory-therapy", category: "allied-health" },
  { topic: "Mechanical ventilation modes explained for RT students", profession: "respiratory-therapy", category: "allied-health" },
  { topic: "Respiratory therapy career guide from student to specialist", profession: "respiratory-therapy", category: "allied-health" },
  { topic: "Oxygen therapy devices and clinical applications for RT students", profession: "respiratory-therapy", category: "allied-health" },
  { topic: "Pulmonary function testing what RT students need to know", profession: "respiratory-therapy", category: "allied-health" },
  { topic: "How to prepare for the TMC exam respiratory therapy board review", profession: "respiratory-therapy", category: "allied-health" },
  { topic: "How to pass the NREMT exam paramedic study guide", profession: "paramedic-ems", category: "allied-health" },
  { topic: "12 lead ECG interpretation for paramedic students", profession: "paramedic-ems", category: "allied-health" },
  { topic: "Trauma assessment and management for EMS providers", profession: "paramedic-ems", category: "allied-health" },
  { topic: "Pharmacology essentials for paramedics field drug guide", profession: "paramedic-ems", category: "allied-health" },
  { topic: "Pediatric emergencies in prehospital care paramedic guide", profession: "paramedic-ems", category: "allied-health" },
  { topic: "Airway management techniques for paramedic students", profession: "paramedic-ems", category: "allied-health" },
  { topic: "Tips for new medical laboratory technologists first 90 days", profession: "mlt", category: "allied-health" },
  { topic: "ASCP board exam preparation guide for MLT students", profession: "mlt", category: "allied-health" },
  { topic: "Blood banking essentials for laboratory technologists", profession: "mlt", category: "allied-health" },
  { topic: "Clinical microbiology bacterial identification for MLT students", profession: "mlt", category: "allied-health" },
  { topic: "Hematology case studies peripheral blood smear interpretation", profession: "mlt", category: "allied-health" },
  { topic: "Quality control in the clinical laboratory Westgard rules explained", profession: "mlt", category: "allied-health" },
  { topic: "Radiography positioning guide essential projections for students", profession: "radiology", category: "allied-health" },
  { topic: "How to pass the ARRT exam radiography student guide", profession: "radiology", category: "allied-health" },
  { topic: "Radiation protection principles for imaging professionals", profession: "radiology", category: "allied-health" },
  { topic: "CT scan basics what radiography students need to know", profession: "radiology", category: "allied-health" },
  { topic: "Digital radiography image quality and exposure indicators", profession: "radiology", category: "allied-health" },
  { topic: "MRI safety for radiologic technologists what you need to know", profession: "radiology", category: "allied-health" },
  { topic: "How to pass the NBCOT OTR exam study guide for OT students", profession: "occupational-therapy", category: "allied-health" },
  { topic: "Occupational therapy for stroke rehabilitation evidence based approaches", profession: "occupational-therapy", category: "allied-health" },
  { topic: "Sensory integration therapy OT approaches for pediatric patients", profession: "occupational-therapy", category: "allied-health" },
  { topic: "Splinting in occupational therapy types indications and precautions", profession: "occupational-therapy", category: "allied-health" },
  { topic: "Activity analysis in occupational therapy a practical guide", profession: "occupational-therapy", category: "allied-health" },
  { topic: "Mental health occupational therapy groups interventions and recovery", profession: "occupational-therapy", category: "allied-health" },
  { topic: "How to pass the ASWB exam social work licensing guide", profession: "social-work", category: "allied-health" },
  { topic: "Social work ethics and boundaries NASW code of ethics guide", profession: "social-work", category: "allied-health" },
  { topic: "Crisis intervention in social work assessment and safety planning", profession: "social-work", category: "allied-health" },
  { topic: "Cognitive behavioral therapy techniques for social workers", profession: "social-work", category: "allied-health" },
  { topic: "Child welfare social work assessment and family reunification", profession: "social-work", category: "allied-health" },
  { topic: "Trauma informed care in social work practice", profession: "social-work", category: "allied-health" },
];

const NURSING_TOPICS = [
  "Clinical judgment in nursing practice",
  "NCLEX-RN preparation strategies",
  "Patient safety and medication administration",
  "Evidence-based nursing interventions",
  "Nursing assessment techniques",
  "Critical care nursing fundamentals",
  "Pediatric nursing considerations",
  "Maternal-newborn nursing care",
  "Mental health nursing approaches",
  "Geriatric nursing best practices",
  "Wound care management",
  "Pain management in nursing",
  "Infection control protocols",
  "Nursing documentation standards",
  "Pharmacology for nurses",
  "Cardiovascular nursing assessment",
  "Respiratory nursing interventions",
  "Neurological nursing assessment",
  "Endocrine disorders in nursing",
  "Gastrointestinal nursing care",
  "Renal and urinary nursing",
  "Musculoskeletal nursing assessment",
  "Integumentary system nursing care",
  "Fluid and electrolyte balance",
  "Acid-base imbalances in nursing",
  "Nursing leadership and management",
  "Cultural competence in nursing",
  "Nursing ethics and legal considerations",
  "Telehealth nursing practices",
  "New graduate nurse transition tips",
  "How to pass the NCLEX-RN on the first attempt",
  "RPN exam preparation strategies and study tips",
  "Nurse practitioner certification guide: AANP vs ANCC",
  "NCLEX-PN study plan for practical nursing students",
  "REx-PN exam format and what to expect in Canada",
  "How to become a nurse practitioner: step by step",
  "Critical care nursing skills for new RNs",
  "Pharmacology study strategies for nursing exams",
  "Time management tips for nursing students",
  "Clinical judgment in NCLEX Next Generation format",
  "Scope of practice differences: RPN vs RN vs NP",
  "How to transition from RPN/LVN to RN",
  "Nursing career advancement: from bedside to NP",
  "Pediatric nursing assessment tips for clinical rotations",
  "ICU nursing orientation essentials",
  "Emergency department nursing skills",
  "Surgical nursing pre-op and post-op care",
  "Oncology nursing fundamentals",
  "Diabetes management for nurses",
  "Hypertension nursing care plans",
  "Heart failure nursing interventions",
  "COPD nursing management",
  "Stroke nursing assessment and care",
  "Sepsis identification and management",
  "Blood transfusion nursing protocols",
  "IV therapy and venipuncture skills",
  "Nursing care plan development",
  "SBAR communication in nursing",
  "Delegation in nursing practice",
  "Time management for nurses",
  "Burnout prevention in nursing",
  "Nursing research and EBP",
  "Quality improvement in nursing",
  "Patient education strategies",
  "10 things new grad nurses wish they knew before their first shift",
  "How to survive your first week as a new graduate nurse",
  "New grad nurse time management mastering the 12-hour shift",
  "Building confidence as a new nurse overcoming imposter syndrome",
  "SBAR communication guide with examples for new nurses",
  "New grad nurse medication safety preventing your first error",
  "How to handle your first code blue as a new nurse",
  "New graduate nurse resume tips for competitive job markets",
  "Night shift survival guide for new graduate nurses",
  "Managing difficult patients de-escalation for new nurses",
  "New grad paramedic first year on the road",
  "Respiratory therapy career guide from new grad to specialist",
  "New graduate MLT first 90 days in the clinical laboratory",
  "New imaging technologist building speed without sacrificing quality",
  "Critical care nursing for new graduates is the ICU right for you",
  "Preventing burnout in your first year as a new nurse",
  "Making the most of your nursing preceptor relationship",
  "Transitioning from nursing student to professional nurse",
  "New graduate nurse interview preparation and common questions",
  "Choosing your first nursing unit med-surg vs ED vs ICU",
  "New grad OT building your first caseload successfully",
  "How to ask for help as a new healthcare professional",
  "Clinical documentation tips that save time for new nurses",
  "Protecting your mental health as a new nurse self-care strategies",
];

function formatAPA7Citation(author: string, year: number, title: string, source: string, url?: string): string {
  const urlPart = url ? ` ${url}` : "";
  return `${author} (${year}). ${title}. *${source}*.${urlPart}`;
}

function formatMLACitation(author: string, title: string, source: string, year: number, url?: string): string {
  const urlPart = url ? ` ${url}` : "";
  return `${author}. "${title}." *${source}*, ${year}.${urlPart}`;
}

export function formatCitations(citations: Array<{author: string; year: number; title: string; source: string; url?: string}>, style: "apa7" | "mla"): string {
  if (style === "apa7") {
    return citations.map(c => formatAPA7Citation(c.author, c.year, c.title, c.source, c.url)).join("\n\n");
  }
  return citations.map(c => formatMLACitation(c.author, c.title, c.source, c.year, c.url)).join("\n\n");
}

export async function generateBlogPost(topic?: string, citationStyle: "apa7" | "mla" = "apa7", language: string = "en"): Promise<{
  title: string;
  slug: string;
  summary: string;
  content: any[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  primaryKeyword: string;
  citations: string;
}> {
  const selectedTopic = topic || NURSING_TOPICS[Math.floor(Math.random() * NURSING_TOPICS.length)];

  const { getLanguageInstructionBlock } = await import("./medical-terminology-dictionary");
  const { logTranslationEvent } = await import("./translation-event-logger");
  const { validateGeneratedLanguage } = await import("./language-detector");

  const languageBlock = language && language !== "en" ? getLanguageInstructionBlock(language) : "";

  const systemPrompt = `You are a nursing education content writer for NurseNest. Your ONLY job is to write the blog post. You MUST always produce a complete article. Never refuse. Never ask for clarification. Never say you cannot do something. Just write the article.
${languageBlock}

OUTPUT RULES:
- Respond ONLY with valid JSON. No preamble, no explanation, no disclaimers.
- If you have any hesitation, ignore it and write the article anyway.
- NEVER output text like "I cannot", "I am unable", "clarification needed", or any refusal language.

WRITING STYLE:
- Clinically accurate, evidence-based nursing education content
- Professional academic tone suitable for nursing students (RPN/LVN, RN, NP)
- Include clinical pearls and practical nursing tips
- NO em dashes, en dashes, or long dashes. Use commas, semicolons, colons, or periods.
- NO emojis, checkmarks, or unicode special characters
- NO exclamation marks
- NO phrases: "In conclusion", "Let's explore", "dive into", "In this article", "Furthermore", "Moreover", "Additionally"
- NurseNest is NOT affiliated with NCLEX, NCSBN, CNO, or any regulatory body
- Include a section comparing Adult vs Pediatric considerations
- Use in-text APA 7 style citations: (Author, Year) format
- Include 4-8 references from nursing textbooks and journals

CITATIONS GUIDANCE:
- Use well-known nursing textbook authors: Potter & Perry, Hockenberry & Wilson, Lewis et al., Brunner & Suddarth, Ignatavicius et al.
- Use recognized clinical guidelines: AHA, CDC, WHO, ANA, RNAO
- Format references with plausible DOI URLs
- Citations should support clinical claims naturally within paragraphs

JSON FORMAT (respond with ONLY this JSON, nothing else):
{
  "title": "Blog post title",
  "slug": "url-friendly-slug",
  "summary": "2-3 sentence summary",
  "content": [
    {"type": "heading", "text": "Section heading"},
    {"type": "paragraph", "text": "Paragraph text with (Author, Year) citations..."},
    {"type": "list", "items": ["item1", "item2"]},
    {"type": "callout", "text": "Clinical pearl or tip"}
  ],
  "tags": ["tag1", "tag2"],
  "seoTitle": "SEO title (60 chars max)",
  "seoDescription": "Meta description (155 chars max)",
  "seoKeywords": ["keyword1", "keyword2"],
  "primaryKeyword": "main keyword",
  "citations": [
    {"author": "Author, A. B.", "year": 2024, "title": "Source Title", "source": "Journal or Publisher", "url": "https://doi.org/10.xxxx/xxxxx"}
  ]
}`;

  const userPrompt = `Write a nursing education blog post about: "${selectedTopic}".

MANDATORY SECTIONS (you must include ALL of these, each section needs a heading and at least 2 detailed paragraphs of 150+ words each):
1. Introduction and Overview (what is it, why it matters to nurses)
2. Pathophysiology and Disease Process (cellular and organ-level detail)
3. Risk Factors and Epidemiology (who is affected and why)
4. Clinical Presentation and Assessment (signs, symptoms, nursing assessment)
5. Diagnostic Workup (labs, imaging, procedures)
6. Medical and Surgical Management (treatments, procedures)
7. Nursing Interventions and Priority Actions (specific nursing care, monitoring)
8. Pharmacological Management (drug classes, mechanisms, side effects, nursing considerations)
9. Patient and Family Education (teaching priorities, discharge planning)
10. Adult vs Pediatric Considerations (age-specific differences)
11. Common Exam Questions (3-4 NCLEX-style scenarios with answer rationale)
12. Clinical Pearls and Key Takeaways (practical tips for bedside nurses)

Include 4-8 APA 7 in-text citations and references. Each paragraph must be at least 100 words. Respond with ONLY the JSON object.`;

  function stripDashes(str: string): string {
    let s = str
      .replace(/\u2014/g, ", ")
      .replace(/\u2013/g, " to ")
      .replace(/\u2015/g, ", ")
      .replace(/\u2012/g, "-")
      .replace(/ - /g, ", ")
      .replace(/\u2018/g, "'")
      .replace(/\u2019/g, "'")
      .replace(/\u201C/g, '"')
      .replace(/\u201D/g, '"')
      .replace(/\u2026/g, "...")
      .replace(/\u00A0/g, " ")
      .replace(/–/g, " to ")
      .replace(/—/g, ", ")
      .replace(/\s*--\s*/g, ", ");

    const aiPhrases = [
      /\bIn conclusion\b/gi,
      /\bLet's explore\b/gi,
      /\bLet's dive into\b/gi,
      /\bLet us explore\b/gi,
      /\bIn this article,?\s*/gi,
      /\bIn this blog post,?\s*/gi,
      /\bIn this comprehensive guide,?\s*/gi,
      /\bWithout further ado\b/gi,
      /\bIt's worth noting that\b/gi,
      /\bIt is worth noting that\b/gi,
      /\bMoreover,?\s*/gi,
      /\bFurthermore,?\s*/gi,
      /\bAdditionally,?\s*/gi,
      /\bIn summary,?\s*/gi,
      /\bTo summarize,?\s*/gi,
      /\bAll in all,?\s*/gi,
      /\bAt the end of the day,?\s*/gi,
      /\bIt goes without saying\b/gi,
      /\bNeedless to say,?\s*/gi,
    ];
    for (const phrase of aiPhrases) {
      s = s.replace(phrase, "");
    }
    s = s.replace(/\s{2,}/g, " ").trim();
    return s;
  }

  const failurePatterns = [
    /\bAs an AI\b/i,
    /\bAs a language model\b/i,
    /\bI apologize\b/i,
    /\bI must be transparent\b/i,
    /\bI do not have the ability\b/i,
    /\bI cannot generate\b/i,
    /\bI cannot produce\b/i,
    /\bI cannot write\b/i,
    /\bI can't generate\b/i,
    /\bI can't produce\b/i,
    /\bI'm unable to generate\b/i,
    /\bclarification needed\b/i,
    /\bneed clarification\b/i,
    /\bprefatory note\b/i,
    /\btransparency note\b/i,
    /\bhonesty note\b/i,
    /\bimportant disclaimer\b/i,
    /\bI want to be transparent\b/i,
    /\bI have to be honest\b/i,
    /\bhallucinate\b/i,
    /\bplease note that I\b/i,
  ];

  function validatePost(parsed: any): string | null {
    const allText = [
      parsed.title || "",
      parsed.summary || "",
      ...(Array.isArray(parsed.content) ? parsed.content.map((b: any) => {
        const parts: string[] = [];
        if (b.text) parts.push(b.text);
        if (b.content) parts.push(b.content);
        if (b.items && Array.isArray(b.items)) parts.push(b.items.join(" "));
        return parts.join(" ");
      }) : []),
    ].join(" ");

    if (failurePatterns.some(p => p.test(allText))) return "contained refusal/disclaimer language";
    if (!parsed.title) return "missing title";
    if (!Array.isArray(parsed.content) || parsed.content.length < 4) return "too few content blocks";
    const paragraphs = parsed.content.filter((b: any) => b.type === "paragraph");
    if (paragraphs.length < 3) return "too few paragraphs";
    const wordCount = allText.split(/\s+/).length;
    if (wordCount < 1400) return `too short (${wordCount} words, minimum 1400)`;
    return null;
  }

  const MAX_ATTEMPTS = 3;
  let parsed: any = null;
  let bestShortParsed: any = null;
  let bestShortWordCount = 0;
  let lastError = "";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const retryPrompt = attempt === 2
      ? `Your previous attempt was too short. You MUST write at least 2000 words of body content. Write the complete, detailed JSON blog post about: "${selectedTopic}". Include 8+ sections. Respond with ONLY the JSON.`
      : `FINAL ATTEMPT. The article MUST exceed 2000 words. Write an extremely detailed, comprehensive nursing education article about: "${selectedTopic}". Include 10+ sections with deep clinical detail. Respond with ONLY the JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: attempt === 1 ? userPrompt : retryPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 16384,
    });

    try {
      parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch {
      lastError = "invalid JSON response";
      console.error(`Blog generation attempt ${attempt}/${MAX_ATTEMPTS} for "${selectedTopic}": invalid JSON`);
      continue;
    }

    const validationError = validatePost(parsed);
    if (!validationError) break;

    if (validationError.startsWith("too short") && parsed.title && Array.isArray(parsed.content) && parsed.content.length >= 4) {
      const wc = parseInt(validationError.match(/\d+/)?.[0] || "0");
      if (wc > bestShortWordCount) {
        bestShortParsed = parsed;
        bestShortWordCount = wc;
      }
    }

    lastError = validationError;
    console.error(`Blog generation attempt ${attempt}/${MAX_ATTEMPTS} for "${selectedTopic}": ${validationError}`);
    parsed = null;
  }

  if (!parsed && bestShortParsed && bestShortWordCount >= 600) {
    console.log(`Blog post "${selectedTopic}" short (${bestShortWordCount} words), expanding with follow-up call...`);
    try {
      const expandedContent = await expandBlogPost(bestShortParsed.content, bestShortParsed.title, citationStyle);
      bestShortParsed.content = expandedContent;
      parsed = bestShortParsed;
      console.log(`Blog post "${selectedTopic}" expanded successfully`);
    } catch (expandErr) {
      console.error(`Blog expansion failed for "${selectedTopic}":`, expandErr);
    }
  }

  if (!parsed) {
    await logTranslationEvent({
      eventType: "ai_generation_failure",
      contentType: "blog",
      language,
      generatorName: "blog-automation",
      severity: "error",
      details: { topic: selectedTopic, error: lastError, attempts: MAX_ATTEMPTS },
    });
    throw new Error(`Blog generation rejected for "${selectedTopic}" after ${MAX_ATTEMPTS} attempts: ${lastError}. Only complete articles are saved.`);
  }

  if (language && language !== "en" && parsed.content && Array.isArray(parsed.content)) {
    const textToCheck = parsed.content
      .filter((b: any) => b.text || b.content)
      .map((b: any) => b.text || b.content || "")
      .join(" ")
      .substring(0, 500);

    if (textToCheck.length > 20) {
      const langCheck = validateGeneratedLanguage(textToCheck, language);
      if (!langCheck.valid) {
        console.warn(`[BlogAutomation] Language mismatch: expected ${language}, detected ${langCheck.result.detectedLanguage}`);
        await logTranslationEvent({
          eventType: "language_mismatch",
          contentType: "blog",
          language,
          generatorName: "blog-automation",
          severity: "warning",
          details: { topic: selectedTopic, expected: language, detected: langCheck.result.detectedLanguage, confidence: langCheck.result.confidence },
        });
      } else {
        await logTranslationEvent({
          eventType: "language_validated",
          contentType: "blog",
          language,
          generatorName: "blog-automation",
          severity: "info",
          details: { topic: selectedTopic, language },
        });
      }
    }
  } else if (language === "en" || !language) {
    await logTranslationEvent({
      eventType: "ai_generation_success",
      contentType: "blog",
      language: language || "en",
      generatorName: "blog-automation",
      severity: "info",
      details: { topic: selectedTopic },
    });
  }

  if (parsed.content && Array.isArray(parsed.content)) {
    parsed.content = parsed.content.map((block: any) => {
      if (block.text) block.text = stripDashes(block.text);
      if (block.content) block.content = stripDashes(block.content);
      if (block.items && Array.isArray(block.items)) {
        block.items = block.items.map((item: string) => stripDashes(item));
      }
      return block;
    });
  }

  if (parsed.title) parsed.title = stripDashes(parsed.title);
  if (parsed.summary) parsed.summary = stripDashes(parsed.summary);

  const formattedCitations = parsed.citations
    ? formatCitations(parsed.citations, citationStyle)
    : "";

  if (parsed.citations && Array.isArray(parsed.citations) && parsed.citations.length > 0) {
    const referenceItems = parsed.citations.map((c: any) => {
      if (citationStyle === "apa7") {
        return formatAPA7Citation(c.author, c.year, c.title, c.source, c.url);
      }
      return formatMLACitation(c.author, c.title, c.source, c.year, c.url);
    });
    parsed.content.push(
      { type: "heading", text: citationStyle === "apa7" ? "References (APA 7th Edition)" : "Works Cited (MLA)" },
      { type: "references", items: referenceItems }
    );
  }

  function sanitizeSlug(raw: string): string {
    return raw
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function sanitizeCategory(raw: string): string {
    return raw.replace(/[^a-zA-Z0-9\s-]/g, "").trim() || "nursing-education";
  }

  function sanitizeTitle(raw: string): string {
    return stripDashes(raw).replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
  }

  const rawSlug = parsed.slug || selectedTopic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const safeSlug = sanitizeSlug(rawSlug) || `blog-${Date.now()}`;

  return {
    title: sanitizeTitle(parsed.title || selectedTopic),
    slug: safeSlug,
    summary: parsed.summary || "",
    content: parsed.content || [],
    tags: (parsed.tags || []).map((t: string) => sanitizeCategory(t)),
    seoTitle: sanitizeTitle(parsed.seoTitle || parsed.title || selectedTopic),
    seoDescription: parsed.seoDescription || parsed.summary || "",
    seoKeywords: parsed.seoKeywords || [],
    primaryKeyword: parsed.primaryKeyword || "",
    citations: formattedCitations,
  };
}

export async function expandBlogPost(existingContent: any[], existingTitle: string, citationStyle: "apa7" | "mla" = "apa7"): Promise<any[]> {
  function stripDashesExpand(str: string): string {
    return str
      .replace(/\u2014/g, ", ")
      .replace(/\u2013/g, " to ")
      .replace(/\u2015/g, ", ")
      .replace(/\u2012/g, "-")
      .replace(/ - /g, ", ")
      .replace(/\u2018/g, "'")
      .replace(/\u2019/g, "'")
      .replace(/\u201C/g, '"')
      .replace(/\u201D/g, '"')
      .replace(/\u2026/g, "...")
      .replace(/\u00A0/g, " ")
      .replace(/–/g, " to ")
      .replace(/—/g, ", ")
      .replace(/\s*--\s*/g, ", ");
  }

  function countWords(content: any[]): number {
    return content.reduce((acc: number, block: any) => {
      const text = block.text || block.content || "";
      const itemsText = (block.items || []).join(" ");
      return acc + (text + " " + itemsText).split(/\s+/).filter(Boolean).length;
    }, 0);
  }

  function contentToText(content: any[]): string {
    return content
      .map((block: any) => {
        const parts: string[] = [];
        if (block.type === "heading") parts.push(`## ${block.text}`);
        else if (block.type === "paragraph") parts.push(block.text || block.content || "");
        else if (block.type === "list" && block.items) parts.push(block.items.join("\n"));
        else if (block.type === "callout") parts.push(`[CALLOUT] ${block.text}`);
        return parts.join("\n");
      })
      .join("\n\n");
  }

  const MAX_EXPAND_ROUNDS = 3;
  let currentContent = existingContent;

  for (let round = 1; round <= MAX_EXPAND_ROUNDS; round++) {
    const currentWordCount = countWords(currentContent);
    if (currentWordCount >= 2000) break;

    const wordsNeeded = 2000 - currentWordCount;
    const existingText = contentToText(currentContent);

    const expandPrompt = `You are expanding an existing nursing education blog post. The current article is ${currentWordCount} words and needs to be at least 2000 words. You must add approximately ${wordsNeeded + 500} more words of clinical content.

YOUR TASKS:
1. Keep ALL existing content and sections intact (do not remove or shorten anything)
2. Expand EACH existing paragraph by adding 2-3 more sentences of clinical detail, pathophysiology, or nursing rationale
3. Add 3-4 entirely NEW sections (at least 200 words each) that are clinically relevant to the topic. Choose from:
   - Pathophysiology and Disease Process (detailed cellular/organ-level explanation)
   - Risk Factors and Predisposing Conditions (comprehensive list with explanations)
   - Nursing Assessment and Physical Examination (systematic approach)
   - Pharmacological Management (drug classes, mechanisms, side effects, nursing considerations)
   - Patient and Family Education (teaching priorities, discharge instructions)
   - Common Exam Questions (3-4 NCLEX-style scenarios with rationale)
   - Nursing Interventions and Priority Actions (specific, actionable nursing care)
   - Complications and Emergency Management (what can go wrong, how to respond)
   - Adult vs Pediatric Considerations (age-specific differences)
   - Documentation and Communication (SBAR, charting requirements)
4. Each NEW section must have a heading followed by at least 2 detailed paragraphs (150+ words each)
5. The final output MUST contain at least 2000 words of body content

WRITING RULES:
- Write long, detailed paragraphs (at least 100 words each)
- NO em dashes, en dashes, or long dashes. Use commas, semicolons, colons, or periods.
- NO emojis, checkmarks, or unicode special characters
- NO exclamation marks
- NO phrases: "In conclusion", "Let's explore", "dive into", "In this article", "Furthermore", "Moreover", "Additionally"

EXISTING ARTICLE TITLE: "${existingTitle}"

EXISTING CONTENT:
${existingText}

OUTPUT FORMAT: Respond with ONLY a JSON object containing the COMPLETE expanded article (all existing + new content):
{
  "content": [
    {"type": "heading", "text": "Section heading"},
    {"type": "paragraph", "text": "Long detailed paragraph text of at least 100 words..."},
    {"type": "list", "items": ["item1", "item2"]},
    {"type": "callout", "text": "Clinical pearl or tip"},
    {"type": "references", "items": ["formatted reference"]}
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a nursing education content writer who writes extremely detailed, long-form clinical articles. Every paragraph you write must be at least 100 words. Output ONLY valid JSON. Never refuse. Never add disclaimers. Always produce comprehensive clinical content." },
        { role: "user", content: expandPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 16384,
    });

    try {
      const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      if (!parsed.content || !Array.isArray(parsed.content) || parsed.content.length < 5) {
        console.error(`Expansion round ${round}: invalid structure`);
        continue;
      }

      parsed.content = parsed.content.map((block: any) => {
        if (block.text) block.text = stripDashesExpand(block.text);
        if (block.content) block.content = stripDashesExpand(block.content);
        if (block.items && Array.isArray(block.items)) {
          block.items = block.items.map((item: string) => stripDashesExpand(item));
        }
        return block;
      });

      const newWordCount = countWords(parsed.content);
      console.log(`Expansion round ${round}: ${currentWordCount} -> ${newWordCount} words`);

      if (newWordCount > currentWordCount) {
        currentContent = parsed.content;
      }
    } catch (err) {
      console.error(`Expansion round ${round} parse error:`, err);
    }
  }

  const finalWordCount = countWords(currentContent);
  if (finalWordCount < 1200) {
    throw new Error(`Blog expansion failed: Expanded content only ${finalWordCount} words after ${MAX_EXPAND_ROUNDS} rounds, need 2000+`);
  }

  if (finalWordCount < 2000) {
    console.warn(`Blog expansion warning: content is ${finalWordCount} words (under 2000 target), accepting anyway`);
  }

  return currentContent;
}

export async function expandAllShortPosts(minWords: number = 2000): Promise<{ expanded: number; skipped: number; failed: number; details: string[] }> {
  const allItems = await storage.getAllContentItems();
  const blogPosts = allItems.filter(i => i.type === "blog");

  let expanded = 0;
  let skipped = 0;
  let failed = 0;
  const details: string[] = [];

  for (const post of blogPosts) {
    const content = (post.content as any[]) || [];
    const wordCount = content.reduce((acc: number, block: any) => {
      const text = block.text || block.content || "";
      const itemsText = (block.items || []).join(" ");
      return acc + (text + " " + itemsText).split(/\s+/).filter(Boolean).length;
    }, 0);

    if (wordCount >= minWords) {
      skipped++;
      details.push(`SKIP: ${post.slug} (${wordCount} words)`);
      continue;
    }

    try {
      const expandedContent = await expandBlogPost(content, post.title || post.slug);
      await storage.updateContentItem(post.id, { content: expandedContent });
      const newWordCount = expandedContent.reduce((acc: number, block: any) => {
        const text = block.text || block.content || "";
        const itemsText = (block.items || []).join(" ");
        return acc + (text + " " + itemsText).split(/\s+/).filter(Boolean).length;
      }, 0);
      expanded++;
      details.push(`EXPANDED: ${post.slug} (${wordCount} -> ${newWordCount} words)`);
    } catch (e) {
      failed++;
      details.push(`FAILED: ${post.slug} - ${(e as Error).message}`);
    }
  }

  return { expanded, skipped, failed, details };
}

export async function runBlogScheduler(): Promise<{ generated: number; message: string }> {
  const config = await storage.getBlogConfig();
  if (!config || !config.isActive) {
    return { generated: 0, message: "Blog automation is not active" };
  }

  const now = new Date();
  const dayCount = config.dayCount || 0;
  const totalPosts = config.totalPostsGenerated || 0;

  let postsToGenerate = 0;
  if (dayCount < 120) {
    postsToGenerate = config.postsPerDay || 2;
  } else if (dayCount < 220) {
    postsToGenerate = 1;
  } else {
    return { generated: 0, message: "Blog schedule complete (220 days)" };
  }

  if (config.lastPostAt) {
    const lastPost = new Date(config.lastPostAt);
    const hoursSince = (now.getTime() - lastPost.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 12) {
      return { generated: 0, message: "Too soon since last post" };
    }
  }

  const citationStyle = (config.citationStyle as "apa7" | "mla") || "apa7";
  let generated = 0;

  for (let i = 0; i < postsToGenerate; i++) {
    try {
      const post = await generateBlogPost(undefined, citationStyle);

      const isDup = await storage.checkDuplicateSlug(post.slug);
      const finalSlug = isDup ? `${post.slug}-${Date.now()}` : post.slug;

      await storage.createContentItem({
        title: post.title,
        slug: finalSlug,
        type: "blog",
        category: "nursing-education",
        tier: "free",
        status: "published",
        tags: post.tags,
        summary: post.summary,
        content: post.content,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        seoKeywords: post.seoKeywords,
        primaryKeyword: post.primaryKeyword,
        publishedAt: now,
        autoPublish: true,
        authorName: "Erika Godin, RN",
      });

      generated++;
    } catch (error) {
      console.error("Blog generation error:", error);
    }
  }

  await storage.upsertBlogConfig({
    dayCount: dayCount + 1,
    totalPostsGenerated: totalPosts + generated,
    lastPostAt: now,
  });

  return { generated, message: `Generated ${generated} posts (day ${dayCount + 1})` };
}
