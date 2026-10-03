import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'verification/e2e-results.json' }]],
  use: { baseURL: process.env.BASE_URL || 'http://127.0.0.1:42863/chemiosmosis-atp-explorer/', channel: process.env.CI ? undefined : 'chrome', trace: 'retain-on-failure' },
  webServer: process.env.BASE_URL ? undefined : { command: 'npm run preview -- --host 127.0.0.1 --port 42863 --strictPort', url: 'http://127.0.0.1:42863/chemiosmosis-atp-explorer/', reuseExistingServer: !process.env.CI },
})

