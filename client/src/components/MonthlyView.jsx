import { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#60a5fa', '#f87171', '#fbbf24', '#34d399', '#a78bfa', '#fb923c', '#f472b6', '#94a3b8']

function MonthlyView() {
  const [months, setMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/api/months').then(res => {
      setMonths(res.data)
      if (res.data.length > 0) setSelectedMonth(res.data[0])
    })
  }, [])

  useEffect(() => {
    if (selectedMonth) {
      axios.get(`/api/monthly/${selectedMonth}`).then(res => setData(res.data))
    }
  }, [selectedMonth])

  const formatMonth = (ym) => {
    const [year, month] = ym.split('-')
    return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  if (months.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No data yet. Add some transactions first!</p>
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Monthly Breakdown</h2>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="bg-gray-700 rounded-lg p-2 outline-none focus:ring-2 ring-blue-500"
        >
          {months.map(m => <option key={m} value={m}>{formatMonth(m)}</option>)}
        </select>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-900 rounded-lg p-3 text-center">
              <p className="text-xs text-green-300">Income</p>
              <p className="font-bold text-green-400">${data.income.toFixed(2)}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-300">Balance</p>
              <p className={`font-bold ${data.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                ${data.balance.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-900 rounded-lg p-3 text-center">
              <p className="text-xs text-red-300">Expenses</p>
              <p className="font-bold text-red-400">${data.expenses.toFixed(2)}</p>
            </div>
          </div>

          {data.categoryBreakdown.length > 0 ? (
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.categoryBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500">No expenses this month.</p>
          )}
        </>
      )}
    </div>
  )
}

export default MonthlyView