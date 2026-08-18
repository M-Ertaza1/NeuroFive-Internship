export default function Filters({ options, filters, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-ink/10 p-4 flex flex-wrap gap-4 items-end">
      <div>
        <label className="text-xs font-medium text-ink/50 block mb-1">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="border border-ink/15 rounded-lg px-3 py-2 text-sm focus:border-teal transition-colors"
        >
          <option value="">All categories</option>
          {options.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-ink/50 block mb-1">Region</label>
        <select
          value={filters.region}
          onChange={(e) => onChange({ ...filters, region: e.target.value })}
          className="border border-ink/15 rounded-lg px-3 py-2 text-sm focus:border-teal transition-colors"
        >
          <option value="">All regions</option>
          {options.regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-ink/50 block mb-1">From</label>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => onChange({ ...filters, from: e.target.value })}
          className="border border-ink/15 rounded-lg px-3 py-2 text-sm focus:border-teal transition-colors"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-ink/50 block mb-1">To</label>
        <input
          type="date"
          value={filters.to}
          onChange={(e) => onChange({ ...filters, to: e.target.value })}
          className="border border-ink/15 rounded-lg px-3 py-2 text-sm focus:border-teal transition-colors"
        />
      </div>

      {(filters.category || filters.region || filters.from || filters.to) && (
        <button
          onClick={() => onChange({ category: '', region: '', from: '', to: '' })}
          className="text-sm font-semibold text-coral hover:underline mb-0.5"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
