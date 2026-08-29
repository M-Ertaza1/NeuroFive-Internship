const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getToken() {
  return localStorage.getItem('flowdesk_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || `Request failed (status ${response.status}).`)
  }
  return data
}

// --- Auth ---
export const signup = (name, email, password) =>
  request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) })
export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
export const fetchCurrentUser = () => request('/api/auth/me')

// --- Projects ---
export const getProjects = () => request('/api/projects')
export const getProject = (id) => request(`/api/projects/${id}`)
export const createProject = (data) =>
  request('/api/projects', { method: 'POST', body: JSON.stringify(data) })
export const updateProject = (id, data) =>
  request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProject = (id) => request(`/api/projects/${id}`, { method: 'DELETE' })

// --- Members ---
export const addMember = (projectId, email) =>
  request(`/api/projects/${projectId}/members`, { method: 'POST', body: JSON.stringify({ email }) })
export const updateMemberRole = (projectId, userId, role) =>
  request(`/api/projects/${projectId}/members/${userId}`, { method: 'PUT', body: JSON.stringify({ role }) })
export const removeMember = (projectId, userId) =>
  request(`/api/projects/${projectId}/members/${userId}`, { method: 'DELETE' })

// --- Tasks ---
export const getTasks = (projectId, filters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => v && params.append(k, v))
  return request(`/api/projects/${projectId}/tasks?${params.toString()}`)
}
export const createTask = (projectId, formData) =>
  request(`/api/projects/${projectId}/tasks`, { method: 'POST', body: formData })
export const updateTask = (projectId, taskId, data) =>
  request(`/api/projects/${projectId}/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteTask = (projectId, taskId) =>
  request(`/api/projects/${projectId}/tasks/${taskId}`, { method: 'DELETE' })

// --- Dashboard ---
export const getDashboardSummary = () => request('/api/dashboard/summary')
