# Navigation Unification Verification

Generated: 2026-05-31T12:14:33.171Z

## Desktop Routes
- PASS Homepage (/ -> /)
- FAIL App Dashboard (/app -> /app): themeControls=2
- FAIL Lessons (/app/lessons -> /app/lessons): themeControls=2
- FAIL Flashcards (/app/flashcards -> /app/flashcards): themeControls=2
- PASS Question Bank (/app/question-bank -> /app/questions)
- FAIL Readiness (/app/readiness -> /app/account/readiness): headerCount=0, headerLayout=null
- FAIL Profile (/app/profile -> /app/account): headerCount=0, headerLayout=null
- FAIL Clinical Skills (/app/clinical-skills -> /app/clinical-skills): themeControls=2
- PASS ECG (/app/ecg -> /app/ecg-video-quiz)
- FAIL Labs (/app/labs -> /app/labs): themeControls=2
- PASS Medication Math (/app/medication-math -> /app/med-calculations)

## Mobile Routes
- PASS Homepage (/)
- PASS App Dashboard (/app)
- PASS Lessons (/app/lessons)
- PASS Flashcards (/app/flashcards)
- FAIL Question Bank (/app/question-bank): headerCount=0, headerLayout=null
- FAIL Readiness (/app/readiness): headerCount=0, headerLayout=null
- FAIL Profile (/app/profile): headerCount=0, headerLayout=null
- PASS Clinical Skills (/app/clinical-skills)
- PASS ECG (/app/ecg)
- PASS Labs (/app/labs)
- PASS Medication Math (/app/medication-math)

## Admin View-As States
- FAIL View As RN Free User: themeControls=2
- FAIL View As RN Subscriber: themeControls=2
- FAIL View As RPN Subscriber: themeControls=2
- FAIL View As NP Subscriber: themeControls=2
- FAIL View As Allied Subscriber: themeControls=2
- PASS View As Guest Visitor

## Focused Session Exceptions
- FAIL CAT Session (/app/cat -> /app/practice-tests): homepageHeaderPresent=1, noFocusedChromeMarker
- PASS Practice Exam Session (/app/practice-tests/nav-verification-session -> /app/practice-tests/nav-verification-session)
- PASS Flashcard Study Session (/app/flashcards/nav-verification-deck -> /app/flashcards/nav-verification-deck)
- FAIL Simulation Session (/app/osce/nav-verification-station -> /app/osce/nav-verification-station): homepageHeaderPresent=1, noFocusedChromeMarker