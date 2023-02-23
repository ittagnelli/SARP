describe('Vista Utenti', () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit('http://localhost:5173')
      })
  
    it('Valid user Able to Login', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('.form-control').clear('e');
      cy.wait(2000);
      cy.get('.form-control').type('marco.cellini@istitutoagnelli.it');
      cy.get('.btn').click();
      cy.wait(500);
      cy.get(':nth-child(1) > .link-secondary').click();
      cy.get('#faq-1 > :nth-child(1) > .accordion-header > .accordion-button').click();
      cy.get('#faq-1 > :nth-child(2) > .accordion-header > .accordion-button').click();
      cy.get('#faq-2 > :nth-child(1) > .accordion-header > .accordion-button').click();
      cy.get('#faq-3 > .accordion-item > .accordion-header > .accordion-button').click();
      cy.get('#faq-4 > .accordion-item > .accordion-header > .accordion-button').click();
      cy.get('#faq-5 > .accordion-item > .accordion-header > .accordion-button').click();
      cy.get('#faq-0 > :nth-child(1) > .accordion-header > .accordion-button').click();
      cy.get('#faq-0 > :nth-child(2) > .accordion-header > .accordion-button').click();
      /* ==== End Cypress Studio ==== */
    })
  })