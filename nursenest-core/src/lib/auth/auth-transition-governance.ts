/**
 * Auth transition governance — public API.
 *
 * - Copy/composition: {@link ./auth-transition-presentation.ts} + i18n keys
 * - Pathway/watermark: {@link ./auth-transition-governance-core.ts}
 * - Callback/resume: {@link ./auth-flow-governance.ts}
 */

export type {
  AuthTransitionKind,
  AuthPathwaySegment,
  AuthWhatsNextStep,
  AuthTransitionPresentation,
  AuthTransitionPresentationInput,
  AuthTransitionTranslate,
  AuthTransitionLayout,
  AuthTransitionMotionPreset,
  AuthMagicLinkVariant,
} from "@/lib/auth/auth-transition-types";

export { AUTH_TRANSITION_I18N } from "@/lib/auth/auth-transition-i18n-keys";

export {
  AUTH_LEAF_WATERMARK_GOVERNANCE,
  authLeafOpacityForPlacement,
  inferAuthPathwaySegment,
  authTransitionMessageTone,
  resolveAuthTransitionContext,
  isNpPathwayForAuthCopy,
} from "@/lib/auth/auth-transition-governance-core";

export {
  resolveAuthTransitionPresentation,
  resolveAuthWhatsNextSteps,
  inferLearnerIntentFromCallback,
  signupTierToPathwaySegment,
} from "@/lib/auth/auth-transition-presentation";
