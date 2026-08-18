import { useEffect, useState } from 'react'
import './chartSetup'
import Filters from './components/Filters'
import StatCards from './components/StatCards'
import StatCardsSkeleton from './components/StatCardsSkeleton'
import ChartsSkeleton from './components/ChartsSkeleton'
import RevenueLineChart from './components/RevenueLineChart'
import RevenueBarChart from './components/RevenueBarChart'
import RevenueDoughnutChart from './components/RevenueDoughnutChart'
import { getFilterOptions, getSalesSummary } from './api'

const EMPTY_FILTERS = { category: '', region: '', from: '', to: '' }

export default function App() {
  const [options, setOptions] = useState({ categories: [], regions: [] })
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [summary, setSummary] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('')

  useEffect(() => {
    getFilterOptions()
      .then(setOptions)
      .catch(() => {
        // Filter options failing isn't fatal — the dashboard can still work
        // without dropdown options populated, so we don't block on this.
      })
  }, [])

  useEffect(() => {
    setStatus('loading')
    getSalesSummary(filters)
      .then((data) => {
        setSummary(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [filters])

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <span className="inline-block font-mono text-xs tracking-wide text-teal bg-teal-light px-3 py-1 rounded-full mb-4">
          WEEK 4 · TASK 2
        </span>
        <h1 className="font-display font-700 text-3xl md:text-4xl tracking-tight">
          Sales Dashboard
        </h1>
        <p className="mt-3 text-ink/60 max-w-lg">
          Sample sales data, aggregated server-side and filterable by category, region, and date.
        </p>

        <div className="mt-8">
          <Filters options={options} filters={filters} onChange={setFilters} />
        </div>

        <div className="mt-6 space-y-6">
          {status === 'loading' && (
            <>
              <StatCardsSkeleton />
              <ChartsSkeleton />
            </>
          )}

          {status === 'error' && (
            <div className="text-center py-16">
              <p className="text-coral font-medium">{error}</p>
            </div>
          )}

          {status === 'ready' && summary && (
            <>
              <StatCards summary={summary} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RevenueLineChart data={summary.revenueByMonth} />
                <RevenueBarChart data={summary.revenueByCategory} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RevenueDoughnutChart data={summary.revenueByRegion} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
