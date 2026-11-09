import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    env: { apiUrl: 'http://127.0.0.1:3002/api' },
  },
  component: {
    specPattern: 'cypress/component/**/*.cy.{js,jsx}',
    supportFile: 'cypress/support/component.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: { server: { port: 0, strictPort: false } },
    },
    video: false,
    screenshotOnRunFailure: true,
  },
});
