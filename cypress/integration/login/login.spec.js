describe('Log in', () => {
  beforeEach(() => {
    cy.logout();
  });

  it('should not log in if user does not exist', () => {
    cy.server();
    cy.route('POST', '/identitytoolkit/v3/relyingparty/verifyPassword*').as(
      'login'
    );

    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');

    const email = 'doesntexist@test.com';
    cy.get('[data-cy="email"]')
      .type(email)
      .should('have.value', email);

    const password = 'doesntexist';
    cy.get('[data-cy="password"]')
      .type(password)
      .should('have.value', password);

    cy.get('[data-cy="login-button"]').click();

    cy.wait('@login');
    cy.location('pathname').should('eq', '/login');
  });

  it('should redirect you to register success', () => {
    cy.server();
    cy.route('POST', '/identitytoolkit/v3/relyingparty/verifyPassword*').as(
      'login'
    );

    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');

    const email = 'needsverification@test.com';
    cy.get('[data-cy="email"]')
      .type(email)
      .should('have.value', email);

    const password = 'needsverification';
    cy.get('[data-cy="password"]')
      .type(password)
      .should('have.value', password);

    cy.get('[data-cy="login-button"]').click();

    cy.wait('@login');
    cy.location('pathname').should('eq', '/register/success');
  });

  it('should log in correctly and have you setup a campaign', () => {
    cy.server();
    cy.route('POST', '/identitytoolkit/v3/relyingparty/verifyPassword*').as(
      'login'
    );

    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');

    const email = 'test@test.com';
    cy.get('[data-cy="email"]')
      .type(email)
      .should('have.value', email);

    const password = 'testtest';
    cy.get('[data-cy="password"]')
      .type(password)
      .should('have.value', password);

    cy.get('[data-cy="login-button"]').click();

    cy.wait('@login');
    cy.location('pathname').should('eq', '/create-organization');
  });
});
