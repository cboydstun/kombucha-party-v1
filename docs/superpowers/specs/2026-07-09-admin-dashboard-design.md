# Admin Dashboard — Design

Date: 2026-07-09
Status: Approved

## Problem

`client/src/pages/admin/AdminDashboard.jsx` is a comment skeleton. It calls for four
eCommerce KPIs (sales revenue, order count, registered users, products offered), a recent
activity feed, and a top-products leaderboard windowed by week/month/quarter/year.

None of this data exists. The server has only `User` and `Blog` models. Orders are never
persisted — Stripe Checkout redirects to a success page and nothing is written to MongoDB.
The product catalogue is a static `client/src/data/products.json`.

There is also no server-side admin guard. `authMiddleware` verifies the JWT but never
inspects `role`, and the token payload is only `{ userId }`. The client's `RequireAdmin`
reads `role` from `localStorage`, which any user can edit. Any admin endpoint added here
must enforce the role on the server.

## Scope

In scope:

- `Order` model and a seed script that populates MongoDB with realistic orders.
- `requireAdmin` middleware backed by a database lookup.
- Two admin stats endpoints.
- A fully built `AdminDashboard.jsx`.
- A real `Sidebar.jsx` (currently `<div>Sidebar</div>`).
- Routes for the existing `admin/Orders.jsx` and `admin/Blogs.jsx` stubs.

Out of scope:

- Stripe webhook order persistence. The seed script stands in for it; wiring the real
  webhook is a separate job, complicated by the checkout function living in `client/api/`
  as a Vercel serverless function rather than in the Express server.
- Building out `admin/Orders.jsx` and `admin/Blogs.jsx` themselves. They are routed and
  reachable but remain stubs.
- Migrating the product catalogue into MongoDB.
- Admin-guarding the blog write routes. Today any registered user can create or delete a
  blog post, because `blogRoutes.js` applies `authMiddleware` without a role check. This is
  a genuine authorization hole, but it predates this work and fixing it is not part of this
  change. It is recorded here so it is not forgotten.

## Data model

`server/models/Order.js`:

```js
const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: (v) => v.length > 0,
  },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "refunded"],
    default: "paid",
  },
  createdAt: { type: Date, default: Date.now, index: true },
});
```

Decisions:

- **Money is stored as integer cents**, both `price` and `total`. Floating-point dollars
  accumulate rounding error under `$sum` aggregation. Stripe already uses cents
  (`unit_amount`), so this matches the existing checkout code. The client divides by 100 at
  render time.
- **`name` and `price` are denormalized onto each line item** rather than looked up by
  `productId` at read time. An order must display what the customer actually paid, not
  today's catalogue price.
- **`createdAt` is indexed.** Every aggregation either filters or sorts on it.
- `productId` is a `Number` because `products.json` uses numeric ids.

## Server

### `server/middleware/requireAdmin.js`

Runs after `authMiddleware`, which populates `req.userData.userId`.

```js
const user = await User.findById(req.userData.userId).select("role");
if (!user || user.role !== "admin")
  return res.status(403).json({ message: "Forbidden" });
```

Returns **403, not 401**: the caller authenticated successfully, they simply lack the role.

A database lookup rather than a JWT role claim, so revoking someone's admin takes effect
immediately instead of waiting out the token's one-hour expiry. Cost is one indexed
`findById` per admin request, which is negligible at this scale.

### `server/controllers/adminController.js`

**`getStats`** — `GET /api/v1/admin/stats`. All figures are all-time and period-independent.

- `totalSales` and `orderCount`: a single `Order.aggregate` with
  `$group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } }`, filtered to
  revenue-bearing statuses (excluding `refunded`).
- `userCount`: `User.countDocuments()`.
- `productCount`: the length of `products.json`, read once at module load with `readFileSync`
  against `../../client/src/data/products.json` — the same file and the same technique
  `client/api/create-checkout-session.js` already uses. Keeps a single source of truth for the
  catalogue.
