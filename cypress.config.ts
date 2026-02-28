import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    allowCypressEnv: true,
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    fixturesFolder: "cypress/fixtures",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
