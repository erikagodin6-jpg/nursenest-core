/** Must match server validation in `POST /api/learner/reset-progress`. */
export const RESET_PROGRESS_CONFIRMATION_PHRASE = "RESET" as const;

/** Log / observability action key (no dedicated user audit row table in Prisma schema). */
export const USER_PROGRESS_RESET_ACTION = "USER_PROGRESS_RESET" as const;
