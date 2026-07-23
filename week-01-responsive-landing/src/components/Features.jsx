import FeatureCard from './FeatureCard'

const features = [
  {
    tag: '01 — VISIBILITY',
    title: 'One pipeline, not five spreadsheets',
    description:
      'Every task lives on one board with a stage, an owner, and a due date. No more asking where something stands.',
  },
  {
    tag: '02 — AUTOMATION',
    title: 'Cards move themselves',
    description:
      'Set a rule once — merged PR moves the card to Done — and stop updating status by hand.',
  },
  {
    tag: '03 — CONTEXT',
    title: 'Comments stay with the work',
    description:
      'Discussion, files, and history live on the card itself, so nothing gets lost in a separate chat thread.',
  },
]

export default function Features() {
  return (
    <section id="product" className="max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-xl mb-12">
        <h2 className="font-display font-700 text-3xl md:text-4xl tracking-tight">
          Built around how work actually moves
        </h2>
        <p className="mt-4 text-ink/70">
          Not a list of features bolted onto a board. Three ideas, executed properly.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  )
}
