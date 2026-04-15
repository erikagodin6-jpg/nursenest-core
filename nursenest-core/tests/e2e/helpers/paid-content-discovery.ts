import { expect, type Page } from "@playwright/test";
import { PAID_E2E_DEFAULT_PATHWAY_ID } from "./paid-learner-shell";

/** Stable hub URLs — align with `scripts/qa-paid-test-account-reset.mts` default pathway. */
export function paidLessonsHubUrl(pathwayId: string = PAID_E2E_DEFAULT_PATHWAY_ID): string {
  return `/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}`;
}

export function paidQuestionsHubUrl(pathwayId: string = PAID_E2E_DEFAULT_PATHWAY_ID): string {
  return `/app/questions?pathwayId=${encodeURIComponent(pathwayId)}`;
}

export function paidFlashcardsHubUrl(pathwayId: string = PAID_E2E_DEFAULT_PATHWAY_ID): string {
  return `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}`;
}

export type PaidContentDiscoveryCode =
  | "noLessonContentAvailable"
  | "noQuestionBankItemsAvailable"
  | "noFlashcardDeckAvailable";

export class PaidContentDiscoveryError extends Error {
  readonly code: PaidContentDiscoveryCode;

  constructor(code: PaidContentDiscoveryCode, message: string) {
    super(message);
    this.name = "PaidContentDiscoveryError";
    this.code = code;
  }
}

/**
 * Assert at least one lesson card/link exists on the current page (hub should already be loaded).
 */
export async function expectAtLeastOneLessonLink(
  page: Page,
  opts?: { timeoutMs?: number },
): Promise<void> {
  const links = page.locator('a[href^="/app/lessons/"]');
  try {
    await expect(links.first()).toBeVisible({ timeout: opts?.timeoutMs ?? 120_000 });
  } catch {
    throw new PaidContentDiscoveryError(
      "noLessonContentAvailable",
      "No /app/lessons/* links found on hub within timeout — check pathway seed, catalog, or entitlement.",
    );
  }
}

export async function expectAtLeastOneFlashcardLearnLink(
  page: Page,
  opts?: { timeoutMs?: number },
): Promise<void> {
  const learn = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
  try {
    await expect(learn).toBeVisible({ timeout: opts?.timeoutMs ?? 120_000 });
  } catch {
    throw new PaidContentDiscoveryError(
      "noFlashcardDeckAvailable",
      "No flashcard learn-mode link found — check pathway decks and entitlement.",
    );
  }
}

/**
 * Waits for GET /api/questions JSON to include at least one question id (same pattern as entitlement direct URLs).
 */
export async function captureQuestionIdFromBankApi(page: Page): Promise<string> {
  let captured: string | null = null;
  const handler = async (resp: import("@playwright/test").Response) => {
    if (captured) return;
    let pathname = "";
    try {
      pathname = new URL(resp.url()).pathname;
    } catch {
      return;
    }
    if (pathname !== "/api/questions") return;
    if (resp.request().method() !== "GET") return;
    if (resp.status() !== 200) return;
    try {
      const data = (await resp.json()) as { questions?: Array<{ id?: string }> };
      const id = data.questions?.[0]?.id;
      if (typeof id === "string" && id.length >= 8) captured = id;
    } catch {
      /* ignore */
    }
  };
  page.on("response", handler);
  try {
    await page.goto(paidQuestionsHubUrl(), { waitUntil: "domcontentloaded" });
    for (let i = 0; i < 90 && !captured; i++) {
      await page.waitForTimeout(200);
    }
    if (!captured) {
      throw new PaidContentDiscoveryError(
        "noQuestionBankItemsAvailable",
        "Timed out waiting for GET /api/questions with a question id — bank may be empty or API failed.",
      );
    }
    return captured;
  } finally {
    page.off("response", handler);
  }
}
