import { Environment } from './environment.model';

export const environment: Environment = {
  API_URL: 'https://staging-server.blipbillboards.com',
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
    apiKey: 'AIzaSyCYp9GpWirC8N6frQuHjbChjNb2wXeCL4U',
    authDomain: 'staging.blipbillboards.com',
    databaseURL: 'https://blip-staging-applications.firebaseio.com',
    projectId: 'blip-staging-applications',
    storageBucket: 'blip-staging-applications.appspot.com',
    messagingSenderId: '813742015544',
  },
  GOOGLE_JS_MAPS_KEY: 'AIzaSyCveLzusymV599roUqIQH0sGqnxPRypL80',
  GOOGLE_OPTIMIZE_ID: 'GTM-NV6FMK4',
  INTERCOM_ID: 'c5k4xlcu',
  LOCALE_ID: 'en-US',
  MAP_CENTER: { lat: 39.8333333, lng: -98.585522 },
  SCRAPER_URL: 'https://blip-scraper.herokuapp.com/scrape_json',
  SPREEDLY_ENVIRONMENT_KEY: 'Y8T36KDytUzfILp49yQuJ6e4HjF',
  TRANSLATION_URL: '/i18n/',
  TYPOGRAPHY_URL: 'https://cloud.typography.com/6201838/7392212/css/fonts.css',
  SVG_TO_PNG_URL:
    'https://us-central1-blip-staging-applications.cloudfunctions.net/svgToPng',

  production: false,
  version: 'DEV',
};
