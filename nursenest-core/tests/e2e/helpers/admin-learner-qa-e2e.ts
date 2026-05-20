import type { AdminLearnerQaPayloadV1 } from "@/lib/admin/admin-learner-qa-simulation";
import { ADMIN_LEARNER_QA_COOKIE, signAdminLearnerQaCookieValue } from "@/lib/admin/admin-learner-qa-simulation";

export { ADMIN_LEARNER_QA_COOKIE };

/** Build signed `nn_admin_learner_qa` value (same secret rules as production: ADMIN_LEARNER_QA_SECRET or AUTH_SECRET). */
export function buildSignedAdminLearnerQaCookieValue(payload: AdminLearnerQaPayloadV1): string | null {
  return signAdminLearnerQaCookieValue(payload);
}
