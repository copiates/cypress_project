import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './NavBar';

const RECEIVER_ACCOUNT = '1000654321';

export function TransferPage() {
  const token = localStorage.getItem('authToken');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCompleted(null);
    setSubmitting(true);
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipient, amount, description }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.error || 'Your transfer could not be completed.');
        return;
      }
      setCompleted(data.transaction);
      setRecipient('');
      setAmount('');
      setDescription('');
    } catch {
      setError('Could not connect to the demo banking service. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) return <main className="access-page"><section className="access-card"><span className="access-icon">↗</span><p className="eyebrow">Secure account access</p><h1>Login Required</h1><p>Sign in to manage a transfer from your demo account.</p><Link className="button button-primary" to="/login">Go to Login <span aria-hidden="true">→</span></Link></section></main>;

  return (
    <div className="app-shell"><NavBar /><main className="container page-content narrow-content">
      <div className="page-heading"><div><p className="eyebrow">Move money</p><h1>Make a transfer</h1><p className="muted">Send funds between the two simulated accounts.</p></div><Link to="/dashboard" className="back-link">← Overview</Link></div>
      <div className="transfer-layout">
        <section className="form-card">
          <div className="form-card-heading"><span className="form-heading-icon" aria-hidden="true">↗</span><div><h2>Transfer details</h2><p>Fields marked required must be completed.</p></div></div>
          {error && <div className="alert alert-error" role="alert" data-testid="transfer-error">{error}</div>}
          {completed && <div className="alert alert-success" role="status" data-testid="transfer-success"><span className="success-check" aria-hidden="true">✓</span><div><strong>Transfer complete</strong><p>{`₹${Number(completed.amount).toLocaleString('en-IN')} sent to ${RECEIVER_ACCOUNT}. Reference ${completed.id}.`}</p><Link to="/history">View transaction activity →</Link></div></div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group"><label htmlFor="recipient">Recipient account number <span className="required-mark">*</span></label><input id="recipient" data-testid="recipient-account" type="text" value={recipient} onChange={(event) => setRecipient(event.target.value)} autoComplete="off" placeholder="Enter 10-digit account number" aria-describedby="recipient-help" required /><small id="recipient-help">For this simulation, use the demo recipient account: {RECEIVER_ACCOUNT}.</small></div>
            <div className="form-group"><label htmlFor="amount">Amount <span className="required-mark">*</span></label><div className="amount-input"><span aria-hidden="true">₹</span><input id="amount" data-testid="transfer-amount" type="text" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" aria-describedby="amount-help" required /></div><small id="amount-help">Between ₹100 and ₹50,000. Whole rupees only.</small></div>
            <div className="form-group"><label htmlFor="description">Note <span className="optional-mark">Optional</span></label><input id="description" data-testid="transfer-description" type="text" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={120} placeholder="What’s this transfer for?" /></div>
            <div className="form-assurance"><span aria-hidden="true">▣</span><span>Demo transfers are simulated and can’t move real money.</span></div>
            <button className="button button-primary button-full" type="submit" data-testid="transfer-submit" disabled={submitting}>{submitting ? 'Processing…' : 'Review and send'} <span aria-hidden="true">→</span></button>
          </form>
        </section>
        <aside className="transfer-aside"><div className="recipient-card"><span className="eyebrow">Your recipient</span><div className="recipient-avatar">A</div><h3>Alex Morgan</h3><p>Northstar demo account</p><span className="recipient-number">•••• 4321</span></div><div className="limits-card"><span className="limits-icon" aria-hidden="true">i</span><div><strong>Transfer limits</strong><p>Send from ₹100 up to ₹50,000 per transfer. Your available balance must cover the amount.</p></div></div></aside>
      </div>
    </main></div>
  );
}
