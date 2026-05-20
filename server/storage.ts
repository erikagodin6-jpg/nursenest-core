import { type ContentVersion, type InsertContentVersion, type User, type InsertUser, type Note, type InsertNote, type TestResult, type InsertTestResult, type UserProgress, type InsertUserProgress, type ContentItem, type InsertContentItem, type FeatureUsage, type UserFlashcard, type InsertUserFlashcard, type BlogConfig, type PageView, type InsertPageView, type UserFeedback, type InsertUserFeedback, type QotdHistory, type QotdUserAnswer, type InsertQotdUserAnswer, type QotdStreak, type EmailSubscriber, type InsertEmailSubscriber, type SocialPost, type InsertSocialPost, type DashboardWidget, type InsertDashboardWidget, type SiteImage, type InsertSiteImage, type CustomPageModule, type InsertCustomPageModule, type AudioClip, type InsertAudioClip, type LessonAudioLink, type InsertLessonAudioLink, type ExamQuestion, type InsertExamQuestion, type QuestionTypeRegistryEntry, type InsertQuestionTypeRegistryEntry, type QuestionScheduleLog, type DigitalProduct, type InsertDigitalProduct, type ProductPurchase, type InsertProductPurchase, type QbankDraft, type InsertQbankDraft, type QbankRecipe, type InsertQbankRecipe, type DiagnosticAssessment, type InsertDiagnosticAssessment, type UserStats, type InsertUserStats, type StudyGroup, type InsertStudyGroup, type StudyGroupMember, type InsertStudyGroupMember, type QuestionAnalytics, type InsertQuestionAnalytics, type FriendRequest, type InsertFriendRequest, type FriendConnection, type InsertFriendConnection, type ProductGeneration, type InsertProductGeneration, type GeneratedQuestion, type InsertGeneratedQuestion, type GeneratorV2PresentationSettings, type InsertGeneratorV2PresentationSettings, type TesterInviteCode, type InsertTesterInviteCode, type TesterFeedback, type InsertTesterFeedback, type PricingPlan, type InsertPricingPlan, type FreeTrialUsage, type InsertFreeTrialUsage, type UserSubscription, type InsertUserSubscription, type MltLabImage, type InsertMltLabImage, type MltLabImageLink, type InsertMltLabImageLink, type MltImageDrillAttempt, type InsertMltImageDrillAttempt, type QuestionExplanation, type InsertQuestionExplanation, type ImagingQuestion, type InsertImagingQuestion, type ImageAsset, type InsertImageAsset, type ImagingFlashcard, type InsertImagingFlashcard, type ImagingCaseStudy, type InsertImagingCaseStudy, type ImagingArtifactImage, type InsertImagingArtifactImage, type ImagingComparisonSet, type InsertImagingComparisonSet, type ImagingAnatomyImage, type InsertImagingAnatomyImage, type ImagingPhysicsVisual, type InsertImagingPhysicsVisual, type ImagingImageBrief, type InsertImagingImageBrief, type ImagingExamAttempt, type InsertImagingExamAttempt, type ImagingExamAttemptQuestion, type InsertImagingExamAttemptQuestion, type ImagingPositioningEntry, type CaseStudy, type InsertCaseStudy, type CaseStudyStep, type InsertCaseStudyStep, type CaseStudyQuestion, type InsertCaseStudyQuestion, type InsertImagingPositioningEntry, type ImagingPhysicsTopic, type InsertImagingPhysicsTopic, type QuestionBankItem, type InsertQuestionBankItem, type QuestionBankResult, type InsertQuestionBankResult, users, notes, testResults, userProgress, contentItems, featureUsage, userFlashcards, blogConfig, pageViews, userFeedback, qotdHistory, qotdUserAnswers, qotdStreaks, emailSubscribers, socialPosts, dashboardWidgets, siteImages, customPageModules, audioClips, lessonAudioLinks, examQuestions, questionTypeRegistry, questionScheduleLog, digitalProducts, productPurchases, couponCodes, qbankDrafts, qbankRecipes, diagnosticAssessments, userStats, studyGroups, studyGroupMembers, questionAnalytics, friendRequests, friendConnections, productGenerations, generatedQuestions, generatorV2PresentationSettings, generationEvents, v2ContentBlocks, testerInviteCodes, testerFeedback, imagingQuestions, imageAssets, imagingFlashcards, imagingCaseStudies, imagingExamAttempts, imagingExamAttemptQuestions, imagingPositioningEntries, imagingPhysicsTopics, questionBank, questionBankResults, mltLabImages, mltLabImageLinks, mltImageDrillAttempts, imagingArtifactImages, imagingComparisonSets, imagingAnatomyImages, imagingPhysicsVisuals, imagingImageBriefs, type ProblemReport, type InsertProblemReport, type TestBankCollection, type InsertTestBankCollection, type TestBankProgress, type InsertTestBankProgress, type QuestionHistory, type InsertQuestionHistory, type CatSession, type InsertCatSession, type UserActivityLog, type InsertUserActivityLog, type DashboardResumeState, type InsertDashboardResumeState, type AnalyticsEvent, type InsertAnalyticsEvent, testBankCollections, testBankProgress, questionHistory, catSessions, userActivityLog, dashboardResumeState , type LessonBookmark, type InsertLessonBookmark, type MockExamSessionProgress, type InsertMockExamSessionProgress, lessonBookmarks, mockExamSessionProgress } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, or, desc, sql, lte, ne, ilike, gte, count, inArray, isNotNull } from "drizzle-orm";
import pg from "pg";

export const MAX_QUERY_LIMIT = 2000;

