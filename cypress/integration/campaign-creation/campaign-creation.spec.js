function goToNextStep() {
  cy.get('[data-cy="campaign-next-step"]').click();
}

function reviewAndSubmitForApproval(artworkResize = false) {
  cy.get('[data-cy="campaign-creation-nav-review"]').click({ force: true });
  if (artworkResize) {
    cy.wait('@resizeAds');
  }
  cy.location('pathname').should('eq', '/campaign/new/review');
  cy.get('[data-cy="campaign-creation-request-approval"]')
    .first()
    .click({ force: true });
}

describe('Campaign Creation', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.server();
    cy.fixture('org-info').as('orgInfoJSON');
    cy.route('GET', `/api/account/organization/*/info/`, '@orgInfoJSON').as(
      'orgInformation'
    );
  });

  it('should create a new campaign, click through each step and save to drafts', () => {
    cy.route('GET', `/api/sign/geo*`, []).as('signLocations');
    cy.route('GET', '/api/da/list*', []).as('currentAdsList');
    cy.route('POST', '/api/da/campaign*', 200).as('saveCampaign');

    cy.visit('/campaigns');
    cy.wait('@orgInformation');
    cy.location('pathname').should('eq', '/campaigns');

    cy.get('[data-cy="new-campaign-button"]')
      .should('be.visible')
      .click();
    cy.wait('@signLocations');
    cy.location('pathname').should('eq', '/campaign/new/locations');

    goToNextStep();
    cy.location('pathname').should('eq', '/campaign/new/budget');

    goToNextStep();
    cy.location('pathname').should('eq', '/campaign/new/schedule');

    goToNextStep();
    cy.location('pathname').should('eq', '/campaign/new/artwork');
    cy.wait('@currentAdsList');

    goToNextStep();
    cy.location('pathname').should('eq', '/campaign/new/review');
    cy.get('[data-cy="campaign-creation-save-to-drafts"]')
      .first()
      .click({ force: true });
    cy.wait('@saveCampaign');

    cy.location('pathname').should('eq', '/campaigns/drafts');
  });

  it('should create a new campaign and request approval until all required fields filled', () => {
    // Mock requests
    cy.fixture('signs').as('signsJSON');
    cy.route('GET', `/api/sign/geo*`, '@signsJSON').as('signLocations');
    cy.fixture('ads').as('adsJSON');
    cy.route('GET', `/api/da/list*`, '@adsJSON').as('currentAdsList');
    cy.fixture('campaign-created').as('campaignCreatedJSON');
    cy.route('POST', `/api/da/campaign*`, '@campaignCreatedJSON').as(
      'saveCampaign'
    );
    cy.route('POST', `/api/payment/*/cards/`, 201).as('saveCreditCard');
    cy.route('POST', `/api/da/resize-ad/`, 200).as('resizeAds');

    // Begin campaign creation
    cy.visit('/campaigns');
    cy.wait('@orgInformation');
    cy.location('pathname').should('eq', '/campaigns');

    cy.get('[data-cy="new-campaign-button"]').click();
    cy.wait('@signLocations');
    cy.location('pathname').should('eq', '/campaign/new/locations');

    // Request approval without any required fields
    reviewAndSubmitForApproval();
    cy.location('pathname').should('eq', '/campaign/new/review');

    // Add signs
    cy.get('[data-cy="campaign-creation-nav-locations"]').click({
      force: true,
    });
    cy.location('pathname').should('eq', '/campaign/new/locations');
    cy.get('[data-cy="google-map"]')
      .children()
      .find('img')
      .first();
    cy.get('[data-cy="add-all-visible"]')
      .first()
      .click();

    // Request approval with only signs
    reviewAndSubmitForApproval();
    cy.location('pathname').should('eq', '/campaign/new/review');

    // Add budget
    cy.get('[data-cy="campaign-creation-nav-budget"]').click({ force: true });
    cy.location('pathname').should('eq', '/campaign/new/budget');
    cy.get('[data-cy="daily-budget-input"]')
      .type(1)
      .should('have.value', '1');

    // Request approval missing schedule, artwork and billing
    reviewAndSubmitForApproval();
    cy.location('pathname').should('eq', '/campaign/new/review');

    // Add schedule
    cy.get('[data-cy="campaign-creation-nav-schedule"]').click({ force: true });
    cy.location('pathname').should('eq', '/campaign/new/schedule');
    cy.contains('Single Hour')
      .should('be.visible')
      .click();

    // Request approval missing artwork and billing
    reviewAndSubmitForApproval();
    cy.location('pathname').should('eq', '/campaign/new/review');

    // Add artwork
    cy.get('[data-cy="campaign-creation-nav-artwork"]').click({ force: true });
    cy.location('pathname').should('eq', '/campaign/new/artwork');
    cy.wait('@currentAdsList');
    cy.get('mat-checkbox:first')
      .should('be.visible')
      .click();

    // Request approval missing billing
    reviewAndSubmitForApproval(true);
    cy.location('pathname').should('eq', '/campaign/new/review');

    // Add billing
    cy.get('[data-cy="credit-card-name"]')
      .type('My Name')
      .should('have.value', 'My Name');
    cy.get('[data-cy="credit-card-number"] > iframe')
      .iframeLoaded()
      .its('document')
      .getInDocument('#card_number')
      .type('4111111111111111')
      .should('have.value', '4111 1111 1111 1111');
    cy.get('[data-cy="credit-card-expiration"]')
      .type('01/2030')
      .should('have.value', '01/2030');
    cy.get('[data-cy="credit-card-cvc"] > iframe')
      .iframeLoaded()
      .its('document')
      .getInDocument('#cvv')
      .type('123')
      .should('have.value', '123');
    cy.get('[data-cy="credit-card-submit"]')
      .should('be.visible')
      .click();

    // Define new mock org data for funded card when saving payment info
    cy.fixture('org-info-funded').as('orgInfoFundedJSON');
    cy.route(
      'GET',
      `/api/account/organization/*/info/`,
      '@orgInfoFundedJSON'
    ).as('orgInfoFunded');
    cy.wait('@saveCreditCard');
    cy.wait('@orgInfoFunded');

    // Adding card reloads page
    cy.location('pathname').should('eq', '/campaign/new/review');

    // Change default campaign name
    cy.get('[data-cy="campaign-creation-name"]').should(
      'have.value',
      'New Campaign'
    );
    cy.get('[data-cy="campaign-creation-name"]')
      .type('{selectall}My Test Campaign')
      .should('have.value', 'My Test Campaign');

    // Submit campaign for approval
    cy.get('[data-cy="campaign-creation-request-approval"]')
      .first()
      .click({ force: true });
    cy.wait('@saveCampaign');
    cy.location('pathname').should('eq', '/campaigns');
  });

  it('should archive campaign from drafts', () => {
    cy.fixture('campaign-stats').as('campaignStatsJSON');
    cy.route('GET', `/api/da/campaign_stats/*/*/`, '@campaignStatsJSON').as(
      'campaignStats'
    );
    cy.fixture('campaign-drafts-list').as('campaignListJSON');
    cy.route('GET', `/api/da/campaign/list/draft/*`, '@campaignListJSON').as(
      'campaignList'
    );
    cy.route('DELETE', `/api/da/campaign/*`, 200).as('archiveCampaign');

    cy.visit('/campaigns/drafts');
    cy.location('pathname').should('eq', '/campaigns/drafts');
    cy.wait(['@orgInformation', '@campaignList']);
    cy.waitForCampaignMenuAndClick();
    cy.wait(100);
    cy.get('[data-cy="archive-campaign-button"]').click();
    cy.wait('@archiveCampaign');

    cy.location('pathname').should('eq', '/campaigns/archived');
  });

  it('should delete archived campaign', () => {
    cy.fixture('campaign-stats').as('campaignStatsJSON');
    cy.route('GET', `/api/da/campaign_stats/*/*/`, '@campaignStatsJSON').as(
      'campaignStats'
    );
    cy.fixture('campaign-archived-list').as('campaignListJSON');
    cy.route('GET', `/api/da/campaign/list/archived/*`, '@campaignListJSON').as(
      'campaignList'
    );
    cy.route('PUT', `/api/da/campaign/*`, 200).as('deleteCampaign');

    cy.visit('/campaigns/archived');
    cy.location('pathname').should('eq', '/campaigns/archived');
    cy.wait(['@orgInformation', '@campaignList']);
    cy.waitForCampaignMenuAndClick();
    cy.get('[data-cy="delete-campaign-button"]').click();
    cy.get('[data-cy="change-button"]').click();
    cy.wait('@deleteCampaign');
  });

  it('should create duplicate campaign', () => {
    cy.fixture('campaigns/active').as('activeCampaignsJSON');
    cy.route(
      'GET',
      '/api/da/campaign/list/active/*',
      '@activeCampaignsJSON'
    ).as('activeCampaigns');
    cy.fixture('active-campaign-states/is-live').as('isLiveJSON');
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@isLiveJSON').as('isLive');
    cy.route('GET', '/api/da/campaign/*', '');
    cy.fixture('signs').as('signsJSON');
    cy.route('GET', `/api/sign/geo*`, '@signsJSON').as('signLocations');
    cy.route('POST', '/api/da/campaign*', 200).as('saveCampaign');
    cy.fixture('campaign-loaded').as('campaignLoadedJSON');
    cy.route('GET', `/api/da/campaign/*`, '@campaignLoadedJSON').as(
      'loadCampaign'
    );

    cy.visit('/campaigns');
    cy.wait('@isLive');
    cy.contains('Running');
    cy.waitForCampaignMenuAndClick();
    cy.get('[data-cy="duplicate-campaign-button"]').click();

    cy.wait(['@loadCampaign', '@signLocations']);
    cy.location('pathname').should('eq', '/campaign/new/locations');

    cy.get('[data-cy="campaign-creation-nav-review"]').click({ force: true });
    cy.location('pathname').should('eq', '/campaign/new/review');
    cy.wait(1000);
    cy.get('[data-cy="campaign-creation-name"]')
      .invoke('val')
      .should('eq', 'New Campaign Duplicate');
    cy.get('[data-cy="campaign-creation-save-to-drafts"]')
      .first()
      .click({ force: true });
    cy.wait('@saveCampaign');

    cy.location('pathname').should('eq', '/campaigns/drafts');
  });

  it('should edit existing campaign', () => {
    cy.fixture('campaigns/active').as('activeCampaignsJSON');
    cy.route(
      'GET',
      '/api/da/campaign/list/active/*',
      '@activeCampaignsJSON'
    ).as('activeCampaigns');
    cy.fixture('active-campaign-states/is-live').as('isLiveJSON');
    cy.route('GET', '/api/da/campaign_stats/*/*/', '@isLiveJSON').as('isLive');
    cy.route('GET', '/api/da/campaign/*', '');
    cy.fixture('signs').as('signsJSON');
    cy.route('GET', `/api/sign/geo*`, '@signsJSON').as('signLocations');
    cy.route('PUT', '/api/da/campaign/rt3zsx', 200).as('saveCampaign');
    cy.fixture('campaign-loaded').as('campaignLoadedJSON');
    cy.route('GET', `/api/da/campaign/*`, '@campaignLoadedJSON').as(
      'loadCampaign'
    );
    cy.route('POST', `/api/da/resize-ad/`, 200).as('resizeAd');

    cy.visit('/campaigns');
    cy.wait('@isLive');
    cy.contains('Running');
    cy.waitForCampaignMenuAndClick();
    cy.get('[data-cy="edit-campaign-button"]').click();

    cy.wait(['@loadCampaign', '@signLocations']);
    cy.location('pathname').should('eq', '/campaign/edit/rt3zsx/locations');

    cy.get('[data-cy="campaign-creation-nav-review"]').click({ force: true });
    cy.location('pathname').should('eq', '/campaign/edit/rt3zsx/review');
    cy.wait(1000);
    cy.get('[data-cy="campaign-creation-name"]')
      .type('Edited Campaign')
      .should('have.value', 'Edited Campaign');
    cy.get('[data-cy="campaign-edit-save-and-close"]')
      .first()
      .click({ force: true });
    cy.wait(['@saveCampaign', '@resizeAd']);
  });
});
