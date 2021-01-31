export interface Ad {
  /**
   * When the Ad was created
   */
  created?: number;

  /**
   * Is the Ad a dynamic ad
   */
  dynamic?: boolean;

  /**
   * Is the Ad editable
   */
  editable?: boolean;

  /**
   * The id of the Ad
   */
  id?: string;

  /**
   * Images for the Ad
   */
  images?: Array<AdImage>;

  /**
   * When the Ad was last modified
   */
  modified?: number;

  /**
   * The name of the Ad
   */
  name: string;

  /**
   * The organization code that the Ad belongs to
   */
  organization?: string;

  /**
   * The quality of the Ad
   */
  quality_score?: string;

  /**
   * The image resolutions for the Ad
   */
  resolutions?: Array<Resolution>;

  selected?: boolean;

  /**
   * If the Ad was created using a template
   */
  template?: string;

  /**
   * If the Ad was created using the artwork generator
   */
  generator_template?: GeneratorTemplate;

  /**
   * The type of the Ad
   */
  type?: string;
}

export interface AdImage {
  changes: object;
  height: number;
  id: string;
  t1_approved: boolean;
  t1_status: string;
  t2_approved: object;
  t2_status: string;
  thumbnail_url: string;
  url: string;
  verified: string;
  width: number;
}

export interface PopReportAd {
  created: string;
  id: string;
  name: string;
}

export interface Resolution {
  height: number;
  width: number;
}

export interface ResizeImage {
  ad: {
    id: string;
    name: string;
  };
  image?: {
    id: string;
    created: number;
    modified: number;
    status: string;
    purpose: string;
    processed: string;
    verified: string;
    changes: {
      mode: string;
      brightness: number;
    };
    modded?: boolean;
    mod_response?: string;
    ad: string;
    filename: string;
    width: number;
    height: number;
    url: string;
    thumbnail_url: string;
    rejection_cause?: string;
    rejection_message?: string;
    video?: boolean;
  };
  width: number;
  height: number;
}

/**
 * This enum describes the different Artwork Generator Templates.
 * The character limit on the server is set to 24, so keep that in mind when adding templates.
 */
export enum GeneratorTemplate {
  BASIC = 'BASIC',
  BASIC_INVERT = 'BASIC_INVERT',
  BASIC_REFLECT = 'BASIC_REFLECT',
  SPLIT = 'SPLIT',
  SPLIT_INVERT = 'SPLIT_INVERT',
  BASIC_ANGLE = 'BASIC_ANGLE',
}
