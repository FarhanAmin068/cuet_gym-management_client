describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/register'); // Visit the registration page
    });
  
    it('should display the registration form', () => {
      cy.get('h2').should('contain', 'Create Account');
      cy.get('input[name="name"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('input[name="confirm-password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Create Account');
    });
  
    it('should show an error if passwords do not match', () => {
      cy.get('input[name="name"]').type('John Doe');
      cy.get('input[name="email"]').type('johndoe@example.com');
      cy.get('input[name="password"]').type('Password123');
      cy.get('input[name="confirm-password"]').type('WrongPassword');
      cy.get('button[type="submit"]').click();
      
      cy.get('.text-red-700').should('contain', 'Passwords do not match');
    });
  
    it('should successfully register a new user', () => {
      cy.get('input[name="name"]').type('John Doe');
      cy.get('input[name="email"]').type(`test${Date.now()}@example.com`); // Unique email
      cy.get('input[name="password"]').type('Password123');
      cy.get('input[name="confirm-password"]').type('Password123');
      cy.get('input[name="terms"]').check();
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/login'); // Redirects to login after sign out
    });
  });
  