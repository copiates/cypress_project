describe('Access control', () => {
  beforeEach(() => cy.resetBankData());

  it('TC-03: blocks the dashboard when no session is present', () => {
    cy.visit('/dashboard');
    cy.contains('h1', 'Login Required').should('be.visible');
    cy.get('[data-testid="account-balance"]').should('not.exist');
  });

  it('TC-04: logout clears the session and prevents protected access', () => {
    cy.login();
    cy.window().then((window) => window.localStorage.getItem('authToken')).as('sessionToken');
    cy.get('.signout-button').contains('Sign out').click();
    cy.url().should('include', '/login');
    cy.get('@sessionToken').then((token) => cy.request({ method: 'GET', url: 'http://127.0.0.1:3002/api/auth/me', headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false }).its('status').should('eq', 401));
    cy.window().then((window) => expect(window.localStorage.getItem('authToken')).to.equal(null));
    cy.visit('/dashboard');
    cy.contains('h1', 'Login Required').should('be.visible');
  });
});
