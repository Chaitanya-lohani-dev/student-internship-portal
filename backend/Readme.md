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
```env
PORT=3001
MONGODB_URL=your_mongodb_url
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=development

# Optional – if Redis is not on localhost:6379
# REDIS_URL=redis://127.0.0.1:6379
```
---

## Redis Setup (Docker)

Run Redis locally with Docker:
```bash
docker run -d -p 6379:6379 redis
```

If using a custom port or remote instance, set:

```env
REDIS_URL=redis://127.0.0.1:6379
```
---
## Install & Run

```bash
npm install
npm run dev
```

- Server will start at: `http://127.0.0.1:3001`
- Base API URL: `http://127.0.0.1:3001/api`
- Health check: `GET /health`
---

## API Routes
### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
```

### Student
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

Backend is **feature-complete and stable** and is used in production by the Next.js frontend in `frontend/`.

