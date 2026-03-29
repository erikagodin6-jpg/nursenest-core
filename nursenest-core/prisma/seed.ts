import "../src/lib/db/env-bootstrap";
import { hash } from "bcryptjs";
import { ContentStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const fundamentals = await prisma.category.upsert({
    where: { slug: "fundamentals" },
    update: {},
    create: { name: "Fundamentals", slug: "fundamentals", topicCode: "fundamentals" },
  });

  const published = "published";

  await prisma.contentItem.createMany({
    data: [
      {
        title: "CA RPN Fluid Balance",
        slug: "ca-rpn-fluid-balance",
        summary: "Essential fluid and electrolyte foundations.",
        type: "lesson",
        content: [{ sectionTitle: "Body", content: "Sample lesson content for CA RPN." }],
        regionScope: "CA_ONLY",
        tier: "rpn",
        status: published,
        category: fundamentals.name,
      },
      {
        title: "US LVN/LPN Infection Control",
        slug: "us-lvn-infection-control",
        summary: "Practical infection prevention for NCLEX-PN style prep.",
        type: "lesson",
        content: [{ sectionTitle: "Body", content: "Sample lesson content for US LVN/LPN." }],
        regionScope: "US_ONLY",
        tier: "lvn",
        status: published,
        category: fundamentals.name,
      },
      {
        title: "RN Clinical Prioritization",
        slug: "rn-clinical-prioritization",
        summary: "Prioritization and delegation essentials.",
        type: "lesson",
        content: [{ sectionTitle: "Body", content: "Sample lesson content for RN." }],
        regionScope: "CA_ONLY",
        tier: "rn",
        status: published,
        category: fundamentals.name,
      },
      {
        title: "NP Differential Diagnosis Foundations",
        slug: "np-differential-diagnosis",
        summary: "Structured clinical reasoning for NP pathways.",
        type: "lesson",
        content: [{ sectionTitle: "Body", content: "Sample lesson content for NP." }],
        regionScope: "US_ONLY",
        tier: "np",
        status: published,
        category: fundamentals.name,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.examQuestion.createMany({
    data: [
      {
        stem: "A client with dehydration has BP 88/54. Which action is priority?",
        rationale: "Restore intravascular volume promptly and reassess perfusion.",
        options: ["Start isotonic fluids", "Encourage oral fluids only", "Restrict sodium", "Delay intervention"],
        correctAnswer: ["Start isotonic fluids"],
        questionType: "multiple_choice",
        countryCode: "CA",
        tier: "rpn",
        status: published,
        exam: "NCLEX_PN",
        topic: fundamentals.name,
        careerType: "nursing",
        regionScope: "BOTH",
      },
      {
        stem: "Select all findings consistent with hypoglycemia.",
        rationale: "Sweating, tremor, confusion, and tachycardia are typical signs.",
        options: ["Diaphoresis", "Bradycardia", "Confusion", "Tremor"],
        correctAnswer: ["Diaphoresis", "Confusion", "Tremor"],
        questionType: "sata",
        countryCode: "US",
        tier: "rn",
        status: published,
        exam: "NCLEX_RN",
        topic: fundamentals.name,
        careerType: "nursing",
        regionScope: "BOTH",
      },
      {
        stem: "A CA hospital unit is short-staffed. Which duty aligns with RN scope first?",
        rationale: "Prioritize safe patient assignments and escalate staffing per policy.",
        options: ["Accept all additional patients alone", "Delegate assessments to unlicensed staff without supervision", "Report unsafe staffing and stabilize current assignments", "Leave the unit"],
        correctAnswer: ["Report unsafe staffing and stabilize current assignments"],
        questionType: "multiple_choice",
        countryCode: "CA",
        tier: "rn",
        status: published,
        exam: "NCLEX_RN",
        topic: fundamentals.name,
        careerType: "nursing",
        regionScope: "BOTH",
      },
    ],
    skipDuplicates: true,
  });

  const exam = await prisma.exam.create({
    data: { title: "Core Readiness Exam", country: "CA", tier: "RN", status: ContentStatus.PUBLISHED },
  });

  const adminHash = await hash("AdminPass123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nursenest.ca" },
    update: {},
    create: {
      email: "admin@nursenest.ca",
      name: "NurseNest Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      country: "CA",
      tier: "RN",
    },
  });

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: "seed-sub-admin" },
    update: { status: "ACTIVE" },
    create: {
      userId: admin.id,
      stripeSubscriptionId: "seed-sub-admin",
      stripeCustomerId: "seed-customer-admin",
      status: "ACTIVE",
    },
  });

  await prisma.examAttempt.create({
    data: {
      userId: admin.id,
      examId: exam.id,
      score: 8,
      total: 10,
    },
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
