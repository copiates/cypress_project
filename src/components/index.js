import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resetBankData, login } from '../data/bankData.js';

export const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    resetBankData();
    setIsLoggedIn(false);
    navigate('/login');
  };

  useEffect(() => {
    const checkLogin = () => {
      const state = localStorage.getItem('digitalBankingState');
      setIsLoggedIn(!!state);
    };
    checkLogin();
  }, []);

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-left">
          <Link to="/dashboard" className="nav-link">Digital Banking</Link>
        </div>
        <div className="nav-right">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/transfer" className="nav-link">Transfer</Link>
              <Link to="/history" className="nav-link">History</Link>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { ok, error: loginError } = login(username, password);
      if (ok) {
        setSubmitting(false);
        navigate('/dashboard');
      } else {
        setError(loginError || 'Login failed');
        setSubmitting(false);
      }
    } catch (err) {
      setError('An error occurred');
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card auth-card">
        <h2 className="text-center">Login</h2>
        
        {error && (
          <div className="error-msg" style={{ background: '#fdeae8', padding: '12px', marginBottom: '16px', borderRadius: '8px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="label" htmlFor="username">Username</label>
            <input
              id="username"
              data-testid="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              autoComplete="username"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              data-testid="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoComplete="current-password"
              required
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <button 
              type="submit" 
              data-testid="login-submit"
              className="btn btn-primary" 
              disabled={submitting}
            >
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
          
          <p className="text-center" style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
            Demo credentials: username: <strong>student</strong>, password: <strong>BankDemo@123</strong>
          </p>
        </form>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const state = localStorage.getItem('digitalBankingState');
      setIsLoggedIn(!!state);
    };
    checkLogin();
  }, []);

  const handleLogout = () => {
    resetBankData();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const goToLogin = () => navigate('/login');

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="card auth-card">
          <h2 className="text-center">Login Required</h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            You need to log in to access the dashboard.
          </p>
          <button className="btn" onClick={goToLogin}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <NavBar />
      <div className="card dashboard-card">
        <h2 className="text-center">Welcome to Digital Banking</h2>
        
        <div className="simulation-label" style={{ marginBottom: '16px', textAlign: 'center' }}>
          This is a simulated banking application for testing purposes only
        </div>

        <div className="dashboard-grid">
          <div className="card-item">
            <h3 className="card-title">Account Number</h3>
            <p className="card-value" data-testid="account-number">1000****3456</p>
            <p className="card-label">Savings Account</p>
          </div>
          <div className="card-item">
            <h3 className="card-title">Available Balance</h3>
            <p className="card-value" data-testid="account-balance">₹75,000</p>
          </div>
        </div>
        
        <div className="dashboard-nav">
          <Link to="/transfer" className="btn btn-primary" style={{ width: '100%', maxWidth: '300px' }}>
            Fund Transfer
          </Link>
          <Link to="/history" className="btn btn-secondary" style={{ width: '100%', maxWidth: '300px' }}>
            Transaction History
          </Link>
        </div>
      </div>
    </div>
  );
};

export const TransferPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { performTransfer } = require('../data/bankData.js');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      const { ok, error: transferError, transaction } = performTransfer(recipient, amount, description);
      
      if (ok) {
        setSuccess(true);
        setError('');
        setSubmitting(false);
        // Clear form
        setRecipient('');
        setAmount('');
        setDescription('');
        navigate('/history');
      } else {
        setError(transferError);
        setSuccess(false);
        setSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setSuccess(false);
      setSubmitting(false);
    }
  };

  const goToLogin = () => navigate('/login');

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="card auth-card">
          <h2 className="text-center">Login Required</h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            You need to log in to access the transfer feature.
          </p>
          <button className="btn" onClick={goToLogin}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <NavBar />
      <div className="card transfer-card">
        <h2 className="text-center">Fund Transfer</h2>
        
        <div className="simulation-label" style={{ marginBottom: '16px', textAlign: 'center' }}>
          Transfer from 1000****3456 to 1000****4321
        </div>
        
        {error && (
          <div className="error-msg" style={{ background: '#fdeae8', padding: '12px', marginBottom: '16px', borderRadius: '8px' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-msg" style={{ background: '#e6f4ea', padding: '12px', marginBottom: '16px', borderRadius: '8px' }}>
            Transfer successful!
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="label" htmlFor="recipient">Recipient Account Number</label>
            <input
              id="recipient"
              data-testid="recipient-account"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input"
              autoComplete="off"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="amount">Transfer Amount (₹)</label>
            <input
              id="amount"
              data-testid="transfer-amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              autoComplete="off"
              required
            />
            <small style={{ color: 'var(--text-secondary)' }}>
              Minimum ₹100, Maximum ₹50,000. Whole rupees only.
            </small>
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="description">Description (Optional)</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              autoComplete="off"
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <button 
              type="submit" 
              data-testid="transfer-submit"
              className="btn btn-primary" 
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const checkLogin = () => {
      const state = localStorage.getItem('digitalBankingState');
      setIsLoggedIn(!!state);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const { getTransactions } = require('../data/bankData.js');
    const txs = getTransactions();
    setTransactions(txs);
  }, []);

  const goToLogin = () => navigate('/login');

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="card auth-card">
          <h2 className="text-center">Login Required</h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            You need to log in to view transaction history.
          </p>
          <button className="btn" onClick={goToLogin}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <NavBar />
      <div className="card history-card">
        <h2 className="text-center">Transaction History</h2>
        
        {transactions.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="note-box" style={{ borderLeftColor: 'var(--blue)' }}>
              <strong>Empty State</strong><br />
              No transactions recorded. Complete a transfer to see history here.
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Recipient</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td data-testid={`tx-id-${tx.id}`}>{tx.id}</td>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>{tx.type}</td>
                  <td>{tx.recipient}</td>
                  <td data-testid={`tx-amount-${tx.id}`}>{tx.amount}</td>
                  <td data-testid={`tx-status-${tx.id}`}>
                    <span className={`badge ${tx.status === 'Completed' ? 'badge-success' : 'badge-failed'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};