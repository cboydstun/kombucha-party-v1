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

| Variable | Description |
|---|---|
| `MY_SECRET_TOKEN` | Bearer token for protected API routes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |

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

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/howdy?name=string` | Returns a greeting |
| `GET` | `/blogs` | List all blog posts |
| `GET` | `/blogs/:id` | Get a blog post by ID |

### Private (requires `Authorization: Bearer <token>`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/blogs` | Create a blog post |
| `PUT` | `/blogs/:id` | Replace a blog post |
| `PATCH` | `/blogs/:id` | Partially update a blog post |
| `DELETE` | `/blogs/:id` | Delete a blog post |
| `DELETE` | `/blogs` | Delete all blog posts |

---

## Frontend Dev (Vite HMR)

To run the frontend with hot module replacement during development:

```bash
cd client && npm run dev
```

When ready to test with the Express server, run `npm run build` first.
