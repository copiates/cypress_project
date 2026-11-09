describe('Fund transfer', () => {
  beforeEach(() => {
    cy.resetBankData();
    cy.login({ route: '/transfer' });
  });

  const fillTransfer = (amount, recipient = '1000654321') => {
    cy.get('[data-testid="recipient-account"]').clear().type(recipient);
    cy.get('[data-testid="transfer-amount"]').clear().type(String(amount));
    cy.get('[data-testid="transfer-submit"]').click();
  };

  it('TC-05: completes a valid ₹5,000 transfer and confirms its details', () => {
    fillTransfer(5000);
    cy.get('[data-testid="transfer-success"]').should('contain', '₹5,000').and('contain', '1000654321');
    cy.get('nav').contains('Overview').click();
    cy.get('[data-testid="account-balance"]').should('contain', '₹70,000');
  });

  it('TC-16: rejects a transfer when the remaining balance is insufficient', () => {
    fillTransfer(50000);
    cy.get('[data-testid="transfer-success"]').should('be.visible');
    fillTransfer(26000);
    cy.get('[data-testid="transfer-error"]').should('contain', 'Insufficient balance');
    cy.get('nav').contains('Activity').click();
    cy.get('.transaction-count').should('contain', '1 transaction');
  });

  it('TC-17: rejects an invalid recipient account', () => {
    fillTransfer(1000, '9999999999');
    cy.get('[data-testid="transfer-error"]').should('contain', 'Invalid recipient');
  });
});
