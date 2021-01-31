import { Environment } from './environment.model';

export const environment: Environment = {
  API_URL: 'https://app.blipbillboards.com',
  BING_MAPS_KEY:
    'Akrg_YKzZDsCEhUOmfJ_7YrFzUDvtxgxjLj17kL58WOCEKx6b1z1R5P3_l3psx4X',
  CURRENCY_CODE: 'USD',
  DEFAULT_PRICES: {
    low: '.10',
    medium: '.25',
    high: '.50',
  },
  DESIGN_15_SLACK_TOKEN: 'bp5SDSMoTAtlCxwQpkST2KMk',
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyCfzdxMUlTXjjy95QzrHkkGjN0acamGG30',
    authDomain: 'marketplace.blipbillboards.com',
    databaseURL: 'https://blip-production-applications.firebaseio.com',
    projectId: 'blip-production-applications',
    storageBucket: 'blip-production-applications.appspot.com',
    messagingSenderId: '2289372147',
  },
  GOOGLE_JS_MAPS_KEY: 'AIzaSyDHWfxHYOB1c-z9N6t8k2L5-bi3p_7w3ZE',
  GOOGLE_OPTIMIZE_ID: 'GTM-NV6FMK4',
  INTERCOM_ID: 'c5k4xlcu',
  LOCALE_ID: 'en-US',
  MAP_CENTER: { lat: 39.8333333, lng: -98.585522 },
  SCRAPER_URL: 'https://blip-scraper.herokuapp.com/scrape_json',
  SPREEDLY_ENVIRONMENT_KEY: 'WR2bmnIiTQfw142RAM1TtzPRfmq',
  TRANSLATION_URL: '/i18n/',
  TYPOGRAPHY_URL: 'https://cloud.typography.com/6201838/7392212/css/fonts.css',
  SVG_TO_PNG_URL:
    'https://us-central1-blip-staging-applications.cloudfunctions.net/svgToPng',

  // Important to have staging mock production as closely as possible
  production: true,
  version: 'QA',
};
