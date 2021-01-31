import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Campaign,
  CampaignService,
  TranslationService,
} from '@marketplace/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

interface DailyTotal {
  blips: number;
  day: string;
  spent: number;
}

interface HourlyTotal {
  blips: number;
  hour: number;
  spent: number;
}

interface MonthlyTotal {
  blips: number;
  month: string;
  spent: number;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaign-analytics',
  templateUrl: './campaign-analytics.component.html',
  styleUrls: ['./campaign-analytics.component.scss'],
})
export class CampaignAnalyticsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public blipsText: string;
  public campaign: Campaign;
  public dailyData: Array<any>;
  public dailyYAxisMax: number;
  public hourlyData: Array<any>;
  public hourlyYAxisMax: number;
  public monthlyData: Array<any>;
  public monthlyYAxisMax: number;
  public yesterdayData: Array<any>;
  public yesterdayYAxisMax: number;
  public spentText: string;

  constructor(
    public campaignService: CampaignService,
    public translationService: TranslationService
  ) {
    this.translationService
      .getTranslation(['BLIPS.TEXT', 'SPENT'])
      .subscribe((translations: Array<string>) => {
        this.blipsText = translations['BLIPS.TEXT'];
        this.spentText = translations['SPENT'];
      });
  }

  ngOnInit() {
    this.subscriptions.add(
      this.campaignService.$campaign.subscribe((campaign: Campaign) => {
        if (campaign) {
          this.campaign = campaign;
          this.formatBlips(campaign);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Create the daily and hourly data for the graphs
   * @param campaign
   */
  private formatBlips(campaign: any): void {
    // Create Monthly Data
    const monthlyBlips = [],
      monthlySpend = [];
    let monthlyBlipMax = 0;
    campaign.monthly.forEach((monthlyTotal: MonthlyTotal) => {
      const day = moment(monthlyTotal.month, 'YYYY-MM-DD').format('MMM');
      monthlyBlips.push({ value: monthlyTotal.blips, name: day });
      monthlySpend.push({ value: monthlyTotal.spent, name: day });
      if (monthlyTotal.blips > monthlyBlipMax) {
        monthlyBlipMax = monthlyTotal.blips;
      }
    });
    this.monthlyData = [
      { name: this.blipsText, series: monthlyBlips },
      { name: this.spentText, series: monthlySpend },
    ];

    // Create Daily Data
    const dailyBlips = [],
      dailySpend = [];
    let dailyBlipMax = 0;
    campaign.daily.forEach((dailyTotal: DailyTotal) => {
      const day = moment(dailyTotal.day, 'YYYY-MM-DD').format('D MMM');
      dailyBlips.push({ value: dailyTotal.blips, name: day });
      dailySpend.push({ value: dailyTotal.spent, name: day });
      if (dailyTotal.blips > dailyBlipMax) {
        dailyBlipMax = dailyTotal.blips;
      }
    });
    this.dailyData = [
      { name: this.blipsText, series: dailyBlips },
      { name: this.spentText, series: dailySpend },
    ];

    // Create hourly data
    const hourlyBlips = [],
      hourlySpend = [],
      yesterdayBlips = [],
      yesterdaySpend = [];
    for (let i = 0; i < 24; i++) {
      const hour = moment(`${i}:00`, 'HH:mm').format('h a');
      hourlyBlips.push({ value: 0, name: hour });
      hourlySpend.push({ value: 0, name: hour });
      yesterdayBlips.push({ value: 0, name: hour });
      yesterdaySpend.push({ value: 0, name: hour });
    }

    // Create All Time hourly Data
    let hourlyBlipMax = 0;
    campaign.hourly.forEach((hourlyTotal: HourlyTotal) => {
      hourlyBlips[hourlyTotal.hour].value = hourlyTotal.blips;
      hourlySpend[hourlyTotal.hour].value = hourlyTotal.spent;
      if (hourlyTotal.blips > hourlyBlipMax) {
        hourlyBlipMax = hourlyTotal.blips;
      }
    });
    this.hourlyData = [
      { name: this.blipsText, series: hourlyBlips },
      { name: this.spentText, series: hourlySpend },
    ];

    // Create Yesterday Data
    let yesterdayBlipMax = 0;
    campaign.yesterday.forEach((yesterdayTotal: HourlyTotal) => {
      yesterdayBlips[yesterdayTotal.hour].value = yesterdayTotal.blips;
      yesterdaySpend[yesterdayTotal.hour].value = yesterdayTotal.spent;
      if (yesterdayTotal.blips > yesterdayBlipMax) {
        yesterdayBlipMax = yesterdayTotal.blips;
      }
    });
    this.yesterdayData = [
      { name: this.blipsText, series: yesterdayBlips },
      { name: this.spentText, series: yesterdaySpend },
    ];

    this.createYAxisTicks(
      monthlyBlipMax,
      dailyBlipMax,
      hourlyBlipMax,
      yesterdayBlipMax
    );
  }

  /**
   * Calculate the maximun Y axis mark for the daily and hourly graphs
   * @param dailyMax The max amount of blips for any given day
   * @param hourlyMax The max amount of blips for any given hour
   */
  private createYAxisTicks(
    monthlyMax: number,
    dailyMax: number,
    hourlyMax: number,
    yesterdayMax: number
  ): void {
    const monthlyNum = monthlyMax
      .toString()
      .split(/\d/)
      .join('0')
      .replace('0', '1');
    this.monthlyYAxisMax = Math.ceil(monthlyMax / +monthlyNum) * +monthlyNum;

    const dailyNum = dailyMax
      .toString()
      .split(/\d/)
      .join('0')
      .replace('0', '1');
    this.dailyYAxisMax = Math.ceil(dailyMax / +dailyNum) * +dailyNum;

    const hourlyNum = hourlyMax
      .toString()
      .split(/\d/)
      .join('0')
      .replace('0', '1');
    this.hourlyYAxisMax = Math.ceil(hourlyMax / +hourlyNum) * +hourlyNum;

    const yesterdayNum = yesterdayMax
      .toString()
      .split(/\d/)
      .join('0')
      .replace('0', '1');
    this.yesterdayYAxisMax =
      Math.ceil(yesterdayMax / +yesterdayNum) * +yesterdayNum;
  }
}
