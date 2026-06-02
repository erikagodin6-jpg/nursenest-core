# Hotspot Question Infrastructure

## Production Rule

Production hotspot questions must not use AI-generated clinical imagery.

Allowed assets:

- Licensed educational assets
- Professionally created illustrations
- SVG diagrams
- Human-reviewed graphics

The image asset system and question system remain separate. Assets can be reused across many overlays and questions.

## Data Separation

The infrastructure stores:

- Image asset metadata
- Hotspot overlay coordinates
- Correct regions
- Distractor regions
- Region rationales
- Question metadata
- Review state

Images do not contain answer logic. Questions reference overlays, and overlays reference image assets.

## Workflow

1. Create image library
2. Create hotspot overlays
3. Create questions
4. Clinical review
5. Publication

Questions cannot publish unless:

- The image asset is approved
- Clinical review is approved
- Accessibility review is approved
- Mobile review is approved
- Coordinate accuracy review is approved
- Display validation is approved
- Overlay includes at least one correct region and one distractor
- Every region has a rationale

## Admin Authoring

Admin surface:

- `/admin/hotspots`

Supports:

- Click-to-place regions
- Rectangle, circle, and polygon regions
- Multiple correct and distractor regions
- Desktop preview
- Mobile preview
- Preview mode
- Coordinate inspection
- Validation status

## Future Persistence

Current implementation is typed infrastructure and admin authoring scaffolding. The structure is designed to map cleanly to future tables:

- `HotspotAsset`
- `HotspotOverlay`
- `HotspotRegion`
- `HotspotQuestion`
- `HotspotReview`

No Prisma migration was added in this pass.
