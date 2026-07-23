export default function Hero() {
  return (
    <section id="top" className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20">
      <div className="max-w-2xl">
        <span className="inline-block font-mono text-xs tracking-wide text-teal bg-teal-light px-3 py-1 rounded-full mb-6">
          NOW IN BETA
        </span>
        <h1 className="font-display font-700 text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
          Ship work, not status meetings.
        </h1>
        <p className="mt-6 text-lg text-ink/70 max-w-xl">
          FlowBoard turns scattered tasks into a single visible pipeline, so every
          card moves from idea to done without a meeting to explain where it is.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="#cta"
            className="bg-amber text-ink font-semibold px-6 py-3.5 rounded-lg text-center hover:bg-amber-dark transition-colors"
          >
            Start free trial
          </a>
          <a
            href="#product"
            className="border border-ink/15 font-semibold px-6 py-3.5 rounded-lg text-center hover:border-ink/40 transition-colors"
          >
            See how it works
          </a>
        </div>
        <p className="mt-4 text-sm text-ink/50">No credit card. Cancel any time.</p>
      </div>

      {/* Signature element: task cards connected by an animated flow-line,
          visually enacting the product's core idea of one continuous pipeline. */}
      <div className="mt-16 relative">
        <svg
          viewBox="0 0 840 120"
          className="w-full h-auto"
          role="img"
          aria-label="Diagram of a task moving from To Do through In Progress to Done"
        >
          <path
            d="M 10 60 C 150 10, 300 110, 440 60 S 700 10, 830 60"
            fill="none"
            stroke="#1B1F3B"
            strokeOpacity="0.15"
            strokeWidth="2"
            className="flow-line"
          />
          <circle className="flow-dot" r="6" fill="#0EA5A4" />
        </svg>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-6 sm:-mt-10">
          {[
            { stage: 'To Do', task: 'Design onboarding flow', tag: 'UX' },
            { stage: 'In Progress', task: 'Wire up billing webhook', tag: 'API' },
            { stage: 'Done', task: 'Ship landing page copy', tag: 'Content' },
          ].map((card) => (
            <div
              key={card.stage}
              className="bg-white rounded-xl border border-ink/10 p-5 shadow-sm"
            >
              <p className="font-mono text-xs text-ink/40 mb-2">{card.stage.toUpperCase()}</p>
              <p className="font-medium">{card.task}</p>
              <span className="inline-block mt-3 text-xs font-mono bg-canvas px-2 py-1 rounded">
                {card.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
