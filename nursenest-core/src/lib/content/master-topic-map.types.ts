/** Mirrors `src/content/topic-maps/master-topic-map.json` (content production system). */

export type TopicPriority = "high_yield" | "secondary";

export type MasterTopicMapTopic = {
  id: string;
  name: string;
  priority: TopicPriority;
  /** Default difficulty 1–5 for question + lesson calibration */
  difficultyDefault: number;
  prerequisiteTopicIds: string[];
  advancedTopicIds: string[];
  questionTopicHints: string[];
  relatedToolSlugs: string[];
  autoRelatedTopicIds: string[];
};

export type MasterTopicMapCategory = {
  id: string;
  name: string;
  topics: MasterTopicMapTopic[];
};

export type MasterTopicMapExam = {
  exam: string;
  label: string;
  examFamily: string;
  /** Pathway registry IDs that should receive this lesson when published */
  pathwayIds: string[];
  categories: MasterTopicMapCategory[];
};

export type MasterTopicMapDocument = {
  version: number;
  description: string;
  qualityRules: string[];
  taggingModel: {
    exam: string;
    category: string;
    topic: string;
    difficulty: string;
    priority: string;
  };
  exams: {
    RN: MasterTopicMapExam;
    PN: MasterTopicMapExam;
    NP: MasterTopicMapExam;
    ALLIED: MasterTopicMapExam;
  };
};

export type ExamKey = keyof MasterTopicMapDocument["exams"];
