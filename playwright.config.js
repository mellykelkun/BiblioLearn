const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({ testDir: './tests/browser', timeout: 30000, workers: 2,
  use: { baseURL: 'http://127.0.0.1:3100', headless: true, launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } },
  webServer: { command: 'PORT=3100 node server.js', url: 'http://127.0.0.1:3100', reuseExistingServer: !process.env.CI }
});
