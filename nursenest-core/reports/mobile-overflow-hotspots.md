# Mobile Overflow & Horizontal Scroll Hotspots

Overflow risks: **horizontal scroll**, **clipped focus rings**, **truncated CTAs**, **tables/code wider than viewport**.

| ID | Route / area | Component / file | Pattern observed | Likely cause | Sev | Suggested fix | Tag |
|----|--------------|------------------|------------------|--------------|-----|---------------|-----|
| OVF-01 | All marketing + hubs | `components/layout/site-header.tsx` | `whitespace-nowrap`, `shrink-0`, dense `h-8` row | Tier strip + flow row cannot shrink | P1 | Add scroll snap row OR wrap with `min-w-0` + line clamp | AI_CAN_PREP_BUT_DEV_REVIEW |
| OVF-02 | `/app/*` learner | `app/(student)/app/(learner)/layout.tsx` | `overflow-x-clip` on sticky chrome | Prevent bleed; may clip popovers | P2 | Ensure menus portaled outside clip subtree | AI_CAN_PREP_BUT_DEV_REVIEW |
| OVF-03 | `/app/*` | `learner-shell-primary-nav.tsx` | Many `flex-1` + `max-w-[min(46vw,10rem)]` bottom items | Many nav extensions | P1 | Collapse secondary into “More” sheet on narrow | AI_CAN_PREP_BUT_DEV_REVIEW |
| OVF-04 | Marketing blog & pathway blog | Blog article templates / prose | Wide tables, images, pre | CMS HTML | P1 | Prose defaults + table scroll wrapper | AI_CAN_PREP_BUT_DEV_REVIEW |
| OVF-05 | Pathway pricing (if tables) | *TBD grep* | `table-fixed`, long currency strings | Marketing table layout | P2 | Responsive table → stacked cards | AI_CAN_PREP_BUT_DEV_REVIEW |
| OVF-06 | Admin tables | Various `/admin/analytics/*` | Wide dashboards | Many columns | P2 | Horizontal scroll container + sticky first column | DEVELOPER_ONLY |
| OVF-07 | Flashcard / question stems | Rich HTML prompts | Unbounded media | Imported HTML | P2 | Sanitize + `max-w-full` on media | AI_CAN_PREP_BUT_DEV_REVIEW |
| OVF-08 | Modals | `mobile-context-drawer.tsx` | `max-h-[85dvh]` | Tall inner lists | P3 | Inner `overflow-y-auto` already — verify | SAFE_FOR_AI |

**Quick grep follow-ups (DEV_ONLY):** `min-w-[`, `w-[`, `table`, `prose`, `overflow-x-hidden` (can mask bugs), `whitespace-nowrap` in `src/components/layout` and `src/components/student`.

**Screenshot recipe per hotspot:** 390px width, longest locale, max nav flags on learner demo account, scroll slowly horizontally — any pixel drift > 8px = fail.
