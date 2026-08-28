import { useRef, useState } from 'react'
import { uploadFile } from '../api'

const MAX_SIZE_MB = 10
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Dropzone({ onUploaded }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [validationError, setValidationError] = useState('')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle')
  const [uploadError, setUploadError] = useState('')

  function validate(selectedFile) {
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      return 'File type not allowed. Upload an image, PDF, or Word document.'
    }
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File must be under ${MAX_SIZE_MB}MB.`
    }
    return ''
  }

  function handleFileSelect(selectedFile) {
    if (!selectedFile) return
    const error = validate(selectedFile)
    if (error) {
      setValidationError(error)
      setFile(null)
      setPreviewUrl(null)
      return
    }
    setValidationError('')
    setFile(selectedFile)
    setPreviewUrl(selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null)
    setStatus('ready')
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files?.[0])
  }

  function resetSelection() {
    setFile(null)
    setPreviewUrl(null)
    setProgress(0)
    setStatus('idle')
    setUploadError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleUpload() {
    if (!file) return
    setStatus('uploading')
    setUploadError('')
    try {
      const record = await uploadFile(file, setProgress)
      onUploaded(record)
      resetSelection()
    } catch (err) {
      setUploadError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="space-y-3">
      {!file && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drag and drop a file here, or click to browse"
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-teal bg-teal-light' : 'border-ink/20 hover:border-ink/40'
          }`}
        >
          <span className="text-3xl" role="img" aria-label="Folder">📁</span>
          <p className="mt-3 font-display font-600">
            Drag & drop a file here, or <span className="text-teal underline">browse</span>
          </p>
          <p className="mt-1 text-sm text-ink/50">Images, PDF, or Word — up to {MAX_SIZE_MB}MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
            className="hidden"
            aria-hidden="true"
          />
        </div>
      )}

      {validationError && <p className="text-sm text-coral" role="alert">{validationError}</p>}

      {file && (
        <div className="bg-white rounded-xl border border-ink/10 p-5 fade-in">
          <div className="flex items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`Preview of ${file.name}`}
                width="64"
                height="64"
                className="w-16 h-16 object-cover rounded-lg border border-ink/10"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-canvas text-2xl" aria-hidden="true">
                📄
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-ink/50">{formatBytes(file.size)}</p>
            </div>
            {status !== 'uploading' && (
              <button onClick={resetSelection} className="text-ink/40 hover:text-coral text-xl leading-none" aria-label="Remove selected file">
                ×
              </button>
            )}
          </div>

          {status === 'uploading' && (
            <div className="mt-4">
              <div className="h-2 bg-canvas rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                <div className="h-full bg-teal transition-all duration-150" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-ink/50 font-mono">{progress}%</p>
            </div>
          )}

          {status === 'error' && <p className="mt-3 text-sm text-coral" role="alert">{uploadError}</p>}

          {status !== 'uploading' && (
            <button
              onClick={handleUpload}
              className="mt-4 w-full bg-ink text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber hover:text-ink transition-colors"
            >
              {status === 'error' ? 'Try again' : 'Upload file'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
