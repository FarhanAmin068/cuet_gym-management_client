// cypress.config.cjs
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/", // Change to your app's URL
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",  // Allow both JS and TS test files
  },
});
