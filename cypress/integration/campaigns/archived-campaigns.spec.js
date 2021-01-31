describe('Archived Campaigns Tests', function() {
  before(() => {
    cy.login();
  });

  beforeEach(function() {
    cy.server();
    cy.fixture('org-info-funded').as('orgInfoFundedJSON');
    cy.route(
      'GET',
      `/api/account/organization/*/info/`,
      '@orgInfoFundedJSON'
    ).as('orgInfoFunded');
  });

  it('Should be archived', function() {
    cy.fixture('campaigns/archived').as('archivedCampaignsJSON');
    cy.route(
      'GET',
      '/api/da/campaign/list/archived/*',
      '@archivedCampaignsJSON'
    ).as('archivedCampaigns');
    cy.fixture('archived-campaign-states/archived').as('archivedJSON');
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@archivedJSON').as(
      'archived'
    );
    cy.visit('/campaigns/archived');
    cy.wait('@archivedCampaigns');
    cy.get('[data-cy="campaign-status"]')
      .should('exist')
      .contains('Archived');
    cy.get('[data-cy="request-approval-button"]').should('not.exist');
    cy.waitForCampaignMenuAndClick();
    cy.get('[data-cy="unarchive-campaign-button"]').should('exist');
    cy.get('[data-cy="archive-campaign-button"]').should('not.exist');
    cy.get('[data-cy="complete-campaign-button"]').should('not.exist');
    cy.get('[data-cy="list-view"]').click({ force: true });
    cy.get('[data-cy="list-play-pause"]').should('not.exist');
    cy.get('[data-cy="list-complete-campaign"]').should('not.exist');
    cy.get('[data="list-request-approval"]').should('not.exist');
    cy.get('[data-cy="list-view-status"]').should('exist');
  });

  it('Should have ended', function() {
    cy.fixture('campaigns/enabled-and-ended').as('endedCampaignsJSON');
    cy.route(
      'GET',
      '/api/da/campaign/list/archived/*',
      '@endedCampaignsJSON'
    ).as('endedCampaigns');
    cy.fixture('archived-campaign-states/ended').as('endedJSON');
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@endedJSON').as('ended');
    cy.visit('/campaigns/archived');
    cy.wait('@endedCampaigns');
    cy.get('[data-cy="campaign-status"]')
      .should('exist')
      .contains('Ended');
    cy.get('[data-cy="request-approval-button"]').should('not.exist');
    cy.waitForCampaignMenuAndClick();
    cy.get('[data-cy="archive-campaign-button"]').should('exist');
    cy.get('[data-cy="unarchive-campaign-button"]').should('not.exist');
    cy.get('[data-cy="complete-campaign-button"]').should('not.exist');
    cy.get('[data-cy="list-view"]').click({ force: true });
    cy.get('[data-cy="list-play-pause"]').should('not.exist');
    cy.get('[data-cy="list-complete-campaign"]').should('not.exist');
    cy.get('[data="list-request-approval"]').should('not.exist');
    cy.get('[data-cy="list-view-status"]').should('exist');
  });
});
