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
      cy.get('.form-control').clear('e');                   // login
      cy.wait(2000);
      cy.get('.form-control').type('marco.cellini@istitutoagnelli.it');
      cy.get('.btn').click();

      cy.get(':nth-child(2) > .nav-link > .nav-link-title').click();                // creazione stagista
      cy.get('#btn_action_modal').click();
      cy.wait(200);
      cy.get(':nth-child(1) > :nth-child(1) > .mb-3 > .form-control').type('Stage');
      cy.wait(10);
      cy.get(':nth-child(1) > :nth-child(2) > .mb-3 > .form-control').type('Pluto');
      cy.wait(10);
      cy.get(':nth-child(3) > .mb-3 > .form-control').type('Putignano');
      cy.wait(10);
      cy.get(':nth-child(4) > .mb-3 > .form-control').type('2004-02-24');
      cy.wait(10);
      cy.get(':nth-child(5) > .mb-3 > .form-control').type('RSSFLV95C12H118C');
      cy.wait(10);
      cy.get(':nth-child(2) > :nth-child(1) > .mb-3 > .form-control').type('stage.pluto@istitutoagnelli.it');
      cy.wait(10);
      cy.get(':nth-child(2) > :nth-child(2) > .mb-3 > .form-control').type('333.123.45.67');
      cy.wait(10);
      cy.get(':nth-child(3) > .mb-3 > .form-select').select(3);
      cy.get(':nth-child(4) > .mb-3 > .form-select').select(20);
      cy.wait(10);
      cy.get('.col-lg-12 > .form-selectgroup > :nth-child(1) > .form-selectgroup-label').click();
      cy.get(':nth-child(6) > .form-selectgroup-label').click();
      cy.wait(10);
      cy.get('.btn-success').click();
      cy.wait(500);

      cy.get(':nth-child(2) > .nav-link > .nav-link-title').click();
      cy.get('#btn_action_modal').click();
      cy.get(':nth-child(1) > :nth-child(1) > .mb-3 > .form-control').type('Tutor');            // creazione del tutor scolastico
      cy.get(':nth-child(1) > :nth-child(2) > .mb-3 > .form-control').type('Pluto');
      cy.get(':nth-child(3) > .mb-3 > .form-control').type('Putignano');
      cy.get(':nth-child(4) > .mb-3 > .form-control').type('2004-02-24');
      cy.get(':nth-child(5) > .mb-3 > .form-control').type('RSSFLV95C12H118C');
      cy.get(':nth-child(2) > :nth-child(1) > .mb-3 > .form-control').type('tutor.pluto@istitutoagnelli.it');
      cy.get(':nth-child(2) > :nth-child(2) > .mb-3 > .form-control').type('333.123.45.67');
      cy.get(':nth-child(3) > .mb-3 > .form-select').select(0);
      cy.get(':nth-child(4) > .mb-3 > .form-select').select(20);
      cy.get('.col-lg-12 > .form-selectgroup > :nth-child(2) > .form-selectgroup-label').click();
      cy.get('.btn-success').click();
      
      cy.wait(300);

      cy.get(':nth-child(3) > .nav-link').click();              // creazione azienda
      cy.get('[href="/aziende"]').click();
      cy.wait(2000);
      cy.get('#btn_action_modal').click();
      cy.wait(200);
      cy.get(':nth-child(1) > .col-lg-4 > .mb-3 > .form-control').type('2023/21');
      cy.get('.col-lg-8 > .mb-3 > .form-control').type('provaStage');
      cy.get('.col-lg-12 > .mb-3 > .form-control').type('Via ciro 43');
      cy.get(':nth-child(3) > :nth-child(1) > .mb-3 > .form-control').type('12345678902');
      cy.get(':nth-child(3) > :nth-child(2) > .mb-3 > .form-control').type('321.123.45.67');
      cy.get(':nth-child(4) > :nth-child(1) > .mb-3 > .form-control').type('Ciro Esposito');
      cy.get(':nth-child(4) > :nth-child(2) > .mb-3 > .form-control').type('Napoli');
      cy.get(':nth-child(3) > .mb-3 > .form-control').clear().type('1970-05-23');
      cy.get(':nth-child(4) > .mb-3 > .form-control').type('LNSTVL69T28L219K');
      cy.get(':nth-child(5) > :nth-child(1) > .mb-3 > .form-control').type('2023-02-17');
      cy.get(':nth-child(5) > :nth-child(2) > .mb-3 > .form-control').type('2023-02-27');
      cy.get('.btn-success').click();
      
      cy.wait(300);
      
      cy.get(':nth-child(3) > .nav-link').click();
      cy.get('[href="/stage"]').click();
      cy.wait(2000);
      cy.get('#btn_action_modal').click();              // creazione stage
      cy.wait(200);
      cy.get(':nth-child(1) > .mb-3 > .form-select').select(0);
      cy.get(':nth-child(2) > .mb-3 > .form-control').clear().type('2023-03-1');
      cy.get(':nth-child(3) > .mb-3 > .form-control').clear().type('2023-03-10');
      cy.get(':nth-child(2) > :nth-child(1) > .mb-3 > .form-control').type('Gino Ciro');
      cy.get(':nth-child(2) > .mb-3 > .form-select').select(0);
      cy.get(':nth-child(3) > .col-lg-12 > .mb-3 > .form-control').type('zappare la vigna');
      cy.get(':nth-child(4) > .col-lg-12 > .mb-3 > .form-control').type('zappare la vigna sotto il sole con minimo 40 gradi');
      cy.get(':nth-child(5) > .col-lg-12 > .mb-3 > .selectContainer > [autocapitalize="none"]').select(0);
      cy.get(':nth-child(6) > .col-lg-12 > .mb-3 > .selectContainer > [autocapitalize="none"]').select(0);
      cy.get('.btn-success').click();
      
      /* ==== End Cypress Studio ==== */
    })
  })