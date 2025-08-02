// server/ecosystem.config.cjs

module.exports = {
    apps: [
      {
        name: 'mtendere-backend',
        script: './dist/index.js',     // Entry point after build
        instances: 'max',              // Run on all CPU cores (cluster mode)
        exec_mode: 'cluster',          // Use cluster for performance
        watch: false,                  // Set to true in development only
        env: {
          NODE_ENV: 'production',
          PORT: 3000                   // You can change this if needed
        }
      }
    ]
  };
  