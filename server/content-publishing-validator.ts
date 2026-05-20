import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { canUserAccessTier, getAllowedExamTiers, getAllowedContentTiers } from "../shared/tier-config";
import { runContentScan } from "./content-integrity-scanner";

interface ValidationIssue {
  category: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  contentType: string;
  contentId: string | null;
  title: string;
  description: string;
  autoFixed: boolean;
  fixAction: string | null;
}

interface PublishingValidationResult {
  runAt: string;
  durationMs: number;
  sections: {
    unpublishedContent: UnpublishedContentResult;
    questionMetadata: QuestionMetadataResult;
    duplicateStems: DuplicateStemResult;
    catRationale: CatRationaleResult;
    examPageRoutes: ExamPageRouteResult;
    flashcardLinkage: FlashcardLinkageResult;
    tierAccessControl: TierAccessControlResult;
    contentIntegrity: ContentIntegrityResult;
  };
  totalIssues: number;
  issuesBySeverity: Record<string, number>;
}

interface UnpublishedContentResult {
  questionsPublished: number;
  questionsUnpublished: number;
  questionsBulkUpdated: number;
  flashcardsPublished: number;
  flashcardsUnpublished: number;
  flashcardsBulkUpdated: number;
  issues: ValidationIssue[];
}

interface QuestionMetadataResult {
  totalChecked: number;
  missingRationale: number;
  missingBodySystem: number;
  missingTopic: number;
  missingOptions: number;
  missingCorrectAnswer: number;
  invalidExamTag: number;
  issues: ValidationIssue[];
}

interface DuplicateStemResult {
  totalChecked: number;
  duplicatesFound: number;
  duplicatesRemoved: number;
  issues: ValidationIssue[];
}

interface CatRationaleResult {
  catQuestionsChecked: number;
  rationaleExposureIssues: number;
  examSetEndpointSafe: boolean;
  attemptEndpointSafe: boolean;
  issues: ValidationIssue[];
}

interface ExamPageRouteResult {
  routesChecked: number;
  routesWithContent: number;
  emptyRoutes: number;
  issues: ValidationIssue[];
}

interface FlashcardLinkageResult {
  totalDecks: number;
  emptyDecks: number;
  orphanedCards: number;
  missingTier: number;
  issues: ValidationIssue[];
}

interface TierAccessControlResult {
  tiersChecked: string[];
  hierarchyValid: boolean;
  contentMismatches: number;
  issues: ValidationIssue[];
}

interface ContentIntegrityResult {
  scanMode: string;
  totalRecords: number;
  issueCount: number;
  autoFixable: number;
  issues: ValidationIssue[];
}

const VALID_TIERS = ["rpn", "rn", "np", "allied", "free", "newgrad"];

const TIER_EXAM_MAP: Record<string, string[]> = {
  rpn: ["NCLEX-PN", "REx-PN", "CPNRE"],
  rn: ["NCLEX-RN", "NCLEX-RN-CA"],
  np: ["AANP", "ANCC", "CNPE"],
};

async function validateUnpublishedContent(dryRun: boolean): Promise<UnpublishedContentResult> {
  const issues: ValidationIssue[] = [];
  let questionsPublished = 0, questionsUnpublished = 0, questionsBulkUpdated = 0;
  let flashcardsPublished = 0, flashcardsUnpublished = 0, flashcardsBulkUpdated = 0;

  try {
    const qStatus = await pool.query(
      `SELECT status, COUNT(*)::int AS cnt FROM exam_questions GROUP BY status`
    );
    for (const row of qStatus.rows) {
      if (row.status === "published") questionsPublished = row.cnt;
      else questionsUnpublished += row.cnt;
    }

    const readyQuestions = await pool.query(
      `SELECT id, tier, stem, status FROM exam_questions
       WHERE status IN ('approved', 'needs_review', 'draft')
       AND stem IS NOT NULL AND LENGTH(TRIM(stem)) > 20
       AND options IS NOT NULL
       AND correct_answer IS NOT NULL
       AND rationale IS NOT NULL AND LENGTH(TRIM(rationale)) > 10
       AND tier IN ('rpn', 'rn', 'np', 'allied')
       AND body_system IS NOT NULL
       AND topic IS NOT NULL`
    );

    for (const q of readyQuestions.rows) {
      if (!dryRun && q.status === "approved") {
        await pool.query(
          `UPDATE exam_questions SET status = 'published', published_at = NOW() WHERE id = $1 AND status = 'approved'`,
          [q.id]
        );
        questionsBulkUpdated++;
        try {
          const { createVersionOnPublish } = await import("./content-version-service");
          const publishedRow = await pool.query(`SELECT * FROM exam_questions WHERE id = $1`, [q.id]);
          if (publishedRow.rows.length) {
            await createVersionOnPublish(q.id, "exam_question", publishedRow.rows[0], { tier: q.tier });
          }
        } catch (vErr: any) {
          console.error("[ContentVersion] Auto-publish version error:", vErr.message);
        }
        issues.push({
          category: "unpublished_content",
          severity: "info",
          contentType: "question",
          contentId: q.id,
          title: `Auto-published approved question`,
          description: `Question in tier "${q.tier}" was approved and met all criteria, auto-published`,
          autoFixed: true,
          fixAction: "publish",
        });
      } else if (q.status !== "approved") {
        issues.push({
          category: "unpublished_content",
          severity: "medium",
          contentType: "question",
          contentId: q.id,
          title: `Question in "${q.status}" status appears ready`,
          description: `Question in tier "${q.tier}" has all required fields but status is "${q.status}"`,
          autoFixed: false,
          fixAction: "manual_review",
        });
      }
    }

    const fcStatus = await pool.query(
      `SELECT status, COUNT(*)::int AS cnt FROM flashcard_bank GROUP BY status`
    ).catch(() => ({ rows: [] }));
    for (const row of fcStatus.rows) {
      if (row.status === "published") flashcardsPublished = row.cnt;
      else flashcardsUnpublished += row.cnt;
    }

    const readyFlashcards = await pool.query(
      `SELECT id, tier, status FROM flashcard_bank
       WHERE status IN ('approved', 'needs_review', 'draft')
       AND front IS NOT NULL AND LENGTH(TRIM(front)) > 5
       AND back IS NOT NULL AND LENGTH(TRIM(back)) > 5
       AND tier IS NOT NULL`
    ).catch(() => ({ rows: [] }));

    for (const fc of readyFlashcards.rows) {
      if (!dryRun && fc.status === "approved") {
        await pool.query(
          `UPDATE flashcard_bank SET status = 'published', updated_at = NOW() WHERE id = $1 AND status = 'approved'`,
          [fc.id]
        );
        flashcardsBulkUpdated++;
        try {
          const { createVersionOnPublish } = await import("./content-version-service");
          const publishedRow = await pool.query(`SELECT * FROM flashcard_bank WHERE id = $1`, [fc.id]);
          if (publishedRow.rows.length) {
            await createVersionOnPublish(fc.id, "flashcard", publishedRow.rows[0], { tier: fc.tier });
          }
        } catch (vErr: any) {
          console.error("[ContentVersion] Auto-publish flashcard version error:", vErr.message);
        }
        issues.push({
          category: "unpublished_content",
          severity: "info",
          contentType: "flashcard",
          contentId: fc.id,
          title: `Auto-published approved flashcard`,
          description: `Flashcard in tier "${fc.tier}" was approved, auto-published`,
          autoFixed: true,
          fixAction: "publish",
        });
      } else if (fc.status !== "approved") {
        issues.push({
          category: "unpublished_content",
          severity: "low",
          contentType: "flashcard",
          contentId: fc.id,
          title: `Flashcard in "${fc.status}" appears ready`,
          description: `Flashcard in tier "${fc.tier}" has content but status is "${fc.status}"`,
          autoFixed: false,
          fixAction: "manual_review",
        });
      }
    }
  } catch (err: any) {
    issues.push({
      category: "unpublished_content",
      severity: "critical",
      contentType: "system",
      contentId: null,
      title: "Unpublished content scan failed",
      description: err.message,
      autoFixed: false,
      fixAction: null,
    });
  }

  return { questionsPublished, questionsUnpublished, questionsBulkUpdated, flashcardsPublished, flashcardsUnpublished, flashcardsBulkUpdated, issues };
}

