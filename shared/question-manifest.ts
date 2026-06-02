export interface TierQuestionCount {
  total: number;
  byCategory: Record<string, number>;
  byFormat: Record<string, number>;
  files: string[];
}

export interface QuestionManifest {
  generatedAt: string;
  version: number;
  static: {
    alliedHealth: Record<string, TierQuestionCount>;
    nursing: Record<string, TierQuestionCount>;
    nursingCert: Record<string, TierQuestionCount>;
  };
  database: {
    generatedQuestions: number;
    alliedQuestions: number;
    byCareerType: Record<string, number>;
  };
  totals: {
    alliedHealthStatic: number;
    nursingStatic: number;
    nursingCertStatic: number;
    databaseGenerated: number;
    publicTotal: number;
  };
  integrity: {
    fileCount: number;
    parseFailures: string[];
    contentHash: string;
  };
}
