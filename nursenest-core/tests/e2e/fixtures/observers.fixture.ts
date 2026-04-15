/**
 * Optional extended `test` that attaches console/network observers for every test.
 *
 *   import { test, expect } from "../fixtures/observers.fixture";
 */
import { test as base } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";

export const test = base.extend<{ observers: PageObservers }>({
  observers: async ({ page }, use) => {
    const observers = attachPageObservers(page, { profile: "public" });
    await use(observers);
    observers.dispose();
  },
});

export { expect } from "@playwright/test";