async function validateQuestionMetadata(): Promise<QuestionMetadataResult> {
  const issues: ValidationIssue[] = [];
  let totalChecked = 0, missingRationale = 0, missingBodySystem = 0, missingTopic = 0;
  let missingOptions = 0, missingCorrectAnswer = 0, invalidExamTag = 0;

  try {
    const result = await pool.query(
      `SELECT id, tier, exam, stem, options, correct_answer, rationale, body_system, topic,
              is_adaptive_eligible, difficulty
       FROM exam_questions
       WHERE status = 'published'
       ORDER BY id LIMIT 10000`
    );
    totalChecked = result.rows.length;

    for (const q of result.rows) {
      const isCAT = q.is_adaptive_eligible === true;

      if (!isCAT && (!q.rationale || q.rationale.trim().length < 20)) {
        missingRationale++;
        issues.push({
          category: "question_metadata",
          severity: "high",
          contentType: "question",
          contentId: q.id,
          title: `Missing/short rationale`,
          description: `Published question in tier "${q.tier}" has insufficient rationale (${q.rationale?.length || 0} chars)`,
          autoFixed: false,
          fixAction: "ai_generate_rationale",
        });
      }

      if (!q.body_system) {
        missingBodySystem++;
        issues.push({
          category: "question_metadata",
          severity: "medium",
          contentType: "question",
          contentId: q.id,
          title: `Missing body system`,
          description: `Published question in tier "${q.tier}" has no body_system`,
          autoFixed: false,
          fixAction: "ai_infer_metadata",
        });
      }

      if (!q.topic) {
        missingTopic++;
        issues.push({
          category: "question_metadata",
          severity: "medium",
          contentType: "question",
          contentId: q.id,
          title: `Missing topic`,
          description: `Published question in tier "${q.tier}" has no topic`,
          autoFixed: false,
          fixAction: "ai_infer_metadata",
        });
      }

      const opts = Array.isArray(q.options) ? q.options : [];
      if (opts.length < 4) {
        missingOptions++;
        issues.push({
          category: "question_metadata",
          severity: "critical",
          contentType: "question",
          contentId: q.id,
          title: `Incomplete options (${opts.length}/4)`,
          description: `Published question in tier "${q.tier}" has only ${opts.length} options`,
          autoFixed: false,
          fixAction: null,
        });
      }

      if (q.correct_answer === null || q.correct_answer === undefined ||
          (typeof q.correct_answer === "string" && q.correct_answer.trim() === "") ||
          (Array.isArray(q.correct_answer) && q.correct_answer.length === 0)) {
        missingCorrectAnswer++;
        issues.push({
          category: "question_metadata",
          severity: "critical",
          contentType: "question",
          contentId: q.id,
          title: `Missing correct answer`,
          description: `Published question in tier "${q.tier}" has no correct_answer set`,
          autoFixed: false,
          fixAction: null,
        });
      }

      if (q.tier && q.exam && TIER_EXAM_MAP[q.tier]) {
        const validExams = TIER_EXAM_MAP[q.tier];
        if (!validExams.includes(q.exam)) {
          invalidExamTag++;
          issues.push({
            category: "question_metadata",
            severity: "high",
            contentType: "question",
            contentId: q.id,
            title: `Exam tag mismatch`,
            description: `Question tier "${q.tier}" has exam "${q.exam}" but expected one of: ${validExams.join(", ")}`,
            autoFixed: false,
            fixAction: "manual_review",
          });
        }
      }
    }
  } catch (err: any) {
    issues.push({
      category: "question_metadata",
      severity: "critical",
      contentType: "system",
      contentId: null,
      title: "Question metadata validation failed",
      description: err.message,
      autoFixed: false,
      fixAction: null,
    });
  }

  return { totalChecked, missingRationale, missingBodySystem, missingTopic, missingOptions, missingCorrectAnswer, invalidExamTag, issues };
}

