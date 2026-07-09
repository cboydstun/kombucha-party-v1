import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import Order from "../models/Order.js";
import User from "../models/User.js";

// The catalogue is a static file, not a collection. Read it from the same place
// the Stripe checkout function does so there is one source of truth.
const products = JSON.parse(
  readFileSync(
    fileURLToPath(
      new URL("../../client/src/data/products.json", import.meta.url),
    ),
    "utf8",
  ),
);

// Revenue figures ignore refunded orders.
const REVENUE_STATUSES = { status: { $ne: "refunded" } };

const PERIOD_DAYS = { week: 7, month: 30, quarter: 90, year: 365 };
const DEFAULT_PERIOD = "month";

// GET /api/v1/admin/stats - ADMIN
export async function getStats(req, res) {
  try {
    const [totals, userCount, recentOrders] = await Promise.all([
      Order.aggregate([
        { $match: REVENUE_STATUSES },
        {
          $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } },
        },
      ]),
      User.countDocuments(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("user", "username email"),
    ]);

    res.status(200).json({
      totalSales: totals[0]?.total ?? 0,
      orderCount: totals[0]?.count ?? 0,
      userCount,
      productCount: products.length,
      recentOrders,
    });
  } catch {
    res.status(500).json({ error: "Failed to load stats" });
  }
}

// GET /api/v1/admin/stats/top-products?period=week|month|quarter|year - ADMIN
export async function getTopProducts(req, res) {
  try {
    // An unrecognized period falls back rather than erroring. hasOwn, not a
    // plain lookup: "__proto__" and "constructor" resolve up the prototype
    // chain, which would pass a truthiness check and yield a NaN cutoff.
    const period = Object.hasOwn(PERIOD_DAYS, req.query.period ?? "")
      ? req.query.period
      : DEFAULT_PERIOD;
    const cutoff = new Date(Date.now() - PERIOD_DAYS[period] * 86_400_000);

    const rows = await Order.aggregate([
      { $match: { ...REVENUE_STATUSES, createdAt: { $gte: cutoff } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          units: { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: { _id: 0, productId: "$_id", name: 1, units: 1, revenue: 1 },
      },
    ]);

    res.status(200).json({ period, products: rows });
  } catch {
    res.status(500).json({ error: "Failed to load top products" });
  }
}
