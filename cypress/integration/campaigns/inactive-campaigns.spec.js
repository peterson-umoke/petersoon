describe('Inactive Campaign Tests', function() {
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
    cy.fixture('campaigns/inactive').as('inactiveCampaignsJSON');
    cy.route(
      'GET',
      '/api/da/campaign/list/draft/*',
      '@inactiveCampaignsJSON'
    ).as('inactiveCampaigns');
  });

  it('Should contain a campaign that is inactive and has ended', function() {
    cy.fixture('campaigns/disabled-and-ended').as(
      'disabledAndEndedCampaignsJSON'
    );
    cy.route(
      'GET',
      '/api/da/campaign/list/draft/*',
      '@disabledAndEndedCampaignsJSON'
    ).as('disabledAndEndedCampaigns');
    cy.fixture('inactive-campaign-states/disabled-and-ended').as(
      'disabledAndEndedJSON'
    );
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@disabledAndEndedJSON').as(
      'disabledAndEnded'
    );
    cy.visit('/campaigns/drafts');
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
    cy.get('[data-cy="list-request-approval"]').should('not.exist');
    cy.get('[data-cy="list-view-status"]').should('exist');
  });

  it('Should contain a campaign that has all user steps completed and can request approval', function() {
    cy.fixture('inactive-campaign-states/request-approval').as(
      'requestApprovalJSON'
    );
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@requestApprovalJSON').as(
      'requestApproval'
    );
    cy.visit('/campaigns/drafts');
    cy.get('[data-cy="waiting-to-launch"').should('not.exist');
    cy.get('[data-cy="request-approval-button"]').should('exist');
    cy.get('[data-cy="campaign-status"]').should('not.exist');
    cy.get('[data-cy="complete-campaign-button"]').should('not.exist');
    cy.get('[data-cy="notifications-button"]').should('not.exist');
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-play-pause"]').should('not.exist');
    cy.get('[data-cy="list-complete-campaign"]').should('not.exist');
    cy.get('[data-cy="list-view-status"]').should('not.exist');
    cy.get('[data-cy="list-request-approval"]').should('exist');
  });

  it('Should contain an inactive campaign where the complete campaign button is showing', function() {
    cy.fixture(
      'inactive-campaign-states/disabled-and-user-steps-incomplete.json'
    ).as('disabledAndUserStepsIncompleteJSON');
    cy.route(
      'GET',
      '/api/da/campaign_stats/*/*/',
      '@disabledAndUserStepsIncompleteJSON'
    ).as('disabledAndUserStepsIncomplete');
    cy.route('GET', '/api/da/campaign/*', '');
    cy.visit('/campaigns/drafts');
    cy.wait('@disabledAndUserStepsIncomplete');
    cy.get('[data-cy="request-approval-button"]').should('not.exist');
    cy.get('[data-cy="waiting-to-launch"').should('not.exist');
    cy.get('[data-cy="campaign-status"]').should('not.exist');
    cy.get('[data-cy="notifications-button"]').should('not.exist');
    cy.get('[data-cy="complete-campaign-button"]')
      .should('exist')
      .click();
    cy.url().should('match', /\/campaign\/edit\/.*\/review/);
    cy.visit('/campaigns/drafts');
    cy.wait('@disabledAndUserStepsIncomplete');
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-play-pause"]').should('not.exist');
    cy.get('[data-cy="list-complete-campaign"]').should('exist');
    cy.get('[data-cy="list-request-approval"]').should('not.exist');
    cy.get('[data-cy="list-view-status"]').should('not.exist');
  });

  it('Should contain a campaign that has all user steps complete and at least one ad is approved', function() {
    cy.fixture('inactive-campaign-states/approved').as('approvedJSON');
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@approvedJSON').as(
      'approved'
    );
    cy.route('GET', '/api/da/campaign/*', '');
    cy.visit('/campaigns/drafts');
    cy.wait('@approved');
    cy.contains('Not Enabled');
    cy.get('[data-cy="enabled"]').should('have.attr', 'value', 'true');
    cy.get('[data-cy="waiting-to-launch"]').should('not.exist');
    cy.get('[data-cy="see-all-analytics"]').click();
    cy.url().should('contain', '/analytics');
    cy.visit('/campaigns/drafts');
    cy.wait('@approved');
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-play-pause"]').should('exist');
    cy.get('[data-cy="list-complete-campaign"]').should('not.exist');
    cy.get('[data-cy="list-request-approval"]').should('not.exist');
    cy.get('[data-cy="list-view-status"]').should('not.exist');
  });
});
