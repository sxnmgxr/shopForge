import { defineConfig, devices } from '@playwright/test';
// dotenv import removed since types were missing in build environment
// any needed env vars should be provided by the calling environment

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,

  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup — create test user
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },
    // Tests that require login
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: '**/auth.setup.ts',
    },
    // Tests without login
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/public/**/*.spec.ts',
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: '**/public/**/*.spec.ts',
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: '**/public/**/*.spec.ts',
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
