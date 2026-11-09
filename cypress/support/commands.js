const apiUrl = () => Cypress.env('apiUrl') || 'http://127.0.0.1:3002/api';

Cypress.Commands.add('resetBankData', () => {
  cy.request('POST', `${apiUrl()}/auth/login`, { username: 'student', password: 'BankDemo@123' })
    .then(({ body }) => {
      expect(body.ok, 'demo login for reset').to.eq(true);
      return cy.request({ method: 'POST', url: `${apiUrl()}/reset`, headers: { Authorization: `Bearer ${body.token}` } });
    })
    .its('body.ok').should('eq', true);
});

Cypress.Commands.add('login', (options = {}) => {
  const { username = 'student', password = 'BankDemo@123', route = '/dashboard' } = options;
  cy.request('POST', `${apiUrl()}/auth/login`, { username, password }).then(({ body }) => {
    expect(body.ok, 'login API response').to.eq(true);
    cy.visit(route, { onBeforeLoad(window) { window.localStorage.setItem('authToken', body.token); } });
  });
});
