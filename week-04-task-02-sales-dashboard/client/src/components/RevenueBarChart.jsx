import { Bar } from 'react-chartjs-2'

const COLORS = ['#0EA5A4', '#FFB800', '#E85D5D', '#1B1F3B', '#7C93C6']

export default function RevenueBarChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Revenue',
        data: data.map((d) => d.revenue),
        backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
        borderRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `$${value}` },
      },
    },
  }

  return (
    <div className="bg-white rounded-xl border border-ink/10 p-5">
      <h3 className="font-display font-600 text-sm text-ink/60 mb-4">Revenue by category</h3>
      <div className="h-64">
        {data.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-ink/40 text-sm">
            No data for this filter
          </div>
        )}
      </div>
    </div>
  )
}
