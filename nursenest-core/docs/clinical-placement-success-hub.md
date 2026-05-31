# Clinical Placement Success Hub

## Purpose

The Clinical Placement Success Hub is the NurseNest placement-management and clinical-success ecosystem for healthcare
students. It supports learners before, during, and after placement while preserving the larger NurseNest learning system.

Supported professions:

- RN
- RPN/LPN
- NP
- Respiratory Therapy
- Paramedicine
- Occupational Therapy
- Physiotherapy
- Medical Laboratory Technology
- PSW
- Social Work
- Psychotherapy

## Core Capabilities

### Placement Dashboard

Each learner has a placement profile with profession, program, academic year, placement setting, specialty, dates,
preceptor, instructor, required hours, goals, and evaluation status.

The dashboard calculates:

- Hours completed
- Hours remaining
- Weekly hours
- Program progress
- Competencies completed
- Competencies outstanding
- Competency progress
- Evaluation status

### Clinical Hour Tracker

Students log date, hours, unit, patient population, skills performed, competencies addressed, and preceptor notes.

### Competency Tracker

Every profession has a specific competency framework. Status levels:

- Observed
- Assisted
- Performed
- Performed Independently
- Mastered

### Clinical Skills Passport

Badge foundations include:

- Assessment Foundations
- Medication Safety
- Airway Management
- Wound Care
- Patient Education
- Clinical Communication
- Professional Practice
- Emergency Response

### Placement Preparation Center

Generates:

- Unit orientation guide
- Common diagnoses
- Common medications
- Common equipment
- Expected skills
- Instructor expectations
- FAQs
- Professional conduct expectations

### Shift Prep Tools

Generates:

- Patient preparation sheets
- Clinical worksheets
- Brain sheets
- Instructor question banks
- Medication review sheets
- Pathophysiology review sheets
- Lab interpretation review sheets

### Reflection System

Structured prompts:

- What happened?
- What went well?
- What challenged me?
- What knowledge gaps were identified?
- How will I improve?
- What evidence supports my learning?

### Evaluation Prep

Generates strength summaries, competency summaries, achievement examples, growth examples, development goals, and areas
requiring improvement.

### Professional Portfolio

Generates clinical accomplishments, competencies achieved, placement summaries, professional reflections, leadership
examples, and quality improvement experiences.

### Resume And Interview Integration

Converts placement experiences into resume bullet points, STAR examples, and professional summaries.

### AI Clinical Coach

Uses placement progress, feedback, reflections, and competency evidence to coach professional growth, time management,
communication, clinical reasoning, and confidence building.

### Instructor Resource Center

Institution-tier foundations include competency review, progress dashboards, student analytics, evaluation summaries,
placement tracking, and cohort competency reporting.

## Monetization

Free tier:

- Basic hour tracking
- Basic reflections

Paid tier:

- Competency tracking
- Clinical skills passport
- Portfolio generation
- Evaluation preparation
- AI clinical coaching
- Professional development reports
- Resume and interview integration

Institution tier:

- Instructor dashboards
- Program analytics
- Competency reporting
- Placement tracking
- Evaluation summaries
- Cohort progress dashboards

## Mobile Standard

Students must be able to log hours, record reflections, track competencies, upload notes, and review goals from a mobile
device during or after shifts.

## Implementation

Executable foundation:

- `src/lib/placement/clinical-placement-success-hub.ts`
- `src/lib/placement/clinical-placement-success-hub.test.ts`

This is a platform foundation, not a disconnected mini-app. Future UI should use the canonical NurseNest learner shell,
theme tokens, and the required Figma-first visual process before implementation.
