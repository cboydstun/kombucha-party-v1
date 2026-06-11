import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useCart } from '../context/CartContext.jsx'

function Success() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const { clear } = useCart()

  // Clear the cart once we land on the confirmation page after a successful
  // Stripe redirect.
  useEffect(() => {
    if (sessionId) clear()
  }, [sessionId, clear])

  return (
    <section className="max-w-xl text-center">
      <h1 className="text-3xl font-bold text-gray-900">Thank you! 🎉</h1>
      <p className="mt-3 text-gray-600">
        Your order is confirmed. A receipt is on its way to your email.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-purple-700 px-4 py-2 font-medium text-white hover:bg-purple-800"
      >
        Continue shopping
      </Link>
    </section>
  )
}

export default Success
