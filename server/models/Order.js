import mongoose from "mongoose";

// Line items denormalize the product name and price at purchase time — an order
// must show what the customer actually paid, not today's catalogue price.
const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // unit price in cents
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "An order must have at least one item",
    },
  },
  total: { type: Number, required: true }, // cents
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "refunded"],
    default: "paid",
  },
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.model("Order", orderSchema);
