# Approved UI reference implementation — 2026-05-08

**Branch:** `preview/approved-ui-reference-implementation`  
**Scope:** Premium marketing / pathway hero alignment with design tokens; Figma discovery and fallbacks documented below.

---

## Summary

- **Live code:** Pathway overview hub (`ExamPathwayHub`) hero updated to use the same premium eyebrow, heading palette, and muted body tokens as `NursingTierHubPage` (`nn-premium-home-eyebrow`, `--palette-heading`, `--palette-text-muted`).
- **Figma:** No `figma.com/design/{fileKey}` URLs are committed in this repository (see discovery). MCP frame retrieval was not possible without a file key and node IDs supplied out-of-band.

---

## Figma reference

### Discovery (repo + docs)

| Search | Result |
|--------|--------|
| `rg -i "figma.com" nursenest-core docs .cursor` | Only verification/docs stating **no embedded file keys**; see `docs/verification/practice-tests-pathway-ui-verification.md`, `reports/ui-redesign-preview/RN_RPN_REDESIGN_PLAN.md`. |
| `*.figma.ts` Code Connect | **None** in workspace. |

### MCP attempts

| Tool | Parameters | Outcome |
|------|------------|---------|
| `whoami` | — | **OK** — authenticated as team Pro (Full seat). |
| `get_metadata` | `fileKey`: invalid placeholder | **File could not be accessed** — expected without a real file key and file share. |

**Blocker:** Without a published Figma **file key** and **node-id** list for homepage, hubs, dashboard, pricing, tools, FAQ, blog, flashcards, practice, and CAT frames, `get_design_context`, `get_metadata`, and `get_screenshot` cannot be targeted. Add URLs or keys to this report (or `docs/`) when available.

### Frames retrieved

**None** — blocked as above.

### Intended route ↔ surface mapping (for when Figma links exist)

| Route / surface | Suggested frame naming | Notes |
|-----------------|------------------------|--------|
| Marketing homepage | Home / Hero | Match `premium-redesign-2026.css`, `HomeConversionHero` |
| Pathway tier hubs | RN / PN / RPN hub | `NursingTierHubPage`, `ExamPathwayHub` |
| Learner dashboard | Dashboard | `/app` learner shell |
| Pricing | Pricing | pathway + global pricing routes |
| Tools | Tools hub | tools marketing |
| FAQ | FAQ | public FAQ |
| Blog index / post | Blog | blog routes |
| Flashcards | Flashcards hub | `flashcards/page.tsx` |
| Practice | Practice runner | practice surfaces |
| CAT | CAT marketing | pathway CAT pages |

### Fallback assets (screenshots)

When Figma is unavailable, reference PNGs under **`.cursor/projects/root-nursenest-core/assets/`** (local Cursor project assets), including:

- Homepage mockups: `1homepage-mockup-*.png`, `homepage-*.png`
- Hubs: `rn-hub-*.png`, `allied-hub-*.png`, `np-hub-*.png`, `mockup-pre-nursing-hub-*.png`
- Dashboard: `dashboard-*.png`
- Pricing: `pricing-*.png`
- Blog: `blog-*.png`, `blog-detail-*.png`
- Flashcards: `flashcards-*.png`, `flashcard-session-*.png`
- Practice: `practice-*.png`, `practice-runner-*.png`, `practice-tests-*.png`
- CAT: `cat-*.png`
- Tools: `tools-*.png`
- FAQ: `faq-*.png`

### Gaps vs live site

| Gap | Mitigation this pass |
|-----|------------------------|
| No Figma node specs in-repo | Documented blocker; used existing premium tokens + `RN_RPN_REDESIGN_PLAN.md` hierarchy targets. |
| `ExamPathwayHub` hero differed from `NursingTierHubPage` eyebrow + palette | **Aligned** eyebrow to `nn-premium-home-eyebrow`; heading/body to `--palette-heading` / `--palette-text-muted`. |

---

## Files changed

- `src/components/exam-pathways/exam-pathway-hub.tsx`

---

*Append when Figma file keys are added to the repository.*
