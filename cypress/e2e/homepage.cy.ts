describe('Integration test with visual testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Loads the homepage', () => {
    cy.percySnapshot('Homepage Loads');
  });

  it('Has header and paragraph', () => {
    cy.get('h2')
      .should('be.visible')
      .and('contain.text', 'Dashboard');
    cy.get('p')
      .should('be.visible')
      .and('contain.text', 'Component content goes here.');
    cy.percySnapshot('Homepage components');
  });
});