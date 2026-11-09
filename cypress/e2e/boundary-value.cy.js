describe('Boundary value testing', () => {
  beforeEach(() => {
    cy.resetBankData();
    cy.login({ route: '/transfer' });
  });

  const transferAmount = (amount) => {
    cy.get('[data-testid="recipient-account"]').clear().type('1000654321');
    cy.get('[data-testid="transfer-amount"]').clear().type(String(amount));
    cy.get('[data-testid="transfer-submit"]').click();
  };

  it('TC-06: accepts the minimum amount of ₹100', () => { transferAmount(100); cy.get('[data-testid="transfer-success"]').should('be.visible'); });
  it('TC-07: rejects ₹99, just below the minimum', () => { transferAmount(99); cy.get('[data-testid="transfer-error"]').should('contain', 'Minimum transfer amount'); });
  it('TC-08: accepts ₹101, just above the minimum', () => { transferAmount(101); cy.get('[data-testid="transfer-success"]').should('be.visible'); });
  it('TC-09: accepts the maximum amount of ₹50,000', () => { transferAmount(50000); cy.get('[data-testid="transfer-success"]').should('be.visible'); });
  it('TC-10: rejects ₹50,001, just above the maximum', () => { transferAmount(50001); cy.get('[data-testid="transfer-error"]').should('contain', 'Maximum transfer amount'); });
  it('TC-11: accepts ₹49,999, just below the maximum', () => { transferAmount(49999); cy.get('[data-testid="transfer-success"]').should('be.visible'); });
});
