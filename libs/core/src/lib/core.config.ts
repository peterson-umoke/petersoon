import { InjectionToken } from '@angular/core';
import { FirebaseAppConfig } from '@angular/fire';

export interface Config {
  /**
   * This is the url to call to create a custom token
   */
  API_URL: string;

  /**
   * Firebase configuration
   */
  FIREBASE_CONFIG: FirebaseAppConfig;
}

export const BLIP_CONFIG = new InjectionToken<Config>('BLIP_CONFIG');
