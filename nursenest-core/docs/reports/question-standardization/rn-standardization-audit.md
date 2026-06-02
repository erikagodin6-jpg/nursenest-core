# RN Standardization Audit

Generated: 2026-05-31T19:05:44.851Z

The live `exam_questions` inventory was not audited because the database was unavailable in this environment.

Reason:  Invalid `prisma.examQuestion.findMany()` invocation in /root/nursenest-core/nursenest-core/scripts/audit-question-ecosystem-standardization.mts:155:44 152 const limit = Math.max(1, Number.parseInt(process.env.NN_QUESTION_STANDARDIZATION_AUDIT_LIMIT ?? "100000", 10)); 153 154 try { → 155 const rows = await prisma.examQuestion.findMany( Can't reach database server at `HOST:5432` Please make sure your database server is running at `HOST:5432`.

Run with a reachable read-only staging or production database:

`npx tsx scripts/audit-question-ecosystem-standardization.mts`
