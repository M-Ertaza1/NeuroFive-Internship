const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function getUploads() {
  const response = await fetch(`${BASE_URL}/api/uploads`)
  if (!response.ok) throw new Error('Failed to load uploaded files.')
  return response.json()
}

export function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${BASE_URL}/api/uploads`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      let data = {}
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        // non-JSON response falls through to the generic error below
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data)
      } else {
        reject(new Error(data.message || `Upload failed (status ${xhr.status}).`))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload. Please try again.'))
    xhr.send(formData)
  })
}
