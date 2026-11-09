import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../../src/components/DashboardPage';

describe('DashboardPage component', () => {
  it('shows the live account balance and dashboard actions', () => {
    cy.window().then((window) => window.localStorage.setItem('authToken', 'dashboard-component-token'));
    cy.intercept('GET', '**/api/accounts', {
      statusCode: 200,
      body: {
        ok: true,
        sender: { account_number: '1000123456', masked: '1000****3456', balance: 62500, account_type: 'Savings' },
        receiver: { account_number: '1000654321', masked: '1000****4321', balance: 32500, account_type: 'Savings' },
      },
    }).as('accounts');

    cy.mount(<MemoryRouter><DashboardPage /></MemoryRouter>);
    cy.wait('@accounts');
    cy.get('.page-heading h1').should('contain', 'Good to see you');
    cy.get('[data-testid="account-balance"]').should('contain', '₹62,500');
    cy.get('[data-testid="account-number"]').should('contain', '3456');
    cy.contains('a', 'Make a transfer').should('have.attr', 'href', '/transfer');
    cy.contains('a', 'View activity').should('have.attr', 'href', '/history');
  });

  it('shows the sign-in prompt when the user has no session', () => {
    cy.mount(<MemoryRouter><DashboardPage /></MemoryRouter>);
    cy.contains('h1', 'Login Required').should('be.visible');
    cy.contains('a', 'Go to Login').should('have.attr', 'href', '/login');
    cy.get('[data-testid="account-balance"]').should('not.exist');
  });
});
