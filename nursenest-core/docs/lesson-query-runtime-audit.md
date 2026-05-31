# Lesson Query Runtime Audit

## Scope

Systems requested:

- Cardiovascular
- Respiratory
- Renal
- GI
- Mental Health
- Maternity

Pathway:

- `ca-rn-nclex-rn`

## Query Shape

The debug query used by `/debug/lessons` is:

```ts
await prisma.pathwayLesson.findMany({
  where: {
    pathwayId,
    status: ContentStatus.PUBLISHED,
    OR: [
      { topicSlug: { in: topicCandidates } },
      { bodySystem: { in: topicCandidates } },
    ],
  },
  select: {
    id: true,
    title: true,
    slug: true,
    topicSlug: true,
    bodySystem: true,
    locale: true,
    structuralPublicComplete: true,
  },
  orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  take: 50,
});
```

## Local Result

Local database verification could not be completed because `DATABASE_URL` is not configured in this workspace:

```text
PrismaClientInitializationError: Environment variable not found: DATABASE_URL.
```

## Runtime Coverage Added

Production/runtime traces now log:

- Query started indirectly through `loader_executed`
- Query completed through `query_completed`
- Rows returned
- First 20 lesson IDs returned

This means the next production trace will distinguish:

- Route failure
- Loader failure
- Query failure
- Zero-result filtering
- Render failure

## Current Finding

The discovered root cause happened before the query could reliably start. The failure was not caused by the database returning zero rows.
