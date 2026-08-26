import { defineConfig } from '@playwright/test'

// This runs against your already-running dev servers (frontend on 5173,
// backend on 5000) rather than trying to start them itself — simplest setup
// for local development. Start both servers first, then run these tests.
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
})
