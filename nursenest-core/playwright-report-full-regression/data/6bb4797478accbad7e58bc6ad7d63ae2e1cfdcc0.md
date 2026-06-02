# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/e2e/public/public-site-smoke.spec.ts >> Public site smoke >> login page loads
- Location: tests/e2e/public/public-site-smoke.spec.ts:109:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 9

- Array []
+ Array [
+   "%c%s%c [nursenest-core] seo marketing_canonical_rejected {\"code\":\"auth_noindex_path\",\"url\":\"https://www.nursenest.ca/login\",\"detail\":\"/login\"} background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px  Server  ",
+   "%c%s%c [nursenest-core] seo marketing_hreflang_rejected {\"lang\":\"x-default\",\"url\":\"https://www.nursenest.ca/login\",\"code\":\"auth_noindex_path\",\"detail\":\"/login\"} background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px  Server  ",
+   "%c%s%c [nursenest-core] seo marketing_hreflang_rejected {\"lang\":\"en-CA\",\"url\":\"https://www.nursenest.ca/login\",\"code\":\"auth_noindex_path\",\"detail\":\"/login\"} background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px  Server  ",
+   "%c%s%c [nursenest-core] seo marketing_hreflang_rejected {\"lang\":\"es\",\"url\":\"https://www.nursenest.ca/es/login\",\"code\":\"auth_noindex_path\",\"detail\":\"/es/login\"} background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px  Server  ",
+   "%c%s%c [nursenest-core] seo marketing_hreflang_rejected {\"lang\":\"tl\",\"url\":\"https://www.nursenest.ca/tl/login\",\"code\":\"auth_noindex_path\",\"detail\":\"/tl/login\"} background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px  Server  ",
+   "%c%s%c [nursenest-core] seo marketing_hreflang_rejected {\"lang\":\"hi\",\"url\":\"https://www.nursenest.ca/hi/login\",\"code\":\"auth_noindex_path\",\"detail\":\"/hi/login\"} background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px  Server  ",
+   "%c%s%c [nursenest-core] seo marketing_hreflang_rejected {\"lang\":\"pt-BR\",\"url\":\"https://www.nursenest.ca/pt/login\",\"code\":\"auth_noindex_path\",\"detail\":\"/pt/login\"} background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px  Server  ",
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "6"
          - generic [ref=e15]: "7"
        - generic [ref=e16]:
          - text: Issue
          - generic [ref=e17]: s
      - button "Collapse issues badge" [ref=e18]:
        - img [ref=e19]
  - alert [ref=e21]
  - generic [ref=e22]:
    - banner [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e27]:
          - generic [ref=e29]:
            - 'button "Select country: Canada" [ref=e31]':
              - img [ref=e32]
              - generic [ref=e35]: Select country
              - generic [ref=e36]: 🇨🇦
              - generic [ref=e37]: Canada
              - img [ref=e38]
            - button "Language" [ref=e41]:
              - text: Language
              - img [ref=e42]
            - button "Theme ▾" [ref=e46]:
              - generic [ref=e48]: Theme
              - generic [ref=e49]: ▾
          - generic [ref=e50]:
            - link "NurseNest home" [ref=e52] [cursor=pointer]:
              - /url: /
              - generic [ref=e53]:
                - img "NurseNest leaf logo" [ref=e55]
                - generic [ref=e56]: NurseNest
            - navigation "Who we help" [ref=e57]:
              - link "Pricing" [ref=e58] [cursor=pointer]:
                - /url: /pricing
              - link "Blog" [ref=e59] [cursor=pointer]:
                - /url: /blog
              - link "FAQ" [ref=e60] [cursor=pointer]:
                - /url: /faq
              - link "Pre-Nursing" [ref=e61] [cursor=pointer]:
                - /url: /pre-nursing
              - link "Tools" [ref=e62] [cursor=pointer]:
                - /url: /tools
            - generic [ref=e64]:
              - link "Log in to your NurseNest account" [ref=e65] [cursor=pointer]:
                - /url: /login?callbackUrl=/
                - text: Log In
              - link "Start free account — nursing and healthcare exam prep" [ref=e66] [cursor=pointer]:
                - /url: /signup?callbackUrl=%2F
                - text: Start Free
        - navigation "Who we help" [ref=e69]:
          - link "RN" [ref=e70] [cursor=pointer]:
            - /url: /canada/rn/nclex-rn
          - link "RPN" [ref=e71] [cursor=pointer]:
            - /url: /canada/pn/rex-pn
          - link "NP" [ref=e72] [cursor=pointer]:
            - /url: /canada/np/cnple
          - link "New Grad" [ref=e73] [cursor=pointer]:
            - /url: /canada/new-grad
          - link "Allied" [ref=e74] [cursor=pointer]:
            - /url: /allied/allied-health
    - main [ref=e75]:
      - main [ref=e77]:
        - generic [ref=e78]:
          - img
          - generic [ref=e79]:
            - img "NurseNest" [ref=e82]
            - generic [ref=e83]:
              - heading "Welcome Back" [level=1] [ref=e84]
              - paragraph [ref=e85]: Sign in to continue your exam prep.
            - generic [ref=e86]:
              - generic [ref=e87]:
                - text: Email or username
                - textbox "Email or username" [ref=e88]:
                  - /placeholder: Enter your email or username
                - paragraph [ref=e89]: Use the email on your account or your NurseNest username. Password reset always uses email.
              - generic [ref=e90]:
                - generic [ref=e91]:
                  - generic [ref=e92]: Password
                  - link "Forgot Password?" [ref=e93] [cursor=pointer]:
                    - /url: /forgot-password
                - textbox "Password" [ref=e94]
              - generic [ref=e95]:
                - checkbox "Remember me" [checked] [ref=e96]
                - generic [ref=e97]:
                  - text: Remember me
                  - paragraph [ref=e98]: Stay signed in on this device for quicker access.
              - paragraph [ref=e99]:
                - text: By signing in, you agree to our
                - link "Terms of Service" [ref=e100] [cursor=pointer]:
                  - /url: /terms
                - text: and
                - link "Privacy Policy" [ref=e101] [cursor=pointer]:
                  - /url: /privacy
                - text: .
              - button "Sign In" [ref=e102]
              - paragraph [ref=e103]:
                - text: Don't have an account?
                - link "Create Account" [ref=e104] [cursor=pointer]:
                  - /url: /signup
            - generic [ref=e105]:
              - paragraph [ref=e106]: Having trouble signing in?
              - list [ref=e107]:
                - listitem [ref=e108]:
                  - link "Forgot Password?" [ref=e109] [cursor=pointer]:
                    - /url: /forgot-password
                  - generic [ref=e110]: — We email a reset link to the address on your account (not your username).
                - listitem [ref=e111]: Not sure whether you used email or username? Try either—both work for sign-in. To find your email, search your inbox for messages from NurseNest.
                - listitem [ref=e112]:
                  - link "Contact support" [ref=e113] [cursor=pointer]:
                    - /url: /contact
                  - text: if you still need help.
        - region "Quick Answers" [ref=e114]:
          - generic "Quick Answers" [ref=e115]:
            - paragraph [ref=e116]: Quick Answers
            - list [ref=e117]:
              - listitem [ref=e118]:
                - img [ref=e120]
                - generic [ref=e123]:
                  - paragraph [ref=e124]: Is my account information secure?
                  - paragraph [ref=e125]: Sign-in uses encrypted connections (HTTPS) and industry-standard password protection. Use a strong, unique password and keep it private.
              - listitem [ref=e126]:
                - img [ref=e128]
                - generic [ref=e131]:
                  - paragraph [ref=e132]: What if sign-in fails or my email is not recognized?
                  - paragraph [ref=e133]: Double-check the email or NurseNest username you use to sign in. Password reset always uses your account email. If it still fails, contact support from this page.
              - listitem [ref=e134]:
                - img [ref=e136]
                - generic [ref=e139]:
                  - paragraph [ref=e140]: How do I reset my password?
                  - paragraph [ref=e141]: Use "Forgot password?" on this page with the email address on your account. Reset messages can land in spam or promotions—wait a few minutes before trying again.
              - listitem [ref=e142]:
                - img [ref=e144]
                - generic [ref=e148]:
                  - paragraph [ref=e149]: Can I trust NurseNest while I prepare?
                  - paragraph [ref=e150]: NurseNest is built for exam-focused prep with clear pathways and practice. If something looks incorrect, contact support so we can review it.
    - contentinfo [ref=e151]:
      - generic [ref=e152]:
        - generic [ref=e155]:
          - generic [ref=e156]:
            - generic [ref=e157]:
              - img "NurseNest" [ref=e159]
              - generic [ref=e160]: NurseNest
            - paragraph [ref=e161]: Supporting Nurses Globally
            - paragraph [ref=e162]: NCLEX and global licensing prep for RN, PN/LVN, NP, and allied learners—strongest in the United States and Canada, with dedicated regional hubs worldwide.
            - paragraph [ref=e163]: Pathways across North America, Asia, and the Middle East
          - generic [ref=e164]:
            - heading "Exam Pathways" [level=3] [ref=e165]
            - list [ref=e166]:
              - listitem [ref=e167]:
                - link "RN" [ref=e168] [cursor=pointer]:
                  - /url: /canada/rn/nclex-rn
              - listitem [ref=e169]:
                - link "RPN" [ref=e170] [cursor=pointer]:
                  - /url: /canada/pn/rex-pn
              - listitem [ref=e171]:
                - link "NP" [ref=e172] [cursor=pointer]:
                  - /url: /canada/np/cnple
              - listitem [ref=e173]:
                - link "Allied Health" [ref=e174] [cursor=pointer]:
                  - /url: https://www.nursenest.ca/allied/allied-health
          - generic [ref=e175]:
            - heading "Explore" [level=3] [ref=e176]
            - list [ref=e177]:
              - listitem [ref=e178]:
                - link "Pricing" [ref=e179] [cursor=pointer]:
                  - /url: /pricing
              - listitem [ref=e180]:
                - link "For Schools" [ref=e181] [cursor=pointer]:
                  - /url: /for-institutions
              - listitem [ref=e182]:
                - link "Lessons" [ref=e183] [cursor=pointer]:
                  - /url: /lessons
              - listitem [ref=e184]:
                - link "Practice Questions" [ref=e185] [cursor=pointer]:
                  - /url: https://www.nursenest.ca/question-bank
              - listitem [ref=e186]:
                - link "Blog" [ref=e187] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e188]:
                - link "Tools" [ref=e189] [cursor=pointer]:
                  - /url: /tools
          - generic [ref=e190]:
            - heading "Regional Hubs" [level=3] [ref=e191]
            - list [ref=e192]:
              - listitem [ref=e193]:
                - link "REx-PN Prep" [ref=e194] [cursor=pointer]:
                  - /url: /canada/pn/rex-pn
              - listitem [ref=e195]:
                - link "Canadian NCLEX-RN" [ref=e196] [cursor=pointer]:
                  - /url: /lessons
              - listitem [ref=e197]:
                - link "Nursing in Canada" [ref=e198] [cursor=pointer]:
                  - /url: https://www.nursenest.ca/canada
          - generic [ref=e199]:
            - heading "Account" [level=3] [ref=e200]
            - list [ref=e201]:
              - listitem [ref=e202]:
                - link "Log In" [ref=e203] [cursor=pointer]:
                  - /url: /login?callbackUrl=/
              - listitem [ref=e204]:
                - link "Email support" [ref=e205] [cursor=pointer]:
                  - /url: mailto:support%40nursenest.ca
                - generic [ref=e206]: Please allow up to 4 business days for a response.
              - listitem [ref=e207]:
                - link "Start Studying" [ref=e208] [cursor=pointer]:
                  - /url: /signup?callbackUrl=%2Fquestion-bank
        - generic [ref=e209]:
          - heading "Study Nursing in Your Language" [level=3] [ref=e210]
          - generic [ref=e211]:
            - button "🇬🇧 English" [ref=e212]:
              - generic [ref=e213]: 🇬🇧
              - generic [ref=e214]: English
            - button "🇫🇷 Français (partial)" [ref=e215]:
              - generic [ref=e216]: 🇫🇷
              - generic [ref=e217]: Français (partial)
            - button "🇪🇸 Español" [ref=e218]:
              - generic [ref=e219]: 🇪🇸
              - generic [ref=e220]: Español
            - button "🇵🇭 Tagalog" [ref=e221]:
              - generic [ref=e222]: 🇵🇭
              - generic [ref=e223]: Tagalog
            - button "🇮🇳 हिन्दी" [ref=e224]:
              - generic [ref=e225]: 🇮🇳
              - generic [ref=e226]: हिन्दी
            - button "🇧🇷 Português (Brasil)" [ref=e227]:
              - generic [ref=e228]: 🇧🇷
              - generic [ref=e229]: Português (Brasil)
          - link "View All Languages →" [ref=e230] [cursor=pointer]:
            - /url: https://www.nursenest.ca/languages
        - generic [ref=e233]:
          - generic [ref=e234]:
            - heading "Get clinically useful questions in your inbox" [level=3] [ref=e235]
            - paragraph [ref=e236]: Choose how often you hear from us. Unsubscribe anytime.
          - generic [ref=e237]:
            - textbox "Enter your email address" [ref=e238]
            - button "Send Me Practice Questions" [ref=e239]
        - generic [ref=e240]:
          - generic [ref=e241]: © 2026 NurseNest. All rights reserved.
          - generic [ref=e242]:
            - link "Terms" [ref=e243] [cursor=pointer]:
              - /url: https://www.nursenest.ca/terms
            - generic [ref=e244]: ·
            - link "Privacy" [ref=e245] [cursor=pointer]:
              - /url: https://www.nursenest.ca/privacy
        - generic [ref=e246]: NurseNest provides educational content for exam preparation and is not affiliated with NCLEX, regulatory colleges, or licensing bodies.
