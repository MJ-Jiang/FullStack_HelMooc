const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {},

        baseUrl: 'http://localhost:5173',
        env: {
            BACKEND: 'http://localhost:3001/api',
        },
    },
})
