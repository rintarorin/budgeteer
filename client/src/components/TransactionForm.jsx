import { useState } from 'react'
import axios from 'axios'

function TransactionForm({ categories, onAdd }) {
  const [form, setForm] = useState({
    type: 'expense', amount: '', category: '', description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const filtered = categories.filter(c => c.type === form.type)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.amount || !form.category) return
    await axios.post('/api/transactions', { ...form, amount: parseFloat(form.amount) })
    setForm({ type: form.type, amount: '', category: '', description: '',
      date: new Date().toISOString().split('T')[0] })
    onAdd()
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Add Transaction</h2>
      <div className="flex gap-2 mb-3">
        {['expense', 'income'].map(t => (
          <button key={t} onClick={() => setForm({ ...form, type: t, category: '' })}
            className={`flex-1 py-2 rounded-lg capitalize font-medium transition-colors
              ${form.type === t
                ? t === 'expense' ? 'bg-red-600' : 'bg-green-600'
                : 'bg-gray-700 text-gray-400'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <input name="amount" type="number" placeholder="Amount"
          value={form.amount} onChange={handleChange}
          className="bg-gray-700 rounded-lg p-2 w-full outline-none focus:ring-2 ring-blue-500" />
        <select name="category" value={form.category} onChange={handleChange}
          className="bg-gray-700 rounded-lg p-2 w-full outline-none focus:ring-2 ring-blue-500">
          <option value="">Select category</option>
          {filtered.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <input name="description" placeholder="Description (optional)"
          value={form.description} onChange={handleChange}
          className="bg-gray-700 rounded-lg p-2 w-full outline-none focus:ring-2 ring-blue-500" />
        <input name="date" type="date" value={form.date} onChange={handleChange}
          className="bg-gray-700 rounded-lg p-2 w-full outline-none focus:ring-2 ring-blue-500" />
        <button onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 rounded-lg p-2 font-semibold transition-colors">
          Add
        </button>
      </div>
    </div>
  )
}

export default TransactionForm