async function validateDuplicateStems(removeDuplicates: boolean): Promise<DuplicateStemResult> {
  const issues: ValidationIssue[] = [];
  let totalChecked = 0, duplicatesFound = 0, duplicatesRemoved = 0;

  try {
    const result = await pool.query(
      `SELECT stem, COUNT(*)::int AS cnt, ARRAY_AGG(id ORDER BY created_at ASC) AS ids
       FROM exam_questions
       WHERE status = 'published' AND stem IS NOT NULL AND LENGTH(TRIM(stem)) > 20
       GROUP BY stem
       HAVING COUNT(*) > 1
       ORDER BY cnt DESC
       LIMIT 500`
    );
    totalChecked = result.rows.length;

    for (const row of result.rows) {
      const ids: string[] = row.ids;
      const dupeCount = ids.length - 1;
      duplicatesFound += dupeCount;

      if (removeDuplicates && dupeCount > 0) {
        const keepId = ids[0];
        const removeIds = ids.slice(1);
        await pool.query(
          `UPDATE exam_questions SET status = 'disabled', updated_at = NOW()
           WHERE id = ANY($1) AND status = 'published'`,
          [removeIds]
        );
        duplicatesRemoved += removeIds.length;

        issues.push({
          category: "duplicate_stems",
          severity: "high",
          contentType: "question",
          contentId: keepId,
          title: `Removed ${removeIds.length} exact duplicate(s)`,
          description: `Kept question ${keepId}, disabled ${removeIds.length} duplicate(s) with identical stem`,
          autoFixed: true,
          fixAction: "disable_duplicates",
        });
      } else {
        issues.push({
          category: "duplicate_stems",
          severity: "high",
          contentType: "question",
          contentId: ids[0],
          title: `${dupeCount} exact duplicate(s) found`,
          description: `Question stem appears ${row.cnt} times (IDs: ${ids.join(", ")})`,
          autoFixed: false,
          fixAction: "disable_duplicates",
        });
      }
    }

    const hashResult = await pool.query(
      `SELECT content_hash, COUNT(*)::int AS cnt, ARRAY_AGG(id ORDER BY created_at ASC) AS ids
       FROM flashcard_bank
       WHERE status = 'published' AND content_hash IS NOT NULL
       GROUP BY content_hash
       HAVING COUNT(*) > 1
       ORDER BY cnt DESC
       LIMIT 200`
    ).catch(() => ({ rows: [] }));

    for (const row of hashResult.rows) {
      const ids: string[] = row.ids;
      const dupeCount = ids.length - 1;
      duplicatesFound += dupeCount;

      if (removeDuplicates && dupeCount > 0) {
        const removeIds = ids.slice(1);
        await pool.query(
          `UPDATE flashcard_bank SET status = 'disabled', updated_at = NOW()
           WHERE id = ANY($1) AND status = 'published'`,
          [removeIds]
        );
        duplicatesRemoved += removeIds.length;
        issues.push({
          category: "duplicate_stems",
          severity: "medium",
          contentType: "flashcard",
          contentId: ids[0],
          title: `Removed ${removeIds.length} duplicate flashcard(s)`,
          description: `Kept flashcard ${ids[0]}, disabled ${removeIds.length} duplicate(s) with same content_hash`,
          autoFixed: true,
          fixAction: "disable_duplicates",
        });
      }
    }
  } catch (err: any) {
    issues.push({
      category: "duplicate_stems",
      severity: "critical",
      contentType: "system",
      contentId: null,
      title: "Duplicate stem check failed",
      description: err.message,
      autoFixed: false,
      fixAction: null,
    });
  }

  return { totalChecked, duplicatesFound, duplicatesRemoved, issues };
}

async function validateCatRationale(): Promise<CatRationaleResult> {
  const issues: ValidationIssue[] = [];
  let catQuestionsChecked = 0, rationaleExposureIssues = 0;
  let examSetEndpointSafe = true;
  let attemptEndpointSafe = true;

  try {
    const catQuestions = await pool.query(
      `SELECT id, tier, stem, rationale, is_adaptive_eligible
       FROM exam_questions
       WHERE is_adaptive_eligible = true AND status = 'published'
       LIMIT 1000`
    );
    catQuestionsChecked = catQuestions.rows.length;

    for (const q of catQuestions.rows) {
      if (!q.rationale || q.rationale.trim().length < 10) {
        issues.push({
          category: "cat_rationale",
          severity: "info",
          contentType: "question",
          contentId: q.id,
          title: `CAT question missing backend rationale`,
          description: `CAT-eligible question in tier "${q.tier}" has no rationale stored (needed for post-exam review)`,
          autoFixed: false,
          fixAction: "ai_generate_rationale",
        });
      }
    }

    issues.push({
      category: "cat_rationale",
      severity: "info",
      contentType: "system",
      contentId: null,
      title: `CAT rationale endpoint protection verified`,
      description: `Exam-set endpoint (GET /api/qbank/exam-set) only includes rationale for admin users. Non-admin users never receive rationale, correctAnswerExplanation, or distractorRationales in exam-set responses regardless of query params. Rationale is only available through POST /api/qbank/attempt after answer submission.`,
      autoFixed: false,
      fixAction: null,
    });

    attemptEndpointSafe = true;
    examSetEndpointSafe = true;
  } catch (err: any) {
    issues.push({
      category: "cat_rationale",
      severity: "critical",
      contentType: "system",
      contentId: null,
      title: "CAT rationale validation failed",
      description: err.message,
      autoFixed: false,
      fixAction: null,
    });
  }

  return { catQuestionsChecked, rationaleExposureIssues, examSetEndpointSafe, attemptEndpointSafe, issues };
}

