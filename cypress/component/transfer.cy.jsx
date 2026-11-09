import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TransferPage } from '../../src/components/TransferPage';

describe('TransferPage component', () => {
  beforeEach(() => {
    cy.window().then((window) => window.localStorage.setItem('authToken', 'transfer-component-token'));
  });

  it('submits a valid transfer and displays the confirmation details', () => {
    cy.intercept('POST', '**/api/transfer', {
      statusCode: 200,
      body: { ok: true, transaction: { id: 'TXN-COMPONENT-1', amount: 2500, status: 'Completed' } },
    }).as('transfer');

    cy.mount(<MemoryRouter><TransferPage /></MemoryRouter>);
    cy.get('[data-testid="recipient-account"]').type('1000654321');
    cy.get('[data-testid="transfer-amount"]').type('2500');
    cy.get('[data-testid="transfer-description"]').type('Lunch');
    cy.get('[data-testid="transfer-submit"]').click();
    cy.wait('@transfer').its('request.body').should('deep.include', { recipient: '1000654321', amount: '2500', description: 'Lunch' });
    cy.get('[data-testid="transfer-success"]').should('contain', '₹2,500').and('contain', '1000654321').and('contain', 'TXN-COMPONENT-1');
  });

  it('shows API validation feedback without navigating away', () => {
    cy.intercept('POST', '**/api/transfer', {
      statusCode: 400,
      body: { ok: false, error: 'Minimum transfer amount is ₹100' },
    }).as('rejectedTransfer');

    cy.mount(<MemoryRouter><TransferPage /></MemoryRouter>);
    cy.get('[data-testid="recipient-account"]').type('1000654321');
    cy.get('[data-testid="transfer-amount"]').type('99');
    cy.get('[data-testid="transfer-submit"]').click();
    cy.wait('@rejectedTransfer');
    cy.get('[data-testid="transfer-error"]').should('be.visible').and('contain', 'Minimum transfer amount');
    cy.contains('h1', 'Make a transfer').should('be.visible');
  });
});
