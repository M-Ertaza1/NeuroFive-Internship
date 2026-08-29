export default function SearchFilterBar({ filters, onChange, members }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="text"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        placeholder="Search tasks…"
        aria-label="Search tasks"
        className="border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2 text-sm flex-1 min-w-[160px] focus:border-teal transition-colors"
      />
      <select
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        aria-label="Filter by priority"
        className="border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        value={filters.assignee}
        onChange={(e) => onChange({ ...filters, assignee: e.target.value })}
        aria-label="Filter by assignee"
        className="border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Everyone</option>
        {members.map((m) => (
          <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
        ))}
      </select>
      {(filters.search || filters.priority || filters.assignee) && (
        <button
          onClick={() => onChange({ search: '', priority: '', assignee: '' })}
          className="text-sm font-semibold text-coral hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  )
}
