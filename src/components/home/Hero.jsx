import { Link } from 'react-router'

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 px-6 py-20 text-center text-white sm:px-12 sm:py-28">
      {/* Decorative fizz bubbles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute left-8 top-10 h-16 w-16 rounded-full bg-white/20 blur-md" />
        <span className="absolute right-12 top-24 h-24 w-24 rounded-full bg-lime-300/30 blur-lg" />
        <span className="absolute bottom-10 left-1/4 h-10 w-10 rounded-full bg-white/25 blur-sm" />
        <span className="absolute bottom-16 right-1/4 h-20 w-20 rounded-full bg-pink-200/30 blur-lg" />
        <span className="absolute right-8 bottom-6 h-12 w-12 rounded-full bg-white/20 blur-md" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold tracking-wide backdrop-blur">
          🎉 Live cultures, made at home
        </span>
        <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
          Brew the Party
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
          Everything you need to ferment bold, fizzy kombucha in your own
          kitchen — starter kits, SCOBYs, and flavor packs for every brewer.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/products"
            className="rounded-full bg-white px-7 py-3 font-semibold text-purple-700 shadow-lg transition hover:bg-purple-50"
          >
            Shop all kits
          </Link>
          <a
            href="#how"
            className="rounded-full border border-white/60 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            How it works →
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
