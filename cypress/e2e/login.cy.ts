describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login'); // Visit the login page
      
    });
  
    it('should display the login form', () => {
      cy.get('h2').should('contain', 'Welcome Back!');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Sign In');
    });
  
    it('should show an error for invalid login credentials', () => {
      cy.get('input[name="email"]').type('invalid@example.com');
      cy.get('input[name="password"]').type('WrongPassword');
      cy.get('button[type="submit"]').click();
  
      cy.get('.text-red-700').should('contain', 'Failed to sign in');
    });
  
    it('should log in with correct credentials', () => {
      cy.get('input[name="email"]').type('validuser@example.com');
      cy.get('input[name="password"]').type('ValidPassword123');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('eq', Cypress.config().baseUrl + '/'); // Redirects to homepage
    });
  });
  