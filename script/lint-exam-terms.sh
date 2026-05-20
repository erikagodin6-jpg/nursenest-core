#!/usr/bin/env bash
set -euo pipefail

ERRORS=0

GLOBAL_EXCLUDE="--glob=!*node_modules* --glob=!*dist* --glob=!*.git* --glob=!*attached_assets* --glob=!*lint-exam-terms*"

HITS=$(rg --count-matches 'American REx-PN' $GLOBAL_EXCLUDE . 2>/dev/null || true)
if [ -n "$HITS" ]; then
  echo "ERROR: Found banned phrase 'American REx-PN':"
  echo "$HITS"
  ERRORS=1
fi

EXCLUDE="$GLOBAL_EXCLUDE"

EXCLUDE="$EXCLUDE --glob=!*rex-pn-hub* --glob=!*rex-pn-exam-format* --glob=!*rex-pn-strategies* --glob=!*rex-pn-wellness*"
EXCLUDE="$EXCLUDE --glob=!*compare*rex-pn*"
EXCLUDE="$EXCLUDE --glob=!*exam-hub.tsx*"
EXCLUDE="$EXCLUDE --glob=!*exam-practice-landing*"

EXCLUDE="$EXCLUDE --glob=!*shared/constants*"
EXCLUDE="$EXCLUDE --glob=!*shared/careers*"
EXCLUDE="$EXCLUDE --glob=!*question-bank-validation*"
EXCLUDE="$EXCLUDE --glob=!*content-generators*"
EXCLUDE="$EXCLUDE --glob=!*qbank-api*"
EXCLUDE="$EXCLUDE --glob=!*seed-*"
EXCLUDE="$EXCLUDE --glob=!*seo-exam-data*"
EXCLUDE="$EXCLUDE --glob=!*seo-title-map*"
EXCLUDE="$EXCLUDE --glob=!*silo-config*"
EXCLUDE="$EXCLUDE --glob=!*breadcrumb-builder*"
EXCLUDE="$EXCLUDE --glob=!*server/seo-meta* --glob=!*server/seo-engine*"
EXCLUDE="$EXCLUDE --glob=!*i18n-translations* --glob=!*i18n-en*"
EXCLUDE="$EXCLUDE --glob=!*marketing-copy*"
EXCLUDE="$EXCLUDE --glob=!*infographic-catalog*"
EXCLUDE="$EXCLUDE --glob=!*mock-results-profiles* --glob=!*demo-adaptive-profiles*"

EXCLUDE="$EXCLUDE --glob=!*home.tsx*"
EXCLUDE="$EXCLUDE --glob=!*upgrade.tsx*"
EXCLUDE="$EXCLUDE --glob=!*subscribe.tsx*"
EXCLUDE="$EXCLUDE --glob=!*onboarding-plan*"
EXCLUDE="$EXCLUDE --glob=!*question-pool*"
EXCLUDE="$EXCLUDE --glob=!*trustShowcase*"
EXCLUDE="$EXCLUDE --glob=!*therapeutic-communication*"
EXCLUDE="$EXCLUDE --glob=!*compare.tsx*"
EXCLUDE="$EXCLUDE --glob=!*pathways.tsx*"
EXCLUDE="$EXCLUDE --glob=!*about.tsx*"
EXCLUDE="$EXCLUDE --glob=!*free-practice*"
EXCLUDE="$EXCLUDE --glob=!*pharmacology-hub*"
EXCLUDE="$EXCLUDE --glob=!*shop*"
EXCLUDE="$EXCLUDE --glob=!*product-builder*"
EXCLUDE="$EXCLUDE --glob=!*trial-landing*"
EXCLUDE="$EXCLUDE --glob=!*qbank-factory*"

EXCLUDE="$EXCLUDE --glob=!*infographic-library*"

EXCLUDE="$EXCLUDE --glob=!*admin-* --glob=!*generator-v2*"

HITS=$(rg --count-matches '\bREx-PN\b' $EXCLUDE client/src shared 2>/dev/null || true)

if [ -n "$HITS" ]; then
  echo "ERROR: Found unscoped 'REx-PN' references in user-facing components:"
  echo "$HITS"
  echo ""
  echo "Use getPracticalNurseExamName(region) or resolveMarketingText() instead."
  echo "If this is a legitimate dual-listing or CA-specific context, add the file to the exclusion list."
  ERRORS=1
fi

if [ "$ERRORS" -eq 1 ]; then
  exit 1
fi

echo "Exam terminology lint passed — no unscoped REx-PN in user-facing components."
