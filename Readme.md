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

### Frontend (Upcoming)
- Next.js (Server Components)
- Tailwind CSS
- Cookie-based auth

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
└── frontend/ (Coming soon)
```

---

## Setup

See `backend/README.md` for backend setup instructions.

Frontend will be added in the next phase.