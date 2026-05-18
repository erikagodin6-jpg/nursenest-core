export function buildCasperFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the CASPer test?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CASPer is a situational judgment assessment used by many healthcare and professional programs to evaluate professionalism, communication, ethical reasoning, and interpersonal judgment.',
        },
      },
      {
        '@type': 'Question',
        name: 'How should I prepare for CASPer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Preparation should focus on reflective communication, stakeholder awareness, professionalism, ethical reasoning, and timed scenario practice rather than memorizing scripts.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are CASPer answers supposed to be perfect?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Strong responses are balanced, thoughtful, respectful, and safety-aware. Admissions reviewers generally value reflective judgment more than perfection.',
        },
      },
    ],
  };
}

export function buildCasperCourseJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'NurseNest CASPer Preparation',
    description:
      'Healthcare-focused CASPer preparation with reflective simulations, professionalism coaching, and ethical reasoning practice.',
    provider: {
      '@type': 'Organization',
      name: 'NurseNest',
      url: 'https://www.nursenest.ca',
    },
  };
}
