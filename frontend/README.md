## Frontend – Student Internship Portal

This is the Next.js frontend for the **Student Internship Portal**.  
It provides separate experiences for **students** and **admins** on top of the Express.js backend.

---

## Tech Stack

- **Framework**: Next.js (App Router, React)
- **Styling**: Tailwind CSS v4, shadcn/ui-inspired components
- **Forms & Validation**: Zod
- **HTTP Client**: Axios
- **File Uploads**: EdgeStore (for resume uploads)

---

## Prerequisites

- Node.js **18+**
- Backend running at `http://localhost:3001/api`  
  (see `../backend/Readme.md` for backend setup)

---

## Environment

Create `frontend/.env.local` if needed for your EdgeStore or other frontend-only config.  
The current setup expects the backend at `http://localhost:3001/api` as configured in `lib/api.ts`.

---

## Install & Run (Development)

From the `frontend` directory:

```bash
npm install
npm run dev
```

The app will run at: `http://localhost:3000`

---

## Build & Run (Production)

```bash
npm run build
npm start
```

By default this also runs on `http://localhost:3000`.

---

## Main Routes

### Student
- `GET /student/jobs` – Browse open internships.
- `GET /student/[jobId]` – View job detail and **upload resume** to apply.
- `GET /student/applications` – View and delete own applications.

### Admin
- `GET /admin` – Admin dashboard entry point.
- `GET /admin/jobs` – List jobs you manage and their application counts.
- `GET /admin/jobs/new` – Create and edit jobs in a unified form.
- `GET /admin/jobs/applications/[jobId]` – Review and update application status for a job.

Auth and role-based access are enforced by the backend using JWTs and refresh tokens; this frontend uses Axios with interceptors to attach and refresh access tokens.

---

## Project Structure (Frontend)

Key parts of the `frontend` folder:

```text
frontend/
├── app/
│   ├── admin/                # Admin dashboard and job management
│   ├── student/              # Student-facing pages (jobs, job detail, applications)
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   └── layout.tsx            # Root layout (fonts, providers)
├── components/
│   ├── Navbar.tsx            # Student navbar with logout
│   ├── JobListSkeleton.tsx   # Skeleton for loading job lists
│   └── ui/                   # Reusable UI primitives (card, button, input, alert, badge, skeleton, textarea)
├── lib/
│   ├── api.ts                # Axios instance + typed backend API wrappers
│   ├── edgestore.ts          # EdgeStore provider and hook
│   └── utils.ts              # `cn` helper for className merging
└── app/globals.css           # Tailwind & design tokens
```

---

## Notes for Future (Phase 2)

Phase 2 will focus on:

- Event-driven patterns between backend services
- Client-side data caching (e.g. React Query/SWR) for jobs and applications
- More advanced error handling, toasts, and observability
- Additional admin/student features on top of this foundation

