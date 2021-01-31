// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Overwrite visit function to check each time if the path includes login
Cypress.Commands.overwrite('visit', (originalFn, url, options = {}) => {
  cy.wrap(originalFn(url, options)).then(() => {
    // Do not login if we are testing login
    if (options.skipLogin) return;

    // The pathname is not ready right away
    cy.wait(1000);
    return cy.location('pathname').then((path) => {
      if (path.includes('login')) {
        cy.login();
      }
    });
  });
});

Cypress.Commands.add('logout', () => {
  window.indexedDB.deleteDatabase('firebaseLocalStorageDb');
});

Cypress.Commands.add('login', () => {
  cy.logout();
  cy.visit('/login');

  const email = 'testfinished@test.com';
  const password = 'testfinished';

  cy.server();

  cy.get('[data-cy="email"]')
    .type(email)
    .should('have.value', email);

  cy.get('[data-cy="password"]')
    .type(password)
    .should('have.value', password);

  cy.fixture('login').as('loginJSON');
  cy.route('GET', `/api/account/login`, '@loginJSON').as('login');

  cy.get('[data-cy="login-button"]').click();

  cy.wait('@login');
});

Cypress.Commands.add('iframeLoaded', { prevSubject: 'element' }, ($iframe) => {
  const contentWindow = $iframe.prop('contentWindow');
  return new Promise((resolve) => {
    if (contentWindow && contentWindow.document.readyState === 'complete') {
      resolve(contentWindow);
    } else {
      $iframe.on('load', () => {
        resolve(contentWindow);
      });
    }
  });
});

Cypress.Commands.add(
  'getInDocument',
  { prevSubject: 'document' },
  (document, selector) => Cypress.$(selector, document)
);

Cypress.Commands.add('waitForCampaignMenuAndClick', () => {
  cy.wait(1000);
  cy.get('[data-cy="campaign-menu"]')
    .first()
    .click();
});
