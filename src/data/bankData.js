// Demo data layer for the simulated digital banking application.
// Uses localStorage for persistence with a deterministic reset function.

const DEMO_USER = 'student';
const DEMO_PASSWORD = 'BankDemo@123';

// Predefined demo accounts
const INITIAL_ACCOUNTS = {
  sender: {
    accountNumber: '1000123456',
    masked: '1000****3456',
    balance: 75000,
    type: 'Savings',
  },
  receiver: {
    accountNumber: '1000654321',
    masked: '1000****4321',
    balance: 20000,
    type: 'Savings',
  },
};

const STORAGE_KEY = 'digitalBankingState';
const TX_KEY = 'digitalBankingTransactions';

let state = null;
let transactions = null;

function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn('Failed to save banking state', e);
  }
}

function saveTransactions(txs) {
  try {
    localStorage.setItem(TX_KEY, JSON.stringify(txs));
  } catch (e) {
    console.warn('Failed to save transactions', e);
  }
}

// Initialize or load from localStorage
function init() {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (rawState) {
      state = JSON.parse(rawState);
    }
  } catch (e) {
    console.warn('Failed to parse stored banking state', e);
    state = null;
  }

  try {
    const rawTx = localStorage.getItem(TX_KEY);
    if (rawTx) {
      transactions = JSON.parse(rawTx);
    }
  } catch (e) {
    console.warn('Failed to parse stored transactions', e);
    transactions = null;
  }

  if (!state) {
    resetBankData();
  }
}

// Initialize on module load
init();

// Reset to deterministic initial state
function resetBankData() {
  state = {
    sender: { ...INITIAL_ACCOUNTS.sender },
    receiver: { ...INITIAL_ACCOUNTS.receiver },
  };
  transactions = [];
  saveState(state);
  saveTransactions(transactions);
}

// Login function
function login(username, password) {
  if (username === DEMO_USER && password === DEMO_PASSWORD) {
    return { ok: true };
  }
  return { ok: false, error: 'Invalid username or password' };
}

// Perform a transfer
function performTransfer(recipient, amount, description) {
  const result = { ok: false, error: null };

  // Validate recipient
  if (!recipient || recipient.trim() === '') {
    result.error = 'Recipient account number is required';
    return result;
  }
  if (recipient !== INITIAL_ACCOUNTS.receiver.accountNumber) {
    result.error = 'Recipient account must match the predefined receiver account';
    return result;
  }

  // Validate amount
  if (amount === '' || amount === null || amount === undefined) {
    result.error = 'Transfer amount is required';
    return result;
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount)) {
    result.error = 'Amount must be a valid number';
    return result;
  }

  if (!Number.isInteger(numAmount)) {
    result.error = 'Amount must be a whole rupee value (no decimals)';
    return result;
  }

  if (numAmount < 100) {
    result.error = 'Minimum transfer amount is ₹100';
    return result;
  }

  if (numAmount > 50000) {
    result.error = 'Maximum transfer amount is ₹50,000';
    return result;
  }

  if (numAmount < 0) {
    result.error = 'Amount cannot be negative';
    return result;
  }

  if (state.sender.balance < numAmount) {
    result.error = 'Insufficient balance';
    return result;
  }

  // Perform transfer
  state.sender.balance -= numAmount;
  state.receiver.balance += numAmount;

  const tx = {
    id: 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase(),
    timestamp: new Date().toISOString(),
    type: 'Fund Transfer',
    recipient: recipient,
    amount: numAmount,
    status: 'Completed',
    description: description || '',
  };

  transactions.unshift(tx);
  saveState(state);
  saveTransactions(transactions);

  result.ok = true;
  result.transaction = tx;
  return result;
}

// Get current state
function getCurrentState() {
  return state;
}

// Get transactions
function getTransactions() {
  return transactions;
}

// Export all functions
export {
  DEMO_USER,
  DEMO_PASSWORD,
  INITIAL_ACCOUNTS,
  resetBankData,
  getCurrentState,
  getTransactions,
  login,
  performTransfer,
};