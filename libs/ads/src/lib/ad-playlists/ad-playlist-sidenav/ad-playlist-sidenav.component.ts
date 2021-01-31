import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatAccordion } from '@angular/material/expansion';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import {
  DateTimeRangeRule,
  PlayListImage,
  PlaylistService,
  Rule,
  UrlBooleanRule,
} from '@marketplace/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-ad-playlist-sidenav',
  templateUrl: './ad-playlist-sidenav.component.html',
  styleUrls: ['./ad-playlist-sidenav.component.scss'],
})
export class AdPlaylistSidenavComponent
  implements AfterViewInit, OnDestroy, OnInit {
  private subscriptions = new Subscription();

  @ViewChild('accordion', { static: false }) accordion: MatAccordion;

  public ad: PlayListImage;
  public dateRangeForm = new FormGroup({
    startDate: new FormControl(null),
    startTime: new FormControl(null),
    endDate: new FormControl(null),
    endTime: new FormControl(null),
  });
  public hasSchedule: boolean;
  public openPanels: string[] = [];
  public webTriggerModel: UrlBooleanRule;
  public weeklyDailyModel: number[][];
  public zindex: boolean;

  constructor(
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.subscriptions.add(
      this.dateRangeForm.controls.startTime.valueChanges.subscribe(
        (value: string) => {
          if (value) {
            this.updateRules();
          }
        }
      )
    );

    this.subscriptions.add(
      this.dateRangeForm.controls.endTime.valueChanges.subscribe(
        (value: string) => {
          if (value) {
            this.updateRules();
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.playlistService.$playlistDetail.subscribe((ad: PlayListImage) => {
        this.ad = ad;
        if (ad) {
          ad.rules = ad.rules || {};
        }
        this.initializeSchedule(ad ? ad.rules : null);
        this.updateQueryParams(ad ? ad.index : null);
      })
    );
  }

  /**
   * Triggered when a date has been changed
   * @param type
   * @param event
   */
  public changeDateRange(
    type: 'start' | 'end',
    event: MatDatepickerInputEvent<any>
  ) {
    if (type === 'start') {
      if (!this.dateRangeForm.controls.startDate.value) {
        this.dateRangeForm.controls.startTime.setValue(null);
        this.dateRangeForm.controls.startTime.disable();
      } else {
        if (this.dateRangeForm.controls.startTime.disabled) {
          this.dateRangeForm.controls.startTime.enable();
        }
        if (!this.dateRangeForm.controls.startTime.value) {
          this.dateRangeForm.controls.startTime.setValue('00:00');
        }
      }
    } else {
      if (!this.dateRangeForm.controls.endDate.value) {
        this.dateRangeForm.controls.endTime.setValue(null);
        this.dateRangeForm.controls.endTime.disable();
      } else {
        if (this.dateRangeForm.controls.endTime.disabled) {
          this.dateRangeForm.controls.endTime.enable();
        }
        if (!this.dateRangeForm.controls.endTime.value) {
          this.dateRangeForm.controls.endTime.setValue('23:59');
        }
      }
    }

    this.updateRules();
  }

  /**
   * Has schedule changed on/off
   * @param change
   */
  public hasScheduleChange(change: MatSlideToggleChange) {
    this.hasSchedule = change.checked;
    if (!this.hasSchedule) {
      this.reset();
    }
  }

  /**
   * Initialize rules and open panels
   * @param rule
   */
  private initializeSchedule(rule?: Rule) {
    this.hasSchedule = false;
    this.webTriggerModel = null;
    this.weeklyDailyModel = [];
    this.zindex = false;
    this.openPanels = [];
    if (rule) {
      if (
        rule.DateTimeRange ||
        rule.UrlBoolean ||
        rule.WeeklyOnTimes ||
        rule.ZIndex
      ) {
        if (rule.DateTimeRange) {
          this.openPanels.push('DateTimeRange');
        }
        if (rule.WeeklyOnTimes) {
          this.openPanels.push('WeeklyOnTimes');
          if (rule.WeeklyOnTimes.on_ranges) {
            this.weeklyDailyModel = rule.WeeklyOnTimes.on_ranges;
          }
        }
        if (rule.UrlBoolean) {
          this.openPanels.push('UrlBoolean');
          this.webTriggerModel = rule.UrlBoolean;
        }
        this.zindex = rule.ZIndex ? true : false;
        this.hasSchedule = true;
      }
      this.parseOrResetTimes(rule.DateTimeRange);
    }
  }

  /**
   * Parse date and times for date and time pickers
   * @param timeRange
   */
  private parseOrResetTimes(timeRange?: DateTimeRangeRule) {
    if (timeRange) {
      if (!timeRange.start.includes('_')) {
        const start = timeRange.start.split(' ');
        this.dateRangeForm.controls.startDate.setValue(
          moment(start[0], 'YYYY-MMM-DD')
        );
        this.dateRangeForm.controls.startTime.setValue(start[1]);
      } else {
        this.dateRangeForm.controls.startDate.setValue(null);
        this.dateRangeForm.controls.startTime.setValue(null);
        this.dateRangeForm.controls.startTime.disable();
      }

      if (!timeRange.end.includes('_')) {
        const end = timeRange.end.split(' ');
        this.dateRangeForm.controls.endDate.setValue(
          moment(end[0], 'YYYY-MMM-DD')
        );
        this.dateRangeForm.controls.endTime.setValue(end[1]);
      } else {
        this.dateRangeForm.controls.endDate.setValue(null);
        this.dateRangeForm.controls.endTime.setValue(null);
        this.dateRangeForm.controls.endTime.disable();
      }
    } else {
      this.dateRangeForm.controls.startDate.setValue(null);
      this.dateRangeForm.controls.startTime.setValue(null);
      this.dateRangeForm.controls.startTime.disable();
      this.dateRangeForm.controls.endDate.setValue(null);
      this.dateRangeForm.controls.endTime.setValue(null);
      this.dateRangeForm.controls.endTime.disable();
    }
  }

  /**
   * Remove ad from playlist
   */
  public remove() {
    this.playlistService.viewPlaylistAdDelete(this.ad.id);
    this.playlistService.viewPlaylistAdDetails(null);
  }

  /**
   * Reset all rules and close all options
   */
  public reset() {
    this.ad.rules = null;
    this.weeklyDailyModel = [];
    this.zindex = false;
    this.parseOrResetTimes();
    this.accordion.closeAll();
  }

  /**
   * Time picker was changed for weekly/daily schedule
   */
  public timePickerChange(rule: number[][]) {
    this.weeklyDailyModel = rule;
    this.updateRules();
  }

  /**
   * Update the DateTimeRange object
   */
  private updateDateTime() {
    this.ad.rules.DateTimeRange = {
      start: this.dateRangeForm.controls.startDate.value
        ? `${this.dateRangeForm.controls.startDate.value.format(
            'YYYY-MMM-DD'
          )} ${this.dateRangeForm.controls.startTime.value}`
        : '_-_-_ _:_',
      end: this.dateRangeForm.controls.endDate.value
        ? `${this.dateRangeForm.controls.endDate.value.format('YYYY-MMM-DD')} ${
            this.dateRangeForm.controls.endTime.value
          }`
        : '_-_-_ _:_',
    };
  }

  /**
   * Create the new rules object for the ad
   */
  private updateRules() {
    this.ad.rules = {};

    if (
      this.dateRangeForm.controls.startDate.value ||
      this.dateRangeForm.controls.endDate.value
    ) {
      this.updateDateTime();
    }

    if (this.weeklyDailyModel.length) {
      this.ad.rules.WeeklyOnTimes = { on_ranges: this.weeklyDailyModel };
    }

    if (this.webTriggerModel) {
      this.ad.rules.UrlBoolean = this.webTriggerModel;
    }

    if (this.zindex) {
      this.ad.rules.ZIndex = { 'z-index': 1 };
    }
  }

  /**
   * Update the query params in the URL
   * @param ad
   */
  private updateQueryParams(id: number): void {
    this.router.navigate([], {
      queryParams: {
        da: id,
      },
      queryParamsHandling: 'merge',
    });
  }

  public webTriggerChange(rule: UrlBooleanRule) {
    this.webTriggerModel = rule;
    this.updateRules();
  }

  /**
   * Priority changed
   * @param change
   */
  public zindexChange(change: MatSlideToggleChange) {
    this.zindex = change.checked;
    this.updateRules();
  }
}
