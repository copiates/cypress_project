# Project Specification: Automated Functional Testing of a Digital Banking Application using Cypress

## Applying Equivalence Class and Boundary Value Testing

**Project type:** Software Testing / Test Automation\
**Testing framework:** Cypress\
**Application under test:** Simulated Digital Banking Web Application\
**Academic scope:** Focused college-level project; intentionally limited
to the features and testing techniques described below.

------------------------------------------------------------------------

## 1. Project overview

Build a small, realistic-looking **simulated digital banking web
application** and use Cypress to automate its functional testing.

The purpose of the project is not to create a full banking product. The
application exists as a controlled system under test so that Cypress can
demonstrate automated browser testing and the selected black-box
test-design techniques.

The project must focus on:

1.  Login and account access.
2.  Fund transfers between two simulated accounts.
3.  Transaction history.
4.  Positive and negative functional test cases, with particular
    emphasis on **Equivalence Class Testing** and **Boundary Value
    Testing** for transfer amounts.

Do not add unrelated banking features such as loans, credit cards, bill
payments, beneficiary management, investment products, admin portals, or
real payment integrations.

## 2. Final academic title

**Automated Functional Testing of a Digital Banking Application using
Cypress: Applying Equivalence Class and Boundary Value Testing**

Use this title consistently in the README, report, presentation and
project description.

## 3. Project objectives

The project should demonstrate that the student can:

-   Understand the expected behaviour of a web application from
    functional requirements.
-   Design black-box test cases from those requirements.
-   Identify valid and invalid equivalence classes for transaction
    inputs.
-   Identify and test values at and around defined transaction
    boundaries.
-   Automate browser-based functional tests using Cypress.
-   Use assertions to compare actual application behaviour with expected
    outcomes.
-   Observe, explain and debug both passing and failing test cases.

## 4. Application scope and business rules

### 4.1 Simulated user and accounts

Provide one predefined demo user and two simulated accounts.

Suggested demo credentials:

  Field                      Value
  -------------------------- ----------------
  Username                   `student`
  Password                   `BankDemo@123`
  Sender account             `1000123456`
  Receiver account           `1000654321`
  Initial sender balance     ₹75,000
  Initial receiver balance   ₹20,000

These are fictional values for a classroom demonstration. Display a
visible note that this is a simulation and not a real banking service.

### 4.2 Login and account access

The user must be able to:

-   Open the login page.
-   Enter a username and password.
-   Log in using the predefined demo credentials.
-   See a clear error message for incorrect credentials.
-   Log out and return to the login page.
-   Be prevented from opening the dashboard or transfer page when not
    logged in.

Keep authentication deliberately simple. Do not implement real-world
authentication, OTP delivery, password recovery, or security
infrastructure. This is a teaching demo, not a production authentication
system.

### 4.3 Account dashboard

After login, display:

-   A welcome message.
-   Sender account number, with part of it masked in the interface if
    desired.
-   Available balance.
-   A clear navigation link to Fund Transfer.
-   A link to Transaction History.
-   A logout action.

The dashboard should show the current balance after a successful
transfer.

### 4.4 Fund transfer

The user must be able to transfer money from the predefined sender
account to the predefined receiver account.

Transfer form fields:

-   Recipient account number.
-   Transfer amount in Indian rupees.
-   Optional description or remarks.

Use these business rules consistently throughout the application and
tests:

  -----------------------------------------------------------------------
  Rule                                Requirement
  ----------------------------------- -----------------------------------
  Minimum transfer                    ₹100

  Maximum transfer per transaction    ₹50,000

  Amount format                       Positive whole rupees; decimals are
                                      not accepted

  Sender balance                      Must be sufficient for the transfer

  Recipient                           Must match the predefined receiver
                                      account

  Successful transfer                 Deduct amount from sender and add
                                      the same amount to receiver

  Failed transfer                     Must not change either account
                                      balance

  Transaction history                 Record successful transfers and
                                      rejected attempts if the interface
                                      is designed to show them; clearly
                                      distinguish their statuses
  -----------------------------------------------------------------------

