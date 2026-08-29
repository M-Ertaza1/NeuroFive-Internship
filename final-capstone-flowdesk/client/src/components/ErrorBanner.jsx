export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div role="alert" className="bg-coral-light border border-coral/30 text-coral rounded-lg px-4 py-3 flex items-center justify-between text-sm">
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="font-bold px-2" aria-label="Dismiss">×</button>
      )}
    </div>
  )
}
