import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- TRANSACTIONS ---

// Get all transactions
app.get('/api/transactions', (req, res) => {
  const rows = db.prepare('SELECT * FROM transactions ORDER BY date DESC').all();
  res.json(rows);
});

// Add a transaction
app.post('/api/transactions', (req, res) => {
  const { type, amount, category, description, date } = req.body;
  const result = db.prepare(
    'INSERT INTO transactions (type, amount, category, description, date) VALUES (?, ?, ?, ?, ?)'
  ).run(type, amount, category, description, date);
  res.json({ id: result.lastInsertRowid });
});

// Delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
  db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- CATEGORIES ---

// Get all categories
app.get('/api/categories', (req, res) => {
  const rows = db.prepare('SELECT * FROM categories ORDER BY type, name').all();
  res.json(rows);
});

// --- SUMMARY ---

// Get income/expense totals
app.get('/api/summary', (req, res) => {
  const income = db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'"
  ).get();
  const expenses = db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'"
  ).get();
  res.json({
    income: income.total,
    expenses: expenses.total,
    balance: income.total - expenses.total,
  });
});

// Get monthly summary (totals by category for a given month)
app.get('/api/monthly/:yearMonth', (req, res) => {
  const { yearMonth } = req.params; // format: "2026-06"
  
  const transactions = db.prepare(
    "SELECT * FROM transactions WHERE date LIKE ? ORDER BY date DESC"
  ).all(`${yearMonth}%`);

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const byCategory = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

  const categoryBreakdown = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  res.json({
    income,
    expenses,
    balance: income - expenses,
    transactions,
    categoryBreakdown,
  });
});

// Get list of months that have transactions (for the dropdown)
app.get('/api/months', (req, res) => {
  const rows = db.prepare(
    "SELECT DISTINCT substr(date, 1, 7) as month FROM transactions ORDER BY month DESC"
  ).all();
  res.json(rows.map(r => r.month));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});