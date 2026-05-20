# Study system coverage map (admin)

Maps learner-facing study systems to **where admins observe them** after the observability hub work.

| System | Primary learner touch | Admin visibility |
| --- | --- | --- |
| Question bank / exams | Practice, attempts | Hub: 7d exam attempts & sessions; `/admin/questions`, `/admin/analytics/study-performance` |
| CAT / NCLEX-style adaptive | Sessions with `adaptive_state` | Hub: “CAT / adaptive sessions” (7d count); diagnostics CAT blueprint; `/admin/diagnostics/cat-blueprint-sessions` |
| Flashcards | Deck study | Hub: flashcard sessions (7d), pool health counts; `/api/admin/flashcards/summary`, `/admin/study-cards` |
| Practice tests | Completed tests | Hub: practice tests completed (7d); `/admin/analytics/study-performance` |
| ECG video questions | Practice attempts | Hub: ECG practice attempts (7d); `/admin/modules/ecg` |
| Lab values mastery | Admin preview modules | Hub: lab module count + link; `/admin/modules/lab-values` |
| Allied health hubs | Pathway + profession | Hub: published lessons with `alliedProfessionKey`; `/admin/modules/allied`, `/admin/pathway-lessons` |
| Pathway lessons (marketing) | Lesson pages | Hub: pathway SEO weak count + readiness sample; `/admin/pathway-lessons`, `/admin/content-coverage` |
| Premium / paywall | Entitlements | Hub links: `/admin/premium-protection`, `/admin/product-availability` |

## Metric definitions (7d windows)

- **Exam attempts**: `ExamAttempt.createdAt` in window, non-demo users.
- **Exam sessions**: `ExamSession.updatedAt` in window.
- **CAT-like**: sessions in window with non-null `adaptive_state`, non-demo users (same predicate as command center).
- **Flashcard sessions**: `FlashcardStudySession.updatedAt` (deck queue activity).
- **Practice tests completed**: `PracticeTest` completed + `completedAt` in window.
- **ECG attempts**: `EcgVideoQuestionPracticeAnswerAttempt.createdAt` in window.

## When numbers look “off”

- **Flashcard sessions** track deck queue rows, not every card swipe (see flashcard analytics for deeper cuts).
- **Adaptive sessions** are a proxy for CAT-like flows; blueprint diagnostics remain the source for blueprint-specific QA.

