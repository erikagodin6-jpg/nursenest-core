# Student product — legacy parity audit

**Legacy reference:** Monolith `client/src/pages/dashboard.tsx` (widget grid: `quick_links`, `topic_mastery`, `exam_readiness`, `bookmarks_preview`, QOTD, AI coach, etc.) and `/api/dashboard/summary`.  
**Current core:** Server loaders (`loadPremiumDashboardSnapshot`, `buildLearnerStudySnapshot`, `loadReportCardData`, `loadReadinessPagePayload`, exam/question Prisma models). There is no Core `dashboard/summary` API.

Classification key: **1** = exists, needs visual restoration · **2** = partial, complete · **3** = data likely exists, UI thin/missing · **4** = not in model/API, future work.

---

## CAT exams / adaptive practice

| Item | Class | Notes |
|------|-------|--------|
| Prominent entry to CAT / topic-adaptive flows | **2 → addressed** | `PracticeTestsHubClient` + pathways; **restored** `LearnerStudyQuickLinksCard` on dashboard, practice-tests, exams, questions, lessons, readiness, report-card. |
| Full exam presets (mixed, RN/PN full) | **2** | `/app/exams` presets + history; hero + semantic callouts added. |
| “No default exam” fallback | **1 → addressed** | Replaced raw amber utilities with **semantic warning** tokens. |
| Monolith-only CAT simulation flags | **4** | Verify `isCatExamSimulationFeatureEnabled()` vs legacy; no duplicate runtime. |

---

## Test banks / practice questions

| Item | Class | Notes |
|------|-------|--------|
| Question bank with pathway + exam shell | **2** | `QuestionBankPracticeClient`; **quick links** + hero + info aside use semantic tokens. |
| Integrated loop copy (bank ↔ exams) | **1** | Existing “how to” aside; styling aligned to semantic info-soft. |

---

## Lessons

| Item | Class | Notes |
|------|-------|--------|
| Paginated `/app/lessons` list | **2** | Pathway + legacy map; **quick links** card under hero for cross-navigation. |
| Marketing lesson SEO | Out of scope | Separate routes under `(marketing)`. |

---

## Learner reports

| Item | Class | Notes |
|------|-------|--------|
| Report card | **2** | `LearnerReportCardPremium` + **quick links** + `nn-learner-page-hero`. |
| Readiness / passing probability | **2** | `LearnerReadinessPremium` + **quick links** + hero bands on all states touched. |
| Legacy “single summary” dashboard API | **4** | Would require new endpoint or unified loader contract — not introduced here. |

---

## Dashboard / profile / account

| Item | Class | Notes |
|------|-------|--------|
| Command-center style quick links | **1 → addressed** | `LearnerStudyQuickLinksCard` on subscriber `/app` dashboard. |
| Profile → account overview | **2** | `/app/profile` redirects to `/app/account/overview` (canonical). |
| Configurable widget order / drag grid | **4** | Different architecture than monolith. |
| QOTD / AI coach / bookmarks preview widgets | **3–4** | Need dedicated content or APIs in Core before full parity. |

---

## Implemented in this pass (architecture-safe)

- New server component: `src/components/student/learner-study-quick-links-card.tsx` (existing `t()` keys only).
- `nn-learner-page-hero` + semantic text tokens on: practice-tests, questions, report-card, readiness (multiple branches), exams (subscriber body), lessons (spacing).
- Semantic **info** callouts (questions how-to, exams report-card teaser); semantic **warning** for default-exam missing state (exams).
