import { Link } from "react-router";

const values = [
  {
    emoji: "🌱",
    title: "Live & natural",
    text: "Real SCOBYs and live cultures — never powders or shortcuts.",
  },
  {
    emoji: "🧪",
    title: "Beginner-friendly",
    text: "Clear, foolproof guides so your very first batch actually works.",
  },
  {
    emoji: "♻️",
    title: "Less waste",
    text: "Reusable kits and refill packs mean fewer cans and bottles.",
  },
  {
    emoji: "🎉",
    title: "Brewing is a party",
    text: "Fermentation is fun. We make it social, colorful, and a little fizzy.",
  },
];

function About() {
  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 px-6 py-20 text-center text-white sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <span className="absolute left-10 top-12 h-16 w-16 rounded-full bg-white/20 blur-md" />
          <span className="absolute right-16 bottom-10 h-24 w-24 rounded-full bg-lime-300/30 blur-lg" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold tracking-wide backdrop-blur">
            🫧 Our story
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Kombucha for everyone
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
            We started Kombucha Party because brewing your own should be simple,
            affordable, and genuinely fun — not a science experiment gone wrong.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
          Why we do it
        </h2>
        <div className="mt-5 space-y-4 text-gray-700">
          <p>
            Store-bought kombucha is delicious — and expensive. After years of
            brewing in our own kitchens, we realized the only thing standing
            between most people and endless homemade booch was a good kit and a
            guide that didn’t assume a chemistry degree.
          </p>
          <p>
            So we packaged everything you need — a healthy SCOBY, starter tea,
            and step-by-step instructions — into kits anyone can use. Today
            thousands of home brewers pop the top on their own batches every
            week, and we couldn’t be prouder.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="rounded-3xl bg-purple-50 px-6 py-14 sm:px-10">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            What we believe
          </h2>
          <p className="mt-2 text-gray-600">
            The principles behind every kit we ship.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl bg-white p-6 text-center shadow-sm"
            >
              <div className="text-4xl">{v.emoji}</div>
              <h3 className="mt-3 font-display text-xl font-semibold text-gray-900">
                {v.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 to-fuchsia-600 px-6 py-14 text-center text-white sm:px-12">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Ready to start brewing?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-white/90">
          Grab a kit and join thousands of home brewers making their own fizzy
          kombucha.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-block rounded-full bg-white px-7 py-3 font-semibold text-purple-700 shadow-lg transition hover:bg-purple-50"
        >
          Shop all kits
        </Link>
      </section>
    </div>
  );
}

export default About;