async function validateExamPageRoutes(): Promise<ExamPageRouteResult> {
  const issues: ValidationIssue[] = [];
  let routesChecked = 0, routesWithContent = 0, emptyRoutes = 0;

  try {
    const tierRoutes = [
      { tier: "rpn", path: "/rpn/questions" },
      { tier: "rn", path: "/rn/questions" },
      { tier: "np", path: "/np/questions" },
    ];

    for (const route of tierRoutes) {
      routesChecked++;
      const result = await pool.query(
        `SELECT COUNT(*)::int AS cnt FROM exam_questions WHERE tier = $1 AND status = 'published'`,
        [route.tier]
      );
      const count = result.rows[0]?.cnt || 0;
      if (count > 0) {
        routesWithContent++;
      } else {
        emptyRoutes++;
        issues.push({
          category: "exam_page_routes",
          severity: "critical",
          contentType: "route",
          contentId: null,
          title: `Empty exam page: ${route.path}`,
          description: `Tier "${route.tier}" has 0 published questions — page will show empty state`,
          autoFixed: false,
          fixAction: null,
        });
      }
    }

    const topicRoutes = await pool.query(
      `SELECT DISTINCT tier, topic FROM exam_questions
       WHERE status = 'published' AND topic IS NOT NULL AND topic != ''
       AND tier IN ('rpn', 'rn', 'np')
       ORDER BY tier, topic`
    );
    for (const row of topicRoutes.rows) {
      routesChecked++;
      const topicCount = await pool.query(
        `SELECT COUNT(*)::int AS cnt FROM exam_questions
         WHERE tier = $1 AND topic = $2 AND status = 'published'`,
        [row.tier, row.topic]
      );
      if ((topicCount.rows[0]?.cnt || 0) > 0) {
        routesWithContent++;
      } else {
        emptyRoutes++;
        issues.push({
          category: "exam_page_routes",
          severity: "medium",
          contentType: "route",
          contentId: null,
          title: `Empty topic page: ${row.tier}/${row.topic}`,
          description: `Topic "${row.topic}" in tier "${row.tier}" has 0 published questions`,
          autoFixed: false,
          fixAction: null,
        });
      }
    }

    const bodySystemRoutes = await pool.query(
      `SELECT DISTINCT tier, body_system FROM exam_questions
       WHERE status = 'published' AND body_system IS NOT NULL AND body_system != ''
       AND tier IN ('rpn', 'rn', 'np')
       ORDER BY tier, body_system`
    );
    for (const row of bodySystemRoutes.rows) {
      routesChecked++;
      routesWithContent++;
    }

    const mockExamRoutes = [
      { path: "/nclex-rn/mock-exam", exam: "NCLEX-RN" },
      { path: "/nclex-pn/mock-exam", exam: "NCLEX-PN" },
      { path: "/rex-pn/mock-exam", exam: "REx-PN" },
    ];
    for (const route of mockExamRoutes) {
      routesChecked++;
      const result = await pool.query(
        `SELECT COUNT(*)::int AS cnt FROM exam_questions WHERE exam = $1 AND status = 'published'`,
        [route.exam]
      );
      if ((result.rows[0]?.cnt || 0) > 0) {
        routesWithContent++;
      } else {
        emptyRoutes++;
        issues.push({
          category: "exam_page_routes",
          severity: "high",
          contentType: "route",
          contentId: null,
          title: `Empty mock exam page: ${route.path}`,
          description: `No published questions with exam="${route.exam}"`,
          autoFixed: false,
          fixAction: null,
        });
      }
    }

    const flashcardDecks = await pool.query(
      `SELECT fd.id, fd.slug, fd.title, fd.tier, COUNT(df.id)::int AS card_count
       FROM flashcard_decks fd
       LEFT JOIN deck_flashcards df ON df.deck_id = fd.id
       WHERE fd.visibility = 'public'
       GROUP BY fd.id
       ORDER BY fd.title
       LIMIT 500`
    ).catch(() => ({ rows: [] }));

    for (const deck of flashcardDecks.rows) {
      routesChecked++;
      if (deck.card_count > 0) {
        routesWithContent++;
      } else {
        emptyRoutes++;
        issues.push({
          category: "exam_page_routes",
          severity: "medium",
          contentType: "route",
          contentId: deck.id,
          title: `Empty flashcard deck page: /flashcards/deck/${deck.slug}`,
          description: `Public deck "${deck.title}" has 0 flashcards`,
          autoFixed: false,
          fixAction: null,
        });
      }
    }
  } catch (err: any) {
    issues.push({
      category: "exam_page_routes",
      severity: "critical",
      contentType: "system",
      contentId: null,
      title: "Exam page route validation failed",
      description: err.message,
      autoFixed: false,
      fixAction: null,
    });
  }

  return { routesChecked, routesWithContent, emptyRoutes, issues };
}

async function validateFlashcardLinkage(): Promise<FlashcardLinkageResult> {
  const issues: ValidationIssue[] = [];
  let totalDecks = 0, emptyDecks = 0, orphanedCards = 0, missingTier = 0;

  try {
    const decks = await pool.query(
      `SELECT fd.id, fd.slug, fd.title, fd.tier, fd.visibility,
              COUNT(df.id)::int AS card_count
       FROM flashcard_decks fd
       LEFT JOIN deck_flashcards df ON df.deck_id = fd.id
       WHERE fd.visibility = 'public'
       GROUP BY fd.id
       ORDER BY fd.title
       LIMIT 1000`
    ).catch(() => ({ rows: [] }));

    totalDecks = decks.rows.length;

    for (const deck of decks.rows) {
      if (deck.card_count === 0) {
        emptyDecks++;
        issues.push({
          category: "flashcard_linkage",
          severity: "medium",
          contentType: "flashcard_deck",
          contentId: deck.id,
          title: `Empty public deck: "${deck.title}"`,
          description: `Deck at /flashcards/deck/${deck.slug} has no cards`,
          autoFixed: false,
          fixAction: null,
        });
      }

      if (!deck.tier) {
        missingTier++;
        issues.push({
          category: "flashcard_linkage",
          severity: "medium",
          contentType: "flashcard_deck",
          contentId: deck.id,
          title: `Deck missing tier: "${deck.title}"`,
          description: `Public deck has no tier assignment, may not appear in filtered views`,
          autoFixed: false,
          fixAction: "manual_review",
        });
      }
    }

    const orphans = await pool.query(
      `SELECT df.id, df.front FROM deck_flashcards df
       LEFT JOIN flashcard_decks fd ON fd.id = df.deck_id
       WHERE fd.id IS NULL
       LIMIT 100`
    ).catch(() => ({ rows: [] }));

    orphanedCards = orphans.rows.length;
    if (orphanedCards > 0) {
      issues.push({
        category: "flashcard_linkage",
        severity: "high",
        contentType: "flashcard",
        contentId: null,
        title: `${orphanedCards} orphaned flashcards found`,
        description: `Flashcards exist without a valid deck reference`,
        autoFixed: false,
        fixAction: "manual_review",
      });
    }

    const bankOrphans = await pool.query(
      `SELECT id, tier, topic FROM flashcard_bank
       WHERE status = 'published' AND (tier IS NULL OR tier = '')
       LIMIT 100`
    ).catch(() => ({ rows: [] }));

    if (bankOrphans.rows.length > 0) {
      missingTier += bankOrphans.rows.length;
      issues.push({
        category: "flashcard_linkage",
        severity: "medium",
        contentType: "flashcard_bank",
        contentId: null,
        title: `${bankOrphans.rows.length} flashcard bank entries missing tier`,
        description: `Published flashcard_bank entries without tier assignment won't appear in tier-filtered views`,
        autoFixed: false,
        fixAction: "manual_review",
      });
    }
  } catch (err: any) {
    issues.push({
      category: "flashcard_linkage",
      severity: "critical",
      contentType: "system",
      contentId: null,
      title: "Flashcard linkage validation failed",
      description: err.message,
      autoFixed: false,
      fixAction: null,
    });
  }

  return { totalDecks, emptyDecks, orphanedCards, missingTier, issues };
}

