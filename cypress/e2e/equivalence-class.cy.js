describe('Equivalence class testing', () => {
  beforeEach(() => {
    cy.resetBankData();
    cy.login({ route: '/transfer' });
  });

  const transferAmount = (amount) => {
    cy.get('[data-testid="recipient-account"]').clear().type('1000654321');
    if (amount !== '') cy.get('[data-testid="transfer-amount"]').clear().type(String(amount));
    else cy.get('[data-testid="transfer-amount"]').clear();
    cy.get('[data-testid="transfer-submit"]').click();
  };

  it('TC-12: rejects zero', () => { transferAmount(0); cy.get('[data-testid="transfer-error"]').should('be.visible'); });
  it('TC-13: rejects a negative amount', () => { transferAmount(-100); cy.get('[data-testid="transfer-error"]').should('be.visible'); });
  it('TC-14: rejects decimal rupees', () => { transferAmount('100.50'); cy.get('[data-testid="transfer-error"]').should('contain', 'decimals are not accepted'); });
  it('TC-15a: rejects an empty amount', () => { transferAmount(''); cy.get('[data-testid="transfer-error"]').should('contain', 'Amount required'); });
  it('TC-15b: rejects non-numeric input', () => { transferAmount('abc'); cy.get('[data-testid="transfer-error"]').should('contain', 'valid number'); });
});
