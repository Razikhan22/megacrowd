const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize database connection
const dbPath = path.join(__dirname, 'unitycoin.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    balance REAL DEFAULT 0.0,
    unity_coins INTEGER DEFAULT 100,
    twofa_enabled BOOLEAN DEFAULT true
  )`);

  // Transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Matrix tree table (simple structure for 2x2 forced matrix)
  db.run(`CREATE TABLE IF NOT EXISTS matrix_tree (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    position TEXT NOT NULL, -- e.g., 'you', 'left_child', 'right_child'
    name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Unity Coin status table (global)
  db.run(`CREATE TABLE IF NOT EXISTS unity_coin_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_supply INTEGER DEFAULT 1000000000,
    current_users INTEGER DEFAULT 5000,
    max_users INTEGER DEFAULT 10000,
    price_per_coin REAL DEFAULT 0.01,
    unlocked BOOLEAN DEFAULT false
  )`);

  // Insert demo data for user "Ameer"
  db.get("SELECT * FROM users WHERE email = ?", ['ameer@example.com'], (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (name, email, balance, unity_coins) VALUES (?, ?, ?, ?)",
        ['Ameer', 'ameer@example.com', 0.00, 100]);
    }
  });

  // Insert demo transactions
  db.run("INSERT OR IGNORE INTO transactions (user_id, date, description, status, amount) VALUES (?, ?, ?, ?, ?)",
    [1, 'Jan 20, 2026', 'Joining Fee Deposit', 'Completed', 30.00]);
  db.run("INSERT OR IGNORE INTO transactions (user_id, date, description, status, amount) VALUES (?, ?, ?, ?, ?)",
    [1, 'Jan 19, 2026', 'Matrix Referral', 'Pending', 8.00]);

  // Insert demo matrix tree
  db.run("INSERT OR IGNORE INTO matrix_tree (user_id, position, name) VALUES (?, ?, ?)",
    [1, 'you', 'You']);
  db.run("INSERT OR IGNORE INTO matrix_tree (user_id, position, name) VALUES (?, ?, ?)",
    [1, 'left_child', 'Left Child']);
  db.run("INSERT OR IGNORE INTO matrix_tree (user_id, position, name) VALUES (?, ?, ?)",
    [1, 'right_child', 'Right Child']);

  // Insert demo Unity Coin status
  db.run(`INSERT OR REPLACE INTO unity_coin_status (id, total_supply, current_users, max_users, price_per_coin, unlocked)
          VALUES (1, 1000000000, 5000, 10000, 0.01, false)`);
});

module.exports = db;
