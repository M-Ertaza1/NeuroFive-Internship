export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a movie..."
        aria-label="Search for a movie"
        className="w-full bg-white border border-ink/15 rounded-lg px-5 py-3.5 pr-12 text-base focus:border-teal transition-colors"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 font-mono text-sm">
        ⌕
      </span>
    </div>
  )
}
