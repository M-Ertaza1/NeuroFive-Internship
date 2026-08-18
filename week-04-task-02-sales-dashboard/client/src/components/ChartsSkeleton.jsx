export default function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-ink/10 p-5">
          <div className="h-3 w-32 rounded skeleton mb-4" />
          <div className="h-64 rounded skeleton" />
        </div>
      ))}
    </div>
  )
}
