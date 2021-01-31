// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.model';

export const environment: Environment = {
  API_URL: 'http://localhost:7676',
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
    apiKey: 'AIzaSyCc14M76Stxa40wYztMd1yKJ_ocFBvlRZc',
    authDomain: 'blip-development-applications.firebaseapp.com',
    databaseURL: 'https://blip-development-applications.firebaseio.com',
    projectId: 'blip-development-applications',
    storageBucket: 'blip-development-applications.appspot.com',
    messagingSenderId: '260493437984',
  },
  GOOGLE_JS_MAPS_KEY: 'AIzaSyCveLzusymV599roUqIQH0sGqnxPRypL80',
  GOOGLE_OPTIMIZE_ID: 'GTM-NV6FMK4',
  INTERCOM_ID: 'c5k4xlcu',
  LOCALE_ID: 'en-US',
  MAP_CENTER: { lat: 39.8333333, lng: -98.585522 },
  SCRAPER_URL: 'http://localhost:8080',
  SPREEDLY_ENVIRONMENT_KEY: 'Y8T36KDytUzfILp49yQuJ6e4HjF',
  TRANSLATION_URL: '/i18n/',
  // This redirects users to the fonts which are self-hosted on Amazon S3
  // @https://blipbillboards-marketplace.s3.amazonaws.com/fonts
  TYPOGRAPHY_URL: 'https://cloud.typography.com/6201838/7392212/css/fonts.css',
  SVG_TO_PNG_URL:
    'https://us-central1-blip-staging-applications.cloudfunctions.net/svgToPng',

  production: false,
  version: 'DEV',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
