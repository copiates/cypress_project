const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = Number(process.env.PORT || 3002);
app.use(cors());
app.use(express.json({ limit: '32kb' }));

const dbPath = path.join(__dirname, 'bank.db');
const db = new Database(dbPath);
if (!fs.existsSync(dbPath) || db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'").get() === undefined) {
  db.exec(fs.readFileSync(path.join(__dirname, 'database', 'init.sql'), 'utf8'));
}
const { authRoutes } = require('./routes/auth');
const { accountRoutes } = require('./routes/accounts');
const { transferRoutes } = require('./routes/transfer');
const { historyRoutes } = require('./routes/history');
authRoutes(app);
accountRoutes(app, db);
transferRoutes(app, db);
historyRoutes(app, db);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0' }));

const server = app.listen(PORT, '127.0.0.1', () => console.log(`Backend ready at http://127.0.0.1:${PORT}`));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => { db.close(); process.exit(0); }));
}
