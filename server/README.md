# KombuchaParty.store

An e-commerce store for kombucha products. React + Vite frontend served by an Express backend, with MongoDB-backed auth + blog, a Stripe checkout flow, and a contact form.

---

## Project Structure

```
kombucha-party-v1/
├── server/           # Express 5 API + static host (ESM)
│   ├── index.js      # Server entry — serves client/dist + /api/v1 routes
│   ├── controllers/  # health, blog, auth
│   ├── models/       # Mongoose models: User, Blog
│   ├── middleware/   # authMiddleware — verifies JWT
│   ├── routes/       # health, blog, auth routers
│   └── data/         # database.js — Mongoose connection
└── client/           # React 19 + Vite frontend
    ├── src/          # pages/, components/, context/, data/
    ├── api/          # Vercel serverless functions (Stripe checkout)
    └── dist/         # Production build (served by Express)
```

---

## Getting Started

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure the server environment

Copy `server/.env.example` to `server/.env` and fill in the values:

```bash
cd server && cp .env.example .env
```

| Variable      | Description                              |
| ------------- | ---------------------------------------- |
| `PORT`        | Server port (default `8080`)             |
| `MONGODB_URI` | MongoDB connection string (e.g. Atlas)   |
| `JWT_SECRET`  | Secret used to sign and verify auth JWTs |

Stripe checkout runs as a Vercel serverless function (`client/api/`) and reads
`STRIPE_SECRET_KEY` from the client deployment's environment.

### 3. Build the frontend

```bash
cd client && npm run build
```

Outputs to `client/dist/`, which Express serves as static files.

### 4. Start the server

```bash
cd server && npm run dev
```

Server runs on [http://localhost:8080](http://localhost:8080).

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Public

| Method | Path                 | Description           |
| ------ | -------------------- | --------------------- |
| `GET`  | `/health`            | Health check          |
| `GET`  | `/howdy?name=string` | Returns a greeting    |
| `POST` | `/auth/register`     | Register a user       |
| `POST` | `/auth/login`        | Log in, returns a JWT |
| `GET`  | `/blogs`             | List all blog posts   |
| `GET`  | `/blogs/:id`         | Get a blog post by ID |

### Private (requires `Authorization: Bearer <jwt>`)

Obtain the JWT from `POST /auth/login`.

| Method   | Path         | Description                  |
| -------- | ------------ | ---------------------------- |
| `POST`   | `/blogs`     | Create a blog post           |
| `PUT`    | `/blogs/:id` | Replace a blog post          |
| `PATCH`  | `/blogs/:id` | Partially update a blog post |
| `DELETE` | `/blogs/:id` | Delete a blog post           |
| `DELETE` | `/blogs`     | Delete all blog posts        |

---

## Deploying to Render

`render.yaml` deploys the server as a single web service that serves both the
built React app and the API. Placed at the repo root (Render auto-detects it
there).

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint → connect your repo
3. Render reads `render.yaml` and configures the service
4. Add these env vars in the dashboard (marked `sync: false`, never committed):
   - `MONGODB_URI` — MongoDB connection string
   - `JWT_SECRET` — JWT signing secret
   - `STRIPE_SECRET_KEY` — Stripe secret key (if serving checkout from here)

---

## Frontend Dev (Vite HMR)

```bash
cd client && npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8080`, so run the
Express server alongside it. When ready to test the production bundle, run
`npm run build` and let Express serve `client/dist`.
