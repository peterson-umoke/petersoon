import { FirebaseAppConfig } from '@angular/fire';

export interface Environment {
  API_URL: string;
  BING_MAPS_KEY: string;
  /**
   * ISO 4217 currency code
   * @example USD 'United States dollar'
   * @example JPY 'Japanese yen'
   */
  CURRENCY_CODE: string;
  DEFAULT_PRICES: {
    low: string;
    medium: string;
    high: string;
  };
  DESIGN_15_SLACK_TOKEN: string;
  FIREBASE_CONFIG: FirebaseAppConfig;
  GOOGLE_JS_MAPS_KEY: string;
  GOOGLE_OPTIMIZE_ID: string;
  INTERCOM_ID: string;
  /**
   * The 2-4 letter locale id
   * @example en-us 'English - United States'
   * @example ja 'Japanese'
   */
  LOCALE_ID: string;

  MAP_CENTER: { lat: number; lng: number };
  SCRAPER_URL: string;
  SPREEDLY_ENVIRONMENT_KEY: string;
  TRANSLATION_URL: string;
  TYPOGRAPHY_URL: string;
  SVG_TO_PNG_URL: string;

  production: boolean;
  version: string;
}
