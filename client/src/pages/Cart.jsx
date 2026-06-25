import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext.jsx";
import { productTitle, formatPrice } from "../lib/format.js";

function Cart() {
  const { items, subtotal, count, removeItem, setQty } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState(null);

  async function handleCheckout() {
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.product.id, qty: i.qty })),
        }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err.message || "Something went wrong");
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="text-6xl">🧋</div>
        <h1 className="mt-4 font-display text-3xl font-bold text-gray-900">
          Your cart’s feeling empty
        </h1>
        <p className="mt-2 text-gray-600">Add a kit and let’s get brewing.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-purple-700 px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-purple-800"
        >
          Shop all kits
        </Link>
      </section>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
          Your party cart
        </span>{" "}
        <span className="text-gray-400">🎉</span>
      </h1>
      <p className="mt-2 text-gray-600">
        {count} {count === 1 ? "item" : "items"} ready to brew.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <ul className="space-y-4 lg:col-span-2">
          {items.map(({ product, qty }) => (
            <li
              key={product.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex sm:items-center sm:gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 text-2xl"
                >
                  🧋
                </div>
                <div className="min-w-0">
                  <Link
                    to={`/product/${product.slug}`}
                    className="font-display font-semibold text-gray-900 hover:text-purple-700"
                  >
                    {productTitle(product.name)}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatPrice(product.price)} each
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 sm:mt-0 sm:ml-auto">
                {/* Quantity stepper */}
                <div className="flex items-center rounded-full border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setQty(product.id, qty - 1)}
                    aria-label={`Decrease quantity of ${productTitle(product.name)}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-900">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(product.id, qty + 1)}
                    aria-label={`Increase quantity of ${productTitle(product.name)}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <span className="w-20 text-right font-semibold text-gray-900">
                  {formatPrice(product.price * qty)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  aria-label={`Remove ${productTitle(product.name)}`}
                  className="text-sm font-medium text-gray-400 transition hover:text-pink-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Order summary */}
        <aside className="h-fit overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 p-6 text-white shadow-lg lg:sticky lg:top-6">
          <h2 className="font-display text-xl font-bold">Order summary</h2>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/80">Subtotal</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/80">Shipping &amp; taxes</dt>
              <dd className="font-medium">Calculated at checkout</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4">
            <span className="font-display text-lg font-bold">Total</span>
            <span className="font-display text-2xl font-bold">
              {formatPrice(subtotal)}
            </span>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-white/15 px-3 py-2 text-sm">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-6 w-full rounded-full bg-white px-4 py-3 font-semibold text-purple-700 shadow transition hover:bg-purple-50 disabled:opacity-60"
          >
            {checkingOut ? "Redirecting…" : "Checkout →"}
          </button>

          <p className="mt-3 text-center text-xs text-white/70">
            🔒 Secure checkout powered by Stripe
          </p>
          <Link
            to="/products"
            className="mt-4 block text-center text-sm font-medium text-white/90 underline-offset-2 hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
