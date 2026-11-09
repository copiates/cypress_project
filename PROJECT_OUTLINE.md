# Project Implementation — Phased Plan (with Express + SQLite Backend)

## Phase 1: Full Stack Scaffold
- Create `backend/` folder: `package.json`, `server.js`, `sqlite/`
- Create `database/init.sql` (accounts, transactions tables)
- Create `backend/routes/auth.js`, `routes/accounts.js`, `routes/transfer.js`, `routes/history.js`
- Update `frontend/src/App.jsx` to use `fetch()` instead of `localStorage`
- Update `frontend/src/data/bankData.js` to call backend endpoints

## Phase 2: Backend Database + Auth
- SQLite initialization with `better-sqlite3`
- `POST /api/auth/login` → returns session token
- `GET /api/accounts` → returns sender/receiver balances
- `POST /api/reset` → resets balances and clears transactions

## Phase 3: Fund Transfer Endpoint
- `POST /api/transfer` validates recipient, amount (min ₹100 / max ₹50,000 / whole rupees)
- Updates balances, creates transaction record in SQLite
- Returns success or error message

## Phase 4: Transaction History Endpoint
- `GET /api/history` → returns ordered transactions
- `GET /api/history/empty` → returns empty array

## Phase 5: Frontend Login Integration
- Login page calls `POST /api/auth/login`
- Stores token in `localStorage`
- Displays backend error messages (invalid credentials, missing fields)

## Phase 6: Frontend Dashboard + Protected Routes
- Dashboard reads `GET /api/accounts`
- Logout clears token + calls `POST /api/reset` (optional)
- Protected pages redirect to `/login` if no token

## Phase 7: Transfer Page Integration
- Transfer page uses `POST /api/transfer` via `fetch()`
- Displays backend errors (insufficient balance, invalid recipient, invalid amount)
- Shows success message with transaction reference

## Phase 8: History Page Integration
- History page fetches `GET /api/history`
- Renders transaction table, empty state, status badges

## Phase 9: Stable Selectors + Reset
- Verify all `data-testid` attributes present
- `POST /api/reset` for deterministic test state

## Phase 10: Cypress Config + Commands
- `cypress.config.js` with `baseUrl: 'http://localhost:3001'`
- `cypress/support/commands.js`: `cy.login()`, `cy.resetBankData()`

## Phase 11: Write All E2E Tests
- Login (TC-01, TC-02), Access control (TC-03, TC-04), Logout (TC-05)
- Positive transfer (TC-06), Boundary values (TC-07 to TC-11)
- Equivalence class (TC-12 to TC-15), Insufficient balance (TC-16), Invalid recipient (TC-17)
- Transaction history (TC-18)

## Phase 12: Full Suite Execution + Report
- `npm run test:e2e`
- Fix any test failures, verify determinism
- Final README, screenshots, test matrix, report
