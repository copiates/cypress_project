const { getAuthUser } = require('./auth');

function transferRoutes(app, db) {
  const saveTransfer = db.transaction((recipient, amount, description) => {
    db.prepare('UPDATE accounts SET balance = balance - ? WHERE account_number = ?').run(amount, '1000123456');
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE account_number = ?').run(amount, recipient);
    const id = `TXN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    db.prepare('INSERT INTO transactions (reference_id, timestamp, type, recipient_account, amount, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, new Date().toISOString(), 'Fund Transfer', recipient, amount, 'Completed', description || '');
    return { id, amount, status: 'Completed' };
  });

  app.post('/api/transfer', (req, res) => {
    if (!getAuthUser(req)) return res.status(401).json({ ok: false, error: 'Not authenticated' });
    const { recipient, amount, description } = req.body || {};
    if (typeof recipient !== 'string' || recipient.trim() === '') return res.status(400).json({ ok: false, error: 'Recipient required' });
    if (recipient !== '1000654321') return res.status(400).json({ ok: false, error: 'Invalid recipient' });
    if (amount === '' || amount === null || amount === undefined) return res.status(400).json({ ok: false, error: 'Amount required' });
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) return res.status(400).json({ ok: false, error: 'Amount must be a valid number' });
    if (!Number.isInteger(numericAmount)) return res.status(400).json({ ok: false, error: 'Whole rupees required; decimals are not accepted' });
    if (numericAmount <= 0) return res.status(400).json({ ok: false, error: 'Amount must be greater than ₹0' });
    if (numericAmount < 100) return res.status(400).json({ ok: false, error: 'Minimum transfer amount is ₹100' });
    if (numericAmount > 50000) return res.status(400).json({ ok: false, error: 'Maximum transfer amount is ₹50,000' });
    const sender = db.prepare('SELECT balance FROM accounts WHERE account_number = ?').get('1000123456');
    if (!sender || sender.balance < numericAmount) return res.status(400).json({ ok: false, error: 'Insufficient balance' });
    return res.json({ ok: true, transaction: saveTransfer(recipient, numericAmount, description) });
  });
}
module.exports = { transferRoutes };
