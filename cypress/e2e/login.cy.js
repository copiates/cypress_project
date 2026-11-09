describe('Login', () => {
  beforeEach(() => {
    cy.resetBankData();
    cy.visit('/login');
  });

  it('TC-01: signs in with the demo credentials and loads the account balance', () => {
    cy.get('[data-testid="username"]').type('student');
    cy.get('[data-testid="password"]').type('BankDemo@123');
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="account-balance"]').should('contain', '₹75,000');
  });

  it('TC-02: rejects an incorrect password with a visible message', () => {
    cy.get('[data-testid="username"]').type('student');
    cy.get('[data-testid="password"]').type('wrongpassword');
    cy.get('[data-testid="login-submit"]').click();
    cy.get('[data-testid="login-error"]').should('contain', 'Invalid username or password');
    cy.url().should('include', '/login');
  });
});
