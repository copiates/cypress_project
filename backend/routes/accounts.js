const { getAuthUser } = require('./auth');

function accountRoutes(app, db) {
  app.get('/api/accounts', (req, res) => {
    if (!getAuthUser(req)) return res.status(401).json({ ok: false, error: 'Not authenticated' });
    const rows = db.prepare('SELECT account_number, masked, balance, account_type FROM accounts WHERE account_number IN (?, ?)').all('1000123456', '1000654321');
    const sender = rows.find((row) => row.account_number === '1000123456');
    const receiver = rows.find((row) => row.account_number === '1000654321');
    if (!sender || !receiver) return res.status(500).json({ ok: false, error: 'Demo accounts are not initialized' });
    return res.json({ ok: true, sender, receiver });
  });
}
module.exports = { accountRoutes };
