export interface FirestoreUser {
  /**
   * Specific place that we assign a user to navigate to
   */
  endpointKey: Endpoint;

  /**
   * Did the user come from our existing users
   */
  existingUser?: boolean;

  /**
   * Existing users may be clumped into groups when importing into the new app
   */
  group?: number;

  /**
   * The last endpoint that they navigated to
   */
  lastEndpoint?: Endpoint;
  lastLogin: string;
  templateManager?: any;
}

export enum Endpoint {
  v1 = 'old',
  v2 = 'marketplace',
}
