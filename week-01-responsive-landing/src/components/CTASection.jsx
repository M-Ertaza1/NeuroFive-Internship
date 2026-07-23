export default function CTASection() {
  return (
    <section id="cta" className="max-w-6xl mx-auto px-6 py-20">
      <div className="bg-ink rounded-2xl px-8 py-16 text-center">
        <h2 className="font-display font-700 text-3xl md:text-4xl text-white tracking-tight">
          Put your next task on the board.
        </h2>
        <p className="mt-4 text-white/70 max-w-md mx-auto">
          Free for up to 3 teammates. No credit card needed to start.
        </p>
        <a
          href="#"
          className="mt-8 inline-block bg-amber text-ink font-semibold px-8 py-3.5 rounded-lg hover:bg-amber-dark transition-colors"
        >
          Start free trial
        </a>
      </div>
    </section>
  )
}