function capLimit(limit: number | undefined, defaultLimit: number): number {
  if (limit === undefined) return defaultLimit;
  return Math.min(limit, MAX_QUERY_LIMIT);
}

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(userId: string, updates: { displayName?: string; country?: string; examTrack?: string; careerType?: string; onboardingComplete?: boolean; onboardingCompleted?: boolean; region?: string; role?: string; studyGoal?: string; dailyStudyTime?: string; examType?: string }): Promise<User>;
  updateUserTier(userId: string, tier: string): Promise<void>;
  updateUserTheme(userId: string, theme: string): Promise<void>;
  updateUserStripeInfo(userId: string, info: { stripeCustomerId?: string; stripeSubscriptionId?: string; subscriptionStatus?: string; tier?: string }): Promise<User>;
  getNote(userId: string, lessonId: string): Promise<Note | undefined>;
  getNotesByUser(userId: string): Promise<Note[]>;
  upsertNote(note: InsertNote): Promise<Note>;
  deleteNote(userId: string, lessonId: string): Promise<void>;
  getTestResults(userId: string, lessonId?: string): Promise<TestResult[]>;
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getUserProgress(userId: string, limit?: number, offset?: number): Promise<UserProgress[]>;
  getProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  upsertProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getProduct(productId: string): Promise<any>;
  listProducts(active?: boolean): Promise<any[]>;
  listProductsWithPrices(active?: boolean): Promise<any[]>;
  getPrice(priceId: string): Promise<any>;
  getPricesForProduct(productId: string): Promise<any[]>;
  getSubscription(subscriptionId: string): Promise<any>;
  getFeatureUsage(userId: string, feature: string, date: string): Promise<FeatureUsage | undefined>;
  incrementFeatureUsage(userId: string, feature: string, date: string): Promise<FeatureUsage>;
  getAllContentItems(limit?: number, offset?: number): Promise<ContentItem[]>;
  getContentItem(id: string): Promise<ContentItem | undefined>;
  getContentItemBySlug(slug: string): Promise<ContentItem | undefined>;
  getPublishedContent(type?: string, category?: string, limit?: number, offset?: number): Promise<ContentItem[]>;
  getScheduledContentDue(): Promise<ContentItem[]>;
  publishScheduledContent(): Promise<number>;
  checkDuplicateSlug(slug: string, excludeId?: string): Promise<boolean>;
  checkKeywordOverlap(primaryKeyword: string, excludeId?: string): Promise<ContentItem[]>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: string, updates: Partial<InsertContentItem>): Promise<ContentItem>;
  deleteContentItem(id: string): Promise<void>;
  getUserFlashcards(userId: string, limit?: number, offset?: number): Promise<UserFlashcard[]>;
  createUserFlashcard(card: InsertUserFlashcard): Promise<UserFlashcard>;
  updateUserFlashcard(id: string, userId: string, updates: Partial<InsertUserFlashcard>): Promise<UserFlashcard>;
  deleteUserFlashcard(id: string, userId: string): Promise<void>;
  getBlogConfig(): Promise<BlogConfig | undefined>;
  upsertBlogConfig(config: Partial<BlogConfig>): Promise<BlogConfig>;
  createPageView(view: InsertPageView): Promise<PageView>;
  getPageViewAnalytics(days?: number): Promise<any>;
  updatePageViewDuration(sessionId: string, page: string, duration: number): Promise<void>;
  createFeedback(feedback: InsertUserFeedback): Promise<UserFeedback>;
  getAllFeedback(): Promise<UserFeedback[]>;
  updateFeedback(id: string, updates: Partial<UserFeedback>): Promise<UserFeedback>;
  upvoteFeedback(id: string): Promise<UserFeedback>;
  getQotdByDate(date: string): Promise<QotdHistory | undefined>;
  createQotd(data: Partial<QotdHistory>): Promise<QotdHistory>;
  getRecentQotd(limit?: number): Promise<QotdHistory[]>;
  getQotdUserAnswer(userId: string, questionDate: string): Promise<QotdUserAnswer | undefined>;
  createQotdUserAnswer(data: InsertQotdUserAnswer): Promise<QotdUserAnswer>;
  recordQotdAnswer(data: InsertQotdUserAnswer, isCorrect: boolean): Promise<{ answer: QotdUserAnswer; streak: QotdStreak }>;
  getQotdUserHistory(userId: string, limit?: number): Promise<QotdUserAnswer[]>;
  getQotdStreak(userId: string): Promise<QotdStreak | undefined>;
  upsertQotdStreak(userId: string, isCorrect: boolean, answerDate: string): Promise<QotdStreak>;
  createEmailSubscriber(data: InsertEmailSubscriber): Promise<EmailSubscriber>;
  getEmailSubscriberByEmail(email: string): Promise<EmailSubscriber | undefined>;
  updateEmailSubscriber(email: string, updates: Partial<InsertEmailSubscriber>): Promise<EmailSubscriber | undefined>;
  deleteEmailSubscriber(email: string): Promise<void>;
  getAllSocialPosts(): Promise<SocialPost[]>;
  getScheduledSocialPosts(): Promise<SocialPost[]>;
  getSocialPost(id: string): Promise<SocialPost | undefined>;
  createSocialPost(data: InsertSocialPost): Promise<SocialPost>;
  updateSocialPost(id: string, updates: Partial<SocialPost>): Promise<SocialPost>;
  deleteSocialPost(id: string): Promise<void>;
  getDashboardWidgets(userId: string): Promise<DashboardWidget[]>;
  saveDashboardWidgets(userId: string, widgets: { widgetType: string; position: number; visible: boolean; config?: any }[]): Promise<DashboardWidget[]>;
  getAllSiteImages(): Promise<SiteImage[]>;
  getSiteImage(key: string): Promise<SiteImage | undefined>;
  upsertSiteImage(key: string, url: string, alt?: string): Promise<SiteImage>;
  deleteSiteImage(key: string): Promise<void>;
  getCustomModules(page: string): Promise<CustomPageModule[]>;
  getCustomModule(id: string): Promise<CustomPageModule | undefined>;
  createCustomModule(data: InsertCustomPageModule): Promise<CustomPageModule>;
  updateCustomModule(id: string, updates: Partial<InsertCustomPageModule>): Promise<CustomPageModule>;
  deleteCustomModule(id: string): Promise<void>;
  getAllAudioClips(): Promise<AudioClip[]>;
  getAudioClip(id: string): Promise<AudioClip | undefined>;
  getAudioClipsByCategory(category: string): Promise<AudioClip[]>;
  createAudioClip(clip: InsertAudioClip): Promise<AudioClip>;
  updateAudioClip(id: string, updates: Partial<InsertAudioClip>): Promise<AudioClip>;
  deleteAudioClip(id: string): Promise<void>;
  getLessonAudioLinks(lessonId: string): Promise<(LessonAudioLink & { clip: AudioClip })[]>;
  createLessonAudioLink(link: InsertLessonAudioLink): Promise<LessonAudioLink>;
  deleteLessonAudioLink(id: string): Promise<void>;
  getAllExamQuestions(filters?: { tier?: string; exam?: string; questionType?: string; status?: string; bodySystem?: string; limit?: number; offset?: number }): Promise<ExamQuestion[]>;
  getExamQuestion(id: string): Promise<ExamQuestion | undefined>;
  createExamQuestion(q: InsertExamQuestion): Promise<ExamQuestion>;
  createExamQuestionsBulk(questions: InsertExamQuestion[]): Promise<ExamQuestion[]>;
  updateExamQuestion(id: string, updates: Partial<InsertExamQuestion>): Promise<ExamQuestion>;
  deleteExamQuestion(id: string): Promise<void>;
  publishScheduledQuestions(): Promise<number>;
  getQuestionTypeRegistry(exam?: string): Promise<QuestionTypeRegistryEntry[]>;
  upsertQuestionTypeRegistry(entry: InsertQuestionTypeRegistryEntry): Promise<QuestionTypeRegistryEntry>;
  createQuestionScheduleLog(log: { questionId: string; action: string; previousStatus?: string; newStatus?: string; actorId?: string }): Promise<QuestionScheduleLog>;
  listDigitalProducts(activeOnly?: boolean): Promise<DigitalProduct[]>;
  getDigitalProduct(id: string): Promise<DigitalProduct | undefined>;
  getDigitalProductBySlug(slug: string): Promise<DigitalProduct | undefined>;
  createDigitalProduct(product: InsertDigitalProduct): Promise<DigitalProduct>;
  updateDigitalProduct(id: string, updates: Partial<InsertDigitalProduct>): Promise<DigitalProduct>;
  deleteDigitalProduct(id: string): Promise<void>;
  createProductPurchase(purchase: InsertProductPurchase): Promise<ProductPurchase>;
  getUserPurchases(userId: string): Promise<(ProductPurchase & { product: DigitalProduct })[]>;
  getPurchase(id: string): Promise<ProductPurchase | undefined>;
  incrementDownloadCount(purchaseId: string): Promise<void>;
  getProductSales(): Promise<{ productId: string; title: string; totalSales: number; totalRevenue: number }[]>;
  validateCoupon(code: string): Promise<{ valid: boolean; discountType?: string; discountValue?: number }>;
  useCoupon(code: string): Promise<void>;

  listQbankDrafts(): Promise<QbankDraft[]>;
  getQbankDraft(id: string): Promise<QbankDraft | undefined>;
  createQbankDraft(draft: InsertQbankDraft): Promise<QbankDraft>;
  updateQbankDraft(id: string, updates: Partial<InsertQbankDraft>): Promise<QbankDraft>;
  deleteQbankDraft(id: string): Promise<void>;

  listQbankRecipes(): Promise<QbankRecipe[]>;
  getQbankRecipe(id: string): Promise<QbankRecipe | undefined>;
  createQbankRecipe(recipe: InsertQbankRecipe): Promise<QbankRecipe>;
  updateQbankRecipe(id: string, updates: Partial<InsertQbankRecipe>): Promise<QbankRecipe>;
  deleteQbankRecipe(id: string): Promise<void>;

  createDiagnosticAssessment(data: InsertDiagnosticAssessment): Promise<DiagnosticAssessment>;
  getDiagnosticAssessment(id: string): Promise<DiagnosticAssessment | undefined>;
  getUserDiagnostics(userId: string): Promise<DiagnosticAssessment[]>;

  getUserStats(userId: string): Promise<UserStats | undefined>;
  upsertUserStats(userId: string, updates: Partial<InsertUserStats>): Promise<UserStats>;

  createStudyGroup(data: InsertStudyGroup): Promise<StudyGroup>;
  getStudyGroup(id: string): Promise<StudyGroup | undefined>;
  getStudyGroupByCode(code: string): Promise<StudyGroup | undefined>;
  getUserStudyGroups(userId: string): Promise<StudyGroup[]>;
  addStudyGroupMember(data: InsertStudyGroupMember): Promise<StudyGroupMember>;
  getStudyGroupMembers(groupId: string): Promise<(StudyGroupMember & { username: string; stats?: UserStats })[]>;
  removeStudyGroupMember(groupId: string, userId: string): Promise<void>;

  getQuestionAnalytics(questionId: string): Promise<QuestionAnalytics | undefined>;
  upsertQuestionAnalytics(data: InsertQuestionAnalytics): Promise<QuestionAnalytics>;

  createFriendRequest(data: InsertFriendRequest): Promise<FriendRequest>;
  getFriendRequest(id: string): Promise<FriendRequest | undefined>;
  getPendingFriendRequests(userId: string): Promise<FriendRequest[]>;
  updateFriendRequestStatus(id: string, status: string): Promise<FriendRequest>;

  createFriendConnection(data: InsertFriendConnection): Promise<FriendConnection>;
  getUserFriendConnections(userId: string): Promise<FriendConnection[]>;
  removeFriendConnection(id: string): Promise<void>;

  createProductGeneration(data: InsertProductGeneration): Promise<ProductGeneration>;
  getProductGeneration(id: string): Promise<ProductGeneration | undefined>;
  updateProductGeneration(id: string, updates: Partial<InsertProductGeneration> & { createdCount?: number; status?: string; lastError?: string | null; startedAt?: Date; completedAt?: Date; promptState?: any }): Promise<ProductGeneration>;
  listProductGenerations(): Promise<ProductGeneration[]>;
  deleteProductGeneration(id: string): Promise<void>;

  createGeneratedQuestion(data: InsertGeneratedQuestion): Promise<GeneratedQuestion>;
  createGeneratedQuestionsBulk(data: InsertGeneratedQuestion[]): Promise<GeneratedQuestion[]>;
  getGeneratedQuestions(generationId: string): Promise<GeneratedQuestion[]>;
  getGeneratedQuestionCount(generationId: string): Promise<number>;
  deleteGeneratedQuestion(id: string): Promise<void>;
  updateGeneratedQuestion(id: string, data: Partial<{ stem: string; scenario: string; choices: any; correctAnswers: any; rationale: any; examPearl: string }>): Promise<any>;

  createGenerationEvent(data: { generationId: string; eventType: string; payload?: any }): Promise<void>;
  getGenerationEvents(generationId: string): Promise<any[]>;

  createTaxonomyReviewEntry(data: any): Promise<any>;
  listTaxonomyReviewQueue(filters?: { status?: string; system?: string }): Promise<any[]>;
  resolveTaxonomyReviewEntry(id: string, data: { resolvedTopic: string; resolvedSystem: string; resolvedBy: string }): Promise<any>;

  getAllImagingQuestions(filters?: { country?: string; examType?: string; topic?: string; difficulty?: string; status?: string }): Promise<ImagingQuestion[]>;
  getImagingQuestion(id: string): Promise<ImagingQuestion | undefined>;
  createImagingQuestion(q: InsertImagingQuestion): Promise<ImagingQuestion>;
  createImagingQuestionsBulk(questions: InsertImagingQuestion[]): Promise<ImagingQuestion[]>;
  updateImagingQuestion(id: string, updates: Partial<InsertImagingQuestion>): Promise<ImagingQuestion>;
  deleteImagingQuestion(id: string): Promise<void>;

  getAllImageAssets(filters?: { country?: string; assetType?: string; modality?: string; approvalStatus?: string }): Promise<ImageAsset[]>;
  getImageAsset(id: string): Promise<ImageAsset | undefined>;
  createImageAsset(a: InsertImageAsset): Promise<ImageAsset>;
  updateImageAsset(id: string, updates: Partial<InsertImageAsset>): Promise<ImageAsset>;
  deleteImageAsset(id: string): Promise<void>;

  getAllImagingFlashcards(filters?: { country?: string; examType?: string; topic?: string; status?: string }): Promise<ImagingFlashcard[]>;
  getImagingFlashcard(id: string): Promise<ImagingFlashcard | undefined>;
  createImagingFlashcard(f: InsertImagingFlashcard): Promise<ImagingFlashcard>;
  createImagingFlashcardsBulk(flashcards: InsertImagingFlashcard[]): Promise<ImagingFlashcard[]>;
  updateImagingFlashcard(id: string, updates: Partial<InsertImagingFlashcard>): Promise<ImagingFlashcard>;
  deleteImagingFlashcard(id: string): Promise<void>;

  getAllImagingCaseStudies(filters?: { country?: string; examType?: string; status?: string }): Promise<ImagingCaseStudy[]>;
  getImagingCaseStudy(id: string): Promise<ImagingCaseStudy | undefined>;
  createImagingCaseStudy(c: InsertImagingCaseStudy): Promise<ImagingCaseStudy>;
  updateImagingCaseStudy(id: string, updates: Partial<InsertImagingCaseStudy>): Promise<ImagingCaseStudy>;
  deleteImagingCaseStudy(id: string): Promise<void>;

  getImagingExamAttempt(id: string): Promise<ImagingExamAttempt | undefined>;
  getUserImagingExamAttempts(userId: string): Promise<ImagingExamAttempt[]>;
  createImagingExamAttempt(a: InsertImagingExamAttempt): Promise<ImagingExamAttempt>;
  updateImagingExamAttempt(id: string, updates: Partial<InsertImagingExamAttempt>): Promise<ImagingExamAttempt>;

  getImagingExamAttemptQuestions(attemptId: string): Promise<ImagingExamAttemptQuestion[]>;
  createImagingExamAttemptQuestion(q: InsertImagingExamAttemptQuestion): Promise<ImagingExamAttemptQuestion>;
  updateImagingExamAttemptQuestion(id: string, updates: Partial<InsertImagingExamAttemptQuestion>): Promise<ImagingExamAttemptQuestion>;

  getAllImagingPositioningEntries(filters?: { country?: string; bodyRegion?: string; status?: string }): Promise<ImagingPositioningEntry[]>;
  getImagingPositioningEntry(id: string): Promise<ImagingPositioningEntry | undefined>;
  getImagingPositioningEntryBySlug(slug: string, country?: string): Promise<ImagingPositioningEntry | undefined>;
  createImagingPositioningEntry(e: InsertImagingPositioningEntry): Promise<ImagingPositioningEntry>;
  updateImagingPositioningEntry(id: string, updates: Partial<InsertImagingPositioningEntry>): Promise<ImagingPositioningEntry>;
  deleteImagingPositioningEntry(id: string): Promise<void>;

  getAllImagingPhysicsTopics(filters?: { country?: string; category?: string; status?: string }): Promise<ImagingPhysicsTopic[]>;
  getImagingPhysicsTopic(id: string): Promise<ImagingPhysicsTopic | undefined>;
  createImagingPhysicsTopic(t: InsertImagingPhysicsTopic): Promise<ImagingPhysicsTopic>;
  updateImagingPhysicsTopic(id: string, updates: Partial<InsertImagingPhysicsTopic>): Promise<ImagingPhysicsTopic>;
  deleteImagingPhysicsTopic(id: string): Promise<void>;

  getAllImagingArtifactImages(filters?: { artifactType?: string; status?: string }): Promise<ImagingArtifactImage[]>;
  getImagingArtifactImage(id: string): Promise<ImagingArtifactImage | undefined>;
  createImagingArtifactImage(a: InsertImagingArtifactImage): Promise<ImagingArtifactImage>;
  updateImagingArtifactImage(id: string, updates: Partial<InsertImagingArtifactImage>): Promise<ImagingArtifactImage>;
  deleteImagingArtifactImage(id: string): Promise<void>;

  getAllImagingComparisonSets(filters?: { comparisonType?: string; status?: string }): Promise<ImagingComparisonSet[]>;
  getImagingComparisonSet(id: string): Promise<ImagingComparisonSet | undefined>;
  createImagingComparisonSet(s: InsertImagingComparisonSet): Promise<ImagingComparisonSet>;
  updateImagingComparisonSet(id: string, updates: Partial<InsertImagingComparisonSet>): Promise<ImagingComparisonSet>;
  deleteImagingComparisonSet(id: string): Promise<void>;

  getAllImagingAnatomyImages(filters?: { bodyRegion?: string; status?: string }): Promise<ImagingAnatomyImage[]>;
  getImagingAnatomyImage(id: string): Promise<ImagingAnatomyImage | undefined>;
  createImagingAnatomyImage(a: InsertImagingAnatomyImage): Promise<ImagingAnatomyImage>;
  updateImagingAnatomyImage(id: string, updates: Partial<InsertImagingAnatomyImage>): Promise<ImagingAnatomyImage>;
  deleteImagingAnatomyImage(id: string): Promise<void>;

  getAllImagingPhysicsVisuals(filters?: { category?: string; status?: string }): Promise<ImagingPhysicsVisual[]>;
  getImagingPhysicsVisual(id: string): Promise<ImagingPhysicsVisual | undefined>;
  createImagingPhysicsVisual(v: InsertImagingPhysicsVisual): Promise<ImagingPhysicsVisual>;
  updateImagingPhysicsVisual(id: string, updates: Partial<InsertImagingPhysicsVisual>): Promise<ImagingPhysicsVisual>;
  deleteImagingPhysicsVisual(id: string): Promise<void>;

  getAllImagingImageBriefs(filters?: { status?: string; targetCategory?: string; priority?: string }): Promise<ImagingImageBrief[]>;
  getImagingImageBrief(id: string): Promise<ImagingImageBrief | undefined>;
  createImagingImageBrief(b: InsertImagingImageBrief): Promise<ImagingImageBrief>;
  updateImagingImageBrief(id: string, updates: Partial<InsertImagingImageBrief>): Promise<ImagingImageBrief>;
  deleteImagingImageBrief(id: string): Promise<void>;

  getQuestionBankItems(filters?: {
    country?: string;
    examType?: string;
    category?: string;
    difficulty?: string;
    topic?: string;
    status?: string;
    contentTiersIn?: string[];
    requireNonNullContentTier?: boolean;
  }): Promise<QuestionBankItem[]>;
  getQuestionBankItem(id: string): Promise<QuestionBankItem | undefined>;
  createQuestionBankItem(item: InsertQuestionBankItem): Promise<QuestionBankItem>;
  createQuestionBankItemsBulk(items: InsertQuestionBankItem[]): Promise<QuestionBankItem[]>;
  updateQuestionBankItem(id: string, updates: Partial<InsertQuestionBankItem>): Promise<QuestionBankItem>;
  toggleQuestionBankItemStatus(id: string): Promise<QuestionBankItem>;
  getQuestionBankRandomSubset(
    filters: {
      country: string;
      examType: string;
      category?: string;
      difficulty?: string;
      contentTiersIn?: string[];
      requireNonNullContentTier?: boolean;
    },
    count: number,
  ): Promise<QuestionBankItem[]>;
  createQuestionBankResult(result: InsertQuestionBankResult): Promise<QuestionBankResult>;
  getUserQuestionBankResults(userId: string): Promise<QuestionBankResult[]>;
  getQuestionBankAnalytics(): Promise<{ category: string; difficulty: string; totalAttempts: number; correctRate: number }[]>;

  getAllMltLabImages(filters?: { discipline?: string; imageType?: string; status?: string; approvalExam?: boolean; approvalLesson?: boolean }): Promise<MltLabImage[]>;
  getMltLabImage(id: string): Promise<MltLabImage | undefined>;
  createMltLabImage(image: InsertMltLabImage): Promise<MltLabImage>;
  updateMltLabImage(id: string, updates: Partial<InsertMltLabImage>): Promise<MltLabImage>;
  deleteMltLabImage(id: string): Promise<void>;
  getMltLabImageLinks(imageId: string): Promise<MltLabImageLink[]>;
  getMltLabImageLinksForTarget(linkedType: string, linkedId: string): Promise<(MltLabImageLink & { image: MltLabImage })[]>;
  createMltLabImageLink(link: InsertMltLabImageLink): Promise<MltLabImageLink>;
  deleteMltLabImageLink(id: string): Promise<void>;
  createMltImageDrillAttempt(attempt: InsertMltImageDrillAttempt): Promise<MltImageDrillAttempt>;
  getUserMltImageDrillAttempts(userId: string): Promise<MltImageDrillAttempt[]>;
  updateMltImageDrillAttempt(id: string, updates: Partial<InsertMltImageDrillAttempt>): Promise<MltImageDrillAttempt>;

  getAllCaseStudies(filters?: { tier?: string; status?: string; difficulty?: string }): Promise<CaseStudy[]>;
  getCaseStudy(id: string): Promise<CaseStudy | undefined>;
  createCaseStudy(data: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: string, updates: Partial<InsertCaseStudy>): Promise<CaseStudy>;
  deleteCaseStudy(id: string): Promise<void>;
  getCaseStudySteps(caseId: string): Promise<CaseStudyStep[]>;
  getCaseStudyStep(id: string): Promise<CaseStudyStep | undefined>;
  createCaseStudyStep(data: InsertCaseStudyStep): Promise<CaseStudyStep>;
  updateCaseStudyStep(id: string, updates: Partial<InsertCaseStudyStep>): Promise<CaseStudyStep>;
  deleteCaseStudyStep(id: string): Promise<void>;
  getCaseStudyQuestions(stepId: string): Promise<CaseStudyQuestion[]>;
  getCaseStudyQuestion(id: string): Promise<CaseStudyQuestion | undefined>;
  createCaseStudyQuestion(data: InsertCaseStudyQuestion): Promise<CaseStudyQuestion>;
  updateCaseStudyQuestion(id: string, updates: Partial<InsertCaseStudyQuestion>): Promise<CaseStudyQuestion>;
  deleteCaseStudyQuestion(id: string): Promise<void>;
  getCaseStudyFull(id: string): Promise<{ study: CaseStudy; steps: (CaseStudyStep & { questions: CaseStudyQuestion[] })[] } | undefined>;

  getAllPricingPlans(): Promise<PricingPlan[]>;
  getPricingPlansByTier(tier: string): Promise<PricingPlan[]>;
  getPricingPlan(id: string): Promise<PricingPlan | undefined>;
  updatePricingPlan(id: string, updates: Partial<InsertPricingPlan>): Promise<PricingPlan>;

  getFreeTrialUsage(userId: string): Promise<FreeTrialUsage | undefined>;
  upsertFreeTrialUsage(userId: string, updates: Partial<{ questionsUsed: number; flashcardsUsed: number; catExamsUsed: number }>): Promise<FreeTrialUsage>;
  incrementFreeTrialUsage(userId: string, field: "questionsUsed" | "flashcardsUsed" | "catExamsUsed"): Promise<FreeTrialUsage>;

  setUserLifetime(userId: string): Promise<void>;

  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  upsertUserSubscription(userId: string, data: Partial<InsertUserSubscription>): Promise<UserSubscription>;

  getAllLessons(filters?: { category?: string; tier?: string; status?: string; limit?: number; offset?: number }): Promise<any[]>;
  getLessonBySlug(slug: string): Promise<any | undefined>;
  getLessonById(id: string): Promise<any | undefined>;
  createLesson(data: any): Promise<any>;
  updateLesson(id: string, updates: any): Promise<any>;
  deleteLesson(id: string): Promise<void>;
  getRelatedLessons(slug: string, limit?: number): Promise<any[]>;
  getLessonCount(filters?: { category?: string; tier?: string; status?: string }): Promise<number>;
  bulkCreateLessons(lessons: any[]): Promise<any[]>;
  getAllPublishedLessonSlugs(): Promise<string[]>;

  createProblemReport(data: InsertProblemReport): Promise<ProblemReport>;
  getProblemReports(filters?: { problemType?: string; siteSection?: string; status?: string; tier?: string; startDate?: string; endDate?: string }): Promise<ProblemReport[]>;
  updateProblemReport(id: string, updates: { status?: string; adminNotes?: string }): Promise<ProblemReport>;

  getExplanation(questionId: string, source: string): Promise<QuestionExplanation | undefined>;
  upsertExplanation(data: InsertQuestionExplanation): Promise<QuestionExplanation>;
  listMissingExplanations(source: string, limit: number): Promise<{ id: string; stem: string; options: any; correctAnswer: any }[]>;
  listLowQualityExplanations(threshold: number): Promise<QuestionExplanation[]>;
  updateReviewStatus(id: string, status: string): Promise<QuestionExplanation>;
  getExplanationStats(): Promise<{ source: string; total: number; pending: number; approved: number; flagged: number; avgQuality: number }[]>;
  listExplanations(filters: { status?: string; source?: string; minQuality?: number; maxQuality?: number; generatedBy?: string; limit?: number; offset?: number }): Promise<{ rows: QuestionExplanation[]; total: number }>;
  updateExplanation(id: string, updates: Partial<{ correctAnswerExplanation: string; incorrectAnswerRationale: any; clinicalReasoning: string | null; keyTakeaway: string | null; mnemonic: string | null; clinicalPearl: string | null; referenceSource: string | null; reviewStatus: string; relatedContent: any }>): Promise<QuestionExplanation>;
  getExplanationById(id: string): Promise<QuestionExplanation | undefined>;
  getRelatedContentForExplanation(questionId: string, source: string): Promise<{ relatedQuestions: any[]; relatedLessons: any[]; relatedFlashcards: any[] }>;

  getJobListings(filters?: { location?: string; profession?: string; experienceLevel?: string; search?: string; status?: string; featured?: boolean; limit?: number; offset?: number }): Promise<{ rows: any[]; total: number }>;
  getJobListingBySlug(slug: string): Promise<any | undefined>;
  getJobListing(id: string): Promise<any | undefined>;
  createJobListing(data: any): Promise<any>;
  createJobListingsBulk(data: any[]): Promise<any[]>;
  getFeaturedJobListings(limit?: number): Promise<any[]>;

  getContentVersion(id: string): Promise<ContentVersion | undefined>;
  getContentVersionHistory(contentId: string, contentType: string, limit?: number, offset?: number): Promise<{ versions: ContentVersion[]; total: number }>;
  getLatestVerifiedVersion(contentId: string, contentType: string): Promise<ContentVersion | undefined>;
  listContentVersions(filters?: { contentType?: string; validationStatus?: string; limit?: number; offset?: number }): Promise<{ versions: ContentVersion[]; total: number }>;
  createContentVersion(data: InsertContentVersion): Promise<ContentVersion>;
  updateContentVersionStatus(id: string, validationStatus: string): Promise<ContentVersion | undefined>;
  deleteContentVersion(id: string): Promise<boolean>;

  createAnalyticsEvent(data: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  createAnalyticsEventsBatch(data: InsertAnalyticsEvent[]): Promise<AnalyticsEvent[]>;
  getAnalyticsEvents(filters: {
    eventName?: string;
    userId?: string;
    platform?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ rows: AnalyticsEvent[]; total: number }>;

  getTestBankCollections(filters?: { role?: string; country?: string; exam?: string; tier?: string; isActive?: boolean }): Promise<TestBankCollection[]>;
  getTestBankCollection(id: string): Promise<TestBankCollection | undefined>;
  createTestBankCollection(data: InsertTestBankCollection): Promise<TestBankCollection>;
  updateTestBankCollection(id: string, updates: Partial<InsertTestBankCollection>): Promise<TestBankCollection>;
  deleteTestBankCollection(id: string): Promise<void>;

  getTestBankProgress(userId: string, collectionId: string): Promise<TestBankProgress | undefined>;
  getUserTestBankProgress(userId: string): Promise<TestBankProgress[]>;
  upsertTestBankProgress(userId: string, collectionId: string, updates: Partial<InsertTestBankProgress>): Promise<TestBankProgress>;
  deleteTestBankProgress(userId: string, collectionId: string): Promise<void>;

  createQuestionHistory(data: InsertQuestionHistory): Promise<QuestionHistory>;
  getQuestionHistory(id: string): Promise<QuestionHistory | undefined>;
  getUserQuestionHistory(userId: string, filters?: { sourceType?: string; sessionId?: string; limit?: number; offset?: number }): Promise<QuestionHistory[]>;
  getQuestionHistoryBySession(sessionId: string): Promise<QuestionHistory[]>;
  updateQuestionHistory(id: string, updates: Partial<InsertQuestionHistory>): Promise<QuestionHistory>;

  createCatSession(data: InsertCatSession): Promise<CatSession>;
  getCatSession(id: string): Promise<CatSession | undefined>;
  getUserCatSessions(userId: string, filters?: { status?: string }): Promise<CatSession[]>;
  updateCatSession(id: string, updates: Partial<InsertCatSession> & { completedAt?: Date }): Promise<CatSession>;

  createUserActivityLog(data: InsertUserActivityLog): Promise<UserActivityLog>;
  getUserActivityLog(userId: string, filters?: { eventType?: string; limit?: number; offset?: number }): Promise<UserActivityLog[]>;

  getDashboardResumeState(userId: string): Promise<DashboardResumeState | undefined>;
  upsertDashboardResumeState(userId: string, updates: Partial<InsertDashboardResumeState>): Promise<DashboardResumeState>;
  deleteDashboardResumeState(userId: string): Promise<void>;

  deleteQuestionHistory(id: string): Promise<void>;
  deleteUserQuestionHistory(userId: string): Promise<void>;

  deleteCatSession(id: string): Promise<void>;

  deleteUserActivityLog(id: string): Promise<void>;

  createLessonBookmark(data: InsertLessonBookmark): Promise<LessonBookmark>;
  getLessonBookmark(userId: string, lessonId: string): Promise<LessonBookmark | undefined>;
  getUserLessonBookmarks(userId: string): Promise<LessonBookmark[]>;
  updateLessonBookmark(userId: string, lessonId: string, updates: Partial<InsertLessonBookmark>): Promise<LessonBookmark>;
  deleteLessonBookmark(userId: string, lessonId: string): Promise<void>;

  getMockExamSessionProgress(userId: string, attemptId: string): Promise<MockExamSessionProgress | undefined>;
  getUserMockExamSessionProgress(userId: string): Promise<MockExamSessionProgress[]>;
  upsertMockExamSessionProgress(userId: string, attemptId: string, updates: Partial<InsertMockExamSessionProgress>): Promise<MockExamSessionProgress>;
  deleteMockExamSessionProgress(id: string): Promise<void>;
}

import { getPool as getDbPool, type DatabaseTarget, isProductionLikeRuntime } from "./db";

// IMPORTANT: storage.ts must not create any DB pool at module import time.
// Use the same hosted-production detection as db.ts (NODE_ENV alone is not enough on Railway).
const STORAGE_DB_TARGET: DatabaseTarget = isProductionLikeRuntime() ? "production" : "development";

let realPool: pg.Pool | null = null;
let realDb: any | null = null;

function getRealPool(): pg.Pool {
  if (!realPool) {
    realPool = getDbPool(STORAGE_DB_TARGET);
  }
  return realPool;
}

function getRealDb(): any {
  if (!realDb) {
    // drizzle instance is expensive; build it lazily only on first DB access.
    realDb = drizzle(getRealPool());
  }
  return realDb;
}

// `pool` is accessed throughout the codebase. Use a Proxy to keep lazy init
// while preserving the existing `import { pool } from "./storage"` call sites.
export const pool = new Proxy({} as pg.Pool, {
  get(_target, propKey) {
    const p = getRealPool() as any;
    const value = p[propKey as any];
    if (typeof value === "function") return value.bind(p);
    return value;
  },
}) as pg.Pool;

export const db = new Proxy({} as any, {
  get(_target, propKey) {
    const d = getRealDb() as any;
    const value = d[propKey as any];
    if (typeof value === "function") return value.bind(d);
    return value;
  },
});

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(sql`LOWER(${users.email}) = LOWER(${email})`);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { hashPassword } = await import("./admin-auth");
    const hashedPassword = await hashPassword(insertUser.password);
    const [user] = await db.insert(users).values({ ...insertUser, password: hashedPassword }).returning();
    return user;
  }

  async updateUserProfile(userId: string, updates: { displayName?: string; country?: string; examTrack?: string; careerType?: string; onboardingComplete?: boolean; onboardingCompleted?: boolean; region?: string; role?: string; studyGoal?: string; dailyStudyTime?: string; examType?: string }): Promise<User> {
    const setObj: any = {};
    if (updates.displayName !== undefined) setObj.displayName = updates.displayName;
    if (updates.country !== undefined) setObj.country = updates.country;
    if (updates.examTrack !== undefined) setObj.examTrack = updates.examTrack;
    if (updates.careerType !== undefined) setObj.careerType = updates.careerType;
    if (updates.onboardingComplete !== undefined) setObj.onboardingComplete = updates.onboardingComplete;
    if (updates.onboardingCompleted !== undefined) setObj.onboardingCompleted = updates.onboardingCompleted;
    if (updates.region !== undefined) setObj.region = updates.region;
    if (updates.role !== undefined) setObj.role = updates.role;
    if (updates.studyGoal !== undefined) setObj.studyGoal = updates.studyGoal;
    if (updates.dailyStudyTime !== undefined) setObj.dailyStudyTime = updates.dailyStudyTime;
    if (updates.examType !== undefined) setObj.examType = updates.examType;
    const [user] = await db.update(users).set(setObj).where(eq(users.id, userId)).returning();
    return user;
  }

  async updateUserTier(userId: string, tier: string): Promise<void> {
    await db.update(users).set({ tier, subscriptionStatus: "active" }).where(eq(users.id, userId));
  }

  async updateUserTheme(userId: string, theme: string): Promise<void> {
    await db.update(users).set({ preferredTheme: theme }).where(eq(users.id, userId));
  }

  async updateUserStripeInfo(userId: string, info: { stripeCustomerId?: string; stripeSubscriptionId?: string; subscriptionStatus?: string; tier?: string }): Promise<User> {
    const updates: any = {};
    if (info.stripeCustomerId !== undefined) updates.stripeCustomerId = info.stripeCustomerId;
    if (info.stripeSubscriptionId !== undefined) updates.stripeSubscriptionId = info.stripeSubscriptionId;
    if (info.subscriptionStatus !== undefined) updates.subscriptionStatus = info.subscriptionStatus;
    if (info.tier !== undefined) updates.tier = info.tier;
    const [user] = await db.update(users).set(updates).where(eq(users.id, userId)).returning();
    return user;
  }

  async getNote(userId: string, lessonId: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(and(eq(notes.userId, userId), eq(notes.lessonId, lessonId)));
    return note;
  }

  async getNotesByUser(userId: string): Promise<Note[]> {
    return db.select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.updatedAt)).limit(1000);
  }

  async upsertNote(note: InsertNote): Promise<Note> {
    const existing = await this.getNote(note.userId, note.lessonId);
    if (existing) {
      const [updated] = await db.update(notes).set({ content: note.content, updatedAt: new Date() }).where(eq(notes.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(notes).values(note).returning();
    return created;
  }

  async deleteNote(userId: string, lessonId: string): Promise<void> {
    await db.delete(notes).where(and(eq(notes.userId, userId), eq(notes.lessonId, lessonId)));
  }

  async getTestResults(userId: string, lessonId?: string): Promise<TestResult[]> {
    if (lessonId) {
      return db.select().from(testResults).where(and(eq(testResults.userId, userId), eq(testResults.lessonId, lessonId))).orderBy(desc(testResults.completedAt)).limit(500);
    }
    return db.select().from(testResults).where(eq(testResults.userId, userId)).orderBy(desc(testResults.completedAt)).limit(500);
  }

  async createTestResult(result: InsertTestResult): Promise<TestResult> {
    const [created] = await db.insert(testResults).values(result).returning();
    return created;
  }

  async getUserProgress(userId: string, limit?: number, offset?: number): Promise<UserProgress[]> {
    let q = db.select().from(userProgress).where(eq(userProgress.userId, userId)).orderBy(desc(userProgress.lastAccessed));
    if (limit !== undefined) q = q.limit(limit) as any;
    if (offset !== undefined) q = q.offset(offset) as any;
    return q;
  }

  async getProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));
    return progress;
  }

  async upsertProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getProgressForLesson(progress.userId, progress.lessonId);
    if (existing) {
      const updates: Partial<UserProgress> = { lastAccessed: new Date() };
      if (progress.completed !== undefined) updates.completed = progress.completed;
      if (progress.preTestScore !== undefined) updates.preTestScore = progress.preTestScore;
      if (progress.postTestScore !== undefined) updates.postTestScore = progress.postTestScore;
      const [updated] = await db.update(userProgress).set(updates).where(eq(userProgress.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(userProgress).values(progress).returning();
    return created;
  }

  async getProduct(productId: string): Promise<any> {
    const result = await db.execute(sql`SELECT * FROM stripe.products WHERE id = ${productId}`);
    return result.rows[0] || null;
  }

  async listProducts(active = true): Promise<any[]> {
    const result = await db.execute(sql`SELECT * FROM stripe.products WHERE active = ${active} LIMIT ${MAX_QUERY_LIMIT}`);
    return result.rows;
  }

  async listProductsWithPrices(active = true): Promise<any[]> {
    const result = await db.execute(sql`
      WITH paginated_products AS (
        SELECT id, name, description, metadata, active
        FROM stripe.products
        WHERE active = ${active}
        ORDER BY id
      )
      SELECT 
        p.id as product_id, p.name as product_name, p.description as product_description,
        p.active as product_active, p.metadata as product_metadata,
        pr.id as price_id, pr.unit_amount, pr.currency, pr.recurring,
        pr.active as price_active, pr.metadata as price_metadata
      FROM paginated_products p
      LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
      ORDER BY p.id, pr.unit_amount
      LIMIT ${MAX_QUERY_LIMIT}
    `);
    return result.rows;
  }

  async getPrice(priceId: string): Promise<any> {
    const result = await db.execute(sql`SELECT * FROM stripe.prices WHERE id = ${priceId}`);
    return result.rows[0] || null;
  }

  async getPricesForProduct(productId: string): Promise<any[]> {
    const result = await db.execute(sql`SELECT * FROM stripe.prices WHERE product = ${productId} AND active = true`);
    return result.rows;
  }

  async getSubscription(subscriptionId: string): Promise<any> {
    const result = await db.execute(sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`);
    return result.rows[0] || null;
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const LIMIT = 2000;
    const rows = await db.select().from(users).limit(LIMIT);
    if (rows.length >= LIMIT) console.warn(`[Storage] getAllUsers hit safety limit of ${LIMIT} rows`);
    return rows.map((row: User) => {
      const { password: _p, ...rest } = row;
      return rest;
    });
  }

  async getAllTestResults(): Promise<TestResult[]> {
    const LIMIT = 2000;
    const rows = await db.select().from(testResults).orderBy(desc(testResults.completedAt)).limit(LIMIT);
    if (rows.length >= LIMIT) console.warn(`[Storage] getAllTestResults hit safety limit of ${LIMIT} rows`);
    return rows;
  }

  async getAllProgress(): Promise<UserProgress[]> {
    const LIMIT = 2000;
    const rows = await db.select().from(userProgress).orderBy(desc(userProgress.lastAccessed)).limit(LIMIT);
    if (rows.length >= LIMIT) console.warn(`[Storage] getAllProgress hit safety limit of ${LIMIT} rows`);
    return rows;
  }

  async getAllNotes(): Promise<Note[]> {
    const LIMIT = 2000;
    const rows = await db.select().from(notes).orderBy(desc(notes.updatedAt)).limit(LIMIT);
    if (rows.length >= LIMIT) console.warn(`[Storage] getAllNotes hit safety limit of ${LIMIT} rows`);
    return rows;
  }

  async getAdminAnalyticsAggregated(): Promise<any> {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsersResult,
      tierCountsResult,
      regionCountsResult,
      statusCountsResult,
      totalTestsResult,
      totalProgressResult,
      totalNotesResult,
      avgScoreResult,
      activeUsers7Result,
      activeUsers30Result,
      topLessonsResult,
      userListResult,
      recentActivityResult,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) as cnt FROM users"),
      pool.query("SELECT COALESCE(tier, 'free') as tier, COUNT(*) as cnt FROM users GROUP BY COALESCE(tier, 'free')"),
      pool.query("SELECT COALESCE(region, 'US') as region, COUNT(*) as cnt FROM users GROUP BY COALESCE(region, 'US')"),
      pool.query("SELECT COALESCE(subscription_status, 'inactive') as status, COUNT(*) as cnt FROM users GROUP BY COALESCE(subscription_status, 'inactive')"),
      pool.query("SELECT COUNT(*) as cnt FROM test_results"),
      pool.query("SELECT COUNT(*) as cnt FROM user_progress"),
      pool.query("SELECT COUNT(*) as cnt FROM notes"),
      pool.query("SELECT ROUND(AVG(CASE WHEN total_questions > 0 THEN (score::numeric / total_questions) * 100 ELSE 0 END)) as avg FROM test_results"),
      pool.query(`SELECT COUNT(DISTINCT user_id) as cnt FROM (
        SELECT user_id FROM test_results WHERE completed_at > $1
        UNION
        SELECT user_id FROM user_progress WHERE last_accessed > $1
      ) active`, [last7Days]),
      pool.query(`SELECT COUNT(DISTINCT user_id) as cnt FROM (
        SELECT user_id FROM test_results WHERE completed_at > $1
        UNION
        SELECT user_id FROM user_progress WHERE last_accessed > $1
      ) active`, [last30Days]),
      pool.query("SELECT lesson_id, COUNT(*) as cnt FROM user_progress GROUP BY lesson_id ORDER BY cnt DESC LIMIT 15"),
      pool.query(`SELECT u.id, u.username, u.email,
        COALESCE(u.tier, 'free') as tier,
        COALESCE(u.subscription_status, 'inactive') as subscription_status,
        COALESCE(u.region, 'US') as region,
        COALESCE(tc.cnt, 0) as tests_completed,
        COALESCE(pc.cnt, 0) as lessons_accessed,
        COALESCE(nc.cnt, 0) as notes_created,
        CASE WHEN tc.last_activity IS NULL THEN pc.last_activity WHEN pc.last_activity IS NULL THEN tc.last_activity ELSE GREATEST(tc.last_activity, pc.last_activity) END as last_activity
        FROM users u
        LEFT JOIN (SELECT user_id, COUNT(*) as cnt, MAX(completed_at) as last_activity FROM test_results GROUP BY user_id) tc ON tc.user_id = u.id
        LEFT JOIN (SELECT user_id, COUNT(*) as cnt, MAX(last_accessed) as last_activity FROM user_progress GROUP BY user_id) pc ON pc.user_id = u.id
        LEFT JOIN (SELECT user_id, COUNT(*) as cnt FROM notes GROUP BY user_id) nc ON nc.user_id = u.id
        ORDER BY u.id LIMIT 500`),
      pool.query(`SELECT tr.lesson_id, tr.test_type, tr.score, tr.total_questions, tr.completed_at, u.username
        FROM test_results tr
        LEFT JOIN users u ON u.id = tr.user_id
        ORDER BY tr.completed_at DESC LIMIT 20`),
    ]);

    const tierCounts: Record<string, number> = {};
    tierCountsResult.rows.forEach((r: any) => { tierCounts[r.tier] = parseInt(r.cnt); });
    const regionCounts: Record<string, number> = {};
    regionCountsResult.rows.forEach((r: any) => { regionCounts[r.region] = parseInt(r.cnt); });
    const statusCounts: Record<string, number> = {};
    statusCountsResult.rows.forEach((r: any) => { statusCounts[r.status] = parseInt(r.cnt); });

    const topLessons = topLessonsResult.rows.map((r: any) => ({ lessonId: r.lesson_id, accessCount: parseInt(r.cnt) }));

    const userList = userListResult.rows.map((r: any) => ({
      id: r.id,
      username: r.username,
      email: r.email,
      tier: r.tier,
      subscriptionStatus: r.subscription_status,
      region: r.region,
      testsCompleted: parseInt(r.tests_completed),
      lessonsAccessed: parseInt(r.lessons_accessed),
      notesCreated: parseInt(r.notes_created),
      lastActivity: r.last_activity || null,
    }));

    const recentActivity = recentActivityResult.rows.map((r: any) => ({
      username: r.username || "Unknown",
      lessonId: r.lesson_id,
      testType: r.test_type,
      score: r.score,
      totalQuestions: r.total_questions,
      date: r.completed_at,
    }));

    return {
      overview: {
        totalUsers: parseInt(totalUsersResult.rows[0].cnt),
        activeUsers7Day: parseInt(activeUsers7Result.rows[0].cnt),
        activeUsers30Day: parseInt(activeUsers30Result.rows[0].cnt),
        totalTests: parseInt(totalTestsResult.rows[0].cnt),
        totalLessonsAccessed: parseInt(totalProgressResult.rows[0].cnt),
        totalNotes: parseInt(totalNotesResult.rows[0].cnt),
        averageTestScore: parseInt(avgScoreResult.rows[0].avg) || 0,
      },
      tiers: tierCounts,
      regions: regionCounts,
      subscriptionStatus: statusCounts,
      topLessons,
      users: userList,
      recentActivity,
    };
  }

  async getAllContentItems(limit?: number, offset?: number): Promise<ContentItem[]> {
    const effectiveLimit = capLimit(limit, 500);
    let q = db.select().from(contentItems).orderBy(desc(contentItems.updatedAt)).limit(effectiveLimit) as any;
    if (offset !== undefined) q = q.offset(offset) as any;
    return q;
  }

  async getContentItem(id: string): Promise<ContentItem | undefined> {
    const [item] = await db.select().from(contentItems).where(eq(contentItems.id, id));
    return item;
  }

  async getContentItemBySlug(slug: string): Promise<ContentItem | undefined> {
    const [item] = await db.select().from(contentItems).where(eq(contentItems.slug, slug));
    return item;
  }

  async getPublishedContent(type?: string, category?: string, limit?: number, offset?: number): Promise<ContentItem[]> {
    const conditions = [eq(contentItems.status, "published")];
    if (type) conditions.push(eq(contentItems.type, type));
    if (category) conditions.push(eq(contentItems.category, category));
    const effectiveLimit = capLimit(limit, 500);
    let q = db.select().from(contentItems).where(and(...conditions)).orderBy(desc(contentItems.publishedAt)).limit(effectiveLimit) as any;
    if (offset !== undefined) q = q.offset(offset) as any;
    return q;
  }

  async getScheduledContentDue(): Promise<ContentItem[]> {
    return db.select().from(contentItems)
      .where(and(
        eq(contentItems.status, "scheduled"),
        lte(contentItems.scheduledAt, new Date())
      ))
      .limit(200);
  }

  async publishScheduledContent(): Promise<number> {
    const due = await this.getScheduledContentDue();
    let published = 0;
    for (const item of due) {
      if (item.clinicalSafetyReview && !item.autoPublish) continue;
      await db.update(contentItems)
        .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
        .where(eq(contentItems.id, item.id));
      published++;
    }
    return published;
  }

  async checkDuplicateSlug(slug: string, excludeId?: string): Promise<boolean> {
    const conditions = [eq(contentItems.slug, slug)];
    if (excludeId) conditions.push(ne(contentItems.id, excludeId));
    const [existing] = await db.select().from(contentItems).where(and(...conditions));
    return !!existing;
  }

  async checkKeywordOverlap(primaryKeyword: string, excludeId?: string): Promise<ContentItem[]> {
    const conditions = [ilike(contentItems.primaryKeyword, `%${primaryKeyword}%`)];
    if (excludeId) conditions.push(ne(contentItems.id, excludeId));
    return db.select().from(contentItems).where(and(...conditions)).limit(50);
  }

  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    const [created] = await db.insert(contentItems).values(item).returning();
    return created;
  }

  async updateContentItem(id: string, updates: Partial<InsertContentItem>): Promise<ContentItem> {
    const [updated] = await db.update(contentItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(contentItems.id, id))
      .returning();
    return updated;
  }

  async deleteContentItem(id: string): Promise<void> {
    await db.delete(contentItems).where(eq(contentItems.id, id));
  }
  async getFeatureUsage(userId: string, feature: string, date: string): Promise<FeatureUsage | undefined> {
    const [row] = await db.select().from(featureUsage).where(
      and(eq(featureUsage.userId, userId), eq(featureUsage.feature, feature), eq(featureUsage.usageDate, date))
    );
    return row;
  }

  async incrementFeatureUsage(userId: string, feature: string, date: string): Promise<FeatureUsage> {
    const result = await db.execute(sql`
      INSERT INTO feature_usage (id, user_id, feature, usage_date, count)
      VALUES (gen_random_uuid(), ${userId}, ${feature}, ${date}, 1)
      ON CONFLICT (user_id, feature, usage_date) DO UPDATE
      SET count = feature_usage.count + 1
      RETURNING *
    `);
    return result.rows[0] as FeatureUsage;
  }

  async getUserFlashcards(userId: string, limit?: number, offset?: number): Promise<UserFlashcard[]> {
    let q = db.select().from(userFlashcards).where(eq(userFlashcards.userId, userId)).orderBy(desc(userFlashcards.createdAt));
    if (limit !== undefined) q = q.limit(limit) as any;
    if (offset !== undefined) q = q.offset(offset) as any;
    return q;
  }

  async createUserFlashcard(card: InsertUserFlashcard): Promise<UserFlashcard> {
    const [created] = await db.insert(userFlashcards).values(card).returning();
    return created;
  }

  async updateUserFlashcard(id: string, userId: string, updates: Partial<InsertUserFlashcard>): Promise<UserFlashcard> {
    const [updated] = await db.update(userFlashcards)
      .set(updates)
      .where(and(eq(userFlashcards.id, id), eq(userFlashcards.userId, userId)))
      .returning();
    return updated;
  }

  async deleteUserFlashcard(id: string, userId: string): Promise<void> {
    await db.delete(userFlashcards).where(and(eq(userFlashcards.id, id), eq(userFlashcards.userId, userId)));
  }

  async getBlogConfig(): Promise<BlogConfig | undefined> {
    const [config] = await db.select().from(blogConfig);
    return config;
  }

  async upsertBlogConfig(config: Partial<BlogConfig>): Promise<BlogConfig> {
    const existing = await this.getBlogConfig();
    if (existing) {
      const [updated] = await db.update(blogConfig)
        .set({ ...config, updatedAt: new Date() })
        .where(eq(blogConfig.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(blogConfig).values(config as any).returning();
    return created;
  }

  async createPageView(view: InsertPageView): Promise<PageView> {
    const [created] = await db.insert(pageViews).values(view).returning();
    return created;
  }

  async updatePageViewDuration(sessionId: string, page: string, duration: number): Promise<void> {
    await db.update(pageViews)
      .set({ duration })
      .where(and(eq(pageViews.sessionId, sessionId), eq(pageViews.page, page)));
  }

  async getPageViewAnalytics(days = 30): Promise<any> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      overviewResult,
      sessionStatsResult,
      topPagesResult,
      topReferrersResult,
      deviceResult,
      browserResult,
      osResult,
      utmSourceResult,
      utmMediumResult,
      utmCampaignNameResult,
      utmCombinedResult,
      countryResult,
      dailyViewsResult,
      blogPagesResult,
    ] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) as total_views,
          COUNT(DISTINCT session_id) as unique_sessions,
          ROUND(AVG(CASE WHEN duration > 0 THEN duration ELSE NULL END)) as avg_duration,
          COUNT(*) FILTER (WHERE is_checkout_intent = true) as checkout_intents,
          COUNT(*) FILTER (WHERE is_pricing_view = true) as pricing_views
        FROM page_views WHERE created_at >= $1`, [since]
      ),
      pool.query(
        `SELECT COUNT(*) FILTER (WHERE page_count = 1) as bounce_sessions, COUNT(*) as total_sessions
        FROM (SELECT session_id, COUNT(*) as page_count FROM page_views WHERE created_at >= $1 GROUP BY session_id) s`, [since]
      ),
      pool.query("SELECT page, COUNT(*) as views FROM page_views WHERE created_at >= $1 GROUP BY page ORDER BY views DESC LIMIT 20", [since]),
      pool.query("SELECT referrer, COUNT(*) as views FROM page_views WHERE created_at >= $1 AND referrer IS NOT NULL GROUP BY referrer ORDER BY views DESC LIMIT 15", [since]),
      pool.query("SELECT device_type, COUNT(*) as cnt FROM page_views WHERE created_at >= $1 AND device_type IS NOT NULL GROUP BY device_type", [since]),
      pool.query("SELECT browser, COUNT(*) as cnt FROM page_views WHERE created_at >= $1 AND browser IS NOT NULL GROUP BY browser", [since]),
      pool.query("SELECT os, COUNT(*) as cnt FROM page_views WHERE created_at >= $1 AND os IS NOT NULL GROUP BY os", [since]),
      pool.query("SELECT utm_source, COUNT(*) as cnt FROM page_views WHERE created_at >= $1 AND utm_source IS NOT NULL GROUP BY utm_source", [since]),
      pool.query("SELECT utm_medium, COUNT(*) as cnt FROM page_views WHERE created_at >= $1 AND utm_medium IS NOT NULL GROUP BY utm_medium", [since]),
      pool.query("SELECT utm_campaign, COUNT(*) as cnt FROM page_views WHERE created_at >= $1 AND utm_campaign IS NOT NULL GROUP BY utm_campaign", [since]),
      pool.query(
        `SELECT COALESCE(utm_source, 'direct') as source, COALESCE(utm_medium, 'none') as medium, COALESCE(utm_campaign, 'none') as campaign, COUNT(*) as views
        FROM page_views WHERE created_at >= $1 AND (utm_source IS NOT NULL OR utm_medium IS NOT NULL OR utm_campaign IS NOT NULL)
        GROUP BY source, medium, campaign ORDER BY views DESC LIMIT 20`, [since]
      ),
      pool.query("SELECT country, COUNT(*) as views FROM page_views WHERE created_at >= $1 AND country IS NOT NULL GROUP BY country ORDER BY views DESC LIMIT 30", [since]),
      pool.query("SELECT created_at::date::text as day, COUNT(*) as views FROM page_views WHERE created_at >= $1 GROUP BY day ORDER BY day", [since]),
      pool.query("SELECT page, COUNT(*) as views FROM page_views WHERE created_at >= $1 AND (page LIKE '/blog%' OR page LIKE '/content/%') GROUP BY page ORDER BY views DESC LIMIT 15", [since]),
    ]);

    const ov = overviewResult.rows[0];
    const totalViews = parseInt(ov.total_views);
    const uniqueSessions = parseInt(ov.unique_sessions);
    const avgDuration = parseInt(ov.avg_duration) || 0;
    const checkoutIntents = parseInt(ov.checkout_intents);
    const pricingViews = parseInt(ov.pricing_views);

    const ss = sessionStatsResult.rows[0];
    const totalSessions = parseInt(ss.total_sessions) || 0;
    const bounceSessions = parseInt(ss.bounce_sessions) || 0;
    const bounceRate = totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;

    const toCountMap = (rows: any[], keyCol: string) => {
      const m: Record<string, number> = {};
      rows.forEach(r => { m[r[keyCol]] = parseInt(r.cnt || r.views); });
      return m;
    };

    const topPages = topPagesResult.rows.map((r: any) => ({ page: r.page, views: parseInt(r.views) }));
    const topReferrers = topReferrersResult.rows.map((r: any) => ({ referrer: r.referrer, views: parseInt(r.views) }));
    const deviceCounts = toCountMap(deviceResult.rows, "device_type");
    const browserCounts = toCountMap(browserResult.rows, "browser");
    const osCounts = toCountMap(osResult.rows, "os");
    const utmSourceCounts = toCountMap(utmSourceResult.rows, "utm_source");
    const utmMediumCounts = toCountMap(utmMediumResult.rows, "utm_medium");
    const utmCampaignCounts = toCountMap(utmCampaignNameResult.rows, "utm_campaign");
    const utmCampaigns = utmCombinedResult.rows.map((r: any) => ({ source: r.source, medium: r.medium, campaign: r.campaign, views: parseInt(r.views) }));
    const countries = countryResult.rows.map((r: any) => ({ country: r.country, views: parseInt(r.views) }));
    const blogPages = blogPagesResult.rows.map((r: any) => ({ page: r.page, views: parseInt(r.views) }));
    const dailyViews = dailyViewsResult.rows.map((r: any) => ({ date: r.day, views: parseInt(r.views) }));

    return {
      totalViews,
      uniqueSessions,
      avgDuration,
      bounceRate,
      checkoutIntents,
      pricingViews,
      topPages,
      topReferrers,
      devices: deviceCounts,
      browsers: browserCounts,
      operatingSystems: osCounts,
      utmSources: utmSourceCounts,
      utmMediums: utmMediumCounts,
      utmCampaignNames: utmCampaignCounts,
      utmCampaigns,
      countries,
      blogContent: blogPages,
      dailyViews,
      conversionRate: uniqueSessions > 0 ? Math.round((checkoutIntents / uniqueSessions) * 100) : 0,
    };
  }

  async createFeedback(feedback: InsertUserFeedback): Promise<UserFeedback> {
    const [created] = await db.insert(userFeedback).values(feedback).returning();
    return created;
  }

  async getAllFeedback(): Promise<UserFeedback[]> {
    const LIMIT = 1000;
    const rows = await db.select().from(userFeedback).orderBy(desc(userFeedback.createdAt)).limit(LIMIT);
    if (rows.length >= LIMIT) console.warn(`[Storage] getAllFeedback hit safety limit of ${LIMIT} rows`);
    return rows;
  }

  async updateFeedback(id: string, updates: Partial<UserFeedback>): Promise<UserFeedback> {
    const [updated] = await db.update(userFeedback)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userFeedback.id, id))
      .returning();
    return updated;
  }

  async upvoteFeedback(id: string): Promise<UserFeedback> {
    const [updated] = await db.execute(sql`
      UPDATE user_feedback SET upvotes = upvotes + 1, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `).then((r: { rows: unknown[] }) => r.rows);
    return updated as unknown as UserFeedback;
  }

  async getQotdByDate(date: string): Promise<QotdHistory | undefined> {
    const [row] = await db.select().from(qotdHistory).where(eq(qotdHistory.questionDate, date));
    return row;
  }

  async createQotd(data: Partial<QotdHistory>): Promise<QotdHistory> {
    const [created] = await db.insert(qotdHistory).values(data as any).returning();
    return created;
  }

  async getRecentQotd(limit = 30): Promise<QotdHistory[]> {
    return db.select().from(qotdHistory).orderBy(desc(qotdHistory.questionDate)).limit(limit);
  }

  async getQotdUserAnswer(userId: string, questionDate: string): Promise<QotdUserAnswer | undefined> {
    const [row] = await db.select().from(qotdUserAnswers)
      .where(and(eq(qotdUserAnswers.userId, userId), eq(qotdUserAnswers.questionDate, questionDate)));
    return row;
  }

  async createQotdUserAnswer(data: InsertQotdUserAnswer): Promise<QotdUserAnswer> {
    const [created] = await db.insert(qotdUserAnswers).values(data).returning();
    return created;
  }

  async recordQotdAnswer(data: InsertQotdUserAnswer, isCorrect: boolean): Promise<{ answer: QotdUserAnswer; streak: QotdStreak }> {
    return await db.transaction(async (tx: typeof db) => {
      const existing = await tx.select().from(qotdUserAnswers)
        .where(and(eq(qotdUserAnswers.userId, data.userId), eq(qotdUserAnswers.questionDate, data.questionDate)));
      if (existing.length > 0) {
        throw new Error("Already answered today's question");
      }
      const [answer] = await tx.insert(qotdUserAnswers).values(data).returning();

      const [streakRow] = await tx.select().from(qotdStreaks).where(eq(qotdStreaks.userId, data.userId));
      let streak: QotdStreak;
      if (!streakRow) {
        const [created] = await tx.insert(qotdStreaks).values({
          userId: data.userId,
          currentStreak: 1,
          longestStreak: 1,
          totalAnswered: 1,
          totalCorrect: isCorrect ? 1 : 0,
          lastAnswerDate: data.questionDate,
        }).returning();
        streak = created;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        let newStreak = streakRow.currentStreak;
        if (streakRow.lastAnswerDate === yesterdayStr) {
          newStreak = streakRow.currentStreak + 1;
        } else if (streakRow.lastAnswerDate !== data.questionDate) {
          newStreak = 1;
        }
        const newLongest = Math.max(streakRow.longestStreak, newStreak);
        const [updated] = await tx.update(qotdStreaks).set({
          currentStreak: newStreak,
          longestStreak: newLongest,
          totalAnswered: streakRow.totalAnswered + 1,
          totalCorrect: streakRow.totalCorrect + (isCorrect ? 1 : 0),
          lastAnswerDate: data.questionDate,
        }).where(eq(qotdStreaks.userId, data.userId)).returning();
        streak = updated;
      }
      return { answer, streak };
    });
  }

  async getQotdUserHistory(userId: string, limit = 30): Promise<QotdUserAnswer[]> {
    return db.select().from(qotdUserAnswers)
      .where(eq(qotdUserAnswers.userId, userId))
      .orderBy(desc(qotdUserAnswers.questionDate))
      .limit(limit);
  }

  async getQotdStreak(userId: string): Promise<QotdStreak | undefined> {
    const [row] = await db.select().from(qotdStreaks).where(eq(qotdStreaks.userId, userId));
    return row;
  }

  async upsertQotdStreak(userId: string, isCorrect: boolean, answerDate: string): Promise<QotdStreak> {
    const existing = await this.getQotdStreak(userId);
    if (!existing) {
      const [created] = await db.insert(qotdStreaks).values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        totalAnswered: 1,
        totalCorrect: isCorrect ? 1 : 0,
        lastAnswerDate: answerDate,
      }).returning();
      return created;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = existing.currentStreak;
    if (existing.lastAnswerDate === yesterdayStr) {
      newStreak = existing.currentStreak + 1;
    } else if (existing.lastAnswerDate !== answerDate) {
      newStreak = 1;
    }

    const newLongest = Math.max(existing.longestStreak, newStreak);
    const [updated] = await db.update(qotdStreaks).set({
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalAnswered: existing.totalAnswered + 1,
      totalCorrect: existing.totalCorrect + (isCorrect ? 1 : 0),
      lastAnswerDate: answerDate,
    }).where(eq(qotdStreaks.userId, userId)).returning();
    return updated;
  }

  async createEmailSubscriber(data: InsertEmailSubscriber): Promise<EmailSubscriber> {
    const [created] = await db.insert(emailSubscribers).values(data).returning();
    return created;
  }

  async getEmailSubscriberByEmail(email: string): Promise<EmailSubscriber | undefined> {
    const [row] = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, email));
    return row;
  }

  async updateEmailSubscriber(email: string, updates: Partial<InsertEmailSubscriber>): Promise<EmailSubscriber | undefined> {
    const [updated] = await db.update(emailSubscribers).set(updates).where(eq(emailSubscribers.email, email)).returning();
    return updated;
  }

  async deleteEmailSubscriber(email: string): Promise<void> {
    await db.delete(emailSubscribers).where(eq(emailSubscribers.email, email));
  }

  async getAllSocialPosts(): Promise<SocialPost[]> {
    const LIMIT = 500;
    return db.select().from(socialPosts).orderBy(desc(socialPosts.createdAt)).limit(LIMIT);
  }

  async getSocialPost(id: string): Promise<SocialPost | undefined> {
    const [post] = await db.select().from(socialPosts).where(eq(socialPosts.id, id));
    return post;
  }

  async getScheduledSocialPosts(): Promise<SocialPost[]> {
    return db.select().from(socialPosts)
      .where(and(eq(socialPosts.status, "scheduled"), lte(socialPosts.scheduledAt, new Date())))
      .orderBy(socialPosts.scheduledAt)
      .limit(200);
  }

  async createSocialPost(data: InsertSocialPost): Promise<SocialPost> {
    const [created] = await db.insert(socialPosts).values(data).returning();
    return created;
  }

  async updateSocialPost(id: string, updates: Partial<SocialPost>): Promise<SocialPost> {
    const [updated] = await db.update(socialPosts).set(updates).where(eq(socialPosts.id, id)).returning();
    return updated;
  }

  async deleteSocialPost(id: string): Promise<void> {
    await db.delete(socialPosts).where(eq(socialPosts.id, id));
  }

  async getDashboardWidgets(userId: string): Promise<DashboardWidget[]> {
    return db.select().from(dashboardWidgets).where(eq(dashboardWidgets.userId, userId)).orderBy(dashboardWidgets.position);
  }

  async saveDashboardWidgets(userId: string, widgets: { widgetType: string; position: number; visible: boolean; config?: any }[]): Promise<DashboardWidget[]> {
    await db.delete(dashboardWidgets).where(eq(dashboardWidgets.userId, userId));
    if (widgets.length === 0) return [];
    const rows = widgets.map((w) => ({
      userId,
      widgetType: w.widgetType,
      position: w.position,
      visible: w.visible,
      config: w.config || {},
    }));
    return db.insert(dashboardWidgets).values(rows).returning();
  }

  async getAllSiteImages(): Promise<SiteImage[]> {
    return db.select().from(siteImages).limit(MAX_QUERY_LIMIT);
  }

  async getSiteImage(key: string): Promise<SiteImage | undefined> {
    const [img] = await db.select().from(siteImages).where(eq(siteImages.imageKey, key));
    return img;
  }

  async upsertSiteImage(key: string, url: string, alt?: string): Promise<SiteImage> {
    const existing = await this.getSiteImage(key);
    if (existing) {
      const [updated] = await db.update(siteImages).set({ url, alt, updatedAt: new Date() }).where(eq(siteImages.imageKey, key)).returning();
      return updated;
    }
    const [created] = await db.insert(siteImages).values({ imageKey: key, url, alt }).returning();
    return created;
  }

  async deleteSiteImage(key: string): Promise<void> {
    await db.delete(siteImages).where(eq(siteImages.imageKey, key));
  }

  async getCustomModules(page: string): Promise<CustomPageModule[]> {
    return db.select().from(customPageModules).where(eq(customPageModules.page, page)).orderBy(customPageModules.sortOrder);
  }

  async getCustomModule(id: string): Promise<CustomPageModule | undefined> {
    const [mod] = await db.select().from(customPageModules).where(eq(customPageModules.id, id));
    return mod;
  }

  async createCustomModule(data: InsertCustomPageModule): Promise<CustomPageModule> {
    const [created] = await db.insert(customPageModules).values(data).returning();
    return created;
  }

  async updateCustomModule(id: string, updates: Partial<InsertCustomPageModule>): Promise<CustomPageModule> {
    const [updated] = await db.update(customPageModules).set({ ...updates, updatedAt: new Date() }).where(eq(customPageModules.id, id)).returning();
    return updated;
  }

  async deleteCustomModule(id: string): Promise<void> {
    await db.delete(customPageModules).where(eq(customPageModules.id, id));
  }

  async getAllAudioClips(): Promise<AudioClip[]> {
    return db.select().from(audioClips).orderBy(desc(audioClips.createdAt)).limit(MAX_QUERY_LIMIT);
  }

  async getAudioClip(id: string): Promise<AudioClip | undefined> {
    const [clip] = await db.select().from(audioClips).where(eq(audioClips.id, id));
    return clip;
  }

  async getAudioClipsByCategory(category: string): Promise<AudioClip[]> {
    return db.select().from(audioClips).where(eq(audioClips.category, category)).orderBy(audioClips.title).limit(MAX_QUERY_LIMIT);
  }

  async createAudioClip(clip: InsertAudioClip): Promise<AudioClip> {
    const [created] = await db.insert(audioClips).values(clip).returning();
    return created;
  }

  async updateAudioClip(id: string, updates: Partial<InsertAudioClip>): Promise<AudioClip> {
    const [updated] = await db.update(audioClips).set(updates).where(eq(audioClips.id, id)).returning();
    return updated;
  }

  async deleteAudioClip(id: string): Promise<void> {
    await db.delete(lessonAudioLinks).where(eq(lessonAudioLinks.audioClipId, id));
    await db.delete(audioClips).where(eq(audioClips.id, id));
  }

  async getLessonAudioLinks(lessonId: string): Promise<(LessonAudioLink & { clip: AudioClip })[]> {
    const result = await pool.query(
      `SELECT lal.*, ac.id AS clip_id, ac.title AS clip_title, ac.description AS clip_description,
              ac.audio_url AS clip_audio_url, ac.duration_seconds AS clip_duration_seconds,
              ac.category AS clip_category, ac.voice_id AS clip_voice_id,
              ac.created_at AS clip_created_at
       FROM lesson_audio_links lal
       JOIN audio_clips ac ON lal.audio_clip_id = ac.id
       WHERE lal.lesson_id = $1
       ORDER BY lal.display_order`,
      [lessonId]
    );
    return result.rows.map((r: any) => {
      const link = snakeToCamel(r) as any;
      link.clip = {
        id: r.clip_id,
        title: r.clip_title,
        description: r.clip_description,
        audioUrl: r.clip_audio_url,
        durationSeconds: r.clip_duration_seconds,
        category: r.clip_category,
        voiceId: r.clip_voice_id,
        createdAt: r.clip_created_at,
      };
      return link;
    });
  }

  async createLessonAudioLink(link: InsertLessonAudioLink): Promise<LessonAudioLink> {
    const [created] = await db.insert(lessonAudioLinks).values(link).returning();
    return created;
  }

  async deleteLessonAudioLink(id: string): Promise<void> {
    await db.delete(lessonAudioLinks).where(eq(lessonAudioLinks.id, id));
  }

  async getAllExamQuestions(filters?: { tier?: string; exam?: string; questionType?: string; status?: string; bodySystem?: string; limit?: number; offset?: number }): Promise<ExamQuestion[]> {
    const pageLimit = capLimit(filters?.limit, 500);
    const pageOffset = filters?.offset ?? 0;

    let query = `SELECT id, tier, exam, question_type, stem, options, correct_answer, body_system, topic, subtopic, difficulty, status, region_scope, country_code, language_code, licensing_body, cognitive_level, question_format, rationale, created_at FROM exam_questions WHERE 1=1`;
    const params: any[] = [];
    let idx = 1;

    if (filters?.tier) { query += ` AND tier = $${idx++}`; params.push(filters.tier); }
    if (filters?.exam) { query += ` AND exam = $${idx++}`; params.push(filters.exam); }
    if (filters?.questionType) { query += ` AND question_type = $${idx++}`; params.push(filters.questionType); }
    if (filters?.status) { query += ` AND status = $${idx++}`; params.push(filters.status); }
    if (filters?.bodySystem) { query += ` AND body_system = $${idx++}`; params.push(filters.bodySystem); }

    query += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(pageLimit, pageOffset);

    const result = await pool.query(query, params);
    return result.rows.map((r: any) => snakeToCamel(r));
  }

  async getExamQuestion(id: string): Promise<ExamQuestion | undefined> {
    const [q] = await db.select().from(examQuestions).where(eq(examQuestions.id, id));
    return q;
  }

  async createExamQuestion(q: InsertExamQuestion): Promise<ExamQuestion> {
    const [created] = await db.insert(examQuestions).values(q).returning();
    return created;
  }

  async createExamQuestionsBulk(questions: InsertExamQuestion[]): Promise<ExamQuestion[]> {
    if (questions.length === 0) return [];
    const batchSize = 50;
    const results: ExamQuestion[] = [];
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      const created = await db.insert(examQuestions).values(batch).returning();
      results.push(...created);
    }
    return results;
  }

  async updateExamQuestion(id: string, updates: Partial<InsertExamQuestion>): Promise<ExamQuestion> {
    const [updated] = await db.update(examQuestions).set({ ...updates, updatedAt: new Date() }).where(eq(examQuestions.id, id)).returning();
    return updated;
  }

  async deleteExamQuestion(id: string): Promise<void> {
    await db.delete(examQuestions).where(eq(examQuestions.id, id));
  }

  async publishScheduledQuestions(): Promise<number> {
    const now = new Date();
    const BATCH_SIZE = 200;
    let totalCount = 0;
    let batchCount: number;
    do {
      const due = await db.select({ id: examQuestions.id }).from(examQuestions).where(and(eq(examQuestions.status, "scheduled"), lte(examQuestions.publishAt!, now))).limit(BATCH_SIZE);
      batchCount = due.length;
      for (const q of due) {
        await db.update(examQuestions).set({ status: "published", publishedAt: now, updatedAt: now }).where(eq(examQuestions.id, q.id));
        await db.insert(questionScheduleLog).values({ questionId: q.id, action: "auto_publish", previousStatus: "scheduled", newStatus: "published" });
        totalCount++;
      }
    } while (batchCount === BATCH_SIZE);
    return totalCount;
  }

  async getQuestionTypeRegistry(exam?: string): Promise<QuestionTypeRegistryEntry[]> {
    if (exam) {
      return db.select().from(questionTypeRegistry).where(eq(questionTypeRegistry.exam, exam)).orderBy(questionTypeRegistry.displayName).limit(200);
    }
    return db.select().from(questionTypeRegistry).orderBy(questionTypeRegistry.exam, questionTypeRegistry.displayName).limit(200);
  }

  async upsertQuestionTypeRegistry(entry: InsertQuestionTypeRegistryEntry): Promise<QuestionTypeRegistryEntry> {
    const existing = await db.select().from(questionTypeRegistry).where(and(eq(questionTypeRegistry.exam, entry.exam), eq(questionTypeRegistry.questionType, entry.questionType)));
    if (existing.length > 0) {
      const [updated] = await db.update(questionTypeRegistry).set(entry).where(eq(questionTypeRegistry.id, existing[0].id)).returning();
      return updated;
    }
    const [created] = await db.insert(questionTypeRegistry).values(entry).returning();
    return created;
  }

  async createQuestionScheduleLog(log: { questionId: string; action: string; previousStatus?: string; newStatus?: string; actorId?: string }): Promise<QuestionScheduleLog> {
    const [created] = await db.insert(questionScheduleLog).values(log).returning();
    return created;
  }

  async listDigitalProducts(activeOnly = true): Promise<DigitalProduct[]> {
    if (activeOnly) {
      return db.select().from(digitalProducts).where(eq(digitalProducts.isActive, true)).orderBy(desc(digitalProducts.featured), desc(digitalProducts.createdAt)).limit(200);
    }
    return db.select().from(digitalProducts).orderBy(desc(digitalProducts.createdAt)).limit(200);
  }

  async getDigitalProduct(id: string): Promise<DigitalProduct | undefined> {
    const [p] = await db.select().from(digitalProducts).where(eq(digitalProducts.id, id));
    return p;
  }

  async getDigitalProductBySlug(slug: string): Promise<DigitalProduct | undefined> {
    const [p] = await db.select().from(digitalProducts).where(eq(digitalProducts.slug, slug));
    return p;
  }

  async createDigitalProduct(product: InsertDigitalProduct): Promise<DigitalProduct> {
    const [created] = await db.insert(digitalProducts).values(product).returning();
    return created;
  }

  async updateDigitalProduct(id: string, updates: Partial<InsertDigitalProduct>): Promise<DigitalProduct> {
    const [updated] = await db.update(digitalProducts).set({ ...updates, updatedAt: new Date() }).where(eq(digitalProducts.id, id)).returning();
    return updated;
  }

  async deleteDigitalProduct(id: string): Promise<void> {
    await db.delete(digitalProducts).where(eq(digitalProducts.id, id));
  }

  async createProductPurchase(purchase: InsertProductPurchase): Promise<ProductPurchase> {
    const [created] = await db.insert(productPurchases).values(purchase).returning();
    return created;
  }

  async getUserPurchases(userId: string): Promise<(ProductPurchase & { product: DigitalProduct })[]> {
    const result = await pool.query(
      `SELECT pp.*, dp.id as dp_id, dp.title as dp_title, dp.slug as dp_slug, dp.description as dp_description,
              dp.price as dp_price, dp.category as dp_category, dp.tier as dp_tier, dp.is_active as dp_is_active,
              dp.question_count as dp_question_count, dp.format as dp_format, dp.created_at as dp_created_at
       FROM product_purchases pp
       JOIN digital_products dp ON pp.product_id = dp.id
       WHERE pp.user_id = $1
       ORDER BY pp.purchase_date DESC`,
      [userId]
    );
    return result.rows.map((r: any) => {
      const purchase = snakeToCamel(r) as any;
      purchase.product = {
        id: r.dp_id, title: r.dp_title, slug: r.dp_slug, description: r.dp_description,
        price: r.dp_price, category: r.dp_category, tier: r.dp_tier, isActive: r.dp_is_active,
        questionCount: r.dp_question_count, format: r.dp_format, createdAt: r.dp_created_at,
      };
      return purchase;
    });
  }

  async getPurchase(id: string): Promise<ProductPurchase | undefined> {
    const [p] = await db.select().from(productPurchases).where(eq(productPurchases.id, id));
    return p;
  }

  async incrementDownloadCount(purchaseId: string): Promise<void> {
    await db.update(productPurchases).set({ downloadCount: sql`${productPurchases.downloadCount} + 1` }).where(eq(productPurchases.id, purchaseId));
  }

  async getProductSales(): Promise<{ productId: string; title: string; totalSales: number; totalRevenue: number }[]> {
    const result = await pool.query(
      `SELECT dp.id AS product_id, dp.title, dp.price,
              COUNT(pp.id)::int AS total_sales
       FROM digital_products dp
       LEFT JOIN product_purchases pp ON dp.id = pp.product_id
       GROUP BY dp.id, dp.title, dp.price
       ORDER BY dp.created_at DESC`
    );
    return result.rows.map((r: any) => ({
      productId: r.product_id,
      title: r.title,
      totalSales: r.total_sales || 0,
      totalRevenue: (r.total_sales || 0) * Number(r.price || 0),
    }));
  }

  async validateCoupon(code: string): Promise<{ valid: boolean; discountType?: string; discountValue?: number }> {
    const [coupon] = await db.select().from(couponCodes).where(and(eq(couponCodes.code, code.toUpperCase()), eq(couponCodes.isActive, true)));
    if (!coupon) return { valid: false };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false };
    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) return { valid: false };
    return { valid: true, discountType: coupon.discountType, discountValue: coupon.discountValue };
  }

  async useCoupon(code: string): Promise<void> {
    await db.update(couponCodes).set({ usageCount: sql`${couponCodes.usageCount} + 1` }).where(eq(couponCodes.code, code.toUpperCase()));
  }

  async listQbankDrafts(): Promise<QbankDraft[]> {
    return db.select().from(qbankDrafts).orderBy(desc(qbankDrafts.createdAt)).limit(200);
  }
  async getQbankDraft(id: string): Promise<QbankDraft | undefined> {
    const [d] = await db.select().from(qbankDrafts).where(eq(qbankDrafts.id, id));
    return d;
  }
  async createQbankDraft(draft: InsertQbankDraft): Promise<QbankDraft> {
    const [d] = await db.insert(qbankDrafts).values(draft).returning();
    return d;
  }
  async updateQbankDraft(id: string, updates: Partial<InsertQbankDraft>): Promise<QbankDraft> {
    const [d] = await db.update(qbankDrafts).set({ ...updates, updatedAt: new Date() }).where(eq(qbankDrafts.id, id)).returning();
    return d;
  }
  async deleteQbankDraft(id: string): Promise<void> {
    await db.delete(qbankDrafts).where(eq(qbankDrafts.id, id));
  }

  async listQbankRecipes(): Promise<QbankRecipe[]> {
    return db.select().from(qbankRecipes).orderBy(desc(qbankRecipes.createdAt)).limit(200);
  }
  async getQbankRecipe(id: string): Promise<QbankRecipe | undefined> {
    const [r] = await db.select().from(qbankRecipes).where(eq(qbankRecipes.id, id));
    return r;
  }
  async createQbankRecipe(recipe: InsertQbankRecipe): Promise<QbankRecipe> {
    const [r] = await db.insert(qbankRecipes).values(recipe).returning();
    return r;
  }
  async updateQbankRecipe(id: string, updates: Partial<InsertQbankRecipe>): Promise<QbankRecipe> {
    const [r] = await db.update(qbankRecipes).set(updates).where(eq(qbankRecipes.id, id)).returning();
    return r;
  }
  async deleteQbankRecipe(id: string): Promise<void> {
    await db.delete(qbankRecipes).where(eq(qbankRecipes.id, id));
  }

  async createDiagnosticAssessment(data: InsertDiagnosticAssessment): Promise<DiagnosticAssessment> {
    const [d] = await db.insert(diagnosticAssessments).values(data).returning();
    return d;
  }
  async getDiagnosticAssessment(id: string): Promise<DiagnosticAssessment | undefined> {
    const [d] = await db.select().from(diagnosticAssessments).where(eq(diagnosticAssessments.id, id));
    return d;
  }
  async getUserDiagnostics(userId: string): Promise<DiagnosticAssessment[]> {
    return db.select().from(diagnosticAssessments).where(eq(diagnosticAssessments.userId, userId)).orderBy(desc(diagnosticAssessments.completedAt)).limit(100);
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [s] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return s;
  }
  async upsertUserStats(userId: string, updates: Partial<InsertUserStats>): Promise<UserStats> {
    const existing = await this.getUserStats(userId);
    if (existing) {
      const [s] = await db.update(userStats).set({ ...updates, updatedAt: new Date() }).where(eq(userStats.userId, userId)).returning();
      return s;
    }
    const [s] = await db.insert(userStats).values({ userId, ...updates }).returning();
    return s;
  }

  async createStudyGroup(data: InsertStudyGroup): Promise<StudyGroup> {
    const [g] = await db.insert(studyGroups).values(data).returning();
    return g;
  }
  async getStudyGroup(id: string): Promise<StudyGroup | undefined> {
    const [g] = await db.select().from(studyGroups).where(eq(studyGroups.id, id));
    return g;
  }
  async getStudyGroupByCode(code: string): Promise<StudyGroup | undefined> {
    const [g] = await db.select().from(studyGroups).where(eq(studyGroups.inviteCode, code));
    return g;
  }
  async getUserStudyGroups(userId: string): Promise<StudyGroup[]> {
    const memberships = await db.select({ groupId: studyGroupMembers.groupId }).from(studyGroupMembers).where(eq(studyGroupMembers.userId, userId)).limit(100);
    if (memberships.length === 0) return [];
    const groupIds = memberships.map((m: { groupId: string }) => m.groupId);
    const result = await pool.query(
      `SELECT id, name, description, invite_code, owner_id, max_members, created_at FROM study_groups WHERE id = ANY($1) LIMIT 100`,
      [groupIds]
    );
    return result.rows.map(snakeToCamel) as StudyGroup[];
  }
  async addStudyGroupMember(data: InsertStudyGroupMember): Promise<StudyGroupMember> {
    const [m] = await db.insert(studyGroupMembers).values(data).returning();
    return m;
  }
  async getStudyGroupMembers(groupId: string): Promise<(StudyGroupMember & { username: string; stats?: UserStats })[]> {
    const result = await pool.query(
      `SELECT sgm.*, u.username, us.total_questions_answered, us.correct_answers, us.study_streak,
              us.total_study_time, us.last_study_date, us.updated_at as stats_updated_at
       FROM study_group_members sgm
       LEFT JOIN users u ON sgm.user_id = u.id
       LEFT JOIN user_stats us ON sgm.user_id = us.user_id
       WHERE sgm.group_id = $1`,
      [groupId]
    );
    return result.rows.map((r: any) => {
      const member = snakeToCamel(r) as any;
      member.username = r.username || "Unknown";
      if (r.total_questions_answered !== null) {
        member.stats = {
          userId: r.user_id,
          totalQuestionsAnswered: r.total_questions_answered,
          correctAnswers: r.correct_answers,
          studyStreak: r.study_streak,
          totalStudyTime: r.total_study_time,
          lastStudyDate: r.last_study_date,
          updatedAt: r.stats_updated_at,
        };
      }
      return member;
    });
  }
  async removeStudyGroupMember(groupId: string, userId: string): Promise<void> {
    await db.delete(studyGroupMembers).where(and(eq(studyGroupMembers.groupId, groupId), eq(studyGroupMembers.userId, userId)));
  }

  async getQuestionAnalytics(questionId: string): Promise<QuestionAnalytics | undefined> {
    const [a] = await db.select().from(questionAnalytics).where(eq(questionAnalytics.questionId, questionId));
    return a;
  }
  async upsertQuestionAnalytics(data: InsertQuestionAnalytics): Promise<QuestionAnalytics> {
    const existing = await this.getQuestionAnalytics(data.questionId);
    if (existing) {
      const [updated] = await db.update(questionAnalytics).set({ ...data, lastUpdated: new Date() }).where(eq(questionAnalytics.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(questionAnalytics).values(data).returning();
    return created;
  }

  async createFriendRequest(data: InsertFriendRequest): Promise<FriendRequest> {
    const [r] = await db.insert(friendRequests).values(data).returning();
    return r;
  }
  async getFriendRequest(id: string): Promise<FriendRequest | undefined> {
    const [r] = await db.select().from(friendRequests).where(eq(friendRequests.id, id));
    return r;
  }
  async getPendingFriendRequests(userId: string): Promise<FriendRequest[]> {
    return db.select().from(friendRequests).where(and(eq(friendRequests.receiverId, userId), eq(friendRequests.status, "pending"))).orderBy(desc(friendRequests.createdAt)).limit(100);
  }
  async updateFriendRequestStatus(id: string, status: string): Promise<FriendRequest> {
    const [r] = await db.update(friendRequests).set({ status }).where(eq(friendRequests.id, id)).returning();
    return r;
  }

  async createFriendConnection(data: InsertFriendConnection): Promise<FriendConnection> {
    const [c] = await db.insert(friendConnections).values(data).returning();
    return c;
  }
  async getUserFriendConnections(userId: string): Promise<FriendConnection[]> {
    const result = await db.execute(sql`SELECT id, user_a_id, user_b_id, created_at FROM friend_connections WHERE user_a_id = ${userId} OR user_b_id = ${userId} ORDER BY created_at DESC LIMIT 200`);
    return result.rows as unknown as FriendConnection[];
  }
  async removeFriendConnection(id: string): Promise<void> {
    await db.delete(friendConnections).where(eq(friendConnections.id, id));
  }

  async createProductGeneration(data: InsertProductGeneration): Promise<ProductGeneration> {
    const [r] = await db.insert(productGenerations).values(data).returning();
    return r;
  }
  async getProductGeneration(id: string): Promise<ProductGeneration | undefined> {
    const [r] = await db.select().from(productGenerations).where(eq(productGenerations.id, id));
    return r;
  }
  async updateProductGeneration(id: string, updates: any): Promise<ProductGeneration> {
    const [r] = await db.update(productGenerations).set({ ...updates, updatedAt: new Date() }).where(eq(productGenerations.id, id)).returning();
    return r;
  }
  async listProductGenerations(): Promise<ProductGeneration[]> {
    return db.select().from(productGenerations).orderBy(desc(productGenerations.createdAt)).limit(200);
  }
  async deleteProductGeneration(id: string): Promise<void> {
    await db.delete(generationEvents).where(eq(generationEvents.generationId, id));
    await db.delete(generatedQuestions).where(eq(generatedQuestions.generationId, id));
    await db.delete(productGenerations).where(eq(productGenerations.id, id));
  }

  async createGeneratedQuestion(data: InsertGeneratedQuestion): Promise<GeneratedQuestion> {
    const [r] = await db.insert(generatedQuestions).values(data).returning();
    return r;
  }
  async createGeneratedQuestionsBulk(data: InsertGeneratedQuestion[]): Promise<GeneratedQuestion[]> {
    if (!data.length) return [];
    return db.insert(generatedQuestions).values(data).returning();
  }
  async getGeneratedQuestions(generationId: string): Promise<GeneratedQuestion[]> {
    return db.select().from(generatedQuestions).where(eq(generatedQuestions.generationId, generationId)).orderBy(generatedQuestions.idx).limit(500);
  }
  async getGeneratedQuestionCount(generationId: string): Promise<number> {
    const [r] = await db.select({ count: count() }).from(generatedQuestions).where(eq(generatedQuestions.generationId, generationId));
    return r?.count || 0;
  }
  async deleteGeneratedQuestion(id: string): Promise<void> {
    await db.delete(generatedQuestions).where(eq(generatedQuestions.id, id));
  }
  async updateGeneratedQuestion(id: string, data: Partial<{ stem: string; scenario: string; choices: any; correctAnswers: any; rationale: any; examPearl: string }>): Promise<any> {
    const [r] = await db.update(generatedQuestions).set(data).where(eq(generatedQuestions.id, id)).returning();
    return r;
  }

  async createGenerationEvent(data: { generationId: string; eventType: string; payload?: any }): Promise<void> {
    await db.insert(generationEvents).values(data);
  }
  async getGenerationEvents(generationId: string): Promise<any[]> {
    return db.select().from(generationEvents).where(eq(generationEvents.generationId, generationId)).orderBy(desc(generationEvents.createdAt));
  }

  async createTaxonomyReviewEntry(data: any): Promise<any> {
    const result = await pool.query(
      `INSERT INTO taxonomy_review_queue (id, original_topic, original_system, suggested_topic, suggested_system, confidence, match_method, body_system, tier, generation_id, status, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', NOW())
       RETURNING *`,
      [data.originalTopic, data.originalSystem || null, data.suggestedTopic || null, data.suggestedSystem || null, data.confidence || 0, data.matchMethod || null, data.bodySystem || null, data.tier || null, data.generationId || null]
    );
    return result.rows[0];
  }

  async listTaxonomyReviewQueue(filters?: { status?: string; system?: string }): Promise<any[]> {
    let query = `SELECT id, question_id, body_system, suggested_system, topic, suggested_topic, status, created_at FROM taxonomy_review_queue`;
    const conditions: string[] = [];
    const params: any[] = [];
    if (filters?.status) {
      params.push(filters.status);
      conditions.push(`status = $${params.length}`);
    }
    if (filters?.system) {
      params.push(filters.system);
      conditions.push(`(body_system = $${params.length} OR suggested_system = $${params.length})`);
    }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(" AND ")}`;
    query += ` ORDER BY created_at DESC LIMIT 500`;
    const result = await pool.query(query, params);
    return result.rows;
  }

  async resolveTaxonomyReviewEntry(id: string, data: { resolvedTopic: string; resolvedSystem: string; resolvedBy: string }): Promise<any> {
    const result = await pool.query(
      `UPDATE taxonomy_review_queue SET status = 'resolved', resolved_topic = $2, resolved_system = $3, resolved_by = $4, resolved_at = NOW() WHERE id = $1 RETURNING *`,
      [id, data.resolvedTopic, data.resolvedSystem, data.resolvedBy]
    );
    return result.rows[0];
  }

  async createContentBlock(data: { generationId: string; sectionKey: string; blocks: any }): Promise<any> {
    const [r] = await db.insert(v2ContentBlocks).values(data).returning();
    return r;
  }
  async getContentBlocks(generationId: string): Promise<any[]> {
    return db.select().from(v2ContentBlocks).where(eq(v2ContentBlocks.generationId, generationId));
  }

  async getPresentationSettings(generationId: string): Promise<GeneratorV2PresentationSettings | undefined> {
    const [r] = await db.select().from(generatorV2PresentationSettings).where(eq(generatorV2PresentationSettings.generationId, generationId));
    return r;
  }
  async upsertPresentationSettings(generationId: string, data: Partial<InsertGeneratorV2PresentationSettings>): Promise<GeneratorV2PresentationSettings> {
    const existing = await this.getPresentationSettings(generationId);
    if (existing) {
      const [r] = await db.update(generatorV2PresentationSettings).set({ ...data, updatedAt: new Date() }).where(eq(generatorV2PresentationSettings.generationId, generationId)).returning();
      return r;
    }
    const [r] = await db.insert(generatorV2PresentationSettings).values({ ...data, generationId }).returning();
    return r;
  }

  async getTesterInviteCode(code: string): Promise<TesterInviteCode | undefined> {
    const [r] = await db.select().from(testerInviteCodes).where(eq(testerInviteCodes.code, code));
    return r;
  }
  async getTesterInviteCodeById(id: string): Promise<TesterInviteCode | undefined> {
    const [r] = await db.select().from(testerInviteCodes).where(eq(testerInviteCodes.id, id));
    return r;
  }
  async listTesterInviteCodes(): Promise<TesterInviteCode[]> {
    return db.select().from(testerInviteCodes).orderBy(desc(testerInviteCodes.createdAt)).limit(MAX_QUERY_LIMIT);
  }
  async createTesterInviteCode(data: InsertTesterInviteCode): Promise<TesterInviteCode> {
    const [r] = await db.insert(testerInviteCodes).values(data).returning();
    return r;
  }
  async updateTesterInviteCode(id: string, updates: Partial<InsertTesterInviteCode>): Promise<TesterInviteCode> {
    const [r] = await db.update(testerInviteCodes).set(updates).where(eq(testerInviteCodes.id, id)).returning();
    return r;
  }
  async incrementTesterInviteCodeUsage(code: string, userId?: string): Promise<void> {
    const updates: any = { usedCount: sql`${testerInviteCodes.usedCount} + 1` };
    if (userId) updates.usedBy = userId;
    await db.update(testerInviteCodes).set(updates).where(eq(testerInviteCodes.code, code));
  }
  async deleteTesterInviteCode(id: string): Promise<void> {
    await db.delete(testerInviteCodes).where(eq(testerInviteCodes.id, id));
  }

  async createTesterFeedback(data: InsertTesterFeedback): Promise<TesterFeedback> {
    const [r] = await db.insert(testerFeedback).values(data).returning();
    return r;
  }
  async listTesterFeedback(): Promise<TesterFeedback[]> {
    return db.select().from(testerFeedback).orderBy(desc(testerFeedback.createdAt)).limit(MAX_QUERY_LIMIT);
  }
  async getUserTesterFeedback(userId: string): Promise<TesterFeedback[]> {
    return db.select().from(testerFeedback).where(eq(testerFeedback.userId, userId)).orderBy(desc(testerFeedback.createdAt)).limit(MAX_QUERY_LIMIT);
  }
  async updateTesterFeedback(id: string, updates: Partial<{ status: string; adminResponse: string }>): Promise<TesterFeedback> {
    const [r] = await db.update(testerFeedback).set({ ...updates, updatedAt: new Date() }).where(eq(testerFeedback.id, id)).returning();
    return r;
  }

  async listTesterUsers(): Promise<User[]> {
    return db.select().from(users).where(eq(users.testerAccess, true)).orderBy(desc(users.testerExpiry));
  }
  async setTesterAccess(userId: string, testerAccess: boolean, testerExpiry: Date | null, inviteCode?: string): Promise<User> {
    const updates: any = { testerAccess, testerExpiry };
    if (inviteCode !== undefined) updates.testerInviteCode = inviteCode;
    const [r] = await db.update(users).set(updates).where(eq(users.id, userId)).returning();
    return r;
  }

  async generateReferralCode(userId: string): Promise<string> {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code: string;
    let attempts = 0;
    do {
      code = "NN-REF-";
      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      const existing = await db.select().from(users).where(eq(users.referralCode, code));
      if (existing.length === 0) break;
      attempts++;
    } while (attempts < 10);

    const [r] = await db.update(users).set({ referralCode: code }).where(eq(users.id, userId)).returning();
    return r.referralCode!;
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const [r] = await db.select().from(users).where(eq(users.referralCode, code.trim().toUpperCase()));
    return r;
  }

  async incrementReferralUses(referralCode: string): Promise<void> {
    await db.update(users).set({ referralUses: sql`COALESCE(referral_uses, 0) + 1` }).where(eq(users.referralCode, referralCode));
  }

  async setReferredBy(userId: string, referralCode: string): Promise<void> {
    await db.update(users).set({ referredBy: referralCode }).where(eq(users.id, userId));
  }

  async markReferralDiscountUsed(userId: string): Promise<void> {
    await db.update(users).set({ referralDiscountUsed: true }).where(eq(users.id, userId));
  }

  async getAllImagingQuestions(filters?: { country?: string; examType?: string; topic?: string; difficulty?: string; status?: string }): Promise<ImagingQuestion[]> {
    const LIMIT = 500;
    const conditions = [];
    if (filters?.country) conditions.push(eq(imagingQuestions.country, filters.country));
    if (filters?.examType) conditions.push(eq(imagingQuestions.exam, filters.examType));
    if (filters?.topic) conditions.push(eq(imagingQuestions.topic, filters.topic));
    if (filters?.difficulty) conditions.push(eq(imagingQuestions.difficulty, Number(filters.difficulty)));
    if (filters?.status) conditions.push(eq(imagingQuestions.status, filters.status));
    if (conditions.length > 0) return db.select().from(imagingQuestions).where(and(...conditions)).orderBy(desc(imagingQuestions.updatedAt)).limit(LIMIT);
    return db.select().from(imagingQuestions).orderBy(desc(imagingQuestions.updatedAt)).limit(LIMIT);
  }
  async getImagingQuestion(id: string): Promise<ImagingQuestion | undefined> {
    const [r] = await db.select().from(imagingQuestions).where(eq(imagingQuestions.id, id));
    return r;
  }
  async createImagingQuestion(q: InsertImagingQuestion): Promise<ImagingQuestion> {
    const [r] = await db.insert(imagingQuestions).values(q).returning();
    return r;
  }
  async createImagingQuestionsBulk(questions: InsertImagingQuestion[]): Promise<ImagingQuestion[]> {
    if (questions.length === 0) return [];
    return db.insert(imagingQuestions).values(questions).returning();
  }
  async updateImagingQuestion(id: string, updates: Partial<InsertImagingQuestion>): Promise<ImagingQuestion> {
    const [r] = await db.update(imagingQuestions).set({ ...updates, updatedAt: new Date() }).where(eq(imagingQuestions.id, id)).returning();
    return r;
  }
  async deleteImagingQuestion(id: string): Promise<void> {
    await db.delete(imagingQuestions).where(eq(imagingQuestions.id, id));
  }

  async getAllImageAssets(filters?: { country?: string; assetType?: string; modality?: string; approvalStatus?: string }): Promise<ImageAsset[]> {
    const LIMIT = 500;
    const conditions = [];
    if (filters?.country) conditions.push(eq(imageAssets.country, filters.country));
    if (filters?.assetType) conditions.push(eq(imageAssets.assetType, filters.assetType));
    if (filters?.modality) conditions.push(eq(imageAssets.modality, filters.modality));
    if (filters?.approvalStatus) conditions.push(eq(imageAssets.approvalStatus, filters.approvalStatus));
    if (conditions.length > 0) return db.select().from(imageAssets).where(and(...conditions)).orderBy(desc(imageAssets.updatedAt)).limit(LIMIT);
    return db.select().from(imageAssets).orderBy(desc(imageAssets.updatedAt)).limit(LIMIT);
  }
  async getImageAsset(id: string): Promise<ImageAsset | undefined> {
    const [r] = await db.select().from(imageAssets).where(eq(imageAssets.id, id));
    return r;
  }
  async createImageAsset(a: InsertImageAsset): Promise<ImageAsset> {
    const [r] = await db.insert(imageAssets).values(a).returning();
    return r;
  }
  async updateImageAsset(id: string, updates: Partial<InsertImageAsset>): Promise<ImageAsset> {
    const [r] = await db.update(imageAssets).set({ ...updates, updatedAt: new Date() }).where(eq(imageAssets.id, id)).returning();
    return r;
  }
  async deleteImageAsset(id: string): Promise<void> {
    await db.delete(imageAssets).where(eq(imageAssets.id, id));
  }

  async getAllImagingFlashcards(filters?: { country?: string; examType?: string; topic?: string; status?: string }): Promise<ImagingFlashcard[]> {
    const LIMIT = 500;
    const conditions = [];
    if (filters?.country) {
      conditions.push(
        or(eq(imagingFlashcards.country, filters.country), eq(imagingFlashcards.country, "both"))!
      );
    }
    if (filters?.examType) conditions.push(eq(imagingFlashcards.examType, filters.examType));
    if (filters?.topic) conditions.push(eq(imagingFlashcards.category, filters.topic));
    if (filters?.status) conditions.push(eq(imagingFlashcards.status, filters.status));
    if (conditions.length > 0) return db.select().from(imagingFlashcards).where(and(...conditions)).orderBy(desc(imagingFlashcards.updatedAt)).limit(LIMIT);
    return db.select().from(imagingFlashcards).orderBy(desc(imagingFlashcards.updatedAt)).limit(LIMIT);
  }
  async getImagingFlashcard(id: string): Promise<ImagingFlashcard | undefined> {
    const [r] = await db.select().from(imagingFlashcards).where(eq(imagingFlashcards.id, id));
    return r;
  }
  async createImagingFlashcard(f: InsertImagingFlashcard): Promise<ImagingFlashcard> {
    const [r] = await db.insert(imagingFlashcards).values(f).returning();
    return r;
  }
  async createImagingFlashcardsBulk(flashcards: InsertImagingFlashcard[]): Promise<ImagingFlashcard[]> {
    if (flashcards.length === 0) return [];
    return db.insert(imagingFlashcards).values(flashcards).returning();
  }
  async updateImagingFlashcard(id: string, updates: Partial<InsertImagingFlashcard>): Promise<ImagingFlashcard> {
    const [r] = await db.update(imagingFlashcards).set({ ...updates, updatedAt: new Date() }).where(eq(imagingFlashcards.id, id)).returning();
    return r;
  }
  async deleteImagingFlashcard(id: string): Promise<void> {
    await db.delete(imagingFlashcards).where(eq(imagingFlashcards.id, id));
  }

  async getAllImagingCaseStudies(filters?: { country?: string; examType?: string; status?: string }): Promise<ImagingCaseStudy[]> {
    const LIMIT = 500;
    const conditions = [];
    if (filters?.country) conditions.push(eq(imagingCaseStudies.country, filters.country));
    if (filters?.examType) conditions.push(eq(imagingCaseStudies.examType, filters.examType));
    if (filters?.status) conditions.push(eq(imagingCaseStudies.status, filters.status));
    if (conditions.length > 0) return db.select().from(imagingCaseStudies).where(and(...conditions)).orderBy(desc(imagingCaseStudies.updatedAt)).limit(LIMIT);
    return db.select().from(imagingCaseStudies).orderBy(desc(imagingCaseStudies.updatedAt)).limit(LIMIT);
  }
  async getImagingCaseStudy(id: string): Promise<ImagingCaseStudy | undefined> {
    const [r] = await db.select().from(imagingCaseStudies).where(eq(imagingCaseStudies.id, id));
    return r;
  }
  async createImagingCaseStudy(c: InsertImagingCaseStudy): Promise<ImagingCaseStudy> {
    const [r] = await db.insert(imagingCaseStudies).values(c).returning();
    return r;
  }
  async updateImagingCaseStudy(id: string, updates: Partial<InsertImagingCaseStudy>): Promise<ImagingCaseStudy> {
    const [r] = await db.update(imagingCaseStudies).set({ ...updates, updatedAt: new Date() }).where(eq(imagingCaseStudies.id, id)).returning();
    return r;
  }
  async deleteImagingCaseStudy(id: string): Promise<void> {
    await db.delete(imagingCaseStudies).where(eq(imagingCaseStudies.id, id));
  }

  async getImagingExamAttempt(id: string): Promise<ImagingExamAttempt | undefined> {
    const [r] = await db.select().from(imagingExamAttempts).where(eq(imagingExamAttempts.id, id));
    return r;
  }
  async getUserImagingExamAttempts(userId: string): Promise<ImagingExamAttempt[]> {
    return db.select().from(imagingExamAttempts).where(eq(imagingExamAttempts.userId, userId)).orderBy(desc(imagingExamAttempts.startedAt)).limit(100);
  }
  async createImagingExamAttempt(a: InsertImagingExamAttempt): Promise<ImagingExamAttempt> {
    const [r] = await db.insert(imagingExamAttempts).values(a).returning();
    return r;
  }
  async updateImagingExamAttempt(id: string, updates: Partial<InsertImagingExamAttempt>): Promise<ImagingExamAttempt> {
    const [r] = await db.update(imagingExamAttempts).set(updates).where(eq(imagingExamAttempts.id, id)).returning();
    return r;
  }

  async getImagingExamAttemptQuestions(attemptId: string): Promise<ImagingExamAttemptQuestion[]> {
    return db.select().from(imagingExamAttemptQuestions).where(eq(imagingExamAttemptQuestions.attemptId, attemptId));
  }
  async createImagingExamAttemptQuestion(q: InsertImagingExamAttemptQuestion): Promise<ImagingExamAttemptQuestion> {
    const [r] = await db.insert(imagingExamAttemptQuestions).values(q).returning();
    return r;
  }
  async updateImagingExamAttemptQuestion(id: string, updates: Partial<InsertImagingExamAttemptQuestion>): Promise<ImagingExamAttemptQuestion> {
    const [r] = await db.update(imagingExamAttemptQuestions).set(updates).where(eq(imagingExamAttemptQuestions.id, id)).returning();
    return r;
  }

  async getAllImagingPositioningEntries(filters?: { country?: string; bodyRegion?: string; status?: string }): Promise<ImagingPositioningEntry[]> {
    const conditions = [];
    if (filters?.country) conditions.push(eq(imagingPositioningEntries.country, filters.country));
    if (filters?.bodyRegion) conditions.push(eq(imagingPositioningEntries.bodyRegion, filters.bodyRegion));
    if (filters?.status) conditions.push(eq(imagingPositioningEntries.status, filters.status));
    if (conditions.length > 0) return db.select().from(imagingPositioningEntries).where(and(...conditions)).orderBy(desc(imagingPositioningEntries.updatedAt));
    return db.select().from(imagingPositioningEntries).orderBy(desc(imagingPositioningEntries.updatedAt));
  }
  async getImagingPositioningEntry(id: string): Promise<ImagingPositioningEntry | undefined> {
    const [r] = await db.select().from(imagingPositioningEntries).where(eq(imagingPositioningEntries.id, id));
    return r;
  }
  async getImagingPositioningEntryBySlug(slug: string, country?: string): Promise<ImagingPositioningEntry | undefined> {
    const conditions = [eq(imagingPositioningEntries.slug, slug), eq(imagingPositioningEntries.status, "published")];
    if (country) conditions.push(eq(imagingPositioningEntries.country, country));
    const [r] = await db.select().from(imagingPositioningEntries).where(and(...conditions));
    return r;
  }
  async createImagingPositioningEntry(e: InsertImagingPositioningEntry): Promise<ImagingPositioningEntry> {
    const [r] = await db.insert(imagingPositioningEntries).values(e).returning();
    return r;
  }
  async updateImagingPositioningEntry(id: string, updates: Partial<InsertImagingPositioningEntry>): Promise<ImagingPositioningEntry> {
    const [r] = await db.update(imagingPositioningEntries).set({ ...updates, updatedAt: new Date() }).where(eq(imagingPositioningEntries.id, id)).returning();
    return r;
  }
  async deleteImagingPositioningEntry(id: string): Promise<void> {
    await db.delete(imagingPositioningEntries).where(eq(imagingPositioningEntries.id, id));
  }

  async getAllImagingPhysicsTopics(filters?: { country?: string; category?: string; status?: string }): Promise<ImagingPhysicsTopic[]> {
    const conditions = [];
    if (filters?.country) conditions.push(eq(imagingPhysicsTopics.country, filters.country));
    if (filters?.category) conditions.push(eq(imagingPhysicsTopics.category, filters.category));
    if (filters?.status) conditions.push(eq(imagingPhysicsTopics.status, filters.status));
    if (conditions.length > 0) return db.select().from(imagingPhysicsTopics).where(and(...conditions)).orderBy(desc(imagingPhysicsTopics.updatedAt)).limit(MAX_QUERY_LIMIT);
    return db.select().from(imagingPhysicsTopics).orderBy(desc(imagingPhysicsTopics.updatedAt)).limit(MAX_QUERY_LIMIT);
  }
  async getImagingPhysicsTopic(id: string): Promise<ImagingPhysicsTopic | undefined> {
    const [r] = await db.select().from(imagingPhysicsTopics).where(eq(imagingPhysicsTopics.id, id));
    return r;
  }
  async createImagingPhysicsTopic(t: InsertImagingPhysicsTopic): Promise<ImagingPhysicsTopic> {
    const [r] = await db.insert(imagingPhysicsTopics).values(t).returning();
    return r;
  }
  async updateImagingPhysicsTopic(id: string, updates: Partial<InsertImagingPhysicsTopic>): Promise<ImagingPhysicsTopic> {
    const [r] = await db.update(imagingPhysicsTopics).set({ ...updates, updatedAt: new Date() }).where(eq(imagingPhysicsTopics.id, id)).returning();
    return r;
  }
  async deleteImagingPhysicsTopic(id: string): Promise<void> {
    await db.delete(imagingPhysicsTopics).where(eq(imagingPhysicsTopics.id, id));
  }

  async getAllImagingArtifactImages(filters?: { artifactType?: string; status?: string }): Promise<ImagingArtifactImage[]> {
    const conditions = [];
    if (filters?.artifactType) conditions.push(eq(imagingArtifactImages.artifactType, filters.artifactType));
    if (filters?.status) conditions.push(eq(imagingArtifactImages.status, filters.status));
    if (conditions.length > 0) return db.select().from(imagingArtifactImages).where(and(...conditions)).orderBy(desc(imagingArtifactImages.updatedAt)).limit(MAX_QUERY_LIMIT);
    return db.select().from(imagingArtifactImages).orderBy(desc(imagingArtifactImages.updatedAt)).limit(MAX_QUERY_LIMIT);
  }
  async getImagingArtifactImage(id: string): Promise<ImagingArtifactImage | undefined> {
    const [r] = await db.select().from(imagingArtifactImages).where(eq(imagingArtifactImages.id, id));
    return r;
  }
  async createImagingArtifactImage(a: InsertImagingArtifactImage): Promise<ImagingArtifactImage> {
    const [r] = await db.insert(imagingArtifactImages).values(a).returning();
    return r;
  }
  async updateImagingArtifactImage(id: string, updates: Partial<InsertImagingArtifactImage>): Promise<ImagingArtifactImage> {
    const [r] = await db.update(imagingArtifactImages).set({ ...updates, updatedAt: new Date() }).where(eq(imagingArtifactImages.id, id)).returning();
    return r;
  }
  async deleteImagingArtifactImage(id: string): Promise<void> {
    await db.delete(imagingArtifactImages).where(eq(imagingArtifactImages.id, id));
  }

  async getAllImagingComparisonSets(filters?: { comparisonType?: string; status?: string }): Promise<ImagingComparisonSet[]> {
    const conditions = [];
    if (filters?.comparisonType) conditions.push(eq(imagingComparisonSets.comparisonType, filters.comparisonType));
    if (filters?.status) conditions.push(eq(imagingComparisonSets.status, filters.status));
    if (conditions.length > 0) return db.select().from(imagingComparisonSets).where(and(...conditions)).orderBy(desc(imagingComparisonSets.updatedAt)).limit(MAX_QUERY_LIMIT);
    return db.select().from(imagingComparisonSets).orderBy(desc(imagingComparisonSets.updatedAt)).limit(MAX_QUERY_LIMIT);
  }
  async getImagingComparisonSet(id: string): Promise<ImagingComparisonSet | undefined> {
    const [r] = await db.select().from(imagingComparisonSets).where(eq(imagingComparisonSets.id, id));
    return r;
  }
  async createImagingComparisonSet(s: InsertImagingComparisonSet): Promise<ImagingComparisonSet> {
    const [r] = await db.insert(imagingComparisonSets).values(s).returning();
    return r;
  }
  async updateImagingComparisonSet(id: string, updates: Partial<InsertImagingComparisonSet>): Promise<ImagingComparisonSet> {
    const [r] = await db.update(imagingComparisonSets).set({ ...updates, updatedAt: new Date() }).where(eq(imagingComparisonSets.id, id)).returning();
    return r;
  }
  async deleteImagingComparisonSet(id: string): Promise<void> {
    await db.delete(imagingComparisonSets).where(eq(imagingComparisonSets.id, id));
  }

  async getAllImagingAnatomyImages(filters?: { bodyRegion?: string; status?: string }): Promise<ImagingAnatomyImage[]> {
    const conditions = [];
    if (filters?.bodyRegion) conditions.push(eq(imagingAnatomyImages.bodyRegion, filters.bodyRegion));
    if (filters?.status) conditions.push(eq(imagingAnatomyImages.status, filters.status));
    if (conditions.length > 0) return db.select().from(imagingAnatomyImages).where(and(...conditions)).orderBy(desc(imagingAnatomyImages.updatedAt)).limit(MAX_QUERY_LIMIT);
    return db.select().from(imagingAnatomyImages).orderBy(desc(imagingAnatomyImages.updatedAt)).limit(MAX_QUERY_LIMIT);
  }
  async getImagingAnatomyImage(id: string): Promise<ImagingAnatomyImage | undefined> {
    const [r] = await db.select().from(imagingAnatomyImages).where(eq(imagingAnatomyImages.id, id));
    return r;
  }
  async createImagingAnatomyImage(a: InsertImagingAnatomyImage): Promise<ImagingAnatomyImage> {
    const [r] = await db.insert(imagingAnatomyImages).values(a).returning();
    return r;
  }
  async updateImagingAnatomyImage(id: string, updates: Partial<InsertImagingAnatomyImage>): Promise<ImagingAnatomyImage> {
    const [r] = await db.update(imagingAnatomyImages).set({ ...updates, updatedAt: new Date() }).where(eq(imagingAnatomyImages.id, id)).returning();
    return r;
  }
  async deleteImagingAnatomyImage(id: string): Promise<void> {
    await db.delete(imagingAnatomyImages).where(eq(imagingAnatomyImages.id, id));
  }

  async getAllImagingPhysicsVisuals(filters?: { category?: string; status?: string }): Promise<ImagingPhysicsVisual[]> {
    const conditions = [];
    if (filters?.category) conditions.push(eq(imagingPhysicsVisuals.category, filters.category));
    if (filters?.status) conditions.push(eq(imagingPhysicsVisuals.status, filters.status));
    if (conditions.length > 0) return db.select().from(imagingPhysicsVisuals).where(and(...conditions)).orderBy(desc(imagingPhysicsVisuals.updatedAt)).limit(MAX_QUERY_LIMIT);
    return db.select().from(imagingPhysicsVisuals).orderBy(desc(imagingPhysicsVisuals.updatedAt)).limit(MAX_QUERY_LIMIT);
  }
  async getImagingPhysicsVisual(id: string): Promise<ImagingPhysicsVisual | undefined> {
    const [r] = await db.select().from(imagingPhysicsVisuals).where(eq(imagingPhysicsVisuals.id, id));
    return r;
  }
  async createImagingPhysicsVisual(v: InsertImagingPhysicsVisual): Promise<ImagingPhysicsVisual> {
    const [r] = await db.insert(imagingPhysicsVisuals).values(v).returning();
    return r;
  }
  async updateImagingPhysicsVisual(id: string, updates: Partial<InsertImagingPhysicsVisual>): Promise<ImagingPhysicsVisual> {
    const [r] = await db.update(imagingPhysicsVisuals).set({ ...updates, updatedAt: new Date() }).where(eq(imagingPhysicsVisuals.id, id)).returning();
    return r;
  }
  async deleteImagingPhysicsVisual(id: string): Promise<void> {
    await db.delete(imagingPhysicsVisuals).where(eq(imagingPhysicsVisuals.id, id));
  }

  async getAllImagingImageBriefs(filters?: { status?: string; targetCategory?: string; priority?: string }): Promise<ImagingImageBrief[]> {
    const conditions = [];
    if (filters?.status) conditions.push(eq(imagingImageBriefs.status, filters.status));
    if (filters?.targetCategory) conditions.push(eq(imagingImageBriefs.targetCategory, filters.targetCategory));
    if (filters?.priority) conditions.push(eq(imagingImageBriefs.priority, filters.priority));
    if (conditions.length > 0) return db.select().from(imagingImageBriefs).where(and(...conditions)).orderBy(desc(imagingImageBriefs.updatedAt)).limit(MAX_QUERY_LIMIT);
    return db.select().from(imagingImageBriefs).orderBy(desc(imagingImageBriefs.updatedAt)).limit(MAX_QUERY_LIMIT);
  }
  async getImagingImageBrief(id: string): Promise<ImagingImageBrief | undefined> {
    const [r] = await db.select().from(imagingImageBriefs).where(eq(imagingImageBriefs.id, id));
    return r;
  }
  async createImagingImageBrief(b: InsertImagingImageBrief): Promise<ImagingImageBrief> {
    const [r] = await db.insert(imagingImageBriefs).values(b).returning();
    return r;
  }
  async updateImagingImageBrief(id: string, updates: Partial<InsertImagingImageBrief>): Promise<ImagingImageBrief> {
    const [r] = await db.update(imagingImageBriefs).set({ ...updates, updatedAt: new Date() }).where(eq(imagingImageBriefs.id, id)).returning();
    return r;
  }
  async deleteImagingImageBrief(id: string): Promise<void> {
    await db.delete(imagingImageBriefs).where(eq(imagingImageBriefs.id, id));
  }

  async getQuestionBankItems(filters?: {
    country?: string;
    examType?: string;
    category?: string;
    difficulty?: string;
    topic?: string;
    status?: string;
    contentTiersIn?: string[];
    requireNonNullContentTier?: boolean;
  }): Promise<QuestionBankItem[]> {
    const LIMIT = 500;
    const conditions = [];
    if (filters?.country) conditions.push(eq(questionBank.country, filters.country));
    if (filters?.examType) conditions.push(eq(questionBank.examType, filters.examType));
    if (filters?.category) conditions.push(eq(questionBank.category, filters.category));
    if (filters?.difficulty) conditions.push(eq(questionBank.difficulty, filters.difficulty));
    if (filters?.topic) conditions.push(eq(questionBank.topic, filters.topic));
    if (filters?.status) conditions.push(eq(questionBank.status, filters.status));
    if (filters?.requireNonNullContentTier && filters.contentTiersIn && filters.contentTiersIn.length > 0) {
      conditions.push(isNotNull(questionBank.contentTier));
      conditions.push(inArray(questionBank.contentTier, filters.contentTiersIn));
    }
    if (conditions.length > 0) {
      return db.select().from(questionBank).where(and(...conditions)).orderBy(desc(questionBank.createdAt)).limit(LIMIT);
    }
    return db.select().from(questionBank).orderBy(desc(questionBank.createdAt)).limit(LIMIT);
  }

  async getQuestionBankItem(id: string): Promise<QuestionBankItem | undefined> {
    const [item] = await db.select().from(questionBank).where(eq(questionBank.id, id));
    return item;
  }

  async createQuestionBankItem(item: InsertQuestionBankItem): Promise<QuestionBankItem> {
    const [created] = await db.insert(questionBank).values(item).returning();
    return created;
  }

  async createQuestionBankItemsBulk(items: InsertQuestionBankItem[]): Promise<QuestionBankItem[]> {
    if (items.length === 0) return [];
    const created = await db.insert(questionBank).values(items).returning();
    return created;
  }

  async updateQuestionBankItem(id: string, updates: Partial<InsertQuestionBankItem>): Promise<QuestionBankItem> {
    const [updated] = await db.update(questionBank).set({ ...updates, updatedAt: new Date() }).where(eq(questionBank.id, id)).returning();
    return updated;
  }

  async toggleQuestionBankItemStatus(id: string): Promise<QuestionBankItem> {
    const item = await this.getQuestionBankItem(id);
    if (!item) throw new Error("Question not found");
    const newStatus = item.status === "active" ? "disabled" : "active";
    const [updated] = await db.update(questionBank).set({ status: newStatus, updatedAt: new Date() }).where(eq(questionBank.id, id)).returning();
    return updated;
  }

  async getQuestionBankRandomSubset(
    filters: {
      country: string;
      examType: string;
      category?: string;
      difficulty?: string;
      contentTiersIn?: string[];
      requireNonNullContentTier?: boolean;
    },
    count: number,
  ): Promise<QuestionBankItem[]> {
    const conditions = [
      eq(questionBank.country, filters.country),
      eq(questionBank.examType, filters.examType),
      eq(questionBank.status, "active"),
    ];
    if (filters.category) conditions.push(eq(questionBank.category, filters.category));
    if (filters.difficulty) conditions.push(eq(questionBank.difficulty, filters.difficulty));
    if (filters.requireNonNullContentTier && filters.contentTiersIn && filters.contentTiersIn.length > 0) {
      conditions.push(isNotNull(questionBank.contentTier));
      conditions.push(inArray(questionBank.contentTier, filters.contentTiersIn));
    }
    return db.select().from(questionBank).where(and(...conditions)).orderBy(sql`RANDOM()`).limit(count);
  }

  async createQuestionBankResult(result: InsertQuestionBankResult): Promise<QuestionBankResult> {
    const [created] = await db.insert(questionBankResults).values(result).returning();
    return created;
  }

  async getUserQuestionBankResults(userId: string): Promise<QuestionBankResult[]> {
    return db.select().from(questionBankResults).where(eq(questionBankResults.userId, userId)).orderBy(desc(questionBankResults.createdAt)).limit(200);
  }

  async getQuestionBankAnalytics(): Promise<{ category: string; difficulty: string; totalAttempts: number; correctRate: number }[]> {
    const result = await pool.query(`
      SELECT 
        cat_entry.key AS category,
        'all' AS difficulty,
        SUM((cat_entry.value->>'total')::int) AS total_attempts,
        CASE 
          WHEN SUM((cat_entry.value->>'total')::int) > 0 
          THEN ROUND(SUM((cat_entry.value->>'correct')::numeric) / SUM((cat_entry.value->>'total')::numeric) * 1000) / 10
          ELSE 0 
        END AS correct_rate
      FROM question_bank_results,
        jsonb_each(COALESCE(category_breakdown, '{}'::jsonb)) AS cat_entry
      GROUP BY cat_entry.key
      ORDER BY cat_entry.key
    `);
    return result.rows.map((r: Record<string, string>) => ({
      category: r.category,
      difficulty: r.difficulty,
      totalAttempts: parseInt(r.total_attempts) || 0,
      correctRate: parseFloat(r.correct_rate) || 0,
    }));
  }

  async getAllMltLabImages(filters?: { discipline?: string; imageType?: string; status?: string; approvalExam?: boolean; approvalLesson?: boolean }): Promise<MltLabImage[]> {
    const LIMIT = 500;
    const conditions: any[] = [];
    if (filters?.discipline) conditions.push(eq(mltLabImages.discipline, filters.discipline));
    if (filters?.imageType) conditions.push(eq(mltLabImages.imageType, filters.imageType));
    if (filters?.status) conditions.push(eq(mltLabImages.status, filters.status));
    if (filters?.approvalExam !== undefined) conditions.push(eq(mltLabImages.approvalExam, filters.approvalExam));
    if (filters?.approvalLesson !== undefined) conditions.push(eq(mltLabImages.approvalLesson, filters.approvalLesson));
    if (conditions.length > 0) {
      return db.select().from(mltLabImages).where(and(...conditions)).orderBy(desc(mltLabImages.createdAt)).limit(LIMIT);
    }
    return db.select().from(mltLabImages).orderBy(desc(mltLabImages.createdAt)).limit(LIMIT);
  }

  async getMltLabImage(id: string): Promise<MltLabImage | undefined> {
    const [img] = await db.select().from(mltLabImages).where(eq(mltLabImages.id, id));
    return img;
  }

  async createMltLabImage(image: InsertMltLabImage): Promise<MltLabImage> {
    const [created] = await db.insert(mltLabImages).values(image).returning();
    return created;
  }

  async updateMltLabImage(id: string, updates: Partial<InsertMltLabImage>): Promise<MltLabImage> {
    const [updated] = await db.update(mltLabImages).set({ ...updates, updatedAt: new Date() }).where(eq(mltLabImages.id, id)).returning();
    return updated;
  }

  async deleteMltLabImage(id: string): Promise<void> {
    await db.delete(mltLabImageLinks).where(eq(mltLabImageLinks.imageId, id));
    await db.delete(mltLabImages).where(eq(mltLabImages.id, id));
  }

  async getMltLabImageLinks(imageId: string): Promise<MltLabImageLink[]> {
    return db.select().from(mltLabImageLinks).where(eq(mltLabImageLinks.imageId, imageId)).orderBy(mltLabImageLinks.sortOrder).limit(100);
  }

  async getMltLabImageLinksForTarget(linkedType: string, linkedId: string): Promise<(MltLabImageLink & { image: MltLabImage })[]> {
    const result = await pool.query(
      `SELECT l.*, 
        row_to_json(i) AS image_data
      FROM mlt_lab_image_links l
      INNER JOIN mlt_lab_images i ON i.id = l.image_id
      WHERE l.linked_type = $1 AND l.linked_id = $2
      ORDER BY l.sort_order
      LIMIT 100`,
      [linkedType, linkedId]
    );
    return result.rows.map((row: Record<string, unknown>) => {
      const { image_data, ...linkFields } = row;
      return { ...snakeToCamel(linkFields), image: snakeToCamel(image_data) } as MltLabImageLink & { image: MltLabImage };
    });
  }

  async createMltLabImageLink(link: InsertMltLabImageLink): Promise<MltLabImageLink> {
    const [created] = await db.insert(mltLabImageLinks).values(link).returning();
    return created;
  }

  async deleteMltLabImageLink(id: string): Promise<void> {
    await db.delete(mltLabImageLinks).where(eq(mltLabImageLinks.id, id));
  }

  async createMltImageDrillAttempt(attempt: InsertMltImageDrillAttempt): Promise<MltImageDrillAttempt> {
    const [created] = await db.insert(mltImageDrillAttempts).values(attempt).returning();
    return created;
  }

  async getUserMltImageDrillAttempts(userId: string): Promise<MltImageDrillAttempt[]> {
    return db.select().from(mltImageDrillAttempts).where(eq(mltImageDrillAttempts.userId, userId)).orderBy(desc(mltImageDrillAttempts.createdAt)).limit(200);
  }

  async updateMltImageDrillAttempt(id: string, updates: Partial<InsertMltImageDrillAttempt>): Promise<MltImageDrillAttempt> {
    const [updated] = await db.update(mltImageDrillAttempts).set(updates).where(eq(mltImageDrillAttempts.id, id)).returning();
    return updated;
  }

  async getAllCaseStudies(filters?: { tier?: string; status?: string; difficulty?: string }): Promise<CaseStudy[]> {
    const paramValues: any[] = [];
    const parts: string[] = [];
    if (filters?.tier) { paramValues.push(filters.tier); parts.push(`tier = $${paramValues.length}`); }
    if (filters?.status) { paramValues.push(filters.status); parts.push(`status = $${paramValues.length}`); }
    if (filters?.difficulty) { paramValues.push(filters.difficulty); parts.push(`difficulty = $${paramValues.length}`); }
    const where = parts.length > 0 ? `WHERE ${parts.join(" AND ")}` : "";
    paramValues.push(500);
    const r = await pool.query(`SELECT id, title, tier, status, difficulty, specialty, description, created_at, updated_at FROM case_studies ${where} ORDER BY created_at DESC LIMIT $${paramValues.length}`, paramValues);
    return r.rows.map(snakeToCamel) as CaseStudy[];
  }

  async getCaseStudy(id: string): Promise<CaseStudy | undefined> {
    const r = await pool.query("SELECT * FROM case_studies WHERE id = $1", [id]);
    return r.rows[0] ? snakeToCamel(r.rows[0]) as CaseStudy : undefined;
  }

  async createCaseStudy(data: InsertCaseStudy): Promise<CaseStudy> {
    const r = await pool.query(
      `INSERT INTO case_studies (id, title, tier, difficulty, body_system, category, scenario_intro, status, region_scope, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
      [data.title, data.tier || 'rpn', data.difficulty || 'moderate', data.bodySystem || null, data.category || null, data.scenarioIntro, data.status || 'draft', data.regionScope || 'BOTH']
    );
    return snakeToCamel(r.rows[0]) as CaseStudy;
  }

  async updateCaseStudy(id: string, updates: Partial<InsertCaseStudy>): Promise<CaseStudy> {
    const sets: string[] = [];
    const vals: any[] = [];
    let idx = 1;
    if (updates.title !== undefined) { sets.push(`title = $${idx++}`); vals.push(updates.title); }
    if (updates.tier !== undefined) { sets.push(`tier = $${idx++}`); vals.push(updates.tier); }
    if (updates.difficulty !== undefined) { sets.push(`difficulty = $${idx++}`); vals.push(updates.difficulty); }
    if (updates.bodySystem !== undefined) { sets.push(`body_system = $${idx++}`); vals.push(updates.bodySystem); }
    if (updates.category !== undefined) { sets.push(`category = $${idx++}`); vals.push(updates.category); }
    if (updates.scenarioIntro !== undefined) { sets.push(`scenario_intro = $${idx++}`); vals.push(updates.scenarioIntro); }
    if (updates.status !== undefined) { sets.push(`status = $${idx++}`); vals.push(updates.status); }
    if (updates.regionScope !== undefined) { sets.push(`region_scope = $${idx++}`); vals.push(updates.regionScope); }
    sets.push(`updated_at = NOW()`);
    vals.push(id);
    const r = await pool.query(`UPDATE case_studies SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, vals);
    return snakeToCamel(r.rows[0]) as CaseStudy;
  }

  async deleteCaseStudy(id: string): Promise<void> {
    const steps = await pool.query("SELECT id FROM case_study_steps WHERE case_id = $1", [id]);
    for (const step of steps.rows) {
      await pool.query("DELETE FROM case_study_questions WHERE case_step_id = $1", [step.id]);
    }
    await pool.query("DELETE FROM case_study_steps WHERE case_id = $1", [id]);
    await pool.query("DELETE FROM case_studies WHERE id = $1", [id]);
  }

  async getCaseStudySteps(caseId: string): Promise<CaseStudyStep[]> {
    const r = await pool.query("SELECT id, case_id, step_number, clinical_update_text, exhibit_data FROM case_study_steps WHERE case_id = $1 ORDER BY step_number ASC LIMIT 100", [caseId]);
    return r.rows.map(snakeToCamel) as CaseStudyStep[];
  }

  async getCaseStudyStep(id: string): Promise<CaseStudyStep | undefined> {
    const r = await pool.query("SELECT * FROM case_study_steps WHERE id = $1", [id]);
    return r.rows[0] ? snakeToCamel(r.rows[0]) as CaseStudyStep : undefined;
  }

  async createCaseStudyStep(data: InsertCaseStudyStep): Promise<CaseStudyStep> {
    const r = await pool.query(
      `INSERT INTO case_study_steps (id, case_id, step_number, clinical_update_text, exhibit_data)
       VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *`,
      [data.caseId, data.stepNumber, data.clinicalUpdateText, JSON.stringify(data.exhibitData || {})]
    );
    return snakeToCamel(r.rows[0]) as CaseStudyStep;
  }

  async updateCaseStudyStep(id: string, updates: Partial<InsertCaseStudyStep>): Promise<CaseStudyStep> {
    const sets: string[] = [];
    const vals: any[] = [];
    let idx = 1;
    if (updates.stepNumber !== undefined) { sets.push(`step_number = $${idx++}`); vals.push(updates.stepNumber); }
    if (updates.clinicalUpdateText !== undefined) { sets.push(`clinical_update_text = $${idx++}`); vals.push(updates.clinicalUpdateText); }
    if (updates.exhibitData !== undefined) { sets.push(`exhibit_data = $${idx++}`); vals.push(JSON.stringify(updates.exhibitData)); }
    vals.push(id);
    const r = await pool.query(`UPDATE case_study_steps SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, vals);
    return snakeToCamel(r.rows[0]) as CaseStudyStep;
  }

  async deleteCaseStudyStep(id: string): Promise<void> {
    await pool.query("DELETE FROM case_study_questions WHERE case_step_id = $1", [id]);
    await pool.query("DELETE FROM case_study_steps WHERE id = $1", [id]);
  }

  async getCaseStudyQuestions(stepId: string): Promise<CaseStudyQuestion[]> {
    const r = await pool.query("SELECT id, case_step_id, question_text, question_type, answer_options, correct_answer, rationale, points FROM case_study_questions WHERE case_step_id = $1 ORDER BY id ASC LIMIT 200", [stepId]);
    return r.rows.map(snakeToCamel) as CaseStudyQuestion[];
  }

  async getCaseStudyQuestion(id: string): Promise<CaseStudyQuestion | undefined> {
    const r = await pool.query("SELECT * FROM case_study_questions WHERE id = $1", [id]);
    return r.rows[0] ? snakeToCamel(r.rows[0]) as CaseStudyQuestion : undefined;
  }

  async createCaseStudyQuestion(data: InsertCaseStudyQuestion): Promise<CaseStudyQuestion> {
    const r = await pool.query(
      `INSERT INTO case_study_questions (id, case_step_id, question_text, question_type, answer_options, correct_answer, rationale, points)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.caseStepId, data.questionText, data.questionType || 'multiple_choice', JSON.stringify(data.answerOptions || []), JSON.stringify(data.correctAnswer || []), data.rationale || null, data.points || 1]
    );
    return snakeToCamel(r.rows[0]) as CaseStudyQuestion;
  }

  async updateCaseStudyQuestion(id: string, updates: Partial<InsertCaseStudyQuestion>): Promise<CaseStudyQuestion> {
    const sets: string[] = [];
    const vals: any[] = [];
    let idx = 1;
    if (updates.questionText !== undefined) { sets.push(`question_text = $${idx++}`); vals.push(updates.questionText); }
    if (updates.questionType !== undefined) { sets.push(`question_type = $${idx++}`); vals.push(updates.questionType); }
    if (updates.answerOptions !== undefined) { sets.push(`answer_options = $${idx++}`); vals.push(JSON.stringify(updates.answerOptions)); }
    if (updates.correctAnswer !== undefined) { sets.push(`correct_answer = $${idx++}`); vals.push(JSON.stringify(updates.correctAnswer)); }
    if (updates.rationale !== undefined) { sets.push(`rationale = $${idx++}`); vals.push(updates.rationale); }
    if (updates.points !== undefined) { sets.push(`points = $${idx++}`); vals.push(updates.points); }
    vals.push(id);
    const r = await pool.query(`UPDATE case_study_questions SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, vals);
    return snakeToCamel(r.rows[0]) as CaseStudyQuestion;
  }

  async deleteCaseStudyQuestion(id: string): Promise<void> {
    await pool.query("DELETE FROM case_study_questions WHERE id = $1", [id]);
  }

  async getCaseStudyFull(id: string): Promise<{ study: CaseStudy; steps: (CaseStudyStep & { questions: CaseStudyQuestion[] })[] } | undefined> {
    const study = await this.getCaseStudy(id);
    if (!study) return undefined;
    const steps = await this.getCaseStudySteps(id);
    if (steps.length === 0) return { study, steps: [] };

    const stepIds = steps.map(s => s.id);
    const questionsResult = await pool.query(
      `SELECT * FROM case_study_questions WHERE case_step_id = ANY($1) ORDER BY question_number ASC LIMIT 500`,
      [stepIds]
    );
    const questionsByStep = new Map<string, CaseStudyQuestion[]>();
    for (const row of questionsResult.rows) {
      const q = snakeToCamel(row) as CaseStudyQuestion;
      const stepId = row.case_step_id;
      if (!questionsByStep.has(stepId)) questionsByStep.set(stepId, []);
      questionsByStep.get(stepId)!.push(q);
    }

    const stepsWithQuestions = steps.map(step => ({
      ...step,
      questions: questionsByStep.get(step.id) || [],
    }));
    return { study, steps: stepsWithQuestions };
  }

  async getAllLessons(filters?: { category?: string; tier?: string; status?: string; limit?: number; offset?: number; metadataOnly?: boolean }): Promise<any[]> {
    const columns = filters?.metadataOnly
      ? "id, slug, title, category, sub_category, tier, status, summary, seo_title, seo_description, image_url, image_alt, is_public_preview, created_at, updated_at"
      : "*";
    let query = `SELECT ${columns} FROM lessons WHERE 1=1`;
    const params: any[] = [];
    let idx = 1;
    if (filters?.category) { query += ` AND category = $${idx++}`; params.push(filters.category); }
    if (filters?.tier) { query += ` AND tier = $${idx++}`; params.push(filters.tier); }
    if (filters?.status) { query += ` AND status = $${idx++}`; params.push(filters.status); }
    query += " ORDER BY created_at DESC";
    const effectiveLimit = capLimit(filters?.limit, 500);
    query += ` LIMIT $${idx++}`;
    params.push(effectiveLimit);
    if (filters?.offset) { query += ` OFFSET $${idx++}`; params.push(filters.offset); }
    const r = await pool.query(query, params);
    return r.rows.map(snakeToCamel);
  }

  async getLessonBySlug(slug: string): Promise<any | undefined> {
    const r = await pool.query("SELECT * FROM lessons WHERE slug = $1", [slug]);
    return r.rows[0] ? snakeToCamel(r.rows[0]) : undefined;
  }

  async getLessonById(id: string): Promise<any | undefined> {
    const r = await pool.query("SELECT * FROM lessons WHERE id = $1", [id]);
    return r.rows[0] ? snakeToCamel(r.rows[0]) : undefined;
  }

  async createLesson(data: any): Promise<any> {
    const r = await pool.query(
      `INSERT INTO lessons (slug, title, category, sub_category, tier, status, summary, definition, pathophysiology, signs_symptoms, diagnostics, treatment, nursing_interventions, complications, clinical_pearls, "references", seo_title, seo_description, seo_keywords, image_url, image_alt, related_lesson_slugs, linked_flashcard_set_id, linked_question_bank_id, is_public_preview)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25) RETURNING *`,
      [
        data.slug, data.title, data.category || null, data.subCategory || null,
        data.tier || "free", data.status || "draft", data.summary || null,
        data.definition || null, data.pathophysiology || null,
        JSON.stringify(data.signsSymptoms || []), JSON.stringify(data.diagnostics || []),
        JSON.stringify(data.treatment || []), JSON.stringify(data.nursingInterventions || []),
        JSON.stringify(data.complications || []), JSON.stringify(data.clinicalPearls || []),
        JSON.stringify(data.references || []),
        data.seoTitle || null, data.seoDescription || null, data.seoKeywords || [],
        data.imageUrl || null, data.imageAlt || null, data.relatedLessonSlugs || [],
        data.linkedFlashcardSetId || null, data.linkedQuestionBankId || null,
        data.isPublicPreview || false,
      ]
    );
    return snakeToCamel(r.rows[0]);
  }

  async updateLesson(id: string, updates: any): Promise<any> {
    const sets: string[] = [];
    const vals: any[] = [];
    let idx = 1;
    const fieldMap: Record<string, string> = {
      slug: "slug", title: "title", category: "category", subCategory: "sub_category",
      tier: "tier", status: "status", summary: "summary", definition: "definition",
      pathophysiology: "pathophysiology", seoTitle: "seo_title", seoDescription: "seo_description",
      seoKeywords: "seo_keywords", imageUrl: "image_url", imageAlt: "image_alt",
      relatedLessonSlugs: "related_lesson_slugs", linkedFlashcardSetId: "linked_flashcard_set_id",
      linkedQuestionBankId: "linked_question_bank_id", isPublicPreview: "is_public_preview",
    };
    const jsonFields = ["signsSymptoms", "diagnostics", "treatment", "nursingInterventions", "complications", "clinicalPearls", "references"];
    const jsonFieldMap: Record<string, string> = {
      signsSymptoms: "signs_symptoms", diagnostics: "diagnostics", treatment: "treatment",
      nursingInterventions: "nursing_interventions", complications: "complications",
      clinicalPearls: "clinical_pearls", references: '"references"',
    };
    for (const [key, col] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) { sets.push(`${col} = $${idx++}`); vals.push(updates[key]); }
    }
    for (const key of jsonFields) {
      if (updates[key] !== undefined) { sets.push(`${jsonFieldMap[key]} = $${idx++}`); vals.push(JSON.stringify(updates[key])); }
    }
    if (sets.length === 0) {
      const existing = await this.getLessonById(id);
      if (!existing) throw new Error("Lesson not found");
      return existing;
    }
    sets.push(`updated_at = NOW()`);
    vals.push(id);
    const r = await pool.query(`UPDATE lessons SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, vals);
    if (!r.rows[0]) throw new Error("Lesson not found");
    return snakeToCamel(r.rows[0]);
  }

  async deleteLesson(id: string): Promise<void> {
    await pool.query("DELETE FROM lessons WHERE id = $1", [id]);
  }

  async getRelatedLessons(slug: string, limit: number = 3): Promise<any[]> {
    const lesson = await this.getLessonBySlug(slug);
    if (!lesson) return [];
    if (lesson.relatedLessonSlugs && lesson.relatedLessonSlugs.length > 0) {
      const placeholders = lesson.relatedLessonSlugs.map((_: string, i: number) => `$${i + 1}`).join(", ");
      const r = await pool.query(
        `SELECT id, slug, title, category, tier, summary, image_url FROM lessons WHERE slug IN (${placeholders}) AND status = 'published' LIMIT $${lesson.relatedLessonSlugs.length + 1}`,
        [...lesson.relatedLessonSlugs, limit]
      );
      return r.rows.map(snakeToCamel);
    }
    if (lesson.category) {
      const r = await pool.query(
        "SELECT id, slug, title, category, tier, summary, image_url FROM lessons WHERE category = $1 AND slug != $2 AND status = 'published' ORDER BY RANDOM() LIMIT $3",
        [lesson.category, slug, limit]
      );
      return r.rows.map(snakeToCamel);
    }
    return [];
  }

  async getLessonCount(filters?: { category?: string; tier?: string; status?: string }): Promise<number> {
    let query = "SELECT COUNT(*)::int AS count FROM lessons WHERE 1=1";
    const params: any[] = [];
    let idx = 1;
    if (filters?.category) { query += ` AND category = $${idx++}`; params.push(filters.category); }
    if (filters?.tier) { query += ` AND tier = $${idx++}`; params.push(filters.tier); }
    if (filters?.status) { query += ` AND status = $${idx++}`; params.push(filters.status); }
    const r = await pool.query(query, params);
    return r.rows[0].count;
  }

  async bulkCreateLessons(lessonsData: any[]): Promise<any[]> {
    const results: any[] = [];
    for (const data of lessonsData) {
      try {
        const lesson = await this.createLesson(data);
        results.push(lesson);
      } catch (e: any) {
        results.push({ error: e.message, slug: data.slug });
      }
    }
    return results;
  }

  async getAllPublishedLessonSlugs(): Promise<string[]> {
    const r = await pool.query(`SELECT slug FROM lessons WHERE status = 'published' ORDER BY title ASC LIMIT ${MAX_QUERY_LIMIT}`);
    return r.rows.map((row: any) => row.slug);
  }

  async getAllPricingPlans(): Promise<PricingPlan[]> {
    const r = await pool.query("SELECT id, tier, name, display_name, description, price, currency, interval, features, is_enabled, display_order, stripe_price_id, created_at FROM pricing_plans ORDER BY tier, display_order ASC LIMIT 200");
    return r.rows.map(snakeToCamel);
  }

  async getPricingPlansByTier(tier: string): Promise<PricingPlan[]> {
    const r = await pool.query("SELECT id, tier, name, display_name, description, price, currency, interval, features, is_enabled, display_order, stripe_price_id, created_at FROM pricing_plans WHERE tier = $1 AND is_enabled = true ORDER BY display_order ASC LIMIT 50", [tier]);
    return r.rows.map(snakeToCamel);
  }

  async getPricingPlan(id: string): Promise<PricingPlan | undefined> {
    const r = await pool.query("SELECT * FROM pricing_plans WHERE id = $1", [id]);
    return r.rows[0] ? snakeToCamel(r.rows[0]) : undefined;
  }

  async updatePricingPlan(id: string, updates: Partial<InsertPricingPlan>): Promise<PricingPlan> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let idx = 1;
    const priceCadVal = (updates as any).priceCad ?? (updates as any).priceCAD;
    const priceUsdVal = (updates as any).priceUsd ?? (updates as any).priceUSD;
    if (priceCadVal !== undefined) { setClauses.push(`price_cad = $${idx++}`); params.push(priceCadVal); }
    if (priceUsdVal !== undefined) { setClauses.push(`price_usd = $${idx++}`); params.push(priceUsdVal); }
    if (updates.isEnabled !== undefined) { setClauses.push(`is_enabled = $${idx++}`); params.push(updates.isEnabled); }
    if (updates.isPopular !== undefined) { setClauses.push(`is_popular = $${idx++}`); params.push(updates.isPopular); }
    if (updates.isFoundingPrice !== undefined) { setClauses.push(`is_founding_price = $${idx++}`); params.push(updates.isFoundingPrice); }
    if (updates.featureList !== undefined) { setClauses.push(`feature_list = $${idx++}`); params.push(JSON.stringify(updates.featureList)); }
    if (updates.displayOrder !== undefined) { setClauses.push(`display_order = $${idx++}`); params.push(updates.displayOrder); }
    setClauses.push(`updated_at = NOW()`);
    params.push(id);
    const r = await pool.query(`UPDATE pricing_plans SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`, params);
    return snakeToCamel(r.rows[0]);
  }

  async getFreeTrialUsage(userId: string): Promise<FreeTrialUsage | undefined> {
    const r = await pool.query("SELECT * FROM free_trial_usage WHERE user_id = $1", [userId]);
    return r.rows[0] ? snakeToCamel(r.rows[0]) : undefined;
  }

  async upsertFreeTrialUsage(userId: string, updates: Partial<{ questionsUsed: number; flashcardsUsed: number; catExamsUsed: number }>): Promise<FreeTrialUsage> {
    const r = await pool.query(
      `INSERT INTO free_trial_usage (user_id, questions_used, flashcards_used, cat_exams_used)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         questions_used = COALESCE($2, free_trial_usage.questions_used),
         flashcards_used = COALESCE($3, free_trial_usage.flashcards_used),
         cat_exams_used = COALESCE($4, free_trial_usage.cat_exams_used),
         updated_at = NOW()
       RETURNING *`,
      [userId, updates.questionsUsed ?? 0, updates.flashcardsUsed ?? 0, updates.catExamsUsed ?? 0]
    );
    return snakeToCamel(r.rows[0]);
  }

  async incrementFreeTrialUsage(userId: string, field: "questionsUsed" | "flashcardsUsed" | "catExamsUsed"): Promise<FreeTrialUsage> {
    const colMap: Record<string, string> = { questionsUsed: "questions_used", flashcardsUsed: "flashcards_used", catExamsUsed: "cat_exams_used" };
    const col = colMap[field];
    const r = await pool.query(
      `INSERT INTO free_trial_usage (user_id, ${col})
       VALUES ($1, 1)
       ON CONFLICT (user_id) DO UPDATE SET ${col} = free_trial_usage.${col} + 1, updated_at = NOW()
       RETURNING *`,
      [userId]
    );
    return snakeToCamel(r.rows[0]);
  }

  async setUserLifetime(userId: string): Promise<void> {
    await pool.query("UPDATE users SET is_lifetime = true, lifetime_purchased_at = NOW(), subscription_status = 'active' WHERE id = $1", [userId]);
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    const r = await pool.query(
      `SELECT * FROM user_subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    if (!r.rows[0]) return undefined;
    return snakeToCamel(r.rows[0]);
  }

  async upsertUserSubscription(userId: string, data: Partial<InsertUserSubscription>): Promise<UserSubscription> {
    const fieldMap: Record<string, string> = {
      planId: "plan_id",
      planName: "plan_name",
      billingInterval: "billing_interval",
      status: "status",
      activeFrom: "active_from",
      expiresAt: "expires_at",
      renewsAt: "renews_at",
      canceledAt: "canceled_at",
      trialStart: "trial_start",
      trialEnd: "trial_end",
      purchaseSource: "purchase_source",
      lastVerifiedAt: "last_verified_at",
      stripeSubscriptionId: "stripe_subscription_id",
      stripeCustomerId: "stripe_customer_id",
    };

    let existing: UserSubscription | undefined;
    if (data.stripeSubscriptionId) {
      const byStripe = await pool.query(
        `SELECT * FROM user_subscriptions WHERE stripe_subscription_id = $1 LIMIT 1`,
        [data.stripeSubscriptionId]
      );
      if (byStripe.rows[0]) existing = snakeToCamel(byStripe.rows[0]);
    }
    if (!existing) {
      existing = await this.getUserSubscription(userId);
    }

    if (existing) {
      const setClauses: string[] = [];
      const params: any[] = [];
      let idx = 1;
      for (const [key, col] of Object.entries(fieldMap)) {
        if ((data as any)[key] !== undefined) {
          setClauses.push(`${col} = $${idx++}`);
          params.push((data as any)[key]);
        }
      }
      setClauses.push(`updated_at = NOW()`);
      params.push(existing.id);
      const r = await pool.query(
        `UPDATE user_subscriptions SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
        params
      );
      return snakeToCamel(r.rows[0]);
    }

    const r = await pool.query(
      `INSERT INTO user_subscriptions (user_id, plan_id, plan_name, billing_interval, status, active_from, expires_at, renews_at, canceled_at, trial_start, trial_end, purchase_source, last_verified_at, stripe_subscription_id, stripe_customer_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), $13, $14)
       ON CONFLICT (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL
       DO UPDATE SET status = EXCLUDED.status, plan_id = EXCLUDED.plan_id, plan_name = EXCLUDED.plan_name,
         billing_interval = EXCLUDED.billing_interval, active_from = EXCLUDED.active_from,
         expires_at = EXCLUDED.expires_at, renews_at = EXCLUDED.renews_at, canceled_at = EXCLUDED.canceled_at,
         updated_at = NOW()
       RETURNING *`,
      [
        userId,
        data.planId ?? null,
        data.planName ?? null,
        data.billingInterval ?? null,
        data.status ?? "active",
        data.activeFrom ?? new Date(),
        data.expiresAt ?? null,
        data.renewsAt ?? null,
        data.canceledAt ?? null,
        data.trialStart ?? null,
        data.trialEnd ?? null,
        data.purchaseSource ?? "web",
        data.stripeSubscriptionId ?? null,
        data.stripeCustomerId ?? null,
      ]
    );
    return snakeToCamel(r.rows[0]);
  }

  async createProblemReport(data: InsertProblemReport): Promise<ProblemReport> {
    const r = await pool.query(
      `INSERT INTO problem_reports (page_url, page_title, site_section, content_id, user_id, problem_type, description, email, severity, contact_permission, device_type, browser_info, locale, tier, screenshot_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [data.pageUrl, data.pageTitle ?? null, data.siteSection ?? null, data.contentId ?? null, data.userId ?? null, data.problemType, data.description, data.email ?? null, data.severity ?? "medium", data.contactPermission ?? false, data.deviceType ?? null, data.browserInfo ?? null, data.locale ?? null, data.tier ?? null, data.screenshotUrl ?? null]
    );
    return snakeToCamel(r.rows[0]);
  }

  async getProblemReports(filters?: { problemType?: string; siteSection?: string; status?: string; tier?: string; startDate?: string; endDate?: string }): Promise<ProblemReport[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;
    if (filters?.problemType) { conditions.push(`problem_type = $${idx++}`); params.push(filters.problemType); }
    if (filters?.siteSection) { conditions.push(`site_section = $${idx++}`); params.push(filters.siteSection); }
    if (filters?.status) { conditions.push(`status = $${idx++}`); params.push(filters.status); }
    if (filters?.tier) { conditions.push(`tier = $${idx++}`); params.push(filters.tier); }
    if (filters?.startDate) { conditions.push(`created_at >= $${idx++}`); params.push(new Date(filters.startDate)); }
    if (filters?.endDate) { conditions.push(`created_at <= $${idx++}`); params.push(new Date(filters.endDate)); }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const r = await pool.query(`SELECT id, user_id, problem_type, site_section, description, status, tier, admin_notes, created_at, updated_at FROM problem_reports ${where} ORDER BY created_at DESC LIMIT 500`, params);
    return r.rows.map(snakeToCamel);
  }

  async updateProblemReport(id: string, updates: { status?: string; adminNotes?: string }): Promise<ProblemReport> {
    const sets: string[] = ["updated_at = NOW()"];
    const params: any[] = [];
    let idx = 1;
    if (updates.status !== undefined) { sets.push(`status = $${idx++}`); params.push(updates.status); }
    if (updates.adminNotes !== undefined) { sets.push(`admin_notes = $${idx++}`); params.push(updates.adminNotes); }
    params.push(id);
    const r = await pool.query(`UPDATE problem_reports SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, params);
    if (r.rows.length === 0) throw new Error("Problem report not found");
    return snakeToCamel(r.rows[0]);
  }

  async getExplanation(questionId: string, source: string): Promise<QuestionExplanation | undefined> {
    const r = await pool.query(
      `SELECT * FROM question_explanations WHERE question_id = $1 AND question_source = $2`,
      [questionId, source]
    );
    return r.rows.length > 0 ? snakeToCamel(r.rows[0]) : undefined;
  }

  async upsertExplanation(data: InsertQuestionExplanation): Promise<QuestionExplanation> {
    const r = await pool.query(
      `INSERT INTO question_explanations (question_id, question_source, correct_answer_explanation, incorrect_answer_rationale, clinical_reasoning, key_takeaway, mnemonic, clinical_pearl, reference_source, quality_score, review_status, generated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (question_id, question_source)
       DO UPDATE SET correct_answer_explanation = $3, incorrect_answer_rationale = $4, clinical_reasoning = $5, key_takeaway = $6, mnemonic = $7, clinical_pearl = $8, reference_source = $9, quality_score = $10, review_status = $11, generated_by = $12, updated_at = NOW()
       RETURNING *`,
      [data.questionId, data.questionSource, data.correctAnswerExplanation, JSON.stringify(data.incorrectAnswerRationale ?? {}), data.clinicalReasoning ?? null, data.keyTakeaway ?? null, data.mnemonic ?? null, data.clinicalPearl ?? null, data.referenceSource ?? null, JSON.stringify(data.qualityScore ?? {}), data.reviewStatus ?? "pending", data.generatedBy ?? "manual"]
    );
    return snakeToCamel(r.rows[0]);
  }

  async listMissingExplanations(source: string, limit: number): Promise<{ id: string; stem: string; options: any; correctAnswer: any }[]> {
    let query = "";
    if (source === "exam_questions") {
      query = `SELECT eq.id, eq.stem, eq.options, eq.correct_answer FROM exam_questions eq LEFT JOIN question_explanations qe ON eq.id = qe.question_id AND qe.question_source = 'exam_questions' WHERE qe.id IS NULL LIMIT $1`;
    } else if (source === "allied_questions") {
      query = `SELECT aq.id, aq.stem, aq.options, aq.correct_answer::text FROM allied_questions aq LEFT JOIN question_explanations qe ON aq.id = qe.question_id AND qe.question_source = 'allied_questions' WHERE qe.id IS NULL LIMIT $1`;
    } else if (source === "imaging_questions") {
      query = `SELECT iq.id, iq.question as stem, json_build_array(json_build_object('key','A','text',iq.option_a), json_build_object('key','B','text',iq.option_b), json_build_object('key','C','text',iq.option_c), json_build_object('key','D','text',iq.option_d)) as options, iq.correct_answer FROM imaging_questions iq LEFT JOIN question_explanations qe ON iq.id = qe.question_id AND qe.question_source = 'imaging_questions' WHERE qe.id IS NULL LIMIT $1`;
    } else {
      return [];
    }
    const r = await pool.query(query, [limit]);
    return r.rows.map(snakeToCamel);
  }

  async listLowQualityExplanations(threshold: number): Promise<QuestionExplanation[]> {
    const r = await pool.query(
      `SELECT id, question_id, question_source, correct_answer_explanation, clinical_reasoning, key_takeaway, quality_score, review_status, created_at, updated_at FROM question_explanations WHERE COALESCE((quality_score->>'composite')::int, 0) < $1 ORDER BY COALESCE((quality_score->>'composite')::int, 0) ASC LIMIT 100`,
      [threshold]
    );
    return r.rows.map(snakeToCamel);
  }

  async updateReviewStatus(id: string, status: string): Promise<QuestionExplanation> {
    const r = await pool.query(
      `UPDATE question_explanations SET review_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (r.rows.length === 0) throw new Error("Explanation not found");
    return snakeToCamel(r.rows[0]);
  }

  async getExplanationStats(): Promise<{ source: string; total: number; pending: number; approved: number; flagged: number; avgQuality: number }[]> {
    const r = await pool.query(
      `SELECT question_source as source,
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE review_status = 'pending')::int as pending,
        COUNT(*) FILTER (WHERE review_status = 'approved')::int as approved,
        COUNT(*) FILTER (WHERE review_status = 'flagged')::int as flagged,
        COALESCE(AVG(COALESCE((quality_score->>'composite')::int, 0)), 0)::int as avg_quality
       FROM question_explanations GROUP BY question_source`
    );
    return r.rows.map(snakeToCamel);
  }

  async listExplanations(filters: { status?: string; source?: string; minQuality?: number; maxQuality?: number; generatedBy?: string; limit?: number; offset?: number }): Promise<{ rows: QuestionExplanation[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters.status) {
      conditions.push(`review_status = $${idx++}`);
      params.push(filters.status);
    }
    if (filters.source) {
      conditions.push(`question_source = $${idx++}`);
      params.push(filters.source);
    }
    if (filters.minQuality !== undefined) {
      conditions.push(`COALESCE((quality_score->>'composite')::int, 0) >= $${idx++}`);
      params.push(filters.minQuality);
    }
    if (filters.maxQuality !== undefined) {
      conditions.push(`COALESCE((quality_score->>'composite')::int, 0) <= $${idx++}`);
      params.push(filters.maxQuality);
    }
    if (filters.generatedBy) {
      conditions.push(`generated_by = $${idx++}`);
      params.push(filters.generatedBy);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = Math.min(filters.limit || 50, 100);
    const offset = filters.offset || 0;

    const countR = await pool.query(`SELECT COUNT(*)::int as total FROM question_explanations ${where}`, params);
    const total = countR.rows[0]?.total || 0;

    const dataR = await pool.query(
      `SELECT id, question_id, question_source, correct_answer_explanation, clinical_reasoning, key_takeaway, quality_score, review_status, created_at, updated_at FROM question_explanations ${where} ORDER BY updated_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset]
    );

    return { rows: dataR.rows.map(snakeToCamel), total };
  }

  async updateExplanation(id: string, updates: Partial<{ correctAnswerExplanation: string; incorrectAnswerRationale: any; clinicalReasoning: string | null; keyTakeaway: string | null; mnemonic: string | null; clinicalPearl: string | null; referenceSource: string | null; reviewStatus: string; relatedContent: any }>): Promise<QuestionExplanation> {
    const sets: string[] = [];
    const params: any[] = [];
    let idx = 1;

    const fieldMap: Record<string, string> = {
      correctAnswerExplanation: "correct_answer_explanation",
      incorrectAnswerRationale: "incorrect_answer_rationale",
      clinicalReasoning: "clinical_reasoning",
      keyTakeaway: "key_takeaway",
      mnemonic: "mnemonic",
      clinicalPearl: "clinical_pearl",
      referenceSource: "reference_source",
      reviewStatus: "review_status",
      relatedContent: "related_content",
    };

    for (const [key, value] of Object.entries(updates)) {
      const col = fieldMap[key];
      if (!col) continue;
      if (key === "incorrectAnswerRationale" || key === "relatedContent") {
        sets.push(`${col} = $${idx++}`);
        params.push(JSON.stringify(value));
      } else {
        sets.push(`${col} = $${idx++}`);
        params.push(value);
      }
    }

    if (sets.length === 0) throw new Error("No valid fields to update");

    sets.push("updated_at = NOW()");
    params.push(id);

    const r = await pool.query(
      `UPDATE question_explanations SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`,
      params
    );
    if (r.rows.length === 0) throw new Error("Explanation not found");
    return snakeToCamel(r.rows[0]);
  }

  async getExplanationById(id: string): Promise<QuestionExplanation | undefined> {
    const r = await pool.query(`SELECT * FROM question_explanations WHERE id = $1`, [id]);
    return r.rows.length > 0 ? snakeToCamel(r.rows[0]) : undefined;
  }

  async getRelatedContentForExplanation(questionId: string, source: string): Promise<{ relatedQuestions: any[]; relatedLessons: any[]; relatedFlashcards: any[] }> {
    let topic: string | null = null;
    let subtopic: string | null = null;

    if (source === "exam_questions") {
      const r = await pool.query(`SELECT topic, subtopic, body_system FROM exam_questions WHERE id = $1`, [questionId]);
      if (r.rows[0]) { topic = r.rows[0].topic; subtopic = r.rows[0].subtopic; }
    } else if (source === "allied_questions") {
      const r = await pool.query(`SELECT blueprint_category as topic, subtopic FROM allied_questions WHERE id = $1`, [questionId]);
      if (r.rows[0]) { topic = r.rows[0].topic; subtopic = r.rows[0].subtopic; }
    } else if (source === "imaging_questions") {
      const r = await pool.query(`SELECT topic FROM imaging_questions WHERE id = $1`, [questionId]);
      if (r.rows[0]) { topic = r.rows[0].topic; }
    }

    if (!topic) return { relatedQuestions: [], relatedLessons: [], relatedFlashcards: [] };

    let relatedQuestionsR: { rows: any[] } = { rows: [] };
    if (source === "exam_questions") {
      relatedQuestionsR = await pool.query(
        `SELECT eq.id, eq.stem, eq.topic, eq.subtopic FROM exam_questions eq
         WHERE eq.topic = $1 AND eq.id != $2 LIMIT 5`,
        [topic, questionId]
      ).catch(() => ({ rows: [] }));
    } else if (source === "allied_questions") {
      relatedQuestionsR = await pool.query(
        `SELECT aq.id, aq.stem, aq.blueprint_category as topic, aq.subtopic FROM allied_questions aq
         WHERE aq.blueprint_category = $1 AND aq.id != $2 LIMIT 5`,
        [topic, questionId]
      ).catch(() => ({ rows: [] }));
    } else if (source === "imaging_questions") {
      relatedQuestionsR = await pool.query(
        `SELECT iq.id, iq.question as stem, iq.topic FROM imaging_questions iq
         WHERE iq.topic = $1 AND iq.id != $2 LIMIT 5`,
        [topic, questionId]
      ).catch(() => ({ rows: [] }));
    }

    const relatedLessonsR = await pool.query(
      `SELECT id, title, slug, category FROM content_items
       WHERE status = 'published' AND (category ILIKE '%' || $1 || '%' OR title ILIKE '%' || $1 || '%')
       LIMIT 5`,
      [topic]
    ).catch(() => ({ rows: [] }));

    const relatedFlashcardsR = await pool.query(
      `SELECT id, front, topic, subtopic FROM flashcard_bank
       WHERE topic = $1 AND status = 'published' LIMIT 5`,
      [topic]
    ).catch(() => ({ rows: [] }));

    return {
      relatedQuestions: relatedQuestionsR.rows.map(snakeToCamel),
      relatedLessons: relatedLessonsR.rows.map(snakeToCamel),
      relatedFlashcards: relatedFlashcardsR.rows.map(snakeToCamel),
    };
  }

  async getJobListings(filters?: { location?: string; profession?: string; experienceLevel?: string; search?: string; status?: string; featured?: boolean; limit?: number; offset?: number }): Promise<{ rows: any[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    const status = filters?.status || "published";
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);

    if (filters?.location) {
      conditions.push(`(location ILIKE $${paramIndex} OR state ILIKE $${paramIndex} OR country ILIKE $${paramIndex})`);
      params.push(`%${filters.location}%`);
      paramIndex++;
    }
    if (filters?.profession) {
      conditions.push(`(profession ILIKE $${paramIndex} OR specialty ILIKE $${paramIndex})`);
      params.push(`%${filters.profession}%`);
      paramIndex++;
    }
    if (filters?.experienceLevel) {
      conditions.push(`experience_level = $${paramIndex++}`);
      params.push(filters.experienceLevel);
    }
    if (filters?.search) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR employer ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }
    if (filters?.featured !== undefined) {
      conditions.push(`featured = $${paramIndex++}`);
      params.push(filters.featured);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;

    const countResult = await pool.query(`SELECT COUNT(*) as total FROM job_listings ${whereClause}`, params);
    const total = parseInt(countResult.rows[0]?.total || "0");

    const dataResult = await pool.query(
      `SELECT id, slug, title, company_name, location, employment_type, specialty, salary_range, status, featured, posted_at, expires_at, created_at FROM job_listings ${whereClause} ORDER BY featured DESC, posted_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, limit, offset]
    );

    return { rows: dataResult.rows.map(snakeToCamel), total };
  }

  async getJobListingBySlug(slug: string): Promise<any | undefined> {
    const result = await pool.query(`SELECT * FROM job_listings WHERE slug = $1`, [slug]);
    return result.rows[0] ? snakeToCamel(result.rows[0]) : undefined;
  }

  async getJobListing(id: string): Promise<any | undefined> {
    const result = await pool.query(`SELECT * FROM job_listings WHERE id = $1`, [id]);
    return result.rows[0] ? snakeToCamel(result.rows[0]) : undefined;
  }

  async createJobListing(data: any): Promise<any> {
    const cols = Object.keys(data);
    const snakeCols = cols.map(c => c.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`));
    const vals = cols.map(c => data[c]);
    const placeholders = vals.map((_, i) => `$${i + 1}`).join(", ");
    const result = await pool.query(
      `INSERT INTO job_listings (${snakeCols.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      vals
    );
    return snakeToCamel(result.rows[0]);
  }

  async createJobListingsBulk(data: any[]): Promise<any[]> {
    const results: any[] = [];
    for (const item of data) {
      const created = await this.createJobListing(item);
      results.push(created);
    }
    return results;
  }

  async getFeaturedJobListings(limit: number = 6): Promise<any[]> {
    const result = await pool.query(
      `SELECT id, slug, title, company_name, location, employment_type, specialty, salary_range, status, featured, posted_at FROM job_listings WHERE status = 'published' AND featured = true ORDER BY posted_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows.map(snakeToCamel);
  }

  async getContentVersion(id: string): Promise<ContentVersion | undefined> {
    const result = await pool.query(`SELECT * FROM content_versions WHERE id = $1`, [id]);
    return result.rows.length > 0 ? snakeToCamel(result.rows[0]) : undefined;
  }

  async getContentVersionHistory(contentId: string, contentType: string, limit: number = 20, offset: number = 0): Promise<{ versions: ContentVersion[]; total: number }> {
    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM content_versions WHERE content_id = $1 AND content_type = $2`,
      [contentId, contentType]
    );
    const result = await pool.query(
      `SELECT id, content_id, content_type, locale, region, tier, version_number, published_at, validation_status, payload_hash, created_by, created_at FROM content_versions WHERE content_id = $1 AND content_type = $2 ORDER BY version_number DESC LIMIT $3 OFFSET $4`,
      [contentId, contentType, limit, offset]
    );
    return { versions: result.rows.map(snakeToCamel), total: countResult.rows[0].total };
  }

  async getLatestVerifiedVersion(contentId: string, contentType: string): Promise<ContentVersion | undefined> {
    const result = await pool.query(
      `SELECT * FROM content_versions WHERE content_id = $1 AND content_type = $2 AND validation_status = 'verified' ORDER BY version_number DESC LIMIT 1`,
      [contentId, contentType]
    );
    return result.rows.length > 0 ? snakeToCamel(result.rows[0]) : undefined;
  }

  async listContentVersions(filters?: { contentType?: string; validationStatus?: string; limit?: number; offset?: number }): Promise<{ versions: ContentVersion[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];
    if (filters?.contentType) {
      params.push(filters.contentType);
      conditions.push(`content_type = $${params.length}`);
    }
    if (filters?.validationStatus) {
      params.push(filters.validationStatus);
      conditions.push(`validation_status = $${params.length}`);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM content_versions ${whereClause}`, params);
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    params.push(limit, offset);
    const result = await pool.query(
      `SELECT id, content_id, content_type, locale, region, tier, version_number, published_at, validation_status, payload_hash, created_by, created_at FROM content_versions ${whereClause} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    return { versions: result.rows.map(snakeToCamel), total: countResult.rows[0].total };
  }

  async createContentVersion(data: InsertContentVersion): Promise<ContentVersion> {
    const result = await pool.query(
      `INSERT INTO content_versions
       (id, content_id, content_type, locale, region, tier, version_number, published_at, validation_status, payload_hash, backup_artifact_refs, payload, created_by, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11, NOW(), NOW())
       RETURNING *`,
      [
        data.contentId,
        data.contentType,
        data.locale || "en",
        data.region || "US",
        data.tier || "free",
        data.versionNumber,
        data.validationStatus || "verified",
        data.payloadHash,
        JSON.stringify(data.backupArtifactRefs || []),
        JSON.stringify(data.payload),
        data.createdBy || null,
      ]
    );
    return snakeToCamel(result.rows[0]);
  }

  async updateContentVersionStatus(id: string, validationStatus: string): Promise<ContentVersion | undefined> {
    const result = await pool.query(
      `UPDATE content_versions SET validation_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [validationStatus, id]
    );
    return result.rows.length > 0 ? snakeToCamel(result.rows[0]) : undefined;
  }

  async deleteContentVersion(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM content_versions WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async createAnalyticsEvent(data: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const result = await pool.query(
      `INSERT INTO analytics_events (event_name, user_id, session_id, platform, timestamp, metadata, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        data.eventName,
        data.userId ?? null,
        data.sessionId ?? null,
        data.platform ?? null,
        data.timestamp ?? new Date(),
        JSON.stringify(data.metadata ?? {}),
        data.ipAddress ?? null,
        data.userAgent ?? null,
      ]
    );
    return snakeToCamel(result.rows[0]);
  }

  async createAnalyticsEventsBatch(data: InsertAnalyticsEvent[]): Promise<AnalyticsEvent[]> {
    if (data.length === 0) return [];
    const values: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;
    for (const event of data) {
      values.push(`($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3}, $${paramIdx + 4}, $${paramIdx + 5}, $${paramIdx + 6}, $${paramIdx + 7})`);
      params.push(
        event.eventName,
        event.userId ?? null,
        event.sessionId ?? null,
        event.platform ?? null,
        event.timestamp ?? new Date(),
        JSON.stringify(event.metadata ?? {}),
        event.ipAddress ?? null,
        event.userAgent ?? null,
      );
      paramIdx += 8;
    }
    const result = await pool.query(
      `INSERT INTO analytics_events (event_name, user_id, session_id, platform, timestamp, metadata, ip_address, user_agent)
       VALUES ${values.join(", ")} RETURNING *`,
      params
    );
    return result.rows.map(snakeToCamel);
  }

  async getAnalyticsEvents(filters: {
    eventName?: string;
    userId?: string;
    platform?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ rows: AnalyticsEvent[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;

    if (filters.eventName) {
      conditions.push(`event_name = $${paramIdx++}`);
      params.push(filters.eventName);
    }
    if (filters.userId) {
      conditions.push(`user_id = $${paramIdx++}`);
      params.push(filters.userId);
    }
    if (filters.platform) {
      conditions.push(`platform = $${paramIdx++}`);
      params.push(filters.platform);
    }
    if (filters.dateFrom) {
      conditions.push(`created_at >= $${paramIdx++}`);
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      conditions.push(`created_at <= $${paramIdx++}`);
      params.push(filters.dateTo);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = Math.min(filters.limit ?? 100, 1000);
    const offset = filters.offset ?? 0;

    const countResult = await pool.query(`SELECT COUNT(*) FROM analytics_events ${where}`, params);
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await pool.query(
      `SELECT id, event_type, user_id, session_id, metadata, created_at FROM analytics_events ${where} ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      [...params, limit, offset]
    );

    return { rows: dataResult.rows.map(snakeToCamel), total };
  }
  async getTestBankCollections(filters?: { role?: string; country?: string; exam?: string; tier?: string; isActive?: boolean }): Promise<TestBankCollection[]> {
    const conditions: any[] = [];
    if (filters?.role) conditions.push(eq(testBankCollections.role, filters.role));
    if (filters?.country) conditions.push(eq(testBankCollections.country, filters.country));
    if (filters?.exam) conditions.push(eq(testBankCollections.exam, filters.exam));
    if (filters?.tier) conditions.push(eq(testBankCollections.tier, filters.tier));
    if (filters?.isActive !== undefined) conditions.push(eq(testBankCollections.isActive, filters.isActive));
    const query = db.select().from(testBankCollections);
    if (conditions.length > 0) {
      return query.where(and(...conditions)).orderBy(testBankCollections.sortOrder).limit(200);
    }
    return query.orderBy(testBankCollections.sortOrder).limit(200);
  }

  async getTestBankCollection(id: string): Promise<TestBankCollection | undefined> {
    const [result] = await db.select().from(testBankCollections).where(eq(testBankCollections.id, id));
    return result;
  }

  async createTestBankCollection(data: InsertTestBankCollection): Promise<TestBankCollection> {
    const [result] = await db.insert(testBankCollections).values(data).returning();
    return result;
  }

  async updateTestBankCollection(id: string, updates: Partial<InsertTestBankCollection>): Promise<TestBankCollection> {
    const [result] = await db.update(testBankCollections).set({ ...updates, updatedAt: new Date() }).where(eq(testBankCollections.id, id)).returning();
    return result;
  }

  async deleteTestBankCollection(id: string): Promise<void> {
    await db.delete(testBankCollections).where(eq(testBankCollections.id, id));
  }

  async getTestBankProgress(userId: string, collectionId: string): Promise<TestBankProgress | undefined> {
    const [result] = await db.select().from(testBankProgress).where(and(eq(testBankProgress.userId, userId), eq(testBankProgress.collectionId, collectionId)));
    return result;
  }

  async getUserTestBankProgress(userId: string): Promise<TestBankProgress[]> {
    return db.select().from(testBankProgress).where(eq(testBankProgress.userId, userId)).orderBy(desc(testBankProgress.updatedAt));
  }

  async upsertTestBankProgress(userId: string, collectionId: string, updates: Partial<InsertTestBankProgress>): Promise<TestBankProgress> {
    const existing = await this.getTestBankProgress(userId, collectionId);
    if (existing) {
      const [result] = await db.update(testBankProgress).set({ ...updates, updatedAt: new Date() }).where(eq(testBankProgress.id, existing.id)).returning();
      return result;
    }
    const [result] = await db.insert(testBankProgress).values({ userId, collectionId, ...updates }).returning();
    return result;
  }

  async deleteTestBankProgress(userId: string, collectionId: string): Promise<void> {
    await db.delete(testBankProgress).where(and(eq(testBankProgress.userId, userId), eq(testBankProgress.collectionId, collectionId)));
  }

  async createQuestionHistory(data: InsertQuestionHistory): Promise<QuestionHistory> {
    const [result] = await db.insert(questionHistory).values(data).returning();
    return result;
  }

  async getQuestionHistory(id: string): Promise<QuestionHistory | undefined> {
    const [result] = await db.select().from(questionHistory).where(eq(questionHistory.id, id));
    return result;
  }

  async updateQuestionHistory(id: string, updates: Partial<InsertQuestionHistory>): Promise<QuestionHistory> {
    const [result] = await db.update(questionHistory).set(updates).where(eq(questionHistory.id, id)).returning();
    return result;
  }

  async getUserQuestionHistory(userId: string, filters?: { sourceType?: string; sessionId?: string; limit?: number; offset?: number }): Promise<QuestionHistory[]> {
    const conditions: any[] = [eq(questionHistory.userId, userId)];
    if (filters?.sourceType) conditions.push(sql`${questionHistory.sourceType} = ${filters.sourceType}`);
    if (filters?.sessionId) conditions.push(eq(questionHistory.sessionId, filters.sessionId));
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    return db.select().from(questionHistory).where(and(...conditions)).orderBy(desc(questionHistory.answeredAt)).limit(limit).offset(offset);
  }

  async getQuestionHistoryBySession(sessionId: string): Promise<QuestionHistory[]> {
    return db.select().from(questionHistory).where(eq(questionHistory.sessionId, sessionId)).orderBy(questionHistory.answeredAt).limit(500);
  }

  async createCatSession(data: InsertCatSession): Promise<CatSession> {
    const [result] = await db.insert(catSessions).values(data).returning();
    return result;
  }

  async getCatSession(id: string): Promise<CatSession | undefined> {
    const [result] = await db.select().from(catSessions).where(eq(catSessions.id, id));
    return result;
  }

  async getUserCatSessions(userId: string, filters?: { status?: string }): Promise<CatSession[]> {
    const conditions: any[] = [eq(catSessions.userId, userId)];
    if (filters?.status) conditions.push(sql`${catSessions.status} = ${filters.status}`);
    return db.select().from(catSessions).where(and(...conditions)).orderBy(desc(catSessions.startTime));
  }

  async updateCatSession(id: string, updates: Partial<InsertCatSession> & { completedAt?: Date }): Promise<CatSession> {
    const [result] = await db.update(catSessions).set({ ...updates, lastActiveAt: new Date() }).where(eq(catSessions.id, id)).returning();
    return result;
  }

  async createUserActivityLog(data: InsertUserActivityLog): Promise<UserActivityLog> {
    const [result] = await db.insert(userActivityLog).values(data).returning();
    return result;
  }

  async getUserActivityLog(userId: string, filters?: { eventType?: string; limit?: number; offset?: number }): Promise<UserActivityLog[]> {
    const conditions: any[] = [eq(userActivityLog.userId, userId)];
    if (filters?.eventType) conditions.push(sql`${userActivityLog.eventType} = ${filters.eventType}`);
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    return db.select().from(userActivityLog).where(and(...conditions)).orderBy(desc(userActivityLog.createdAt)).limit(limit).offset(offset);
  }

  async getDashboardResumeState(userId: string): Promise<DashboardResumeState | undefined> {
    const [result] = await db.select().from(dashboardResumeState).where(eq(dashboardResumeState.userId, userId));
    return result;
  }

  async upsertDashboardResumeState(userId: string, updates: Partial<InsertDashboardResumeState>): Promise<DashboardResumeState> {
    const existing = await this.getDashboardResumeState(userId);
    if (existing) {
      const [result] = await db.update(dashboardResumeState).set({ ...updates, lastUpdatedAt: new Date() }).where(eq(dashboardResumeState.id, existing.id)).returning();
      return result;
    }
    const [result] = await db.insert(dashboardResumeState).values({ userId, ...updates }).returning();
    return result;
  }

  async deleteDashboardResumeState(userId: string): Promise<void> {
    await db.delete(dashboardResumeState).where(eq(dashboardResumeState.userId, userId));
  }

  async deleteQuestionHistory(id: string): Promise<void> {
    await db.delete(questionHistory).where(eq(questionHistory.id, id));
  }

  async deleteUserQuestionHistory(userId: string): Promise<void> {
    await db.delete(questionHistory).where(eq(questionHistory.userId, userId));
  }

  async deleteCatSession(id: string): Promise<void> {
    await db.delete(catSessions).where(eq(catSessions.id, id));
  }

  async deleteUserActivityLog(id: string): Promise<void> {
    await db.delete(userActivityLog).where(eq(userActivityLog.id, id));
  }

  async createLessonBookmark(data: InsertLessonBookmark): Promise<LessonBookmark> {
    const [result] = await db.insert(lessonBookmarks).values(data).returning();
    return result;
  }

  async getLessonBookmark(userId: string, lessonId: string): Promise<LessonBookmark | undefined> {
    const [result] = await db.select().from(lessonBookmarks).where(and(eq(lessonBookmarks.userId, userId), eq(lessonBookmarks.lessonId, lessonId)));
    return result;
  }

  async getUserLessonBookmarks(userId: string): Promise<LessonBookmark[]> {
    return db.select().from(lessonBookmarks).where(eq(lessonBookmarks.userId, userId)).orderBy(desc(lessonBookmarks.createdAt)).limit(MAX_QUERY_LIMIT);
  }

  async updateLessonBookmark(userId: string, lessonId: string, updates: Partial<InsertLessonBookmark>): Promise<LessonBookmark> {
    const [result] = await db.update(lessonBookmarks).set(updates).where(and(eq(lessonBookmarks.userId, userId), eq(lessonBookmarks.lessonId, lessonId))).returning();
    return result;
  }

  async deleteLessonBookmark(userId: string, lessonId: string): Promise<void> {
    await db.delete(lessonBookmarks).where(and(eq(lessonBookmarks.userId, userId), eq(lessonBookmarks.lessonId, lessonId)));
  }

  async getMockExamSessionProgress(userId: string, attemptId: string): Promise<MockExamSessionProgress | undefined> {
    const [result] = await db.select().from(mockExamSessionProgress).where(and(eq(mockExamSessionProgress.userId, userId), eq(mockExamSessionProgress.attemptId, attemptId)));
    return result;
  }

  async getUserMockExamSessionProgress(userId: string): Promise<MockExamSessionProgress[]> {
    return db.select().from(mockExamSessionProgress).where(eq(mockExamSessionProgress.userId, userId)).orderBy(desc(mockExamSessionProgress.updatedAt)).limit(MAX_QUERY_LIMIT);
  }

  async upsertMockExamSessionProgress(userId: string, attemptId: string, updates: Partial<InsertMockExamSessionProgress>): Promise<MockExamSessionProgress> {
    const existing = await this.getMockExamSessionProgress(userId, attemptId);
    if (existing) {
      const [result] = await db.update(mockExamSessionProgress).set({ ...updates, updatedAt: new Date() }).where(eq(mockExamSessionProgress.id, existing.id)).returning();
      return result;
    }
    const [result] = await db.insert(mockExamSessionProgress).values({ userId, attemptId, ...updates }).returning();
    return result;
  }

  async deleteMockExamSessionProgress(id: string): Promise<void> {
    await db.delete(mockExamSessionProgress).where(eq(mockExamSessionProgress.id, id));
  }
}

export const storage = new DatabaseStorage();
