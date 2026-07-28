const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function getRoles() {
  const response = await fetch(`${BASE_URL}/api/applications/roles`)
  if (!response.ok) throw new Error('Failed to load role options.')
  return response.json()
}

export async function submitApplication(formData) {
  const response = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    body: formData, // FormData sets its own multipart Content-Type header
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Submission failed (status ${response.status}).`)
  }

  return data
}
