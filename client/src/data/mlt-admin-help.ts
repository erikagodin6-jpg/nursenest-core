export interface AdminHelpArticle {
  id: string;
  title: string;
  category: "getting-started" | "content-management" | "student-management" | "analytics" | "troubleshooting" | "account";
  summary: string;
  sections: { heading: string; content: string }[];
  relatedArticles?: string[];
}

export const mltAdminHelpArticles: AdminHelpArticle[] = [
  {
    id: "getting-started-overview",
    title: "Getting Started with the MLT Admin Dashboard",
    category: "getting-started",
    summary: "A quick overview of the admin dashboard layout, key features, and first steps for new administrators.",
    sections: [
      { heading: "Dashboard Overview", content: "The MLT Admin Dashboard is your central hub for managing exam prep content, monitoring student progress, and analyzing platform performance. The main navigation includes: Content Library (lessons, flashcards, question banks), Student Management (enrollment, progress tracking), Analytics (usage metrics, score trends), and Settings (account, notifications, integrations)." },
      { heading: "First Steps", content: "1. Review the Content Library to familiarize yourself with existing lessons, flashcards, and question banks. 2. Check the Student Management section to see enrolled students and their current progress. 3. Explore the Analytics dashboard to understand usage patterns. 4. Configure your notification preferences in Settings to receive alerts for student milestones and content updates." },
      { heading: "Key Features", content: "Content authoring tools for creating and editing lessons, flashcards, and exam questions. Student progress tracking with discipline-level score breakdowns. Automated study plan generation based on student diagnostic results. Bulk import/export for content management. Real-time analytics with exportable reports." },
    ],
    relatedArticles: ["managing-lesson-content", "student-progress-tracking"],
  },
  {
    id: "managing-lesson-content",
    title: "Managing Lesson Content",
    category: "content-management",
    summary: "How to create, edit, publish, and organize lesson content across all MLT disciplines.",
    sections: [
      { heading: "Creating a New Lesson", content: "Navigate to Content Library > Lessons > Create New. Each lesson requires: a title, discipline assignment, lesson content (supports rich text with images), clinical pearls, quiz questions (minimum 5 per lesson with rationales), and medication references where applicable. Save as draft to preview before publishing." },
      { heading: "Editing Existing Lessons", content: "Click any lesson in the Content Library to open the editor. Changes are saved as drafts until you click Publish. Use the version history feature to compare changes and revert if needed. All edits are logged with timestamps and editor identity for audit purposes." },
      { heading: "Organizing by Discipline", content: "Lessons are organized by the MLT discipline taxonomy: Clinical Chemistry, Hematology, Microbiology, Immunohematology (Blood Banking), Urinalysis & Body Fluids, Immunology/Serology, Molecular Diagnostics, Histotechnology, Parasitology & Mycology, Laboratory Operations & QC, and Specimen Collection & Safety. Each lesson must be assigned to exactly one primary discipline." },
      { heading: "Quiz Question Guidelines", content: "Each quiz question should follow best practices: single-best-answer format, clear and unambiguous stem, four plausible options, detailed rationale explaining why the correct answer is right AND why each distractor is wrong. Aim for a mix of recall (30%), application (50%), and analysis (20%) level questions." },
    ],
    relatedArticles: ["getting-started-overview", "managing-flashcard-decks"],
  },
  {
    id: "managing-flashcard-decks",
    title: "Managing Flashcard Decks",
    category: "content-management",
    summary: "How to create and manage flashcard decks, add cards, and organize content by discipline.",
    sections: [
      { heading: "Creating a Flashcard Deck", content: "Navigate to Content Library > Flashcards > Create Deck. Provide a deck name, description, and discipline assignment. Each deck should focus on a single discipline or topic area. Decks can contain any number of cards, but 15-25 cards per deck is optimal for study sessions." },
      { heading: "Adding Cards", content: "Each flashcard has: a front (question/prompt), back (answer/explanation), optional hint, difficulty level (1-3), card type (definition, concept, comparison, formula, normal-range, image-recognition, clinical-scenario), and country track (canada, usa, or both). Write concise fronts and comprehensive backs with clinical context." },
      { heading: "Card Type Guidelines", content: "Definition cards test terminology knowledge. Concept cards assess understanding of principles. Comparison cards present two related items for differentiation. Formula cards test calculations and equations. Normal-range cards assess reference range knowledge. Image-recognition cards describe visual findings. Clinical-scenario cards present patient cases requiring interpretation." },
      { heading: "Quality Standards", content: "Review all cards for accuracy before publishing. Ensure answers are current with the latest clinical guidelines. Include relevant SI and conventional units where applicable. Flag cards that may need updating when guidelines change. Aim for a balanced difficulty distribution within each deck." },
    ],
    relatedArticles: ["managing-lesson-content", "managing-question-banks"],
  },
  {
    id: "managing-question-banks",
    title: "Managing Question Banks",
    category: "content-management",
    summary: "How to create exam questions, organize them by discipline, and maintain question quality.",
    sections: [
      { heading: "Question Format", content: "All questions follow the single-best-answer multiple-choice format with four options (A-D). Each question requires: a stem (clinical scenario or direct question), four answer options, one correct answer, a detailed rationale, discipline assignment, difficulty level, and cognitive level (recall, application, or analysis)." },
      { heading: "Writing Effective Questions", content: "Stems should present a clear clinical scenario or direct question. Avoid negative phrasing ('Which is NOT...') unless testing safety-critical knowledge. All distractors should be plausible — obviously wrong options don't test knowledge effectively. Rationales should explain why the correct answer is right AND address each distractor individually." },
      { heading: "Question Review Process", content: "New questions go through a review workflow: Draft → Peer Review → Published. Peer reviewers check for: accuracy, clarity, appropriate difficulty, effective distractors, and comprehensive rationale. Questions with psychometric issues (too easy, too hard, ambiguous, or poor discrimination) should be revised or retired." },
      { heading: "Item Analysis", content: "After students complete questions, review item analysis data: difficulty index (proportion answering correctly — aim for 0.3-0.7), discrimination index (correlation between item score and total score — aim for >0.2), and distractor analysis (each distractor should be selected by some students). Revise or retire questions with poor psychometric performance." },
    ],
    relatedArticles: ["managing-lesson-content", "analytics-score-reports"],
  },
  {
    id: "student-progress-tracking",
    title: "Student Progress Tracking",
    category: "student-management",
    summary: "How to monitor individual and cohort student progress across all MLT disciplines.",
    sections: [
      { heading: "Individual Student View", content: "Click any student name in Student Management to see their complete profile: overall readiness score, discipline-by-discipline performance, study activity timeline, completed lessons and quizzes, flashcard progress, and practice exam history. Identify students who may need additional support based on low scores or inactivity." },
      { heading: "Cohort Analytics", content: "The Cohort View shows aggregate performance data: average scores by discipline, score distribution histograms, study hours per week, lesson completion rates, and exam readiness trends over time. Use this to identify class-wide knowledge gaps that may benefit from targeted instruction." },
      { heading: "Readiness Indicators", content: "The platform calculates an exam readiness score based on: practice exam scores (weighted most heavily), question bank performance by discipline, lesson completion, flashcard mastery rate, and study consistency. Green (≥75%): likely ready. Yellow (60-74%): more preparation recommended. Red (<60%): significant gaps remain." },
      { heading: "Intervention Triggers", content: "Set up automatic alerts for: students scoring below threshold on practice exams, students inactive for more than 7 days, students consistently struggling in specific disciplines, and students approaching their exam date with low readiness scores. Early intervention significantly improves pass rates." },
    ],
    relatedArticles: ["getting-started-overview", "analytics-score-reports"],
  },
  {
    id: "analytics-score-reports",
    title: "Analytics and Score Reports",
    category: "analytics",
    summary: "Understanding analytics dashboards, generating reports, and using data to improve outcomes.",
    sections: [
      { heading: "Dashboard Metrics", content: "The Analytics dashboard displays: total active students, average exam readiness score, pass rate prediction, most-studied disciplines, least-studied disciplines, daily active users, question completion rates, and trending score changes. All metrics can be filtered by date range, cohort, and discipline." },
      { heading: "Score Reports", content: "Generate detailed score reports at individual or cohort level. Reports include: overall score with confidence interval, discipline-level scores with comparison to benchmarks, performance trend over time, question-level analysis (strongest and weakest question types), and personalized recommendations for improvement." },
      { heading: "Content Effectiveness", content: "Track which lessons, flashcard decks, and question sets correlate with the highest score improvements. Use this data to: prioritize high-impact content for updates, identify content gaps where students consistently struggle, and measure the ROI of new content additions." },
      { heading: "Exporting Data", content: "All analytics data can be exported as CSV or PDF reports. Scheduled reports can be configured to automatically generate and email weekly or monthly summaries to administrators. Export formats are compatible with common spreadsheet and data visualization tools." },
    ],
    relatedArticles: ["student-progress-tracking", "troubleshooting-common-issues"],
  },
  {
    id: "troubleshooting-common-issues",
    title: "Troubleshooting Common Issues",
    category: "troubleshooting",
    summary: "Solutions for common issues administrators and students may encounter on the platform.",
    sections: [
      { heading: "Student Cannot Access Content", content: "Verify the student's enrollment status is active. Check that the content is published (not in draft status). Ensure the student's subscription or access period has not expired. Clear the browser cache and try again. If the issue persists, check for any platform-wide access restrictions in Settings." },
      { heading: "Quiz Scores Not Recording", content: "Ensure the student completed and submitted the quiz (not just viewed it). Check for browser connectivity issues during the quiz session. Verify that the quiz is properly linked to the lesson. If scores are missing, the student can retake the quiz — the highest score is retained." },
      { heading: "Content Not Displaying Correctly", content: "Check that the content was saved and published (not left in draft). Verify that rich text formatting is valid — malformed HTML can cause display issues. Test the content in multiple browsers. For image issues, verify that image URLs are accessible and properly formatted." },
      { heading: "Performance or Loading Issues", content: "Large question banks may take longer to load — this is normal. If the platform is consistently slow, check your internet connection. Clear browser cache and cookies. Disable browser extensions that may interfere. Contact support if issues persist across multiple browsers and devices." },
    ],
    relatedArticles: ["getting-started-overview", "account-settings"],
  },
  {
    id: "account-settings",
    title: "Account Settings and Preferences",
    category: "account",
    summary: "How to manage your admin account settings, notifications, and platform preferences.",
    sections: [
      { heading: "Profile Settings", content: "Update your name, email, and password in Settings > Profile. Enable two-factor authentication for additional security. Set your timezone to ensure accurate timestamps on content and analytics. Upload a profile photo that will be visible to students on authored content." },
      { heading: "Notification Preferences", content: "Configure notifications for: new student enrollments, student milestone achievements, content review requests, PT/QC alert thresholds, and weekly analytics summaries. Notifications can be delivered via email, in-app alerts, or both. Adjust frequency to avoid notification fatigue." },
      { heading: "Content Authoring Preferences", content: "Set default values for new content: preferred discipline, default difficulty level, auto-save interval, and rich text editor preferences. These defaults save time when creating multiple pieces of content in the same discipline or difficulty range." },
      { heading: "Data and Privacy", content: "Student data is handled in compliance with applicable privacy regulations. Administrators can view aggregate analytics but personally identifiable student data is accessible only to authorized users. Data retention policies and export options are configurable in Settings > Data Management." },
    ],
    relatedArticles: ["getting-started-overview", "troubleshooting-common-issues"],
  },
];