The amount field must not silently round or alter invalid input. Display
a useful validation message.

A successful transfer should show a confirmation containing the amount
and recipient account. The application must update the displayed
balances and transaction history.

For this project, use a deterministic simulated transfer. Do not connect
to a real bank, payment gateway or financial API.

### 4.5 Transaction history

Display a simple transaction table containing:

-   Transaction/reference ID.
-   Date and time.
-   Transaction type.
-   Recipient or account involved.
-   Amount.
-   Status.

At minimum, successful transfers must appear in the history. If failed
attempts are recorded, label them clearly as failed and ensure they do
not appear as completed debits.

Include a useful empty state when there are no transactions.

## 5. Testing concepts and how they apply

The project should concentrate on these syllabus-aligned concepts rather
than attempting to cover every topic in the course.

### 5.1 Functional testing

Check that each in-scope feature behaves according to its stated
requirements:

-   Valid login succeeds.
-   Invalid login is rejected.
-   A valid transfer succeeds.
-   An invalid transfer is rejected.
-   Balances update correctly after success.
-   Balances remain unchanged after failure.
-   The transaction appears correctly in history.
-   Logout ends access to protected pages.

### 5.2 Black-box testing

Design tests using the application's stated requirements and observable
outputs. Tests should not depend on inspecting the internal
implementation to decide what the expected result should be.

For example, enter a transfer amount, submit the form, and verify the
visible result and account balances.

### 5.3 Equivalence Class Testing

Partition transfer amount inputs into classes that are expected to
behave similarly.

For the defined transfer rules:

  Equivalence class     Example input Expected result
  ------------------- --------------- ----------------------------------------
  Below minimum                   ₹50 Reject
  Valid range                  ₹5,000 Accept, provided balance is sufficient
  Above maximum               ₹60,000 Reject
  Zero                             ₹0 Reject
  Negative amount               -₹100 Reject
  Non-numeric input             `abc` Reject
  Decimal amount              ₹100.50 Reject under the whole-rupee rule
  Empty amount                  Blank Reject

Use representative values from each class. Explain in the report why the
selected values represent their respective classes.

### 5.4 Boundary Value Testing

The valid transfer interval is ₹100 to ₹50,000, inclusive.

Use the following boundary-focused values:

    Test value Position             Expected result
  ------------ -------------------- ----------------------------------
           ₹99 Just below minimum   Reject
          ₹100 Minimum boundary     Accept, if balance is sufficient
          ₹101 Just above minimum   Accept, if balance is sufficient
       ₹49,999 Just below maximum   Accept, if balance is sufficient
       ₹50,000 Maximum boundary     Accept, if balance is sufficient
       ₹50,001 Just above maximum   Reject

These values are the core demonstration of normal boundary testing. Do
not claim to implement every possible boundary-testing variant unless it
is actually included and explained.

### 5.5 Positive and negative testing

Positive examples:

-   Correct login.
-   Transfer of ₹5,000.
-   Transfer at the minimum allowed amount.
-   Transfer at the maximum allowed amount.
-   Correct balance and history updates.

Negative examples:

-   Incorrect login.
-   Empty amount.
-   Amount below minimum.
-   Amount above maximum.
-   Negative, zero, decimal or non-numeric amount.
-   Insufficient balance.
-   Incorrect recipient account.
-   Attempt to access a protected page after logout.

## 6. Recommended test-case set

Aim for approximately **15--20 meaningful Cypress test cases**. Avoid
inflating the count with repetitive tests.

