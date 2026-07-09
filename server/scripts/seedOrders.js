import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import "dotenv/config";

import connectDB from "../data/database.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

if (process.env.NODE_ENV === "production") {
  console.error("Refusing to seed orders in production.");
  process.exit(1);
}

const products = JSON.parse(
  readFileSync(
    fileURLToPath(
      new URL("../../client/src/data/products.json", import.meta.url),
    ),
    "utf8",
  ),
);

const ORDER_COUNT = 120;
const SPREAD_DAYS = 400; // wide enough that every period window has data
const STATUSES = ["paid", "paid", "paid", "shipped", "delivered", "refunded"];

const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];

function buildItems() {
  // Sample without replacement so an order never lists the same product twice.
  const pool = [...products];
  const count = randInt(1, 3);
  const items = [];

  for (let i = 0; i < count; i++) {
    const [product] = pool.splice(randInt(0, pool.length - 1), 1);
    items.push({
      productId: product.id,
      name: product.name,
      price: Math.round(product.price * 100), // dollars -> cents
      qty: randInt(1, 3),
    });
  }

  return items;
}

async function seed() {
  await connectDB();

  const users = await User.find().select("_id");
  if (users.length === 0) {
    console.error("No users found. Register at least one user before seeding.");
    await mongoose.disconnect();
    process.exit(1);
  }

  // Wipe first so reruns replace rather than accumulate.
  const { deletedCount } = await Order.deleteMany({});

  const orders = Array.from({ length: ORDER_COUNT }, () => {
    const items = buildItems();
    return {
      user: pick(users)._id,
      items,
      // Total is derived from the line items, never randomized on its own.
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      status: pick(STATUSES),
      createdAt: new Date(Date.now() - randInt(0, SPREAD_DAYS) * 86_400_000),
    };
  });

  await Order.insertMany(orders);

  const revenue = orders
    .filter((o) => o.status !== "refunded")
    .reduce((sum, o) => sum + o.total, 0);

  console.log(`Deleted ${deletedCount} existing orders.`);
  console.log(`Inserted ${orders.length} orders across ${users.length} users.`);
  console.log(
    `Non-refunded revenue: $${(revenue / 100).toFixed(2)} across ` +
      `${orders.filter((o) => o.status !== "refunded").length} orders.`,
  );

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
