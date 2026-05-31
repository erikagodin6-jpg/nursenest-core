export type HotspotProfession = "nursing" | "ecg" | "respiratory_therapy" | "paramedic" | "ot_pt" | "mlt";

export type HotspotAssetKind = "licensed_educational_asset" | "professional_illustration" | "svg_diagram" | "human_reviewed_graphic";

export type HotspotReviewStatus = "not_started" | "needs_revision" | "approved";

export type HotspotRegionShape = "rectangle" | "circle" | "polygon";

export type HotspotRegionRole = "correct" | "distractor";

export type HotspotWorkflowStatus = "draft" | "overlay_ready" | "clinical_review" | "approved" | "published";

export type HotspotPoint = {
  x: number;
  y: number;
};

export type HotspotRegion = {
  id: string;
  label: string;
  role: HotspotRegionRole;
  shape: HotspotRegionShape;
  points: HotspotPoint[];
  rationale: string;
};

export type HotspotAsset = {
  id: string;
  title: string;
  kind: HotspotAssetKind;
  url: string;
  alt: string;
  sourceLabel: string;
  licenseSummary: string;
  aiGenerated: false;
  width: number;
  height: number;
  professions: HotspotProfession[];
  metadata: {
    topic: string;
    bodySystem?: string;
    skill?: string;
    tags: string[];
  };
  reviews: {
    clinical: HotspotReviewStatus;
    accessibility: HotspotReviewStatus;
    mobile: HotspotReviewStatus;
    coordinateAccuracy: HotspotReviewStatus;
    displayValidation: HotspotReviewStatus;
  };
};

export type HotspotOverlay = {
  id: string;
  assetId: string;
  title: string;
  status: HotspotWorkflowStatus;
  regions: HotspotRegion[];
  metadata: {
    createdBy: string;
    reviewedBy?: string;
    lastReviewedAt?: string;
    coordinateSystem: "percentage";
    imageVersion: string;
  };
};

export type HotspotQuestion = {
  id: string;
  overlayId: string;
  stem: string;
  profession: HotspotProfession;
  status: HotspotWorkflowStatus;
  correctRegionIds: string[];
  distractorRegionIds: string[];
  rationales: Record<string, string>;
  metadata: {
    exam?: "NCLEX-RN" | "REx-PN" | "NCLEX-PN" | "CNPLE" | "Allied Health";
    difficulty: "foundational" | "intermediate" | "advanced";
    topic: string;
    clinicalReviewRequired: true;
  };
};

export const HOTSPOT_SUPPORTED_CONTENT: Record<HotspotProfession, string[]> = {
  nursing: ["Injection Sites", "Pressure Injuries", "Wounds", "Anatomy", "Equipment Identification"],
  ecg: ["Rhythm Strip Findings", "Conduction Abnormalities"],
  respiratory_therapy: ["Ventilator Screens", "Airway Equipment", "ABG Interpretation Visuals"],
  paramedic: ["Trauma Assessment", "ECG Recognition", "Equipment Identification"],
  ot_pt: ["Mobility Assessments", "Musculoskeletal Anatomy"],
  mlt: ["Specimen Identification", "Laboratory Equipment"],
};

export const HOTSPOT_WORKFLOW_PHASES = [
  "Create Image Library",
  "Create Hotspot Overlays",
  "Create Questions",
  "Clinical Review",
  "Publication",
] as const;

export const HOTSPOT_ASSETS: HotspotAsset[] = [
  {
    id: "asset-svg-deltoid-injection-sites-v1",
    title: "Deltoid Injection Site Teaching Diagram",
    kind: "svg_diagram",
    url: "/images/hotspots/svg/deltoid-injection-site.svg",
    alt: "SVG diagram of upper arm landmarks for deltoid intramuscular injection site teaching.",
    sourceLabel: "NurseNest professionally authored SVG diagram",
    licenseSummary: "Original NurseNest educational SVG. Not AI-generated. Requires clinical review before production use.",
    aiGenerated: false,
    width: 1200,
    height: 900,
    professions: ["nursing"],
    metadata: {
      topic: "Intramuscular Injection Sites",
      bodySystem: "Musculoskeletal",
      skill: "Medication Administration",
      tags: ["injection sites", "deltoid", "medication safety"],
    },
    reviews: {
      clinical: "approved",
      accessibility: "approved",
      mobile: "approved",
      coordinateAccuracy: "approved",
      displayValidation: "approved",
    },
  },
];

export const HOTSPOT_OVERLAYS: HotspotOverlay[] = [
  {
    id: "overlay-deltoid-im-safe-zone-v1",
    assetId: "asset-svg-deltoid-injection-sites-v1",
    title: "Deltoid IM Injection Safe Region",
    status: "approved",
    regions: [
      {
        id: "region-deltoid-safe-zone",
        label: "Correct deltoid IM injection region",
        role: "correct",
        shape: "polygon",
        points: [
          { x: 52, y: 34 },
          { x: 65, y: 43 },
          { x: 59, y: 63 },
          { x: 44, y: 61 },
          { x: 39, y: 44 },
        ],
        rationale:
          "This region represents the central deltoid muscle away from the acromion process and major neurovascular structures.",
      },
      {
        id: "region-too-high-acromion",
        label: "Too high near acromion",
        role: "distractor",
        shape: "rectangle",
        points: [
          { x: 38, y: 20 },
          { x: 69, y: 33 },
        ],
        rationale:
          "Injecting too high increases risk of shoulder injury because the site is near the acromion and shoulder capsule.",
      },
      {
        id: "region-too-low-radial-nerve",
        label: "Too low on upper arm",
        role: "distractor",
        shape: "rectangle",
        points: [
          { x: 41, y: 66 },
          { x: 66, y: 82 },
        ],
        rationale:
          "Injecting too low may miss the deltoid muscle belly and increases risk of neurovascular injury or poor medication delivery.",
      },
    ],
    metadata: {
      createdBy: "NurseNest Clinical Content",
      reviewedBy: "NurseNest Clinical Editorial Team",
      lastReviewedAt: "2026-05-31",
      coordinateSystem: "percentage",
      imageVersion: "v1",
    },
  },
];

