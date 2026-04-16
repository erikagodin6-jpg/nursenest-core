import type { Page } from "@playwright/test";

/**
 * Marketing `/login` credentials form — submit label is i18n (`pages.login.submit`), so role+name
 * matchers must not assume English. Scope to the form that owns `#login-identifier`.
 */
export function marketingLoginSubmitButton(page: Page) {
  return page.locator("form:has(#login-identifier) button[type='submit']");
}