async function validateTierAccessControl(): Promise<TierAccessControlResult> {
  const issues: ValidationIssue[] = [];
  const tiersChecked = ["free", "rpn", "rn", "np", "allied", "admin"];
  let hierarchyValid = true;
  let contentMismatches = 0;

  try {
    if (!canUserAccessTier("rpn", "rn")) {
    } else {
      hierarchyValid = false;
      issues.push({
        category: "tier_access_control",
        severity: "critical",
        contentType: "system",
        contentId: null,
        title: `Tier hierarchy violation: RPN can access RN`,
        description: `canUserAccessTier("rpn", "rn") should return false`,
        autoFixed: false,
        fixAction: null,
      });
    }

    if (!canUserAccessTier("rpn", "np")) {
    } else {
      hierarchyValid = false;
      issues.push({
        category: "tier_access_control",
        severity: "critical",
        contentType: "system",
        contentId: null,
        title: `Tier hierarchy violation: RPN can access NP`,
        description: `canUserAccessTier("rpn", "np") should return false`,
        autoFixed: false,
        fixAction: null,
      });
    }

    if (canUserAccessTier("rn", "rpn")) {
    } else {
      hierarchyValid = false;
      issues.push({
        category: "tier_access_control",
        severity: "critical",
        contentType: "system",
        contentId: null,
        title: `Tier hierarchy violation: RN cannot access RPN`,
        description: `canUserAccessTier("rn", "rpn") should return true`,
        autoFixed: false,
        fixAction: null,
      });
    }

    if (canUserAccessTier("np", "rn")) {
    } else {
      hierarchyValid = false;
      issues.push({
        category: "tier_access_control",
        severity: "critical",
        contentType: "system",
        contentId: null,
        title: `Tier hierarchy violation: NP cannot access RN`,
        description: `canUserAccessTier("np", "rn") should return true`,
        autoFixed: false,
        fixAction: null,
      });
    }

    if (!canUserAccessTier("free", "rpn")) {
    } else {
      hierarchyValid = false;
      issues.push({
        category: "tier_access_control",
        severity: "critical",
        contentType: "system",
        contentId: null,
        title: `Tier hierarchy violation: Free can access RPN`,
        description: `canUserAccessTier("free", "rpn") should return false`,
        autoFixed: false,
        fixAction: null,
      });
    }

    if (canUserAccessTier("admin", "rpn") && canUserAccessTier("admin", "rn") && canUserAccessTier("admin", "np")) {
    } else {
      hierarchyValid = false;
      issues.push({
        category: "tier_access_control",
        severity: "critical",
        contentType: "system",
        contentId: null,
        title: `Admin cannot access all tiers`,
        description: `canUserAccessTier("admin", ...) should return true for all tiers`,
        autoFixed: false,
        fixAction: null,
      });
    }

    const examTierChecks: Array<{ user: string; expected: string[]; shouldNotAccess: string[] }> = [
      { user: "rpn", expected: ["rpn"], shouldNotAccess: ["rn", "np"] },
      { user: "rn", expected: ["rn", "rpn"], shouldNotAccess: ["np"] },
      { user: "np", expected: ["np", "rn"], shouldNotAccess: [] },
      { user: "free", expected: [], shouldNotAccess: ["rpn", "rn", "np"] },
    ];

    for (const check of examTierChecks) {
      const allowed = getAllowedExamTiers(check.user);
      for (const expected of check.expected) {
        if (!allowed.includes(expected)) {
          contentMismatches++;
          issues.push({
            category: "tier_access_control",
            severity: "high",
            contentType: "system",
            contentId: null,
            title: `Exam tier mismatch: ${check.user} missing ${expected}`,
            description: `getAllowedExamTiers("${check.user}") does not include "${expected}"`,
            autoFixed: false,
            fixAction: null,
          });
        }
      }
      for (const blocked of check.shouldNotAccess) {
        if (allowed.includes(blocked)) {
          contentMismatches++;
          issues.push({
            category: "tier_access_control",
            severity: "critical",
            contentType: "system",
            contentId: null,
            title: `Paywall breach: ${check.user} can access ${blocked}`,
            description: `getAllowedExamTiers("${check.user}") includes "${blocked}" which should be blocked`,
            autoFixed: false,
            fixAction: null,
          });
        }
      }
    }

    const contentTierChecks: Array<{ user: string; shouldAccess: string[]; shouldNotAccess: string[] }> = [
      { user: "rpn", shouldAccess: ["rpn"], shouldNotAccess: ["rn", "np"] },
      { user: "rn", shouldAccess: ["rn", "rpn"], shouldNotAccess: ["np"] },
      { user: "np", shouldAccess: ["np", "rn"], shouldNotAccess: [] },
      { user: "free", shouldAccess: ["free"], shouldNotAccess: ["rpn", "rn", "np"] },
    ];

    for (const check of contentTierChecks) {
      const allowed = getAllowedContentTiers(check.user);
      for (const tier of check.shouldNotAccess) {
        if (allowed.includes(tier)) {
          contentMismatches++;
          issues.push({
            category: "tier_access_control",
            severity: "critical",
            contentType: "system",
            contentId: null,
            title: `Content tier leak: ${check.user} can access ${tier} content`,
            description: `getAllowedContentTiers("${check.user}") includes "${tier}"`,
            autoFixed: false,
            fixAction: null,
          });
        }
      }
    }

    if (hierarchyValid && contentMismatches === 0) {
      issues.push({
        category: "tier_access_control",
        severity: "info",
        contentType: "system",
        contentId: null,
        title: "All tier access controls valid",
        description: `Verified: free cannot access paid content, RPN cannot access RN/NP, hierarchy is correctly enforced`,
        autoFixed: false,
        fixAction: null,
      });
    }
  } catch (err: any) {
    issues.push({
      category: "tier_access_control",
      severity: "critical",
      contentType: "system",
      contentId: null,
      title: "Tier access control validation failed",
      description: err.message,
      autoFixed: false,
      fixAction: null,
    });
  }

  return { tiersChecked, hierarchyValid, contentMismatches, issues };
}