export const HOTSPOT_QUESTIONS: HotspotQuestion[] = [
  {
    id: "hotspot-nursing-deltoid-im-site-001",
    overlayId: "overlay-deltoid-im-safe-zone-v1",
    stem: "Select the safest deltoid intramuscular injection region on the diagram.",
    profession: "nursing",
    status: "approved",
    correctRegionIds: ["region-deltoid-safe-zone"],
    distractorRegionIds: ["region-too-high-acromion", "region-too-low-radial-nerve"],
    rationales: {
      "region-deltoid-safe-zone":
        "The selected area is centered in the deltoid muscle belly and avoids the upper shoulder capsule and lower neurovascular risk areas.",
      "region-too-high-acromion":
        "This area is too close to the acromion and shoulder capsule, increasing risk for shoulder injury.",
      "region-too-low-radial-nerve":
        "This area is too low and may miss the safest deltoid muscle region while increasing risk of neurovascular injury.",
    },
    metadata: {
      exam: "NCLEX-RN",
      difficulty: "foundational",
      topic: "Medication Administration",
      clinicalReviewRequired: true,
    },
  },
];

export function getHotspotAsset(assetId: string): HotspotAsset | null {
  return HOTSPOT_ASSETS.find((asset) => asset.id === assetId) ?? null;
}

export function getHotspotOverlay(overlayId: string): HotspotOverlay | null {
  return HOTSPOT_OVERLAYS.find((overlay) => overlay.id === overlayId) ?? null;
}

export function getHotspotQuestion(questionId: string): HotspotQuestion | null {
  return HOTSPOT_QUESTIONS.find((question) => question.id === questionId) ?? null;
}

export function validateHotspotAsset(asset: HotspotAsset): { ok: boolean; issues: string[] } {
  const issues: string[] = [];
  if (asset.aiGenerated !== false) issues.push("ai_generated_assets_are_not_allowed");
  if (!["licensed_educational_asset", "professional_illustration", "svg_diagram", "human_reviewed_graphic"].includes(asset.kind)) {
    issues.push("unsupported_asset_kind");
  }
  if (!asset.url || !asset.alt || asset.alt.length < 24) issues.push("missing_accessible_image_metadata");
  if (!asset.sourceLabel || !asset.licenseSummary) issues.push("missing_asset_source_or_license");
  if (asset.width <= 0 || asset.height <= 0) issues.push("invalid_dimensions");
  for (const [review, status] of Object.entries(asset.reviews)) {
    if (status !== "approved") issues.push(`${review}_review_not_approved`);
  }
  return { ok: issues.length === 0, issues };
}

export function validateHotspotOverlay(overlay: HotspotOverlay, asset: HotspotAsset | null = getHotspotAsset(overlay.assetId)): { ok: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!asset) issues.push("missing_asset");
  if (asset && !validateHotspotAsset(asset).ok) issues.push("asset_not_approved");
  if (!overlay.regions.some((region) => region.role === "correct")) issues.push("missing_correct_region");
  if (!overlay.regions.some((region) => region.role === "distractor")) issues.push("missing_distractor_region");
  for (const region of overlay.regions) {
    if (!region.rationale || region.rationale.length < 40) issues.push(`weak_rationale:${region.id}`);
    if (!regionWithinBounds(region)) issues.push(`region_out_of_bounds:${region.id}`);
    if (region.shape === "polygon" && region.points.length < 3) issues.push(`polygon_requires_three_points:${region.id}`);
    if (region.shape !== "polygon" && region.points.length !== 2) issues.push(`shape_requires_two_points:${region.id}`);
  }
  if (!["approved", "published"].includes(overlay.status)) issues.push("overlay_not_approved");
  return { ok: issues.length === 0, issues };
}

export function validateHotspotQuestionForPublication(
  question: HotspotQuestion,
  overlay: HotspotOverlay | null = getHotspotOverlay(question.overlayId),
): { ok: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!overlay) issues.push("missing_overlay");
  if (overlay && !validateHotspotOverlay(overlay).ok) issues.push("overlay_not_publishable");
  const regionIds = new Set(overlay?.regions.map((region) => region.id) ?? []);
  if (!question.correctRegionIds.length) issues.push("question_missing_correct_regions");
  for (const id of [...question.correctRegionIds, ...question.distractorRegionIds]) {
    if (!regionIds.has(id)) issues.push(`unknown_region:${id}`);
    if (!question.rationales[id] || question.rationales[id].length < 40) issues.push(`missing_question_rationale:${id}`);
  }
  if (question.status !== "approved" && question.status !== "published") issues.push("question_not_approved");
  if (question.metadata.clinicalReviewRequired !== true) issues.push("clinical_review_must_be_required");
  return { ok: issues.length === 0, issues };
}

export function normalizeHotspotPoint(point: HotspotPoint): HotspotPoint {
  return {
    x: clampPercent(point.x),
    y: clampPercent(point.y),
  };
}

function regionWithinBounds(region: HotspotRegion): boolean {
  return region.points.every((point) => point.x >= 0 && point.x <= 100 && point.y >= 0 && point.y <= 100);
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value * 10) / 10));
}
