# Navigation Unification Verification

Generated: 2026-05-31T12:22:18.764Z

Note: Local verification used signed Playwright JWT sessions. Current local .env.local database points at placeholder host, so entitlement warning banners are environment noise and excluded from nav verdicts.

## Desktop Routes
- PASS Homepage (/ -> /)
- PASS App Dashboard (/app -> /app)
- PASS Lessons (/app/lessons -> /app/lessons)
- PASS Flashcards (/app/flashcards -> /app/flashcards)
- PASS Question Bank (/app/question-bank -> /app/questions)
- FAIL Readiness (/app/readiness -> /app/account/readiness): headerCount=0, headerLayout=null
- PASS Profile (/app/profile -> /app/profile)
- PASS Clinical Skills (/app/clinical-skills -> /app/clinical-skills)
- FAIL ECG (/app/ecg -> /app/ecg-video-quiz): headerCount=0, headerLayout=null
- PASS Labs (/app/labs -> /app/labs)
- PASS Medication Math (/app/medication-math -> /app/med-calculations)

## Mobile Routes
- PASS Homepage (/ -> /)
- PASS App Dashboard (/app -> /app)
- PASS Lessons (/app/lessons -> /app/lessons)
- PASS Flashcards (/app/flashcards -> /app/flashcards)
- PASS Question Bank (/app/question-bank -> /app/questions)
- FAIL Readiness (/app/readiness -> /app/account/readiness): headerCount=0, headerLayout=null
- FAIL Profile (/app/profile -> /app/account): headerCount=0, headerLayout=null
- PASS Clinical Skills (/app/clinical-skills -> /app/clinical-skills)
- PASS ECG (/app/ecg -> /app/ecg-video-quiz)
- PASS Labs (/app/labs -> /app/labs)
- FAIL Medication Math (/app/medication-math -> /app/med-calculations): headerCount=0, headerLayout=null

## Admin View-As States
- PASS View As RN Free User
- PASS View As RN Subscriber
- PASS View As RPN Subscriber
- PASS View As NP Subscriber
- PASS View As Allied Subscriber
- PASS View As Guest Visitor

## Focused Session Exceptions
- PASS Practice Exam Session (/app/practice-tests/nav-verification-session -> /app/practice-tests/nav-verification-session)
- PASS Flashcard Study Session (/app/flashcards/nav-verification-deck -> /app/flashcards/nav-verification-deck)
- REVIEW CAT Entry Route (/app/cat -> /app/practice-tests): manual-review-entry-route-not-active-session
- REVIEW Simulation Entry Route (/app/osce/nav-verification-station -> /app/osce/nav-verification-station): manual-review-entry-route-not-active-session