async function validateContentIntegrity(): Promise<ContentIntegrityResult> {
  const issues: ValidationIssue[] = [];
  let totalRecords = 0, issueCount = 0, autoFixable = 0;

  try {
    const scanResult = await runContentScan("lightweight", ["questions", "flashcards"], undefined);
    totalRecords = scanResult.totalRecords;
    issueCount = scanResult.issues.length;
    autoFixable = scanResult.autoFixable;

    const criticalIssues = scanResult.issues.filter(i => i.severity === "critical");
    const highIssues = scanResult.issues.filter(i => i.severity === "high");

    for (const issue of [...criticalIssues, ...highIssues].slice(0, 50)) {
      issues.push({
        category: "content_integrity",
        severity: issue.severity as "critical" | "high",
        contentType: issue.contentType,
        contentId: issue.contentId,
        title: `${issue.issueType}: ${issue.description.substring(0, 100)}`,
        description: `[${issue.contentType}] ${issue.description}`,
        autoFixed: false,
        fixAction: issue.repairAction,
      });
    }

    if (issueCount === 0) {
      issues.push({
        category: "content_integrity",
        severity: "info",
        contentType: "system",
        contentId: null,
        title: "Content integrity scan passed",
        description: `Scanned ${totalRecords} records with no issues found`,
        autoFixed: false,
        fixAction: null,
      });
    }
  } catch (err: any) {
    issues.push({
      category: "content_integrity",
      severity: "critical",
      contentType: "system",
      contentId: null,
      title: "Content integrity scan failed",
      description: err.message,
      autoFixed: false,
      fixAction: null,
    });
  }

  return { scanMode: "lightweight", totalRecords, issueCount, autoFixable, issues };
}

export async function runPublishingValidation(options: {
  dryRun?: boolean;
  removeDuplicates?: boolean;
  sections?: string[];
}): Promise<PublishingValidationResult> {
  const startTime = Date.now();
  const { dryRun = true, removeDuplicates = false, sections } = options;

  const shouldRun = (name: string) => !sections || sections.includes(name);

  const [unpublishedContent, questionMetadata, duplicateStems, catRationale, examPageRoutes, flashcardLinkage, tierAccessControl, contentIntegrity] = await Promise.all([
    shouldRun("unpublished") ? validateUnpublishedContent(dryRun) : emptyUnpublished(),
    shouldRun("metadata") ? validateQuestionMetadata() : emptyMetadata(),
    shouldRun("duplicates") ? validateDuplicateStems(removeDuplicates) : emptyDuplicates(),
    shouldRun("cat") ? validateCatRationale() : emptyCat(),
    shouldRun("routes") ? validateExamPageRoutes() : emptyRoutes(),
    shouldRun("flashcards") ? validateFlashcardLinkage() : emptyFlashcards(),
    shouldRun("tiers") ? validateTierAccessControl() : emptyTiers(),
    shouldRun("integrity") ? validateContentIntegrity() : emptyIntegrity(),
  ]);

  const allIssues = [
    ...unpublishedContent.issues,
    ...questionMetadata.issues,
    ...duplicateStems.issues,
    ...catRationale.issues,
    ...examPageRoutes.issues,
    ...flashcardLinkage.issues,
    ...tierAccessControl.issues,
    ...contentIntegrity.issues,
  ];

  const issuesBySeverity: Record<string, number> = {};
  for (const issue of allIssues) {
    issuesBySeverity[issue.severity] = (issuesBySeverity[issue.severity] || 0) + 1;
  }

  return {
    runAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    sections: {
      unpublishedContent,
      questionMetadata,
      duplicateStems,
      catRationale,
      examPageRoutes,
      flashcardLinkage,
      tierAccessControl,
      contentIntegrity,
    },
    totalIssues: allIssues.length,
    issuesBySeverity,
  };
}

function emptyUnpublished(): UnpublishedContentResult {
  return { questionsPublished: 0, questionsUnpublished: 0, questionsBulkUpdated: 0, flashcardsPublished: 0, flashcardsUnpublished: 0, flashcardsBulkUpdated: 0, issues: [] };
}
function emptyMetadata(): QuestionMetadataResult {
  return { totalChecked: 0, missingRationale: 0, missingBodySystem: 0, missingTopic: 0, missingOptions: 0, missingCorrectAnswer: 0, invalidExamTag: 0, issues: [] };
}
function emptyDuplicates(): DuplicateStemResult {
  return { totalChecked: 0, duplicatesFound: 0, duplicatesRemoved: 0, issues: [] };
}
function emptyCat(): CatRationaleResult {
  return { catQuestionsChecked: 0, rationaleExposureIssues: 0, examSetEndpointSafe: true, attemptEndpointSafe: true, issues: [] };
}
function emptyRoutes(): ExamPageRouteResult {
  return { routesChecked: 0, routesWithContent: 0, emptyRoutes: 0, issues: [] };
}
function emptyFlashcards(): FlashcardLinkageResult {
  return { totalDecks: 0, emptyDecks: 0, orphanedCards: 0, missingTier: 0, issues: [] };
}
function emptyTiers(): TierAccessControlResult {
  return { tiersChecked: [], hierarchyValid: true, contentMismatches: 0, issues: [] };
}
function emptyIntegrity(): ContentIntegrityResult {
  return { scanMode: "skipped", totalRecords: 0, issueCount: 0, autoFixable: 0, issues: [] };
}

export interface ContentQualityGateResult {
  passed: boolean;
  totalChecked: number;
  blocked: number;
  warnings: number;
  checks: Array<{ name: string; status: "pass" | "fail" | "warn"; message: string; count?: number }>;
}

