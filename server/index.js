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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});