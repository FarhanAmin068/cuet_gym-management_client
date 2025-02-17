describe('Diet Management Page', () => {
    beforeEach(() => {
      cy.visit('/diet-management'); 
    });
  
    it('should display the diet management form', () => {
      cy.get('h1').should('contain', 'Personalized Diet Plans');
      cy.get('input[name="height"]').should('exist');
      cy.get('input[name="weight"]').should('exist');
      cy.get('input[name="age"]').should('exist');
      cy.get('select#gender').should('exist');
      cy.get('select#activityLevel').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Calculate');
    });
  
    it('should show an error if the user is not logged in', () => {
      cy.get('input[name="height"]').type('170');
      cy.get('input[name="weight"]').type('65');
      cy.get('input[name="age"]').type('25');
      cy.get('button[type="submit"]').click();
      
      cy.get('.text-red-500').should('contain', 'Please login to get your diet plan');
    });
  
    it('should calculate BMI and display diet plan', () => {
      cy.login('testuser@example.com', 'ValidPassword123'); 
  
      cy.get('input[name="height"]').type('170');
      cy.get('input[name="weight"]').type('65');
      cy.get('input[name="age"]').type('25');
      cy.get('select#gender').select('Male');
      cy.get('select#activityLevel').select('Moderately Active (moderate exercise)');
      cy.get('button[type="submit"]').click();
      
      cy.get('h3').should('contain', 'Your BMI:');
      cy.get('p').should('contain', 'Total Calories:');
      cy.get('strong').should('contain', 'Breakfast:');
      cy.get('strong').should('contain', 'Lunch:');
      cy.get('strong').should('contain', 'Dinner:');
      cy.get('strong').should('contain', 'Snacks:');
    });
  });
  