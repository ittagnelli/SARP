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
      cy.wait(200);
      cy.get(':nth-child(3) > .nav-link').click();
      cy.get('[href="/aziende"]').click();
      cy.get('#btn_action_modal').click();
      cy.wait(300);
      cy.get(':nth-child(1) > .col-lg-4 > .mb-3 > .form-control').type('2023/30');
      cy.get('.col-lg-8 > .mb-3 > .form-control').type('Ciro and Co');
      cy.get('.col-lg-12 > .mb-3 > .form-control').type('Via vatte la pesca 123');
      cy.get(':nth-child(3) > :nth-child(1) > .mb-3 > .form-control').type('12345678902');
      cy.get(':nth-child(3) > :nth-child(2) > .mb-3 > .form-control').type('321.123.45.67');
      cy.get(':nth-child(4) > :nth-child(1) > .mb-3 > .form-control').type('Ciro Esposito');
      cy.get(':nth-child(4) > :nth-child(2) > .mb-3 > .form-control').type('Napoli');
      cy.get(':nth-child(3) > .mb-3 > .form-control').clear().type('1970-05-23');
      cy.get(':nth-child(4) > .mb-3 > .form-control').type('LNSTVL69T28L219K');
      cy.get(':nth-child(5) > :nth-child(1) > .mb-3 > .form-control').type('2023-02-17');
      cy.get(':nth-child(5) > :nth-child(2) > .mb-3 > .form-control').type('2023-02-27');
      cy.get(':nth-child(1) > .form-selectgroup-label').click();
      cy.get('.btn-success').click();

      cy.wait(1000);

      cy.get(':nth-child(1) > :nth-child(11) > #form-delete > .icon-button > .ti').click();
      /* ==== End Cypress Studio ==== */
    })
  })