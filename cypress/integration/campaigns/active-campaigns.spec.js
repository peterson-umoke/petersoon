describe('Active Campaigns Tests', function() {
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
    cy.fixture('campaigns/active').as('activeCampaignsJSON');
    cy.route(
      'GET',
      '/api/da/campaign/list/active/*',
      '@activeCampaignsJSON'
    ).as('activeCampaigns');
  });

  it('Should contain a campaign that is live', function() {
    cy.fixture('active-campaign-states/is-live').as('isLiveJSON');
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@isLiveJSON').as('isLive');
    cy.route('GET', '/api/da/campaign/*', '');
    cy.visit('/campaigns');
    cy.wait('@isLive');
    cy.contains('Running');
    cy.get('[data-cy="enabled"]').should('have.attr', 'value', 'true');
    cy.get('[data-cy="waiting-to-launch"]').should('not.exist');
    cy.get('[data-cy="see-all-analytics"]').should('exist');
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-play-pause"]').should('exist');
    cy.get('[data-cy="list-waiting-to-launch"]').should('not.exist');
  });

  it('Should contain a campaign that is waiting to launch', function() {
    cy.fixture('active-campaign-states/is-waiting-to-launch').as(
      'isWaitingToLaunchJSON'
    );
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@isWaitingToLaunchJSON').as(
      'isWaitingToLaunch'
    );
    cy.visit('/campaigns');
    cy.wait('@isWaitingToLaunch');
    cy.get('[data-cy="waiting-to-launch"').should('exist');
    cy.get('[data-cy="review-icon"]').should(
      'have.attr',
      'src',
      'https://blipbillboards-marketplace.s3.amazonaws.com/svg/in-progress.svg'
    );
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-waiting-to-launch"]').should('exist');
    cy.get('[data-cy="list-play-pause"]').should('not.exist');
  });

  it('Should contain a campaign that needs ads verified and no ads are approved', function() {
    cy.fixture('active-campaign-states/needs-verify-none-approved').as(
      'needsVerifyNoneApprovedJSON'
    );
    cy.route(
      'GET',
      '/api/da/campaign_stats/*/*/',
      '@needsVerifyNoneApprovedJSON'
    ).as('needsVerifyNoneApproved');
    cy.visit('/campaigns');
    cy.wait('@needsVerifyNoneApproved');
    cy.get('[data-cy="waiting-to-launch"').should('exist');
    cy.get('[data-cy="review-icon"]').should(
      'have.attr',
      'src',
      'https://blipbillboards-marketplace.s3.amazonaws.com/svg/incomplete.svg'
    );
    cy.get('[data-cy="verify-link"]')
      .should('contain', 'View')
      .should('be.visible')
      .click();
    cy.url().should('contain', '/das/verifications');
    cy.visit('/campaigns');
    cy.wait('@needsVerifyNoneApproved');
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-waiting-to-launch"]').should('exist');
    cy.get('[data-cy="list-play-pause"]').should('not.exist');
  });

  it('Should contain a campaign that needs ads verified and at least one ad is approved', function() {
    cy.fixture('active-campaign-states/needs-verify-some-approved').as(
      'needsVerifySomeApprovedJSON'
    );
    cy.route(
      'GET',
      '/api/da/campaign_stats/*/*/',
      '@needsVerifySomeApprovedJSON'
    ).as('needsVerifySomeApproved');
    cy.visit('/campaigns');
    cy.wait('@needsVerifySomeApproved');
    cy.contains('Running');
    cy.get('[data-cy="enabled"]').should('have.attr', 'value', 'true');
    cy.get('[data-cy="notifications-button"]')
      .should('be.visible')
      .click();
    // Wait 1 second for the transition
    cy.wait(1000);
    cy.contains('Verify Images')
      .should('be.visible')
      .click();
    cy.url().should('contain', '/das/verifications');
    cy.visit('/campaigns');
    cy.wait('@needsVerifySomeApproved');
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-play-pause"]').should('exist');
    cy.get('[data-cy="list-waiting-to-launch"]').should('not.exist');
  });

  it('Should contain a campaign where none of its ads fit any selected signs', function() {
    cy.fixture('active-campaign-states/no-ads-fit-selected-signs.json').as(
      'noAdsFitSelectedSignsJSON'
    );
    cy.route(
      'GET',
      '/api/da/campaign_stats/*/*/',
      '@noAdsFitSelectedSignsJSON'
    ).as('noAdsFitSelectedSigns');
    cy.route('GET', '/api/da/campaign/*', '');
    cy.visit('/campaigns');
    cy.wait('@noAdsFitSelectedSigns');
    cy.get('[data-cy="waiting-to-launch"').should('exist');
    cy.contains('Replace Rejected Artwork');
    cy.get('[data-cy="replace-artwork"]')
      .should('be.visible')
      .click();
    cy.url().should('match', /\/campaign\/edit\/.*\/artwork/);
    cy.visit('/campaigns');
    cy.wait('@noAdsFitSelectedSigns');
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-waiting-to-launch"]').should('exist');
    cy.get('[data-cy="list-play-pause"]').should('not.exist');
  });

  it('Should contain a campaign where all of its ads were rejected', function() {
    cy.fixture('active-campaign-states/ads-rejected.json').as(
      'adsRejectedJSON'
    );
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@adsRejectedJSON').as(
      'adsRejected'
    );
    cy.route('GET', '/api/da/campaign/*', '');
    cy.visit('/campaigns');
    cy.wait('@adsRejected');
    cy.contains('Replace Rejected Artwork');
    cy.get('[data-cy="replace-artwork"]')
      .should('be.visible')
      .click();
    cy.url().should('match', /\/campaign\/edit\/.*\/artwork/);
    cy.visit('/campaigns');
    cy.wait('@adsRejected');
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-waiting-to-launch"]').should('exist');
    cy.get('[data-cy="list-play-pause"]').should('not.exist');
  });

  it('Should contain a campaign where the complete campaign button is showing', function() {
    cy.fixture('active-campaign-states/user-steps-incomplete.json').as(
      'userStepsIncompleteJSON'
    );
    cy.route(
      'GET',
      '/api/da/campaign_stats/*/*/',
      '@userStepsIncompleteJSON'
    ).as('userStepsIncomplete');
    cy.route('GET', '/api/da/campaign/*', '');
    cy.visit('/campaigns');
    cy.wait('@userStepsIncomplete');
    cy.get('[data-cy="waiting-to-launch"').should('not.exist');
    cy.get('[data-cy="complete-campaign-button"]')
      .should('exist')
      .should('be.visible')
      .click();
    cy.url().should('match', /\/campaign\/edit\/.*\/review/);
    cy.visit('/campaigns');
    cy.wait('@userStepsIncomplete');
    cy.get('[data-cy="list-view"]')
      .should('be.visible')
      .click();
    cy.get('[data-cy="list-complete-campaign"]').should('exist');
    cy.get('[data-cy="list-waiting-to-launch"]').should('not.exist');
    cy.get('[data-cy="list-play-pause"]').should('not.exist');
  });
});
