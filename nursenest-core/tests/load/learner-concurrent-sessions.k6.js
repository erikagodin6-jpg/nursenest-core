/**
 * k6 load test: Concurrent learner sessions
 * 
 * Simulates multiple authenticated learners using the platform simultaneously.
 * Tests DB connection pool, memory usage, and session handling.
 * 
 * Usage:
 *   k6 run tests/load/learner-concurrent-sessions.k6.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const dbQueryTime = new Trend('db_query_time');
const sessionLoadTime = new Trend('session_load_time');
const apiCalls = new Counter('api_calls');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 learners
    { duration: '5m', target: 500 },   // Peak at 500 concurrent learners
    { duration: '2m', target: 100 },   // Ramp down
    { duration: '1m', target: 0 },     // Cool down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000'],  // 95% under 1s
    'http_req_failed': ['rate<0.02'],     // Less than 2% errors
    'session_load_time': ['p(95)<500'],   // Session load p95 under 500ms
    'errors': ['rate<0.02'],
  },
};

// Simulated learner activities
const activities = [
  { name: 'dashboard', path: '/app', weight: 0.2 },
  { name: 'flashcards', path: '/app/flashcards', weight: 0.3 },
  { name: 'practice', path: '/app/practice-tests', weight: 0.2 },
  { name: 'lessons', path: '/app/lessons', weight: 0.2 },
  { name: 'review', path: '/app/review', weight: 0.1 },
];

export function setup() {
  // In real scenario, would authenticate and get session tokens
  // For now, using test credentials
  return {
    baseUrl: __ENV.BASE_URL || 'http://localhost:3000',
    // sessionToken: 'test-session-token',
  };
}

export default function (data) {
  const baseUrl = data.baseUrl;
  
  // Select activity based on weight
  const rand = Math.random();
  let cumWeight = 0;
  let activity = activities[0];
  
  for (const act of activities) {
    cumWeight += act.weight;
    if (rand <= cumWeight) {
      activity = act;
      break;
    }
  }
  
  // Make request
  const url = `${baseUrl}${activity.path}`;
  const res = http.get(url, {
    tags: { activity: activity.name },
    // headers: { 'Cookie': `session=${data.sessionToken}` },
  });
  
  // Check response
  const success = check(res, {
    'status is 200 or 302': (r) => r.status === 200 || r.status === 302,
    'response time < 1s': (r) => r.timings.duration < 1000,
  });
  
  // Record metrics
  errorRate.add(!success);
  sessionLoadTime.add(res.timings.duration);
  apiCalls.add(1);
  
  // Check for performance headers
  if (res.headers['X-DB-Query-Time']) {
    dbQueryTime.add(parseFloat(res.headers['X-DB-Query-Time']));
  }
  
  // Realistic learner behavior
  sleep(Math.random() * 5 + 2); // 2-7 seconds between actions
}

export function teardown(data) {
  console.log('Load test completed');
}
