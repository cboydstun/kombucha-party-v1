# KombuchaParty.store

An e-commerce store for kombucha products. React + Vite frontend served by an Express backend, with a Stripe checkout flow and a blog.

---

## Project Structure

```
kombucha-party-v1/
├── index.js          # Express server — API + static file serving
├── db.json           # JSON flat-file database (blogs)
├── .env              # Environment variables (not committed)
└── client/           # React + Vite frontend
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── data/
    └── dist/         # Production build output (served by Express)
```

---

## Getting Started

### 1. Install dependencies

```bash
# Backend
npm install

# Frontend
cd client && npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                      | Description                           |
| ----------------------------- | ------------------------------------- |
| `MY_SECRET_TOKEN`             | Bearer token for protected API routes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                |
| `STRIPE_SECRET_KEY`           | Stripe secret key                     |

### 3. Build the frontend

```bash
cd client && npm run build
```

This outputs to `client/dist/`, which Express serves as static files.

### 4. Start the server

```bash
npm run dev
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
| `GET`  | `/blogs`             | List all blog posts   |
| `GET`  | `/blogs/:id`         | Get a blog post by ID |

### Private (requires `Authorization: Bearer <token>`)

| Method   | Path         | Description                  |
| -------- | ------------ | ---------------------------- |
| `POST`   | `/blogs`     | Create a blog post           |
| `PUT`    | `/blogs/:id` | Replace a blog post          |
| `PATCH`  | `/blogs/:id` | Partially update a blog post |
| `DELETE` | `/blogs/:id` | Delete a blog post           |
| `DELETE` | `/blogs`     | Delete all blog posts        |

---

## Deploying to Render

This repo includes a `render.yaml` for one-click deployment as a single web service.

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service → connect your repo
3. Render will auto-detect `render.yaml` and configure the service
4. Add the following env vars in the Render dashboard (marked `sync: false` so they're never committed):
   - `MY_SECRET_TOKEN` — bearer token for protected API routes
   - `STRIPE_SECRET_KEY` — Stripe secret key
   - `VITE_FORMSPREE_KEY` — Formspree form key (used at build time by Vite)
5. Deploy — Render installs deps, builds the React app, and starts Express

> **Note:** `db.json` writes (blog CRUD) will not persist across deploys or service restarts on Render's ephemeral filesystem. Replace with a real database (e.g. Render Postgres, PlanetScale) when you need durability.

---

## Frontend Dev (Vite HMR)

To run the frontend with hot module replacement during development:

```bash
cd client && npm run dev
```

When ready to test with the Express server, run `npm run build` first.
