# 🔥 Habit Tracker with Streaks

[![CI](https://github.com/Kishanfdt/Habbit-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/Kishanfdt/Habbit-Tracker/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack habit tracking application engineered to measure streaks in **user-local calendar days** rather than raw elapsed hours. Build positive habits, log daily check-ins, backfill missed entries, and track long-term consistency with precision. Powered by Node.js, Express, Mongoose, MongoDB / MongoDB Atlas, React, and TypeScript.

Repository: [https://github.com/Kishanfdt/Habbit-Tracker](https://github.com/Kishanfdt/Habbit-Tracker)

---

## 🎯 Core Requirement & Business Logic

A streak is defined by consecutive **calendar days in the user's local timezone**, not by 24-hour elapsed windows.
- Two check-ins 20 hours apart may fall on separate local days (incrementing the streak) or on the same local day (rejected as duplicate).
- MongoDB compound unique index (`{ habit_id: 1, local_date: 1 }`) strictly guarantees at most **one check-in per habit per local day**.

### ⏰ Worked Example (`Asia/Kolkata`, UTC+05:30)

| Action | UTC Timestamp | Local Time (IST) | Local Date | Result |
| :--- | :--- | :--- | :--- | :--- |
| Check-in A | `2026-03-10T14:30:00Z` | `2026-03-10 20:00` | `2026-03-10` | **Streak: 1** |
| Check-in B | `2026-03-11T10:30:00Z` | `2026-03-11 16:00` | `2026-03-11` | **Streak: 2** (20 hrs later, next local day) |
| Check-in C | `2026-03-11T21:30:00Z` | `2026-03-12 03:00` | `2026-03-12` | **Streak: 3** (11 hrs later, new local day) |
| Check-in D | `2026-03-12T17:30:00Z` | `2026-03-12 23:00` | `2026-03-12` | **Rejected** (Same local day) |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (TypeScript) built with Vite
- **Styling**: Tailwind CSS
- **State & Data Fetching**: TanStack React Query + React Context
- **Icons & Dates**: `date-fns` & `date-fns-tz`
- **Testing**: Vitest + React Testing Library

### Backend
- **Runtime & Server**: Node.js, Express, TypeScript (`tsc`)
- **Database & ODM**: MongoDB / MongoDB Atlas via **Mongoose**
- **Validation**: Zod schema validation
- **Authentication**: JWT (`jsonwebtoken`) with `bcryptjs` password hashing
- **Testing**: Jest + Supertest + `mongodb-memory-server`

### DevOps & Orchestration
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (production frontend container)
- **CI/CD**: GitHub Actions

---

## 🍃 MongoDB Atlas Configuration & Setup

### 1. Connection URI Format

Set the `MONGODB_URI` environment variable in your `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/habittracker?retryWrites=true&w=majority
```

### 2. Indexes & Schema Enforcement
Mongoose automatically builds required indexes upon application start:
- **`User` collection**: Unique index on `email`
- **`CheckIn` collection**: Compound unique index on `{ habit_id: 1, local_date: 1 }`

---

## 🚀 Quick Start

### 1. Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose, **OR**
- [Node.js 20+](https://nodejs.org/) & MongoDB instance (or MongoDB Atlas account)

---

### 2. Running with Docker Compose (Recommended)

Start the full stack (MongoDB, Express Backend API, and React Frontend):

```bash
docker compose up --build
```

Access the services:
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)
- **MongoDB**: `localhost:27017`

---

### 3. Manual Local Setup (Development)

#### Step A: Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/habittracker?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

3. Sync database indexes & start development server:
   ```bash
   npm run migrate
   npm run dev
   ```

#### Step B: Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   npm install
   ```

2. Configure environment variables in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Start Vite development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```
.
├── backend/                 # Node.js + Express + Mongoose + TypeScript Backend
│   ├── src/
│   │   ├── config/         # MongoDB database connection & index sync
│   │   ├── controllers/    # Express route controllers
│   │   ├── middleware/     # Auth, error handling, Zod validation
│   │   ├── models/         # Mongoose Schema Models (User, Habit, CheckIn)
│   │   ├── routes/         # REST API routes
│   │   ├── services/       # Core business & streak calculation logic
│   │   ├── types/          # Shared backend TypeScript types
│   │   ├── utils/          # Timezone helpers & date formatters
│   │   └── validators/     # Zod request validation schemas
│   └── tests/              # Jest unit & integration test suites
│
├── frontend/               # React 18 + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/     # UI components (Auth, Habits, Layout)
│   │   ├── context/        # React Auth Context
│   │   ├── hooks/          # React Query custom hooks
│   │   ├── pages/          # Dashboard, Habit Detail, Auth pages
│   │   └── services/       # Axios API client
│   └── vite-env.d.ts       # Vite client ambient type declarations
│
├── .github/workflows/      # GitHub Actions CI workflow
├── docker-compose.yml      # Multi-container orchestration
└── README.md               # Documentation
```

---

## 🔑 REST API Reference

### Authentication
- `POST /api/auth/signup` — Register new user `{ email, password, timezone }`
- `POST /api/auth/login` — Authenticate user `{ email, password }`
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Habits
- `POST /api/habits` — Create a new habit `{ name, description? }`
- `GET /api/habits` — List all user habits with streaks & today's status
- `GET /api/habits/:id` — Get habit detail with check-in history
- `PUT /api/habits/:id` — Update habit details `{ name?, description? }`
- `DELETE /api/habits/:id` — Delete a habit

### Check-ins
- `POST /api/habits/:id/check-ins` — Record check-in `{ date?: "YYYY-MM-DD" }`
- `GET /api/habits/:id/check-ins` — Get check-in history for a habit

---

## 🧪 Testing & Verification

> **Note**: `mongodb-memory-server` downloads a MongoDB binary on the first `npm test` run and requires internet access.

Run tests across both frontend and backend projects:

```bash
# Backend (Type-check & Jest tests with MongoMemoryServer)
cd backend
npm run lint
npm run type-check
npm test

# Frontend (Type-check & Vitest tests)
cd ../frontend
npm run lint
npm run type-check
npm test
npm run build
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
