# Bible App Backend

Node.js + Express backend for Bible study and journaling tools with Google/Facebook OAuth and MongoDB Atlas.

## Features
- Google and Facebook login via Passport
- JWT-based authentication
- MongoDB Atlas for data persistence
- Render deployment with PM2

## Routes
- `GET /auth/google` → Google login
- `GET /auth/facebook` → Facebook login
- `GET /notes` → Protected route (requires JWT)

## Environment Variables