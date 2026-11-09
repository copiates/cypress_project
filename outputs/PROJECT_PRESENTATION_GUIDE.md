# Digital Banking Cypress Project — Presentation Guide

## Project title

**Automated Functional Testing of a Digital Banking Application Using Cypress: Applying Equivalence Class and Boundary Value Testing**

---

## 1. The project in one minute

This is a **classroom simulation of a small digital banking application**. A user can sign in with demo credentials, view an account balance, transfer simulated rupees to one predefined recipient, and inspect successful transfers in transaction history.

The main purpose is not to build a real banking product. It is to demonstrate how to translate business rules into clear, repeatable functional tests. Cypress checks the application in a browser, while the test design focuses especially on **equivalence class testing** and **boundary value analysis** for transfer amounts.

The project has a React/Vite frontend, a small Express API, a local SQLite database, Cypress end-to-end tests, and Cypress component tests. **No real bank, payment gateway, or money is involved.**

### A concise opening script

> “Our project is an automated functional-testing demonstration for a simulated digital bank. The user can log in, view an account, make a transfer between two demo accounts, and see the completed transfer in history. We use Cypress to test those features, especially invalid and boundary transfer amounts. We also have component tests for the main pages and end-to-end tests for the integrated application.”

---

## 2. Project goals

The project aims to show that we can:

1. Understand a feature requirement and turn it into expected behavior.
2. Design positive and negative test cases rather than checking only the happy path.
3. Partition inputs into valid and invalid **equivalence classes**.
4. Test values at and immediately around business-rule **boundaries**.
5. Automate browser interactions and assertions with Cypress.
6. Keep test data repeatable so a test does not depend on what another test did.
7. Explain failures and use them to diagnose configuration or application problems.

This is a focused academic project. It intentionally does not include unrelated products such as loans, cards, bill payments, investments, or real payment integrations.

---

## 3. What the application does

### Sign-in and session access

A user signs in on a branded login page using the project’s predefined demo credentials:

| Item | Demo value |
|---|---|
| Username | `student` |
| Password | `BankDemo@123` |

The backend checks these values and returns a demo session token for a valid login. The frontend stores the token in browser `localStorage` and sends it with protected API requests. Invalid credentials produce a visible error. Signing out clears the browser token and asks the backend to revoke the session. Dashboard, transfer, and history views show a login-required message when no token is present.

### Dashboard

The dashboard retrieves the demo account information from the API. It shows the current sender balance, a masked account number, and links to start a transfer or view activity. After a successful transfer, the account balance reflects the change.

### Transfer

The transfer form takes a recipient account number, amount in rupees, and an optional note. The accepted demo recipient is `1000654321`. The sender account is `1000123456`.

The transfer rules are:

- The amount must be at least **₹100**.
- The amount may not exceed **₹50,000** per transfer.
- Amounts must be positive whole rupees; decimals are rejected.
- The sender must have sufficient funds.
- The recipient must be the predefined demo receiver.
- Only successful transfers change balances and appear in history.

A successful transfer deducts the same amount from the sender and credits the receiver. The interface displays a confirmation with the amount, recipient, and reference ID. Invalid attempts show an error and do not create a completed transfer.

### Transaction history

The activity page lists successful simulated transfers with a reference ID, date/time, recipient, amount, and status. If the account has no successful transfers, it shows a helpful empty state. Failed attempts are not recorded as completed history entries.

### Initial demo data

| Account role | Number | Initial balance |
|---|---:|---:|
| Sender | `1000123456` | ₹75,000 |
| Receiver | `1000654321` | ₹20,000 |

The screen masks account numbers in places to resemble a banking interface, but all account values are fictional.

---

## 4. How the pieces fit together

```text
User
  │ uses
  ▼
React interface (Vite, port 5173)
  │ fetches /api requests; Vite proxies them
  ▼
Express API (port 3002)
  │ validates session and transfer rules
  ▼
SQLite database (local backend/bank.db)
  ├── accounts
  └── transactions

Cypress
  ├── Component tests: mount one page at a time; stub API responses
  └── E2E tests: use the browser UI with the real frontend and API
```

