# InstantLocate

> Real-time location verification platform connecting remote users with local captains.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000000.svg)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748.svg)](https://prisma.io)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101.svg)](https://socket.io)

---

## Overview

InstantLocate enables users to create location verification tasks that captains accept, travel to, and complete with photographic evidence. The platform validates physical proximity using the **Haversine formula** before allowing evidence submission.

### Key Features

- **JWT Authentication** with bcrypt password hashing
- **Role-Based Access Control** (User / Captain roles)
- **Real-time WebSocket tracking** via Socket.IO
- **GPS Validation** — Haversine formula ensures captain is within 100m
- **File Upload** — Multer with image validation (JPG/PNG, 5MB max)
- **Atomic Transactions** — Race-condition-safe task acceptance
- **Interactive Maps** — React-Leaflet with OpenStreetMap tiles

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS v4, React Router, TanStack Query |
| Backend | Express 5, TypeScript, Socket.IO, Prisma 6, Zod |
| Database | Neon PostgreSQL |
| Auth | JWT, bcrypt |
| Maps | React-Leaflet, OpenStreetMap |
| Upload | Multer |

---

## Architecture

```
┌─────────────┐          ┌────────────────┐          ┌──────────────┐
│   React UI  │──REST───▶│  Express API   │──Prisma─▶│  Neon Postgres│
│  + Leaflet  │◀──WS────│  + Socket.IO   │          │              │
└─────────────┘          └────────────────┘          └──────────────┘
```

---

## Setup

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL project

### 1. Clone & Install

```bash
git clone <repo-url>
cd instantlocate

# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Environment Variables

```bash
# Server
cp ../.env.example server/.env
# Edit server/.env with your Neon connection strings and JWT secret
```

### 3. Database Setup

```bash
cd server
npx prisma db push
npx prisma generate
```

### 4. Run Development

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:3001

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user/captain |
| POST | `/api/auth/login` | Login and receive JWT |

### Tasks
| Method | Endpoint | Description | Role |
|---|---|---|---|
| POST | `/api/tasks` | Create task | USER |
| GET | `/api/tasks` | List tasks | Any |
| GET | `/api/tasks/:id` | Get task details | Any |
| POST | `/api/tasks/:id/accept` | Accept task | CAPTAIN |
| POST | `/api/tasks/:id/start` | Start task | CAPTAIN |
| POST | `/api/tasks/:id/submit` | Submit evidence | CAPTAIN |
| POST | `/api/tasks/:id/complete` | Mark complete | USER |

### WebSocket Events
| Event | Direction | Description |
|---|---|---|
| `captain:location:update` | Client → Server | Captain GPS update |
| `captain:location:updated` | Server → Client | Broadcasted position |
| `task:accepted` | Server → Client | Task was accepted |
| `task:started` | Server → Client | Task was started |
| `task:submitted` | Server → Client | Evidence submitted |

---

## License

MIT
