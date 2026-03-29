export interface SocialWorkLesson {
  id: string;
  slug: string;
  title: string;
  domain: string;
  summary: string;
  objectives: string[];
  content: string;
  keyTerms: string[];
  examTips: string[];
}

export const SOCIAL_WORK_DOMAINS = [
  "Human Behavior & Development",
  "Assessment & Diagnosis",
  "Intervention & Treatment Planning",
  "Ethics & Professional Practice",
  "Community Resources",
  "Crisis Intervention",
] as const;

export const socialWorkLessons: SocialWorkLesson[] = [
  {
    id: "sw-lesson-001",
    slug: "human-behavior-development-theories",
    title: "Human Behavior & Development Theories",
    domain: "Human Behavior & Development",
    summary: "Core theories of human behavior and development including Erikson's stages, Piaget's cognitive development, attachment theory, and systems theory as applied to social work practice.",
    objectives: [
      "Identify Erikson's eight psychosocial stages and their implications for social work assessment",
      "Apply Piaget's cognitive development theory to client interactions across the lifespan",
      "Understand attachment styles and their impact on therapeutic relationships",
      "Integrate systems theory (micro, mezzo, macro) into social work practice",
    ],
    content: `## Erikson's Psychosocial Development

Erik Erikson proposed eight stages of psychosocial development, each characterized by a central conflict that individuals must resolve. Social workers frequently use this framework to assess clients' developmental challenges and strengths.

**Stage 1: Trust vs. Mistrust (Infancy)** - Consistent caregiving builds trust; neglect or abuse creates mistrust. Relevant to child welfare assessments.

**Stage 5: Identity vs. Role Confusion (Adolescence)** - Teens explore identity; social workers support this process while addressing risk behaviors.

**Stage 7: Generativity vs. Stagnation (Middle Adulthood)** - Adults seek to contribute to the next generation; stagnation may manifest as depression or purposelessness.

## Attachment Theory

John Bowlby and Mary Ainsworth developed attachment theory, identifying four attachment styles:
- **Secure attachment**: Consistent, responsive caregiving leads to healthy relationships
- **Anxious-ambivalent**: Inconsistent caregiving creates clingy, anxious behavior
- **Avoidant**: Emotionally unavailable caregiving leads to self-reliance and emotional distance
- **Disorganized**: Frightening or confusing caregiving creates contradictory behaviors

## Systems Theory in Social Work

Social workers use ecological systems theory (Bronfenbrenner) to understand clients within their environmental context:
- **Microsystem**: Immediate relationships (family, peers)
- **Mesosystem**: Interactions between microsystems (family-school relationship)
- **Exosystem**: Indirect influences (parent's workplace policies)
- **Macrosystem**: Cultural values, laws, economic conditions
- **Chronosystem**: Changes over time (historical events, life transitions)`,
    keyTerms: ["psychosocial development", "attachment theory", "systems theory", "ecological perspective", "object relations", "lifespan development"],
    examTips: [
      "ASWB exams frequently test Erikson's stages - know the conflict at each stage and its clinical implications",
      "Attachment style questions often present a case vignette and ask you to identify the attachment pattern",
      "Systems theory questions may ask you to identify which system level an intervention targets",
    ],
  },
  {
    id: "sw-lesson-002",
    slug: "family-dynamics-social-environment",
    title: "Family Dynamics & the Social Environment",
    domain: "Human Behavior & Development",
    summary: "Understanding family structures, roles, boundaries, and how the social environment shapes individual behavior and family functioning.",
    objectives: [
      "Analyze family roles and boundaries using structural family theory",
      "Identify dysfunctional family patterns including enmeshment and disengagement",
      "Assess the impact of socioeconomic factors on family functioning",
      "Apply the person-in-environment (PIE) perspective to case conceptualization",
    ],
    content: `## Structural Family Theory

Salvador Minuchin's structural family theory examines family organization through subsystems, boundaries, and hierarchies:
- **Subsystems**: Spousal, parental, sibling - each with distinct roles
- **Boundaries**: Rules defining who participates and how (clear, rigid, diffuse)
- **Enmeshment**: Overly diffuse boundaries leading to loss of individual autonomy
- **Disengagement**: Overly rigid boundaries resulting in emotional distance

## Family Life Cycle

Carter and McGoldrick identified stages of the family life cycle:
1. Leaving home (single young adults)
2. Joining of families through marriage
3. Families with young children
4. Families with adolescents
5. Launching children and moving on
6. Families in later life

Each transition presents potential stressors and requires adaptation.

## Person-in-Environment (PIE) Perspective

The PIE framework is foundational to social work, emphasizing that individual behavior cannot be understood apart from the social context:
- Social functioning problems (roles, relationships)
- Environmental problems (economic, housing, discrimination)
- Mental health conditions (DSM-5 diagnoses)
- Physical health conditions`,
    keyTerms: ["structural family theory", "enmeshment", "disengagement", "family life cycle", "person-in-environment", "genogram"],
    examTips: [
      "Know the difference between enmeshment and disengagement - exam questions often present scenarios asking you to identify which pattern is present",
      "PIE framework questions test your ability to consider environmental factors alongside individual pathology",
    ],
  },
  {
    id: "sw-lesson-003",
    slug: "biopsychosocial-assessment",
    title: "Biopsychosocial Assessment in Social Work",
    domain: "Assessment & Diagnosis",
    summary: "Comprehensive assessment methods including biopsychosocial evaluation, mental status examination, risk assessment, and culturally responsive assessment practices.",
    objectives: [
      "Conduct a thorough biopsychosocial assessment",
      "Perform a mental status examination (MSE) and document findings",
      "Assess risk factors for suicide, homicide, and self-harm",
      "Apply culturally responsive assessment techniques",
    ],
    content: `## Biopsychosocial Model

George Engel's biopsychosocial model provides a comprehensive framework for assessment:

**Biological factors**: Medical history, medications, substance use, genetics, neurological functioning, physical symptoms
**Psychological factors**: Cognitive patterns, emotional regulation, coping mechanisms, trauma history, mental health symptoms, personality traits
**Social factors**: Family relationships, social support, cultural identity, socioeconomic status, housing, employment, community involvement

## Mental Status Examination (MSE)

The MSE assesses current mental functioning across key domains:
- **Appearance**: Grooming, dress, hygiene, psychomotor activity
- **Behavior**: Cooperation, eye contact, agitation, psychomotor retardation
- **Speech**: Rate, volume, tone, coherence
- **Mood**: Client's subjective emotional state (self-reported)
- **Affect**: Observed emotional expression (flat, blunted, labile, congruent)
- **Thought process**: Linear, tangential, circumstantial, loose associations
- **Thought content**: Delusions, obsessions, suicidal/homicidal ideation
- **Perception**: Hallucinations (auditory, visual, tactile)
- **Cognition**: Orientation, memory, concentration, abstract thinking
- **Insight and judgment**: Awareness of illness, decision-making capacity

## Suicide Risk Assessment

Key risk factors include:
- Previous suicide attempts (strongest predictor)
- Access to lethal means
- Recent loss or stressor
- Social isolation
- Substance use
- Family history of suicide
- Chronic pain or terminal illness`,
    keyTerms: ["biopsychosocial assessment", "mental status examination", "risk assessment", "suicide screening", "culturally responsive assessment", "diagnostic impression"],
    examTips: [
      "MSE questions are common on ASWB exams - know the difference between mood (subjective) and affect (observed)",
      "Previous suicide attempt is consistently the strongest predictor of future suicide - this is frequently tested",
      "Assessment questions often test whether you know what information to gather before making a diagnosis",
    ],
  },
  {
    id: "sw-lesson-004",
    slug: "dsm-5-diagnostic-framework",
    title: "DSM-5 Diagnostic Framework for Social Workers",
    domain: "Assessment & Diagnosis",
    summary: "Understanding the DSM-5 diagnostic system, common clinical disorders, differential diagnosis, and the social worker's role in the diagnostic process.",
    objectives: [
      "Navigate the DSM-5 organizational structure and diagnostic criteria",
      "Differentiate between commonly confused diagnoses (e.g., MDD vs. persistent depressive disorder, PTSD vs. acute stress disorder)",
      "Understand the social worker's scope regarding diagnosis across jurisdictions",
      "Apply the dimensional approach to assessment alongside categorical diagnosis",
    ],
    content: `## DSM-5 Organization

The DSM-5 organizes disorders into chapters reflecting shared underlying features:
- Neurodevelopmental Disorders (ADHD, ASD, intellectual disability)
- Schizophrenia Spectrum and Other Psychotic Disorders
- Bipolar and Related Disorders
- Depressive Disorders (MDD, persistent depressive disorder, PMDD)
- Anxiety Disorders (GAD, social anxiety, specific phobia, panic disorder)
- Trauma- and Stressor-Related Disorders (PTSD, acute stress, adjustment disorders)
- Substance-Related and Addictive Disorders
- Personality Disorders (Clusters A, B, C)

## Key Diagnostic Distinctions

**MDD vs. Persistent Depressive Disorder**: MDD requires 5+ symptoms for 2+ weeks; PDD is milder but lasts 2+ years.
**PTSD vs. Acute Stress Disorder**: ASD occurs within 1 month of trauma and lasts 3 days to 1 month; PTSD is diagnosed after 1 month.
**Generalized Anxiety vs. Specific Phobia**: GAD involves excessive worry about multiple areas; specific phobia is focused on a particular object or situation.

## Social Worker's Role in Diagnosis

Social workers contribute to the diagnostic process through:
- Comprehensive psychosocial assessment
- Collateral information gathering
- Cultural formulation (CFI in DSM-5)
- Identifying differential diagnoses and ruling out medical conditions
- Recognizing how social determinants of health impact presentation`,
    keyTerms: ["DSM-5", "differential diagnosis", "major depressive disorder", "PTSD", "personality disorders", "cultural formulation interview"],
    examTips: [
      "ASWB exams test DSM-5 knowledge heavily - know the key diagnostic criteria for MDD, GAD, PTSD, and personality disorders",
      "Questions about PTSD vs. acute stress disorder test the time criterion distinction",
      "Be prepared for vignettes where you must identify the most likely diagnosis from presented symptoms",
    ],
  },
  {
    id: "sw-lesson-005",
    slug: "evidence-based-interventions",
    title: "Evidence-Based Interventions in Social Work",
    domain: "Intervention & Treatment Planning",
    summary: "Major therapeutic modalities used in social work practice including CBT, motivational interviewing, solution-focused therapy, and trauma-informed approaches.",
    objectives: [
      "Apply cognitive-behavioral therapy (CBT) techniques to common clinical presentations",
      "Use motivational interviewing to address ambivalence about change",
      "Implement solution-focused brief therapy (SFBT) with goal-oriented clients",
      "Integrate trauma-informed care principles across all practice settings",
    ],
    content: `## Cognitive-Behavioral Therapy (CBT)

CBT is an evidence-based approach that addresses the interconnection between thoughts, feelings, and behaviors:
- **Cognitive restructuring**: Identifying and challenging automatic negative thoughts
- **Behavioral activation**: Increasing engagement in positive activities
- **Exposure therapy**: Gradual confrontation of feared stimuli
- **Thought records**: Documenting thoughts, emotions, and evidence

CBT is effective for depression, anxiety disorders, PTSD, and substance use disorders.

## Motivational Interviewing (MI)

MI uses a collaborative, person-centered approach to strengthen motivation for change:
- **OARS skills**: Open questions, Affirmations, Reflections, Summaries
- **Stages of change**: Precontemplation, contemplation, preparation, action, maintenance
- **Developing discrepancy**: Helping clients see the gap between current behavior and stated values
- **Rolling with resistance**: Avoiding argumentation, reflecting client statements

## Solution-Focused Brief Therapy (SFBT)

SFBT emphasizes solutions rather than problems:
- **Miracle question**: "If a miracle happened overnight, what would be different?"
- **Exception questions**: "When is the problem less severe? What's different then?"
- **Scaling questions**: "On a scale of 1-10, where are you now?"
- **Compliments**: Validating client strengths and progress

## Trauma-Informed Care (TIC)

SAMHSA's six key principles:
1. Safety
2. Trustworthiness and transparency
3. Peer support
4. Collaboration and mutuality
5. Empowerment, voice, and choice
6. Cultural, historical, and gender issues`,
    keyTerms: ["CBT", "motivational interviewing", "SFBT", "trauma-informed care", "stages of change", "OARS", "cognitive restructuring"],
    examTips: [
      "ASWB exams test MI heavily - know the OARS skills and the stages of change (Prochaska & DiClemente)",
      "CBT questions often present a vignette and ask which technique is most appropriate",
      "Trauma-informed care questions test principles, not specific therapy techniques",
    ],
  },
  {
    id: "sw-lesson-006",
    slug: "treatment-planning-documentation",
    title: "Treatment Planning & Clinical Documentation",
    domain: "Intervention & Treatment Planning",
    summary: "Developing measurable treatment plans, writing clinical documentation, and using the SMART goal framework in social work practice.",
    objectives: [
      "Write measurable treatment goals using the SMART framework",
      "Develop comprehensive treatment plans with objectives and interventions",
      "Maintain clinical documentation that meets legal and ethical standards",
      "Evaluate treatment progress and modify plans based on outcomes",
    ],
    content: `## SMART Goals in Treatment Planning

Treatment goals must be:
- **Specific**: Clearly defined behavior or outcome
- **Measurable**: Quantifiable criteria for success
- **Achievable**: Realistic given the client's circumstances
- **Relevant**: Aligned with the client's priorities and presenting concerns
- **Time-bound**: Include a target completion date

Example: "Client will reduce panic attacks from 5 per week to 1 or fewer per week within 8 weeks by practicing diaphragmatic breathing and cognitive restructuring techniques."

## Treatment Plan Components

A comprehensive treatment plan includes:
1. **Identifying information**: Demographics, referral source
2. **Presenting problem**: Client's stated concern in their own words
3. **Diagnostic impression**: DSM-5 diagnosis when applicable
4. **Goals**: Long-term desired outcomes
5. **Objectives**: Short-term measurable steps toward goals
6. **Interventions**: Specific therapeutic techniques and modalities
7. **Timeline**: Expected duration and review dates
8. **Signatures**: Client consent and clinician documentation

## Clinical Documentation Standards

Effective documentation:
- Uses objective, behavioral language
- Avoids subjective judgments without supporting observations
- Records informed consent and client participation in planning
- Includes risk assessment updates
- Documents progress toward treatment objectives
- Notes any changes to the treatment plan and the rationale`,
    keyTerms: ["SMART goals", "treatment planning", "clinical documentation", "progress notes", "informed consent", "treatment review"],
    examTips: [
      "Exam questions frequently test your ability to identify well-written vs. poorly-written treatment goals",
      "Remember: goals should be in the client's words when possible and reflect their priorities",
      "Documentation questions test what should and should not be included in the clinical record",
    ],
  },
  {
    id: "sw-lesson-007",
    slug: "social-work-ethics-nasw-code",
    title: "Social Work Ethics & the NASW Code of Ethics",
    domain: "Ethics & Professional Practice",
    summary: "The NASW Code of Ethics, ethical decision-making frameworks, dual relationships, confidentiality, informed consent, and managing ethical dilemmas in practice.",
    objectives: [
      "Apply the six core values and ethical principles of the NASW Code of Ethics",
      "Navigate dual relationship and boundary issues in practice",
      "Understand confidentiality requirements and exceptions (duty to warn/protect)",
      "Use ethical decision-making models to resolve complex dilemmas",
    ],
    content: `## NASW Code of Ethics: Six Core Values

1. **Service**: Social workers' primary goal is to help people in need
2. **Social justice**: Challenge social injustice and pursue social change
3. **Dignity and worth of the person**: Respect inherent dignity of all people
4. **Importance of human relationships**: Recognize the central importance of relationships
5. **Integrity**: Behave in a trustworthy manner
6. **Competence**: Practice within areas of competence and develop professional expertise

## Confidentiality and Its Exceptions

Confidentiality is a cornerstone of social work practice, but exceptions include:
- **Duty to warn/protect (Tarasoff)**: When a client poses an imminent threat to an identifiable person
- **Mandatory reporting**: Child abuse/neglect, elder abuse, dependent adult abuse
- **Court orders**: Valid subpoenas and court-ordered disclosures
- **Client consent**: Written authorization for release of information
- **Imminent danger to self**: Suicide risk may require breach of confidentiality

## Dual Relationships and Boundaries

Social workers must avoid dual relationships that could:
- Exploit clients or create conflicts of interest
- Impair professional judgment
- Harm the therapeutic relationship

Common boundary violations:
- Accepting gifts of significant value
- Social relationships with current clients
- Business relationships with clients
- Sexual or romantic relationships (prohibited with current and former clients for specified periods)

## Ethical Decision-Making Model

1. Identify the ethical issue
2. Determine applicable ethical standards
3. Consider relevant laws and regulations
4. Consult with colleagues and supervisors
5. Consider possible courses of action
6. Evaluate consequences of each option
7. Make a decision and document the process`,
    keyTerms: ["NASW Code of Ethics", "Tarasoff", "duty to warn", "dual relationships", "confidentiality", "informed consent", "ethical decision-making"],
    examTips: [
      "ASWB exams heavily test ethics - know the six core values and their corresponding ethical principles",
      "Tarasoff (duty to warn/protect) is one of the most frequently tested topics on the exam",
      "When facing an ethical dilemma question, the answer usually involves consulting with a supervisor first",
    ],
  },
  {
    id: "sw-lesson-008",
    slug: "professional-boundaries-supervision",
    title: "Professional Boundaries & Clinical Supervision",
    domain: "Ethics & Professional Practice",
    summary: "Maintaining professional boundaries, understanding the supervisory relationship, managing countertransference, and navigating scope of practice issues.",
    objectives: [
      "Recognize and manage transference and countertransference in the therapeutic relationship",
      "Understand the supervisory relationship and its ethical obligations",
      "Differentiate between administrative, clinical, and supportive supervision",
      "Navigate scope of practice boundaries across social work license levels",
    ],
    content: `## Transference and Countertransference

**Transference**: When a client unconsciously projects feelings from past relationships onto the social worker (e.g., a client who relates to the social worker as a parent figure).

**Countertransference**: When the social worker unconsciously projects their own feelings onto the client. Management strategies:
- Regular self-reflection and self-awareness practice
- Ongoing clinical supervision
- Personal therapy when appropriate
- Peer consultation and support

## Clinical Supervision

Three functions of supervision (Kadushin):
1. **Administrative supervision**: Case assignments, workload management, organizational policies
2. **Educational/clinical supervision**: Skill development, case conceptualization, treatment planning
3. **Supportive supervision**: Emotional support, vicarious trauma processing, burnout prevention

## Scope of Practice

Social work licensure levels and their scopes:
- **BSW**: Case management, resource referral, community organizing
- **MSW**: Direct clinical practice, psychotherapy, assessment
- **LCSW/RSW**: Independent clinical practice, supervision of others, diagnosis
- Social workers must practice within their competence and refer when necessary`,
    keyTerms: ["transference", "countertransference", "clinical supervision", "scope of practice", "Kadushin", "vicarious trauma"],
    examTips: [
      "Countertransference questions often ask what the social worker should do first - the answer is usually seek supervision or consultation",
      "Know the three functions of supervision (administrative, educational, supportive) and be able to identify each in a vignette",
    ],
  },
  {
    id: "sw-lesson-009",
    slug: "community-resources-case-management",
    title: "Community Resources & Case Management",
    domain: "Community Resources",
    summary: "Identifying and connecting clients with community resources, case management models, advocacy, and navigating service delivery systems.",
    objectives: [
      "Identify appropriate community resources for diverse client needs",
      "Apply case management models (brokerage, clinical, strengths-based)",
      "Advocate for clients within complex service delivery systems",
      "Understand the social worker's role in multidisciplinary teams",
    ],
    content: `## Case Management Models

**Brokerage model**: Social worker identifies needs, links clients to services, and monitors outcomes. Focus is on resource coordination rather than direct therapy.

**Clinical case management**: Combines traditional case management with direct clinical services. The social worker provides both therapy and resource coordination.

**Strengths-based case management**: Emphasizes client strengths, natural supports, and community assets rather than deficits. Uses the strengths perspective to empower clients.

## Community Resource Categories

- **Basic needs**: Food banks, shelters, housing programs, utility assistance
- **Healthcare**: Community health centers, mental health services, substance abuse treatment
- **Income supports**: SNAP, TANF, SSI/SSDI, unemployment insurance, worker's compensation
- **Legal services**: Legal aid, immigration assistance, victim advocacy
- **Education/Employment**: GED programs, job training, vocational rehabilitation
- **Family services**: Child care, parenting programs, domestic violence shelters

## Advocacy in Social Work

Levels of advocacy:
- **Case advocacy**: Advocating for individual clients to access services
- **Cause/class advocacy**: Working to change policies that affect groups of people
- **Legislative advocacy**: Influencing laws and regulations
- **Community organizing**: Mobilizing communities for collective action

## Multidisciplinary Teams

Social workers often serve on teams with:
- Physicians, nurses, and other healthcare providers
- Psychologists and psychiatrists
- Educators and school administrators
- Law enforcement and legal professionals
- Community service providers`,
    keyTerms: ["case management", "brokerage model", "strengths-based practice", "advocacy", "multidisciplinary team", "community resources"],
    examTips: [
      "Case management questions test your knowledge of when to use different models - brokerage for resource linking, clinical for combined therapy and coordination",
      "Know the difference between case advocacy (individual) and cause advocacy (systemic change)",
    ],
  },
  {
    id: "sw-lesson-010",
    slug: "social-welfare-policy",
    title: "Social Welfare Policy & Service Delivery",
    domain: "Community Resources",
    summary: "Key social welfare policies, program eligibility, the social safety net, and the social worker's role in policy practice and social change.",
    objectives: [
      "Understand key social welfare programs and their eligibility requirements",
      "Analyze how policy decisions affect client populations",
      "Identify the social worker's role in policy advocacy and social change",
      "Navigate the intersection of policy and direct practice",
    ],
    content: `## Key Social Welfare Programs

**Supplemental Security Income (SSI)**: Needs-based program for aged, blind, or disabled individuals with limited income and resources.

**Social Security Disability Insurance (SSDI)**: Based on work history; provides benefits to workers who become disabled and have paid into Social Security.

**Temporary Assistance for Needy Families (TANF)**: Time-limited cash assistance with work requirements. Replaced AFDC in 1996 welfare reform.

**Supplemental Nutrition Assistance Program (SNAP)**: Food assistance based on income eligibility.

**Medicaid**: Health insurance for low-income individuals and families. Eligibility varies by state.

**Medicare**: Health insurance for individuals 65+ and certain disabled individuals regardless of income.

## Policy Practice in Social Work

Social workers engage in policy practice through:
- Identifying policy gaps that affect client well-being
- Researching the impact of existing and proposed policies
- Testifying before legislative bodies
- Coalition building with other advocacy organizations
- Community education about policy issues

## Historical Context

Key legislation shaping social work:
- Social Security Act (1935)
- Civil Rights Act (1964)
- Americans with Disabilities Act (1990)
- Personal Responsibility and Work Opportunity Reconciliation Act (1996)
- Affordable Care Act (2010)
- Mental Health Parity and Addiction Equity Act (2008)`,
    keyTerms: ["SSI", "SSDI", "TANF", "SNAP", "Medicaid", "Medicare", "policy practice", "social safety net"],
    examTips: [
      "Know the difference between SSI (needs-based) and SSDI (work history-based) - this distinction is frequently tested",
      "TANF replaced AFDC - know the time limits and work requirements",
      "Policy questions may ask about the social worker's role in advocacy and legislative change",
    ],
  },
  {
    id: "sw-lesson-011",
    slug: "crisis-intervention-safety-planning",
    title: "Crisis Intervention & Safety Planning",
    domain: "Crisis Intervention",
    summary: "Crisis intervention models, suicide risk assessment and safety planning, de-escalation techniques, mandatory reporting, and crisis stabilization strategies.",
    objectives: [
      "Apply Roberts' seven-stage crisis intervention model",
      "Conduct a comprehensive suicide risk assessment",
      "Develop collaborative safety plans with at-risk clients",
      "Implement de-escalation techniques in crisis situations",
    ],
    content: `## Roberts' Seven-Stage Crisis Intervention Model

1. **Plan and conduct a thorough assessment**: Assess lethality, safety, and immediate needs
2. **Establish rapport and therapeutic relationship**: Active listening, empathy, validation
3. **Identify the major problem(s)**: Prioritize presenting concerns
4. **Deal with feelings and emotions**: Allow expression of overwhelming emotions
5. **Generate and explore alternatives**: Brainstorm coping strategies and solutions
6. **Develop and formulate an action plan**: Create specific, achievable steps
7. **Follow-up**: Schedule follow-up contact and evaluate progress

## Suicide Risk Assessment

The Columbia-Suicide Severity Rating Scale (C-SSRS) assesses:
- **Suicidal ideation**: Passive (wish to be dead) vs. active (plan to end life)
- **Intensity of ideation**: Frequency, duration, controllability, deterrents
- **Suicidal behavior**: Preparatory acts, aborted attempts, actual attempts
- **Lethality**: Severity of method and medical consequences

Risk factors (SAD PERSONS scale):
- Sex (male), Age (elderly/adolescent), Depression, Previous attempt
- Ethanol abuse, Rational thinking loss, Social supports lacking
- Organized plan, No spouse/partner, Sickness

## Safety Planning

Stanley and Brown's Safety Planning Intervention:
1. Recognize warning signs (thoughts, images, mood, situation, behavior)
2. Internal coping strategies (relaxation, distraction, physical activity)
3. Social contacts and settings that provide distraction
4. People to contact for help (friends, family)
5. Professionals and agencies to contact in crisis
6. Making the environment safe (restricting access to lethal means)

## De-Escalation Techniques

- Maintain calm, non-threatening body language
- Use a soft, steady voice
- Active listening and validation of emotions
- Offer choices to restore sense of control
- Set clear, respectful limits
- Avoid power struggles and confrontational language`,
    keyTerms: ["crisis intervention", "Roberts' model", "safety planning", "C-SSRS", "de-escalation", "means restriction", "mandatory reporting"],
    examTips: [
      "Know Roberts' seven stages in order - exam questions may present a crisis scenario and ask which stage you are in",
      "Safety planning questions test whether you know to restrict access to lethal means as a key step",
      "When in doubt about a crisis question, prioritize client safety above all other considerations",
    ],
  },
  {
    id: "sw-lesson-012",
    slug: "trauma-crisis-response",
    title: "Trauma Response & Critical Incident Management",
    domain: "Crisis Intervention",
    summary: "Understanding trauma responses, critical incident stress debriefing, psychological first aid, and supporting clients and communities after traumatic events.",
    objectives: [
      "Differentiate between acute stress reactions and PTSD",
      "Apply Psychological First Aid (PFA) principles in disaster response",
      "Understand vicarious trauma and secondary traumatic stress in social workers",
      "Implement trauma-informed crisis response in community settings",
    ],
    content: `## Trauma Response Continuum

**Normal stress response**: Brief distress, returns to baseline functioning within days
**Acute stress disorder**: Symptoms lasting 3 days to 1 month after trauma
**Post-Traumatic Stress Disorder**: Symptoms persisting beyond 1 month:
- Intrusion symptoms (flashbacks, nightmares, distressing memories)
- Avoidance (avoiding reminders of the trauma)
- Negative alterations in cognition and mood
- Hyperarousal (hypervigilance, exaggerated startle, sleep disturbance)

**Complex PTSD** (ICD-11): Repeated, prolonged trauma with additional features:
- Affect dysregulation
- Negative self-concept
- Disturbed relationships

## Psychological First Aid (PFA)

PFA is the recommended initial response for individuals affected by disaster or mass violence:
1. Contact and engagement
2. Safety and comfort
3. Stabilization
4. Information gathering (current needs and concerns)
5. Practical assistance
6. Connection with social supports
7. Information on coping
8. Linkage with collaborative services

## Vicarious Trauma and Self-Care

Social workers who work with trauma survivors may experience:
- **Vicarious trauma**: Cumulative shift in worldview from empathic engagement with traumatized clients
- **Secondary traumatic stress (STS)**: Trauma symptoms resulting from indirect exposure
- **Compassion fatigue**: Reduced capacity for empathy from prolonged caregiving

Prevention strategies:
- Regular clinical supervision
- Balanced caseload management
- Personal therapy and self-care practices
- Organizational support and debriefing
- Setting professional boundaries`,
    keyTerms: ["acute stress disorder", "PTSD", "complex PTSD", "psychological first aid", "vicarious trauma", "compassion fatigue", "critical incident debriefing"],
    examTips: [
      "Know the timing distinction: ASD is 3 days to 1 month after trauma, PTSD is after 1 month",
      "PFA is the recommended first response - NOT critical incident stress debriefing (CISD), which has less evidence support",
      "Vicarious trauma questions ask what the social worker should do - the answer usually involves self-care and supervision",
    ],
  },
];
