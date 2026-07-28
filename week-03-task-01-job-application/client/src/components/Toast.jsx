export default function Toast({ type, message, onDismiss }) {
  if (!message) return null

  const isError = type === 'error'

  return (
    <div
      className={`toast-enter fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] rounded-lg px-5 py-4 shadow-lg flex items-start justify-between gap-4 ${
        isError ? 'bg-coral text-white' : 'bg-teal text-white'
      }`}
      role="status"
    >
      <div className="flex items-start gap-2">
        <span>{isError ? '⚠️' : '✅'}</span>
        <span className="text-sm">{message}</span>
      </div>
      <button onClick={onDismiss} className="font-bold shrink-0" aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}
