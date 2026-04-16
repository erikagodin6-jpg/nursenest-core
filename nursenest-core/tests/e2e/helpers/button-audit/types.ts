/**
 * Shared types for button / control audits (inventory + safe interaction).
 */

export type InteractionHint = "navigate" | "submit" | "toggle" | "dialog" | "unknown";

export type InventoryControl = {
  /** Stable index on page at collection time (0..n-1). */
  index: number;
  tag: string;
  role: string | null;
  text: string;
  ariaLabel: string | null;
  href: string | null;
  dataTestId: string | null;
  disabled: boolean;
  visible: boolean;
  interactionHint: InteractionHint;
  /** Bounding box for debugging / screenshots */
  rect: { top: number; left: number; width: number; height: number };
};

export type PageInventory = {
  pathname: string;
  url: string;
  collectedAt: string;
  controls: InventoryControl[];
  truncated: boolean;
  maxControls: number;
};

export type InventoryReport = {
  generatedAt: string;
  baseURL: string;
  auditKind: "inventory";
  role: string;
  pages: PageInventory[];
};

export type SafeClickOutcome =
  | "navigated"
  | "dialog_opened"
  | "toggle_changed"
  | "no_op_but_ok"
  | "skipped_unstable"
  | "skipped_destructive"
  | "skipped_external"
  | "error";

export type SafeClickResult = {
  pathname: string;
  urlBefore: string;
  urlAfter: string;
  control: Pick<InventoryControl, "tag" | "text" | "href" | "dataTestId" | "interactionHint">;
  outcome: SafeClickOutcome;
  detail?: string;
  screenshotPath?: string;
};

export type SafeInteractionReport = {
  generatedAt: string;
  baseURL: string;
  auditKind: "safe_interaction";
  role: string;
  results: SafeClickResult[];
  failures: SafeClickResult[];
};

export type HttpDocumentError = {
  url: string;
  status: number;
  method: string;
};
