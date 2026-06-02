/**
 * NurseNest smoke / load test (k6).
 *
 * Usage:
 *   BASE_URL=http://localhost:3000 k6 run tools/loadtest/k6-smoke.js
 *
 * Optional auth (avoid hammering real credentials in shared env):
 *   K6_SESSION_COOKIE='next-auth.session-token=...' k6 run tools/loadtest/k6-smoke.js
 *
 * Requires: https://k6.io/docs/getting-started/installation/
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const failRate = new Rate("failed_requests");

export const options = {
  stages: [
    { duration: "30s", target: 30 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 75 },
    { duration: "1m", target: 75 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<12000"],
    failed_requests: ["rate<0.1"],
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

  let res = http.get(`${BASE}/`, { headers: h });
  failRate.add(
    !check(res, {
      "home 2xx": (r) => r.status >= 200 && r.status < 300,
    }),
  );
  sleep(0.3);

  res = http.get(`${BASE}/api/health/ready`, { headers: h });
  failRate.add(
    !check(res, {
      "ready 2xx": (r) => r.status >= 200 && r.status < 400,
    }),
  );
  sleep(0.2);

  if (COOKIE) {
    res = http.get(`${BASE}/app`, { headers: h, redirects: 0 });
    failRate.add(
      !check(res, {
        "learner shell 2xx/3xx": (r) => r.status >= 200 && r.status < 400,
      }),
    );
    sleep(0.4);

    res = http.get(`${BASE}/app/lessons`, { headers: h, redirects: 0 });
    failRate.add(
      !check(res, {
        "lessons 2xx/3xx": (r) => r.status >= 200 && r.status < 400,
      }),
    );
    sleep(0.3);

    res = http.get(`${BASE}/app/questions`, { headers: h, redirects: 0 });
    failRate.add(
      !check(res, {
        "questions 2xx/3xx": (r) => r.status >= 200 && r.status < 400,
      }),
    );
    sleep(0.3);

    res = http.get(`${BASE}/app/flashcards`, { headers: h, redirects: 0 });
    failRate.add(
      !check(res, {
        "flashcards 2xx/3xx": (r) => r.status >= 200 && r.status < 400,
      }),
    );
    sleep(0.3);

    res = http.get(`${BASE}/app/account/overview`, { headers: h, redirects: 0 });
    failRate.add(
      !check(res, {
        "account 2xx/3xx": (r) => r.status >= 200 && r.status < 400,
      }),
    );
  }

  sleep(0.5 + Math.random() * 0.5);
}
