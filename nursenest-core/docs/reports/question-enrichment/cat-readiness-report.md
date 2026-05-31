# CAT Readiness Report

Generated: 2026-05-31T18:59:29.297Z

The live `exam_questions` inventory was not audited because the database was unavailable in this environment.

Reason:  Invalid `prisma.examQuestion.findMany()` invocation in /root/nursenest-core/nursenest-core/scripts/audit-rn-rpn-np-question-enrichment.mts:186:44 183 const prisma = new PrismaClient(); 184 185 try { → 186 const rows = await prisma.examQuestion.findMany( Can't reach database server at `HOST:5432` Please make sure your database server is running at `HOST:5432`.

Run against a reachable read-only staging or production database:

`npx tsx scripts/audit-rn-rpn-np-question-enrichment.mts`

The audit engine and contract tests remain available without database access.