The following 18 cases provide a suggested baseline. The implementation
may group related checks into test suites, but each case should have a
clear purpose and expected outcome.

  -----------------------------------------------------------------------
  ID                Area              Scenario          Expected outcome
  ----------------- ----------------- ----------------- -----------------
  TC-01             Login             Login with valid  Dashboard opens
                                      demo credentials  

  TC-02             Login             Login with        Error displayed;
                                      incorrect         user remains
                                      password          logged out

  TC-03             Access            Open dashboard    Redirect to login
                                      without logging   or show access
                                      in                restriction

  TC-04             Logout            Log out and       Protected access
                                      revisit dashboard is denied

  TC-05             Transfer          Transfer ₹5,000   Transfer succeeds
                                      to valid receiver 

  TC-06             Transfer          Transfer ₹100     Accepted at
                                                        minimum boundary

  TC-07             Transfer          Transfer ₹99      Rejected below
                                                        minimum

  TC-08             Transfer          Transfer ₹101     Accepted just
                                                        above minimum

  TC-09             Transfer          Transfer ₹50,000  Accepted at
                                                        maximum boundary,
                                                        if balance
                                                        permits

  TC-10             Transfer          Transfer ₹50,001  Rejected above
                                                        maximum

  TC-11             Transfer          Transfer ₹49,999  Accepted just
                                                        below maximum, if
                                                        balance permits

  TC-12             Equivalence class Submit ₹0         Rejected

  TC-13             Equivalence class Submit a negative Rejected
                                      amount            

  TC-14             Equivalence class Submit a decimal  Rejected
                                      amount            

  TC-15             Equivalence class Submit            Rejected
                                      non-numeric or    
                                      empty amount      

  TC-16             Business rule     Transfer more     Rejected;
                                      than available    balances
                                      balance           unchanged

  TC-17             Recipient         Enter an invalid  Rejected;
                                      recipient account balances
                                                        unchanged

  TC-18             Records           Complete a valid  Correct
                                      transfer and      transaction and
                                      inspect history   status displayed
  -----------------------------------------------------------------------

Important test-data note: TC-09 and TC-11 require the sender to have
enough money. Reset the demo data before each independent test or
deliberately set a suitable test balance. Do not let a previous test's
transfer affect the result of a later test.

## 7. Technology stack

Use a simple stack that an AI coding assistant or student can build and
maintain.

### Frontend

-   React
-   Vite
-   React Router
-   CSS or Tailwind CSS (choose one; avoid unnecessary UI dependencies)

### Test automation

-   Cypress
-   Cypress End-to-End testing
-   Cypress assertions and commands
-   Cypress fixtures where useful

### State and data

For the simplest reliable classroom project, use a small local
simulation with browser storage or a lightweight mock data layer. The
application must have a predictable way to reset demo data.

A backend is optional, not required for the agreed scope. Do not add a
database or server merely to make the project look more complex. If a
backend is introduced, keep it small and ensure the tests remain
deterministic.

## 8. Cypress implementation requirements

### 8.1 Test organisation

Organise tests by feature. Suggested structure:

``` text
digital-banking-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js
│   │   ├── access-control.cy.js
│   │   ├── fund-transfer.cy.js
│   │   ├── equivalence-class.cy.js
│   │   ├── boundary-value.cy.js
│   │   └── transaction-history.cy.js
│   ├── fixtures/
│   │   └── demo-data.json
│   └── support/
│       ├── e2e.js
│       └── commands.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── App.jsx
│   └── main.jsx
├── cypress.config.js
├── package.json
└── README.md
```

The AI developer may adjust this structure if there is a clear technical
reason, but keep application code and Cypress tests separate.

### 8.2 Stable selectors

Add stable `data-testid` attributes to interactive elements and
important output fields. Examples:

-   `data-testid="username"`
-   `data-testid="password"`
-   `data-testid="login-submit"`
-   `data-testid="account-balance"`
-   `data-testid="recipient-account"`
-   `data-testid="transfer-amount"`
-   `data-testid="transfer-submit"`
-   `data-testid="transfer-error"`
-   `data-testid="transfer-success"`
-   `data-testid="transaction-history"`

Use these selectors in Cypress rather than relying heavily on fragile
CSS classes or element positions.

### 8.3 Reusable Cypress commands

Create small reusable commands where useful, such as:

-   `cy.login()`
-   `cy.resetBankData()`
-   `cy.performTransfer(amount, recipient)`

Do not over-abstract simple tests. A beginner should be able to read and
explain the test code.

### 8.4 Test isolation and deterministic data

This is essential:

