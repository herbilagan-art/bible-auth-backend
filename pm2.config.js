module.exports = {
  apps: [
    {
      name: "bible-auth-backend",
      script: "server.js",
      instances: 1,              // keep it single instance on Render
      autorestart: true,
      watch: false,              // disable watch in production
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};