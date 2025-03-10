/// <reference types="cypress" />


declare namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
  
  Cypress.Commands.add('login', (email: string, password: string) => {
    cy.log(`Logging in as ${email}`); // Debugging log
    cy.visit('/login');
  
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  
    cy.url().should('not.include', '/login');
  });
  