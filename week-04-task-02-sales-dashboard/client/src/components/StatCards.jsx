function formatCurrency(n) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl border border-ink/10 p-5">
      <p className="text-sm text-ink/50">{label}</p>
      <p className={`mt-2 font-display font-700 text-2xl md:text-3xl ${accent || 'text-ink'}`}>
        {value}
      </p>
    </div>
  )
}

export default function StatCards({ summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Total Revenue" value={formatCurrency(summary.totalRevenue)} accent="text-teal" />
      <StatCard label="Total Orders" value={summary.totalOrders.toLocaleString()} />
      <StatCard label="Avg. Order Value" value={formatCurrency(summary.avgOrderValue)} />
    </div>
  )
}