-   Each test must start from a known state.
-   Reset balances and transaction history before tests that depend on
    initial values.
-   Tests must not rely on the order in which other tests run.
-   Use fixed demo data rather than unpredictable random account
    balances.
-   Avoid real network dependencies.
-   Ensure that a failed test does not leave later tests with corrupted
    state.

### 8.5 Assertions

Assertions should verify actual outcomes, not just that buttons can be
clicked.

Examples:

-   Dashboard heading is visible after login.
-   Error message appears for invalid input.
-   Sender balance decreases by the correct amount after a successful
    transfer.
-   Receiver balance increases by the same amount.
-   Balances remain unchanged after a rejected transfer.
-   Transaction history contains the correct amount, recipient and
    status.

## 9. User interface requirements

The application should look like a clean, professional banking
dashboard, not a plain HTML form.

Suggested visual direction:

-   Professional navy, blue, white and light-grey palette.
-   Sidebar or top navigation.
-   Account balance card.
-   Clearly labelled transfer form.
-   Transaction history table.
-   Success and error feedback.
-   Responsive layout that works on a laptop and mobile-sized viewport.

Keep the UI restrained and readable. Visual polish is useful for the
presentation, but should not distract from the testing work.

## 10. Demonstration plan

Prepare a short live demonstration of approximately 5--7 minutes.

1.  **Introduce the application:** Explain that it is a simulated
    banking system and identify the transfer rules.
2.  **Show a successful test:** Open Cypress and run a valid transfer
    test. Show the browser actions and assertions.
3.  **Show equivalence class testing:** Run representative valid and
    invalid amount tests.
4.  **Show boundary value testing:** Demonstrate ₹99, ₹100, ₹101,
    ₹49,999, ₹50,000 and ₹50,001.
5.  **Show a negative test:** Demonstrate insufficient balance or an
    invalid recipient.
6.  **Explain the result:** Show the Cypress pass/fail summary and
    explain one assertion.

Keep the Cypress Test Runner visible during the demonstration. The main
point is to show how Cypress executes and verifies the test cases, not
merely to show the banking interface.

## 11. Required project deliverables

The completed project should include:

1.  Working React digital banking simulation.
2.  Cypress configuration and organised E2E test suites.
3.  Approximately 15--20 meaningful automated test cases.
4.  Test-case documentation showing ID, requirement, input, steps and
    expected result.
5.  A mapping of test cases to equivalence classes and boundary values.
6.  README with installation, run and test commands.
7.  Screenshots of the application and Cypress test execution.
8.  A short project report describing scope, methodology, test results,
    limitations and conclusion.

Do not build a separate analytics dashboard unless time remains.
Cypress's own Test Runner and test results are sufficient for the core
demonstration.

## 12. README commands

The project should provide simple commands such as:

``` bash
npm install
npm run dev
```

In another terminal:

``` bash
npx cypress open
```

For headless execution:

``` bash
npx cypress run
```

Add suitable scripts to `package.json`, for example:

``` json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test:e2e:open": "cypress open",
    "test:e2e": "cypress run"
  }
}
```

The final README must explain which terminal runs the application and
which command runs Cypress.

## 13. Acceptance criteria

The project is complete only when:

-   The application can be installed and started using the README
    instructions.
-   The demo user can log in and log out.
-   A valid transfer updates both simulated account balances correctly.
-   Invalid transfers are rejected with understandable messages.
-   Failed transfers do not alter account balances.
-   Successful transfers appear in transaction history.
-   Equivalence class and boundary value cases are explicitly
    documented.
-   Cypress can execute the test suites reliably from a clean state.
-   Tests verify expected outcomes with meaningful assertions.
-   The student can explain the purpose of each test and demonstrate the
    Cypress Test Runner.

## 14. Scope restrictions and instructions to the AI developer

Follow these restrictions carefully:

-   Do not turn this into a full banking platform.
-   Do not add real payment processing, real bank APIs, real credentials
    or real financial data.
-   Do not add bill payments, loans, cards, investments, beneficiary
    workflows or admin features.
