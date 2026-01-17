# Backend – Student Internship Portal

This is the backend service for the Student Internship Portal.

---

## Features

- JWT authentication with refresh tokens
- Role-based access (student/admin)
- Rate limiting using Redis
- Redis caching for heavy read endpoints
- MongoDB for data storage
- Zod for request validation

---

## Requirements

- Node.js 18+
- MongoDB
- Redis (Docker recommended)

---

## Environment Variables

Create a `.env` file:
```
PORT =3001
MONGODB_URL=your_mongodb_url
ACCESS_TOKEN_SECRET=your_secreat
REFRESH_TOKEN_SECRET=your_secreat
NODE_ENV=development
```
---

## Redis Setup (Docker)
`docker run -d -p 6379:6379 redis`
If using custom port:
`REDIS_URL=redis://127.0.0.1:6379`
---
## Install & Run
```
npm install
npm run dev

Server will start at: http://127.0.0.1:3001

Health check: GET /health
```
---

## API Routes
### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
```

### student
```
GET /api/student/jobs
POST /api/student/jobs/:id
GET /api/student/applications
DELETE /api/student/applications/:id
```
### Admin
```
POST /api/admin/jobs
PUT /api/admin/jobs/:id
GET /api/admin/jobs
GET /api/admin/applications/:jobid
PATCH /api/admin/applications/:id
```
---

## Rate Limiting

- Implemented using Redis
- Fixed window counter
- Limits requests per IP per time window

---

## Caching Strategy

### Cached Routes

- Student job listing
- Student applications
- Admin job listing
- Admin applications per job

### Cache Invalidation

- New job → clears student & admin job cache
- New application → clears admin applications cache
- Application update → clears student applications cache

---

## Status

Backend is feature-complete and stable.  
Frontend implementation starts next.
