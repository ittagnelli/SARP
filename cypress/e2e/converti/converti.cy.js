describe('Vista Utenti', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173')
      })
  
    it('Valid user Able to Login', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('.form-control').clear('e');
      cy.wait(2000);
      cy.get('.form-control').type('marco.cellini@istitutoagnelli.it');
      cy.get('.btn').click();
      cy.wait(200);
      cy.get(':nth-child(4) > .nav-link').click();
      cy.get(':nth-child(4) > .dropdown-menu > .dropdown-menu-columns > .dropdown-menu-column > .dropdown-item').click();
      cy.wait(200);
      //cy.get('label.custom-file-upload').click();
      cy.get('input[type=file]').selectFile(['./cypress/e2e/converti/file/documento1.pdf', './cypress/e2e/converti/file/documento2.pdf'], {
        action: 'drag-drop',
        force: true
      });
      cy.wait(500);
      cy.get(':nth-child(2) > .custom-file-upload').click();
      /* ==== End Cypress Studio ==== */
    })
  })