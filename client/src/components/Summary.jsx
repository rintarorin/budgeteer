function Summary({ summary }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-green-900 rounded-xl p-4 text-center">
        <p className="text-sm text-green-300">Income</p>
        <p className="text-xl font-bold text-green-400">${summary.income.toFixed(2)}</p>
      </div>
      <div className="bg-gray-800 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-300">Balance</p>
        <p className={`text-xl font-bold ${summary.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
          ${summary.balance.toFixed(2)}
        </p>
      </div>
      <div className="bg-red-900 rounded-xl p-4 text-center">
        <p className="text-sm text-red-300">Expenses</p>
        <p className="text-xl font-bold text-red-400">${summary.expenses.toFixed(2)}</p>
      </div>
    </div>
  )
}

export default Summary