import assert from "node:assert/strict";
import test from "node:test";

import {
  FAQ_HUB_SEEDS,
  SEARCH_INTENT_QUESTION_SEEDS,
  buildFaqHubQuestions,
  buildSearchIntentAnswerContract,
  buildSearchIntentDashboard,
  scoreSearchIntentOpportunity,
  validateSearchIntentAnswerContract,
} from "./healthcare-search-intent-domination-engine";

test("question database seeds cover nursing, NP, pre-nursing, and allied health questions", () => {
  const questions = SEARCH_INTENT_QUESTION_SEEDS.map((seed) => seed.question);

  assert.ok(questions.includes("What Is Heart Failure?"));
  assert.ok(questions.includes("What Is CNPLE?"));
  assert.ok(questions.includes("Is HESI Harder Than TEAS?"));
  assert.ok(questions.includes("How Do Ventilators Work?"));
  assert.ok(questions.includes("What Is A Primary Survey?"));
  assert.ok(questions.includes("What Is An ADL Assessment?"));
  assert.ok(questions.includes("What Is A Gait Assessment?"));
  assert.ok(questions.includes("What Is CBC Interpretation?"));
});

test("every question stores intent, opportunity, cluster, status, and visibility targets", () => {
  for (const question of SEARCH_INTENT_QUESTION_SEEDS) {
    assert.ok(question.id);
    assert.ok(question.topic);
    assert.ok(question.cluster);
    assert.ok(question.searchVolume >= 0);
    assert.ok(question.difficulty >= 0);
    assert.ok(question.trafficOpportunity >= 0);
    assert.ok(question.conversionOpportunity >= 0);
    assert.equal(question.answerStatus, "not_started");
    assert.deepEqual(question.visibilityTargets, ["google_search", "ai_overview", "featured_snippet", "people_also_ask", "voice_search", "long_tail"]);
  }
});

test("answer contract requires snippet, AI overview, internal links, and conversion paths", () => {
  const question = SEARCH_INTENT_QUESTION_SEEDS.find((seed) => seed.id === "what-is-bnp");
  assert.ok(question);

  const contract = buildSearchIntentAnswerContract(question);
  assert.deepEqual(validateSearchIntentAnswerContract(contract), []);
  assert.ok(contract.requiredBlocks.includes("short_answer"));
  assert.ok(contract.requiredBlocks.includes("snippet_block"));
  assert.ok(contract.relatedResources.includes("related_lessons"));
  assert.ok(contract.relatedResources.includes("related_flashcards"));
  assert.ok(contract.relatedResources.includes("related_care_plans"));
  assert.ok(contract.accountCreationCta.includes("free account"));
  assert.ok(contract.trialCta.includes("practice questions"));
  assert.ok(contract.subscriptionCta.includes("Unlock"));
});

test("conversion features adapt to exam, clinical, career, and procedure intent", () => {
  const nclex = SEARCH_INTENT_QUESTION_SEEDS.find((seed) => seed.id === "how-long-study-nclex");
  const peep = SEARCH_INTENT_QUESTION_SEEDS.find((seed) => seed.id === "what-is-peep");
  const career = SEARCH_INTENT_QUESTION_SEEDS.find((seed) => seed.id === "what-does-ot-do");
  const procedure = SEARCH_INTENT_QUESTION_SEEDS.find((seed) => seed.id === "what-is-primary-survey");
  assert.ok(nclex && peep && career && procedure);

  assert.ok(buildSearchIntentAnswerContract(nclex).conversionFeatures.includes("Study Plans"));
  assert.ok(buildSearchIntentAnswerContract(peep).conversionFeatures.includes("Labs"));
  assert.ok(buildSearchIntentAnswerContract(career).conversionFeatures.includes("Notebook"));
  assert.ok(buildSearchIntentAnswerContract(procedure).conversionFeatures.includes("Clinical Skills"));
});

test("FAQ hubs collect topic-specific question IDs and canonical paths", () => {
  assert.ok(FAQ_HUB_SEEDS.some((hub) => hub.title === "Heart Failure FAQ"));
  assert.ok(FAQ_HUB_SEEDS.some((hub) => hub.title === "RT FAQ"));
  assert.ok(FAQ_HUB_SEEDS.some((hub) => hub.title === "Paramedic FAQ"));
  assert.ok(FAQ_HUB_SEEDS.every((hub) => hub.canonicalPath.startsWith("/faq/")));

  const rtHub = FAQ_HUB_SEEDS.find((hub) => hub.title === "RT FAQ");
  assert.ok(rtHub);
  const rtQuestions = buildFaqHubQuestions(rtHub);
  assert.equal(rtQuestions.some((question) => question.question === "What Is An ABG?"), true);
  assert.equal(rtQuestions.some((question) => question.question === "What Is PEEP?"), true);
});

test("dashboard tracks year-one target and search intent backlog", () => {
  const dashboard = buildSearchIntentDashboard();

  assert.equal(dashboard.yearOneTarget, 10000);
  assert.equal(dashboard.totalQuestions, SEARCH_INTENT_QUESTION_SEEDS.length);
  assert.equal(dashboard.remainingToYearOneTarget, 10000 - SEARCH_INTENT_QUESTION_SEEDS.length);
  assert.equal(dashboard.publishedAnswers, 0);
  assert.equal(dashboard.draftBacklog, SEARCH_INTENT_QUESTION_SEEDS.length);
  assert.ok(dashboard.questionsByProfession.RN > 0);
  assert.ok(dashboard.questionsByProfession.NP > 0);
  assert.ok(dashboard.questionsByProfession.RT > 0);
  assert.ok(dashboard.questionsByIntent.definition > 0);
  assert.ok(dashboard.questionsByIntent.comparison > 0);
  assert.ok(dashboard.topTrafficOpportunities[0]?.trafficOpportunity >= dashboard.topTrafficOpportunities[1]!.trafficOpportunity);
  assert.ok(dashboard.topConversionOpportunities[0]?.conversionOpportunity >= dashboard.topConversionOpportunities[1]!.conversionOpportunity);
});

test("opportunity scoring rewards traffic, conversion, volume, and lower difficulty", () => {
  const nclex = SEARCH_INTENT_QUESTION_SEEDS.find((seed) => seed.id === "how-long-study-nclex");
  const secondarySurvey = SEARCH_INTENT_QUESTION_SEEDS.find((seed) => seed.id === "what-is-secondary-survey");
  assert.ok(nclex && secondarySurvey);

  assert.ok(scoreSearchIntentOpportunity(nclex) > scoreSearchIntentOpportunity(secondarySurvey));
});
