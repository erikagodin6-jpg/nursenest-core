# RN Lessons Design v3 — Quick Start

## Open the gallery

```bash
cd lesson-mockups
python3 -m http.server 8765
```

| File | Focus |
|------|--------|
| **`rn-lessons-hub-gallery-v4.html`** | **Hub only** — categories first, compact resume, 5 themes (Ocean, Blossom, Aurora, Sunset, Midnight) |
| `rn-lessons-design-gallery-v3.html` | Hub + lesson concepts (hub updated to match v4 priorities) |

Or open the HTML files directly in a browser.

## What's included

| Deliverable | File |
|-------------|------|
| **Interactive gallery** | `rn-lessons-design-gallery-v3.html` |
| **Design specification** | `RN-LESSONS-DESIGN-SPEC.md` |
| **This guide** | `README-RN-LESSONS-V3.md` |

### Gallery controls

- **Lessons Hub (12)** — H1–H12 unique layout directions
- **Lesson Page (12)** — L1–L12 unique reading layouts
- **Design System** — colours, typography, spacing, components
- **Desktop / Mobile** viewport toggle
- **Light / Dark** mode toggle

## Concept index

### Hub (H1–H12)

1. Clinical Atlas — progress ring + category grid  
2. Editorial Magazine — serif hero + horizontal scroll  
3. Modular Bento — asymmetric featured/weak/continue grid  
4. Spectrum Strip — colour-coded category bands  
5. Progress Journey — timeline study flow  
6. Glass Canvas — subtle glassmorphism  
7. Academic Ledger — table lesson index  
8. Notion Workspace — database-style rows  
9. Adaptive Focus — weak-area recommendations first  
10. Magazine Feature — large editorial featured blocks  
11. Minimal Canvas — ultra-clean whitespace  
12. Ultrawide Command — 1600px category bands  

### Lesson (L1–L12)

1. Color-Coded Stack — full-width section cards  
2. Editorial Reader — magazine typography  
3. Modular Grid — 2-column on desktop  
4. Clinical Workflow — Recognize → Assess → Intervene  
5. Sticky Pill Nav — top nav only, no sidebar  
6. Accordion Study — collapsible sections  
7. Progress Spine — thin 48px rail  
8. Health-Tech Panels — clinical SaaS icons  
9. Soft Neumorphism — raised cards  
10. Premium Magazine — 80px section gaps  
11. Practice Dock — interactive MCQ cards  
12. Dark Clinical — polished dark mode  

## Next steps

1. Review gallery with stakeholders  
2. Pick 1–2 hub + 1–2 lesson directions  
3. Implement in `lessons-page-shell.tsx` and `pathway-lesson-detail-page-body.tsx`  
4. Run E2E: `pathway-lessons-hub-premium.spec.ts`, `lesson-detail-premium-smoke.spec.ts`
