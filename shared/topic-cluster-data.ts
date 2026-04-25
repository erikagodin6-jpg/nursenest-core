export interface TopicClusterFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface TopicNursingIntervention {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "standard";
}

export interface TopicMedication {
  id: string;
  drugClass: string;
  examples: string;
  nursingConsiderations: string;
}

export interface TopicCluster {
  id: string; // NEW — stable internal key
  slug: string;

  title: string;
  meta: {
    title: string;
    description: string;
    keywords: string;
  };

  category: string;
  parentCategorySlug: string;
  blueprintHubSlug: string;

  theme: {
    colorToken: string;        // replaces raw hex
    accentToken: string;
  };

  content: {
    introduction: string;
    clinicalExplanation: string;
  };

  nursingInterventions: TopicNursingIntervention[];
  medications: TopicMedication[];

  links: {
    previewQuestions: string[];
    lessons: string[];
    flashcards: string[];
    relatedTopics: string[];
  };

  faqs: TopicClusterFAQ[];
}