### Main technologies

| Layer | Technology | Role in this project |
|---|---|---|
| Frontend | React | Login, dashboard, transfer, and history pages |
| Dev server/build | Vite | Serves the frontend and proxies `/api` to the backend |
| Routing | React Router | Routes such as `/login`, `/dashboard`, `/transfer`, `/history` |
| Backend | Node.js + Express | Login, session, account, transfer, history, and reset endpoints |
| Database | SQLite with `better-sqlite3` | Stores demo balances and successful transfer records locally |
| Test automation | Cypress | Runs real-browser component and end-to-end tests |

### Typical request flow

1. The login page sends the submitted username and password to `POST /api/auth/login`.
2. The API responds with a demo session token or an error.
3. The frontend includes that token in the `Authorization: Bearer …` header for protected requests.
4. The transfer API validates the recipient, amount, and available balance before updating data.
5. A successful transfer updates both account rows and adds one transaction record in a database transaction.
6. The dashboard and transaction-history page request updated data from the API.

The E2E Cypress runner starts missing services, checks whether already-running services are healthy, and reuses healthy frontend/API processes. It does not need to launch duplicate servers on ports that are already occupied.

---

## 5. What “component testing” means here

A **component test** mounts one React component (in this project, a full feature page such as LoginPage or TransferPage) in a browser, without running the complete application journey or depending on a live backend. Cypress intercepts the component’s API call and supplies a predictable response. We can then assert what the page renders and how it reacts.

The project currently has **four page-level component suites with two tests each**:

| Component suite | What is checked |
|---|---|
| Login | Invalid credentials show an error; successful login stores the token and navigates |
| Dashboard | A supplied account response appears as the balance and actions; missing session shows the access prompt |
| Transfer | A successful response produces a confirmation; a rejected response produces an error without leaving the page |
| History | A supplied transaction appears in the table; an empty response produces the designed empty state |

Component tests **do not verify the real backend implementation**. Their API responses are stubbed so the page behavior can be tested quickly and independently. The Cypress component setup imports the same `src/index.css` used by the running app and uses a **1280 × 800 desktop viewport**. This matters: without loading the app’s CSS, a mounted component looks unstyled; at Cypress’s small default viewport, the responsive mobile layout can be shown instead of the normal desktop design.

Run the component suite with:

```bash
npm run test:component
```

Open it in Cypress’s interactive runner with:

```bash
npm run test:component:open
```

---

## 6. What “end-to-end testing” means here

An **end-to-end (E2E) test** verifies a feature through the integrated application. Cypress opens the frontend in a browser, interacts with the user interface, and checks the outcome. For most feature assertions, it uses the real frontend and API rather than mocking every request.

The E2E suite is organized by feature:

| Spec file | Test cases | Main behaviors checked |
|---|---:|---|
| `login.cy.js` | 2 | TC-01 valid demo login and initial balance; TC-02 invalid password and visible error |
| `access-control.cy.js` | 2 | TC-03 dashboard is blocked without a session; TC-04 logout revokes the session and protected access is denied |
| `fund-transfer.cy.js` | 3 | TC-05 valid ₹5,000 transfer and updated balance; TC-16 insufficient funds; TC-17 invalid recipient |
| `boundary-value.cy.js` | 6 | TC-06 through TC-11 at, just within, and just outside the amount limits |
| `equivalence-class.cy.js` | 5 | TC-12 zero; TC-13 negative; TC-14 decimal; TC-15a empty; TC-15b non-numeric |
| `transaction-history.cy.js` | 2 | TC-18 successful transfer appears in history; empty history state |
| **Total** | **20** | A focused set of positive, negative, boundary, and record-verification cases |

Run all E2E cases in headless mode with:

```bash
npm run test:e2e
```

