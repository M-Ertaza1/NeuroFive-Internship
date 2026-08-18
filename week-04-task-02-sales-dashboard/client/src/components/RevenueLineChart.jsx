import { Line } from 'react-chartjs-2'

export default function RevenueLineChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Revenue',
        data: data.map((d) => d.revenue),
        borderColor: '#0EA5A4',
        backgroundColor: 'rgba(14, 165, 164, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#0EA5A4',
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
      <h3 className="font-display font-600 text-sm text-ink/60 mb-4">Revenue over time</h3>
      <div className="h-64">
        {data.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <EmptyChartMessage />
        )}
      </div>
    </div>
  )
}

function EmptyChartMessage() {
  return (
    <div className="h-full flex items-center justify-center text-ink/40 text-sm">
      No data for this filter
    </div>
  )
}
