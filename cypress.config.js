const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://news.ycombinator.com',
        specPattern: 'cypress/e2e/**/*.spec.js',
        supportFile: 'cypress/support/commands.js'
    }
});
