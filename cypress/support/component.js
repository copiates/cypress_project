import { mount } from 'cypress/react';
import '../../src/index.css';
import './commands';

Cypress.Commands.add('mount', mount);

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
