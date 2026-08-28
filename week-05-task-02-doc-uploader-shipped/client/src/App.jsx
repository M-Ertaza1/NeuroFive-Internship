import { useEffect, useState } from 'react'
import Dropzone from './components/Dropzone'
import UploadedFilesList from './components/UploadedFilesList'
import { getUploads } from './api'

export default function App() {
  const [uploads, setUploads] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  function loadUploads() {
    setStatus('loading')
    getUploads()
      .then((data) => {
        setUploads(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }

  useEffect(() => {
    loadUploads()
  }, [])

  function handleUploaded(record) {
    setUploads((prev) => [record, ...prev])
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block font-mono text-xs tracking-wide text-teal bg-teal-light px-3 py-1 rounded-full mb-4">
          WEEK 4 · TASK 1 — NOW DEPLOYED
        </span>
        <h1 className="font-display font-700 text-3xl md:text-4xl tracking-tight">
          File Uploader
        </h1>
        <p className="mt-3 text-ink/60 max-w-lg">
          Drag and drop a file, or click to browse. Images, PDFs, and Word documents up to 10MB.
        </p>

        <div className="mt-8 max-w-lg">
          <Dropzone onUploaded={handleUploaded} />
        </div>

        <div className="mt-12">
          <h2 className="font-display font-600 text-lg mb-4">Uploaded files</h2>

          {status === 'error' && (
            <div className="text-center py-16">
              <p className="text-coral font-medium" role="alert">{error}</p>
              <button onClick={loadUploads} className="mt-4 bg-ink text-white font-semibold px-5 py-2.5 rounded-lg">
                Try again
              </button>
            </div>
          )}

          {status !== 'error' && <UploadedFilesList uploads={uploads} status={status} />}
        </div>
      </div>
    </div>
  )
}
