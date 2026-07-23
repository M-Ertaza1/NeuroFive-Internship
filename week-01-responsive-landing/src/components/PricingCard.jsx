export default function PricingCard({ name, price, description, features, featured }) {
  return (
    <div
      className={`rounded-xl p-6 flex flex-col ${
        featured
          ? 'bg-ink text-white border border-ink'
          : 'bg-white border border-ink/10'
      }`}
    >
      {featured && (
        <span className="font-mono text-xs text-amber mb-3">MOST TEAMS PICK THIS</span>
      )}
      <h3 className="font-display font-600 text-lg">{name}</h3>
      <p className={`mt-3 text-3xl font-display font-700 ${featured ? '' : 'text-ink'}`}>
        {price}
        <span className={`text-sm font-body font-normal ${featured ? 'text-white/60' : 'text-ink/50'}`}>
          {' '}/ month
        </span>
      </p>
      <p className={`mt-2 text-sm ${featured ? 'text-white/70' : 'text-ink/60'}`}>{description}</p>
      <ul className="mt-6 space-y-2 text-sm flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className={featured ? 'text-teal' : 'text-teal'}>✓</span>
            <span className={featured ? 'text-white/80' : 'text-ink/70'}>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href="#cta"
        className={`mt-6 text-center font-semibold px-5 py-3 rounded-lg transition-colors ${
          featured
            ? 'bg-amber text-ink hover:bg-amber-dark'
            : 'border border-ink/15 hover:border-ink/40'
        }`}
      >
        Choose {name}
      </a>
    </div>
  )
}
