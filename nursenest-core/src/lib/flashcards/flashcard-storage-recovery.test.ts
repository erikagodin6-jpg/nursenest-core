import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  countSavedStudyItems,
} from "@/lib/flashcards/study-session-persistence";
import {
  readFlashcardsCustomSessionCheckpoint,
} from "@/lib/flashcards/flashcards-hub-preferences";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, String(value));
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  clear(): void {
    this.values.clear();
  }
}

function installWindowStorage(seed: Record<string, string>) {
  const storage = new MemoryStorage();
  for (const [key, value] of Object.entries(seed)) storage.setItem(key, value);
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage },
  });
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
});

describe("flashcard persisted storage recovery", () => {
  it("ignores malformed saved-card state entries instead of crashing the hub", () => {
    installWindowStorage({
      "flashcard-study-item-state:v1": JSON.stringify({
        good: { starred: true, saved: true, note: "review" },
        nullish: null,
        array: ["bad"],
        scalar: "bad",
      }),
    });

    assert.deepEqual(countSavedStudyItems(), {
      starred: 1,
      saved: 1,
      noted: 1,
      confusing: 0,
    });
  });

  it("drops malformed custom-session checkpoints before resume UI renders them", () => {
    installWindowStorage({
      nn_flashcards_custom_checkpoint_v1: JSON.stringify({
        "ca-rn-nclex-rn": {
          pathwayId: "ca-rn-nclex-rn",
          queryString: null,
          index: "not-a-number",
          totalCards: 20,
          systemsLabel: { bad: true },
          updatedAt: null,
        },
      }),
    });

    assert.equal(readFlashcardsCustomSessionCheckpoint("ca-rn-nclex-rn"), null);
  });
});
