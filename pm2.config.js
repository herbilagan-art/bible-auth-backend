module.exports = {
  apps: [
    {
      name: 'bible-app-backend',
      script: 'server.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};