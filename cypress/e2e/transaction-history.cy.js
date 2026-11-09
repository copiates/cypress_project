describe('Transaction history', () => {
  beforeEach(() => {
    cy.resetBankData();
    cy.login({ route: '/transfer' });
  });

  it('TC-18: lists the successful transfer with amount and completed status', () => {
    cy.get('[data-testid="recipient-account"]').type('1000654321');
    cy.get('[data-testid="transfer-amount"]').type('5000');
    cy.get('[data-testid="transfer-submit"]').click();
    cy.get('[data-testid="transfer-success"]').should('be.visible');
    cy.get('nav').contains('Activity').click();
    cy.get('[data-testid="transaction-history"]').should('be.visible');
    cy.get('[data-testid^="tx-id-"]').should('exist');
    cy.get('[data-testid^="tx-amount-"]').should('contain', '₹5,000');
    cy.get('[data-testid^="tx-status-"]').should('contain', 'Completed');
  });

  it('shows a useful empty state when no transfers have been made', () => {
    cy.visit('/history');
    cy.get('[data-testid="transaction-history"]').contains('No activity yet').should('be.visible');
  });
});
