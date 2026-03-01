describe('Integration test with visual testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Loads the homepage', () => {
    cy.percySnapshot('Homepage Loads');
  });
});