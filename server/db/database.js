import Database from 'better-sqlite3';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'budget.sqlite'));

// Create tables if they don't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
  );
`);

// Seed some default categories
const existing = db.prepare('SELECT COUNT(*) as count FROM categories').get();
if (existing.count === 0) {
  const insert = db.prepare('INSERT INTO categories (name, type) VALUES (?, ?)');
  const defaults = [
    ['Salary', 'income'], ['Freelance', 'income'], ['Other Income', 'income'],
    ['Rent', 'expense'], ['Groceries', 'expense'], ['Transport', 'expense'],
    ['Utilities', 'expense'], ['Entertainment', 'expense'], ['Other', 'expense'],
  ];
  defaults.forEach(([name, type]) => insert.run(name, type));
}

export default db;