import { defineConfig, devices } from '@playwright/test';

/**
 * 🔄 Concurrency & Load Validation Tests
 *
 * Validates:
 * - Hydration under concurrent load
 * - Navigation timing stability
 * - Degraded-mode UI behavior
 * - Runtime isolation under stress
 * - Cache stability
 *
 * Run: npx playwright test --config=playwright.concurrency.config.ts
 */

export default defineConfig({
  testDir: './tests/concurrency',
  
  // Run tests in parallel with high worker count to simulate load
  fullyParallel: true,
  workers: 10, // Simulate 10 concurrent users
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 1,
  
  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report-concurrency' }],
    ['json', { outputFile: 'reports/concurrency-test-results.json' }],
    ['list'],
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    
    // Collect performance metrics
    navigationTimeout: 30000,
    actionTimeout: 10000,
  },
  
  // Test timeout
  timeout: 60000,
  
  projects: [
    {
      name: 'chromium-concurrent',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // Local dev server (optional)
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
