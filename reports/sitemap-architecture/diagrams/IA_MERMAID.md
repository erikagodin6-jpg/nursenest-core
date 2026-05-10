# Sitemap IA diagrams (Mermaid)

Figma MCP was not used (no authenticated design export in this run). To export to FigJam later: paste Mermaid into a diagram tool or use `generate_diagram` after `figma-generate-diagram` skill + user session.

## Overall architecture (today)

```mermaid
flowchart TB
  subgraph crawlers[Crawlers]
    G[Googlebot]
  end
  R[robots.txt]
  S1["/sitemap.xml\nmerged urlset"]
  S2["/sitemap-allied.xml"]
  S3["/sitemap-new-grad.xml"]
  G --> R
  R --> S1
  R --> S2
  R --> S3
  subgraph core[Core collectors]
    C[collectCoreUrls]
    B[listBlogSitemapEntriesSafe]
    F[filterPublicSitemapEntries]
  end
  C --> F
  B --> F
  F --> S1
```

## Content clustering (logical, not Google-guaranteed)

```mermaid
flowchart LR
  M[Marketing shell] --> H[Exam hubs]
  M --> L[Pathway lessons/topics]
  M --> P[Programmatic study SEO]
  M --> Blog[Blog]
  M --> SR[Study resource hubs]
  A[Allied occupation] --> SA[sitemap-allied]
  NG[New Grad work areas] --> SN[sitemap-new-grad]
  App["/app learner"] -.->|never| SM[Sitemaps]
```

## RN / RPN / NP ecosystems (URL shape)

```mermaid
flowchart TB
  US[US pathways /us/...]
  CA[CA pathways /canada/...]
  US --> RN[rn / nclex-rn]
  US --> PN[pn / nclex-pn]
  US --> NP[np / fnp ...]
  CA --> CRN[rn]
  CA --> CPN[pn / rex-pn]
  CA --> CNP[np / cnple]
```

## Blog ↔ lesson ↔ module (indexing boundary)

```mermaid
flowchart TB
  blog["/blog — indexable"]
  lesson["Marketing lesson URL — indexable when published"]
  mod["/modules/ecg|lab-values — noindex not in sitemap"]
  learner["/app CAT|practice|flashcards — noindex not in sitemap"]
  blog --- lesson
  lesson -.->|premium UX| learner
  lesson -.->|clinical add-on| mod
```
