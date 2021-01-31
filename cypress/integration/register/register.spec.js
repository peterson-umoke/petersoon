describe('Register', () => {
  beforeEach(() => {
    cy.logout();
  });

  it('should show errors if form is not completely filled out', () => {
    cy.visit('/register');
    cy.location('pathname').should('eq', '/register');

    const name = 'some name';
    cy.get('[data-test="register-name"]')
      .type(name)
      .should('have.value', name);

    cy.get('[data-test="register-submit"]').click();

    cy.get('.mat-form-field').should('have.class', 'mat-form-field-invalid');
  });
});
