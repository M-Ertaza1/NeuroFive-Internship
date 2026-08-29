import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, Doughnut } from 'react-chartjs-2'
import Navbar from '../components/Navbar'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'
import CreateProjectForm from '../components/CreateProjectForm'
import { getProjects, createProject, getDashboardSummary } from '../api'
import '../chartSetup'

const STATUS_COLORS = { todo: '#94a3b8', 'in-progress': '#FFB800', done: '#0EA5A4' }
const PRIORITY_COLORS = { low: '#0EA5A4', medium: '#FFB800', high: '#E85D5D' }

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [summary, setSummary] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  function load() {
    setStatus('loading')
    Promise.all([getProjects(), getDashboardSummary()])
      .then(([p, s]) => {
        setProjects(p)
        setSummary(s)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }

  useEffect(() => { load() }, [])

  async function handleCreate(data) {
    const project = await createProject(data)
    setProjects((prev) => [project, ...prev])
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div>
          <span className="inline-block font-mono text-xs tracking-wide text-teal bg-teal-light px-3 py-1 rounded-full mb-3">
            DASHBOARD
          </span>
          <h1 className="font-display font-700 text-3xl">Your projects</h1>
        </div>

        {status === 'loading' && <LoadingState count={3} />}
        {status === 'error' && <ErrorBanner message={error} />}

        {status === 'ready' && summary && summary.totalTasks > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-ink/60 rounded-xl border border-ink/10 dark:border-canvas/10 p-5">
              <h3 className="font-display font-600 text-sm text-ink/60 dark:text-canvas/60 mb-4">Tasks by status</h3>
              <div className="h-56">
                <Bar
                  data={{
                    labels: summary.byStatus.map((s) => s.label),
                    datasets: [{
                      data: summary.byStatus.map((s) => s.count),
                      backgroundColor: summary.byStatus.map((s) => STATUS_COLORS[s.label] || '#94a3b8'),
                      borderRadius: 6,
                    }],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                />
              </div>
            </div>
            <div className="bg-white dark:bg-ink/60 rounded-xl border border-ink/10 dark:border-canvas/10 p-5">
              <h3 className="font-display font-600 text-sm text-ink/60 dark:text-canvas/60 mb-4">Tasks by priority</h3>
              <div className="h-56">
                <Doughnut
                  data={{
                    labels: summary.byPriority.map((p) => p.label),
                    datasets: [{
                      data: summary.byPriority.map((p) => p.count),
                      backgroundColor: summary.byPriority.map((p) => PRIORITY_COLORS[p.label] || '#94a3b8'),
                      borderWidth: 0,
                    }],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
                />
              </div>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <>
            <CreateProjectForm onSubmit={handleCreate} />

            {projects.length === 0 ? (
              <EmptyState icon="📋" title="No projects yet" description="Create your first project above." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p) => (
                  <Link
                    key={p._id}
                    to={`/projects/${p._id}`}
                    className="fade-in bg-white dark:bg-ink/60 rounded-xl border border-ink/10 dark:border-canvas/10 p-5 hover:border-teal/40 transition-colors"
                  >
                    <h3 className="font-display font-600">{p.name}</h3>
                    {p.description && <p className="text-sm text-ink/60 dark:text-canvas/60 mt-1 line-clamp-2">{p.description}</p>}
                    <p className="text-xs text-ink/40 dark:text-canvas/40 mt-3 font-mono">
                      {p.members?.length || 0} member{p.members?.length === 1 ? '' : 's'}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
