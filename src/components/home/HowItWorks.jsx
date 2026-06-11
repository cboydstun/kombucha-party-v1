const steps = [
  { emoji: '🫖', title: 'Brew', text: 'Steep sweet tea and let it cool — your SCOBY’s favorite meal.' },
  { emoji: '⏳', title: 'Ferment', text: 'Add the culture and wait 7–10 days while the magic happens.' },
  { emoji: '🍓', title: 'Flavor', text: 'Bottle with fruit, ginger, or herbs for a second fizzy fermentation.' },
  { emoji: '🥂', title: 'Enjoy', text: 'Chill, pop the top, and toast to your homemade kombucha.' },
]

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
          How it works
        </h2>
        <p className="mt-2 text-gray-600">From pantry to party in four easy steps.</p>
      </div>

      <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="relative rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <span className="absolute right-4 top-4 font-display text-sm font-bold text-fuchsia-300">
              0{i + 1}
            </span>
            <div className="text-4xl">{step.emoji}</div>
            <h3 className="mt-3 font-display text-xl font-semibold text-gray-900">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default HowItWorks
