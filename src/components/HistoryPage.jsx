import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './NavBar';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export function HistoryPage() {
  const token = localStorage.getItem('authToken');
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/history', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to load transaction activity.');
        setTransactions(data.transactions || []);
      })
      .catch((loadError) => { setError(loadError.message); setTransactions([]); });
  }, [token]);

  if (!token) return <main className="access-page"><section className="access-card"><span className="access-icon">▤</span><p className="eyebrow">Secure account access</p><h1>Login Required</h1><p>Sign in to review your transaction activity.</p><Link className="button button-primary" to="/login">Go to Login <span aria-hidden="true">→</span></Link></section></main>;

  return (
    <div className="app-shell"><NavBar /><main className="container page-content">
      <div className="page-heading"><div><p className="eyebrow">Your account, in motion</p><h1>Transaction activity</h1><p className="muted">A record of transfers made in this demo environment.</p></div><Link to="/transfer" className="button button-primary">New transfer <span aria-hidden="true">→</span></Link></div>
      <section className="history-card" data-testid="transaction-history">
        <div className="history-card-heading"><div><h2>Recent transactions</h2><p>Only successful demo transfers are recorded.</p></div>{transactions && <span className="transaction-count">{transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}</span>}</div>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {transactions === null ? <div className="loading-row" role="status">Loading transactions…</div> : transactions.length === 0 ? (
          <div className="empty-state"><span className="empty-icon" aria-hidden="true">▤</span><h3>No activity yet</h3><p>Once you make a demo transfer, it will appear here.</p><Link to="/transfer" className="button button-secondary">Make your first transfer <span aria-hidden="true">→</span></Link></div>
        ) : (
          <div className="table-wrap"><table><thead><tr><th>Transaction</th><th>Date &amp; time</th><th>Recipient</th><th>Amount</th><th>Status</th></tr></thead><tbody>{transactions.map((tx) => <tr key={tx.id}>
            <td><span className="transaction-type">{tx.type}</span><span className="transaction-reference" data-testid={`tx-id-${tx.id}`}>{tx.id}</span></td>
            <td>{formatDate(tx.timestamp)}</td><td><span className="recipient-table-name">Alex Morgan</span><span className="transaction-reference">•••• {String(tx.recipient).slice(-4)}</span></td>
            <td className="amount-cell" data-testid={`tx-amount-${tx.id}`}>{money(tx.amount)}</td><td><span className={`status-badge ${tx.status === 'Completed' ? 'status-complete' : 'status-failed'}`} data-testid={`tx-status-${tx.id}`}><span />{tx.status}</span></td>
          </tr>)}</tbody></table></div>
        )}
      </section>
      <p className="page-footnote"><span aria-hidden="true">●</span> This simulated transaction history is for testing and learning only.</p>
    </main></div>
  );
}
