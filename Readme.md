# Student Internship Portal

A full-stack internship management platform where:

- Students can browse internships and apply
- Admins can create and manage job postings
- Applications are reviewed and updated by admins
- Secure authentication with JWT + refresh tokens
- Rate limiting and Redis caching for performance

---

## Features

### Authentication
- JWT-based access tokens
- Refresh token rotation
- Secure cookie handling
- Role-based access (Student / Admin)

### Student
- View active internships
- Apply to jobs
- View and delete own applications

### Admin
- Create and update job postings
- View own jobs
- View applications per job
- Review and update application status

### Performance & Security
- Redis caching for heavy read routes
- Manual cache invalidation on writes
- Rate limiting with Redis
- CORS protection
- Input validation using Zod

---

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Redis
- JWT Authentication
- Zod Validation

### Frontend
- Next.js (App Router, React)
- Tailwind CSS v4 + shadcn/ui-inspired components
- Axios (with automatic token refresh)
- Zod for client-side validation

---

## Project Structure
```
student-internship-portal/
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── models/
│ ├── config/
│ └── server.js
└── frontend/
   ├── app/              # Next.js routes (admin, student, auth)
   ├── components/       # Shared components and UI primitives
   └── lib/              # API client, EdgeStore, utilities
```

---

## Setup

### 1. Backend

See `backend/Readme.md` for full backend setup instructions.

High level:

```bash
cd backend
npm install
npm run dev
```

The API will run at `http://127.0.0.1:3001` (base URL `http://127.0.0.1:3001/api`).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The Next.js app will run at `http://localhost:3000` and is configured to talk to the backend at `http://localhost:3001/api` via `lib/api.ts`.

---

## Phase 2 Roadmap (High-Level)

Planned improvements for the next phase include:

- **Event-driven architecture** for key domain events (e.g. job created, application submitted/updated)
- **Client-side caching** for jobs and applications (React Query/SWR) to reduce latency and improve UX
- Enhanced **observability and logging** for production (structured logs, metrics)
- Additional **UI/UX polish**, accessibility improvements, and admin/student features built on top of the current foundation
