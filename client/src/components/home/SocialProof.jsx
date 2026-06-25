// NOTE: placeholder marketing copy — swap for real stats/testimonials before launch.
const stats = [
  { value: "2,000+", label: "home brewers" },
  { value: "4.9★", label: "average rating" },
  { value: "100%", label: "live cultures" },
];

const testimonials = [
  {
    quote:
      "My first batch came out perfect. The guide made it impossible to mess up.",
    name: "Jordan M.",
  },
  {
    quote:
      "The deluxe kit paid for itself in two weeks of not buying store kombucha.",
    name: "Priya S.",
  },
  {
    quote:
      "Bought the education kit for my classroom — the kids were obsessed.",
    name: "Mr. Alvarez",
  },
];

function SocialProof() {
  return (
    <section className="rounded-3xl bg-purple-50 px-6 py-14 sm:px-10">
      <dl className="grid grid-cols-3 gap-4 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="font-display text-3xl font-bold text-purple-700 sm:text-4xl">
              {s.value}
            </dt>
            <dd className="mt-1 text-sm text-gray-600">{s.label}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="rounded-2xl bg-white p-6 shadow-sm">
            <blockquote className="text-gray-700">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-gray-900">
              — {t.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default SocialProof;
