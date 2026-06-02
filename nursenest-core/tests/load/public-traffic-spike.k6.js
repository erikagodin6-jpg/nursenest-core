/**
 * k6 load test: Public traffic spike simulation
 * 
 * Simulates sudden traffic spike to public marketing routes.
 * Tests cache efficiency, TTFB, and system stability.
 * 
 * Usage:
 *   k6 run tests/load/public-traffic-spike.k6.js
 *   k6 run --vus 1000 --duration 5m tests/load/public-traffic-spike.k6.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const ttfb = new Trend('time_to_first_byte');
const cacheHitRate = new Rate('cache_hits');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '2m', target: 500 },   // Spike to 500 users
    { duration: '3m', target: 1000 },  // Peak at 1000 users
    { duration: '2m', target: 500 },   // Ramp down
    { duration: '1m', target: 0 },     // Cool down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'], // 95% under 500ms, 99% under 1s
    'http_req_failed': ['rate<0.01'],                  // Less than 1% errors
    'time_to_first_byte': ['p(95)<300'],               // TTFB p95 under 300ms
    'cache_hits': ['rate>0.8'],                        // 80%+ cache hit rate
  },
};

// Test routes (public marketing pages)
const routes = [
  '/',
  '/blog',
  '/pricing',
  '/faq',
  '/about',
  '/how-it-works',
  '/pre-nursing',
  '/allied-health',
  '/lessons',
  '/flashcards',
];

export default function () {
  // Select random route
  const route = routes[Math.floor(Math.random() * routes.length)];
  const url = `${__ENV.BASE_URL || 'http://localhost:3000'}${route}`;
  
  // Make request
  const res = http.get(url, {
    tags: { route },
  });
  
  // Check response
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response has content': (r) => r.body.length > 0,
    'TTFB < 300ms': (r) => r.timings.waiting < 300,
    'total time < 1s': (r) => r.timings.duration < 1000,
  });
  
  // Record metrics
  errorRate.add(!success);
  ttfb.add(res.timings.waiting);
  
  // Check for cache headers
  const cacheHeader = res.headers['X-Cache'] || res.headers['CF-Cache-Status'] || '';
  const isCacheHit = cacheHeader.includes('HIT') || cacheHeader.includes('hit');
  cacheHitRate.add(isCacheHit);
  
  // Realistic user behavior - random think time
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'load-test-results.json': JSON.stringify(data),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '';
  const enableColors = options.enableColors || false;
  
  let summary = '\n';
  summary += `${indent}✓ checks.........................: ${data.metrics.checks.values.passes}/${data.metrics.checks.values.passes + data.metrics.checks.values.fails}\n`;
  summary += `${indent}✓ http_req_duration..............: avg=${data.metrics.http_req_duration.values.avg.toFixed(2)}ms p(95)=${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
  summary += `${indent}✓ time_to_first_byte.............: avg=${data.metrics.time_to_first_byte.values.avg.toFixed(2)}ms p(95)=${data.metrics.time_to_first_byte.values['p(95)'].toFixed(2)}ms\n`;
  summary += `${indent}✓ cache_hits.....................: ${(data.metrics.cache_hits.values.rate * 100).toFixed(1)}%\n`;
  summary += `${indent}✓ errors.........................: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%\n`;
  
  return summary;
}