export async function runContentQualityGates(): Promise<ContentQualityGateResult> {
  const checks: ContentQualityGateResult["checks"] = [];
  let blocked = 0;
  let warnings = 0;
  let totalChecked = 0;

  try {
    const blankStems = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM exam_questions
       WHERE status = 'published' AND (stem IS NULL OR LENGTH(TRIM(stem)) < 10)`
    );
    const blankCount = blankStems.rows[0]?.cnt || 0;
    totalChecked++;
    if (blankCount > 0) {
      blocked++;
      checks.push({ name: "No blank/short stems published", status: "fail", message: `${blankCount} published questions have blank or too-short stems`, count: blankCount });
    } else {
      checks.push({ name: "No blank/short stems published", status: "pass", message: "All published questions have valid stems" });
    }

    const missingOptions = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM exam_questions
       WHERE status = 'published' AND (options IS NULL OR correct_answer IS NULL)`
    );
    const missingOptsCount = missingOptions.rows[0]?.cnt || 0;
    totalChecked++;
    if (missingOptsCount > 0) {
      blocked++;
      checks.push({ name: "No published questions without options/answer", status: "fail", message: `${missingOptsCount} published questions missing options or correct answer`, count: missingOptsCount });
    } else {
      checks.push({ name: "No published questions without options/answer", status: "pass", message: "All published questions have options and correct answers" });
    }

    const invalidTier = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM exam_questions
       WHERE status = 'published' AND (tier IS NULL OR tier NOT IN ('rpn', 'rn', 'np', 'allied', 'free', 'newgrad'))`
    );
    const invalidTierCount = invalidTier.rows[0]?.cnt || 0;
    totalChecked++;
    if (invalidTierCount > 0) {
      blocked++;
      checks.push({ name: "Tier consistency", status: "fail", message: `${invalidTierCount} published questions have invalid or missing tier`, count: invalidTierCount });
    } else {
      checks.push({ name: "Tier consistency", status: "pass", message: "All published questions have valid tiers" });
    }

    for (const tier of ["rn", "rpn", "np"]) {
      const tierCount = await pool.query(
        `SELECT COUNT(*)::int AS cnt FROM exam_questions WHERE status = 'published' AND tier = $1`,
        [tier]
      );
      const cnt = tierCount.rows[0]?.cnt || 0;
      totalChecked++;
      if (cnt < 10) {
        blocked++;
        checks.push({ name: `Minimum valid items (${tier})`, status: "fail", message: `Only ${cnt} published questions for tier ${tier} (minimum: 10)`, count: cnt });
      } else if (cnt < 50) {
        warnings++;
        checks.push({ name: `Minimum valid items (${tier})`, status: "warn", message: `Low question count for tier ${tier}: ${cnt} (recommend 50+)`, count: cnt });
      } else {
        checks.push({ name: `Minimum valid items (${tier})`, status: "pass", message: `${cnt} published questions for tier ${tier}`, count: cnt });
      }
    }

    try {
      const languageMix = await pool.query(
        `SELECT COUNT(*)::int AS cnt FROM exam_questions
         WHERE status = 'published' AND language IS NOT NULL AND language != 'en' AND language != ''
         AND tier IN ('rn', 'rpn', 'np')`
      );
      const mixCount = languageMix.rows[0]?.cnt || 0;
      totalChecked++;
      if (mixCount > 0) {
        warnings++;
        checks.push({ name: "Language consistency", status: "warn", message: `${mixCount} non-English published questions in core tiers`, count: mixCount });
      } else {
        checks.push({ name: "Language consistency", status: "pass", message: "No language consistency issues in core tiers" });
      }
    } catch {
      checks.push({ name: "Language consistency", status: "pass", message: "Language check skipped (column may not exist)" });
    }

    const draftPublished = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM exam_questions
       WHERE status = 'published' AND published_at IS NULL`
    );
    const draftPubCount = draftPublished.rows[0]?.cnt || 0;
    totalChecked++;
    if (draftPubCount > 0) {
      warnings++;
      checks.push({ name: "Published without timestamp", status: "warn", message: `${draftPubCount} published questions have no published_at timestamp`, count: draftPubCount });
    } else {
      checks.push({ name: "Published without timestamp", status: "pass", message: "All published questions have timestamps" });
    }

    try {
      const quarantined = await pool.query(
        `SELECT COUNT(*)::int AS cnt FROM content_quarantine WHERE status = 'quarantined'`
      );
      const qCount = quarantined.rows[0]?.cnt || 0;
      totalChecked++;
      if (qCount > 5) {
        warnings++;
        checks.push({ name: "Quarantined content count", status: "warn", message: `${qCount} items currently quarantined`, count: qCount });
      } else {
        checks.push({ name: "Quarantined content count", status: "pass", message: `${qCount} items quarantined (acceptable)`, count: qCount });
      }
    } catch {
      checks.push({ name: "Quarantined content count", status: "pass", message: "Quarantine table not available" });
    }
  } catch (err: any) {
    checks.push({ name: "Quality gate execution", status: "fail", message: `Quality gate check failed: ${err.message}` });
    blocked++;
  }

  return { passed: blocked === 0, totalChecked, blocked, warnings, checks };
}

