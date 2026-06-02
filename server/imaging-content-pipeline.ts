import OpenAI from "openai";
import { storage } from "./storage";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function ensureModel(model: string) {
  return model.startsWith("openai/") ? model : `openai/${model}`;
}

export async function generateImagingPhysicsTopic(params: {
  title: string;
  category: string;
  country: string;
  difficulty: number;
  modality?: string;
}): Promise<any> {
  const openai = getOpenAI();
  const { title, category, country, difficulty, modality } = params;
  const countryContext = country === "usa"
    ? "ARRT (American Registry of Radiologic Technologists) certification exam"
    : "CAMRT (Canadian Association of Medical Radiation Technologists) certification exam";

  const response = await openai.chat.completions.create({
    model: ensureModel("gpt-4o"),
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior radiography physics educator creating study materials for the ${countryContext}. Generate comprehensive, exam-focused content that helps students understand and remember key physics concepts.`
      },
      {
        role: "user",
        content: `Generate a complete physics topic study module for: "${title}" (Category: ${category}, Difficulty: ${difficulty}/3${modality ? `, Modality: ${modality}` : ""}).

Return JSON with this exact structure:
{
  "title": "string - exact topic title",
  "slug": "string - URL-friendly slug (lowercase, hyphens)",
  "content": "string - 2-3 sentence summary",
  "explanation": "string - 800-1200 word detailed explanation with **bold** for key terms",
  "category": "${category}",
  "modality": "${modality || "general"}",
  "country": "${country}",
  "examType": "string - relevant exam name (ARRT or CAMRT)",
  "keyConcepts": ["array of 4-6 key concept strings"],
  "formulas": [{"name": "string", "formula": "string", "description": "string"}],
  "examTraps": ["array of 4-6 common exam trap strings - things students get wrong"],
  "memoryAid": "string - mnemonic or memory trick for this topic",
  "clinicalRelevance": "string - 2-3 sentences on why this matters clinically",
  "factorRelationships": [{"factor1": "string", "factor2": "string", "relationship": "string - describe direct/inverse/complex"}],
  "quizItems": [
    {
      "question": "string",
      "options": ["4 answer choices"],
      "correctIndex": 0,
      "rationale": "string - 50-100 word explanation of correct answer"
    }
  ],
  "seoTitle": "string - SEO optimized title (60 chars max)",
  "seoDescription": "string - Meta description (155 chars max)",
  "difficulty": ${difficulty}
}

Generate exactly 3-5 quiz items. Make exam traps specific and actionable. The memory aid should be creative and memorable.`
      }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content returned from AI");
  return JSON.parse(content);
}

export async function generateImagingFlashcards(params: {
  topic: string;
  category: string;
  country: string;
  count: number;
}): Promise<any[]> {
  const openai = getOpenAI();
  const { topic, category, country, count } = params;
  const countryContext = country === "usa" ? "ARRT" : "CAMRT";

  const response = await openai.chat.completions.create({
    model: ensureModel("gpt-4o"),
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a radiography educator creating flashcards for ${countryContext} exam preparation. Create clear, exam-focused flashcards.`
      },
      {
        role: "user",
        content: `Generate ${count} flashcards for the topic "${topic}" (Category: ${category}).

Return JSON:
{
  "flashcards": [
    {
      "front": "string - question or term (concise)",
      "back": "string - answer or definition (detailed but under 200 words)",
      "category": "${category}",
      "difficulty": 1-3,
      "modality": "string or null"
    }
  ]
}

Mix difficulty levels. Include both factual recall and application-level cards.`
      }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content returned from AI");
  const parsed = JSON.parse(content);
  return parsed.flashcards || [];
}

export async function generateImagingQuizQuestions(params: {
  topic: string;
  category: string;
  country: string;
  count: number;
}): Promise<any[]> {
  const openai = getOpenAI();
  const { topic, category, country, count } = params;
  const countryContext = country === "usa" ? "ARRT" : "CAMRT";

  const response = await openai.chat.completions.create({
    model: ensureModel("gpt-4o"),
    temperature: 0.7,
    max_tokens: 8000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior radiography educator creating exam-style questions for the ${countryContext} certification exam. Each question should test understanding, not just recall.`
      },
      {
        role: "user",
        content: `Generate ${count} multiple-choice questions for: "${topic}" (Category: ${category}).

Return JSON:
{
  "questions": [
    {
      "question": "string - exam-style question stem",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctIndex": 0,
      "rationale": "string - 100-200 word rationale explaining why the answer is correct and why others are wrong",
      "difficulty": 1-3,
      "category": "${category}",
      "topic": "${topic}"
    }
  ]
}

Include a mix of recall, application, and analysis level questions.`
      }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content returned from AI");
  const parsed = JSON.parse(content);
  return parsed.questions || [];
}

export async function bulkGeneratePhysicsTopics(params: {
  topics: Array<{ title: string; category: string }>;
  country: string;
  difficulty?: number;
}): Promise<{ success: number; failed: number; results: any[] }> {
  const { topics, country, difficulty = 2 } = params;
  const results: any[] = [];
  let success = 0;
  let failed = 0;

  for (const topicDef of topics) {
    try {
      const generated = await generateImagingPhysicsTopic({
        title: topicDef.title,
        category: topicDef.category,
        country,
        difficulty,
      });

      const saved = await storage.createImagingPhysicsTopic({
        ...generated,
        status: "draft",
      });

      results.push({ title: topicDef.title, status: "success", id: saved.id });
      success++;
    } catch (err: any) {
      results.push({ title: topicDef.title, status: "failed", error: err.message });
      failed++;
    }
  }

  return { success, failed, results };
}

export async function bulkGenerateFlashcards(params: {
  topic: string;
  category: string;
  country: string;
  count: number;
}): Promise<{ success: number; failed: number }> {
  try {
    const cards = await generateImagingFlashcards(params);
    const toInsert = cards.map(c => ({
      front: c.front,
      back: c.back,
      category: c.category || params.category,
      modality: c.modality || null,
      difficulty: c.difficulty || 2,
      status: "draft" as const,
    }));

    if (toInsert.length > 0) {
      await storage.createImagingFlashcardsBulk(toInsert);
    }

    return { success: toInsert.length, failed: 0 };
  } catch (err: any) {
    return { success: 0, failed: params.count };
  }
}
