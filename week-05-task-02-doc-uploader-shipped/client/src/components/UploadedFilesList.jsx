function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadCard({ upload }) {
  const isImage = upload.resourceType === 'image'

  return (
    <div className="fade-in bg-white rounded-xl border border-ink/10 p-4 flex flex-col">
      {isImage ? (
        <img
          src={upload.url}
          alt={`Uploaded file: ${upload.originalName}`}
          loading="lazy"
          width="300"
          height="144"
          className="w-full h-36 object-cover rounded-lg mb-3"
        />
      ) : (
        <div className="w-full h-36 flex items-center justify-center rounded-lg bg-canvas text-4xl mb-3" aria-hidden="true">
          📄
        </div>
      )}
      <p className="text-sm font-medium truncate">{upload.originalName}</p>
      <p className="text-xs text-ink/50 mt-0.5">{formatBytes(upload.bytes)}</p>
      <a
        href={upload.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-sm font-semibold text-teal hover:underline"
      >
        {isImage ? 'View full size' : 'Download / view'}
        <span className="sr-only"> {upload.originalName}</span>
      </a>
    </div>
  )
}

export default function UploadedFilesList({ uploads, status }) {
  if (status === 'loading') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-ink/10 p-4">
            <div className="w-full h-36 rounded-lg skeleton mb-3" />
            <div className="h-3 w-3/4 rounded skeleton" />
          </div>
        ))}
      </div>
    )
  }

  if (uploads.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-ink/15 rounded-xl">
        <span className="text-3xl" role="img" aria-label="Empty tray">🗂️</span>
        <p className="mt-3 font-display font-600">No files uploaded yet</p>
        <p className="mt-1 text-sm text-ink/50">Files you upload above will show up here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {uploads.map((u) => (
        <UploadCard key={u._id} upload={u} />
      ))}
    </div>
  )
}