-   Do not add unrelated testing frameworks.
-   Do not claim Cypress performs load testing, formal mutation testing
    or complete unit testing.
-   Do not claim complete test coverage. Report only the test cases
    actually implemented and executed.
-   Do not create a large, complicated backend unless there is a clear
    need.
-   Do not generate superficial tests that only check whether a page
    loads or a button exists.
-   Prioritise correct transfer behaviour, clear test design, stable
    Cypress execution and explainable results.
-   Use accessible labels and stable test selectors.
-   Include comments where they help a student understand the test
    logic.

## 15. Recommended implementation order

Build the project in this order:

1.  Create the React/Vite application and basic navigation.
2.  Implement the demo login and protected dashboard.
3.  Implement the two simulated accounts and fund transfer rules.
4.  Implement transaction history.
5.  Add stable test selectors and a reliable test-data reset mechanism.
6.  Configure Cypress.
7.  Write login and basic functional tests.
8.  Write equivalence class tests.
9.  Write boundary value tests.
10. Run all tests, fix failures and verify repeatability.
11. Prepare the README, test-case matrix and demonstration screenshots.

**Final instruction:** Build this as a focused academic software-testing
project. The banking application should be only as large as necessary to
demonstrate Cypress-based functional testing, Equivalence Class Testing
and Boundary Value Testing clearly and reliably.

---

# Explanation of the Implemented Project

The sections above describe the project's intended requirements. This section explains how the current implementation works in practice, where to make changes, and how its two kinds of Cypress tests run.

## 1. How the banking application works

This is a simulated web banking application with a browser interface, a local API, and a local SQLite database. It is not connected to a real bank or payment provider, and it cannot move real money.

### The main parts

| Part | Project location | Responsibility |
|---|---|---|
| React pages | `src/components/` | Display login, dashboard, transfer form, and transaction history |
| Router | `src/App.jsx` | Maps `/login`, `/dashboard`, `/transfer`, and `/history` to their pages |
| Global styles | `src/index.css` | Defines the shared responsive banking interface |
| Vite frontend server | Port `5173` | Serves the UI and forwards `/api` requests to the backend |
| Express API | `backend/server.js`, `backend/routes/` | Handles demo sign-in, account data, transfers, history, and reset |
| SQLite database | `backend/bank.db` | Stores the two demo account balances and completed transfers |

### A user's normal journey

1. **Sign in:** The login page sends the entered credentials to `POST /api/auth/login`. The API compares them with the predefined demo credentials. A valid sign-in creates a demo session token; invalid credentials return an error for the page to show.
2. **Open the dashboard:** The browser stores the token in `localStorage`. The dashboard sends it in an `Authorization: Bearer ...` header to `GET /api/accounts`. The API checks the token and returns both simulated accounts. The page displays the sender's current balance and masked account number.
3. **Submit a transfer:** The transfer form sends the recipient, amount, and optional description to `POST /api/transfer`. The API checks authentication, recipient, amount format, minimum and maximum values, and available sender balance.
4. **Commit success:** If every rule passes, the API uses a SQLite database transaction to deduct money from the sender, credit the receiver, and insert one completed transaction record. The page displays a success message and reference ID.
5. **Show updated information:** The dashboard fetches account data again when opened. The history page requests `GET /api/history` and shows successful transfers, or an empty state when there are none.
6. **Sign out:** The page calls `POST /api/auth/logout`, removes the token from browser storage, and returns to `/login`. The backend revokes that token, so protected API requests using it are rejected.

The database starts with sender account `1000123456` at ₹75,000 and receiver account `1000654321` at ₹20,000. A valid amount is an integer from ₹100 to ₹50,000 inclusive. The sender also needs enough balance, and only the predefined receiver is accepted.

### Main API routes

| Route | Purpose |
|---|---|
| `POST /api/auth/login` | Validate demo credentials and issue a session token |
| `GET /api/auth/me` | Check whether a bearer token represents an active demo session |
| `POST /api/auth/logout` | Revoke the supplied demo session token |
| `GET /api/accounts` | Return the two account records and current balances |
| `POST /api/transfer` | Validate and perform a simulated transfer |
| `GET /api/history` | Return successful transfer records, newest first |
| `POST /api/reset` | Restore demo balances and remove transactions for test setup |
| `GET /api/health` | Let the E2E runner check that the API is ready |

