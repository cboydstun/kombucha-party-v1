import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import Stripe from 'stripe'

// Load the catalogue server-side so prices come from a trusted source — the
// client only sends product ids and quantities, never prices.
const products = JSON.parse(
  readFileSync(fileURLToPath(new URL('../src/data/products.json', import.meta.url)), 'utf8'),
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured' })
  }

  try {
    const stripe = new Stripe(secret)
    const { items } = req.body || {}

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    const line_items = items.map(({ id, qty }) => {
      const product = products.find((p) => p.id === id)
      if (!product) throw new Error(`Unknown product id: ${id}`)
      const quantity = Math.max(1, Math.floor(Number(qty) || 1))
      return {
        quantity,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(product.price * 100),
          product_data: { name: product.name, description: product.description },
        },
      }
    })

    const origin = req.headers.origin || `https://${req.headers.host}`
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Checkout failed' })
  }
}