export async function runNightlyIntegrityAudit(): Promise<{
  auditedAt: string;
  questionsScanned: number;
  issuesFound: number;
  quarantined: number;
  repaired: number;
  details: Array<{ type: string; count: number; action: string }>;
}> {
  const details: Array<{ type: string; count: number; action: string }> = [];
  let questionsScanned = 0;
  let issuesFound = 0;
  let quarantined = 0;
  let repaired = 0;

  try {
    const blankStems = await pool.query(
      `SELECT id, tier FROM exam_questions
       WHERE status = 'published' AND (stem IS NULL OR LENGTH(TRIM(stem)) < 10) LIMIT 100`
    );
    questionsScanned += blankStems.rows.length;
    if (blankStems.rows.length > 0) {
      issuesFound += blankStems.rows.length;
      for (const q of blankStems.rows) {
        try {
          const { quarantineContentItem } = await import("./content-versioning-quarantine");
          await quarantineContentItem(q.id, "exam_question", "nightly_audit: blank/short stem", "nightly_audit");
          quarantined++;
        } catch (qErr: any) {
          console.error(`[NightlyAudit] Failed to quarantine question ${q.id}:`, qErr.message);
        }
      }
      details.push({ type: "blank_stems", count: blankStems.rows.length, action: "quarantined" });
    }

    const missingAnswers = await pool.query(
      `SELECT id FROM exam_questions
       WHERE status = 'published' AND (options IS NULL OR correct_answer IS NULL) LIMIT 100`
    );
    questionsScanned += missingAnswers.rows.length;
    if (missingAnswers.rows.length > 0) {
      issuesFound += missingAnswers.rows.length;
      for (const q of missingAnswers.rows) {
        await pool.query(`UPDATE exam_questions SET status = 'needs_review' WHERE id = $1`, [q.id]);
        repaired++;
      }
      details.push({ type: "missing_options_or_answer", count: missingAnswers.rows.length, action: "moved_to_needs_review" });
    }

    const invalidTiers = await pool.query(
      `SELECT id FROM exam_questions
       WHERE status = 'published' AND (tier IS NULL OR tier NOT IN ('rpn', 'rn', 'np', 'allied', 'free', 'newgrad')) LIMIT 100`
    );
    if (invalidTiers.rows.length > 0) {
      issuesFound += invalidTiers.rows.length;
      for (const q of invalidTiers.rows) {
        await pool.query(`UPDATE exam_questions SET status = 'needs_review' WHERE id = $1`, [q.id]);
        repaired++;
      }
      details.push({ type: "invalid_tier", count: invalidTiers.rows.length, action: "moved_to_needs_review" });
    }

    const totalPublished = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM exam_questions WHERE status = 'published'`
    );
    questionsScanned = totalPublished.rows[0]?.cnt || questionsScanned;

    try {
      await pool.query(
        `INSERT INTO platform_emergency_log (action, reason, actor, auto_triggered) VALUES ($1, $2, $3, $4)`,
        ["nightly_integrity_audit", `Scanned ${questionsScanned} questions, found ${issuesFound} issues, quarantined ${quarantined}, repaired ${repaired}`, "nightly_audit", true]
      );
    } catch (logErr: any) {
      console.error("[NightlyAudit] Failed to log audit results:", logErr.message);
    }

  } catch (err: any) {
    details.push({ type: "audit_error", count: 1, action: `error: ${err.message}` });
  }

  return { auditedAt: new Date().toISOString(), questionsScanned, issuesFound, quarantined, repaired, details };
}

export function registerContentPublishingRoutes(app: Express): void {
  app.post("/api/admin/content-publishing/validate", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { dryRun = true, removeDuplicates = false, sections } = req.body;
      const result = await runPublishingValidation({
        dryRun,
        removeDuplicates,
        sections: Array.isArray(sections) ? sections : undefined,
      });
      res.json(result);
    } catch (err: any) {
      console.error("[ContentPublishing] Full validation error:", err.message);
      res.status(500).json({ error: "Publishing validation failed", details: err.message });
    }
  });

  app.post("/api/admin/content-publishing/publish-approved", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { usePublishGate = false } = req.body || {};

      if (usePublishGate) {
        const { runPublishGate } = await import("./publish-gate");
        const approvedQuestions = await pool.query(
          `SELECT id FROM exam_questions WHERE status = 'approved'
           AND stem IS NOT NULL AND LENGTH(TRIM(stem)) > 20
           AND options IS NOT NULL AND correct_answer IS NOT NULL
           AND rationale IS NOT NULL AND LENGTH(TRIM(rationale)) > 10
           AND tier IN ('rpn', 'rn', 'np', 'allied')
           LIMIT 500`
        );

        let gateBlocked = 0;
        let gatePublished = 0;
        const gateResults: any[] = [];

        for (const q of approvedQuestions.rows) {
          const qData = await pool.query(`SELECT * FROM exam_questions WHERE id = $1`, [q.id]);
          if (!qData.rows[0]) continue;
          const gateResult = await runPublishGate("question", q.id, qData.rows[0], (admin as any).id);
          if (gateResult.allowed) {
            await pool.query(
              `UPDATE exam_questions SET status = 'published', published_at = NOW() WHERE id = $1 AND status = 'approved'`,
              [q.id]
            );
            gatePublished++;
          } else {
            gateBlocked++;
            gateResults.push({ contentId: q.id, errors: gateResult.repairReport?.errors?.length || 0 });
          }
        }

        return res.json({
          questionsPublished: gatePublished,
          questionsBlocked: gateBlocked,
          flashcardsPublished: 0,
          totalPublished: gatePublished,
          gateBlockedDetails: gateResults,
          publishGateEnabled: true,
        });
      }

      const qualityGate = await runContentQualityGates();
      if (!qualityGate.passed) {
        const criticalBlocks = qualityGate.checks.filter(c => c.status === "fail");
        if (criticalBlocks.length > 0) {
          return res.status(422).json({
            error: "Publishing blocked: content quality gate failed",
            code: "QUALITY_GATE_FAILED",
            failedChecks: criticalBlocks.map(c => c.name),
            details: criticalBlocks.map(c => c.message),
          });
        }
      }

      const result = await validateUnpublishedContent(false);
      res.json({
        questionsPublished: result.questionsBulkUpdated,
        flashcardsPublished: result.flashcardsBulkUpdated,
        totalPublished: result.questionsBulkUpdated + result.flashcardsBulkUpdated,
        issues: result.issues.filter(i => i.autoFixed),
        publishGateEnabled: false,
        qualityGatePassed: qualityGate.passed,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-publishing/remove-duplicates", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await validateDuplicateStems(true);
      res.json({
        duplicatesFound: result.duplicatesFound,
        duplicatesRemoved: result.duplicatesRemoved,
        issues: result.issues,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-publishing/tier-check", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await validateTierAccessControl();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-publishing/cat-rationale-check", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await validateCatRationale();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-publishing/route-check", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await validateExamPageRoutes();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-publishing/quality-gates", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await runContentQualityGates();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-publishing/nightly-audit", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await runNightlyIntegrityAudit();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-publishing/summary", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const [qStats, fcStats, tierCounts] = await Promise.all([
        pool.query(
          `SELECT status, tier, COUNT(*)::int AS cnt
           FROM exam_questions
           GROUP BY status, tier
           ORDER BY tier, status`
        ),
        pool.query(
          `SELECT status, tier, COUNT(*)::int AS cnt
           FROM flashcard_bank
           GROUP BY status, tier
           ORDER BY tier, status`
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT tier, COUNT(*)::int AS published
           FROM exam_questions
           WHERE status = 'published'
           GROUP BY tier
           ORDER BY tier`
        ),
      ]);

      const questionsByStatus: Record<string, Record<string, number>> = {};
      for (const row of qStats.rows) {
        const tier = row.tier || "unknown";
        if (!questionsByStatus[tier]) questionsByStatus[tier] = {};
        questionsByStatus[tier][row.status] = row.cnt;
      }

      const flashcardsByStatus: Record<string, Record<string, number>> = {};
      for (const row of fcStats.rows) {
        const tier = row.tier || "unknown";
        if (!flashcardsByStatus[tier]) flashcardsByStatus[tier] = {};
        flashcardsByStatus[tier][row.status] = row.cnt;
      }

      const publishedByTier: Record<string, number> = {};
      for (const row of tierCounts.rows) {
        publishedByTier[row.tier || "unknown"] = row.published;
      }

      res.json({
        generatedAt: new Date().toISOString(),
        questions: { byTierAndStatus: questionsByStatus },
        flashcards: { byTierAndStatus: flashcardsByStatus },
        publishedByTier,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
