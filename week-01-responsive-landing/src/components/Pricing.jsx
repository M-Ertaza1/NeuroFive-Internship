import PricingCard from './PricingCard'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'For individuals trying FlowBoard out.',
    features: ['1 board', 'Up to 3 teammates', 'Basic automation'],
  },
  {
    name: 'Team',
    price: '$12',
    description: 'For teams shipping every week.',
    features: ['Unlimited boards', 'Up to 20 teammates', 'Full automation rules', 'Priority support'],
    featured: true,
  },
  {
    name: 'Scale',
    price: '$29',
    description: 'For growing orgs with multiple teams.',
    features: ['Everything in Team', 'Unlimited teammates', 'Admin controls', 'SSO'],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-xl mb-12">
        <h2 className="font-display font-700 text-3xl md:text-4xl tracking-tight">
          Simple pricing, no surprise seats
        </h2>
        <p className="mt-4 text-ink/70">Start free. Upgrade only when the team grows.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <PricingCard key={p.name} {...p} />
        ))}
      </div>
    </section>
  )
}
