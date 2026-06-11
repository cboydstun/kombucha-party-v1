import { useState } from 'react'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Local-only: there is no mailing-list backend wired up yet, so we just
  // acknowledge the submission client-side.
  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-6 py-14 text-center text-white sm:px-12">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">
        Join the party
      </h2>
      <p className="mx-auto mt-2 max-w-md text-white/90">
        Get brewing tips, new flavor ideas, and the occasional discount in your
        inbox.
      </p>

      {subscribed ? (
        <p className="mt-8 font-display text-xl font-semibold">
          Thanks for subscribing! 🎉
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="flex-1 rounded-full border-0 px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="rounded-full bg-white px-7 py-3 font-semibold text-purple-700 transition hover:bg-purple-50"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  )
}

export default Newsletter
