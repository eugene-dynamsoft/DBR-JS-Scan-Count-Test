// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* 30 minutes in milliseconds */
  timeout: 30 * 60 * 1000, 
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report/' + (new Date()).toISOString()}],
    ['line']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    headless: false,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-web-security',
            '--enable-web-rtc'
          ]          
        },
        contextOptions: {
          /* Camera permission */
          permissions: ['camera'],
          ignoreHTTPSErrors: true
        },
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     launchOptions: {
    //       args: [
    //         '--use-fake-device-for-media-stream',
    //         '--use-fake-ui-for-media-stream'
    //       ],
    //       firefoxUserPrefs: {
    //         'permissions.default.camera': 1, // Allow camera access automatically
    //         'media.navigator.streams.fake': true // Use fake streams if needed
    //       }
    //     }
    //   }
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'],
    //     launchOptions: {
    //       args: ['--disable-web-security',
    //         '--enable-web-rtc'
    //       ]          
    //     },
    //    },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:5503',
  //   reuseExistingServer: !process.env.CI,
  // },
});

