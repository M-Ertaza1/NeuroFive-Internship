export default function Testimonial() {
  return (
    <section id="customers" className="bg-white border-y border-ink/10">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="font-display text-2xl md:text-3xl leading-snug tracking-tight">
          "We deleted our weekly status meeting the second week we switched. The
          board already says everything it used to cover."
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center font-mono text-teal text-sm">
            AR
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">Ayesha R.</p>
            <p className="text-xs text-ink/50">Engineering Lead, small startup team</p>
          </div>
        </div>
      </div>
    </section>
  )
}
