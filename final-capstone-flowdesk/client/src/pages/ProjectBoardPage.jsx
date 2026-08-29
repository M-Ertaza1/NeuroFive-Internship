import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Column from '../components/Column'
import TaskModal from '../components/TaskModal'
import SearchFilterBar from '../components/SearchFilterBar'
import LoadingState from '../components/LoadingState'
import ErrorBanner from '../components/ErrorBanner'
import { getProject, getTasks, createTask, updateTask, deleteTask } from '../api'

const STATUSES = ['todo', 'in-progress', 'done']

export default function ProjectBoardPage() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [modalTask, setModalTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filters, setFilters] = useState({ search: '', priority: '', assignee: '' })
  const [draggedTask, setDraggedTask] = useState(null)

  function loadTasks(currentFilters = filters) {
    getTasks(id, currentFilters)
      .then(setTasks)
      .catch((err) => setActionError(err.message))
  }

  useEffect(() => {
    setStatus('loading')
    Promise.all([getProject(id), getTasks(id, filters)])
      .then(([p, t]) => {
        setProject(p)
        setTasks(t)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (status === 'ready') loadTasks(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  function handleDragStart(e, task) {
    setDraggedTask(task)
  }

  async function handleDrop(newStatus) {
    if (!draggedTask || draggedTask.status === newStatus) return
    const prevTasks = tasks
    // Optimistic update so the drag feels instant, rolled back on failure.
    setTasks((prev) => prev.map((t) => (t._id === draggedTask._id ? { ...t, status: newStatus } : t)))
    try {
      await updateTask(id, draggedTask._id, { status: newStatus })
    } catch (err) {
      setTasks(prevTasks)
      setActionError(err.message)
    }
    setDraggedTask(null)
  }

  async function handleSaveTask(formData, isEditing) {
    if (isEditing) {
      const updated = await updateTask(id, modalTask._id, Object.fromEntries(formData))
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
    } else {
      const created = await createTask(id, formData)
      setTasks((prev) => [created, ...prev])
    }
  }

  async function handleDeleteTask(taskId) {
    await deleteTask(id, taskId)
    setTasks((prev) => prev.filter((t) => t._id !== taskId))
  }

  function openNewTaskModal() {
    setModalTask(null)
    setModalOpen(true)
  }

  function openEditModal(task) {
    setModalTask(task)
    setModalOpen(true)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-10"><LoadingState count={3} /></main>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-10"><ErrorBanner message={error} /></main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <Link to="/dashboard" className="text-sm text-teal hover:underline">← All projects</Link>
            <h1 className="font-display font-700 text-3xl mt-1">{project.name}</h1>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/projects/${id}/settings`}
              className="border border-ink/15 dark:border-canvas/15 font-semibold px-4 py-2 rounded-lg text-sm hover:border-teal transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={openNewTaskModal}
              className="bg-ink dark:bg-teal text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber hover:text-ink transition-colors"
            >
              + New task
            </button>
          </div>
        </div>

        <ErrorBanner message={actionError} onDismiss={() => setActionError('')} />

        <SearchFilterBar filters={filters} onChange={setFilters} members={project.members} />

        <div className="flex flex-col sm:flex-row gap-4">
          {STATUSES.map((s) => (
            <Column
              key={s}
              status={s}
              tasks={tasks.filter((t) => t.status === s)}
              onDrop={handleDrop}
              onTaskClick={openEditModal}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </main>

      {modalOpen && (
        <TaskModal
          task={modalTask}
          members={project.members}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  )
}
