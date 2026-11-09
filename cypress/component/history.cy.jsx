import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HistoryPage } from '../../src/components/HistoryPage';

describe('HistoryPage component', () => {
  beforeEach(() => {
    cy.window().then((window) => window.localStorage.setItem('authToken', 'history-component-token'));
  });

  it('renders a completed transfer in the activity table', () => {
    cy.intercept('GET', '**/api/history', {
      statusCode: 200,
      body: {
        ok: true,
        transactions: [{ id: 'TXN-HISTORY-1', timestamp: '2026-11-09T12:00:00.000Z', type: 'Fund Transfer', recipient: '1000654321', amount: 5000, status: 'Completed', description: 'Test' }],
      },
    }).as('history');

    cy.mount(<MemoryRouter><HistoryPage /></MemoryRouter>);
    cy.wait('@history');
    cy.get('[data-testid="transaction-history"]').should('be.visible');
    cy.get('[data-testid="tx-id-TXN-HISTORY-1"]').should('contain', 'TXN-HISTORY-1');
    cy.get('[data-testid="tx-amount-TXN-HISTORY-1"]').should('contain', '₹5,000');
    cy.get('[data-testid="tx-status-TXN-HISTORY-1"]').should('contain', 'Completed');
  });

  it('shows the designed empty state when there is no transaction history', () => {
    cy.intercept('GET', '**/api/history', { statusCode: 200, body: { ok: true, transactions: [] } }).as('emptyHistory');

    cy.mount(<MemoryRouter><HistoryPage /></MemoryRouter>);
    cy.wait('@emptyHistory');
    cy.contains('h3', 'No activity yet').should('be.visible');
    cy.contains('a', 'Make your first transfer').should('have.attr', 'href', '/transfer');
  });
});
