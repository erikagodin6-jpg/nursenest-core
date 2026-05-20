import type { NextRequest } from "next/server";
import { TRIAL_DEVICE_COOKIE } from "@/lib/trial/trial-constants";

/** Optional; clients may send the same opaque id as the HttpOnly `nn_device_fp` cookie for correlation. */
export const NN_DEVICE_ID_HEADER = "x-nn-device-id";

export function readDeviceRequestContext(req: NextRequest): {
  cookieValue: string | null;
  headerValue: string | null;
  mismatch: boolean;
} {
  const cookieValue = req.cookies.get(TRIAL_DEVICE_COOKIE)?.value ?? null;
  const headerValue = req.headers.get(NN_DEVICE_ID_HEADER)?.trim() || null;
  const mismatch = Boolean(cookieValue && headerValue && cookieValue !== headerValue);
  return { cookieValue, headerValue, mismatch };
}
