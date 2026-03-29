import type { ExamQuestion } from "./types";

export interface CertTopicTemplate {
  topic: string;
  subtopics: {
    name: string;
    questions: ExamQuestion[];
  }[];
}

export interface CertExamConfig {
  certId: string;
  certName: string;
  topicTemplates: CertTopicTemplate[];
  mockExams: {
    id: string;
    title: string;
    questionCount: number;
    timeLimitMinutes: number;
    topicDistribution: Record<string, number>;
  }[];
}

export function getAllCertQuestions(config: CertExamConfig): ExamQuestion[] {
  const all: ExamQuestion[] = [];
  for (const template of config.topicTemplates) {
    for (const sub of template.subtopics) {
      all.push(...sub.questions);
    }
  }
  return all;
}

export function getTopicQuestions(config: CertExamConfig, topic: string): ExamQuestion[] {
  const template = config.topicTemplates.find(t => t.topic === topic);
  if (!template) return [];
  const all: ExamQuestion[] = [];
  for (const sub of template.subtopics) {
    all.push(...sub.questions);
  }
  return all;
}

export function getAlgorithmQuestions(config: CertExamConfig): ExamQuestion[] {
  const all: ExamQuestion[] = [];
  for (const template of config.topicTemplates) {
    for (const sub of template.subtopics) {
      for (const q of sub.questions) {
        if (q.t === "ordered" || q.s.toLowerCase().includes("algorithm") || q.s.toLowerCase().includes("scenario") || q.s.toLowerCase().includes("prioritization")) {
          all.push(q);
        }
      }
    }
  }
  return all;
}

export function getMockExamQuestions(config: CertExamConfig, mockExamId: string): ExamQuestion[] {
  const exam = config.mockExams.find(e => e.id === mockExamId);
  if (!exam) return [];
  const allQuestions = getAllCertQuestions(config);
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, exam.questionCount);
}

export function getCertQuestionCount(config: CertExamConfig): number {
  return getAllCertQuestions(config).length;
}

export function getCertTopics(config: CertExamConfig): string[] {
  return config.topicTemplates.map(t => t.topic);
}

export function getQuestionsByType(config: CertExamConfig, type: string): ExamQuestion[] {
  const all = getAllCertQuestions(config);
  if (type === "mcq") return all.filter(q => !q.t || q.t === "mcq");
  if (type === "sata") return all.filter(q => q.t === "sata");
  if (type === "ordered") return all.filter(q => q.t === "ordered");
  if (type === "scenario") return all.filter(q => q.s.toLowerCase().includes("scenario") || q.s.toLowerCase().includes("clinical"));
  return all;
}

export type PracticeMode = "topic" | "algorithm" | "mixed" | "mock";

export function getPracticeModeQuestions(
  configs: CertExamConfig[],
  mode: PracticeMode,
  certFilter?: string,
  topicFilter?: string,
  count?: number
): ExamQuestion[] {
  const filtered = certFilter ? configs.filter(c => c.certId === certFilter) : configs;
  let questions: ExamQuestion[] = [];

  switch (mode) {
    case "topic":
      for (const config of filtered) {
        if (topicFilter) {
          questions.push(...getTopicQuestions(config, topicFilter));
        } else {
          questions.push(...getAllCertQuestions(config));
        }
      }
      break;
    case "algorithm":
      for (const config of filtered) {
        questions.push(...getAlgorithmQuestions(config));
      }
      break;
    case "mixed":
      for (const config of filtered) {
        questions.push(...getAllCertQuestions(config));
      }
      questions = questions.sort(() => Math.random() - 0.5);
      break;
    case "mock":
      for (const config of filtered) {
        if (config.mockExams.length > 0) {
          questions.push(...getMockExamQuestions(config, config.mockExams[0].id));
        }
      }
      break;
  }

  if (count && questions.length > count) {
    questions = questions.sort(() => Math.random() - 0.5).slice(0, count);
  }

  return questions;
}
