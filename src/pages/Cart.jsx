import { useState } from 'react'
import { Link } from 'react-router'
import { useCart } from '../context/CartContext.jsx'
import { productTitle, formatPrice } from '../lib/format.js'

function Cart() {
  const { items, subtotal, count, removeItem, setQty } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState(null)

  async function handleCheckout() {
    setCheckingOut(true)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.product.id, qty: i.qty })),
        }),
      })
      if (!res.ok) throw new Error('Checkout failed')
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
        <p className="mt-2 text-gray-600">Your cart is empty.</p>
        <Link to="/" className="mt-4 inline-block text-purple-700 hover:underline">
          ← Browse products
        </Link>
      </section>
    )
  }

  return (
    <section className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900">
        Your cart ({count})
      </h1>

      <ul className="mt-6 divide-y divide-gray-200">
        {items.map(({ product, qty }) => (
          <li key={product.id} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-900">
                {productTitle(product.name)}
              </p>
              <p className="text-sm text-gray-500">{formatPrice(product.price)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={qty}
                onChange={(e) => setQty(product.id, Number(e.target.value))}
                className="w-16 rounded-md border border-gray-300 px-2 py-1 text-right"
                aria-label={`Quantity for ${productTitle(product.name)}`}
              />
              <span className="w-20 text-right font-medium text-gray-900">
                {formatPrice(product.price * qty)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(product.id)}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-lg font-semibold text-gray-900">Subtotal</span>
        <span className="text-lg font-bold text-gray-900">{formatPrice(subtotal)}</span>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={checkingOut}
        className="mt-6 w-full rounded-md bg-purple-700 px-4 py-3 font-medium text-white hover:bg-purple-800 disabled:opacity-60"
      >
        {checkingOut ? 'Redirecting…' : 'Checkout'}
      </button>
    </section>
  )
}

export default Cart
