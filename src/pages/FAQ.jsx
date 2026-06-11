import { useState } from "react";
import { Link } from "react-router";

const faqs = [
  {
    q: "Do I need any experience to brew kombucha?",
    a: "Not at all. Every kit comes with a step-by-step guide written for first-time brewers — if you can make a pot of sweet tea, you can make kombucha.",
  },
  {
    q: "What exactly is a SCOBY?",
    a: "SCOBY stands for Symbiotic Culture Of Bacteria and Yeast. It’s the living culture that ferments your sweet tea into kombucha. Each of our kits ships with a healthy, active SCOBY.",
  },
  {
    q: "How long does a batch take?",
    a: "Most batches ferment in 7–10 days, depending on your kitchen’s temperature. A second flavoring fermentation adds another 1–3 days for fizz.",
  },
  {
    q: "Is the SCOBY shipped alive?",
    a: "Yes. Your SCOBY travels in starter liquid that keeps it healthy in transit. Brew your first batch within a week or two of arrival for best results.",
  },
  {
    q: "Can I reuse the kit?",
    a: "Absolutely — that’s the point. Your SCOBY grows with every batch, and our Refill & Flavor Pack restocks the tea and sugar so you can keep brewing indefinitely.",
  },
  {
    q: "What if my brew doesn’t work out?",
    a: "Reach out and we’ll help troubleshoot. If your culture arrives unhealthy, we’ll replace it — we want your first batch to be a success.",
  },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-lg font-semibold text-gray-900">
          {item.q}
        </span>
        <span
          className={`shrink-0 text-xl text-purple-600 transition-transform ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && <p className="px-6 pb-6 text-gray-700">{item.a}</p>}
    </div>
  );
}

function FAQ() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 px-6 py-16 text-center text-white sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <span className="absolute right-12 top-10 h-20 w-20 rounded-full bg-lime-300/30 blur-lg" />
          <span className="absolute left-10 bottom-8 h-14 w-14 rounded-full bg-white/20 blur-md" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold tracking-wide backdrop-blur">
            ❓ Frequently asked
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Questions? We’ve got you
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
            Everything you need to know about brewing with our kits.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="mx-auto max-w-2xl space-y-4">
        {faqs.map((item) => (
          <FaqItem key={item.q} item={item} />
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-2xl rounded-3xl bg-purple-50 px-6 py-12 text-center">
        <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
          Still have questions?
        </h2>
        <p className="mt-2 text-gray-600">
          We’re happy to help you get brewing.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-block rounded-full bg-purple-700 px-7 py-3 font-semibold text-white transition hover:bg-purple-800"
        >
          Contact us
        </Link>
      </section>
    </div>
  );
}

export default FAQ;
