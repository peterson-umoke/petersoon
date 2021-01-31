import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';

export type HourPrice = 0 | 'low' | 'med' | 'high';
export type DaySchedule = HourPrice[];
export type WeeklySchedule = DaySchedule[];
export const PRESET_KEYS = [
  'MAX_AUDIENCE',
  'DAILY_COMMUTE',
  'MEAL_TIMES',
  'SINGLE_HOUR',
  'OFF_PEAK_HOUR',
  'CUSTOM_SCHEDULE',
] as const;
export type SchedulePresetKeys = typeof PRESET_KEYS;
export type SchedulePreset = typeof PRESET_KEYS[number];

const l: HourPrice = 'low';
const m: HourPrice = 'med';
const h: HourPrice = 'high';

@Injectable()
export class WizardScheduleService {
  private selectedPreset: BehaviorSubject<SchedulePreset>;
  private presets: {};
  private customSchedule: WeeklySchedule;

  public presetKeys: SchedulePresetKeys = PRESET_KEYS;
  public selectedPreset$: Observable<SchedulePreset>;

  constructor(private translateService: TranslateService) {
    this.selectedPreset = new BehaviorSubject('MAX_AUDIENCE');
    this.selectedPreset$ = this.selectedPreset.asObservable();
    this.customSchedule = this.getEmptySchedule();
    this.presets = {
      MAX_AUDIENCE: this.getMaxAudience(),
      DAILY_COMMUTE: this.getDailyCommute(),
      MEAL_TIMES: this.getMealTimes(),
      SINGLE_HOUR: this.getSingleHour(),
      OFF_PEAK_HOUR: this.getOffPeakHour(),
    };
  }

  public updateSelectedPreset(preset: SchedulePreset): WeeklySchedule {
    this.selectedPreset.next(preset);
    return preset === 'CUSTOM_SCHEDULE'
      ? this.customSchedule
      : _.map(this.presets[preset], _.cloneDeep);
  }

  public matchPreset(schedule: WeeklySchedule): void {
    this.selectedPreset.next(
      _.find(
        this.presetKeys,
        (key) =>
          key === 'CUSTOM_SCHEDULE' || _.isEqual(this.presets[key], schedule)
      )
    );
    if (this.selectedPreset.value === 'CUSTOM_SCHEDULE') {
      this.customSchedule = schedule;
    }
  }

  public localDays(): Array<any> {
    return Array.from(Array(7).keys()).map((day: number) =>
      moment()
        .locale(this.translateService.currentLang)
        .weekday(day)
        .format('ddd')
        .toLocaleUpperCase()
    );
  }

  public localHours(): Array<any> {
    return Array.from(Array(24).keys()).map((hour: number) =>
      moment(`${hour}:00`, 'HH:mm')
        .locale(this.translateService.currentLang)
        .format('h a')
        .toLocaleUpperCase()
    );
  }

  public getEmptySchedule(): WeeklySchedule {
    return _.map(
      _.times(24, _.constant(_.times(7, _.constant(0)))),
      _.cloneDeep
    ) as WeeklySchedule;
  }

  public getMaxAudience(): WeeklySchedule {
    return _.map(
      [
        ..._.times(6, _.constant(_.times(7, _.constant(0)))),
        [0, l, l, l, l, l, 0],
        ..._.times(3, _.constant([0, h, h, h, h, h, 0])),
        [h, h, h, h, h, h, h],
        ..._.times(4, _.constant([h, m, m, m, m, m, h])),
        ..._.times(5, _.constant([h, h, h, h, h, h, h])),
        ..._.times(2, _.constant([m, m, m, m, m, m, m])),
        ..._.times(2, _.constant(_.times(7, _.constant(0)))),
      ],
      _.cloneDeep
    ) as WeeklySchedule;
  }

  public getDailyCommute(): WeeklySchedule {
    return _.map(
      [
        ..._.times(7, _.constant(_.times(7, _.constant(0)))),
        ..._.times(3, _.constant([0, h, h, h, h, h, 0])),
        ..._.times(7, _.constant(_.times(7, _.constant(0)))),
        ..._.times(3, _.constant([0, h, h, h, h, h, 0])),
        ..._.times(4, _.constant(_.times(7, _.constant(0)))),
      ],
      _.cloneDeep
    ) as WeeklySchedule;
  }

  public getMealTimes(): WeeklySchedule {
    return _.map(
      [
        ..._.times(7, _.constant(_.times(7, _.constant(0)))),
        ..._.times(3, _.constant([h, h, h, h, h, h, h])),
        ..._.times(2, _.constant(_.times(7, _.constant(0)))),
        ..._.times(2, _.constant([h, h, h, h, h, h, h])),
        ..._.times(3, _.constant(_.times(7, _.constant(0)))),
        ..._.times(3, _.constant([h, h, h, h, h, h, h])),
        ..._.times(4, _.constant(_.times(7, _.constant(0)))),
      ],
      _.cloneDeep
    ) as WeeklySchedule;
  }

  public getSingleHour(): WeeklySchedule {
    return _.map(
      [
        ..._.times(17, _.constant(_.times(7, _.constant(0)))),
        [h, h, h, h, h, h, h],
        ..._.times(6, _.constant(_.times(7, _.constant(0)))),
      ],
      _.cloneDeep
    ) as WeeklySchedule;
  }

  public getOffPeakHour(): WeeklySchedule {
    return _.map(
      [
        ..._.times(7, _.constant([m, m, m, m, m, m, m])),
        ..._.times(4, _.constant([m, 0, 0, 0, 0, 0, m])),
        ..._.times(5, _.constant([m, m, m, m, m, m, m])),
        ..._.times(3, _.constant([m, 0, 0, 0, 0, 0, m])),
        ..._.times(5, _.constant([m, m, m, m, m, m, m])),
      ],
      _.cloneDeep
    ) as WeeklySchedule;
  }
}
