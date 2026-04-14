# Resort LK — Hotel Management System (MERN)

Full-stack hotel booking and administration platform with JWT authentication, role-based access, MongoDB persistence, and a luxury guest experience inspired by Sri Lankan destinations.

## Stack

- **MongoDB** + **Mongoose**
- **Express.js** REST API (`server/`)
- **React 18** + **Vite** + **React Router** + **Tailwind CSS** (`client/`)
- **JWT** auth, **bcrypt** password hashing, **express-validator** input validation

## Prerequisites

- Node.js 18+
- Local MongoDB (`mongodb://127.0.0.1:27017` by default)

## Quick start

### 1. MongoDB

Start your local MongoDB service (Windows Service, `mongod`, or Docker).

### 2. Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

The API listens on `http://localhost:5000` (configurable via `PORT`).

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to the backend during development.

### Demo accounts (after `npm run seed`)

| Role  | Email            | Password   |
|-------|------------------|------------|
| Admin | admin@resort.lk  | Admin123!  |
| Guest | guest@resort.lk  | Guest123!  |

## Environment variables

### `server/.env`

| Variable       | Description                          |
|----------------|--------------------------------------|
| `PORT`         | API port (default `5000`)            |
| `MONGODB_URI`  | Mongo connection string              |
| `JWT_SECRET`   | Secret for signing tokens            |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`)       |
| `CLIENT_URL`   | CORS origin (default Vite dev URL)   |

### `client/.env` (optional)

`VITE_API_URL` — full API base URL for production (e.g. `https://api.example.com`). Leave unset in development to use the Vite proxy.

## Production build

```bash
cd client
npm run build
```

Serve `client/dist` as static files or deploy to your host. Point `VITE_API_URL` (build-time) to your deployed API and configure `CLIENT_URL` on the server to match the deployed SPA origin.

## Project structure

```
client/          React SPA
server/
  src/
    config/      Database connection
    controllers/ Route handlers
    middleware/  Auth, validation, errors
    models/      Mongoose schemas
    routes/      Express routers
    seed.js      Demo data script
    server.js    Entry point
```

## API overview

- `POST /api/auth/register` — create user (role `user`)
- `POST /api/auth/login` — JWT login
- `GET /api/auth/me` — current user (Bearer token)
- `GET /api/rooms` — public listing + filters (`destination`, `minPrice`, `maxPrice`, `type`, `availableFrom`, `availableTo`, `availableOnly`)
- `GET /api/rooms/:id` — room detail
- `POST /api/bookings` — authenticated booking
- `GET /api/bookings/mine` — user history
- `PATCH /api/bookings/mine/:id/cancel` — guest cancellation
- Admin (Bearer + `role: admin`): room CRUD, booking management, user management (`/api/rooms/admin/all`, `/api/bookings/admin/*`, `/api/users/*`)

## License

MIT — demo / educational use.
