const { getAuthUser } = require('./auth');

function historyRoutes(app, db) {
  app.get('/api/history', (req, res) => {
    if (!getAuthUser(req)) return res.status(401).json({ ok: false, error: 'Not authenticated' });
    const transactions = db.prepare('SELECT reference_id AS id, timestamp, type, recipient_account AS recipient, amount, status, description FROM transactions ORDER BY timestamp DESC, id DESC').all();
    return res.json({ ok: true, transactions });
  });
  app.post('/api/reset', (req, res) => {
    if (!getAuthUser(req)) return res.status(401).json({ ok: false, error: 'Not authenticated' });
    const reset = db.transaction(() => {
      db.prepare('UPDATE accounts SET balance = 75000 WHERE account_number = ?').run('1000123456');
      db.prepare('UPDATE accounts SET balance = 20000 WHERE account_number = ?').run('1000654321');
      db.prepare('DELETE FROM transactions').run();
    });
    reset();
    return res.json({ ok: true, message: 'Balances reset' });
  });
}
module.exports = { historyRoutes };
