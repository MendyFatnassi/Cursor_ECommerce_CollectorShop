describe('Accueil', () => {
  it('affiche la page d’accueil', () => {
    cy.visit('http://localhost:3001/accueil');
    cy.contains('Découvrez les boutiques et les articles').should('be.visible');
  });

  it('affiche les sections principales', () => {
    cy.visit('http://localhost:3001/accueil');
    cy.contains('Articles du moment').should('be.visible');
    cy.contains('Boutiques publiques').should('be.visible');
  });

  it('propose la connexion depuis l’accueil', () => {
    cy.visit('http://localhost:3001/accueil');
    cy.contains('Se connecter / Créer un compte').should('be.visible');
  });

  it('échoue volontairement pour démonstration', () => {
    cy.visit('http://localhost:3001/accueil');
    cy.contains('Texte volontairement absent').should('be.visible');
  });
});
