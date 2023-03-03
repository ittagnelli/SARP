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
    cy.get(':nth-child(2) > .nav-link > .nav-link-title').click();25
    cy.get('#btn_action_modal').click();
    cy.wait(500);
    cy.get(':nth-child(1) > :nth-child(1) > .mb-3 > .form-control').type('Pippo');
    cy.wait(10);
    cy.get(':nth-child(1) > :nth-child(2) > .mb-3 > .form-control').type('Pluto');
    cy.wait(10);
    cy.get(':nth-child(3) > .mb-3 > .form-control').type('Putignano');
    cy.wait(10);
    cy.get(':nth-child(4) > .mb-3 > .form-control').type('2004-02-24');
    cy.wait(10);
    cy.get(':nth-child(5) > .mb-3 > .form-control').type('RSSFLV95C12H118C');
    cy.wait(10);
    cy.get(':nth-child(2) > :nth-child(1) > .mb-3 > .form-control').type('pippo.pluto@istitutoagnelli.it');
    cy.wait(10);
    cy.get(':nth-child(2) > :nth-child(2) > .mb-3 > .form-control').type('333.123.45.67');
    cy.wait(10);
    cy.get(':nth-child(3) > .mb-3 > .form-select').select(1);
    cy.get(':nth-child(4) > .mb-3 > .form-select').select(0);
    cy.wait(10);
    cy.get(':nth-child(5) > .mb-3 > .form-selectgroup > :nth-child(2) > .form-selectgroup-label').click();
    cy.get('.col-lg-12 > .form-selectgroup > :nth-child(1) > .form-selectgroup-label').click();
    cy.get('.col-lg-12 > .form-selectgroup > :nth-child(2) > .form-selectgroup-label').click();
    cy.get(':nth-child(3) > .form-selectgroup-label').click();
    cy.get(':nth-child(4) > .form-selectgroup-label').click();
    cy.get(':nth-child(5) > .form-selectgroup-label').click();
    cy.get(':nth-child(6) > .form-selectgroup-label').click();
    cy.get(':nth-child(7) > .form-selectgroup-label').click();
    cy.get(':nth-child(8) > .form-selectgroup-label').click();
    cy.wait(10);
    cy.get('.col-lg-4 > .mb-3 > .form-selectgroup > :nth-child(2) > .form-selectgroup-label').click();
    cy.get('.btn-success').click();
    /* ==== End Cypress Studio ==== */
  })
})