- `recentOrders`: `Order.find().sort({ createdAt: -1 }).limit(8).populate("user", "username email")`.

Response shape:

```json
{
  "totalSales": 1234567,
  "orderCount": 42,
  "userCount": 17,
  "productCount": 5,
  "recentOrders": [
    {
      "_id": "...",
      "user": { "username": "...", "email": "..." },
      "total": 8998,
      "status": "paid",
      "createdAt": "..."
    }
  ]
}
```

**`getTopProducts`** — `GET /api/v1/admin/stats/top-products?period=week|month|quarter|year`.

Maps `period` to a cutoff date, then aggregates: `$match` on `createdAt >= cutoff`,
`$unwind: "$items"`, `$group` by `items.productId` accumulating `units: { $sum: "$items.qty" }`
and `revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } }`, `$sort` by revenue
descending, `$limit: 5`.

An absent or unrecognized `period` **falls back to `month`** rather than returning an error.

Response shape:

```json
{
  "period": "month",
  "products": [{ "productId": 3, "name": "...", "units": 12, "revenue": 95988 }]
}
```

### `server/routes/adminRoutes.js`

Both routes behind `authMiddleware, requireAdmin`. Mounted in `index.js` as
`app.use("/api/v1/admin", adminRouter)`, alongside the existing routers.

### `server/scripts/seedOrders.js`

Run with `node scripts/seedOrders.js` from `server/`.

- Requires at least one existing `User`; exits with a clear message if the collection is empty.
- Wipes the `orders` collection first, so reruns are idempotent rather than cumulative.
- Generates orders assigned to random users, each with 1–3 random line items drawn from
  `products.json`, random quantities, and a `createdAt` scattered across the last 400 days so
  that every period window (week, month, quarter, year) has data in it.
- `total` is computed from the line items, never randomized independently.
- Guards on `NODE_ENV !== "production"` and refuses to run otherwise.

## Client

### `Sidebar.jsx`

Replaces the `<div>Sidebar</div>` stub. Uses `NavLink` from `react-router` (which supplies
active styling) to link to `/admin/dashboard`, `/admin/orders`, and `/admin/blogs`, plus a
logout action from `useAuth()`.

### `router.jsx`

Adds `admin/orders` and `admin/blogs` as children of the existing `RequireAdmin` route block.

### `AdminDashboard.jsx`

- Two `useEffect` fetches, both sending `Authorization: Bearer ${token}` with the token from
  `useAuth()`. Raw `fetch`, matching the convention in `Login.jsx`, `Blogs.jsx`, and `Cart.jsx`.
  No API helper module is introduced.
- Four KPI cards fed from the stats response. Currency rendered with `Intl.NumberFormat`
  after dividing cents by 100.
- A recent-orders table: customer, total, status, date.
- A top-products leaderboard with a four-button period toggle. Changing the period refetches
  only the leaderboard request; the KPIs and recent orders are untouched.
- Independent loading and error state per section. A failed leaderboard fetch must not blank
  out the KPIs.
- The skeleton's fourth section ("any other relevant admin information or controls") is
  dropped. It is a placeholder for nothing, and the Sidebar already covers navigation to the
  real admin tools.
- Tailwind 4 utility classes, matching the rest of `src/pages`.

## Verification

The project has no test runner (`server`'s `test` script is a stub; `client` has no testing
dependencies), so verification is manual and end-to-end:

1. Run the seed script; note the order count and revenue total it reports.
2. Start the Express server and the Vite dev server.
3. Log in as an admin user and load `/admin/dashboard`. Confirm the KPI figures match what
   the seed script wrote.
4. Cycle the period toggle and confirm the leaderboard changes and that the KPI cards do not
   re-enter a loading state.
5. Call `GET /api/v1/admin/stats` with a **non-admin** user's token and confirm it returns 403. This is the check that matters most: the client-side `RequireAdmin` guard is
   spoofable via `localStorage`, so the server must reject the request on its own.
6. Call the same endpoint with no `Authorization` header and confirm 401.
