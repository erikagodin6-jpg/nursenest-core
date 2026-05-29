import assert from "node:assert/strict";
import test from "node:test";
import { loadExecutiveBusinessCommandCenter } from "./load-executive-business-command-center";

test("executive business command center degrades without a database", async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    const data = await loadExecutiveBusinessCommandCenter();

    assert.equal(data.degraded, true);
    assert.equal(data.revenue.mrr.label, "MRR");
    assert.equal(data.revenue.arr.label, "ARR");
    assert.equal(data.revenue.revenueYesterday.label, "Revenue Yesterday");
    assert.equal(data.revenue.failedPayments.label, "Failed Payments");
    assert.equal(data.revenue.chargebacks.label, "Chargebacks");
    assert.equal(data.revenue.refunds.label, "Refunds");
    assert.equal(data.revenue.referralRevenue.label, "Referral Revenue");
    assert.equal(data.revenue.institutionRevenue.label, "Institution Revenue");
    assert.equal(data.subscriptions.newSubscribers.label, "New Subscribers");
    assert.equal(data.subscriptions.cancelledSubscribers.label, "Cancelled Subscribers");
    assert.equal(data.learnerActivity.activeLearners.label, "Active Learners");
    assert.equal(data.learnerActivity.studySessions.label, "Study Sessions");
    assert.equal(data.learnerActivity.questionsAnswered.label, "Questions Answered");
    assert.equal(data.uptime.flashcards.label, "Flashcard Uptime");
    assert.equal(data.uptime.cat.label, "CAT Uptime");
    assert.equal(data.uptime.questions.label, "Question Uptime");
    assert.equal(data.uptime.systemHealth.label, "System Health");
  } finally {
    if (previousDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = previousDatabaseUrl;
    }
  }
});