```

# Test source

```ts
  15  | 
  16  | const baseURL = getE2eBaseURL();
  17  | 
  18  | async function gotoOk(page: Page, path: string) {
  19  |   const r = await page.goto(path, { waitUntil: "domcontentloaded" });
  20  |   expect(r?.ok(), `HTTP ${r?.status()} for ${path}`).toBeTruthy();
  21  |   await expect(page.locator("body")).toBeVisible();
  22  | }
  23  | 
  24  | /** Full-screen scrims (e.g. exam/onboarding overlays) sit above the header and block nav clicks. */
  25  | async function dismissMarketingScrims(page: Page) {
  26  |   for (let i = 0; i < 5; i++) {
  27  |     await page.keyboard.press("Escape");
  28  |   }
  29  | }
  30  | 
  31  | test.describe("Public site smoke", () => {
  32  |   test("homepage loads", async ({ page }, testInfo) => {
  33  |     const o = attachPageObservers(page);
  34  |     await gotoOk(page, "/");
  35  |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  36  |     await expect(page.getByRole("link", { name: /NurseNest home/i })).toBeVisible();
  37  |     const d = await logObserverDiagnostics(o, testInfo.title);
  38  |     o.dispose();
  39  |     expect(d.consoleErrors, "unexpected console errors").toEqual([]);
  40  |     expect(d.failedRequests, "unexpected network failures").toEqual([]);
  41  |   });
  42  | 
  43  |   test("top navigation — Pricing reachable from header", async ({ page }, testInfo) => {
  44  |     const o = attachPageObservers(page);
  45  |     await gotoOk(page, "/");
  46  |     await dismissMarketingScrims(page);
  47  |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  48  |     // Marketing browse nav is the one that includes the global `/pricing` href (not pathway …/nclex-rn/pricing).
  49  |     const marketingNav = page.getByRole("navigation", {
  50  |       name: /who we help|marketing|explore/i,
  51  |     });
  52  |     const pricing = marketingNav.getByRole("link", { name: /^Pricing$/i }).first();
  53  |     await expect(pricing).toBeVisible({ timeout: 30_000 });
  54  |     await pricing.scrollIntoViewIfNeeded();
  55  |     // Full-page scrims (onboarding) can sit above the header and block real pointer events; DOM click still follows the link.
  56  |     await pricing.evaluate((el: HTMLElement) => (el as HTMLAnchorElement).click());
  57  |     await expect(page).toHaveURL(/\/pricing\/?(\?|$)/, { timeout: 60_000 });
  58  |     await page.waitForLoadState("domcontentloaded");
  59  |     expect(page.url()).toMatch(/\/pricing/);
  60  |     await expect(page.locator("main, [role='main']").first()).toBeVisible();
  61  |     const d = await logObserverDiagnostics(o, testInfo.title);
  62  |     o.dispose();
  63  |     expect(d.consoleErrors).toEqual([]);
  64  |     expect(d.failedRequests).toEqual([]);
  65  |   });
  66  | 
  67  |   test("country selector — opens listbox and shows options (desktop)", async ({ page }, testInfo) => {
  68  |     await page.context().addCookies([{ name: GLOBAL_REGION_COOKIE, value: "us", url: baseURL }]);
  69  |     const o = attachPageObservers(page);
  70  |     await gotoOk(page, "/");
  71  |     await dismissMarketingScrims(page);
  72  |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  73  |     const regionBtn = page
  74  |       .locator(HEADER_CHROME)
  75  |       .getByRole("button", { name: /Country: United States|Region: United States/i })
  76  |       .first();
  77  |     await expect(regionBtn).toBeVisible({ timeout: 30_000 });
  78  |     await regionBtn.click({ force: true });
  79  |     await page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`).waitFor({
  80  |       state: "visible",
  81  |       timeout: 30_000,
  82  |     });
  83  |     await expect(page.getByRole("option", { name: /Canada/i }).first()).toBeVisible();
  84  |     const d = await logObserverDiagnostics(o, testInfo.title);
  85  |     o.dispose();
  86  |     expect(d.consoleErrors).toEqual([]);
  87  |     expect(d.failedRequests).toEqual([]);
  88  |   });
  89  | 
  90  |   test("language selector — switch locale without 404", async ({ page }, testInfo) => {
  91  |     const o = attachPageObservers(page);
  92  |     await gotoOk(page, "/");
  93  |     await dismissMarketingScrims(page);
  94  |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  95  |     const langBtn = page.locator(HEADER_CHROME).getByRole("button", { name: /language/i }).first();
  96  |     await langBtn.click({ force: true });
  97  |     await page.getByRole("button", { name: /Français|French/i }).first().click({ force: true });
  98  |     await page.waitForLoadState("domcontentloaded");
  99  |     expect(page.url()).not.toMatch(/\/404/);
  100 |     const r = await page.goto(page.url(), { waitUntil: "domcontentloaded" });
  101 |     expect(r?.ok()).toBeTruthy();
  102 |     await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({ timeout: 60_000 });
  103 |     const d = await logObserverDiagnostics(o, testInfo.title);
  104 |     o.dispose();
  105 |     expect(d.consoleErrors).toEqual([]);
  106 |     expect(d.failedRequests).toEqual([]);
  107 |   });
  108 | 
  109 |   test("login page loads", async ({ page }, testInfo) => {
  110 |     const o = attachPageObservers(page);
  111 |     await gotoOk(page, "/login");
  112 |     await expect(page.getByRole("heading", { name: /welcome|log in|sign in/i })).toBeVisible({ timeout: 30_000 });
  113 |     const d = await logObserverDiagnostics(o, testInfo.title);
  114 |     o.dispose();
> 115 |     expect(d.consoleErrors).toEqual([]);
      |                             ^ Error: expect(received).toEqual(expected) // deep equality
  116 |     expect(d.failedRequests).toEqual([]);
  117 |   });
  118 | 
  119 |   test("signup page loads", async ({ page }, testInfo) => {
  120 |     const o = attachPageObservers(page);
  121 |     await gotoOk(page, "/signup");
  122 |     await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });
  123 |     const d = await logObserverDiagnostics(o, testInfo.title);
  124 |     o.dispose();
  125 |     expect(d.consoleErrors).toEqual([]);
  126 |     expect(d.failedRequests).toEqual([]);
  127 |   });
  128 | 
  129 |   test("pricing page loads", async ({ page }, testInfo) => {
  130 |     const o = attachPageObservers(page);
  131 |     await gotoOk(page, "/pricing");
  132 |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  133 |     const d = await logObserverDiagnostics(o, testInfo.title);
  134 |     o.dispose();
  135 |     expect(d.consoleErrors).toEqual([]);
  136 |     expect(d.failedRequests).toEqual([]);
  137 |   });
  138 | 
  139 |   test("US RN lesson hub loads", async ({ page }, testInfo) => {
  140 |     const cfg = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "us-rn-nclex-rn");
  141 |     expect(cfg).toBeTruthy();
  142 |     const o = attachPageObservers(page);
  143 |     await gotoOk(page, cfg!.hubPath);
  144 |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  145 |     const d = await logObserverDiagnostics(o, testInfo.title);
  146 |     o.dispose();
  147 |     expect(d.consoleErrors).toEqual([]);
  148 |     expect(d.failedRequests).toEqual([]);
  149 |   });
  150 | 
  151 |   test("Canada RN lesson hub loads", async ({ page }, testInfo) => {
  152 |     const cfg = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "ca-rn-nclex-rn");
  153 |     expect(cfg).toBeTruthy();
  154 |     const o = attachPageObservers(page);
  155 |     await gotoOk(page, cfg!.hubPath);
  156 |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  157 |     const d = await logObserverDiagnostics(o, testInfo.title);
  158 |     o.dispose();
  159 |     expect(d.consoleErrors).toEqual([]);
  160 |     expect(d.failedRequests).toEqual([]);
  161 |   });
  162 | 
  163 |   test("US RN lessons index loads", async ({ page }, testInfo) => {
  164 |     const cfg = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "us-rn-nclex-rn");
  165 |     expect(cfg).toBeTruthy();
  166 |     const o = attachPageObservers(page);
  167 |     await gotoOk(page, cfg!.lessonsPath);
  168 |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  169 |     const d = await logObserverDiagnostics(o, testInfo.title);
  170 |     o.dispose();
  171 |     expect(d.consoleErrors).toEqual([]);
  172 |     expect(d.failedRequests).toEqual([]);
  173 |   });
  174 | 
  175 |   test("US RN — first primary lesson detail loads", async ({ page }, testInfo) => {
  176 |     const cfg = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "us-rn-nclex-rn");
  177 |     expect(cfg).toBeTruthy();
  178 |     const o = attachPageObservers(page);
  179 |     await gotoOk(page, cfg!.lessonsPath);
  180 |     await dismissMarketingScrims(page);
  181 |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  182 |     const primary = page.locator('[data-nn-qa-primary-lesson="true"]').first();
  183 |     const hasPrimary = await primary.isVisible({ timeout: 45_000 }).catch(() => false);
  184 |     if (!hasPrimary) {
  185 |       test.skip(true, "No primary lesson chip (lessons DB empty or list not hydrated in this env)");
  186 |       return;
  187 |     }
  188 |     await expect(primary).toBeVisible({ timeout: 30_000 });
  189 |     await primary.click();
  190 |     await page.waitForLoadState("domcontentloaded");
  191 |     expect(page.url()).toContain("/lessons/");
  192 |     await expect(page.locator(`header[data-nn-pathway-id="${cfg!.pathwayId}"]`)).toBeVisible({ timeout: 60_000 });
  193 |     const d = await logObserverDiagnostics(o, testInfo.title);
  194 |     o.dispose();
  195 |     expect(d.consoleErrors).toEqual([]);
  196 |     expect(d.failedRequests).toEqual([]);
  197 |   });
  198 | 
  199 |   test("blog index loads", async ({ page }, testInfo) => {
  200 |     const o = attachPageObservers(page);
  201 |     await gotoOk(page, "/blog");
  202 |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  203 |     const d = await logObserverDiagnostics(o, testInfo.title);
  204 |     o.dispose();
  205 |     expect(d.consoleErrors).toEqual([]);
  206 |     expect(d.failedRequests).toEqual([]);
  207 |   });
  208 | 
  209 |   test("footer internal links — sample of routes return 200", async ({ page }, testInfo) => {
  210 |     const o = attachPageObservers(page);
  211 |     await gotoOk(page, "/");
  212 |     await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  213 |     const footer = page.locator("footer");
  214 |     const hrefs = await footer.locator('a[href^="/"]').evaluateAll((els) =>
  215 |       [...new Set(els.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""))].filter(
```