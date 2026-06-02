/**
 * Horizontal scaling / App Platform load verification (50–100 concurrent scripted users).
 *
 * Usage:
 *   BASE_URL=https://your-app.ondigitalocean.app k6 run tools/loadtest/k6-app-platform-horizontal.js
 *
 * Thresholds: p95 latency < 5s, <1% failures on probed routes (tune for staging).
 * Does NOT prove autoscale 2→3 (that requires DO metrics + CPU spike) — use alongside CPU load or DO dashboard.
 *
 * Optional session (reduces 401 noise on /app):
 *   K6_SESSION_COOKIE='next-auth.session-token=...' k6 run ...
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const failRate = new Rate("failed_checks");

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<5000"],
    failed_checks: ["rate<0.05"],
  },
};

const BASE = __ENV.BASE_URL || "http://127.0.0.1:3000";
const COOKIE = __ENV.K6_SESSION_COOKIE || "";

function headers() {
  const h = { Accept: "text/html,application/json" };
  if (COOKIE) h.Cookie = COOKIE;
  return h;
}

export default function () {
  const h = headers();

  let res = http.get(`${BASE}/healthz`, { headers: h });
  failRate.add(
    !check(res, {
      "healthz 200": (r) => r.status === 200,
    }),
  );
  sleep(0.15);

  res = http.get(`${BASE}/api/health`, { headers: h });
  failRate.add(
    !check(res, {
      "api health 2xx": (r) => r.status >= 200 && r.status < 300,
    }),
  );
  sleep(0.1);

  res = http.get(`${BASE}/api/health/ready`, { headers: h });
  failRate.add(
    !check(res, {
      "ready 2xx or 503": (r) => (r.status >= 200 && r.status < 300) || r.status === 503,
    }),
  );
  sleep(0.15);

  res = http.get(`${BASE}/`, { headers: h });
  failRate.add(
    !check(res, {
      "home 2xx": (r) => r.status >= 200 && r.status < 400,
    }),
  );
  sleep(0.2);

  res = http.get(`${BASE}/api/public/home-stats`, { headers: h });
  failRate.add(
    !check(res, {
      "home-stats 2xx": (r) => r.status >= 200 && r.status < 300,
    }),
  );
  sleep(0.15);

  if (COOKIE) {
    res = http.get(`${BASE}/app`, { headers: h, redirects: 0 });
    failRate.add(
      !check(res, {
        "app shell 2xx/3xx": (r) => r.status >= 200 && r.status < 400,
      }),
    );
    sleep(0.2);
  }

  sleep(0.1);
}