Open the interactive E2E runner (the helper also starts or reuses the app services) with:

```bash
npm run test:e2e:open
```

---

## 7. The two test-design techniques

### Equivalence class testing

Equivalence class testing groups inputs that should receive the same kind of result. Instead of trying every possible value, we choose representative examples from each group.

| Input class | Representative example | Expected result |
|---|---:|---|
| Valid range | ₹5,000 | Accept if the sender has enough funds and recipient is valid |
| Below minimum | ₹50 or ₹99 | Reject |
| Zero | ₹0 | Reject |
| Negative | −₹100 | Reject |
| Decimal | ₹100.50 | Reject because only whole rupees are allowed |
| Empty | Blank | Reject with an amount-required message |
| Non-numeric | `abc` | Reject with a number-validation message |
| Above maximum | ₹60,000 | Reject |

The purpose is to check the rule for representative members of each class, not to enumerate every possible input.

### Boundary value analysis

Boundary value analysis concentrates on values at and very near the edges of the valid interval. For this project, the valid interval is inclusive: **₹100 through ₹50,000**.

| Value | Position | Expected outcome |
|---:|---|---|
| ₹99 | Just below the minimum | Reject |
| ₹100 | Minimum boundary | Accept, if balance permits |
| ₹101 | Just above the minimum | Accept, if balance permits |
| ₹49,999 | Just below the maximum | Accept, if balance permits |
| ₹50,000 | Maximum boundary | Accept, if balance permits |
| ₹50,001 | Just above the maximum | Reject |

A simple way to explain the difference is: **equivalence classes divide the whole input space into groups; boundary testing samples the edges between valid and invalid ranges.** They complement each other.

### Why test ₹50,000 successfully?

The initial sender balance is ₹75,000, so a ₹50,000 transfer can meet both the maximum-transfer rule and the sufficient-funds rule. Each E2E case resets the account data first so a preceding transfer cannot unexpectedly make this boundary case fail.

---

## 8. How tests stay repeatable

Test reliability matters: the same test should produce the same result when run again.

### E2E data reset

Before each independent E2E case, a Cypress helper signs in through the API and calls the authenticated `POST /api/reset` endpoint. Reset restores the two initial balances and deletes transaction records. The test then signs in or visits the page needed for that case. This prevents one transfer test from affecting the next.

The reset is for automated testing; **the normal user application does not erase data on page load or on logout**.

### Stable selectors

Important form fields and outcome elements use `data-testid` attributes—for example, `username`, `transfer-amount`, `transfer-success`, and `transaction-history`. These selectors are more stable than selecting an element by its position or by fragile CSS styling details.

### Stubbed component responses

Component tests use `cy.intercept()` to return controlled API responses. That makes states such as invalid login, successful transfer, and empty history easy to reproduce without needing to modify SQLite data.

---

## 9. A suggested live demonstration

A short live demo can follow this order:

1. **Introduce the login page.** Mention that the credentials are demo-only and the experience is simulated.
2. **Show a failed login.** Enter a wrong password and point out the visible validation message.
3. **Sign in successfully.** Use `student` / `BankDemo@123`; show the initial ₹75,000 balance.
4. **Make a valid transfer.** Transfer ₹5,000 to `1000654321`; show the confirmation and reference.
5. **Verify the result.** Return to the dashboard to show ₹70,000, then open Activity to show the completed ₹5,000 transaction.
6. **Explain a boundary test.** Show the six test values from ₹99 through ₹50,001 and why the exact endpoints are accepted while the immediately adjacent outside values are rejected.
7. **Run the automated tests.** Run `npm run test:component` to show isolated page behavior, then `npm run test:e2e` to show integrated behavior.

For a smoother presentation, run tests before the session and keep the UI already open. If a dev server is already running, the E2E helper is designed to reuse it.

---

## 10. A short presentation outline

### Slide 1 — Title and purpose

State the title and explain that the application is a safe simulation created to demonstrate functional test automation.