The session is intentionally simple for a classroom project: tokens live in an in-memory server-side map and are not production authentication. Restarting the API clears active sessions. SQLite account and transaction data is local to the project.

## 2. What `scripts/run-e2e.js` does

`scripts/run-e2e.js` is a **test-environment launcher and cleanup script**. It does not contain banking rules, dashboard rendering, or Cypress test cases. Its job is to make sure the application services are available before the E2E tests start.

When `npm run test:e2e` is executed, the package script runs `node scripts/run-e2e.js`. The helper:

1. Checks the API health endpoint at `http://127.0.0.1:3002/api/health`.
2. Checks the frontend at `http://127.0.0.1:5173/`.
3. Reuses each service if it already responds as the expected project service; otherwise it starts the missing backend and/or Vite frontend.
4. Waits until both services are ready, then starts Cypress in headless `run` mode.
5. Returns Cypress's exit code so a test failure is visible to the command line.
6. Stops only the frontend/backend processes it started. It does not stop services it found already running.

With `npm run test:e2e:open`, the same helper performs the startup/reuse checks but launches Cypress's interactive `open` mode. This is why the helper is relevant to E2E testing: E2E tests need the whole web application and API running together.

If a port is occupied by a process that is not the expected healthy project service, the helper cannot safely assume that process is the right app. It reports a startup/port problem rather than changing or killing an unrelated process.

### Why the helper is not where dashboard problems are fixed

The helper runs before Cypress and is concerned with **processes and ports**. It has no role in how a balance card looks, how the dashboard formats a balance, or how the `/api/accounts` response is interpreted.

Fix a dashboard problem in the layer that owns it:

- **Layout, text, or visual issue:** edit `src/components/DashboardPage.jsx` and/or `src/index.css`.
- **Wrong or missing account data:** inspect `src/components/DashboardPage.jsx`, `backend/routes/accounts.js`, and the SQLite seed/reset data.
- **Login/access behavior:** inspect the page/session flow in `src/App.jsx`, `src/components/`, and `backend/routes/auth.js`.
- **A behavior that regressed:** add or correct an assertion in `cypress/component/dashboard.cy.jsx` or the relevant E2E spec.
- **A service that will not start:** inspect `scripts/run-e2e.js`, the service logs, and whether ports 5173 or 3002 are occupied.

Tests detect and document behavior; application code is where product behavior is fixed. Putting dashboard changes into a server launcher would mix unrelated responsibilities and make the project harder to understand.

## 3. What component-test setup does

There already is a component-test helper/setup file: `cypress/support/component.js`. Cypress loads it automatically for component tests. It:

- registers Cypress's React `mount` command;
- imports `src/index.css`, so a mounted page uses the application's real styles;
- clears browser cookies and local storage before each component test.

The component configuration in `cypress.config.js` tells Cypress to look in `cypress/component/`, use React and Vite to mount tests, and use a 1280 × 800 desktop viewport. Cypress starts its own temporary Vite component server on an available port. It does not need the normal E2E services at ports 5173 and 3002 because component tests stub API requests with `cy.intercept()`.

For example, `cypress/component/dashboard.cy.jsx` stores a sample test token, intercepts `GET /api/accounts` with a predictable account response, mounts `DashboardPage` inside a router, then checks the displayed balance and navigation actions. A second test mounts the same page without a token and checks the login-required message. These tests verify the dashboard's UI behavior without reading or changing the real SQLite database.

Run component tests using:

```bash
npm run test:component
npm run test:component:open
```

There is normally no need to add a separate shell launcher for component tests. Cypress already starts and manages the component dev server. The existing Cypress support file handles component-specific setup, while the E2E runner handles the separate requirement of starting/reusing the full application and backend.

## 4. What happens during an E2E test

The E2E suite checks real user-facing journeys through the running frontend and backend. The overall sequence is:

