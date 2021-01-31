import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  Ad,
  Campaign,
  CampaignRule,
  DailyCalendarData,
  DailyCalendarPrices,
  Sign,
} from '@marketplace/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  DaySchedule,
  HourPrice,
  SchedulePreset,
  WeeklySchedule,
  WizardScheduleService,
} from '../wizard-schedule/wizard-schedule.service';

@Injectable()
export class CampaignConversionService {
  public initialSigns: Sign[];
  public initialSchedule: WeeklySchedule;
  public initialSchedulePreset: SchedulePreset;
  public initialSelectedAds: Ad[];

  constructor(private scheduleService: WizardScheduleService) {}

  public initializeValues(
    campaign: Campaign,
    signs: Sign[],
    campaignForm: FormGroup
  ): void {
    // Budget, start, end, name
    const start = _.get(campaign, 'start_date', null);
    const end = _.get(campaign, 'end_date', null);
    campaignForm.patchValue({
      name: _.get(campaign, 'name', 'New Campaign'),
      budget: _.get(campaign, 'daily_budget', null),
      startDate: start ? moment(start) : null,
      endDate: end ? moment(end) : null,
    });
    // Signs
    const campaignSignIds: string[] = _.get(campaign, 'sign_group.signs', []);
    this.initialSigns = _.map(signs, (sign) => {
      if (_.some(campaignSignIds, (id) => id === sign.id)) {
        sign.selected = true;
      }
      return sign;
    });
    // Max per blip
    const dailyCalendar =
      _.find(_.get(campaign, 'rule_group.rules', []), [
        'type',
        'DailyCalendar',
      ]) || null;
    const mpbLow = parseFloat(_.get(dailyCalendar, 'prices.low', 0.1));
    const mpbMed = parseFloat(_.get(dailyCalendar, 'prices.medium', 0.25));
    const mpbHigh = parseFloat(_.get(dailyCalendar, 'prices.high', 0.5));
    campaignForm.patchValue({
      mpbLow: mpbLow,
      mpbMed: mpbMed,
      mpbHigh: mpbHigh,
    });
    // Schedule
    this.initialSchedule = dailyCalendar
      ? this.interpolateDailyCalendar(
          dailyCalendar.data,
          mpbLow,
          mpbMed,
          mpbHigh
        )
      : null;
    if (this.initialSchedule) {
      this.scheduleService.matchPreset(this.initialSchedule);
    }
    // Ads
    const campaignAds = _.get(campaign, 'ad_group.ads', []);
    this.initialSelectedAds = campaignAds;
  }

  public convertToCampaign(
    campaign: Campaign,
    schedule: WeeklySchedule,
    selectedSigns: Sign[],
    selectedAds: Ad[],
    campaignForm: FormGroup
  ): Campaign {
    const prices: DailyCalendarPrices = {
      low: campaignForm.get('mpbLow').value.toString(),
      medium: campaignForm.get('mpbMed').value.toString(),
      high: campaignForm.get('mpbHigh').value.toString(),
    };
    // Extrapolate schedule
    const dailyCalendarData: DailyCalendarData[] = this.extrapolateDailyCalendar(
      schedule,
      parseFloat(prices.low),
      parseFloat(prices.medium),
      parseFloat(prices.high)
    );
    const rule: CampaignRule = {
      type: 'DailyCalendar',
      data: dailyCalendarData,
      prices: prices,
    };
    const existingIndex = _.findIndex(_.get(campaign, 'rule_group.rules', []), [
      'type',
      'DailyCalendar',
    ]);
    let ruleGroup = { rules: [] };
    if (existingIndex > -1) {
      ruleGroup = _.cloneDeep(campaign.rule_group);
      ruleGroup.rules.splice(existingIndex, 1);
      ruleGroup.rules.push(rule);
    } else {
      ruleGroup.rules.push(rule);
    }
    // Start & End
    const start = campaignForm.get('startDate').value;
    const end = campaignForm.get('endDate').value;
    //SignGroup
    const signGroup = _.cloneDeep(_.get(campaign, 'sign_group', null)) || {
      auto_include: true,
      type: 'CAMPAIGN',
      organization: null,
    };
    signGroup['signs'] = _.map(selectedSigns, (sign: Sign) => sign.id);
    //AdGroup
    const adGroup = _.cloneDeep(campaign.ad_group) || {};
    adGroup['ads'] = [...selectedAds];

    return campaign.clone({
      name: campaignForm.get('name').value,
      daily_budget: campaignForm.get('budget').value,
      start_date: start ? start.format('YYYY-MM-DD') : null,
      end_date: end ? end.format('YYYY-MM-DD') : null,
      ad_group: adGroup,
      sign_group: signGroup,
      rule_group: ruleGroup,
    });
  }

