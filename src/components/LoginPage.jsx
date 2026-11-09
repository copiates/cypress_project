import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || !data.token) {
        setError(data.error || 'Unable to sign in. Check your details and try again.');
        return;
      }
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
    } catch {
      setError('Could not connect to the demo banking service. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-layout">
      <section className="login-story" aria-label="Welcome">
        <Link to="/login" className="brand brand-light"><span className="brand-mark" aria-hidden="true">N</span><span>northstar<span className="brand-period">.</span></span></Link>
        <div className="story-copy"><span className="eyebrow eyebrow-light">A clearer view of your money</span><h1>Banking that<br /><em>moves with you.</em></h1><p>A calm, simple place to see your balance, move money, and keep every transaction in view.</p></div>
        <div className="story-footer"><span className="story-orbit" aria-hidden="true">✳</span><span>Thoughtful tools for everyday banking.</span></div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="eyebrow">Welcome back</div><h2>Sign in to your account</h2><p className="login-intro">Use the demo details provided for this testing project.</p>
          {error && <div className="alert alert-error" role="alert" data-testid="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="username">Username</label><input id="username" data-testid="username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="Enter your username" required /></div>
            <div className="form-group"><label htmlFor="password">Password</label><input id="password" data-testid="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Enter your password" required /></div>
            <button className="button button-primary button-full" type="submit" data-testid="login-submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span></button>
          </form>
          <div className="demo-credentials"><span className="credentials-icon" aria-hidden="true">i</span><p><strong>Demo access</strong><br />Username <code>student</code> · Password <code>BankDemo@123</code></p></div>
          <p className="simulation-note"><span aria-hidden="true">●</span> This is a simulated banking experience. No real money is involved.</p>
        </div>
      </section>
    </main>
  );
}
