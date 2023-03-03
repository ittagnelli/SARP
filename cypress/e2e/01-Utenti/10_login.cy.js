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
    cy.get('.form-control').type('espedito.mancuso@istitutoagnelli.it');
    cy.get('.btn').click();
    /* ==== End Cypress Studio ==== */
  })
})