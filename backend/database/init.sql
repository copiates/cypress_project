CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_number TEXT UNIQUE NOT NULL,
  masked TEXT NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  account_type TEXT DEFAULT 'Savings'
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_id TEXT UNIQUE NOT NULL,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  type TEXT NOT NULL,
  recipient_account TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Completed',
  description TEXT DEFAULT ''
);

INSERT OR IGNORE INTO accounts (account_number, masked, balance, account_type) VALUES
  ('1000123456', '1000****3456', 75000, 'Savings'),
  ('1000654321', '1000****4321', 20000, 'Savings');
