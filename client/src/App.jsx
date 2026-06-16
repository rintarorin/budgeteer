import { useState, useEffect } from 'react'
import axios from 'axios'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import MonthlyView from './components/MonthlyView'

function App() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 })
  const [categories, setCategories] = useState([])
  const [view, setView] = useState('all') // 'all' or 'monthly'

  const fetchAll = async () => {
    const [t, s, c] = await Promise.all([
      axios.get('/api/transactions'),
      axios.get('/api/summary'),
      axios.get('/api/categories'),
    ])
    setTransactions(t.data)
    setSummary(s.data)
    setCategories(c.data)
  }

  useEffect(() => { fetchAll() }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">💰 Budgeteer</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('all')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            view === 'all' ? 'bg-blue-600' : 'bg-gray-800 text-gray-400'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setView('monthly')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            view === 'monthly' ? 'bg-blue-600' : 'bg-gray-800 text-gray-400'
          }`}
        >
          Monthly
        </button>
      </div>

      {view === 'all' ? (
        <>
          <Summary summary={summary} />
          <TransactionForm categories={categories} onAdd={fetchAll} />
          <TransactionList transactions={transactions} onDelete={fetchAll} />
        </>
      ) : (
        <MonthlyView />
      )}
    </div>
  )
}

export default App