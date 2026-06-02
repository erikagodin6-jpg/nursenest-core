import { pool } from "./storage";
import { routeAIRequest } from "./ai-provider-router";
import {
  validateTargetLanguage,
  buildLanguageEnforcementPrompt,
  validateContentLanguage,
  checkTerminologyConsistency,
  buildValidationReport,
  getContentFields,
  checkPublishingGate,
  buildLanguageScopedCacheKey,
  enforceLanguageOnGeneration,
  type LanguageValidationReport,
} from "./language-enforcement";

async function runLanguageValidatedGeneration(
  parsed: any,
  targetLanguage: string,
  contentType: string,
  retryCount: number = 0
): Promise<{ parsed: any; validationReport: LanguageValidationReport }> {
  const fields = getContentFields(contentType);
  const { passed: langPassed, fieldResults } = validateContentLanguage(parsed, targetLanguage, fields);
  const { passed: termPassed } = checkTerminologyConsistency(parsed, targetLanguage);
  const overallPassed = langPassed && termPassed;
  const report = buildValidationReport(targetLanguage, fieldResults, termPassed, retryCount, overallPassed);
  return { parsed, validationReport: report };
}

function getOpenAI() {
  return {
    chat: {
      completions: {
        create: async (params: any) => {
          const systemMsg = params.messages?.find((m: any) => m.role === "system");
          const userMsg = params.messages?.find((m: any) => m.role === "user");
          const result = await routeAIRequest(
            systemMsg?.content || "",
            userMsg?.content || "",
            {
              model: params.model?.replace("openai/", "") || "gpt-4o-mini",
              maxTokens: params.max_tokens || params.max_completion_tokens || 16000,
              temperature: params.temperature ?? 0.7,
              responseFormat: params.response_format,
              taskType: "content",
              feature: "content-generators",
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
}

const NURSING_PAGE_SYSTEM_PROMPT = `You are a senior nursing educator and exam strategist creating high-quality educational content for NurseNest.

Your task is to generate comprehensive nursing study pages that help students prepare for:
- REx-PN
- NCLEX-PN
- NCLEX-RN

PAGE REQUIREMENTS:
- Length: 1500-2500 words
- Audience: nursing students studying for licensing exams
- Tone: educational, clear, exam-focused

STRUCTURE (you MUST include ALL of these sections):
1. Title
2. Introduction
3. Concept Explanation
4. Clinical Assessment
5. Nursing Interventions
6. Tables or charts (use markdown tables)
7. Common Exam Traps
8. Clinical Pearls
9. Practice Questions (minimum 10 multiple-choice questions)
10. Detailed rationales for each answer (explain why correct AND why each wrong answer is wrong)
11. Summary

SEO OUTPUT (include at the very top before the article):
- SEO title (60 chars max)
- Meta description (155 chars max)
- URL slug (lowercase, hyphenated)

VISUAL CONTENT RECOMMENDATION:
At the end, recommend one infographic that illustrates the topic. Examples:
- ECG rhythm chart
- ABG interpretation flowchart
- Electrolyte imbalance chart
Provide a short description for the recommended infographic.

FORMAT your output as valid JSON with these fields:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "title": "...",
  "article": "... (full markdown article with all sections)",
  "practiceQuestions": [
    {
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "rationale": "..."
    }
  ],
  "infographicRecommendation": {
    "title": "...",
    "description": "..."
  },
  "wordCount": 0
}`;

const ALLIED_HEALTH_PAGE_SYSTEM_PROMPT = `You are an allied health educator creating educational study resources for NurseNest.

The goal is to create high-quality pages that help students studying for allied health certification exams.

Supported careers:
- Pharmacy Technician (PTCB/ExCPT)
- Respiratory Therapy (RRT/TMC)
- Paramedic / EMS (NREMT)
- Medical Laboratory Technologist (MLT/ASCP)
- Medical Imaging / Radiology (ARRT)

ARTICLE REQUIREMENTS:
- Length: 1500-2200 words
- Audience: allied health students
- Tone: clear, educational, exam-focused

STRUCTURE (you MUST include ALL of these sections):
1. Title
2. Introduction
3. Role Scope and Clinical Settings
4. Core Concepts Explanation
5. Clinical Workflow or Procedure Steps
6. Safety Considerations
7. Common Exam Traps
8. Clinical Pearls
9. Practice Questions (minimum 10 multiple-choice questions)
10. Detailed rationales for each answer (explain why correct AND why each wrong answer is wrong)
11. Summary

SEO OUTPUT (include at the very top before the article):
- SEO title (60 chars max)
- Meta description (155 chars max)
- URL slug (lowercase, hyphenated)

VISUAL CONTENT RECOMMENDATION:
At the end, recommend one infographic that illustrates the topic. Examples:
- Ventilator settings chart
- Dosage calculation formula chart
- Order of draw chart
Provide a short description for the recommended infographic.

FORMAT your output as valid JSON with these fields:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "title": "...",
  "career": "pharmacy_tech | respiratory_therapy | paramedic_ems | mlt | radiology",
  "article": "... (full markdown article with all sections)",
  "practiceQuestions": [
    {
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "rationale": "..."
    }
  ],
  "infographicRecommendation": {
    "title": "...",
    "description": "..."
  },
  "wordCount": 0
}`;

const PRACTICE_QUESTION_SYSTEM_PROMPT = `You are a senior nursing exam item writer creating exam-style practice questions aligned with:
- REx-PN
- NCLEX-PN
- NCLEX-RN

QUESTION SET REQUIREMENTS:
- Generate exactly 25 questions for the given topic
- Use multiple formats:
  * Multiple choice (single correct answer)
  * Select all that apply (SATA)
  * Case-based questions (clinical scenario leading to a question)

QUESTION STRUCTURE (for each question):
1. Clinical scenario (brief patient situation)
2. Question stem (clear, unambiguous)
3. Answer choices (4-5 options for MC, 5-6 for SATA)
4. Correct answer(s)

RATIONALE REQUIREMENTS:
- Minimum 300 words per rationale
- Explain why the correct answer is correct
- Explain why each incorrect answer is wrong
- Include relevant nursing concepts, clinical reasoning, and exam strategy tips

FORMAT your output as valid JSON:
{
  "topic": "...",
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "introduction": "... (2-3 paragraph intro to the topic and why it matters for exams)",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice | sata | case_based",
      "scenario": "...",
      "stem": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswers": ["A"],
      "rationale": "... (minimum 300 words)",
      "category": "...",
      "difficulty": 1-5,
      "examRelevance": "REx-PN | NCLEX-PN | NCLEX-RN | All"
    }
  ],
  "summary": "..."
}`;

export async function generateNursingPage(
  topic: string,
  targetKeyword: string,
  examType: string,
  wordCount: number,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const langPrompt = buildLanguageEnforcementPrompt(validatedLang);
    const userPrompt = `Generate a comprehensive nursing study page on the following topic:

Topic: ${topic}
Target SEO Keyword: ${targetKeyword}
Primary Exam: ${examType.toUpperCase()}
Target Word Count: ${wordCount}

Requirements:
- Focus on ${examType.toUpperCase()} exam preparation
- Include clinical scenarios relevant to ${examType}
- Include at least 10 practice questions with detailed rationales
- Tables should compare key concepts (e.g., normal vs abnormal values, drug comparisons)
- Clinical pearls should be memorable exam tips
- Common exam traps should warn about frequent mistakes students make

Make the content comprehensive, clinically accurate, and exam-focused.${langPrompt}`;

    const result = await routeAIRequest(NURSING_PAGE_SYSTEM_PROMPT, userPrompt, {
      model: "gpt-4o",
      maxTokens: 8000,
      temperature: 0.7,
      responseFormat: { type: "json_object" },
      taskType: "content",
      feature: "nursing-page-generator",
    });

    const content = result.content;
    if (!content) throw new Error("No content returned from generation");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "nursing_page");

    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('blog_engine', 'blog', $1, $2, $3, $4, 'autopilot')`,
        [
          parsed.title || topic,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic,
            targetKeyword,
            examType,
            wordCount: parsed.wordCount || wordCount,
            slug: parsed.slug,
            seoTitle: parsed.seoTitle,
            metaDescription: parsed.metaDescription,
            questionCount: parsed.practiceQuestions?.length || 0,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );

      await client.query(
        `UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2`,
        [JSON.stringify({
          title: parsed.title,
          slug: parsed.slug,
          wordCount: parsed.wordCount,
          questionCount: parsed.practiceQuestions?.length || 0,
          queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'blog_engine'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

const ALLIED_CAREER_LABELS: Record<string, string> = {
  pharmacy_tech: "Pharmacy Technician (PTCB/ExCPT)",
  respiratory_therapy: "Respiratory Therapy (RRT/TMC)",
  paramedic_ems: "Paramedic / EMS (NREMT)",
  mlt: "Medical Laboratory Technologist (MLT/ASCP)",
  radiology: "Medical Imaging / Radiology (ARRT)",
};

export async function generateAlliedHealthPage(
  topic: string,
  targetKeyword: string,
  career: string,
  wordCount: number,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  const careerLabel = ALLIED_CAREER_LABELS[career] || career;

  try {
    const langPrompt = buildLanguageEnforcementPrompt(validatedLang);
    const userPrompt = `Generate a comprehensive allied health study page on the following topic:

Topic: ${topic}
Target SEO Keyword: ${targetKeyword}
Career / Certification: ${careerLabel}
Target Word Count: ${wordCount}

Requirements:
- Focus specifically on ${careerLabel} certification exam preparation
- Include role scope and clinical settings relevant to this career
- Include clinical workflow or procedure steps specific to this discipline
- Include safety considerations and regulatory requirements
- Include at least 10 practice questions with detailed rationales
- Common exam traps should warn about frequent mistakes students make on the ${careerLabel} exam
- Clinical pearls should be memorable exam tips specific to this career
- Visual content recommendation should be relevant to ${careerLabel} practice

Make the content comprehensive, clinically accurate, and exam-focused.${langPrompt}`;

    const aiResult = await routeAIRequest(ALLIED_HEALTH_PAGE_SYSTEM_PROMPT, userPrompt, {
      model: "gpt-4o",
      maxTokens: 8000,
      temperature: 0.7,
      responseFormat: { type: "json_object" },
      taskType: "content",
      feature: "allied-health-page-generator",
    });

    const content = aiResult.content;
    if (!content) throw new Error("No content returned from generation");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "allied_health");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('blog_engine', 'blog', $1, $2, $3, $4, 'autopilot')`,
        [
          parsed.title || topic,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, targetKeyword, career, careerLabel,
            contentType: "allied_health",
            wordCount: parsed.wordCount || wordCount,
            slug: parsed.slug, seoTitle: parsed.seoTitle,
            metaDescription: parsed.metaDescription,
            questionCount: parsed.practiceQuestions?.length || 0,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        `UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2`,
        [JSON.stringify({
          title: parsed.title, slug: parsed.slug, career,
          wordCount: parsed.wordCount,
          questionCount: parsed.practiceQuestions?.length || 0,
          queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'blog_engine'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

const ALLIED_HEALTH_QUESTION_PROMPT = `You are an allied health exam item writer creating exam-style practice questions for allied health students.

Supported careers and certifications:
- Pharmacy Technician (PTCB/ExCPT)
- Respiratory Therapy (RRT/TMC)
- Paramedic / EMS (NREMT)
- Medical Laboratory Technologist (MLT/ASCP)
- Medical Imaging / Radiology (ARRT)

QUESTION SET REQUIREMENTS:
- Generate exactly 25 questions for the given topic and career
- Use multiple formats:
  * Multiple choice (single correct answer)
  * Select all that apply (SATA)
  * Case-based scenarios (clinical situation leading to a question)
  * Calculation questions when relevant (dosage, flow rates, exposure settings)

QUESTION STRUCTURE (for each question):
1. Clinical scenario (brief workplace situation)
2. Question stem (clear, unambiguous)
3. Answer choices (4-5 options for MC, 5-6 for SATA)
4. Correct answer(s)

RATIONALE REQUIREMENTS:
- Minimum 300 words per rationale
- Explain why the correct answer is correct
- Explain why each incorrect answer is wrong
- Include relevant clinical workflow, safety protocols, and exam strategy tips

FORMAT your output as valid JSON:
{
  "topic": "...",
  "career": "pharmacy_tech | respiratory_therapy | paramedic_ems | mlt | radiology",
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "introduction": "... (2-3 paragraph intro to the topic and why it matters for certification exams)",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice | sata | case_based | calculation",
      "scenario": "...",
      "stem": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswers": ["A"],
      "rationale": "... (minimum 300 words)",
      "category": "...",
      "difficulty": 1-5,
      "examRelevance": "PTCB | RRT | NREMT | ASCP | ARRT | All"
    }
  ],
  "summary": "..."
}`;

const SOCIAL_WORK_QUESTION_PROMPT = `You are a senior social work psychometrician and ASWB-certified item writer creating licensing exam questions for NurseNest.

Target exams: ASWB (Bachelors, Masters, Clinical) and Canadian Social Work licensing exams.

Each question MUST include a realistic client scenario with:
- Client demographics (age, gender identity, cultural background)
- Psychosocial context (family dynamics, socioeconomic status, living situation)
- Presenting issue with specific behavioral/emotional symptoms
- Ethical considerations or dilemmas when relevant
- Cultural elements that inform assessment and intervention

DOMAINS (distribute questions across all 6):
1. Human Behavior & Development (15-20%): Erikson, Piaget, attachment theory, family systems, lifespan development
2. Assessment & Diagnosis (18-22%): Biopsychosocial assessment, MSE, DSM-5 differential diagnosis, risk assessment
3. Intervention & Treatment Planning (20-25%): CBT, MI, SFBT, trauma-informed care, group therapy, treatment goals
4. Ethics & Professional Practice (18-22%): NASW Code, Tarasoff, dual relationships, confidentiality, supervision
5. Community Resources (10-15%): Case management, advocacy, social welfare policy, SSI/SSDI, TANF, referrals
6. Crisis Intervention (10-15%): Suicide risk, safety planning, de-escalation, mandatory reporting, PFA

DIFFICULTY DISTRIBUTION:
- 35% Easy (recall/comprehension, difficulty 1-2)
- 45% Moderate (application/analysis, difficulty 3)
- 20% Hard (synthesis/evaluation, difficulty 4-5)

QUESTION FORMAT:
- MCQ_SINGLE: Standard 4-option multiple choice
- CASE_BASED_CLUSTER: Multi-part scenario with 2-3 related questions
- PRIORITIZATION: Rank or identify the FIRST/BEST action

OUTPUT FORMAT - Return a JSON array of objects:
{
  "questionId": "AUTO_INCREMENT",
  "questionType": "MCQ_SINGLE | CASE_BASED_CLUSTER | PRIORITIZATION",
  "domain": "one of the 6 domains above",
  "subDomain": "specific topic within domain",
  "difficulty": 1-5,
  "stem": "realistic client scenario with detailed psychosocial context (minimum 80 words)",
  "scenario": "extended clinical context if case-based",
  "options": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}],
  "correctAnswer": "A",
  "rationale": "detailed explanation (minimum 250 words) - why correct answer is right and why each wrong answer is wrong, include ethical considerations and practice domain context",
  "clinicalPearls": ["exam-relevant insight 1", "insight 2"],
  "ethicalConsiderations": "relevant ethical principles from NASW Code",
  "practiceDomain": "ASWB content area",
  "tags": ["topic tags"],
  "lessonLink": "/social-worker/lessons/{relevant-slug}",
  "blueprintValidated": true
}

Each rationale must be minimum 250 words. Return ONLY valid JSON array.`;

const ALLIED_HEALTH_INFOGRAPHIC_PROMPT = `You are a medical infographic designer creating allied health study diagrams for NurseNest.

STYLE:
- Pastel clinical aesthetic
- Clean educational layout
- Rounded infographic cards

BRAND COLORS:
- Lavender #BFA6F6
- Teal #AEE3E1
- Peach #FFD6A5
- Yellow #FFF3B0
- Text #2E3A59

Include watermark: NurseNest.ca

CANVAS SIZES:
- Standard: 3000 x 2000 px
- Pinterest version: 1000 x 1500 px

Each diagram must include:
- Title
- Clear labels
- Educational notes
- Exam tip box

FORMAT your output as valid JSON:
{
  "title": "...",
  "slug": "...",
  "career": "pharmacy_tech | respiratory_therapy | paramedic_ems | mlt | radiology",
  "diagramType": "...",
  "description": "...",
  "canvasWidth": 3000,
  "canvasHeight": 2000,
  "pinterestWidth": 1000,
  "pinterestHeight": 1500,
  "brandColors": { "primary": "#BFA6F6", "secondary": "#AEE3E1", "accent": "#FFD6A5", "highlight": "#FFF3B0", "text": "#2E3A59" },
  "elements": [
    { "label": "...", "description": "...", "position": "...", "color": "...", "type": "header | section | callout | formula | chart_row | tip_box" }
  ],
  "examTipBox": { "title": "...", "tips": ["..."] },
  "educationalNotes": ["..."],
  "altText": "...",
  "seoTitle": "...",
  "metaDescription": "...",
  "pinterestDescription": "...",
  "relatedTopics": ["..."],
  "watermark": "NurseNest.ca"
}`;

const NEW_GRAD_SURVIVAL_GUIDE_PROMPT = `You are a healthcare career mentor creating first-year survival guides for newly graduated healthcare professionals.

ARTICLE REQUIREMENTS:
- Length: 1500-2500 words
- Audience: new graduates in their first year of practice
- Tone: supportive, practical, evidence-based, mentoring

STRUCTURE (you MUST include ALL of these sections):
1. Title
2. What Your First Year Looks Like (timeline overview of orientation to independence)
3. Common Mistakes New Graduates Make (with strategies to avoid each)
4. Shift Organization Strategies (brain sheets, time-blocking, workflow systems)
5. Communication with Senior Staff (SBAR, asking for help, professional relationships)
6. Building Confidence (overcoming imposter syndrome, tracking growth, finding mentorship)
7. Quick Reference Checklist (printable, actionable items)
8. FAQ Section (4-6 common questions with detailed answers)

SEO OUTPUT:
- SEO title (60 chars max)
- Meta description (155 chars max)
- URL slug (lowercase, hyphenated)

FORMAT your output as valid JSON:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "title": "...",
  "summary": "2-3 sentence summary",
  "sections": [
    { "id": "...", "title": "...", "content": "paragraph text", "items": ["list item 1", "list item 2"] }
  ],
  "faqItems": [
    { "question": "...", "answer": "..." }
  ],
  "seoKeywords": ["keyword1", "keyword2"],
  "wordCount": 0
}`;

const NEW_GRAD_CLINICAL_SKILLS_PROMPT = `You are a clinical educator creating practical skills guides for new healthcare graduates.

ARTICLE REQUIREMENTS:
- Length: 1200-2000 words
- Audience: new graduates learning practical workplace skills
- Tone: instructional, supportive, clinically accurate

STRUCTURE (you MUST include ALL of these sections):
1. Title
2. Why This Skill Matters (context and impact on patient outcomes)
3. Step-by-Step Guidance (detailed, actionable instructions)
4. Common Mistakes to Avoid (with consequences and corrections)
5. Tips from Experienced Clinicians (practical wisdom from the field)
6. Quick Reference Checklist (printable, pocket-sized format)
7. FAQ Section (3-5 common questions)

FORMAT your output as valid JSON:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "title": "...",
  "summary": "...",
  "sections": [
    { "id": "...", "title": "...", "content": "...", "items": ["..."] }
  ],
  "faqItems": [{ "question": "...", "answer": "..." }],
  "seoKeywords": ["..."],
  "wordCount": 0
}`;

const NEW_GRAD_UNIT_GUIDE_PROMPT = `You are a unit-based educator creating orientation guides for new graduates starting on specific clinical units.

ARTICLE REQUIREMENTS:
- Length: 1200-2000 words
- Audience: new graduates starting on a specific clinical unit
- Tone: welcoming, practical, unit-specific detail

STRUCTURE (you MUST include ALL of these sections):
1. Title
2. What to Expect on This Unit (patient population, acuity, team structure)
3. Essential Skills for This Setting (unit-specific competencies)
4. A Typical Day on This Unit (shift flow and rhythm)
5. Survival Tips from Unit Veterans (practical wisdom)
6. Common Conditions and Diagnoses You Will See
7. FAQ Section (3-5 unit-specific questions)

FORMAT your output as valid JSON:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "title": "...",
  "summary": "...",
  "sections": [
    { "id": "...", "title": "...", "content": "...", "items": ["..."] }
  ],
  "faqItems": [{ "question": "...", "answer": "..." }],
  "seoKeywords": ["..."],
  "wordCount": 0
}`;

const NEW_GRAD_CAREER_DEVELOPMENT_PROMPT = `You are a healthcare career advisor creating career development guides for clinicians looking to advance or specialize.

ARTICLE REQUIREMENTS:
- Length: 1200-2000 words
- Audience: healthcare professionals planning career advancement
- Tone: informative, motivating, strategic

STRUCTURE (you MUST include ALL of these sections):
1. Title
2. Career Path Overview (what the role entails and why it matters)
3. Requirements and Prerequisites (education, experience, certifications)
4. Step-by-Step Career Roadmap (actionable progression plan)
5. Career Opportunities and Outlook (job market, salary, growth)
6. Resources for Getting Started (programs, certifications, networking)
7. FAQ Section (4-6 career-related questions)

FORMAT your output as valid JSON:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "title": "...",
  "summary": "...",
  "sections": [
    { "id": "...", "title": "...", "content": "...", "items": ["..."] }
  ],
  "faqItems": [{ "question": "...", "answer": "..." }],
  "seoKeywords": ["..."],
  "wordCount": 0
}`;

const NEW_GRAD_CLINICAL_SCENARIO_PROMPT = `You are a clinical simulation expert creating scenario-based learning content for new healthcare graduates.

ARTICLE REQUIREMENTS:
- Length: 1200-2000 words
- Audience: new graduates building clinical judgment through scenario practice
- Tone: realistic, educational, clinically accurate

STRUCTURE (you MUST include ALL of these sections):
1. Title
2. The Clinical Scenario (realistic patient presentation with vitals and context)
3. Recognizing the Problem (key assessment findings and warning signs)
4. Priority Interventions (step-by-step response with rationale)
5. Post-Event Debrief and Learning (reflection and knowledge consolidation)
6. Key Clinical Pearls (take-away points for practice)
7. FAQ Section (3-5 clinically relevant questions)

FORMAT your output as valid JSON:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "title": "...",
  "summary": "...",
  "sections": [
    { "id": "...", "title": "...", "content": "...", "items": ["..."] }
  ],
  "faqItems": [{ "question": "...", "answer": "..." }],
  "seoKeywords": ["..."],
  "wordCount": 0
}`;

const NEW_GRAD_NURSE_PROMPT = `You are a nursing career mentor creating educational resources for newly graduated nurses transitioning from school to clinical practice.

ARTICLE REQUIREMENTS:
- Length: 1200-2000 words
- Audience: new graduate nurses
- Tone: supportive, practical, professional

STRUCTURE (you MUST include ALL of these sections):
1. Title
2. Introduction
3. Why This Skill Matters
4. Step-by-Step Guidance
5. Common Mistakes New Nurses Make
6. Clinical Tips from Experienced Nurses
7. Quick Reference Checklist
8. Summary

SEO OUTPUT:
- SEO title (60 chars max)
- Meta description (155 chars max)
- URL slug (lowercase, hyphenated)

VISUAL CONTENT RECOMMENDATION:
Recommend one infographic or checklist. Examples:
- Patient prioritization flowchart
- SBAR communication template
- Time management checklist

FORMAT your output as valid JSON:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "title": "...",
  "article": "... (full markdown article with all sections)",
  "checklist": ["... (quick reference checklist items)"],
  "infographicRecommendation": {
    "title": "...",
    "description": "..."
  },
  "wordCount": 0
}`;

const SEO_CLUSTER_PROMPT = `You are an SEO strategist building topic clusters for NurseNest.

For each topic, generate:
- 1 pillar page
- 15 supporting pages

Each supporting page must target a different search query.

FORMAT your output as valid JSON:
{
  "clusterTopic": "...",
  "targetKeyword": "...",
  "pillarPage": {
    "title": "...",
    "slug": "...",
    "primaryKeyword": "...",
    "metaDescription": "..."
  },
  "supportingPages": [
    {
      "title": "...",
      "slug": "...",
      "primaryKeyword": "...",
      "searchIntent": "informational | transactional | navigational",
      "linkToPillar": true,
      "relatedSupportPages": ["slug1", "slug2"]
    }
  ],
  "internalLinkingPlan": {
    "pillarToSupports": ["..."],
    "supportsToPillar": ["..."],
    "supportsToRelated": [{ "from": "...", "to": "...", "anchorText": "..." }]
  }
}`;

const FLASHCARD_PROMPT = `You are creating flashcards for nursing and allied health exam preparation.

Generate 50 flashcards for the given topic.

Each flashcard must include:
- Term
- Definition
- Clinical relevance
- Exam tip

FORMAT your output as valid JSON:
{
  "topic": "...",
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "flashcards": [
    {
      "id": 1,
      "term": "...",
      "definition": "...",
      "clinicalRelevance": "...",
      "examTip": "..."
    }
  ],
  "totalCards": 50
}`;

const PINTEREST_PIN_PROMPT = `You are creating Pinterest pins for nursing education content on NurseNest.

Generate 3 pins for the given topic. Each pin should be designed to drive traffic to the NurseNest study page.

FORMAT your output as valid JSON:
{
  "topic": "...",
  "pageUrl": "...",
  "pins": [
    {
      "title": "...",
      "description": "... (compelling pin description, 100-300 chars)",
      "keywords": ["...", "...", "...", "...", "..."],
      "hashtags": ["...", "...", "...", "...", "..."],
      "boardSuggestion": "...",
      "imageSpec": {
        "width": 1000,
        "height": 1500,
        "style": "pastel clinical",
        "elements": ["..."],
        "brandColors": { "primary": "#BFA6F6", "secondary": "#AEE3E1", "accent": "#FFD6A5" }
      }
    }
  ]
}`;

const INTERNAL_LINK_PROMPT = `You are optimizing internal links for NurseNest.

For each page provided, generate an internal linking map:
- Link to its pillar page
- Link to 3 related supporting pages
- Link to 2 pages from other clusters when relevant

FORMAT your output as valid JSON:
{
  "sourcePage": "...",
  "links": [
    {
      "destinationPage": "...",
      "destinationSlug": "...",
      "anchorText": "...",
      "linkType": "pillar | supporting | cross_cluster",
      "relevanceScore": 0.0
    }
  ]
}`;

const QUESTION_BANK_PRODUCT_PROMPT = `You are packaging exam questions into sellable study products for the NurseNest store.

Generate a complete product listing with storefront copy optimized for conversions.

FORMAT your output as valid JSON:
{
  "title": "...",
  "slug": "...",
  "description": "... (compelling product description, 200-400 words)",
  "shortDescription": "... (one-liner for listings)",
  "questionCount": 0,
  "difficultyMix": { "easy": 0, "medium": 0, "hard": 0 },
  "previewQuestions": [
    {
      "stem": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "rationale": "..."
    }
  ],
  "studyTips": ["..."],
  "examsCovered": ["..."],
  "features": ["..."],
  "suggestedPrice": 0,
  "compareAtPrice": 0
}`;

const INFOGRAPHIC_PAGE_PROMPT = `You are generating SEO pages for educational infographics on NurseNest.

Use NurseNest branding: Lavender #BFA6F6, Teal #AEE3E1, Peach #FFD6A5, Yellow #FFF3B0, Text #2E3A59.

Each page must include a title, short explanation, infographic specification, and exam tips.

FORMAT your output as valid JSON:
{
  "title": "...",
  "slug": "...",
  "seoTitle": "...",
  "metaDescription": "...",
  "imageAltText": "...",
  "explanation": "... (150-200 word explanation of the infographic topic)",
  "infographicSpec": {
    "width": 3000,
    "height": 2000,
    "sections": [
      { "title": "...", "content": "...", "position": "..." }
    ],
    "colorScheme": { "primary": "#BFA6F6", "secondary": "#AEE3E1", "accent": "#FFD6A5" }
  },
  "examTips": ["..."],
  "internalLinks": [
    { "title": "...", "slug": "...", "anchorText": "..." }
  ]
}`;

export async function generateAlliedHealthQuestions(
  topic: string,
  career: string,
  difficultyRange: string,
  autoValidate: boolean,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();
  const careerLabel = ALLIED_CAREER_LABELS[career] || career;

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const [minDiff, maxDiff] = difficultyRange.split("-").map(Number);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ALLIED_HEALTH_QUESTION_PROMPT },
        {
          role: "user",
          content: `Generate a practice question bank for allied health students:

Topic: ${topic}
Career / Certification: ${careerLabel}
Number of Questions: 25
Difficulty Range: ${minDiff || 1} to ${maxDiff || 5}

Requirements:
- Mix of question types: approximately 12 multiple choice, 5 select-all-that-apply, 5 case-based, and 3 calculation questions
- Difficulty should be distributed across the range ${difficultyRange}
- Each rationale must be at least 300 words
- Include workplace scenarios that are realistic and exam-relevant for ${careerLabel}
- Cover different aspects: procedures, safety protocols, calculations, patient interactions, regulatory compliance
- Questions should progressively increase in complexity
- Include relevant values, measurements, and technical specifications where appropriate

Make questions clinically accurate and representative of the ${careerLabel} certification exam.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 12000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned from generation");

    const parsed = JSON.parse(content);

    let validationResult: any = null;
    if (autoValidate && parsed.questions) {
      validationResult = validateQuestions(parsed.questions);
    }

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "exam_question");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('question_factory', 'question', $1, $2, $3, $4, 'autopilot')`,
        [
          `Allied Health Questions: ${parsed.topic || topic} (${careerLabel})`,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, career, careerLabel,
            contentType: "allied_health", difficultyRange,
            questionCount: parsed.questions?.length || 0,
            validation: validationResult,
            slug: parsed.slug, seoTitle: parsed.seoTitle,
            metaDescription: parsed.metaDescription,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        `UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2`,
        [JSON.stringify({
          topic: parsed.topic, career,
          questionCount: parsed.questions?.length || 0,
          validation: validationResult, queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'question_factory'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generateSocialWorkQuestions(
  topic: string,
  domain: string,
  batchSize: number,
  difficultyDistribution: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SOCIAL_WORK_QUESTION_PROMPT },
        {
          role: "user",
          content: `Generate ${batchSize} ASWB-style social work licensing exam questions:

Topic: ${topic}
Primary Domain: ${domain}
Batch Size: ${batchSize}
Difficulty Distribution: ${difficultyDistribution || "35% Easy, 45% Moderate, 20% Hard"}

Requirements:
- Each question must include a realistic client scenario with psychosocial context
- Include ethical considerations and cultural elements
- Cover both ASWB and Canadian social work licensing content
- Rationales must be at least 250 words each
- Include clinical pearls and lesson links
- Distribute across question types: 40% MCQ_SINGLE, 40% CASE_BASED_CLUSTER, 20% PRIORITIZATION

Generate exactly ${batchSize} high-quality exam questions.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: Math.min(batchSize * 1500, 32000),
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned from generation");

    const parsed = JSON.parse(content);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || parsed.items || [];

    const { validationReport } = await runLanguageValidatedGeneration(
      { questions, topic, domain }, validatedLang, "social_work"
    );
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('question_factory', 'social_work_question', $1, $2, $3, $4, 'autopilot')`,
        [
          `Social Work Questions: ${topic} (${domain})`,
          JSON.stringify({ questions, topic, domain }),
          saveStatus,
          JSON.stringify({
            topic, domain, career: "socialWorker",
            contentType: "social_work", batchSize, difficultyDistribution,
            questionCount: questions.length,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        `UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2`,
        [JSON.stringify({
          topic, domain, questionCount: questions.length,
          queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    return { questions, topic, domain };
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generateAlliedHealthInfographic(
  topic: string,
  career: string,
  diagramType: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();
  const careerLabel = ALLIED_CAREER_LABELS[career] || career;

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ALLIED_HEALTH_INFOGRAPHIC_PROMPT },
        {
          role: "user",
          content: `Create a detailed infographic specification for allied health education:

Topic: ${topic}
Career: ${careerLabel}
Diagram Type: ${diagramType}

Requirements:
- Use NurseNest brand colors (Lavender, Teal, Peach, Yellow, Slate text)
- Include watermark: NurseNest.ca
- Standard canvas: 3000x2000px, Pinterest: 1000x1500px
- Include clear labels, educational notes, and an exam tip box
- Content must be specific to ${careerLabel} practice
- Make it visually clean with pastel clinical aesthetic

Generate the complete infographic specification ready for design production.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "allied_health");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('visual_factory', 'diagram', $1, $2, $3, $4, 'autopilot')`,
        [
          parsed.title || topic,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, career, careerLabel, diagramType,
            contentType: "allied_health", slug: parsed.slug,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
        [JSON.stringify({ title: parsed.title, slug: parsed.slug, career, queuedForReview: true, language_validation: validationReport }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'visual_factory'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generateNewGradNursePage(
  topic: string,
  targetKeyword: string,
  wordCount: number,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: NEW_GRAD_NURSE_PROMPT },
        {
          role: "user",
          content: `Generate a comprehensive new graduate nurse resource on:

Topic: ${topic}
Target SEO Keyword: ${targetKeyword}
Target Word Count: ${wordCount}

Requirements:
- Focus on practical, actionable guidance for new nurses entering clinical practice
- Include step-by-step instructions that a new grad can follow immediately
- Common mistakes section should reflect real-world scenarios new nurses face
- Clinical tips should come across as advice from experienced mentors
- Quick reference checklist should be printable and actionable
- Tone should be supportive and encouraging while remaining professional

Make the content practical, evidence-based, and immediately useful.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 6000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned from generation");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "new_grad");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('blog_engine', 'blog', $1, $2, $3, $4, 'autopilot')`,
        [
          parsed.title || topic,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, targetKeyword, contentType: "new_grad",
            wordCount: parsed.wordCount || wordCount,
            slug: parsed.slug, seoTitle: parsed.seoTitle,
            metaDescription: parsed.metaDescription,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        `UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2`,
        [JSON.stringify({
          title: parsed.title, slug: parsed.slug,
          wordCount: parsed.wordCount, queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'blog_engine'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generateSEOCluster(
  topic: string,
  targetKeyword: string,
  examType: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SEO_CLUSTER_PROMPT },
        {
          role: "user",
          content: `Build a complete SEO topic cluster for NurseNest:

Topic: ${topic}
Target Keyword: ${targetKeyword}
Exam Type: ${examType}

Requirements:
- 1 pillar page covering the broad topic comprehensively
- 15 supporting pages each targeting a unique, specific search query
- Each supporting page should have a clear search intent
- Internal linking plan connecting pillar to supports and supports to each other
- All slugs should be SEO-friendly and include relevant keywords
- Supporting pages should cover the topic from different angles (study guides, practice questions, clinical tips, charts, comparisons)

Make the cluster structure comprehensive and SEO-optimized.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 6000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "article");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('keyword_discovery', 'cluster', $1, $2, $3, $4, 'autopilot')`,
        [
          `Topic Cluster: ${parsed.clusterTopic || topic}`,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, targetKeyword, examType,
            pillarSlug: parsed.pillarPage?.slug,
            supportingPageCount: parsed.supportingPages?.length || 0,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
        [JSON.stringify({
          clusterTopic: parsed.clusterTopic,
          pillarSlug: parsed.pillarPage?.slug,
          supportingPages: parsed.supportingPages?.length || 0,
          queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'keyword_discovery'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generateFlashcards(
  topic: string,
  examType: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: FLASHCARD_PROMPT },
        {
          role: "user",
          content: `Generate 50 flashcards for exam preparation:

Topic: ${topic}
Target Exam: ${examType}

Requirements:
- Each flashcard must have a concise term, clear definition, clinical relevance, and a memorable exam tip
- Cover the topic comprehensively from basic to advanced concepts
- Include relevant lab values, medications, procedures, and clinical findings
- Flashcards should be suitable for spaced-repetition study
- Generate SEO metadata for the flashcard page

Make flashcards concise, accurate, and easy to study.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "flashcard");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('course_builder', 'flashcard', $1, $2, $3, $4, 'autopilot')`,
        [
          `Flashcards: ${parsed.topic || topic}`,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, examType,
            cardCount: parsed.flashcards?.length || 0,
            slug: parsed.slug,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
        [JSON.stringify({
          topic: parsed.topic,
          cardCount: parsed.flashcards?.length || 0,
          queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'course_builder'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generatePinterestPins(
  topic: string,
  pageSlug: string,
  board: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: PINTEREST_PIN_PROMPT },
        {
          role: "user",
          content: `Generate 3 Pinterest pins for NurseNest:

Topic: ${topic}
Page URL: https://nursenest.ca/${pageSlug}
Board: ${board}

Requirements:
- Each pin should have a compelling title and description
- Include 5 relevant keywords and hashtags per pin
- Pin images should use NurseNest brand colors (Lavender, Teal, Peach)
- Pins should drive clicks to the study page
- Descriptions should be engaging and educational

Make pins visually appealing and click-worthy.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "article");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('pinterest_scheduler', 'social', $1, $2, $3, $4, 'autopilot')`,
        [
          `Pinterest Pins: ${topic}`,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, pageSlug, board,
            pinCount: parsed.pins?.length || 0,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
        [JSON.stringify({
          topic, pinCount: parsed.pins?.length || 0,
          queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'pinterest_scheduler'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generateInternalLinkMap(
  pageSlug: string,
  pageTitle: string,
  clusterTopic: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: INTERNAL_LINK_PROMPT },
        {
          role: "user",
          content: `Generate an internal linking map for this NurseNest page:

Source Page: ${pageTitle}
Source Slug: ${pageSlug}
Cluster Topic: ${clusterTopic}

Requirements:
- Link to the pillar page for this cluster
- Link to 3 related supporting pages within the same cluster
- Link to 2 pages from other clusters when relevant
- Each link should have natural, descriptive anchor text
- Include a relevance score for each link

Generate the complete internal linking map.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "article");

    await pool.query(
      "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
      [JSON.stringify({
        sourcePage: pageSlug,
        linkCount: parsed.links?.length || 0,
        links: parsed.links,
        language_validation: validationReport,
      }), jobId]
    );

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'auto_expansion'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generateQuestionBankProduct(
  topic: string,
  questionCount: number,
  examType: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: QUESTION_BANK_PRODUCT_PROMPT },
        {
          role: "user",
          content: `Package a question bank product for the NurseNest store:

Topic: ${topic}
Question Count: ${questionCount}
Target Exam: ${examType}

Requirements:
- Compelling product title and description optimized for conversions
- Difficulty mix across easy, medium, and hard
- 3 preview questions with full rationales to showcase quality
- 5 study tips related to the topic
- Suggested pricing with compare-at price for perceived value
- Feature list highlighting what makes this product valuable

Make the product listing professional and conversion-optimized.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "article");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('course_builder', 'product', $1, $2, $3, $4, 'autopilot')`,
        [
          parsed.title || `${topic} Question Bank`,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, questionCount, examType,
            slug: parsed.slug,
            suggestedPrice: parsed.suggestedPrice,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
        [JSON.stringify({
          title: parsed.title, slug: parsed.slug,
          questionCount: parsed.questionCount,
          queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generateInfographicPage(
  topic: string,
  style: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: INFOGRAPHIC_PAGE_PROMPT },
        {
          role: "user",
          content: `Generate an SEO-optimized infographic page for NurseNest:

Topic: ${topic}
Style: ${style}

Requirements:
- Title and 150-200 word explanation of the topic
- Infographic specification with sections, colors, and layout
- Use NurseNest brand colors
- Include clinical exam tips related to the visual content
- Internal links to related lessons
- Complete SEO metadata including image alt text

Make the page educational, visually appealing, and SEO-optimized.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "article");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('visual_factory', 'infographic_page', $1, $2, $3, $4, 'autopilot')`,
        [
          parsed.title || topic,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, style, slug: parsed.slug,
            seoTitle: parsed.seoTitle,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
        [JSON.stringify({ title: parsed.title, slug: parsed.slug, queuedForReview: true, language_validation: validationReport }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'visual_factory'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generatePracticeQuestionPage(
  topic: string,
  category: string,
  batchSize: number,
  difficultyRange: string,
  autoValidate: boolean,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const [minDiff, maxDiff] = difficultyRange.split("-").map(Number);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: PRACTICE_QUESTION_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generate a practice question bank for the following:

Topic: ${topic}
Category: ${category}
Number of Questions: 25
Difficulty Range: ${minDiff || 1} to ${maxDiff || 5}

Requirements:
- Mix of question types: approximately 15 multiple choice, 5 select-all-that-apply, and 5 case-based
- Difficulty should be distributed across the range ${difficultyRange}
- Each rationale must be at least 300 words
- Include clinical scenarios that are realistic and exam-relevant
- Cover different aspects of the topic (assessment, interventions, medications, complications, patient education)
- Questions should progressively increase in complexity
- Include relevant lab values, vital signs, and medication dosages where appropriate

Category context:
${category === "nursing_ngn" ? "Focus on Next Generation NCLEX item types with clinical judgment emphasis" : ""}
${category === "allied" ? "Focus on allied health exam preparation across multiple disciplines" : ""}
${category === "np_canada" ? "Focus on Canadian Nurse Practitioner exam content with Canadian guidelines" : ""}
${category === "np_us" ? "Focus on AANP/ANCC NP certification exam content" : ""}

Make questions clinically accurate and exam-representative.${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 12000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned from generation");

    const parsed = JSON.parse(content);

    let validationResult: any = null;
    if (autoValidate && parsed.questions) {
      validationResult = validateQuestions(parsed.questions);
    }

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "exam_question");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('question_factory', 'question', $1, $2, $3, $4, 'autopilot')`,
        [
          `Practice Questions: ${parsed.topic || topic}`,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, category, batchSize, difficultyRange,
            questionCount: parsed.questions?.length || 0,
            validation: validationResult,
            slug: parsed.slug, seoTitle: parsed.seoTitle,
            metaDescription: parsed.metaDescription,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        `UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2`,
        [JSON.stringify({
          topic: parsed.topic,
          questionCount: parsed.questions?.length || 0,
          validation: validationResult, queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'question_factory'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

function validateQuestions(questions: any[]): {
  total: number;
  valid: number;
  issues: string[];
} {
  const issues: string[] = [];
  let valid = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const qNum = i + 1;
    let isValid = true;

    if (!q.stem && !q.question) {
      issues.push(`Q${qNum}: Missing question stem`);
      isValid = false;
    }

    if (!q.options || q.options.length < 4) {
      issues.push(`Q${qNum}: Fewer than 4 answer options`);
      isValid = false;
    }

    if (!q.correctAnswers || q.correctAnswers.length === 0) {
      if (!q.correctAnswer) {
        issues.push(`Q${qNum}: No correct answer specified`);
        isValid = false;
      }
    }

    if (!q.rationale || q.rationale.length < 100) {
      issues.push(`Q${qNum}: Rationale too short (${q.rationale?.length || 0} chars, need 100+)`);
      isValid = false;
    }

    if (!q.type) {
      issues.push(`Q${qNum}: Missing question type`);
      isValid = false;
    }

    if (q.type === "sata" && q.correctAnswers?.length < 2) {
      issues.push(`Q${qNum}: SATA question should have 2+ correct answers`);
      isValid = false;
    }

    if (isValid) valid++;
  }

  return {
    total: questions.length,
    valid,
    issues,
  };
}

export async function generateVisualDiagram(
  type: string,
  topic: string,
  style: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a medical education visual content planner. Generate a detailed specification for a nursing education diagram/infographic. Output valid JSON.`
        },
        {
          role: "user",
          content: `Create a detailed visual content specification for:
Type: ${type} (anatomy / pathophysiology / drug_mechanism / lab_values)
Topic: ${topic}
Style: ${style} (clinical / educational / infographic)

Output JSON:
{
  "title": "...",
  "description": "...",
  "slug": "...",
  "visualType": "${type}",
  "elements": [
    { "label": "...", "description": "...", "position": "top|middle|bottom|left|right", "color": "..." }
  ],
  "annotations": ["..."],
  "colorScheme": { "primary": "...", "secondary": "...", "accent": "..." },
  "altText": "...",
  "seoTitle": "...",
  "metaDescription": "...",
  "pinterestDescription": "...",
  "relatedTopics": ["..."]
}${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "article");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('visual_factory', 'diagram', $1, $2, $3, $4, 'autopilot')`,
        [
          parsed.title || topic,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            type, topic, style, slug: parsed.slug,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
        [JSON.stringify({ title: parsed.title, slug: parsed.slug, queuedForReview: true, language_validation: validationReport }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'visual_factory'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generatePracticeSEOPage(
  title: string,
  bodySystem: string,
  questionCount: number,
  tier: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a nursing SEO content specialist. Generate a practice question page optimized for search engines and nursing exam preparation. Output valid JSON.`
        },
        {
          role: "user",
          content: `Generate a practice question SEO page:
Title: ${title}
Body System: ${bodySystem}
Question Count: ${questionCount}
Tier: ${tier.toUpperCase()}

Output JSON:
{
  "title": "...",
  "seoTitle": "...",
  "metaDescription": "...",
  "slug": "...",
  "h1": "...",
  "introduction": "... (SEO-optimized intro, 200-300 words)",
  "questions": [
    {
      "id": 1,
      "scenario": "...",
      "stem": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "rationale": "...",
      "difficulty": 1-5,
      "bodySystem": "${bodySystem}",
      "tier": "${tier}"
    }
  ],
  "faqSchema": [
    { "question": "...", "answer": "..." }
  ],
  "relatedPages": ["..."],
  "keywords": ["..."]
}${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "exam_question");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('practice_seo', 'practice', $1, $2, $3, $4, 'autopilot')`,
        [
          parsed.title || title,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            bodySystem, tier, questionCount, slug: parsed.slug,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
        [JSON.stringify({ title: parsed.title, slug: parsed.slug, questionCount: parsed.questions?.length, queuedForReview: true, language_validation: validationReport }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'practice_seo'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

export async function generateCourseContent(
  topic: string,
  exam: string,
  difficulty: string,
  jobId: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();

  await pool.query(
    "UPDATE autopilot_jobs SET status = 'running', started_at = NOW() WHERE id = $1",
    [jobId]
  );

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a nursing curriculum designer. Generate a comprehensive course outline with lesson content for nursing education. Output valid JSON.`
        },
        {
          role: "user",
          content: `Build a complete course on:
Topic: ${topic}
Target Exam: ${exam.toUpperCase()}
Difficulty: ${difficulty}

Output JSON:
{
  "title": "...",
  "slug": "...",
  "description": "...",
  "exam": "${exam}",
  "difficulty": "${difficulty}",
  "estimatedHours": 0,
  "modules": [
    {
      "title": "...",
      "description": "...",
      "lessons": [
        {
          "title": "...",
          "objectives": ["..."],
          "content": "... (500-800 word lesson content in markdown)",
          "keyTerms": ["..."],
          "clinicalTips": ["..."],
          "estimatedMinutes": 0
        }
      ],
      "quiz": {
        "questions": [
          {
            "stem": "...",
            "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
            "correctAnswer": "A",
            "rationale": "..."
          }
        ]
      }
    }
  ],
  "prerequisites": ["..."],
  "learningOutcomes": ["..."]
}${buildLanguageEnforcementPrompt(validatedLang)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 10000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned");

    const parsed = JSON.parse(content);

    const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "lesson");
    const saveStatus = validationReport.validation_passed ? 'pending_review' : 'validation_failed';

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
         VALUES ('course_builder', 'course', $1, $2, $3, $4, 'autopilot')`,
        [
          parsed.title || topic,
          JSON.stringify(parsed),
          saveStatus,
          JSON.stringify({
            topic, exam, difficulty, slug: parsed.slug,
            moduleCount: parsed.modules?.length || 0,
            generatedAt: new Date().toISOString(),
            target_language: validatedLang,
            language_validation: validationReport,
          }),
        ]
      );
      await client.query(
        "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
        [JSON.stringify({
          title: parsed.title, slug: parsed.slug,
          moduleCount: parsed.modules?.length || 0,
          queuedForReview: true,
          language_validation: validationReport,
        }), jobId]
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    await pool.query(
      "UPDATE autopilot_engines SET last_run_at = NOW() WHERE engine_key = 'course_builder'"
    );

    return parsed;
  } catch (err: any) {
    await pool.query(
      "UPDATE autopilot_jobs SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2",
      [err.message, jobId]
    );
    throw err;
  }
}

const NEW_GRAD_PROMPT_MAP: Record<string, string> = {
  "survival-guide": NEW_GRAD_SURVIVAL_GUIDE_PROMPT,
  "clinical-skills": NEW_GRAD_CLINICAL_SKILLS_PROMPT,
  "unit-guide": NEW_GRAD_UNIT_GUIDE_PROMPT,
  "career-development": NEW_GRAD_CAREER_DEVELOPMENT_PROMPT,
  "clinical-scenario": NEW_GRAD_CLINICAL_SCENARIO_PROMPT,
};

export async function generateNewGradGuide(
  guideType: string,
  topic: string,
  profession: string,
  targetKeyword: string,
  targetLanguage: string = "en"
): Promise<any> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const openai = getOpenAI();
  const systemPrompt = NEW_GRAD_PROMPT_MAP[guideType] || NEW_GRAD_CLINICAL_SKILLS_PROMPT;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate a ${guideType.replace(/-/g, " ")} for new graduate ${profession} professionals on:

Topic: ${topic}
Target SEO Keyword: ${targetKeyword}
Profession: ${profession}

Requirements:
- Focus on practical, actionable guidance specific to ${profession}
- Include real-world scenarios and evidence-based recommendations
- Tone should be supportive and encouraging while remaining professional
- Include FAQ items with detailed answers
- All content should be immediately useful for new graduates${buildLanguageEnforcementPrompt(validatedLang)}`
      }
    ],
    temperature: 0.7,
    max_tokens: 8000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content returned from generation");

  const parsed = JSON.parse(content);

  const { validationReport } = await runLanguageValidatedGeneration(parsed, validatedLang, "new_grad");

  const slug = parsed.slug
    ? `new-grad/${profession}/${parsed.slug.replace(/^new-grad\/[^/]+\//, "")}`
    : `new-grad/${profession}/${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

  return {
    title: parsed.title || topic,
    slug,
    profession,
    guideType,
    category: guideType.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    summary: parsed.summary || parsed.metaDescription || "",
    content: parsed.sections ? parsed.sections.reduce((acc: any[], s: any) => {
      acc.push({ type: "heading", text: s.title });
      if (s.content) acc.push({ type: "paragraph", text: s.content });
      if (s.items?.length) acc.push({ type: "list", items: s.items });
      return acc;
    }, []) : [],
    sections: parsed.sections || [],
    seoTitle: parsed.seoTitle || parsed.title || topic,
    seoDescription: parsed.metaDescription || parsed.summary || "",
    seoKeywords: parsed.seoKeywords || [],
    faqItems: parsed.faqItems || [],
    tags: [guideType, profession, "new-grad"],
    authorName: "NurseNest Clinical Team",
  };
}
