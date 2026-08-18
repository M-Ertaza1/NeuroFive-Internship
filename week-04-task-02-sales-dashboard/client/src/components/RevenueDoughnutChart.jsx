import { Doughnut } from 'react-chartjs-2'

const COLORS = ['#0EA5A4', '#FFB800', '#E85D5D', '#1B1F3B']

export default function RevenueDoughnutChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.revenue),
        backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } },
    },
  }

  return (
    <div className="bg-white rounded-xl border border-ink/10 p-5">
      <h3 className="font-display font-600 text-sm text-ink/60 mb-4">Revenue by region</h3>
      <div className="h-64">
        {data.length > 0 ? (
          <Doughnut data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-ink/40 text-sm">
            No data for this filter
          </div>
        )}
      </div>
    </div>
  )
}
