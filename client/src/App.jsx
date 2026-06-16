import { useState, useEffect } from 'react'
import axios from 'axios'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'

function App() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 })
  const [categories, setCategories] = useState([])

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
      <Summary summary={summary} />
      <TransactionForm categories={categories} onAdd={fetchAll} />
      <TransactionList transactions={transactions} onDelete={fetchAll} />
    </div>
  )
}

export default App