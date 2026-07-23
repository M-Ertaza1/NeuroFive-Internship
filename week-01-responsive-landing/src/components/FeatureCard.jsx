export default function FeatureCard({ tag, title, description }) {
  return (
    <div className="bg-white rounded-xl border border-ink/10 p-6 hover:border-teal/40 transition-colors">
      <span className="font-mono text-xs text-teal">{tag}</span>
      <h3 className="font-display font-600 text-lg mt-3">{title}</h3>
      <p className="mt-2 text-sm text-ink/60 leading-relaxed">{description}</p>
    </div>
  )
}
