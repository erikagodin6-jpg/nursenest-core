/**
 * Structured constraints for any future AI-assisted **email** tooling (drafts / auto-receipts).
 * Not used for chat UI; do not present as live support.
 */
export const AI_SUPPORT_CHANNEL_RULES = {
  channel: "email_only" as const,
  publicSupportEmailField: "SUPPORT_EMAIL from support-policy (backed by NEXT_PUBLIC_SUPPORT_EMAIL)",
  responseWindow: "up_to_4_business_days" as const,
};

export const AI_SUPPORT_RESPONSE_RULES = {
  mustNotPromise: [
    "refunds",
    "cancellations",
    "account_changes",
    "diagnosis_or_clinical_advice",
    "legal_advice",
    "guaranteed_outcomes",
  ] as const,
  mayDo: [
    "acknowledge_receipt",
    "summarize_request_in_neutral_terms",
    "link_self_serve_account_billing_when_relevant",
    "state_team_will_review",
  ] as const,
  billingSubscription: {
    firstStep: "direct_users_to_account_billing_self_serve_tools",
    then: "support_email_for_unresolved_issues",
  } as const,
  escalationRequiredFor: [
    "refund_requests",
    "payment_disputes",
    "cancellation_failures",
    "login_or_account_access_issues",
    "clinical_or_medical_claims",
    "privacy_or_data_deletion_requests",
  ] as const,
};
