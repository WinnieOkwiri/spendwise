import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Expense } from './types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  expenses: Expense[]
}

function SpendingChart({ expenses }: Props) {
  const monthlyTotals: Record<string, number> = {}

  expenses.forEach(expense => {
    const month = expense.date?.substring(0, 7)
    if (month) {
      monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(expense.amount)
    }
  })

  const labels = Object.keys(monthlyTotals).sort()
  const data = labels.map(month => Number(monthlyTotals[month].toFixed(2)))

  const chartData = {
    labels: labels.map(l => {
      const [year, month] = l.split('-')
      return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    }),
    datasets: [
      {
        label: 'Monthly spending ($)',
        data,
        backgroundColor: '#1a1a2e',
        borderRadius: 6,
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `$${value}`
        }
      }
    }
  }

  return <Bar data={chartData} options={options} />
}

export default SpendingChart