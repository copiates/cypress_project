import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../../src/components/LoginPage';

describe('LoginPage component', () => {
  const mountLogin = () => cy.mount(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<main data-testid="dashboard-page">Dashboard loaded</main>} />
      </Routes>
    </MemoryRouter>,
  );

  it('shows an API validation error and stays on the login form', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { ok: false, error: 'Invalid username or password' },
    }).as('loginRequest');

    mountLogin();
    cy.get('.login-layout').should('have.css', 'display', 'grid');
    cy.get('.login-story').should('have.css', 'background-color', 'rgb(10, 85, 73)');
    cy.get('[data-testid="username"]').type('student');
    cy.get('[data-testid="password"]').type('wrong-password');
    cy.get('[data-testid="login-submit"]').click();
    cy.wait('@loginRequest');
    cy.get('[data-testid="login-error"]').should('be.visible').and('contain', 'Invalid username or password');
    cy.get('[data-testid="dashboard-page"]').should('not.exist');
  });

  it('stores the returned token and navigates on successful login', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { ok: true, token: 'component-test-token', username: 'student' },
    }).as('loginRequest');

    mountLogin();
    cy.get('[data-testid="username"]').type('student');
    cy.get('[data-testid="password"]').type('BankDemo@123');
    cy.get('[data-testid="login-submit"]').click();
    cy.wait('@loginRequest');
    cy.get('[data-testid="dashboard-page"]').should('be.visible');
    cy.window().its('localStorage.authToken').should('eq', 'component-test-token');
  });
});
