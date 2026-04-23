import { useEffect, useState } from 'react'
import { Expense, Category } from './types'
import SpendingChart from './chart'

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
const [filterFrom, setFilterFrom] = useState('')
const [filterTo, setFilterTo] = useState('')

  const fetchExpenses = () => {
    fetch('/api/expenses')
      .then(res => res.json())
      .then(data => {
        setExpenses(data)
        setLoading(false)
      })
  }

  const fetchCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
  }

  useEffect(() => {
    fetchExpenses()
    fetchCategories()
  }, [])

  const addExpense = () => {
    if (!description || !amount || !date || !categoryId) {
      alert('Please fill in all fields')
      return
    }
    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1,
        category_id: Number(categoryId),
        amount: Number(amount),
        description,
        date
      })
    }).then(() => {
      fetchExpenses()
      setDescription('')
      setAmount('')
      setDate('')
      setCategoryId('')
    })
  }

  const deleteExpense = (id: number) => {
    fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      .then(() => fetchExpenses())
  }

  const filteredExpenses = expenses.filter(expense => {
  const matchCategory = filterCategory === '' || expense.category_id === Number(filterCategory)
  const matchFrom = filterFrom === '' || expense.date >= filterFrom
  const matchTo = filterTo === '' || expense.date <= filterTo
  return matchCategory && matchFrom && matchTo
})
  const totalSpending = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0)


  const spendingByCategory = categories.map(cat => ({
    ...cat,
    total: expenses
      .filter(e => e.category_id === cat.id)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  }))

  return (
    <div className="container">
      <div className="header">
        <h1>SpendWise</h1>
        <p>Personal Finance Tracker</p>
      </div>

      <div className="summary-cards">
        <div className="card">
          <span className="card-label">Total spent</span>
          <span className="card-value">${totalSpending.toFixed(2)}</span>
        </div>
        <div className="card">
          <span className="card-label">Transactions</span>
          <span className="card-value">{filteredExpenses.length}</span>
        </div>
        <div className="card">
          <span className="card-label">Categories</span>
          <span className="card-value">{categories.length}</span>
        </div>
      </div>

      <div className="section">
  <h2>Monthly spending</h2>
  <SpendingChart expenses={expenses} />
</div>
      <div className="section">
        <h2>Spending by category</h2>
        <div className="category-bars">
          {spendingByCategory.map(cat => (
            <div key={cat.id} className="category-bar-row">
              <span className="category-name">{cat.name}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.min((cat.total / cat.budget_limit) * 100, 100)}%`,
                    background: cat.color
                  }}
                />
              </div>
              <span className="category-amount">
                ${cat.total.toFixed(2)}
                {cat.total > cat.budget_limit && (
                  <span className="over-budget"> Over budget!</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
  <h2>Filter expenses</h2>
  <div className="form">
    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
      <option value="">All categories</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
    <input
      type="date"
      value={filterFrom}
      onChange={e => setFilterFrom(e.target.value)}
    />
    <input
      type="date"
      value={filterTo}
      onChange={e => setFilterTo(e.target.value)}
    />
    <button onClick={() => {
      setFilterCategory('')
      setFilterFrom('')
      setFilterTo('')
    }}>Clear filters</button>
  </div>
</div>
      <div className="section">
        <h2>Add expense</h2>
        <div className="form">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button onClick={addExpense}>Add expense</button>
        </div>
      </div>

      <div className="section">
        <h2>All expenses</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.date ? new Date(expense.date).toLocaleDateString('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                  <td>{expense.description}</td>
                  <td>
                    <span
                      className="category-pill"
                      style={{ background: expense.category_color + '22', color: expense.category_color }}
                    >
                      {expense.category_name}
                    </span>
                  </td>
                  <td>${Number(expense.amount).toFixed(2)}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App