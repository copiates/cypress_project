const DEMO_USER = 'student';
const DEMO_PASSWORD = 'BankDemo@123';
const sessions = new Map();

function authRoutes(app) {
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body || {};
    if (username === DEMO_USER && password === DEMO_PASSWORD) {
      const token = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessions.set(token, { username, userId: 'student' });
      return res.json({ ok: true, token, username });
    }
    return res.status(401).json({ ok: false, error: 'Invalid username or password' });
  });
  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ ok: false, error: 'Not authenticated' });
    return res.json({ ok: true, user: { username: user.username, userId: user.userId } });
  });
  app.post('/api/auth/logout', (req, res) => {
    const token = bearerToken(req);
    if (token) sessions.delete(token);
    return res.json({ ok: true });
  });
}

function bearerToken(req) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}
function getAuthUser(req) {
  return sessions.get(bearerToken(req));
}
module.exports = { authRoutes, getAuthUser, DEMO_USER, DEMO_PASSWORD };
