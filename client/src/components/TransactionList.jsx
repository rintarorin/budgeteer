import axios from 'axios'

function TransactionList({ transactions, onDelete }) {
  const handleDelete = async (id) => {
    await axios.delete(`/api/transactions/${id}`)
    onDelete()
  }

  if (transactions.length === 0)
    return <p className="text-center text-gray-500">No transactions yet. Add one above!</p>

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Transactions</h2>
      {transactions.map(t => (
        <div key={t.id} className="bg-gray-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="font-medium">{t.category}
              {t.description && <span className="text-gray-400 text-sm"> · {t.description}</span>}
            </p>
            <p className="text-xs text-gray-500">{t.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
              {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
            </span>
            <button onClick={() => handleDelete(t.id)}
              className="text-gray-600 hover:text-red-400 transition-colors text-lg">✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TransactionList