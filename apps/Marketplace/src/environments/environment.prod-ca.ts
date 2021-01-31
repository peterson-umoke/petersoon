import { Environment } from './environment.model';

export const environment: Environment = {
  API_URL: 'https://app-ca.blipbillboards.com',
  BING_MAPS_KEY:
    'AuBaChucN5bJZS9eknVu2MWhzJG0DWzRx3bIHut6NCJIoN5X3DWIySS8HWG5B1oF',
  CURRENCY_CODE: 'CAD',
  DEFAULT_PRICES: {
    low: '.15',
    medium: '.35',
    high: '.65',
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
  GOOGLE_JS_MAPS_KEY: 'AIzaSyAWhcShXGnKyJzXAXNBcP8iOTsOnuxUbA4',
  GOOGLE_OPTIMIZE_ID: 'GTM-NV6FMK4',
  INTERCOM_ID: 'lj75t24i',
  LOCALE_ID: 'en-CA',
  MAP_CENTER: { lat: 56.1304, lng: -106.3468 },
  SCRAPER_URL: 'https://blip-scraper.herokuapp.com/scrape_json',
  SPREEDLY_ENVIRONMENT_KEY: 'WR2bmnIiTQfw142RAM1TtzPRfmq',
  TRANSLATION_URL: 'https://blipbillboards-marketplace.s3.amazonaws.com/i18n/',
  TYPOGRAPHY_URL: 'https://cloud.typography.com/6201838/7392212/css/fonts.css',
  SVG_TO_PNG_URL:
    'https://us-central1-blip-marketplace.cloudfunctions.net/svgToPng',

  // This is automatically changed by running node ./replace-version.js
  production: true,
  version: '0.0.0',
};
