# Healthcare authority cluster execution plan

This plan turns the existing healthcare exam authority registry into an execution sequence for traffic, CTR, and subscriber conversion.

## Current protected foundation

The source-of-truth registry is `src/lib/seo/healthcare-exam-authority-architecture.ts`.

The existing contract test already protects:

- NCLEX-RN, REx-PN, CNPLE, NP, and Allied authority families
- SEO title and description bounds
- FAQPage, EducationalCourse, BreadcrumbList, Article, and ItemList schema expectations
- internal CTAs on every pillar
- live URL route-pattern resolution
- planned aliases staying out of the live indexable URL set
- phase 1 test-bank URLs remaining live only on canonical routes

## Execution priority

### 1. ECG practice cluster

Status: live foundation exists.

Primary path:

- `/ecg/ecg-practice-questions`

Required links:

- `/advanced-ecg-nursing`
- `/ecg/ecg-practice-questions`
- `/allied/paramedic`
- RN lesson and question surfaces where ECG content exists
- NP/CNPLE diagnostic reasoning surfaces where ECG interpretation is relevant

Why first:

- Search Console is already showing impressions for PAC/PVC and ECG rhythm queries.
- ECG terms have strong clinical intent and naturally convert into paid practice questions, lessons, and advanced ECG add-on.
- This cluster supports RN, NP, paramedic, and telemetry audiences without weakening paid products.

### 2. COPD and respiratory questions cluster

Status: planned.

Recommended live path:

- `/respiratory/copd-practice-questions`

Required links:

- `/us/rn/nclex-rn/questions`
- `/canada/rpn/rex-pn/questions`
- `/allied/respiratory`
- oxygen therapy lessons
- ABG interpretation lessons

Why second:

- Respiratory Therapy is already an Allied priority.
- COPD, oxygen therapy, ABGs, and ventilation are high-yield across RN, RPN, paramedic, and RT.
- This can become a strong bridge between nursing traffic and Allied Health traffic.

### 3. Dosage calculation practice cluster

Status: planned.

Recommended live path:

- `/dosage-calculations/practice-questions`

Required links:

- `/tools/dosage-calculator`
- `/us/rn/nclex-rn/questions`
- `/canada/rpn/rex-pn/questions`
- pharmacology lessons
- med math flashcards

Why third:

- Evergreen high-intent topic.
- Strong fit for free tool traffic plus paid question-bank conversion.
- Easy internal-linking target from pharmacology, fundamentals, and safety lessons.

### 4. NP case studies and diagnostics cluster

Status: planned.

Recommended live path:

- `/np-case-studies/diagnostics-prescribing`

Required links:

- `/canada/np/cnple/case-based-questions`
- `/canada/np/cnple/questions`
- `/canada/np/cnple/simulation`
- `/np-exam-prep`

Why fourth:

- Supports CNPLE LOFT positioning.
- Reinforces Canadian NP clinical reasoning rather than generic question-bank copy.
- Converts naturally into simulation and paid CNPLE prep.

### 5. Prioritization, delegation, and SATA cluster

Status: planned.

Recommended live path:

- `/nclex/prioritization-delegation-sata-questions`

Required links:

- `/nclex-next-gen-question-types`
- `/us/rn/nclex-rn/questions`
- `/canada/rpn/rex-pn/questions`
- CAT practice pages

Why fifth:

- High NCLEX/REx-PN intent.
- Strong conversion fit for CAT and question bank.
- Should be built after ECG/COPD/dosage because those are more cross-slice and currently more strategically urgent.

## Page quality requirements

Each new cluster page should include:

- one clear H1 targeting the exact query family
- concise intro that identifies the learner and exam context
- 5 to 8 high-yield teaching sections
- 8 to 12 sample-style question prompts or scenario previews without replacing paid bank value
- links into paid questions, lessons, flashcards, and simulations where relevant
- FAQ schema
- BreadcrumbList schema
- Article schema when the page is explanatory
- ItemList schema when the page lists practice-question categories
- no claims that expose exact proprietary bank counts unless already centralized and contract-protected

## Conversion rule

Cluster pages should give enough substance to rank and build trust, but they should not reproduce the paid product. The ideal CTA pattern is:

1. free teaching value
2. sample reasoning preview
3. paid question-bank or simulation CTA
4. related lesson/flashcard CTA
5. next cluster link

## Guardrail

Do not activate a planned alias unless there is a real substantive route and the URL is added to the live route-pattern contract. Planned aliases must remain excluded from `listLiveHealthcareExamAuthorityUrls()`.