  /**
   * Convert daily calendar data from the data structure stored on the database
   * to a simple 2D array for working with on the client.
   */
  public interpolateDailyCalendar(
    dailyCalendarData: DailyCalendarData[],
    mpbLow: number,
    mpbMed: number,
    mpbHigh: number
  ): WeeklySchedule {
    const weeklySchedule = [];
    _.forEach(_.range(24), (_hour) =>
      weeklySchedule.push([0, 0, 0, 0, 0, 0, 0])
    ); // initialize 24/7 2d array
    _.forEach(dailyCalendarData, (data: DailyCalendarData) => {
      const ptHours = {};
      _.forEach(data.price_times, (pt: [number, number]) => {
        // price_times in minutes
        ptHours[pt[0] / 60] = pt[1]; // price
      });
      let previousHour = 0;
      let previousPrice = _.get(ptHours, 0, 0);
      _.forEach(data.days, (day: number) => {
        // Recursive function for filling gaps in graph
        function fillHours(current: number, target: number) {
          if (current < target) {
            weeklySchedule[current][day] = previousPrice;
            return fillHours(current + 1, target);
          }
        }
        _.mapKeys(ptHours, (price: number, hour: string) => {
          fillHours(previousHour, parseInt(hour, 10));
          previousHour = parseInt(hour, 10);
          previousPrice = price;
        });
      });
    });
    return _.map(weeklySchedule, (day: DaySchedule) =>
      _.map(day, (hourType: HourPrice) => {
        switch (hourType) {
          case 0:
            return 0;
          case mpbLow:
            return 'low';
          case mpbMed:
            return 'med';
          case mpbHigh:
            return 'high';
        }
      })
    );
  }

  /**
   * Convert a 2D array to the DailyCalendar data structure stored on the server.
   */
  public extrapolateDailyCalendar(
    weeklySchedule: WeeklySchedule,
    mpbLow: number,
    mpbMed: number,
    mpbHigh: number
  ): DailyCalendarData[] {
    const schedule = _.map(weeklySchedule, (day: DaySchedule) =>
      _.map(day, (hourType: HourPrice) => {
        switch (hourType) {
          case 0:
            return 0;
          case 'low':
            return mpbLow;
          case 'med':
            return mpbMed;
          case 'high':
            return mpbHigh;
        }
      })
    );
    const data = [];
    // Transpose schedule and group days by equal price times
    _.forEach(_.zip.apply(_, schedule), (hours: number[], day: number) => {
      const priceTimesOrig = [];
      _.forEach(hours, (price: number, hour: number) => {
        const pt = [hour * 60, price];
        const previousPrice = hour !== 0 ? hours[hour - 1] : hours[0];
        // Skip hours where price doesn't change
        if (hour === 0 || price !== previousPrice) {
          priceTimesOrig.push(pt);
        }
      });
      priceTimesOrig.push([24 * 60, hours[0]]);
      const priceTimesDup = _.cloneDeep(priceTimesOrig); // dup for splicing
      _.forEach(priceTimesOrig, (pt, index) => {
        if (index !== 0 && index !== priceTimesOrig.length - 1) {
          const minutes = pt[0];
          const price = _.last(priceTimesOrig[index - 1]);
          const spliceIndex = _.findIndex(
            priceTimesDup,
            (p) => p[0] === minutes
          ); // index is variable based on iterative splicing
          priceTimesDup.splice(spliceIndex, 0, [minutes, price]);
        }
      });
      const candidate = {
        days: [day],
        price_times: priceTimesDup,
      };
      const match = _.find(data, (existing) =>
        _.isEqual(existing.price_times, candidate.price_times)
      );
      if (match) {
        match.days.push(day); // group by day
      } else {
        data.push(candidate);
      }
    });
    return data;
  }
}
