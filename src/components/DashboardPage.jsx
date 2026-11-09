import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './NavBar';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export function DashboardPage() {
  const [accounts, setAccounts] = useState(null);
  const [loadError, setLoadError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) return;
    fetch('/api/accounts', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to load your account.');
        setAccounts(data);
      })
      .catch((error) => setLoadError(error.message));
  }, [token]);

  if (!token) return <main className="access-page"><section className="access-card"><span className="access-icon">↗</span><p className="eyebrow">Secure account access</p><h1>Login Required</h1><p>Sign in to see your account overview and manage transfers.</p><Link className="button button-primary" to="/login">Go to Login <span aria-hidden="true">→</span></Link></section></main>;

  return (
    <div className="app-shell"><NavBar /><main className="container page-content">
      <div className="page-heading"><div><p className="eyebrow">Your money at a glance</p><h1>Good to see you, Sam.</h1><p className="muted">Here’s what’s happening with your account today.</p></div><span className="live-pill"><span /> Demo environment</span></div>
      {loadError && <div className="alert alert-error" role="alert">{loadError}</div>}
      <section className="account-grid" aria-label="Account summary">
        <article className="balance-card"><div className="balance-top"><span className="balance-label">Total available balance</span><span className="balance-icon" aria-hidden="true">↗</span></div><p className="balance-amount" data-testid="account-balance">{accounts ? money(accounts.sender.balance) : 'Loading…'}</p><div className="balance-bottom"><span className="account-type">Everyday savings</span><span data-testid="account-number">•••• 3456</span></div></article>
        <article className="summary-card"><div className="summary-icon summary-icon-green" aria-hidden="true">↔</div><p className="summary-label">Account status</p><p className="summary-value">In good shape</p><span className="summary-caption">Your account is ready to use</span></article>
        <article className="summary-card summary-note-card"><div className="summary-icon summary-icon-sand" aria-hidden="true">✳</div><p className="summary-label">A little peace of mind</p><p className="summary-value">Your demo, your pace.</p><span className="summary-caption">Practice transfers safely in this simulation.</span></article>
      </section>
      <section className="section-heading"><div><p className="eyebrow">Quick actions</p><h2>What would you like to do?</h2></div></section>
      <section className="action-grid"><Link to="/transfer" className="action-card"><span className="action-icon action-icon-blue" aria-hidden="true">↗</span><span className="action-copy"><strong>Make a transfer</strong><small>Send money to your saved demo account</small></span><span className="action-arrow" aria-hidden="true">→</span></Link><Link to="/history" className="action-card"><span className="action-icon action-icon-lilac" aria-hidden="true">▤</span><span className="action-copy"><strong>View activity</strong><small>Review your completed transactions</small></span><span className="action-arrow" aria-hidden="true">→</span></Link></section>
      <p className="page-footnote"><span aria-hidden="true">●</span> Classroom simulation only — no real bank accounts or payments are connected.</p>
    </main></div>
  );
}
