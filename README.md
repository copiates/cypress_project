# Digital Banking Cypress — Automated Functional Testing

**Project title:** Automated Functional Testing of a Digital Banking Application using Cypress: Applying Equivalence Class and Boundary Value Testing

This project is a classroom-only banking simulation: a React/Vite frontend, an Express/SQLite API, and Cypress browser tests for login, access control, fund transfers, and transaction history. It does not connect to a real bank or move real money.

## Start and test

Requirements: Node.js 18 or newer and npm. Install dependencies once with `npm install` in the project root and `npm install` inside `backend/`.

```bash
# Run just the frontend or backend manually, in separate terminals
npm run dev

cd backend && npm start

# Run the full Cypress end-to-end suite. The helper starts missing services and reuses healthy servers.
npm run test:e2e

# Run React component tests in headless mode (the API is stubbed; no app servers needed)
npm run test:component

# Open the Cypress component testing UI
npm run test:component:open

# Open the interactive Cypress runner (also starts both app servers)
npm run test:e2e:open

```

The UI runs at `http://127.0.0.1:5173`; the API is at `http://127.0.0.1:3002`. Vite proxies `/api` calls to the API. Cypress `baseUrl` and API helper URL are defined in `cypress.config.js`; reusable UI-login and authenticated reset commands live in `cypress/support/commands.js`.

## Component testing

Component tests mount one React component in a real browser without navigating through the full application or requiring a live API. In this project, component suites cover the Login, Dashboard, Transfer, and Transaction History pages. The login tests stub the sign-in endpoint; the dashboard, transfer, and history tests stub their API responses and assert visible states and actions. Cypress component support imports the same `src/index.css` stylesheet as the app entry point and uses a 1280×800 desktop viewport, so mounted pages use the project’s normal desktop design instead of the default 500×500 mobile breakpoint. Use `npm run test:component` for a headless run or `npm run test:component:open` to explore tests in Cypress. These complement (rather than replace) the end-to-end tests, which exercise the integrated frontend and backend.

## Demo data

- Username: `student`
- Password: `BankDemo@123`
- Sender account: `1000123456` (initial balance ₹75,000)
- Receiver account: `1000654321` (initial balance ₹20,000)
- Valid transfer: whole rupees from ₹100 to ₹50,000 inclusive, to the predefined receiver, with sufficient sender balance.

Every independent Cypress case gets a deterministic database reset through the authenticated `POST /api/reset` endpoint. The application itself does not reset user data on page load or logout.

## Automated cases

The suite exercises valid/invalid login and logout; protected dashboard access; successful and rejected transfers; recipient validation; insufficient funds; and transaction-history rendering/empty state. Boundary tests cover ₹99, ₹100, ₹101, ₹49,999, ₹50,000, and ₹50,001. Equivalence classes include zero, negative, decimal, empty, and non-numeric input.

Cypress selectors are kept stable with `data-testid` attributes. Tests use the real browser UI for feature behavior; API requests are used only to acquire a test session and reset deterministic fixture data.
