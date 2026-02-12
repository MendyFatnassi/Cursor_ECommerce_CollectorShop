describe('Accueil', () => {
  const runFailing = Cypress.env('RUN_FAILING_SMOKE') === true || Cypress.env('RUN_FAILING_SMOKE') === 'true';
  const maybeFailing = runFailing ? it : it.skip;

  beforeEach(() => {
    cy.intercept('GET', '**/api/recommendations', {
      statusCode: 200,
      body: []
    }).as('recommendations');
  });

  it("affiche la page d'accueil", () => {
    cy.visit('http://localhost:3001/accueil');
    cy.contains('Découvrez les boutiques et les articles').should('be.visible');
    cy.wait('@recommendations');
  });

  it('affiche les sections principales', () => {
    cy.visit('http://localhost:3001/accueil');
    cy.contains('Articles du moment').should('be.visible');
    cy.contains('Boutiques publiques').should('be.visible');
    cy.wait('@recommendations');
  });

  it("propose la connexion depuis l'accueil", () => {
    cy.visit('http://localhost:3001/accueil');
    cy.contains('Se connecter / Créer un compte').should('be.visible');
    cy.wait('@recommendations');
  });

  maybeFailing('echoue volontairement pour demonstration', () => {
    cy.visit('http://localhost:3001/accueil');
    cy.contains('Texte volontairement absent').should('be.visible');
    cy.wait('@recommendations');
  });
});
