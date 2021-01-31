export interface Playlist {
  id?: string;
  created?: number;
  modified?: number;
  organization?: string;
  name?: string;
  ads?: Array<PlayListImage>;
  rules?: Array<PlayListRule>;
}

export interface PlayListImage {
  thumbnail_url: string;
  id: string;
  name: string;
  index?: number;
  rules?: Rule;
}

export interface PlayListRule {
  rules?: Rule;
  position: number;
  template: number;
}

export interface Rule {
  DateTimeRange?: DateTimeRangeRule;
  UrlBoolean?: UrlBooleanRule;
  WeeklyOnTimes?: WeeklyOnTimesRule;
  ZIndex?: ZIndexRule;
}

export interface DateTimeRangeRule {
  start: string;

  /**
   * This should be a moment instance
   */
  startDate?: any;
  startTime?: string;
  end: string;

  /**
   * This should be a moment instance
   */
  endDate?: any;
  endTime?: string;
}

export interface UrlBooleanRule {
  on_above_threshold?: boolean;
  on_by_default?: boolean;
  path?: string;
  stale_time?: number;
  threshold?: string;
  url?: string;
  value?: string;
  xpath?: string;
}

export interface WeeklyOnTimesRule {
  on_ranges?: Array<Array<number>>;
}

export interface ZIndexRule {
  'z-index': number;
}
