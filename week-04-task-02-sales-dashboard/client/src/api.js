const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function getFilterOptions() {
  const response = await fetch(`${BASE_URL}/api/sales/meta`)
  if (!response.ok) throw new Error('Failed to load filter options.')
  return response.json()
}

export async function getSalesSummary(filters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value)
  })

  const response = await fetch(`${BASE_URL}/api/sales/summary?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to load sales data.')
  return response.json()
}
