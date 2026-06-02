export const PARENT_EDUCATIONAL_ORG = {
  "@type": "EducationalOrganization" as const,
  "name": "NurseNest",
  "url": "https://www.nursenest.ca",
  "description": "Comprehensive nursing and allied health education ecosystem offering exam preparation, career transition resources, and job placement tools.",
  "sameAs": [
    "https://www.nursenest.ca",
    "https://www.nursenest.ca/allied-health",
    "https://www.instagram.com/nursenest.ca",
    "https://www.tiktok.com/@nursenest.ca",
  ],
  "department": [
    {
      "@type": "EducationalOrganization",
      "name": "NurseNest Exam Prep",
      "url": "https://www.nursenest.ca",
      "description": "Nursing exam preparation with pathophysiology lessons, practice questions, clinical simulations, and adaptive mock exams for NCLEX, REX-PN, and NP certification.",
    },
    {
      "@type": "EducationalOrganization",
      "name": "New Grad Hub",
      "url": "https://www.nursenest.ca/new-grad",
      "description": "Career transition platform for new graduate healthcare professionals featuring interview prep, resume building, and first-year survival guides.",
    },
    {
      "@type": "EducationalOrganization",
      "name": "ApplyNest",
      "url": "https://www.nursenest.ca/new-grad",
      "description": "Job placement and career tools powered by NurseNest — interview lab, resume builder, cover letter generator, and ATS optimization for healthcare professionals.",
    },
  ],
};

export function buildBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

export function buildFaqStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export function buildFaqFromQuizQuestions(questions: { question: string; options: string[]; correct: number; rationale: string }[]) {
  const faqs = questions.slice(0, 10).map((q) => ({
    question: q.question,
    answer: `${q.options[q.correct]}. ${q.rationale}`,
  }));
  return buildFaqStructuredData(faqs);
}

export function buildCatalogStructuredData(lessons: { id: string; name: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nursing Pathophysiology Lessons",
    "description": "Comprehensive catalog of nursing pathophysiology lessons covering cardiovascular, respiratory, neurological, GI, renal, endocrine, hematology, pediatrics, maternity, neonatal, and more.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
    },
    "hasPart": lessons.slice(0, 50).map((l) => ({
      "@type": "LearningResource",
      "name": l.name,
      "url": `https://www.nursenest.ca/lessons/${l.id}`,
    })),
  };
}

export function buildCourseStructuredData(course: {
  name: string;
  description: string;
  url: string;
  provider?: string;
  offers?: { price: string; priceCurrency: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description,
    "url": course.url,
    "provider": {
      "@type": "EducationalOrganization",
      "name": course.provider || "NurseNest",
      "url": "https://www.nursenest.ca",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": PARENT_EDUCATIONAL_ORG.name,
        "url": PARENT_EDUCATIONAL_ORG.url,
      },
    },
    "courseMode": "online",
    "isAccessibleForFree": false,
    ...(course.offers
      ? {
          "offers": {
            "@type": "Offer",
            "price": course.offers.price,
            "priceCurrency": course.offers.priceCurrency,
            "availability": "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function buildAggregateRatingStructuredData(rating: {
  ratingValue: string;
  reviewCount: string;
  bestRating?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "NurseNest",
    "url": "https://www.nursenest.ca",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.ratingValue,
      "reviewCount": rating.reviewCount,
      "bestRating": rating.bestRating || "5",
    },
  };
}

export function buildJobPostingStructuredData(job: {
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency?: string;
  educationRequirements?: string;
  occupationalCategory?: string;
  employmentType?: string;
  jobLocationType?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "hiringOrganization": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "sameAs": "https://www.nursenest.ca",
      "department": PARENT_EDUCATIONAL_ORG.department,
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": job.salaryCurrency || "USD",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salaryMin,
        "maxValue": job.salaryMax,
        "unitText": "YEAR",
      },
    },
    "employmentType": job.employmentType || "FULL_TIME",
    "jobLocationType": job.jobLocationType || "TELECOMMUTE",
    ...(job.educationRequirements
      ? { "educationRequirements": { "@type": "EducationalOccupationalCredential", "credentialCategory": job.educationRequirements } }
      : {}),
    ...(job.occupationalCategory ? { "occupationalCategory": job.occupationalCategory } : {}),
    ...(job.url ? { "url": job.url } : {}),
    "datePosted": new Date().toISOString().split("T")[0],
    "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };
}

export function buildJobTrainingStructuredData(training: {
  name: string;
  description: string;
  url: string;
  provider?: string;
  occupationalCategory?: string;
  educationRequirements?: string;
  salaryRange?: { min: number; max: number; currency?: string };
  timeToComplete?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": training.name,
    "description": training.description,
    "url": training.url,
    "programType": "Professional certification preparation",
    "educationalProgramMode": "online",
    "provider": {
      "@type": "EducationalOrganization",
      "name": training.provider || "NurseNest Allied",
      "url": "https://www.nursenest.ca/allied-health",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": PARENT_EDUCATIONAL_ORG.name,
        "url": PARENT_EDUCATIONAL_ORG.url,
      },
    },
    ...(training.occupationalCategory
      ? {
          "occupationalCategory": training.occupationalCategory,
          "occupationalCredentialAwarded": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": training.educationRequirements || training.occupationalCategory,
          },
        }
      : {}),
    ...(training.salaryRange
      ? {
          "salaryUponCompletion": {
            "@type": "MonetaryAmountDistribution",
            "currency": training.salaryRange.currency || "USD",
            "median": Math.round((training.salaryRange.min + training.salaryRange.max) / 2),
          },
        }
      : {}),
    ...(training.timeToComplete
      ? { "timeToComplete": training.timeToComplete }
      : {}),
  };
}

export function buildEducationalOrganizationStructuredData(org?: {
  name?: string;
  url?: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    ...PARENT_EDUCATIONAL_ORG,
    ...(org?.name ? { "name": org.name } : {}),
    ...(org?.url ? { "url": org.url } : {}),
    ...(org?.description ? { "description": org.description } : {}),
  };
}

export function buildReviewStructuredData(reviews: {
  author: string;
  reviewBody: string;
  ratingValue: string;
  datePublished?: string;
}[]) {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
    },
    "author": {
      "@type": "Person",
      "name": review.author,
    },
    "reviewBody": review.reviewBody,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.ratingValue,
      "bestRating": "5",
    },
    ...(review.datePublished ? { "datePublished": review.datePublished } : {}),
  }));
}