```text
npm run test:e2e
       ↓
scripts/run-e2e.js checks/reuses/starts frontend and API
       ↓
Cypress opens the frontend in its browser
       ↓
Test interacts with fields and buttons using data-testid selectors
       ↓
Frontend sends requests through Vite to the Express API
       ↓
API validates the request and reads/updates SQLite
       ↓
Cypress checks the visible result, balance, access, or history
```

Each independent feature test calls `cy.resetBankData()` first. That custom Cypress command signs in to the demo API, then makes an authenticated `POST /api/reset` request. The reset returns balances to ₹75,000 and ₹20,000 and clears transaction records. This prevents an earlier test from changing the starting state of a later test.

When a login test is specifically testing the login screen, it types into the actual login UI. Some other tests use the `cy.login()` helper to acquire a valid token and visit their target page directly. That is a deliberate testing shortcut: it avoids repeating sign-in steps in tests whose subject is a transfer, boundary, or history behavior. It does not replace the separate tests that verify valid and invalid login through the UI.

## 5. How the test suites relate

| Test type | Runs against | API behavior | Example question answered |
|---|---|---|---|
| Component | One mounted React page at a time | Stubbed with Cypress intercepts | Does DashboardPage show the balance and correct links for a known response? |
| End-to-end | Integrated frontend, Express API, and local SQLite | Real project API | Does a valid transfer update the sender's balance and appear in history? |

Component tests are focused and quick. E2E tests cover the connections between browser, server, and database. Both are useful; neither makes the other unnecessary.

The E2E input tests use two complementary design techniques:

- **Equivalence classes** represent groups such as whole valid amounts, decimals, empty values, negative values, and non-numeric text.
- **Boundary values** check ₹99, ₹100, ₹101, ₹49,999, ₹50,000, and ₹50,001 around the valid ₹100–₹50,000 interval.

Other E2E cases check correct/incorrect login, protected access, logout, an invalid recipient, insufficient balance, a successful transfer, and both populated and empty history.

## 6. A practical development and debugging process

When a requirement or reported problem is worked on, use this sequence:

1. **Describe the expected behavior.** For example: “After a successful ₹5,000 transfer from a ₹75,000 sender balance, the dashboard should show ₹70,000.”
2. **Find the layer responsible.** A display problem belongs to React/CSS; a data problem may belong to the API/database; a test startup problem belongs to Cypress configuration or the runner.
3. **Write or update the focused test.** Use a component test for isolated page behavior, an E2E test for the integrated user flow, or both when useful.
4. **Make the application change in its own code.** Do not hide UI fixes inside test setup or process-launch scripts.
5. **Run the narrow test first.** For dashboard rendering, run `npm run test:component` (or the dashboard spec alone). If the behavior crosses into the API, also run `npm run test:e2e`.
6. **Run the build and broader tests.** Use `npm run build` and the relevant full suite to check for regressions.
7. **Explain what passed and what was not tested.** Passing selected tests is not a claim of complete production coverage.

### If a dashboard test fails

First read the failing Cypress assertion and screenshot. Check whether the failure is in the rendered label/balance, the mocked API call, or the desktop styling. Then compare the test's mocked response with the shape returned by `GET /api/accounts`. If the backend request itself is the problem, investigate the API and data separately with E2E tests. The runner is only a suspect if Cypress could not start or connect to the services; it is not the repair location for dashboard UI or business behavior.

## 7. Suggested explanation when presenting the process

> “We start from a requirement and define the expected result. For isolated page behavior, Cypress mounts the React page, loads the same app styles, and stubs API responses. For integrated behavior, our runner makes sure the Vite frontend and Express API are ready, then Cypress drives the browser while the API reads or updates SQLite. Before each E2E case, the test helper resets the demo data so results are repeatable. If a test exposes a dashboard bug, we fix the React page, styling, or account API—not the runner. The runner only manages the test environment.”

This explanation distinguishes **application behavior**, **test setup**, and **test execution**—three different responsibilities that are important when diagnosing failures and presenting the design.
