/**
 * Pure access gate for explicit `ExamQuestion` id resolution (lesson quizzes / study loop).
 * Server loaders must short-circuit before Prisma when this is false so unsigned users never hit bank rows.
 */
export function subscriberMayResolveExplicitExamQuestionRows(entitlement: { hasAccess: boolean }): boolean {
  return entitlement.hasAccess;
}
