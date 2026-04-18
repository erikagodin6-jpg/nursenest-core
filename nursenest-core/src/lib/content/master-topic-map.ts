import type { ExamKey, MasterTopicMapDocument, MasterTopicMapExam, MasterTopicMapTopic } from "./master-topic-map.types";

export type { ExamKey, MasterTopicMapDocument, MasterTopicMapExam, MasterTopicMapCategory, MasterTopicMapTopic } from "./master-topic-map.types";

let masterTopicMapCache: MasterTopicMapDocument | null = null;

export function getMasterTopicMap(): MasterTopicMapDocument {
  if (masterTopicMapCache) return masterTopicMapCache;
  masterTopicMapCache = require("@/content/topic-maps/master-topic-map.json") as MasterTopicMapDocument;
  return masterTopicMapCache;
}

export function getExamTrack(exam: ExamKey): MasterTopicMapExam {
  return getMasterTopicMap().exams[exam];
}

export function findTopic(
  exam: ExamKey,
  categoryId: string,
  topicId: string,
): { category: MasterTopicMapExam["categories"][number]; topic: MasterTopicMapTopic } | null {
  const track = getExamTrack(exam);
  const category = track.categories.find((c) => c.id === categoryId);
  if (!category) return null;
  const topic = category.topics.find((t) => t.id === topicId);
  if (!topic) return null;
  return { category, topic };
}

/** Flat list with stable composite key `exam::categoryId::topicId` */
export function flattenTopicMap(): Array<{
  exam: ExamKey;
  categoryId: string;
  categoryName: string;
  topic: MasterTopicMapTopic;
}> {
  const exams: ExamKey[] = ["RN", "PN", "NP", "ALLIED"];
  const out: Array<{
    exam: ExamKey;
    categoryId: string;
    categoryName: string;
    topic: MasterTopicMapTopic;
  }> = [];
  for (const exam of exams) {
    const track = getExamTrack(exam);
    for (const cat of track.categories) {
      for (const topic of cat.topics) {
        out.push({ exam, categoryId: cat.id, categoryName: cat.name, topic });
      }
    }
  }
  return out;
}

export function countTopicsInMap(): { byExam: Record<ExamKey, number>; total: number } {
  const byExam = {
    RN: getExamTrack("RN").categories.reduce((n, c) => n + c.topics.length, 0),
    PN: getExamTrack("PN").categories.reduce((n, c) => n + c.topics.length, 0),
    NP: getExamTrack("NP").categories.reduce((n, c) => n + c.topics.length, 0),
    ALLIED: getExamTrack("ALLIED").categories.reduce((n, c) => n + c.topics.length, 0),
  };
  return { byExam, total: byExam.RN + byExam.PN + byExam.NP + byExam.ALLIED };
}
