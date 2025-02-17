describe('Slot Booking Page', () => {
    beforeEach(() => {
      cy.visit('/slot-booking'); 
    });
  
    it('should display the booking form correctly', () => {
      cy.get('h2').contains('Book Your Slot');
      cy.get('input[type="date"]').should('exist');
      cy.get('input[name="timeSlot"]').should('exist');
      cy.get('button[type="submit"]').contains('Book Slot');
    });
  
    it('should prevent non-logged-in users from booking a slot', () => {
      cy.get('input[type="date"]').type('2025-03-01');
      cy.get('input[name="timeSlot"]').first().check();
      cy.get('button[type="submit"]').click();
      
      cy.get('.text-red-700').contains('You must be logged in to book a slot.');
    });
  
    context('Logged-in user', () => {
      beforeEach(() => {
        cy.login('testuser@example.com', 'ValidPassword123'); // Custom command to log in
      });
  
      it('should allow a logged-in user to book a slot', () => {
        cy.get('input[type="date"]').type('2025-03-01');
        cy.get('input[name="timeSlot"]').first().check();
        cy.get('button[type="submit"]').click();
        
        cy.get('.text-green-700').contains('Slot booked successfully');
      });
    });
  
    it('should display notifications when a slot is booked', () => {
      cy.login('testuser@example.com', 'ValidPassword123');
      cy.get('input[type="date"]').type('2025-03-01');
      cy.get('input[name="timeSlot"]').first().check();
      cy.get('button[type="submit"]').click();
      
      cy.get('button').contains('🔔').click();
      cy.get('.bg-white').contains('Slot booked on');
    });
  });