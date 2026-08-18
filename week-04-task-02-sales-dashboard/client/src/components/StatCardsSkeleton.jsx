export default function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-ink/10 p-5">
          <div className="h-3 w-24 rounded skeleton" />
          <div className="h-7 w-32 rounded skeleton mt-3" />
        </div>
      ))}
    </div>
  )
}