### Slide 2 — Features and business rules

Show login, account overview, transfer, and transaction history. Highlight recipient validation, ₹100–₹50,000 whole-rupee limits, and sufficient funds.

### Slide 3 — Architecture

Show React/Vite → Express API → SQLite, with Cypress testing at the browser. Explain that component tests stub the API while E2E tests exercise the integrated services.

### Slide 4 — Test design

Explain equivalence partitions and the six boundary values. Give one invalid-class example such as decimal input and one boundary example such as ₹99 versus ₹100.

### Slide 5 — Automation and repeatability

Show `data-testid` selectors, API response interception for component tests, and authenticated database reset for E2E cases.

### Slide 6 — Results and limitations

Report 20 E2E cases and 8 component cases (when demonstrating a run with those results). Clarify that the project is a teaching prototype—not production banking or real authentication.

---

## 11. Questions someone may ask

### “Why use Cypress?”

Cypress runs tests in a real browser and provides commands for interacting with forms, asserting visible feedback, intercepting network calls, and debugging failures. It supports both the integrated E2E tests and the isolated React component tests used here.

### “What is the difference between component and E2E tests?”

A component test mounts one feature page and usually stubs its API so we can isolate the page’s rendering and behavior. An E2E test follows the feature through the running app and backend, so it checks whether the integrated parts work together. Component tests are faster and narrower; E2E tests are broader and closer to a real user journey.

### “Why not test every possible amount?”

There are too many possible inputs. Equivalence classes let us select representatives from groups expected to behave alike, while boundary value analysis targets the range edges where validation mistakes are common.

### “How do you know a failed transfer did not change the balance?”

The insufficient-funds E2E case attempts a ₹50,000 transfer, then an additional ₹26,000. The second request must show an insufficient-balance error; the test also checks that history contains only the first successful transaction. The API checks available funds before committing a transfer.

### “Are the tests independent?”

The E2E suite resets balances and transaction records before each case. Component tests start from a cleared browser state and use their own stubbed responses.

### “Is this a secure or production-ready bank?”

No. It is a controlled classroom demonstration. Credentials and session handling are deliberately simple, the account data is fictional, and no real payment service is connected. Production banking would require substantially stronger authentication, security controls, auditability, compliance, and infrastructure.

### “Why use SQLite?”

SQLite provides a small local database for account balances and transaction records without requiring a separate database server. It makes the demo easier to run while still allowing the backend to persist state between page requests.

---

## 12. Scope and limitations

The project is deliberately limited to one demo user, two simulated accounts, local session handling, one predefined recipient, balance reads, transfers, and successful-transfer history. It does not provide production-grade authentication, multi-user accounts, OTP, account recovery, real bank integrations, payment settlement, or external compliance/security controls.

The test suite provides meaningful functional coverage for the defined classroom requirements; it does not claim exhaustive coverage of all browsers, devices, security risks, failure modes, or production banking concerns. Component tests verify UI behavior with mocked API responses; the E2E suite verifies the integrated app for the selected scenarios.

---

## 13. Useful commands and demo access

From the project root:

```bash
# Build the frontend
npm run build

# Run all 20 E2E tests; the runner starts or reuses the app servers
npm run test:e2e

# Open the E2E runner
npm run test:e2e:open

# Run the 8 React page-component tests
npm run test:component

# Open the component-test runner
npm run test:component:open
```

For a fresh setup, install root dependencies with `npm install` in the project root, and backend dependencies with `npm install` inside `backend/`.

The E2E frontend is served at `http://127.0.0.1:5173`; the API is at `http://127.0.0.1:3002`. Demo login: `student` / `BankDemo@123`.

---

## Closing statement

> “This project combines a realistic-looking banking simulation with systematic test design. Cypress checks both individual page behavior and complete user flows, while equivalence classes and boundary values help us choose meaningful transfer inputs. The outcome is a repeatable demonstration of how requirements become automated tests—not a real financial service.”
