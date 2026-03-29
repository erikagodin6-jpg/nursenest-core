export interface HeroStats {
  rpnLessons: number;
  rnLessons: number;
  npLessons: number;
  freeLessons: number;
  totalLessons: number;
  paidLessons: number;
  questionCount: number;
  storeQuestionCount: number;
  storeProductCount: number;
  lastUpdatedISO: string;
  breakdown?: {
    rpnStatic: number;
    rnStatic: number;
    npStatic: number;
    freeStatic: number;
    rpnDb: number;
    rnDb: number;
    npDb: number;
    freeDb: number;
  };
}

export interface PlatformProof {
  totalQuestions: number;
  totalFlashcards: number;
  totalDecks: number;
  totalLessons: number;
  hasCatExams: boolean;
  hasClinicalImages: boolean;
  hasMultiTierSupport: boolean;
  tiers: string[];
  rpnQuestions: number;
  rnQuestions: number;
  npQuestions: number;
  lastUpdatedISO: string;
}
